/**
 * @jest-environment node
 */

const request = require("supertest");

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  jest.resetModules();
  jest.restoreAllMocks();
  process.env = { ...ORIGINAL_ENV };
});

test("computes Git-backed version metadata once at server startup", async () => {
  jest.resetModules();
  process.env = {
    ...ORIGINAL_ENV,
    NODE_ENV: "development",
    STATIC_ROOT_DIR: "tests/fixtures/offline-root",
    DASHBOARD_PASSWORD: "test-dashboard-password-0123456789",
    TELEMETRY_TOKEN_SECRET: "test-telemetry-token-secret-0123456789abcdef",
  };

  const execSync = jest.fn((command) => {
    if (String(command).includes("--first-parent")) {
      return "2026-07-15T10:00:00Z\n2026-07-15T09:00:00Z\n";
    }
    return "2026-07-15T10:00:00Z\n";
  });
  jest.doMock("child_process", () => ({ execSync }));
  jest.doMock("../storage/index.cjs", () => ({
    init: jest.fn().mockResolvedValue(undefined),
    saveProfile: jest.fn(),
    bumpRefresh: jest.fn(),
    saveIp: jest.fn(),
    getUsersForDashboard: jest.fn().mockResolvedValue([]),
    getIpLocationsForDashboard: jest.fn().mockResolvedValue([]),
    deleteUserForDashboard: jest.fn(),
  }));

  const { app } = require("../server.cjs");
  const startupCalls = execSync.mock.calls.length;
  const first = await request(app).get("/api/app/version");
  const second = await request(app).get("/api/app/version");

  expect(first.status).toBe(200);
  expect(first.body).toEqual({
    versionDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    versionSequence: expect.any(Number),
  });
  expect(second.body).toEqual(first.body);
  expect(execSync).toHaveBeenCalledTimes(startupCalls);
});
