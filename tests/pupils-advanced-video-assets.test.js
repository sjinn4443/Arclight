/** @jest-environment node */
import fs from "node:fs";
import crypto from "node:crypto";
import { JSDOM } from "jsdom";
import videoTimeline from "../scripts/lib/pupils-advanced-video-timeline.cjs";
import { PUPILS_ADVANCED_SCROLL_CONFIG as config } from "../public/js/pupilsAdvancedScroll.js";
const base = "public/narration/pupils-advanced/full-animation/";
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const source = read(base + "script.json"),
  video = read(base + "video/script.json");
const scenes = videoTimeline(config);
const mapTime = (time, origin = time) => {
  const scene = scenes.find(
    (s, i) =>
      origin >= s.sourceStart &&
      origin < (scenes[i + 1]?.sourceStart ?? Infinity),
  );
  return scene.start + Math.min(time, scene.sourceEnd) - scene.sourceStart;
};

test("Advanced Full Animation inserts seven silent cards without changing the scroll clock", () => {
  expect(source.durationSeconds).toBe(315);
  expect(video.durationSeconds).toBeCloseTo(scenes.at(-1).end);
  expect(video.durationSeconds).toBeLessThan(320);
  expect(video.videoTitleCues).toHaveLength(7);
  expect(video.videoTitleCues.map((c) => c.sourceText)).toEqual(
    config.sections.map((s) => s.title),
  );
  expect(video.cues).toHaveLength(source.cues.length);
  for (const [i, cue] of video.cues.entries()) {
    expect(cue.start).toBeCloseTo(mapTime(source.cues[i].start));
    expect(cue.end).toBeCloseTo(
      mapTime(source.cues[i].end, source.cues[i].start),
    );
    expect(cue.en).toBe(source.cues[i].en);
    expect(cue.ko).toBe(source.cues[i].ko);
    for (const title of video.videoTitleCues)
      expect(cue.end <= title.start || cue.start >= title.end).toBe(true);
  }
  for (const [i, cue] of video.visualCues.entries())
    expect(cue.at).toBeCloseTo(mapTime(source.visualCues[i].at));
});

test("Advanced video retains the original English/Korean voices and grouped captions", () => {
  const manifest = read(base + "video/manifest.json"),
    original = read(base + "manifest.json");
  const catalog = read(
    "public/video-localization/childhood-eye-screening.json",
  ).pupilsAdvancedFullAnimationVideoPage;
  for (const language of Object.keys(source.languages)) {
    const track = manifest.tracks[language],
      bytes = fs.readFileSync(base + "video/" + track.src);
    expect(track.sourceSha256).toBe(original.tracks[language].sha256);
    expect(track.sha256).toBe(
      crypto.createHash("sha256").update(bytes).digest("hex"),
    );
    expect(track.bytes).toBe(bytes.length);
    expect(track.durationSeconds).toBeCloseTo(video.durationSeconds);
    const vtt = fs.readFileSync(base + "video/" + track.captions, "utf8");
    expect(vtt.match(/-->/g)).toHaveLength(
      source.cues.filter((c) => c.caption?.[language] ?? c[language]).length +
        (language === "en" ? 0 : 7),
    );
    expect(catalog.audioVariants[language].src).toBe(
      `/narration/pupils-advanced/full-animation/video/${language}.m4a`,
    );
    expect(catalog.subtitles[language]).toBe(
      `/narration/pupils-advanced/full-animation/video/${language}.vtt`,
    );
  }
  for (const quality of ["240", "720"])
    expect(
      fs.statSync(
        `public/videos/FullAnim/PupilsAdvancedFullAnim_${quality}p.mp4`,
      ).size,
    ).toBeGreaterThan(10000);
});

test("shortened scene tails retain speech and 1.5 seconds after the last visual", () => {
  for (const [index, lastVisual] of [
    [0, 562 / 30],
    [13, 341.25 / 30],
  ]) {
    const clip = config.narrationClipsByFile[index];
    const kept = scenes[index].sourceEnd - clip.start;
    expect(kept - lastVisual).toBeCloseTo(1.5, 1);
    // Latest spoken endings in the original English/Korean recordings.
    const speechEnd = index === 0 ? 17.092 : 284.825;
    expect(speechEnd).toBeLessThan(scenes[index].sourceEnd - 1);
    expect(scenes[index + 1].start).toBeCloseTo(scenes[index].end);
  }
});

test("Pupils Full Animation follows the Advanced scrolly and reuses the PEC player shell", () => {
  const doc = new JSDOM(fs.readFileSync("public/html/videos.html", "utf8"))
    .window.document;
  const row = doc.querySelector(
    '#pupilsPage [data-target="pupilsAdvancedFullAnimationVideoPage"]',
  );
  expect(row.previousElementSibling.dataset.target).toBe(
    "pupilsAdvancedScrollPage",
  );
  expect(row.querySelector(".lesson-type").textContent.trim()).toBe(
    "Pupils Full Animation",
  );
  expect(
    row.querySelector('[role="progressbar"]').getAttribute("aria-labelledby"),
  ).toBe(row.querySelector(".lesson-type").id);
  const page = doc.getElementById("pupilsAdvancedFullAnimationVideoPage");
  expect(page.classList.contains("full-animation-video-page")).toBe(true);
  expect(
    [...page.querySelectorAll("[data-mode]")].map((el) => el.dataset.mode),
  ).toEqual(["low", "high"]);
  expect(page.querySelector("video").hasAttribute("playsinline")).toBe(true);
});
