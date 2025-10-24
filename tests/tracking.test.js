import request from "supertest";
import fs from "fs";
import path from "path";
import os from "os";

let logDir;
let logFile;
let app; // Declare app here

import {
  jest,
  beforeAll,
  beforeEach,
  afterAll,
  describe,
  it,
  expect,
} from "@jest/globals";

// Declare the mock function here
const mockEnrichIp = jest.fn();

beforeAll(async () => {
  jest.resetModules(); // Reset module registry to ensure server.cjs is re-evaluated
  jest.useFakeTimers({ legacyFakeTimers: true });
  logDir = fs.mkdtempSync(path.join(os.tmpdir(), "iplogs-"));
  logFile = path.join(logDir, "ip_logs.jsonl");

  // Mock the path module to redirect LOG_FILE in server.cjs
  jest.doMock("path", () => {
    const originalPath = jest.requireActual("path");
    return {
      ...originalPath,
      join: jest.fn((...args) => {
        // Intercept the specific path for ip_logs.jsonl
        if (
          args.length === 3 &&
          args[1] === "logs" &&
          args[2] === "ip_logs.jsonl"
        ) {
          return logFile;
        }
        return originalPath.join(...args);
      }),
    };
  });

  // Mock the ipEnricher module for CommonJS require in server.cjs
  jest.doMock("../utils/ipEnricher.cjs", () => ({
    enrichIp: mockEnrichIp,
  }));

  // Dynamically import app after dotenv has configured environment variables
  const appModule = await import("../server.cjs");
  app = appModule.default;
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

afterAll(() => {
  fs.rmSync(logDir, { recursive: true, force: true });
  jest.restoreAllMocks(); // Restore all mocks
});

describe("IP Tracking Endpoint", () => {
  test("should return 204 No Content and log IP and geolocation data", async () => {
    const response = await request(app)
      .post("/track")
      .set("X-Forwarded-For", "8.8.8.8"); // Simulate a request with a known IP

    expect(response.status).toBe(204);
    expect(response.body).toEqual({}); // Expect empty body for 204 No Content

    // Allow any pending microtasks to complete
    await new Promise(process.nextTick);

    // Read the log file and check its content
    const logContent = fs.readFileSync(logFile, "utf8");
    const logEntries = logContent.trim().split("\n").filter(Boolean); // Filter out empty strings
    expect(logEntries.length).toBe(1);

    const loggedData = JSON.parse(logEntries[0]);
    expect(loggedData.ip).toBe("8.8.8.8");
    expect(loggedData.geo).toBeDefined();
    expect(loggedData.geo.country).toBe("US"); // GeoIP for 8.8.8.8 is US
    expect(loggedData.geo.city).toBe("Mountain View");
    expect(loggedData.geo.timezone).toBe("America/Los_Angeles");
    expect(loggedData.timestamp).toBeDefined();
  }, 10000);

  test("should handle requests without X-Forwarded-For header", async () => {
    // Note: When running locally without a proxy, req.socket.remoteAddress will be used.
    // This test might be flaky depending on the execution environment.
    // For a more robust test, one might mock req.socket.remoteAddress.
    // For now, we'll assume it's available and has a value.
    const response = await request(app).post("/track");

    expect(response.status).toBe(204);
    expect(response.body).toEqual({}); // Expect empty body for 204 No Content

    // Allow any pending microtasks to complete
    await new Promise(process.nextTick);

    const logContent = fs.readFileSync(logFile, "utf8");
    const logEntries = logContent.trim().split("\n").filter(Boolean); // Filter out empty strings
    expect(logEntries.length).toBe(1); // Should be 1 as log file is cleared before each test

    const loggedData = JSON.parse(logEntries[0]); // Check the first (and only) entry
    expect(loggedData.ip).not.toBeUndefined(); // Should have an IP
    expect(loggedData.geo).toBeDefined();
    expect(loggedData.geo.country).toBeNull();
    expect(loggedData.geo.city).toBeNull();
    expect(loggedData.geo.timezone).toBeNull();
    expect(loggedData.timestamp).toBeDefined();
  }, 10000);

  // Add more tests as needed, e.g., for invalid IPs, rate limiting, etc.
});
