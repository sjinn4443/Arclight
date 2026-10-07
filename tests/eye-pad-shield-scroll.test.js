/** @jest-environment node */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  EYE_PAD_SHIELD_SCROLL_CONFIG as cfg,
  EYE_PAD_SHIELD_STAGES as stages,
  EYE_PAD_SHIELD_SCROLL_TIMING as timing,
} from "../public/js/eyePadShieldScroll.js";
import { frameAtNarrationTime } from "../public/js/examinationScrollTiming.js";

const folder = "public/narration/make-eye-pad-shield/full-animation";
const script = JSON.parse(fs.readFileSync(`${folder}/script.json`, "utf8"));

test("the twelve references and DO hygiene form nine locally available Lottie stages", () => {
  expect(stages.flatMap((stage) => stage.scenes)).toEqual(
    Array.from({ length: 12 }, (_, i) => i + 1),
  );
  expect(cfg.paths).toHaveLength(9);
  for (const [index, file] of cfg.paths.entries()) {
    const data = JSON.parse(fs.readFileSync(`public${file}`, "utf8"));
    expect(data.op).toBe(stages[index].seconds * data.fr);
    expect(cfg.completionHoldFrameByFile[index]).toBe(data.op - 1);
    const ids = new Set(data.assets.map((asset) => asset.id));
    for (const layer of data.layers)
      if (layer.refId) expect(ids.has(layer.refId)).toBe(true);
    for (const asset of data.assets) {
      if (asset.layers) {
        for (const child of asset.layers)
          if (child.refId) expect(ids.has(child.refId)).toBe(true);
        continue;
      }
      // Lottie prefixes this with the animation folder, including for root URLs.
      expect(asset.u.startsWith("/")).toBe(false);
      const assetFile = path.join(
        "public",
        path.dirname(file),
        asset.u,
        asset.p,
      );
      expect(fs.statSync(assetFile).size).toBeGreaterThan(0);
      if (index > 0) expect(Math.max(asset.w, asset.h)).toBeLessThan(2048);
      else {
        const original = `public/scrolly/coreexam/ophths/DO/01ObservationandFundalReflex/1/images/${asset.p}`;
        expect(fs.readFileSync(assetFile)).toEqual(fs.readFileSync(original));
      }
    }
    expect(
      frameAtNarrationTime(
        timing.stages[index],
        cfg.narrationClipsByFile[index].end,
      ),
    ).toBe(data.op - 1);
  }
});

test("captions and narration retain every supplied English instruction in order", () => {
  expect(Object.keys(script.languages)).toEqual(["en"]);
  expect(script.cues[0].en).toBe("Wash your hands and don PPE.");
  expect(script.cues.some((cue) => cue.id === "introduction")).toBe(false);
  expect(script.cues.some((cue) => cue.id === "prepare")).toBe(false);
  expect(stages[3].cues.map((cue) => cue.id)).toEqual(["gauze", "pad-tape"]);
  expect(stages[7].cues.map((cue) => cue.id)).toEqual(["cut", "slit"]);
  expect(stages[7].seconds).toBe(20);
  expect(stages.at(-1).cues[1].offset).toBeGreaterThanOrEqual(315 / 30);
  expect(stages.at(-1).cues[1].offset).toBeLessThan(435 / 30);
  expect(script.cues.find((cue) => cue.id === "finished-pad").en).toBe(
    "This is your eye pad.",
  );
  expect(script.cues.find((cue) => cue.id === "finished-shield").en).toBe(
    "This is your eye shield.",
  );
  expect(script.cues.map((cue) => cue.en)).toEqual(
    stages.flatMap((stage) => stage.cues.map((cue) => cue.en)),
  );
  expect(cfg.narrationClipsByFile.flatMap((clip) => clip.cueIds)).toEqual(
    script.cues.map((cue) => cue.id),
  );
  for (const [index, clip] of cfg.narrationClipsByFile.entries()) {
    const cues = script.cues.filter((cue) => clip.cueIds.includes(cue.id));
    expect(cues[0].start).toBe(clip.start);
    expect(cues.at(-1).end).toBe(clip.end);
    if (index > 0)
      expect(clip.start).toBe(cfg.narrationClipsByFile[index - 1].end);
  }
  const manifest = JSON.parse(
    fs.readFileSync(`${folder}/manifest.json`, "utf8"),
  );
  const audio = fs.readFileSync(`${folder}/${manifest.tracks.en.src}`);
  expect(manifest.durationSeconds).toBe(cfg.narrationClipsByFile.at(-1).end);
  expect(crypto.createHash("sha256").update(audio).digest("hex")).toBe(
    manifest.tracks.en.sha256,
  );
  expect(
    fs.readFileSync(`${folder}/en.vtt`, "utf8").match(/-->/g),
  ).toHaveLength(script.cues.length);
});

