import { defineConfig } from "@playwright/test";
import base from "./playwright.config.js";

const sizes = [
  [320, 568],
  [390, 844],
  [844, 390],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  [1920, 1080],
];
export default defineConfig({
  ...base,
  testMatch: /quality-.*\.spec\.js/,
  testIgnore: [],
  workers: 2,
  timeout: 120_000,
  retries: 0,
  use: { ...base.use, trace: "off" },
  projects: [
    ...["chromium", "webkit"].flatMap((browserName) =>
      sizes.map(([width, height]) => ({
        name: `${browserName}-${width}x${height}`,
        testIgnore: /quality-offline/,
        use: {
          browserName,
          viewport: { width, height },
          serviceWorkers: "block",
        },
      })),
    ),
    {
      name: "chromium-offline",
      testMatch: /quality-offline/,
      use: {
        browserName: "chromium",
        serviceWorkers: "allow",
        viewport: { width: 390, height: 844 },
      },
    },
  ],
});
