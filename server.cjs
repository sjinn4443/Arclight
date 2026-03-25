require("dotenv").config();
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const fs = require("fs");
const { execSync } = require("child_process");
const { applyMainAppCsp, applyReportsCsp } = require("./security/csp.cjs");
const {
  getRequestHost,
  isLocalHost,
  isTelemetryWriteAllowed,
  sanitizeTelemetryPayload,
} = require("./security/telemetry-policy.cjs");

const fetchImpl =
  typeof global.fetch === "function"
    ? global.fetch.bind(global)
    : require("node-fetch");

const HOST = process.env.HOST || "0.0.0.0";
const prod = process.env.NODE_ENV === "production";
const serveDist =
  String(process.env.SERVE_DIST || "").toLowerCase() === "1" ||
  String(process.env.SERVE_DIST || "").toLowerCase() === "true";

const app = express();
app.disable("x-powered-by");

const staticRoot = path.join(__dirname, prod || serveDist ? "dist" : "public");

function toIsoDateString(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return null;
  const plainOrIsoLike = /^(\d{4}-\d{2}-\d{2})(?:$|[T\s])/.exec(trimmed);
  if (plainOrIsoLike) return plainOrIsoLike[1];

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

function parsePositiveInt(value) {
  const raw = String(value ?? "").trim();
  if (!/^\d+$/.test(raw)) return null;
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

function getIsoDateFromMtime(filePath) {
  try {
    const stat = fs.statSync(filePath);
    if (!stat || Number.isNaN(stat.mtimeMs)) return null;
    return new Date(stat.mtimeMs).toISOString().slice(0, 10);
  } catch {
    return null;
  }
}

function resolveVersionMetadataFromVersionFile() {
  const candidatePaths = [
    path.join(staticRoot, "version.json"),
    path.join(__dirname, "dist", "version.json"),
    path.join(__dirname, "public", "version.json"),
    path.join(__dirname, "version.json"),
  ];

  let best = null;
  for (const p of candidatePaths) {
    try {
      const raw = fs.readFileSync(p, "utf8");
      const payload = JSON.parse(raw);
      const versionDate = toIsoDateString(payload?.versionDate);
      if (!versionDate) continue;

      const versionSequence =
        parsePositiveInt(
          payload?.versionSequence ??
            payload?.pushNumber ??
            payload?.buildNumber,
        ) || null;

      const value = {
        versionDate,
        versionSequence,
      };
      if (!best) {
        best = value;
        continue;
      }

      const valueSeq = value.versionSequence || 0;
      const bestSeq = best.versionSequence || 0;
      if (value.versionDate > best.versionDate) {
        best = value;
        continue;
      }
      if (value.versionDate === best.versionDate && valueSeq > bestSeq) {
        best = value;
      }
    } catch {
      // Ignore invalid or missing version files.
    }
  }

  return best;
}

function resolveVersionDateFromStaticFiles() {
  const candidatePaths = [
    path.join(staticRoot, "index.html"),
    path.join(staticRoot, "js", "main.js"),
    path.join(staticRoot, "js", "menu.js"),
    path.join(staticRoot, "html", "menu.html"),
  ];

  let latestMs = -1;
  for (const p of candidatePaths) {
    try {
      const stat = fs.statSync(p);
      if (stat.mtimeMs > latestMs) latestMs = stat.mtimeMs;
    } catch {
      // Ignore missing files.
    }
  }

  if (latestMs < 0) return null;
  return new Date(latestMs).toISOString().slice(0, 10);
}

function resolveAppVersionDate(versionMetadataFromFile = null) {
  const envCandidates = [
    process.env.APP_VERSION_DATE,
    process.env.APP_PUSH_DATE,
    process.env.SOURCE_COMMIT_DATE,
    process.env.COMMIT_DATE,
  ];

  for (const candidate of envCandidates) {
    const normalized = toIsoDateString(candidate);
    if (normalized) return normalized;
  }

  if (versionMetadataFromFile?.versionDate) {
    return versionMetadataFromFile.versionDate;
  }

  try {
    const gitIso = execSync("git log -1 --format=%cI", {
      cwd: __dirname,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
    const normalized = toIsoDateString(gitIso);
    if (normalized) return normalized;
  } catch {
    // Ignore git lookup errors.
  }

  const staticDate = resolveVersionDateFromStaticFiles();
  if (staticDate) return staticDate;

  const packageDate = getIsoDateFromMtime(path.join(__dirname, "package.json"));
  if (packageDate) return packageDate;

  return null;
}

function resolveVersionSequenceFromGit(versionDate) {
  if (!versionDate) return null;

  try {
    const gitCommitDates = execSync("git log --first-parent --format=%cI", {
      cwd: __dirname,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    })
      .trim()
      .split(/\r?\n/)
      .filter(Boolean);

    let count = 0;
    for (const commitIso of gitCommitDates) {
      if (toIsoDateString(commitIso) === versionDate) count += 1;
    }
    return count > 0 ? count : null;
  } catch {
    return null;
  }
}

function resolveAppVersionSequence(
  versionDate,
  versionMetadataFromFile = null,
) {
  const envCandidates = [
    process.env.APP_VERSION_SEQUENCE,
    process.env.APP_PUSH_NUMBER,
  ];

  for (const candidate of envCandidates) {
    const normalized = parsePositiveInt(candidate);
    if (normalized) return normalized;
  }

  const metadataCount =
    versionMetadataFromFile?.versionDate === versionDate
      ? parsePositiveInt(versionMetadataFromFile?.versionSequence)
      : null;

  const gitCount = resolveVersionSequenceFromGit(versionDate);
  if (metadataCount && gitCount) return Math.max(metadataCount, gitCount);
  if (metadataCount) return metadataCount;
  if (gitCount) return gitCount;

  return 1;
}

function resolveCurrentAppVersion() {
  const versionMetadataFromFile = resolveVersionMetadataFromVersionFile();
  const versionDate = resolveAppVersionDate(versionMetadataFromFile);
  const versionSequence = resolveAppVersionSequence(
    versionDate,
    versionMetadataFromFile,
  );
  return { versionDate, versionSequence };
}

function isEnabled(value) {
  return ["1", "true", "yes", "on"].includes(
    String(value || "")
      .trim()
      .toLowerCase(),
  );
}

function getClientIp(req) {
  return req.ip || req.connection?.remoteAddress || "unknown";
}

function isPrivateIp(ip) {
  const value = String(ip || "")
    .trim()
    .toLowerCase();
  return (
    !value ||
    value === "::1" ||
    value === "127.0.0.1" ||
    value === "::ffff:127.0.0.1" ||
    value.startsWith("10.") ||
    value.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(value) ||
    value.startsWith("fc") ||
    value.startsWith("fd")
  );
}

function countryNameFromCode(code) {
  const iso2 = String(code || "")
    .trim()
    .toUpperCase();
  if (!iso2) return null;

  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(iso2) || iso2;
  } catch {
    return iso2;
  }
}

function parseIpInfoPayload(payload) {
  const [rawLat, rawLon] = String(payload?.loc || "")
    .split(",")
    .map((value) => Number.parseFloat(value));
  const lat = Number.isFinite(rawLat) ? rawLat : null;
  const lon = Number.isFinite(rawLon) ? rawLon : null;
  const countryCode = String(payload?.country || "")
    .trim()
    .toUpperCase();
  const city = String(payload?.city || "").trim() || null;

  return {
    source: "ipinfo",
    countryCode: countryCode || null,
    countryName: countryNameFromCode(countryCode),
    city,
    lat,
    lon,
    area: city,
  };
}

function parseBigDataCloudPayload(payload) {
  const rawLat = Number.parseFloat(payload?.latitude);
  const rawLon = Number.parseFloat(payload?.longitude);
  const lat = Number.isFinite(rawLat) ? rawLat : null;
  const lon = Number.isFinite(rawLon) ? rawLon : null;
  const countryCode = String(payload?.countryCode || "")
    .trim()
    .toUpperCase();
  const city =
    String(
      payload?.city ||
        payload?.locality ||
        payload?.principalSubdivisionLocality ||
        "",
    ).trim() || null;

  return {
    source: "bigdatacloud",
    countryCode: countryCode || null,
    countryName:
      String(payload?.countryName || "").trim() ||
      countryNameFromCode(countryCode),
    city,
    lat,
    lon,
    area: city,
  };
}

async function fetchJson(url) {
  const response = await fetchImpl(url, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`upstream ${response.status}`);
  }
  return response.json();
}

async function lookupIpLocation(ip) {
  if (isPrivateIp(ip)) {
    return {
      source: "fallback",
      countryCode: "GB",
      countryName: "United Kingdom",
      city: null,
      lat: null,
      lon: null,
      area: null,
    };
  }

  const encodedIp = encodeURIComponent(String(ip || "").trim());
  const candidates = [];
  if (process.env.IPINFO_TOKEN) {
    candidates.push({
      url: `https://ipinfo.io/${encodedIp}/json?token=${encodeURIComponent(process.env.IPINFO_TOKEN)}`,
      parser: parseIpInfoPayload,
    });
  }
  candidates.push({
    url: `https://ipinfo.io/${encodedIp}/json`,
    parser: parseIpInfoPayload,
  });
  candidates.push({
    url: `https://api.bigdatacloud.net/data/ip-geolocation?ip=${encodedIp}&localityLanguage=en`,
    parser: parseBigDataCloudPayload,
  });

  for (const candidate of candidates) {
    try {
      const payload = await fetchJson(candidate.url);
      const parsed = candidate.parser(payload);
      if (parsed.countryCode || parsed.city || parsed.lat != null) {
        return parsed;
      }
    } catch {
      // Try the next provider.
    }
  }

  return {
    source: "fallback",
    countryCode: "GB",
    countryName: "United Kingdom",
    city: null,
    lat: null,
    lon: null,
    area: null,
  };
}

function canDeleteReports(req) {
  if (isEnabled(process.env.REPORTS_ALLOW_DELETE)) return true;

  const host = getRequestHost(req);
  if (isLocalHost(host)) {
    return isEnabled(process.env.REPORTS_ALLOW_LOCAL_DELETE);
  }

  return false;
}

const PORT = process.env.PORT || (prod ? 8080 : 3000);

app.set("trust proxy", 1);

const storage = require("./storage/index.cjs");

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    hsts: prod
      ? {
          maxAge: 15552000,
          includeSubDomains: true,
          preload: false,
        }
      : false,
  }),
);
app.use((req, res, next) => {
  res.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.set("Permissions-Policy", "geolocation=(self), camera=(), microphone=()");
  next();
});
app.use(applyMainAppCsp);
app.use(["/reports.html", "/html/reports.html", "/api/dev"], applyReportsCsp);
app.use(express.json({ limit: "100kb" }));

