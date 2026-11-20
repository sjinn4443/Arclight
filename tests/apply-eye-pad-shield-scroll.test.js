/** @jest-environment node */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import {
  APPLY_EYE_PAD_SHIELD_SCROLL_CONFIG as cfg,
  APPLY_EYE_PAD_SHIELD_STAGES as stages,
  APPLY_EYE_PAD_SHIELD_NARRATION_CUES as cues,
  APPLY_EYE_PAD_SHIELD_TIMING as timing,
} from "../public/js/applyEyePadShieldScroll.js";
import { frameAtNarrationTime } from "../public/js/examinationScrollTiming.js";

test("all Lottie textures resolve and motion and narration end at the same frame", () => {
  for (const [i, url] of cfg.paths.entries()) {
    const file = path.join("public", url),
      data = JSON.parse(fs.readFileSync(file));
    expect([data.w, data.h]).toEqual([1169, 1280]);
    expect(data.op).toBe(Math.round(stages[i].seconds * data.fr));
    expect(
      frameAtNarrationTime(timing.stages[i], cfg.narrationClipsByFile[i].end),
    ).toBe(cfg.completionHoldFrameByFile[i]);
    for (const a of data.assets.filter((asset) => asset.p)) {
      expect(a.u.startsWith("/")).toBe(false);
      expect(
        fs.statSync(path.join(path.dirname(file), a.u, a.p)).size,
      ).toBeGreaterThan(0);
    }
    for (const l of data.layers)
      if (l.refId) expect(data.assets.some((a) => a.id === l.refId)).toBe(true);
  }
});

test("delivered bilingual audio hashes, scripts and VTT retain the eight teaching cues", () => {
  const dir = "public/narration/apply-eye-pad-shield/full-animation";
  const script = JSON.parse(fs.readFileSync(`${dir}/script.json`));
  const manifest = JSON.parse(fs.readFileSync(`${dir}/manifest.json`));
  expect(script.durationSeconds).toBe(cfg.narrationClipsByFile.at(-1).end);
  for (const lang of ["en", "ko"]) {
    const bytes = fs.readFileSync(`${dir}/${lang}.m4a`);
    expect(crypto.createHash("sha256").update(bytes).digest("hex")).toBe(
      manifest.tracks[lang].sha256,
    );
    const vtt = fs.readFileSync(`${dir}/${lang}.vtt`, "utf8");
    expect((vtt.match(/-->/g) || []).length).toBe(8);
    cues.forEach((stage, i) => {
      expect(vtt).toContain(stage[lang]);
      expect(script.cues[i][lang]).toBe(stage[lang]);
    });
  }
});

test("the patient and equipment retain their recorded original sources", () => {
  const source = JSON.parse(
    fs.readFileSync("scripts/assets/apply-eye-pad-shield/source.json"),
  );
  const provenance = JSON.parse(
    fs.readFileSync(
      "public/scrolly/eyeprocedures/apply-eye-pad-shield/provenance.json",
    ),
  );
  expect(
    crypto
      .createHash("sha256")
      .update(fs.readFileSync(source.source))
      .digest("hex"),
  ).toBe(source.sha256);
  expect(provenance.sourcePdfNodes).toEqual(source.paintNodes);
  const svg = fs.readFileSync(
    "scripts/assets/apply-eye-pad-shield/patient-source.svg",
    "utf8",
  );
  expect(
    [...svg.matchAll(/data-source-node="(\d+)"/g)].map((m) => Number(m[1])),
  ).toEqual(source.paintNodes);
  for (const [file, hash] of Object.entries(provenance.sourceHashes))
    expect(
      crypto
        .createHash("sha256")
        .update(fs.readFileSync(path.join("public", file)))
        .digest("hex"),
    ).toBe(hash);
  for (const index of [1, 2, 5, 6]) {
    const data = JSON.parse(
      fs.readFileSync(path.join("public", cfg.paths[index])),
    );
    expect(
      data.layers.some((l) => l.nm === "Original Front of Eye patient"),
    ).toBe(true);
  }
});

