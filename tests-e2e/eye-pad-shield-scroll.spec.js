import { expect, test } from "@playwright/test";
import fs from "node:fs";
import sharp from "sharp";
import { EYE_PAD_SHIELD_SCROLL_CONFIG as cfg } from "../public/js/eyePadShieldScroll.js";
import { useWebKitNarrationClock } from "./helpers/webkit-narration-clock.js";

const pageId = cfg.pageId;
const route = "makeEyePadShieldScroll";
const runtimeUrls = [
  ...new Set(
    cfg.paths.flatMap((file) => {
      const data = JSON.parse(fs.readFileSync(`public${file}`, "utf8"));
      return [
        file,
        ...data.assets
          .filter((asset) => asset.p)
          .map(
            (asset) =>
              new URL(`${asset.u}${asset.p}`, `http://lesson.test${file}`)
                .pathname,
          ),
      ];
    }),
  ),
  cfg.narrationTracks.en.src,
  "/narration/make-eye-pad-shield/full-animation/script.json",
  "/narration/make-eye-pad-shield/full-animation/en.vtt",
];

test.beforeEach(async ({ page, browserName }) => {
  await useWebKitNarrationClock(page, browserName);
  await page.addInitScript(() => {
    window.__ARCLIGHT_E2E__ = { fundalPlaybackRate: 12 };
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
});

test("the new row plays nine stages, replays, saves completion and returns to the procedure", async ({
  page,
}, testInfo) => {
  test.setTimeout(180_000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (
      response.url().includes("/make-eye-pad-shield/") &&
      response.status() >= 400
    )
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/#/eyePadShield");
  const row = page.locator(`#eyePadShield [data-target="${pageId}"]`);
  expect(
    await row.evaluate((el) => el.previousElementSibling.dataset.pecVideo),
  ).toBe("make_eye_pad");
  expect(
    await row.evaluate((el) => el.nextElementSibling.dataset.pecVideo),
  ).toBe("apply_eye_pad");
  await expect(row.locator(".lesson-cta")).toHaveText("scroll >");
  await expect(row.getByRole("progressbar")).toHaveAccessibleName(
    "Make an eye pad and eye shield",
  );
  await page.screenshot({ path: testInfo.outputPath("lesson-row.png") });
  await row.click();
  const guide = page.locator(`#${pageId}`);
  const stages = guide.locator(".childhood-fundal-prep-stage");
  await expect(stages).toHaveCount(cfg.paths.length);
  await expect(
    guide.locator(".fundal-reflex-section-divider__title"),
  ).toHaveText(cfg.sections.map((section) => section.title));
  await expect(
    guide.locator("[data-fundal-scroll-narration-language] option"),
  ).toHaveCount(2);
  const shots = [];
  for (let i = 0; i < cfg.paths.length; i++) {
    const stage = stages.nth(i);
    const replay = stage.locator(".childhood-fundal-stage-replay-btn");
    await expect(replay).toBeVisible({ timeout: 30_000 });
    const state = await page.evaluate(
      ({ route, i }) => window.__ARCLIGHT_E2E__.fundal.getStageState(route, i),
      { route, i },
    );
    expect(state.completed).toBe(true);
    expect(state.failed).toBe(false);
    expect(state.currentFrame).toBe(cfg.completionHoldFrameByFile[i]);
    await expect(
      stage.locator("..").locator(".childhood-fundal-segment-text__line"),
    ).toHaveText(cfg.segmentStartTexts[i]);
    if (i < 2) {
      if (page.viewportSize().width <= 600) {
        const fits = await stage.locator("..").evaluate((block) => {
          const lines = block.querySelectorAll(
            ".childhood-fundal-segment-text__line",
          );
          return (
            lines[lines.length - 1].getBoundingClientRect().bottom <=
            window.innerHeight
          );
        });
        expect(fits).toBe(true);
      }
      await page.screenshot({
        path: testInfo.outputPath(`lesson-layout-${i}.png`),
      });
    }
    shots.push({
      input: await sharp(await stage.screenshot())
        .resize(220, 241)
        .png()
        .toBuffer(),
      left: (i % 4) * 220,
      top: Math.floor(i / 4) * 241,
    });
    if (i < cfg.paths.length - 1) {
      const arrow = stage
        .locator("..")
        .locator(".childhood-fundal-scroll-down-arrow");
      await arrow.evaluate((el) => el.focus({ preventScroll: true }));
      await page.keyboard.press("Enter");
    }
  }
  await sharp({
    create: { width: 880, height: 723, channels: 3, background: "white" },
  })
    .composite(shots)
    .png()
    .toFile(testInfo.outputPath("nine-scenes.png"));
  await expect
    .poll(() =>
      page.evaluate(
        (id) =>
          JSON.parse(localStorage.getItem(`lessonProgress:${id}`))?.percent,
        pageId,
      ),
    )
    .toBe(100);
  await stages.last().locator(".childhood-fundal-stage-replay-btn").click();
  await expect
    .poll(() =>
      page.evaluate(
        (route) =>
          window.__ARCLIGHT_E2E__.fundal.getStageState(route, 8)?.playing,
        route,
      ),
    )
    .toBe(true);
  await expect(
    stages.last().locator(".childhood-fundal-stage-replay-btn"),
  ).toBeVisible({ timeout: 30_000 });
  // Inspect the continuous final sequence using the real route renderer.
  for (const frame of [45, 130, 180, 255, 370, 435, 539]) {
    await page.evaluate(
      ({ route, frame }) =>
        window.__ARCLIGHT_E2E__.fundal.seekStage(route, 8, frame),
      { route, frame },
    );
    await stages
      .last()
      .screenshot({ path: testInfo.outputPath(`cone-${frame}.png`) });
  }
  // Review the changed intermediate motions through each browser's real
  // renderer, including the composite fade, visited trim and merged slit.
  for (const [i, frames] of [
    [3, [0, 130, 190]],
    [4, [120, 240]],
    [5, [282]],
    [6, [90, 160]],
    [7, [120, 480, 510]],
  ]) {
    await stages.nth(i).scrollIntoViewIfNeeded();
    for (const frame of frames) {
      const state = await page.evaluate(
        ({ route, i, frame }) =>
          window.__ARCLIGHT_E2E__.fundal.seekStage(route, i, frame),
        { route, i, frame },
      );
      expect(state.failed).toBe(false);
      await stages.nth(i).screenshot({
        path: testInfo.outputPath(`motion-${i + 1}-${frame}.png`),
      });
    }
  }
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator("#eyePadShield")).toBeVisible();
  await expect(
    page.locator(`[data-fundal-scroll-narration-audio]`),
  ).toHaveCount(0);
  await expect(
    page.locator(
      `#eyePadShield [data-target="${pageId}"] [role="progressbar"]`,
    ),
  ).toHaveAttribute("aria-valuenow", "100");
  await page.locator(`#eyePadShield [data-target="${pageId}"]`).click();
  await expect
    .poll(
      () =>
        page.evaluate(
          (route) =>
            window.__ARCLIGHT_E2E__.fundal.getStageState(route, 0)?.completed,
          route,
        ),
      { timeout: 60_000 },
    )
    .toBe(true);
  await expect(guide.locator("audio")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("deep links, English fallback, My Learning and procedure downloads retain the new lesson", async ({
  page,
}) => {
  const downloadUrls = [
    ...runtimeUrls,
    "/narration/unrelated/full-animation/en.m4a",
  ];
  await page.route("**/api/app/offline-assets", (route) =>
    route.fulfill({
      json: {
        urls: downloadUrls,
        assets: downloadUrls.map((url) => ({ url, bytes: 10 })),
      },
    }),
  );
  await page.addInitScript((id) => {
    localStorage.setItem("prefLang", "ko");
    localStorage.setItem(`videoNarration:${id}`, "off");
    localStorage.setItem(
      `lessonProgress:${id}`,
      JSON.stringify({ percent: 35, updatedAt: Date.now() }),
    );
  }, pageId);
  await page.goto(`/#/eyePadShield/${pageId}`);
  const guide = page.locator(`#${pageId}`);
  await expect(guide).toBeVisible();
  await expect(guide.locator('option[value="auto"]')).toContainText("EN");
  await expect(
    guide.locator("[data-fundal-scroll-narration-toggle]"),
  ).toHaveAttribute("aria-pressed", "false");
  await page.reload();
  await expect(guide).toBeVisible();
  await expect(guide.locator("audio")).toHaveCount(1);
  await page.goto("/#/mylearning");
  await page.locator('[data-ml-tab="inProgress"]').click();
  // Use the target rather than a translated label to open the saved lesson.
  const item = page.locator(`.ml-progress-item[data-sub-page-id="${pageId}"]`);
  await expect(item).toHaveCount(1);
  await item.locator("../..").locator(".ml-progress-card__summary").click();
  await item.click();
  await expect(guide).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`#/eyePadShield/${pageId}$`));
  // Exercise the shipped menu rather than importing an unexported build bundle.
  await page.evaluate(() => {
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: {
        ready: Promise.resolve({
          active: {
            postMessage: (message, ports) => {
              window.eyePadDownloadUrls = message.payload;
              ports[0].postMessage({
                type: "CACHE_DONE",
                cached: message.payload.length,
                total: message.payload.length,
                failed: [],
              });
            },
          },
        }),
      },
    });
  });
  await guide.locator(".menuBtn").click();
  await page.locator("#startDownloadBtn").click();
  const modal = page.locator("#downloadAppModal");
  await expect(modal).toBeVisible();
  await modal.locator('input[value="select"]').check();
  await modal.locator('[data-download-group="procedures"] summary').click();
  await modal.locator('input[value="procedure-eye-pad"]').check();
  await modal.locator("#downloadAllBtn").click();
  await expect
    .poll(() => page.evaluate(() => window.eyePadDownloadUrls))
    .toBeTruthy();
  const selected = await page.evaluate(() => window.eyePadDownloadUrls);
  expect(selected.sort()).toEqual([...runtimeUrls].sort());
});
