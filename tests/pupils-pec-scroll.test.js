/** @jest-environment node */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import {
  PUPILS_PEC_SCROLL_CONFIG as cfg,
  PUPILS_PEC_SCROLL_TIMING as timing,
  PUPILS_PEC_STAGES as stages,
  PUPILS_PEC_CANVAS_HEIGHTS as heights,
} from "../public/js/pupilsPecScroll.js";
import { frameAtNarrationTime } from "../public/js/examinationScrollTiming.js";

const folder = "public/narration/pupils-pec/full-animation";
const script = JSON.parse(fs.readFileSync(`${folder}/script.json`, "utf8"));

test("the source's two sections retain their order and six scenes have local artwork", () => {
  expect(cfg.sections).toEqual([
    { startIndex: 0, title: "Observation" },
    { startIndex: 1, title: "Direct Light Response" },
  ]);
  expect(cfg.paths).toHaveLength(6);
  for (const [index, file] of cfg.paths.entries()) {
    const data = JSON.parse(fs.readFileSync(`public${file}`, "utf8"));
    expect(data.w / data.h).toBeCloseTo(1169 / heights[index]);
    expect(data.h).toBe(1280);
    expect(data.op).toBe(stages[index].seconds * data.fr);
    expect(cfg.completionHoldFrameByFile[index]).toBe(data.op - 1);
    expect(
      frameAtNarrationTime(
        timing.stages[index],
        cfg.narrationClipsByFile[index].end,
      ),
    ).toBe(data.op - 1);
    expect(data.assets.length).toBeGreaterThan(0);
    expect(
      fs.statSync(path.join("public", path.dirname(file), "images/img_0.png"))
        .size,
    ).toBeGreaterThan(0);
    for (const asset of data.assets) {
      if (asset.layers) continue;
      expect(
        fs.statSync(path.join("public", path.dirname(file), asset.u, asset.p))
          .size,
      ).toBeGreaterThan(0);
      expect(Math.max(asset.w, asset.h)).toBeLessThanOrEqual(1500);
    }
    for (const layer of data.layers.filter((layer) => layer.refId)) {
      expect(data.assets.some((asset) => asset.id === layer.refId)).toBe(true);
    }
  }
});

test("both recorded narration tracks cover every teaching cue and match the manifest", () => {
  const manifest = JSON.parse(
    fs.readFileSync(`${folder}/manifest.json`, "utf8"),
  );
  expect(script.cues.map((cue) => cue.id)).toEqual(
    stages.flatMap((stage) => stage.cues.map((cue) => cue.id)),
  );
  expect(manifest.durationSeconds).toBe(cfg.narrationClipsByFile.at(-1).end);
  for (const language of Object.keys(cfg.narrationTracks)) {
    expect(script.cues.every((cue) => cue[language]?.length)).toBe(true);
    const bytes = fs.readFileSync(`${folder}/${language}.m4a`);
    expect(bytes.length).toBeGreaterThan(50_000);
    expect(crypto.createHash("sha256").update(bytes).digest("hex")).toBe(
      manifest.tracks[language].sha256,
    );
    expect(
      Math.abs(
        manifest.tracks[language].durationSeconds - manifest.durationSeconds,
      ),
    ).toBeLessThan(0.25);
    expect(
      fs.readFileSync(`${folder}/${language}.vtt`, "utf8").match(/-->/g),
    ).toHaveLength(
      script.cues.filter((c) => c.caption?.[language] ?? c[language]).length,
    );
  }
});

const scene = (index) =>
  JSON.parse(fs.readFileSync(`public${cfg.paths[index]}`, "utf8"));
const allLayers = (index) => {
  const data = scene(index);
  return [
    ...data.layers,
    ...data.assets.flatMap((asset) => asset.layers || []),
  ];
};
const layer = (index, name) =>
  allLayers(index).find((item) => item.nm === name);
const appearAt = (item) => item.ks.o.k.find((key) => key.s[0] > 0).t;

test("Observation is one four-panel scene without eye circles", () => {
  const panels = scene(0).layers.filter((item) =>
    /^observation-[0-3]$/.test(item.nm),
  );
  expect(panels).toHaveLength(4);
  expect(new Set(panels.map((item) => item.ks.p.k[0])).size).toBe(2);
  expect(new Set(panels.map((item) => item.ks.p.k[1])).size).toBe(2);
  expect(scene(0).layers.some((item) => item.ty === 4)).toBe(false);
  for (let panel = 0; panel < 4; panel++) {
    const symbol = layer(0, `observation-symbol-${panel}`);
    expect(appearAt(symbol)).toBeGreaterThan(scene(0).op * 0.75);
    expect(symbol.ks.o.k).toEqual(
      layer(0, `observation-label-${panel}`).ks.o.k,
    );
  }
  expect(
    stages[0].cues.every((cue) => !/drooping|eyelid position/.test(cue.en)),
  ).toBe(true);
});

