// Rebuild the nine local Lottie scenes from supplied transparent artwork.
// The final scene projects a cone mesh through a changing camera angle: it is
// one continuous roll -> tape -> camera sequence, rather than three slides.
const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");
const { pathToFileURL } = require("node:url");
const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(
  ROOT,
  "public/videos/EyeProcedure/MakeEyePadShield/Assets",
);
const OUT = path.join(ROOT, "public/scrolly/eyeprocedures/make-eye-pad-shield");
const W = 1169,
  H = 1280,
  FPS = 30;
const A = new Map();
let layers, endFrame, layerIndex;
const constant = (k) => ({ a: 0, k });
const keys = (values) => ({
  a: 1,
  k: values.map(([t, s], index) => ({
    t,
    s: Array.isArray(s) ? s : [s],
    ...(index < values.length - 1
      ? {
          e: Array.isArray(values[index + 1][1])
            ? values[index + 1][1]
            : [values[index + 1][1]],
          i: { x: [0.67], y: [1] },
          o: { x: [0.33], y: [0] },
        }
      : {}),
  })),
});
const opacity = (...values) => keys(values);
const linearKeys = (values) => {
  const result = keys(values);
  for (const key of result.k) {
    if (key.i) key.i = { x: [2 / 3], y: [2 / 3] };
    if (key.o) key.o = { x: [1 / 3], y: [1 / 3] };
  }
  return result;
};
function image(name, left, top, options = {}) {
  const asset = A.get(name);
  if (!asset) throw new Error(`Missing supplied artwork: ${name}`);
  const factor = (options.width || asset.w) / asset.w;
  const x = left + (asset.w * factor) / 2,
    y = top + (asset.h * factor) / 2;
  const layer = {
    ddd: 0,
    ind: ++layerIndex,
    ty: 2,
    nm: name,
    refId: asset.id,
    sr: 1,
    ks: {
      o: options.o || constant(100),
      r: options.r || constant(0),
      p: options.p || constant([x, y, 0]),
      a: options.a || constant([asset.w / 2, asset.h / 2, 0]),
      s: options.s || constant([100 * factor, 100 * factor, 100]),
    },
    ao: 0,
    ip: options.ip || 0,
    op: options.op || endFrame,
    st: 0,
    bm: 0,
  };
  layers.unshift(layer);
  return layer;
}
const bg = () => image("othersbackground.webp", 0, 0, { width: W });
const pointsShape = (vertices, closed = true) => ({
  i: vertices.map(() => [0, 0]),
  o: vertices.map(() => [0, 0]),
  v: vertices,
  c: closed,
});
function shapeLayer(name, shape, color, options = {}) {
  const layer = {
    ddd: 0,
    ind: ++layerIndex,
    ty: 4,
    nm: name,
    sr: 1,
    ks: {
      o: options.o || constant(100),
      r: constant(0),
      p: constant([0, 0, 0]),
      a: constant([0, 0, 0]),
      s: constant([100, 100, 100]),
    },
    ao: 0,
    shapes: [
      {
        ty: "gr",
        it: [
          { ty: "sh", ks: shape, nm: name },
          options.stroke
            ? {
                ty: "st",
                c: constant(color),
                o: constant(100),
                w: constant(options.stroke),
                lc: 2,
                lj: 2,
                d: options.dashes || [],
              }
            : { ty: "fl", c: constant(color), o: constant(100), r: 1 },
          ...(options.edgeStroke
            ? [
                {
                  ty: "st",
                  c: constant(color),
                  o: constant(100),
                  w: constant(options.edgeStroke),
                  lc: 2,
                  lj: 2,
                },
              ]
            : []),
          ...(options.trim
            ? [
                {
                  ty: "tm",
                  s: constant(0),
                  e: options.trim,
                  o: constant(0),
                  m: 1,
                },
              ]
            : []),
          {
            ty: "tr",
            p: constant([0, 0]),
            a: constant([0, 0]),
            s: constant([100, 100]),
            r: constant(0),
            o: constant(100),
            sk: constant(0),
            sa: constant(0),
          },
        ],
      },
    ],
    ip: 0,
    op: endFrame,
    st: 0,
    bm: 0,
  };
  layers.unshift(layer);
  return layer;
}
function oval(cx, cy, rx, ry) {
  const k = 0.55228475;
  return {
    v: [
      [cx, cy - ry],
      [cx + rx, cy],
      [cx, cy + ry],
      [cx - rx, cy],
    ],
    i: [
      [-rx * k, 0],
      [0, -ry * k],
      [rx * k, 0],
      [0, ry * k],
    ],
    o: [
      [rx * k, 0],
      [0, ry * k],
      [-rx * k, 0],
      [0, -ry * k],
    ],
    c: true,
  };
}
function scissorsAlong(
  samples,
  { width = 950, snipAt = null, stopAt = Infinity, lowerScale = 1.28 } = {},
) {
  const upper = A.get("scissorupperhand.png");
  const lower = A.get("scissorlowerhand.webp");
  const scale = width / upper.w;
  // Both anchors refer to the visible screw in the current supplied PNG pair.
  const upperAnchor = [135, 367, 0];
  // Bring the trim-stage lower grip slightly right/up toward the upper palm.
  const lowerAnchor = lowerScale > 1 ? [115, 217, 0] : [127, 205, 0];
  const tipVector = [-upperAnchor[0] * scale, -upperAnchor[1] * scale];
  const pivot = samples.map(([t, tip, angle]) => {
    const radians = (angle * Math.PI) / 180;
    return [
      t,
      [
        tip[0] -
          tipVector[0] * Math.cos(radians) +
          tipVector[1] * Math.sin(radians),
        tip[1] -
          tipVector[0] * Math.sin(radians) -
          tipVector[1] * Math.cos(radians),
        0,
      ],
    ];
  });
  const upperRotation = samples.map(([t, , angle]) => {
    const closing =
      snipAt === null ? 0 : Math.max(0, 1 - Math.abs(t - snipAt) / 30);
    return [t, angle - 4 * closing];
  });
  const lowerRotation = samples.map(([t, , angle]) => {
    const closing =
      (1 - Math.cos((Math.min(t, stopAt) * Math.PI * 2) / 24)) / 2;
    // Open beyond the supplied pose, then close around the common screw.
    // Keep the resting slit pose unchanged once the circular cut is complete.
    const settle = Math.max(0, Math.min(1, (t - stopAt) / 36));
    const opening = (-8 + 16 * closing) * (1 - settle) + 4 * settle;
    return [t, angle + opening];
  });
  const rear = image("scissorlowerhand.webp", 0, 0, {
    width: lower.w * scale * lowerScale,
    a: constant(lowerAnchor),
    p: linearKeys(pivot),
    r: linearKeys(lowerRotation),
  });
  rear.hasMask = true;
  rear.masksProperties = [
    {
      inv: false,
      mode: "s",
      pt: constant(
        pointsShape([
          [137, 221],
          [166, 211],
          [168, 246],
          [158, 246],
        ]),
      ),
      o: constant(100),
      x: constant(0),
      nm: "Hide lower joint spur",
    },
    ...[
      [
        [76, 341],
        [98, 341],
        [116, 348],
        [122, 371],
        [123, 400],
        [118, 425],
        [105, 445],
        [95, 445],
        [80, 428],
        [67, 406],
        [58, 381],
        [60, 358],
      ],
      [
        [174, 375],
        [294, 451],
        [279, 533],
        [260, 529],
        [231, 518],
        [218, 504],
        [202, 472],
        [190, 438],
        [181, 406],
      ],
    ].map((outline, index) => ({
      inv: false,
      mode: "s",
      pt: constant(pointsShape(outline)),
      o: constant(100),
      x: constant(0),
      nm: `Hide extended finger ${index + 1}`,
    })),
  ];
  // Canvas ignores subtract-mask modes. Use one positive outline with reverse-
  // wound holes, joined by zero-area bridges, so SVG and Canvas cut identically.
  const origin = [-2, -2];
  const visibleOutline = [
    origin,
    [lower.w + 2, -2],
    [lower.w + 2, lower.h + 2],
    [-2, lower.h + 2],
    origin,
  ];
  for (const mask of rear.masksProperties) {
    const hole = [...mask.pt.k.v].reverse();
    visibleOutline.push(...hole, hole[0], origin);
  }
  rear.masksProperties = [
    {
      inv: false,
      mode: "a",
      pt: constant(pointsShape(visibleOutline)),
      o: constant(100),
      x: constant(0),
      nm: "Lower scissor without extended finger or spur",
    },
  ];
  const front = image("scissorupperhand.png", 0, 0, {
    width,
    a: constant(upperAnchor),
    p: linearKeys(pivot),
    r: linearKeys(upperRotation),
  });
  return { rear, front };
}
function behind(layer, reference) {
  layers.splice(layers.indexOf(layer), 1);
  layers.splice(layers.indexOf(reference) + 1, 0, layer);
}
function orbitScissors(
  cx,
  cy,
  rx,
  ry,
  start = 30,
  finish = 240,
  settle = false,
  lowerScale = 1.28,
) {
  const samples = [];
  const initialAngle = 0;
  const upperTipDirection = Math.atan2(-367, -135);
  for (let t = 0; t < endFrame; t += 6) {
    const p = Math.max(0, Math.min(1, (t - start) / (finish - start)));
    const theta = initialAngle - (p * Math.PI) / 2;
    const tangent = Math.atan2(-ry * Math.cos(theta), rx * Math.sin(theta));
    // Stop at the taped upper edge, then reveal the completed outline.
    let angle = ((tangent - upperTipDirection) * 180) / Math.PI;
    if (samples.length) {
      const previous = samples.at(-1)[2];
      while (angle - previous > 180) angle -= 360;
      while (angle - previous < -180) angle += 360;
    }
    const tip = [cx + rx * Math.cos(theta), cy + ry * Math.sin(theta)];
    if (settle && t > finish) {
      const move = Math.min(1, Math.max(0, (t - 276) / 54));
      tip[0] += (660 - tip[0]) * move;
      tip[1] += (403 - tip[1]) * move;
      angle += (7 - angle) * move;
    }
    samples.push([t, tip, angle]);
  }
  return scissorsAlong(samples, {
    stopAt: finish,
    snipAt: settle ? 480 : null,
    lowerScale,
  });
}
function ovalMask(layer, { cx, cy, rx, ry }) {
  layer.hasMask = true;
  layer.masksProperties = [
    {
      inv: false,
      mode: "a",
      pt: constant(oval(cx, cy, rx, ry)),
      o: constant(100),
      x: constant(0),
      nm: "Finished cut outline",
    },
  ];
}
async function coneSequence() {
  const checkpoints = [
    [0, 0, Math.PI / 2, 322, 0],
    [45, 0, Math.PI / 2, 322, 0],
    [75, (280 * 30) / 135, Math.PI / 2, 319, 0],
    [105, (280 * 60) / 135, Math.PI / 2, 316, 0],
    [135, (280 * 90) / 135, Math.PI / 2, 313, 0],
    [180, 280, Math.PI / 2, 310, 0],
    [285, 280, Math.PI / 2, 310, 0],
    [315, 280, Math.PI / 2, 310, 0],
    [435, 350, Math.PI / 6, 384, 0.85],
    [539, 350, Math.PI / 6, 384, 0.85],
  ];
  const rollAt = (t) => Math.max(0, Math.min(1, (t - 45) / 135));
  const overlap = 0.85;
  const cutAngle = (t) => Math.PI / 2 + overlap * rollAt(t);
  const curlAt = (t) => Math.sin(Math.PI * rollAt(t));
  const edgeAngle = (_radius, t) => cutAngle(t);
  const project = (r, theta, height, elevation, radius, yaw) => {
    const overhead = Math.max(
      0,
      Math.min(1, (elevation - Math.PI / 6) / (Math.PI / 3)),
    );
    // The outline changes after the free edge has visibly started rolling.
    // Keep the camera overhead. A ten-pixel apex rise gives the stiff sheet
    // slight relief while its straight radial edge rolls over the other edge.
    const forming = Math.max(0, Math.min(1, (height / 280 - 0.35) / 0.65));
    const oval = 1 - 0.16 * forming * forming * (3 - 2 * forming) * overhead;
    return [
      584 + r * radius * Math.cos(theta - yaw),
      600 +
        (1 - Math.sin(elevation)) * 280 +
        r * radius * Math.sin(theta - yaw) * Math.sin(elevation) * oval -
        height * (1 - r) * Math.cos(elevation) -
        10 * Math.min(1, height / 280) * (1 - r) * overhead,
    ];
  };
  const frameShape = (verticesAt) => {
    const values = checkpoints.map(([t, h, e, r, yaw]) => [
      t,
      pointsShape(verticesAt(h, e, r, t, yaw)),
    ]);
    return {
      a: 1,
      k: values.map(([t, s], i) => ({
        t,
        s: [s],
        ...(i < values.length - 1
          ? {
              e: [values[i + 1][1]],
              i: t >= 315 ? { x: 0.67, y: 1 } : { x: 2 / 3, y: 2 / 3 },
              o: t >= 315 ? { x: 0.33, y: 0 } : { x: 1 / 3, y: 1 / 3 },
            }
          : {}),
      })),
    };
  };
  const count = 72;
  const vertices = (index, h, e, r, t, yaw) => {
    // Stretch the material's angular span beyond a full turn: the right cut
    // edge moves left over the stationary edge, rather than opening a gap.
    const span = 2 * Math.PI + overlap * rollAt(t);
    const a = Math.PI / 2 + (index * span) / count;
    const b = Math.PI / 2 + ((index + 1) * span) / count;
    return [
      project(0, 0, h, e, r, yaw),
      project(1, a - 0.002, h, e, r, yaw),
      project(1, b + 0.002, h, e, r, yaw),
    ];
  };
  const order = [...Array(count).keys()].sort(
    (a, b) =>
      Math.sin(Math.PI / 2 + (a * 2 * Math.PI) / count) -
      Math.sin(Math.PI / 2 + (b * 2 * Math.PI) / count),
  );
  for (const i of order) {
    shapeLayer(
      `Paper cone facet ${i}`,
      frameShape((h, e, r, t, yaw) => vertices(i, h, e, r, t, yaw)),
      [0.955, 0.955, 0.955, 1],
      { edgeStroke: 2.2 },
    );
  }
  // Only a narrow contact shadow under the moving edge, darkest at contact
  // and fading left. It has zero area before the paper starts overlapping.
  const edgeBand = (h, e, r, t, yaw, offsetA, offsetB) => {
    const side = (offset) =>
      Array.from({ length: 9 }, (_, j) => {
        const radius = j / 8;
        return project(radius, edgeAngle(radius, t) + offset, h, e, r, yaw);
      });
    return [...side(offsetA), ...side(offsetB).reverse()];
  };
  for (let i = 0; i < 8; i++) {
    shapeLayer(
      `Overlap contact shadow ${i}`,
      frameShape((h, e, r, t, yaw) => {
        const width = 0.11 * rollAt(t);
        return edgeBand(
          h,
          e,
          r,
          t,
          yaw,
          (i * width) / 8,
          ((i + 1) * width) / 8,
        );
      }),
      [0.45, 0.45, 0.45, 1],
      {
        o: opacity(
          [0, 0],
          [45, 0],
          [75, 35 - i * 4],
          [135, 35 - i * 4],
          [180, 24 - i * 2.8],
        ),
      },
    );
  }
  // The last material sector is the right-hand paper, painted over the left.
  // Its vertices move from the right of the slit to the left as the disc rolls.
  for (let i = 0; i < 12; i++) {
    for (let ring = 0; ring < 6; ring++) {
      shapeLayer(
        `Rolling paper flap ${i}${ring ? ` ring ${ring}` : ""}`,
        frameShape((h, e, r, t, yaw) => {
          const span = 2 * Math.PI + overlap * rollAt(t);
          const point = (fraction, radius) => {
            const u = (count - 12 + i + fraction) / count;
            const angle = Math.PI / 2 + u * span;
            return project(radius, angle, h, e, r, yaw);
          };
          return [
            point(0, ring / 6),
            point(1, ring / 6),
            point(1, (ring + 1) / 6),
            point(0, (ring + 1) / 6),
          ];
        }),
        [0.955, 0.955, 0.955, 1],
        { edgeStroke: 1.2 },
      );
    }
  }
  // A subtle straight band describes the stiff rolled edge, without a wave.
  for (let i = 0; i < 8; i++) {
    const tone = 0.81 + (0.145 * i) / 7;
    shapeLayer(
      `Paper curl shading ${i}`,
      frameShape((h, e, r, t, yaw) => {
        const width = 0.06 * curlAt(t);
        return edgeBand(
          h,
          e,
          r,
          t,
          yaw,
          (-i * width) / 8,
          (-(i + 1) * width) / 8,
        );
      }),
      [tone, tone, tone, 1],
      { o: opacity([0, 0], [45, 0], [75, 40], [135, 40], [180, 0]) },
    );
  }
  shapeLayer(
    "Radial cut before overlap",
    constant(
      pointsShape(
        [
          [584, 600],
          [584, 922],
        ],
        false,
      ),
    ),
    [0.65, 0.65, 0.65, 1],
    { stroke: 2, o: opacity([0, 100], [45, 100], [75, 0]) },
  );

  image("10arrow.webp", 555, 945, {
    width: 340,
    o: opacity([0, 0], [30, 100], [140, 100], [180, 0]),
    r: keys([
      [30, -12],
      [140, 7],
    ]),
    p: keys([
      [0, [725, 1060, 0]],
      [145, [665, 1060, 0]],
    ]),
  });
  // Tape lands after the roll, stays attached, then tilts with the camera.
  const tape = image("11tape.webp", 450, 725, {
    width: 255,
    o: opacity([0, 0], [189, 0], [201, 100]),
    p: keys([
      [0, [578, 615, 0]],
      [190, [578, 615, 0]],
      [255, [...project(0.56, cutAngle(180), 280, Math.PI / 2, 310, 0), 0]],
      [315, [...project(0.56, cutAngle(180), 280, Math.PI / 2, 310, 0), 0]],
      [435, [...project(0.56, cutAngle(180), 350, Math.PI / 6, 384, 0.85), 0]],
    ]),
    r: keys([
      [0, -15],
      [255, (overlap * 180) / Math.PI],
      [315, (overlap * 180) / Math.PI],
      [435, 0],
    ]),
    s: keys([
      [0, [100, 100, 100]],
      [315, [100, 100, 100]],
      [435, [125, 90, 100]],
    ]),
  });
  // Keep the supplied paper texture, masking out its baked right-hand shadow.
  // Trace the pale paper in native coordinates and cast its shadow to the left.
  const { data, info } = await sharp(path.join(OUT, "images/11tape.webp"))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const left = [],
    right = [];
  for (let y = 0; y < info.height; y++) {
    const row = [];
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      if (
        data[i + 3] > 100 &&
        data[i] > 180 &&
        data[i + 1] > 175 &&
        data[i + 2] > 150
      )
        row.push(x);
    }
    if (row.length) {
      left.push([row[0] - 0.5, y]);
      right.push([row.at(-1) + 0.5, y]);
    }
  }
  const paperOutline = [...left, ...right.reverse()];
  tape.hasMask = true;
  tape.masksProperties = [
    {
      inv: false,
      mode: "a",
      pt: constant(pointsShape(paperOutline)),
      o: constant(100),
      x: constant(0),
      nm: "Tape paper without baked shadow",
    },
  ];
  const shadow = shapeLayer(
    "Tape shadow — cast left",
    constant(pointsShape(paperOutline.map(([x, y]) => [x - 10, y + 5]))),
    [0.55, 0.55, 0.55, 1],
  );
  shadow.ks = structuredClone(tape.ks);
  for (const key of shadow.ks.o.k) {
    key.s = key.s.map((v) => v * 0.35);
    if (key.e) key.e = key.e.map((v) => v * 0.35);
  }
  behind(shadow, tape);
}

