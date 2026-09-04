import { defineConfig } from "@playwright/test";

const port = process.env.PLAYWRIGHT_PORT || "4173";
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${port}`;
const distDir = process.env.PLAYWRIGHT_DIST_DIR || "dist";

const viewports = [
  ["320x568", 320, 568],
  ["390x844", 390, 844],
  ["844x390", 844, 390],
  ["768x1024", 768, 1024],
  ["1024x768", 1024, 768],
  ["1440x900", 1440, 900],
  ["1920x1080", 1920, 1080],
];

const projects = viewports.flatMap(([label, width, height]) => [
  {
    name: `chromium-${label}`,
    use: { browserName: "chromium", viewport: { width, height } },
  },
  {
    name: `webkit-${label}`,
    use: { browserName: "webkit", viewport: { width, height } },
  },
]);

export default defineConfig({
  testDir: "./tests-e2e",
  testMatch: /cloud-quality-audit\.spec\.js/,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "cloud-playwright-report" }],
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
    serviceWorkers: "allow",
  },
  webServer: {
    command: `cross-env PORT=${port} SERVE_DIST=true BUILD_OUTPUT_DIR=${distDir} DISABLE_DB_STORAGE=1 node server.cjs`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects,
});
