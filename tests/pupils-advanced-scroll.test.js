/** @jest-environment node */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { JSDOM } from "jsdom";
import {
  PUPILS_ADVANCED_SCROLL_CONFIG as cfg,
  PUPILS_ADVANCED_SCROLL_TIMING as timing,
  PUPILS_ADVANCED_STAGES as stages,
} from "../public/js/pupilsAdvancedScroll.js";
import {
  PUPILS_PEC_SCROLL_CONFIG as pec,
  PUPILS_PEC_STAGES as pecStages,
} from "../public/js/pupilsPecScroll.js";
import {
  frameAtNarrationTime,
  EXAMINATION_SCROLL_TIMING,
} from "../public/js/examinationScrollTiming.js";
import localLessons from "../utils/local-only-lessons.cjs";
EXAMINATION_SCROLL_TIMING[cfg.pageId] = timing;

const folder = "public/narration/pupils-advanced/full-animation";
const script = JSON.parse(fs.readFileSync(`${folder}/script.json`, "utf8"));
const scene = (i) =>
  JSON.parse(fs.readFileSync(`public${cfg.paths[i]}`, "utf8"));
const digest = (bytes) =>
  crypto.createHash("sha256").update(bytes).digest("hex");

test("Advanced is a distinct accessible row immediately below its PDF", () => {
  const doc = new JSDOM(
    localLessons.renderLocalLessonHtml(
      fs.readFileSync("public/html/videos.html", "utf8"),
      "public",
      true,
    ),
  ).window.document;
  const row = doc.querySelector(`#pupilsPage [data-target="${cfg.pageId}"]`);
  expect(row.previousElementSibling.dataset.target).toBe(
    "pupilsAdvancedPdfPage",
  );
  expect(row.querySelector(".lesson-type").textContent.trim()).toBe("Pupils");
  expect(row.classList.contains("lesson-row--scrollytelling")).toBe(true);
  expect(fs.readFileSync("public/style/components.css", "utf8")).toContain(
    "advanced_scrollytell.webp",
  );
  const bar = row.querySelector('[role="progressbar"]');
  expect(
    doc.getElementById(bar.getAttribute("aria-labelledby")).textContent.trim(),
  ).toBe("Pupils");
  expect(
    doc.querySelector(`#${cfg.pageId} .childhood-fundal-prep-list`).children,
  ).toHaveLength(0);
});

test("fifteen animations preserve source order, canvas ratio and narration frames", () => {
  expect(cfg.paths).toHaveLength(15);
  expect(cfg.sections.map((s) => s.startIndex)).toEqual([
    0, 3, 4, 5, 10, 11, 13,
  ]);
  for (const [i, file] of cfg.paths.entries()) {
    const data = scene(i);
    expect([data.w, data.h, data.fr, data.ip]).toEqual([
      1169,
      i === 3 ? 1093 : 1280,
      30,
      0,
    ]);
    expect(data.op).toBe(stages[i].seconds * 30);
    expect(cfg.completionHoldFrameByFile[i]).toBe(data.op - 1);
    expect(
      frameAtNarrationTime(timing.stages[i], cfg.narrationClipsByFile[i].end),
    ).toBe(data.op - 1);
    expect(
      fs.statSync(path.join("public", path.dirname(file), "images/img_0.png"))
        .size,
    ).toBeGreaterThan(5000);
    for (const asset of data.assets.filter((a) => a.p)) {
      expect(asset.e).toBe(0);
      expect(Math.max(asset.w, asset.h)).toBeLessThanOrEqual(1500);
      expect(
        fs.statSync(path.join("public", path.dirname(file), asset.u, asset.p))
          .size,
      ).toBeGreaterThan(0);
    }
    for (const layer of data.layers.filter((l) => l.refId)) {
      expect(data.assets.some((a) => a.id === layer.refId)).toBe(true);
      if (stages[i].pecStageIndex == null && layer.ks.s.a === 0)
        expect(layer.ks.s.k[0]).toBeCloseTo(layer.ks.s.k[1]);
    }
    const validate = (value) => {
      if (!value || typeof value !== "object") return;
      if (value.a === 1 && Array.isArray(value.k))
        expect(value.k.length).toBeGreaterThan(1);
      Object.values(value).forEach(validate);
    };
    validate(data);
  }
});

