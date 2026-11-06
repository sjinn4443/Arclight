import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/healthz", (route) => route.fulfill({ status: 200 }));
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    localStorage.setItem("arclight:eyes:carousel-guide-seen:v2", "1");
    sessionStorage.setItem("arclight:account:nudge-dismissed", "1");
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
  await expect(catalog.locator(".ears-card--empty")).toHaveCount(0);
  await expect(
    catalog.locator("#earsExamCarousel .eyes-card__title"),
  ).toHaveText([
    "Ear Health & Anatomy",
    "History & Examination",
    "Otoscopy",
    "Tympanic Membrane",
    "Common Ear Conditions",
    "Video Otoscopy & Simulation",
  ]);
  await expect(catalog.locator("#earsHearingCarousel .eyes-card")).toHaveCount(
    4,
  );
  await expect(
    catalog.locator("#earsProceduresCarousel .eyes-card"),
  ).toHaveCount(3);
  await expect(
    catalog.locator("#earsWorkshopsCarousel .eyes-card"),
  ).toHaveCount(3);

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

test("Ears matches Eyes card geometry and its populated carousels scroll", async ({
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

test("topic rows open the source video and preserve time on quality changes", async ({
  page,
}) => {
  await page.goto("/#/earsOtoscopy");
  await expect(
    page.locator('#earsContentPage[data-ear-ready="true"]'),
  ).toBeVisible();
  await expect(page.locator("#earsContentPage .lesson-row")).toHaveCount(5);
  const videoRow = page.locator('[data-target="earsOtoscopyVideo"]');
  await expect(videoRow.locator(".lesson-cta")).toBeVisible();
  expect(
    await videoRow.evaluate((row) => {
      const bounds = row.getBoundingClientRect();
      const cta = row.querySelector(".lesson-cta").getBoundingClientRect();
      return (
        cta.top >= bounds.top &&
        cta.bottom <= bounds.bottom &&
        cta.left >= bounds.left &&
        cta.right <= bounds.right
      );
    }),
  ).toBe(true);
  await videoRow.click();
  const video = page.locator("#earsContentPage video");
  await expect(video).toHaveAttribute("src", /otoscopy-arclight_220p.mp4$/);
  await expect
    .poll(() => video.evaluate((v) => v.readyState))
    .toBeGreaterThanOrEqual(1);
  expect(await video.evaluate((v) => v.duration)).toBeCloseTo(168.29, 0);
  await video.evaluate((v) => {
    v.currentTime = 20;
  });
  await page.getByRole("radio", { name: "high", exact: true }).click();
  await expect(video).toHaveAttribute("src", /otoscopy-arclight_720p.mp4$/);
  await expect
    .poll(() => video.evaluate((v) => v.readyState))
    .toBeGreaterThanOrEqual(1);
  await expect
    .poll(() => video.evaluate((v) => v.currentTime))
    .toBeGreaterThan(19);
  await page.locator("#backBtnGlobal").click();
  await expect(
    page.locator('[data-ear-route="earsOtoscopy"][data-ear-ready="true"]'),
  ).toBeVisible();
  await expect(video).toHaveCount(0);
});

test("procedure guide preserves its complete source range, zoom and page restore", async ({
  page,
}) => {
  await page.goto("/#/earsWashout");
  const image = page.locator(".ear-reader-frame img");
  await expect(image).toHaveAttribute("src", /page-052.webp$/);
  const toolbar = page.locator(".ear-reader-toolbar");
  await expect(toolbar.locator("select option")).toHaveText([
    "Page 52",
    "Page 53",
    "Page 54",
  ]);
  await toolbar.getByRole("button", { name: "Next", exact: true }).click();
  await expect(image).toHaveAttribute("src", /page-053.webp$/);
  await toolbar.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(image).toHaveAttribute("style", /150%/);
  await page.reload();
  await expect(image).toHaveAttribute("src", /page-053.webp$/);
  await page.locator("#backBtnGlobal").click();
  await expect(
    page.locator('[data-ear-route="earsIrrigation"] .lesson-row'),
  ).toHaveCount(1);
});

test("source landmark diagrams load and open an accessible image zoom", async ({
  page,
}) => {
  await page.goto("/#/earsTympanicDetailed");
  const figures = page.locator(".ear-learning-panel img");
  await expect(figures).toHaveCount(6);
  await expect
    .poll(() =>
      figures.first().evaluate((img) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
  await page.locator(".ear-figure-open").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(dialog.locator("img")).toHaveAttribute("style", /150%/);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("reader failures can be retried without losing navigation", async ({
  page,
}) => {
  await page.route("**/data/ears-assets.json", (route) => route.abort());
  await page.goto("/#/earsWhisperTest");
  await expect(page.locator(".ear-load-error")).toBeVisible();
  await page.unroute("**/data/ears-assets.json");
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(page.locator(".ear-reader-frame img")).toHaveAttribute(
    "src",
    /page-106.webp$/,
  );
});

test("Ears offline selection includes source documents and respects 540p high quality", async ({
  page,
}) => {
  await page.goto("/#/ears");
  await expect(
    page.locator("#earsCatalogPage .eyes-card").first(),
  ).toBeVisible();
  const result = await page.evaluate(async () => {
    const { resolveOfflineDownloadSelection, matchesOfflineCatalog } =
      await import("/js/languageinstall.js");
    const urls = [
      "/js/earsContent.js",
      "/data/ears-assets.json",
      "/documents/ears/who-manual.pdf",
      "/images/learning/Ears/documents/who-manual/page-052.webp",
      "/videos/Ears/otoscopy-osce_220p.mp4",
      "/videos/Ears/otoscopy-osce_540p.mp4",
      "/videos/other_720p.mp4",
    ];
    const manifest = { assets: urls.map((url) => ({ url, bytes: 100 })) };
    return {
      matched: matchesOfflineCatalog(urls[2], "ears"),
      low: resolveOfflineDownloadSelection(manifest, {
        mode: "select",
        catalogIds: ["ears"],
        videoQuality: "low",
      }).urls,
      high: resolveOfflineDownloadSelection(manifest, {
        mode: "select",
        catalogIds: ["ears"],
        videoQuality: "high",
      }).urls,
    };
  });
  expect(result.matched).toBe(true);
  expect(result.low).toContain("/documents/ears/who-manual.pdf");
  expect(result.low).toContain("/videos/Ears/otoscopy-osce_220p.mp4");
  expect(result.low).not.toContain("/videos/Ears/otoscopy-osce_540p.mp4");
  expect(result.high).toContain("/videos/Ears/otoscopy-osce_540p.mp4");
  expect(result.high).not.toContain("/videos/Ears/otoscopy-osce_220p.mp4");
  expect(result.high).not.toContain("/videos/other_720p.mp4");
});

test("partial source reading appears in My Learning and reopens the lesson", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("myLearningActiveTab", "inProgress"),
  );
  await page.goto("/#/earsWhoManual");
  await expect
    .poll(() =>
      page
        .locator(".ear-reader-frame img")
        .evaluate((img) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
  await page.goto("/#/mylearning");
  const card = page
    .locator(".ml-progress-card")
    .filter({ has: page.locator("h4", { hasText: "Ears" }) });
  await expect(card).toBeVisible();
  await card.locator(".ml-progress-card__summary").click();
  await card.locator('.ml-progress-item[data-route="earsWhoManual"]').click();
  await expect(page.locator(".ear-content-title")).toHaveText(
    "WHO Training Manual",
  );
});

test("RTL catalog keeps card navigation and horizontal scrolling usable", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("prefLang", "ar"));
  await page.goto("/#/ears");
  const heading = page.locator("#earsExamCarouselHeading");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await heading.locator(".dot").last().click();
  await expect
    .poll(() =>
      page.locator("#earsExamCarousel").evaluate((el) => el.scrollLeft),
    )
    .toBeLessThan(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.locator("#earsExamCarousel .eyes-card__open").last().click();
  await expect(
    page.locator(
      '[data-ear-route="earsVideoSimulation"][data-ear-ready="true"]',
    ),
  ).toBeVisible();
});
