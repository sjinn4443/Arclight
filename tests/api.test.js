import request from "supertest";
import { app, closeServer } from "../server.cjs";

let server;

describe("GET /", () => {
  beforeAll(() => {
    server = app.listen(3001); // Use a different port for testing
  });

  afterAll((done) => {
    server.close(done);
  });

  test("should return the index.html file", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toMatch(/text\/html/);
    // You might want to check for specific content in index.html if needed
    // expect(response.text).toContain('<!DOCTYPE html>');
  });
});
