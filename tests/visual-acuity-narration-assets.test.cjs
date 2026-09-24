/** @jest-environment node */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { beforeAll, describe, expect, it } from "@jest/globals";
let config, timing, configureExaminationTiming;
beforeAll(async () => {
  ({
    VISUAL_ACUITY_EXAMINATION_SCROLL_CONFIG: config,
    VISUAL_ACUITY_SCROLL_TIMING: timing,
  } = await import("../public/js/visualAcuityExaminationScroll.js"));
  ({ configureExaminationTiming } =
    await import("../public/js/examinationScrollTiming.js"));
});

const root = path.resolve("public/narration/visual-acuity/full-animation");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const script = read(path.join(root, "script.json"));
const manifest = read(path.join(root, "manifest.json"));
const page = read(
  "public/video-localization/childhood-eye-screening.json",
).visualAcuityFullAnimationVideoPage;
const languages = ["en", "es-419", "ko", "ne", "fr", "lg", "ha", "yo", "ig"];

describe("Visual Acuity localized narration", () => {
  it.each(languages)(
    "ships complete %s captions on the existing scene clock",
    (language) => {
      expect(script.languages[language]).toBeDefined();
      expect(script.cues).toHaveLength(24);
      const vtt = fs.readFileSync(path.join(root, `${language}.vtt`), "utf8");
      expect(vtt).toMatch(/^WEBVTT\n/);
      for (const cue of script.cues) {
        expect(cue[language].trim()).not.toBe("");
        expect(vtt).toContain(cue[language]);
        expect(cue.end).toBeGreaterThan(cue.start);
      }
      expect(vtt.match(/-->/g)).toHaveLength(language === "en" ? 24 : 29);
      expect(page.subtitles[language === "es-419" ? "es" : language]).toBe(
        `/narration/visual-acuity/full-animation/${language}.vtt`,
      );
    },
  );

  it("uses the same packaged audio on both pages without dead media links", () => {
    expect(config.narrationTracks).toEqual(page.audioVariants);
    expect([...timing.languages].sort()).toEqual([...languages].sort());
    expect([...timing.languages].sort()).toEqual(
      Object.keys(manifest.tracks).sort(),
    );
    for (const [language, track] of Object.entries(config.narrationTracks)) {
      const bytes = fs.readFileSync(path.join("public", track.src));
      expect(bytes.length).toBeGreaterThan(1000);
      expect(bytes.length).toBeLessThan(2_000_000);
      expect(crypto.createHash("sha256").update(bytes).digest("hex")).toBe(
        manifest.tracks[language].sha256,
      );
    }
  });

  it("loads translated scroll explanations and headings without changing the timeline", async () => {
    const cfg = { ...config };
    const originalFetch = global.fetch;
    global.fetch = async () => ({ ok: true, json: async () => script });
    try {
      configureExaminationTiming(cfg);
      await cfg.loadText();
      expect(cfg.narrationTimeline).toBe(timing.stages);
      for (const language of languages) {
        config.narrationClipsByFile.forEach((clip, index) => {
          const cues = script.cues.filter((cue) =>
            clip.cueIds.includes(cue.id),
          );
          expect(cfg.getSegmentStartTexts(index, language)).toEqual(
            cues.map((cue) => cue[language]),
          );
          expect(cues[0].start).toBe(clip.start);
          expect(cues.at(-1).end).toBe(clip.end);
        });
        config.sections.forEach(({ title }) => {
          const cue = script.videoTitleCues.find(
            (entry) => entry.sourceText === title,
          );
          expect(cue).toBeDefined();
          expect(cfg.getSectionTitle(title, language)).toBe(
            language === "en" ? title : cue.translations[language],
          );
        });
      }
    } finally {
      global.fetch = originalFetch;
    }
  });
});