test("the real finger presses and the beam brightens", () => {
  expect(layer(1, "Arclight transparent window").refId).toBe("switch-device");
  expect(layer(1, "Finger presses button").ks.r.a).toBe(1);
  const beam = layer(1, "Progressively brighter examination beam").ks.o.k;
  expect(beam[0].s).toEqual([0]);
  expect(beam.at(-1).s).toEqual([100]);
  expect(new Set(beam.map((key) => key.s[0])).size).toBeGreaterThan(3);
  expect(layer(1, "Lens light follows button brightness").ks.o.k).toEqual(beam);
});

test("all three clean positioning illustrations appear before their ordered annotations", async () => {
  for (const name of ["fixation-base", "blocked-base", "device-base"]) {
    expect(layer(2, name).ks.o.k).toBe(100);
    const { data, info } = await sharp(
      `public/scrolly/coreexam/pupils-pec/images/${name}.webp`,
    )
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    let coloured = 0;
    for (let pixel = 0; pixel < info.width * info.height; pixel++) {
      const [r, g, b, a] = data.subarray(pixel * 4, pixel * 4 + 4);
      if (
        a > 200 &&
        ((g > 220 && r < 60 && b < 50) || (r > 220 && g < 50 && b < 50))
      )
        coloured++;
    }
    expect(coloured).toBe(0);
  }
  const names = [
    "target-highlight",
    "Fixation arrow from patient to target",
    "fixation-check",
    "person-highlight",
    "blocked-cross",
    "device-highlight",
    "device-cross",
  ];
  const starts = names.map((name) => appearAt(layer(2, name)));
  expect(starts).toEqual([...starts].sort((a, b) => a - b));
  expect(starts[0]).toBeGreaterThan(0);
  const lightCue = stages[2].cues.find((cue) => cue.id === "avoid-light");
  expect(layer(2, "device-highlight").ks.o.k[1].t).toBe(lightCue.offset * 30);
  // A symbol's corner must be transparent rather than a square background patch.
  for (const name of [
    "icon-tick",
    "icon-cross",
    "icon-alert-red",
    "icon-alert-orange",
  ]) {
    const { data } = await sharp(
      `public/scrolly/coreexam/pupils-pec/images/${name}.webp`,
    )
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    expect(data[3]).toBe(0);
  }
  expect(layer(2, "Fixation arrow from patient to target").refId).toBe(
    "fixation-arrow",
  );
});

test("the wrist brings the visible window face forward without flipping to the reverse", () => {
  const assembly = layer(3, "approach-wrist-40-degree-turn clipped panel");
  expect(assembly.ks.s.k[0].s[1]).toBeCloseTo(
    Math.cos((40 * Math.PI) / 180) * 100,
  );
  expect(assembly.ks.s.k.at(-1).s[1]).toBe(100);
  const model = layer(3, "Rounded instrument turning from side to front");
  expect(model.ty).toBe(0);
  expect(model.ks.s.a).toBe(0);
  expect(model.ks.s.k[0]).toBe(model.ks.s.k[1]);
  expect(model.ks.s.k[0]).toBeCloseTo((1169 / 373 / 3) * 80);
  expect(model.h).toBe(450);
  expect(scene(3).layers).toContainEqual(model);
  expect(scene(3).assets.some((asset) => /reverse/.test(asset.id))).toBe(false);
  const sheets = allLayers(3)
    .filter((item) => /^Rounded device view sheet/.test(item.nm))
    .sort((a, b) => a.ip - b.ip);
  expect(sheets).toHaveLength(4);
  expect(sheets[0].ip).toBe(0);
  for (let i = 1; i < sheets.length; i++)
    expect(sheets[i].ip).toBe(sheets[i - 1].op);
  expect(sheets.at(-1).op).toBe(scene(3).op);
  for (const sheet of sheets) {
    expect(sheet.ks.s.a).toBe(0);
    expect(sheet.ks.s.k).toEqual([100, 100, 100]);
    expect(sheet.ks.p.k.every((key) => key.h === 1)).toBe(true);
  }
  const end = assembly.ks.p.k.at(-1).t;
  expect(appearAt(layer(3, "approach-arrow"))).toBe(end);
  expect(appearAt(layer(3, "approach-insert"))).toBeGreaterThan(end);
  expect(appearAt(layer(3, "approach-dashes"))).toBeGreaterThan(
    appearAt(layer(3, "approach-insert")),
  );
  const list = scene(3).layers;
  const index = (name) => list.findIndex((item) => item.nm === name);
  expect(
    index("Patient face in front of side-held instrument and arm"),
  ).toBeLessThan(index(assembly.nm));
  expect(index("Nose and far face occlude the light")).toBeLessThan(
    index("approach-light"),
  );
  const forearm = layer(3, "approach-forearm-over-sleeve clipped panel");
  expect(forearm.ks).toEqual(assembly.ks);
  expect(index(forearm.nm)).toBeLessThan(
    index("Rounded blue examiner shoulder sleeve"),
  );
  expect(index("Rounded blue examiner shoulder sleeve")).toBeLessThan(
    index(assembly.nm),
  );
  expect(layer(3, "Forearm and hand above the sleeve").ks).toEqual(
    layer(3, "Hand and forearm rotating about the wrist axis").ks,
  );
  expect(layer(3, "Rounded blue examiner shoulder sleeve").refId).toBe(
    "approach-sleeve",
  );
});

