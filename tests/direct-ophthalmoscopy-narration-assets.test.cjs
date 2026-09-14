/** @jest-environment node */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import vm from "node:vm";
import { describe, expect, it } from "@jest/globals";

const root = "public/narration/direct-ophthalmoscopy/full-animation";
const script = JSON.parse(
  fs.readFileSync(path.join(root, "script.json"), "utf8"),
);
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "manifest.json"), "utf8"),
);
const catalog = JSON.parse(
  fs.readFileSync(
    "public/video-localization/childhood-eye-screening.json",
    "utf8",
  ),
);
const languages = ["en", "es-419", "ko", "ne", "fr", "lg", "ha", "yo", "ig"];
const stamp = (time) =>
  new Date(Math.round(time * 1000)).toISOString().slice(11, 23);

describe("Direct Ophthalmoscopy multilingual narration", () => {
  it("keeps narration in its own video directory when reconnecting parity locales", () => {
    const writes = new Map();
    vm.runInNewContext(
      fs.readFileSync("scripts/connect-parity-locales.cjs", "utf8"),
      {
        process: {
          argv: ["node", "script", "ne", "fr", "lg", "ha", "yo", "ig"],
        },
        require: (name) =>
          name === "node:path"
            ? path
            : {
                ...fs,
                writeFileSync: (file, contents) =>
                  writes.set(file, JSON.parse(contents)),
              },
      },
    );
    const updated = writes.get(
      "public/video-localization/childhood-eye-screening.json",
    );
    for (const [pageId, directory] of [
      ["fundalReflexFullAnimationVideoPage", "fundal-reflex"],
      ["directOphthalmoscopyFullAnimationVideoPage", "direct-ophthalmoscopy"],
    ]) {
      for (const language of ["ne", "fr", "lg", "ha", "yo", "ig"]) {
        expect(updated[pageId].audioVariants[language].src).toBe(
          `/narration/${directory}/full-animation/${language}.m4a`,
        );
      }
    }
  });
  it("preserves the existing twenty-cue animation timeline", () => {
    expect(script.sourceVideo).toBe("/videos/FullAnim/New_DOFullAnim.mp4");
    expect(script.durationSeconds).toBeCloseTo(183.083333, 5);
    expect(script.cues).toHaveLength(20);
    expect(Object.keys(script.languages).sort()).toEqual([...languages].sort());
    script.cues.forEach((cue, i) => {
      expect(cue.end).toBeGreaterThan(cue.start);
      expect(cue.end).toBeLessThanOrEqual(script.durationSeconds);
      if (i) expect(cue.start).toBeGreaterThanOrEqual(script.cues[i - 1].end);
    });
  });
  it.each(languages)(
    "ships the %s audio, timed translation and catalog entry",
    (language) => {
      const bytes = fs.readFileSync(path.join(root, `${language}.m4a`));
      const vtt = fs
        .readFileSync(path.join(root, `${language}.vtt`), "utf8")
        .replace(/\r\n/g, "\n");
      const track = manifest.tracks[language];
      expect(bytes.length).toBeGreaterThan(10000);
      expect(bytes.length).toBeLessThan(2000000);
      expect(bytes.subarray(4, 8).toString()).toBe("ftyp");
      expect(track.bytes).toBe(bytes.length);
      expect(track.sha256).toBe(
        crypto.createHash("sha256").update(bytes).digest("hex"),
      );
      expect(vtt.match(/-->/g)).toHaveLength(script.cues.length);
      for (const cue of script.cues) {
        expect(cue[language].trim().length).toBeGreaterThan(0);
        if (language !== "en") expect(cue[language]).not.toBe(cue.en);
        expect(vtt).toContain(
          `${cue.id}\n${stamp(cue.start)} --> ${stamp(cue.end)}\n${cue[language]}`,
        );
      }
      const entry = catalog.directOphthalmoscopyFullAnimationVideoPage;
      const subtitleLanguage = language === "es-419" ? "es" : language;
      expect(entry.subtitles[subtitleLanguage]).toBe(
        `/narration/direct-ophthalmoscopy/full-animation/${language}.vtt`,
      );
      expect(entry.audioVariants[language].src).toBe(
        `/narration/direct-ophthalmoscopy/full-animation/${language}.m4a`,
      );
      expect(entry.iosHls.subtitleLanguages).toContain(subtitleLanguage);
    },
  );
});
