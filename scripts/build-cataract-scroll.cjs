// Original PDF components, shared Lottie player, separate narration clock.
const fs = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const sharp = require("sharp");
sharp.cache(false);
const ROOT = path.resolve(__dirname, "..");
const WORK = process.env.CATARACT_WORK_DIR || path.join(ROOT, "tmp/cataract");
const INPUT = path.join(WORK, "layers");
const OUT = path.join(ROOT, "public/scrolly/conditions/cataract");
const W = 1169,
  H = 1280,
  FPS = 30;
const c = (k) => ({ a: 0, k });
const keys = (values) => ({
  a: 1,
  k: values.map(([t, v], i) => ({
    t,
    s: Array.isArray(v) ? v : [v],
    ...(i < values.length - 1
      ? {
          e: Array.isArray(values[i + 1][1])
            ? values[i + 1][1]
            : [values[i + 1][1]],
          i: { x: [0.667], y: [0.667] },
          o: { x: [0.333], y: [0.333] },
        }
      : {}),
  })),
});
const fade = (at, duration = 15) =>
  at === 0
    ? c(100)
    : keys([
        [0, 0],
        [at, 0],
        [at + duration, 100],
      ]);
const assets = new Map();
const compositions = new Map();
let gesturePaths;
let reusedScenes = 0;
let layers, end, bg;
function image(name, x, y, width, options = {}) {
  const asset = assets.get(name);
  if (!asset) throw Error(`Missing source component ${name}`);
  const height = (asset.h * width) / asset.w;
  const layer = {
    ddd: 0,
    ty: 2,
    ind: layers.length + 1,
    nm: options.name || name,
    refId: name,
    sr: 1,
    ks: {
      o: options.o || c(100),
      r: c(0),
      p: c([x + width / 2, y + height / 2, 0]),
      a: c([asset.w / 2, asset.h / 2, 0]),
      s: c([(width / asset.w) * 100, (width / asset.w) * 100, 100]),
    },
    ao: 0,
    ip: 0,
    op: end,
    st: 0,
    bm: 0,
  };
  layers.unshift(layer);
  return { layer, width, height, x, y };
}
function sourceInBox(name, box, at = 0, options = {}) {
  const asset = assets.get(name),
    [x, y, width, height] = box;
  const scale = Math.min(width / asset.w, height / asset.h);
  return image(
    name,
    x + (width - asset.w * scale) / 2,
    y + (height - asset.h * scale) / 2,
    asset.w * scale,
    { o: fade(at), ...options },
  );
}
function background(color) {
  layers.push({
    ddd: 0,
    ty: 1,
    ind: 999,
    nm: "Full stage background",
    sw: W,
    sh: H,
    sc: color,
    sr: 1,
    ks: {
      o: c(100),
      r: c(0),
      p: c([W / 2, H / 2, 0]),
      a: c([W / 2, H / 2, 0]),
      s: c([100, 100, 100]),
    },
    ip: 0,
    op: end,
    st: 0,
    bm: 0,
  });
}
const SYMBOL_SIZE = 110;
function glyph(name, x, y, at = 0) {
  return sourceInBox(
    name.startsWith("symbol-") ? name : "symbol-" + name,
    [x, y, SYMBOL_SIZE, SYMBOL_SIZE],
    at,
  );
}
// Move the original Bezier points and their handles together. Everything up to
// the wrist, including the silhouette hiding the clipboard, stays registered.
function wristPose(curve, degrees, asset) {
  const [left, top, width, height] = asset.sourceBox;
  const points = curve.map(([x, y]) => {
    const weight = Math.max(0, Math.min(1, (x - 215) / 6));
    const angle =
      ((degrees * Math.PI) / 180) * weight * weight * (3 - 2 * weight);
    const dx = x - 215,
      dy = y - 193;
    return [
      ((215 + dx * Math.cos(angle) - dy * Math.sin(angle) - left) * asset.w) /
        width,
      ((193 + dx * Math.sin(angle) + dy * Math.cos(angle) - top) * asset.h) /
        height,
    ];
  });
  const shape = { c: true, v: [], i: [], o: [] };
  const delta = (handle, vertex) => handle.map((value, i) => value - vertex[i]);
  for (let i = 0; i < points.length - 1; i += 3) {
    shape.v.push(points[i]);
    shape.i.push(delta(points[i ? i - 1 : points.length - 2], points[i]));
    shape.o.push(delta(points[i + 1], points[i]));
  }
  return shape;
}

