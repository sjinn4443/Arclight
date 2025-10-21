require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3003;

// Trust proxy headers to correctly identify client IP when behind a proxy
app.set("trust proxy", 1);

const { generalRateLimiter } = require("./security/rateLimit.cjs");
const csp = require("./security/csp.cjs");
const corsMiddleware = require("./security/cors.cjs");
const {
  cookieParser,
  sessionMiddleware,
  csrfProtection,
} = require("./security/csrf.cjs");

const fs = require("fs");
const { enrichIp } = require("./utils/ipEnricher.cjs");

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
  app.use((req, res, next) => {
    if (req.path === "/track") return next();
    return csrfProtection(req, res, next);
  });
}

app.post("/track", async (req, res) => {
  // 1) Respond immediately (to prevent browser from disconnecting)
  res.status(204).end(); // 204 No Content, or 200+JSON if content is needed

  // For test environment, execute logging synchronously
  if (process.env.NODE_ENV === "test") {
    const ip = (
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      ""
    ).trim();
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

    fs.mkdirSync(path.join(__dirname, "logs"), { recursive: true });
    fs.appendFileSync(
      path.join(__dirname, "logs", "ip_logs.jsonl"),
      JSON.stringify(logEntry) + "\n",
    );
    console.log("TRACK_LOG:", JSON.stringify(logEntry));
  } else {
    // 2) Subsequent tasks run in the background for non-test environments
    setImmediate(async () => {
      try {
        const ip = (
          req.headers["x-forwarded-for"]?.split(",")[0] ||
          req.socket.remoteAddress ||
          ""
        ).trim();
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

        fs.mkdirSync(path.join(__dirname, "logs"), { recursive: true });
        fs.appendFile(
          path.join(__dirname, "logs", "ip_logs.jsonl"),
          JSON.stringify(logEntry) + "\n",
          (err) => {
            if (err) console.error("log write error:", err);
          },
        );

        console.log("TRACK_LOG:", JSON.stringify(logEntry));
        // (Optional) Asynchronously send to external storage…
      } catch (e) {
        console.error("track bg error:", e);
      }
    });
  }
});

// Fallback to index.html for SPA routing
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