test("packaged English and Korean audio and captions cover all 35 cues", () => {
  const manifest = JSON.parse(
    fs.readFileSync(`${folder}/manifest.json`, "utf8"),
  );
  expect(script.cues.map((c) => c.id)).toEqual(
    stages.flatMap((s) => s.cues.map((c) => c.id)),
  );
  expect(script.cues).toHaveLength(35);
  expect(manifest.durationSeconds).toBe(cfg.narrationClipsByFile.at(-1).end);
  for (const language of Object.keys(cfg.narrationTracks)) {
    const bytes = fs.readFileSync(`${folder}/${language}.m4a`);
    expect(bytes.length).toBeGreaterThan(50000);
    expect(digest(bytes)).toBe(manifest.tracks[language].sha256);
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
    expect(
      script.cues.every((c) => c[language]?.length > 0 && c.end > c.start),
    ).toBe(true);
  }
});

const allLayers = (data) => [
  ...data.layers,
  ...data.assets.flatMap((a) => a.layers || []),
];
test("Observation and all five Direct Light Response scenes reuse PEC verbatim", () => {
  expect(cfg.paths.slice(4, 10)).toEqual(pec.paths);
  expect(stages.slice(4, 10).map((s) => s.cues)).toEqual(
    pecStages.map((s) => s.cues),
  );
  expect(script.reusedAudio).toEqual({
    folder: "pupils-pec",
    sourceStart: 1,
    sourceEnd: 102,
    targetStart: 107,
  });
  const manifest = JSON.parse(fs.readFileSync(folder + "/manifest.json"));
  for (const lang of ["en", "ko"])
    expect(manifest.tracks[lang].reusedPecSha256).toBe(
      digest(
        fs.readFileSync(
          "public/narration/pupils-pec/full-animation/" + lang + ".m4a",
        ),
      ),
    );
});
test("neural light precedes sensory paths, efferent arrival precedes constriction and labels", () => {
  for (const i of [0, 3]) {
    const list = allLayers(scene(i));
    const lens = list.find((l) => l.nm.endsWith("-lens-off"));
    expect(lens.ks.o.k[0].s).toEqual([100]);
    const light = list.find((l) => l.nm.endsWith("-shaft"));
    expect(light.ks.o.k[0].s).toEqual([0]);
    expect(light.masksProperties[0].pt.k.at(-1).t).toBe(150);
    const pool = list.find((l) => l.nm.endsWith("-pool"));
    expect(pool.ks.o.k.map((k) => [k.t, k.s[0], k.h])).toEqual([
      [0, 0, 1],
      [45, 100, 1],
    ]);
    expect(light.ks.o).toEqual(pool.ks.o);
  }
  const heads = allLayers(scene(0)).filter(
    (l) => l.nm === "Travelling original sensory arrow",
  );
  expect(heads).toHaveLength(2);
  expect(
    allLayers(scene(0)).some((l) => l.nm.startsWith("Original arrowhead")),
  ).toBe(false);
  const list = allLayers(scene(3));
  const pupil = list.find(
    (l) => l.nm === "Pupil constricts after efferent arrival",
  );
  const spoken = script.visualCues.find((c) => c.id === "reflex-constriction");
  const spokenFrame = Math.round(
    (spoken.at - cfg.narrationClipsByFile[3].start) * 30,
  );
  expect(spoken.word).toBe("constrict");
  expect(spokenFrame).toBeGreaterThan(240);
  expect(spokenFrame).toBeLessThan(480);
  expect(pupil.ks.s.k.map((k) => [k.t, k.s[0]])).toEqual([
    [0, 100],
    [spokenFrame, 100],
    [spokenFrame + 45, 53],
  ]);
  expect(list.find((l) => l.nm === "reflex-direct-label").ks.o.k[1].t).toBe(
    480,
  );
  expect(list.find((l) => l.nm === "reflex-consensual-label").ks.o.k[1].t).toBe(
    585,
  );
  expect(stages[1].cues[0].id).toBe("efferent-definition");
});
test("flow connections remain behind foreground boxes and original radial arrows trim progressively", () => {
  for (const i of [1, 2]) {
    const data = scene(i),
      list = data.layers;
    const line = list.findIndex(
      (l) => l.nm === "Signal behind foreground boxes 0",
    );
    for (const box of list.filter((l) => /-box-/.test(l.nm)))
      expect(list.indexOf(box)).toBeLessThan(line);
    const radial = data.assets.find((a) => a.id.startsWith("radial-"));
    expect(
      radial.layers.some((l) =>
        l.shapes[0].it.some((it) => it.ty === "tm" && it.e.a === 1),
      ),
    ).toBe(true);
    for (const l of list.filter((l) => /Signal behind/.test(l.nm))) {
      const colour = l.shapes[0].it.find((it) => it.ty === "st").c.k;
      expect(colour.slice(0, 3)).toEqual(
        i === 2 ? [58 / 255, 0, 90 / 255] : [219 / 255, 0, 1],
      );
    }
  }
});