function historyActor(name, x, y, width) {
  // Face the two speakers towards each other, on the side indicated by each
  // original PDF balloon. Only the people are mirrored, including the gesture.
  const { layer } = image(name, x, y, width);
  layer.ks.s.k[0] *= -1;
  return layer;
}

function history(mode, secondAt) {
  if (mode !== "refer") {
    // The mobile replay control occupies the lower-right of the held frame.
    const examiner = [550, 320, 415];
    const body = historyActor("history-examiner", ...examiner);
    if (mode === "method") {
      const asset = assets.get("history-examiner-arm");
      const poses = [
        [0, 0],
        [65, -13],
        [115, 0],
        [secondAt, 0],
        [secondAt + 55, -11],
        [secondAt + 110, 0],
      ];
      layers.unshift({
        ty: 4,
        ind: layers.length + 1,
        nm: "Examiner gestures at the wrist",
        ks: body.ks,
        ip: 0,
        op: end,
        st: 0,
        sr: 1,
        bm: 0,
        shapes: gesturePaths
          .slice()
          .reverse()
          .map(({ fill, curve }) => ({
            ty: "gr",
            it: [
              {
                ty: "sh",
                ks: keys(
                  poses.map(([t, angle]) => [
                    t,
                    wristPose(curve, angle, asset),
                  ]),
                ),
              },
              {
                ty: "fl",
                c: c(
                  fill
                    .slice(1)
                    .match(/../g)
                    .map((hex) => parseInt(hex, 16) / 255),
                ),
                o: c(100),
                r: 1,
              },
              {
                ty: "tr",
                p: c([0, 0]),
                a: c([0, 0]),
                s: c([100, 100]),
                r: c(0),
                o: c(100),
              },
            ],
          })),
      });
    } else historyActor("history-examiner-arm", ...examiner);
    historyActor("history-patient", 49, 448, 435);
  } else historyActor("history-patient", 122, 389, 545);

  const balloons = {
    method: [
      ["examiner-time", 295, 144, 422],
      ["examiner-symptoms", 295, 336, 422],
    ],
    cataract: [
      ["patient-time", 282, 335, 273],
      ["patient-eyes", 282, 504, 273],
    ],
    refer: [
      ["patient-sudden", 408, 280, 515],
      ["patient-pain", 408, 550, 475],
    ],
  };
  balloons[mode].forEach(([name, x, y, width], i) =>
    image("bubble-" + name, x, y, width, { o: fade(i ? secondAt : 12) }),
  );
}
async function reuse(file, box) {
  const original = JSON.parse(
    await fs.readFile(path.join(ROOT, "public", file)),
  );
  const prefix = "reuse-" + reusedScenes++ + "-";
  const ids = new Map(original.assets.map((a) => [a.id, prefix + a.id]));
  const remap = (list) =>
    list.forEach((l) => {
      if (l.refId) l.refId = ids.get(l.refId);
    });
  remap(original.layers);
  for (const a of original.assets) {
    a.id = ids.get(a.id);
    if (a.layers) {
      remap(a.layers);
      compositions.set(a.id, a);
    } else if (a.p) {
      const name = a.id + path.extname(a.p);
      await fs.copyFile(
        path.resolve(ROOT, "public", "." + path.dirname(file), a.u || "", a.p),
        path.join(OUT, "images", name),
      );
      assets.set(a.id, { ...a, u: "../images/", p: name, e: 0 });
    }
  }
  const id = prefix + "scene";
  compositions.set(id, {
    id,
    layers: original.layers,
    w: original.w,
    h: original.h,
  });
  const [x, y, width, height] = box;
  const factor = Math.min(width / original.w, height / original.h);
  layers.unshift({
    ty: 0,
    ddd: 0,
    ind: layers.length + 1,
    nm: "Detailed guide: " + file,
    refId: id,
    sr: 1,
    ks: {
      o: c(100),
      r: c(0),
      p: c([x + width / 2, y + height / 2, 0]),
      a: c([original.w / 2, original.h / 2, 0]),
      s: c([factor * 100, factor * 100, 100]),
    },
    tm: keys([
      [0, original.ip / original.fr],
      [end - 1, (original.op - 1) / original.fr],
    ]),
    ip: 0,
    op: end,
    st: 0,
    w: original.w,
    h: original.h,
  });
}
function twoPanels(prefix, secondAt) {
  sourceInBox(prefix + "-1", [64, 95, 1041, 490], 15);
  sourceInBox(prefix + "-2", [64, 670, 1041, 520], secondAt);
  for (let i = 1; i <= 2; i++)
    (assets.get(`${prefix}-${i}`).symbols || []).forEach((name, j) =>
      glyph(name, 805 - j * 135, i === 1 ? 90 : 675, i === 1 ? 15 : secondAt),
    );
  for (let i = 1; i <= 2; i++)
    (assets.get(`${prefix}-${i}`).arrows || []).forEach((n) =>
      glyph(n, 530, i === 1 ? 280 : 885, i === 1 ? 75 : secondAt + 60),
    );
}
function pupilResponses(secondAt) {
  for (const [i, at] of [
    [1, 0],
    [2, secondAt],
  ]) {
    const name = `pupil-cataract-${i}`;
    const placement = sourceInBox(
      name,
      [64, i === 1 ? 65 : 670, 1041, 520],
      at === 0 ? 15 : at,
    );
    const box = assets.get(name).sourceBox;
    const source = assets.get(`${name}-pupil`).sourceBox;
    const scale = placement.width / box[2];
    const { layer } = image(
      `${name}-pupil`,
      placement.x + (source[0] - box[0]) * scale,
      placement.y + (source[1] - box[1]) * scale,
      source[2] * scale,
      {
        o: fade(at === 0 ? 15 : at),
        name: "Original source pupil contracts after illumination",
      },
    );
    (assets.get(name).arrows || []).forEach((n) =>
      glyph(n, 530, i === 1 ? 280 : 885, at + 60),
    );
    const finalScale = layer.ks.s.k;
    const initialScale = finalScale.map((v, k) => (k === 2 ? v : v * 2.8));
    layer.ks.s = keys([
      [0, initialScale],
      [at + 60, initialScale],
      [at + 105, finalScale],
    ]);
  }
}

