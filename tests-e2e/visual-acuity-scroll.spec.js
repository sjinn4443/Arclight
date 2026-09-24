import { expect, test } from "@playwright/test";
import sharp from "sharp";
import { useWebKitNarrationClock } from "./helpers/webkit-narration-clock.js";
import { VISUAL_ACUITY_EXAMINATION_SCROLL_CONFIG as cfg } from "../public/js/visualAcuityExaminationScroll.js";

const pageId = cfg.pageId;
const route = "visualAcuityExaminationScroll";

test.beforeEach(async ({ page, browserName }) => {
  await useWebKitNarrationClock(page, browserName);
  await page.addInitScript(() => {
    window.__ARCLIGHT_E2E__ = { fundalPlaybackRate: 12 };
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
});

test("Visual Acuity restores the low-vision conditional captions", async ({
  page,
}) => {
  await page.addInitScript((id) => {
    localStorage.setItem(
      `lessonProgress:${id}`,
      JSON.stringify({ percent: 100 }),
    );
    localStorage.setItem(`videoNarration:${id}`, "off");
  }, pageId);
  await page.goto(`/#/videos/${pageId}`);
  const guide = page.locator(`#${pageId}`);
  const text = guide
    .locator(".childhood-fundal-prep-item")
    .nth(10)
    .locator(".childhood-fundal-segment-text");
  await expect(text).toContainText(
    "If fingers cannot be counted, move your hand",
    { timeout: 60000 },
  );
  await expect(text).toContainText(
    "If movement cannot be seen, test light perception",
  );
  await expect(guide.locator("audio")).toHaveAttribute(
    "src",
    "/narration/visual-acuity/full-animation/en.m4a",
  );
});

test("Visual Acuity opens in order, holds every final frame and restores completion", async ({
  page,
}, testInfo) => {
  test.setTimeout(180_000);
  const failures = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("response", (response) => {
    if (
      response.url().includes("/scrolly/coreexam/visualacuity/") &&
      response.status() >= 400
    )
      failures.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/#/videos/visualAcuityPage");
  await page.waitForFunction(
    () => document.getElementById("videos")?.style.visibility === "visible",
  );
  const row = page.locator(`#visualAcuityPage [data-target="${pageId}"]`);
  await expect(row).toHaveClass(/lesson-row--scrollytelling/);
  await expect(row.locator(".lesson-type")).toHaveText("Visual Acuity");
  expect(
    await row.evaluate((el) => el.nextElementSibling?.dataset.target),
  ).toBe("visualAcuityFullAnimationVideoPage");
  await row.click();
  const guide = page.locator(`#${pageId}`);
  await expect(
    guide.locator(".fundal-reflex-section-divider__title"),
  ).toHaveText(cfg.sections.map((s) => s.title));
  const stages = guide.locator(".childhood-fundal-prep-stage");
  await expect(stages).toHaveCount(15);
  const shots = [];
  for (let i = 0; i < 15; i++) {
    await test.step(`animation ${i + 1}`, async () => {
      const stage = stages.nth(i);
      await expect(
        stage.locator(".childhood-fundal-stage-replay-btn"),
      ).toBeVisible({ timeout: 30_000 });
      if (i === 0)
        await page.screenshot({
          path: testInfo.outputPath("lesson-layout.png"),
        });
      const state = await page.evaluate(
        ({ route, i }) =>
          window.__ARCLIGHT_E2E__.fundal.getStageState(route, i),
        { route, i },
      );
      expect(state.completed).toBe(true);
      expect(state.currentFrame).toBe(cfg.completionHoldFrameByFile[i]);
      expect(state.failed).toBe(false);
      await expect(
        stage.locator("..").locator(".childhood-fundal-segment-text__line"),
      ).toHaveText(cfg.segmentStartTexts[i]);
      const shot = await stage.screenshot({
        path: testInfo.outputPath(`stage-${i + 1}.png`),
      });
      const { data, info } = await sharp(shot)
        .removeAlpha()
        .resize(96, 96)
        .raw()
        .toBuffer({ resolveWithObject: true });
      let coloured = 0;
      for (let p = 0; p < data.length; p += info.channels)
        if (Math.min(data[p], data[p + 1], data[p + 2]) < 225) coloured++;
      expect(
        coloured / (info.width * info.height),
        `Stage ${i + 1} should not be blank`,
      ).toBeGreaterThan(0.02);
      shots.push(
        await sharp(shot)
          .resize(200, 220, { fit: "contain", background: "white" })
          .png()
          .toBuffer(),
      );
      if (i < 14)
        await stage
          .locator("..")
          .locator(".childhood-fundal-scroll-down-arrow")
          .click();
    });
  }
  await sharp({
    create: { width: 800, height: 880, channels: 3, background: "white" },
  })
    .composite(
      shots.map((input, i) => ({
        input,
        left: (i % 4) * 200,
        top: Math.floor(i / 4) * 220,
      })),
    )
    .png()
    .toFile(testInfo.outputPath("all-stages.png"));
  await expect
    .poll(() =>
      page.evaluate(
        (id) =>
          JSON.parse(localStorage.getItem(`lessonProgress:${id}`))?.percent,
        pageId,
      ),
    )
    .toBe(100);
  await page.reload();
  await expect(
    stages.last().locator(".childhood-fundal-stage-replay-btn"),
  ).toBeVisible({ timeout: 30_000 });
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator("#visualAcuityPage")).toBeVisible();
  await expect(guide.locator("audio")).toHaveCount(0);
  expect(failures).toEqual([]);
});

test("Visual Acuity keeps English audio fallback and responsive navigation", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("prefLang", "ko");
    localStorage.setItem(
      "videoNarration:visualAcuityExaminationScrollPage",
      "off",
    );
  });
  await page.goto(`/#/videos/${pageId}`);
  const guide = page.locator(`#${pageId}`);
  const language = guide.locator("[data-fundal-scroll-narration-language]");
  await expect(language.locator("option")).toHaveCount(2);
  await expect(language.locator('option[value="auto"]')).toContainText("EN");
  await expect(guide.locator("audio")).toHaveAttribute(
    "src",
    "/narration/visual-acuity/full-animation/en.m4a",
  );
  await expect(guide.locator("audio")).toHaveAttribute("lang", "en");
  const toggle = guide.locator("[data-fundal-scroll-narration-toggle]");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
  ]) {
    await page.setViewportSize(viewport);
    await expect(
      guide.locator(".childhood-fundal-stage-replay-btn").first(),
    ).toBeVisible();
    const geometry = await guide.evaluate((el) => {
      const stage = el
        .querySelector(".childhood-fundal-prep-stage")
        .getBoundingClientRect();
      return {
        left: stage.left,
        right: stage.right,
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    });
    expect(geometry.left).toBeGreaterThanOrEqual(-1);
    expect(geometry.right).toBeLessThanOrEqual(viewport.width + 1);
    expect(geometry.overflow).toBeLessThanOrEqual(1);
  }
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator("#visualAcuityPage")).toBeVisible();
  await expect(guide.locator("audio")).toHaveCount(0);
});

