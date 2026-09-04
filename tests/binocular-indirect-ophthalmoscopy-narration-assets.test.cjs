/**
 * @jest-environment node
 */

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "@jest/globals";

const root = path.resolve(
  "public/narration/binocular-indirect-ophthalmoscopy/full-animation",
);
const script = JSON.parse(
  fs.readFileSync(path.join(root, "script.json"), "utf8"),
);
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "manifest.json"), "utf8"),
);
const catalog = JSON.parse(
  fs.readFileSync(
    path.resolve("public/video-localization/childhood-eye-screening.json"),
    "utf8",
  ),
);
const videosSource = fs.readFileSync(
  path.resolve("public/js/videos.js"),
  "utf8",
);

describe("Binocular Indirect Ophthalmoscopy narration assets", () => {
  it("keeps the English cues ordered on the new animation timeline", () => {
    expect(script.sourceVideo).toBe("/videos/FullAnim/New_BIOFullAnim.mp4");
    expect(script.durationSeconds).toBeCloseTo(130.68, 2);
    expect(script.cues).toHaveLength(18);

    script.cues.forEach((cue, index) => {
      expect(cue.en.trim().length).toBeGreaterThan(0);
      expect(cue.end).toBeGreaterThan(cue.start);
      if (index > 0) {
        expect(cue.start).toBeGreaterThanOrEqual(script.cues[index - 1].end);
      }
    });
  });

  it("ships a sub-2 MB English track and matching captions", () => {
    const audioPath = path.join(root, "en.m4a");
    const vtt = fs.readFileSync(path.join(root, "en.vtt"), "utf8");

    expect(fs.statSync(audioPath).size).toBeLessThan(2_000_000);
    expect(vtt.startsWith("WEBVTT\n")).toBe(true);
    expect(vtt.match(/-->/g)).toHaveLength(script.cues.length);
    expect(vtt).toContain("00:00:39.950 --> 00:00:47.100");
    expect(vtt).not.toContain("00:00:39.950 --> 00:00:51.000");
    expect(manifest.tracks.en.src).toBe("en.m4a");
    expect(manifest.tracks.en.captions).toBe("en.vtt");
  });

  it("uses the new BIO animation for playback and localization", () => {
    const page = catalog.binocularIndirectOphthalmoscopyFullAnimationVideoPage;

    expect(page.localSources).toEqual({
      low: "videos/FullAnim/New_BIOFullAnim.mp4",
      high: "videos/FullAnim/New_BIOFullAnim.mp4",
    });
    expect(page.subtitles.en).toBe(
      "/narration/binocular-indirect-ophthalmoscopy/full-animation/en.vtt",
    );
    expect(page.audioVariants.en.src).toBe(
      "/narration/binocular-indirect-ophthalmoscopy/full-animation/en.m4a",
    );
    expect(videosSource).toContain(
      'low: "videos/FullAnim/New_BIOFullAnim.mp4"',
    );
    expect(videosSource).not.toContain(
      'low: "videos/FullAnim/BIO_Full Animation_720p.mp4"',
    );
    expect(videosSource).toContain("at: 43.7");
    expect(videosSource).toContain("durationMs: 4000");
    expect(videosSource).toContain("at: 103.6");
    expect(videosSource).toContain("durationMs: 7000");
  });

  it("keeps generated review media out of the public app package", () => {
    const publicFiles = fs.readdirSync(root);
    expect(publicFiles.some((file) => file.endsWith(".wav"))).toBe(false);
    expect(publicFiles.some((file) => file.endsWith(".mp4"))).toBe(false);
  });
});
