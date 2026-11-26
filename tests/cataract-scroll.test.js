/** @jest-environment node */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
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
  expect(cfg.paths).toHaveLength(19);
  expect(cfg.sections.map((s) => s.title)).toEqual([
    "History Taking",
    "Visual Acuity",
    "Front of Eye",
    "Pupils",
    "Fundal Reflex",
    "Fundoscopy",
  ]);
  expect(cfg.sections.map((s) => s.startIndex)).toEqual([0, 3, 8, 10, 13, 17]);
  cfg.paths.forEach((file, i) => {
    const data = JSON.parse(fs.readFileSync(`public${file}`));
    const ids = new Set(data.assets.map((a) => a.id));
    for (const layer of [
      ...data.layers,
      ...data.assets.flatMap((a) => a.layers || []),
    ]) {
      if (layer.refId) expect(ids.has(layer.refId)).toBe(true);
    }
    for (const layer of data.layers.filter((l) =>
      l.refId?.startsWith("symbol-"),
    )) {
      const asset = data.assets.find((a) => a.id === layer.refId);
      expect(
        Math.max(asset.w * layer.ks.s.k[0], asset.h * layer.ks.s.k[1]) / 100,
      ).toBeCloseTo(110, 5);
    }
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
    expect(
      data.layers.some(
        (l) => l.ty === 0 || l.ks.o.a || l.masksProperties?.length,
      ),
    ).toBe(true);
    data.assets
      .filter((a) => a.p)
      .forEach((a) => {
        expect(a.u.startsWith("/")).toBe(false);
        expect(
          fs.statSync(path.join("public", path.dirname(file), a.u, a.p)).size,
        ).toBeGreaterThan(0);
        if (!a.id.startsWith("reuse-"))
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
  expect(script.cues).toHaveLength(38);
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
    ).toHaveLength(38);
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

test("History Taking keeps both original actors and the revised spoken meaning", () => {
  for (const i of [0, 1]) {
    const data = JSON.parse(fs.readFileSync(`public${cfg.paths[i]}`));
    const ids = data.layers.map((l) => l.refId);
    expect(ids).toContain("history-examiner");
    expect(ids).toContain("history-patient");
    expect(ids.filter((id) => id?.startsWith("bubble-"))).toHaveLength(2);
  }
  const third = JSON.parse(fs.readFileSync(`public${cfg.paths[2]}`));
  expect(third.layers.some((l) => l.refId === "history-examiner")).toBe(false);
  expect(stages[0].cues[0].en).toMatch(/^Ask if the vision/);
  expect(stages[2].cues[0].en).toMatch(/front or back of the eye/);
  expect(stages[2].cues[1].en).toMatch(/front of the eye/);
});

test("the gesture leaves the clipboard and cuff fixed, and the full-body art has clear edges", async () => {
  const scene = JSON.parse(fs.readFileSync(`public${cfg.paths[0]}`));
  const body = scene.layers.find((l) => l.refId === "history-examiner");
  const gesture = scene.layers.find(
    (l) => l.nm === "Examiner gestures at the wrist",
  );
  expect(gesture.ks).toEqual(body.ks);
  const dir = "public/scrolly/conditions/cataract";
  const { assets } = JSON.parse(fs.readFileSync(dir + "/provenance.json"));
  const { box, width } = assets["history-examiner"];
  const wristX = ((215 - box[0]) * width) / box[2];
  let movingFingers = false;
  for (const group of gesture.shapes) {
    const poses = group.it.find((it) => it.ty === "sh").ks.k;
    const resting = poses[0].s[0];
    for (const pose of poses.slice(1)) {
      resting.v.forEach((point, i) => {
        const next = pose.s[0].v[i];
        if (point[0] <= wristX) expect(next).toEqual(point);
        else if (Math.abs(next[1] - point[1]) > 2) movingFingers = true;
      });
    }
  }
  expect(movingFingers).toBe(true);
  for (const name of [
    "history-examiner",
    "history-examiner-arm",
    "history-patient",
  ]) {
    const { data, info } = await sharp(`${dir}/images/${name}.webp`)
      .extractChannel("alpha")
      .raw()
      .toBuffer({ resolveWithObject: true });
    let left = info.width,
      top = info.height,
      right = 0,
      bottom = 0;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        if (data[y * info.width + x] < 128) continue;
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
    }
    expect(
      Math.min(left, top, info.width - 1 - right, info.height - 1 - bottom),
    ).toBeGreaterThan(3);
    if (name.endsWith("-arm")) expect(bottom).toBeLessThan(info.height / 2);
    else expect(bottom).toBeGreaterThan(info.height * 0.9);
  }
});

test("each findings rectangle carries its own original column badge", () => {
  const positive = [2, 7, 10, 12, 15, 16, 19],
    other = [3, 8, 10, 13, 17, 19];
  cfg.paths.forEach((file, i) => {
    const scene = JSON.parse(fs.readFileSync("public" + file));
    const mixed = [10, 19].includes(i + 1);
    for (const [name, sceneNumbers] of [
      ["badge-cataract", positive],
      ["badge-other-cause", other],
    ]) {
      const badges = scene.layers.filter((l) => l.refId === name);
      expect(badges).toHaveLength(sceneNumbers.includes(i + 1) ? 1 : 0);
      if (!badges.length) continue;
      const [x, y] = badges[0].ks.p.k;
      const edge = mixed && name === "badge-cataract" ? scene.w / 2 : scene.w;
      expect(edge - x).toBeGreaterThanOrEqual(55);
      expect(edge - x).toBeLessThan(95);
      expect(y).toBeLessThan(130);
      if (mixed && name === "badge-other-cause")
        expect(badges[0].ks.o.k[1].t).toBe(stages[i].cues[2].offset * scene.fr);
    }
  });
});
