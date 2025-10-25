require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

// Quick sanity logs (keep them)
console.log(
  "BOOT => NODE_ENV:",
  process.env.NODE_ENV,
  "PORT env:",
  process.env.PORT,
  "resolved:",
  PORT,
);

// Behind Railway's proxy so set trust proxy for secure cookies, req.ip, rate limits
app.set("trust proxy", 1);

const {
  generalRateLimiter,
  sensitiveRateLimiter,
} = require("./security/rateLimit.cjs");
const csp = require("./security/csp.cjs");
const redis = require("redis");
// Support both modern and older connect-redis shapes
let RedisStore;
try {
  // Modern (v6/v7+): named export
  ({ RedisStore } = require("connect-redis"));
} catch {
  // Fallbacks: older CJS default or module itself is the constructor
  const cr = require("connect-redis");
  RedisStore = cr.default || cr;
}
const cors = require("cors");
const session = require("express-session");
const crypto = require("crypto");

const { cookieParser, csrfProtection } = require("./security/csrf.cjs");

const fs = require("fs");
const { enrichIp } = require("./utils/ipEnricher.cjs");
const devRouter = require("./dev_dashboard/routes/dev.cjs");
const requireDevAuth = require("./security/requireDevAuth.cjs"); // Import requireDevAuth
const os = require("os"); // Import os module

// On Railway, write logs to /tmp which is ephemeral storage
let _logFile =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "logs", "ip_logs.jsonl")
    : path.join(__dirname, "logs", "ip_logs.jsonl");

// Function to get the current log file path
function getLogFilePath() {
  return _logFile;
}

// Function to allow tests to set the log file path
function setLogFileForTesting(testLogFilePath) {
  _logFile = testLogFilePath;
  // In test environment, the test runner is responsible for creating the directory.
  // We do not call fs.mkdirSync here to avoid conflicts with test setup.
}

// Only create the default log directory if not in test environment
if (process.env.NODE_ENV !== "test") {
  fs.mkdirSync(path.dirname(_logFile), { recursive: true });
}

console.log("__dirname:", __dirname);
console.log("Static path:", path.join(__dirname, "public"));
console.log("Index path:", path.join(__dirname, "public", "index.html"));

// static + index FIRST
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  }),
);
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Add a health endpoint and use it for Railway’s healthcheck
app.get("/health", (_req, res) => res.status(200).send("OK"));

app.use(express.json());

// Apply the general rate limit to all requests
app.use(generalRateLimiter);

// Apply CSP
app.use(csp);

app.get("/healthz", (req, res) => res.status(200).send("ok"));
app.get("/readyz", (req, res) => {
  // optionally confirm Redis if using
  res.status(200).json({ up: true });
});

// Apply CORS allowlist
const allowed = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, cb) =>
      !origin || allowed.includes(origin)
        ? cb(null, true)
        : cb(new Error("CORS blocked")),
    credentials: true,
  }),
);

const prod = process.env.NODE_ENV === "production";

// Initialize Redis only if we have REDIS_URL (recommended for prod)
const useRedis = !!process.env.REDIS_URL;
let redisClient = null;
if (useRedis) {
  redisClient = redis.createClient({ url: process.env.REDIS_URL });
  redisClient.on("error", (err) => console.error("Redis Client Error", err));
  redisClient.connect().catch((e) => console.error("Redis connect failed:", e));
}

