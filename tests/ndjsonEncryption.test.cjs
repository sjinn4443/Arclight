/**
 * @jest-environment node
 */

const ORIGINAL_ENV = { ...process.env };
const crypto = require("crypto");

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
    expect(encrypted).toMatch(/^v2:/);
    expect(decrypt(encrypted)).toBe(payload);
  });

  test("continues to read the legacy per-row scrypt format", () => {
    jest.resetModules();
    const secret =
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    process.env = { ...ORIGINAL_ENV, ENCRYPTION_SECRET: secret };
    const payload = '{"type":"profile","profile_id":"legacy"}';
    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(12);
    const key = crypto.scryptSync(secret, salt, 32);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const ciphertext = Buffer.concat([
      cipher.update(payload, "utf8"),
      cipher.final(),
    ]);
    const legacy = [
      salt.toString("hex"),
      iv.toString("hex"),
      cipher.getAuthTag().toString("hex"),
      ciphertext.toString("hex"),
    ].join(":");

    const {
      decrypt,
      decryptAsync,
    } = require("../reports/security/encrypt.cjs");
    expect(decrypt(legacy)).toBe(payload);
    return expect(decryptAsync(legacy)).resolves.toBe(payload);
  });
});
