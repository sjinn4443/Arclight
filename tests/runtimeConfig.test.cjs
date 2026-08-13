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

  test("requires a dedicated strong telemetry secret in every environment", () => {
    const result = validateRuntimeConfig(
      prodEnv({ TELEMETRY_ALLOWED_HOSTS: "app.example.com" }),
    );

    expect(result.errors).toContain(
      "TELEMETRY_TOKEN_SECRET is required and must be at least 32 characters",
    );
  });

  test("rejects weak dashboard passwords outside production", () => {
    const result = validateRuntimeConfig({
      NODE_ENV: "development",
      DASHBOARD_PASSWORD: "short",
      TELEMETRY_TOKEN_SECRET: "telemetry-secret-0123456789-abcdef",
    });

    expect(result.errors).toContain(
      "DASHBOARD_PASSWORD is required and must be at least 24 characters",
    );
  });

  test("rejects reused secrets and invalid proxy trust", () => {
    const reused = "independent-secret-required-0123456789";
    const result = validateRuntimeConfig({
      NODE_ENV: "development",
      DASHBOARD_PASSWORD: reused,
      TELEMETRY_TOKEN_SECRET: reused,
      TRUST_PROXY: "true",
    });

    expect(result.errors).toContain(
      "DASHBOARD_PASSWORD must not reuse TELEMETRY_TOKEN_SECRET",
    );
    expect(result.errors).toContain(
      "TRUST_PROXY must be disabled or a trusted proxy hop count from 1 to 10",
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
