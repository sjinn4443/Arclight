/**
 * @jest-environment node
 */

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "@jest/globals";

const root = path.resolve("public/narration/front-of-eye/full-animation");
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
const videosHtml = fs.readFileSync(
  path.resolve("public/html/videos.html"),
  "utf8",
);
const videosSource = fs.readFileSync(
  path.resolve("public/js/videos.js"),
  "utf8",
);

describe("Front of Eye narration assets", () => {
  it("keeps the English cues ordered on the new animation timeline", () => {
    expect(script.sourceVideo).toBe(
      "/videos/FullAnim/New_FrontofEyeFullAnim.mp4",
    );
    expect(script.durationSeconds).toBeCloseTo(138.26, 2);
    expect(script.cues).toHaveLength(19);

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
    expect(manifest.tracks.en.src).toBe("en.m4a");
    expect(manifest.tracks.en.captions).toBe("en.vtt");
  });

  it("wires the lesson row, page, playback source and localization", () => {
    const page = catalog.frontOfEyeFullAnimationVideoPage;

    expect(videosHtml).toContain(
      'data-target="frontOfEyeFullAnimationVideoPage"',
    );
    expect(videosHtml).toContain('id="frontOfEyeFullAnimationVideoPage"');
    expect(videosHtml).toContain('id="frontOfEyeFullAnimationVideo"');
    expect(page.localSources).toEqual({
      low: "videos/FullAnim/New_FrontofEyeFullAnim.mp4",
      high: "videos/FullAnim/New_FrontofEyeFullAnim.mp4",
    });
    expect(page.subtitles.en).toBe(
      "/narration/front-of-eye/full-animation/en.vtt",
    );
    expect(page.audioVariants.en.src).toBe(
      "/narration/front-of-eye/full-animation/en.m4a",
    );
    expect(videosSource).toContain(
      'low: "videos/FullAnim/New_FrontofEyeFullAnim.mp4"',
    );
    expect(videosSource).toContain("at: 6");
    expect(videosSource).toContain("at: 77");
    expect(videosSource).toContain("durationMs: 4000");
    expect(videosSource).toContain("at: 121");
    expect(videosSource).toContain("durationMs: 3000");
  });

  it("keeps generated review media out of the public app package", () => {
    const publicFiles = fs.readdirSync(root);
    expect(publicFiles.some((file) => file.endsWith(".wav"))).toBe(false);
    expect(publicFiles.some((file) => file.endsWith(".mp4"))).toBe(false);
  });
});
