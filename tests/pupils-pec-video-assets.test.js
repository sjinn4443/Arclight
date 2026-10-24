/** @jest-environment node */
import fs from "node:fs";
import crypto from "node:crypto";

const folder = "public/narration/pupils-pec/full-animation/";
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const scroll = read(folder + "script.json");
const video = read(folder + "video/script.json");

test("section cards extend only the delivery clock and keep narration out of silent cards", () => {
  expect(scroll.durationSeconds).toBe(102);
  expect(video.durationSeconds).toBe(108);
  expect(
    video.videoTitleCues.map((cue) => [cue.start, cue.end, cue.sourceText]),
  ).toEqual([
    [0, 3, "Observation"],
    [22, 25, "Direct Light Response"],
  ]);
  expect(video.cues).toHaveLength(scroll.cues.length);
  video.cues.forEach((cue, i) => {
    const original = scroll.cues[i];
    const shift = original.start < 19 ? 3 : 6;
    expect(cue.start).toBe(original.start + shift);
    expect(cue.end).toBe(original.end + shift);
    expect(cue.en).toBe(original.en);
    expect(cue.ko).toBe(original.ko);
    for (const title of video.videoTitleCues)
      expect(cue.end <= title.start || cue.start >= title.end).toBe(true);
  });
});

test("video tracks retain original source checksums and connect both languages to the new clock", () => {
  const manifest = read(folder + "video/manifest.json");
  const original = read(folder + "manifest.json");
  const catalog = read(
    "public/video-localization/childhood-eye-screening.json",
  ).pupilsPecFullAnimationVideoPage;
  expect(manifest.durationSeconds).toBe(108);
  for (const language of Object.keys(scroll.languages)) {
    const track = manifest.tracks[language];
    expect(track.sourceSha256).toBe(original.tracks[language].sha256);
    const audio = fs.readFileSync(folder + "video/" + track.src);
    expect(audio.length).toBe(track.bytes);
    expect(crypto.createHash("sha256").update(audio).digest("hex")).toBe(
      track.sha256,
    );
    const vtt = fs.readFileSync(folder + "video/" + track.captions, "utf8");
    expect(vtt.match(/-->/g)).toHaveLength(
      scroll.cues.filter((c) => c.caption?.[language] ?? c[language]).length +
        (language === "en" ? 0 : 2),
    );
    expect(catalog.audioVariants[language].src).toBe(
      `/narration/pupils-pec/full-animation/video/${language}.m4a`,
    );
    expect(catalog.subtitles[language]).toBe(
      `/narration/pupils-pec/full-animation/video/${language}.vtt`,
    );
  }
});
