/**
 * @file Jest Setup
 * @description Configuration and setup for Jest test environment, including polyfills and environment variables.
 */
import { jest } from "@jest/globals";
import { TextEncoder, TextDecoder } from "util";
import fetch from "node-fetch";

// Ensure tests always have a valid 32-byte Base64 key
if (!process.env.MASTER_KEY) {
  process.env.MASTER_KEY = "QRBZ8JOF2JJt0/ot17q7PMWRuc+wAtXKMlFLY67jFKg="; // 32 bytes in Base64
}

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.fetch = fetch;

// Suppress console.warn and console.error messages globally during tests to reduce noise.
let consoleWarnSpy;
let consoleErrorSpy;

beforeEach(() => {
  consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  consoleWarnSpy?.mockRestore();
  consoleErrorSpy?.mockRestore();
});
