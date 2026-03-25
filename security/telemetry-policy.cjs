const { URL } = require("url");

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

function normalizeHost(value) {
  const raw = String(value || "")
    .trim()
    .toLowerCase();
  if (!raw) return "";

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      return new URL(raw).hostname.toLowerCase();
    } catch {
      return "";
    }
  }

  if (raw.startsWith("[")) {
    const closing = raw.indexOf("]");
    if (closing >= 0) return raw.slice(1, closing);
  }

  const colonCount = (raw.match(/:/g) || []).length;
  if (colonCount > 1) return raw;

  return raw.split(":")[0];
}

function isLocalHost(host) {
  const normalized = normalizeHost(host);
  return (
    !normalized ||
    LOCAL_HOSTS.has(normalized) ||
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local")
  );
}

function parseAllowedHosts(value) {
  return String(value || "")
    .split(",")
    .map((entry) => normalizeHost(entry))
    .filter(Boolean);
}

function hostMatchesAllowed(host, allowedHost) {
  if (!host || !allowedHost) return false;
  if (allowedHost.startsWith("*.")) {
    const suffix = allowedHost.slice(1);
    return host.endsWith(suffix);
  }
  return host === allowedHost;
}

function getTelemetryAllowedHosts() {
  return parseAllowedHosts(
    process.env.TELEMETRY_ALLOWED_HOSTS ||
      process.env.PUBLIC_APP_URL ||
      process.env.APP_URL ||
      process.env.RAILWAY_PUBLIC_DOMAIN,
  );
}

function getRequestHost(req) {
  return normalizeHost(
    req.hostname || req.headers["x-forwarded-host"] || req.headers.host || "",
  );
}

function isTelemetryWriteAllowed(req) {
  if (process.env.NODE_ENV !== "production") return false;

  const host = getRequestHost(req);
  if (isLocalHost(host)) return false;

  const allowedHosts = getTelemetryAllowedHosts();
  if (!allowedHosts.length) return true;

  return allowedHosts.some((entry) => hostMatchesAllowed(host, entry));
}

function trimString(value, maxLength) {
  if (value == null) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

function normalizeFiniteNumber(value) {
  if (value == null || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function normalizeCoordinate(value, min, max) {
  const numeric = normalizeFiniteNumber(value);
  if (numeric == null) return null;
  if (numeric < min || numeric > max) return null;
  return numeric;
}

function sanitizeGeo(geo) {
  if (!geo || typeof geo !== "object") return null;

  const lat = normalizeCoordinate(geo.lat ?? geo.latitude, -90, 90);
  const lon = normalizeCoordinate(
    geo.lon ?? geo.lng ?? geo.longitude,
    -180,
    180,
  );

  return {
    iso2: trimString(geo.iso2, 8),
    country: trimString(geo.country, 120),
    area: trimString(geo.area, 160),
    city: trimString(geo.city, 160),
    language: trimString(geo.language, 32),
    lat,
    lon,
    lng: lon,
    latitude: lat,
    longitude: lon,
    isPrecise: typeof geo.isPrecise === "boolean" ? geo.isPrecise : null,
    ts: trimString(geo.ts, 64),
  };
}

function sanitizeTelemetryPayload(payload) {
  const body = payload && typeof payload === "object" ? payload : {};
  const lat = normalizeCoordinate(
    body.lat ?? body.latitude ?? body.geo?.lat ?? body.geo?.latitude,
    -90,
    90,
  );
  const lon = normalizeCoordinate(
    body.lon ??
      body.lng ??
      body.longitude ??
      body.geo?.lon ??
      body.geo?.lng ??
      body.geo?.longitude,
    -180,
    180,
  );

  return {
    anon_id: trimString(body.anon_id, 80),
    user_id: trimString(body.user_id, 120),
    email: trimString(body.email, 254),
    name: trimString(body.name, 160),
    aims: trimString(body.aims, 500),
    interest: trimString(body.interest, 500),
    experience: trimString(body.experience, 500),
    contact: trimString(body.contact, 320),
    country: trimString(body.country, 120),
    area: trimString(body.area, 160),
    language: trimString(body.language, 32),
    reason: trimString(body.reason, 120),
    lat,
    lon,
    latitude: lat,
    longitude: lon,
    lng: lon,
    geo: sanitizeGeo(body.geo),
  };
}

module.exports = {
  getRequestHost,
  isLocalHost,
  isTelemetryWriteAllowed,
  sanitizeTelemetryPayload,
};
