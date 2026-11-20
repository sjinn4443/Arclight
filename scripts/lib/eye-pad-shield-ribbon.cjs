const path = require("node:path");
const sharp = require("sharp");

// Project tape over the raised gauze/cone and back onto the cheek. Source paper
// pixels supply the material; this geometry changes only its pose and cut edges.
function surfacePoints(start, end, surface = null) {
  return Array.from({ length: 65 }, (_, i) => {
    const t = i / 64;
    let x = start[0] + (end[0] - start[0]) * t;
    let y = start[1] + (end[1] - start[1]) * t;
    let z = 0;
    if (surface) {
      const r2 =
        ((x - surface.x) / surface.rx) ** 2 +
        ((y - surface.y) / surface.ry) ** 2;
      z = Math.max(0, 1 - r2) ** (surface.cone ? 0.8 : 1.25);
      x -= surface.depth * z;
      y -= surface.depth * z * 0.23;
      if (surface.face) x += 7 * Math.sin(t * Math.PI);
    }
    return [x, y, z];
  });
}
function sample(points, t) {
  const f = Math.max(0, Math.min(1, t)) * (points.length - 1);
  const i = Math.min(points.length - 2, Math.floor(f));
  const u = f - i;
  return points[i].map((n, j) => n + (points[i + 1][j] - n) * u);
}
function ribbonOutline(
  points,
  width,
  from = 0,
  to = 1,
  teeth = 6,
  squareStart = false,
) {
  const a = Math.max(0, Math.min(0.99999, from));
  const b = Math.max(a + 0.00001, Math.min(1, to));
  const left = [],
    right = [],
    directions = [];
  for (let i = 0; i <= 64; i++) {
    const t = a + ((b - a) * i) / 64;
    const p = sample(points, t),
      before = sample(points, t - 0.001),
      after = sample(points, t + 0.001);
    const dx = after[0] - before[0],
      dy = after[1] - before[1],
      length = Math.hypot(dx, dy) || 1;
    const ux = dx / length,
      uy = dy / length;
    const half = (width / 2) * (0.96 + 0.1 * (p[2] || 0));
    const acrossX = p[3] ?? -uy,
      acrossY = p[4] ?? ux;
    left.push([p[0] + acrossX * half, p[1] + acrossY * half]);
    right.push([p[0] - acrossX * half, p[1] - acrossY * half]);
    directions.push([ux, uy]);
  }
  const cap = (p, q, dir, sign) =>
    Array.from({ length: teeth * 2 - 1 }, (_, i) => {
      const t = (i + 1) / (teeth * 2),
        bite = (i % 2 === 0 ? width * 0.16 : 0) * sign;
      return [
        p[0] + (q[0] - p[0]) * t + dir[0] * bite,
        p[1] + (q[1] - p[1]) * t + dir[1] * bite,
      ];
    });
  return [
    ...left,
    ...cap(left.at(-1), right.at(-1), directions.at(-1), -1),
    ...right.reverse(),
    ...cap(right.at(-1), left[0], directions[0], squareStart ? 0 : 1),
  ];
}
const svgPath = (points, close = true) =>
  points
    .map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(3)} ${p[1].toFixed(3)}`)
    .join(" ") + (close ? "Z" : "");

async function buildRibbon({
  id,
  points,
  width,
  paper,
  outDir,
  squareStart = false,
  solidFill = null,
  shadeBySlope = false,
}) {
  const outline = ribbonOutline(points, width, 0, 1, 6, squareStart);
  const left = Math.floor(Math.min(...outline.map((p) => p[0]))) - 12;
  const top = Math.floor(Math.min(...outline.map((p) => p[1]))) - 12;
  const w = Math.ceil(Math.max(...outline.map((p) => p[0]))) - left + 18;
  const h = Math.ceil(Math.max(...outline.map((p) => p[1]))) - top + 18;
  const start = points[0],
    end = points.at(-1),
    d = svgPath(outline);
  // Positive relief slopes face the upper light. The underside darkens as the
  // paper rounds the crown, then returns to the skin's flatter lighting.
  const slopeStops = shadeBySlope
    ? Array.from({ length: 17 }, (_, i) => {
        const t = i / 16,
          before = sample(points, t - 0.012),
          after = sample(points, t + 0.012);
        const slope =
          (100 * (after[2] - before[2])) / Math.max(1, after[1] - before[1]);
        const opacity = Math.min(0.34, 0.06 + Math.abs(slope) * 0.24);
        return `<stop offset="${t}" stop-color="${slope < 0 ? "#625a50" : "#ffffff"}" stop-opacity="${opacity}"/>`;
      }).join("")
    : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${left} ${top} ${w} ${h}">
    <defs>
      <pattern id="paper" width="30" height="30" patternUnits="userSpaceOnUse"><image width="30" height="30" href="data:image/png;base64,${paper.toString("base64")}"/></pattern>
      <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.4"/></filter>
      <linearGradient id="contour" x1="${start[0]}" y1="${start[1]}" x2="${end[0]}" y2="${end[1]}" gradientUnits="userSpaceOnUse">
        ${
          slopeStops ||
          `<stop stop-color="#fff" stop-opacity=".16"/>
        <stop offset=".27" stop-color="#6e695e" stop-opacity=".09"/>
        <stop offset=".44" stop-color="#fff" stop-opacity=".32"/>
        <stop offset=".62" stop-color="#fff" stop-opacity=".12"/>
        <stop offset=".76" stop-color="#635d51" stop-opacity=".13"/>
        <stop offset="1" stop-color="#fff" stop-opacity=".09"/>`
        }
      </linearGradient>
    </defs>
    <path d="${d}" transform="translate(3 5)" fill="#392f24" opacity=".27" filter="url(#soft)"/>
    <path d="${d}" fill="${solidFill || "url(#paper)"}"/>
    <path d="${d}" fill="${solidFill ? "none" : "url(#contour)"}" stroke="#b8b3a4" stroke-width=".6" stroke-opacity=".42"/>
  </svg>`;
  await sharp(Buffer.from(svg))
    .webp({ lossless: true })
    .toFile(path.join(outDir, `${id}.webp`));
  return {
    file: `${id}.webp`,
    left,
    top,
    width: w,
    height: h,
    points,
    tapeWidth: width,
  };
}

module.exports = { surfacePoints, ribbonOutline, buildRibbon };
