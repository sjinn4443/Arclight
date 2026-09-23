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
      "/videos/FullAnim/FrontofEyeFullAnim_timed_720p.mp4",
    );
    expect(script.durationSeconds).toBeCloseTo(171.46, 2);
    expect(script.cues).toHaveLength(22);

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

  it("finishes the held explanations before advancing to the matching scenes", () => {
    const cue = (id) => script.cues.find((entry) => entry.id === id);
    // At video 16s, the earlier 4s hold puts narration at 20s.
    expect(cue("observation-03").end).toBeLessThanOrEqual(25.5);
    expect(cue("observation-04").start).toBe(27);
    expect(cue("observation-05").start).toBe(38);
    expect(cue("observation-04").end).toBeLessThanOrEqual(30.5);
    // At source video 40.5s, the earlier 9.5s of holds puts narration at 50s.
    expect(cue("structures-01").start).toBe(50);
    expect(cue("structures-01").end).toBeLessThanOrEqual(55);
    expect(cue("structures-02").start - 14.5).toBe(44);
    expect(cue("conditions-01").start).toBe(87);
    expect(cue("conditions-01").end).toBeLessThanOrEqual(
      cue("chamber-depth-01").start,
    );
    expect(cue("chamber-depth-02").start).toBeLessThan(109);
    expect(cue("chamber-depth-02").end).toBe(113);
    expect(cue("chamber-depth-03").end).toBe(120.1);
    expect(cue("fluorescein-application").start).toBe(124);
    expect(cue("fluorescein-02").start).toBe(136);
    expect(cue("fluorescein-02").end).toBe(143.5);
    expect(cue("lid-eversion-grip").start).toBe(151);
    expect(cue("lid-eversion-grip").end).toBeLessThanOrEqual(
      cue("lid-eversion-01").start,
    );
  });

  it("wires the lesson row, page, playback source and localization", () => {
    const page = catalog.frontOfEyeFullAnimationVideoPage;

    expect(videosHtml).toContain(
      'data-target="frontOfEyeFullAnimationVideoPage"',
    );
    expect(videosHtml).toContain('id="frontOfEyeFullAnimationVideoPage"');
    expect(videosHtml).toContain('id="frontOfEyeFullAnimationVideo"');
    expect(page.localSources).toEqual({
      low: "videos/FullAnim/FrontofEyeFullAnim_timed_220p.mp4",
      high: "videos/FullAnim/FrontofEyeFullAnim_timed_720p.mp4",
    });
    expect(page.subtitles.en).toBe(
      "/narration/front-of-eye/full-animation/en.vtt",
    );
    expect(page.audioVariants.en.src).toBe(
      "/narration/front-of-eye/full-animation/en.m4a",
    );
    expect(videosSource).toContain(
      'low: "videos/FullAnim/FrontofEyeFullAnim_timed_220p.mp4"',
    );
    const config = videosSource
      .split("  frontOfEyeFullAnimationVideoPage: {")[1]
      .split("  fundalStillPage:")[0];
    expect(config).not.toContain("playbackHolds");
    expect(
      fs.existsSync(
        path.resolve(
          "public/videos/FullAnim/FrontofEyeFullAnim_timed_720p.mp4",
        ),
      ),
    ).toBe(true);
  });

  it("keeps generated review media out of the public app package", () => {
    const publicFiles = fs.readdirSync(root);
    expect(publicFiles.some((file) => file.endsWith(".wav"))).toBe(false);
    expect(publicFiles.some((file) => file.endsWith(".mp4"))).toBe(false);
  });
});
