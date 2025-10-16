const request = require("supertest");
const app = require("../server.cjs"); // Import the Express app
const fs = require("fs");
const path = require("path");
const os = require("os");

// Mock the ipEnricher module
jest.mock("../utils/ipEnricher.cjs", () => ({
  enrichIp: jest.fn(),
}));
const { enrichIp } = require("../utils/ipEnricher.cjs");

let logDir;
let logFile;
let appendFileSpy;
let originalAppendFileSync;

beforeAll(() => {
  jest.useFakeTimers({ legacyFakeTimers: true });
  logDir = fs.mkdtempSync(path.join(os.tmpdir(), "iplogs-"));
  logFile = path.join(logDir, "ip_logs.jsonl");

  originalAppendFileSync = jest.requireActual("fs").appendFileSync; // Store the actual implementation

  // Mock fs.appendFileSync to write to the temporary log file
  appendFileSpy = jest
    .spyOn(fs, "appendFileSync")
    .mockImplementation((file, data) => {
      originalAppendFileSync(logFile, data); // Use the stored actual implementation
    });
});

beforeEach(() => {
  fs.writeFileSync(logFile, ""); // Clear the log file before each test
  // Mock implementation for enrichIp
  enrichIp.mockImplementation((ip) => {
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
  appendFileSpy.mockRestore(); // Restore original fs.appendFile
  fs.rmSync(logDir, { recursive: true, force: true });
  jest.restoreAllMocks(); // Restore all mocks, including enrichIp
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
    const logEntries = logContent.trim().split("\n");
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
    const logEntries = logContent.trim().split("\n");
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
