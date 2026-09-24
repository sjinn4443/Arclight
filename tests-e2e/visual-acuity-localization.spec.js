import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { VISUAL_ACUITY_NARRATION_TRACKS as tracks } from "../public/js/visualAcuityNarrationTracks.js";
import { useWebKitNarrationClock } from "./helpers/webkit-narration-clock.js";

const script = JSON.parse(
  fs.readFileSync(
    "public/narration/visual-acuity/full-animation/script.json",
    "utf8",
  ),
);

test("Visual Acuity switches packaged scroll narration, captions and section headings together", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const id = "visualAcuityExaminationScrollPage";
  await page.addInitScript((id) => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    localStorage.setItem(`videoNarration:${id}`, "off");
    localStorage.setItem(
      `lessonProgress:${id}`,
      JSON.stringify({ percent: 100 }),
    );
  }, id);
  await page.goto(`/#/videos/${id}`);
  const guide = page.locator(`#${id}`);
  const select = guide.locator("[data-fundal-scroll-narration-language]");
  await expect(select).toBeVisible();
  for (const language of Object.keys(tracks)) {
    await select.selectOption(language);
    await expect(guide.locator("audio")).toHaveAttribute(
      "src",
      tracks[language].src,
    );
    await expect(
      guide.locator(".fundal-reflex-section-divider__title").first(),
    ).toHaveText(
      script.videoTitleCues[0].translations[language] || "Preparation",
    );
    await expect(
      guide.locator(".childhood-fundal-segment-text").first(),
    ).toContainText(script.cues[0][language]);
  }
  await page.reload();
  await expect(select.locator("option")).toHaveCount(
    Object.keys(tracks).length + 1,
    { timeout: 60_000 },
  );
  await expect(select).toHaveValue(Object.keys(tracks).at(-1));
});

test("Visual Acuity Full Animation switches all nine subtitle and narration languages", async ({
  page,
  browserName,
}) => {
  // This Windows WebKit host cannot decode AAC; Chromium validates real audio.
  await useWebKitNarrationClock(page, browserName);
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    localStorage.setItem(
      "videoNarrationLanguage:visualAcuityFullAnimationVideoPage",
      "off",
    );
  });
  await page.goto("/#/videos/visualAcuityFullAnimationVideoPage");
  const player = page.locator("#visualAcuityFullAnimationVideoPage");
  const video = player.locator("video");
  await expect(video).toBeVisible();
  for (const language of Object.keys(script.languages)) {
    await page.evaluate((language) => {
      localStorage.setItem("prefLang", language === "es-419" ? "es" : language);
      window.dispatchEvent(new CustomEvent("i18n:languageChanged"));
    }, language);
    await expect(
      video.locator("track[data-childhood-pilot-subtitle]"),
    ).toHaveAttribute(
      "src",
      `/narration/visual-acuity/full-animation/${language}.vtt`,
    );
    await video.evaluate((v) => {
      v.pause();
      v.currentTime = 4;
      v.dispatchEvent(new Event("timeupdate"));
    });
    await expect(
      player.locator("[data-childhood-pilot-subtitle-panel]"),
    ).toContainText(script.cues[0][language]);
  }
  for (const [language, track] of Object.entries(tracks)) {
    await player.locator("[data-video-narration-toggle]").click();
    await player
      .locator('[data-narration-selection="' + language + '"]')
      .click();
    await expect(player.locator("audio")).toHaveAttribute("src", track.src);
    await expect(
      video.locator("track[data-childhood-pilot-subtitle]"),
    ).toHaveAttribute(
      "src",
      "/narration/visual-acuity/full-animation/" + language + ".vtt",
    );
    await expect(
      player.locator("[data-childhood-pilot-subtitle-panel]"),
    ).toContainText(script.cues[0][language]);
    await expect
      .poll(() => player.locator("audio").evaluate((a) => a.readyState))
      .toBeGreaterThanOrEqual(1);
    expect(await player.locator("audio").evaluate((a) => a.error)).toBeNull();
  }
});
