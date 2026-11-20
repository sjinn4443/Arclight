// Original PDF paths and shipped procedure artwork, with registered tool contact.
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { pathToFileURL } = require("node:url");
const sharp = require("sharp");
const {
  surfacePoints,
  ribbonOutline,
  buildRibbon,
} = require("./lib/eye-pad-shield-ribbon.cjs");
const ribbonFiles = new Map();
let paperGrain;
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "scrolly/eyeprocedures/apply-eye-pad-shield");
const SHARED = "scrolly/eyeprocedures/make-eye-pad-shield/images/";
const LOCAL = "scrolly/eyeprocedures/apply-eye-pad-shield/images/";
const W = 1169,
  H = 1280,
  FPS = 30;
const SOURCE = "images/pdf/Workshop/CoreExamination/FrontofEye.pdf";
const SOURCE_NODES = [
  809, 811, 813, 819, 820, 833, 834, 836, 837, 838, 839, 840, 841, 842, 843,
  844, 845, 846, 864, 865,
];
const c = (k) => ({ a: 0, k });
const keys = (values) =>
  values.length === 1
    ? c(values[0][1])
    : {
        a: 1,
        k: values.map(([t, s], i) => ({
          t,
          s: Array.isArray(s) ? s : [s],
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
      };
const col = (hex) =>
  hex
    .match(/\w\w/g)
    .map((v) => parseInt(v, 16) / 255)
    .concat(1);
const polygon = (v, closed = true) => ({
  v,
  i: v.map(() => [0, 0]),
  o: v.map(() => [0, 0]),
  c: closed,
});
const box = (x, y, w, h) =>
  polygon([
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ]);
function roundedBox(x, y, w, h, r) {
  const k = r * 0.55228475;
  const curve = polygon([
    [x + r, y],
    [x + w - r, y],
    [x + w, y + r],
    [x + w, y + h - r],
    [x + w - r, y + h],
    [x + r, y + h],
    [x, y + h - r],
    [x, y + r],
  ]);
  curve.o[1] = [k, 0];
  curve.i[2] = [0, -k];
  curve.o[3] = [0, k];
  curve.i[4] = [k, 0];
  curve.o[5] = [-k, 0];
  curve.i[6] = [0, k];
  curve.o[7] = [0, -k];
  curve.i[0] = [-k, 0];
  return curve;
}
let layers, assets, markers, op;
function layer(nm, options = {}) {
  const l = {
    ddd: 0,
    ind: layers.length + 1,
    ty: 4,
    nm,
    sr: 1,
    ks: {
      o: options.o || c(100),
      r: options.r || c(0),
      p: options.p || c([0, 0, 0]),
      a: c([0, 0, 0]),
      s: c([100, 100, 100]),
    },
    ao: 0,
    ip: 0,
    op,
    st: 0,
    bm: 0,
    shapes: [],
  };
  layers.unshift(l);
  return l;
}
function shape(nm, geometry, fill, options = {}) {
  const l = layer(nm, options);
  l.shapes = [
    {
      ty: "gr",
      it: [
        geometry,
        ...(fill ? [{ ty: "fl", c: c(col(fill)), o: c(100), r: 1 }] : []),
        ...(options.stroke
          ? [
              {
                ty: "st",
                c: c(col(options.stroke)),
                o: c(100),
                w: c(options.width || 4),
                lc: 2,
                lj: 2,
              },
            ]
          : []),
        {
          ty: "tr",
          p: c([0, 0]),
          a: c([0, 0]),
          s: c([100, 100]),
          r: c(0),
          o: c(100),
          sk: c(0),
          sa: c(0),
        },
      ],
    },
  ];
  return l;
}
const rect = (nm, x, y, w, h, r, fill, o = {}) =>
  shape(nm, { ty: "rc", p: c([x, y]), s: c([w, h]), r: c(r), d: 1 }, fill, o);
const ellipse = (nm, x, y, w, h, fill, o = {}) =>
  shape(nm, { ty: "el", p: c([x, y]), s: c([w, h]), d: 1 }, fill, o);
const fade = (at = 0) =>
  keys([
    [0, 0],
    [at, 0],
    [at + 20, 100],
  ]);
const contact = (name, start, end) =>
  markers.push({ tm: start, dr: end - start, cm: name });
const metaCache = new Map();
async function texture(nm, file, x, y, w, options = {}) {
  if (!metaCache.has(file))
    metaCache.set(file, await sharp(path.join(PUBLIC, file)).metadata());
  const meta = metaCache.get(file),
    id = "image-" + assets.length;
  assets.push({
    id,
    w: meta.width,
    h: meta.height,
    u:
      path.posix.relative(
        "scrolly/eyeprocedures/apply-eye-pad-shield/1",
        path.posix.dirname(file),
      ) + "/",
    p: path.basename(file),
    e: 0,
  });
  const l = layer(nm, options),
    scale = w / meta.width;
  l.ty = 2;
  delete l.shapes;
  l.refId = id;
  l.ks.a = c(options.anchor || [meta.width / 2, meta.height / 2, 0]);
  l.ks.s = c([scale * 100, scale * 100, 100]);
  l.ks.p = options.p || c([x, y, 0]);
  if (options.masks) {
    l.masksProperties = options.masks;
    l.hasMask = true;
  }
  return { layer: l, meta, scale };
}
function mask(name, curve) {
  return { inv: false, mode: "a", pt: curve, o: c(100), x: c(0), nm: name };
}
function sourcePaths(svg, keep) {
  return [...svg.matchAll(/<path\b[^>]*\/>/g)]
    .map((m) => m[0])
    .filter((s) => keep(Number(s.match(/data-source-node="(\d+)"/)?.[1])))
    .join("");
}
async function deriveArtwork() {
  await fs.mkdir(path.join(OUT, "images"), { recursive: true });
  const sourceSpec = JSON.parse(
    await fs.readFile(
      path.join(ROOT, "scripts/assets/apply-eye-pad-shield/source.json"),
      "utf8",
    ),
  );
  const pdfHash = crypto
    .createHash("sha256")
    .update(await fs.readFile(path.join(ROOT, sourceSpec.source)))
    .digest("hex");
  if (pdfHash !== sourceSpec.sha256)
    throw Error(
      "Front of Eye source changed; refresh the extracted original paths before rebuilding.",
    );
  const sourceSvg = await fs.readFile(
    path.join(ROOT, "scripts/assets/apply-eye-pad-shield/patient-source.svg"),
    "utf8",
  );
  const originalPaths = [
    ...sourceSvg.matchAll(/data-source-node="(\d+)"/g),
  ].map((m) => Number(m[1]));
  if (JSON.stringify(originalPaths) !== JSON.stringify(SOURCE_NODES))
    throw Error("Unexpected original patient paths");
  const eyeNodes = [839, 840, 841, 842, 843, 844, 864, 865];
  // Reuse the seated Cataract patient's shoulders, arms, fingers, trousers and chair.
  // Register his neckline to the original Front of Eye neck in PDF coordinates.
  const seatedSource =
    "scrolly/conditions/cataract/images/history-patient.webp";
  const bodySvg = await fs.readFile(
    path.join(ROOT, "scripts/assets/apply-eye-pad-shield/seated-body.svg"),
    "utf8",
  );
  const components = {
    "patient-base": (n) => !eyeNodes.includes(n),
    "patient-seated": (n) => ![811, 833, 834, ...eyeNodes].includes(n),
    "patient-left-eye": (n) => [840, 842, 843, 865].includes(n),
    "patient-right-eye": (n) => [839, 841, 844, 864].includes(n),
    "patient-closed-lid": (n) => n === 843,
    "patient-nose": (n) => [813, 837].includes(n),
  };
  for (const [name, keep] of Object.entries(components)) {
    const seated = name === "patient-seated";
    let paths = sourcePaths(sourceSvg, keep);
    if (seated) {
      paths += bodySvg.replace(
        "<svg ",
        '<svg x="210" y="115" width="259.35" height="399" ',
      );
    } else if (name === "patient-nose") {
      // Fill the interior of the nose up to the native painted line. Use the
      // exact same transform as node 837 so neither brow nor bridge is retouched.
      const line = sourcePaths(sourceSvg, (n) => n === 837);
      const transform = line.match(/transform="([^"]+)"/)[1];
      paths =
        `<path transform="${transform}" d="M1.247 15.625 Q4 16 7.8 15.7 L7.8 0 Q6 -2.2 2 -2.327 L-4 -1 L-5 3Z" fill="#f4caa7"/>` +
        line;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${seated ? 2000 : 1200}" height="${seated ? 2200 : 1440}" viewBox="${seated ? "205 118 250 275" : "285 118 150 180"}">${paths}</svg>`;
    await sharp(Buffer.from(svg))
      .webp({ lossless: true })
      .toFile(path.join(OUT, "images", name + ".webp"));
  }
  // Keep the original curved weave and give the pad the broad round outline in
  // the demonstration. The former narrow, upright oval is no longer used.
  const padMask = Buffer.from(
    '<svg width="480" height="480"><ellipse cx="240" cy="238" rx="235" ry="224" fill="white"/></svg>',
  );
  await sharp(path.join(PUBLIC, SHARED + "03and04foldedgauze.webp"))
    .resize(600, 600)
    .extract({ left: 60, top: 60, width: 480, height: 480 })
    .flatten({ background: "#f4f5ef" })
    .ensureAlpha()
    .composite([{ input: padMask, blend: "dest-in" }])
    .webp({ lossless: true })
    .toFile(path.join(OUT, "images/oval-pad.webp"));
  paperGrain = await sharp(path.join(PUBLIC, SHARED + "03tape.webp"))
    .extract({ left: 60, top: 65, width: 30, height: 30 })
    .flatten({ background: "#ede9dc" })
    .linear(0.15, 216)
    .png()
    .toBuffer();
  const equipment = await sharp(path.join(PUBLIC, SHARED + "01background.webp"))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (const [name, region] of Object.entries({
    scissors: { left: 700, top: 690, width: 355, height: 560 },
    "tape-roll": { left: 850, top: 50, width: 245, height: 270 },
  })) {
    const raw = await sharp(equipment.data, {
      raw: {
        width: equipment.info.width,
        height: equipment.info.height,
        channels: 4,
      },
    })
      .extract(region)
      .raw()
      .toBuffer();
    for (let z = 0; z < raw.length; z += 4) {
      const [r, g, b] = raw.subarray(z, z + 3);
      if (r > g * 1.15 && g > b * 1.15) raw[z + 3] = 0;
    }
    await sharp(raw, {
      raw: { width: region.width, height: region.height, channels: 4 },
    })
      .trim()
      .webp({ lossless: true })
      .toFile(path.join(OUT, "images", name + ".webp"));
  }
  const gauze = await sharp(path.join(OUT, "images/oval-pad.webp"))
    .png()
    .toBuffer();
  await sharp(
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="530" height="450">
    <ellipse cx="257" cy="226" rx="235" ry="185" fill="#c5c8bf"/>
    <image width="480" height="480" transform="translate(45 22) skewX(-7) scale(1 .82)" href="data:image/png;base64,${gauze.toString("base64")}"/>
  </svg>`),
  )
    .webp({ lossless: true })
    .toFile(path.join(OUT, "images/equipment-pad.webp"));
  // The source's formed, shallow cone exposes its full circular rim. This angle
  // covers the round pad, unlike the old edge-on triangular projection.
  const cone = await sharp(path.join(PUBLIC, SHARED + "12cone.webp"))
    .png()
    .toBuffer();
  await sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><image width="767" height="486" transform="translate(224 200) rotate(-90) scale(.49) translate(-384 -295)" href="data:image/png;base64,${cone.toString("base64")}"/></svg>`,
    ),
  )
    .webp({ lossless: true })
    .toFile(path.join(OUT, "images/applied-shield.webp"));
  for (const file of [
    "procedure-hand.webp",
    "tape-strip.webp",
    "shield-tape-2.webp",
  ])
    await fs.rm(path.join(OUT, "images", file), { force: true });
  for (const [name, file] of [
    ["examiner", "history-examiner.webp"],
    ["examiner-arm", "history-examiner-arm.webp"],
  ]) {
    await sharp(path.join(PUBLIC, "scrolly/conditions/cataract/images", file))
      .extract({ left: 0, top: 0, width: 560, height: 650 })
      .webp({ lossless: true })
      .toFile(path.join(OUT, "images", name + ".webp"));
  }
  for (const [name, file] of [
    ["pad", LOCAL + "equipment-pad.webp"],
    ["cone", SHARED + "12cone.webp"],
    ["roll", LOCAL + "tape-roll.webp"],
    ["scissors", LOCAL + "scissors.webp"],
  ]) {
    const { data, info } = await sharp(path.join(PUBLIC, file))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    for (let z = 0; z < data.length; z += 4) {
      data[z] = 44;
      data[z + 1] = 26;
      data[z + 2] = 10;
      data[z + 3] = Math.round(data[z + 3] * 0.42);
    }
    await sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .blur(2)
      .webp({ lossless: true })
      .toFile(path.join(OUT, "images", name + "-shadow.webp"));
  }
  // Wrap the actual woven disc around the receding temple. The inverse
  // projection compresses the weave continuously all the way to its curved edge.
  const cloth = await sharp(path.join(OUT, "images/oval-pad.webp"))
    .ensureAlpha()
    .raw()
    .toBuffer();
  const wrapped = Buffer.alloc(480 * 480 * 4);
  for (let y = 0; y < 480; y++) {
    const v = (y - 238) / 224,
      radius = 235 * Math.sqrt(Math.max(0, 1 - v * v));
    if (radius < 1) continue;
    for (let x = 0; x < 480; x++) {
      const u = (x - 240) / radius;
      const projected = (u + 0.78) / 1.72;
      if (projected < 0 || projected > 1) continue;
      // Invert x = .30t + .70t²; the far edge occupies less screen space.
      const t = (Math.sqrt(0.09 + 2.8 * projected) - 0.3) / 1.4;
      const sx = Math.max(
        0,
        Math.min(479, Math.round(240 + radius * (2 * t - 1))),
      );
      const src = (y * 480 + sx) * 4,
        dst = (y * 480 + x) * 4;
      const light = 1 - 0.24 * (1 - t) ** 4;
      for (let j = 0; j < 3; j++)
        wrapped[dst + j] = Math.round(cloth[src + j] * light);
      wrapped[dst + 3] = cloth[src + 3];
    }
  }
  await sharp(wrapped, { raw: { width: 480, height: 480, channels: 4 } })
    .webp({ lossless: true })
    .toFile(path.join(OUT, "images/face-pad.webp"));
  for (const [asset, output] of [
    ["face-pad", "face-pad-contact"],
    ["applied-shield", "shield-contact"],
  ]) {
    const file = path.join(OUT, "images", asset + ".webp");
    const { data, info } = await sharp(file)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 108;
      data[i + 1] = 77;
      data[i + 2] = 54;
    }
    await sharp(data, { raw: info })
      .blur(3)
      .webp({ lossless: true })
      .toFile(path.join(OUT, "images", output + ".webp"));
  }
  const scissorsPng = await sharp(path.join(OUT, "images/scissors.webp"))
    .png()
    .toBuffer();
  for (const [name, side] of [
    ["cutting-upper.webp", 1],
    ["cutting-lower.webp", 0],
  ]) {
    // The shanks overlap around the complete pivot. Keep both blade tips and
    // follow each metal shank from its own loop into the joint.
    const clip = side
      ? "M151 0H304V509H0V279L130 279Q147 258 164 202L152 145Z"
      : "M0 0H151L151 155Q143 213 168 268L180 283H304V509H0Z";
    await sharp(
      Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="304" height="509"><defs><clipPath id="half"><path d="${clip}"/></clipPath></defs><image width="304" height="509" href="data:image/png;base64,${scissorsPng.toString("base64")}" clip-path="url(#half)"/></svg>`,
      ),
    )
      .webp({ lossless: true })
      .toFile(path.join(OUT, "images", name));
  }
  await sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><pattern id="paper" width="30" height="30" patternUnits="userSpaceOnUse"><image width="30" height="30" href="data:image/png;base64,${paperGrain.toString("base64")}"/></pattern></defs><path d="M150 2 A148 148 0 1 1 149.99 2Z M150 65 A85 85 0 1 0 150.01 65Z" fill="url(#paper)" fill-rule="evenodd"/><circle cx="150" cy="150" r="125" fill="none" stroke="#e2e2df" stroke-width="1.4"/><circle cx="150" cy="150" r="146" fill="none" stroke="#e1e2df" stroke-width="3"/><path d="M223 124 L288 100" fill="none" stroke="#d0d2ce" stroke-width="3"/></svg>`,
    ),
  )
    .webp({ lossless: true })
    .toFile(path.join(OUT, "images/roll-face.webp"));
  const hashes = {};
  for (const file of [
    SOURCE,
    SHARED + "01background.webp",
    SHARED + "02cotton.webp",
    SHARED + "11cone.webp",
    seatedSource,
    SHARED + "scissorupperhand.webp",
    SHARED + "scissorlowerhand.webp",
    "videos/Workshop/PEC/8.Applypadandshield_720p.mp4",
    SHARED + "03and04foldedgauze.webp",
    SHARED + "03tape.webp",
    SHARED + "12cone.webp",
  ])
    hashes[file] = crypto
      .createHash("sha256")
      .update(await fs.readFile(path.join(PUBLIC, file)))
      .digest("hex");
  await fs.writeFile(
    path.join(OUT, "provenance.json"),
    JSON.stringify(
      {
        sourceDocument: SOURCE,
        sourcePdfNodes: SOURCE_NODES,
        sourceHashes: hashes,
        patient:
          "Original PDF face, hair and shirt paths; eyes/lid/nose separated, seated body, arms, lap and chair adapted from the existing Cataract history patient.",
        materials:
          "Round source-weave pad; original equipment and shallow formed cone; source paper wrapped to gauze, face and cone surfaces, with pinked ends and contact shadows.",
        anatomy:
          "No hand in skin cleaning: only the original cotton follows the periocular skin. Seated arms and fingers retain the source resting pose.",
        teaching:
          "Treated eye closes before pad contact. Tools share material contact points; the other eye stays uncovered at completion.",
      },
      null,
      2,
    ) + "\n",
  );
}
const SHIELD_WIDTH = 414;
const SHIELD_X = 366;
const SHIELD_Y = 581;
const ACTOR = { left: 17.5, top: 125.2, scale: 1.0125 };
const EYE = { x: 374, y: 574 };
async function patient({ closed = false, closeAt = null, small = false } = {}) {
  const s = small ? 0.33 : 1,
    dx = small ? 249 : 0,
    dy = small ? 102 : 0;
  const map = ([x, y]) => [
    584.5 + (x - 584.5) * s + dx,
    640 + (y - 640) * s + dy,
    0,
  ];
  const baseCenter = map([
    ACTOR.left + 600 * ACTOR.scale,
    ACTOR.top + 720 * ACTOR.scale,
  ]);
  await texture(
    "Original Front of Eye patient",
    LOCAL + (small ? "patient-seated.webp" : "patient-base.webp"),
    baseCenter[0],
    baseCenter[1],
    (small ? 2000 : 1200) * ACTOR.scale * s,
    ...(small ? [{ anchor: [1240, 720, 0] }] : []),
  );
  for (const [side, pdfX, pdfY] of [
    ["left", 329.0, 173.3],
    ["right", 351.7, 174.2],
  ]) {
    const px = (pdfX - 285) * 8,
      py = (pdfY - 118) * 8,
      stage = map([
        ACTOR.left + px * ACTOR.scale,
        ACTOR.top + py * ACTOR.scale,
      ]);
    const close = side === "left" && closed;
    const eye = await texture(
      "Original " + side + " eye",
      LOCAL + "patient-" + side + "-eye.webp",
      stage[0],
      stage[1],
      1200 * ACTOR.scale * s,
      { anchor: [px, py, 0] },
    );
    if (close) {
      eye.layer.ks.o =
        closeAt === null
          ? c(0)
          : keys([
              [0, 100],
              [closeAt, 100],
              [closeAt + 28, 0],
            ]);
      eye.layer.ks.s =
        closeAt === null
          ? c([100 * ACTOR.scale * s, 0, 100])
          : keys([
              [0, [100 * ACTOR.scale * s, 100 * ACTOR.scale * s, 100]],
              [closeAt, [100 * ACTOR.scale * s, 100 * ACTOR.scale * s, 100]],
              [closeAt + 28, [100 * ACTOR.scale * s, 0, 100]],
            ]);
    }
  }
  if (closed) {
    const pdfX = 328.6,
      pdfY = 171.0,
      px = (pdfX - 285) * 8,
      py = (pdfY - 118) * 8;
    const pos = map([EYE.x, EYE.y]);
    const lid = await texture(
      "Original lid, gently closed",
      LOCAL + "patient-closed-lid.webp",
      pos[0],
      pos[1],
      1200 * ACTOR.scale * s,
      {
        anchor: [px, py, 0],
        o:
          closeAt === null
            ? c(100)
            : keys([
                [0, 0],
                [closeAt + 16, 0],
                [closeAt + 28, 100],
              ]),
      },
    );
    lid.layer.ks.s = c([ACTOR.scale * s * 100, -ACTOR.scale * s * 35, 100]);
  }
}
async function nose() {
  await texture(
    "Original nose in front of the dressing",
    LOCAL + "patient-nose.webp",
    ACTOR.left + 600 * ACTOR.scale,
    ACTOR.top + 720 * ACTOR.scale,
    1200 * ACTOR.scale,
  );
}
async function pad(nm, x = 374, y = 594, w = 170, options = {}) {
  return texture(
    nm,
    LOCAL + (w > 300 ? "oval-pad.webp" : "face-pad.webp"),
    x,
    y,
    w,
    options,
  );
}
async function ribbon(
  nm,
  id,
  points,
  width,
  { motion = null, progress = null, opacity = null } = {},
) {
  if (!ribbonFiles.has(id))
    ribbonFiles.set(
      id,
      await buildRibbon({
        id,
        points,
        width,
        paper: paperGrain,
        squareStart: id === "unwound-feed",
        shadeBySlope: id === "shield-tape-1" || id === "shield-outer-tape",
        solidFill: id === "unwound-feed" ? "#e1e1e1" : null,
        outDir: path.join(OUT, "images"),
      }),
    );
  const art = ribbonFiles.get(id),
    x = art.left + art.width / 2,
    y = art.top + art.height / 2;
  const masks = progress
    ? [
        mask(
          "Curved tape contact reveal",
          keys(
            progress.map(([t, [from, to]]) => [
              t,
              [
                polygon(
                  ribbonOutline(
                    points,
                    width + 16,
                    from,
                    to,
                    6,
                    id === "unwound-feed",
                  ).map((p) => [p[0] - art.left, p[1] - art.top]),
                ),
              ],
            ]),
          ),
        ),
      ]
    : null;
  return texture(nm, LOCAL + art.file, x, y, art.width, {
    ...(motion ? { p: shifted(motion, x, y) } : {}),
    ...(opacity ? { o: opacity } : {}),
    ...(masks ? { masks } : {}),
  });
}
// During transport each whole strip lies straight against the loose pad.
// At contact its outline bends continuously into the same footprint as the
// stationary source-paper texture. Both shapes keep their pinked ends.
function approachingStrip(index, start, end, draped, motion) {
  const arrival = motion.at(-1)[0];
  const settled = arrival + 8;
  const straight = polygon(ribbonOutline(surfacePoints(start, end), 31));
  const curved = polygon(ribbonOutline(draped, 31));
  const contour = {
    ty: "sh",
    ks: keys([
      [arrival - 9, [straight]],
      [settled, [curved]],
    ]),
  };
  const shadow = shape(
    "Moving strip contact shadow " + index,
    contour,
    "705e4d",
    {
      o: c(23),
      p: shifted(motion, 3, 5),
    },
  );
  shadow.op = settled;
  const paper = shape(
    "Straight tape settling onto the face " + index,
    contour,
    "faf9f7",
    {
      p: shifted(motion, 0, 0),
      stroke: "ccc8be",
      width: 0.6,
    },
  );
  paper.op = settled;
  paper.shapes[0].it[1] = {
    ty: "gf",
    t: 1,
    r: 1,
    o: c(100),
    s: c(start),
    e: c(end),
    g: {
      p: 4,
      k: c([
        0, 0.98, 0.98, 0.97, 0.28, 0.92, 0.91, 0.9, 0.55, 0.99, 0.99, 0.98, 1,
        0.95, 0.94, 0.93,
      ]),
    },
  };
  return settled;
}
async function padTapes({ motion = null, fadeAt = null } = {}) {
  for (let n = 0; n < 3; n++) {
    const start = [345 + n * 31, 476 + n * 4],
      end = [332 + n * 34, 742];
    const points = surfacePoints(start, end, {
      x: 351,
      y: 594,
      rx: 105,
      ry: 99,
      depth: [23, 15, -12][n],
      face: true,
    });
    const settled = motion
      ? approachingStrip(n + 1, start, end, points, motion)
      : 0;
    const tape = await ribbon(
      "Tape on top of pad " + (n + 1),
      "face-tape-" + (n + 1),
      points,
      31,
    );
    tape.layer.ip = settled;
  }
  if (fadeAt !== null)
    for (let n = 0; n < 2; n++)
      await ribbon(
        "Additional diagonal securing tape " + (n + 1),
        "diagonal-tape-" + n,
        surfacePoints([415 + n * 35, 477], [310 + n * 40, 740], {
          x: 351,
          y: 594,
          rx: 105,
          ry: 99,
          depth: 24,
          face: true,
        }),
        32,
        { opacity: fadeAt === 0 ? c(100) : fade(fadeAt + n * 45) },
      );
}
// Project the strip across the two slopes of the shallow cone. The ends
// lie flat on skin. The visible nasal strip rounds the near side of the rim.
function shieldTapePoints(far) {
  const points = surfacePoints(
    far ? [433, 345] : [390, 345],
    far ? [402, 809] : [348, 813],
  );
  return points.map(([x, y], i) => {
    const t = i / (points.length - 1);
    const axial = (y - SHIELD_Y) / (far ? 163 : 178);
    const depth = Math.max(0, 1 - axial * axial);
    const crown = depth * depth;
    return [
      x + (far ? -16 : 46) * crown + 5 * Math.sin(Math.PI * t),
      y - 8 * crown,
      crown,
      -(1 - (far ? 0.12 : 0.22) * crown),
      (far ? 0.1 : 0.24) * axial * depth,
    ];
  });
}

async function applyShieldTape(name, id, far, start, end) {
  const points = shieldTapePoints(far),
    width = far ? 32 : 38;
  // The free end points towards the viewer. As the contact line travels
  // downward, each section rolls onto the rim and finally onto the cheek.
  const poses = [0, 0.12, 0.3, 0.47, 0.63, 0.8, 0.92, 1].map((fraction) => {
    const frame = start + Math.round((end - start) * fraction);
    const bent = points.map(([x, y, z, acrossX, acrossY], i) => {
      const t = i / (points.length - 1);
      const lift = Math.max(0, t - fraction) ** 1.45;
      return [x - 122 * lift, y - 92 * lift, z, acrossX, acrossY - 0.19 * lift];
    });
    return { frame, fraction, outline: polygon(ribbonOutline(bent, width)) };
  });
  const contour = {
    ty: "sh",
    ks: keys(poses.map((p) => [p.frame, [p.outline]])),
  };
  const visibility = (max) =>
    keys([
      [start, 0],
      [start + 6, max],
    ]);
  const shadow = shape("Lifted tape shadow " + id, contour, "584537", {
    o: visibility(17),
    p: c([4, 7, 0]),
  });
  const loose = shape("Unpressed end of " + id, contour, "f2f0eb", {
    o: visibility(100),
    stroke: "c7c4ba",
    width: 0.7,
  });
  shadow.ip = loose.ip = start;
  shadow.op = loose.op = end;
  const strip = await ribbon(name, id, points, width, {
    opacity: keys([
      [0, 0],
      [start, 0],
      [start + 5, 100],
    ]),
    progress: poses.map((p) => [p.frame, [0, Math.max(0.015, p.fraction)]]),
  });
  strip.layer.ip = start;
}
async function dressingShadow(nm, options = {}) {
  const cone = nm.startsWith("Shield");
  await texture(
    nm,
    LOCAL + (cone ? "shield-contact.webp" : "face-pad-contact.webp"),
    cone ? SHIELD_X + 4 : 378,
    cone ? SHIELD_Y + 5 : 599,
    cone ? SHIELD_WIDTH : 170,
    {
      anchor: cone ? [224, 200, 0] : [240, 240, 0],
      o: c(26),
      ...options,
    },
  );
}
async function dressedPatient() {
  await patient({ closed: true });
  await dressingShadow("Pad contact shadow");
  await pad("Original woven pad, stationary on the eye");
  await padTapes({ fadeAt: 0 });
}
async function bubbleProcedure() {
  const outer = layers;
  layers = [];
  rect("Procedure inset background", 584, 640, W, H, 0, "625f54");
  await patient({ closed: true });
  const approach = [
    [0, [-720, 70]],
    [45, [-720, 70]],
    [120, [0, 0]],
  ];
  await dressingShadow("Inset pad contact shadow", {
    o: keys([
      [0, 0],
      [100, 0],
      [120, 26],
    ]),
  });
  await pad("Pad placement demonstrated inside bubble", 374, 594, 170, {
    p: shifted(approach, 374, 594),
  });
  await padTapes({ motion: approach });
  await nose();
  const inset = layers;
  layers = outer;
  assets.push({ id: "procedure-inset", w: W, h: H, layers: inset });
  const l = layer("Actual pad application inside speech bubble", {
    o: fade(20),
  });
  l.ty = 0;
  delete l.shapes;
  l.refId = "procedure-inset";
  l.w = W;
  l.h = H;
  const scale = 0.94;
  l.ks.a = c([374, 594, 0]);
  l.ks.p = c([584, 272, 0]);
  l.ks.s = c([scale * 100, scale * 100, 100]);
  l.hasMask = true;
  l.masksProperties = [
    mask(
      "Rounded bubble interior",
      c(
        roundedBox(
          374 - 380 / scale,
          594 - 145 / scale,
          760 / scale,
          290 / scale,
          46 / scale,
        ),
      ),
    ),
  ];
}
function shifted(points, x, y) {
  return keys(points.map(([t, [dx, dy]]) => [t, [x + dx, y + dy, 0]]));
}
async function shield(x, y, w, options = {}) {
  return texture(
    "Original finished cone shield",
    LOCAL + "applied-shield.webp",
    x,
    y,
    w,
    { r: c(0), anchor: [224, 200, 0], ...options },
  );
}
function unspooledPoint(t) {
  // Front edge follows the tangent off the upper-right quadrant. The paper
  // spans the depth of the reel, then turns toward the table at the free end.
  return [
    455 + 330 * t - 220 * t * t + 200 * t * t * t,
    198 + 475 * t + 85 * t * t,
    0,
    0.98 - 0.12 * t,
    -0.08 - 0.36 * t,
  ];
}
async function scissorsHalf(side) {
  const [cutX, cutY] = unspooledPoint(35 / 64);
  const position = keys([
    [0, [1500, cutY, 0]],
    [53, [cutX + 193, cutY, 0]],
    [290, [cutX + 193, cutY, 0]],
    [330, [1500, cutY, 0]],
  ]);
  const openAngle = side === "upper" ? 104 : 76;
  await texture(
    "Complete scissors " + side,
    LOCAL + "cutting-" + side + ".webp",
    0,
    0,
    360,
    {
      anchor: [149, 291, 0],
      p: position,
      r: keys([
        [0, openAngle],
        [53, openAngle],
        [75, 90],
        [90, openAngle],
        [153, openAngle],
        [175, 90],
        [190, openAngle],
        [253, openAngle],
        [275, 90],
        [290, openAngle],
      ]),
      o: keys([
        [0, 0],
        [25, 0],
        [40, 100],
        [295, 100],
        [330, 0],
      ]),
    },
  );
}
async function fixedAxisRoll() {
  ellipse("Standing reel shadow", 361, 512, 263, 32, "38220f", { o: c(30) });
  await texture(
    "Original standing tape roll",
    LOCAL + "tape-roll.webp",
    312,
    335,
    350,
    {
      anchor: [103, 86, 0],
      r: c(-90),
    },
  );
  const outer = layers;
  layers = [];
  const face = await texture(
    "Paper rotates about its own fixed axle",
    LOCAL + "roll-face.webp",
    150,
    150,
    300,
  );
  face.layer.ks.r = keys([
    [0, 0],
    [20, 0],
    [55, 100],
    [120, 100],
    [155, 200],
    [220, 200],
    [255, 300],
  ]);
  const disc = layers;
  layers = outer;
  assets.push({ id: "fixed-axle-disc", w: 300, h: 300, layers: disc });
  const projection = layer("Fixed-axis roll face projection");
  projection.ty = 0;
  delete projection.shapes;
  projection.refId = "fixed-axle-disc";
  projection.w = 300;
  projection.h = 300;
  projection.ks.a = c([150, 150, 0]);
  projection.ks.p = c([312, 335, 0]);
  projection.ks.s = c([97, 116, 100]);
}
async function main() {
  await deriveArtwork();
  const {
    APPLY_EYE_PAD_SHIELD_STAGES: stages,
    APPLY_EYE_PAD_SHIELD_CLIPS: clips,
    APPLY_EYE_PAD_SHIELD_NARRATION_CUES: cues,
    APPLY_EYE_PAD_SHIELD_SOURCE_CLIPS: sourceClips,
  } = await import(
    pathToFileURL(path.join(ROOT, "public/js/applyEyePadShieldScroll.js"))
  );
  for (let i = 0; i < stages.length; i++) {
    layers = [];
    assets = [];
    markers = [];
    op = Math.round(stages[i].seconds * FPS);
    rect("Warm procedure background", W / 2, H / 2, W, H, 0, "aaa393");
    if (i === 0) {
      rect("Brown equipment table", 584, 640, W, H, 0, "59391c");
      const items = [
        [
          "Original woven pad on the table",
          LOCAL + "equipment-pad.webp",
          295,
          365,
          440,
          10,
        ],
        [
          "Original finished cone shield",
          SHARED + "12cone.webp",
          855,
          365,
          420,
          45,
        ],
        ["Original tape roll", LOCAL + "tape-roll.webp", 320, 900, 310, 80],
        [
          "Original scissors from Make equipment",
          LOCAL + "scissors.webp",
          810,
          900,
          405,
          115,
        ],
      ];
      for (const [index, [name, file, x, y, w, at]] of items.entries()) {
        await texture(
          name + " contact shadow",
          LOCAL + ["pad", "cone", "roll", "scissors"][index] + "-shadow.webp",
          x + 12,
          y - 87,
          w,
          { o: fade(at) },
        );
        await texture(name, file, x, y - 105, w, { o: fade(at) });
      }
    } else if (i === 1) {
      await patient({ small: true });
      await texture(
        "Original examiner, proportional upper-body crop",
        LOCAL + "examiner.webp",
        287,
        1022,
        850,
      );
      const arm = await texture(
        "Original explaining arm, shoulder pivot",
        LOCAL + "examiner-arm.webp",
        348,
        1091,
        850,
        { anchor: [320, 370, 0] },
      );
      arm.layer.ks.r = keys([
        [0, 0],
        [65, -3],
        [125, 0],
        [185, -2],
        [245, 0],
      ]);
      shape(
        "Speech bubble tail",
        {
          ty: "sh",
          ks: c(
            polygon([
              [235, 420],
              [308, 510],
              [385, 420],
            ]),
          ),
        },
        "ffffff",
        { o: fade(15) },
      );
      rect("White rounded speech bubble", 584, 272, 800, 330, 64, "ffffff", {
        o: fade(15),
      });
      rect("Speech bubble inner scene", 584, 272, 760, 290, 46, "625f54", {
        o: fade(20),
      });
      await bubbleProcedure();
    } else if (i === 2) {
      await patient({ closed: true });
      const cleaning = [
        [0, [-100, 570]],
        [45, [355, 534]],
        [95, [333, 575]],
        [145, [351, 616]],
        [190, [404, 627]],
        [220, [402, 595]],
        [275, [-100, 570]],
      ];
      await texture(
        "Original cotton gently cleans the eye area",
        SHARED + "02cotton.webp",
        0,
        0,
        98,
        { p: keys(cleaning.map(([t, [x, y]]) => [t, [x, y, 0]])) },
      );
      await nose();
      contact("Cotton gently cleans surrounding skin", 45, 220);
    } else if (i === 3) {
      rect("Brown tape preparation table", 584, 640, W, H, 0, "59391c");
      await fixedAxisRoll();
      await scissorsHalf("lower");
      const feed = Array.from({ length: 65 }, (_, i) => {
        const t = i / 64;
        return unspooledPoint(t);
      });
      // The taut length peels from the upper-right rim.
      // The blades cross its middle; the free portion moves away after the snip.
      const reveal = [[0, [0, 0.06]]];
      for (let n = 0; n < 3; n++) {
        const at = 20 + n * 100,
          cut = at + 55;
        reveal.push(
          [at, [0, n ? 35 / 64 : 0.06]],
          [at + 35, [0, 1]],
          [cut, [0, 1]],
          [cut + 1, [0, 35 / 64]],
        );
      }
      await ribbon(
        "Continuous tape pulled from the round roll",
        "unwound-feed",
        feed,
        104,
        { progress: reveal },
      );
      for (let n = 0; n < 3; n++) {
        const at = 20 + n * 100,
          cut = at + 55;
        await ribbon(
          "Cut strip separates only after snip " + (n + 1),
          "separated-tape",
          feed.slice(35),
          104,
          {
            opacity: keys([
              [0, 0],
              [cut, 0],
              [cut + 1, 100],
            ]),
            motion: [
              [0, [0, 0]],
              [cut + 1, [0, 0]],
              [cut + 28, [-385 + n * 228, 420]],
            ],
          },
        );
        contact("Unroll then snip strip " + (n + 1), at, cut);
      }
      await scissorsHalf("upper");
    } else if (i === 4) {
      rect("Brown pad preparation table", 584, 640, W, H, 0, "59391c");
      ellipse("Gauze contact shadow", 596, 673, 502, 476, "38220f", {
        o: c(40),
      });
      await pad("Original gauze eye pad", 585, 650, 500);
      for (let n = 0; n < 3; n++)
        await ribbon(
          "Tape fades in above the gauze " + (n + 1),
          "prepared-tape-" + (n + 1),
          surfacePoints([452 + n * 130, 330], [452 + n * 130, 974], {
            x: 585,
            y: 650,
            rx: 248,
            ry: 235,
            depth: [47, 10, -35][n],
          }),
          58,
          { opacity: fade(40 + n * 65) },
        );
    } else if (i === 5) {
      await patient({ closed: true, closeAt: 35 });
      const approach = [
        [0, [-720, 70]],
        [90, [-720, 70]],
        [180, [0, 0]],
      ];
      await dressingShadow("Pad contact shadow", {
        o: keys([
          [0, 0],
          [150, 0],
          [180, 26],
        ]),
      });
      await pad("Prepared pad approaches the closed eye", 374, 594, 170, {
        p: shifted(approach, 374, 594),
      });
      await padTapes({ motion: approach });
      const secureAt = Math.round(cues[5].seconds * 30) + 10;
      for (let n = 0; n < 2; n++)
        await ribbon(
          "Additional diagonal securing tape " + (n + 1),
          "diagonal-tape-" + n,
          surfacePoints([415 + n * 35, 477], [310 + n * 40, 740], {
            x: 351,
            y: 594,
            rx: 105,
            ry: 99,
            depth: 24,
            face: true,
          }),
          32,
          { opacity: fade(secureAt + n * 45) },
        );
      await nose();
      contact("Eye closes before the pad approaches", 35, 63);
      contact("Pad is placed before securing tape", 90, 180);
      contact("Three strips secure the pad in the same scene", 370, 500);
    } else if (i === 6) {
      await dressedPatient();
      const approach = [
        [0, [-365, -175]],
        [92, [0, 0]],
      ];
      await dressingShadow("Shield contact shadow", {
        o: keys([
          [0, 0],
          [68, 0],
          [92, 20],
        ]),
      });
      // The posterior strip catches the back rim. Only its forehead and
      // cheek tabs remain exposed after the cone covers the middle.
      await applyShieldTape(
        "Far rim securing tape",
        "shield-outer-tape",
        true,
        108,
        169,
      );
      await shield(SHIELD_X, SHIELD_Y, SHIELD_WIDTH, {
        p: shifted(approach, SHIELD_X, SHIELD_Y),
      });
      await applyShieldTape(
        "Tape above the shield 1",
        "shield-tape-1",
        false,
        175,
        256,
      );
      await nose();
      contact("Shield rests over the pad before tape appears", 0, 92);
    }
    if ([2, 5, 6].includes(i)) {
      for (const l of layers)
        if (l.nm !== "Warm procedure background") l.parent = 10000;
      const camera = layer("Clinical camera toward the shield");
      camera.ty = 3;
      delete camera.shapes;
      camera.ind = 10000;
      camera.ks.a = c([450, 640, 0]);
      camera.ks.p = c([607, 755, 0]);
      camera.ks.s = c([138, 138, 100]);
    }
    const dir = path.join(OUT, String(i + 1));
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, "data.json"),
      JSON.stringify({
        v: "5.13.0",
        fr: FPS,
        ip: 0,
        op,
        w: W,
        h: H,
        nm: stages[i].name,
        ddd: 0,
        assets,
        layers,
        markers,
      }),
    );
  }
  // The placement and securing scenes now share stage 6; stage 7 is the shield.
  await fs.rm(path.join(OUT, "8/data.json"), { force: true });
  const dir = path.join(
    ROOT,
    "public/narration/apply-eye-pad-shield/full-animation",
  );
  await fs.mkdir(dir, { recursive: true });
  const script = {
    schemaVersion: 1,
    title: "Apply an Eye Pad and Eye Shield",
    sourceVideo: "/videos/Workshop/PEC/8.Applypadandshield_720p.mp4",
    durationSeconds: clips.at(-1).end,
    defaultLanguage: "en",
    languages: {
      en: {
        label: "English",
        locale: "en-US",
        voice: "Microsoft Zira Desktop",
      },
      ko: {
        label: "한국어",
        locale: "ko-KR",
        voice: "Microsoft Heami Desktop",
      },
    },
    cues: cues.map((s, i) => ({
      id: sourceClips[i].cueIds[0],
      start: sourceClips[i].start,
      end: sourceClips[i].end,
      en: s.en,
      ko: s.ko,
    })),
    videoTitleCues: [
      { sourceText: "Preparation", translations: { ko: "준비" } },
      {
        sourceText: "Apply the eye pad",
        translations: { ko: "안대 패드 부착" },
      },
      {
        sourceText: "Apply the eye shield",
        translations: { ko: "눈 보호대 부착" },
      },
    ],
  };
  script.timedCues = Object.fromEntries(
    ["en", "ko"].map((language) => [
      language,
      script.cues.map((cue) => ({
        id: cue.id,
        start: cue.start,
        end: cue.end,
        text: cue[language],
      })),
    ]),
  );
  await fs.writeFile(
    path.join(dir, "script.json"),
    JSON.stringify(script, null, 2) + "\n",
  );
  console.log(
    "Built seven Apply Eye Pad / Shield scenes with eight original cues and narration script.",
  );
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
