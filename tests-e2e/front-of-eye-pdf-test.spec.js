import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    sessionStorage.setItem("arclight:account:nudge-dismissed", "1");
  });
});

test("experimental PDF reader opens beneath the original and keeps all six pages readable", async ({
  page,
}) => {
  await page.goto("/#/videos/frontOfEyePage");
  const original = page.locator(
    '#frontOfEyePage [data-target="frontOfEyePdfPage"]',
  );
  const launcher = page.locator(
    '#frontOfEyePage [data-target="frontOfEyePdfTestPage"]',
  );
  await expect(launcher).toHaveCount(1);
  await expect(launcher).toBeVisible();
  await expect(
    original.locator("xpath=following-sibling::*[1]"),
  ).toHaveAttribute("data-target", "frontOfEyePdfTestPage");
  await launcher.click();
  const reader = page.locator("#frontOfEyePdfTestPage");
  await expect(reader).toBeVisible();
  await expect(reader.locator(".menuBtn")).toBeInViewport();
  const labelTop = await reader
    .locator(".foe-book__section")
    .evaluate((el) => el.getBoundingClientRect().top);
  const headerBottom = await reader
    .locator(".eyes-topbar")
    .evaluate((el) => el.getBoundingClientRect().bottom);
  expect(labelTop).toBeGreaterThanOrEqual(headerBottom);
  const previous = reader.locator("[data-book-previous]");
  const next = reader.locator("[data-book-next]");
  await expect(previous).toBeDisabled();
  const sectionButtons = reader.locator(".foe-book__sections button");
  await expect(sectionButtons).toHaveCount(3);
  const counts = [3, 2, 12, 2, 3, 4];
  for (let i = 0; i < counts.length; i++) {
    await expect(reader.locator(".foe-book__page-number")).toHaveText(
      `${i + 1} / 6`,
    );
    const images = reader.locator(".foe-book__panels img");
    await expect(images).toHaveCount(counts[i]);
    await expect
      .poll(() =>
        images.evaluateAll((items) =>
          items.every((img) => img.complete && img.naturalWidth > 0),
        ),
      )
      .toBe(true);
    // Each crop must supply enough real PDF pixels for a retina phone screen.
    expect(
      await images.evaluateAll((items) =>
        items.every(
          (img) =>
            img.naturalWidth >=
            Math.ceil(img.clientWidth * Math.min(window.devicePixelRatio, 3)),
        ),
      ),
    ).toBe(true);
    const layout = await reader.evaluate((el) => {
      const images = el.querySelectorAll(".foe-book__panels img");
      const lastImage = images[images.length - 1].getBoundingClientRect();
      const nav = el
        .querySelector(".foe-book__navigation")
        .getBoundingClientRect();
      const container = el.querySelector(".container").getBoundingClientRect();
      return {
        imageBottom: lastImage.bottom,
        navTop: nav.top,
        navBottom: nav.bottom,
        containerBottom: container.bottom,
      };
    });
    expect(layout.navTop).toBeGreaterThanOrEqual(layout.imageBottom);
    expect(layout.navBottom).toBeLessThanOrEqual(layout.containerBottom);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    if (i === 0) {
      const boxes = await images.evaluateAll((items) =>
        items.map((img) => ({
          top: img.getBoundingClientRect().top,
          bottom: img.getBoundingClientRect().bottom,
        })),
      );
      expect(boxes[1].top).toBeGreaterThan(boxes[0].bottom);
      await page.screenshot({
        path: `.codex-artifacts/front-of-eye-book/${test.info().project.name}-page-1.png`,
        fullPage: true,
      });
      await images.first().click();
      await expect(reader.locator("dialog")).toBeVisible();
      await reader.getByRole("button", { name: "Close ×" }).click();
      await expect(reader.locator("dialog")).toBeHidden();
    }
    if (i === 2)
      await page.screenshot({
        path: `.codex-artifacts/front-of-eye-book/${test.info().project.name}-gallery.png`,
        fullPage: true,
      });
    if (i < 5) {
      await next.click();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    }
  }
  await expect(next).toBeDisabled();
  await previous.click();
  await expect(reader.locator(".foe-book__page-number")).toHaveText("5 / 6");
  await page.reload();
  await expect(page.locator(".foe-book__page-number")).toHaveText("5 / 6");
  await page.getByRole("button", { name: "Section 1:", exact: false }).click();
  await expect(page.locator(".foe-book__page-number")).toHaveText("1 / 6");
  await page.getByRole("button", { name: "Section 2:", exact: false }).click();
  await expect(page.locator(".foe-book__page-number")).toHaveText("4 / 6");
  await expect(page.locator("#foeBookSection")).toHaveText(
    "Anterior Chamber Depth",
  );
  await expect(
    page.locator('.foe-book__sections button[aria-current="true"]'),
  ).toHaveText("2");
  await page.getByRole("button", { name: "Section 3:", exact: false }).click();
  await expect(page.locator(".foe-book__page-number")).toHaveText("5 / 6");
  await page.locator("[data-book-previous]").click();
  await expect(page.locator(".foe-book__page-number")).toHaveText("4 / 6");
  await page.locator("#foeBookHeading").press("ArrowLeft");
  await expect(page.locator(".foe-book__page-number")).toHaveText("3 / 6");
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator("#frontOfEyePage")).toBeVisible();
  await original.click();
  await expect(page.locator("#frontOfEyePdfViewer img")).toHaveAttribute(
    "src",
    /rendered\/FrontofEye-1\.png/,
  );
});

test("reader fits a narrow mobile viewport and Back works on a direct link", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/#/frontOfEyePdfTest");
  await expect(page.locator("#foeBookHeading")).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
  const next = page.locator("[data-book-next]");
  await next.scrollIntoViewIfNeeded();
  await expect(next).toBeInViewport();
  await next.click();
  await expect(page.locator(".foe-book__page-number")).toHaveText("2 / 6");
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator("#frontOfEyePage")).toBeVisible();
});
