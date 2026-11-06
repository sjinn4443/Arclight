/** @jest-environment jsdom */
import { beforeEach, test, expect, jest } from "@jest/globals";
import fs from "node:fs";
import path from "node:path";
import { CATARACT_SCROLL_CONFIG as cfg } from "../public/js/cataractScroll.js";
const assets = [];
function walk(folder) {
  for (const item of fs.readdirSync(`public${folder}`, {
    withFileTypes: true,
  })) {
    const url = path.posix.join(folder, item.name);
    if (item.isDirectory()) walk(url);
    else if (!url.endsWith(".md"))
      assets.push({ url, bytes: fs.statSync(`public${url}`).size });
  }
}
walk("/scrolly/conditions/cataract");
walk("/narration/cataract/full-animation");
let downloads;
beforeEach(async () => {
  jest.resetModules();
  localStorage.clear();
  window.I18N = { getLanguage: () => "en", translateLiteral: (t) => t };
  await jest.isolateModulesAsync(async () => {
    downloads = await import("../public/js/languageinstall.js");
  });
});
test.each([
  ["en", "en"],
  ["ko", "ko"],
  ["fr", "en"],
])(
  "Cataract download keeps all artwork and %s voice with fallback",
  (language, voice) => {
    const selection = downloads.resolveOfflineDownloadSelection(
      { assets, urls: assets.map((a) => a.url) },
      {
        language,
        mode: "select",
        catalogId: "condition-cataract",
        videoQuality: "low",
      },
    );
    for (const file of cfg.paths) {
      expect(selection.urls).toContain(file);
      const scene = JSON.parse(fs.readFileSync(`public${file}`));
      for (const a of scene.assets)
        expect(selection.urls).toContain(
          path.posix.normalize(`${path.posix.dirname(file)}/${a.u}${a.p}`),
        );
    }
    for (const extension of ["m4a", "vtt"])
      expect(selection.urls).toContain(
        `/narration/cataract/full-animation/${voice}.${extension}`,
      );
    expect(selection.urls).toContain(
      "/narration/cataract/full-animation/script.json",
    );
    expect(selection.urls).not.toContain(
      `/narration/cataract/full-animation/${voice === "en" ? "ko" : "en"}.m4a`,
    );
  },
);
