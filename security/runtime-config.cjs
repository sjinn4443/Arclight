const { URL } = require("url");

const LOCAL_DB_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const SECRET_KEYS = [
  "DASHBOARD_PASSWORD",
  "ENCRYPTION_SECRET",
  "SESSION_SECRET",
  "APP_SECRET",
  "TELEMETRY_TOKEN_SECRET",
];
const MIN_DASHBOARD_PASSWORD_LENGTH = 24;
const MIN_ENCRYPTION_SECRET_LENGTH = 32;
const MIN_TELEMETRY_SECRET_LENGTH = 32;

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
    raw.includes("generate-a-") ||
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

function isLocalDatabaseUrl(value) {
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return LOCAL_DB_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

function parseTrustProxy(value) {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase();
  if (!raw || raw === "0" || raw === "false" || raw === "off") {
    return { valid: true, value: false };
  }
  if (!/^\d+$/.test(raw)) return { valid: false, value: false };

  const hops = Number(raw);
  if (!Number.isSafeInteger(hops) || hops < 1 || hops > 10) {
    return { valid: false, value: false };
  }
  return { valid: true, value: hops };
}

function resolveTrustProxy(env = process.env) {
  const parsed = parseTrustProxy(env.TRUST_PROXY);
  if (!parsed.valid) {
    throw new Error(
      "TRUST_PROXY must be disabled or a trusted proxy hop count from 1 to 10",
    );
  }
  return parsed.value;
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

  for (const key of SECRET_KEYS) {
    if (isPlaceholderSecret(env[key])) {
      errors.push(`${key} still looks like a placeholder value`);
    }
  }

  const dashboardPassword = String(env.DASHBOARD_PASSWORD || "").trim();
  if (dashboardPassword.length < MIN_DASHBOARD_PASSWORD_LENGTH) {
    errors.push(
      `DASHBOARD_PASSWORD is required and must be at least ${MIN_DASHBOARD_PASSWORD_LENGTH} characters`,
    );
  }

  const telemetrySecret = String(env.TELEMETRY_TOKEN_SECRET || "").trim();
  if (telemetrySecret.length < MIN_TELEMETRY_SECRET_LENGTH) {
    errors.push(
      `TELEMETRY_TOKEN_SECRET is required and must be at least ${MIN_TELEMETRY_SECRET_LENGTH} characters`,
    );
  }

  const encryptionSecret = String(env.ENCRYPTION_SECRET || "").trim();
  if (
    encryptionSecret &&
    encryptionSecret.length < MIN_ENCRYPTION_SECRET_LENGTH
  ) {
    errors.push(
      `ENCRYPTION_SECRET must be at least ${MIN_ENCRYPTION_SECRET_LENGTH} characters when configured`,
    );
  }

  const configuredSecrets = SECRET_KEYS.map((key) => [
    key,
    String(env[key] || "").trim(),
  ]).filter(([, value]) => value);
  for (let i = 0; i < configuredSecrets.length; i += 1) {
    for (let j = i + 1; j < configuredSecrets.length; j += 1) {
      const [leftKey, leftValue] = configuredSecrets[i];
      const [rightKey, rightValue] = configuredSecrets[j];
      if (leftValue === rightValue) {
        errors.push(`${leftKey} must not reuse ${rightKey}`);
      }
    }
  }

  if (!parseTrustProxy(env.TRUST_PROXY).valid) {
    errors.push(
      "TRUST_PROXY must be disabled or a trusted proxy hop count from 1 to 10",
    );
  }

  if (
    isEnabled(env.ENABLE_NDJSON_STORAGE) &&
    !hasValue(env, "ENCRYPTION_SECRET")
  ) {
    errors.push("ENABLE_NDJSON_STORAGE=true requires ENCRYPTION_SECRET");
  }

  if (
    splitCsv(env.ADMIN_ALLOWED_IPS).length &&
    !hasValue(env, "DASHBOARD_PASSWORD")
  ) {
    errors.push("ADMIN_ALLOWED_IPS requires DASHBOARD_PASSWORD");
  }

  if (production && env.DB_SSL === "disable") {
    const remoteDatabaseUrls = getDatabaseUrls(env).filter(
      (url) => !isLocalDatabaseUrl(url),
    );
    if (remoteDatabaseUrls.length) {
      errors.push(
        "DB_SSL=disable is not allowed for remote production databases",
      );
    }
  }

  if (production && !hasTelemetryHostAllowlist(env)) {
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
      `Invalid security configuration: ${result.errors.join("; ")}`,
    );
  }
  for (const warning of result.warnings) {
    console.warn(`[security-config] ${warning}`);
  }
  return result;
}

module.exports = {
  assertRuntimeConfig,
  resolveTrustProxy,
  validateRuntimeConfig,
};
