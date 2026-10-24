// Bake the supplied optical-window artwork onto a rounded, extruded instrument.
// The output is a small Lottie sprite atlas: no WebGL or 3D runtime is shipped.
const sharp = require("sharp");
const FW = 180,
  FH = 600,
  COUNT = 61,
  AA = 2,
  HALF_DEPTH = 13;
const unit = (v) => {
  const l = Math.hypot(...v) || 1;
  return v.map((x) => x / l);
};
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const sub = (a, b) => a.map((x, i) => x - b[i]);
const dot = (a, b) => a.reduce((n, x, i) => n + x * b[i], 0);
function rounded(w, h, r, cy, steps = 16) {
  const out = [];
  for (let corner = 0; corner < 4; corner++) {
    const cx = (corner === 0 || corner === 3 ? -1 : 1) * (w / 2 - r);
    const yy = cy + (corner < 2 ? -1 : 1) * (h / 2 - r);
    for (let i = 0; i < steps; i++) {
      const a = Math.PI + (corner * Math.PI) / 2 + ((i / steps) * Math.PI) / 2;
      out.push([cx + r * Math.cos(a), yy + r * Math.sin(a)]);
    }
  }
  return out;
}
function inside(x, y, w, h, r, cy) {
  const dx = Math.abs(x) - (w / 2 - r),
    dy = Math.abs(y - cy) - (h / 2 - r);
  return (
    Math.hypot(Math.max(0, dx), Math.max(0, dy)) <= r && dx <= r && dy <= r
  );
}
function geometry() {
  const vertices = [],
    faces = [];
  const vertex = (p) => (
    vertices.push({ p: [p[0], p[1], (p[2] * HALF_DEPTH) / 17], n: [0, 0, 0] }),
    vertices.length - 1
  );
  function rings(profiles, contour, material) {
    const ring = profiles.map(([z, inset]) =>
      contour(inset).map(([x, y]) => vertex([x, y, z])),
    );
    for (let r = 0; r < ring.length - 1; r++)
      for (let i = 0; i < ring[r].length; i++) {
        const j = (i + 1) % ring[r].length;
        faces.push({
          ids: [ring[r][i], ring[r + 1][i], ring[r + 1][j]],
          material,
        });
        faces.push({ ids: [ring[r][i], ring[r + 1][j], ring[r][j]], material });
      }
  }
  const profiles = [
    [-17, 5],
    [-16, 2.4],
    [-14, 0.7],
    [-11, 0],
    [11, 0],
    [14, 0.7],
    [16, 2.4],
    [17, 5],
  ];
  rings(
    profiles,
    (inset) => rounded(108 - 2 * inset, 495 - 2 * inset, 25 - inset, 197.5),
    "body",
  );
  // A recessed aperture has real inner walls rather than a squashed white patch.
  rings(
    [
      [-17, 0],
      [-11, 3],
      [11, 3],
      [17, 0],
    ],
    (inset) => rounded(74 - 2 * inset, 63 - 2 * inset, 13 - inset, -1.5),
    "window",
  );
  function quad(z, x0, y0, x1, y1, material) {
    const v = [
      [x0, y0, z],
      [x1, y0, z],
      [x1, y1, z],
      [x0, y1, z],
    ].map(vertex);
    faces.push(
      { ids: [v[0], v[1], v[2]], material },
      { ids: [v[0], v[2], v[3]], material },
    );
  }
  quad(17, -49, -45, 49, 440, "front");
  quad(-17, -37, -33, 37, 30, "glass");
  // The sight loop is a rounded tube, and stays rounded in the glancing view.
  const loops = [];
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2,
      n = unit([Math.cos(a) / 20, Math.sin(a) / 29, 0]);
    loops.push(
      Array.from({ length: 10 }, (_, j) => {
        const b = (j / 10) * Math.PI * 2;
        return vertex([
          20 * Math.cos(a) + n[0] * 3.6 * Math.cos(b),
          -80 + 29 * Math.sin(a) + n[1] * 3.6 * Math.cos(b),
          3.6 * Math.sin(b),
        ]);
      }),
    );
  }
  for (let i = 0; i < 64; i++)
    for (let j = 0; j < 10; j++) {
      const ni = (i + 1) % 64,
        nj = (j + 1) % 10;
      faces.push(
        { ids: [loops[i][j], loops[ni][j], loops[ni][nj]], material: "body" },
        { ids: [loops[i][j], loops[ni][nj], loops[i][nj]], material: "body" },
      );
    }
  // Original left lens-rack rail, standing clear of the side of the case.
  const rail = [
    [-53, -28, 13],
    [-59, -16, 13],
    [-63, 12, 13],
    [-63, 117, 13],
    [-60, 150, 13],
    [-56, 154, 13],
  ];
  const tubes = rail.map((p) =>
    Array.from({ length: 10 }, (_, j) => {
      const a = (j / 10) * Math.PI * 2;
      return vertex([p[0] + 2.1 * Math.cos(a), p[1], p[2] + 2.1 * Math.sin(a)]);
    }),
  );
  for (let i = 0; i < tubes.length - 1; i++)
    for (let j = 0; j < 10; j++) {
      const n = (j + 1) % 10;
      faces.push(
        {
          ids: [tubes[i][j], tubes[i + 1][j], tubes[i + 1][n]],
          material: "body",
        },
        { ids: [tubes[i][j], tubes[i + 1][n], tubes[i][n]], material: "body" },
      );
    }
  for (const f of faces) {
    if (["front", "glass"].includes(f.material)) continue;
    const ps = f.ids.map((i) => vertices[i].p),
      n = unit(cross(sub(ps[1], ps[0]), sub(ps[2], ps[0])));
    for (const i of f.ids)
      vertices[i].n = vertices[i].n.map((v, a) => v + n[a]);
  }
  for (const v of vertices) v.n = unit(v.n);
  return { vertices, faces };
}
module.exports = async function renderDeviceTurn(textureFile) {
  const { data: tex, info } = await sharp(textureFile)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const mesh = geometry(),
    frames = [];
  const light = unit([-0.5, -0.4, 0.85]),
    half = unit([-0.5, -0.4, 1.85]);
  function sample(x, y) {
    x = Math.max(0, Math.min(info.width - 1, x + 150));
    y = Math.max(0, Math.min(info.height - 1, y + 150));
    const ix = Math.floor(x),
      iy = Math.floor(y),
      fx = x - ix,
      fy = y - iy;
    const rgb = [0, 0, 0, 0];
    for (let yy = 0; yy < 2; yy++)
      for (let xx = 0; xx < 2; xx++) {
        const off =
          (Math.min(info.height - 1, iy + yy) * info.width +
            Math.min(info.width - 1, ix + xx)) *
          4;
        const w = (xx ? fx : 1 - fx) * (yy ? fy : 1 - fy);
        for (let k = 0; k < 4; k++) rgb[k] += tex[off + k] * w;
      }
    return rgb;
  }
  for (let frame = 0; frame < COUNT; frame++) {
    const progress = frame / (COUNT - 1),
      yaw = ((-67 + 37 * progress) * Math.PI) / 180,
      pitch = ((-4 + 2 * progress) * Math.PI) / 180;
    const rotate = ([x, y, z]) => {
      const xx = x * Math.cos(yaw) + z * Math.sin(yaw),
        zz = -x * Math.sin(yaw) + z * Math.cos(yaw);
      return [
        xx,
        y * Math.cos(pitch) - zz * Math.sin(pitch),
        y * Math.sin(pitch) + zz * Math.cos(pitch),
      ];
    };
    const centre = rotate([0, 0, HALF_DEPTH]),
      project = ([x, y, z]) => {
        const q = rotate([x, y, z]),
          f = 1800 / (1800 - q[2]),
          cf = 1800 / (1800 - centre[2]);
        return [
          (90 + q[0] * f - centre[0] * cf) * AA,
          (130 + q[1] * f - centre[1] * cf) * AA,
          q[2],
          f,
        ];
      };
    const w = FW * AA,
      h = FH * AA,
      rgba = Buffer.alloc(w * h * 4),
      depth = new Float32Array(w * h).fill(-Infinity);
    const pts = mesh.vertices.map((v) => ({
      p: project(v.p),
      n: rotate(v.n),
      world: v.p,
    }));
    for (const face of mesh.faces) {
      const v = face.ids.map((i) => pts[i]),
        [a, b, c] = v.map((v) => v.p);
      const area =
        (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
      if (Math.abs(area) < 1e-7) continue;
      const xmin = Math.max(0, Math.floor(Math.min(a[0], b[0], c[0]))),
        xmax = Math.min(w - 1, Math.ceil(Math.max(a[0], b[0], c[0])));
      const ymin = Math.max(0, Math.floor(Math.min(a[1], b[1], c[1]))),
        ymax = Math.min(h - 1, Math.ceil(Math.max(a[1], b[1], c[1])));
      for (let y = ymin; y <= ymax; y++)
        for (let x = xmin; x <= xmax; x++) {
          const px = x + 0.5,
            py = y + 0.5;
          const b0 =
            ((b[0] - px) * (c[1] - py) - (b[1] - py) * (c[0] - px)) / area;
          const b1 =
            ((c[0] - px) * (a[1] - py) - (c[1] - py) * (a[0] - px)) / area;
          const b2 = 1 - b0 - b1;
          if (b0 < 0 || b1 < 0 || b2 < 0) continue;
          const weights = [b0, b1, b2],
            z = dot(weights, [a[2], b[2], c[2]]),
            idx = y * w + x;
          if (z < depth[idx]) continue;
          const inv = dot(weights, [a[3], b[3], c[3]]);
          const q = weights.map((k, i) => (k * v[i].p[3]) / inv);
          const wx = dot(
              q,
              v.map((v) => v.world[0]),
            ),
            wy = dot(
              q,
              v.map((v) => v.world[1]),
            );
          let rgb;
          if (face.material === "front") {
            if (!inside(wx, wy, 98, 485, 20, 197.5)) continue;
            const colour = sample(wx, wy);
            if (colour[3] < 100) continue;
            if (
              inside(wx, wy, 74, 63, 13, -1.5) &&
              Math.max(...colour.slice(0, 3)) > 45
            )
              continue;
            const shade = 0.88 + 0.12 * Math.cos(yaw);
            rgb = colour.slice(0, 3).map((c) => (c < 22 ? c + 5 : c * shade));
          } else if (face.material === "glass") {
            if (!inside(wx, wy, 74, 63, 13, -1.5)) continue;
            const d = Math.hypot(wx / 45, (wy - 17) / 45),
              value = 90 + 155 * Math.min(1, d);
            rgb = [value, value, value - 6];
          } else {
            let n = unit(
              [0, 1, 2].map((axis) =>
                dot(
                  q,
                  v.map((v) => v.n[axis]),
                ),
              ),
            );
            if (n[2] < 0) n = n.map((v) => -v);
            const d = Math.max(0, dot(n, light)),
              spec = Math.pow(Math.max(0, dot(n, half)), 24);
            const value =
              face.material === "window"
                ? 35 + 65 * d + 55 * spec
                : 7 + 24 * d + 28 * spec;
            rgb = [value, value + 2, value + 3];
          }
          depth[idx] = z;
          for (let k = 0; k < 3; k++)
            rgba[idx * 4 + k] = Math.max(0, Math.min(255, Math.round(rgb[k])));
          rgba[idx * 4 + 3] = 255;
        }
    }
    frames.push(
      await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
        .resize(FW, FH)
        .png()
        .toBuffer(),
    );
  }
  const atlases = [];
  for (let start = 0; start < COUNT; start += 16) {
    const composite = frames.slice(start, start + 16).map((input, i) => ({
      input,
      left: (i % 8) * FW,
      top: Math.floor(i / 8) * FH,
    }));
    atlases.push(
      await sharp({
        create: {
          width: FW * 8,
          height: FH * 2,
          channels: 4,
          background: "#00000000",
        },
      })
        .composite(composite)
        .png()
        .toBuffer(),
    );
  }
  return {
    atlases,
    frameWidth: FW,
    frameHeight: FH,
    count: COUNT,
    anchor: [90, 130],
  };
};
