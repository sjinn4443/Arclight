import { expect, test } from "@playwright/test";

const topic = "diabeticRetinopathyPage";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    if (!localStorage.getItem("prefLang"))
      localStorage.setItem("prefLang", "en");
    sessionStorage.setItem("arclight:account:nudge-dismissed", "1");
    window.__ARCLIGHT_E2E__ = { fundalPlaybackRate: 16 };
  });
});

test("Conditions activates its own topic while Workshops retains its curriculum", async ({
  page,
}) => {
  await page.goto("/#eyes");
  const card = page.locator(
    '#diseaseCarousel [data-label="Diabetic Retinopathy"]',
  );
  await expect(card).not.toHaveClass(/is-disabled/);
  await expect(card.locator(".coming-tag")).toHaveCount(0);
  await expect(
    page.locator('#pecCarousel [data-label="Diabetic Retinopathy"]'),
  ).toHaveAttribute("data-target", "diabeticRetinopathyWorkshop");
  await card.locator(".eyes-card__open").click();
  await expect(page.locator(`#${topic}`)).toBeVisible();
  await expect(page.locator(`#${topic} .pupil-level`)).toHaveCount(3);
  await expect(page.locator(`#${topic} .lesson-row`)).toHaveCount(22);
  expect(
    await page
      .locator(`#${topic}`)
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  await page.screenshot({
    path: test.info().outputPath("condition.png"),
    fullPage: true,
  });
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator("#eyesCatalogPage")).toBeVisible();
});

for (const [target, route] of [
  ["diabeticWhatIsRetinopathyPage", "diabeticRetinopathyWorkshop"],
  ["diabeticProtocolOverviewPage", "diabeticRetinopathyWorkshop"],
  ["diabeticCausesOfVisionLossVideoPage", "videos"],
  ["diabeticObservationFundalReflexPage", "diabeticObservationFundalReflex"],
  ["directOphthalmoscopyPdfPage", "directOphthalmoscopyPdf"],
  ["diabeticCaseQuizPage", "videos"],
]) {
  test(`${target} returns to Conditions after reload`, async ({ page }) => {
    await page.goto(`/#/videos/${topic}`);
    const row = page.locator(`#${topic} [data-target="${target}"]`);
    await expect(row).toBeVisible();
    await expect(page.locator(`#${topic}`)).not.toHaveAttribute("inert");
    await row.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(`#${target}`)).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`${route}/${target}$`));
    await expect(page.locator(".diabetic-next-wrap:visible")).toHaveCount(0);
    await page.reload();
    await expect(page.locator(`#${target}`)).toBeVisible();
    await page.locator("#backBtnGlobal").click();
    await expect(page.locator(`#${topic}`)).toBeVisible();
    await page.locator("#backBtnGlobal").click();
    await expect(page.locator("#eyesCatalogPage")).toBeVisible();
  });
}

test("shared progress and Korean labels survive returning to Conditions", async ({
  page,
}) => {
  await page.goto(`/#/videos/${topic}`);
  await page.evaluate(() => {
    localStorage.setItem("prefLang", "ko");
    localStorage.setItem(
      "diabeticWorkshop:progress:diabeticWhatIsRetinopathyPage",
      JSON.stringify({ percent: 100, updatedAt: Date.now() }),
    );
  });
  await page.reload();
  const row = page.locator(
    `#${topic} [data-target="diabeticWhatIsRetinopathyPage"]`,
  );
  await expect(row.locator(".lesson-type")).toHaveText("당뇨망막병증이란?");
  await expect(row.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
});

test("workshop keeps its own Back and Previous/Next after a condition visit", async ({
  page,
}) => {
  await page.goto(`/#/videos/${topic}`);
  await page
    .locator(`#${topic} [data-target="diabeticWhatIsRetinopathyPage"]`)
    .click();
  await expect(page.locator("#diabeticWhatIsRetinopathyPage")).toBeVisible();
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator(`#${topic}`)).toBeVisible();
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator("#eyesCatalogPage")).toBeVisible();
  await page
    .locator(
      '#pecCarousel [data-target="diabeticRetinopathyWorkshop"] .eyes-card__open',
    )
    .click();
  await page.locator('[data-folder="whatIsDiabetes"]').click();
  await page
    .locator(
      '[data-section="whatIsDiabetes"] [data-target="diabeticWhatIsRetinopathyPage"]',
    )
    .click();
  await expect(
    page.locator("#diabeticWhatIsRetinopathyPage .diabetic-next-wrap"),
  ).toBeVisible();
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator("#diabeticRetinopathyWorkshopPage")).toBeVisible();
});
