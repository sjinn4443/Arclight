import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
});

test("Examination cards open the Tools and Extended lesson pages", async ({
  page,
}) => {
  await page.goto("/#/eyes");
  const catalog = page.locator("#eyesCatalogPage");
  await expect(catalog).toBeVisible();
  await expect(catalog.locator(".catalog-h2")).toHaveCount(4);
  await expect(catalog.locator(".eyes-carousel-divider").first()).toBeVisible();
  await expect(catalog.locator(".catalog-h2").first()).toContainText(
    "Examination",
  );
  await expect(catalog.locator(".catalog-h2").nth(1)).toContainText(
    "Eye Care Procedure",
  );
  await expect(catalog.locator("#procedureCarousel .eyes-card")).toHaveCount(7);
  await expect(
    catalog.locator("#procedureCarousel .eyes-card.is-disabled"),
  ).toHaveCount(7);
  await expect(catalog.locator("#procedureCarousel .coming-tag")).toHaveCount(
    7,
  );
  await expect(
    catalog.locator("#extendedCarousel, #toolsCarousel"),
  ).toHaveCount(0);
  await expect(
    catalog.locator(
      '#procedureCarousel .eyes-card[data-label="Eye Pad / Shield"]',
    ),
  ).toHaveCount(1);
  await expect(
    catalog.locator('#pecCarousel .eyes-card[data-label="PEC"]'),
  ).toHaveCount(1);
  await expect(
    catalog.locator("#coreCarousel .eyes-card").first(),
  ).toHaveAttribute("data-label", "Tools and Kits");
  await expect(
    catalog.locator("#coreCarousel .eyes-card").last(),
  ).toHaveAttribute("data-label", "Extended");

  await catalog
    .locator(
      '#coreCarousel .eyes-card[data-label="Tools and Kits"] .eyes-card__open',
    )
    .click();
  await expect(page.locator("#arclightPage")).toBeVisible();
  await expect(
    page.locator("#arclightPage .pupil-level--intermediate .lesson-row"),
  ).toHaveCount(4);
  const rowGap = async (selector) => {
    const rows = page.locator(selector);
    const first = await rows.nth(0).boundingBox();
    const second = await rows.nth(1).boundingBox();
    return second.y - (first.y + first.height);
  };
  const primaryGap = await rowGap(
    "#arclightPage .pupil-level--primary .lesson-row",
  );
  const intermediateGap = await rowGap(
    "#arclightPage .pupil-level--intermediate .lesson-row",
  );
  expect(Math.abs(primaryGap - intermediateGap)).toBeLessThan(3);

  await page.goto("/#/eyes");
  await catalog
    .locator('#coreCarousel .eyes-card[data-label="Extended"] .eyes-card__open')
    .click();
  const extended = page.locator("#extendedExaminationPage");
  await expect(extended).toBeVisible();
  await expect(extended.locator(".lesson-row--folder")).toHaveCount(4);
  await expect(
    extended.locator(".lesson-row--folder.is-unavailable"),
  ).toHaveCount(3);
  await expect(
    extended.locator(".lesson-row--folder.is-unavailable").first(),
  ).toContainText("(To be added)");
  await extended.locator('.lesson-row--folder[data-folder="squint"]').click();
  await expect(extended.locator("#extendedSquintLessons")).toBeVisible();
  await expect(
    extended.locator("#extendedSquintLessons .lesson-row"),
  ).toHaveCount(4);
  await expect(page.locator("#squintPalsyPage")).toBeHidden();
  const squintHeading = extended.locator("#extendedSquintLessons h3");
  await expect(squintHeading).toHaveCSS("white-space", "nowrap");
  const section = await extended
    .locator("#extendedSquintLessons")
    .boundingBox();
  const heading = await squintHeading.boundingBox();
  const title = await squintHeading.locator("span").boundingBox();
  const close = await squintHeading.locator("button").boundingBox();
  const lesson = await extended
    .locator("#extendedSquintLessons .lesson-row")
    .first()
    .boundingBox();
  expect(heading.width).toBeGreaterThan(section.width * 0.7);
  expect(title.height).toBeLessThan(22);
  expect(close.x + close.width).toBeLessThanOrEqual(
    heading.x + heading.width + 1,
  );
  expect(lesson.width / section.width).toBeGreaterThan(0.75);
  expect(lesson.width / section.width).toBeLessThan(0.85);
});

test("Eyes carousel edge cards activate their edge dots", async ({ page }) => {
  await page.goto("/#/eyes");
  const carousel = page.locator("#coreCarousel");
  const dots = page
    .locator("#coreCarousel")
    .locator("xpath=preceding-sibling::*[1]")
    .locator(".carousel-dots .dot");
  await expect(carousel.locator(".eyes-card")).toHaveCount(9);
  await carousel.evaluate((element) =>
    element.scrollTo({ left: 0, behavior: "instant" }),
  );
  await expect(dots.first()).toHaveClass(/active/);
  await carousel.evaluate((element) =>
    element.scrollTo({ left: element.scrollWidth, behavior: "instant" }),
  );
  await expect(dots.last()).toHaveClass(/active/);
});
