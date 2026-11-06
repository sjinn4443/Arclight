/** @jest-environment node */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { JSDOM } from "jsdom";
import {
  CATARACT_SCROLL_CONFIG as cfg,
  CATARACT_SCROLL_TIMING as timing,
  CATARACT_STAGES as stages,
} from "../public/js/cataractScroll.js";
import { frameAtNarrationTime } from "../public/js/examinationScrollTiming.js";

test("Primary Cataract scrolly is immediately above Simulator and has a named progress bar", () => {
  const doc = new JSDOM(fs.readFileSync("public/html/videos.html", "utf8"))
    .window.document;
  const row = doc.querySelector(
    `#cataractPage .pupil-level--primary [data-target="${cfg.pageId}"]`,
  );
  expect(row.classList.contains("lesson-row--scrollytelling")).toBe(true);
  expect(row.nextElementSibling.dataset.target).toBe("cataractSimulatorPage");
  const bar = row.querySelector('[role="progressbar"]');
  expect(
    doc.getElementById(bar.getAttribute("aria-labelledby")).textContent,
  ).toBe("Cataract");
  expect(
    doc.querySelector(`#${cfg.pageId} .childhood-fundal-prep-list`).children,
  ).toHaveLength(0);
});

test("all original-art scenes have valid local dependencies and exact narration endpoints", () => {
  expect(cfg.paths).toHaveLength(18);
  expect(cfg.sections.map((s) => s.title)).toEqual([
    "history taking",
    "visual acuity",
    "front of eye",
    "pupils",
    "fundal reflex",
    "fundoscopy",
  ]);
  expect(cfg.sections.map((s) => s.startIndex)).toEqual([0, 3, 6, 9, 12, 15]);
  cfg.paths.forEach((file, i) => {
    const data = JSON.parse(fs.readFileSync(`public${file}`));
    expect([data.w, data.h, data.fr, data.op]).toEqual([
      1169,
      1280,
      30,
      stages[i].seconds * 30,
    ]);
    expect(cfg.completionHoldFrameByFile[i]).toBe(data.op - 1);
    expect(
      frameAtNarrationTime(timing.stages[i], cfg.narrationClipsByFile[i].end),
    ).toBe(data.op - 1);
    expect(data.layers.some((l) => l.ks.o.a || l.masksProperties?.length)).toBe(
      true,
    );
    data.assets.forEach((a) => {
      expect(a.u.startsWith("/")).toBe(false);
      expect(
        fs.statSync(path.join("public", path.dirname(file), a.u, a.p)).size,
      ).toBeGreaterThan(0);
      expect(Math.max(a.w, a.h)).toBeLessThanOrEqual(1600);
    });
    for (const layer of data.layers.filter((l) => l.masksProperties)) {
      // Lottie skips tangent conversion without this flag, bending rectangles
      // into diagonal wedges although its numeric completion state still passes.
      expect(layer.hasMask).toBe(true);
      expect(
        layer.masksProperties.every((m) => m.pt.k.every((k) => k.s[0].c)),
      ).toBe(true);
    }
  });
});

test("the cataract reflex exception is explicit in both languages and every cue has a slot", () => {
  const script = JSON.parse(
    fs.readFileSync("public/narration/cataract/full-animation/script.json"),
  );
  expect(script.cues).toHaveLength(36);
  expect(script.durationSeconds).toBe(cfg.narrationClipsByFile.at(-1).end);
  expect(script.cues.find((c) => c.id === "reflex-opacity").en).toMatch(
    /not normal/,
  );
  expect(script.cues.find((c) => c.id === "reflex-opacity").ko).toMatch(
    /정상 소견이 아니라/,
  );
  for (const language of Object.keys(script.languages)) {
    expect(script.cues.every((c) => c[language] && c.end > c.start)).toBe(true);
    expect(
      fs
        .readFileSync(
          `public/narration/cataract/full-animation/${language}.vtt`,
          "utf8",
        )
        .match(/-->/g),
    ).toHaveLength(36);
  }
});

test("packaged narration matches the manifest and lesson clock", () => {
  const folder = "public/narration/cataract/full-animation";
  const manifest = JSON.parse(fs.readFileSync(`${folder}/manifest.json`));
  for (const [language, track] of Object.entries(manifest.tracks)) {
    expect(
      crypto
        .createHash("sha256")
        .update(fs.readFileSync(`${folder}/${language}.m4a`))
        .digest("hex"),
    ).toBe(track.sha256);
    expect(
      Math.abs(track.durationSeconds - manifest.durationSeconds),
    ).toBeLessThan(0.25);
  }
});
