/** @jest-environment jsdom */
import { beforeEach, it, expect, jest } from "@jest/globals";
import fs from "node:fs";
import path from "node:path";

// Enumerate the actual feature's delivered files, without scanning unrelated
// gigabytes of workshop media for every language-selection unit test.
const assets = [];
const walk = (folder) => {
  for (const entry of fs.readdirSync(`public${folder}`, {
    withFileTypes: true,
  })) {
    const url = path.posix.join(folder, entry.name);
    if (entry.isDirectory()) walk(url);
    else if (!url.endsWith(".md"))
      assets.push({ url, bytes: fs.statSync(`public${url}`).size });
  }
};
walk("/scrolly/coreexam/pupils-advanced");
walk("/scrolly/coreexam/pupils-pec");
walk("/narration/pupils-advanced/full-animation");
const manifest = { assets, urls: assets.map((a) => a.url) };

const { PUPILS_ADVANCED_SCROLL_CONFIG: cfg } =
  await import("../public/js/pupilsAdvancedScroll.js");
let languageInstall;
beforeEach(async () => {
  jest.resetModules();
  localStorage.clear();
  window.I18N = { getLanguage: () => "en", translateLiteral: (text) => text };
  await jest.isolateModulesAsync(async () => {
    languageInstall = await import("../public/js/languageinstall.js");
  });
});
it.each([
  ["ko", "ko"],
  ["fr", "en"],
])(
  "Core Pupils offline download includes every Advanced image and %s narration",
  (language, expected) => {
    const selection = languageInstall.resolveOfflineDownloadSelection(
      manifest,
      {
        language,
        mode: "select",
        catalogId: "core-pupils",
        videoQuality: "low",
      },
    );
    for (const file of cfg.paths) {
      const sceneRoot = path.posix.dirname(file) + "/";
      expect(selection.urls).toContain(file);
      expect(selection.urls).toContain(`${sceneRoot}images/img_0.png`);
      const data = JSON.parse(fs.readFileSync(`public${file}`, "utf8"));
      for (const asset of data.assets.filter((a) => a.p))
        expect(selection.urls).toContain(
          path.posix.normalize(`${sceneRoot}${asset.u}${asset.p}`),
        );
    }
    const narration = "/narration/pupils-advanced/full-animation/";
    for (const extension of ["m4a", "vtt"])
      expect(selection.urls).toContain(`${narration}${expected}.${extension}`);
    expect(selection.urls).toContain(`${narration}script.json`);
    expect(selection.urls).not.toContain(
      `${narration}${expected === "en" ? "ko" : "en"}.m4a`,
    );
    expect(manifest.urls.some((url) => url.includes("pdfbasedanims"))).toBe(
      false,
    );
  },
);
