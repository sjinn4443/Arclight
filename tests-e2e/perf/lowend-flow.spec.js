const { test, expect } = require("@playwright/test");

/**
 * Uses Chromium CPU slowdown to mimic low-end devices.
 * We measure key navigation actions and fail if they exceed budget.
 */
test("core flow under CPU throttling does not stutter", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "throttling supported in chromium only",
  );

  const client = await page.context().newCDPSession(page);
  await client.send("Emulation.setCPUThrottlingRate", { rate: 6 }); // 4–6x

  await page.goto("/index.html", { waitUntil: "load" });

  const t0 = Date.now();
  await page.click('[data-route="dashboard"]'); // ADJUST selector
  await page.waitForTimeout(200); // allow render
  await page.click('[data-route="learningModules"]'); // ADJUST selector
  await page.waitForTimeout(200);

  const elapsed = Date.now() - t0;

  // Budget: tweak to your reality after first run
  expect(elapsed).toBeLessThan(6000);
});