// Apply cookie-parser, session, and CSRF protection only if not in test
if (process.env.NODE_ENV !== "test") {
  app.use(cookieParser());
  app.use(
    session({
      // Use RedisStore when available, otherwise fallback to MemoryStore
      ...(useRedis && RedisStore && redisClient
        ? { store: new RedisStore({ client: redisClient }) }
        : (process.env.NODE_ENV === "production"
            ? console.warn(
                "[session] Using MemoryStore in production — set REDIS_URL for persistence.",
              )
            : null,
          {})),
      secret:
        process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
      resave: false,
      saveUninitialized: false,
      name: "sid",
      cookie: {
        httpOnly: true,
        secure: prod,
        sameSite: prod ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    }),
  );
  app.use((req, res, next) => {
    if (
      req.path === "/track" ||
      req.path === "/healthz" ||
      req.path === "/readyz"
    )
      return next();
    return csrfProtection(req, res, next);
  });
}

// THEN protect /dev only (not global!)
if (process.env.NODE_ENV !== "production") {
  app.use(
    "/dev",
    express.urlencoded({ extended: false }),
    requireDevAuth, // your password gate
    devRouter,
  );
  console.log("[dev] dev router loaded (only in non-production environments)");
}

app.post("/track", sensitiveRateLimiter, async (req, res) => {
  // In a test environment, we write the log synchronously and wait for it to
  // finish before sending the response. This makes tests deterministic.
  if (process.env.NODE_ENV === "test") {
    // Prefer X-Forwarded-For (first IP), fall back to X-Real-IP, then socket
    const xfwd = req.get("x-forwarded-for");
    const real = req.get("x-real-ip");
    const ip =
      (xfwd && xfwd.split(",")[0].trim()) ||
      (real && real.trim()) ||
      (req.socket?.remoteAddress || "").replace(/^::ffff:/, ""); // normalize IPv4-mapped IPv6
    const coords = req.body?.coords || null;

    // enrichIp is mocked in tests/tracking.test.js
    const geo = await enrichIp(ip);

    const logEntry = {
      timestamp: new Date().toISOString(),
      ip,
      geo,
      coords,
      ua: req.headers["user-agent"] || null,
    };

    fs.appendFileSync(getLogFilePath(), JSON.stringify(logEntry) + "\n");
    return res.status(204).end();
  }

  // In production/development, we respond immediately to avoid delaying the
  // client, and perform logging/enrichment in the background.
  res.status(204).end();

  // Prefer X-Forwarded-For (first IP), fall back to X-Real-IP, then socket
  const xfwd = req.get("x-forwarded-for");
  const real = req.get("x-real-ip");
  const ip =
    (xfwd && xfwd.split(",")[0].trim()) ||
    (real && real.trim()) ||
    (req.socket?.remoteAddress || "").replace(/^::ffff:/, ""); // normalize IPv4-mapped IPv6
  const coords = req.body?.coords || null;

  const withTimeout = async (p, ms = 1500) => {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), ms);
    try {
      return await p(ac.signal);
    } finally {
      clearTimeout(t);
    }
  };

  const ipinfo = (signal) =>
    fetch(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`, {
      signal,
    }).then((r) => (r.ok ? r.json() : Promise.reject()));
  const bigdata = (signal) =>
    fetch(
      `https://api.bigdatacloud.net/data/ip-geolocation-full?ip=${ip}&key=${process.env.BDCLOUD_KEY}`,
      { signal },
    ).then((r) => (r.ok ? r.json() : Promise.reject()));

  let geo;
  try {
    const d = await withTimeout(ipinfo, 1500);
    const [lat, lon] = (d.loc || "").split(",");
    geo = {
      source: "ipinfo",
      country: d.country,
      city: d.city,
      region: d.region,
      lat,
      lon,
      timezone: d.timezone,
      org: d.org,
    };
  } catch {
    try {
      const d2 = await withTimeout(bigdata, 1500);
      geo = {
        source: "bigdatacloud",
        country: d2?.country?.isoName,
        city: d2?.city?.name,
        lat: d2?.location?.latitude,
        lon: d2?.location?.longitude,
        timezone: d2?.location?.timeZone?.ianaTimeId,
        org: d2?.network?.organisation,
      };
    } catch {
      const geoip = require("geoip-lite"); // Require geoip-lite here to avoid global import issues with mocking
      const g = geoip.lookup(ip) || null;
      geo = {
        source: "geoip-lite",
        country: g?.country || null,
        city: g?.city || null,
        lat: g?.ll?.[0],
        lon: g?.ll?.[1],
        timezone: g?.timezone || null,
      };
    }
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    ip,
    geo,
    coords,
    ua: req.headers["user-agent"] || null,
  };

  // In non-test environments, ensure the directory exists before writing.
  fs.mkdirSync(path.dirname(getLogFilePath()), { recursive: true });
  fs.appendFileSync(getLogFilePath(), JSON.stringify(logEntry) + "\n", "utf8");
});

// Fallback to index.html for SPA routing
app.get("/admin/logs", (req, res) => {
  if (req.headers.authorization !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(403).send("Forbidden");
  }
  if (!fs.existsSync(getLogFilePath())) return res.type("text/plain").send("");
  const content = fs.readFileSync(getLogFilePath(), "utf8");
  res.type("text/plain").send(content);
});

app.get("*", (req, res) => {
  // Pass the CSRF token to the client-side
  res.cookie("XSRF-TOKEN", req.csrfToken());
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;
module.exports.setLogFileForTesting = setLogFileForTesting;
module.exports.getLogFilePath = getLogFilePath;

const server = require("http").createServer(app);
process.on("SIGTERM", () => {
  console.log("SIGTERM received: closing server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
  // Optionally, set a timeout to force-exit
  setTimeout(() => process.exit(1), 10000).unref();
});

if (require.main === module) {
  server.listen(PORT, "0.0.0.0", () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Server listening on 0.0.0.0:${PORT} (visit ${url} locally)`);
  });
}
