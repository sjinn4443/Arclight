import { test, expect } from "@playwright/test";
test("published Advanced lesson is available on the server", async ({
  page,
  request,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    sessionStorage.setItem("arclight:account:nudge-dismissed", "1");
  });
  const html = await (await request.get("/html/videos.html")).text();
  expect(html).toContain('id="pupilsAdvancedScrollPage"');
  for (const path of [
    "/scrolly/coreexam/pupils-advanced/1/data.json",
    "/narration/pupils-advanced/full-animation/en.m4a",
  ])
    expect((await request.get(path)).status()).toBe(200);
  await page.goto("/#/videos/pupilsAdvancedScrollPage");
  const lesson = page.locator("#pupilsAdvancedScrollPage");
  await expect(lesson).toBeVisible();
  await expect(lesson.locator(".childhood-fundal-prep-stage")).toHaveCount(15);
  await page.goto("/#/videos/pupilsPage");
  await expect(
    page.locator('#pupilsPage [data-target="pupilsAdvancedScrollPage"]'),
  ).toBeVisible();
});
