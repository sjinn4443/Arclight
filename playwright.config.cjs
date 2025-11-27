/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  testDir: "./tests-e2e",
  use: {
    baseURL: "http://localhost:3000", // ADJUST to your dev server port
  },
  webServer: {
    command: "node server.cjs", // ADJUST if different
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
};
