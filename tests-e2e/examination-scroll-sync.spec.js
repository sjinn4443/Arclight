import { expect, test } from "@playwright/test";
import fs from "node:fs";
import { useWebKitNarrationClock } from "./helpers/webkit-narration-clock.js";
import {
  EXAMINATION_SCROLL_TIMING,
  frameAtNarrationTime,
} from "../public/js/examinationScrollTiming.js";

// This suite isolates the speech clock. Scrolling an offscreen arrow into view
// can legitimately start the following lesson before a pointer click arrives.
// Exercise keyboard activation without introducing that separate scroll journey.
async function advanceWithKeyboard(page, arrow) {
  await expect(arrow).toBeEnabled();
  await expect(arrow).toHaveClass(/is-visible/);
  await arrow.evaluate((el) => el.focus({ preventScroll: true }));
  await page.keyboard.press("Enter");
}

for (const [pageId, timing] of Object.entries(EXAMINATION_SCROLL_TIMING)) {
  test(`${pageId}: speech clock controls scenes, captions and completion`, async ({
    page,
    browserName,
  }, testInfo) => {
    test.setTimeout(240_000);
    const route = pageId.replace(/Page$/, "");
    const hub = pageId.startsWith("front")
      ? "frontOfEyePage"
      : "directOphthalmoscopy";
    const script = JSON.parse(
      fs.readFileSync(
        `public/narration/${timing.folder}/full-animation/script.json`,
        "utf8",
      ),
    );
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await useWebKitNarrationClock(page, browserName);
    await page.addInitScript(() => {
      window.__ARCLIGHT_E2E__ = {};
      localStorage.setItem("arclight:onboarded", "1");
      localStorage.setItem("prefLang", "en");
    });
    await page.goto(`/#/videos/${hub}`);
    await page.waitForFunction(
      () => document.getElementById("videos")?.style.visibility === "visible",
    );
    await page.locator(`#${hub} [data-target="${pageId}"]`).click();
    const guide = page.locator(`#${pageId}`);
    const audio = guide.locator("audio");
    const toggle = guide.locator("[data-fundal-scroll-narration-toggle]");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    // No sound-button click: launcher activation must unlock audible playback.
    await expect
      .poll(() => audio.evaluate((el) => !el.paused && el.currentTime))
      .toBeGreaterThan(timing.stages[0][0][0]);
    // Pause each subsequent play immediately so slow WebKit test round-trips
    // cannot finish a short real-time clip before its cue assertions run.
    await audio.evaluate((el) => {
      el.pause();
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function (...args) {
        const result = play.apply(this, args);
        if ((this.getAttribute("src") || "").includes("/narration/")) {
          Promise.resolve(result).then(
            () => this.pause(),
            () => {},
          );
        }
        return result;
      };
    });

    for (const [index, points] of timing.stages.entries()) {
      const start = points[0][0];
      const end = points.at(-1)[0];
      const speechEnd =
        pageId === "directOphthalmoscopyScrollPage" && index === 7 ? 94.4 : end;
      const stage = guide.locator(".childhood-fundal-prep-stage").nth(index);
      const slot = stage.locator("..");
      const replay = stage.locator(".childhood-fundal-stage-replay-btn");
      const arrow = slot.locator(".childhood-fundal-scroll-down-arrow");
      const state = () =>
        page.evaluate(
          ({ route, index }) =>
            window.__ARCLIGHT_E2E__.fundal.getStageState(route, index),
          { route, index },
        );
      await expect.poll(async () => (await state())?.playing).toBe(true);
      await expect
        .poll(() => audio.evaluate((el) => el.readyState))
        .toBeGreaterThanOrEqual(2);
      // Freeze the media clock, as with buffering, then visit every cue boundary.
      await audio.evaluate((el) => el.pause());
      const cues = script.cues.filter(
        (cue) => cue.start >= start - 0.01 && cue.end <= end + 0.01,
      );
      const landmarks =
        pageId === "directOphthalmoscopyScrollPage"
          ? { 7: [90.88, 91.76, 92.2], 8: [109.09, 110.23, 111.59] }[index] ||
            []
          : pageId === "binocularIndirectOphthalmoscopyScrollPage" &&
              index === 2
            ? [27, 29, 31, 34, 37]
            : [];
      const sampleTimes = [
        ...cues.map((cue) => cue.start + 0.1),
        ...landmarks,
      ].sort((a, b) => a - b);
      for (const sampleTime of sampleTimes) {
        const current = await audio.evaluate((el) => el.currentTime);
        const time = Math.max(start + 0.5, sampleTime, current + 0.02);
        await audio.evaluate((el, time) => {
          el.currentTime = time;
        }, time);
        await expect
          .poll(async () => (await state())?.currentFrame)
          .toBe(frameAtNarrationTime(points, time));
        await expect(
          slot.locator(
            ".childhood-fundal-segment-text__line, .childhood-fundal-segment-text__bullet-item",
          ),
        ).toHaveText(
          cues.filter((cue) => cue.start <= time).map((entry) => entry.en),
        );
        if (landmarks.includes(sampleTime))
          await page.screenshot({
            path: testInfo.outputPath(`landmark-${index}-${sampleTime}.png`),
          });
      }
      await audio.evaluate((el, time) => {
        el.currentTime = time;
      }, speechEnd - 0.3);
      await expect
        .poll(async () => (await state())?.currentFrame)
        .toBe(frameAtNarrationTime(points, speechEnd - 0.3));
      await page.waitForTimeout(400);
      await expect(replay).toBeHidden();
      await expect(arrow).not.toHaveClass(/is-visible/);
      expect((await state()).completed).toBe(false);
      await page.screenshot({
        path: testInfo.outputPath(`scene-${index + 1}.png`),
      });
      await audio.evaluate((el, time) => {
        el.currentTime = time;
        el.dispatchEvent(new Event("timeupdate"));
      }, speechEnd);
      if (end > speechEnd) {
        await expect(audio).toHaveJSProperty("paused", true);
        await expect(replay).toBeHidden();
        await expect(arrow).not.toHaveClass(/is-visible/);
      }
      await expect(replay).toBeVisible();
      await expect
        .poll(async () => (await state())?.currentFrame)
        .toBe(points.at(-1)[1]);
      if (index < timing.stages.length - 1)
        await expect(arrow).toHaveCSS("opacity", "1");
      const sectionGap = await slot.evaluate((item) => {
        const section = item.closest(".fundal-reflex-examination-section");
        if (
          item !==
          section?.querySelector(".fundal-reflex-examination-section-items")
            ?.lastElementChild
        )
          return null;
        const divider = section.nextElementSibling?.querySelector(
          ".fundal-reflex-section-divider",
        );
        const arrow = item.querySelector(".childhood-fundal-scroll-down-arrow");
        return divider && arrow
          ? divider.getBoundingClientRect().top -
              arrow.getBoundingClientRect().bottom
          : null;
      });
      if (sectionGap != null)
        expect(
          sectionGap,
          "The next section must clear the down arrow",
        ).toBeGreaterThanOrEqual(16);
      if (index < timing.stages.length - 1)
        await advanceWithKeyboard(page, arrow);
    }
    // A completed revisit must restore every stage's captions without replay.
    await page.reload();
    // Restoration waits for all scene assets, including cold WebKit renderers.
    await expect
      .poll(
        () =>
          page.evaluate(
            (route) =>
              window.__ARCLIGHT_E2E__?.fundal?.getStageState(route, 0)
                ?.completed,
            route,
          ),
        { timeout: 60_000 },
      )
      .toBe(true);
    for (const [index, points] of timing.stages.entries()) {
      const stage = guide.locator(".childhood-fundal-prep-stage").nth(index);
      await expect(
        stage.locator(".childhood-fundal-stage-replay-btn"),
      ).toBeVisible();
      const cues = script.cues.filter(
        (cue) =>
          cue.start >= points[0][0] - 0.01 &&
          cue.end <= points.at(-1)[0] + 0.01,
      );
      await expect(
        stage
          .locator("..")
          .locator(
            ".childhood-fundal-segment-text__line, .childhood-fundal-segment-text__bullet-item",
          ),
      ).toHaveText(cues.map((cue) => cue.en));
    }
    expect(errors).toEqual([]);
  });
}

