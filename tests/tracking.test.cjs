/**
 * @file IP Tracking Endpoint Tests
 * @description Tests for the `/track` endpoint, ensuring IP logging, geolocation enrichment, and proper response handling.
 */
const request = require("supertest");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { decrypt } = require("../dev_dashboard/security/encrypt.cjs"); // Import decrypt

let logDir;
let logFile;
let app;
let server;

// Use require for CommonJS modules
const jestGlobals = require("@jest/globals");
const mockEnrichIp = jest.fn();

beforeAll(async () => {
  jest.resetModules(); // Reset module registry to ensure server.cjs is re-evaluated
  jest.useFakeTimers({ legacyFakeTimers: true });
  logDir = fs.mkdtempSync(path.join(os.tmpdir(), "iplogs-"));
  logFile = path.join(logDir, "ip_logs.jsonl");

  // Mock the path module to redirect LOG_FILE in server.cjs
  jest.doMock("path", () => ({
    ...jest.requireActual("path"),
    join: (...args) => {
      if (args[args.length - 1] === "telemetry.ndjson") {
        return logFile;
      }
      return jest.requireActual("path").join(...args);
    },
  }));

  // Mock the ipEnricher module for CommonJS require in server.cjs
  jest.doMock("../utils/ipEnricher.cjs", () => ({
    enrichIp: mockEnrichIp,
  }));

  // Use require for CommonJS modules
  const { app: importedApp } = require("../server.cjs");
  app = importedApp;
  server = app.listen(3002); // Use a different port for testing
});

beforeEach(() => {
  fs.writeFileSync(logFile, ""); // Clear the log file before each test
  mockEnrichIp.mockClear(); // Clear calls for this mock
  // Mock implementation for enrichIp
  mockEnrichIp.mockImplementation((ip) => {
    // Use mockEnrichIp directly
    if (ip === "8.8.8.8") {
      return {
        source: "mock",
        country: "US",
        city: "Mountain View",
        lat: 37.406,
        lon: -122.0785,
        timezone: "America/Los_Angeles",
      };
    } else {
      // For local IPs or unknown IPs
      return {
        source: "mock",
        country: null,
        city: null,
        lat: null,
        lon: null,
        timezone: null,
      };
    }
  });
});

afterAll((done) => {
  fs.rmSync(logDir, { recursive: true, force: true });
  jest.restoreAllMocks(); // Restore all mocks
  server.close(done);
});

describe("IP Tracking Endpoint", () => {
  test("should return 204 No Content and log IP and geolocation data", async () => {
    const response = await request(app)
      .post("/track")
      .set("X-Forwarded-For", "8.8.8.8"); // Simulate a request with a known IP

    expect(response.status).toBe(204);
    expect(response.body).toEqual({}); // Expect empty body for 204 No Content

    // Allow any pending microtasks to complete and advance timers
    jest.advanceTimersByTime(1000); // Advance timers by 1 second to ensure Date.now() is updated
    await new Promise(process.nextTick);

    // Read the log file and check its content
    const logContent = fs.readFileSync(logFile, "utf8");
    const logEntries = logContent
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(decrypt(line))); // Decrypt and parse each line
    expect(logEntries.length).toBe(1);

    const loggedData = logEntries[0];
    expect(loggedData.ip).toBe("8.8.8.8");
    expect(loggedData.geo).toBeDefined();
    expect(loggedData.geo.country).toBe("US"); // GeoIP for 8.8.8.8 is US
    expect(loggedData.geo.city).toBe("Mountain View");
    expect(loggedData.geo.timezone).toBe("America/Los_Angeles");
    expect(loggedData.ts).toBeDefined(); // This assertion should now pass
  }, 10000);

  test("should handle requests without X-Forwarded-For header", async () => {
    // The middleware in server.cjs will set req.socket.remoteAddress to 127.0.0.1 in test environment
    const response = await request(app).post("/track");

    expect(response.status).toBe(204);
    expect(response.body).toEqual({}); // Expect empty body for 204 No Content

    // Allow any pending microtasks to complete and advance timers
    jest.advanceTimersByTime(1000); // Advance timers by 1 second to ensure Date.now() is updated
    await new Promise(process.nextTick);

    const logContent = fs.readFileSync(logFile, "utf8");
    const logEntries = logContent
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(decrypt(line))); // Decrypt and parse each line
    expect(logEntries.length).toBe(1); // Should be 1 as log file is cleared before each test

    const loggedData = logEntries[0]; // Check the first (and only) entry
    expect(loggedData.ip).toBe("::ffff:127.0.0.1"); // Should have the IPv6-mapped IPv4 address from middleware
    expect(loggedData.geo).toBeDefined();
    expect(loggedData.geo.country).toBeNull();
    expect(loggedData.geo.city).toBeNull();
    expect(loggedData.geo.timezone).toBeNull();
    expect(loggedData.ts).toBeDefined(); // This assertion should now pass
  }, 10000);

  // Add more tests as needed, e.g., for invalid IPs, rate limiting, etc.
});
