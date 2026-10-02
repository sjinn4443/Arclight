import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:8878",
    browserName: "chromium",
    channel: "chrome",
    serviceWorkers: "allow",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `${process.platform === "win32" ? "py -3" : "python3"} -m http.server 8878 --bind 127.0.0.1`,
    url: "http://127.0.0.1:8878/index.html",
    reuseExistingServer: true,
  },
});