test("image masks have a renderable shape and are completed by the Lottie data manager", () => {
  for (const url of cfg.paths) {
    const data = JSON.parse(fs.readFileSync(path.join("public", url)));
    const layers = [
      ...data.layers,
      ...data.assets.flatMap((asset) => asset.layers || []),
    ];
    for (const layer of layers.filter((l) => l.masksProperties)) {
      expect(layer.hasMask).toBe(true);
      for (const mask of layer.masksProperties) {
        const shapes = mask.pt.a
          ? mask.pt.k.flatMap((k) => [...(k.s || []), ...(k.e || [])])
          : [mask.pt.k];
        expect(shapes.length).toBeGreaterThan(0);
        for (const curve of shapes) {
          expect(curve.c).toBe(true);
          expect(curve.v.length).toBeGreaterThan(2);
          expect(curve.i.length).toBe(curve.v.length);
          expect(curve.o.length).toBe(curve.v.length);
        }
        if (mask.pt.a) expect(mask.pt.k.length).toBeGreaterThan(1);
      }
    }
  }
});

test("placement and securing share one scene without changing the original audio cues", () => {
  expect(cfg.paths).toHaveLength(7);
  expect(cfg.narrationClipsByFile[5]).toMatchObject({
    start: cfg.narrationClipsByFile[5].start,
    end: cfg.narrationClipsByFile[5].end,
    cueIds: ["apply-6", "apply-7"],
  });
  expect(stages[5].seconds).toBeCloseTo(14.89);
  expect(cfg.sections.map((section) => section.startIndex)).toEqual([0, 4, 6]);
  expect(cfg.narrationCompletionPauseSeconds).toBe(0.7);
  expect(
    fs.existsSync(
      "public/scrolly/eyeprocedures/apply-eye-pad-shield/8/data.json",
    ),
  ).toBe(false);
});

test("tape sits above the dressing, nose remains in front, and placement needs no hands", () => {
  const read = (i) =>
    JSON.parse(fs.readFileSync(path.join("public", cfg.paths[i])));
  expect(read(2).assets.some((asset) => /hand/i.test(asset.p || ""))).toBe(
    false,
  );
  for (const index of [4, 5, 6]) {
    const scene = read(index),
      layers = scene.layers;
    expect(scene.assets.some((a) => /hand/i.test(a.p || ""))).toBe(false);
    const padIndex = layers.findIndex((l) =>
      /gauze eye pad|pad approaches|pad, stationary/.test(l.nm),
    );
    const tapes = layers.filter((l) => /Tape fades|Tape on top/.test(l.nm));
    expect(tapes).toHaveLength(3);
    for (const tape of tapes)
      expect(layers.indexOf(tape)).toBeLessThan(padIndex);
    if (index >= 5) {
      const noseIndex = layers.findIndex(
        (l) => l.nm === "Original nose in front of the dressing",
      );
      for (const tape of tapes)
        expect(noseIndex).toBeLessThan(layers.indexOf(tape));
      expect(scene.assets.some((a) => a.p === "patient-nose.webp")).toBe(true);
    }
  }
  const scene = read(5),
    eye = scene.layers.find((l) => l.nm === "Original left eye");
  expect(
    scene.layers.filter((l) =>
      l.nm.startsWith("Additional diagonal securing tape"),
    ),
  ).toHaveLength(2);
  for (const tape of scene.layers.filter((l) =>
    l.nm.startsWith("Tape on top of pad"),
  )) {
    expect(tape.masksProperties).toBeUndefined();
    expect(tape.ks.s.a).toBe(0);
  }
  const cotton = read(2).layers.find(
    (l) => l.nm === "Original cotton gently cleans the eye area",
  );
  expect(cotton.ks.p.k[0].s[0]).toBeLessThan(0);
  expect(
    read(2).layers.findIndex(
      (l) => l.nm === "Original nose in front of the dressing",
    ),
  ).toBeLessThan(read(2).layers.findIndex((l) => l.nm === cotton.nm));
  expect(eye.ks.o.k.at(-1).t).toBeLessThan(90);
  expect(eye.ks.o.k.at(-1).s).toEqual([0]);
  const shieldLayers = read(6).layers;
  const shieldIndex = shieldLayers.findIndex(
    (l) => l.nm === "Original finished cone shield",
  );
  for (const tape of shieldLayers.filter((l) =>
    l.nm.startsWith("Tape above the shield"),
  ))
    expect(shieldLayers.indexOf(tape)).toBeLessThan(shieldIndex);
});

