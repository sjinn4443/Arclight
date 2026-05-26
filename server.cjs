require("dotenv").config();
const {
  installSafeConsole,
  logServerError,
  sanitizeStructuredLogPayload,
} = require("./security/safe-logging.cjs");

installSafeConsole();

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const fs = require("fs");
const crypto = require("crypto");
const { execSync } = require("child_process");
const { applyMainAppCsp, applyReportsCsp } = require("./security/csp.cjs");
const {
  sensitiveRateLimiter,
  telemetryProfileRateLimiter,
  telemetryRefreshRateLimiter,
  trackingRateLimiter,
} = require("./security/rateLimit.cjs");
const {
  injectNonceIntoHtml,
  resolveStaticHtmlFile,
  sendHtmlFileWithNonce,
} = require("./security/html-response.cjs");
const {
  getRequestHost,
  isLocalHost,
  sanitizeTelemetryPayload,
} = require("./security/telemetry-policy.cjs");
const {
  ensureTelemetryState,
  evaluateTelemetryWriteRequest,
} = require("./security/telemetry-guard.cjs");

const fetchImpl =
  typeof global.fetch === "function"
    ? global.fetch.bind(global)
    : require("node-fetch");

const HOST = process.env.HOST || "0.0.0.0";
const prod = process.env.NODE_ENV === "production";
const serveDist =
  String(process.env.SERVE_DIST || "").toLowerCase() === "1" ||
  String(process.env.SERVE_DIST || "").toLowerCase() === "true";

function resolveStaticRootDir() {
  const envCandidate = String(
    process.env.STATIC_ROOT_DIR || process.env.BUILD_OUTPUT_DIR || "",
  ).trim();
  if (!envCandidate) {
    return path.join(__dirname, prod || serveDist ? "dist" : "public");
  }
  return path.isAbsolute(envCandidate)
    ? envCandidate
    : path.join(__dirname, envCandidate);
}

const app = express();
app.disable("x-powered-by");

const staticRoot = resolveStaticRootDir();
const rootRobotsPath = path.join(__dirname, "robots.txt");
const rootSitemapPath = path.join(__dirname, "sitemap.xml");

const OFFLINE_ASSET_EXCLUDED_FILENAMES = new Set([".DS_Store", "Thumbs.db"]);

