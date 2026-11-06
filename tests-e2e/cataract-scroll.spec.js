import { test, expect } from "@playwright/test";
import sharp from "sharp";
import { CATARACT_SCROLL_CONFIG as cfg } from "../public/js/cataractScroll.js";
import { useWebKitNarrationClock } from "./helpers/webkit-narration-clock.js";
const id = cfg.pageId,
  route = "cataractScroll";
test.beforeEach(async ({ page, browserName }) => {
  await useWebKitNarrationClock(page, browserName);
  if (browserName === "webkit") {
    await page.addInitScript(() => {
      const proto = HTMLMediaElement.prototype;
      const original = Object.getOwnPropertyDescriptor(proto, "duration");
      Object.defineProperty(proto, "duration", {
        configurable: true,
        get() {
          return (this.getAttribute("src") || "").includes(
            "/narration/cataract/",
          )
            ? 331
            : original.get.call(this);
        },
      });
    });
  }
  await page.addInitScript(() => {
    window.__ARCLIGHT_E2E__ = { fundalPlaybackRate: 16 };
    if (sessionStorage.getItem("cataractCommonSeeded")) return;
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    // Most matrix checks use the real muted virtual clock. A separate test
    // exercises actual AAC in Chromium and the media shim in Windows WebKit.
    localStorage.setItem("videoNarration:cataractScrollPage", "off");
    sessionStorage.setItem("arclight:account:nudge-dismissed", "1");
    sessionStorage.setItem("cataractCommonSeeded", "1");
  });
});
test("Primary launcher plays all 18 original scenes, preserves captions and restores completion", async ({
  page,
}, info) => {
  test.setTimeout(240000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#/videos/cataractPage");
  const row = page.locator(`#cataractPage [data-target="${id}"]`);
  await expect(row).toBeVisible();
  await expect(row.getByRole("progressbar")).toHaveAccessibleName("Cataract");
  expect(await row.evaluate((el) => el.nextElementSibling.dataset.target)).toBe(
    "cataractSimulatorPage",
  );
  await row.click();
  const guide = page.locator(`#${id}`),
    stages = guide.locator(".childhood-fundal-prep-stage");
  await expect(stages).toHaveCount(18);
  await expect(
    guide.locator(".fundal-reflex-section-divider__title"),
  ).toHaveText(cfg.sections.map((s) => s.title));
  const shots = [];
  for (let i = 0; i < 18; i++) {
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
    await expect(
      stage.locator("..").locator(".childhood-fundal-segment-text__line"),
    ).toHaveText(cfg.segmentStartTexts[i]);
    expect(
      await guide.evaluate((el) => el.scrollWidth <= window.innerWidth + 1),
    ).toBe(true);
    const box = await stage.boundingBox();
    expect(box.width / box.height).toBeCloseTo(1169 / 1280, 2);
    const screenshot = await stage.screenshot();
    const stats = await sharp(screenshot).stats();
    expect(stats.channels[0].stdev).toBeGreaterThan(15);
    shots.push({
      input: await sharp(screenshot).resize(234, 256).png().toBuffer(),
      left: (i % 3) * 234,
      top: Math.floor(i / 3) * 256,
    });
    if (i < 17) {
      await stage
        .locator("..")
        .locator(".childhood-fundal-scroll-down-arrow")
        .evaluate((el) => el.focus({ preventScroll: true }));
      await page.keyboard.press("Enter");
    }
  }
  await sharp({
    create: { width: 702, height: 1536, channels: 3, background: "white" },
  })
    .composite(shots)
    .png()
    .toFile(info.outputPath("cataract-scenes.png"));
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
          window.__ARCLIGHT_E2E__.fundal.getStageState(route, 17)?.playing,
        route,
      ),
    )
    .toBe(true);
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator("#cataractPage")).toBeVisible();
  await expect(
    page.locator("[data-fundal-scroll-narration-audio]"),
  ).toHaveCount(0);
  await row.click();
  await expect(
    stages.last().locator(".childhood-fundal-stage-replay-btn"),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("deep links use Korean captions, real narration, language fallback and My Learning", async ({
  page,
  browserName,
}) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("cataractTestSeeded")) {
      localStorage.setItem("prefLang", "ko");
      localStorage.setItem("videoNarration:cataractScrollPage", "on");
      localStorage.setItem(
        "lessonProgress:cataractScrollPage",
        JSON.stringify({ percent: 35, updatedAt: Date.now() }),
      );
      sessionStorage.setItem("cataractTestSeeded", "1");
    }
  });
  await page.goto(`/#/videos/${id}`);
  const guide = page.locator(`#${id}`);
  await expect(
    guide.locator(".fundal-reflex-section-divider__title").first(),
  ).toHaveText("병력 청취");
  await expect(
    guide.locator(".childhood-fundal-stage-replay-btn").first(),
  ).toBeVisible({ timeout: 30000 });
  await expect(
    guide.locator(".childhood-fundal-segment-text__line").first(),
  ).toContainText("시력이 언제부터");
  await expect(guide.locator("audio")).toHaveAttribute(
    "src",
    /cataract\/full-animation\/ko\.m4a/,
  );
  if (browserName === "chromium")
    expect(await guide.locator("audio").evaluate((el) => el.error)).toBe(null);
  await guide
    .locator("[data-fundal-scroll-narration-language]")
    .selectOption("en");
  await expect(
    guide.locator(".fundal-reflex-section-divider__title").first(),
  ).toHaveText("history taking");
  await guide.locator("[data-fundal-scroll-narration-toggle]").click();
  await page.reload();
  await expect(
    guide.locator("[data-fundal-scroll-narration-toggle]"),
  ).toHaveAttribute("aria-pressed", "false");
  await page.goto("/#/mylearning");
  await expect(page.locator('[data-ml-tab="inProgress"]')).toHaveAttribute(
    "data-ml-bound",
    "1",
  );
  await page.locator('[data-ml-tab="inProgress"]').click();
  const saved = page.locator(`.ml-progress-item[data-sub-page-id="${id}"]`);
  await expect(saved).toHaveCount(1);
  await saved.locator("../..").locator(".ml-progress-card__summary").click();
  await saved.click();
  await expect(guide).toBeVisible();
});

test("unsupported narration languages fall back to English", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("prefLang", "fr"));
  await page.goto(`/#/videos/${id}`);
  await expect(page.locator(`#${id} audio`)).toHaveAttribute(
    "src",
    /\/en\.m4a$/,
  );
});
