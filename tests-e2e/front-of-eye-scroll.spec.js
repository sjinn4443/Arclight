import { expect, test } from "@playwright/test";
import sharp from "sharp";
import { useWebKitNarrationClock } from "./helpers/webkit-narration-clock.js";
import { FRONT_OF_EYE_EXAMINATION_SCROLL_CONFIG as cfg } from "../public/js/frontOfEyeExaminationScroll.js";

const pageId = cfg.pageId;
const route = "frontOfEyeExaminationScroll";

test.beforeEach(async ({ page, browserName }) => {
  await useWebKitNarrationClock(page, browserName);
  await page.addInitScript(() => {
    window.__ARCLIGHT_E2E__ = { fundalPlaybackRate: 12 };
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
});

test("Front of Eye opens in order, holds every final frame and restores completion", async ({
  page,
}, testInfo) => {
  test.setTimeout(180_000);
  const failures = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("response", (response) => {
    if (
      response.url().includes("/scrolly/coreexam/frontofeye/") &&
      response.status() >= 400
    )
      failures.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/#/videos/frontOfEyePage");
  await page.waitForFunction(
    () => document.getElementById("videos")?.style.visibility === "visible",
  );
  const row = page.locator(`#frontOfEyePage [data-target="${pageId}"]`);
  await expect(row).toHaveClass(/lesson-row--scrollytelling/);
  await expect(row.locator(".lesson-type")).toHaveText(
    "Front of Eye Examination",
  );
  expect(
    await row.evaluate((el) => el.nextElementSibling?.dataset.target),
  ).toBe("frontOfEyeFullAnimationVideoPage");
  await row.click();
  const guide = page.locator(`#${pageId}`);
  await expect(
    guide.locator(".fundal-reflex-section-divider__title"),
  ).toHaveText(cfg.sections.map((s) => s.title));
  const stages = guide.locator(".childhood-fundal-prep-stage");
  await expect(stages).toHaveCount(11);
  const shots = [];
  for (let i = 0; i < 11; i++) {
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
      if (i < 10)
        await stage
          .locator("..")
          .locator(".childhood-fundal-scroll-down-arrow")
          .click();
    });
  }
  await sharp({
    create: { width: 800, height: 660, channels: 3, background: "white" },
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
  await expect(page.locator("#frontOfEyePage")).toBeVisible();
  await expect(guide.locator("audio")).toHaveCount(0);
  expect(failures).toEqual([]);
});

test("Front of Eye narration, translated guidance, replay and exit controls", async ({
  page,
}) => {
  await page.goto(`/#/videos/${pageId}`);
  const guide = page.locator(`#${pageId}`);
  const language = guide.locator("[data-fundal-scroll-narration-language]");
  const audio = guide.locator("audio");
  const lines = guide.locator(".childhood-fundal-segment-text__line").first();
  const replay = guide.locator(".childhood-fundal-stage-replay-btn").first();
  await expect(lines).toHaveText(cfg.segmentStartTexts[0][0]);
  await expect(replay).toBeVisible();
  await replay.click();
  await expect(replay).toBeVisible();
  await language.selectOption("ko");
  await expect(lines).toContainText(/[가-힣]/);
  await expect(audio).toHaveAttribute(
    "src",
    "/narration/front-of-eye/full-animation/ko.m4a",
  );
  await guide.locator("[data-fundal-scroll-narration-toggle]").click();
  if (
    (await guide
      .locator("[data-fundal-scroll-narration-toggle]")
      .getAttribute("aria-pressed")) === "true"
  ) {
    await guide.locator("[data-fundal-scroll-narration-toggle]").click();
  }
  await expect(audio).toHaveJSProperty("paused", true);
  await page.reload();
  await expect(language).toHaveValue("ko");
  await expect(lines).toContainText(/[가-힣]/);
  await expect(
    guide.locator("[data-fundal-scroll-narration-toggle]"),
  ).toHaveAttribute("aria-pressed", "false");
  await language.selectOption("es-419");
  await expect(lines).not.toContainText(/[가-힣]/);
  await expect(lines).not.toHaveText(cfg.segmentStartTexts[0][0]);
  await guide.locator('[data-page="frontOfEyePage"]').click();
  await expect(page.locator("#frontOfEyePage")).toBeVisible();
  await expect(audio).toHaveCount(0);
});