test("Front of Eye first sound click mutes, resumes at the same clock, and cleans up", async ({
  page,
  browserName,
}) => {
  await useWebKitNarrationClock(page, browserName);
  await page.addInitScript(() => {
    window.__ARCLIGHT_E2E__ = {};
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
  await page.goto("/#/videos/frontOfEyePage");
  await page.waitForFunction(
    () => document.getElementById("videos")?.style.visibility === "visible",
  );
  await page
    .locator('#frontOfEyePage [data-target="frontOfEyeExaminationScrollPage"]')
    .click();
  const guide = page.locator("#frontOfEyeExaminationScrollPage");
  const audio = guide.locator("audio");
  const toggle = guide.locator("[data-fundal-scroll-narration-toggle]");
  await expect(audio).toHaveJSProperty("paused", false);
  // Exercise mute/resume in the longer second clip, leaving enough wall time
  // for WebKit's UI interaction overhead before the natural clip endpoint.
  await audio.evaluate((el) => {
    el.currentTime = 9.7;
    el.dispatchEvent(new Event("timeupdate"));
  });
  await expect(
    guide.locator(".childhood-fundal-stage-replay-btn").first(),
  ).toBeVisible();
  await advanceWithKeyboard(
    page,
    guide.locator(".childhood-fundal-scroll-down-arrow").first(),
  );
  await expect
    .poll(() => audio.evaluate((el) => el.currentTime))
    .toBeGreaterThanOrEqual(10);
  await expect(audio).toHaveJSProperty("paused", false);
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(audio).toHaveJSProperty("paused", true);
  const before = await audio.evaluate((el) => el.currentTime);
  await page.waitForTimeout(600);
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() => audio.evaluate((el) => el.currentTime))
    .toBeGreaterThan(before + 0.4);
  await expect(audio).toHaveJSProperty("paused", false);
  await page.locator("#backBtnGlobal").click();
  await expect(audio).toHaveCount(0);
});
