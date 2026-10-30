import { expect, test } from "@playwright/test";
import fs from "node:fs";

const narration = JSON.parse(
  fs.readFileSync(
    "public/narration/make-eye-pad-shield/full-animation/video/script.json",
    "utf8",
  ),
);

const id = "makeEyePadShieldFullAnimationVideoPage";
const videoId = "makeEyePadShieldFullAnimationVideo";

async function exitPlayerFullscreen(lesson) {
  const fullscreen = lesson.locator(
    '[data-video-fullscreen-toggle][aria-pressed="true"]',
  );
  if (await fullscreen.count()) await fullscreen.click();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
});

test("Full animation uses the procedure route and synchronised full-animation controls", async ({
  page,
}, testInfo) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#/eyePadShield");
  const row = page.locator(`#eyePadShield [data-target="${id}"]`);
  await expect(row.locator(".lesson-type")).toHaveText("Full animation");
  await expect(row.getByRole("progressbar")).toHaveAccessibleName(
    "Full animation",
  );
  expect(
    await row.evaluate((el) => el.previousElementSibling.dataset.target),
  ).toBe("makeEyePadShieldScrollPage");
  expect(
    await row.evaluate((el) => el.nextElementSibling.dataset.pecVideo),
  ).toBe("apply_eye_pad");
  await page.screenshot({ path: testInfo.outputPath("rows.png") });
  await row.click();
  await expect(page).toHaveURL(new RegExp(`/eyePadShield/${id}$`));
  const lesson = page.locator(`#${id}`);
  const video = page.locator(`#${videoId}`);
  const audio = lesson.locator("[data-video-narration-audio]");
  await expect(lesson).toBeVisible();
  await expect(audio).toHaveAttribute(
    "src",
    /make-eye-pad-shield\/full-animation\/video\/en.m4a$/,
  );
  await expect
    .poll(() => video.evaluate((el) => el.readyState))
    .toBeGreaterThanOrEqual(1);
  expect(await video.evaluate((el) => el.duration)).toBeCloseTo(128, 1);
  expect(await video.evaluate((el) => el.videoHeight)).toBe(240);
  await video.evaluate((el) => el.play());
  await expect.poll(() => audio.evaluate((el) => el.paused)).toBe(false);
  await expect
    .poll(() => video.evaluate((el) => el.currentTime))
    .toBeGreaterThan(1);
  await video.evaluate((el) => {
    el.pause();
    el.currentTime = 40;
  });
  await expect
    .poll(() => audio.evaluate((el) => el.currentTime))
    .toBeCloseTo(40, 0);
  await expect(
    lesson.locator("[data-childhood-pilot-subtitle-panel]"),
  ).toContainText("Tape at the open end.");
  await exitPlayerFullscreen(lesson);
  await lesson.locator('[data-mode="high"]').click();
  await expect(video.locator("source")).toHaveAttribute(
    "src",
    /MakeEyePadShieldFullAnim_720p.mp4$/,
  );
  await expect
    .poll(() => video.evaluate((el) => el.readyState))
    .toBeGreaterThanOrEqual(1);
  await expect
    .poll(() => video.evaluate((el) => el.currentTime))
    .toBeCloseTo(40, 0);
  await expect.poll(() => video.evaluate((el) => el.videoHeight)).toBe(720);
  await expect(lesson.locator('[data-mode="high"]')).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(lesson.locator(".dedicated-video-controls__time")).toHaveText(
    "0:40 / 2:08",
  );
  const background = await video.evaluate((el) => {
    const canvas = document.createElement("canvas");
    canvas.width = el.videoWidth;
    canvas.height = el.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(el, 0, 0);
    return Array.from(context.getImageData(10, 10, 1, 1).data).slice(0, 3);
  });
  [168, 162, 146].forEach((channel, i) =>
    expect(Math.abs(background[i] - channel)).toBeLessThanOrEqual(2),
  );
  await page.screenshot({
    path: testInfo.outputPath("player.png"),
    animations: "disabled",
  });
  // Voice Off and English use the same menu as Front of Eye.
  await lesson.locator("[data-video-narration-toggle]").click();
  await lesson
    .getByRole("menuitemradio", { name: "Narration off", exact: true })
    .click();
  await video.evaluate((el) => el.play());
  await expect.poll(() => audio.evaluate((el) => el.paused)).toBe(true);
  await exitPlayerFullscreen(lesson);
  await lesson.locator("[data-video-narration-toggle]").click();
  await lesson
    .getByRole("menuitemradio", { name: "English", exact: true })
    .click();
  await expect.poll(() => audio.evaluate((el) => el.paused)).toBe(false);
  await exitPlayerFullscreen(lesson);
  // Leaving the lesson pauses both media elements and restores the row progress.
  const audioHandle = await audio.elementHandle();
  const videoHandle = await video.elementHandle();
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator("#eyePadShield")).toBeVisible();
  await expect.poll(() => audioHandle.evaluate((el) => el.paused)).toBe(true);
  await expect.poll(() => videoHandle.evaluate((el) => el.paused)).toBe(true);
  await expect(row.getByRole("progressbar")).not.toHaveAttribute(
    "aria-valuenow",
    "0",
  );
  // A hard refresh must build and initialise this procedure-owned page too.
  await page.goto(`/#/eyePadShield/${id}`);
  await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(
    page.locator(`#${id} [data-video-narration-audio]`),
  ).toHaveAttribute("src", /en.m4a$/);
  expect(errors).toEqual([]);
});