app.use("/js", express.static(path.join(staticRoot, "js")));
app.use("/favicons", express.static(path.join(staticRoot, "favicons")));

async function initStorageWithRetry() {
  const maxAttempts = 10;
  const baseDelayMs = 1500;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await storage.init();
      console.log(`[storage] init ok (attempt ${attempt})`);
      return;
    } catch (err) {
      console.error(
        `[storage] init failed (attempt ${attempt}/${maxAttempts})`,
        err,
      );
      const delay = baseDelayMs * attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  console.error(
    "[storage] init failed permanently; continuing without DB-backed telemetry.",
  );
}

initStorageWithRetry();

app.get("/api/app/version", (req, res) => {
  const currentVersion = resolveCurrentAppVersion();
  res.set("Cache-Control", "no-store");
  res.json({
    versionDate: currentVersion.versionDate,
    versionSequence: currentVersion.versionSequence,
  });
});

app.post("/api/app/profile", async (req, res) => {
  try {
    const payload = sanitizeTelemetryPayload(req.body || {});
    if (!isTelemetryWriteAllowed(req)) {
      return res.json({ ok: true, stored: false });
    }

    await storage.saveProfile(payload);
    return res.json({ ok: true, stored: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "save failed" });
  }
});

app.post("/api/app/refresh", async (req, res) => {
  try {
    const payload = sanitizeTelemetryPayload(req.body || {});
    if (!isTelemetryWriteAllowed(req)) {
      return res.json({ ok: true, stored: false });
    }

    await storage.bumpRefresh(payload);
    return res.json({ ok: true, stored: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "refresh failed" });
  }
});