const techniques = {
  distance: ["acuity-method-distance", "visualacuity/02DistanceVision/1"],
  pinhole: [
    "acuity-method-pinhole",
    "visualacuity/03TestWithPinholeOrGlasses/2",
  ],
  near: ["acuity-method-near", "visualacuity/05NearVision/1"],
  "front-method": [
    "method-3",
    "frontofeye/01ObservationandMagnifiedExamination/2",
  ],
  "pupils-method": ["method-4", "pupils-pec/4"],
  "reflex-method": ["method-5", "fundalreflex/exam/1"],
  "fundoscopy-method": ["method-6", "ophths/DO/02PositioningandFlightPath/4"],
};

async function showTechnique(art) {
  const [source, guide] = techniques[art];
  const box = [35, 25, W - 70, 495];
  if (source.startsWith("method-")) {
    const placement = sourceInBox(source + "-base", box);
    image(source + "-light", placement.x, placement.y, placement.width, {
      o: keys([
        [0, 0],
        [30, 0],
        [65, 100],
      ]),
    });
  } else {
    sourceInBox(source, box, 6);
  }
  await reuse("/scrolly/coreexam/" + guide + "/data.json", [
    24,
    535,
    W - 48,
    720,
  ]);
}

// Leave both columns on screen for the final comparison. Reattach the source
// status symbols above their own panels instead of covering a pupil or fundus.
function finding(name, box, at) {
  const [x, y, width, height] = box;
  sourceInBox(name, [x, y + 115, width, height - 115], at);
  (assets.get(name).symbols || []).forEach((symbol, i) =>
    glyph(symbol, x + width - (i + 1) * 120, y, at),
  );
}

const findingCategories = {
  "history-gradual": "cataract",
  "history-urgent": "other-cause",
  "acuity-results": "cataract",
  refraction: "other-cause",
  "pupils-response": "cataract",
  "pupils-comparison": "other-cause",
  "reflex-opacity": "cataract",
  "reflex-patterns": "cataract",
  "reflex-comparison": "other-cause",
};

function categoryBadge(category, right, top, at = 0) {
  sourceInBox("badge-" + category, [right - 110, top, 110, 110], at);
}

function comparisonFrame(x, width, at) {
  const height = 1160;
  layers.unshift({
    ty: 4,
    ind: layers.length + 1,
    nm: "Comparison panel",
    ks: {
      o: fade(at),
      r: c(0),
      p: c([x + width / 2, 60 + height / 2, 0]),
      a: c([0, 0, 0]),
      s: c([100, 100, 100]),
    },
    shapes: [
      { ty: "rc", p: c([0, 0]), s: c([width, height]), r: c(28) },
      { ty: "st", c: c([1, 1, 1]), o: c(60), w: c(4), lc: 2, lj: 2 },
    ],
    ip: 0,
    op: end,
    st: 0,
    sr: 1,
  });
}

