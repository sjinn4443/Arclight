require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy headers to correctly identify client IP when behind a proxy
app.set("trust proxy", true);

const { generalRateLimiter } = require("./security/rateLimit.cjs");
const csp = require("./security/csp.cjs");
const corsMiddleware = require("./security/cors.cjs");
const {
  cookieParser,
  sessionMiddleware,
  csrfProtection,
} = require("./security/csrf.cjs");

const geoip = require("geoip-lite");
const fs = require("fs");

// ✅ 로그 파일 경로/디렉터리 보장
const LOG_FILE = path.join(__dirname, "logs", "ip_logs.jsonl");
fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });

console.log("__dirname:", __dirname);
console.log("Static path:", path.join(__dirname, "public"));
console.log("Index path:", path.join(__dirname, "public", "index.html"));

// Serve static files from the 'public' directory first
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  }),
);

// ✅ 이 줄 추가: JSON 바디 파싱 (CSRF 미들웨어보다 먼저!)
app.use(express.json());

// Apply the general rate limit to all requests
app.use(generalRateLimiter);

// Apply CSP
app.use(csp);

// Apply CORS allowlist
app.use(corsMiddleware);

// Apply cookie-parser, session, and CSRF protection
// Apply cookie-parser, session, and CSRF protection only if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.use(cookieParser);
  app.use(sessionMiddleware);
  app.use(csrfProtection);
}

app.post("/track", (req, res) => {
  // Determine the client IP address
  // X-Forwarded-For header is the standard for identifying the originating IP address through proxies.
  // We take the first IP in the list, as it's the most upstream.
  // Fallback to req.socket.remoteAddress if the header is not present.
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  // Perform geolocation lookup
  const geo = geoip.lookup(ip);

  // Prepare log entry
  const logEntry = {
    timestamp: new Date().toISOString(),
    ip: ip,
    geo: geo, // Contains country, region, city, etc.
  };

  // Log to ip_logs.jsonl file
  fs.appendFile(LOG_FILE, JSON.stringify(logEntry) + "\n", (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
      // Send an error response to the client
      return res.status(500).send("Error logging tracking data.");
    }
    // ✅ Railway 대시보드의 View logs에서 바로 보이게 콘솔 출력
    console.log("TRACK_LOG:", JSON.stringify(logEntry));
    // Send a success response to the client
    res.status(200).send("Tracking data received.");
  });
});

// Fallback to index.html for SPA routing
// 관리자용 원시 로그 보기 (절대로 공개 엔드포인트로 두지 마세요)
app.get("/admin/logs", (req, res) => {
  if (req.headers.authorization !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(403).send("Forbidden");
  }
  if (!fs.existsSync(LOG_FILE)) return res.type("text/plain").send("");
  const content = fs.readFileSync(LOG_FILE, "utf8");
  res.type("text/plain").send(content);
});

app.get("*", (req, res) => {
  // Pass the CSRF token to the client-side
  res.cookie("XSRF-TOKEN", req.csrfToken());
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
