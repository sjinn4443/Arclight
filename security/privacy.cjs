const { maskIp } = require("./safe-logging.cjs");

const DEFAULT_TELEMETRY_RETENTION_DAYS = 90;
const DEFAULT_AUDIT_RETENTION_DAYS = 365;

function parseRetentionDays(value, fallbackDays) {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase();
  if (!raw) return fallbackDays;
  if (["0", "off", "false", "never"].includes(raw)) return null;

  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed) || parsed < 1) return fallbackDays;
  return Math.min(parsed, 3650);
}

function resolveTelemetryRetentionDays(env = process.env) {
  return parseRetentionDays(
    env.TELEMETRY_RETENTION_DAYS,
    DEFAULT_TELEMETRY_RETENTION_DAYS,
  );
}

function resolveAuditRetentionDays(env = process.env) {
  return parseRetentionDays(
    env.REPORTS_AUDIT_RETENTION_DAYS,
    DEFAULT_AUDIT_RETENTION_DAYS,
  );
}

function isExpiredTimestamp(value, retentionDays, now = new Date()) {
  if (retentionDays == null) return false;

  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) return false;

  const maxAgeMs = retentionDays * 24 * 60 * 60 * 1000;
  return now.getTime() - timestamp.getTime() > maxAgeMs;
}

function anonymizeIpForStorage(ip) {
  return maskIp(ip) || "unknown";
}

module.exports = {
  DEFAULT_AUDIT_RETENTION_DAYS,
  DEFAULT_TELEMETRY_RETENTION_DAYS,
  anonymizeIpForStorage,
  isExpiredTimestamp,
  parseRetentionDays,
  resolveAuditRetentionDays,
  resolveTelemetryRetentionDays,
};
