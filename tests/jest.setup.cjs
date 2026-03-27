/**
 * @file Jest Setup
 * @description Configuration and setup for the Jest test environment.
 */
import { jest } from "@jest/globals";
import { TextEncoder, TextDecoder } from "util";
import fetch from "node-fetch";

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