test("each measured strip unwinds from the original roll before it is cut", () => {
  const scene = JSON.parse(fs.readFileSync(path.join("public", cfg.paths[3])));
  expect(scene.assets.some((a) => a.p === "roll-face.webp")).toBe(true);
  const feed = scene.layers.find(
    (l) => l.nm === "Continuous tape pulled from the round roll",
  );
  expect(feed).toBeDefined();
  for (let n = 1; n <= 3; n++) {
    const cut = scene.layers.find(
      (l) => l.nm === `Cut strip separates only after snip ${n}`,
    );
    const marker = scene.markers.find(
      (m) => m.cm === `Unroll then snip strip ${n}`,
    );
    const snip = marker.tm + marker.dr;
    const visibleAt = cut.ks.o.k.find((key) => key.s[0] === 100).t;
    expect(visibleAt).toBe(snip + 1);
    expect(cut.ks.p.k.at(-2).t).toBe(snip + 1);
    const height = (t) => {
      const v = feed.masksProperties[0].pt.k.find((key) => key.t === t).s[0].v;
      return Math.max(...v.map((p) => p[1])) - Math.min(...v.map((p) => p[1]));
    };
    expect(height(snip) - height(snip + 1)).toBeGreaterThan(150);
  }
});

test("roll axis stays fixed and scissors make one visit with the feed between their blades", () => {
  const scene = JSON.parse(fs.readFileSync(path.join("public", cfg.paths[3])));
  const projection = scene.layers.find(
    (l) => l.nm === "Fixed-axis roll face projection",
  );
  expect(projection.ks.r).toEqual({ a: 0, k: 0 });
  expect(projection.ks.s.a).toBe(0);
  const disc = scene.assets.find((a) => a.id === projection.refId);
  expect(disc.layers[0].ks.r.a).toBe(1);
  const upper = scene.layers.find((l) => l.nm === "Complete scissors upper"),
    lower = scene.layers.find((l) => l.nm === "Complete scissors lower");
  const feed = scene.layers.find(
    (l) => l.nm === "Continuous tape pulled from the round roll",
  );
  expect(scene.layers.indexOf(upper)).toBeLessThan(scene.layers.indexOf(feed));
  expect(scene.layers.indexOf(lower)).toBeGreaterThan(
    scene.layers.indexOf(feed),
  );
  expect(upper.ks.p.k.map((key) => key.t)).toEqual([0, 53, 290, 330]);
  expect(upper.ks.p.k).toEqual(lower.ks.p.k);
  expect(upper.ks.a.k).toEqual(lower.ks.a.k);
});

