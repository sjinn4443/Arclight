import { expect, test } from "@playwright/test";
import fs from "node:fs";
import { EXAMINATION_SCROLL_TIMING } from "../public/js/examinationScrollTiming.js";

for (const [pageId, timing] of Object.entries(EXAMINATION_SCROLL_TIMING)) {
  test(`${pageId} translates section headings with the narration language`, async ({
    page,
  }) => {
    const script = JSON.parse(
      fs.readFileSync(
        `public/narration/${timing.folder}/full-animation/script.json`,
        "utf8",
      ),
    );
    await page.addInitScript((id) => {
      localStorage.setItem("arclight:onboarded", "1");
      localStorage.setItem("prefLang", "en");
      localStorage.setItem(`videoNarration:${id}`, "off");
    }, pageId);
    await page.goto(`/#/videos/${pageId}`);
    const guide = page.locator(`#${pageId}`);
    const headings = guide.locator(".fundal-reflex-section-divider__title");
    const select = guide.locator("[data-fundal-scroll-narration-language]");
    await expect(select).toBeVisible();
    await expect(headings.first()).toBeVisible();
    const sourceTitles = await headings.evaluateAll((els) =>
      els.map((el) => el.dataset.sectionTitle),
    );
    if (timing.languages?.length === 1) {
      await select.selectOption("en");
      await page.evaluate(() => {
        localStorage.setItem("prefLang", "ko");
        window.dispatchEvent(new CustomEvent("i18n:languageChanged"));
      });
      await expect(select).toHaveValue("auto");
      await expect(select.locator('option[value="auto"]')).toContainText("EN");
      await expect(headings).toHaveText(sourceTitles);
      return;
    }
    const cues = sourceTitles.map((title) =>
      script.videoTitleCues.find((cue) => cue.sourceText === title),
    );
    expect(cues.every(Boolean)).toBe(true);
    for (const language of [
      "ko",
      "fr",
      "es-419",
      "ne",
      "lg",
      "ha",
      "yo",
      "ig",
      "en",
    ]) {
      await select.selectOption(language);
      await expect(headings).toHaveText(
        cues.map((cue) => cue.translations[language] || cue.sourceText),
      );
    }
    await select.selectOption("fr");
    await page.reload();
    await expect(select).toHaveValue("fr");
    await expect(headings).toHaveText(cues.map((cue) => cue.translations.fr));
    await page.evaluate(() => {
      localStorage.setItem("prefLang", "ko");
      window.dispatchEvent(new CustomEvent("i18n:languageChanged"));
    });
    await expect(select).toHaveValue("auto");
    await expect(headings).toHaveText(cues.map((cue) => cue.translations.ko));
  });
}
