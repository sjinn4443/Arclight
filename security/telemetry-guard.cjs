const crypto = require("crypto");
const path = require("path");

const {
  getTelemetryAllowedHosts,
  getRequestHost,
  isTelemetryWriteAllowed,
} = require("./telemetry-policy.cjs");

const TELEMETRY_SESSION_COOKIE = "arclight_telemetry_session";
const TELEMETRY_HEADER = "x-arclight-telemetry";
const TELEMETRY_META_NAME = "arclight-telemetry-token";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function resolveTelemetrySecret() {
  const candidates = [
    process.env.TELEMETRY_TOKEN_SECRET,
    process.env.APP_SECRET,
    process.env.SESSION_SECRET,
    process.env.ENCRYPTION_SECRET,
    process.env.DASHBOARD_PASSWORD,
  ];

  for (const candidate of candidates) {
    const trimmed = String(candidate || "").trim();
    if (trimmed) return trimmed;
  }

  if (
    process.env.NODE_ENV === "production" &&
    getTelemetryAllowedHosts().length
  ) {
    throw new Error(
      "TELEMETRY_TOKEN_SECRET, APP_SECRET, SESSION_SECRET, ENCRYPTION_SECRET, or DASHBOARD_PASSWORD is required when production telemetry is enabled",
    );
  }

  return `ephemeral:${crypto.randomBytes(32).toString("hex")}`;
}

const TELEMETRY_SECRET = resolveTelemetrySecret();

function toBase64Url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value) {
  const normalized = String(value || "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );
  return Buffer.from(padded, "base64");
}

function createRandomSessionId() {
  return toBase64Url(crypto.randomBytes(24));
}

function parseCookies(header) {
  const cookies = {};
  const raw = String(header || "");
  if (!raw) return cookies;

  for (const segment of raw.split(";")) {
    const trimmed = segment.trim();
    if (!trimmed) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!key) continue;
    cookies[key] = decodeURIComponent(value);
  }

  return cookies;
}

function readTelemetrySessionId(req) {
  const cookies = parseCookies(req?.headers?.cookie);
  const raw = String(cookies[TELEMETRY_SESSION_COOKIE] || "").trim();
  return /^[A-Za-z0-9_-]{20,128}$/.test(raw) ? raw : null;
}

function signTelemetryPayload(sessionId, host, expiresAt) {
  return toBase64Url(
    crypto
      .createHmac("sha256", TELEMETRY_SECRET)
      .update(`${sessionId}.${host}.${expiresAt}`)
      .digest(),
  );
}

function createTelemetryToken(sessionId, host, now = Date.now()) {
  const expiresAt = now + TOKEN_TTL_MS;
  const signature = signTelemetryPayload(sessionId, host, expiresAt);
  return `v1.${expiresAt}.${signature}`;
}

function safeCompare(a, b) {
  const left = Buffer.from(String(a || ""));
  const right = Buffer.from(String(b || ""));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function verifyTelemetryToken(token, sessionId, host, now = Date.now()) {
  const parts = String(token || "")
    .trim()
    .split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;

  const expiresAt = Number(parts[1]);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) return false;
  if (expiresAt > now + TOKEN_TTL_MS + 60 * 1000) return false;

  const expected = signTelemetryPayload(sessionId, host, expiresAt);
  return safeCompare(parts[2], expected);
}

function originMatchesHost(value, expectedHost) {
  try {
    const url = new URL(String(value || "").trim());
    return url.hostname.toLowerCase() === expectedHost;
  } catch {
    return false;
  }
}

function hasSameOriginProof(req, host) {
  const secFetchSite = String(req.headers["sec-fetch-site"] || "")
    .trim()
    .toLowerCase();
  if (
    secFetchSite &&
    !["same-origin", "same-site", "none"].includes(secFetchSite)
  ) {
    return false;
  }

  const origin = String(req.headers.origin || "").trim();
  if (origin) return originMatchesHost(origin, host);

  const referer = String(req.headers.referer || "").trim();
  if (referer) return originMatchesHost(referer, host);

  return false;
}

function requestLooksHtmlLike(req) {
  if (req.method !== "GET" && req.method !== "HEAD") return false;

  const requestPath =
    String(req.path || req.originalUrl || "").split("?")[0] || "/";
  if (requestPath === "/" || requestPath.toLowerCase().endsWith(".html"))
    return true;
  if (path.extname(requestPath)) return false;

  const accept = String(req.headers.accept || "").toLowerCase();
  return accept.includes("text/html");
}

function ensureTelemetryState(req, res, next) {
  if (!requestLooksHtmlLike(req) || !isTelemetryWriteAllowed(req))
    return next();

  const host = getRequestHost(req);
  if (!host) return next();

  let sessionId = readTelemetrySessionId(req);
  if (!sessionId) {
    sessionId = createRandomSessionId();
    res.cookie(TELEMETRY_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      maxAge: SESSION_MAX_AGE_MS,
      path: "/",
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  res.locals.telemetryToken = createTelemetryToken(sessionId, host);
  next();
}

function evaluateTelemetryWriteRequest(req) {
  if (!isTelemetryWriteAllowed(req)) {
    return {
      allowed: false,
      mode: "silent_skip",
      reason: "host_not_allowed",
    };
  }

  const host = getRequestHost(req);
  if (!host) {
    return {
      allowed: false,
      mode: "forbidden",
      reason: "missing_host",
    };
  }

  if (!hasSameOriginProof(req, host)) {
    return {
      allowed: false,
      mode: "forbidden",
      reason: "origin_mismatch",
    };
  }

  const sessionId = readTelemetrySessionId(req);
  if (!sessionId) {
    return {
      allowed: false,
      mode: "forbidden",
      reason: "missing_session",
    };
  }

  const headerValue = String(req.headers[TELEMETRY_HEADER] || "").trim();
  if (!headerValue || !verifyTelemetryToken(headerValue, sessionId, host)) {
    return {
      allowed: false,
      mode: "forbidden",
      reason: "invalid_token",
    };
  }

  return {
    allowed: true,
    mode: "allow",
    reason: null,
  };
}

module.exports = {
  TELEMETRY_HEADER,
  TELEMETRY_SESSION_COOKIE,
  TELEMETRY_META_NAME,
  createTelemetryToken,
  ensureTelemetryState,
  evaluateTelemetryWriteRequest,
};
