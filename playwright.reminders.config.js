import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

const port = process.env.REMINDER_TEST_PORT || "4187";
export default defineConfig({
  testDir: "./tests-e2e",
  testMatch: "practice-reminders.spec.js",
  timeout: 45000,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    serviceWorkers: "block",
    trace: "retain-on-failure",
  },
  webServer: process.env.REMINDER_TEST_EXTERNAL
    ? undefined
    : {
        command: `"${process.execPath}" server.cjs`,
        url: `http://127.0.0.1:${port}/healthz`,
        reuseExistingServer: false,
        env: {
          NODE_ENV: "test",
          PORT: port,
          HOST: "127.0.0.1",
          DISABLE_DB_STORAGE: "1",
          SERVE_DIST: "false",
          STATIC_ROOT_DIR: "public",
          WEB_PUSH_ENABLED: "false",
        },
      },
  projects: [
    {
      name: "iphone-13-mini",
      // Validate the installed iOS notification settings; the synthetic iframe
      // practice fixture below remains covered by the existing Chromium projects.
      grep: /settings opt in|unconfigured push|server database problems|notification history|notification inbox/,
      use: { ...devices["iPhone 13 Mini"], browserName: "webkit" },
    },
    {
      name: "desktop",
      use: {
        browserName: "chromium",
        channel: "chrome",
        viewport: { width: 1280, height: 1000 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
        browserName: "chromium",
        channel: "chrome",
      },
    },
  ],
});
