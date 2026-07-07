/**
 * @jest-environment node
 */

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  jest.resetModules();
  process.env = { ...ORIGINAL_ENV };
});

describe("NDJSON telemetry encryption", () => {
  test("rejects writes when ENCRYPTION_SECRET is missing", () => {
    jest.resetModules();
    process.env = {
      ...ORIGINAL_ENV,
      ENCRYPTION_SECRET: "",
    };

    const { encrypt } = require("../reports/security/encrypt.cjs");
    expect(() => encrypt('{"type":"profile"}')).toThrow(
      /ENCRYPTION_SECRET is required/,
    );
  });

  test("round-trips encrypted payloads when ENCRYPTION_SECRET is configured", () => {
    jest.resetModules();
    process.env = {
      ...ORIGINAL_ENV,
      ENCRYPTION_SECRET:
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    };

    const { encrypt, decrypt } = require("../reports/security/encrypt.cjs");
    const payload = '{"type":"profile","anon_id":"anon-1"}';
    const encrypted = encrypt(payload);

    expect(encrypted).not.toBe(payload);
    expect(decrypt(encrypted)).toBe(payload);
  });
});
