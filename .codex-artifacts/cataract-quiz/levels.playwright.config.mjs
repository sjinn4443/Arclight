import base from "../../playwright.config.js";
export default {
  ...base,
  testDir: "../../tests-e2e",
  webServer: undefined,
  reporter: "line",
  workers: 2,
  use: { ...base.use, baseURL: "http://127.0.0.1:4279", launchOptions: { executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" } },
  projects: [
    { name: "chrome-desktop", use: { browserName: "chromium", viewport: { width: 1440, height: 1200 } } },
    { name: "chrome-mobile", use: { browserName: "chromium", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
};