function toStaticAssetUrl(rootDir, filePath) {
  const relativePath = path.relative(rootDir, filePath);
  if (
    !relativePath ||
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath)
  ) {
    return null;
  }

  return `/${relativePath
    .split(path.sep)
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

function collectOfflineAssetManifest(rootDir) {
  const resolvedRoot = path.resolve(rootDir);
  const urls = [];
  let bytes = 0;

  function walk(dir) {
    const entries = fs
      .readdirSync(dir, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      if (OFFLINE_ASSET_EXCLUDED_FILENAMES.has(entry.name)) continue;

      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
        continue;
      }

      if (!entry.isFile()) continue;

      const url = toStaticAssetUrl(resolvedRoot, entryPath);
      if (!url) continue;

      const stat = fs.statSync(entryPath);
      bytes += stat.size;
      urls.push(url);
    }
  }

  walk(resolvedRoot);

  return {
    bytes,
    count: urls.length,
    urls,
  };
}

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

const EMERGENCY_MODE_OFF = "off";
const EMERGENCY_MODE_READONLY = "readonly";
const EMERGENCY_MODE_EMERGENCY = "emergency";
const EMERGENCY_MODE_MAINTENANCE_ALIAS = "maintenance";
const EMERGENCY_MODE_LOCKDOWN = "lockdown";
const VALID_EMERGENCY_MODES = new Set([
  EMERGENCY_MODE_OFF,
  EMERGENCY_MODE_READONLY,
  EMERGENCY_MODE_EMERGENCY,
  EMERGENCY_MODE_MAINTENANCE_ALIAS,
  EMERGENCY_MODE_LOCKDOWN,
]);
const DEFAULT_EMERGENCY_MESSAGE =
  "We\u2019re currently performing maintenance. Some features may be unavailable.";

function getEmergencyMode() {
  const raw = String(process.env.EMERGENCY_MODE || "")
    .trim()
    .toLowerCase();
  if (!VALID_EMERGENCY_MODES.has(raw)) return EMERGENCY_MODE_OFF;
  if (raw === EMERGENCY_MODE_MAINTENANCE_ALIAS) return EMERGENCY_MODE_EMERGENCY;
  return raw;
}

function getEmergencyMessage(mode = getEmergencyMode()) {
  const trimmed = String(process.env.EMERGENCY_MESSAGE || "").trim();
  if (trimmed) return trimmed;
  if (mode === EMERGENCY_MODE_LOCKDOWN) {
    return "Access is temporarily restricted while maintenance is in progress. Please try again later.";
  }
  return DEFAULT_EMERGENCY_MESSAGE;
}

function normalizeClientIp(value) {
  const raw = String(value || "")
    .trim()
    .toLowerCase();
  if (!raw) return "unknown";
  if (raw.startsWith("::ffff:")) return raw.slice(7);
  return raw;
}

function parseAllowedIps(value) {
  return String(value || "")
    .split(",")
    .map((entry) => normalizeClientIp(entry))
    .filter((entry) => entry && entry !== "unknown");
}

function getClientIp(req) {
  return normalizeClientIp(
    req.ip || req.connection?.remoteAddress || "unknown",
  );
}

function isPrivateIp(ip) {
  const value = normalizeClientIp(ip);
  return (
    !value ||
    value === "::1" ||
    value === "127.0.0.1" ||
    value.startsWith("10.") ||
    value.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(value) ||
    value.startsWith("fc") ||
    value.startsWith("fd")
  );
}

function getAdminAllowedIps() {
  return parseAllowedIps(process.env.ADMIN_ALLOWED_IPS);
}

function isAdminRoute(req) {
  return (
    req.path === "/reports.html" ||
    req.path === "/html/reports.html" ||
    req.path.startsWith("/api/dev")
  );
}

function isPublicApiOrTrackRoute(req) {
  return (
    req.path === "/track" ||
    (req.path.startsWith("/api/") && !req.path.startsWith("/api/dev"))
  );
}

function isEmergencyWriteRoute(req) {
  return (
    (req.method === "POST" &&
      (req.path === "/api/app/profile" ||
        req.path === "/api/app/refresh" ||
        req.path === "/track")) ||
    (req.method === "DELETE" && req.path.startsWith("/api/dev/users/"))
  );
}

function requestAcceptsHtml(req) {
  if (req.path === "/" || req.path.endsWith(".html")) return true;
  if (path.extname(req.path || "")) return false;
  return req.accepts(["html", "json", "text"]) === "html";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderNotFoundPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Not Found</title>
  </head>
  <body>
    <main>
      <h1>Not Found</h1>
      <p>The requested resource could not be found.</p>
    </main>
  </body>
  </html>`;
}

function getEmergencyPageConfig(mode = getEmergencyMode()) {
  if (mode === EMERGENCY_MODE_LOCKDOWN) {
    return {
      badge: "Restricted Access",
      title: "Arclight Restricted Access",
      heading: "Access to Arclight app is temporarily restricted.",
      backgroundGlow: "rgba(185, 28, 28, 0.12)",
      backgroundStart: "#f6f2ed",
      backgroundEnd: "#eee8df",
      panel: "rgba(255, 255, 255, 0.94)",
      text: "#172033",
      muted: "#536072",
      accent: "#b91c1c",
      border: "rgba(23, 32, 51, 0.08)",
      shadow: "0 30px 90px rgba(23, 32, 51, 0.14)",
      badgeBackground: "rgba(185, 28, 28, 0.1)",
    };
  }

  return {
    badge: "Maintenance",
    title: "Arclight Maintenance",
    heading: "Arclight is temporarily unavailable.",
    backgroundGlow: "rgba(185, 28, 28, 0.11)",
    backgroundStart: "#f7f3ee",
    backgroundEnd: "#efebe4",
    panel: "rgba(255, 255, 255, 0.95)",
    text: "#142033",
    muted: "#536174",
    accent: "#b91c1c",
    border: "rgba(20, 32, 51, 0.08)",
    shadow: "0 32px 90px rgba(20, 32, 51, 0.14)",
    badgeBackground: "rgba(185, 28, 28, 0.1)",
  };
}

