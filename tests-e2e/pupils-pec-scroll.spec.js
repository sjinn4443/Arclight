import { expect, test } from "@playwright/test";
import sharp from "sharp";
import { PUPILS_PEC_SCROLL_CONFIG as cfg } from "../public/js/pupilsPecScroll.js";
import { useWebKitNarrationClock } from "./helpers/webkit-narration-clock.js";
const id = cfg.pageId;
const route = "pupilsPecScroll";

test.beforeEach(async ({ page, browserName }) => {
  await useWebKitNarrationClock(page, browserName);
  await page.addInitScript(() => {
    window.__ARCLIGHT_E2E__ = { fundalPlaybackRate: 12 };
    localStorage.setItem("arclight:onboarded", "1");
    sessionStorage.setItem("arclight:account:nudge-dismissed", "1");
    localStorage.setItem("prefLang", "en");
  });
});

test("Pupils PEC opens above Primary Eye Care Exam and plays the source illustrations", async ({
  page,
  browserName,
}, testInfo) => {
  test.setTimeout(180_000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.url().includes("/pupils-pec/") && response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/#/videos/pupilsPage");
  const row = page.locator(`#pupilsPage [data-target="${id}"]`);
  await expect(row).toBeVisible();
  await expect(row).toHaveClass(/lesson-row--scrollytelling/);
  await expect(row.getByRole("progressbar")).toHaveAccessibleName("Pupils PEC");
  expect(await row.evaluate((el) => el.nextElementSibling.dataset.target)).toBe(
    "pupilExamPECPage",
  );
  await page.screenshot({ path: testInfo.outputPath("pupils-lesson-row.png") });
  await row.click();
  const guide = page.locator(`#${id}`);
  const stages = guide.locator(".childhood-fundal-prep-stage");
  await expect(guide).toBeVisible();
  await expect(stages).toHaveCount(6);
  await expect(
    guide.locator(".fundal-reflex-section-divider__title"),
  ).toHaveText(["Observation", "Direct Light Response"]);
  await expect(
    guide.locator("[data-fundal-scroll-narration-language] option"),
  ).toHaveCount(3);
  const shots = [];
  for (let i = 0; i < cfg.paths.length; i++) {
    const stage = stages.nth(i);
    const replay = stage.locator(".childhood-fundal-stage-replay-btn");
    await expect(replay).toBeVisible({ timeout: 30_000 });
    const state = await page.evaluate(
      ({ route, i }) => window.__ARCLIGHT_E2E__.fundal.getStageState(route, i),
      { route, i },
    );
    expect(state.failed).toBe(false);
    expect(state.completed).toBe(true);
    expect(state.currentFrame).toBe(cfg.completionHoldFrameByFile[i]);
    const bounds = await stage.boundingBox();
    expect(bounds.width / bounds.height).toBeCloseTo(1169 / 1280, 2);
    const layout = await stage.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const caption = el.parentElement
        .querySelector(".childhood-fundal-segment-text")
        .getBoundingClientRect();
      const bar = document
        .querySelector("#pupilsPecScrollPage .eyes-topbar")
        .getBoundingClientRect();
      const host = document
        .querySelector("#page-content")
        .getBoundingClientRect();
      const bottom = Math.min(window.innerHeight, host.bottom);
      const anchor =
        document.querySelector(
          "#pupilsPecScrollPage .childhood-fundal-stage-top-nav",
        ) ||
        el
          .closest(".fundal-reflex-examination-section")
          .querySelector(".fundal-reflex-section-divider");
      return {
        firstAnchorTop: anchor.getBoundingClientRect().top,
        centreError: (rect.top + caption.bottom - bar.bottom - bottom) / 2,
        top: rect.top,
        bottom: caption.bottom,
        availableTop: bar.bottom,
        availableBottom: bottom,
      };
    });
    if (i === 0)
      expect(
        Math.abs(layout.firstAnchorTop - layout.availableTop),
        JSON.stringify(layout),
      ).toBeLessThan(3);
    else
      expect(Math.abs(layout.centreError), JSON.stringify(layout)).toBeLessThan(
        3,
      );
    expect(layout.top).toBeGreaterThanOrEqual(layout.availableTop + 12);
    if (i > 0)
      expect(layout.bottom).toBeLessThanOrEqual(layout.availableBottom - 12);
    expect(
      await stage.locator(browserName === "webkit" ? "canvas" : "svg").count(),
    ).toBeGreaterThan(0);
    await expect(
      stage.locator("..").locator(".childhood-fundal-segment-text__line"),
    ).toHaveText(cfg.segmentStartTexts[i]);
    if (i === 0) {
      await page.screenshot({
        path: testInfo.outputPath("first-stage-layout.png"),
      });
      expect(
        await guide.evaluate((el) => el.scrollWidth <= window.innerWidth),
      ).toBe(true);
    }
    shots.push({
      input: await sharp(await stage.screenshot())
        .resize(292, 320)
        .png()
        .toBuffer(),
      left: (i % 3) * 292,
      top: Math.floor(i / 3) * 320,
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
    create: { width: 876, height: 640, channels: 3, background: "white" },
  })
    .composite(shots)
    .png()
    .toFile(testInfo.outputPath("six-source-scenes.png"));
  expect(
    await page.evaluate(
      (id) => JSON.parse(localStorage.getItem(`lessonProgress:${id}`)).percent,
      id,
    ),
  ).toBe(100);
  await stages.last().locator(".childhood-fundal-stage-replay-btn").click();
  await expect
    .poll(() =>
      page.evaluate(
        (route) =>
          window.__ARCLIGHT_E2E__.fundal.getStageState(route, 5).playing,
        route,
      ),
    )
    .toBe(true);
  const originalViewport = page.viewportSize();
  await page.setViewportSize({ ...originalViewport, height: 640 });
  await expect
    .poll(() =>
      stages.last().evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const caption = el.parentElement
          .querySelector(".childhood-fundal-segment-text")
          .getBoundingClientRect();
        const bar = document
          .querySelector("#pupilsPecScrollPage .eyes-topbar")
          .getBoundingClientRect();
        return Math.abs(
          (rect.top + caption.bottom - bar.bottom - window.innerHeight) / 2,
        );
      }),
    )
    .toBeLessThan(3);
  await page.screenshot({
    path: testInfo.outputPath("short-viewport-playing-layout.png"),
  });
  await expect(
    stages.last().locator(".childhood-fundal-stage-replay-btn"),
  ).toBeVisible({ timeout: 30_000 });
  await page.setViewportSize(originalViewport);
  let unlitSclera, unlitNose;
  for (const [index, frame] of [
    [0, 0],
    [0, 450],
    [1, 0],
    [1, 100],
    [1, 240],
    [2, 0],
    [2, 75],
    [2, 155],
    [2, 300],
    [2, 510],
    [3, 0],
    [3, 61],
    [3, 62],
    [3, 93],
    [3, 94],
    [3, 100],
    [3, 125],
    [3, 126],
    [3, 170],
    [3, 220],
    [3, 300],
    [4, 0],
    [4, 45],
    [4, 150],
    [4, 450],
    [5, 0],
    [5, 150],
    [5, 450],
  ]) {
    await page.evaluate(
      ({ route, index, frame }) =>
        window.__ARCLIGHT_E2E__.fundal.seekStage(route, index, frame),
      { route, index, frame },
    );
    const snapshot = await stages.nth(index).screenshot({
      path: testInfo.outputPath(`response-${index}-${frame}.png`),
    });
    if (index === 3) {
      const { data, info } = await sharp(snapshot)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      let panelPixels = 0;
      for (
        let y = Math.floor((300 / 1280) * info.height);
        y < Math.ceil((610 / 1280) * info.height);
        y++
      )
        for (
          let x = Math.floor((580 / 1169) * info.width);
          x < Math.ceil((840 / 1169) * info.width);
          x++
        ) {
          const offset = (y * info.width + x) * 4;
          const [r, g, b] = data.subarray(offset, offset + 3);
          if (b > r * 1.2 && b > g * 1.05 && b > 30) panelPixels++;
        }
      if (frame < 185) {
        let exposedCase = 0;
        for (
          let y = Math.floor((735 / 1280) * info.height);
          y < Math.ceil((820 / 1280) * info.height);
          y++
        )
          for (
            let x = Math.floor((570 / 1169) * info.width);
            x < Math.ceil((650 / 1169) * info.width);
            x++
          ) {
            const offset = (y * info.width + x) * 4;
            if (Math.max(...data.subarray(offset, offset + 3)) < 45)
              exposedCase++;
          }
        // The black lower case must never protrude beneath the gripping palm.
        expect(exposedCase).toBe(0);
      }
      // The solar panel must survive every atlas boundary on SVG and iOS Canvas.
      expect(panelPixels).toBeGreaterThan(6);
    }
    if (index === 3 && [0, 170].includes(frame)) {
      const { data, info } = await sharp(snapshot)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const offset =
        (Math.round((520 / 1280) * info.height) * info.width +
          Math.round((940 / 1169) * info.width)) *
        4;
      const nose = [...data.subarray(offset, offset + 3)];
      if (frame === 0) unlitNose = nose;
      else
        expect(
          Math.max(...nose.map((value, i) => Math.abs(value - unlitNose[i]))),
        ).toBeLessThan(12);
    }
    if (index === 3 && frame === 100) {
      const { data, info } = await sharp(snapshot)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      let green = 0;
      for (let pixel = 0; pixel < info.width * info.height; pixel++) {
        const [r, g, b] = data.subarray(pixel * 4, pixel * 4 + 3);
        if (g > 100 && g > r * 2 && g > b * 2) green++;
      }
      expect(green).toBeGreaterThan(20);
    }
    if (index === 4) {
      const { data, info } = await sharp(snapshot)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const sample = (x, y) => {
        const px = Math.min(
          info.width - 1,
          Math.round((x / 1169) * info.width),
        );
        const py = Math.min(
          info.height - 1,
          Math.round((y / 1280) * info.height),
        );
        return [
          ...data.subarray(
            (py * info.width + px) * 4,
            (py * info.width + px) * 4 + 3,
          ),
        ];
      };
      const sclera = sample(619, 304).reduce((a, b) => a + b) / 3;
      if (frame === 0) unlitSclera = sclera;
      // Keep the original right panel's square left and rounded right corners
      // while its contents pan; never substitute the rounded left illustration.
      const top = (1280 - 277.2 - 700) / 2;
      expect(sample(410, top + 20)).not.toEqual(sample(390, top + 20));
      const roundedCorner = sample(690, top + 10);
      expect(
        Math.max(...roundedCorner.map((v, i) => Math.abs(v - [92, 85, 71][i]))),
      ).toBeLessThan(12);
      if (frame === 450) {
        expect(sclera).toBeGreaterThan(210);
        expect(sclera - unlitSclera).toBeGreaterThan(50);
      }
      for (let row = 0; row < 3; row++) {
        // These gaps are outside the clipped cell, including during movement.
        const y = (1280 - 277.2 - 700) / 2 + row * 350 + 277.2 * 0.85;
        for (const x of [20, 390, 729, 1149]) {
          const rgb = sample(x, y);
          expect(
            Math.max(
              ...rgb.map((value, i) => Math.abs(value - [92, 85, 71][i])),
            ),
          ).toBeLessThan(12);
        }
      }
    }
  }
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator("#pupilsPage")).toBeVisible();
  await expect(
    page.locator("[data-fundal-scroll-narration-audio]"),
  ).toHaveCount(0);
  await expect(row.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
  expect(errors).toEqual([]);
  await row.click();
  await expect(guide.locator("audio")).toHaveCount(1);
  await expect(
    stages.first().locator(".childhood-fundal-stage-replay-btn"),
  ).toBeVisible();
});

