/** @jest-environment jsdom */
import { beforeEach, afterEach, expect, it, jest } from "@jest/globals";

beforeEach(() => {
  jest.resetModules();
  document.body.innerHTML = "";
  localStorage.clear();
});
afterEach(() => {
  jest.restoreAllMocks();
  delete window.caches;
});

it("reuses a shared key inventory and refreshes it after a download changes storage", async () => {
  const keys = jest.fn(async () => [
    { url: "http://localhost/videos/A.mp4?rev=1" },
  ]);
  const match = jest.fn();
  window.caches = {
    keys: jest.fn(async () => [
      "arclight-packs-v1",
      "unrelated",
      "arclight-offline-metadata-v1",
    ]),
    open: jest.fn(async () => ({ keys, match })),
  };
  const app = await import("../public/js/offlineDownloadState.js");
  const [one, two] = await Promise.all([
    app.getOfflineInventory(),
    app.getOfflineInventory(),
  ]);
  expect(one).toBe(two);
  expect(one.has("/videos/A.mp4")).toBe(true);
  await app.getOfflineInventory();
  expect(keys).toHaveBeenCalledTimes(1);
  expect(match).not.toHaveBeenCalled();
  app.invalidateOfflineInventory();
  await app.getOfflineInventory();
  expect(keys).toHaveBeenCalledTimes(2);
});

it("counts content bundles instead of individual images, app assets or video resolutions", async () => {
  const app = await import("../public/js/offlineDownloadState.js");
  const urls = [
    "/videos/Core/Pupils/pupil_220p.mp4",
    "/videos/Core/Pupils/pupil_720p.mp4",
    "/subapp/Mires/index.html",
    "/subapp/Mires/main.js",
    "/images/learning/Pupils/1.webp",
    "/images/learning/Pupils/2.webp",
  ];
  const cached = new Set([urls[0], urls[2], urls[4], urls[5]]);
  const summary = app.summarizeOfflineContent(urls, cached);
  expect(summary.total).toBe(3);
  expect(summary.completed).toBe(1);
  expect(app.offlineContentState(summary)).toBe("partial");
  expect(
    app.summarizeOfflineContent(urls, cached, { anyVideoQuality: true })
      .completed,
  ).toBe(2);
  expect(
    app.offlineContentState(app.summarizeOfflineContent(urls, new Set())),
  ).toBe("empty");
  expect(
    app.offlineContentState(app.summarizeOfflineContent(urls, new Set(urls))),
  ).toBe("complete");
});

it("opens downloaded contents from a warmed snapshot with no repeat scan or fetch and loads details on expansion", async () => {
  const urls = [
    "/js/main.js",
    "/videos/Core/Pupils/pupil_220p.mp4",
    "/videos/Core/Pupils/pupil_720p.mp4",
  ];
  global.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => ({
      urls,
      assets: urls.map((url) => ({ url, bytes: 100 })),
    }),
  }));
  const keys = jest.fn(async () => [{ url: `http://localhost${urls[1]}` }]);
  window.caches = {
    keys: async () => ["arclight-packs-v1"],
    open: async () => ({ keys, put: async () => {} }),
  };
  const app = await import("../public/js/downloadedContents.js");
  await app.refreshDownloadedContents();
  const requests = fetch.mock.calls.length;
  await app.showDownloadedContents();
  expect(
    document.querySelector(".downloaded-content-item .content-download-count")
      .textContent,
  ).toBe("1/1");
  const details = document.querySelector("details");
  expect(details.querySelectorAll("li")).toHaveLength(0);
  details.open = true;
  details.dispatchEvent(new Event("toggle"));
  expect(details.textContent).toContain("Downloaded");
  expect(details.querySelectorAll("li")).toHaveLength(1);
  document.querySelector("#downloadedContentsCloseBtn").click();
  await app.showDownloadedContents();
  expect(keys).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledTimes(requests);
});

it("uses saved manifest metadata immediately and falls back to it when offline", async () => {
  const { Response } = await import("node-fetch");
  const originalResponse = global.Response;
  global.Response = Response;
  try {
    const urls = ["/videos/Core/Pupils/pupil_220p.mp4"];
    const saved = JSON.stringify({
      urls,
      assets: [{ url: urls[0], bytes: 100 }],
    });
    const match = jest.fn(async () => new Response(saved));
    window.caches = { open: async () => ({ match, put: async () => {} }) };
    global.fetch = jest.fn(async () => {
      throw new Error("offline");
    });
    const app = await import("../public/js/languageinstall.js");
    fetch.mockClear();
    expect(
      (await app.fetchAllOfflineAssetUrls({ preferCached: true })).urls,
    ).toEqual(urls);
    expect(fetch).not.toHaveBeenCalled();
    expect((await app.fetchAllOfflineAssetUrls()).urls).toEqual(urls);
    expect(fetch).toHaveBeenCalledTimes(1);
  } finally {
    if (originalResponse) global.Response = originalResponse;
    else delete global.Response;
  }
});
