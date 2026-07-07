/**
 * @jest-environment node
 */

const ORIGINAL_ENV = { ...process.env };

function loadPolicy(envOverrides = {}) {
  jest.resetModules();
  process.env = {
    ...ORIGINAL_ENV,
    NODE_ENV: "production",
    TELEMETRY_ALLOWED_HOSTS: "",
    PUBLIC_APP_URL: "",
    APP_URL: "",
    RAILWAY_PUBLIC_DOMAIN: "",
    ...envOverrides,
  };
  return require("../security/telemetry-policy.cjs");
}

afterEach(() => {
  jest.resetModules();
  process.env = { ...ORIGINAL_ENV };
});

describe("telemetry host policy", () => {
  test("does not allow production telemetry writes without a host allowlist", () => {
    const { isTelemetryWriteAllowed } = loadPolicy();

    expect(
      isTelemetryWriteAllowed({
        hostname: "app.example.com",
        headers: {},
      }),
    ).toBe(false);
  });

  test("allows production telemetry writes for configured hosts", () => {
    const { isTelemetryWriteAllowed } = loadPolicy({
      TELEMETRY_ALLOWED_HOSTS: "app.example.com",
    });

    expect(
      isTelemetryWriteAllowed({
        hostname: "app.example.com",
        headers: {},
      }),
    ).toBe(true);
  });
});
