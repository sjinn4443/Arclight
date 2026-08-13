const { URL } = require("url");

function uniq(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function buildPolicy(directives) {
  return Object.entries(directives)
    .map(([name, values]) => [name, uniq(values)])
    .filter(([, values]) => values.length > 0)
    .map(([name, values]) => `${name} ${values.join(" ")}`)
    .join("; ");
}

function toOrigin(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    return url.origin;
  } catch {
    return null;
  }
}

function getNonceToken(nonce) {
  const trimmed = String(nonce || "").trim();
  return trimmed ? `'nonce-${trimmed}'` : null;
}

function getOptionalRuntimeOrigins() {
  return uniq([
    toOrigin(process.env.ARCLIGHT_SENTRY_BUNDLE_URL),
    toOrigin(process.env.SENTRY_BUNDLE_URL),
  ]);
}

function getOptionalTelemetryOrigins() {
  return uniq([
    toOrigin(process.env.ARCLIGHT_SENTRY_DSN),
    toOrigin(process.env.SENTRY_DSN),
  ]);
}

function mainAppPolicy(nonce) {
  const nonceToken = getNonceToken(nonce);
  return buildPolicy({
    "default-src": ["'self'"],
    "base-uri": ["'self'"],
    "manifest-src": ["'self'"],
    "object-src": ["'none'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'self'"],
    "script-src": [
      "'self'",
      nonceToken,
      "https://browser.sentry-cdn.com",
      ...getOptionalRuntimeOrigins(),
    ],
    "style-src": ["'self'", nonceToken, "https://fonts.googleapis.com"],
    "style-src-attr": ["'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:"],
    "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
    "connect-src": [
      "'self'",
      "https://api.bigdatacloud.net",
      "https://restcountries.com",
      ...getOptionalTelemetryOrigins(),
    ],
    "media-src": ["'self'", "blob:", "data:"],
    "frame-src": [
      "'self'",
      "https://www.youtube.com",
      "https://www.youtube-nocookie.com",
      "https://fundalreflex.netlify.app",
      "https://trauma26.netlify.app",
      "https://amsler2.netlify.app",
    ],
    "worker-src": ["'self'", "blob:"],
  });
}

function reportsPolicy(nonce) {
  const nonceToken = getNonceToken(nonce);
  return buildPolicy({
    "default-src": ["'self'"],
    "base-uri": ["'self'"],
    "manifest-src": ["'self'"],
    "object-src": ["'none'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "script-src": ["'self'", nonceToken],
    "style-src": ["'self'", nonceToken],
    "img-src": [
      "'self'",
      "data:",
      "https://a.tile.openstreetmap.org",
      "https://b.tile.openstreetmap.org",
      "https://c.tile.openstreetmap.org",
    ],
    "font-src": ["'self'", "data:"],
    "connect-src": ["'self'", "https://restcountries.com"],
    "worker-src": ["'self'", "blob:"],
  });
}

function applyMainAppCsp(req, res, next) {
  res.set("Content-Security-Policy", mainAppPolicy(res.locals?.cspNonce));
  next();
}

function applyReportsCsp(req, res, next) {
  res.set("Content-Security-Policy", reportsPolicy(res.locals?.cspNonce));
  res.set("X-Frame-Options", "DENY");
  next();
}

module.exports = {
  applyMainAppCsp,
  applyReportsCsp,
};
