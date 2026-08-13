const crypto = require("crypto");
const path = require("path");

const {
  getRequestHost,
  isTelemetryWriteAllowed,
} = require("./telemetry-policy.cjs");

const TELEMETRY_SESSION_COOKIE = "arclight_telemetry_session";
const TELEMETRY_HEADER = "x-arclight-telemetry";
const TELEMETRY_META_NAME = "arclight-telemetry-token";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function resolveTelemetrySecret() {
  const secret = String(process.env.TELEMETRY_TOKEN_SECRET || "").trim();
  if (secret.length < 32) {
    throw new Error(
      "TELEMETRY_TOKEN_SECRET is required and must be at least 32 characters",
    );
  }
  return secret;
}

const TELEMETRY_SECRET = resolveTelemetrySecret();

function toBase64Url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createRandomSessionId() {
  return toBase64Url(crypto.randomBytes(24));
}

function signTelemetrySessionId(sessionId) {
  return toBase64Url(
    crypto
      .createHmac("sha256", TELEMETRY_SECRET)
      .update(`session.${sessionId}`)
      .digest(),
  );
}

function createTelemetrySessionCookieValue(
  sessionId = createRandomSessionId(),
) {
  const normalized = String(sessionId || "").trim();
  if (!/^[A-Za-z0-9_-]{20,128}$/.test(normalized)) {
    throw new Error("Invalid telemetry session identifier");
  }
  return `v1.${normalized}.${signTelemetrySessionId(normalized)}`;
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
  const parts = raw.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return null;

  const sessionId = parts[1];
  if (!/^[A-Za-z0-9_-]{20,128}$/.test(sessionId)) return null;
  const expected = signTelemetrySessionId(sessionId);
  return safeCompare(parts[2], expected) ? sessionId : null;
}

function deriveTelemetrySubjectId(sessionId) {
  const digest = toBase64Url(
    crypto
      .createHmac("sha256", TELEMETRY_SECRET)
      .update(`subject.${sessionId}`)
      .digest(),
  );
  return `session_${digest}`;
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

function normalizeAuthority(value, protocol) {
  let authority = String(value || "")
    .trim()
    .toLowerCase();
  if (protocol === "https:" && authority.endsWith(":443")) {
    authority = authority.slice(0, -4);
  }
  if (protocol === "http:" && authority.endsWith(":80")) {
    authority = authority.slice(0, -3);
  }
  return authority;
}

function originMatchesRequest(value, req, expectedHost) {
  try {
    const url = new URL(String(value || "").trim());
    if (!["http:", "https:"].includes(url.protocol)) return false;
    if (url.hostname.toLowerCase() !== expectedHost) return false;
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
      return false;
    }

    const requestAuthority = normalizeAuthority(
      req?.headers?.host,
      url.protocol,
    );
    return (
      Boolean(requestAuthority) &&
      normalizeAuthority(url.host, url.protocol) === requestAuthority
    );
  } catch {
    return false;
  }
}

function hasSameOriginProof(req, host) {
  const secFetchSite = String(req.headers["sec-fetch-site"] || "")
    .trim()
    .toLowerCase();
  if (secFetchSite && secFetchSite !== "same-origin") {
    return false;
  }

  const origin = String(req.headers.origin || "").trim();
  if (origin) return originMatchesRequest(origin, req, host);

  const referer = String(req.headers.referer || "").trim();
  if (referer) return originMatchesRequest(referer, req, host);

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
    res.cookie(
      TELEMETRY_SESSION_COOKIE,
      createTelemetrySessionCookieValue(sessionId),
      {
        httpOnly: true,
        maxAge: SESSION_MAX_AGE_MS,
        path: "/",
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
      },
    );
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
    subjectId: deriveTelemetrySubjectId(sessionId),
  };
}

module.exports = {
  TELEMETRY_HEADER,
  TELEMETRY_SESSION_COOKIE,
  TELEMETRY_META_NAME,
  createTelemetrySessionCookieValue,
  createTelemetryToken,
  deriveTelemetrySubjectId,
  ensureTelemetryState,
  evaluateTelemetryWriteRequest,
};
