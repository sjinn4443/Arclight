/** @jest-environment jsdom */
import { beforeEach, test, expect, jest } from "@jest/globals";
import fs from "node:fs";
import path from "node:path";
import { PUPILS_PEC_LANGUAGES } from "../public/js/pupilsPecScroll.js";

const assets = [];
function walk(folder) {
  for (const entry of fs.readdirSync(`public${folder}`, {
    withFileTypes: true,
  })) {
    const url = path.posix.join(folder, entry.name);
    if (entry.isDirectory()) walk(url);
    else assets.push({ url, bytes: fs.statSync(`public${url}`).size });
  }
}
walk("/narration/pupils-pec/full-animation");
for (const quality of ["240", "720"]) {
  const url = `/videos/FullAnim/PupilsPecFullAnim_${quality}p.mp4`;
  assets.push({ url, bytes: fs.statSync(`public${url}`).size });
}
const manifest = { assets, urls: assets.map((a) => a.url) };
let languageInstall;
beforeEach(async () => {
  jest.resetModules();
  localStorage.clear();
  window.I18N = { getLanguage: () => "en", translateLiteral: (text) => text };
  await jest.isolateModulesAsync(async () => {
    languageInstall = await import("../public/js/languageinstall.js");
  });
});
test.each(Object.keys(PUPILS_PEC_LANGUAGES))(
  "Core Pupils downloads %s scroll/video captions and narration with the selected quality",
  (language) => {
    for (const videoQuality of ["low", "high"]) {
      const selection = languageInstall.resolveOfflineDownloadSelection(
        manifest,
        {
          language: language === "es-419" ? "es" : language,
          mode: "select",
          catalogId: "core-pupils",
          videoQuality,
        },
      );
      for (const subfolder of ["", "video/"]) {
        const base = `/narration/pupils-pec/full-animation/${subfolder}`;
        for (const extension of ["m4a", "vtt"])
          expect(selection.urls).toContain(`${base}${language}.${extension}`);
        expect(selection.urls).toContain(`${base}script.json`);
        for (const other of Object.keys(PUPILS_PEC_LANGUAGES).filter(
          (l) => l !== language,
        ))
          expect(selection.urls).not.toContain(`${base}${other}.m4a`);
      }
      const selected = videoQuality === "low" ? "240" : "720";
      const other = videoQuality === "low" ? "720" : "240";
      expect(selection.urls).toContain(
        `/videos/FullAnim/PupilsPecFullAnim_${selected}p.mp4`,
      );
      expect(selection.urls).not.toContain(
        `/videos/FullAnim/PupilsPecFullAnim_${other}p.mp4`,
      );
    }
  },
);
