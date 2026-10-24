import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config.js";

export default defineConfig({
  ...base,
  testMatch: /download-offline\.spec\.js/,
  testIgnore: [],
  timeout: 240_000,
  workers: 1,
  use: { ...base.use, serviceWorkers: "allow", trace: "off" },
  projects: [
    { name: "desktop-chromium", use: { browserName: "chromium" } },
    {
      name: "android-phone",
      use: { ...devices["Pixel 7"], browserName: "chromium" },
    },
    {
      name: "android-tablet",
      use: {
        browserName: "chromium",
        viewport: { width: 800, height: 1280 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "iphone-webkit",
      use: { ...devices["iPhone 13"], browserName: "webkit" },
    },
    {
      name: "ipad-webkit",
      use: { ...devices["iPad (gen 7)"], browserName: "webkit" },
    },
  ],
});
