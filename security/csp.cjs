function uniq(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function buildPolicy(directives) {
  return Object.entries(directives)
    .map(([name, values]) => `${name} ${uniq(values).join(" ")}`)
    .join("; ");
}

function mainAppPolicy() {
  return buildPolicy({
    "default-src": ["'self'"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      "https://browser.sentry-cdn.com",
      "https://unpkg.com",
    ],
    "style-src": [
      "'self'",
      "'unsafe-inline'",
      "https://unpkg.com",
      "https://fonts.googleapis.com",
    ],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "font-src": [
      "'self'",
      "data:",
      "https://fonts.gstatic.com",
      "https://cdnjs.cloudflare.com",
    ],
    "connect-src": [
      "'self'",
      "https://browser.sentry-cdn.com",
      "https://*.ingest.de.sentry.io",
      "https://api.bigdatacloud.net",
      "https://ipinfo.io",
      "https://restcountries.com",
    ],
    "media-src": ["'self'", "blob:", "data:", "https:"],
    "frame-src": [
      "'self'",
      "https://www.youtube.com",
      "https://www.youtube-nocookie.com",
      "https://*.netlify.app",
    ],
    "worker-src": ["'self'", "blob:"],
  });
}

function reportsPolicy() {
  return buildPolicy({
    "default-src": ["'self'"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "script-src": ["'self'", "'unsafe-inline'", "https://unpkg.com"],
    "style-src": ["'self'", "'unsafe-inline'", "https://unpkg.com"],
    "img-src": ["'self'", "data:", "https://*.tile.openstreetmap.org"],
    "font-src": ["'self'", "data:"],
    "connect-src": ["'self'", "https://restcountries.com"],
  });
}

function applyMainAppCsp(req, res, next) {
  res.set("Content-Security-Policy", mainAppPolicy());
  next();
}

function applyReportsCsp(req, res, next) {
  res.set("Content-Security-Policy", reportsPolicy());
  res.set("X-Frame-Options", "DENY");
  next();
}

module.exports = {
  applyMainAppCsp,
  applyReportsCsp,
};