test("Visual Acuity captions fit their scene and transition holds avoid overlaps", async ({
  page,
}, testInfo) => {
  const { VISUAL_ACUITY_SCROLL_TIMING } =
    await import("../public/js/visualAcuityExaminationScroll.js");
  const { frameAtNarrationTime } =
    await import("../public/js/examinationScrollTiming.js");
  const lowVision = VISUAL_ACUITY_SCROLL_TIMING.stages[10];
  const lowHold = frameAtNarrationTime(lowVision, 131);
  // The woman's incoming crossfade starts at frame 152 in the source Lottie.
  expect(lowHold).toBeLessThan(152);
  expect(frameAtNarrationTime(lowVision, 132)).toBe(lowHold);
  const nearVision = VISUAL_ACUITY_SCROLL_TIMING.stages[13];
  expect(frameAtNarrationTime(nearVision, 198.2)).toBeGreaterThan(
    frameAtNarrationTime(nearVision, 197.5),
  );
  await page.addInitScript((id) => {
    localStorage.setItem(
      `lessonProgress:${id}`,
      JSON.stringify({ percent: 100 }),
    );
    localStorage.setItem(`videoNarration:${id}`, "off");
  }, pageId);
  await page.goto(`/#/videos/${pageId}`);
  const guide = page.locator(`#${pageId}`);
  await expect(
    guide.locator(".childhood-fundal-stage-replay-btn").last(),
  ).toBeVisible({ timeout: 60000 });
  for (const size of [
    { width: 1337, height: 900 },
    { width: 1024, height: 768 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(size);
    const bounds = await guide
      .locator(".childhood-fundal-prep-item")
      .evaluateAll((items) =>
        items.map((item) => {
          const scene = item
            .querySelector(".childhood-fundal-prep-stage")
            .getBoundingClientRect();
          const text = item
            .querySelector(".childhood-fundal-segment-text")
            .getBoundingClientRect();
          return {
            scene: scene.width,
            text: text.width,
            left: text.left - scene.left,
            right: scene.right - text.right,
          };
        }),
      );
    for (const b of bounds) {
      expect(b.text).toBeLessThanOrEqual(b.scene + 97);
      expect(b.left).toBeGreaterThanOrEqual(-49);
      expect(b.right).toBeGreaterThanOrEqual(-49);
    }
  }
  await page.evaluate(
    async ({ route, frame }) => {
      await window.__ARCLIGHT_E2E__.fundal.seekStage(route, 10, frame);
    },
    { route, frame: lowHold },
  );
  await guide
    .locator(".childhood-fundal-prep-stage")
    .nth(10)
    .screenshot({ path: testInfo.outputPath("low-vision-hold.png") });
  await expect(
    guide
      .locator(".childhood-fundal-prep-item")
      .last()
      .locator(".childhood-fundal-segment-text"),
  ).toContainText("If the vision improves, it means they need glasses");
  const items = guide.locator(".childhood-fundal-prep-item");
  await expect(
    items.nth(2).locator(".childhood-fundal-segment-text__paragraph"),
  ).toHaveCount(2);
  for (const index of [6, 10]) {
    const sentences = await items
      .nth(index)
      .locator(".childhood-fundal-segment-text__paragraph")
      .allTextContents();
    expect(sentences.length).toBeGreaterThan(1);
    for (const sentence of sentences) {
      expect(sentence).not.toMatch(/[.!?]\s+[A-Z]/);
      expect(sentence).toMatch(/\S+\u00a0\S+$/);
    }
  }
  for (const size of [
    { width: 1158, height: 920 },
    { width: 1024, height: 768 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(size);
    const replay = items.nth(6).locator(".childhood-fundal-stage-replay-btn");
    await replay.click();
    await expect(replay).toBeVisible({ timeout: 30000 });
    const bottom = await items
      .nth(6)
      .locator(".childhood-fundal-segment-text")
      .evaluate((el) => el.getBoundingClientRect().bottom);
    expect(bottom).toBeLessThanOrEqual(size.height - 10);
    await items
      .nth(6)
      .locator(".childhood-fundal-segment-text")
      .screenshot({ path: testInfo.outputPath(`sentences-${size.width}.png`) });
  }
});
