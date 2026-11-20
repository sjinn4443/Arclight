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
const rect = (x, y, w, h) => ({
  c: true,
  v: [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ],
  i: [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  o: [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
});
const assets = new Map();
const compositions = new Map();
const dynamicImages = [];
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
  if (options.wipe != null) {
    layer.hasMask = true;
    // Reveal the source from the unlit eye to the illuminated eye, keeping
    // the original light pool, instrument and iris geometry together.
    const at = options.wipe;
    layer.masksProperties = [
      {
        inv: false,
        mode: "a",
        pt: keys([
          [0, rect(0, 0, asset.w * 0.47, asset.h)],
          [at, rect(0, 0, asset.w * 0.47, asset.h)],
          [at + 45, rect(0, 0, asset.w, asset.h)],
        ]),
        o: c(100),
        x: c(0),
        nm: "Original before-to-after response",
      },
    ];
  }
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
function bubble(name, x, y, width, target, icons, at) {
  // Fixed body; only its triangular tail points down to the speaker.
  const h = 180;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect x="${x}" y="${y}" width="${width}" height="${h}" rx="32" fill="white"/><path d="M${x + width * 0.4} ${y + h - 1} L${x + width * 0.6} ${y + h - 1} L${target[0]} ${target[1]} Z" fill="white"/></svg>`;
  const id = "bubble-" + name;
  dynamicImages.push({ id, svg });
  assets.set(id, { id, w: W, h: H, u: "../images/", p: id + ".webp", e: 0 });
  image(id, 0, 0, W, { o: fade(at) });
  const gap = 26,
    total = icons.length * SYMBOL_SIZE + (icons.length - 1) * gap;
  icons.forEach((icon, i) =>
    glyph(icon, x + (width - total) / 2 + i * (SYMBOL_SIZE + gap), y + 35, at),
  );
}
function history(mode, secondAt) {
  if (mode !== "refer") {
    image("history-examiner", 15, 610, 640);
    const arm = image("history-examiner-arm", 15, 610, 640).layer;
    if (mode === "method") {
      const source = assets.get("history-examiner-arm");
      const anchor = [
        ((194 - 155) * source.w) / 80,
        ((200 - 139) * source.h) / 150,
      ];
      const scale = 640 / source.w;
      arm.ks.a = c(anchor);
      arm.ks.p = c([15 + anchor[0] * scale, 610 + anchor[1] * scale, 0]);
      arm.ks.r = keys([
        [0, 0],
        [45, -8],
        [90, 5],
        [145, -8],
        [200, 4],
        [270, 0],
        [315, -8],
        [370, 5],
        [435, -7],
        [500, 0],
      ]);
    }
    image("history-patient", 650, 690, 570);
  } else image("history-patient", 110, 600, 670);
  if (mode === "method") {
    bubble(
      "examiner-time",
      65,
      70,
      900,
      [300, 640],
      ["calendar", "question", "clock", "question"],
      30,
    );
    bubble(
      "examiner-symptoms",
      65,
      340,
      900,
      [320, 660],
      ["pain-eye", "question", "eyes", "question"],
      secondAt,
    );
  } else if (mode === "cataract") {
    bubble("patient-time", 160, 70, 900, [850, 710], ["calendar"], 30);
    bubble("patient-eyes", 160, 340, 900, [860, 735], ["eyes"], secondAt);
  } else {
    bubble(
      "patient-sudden",
      180,
      65,
      900,
      [440, 630],
      ["sudden", "front-eye", "back-eye"],
      30,
    );
    bubble(
      "patient-pain",
      180,
      335,
      900,
      [460, 655],
      ["pain-eye", "front-eye"],
      secondAt,
    );
  }
}
async function reuse(file, start, finish) {
  const original = JSON.parse(
    await fs.readFile(path.join(ROOT, "public", file)),
  );
  const prefix = "reuse-" + reusedScenes++ + "-";
  const ids = new Map(original.assets.map((a) => [a.id, prefix + a.id]));
  const originalAssets = new Map(original.assets.map((a) => [a.id, a]));
  const remap = (list) =>
    list.forEach((l) => {
      const artwork = originalAssets.get(l.refId);
      if (
        l.ty === 2 &&
        artwork?.w &&
        /icons\.ai|arrow/i.test(l.nm || "") &&
        l.ks?.s
      ) {
        const property = l.ks.s;
        const vectors = property.a
          ? property.k.flatMap((k) => [k.s, k.e].filter(Boolean))
          : [property.k];
        const extent = Math.max(
          ...vectors.map(
            (v) => Math.max(artwork.w * v[0], artwork.h * v[1]) / 100,
          ),
        );
        if (extent > 0)
          for (const v of vectors) {
            v[0] *= SYMBOL_SIZE / extent;
            v[1] *= SYMBOL_SIZE / extent;
          }
      }
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
  const factor = Math.max(W / original.w, H / original.h);
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
      p: c([W / 2, H / 2, 0]),
      a: c([original.w / 2, original.h / 2, 0]),
      s: c([factor * 100, factor * 100, 100]),
    },
    tm: keys([
      [start, 0],
      [finish - 1, (original.op - 1) / original.fr],
    ]),
    ip: start,
    op: finish,
    st: 0,
    w: original.w,
    h: original.h,
  });
}
function twoPanels(prefix, secondAt, options = {}) {
  sourceInBox(
    `${prefix}-1`,
    [64, 65, 1041, 520],
    15,
    options.wipe ? { wipe: 75 } : {},
  );
  sourceInBox(
    `${prefix}-2`,
    [64, 670, 1041, 520],
    secondAt,
    options.wipe ? { wipe: secondAt + 60 } : {},
  );
  for (let i = 1; i <= 2; i++)
    (assets.get(`${prefix}-${i}`).symbols || []).forEach((name, j) =>
      glyph(name, 900 - j * 135, i === 1 ? 70 : 675, i === 1 ? 15 : secondAt),
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

function _method(section, secondAt) {
  const base = `method-${section}-base`,
    placement = sourceInBox(base, [0, 0, W, 880]);
  image(`method-${section}-light`, placement.x, placement.y, placement.width, {
    o: keys([
      [0, 0],
      [45, 0],
      [70, 100],
      [secondAt - 20, 100],
      [secondAt, 35],
      [secondAt + 25, 100],
    ]),
  });
  const insert = {
    3: "front-cataract-1",
    4: "pupil-cataract-1",
    5: "reflex-cataract-1",
    6: "fundus-cataract-1",
  }[section];
  const lower = sourceInBox(
    insert,
    [125, 925, 919, 310],
    secondAt,
    section === 4 ? { wipe: secondAt + 45 } : {},
  );
  if (section === 4) {
    const box = assets.get(insert).sourceBox;
    const source = assets.get(`${insert}-pupil`).sourceBox;
    const scale = lower.width / box[2];
    image(
      `${insert}-pupil`,
      lower.x + (source[0] - box[0]) * scale,
      lower.y + (source[1] - box[1]) * scale,
      source[2] * scale,
      { o: fade(secondAt + 90) },
    );
  }
}
async function main() {
  const config = await import(
    pathToFileURL(path.join(ROOT, "public/js/cataractScroll.js")).href
  );
  const stages = config.CATARACT_STAGES;
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
    bg = index < 3 || [6, 7, 8, 14].includes(index) ? "#e8e3d5" : "#7b776c";
    background(bg);
    const secondAt = stage.cues[1].offset * FPS;
    if (index < 3) history(["method", "cataract", "refer"][index], secondAt);
    else if (index === 3) {
      await reuse(
        "/scrolly/coreexam/visualacuity/02DistanceVision/1/data.json",
        0,
        240,
      );
      await reuse(
        "/scrolly/coreexam/visualacuity/03TestWithPinholeOrGlasses/2/data.json",
        240,
        420,
      );
      await reuse(
        "/scrolly/coreexam/visualacuity/05NearVision/1/data.json",
        420,
        end,
      );
    } else if (index === 4) {
      const names = [
        "acuity-cataract-distance",
        "acuity-cataract-pinhole",
        "acuity-cataract-near",
      ];
      names.forEach((n, i) => {
        sourceInBox(n, [110, 55 + i * 395, 650, 340], i * 150);
        glyph(i === 1 ? "no-gain" : "down", 890, 160 + i * 395, i * 150 + 25);
      });
    } else if (index === 5) {
      sourceInBox("acuity-refer-distance", [80, 70, 1000, 740]);
      sourceInBox("acuity-refer-near", [100, 850, 650, 320], secondAt);
      glyph("up", 850, 850, secondAt);
      glyph("glasses", 850, 1020, secondAt);
    } else if (index === 6)
      await reuse(
        "/scrolly/coreexam/frontofeye/01ObservationandMagnifiedExamination/2/data.json",
        0,
        end,
      );
    else if (index === 7) twoPanels("front-cataract", secondAt);
    else if (index === 8) twoPanels("front-refer", secondAt);
    else if (index === 9)
      await reuse("/scrolly/coreexam/pupils-pec/4/data.json", 0, end);
    else if (index === 10) pupilResponses(secondAt);
    else if (index === 11) twoPanels("pupil-refer", secondAt, { wipe: true });
    else if (index === 12)
      await reuse("/scrolly/coreexam/fundalreflex/exam/1/data.json", 0, end);
    else if (index === 13)
      for (let n = 0; n < 4; n++)
        sourceInBox(
          `reflex-cataract-${n + 1}`,
          [65 + (n % 2) * 555, 90 + Math.floor(n / 2) * 600, 490, 490],
          n < 2 ? 30 + n * 75 : secondAt + (n - 2) * 75,
        );
    else if (index === 14) twoPanels("reflex-refer", secondAt);
    else if (index === 15)
      await reuse(
        "/scrolly/coreexam/ophths/DO/03HowtoExamine/1/data.json",
        0,
        end,
      );
    else if (index === 16) twoPanels("fundus-cataract", secondAt);
    else if (index === 17)
      sourceInBox("fundus-refer-1", [45, 65, 1079, 1150], 30);
    if (index === 17)
      (assets.get("fundus-refer-1").symbols || []).forEach((n, j) =>
        glyph(n, 980 - j * 135, 30, 30),
      );
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
  for (const { id, svg } of dynamicImages)
    await sharp(Buffer.from(svg))
      .webp({ lossless: true })
      .toFile(path.join(OUT, "images", id + ".webp"));
  // Do not ship intermediate assets that the final scene graph does not use.
  for (const name of names)
    if (!allUsed.has(name))
      await fs.unlink(path.join(OUT, "images", name + ".webp"));
  const provenance = JSON.parse(
    await fs.readFile(path.join(INPUT, "provenance.json")),
  );
  provenance.stages = stages.map((s) => s.art);
  provenance.readingOrder =
    "Each source row: examination, cataract-compatible findings, alternative causes/referral. Green row 5 is explicitly abnormal cataract artwork.";
  await fs.writeFile(
    path.join(OUT, "provenance.json"),
    JSON.stringify(provenance, null, 2) + "\n",
  );
  const narration = path.join(ROOT, "public/narration/cataract/full-animation");
  await fs.mkdir(narration, { recursive: true });
  let clock = 1;
  const cues = stages.flatMap((s) => {
    const start = clock;
    clock += s.seconds;
    return s.cues.map(({ offset, end, ...cue }) => ({
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
    languages: config.CATARACT_LANGUAGES,
    cues,
    videoTitleCues: config.CATARACT_SECTIONS.map((s, i) => ({
      sourceText: s.title,
      translations: { ko: config.CATARACT_SECTION_KOREAN[i] },
    })),
  };
  await fs.writeFile(
    path.join(narration, "script.json"),
    JSON.stringify(script, null, 2) + "\n",
  );
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