test("short cutting arcs reveal finished shapes and keep the scissor pieces joined", () => {
  for (const stage of [5, 8]) {
    const data = JSON.parse(
      fs.readFileSync(`public${cfg.paths[stage - 1]}`, "utf8"),
    );
    const paper = data.layers.find(
      (layer) =>
        layer.nm ===
          (stage === 5 ? "03and04foldedgauze.webp" : "08paper.webp") &&
        layer.masksProperties?.[0]?.pt.a === 1,
    );
    expect(paper.ks.o.k.at(-1).s).toEqual([0]);
    const finished = data.layers.find((layer) =>
      stage === 5
        ? layer.nm === "03and04foldedgauze.webp" &&
          layer.masksProperties?.[0]?.pt.a === 0
        : layer.nm === "09paper.webp",
    );
    expect(finished.ks.o.k.at(-1).s).toEqual([100]);
    const holdingTop = data.layers.find(
      (layer) => layer.nm === "holdinghand_top.png",
    );
    const holdingBottom = data.layers.find(
      (layer) => layer.nm === "holdinghand_bottom.png",
    );
    expect(holdingTop.ks.s).toEqual(holdingBottom.ks.s);
    expect(data.layers.indexOf(holdingTop)).toBeLessThan(
      data.layers.indexOf(paper),
    );
    expect(data.layers.indexOf(holdingBottom)).toBeGreaterThan(
      data.layers.indexOf(paper),
    );
    const mask = paper.masksProperties[0].pt.k;
    // The right and upper edge are actually cut as visited; the opposite side
    // stays unchanged until the completed-outline dissolve.
    expect(mask.at(-1).s[0].v[16]).not.toEqual(mask[0].s[0].v[16]);
    expect(mask.at(-1).s[0].v[64]).toEqual(mask[0].s[0].v[64]);
    expect(data.layers.some((layer) => layer.nm === "02leftthumb.webp")).toBe(
      false,
    );
    const upper = data.layers.find(
      (layer) => layer.nm === "scissorupperhand.png",
    );
    const lower = data.layers.find(
      (layer) => layer.nm === "scissorlowerhand.webp",
    );
    expect(lower.ks.p).toEqual(upper.ks.p);
    expect(lower.ks.a.k).toEqual([127, 205, 0]);
    for (const key of lower.ks.r.k.filter((key) => key.t <= 240)) {
      const upperAngle = upper.ks.r.k.find((k) => k.t === key.t).s[0];
      expect(key.s[0] - upperAngle).toBeGreaterThanOrEqual(4);
      expect(key.s[0] - upperAngle).toBeLessThanOrEqual(8.00001);
    }
    const angle = upper.ks.r.k;
    expect(
      Math.abs(angle.find((key) => key.t === 240).s[0] - angle[0].s[0]),
    ).toBeCloseTo(90);
    if (stage === 5) {
      expect(
        data.layers.some(
          (layer) => layer.nm === "03tape.webp" && layer.hasMask,
        ),
      ).toBe(true);
      expect(data.layers.indexOf(lower)).toBeGreaterThan(
        data.layers.indexOf(paper),
      );
    }
  }
});

test("rolling, taping and the camera move share one continuous cone scene", () => {
  const data = JSON.parse(fs.readFileSync(`public${cfg.paths.at(-1)}`, "utf8"));
  const flap = data.layers.find((layer) => layer.nm === "Rolling paper flap 0");
  const geometry = flap.shapes[0].it[0].ks.k;
  expect(geometry.find((key) => key.t === 45).s).not.toEqual(
    geometry.find((key) => key.t === 180).s,
  );
  expect(geometry.find((key) => key.t === 315).s).not.toEqual(
    geometry.find((key) => key.t === 435).s,
  );
  const tape = data.layers.find((layer) => layer.nm === "11tape.webp");
  expect(tape.ks.p.k.find((key) => key.t === 255).s).toEqual(
    tape.ks.p.k.find((key) => key.t === 315).s,
  );
  expect(tape.ks.p.k.find((key) => key.t === 435).s).not.toEqual(
    tape.ks.p.k.find((key) => key.t === 315).s,
  );
  expect(data.layers.some((layer) => layer.nm === "12cone.webp")).toBe(false);
});

