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
test("Primary launcher plays all storyboard scenes, preserves captions and restores completion", async ({
  page,
}, info) => {
  test.setTimeout(240000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#/videos/cataractPage");
  const row = page.locator(`#cataractPage [data-target="${id}"]`);
  await expect(row).toBeVisible();
  await page.waitForFunction(() => window.__videosGlobalBound === true);
  await expect(row.getByRole("progressbar")).toHaveAccessibleName("Cataract");
  expect(await row.evaluate((el) => el.nextElementSibling.dataset.target)).toBe(
    "cataractSimulatorPage",
  );
  await row.click();
  const guide = page.locator(`#${id}`),
    stages = guide.locator(".childhood-fundal-prep-stage");
  const count = cfg.paths.length;
  await expect(stages).toHaveCount(count);
  await expect(
    guide.locator(".fundal-reflex-section-divider__title"),
  ).toHaveText(cfg.sections.map((s) => s.title));
  const shots = [];
  for (let i = 0; i < count; i++) {
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
    if (i < 3) {
      await stage.scrollIntoViewIfNeeded();
      const stageBox = await stage.boundingBox();
      const button = stage.locator(".childhood-fundal-stage-replay-btn");
      const replay = await button.boundingBox();
      await button.evaluate((el) =>
        el.style.setProperty("opacity", "0", "important"),
      );
      const artwork = await stage.screenshot({ scale: "css" });
      await button.evaluate((el) => el.style.removeProperty("opacity"));
      const beneathReplay = await sharp(artwork)
        .extract({
          left: Math.round(replay.x - stageBox.x),
          top: Math.round(replay.y - stageBox.y),
          width: Math.floor(replay.width),
          height: Math.floor(replay.height),
        })
        .png()
        .toBuffer();
      const { channels } = await sharp(beneathReplay).stats();
      // The held replay button should cover only the flat floor.
      if (Math.max(...channels.map((c) => c.stdev)) >= 1) {
        await info.attach("replay-background", {
          body: beneathReplay,
          contentType: "image/png",
        });
        await info.attach("held-artwork", {
          body: artwork,
          contentType: "image/png",
        });
      }
      expect(
        Math.max(...channels.map((c) => c.stdev)),
        `Replay overlaps scene ${i + 1}`,
      ).toBeLessThan(1);
    }
    const screenshot = await stage.screenshot();
    const stats = await sharp(screenshot).stats();
    expect(stats.channels[0].stdev).toBeGreaterThan(15);
    shots.push({
      input: await sharp(screenshot).resize(234, 256).png().toBuffer(),
      left: (i % 3) * 234,
      top: Math.floor(i / 3) * 256,
    });
    if (i < count - 1) {
      await stage
        .locator("..")
        .locator(".childhood-fundal-scroll-down-arrow")
        .evaluate((el) => el.focus({ preventScroll: true }));
      await page.keyboard.press("Enter");
    }
  }
  await sharp({
    create: {
      width: 702,
      height: Math.ceil(count / 3) * 256,
      channels: 3,
      background: "white",
    },
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
        ({ route, index }) =>
          window.__ARCLIGHT_E2E__.fundal.getStageState(route, index)?.playing,
        { route, index: count - 1 },
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
  ).toContainText("시력이 변했는지");
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
  ).toHaveText("History Taking");
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

test("each section shortcut opens the corresponding detailed guide", async ({
  page,
  hasTouch,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "lessonProgress:cataractScrollPage",
      JSON.stringify({ percent: 100, updatedAt: Date.now() }),
    );
  });
  for (const [index, section] of cfg.sections.entries()) {
    // Start each independent deep link in a fresh document. A hash-only visit
    // can retain the previous guide's scroll restoration on mobile WebKit.
    await page.goto("about:blank");
    await page.goto(`/#/videos/${id}`);
    // Restoring a completed lesson initially returns the viewport to its start.
    // Let that navigation finish before scrolling down to a section shortcut.
    await expect(
      page.locator(`#${id} .childhood-fundal-stage-replay-btn`).last(),
    ).toBeVisible({ timeout: 30000 });
    const shortcut = page
      .locator(`#${id} .fundal-reflex-section-shortcut`)
      .nth(index);
    await expect(shortcut).toHaveAttribute("href", section.shortcut);
    await expect(shortcut).toHaveText("Open guide");
    await shortcut.evaluate((link) =>
      link.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    if (hasTouch) await shortcut.tap();
    else await shortcut.click();
    await expect(page).toHaveURL(
      new RegExp(section.shortcut.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"),
    );
    await expect(
      page.locator(`#${section.shortcut.split("/")[2]}`),
    ).toBeVisible();
    await expect(
      page.locator(`#${id} [data-fundal-scroll-narration-audio]`),
    ).toHaveCount(0);
  }
});
