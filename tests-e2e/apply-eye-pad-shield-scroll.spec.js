import { test, expect } from "@playwright/test";
import sharp from "sharp";
import { APPLY_EYE_PAD_SHIELD_SCROLL_CONFIG as cfg } from "../public/js/applyEyePadShieldScroll.js";
import { useWebKitNarrationClock } from "./helpers/webkit-narration-clock.js";
const route = "applyEyePadShieldScroll";

test.beforeEach(async ({ page, browserName }) => {
  await useWebKitNarrationClock(page, browserName);
  await page.addInitScript(() => {
    window.__ARCLIGHT_E2E__ = { fundalPlaybackRate: 12 };
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
});

test("launch, all scenes, replay, progress and Back", async ({
  page,
}, testInfo) => {
  test.setTimeout(180000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.url().includes("/apply-eye-pad-shield/") && r.status() >= 400)
      errors.push(`${r.status()} ${r.url()}`);
  });
  await page.goto("/#/eyePadShield");
  await page.locator('#eyePadShield [data-nested-folder="apply"]').click();
  const row = page.locator(`#eyePadShield [data-target="${cfg.pageId}"]`);
  await expect(row).toHaveClass(/lesson-row--scrollytelling/);
  await expect(row.locator(".lesson-type")).toHaveText(cfg.label);
  expect(
    await row.evaluate((el) => el.previousElementSibling.dataset.pecVideo),
  ).toBe("apply_eye_pad");
  await row.click();
  const guide = page.locator(`#${cfg.pageId}`),
    stages = guide.locator(".childhood-fundal-prep-stage");
  await expect(stages).toHaveCount(8);
  await expect(
    guide.locator("[data-fundal-scroll-narration-language] option"),
  ).toHaveCount(3);
  const shots = [];
  for (let i = 0; i < 8; i++) {
    const stage = stages.nth(i);
    await expect(
      stage.locator(".childhood-fundal-stage-replay-btn"),
    ).toBeVisible({ timeout: 30000 });
    const state = await page.evaluate(
      ({ route, i }) => window.__ARCLIGHT_E2E__.fundal.getStageState(route, i),
      { route, i },
    );
    expect(state.failed).toBe(false);
    expect(state.completed).toBe(true);
    expect(state.currentFrame).toBe(cfg.completionHoldFrameByFile[i]);
    await expect(
      stage.locator("..").locator(".childhood-fundal-segment-text__line"),
    ).toHaveText(cfg.segmentStartTexts[i]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    shots.push({
      input: await sharp(await stage.screenshot())
        .resize(292, 320)
        .png()
        .toBuffer(),
      left: (i % 4) * 292,
      top: Math.floor(i / 4) * 320,
    });
    if (i < 8 - 1) {
      await stage
        .locator("..")
        .locator(".childhood-fundal-scroll-down-arrow")
        .evaluate((el) => el.focus({ preventScroll: true }));
      await page.keyboard.press("Enter");
    }
  }
  await sharp({
    create: { width: 1168, height: 640, channels: 3, background: "white" },
  })
    .composite(shots)
    .png()
    .toFile(testInfo.outputPath("eight-scenes.png"));
  await expect
    .poll(() =>
      page.evaluate(
        (id) =>
          JSON.parse(localStorage.getItem(`lessonProgress:${id}`))?.percent,
        cfg.pageId,
      ),
    )
    .toBe(100);
  await stages.last().locator(".childhood-fundal-stage-replay-btn").click();
  await expect
    .poll(() =>
      page.evaluate(
        (route) =>
          window.__ARCLIGHT_E2E__.fundal.getStageState(route, 7)?.playing,
        route,
      ),
    )
    .toBe(true);
  await expect(
    stages.last().locator(".childhood-fundal-stage-replay-btn"),
  ).toBeVisible({ timeout: 30000 });
  for (const frame of [0, 100, 180, 260]) {
    await page.evaluate(
      ({ route, frame }) =>
        window.__ARCLIGHT_E2E__.fundal.seekStage(route, 7, frame),
      { route, frame },
    );
    await stages
      .last()
      .screenshot({ path: testInfo.outputPath(`shield-${frame}.png`) });
  }
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator("#eyePadShield")).toBeVisible();
  await expect(
    page.locator("[data-fundal-scroll-narration-audio]"),
  ).toHaveCount(0);
  await expect(row.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
  expect(errors).toEqual([]);
});

test("direct entry, Korean captions, mute and tablet layout", async ({
  page,
}) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.addInitScript(() =>
    localStorage.setItem(
      "videoNarrationLanguage:applyEyePadShieldScrollPage",
      "ko",
    ),
  );
  await page.goto(`/#/eyePadShield/${cfg.pageId}`);
  const guide = page.locator(`#${cfg.pageId}`);
  await expect(guide).toBeVisible();
  await expect(guide.locator(".childhood-fundal-prep-stage")).toHaveCount(8);
  await expect(
    guide.locator("[data-fundal-scroll-narration-language]"),
  ).toHaveValue("ko");
  await expect(
    guide.locator(".childhood-fundal-segment-text__line").first(),
  ).toContainText("안대 패드");
  const audio = guide.locator("audio");
  await expect(audio).toHaveAttribute("src", /ko.m4a/);
  await guide.locator("[data-fundal-scroll-narration-toggle]").click();
  await expect(
    guide.locator("[data-fundal-scroll-narration-toggle]"),
  ).toHaveAttribute("aria-pressed", "false");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
