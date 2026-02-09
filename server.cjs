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
const prod = process.env.NODE_ENV === "production";
// Allow serving the built/minified `dist/` assets even when NODE_ENV is not
// production (useful for running Lighthouse against localhost).
const serveDist =
  String(process.env.SERVE_DIST || "").toLowerCase() === "1" ||
  String(process.env.SERVE_DIST || "").toLowerCase() === "true";

const app = express();

const staticRoot = path.join(__dirname, prod || serveDist ? "dist" : "public");

// Use the port from the environment variable.
// In production (Railway/Docker), default to 8080 if PORT is absent.
const PORT = process.env.PORT || (prod ? 8080 : 3000);

// Behind Railway → needed for secure cookies, real client IPs, rate limits
app.set("trust proxy", 1);

const storage = require("./storage/index.cjs"); // auto-picks NDJSON or PG

app.use(express.json({ limit: "100kb" }));

// Static assets that are always safe to serve without auth.
app.use("/js", express.static(path.join(staticRoot, "js"))); // Prefer built js in prod
app.use("/favicons", express.static(path.join(staticRoot, "favicons"))); // Prefer built assets in prod

// Initialise storage (creates table locally on PG or folders for NDJSON)
let storageReady = false;

async function initStorageWithRetry() {
  const maxAttempts = 10;
  const baseDelayMs = 1000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await storage.init();
      storageReady = true;
      console.log(`[storage] init ok (attempt ${attempt})`);
      return;
    } catch (err) {
      console.error(`[storage] init failed (attempt ${attempt})`, err);

      // In tests, fail fast to surface problems
      if (process.env.NODE_ENV === "test") throw err;

      const delay = Math.min(baseDelayMs * 2 ** (attempt - 1), 15000);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  // After retries, keep server alive but mark storage as unavailable
  console.error(
    "[storage] init failed after retries; continuing without storage",
  );
}

initStorageWithRetry().catch((e) => {
  // This should only happen in test, but guard anyway
  console.error("[storage] initStorageWithRetry crashed", e);
});

initStorageWithRetry();

function requireStorage(req, res, next) {
  if (storageReady) return next();
  return res.status(503).json({ error: "storage unavailable" });
}

// --- Public app APIs ---
app.post("/api/app/profile", requireStorage, async (req, res) => {
  try {
    await storage.saveProfile(req.body || {});
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "save failed" });
  }
});

app.post("/api/app/refresh", requireStorage, async (req, res) => {
  try {
    await storage.bumpRefresh(req.body || {});
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "refresh failed" });
  }
});

// --- Dev dashboard (protected) ---
// In-memory rate limiter for attempts against the reports dev page only.
// Keeps a small sliding window per IP. This is intentionally simple and
// scoped to the basic auth check for reports so normal user actions are not rate limited.
const devDashboardAuthAttempts = new Map(); // ip -> [timestamps]
function basicAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Basic ") ? header.slice(6) : "";
  const [user, pass] = Buffer.from(token, "base64").toString("utf8").split(":");

  // Apply rate limiting only for requests attempting to access the reports pages
  const isReportsPath =
    req.path === "/reports.html" || req.path === "/html/reports.html";
  if (isReportsPath) {
    try {
      const ip = req.ip || req.connection?.remoteAddress || "unknown";
      const now = Date.now();
      const windowMs = 15 * 60 * 1000; // 15 minutes
      const maxAttempts = 10;
      const attempts = devDashboardAuthAttempts.get(ip) || [];
      // keep only recent entries inside the window
      const recent = attempts.filter((ts) => now - ts < windowMs);
      recent.push(now);
      devDashboardAuthAttempts.set(ip, recent);
      if (recent.length > maxAttempts) {
        // Too many attempts — signal client and do not disclose details
        res.set("Retry-After", String(Math.ceil(windowMs / 1000)));
        return res
          .status(429)
          .send("Too many authentication attempts. Please try again later.");
      }
    } catch (e) {
      // If rate limiter fails for some reason, continue to auth check (fail-open)
      console.error("[dev] rate limiter error", e && e.message ? e.message : e);
    }
  }

  // Perform password check. Do NOT log the supplied password or request body anywhere.
  if (pass && pass === process.env.DASHBOARD_PASSWORD) {
    // On success, clear recorded attempts for this IP to avoid locking the user out
    if (isReportsPath) {
      const ip = req.ip || req.connection?.remoteAddress || "unknown";
      devDashboardAuthAttempts.delete(ip);
    }
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="Arclight Dev Dashboard"');
  return res.status(401).send("Authentication required.");
}

// Protect the reports HTML pages so they are not publicly accessible
app.get("/reports.html", basicAuth, (req, res) => {
  return res.sendFile(path.join(staticRoot, "reports.html"));
});

app.get("/html/reports.html", basicAuth, (req, res) => {
  return res.sendFile(path.join(staticRoot, "html", "reports.html"));
});

app.get("/api/dev/users", basicAuth, async (req, res) => {
  try {
    const rows = await storage.getUsersForDashboard();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "read failed" });
  }
});

app.delete("/api/dev/users/:anonId", basicAuth, async (req, res) => {
  try {
    const anonId = String(req.params.anonId || "").trim();
    if (!anonId) return res.status(400).json({ error: "Missing anon_id" });

    const telemetryFilePath = path.join(
      __dirname,
      "reports",
      "data",
      "telemetry.ndjson",
    );
    let lines = [];
    try {
      const rawContent = await fsp.readFile(telemetryFilePath, "utf8");
      lines = rawContent.split("\n").filter(Boolean); // Filter out empty lines
    } catch (readErr) {
      if (readErr.code === "ENOENT") {
        // File does not exist, so no users to delete.
        return res.status(404).json({ error: "User not found" });
      }
      throw readErr;
    }

    let userFound = false;
    const filteredLines = lines.filter((line) => {
      try {
        const record = JSON.parse(line);
        if (record.anon_id === anonId) {
          userFound = true;
          return false; // Exclude this record
        }
        return true; // Keep other records
      } catch (parseErr) {
        console.error("Error parsing NDJSON line:", parseErr);
        return true; // Keep line if unparseable to avoid data loss
      }
    });

    if (!userFound) {
      return res.status(404).json({ error: "User not found" });
    }

    await fsp.writeFile(
      telemetryFilePath,
      filteredLines.join("\n") + "\n",
      "utf8",
    );
    return res.status(204).end();
  } catch (err) {
    console.error("[dev] delete user failed", err);
    return res.status(500).json({ error: "Failed to delete user" });
  }
});

// Serve remaining static files (HTML/CSS/images/etc). Must be AFTER the protected
// dev dashboard/report routes so Basic Auth is applied correctly.
app.use(express.static(staticRoot));

app.post("/track", requireStorage, async (req, res) => {
  try {
    const ip = req.ip;
    await storage.saveIp(ip);
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "save failed" });
  }
});

// --- Start server ---
let server;
if (require.main === module) {
  server = app.listen(PORT, HOST, () => {
    console.log(`Arclight app listening on http://${HOST}:${PORT}`);
  });
}

module.exports = { app, closeServer: () => server.close() };
