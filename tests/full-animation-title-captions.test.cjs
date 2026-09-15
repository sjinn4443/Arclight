/** @jest-environment node */
import fs from "node:fs";
import { describe, expect, it } from "@jest/globals";

const languages = ["es-419", "ko", "ne", "fr", "lg", "ha", "yo", "ig"];
const definitions = JSON.parse(
  fs.readFileSync("scripts/full-animation-title-captions.json", "utf8"),
);
const stamp = (time) =>
  new Date(Math.round(time * 1000)).toISOString().slice(11, 23);

describe.each([
  ["front-of-eye", 4],
  ["direct-ophthalmoscopy", 4],
  ["binocular-indirect-ophthalmoscopy", 3],
])("%s silent title captions", (lesson, titleCount) => {
  const root = `public/narration/${lesson}/full-animation/`;
  const script = JSON.parse(fs.readFileSync(root + "script.json", "utf8"));
  it("keeps video-clock titles separate from every spoken cue and English captions", () => {
    expect(script.videoTitleCues).toEqual(definitions[lesson]);
    expect(script.videoTitleCues).toHaveLength(titleCount);
    expect(fs.readFileSync(root + "en.vtt", "utf8")).not.toContain(
      "video-title-",
    );
    script.videoTitleCues.forEach((cue, index) => {
      expect(cue.id).toMatch(/^video-title-/);
      expect(cue.end).toBeGreaterThan(cue.start);
      expect(cue.end).toBeLessThan(script.durationSeconds);
      if (index)
        expect(cue.start).toBeGreaterThan(script.videoTitleCues[index - 1].end);
      expect(Object.keys(cue.translations).sort()).toEqual(
        [...languages].sort(),
      );
      expect(script.cues.some((spoken) => spoken.id === cue.id)).toBe(false);
      for (const spoken of Object.values(script.timedAudioCues || {}).flat()) {
        expect(spoken.id).not.toBe(cue.id);
      }
    });
  });
  it.each(languages)(
    "includes every translated %s title once in WebVTT",
    (language) => {
      const vtt = fs
        .readFileSync(`${root}${language}.vtt`, "utf8")
        .replace(/\r\n/g, "\n");
      expect(vtt.match(/^video-title-/gm)).toHaveLength(titleCount);
      for (const cue of script.videoTitleCues) {
        expect(cue.translations[language].trim()).not.toBe("");
        expect(cue.translations[language]).not.toBe(cue.sourceText);
        expect(vtt).toContain(
          `${cue.id}\n${stamp(cue.start)} --> ${stamp(cue.end)}\n${cue.translations[language]}`,
        );
      }
    },
  );
});
