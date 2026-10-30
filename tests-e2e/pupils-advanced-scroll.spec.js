import { test, expect } from "@playwright/test";
import sharp from "sharp";
import {
  PUPILS_ADVANCED_SCROLL_CONFIG as cfg,
  PUPILS_ADVANCED_TITLE_TRANSLATIONS,
} from "../public/js/pupilsAdvancedScroll.js";
import { useWebKitNarrationClock } from "./helpers/webkit-narration-clock.js";
const id = cfg.pageId,
  route = "pupilsAdvancedScroll";
test.beforeEach(async ({ page, browserName }) => {
  await useWebKitNarrationClock(page, browserName);
  if (browserName === "webkit")
    await page.addInitScript((duration) => {
      const proto = HTMLMediaElement.prototype;
      const original = Object.getOwnPropertyDescriptor(proto, "duration");
      Object.defineProperty(proto, "duration", {
        configurable: true,
        get() {
          return (this.getAttribute("src") || "").includes(
            "/narration/pupils-advanced/",
          )
            ? duration
            : original.get.call(this);
        },
      });
    }, cfg.narrationClipsByFile.at(-1).end);
  await page.addInitScript(() => {
    window.__ARCLIGHT_E2E__ = { fundalPlaybackRate: 12 };
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    sessionStorage.setItem("arclight:account:nudge-dismissed", "1");
  });
});
test("Advanced PDF is followed by Pupils; all fifteen narrated scenes complete and restore", async ({
  page,
}, testInfo) => {
  test.setTimeout(240000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (
      response.url().includes("/pupils-advanced/") &&
      response.status() >= 400
    )
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/#/videos/pupilsPage");
  const row = page.locator(`#pupilsPage [data-target="${id}"]`);
  await expect(row).toBeVisible();
  await expect(row.getByRole("progressbar")).toHaveAccessibleName("Pupils");
  expect(
    await row.evaluate((el) => el.previousElementSibling.dataset.target),
  ).toBe("pupilsAdvancedPdfPage");
  await expect(row.locator(".thumb")).toHaveCSS(
    "background-image",
    /advanced_scrollytell\.webp/,
  );
  await row.screenshot({
    path: testInfo.outputPath("advanced-lesson-row.png"),
  });
  await row.click();
  const guide = page.locator(`#${id}`),
    stages = guide.locator(".childhood-fundal-prep-stage");
  await expect(stages).toHaveCount(cfg.paths.length);
  await expect(
    guide.locator(".fundal-reflex-section-divider__title"),
  ).toHaveText(cfg.sections.map((s) => s.title));
  const shots = [];
  for (let i = 0; i < cfg.paths.length; i++) {
    const stage = stages.nth(i);
    await expect(
      stage.locator(".childhood-fundal-stage-replay-btn"),
    ).toBeVisible({ timeout: 30000 });
    const state = await page.evaluate(
      ({ route, i }) => window.__ARCLIGHT_E2E__.fundal.getStageState(route, i),
      { route, i },
    );
    expect(state.failed).toBe(false);
    expect(state.currentFrame).toBe(cfg.completionHoldFrameByFile[i]);
    if ([0, 9, 10].includes(i)) {
      expect(
        await guide.locator("audio").evaluate((el) => el.currentTime),
      ).toBeCloseTo(cfg.narrationClipsByFile[i].endByLanguage.en, 1);
    }
    await expect(
      stage.locator("..").locator(".childhood-fundal-segment-text__line"),
    ).toHaveText(cfg.segmentStartTexts[i].filter(Boolean));
    const bounds = await stage.boundingBox();
    expect(bounds.width / bounds.height).toBeCloseTo(
      1169 / (i === 3 ? 1093 : 1280),
      2,
    );
    expect(
      await guide.evaluate((el) => el.scrollWidth <= window.innerWidth),
    ).toBe(true);
    const rendered = await stage.screenshot();
    if (i === 14) {
      const pixels = await sharp(rendered).removeAlpha().raw().toBuffer();
      let irisPixels = 0;
      for (let p = 0; p < pixels.length; p += 3) {
        const [r, g, b] = pixels.subarray(p, p + 3);
        if (r > 100 && g > 80 && b < 70 && r > g * 1.1 && g > b * 1.8)
          irisPixels++;
      }
      expect(irisPixels).toBeGreaterThan(30);
    }
    if ([1, 14].includes(i)) {
      const stats = await sharp(rendered).stats();
      expect(
        stats.channels.slice(0, 3).reduce((sum, c) => sum + c.mean, 0) / 3,
      ).toBeGreaterThan(60);
    }
    shots.push({
      input: await sharp(rendered).resize(234, 256).png().toBuffer(),
      left: (i % 4) * 234,
      top: Math.floor(i / 4) * 256,
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
    create: {
      width: 936,
      height: Math.ceil(cfg.paths.length / 4) * 256,
      channels: 3,
      background: "white",
    },
  })
    .composite(shots)
    .png()
    .toFile(testInfo.outputPath("fifteen-advanced-scenes.png"));
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
          window.__ARCLIGHT_E2E__.fundal.getStageState(route, 14).playing,
        route,
      ),
    )
    .toBe(true);
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator("#pupilsPage")).toBeVisible();
  await expect(
    page.locator("[data-fundal-scroll-narration-audio]"),
  ).toHaveCount(0);
  await row.click();
  await expect(
    stages.last().locator(".childhood-fundal-stage-replay-btn"),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("Korean direct links, mute, reload and My Learning retain the owning lesson", async ({
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
  await expect(
    guide.locator(".fundal-reflex-section-divider__title"),
  ).toHaveText(PUPILS_ADVANCED_TITLE_TRANSLATIONS);
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
  ).toHaveText(cfg.sections.map((s) => s.title));
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator("#pupilsPage")).toBeVisible();
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
test("unsupported narration languages fall back to English", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("prefLang", "fr"));
  await page.goto(`/#/videos/${id}`);
  await expect(page.locator(`#${id} audio`)).toHaveAttribute(
    "src",
    /\/en.m4a$/,
  );
});
