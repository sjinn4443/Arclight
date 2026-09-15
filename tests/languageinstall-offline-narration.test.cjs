/**
 * @jest-environment jsdom
 */

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import fs from "node:fs";

describe("language-specific offline narration", () => {
  let languageInstall;

  beforeEach(async () => {
    jest.resetModules();
    localStorage.clear();
    document.documentElement.lang = "en";
    window.I18N = {
      getLanguage: () => localStorage.getItem("prefLang") || "en",
      translateLiteral: (text) => text,
    };

    await jest.isolateModulesAsync(async () => {
      languageInstall = await import("../public/js/languageinstall.js");
    });
  });

  const manifest = {
    assets: [
      { bytes: 800000, url: "/narration/fundal-reflex/full-animation/en.m4a" },
      {
        bytes: 880000,
        url: "/narration/fundal-reflex/full-animation/es-419.m4a",
      },
      { bytes: 890000, url: "/narration/fundal-reflex/full-animation/ko.m4a" },
      { bytes: 4000, url: "/narration/fundal-reflex/full-animation/en.vtt" },
      {
        bytes: 4500,
        url: "/narration/fundal-reflex/full-animation/es-419.vtt",
      },
      { bytes: 3500, url: "/narration/fundal-reflex/full-animation/ko.vtt" },
      {
        bytes: 1300000,
        url: "/videos/FullAnim/FundalReflex_Full Animation_720p.mp4",
      },
      { bytes: 1000, url: "/js/main.js" },
    ],
  };

  it.each(
    [
      "direct-ophthalmoscopy",
      "front-of-eye",
      "binocular-indirect-ophthalmoscopy",
    ].flatMap((lesson) =>
      ["en", "es-419", "ko", "ne", "fr", "lg", "ha", "yo", "ig"].map(
        (language) => [lesson, language],
      ),
    ),
  )(
    "includes only the selected %s %s audio and captions offline",
    (lesson, language) => {
      const root = `public/narration/${lesson}/full-animation`;
      const tracks = JSON.parse(
        fs.readFileSync(`${root}/manifest.json`, "utf8"),
      ).tracks;
      const assets = Object.entries(tracks).flatMap(([code, track]) =>
        [track.src, track.captions].map((file) => ({
          url: `/narration/${lesson}/full-animation/${file}`,
          bytes: fs.statSync(`${root}/${file}`).size,
        })),
      );
      const selection = languageInstall.resolveOfflineDownloadSelection(
        { assets },
        {
          language: language === "es-419" ? "es" : language,
          mode: "full",
          videoQuality: "low",
        },
      );
      expect(
        selection.urls
          .filter((url) => url.includes(`/narration/${lesson}/`))
          .sort(),
      ).toEqual(
        ["m4a", "vtt"]
          .map(
            (ext) => `/narration/${lesson}/full-animation/${language}.${ext}`,
          )
          .sort(),
      );
    },
  );

  it("downloads only the Spanish narration when Spanish is selected", () => {
    const selection = languageInstall.resolveOfflineDownloadSelection(
      manifest,
      {
        language: "es",
        mode: "select",
        catalogId: "core-fundal-reflex",
        videoQuality: "low",
      },
    );

    expect(selection.narrationLanguage).toBe("es-419");
    expect(selection.urls).toContain(
      "/narration/fundal-reflex/full-animation/es-419.m4a",
    );
    expect(selection.urls).toContain(
      "/narration/fundal-reflex/full-animation/es-419.vtt",
    );
    expect(selection.urls).not.toContain(
      "/narration/fundal-reflex/full-animation/en.m4a",
    );
    expect(selection.urls).not.toContain(
      "/narration/fundal-reflex/full-animation/en.vtt",
    );
  });

  it("falls back to English narration for languages without an audio track", () => {
    const selection = languageInstall.resolveOfflineDownloadSelection(
      manifest,
      {
        language: "fr",
        mode: "full",
        videoQuality: "low",
      },
    );

    expect(selection.narrationLanguage).toBe("en");
    expect(selection.urls).toContain(
      "/narration/fundal-reflex/full-animation/en.m4a",
    );
    expect(selection.urls).not.toContain(
      "/narration/fundal-reflex/full-animation/es-419.m4a",
    );
  });

  it.each(["ne", "fr", "lg", "ha", "yo", "ig"])(
    "downloads %s with English fallback for untranslated videos",
    (language) => {
      const added = ["ne", "fr", "lg", "ha", "yo", "ig"].flatMap((code) =>
        ["m4a", "vtt"].map((ext) => ({
          bytes: 1000,
          url: `/narration/fundal-reflex/full-animation/${code}.${ext}`,
        })),
      );
      const englishOnly =
        "/narration/direct-ophthalmoscopy/full-animation/en.m4a";
      const selection = languageInstall.resolveOfflineDownloadSelection(
        {
          assets: [
            ...manifest.assets,
            ...added,
            { bytes: 1000, url: englishOnly },
          ],
        },
        { language, mode: "full", videoQuality: "low" },
      );
      expect(selection.narrationLanguage).toBe(language);
      expect(selection.urls).toContain(
        `/narration/fundal-reflex/full-animation/${language}.m4a`,
      );
      expect(selection.urls).toContain(
        `/narration/fundal-reflex/full-animation/${language}.vtt`,
      );
      expect(selection.urls).toContain(englishOnly);
      expect(selection.urls).not.toContain(
        "/narration/fundal-reflex/full-animation/en.m4a",
      );
    },
  );

  it("downloads the Korean narration when Korean is selected", () => {
    const selection = languageInstall.resolveOfflineDownloadSelection(
      manifest,
      {
        language: "ko",
        mode: "select",
        catalogId: "core-fundal-reflex",
        videoQuality: "low",
      },
    );

    expect(selection.narrationLanguage).toBe("ko");
    expect(selection.urls).toContain(
      "/narration/fundal-reflex/full-animation/ko.m4a",
    );
    expect(selection.urls).not.toContain(
      "/narration/fundal-reflex/full-animation/en.m4a",
    );
    expect(selection.urls).not.toContain(
      "/narration/fundal-reflex/full-animation/es-419.m4a",
    );
  });

  it("keeps all narration assets out of an app-only download", () => {
    const selection = languageInstall.resolveOfflineDownloadSelection(
      manifest,
      {
        language: "es",
        mode: "app-only",
      },
    );

    expect(selection.urls).toEqual(["/js/main.js"]);
  });
});
