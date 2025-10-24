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

// trust proxy helps cookies/sessions behind proxies (not required for 502, but good)
app.set("trust proxy", 1);

const { generalRateLimiter } = require("./security/rateLimit.cjs");
const csp = require("./security/csp.cjs");
const corsMiddleware = require("./security/cors.cjs");
const session = require("express-session");
const connectRedis = require("connect-redis");
const { createClient } = require("redis");

const { cookieParser, csrfProtection } = require("./security/csrf.cjs");

const fs = require("fs");
const { enrichIp } = require("./utils/ipEnricher.cjs");
const devRouter = require("./dev_dashboard/routes/dev.cjs");
const requireDevAuth = require("./security/requireDevAuth.cjs"); // Import requireDevAuth
const os = require("os"); // Import os module

let _logFile = path.join(__dirname, "logs", "ip_logs.jsonl");

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

// Apply CORS allowlist
app.use(corsMiddleware);

let sessionStore;

// Redis 설정 제거 (Remove Redis configuration)
if (process.env.REDIS_URL) {
  console.log("Using Redis for session store");
  const RedisStore = connectRedis(session);
  const redisClient = createClient({
    url: process.env.REDIS_URL,
    legacyMode: true,
  });
  redisClient.connect().catch(console.error);
  sessionStore = new RedisStore({ client: redisClient });
} else {
  console.warn("REDIS_URL not found - using default MemoryStore");
  sessionStore = undefined; // express-session의 기본 MemoryStore 사용
}

// Apply cookie-parser, session, and CSRF protection only if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.use(cookieParser());
  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || "fallback-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      },
    }),
  );
  app.use((req, res, next) => {
    if (req.path === "/track") return next();
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

app.post("/track", async (req, res) => {
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

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Server listening on 0.0.0.0:${PORT} (visit ${url} locally)`);
  });
}
