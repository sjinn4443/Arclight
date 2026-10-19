/** @jest-environment node */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
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
    expect(lower.ks.a.k).toEqual([115, 217, 0]);
    expect(lower.masksProperties[0].mode).toBe("a");
    const visible = (x, y) => {
      const points = lower.masksProperties[0].pt.k.v;
      let inside = false;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [a, b] = points[i],
          [c, d] = points[j];
        if (b > y !== d > y && x < ((c - a) * (y - b)) / (d - b) + a)
          inside = !inside;
      }
      return inside;
    };
    expect(visible(95, 380)).toBe(false); // exposed fingertip
    expect(visible(245, 470)).toBe(false); // straight extended finger
    expect(visible(162, 235)).toBe(false); // metal spur
    expect(visible(125, 500)).toBe(true); // lower handle
    expect(visible(300, 700)).toBe(true); // palm
    {
      expect(lower.ks.s.k[0] / upper.ks.s.k[0]).toBeCloseTo(
        stage === 5 ? 1.28 : 1.22,
      );
      expect(
        data.layers.some((layer) => layer.nm === "Scissor finger extension"),
      ).toBe(false);
    }
    for (const key of lower.ks.r.k.filter((key) => key.t <= 240)) {
      const upperAngle = upper.ks.r.k.find((k) => k.t === key.t).s[0];
      expect(key.s[0] - upperAngle).toBeGreaterThanOrEqual(-8.00001);
      expect(key.s[0] - upperAngle).toBeLessThanOrEqual(8.00001);
    }
    expect(
      Math.min(
        ...lower.ks.r.k
          .filter((key) => key.t <= 240)
          .map(
            (key) => key.s[0] - upper.ks.r.k.find((k) => k.t === key.t).s[0],
          ),
      ),
    ).toBeCloseTo(-8);
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
  const paperCamera = geometry.find((key) => key.t === 315);
  const tapeCamera = tape.ks.p.k.find((key) => key.t === 315);
  expect(paperCamera.i).toEqual({ x: tapeCamera.i.x[0], y: tapeCamera.i.y[0] });
  expect(paperCamera.o).toEqual({ x: tapeCamera.o.x[0], y: tapeCamera.o.y[0] });
  expect(data.layers.some((layer) => layer.nm === "12cone.webp")).toBe(false);
  // The overhead roll gains only ten pixels of relief; the camera moves later.
  const apex = (t) => geometry.find((key) => key.t === t).s[0].v[0];
  expect(apex(45)[0]).toBe(apex(180)[0]);
  expect(apex(45)[1] - apex(180)[1]).toBeCloseTo(10);
  expect(apex(180)).toEqual(apex(315));
  expect(geometry.find((key) => key.t === 180).s).toEqual(
    geometry.find((key) => key.t === 315).s,
  );
  const facets = data.layers.filter((layer) =>
    /^Paper cone facet/.test(layer.nm),
  );
  for (const layer of data.layers.filter((layer) =>
    /^(Paper cone facet|Rolling paper flap)/.test(layer.nm),
  )) {
    expect(layer.shapes[0].it.find((shape) => shape.ty === "fl").c.k).toEqual([
      0.955, 0.955, 0.955, 1,
    ]);
  }
  const boundsAt = (t) => {
    const points = facets.flatMap(
      (layer) => layer.shapes[0].it[0].ks.k.find((key) => key.t === t).s[0].v,
    );
    return [0, 1].map(
      (axis) =>
        Math.max(...points.map((p) => p[axis])) -
        Math.min(...points.map((p) => p[axis])),
    );
  };
  const [width, height] = boundsAt(180);
  expect(width / height).toBeGreaterThan(1.15);
  expect(width / height).toBeLessThan(1.25);
  const orderedShadows = data.layers
    .filter((layer) => /^Overlap contact shadow/.test(layer.nm))
    .sort(
      (a, b) => Number(a.nm.split(" ").at(-1)) - Number(b.nm.split(" ").at(-1)),
    );
  expect(orderedShadows).toHaveLength(8);
  expect(orderedShadows[0].ks.o.k.at(-1).s[0]).toBeGreaterThan(
    orderedShadows.at(-1).ks.o.k.at(-1).s[0],
  );
  const shapeAt = (layer, t) =>
    layer.shapes[0].it[0].ks.k.find((key) => key.t === t).s[0].v;
  const first = shapeAt(orderedShadows[0], 180)[8];
  const last = shapeAt(orderedShadows.at(-1), 180)[9];
  const shadowWidth = Math.hypot(first[0] - last[0], first[1] - last[1]);
  expect(shadowWidth).toBeGreaterThan(30);
  expect(shadowWidth).toBeLessThan(40);
  const attachedTape = tape.ks.p.k.find((key) => key.t === 255).s;
  const tapeRadius = Math.hypot(
    (attachedTape[0] - 584) / 310,
    (attachedTape[1] - 600 + 4.4) / (310 * 0.84),
  );
  expect(tapeRadius).toBeCloseTo(0.56);
  for (const shadow of orderedShadows) {
    const initial = shapeAt(shadow, 45);
    expect(initial.slice(0, 9)).toEqual(initial.slice(9).reverse());
  }
  const movingEdge = data.layers.find(
    (layer) => layer.nm === "Rolling paper flap 11 ring 5",
  );
  expect(Math.abs(shapeAt(movingEdge, 45)[2][0] - 584)).toBeLessThan(1);
  expect(shapeAt(movingEdge, 180)[2][0]).toBeLessThan(400);
  const curlingEdge = shapeAt(orderedShadows[0], 105);
  const midpoint = curlingEdge[0].map(
    (n, axis) => (n + curlingEdge[8][axis]) / 2,
  );
  expect(
    Math.hypot(
      curlingEdge[4][0] - midpoint[0],
      curlingEdge[4][1] - midpoint[1],
    ),
  ).toBeLessThan(0.01);
  const curlBand = data.layers.find(
    (layer) => layer.nm === "Paper curl shading 0",
  );
  expect(curlBand.ks.o.k.find((key) => key.t === 75).s[0]).toBe(40);
  expect(curlBand.ks.o.k.at(-1).s).toEqual([0]);
  const tapeShadow = data.layers.find(
    (layer) => layer.nm === "Tape shadow — cast left",
  );
  expect(tapeShadow.ks.p).toEqual(tape.ks.p);
  expect(tapeShadow.ks.r).toEqual(tape.ks.r);
  const shadowOutline = tapeShadow.shapes[0].it[0].ks.k.v;
  expect(shadowOutline[0][0]).toBe(tape.masksProperties[0].pt.k.v[0][0] - 10);
});

