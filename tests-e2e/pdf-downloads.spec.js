import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    sessionStorage.setItem("arclight:account:nudge-dismissed", "1");
    // Exercise the iPhone file-share path without opening the OS share sheet.
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: () => true,
    });
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async ({ files }) => {
        window.sharedPdf = {
          name: files[0].name,
          size: files[0].size,
          type: files[0].type,
        };
        throw new DOMException("Cancelled", "AbortError");
      },
    });
  });
});

test("PDF save and cancellation keep the lesson and Back accessible", async ({
  page,
}) => {
  await page.goto("/#/directOphthalmoscopyPdf");
  const lesson = page.locator("#directOphthalmoscopyPdfPage");
  await expect(lesson).toBeVisible();
  const originalUrl = page.url();
  await lesson.locator("a[download]").click();
  const dialog = page.locator("#pdfDownloadDialog");
  const save = dialog.getByRole("button", { name: "Save PDF", exact: true });
  await expect(save).toBeEnabled();
  await save.click();
  await expect
    .poll(() => page.evaluate(() => window.sharedPdf?.size || 0))
    .toBeGreaterThan(0);
  expect(await page.evaluate(() => window.sharedPdf.type)).toBe(
    "application/pdf",
  );
  expect(page.url()).toBe(originalUrl);
  await dialog.getByRole("button", { name: "Close", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(lesson).toBeVisible();
  await page.locator("#backBtnGlobal").click();
  await expect(lesson).toBeHidden();
});

test("an uncached PDF failure offline can be closed", async ({
  page,
  context,
}) => {
  await page.goto("/#/directOphthalmoscopyPdf");
  const lesson = page.locator("#directOphthalmoscopyPdfPage");
  await expect(lesson).toBeVisible();
  await context.setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event("offline")));
  await page.locator("#offlineAccessNotice button").click();
  const originalUrl = page.url();
  await lesson.locator("a[download]").click();
  const dialog = page.locator("#pdfDownloadDialog");
  await expect(dialog.locator("#pdfDownloadStatus")).toContainText(
    "PDF unavailable",
  );
  await dialog.getByRole("button", { name: "Close", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  expect(page.url()).toBe(originalUrl);
  await expect(lesson).toBeVisible();
});

test("PDF download fallback preserves the app window", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: () => false,
    });
  });
  await page.goto("/#/directOphthalmoscopyPdf");
  const lesson = page.locator("#directOphthalmoscopyPdfPage");
  await expect(lesson).toBeVisible();
  const originalUrl = page.url();
  await lesson.locator("a[download]").click();
  const dialog = page.locator("#pdfDownloadDialog");
  const downloadEvent = page.waitForEvent("download");
  await dialog.getByRole("button", { name: "Save PDF", exact: true }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("DO.pdf");
  expect(await download.failure()).toBeNull();
  expect(page.url()).toBe(originalUrl);
  await dialog.getByRole("button", { name: "Close", exact: true }).click();
  await expect(lesson).toBeVisible();
});
