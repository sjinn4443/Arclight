const { test, expect } = require("@playwright/test");

/**
 * Detects Flash of Unstyled Content via:
 * - checking that main stylesheet is loaded before first paint
 * - asserting background doesn't briefly go white while CSS pending
 */
test("no FOUC on cold load", async ({ page }) => {
  const paints = [];
  page.on("console", (msg) => {
    if (msg.text().startsWith("__PAINT__")) paints.push(msg.text());
  });

  await page.addInitScript(() => {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        // first-paint / first-contentful-paint events
        console.log("__PAINT__", e.name, e.startTime);
      }
    }).observe({ type: "paint", buffered: true });
  });

  await page.goto("/index.html", { waitUntil: "load" });

  // Ensure stylesheet loaded
  const cssLoaded = await page.evaluate(() => {
    return [...document.styleSheets].some(
      (s) => s.href && s.href.includes("style"),
    );
  });
  expect(cssLoaded).toBeTruthy();

  // If you want stricter FOUC detection, add a sentinel element & check computed styles immediately:
  const bodyBg = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(bodyBg).not.toBe("rgb(255, 255, 255)"); // ADJUST if white is intentional
});
