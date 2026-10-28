import { test, expect } from "@playwright/test";
import process from "node:process";
import http from "node:http";
import https from "node:https";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

async function startOfflineGateway(upstream) {
  let online = true;
  const server = http.createServer((request, response) => {
    if (!online) {
      response.destroy();
      return;
    }
    const target = new URL(request.url, upstream);
    const transport = target.protocol === "https:" ? https : http;
    const forwarded = transport.request(
      target,
      {
        method: request.method,
        headers: { ...request.headers, host: target.host },
      },
      (incoming) => {
        response.writeHead(incoming.statusCode, incoming.headers);
        incoming.pipe(response);
      },
    );
    forwarded.on("error", () => response.destroy());
    request.pipe(forwarded);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return {
    origin: `http://127.0.0.1:${server.address().port}`,
    disconnect: () => {
      online = false;
      server.closeAllConnections();
    },
    close: () =>
      new Promise((resolve) => {
        server.closeAllConnections();
        server.close(resolve);
      }),
  };
}

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

test("Tools and Kits low download stores every lesson for offline playback and seeking", async ({
  playwright,
  browserName,
}, testInfo) => {
  test.skip(
    browserName === "webkit" && process.platform === "win32",
    "This Windows WebKit runtime cannot reliably install/read persistent CacheStorage. Run the process restart test on macOS WebKit or physical iOS/iPadOS.",
  );
  // This stores the complete pack (over 1,000 files) on real browser storage.
  test.setTimeout(600_000);
  // Persist the actual browser profile across process restarts. A new tab in
  // the original context cannot detect a registration lost during startup.
  // Chromium's on-disk CacheStorage can fail on long Windows test paths.
  const profileRoot = path.resolve(
    process.env.PLAYWRIGHT_PROFILE_ROOT || os.tmpdir(),
  );
  const profile = await mkdtemp(path.join(profileRoot, "arc-pwa-"));
  if (
    path.dirname(profile) !== profileRoot ||
    !path.basename(profile).startsWith("arc-pwa-")
  )
    throw new Error("Unexpected browser profile path");
  const use = testInfo.project.use;
  // Cut the real server connection instead of using WebKit's broken Windows
  // offline flag. This also reproduces iOS reporting onLine with no connection.
  const gateway = await startOfflineGateway(use.baseURL);
  const options = {
    baseURL: gateway.origin,
    viewport: use.viewport,
    userAgent: use.userAgent,
    deviceScaleFactor: use.deviceScaleFactor,
    isMobile: use.isMobile,
    hasTouch: use.hasTouch,
    serviceWorkers: "allow",
  };
  let context;
  try {
    context = await playwright[browserName].launchPersistentContext(
      profile,
      options,
    );
    const page = await context.newPage();
    const startupErrors = [];
    page.on("console", (message) => {
      if (["warning", "error"].includes(message.type()))
        startupErrors.push(message.text());
    });
    page.on("pageerror", (error) => startupErrors.push(error.message));
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
      .toBe(true)
      .catch((error) => {
        throw new Error(`${error.message}\n${startupErrors.join("\n")}`);
      });
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
      { timeout: 480_000 },
    );
    const stored = await page.evaluate(async () => {
      const cache = await caches.open("arclight-packs-v1");
      return (await cache.keys()).map((r) =>
        decodeURI(new URL(r.url).pathname),
      );
    });
    await testInfo.attach("downloaded-files", {
      body: JSON.stringify(stored, null, 2),
      contentType: "application/json",
    });
    const manifestUrls = await page.evaluate(
      async () => (await (await fetch("/api/app/offline-assets")).json()).urls,
    );
    const downloadedVideos = toolVideos.map(([, pattern]) => {
      const url = manifestUrls.find((url) => pattern.test(decodeURI(url)));
      expect(url, String(pattern)).toBeTruthy();
      return url;
    });

    // Close the entire browser, then launch the stored profile with networking
    // disabled from the beginning, as when reopening an installed app.
    gateway.disconnect();
    // Probe through the worker itself. A window cache inventory alone does not
    // establish whether a Safari media request can actually read these bytes.
    for (const url of downloadedVideos) {
      expect(
        await page.evaluate(async (url) => {
          const response = await fetch(url, {
            headers: { Range: "bytes=0-63" },
          });
          return {
            status: response.status,
            bytes: (await response.arrayBuffer()).byteLength,
          };
        }, url),
      ).toEqual({ status: 206, bytes: 64 });
    }
    await context.close();
    context = await playwright[browserName].launchPersistentContext(profile, {
      ...options,
    });
    const offline = await context.newPage();
    await offline.goto("/#/videos/arclightPage");
    await expect(offline.locator("#arclightPage")).toBeVisible();
    expect(
      await offline.evaluate(async () =>
        Boolean(await navigator.serviceWorker.getRegistration()),
      ),
    ).toBe(true);
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
    // Verify another full restart: startup must preserve the registration.
    await context.close();
    context = await playwright[browserName].launchPersistentContext(profile, {
      ...options,
    });
    const reopened = await context.newPage();
    await reopened.goto("/?source=installed#/videos/arclightPage");
    await expect(reopened.locator("#arclightPage")).toBeVisible();
    const image = "/images/icon/eyes/tools/car_arclight.webp";
    expect(
      await reopened.evaluate(async (url) => {
        const response = await fetch(`${url}?offline-restart=2`);
        return response.ok && (await response.blob()).size > 0;
      }, image),
    ).toBe(true);
    expect(
      await reopened.evaluate(async () =>
        Boolean(await navigator.serviceWorker.getRegistration()),
      ),
    ).toBe(true);
  } finally {
    await context?.close();
    await gateway.close();
    await rm(profile, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 200,
    });
  }
});

test("real worker reports a failed file, resumes and serves 240p video ranges offline", async ({
  page,
  context,
  browserName,
}) => {
  test.skip(
    browserName === "webkit" && process.platform === "win32",
    "Windows WebKit offline flag rejects cached responses. Run this test on macOS WebKit or verify physical iOS/iPadOS.",
  );
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
