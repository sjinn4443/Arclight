require("dotenv").config();
const express = require("express");
const path = require("path");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const http = require("http");
const fs = require("fs"); // Import fs for file operations
const fsp = require("fs").promises; // Import fs.promises for async file operations

// Bind to the dynamic port Railway gives you; fall back only if truly absent.
const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || "0") || 3000;
const prod = process.env.NODE_ENV === "production";

const app = express();

// Behind Railway → needed for secure cookies, real client IPs, rate limits
app.set("trust proxy", 1);

// --- Static ---------------------------------------------------------------
const STATIC_ROOT = process.env.STATIC_ROOT || path.join(__dirname, "public");
console.log("__dirname:", __dirname);
console.log("Static path:", STATIC_ROOT);
console.log("Index path:", path.join(STATIC_ROOT, "index.html"));
app.use(express.static(STATIC_ROOT, { etag: true, lastModified: true }));

// --- Parsers --------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Middleware to set a default remoteAddress for testing if not present
if (process.env.NODE_ENV === "test") {
  app.use((req, res, next) => {
    if (!req.socket.remoteAddress) {
      req.socket.remoteAddress = "127.0.0.1"; // Default IP for tests
    }
    next();
  });
}

// --- Sessions (single source of truth) -----------------------------------
// (If you previously configured sessions in csrf.cjs, remove it there.)
let RedisStore;
try {
  ({ RedisStore } = require("connect-redis"));
} catch {
  const cr = require("connect-redis");
  RedisStore = cr.default || cr;
}
const { createClient } = require("redis");
const haveRedis = !!process.env.REDIS_URL;
let store;
if (haveRedis && RedisStore && createClient) {
  const redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.on("error", (e) => console.error("Redis Client Error", e));
  redisClient.connect().catch((e) => console.error("Redis connect failed:", e));
  store = new RedisStore({ client: redisClient });
} else if (prod) {
  console.warn(
    "[session] Using MemoryStore in production — set REDIS_URL for persistence.",
  );
}
app.use(
  session({
    name: "sid",
    secret:
      process.env.SESSION_SECRET ||
      (process.env.NODE_ENV === "test"
        ? "test-secret"
        : crypto.randomBytes(32).toString("hex")), // Use a test secret for tests, or generate a random one if not set
    resave: false,
    saveUninitialized: false,
    store,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: prod,
      sameSite: prod ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

// --- Security middlewares -------------------------------------------------
// CORS
const allowed = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.RAILWAY_PUBLIC_DOMAIN &&
    `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`,
  process.env.RAILWAY_URL, // e.g. https://arclight.up.railway.app
];
const allowPatterns = [/^https:\/\/.*\.up\.railway\.app$/]; // any Railway subdomain

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // allow health checks / curl / same-origin
    if (allowed.filter(Boolean).includes(origin)) return cb(null, true);
    if (allowPatterns.some((rx) => rx.test(origin))) return cb(null, true);
    return cb(new Error("CORS blocked"));
  },
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-CSRF-Token", "Authorization"],
};
app.use(require("cors")(corsOptions));

// Helmet (CSP)
const helmet = require("helmet");
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:"],
        connectSrc: [
          "'self'",
          "http://localhost:3000",
          "http://127.0.0.1:3000",
          process.env.RAILWAY_URL || "https://arclight.up.railway.app",
          // optional if you ever use websockets/HMR in dev:
          "ws://localhost:3000",
          "ws://127.0.0.1:3000",
        ].filter(Boolean),
        frameAncestors: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// --- CSRF -----------------------------------------------------------------
// CSRF: mount AFTER session/cookies
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: false });

// Skip CSRF for health checks and for `/track` (anonymous beacon)
// You can also skip in tests entirely by NODE_ENV or an explicit TESTING=true flag.
const csrfSkipper = (req, res, next) => {
  if (
    req.path === "/healthz" ||
    req.path === "/readyz" ||
    req.path === "/track" || // <— exemption fixes your 403s
    process.env.NODE_ENV === "test" ||
    process.env.TESTING === "true"
  )
    return next();
  return csrfProtection(req, res, next);
};
app.use(csrfSkipper);

// Optional helper so SPA can fetch a token when needed
app.get("/csrf-token", (req, res) => {
  try {
    res.json({ csrfToken: req.csrfToken() });
  } catch {
    res.json({ csrfToken: null });
  }
});

// --- Rate limiting (general on all, sensitive on specific) ---------------
const {
  generalRateLimiter,
  sensitiveRateLimiter,
} = require("./security/rateLimit.cjs");
const ipEnricher = require("./utils/ipEnricher.cjs"); // Import the ipEnricher module

// Determine the log file path. The test mocks path.join to redirect this.
// We'll use path.join here, assuming the test setup will intercept it.
const LOG_FILE = path.join(__dirname, "logs", "ip_logs.jsonl");

// Ensure the log directory exists
if (!fs.existsSync(path.join(__dirname, "logs"))) {
  fs.mkdirSync(path.join(__dirname, "logs"));
}

app.use(generalRateLimiter);
app.post("/track", sensitiveRateLimiter, async (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  console.log(`[TRACK] Received request for IP: ${ip}`); // Debug log
  let enrichedData;
  try {
    enrichedData = await ipEnricher.enrichIp(ip);
    console.log(`[TRACK] Enriched data for ${ip}:`, enrichedData); // Debug log
  } catch (error) {
    console.error(`[TRACK] Error enriching IP ${ip}:`, error);
    enrichedData = { error: "IP enrichment failed" };
  }

  const logEntry = {
    ip: ip,
    geo: enrichedData,
    timestamp: new Date().toISOString(),
  };
  console.log(`[TRACK] Log entry:`, logEntry); // Debug log

  // Append the log entry to the file
  try {
    await fsp.appendFile(LOG_FILE, JSON.stringify(logEntry) + "\n");
    console.log(`[TRACK] Successfully wrote to ${LOG_FILE}`); // Debug log
  } catch (err) {
    console.error("[TRACK] Failed to write to ip_logs.jsonl:", err); // Debug log
  }

  res.status(204).end();
});

// --- Health ---------------------------------------------------------------
app.get("/healthz", (_req, res) => res.status(200).send("ok"));
app.get("/readyz", (_req, res) => res.status(200).json({ up: true }));

// --- Routes & SPA fallback ------------------------------------------------
// ... your API routes first
const INDEX_HTML = path.join(STATIC_ROOT, "index.html");
app.use(express.static(STATIC_ROOT, { fallthrough: true }));
app.get("*", (req, res) => {
  try {
    return res.sendFile(INDEX_HTML);
  } catch {
    // Last-ditch: still return 200 so Railway’s probe doesn’t mark it dead
    return res.status(200).send("ok");
  }
});

// Graceful server
const server = http.createServer(app);
server.on("error", (err) => {
  console.error("[server] listen error:", err && err.code ? err.code : err);
});
if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log(
      `BOOT => NODE_ENV: ${process.env.NODE_ENV} PORT env: ${process.env.PORT} resolved: ${PORT}`,
    );
    console.log(
      `Server listening on ${HOST}:${PORT} (visit http://localhost:${PORT} locally)`,
    );
  });
}
process.on("SIGTERM", () => {
  console.log("SIGTERM received: closing server");
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
});

module.exports = app;
