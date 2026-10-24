// Six source-art scenes: a four-panel Observation and five light-response scenes.
// Run extract-pupils-pec-art.py first. All delivered assets are local PNG/WebP.
const fs = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const sharp = require("sharp");
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public/scrolly/coreexam/pupils-pec");
const SOURCE = path.join(ROOT, "tmp/pupils-pec/layers");
const W = 1169,
  FPS = 30;
const BG = "#5c5547";
const c = (k) => ({ a: 0, k });
const keys = (values) => ({
  a: 1,
  k: values.map(([t, value], index) => ({
    t,
    s: Array.isArray(value) ? value : [value],
    ...(index < values.length - 1
      ? {
          e: Array.isArray(values[index + 1][1])
            ? values[index + 1][1]
            : [values[index + 1][1]],
          i: { x: [2 / 3], y: [2 / 3] },
          o: { x: [1 / 3], y: [1 / 3] },
        }
      : {}),
  })),
});
const fade = (at, duration = 15) =>
  keys([
    [0, 0],
    [at, 0],
    [at + duration, 100],
  ]);
const assets = new Map();
const compositions = new Map();
const ICON = 110;
let geometry, comparisonDeviceAnchor, deviceTurn;
const deliveredAssets = new Set();
let layers, end, height, sceneBackground;
function add(layer) {
  layer.ind = layers.length + 1;
  layers.unshift(layer);
  return layer;
}
function image(name, left, top, width, targetHeight, options = {}) {
  const asset = assets.get(name);
  if (!asset) throw new Error(`Missing source art: ${name}`);
  const h = targetHeight ?? (asset.h * width) / asset.w;
  return add({
    ddd: 0,
    ty: 2,
    nm: options.name || name,
    refId: asset.id,
    sr: 1,
    ks: {
      o: options.o || c(100),
      r: options.r || c(0),
      p: options.p || c([left + width / 2, top + h / 2, 0]),
      a: options.a || c([asset.w / 2, asset.h / 2, 0]),
      s: c([(width / asset.w) * 100, (h / asset.h) * 100, 100]),
    },
    ao: 0,
    ip: 0,
    op: end,
    st: 0,
    bm: 0,
  });
}
const transform = {
  ty: "tr",
  p: c([0, 0]),
  a: c([0, 0]),
  s: c([100, 100]),
  r: c(0),
  o: c(100),
  sk: c(0),
  sa: c(0),
};
function shape(name, items, options = {}) {
  return add({
    ddd: 0,
    ty: 4,
    nm: name,
    sr: 1,
    ks: {
      o: options.o || c(100),
      r: c(0),
      p: c(options.position || [0, 0, 0]),
      a: c([0, 0, 0]),
      s: options.s || c([100, 100, 100]),
    },
    ip: 0,
    op: end,
    st: 0,
    bm: 0,
    shapes: [{ ty: "gr", it: [...items, transform] }],
  });
}
function background() {
  add({
    ddd: 0,
    ty: 1,
    nm: "Scene background fills rect",
    sw: W,
    sh: height,
    sc: sceneBackground,
    sr: 1,
    ks: {
      o: c(100),
      r: c(0),
      p: c([W / 2, height / 2, 0]),
      a: c([W / 2, height / 2, 0]),
      s: c([100, 100, 100]),
    },
    ip: 0,
    op: end,
    st: 0,
    bm: 0,
  });
}
async function register(name, input) {
  const file = `${name}.webp`;
  await sharp(input)
    .webp({ quality: 96, alphaQuality: 100 })
    .toFile(path.join(OUT, "images", file));
  const meta = await sharp(path.join(OUT, "images", file)).metadata();
  assets.set(name, {
    id: name,
    w: meta.width,
    h: meta.height,
    u: "../images/",
    p: file,
    e: 0,
  });
}
function initial(property) {
  return property.a ? property.k[0].s : property.k;
}
function pathSvg(path) {
  const { v, i, o } = path;
  let d = `M${v[0].join(" ")}`;
  for (let n = 1; n <= v.length; n++) {
    const prev = (n - 1) % v.length,
      next = n % v.length;
    d += `C${v[prev].map((x, k) => x + o[prev][k]).join(" ")} ${v[next].map((x, k) => x + i[next][k]).join(" ")} ${v[next].join(" ")}`;
  }
  return d + "Z";
}
async function poster(dir, frameLayers) {
  let serial = 0;
  async function render(list) {
    let svg = "";
    for (const layer of [...list].reverse()) {
      if (layer.ip > 0 || layer.op <= 0) continue;
      const opacity = initial(layer.ks.o);
      if (Number(Array.isArray(opacity) ? opacity[0] : opacity) <= 0) continue;
      if (layer.ty === 4 && layer.nm.includes("pupil response")) {
        const [x, y] = initial(layer.ks.p),
          items = layer.shapes[0].it;
        const [w, h] = items[0].s.k;
        const colour = items[1].c.k.slice(0, 3).map((v) => Math.round(v * 255));
        svg += `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${h / 2}" fill="rgb(${colour.join(",")})"/>`;
        continue;
      }
      if (![0, 1, 2, 4].includes(layer.ty)) continue;
      const [x, y] = initial(layer.ks.p),
        [ax, ay] = initial(layer.ks.a),
        [sx, sy] = initial(layer.ks.s);
      const angle = initial(layer.ks.r),
        rotation = Array.isArray(angle) ? angle[0] : angle;
      svg += `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${sx / 100} ${sy / 100}) translate(${-ax} ${-ay})">`;
      if (layer.hasMask && layer.ty === 0) {
        const id = `frame${serial++}`;
        svg += `<defs><clipPath id="${id}"><path d="${pathSvg(layer.masksProperties[0].pt.k)}"/></clipPath></defs><g clip-path="url(#${id})">`;
      }
      if (layer.ty === 4) {
        const items = layer.shapes[0].it,
          value = initial(items[0].ks),
          curve = Array.isArray(value) ? value[0] : value;
        const colour = items[1].c.k.slice(0, 3).map((v) => Math.round(v * 255));
        svg += `<path d="${pathSvg(curve)}" fill="rgb(${colour.join(",")})"/>`;
      } else if (layer.ty === 1) {
        svg += `<rect width="${layer.sw}" height="${layer.sh}" fill="${layer.sc}"/>`;
      } else if (layer.ty === 0) {
        const id = `panel${serial++}`;
        svg += `<defs><clipPath id="${id}"><rect width="${layer.w}" height="${layer.h}"/></clipPath></defs><g clip-path="url(#${id})">${await render(compositions.get(layer.refId).layers)}</g>`;
      } else {
        const asset = assets.get(layer.refId),
          bytes = await sharp(path.join(OUT, "images", asset.p))
            .png()
            .toBuffer();
        if (layer.hasMask) {
          const id = `pool${serial++}`,
            property = layer.masksProperties[0].pt,
            path = property.a ? initial(property)[0] : property.k;
          svg += `<defs><clipPath id="${id}"><path d="${pathSvg(path)}"/></clipPath></defs><g clip-path="url(#${id})">`;
        }
        svg += `<image width="${asset.w}" height="${asset.h}" href="data:image/png;base64,${bytes.toString("base64")}"/>`;
        if (layer.hasMask) svg += "</g>";
      }
      if (layer.hasMask && layer.ty === 0) svg += "</g>";
      svg += "</g>";
    }
    return svg;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${height}"><rect width="100%" height="100%" fill="${sceneBackground}"/>${await render(frameLayers)}</svg>`;
  await fs.mkdir(path.join(dir, "images"), { recursive: true });
  await sharp(Buffer.from(svg))
    .resize(800)
    .png()
    .toFile(path.join(dir, "images/img_0.png"));
}
function panel(name, x, y, w, h, draw) {
  const outer = layers;
  layers = [];
  draw();
  compositions.set(name, { id: name, w, h, layers });
  layers = outer;
  return add({
    ddd: 0,
    ty: 0,
    nm: `${name} clipped panel`,
    refId: name,
    w,
    h,
    sr: 1,
    ks: {
      o: c(100),
      r: c(0),
      p: c([x, y, 0]),
      a: c([0, 0, 0]),
      s: c([100, 100, 100]),
    },
    ip: 0,
    op: end,
    st: 0,
    bm: 0,
  });
}
function icon(asset, x, y, name, at, duration = 15) {
  return image(asset, x, y, ICON, ICON, { name, o: fade(at, duration) });
}
function pupil(kind, row, x, y, moveEnd) {
  const radius = 18,
    finalRadius = [6.3, 12.6, 18][row];
  return shape(
    `${kind} pupil response ${row + 1}`,
    [
      { ty: "el", p: c([0, 0]), s: c([radius * 2, radius * 2]) },
      {
        ty: "fl",
        c: c(kind === "clear" ? [0.015, 0.015, 0.01, 1] : [0.8, 0.8, 0.8, 1]),
        o: c(100),
        r: 1,
      },
    ],
    {
      position: [x, y, 0],
      s: keys([
        [0, [100, 100, 100]],
        [moveEnd + 10, [100, 100, 100]],
        [
          moveEnd + 55,
          [(finalRadius / radius) * 100, (finalRadius / radius) * 100, 100],
        ],
      ]),
    },
  );
}
function originalPoolCircle(kind, row, scale) {
  const path = geometry[`${kind}-${row}`].pool,
    samples = [];
  for (let n = 0; n < path.v.length; n++) {
    const next = (n + 1) % path.v.length,
      a = path.v[n],
      b = a.map((v, k) => v + path.o[n][k]),
      d = path.v[next],
      c = d.map((v, k) => v + path.i[next][k]);
    for (let step = 0; step < 48; step++) {
      const t = step / 48,
        u = 1 - t;
      samples.push(
        a.map(
          (v, k) =>
            (u * u * u * v +
              3 * u * u * t * b[k] +
              3 * u * t * t * c[k] +
              t * t * t * d[k]) *
            scale,
        ),
      );
    }
  }
  let area = 0;
  for (let i = 0; i < samples.length; i++) {
    const a = samples[i],
      b = samples[(i + 1) % samples.length];
    area += a[0] * b[1] - b[0] * a[1];
  }
  const xs = samples.map((p) => p[0]),
    ys = samples.map((p) => p[1]);
  return {
    radius: Math.sqrt(Math.abs(area / 2) / Math.PI),
    cx: (Math.min(...xs) + Math.max(...xs)) / 2,
    cy: (Math.min(...ys) + Math.max(...ys)) / 2,
  };
}

function responseGrid(kind) {
  const rowStep = 350,
    F = 2.2,
    beforeW = 137 * F,
    panelW = 140 * F,
    panelH = 126 * F;
  for (let row = 0; row < 3; row++) {
    const top = (height - panelH - rowStep * 2) / 2 + row * rowStep,
      start = row * 105 + 15,
      moveEnd = start + 65;
    const afterX = kind === "clear" ? 365 : 703,
      cropY = [1199, 1339, 1481][row];
    image(`${kind}-${row}-before`, 52, top, beforeW, panelH);
    const cell = panel(
      `${kind}-${row}-panel`,
      401.8,
      top,
      panelW,
      panelH,
      () => {
        const [irisX, irisY] = geometry[`${kind}-${row}`].iris;
        const [beforeIrisX, beforeIrisY] =
          geometry[`${kind}-${row}`].beforeIris;
        const beforeCropX = kind === "clear" ? 206 : 545;
        const dx = (beforeIrisX - beforeCropX - (irisX - afterX)) * F;
        const dy = (beforeIrisY - irisY) * F;
        const camera = () =>
          keys([
            [0, [panelW / 2 + dx, panelH / 2 + dy, 0]],
            [start, [panelW / 2 + dx, panelH / 2 + dy, 0]],
            [moveEnd, [panelW / 2, panelH / 2, 0]],
          ]);
        image(`${kind}-${row}-base`, 0, 0, panelW + 48 * F, panelH + 48 * F, {
          p: camera(),
        });
        // Pan the right illustration internally, inside its fixed original frame.
        const bright = image(
          `${kind}-${row}-bright`,
          0,
          0,
          panelW + 48 * F,
          panelH + 48 * F,
          {
            p: camera(),
          },
        );
        const { radius, cx, cy } = originalPoolCircle(kind, row, F / 3);
        const scaleToPanel = F / 3;
        const localCx = (cx + 24 * F) / scaleToPanel;
        const localCy = (cy + 24 * F) / scaleToPanel;
        const r = radius / scaleToPanel,
          k = r * 0.5522847498;
        const original = {
          c: true,
          v: [
            [localCx, localCy - r],
            [localCx + r, localCy],
            [localCx, localCy + r],
            [localCx - r, localCy],
          ],
          i: [
            [-k, 0],
            [0, -k],
            [k, 0],
            [0, k],
          ],
          o: [
            [k, 0],
            [0, k],
            [-k, 0],
            [0, -k],
          ],
        };
        const shift = (-70.4 - dx) / scaleToPanel;
        const initialPool = structuredClone(original);
        initialPool.v = original.v.map(([x, y]) => [
          (x - localCx) * 0.48 + localCx + shift,
          y - dy / scaleToPanel,
        ]);
        for (const key of ["i", "o"])
          initialPool[key] = original[key].map(([x, y]) => [x * 0.48, y]);
        bright.hasMask = true;
        bright.masksProperties = [
          {
            inv: false,
            mode: "a",
            nm: "Circular pool of light",
            pt: keys([
              [0, [initialPool]],
              [start, [initialPool]],
              [moveEnd, [original]],
            ]),
            o: c(100),
            x: c(0),
          },
        ];
        const beam = image(
          "response-round-light",
          cx - radius,
          cy - radius,
          radius * 2,
          radius * 2,
          {
            name: `${kind}-${row}-beam`,
            p: keys([
              [0, [cx - 70.4, cy, 0]],
              [start, [cx - 70.4, cy, 0]],
              [moveEnd, [cx, cy, 0]],
            ]),
          },
        );
        const scale = beam.ks.s.k;
        beam.ks.s = keys([
          [0, [scale[0] * 0.48, scale[1], 100]],
          [start, [scale[0] * 0.48, scale[1], 100]],
          [moveEnd, scale],
        ]);
        // Use the complete transparent-window device from the first light scene.
        // Preserve full window/panel artwork at examination scale; crop the lower body.
        const device = image(
          "comparison-device",
          0,
          0,
          assets.get("comparison-device").w,
          assets.get("comparison-device").h,
          {
            name: `${kind}-${row}-instrument`,
            a: c([...comparisonDeviceAnchor, 0]),
            p: keys([
              [0, [10, cy, 0]],
              [start, [10, cy, 0]],
              [start + 32, [24, cy, 0]],
              [moveEnd, [38, cy, 0]],
            ]),
            r: keys([
              [0, 0],
              [start, 0],
              [moveEnd, -22],
            ]),
          },
        );
        const nativeScale =
          ((panelH * 1.34) / assets.get("comparison-device").h) * 100;
        device.ks.s = keys([
          [0, [nativeScale * 0.74, nativeScale * 0.74, 100]],
          [start, [nativeScale * 0.74, nativeScale * 0.74, 100]],
          [moveEnd, [nativeScale, nativeScale, 100]],
        ]);
        const response = pupil(
          kind,
          row,
          (irisX - afterX) * F,
          (irisY - cropY) * F,
          moveEnd,
        );
        const target = response.ks.p.k;
        response.ks.p = keys([
          [0, [target[0] + dx, target[1] + dy, 0]],
          [start, [target[0] + dx, target[1] + dy, 0]],
          [moveEnd, target],
        ]);
      },
    );
    const frame = structuredClone(geometry[`${kind}-${row}`].frame);
    for (const key of ["v", "i", "o"])
      frame[key] = frame[key].map((point) =>
        point.map((value) => (value * F) / 3),
      );
    cell.hasMask = true;
    cell.masksProperties = [
      {
        inv: false,
        mode: "a",
        nm: "Fixed original right cell outline",
        pt: c(frame),
        o: c(100),
        x: c(0),
      },
    ];
    image(`${kind}-${row}-arrow`, 325, top, 75 * F, panelH);
    image(
      `fundus-${row}`,
      756,
      top + (panelH - 127 * 1.975) / 2,
      119 * 1.975,
      127 * 1.975,
      { name: `${kind} fundus ${row + 1}`, o: fade(360, 20) },
    );
    icon(
      ["icon-tick", "icon-alert-orange", "icon-alert-red"][row],
      1007,
      top + (panelH - ICON) / 2,
      `${kind} status ${row + 1}`,
      375,
    );
  }
}
async function main() {
  const {
    PUPILS_PEC_STAGES: stages,
    PUPILS_PEC_CANVAS_HEIGHTS: heights,
    PUPILS_PEC_SCROLL_CONFIG: config,
    PUPILS_PEC_LANGUAGES: languages,
  } = await import(
    pathToFileURL(path.join(ROOT, "public/js/pupilsPecScroll.js"))
  );
  await fs.mkdir(path.join(OUT, "images"), { recursive: true });
  const sourceManifest = JSON.parse(
    await fs.readFile(path.join(SOURCE, "manifest.json"), "utf8"),
  );
  for (const name of Object.keys(sourceManifest))
    await register(name, path.join(SOURCE, `${name}.svg`));
  geometry = JSON.parse(
    await fs.readFile(path.join(SOURCE, "geometry.json"), "utf8"),
  );
  for (const name of [
    "icon-tick",
    "icon-alert-orange",
    "icon-alert-red",
    "icon-cross",
  ]) {
    const input = await sharp(path.join(SOURCE, `${name}.svg`))
      .trim({ background: "#00000000", threshold: 2 })
      .resize(256, 256, { fit: "contain", background: "#00000000" })
      .png()
      .toBuffer();
    await register(name, input);
  }
  // Tint the actual light silhouette, including its whole soft edge.
  const light = await sharp(path.join(SOURCE, "device-highlight-fill.svg"))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < light.data.length; i += 4) {
    light.data[i] = 254;
    light.data[i + 1] = 3;
    light.data[i + 2] = 0;
    light.data[i + 3] = Math.round(light.data[i + 3] * 0.3);
  }
  await register(
    "device-highlight-fill",
    await sharp(light.data, { raw: light.info }).png().toBuffer(),
  );
  for (const kind of ["clear", "cataract"])
    for (let row = 0; row < 3; row++) {
      const name = `${kind}-${row}-base`;
      await register(`${kind}-${row}-bright`, path.join(SOURCE, `${name}.svg`));
      const face = await sharp(path.join(SOURCE, `${name}.svg`))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      for (let i = 0; i < face.data.length; i += 4) {
        if (
          face.data[i] === 92 &&
          face.data[i + 1] === 85 &&
          face.data[i + 2] === 71
        )
          face.data[i + 3] = 0;
        else
          for (let channel = 0; channel < 3; channel++)
            face.data[i + channel] = Math.round(face.data[i + channel] * 0.6);
      }
      await register(
        name,
        await sharp(face.data, { raw: face.info }).png().toBuffer(),
      );
    }
  const labels = [
    "Normal",
    "Abnormal colour / shape",
    "Left 3rd CNP",
    "Right Sympathetic Palsy",
  ];
  for (let index = 0; index < labels.length; index++) {
    const font = index === 3 ? 37 : 39;
    await register(
      `observation-label-${index}`,
      Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="585" height="90"><rect width="100%" height="100%" fill="#1c0e01"/><text x="292.5" y="55" text-anchor="middle" fill="white" font-size="${font}" font-family="Arial,sans-serif">${labels[index]}</text></svg>`,
      ),
    );
  }
  const doDir = path.join(
    ROOT,
    "public/scrolly/coreexam/ophths/DO/01ObservationandFundalReflex/3/images",
  );
  for (const [name, index] of [
    ["do-thumb", 5],
    ["do-light", 8],
    ["do-button-on", 6],
  ])
    await register(name, path.join(doDir, `img_${index}.png`));
  const grip = await sharp(path.join(doDir, "img_7.png"))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < grip.data.length; i += 4) {
    const [r, g, b] = grip.data.subarray(i, i + 3);
    if (
      !(r > 75 && r > g * 1.25 && g > b * 1.1) ||
      (i / 4) % grip.info.width > 450
    )
      grip.data[i + 3] = 0;
  }
  await register(
    "do-grip",
    await sharp(grip.data, { raw: grip.info }).png().toBuffer(),
  );
  await register(
    "do-button-base",
    await sharp(path.join(doDir, "img_7.png"))
      .extract({ left: 460, top: 365, width: 175, height: 175 })
      .png()
      .toBuffer(),
  );
  const quiet = await sharp({
    create: { width: 425, height: 205, channels: 4, background: "#00000000" },
  })
    .composite([
      {
        input: await sharp(path.join(doDir, "img_1.png")).png().toBuffer(),
        left: 6,
        top: 6,
      },
      {
        input: await sharp(path.join(doDir, "img_0.png")).png().toBuffer(),
        left: 0,
        top: 0,
      },
      {
        input: await sharp(path.join(doDir, "img_0.png")).png().toBuffer(),
        left: 217,
        top: 0,
      },
    ])
    .png()
    .toBuffer();
  await register("quiet-dim-icons", quiet);
  // Bake the same complete first-scene instrument without the hand or beam.
  const deviceInput = await sharp(path.join(OUT, "images/switch-device.webp"))
    .composite([
      {
        input: path.join(OUT, "images/switch-lens-light.webp"),
        left: 0,
        top: 0,
      },
      {
        input: await sharp(path.join(OUT, "images/do-button-base.webp"))
          .resize(148, 148)
          .toBuffer(),
        left: 547,
        top: 820,
      },
    ])
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let x0 = deviceInput.info.width,
    y0 = deviceInput.info.height,
    x1 = 0,
    y1 = 0;
  for (let y = 0; y < deviceInput.info.height; y++)
    for (let x = 0; x < deviceInput.info.width; x++)
      if (deviceInput.data[(y * deviceInput.info.width + x) * 4 + 3] > 1) {
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
      }
  await register(
    "comparison-device",
    await sharp(deviceInput.data, { raw: deviceInput.info })
      .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
      .png()
      .toBuffer(),
  );
  comparisonDeviceAnchor = [(243 - 36) * 3 - x0, (807 - 684) * 3 - y0];
  await register(
    "response-round-light",
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360"><defs><radialGradient id="pool"><stop offset="0" stop-color="white" stop-opacity=".02"/><stop offset=".7" stop-color="white" stop-opacity=".1"/><stop offset=".92" stop-color="white" stop-opacity=".5"/><stop offset=".98" stop-color="white" stop-opacity=".65"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient></defs><circle cx="180" cy="180" r="180" fill="url(#pool)"/></svg>`,
    ),
  );

  // Repository-owned orthographic artwork supplied with the 2026-10-24 review.
  // The window centre is the common pivot, so the visible face stays registered
  // while the existing hand/forearm moves around its unchanged wrist axis.
  const views = path.join(__dirname, "assets/pupils-pec/front-side-back.png");
  for (const [name, left, width, centreX] of [
    ["approach-device-front", 660, 412, 890],
    ["approach-device-side", 1110, 160, 1191],
  ]) {
    const pixels = await sharp(views)
      .extract({ left, top: 780, width, height: 1780 })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    // Preserve the supplied frame, sight aperture, ruler and controls. Only the
    // white interior of the optical window receives the original lit shading.
    if (!name.endsWith("-side"))
      for (let y = 0; y < pixels.info.height; y++)
        for (let x = 0; x < pixels.info.width; x++) {
          const i = (y * pixels.info.width + x) * 4;
          const gx = left + x,
            gy = 780 + y;
          if (
            Math.abs(gx - centreX) < 122 &&
            gy > 1040 &&
            gy < 1245 &&
            pixels.data[i] > 245 &&
            pixels.data[i + 1] > 245 &&
            pixels.data[i + 2] > 245 &&
            pixels.data[i + 3] > 200
          ) {
            const d = Math.hypot((gx - centreX) / 145, (gy - 1200) / 180);
            const value = Math.round(90 + 163 * Math.min(1, d));
            pixels.data[i] = value;
            pixels.data[i + 1] = value;
            pixels.data[i + 2] = Math.max(0, value - 6);
          }
        }
    const bytes = await sharp(pixels.data, { raw: pixels.info })
      .png()
      .toBuffer();
    await register(
      name,
      Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="850" viewBox="-150 -150 300 850"><g transform="scale(.318) translate(${left - centreX} ${780 - 1145})"><image width="${width}" height="1780" href="data:image/png;base64,${bytes.toString("base64")}"/></g></svg>`,
      ),
    );
  }
  deviceTurn = await require("./lib/pupils-device-render.cjs")(
    path.join(OUT, "images/approach-device-front.webp"),
  );
  for (const [index, bytes] of deviceTurn.atlases.entries())
    await register(`approach-device-turn-${index}`, bytes);
  // Trace the supplied sleeve as one uniformly scaled silhouette, over the arm.
  await register(
    "approach-sleeve",
    path.join(__dirname, "assets/pupils-pec/examiner-sleeve.svg"),
  );
  await register(
    "approach-forearm",
    await sharp(path.join(SOURCE, "approach-hand.svg"))
      .ensureAlpha()
      .composite([
        {
          input: path.join(
            __dirname,
            "assets/pupils-pec/examiner-forearm-mask.svg",
          ),
          blend: "dest-in",
        },
      ])
      .png()
      .toBuffer(),
  );
  await register(
    "approach-light",
    path.join(__dirname, "assets/pupils-pec/examiner-light-pool.svg"),
  );
  await register(
    "observation-dividers",
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1169" height="1280"><path d="M584.5 0V1280 M0 640H1169" fill="none" stroke="white" stroke-width="6"/></svg>`,
    ),
  );
  for (let index = 0; index < stages.length; index++) {
    end = stages[index].seconds * FPS;
    height = heights[index];
    layers = [];
    sceneBackground = index === 0 ? "#1c0e01" : BG;
    background();
    if (index === 0) {
      for (let p = 0; p < 4; p++) {
        const x = ((p % 2) * W) / 2,
          y = (Math.floor(p / 2) * height) / 2;
        const faceH = (249 / 272) * (W / 2),
          faceY = y + (height / 2 - 90 - faceH) / 2;
        image(`observation-${p}`, x, faceY, W / 2, faceH);
        icon(
          p ? "icon-alert-red" : "icon-tick",
          x + W / 2 - ICON - 24,
          y + 24,
          `observation-symbol-${p}`,
          420,
          45,
        );
        image(`observation-label-${p}`, x, y + height / 2 - 90, W / 2, 90, {
          o: fade(420, 45),
        });
      }
      image("observation-dividers", 0, 0, W, height);
    } else if (index === 1) {
      const scale = W / 424,
        h = 464 * scale,
        top = (height - h) / 2;
      const dim = add({
        ddd: 0,
        ty: 1,
        nm: "Room becomes dim",
        sw: W,
        sh: height,
        sc: "#272217",
        sr: 1,
        ks: {
          o: fade(165, 45),
          r: c(0),
          p: c([W / 2, height / 2, 0]),
          a: c([W / 2, height / 2, 0]),
          s: c([100, 100, 100]),
        },
        ip: 0,
        op: end,
        st: 0,
        bm: 0,
      });
      image("do-grip", 161, 483, 555, 1038, { name: "Supporting hand" });
      const brightness = () =>
        keys([
          [0, 0],
          [45, 0],
          [51, 30],
          [95, 30],
          [101, 65],
          [145, 65],
          [151, 100],
        ]);
      image("switch-beam-extended", 0, top, W, h, {
        name: "Progressively brighter examination beam",
        o: brightness(),
      });
      image("switch-device", 0, top, W, h, {
        name: "Arclight transparent window",
      });
      image("switch-lens-light", 0, top, W, h, {
        name: "Lens light follows button brightness",
        o: brightness(),
      });
      const bx = (243 - 36) * scale,
        by = top + (982 - 684) * scale;
      image("do-button-base", bx - 68, by - 68, 136, 136, {
        name: "Reference rounded button",
      });
      const referenceButton = JSON.parse(
        await fs.readFile(path.join(doDir, "../data.json"), "utf8"),
      );
      const buttonReference = referenceButton.layers.find(
        (layer) => layer.refId === "image_6",
      ).ks;
      const gripReference = referenceButton.layers.find(
        (layer) => layer.refId === "image_7",
      ).ks;
      const buttonPosition = buttonReference.p.k.map((value, axis) =>
        axis < 2
          ? [161, 483][axis] +
            (value - gripReference.p.k[axis] + gripReference.a.k[axis]) * 0.75
          : 0,
      );
      const windows = [
        [31, 41, 45, 60],
        [60, 70, 95, 110],
        [88, 98, 145, 160],
      ];
      const buttonOpacity = structuredClone(buttonReference.o);
      buttonOpacity.k = windows.flatMap(([from, to, start, finish]) =>
        buttonReference.o.k
          .filter((key) => key.t >= from && key.t <= to + 0.01)
          .map((key) => ({
            ...structuredClone(key),
            t:
              start +
              ((Math.min(key.t, to) - from) / (to - from)) * (finish - start),
          })),
      );
      image("do-button-on", 0, 0, 141 * 0.75, 141 * 0.75, {
        name: "Button pressed highlight",
        a: c(buttonReference.a.k),
        p: c(buttonPosition),
        o: buttonOpacity,
      });
      // Keep the exact thumb/grip relationship and joint pivot from DO scene 3.
      const reference = JSON.parse(
        await fs.readFile(path.join(doDir, "../data.json"), "utf8"),
      );
      const refThumb = reference.layers.find(
        (layer) => layer.refId === "image_5",
      ).ks;
      const refGrip = reference.layers.find(
        (layer) => layer.refId === "image_7",
      ).ks;
      const S = 0.75;
      const pivot = refThumb.p.k.map((value, axis) =>
        axis < 2
          ? [161, 483][axis] +
            (value - refGrip.p.k[axis] + refGrip.a.k[axis]) * S
          : 0,
      );
      image("do-thumb", 0, 0, 845 * S, 1217 * S, {
        name: "Finger presses button",
        a: c(refThumb.a.k),
        p: c(pivot),
        r: keys([
          [0, 0],
          [30, 0],
          [45, 4],
          [60, 0],
          [95, 4],
          [110, 0],
          [145, 4],
          [160, 0],
        ]),
      });
      image("quiet-dim-icons", 784, 1040, 340, 164, {
        name: "Quiet, dim room icons",
        o: fade(165, 30),
      });
    } else if (index === 2) {
      const F = W / 373,
        strip = height / 3,
        hs = [150, 147, 151];
      ["fixation-base", "blocked-base", "device-base"].forEach((name, i) =>
        panel(`positioning-strip-${i}`, 0, i * strip, W, strip, () => {
          const y = (strip - hs[i] * F) / 2;
          image(name, 0, y, W, hs[i] * F);
          if (i === 0) {
            image(
              "target-highlight",
              (449 - 422) * F,
              y + (740 - 686) * F,
              29 * F,
              50 * F,
              { o: fade(30) },
            );
            image("fixation-arrow", 0, y, W, 150 * F, {
              name: "Fixation arrow from patient to target",
              o: fade(60, 60),
            });
            icon(
              "icon-tick",
              (759 - 422) * F - ICON / 2,
              y + (721 - 686) * F - ICON / 2,
              "fixation-check",
              135,
            );
          } else if (i === 1) {
            image("person-highlight", 0, y, W, 147 * F, { o: fade(195) });
            icon(
              "icon-cross",
              (759 - 422) * F - ICON / 2,
              y + (876 - 842) * F - ICON / 2,
              "blocked-cross",
              255,
            );
          } else {
            const lightCue = stages[2].cues.find(
              (cue) => cue.id === "avoid-light",
            );
            const lightAt = lightCue.offset * FPS;
            image("device-highlight-fill", 0, y, W, 151 * F, {
              o: fade(lightAt),
            });
            image("device-highlight", 0, y, W, 151 * F, { o: fade(lightAt) });
            icon(
              "icon-cross",
              (759 - 422) * F - ICON / 2,
              y + (1029 - 996) * F - ICON / 2,
              "device-cross",
              lightAt + 60,
            );
          }
        }),
      );
    } else if (index === 3) {
      const F = W / 373,
        h = 462 * F,
        top = (height - h) / 2;
      image("approach-base", 0, top, W, h);
      const anchor = [(1052 - 815) * 3, (835 - 686) * 3, 0],
        target = [(1052 - 815) * F, top + (835 - 686) * F, 0];
      const checkpoints = [
        [0, 20, -55, 40],
        [30, 20, -55, 40],
        [90, -25, -30, 20],
        [150, 0, 0, 0],
      ];
      const pos = keys(
        checkpoints.map(([t, dx, dy]) => [
          t,
          [target[0] + dx, target[1] + dy, 0],
        ]),
      );
      // Keep the lens-wide source on the turning window's right rim.
      const rimOffset = new Map([
        [0, -4.3],
        [30, -4.3],
        [90, -1.4],
        [150, 0],
      ]);
      image("approach-light", 0, top, W, h, {
        a: c(anchor),
        p: keys(
          checkpoints.map(([t, dx, dy]) => [
            t,
            [target[0] + dx + rimOffset.get(t) * F, target[1] + dy, 0],
          ]),
        ),
        o: fade(30, 90),
      });
      // Restore the PDF's foreground order: nasal bridge and far side of the
      // face are opaque in front of the projected beam.
      image("approach-face-front", 0, top, W, h, {
        name: "Nose and far face occlude the light",
      });
      const pivot = [640, 720],
        centre = [900, 1000],
        axis = (-35 * Math.PI) / 180;
      const rotate = (point, angle) => [
        point[0] * Math.cos(angle) - point[1] * Math.sin(angle),
        point[0] * Math.sin(angle) + point[1] * Math.cos(angle),
      ];
      const local = rotate([target[0] - pivot[0], target[1] - pivot[1]], -axis);
      const parentPositions = checkpoints.map(([t, dx, dy, wrist]) => {
        const v = rotate(
          [local[0], local[1] * Math.cos((wrist * Math.PI) / 180)],
          axis,
        );
        return [t, [target[0] + dx - v[0], target[1] + dy - v[1], 0]];
      });
      // The model is already projected in 3D. Keep it outside the arm's 2D
      // wrist foreshortening so its physical proportions are not scaled twice.
      const model = panel(
        "approach-rounded-device",
        0,
        0,
        deviceTurn.frameWidth,
        450, // Lower case stays inside the gripping hand throughout the turn.
        () => {
          for (let sheet = 0; sheet < deviceTurn.atlases.length; sheet++) {
            const first = sheet * 16,
              last = Math.min(first + 15, deviceTurn.count - 1);
            const position = (index) => {
              const tile = index % 16;
              return [
                deviceTurn.frameWidth * 4 - (tile % 8) * deviceTurn.frameWidth,
                deviceTurn.frameHeight -
                  Math.floor(tile / 8) * deviceTurn.frameHeight,
                0,
              ];
            };
            const at = (index) => (index === 0 ? 0 : 30 + index * 2);
            const sprite = image(
              `approach-device-turn-${sheet}`,
              0,
              0,
              deviceTurn.frameWidth * 8,
              deviceTurn.frameHeight * 2,
              { name: `Rounded device view sheet ${sheet + 1}` },
            );
            sprite.ip = at(first);
            sprite.op = last === deviceTurn.count - 1 ? end : at(last + 1);
            sprite.ks.p = {
              a: 1,
              k: Array.from({ length: last - first + 1 }, (_, i) => {
                const index = first + i;
                return { t: at(index), s: position(index), h: 1 };
              }),
            };
          }
        },
      );
      model.nm = "Rounded instrument turning from side to front";
      model.ks.a = c([...deviceTurn.anchor, 0]);
      model.ks.p = pos;
      model.ks.r = c(23);
      model.ks.s = c([(F / 3) * 80, (F / 3) * 80, 100]);
      const assembly = panel(
        "approach-wrist-40-degree-turn",
        0,
        0,
        1800,
        2000,
        () => {
          image("approach-hand", 0, 0, W, h, {
            name: "Hand and forearm rotating about the wrist axis",
            a: c([(pivot[0] / F) * 3, ((pivot[1] - top) / F) * 3, 0]),
            p: c([...centre, 0]),
            r: c(35),
          });
        },
      );
      assembly.ks.a = c([...centre, 0]);
      assembly.ks.p = keys(parentPositions);
      assembly.ks.r = c(-35);
      assembly.ks.s = keys(
        checkpoints.map(([t, , , wrist]) => [
          t,
          [100, 100 * Math.cos((wrist * Math.PI) / 180), 100],
        ]),
      );
      image("approach-sleeve", 0, top, W, h, {
        name: "Rounded blue examiner shoulder sleeve",
      });
      // Retain the upper arm behind the shirt; only the source-clipped
      // forearm and hand repeat in front, with identical animated transforms.
      const forearm = panel(
        "approach-forearm-over-sleeve",
        0,
        0,
        1800,
        2000,
        () => {
          const sourceHand = compositions.get(assembly.refId).layers[0];
          add({
            ...structuredClone(sourceHand),
            refId: "approach-forearm",
            nm: "Forearm and hand above the sleeve",
          });
        },
      );
      forearm.ks = structuredClone(assembly.ks);
      image("approach-occluder", 0, top, W, h, {
        name: "Patient face in front of side-held instrument and arm",
        o: keys([
          [0, 100],
          [70, 100],
          [90, 0],
        ]),
      });
      image(
        "approach-arrow",
        (985 - 815) * F,
        top + (775 - 686) * F,
        92 * F,
        58 * F,
        { o: fade(30, 120) },
      );
      const insetH = 203 * F;
      image("approach-insert", 0, height - insetH, 215 * F, insetH, {
        o: fade(185),
      });
      image("approach-dashes", 0, height - insetH, 215 * F, insetH, {
        o: fade(245),
      });
    } else responseGrid(index === 4 ? "clear" : "cataract");
    const used = new Set(),
      usedComps = new Set();
    function collect(list) {
      for (const layer of list) {
        if (!layer.refId) continue;
        if (compositions.has(layer.refId)) {
          usedComps.add(layer.refId);
          collect(compositions.get(layer.refId).layers);
        } else used.add(layer.refId);
      }
    }
    collect(layers);
    for (const id of used) deliveredAssets.add(id);
    const animation = {
      v: "5.13.0",
      fr: FPS,
      ip: 0,
      op: end,
      w: W,
      h: height,
      nm: stages[index].name,
      ddd: 0,
      assets: [...assets.values()]
        .filter((asset) => used.has(asset.id))
        .concat([...usedComps].map((id) => compositions.get(id))),
      layers,
      markers: [],
    };
    const dir = path.join(OUT, String(index + 1));
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, "data.json"), JSON.stringify(animation));
    await poster(dir, layers);
  }
  // Remove only superseded numeric stage folders owned by this generator.
  for (const entry of await fs.readdir(OUT, { withFileTypes: true })) {
    if (
      !entry.isDirectory() ||
      !/^\d+$/.test(entry.name) ||
      Number(entry.name) <= stages.length
    )
      continue;
    const target = path.resolve(OUT, entry.name);
    if (!target.startsWith(path.resolve(OUT) + path.sep))
      throw new Error("Invalid generated stage path");
    await fs.rm(target, { recursive: true, force: true });
  }
  // This feature owns this generated directory. Keep only the current library.
  const imageRoot = path.resolve(OUT, "images");
  const generatedFiles = new Set(
    [...deliveredAssets].map((id) => assets.get(id).p),
  );
  for (const file of await fs.readdir(imageRoot)) {
    if (!file.endsWith(".webp") || generatedFiles.has(file)) continue;
    const target = path.resolve(imageRoot, file);
    if (path.dirname(target) !== imageRoot)
      throw new Error("Invalid generated image path");
    await fs.unlink(target);
  }
  let clock = 1;
  const cues = stages.flatMap((stage) => {
    const start = clock;
    clock += stage.seconds;
    return stage.cues.map(({ offset, end: cueEnd, ...cue }) => ({
      ...cue,
      start: start + offset,
      end: start + cueEnd,
    }));
  });
  const narrationDir = path.join(
    ROOT,
    "public/narration/pupils-pec/full-animation",
  );
  await fs.writeFile(
    path.join(narrationDir, "script.json"),
    JSON.stringify(
      {
        schemaVersion: 1,
        title: "Pupils PEC",
        sourceDocument: "/pdfbasedanims/Pupils PEC_110826.pdf",
        durationSeconds: clock,
        defaultLanguage: "en",
        languages,
        cues,
        videoTitleCues: [
          { sourceText: "Observation", translations: { ko: "관찰" } },
          {
            sourceText: "Direct Light Response",
            translations: { ko: "직접 대광반사" },
          },
        ],
      },
      null,
      2,
    ) + "\n",
  );
  await fs.writeFile(
    path.join(OUT, "provenance.json"),
    JSON.stringify(
      {
        source: "public/pdfbasedanims/Pupils PEC_110826.pdf",
        buttonAnimation:
          "PDF transparent-window instrument and lens light, extended PDF beam contour; Direct Ophthalmoscopy thumb, grip and rounded button. Beam and lens share three brightness steps.",
        artwork:
          "Separated original PDF vector components, with a thinner rounded three-dimensional body turning from the opposite side, with recessed window and tubular sight loop, source window/solar artwork, a clean sleeve hem between upper arm and forearm, a window-anchored teardrop light pool, and an 80-percent instrument with its lower case hidden inside the grip and nasal foreground. Further dimmed smooth source-contour light gradients only on the left; equal-area circular pools on the right. Comparison device windows sit left of the eye at pool-centre height. Status circles share a 110-unit diameter.",
        deviceViews: "scripts/assets/pupils-pec/front-side-back.png",
        stages: config.paths,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `Built ${stages.length} scenes: one four-panel Observation and five Direct Light Response animations.`,
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