function showComparison(prefix, frames) {
  comparisonFrame(18, 552, frames[0]);
  comparisonFrame(599, 552, frames[2]);
  for (let i = 0; i < 2; i++) {
    finding(
      prefix + "-cataract-" + (i + 1),
      [38, 215 + 470 * i, 510, 410],
      frames[i],
    );
  }
  if (prefix === "fundus") {
    finding("fundus-refer-1", [616, 290, 520, 690], frames[2]);
  } else {
    for (let i = 0; i < 2; i++) {
      finding(
        "front-refer-" + (i + 1),
        [620, 215 + 470 * i, 510, 410],
        frames[i + 2],
      );
    }
  }
  categoryBadge("cataract", 560, 70, frames[0]);
  categoryBadge("other-cause", 1141, 70, frames[2]);
}

async function compose(stage) {
  const art = stage.art;
  const frames = stage.cues.map((cue) => cue.offset * FPS);
  if (techniques[art]) return showTechnique(art);
  switch (art) {
    case "history-method":
      return history("method", frames[1]);
    case "history-gradual":
      return history("cataract", frames[1]);
    case "history-urgent":
      return history("refer", frames[1]);
    case "acuity-results":
      ["distance", "pinhole", "near"].forEach((test, i) => {
        sourceInBox(
          "acuity-cataract-" + test,
          [110, 55 + i * 395, 650, 340],
          frames[i] + 6,
        );
        glyph(i === 1 ? "no-gain" : "down", 890, 160 + i * 395, frames[i] + 25);
      });
      return;
    case "refraction":
      sourceInBox("acuity-refer-distance", [56, 130, 550, 640], 6);
      sourceInBox("acuity-refer-patient", [570, 150, 520, 660], 6);
      sourceInBox("acuity-refer-near", [100, 850, 650, 320], frames[1]);
      glyph("up", 850, 850, 30);
      glyph("glasses", 850, 1020, frames[1]);
      return;
    case "front-comparison":
      return showComparison("front", frames);
    case "pupils-response":
      return pupilResponses(frames[1]);
    case "pupils-comparison":
      return twoPanels("pupil-refer", frames[1]);
    case "reflex-opacity":
      [1, 2].forEach((n, i) =>
        sourceInBox(
          "reflex-cataract-" + n,
          [70 + i * 535, 340, 500, 600],
          8 + i * 90,
        ),
      );
      return;
    case "reflex-patterns":
      for (let i = 0; i < 4; i++)
        sourceInBox(
          "reflex-cataract-" + (i + 1),
          [65 + (i % 2) * 555, 90 + Math.floor(i / 2) * 600, 490, 490],
          i < 2 ? 0 : 20 + (i - 2) * 90,
        );
      return;
    case "reflex-comparison":
      return twoPanels("reflex-refer", frames[1]);
    case "fundoscopy-comparison":
      return showComparison("fundus", frames);
    default:
      throw new Error("Unknown cataract scene: " + art);
  }
}
async function main() {
  const config = await import(
    pathToFileURL(path.join(ROOT, "public/js/cataractScroll.js")).href
  );
  const stages = config.CATARACT_STAGES;
  gesturePaths = JSON.parse(
    await fs.readFile(path.join(INPUT, "history-gesture.json")),
  );
  const manifest = JSON.parse(
    await fs.readFile(path.join(INPUT, "manifest.json")),
  );
  await fs.mkdir(path.join(OUT, "images"), { recursive: true });
  // Convert only components referenced by the scenes. Keep source rasters
  // sharp enough for phone/iPad display and all source proportions unchanged.
  const names = Object.keys(manifest).filter(
    (n) => !/^method-[1-6]$|^(cataract|refer)-[1-6]$/.test(n),
  );
  for (const name of names) {
    const dest = path.join(OUT, "images", name + ".webp");
    let raster = sharp(path.join(INPUT, name + ".svg"));
    if (name.startsWith("symbol-")) raster = raster.trim();
    await raster.webp({ quality: 94, alphaQuality: 100 }).toFile(dest);
    const meta = await sharp(dest).metadata();
    assets.set(name, {
      id: name,
      w: meta.width,
      h: meta.height,
      u: "../images/",
      p: name + ".webp",
      e: 0,
      sourceBox: manifest[name].box,
      symbols: manifest[name].symbols || [],
      arrows: manifest[name].arrows || [],
    });
  }
  const allUsed = new Set();
  for (const [index, stage] of stages.entries()) {
    layers = [];
    end = stage.seconds * FPS;
    if (["near", "distance", "pinhole"].includes(stage.art)) bg = "#cfc9b7";
    else if (
      stage.art.startsWith("history-") ||
      stage.art.startsWith("front-") ||
      techniques[stage.art]
    )
      bg = "#e8e3d5";
    else bg = "#7b776c";
    background(bg);
    await compose(stage);
    const category = findingCategories[stage.art];
    if (category) categoryBadge(category, W - 24, 24);
    const used = new Set(),
      usedComps = new Set();
    function collect(list) {
      for (const l of list) {
        if (!l.refId) continue;
        if (compositions.has(l.refId)) {
          usedComps.add(l.refId);
          collect(compositions.get(l.refId).layers);
        } else used.add(l.refId);
      }
    }
    collect(layers);
    used.forEach((id) => allUsed.add(id));
    const data = {
      v: "5.13.0",
      fr: FPS,
      ip: 0,
      op: end,
      w: W,
      h: H,
      nm: `Cataract: ${stage.art}`,
      ddd: 0,
      assets: [...used]
        .map((id) => {
          const { sourceBox, symbols, arrows, ...a } = assets.get(id);
          return a;
        })
        .concat([...usedComps].map((id) => compositions.get(id))),
      layers,
      markers: [],
    };
    const dir = path.join(OUT, String(index + 1));
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, "data.json"), JSON.stringify(data));
  }
  // Do not ship intermediate assets that the final scene graph does not use.
  for (const name of names)
    if (!allUsed.has(name))
      await fs.unlink(path.join(OUT, "images", name + ".webp"));
  const provenance = JSON.parse(
    await fs.readFile(path.join(INPUT, "provenance.json")),
  );
  provenance.stages = stages.map((s) => s.art);
  provenance.readingOrder =
    "Read each row from examination to the illustrated response to assessment/referral. The centre column has row-specific meaning. Row 5 shows four cataract examples.";
  await fs.writeFile(
    path.join(OUT, "provenance.json"),
    JSON.stringify(provenance, null, 2) + "\n",
  );
  const narration = path.join(ROOT, "public/narration/cataract/full-animation");
  await fs.mkdir(narration, { recursive: true });
  const scriptPath = path.join(narration, "script.json");
  let previous = {};
  try {
    previous = JSON.parse(await fs.readFile(scriptPath, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  // Translations of recorded cues can be authored separately from the scenes.
  // Reassociate by stable cue ID when splitting or combining replay points.
  const previousCues = new Map(
    (previous.cues || []).map((cue) => [cue.id, cue]),
  );
  const previousTitles = new Map(
    (previous.videoTitleCues || []).map((cue) => [
      cue.sourceText,
      cue.translations,
    ]),
  );
  let clock = 1;
  const cues = stages.flatMap((s) => {
    const start = clock;
    clock += s.seconds;
    return s.cues.map(({ offset, end, ...cue }) => ({
      ...previousCues.get(cue.id),
      ...cue,
      start: start + offset,
      end: start + end,
    }));
  });
  const script = {
    schemaVersion: 1,
    title: "Cataract",
    sourceDocument: "Cataract_Edit5.pdf",
    durationSeconds: clock,
    defaultLanguage: "en",
    languages: Object.fromEntries(
      Object.entries(config.CATARACT_LANGUAGES).map(([lang, settings]) => [
        lang,
        { ...previous.languages?.[lang], ...settings },
      ]),
    ),
    cues,
    videoTitleCues: config.CATARACT_SECTIONS.map((s, i) => ({
      sourceText: s.title,
      translations: {
        ...previousTitles.get(s.title),
        ko: config.CATARACT_SECTION_KOREAN[i],
      },
    })),
  };
  await fs.writeFile(scriptPath, JSON.stringify(script, null, 2) + "\n");
  require("./lib/pupils-caption-authoring.cjs").writeCaptions(
    script,
    narration,
  );
  console.log(
    `Built ${stages.length} original-art scenes, ${cues.length} bilingual cues, ${clock}s.`,
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
