import { test, expect } from "@playwright/test";
import sharp from "sharp";
import { APPLY_EYE_PAD_SHIELD_SCROLL_CONFIG as cfg } from "../public/js/applyEyePadShieldScroll.js";
import { useWebKitNarrationClock } from "./helpers/webkit-narration-clock.js";
const route = "applyEyePadShieldScroll";
async function colourRatio(buffer, region, match) {
  const meta = await sharp(buffer).metadata();
  const crop = {
    left: Math.round((region[0] * meta.width) / 1169),
    top: Math.round((region[1] * meta.height) / 1280),
    width: Math.max(1, Math.round((region[2] * meta.width) / 1169)),
    height: Math.max(1, Math.round((region[3] * meta.height) / 1280)),
  };
  const { data, info } = await sharp(buffer)
    .extract(crop)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let n = 0;
  for (let p = 0; p < data.length; p += info.channels)
    if (match(data[p], data[p + 1], data[p + 2])) n++;
  return n / (info.width * info.height);
}

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
  await expect(stages).toHaveCount(cfg.paths.length);
  await expect(
    guide.locator("[data-fundal-scroll-narration-language] option"),
  ).toHaveCount(Object.keys(cfg.narrationTracks).length + 1);
  const shots = [];
  for (let i = 0; i < cfg.paths.length; i++) {
    const stage = stages.nth(i);
    // Observe both the final visual frame and the stopped narration clock.
    // Controls must stay hidden for the following 0.7 real seconds, including
    // in the merged two-cue scene and with accelerated test audio.
    const finishedAt = await page.waitForFunction(
      ({ route, i, last, end }) => {
        const state = window.__ARCLIGHT_E2E__?.fundal?.getStageState(route, i);
        const audio = document.querySelector(
          "[data-fundal-scroll-narration-audio]",
        );
        return state?.playing &&
          state.currentFrame === last &&
          audio?.paused &&
          audio.currentTime >= end - 0.1
          ? performance.now()
          : false;
      },
      {
        route,
        i,
        last: cfg.completionHoldFrameByFile[i],
        end:
          cfg.narrationClipsByFile[i].endByLanguage?.en ??
          cfg.narrationClipsByFile[i].end,
      },
      { timeout: 30000 },
    );
    const ended = await finishedAt.jsonValue();
    const replay = stage.locator(".childhood-fundal-stage-replay-btn");
    const next = stage
      .locator("..")
      .locator(".childhood-fundal-scroll-down-arrow");
    await expect(replay).toBeHidden();
    if (i < cfg.paths.length - 1) {
      await expect(next).toBeDisabled();
      await expect(next).toHaveCSS("opacity", "0");
    }
    await page.waitForTimeout(350);
    await expect(replay).toBeHidden();
    if (i < cfg.paths.length - 1) {
      await expect(next).toBeDisabled();
      await expect(next).toHaveCSS("opacity", "0");
    }
    await expect(
      stage.locator(".childhood-fundal-stage-replay-btn"),
    ).toBeVisible({ timeout: 30000 });
    expect(
      (await page.evaluate(() => performance.now())) - ended,
    ).toBeGreaterThanOrEqual(580);
    const state = await page.evaluate(
      ({ route, i }) => window.__ARCLIGHT_E2E__.fundal.getStageState(route, i),
      { route, i },
    );
    expect(state.failed).toBe(false);
    expect(state.completed).toBe(true);
    if (i === 0) {
      await page.waitForTimeout(900);
      const audioState = await page
        .locator("audio")
        .evaluateAll((elements) =>
          elements
            .filter((el) => el.currentSrc.includes("/apply-eye-pad-shield/"))
            .map((el) => ({ paused: el.paused, time: el.currentTime })),
        );
      expect(audioState.length).toBeGreaterThan(0);
      for (const audio of audioState) {
        expect(audio.paused).toBe(true);
        expect(audio.time).toBeLessThanOrEqual(
          cfg.narrationClipsByFile[0].end + 0.02,
        );
      }
    }
    expect(state.currentFrame).toBe(cfg.completionHoldFrameByFile[i]);
    await expect(
      stage.locator("..").locator(".childhood-fundal-segment-text__line"),
    ).toHaveText(cfg.segmentStartTexts[i]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);

    if (i >= 4) {
      const ratio = colourRatio;
      const green = (r, g, b) => g > 65 && g > r * 1.4 && g > b * 1.4;
      const endShot = await stage.screenshot();
      expect(await ratio(endShot, [715, 622, 74, 98], green)).toBeGreaterThan(
        0.02,
      );
      if (i === 4) {
        const paper = (r, g, b) =>
          r > 180 &&
          g > 170 &&
          b > 140 &&
          Math.max(r, g, b) - Math.min(r, g, b) < 48;
        expect(
          await ratio(endShot, [453, 524, 190, 80], paper),
        ).toBeGreaterThan(0.12);
      }
    }
    shots.push({
      input: await sharp(await stage.screenshot())
        .resize(292, 320)
        .png()
        .toBuffer(),
      left: (i % 4) * 292,
      top: Math.floor(i / 4) * 320,
    });
    if (i < cfg.paths.length - 1) {
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
    .toFile(testInfo.outputPath("six-scenes.png"));
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
          window.__ARCLIGHT_E2E__.fundal.getStageState(route, 5)?.playing,
        route,
      ),
    )
    .toBe(true);
  await expect(
    stages.last().locator(".childhood-fundal-stage-replay-btn"),
  ).toBeVisible({ timeout: 30000 });

  // Seeking deliberately hides stage controls. Inspect after the complete
  // navigation/replay flow, so visual QA cannot disable the next-stage button.
  const contactFrames = {
    1: [35, 99, 145, 189, 279, 340],
    2: [65, 140, 235, 335],
    3: [40, 98, 150],
    4: [64, 100, 170, 220],
    5: [42, 95, 155, 207, 282, 312],
  };
  for (let i = 1; i < cfg.paths.length; i++) {
    const stage = stages.nth(i);
    await stage.evaluate((el) => el.scrollIntoView({ block: "center" }));
    for (const frame of contactFrames[i]) {
      await page.evaluate(
        ({ route, i, frame }) =>
          window.__ARCLIGHT_E2E__.fundal.seekStage(route, i, frame),
        { route, i, frame },
      );
      const buffer = await stage.screenshot({
        path: testInfo.outputPath("contact-" + (i + 1) + "-" + frame + ".png"),
      });
      if (i === 4 && frame === 64)
        expect(
          await colourRatio(
            buffer,
            [454, 617, 82, 99],
            (r, g, b) => g > 65 && g > r * 1.4 && g > b * 1.4,
          ),
        ).toBe(0);
    }
  }
  await stages.last().evaluate((el) => el.scrollIntoView({ block: "center" }));
  for (const frame of [0, 100, 180, 260]) {
    await page.evaluate(
      ({ route, frame }) =>
        window.__ARCLIGHT_E2E__.fundal.seekStage(route, 5, frame),
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
  await expect(guide.locator(".childhood-fundal-prep-stage")).toHaveCount(
    cfg.paths.length,
  );
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