test("the round shield footprint fully covers the round gauze footprint", async () => {
  const scene = JSON.parse(fs.readFileSync(path.join("public", cfg.paths[6])));
  const decode = async (name) => {
    const layer = scene.layers.find((l) => l.nm === name),
      asset = scene.assets.find((a) => a.id === layer.refId);
    const file = path.join(
      path.dirname(path.join("public", cfg.paths[6])),
      asset.u,
      asset.p,
    );
    return {
      layer,
      ...(await sharp(file)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true })),
    };
  };
  const pad = await decode("Original woven pad, stationary on the eye"),
    shield = await decode("Original finished cone shield");
  const trimmed = await sharp(pad.data, { raw: pad.info })
    .trim()
    .toBuffer({ resolveWithObject: true });
  expect(trimmed.info.width / trimmed.info.height).toBeLessThan(1.12);
  const ps = pad.layer.ks.s.k[0] / 100,
    ss = shield.layer.ks.s.k[0] / 100;
  const center = shield.layer.ks.p.k.at(-1).s,
    angle = (-shield.layer.ks.r.k * Math.PI) / 180;
  let inside = 0,
    total = 0;
  for (let y = 0; y < pad.info.height; y += 2)
    for (let x = 0; x < pad.info.width; x += 2) {
      if (pad.data[(y * pad.info.width + x) * 4 + 3] < 240) continue;
      const wx =
        pad.layer.ks.p.k[0] + (x - pad.layer.ks.a.k[0]) * ps - center[0];
      const wy =
        pad.layer.ks.p.k[1] + (y - pad.layer.ks.a.k[1]) * ps - center[1];
      const sx = Math.round(
        (wx * Math.cos(angle) - wy * Math.sin(angle)) / ss +
          shield.layer.ks.a.k[0],
      );
      const sy = Math.round(
        (wx * Math.sin(angle) + wy * Math.cos(angle)) / ss +
          shield.layer.ks.a.k[1],
      );
      total++;
      if (
        sx >= 0 &&
        sy >= 0 &&
        sx < shield.info.width &&
        sy < shield.info.height &&
        shield.data[(sy * shield.info.width + sx) * 4 + 3] > 240
      )
        inside++;
    }
  expect(inside / total).toBeGreaterThan(0.995);
});

test("delivered tape contours curve over the surfaces and both ends are pinked", async () => {
  const dir = "public/scrolly/eyeprocedures/apply-eye-pad-shield/images";
  for (const name of [
    "prepared-tape-1",
    "prepared-tape-2",
    "prepared-tape-3",
    "face-tape-1",
    "face-tape-2",
    "face-tape-3",
    "shield-tape-1",
    "shield-outer-tape",
  ]) {
    const { data, info } = await sharp(`${dir}/${name}.webp`)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const opaque = (x, y) => data[(y * info.width + x) * 4 + 3] > 230;
    const centers = [];
    for (let y = 25; y < info.height - 25; y += Math.floor(info.height / 14)) {
      const xs = Array.from({ length: info.width }, (_, x) => x).filter((x) =>
        opaque(x, y),
      );
      if (xs.length)
        centers.push([xs.reduce((a, b) => a + b, 0) / xs.length, y]);
    }
    const first = centers[0],
      last = centers.at(-1);
    const deviation = Math.max(
      ...centers.map(([x, y]) =>
        Math.abs(
          x -
            first[0] -
            ((last[0] - first[0]) * (y - first[1])) / (last[1] - first[1]),
        ),
      ),
    );
    expect(deviation).toBeGreaterThan(4);
    if (name === "prepared-tape-2") {
      const rows = [];
      for (let y = 0; y < info.height; y++)
        if (
          Array.from({ length: info.width }, (_, x) => x).some((x) =>
            opaque(x, y),
          )
        )
          rows.push(y);
      for (const y of [rows[0] + 4, rows.at(-1) - 4]) {
        let runs = 0,
          previous = false;
        for (let x = 0; x < info.width; x++) {
          const current = opaque(x, y);
          if (current && !previous) runs++;
          previous = current;
        }
        expect(runs).toBeGreaterThanOrEqual(3);
      }
    }
  }
});