test("travelling afferent heads stay attached to the trimmed shafts throughout the curved path", () => {
  const list = allLayers(scene(0));
  for (const head of list.filter(
    (l) => l.nm === "Travelling original sensory arrow",
  )) {
    const colour = head.shapes[0].it.find((i) => i.ty === "fl").c.k;
    const outline = head.shapes[0].it[0].ks.k;
    expect(outline.v.length).toBeGreaterThan(3);
    expect(
      [...outline.i, ...outline.o].some((p) => Math.hypot(...p) > 0.1),
    ).toBe(true);
    const line = list.find(
      (l) =>
        l.nm.startsWith("Original path") &&
        JSON.stringify(l.shapes[0].it.find((i) => i.ty === "st")?.c.k) ===
          JSON.stringify(colour) &&
        l.shapes[0].it.find((i) => i.ty === "tm").e.k.at(-1).t === 450,
    );
    const curve = line.shapes[0].it[0].ks.k;
    const table = Array.from({ length: 2049 }, (_, j) => {
      const q = Math.min(
          curve.v.length - 1 - 1e-8,
          (j / 2048) * (curve.v.length - 1),
        ),
        i = Math.floor(q),
        u = q - i,
        v = 1 - u;
      return {
        p: curve.v[i].map(
          (a, k) =>
            v * v * v * a +
            3 * v * v * u * (a + curve.o[i][k]) +
            3 * v * u * u * (curve.v[i + 1][k] + curve.i[i + 1][k]) +
            u * u * u * curve.v[i + 1][k],
        ),
        d: 0,
      };
    });
    for (let i = 1; i < table.length; i++)
      table[i].d =
        table[i - 1].d +
        Math.hypot(...table[i].p.map((v, k) => v - table[i - 1].p[k]));
    for (const key of head.ks.p.k.filter((k) => k.t >= 240)) {
      const d = ((key.t - 240) / 210) * table.at(-1).d;
      const next = Math.max(
        1,
        table.findIndex((p) => p.d >= d - 1e-8),
      );
      const a = table[next - 1],
        b = table[next],
        f = (d - a.d) / (b.d - a.d);
      const point = a.p.map((v, k) => v + (b.p[k] - v) * f + line.ks.p.k[k]);
      expect(Math.hypot(key.s[0] - point[0], key.s[1] - point[1])).toBeLessThan(
        0.08,
      );
    }
  }
});

test("brain perimeter draws before its two branches and only the reflex rect is shorter", () => {
  const list = allLayers(scene(0));
  for (const [outer, branch] of [
    [254, 255],
    [256, 257],
  ]) {
    const trim = (id) =>
      list
        .find((l) => l.nm === "Original path " + id)
        .shapes[0].it.find((it) => it.ty === "tm").e.k;
    expect(trim(outer).at(-1).t).toBeLessThanOrEqual(trim(branch)[1].t);
    const path = (id) =>
      list.find((l) => l.nm === "Original path " + id).shapes[0].it[0].ks.k;
    expect(path(outer).v.at(-1)).toEqual(path(branch).v[0]);
    expect(path(outer).v.at(-1)).toEqual(path(outer + " continuation").v[0]);
    expect(trim(outer + " continuation")[1].t).toBe(trim(branch)[1].t);
  }
  expect(cfg.stageAspectRatioByFile.filter((r) => r !== "1169 / 1280")).toEqual(
    ["1169 / 1093"],
  );
});

