import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    localStorage.setItem("videoNarration:applyEyePadShieldScrollPage", "off");
    localStorage.setItem("videoNarration:makeEyePadShieldScrollPage", "off");
  });
});

test("Make and Apply contain the correct lessons, expand in place and restore focus", async ({
  page,
}, testInfo) => {
  await page.goto("/#/eyePadShield");
  const root = page.locator("#eyePadShield");
  await expect(root.locator(".lesson-row--folder .lesson-type")).toHaveText([
    "Make",
    "Apply",
  ]);
  await expect(
    root.locator('[data-nested-section="make"] .lesson-row'),
  ).toHaveCount(3);
  await expect(
    root.locator('[data-nested-section="apply"] .lesson-row'),
  ).toHaveCount(2);
  await expect(root.locator('[data-nested-section="make"]')).toBeHidden();
  await expect(root.locator('[data-nested-section="apply"]')).toBeHidden();
  for (const [key, titles] of [
    [
      "make",
      [
        "Make an Eye Pad and Eye Shield",
        "Make an Eye Pad and Eye Shield",
        "Full animation",
      ],
    ],
    [
      "apply",
      ["Apply an Eye Pad and Eye Shield", "Apply an Eye Pad and Eye Shield"],
    ],
  ]) {
    const folder = root.locator(`[data-nested-folder="${key}"]`);
    const panel = root.locator(`[data-nested-section="${key}"]`);
    await folder.press("Enter");
    await expect(folder).toHaveAttribute("aria-expanded", "true");
    await expect(folder).toBeHidden();
    await expect(panel).toBeVisible();
    await expect(panel.locator(".lesson-type")).toHaveText(titles);
    const heading = await panel.locator("h2").boundingBox();
    const close = panel.locator(".see-all-toggle");
    const closeBounds = await close.boundingBox();
    expect(closeBounds.y).toBeGreaterThanOrEqual(heading.y);
    expect(closeBounds.y + closeBounds.height).toBeLessThanOrEqual(
      heading.y + heading.height + 1,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`${key}-folder.png`) });
    await close.press("Enter");
    await expect(panel).toBeHidden();
    await expect(folder).toHaveAttribute("aria-expanded", "false");
    await expect(folder).toBeFocused();
  }
});

for (const [folder, target] of [
  ["make", "eyeCareVideo-make_eye_pad"],
  ["make", "makeEyePadShieldScrollPage"],
  ["make", "makeEyePadShieldFullAnimationVideoPage"],
  ["apply", "eyeCareVideo-apply_eye_pad"],
  ["apply", "applyEyePadShieldScrollPage"],
]) {
  test(`${target}: direct entry returns to its open folder`, async ({
    page,
  }) => {
    await page.goto(`/#/eyePadShield/${target}`);
    await expect(page.locator(`#${target}`)).toBeVisible();
    if (target.startsWith("eyeCareVideo-")) {
      await expect(
        page.locator(`#${target} .pec-procedure-video-title`),
      ).toHaveText(
        folder === "make"
          ? "Make an Eye Pad and Eye Shield"
          : "Apply an Eye Pad and Eye Shield",
      );
    }
    await page.locator("#backBtnGlobal").click();
    const panel = page.locator(
      `#eyePadShield [data-nested-section="${folder}"]`,
    );
    await expect(panel).toBeVisible();
    await page.reload();
    await expect(panel).toBeVisible();
    await panel.locator(".see-all-toggle").click();
    await page.reload();
    await expect(panel).toBeHidden();
  });
}
