import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
});

test("offers downloads once after 15 clicks following dashboard entry", async ({
  page,
}, testInfo) => {
  await page.goto("/#/dashboard");
  await expect(page.locator("#unifiedDashboard")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() =>
        localStorage.getItem("dashboard_greeting_load_count"),
      ),
    )
    .not.toBeNull();
  await page.evaluate(() => {
    for (let i = 0; i < 14; i++) document.body.click();
  });
  await expect(page.locator("#downloadSuggestionModal")).toHaveCount(0);
  await page.evaluate(() => document.body.click());
  const modal = page.locator("#downloadSuggestionModal");
  await expect(modal).toBeVisible();
  await modal.screenshot({
    path: testInfo.outputPath("download-suggestion.png"),
  });
  await modal.getByRole("button", { name: "Not now" }).click();
  await page.reload();
  await expect(page.locator("#unifiedDashboard")).toBeVisible();
  await page.evaluate(() => {
    for (let i = 0; i < 20; i++) document.body.click();
  });
  await expect(modal).toHaveCount(0);
});

test("opens a warmed inventory immediately and expands downloaded content details", async ({
  page,
}, testInfo) => {
  const urls = [
    "/js/main.js",
    "/videos/Core/Pupils/pupil_220p.mp4",
    "/videos/Core/Pupils/pupil_720p.mp4",
    "/subapp/Mires/index.html",
    "/subapp/Mires/main.js",
  ];
  let manifestRequests = 0;
  await page.route("**/api/app/offline-assets", (route) => {
    manifestRequests += 1;
    return route.fulfill({
      json: { urls, assets: urls.map((url) => ({ url, bytes: 1000 })) },
    });
  });
  await page.goto("/#/dashboard");
  await expect(page.locator("#unifiedDashboard")).toBeVisible();
  await page.evaluate(async () => {
    const cache = await caches.open("arclight-packs-v1");
    await cache.put(
      "/videos/Core/Pupils/pupil_220p.mp4",
      new Response("video"),
    );
    await cache.put("/subapp/Mires/index.html", new Response("app"));
    (await import("/js/offlineDownloadState.js")).invalidateOfflineInventory();
    await (
      await import("/js/downloadedContents.js")
    ).refreshDownloadedContents();
  });
  const requests = manifestRequests;
  await page.evaluate(async () =>
    (await import("/js/menu.js")).openDownloadedContentsModal(),
  );
  const modal = page.locator("#downloadedContentsModal");
  await expect(modal).toBeVisible();
  await expect(modal.locator(".downloaded-content-loading")).toHaveCount(0);
  const group = modal.locator('[data-content-group="core"]');
  await expect(group.locator("summary .content-download-count")).toHaveText(
    "1/2",
  );
  await expect(group.locator("summary progress")).toHaveAttribute("value", "1");
  await expect(group.locator(".downloaded-content-details li")).toHaveCount(0);
  await group.locator("summary").click();
  await expect(group.locator(".downloaded-content-details li")).toHaveCount(2);
  await expect(group.locator(".downloaded-content-details")).toContainText(
    "Downloaded",
  );
  await expect(group.locator(".downloaded-content-details")).toContainText(
    "Download incomplete",
  );
  const box = await modal.locator(".download-modal").boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize().width);
  await modal.screenshot({
    path: testInfo.outputPath("downloaded-content-details.png"),
  });
  await modal.locator("#downloadedContentsCloseBtn").click();
  await page.evaluate(async () =>
    (await import("/js/menu.js")).openDownloadedContentsModal(),
  );
  await expect(modal.locator(".downloaded-content-loading")).toHaveCount(0);
  expect(manifestRequests).toBe(requests);
});
