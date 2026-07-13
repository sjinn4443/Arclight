/**
 * @file Reports (Dev Dashboard) Basic Auth Tests
 * @description Verifies that the reports pages and dev users API are protected by Basic Auth.
 */

const request = require("supertest");

let app;
let server;

function basic(user, pass) {
  return Buffer.from(`${user}:${pass}`, "utf8").toString("base64");
}

describe("Reports Basic Auth", () => {
  beforeAll(async () => {
    process.env.DASHBOARD_PASSWORD = "test-pass";

    // This test is about auth wiring, not storage correctness.
    // Mock storage so /api/dev/users returns quickly.
    jest.resetModules();
    jest.doMock("../storage/index.cjs", () => ({
      init: async () => {},
      saveProfile: async () => {},
      bumpRefresh: async () => {},
      saveIp: async () => {},
      updateIpLocation: async () => {},
      getUsersForDashboard: async () => [],
      getIpLocationsForDashboard: async () => [],
    }));

    const { app: importedApp } = require("../server.cjs");
    app = importedApp;
    server = app.listen(0);
  });

  afterAll((done) => {
    server.close(done);
  });

  test("GET /reports.html should require auth", async () => {
    const res = await request(app).get("/reports.html");
    expect(res.status).toBe(401);
    expect(res.headers["www-authenticate"]).toMatch(/Basic/i);
  });

  test("GET /reports.html should allow with valid auth", async () => {
    const res = await request(app)
      .get("/reports.html")
      .set("Authorization", `Basic ${basic("user", "test-pass")}`);

    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Arclight Reports/);
  });

  test("GET /js/reports.js should be served", async () => {
    const res = await request(app).get("/js/reports.js");

    // The reports page imports this module; it must exist in both dev and prod.
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/javascript|text\/plain/i);
    expect(res.text).toMatch(/renderUsers|fetchUsers|initWorldMap/);
  });

  test("GET /api/dev/users should require auth", async () => {
    const res = await request(app).get("/api/dev/users");
    expect(res.status).toBe(401);
    expect(res.headers["www-authenticate"]).toMatch(/Basic/i);
  });

  test("GET /api/dev/users should allow with valid auth", async () => {
    const res = await request(app)
      .get("/api/dev/users")
      .set("Authorization", `Basic ${basic("user", "test-pass")}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/dev/ip-locations should require auth", async () => {
    const res = await request(app).get("/api/dev/ip-locations");
    expect(res.status).toBe(401);
    expect(res.headers["www-authenticate"]).toMatch(/Basic/i);
  });

  test("GET /api/dev/ip-locations should allow with valid auth", async () => {
    const res = await request(app)
      .get("/api/dev/ip-locations")
      .set("Authorization", `Basic ${basic("user", "test-pass")}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
