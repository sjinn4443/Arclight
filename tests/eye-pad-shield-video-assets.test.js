/** @jest-environment node */
import fs from "node:fs";
import crypto from "node:crypto";
import {
  EYE_PAD_SHIELD_SCROLL_CONFIG as cfg,
  EYE_PAD_SHIELD_LANGUAGES as languages,
} from "../public/js/eyePadShieldScroll.js";

const folder = "public/narration/make-eye-pad-shield/full-animation/";
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const scroll = read(folder + "script.json");
const video = read(folder + "video/script.json");
const catalog = read(
  "public/video-localization/childhood-eye-screening.json",
).makeEyePadShieldFullAnimationVideoPage;

test("title cards follow the three scrolly sections without changing its 125-second clock", () => {
  expect(scroll.durationSeconds).toBe(125);
  expect(video.durationSeconds).toBe(134);
  expect(
    video.videoTitleCues.map((cue) => [cue.start, cue.end, cue.sourceText]),
  ).toEqual([
    [0, 3, "Preparation"],
    [20, 23, "Make an eye pad"],
    [65, 68, "Make an eye shield"],
  ]);
  expect(video.videoTitleCues.map((cue) => cue.sourceText)).toEqual(
    cfg.sections.map((section) => section.title),
  );
  video.cues.forEach((cue, i) => {
    const original = scroll.cues[i];
    const offset = original.start < 17 ? 3 : original.start < 59 ? 6 : 9;
    expect(cue.start).toBe(original.start + offset);
    expect(cue.end).toBe(original.end + offset);
    expect(cue.id).toBe(original.id);
    video.videoTitleCues.forEach((title) =>
      expect(cue.end <= title.start || cue.start >= title.end).toBe(true),
    );
  });
});

test("both timelines ship the Front of Eye languages and voices with valid audio checksums", () => {
  const front = read(
    "public/narration/front-of-eye/full-animation/script.json",
  );
  expect(Object.keys(languages)).toEqual(Object.keys(front.languages));
  for (const [subfolder, script] of [
    ["", scroll],
    ["video/", video],
  ]) {
    const manifest = read(folder + subfolder + "manifest.json");
    expect(manifest.durationSeconds).toBe(script.durationSeconds);
    expect(Object.keys(manifest.tracks).sort()).toEqual(
      Object.keys(languages).sort(),
    );
    for (const language of Object.keys(languages)) {
      expect(script.languages[language].voice).toBe(
        front.languages[language].voice,
      );
      script.cues.forEach((cue) =>
        expect(cue[language]?.trim().length).toBeGreaterThan(0),
      );
      const track = manifest.tracks[language];
      const audio = fs.readFileSync(folder + subfolder + track.src);
      expect(audio.length).toBe(track.bytes);
      expect(audio.length).toBeLessThan(2_000_000);
      expect(crypto.createHash("sha256").update(audio).digest("hex")).toBe(
        track.sha256,
      );
      const vtt = fs.readFileSync(folder + subfolder + track.captions, "utf8");
      expect(vtt.match(/-->/g)).toHaveLength(13 + (language === "en" ? 0 : 3));
      if (subfolder) {
        expect(catalog.audioVariants[language].src).toBe(
          `/narration/make-eye-pad-shield/full-animation/video/${language}.m4a`,
        );
        expect(catalog.subtitles[language === "es-419" ? "es" : language]).toBe(
          `/narration/make-eye-pad-shield/full-animation/video/${language}.vtt`,
        );
      } else
        expect(cfg.narrationTracks[language].src).toBe(
          `/narration/make-eye-pad-shield/full-animation/${language}.m4a`,
        );
    }
  }
  expect(catalog.localSources.low).toMatch(/_240p\.mp4$/);
  for (const source of Object.values(catalog.localSources))
    expect(fs.statSync(`public${source}`).size).toBeGreaterThan(0);
  expect(
    fs.existsSync("public/videos/FullAnim/MakeEyePadShieldFullAnim_220p.mp4"),
  ).toBe(false);
});
