// Original PDF layers, independently timed actors, and shared PEC scenes.
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const { pathToFileURL } = require("node:url");
const sharp = require("sharp");
const ROOT = path.resolve(__dirname, "../..");
const INPUT = path.join(ROOT, "tmp/pupils-advanced/layers");
const OUTPUT = path.join(ROOT, "public/scrolly/coreexam/pupils-advanced");
const W = 1169,
  FPS = 30;
let H = 1280;
const c = (k) => ({ a: 0, k });
function keys(values) {
  values = [...new Map(values)];
  if (values.length === 1) return c(values[0][1]);
  return {
    a: 1,
    k: values.map(([t, v], i) => ({
      t,
      s: Array.isArray(v) ? structuredClone(v) : [v],
      ...(i < values.length - 1
        ? {
            e: Array.isArray(values[i + 1][1])
              ? structuredClone(values[i + 1][1])
              : [values[i + 1][1]],
            i: { x: [0.667], y: [0.667] },
            o: { x: [0.333], y: [0.333] },
          }
        : {}),
    })),
  };
}
const fade = (at, length = 15) =>
  keys([
    [0, 0],
    [at, 0],
    [at + length, 100],
  ]);
const rgba = (hex) =>
  [...hex.matchAll(/[a-f0-9]{2}/gi)]
    .map((m) => parseInt(m[0], 16) / 255)
    .concat(1);
