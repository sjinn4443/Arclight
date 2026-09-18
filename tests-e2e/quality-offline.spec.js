import { test, expect } from "@playwright/test";

test("clean install, retry, offline navigation and real narration playback", async ({
  page,
  context,
}) => {
  test.setTimeout(180_000);
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
  await page.goto("/#/eyes");
  await expect
    .poll(
      () => page.evaluate(() => Boolean(navigator.serviceWorker.controller)),
      { timeout: 120_000 },
    )
    .toBe(true);
  const media = "/narration/fundal-reflex/full-animation/en.m4a";
  const video =
    "/videos/Core/FundalReflex/FRT%20Testing%20Tools/FR_Stillimg_220p.mp4";
  const cache = async (urls) =>
    page.evaluate(
      (urls) =>
        new Promise((resolve) => {
          const channel = new MessageChannel();
          channel.port1.onmessage = (event) => {
            if (["CACHE_DONE", "CACHE_ERROR"].includes(event.data.type)) {
              channel.port1.close();
              resolve(event.data);
            }
          };
          navigator.serviceWorker.controller.postMessage(
            { type: "CACHE_URLS", payload: urls },
            [channel.port2],
          );
        }),
      urls,
    );
  const partial = await cache([media, video, "/missing-offline-test.m4a"]);
  expect(partial.cached).toBe(2);
  expect(partial.failed).toHaveLength(1);
  const resumed = await cache([media]);
  expect(resumed.failed).toEqual([]);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("#eyesCatalogPage")).toBeVisible();
  await page.goto("/#/videos/frontOfEyePage");
  await expect(page.locator("#frontOfEyePage")).toBeVisible();
  await expect(
    page.locator(
      '#frontOfEyePage [data-target="frontOfEyeExaminationScrollPage"]',
    ),
  ).toBeVisible();
  const range = await page.evaluate(async (url) => {
    const response = await fetch(url, { headers: { Range: "bytes=0-63" } });
    return {
      status: response.status,
      length: (await response.arrayBuffer()).byteLength,
    };
  }, media);
  expect(range).toEqual({ status: 206, length: 64 });
  await page.evaluate((url) => {
    const audio = document.createElement("audio");
    audio.id = "offline-audio-proof";
    audio.src = url;
    audio.controls = true;
    document.body.prepend(audio);
  }, media);
  await page.locator("#offline-audio-proof").evaluate((audio) => audio.play());
  await expect
    .poll(() =>
      page
        .locator("#offline-audio-proof")
        .evaluate((audio) => audio.currentTime),
    )
    .toBeGreaterThan(0.3);
  await page.evaluate((url) => {
    const player = document.createElement("video");
    player.id = "offline-video-proof";
    player.src = url;
    player.muted = true;
    player.playsInline = true;
    document.body.prepend(player);
  }, video);
  await page
    .locator("#offline-video-proof")
    .evaluate((player) => player.play());
  await expect
    .poll(() =>
      page
        .locator("#offline-video-proof")
        .evaluate((player) => player.currentTime),
    )
    .toBeGreaterThan(0.3);
});
