import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    localStorage.setItem("arclight:eyes:carousel-guide-seen:v2", "1");
  });
});

test("Dashboard opens Ears, then PEC workshop, with working Back navigation", async ({
  page,
}) => {
  await page.goto("/#/dashboard");
  await expect(
    page.locator("#unifiedDashboard .module-card").first(),
  ).toBeVisible();
  await page.locator('.category-card[data-category="ears"]').click();
  const catalog = page.locator("#earsCatalogPage");
  await expect(catalog).toBeVisible();
  await expect(page).toHaveURL(/#\/ears$/);
  await expect(catalog.locator(".catalog-h2 > [data-i18n]")).toHaveText([
    "Exam: Extent Ear & Otoscopy",
    "Hearing Assessment",
    "Primary Ear Care Procedures",
    "Workshops",
  ]);
  await expect(catalog.locator(".eyes-carousel")).toHaveCount(4);
  await expect(catalog.locator(".ears-card--empty")).toHaveCount(12);
  await expect(catalog.locator(".ears-card--empty button")).toHaveCount(0);
  for (const card of await catalog.locator(".ears-card--empty").all()) {
    await expect(card).toHaveText("");
  }

  await catalog
    .getByRole("button", { name: "PEC workshop", exact: true })
    .click();
  await expect(page.locator("#primaryEarCareWorkshopPage")).toBeVisible();
  await page.locator("#backBtnGlobal").click();
  await expect(catalog).toBeVisible();
  await page.locator("#backBtnGlobal").click();
  await expect(
    page.locator('.category-card[data-category="ears"]'),
  ).toBeVisible();
});

test("Ears matches Eyes card geometry and its empty carousels scroll", async ({
  page,
}) => {
  const geometry = (selector) =>
    page.locator(selector).evaluate((card) => {
      const rect = card.getBoundingClientRect();
      const style = getComputedStyle(card);
      return {
        width: rect.width,
        height: rect.height,
        radius: style.borderRadius,
      };
    });
  await page.goto("/#/eyes");
  await expect(page.locator("#coreCarousel .eyes-card").first()).toBeVisible();
  const eyes = await geometry("#coreCarousel .eyes-card:first-child");
  await page.goto("/#/ears");
  await expect(
    page.locator("#earsExamCarousel .eyes-card").first(),
  ).toBeVisible();
  const ears = await geometry("#earsExamCarousel .eyes-card:first-child");
  expect(ears.width).toBeCloseTo(eyes.width, 0);
  expect(ears.height).toBeCloseTo(eyes.height, 0);
  expect(ears.radius).toBe(eyes.radius);

  const heading = page.locator("#earsExamCarouselHeading");
  await heading.locator(".dot").last().click();
  await expect(heading.locator(".dot").last()).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect
    .poll(() =>
      page.locator("#earsExamCarousel").evaluate((el) => el.scrollLeft),
    )
    .toBeGreaterThan(0);
  await page.reload();
  await expect(page.locator("#earsCatalogPage")).toBeVisible();
  await page.getByRole("button", { name: "PEC workshop", exact: true }).click();
  await expect(page.locator("#primaryEarCareWorkshopPage")).toBeVisible();
});
