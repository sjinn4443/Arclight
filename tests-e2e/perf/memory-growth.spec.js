const { test, expect } = require("@playwright/test");

/**
 * Measures JS heap after repeated page transitions.
 * Fails if heap grows beyond a reasonable delta.
 *
 * Note: requires chromium with JS heap metrics.
 */
test("no major heap growth after repeated transitions", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "heap metrics chromium only");

  await page.goto("/index.html", { waitUntil: "load" });

  async function heapUsed() {
    const m = await page.evaluate(() => performance.memory.usedJSHeapSize);
    return m || 0;
  }

  const startHeap = await heapUsed();

  // repeat navigation
  for (let i = 0; i < 25; i++) {
    await page.click('[data-route="dashboard"]'); // ADJUST
    await page.waitForTimeout(100);
    await page.click('[data-route="learningModules"]'); // ADJUST
    await page.waitForTimeout(100);
  }

  const endHeap = await heapUsed();
  const deltaMB = (endHeap - startHeap) / (1024 * 1024);

  // Budget: allow small growth, fail on big leak
  expect(deltaMB).toBeLessThan(20);
});
