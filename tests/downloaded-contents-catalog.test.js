/** @jest-environment jsdom */
import { beforeEach, expect, it, jest } from "@jest/globals";

beforeEach(() => {
  jest.resetModules();
  global.fetch = jest.fn(async () => ({ ok: false }));
});

it("keeps all three roots visible and places named Eyes topics directly below Eyes", async () => {
  const app = await import("../public/js/languageinstall.js");
  const { buildDownloadedContentsCatalog } =
    await import("../public/js/downloadedContentsCatalog.js");
  const urls = [
    "/images/learning/history-case.webp",
    "/videos/Core/Pupils/pupil_220p.mp4",
    "/videos/Core/FrontOfEye/lesson_220p.mp4",
    "/videos/Core/FundalReflex/lesson_220p.mp4",
  ];
  const roots = buildDownloadedContentsCatalog(app, urls, new Set());
  expect(roots.map((root) => root.label)).toEqual(["Eyes", "Ears", "Skin"]);
  expect(roots[0].children.map((section) => section.label)).toEqual(
    expect.arrayContaining([
      "History Taking",
      "Pupils",
      "Front of Eye",
      "Fundal Reflex",
    ]),
  );
  expect(roots[0].completed).toBe(0);
  expect(roots[1].total).toBe(0);
  expect(roots[2].total).toBe(0);
});

it("groups Ears by the actual topic and lesson titles and excludes its downloads from Eyes", async () => {
  const app = await import("../public/js/languageinstall.js");
  const { buildDownloadedContentsCatalog } =
    await import("../public/js/downloadedContentsCatalog.js");
  const urls = [
    "/images/learning/Ears/ears/image20.webp",
    "/images/learning/Ears/ears/image8.webp",
    "/images/learning/Ears/ears/image25.webp",
    "/videos/Ears/otoscopy-arclight_220p.mp4",
    "/videos/Ears/otoscopy-arclight_720p.mp4",
  ];
  const metadata = {
    videos: { "otoscopy-arclight": { low: urls[3], high: urls[4] } },
  };
  const cached = new Set([urls[0], urls[3]]);
  const roots = buildDownloadedContentsCatalog(app, urls, cached, metadata);
  const anatomy = roots[1].children.find(
    (child) => child.label === "Ear Health & Anatomy",
  );
  expect(
    anatomy.items.find((item) => item.label === "How We Hear"),
  ).toMatchObject({ started: true, complete: false });
  const otoscopy = roots[1].children.find(
    (child) => child.label === "Otoscopy",
  );
  expect(
    otoscopy.items.find((item) => item.label === "Otoscopy — Arclight"),
  ).toMatchObject({ complete: true });
  expect(roots[0].total).toBe(0);
  expect(roots[2].total).toBe(0);
  expect(new Set(roots[1].items.map((item) => item.key)).size).toBe(
    roots[1].total,
  );
});

it("keeps saved uncategorized Ears and future Skin content discoverable", async () => {
  const app = await import("../public/js/languageinstall.js");
  const { buildDownloadedContentsCatalog } =
    await import("../public/js/downloadedContentsCatalog.js");
  const urls = [
    "/videos/Ears/legacy.mp4",
    "/videos/Skin/lesson.mp4",
    "/subapp/Allan/index.html",
  ];
  const roots = buildDownloadedContentsCatalog(app, urls, new Set(urls));
  expect(roots.map((root) => root.total)).toEqual([0, 1, 2]);
  expect(roots[1].children[0].label).toBe("Ear learning materials");
  expect(roots[2].children[0].items[0].complete).toBe(true);
  expect(roots[2].children[0].label).toBe("Interactive Learning");
});
