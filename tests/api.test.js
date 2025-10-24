import request from "supertest";

let app; // Declare app here

describe("GET /", () => {
  beforeAll(async () => {
    // Dynamically import app after dotenv has configured environment variables
    const appModule = await import("../server.cjs");
    app = appModule.default;
  });

  test("should return the index.html file", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toMatch(/text\/html/);
    // You might want to check for specific content in index.html if needed
    // expect(response.text).toContain('<!DOCTYPE html>');
  });
});
