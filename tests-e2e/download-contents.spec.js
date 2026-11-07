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
    "/images/learning/Ears/ears/image20.webp",
    "/images/learning/Ears/ears/image8.webp",
    "/images/learning/Ears/ears/image25.webp",
    "/videos/Ears/otoscopy-arclight_220p.mp4",
    "/subapp/Allan/index.html",
    "/subapp/Allan/main.js",
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
    await cache.put("/subapp/Allan/index.html", new Response("skin app"));
    for (const url of [
      "/images/learning/Ears/ears/image20.webp",
      "/images/learning/Ears/ears/image8.webp",
      "/images/learning/Ears/ears/image25.webp",
      "/videos/Ears/otoscopy-arclight_220p.mp4",
    ])
      await cache.put(url, new Response("ear content"));
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
  const roots = modal.locator(
    ".modal-content > .downloaded-content-list > li > details",
  );
  await expect(
    roots.locator(":scope > summary .downloaded-content-item__title"),
  ).toHaveText(["Eyes", "Ears", "Skin"]);
  await expect(modal.locator("details")).toHaveCount(3);
  await modal.screenshot({
    path: testInfo.outputPath("downloaded-categories.png"),
  });
  const eyes = modal.locator('[data-content-group="eyes"]');
  await expect(
    eyes.locator(":scope > summary .content-download-count"),
  ).toHaveText("1/2");
  await eyes.locator(":scope > summary").click();
  const pupils = modal.locator('[data-content-group="eyes/core-pupils"]');
  await expect(pupils).toBeVisible();
  await expect(pupils.locator(".downloaded-content-details li")).toHaveCount(0);
  await pupils.locator("summary").click();
  await expect(pupils.locator(".downloaded-content-details li")).toHaveCount(1);
  await expect(pupils.locator(".downloaded-content-details")).toContainText(
    "Downloaded",
  );
  const interactive = modal.locator(
    '[data-content-group="eyes/core-interactive-learning"]',
  );
  await interactive.locator("summary").click();
  await expect(
    interactive.locator(".downloaded-content-details"),
  ).toContainText("Download incomplete");
  await eyes.locator(":scope > summary").click();
  const ears = modal.locator('[data-content-group="ears"]');
  await ears.locator(":scope > summary").click();
  const anatomy = modal.locator('[data-content-group="ears/earsAnatomy"]');
  await expect(anatomy.locator("summary")).toContainText(
    "Ear Health & Anatomy",
  );
  await anatomy.locator("summary").click();
  await expect(anatomy.locator(".downloaded-content-details")).toContainText(
    "How We Hear",
  );
  await expect(
    anatomy.locator(".downloaded-content-details .content-download-count"),
  ).toContainText(["Downloaded"]);
  await modal.screenshot({
    path: testInfo.outputPath("downloaded-ears-details.png"),
  });
  await ears.locator(":scope > summary").click();
  const skin = modal.locator('[data-content-group="skin"]');
  await skin.locator("summary").click();
  const skinApp = modal.locator(
    '[data-content-group="skin/interactive-learning"]',
  );
  await skinApp.locator("summary").click();
  await expect(skinApp.locator(".downloaded-content-details")).toContainText(
    "Allan",
  );
  await expect(skinApp.locator(".downloaded-content-details")).toContainText(
    "Download incomplete",
  );
  await skin.locator(":scope > summary").click();
  await eyes.locator(":scope > summary").click();
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

test("shows Eyes, Ears and Skin when there are no downloads", async ({
  page,
}) => {
  await page.route("**/api/app/offline-assets", (route) =>
    route.fulfill({
      json: {
        urls: ["/js/main.js"],
        assets: [{ url: "/js/main.js", bytes: 100 }],
      },
    }),
  );
  await page.goto("/#/dashboard");
  await expect(page.locator("#unifiedDashboard")).toBeVisible();
  await page.evaluate(async () =>
    (await import("/js/menu.js")).openDownloadedContentsModal(),
  );
  const modal = page.locator("#downloadedContentsModal");
  await expect(
    modal.locator("summary .downloaded-content-item__title"),
  ).toHaveText(["Eyes", "Ears", "Skin"]);
  await expect(modal.locator("summary .content-download-count")).toHaveText([
    "0/0",
    "0/0",
    "0/0",
  ]);
  await modal.locator('[data-content-group="eyes"] > summary').click();
  await expect(modal.locator(".downloaded-content-empty")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();
});
