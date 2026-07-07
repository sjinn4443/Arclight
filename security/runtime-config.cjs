const { URL } = require("url");

const LOCAL_DB_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const SECRET_KEYS = [
  "DASHBOARD_PASSWORD",
  "ENCRYPTION_SECRET",
  "SESSION_SECRET",
  "APP_SECRET",
  "TELEMETRY_TOKEN_SECRET",
];
const TELEMETRY_SECRET_KEYS = [
  "TELEMETRY_TOKEN_SECRET",
  "APP_SECRET",
  "SESSION_SECRET",
  "ENCRYPTION_SECRET",
  "DASHBOARD_PASSWORD",
];

function isEnabled(value) {
  return ["1", "true", "yes", "on"].includes(
    String(value || "")
      .trim()
      .toLowerCase(),
  );
}

function splitCsv(value) {
  return String(value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function hasValue(env, key) {
  return Boolean(String(env[key] || "").trim());
}

function isPlaceholderSecret(value) {
  const raw = String(value || "")
    .trim()
    .toLowerCase();
  if (!raw) return false;
  return (
    raw.includes("change-this") ||
    raw.includes("replace-with") ||
    raw.includes("your-password") ||
    raw === "password" ||
    raw === "secret" ||
    raw === "test-pass"
  );
}

function hasTelemetryHostAllowlist(env) {
  return Boolean(
    splitCsv(env.TELEMETRY_ALLOWED_HOSTS).length ||
    hasValue(env, "PUBLIC_APP_URL") ||
    hasValue(env, "APP_URL") ||
    hasValue(env, "RAILWAY_PUBLIC_DOMAIN"),
  );
}

function hasTelemetrySecret(env) {
  return TELEMETRY_SECRET_KEYS.some((key) => hasValue(env, key));
}

function isLocalDatabaseUrl(value) {
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return LOCAL_DB_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

function getDatabaseUrls(env) {
  return [
    env.DATABASE_URL,
    env.REPORTS_READ_DATABASE_URL,
    env.REPORTS_ADMIN_DATABASE_URL,
  ].filter((value) => String(value || "").trim());
}

function validateRuntimeConfig(env = process.env) {
  const errors = [];
  const warnings = [];
  const production = env.NODE_ENV === "production";

  if (!production) return { errors, warnings };

  for (const key of SECRET_KEYS) {
    if (isPlaceholderSecret(env[key])) {
      errors.push(`${key} still looks like a placeholder value`);
    }
  }

  if (
    isEnabled(env.ENABLE_NDJSON_STORAGE) &&
    !hasValue(env, "ENCRYPTION_SECRET")
  ) {
    errors.push("ENABLE_NDJSON_STORAGE=true requires ENCRYPTION_SECRET");
  }

  if (hasTelemetryHostAllowlist(env) && !hasTelemetrySecret(env)) {
    errors.push(
      "telemetry host allowlist requires TELEMETRY_TOKEN_SECRET or another app secret",
    );
  }

  if (
    splitCsv(env.ADMIN_ALLOWED_IPS).length &&
    !hasValue(env, "DASHBOARD_PASSWORD")
  ) {
    errors.push("ADMIN_ALLOWED_IPS requires DASHBOARD_PASSWORD");
  }

  if (env.DB_SSL === "disable") {
    const remoteDatabaseUrls = getDatabaseUrls(env).filter(
      (url) => !isLocalDatabaseUrl(url),
    );
    if (remoteDatabaseUrls.length) {
      errors.push(
        "DB_SSL=disable is not allowed for remote production databases",
      );
    }
  }

  if (!hasTelemetryHostAllowlist(env)) {
    warnings.push(
      "production telemetry writes are disabled until TELEMETRY_ALLOWED_HOSTS or PUBLIC_APP_URL is set",
    );
  }

  return { errors, warnings };
}

function assertRuntimeConfig(env = process.env) {
  const result = validateRuntimeConfig(env);
  if (result.errors.length) {
    throw new Error(
      `Invalid production security configuration: ${result.errors.join("; ")}`,
    );
  }
  for (const warning of result.warnings) {
    console.warn(`[security-config] ${warning}`);
  }
  return result;
}

module.exports = {
  assertRuntimeConfig,
  validateRuntimeConfig,
};
