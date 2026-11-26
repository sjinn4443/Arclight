import { test, expect } from "@playwright/test";
import { pages, sections } from "../public/js/directOphthalmoscopyBookData.js";

test("Direct PDF mobile reader preserves the source entry, zoom, focus, bookmark and progress", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    sessionStorage.setItem("arclight:account:nudge-dismissed", "1");
  });
  await page.goto("/#/videos/directOphthalmoscopy");
  const row = page.locator(
    '#directOphthalmoscopy [data-target="directOphthalmoscopyMobilePage"]',
  );
  await expect(row).toBeVisible();
  expect(
    await row.evaluate(
      (el) =>
        el
          .closest("button")
          .previousElementSibling.querySelector("[data-target]").dataset.target,
    ),
  ).toBe("directOphthalmoscopyPdfPage");
  await page.waitForFunction(() => window.__videosGlobalBound);
  await row.click();
  const reader = page.locator("#directOphthalmoscopyMobilePage");
  const previous = reader.locator("[data-book-previous]");
  const next = reader.locator("[data-book-next]");
  await expect(previous).toBeDisabled();
  for (const [i, definition] of pages.entries()) {
    await expect(reader.locator("h1")).toHaveText(definition.title);
    await expect(reader.locator("h2")).toHaveText(sections[definition.section]);
    if (i > 0) {
      const topbar = await reader.locator(".eyes-topbar").boundingBox();
      const chooser = await reader.locator(".foe-book__sections").boundingBox();
      expect(chooser.y).toBeGreaterThanOrEqual(topbar.y + topbar.height);
    }
    for (const button of await reader.locator(".foe-book__image").all()) {
      await expect
        .poll(() =>
          button
            .locator("img")
            .evaluate((img) => img.complete && img.naturalWidth > 0),
        )
        .toBe(true);
      await button.click();
      const dialog = reader.locator("dialog");
      await expect(dialog).toBeVisible();
      await dialog.locator("[data-book-magnify]").click();
      expect(
        await dialog
          .locator(".direct-book-detail")
          .evaluate((el) => el.scrollWidth > el.clientWidth),
      ).toBe(true);
      expect(
        (await dialog.getByRole("button", { name: "Close" }).boundingBox())
          .width,
      ).toBeGreaterThanOrEqual(44);
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(button).toBeFocused();
    }
    expect(
      await reader.evaluate((el) => el.scrollWidth <= window.innerWidth + 1),
    ).toBe(true);
    if (i + 1 < pages.length) await next.click();
  }
  await expect(next).toBeDisabled();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(
          localStorage.getItem("lessonProgress:directOphthalmoscopyMobilePage"),
        ).percent,
    ),
  ).toBe(100);
  await reader.locator(".foe-book__sections button").nth(1).click();
  await page.keyboard.press("ArrowRight");
  await page.reload();
  await expect(reader.locator("h1")).toHaveText("Flight path");
  const size = page.viewportSize();
  if (size) {
    await page.setViewportSize({ width: size.height, height: size.width });
    await reader.locator(".foe-book__image").first().click();
    await reader
      .locator("dialog")
      .getByRole("button", { name: "Close" })
      .click();
    await expect(reader.locator("h1")).toHaveText("Flight path");
  }
  await page.locator("#backBtnGlobal").click();
  await expect(row).toBeVisible();
  await page
    .locator(
      '#directOphthalmoscopy [data-target="directOphthalmoscopyPdfPage"]',
    )
    .click();
  await expect(page).toHaveURL(/#\/directOphthalmoscopyPdf/);
});
