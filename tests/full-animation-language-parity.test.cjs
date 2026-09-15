/** @jest-environment node */
import fs from "node:fs";
import crypto from "node:crypto";
import { describe, expect, it } from "@jest/globals";

const languages = ["en", "es-419", "ko", "ne", "fr", "lg", "ha", "yo", "ig"];
const lessons = [
  ["front-of-eye", "frontOfEyeFullAnimationVideoPage", 22, 171.46],
  [
    "binocular-indirect-ophthalmoscopy",
    "binocularIndirectOphthalmoscopyFullAnimationVideoPage",
    18,
    130.68,
  ],
];
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const catalog = read("public/video-localization/childhood-eye-screening.json");
const translations = read("scripts/full-animation-translations.json");
const stamp = (time) =>
  new Date(Math.round(time * 1000)).toISOString().slice(11, 23);

describe.each(lessons)(
  "%s multilingual delivery",
  (lesson, pageId, count, duration) => {
    const base = `/narration/${lesson}/full-animation/`;
    const script = read(`public${base}script.json`);
    const manifest = read(`public${base}manifest.json`);
    const entry = catalog[pageId];

    it("preserves scene timing and offers the same nine languages as Fundal Reflex", () => {
      expect(script.cues).toHaveLength(count);
      expect(script.durationSeconds).toBe(duration);
      expect(Object.keys(script.languages).sort()).toEqual(
        [...languages].sort(),
      );
      expect(Object.keys(entry.audioVariants).sort()).toEqual(
        [...languages].sort(),
      );
      expect(entry.defaultAudioLang).toBe("en");
      script.cues.forEach((cue, index) => {
        expect(cue.end).toBeGreaterThan(cue.start);
        expect(cue.end).toBeLessThanOrEqual(duration);
        if (index)
          expect(cue.start).toBeGreaterThanOrEqual(script.cues[index - 1].end);
      });
    });

    it.each(languages)(
      "ships matching %s audio, captions and catalogue URLs",
      (language) => {
        const bytes = fs.readFileSync(`public${base}${language}.m4a`);
        const vtt = fs
          .readFileSync(`public${base}${language}.vtt`, "utf8")
          .replace(/\r\n/g, "\n");
        const track = manifest.tracks[language];
        expect(bytes.length).toBeGreaterThan(10000);
        expect(bytes.length).toBeLessThan(2000000);
        expect(bytes.subarray(4, 8).toString()).toBe("ftyp");
        expect(track.bytes).toBe(bytes.length);
        expect(track.sha256).toBe(
          crypto.createHash("sha256").update(bytes).digest("hex"),
        );
        expect(track.src).toBe(`${language}.m4a`);
        expect(track.captions).toBe(`${language}.vtt`);
        expect(vtt.startsWith("WEBVTT\n")).toBe(true);
        expect(vtt.match(/-->/g)).toHaveLength(
          count + (language === "en" ? 0 : script.videoTitleCues.length),
        );
        script.cues.forEach((cue, index) => {
          expect(cue[language].trim().length).toBeGreaterThan(0);
          expect(cue[language]).not.toMatch(/\uFFFD/);
          if (language !== "en") {
            expect(cue[language]).not.toBe(cue.en);
            expect(cue[language]).toBe(translations[lesson][language][index]);
          }
          expect(vtt).toContain(
            `${cue.id}\n${stamp(cue.start)} --> ${stamp(cue.end)}\n${cue[language]}`,
          );
        });
        const subtitleLanguage = language === "es-419" ? "es" : language;
        expect(entry.subtitles[subtitleLanguage]).toBe(
          `${base}${language}.vtt`,
        );
        expect(entry.audioVariants[language]).toEqual({
          label: script.languages[language].label,
          src: `${base}${language}.m4a`,
        });
        expect(entry.iosHls.subtitleLanguages).toContain(subtitleLanguage);
      },
    );
  },
);
