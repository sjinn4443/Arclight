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
import { frameAtNarrationTime } from "../public/js/examinationScrollTiming.js";

const folder = "public/narration/pupils-advanced/full-animation";
const script = JSON.parse(fs.readFileSync(`${folder}/script.json`, "utf8"));
const scene = (i) =>
  JSON.parse(fs.readFileSync(`public${cfg.paths[i]}`, "utf8"));
const digest = (bytes) =>
  crypto.createHash("sha256").update(bytes).digest("hex");

test("Advanced is a distinct accessible row immediately below its PDF", () => {
  const doc = new JSDOM(fs.readFileSync("public/html/videos.html", "utf8"))
    .window.document;
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
    expect([data.w, data.h, data.fr, data.ip]).toEqual([1169, 1280, 30, 0]);
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
      if (stages[i].pecStageIndex == null)
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
  expect(pupil.ks.s.k.map((k) => [k.t, k.s[0]])).toEqual([
    [0, 100],
    [435, 100],
    [480, 53],
  ]);
  expect(list.find((l) => l.nm === "reflex-direct-label").ks.o.k[1].t).toBe(
    450,
  );
  expect(list.find((l) => l.nm === "reflex-consensual-label").ks.o.k[1].t).toBe(
    570,
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
    "public/scrolly/coreexam/pupils-advanced/images/near-target-scene.webp",
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
});

test("near hand settles before simultaneous highlight/arrows and face textures retain enough detail", () => {
  const list = allLayers(scene(13));
  const hand = list.find((l) => l.nm === "near-target-hand");
  expect(hand.ks.p.k[0].s[1] - hand.ks.p.k.at(-1).s[1]).toBe(80);
  const settled = hand.ks.p.k.at(-1).t;
  expect(list.find((l) => l.nm === "near-target-highlight").ks.o.k[1].t).toBe(
    settled,
  );
  for (const l of list.filter((l) => /^near-target-arrow-/.test(l.nm)))
    expect(l.masksProperties[0].pt.k[1].t).toBe(settled);
  for (const a of scene(14).assets.filter((a) => /^near-single/.test(a.id)))
    expect(a.w).toBeGreaterThan(1000);
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
