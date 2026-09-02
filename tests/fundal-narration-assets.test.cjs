/**
 * @jest-environment node
 */

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "@jest/globals";

const root = path.resolve("public/narration/fundal-reflex/full-animation");
const languages = ["en", "es-419", "ko"];
const script = JSON.parse(
  fs.readFileSync(path.join(root, "script.json"), "utf8"),
);
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "manifest.json"), "utf8"),
);

describe("Fundal Reflex narration assets", () => {
  it("keeps every language on the same ordered cue timeline", () => {
    expect(script.durationSeconds).toBeCloseTo(274.273333, 3);
    expect(script.cues).toHaveLength(24);

    script.cues.forEach((cue, index) => {
      expect(cue.end).toBeGreaterThan(cue.start);
      languages.forEach((language) => {
        expect(cue[language].trim().length).toBeGreaterThan(0);
      });
      if (index > 0) {
        expect(cue.start).toBeGreaterThanOrEqual(script.cues[index - 1].end);
      }
    });
  });

  it("matches key cue times to the Fundal Reflex scrolly sequence", () => {
    const cueAt = (seconds) =>
      script.cues.find((cue) => seconds >= cue.start && seconds < cue.end);

    expect(cueAt(105)?.id).toBe("examination-05");
    expect(cueAt(105)?.screenText).toContain("pigmentation");
    expect(cueAt(122)?.id).toBe("eyes-open-01");
    expect(cueAt(132)?.id).toBe("eyes-open-02");
    expect(cueAt(152)?.id).toBe("eyes-closed-01");
  });

  it.each(languages)(
    "ships a sub-2 MB %s delivery track and matching VTT",
    (language) => {
      const audioPath = path.join(root, `${language}.m4a`);
      const vttPath = path.join(root, `${language}.vtt`);
      const vtt = fs.readFileSync(vttPath, "utf8");

      expect(fs.statSync(audioPath).size).toBeLessThan(2_000_000);
      expect(vtt.startsWith("WEBVTT\n")).toBe(true);
      expect(vtt.match(/-->/g)).toHaveLength(script.timedCues[language].length);
      expect(manifest.tracks[language].src).toBe(`${language}.m4a`);
      expect(manifest.tracks[language].captions).toBe(`${language}.vtt`);
    },
  );

  it("keeps WAV masters and review MP4s out of the public app package", () => {
    const publicFiles = fs.readdirSync(root);
    expect(publicFiles.some((file) => file.endsWith(".wav"))).toBe(false);
    expect(publicFiles.some((file) => file.endsWith(".mp4"))).toBe(false);
  });
});
