import { test, expect } from "@playwright/test";
import process from "node:process";

test("offline notice, unavailable high mode, reconnect and phone video", async ({
  page,
  context,
  browserName,
}, testInfo) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    sessionStorage.setItem("arclight:account:nudge-dismissed", "1");
  });
  await page.goto("/#/videos/phoneAttachmentVideoPage");
  const phone = page.locator("#phoneAttachmentVideo");
  await expect(phone).toBeVisible();
  if (browserName !== "webkit" || process.platform !== "win32") {
    await phone.evaluate((video) => {
      video.muted = true;
      return video.play();
    });
    await expect
      .poll(() => phone.evaluate((video) => video.currentTime))
      .toBeGreaterThan(0.2);
    expect(await phone.evaluate((video) => video.videoHeight)).toBe(240);
  } else {
    testInfo.annotations.push({
      type: "media-limitation",
      description:
        "Windows WebKit does not complete this MP4 playback. This project verifies UI only; recheck playback on physical iOS.",
    });
  }
  await phone.evaluate((video) => video.pause());
  await page.goto("/#/videos/directOphthalmoscopyFullAnimationVideoPage");
  await expect(
    page.locator("#directOphthalmoscopyFullAnimationVideoPage"),
  ).toBeVisible();
  await expect(
    page.locator(
      '#directOphthalmoscopyFullAnimationVideoPage [data-mode="high"]',
    ),
  ).toBeEnabled();
  await context.setOffline(true);
  await page.evaluate(() => {
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: false,
    });
    window.dispatchEvent(new Event("offline"));
  });
  await expect(page.locator("#offlineAccessNotice")).toBeVisible();
  await expect(page.locator("#offlineAccessMessage")).toContainText(
    "only downloaded content",
  );
  await page.locator("#offlineAccessNotice button").click();
  const high = page.locator(
    '#directOphthalmoscopyFullAnimationVideoPage [data-mode="high"]',
  );
  await expect(high).toBeDisabled();
  await expect(
    page.locator(
      "#directOphthalmoscopyFullAnimationVideoPage .video-offline-note",
    ),
  ).toContainText("High resolution");
  await context.setOffline(false);
  await page.evaluate(() => {
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: true,
    });
    window.dispatchEvent(new Event("online"));
  });
  await expect(high).toBeEnabled();
});
