import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "../../tests-e2e",
  testMatch: /(?:eye-pad-shield-folders|eye-care-procedures).spec.js/,
  outputDir: "folder-results",
  timeout: 60000,
  expect: { timeout: 15000 },
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4175",
    serviceWorkers: "block",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        browserName: "chromium",
        channel: "chrome",
        viewport: { width: 1440, height: 1200 },
      },
    },
    { name: "iphone", use: { ...devices["iPhone 13"], browserName: "webkit" } },
  ],
});