test("the pad tape grazes the gauze's upper edge", async () => {
  const scene = JSON.parse(fs.readFileSync(`public${cfg.paths[3]}`, "utf8"));
  const imageData = async (layer) => {
    const asset = scene.assets.find((a) => a.id === layer.refId);
    return sharp(
      path.join(
        "public/scrolly/eyeprocedures/make-eye-pad-shield/images",
        asset.p,
      ),
    )
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
  };
  const tape = scene.layers.find((layer) => layer.nm === "03tape.webp");
  const gauze = scene.layers.find(
    (layer) => layer.nm === "03and04foldedgauze.webp",
  );
  const a = await imageData(tape),
    b = await imageData(gauze);
  const p = tape.ks.p.k.at(-1).s;
  const scale = tape.ks.s.k[0] / 100,
    gauzeScale = gauze.ks.s.k[0] / 100;
  let samples = 0;
  for (let x = 30; x < a.info.width - 30; x += 10) {
    for (let y = 0; y < a.info.height; y++) {
      const i = (y * a.info.width + x) * 4;
      if (a.data[i + 3] < 200 || a.data[i] < 180) continue;
      const world = [
        p[0] + (x - tape.ks.a.k[0]) * scale,
        p[1] + (y - tape.ks.a.k[1]) * scale,
      ];
      const gx = Math.round(
        (world[0] - gauze.ks.p.k[0]) / gauzeScale + gauze.ks.a.k[0],
      );
      const gy = Math.round(
        (world[1] + 10 - gauze.ks.p.k[1]) / gauzeScale + gauze.ks.a.k[1],
      );
      expect(b.data[(gy * b.info.width + gx) * 4 + 3]).toBeGreaterThan(200);
      samples++;
      break;
    }
  }
  expect(samples).toBeGreaterThan(5);
  const shadow = scene.layers.find(
    (layer) => layer.nm === "03and04and08and09fingershadow.webp",
  );
  expect(shadow).toBeUndefined();
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
  const strips = fold.layers.filter((layer) =>
    /^03gauze_folding/.test(layer.nm),
  );
  expect(strips).toHaveLength(28);
  for (const strip of strips) {
    expect(strip.ks.o.k.at(-1).t).toBeLessThan(141);
    expect(strip.ks.o.k.at(-1).s).toEqual([0]);
  }
  expect(
    strips.some((layer) =>
      layer.ks.sk.k.some((key) => Math.abs(key.s[0]) > 10),
    ),
  ).toBe(true);
  const padTape = fold.layers.find((layer) => layer.nm === "03tape.webp");
  const tapeAsset = fold.assets.find((asset) => asset.id === padTape.refId);
  expect((tapeAsset.w * padTape.ks.s.k[0]) / 100).toBeCloseTo(165);
  const fixed = fold.layers.find((layer) => layer.nm === "03gauze.webp");
  const folded = fold.layers.find(
    (layer) => layer.nm === "03and04foldedgauze.webp",
  );
  expect(fixed.hasMask).not.toBe(true);
  expect(folded.hasMask).not.toBe(true);
  const fixedAsset = fold.assets.find((asset) => asset.id === fixed.refId);
  expect((fixedAsset.w * fixed.ks.s.k[0]) / 100).toBeCloseTo(700);
  const toWorld = (layer, [x, y], scale) => {
    const [ax, ay] = layer.ks.a.k;
    const position = layer.ks.p.a ? layer.ks.p.k[0].s : layer.ks.p.k;
    const angle = (layer.ks.r.k * Math.PI) / 180;
    return [
      position[0] +
        (x - ax) * scale * Math.cos(angle) -
        (y - ay) * scale * Math.sin(angle),
      position[1] +
        (x - ax) * scale * Math.sin(angle) +
        (y - ay) * scale * Math.cos(angle),
    ];
  };
  // Top and bottom of the full gauze edge meet the flap, including crop inset.
  for (const [basePoint, flapPoint] of [
    [
      [744, 140],
      [22, 90],
    ],
    [
      [610, 740],
      [18, 740],
    ],
  ]) {
    const base = toWorld(fixed, basePoint, fixed.ks.s.k[0] / 100);
    const moving = toWorld(flap, flapPoint, flap.ks.s.k[0].s[0] / 100);
    expect(Math.hypot(base[0] - moving[0], base[1] - moving[1])).toBeLessThan(
      10,
    );
  }
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

test("choosing cardboard holds only the box illustration", () => {
  const data = JSON.parse(fs.readFileSync(`public${cfg.paths[5]}`, "utf8"));
  expect(data.layers.map((layer) => layer.nm)).toEqual([
    "05cardboard.webp",
    "othersbackground.webp",
  ]);
  expect(
    data.layers.every((layer) => layer.ks.p.a === 0 && layer.ks.r.a === 0),
  ).toBe(true);
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
