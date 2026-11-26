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
  // Warm porous backing and fine broken fibres, as on the reference strips.
  const strip = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="232" viewBox="0 0 16 116">
    <defs>
      <pattern id="paper" width="15" height="15" patternUnits="userSpaceOnUse"><image width="15" height="15" href="data:image/png;base64,${paperGrain.toString("base64")}"/></pattern>
      <pattern id="fibres" width="7" height="11" patternUnits="userSpaceOnUse">
        <path d="M1 0l2 3m2 0L3 7m-3 1 2 2m3-2 1 3" stroke="#805f3b" stroke-width=".8" opacity=".72"/>
        <path d="M0 2l2 2m4-3L4 5m-2 2 2 2" stroke="#fff2ce" stroke-width="1" opacity=".78"/>
      </pattern>
      <rect id="strip" x="1.1" y=".7" width="13.8" height="114.6" rx="2.3"/>
    </defs>
    <use href="#strip" fill="#c4a276" opacity=".65"/>
    <use href="#strip" fill="url(#paper)" opacity=".1"/>
    <use href="#strip" fill="url(#fibres)"/>
  </svg>`;
  await sharp(Buffer.from(strip))
    .webp({ lossless: true })
    .toFile(path.join(OUT, "images/steri-strip.webp"));
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
  const { data: conePixels, info: coneInfo } = await sharp(
    path.join(PUBLIC, SHARED + "12cone.webp"),
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const grain = await sharp(paperGrain).removeAlpha().raw().toBuffer();
  for (let y = 0; y < coneInfo.height; y++)
    for (let x = 0; x < coneInfo.width; x++) {
      const i = (y * coneInfo.width + x) * 4;
      // Only the sealing tab is cream in the source illustration.
      const weight = Math.min(
        1,
        Math.max(0, (conePixels[i] - conePixels[i + 2]) / 16),
      );
      for (let k = 0; k < 3; k++) {
        const paper = grain[((y % 30) * 30 + (x % 30)) * 3 + k];
        conePixels[i + k] = Math.round(
          conePixels[i + k] * (1 - weight) + paper * weight,
        );
      }
    }
  const coneFile = path.join(OUT, "images/finished-shield.webp");
  await sharp(conePixels, { raw: coneInfo })
    .webp({ lossless: true })
    .toFile(coneFile);
  const cone = await sharp(coneFile).png().toBuffer();
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
  const hashes = {};
  for (const file of [
    SOURCE,
    SHARED + "01background.webp",
    seatedSource,
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
          "Both eyelids close on request. The treated lid stays closed beneath the strips. Seated arms and fingers retain the source resting pose.",
        teaching:
          "Three translucent Steri-Strips cross the closed lid before the prepared pad is placed directly over the lid.",
      },
      null,
      2,
    ) + "\n",
  );
}
const SHIELD_TAPE_SCALE = 2 / 3;
const SHIELD_WIDTH = 262.2;
const SHIELD_X = 389;
const SHIELD_Y = 592;
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
    const eye = await texture(
      "Original " + side + " eye",
      LOCAL + "patient-" + side + "-eye.webp",
      stage[0],
      stage[1],
      1200 * ACTOR.scale * s,
      { anchor: [px, py, 0] },
    );
    if (!closed || (side === "right" && closeAt === null)) continue;
    const mirror = side === "right";
    const closure = (open, shut) =>
      closeAt === null
        ? c(shut)
        : keys([
            [closeAt, open],
            [closeAt + 28, shut],
          ]);
    const scale = ACTOR.scale * s * 100;
    eye.layer.ks.s = closure([scale, scale, 100], [scale, 0, 100]);
    eye.layer.ks.o = closure(100, 0);
    // Mirror the same black PDF lid about the untreated eye's centre.
    const lidPos = map(
      side === "left"
        ? [EYE.x, EYE.y]
        : [
            ACTOR.left + px * ACTOR.scale,
            EYE.y + (174.2 - 173.3) * 8 * ACTOR.scale,
          ],
    );
    const lid = await texture(
      "Closed " + side + " eyelid",
      LOCAL + "patient-closed-lid.webp",
      lidPos[0],
      lidPos[1],
      1200 * ACTOR.scale * s,
      { anchor: [(328.6 - 285) * 8, (171 - 118) * 8, 0], o: closure(0, 100) },
    );
    lid.layer.ks.s = c([mirror ? -scale : scale, -scale * 0.7, 100]);
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
async function lidStrips(start = null, interval = 23) {
  for (const [i, x] of [349, 373, 397].entries()) {
    const at = start === null ? null : start + i * interval;
    const item = await texture(
      "Eyelid Steri-Strip " + (i + 1),
      LOCAL + "steri-strip.webp",
      x,
      589,
      15,
      {
        r: c([-6, -2, 3][i]),
        ...(at === null
          ? {}
          : {
              masks: [
                mask(
                  "Press from upper lid to cheek",
                  keys([
                    [at, [box(-2, -2, 36, 3)]],
                    [at + interval, [box(-2, -2, 36, 238)]],
                  ]),
                ),
              ],
            }),
      },
    );
    item.layer.ip = at ?? 0;
  }
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
        shadeBySlope: id === "shield-tape-1" || id === "shield-outer-tape",
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
                  ribbonOutline(points, width + 16, from, to).map((p) => [
                    p[0] - art.left,
                    p[1] - art.top,
                  ]),
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
async function padTapes({ motion = null, fadeAt = null, interval = 40 } = {}) {
  const start = [386, 480],
    end = [423, 742];
  const points = surfacePoints(start, end, {
    x: 366,
    y: 594,
    rx: 105,
    ry: 99,
    depth: 28,
    face: true,
  });
  const settled = motion ? approachingStrip(2, start, end, points, motion) : 0;
  const tape = await ribbon("Tape on top of pad 2", "face-tape-2", points, 31);
  tape.layer.ip = settled;
  if (fadeAt !== null)
    for (let n = 0; n < 2; n++)
      await ribbon(
        "Additional diagonal securing tape " + (n + 1),
        "diagonal-tape-" + n,
        surfacePoints([332 + n * 104, 477], [397 + n * 55, 740], {
          x: 366,
          y: 594,
          rx: 105,
          ry: 99,
          depth: 24,
          face: true,
        }),
        32,
        { opacity: fadeAt === 0 ? c(100) : fade(fadeAt + n * interval) },
      );
}
// Project the strip across the two slopes of the shallow cone. The ends
// lie flat on skin. The visible nasal strip rounds the near side of the rim.
function shieldTapePoints(far) {
  // Offsets from the cone's anchor in the original 414-unit projection.
  const points = surfacePoints(
    far ? [-78, -220] : [31, -228],
    far ? [52, 220] : [16, 231],
  );
  return points.map(([x, y], i) => {
    const t = i / (points.length - 1);
    const axial = y / (far ? 163 : 178);
    const depth = Math.max(0, 1 - axial * axial);
    const crown = depth * depth;
    const arc = 5 * Math.sin(Math.PI * t);
    const bend = far ? -30 * crown + arc : 24 * crown - arc;
    return [
      SHIELD_X + (x + bend) * SHIELD_TAPE_SCALE,
      SHIELD_Y + (y - 8 * crown) * SHIELD_TAPE_SCALE,
      crown,
      -(1 - (far ? 0.12 : 0.22) * crown),
      (far ? 0.1 : 0.24) * axial * depth,
    ];
  });
}

async function applyShieldTape(name, id, far, start, end, parent) {
  const arrival = far ? start + Math.round((end - start) * 0.4) : start;
  const points = shieldTapePoints(far),
    width = far ? 25 : 29;
  // The free end points towards the viewer. As the contact line travels
  // downward, each section rolls onto the rim and finally onto the cheek.
  const poses = [0, 0.12, 0.3, 0.47, 0.63, 0.8, 0.92, 1].map((fraction) => {
    const frame = arrival + Math.round((end - arrival) * fraction);
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
  if (far) {
    for (const [part, x, y] of [
      [loose, 0, 0],
      [shadow, 4, 7],
    ]) {
      part.ks.p = shifted(
        [
          [start, [-270, -85]],
          [arrival, [0, 0]],
        ],
        x,
        y,
      );
    }
  }
  shadow.ip = loose.ip = start;
  shadow.op = loose.op = end;
  const strip = await ribbon(name, id, points, width, {
    opacity: keys([
      [0, 0],
      [start, 0],
      [arrival + 5, 100],
    ]),
    progress: poses.map((p) => [p.frame, [0, Math.max(0.015, p.fraction)]]),
  });
  strip.layer.ip = arrival;
  if (parent !== undefined)
    for (const part of [shadow, loose, strip.layer]) part.parent = parent;
}
async function tapeAndPlaceShield(
  approach,
  nearStart,
  nearEnd,
  farStart,
  farEnd,
) {
  const rig = layer("Shield and first strip travel together", {
    p: shifted(approach, 0, 0),
  });
  rig.ty = 3;
  delete rig.shapes;
  if (farStart !== undefined) {
    await applyShieldTape(
      "Far tape behind the shield",
      "shield-outer-tape",
      true,
      farStart,
      farEnd,
    );
  }
  const cone = await shield(SHIELD_X, SHIELD_Y, SHIELD_WIDTH);
  cone.layer.parent = rig.ind;
  cone.layer.ip = approach[0][0];
  await applyShieldTape(
    "Near tape across the shield",
    "shield-tape-1",
    false,
    nearStart,
    nearEnd,
    rig.ind,
  );
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
  await lidStrips();
  await dressingShadow("Pad contact shadow");
  await pad("Original woven pad, stationary on the eye");
  await padTapes({ fadeAt: 0 });
}
function alignDressing(firstLayer) {
  const parts = layers.filter((l) => l.ind >= firstLayer && l.parent == null);
  const rig = layer("Dressing aligned with the cheek", {
    r: c(24),
    p: c([345, 561, 0]),
  });
  rig.ty = 3;
  delete rig.shapes;
  rig.ks.a = c([374, 574, 0]);
  for (const part of parts) part.parent = rig.ind;
}
async function bubbleProcedure() {
  const outer = layers;
  layers = [];
  rect("Procedure inset background", 584, 640, W, H, 0, "625f54");
  await patient({ closed: true });
  await lidStrips(18, 27);
  const approach = [
    [0, [-720, 70]],
    [99, [-720, 70]],
    [189, [0, 0]],
  ];
  const firstDressing = layers.length + 1;
  await dressingShadow("Inset pad contact shadow", {
    o: keys([
      [0, 0],
      [165, 0],
      [189, 26],
    ]),
  });
  await pad("Pad placement demonstrated inside bubble", 374, 594, 170, {
    p: shifted(approach, 374, 594),
  });
  await padTapes({ motion: approach, fadeAt: 190, interval: 16 });
  await tapeAndPlaceShield(
    [
      [218, [-245, 10]],
      [252, [-245, 10]],
      [292, [0, 0]],
    ],
    219,
    249,
  );
  alignDressing(firstDressing);
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
  const scale = 0.78;
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
async function main() {
  await deriveArtwork();
  const {
    APPLY_EYE_PAD_SHIELD_STAGES: stages,
    APPLY_EYE_PAD_SHIELD_CLIPS: clips,
    APPLY_EYE_PAD_SHIELD_NARRATION_CUES: cues,
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
          62,
        ],
        [
          "Original finished cone shield",
          LOCAL + "finished-shield.webp",
          855,
          365,
          420,
          84,
        ],
        ["Original tape roll", LOCAL + "tape-roll.webp", 305, 1140, 310, 33],
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
      // A clear peel pouch with a white carrier and five parallel tan strips.
      rect("Steri-Strip pouch shadow", 309, 658, 222, 270, 9, "392916", {
        o: fade(27),
      });
      rect("Translucent pouch seam", 305, 650, 222, 270, 9, "d4cbc0", {
        o: fade(27),
      });
      rect("Steri-Strip release liner", 305, 653, 198, 228, 3, "f7f3e9", {
        o: fade(27),
      });
      rect("Sealed top of pouch", 305, 530, 200, 6, 2, "ebe6de", {
        o: fade(27),
      });
      for (const [i, x] of [242, 273, 304, 335, 366].entries())
        await texture(
          "Preparation Steri-Strip " + (i + 1),
          LOCAL + "steri-strip.webp",
          x,
          653,
          26,
          { o: fade(27) },
        );
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
      await patient({ closed: true, closeAt: 16 });
      const stripAt = Math.round(
        (stages[i].cues[1].start - clips[i].start) * FPS,
      );
      await lidStrips(stripAt, 70);
      await nose();
      contact(
        "Press Steri-Strips onto the closed eyelid",
        stripAt,
        stripAt + 210,
      );
    } else if (i === 3) {
      rect("Brown pad preparation table", 584, 640, W, H, 0, "59391c");
      ellipse("Gauze contact shadow", 596, 673, 502, 476, "38220f", {
        o: c(40),
      });
      await pad("Original gauze eye pad", 585, 650, 500);
      await ribbon(
        "Tape across the gauze",
        "prepared-tape-2",
        surfacePoints([585, 105], [585, 1195], {
          x: 585,
          y: 650,
          rx: 248,
          ry: 235,
          depth: 18,
        }),
        66,
        {
          opacity: fade(38),
          progress: [
            [38, [0, 0.01]],
            [134, [0, 1]],
          ],
        },
      );
    } else if (i === 4) {
      await patient({ closed: true });
      await lidStrips();
      const approach = [
        [0, [-720, 70]],
        [10, [-720, 70]],
        [100, [0, 0]],
      ];
      await dressingShadow("Pad contact shadow", {
        o: keys([
          [0, 0],
          [76, 0],
          [100, 26],
        ]),
      });
      await pad("Prepared pad approaches the closed eye", 374, 594, 170, {
        p: shifted(approach, 374, 594),
      });
      const secureAt = Math.round(
        (stages[i].cues[1].start - clips[i].start) * FPS,
      );
      await padTapes({ motion: approach, fadeAt: secureAt });
      alignDressing(layers.find((l) => l.nm === "Pad contact shadow").ind);
      await nose();
      contact("Pad is placed before securing tape", 10, 100);
      contact(
        "Secure the outer pad with diagonal tape",
        secureAt,
        secureAt + 65,
      );
    } else if (i === 5) {
      await dressedPatient();
      // First wrap the free shield, then carry shield and strip to the face together.
      const approach = [
        [0, [-218, 155]],
        [111, [-218, 155]],
        [202, [0, 0]],
      ];
      await dressingShadow("Shield contact shadow", {
        o: keys([
          [0, 0],
          [181, 0],
          [202, 20],
        ]),
      });
      await tapeAndPlaceShield(approach, 11, 91, 241, 307);
      alignDressing(layers.find((l) => l.nm === "Pad contact shadow").ind);
      await nose();
      contact("Pretaped shield moves onto the pad", 111, 202);
    }
    if ([2, 4, 5].includes(i)) {
      for (const l of layers)
        if (l.nm !== "Warm procedure background" && l.parent == null)
          l.parent = 10000;
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
  await fs.rm(path.join(OUT, "7/data.json"), { force: true });
  const dir = path.join(
    ROOT,
    "public/narration/apply-eye-pad-shield/full-animation",
  );
  await fs.mkdir(dir, { recursive: true });
  const { languages: pupilsLanguages } = JSON.parse(
    await fs.readFile(
      path.join(PUBLIC, "narration/pupils-pec/full-animation/script.json"),
      "utf8",
    ),
  );
  const script = {
    schemaVersion: 1,
    title: "Apply an Eye Pad and Eye Shield",
    sourceVideo: "/videos/Workshop/PEC/8.Applypadandshield_720p.mp4",
    durationSeconds: clips.at(-1).end,
    defaultLanguage: "en",
    languages: {
      en: {
        label: "English",
        locale: "en-GB",
        voice: pupilsLanguages.en.voice,
      },
      ko: {
        label: "한국어",
        locale: "ko-KR",
        voice: pupilsLanguages.ko.voice,
      },
      ur: {
        label: "اردو",
        locale: "ur-PK",
        voice: "ur-PK-UzmaNeural",
        style: "Calm medical educator",
      },
      ny: {
        label: "Chichewa",
        locale: "ny-MW",
        voice: "facebook/mms-tts-nya",
        provider: "Meta MMS (local)",
        trimEdgeSilenceDb: -42,
      },
    },
    cues: cues.map((s) => ({
      id: s.id,
      start: s.start,
      end: s.end,
      en: s.en,
      ko: s.ko,
      ur: s.ur,
      ny: s.ny,
      ...(s.ur === "دو یا تین پٹیاں لگائیں۔"
        ? { ttsText: { ur: "دو سے تین پٹیاں لگائیں۔" } }
        : {}),
    })),
    videoTitleCues: [
      {
        sourceText: "Preparation",
        translations: { ko: "준비", ur: "تیاری", ny: "Kukonzekera" },
      },
      {
        sourceText: "Apply the eye pad",
        translations: {
          ko: "안대 패드 부착",
          ur: "آئی پیڈ لگائیں۔",
          ny: "Ikani chophimba chofewa pa diso",
        },
      },
      {
        sourceText: "Apply the eye shield",
        translations: {
          ko: "눈 보호대 부착",
          ur: "آئی شیلڈ لگائیں۔",
          ny: "Ikani chotetezera diso cholimba",
        },
      },
    ],
  };
  script.timedCues = Object.fromEntries(
    Object.keys(script.languages).map((language) => [
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
    "Built six Apply Eye Pad / Shield scenes with the PEC demonstration cue sheet.",
  );
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