test("direct links retain Korean narration preferences and clean up on exit", async ({
  page,
}) => {
  await page.addInitScript((id) => {
    localStorage.setItem("prefLang", "ko");
    localStorage.setItem(`videoNarration:${id}`, "off");
    localStorage.setItem(
      `lessonProgress:${id}`,
      JSON.stringify({ percent: 35, updatedAt: Date.now() }),
    );
  }, id);
  await page.goto(`/#/videos/${id}`);
  const guide = page.locator(`#${id}`);
  await expect(guide).toBeVisible();
  await expect(
    guide.locator(".fundal-reflex-section-divider__title"),
  ).toHaveText(["관찰", "직접 대광반사"]);
  await expect(guide.locator("audio")).toHaveCount(1);
  await expect(guide.locator("audio")).toHaveAttribute("src", /\/ko.m4a$/);
  await expect(
    guide.locator("[data-fundal-scroll-narration-toggle]"),
  ).toHaveAttribute("aria-pressed", "false");
  await page.reload();
  await expect(guide.locator("audio")).toHaveCount(1);
  await guide
    .locator("[data-fundal-scroll-narration-language]")
    .selectOption("en");
  await expect(
    guide.locator(".fundal-reflex-section-divider__title"),
  ).toHaveText(["Observation", "Direct Light Response"]);
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator("#pupilsPage")).toBeVisible();
  await expect(
    page.locator("[data-fundal-scroll-narration-audio]"),
  ).toHaveCount(0);
  await page.goto("/#/mylearning");
  await expect(page.locator('[data-ml-tab="inProgress"]')).toHaveAttribute(
    "data-ml-bound",
    "1",
  );
  await page.locator('[data-ml-tab="inProgress"]').click();
  const item = page.locator(`.ml-progress-item[data-sub-page-id="${id}"]`);
  await expect(item).toHaveCount(1);
  await item.locator("../..").locator(".ml-progress-card__summary").click();
  await item.click();
  await expect(guide).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`#/videos/${id}$`));
});
