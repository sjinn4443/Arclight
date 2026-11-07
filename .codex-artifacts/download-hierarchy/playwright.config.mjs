import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "../../tests-e2e",
  testMatch: /download-contents\.spec\.js/,
  timeout: 60000,
  expect: { timeout: 10000 },
  workers: 2,
  reporter: [["list"]],
  outputDir: "results",
  use: { baseURL: "http://127.0.0.1:4187", serviceWorkers: "block", screenshot: "only-on-failure" },
  projects: [
    { name: "chrome-desktop", use: { browserName: "chromium", channel: "chrome", viewport: { width: 1440, height: 1200 } } },
    { name: "chrome-tablet", use: { browserName: "chromium", channel: "chrome", viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true } },
    { name: "chrome-mobile", use: { ...devices["iPhone 13"], browserName: "chromium", channel: "chrome" } },
  ],
});
