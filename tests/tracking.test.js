const request = require("supertest");
const app = require("../server.cjs"); // Import the Express app
const fs = require("fs");
const path = require("path");
const os = require("os");

let logDir;
let logFile;
let appendFileSpy;

beforeAll(() => {
  logDir = fs.mkdtempSync(path.join(os.tmpdir(), "iplogs-"));
  logFile = path.join(logDir, "ip_logs.jsonl");
  fs.writeFileSync(logFile, "");

  // Mock fs.appendFile to write to the temporary log file
  appendFileSpy = jest
    .spyOn(fs, "appendFile")
    .mockImplementation((file, data, callback) => {
      fs.appendFileSync(logFile, data); // Use sync version for simplicity in mock
      callback(null); // Call callback with no error
    });
});

afterAll(() => {
  appendFileSpy.mockRestore(); // Restore original fs.appendFile
  fs.rmSync(logDir, { recursive: true, force: true });
});

describe("IP Tracking Endpoint", () => {
  test("should return 200 OK and log IP and geolocation data", async () => {
    const response = await request(app)
      .post("/track")
      .set("X-Forwarded-For", "8.8.8.8"); // Simulate a request with a known IP

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.ip).toBe("8.8.8.8");
    expect(response.body.country).toBe("US");
    expect(response.body.city).toBe("");
    expect(response.body.timezone).toBe("America/Chicago");

    // Read the log file and check its content
    const logContent = fs.readFileSync(logFile, "utf8");
    const logEntries = logContent.trim().split("\n");
    expect(logEntries.length).toBe(1);

    const loggedData = JSON.parse(logEntries[0]);
    expect(loggedData.ip).toBe("8.8.8.8");
    expect(loggedData.geo).toBeDefined();
    expect(loggedData.geo.country).toBe("US"); // GeoIP for 8.8.8.8 is US
    expect(loggedData.timestamp).toBeDefined();
  });

  test("should handle requests without X-Forwarded-For header", async () => {
    // Note: When running locally without a proxy, req.socket.remoteAddress will be used.
    // This test might be flaky depending on the execution environment.
    // For a more robust test, one might mock req.socket.remoteAddress.
    // For now, we'll assume it's available and has a value.
    const response = await request(app).post("/track");

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.ip).not.toBeUndefined();
    expect(response.body.country).toBeNull();
    expect(response.body.city).toBeNull();
    expect(response.body.timezone).toBeNull();

    const logContent = fs.readFileSync(logFile, "utf8");
    const logEntries = logContent.trim().split("\n");
    expect(logEntries.length).toBe(2); // One from the previous test, one from this

    const loggedData = JSON.parse(logEntries[1]); // Check the second entry
    expect(loggedData.ip).not.toBeUndefined(); // Should have an IP
    expect(loggedData.geo).toBeDefined();
    expect(loggedData.timestamp).toBeDefined();
  });

  // Add more tests as needed, e.g., for invalid IPs, rate limiting, etc.
});