test("both original metal blades cover the tape at the moment of each snip", async () => {
  const scene = JSON.parse(fs.readFileSync(path.join("public", cfg.paths[3])));
  for (const file of ["cutting-upper.webp", "cutting-lower.webp"]) {
    const asset = scene.assets.find((a) => a.p === file),
      layer = scene.layers.find((l) => l.refId === asset.id);
    const { data, info } = await sharp(
      path.join(
        "public/scrolly/eyeprocedures/apply-eye-pad-shield/images",
        file,
      ),
    )
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    for (const time of [75, 175, 275]) {
      const pivot = layer.ks.p.k.filter((key) => key.t <= time).at(-1).s;
      const value = (prop) =>
        prop.a ? prop.k.find((k) => k.t === time).s : prop.k;
      const angle =
        (-(Array.isArray(value(layer.ks.r))
          ? value(layer.ks.r)[0]
          : value(layer.ks.r)) *
          Math.PI) /
        180;
      // Locate the actual cut edge on the first frame after separation.
      const feed = scene.layers.find(
        (l) => l.nm === "Continuous tape pulled from the round roll",
      );
      const cap = feed.masksProperties[0].pt.k.find((k) => k.t === time + 1)
        .s[0].v;
      const coord = (axis) =>
        (cap[64][axis] + cap[76][axis]) / 2 +
        feed.ks.p.k[axis] -
        feed.ks.a.k[axis];
      const scale = layer.ks.s.k[0] / 100,
        wx = coord(0) - pivot[0],
        wy = coord(1) - pivot[1];
      const x = Math.round(
        (wx * Math.cos(angle) - wy * Math.sin(angle)) / scale + layer.ks.a.k[0],
      );
      const y = Math.round(
        (wx * Math.sin(angle) + wy * Math.cos(angle)) / scale + layer.ks.a.k[1],
      );
      expect(x).toBeGreaterThanOrEqual(0);
      expect(y).toBeGreaterThanOrEqual(0);
      const rgba = data.subarray(
        (y * info.width + x) * 4,
        (y * info.width + x) * 4 + 4,
      );
      expect(rgba[3]).toBeGreaterThan(230);
      expect(Math.min(...rgba.subarray(0, 3))).toBeGreaterThan(150);
      expect(
        Math.max(...rgba.subarray(0, 3)) - Math.min(...rgba.subarray(0, 3)),
      ).toBeLessThan(35);
    }
  }
});

test("nose occlusion follows the original ink below the brows", async () => {
  const dir = "public/scrolly/eyeprocedures/apply-eye-pad-shield/images";
  const nose = await sharp(path.join(dir, "patient-nose.webp"))
    .ensureAlpha()
    .raw()
    .toBuffer();
  const original = await sharp(path.join(dir, "patient-base.webp"))
    .ensureAlpha()
    .raw()
    .toBuffer();
  // Original PDF coordinates are rasterised at eight pixels per unit.
  const pixel = (x, y) => ((y - 118) * 8 * 1200 + (x - 285) * 8) * 4;
  for (let y = 158; y <= 169; y++) {
    for (let x = 319; x <= 364; x++) expect(nose[pixel(x, y) + 3]).toBe(0);
  }
  const bridge = pixel(336, 178);
  expect(nose.subarray(bridge, bridge + 4)).toEqual(
    original.subarray(bridge, bridge + 4),
  );
  expect(nose[pixel(340, 184) + 3]).toBe(255);
  expect(nose[pixel(326, 184) + 3]).toBe(0);
});

test("shield approaches an already secured pad and receives tape on both sides", () => {
  const scene = JSON.parse(fs.readFileSync(path.join("public", cfg.paths[6])));
  const cone = scene.layers.find(
    (l) => l.nm === "Original finished cone shield",
  );
  expect(cone.ks.p.k[0].t).toBe(0);
  const arrival = cone.ks.p.k.at(-1).t;
  const existing = scene.layers.filter((l) =>
    /^(Additional diagonal securing tape|Tape on top of pad)/.test(l.nm),
  );
  expect(existing).toHaveLength(5);
  for (const tape of existing) expect(tape.ks.o).toEqual({ a: 0, k: 100 });
  const inner = scene.layers.find((l) => l.nm === "Tape above the shield 1");
  const outer = scene.layers.find((l) => l.nm === "Far rim securing tape");
  expect(outer.ks.p.k[0]).toBeGreaterThan(inner.ks.p.k[0]);
  expect(scene.layers.indexOf(outer)).toBeGreaterThan(
    scene.layers.indexOf(cone),
  );
  expect(scene.layers.indexOf(inner)).toBeLessThan(scene.layers.indexOf(cone));
  for (const strip of [inner, outer])
    expect(strip.ks.o.k[1].t).toBeGreaterThan(arrival);
});

