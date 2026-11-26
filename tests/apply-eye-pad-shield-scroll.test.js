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

test("delivered audio hashes, scripts and VTT match all real-life teaching cues", () => {
  const dir = "public/narration/apply-eye-pad-shield/full-animation";
  const script = JSON.parse(fs.readFileSync(`${dir}/script.json`));
  const manifest = JSON.parse(fs.readFileSync(`${dir}/manifest.json`));
  const { languages: pupilsLanguages } = JSON.parse(
    fs.readFileSync("public/narration/pupils-pec/full-animation/script.json"),
  );
  expect(script.durationSeconds).toBe(cfg.narrationClipsByFile.at(-1).end);
  for (const lang of Object.keys(cfg.narrationTracks)) {
    expect(manifest.tracks[lang].voice).toBe(script.languages[lang].voice);
    expect(script.languages[lang].voice).toBe(pupilsLanguages[lang].voice);
    const bytes = fs.readFileSync(`${dir}/${lang}.m4a`);
    expect(crypto.createHash("sha256").update(bytes).digest("hex")).toBe(
      manifest.tracks[lang].sha256,
    );
    const vtt = fs.readFileSync(`${dir}/${lang}.vtt`, "utf8");
    expect((vtt.match(/-->/g) || []).length).toBe(cues.length);
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
  for (const index of [1, 2, 4, 5]) {
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

const readScene = (i) =>
  JSON.parse(fs.readFileSync(path.join("public", cfg.paths[i])));
test("the six scenes follow the demonstration from equipment through the second shield tape", () => {
  expect(stages.map((s) => s.name)).toEqual([
    "Equipment",
    "Explain the procedure",
    "Tape the eyelid",
    "Prepare the pad",
    "Place and secure the pad",
    "Apply the shield",
  ]);
  expect(cfg.sections.map((s) => s.startIndex)).toEqual([0, 3, 5]);
  const prep = readScene(0),
    bubble = readScene(1).assets.find((a) => a.id === "procedure-inset");
  expect(prep.assets.filter((a) => a.p === "steri-strip.webp")).toHaveLength(5);
  expect(prep.assets.some((a) => a.id === "hand-hygiene")).toBe(false);
  expect(stages[0].cues).toHaveLength(1);
  expect(stages[0].cues[0].start).toBe(0);
  expect(stages[0].cues[0].en).toMatch(/^You will need/);
  const lids = readScene(2).layers.filter((layer) =>
    /^Closed .* eyelid$/.test(layer.nm),
  );
  expect(lids).toHaveLength(2);
  expect(lids[0].ks.s.k[0]).toBe(-lids[1].ks.s.k[0]);
  expect(lids[0].ks.s.k[1]).toBe(lids[1].ks.s.k[1]);
  for (const lid of lids) {
    const image = readScene(2).assets.find((a) => a.id === lid.refId);
    expect(image.p).toBe("patient-closed-lid.webp");
  }
  expect(stages[0].cues.at(-1).en).toContain("Steri-Strips");
  expect(stages[1].cues.map((c) => c.id)).toEqual(["apply-4"]);
  for (const lid of lids) expect(lid.ks.o.k.at(-1).s).toEqual([100]);
  for (const scene of [bubble, readScene(2)]) {
    const strips = scene.layers
      .filter((l) => l.nm.startsWith("Eyelid Steri-Strip"))
      .reverse();
    expect(strips).toHaveLength(3);
    for (const [i, strip] of strips.entries()) {
      const end = strip.masksProperties[0].pt.k.at(-1).t;
      expect(end - strip.ip).toBeGreaterThanOrEqual(25);
      if (i < 2) expect(end).toBeLessThanOrEqual(strips[i + 1].ip);
    }
  }
  const pad = bubble.layers.find(
    (l) => l.nm === "Pad placement demonstrated inside bubble",
  );
  expect(pad.ks.p.k.at(-2).t).toBe(
    bubble.layers
      .find((l) => l.nm === "Eyelid Steri-Strip 3")
      .masksProperties[0].pt.k.at(-1).t,
  );
  expect(pad.ks.p.k.at(-1).t - pad.ks.p.k.at(-2).t).toBe(90);
  const insetShield = bubble.layers.find(
    (l) => l.nm === "Original finished cone shield",
  );
  const insetRig = bubble.layers.find((l) => l.ind === insetShield.parent);
  expect(insetRig.ks.p.k.at(-2).t).toBeGreaterThan(pad.ks.p.k.at(-1).t);
  expect(
    bubble.layers.some((l) => l.nm === "Near tape across the shield"),
  ).toBe(true);
  expect(bubble.layers.some((l) => l.nm === "Far tape behind the shield")).toBe(
    false,
  );
  expect(bubble.layers.some((l) => l.nm.startsWith("Folded pad"))).toBe(false);
  const table = readScene(3);
  expect(
    table.layers.filter((l) => l.nm === "Tape across the gauze"),
  ).toHaveLength(1);
  for (const url of cfg.paths)
    expect(fs.readFileSync(path.join("public", url), "utf8")).not.toContain(
      "Cut strip separates",
    );
  for (const i of [4, 5]) {
    const scene = readScene(i);
    const position = (text) =>
      scene.layers.findIndex((l) => l.nm.startsWith(text));
    expect(position("Folded pad")).toBe(-1);
    expect(position("Tape on top of pad")).toBeLessThan(
      position("Eyelid Steri-Strip"),
    );
    expect(position("Original nose in front")).toBeLessThan(
      position("Tape on top of pad"),
    );
  }
});

test("the smaller shield covers the pad centre with only a narrow gauze edge exposed", async () => {
  const scene = JSON.parse(fs.readFileSync(path.join("public", cfg.paths[5])));
  const decode = async (name) => {
    const layer = scene.layers.find((l) => l.nm === name),
      asset = scene.assets.find((a) => a.id === layer.refId);
    const file = path.join(
      path.dirname(path.join("public", cfg.paths[5])),
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
  const center = shield.layer.ks.p.k,
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
  expect(inside / total).toBeGreaterThan(0.97);
});

test("delivered tape contours curve over the surfaces and both ends are pinked", async () => {
  const dir = "public/scrolly/eyeprocedures/apply-eye-pad-shield/images";
  for (const name of [
    "prepared-tape-2",
    "face-tape-2",
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

test("the far tape travels behind the cone and the second tape crosses its visible face", () => {
  const scene = readScene(5);
  const named = (name) => scene.layers.find((l) => l.nm === name);
  const cone = named("Original finished cone shield");
  const first = named("Near tape across the shield");
  const second = named("Far tape behind the shield");
  const rig = named("Shield and first strip travel together");
  for (const part of [
    cone,
    first,
    named("Unpressed end of shield-tape-1"),
    named("Lifted tape shadow shield-tape-1"),
  ])
    expect(part.parent).toBe(rig.ind);
  expect(first.masksProperties[0].pt.k.at(-1).t).toBeLessThan(
    rig.ks.p.k.at(-2).t,
  );
  expect(second.ip).toBeGreaterThan(rig.ks.p.k.at(-1).t);
  expect(scene.layers.indexOf(first)).toBeLessThan(scene.layers.indexOf(cone));
  expect(scene.layers.indexOf(second)).toBeGreaterThan(
    scene.layers.indexOf(cone),
  );
});

test("shield tape stays clear of the nose with a strip on each side of the cone tip", async () => {
  const scene = readScene(5);
  const alpha = async (name) => {
    const layer = scene.layers.find((l) => l.nm === name);
    const asset = scene.assets.find((a) => a.id === layer.refId);
    const file = path.join(
      "public",
      path.dirname(cfg.paths[5]),
      asset.u,
      asset.p,
    );
    const { data, info } = await sharp(file)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    return (x, y) => {
      const u = Math.round(
        ((x - layer.ks.p.k[0]) * 100) / layer.ks.s.k[0] + layer.ks.a.k[0],
      );
      const v = Math.round(
        ((y - layer.ks.p.k[1]) * 100) / layer.ks.s.k[1] + layer.ks.a.k[1],
      );
      return u >= 0 && u < info.width && v >= 0 && v < info.height
        ? data[(v * info.width + u) * 4 + 3]
        : 0;
    };
  };
  const [nose, cone, outer, inner] = await Promise.all(
    [
      "Original nose in front of the dressing",
      "Original finished cone shield",
      "Far tape behind the shield",
      "Near tape across the shield",
    ].map(alpha),
  );
  const xs = Array.from({ length: 245 }, (_, i) => i + 260);
  const farCenter = xs.filter((x) => outer(x, 592) > 200);
  expect(farCenter.length).toBeGreaterThan(0);
  expect(farCenter.every((x) => cone(x, 592) > 200)).toBe(true);
  expect(
    xs.some(
      (x) => x > farCenter.at(-1) && inner(x, 592) > 200 && cone(x, 592) > 200,
    ),
  ).toBe(true);
  const rig = scene.layers.find(
    (l) => l.nm === "Dressing aligned with the cheek",
  );
  const angle = (rig.ks.r.k * Math.PI) / 180;
  const noseOnFace = (x, y) => {
    const dx = x - rig.ks.a.k[0],
      dy = y - rig.ks.a.k[1];
    return nose(
      rig.ks.p.k[0] + dx * Math.cos(angle) - dy * Math.sin(angle),
      rig.ks.p.k[1] + dx * Math.sin(angle) + dy * Math.cos(angle),
    );
  };
  let overlap = 0;
  for (let y = 430; y <= 760; y++)
    for (const x of xs)
      if (
        noseOnFace(x, y) > 128 &&
        (cone(x, y) > 128 || inner(x, y) > 128 || outer(x, y) > 128)
      )
        overlap++;
  expect(overlap).toBe(0);
});

test("the inset and the close-up bend the full strips as the pad touches the face", () => {
  const read = (i) =>
    JSON.parse(fs.readFileSync(path.join("public", cfg.paths[i])));
  const bubble = read(1).assets.find((a) => a.id === "procedure-inset");
  for (const [scene, arrival] of [
    [bubble, 189],
    [read(4), 100],
  ]) {
    const travelling = scene.layers.find(
      (l) => l.nm === "Straight tape settling onto the face 2",
    );
    const landed = scene.layers.find((l) => l.nm === "Tape on top of pad 2");
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
});

test("the final shield and its shadow are scaled together over the treated eye", () => {
  const scene = JSON.parse(fs.readFileSync(path.join("public", cfg.paths[5])));
  const cone = scene.layers.find(
    (l) => l.nm === "Original finished cone shield",
  );
  const shadow = scene.layers.find((l) => l.nm === "Shield contact shadow");
  expect(shadow.ks.s).toEqual(cone.ks.s);
  const asset = scene.assets.find((a) => a.id === cone.refId);
  expect((asset.w * cone.ks.s.k[0]) / 100).toBeCloseTo(262.2);
});
