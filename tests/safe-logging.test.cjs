/**
 * @jest-environment node
 */

const {
  sanitizeStructuredLogPayload,
  sanitizeValue,
} = require("../security/safe-logging.cjs");

describe("safe logging", () => {
  test("redacts nested telemetry-like fields", () => {
    const sanitized = sanitizeValue({
      email: "alice@example.com",
      body: {
        anon_id: "anon-123",
        user_id: "user-123",
        token: "secret-token",
        lat: 51.5,
        lon: -0.1,
        note: "token=secret-token",
      },
      nested: {
        contact: "+44 1234 567890",
      },
    });

    expect(sanitized.email).toBe("[redacted]");
    expect(sanitized.body.anon_id).toBe("[redacted]");
    expect(sanitized.body.user_id).toBe("[redacted]");
    expect(sanitized.body.token).toBe("[redacted]");
    expect(sanitized.body.lat).toBe("[redacted]");
    expect(sanitized.body.lon).toBe("[redacted]");
    expect(sanitized.body.note).toContain("[redacted]");
    expect(sanitized.nested.contact).toBe("[redacted]");
  });

  test("masks IPs and strips query strings from structured payloads", () => {
    const sanitized = sanitizeStructuredLogPayload({
      event: "admin_ip_blocked",
      path: "/api/dev/users?token=secret",
      ip: "198.51.100.25",
    });

    expect(sanitized.path).toBe("/api/dev/users");
    expect(sanitized.ip).toBe("198.51.100.x");
  });
});