app.get("/api/location/ip", async (req, res) => {
  try {
    const payload = await lookupIpLocation(getClientIp(req));
    res.set("Cache-Control", "no-store");
    return res.json(payload);
  } catch (error) {
    console.error("[location] lookup failed", error);
    return res.status(500).json({ error: "lookup failed" });
  }
});

const devDashboardAuthAttempts = new Map();
function basicAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Basic ") ? header.slice(6) : "";
  let user = "";
  let pass = "";

  try {
    [user, pass] = Buffer.from(token, "base64").toString("utf8").split(":");
  } catch {
    user = "";
    pass = "";
  }

  try {
    const ip = getClientIp(req);
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const maxAttempts = 10;
    const attempts = devDashboardAuthAttempts.get(ip) || [];
    const recent = attempts.filter((ts) => now - ts < windowMs);
    recent.push(now);
    devDashboardAuthAttempts.set(ip, recent);
    if (recent.length > maxAttempts) {
      res.set("Retry-After", String(Math.ceil(windowMs / 1000)));
      return res
        .status(429)
        .send("Too many authentication attempts. Please try again later.");
    }
  } catch (error) {
    console.error(
      "[dev] rate limiter error",
      error && error.message ? error.message : error,
    );
  }

  if (pass && pass === process.env.DASHBOARD_PASSWORD) {
    const ip = getClientIp(req);
    devDashboardAuthAttempts.delete(ip);
    req.auth = { user: user || "dashboard" };
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="Arclight Dev Dashboard"');
  return res.status(401).send("Authentication required.");
}

