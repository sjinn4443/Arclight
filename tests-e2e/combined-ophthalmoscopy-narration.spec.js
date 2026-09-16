import { expect, test } from "@playwright/test";

const guides = [
  ["fundalReflexExaminationScrollPage", "fundal-reflex", 22],
  ["directOphthalmoscopyScrollPage", "direct-ophthalmoscopy", 13],
  [
    "binocularIndirectOphthalmoscopyScrollPage",
    "binocular-indirect-ophthalmoscopy",
    13,
  ],
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__ARCLIGHT_E2E__ = { fundalPlaybackRate: 12 };
    localStorage.setItem("arclight:onboarded", "1");
    if (!localStorage.getItem("prefLang"))
      localStorage.setItem("prefLang", "en");
  });
});

for (const [pageId, folder, count] of guides) {
  test(`${pageId} keeps text and narration in the selected language`, async ({
    page,
  }) => {
    await page.goto(`/#/videos/${pageId}`);
    const guide = page.locator(`#${pageId}`);
    const lines = guide.locator(".childhood-fundal-segment-text__line").first();
    const language = guide.locator("[data-fundal-scroll-narration-language]");
    const audio = guide.locator("[data-fundal-scroll-narration-audio]");
    await expect(guide.locator(".childhood-fundal-prep-stage")).toHaveCount(
      count,
    );
    await expect(lines).toContainText(/hand/i);
    const english = await lines.textContent();

    await language.selectOption("ko");
    await expect(lines).toContainText(/[가-힣]/);
    await expect(audio).toHaveAttribute(
      "src",
      `/narration/${folder}/full-animation/ko.m4a`,
    );
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("prefLang")))
      .toBe("en");

    await page.reload();
    await expect(language).toHaveValue("ko");
    await expect(lines).toContainText(/[가-힣]/);

    await guide.locator("[data-fundal-scroll-narration-toggle]").click();
    await language.selectOption("es-419");
    await expect(lines).not.toContainText(/[가-힣]/);
    await expect(lines).not.toHaveText(english);
    await expect(audio).toHaveAttribute(
      "src",
      `/narration/${folder}/full-animation/es-419.m4a`,
    );
    await language.selectOption("ko");
    await language.selectOption("en");
    await expect(lines).toHaveText(english);

    await page.evaluate(() => {
      localStorage.setItem("prefLang", "ko");
      window.dispatchEvent(new CustomEvent("i18n:languageChanged"));
    });
    await expect(language).toHaveValue("auto");
    await expect(lines).toContainText(/[가-힣]/);
    await expect(audio).toHaveAttribute(
      "src",
      `/narration/${folder}/full-animation/ko.m4a`,
    );
  });
}

test("Ophthalmoscopy opens both three-section guides and returns to the list", async ({
  page,
}) => {
  await page.goto("/#/videos/directOphthalmoscopy");
  for (const [pageId] of guides.slice(1)) {
    // The HTML arrives before the asynchronously imported click handlers.
    await page.waitForFunction(
      () => document.getElementById("videos")?.style.visibility === "visible",
    );
    await page
      .locator(`#directOphthalmoscopy [data-target="${pageId}"]`)
      .click();
    const guide = page.locator(`#${pageId}`);
    await expect(guide).toBeVisible();
    await expect(
      guide.locator(".fundal-reflex-section-divider__title"),
    ).toHaveCount(3);
    await expect(
      guide.locator("[data-fundal-scroll-narration-language]"),
    ).toBeVisible();
    await page.locator("#backBtnGlobal").click();
    await expect(page.locator("#directOphthalmoscopy")).toBeVisible();
    await expect(guide.locator("audio")).toHaveCount(0);
  }
});
