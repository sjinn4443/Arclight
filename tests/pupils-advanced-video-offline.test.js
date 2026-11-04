/** @jest-environment jsdom */
import { beforeEach, test, expect, jest } from "@jest/globals";
import fs from "node:fs";
import path from "node:path";
const assets = [];
const walk = (dir) => {
  for (const e of fs.readdirSync("public" + dir, { withFileTypes: true })) {
    const url = path.posix.join(dir, e.name);
    if (e.isDirectory()) walk(url);
    else assets.push({ url, bytes: fs.statSync("public" + url).size });
  }
};
walk("/narration/pupils-advanced/full-animation");
for (const q of ["240", "720"]) {
  const url = `/videos/FullAnim/PupilsAdvancedFullAnim_${q}p.mp4`;
  assets.push({ url, bytes: fs.statSync("public" + url).size });
}
const manifest = { assets, urls: assets.map((a) => a.url) };
let install;
beforeEach(async () => {
  jest.resetModules();
  localStorage.clear();
  window.I18N = { getLanguage: () => "en", translateLiteral: (t) => t };
  await jest.isolateModulesAsync(async () => {
    install = await import("../public/js/languageinstall.js");
  });
});
test.each([
  ["en", "en"],
  ["ko", "ko"],
  ["fr", "en"],
])(
  "Core Pupils selects %s Advanced video narration with matching quality",
  (language, expected) => {
    for (const quality of ["low", "high"]) {
      const result = install.resolveOfflineDownloadSelection(manifest, {
        language,
        mode: "select",
        catalogId: "core-pupils",
        videoQuality: quality,
      });
      const selected = quality === "low" ? "240" : "720",
        other = quality === "low" ? "720" : "240";
      expect(result.urls).toContain(
        `/videos/FullAnim/PupilsAdvancedFullAnim_${selected}p.mp4`,
      );
      expect(result.urls).not.toContain(
        `/videos/FullAnim/PupilsAdvancedFullAnim_${other}p.mp4`,
      );
      for (const sub of ["", "video/"]) {
        const dir = "/narration/pupils-advanced/full-animation/" + sub;
        for (const ext of ["m4a", "vtt"])
          expect(result.urls).toContain(`${dir}${expected}.${ext}`);
        expect(result.urls).not.toContain(
          `${dir}${expected === "en" ? "ko" : "en"}.m4a`,
        );
      }
    }
  },
);
