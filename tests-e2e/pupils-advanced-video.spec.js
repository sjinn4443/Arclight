import { expect, test } from "@playwright/test";
import fs from "node:fs";

const id = "pupilsAdvancedFullAnimationVideoPage";
const script = JSON.parse(
  fs.readFileSync(
    "public/narration/pupils-advanced/full-animation/video/script.json",
    "utf8",
  ),
);

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    sessionStorage.setItem("arclight:account:nudge-dismissed", "1");
  });
});

test("Pupils Full Animation reuses the lesson clock, voices and captions", async ({
  page,
}, testInfo) => {
  test.setTimeout(180_000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#/videos/pupilsPage");
  const row = page.locator(`#pupilsPage [data-target="${id}"]`);
  await expect(row).toBeVisible();
  await expect(row.getByRole("progressbar")).toHaveAccessibleName(
    "Pupils Full Animation",
  );
  expect(
    await row.evaluate((el) => el.previousElementSibling.dataset.target),
  ).toBe("pupilsAdvancedScrollPage");
  expect(
    await row.evaluate((el) => el.nextElementSibling?.dataset.target),
  ).toBe(undefined);
  await row.click();
  await expect(page).toHaveURL(new RegExp(`/videos/${id}$`));
  const lesson = page.locator(`#${id}`);
  const video = lesson.locator("video");
  const audio = lesson.locator("[data-video-narration-audio]");
  const captions = lesson.locator("[data-childhood-pilot-subtitle-panel]");
  await expect(audio).toHaveAttribute(
    "src",
    /pupils-advanced\/full-animation\/video\/en.m4a$/,
  );
  await expect
    .poll(() => video.evaluate((v) => v.readyState))
    .toBeGreaterThanOrEqual(2);
  expect(await video.evaluate((v) => v.duration)).toBeCloseTo(
    script.durationSeconds,
    1,
  );
  expect(await video.evaluate((v) => v.videoHeight)).toBe(240);
  const qualityTime =
    script.cues.find((c) => c.id === "shine-constrict").start + 0.2;
  const playButton = lesson.getByRole("button", { name: "Play", exact: true });
  if (await playButton.count()) await playButton.click();
  else await video.evaluate((v) => v.play());
  await expect.poll(() => audio.evaluate((a) => a.paused)).toBe(false);
  await video.evaluate((v) => v.pause());
  const fullscreen = lesson.locator(
    '[data-video-fullscreen-toggle][aria-pressed="true"]',
  );
  if (await fullscreen.count()) await fullscreen.click();

  for (const [language, voice] of Object.entries(script.languages)) {
    await lesson.locator("[data-video-narration-toggle]").click();
    await lesson
      .getByRole("menuitemradio", { name: voice.label, exact: true })
      .click();
    await expect(audio).toHaveAttribute("src", new RegExp(`/${language}.m4a$`));
    for (const title of script.videoTitleCues) {
      await video.evaluate(async (v, t) => {
        await new Promise((resolve) => {
          v.addEventListener("seeked", resolve, { once: true });
          v.currentTime = t;
        });
      }, title.start + 0.5);
      if (language !== "en")
        await expect(captions).toContainText(title.translations[language]);
      else await expect(captions).toHaveText("");
      const pixels = await video.evaluate((v) => {
        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 220;
        const context = canvas.getContext("2d");
        context.drawImage(v, 0, 0, 200, 220);
        const rgba = context.getImageData(0, 0, 200, 220).data;
        let white = 0;
        for (let i = 0; i < rgba.length; i += 4)
          if (rgba[i] > 220 && rgba[i + 1] > 220 && rgba[i + 2] > 220) white++;
        return { corner: rgba[0], white };
      });
      expect(pixels.corner).toBeLessThan(25);
      expect(pixels.white).toBeGreaterThan(50);
      await page.screenshot({
        path: testInfo.outputPath(`${language}-${title.id}.png`),
      });
    }
    for (const cue of script.cues) {
      const time = cue.start + 0.2;
      await video.evaluate(async (v, t) => {
        await new Promise((resolve) => {
          v.addEventListener("seeked", resolve, { once: true });
          v.currentTime = t;
        });
      }, time);
      const shown =
        (cue.caption?.[language] ?? cue[language]) ||
        script.cues.find((c) => c.captionUntil === cue.id)?.caption?.[language];
      await expect(captions).toContainText(shown);
      await expect
        .poll(() => audio.evaluate((a) => a.currentTime))
        .toBeCloseTo(time, 1);
    }
  }
  await lesson.locator("[data-video-narration-toggle]").click();
  await lesson
    .getByRole("menuitemradio", { name: "한국어", exact: true })
    .click();
  await video.evaluate((v, t) => {
    v.currentTime = t;
  }, qualityTime);
  await expect.poll(() => video.evaluate((v) => v.seeking)).toBe(false);
  await lesson.locator('[data-mode="high"]').click();
  await expect.poll(() => video.evaluate((v) => v.videoHeight)).toBe(720);
  await expect
    .poll(() => video.evaluate((v) => v.currentTime))
    .toBeCloseTo(qualityTime, 0);
  await expect(captions).toContainText(
    script.cues.find((cue) => cue.id === "shine-constrict").ko,
  );
  // Every exported stage must contain actual illustration pixels, including its terminal hold.
  for (const time of script.videoSceneCues.map((scene) => scene.end - 0.2)) {
    await video.evaluate(async (v, t) => {
      await new Promise((resolve) => {
        v.addEventListener("seeked", resolve, { once: true });
        v.currentTime = t;
      });
    }, time);
    const dark = await video.evaluate((v) => {
      const c = document.createElement("canvas");
      c.width = 100;
      c.height = 110;
      const ctx = c.getContext("2d");
      ctx.drawImage(v, 0, 0, 100, 110);
      const pixels = ctx.getImageData(0, 0, 100, 110).data;
      let count = 0;
      for (let i = 0; i < pixels.length; i += 4)
        if (pixels[i] < 100 && pixels[i + 1] < 100 && pixels[i + 2] < 100)
          count++;
      return count;
    });
    expect(dark).toBeGreaterThan(20);
    await page.screenshot({ path: testInfo.outputPath(`stage-${time}.png`) });
  }
  const audioHandle = await audio.elementHandle();
  const videoHandle = await video.elementHandle();
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator("#pupilsPage")).toBeVisible();
  await expect.poll(() => audioHandle.evaluate((a) => a.paused)).toBe(true);
  await expect.poll(() => videoHandle.evaluate((v) => v.paused)).toBe(true);
  await expect(row.getByRole("progressbar")).not.toHaveAttribute(
    "aria-valuenow",
    "0",
  );
  await page.goto(`/#/videos/${id}`);
  await expect(lesson).toBeVisible();
  await expect(audio).toHaveAttribute("src", /ko.m4a$/);
  expect(errors).toEqual([]);
});

test("Advanced video direct links fall back to English and My Learning opens the video", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("prefLang", "fr"));
  await page.goto(`/#/videos/${id}`);
  const lesson = page.locator(`#${id}`),
    video = lesson.locator("video"),
    audio = lesson.locator("[data-video-narration-audio]");
  await expect(audio).toHaveAttribute("src", /\/en.m4a$/);
  await expect
    .poll(() => video.evaluate((v) => v.readyState))
    .toBeGreaterThanOrEqual(2);
  await video.evaluate((v) => {
    v.currentTime = 100;
    v.dispatchEvent(new Event("timeupdate"));
  });
  await expect
    .poll(() =>
      page.evaluate(
        (id) =>
          JSON.parse(localStorage.getItem(`videoProgress:${id}`))?.percent || 0,
        id,
      ),
    )
    .toBeGreaterThan(20);
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
  await expect(lesson).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/videos/${id}$`));
});
