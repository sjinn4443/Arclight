import { test, expect } from "@playwright/test";

test("download options support multiple sections and show cache status on desktop and mobile", async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
  await page.route("**/api/app/offline-assets", (route) =>
    route.fulfill({
      json: {
        urls: [
          "/js/main.js",
          "/images/learning/history-case.webp",
          "/videos/Core/Pupils/pupil_220p.mp4",
          "/videos/Core/Pupils/pupil_720p.mp4",
          "/subapp/Mires/index.html",
        ],
        assets: [
          { url: "/js/main.js", bytes: 1000 },
          { url: "/images/learning/history-case.webp", bytes: 2000000 },
          { url: "/videos/Core/Pupils/pupil_220p.mp4", bytes: 3000000 },
          { url: "/videos/Core/Pupils/pupil_720p.mp4", bytes: 9000000 },
          { url: "/subapp/Mires/index.html", bytes: 4000000 },
        ],
      },
    }),
  );
  await page.goto("/#/eyes");
  await expect(page.locator("#eyesCatalogPage")).toBeVisible();
  await page.evaluate(async () => {
    const cache = await caches.open("arclight-download-modal-test");
    await cache.put(
      "/images/learning/history-case.webp",
      new Response("history"),
    );
    await cache.put(
      "/videos/Core/Pupils/pupil_220p.mp4",
      new Response("pupils"),
    );
    const worker = {
      postMessage: (message, ports) => {
        window.downloadTestRequests = (window.downloadTestRequests || 0) + 1;
        window.downloadTestUrls = message.payload;
        window.downloadTestPort = ports[0];
        ports[0].onmessage = (event) => {
          if (event.data.type === "CACHE_CANCEL") {
            window.downloadTestCancellations =
              (window.downloadTestCancellations || 0) + 1;
            ports[0].postMessage({
              type: "CACHE_PAUSED",
              cached: 2,
              total: 3,
              failed: [],
            });
          }
        };
      },
    };
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { ready: Promise.resolve({ active: worker }) },
    });
  });
  await page.locator("#eyesCatalogPage .menuBtn").click();
  await page.locator("#startDownloadBtn").click();
  const modal = page.locator("#downloadAppModal");
  await expect(modal).toBeVisible();
  await expect(modal.locator("#offlineFullContentSize")).toHaveText(
    "Download size: 19 MB",
  );
  await modal.locator('input[value="select"]').check();
  await expect(
    modal.locator(".download-group summary > span:first-child"),
  ).toHaveText([
    "Examination",
    "Eye Care Procedure",
    "Conditions",
    "Workshops",
  ]);
  await modal.locator('[data-download-group="core"] summary').click();
  await expect(
    modal.locator('[data-download-status="core-history"]'),
  ).toHaveText("Completed");
  await expect(
    modal.locator('[data-download-status="core-pupils"]'),
  ).toHaveText("Partly downloaded");
  await expect(
    modal.locator('[data-download-status="core-interactive-learning"]'),
  ).toHaveText("Not downloaded");
  await expect(modal.locator("#downloadAllBtn")).toBeDisabled();
  await modal.locator('input[value="core-history"]').check();
  await modal.locator('input[value="core-pupils"]').check();
  await modal.locator("#offlineVideoQualitySelect").selectOption("low");
  await expect(
    modal.locator('[data-download-status="core-pupils"]'),
  ).toHaveText("Completed");
  await expect(modal.locator("#offlineFullContentSize")).toHaveText(
    "Download size: 10 MB",
  );
  await expect(modal.locator("#downloadEstimateText")).toContainText(
    "Download size: 6 MB",
  );
  const bounds = await modal.locator(".download-modal").boundingBox();
  const viewport = page.viewportSize();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width);
  await modal.screenshot({ path: testInfo.outputPath("download-options.png") });
  await modal.locator("#downloadAllBtn").click();
  await expect(modal.locator("#downloadProgressStatus")).toHaveText(
    "In progress",
  );
  await expect
    .poll(() => page.evaluate(() => Boolean(window.downloadTestPort)))
    .toBe(true);
  expect(await page.evaluate(() => window.downloadTestUrls)).toEqual([
    "/js/main.js",
    "/images/learning/history-case.webp",
    "/videos/Core/Pupils/pupil_220p.mp4",
  ]);
  await page.evaluate(() =>
    window.downloadTestPort.postMessage({
      type: "CACHE_PROGRESS",
      processed: 2,
      total: 3,
      failed: 0,
    }),
  );
  await expect(modal.locator("#downloadProgressPercent")).toHaveText("66%");
  await expect(modal.locator("#downloadProgressBar")).toHaveJSProperty(
    "value",
    2,
  );
  await modal.screenshot({
    path: testInfo.outputPath("download-progress.png"),
  });
  const confirmations = [];
  page.once("dialog", async (dialog) => {
    confirmations.push(dialog.message());
    await dialog.dismiss();
  });
  await modal.locator("#notNowBtn").click();
  await expect(modal.locator("#downloadProgressStatus")).toHaveText(
    "In progress",
  );
  expect(await page.evaluate(() => window.downloadTestCancellations || 0)).toBe(
    0,
  );
  page.once("dialog", async (dialog) => {
    confirmations.push(dialog.message());
    await dialog.accept();
  });
  await modal.locator("#notNowBtn").click();
  await expect(modal.locator("#downloadProgressStatus")).toHaveText("Paused");
  expect(confirmations).toEqual(
    Array(2).fill(
      "Are you sure you want to pause this download? Already downloaded files will be kept.",
    ),
  );
  await expect(modal.locator("#downloadProgressPercent")).toHaveText("66%");
  await modal.screenshot({ path: testInfo.outputPath("download-paused.png") });
  await modal.locator("#downloadAllBtn").click();
  await expect
    .poll(() => page.evaluate(() => window.downloadTestRequests))
    .toBe(2);
  await expect(modal.locator("#downloadProgressStatus")).toHaveText(
    "In progress",
  );
  await page.evaluate(() =>
    window.downloadTestPort.postMessage({
      type: "CACHE_DONE",
      cached: 3,
      total: 3,
      failed: [],
    }),
  );
  await expect(modal.locator("#downloadProgressStatus")).toHaveText(
    "Completed",
  );
  await expect(modal.locator("#downloadProgressPercent")).toHaveText("100%");
  await expect(modal.locator("#downloadProgressStatus")).toHaveCSS(
    "color",
    "rgb(24, 117, 66)",
  );
  await modal.locator("#notNowBtn").click();
  await expect(modal).toBeHidden();

  const workshopUrls = [
    "/js/main.js",
    "/images/workshop/PEC/FundalReflex.webp",
    "/videos/Workshop/MedStudents/Media1.mp4",
    "/videos/USAID/lesson.mp4",
    "/videos/Workshop/Glaucoma/lesson.mp4",
    "/videos/Workshop/Diabetic/lesson.mp4",
  ];
  await page.route("**/api/app/offline-assets", (route) =>
    route.fulfill({
      json: {
        urls: workshopUrls,
        assets: workshopUrls.map((url) => ({ url, bytes: 1000 })),
      },
    }),
  );
  await page.locator("#eyesCatalogPage .menuBtn").click();
  await page.locator("#startDownloadBtn").click();
  await modal.locator('input[value="select"]').check();
  const workshops = modal.locator('[data-download-group="workshops"]');
  await workshops.locator("summary").click();
  await expect(workshops.locator(".download-section__title")).toHaveText([
    "PEC",
    "Medical Students",
    "Childhood Eye Screening",
    "Glaucoma",
    "Diabetic Retinopathy",
  ]);
  await workshops
    .getByRole("button", { name: "Download all workshops" })
    .click();
  await expect
    .poll(() => page.evaluate(() => window.downloadTestRequests))
    .toBe(3);
  expect(await page.evaluate(() => window.downloadTestUrls)).toEqual(
    workshopUrls,
  );
  await page.evaluate(() =>
    window.downloadTestPort.postMessage({
      type: "CACHE_DONE",
      cached: 6,
      total: 6,
      failed: [],
    }),
  );
  await expect(modal.locator("#downloadProgressStatus")).toHaveText(
    "Completed",
  );
});
