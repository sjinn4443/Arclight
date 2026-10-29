/** @jest-environment jsdom */
import { jest, beforeEach, afterEach, test, expect } from "@jest/globals";
import fs from "node:fs";
let offline;
beforeEach(async () => {
  jest.resetModules();
  delete window.__arclightConnectivity;
  document.body.innerHTML = "";
  Object.defineProperty(navigator, "onLine", {
    configurable: true,
    value: true,
  });
  offline = await import("../public/js/offlineExperience.js");
});
afterEach(() => {
  delete window.caches;
  jest.restoreAllMocks();
});
test("low-only storage disables unavailable high/online and reconnect restores controls", async () => {
  document.body.innerHTML =
    '<section id="lesson"><div class="video-page-actions"><div class="tri-toggle"><button data-mode="low"></button><button data-mode="high"></button><button data-mode="online"></button></div></div></section>';
  const page = document.getElementById("lesson");
  Object.defineProperty(navigator, "onLine", {
    configurable: true,
    value: false,
  });
  window.caches = {
    keys: async () => ["arclight-packs-v1"],
    open: async () => ({
      match: async (url) =>
        url.endsWith("/low.mp4")
          ? { status: 200, headers: { get: () => "video/mp4" } }
          : undefined,
    }),
  };
  expect(
    await offline.updateOfflineVideoControls(page, {
      low: "/low.mp4",
      high: "/high.mp4",
    }),
  ).toEqual({ offline: true, low: true, high: false });
  expect(page.querySelector('[data-mode="high"]').disabled).toBe(true);
  expect(page.querySelector('[data-mode="low"]').disabled).toBe(false);
  expect(page.querySelector(".video-offline-note").textContent).toContain(
    "High resolution",
  );
  expect(page.querySelector(".video-page-actions").nextElementSibling).toBe(
    page.querySelector(".video-offline-note"),
  );
  expect(
    page.querySelector(".video-offline-note").textContent.length,
  ).toBeLessThan(65);
  Object.defineProperty(navigator, "onLine", {
    configurable: true,
    value: true,
  });
  await offline.updateOfflineVideoControls(page, {
    low: "/low.mp4",
    high: "/high.mp4",
  });
  expect(page.querySelector('[data-mode="high"]').disabled).toBe(false);
  expect(page.querySelector(".video-offline-note").hidden).toBe(true);
});
test("media feedback shows loading and a visible offline failure instead of a blank player", () => {
  document.body.innerHTML = "<section><video></video></section>";
  const page = document.querySelector("section"),
    video = page.querySelector("video");
  offline.wireVideoFeedback(page);
  video.dispatchEvent(new Event("loadstart"));
  expect(page.querySelector("[role=status]").hidden).toBe(false);
  video.dispatchEvent(new Event("loadedmetadata"));
  expect(page.querySelector("[role=status]").hidden).toBe(true);
  video.dispatchEvent(new Event("error"));
  expect(page.querySelector("[role=status]").textContent).toContain(
    "download this video",
  );
  expect(video.playsInline).toBe(true);
});
test.each([
  "public/videos/Arclight/PhoneAttach.mp4",
  "public/videos/Tools/MobilePhoneAttachment_720p.mp4",
])("%s is H.264 with metadata before video data", (file) => {
  const bytes = fs.readFileSync(file);
  expect(bytes.indexOf("avc1")).toBeGreaterThan(0);
  expect(bytes.indexOf("hev1")).toBe(-1);
  expect(bytes.indexOf("moov")).toBeLessThan(bytes.indexOf("mdat"));
});
