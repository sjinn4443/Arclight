/** @jest-environment jsdom */
import { afterEach, beforeEach, expect, it, jest } from "@jest/globals";
const NativeURL = globalThis.URL;
let parsed;
beforeEach(() => {
  jest.resetModules();
  global.fetch = jest.fn(async () => ({ ok: false }));
  parsed = 0;
  globalThis.URL = class extends NativeURL {
    constructor(...args) {
      super(...args);
      parsed += 1;
    }
  };
});
afterEach(() => {
  globalThis.URL = NativeURL;
  delete globalThis.ArclightVideoQuality;
});
it("reuses normalized asset paths across repeated catalogue checks", async () => {
  const app = await import("../public/js/languageinstall.js");
  const url = "/videos/Core/Pupils/pupil_220p.mp4";
  expect(app.matchesOfflineCatalog(url, "core-pupils")).toBe(true);
  const warm = parsed;
  for (let index = 0; index < 100; index++)
    expect(app.matchesOfflineCatalog(url, "core-pupils")).toBe(true);
  expect(parsed).toBe(warm);
});
it("preserves quality aliases, query handling and mutable URL inputs", async () => {
  await import("../public/video-localization/video-quality.js");
  const quality = globalThis.ArclightVideoQuality;
  const [first, second] = quality.pairs;
  const url = first.low + "?cache=1#preview";
  expect(quality.pair(url)).toBe(first);
  const warm = parsed;
  for (let index = 0; index < 100; index++)
    expect(quality.pair(url)).toBe(first);
  expect(parsed).toBe(warm);
  const mutable = new NativeURL(first.low, "https://arclight.invalid");
  expect(quality.pair(mutable)).toBe(first);
  mutable.pathname = second.low;
  expect(quality.pair(mutable)).toBe(second);
});

it("warms inventory without building the unopened download catalogue", async () => {
  jest.useFakeTimers();
  const visibility = Object.getOwnPropertyDescriptor(
    document,
    "visibilityState",
  );
  const caches = globalThis.caches;
  try {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
    globalThis.caches = { keys: jest.fn(async () => []) };
    const app = await import("../public/js/downloadedContents.js");
    app.initializeOfflineContentsBackground();
    await jest.advanceTimersByTimeAsync(1000);
    expect(globalThis.caches.keys).toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    // An explicit request enables background retries even if its first fetch fails.
    await app.refreshDownloadedContents().catch(() => {});
    global.fetch.mockClear();
    await jest.advanceTimersByTimeAsync(60000);
    expect(global.fetch).toHaveBeenCalled();
  } finally {
    if (visibility)
      Object.defineProperty(document, "visibilityState", visibility);
    else delete document.visibilityState;
    globalThis.caches = caches;
    jest.clearAllTimers();
    jest.useRealTimers();
  }
});
