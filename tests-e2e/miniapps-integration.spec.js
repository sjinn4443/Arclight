import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";

test.use({ serviceWorkers: "allow" });
test.beforeEach(({}, testInfo) => {
  test.skip(
    testInfo.project.name !== "chromium-desktop",
    "Installed-cache checks run in Chromium; iPhone geometry has its own WebKit regression.",
  );
});

test("Amsler exports twice offline with its fonts and report metadata", async ({
  page,
  context,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/subapp/Amsler/index.html");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise((resolve) =>
        navigator.serviceWorker.addEventListener("controllerchange", resolve, {
          once: true,
        }),
      );
  });
  await context.setOffline(true);
  await page.reload();
  await page.locator("#patientInfoToggle").click();
  await page.locator("#patientName").fill("Export regression");
  await page.locator("#patientDate").fill("2026-10-02");
  await page.locator("#savePatientInfo").click();
  await page.locator("#analyzeBtn").click();
  await page.locator("#leTab").click();
  await page.locator("#analyzeBtn").click();
  await page.locator("#reportBtn").click();
  await expect(page.locator(".amsler-report-meta")).toContainText(
    "Export regression",
  );
  await expect(page.locator(".amsler-report-meta")).toContainText("02/10/2026");
  await expect(page.locator(".amsler-report-eye img")).toHaveCount(2);
  for (let attempt = 0; attempt < 2; attempt++) {
    const downloading = page.waitForEvent("download");
    await page.locator("#downloadReportBtn").click();
    const download = await downloading;
    expect(download.suggestedFilename()).toBe("amsler-report.webp");
    const bytes = await fs.readFile(await download.path());
    expect(bytes.toString("ascii", 0, 4)).toBe("RIFF");
    expect(bytes.toString("ascii", 8, 12)).toBe("WEBP");
    expect(bytes.length).toBeGreaterThan(1000);
    await expect(page.locator("#downloadReportBtn")).toBeEnabled();
  }
  expect(errors).toEqual([]);
});

test("Glaucoma uses its app cache while preserving earned progress and sibling caches", async ({
  page,
  context,
}) => {
  await page.goto("/subapp/Glaucoma/index.html");
  await page.evaluate(async () => {
    localStorage.setItem(
      "glaucoma_mcq_progress_v1",
      JSON.stringify({ unlockedLevelIndex: 1, completedLevels: [0] }),
    );
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise((resolve) =>
        navigator.serviceWorker.addEventListener("controllerchange", resolve, {
          once: true,
        }),
      );
    const olderHostCache = await caches.open("arclight-integration-old-host");
    const bundle = document.querySelector('script[src^="app.bundle.js"]').src;
    await olderHostCache.put(
      bundle,
      new Response("window.staleHostBundle = true;", {
        headers: { "Content-Type": "application/javascript" },
      }),
    );
    await caches.open("arclight-integration-sibling");
  });
  await context.setOffline(true);
  await page.reload();
  expect(await page.evaluate(() => window.staleHostBundle)).toBeUndefined();
  await page.locator("#info-icon").click();
  await expect(page.locator("#info-popup")).toContainText("30/9/2026");
  await page.keyboard.press("Escape");
  await page.locator("#burger-icon").click();
  await expect(page.locator('[data-level-index="1"]')).toBeEnabled();
  const progress = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("glaucoma_mcq_progress_v1")),
  );
  expect(progress).toEqual({ unlockedLevelIndex: 1, completedLevels: [0] });
  expect(await page.evaluate(() => caches.keys())).toEqual(
    expect.arrayContaining([
      "arclight-integration-old-host",
      "arclight-integration-sibling",
    ]),
  );
});

test("developer fixtures are unavailable through the host", async ({
  request,
}) => {
  for (const url of [
    "/subapp/Refract/tools/allan-rx-full.csv",
    "/subapp/Refract/outputs/weighted-20260930/candidate.mjs",
    "/subapp/Refract/tests/weighted-rules.mjs",
  ]) {
    expect((await request.get(url)).status()).toBe(404);
  }
  expect((await request.get("/subapp/gallery/apps.json")).status()).toBe(200);
});

test("Gallery links and all 15 previews work at mobile, tablet and desktop sizes", async ({
  page,
  request,
}) => {
  await page.goto("/subapp/gallery/index.html");
  await expect(page.locator("a.app-card")).toHaveCount(15);
  await page.locator(".app-thumb img").evaluateAll((images) => {
    for (const image of images) image.loading = "eager";
  });
  await page
    .locator(".app-thumb img")
    .evaluateAll((images) =>
      Promise.all(images.map((image) => image.decode())),
    );
  for (const url of await page
    .locator("a.app-card")
    .evaluateAll((cards) => cards.map((card) => card.href))) {
    expect((await request.get(url)).status()).toBe(200);
  }
  for (const [width, height] of [
    [360, 740],
    [768, 1024],
    [1366, 900],
  ]) {
    await page.setViewportSize({ width, height });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
