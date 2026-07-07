/**
 * @jest-environment node
 */

const {
  anonymizeIpForStorage,
  isExpiredTimestamp,
  parseRetentionDays,
} = require("../security/privacy.cjs");

describe("privacy helpers", () => {
  test("masks IPv4 addresses before storage", () => {
    expect(anonymizeIpForStorage("203.0.113.42")).toBe("203.0.113.x");
  });

  test("masks IPv6 addresses before storage", () => {
    expect(anonymizeIpForStorage("2001:db8:abcd:0012::1")).toBe(
      "2001:db8:xxxx:xxxx",
    );
  });

  test("uses fallback retention for missing or invalid values", () => {
    expect(parseRetentionDays("", 90)).toBe(90);
    expect(parseRetentionDays("not-a-number", 90)).toBe(90);
  });

  test("allows retention to be explicitly disabled", () => {
    expect(parseRetentionDays("off", 90)).toBeNull();
  });

  test("detects timestamps beyond retention", () => {
    const now = new Date("2026-07-07T00:00:00.000Z");
    expect(isExpiredTimestamp("2026-03-01T00:00:00.000Z", 90, now)).toBe(true);
    expect(isExpiredTimestamp("2026-06-01T00:00:00.000Z", 90, now)).toBe(false);
  });
});
