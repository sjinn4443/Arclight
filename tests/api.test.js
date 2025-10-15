const request = require("supertest");
const app = require("../server.cjs"); // Adjust path if necessary

describe("GET /", () => {
  test("should return the index.html file", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toMatch(/text\/html/);
    // You might want to check for specific content in index.html if needed
    // expect(response.text).toContain('<!DOCTYPE html>');
  });
});