test("status circles share one visible size and positioning illustrations retain their aspect ratio", () => {
  const sizes = [];
  for (let index = 0; index < 6; index++) {
    const data = scene(index);
    for (const item of allLayers(index)) {
      if (!item.refId) continue;
      const asset = data.assets.find((a) => a.id === item.refId);
      if (item.refId.startsWith("icon-"))
        sizes.push([
          (asset.w * item.ks.s.k[0]) / 100,
          (asset.h * item.ks.s.k[1]) / 100,
        ]);
      if ([2, 3].includes(index) && !item.ks.s.a)
        expect(
          Math.abs(Math.abs(item.ks.s.k[0] / item.ks.s.k[1]) - 1),
        ).toBeLessThan(0.001);
    }
  }
  expect(sizes).toHaveLength(13);
  sizes.forEach(([w, h]) => {
    expect(w).toBeCloseTo(110);
    expect(h).toBeCloseTo(110);
  });
});

test("the projected window face retains its controls and the blue sleeve stays below the neck", async () => {
  for (const [name, type] of [
    ["approach-device-turn-3", "front"],
    ["approach-sleeve", "sleeve"],
  ]) {
    const { data, info } = await sharp(
      `public/scrolly/coreexam/pupils-pec/images/${name}.webp`,
    )
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    let opaque = 0,
      detail = 0,
      firstBlueRow = Infinity,
      lastBlueRow = -1,
      lastBlueCol = -1;
    for (let i = 0; i < info.width * info.height; i++) {
      const [r, g, b, a] = data.subarray(i * 4, i * 4 + 4);
      if (a < 200) continue;
      opaque++;
      if (type === "front" && b > r * 1.2 && b > g * 1.05) detail++;
      if (type === "sleeve" && g > 120 && b > 120 && r < 170) {
        detail++;
        firstBlueRow = Math.min(firstBlueRow, Math.floor(i / info.width));
        lastBlueRow = Math.max(lastBlueRow, Math.floor(i / info.width));
        lastBlueCol = Math.max(lastBlueCol, i % info.width);
      }
    }
    expect(opaque).toBeGreaterThan(4000);
    expect(detail).toBeGreaterThan(500);
    if (type === "sleeve") {
      expect(firstBlueRow).toBeGreaterThan(info.height * 0.45);
      expect(
        Math.abs(
          (lastBlueCol + 1) / (lastBlueRow - firstBlueRow + 1) - 119 / 271,
        ),
      ).toBeLessThan(0.015);
    }
  }
});