async function hygieneScene() {
  const source = path.join(
    ROOT,
    "public/scrolly/coreexam/ophths/DO/01ObservationandFundalReflex/1",
  );
  const scene = JSON.parse(
    await fs.readFile(path.join(source, "data.json"), "utf8"),
  );
  const ratio = endFrame / scene.op;
  const retime = (value) => {
    if (!value || typeof value !== "object") return;
    for (const [name, child] of Object.entries(value)) {
      if (["t", "ip", "op", "st"].includes(name) && typeof child === "number")
        value[name] = child * ratio;
      else retime(child);
    }
  };
  retime(scene);
  scene.fr = FPS;
  scene.op = endFrame;
  scene.nm = "Hand hygiene — reused Direct Ophthalmoscopy animation";
  const target = path.join(OUT, "1/images");
  await fs.mkdir(target, { recursive: true });
  for (const asset of scene.assets) {
    if (!asset.p || asset.e) continue;
    await fs.copyFile(
      path.join(source, asset.u, asset.p),
      path.join(target, asset.p),
    );
    asset.u = "images/";
  }
  return scene;
}
function equipmentScene() {
  image("01background.webp", 0, 0, { width: W });
}
function cottonHandPair(side, moves) {
  // Register the cropped rear hand and front thumb in the original reference
  // coordinate system, then translate the assembled pair without stretching it.
  const left = side === "left";
  const placements = left
    ? [
        ["02lefthand.webp", -174, 462],
        ["02leftthumb.webp", -345, 413],
      ]
    : [
        ["02righthand.webp", 722, 477],
        ["02rightthumb.webp", 645, 428],
      ];
  return placements.map(([name, x, y]) => {
    const asset = A.get(name);
    return image(name, x, y, {
      p: keys(
        moves.map(([t, dx, dy]) => [
          t,
          [x + asset.w / 2 + dx, y + asset.h / 2 + dy, 0],
        ]),
      ),
    });
  });
}
async function assembleFoldingHand() {
  // Canvas Lottie applies precomp opacity to its children individually. Bake
  // the original rear hand, thumb and wrist extension into one opaque image
  // before fading, so SVG and iOS canvas cannot expose internal crop edges.
  const w = 1800,
    h = 1600;
  const wrist = Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><path d="M580 740 L840 670 L2300 1700 L1800 2000 Z" fill="#844d24"/></svg>`,
  );
  await sharp({
    create: {
      width: w,
      height: h,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: wrist, left: 0, top: 0 },
      { input: path.join(OUT, "images/02righthand.webp"), left: 77, top: 49 },
      { input: path.join(OUT, "images/02rightthumb.webp"), left: 0, top: 0 },
    ])
    .webp({ quality: 88, alphaQuality: 100 })
    .toFile(path.join(OUT, "images/foldinghand.webp"));
  A.set("foldinghand.webp", {
    id: "assembled_folding_hand",
    w,
    h,
    u: "../images/",
    p: "foldinghand.webp",
    e: 0,
  });
}
function visitedCutMask(layer, left, top, width, cx, cy, rx, ry) {
  const asset = [...A.values()].find((a) => a.id === layer.refId);
  const scale = width / asset.w;
  const outline = (frame) => {
    const progress = Math.max(0, Math.min(1, (frame - 30) / 210));
    return pointsShape(
      Array.from({ length: 128 }, (_, i) => {
        const theta = (-i * Math.PI * 2) / 128;
        const dx = Math.cos(theta),
          dy = Math.sin(theta);
        const outside = Math.min(
          Math.abs(dx) < 1e-8
            ? Infinity
            : (dx > 0 ? W - cx : cx) / Math.abs(dx),
          Math.abs(dy) < 1e-8
            ? Infinity
            : (dy > 0 ? H - cy : cy) / Math.abs(dy),
        );
        const ellipse = 1 / Math.hypot(dx / rx, dy / ry);
        const cut = progress > 0 && i <= progress * 32;
        const radius = cut ? ellipse : outside;
        return [
          (cx + dx * radius - left) / scale,
          (cy + dy * radius - top) / scale,
        ];
      }),
    );
  };
  const frames = Array.from({ length: 41 }, (_, i) => i * 6);
  layer.hasMask = true;
  layer.masksProperties = [
    {
      inv: false,
      mode: "a",
      pt: {
        a: 1,
        k: frames.map((t, i) => ({
          t,
          s: [outline(t)],
          ...(i < frames.length - 1
            ? {
                e: [outline(frames[i + 1])],
                i: { x: 2 / 3, y: 2 / 3 },
                o: { x: 1 / 3, y: 1 / 3 },
              }
            : {}),
        })),
      },
      o: constant(100),
      x: constant(0),
      nm: "Only the visited cutting arc is removed",
    },
  ];
}
// Match the brown palms, rather than the full bounds of held tools or fingers.
function holdingHand(x, y) {
  // These are the user's newly separated crops, at one common source scale.
  // Their crop offset registers the thumb over the palm, as in reference 04.
  const material = layers.filter((layer) =>
    /^(03gauze|03and04foldedgauze|08paper|09paper)/.test(layer.nm),
  );
  const bottom = A.get("holdinghand_bottom.png");
  const top = A.get("holdinghand_top.png");
  const scale = 700 / bottom.w;
  const rear = image("holdinghand_bottom.png", x, y, { width: 700 });
  if (material.length) behind(rear, material.at(-1));
  const front = image("holdinghand_top.png", x + 170 * scale, y + 18 * scale, {
    width: top.w * scale,
  });
  return { rear, front };
}
function cottonScene() {
  // Each pull deforms the cotton and moves the four hand pieces together.
  const poses = [
    [0, 88, 92, 0, 0],
    [45, 128, 72, -80, 0],
    [85, 85, 120, 0, -80],
    [125, 120, 84, -55, 60],
    [165, 91, 118, 15, -75],
    [205, 130, 76, -80, -25],
    [245, 96, 105, 10, 40],
    [295, 132, 74, -85, 0],
    [350, 123, 77, -68, 0],
  ];
  image("02cotton.webp", 390, 320, {
    width: 388,
    s: keys(poses.map(([t, sx, sy]) => [t, [sx, sy, 100]])),
    r: keys([
      [0, 0],
      [85, -8],
      [125, 14],
      [165, -14],
      [205, 10],
      [295, 0],
    ]),
    p: keys([
      [0, [584, 520, 0]],
      [85, [584, 492, 0]],
      [125, [584, 540, 0]],
      [165, [584, 495, 0]],
      [205, [584, 525, 0]],
      [295, [584, 520, 0]],
    ]),
  });
  // Rear fingers behind the cotton, front thumbs over it.
  const left = cottonHandPair(
    "left",
    poses.map(([t, , , dx, dy]) => [t, dx, dy]),
  );
  const right = cottonHandPair(
    "right",
    poses.map(([t, , , dx, dy]) => [t, -dx, -dy]),
  );
  const cotton = layers.find((layer) => layer.nm === "02cotton.webp");
  behind(left[0], cotton);
  behind(right[0], cotton);
}
function softGauzeFlap() {
  const asset = A.get("03gauze_folding.webp");
  const angle = (12.5 * Math.PI) / 180;
  const frames = [
    0,
    45,
    ...Array.from({ length: 25 }, (_, i) => 51 + i * 6),
    200,
    225,
  ];
  const count = 28;
  // Piecewise affine strips retain the source weave while letting the free
  // edge sag and ripple. Every strip shares the same fixed, undeformed hinge.
  const surface = (x, t) => {
    const progress = Math.max(0, Math.min(1, (t - 45) / 145));
    const ease = progress * progress * (3 - 2 * progress);
    const flex = Math.sin(Math.PI * progress) ** 1.5;
    const u = x - 22;
    const distance = Math.max(0, u / (asset.w - 22));
    return [
      (0.72 - 2.27 * ease) * u + 28 * flex * Math.sin(Math.PI * distance),
      flex *
        (90 * distance ** 1.2 +
          12 * distance * Math.sin(4 * Math.PI * distance - 3 * progress)),
    ];
  };
  for (let i = 0; i < count; i++) {
    const x0 = (i * asset.w) / count;
    const x1 = ((i + 1) * asset.w) / count;
    const center = (x0 + x1) / 2;
    const positions = [],
      scales = [],
      skews = [];
    for (const t of frames) {
      const a = surface(x0, t),
        b = surface(x1, t);
      const [x, y] = surface(center, t);
      const dx = (b[0] - a[0]) / (x1 - x0);
      const dy = (b[1] - a[1]) / (x1 - x0);
      const safeScale = Math.abs(dx) < 0.025 ? (dx < 0 ? -0.025 : 0.025) : dx;
      positions.push([
        t,
        [
          681 + x * Math.cos(angle) - y * Math.sin(angle),
          389 + x * Math.sin(angle) + y * Math.cos(angle),
          0,
        ],
      ]);
      scales.push([t, [100 * safeScale, 72, 100]]);
      skews.push([
        t,
        Math.max(
          -80,
          Math.min(80, (Math.atan(dy / safeScale) * 180) / Math.PI),
        ),
      ]);
    }
    const strip = image("03gauze_folding.webp", 0, 0, {
      a: constant([center, 90, 0]),
      p: linearKeys(positions),
      r: constant(12.5),
      s: linearKeys(scales),
      o: opacity([0, 100], [110, 100], [135, 0]),
    });
    strip.nm = i === 0 ? "03gauze_folding.webp" : `03gauze_folding strip ${i}`;
    strip.ks.sk = linearKeys(skews);
    strip.ks.sa = constant(90);
    strip.hasMask = true;
    strip.masksProperties = [
      {
        inv: false,
        mode: "a",
        pt: constant(
          pointsShape([
            [x0 - 0.3, -1],
            [x1 + 0.3, -1],
            [x1 + 0.3, asset.h + 1],
            [x0 - 0.3, asset.h + 1],
          ]),
        ),
        o: constant(100),
        x: constant(0),
        nm: "Continuous flexible gauze strip",
      },
    ];
  }
}
function foldScene() {
  const firstLayer = layerIndex;
  image("03gauze.webp", 115, 280, {
    width: 570,
    o: opacity([0, 100], [125, 100], [150, 0]),
  });
  image("03stretchedcotton.webp", 170, 490, {
    width: 430,
    o: opacity([0, 100], [125, 100], [150, 0]),
  });
  // Register the flap's left edge to the complete gauze's sloping right edge.
  // Its [22, 90] transparent inset is part of the crop, not a hinge gap.
  softGauzeFlap();
  image("03and04foldedgauze.webp", 115, 280, {
    width: 570,
    o: opacity([0, 0], [125, 0], [150, 100]),
  });
  holdingHand(-190, 530);
  const handMoves = [
    [0, -10, -135],
    [45, -10, -135],
    [115, -170, -90],
    [160, -170, -90],
  ];
  const hand = A.get("foldinghand.webp");
  const right = image("foldinghand.webp", 645, 428, {
    p: keys(
      handMoves.map(([t, dx, dy]) => [
        t,
        [645 + hand.w / 2 + dx, 428 + hand.h / 2 + dy, 0],
      ]),
    ),
    o: opacity([0, 100], [115, 100], [160, 0]),
  });
  right.nm = "Assembled folding hand";
  // Taping stays in the latter half of the folding animation.
  image("03tape.webp", 400, 245, {
    width: 165,
    o: opacity([0, 0], [295, 0], [310, 100]),
    p: keys([
      [0, [483, 225, 0]],
      [300, [483, 225, 0]],
      [395, [483, 424, 0]],
    ]),
  });
  // Enlarge only the held pad assembly, preserving all crop registration and
  // animation keys. The left grip stays fixed; move the right grip to its hinge.
  const magnification = 700 / 570;
  const mapProperty = (property, transform) => {
    if (!property.a) return constant(transform(property.k));
    return {
      ...property,
      k: property.k.map((key) => ({
        ...key,
        ...(key.s ? { s: transform(key.s) } : {}),
        ...(key.e ? { e: transform(key.e) } : {}),
      })),
    };
  };
  const enlargePosition = ([x, y, z]) => [
    250 + (x - 250) * magnification,
    580 + (y - 580) * magnification,
    z,
  ];
  for (const layer of layers.filter(
    (l) => l.ind > firstLayer && /^03/.test(l.nm),
  )) {
    layer.ks.p = mapProperty(layer.ks.p, enlargePosition);
    if (layer.nm === "03tape.webp") continue;
    layer.ks.s = mapProperty(layer.ks.s, ([x, y, z]) => [
      x * magnification,
      y * magnification,
      z,
    ]);
  }
  const [hingeX, hingeY] = enlargePosition([681, 389, 0]);
  right.ks.p = mapProperty(right.ks.p, ([x, y, z]) => [
    x + hingeX - 681,
    y + hingeY - 389,
    z,
  ]);
}
function trimPadScene() {
  const fadeOriginal = opacity([0, 100], [246, 100], [276, 0]);
  const fadeCut = opacity([0, 0], [246, 0], [276, 100]);
  const gauze = image("03and04foldedgauze.webp", 145, 190, {
    width: 700,
    o: fadeOriginal,
  });
  visitedCutMask(gauze, 145, 190, 700, 495, 561, 301, 224);
  const asset = A.get("03and04foldedgauze.webp");
  const final = image("03and04foldedgauze.webp", 145, 190, {
    width: 700,
    o: fadeCut,
  });
  ovalMask(final, {
    cx: asset.w / 2,
    cy: asset.h * 0.53,
    rx: asset.w * 0.43,
    ry: asset.h * 0.32,
  });
  const originalTape = image("03tape.webp", 405, 215, {
    width: 165,
    o: fadeOriginal,
  });
  visitedCutMask(originalTape, 405, 215, 165, 495, 561, 301, 224);
  const tape = image("03tape.webp", 405, 215, { width: 165, o: fadeCut });
  const tapeScale = 165 / A.get("03tape.webp").w;
  ovalMask(tape, {
    cx: (495 - 405) / tapeScale,
    cy: (561 - 215) / tapeScale,
    rx: 301 / tapeScale,
    ry: 224 / tapeScale,
  });
  holdingHand(-230, 470);
  const lowerBladeScale = 1.28;
  const cut = orbitScissors(
    495,
    561,
    301,
    224,
    30,
    240,
    false,
    lowerBladeScale,
  );
  behind(cut.rear, gauze);
  // Stop at the tape, then dissolve to the trimmed gauze AND trimmed tape.
  for (const layer of [cut.front, cut.rear])
    layer.ks.o = opacity([0, 100], [246, 100], [276, 0]);
}
function cardboardScene() {
  image("05cardboard.webp", 200, 230, { width: 770 });
}
function drawCircleScene() {
  image("06paper.webp", 200, 175, { width: 770 });
  const cx = 584,
    cy = 640,
    rx = 227,
    ry = 135,
    start = 30,
    finish = 195;
  const initialAngle = 2.5;
  const finalAngle = -2.85;
  const visibleFraction = (initialAngle - finalAngle) / (Math.PI * 2);
  const trajectory = [];
  for (let i = 0; i <= 120; i++) {
    const theta = initialAngle - (i * Math.PI * 2) / 120;
    trajectory.push([cx + rx * Math.cos(theta), cy + ry * Math.sin(theta)]);
  }
  const lengths = [0];
  for (let i = 1; i < trajectory.length; i++) {
    lengths.push(
      lengths.at(-1) +
        Math.hypot(
          trajectory[i][0] - trajectory[i - 1][0],
          trajectory[i][1] - trajectory[i - 1][1],
        ),
    );
  }
  const trace = [];
  for (let t = 0; t < endFrame; t += 3) {
    const progress = Math.max(0, Math.min(1, (t - start) / (finish - start)));
    // The rest of the circle is revealed after the pencil finishes, while the
    // cup still covers the centre. Do not delay cup removal for a full orbit.
    const point = (t >= 198 ? 1 : progress * visibleFraction) * 120;
    const lower = Math.min(119, Math.floor(point));
    const distance =
      lengths[lower] + (lengths[lower + 1] - lengths[lower]) * (point - lower);
    trace.push([t, (100 * distance) / lengths.at(-1)]);
  }
  shapeLayer(
    "Pencil circle",
    constant(pointsShape(trajectory, false)),
    [0, 0, 0, 1],
    {
      stroke: 6,
      // Trim Paths uses arc length; the pencil uses angle. Align both clocks.
      trim: linearKeys(trace),
    },
  );
  const route = [];
  for (let t = 0; t < endFrame; t += 3) {
    const progress = Math.max(0, Math.min(1, (t - start) / (finish - start)));
    const theta = initialAngle + progress * (finalAngle - initialAngle);
    route.push([t, [cx + rx * Math.cos(theta), cy + ry * Math.sin(theta), 0]]);
  }
  const pencilOptions = {
    width: 1000,
    a: constant([16, 530, 0]),
    p: linearKeys(route),
    r: keys([
      [0, -15],
      [108, 12],
      [finish, -10],
    ]),
  };
  const pencilArm = (o) => {
    const arm = shapeLayer(
      "Pencil wrist extension",
      constant(
        pointsShape([
          [698, 90],
          [816, 243],
          [2300, -710],
          [2182, -863],
        ]),
      ),
      [0.52, 0.3, 0.14, 1],
      { o },
    );
    arm.ks.a = pencilOptions.a;
    arm.ks.p = pencilOptions.p;
    arm.ks.r = pencilOptions.r;
    arm.ks.s = constant([1000 / 8.2, 1000 / 8.2, 100]);
    return arm;
  };
  const backOpacity = opacity(
    [0, 0],
    [105, 0],
    [111, 100],
    [180, 100],
    [195, 0],
  );
  pencilArm(backOpacity);
  image("06pencil.webp", 0, 0, {
    ...pencilOptions,
    o: backOpacity,
  });
  // Lift the cup slightly so its lower rim does not obscure the traced circle.
  const cupScale = 454 / 410;
  const cup = image("06handholdingcup.webp", 0, 0, {
    width: 1283 * cupScale,
    a: constant([1080, 595, 0]),
    p: keys([
      [0, [cx, cy - 36, 0]],
      [210, [cx, cy - 36, 0]],
      [285, [-1250, -550, 0]],
    ]),
    r: keys([
      [0, 0],
      [210, 0],
      [285, 45],
    ]),
  });
  cup.nm = "Cup — lifted above the circle outline";
  const frontOpacity = opacity([0, 100], [105, 100], [111, 0]);
  pencilArm(frontOpacity);
  image("06pencil.webp", 0, 0, {
    ...pencilOptions,
    o: frontOpacity,
  });
  const line = image("07line.webp", 357, 606, {
    width: 454,
  });
  const lineAsset = A.get("07line.webp");
  const wipe = (x) =>
    pointsShape([
      [-1, -1],
      [x, -1],
      [x, lineAsset.h + 1],
      [-1, lineAsset.h + 1],
    ]);
  line.hasMask = true;
  line.masksProperties = [
    {
      inv: false,
      mode: "a",
      pt: {
        a: 1,
        k: [
          { t: 0, s: [wipe(0)], h: 1 },
          {
            t: 300,
            s: [wipe(0)],
            e: [wipe(lineAsset.w + 1)],
            i: { x: 2 / 3, y: 2 / 3 },
            o: { x: 1 / 3, y: 1 / 3 },
          },
          { t: 360, s: [wipe(lineAsset.w + 1)] },
        ],
      },
      o: constant(100),
      x: constant(0),
      nm: "Left-to-right measurement wipe",
    },
  ];
  image("078cm.webp", 527, 603, {
    width: 115,
    o: opacity([0, 0], [365, 0], [385, 100]),
  });
}
function cutCircleScene() {
  const paper = image("08paper.webp", 244, 7, {
    width: 720,
    o: opacity([0, 100], [246, 100], [276, 0]),
  });
  visitedCutMask(paper, 244, 7, 720, 604, 438, 227, 227);
  image("09paper.webp", 377, 211, {
    width: 454,
    o: opacity([0, 0], [246, 0], [276, 100]),
  });
  holdingHand(-95, 370);
  const cut = orbitScissors(604, 438, 227, 227, 30, 240, true, 1.22);
  behind(cut.rear, paper);
  // The completed slit already exists when the upper blade starts returning.
  const slit = shapeLayer(
    "Single radial slit",
    constant(
      pointsShape(
        [
          [663, 657],
          [604, 438],
        ],
        false,
      ),
    ),
    [0.66, 0.63, 0.57, 1],
    {
      stroke: 7,
    },
  );
  slit.ip = 480;
  behind(slit, cut.front);
}

async function main() {
  const { EYE_PAD_SHIELD_STAGES: stages, EYE_PAD_SHIELD_SCROLL_CLIPS: clips } =
    await import(
      pathToFileURL(path.join(ROOT, "public/js/eyePadShieldScroll.js"))
    );
  await fs.mkdir(path.join(OUT, "images"), { recursive: true });
  // Process sequentially: source artwork can exceed 200 megapixels per layer.
  for (const [index, name] of (await fs.readdir(SOURCE)).sort().entries()) {
    const meta = await sharp(path.join(SOURCE, name), {
      limitInputPixels: 400000000,
    }).metadata();
    const w = Math.round((meta.width * W) / 13280),
      h = Math.round((meta.height * H) / 14515);
    const filename = name.replace(/\.(png|webp)$/i, ".webp");
    if (!process.argv.includes("--scenes-only"))
      await sharp(path.join(SOURCE, name), { limitInputPixels: 400000000 })
        .resize(w, h)
        .webp({ quality: 88, alphaQuality: 100 })
        .toFile(path.join(OUT, "images", filename));
    // The lower-hand source may be supplied as either PNG or WebP.
    A.set(name.replace(/^scissorlowerhand\.png$/, "scissorlowerhand.webp"), {
      id: `art_${index}`,
      w,
      h,
      u: "../images/",
      p: filename,
      e: 0,
    });
  }
  await assembleFoldingHand();
  for (const [index, stage] of stages.entries()) {
    layers = [];
    layerIndex = 0;
    endFrame = stage.seconds * FPS;
    bg();
    const sceneBuilders = [
      null,
      equipmentScene,
      cottonScene,
      foldScene,
      trimPadScene,
      cardboardScene,
      drawCircleScene,
      cutCircleScene,
      coneSequence,
    ];
    await sceneBuilders[index]?.();
    const used = new Set(layers.filter((l) => l.refId).map((l) => l.refId));
    const json =
      index === 0
        ? await hygieneScene()
        : {
            v: "5.13.0",
            fr: FPS,
            ip: 0,
            op: endFrame,
            w: W,
            h: H,
            nm: stage.name,
            ddd: 0,
            assets: [...A.values()].filter((a) => used.has(a.id)),
            layers,
            markers: [],
          };
    const dir = path.join(OUT, String(index + 1));
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, "data.json"), JSON.stringify(json));
  }
  // Only retire obsolete generated scene JSONs; never touch supplied artwork.
  for (const number of [10, 11]) {
    await fs.unlink(path.join(OUT, `${number}/data.json`)).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
    await fs.rmdir(path.join(OUT, String(number))).catch((error) => {
      if (!["ENOENT", "ENOTEMPTY"].includes(error.code)) throw error;
    });
  }
  const folder = path.join(
    ROOT,
    "public/narration/make-eye-pad-shield/full-animation",
  );
  await fs.mkdir(folder, { recursive: true });
  const script = {
    schemaVersion: 1,
    title: "Make an eye pad and eye shield",
    sourceVideo: "/videos/Workshop/PEC/7.MakepadNshield_720p.mp4",
    durationSeconds: clips.at(-1).end,
    defaultLanguage: "en",
    languages: {
      en: {
        label: "English",
        locale: "en-GB",
        voice: "en-GB-SoniaNeural",
        style: "Calm, clear British English medical educator",
      },
    },
    timingSource:
      "Nine Lottie scenes, beginning with DO hand hygiene. Folding/taping share stage 04; circle cutting and the single radial slit share stage 08. Source artwork 01–12; 10–12 form one rolling, taping and projected-camera sequence. The shield completion cue starts during the camera move.",
    cues: stages.flatMap((stage, i) =>
      stage.cues.map(({ offset, end, ...cue }) => ({
        ...cue,
        start: clips[i].start + offset,
        end: clips[i].start + end,
      })),
    ),
    videoTitleCues: [],
  };
  const { EYE_PAD_SHIELD_SECTIONS: sections } = await import(
    pathToFileURL(path.join(ROOT, "public/js/eyePadShieldScroll.js"))
  );
  require("./localize-eye-pad-shield-narration.cjs").applyEyePadShieldTranslations(
    script,
    sections,
    clips,
  );
  await fs.writeFile(
    path.join(folder, "script.json"),
    JSON.stringify(script, null, 2) + "\n",
  );
  console.log(
    `Built ${stages.length} Lottie stages, ${A.size} runtime artwork assets and ${script.durationSeconds}s English narration script.`,
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