test("complete retinal light texture fits its mask after resizing the reflex rect", async () => {
  const data = scene(3),
    beam = allLayers(data).find((l) => l.nm === "reflex-shaft"),
    asset = data.assets.find((a) => a.id === beam.refId),
    full = beam.masksProperties[0].pt.k.at(-1).s[0],
    xs = full.v.map((p) => p[0]),
    ys = full.v.map((p) => p[1]),
    { data: pixels, info } = await sharp(
      "public/scrolly/coreexam/pupils-advanced/images/" + asset.p,
    )
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
  const bounds = [Infinity, Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pixels.length; i += 4)
    if (pixels[i + 3] > 32) {
      const x = (i / 4) % info.width,
        y = Math.floor(i / 4 / info.width);
      bounds[0] = Math.min(bounds[0], x);
      bounds[1] = Math.min(bounds[1], y);
      bounds[2] = Math.max(bounds[2], x);
      bounds[3] = Math.max(bounds[3], y);
    }
  expect(bounds[0]).toBeGreaterThanOrEqual(Math.min(...xs) - 1);
  expect(bounds[2]).toBeLessThanOrEqual(Math.max(...xs) + 1);
  expect(bounds[1]).toBeGreaterThanOrEqual(Math.min(...ys) - 1);
  expect(bounds[3]).toBeLessThanOrEqual(Math.max(...ys) + 1);
});

