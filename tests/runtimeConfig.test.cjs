/**
 * @jest-environment node
 */

const { validateRuntimeConfig } = require("../security/runtime-config.cjs");

function prodEnv(overrides = {}) {
  return {
    NODE_ENV: "production",
    ...overrides,
  };
}

describe("runtime security config", () => {
  test("rejects production NDJSON storage without encryption secret", () => {
    const result = validateRuntimeConfig(
      prodEnv({ ENABLE_NDJSON_STORAGE: "true" }),
    );

    expect(result.errors).toContain(
      "ENABLE_NDJSON_STORAGE=true requires ENCRYPTION_SECRET",
    );
  });

  test("rejects placeholder production secrets", () => {
    const result = validateRuntimeConfig(
      prodEnv({ DASHBOARD_PASSWORD: "change-this-dashboard-password" }),
    );

    expect(result.errors).toContain(
      "DASHBOARD_PASSWORD still looks like a placeholder value",
    );
  });

  test("requires a server secret when production telemetry hosts are enabled", () => {
    const result = validateRuntimeConfig(
      prodEnv({ TELEMETRY_ALLOWED_HOSTS: "app.example.com" }),
    );

    expect(result.errors).toContain(
      "telemetry host allowlist requires TELEMETRY_TOKEN_SECRET or another app secret",
    );
  });

  test("rejects disabled TLS for remote production database URLs", () => {
    const result = validateRuntimeConfig(
      prodEnv({
        DATABASE_URL: "postgres://user:pass@db.example.com:5432/app",
        DB_SSL: "disable",
      }),
    );

    expect(result.errors).toContain(
      "DB_SSL=disable is not allowed for remote production databases",
    );
  });

  test("allows disabled TLS for local production database URLs", () => {
    const result = validateRuntimeConfig(
      prodEnv({
        DATABASE_URL: "postgres://user:pass@localhost:5432/app",
        DB_SSL: "disable",
      }),
    );

    expect(result.errors).not.toContain(
      "DB_SSL=disable is not allowed for remote production databases",
    );
  });

  test("warns when production telemetry hosts are not configured", () => {
    const result = validateRuntimeConfig(prodEnv());

    expect(result.warnings).toContain(
      "production telemetry writes are disabled until TELEMETRY_ALLOWED_HOSTS or PUBLIC_APP_URL is set",
    );
  });
});
