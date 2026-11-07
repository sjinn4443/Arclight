// Original PDF components, shared Lottie player, separate narration clock.
const fs = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const sharp = require("sharp");
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
function history(mode, secondAt) {
  if (mode !== "refer") {
    // One shared background, two original actors, with both sets of speech
    // bubbles. Keep a single PDF-to-stage scale for each actor's proportions.
    sourceInBox("history-examiner", [130, 610, 600, 590]);
    sourceInBox("history-patient", [735, 650, 395, 550]);
    for (let i = 1; i <= 2; i++) {
      const at = i === 1 ? 30 : secondAt;
      const top = i === 1 ? 165 : 405;
      sourceInBox(
        `history-method-bubble-${i}`,
        [30, top, 520, 220],
        mode === "method" ? at : 15,
      );
      sourceInBox(
        `history-cataract-bubble-${i}`,
        [665, top, 470, 220],
        mode === "cataract" ? at : at + 45,
      );
    }
    return;
  }
  const base = `history-${mode}-base`,
    source = assets.get(base),
    box = source.sourceBox;
  const placement = sourceInBox(base, [0, 0, W, H]);
  const scale = placement.width / box[2];
  for (let i = 1; i <= 2; i++) {
    const name = `history-${mode}-bubble-${i}`,
      b = assets.get(name).sourceBox;
    image(
      name,
      placement.x + (b[0] - box[0]) * scale,
      placement.y + (b[1] - box[1]) * scale,
      b[2] * scale,
      { o: fade(i === 1 ? 30 : secondAt) },
    );
  }
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
    const finalScale = layer.ks.s.k;
    const initialScale = finalScale.map((v, k) => (k === 2 ? v : v * 2.8));
    layer.ks.s = keys([
      [0, initialScale],
      [at + 60, initialScale],
      [at + 105, finalScale],
    ]);
  }
}

function method(section, secondAt) {
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
    await sharp(path.join(INPUT, name + ".svg"))
      .webp({ quality: 94, alphaQuality: 100 })
      .toFile(dest);
    const meta = await sharp(dest).metadata();
    assets.set(name, {
      id: name,
      w: meta.width,
      h: meta.height,
      u: "../images/",
      p: name + ".webp",
      e: 0,
      sourceBox: manifest[name].box,
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
      sourceInBox("acuity-method-distance", [35, 25, 480, 720]);
      sourceInBox("acuity-method-cover", [560, 25, 560, 720], 30);
      sourceInBox("acuity-method-pinhole", [50, 850, 420, 300], secondAt);
      sourceInBox("acuity-method-near", [650, 760, 450, 500], secondAt);
    } else if (index === 4) {
      sourceInBox("acuity-cataract-distance", [120, 35, 470, 500]);
      sourceInBox("acuity-cataract-down-1", [760, 150, 230, 230], 60);
      sourceInBox("acuity-cataract-pinhole", [120, 590, 470, 280], secondAt);
      sourceInBox(
        "acuity-cataract-no-gain",
        [760, 610, 230, 230],
        secondAt + 45,
      );
      sourceInBox("acuity-cataract-near", [120, 920, 470, 290], secondAt + 70);
      sourceInBox(
        "acuity-cataract-down-2",
        [760, 940, 230, 230],
        secondAt + 90,
      );
    } else if (index === 5) {
      sourceInBox("acuity-refer-distance", [70, 70, 1029, 780]);
      sourceInBox("acuity-refer-near", [80, 920, 470, 280], secondAt);
      sourceInBox("acuity-refer-up", [710, 920, 370, 280], secondAt);
    } else if (index % 3 === 0) method(Math.floor(index / 3) + 1, secondAt);
    else if (index === 7) twoPanels("front-cataract", secondAt);
    else if (index === 8) twoPanels("front-refer", secondAt);
    else if (index === 10) pupilResponses(secondAt);
    else if (index === 11) twoPanels("pupil-refer", secondAt, { wipe: true });
    else if (index === 13) {
      for (let n = 0; n < 4; n++)
        sourceInBox(
          `reflex-cataract-${n + 1}`,
          [65 + (n % 2) * 555, 90 + Math.floor(n / 2) * 600, 490, 490],
          n < 2 ? 30 + n * 75 : secondAt + (n - 2) * 75,
        );
    } else if (index === 14) twoPanels("reflex-refer", secondAt);
    else if (index === 16) twoPanels("fundus-cataract", secondAt);
    else if (index === 17)
      sourceInBox("fundus-refer-1", [45, 65, 1079, 1150], 30);
    const used = new Set(layers.flatMap((l) => (l.refId ? [l.refId] : [])));
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
      assets: [...used].map((id) => {
        const { sourceBox, ...a } = assets.get(id);
        return a;
      }),
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
