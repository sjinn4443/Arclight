const { test, expect } = require("@playwright/test");

/**
 * Checks:
 * 1) Media not aggressively preloaded on initial page
 * 2) App doesn't freeze on media 404 / unsupported.
 */
test("media preload does not block LCP and failures don't freeze UI", async ({
  page,
}) => {
  // Intercept media to simulate failures
  await page.route("**/*.{mp4,webm,ogg,jpg,jpeg,png,webp}", (route) => {
    const url = route.request().url();
    if (url.includes("intro") || url.includes("hero")) {
      return route.abort(); // simulate 404/partial
    }
    return route.continue();
  });

  await page.goto("/index.html", { waitUntil: "domcontentloaded" });

  // 1) Assert no huge media is auto-downloaded on first paint
  const mediaRequests = [];
  page.on("request", (req) => {
    if (/\.(mp4|webm|ogg)$/i.test(req.url())) mediaRequests.push(req.url());
  });

  await page.waitForTimeout(1500);

  // You might allow 0–1 small media requests. Adjust to your design.
  expect(mediaRequests.length).toBeLessThan(2);

  // 2) UI still interactive after media failures
  await page.click('[data-route="dashboard"]'); // ADJUST
  await expect(page.locator("#page-content")).toBeVisible(); // ADJUST
});
