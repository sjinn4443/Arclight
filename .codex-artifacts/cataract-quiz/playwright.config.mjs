import config from "../../playwright.config.js";
import { devices } from "@playwright/test";
import path from "node:path";

const launchOptions = { executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" };
export default {
  ...config,
  testDir: path.resolve("tests-e2e"),
  use: { ...config.use, baseURL: "http://127.0.0.1:4175", trace: "off", screenshot: "off" },
  outputDir: "C:/Users/Sujin/.codex/visualizations/2026/11/04/01a1a5ea-ca9d-7a33-b3ca-3871cb815af4/cataract-review/test-results",
  reporter: [["list"]],
  webServer: undefined,
  projects: [
    { name: "chrome-desktop", use: { browserName: "chromium", viewport: { width: 1440, height: 1200 }, launchOptions } },
    { name: "chrome-mobile", use: { ...devices["iPhone 13"], browserName: "chromium", launchOptions } },
    { name: "chrome-tablet", use: { browserName: "chromium", viewport: { width: 768, height: 1024 }, launchOptions } },
  ],
};