test("response pupils are centred on the original iris and the light brightens a stationary face inside clipped panels", async () => {
  for (const [index, kind] of [
    [4, "clear"],
    [5, "cataract"],
  ])
    for (let row = 0; row < 3; row++) {
      const data = scene(index),
        panel = data.layers.find(
          (item) => item.refId === `${kind}-${row}-panel`,
        );
      expect(panel.ty).toBe(0);
      expect(panel.w).toBe(308);
      expect(panel.hasMask).toBe(true);
      expect(panel.masksProperties[0].pt.a).toBe(0);
      expect(
        data.assets.some((asset) => /-start(?:-view)?$/.test(asset.id)),
      ).toBe(false);
      expect(panel.ks.p.k[0]).toBeGreaterThan(0);
      expect(
        data.layers.find((item) => item.nm === `${kind} status ${row + 1}`).ks.p
          .k[0] + 55,
      ).toBeLessThan(data.w);
      const bright = layer(index, `${kind}-${row}-bright`);
      expect(bright.hasMask).toBe(true);
      expect(bright.ks.p.a).toBe(1);
      expect(bright.masksProperties[0].pt.a).toBe(1);
      const pool = bright.masksProperties[0].pt.k.at(-1).s[0].v;
      const extent = (axis) =>
        Math.max(...pool.map((v) => v[axis])) -
        Math.min(...pool.map((v) => v[axis]));
      expect(extent(0)).toBeCloseTo(extent(1));
      expect((extent(0) * bright.ks.s.k[0]) / 100).toBeGreaterThan(250);
      expect((extent(0) * bright.ks.s.k[0]) / 100).toBeLessThan(300);
      const { data: pixels, info } = await sharp(
        `public/scrolly/coreexam/pupils-pec/images/${kind}-${row}-bright.webp`,
      )
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      let count = 0,
        xMin = Infinity,
        xMax = -Infinity,
        yMax = -Infinity;
      for (let y = 0; y < info.height; y++)
        for (let x = 0; x < info.width; x++) {
          const [r, g, b, a] = pixels.subarray(
            (y * info.width + x) * 4,
            (y * info.width + x) * 4 + 4,
          );
          if (
            a > 250 &&
            Math.abs(r - 177) < 8 &&
            Math.abs(g - 132) < 8 &&
            Math.abs(b - 25) < 8
          ) {
            count++;
            xMin = Math.min(xMin, x);
            xMax = Math.max(xMax, x);
            yMax = Math.max(yMax, y);
          }
        }
      expect(count).toBeGreaterThan(100);
      const pupil = layer(index, `${kind} pupil response ${row + 1}`);
      const finalPupil = pupil.ks.p.k.at(-1).s;
      const scale = bright.ks.s.k[0] / 100;
      // The upper eyelid occludes the iris: use its full width and lower edge,
      // rather than the centroid of only the visible gold pixels.
      const radius = (xMax - xMin + 1) / 2;
      expect(
        Math.abs(finalPupil[0] - ((xMin + xMax + 1) / 2 - 72) * scale),
      ).toBeLessThan(1);
      expect(
        Math.abs(finalPupil[1] - (yMax + 1 - radius - 72) * scale),
      ).toBeLessThan(1);
    }
});

test("clear and cataract examples share the three responses and delayed matching right column", () => {
  for (const [index, kind] of [
    [4, "clear"],
    [5, "cataract"],
  ]) {
    const sizes = [1, 2, 3].map(
      (row) => layer(index, `${kind} pupil response ${row}`).ks.s.k.at(-1).s[0],
    );
    expect(sizes[0]).toBeLessThan(sizes[1]);
    expect(sizes[1]).toBeLessThan(sizes[2]);
    expect(sizes[2]).toBe(100);
    for (let row = 0; row < 3; row++) {
      const instrument = layer(index, `${kind}-${row}-instrument`);
      expect(instrument.refId).toBe("comparison-device");
      const finalPosition = instrument.ks.p.k.at(-1).s;
      const poolPosition = layer(index, `${kind}-${row}-beam`).ks.p.k.at(-1).s;
      const eyePosition = layer(
        index,
        `${kind} pupil response ${row + 1}`,
      ).ks.p.k.at(-1).s;
      expect(finalPosition[1]).toBeCloseTo(poolPosition[1]);
      expect(finalPosition[0]).toBe(38);
      expect(eyePosition[0] - finalPosition[0]).toBeGreaterThan(100);
      expect(layer(index, `${kind}-${row}-base`).ks.p.a).toBe(1);
      expect(layer(index, `${kind}-${row}-base`).ks.o.k).toBe(100);
      expect(layer(index, `${kind}-${row}-arrow`).ty).toBe(2);
      expect(instrument.ks.p.k[0].s).not.toEqual(instrument.ks.p.k.at(-1).s);
      expect(instrument.ks.s.k[0].s[0]).toBeLessThan(
        instrument.ks.s.k.at(-1).s[0],
      );
      expect(instrument.ks.p.k[0].s[0]).toBeLessThan(
        instrument.ks.p.k.at(-1).s[0],
      );
      expect(
        appearAt(layer(index, `${kind} fundus ${row + 1}`)),
      ).toBeGreaterThan(
        layer(index, `${kind} pupil response ${row + 1}`).ks.s.k.at(-1).t,
      );
      expect(layer(4, `clear pupil response ${row + 1}`).ks.s.k).toEqual(
        layer(5, `cataract pupil response ${row + 1}`).ks.s.k,
      );
    }
  }
});