test("all nine video voices keep translated speech and section-title captions on the video clock", async ({
  page,
}, testInfo) => {
  const failures = [];
  page.on("response", (response) => {
    if (
      response.url().includes("/make-eye-pad-shield/") &&
      response.status() >= 400
    )
      failures.push(response.url());
  });
  await page.goto(`/#/eyePadShield/${id}`);
  const lesson = page.locator(`#${id}`);
  const video = lesson.locator("video");
  const audio = lesson.locator("[data-video-narration-audio]");
  const captions = lesson.locator("[data-childhood-pilot-subtitle-panel]");
  await expect(audio).toHaveAttribute("src", /video\/en.m4a$/);
  for (const [language, voice] of Object.entries(narration.languages)) {
    await lesson.locator("[data-video-narration-toggle]").click();
    await lesson
      .getByRole("menuitemradio", { name: voice.label, exact: true })
      .click();
    await expect(audio).toHaveAttribute(
      "src",
      new RegExp(`video/${language}.m4a$`),
    );
    await expect
      .poll(() => audio.evaluate((el) => el.readyState))
      .toBeGreaterThanOrEqual(1);
    expect(await audio.evaluate((el) => el.duration)).toBeCloseTo(128, 1);
    await video.evaluate((el) => {
      el.pause();
      el.currentTime = 4.25;
    });
    await expect(captions).toContainText(narration.cues[0][language]);
    for (const title of narration.videoTitleCues) {
      await video.evaluate((el, time) => {
        el.currentTime = time;
      }, title.start + 0.5);
      if (language !== "en")
        await expect(captions).toContainText(title.translations[language]);
      else {
        await expect.poll(() => video.evaluate((el) => el.seeking)).toBe(false);
        const background = await video.evaluate((el) => {
          const canvas = document.createElement("canvas");
          canvas.width = 1;
          canvas.height = 1;
          const context = canvas.getContext("2d");
          context.drawImage(el, 0, 0, 1, 1, 0, 0, 1, 1);
          return Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3);
        });
        background.forEach((channel) =>
          expect(channel).toBeLessThanOrEqual(17),
        );
      }
    }
    if (language === "ko")
      await page.screenshot({
        path: testInfo.outputPath("korean-section-title.png"),
        animations: "disabled",
      });
  }
  expect(failures).toEqual([]);
});

test("the scrolly switches all nine voices, instruction captions and section headings", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.__ARCLIGHT_E2E__ = { fundalPlaybackRate: 12 };
  });
  await page.goto("/#/eyePadShield/makeEyePadShieldScrollPage");
  const guide = page.locator("#makeEyePadShieldScrollPage");
  const select = guide.locator("[data-fundal-scroll-narration-language]");
  await expect(select.locator("option")).toHaveCount(10);
  await expect(
    guide.locator(".childhood-fundal-stage-replay-btn").first(),
  ).toBeVisible();
  for (const language of Object.keys(narration.languages)) {
    await select.selectOption(language);
    await expect(guide.locator("audio")).toHaveAttribute(
      "src",
      new RegExp(`full-animation/${language}.m4a$`),
    );
    await expect(
      guide.locator(".childhood-fundal-segment-text").first(),
    ).toContainText(narration.cues[0][language]);
    await expect(
      guide.locator(".fundal-reflex-section-divider__title"),
    ).toHaveText(
      narration.videoTitleCues.map((title) =>
        language === "en" ? title.sourceText : title.translations[language],
      ),
    );
  }
});
