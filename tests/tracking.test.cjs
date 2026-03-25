/**
 * @jest-environment node
 */
const request = require("supertest");

const ORIGINAL_ENV = { ...process.env };

function authHeader(password, user = "dev") {
  return `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`;
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
    getUsersForDashboard: jest.fn().mockResolvedValue([]),
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
      DASHBOARD_PASSWORD: "secret",
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

  test("persists telemetry only for allowed production hosts and strips unknown fields", async () => {
    const { app, mockStorage } = await loadServer({
      NODE_ENV: "production",
      TELEMETRY_ALLOWED_HOSTS: "app.example.com",
      DASHBOARD_PASSWORD: "secret",
    });

    const blocked = await request(app)
      .post("/api/app/profile")
      .set("Host", "localhost:3000")
      .send({ anon_id: "anon-1", name: "Blocked Local" });

    expect(blocked.status).toBe(200);
    expect(blocked.body).toEqual({ ok: true, stored: false });
    expect(mockStorage.saveProfile).not.toHaveBeenCalled();

    const allowed = await request(app)
      .post("/api/app/profile")
      .set("Host", "app.example.com")
      .send({
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

  test("rate limits repeated bad auth attempts on the reports API", async () => {
    const { app } = await loadServer({
      NODE_ENV: "development",
      DASHBOARD_PASSWORD: "secret",
    });

    let response;
    for (let i = 0; i < 11; i += 1) {
      response = await request(app)
        .get("/api/dev/users")
        .set("Authorization", authHeader("wrong-password"));
    }

    expect(response.status).toBe(429);
    expect(response.text).toMatch(/Too many authentication attempts/i);
  });

  test("keeps reports read-only locally by default", async () => {
    const { app, mockStorage } = await loadServer(
      {
        NODE_ENV: "development",
        DASHBOARD_PASSWORD: "secret",
      },
      {
        getUsersForDashboard: jest
          .fn()
          .mockResolvedValue([{ anon_id: "anon-1" }]),
      },
    );

    const response = await request(app)
      .get("/api/dev/users")
      .set("Authorization", authHeader("secret"))
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
        DASHBOARD_PASSWORD: "secret",
        REPORTS_ALLOW_LOCAL_DELETE: "true",
      },
      {
        deleteUserForDashboard: deleteSpy,
      },
    );

    const response = await request(app)
      .delete("/api/dev/users/anon-1")
      .set("Authorization", authHeader("secret"))
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

  test("applies baseline security headers to app routes", async () => {
    const { app } = await loadServer({
      NODE_ENV: "production",
      DASHBOARD_PASSWORD: "secret",
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

  test("applies stricter anti-framing policy to reports routes", async () => {
    const { app } = await loadServer({
      NODE_ENV: "development",
      DASHBOARD_PASSWORD: "secret",
    });

    const response = await request(app)
      .get("/api/dev/users")
      .set("Authorization", authHeader("secret"));

    expect(response.status).toBe(200);
    expect(response.headers["x-frame-options"]).toBe("DENY");
    expect(response.headers["content-security-policy"]).toContain(
      "frame-ancestors 'none'",
    );
  });
});
