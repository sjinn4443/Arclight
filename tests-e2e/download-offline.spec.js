import { test, expect } from "@playwright/test";

const toolVideos = [
  ["howToUseArclightVideoPage", /USAID.*220p\.mp4$/],
  ["phoneAttachmentVideoPage", /Arclight\/PhoneAttach\.mp4$/],
  ["directOphthalmoscopyFullAnimationVideoPage", /DOFullAnim_220p\.mp4$/],
  ["binocularIndirectOphthalmoscopyVideoPage", /BIOvideo_220p\.mp4$/],
  [
    "binocularIndirectOphthalmoscopyFullAnimationVideoPage",
    /BIOFullAnim_220p\.mp4$/,
  ],
];

test.beforeEach(async ({ browserName }) => {
  test.skip(
    browserName === "webkit" && process.platform === "win32",
    "Windows WebKit offline emulation rejects cached fetches/navigation. Run this project on macOS WebKit or verify a physical iOS/iPadOS installed app.",
  );
});

test("Tools and Kits low download stores every lesson for offline playback and seeking", async ({
  page,
  context,
}, testInfo) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    sessionStorage.setItem("arclight:account:nudge-dismissed", "1");
  });
  await page.goto("/#/eyes");
  await expect
    .poll(
      () => page.evaluate(() => Boolean(navigator.serviceWorker?.controller)),
      { timeout: 120_000 },
    )
    .toBe(true);
  await expect(page.locator("#eyesCatalogPage")).toBeVisible();
  await page.locator("#eyesCatalogPage .menuBtn").click();
  await page.locator("#startDownloadBtn").click();
  const modal = page.locator("#downloadAppModal");
  await expect(modal).toBeVisible();
  await modal.locator('input[value="select"]').check();
  await modal.locator('[data-download-group="core"] summary').click();
  await modal.locator('input[value="tools"]').check();
  await modal.locator("#offlineVideoQualitySelect").selectOption("low");
  await modal.locator("#downloadAllBtn").click();
  await expect(modal.locator("#downloadAppTitle")).toHaveText(
    "Download complete. Content is ready offline.",
    { timeout: 180_000 },
  );
  const stored = await page.evaluate(async () => {
    const cache = await caches.open("arclight-packs-v1");
    return (await cache.keys()).map((r) => decodeURI(new URL(r.url).pathname));
  });
  for (const [, file] of toolVideos)
    expect(
      stored.some((url) => file.test(url)),
      String(file),
    ).toBe(true);
  // Videos with only one shipped resolution remain available in either mode.
  expect(
    stored.some((url) =>
      /(?:DOFullAnim|BIOFullAnim|BIOvideo)_720p\.mp4$/.test(url),
    ),
  ).toBe(false);
  await testInfo.attach("downloaded-files", {
    body: JSON.stringify(stored, null, 2),
    contentType: "application/json",
  });

  // Close the online client, then start a fresh client with networking off.
  await context.setOffline(true);
  await page.close();
  const offline = await context.newPage();
  await offline.goto("/#/videos/arclightPage");
  await expect(offline.locator("#arclightPage")).toBeVisible();
  for (const [id] of toolVideos) {
    // Saved online mode must not strand the player on a YouTube iframe offline.
    await offline.evaluate(
      (id) => localStorage.setItem(`videoMode:${id}`, "online"),
      id,
    );
    await offline.goto(`/#/videos/${id}`);
    const lesson = offline.locator(`#${id}`);
    await expect(lesson).toBeVisible();
    const video = lesson.locator("video").first();
    await expect(video).toBeVisible();
    await expect(video.locator("source")).toHaveAttribute("src", /\.mp4$/);
    // These players use preload=none. Playback itself starts the media load.
    await expect(async () => {
      await video.evaluate((v) => {
        v.muted = true;
        return v.play();
      });
    }).toPass({ timeout: 15_000 });
    await expect
      .poll(() => video.evaluate((v) => v.currentTime))
      .toBeGreaterThan(0.3);
    await video.evaluate((v) => {
      v.pause();
      v.currentTime = Math.min(5, v.duration / 2);
    });
    await expect
      .poll(() => video.evaluate((v) => !v.seeking && v.readyState >= 2))
      .toBe(true);
    expect(await video.evaluate((v) => v.error?.message || null)).toBe(null);
    // Close the mobile player's fullscreen view before navigating to a lesson.
    await video.evaluate(async (v) => {
      v.pause();
      if (document.fullscreenElement) await document.exitFullscreen();
      if (v.webkitDisplayingFullscreen) v.webkitExitFullscreen();
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
    });
  }
});

test("real worker reports a failed file, resumes and serves 240p video ranges offline", async ({
  page,
  context,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
  await page.goto("/#/eyes");
  await expect
    .poll(
      () => page.evaluate(() => Boolean(navigator.serviceWorker?.controller)),
      { timeout: 120_000 },
    )
    .toBe(true);
  const media = "/videos/FullAnim/MakeEyePadShieldFullAnim_240p.mp4";
  const cache = (urls) =>
    page.evaluate(
      (urls) =>
        new Promise((resolve) => {
          const channel = new MessageChannel();
          channel.port1.onmessage = ({ data }) => {
            if (["CACHE_DONE", "CACHE_ERROR"].includes(data.type)) {
              channel.port1.close();
              resolve(data);
            }
          };
          navigator.serviceWorker.controller.postMessage(
            { type: "CACHE_URLS", payload: urls },
            [channel.port2],
          );
        }),
      urls,
    );
  const failed = await cache([media, "/missing-offline-test.mp4"]);
  expect(failed).toMatchObject({ type: "CACHE_DONE", cached: 1, total: 2 });
  expect(failed.failed).toHaveLength(1);
  const resumed = await cache([media]);
  expect(resumed).toMatchObject({
    type: "CACHE_DONE",
    cached: 1,
    total: 1,
    failed: [],
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("#eyesCatalogPage")).toBeVisible();
  const high = media.replace("_240p", "_720p");
  const range = await page.evaluate(async (url) => {
    const r = await fetch(url, { headers: { Range: "bytes=0-63" } });
    return {
      status: r.status,
      length: (await r.arrayBuffer()).byteLength,
      contentRange: r.headers.get("Content-Range"),
    };
  }, high);
  expect(range.status).toBe(206);
  expect(range.length).toBe(64);
  expect(range.contentRange).toMatch(/^bytes 0-63\//);
  await page.evaluate((url) => {
    const v = document.createElement("video");
    v.id = "offline-240p-proof";
    v.src = url;
    v.muted = true;
    v.playsInline = true;
    document.body.prepend(v);
  }, high);
  const video = page.locator("#offline-240p-proof");
  await video.evaluate((v) => v.play());
  await expect
    .poll(() => video.evaluate((v) => v.currentTime))
    .toBeGreaterThan(0.3);
  expect(await video.evaluate((v) => v.videoHeight)).toBe(240);
});