test("dilator source card no longer contains a second muscle disc", async () => {
  const { data } = await sharp(
    "public/scrolly/coreexam/pupils-advanced/images/sympathetic-iris.webp",
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let cream = 0;
  for (let i = 0; i < data.length; i += 4)
    if (
      data[i + 3] > 128 &&
      data[i] > 225 &&
      data[i + 1] > 215 &&
      data[i + 2] > 170 &&
      data[i + 2] < 220
    )
      cream++;
  expect(cream).toBe(0);
  expect(
    allLayers(scene(2)).filter((l) => l.nm === "Original muscle disc"),
  ).toHaveLength(1);
});

test("consensual panels have a one-second handoff and a foreground full-width divider", () => {
  const data = scene(10),
    list = allLayers(data),
    top = list.find((l) => l.nm === "consensual-left-marks"),
    bottom = list.find((l) => l.refId === "consensual-right-pool");
  expect(bottom.ks.o.k[1].t - top.ks.o.k.at(-1).t).toBe(30);
  expect(data.layers[0].nm).toBe("Consensual full-width divider");
  expect(data.layers[0].shapes[0].it[0].ks.k.v).toEqual([
    [0, 640],
    [1169, 640],
  ]);
  expect(stages[10].cues[1].offset).toBe(8);
});

test("swinging arrows are behind the examination device, without baked white dividers", async () => {
  const data = scene(11),
    comp = data.assets.find((a) => a.layers),
    device = comp.layers.findIndex(
      (l) => l.nm === "Constant brightness examination device",
    );
  for (const arrow of comp.layers.filter((l) =>
    /swing-arrow/.test(l.refId || ""),
  ))
    expect(device).toBeLessThan(comp.layers.indexOf(arrow));
  for (const name of ["swing-normal-dark", "swing-rapd-dark"]) {
    const { data, info } = await sharp(
      "public/scrolly/coreexam/pupils-advanced/images/" + name + ".webp",
    )
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    let max = 0;
    for (let y = 0; y < info.height; y++) {
      let n = 0;
      for (let x = 0; x < info.width; x++) {
        const i = (y * info.width + x) * 4;
        if (
          data[i] > 95 &&
          Math.abs(data[i] - data[i + 1]) < 3 &&
          Math.abs(data[i + 1] - data[i + 2]) < 3 &&
          data[i + 3] > 128
        )
          n++;
      }
      max = Math.max(max, n);
    }
    expect(max / info.width).toBeLessThan(0.4);
  }
});

test("near panels preserve source arrows, arm occlusion and proportional rounded cards", () => {
  const data = scene(13),
    list = allLayers(data),
    target = data.assets.find((a) =>
      a.layers?.some((l) => l.nm === "near-target-hand"),
    ),
    order = (name) => target.layers.findIndex((l) => l.nm === name),
    arrow = list.find((l) => l.refId === "near-distance-arrow");
  expect(arrow.ks.s.k[0]).toBe(arrow.ks.s.k[1]);
  expect(list.some((l) => l.nm === "Distance fixation arrowhead")).toBe(false);
  expect(order("near-target-bubble")).toBeLessThan(order("near-target-hand"));
  expect(order("near-target-hand")).toBeLessThan(order("near-target-tail"));
  expect(data.layers[0].nm).toBe("Near panels foreground divider");
  for (const layer of scene(14).layers.filter((l) => l.ty === 0)) {
    expect((layer.w * layer.ks.s.k[0]) / 100).toBeCloseTo(800);
    expect(layer.masksProperties[0].pt.k.v).toHaveLength(8);
  }
  expect(stages[14].cues[0].en).toContain("convergence");
  expect(stages[14].cues.map((c) => c.en).join(" ")).not.toMatch(/constrict/i);
});
test("device brightness stays fixed while device and pool share swinging positions", async () => {
  for (const i of [10, 11, 12]) {
    const list = allLayers(scene(i));
    const devices = list.filter(
      (l) => l.nm === "Constant brightness examination device",
    );
    expect(devices.length).toBeGreaterThan(0);
    for (const d of devices) {
      expect(d.ks.o).toEqual({ a: 0, k: 100 });
      const name = d.refId.replace(/-device$/, "");
      const pool = list.find((l) => l.refId === name + "-pool");
      expect(pool.ks.p).toEqual(d.ks.p);
      if (i > 10) expect(new Set(d.ks.p.k.map((k) => k.s[0])).size).toBe(2);
    }
  }
  for (const i of [11, 12, 13]) {
    const arrows = allLayers(scene(i)).filter(
      (l) => l.ty === 2 && /-arrow/.test(l.refId),
    );
    expect(arrows.length).toBeGreaterThan(0);
    for (const a of arrows) expect(a.masksProperties[0].pt.a).toBe(1);
  }
  const imageStats = async (name) =>
    (
      await sharp(
        "public/scrolly/coreexam/pupils-advanced/images/" + name + ".webp",
      )
        .ensureAlpha()
        .stats()
    ).channels[3].mean;
  for (const n of [
    "swing-arrow-right",
    "swing-arrow-left",
    "swing-normal-arrow",
    "swing-rapd-arrow",
  ])
    expect(await imageStats(n)).toBeGreaterThan(0.1);
});
test("Near response has two faces, closed sclera masks, moving irises and delayed result symbols", async () => {
  const data = scene(14),
    list = allLayers(data);
  expect(list.filter((l) => /^near-single-/.test(l.nm))).toHaveLength(2);
  const irises = list.filter((l) => /^Original iris converges/.test(l.nm));
  expect(irises).toHaveLength(4);
  for (const l of irises) expect(l.masksProperties[0].pt.k.c).toBe(true);
  for (const l of irises.filter((l) => /0-/.test(l.nm))) {
    const p = l.shapes[0].it.at(-1).p.k;
    expect(Math.abs(p[0].s[0] - p.at(-1).s[0])).toBeGreaterThan(2);
  }
  for (const row of [0, 1]) {
    const icon = list.find(
      (l) => l.refId === "near-result-" + row + "-marks-symbol-0",
    );
    expect(icon.ks.o.k[1].t).toBeGreaterThan(row * 300 + 180);
  }
  const { data: rgb } = await sharp(
    "public/scrolly/coreexam/pupils-advanced/images/near-target-bubble.webp",
  )
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let red = 0;
  for (let i = 0; i < rgb.length; i += 3)
    if (rgb[i] > 100 && rgb[i] > rgb[i + 1] * 2 && rgb[i] > rgb[i + 2] * 2)
      red++;
  expect(red).toBeGreaterThan(100);
});

test("provenance verifies both supplied source masters", () => {
  const provenance = JSON.parse(
    fs.readFileSync(
      "public/scrolly/coreexam/pupils-advanced/provenance.json",
      "utf8",
    ),
  );
  expect(digest(fs.readFileSync(provenance.source))).toBe(provenance.pdfSha256);
  expect(digest(fs.readFileSync(provenance.illustratorMaster))).toBe(
    provenance.aiSha256,
  );
});

test("RAPD stays constricted during the swing and dilates only after light reaches the affected eye", () => {
  const list = allLayers(scene(12));
  const device = list.find((l) => l.refId === "swing-rapd-device");
  const arrival = device.ks.p.k.at(-2).t;
  const pupils = list.filter((l) => l.nm.startsWith("swing-rapd pupil"));
  expect(pupils).toHaveLength(2);
  expect(pupils[0].ks.s).toEqual(pupils[1].ks.s);
  const k = pupils[0].ks.s.k;
  expect(k.find((p) => p.t === arrival + 8).s[0]).toBe(82);
  expect(k.at(-1).t).toBeGreaterThan(arrival);
  expect(k.at(-1).s[0]).toBe(120);
  const spoken = script.visualCues.find((c) => c.id === "rapd-dilation");
  expect(arrival + 8).toBe(
    Math.round((spoken.at - cfg.narrationClipsByFile[12].start) * 30),
  );
  expect(arrival).toBeGreaterThan(500);
});

test("near hand settles before simultaneous highlight/arrows and face textures retain enough detail", () => {
  const list = allLayers(scene(13));
  const hand = list.find((l) => l.nm === "near-target-hand");
  expect(hand.ks.p.a).toBe(0);
  expect(hand.ks.r.k[0].s[0]).toBe(-140);
  expect(hand.ks.r.k.at(-1).s[0]).toBe(0);
  const settled = hand.ks.r.k.at(-1).t;
  expect(list.find((l) => l.nm === "near-target-highlight").ks.o.k[1].t).toBe(
    settled,
  );
  for (const l of list.filter((l) => /^near-target-arrow-/.test(l.nm)))
    expect(l.masksProperties[0].pt.k[1].t).toBe(settled);
  for (const a of scene(14).assets.filter((a) => /^near-single/.test(a.id)))
    expect(a.w).toBeGreaterThan(1000);
});

test("anatomy stays fixed, light stays behind the device, and all reflex side arrows fit", () => {
  for (const index of [0, 3]) {
    const data = scene(index),
      comp = data.assets.find((a) => a.layers),
      list = comp.layers;
    const retina = list.find((l) => /-retina$/.test(l.nm));
    expect(retina.ks.o).toEqual({ a: 0, k: 100 });
    expect(retina.ks.p.a).toBe(0);
    expect(list.findIndex((l) => /-device$/.test(l.nm))).toBeLessThan(
      list.findIndex((l) => /-pool$/.test(l.nm)),
    );
  }
  const data = scene(3),
    outer = data.layers.find((l) => l.ty === 0),
    x = outer.ks.p.k[0],
    width =
      (data.assets.find((a) => a.id === outer.refId).w * outer.ks.s.k[0]) / 100;
  expect(x).toBeGreaterThanOrEqual(0);
  expect(x + width).toBeLessThanOrEqual(data.w + 0.001);
});

test("muscle apertures change with radial signals and the third-nerve eye blinks", () => {
  for (const index of [1, 2]) {
    const data = scene(index),
      radial = data.assets.find((a) => /^radial/.test(a.id)),
      pupil = radial.layers.find((l) => l.nm === "Progressive muscle pupil"),
      k = pupil.shapes[0].it[0].ks.k,
      radius = (p) => Math.abs(p.s[0].v[0][1] - p.s[0].v[2][1]) / 2;
    expect(
      index === 1
        ? radius(k[0]) > radius(k.at(-1))
        : radius(k[0]) < radius(k.at(-1)),
    ).toBe(true);
    const trim = radial.layers
      .flatMap((l) => l.shapes[0].it)
      .find((it) => it.ty === "tm");
    expect(k.at(-1).t).toBe(trim.e.k.at(-1).t);
  }
  const list = allLayers(scene(1)),
    eye = list.find((l) => l.nm === "Eye opening and lower lid stay fixed"),
    lid = list.find((l) => l.nm === "Upper eyelid flexes 807");
  expect(eye.ks.p.a).toBe(0);
  expect(eye.ks.s.a).toBe(0);
  expect(lid.ks.s.a).toBe(0);
  expect(lid.ks.p.a).toBe(0);
  const k = lid.shapes[0].it[0].ks.k,
    open = k[0].s[0],
    closed = k.find((p) => p.t === 785).s[0];
  const length = (p) => Math.hypot(...p.v[0].map((v, i) => v - p.v[1][i]));
  expect(Math.abs(length(open) - length(closed))).toBeGreaterThan(0.1);
  expect(k.at(-1).s[0]).toEqual(open);
});

test("examination lenses switch with the pools and enlarged starting pupils keep their final sizes", () => {
  for (const index of [10, 11, 12]) {
    const list = allLayers(scene(index));
    for (const lens of list.filter(
      (l) => l.nm === "Lens switches from black to white with light pool",
    )) {
      expect(lens.ks.o.k[0].s).toEqual([100]);
      expect(lens.ks.o.k.at(-1).s).toEqual([0]);
      const pool = list.find(
        (l) => l.refId === lens.refId.replace("-lens-off", "-pool"),
      );
      expect(lens.ks.o.k.at(-1).t).toBe(pool.ks.o.k.at(-1).t);
    }
    for (const p of list.filter((l) => / pupil \d$/.test(l.nm))) {
      expect(p.ks.s.k[0].s[0]).toBe(155);
      expect(p.ks.s.k.at(-1).s[0]).toBe(
        index === 10
          ? 55
          : index === 11
            ? 82
            : p.nm.startsWith("swing-rapd")
              ? 120
              : 82,
      );
    }
  }
});

test("cataract controls follow speech by 1.5 seconds without changing PEC audio", () => {
  const clip = cfg.narrationClipsByFile[9];
  expect(clip.endByLanguage.en - clip.start).toBeCloseTo(8 + 8.26 + 1.5);
  expect(clip.endByLanguage.ko - clip.start).toBeCloseTo(8 + 9.82 + 1.5);
  expect(cfg.narrationClipsByFile[10].start).toBe(clip.end);
});

test("afferent and consensual controls follow completed visuals and speech without accelerating the animation", () => {
  for (const [index, visualFrame, speechEnds] of [
    [0, 662, { en: 15.01, ko: 17.12 }],
    [10, 390, { en: 13.93, ko: 14.62 }],
  ]) {
    const clip = cfg.narrationClipsByFile[index];
    for (const language of ["en", "ko"]) {
      const points = [
        ...timing.stages[index].slice(0, -1),
        [clip.endByLanguage[language], scene(index).op - 1],
      ];
      expect(frameAtNarrationTime(points, clip.start + visualFrame / 30)).toBe(
        visualFrame,
      );
      expect(
        clip.endByLanguage[language] -
          clip.start -
          Math.max(visualFrame / 30, speechEnds[language]),
      ).toBeCloseTo(1.5);
    }
  }
});

test("each named afferent structure highlights in signal order and the lit pupil sits below its beam", () => {
  const list = allLayers(scene(0));
  const highlights = ["retina", "optic nerve", "chiasm", "tract", "nuclei"].map(
    (name) => list.find((l) => l.nm === "Anatomy highlight: " + name),
  );
  const starts = highlights.map((l) => l.ks.o.k[1].t);
  expect(starts).toEqual([...starts].sort((a, b) => a - b));
  for (const l of highlights) {
    expect(l.ks.o.k[2].s[0]).toBeGreaterThan(0);
    expect(l.ks.o.k.at(-1).s[0]).toBe(0);
  }
  const layers = scene(3).assets.find((a) => a.layers).layers;
  const beam = layers.findIndex((l) => l.nm === "reflex-shaft");
  const pupils = layers
    .filter((l) => l.nm === "Pupil constricts after efferent arrival")
    .sort((a, b) => a.ks.p.k[0] - b.ks.p.k[0]);
  expect(layers.indexOf(pupils[0])).toBeGreaterThan(beam);
  expect(layers.indexOf(pupils[1])).toBeLessThan(beam);
});

test("examination pupils wait 0.4 seconds after full illumination before constricting", () => {
  for (const index of [10, 11, 12]) {
    const list = allLayers(scene(index));
    for (const pupil of list.filter((l) => / pupil \d$/.test(l.nm))) {
      const pool = list.find(
        (l) => l.refId === pupil.nm.replace(/ pupil \d$/, "-pool"),
      );
      expect((pupil.ks.s.k[1].t - pool.ks.o.k.at(-1).t) / 30).toBeCloseTo(0.4);
      expect(pupil.ks.s.k[1].s[0]).toBe(155);
      expect(pupil.ks.s.k[2].s[0]).toBeLessThan(155);
    }
  }
});

test("second swinging arrows reveal only the area already traversed by the device", () => {
  const data = scene(12),
    list = allLayers(data);
  for (const [name, mid] of [
    ["swing-normal", 146],
    ["swing-rapd", 542],
  ]) {
    const arrow = list.find((l) => l.refId === name + "-arrow");
    const asset = data.assets.find((a) => a.id === arrow.refId);
    const curve = arrow.masksProperties[0].pt.k.find((k) => k.t === mid).s[0];
    const sourceLeft =
      curve.v[0][0] / (asset.w / asset.sourceBox[2]) + asset.sourceBox[0];
    expect(sourceLeft).toBeCloseTo(475.2);
    const reveal = arrow.masksProperties[0].pt.k.map(
      (k) => k.s[0].v[1][0] - k.s[0].v[0][0],
    );
    expect(reveal[0]).toBe(0);
    expect(reveal.at(-1)).toBeGreaterThan(
      reveal.find((_, i) => arrow.masksProperties[0].pt.k[i].t === mid),
    );
  }
});

test("dilator retains all original fibres and arrowheads while near faces converge twice as fast", () => {
  const radial = scene(2).assets.find((a) => /^radial/.test(a.id));
  expect(
    radial.layers.filter((l) => /^Original dilator fibre /.test(l.nm)),
  ).toHaveLength(16);
  expect(
    radial.layers.filter((l) => /^Original arrowhead /.test(l.nm)),
  ).toHaveLength(8);
  const data = scene(14);
  for (const iris of allLayers(data).filter((l) =>
    /^Original iris converges/.test(l.nm),
  )) {
    const k = iris.shapes[0].it.at(-1).p.k;
    expect(k.at(-1).t - k[1].t).toBe(57.5);
  }
  const cards = data.layers
    .filter((l) => l.ty === 0)
    .sort((a, b) => a.ks.p.k[1] - b.ks.p.k[1]);
  const gap =
    cards[1].ks.p.k[1] -
    cards[0].ks.p.k[1] -
    (cards[0].h * cards[0].ks.s.k[0]) / 100;
  expect(gap).toBeGreaterThan(100);
  expect(gap).toBeLessThan(130);
});

test("complete fixation sentence appears early in all three lessons while spoken timings remain separate", () => {
  for (const folder of [
    "pupils-pec/full-animation",
    "pupils-pec/full-animation/video",
    "pupils-advanced/full-animation",
  ]) {
    const base = "public/narration/" + folder;
    const script = JSON.parse(fs.readFileSync(base + "/script.json"));
    const first = script.cues.find((c) => c.id === "clear-view"),
      last = script.cues.find((c) => c.id === "avoid-light");
    expect(first.caption.en).toBe(
      "Make sure they do not look at the examiner or the light itself.",
    );
    expect(first.captionUntil).toBe(last.id);
    expect(last.start).toBeGreaterThan(first.start);
    expect(last.caption.en).toBe("");
    expect(fs.readFileSync(base + "/en.vtt", "utf8")).toContain(
      first.caption.en,
    );
    expect(fs.readFileSync(base + "/en.vtt", "utf8")).not.toContain(
      "\navoid-light\n",
    );
  }
});
