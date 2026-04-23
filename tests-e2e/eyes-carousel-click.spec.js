import { expect, test } from "@playwright/test";

const ROUTE_READY_TIMEOUT_MS = 30_000;
const NAVIGATION_TIMEOUT_MS = 12_000;

test.describe("Eyes carousel desktop click", () => {
  test("opens the selected card route on a plain desktop click", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium-desktop",
      "This check covers the desktop-only mouse drag logic.",
    );

    await page.addInitScript(() => {
      try {
        localStorage.setItem("arclight:onboarded", "1");
      } catch {
        // Ignore storage failures in constrained browser contexts.
      }
    });

    await page.goto("/#eyes", {
      waitUntil: "domcontentloaded",
      timeout: ROUTE_READY_TIMEOUT_MS,
    });

    const firstCard = page.locator("#coreCarousel .eyes-card").first();
    await expect(firstCard).toBeVisible({
      timeout: ROUTE_READY_TIMEOUT_MS,
    });
    await expect(firstCard).toHaveAttribute("data-target", "casestudy");

    await firstCard.click();

    await expect
      .poll(async () => page.evaluate(() => window.location.hash), {
        timeout: NAVIGATION_TIMEOUT_MS,
      })
      .toContain("casestudy");

    await expect(page.locator("#casestudyPage")).toBeVisible({
      timeout: NAVIGATION_TIMEOUT_MS,
    });
  });
});
