import { test, expect } from "@playwright/test";

test("Advanced scroll is a local preview while its PDF remains available", async ({
  page,
  request,
}, testInfo) => {
  const local = testInfo.project.name.startsWith("local-preview");
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    sessionStorage.setItem("arclight:account:nudge-dismissed", "1");
  });
  const html = await (await request.get("/html/videos.html")).text();
  expect(html.includes('id="pupilsAdvancedScrollPage"')).toBe(local);
  for (const asset of [
    "/js/pupilsAdvancedScroll.js",
    "/scrolly/coreexam/pupils-advanced/1/data.json",
    "/narration/pupils-advanced/full-animation/en.m4a",
    "/local-only/pupils-advanced-page.html",
  ]) {
    expect((await request.get(asset)).status(), asset).toBe(local ? 200 : 404);
  }
  await page.goto("/#/videos/pupilsAdvancedScrollPage");
  if (local) {
    const lesson = page.locator("#pupilsAdvancedScrollPage");
    await expect(lesson).toBeVisible();
    await expect(lesson.locator(".childhood-fundal-prep-stage")).toHaveCount(
      15,
    );
    await expect(lesson.locator("canvas, svg").first()).toBeVisible();
  } else {
    await expect(page.locator("#pupilsPage")).toBeVisible();
    await expect(page).toHaveURL(/#\/videos\/pupilsPage$/);
    await expect(page.locator("#pupilsAdvancedScrollPage")).toHaveCount(0);
    await expect(
      page.locator('[data-target="pupilsAdvancedScrollPage"]'),
    ).toHaveCount(0);
  }
  await page.goto("/#/videos/pupilsPage");
  await expect(
    page.locator('#pupilsPage [data-target="pupilsAdvancedPdfPage"]'),
  ).toBeVisible();
});