app.get("/reports.html", basicAuth, (req, res) => {
  res.set("Cache-Control", "no-store");
  return res.sendFile(path.join(staticRoot, "reports.html"));
});

app.get("/html/reports.html", basicAuth, (req, res) => {
  res.set("Cache-Control", "no-store");
  return res.sendFile(path.join(staticRoot, "html", "reports.html"));
});

app.get("/api/dev/users", basicAuth, async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    res.set("X-Reports-Delete-Enabled", canDeleteReports(req) ? "1" : "0");
    const rows = await storage.getUsersForDashboard();
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "read failed" });
  }
});

app.delete("/api/dev/users/:anonId", basicAuth, async (req, res) => {
  try {
    if (!canDeleteReports(req)) {
      return res.status(403).json({ error: "Reports delete is disabled" });
    }

    const anonId = String(req.params.anonId || "").trim();
    if (!anonId) return res.status(400).json({ error: "Missing anon_id" });

    const deleted = await storage.deleteUserForDashboard(anonId, {
      user: req.auth?.user || "dashboard",
      ip: getClientIp(req),
      host: getRequestHost(req),
      environment: process.env.NODE_ENV || "development",
    });

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(204).end();
  } catch (error) {
    console.error("[dev] delete user failed", error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
});

app.use(express.static(staticRoot));

app.post("/track", async (req, res) => {
  try {
    if (!isTelemetryWriteAllowed(req)) {
      return res.status(204).end();
    }

    await storage.saveIp(getClientIp(req));
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "save failed" });
  }
});

let server;
if (require.main === module) {
  server = app.listen(PORT, HOST, () => {
    console.log(`Arclight app listening on http://${HOST}:${PORT}`);
  });
}

module.exports = {
  app,
  closeServer: () => server?.close(),
};