test("the inset and the close-up bend the full strips as the pad touches the face", () => {
  const read = (i) =>
    JSON.parse(fs.readFileSync(path.join("public", cfg.paths[i])));
  const bubble = read(1).assets.find((a) => a.id === "procedure-inset");
  for (const [scene, arrival] of [
    [bubble, 120],
    [read(5), 180],
  ]) {
    for (let i = 1; i <= 3; i++) {
      const travelling = scene.layers.find(
        (l) => l.nm === "Straight tape settling onto the face " + i,
      );
      const landed = scene.layers.find(
        (l) => l.nm === "Tape on top of pad " + i,
      );
      const [flat, draped] = travelling.shapes[0].it[0].ks.k;
      expect(flat.t).toBeLessThan(arrival);
      expect(draped.t).toBeGreaterThan(arrival);
      expect(travelling.op).toBe(landed.ip);
      expect(landed.ip).toBe(draped.t);
      // The first 65 vertices trace the long edge from forehead to cheek.
      const bow = (key) => {
        const v = key.s[0].v;
        return Math.abs(v[32][0] - (v[0][0] + v[64][0]) / 2);
      };
      expect(bow(flat)).toBeLessThan(0.01);
      expect(bow(draped)).toBeGreaterThan(5);
    }
  }
});

test("opening the scissors separates the finger loops as well as the tips", () => {
  const scene = JSON.parse(fs.readFileSync(path.join("public", cfg.paths[3])));
  const halves = ["upper", "lower"].map((side) =>
    scene.layers.find((l) => l.nm === "Complete scissors " + side),
  );
  const distanceAt = (frame, points) => {
    const moved = halves.map((half, i) => {
      const angle =
        (half.ks.r.k.find((k) => k.t === frame).s[0] * Math.PI) / 180;
      const x = points[i][0] - half.ks.a.k[0],
        y = points[i][1] - half.ks.a.k[1];
      return [
        x * Math.cos(angle) - y * Math.sin(angle),
        x * Math.sin(angle) + y * Math.cos(angle),
      ];
    });
    return Math.hypot(moved[0][0] - moved[1][0], moved[0][1] - moved[1][1]);
  };
  for (const points of [
    [
      [224, 103],
      [74, 103],
    ],
    [
      [149, 494],
      [149, 494],
    ],
  ])
    for (const [open, cut] of [
      [53, 75],
      [153, 175],
      [253, 275],
    ])
      expect(distanceAt(open, points)).toBeGreaterThan(
        distanceAt(cut, points) + 45,
      );
});

test("the seated shield itself covers the treated brow and lateral orbital outline", async () => {
  const scene = JSON.parse(fs.readFileSync(path.join("public", cfg.paths[6])));
  const read = async (name) => {
    const layer = scene.layers.find((l) => l.nm === name);
    const asset = scene.assets.find((a) => a.id === layer.refId);
    const file = path.join(
      path.dirname(path.join("public", cfg.paths[6])),
      asset.u,
      asset.p,
    );
    const { data, info } = await sharp(file)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const scale = layer.ks.s.k[0] / 100;
    const pos = layer.ks.p.a ? layer.ks.p.k.at(-1).s : layer.ks.p.k;
    return (x, y) => {
      const u = Math.round((x - pos[0]) / scale + layer.ks.a.k[0]),
        v = Math.round((y - pos[1]) / scale + layer.ks.a.k[1]);
      if (u < 0 || u >= info.width || v < 0 || v >= info.height)
        return [0, 0, 0, 0];
      const offset = 4 * (v * info.width + u);
      return data.subarray(offset, offset + 4);
    };
  };
  const face = await read("Original Front of Eye patient"),
    cone = await read("Original finished cone shield");
  let browSamples = 0;
  for (let y = 440; y <= 692; y += 2) {
    let outlineFound = false;
    for (let x = 240; x <= 454; x += 2) {
      const [r, g, b, a] = face(x, y);
      if (a < 240) continue;
      if (!outlineFound && y >= 470) {
        expect(cone(x, y)[3]).toBeGreaterThan(240);
        outlineFound = true;
      }
      if (r === 193 && g === 118 && b === 41) {
        expect(cone(x, y)[3]).toBeGreaterThan(240);
        browSamples++;
      }
    }
  }
  expect(browSamples).toBeGreaterThan(300);
  expect(cone(558, 580)[3]).toBe(0);
});
