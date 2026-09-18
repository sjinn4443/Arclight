import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import sharp from "sharp";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
});

test("navigation, examination journeys and viewport evidence", async ({
  page,
}, info) => {
  const journeys = [
    "eyes",
    "videos/frontOfEyeExaminationScrollPage",
    "videos/directOphthalmoscopyScrollPage",
    "videos/binocularIndirectOphthalmoscopyScrollPage",
    "videos/fundalReflexExaminationScrollPage",
  ];
  for (const route of journeys) {
    const pageId = route.split("/").pop();
    await page.goto(`/?quality=${pageId}#/${route}`);
    const content =
      route === "eyes"
        ? page.locator("#eyesCatalogPage")
        : page.locator(`#${pageId}`);
    await expect(content).toBeVisible();
    if (route !== "eyes")
      await expect(
        content.locator("[data-fundal-scroll-narration-language]"),
      ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      )
      .toBe(true);
    const screenshotPath = info.outputPath(`${pageId}.png`);
    const screenshot = await page.screenshot({
      animations: "disabled",
      path: screenshotPath,
    });
    expect(screenshot.readUInt32BE(16)).toBe(page.viewportSize().width);
    expect(screenshot.readUInt32BE(20)).toBe(page.viewportSize().height);
    expect((await sharp(screenshot).stats()).entropy).toBeGreaterThan(0.5);
    await info.attach(pageId, {
      path: screenshotPath,
      contentType: "image/png",
    });
  }
});

test("Arabic, Persian and Urdu switch direction and return to English", async ({
  page,
}) => {
  await page.goto("/#/eyes");
  await page.waitForFunction(() => window.I18N?.setLanguage);
  for (const locale of ["ar", "fa", "ur", "en"]) {
    await page.evaluate(async (lang) => {
      await window.I18N.setLanguage(lang);
    }, locale);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator("html")).toHaveAttribute(
      "dir",
      locale === "en" ? "ltr" : "rtl",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await page
      .locator("#eyesCatalogPage .catalog-h2")
      .first()
      .locator(".dot")
      .nth(2)
      .click();
    await expect(
      page.locator("#coreCarousel .eyes-card").nth(2),
    ).toBeInViewport({ ratio: 0.9 });
  }
});

test("rendered navigation has no serious WCAG violations", async ({
  page,
}, info) => {
  await page.goto("/#/eyes");
  await expect(page.locator("#eyesCatalogPage")).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const reportPath = info.outputPath("accessibility.json");
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
  await info.attach("accessibility", {
    path: reportPath,
    contentType: "application/json",
  });
  expect(
    results.violations
      .filter((v) => ["serious", "critical"].includes(v.impact))
      .map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          message: n.failureSummary,
        })),
      })),
  ).toEqual([]);
});
