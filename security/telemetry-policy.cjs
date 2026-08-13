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
  return normalizeHost(req?.headers?.host || req?.hostname || "");
}

function isTelemetryWriteAllowed(req) {
  if (process.env.NODE_ENV !== "production") return false;

  const host = getRequestHost(req);
  if (isLocalHost(host)) return false;

  const allowedHosts = getTelemetryAllowedHosts();
  if (!allowedHosts.length) return false;

  return allowedHosts.some((entry) => hostMatchesAllowed(host, entry));
}

function trimString(value, maxLength) {
  if (value == null) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

function sanitizeTelemetryPayload(payload) {
  const body = payload && typeof payload === "object" ? payload : {};

  return {
    name: trimString(body.name, 160),
    aims: trimString(body.aims, 500),
    interest: trimString(body.interest, 500),
    experience: trimString(body.experience, 500),
    contact: trimString(body.contact, 320),
    language: trimString(body.language, 32),
    reason: trimString(body.reason, 120),
  };
}

module.exports = {
  getRequestHost,
  getTelemetryAllowedHosts,
  isLocalHost,
  isTelemetryWriteAllowed,
  sanitizeTelemetryPayload,
};
