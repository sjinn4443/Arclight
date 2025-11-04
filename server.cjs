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

const app = express();

// Behind Railway → needed for secure cookies, real client IPs, rate limits
app.set("trust proxy", 1);

const storage = require("./storage/index.cjs"); // auto-picks NDJSON or PG

app.use(express.json({ limit: "100kb" }));
app.use("/js", express.static(path.join(__dirname, "public", "js"))); // Explicit route for /js
app.use(express.static(path.join(__dirname, "public")));

// Initialise storage (creates table locally on PG or folders for NDJSON)
storage.init().catch((err) => {
  console.error("Storage init failed", err);
  process.exit(1);
});

// --- Public app APIs ---
app.post("/api/app/profile", async (req, res) => {
  try {
    await storage.saveProfile(req.body || {});
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "save failed" });
  }
});

app.post("/api/app/refresh", async (req, res) => {
  try {
    await storage.bumpRefresh();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "refresh failed" });
  }
});

// --- Dev dashboard (protected) ---
function basicAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Basic ") ? header.slice(6) : "";
  const [user, pass] = Buffer.from(token, "base64").toString("utf8").split(":");
  if (pass && pass === process.env.DASHBOARD_PASSWORD) return next();
  res.set("WWW-Authenticate", 'Basic realm="Arclight Dev Dashboard"');
  return res.status(401).send("Authentication required.");
}

app.get("/api/dev/users", basicAuth, async (req, res) => {
  try {
    const rows = await storage.getUsersForDashboard();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "read failed" });
  }
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Arclight app listening on http://localhost:${PORT}`);
});

module.exports = app;