function renderEmergencyPage(mode = getEmergencyMode()) {
  const config = getEmergencyPageConfig(mode);
  const message = escapeHtml(getEmergencyMessage(mode));
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${config.title}</title>
    <style>
      :root {
        color-scheme: light;
        --bg-start: ${config.backgroundStart};
        --bg-end: ${config.backgroundEnd};
        --panel: ${config.panel};
        --text: ${config.text};
        --muted: ${config.muted};
        --accent: ${config.accent};
        --border: ${config.border};
        --shadow: ${config.shadow};
        --glow: ${config.backgroundGlow};
        --badge-bg: ${config.badgeBackground};
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background:
          radial-gradient(circle at 50% 18%, var(--glow), transparent 38%),
          linear-gradient(160deg, var(--bg-start) 0%, var(--bg-end) 100%);
        color: var(--text);
        font-family: Inter, "Segoe UI", Arial, sans-serif;
      }
      main {
        width: min(100%, 638px);
        padding: clamp(32px, 5vw, 42px);
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--panel);
        box-shadow: var(--shadow);
      }
      h1 {
        margin: 0 0 12px;
        max-width: 520px;
        font-size: clamp(2.25rem, 5vw, 3.25rem);
        font-weight: 800;
        line-height: 1.05;
        letter-spacing: 0;
      }
      p {
        margin: 0;
        max-width: 560px;
        color: var(--muted);
        font-size: 1.02rem;
        line-height: 1.7;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 18px;
        padding: 10px 14px;
        border-radius: 999px;
        background: var(--badge-bg);
        color: var(--accent);
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: currentColor;
      }
    </style>
  </head>
  <body>
    <main>
      <div class="badge"><span class="dot"></span>${config.badge}</div>
      <h1>${config.heading}</h1>
      <p>${message}</p>
    </main>
  </body>
  </html>`;
}

function logStructuredEvent(event, req, extra = {}) {
  const payload = sanitizeStructuredLogPayload({
    ts: new Date().toISOString(),
    event,
    mode: getEmergencyMode(),
    method: req?.method || null,
    path: req?.path || req?.originalUrl || null,
    ip: req ? getClientIp(req) : null,
    host: req ? getRequestHost(req) : null,
    ...extra,
  });
  console.log(JSON.stringify(payload));
}

function sendEmergencyHtml(req, res, mode = getEmergencyMode()) {
  res.status(503);
  res.set("Cache-Control", "no-store");
  res.type("html");
  if (req.method === "HEAD") return res.end();
  return res.send(
    injectNonceIntoHtml(renderEmergencyPage(mode), res.locals?.cspNonce),
  );
}

function sendEmergencyJson(req, res, mode = getEmergencyMode()) {
  res.status(503);
  res.set("Cache-Control", "no-store");
  return res.json({
    error: "security_maintenance",
    message: getEmergencyMessage(mode),
    emergencyMode: mode,
  });
}

function sendEmergencyText(req, res, mode = getEmergencyMode()) {
  res.status(503);
  res.set("Cache-Control", "no-store");
  res.type("text/plain");
  if (req.method === "HEAD") return res.end();
  return res.send(getEmergencyMessage(mode));
}

function isAdminIpAllowed(req) {
  if (process.env.NODE_ENV !== "production") return true;
  const allowedIps = getAdminAllowedIps();
  if (!allowedIps.length) return false;
  return allowedIps.includes(getClientIp(req));
}

function requireAdminIp(req, res, next) {
  if (isAdminIpAllowed(req)) return next();
  logStructuredEvent("admin_ip_blocked", req);
  return res.status(403).send("Forbidden.");
}

function emergencyGate(req, res, next) {
  const mode = getEmergencyMode();
  if (mode === EMERGENCY_MODE_OFF || req.path === "/healthz") return next();

  logStructuredEvent("emergency_mode_active", req);

  if (mode === EMERGENCY_MODE_READONLY) {
    if (isEmergencyWriteRoute(req)) {
      logStructuredEvent("emergency_block", req, {
        reason: "readonly_write_block",
        responseType: "json",
      });
      return sendEmergencyJson(req, res, mode);
    }
    return next();
  }

  if (isAdminRoute(req)) return next();

  if (isPublicApiOrTrackRoute(req)) {
    logStructuredEvent("emergency_block", req, {
      reason: `${mode}_api_block`,
      responseType: "json",
    });
    return sendEmergencyJson(req, res, mode);
  }

  if (requestAcceptsHtml(req)) {
    logStructuredEvent("emergency_block", req, {
      reason: `${mode}_html_block`,
      responseType: "html",
    });
    return sendEmergencyHtml(req, res, mode);
  }

  logStructuredEvent("emergency_block", req, {
    reason: `${mode}_asset_block`,
    responseType: "text",
  });
  return sendEmergencyText(req, res, mode);
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
  if (getEmergencyMode() !== EMERGENCY_MODE_OFF) return false;
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
  res.locals.cspNonce = crypto.randomBytes(16).toString("base64");
  next();
});
app.use((req, res, next) => {
  res.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.set("Permissions-Policy", "geolocation=(self), camera=(), microphone=()");
  next();
});
app.use(applyMainAppCsp);
app.use(["/reports.html", "/html/reports.html", "/api/dev"], applyReportsCsp);
app.use(
  ["/reports.html", "/html/reports.html", "/api/dev"],
  sensitiveRateLimiter,
);
app.use(emergencyGate);
app.use(express.json({ limit: "100kb" }));
app.use(ensureTelemetryState);

app.get("/api/app/offline-assets", (req, res) => {
  try {
    const manifest = collectOfflineAssetManifest(staticRoot);
    res.set("Cache-Control", "no-store");
    return res.json(manifest);
  } catch (error) {
    logServerError("[offline-assets] failed to collect static assets", error);
    return res.status(500).json({ error: "Failed to collect offline assets" });
  }
});

app.use("/js", express.static(path.join(staticRoot, "js")));
app.use("/favicons", express.static(path.join(staticRoot, "favicons")));
app.get("/robots.txt", (req, res, next) => {
  if (!fs.existsSync(rootRobotsPath)) return next();
  return res.sendFile(rootRobotsPath);
});
app.get("/sitemap.xml", (req, res, next) => {
  if (!fs.existsSync(rootSitemapPath)) return next();
  return res.sendFile(rootSitemapPath);
});

async function initStorageWithRetry() {
  const maxAttempts = 10;
  const baseDelayMs = 1500;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await storage.init();
      console.log(`[storage] init ok (attempt ${attempt})`);
      return;
    } catch (err) {
      logServerError("[storage] init failed", err, {
        attempt,
        maxAttempts,
      });
      const delay = baseDelayMs * attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  console.error(
    "[storage] init failed permanently; continuing without DB-backed telemetry.",
  );
}

initStorageWithRetry();

function telemetryWriteGuard(req, res, next) {
  const decision = evaluateTelemetryWriteRequest(req);
  res.locals.telemetryWriteDecision = decision;

  if (decision.allowed || decision.mode === "silent_skip") return next();

  logStructuredEvent("telemetry_write_blocked", req, {
    reason: decision.reason,
  });
  return res.status(403).json({
    error: "telemetry_forbidden",
    reason: decision.reason,
  });
}

app.get("/healthz", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ ok: true, emergencyMode: getEmergencyMode() });
});

app.get("/api/app/version", (req, res) => {
  const currentVersion = resolveCurrentAppVersion();
  res.set("Cache-Control", "no-store");
  res.json({
    versionDate: currentVersion.versionDate,
    versionSequence: currentVersion.versionSequence,
  });
});

app.post(
  "/api/app/profile",
  telemetryWriteGuard,
  telemetryProfileRateLimiter,
  async (req, res) => {
    try {
      const payload = sanitizeTelemetryPayload(req.body || {});
      if (!res.locals.telemetryWriteDecision?.allowed) {
        return res.json({ ok: true, stored: false });
      }

      await storage.saveProfile(payload);
      return res.json({ ok: true, stored: true });
    } catch (error) {
      logServerError("[api/app/profile] save failed", error);
      return res.status(500).json({ error: "save failed" });
    }
  },
);

app.post(
  "/api/app/refresh",
  telemetryWriteGuard,
  telemetryRefreshRateLimiter,
  async (req, res) => {
    try {
      const payload = sanitizeTelemetryPayload(req.body || {});
      if (!res.locals.telemetryWriteDecision?.allowed) {
        return res.json({ ok: true, stored: false });
      }

      await storage.bumpRefresh(payload);
      return res.json({ ok: true, stored: true });
    } catch (error) {
      logServerError("[api/app/refresh] save failed", error);
      return res.status(500).json({ error: "refresh failed" });
    }
  },
);

app.get("/api/location/ip", async (req, res) => {
  try {
    const payload = await lookupIpLocation(getClientIp(req));
    res.set("Cache-Control", "no-store");
    return res.json(payload);
  } catch (error) {
    logServerError("[location] lookup failed", error);
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
      logStructuredEvent("admin_auth_failed", req, {
        reason: "rate_limited",
      });
      return res
        .status(429)
        .send("Too many authentication attempts. Please try again later.");
    }
  } catch (error) {
    logServerError("[dev] rate limiter error", error);
  }

  if (pass && pass === process.env.DASHBOARD_PASSWORD) {
    const ip = getClientIp(req);
    devDashboardAuthAttempts.delete(ip);
    req.auth = { user: user || "dashboard" };
    return next();
  }

  logStructuredEvent("admin_auth_failed", req, {
    reason: pass ? "invalid_password" : "missing_credentials",
  });
  res.set("WWW-Authenticate", 'Basic realm="Arclight Dev Dashboard"');
  return res.status(401).send("Authentication required.");
}

const adminAccess = [requireAdminIp, basicAuth];

app.get("/reports.html", adminAccess, (req, res) => {
  res.set("Cache-Control", "no-store");
  return sendHtmlFileWithNonce(req, res, path.join(staticRoot, "reports.html"));
});

app.get("/html/reports.html", adminAccess, (req, res) => {
  res.set("Cache-Control", "no-store");
  return sendHtmlFileWithNonce(
    req,
    res,
    path.join(staticRoot, "html", "reports.html"),
  );
});

app.get("/api/dev/users", adminAccess, async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    res.set("X-Reports-Delete-Enabled", canDeleteReports(req) ? "1" : "0");
    const rows = await storage.getUsersForDashboard();
    return res.json(rows);
  } catch (error) {
    logServerError("[api/dev/users] read failed", error);
    return res.status(500).json({ error: "read failed" });
  }
});

app.delete("/api/dev/users/:anonId", adminAccess, async (req, res) => {
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
    logServerError("[dev] delete user failed", error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
});

app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();

  const htmlFile = resolveStaticHtmlFile(staticRoot, req.path);
  if (!htmlFile || !fs.existsSync(htmlFile)) return next();

  return sendHtmlFileWithNonce(req, res, htmlFile);
});

app.use(express.static(staticRoot));

app.post(
  "/track",
  telemetryWriteGuard,
  trackingRateLimiter,
  async (req, res) => {
    try {
      if (!res.locals.telemetryWriteDecision?.allowed) {
        return res.status(204).end();
      }

      await storage.saveIp(getClientIp(req));
      return res.status(204).end();
    } catch (error) {
      logServerError("[track] save failed", error);
      return res.status(204).end();
    }
  },
);

app.use((req, res) => {
  res.set("Cache-Control", "no-store");

  if (req.path === "/track" || req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "Not found" });
  }

  if (requestAcceptsHtml(req)) {
    res.status(404);
    res.type("html");
    if (req.method === "HEAD") return res.end();
    return res.send(renderNotFoundPage());
  }

  res.status(404);
  res.type("text/plain");
  if (req.method === "HEAD") return res.end();
  return res.send("Not found.");
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