const clone = (x) => structuredClone(x);
const rect = (x, y, w, h) => ({
  c: true,
  v: [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ],
  i: Array.from({ length: 4 }, () => [0, 0]),
  o: Array.from({ length: 4 }, () => [0, 0]),
});
function roundedRect(w, h, r) {
  const k = r * 0.55228475;
  return {
    c: true,
    v: [
      [r, 0],
      [w - r, 0],
      [w, r],
      [w, h - r],
      [w - r, h],
      [r, h],
      [0, h - r],
      [0, r],
    ],
    i: [
      [-k, 0],
      [0, 0],
      [0, -k],
      [0, 0],
      [k, 0],
      [0, 0],
      [0, k],
      [0, 0],
    ],
    o: [
      [0, 0],
      [k, 0],
      [0, 0],
      [0, k],
      [0, 0],
      [-k, 0],
      [0, 0],
      [0, -k],
    ],
  };
}
function ellipse(x, y, rx, ry = rx) {
  const k = 0.55228475;
  return {
    c: true,
    v: [
      [x, y - ry],
      [x + rx, y],
      [x, y + ry],
      [x - rx, y],
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
  };
}
const moveCurve = (curve, dx, dy) => ({
  ...clone(curve),
  v: curve.v.map(([x, y]) => [x + dx, y + dy]),
});
const reverse = (curve) => ({
  ...clone(curve),
  v: [...curve.v].reverse(),
  i: [...curve.o].reverse(),
  o: [...curve.i].reverse(),
});
const tr = {
  ty: "tr",
  p: c([0, 0]),
  a: c([0, 0]),
  s: c([100, 100]),
  r: c(0),
  o: c(100),
  sk: c(0),
  sa: c(0),
};
const assets = new Map();
let layers = [],
  comps = [],
  end,
  art,
  statuses,
  reflexConstrictFrame = 390,
  rapdDilationFrame = 590;
function add(layer) {
  layer.ind = layers.length + 1;
  layers.unshift(layer);
  return layer;
}
function transform(options = {}) {
  return {
    o: options.o || c(100),
    r: options.r || c(0),
    p: options.p || c([0, 0, 0]),
    a: options.a || c([0, 0, 0]),
    s: options.s || c([100, 100, 100]),
  };
}
function base(type, name, options = {}) {
  return {
    ddd: 0,
    ty: type,
    nm: name,
    sr: 1,
    ks: transform(options),
    ip: 0,
    op: end,
    st: 0,
    bm: 0,
  };
}
function image(name, x, y, w, options = {}) {
  const a = assets.get(name);
  if (!a) throw Error("Missing art " + name);
  const h = (w * a.h) / a.w;
  return add({
    ...base(2, options.name || name, {
      p: c([x + w / 2, y + h / 2, 0]),
      a: c([a.w / 2, a.h / 2, 0]),
      s: c([(w / a.w) * 100, (w / a.w) * 100, 100]),
      ...options,
    }),
    refId: name,
    ao: 0,
  });
}
function solid(colour, w = W, h = H, name = "Full rect background") {
  return add({ ...base(1, name), sw: w, sh: h, sc: colour });
}
function shape(name, curves, style = {}, options = {}) {
  const items = curves.map((p) => ({ ty: "sh", ks: c(p) }));
  if (style.fill)
    items.push({ ty: "fl", c: c(rgba(style.fill)), o: c(100), r: 1 });
  if (style.stroke)
    items.push({
      ty: "st",
      c: c(rgba(style.stroke)),
      o: c(100),
      w: c(style.width || 1),
      lc: 2,
      lj: 2,
    });
  if (style.trim)
    items.push({
      ty: "tm",
      s: c(0),
      e: keys([
        [0, 0],
        [style.trim[0], 0],
        [style.trim[1], 100],
      ]),
      o: c(0),
      m: 1,
    });
  items.push(clone(tr));
  return add({ ...base(4, name, options), shapes: [{ ty: "gr", it: items }] });
}
function mask(layer, curve) {
  layer.hasMask = true;
  layer.masksProperties = [
    { inv: false, mode: "a", pt: c(curve), o: c(100), x: c(0) },
  ];
}
function imageMask(layer, sourceBox, curve) {
  const a = assets.get(layer.refId),
    scale = a.w / sourceBox[2];
  const mapped = clone(curve);
  mapped.v = mapped.v.map(([x, y]) => [x * scale, y * scale]);
  for (const k of ["i", "o"])
    mapped[k] = mapped[k].map((p) => p.map((v) => v * scale));
  mask(layer, mapped);
}
function reveal(layer, box, bounds, start, finish, direction) {
  const a = assets.get(layer.refId),
    source = a.sourceBox || box,
    s = a.w / source[2],
    x = (bounds[0] - source[0]) * s,
    y = (bounds[1] - source[1]) * s,
    w = (bounds[2] - bounds[0]) * s,
    h = (bounds[3] - bounds[1]) * s;
  const from = rect(direction === "left" ? x + w : x, y, 0, h || 4 * s),
    to = rect(x, y, w, h || 4 * s);
  mask(layer, to);
  layer.masksProperties[0].pt = keys([
    [0, [from]],
    [start, [from]],
    [finish, [to]],
  ]);
}
function revealBehindDevice(layer, bounds, motion, window, direction) {
  const a = assets.get(layer.refId),
    source = a.sourceBox,
    scale = a.w / source[2],
    times = new Set(motion.map((k) => k[0]));
  for (let i = 1; i < motion.length; i++)
    if (motion[i][1] !== motion[i - 1][1])
      for (let t = Math.ceil(motion[i - 1][0]); t < motion[i][0]; t++)
        times.add(t);
  const values = [...times]
    .sort((a, b) => a - b)
    .map((t) => {
      let i = motion.findIndex((k) => k[0] >= t);
      if (i < 0) i = motion.length - 1;
      const b = motion[i],
        a = motion[Math.max(0, i - 1)],
        f = (t - a[0]) / (b[0] - a[0] || 1),
        x = window[0] + a[1] + (b[1] - a[1]) * f;
      const edge = Math.max(bounds[0], Math.min(bounds[2], x)),
        left = direction === "left" ? edge : bounds[0],
        right = direction === "left" ? bounds[2] : edge;
      return [
        t,
        [
          rect(
            (left - source[0]) * scale,
            (bounds[1] - source[1]) * scale,
            (right - left) * scale,
            (bounds[3] - bounds[1]) * scale,
          ),
        ],
      ];
    });
  mask(layer, values.at(-1)[1][0]);
  layer.masksProperties[0].pt = keys(values);
  layer.nm = "Arrow revealed behind moving device: " + layer.refId;
}
function cover(box, target, draw, align = 0.5, fit = "cover") {
  const outside = layers;
  layers = [];
  const scale = (fit === "contain" ? Math.min : Math.max)(
    target[2] / box[2],
    target[3] / box[3],
  );
  draw(scale);
  const id = "comp-" + comps.length;
  comps.push({ id, w: box[2], h: box[3], layers });
  layers = outside;
  const x = target[0] + (target[2] - box[2] * scale) / 2,
    y = target[1] + (target[3] - box[3] * scale) * align;
  const layer = add({
    ...base(0, id, { p: c([x, y, 0]), s: c([scale * 100, scale * 100, 100]) }),
    refId: id,
    w: box[2],
    h: box[3],
  });
  mask(
    layer,
    rect(
      (target[0] - x) / scale,
      (target[1] - y) / scale,
      target[2] / scale,
      target[3] / scale,
    ),
  );
  return { scale, x, y, layer };
}
function nativeImage(name, box, options = {}) {
  const source = assets.get(name).sourceBox || box;
  return image(
    name,
    source[0] - box[0],
    source[1] - box[1],
    source[2],
    options,
  );
}
function pdfVector(record, box, start, finish, orientation) {
  for (let curve of record.curves) {
    curve = moveCurve(curve, -box[0], -box[1]);
    if (record.stroke && record.stroke !== "none") {
      const a = curve.v[0],
        b = curve.v.at(-1);
      if (orientation === "up" && a[1] < b[1]) curve = reverse(curve);
      if (orientation && typeof orientation === "object") {
        const distance = (p) =>
          Math.hypot(
            p[0] - orientation.centre[0],
            p[1] - orientation.centre[1],
          );
        if (distance(a) < distance(b) === orientation.inward)
          curve = reverse(curve);
      }
      shape("Original path " + record.index, [curve], {
        stroke: record.stroke,
        width: record.width,
        trim: [start, finish],
      });
    } else if (record.fill && record.fill !== "none")
      shape(
        "Original arrowhead " + record.index,
        [curve],
        { fill: record.fill },
        { o: fade(finish - 12, 12) },
      );
  }
}
function sample(curve, t) {
  const count = curve.v.length - 1;
  const q = Math.min(count - 0.00001, t * count),
    i = Math.floor(q),
    u = q - i,
    v = 1 - u,
    a = curve.v[i],
    d = curve.v[i + 1],
    b = a.map((x, k) => x + curve.o[i][k]),
    cc = d.map((x, k) => x + curve.i[i + 1][k]);
  return a.map(
    (x, k) =>
      v * v * v * x +
      3 * v * v * u * b[k] +
      3 * v * u * u * cc[k] +
      u * u * u * d[k],
  );
}
function travellingHead(record, stroke, box, start, finish) {
  let curve = stroke.curves[0];
  if (curve.v[0][1] < curve.v.at(-1)[1]) curve = reverse(curve);
  // Trim paths use distance, not Bezier parameter t. Use the same distance for
  // the original head, anchored at its base, so it stays attached to the shaft.
  const table = Array.from({ length: 513 }, (_, i) => ({
    p: sample(curve, i / 512),
    distance: 0,
  }));
  for (let i = 1; i < table.length; i++)
    table[i].distance =
      table[i - 1].distance +
      Math.hypot(...table[i].p.map((v, k) => v - table[i - 1].p[k]));
  const atDistance = (fraction) => {
    const d = fraction * table.at(-1).distance;
    const next = table.findIndex((p) => p.distance >= d);
    if (next <= 0) return table[0].p;
    const a = table[next - 1],
      b = table[next],
      t = (d - a.distance) / (b.distance - a.distance || 1);
    return a.p.map((v, k) => v + (b.p[k] - v) * t);
  };
  const positions = [],
    angles = [];
  for (let i = 0; i <= 64; i++) {
    const t = i / 64,
      p = atDistance(t),
      next = atDistance(Math.min(1, t + 0.002)),
      prev = atDistance(Math.max(0, t - 0.002));
    positions.push([
      start + t * (finish - start),
      [p[0] - box[0], p[1] - box[1], 0],
    ]);
    angles.push([
      start + t * (finish - start),
      (Math.atan2(next[1] - prev[1], next[0] - prev[0]) * 180) / Math.PI + 90,
    ]);
  }
  shape(
    "Travelling original sensory arrow",
    // Normalize the original rounded head about its shaft connection, retaining
    // all source Bezier corners while the tangent changes along the pathway.
    record.curves.map((original) => {
      const p = clone(original),
        anchor = atDistance(1),
        angle = (-angles.at(-1)[1] * Math.PI) / 180,
        rotate = ([x, y]) => [
          x * Math.cos(angle) - y * Math.sin(angle),
          x * Math.sin(angle) + y * Math.cos(angle),
        ];
      p.v = p.v.map((v) => rotate(v.map((x, k) => x - anchor[k])));
      p.i = p.i.map(rotate);
      p.o = p.o.map(rotate);
      return p;
    }),
    { fill: record.fill },
    {
      p: keys([[0, positions[0][1]], ...positions]),
      r: keys([[0, angles[0][1]], ...angles]),
      o: fade(start, 4),
    },
  );
}
function actor(name, box, anchor, motion, options = {}) {
  const a = assets.get(name),
    source = a.sourceBox || box,
    s = source[2] / a.w;
  return nativeImage(name, box, {
    a: c([(anchor[0] - source[0]) / s, (anchor[1] - source[1]) / s, 0]),
    p: keys(
      motion.map(([t, dx]) => [
        t,
        [anchor[0] - box[0] + dx, anchor[1] - box[1], 0],
      ]),
    ),
    ...options,
  });
}
function circles(name, box, scale, at) {
  for (const item of statuses[name] || []) {
    const d = 110 / scale;
    image(
      item.asset,
      item.centre[0] - box[0] - d / 2,
      item.centre[1] - box[1] - d / 2,
      d,
      { o: fade(at) },
    );
  }
}
function strokeLine(name, points, colour, start, finish, width = 9) {
  shape(
    name,
    [
      {
        c: false,
        v: points,
        i: points.map(() => [0, 0]),
        o: points.map(() => [0, 0]),
      },
    ],
    { stroke: colour, width, trim: [start, finish] },
  );
}
function divider(name) {
  return shape(
    name,
    [
      {
        c: false,
        v: [
          [0, H / 2],
          [W, H / 2],
        ],
        i: [
          [0, 0],
          [0, 0],
        ],
        o: [
          [0, 0],
          [0, 0],
        ],
      },
    ],
    { stroke: "#ffffff", width: 6 },
  );
}
function brainFork(outer, inner, box) {
  const source = outer.curves[0],
    junction = source.v[1];
  const segment = (from, to) => {
    const p = {
      c: false,
      v: clone(source.v.slice(from, to + 1)),
      i: clone(source.i.slice(from, to + 1)),
      o: clone(source.o.slice(from, to + 1)),
    };
    p.i[0] = [0, 0];
    p.o[p.o.length - 1] = [0, 0];
    return p;
  };
  pdfVector({ ...outer, curves: [segment(0, 1)] }, box, 450, 550);
  pdfVector(
    { ...outer, index: outer.index + " continuation", curves: [segment(1, 2)] },
    box,
    550,
    650,
  );
  const branch = clone(inner.curves[0]);
  const distance = (p) => Math.hypot(p[0] - junction[0], p[1] - junction[1]);
  const directed =
    distance(branch.v[0]) < distance(branch.v.at(-1))
      ? branch
      : reverse(branch);
  directed.v[0] = clone(junction);
  pdfVector({ ...inner, curves: [directed] }, box, 550, 650);
}
function anatomyHighlights(a, box) {
  const pulse = (start, finish) =>
    keys([
      [0, 0],
      [start, 0],
      [start + 6, 95],
      [finish, 95],
      [finish + 12, 0],
    ]);
  const outline = (name, curves, start, finish, options = {}) =>
    shape(
      "Anatomy highlight: " + name,
      curves.map((p) => moveCurve(p, -box[0], -box[1])),
      { stroke: "#ffe266", width: 2.4 },
      { o: pulse(start, finish), ...options },
    );
  outline("retina", [ellipse(90.5, 291.7, 24.3)], 145, 240);
  shape(
    "Anatomy highlight: optic nerve",
    [ellipse(0, 0, 7, 24)],
    { stroke: "#ffe266", width: 2.4 },
    { o: pulse(240, 330), p: c([116 - box[0], 244 - box[1], 0]), r: c(32) },
  );
  outline("chiasm", [ellipse(133, 220, 11, 9)], 330, 390);
  const tract = (points) => ({
    c: false,
    v: points,
    i: points.map(() => [0, 0]),
    o: points.map(() => [0, 0]),
  });
  outline(
    "tract",
    [
      tract([
        [136, 217],
        [156, 205],
        [179, 186],
      ]),
      tract([
        [129, 217],
        [109, 204],
        [92, 186],
      ]),
    ],
    390,
    450,
  );
  outline(
    "nuclei",
    a.nuclei.flatMap((r) => r.curves),
    450,
    650,
  );
}
function neural(name) {
  const a = art.neural[name],
    box = name === "reflex" ? [320, 402, 215, 201] : a.box;
  cover(
    box,
    [0, 0, W, H],
    () => {
      nativeImage(name + "-unlit", box);
      const switchedOn = {
        a: 1,
        k: [
          { t: 0, s: [0], h: 1 },
          { t: 45, s: [100], h: 1 },
        ],
      };
      nativeImage(name + "-pool", box, { o: clone(switchedOn) });
      const beam = nativeImage(name + "-shaft", box, { o: clone(switchedOn) });
      const source = assets.get(beam.refId).sourceBox,
        scale = assets.get(beam.refId).w / source[2],
        b = a.shaftBounds,
        x = (b[0] - source[0]) * scale,
        y = (b[1] - source[1]) * scale,
        width = (b[2] - b[0]) * scale,
        bottom = (Math.min(source[1] + source[3], b[3]) - source[1]) * scale;
      const empty = rect(x, bottom, width, 0),
        full = rect(x, y, width, bottom - y);
      mask(beam, full);
      beam.masksProperties[0].pt = keys([
        [0, [empty]],
        [45, [empty]],
        [150, [full]],
      ]);
      nativeImage(name + "-retina", box);
      if (name === "afferent") anatomyHighlights(a, box);
      const input = a.signals.filter((v) =>
        ["#0b00ff", "#00fffa"].includes(v.stroke || v.fill),
      );
      if (name === "afferent") {
        const origin = box[1] + 65;
        for (const r of input.filter((r) => r.stroke && r.bounds[3] > origin))
          pdfVector(r, box, 240, 450, "up");
        for (const colour of ["#0b00ff", "#00fffa"]) {
          const brain = input.filter(
            (r) => r.stroke === colour && r.bounds[3] <= origin,
          );
          brainFork(
            brain.find((r) => r.bounds[2] - r.bounds[0] > 20),
            brain.find((r) => r.bounds[2] - r.bounds[0] <= 20),
            box,
          );
        }
        for (const colour of ["#0b00ff", "#00fffa"]) {
          const line = input.find(
              (r) => r.stroke === colour && r.bounds[3] > origin,
            ),
            head = input.find((r) => r.fill === colour && !r.stroke);
          if (line && head) travellingHead(head, line, box, 240, 450);
        }
      } else {
        // Restore the original full-art directional wipes, including the long
        // side arrows. Pupil response and label timing remain independently set.
        for (const [asset, from, to, direction] of [
          ["reflex-afferent", 160, 240, "up"],
          [
            "reflex-efferent",
            240,
            Math.min(360, reflexConstrictFrame - 1),
            "down",
          ],
        ]) {
          const l = nativeImage(asset, box),
            aw = assets.get(asset).w,
            ah = assets.get(asset).h;
          const empty = rect(0, direction === "up" ? ah : 0, aw, 0),
            full = rect(0, 0, aw, ah);
          mask(l, full);
          l.masksProperties[0].pt = keys([
            [0, [empty]],
            [from, [empty]],
            [to, [full]],
          ]);
        }
      }
      if (name === "reflex") {
        // Efferent delivery ends at the pupils; only then do they constrict.
        for (const { bounds: b } of a.pupils) {
          const x = (b[0] + b[2]) / 2 - box[0],
            y = (b[1] + b[3]) / 2 - box[1];
          const pupil = shape(
            "Pupil constricts after efferent arrival",
            [ellipse(0, 0, (b[2] - b[0]) * 0.95, (b[3] - b[1]) * 0.95)],
            { fill: "#000000" },
            {
              p: c([x, y, 0]),
              s: keys([
                [0, [100, 100, 100]],
                [reflexConstrictFrame, [100, 100, 100]],
                [reflexConstrictFrame + 45, [53, 53, 100]],
              ]),
            },
          );
          if (x < box[2] / 2) {
            layers.splice(layers.indexOf(pupil), 1);
            layers.splice(layers.indexOf(beam) + 1, 0, pupil);
          }
        }
        nativeImage("reflex-direct-label", box, { o: fade(480, 12) });
        nativeImage("reflex-consensual-label", box, { o: fade(585, 12) });
      }
      nativeImage(name + "-device", box);
      nativeImage(name + "-lens-off", box, {
        o: {
          a: 1,
          k: [
            { t: 0, s: [100], h: 1 },
            { t: 45, s: [0], h: 1 },
          ],
        },
      });
      if (name === "afferent")
        for (const l of layers) {
          if (l.ks.p.a)
            for (const key of l.ks.p.k) {
              key.s[1] += 7;
              if (key.e) key.e[1] += 7;
            }
          else l.ks.p.k[1] += 7;
        }
    },
    name === "afferent" ? 1 : 0.5,
    name === "reflex" ? "contain" : "cover",
  );
}
function flow(name) {
  const f = art.flow[name],
    purple = name === "sympathetic" ? "#3a005a" : "#db00ff",
    start = name === "sympathetic" ? 25 : 255;
  const boxes = f.boxes.map((box, i) => ({
    box,
    x: i === 3 && name === "parasympathetic" ? W * 0.56 : (W - 580) / 2,
    y: 170 + i * 125,
    w: i === 3 && name === "parasympathetic" ? 396 : 580,
  }));
  for (let i = 0; i < 3; i++) {
    const a = boxes[i],
      b = boxes[i + 1],
      ah = (a.w * a.box[3]) / a.box[2];
    strokeLine(
      "Signal behind foreground boxes " + i,
      [
        [a.x + a.w / 2, a.y + ah / 2],
        [b.x + b.w / 2, b.y + 55],
      ],
      purple,
      start + i * 60,
      start + (i + 1) * 60,
      12,
    );
  }
  const irisScale = 6.35,
    leftW = f.left[2] * irisScale,
    rightW = f.right[2] * irisScale,
    leftX = (W - leftW - rightW - 20) / 2,
    rightX = leftX + leftW + 20,
    y = 675;
  const last = boxes[3];
  strokeLine(
    "Ciliary or cervical ganglion to iris",
    [
      [last.x + last.w / 2, last.y + 55],
      [rightX + rightW / 2, y + 179],
    ],
    purple,
    start + 180,
    start + 280,
    12,
  );
  if (name === "parasympathetic")
    strokeLine(
      "Third nerve motor branch",
      [
        [W / 2, 475],
        [leftX + leftW / 2, y + 130],
      ],
      "#000000",
      750,
      845,
    );
  image(name + "-heading", 0, 0, W);
  for (let i = 0; i < 4; i++) {
    const b = boxes[i];
    image(name + "-box-" + i, b.x, b.y, b.w);
  }
  image(name + "-motor", leftX, y, leftW);
  if (name === "parasympathetic") {
    cover(f.left, [leftX, y, leftW, f.left[3] * irisScale], () => {
      nativeImage(name + "-motor-eye", f.left, {
        name: "Eye opening and lower lid stay fixed",
      });
      const closed = shape(
        "Upper eyelid covers stationary iris",
        [rect(244 - f.left[0], 270 - f.left[1], 61, 0)],
        { fill: "#bb7c6c" },
      );
      closed.shapes[0].it[0].ks = keys([
        [0, [rect(244 - f.left[0], 270 - f.left[1], 61, 0)]],
        [780, [rect(244 - f.left[0], 270 - f.left[1], 61, 0)]],
        [785, [rect(244 - f.left[0], 270 - f.left[1], 61, 36)]],
        [787, [rect(244 - f.left[0], 270 - f.left[1], 61, 36)]],
        [795, [rect(244 - f.left[0], 270 - f.left[1], 61, 0)]],
      ]);
      const opening = moveCurve(f.eyeOpening[0], -f.left[0], -f.left[1]);
      opening.c = true;
      mask(closed, opening);
      const warp = (point, amount) => {
        const dx = point[0] - 273,
          open = 279 + 0.022 * dx * dx + 0.055 * dx,
          shut = 301 - 0.01 * dx * dx + 0.01 * dx;
        return [
          point[0] - f.left[0],
          open +
            amount * (shut - open) +
            (point[1] - open) * (1 - 1.15 * amount) -
            f.left[1],
        ];
      };
      const bend = (original, amount) => {
        const p = clone(original);
        p.v = original.v.map((v) => warp(v, amount));
        for (const key of ["i", "o"])
          p[key] = original[key].map((t, i) =>
            warp(
              t.map((v, k) => v + original.v[i][k]),
              amount,
            ).map((v, k) => v - p.v[i][k]),
          );
        return p;
      };
      for (const r of f.upperLid) {
        const style = {
          ...(r.fill === "none" ? {} : { fill: r.fill || "#090806" }),
          ...(r.stroke ? { stroke: r.stroke, width: r.width } : {}),
        };
        const upper = shape(
          "Upper eyelid flexes " + r.index,
          r.curves.map((p) => bend(p, 0)),
          style,
        );
        upper.shapes[0].it
          .filter((it) => it.ty === "sh")
          .forEach((it, i) => {
            const open = [bend(r.curves[i], 0)],
              closed = [
                r.index < 807
                  ? moveCurve(r.curves[i], -f.left[0], -f.left[1] + 10)
                  : bend(r.curves[i], 1),
              ];
            it.ks = keys([
              [0, open],
              [780, open],
              [785, closed],
              [787, closed],
              [795, open],
            ]);
          });
      }
    });
  }
  image(name + "-iris", rightX, y, rightW);
  const outside = layers;
  layers = [];
  const centre = [
      (f.discBounds[0] + f.discBounds[2]) / 2,
      (f.discBounds[1] + f.discBounds[3]) / 2,
    ],
    outerRadius = (f.discBounds[2] - f.discBounds[0]) / 2,
    cx = centre[0] - f.right[0],
    cy = centre[1] - f.right[1],
    from = name === "sympathetic" ? 6.2 : 12,
    to = (f.pupilBounds[2] - f.pupilBounds[0]) / 2,
    at = name === "sympathetic" ? 310 : 560,
    until = name === "sympathetic" ? 470 : 710,
    morphCircle = (label, r0, r1, style) => {
      const l = shape(label, [ellipse(cx, cy, r0)], style);
      l.shapes[0].it[0].ks = keys([
        [0, [ellipse(cx, cy, r0)]],
        [at, [ellipse(cx, cy, r0)]],
        [until, [ellipse(cx, cy, r1)]],
      ]);
      return l;
    };
  shape("Original muscle disc", [ellipse(cx, cy, outerRadius)], {
    fill: "#ede5ce",
  });
  if (name === "parasympathetic") {
    for (const r of [8.89, 11.79, 14.89, 17.65])
      morphCircle(
        "Constrictor muscle ring",
        12 + ((r - to) * (outerRadius - 12)) / (outerRadius - to),
        r,
        { stroke: "#908570", width: 0.45 },
      );
  } else {
    for (const fibre of f.fibres) {
      const original = fibre.curves[0],
        curve = (radius) => {
          const p = clone(original);
          p.v = p.v.map((v) => {
            const d = Math.hypot(v[0] - centre[0], v[1] - centre[1]);
            return Math.abs(d - to) < Math.abs(d - outerRadius)
              ? v.map(
                  (value, k) =>
                    centre[k] +
                    ((value - centre[k]) * radius) / to -
                    f.right[k],
                )
              : v.map((value, k) => value - f.right[k]);
          });
          return p;
        },
        l = shape("Original dilator fibre " + fibre.index, [curve(from)], {
          stroke: fibre.stroke,
          width: fibre.width,
        });
      l.shapes[0].it[0].ks = keys([
        [0, [curve(from)]],
        [at, [curve(from)]],
        [until, [curve(to)]],
      ]);
    }
  }
  morphCircle("Progressive muscle pupil", from, to, {
    fill: "#000000",
    stroke: "#908570",
    width: 0.55,
  });
  for (const r of f.radial)
    pdfVector(
      r,
      f.right,
      name === "sympathetic" ? 310 : 560,
      name === "sympathetic" ? 470 : 710,
      {
        centre: [centre[0] - f.right[0], centre[1] - f.right[1]],
        inward: name === "parasympathetic",
      },
    );
  const id = "radial-" + comps.length;
  comps.push({ id, w: f.right[2], h: f.right[3], layers });
  layers = outside;
  add({
    ...base(0, "Original radial arrows: " + name, {
      p: c([rightX, y, 0]),
      s: c([irisScale * 100, irisScale * 100, 100]),
    }),
    refId: id,
    w: f.right[2],
    h: f.right[3],
  });
}
function pupilActor(name, bounds, box, values) {
  const x = (bounds[0] + bounds[2]) / 2 - box[0],
    y = (bounds[1] + bounds[3]) / 2 - box[1];
  shape(
    name,
    [ellipse(0, 0, 2.9)],
    { fill: "#000000" },
    { p: c([x, y, 0]), s: keys(values.map(([t, s]) => [t, [s, s, 100]])) },
  );
}
function litFace(
  name,
  target,
  {
    on = 30,
    move,
    arrow,
    arrowBounds,
    arrowDirection = "left",
    arrows = [],
    statusAt,
    rapd = false,
  } = {},
) {
  const a = art.faces[name],
    sourceBox = a.box,
    box = [
      sourceBox[0] - 20,
      sourceBox[1] - 10,
      sourceBox[2] + 40,
      sourceBox[3] + 20,
    ];
  cover(
    box,
    target,
    (scale) => {
      nativeImage(name + "-dark", box);
      nativeImage(name + "-other", box);
      const motion = move || [[0, 0]],
        dxRight = 130.4,
        lightRiseFrames = 3,
        pupilStart = on + lightRiseFrames + 12;
      for (let side = 0; side < 2; side++) {
        const poses = motion.map(([t, dx]) => [
          t,
          (side ? dx / dxRight : 1 - dx / dxRight) * 100,
        ]);
        const weight = poses[0][1];
        const opacity = keys([
          [0, 0],
          ...poses.filter(([t]) => t < on).map(([t]) => [t, 0]),
          [on, 0],
          [on + lightRiseFrames, weight],
          ...poses.filter(([t]) => t > on + lightRiseFrames),
        ]);
        nativeImage(name + "-lit-" + side, box, { o: opacity });
      }
      const pool = actor(name + "-pool", box, a.window, motion, {
        o: fade(on, lightRiseFrames),
      });
      if (!move)
        pool.ks.s.k = pool.ks.s.k.map((v, i) => (i < 2 ? v * 1.13 : v));
      if (move) {
        const factor =
          ((assets.get(pool.refId).sourceBox || box)[2] /
            assets.get(pool.refId).w) *
          100;
        pool.ks.s = {
          a: 1,
          k: motion.map(([t, dx]) => ({
            t,
            s: [dx > 65 ? -factor : factor, factor, 100],
            h: 1,
          })),
        };
      }
      a.pupils.forEach(({ bounds }, i) =>
        pupilActor(
          name + " pupil " + i,
          bounds,
          box,
          // RAPD app: 250ms latency, 220ms pulse, then 520ms dilation after
          // arrival on the affected eye (glaucomaWorkshop.js / rapdCases.js).
          rapd
            ? [
                [0, 155],
                [pupilStart, 155],
                [pupilStart + 25, 82],
                [move.at(-2)[0] + 8, 82],
                [move.at(-2)[0] + 14, 101],
                [move.at(-2)[0] + 30, 120],
              ]
            : move
              ? [
                  [0, 155],
                  [pupilStart, 155],
                  [pupilStart + 25, 82],
                  [end - 1, 82],
                ]
              : [
                  [0, 155],
                  [pupilStart, 155],
                  [pupilStart + 65, 55],
                ],
        ),
      );
      for (const entry of [
        ...(arrow
          ? [
              {
                asset: arrow,
                bounds: arrowBounds,
                from: on,
                to: Math.min(end - 40, on + 120),
                direction: arrowDirection,
              },
            ]
          : []),
        ...arrows,
      ]) {
        const l = nativeImage(entry.asset, box);
        if (arrow && entry.asset === arrow && move)
          revealBehindDevice(
            l,
            entry.bounds,
            motion,
            a.window,
            entry.direction,
          );
        else
          reveal(l, box, entry.bounds, entry.from, entry.to, entry.direction);
      }
      actor(name + "-device", box, a.window, motion, {
        name: "Constant brightness examination device",
      });
      actor(name + "-lens-off", box, a.window, motion, {
        name: "Lens switches from black to white with light pool",
        o: keys([
          [0, 100],
          [on, 100],
          [on + lightRiseFrames, 0],
        ]),
      });
      if (statusAt != null) {
        if (name.startsWith("consensual")) {
          nativeImage(name + "-circle", box, { o: fade(on, 8) });
        }
        nativeImage(name + "-marks", box, { o: fade(statusAt) });
        circles(name + "-marks", box, scale, statusAt);
      }
    },
    0.5,
    "contain",
  );
}
function swinging() {
  const name = "swing";
  litFace(name, [0, 0, W, H], {
    on: 20,
    move: [
      [0, 0],
      [130, 0],
      [172, 130.4],
      [280, 130.4],
      [322, 0],
      [430, 0],
      [472, 130.4],
      [end - 1, 130.4],
    ],
    arrows: [
      {
        asset: "swing-arrow-right",
        bounds: [254, 452, 347, 465],
        from: 130,
        to: 172,
        direction: "right",
      },
      {
        asset: "swing-arrow-left",
        bounds: [255, 470, 349, 484],
        from: 280,
        to: 322,
        direction: "left",
      },
    ],
  });
}
function nearMethod() {
  for (const [name, target, box] of [
    ["near-distance", [0, 0, W, H / 2], art.near.top.box],
    ["near-target", [0, H / 2, W, H / 2], art.near.bottom.box],
  ])
    cover(
      box,
      target,
      () => {
        nativeImage(name + "-scene", box);
        if (name === "near-distance") {
          // Extend the existing pedestal beneath the inset target, without
          // rescaling either the target or the people.
          shape(
            "Distance target pedestal",
            [rect(70 - box[0], 646 - box[1], 45, 42)],
            { fill: "#d0c9b5" },
          );
          shape(
            "Distance target pedestal top",
            [rect(70 - box[0], 646 - box[1], 45, 1.5)],
            { fill: "#ffffff" },
          );
          for (const [suffix, o] of [
            ["-bottle", c(100)],
            ["-object", fade(20, 15)],
          ]) {
            const l = nativeImage(name + suffix, box, { o });
            l.ks.p.k[0] += 24;
          }
          const arrow = actor(name + "-arrow", box, [233, 634], [[0, 0]]);
          arrow.ks.s.k[0] *= 0.84;
          arrow.ks.s.k[1] *= 0.84;
          reveal(arrow, box, [84, 625, 235, 643], 65, 125, "left");
        } else {
          const tail = nativeImage(name + "-tail", box);
          imageMask(
            tail,
            box,
            rect(154.55 - box[0], 0, box[0] + box[2] - 154.55, box[3]),
          );
          tail.ks.p.k[0] += 24;
          actor(name + "-hand", box, [156, 771], [[0, 0]], {
            r: keys([
              [0, -140],
              [270, -140],
              [340, 0],
            ]),
          });
          const bubble = nativeImage(name + "-bubble", box);
          imageMask(bubble, box, rect(0, 0, 154.55 - box[0], box[3]));
          bubble.ks.p.k[0] += 24;
          const highlight = nativeImage(name + "-highlight", box, {
            o: fade(340, 15),
          });
          highlight.ks.p.k[0] += 24;
          for (const [i, b] of [
            [0, [199, 712, 226, 728]],
            [1, [106, 724, 145, 740]],
          ]) {
            const arrow = nativeImage(name + "-arrow-" + i, box);
            if (i === 1) arrow.ks.p.k[0] += 24;
            reveal(arrow, box, b, 340, 450, "left");
          }
        }
      },
      0.5,
      "cover",
    );
  divider("Near panels foreground divider");
}
function nearResults() {
  for (let row = 0; row < 2; row++) {
    const data = art.near[row],
      box = data.box;
    const card = cover(
      box,
      [
        125,
        (row * H) / 2 + 112 + (row === 0 ? 50 : -50),
        800,
        (800 * box[3]) / box[2],
      ],
      () => {
        nativeImage("near-single-" + row, box);
        data.eyes.forEach((eye, i) => {
          const before = [
              (eye.iris[0] + eye.iris[2]) / 2 - box[0],
              (eye.iris[1] + eye.iris[3]) / 2 - box[1],
            ],
            after = [
              (eye.targetIris[0] + eye.targetIris[2]) / 2 - box[0],
              (eye.targetIris[1] + eye.targetIris[3]) / 2 - box[1],
            ];
          const sclera = moveCurve(eye.sclera[0], -box[0], -box[1]);
          // PDF fills implicitly close paths; Lottie's mask renderer requires it.
          sclera.c = true;
          const radius = (eye.iris[2] - eye.iris[0]) / 2,
            pr = (eye.pupil[2] - eye.pupil[0]) / 2,
            final = (eye.targetPupil[2] - eye.targetPupil[0]) / 2;
          const iris = shape(
            "Original iris converges " + row + "-" + i,
            [ellipse(0, 0, radius)],
            { fill: "#b18419" },
          );
          // Animate group positions inside a stationary white-of-eye mask.
          const group = iris.shapes[0].it.at(-1);
          group.p = keys([
            [0, before],
            [row * 300 + 65, before],
            [row * 300 + 122.5, after],
          ]);
          mask(iris, sclera);
          const pupil = shape(
            "Near pupil response " + row + "-" + i,
            [ellipse(0, 0, pr)],
            { fill: "#000000" },
          );
          const pt = pupil.shapes[0].it.at(-1);
          pt.p = clone(group.p);
          pt.s = keys([
            [0, [100, 100]],
            [row * 300 + 65, [100, 100]],
            [row * 300 + 122.5, [(final / pr) * 100, (final / pr) * 100]],
          ]);
          mask(pupil, sclera);
        });
        nativeImage("near-eyelids-" + row, box);
      },
      0.5,
      "contain",
    );
    mask(card.layer, roundedRect(box[2], box[3], 8));
    // Reuse the canonical source circle/glyph after the motion, at a fixed size.
    const symbol = (statuses["near-result-" + row + "-marks"] || [])[0];
    if (symbol)
      image(
        symbol.asset,
        W - 140,
        (row * H) / 2 + H / 4 - 55 + (row === 0 ? 50 : -50),
        110,
        {
          o: fade(row ? 550 : 250),
        },
      );
  }
}
function svgPath(p) {
  let d = `M${p.v[0].join(" ")}`;
  for (let i = 1; i < p.v.length + (p.c ? 1 : 0); i++) {
    const j = i % p.v.length,
      k = (i - 1) % p.v.length;
    d += ` C${p.v[k].map((x, a) => x + p.o[k][a]).join(" ")} ${p.v[j].map((x, a) => x + p.i[j][a]).join(" ")} ${p.v[j].join(" ")}`;
  }
  return d + (p.c ? "Z" : "");
}
const initial = (p) => (p.a ? p.k[0].s : p.k);
async function poster(file) {
  let serial = 0;
  async function render(list) {
    let s = "";
    for (const l of [...list].reverse()) {
      const opacity = Number(initial(l.ks.o));
      if (opacity <= 0) continue;
      const [x, y] = initial(l.ks.p),
        [ax, ay] = initial(l.ks.a),
        [sx, sy] = initial(l.ks.s),
        r = Number(initial(l.ks.r));
      s += `<g opacity="${opacity / 100}" transform="translate(${x} ${y}) rotate(${r}) scale(${sx / 100} ${sy / 100}) translate(${-ax} ${-ay})">`;
      if (l.hasMask) {
        const p = initial(l.masksProperties[0].pt),
          curve = Array.isArray(p) ? p[0] : p,
          id = "mask" + serial++;
        s += `<defs><clipPath id="${id}"><path d="${svgPath(curve)}"/></clipPath></defs><g clip-path="url(#${id})">`;
      }
      if (l.ty === 1)
        s += `<rect width="${l.sw}" height="${l.sh}" fill="${l.sc}"/>`;
      if (l.ty === 2) {
        const a = assets.get(l.refId);
        s += `<image width="${a.w}" height="${a.h}" href="data:image/png;base64,${(
          await sharp(path.join(OUTPUT, "images", a.p))
            .png()
            .toBuffer()
        ).toString("base64")}"/>`;
      }
      if (l.ty === 0)
        s += await render(comps.find((a) => a.id === l.refId).layers);
      if (l.ty === 4)
        for (const g of l.shapes) {
          const trim = g.it.find((i) => i.ty === "tm");
          if (trim && Number(initial(trim.e)) === 0) continue;
          const t = g.it.find((i) => i.ty === "tr"),
            [px, py] = initial(t.p),
            [ssx, ssy] = initial(t.s);
          const fill = g.it.find((i) => i.ty === "fl"),
            stroke = g.it.find((i) => i.ty === "st"),
            colour = (prop) =>
              "#" +
              initial(prop)
                .slice(0, 3)
                .map((v) =>
                  Math.round(v * 255)
                    .toString(16)
                    .padStart(2, "0"),
                )
                .join("");
          s += `<g transform="translate(${px} ${py}) scale(${ssx / 100} ${ssy / 100})">`;
          for (const item of g.it.filter((i) => i.ty === "sh")) {
            const value = initial(item.ks);
            s += `<path d="${svgPath(Array.isArray(value) ? value[0] : value)}" fill="${fill ? colour(fill.c) : "none"}" ${stroke ? `stroke="${colour(stroke.c)}" stroke-width="${initial(stroke.w)}"` : ""}/>`;
          }
          s += "</g>";
        }
      if (l.hasMask) s += "</g>";
      s += "</g>";
    }
    return s;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${await render(layers)}</svg>`;
  await fs.mkdir(path.dirname(file), { recursive: true });
  await sharp(Buffer.from(svg)).resize(800).png().toFile(file);
}
async function main() {
  const config = await import(
    pathToFileURL(path.join(ROOT, "public/js/pupilsAdvancedScroll.js"))
  );
  const {
    PUPILS_ADVANCED_STAGES: stages,
    PUPILS_ADVANCED_SECTIONS: sections,
    PUPILS_ADVANCED_LANGUAGES: languages,
    PUPILS_ADVANCED_TITLE_TRANSLATIONS: titles,
  } = config;
  try {
    const work = path.join(ROOT, "tmp/pupils-advanced/narration/en"),
      boundaries = (
        await fs.readFile(
          path.join(work, "reflex-output.boundaries.jsonl"),
          "utf8",
        )
      )
        .trim()
        .split(/\r?\n/)
        .map(JSON.parse),
      word = boundaries.find((b) => /constrict/i.test(b.text)),
      qa = JSON.parse(
        await fs.readFile(path.join(work, "qa.json"), "utf8"),
      ).find((c) => c.id === "reflex-output");
    if (word)
      reflexConstrictFrame = Math.round(
        (8 + word.offset / 1e7 / (qa?.playbackSpeed || 1)) * FPS,
      );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  try {
    const work = path.join(ROOT, "tmp/pupils-advanced/narration/en"),
      boundaries = (
        await fs.readFile(
          path.join(work, "swing-rapd.boundaries.jsonl"),
          "utf8",
        )
      )
        .trim()
        .split(/\r?\n/)
        .map(JSON.parse),
      word = boundaries.find((b) => /^dilate$/i.test(b.text)),
      qa = JSON.parse(
        await fs.readFile(path.join(work, "qa.json"), "utf8"),
      ).find((c) => c.id === "swing-rapd");
    if (word)
      rapdDilationFrame = Math.round(
        (10 + word.offset / 1e7 / (qa?.playbackSpeed || 1)) * FPS,
      );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  art = JSON.parse(
    await fs.readFile(path.join(INPUT, "animation.json"), "utf8"),
  );
  statuses = JSON.parse(
    await fs.readFile(path.join(INPUT, "statuses.json"), "utf8"),
  );
  const manifest = JSON.parse(
    await fs.readFile(path.join(INPUT, "manifest.json"), "utf8"),
  );
  await fs.mkdir(path.join(OUTPUT, "images"), { recursive: true });
  for (const [name, info] of Object.entries(manifest)) {
    const file = name + ".webp";
    let input = path.join(INPUT, name + ".svg");
    const face = art.faces[name.replace(/-pool$/, "")];
    if (name.endsWith("-pool") && face) {
      // The PDF embeds a rectangular, already clipped light bitmap. Rebuild its
      // measured ellipse with a continuous transparent edge before moving it.
      const [x, y, w, h] = info.box,
        b = face.poolBounds;
      input = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${info.width}" height="${info.height}" viewBox="${x} ${y} ${w} ${h}"><defs><radialGradient id="pool"><stop stop-color="white" stop-opacity=".8"/><stop offset=".4" stop-color="white" stop-opacity=".6"/><stop offset=".75" stop-color="white" stop-opacity=".18"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient></defs><ellipse cx="${(b[0] + b[2]) / 2}" cy="${(b[1] + b[3]) / 2}" rx="${(b[2] - b[0]) * 0.6}" ry="${(b[3] - b[1]) * 0.6}" fill="url(#pool)"/></svg>`,
      );
    }
    await sharp(input)
      .webp({ quality: 96, alphaQuality: 100 })
      .toFile(path.join(OUTPUT, "images", file));
    assets.set(name, {
      id: name,
      w: info.width,
      h: info.height,
      u: "../images/",
      p: file,
      e: 0,
      sourceBox: info.box,
    });
  }
  for (const [name, face] of Object.entries(art.faces))
    for (const [suffix, brightness, centre] of [
      ["dark", 0.4, null],
      ["other", 0.56, face.other],
      ["lit-0", 1, face.lit],
      ["lit-1", 1, face.other],
    ]) {
      const original = assets.get(name + "-face"),
        file = name + "-" + suffix + ".webp";
      const { data, info } = await sharp(
        path.join(OUTPUT, "images", original.p),
      )
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      for (let i = 0; i < data.length; i += 4) {
        for (let k = 0; k < 3; k++)
          data[i + k] = Math.round(data[i + k] * brightness);
        if (centre) {
          const pixel = i / 4,
            x = ((pixel % info.width) / info.width) * face.box[2] + face.box[0],
            y =
              (Math.floor(pixel / info.width) / info.height) * face.box[3] +
              face.box[1];
          const distance = Math.hypot(
            (x - centre[0]) / (name.startsWith("consensual") ? 40 : 34),
            (y - centre[1]) / (name.startsWith("consensual") ? 33 : 28),
          );
          const alpha = Math.max(0, Math.min(1, (1 - distance) / 0.45));
          data[i + 3] = Math.round(data[i + 3] * alpha);
        }
      }
      await sharp(data, { raw: info })
        .webp({ quality: 96, alphaQuality: 100 })
        .toFile(path.join(OUTPUT, "images", file));
      assets.set(name + "-" + suffix, {
        ...original,
        id: name + "-" + suffix,
        p: file,
      });
    }
  const usedAll = new Set();
  for (let index = 0; index < stages.length; index++) {
    if (stages[index].pecStageIndex != null) continue;
    layers = [];
    comps = [];
    H = index === 3 ? 1093 : 1280;
    end = stages[index].seconds * FPS;
    solid(
      index >= 10 && index <= 12
        ? "#000000"
        : index === 0 || index === 3
          ? "#443e32"
          : index === 2
            ? "#453f35"
            : "#aaa393",
    );
    if (index === 0) neural("afferent");
    else if (index === 1) flow("parasympathetic");
    else if (index === 2) flow("sympathetic");
    else if (index === 3) neural("reflex");
    else if (index === 10) {
      litFace("consensual-left", [0, 0, W, H / 2], { on: 30, statusAt: 195 });
      litFace("consensual-right", [0, H / 2, W, H / 2], {
        on: 240,
        statusAt: 375,
      });
      divider("Consensual full-width divider");
    } else if (index === 11) swinging();
    else if (index === 12) {
      litFace("swing-normal", [0, 0, W, H / 2], {
        on: 30,
        move: [
          [0, 130.4],
          [125, 130.4],
          [167, 0],
          [end - 1, 0],
        ],
        arrow: "swing-normal-arrow",
        arrowBounds: [427, 420, 523, 434],
        statusAt: 220,
      });
      litFace("swing-rapd", [0, H / 2, W, H / 2], {
        on: 300,
        move: [
          [0, 130.4],
          [rapdDilationFrame - 68, 130.4],
          [rapdDilationFrame - 8, 0],
          [end - 1, 0],
        ],
        arrow: "swing-rapd-arrow",
        arrowBounds: [425, 503, 520, 518],
        statusAt: rapdDilationFrame + 30,
        rapd: true,
      });
    } else if (index === 13) nearMethod();
    else if (index === 14) nearResults();
    const used = new Set();
    for (const l of [...layers, ...comps.flatMap((a) => a.layers)])
      if (l.ty === 2) used.add(l.refId);
    for (const id of used) usedAll.add(id);
    const data = {
      v: "5.13.0",
      fr: FPS,
      ip: 0,
      op: end,
      w: W,
      h: H,
      nm: stages[index].name,
      ddd: 0,
      assets: [...used].map((id) => assets.get(id)).concat(comps),
      layers,
      markers: [],
    };
    const dir = path.join(OUTPUT, "" + (index + 1));
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, "data.json"), JSON.stringify(data));
    await poster(path.join(dir, "images/img_0.png"));
  }
  // Only the generator's obsolete numeric folders and images may be removed.
  for (const entry of await fs.readdir(OUTPUT, { withFileTypes: true })) {
    if (!entry.isDirectory() || !/^\d+$/.test(entry.name)) continue;
    const i = Number(entry.name) - 1;
    if (i < stages.length && stages[i].pecStageIndex == null) continue;
    const target = path.resolve(OUTPUT, entry.name);
    if (!target.startsWith(OUTPUT + path.sep))
      throw Error("Invalid generated path");
    await fs.rm(target, { recursive: true, force: true });
  }
  const keep = new Set([...usedAll].map((id) => assets.get(id).p));
  for (const file of await fs.readdir(path.join(OUTPUT, "images")))
    if (file.endsWith(".webp") && !keep.has(file))
      await fs.unlink(path.join(OUTPUT, "images", file));
  let clock = 1;
  const cues = stages.flatMap((stage) => {
    const start = clock;
    clock += stage.seconds;
    return stage.cues.map(({ offset, end, ...cue }) => ({
      ...cue,
      start: start + offset,
      end: start + end,
      ...(stage.pecStageIndex != null ? { source: "pupils-pec" } : {}),
    }));
  });
  const narration = path.join(
    ROOT,
    "public/narration/pupils-advanced/full-animation",
  );
  await fs.mkdir(narration, { recursive: true });
  const pecStart = 1 + stages.slice(0, 4).reduce((n, s) => n + s.seconds, 0);
  await fs.writeFile(
    path.join(narration, "script.json"),
    JSON.stringify(
      {
        schemaVersion: 1,
        title: "Pupils",
        sourceDocument: "/pdfbasedanims/Pupils Advanced_110826.pdf",
        durationSeconds: clock,
        defaultLanguage: "en",
        languages,
        cues,
        visualCues: [
          {
            id: "reflex-constriction",
            language: "en",
            word: "constrict",
            at:
              1 +
              stages.slice(0, 3).reduce((sum, s) => sum + s.seconds, 0) +
              reflexConstrictFrame / FPS,
          },
          {
            id: "rapd-dilation",
            language: "en",
            word: "dilate",
            at:
              1 +
              stages.slice(0, 12).reduce((sum, s) => sum + s.seconds, 0) +
              rapdDilationFrame / FPS,
          },
        ],
        reusedAudio: {
          folder: "pupils-pec",
          sourceStart: 1,
          sourceEnd: 102,
          targetStart: pecStart,
        },
        videoTitleCues: sections.map((s, i) => ({
          sourceText: s.title,
          translations: { ko: titles[i] },
        })),
      },
      null,
      2,
    ) + "\n",
  );
  const digest = async (f) =>
    crypto
      .createHash("sha256")
      .update(await fs.readFile(path.join(ROOT, f)))
      .digest("hex");
  const source = "public/pdfbasedanims/Pupils Advanced_110826.pdf",
    ai = "public/pdfbasedanims/Pupils Advanced.ai";
  await fs.writeFile(
    path.join(OUTPUT, "provenance.json"),
    JSON.stringify(
      {
        source,
        illustratorMaster: ai,
        pdfSha256: await digest(source),
        aiSha256: await digest(ai),
        artwork:
          "Original PDF components with proportional cover crops, independent illumination, directional source arrows and stationary foreground flowchart boxes. Observation and all five Direct Light Response scenes reuse Pupils PEC verbatim.",
        stages: config.PUPILS_ADVANCED_SCROLL_CONFIG.paths,
        anatomyReference:
          "https://neuro-ophthalmology.stanford.edu/2019/10/neuro-ophthalmology-illustrated-chapter-12-the-pupil-2/",
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `Built ${stages.length} stages (${stages.filter((s) => s.pecStageIndex != null).length} shared PEC), ${cues.length} cues, ${clock}s.`,
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
