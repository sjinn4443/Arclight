const request = require("supertest");
const app = require("../server.cjs"); // Import the Express app
const fs = require("fs");
const path = require("path");

// Ensure the logs directory and file exist before tests run
const logDir = path.join(__dirname, "../logs");
const logFile = path.join(logDir, "ip_logs.jsonl");

beforeAll(async () => {
  // Create logs directory if it doesn't exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  // Clear the log file before each test suite run
  fs.writeFileSync(logFile, "");
});

describe("IP Tracking Endpoint", () => {
  test("should return 200 OK and log IP and geolocation data", async () => {
    const response = await request(app)
      .post("/track")
      .set("X-Forwarded-For", "8.8.8.8"); // Simulate a request with a known IP

    expect(response.status).toBe(200);
    expect(response.text).toBe("Tracking data received.");

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
    expect(response.text).toBe("Tracking data received.");

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
