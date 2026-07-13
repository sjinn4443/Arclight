/**
 * @jest-environment node
 */
const request = require("supertest");

const ORIGINAL_ENV = { ...process.env };

function authHeader(password, user = "dev") {
  return `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`;
}

function buildTelemetryAuth(host = "app.example.com") {
  const {
    TELEMETRY_SESSION_COOKIE,
    createTelemetryToken,
  } = require("../security/telemetry-guard.cjs");
  const sessionId = "testTelemetrySession_0123456789";
  return {
    cookie: `${TELEMETRY_SESSION_COOKIE}=${sessionId}`,
    token: createTelemetryToken(sessionId, host),
  };
}

function withTelemetryHeaders(requestBuilder, auth, host = "app.example.com") {
  return requestBuilder
    .set("Host", host)
    .set("Origin", `https://${host}`)
    .set("Cookie", auth.cookie)
    .set("X-Arclight-Telemetry", auth.token);
}

function extractCookie(setCookieHeaders, cookieName) {
  const headers = Array.isArray(setCookieHeaders) ? setCookieHeaders : [];
  const header = headers.find((entry) => entry.startsWith(`${cookieName}=`));
  return header ? header.split(";")[0] : "";
}

function extractTelemetryToken(html) {
  const match = String(html || "").match(
    /<meta\s+name=["']arclight-telemetry-token["']\s+content=["']([^"']+)["']/i,
  );
  return match ? match[1] : "";
}

function parseStructuredLogs(spy) {
  return spy.mock.calls
    .map(([message]) => {
      if (typeof message !== "string" || !message.startsWith("{")) return null;
      try {
        return JSON.parse(message);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

async function loadServer(envOverrides = {}, storageOverrides = {}) {
  jest.resetModules();

  process.env = {
    ...ORIGINAL_ENV,
    ...envOverrides,
  };

  const mockStorage = {
    init: jest.fn().mockResolvedValue(undefined),
    saveProfile: jest.fn().mockResolvedValue(undefined),
    bumpRefresh: jest.fn().mockResolvedValue(undefined),
    saveIp: jest.fn().mockResolvedValue(undefined),
    updateIpLocation: jest.fn().mockResolvedValue(true),
    getUsersForDashboard: jest.fn().mockResolvedValue([]),
    getIpLocationsForDashboard: jest.fn().mockResolvedValue([]),
    deleteUserForDashboard: jest.fn().mockResolvedValue(false),
    ...storageOverrides,
  };

  jest.doMock("../storage/index.cjs", () => mockStorage);

  const { app } = require("../server.cjs");
  return { app, mockStorage };
}

afterEach(() => {
  jest.restoreAllMocks();
  jest.resetModules();
  process.env = { ...ORIGINAL_ENV };
});

describe("server security hardening", () => {
  test("does not persist telemetry outside production", async () => {
    const { app, mockStorage } = await loadServer({
      NODE_ENV: "development",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
    });

    const profileResponse = await request(app)
      .post("/api/app/profile")
      .send({ anon_id: "anon-1", name: "Local User" });

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body).toEqual({ ok: true, stored: false });
    expect(mockStorage.saveProfile).not.toHaveBeenCalled();

    const trackResponse = await request(app)
      .post("/track")
      .set("X-Forwarded-For", "8.8.8.8");

    expect(trackResponse.status).toBe(204);
    expect(mockStorage.saveIp).not.toHaveBeenCalled();
  });

  test("fails open for /track when telemetry storage throws", async () => {
    const { app, mockStorage } = await loadServer(
      {
        NODE_ENV: "production",
        TELEMETRY_ALLOWED_HOSTS: "app.example.com",
        DASHBOARD_PASSWORD: "test-dashboard-password-12345",
      },
      {
        saveIp: jest.fn().mockRejectedValue(new Error("write failed")),
      },
    );

    const auth = buildTelemetryAuth();

    const response = await withTelemetryHeaders(
      request(app).post("/track"),
      auth,
    )
      .set("Host", "app.example.com")
      .set("X-Forwarded-For", "198.51.100.25");

    expect(response.status).toBe(204);
    expect(mockStorage.saveIp).toHaveBeenCalledTimes(1);
  });

  test("persists telemetry only for allowed production hosts and strips unknown fields", async () => {
    const { app, mockStorage } = await loadServer({
      NODE_ENV: "production",
      TELEMETRY_ALLOWED_HOSTS: "app.example.com",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
    });

    const blocked = await request(app)
      .post("/api/app/profile")
      .set("Host", "localhost:3000")
      .send({ anon_id: "anon-1", name: "Blocked Local" });

    expect(blocked.status).toBe(200);
    expect(blocked.body).toEqual({ ok: true, stored: false });
    expect(mockStorage.saveProfile).not.toHaveBeenCalled();

    const auth = buildTelemetryAuth();

    const allowed = await withTelemetryHeaders(
      request(app).post("/api/app/profile"),
      auth,
    ).send({
      anon_id: "anon-1",
      name: "  Alice  ",
      lat: 999,
      lon: "-0.1",
      unknown: "drop-me",
    });

    expect(allowed.status).toBe(200);
    expect(allowed.body).toEqual({ ok: true, stored: true });
    expect(mockStorage.saveProfile).toHaveBeenCalledTimes(1);
    expect(mockStorage.saveProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        anon_id: "anon-1",
        name: "Alice",
        lat: null,
        lon: -0.1,
      }),
    );
    expect(mockStorage.saveProfile.mock.calls[0][0].unknown).toBeUndefined();
  });

  test("replaces IP-derived geo with precise browser location", async () => {
    const { app, mockStorage } = await loadServer({
      NODE_ENV: "production",
      TELEMETRY_ALLOWED_HOSTS: "app.example.com",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
    });
    const auth = buildTelemetryAuth();

    const response = await withTelemetryHeaders(
      request(app).post("/api/app/refresh"),
      auth,
    )
      .set("X-Forwarded-For", "152.233.29.4")
      .send({
        anon_id: "anon-glasgow",
        reason: "location_precise",
        geo: {
          iso2: "GB",
          country: "United Kingdom",
          city: "Glasgow",
          area: "Glasgow, Scotland, UK",
          lat: 55.8642,
          lon: -4.2518,
          isPrecise: true,
        },
      });

    expect(response.status).toBe(200);
    expect(mockStorage.bumpRefresh).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: "location_precise",
        geo: expect.objectContaining({
          city: "Glasgow",
          isPrecise: true,
        }),
      }),
    );
    expect(mockStorage.updateIpLocation).toHaveBeenCalledWith(
      "152.233.29.4",
      expect.objectContaining({
        country: "United Kingdom",
        city: "Glasgow",
        area: "Glasgow, Scotland, UK",
        lat: 55.8642,
        lon: -4.2518,
        isPrecise: true,
      }),
    );
  });

  test("issues a telemetry token on production HTML and accepts it for profile writes", async () => {
    const host = "app.example.com";
    const {
      TELEMETRY_SESSION_COOKIE,
    } = require("../security/telemetry-guard.cjs");
    const { app, mockStorage } = await loadServer({
      NODE_ENV: "production",
      STATIC_ROOT_DIR: "public",
      TELEMETRY_ALLOWED_HOSTS: host,
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
    });

    const htmlResponse = await request(app)
      .get("/")
      .set("Host", host)
      .set("Accept", "text/html");

    expect(htmlResponse.status).toBe(200);
    const sessionCookie = extractCookie(
      htmlResponse.headers["set-cookie"],
      TELEMETRY_SESSION_COOKIE,
    );
    const telemetryToken = extractTelemetryToken(htmlResponse.text);

    expect(sessionCookie).toBeTruthy();
    expect(telemetryToken).toMatch(/^v1\./);

    const profileResponse = await request(app)
      .post("/api/app/profile")
      .set("Host", host)
      .set("Origin", `https://${host}`)
      .set("Cookie", sessionCookie)
      .set("X-Arclight-Telemetry", telemetryToken)
      .send({ anon_id: "anon-1", name: "Alice" });

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body).toEqual({ ok: true, stored: true });
    expect(mockStorage.saveProfile).toHaveBeenCalledTimes(1);
    expect(mockStorage.saveProfile).toHaveBeenCalledWith(
      expect.objectContaining({ anon_id: "anon-1", name: "Alice" }),
    );
  });

  test("logs production telemetry skips when the host allowlist does not match", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const { app, mockStorage } = await loadServer({
      NODE_ENV: "production",
      TELEMETRY_ALLOWED_HOSTS: "app.example.com",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
    });

    const response = await request(app)
      .post("/api/app/profile")
      .set("Host", "unexpected.example.com")
      .send({ anon_id: "anon-1", name: "Blocked Host" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, stored: false });
    expect(mockStorage.saveProfile).not.toHaveBeenCalled();

    const logs = parseStructuredLogs(logSpy);
    expect(
      logs.some(
        (entry) =>
          entry.event === "telemetry_write_skipped" &&
          entry.reason === "host_not_allowed" &&
          entry.host === "unexpected.example.com" &&
          entry.path === "/api/app/profile",
      ),
    ).toBe(true);
  });

  test("blocks production telemetry writes without a valid telemetry token", async () => {
    const { app, mockStorage } = await loadServer({
      NODE_ENV: "production",
      TELEMETRY_ALLOWED_HOSTS: "app.example.com",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
    });

    const auth = buildTelemetryAuth();
    const missingToken = await request(app)
      .post("/api/app/profile")
      .set("Host", "app.example.com")
      .set("Origin", "https://app.example.com")
      .set("Cookie", auth.cookie)
      .send({ anon_id: "anon-1", name: "Alice" });

    expect(missingToken.status).toBe(403);
    expect(missingToken.body).toMatchObject({
      error: "telemetry_forbidden",
      reason: "invalid_token",
    });
    expect(mockStorage.saveProfile).not.toHaveBeenCalled();
  });

  test("rate limits repeated telemetry writes on public ingestion routes", async () => {
    const { app, mockStorage } = await loadServer({
      NODE_ENV: "production",
      TELEMETRY_ALLOWED_HOSTS: "app.example.com",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
    });

    const auth = buildTelemetryAuth();

    let response;
    for (let i = 0; i < 16; i += 1) {
      response = await withTelemetryHeaders(
        request(app).post("/api/app/profile"),
        auth,
      ).send({ anon_id: `anon-${i}`, name: `User ${i}` });
    }

    expect(response.status).toBe(429);
    expect(response.body).toMatchObject({
      error: "rate_limited",
    });
    expect(mockStorage.saveProfile).toHaveBeenCalledTimes(15);
  });

  test("does not rate limit localhost telemetry requests", async () => {
    const { app, mockStorage } = await loadServer({
      NODE_ENV: "production",
      TELEMETRY_ALLOWED_HOSTS: "app.example.com",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
    });

    let response;
    for (let i = 0; i < 20; i += 1) {
      response = await request(app)
        .post("/api/app/profile")
        .set("Host", "localhost:3000")
        .send({ anon_id: `anon-${i}`, name: `Local ${i}` });
    }

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, stored: false });
    expect(mockStorage.saveProfile).not.toHaveBeenCalled();
  });

  test("rate limits repeated bad auth attempts on the reports API", async () => {
    const { app } = await loadServer({
      NODE_ENV: "development",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
    });

    let response;
    for (let i = 0; i < 11; i += 1) {
      response = await request(app)
        .get("/api/dev/users")
        .set("Authorization", authHeader("wrong-password"));
    }

    expect(response.status).toBe(429);
    expect(response.text).toMatch(/Too many/i);
  });

  test("keeps reports read-only locally by default", async () => {
    const { app, mockStorage } = await loadServer(
      {
        NODE_ENV: "development",
        DASHBOARD_PASSWORD: "test-dashboard-password-12345",
      },
      {
        getUsersForDashboard: jest
          .fn()
          .mockResolvedValue([{ anon_id: "anon-1" }]),
      },
    );

    const response = await request(app)
      .get("/api/dev/users")
      .set("Authorization", authHeader("test-dashboard-password-12345"))
      .set("Host", "localhost:3000");

    expect(response.status).toBe(200);
    expect(response.headers["x-reports-delete-enabled"]).toBe("0");
    expect(mockStorage.getUsersForDashboard).toHaveBeenCalledTimes(1);
  });

  test("allows local delete only when explicitly enabled", async () => {
    const deleteSpy = jest.fn().mockResolvedValue(true);
    const { app } = await loadServer(
      {
        NODE_ENV: "development",
        DASHBOARD_PASSWORD: "test-dashboard-password-12345",
        REPORTS_ALLOW_LOCAL_DELETE: "true",
      },
      {
        deleteUserForDashboard: deleteSpy,
      },
    );

    const response = await request(app)
      .delete("/api/dev/users/anon-1")
      .set("Authorization", authHeader("test-dashboard-password-12345"))
      .set("Host", "localhost:3000");

    expect(response.status).toBe(204);
    expect(deleteSpy).toHaveBeenCalledWith(
      "anon-1",
      expect.objectContaining({
        user: "dev",
        host: "localhost",
        environment: "development",
      }),
    );
  });

  test("exposes healthz even when emergency mode is active", async () => {
    const { app } = await loadServer({
      NODE_ENV: "production",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
      EMERGENCY_MODE: "lockdown",
    });

    const response = await request(app).get("/healthz");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, emergencyMode: "lockdown" });
  });

  test("blocks write routes in readonly mode and keeps reports delete disabled", async () => {
    const deleteSpy = jest.fn().mockResolvedValue(true);
    const getUsersSpy = jest.fn().mockResolvedValue([{ anon_id: "anon-1" }]);
    const { app } = await loadServer(
      {
        NODE_ENV: "development",
        DASHBOARD_PASSWORD: "test-dashboard-password-12345",
        EMERGENCY_MODE: "readonly",
        REPORTS_ALLOW_LOCAL_DELETE: "true",
      },
      {
        deleteUserForDashboard: deleteSpy,
        getUsersForDashboard: getUsersSpy,
      },
    );

    const profileResponse = await request(app)
      .post("/api/app/profile")
      .send({ anon_id: "anon-1" });
    expect(profileResponse.status).toBe(503);
    expect(profileResponse.body).toMatchObject({
      error: "security_maintenance",
      emergencyMode: "readonly",
    });

    const trackResponse = await request(app).post("/track");
    expect(trackResponse.status).toBe(503);
    expect(trackResponse.body).toMatchObject({
      error: "security_maintenance",
      emergencyMode: "readonly",
    });

    const usersResponse = await request(app)
      .get("/api/dev/users")
      .set("Authorization", authHeader("test-dashboard-password-12345"))
      .set("Host", "localhost:3000");
    expect(usersResponse.status).toBe(200);
    expect(usersResponse.headers["x-reports-delete-enabled"]).toBe("0");
    expect(getUsersSpy).toHaveBeenCalledTimes(1);

    const deleteResponse = await request(app)
      .delete("/api/dev/users/anon-1")
      .set("Authorization", authHeader("test-dashboard-password-12345"))
      .set("Host", "localhost:3000");
    expect(deleteResponse.status).toBe(503);
    expect(deleteResponse.body).toMatchObject({
      error: "security_maintenance",
      emergencyMode: "readonly",
    });
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  test("returns maintenance HTML and API 503 responses in emergency mode", async () => {
    const { app } = await loadServer({
      NODE_ENV: "development",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
      EMERGENCY_MODE: "emergency",
    });

    const homeResponse = await request(app).get("/");
    expect(homeResponse.status).toBe(503);
    expect(homeResponse.headers["cache-control"]).toBe("no-store");
    expect(homeResponse.headers["content-type"]).toMatch(/html/);
    expect(homeResponse.text).toMatch(/<style nonce="/i);
    expect(homeResponse.text).toMatch(/Maintenance/i);
    expect(homeResponse.text).not.toMatch(/Security/i);
    expect(homeResponse.text).toMatch(/Arclight is temporarily unavailable/i);
    expect(homeResponse.text).toMatch(/Some features may be unavailable/i);

    const apiResponse = await request(app).post("/api/app/profile").send({});
    expect(apiResponse.status).toBe(503);
    expect(apiResponse.body).toMatchObject({
      error: "security_maintenance",
      emergencyMode: "emergency",
    });

    const trackResponse = await request(app).post("/track");
    expect(trackResponse.status).toBe(503);
    expect(trackResponse.body).toMatchObject({
      error: "security_maintenance",
      emergencyMode: "emergency",
    });
  });

  test("accepts maintenance as a legacy alias and normalizes it to emergency", async () => {
    const { app } = await loadServer({
      NODE_ENV: "development",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
      EMERGENCY_MODE: "maintenance",
    });

    const healthResponse = await request(app).get("/healthz");
    expect(healthResponse.status).toBe(200);
    expect(healthResponse.body).toEqual({
      ok: true,
      emergencyMode: "emergency",
    });

    const apiResponse = await request(app).post("/api/app/profile").send({});
    expect(apiResponse.status).toBe(503);
    expect(apiResponse.body).toMatchObject({
      error: "security_maintenance",
      emergencyMode: "emergency",
    });
  });

  test("blocks public traffic in lockdown mode but keeps healthz available", async () => {
    const { app } = await loadServer({
      NODE_ENV: "development",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
      EMERGENCY_MODE: "lockdown",
    });

    const homeResponse = await request(app).get("/");
    expect(homeResponse.status).toBe(503);
    expect(homeResponse.text).toMatch(/<style nonce="/i);
    expect(homeResponse.text).toMatch(/Restricted Access/i);
    expect(homeResponse.text).not.toMatch(/Security/i);
    expect(homeResponse.text).toMatch(
      /Access to Arclight app is temporarily restricted/i,
    );

    const assetResponse = await request(app).get("/js/reports.js");
    expect(assetResponse.status).toBe(503);
    expect(assetResponse.headers["content-type"]).toMatch(/text\/plain/);

    const healthResponse = await request(app).get("/healthz");
    expect(healthResponse.status).toBe(200);
    expect(healthResponse.body.emergencyMode).toBe("lockdown");
  });

  test("requires an allowlisted IP for admin routes in production", async () => {
    const getUsersSpy = jest.fn().mockResolvedValue([]);
    const { app } = await loadServer(
      {
        NODE_ENV: "production",
        DASHBOARD_PASSWORD: "test-dashboard-password-12345",
        ADMIN_ALLOWED_IPS: "203.0.113.10",
      },
      {
        getUsersForDashboard: getUsersSpy,
      },
    );

    const blockedResponse = await request(app)
      .get("/api/dev/users")
      .set("Authorization", authHeader("test-dashboard-password-12345"))
      .set("X-Forwarded-For", "198.51.100.25");
    expect(blockedResponse.status).toBe(403);

    const allowedResponse = await request(app)
      .get("/api/dev/users")
      .set("Authorization", authHeader("test-dashboard-password-12345"))
      .set("X-Forwarded-For", "203.0.113.10");
    expect(allowedResponse.status).toBe(200);
    expect(getUsersSpy).toHaveBeenCalledTimes(1);
  });

  test("blocks all admin access in production when no admin IP allowlist is configured", async () => {
    const { app } = await loadServer({
      NODE_ENV: "production",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
    });

    const response = await request(app)
      .get("/api/dev/users")
      .set("Authorization", authHeader("test-dashboard-password-12345"))
      .set("X-Forwarded-For", "203.0.113.10");

    expect(response.status).toBe(403);
  });

  test("emits structured logs for emergency blocks, auth failures, and admin IP denials", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const { app } = await loadServer({
      NODE_ENV: "production",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
      EMERGENCY_MODE: "emergency",
      ADMIN_ALLOWED_IPS: "203.0.113.10",
    });

    await request(app).get("/");
    await request(app)
      .get("/api/dev/users")
      .set("Authorization", authHeader("wrong-password"))
      .set("X-Forwarded-For", "203.0.113.10");
    await request(app)
      .get("/api/dev/users")
      .set("Authorization", authHeader("test-dashboard-password-12345"))
      .set("X-Forwarded-For", "198.51.100.25");

    const logs = parseStructuredLogs(logSpy);

    expect(
      logs.some(
        (entry) =>
          entry.event === "emergency_block" &&
          entry.path === "/" &&
          entry.mode === "emergency",
      ),
    ).toBe(true);
    expect(
      logs.some(
        (entry) =>
          entry.event === "admin_auth_failed" &&
          entry.reason === "invalid_password",
      ),
    ).toBe(true);
    expect(logs.some((entry) => entry.event === "admin_ip_blocked")).toBe(true);
    expect(logs.some((entry) => entry.event === "emergency_mode_active")).toBe(
      true,
    );
  });

  test("redacts sensitive request details in structured logs", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const { app } = await loadServer({
      NODE_ENV: "production",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
      EMERGENCY_MODE: "emergency",
      ADMIN_ALLOWED_IPS: "203.0.113.10",
    });

    await request(app)
      .get("/api/dev/users?token=secret")
      .set("Authorization", authHeader("wrong-password"))
      .set("X-Forwarded-For", "203.0.113.10");

    const logs = parseStructuredLogs(logSpy);
    const authFailure = logs.find(
      (entry) => entry.event === "admin_auth_failed",
    );

    expect(authFailure).toBeTruthy();
    expect(authFailure.path).toBe("/api/dev/users");
    expect(authFailure.ip).toBe("203.0.113.x");
  });

  test("applies baseline security headers to app routes", async () => {
    const { app } = await loadServer({
      NODE_ENV: "production",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
    });

    const response = await request(app)
      .get("/api/app/version")
      .set("Host", "app.example.com");

    expect(response.status).toBe(200);
    expect(response.headers["x-powered-by"]).toBeUndefined();
    expect(response.headers["content-security-policy"]).toContain(
      "default-src 'self'",
    );
    expect(response.headers["referrer-policy"]).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(response.headers["permissions-policy"]).toContain(
      "geolocation=(self)",
    );
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["strict-transport-security"]).toContain("max-age=");
  });

  test("serves HTML with nonce-based CSP instead of unsafe-inline", async () => {
    const { app } = await loadServer({
      NODE_ENV: "development",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
    });

    const response = await request(app)
      .get("/html/onboarding.html")
      .set("Host", "localhost:3000");

    expect(response.status).toBe(200);
    expect(response.headers["content-security-policy"]).toContain("script-src");
    expect(response.headers["content-security-policy"]).toContain("'nonce-");
    expect(response.headers["content-security-policy"]).not.toMatch(
      /script-src[^;]*unsafe-inline/i,
    );
    expect(response.headers["content-security-policy"]).not.toMatch(
      /style-src(?!-attr)[^;]*unsafe-inline/i,
    );
    expect(response.text).toContain('id="onboarding"');
  });

  test("applies stricter anti-framing policy to reports routes", async () => {
    const { app } = await loadServer({
      NODE_ENV: "development",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
    });

    const response = await request(app)
      .get("/reports.html")
      .set("Authorization", authHeader("test-dashboard-password-12345"));

    expect(response.status).toBe(200);
    expect(response.headers["x-frame-options"]).toBe("DENY");
    expect(response.headers["content-security-policy"]).toContain(
      "frame-ancestors 'none'",
    );
    expect(response.headers["content-security-policy"]).toContain("'nonce-");
    expect(response.headers["content-security-policy"]).not.toMatch(
      /script-src[^;]*unsafe-inline/i,
    );
    expect(response.headers["content-security-policy"]).not.toMatch(
      /style-src(?!-attr)[^;]*unsafe-inline/i,
    );
    expect(response.text).toContain("<style nonce=");
  });

  test("keeps the main CSP on HTML 404 responses", async () => {
    const { app } = await loadServer({
      NODE_ENV: "production",
      DASHBOARD_PASSWORD: "test-dashboard-password-12345",
    });

    const response = await request(app)
      .get("/missing-page.html")
      .set("Host", "app.example.com");

    expect(response.status).toBe(404);
    expect(response.headers["content-security-policy"]).toContain(
      "form-action 'self'",
    );
    expect(response.headers["content-security-policy"]).toContain(
      "frame-ancestors 'self'",
    );
  });
});