test("hands retain their source proportions and the slit uses only one upper-blade snip", () => {
  const cotton = JSON.parse(fs.readFileSync(`public${cfg.paths[2]}`, "utf8"));
  for (const side of ["left", "right"]) {
    const hand = cotton.layers.find(
      (layer) => layer.nm === `02${side}hand.webp`,
    );
    const thumb = cotton.layers.find(
      (layer) => layer.nm === `02${side}thumb.webp`,
    );
    expect(hand.ks.s.k).toEqual([100, 100, 100]);
    expect(thumb.ks.s.k).toEqual([100, 100, 100]);
    const registration = hand.ks.p.k[0].s.map(
      (n, axis) => n - thumb.ks.p.k[0].s[axis],
    );
    for (let i = 0; i < hand.ks.p.k.length; i++)
      expect(
        hand.ks.p.k[i].s.map((n, axis) => n - thumb.ks.p.k[i].s[axis]),
      ).toEqual(registration);
  }
  const fold = JSON.parse(fs.readFileSync(`public${cfg.paths[3]}`, "utf8"));
  const flap = fold.layers.find((layer) => layer.nm === "03gauze_folding.webp");
  expect(flap.ks.p.a).toBe(0);
  const fixed = fold.layers.find((layer) => layer.nm === "03gauze.webp");
  expect(fixed.masksProperties[0].pt.k.v[1][0]).toBeCloseTo(
    (584 - 155) / (700 / 744),
  );
  const assembled = fold.layers.find(
    (layer) => layer.nm === "Assembled folding hand",
  );
  expect(assembled.ks.o.k.at(-1).s).toEqual([0]);
  expect(assembled.ty).toBe(2);
  expect(fold.assets.find((a) => a.id === assembled.refId).p).toBe(
    "foldinghand.webp",
  );
  expect(
    fold.layers.some((layer) => /02right(hand|thumb)/.test(layer.nm)),
  ).toBe(false);
  expect(fold.layers.some((layer) => layer.nm === "03tape.webp")).toBe(true);
  const slit = JSON.parse(fs.readFileSync(`public${cfg.paths[7]}`, "utf8"));
  const upper = slit.layers.find(
    (layer) => layer.nm === "scissorupperhand.png",
  );
  const lower = slit.layers.find(
    (layer) => layer.nm === "scissorlowerhand.webp",
  );
  expect(
    new Set(lower.ks.r.k.filter((key) => key.t >= 390).map((key) => key.s[0]))
      .size,
  ).toBe(1);
  const at = (t) => upper.ks.r.k.find((key) => key.t === t).s[0];
  expect(at(450)).toBe(at(510));
  expect(at(480)).toBe(at(450) - 4);
  const cut = slit.layers.find((layer) => layer.nm === "Single radial slit");
  expect(cut.ip).toBe(480);
  expect(cut.shapes[0].it.some((shape) => shape.ty === "tm")).toBe(false);
});

test("the pencil graphite and the growing ellipse share a continuous path", () => {
  const data = JSON.parse(fs.readFileSync(`public${cfg.paths[6]}`, "utf8"));
  const circle = data.layers.find((layer) => layer.nm === "Pencil circle");
  const points = circle.shapes[0].it[0].ks.k.v;
  const trim = circle.shapes[0].it.find((shape) => shape.ty === "tm").e.k;
  const pencil = data.layers.find((layer) => layer.nm === "06pencil.webp");
  expect(pencil.ks.p.k.find((key) => key.t === 105).s[0]).toBeGreaterThan(
    pencil.ks.p.k.find((key) => key.t === 30).s[0],
  );
  expect(pencil.ks.p.k.find((key) => key.t === 195).s[0]).toBeLessThan(
    pencil.ks.p.k.find((key) => key.t === 135).s[0],
  );
  let total = 0;
  const lengths = points.slice(1).map((point, i) => {
    const length = Math.hypot(point[0] - points[i][0], point[1] - points[i][1]);
    total += length;
    return length;
  });
  for (const t of [75, 105, 135, 150, 180]) {
    let distance = (total * trim.find((key) => key.t === t).s[0]) / 100;
    let index = 0;
    while (index < lengths.length - 1 && distance > lengths[index])
      distance -= lengths[index++];
    const fraction = distance / lengths[index];
    const tip = points[index].map(
      (n, axis) => n + (points[index + 1][axis] - n) * fraction,
    );
    const graphite = pencil.ks.p.k.find((key) => key.t === t).s;
    expect(Math.hypot(tip[0] - graphite[0], tip[1] - graphite[1])).toBeLessThan(
      0.2,
    );
  }
});
