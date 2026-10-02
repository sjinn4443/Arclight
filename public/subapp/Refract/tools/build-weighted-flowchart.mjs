/**
 * Reproducible, editable weighted-engine flowchart.
 *
 * Shape positions, orthogonal routes and labels are explicit. Geometry checks
 * are useful engineering evidence, not a substitute for the required draw.io
 * close-up visual inspection. The approved main chart is never overwritten.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { deflateRawSync } from 'node:zlib';
import { pathToFileURL } from 'node:url';
import { RULE_LIMITS as L } from '../src/prescribing-rules.js';
import { DEFAULT_PRESCRIPTION_CONFIG as C } from '../src/prescription-config.js';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputArgument = process.argv.find(arg => arg.startsWith('--output-dir='));
const OUTPUT = outputArgument ? path.resolve(APP, outputArgument.slice('--output-dir='.length)) : path.join(APP, 'outputs', 'weighted-20260930');
const DATE = '2026-09-30';
const FONT = 18;
const CORNER_RADIUS = 6;
const COLOURS = {
  decision: ['#fff1c9', '#9c7a29'],
  action: ['#e3f0fc', '#47749c'],
  review: ['#fce3e3', '#b45757'],
  result: ['#def2e4', '#478560'],
  terminal: ['#e8edf2', '#526171'],
  text: ['none', 'none']
};
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const near = (a, b) => Math.abs(a - b) < 0.001;
const samePoint = (a, b) => near(a.x, b.x) && near(a.y, b.y);
const labelWidth = label => Math.max(58, label.text.length * FONT * .65 + 10);
const between = (v, a, b, strict = false) => strict
  ? v > Math.min(a, b) + 0.001 && v < Math.max(a, b) - 0.001
  : v >= Math.min(a, b) - 0.001 && v <= Math.max(a, b) + 0.001;

export class Chart {
  constructor(catalogueIds = []) {
    this.nodes = [];
    this.edges = [];
    this.catalogueIds = catalogueIds;
  }
  node(id, kind, x, y, width, height, lines, rules = []) {
    if (this.nodes.some(n => n.id === id)) throw new Error(`Duplicate node: ${id}`);
    const node = { id, kind, x, y, width, height, lines, rules };
    this.nodes.push(node);
    return node;
  }
  get(id) {
    const n = this.nodes.find(n => n.id === id);
    if (!n) throw new Error(`Missing node: ${id}`);
    return n;
  }
  port(id, port) {
    const n = this.get(id);
    return { x: n.x + n.width * port[0], y: n.y + n.height * port[1] };
  }
  edge(id, source, target, from = [.5, 1], to = [.5, 0], via = [], label = null) {
    const points = [this.port(source, from), ...via.map(([x, y]) => ({ x, y })), this.port(target, to)];
    this.edges.push({ id, source, target, from, to, points, label });
  }
  down(source, target, label = null) {
    const a = this.get(source);
    this.edge(`${source}__${target}`, source, target, [.5, 1], [.5, 0], [], label ? { text: label, x: a.x + a.width / 2 + 32, y: a.y + a.height + 27 } : null);
  }
  right(source, target, label = 'Yes') {
    const a = this.get(source);
    this.edge(`${source}__${target}`, source, target, [1, .5], [0, .5], [], { text: label, x: a.x + a.width + 55, y: a.y + a.height / 2 - 22 });
  }
  left(source, target, label = 'No') {
    const a = this.get(source);
    this.edge(`${source}__${target}`, source, target, [0, .5], [1, .5], [], { text: label, x: a.x - 55, y: a.y + a.height / 2 - 22 });
  }
  bypass(source, target, side, lane, level, targetPort) {
    const a = this.get(source), b = this.get(target);
    this.edge(`${source}__${target}`, source, target, [side === 'left' ? 0 : 1, .5], [targetPort, 0], [
      [lane, a.y + a.height / 2], [lane, level], [b.x + b.width * targetPort, level]
    ]);
  }
}

function segments(edge) {
  return edge.points.slice(1).map((b, i) => ({ a: edge.points[i], b, edge: edge.id, index: i }));
}
function segmentIntersection(a, b) {
  const ah = near(a.a.y, a.b.y), bh = near(b.a.y, b.b.y);
  if (ah === bh) {
    if (!near(ah ? a.a.y : a.a.x, ah ? b.a.y : b.a.x)) return null;
    const [a0, a1] = [ah ? a.a.x : a.a.y, ah ? a.b.x : a.b.y].sort((x, y) => x - y);
    const [b0, b1] = [bh ? b.a.x : b.a.y, bh ? b.b.x : b.b.y].sort((x, y) => x - y);
    const overlap = Math.min(a1, b1) - Math.max(a0, b0);
    if (overlap > .001) return { type: 'overlap', length: overlap };
    if (near(overlap, 0)) return { type: 'touch' };
    return null;
  }
  const h = ah ? a : b, v = ah ? b : a;
  if (between(v.a.x, h.a.x, h.b.x) && between(h.a.y, v.a.y, v.b.y)) {
    return { type: 'crossing', point: { x: v.a.x, y: h.a.y } };
  }
  return null;
}
function segmentHitsBox(s, n, padding = 0) {
  const left = n.x - padding, right = n.x + n.width + padding;
  const top = n.y - padding, bottom = n.y + n.height + padding;
  if (near(s.a.y, s.b.y)) return between(s.a.y, top, bottom, true) && Math.max(Math.min(s.a.x, s.b.x), left) < Math.min(Math.max(s.a.x, s.b.x), right) - .001;
  return between(s.a.x, left, right, true) && Math.max(Math.min(s.a.y, s.b.y), top) < Math.min(Math.max(s.a.y, s.b.y), bottom) - .001;
}
function boxesOverlap(a, b, padding = 0) {
  return a.x < b.x + b.width + padding && a.x + a.width + padding > b.x && a.y < b.y + b.height + padding && a.y + a.height + padding > b.y;
}
export function verify(chart) {
  const issues = [];
  const allSegments = chart.edges.flatMap(segments);
  for (const edge of chart.edges) {
    for (const s of segments(edge)) {
      if (!near(s.a.x, s.b.x) && !near(s.a.y, s.b.y)) issues.push(`Diagonal: ${edge.id} segment ${s.index}`);
      if (samePoint(s.a, s.b)) issues.push(`Zero-length segment: ${edge.id} segment ${s.index}`);
      for (const n of chart.nodes.filter(n => n.id !== edge.source && n.id !== edge.target)) {
        if (segmentHitsBox(s, n, 4)) issues.push(`Route ${edge.id} enters shape ${n.id}`);
      }
    }
  }
  for (let i = 0; i < allSegments.length; i++) {
    for (let j = i + 1; j < allSegments.length; j++) {
      const a = allSegments[i], b = allSegments[j];
      if (a.edge === b.edge && Math.abs(a.index - b.index) <= 1) continue;
      const hit = segmentIntersection(a, b);
      if (hit) issues.push(`${hit.type}: ${a.edge}[${a.index}] / ${b.edge}[${b.index}]`);
    }
  }
  for (let i = 0; i < chart.nodes.length; i++) {
    for (let j = i + 1; j < chart.nodes.length; j++) {
      if (boxesOverlap(chart.nodes[i], chart.nodes[j], 8)) issues.push(`Shapes overlap: ${chart.nodes[i].id} / ${chart.nodes[j].id}`);
    }
  }
  const labels = chart.edges.filter(e => e.label).map(e => ({ id: e.id, x: e.label.x - labelWidth(e.label) / 2, y: e.label.y - 12, width: labelWidth(e.label), height: 24 }));
  for (const label of labels) {
    for (const s of allSegments) if (segmentHitsBox(s, label, 2)) issues.push(`Label ${label.id} touches route ${s.edge}`);
    for (const n of chart.nodes) if (boxesOverlap(label, n, 4)) issues.push(`Label ${label.id} touches shape ${n.id}`);
  }
  const used = [...new Set(chart.nodes.flatMap(n => n.rules))];
  const missing = chart.catalogueIds.filter(id => !used.includes(id));
  const unknown = used.filter(id => !chart.catalogueIds.includes(id));
  if (missing.length) issues.push(`Catalogue rules missing from chart: ${missing.join(', ')}`);
  if (unknown.length) issues.push(`Unknown chart rule IDs: ${unknown.join(', ')}`);
  const terminals = chart.nodes.filter(n => n.kind === 'terminal').map(n => n.id);
  for (const n of chart.nodes.filter(n => n.kind !== 'text' && !terminals.includes(n.id))) {
    if (!chart.edges.some(e => e.target === n.id)) issues.push(`No incoming route: ${n.id}`);
    if (!chart.edges.some(e => e.source === n.id)) issues.push(`No outgoing route: ${n.id}`);
    if (n.kind === 'decision') {
      const branches = chart.edges.filter(e => e.source === n.id);
      if (branches.length !== 2 || branches.some(e => !e.label?.text) || new Set(branches.map(e => e.label?.text)).size !== 2)
        issues.push(`Decision needs two distinct labelled branches: ${n.id}`);
    }
  }
  const reached = new Set(terminals.slice(0, 1));
  let changed = true;
  while (changed) {
    changed = false;
    for (const e of chart.edges) if (reached.has(e.source) && !reached.has(e.target)) { reached.add(e.target); changed = true; }
  }
  for (const n of chart.nodes.filter(n => n.kind !== 'text')) if (!reached.has(n.id)) issues.push(`Unreachable node: ${n.id}`);
  return { date: DATE, nodes: chart.nodes.length, edges: chart.edges.length, catalogueIds: chart.catalogueIds, coveredRuleIds: used,
    orthogonalRoutes: !issues.some(i => i.startsWith('Diagonal:')), noSharedSegmentsOrCrossings: !issues.some(i => /^(overlap|crossing|touch):/.test(i)), shapeOutline: 2.5, connectorWidth: 2, filledArrowheadSize: 14,
    issues, passed: issues.length === 0,
    limitations: ['Geometry and semantic coverage checks do not establish rendered visual quality.', 'Clinical sign-off remains pending.', 'The draw.io browser snapshot must be deliberately reloaded after changes.'] };
}

function bounds(chart) {
  const xs = [...chart.nodes.flatMap(n => [n.x, n.x + n.width]), ...chart.edges.flatMap(e => e.points.map(p => p.x))];
  const ys = [...chart.nodes.flatMap(n => [n.y, n.y + n.height]), ...chart.edges.flatMap(e => e.points.map(p => p.y))];
  return { x: Math.min(...xs) - 45, y: Math.min(...ys) - 45, width: Math.max(...xs) - Math.min(...xs) + 90, height: Math.max(...ys) - Math.min(...ys) + 90 };
}
function nodeHTML(n) {
  return n.lines.map((line, index) => (n.boldLines || [0]).includes(index) ? `<b>${esc(line)}</b>` : esc(line)).join('<br>');
}
export function drawio(chart) {
  const b = bounds(chart);
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<mxfile host="app.diagrams.net" modified="${DATE}T00:00:00.000Z" type="device">\n  <diagram id="refract-weighted-integrated" name="Integrated weighted prescribing">\n    <mxGraphModel dx="${b.width}" dy="${b.height}" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="0" pageScale="1" pageWidth="${b.width}" pageHeight="${b.height}" math="0" shadow="0" background="#ffffff">\n      <root>\n        <mxCell id="0"/>\n        <mxCell id="1" parent="0"/>\n`;
  for (const n of chart.nodes) {
    const [fill, stroke] = n.referencePanel ? ['#f4f8fc', '#47749c'] : COLOURS[n.kind];
    const shape = n.kind === 'decision' ? 'rhombus;' : n.kind === 'terminal' ? 'rounded=1;arcSize=50;' : n.kind === 'text' ? 'text;align=left;' : 'rounded=0;';
    xml += `        <mxCell id="${n.id}" value="${esc(nodeHTML(n))}" ruleIds="${esc(n.rules.join(' '))}" style="${shape}fillColor=${fill};strokeColor=${stroke};strokeWidth=2.5;whiteSpace=wrap;html=1;fontSize=${n.fontSize || FONT};fontFamily=Arial;fontColor=#172635;verticalAlign=middle;spacing=10;" vertex="1" parent="1">\n          <mxGeometry x="${n.x}" y="${n.y}" width="${n.width}" height="${n.height}" as="geometry"/>\n        </mxCell>\n`;
  }
  for (const e of chart.edges) {
    const style = `edgeStyle=none;noEdgeStyle=1;rounded=1;arcSize=${CORNER_RADIUS * 2};html=0;endArrow=block;endFill=1;endSize=14;strokeColor=#526171;strokeWidth=2;exitX=${e.from[0]};exitY=${e.from[1]};exitPerimeter=0;entryX=${e.to[0]};entryY=${e.to[1]};entryPerimeter=0;`;
    xml += `        <mxCell id="${e.id}" value="" branch="${esc(e.label?.text || '')}" style="${style}" edge="1" parent="1" source="${e.source}" target="${e.target}">\n          <mxGeometry relative="1" as="geometry">\n`;
    if (e.points.length > 2) xml += `            <Array as="points">${e.points.slice(1, -1).map(p => `<mxPoint x="${p.x}" y="${p.y}"/>`).join('')}</Array>\n`;
    xml += '          </mxGeometry>\n        </mxCell>\n';
    if (e.label) xml += `        <mxCell id="label-${e.id}" value="${esc(e.label.text)}" labelledEdge="${e.id}" style="text;html=0;align=center;verticalAlign=middle;fontSize=${FONT};fontStyle=1;fontFamily=Arial;fontColor=#172635;fillColor=none;strokeColor=none;" vertex="1" parent="1"><mxGeometry x="${e.label.x - labelWidth(e.label) / 2}" y="${e.label.y - 12}" width="${labelWidth(e.label)}" height="24" as="geometry"/></mxCell>\n`;
  }
  return xml + '      </root>\n    </mxGraphModel>\n  </diagram>\n</mxfile>\n';
}
export function roundedRoute(points) {
  let route = `M${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i - 1], b = points[i], c = points[i + 1];
    const before = Math.hypot(b.x - a.x, b.y - a.y), after = Math.hypot(c.x - b.x, c.y - b.y);
    const radius = Math.min(CORNER_RADIUS, before / 2, after / 2);
    const entry = { x: b.x + (a.x - b.x) * radius / before, y: b.y + (a.y - b.y) * radius / before };
    const leave = { x: b.x + (c.x - b.x) * radius / after, y: b.y + (c.y - b.y) * radius / after };
    route += ` L${entry.x} ${entry.y} Q${b.x} ${b.y} ${leave.x} ${leave.y}`;
  }
  const end = points.at(-1);
  return `${route} L${end.x} ${end.y}`;
}
export function svg(chart) {
  const b = bounds(chart);
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${b.width}" height="${b.height}" viewBox="${b.x} ${b.y} ${b.width} ${b.height}"><defs><marker id="arrow" markerWidth="14" markerHeight="12" refX="13" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L14 6 L0 12 Z" fill="#526171"/></marker></defs><rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" fill="white"/>`;
  for (const e of chart.edges) out += `<path d="${roundedRoute(e.points)}" fill="none" stroke="#526171" stroke-width="2" marker-end="url(#arrow)"/>`;
  for (const n of chart.nodes) {
    const [fill, stroke] = n.referencePanel ? ['#f4f8fc', '#47749c'] : COLOURS[n.kind];
    const attributes = `fill="${fill}" stroke="${stroke}" stroke-width="2.5"`;
    if (n.kind === 'decision') out += `<polygon points="${n.x + n.width / 2},${n.y} ${n.x + n.width},${n.y + n.height / 2} ${n.x + n.width / 2},${n.y + n.height} ${n.x},${n.y + n.height / 2}" ${attributes}/>`;
    else out += `<rect x="${n.x}" y="${n.y}" width="${n.width}" height="${n.height}" rx="${n.kind === 'terminal' ? n.height / 2 : 0}" ${attributes}/>`;
    const lineHeight = n.fontSize ? n.fontSize * 1.3 : 24, start = n.y + n.height / 2 - (n.lines.length - 1) * lineHeight / 2;
    out += `<text fill="#172635" font-family="Arial,sans-serif" font-size="${n.fontSize || FONT}" text-anchor="${n.kind === 'text' ? 'start' : 'middle'}" dominant-baseline="central">${n.lines.map((line, index) => `<tspan x="${n.kind === 'text' ? n.x + 10 : n.x + n.width / 2}" y="${start + index * lineHeight}" font-weight="${(n.boldLines || [0]).includes(index) ? '700' : '400'}">${esc(line)}</tspan>`).join('')}</text>`;
  }
  for (const e of chart.edges.filter(e => e.label)) out += `<text x="${e.label.x}" y="${e.label.y}" text-anchor="middle" dominant-baseline="central" font-family="Arial,sans-serif" font-size="${FONT}" font-weight="700" fill="#172635">${esc(e.label.text)}</text>`;
  return out + '</svg>\n';
}

export function writeChart(chart) {
  const verification = verify(chart);
  verification.sources = chart.sources;
  verification.semanticChecks = chart.semanticChecks;
  fs.mkdirSync(OUTPUT, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT, 'flowchart-verification.json'), JSON.stringify(verification, null, 2) + '\n');
  if (!verification.passed) throw new Error(verification.issues.join('\n'));
  const xml = drawio(chart);
  fs.writeFileSync(path.join(OUTPUT, 'Refract-weighted-integrated-flowchart.drawio'), xml);
  fs.writeFileSync(path.join(OUTPUT, 'Refract-weighted-integrated-flowchart.svg'), svg(chart));
  fs.writeFileSync(path.join(OUTPUT, 'flowchart-model.json'), JSON.stringify(chart, null, 2) + '\n');
  const snapshot = deflateRawSync(Buffer.from(encodeURIComponent(xml))).toString('base64');
  const url = `https://app.diagrams.net/?title=Refract-integrated-flowchart.drawio&ui=min&dark=0&format=0&sidebar=0&windows=0#R${encodeURIComponent(snapshot)}`;
  fs.writeFileSync(path.join(OUTPUT, 'flowchart-url.txt'), url + '\n');
  fs.writeFileSync(path.join(OUTPUT, 'open-weighted-flowchart.html'), `<!doctype html><html lang="en-GB"><meta charset="utf-8"><title>Open Refract weighted flowchart</title><style>body{font:18px/1.5 Arial,sans-serif;max-width:45rem;margin:4rem auto;padding:1rem;color:#172635;background:white}a{color:#245787}</style><h1>Refract weighted flowchart</h1><p>Opening the exact generated editable snapshot in draw.io with a white background, no grid and hidden sidebars.</p><p><a href="${esc(url)}">Open the integrated weighted flowchart</a></p><p>Changes saved locally do not update an already-open snapshot. Regenerate and reopen this launcher after editing the source rules.</p><script>location.replace(${JSON.stringify(url)});</script></html>\n`);
  const b = bounds(chart);
  verification.chartBounds = b;
  verification.detailReviewBands = Array.from({ length: Math.ceil(b.height / 1200) }, (_, index) => ({ top: b.y + index * 1200, bottom: Math.min(b.y + (index + 1) * 1200, b.y + b.height), left: b.x, right: b.x + b.width }));
  fs.writeFileSync(path.join(OUTPUT, 'flowchart-verification.json'), JSON.stringify(verification, null, 2) + '\n');
  if (process.argv.includes('--promote')) fs.copyFileSync(path.join(OUTPUT, 'Refract-weighted-integrated-flowchart.drawio'), path.join(APP, 'Refract-integrated-flowchart.drawio'));
  console.log(JSON.stringify({ output: OUTPUT, nodes: verification.nodes, edges: verification.edges, coveredRules: verification.coveredRuleIds.length, geometryPassed: true }));
}

export function geometrySelfTest() {
  const fresh = () => {
    const chart = new Chart(['TEST']);
    chart.node('START', 'terminal', 100, 0, 200, 60, ['Start']);
    chart.node('RULE', 'action', 100, 140, 200, 60, ['Rule'], ['TEST']);
    chart.node('END', 'terminal', 100, 280, 200, 60, ['End']);
    chart.down('START', 'RULE'); chart.down('RULE', 'END');
    return chart;
  };
  const tests = [
    ['clean graph', chart => {}, result => result.passed],
    ['diagonal route', chart => { chart.edges[0].points[1].x += 25; }, result => result.issues.some(i => i.startsWith('Diagonal:'))],
    ['missing catalogue rule', chart => { chart.catalogueIds.push('MISSING'); }, result => result.issues.some(i => i.startsWith('Catalogue rules missing'))],
    ['unknown catalogue rule', chart => { chart.get('RULE').rules.push('UNKNOWN'); }, result => result.issues.some(i => i.startsWith('Unknown chart rule'))],
    ['overlaid route', chart => { chart.edges.push({ ...chart.edges[0], id: 'DUPLICATE' }); }, result => result.issues.some(i => i.startsWith('overlap:'))],
    ['route through shape', chart => { chart.node('OBSTACLE', 'text', 180, 85, 40, 30, ['Obstacle']); }, result => result.issues.some(i => i.includes('enters shape OBSTACLE'))],
    ['label on route', chart => { chart.edges[0].label = { text: 'No', x: 200, y: 100 }; }, result => result.issues.some(i => i.includes('touches route'))],
    ['unreachable node', chart => { chart.node('ISOLATED', 'action', 600, 200, 200, 60, ['Isolated']); }, result => result.issues.some(i => i.startsWith('Unreachable node:'))]
  ];
  for (const [name, mutate, expected] of tests) {
    const chart = fresh(); mutate(chart);
    const result = verify(chart);
    if (!expected(result)) throw new Error(`Geometry self-test failed: ${name}`);
  }
  return { passed: true, tests: tests.map(([name]) => name) };
}

export function engineSemanticChecks(compute) {
  const rx = (sph, cyl = null, axis = null) => ({ sph, cyl, axis });
  const base = (current, objective, extra = {}) => ({ age: 50, currentRightEye: current, objectiveRightEye: objective,
    context: { precise: true, accurate: true }, ...extra });
  const eyeCases = [
    ['Precise no-anchor reduction and axis rounding', base(rx(null), rx(1.25, -.5, 77)), rx(1, -.25, 75), 'W4_NO_ANCHOR'],
    ['No-anchor clears partial current C; no corroboration', base(rx(null, -.5, 77), rx(1.25, -.5, 77)), rx(1, -.25, 75), 'W4_NO_ANCHOR'],
    ['Precise no-anchor seed precedes low-confidence hold', base(rx(null), rx(1.25, -.5, 77), { context: { precise: true, accurate: false } }), rx(1, -.25, 75), 'W4_NO_ANCHOR'],
    ['No-anchor reduced cylinder below 0.25 is blank', base(rx(null), rx(.25, -.25, 163)), rx(0), 'W4_NO_ANCHOR'],
    ['No-anchor high cylinder uses one-degree axis rounding', base(rx(null), rx(-2, -2, 101)), rx(-1.75, -1.75, 101), 'W4_NO_ANCHOR'],
    ['Non-precise no-anchor measured axis is unchanged', base(rx(null), rx(1.25, -.5, 77), { context: { precise: false, accurate: true } }), rx(1.25, -.5, 77), 'W4_NO_ANCHOR'],
    ['Positive sub-quarter sphere seed stops at zero', base(rx(null), rx(.1)), rx(0), 'W4_NO_ANCHOR'],
    ['Negative sub-quarter sphere seed stops at zero', base(rx(null), rx(-.1)), rx(0), 'W4_NO_ANCHOR'],
    ['Token cylinder drops and sphere deadband still follows', base(rx(1, -.25, 7), rx(1, 0)), rx(1), 'W8_SMALL_SPHERE'],
    ['Younger blank current cylinder permits introduction', base(rx(1), rx(1, -.5, 77), { age: 30 }), rx(1, -.25, 75), 'W11_YOUNGER_CYLINDER'],
    ['Younger explicit-zero cylinder does not trigger blank-C seed', base(rx(1, 0), rx(1, -.5, 77), { age: 30 }), rx(1), 'W8_SMALL_SPHERE'],
    ['Corroborated small non-zero axis gap rounds current axis', base(rx(1, -.5, 7), rx(1, -.5, 11)), rx(1, -.5, 5), 'W7_WEIGHTED_COMPONENTS'],
    ['Corroborated low-cylinder blend holds axis exactly', base(rx(1, -.5, 3), rx(1, -.5, 13)), rx(1, -.5, 3), 'W7_WEIGHTED_COMPONENTS'],
    ['Corroborated 0.75 cylinder reduces before low-axis hold', base(rx(1, -.75, 70), rx(1, -.75, 80)), rx(1, -.5, 70), 'W7_WEIGHTED_COMPONENTS'],
    ['Corroborated midpoint axis rounds after cylinder reduction', base(rx(1, -.75, 70), rx(1, -.75, 79)), rx(1, -.5, 75), 'W7_WEIGHTED_COMPONENTS'],
    ['Corroborated seam branch follows measured axis', base(rx(1, -.5, 2), rx(1, -.5, 170)), rx(1, -.5, 170), 'W7_WEIGHTED_COMPONENTS'],
    ['General low-cylinder axis hold is exact', base(rx(1, -.5, 7), rx(1.5, -.75, 40)), rx(1, -.5, 7), 'W7_WEIGHTED_COMPONENTS'],
    ['High-cylinder final guard preserves current axis exactly', base(rx(1, -2, 101), rx(1, -2, 104)), rx(1, -2, 101), 'W12_HIGH_CYLINDER_AXIS']
  ];
  const passed = [];
  for (const [name, input, expected, rule] of eyeCases) {
    const actual = compute(input);
    if (JSON.stringify(actual.rightEye) !== JSON.stringify(expected) || !actual.trace.right.includes(rule))
      throw new Error(`Flowchart semantic example failed: ${name}; actual ${JSON.stringify(actual.rightEye)}; expected ${JSON.stringify(expected)}`);
    passed.push(name);
  }
  const addCases = [
    ['Entered zero add outranks measured and age-derived add', { currentAdd: 0, objectiveAdd: 2.5 }, 0, 'RETAIN_ENTERED_ADD'],
    ['Measured add follows only when current add absent', { objectiveAdd: 1.75 }, 1.75, 'MEASURED_ADD'],
    ['No entered add uses the established age band', {}, 1.25, 'AGE_ESTIMATE'],
    ['Frailty increment applies only to age-derived add', { context: { health: true } }, 1.5, 'FRAILTY_INCREMENT']
  ];
  for (const [name, extra, expected, rule] of addCases) {
    const actual = compute(base(rx(1), rx(1), extra));
    if (actual.readingAdd !== expected || !actual.trace.add.includes(rule)) throw new Error(`Flowchart semantic example failed: ${name}`);
    passed.push(name);
  }
  return { passed: true, examples: passed, scope: 'Targeted examples support the manual source-to-chart comparison; they are not exhaustive proof or clinical validation.' };
}

export function buildWeightedChart(P, rules, catalogue = rules.map(rule => [rule.id])) {
  const g = new Chart(catalogue.map(rule => rule[0]));
  const centre = 1800;
  let y = 30;
  let previous = null;
  const pending = [];
  const main = (id, kind, lines, rules = [], height = 120, branch = null, width = kind === 'decision' ? 460 : 800) => {
    g.node(id, kind, centre - width / 2, y, width, height, lines, rules);
    if (previous) g.down(previous, id, branch);
    previous = id;
    y += height + 70;
    return id;
  };
  const side = (id, kind, source, lines, direction, rules = [], height = 120, width = 760, branch = direction === 'left' ? 'No' : 'Yes') => {
    const sourceNode = g.get(source);
    g.node(id, kind, direction === 'left' ? 480 : 2350, sourceNode.y + sourceNode.height / 2 - height / 2, width, height, lines, rules);
    g[direction](source, id, branch);
    return id;
  };
  const bypass = (id, target, direction, group) => pending.push({ id, target, direction, group });
  const sideTo = (id, target, port = .7, clearance = 40) => {
    const a = g.get(id), b = g.get(target);
    const level = b.y - clearance;
    g.edge(`${id}__${target}`, id, target, [.5, 1], [port, 0], [[a.x + a.width / 2, level], [b.x + b.width * port, level]]);
  };

  g.node('LEGEND', 'text', 300, 0, 950, 220, [
    'REFRACT — INTEGRATED WEIGHTED RULES',
    '30 September 2026 · editable working chart · default settings',
    'Amber: decision · blue: action · red: review · green: result',
    'S: sphere · C: cylinder · Rx: prescription · q: confidence',
    'All clamps below are 0–1 unless shown otherwise.',
    'Provisional engineering policy; clinical sign-off pending.'
  ]);
  // Reference only: keep every decision and connector in its approved position.
  // Generate the displayed numbers from the same settings used by the engine.
  const fixed = value => Number(value).toFixed(2);
  Object.assign(g.node('VISIBLE_WEIGHTS', 'text', 300, 260, 950, 900, [
    'WEIGHTINGS — CURRENT VALUES',
    'Dimensionless unless marked D. Clamps in this panel limit to 0–1.',
    '',
    'Patient adjustment m: sum the selected effects',
    `Calm / easy-going: +${fixed(P.calmBonus)}`,
    `New to this practice (repeat = 0): −${fixed(P.repeatEnabled ? P.newPatientPenalty : 0)}`,
    `Returning (repeat = 1): +${P.repeatEnabled ? P.returningBonus : 0}`,
    `Poor health / frailty: −${fixed(P.frailtyPenalty)}`,
    `Age 65 or over: −${fixed(P.olderPenalty)}`,
    'Unknown / unselected: 0. New and returning are alternatives.',
    '',
    'Precise / demanding: resistance when selected, otherwise 0',
    `Subtract ${fixed(P.cylinderPreciseResistance)} from component signal t.`,
    `Subtract ${fixed(P.preciseResistance)} from larger-change pull p.`,
    '',
    'Measurement confidence q',
    `Recorded quality Q: q = clamp((Q − ${P.qualityFloor}) / ${P.qualityCeiling - P.qualityFloor})`,
    `No valid Q: accurate → 1; inaccurate → 0; unknown → ${P.unknownQuality}`,
    '',
    'How the weights combine',
    `Component signal: t = ${fixed(P.cylinderSignalScale)}q + m − precise resistance`,
    `Larger-sphere branch: p = clamp(${fixed(P.basePull)} + ${fixed(P.qualityPull)}q + m − precise resistance)`,
    `Then larger-change pull = clamp((p + ${fixed(P.largeChangeBonus)}) × q)`,
    `Larger-sphere weighting applies only at a sphere gap ≥${P.largeChangeStart} D.`,
    '',
    `Reading add: frailty +${fixed(C.add.healthBoost)} D only on the age-derived add.`,
    'Guards and step caps still take priority: follow the arrows below.',
    'Provisional authored settings — not clinically validated.'
  ]), { referencePanel: true, fontSize: 22, boldLines: [0, 3, 11, 15, 19, 25] });
  main('START', 'terminal', ['Patient assessment'], [], 70, null, 500);
  main('INPUT', 'action', ['Enter current and measured Rx for both eyes', 'Age · per-eye quality or accuracy · good current VA', 'Precise · calm · health · new / returning / unknown · current/measured add'], [], 140);
  main('VALID', 'decision', ['Where sphere is recorded:', 'non-zero C has a valid', 'axis 0–180°?'], ['W0_VALIDATE'], 180, null, 570);
  side('INVALID', 'review', 'VALID', ['Complete or correct entries', 'No proposed Rx until axis is valid'], 'right', ['W0_VALIDATE'], 110, 760, 'No');
  const input = g.get('INPUT'), invalid = g.get('INVALID');
  g.edge('INVALID__INPUT', 'INVALID', 'INPUT', [1, .5], [1, .5], [[3400, invalid.y + invalid.height / 2], [3400, input.y + input.height / 2]], { text: 'Correct', x: 3470, y: 285 });
  main('NORMALISE', 'action', ['Convert recorded Rx to minus cylinder', 'Missing sphere is unassessed, not plano', 'Check discrepancy before Simple-mode projection'], ['W0_VALIDATE'], 130, 'Yes');
  main('SIMPLE', 'decision', ['Simple mode', 'explicitly selected?'], ['W2_SIMPLE'], 160);
  side('SPHERICAL', 'action', 'SIMPLE', ['Use spherical equivalent: S + C/2', 'Round to 0.25 D; leave output C and axis blank'], 'right', ['W2_SIMPLE'], 110);
  main('PREPARED', 'action', ['Use the selected representation', 'Advanced: S / C / axis; Simple: spherical equivalent'], ['W2_SIMPLE'], 110, 'No');
  sideTo('SPHERICAL', 'PREPARED', .8);
  main('DISCREPANCY', 'decision', ['Before projection:', 'large discrepancy in either eye?'], ['W1_LARGE_DISCREPANCY'], 180);
  side('PAIR_HOLD', 'review', 'DISCREPANCY', ['Keep both current distance prescriptions', `ΔS ≥${L.discordantSphere} D or ΔC ≥${L.discordantCylinder} D`, `or Δaxis ≥${L.discordantAxis}° with both |C| ≥1 D`, 'Verify measurements; preserve Simple-mode representation'], 'left', ['W1_LARGE_DISCREPANCY'], 155, 820, 'Yes');
  bypass('PAIR_HOLD', 'DISTANCE', 'left', 'distance');
  main('CONFIDENCE', 'action', ['Calculate each eye’s confidence q', `Valid Q (0–10): q = clamp((Q − ${P.qualityFloor}) / ${P.qualityCeiling - P.qualityFloor})`, `Otherwise accuracy true → 1; false → 0; unknown → ${P.unknownQuality}`, 'Apply the same patient context to each eye separately'], ['W7_WEIGHTED_COMPONENTS'], 160, 'No');
  main('OBJECTIVE', 'decision', ['Measured sphere', 'recorded for this eye?'], ['W3_NO_OBJECTIVE'], 160);
  side('RETAIN_RECORDED', 'action', 'OBJECTIVE', ['Keep current Rx for this eye', 'Neither sphere recorded → leave eye blank'], 'left', ['W3_NO_OBJECTIVE'], 110);
  bypass('RETAIN_RECORDED', 'DISTANCE', 'left', 'distance');
  main('CURRENT', 'decision', ['Current sphere recorded', 'for this eye?'], ['W4_NO_ANCHOR'], 160, 'Yes');
  side('NO_ANCHOR', 'review', 'CURRENT', ['No recorded anchor: provisional seed', `Precise S: round(S − sign(S) × min(|S|, ${P.firstSphereBias} D)) to 0.25 D`, `Precise C: reduce |C| by ${P.firstCylinderReduction} D, stop at zero, round 0.25 D`, `Missing or reduced |C| <${C.cylinder.dropMagnitude} D → leave C/axis blank`, `Otherwise round measured axis: ${C.axis.lowCylRounding}° below ${C.axis.highCylCutoff} D, 1° otherwise`, 'Not precise: measured S/C rounded to 0.25 D; measured axis unchanged', 'Current sphere absent clears current C/axis; no corroborated-C exception', 'Missing recorded Rx does not prove a first-ever pair'], 'right', ['W4_NO_ANCHOR'], 225, 1120, 'No');
  bypass('NO_ANCHOR', 'DISTANCE', 'right', 'anchor');
  main('GOOD_VA', 'decision', ['Good current VA', 'explicitly selected?'], ['W5_GOOD_VA'], 160, 'Yes');
  side('VA_HOLD', 'action', 'GOOD_VA', ['Keep current Rx for this eye', 'Good VA must be explicitly selected'], 'left', ['W5_GOOD_VA'], 110, 820, 'Yes');
  bypass('VA_HOLD', 'DISTANCE', 'left', 'distance');
  main('LOW_Q', 'decision', ['Confidence q = 0?', `(quality Q ≤${P.qualityFloor} or accuracy false)`], ['W6_LOW_CONFIDENCE'], 180, 'No');
  side('Q_HOLD', 'review', 'LOW_Q', ['Keep current Rx for this eye', 'Low confidence: no measured change'], 'left', ['W6_LOW_CONFIDENCE'], 110, 820, 'Yes');
  bypass('Q_HOLD', 'DISTANCE', 'left', 'distance');
  main('WEIGHTS', 'action', ['Set adaptation modifier m and component signal t', `m = calm +${P.calmBonus}; frailty −${P.frailtyPenalty}; age ≥65 −${P.olderPenalty}`, `New patient −${P.newPatientPenalty}; returning +${P.returningBonus}; unknown 0`, `t = ${P.cylinderSignalScale}q + m − (${P.cylinderPreciseResistance} if precise; otherwise 0)`, `Sphere pull = clamp((t + ${C.sphere.pullOffset}) / ${C.sphere.pullScale})`, `Cylinder pull = clamp((t + ${C.cylinder.pullOffset}) / ${C.cylinder.pullScale}); axis pull = clamp(t / ${C.axis.pullScale})`], ['W7_WEIGHTED_COMPONENTS'], 210, 'No', 1100);
  main('TARGETS', 'action', ['Form component targets and bounded 0.25 D movements', `Sphere target = round(S − sign(S) × min(|S|, ${C.sphere.objectiveBias} D)); S is measured`, `C target: same C if corroborated; otherwise reduce |C| by ${C.cylinder.objectiveReduction} D`, `Round targets to 0.25 D; target axis ${C.axis.lowCylRounding}° below ${C.axis.highCylCutoff} D C, 1° otherwise`, 'Movement = round(|target − current| × pull); never overshoot', `Minimum 0.25 D when gap ≥0.25 D and pull ≥${C.sphere.quarterPull} (S) / ${P.cylinderQuarterPull} (C)`, `Base S step cap: precise 0.25 D, otherwise 0.50 D; C cap ${C.cylinder.maxStep} D`], ['W7_WEIGHTED_COMPONENTS'], 225, null, 1200);
  main('CURRENT_CYL', 'decision', ['Current cylinder entered', '(including explicit zero)?'], ['W7_WEIGHTED_COMPONENTS'], 160);
  side('INTRODUCE_BASE_CYL', 'action', 'CURRENT_CYL', ['Move from 0 towards the cylinder target', `Missing target or output |C| <${C.cylinder.introduceMagnitude} D → C/axis blank`, 'Otherwise use the target axis'], 'right', ['W7_WEIGHTED_COMPONENTS'], 135, 960, 'No');
  bypass('INTRODUCE_BASE_CYL', 'COMPONENT_READY', 'right', 'components');
  main('TOKEN_CYL', 'decision', ['Measured C explicitly 0', `and current |C| ≤${C.cylinder.tokenCurrentDrop} D?`], ['W7_WEIGHTED_COMPONENTS'], 180, 'Yes');
  side('DROP_TOKEN', 'action', 'TOKEN_CYL', ['Remove the token current cylinder and axis', `Sphere pull is at least ${C.sphere.quarterPull} for this component step`, 'Later sphere overrides still apply'], 'right', ['W7_WEIGHTED_COMPONENTS'], 135, 880);
  bypass('DROP_TOKEN', 'COMPONENT_READY', 'right', 'components');
  main('CYLINDER_MOVE', 'action', ['Apply bounded cylinder step', 'Use target, pull and cap above', 'Missing target → keep current C, rounded to 0.25 D', 'Check cylinder/axis exceptions below'], ['W7_WEIGHTED_COMPONENTS'], 150, 'No', 1020);
  main('CORROBORATED_KEEP', 'decision', ['Precise, same current/measured C,', `ΔS ≤0.25 D and Δaxis <${C.cylinder.corroboratedKeepGap}°?`], ['W7_WEIGHTED_COMPONENTS'], 200, null, 620);
  side('KEEP_CORROBORATED', 'action', 'CORROBORATED_KEEP', [`Keep current C; below ${C.cylinder.dropMagnitude} D leave C/axis blank`, 'Otherwise keep identical axis exactly or round current axis', `Axis rounding: 5° below ${C.axis.highCylCutoff} D cylinder, 1° otherwise`], 'right', ['W7_WEIGHTED_COMPONENTS'], 145, 900);
  bypass('KEEP_CORROBORATED', 'COMPONENT_READY', 'right', 'components');
  main('CORROBORATED_BLEND', 'decision', ['Precise, same current/measured C,', `ΔS ≤0.25 D and Δaxis ${C.cylinder.corroboratedKeepGap}–${C.cylinder.corroboratedBlendGap}°?`], ['W7_WEIGHTED_COMPONENTS'], 200, 'No', 620);
  side('BLEND_CORROBORATED', 'action', 'CORROBORATED_BLEND', ['Keep C except 0.75–<1 D: reduce by 0.25 D', `Output |C| <${C.cylinder.dropMagnitude} D → leave C/axis blank`, 'Off seam, output |C| ≤0.50 D and gap ≥10°: keep current axis exactly', 'Otherwise midpoint axis; across 0/180 seam use measured axis', 'Round only that changed axis: 5° below 1.75 D, 1° otherwise'], 'right', ['W7_WEIGHTED_COMPONENTS'], 185, 1180);
  bypass('BLEND_CORROBORATED', 'COMPONENT_READY', 'right', 'components');
  main('SMALL_OUTPUT_C', 'decision', [`Output |C| <${C.cylinder.dropMagnitude} D?`], ['W7_WEIGHTED_COMPONENTS'], 160, 'No');
  side('DROP_SMALL', 'action', 'SMALL_OUTPUT_C', ['Leave output cylinder and axis blank'], 'right', ['W7_WEIGHTED_COMPONENTS'], 95, 880);
  bypass('DROP_SMALL', 'COMPONENT_READY', 'right', 'components');
  main('MISSING_AXIS', 'decision', ['Current or target', 'axis unavailable?'], ['W7_WEIGHTED_COMPONENTS'], 160, 'No');
  side('AVAILABLE_AXIS', 'action', 'MISSING_AXIS', ['Use the available axis', 'No current axis → target; no target axis → current'], 'right', ['W7_WEIGHTED_COMPONENTS'], 110, 880);
  bypass('AVAILABLE_AXIS', 'COMPONENT_READY', 'right', 'components');
  main('CYL_PROGRESS', 'action', ['Calculate cylinder progress', 'Progress = |output C − current C| / |target C − current C|', 'Clamp to 0–1; no target change → 0', 'Use the shortest axis route', '“Across seam”: one axis 0–15°, the other 165–180°'], ['W7_WEIGHTED_COMPONENTS'], 175, 'No', 1120);
  main('LOW_CYL_AXIS', 'decision', ['Off seam, |output C| ≤0.50 D,', `axis gap ≥${C.cylinder.lowCylHoldGap}° and progress <${C.axis.objectiveFollowRatio}?`], ['W7_WEIGHTED_COMPONENTS'], 200, null, 620);
  side('HOLD_LOW_AXIS', 'action', 'LOW_CYL_AXIS', ['Keep the current axis'], 'right', ['W7_WEIGHTED_COMPONENTS'], 95, 880);
  bypass('HOLD_LOW_AXIS', 'COMPONENT_READY', 'right', 'components');
  main('FOLLOW_AXIS', 'decision', [`Cylinder progress ≥${C.axis.objectiveFollowRatio}`, `or not precise with axis gap ≤${C.axis.nonPreciseFollowGap}°?`], ['W7_WEIGHTED_COMPONENTS'], 190, 'No', 620);
  side('FOLLOW_AXIS_ACTION', 'action', 'FOLLOW_AXIS', ['Move axis with max(axis pull, cylinder progress)', 'Across the seam use measured axis directly', 'Round output axis: 5° below 1.75 D, 1° otherwise'], 'right', ['W7_WEIGHTED_COMPONENTS'], 145, 940);
  bypass('FOLLOW_AXIS_ACTION', 'COMPONENT_READY', 'right', 'components');
  main('COMPROMISE_AXIS', 'decision', [`Axis pull ≥${C.axis.compromisePull}`, `and axis gap ≤${C.cylinder.corroboratedBlendGap}°?`], ['W7_WEIGHTED_COMPONENTS'], 170, 'No');
  side('MID_AXIS', 'action', 'COMPROMISE_AXIS', ['Use midpoint current–target axis', 'Across the seam use measured axis directly', 'Round output axis: 5° below 1.75 D, 1° otherwise'], 'right', ['W7_WEIGHTED_COMPONENTS'], 135, 940);
  bypass('MID_AXIS', 'COMPONENT_READY', 'right', 'components');
  main('KEEP_AXIS_DEFAULT', 'action', ['Otherwise keep the current axis'], ['W7_WEIGHTED_COMPONENTS'], 90, 'No');
  y += 510;
  main('COMPONENT_READY', 'action', ['Component proposal ready', 'Apply sphere overrides below in order', 'Cylinder/axis branches rejoin here'], ['W7_WEIGHTED_COMPONENTS'], 135, null, 2500);
  main('SMALL_SPHERE', 'decision', [`Measured–current sphere gap`, `≤${P.smallChangeDeadband} D?`], ['W8_SMALL_SPHERE'], 170);
  side('SPHERE_HOLD', 'action', 'SMALL_SPHERE', ['Keep current sphere exactly'], 'left', ['W8_SMALL_SPHERE'], 95, 820, 'Yes');
  bypass('SPHERE_HOLD', 'SPHERE_READY', 'left', 'sphere');
  main('LARGE_SPHERE', 'decision', ['Measured–current sphere gap', `≥${P.largeChangeStart} D?`], ['W9_LARGE_SPHERE'], 170, 'No');
  side('LARGE_SPHERE_STEP', 'action', 'LARGE_SPHERE', ['Apply a proportional sphere step with a progressive cap', `p = clamp(${P.basePull} + ${P.qualityPull}q − (${P.preciseResistance} if precise; otherwise 0) + m)`, `Large-change pull = clamp((p + ${P.largeChangeBonus}) × q)`, `Cap = min(${P.maxSphereStep} D, ordinary step + max(0, gap − ${P.largeChangeStart} D) × ${P.largeStepRamp})`, 'Ordinary step: 0.50 D if age <40 or not precise; otherwise 0.25 D', `Either |S| ≥${L.highSphere} D → cap ${P.highSphereStep} D; never overshoot measured S`, 'Step = min(gap, cap, rounded gap × pull); round final S to 0.25 D'], 'right', ['W9_LARGE_SPHERE'], 215, 1120);
  bypass('LARGE_SPHERE_STEP', 'SPHERE_READY', 'right', 'sphere');
  main('YOUNGER_SPHERE', 'decision', [`Age <${L.youngerAge} and`, `sphere gap ≥${L.meaningfulSphereGap} D?`], ['W10_YOUNGER_SPHERE'], 170, 'No');
  side('YOUNGER_SPHERE_STEP', 'action', 'YOUNGER_SPHERE', ['Use the bounded younger half-change seed', `Step = round(gap × ${L.youngerPull} × q × clamp(1 + m, 0, 1.2))`, `Cap ${L.ordinarySphereStep} D; either |S| ≥${L.highSphere} D → ${P.highSphereStep} D`, 'Move towards measured S and round to 0.25 D'], 'right', ['W10_YOUNGER_SPHERE'], 165, 1040);
  bypass('YOUNGER_SPHERE_STEP', 'SPHERE_READY', 'right', 'sphere');
  y += 130;
  main('SPHERE_READY', 'action', ['Sphere proposal ready', 'No override → retain component step'], ['W8_SMALL_SPHERE', 'W9_LARGE_SPHERE', 'W10_YOUNGER_SPHERE'], 110, 'No', 1600);
  main('YOUNGER_CYL', 'decision', [`Age <${L.youngerAge}, current C blank`, '(not an explicit zero),', 'measured |C| ≥0.50 D', 'and still no output cylinder?'], ['W11_YOUNGER_CYLINDER'], 250, null, 700);
  side('YOUNGER_CYL_STEP', 'action', 'YOUNGER_CYL', ['Trial −0.25 D cylinder', 'Use measured axis rounded to 5°'], 'right', ['W11_YOUNGER_CYLINDER'], 110, 880);
  main('CYL_READY', 'action', ['Cylinder proposal ready'], ['W11_YOUNGER_CYLINDER'], 90, 'No');
  sideTo('YOUNGER_CYL_STEP', 'CYL_READY', .8);
  main('HIGH_CYL', 'decision', [`Current |C| ≥${L.highCylinder} D,`, `C unchanged and axis gap ≤${L.smallAxisGap}°?`], ['W12_HIGH_CYLINDER_AXIS'], 190, null, 620);
  side('HIGH_CYL_HOLD', 'action', 'HIGH_CYL', ['Keep current axis exactly'], 'right', ['W12_HIGH_CYLINDER_AXIS'], 95, 940);
  main('EYE_READY', 'action', ['Distance proposal for this eye', 'Run this pathway independently for RE and LE'], ['W12_HIGH_CYLINDER_AXIS'], 110, 'No');
  sideTo('HIGH_CYL_HOLD', 'EYE_READY', .8);
  y += 260;
  main('DISTANCE', 'action', ['Combine RE and LE distance Rx', 'Retain pair-hold, missing-anchor and confidence flags'], [], 140, null, 2400);
  main('CURRENT_ADD', 'decision', ['Current reading add', 'entered, including zero?'], ['WA_ADD'], 170);
  side('KEEP_ADD', 'action', 'CURRENT_ADD', ['Keep entered current add', 'No age-based increase to an explicit add'], 'left', ['WA_ADD', 'RETAIN_ENTERED_ADD'], 110, 820, 'Yes');
  bypass('KEEP_ADD', 'RESULT', 'left', 'add');
  main('MEASURED_ADD', 'decision', ['Measured reading add', 'entered?'], ['WA_ADD'], 170, 'No');
  side('USE_ADD', 'action', 'MEASURED_ADD', ['Use the measured reading add'], 'right', ['WA_ADD', 'MEASURED_ADD'], 95, 880);
  bypass('USE_ADD', 'RESULT', 'right', 'add');
  main('ADD_AGE', 'decision', [`Age known and ≥${C.add.ageGate}?`], ['WA_ADD'], 160, 'No');
  side('BLANK_ADD', 'action', 'ADD_AGE', ['Leave reading add blank'], 'left', ['WA_ADD', 'AGE_ESTIMATE'], 95, 820);
  bypass('BLANK_ADD', 'RESULT', 'left', 'add');
  const bands = C.add.bands.filter(b => b.max >= C.add.ageGate).map(b => `${Math.max(b.min, C.add.ageGate)}${Number.isFinite(b.max) ? `–${b.max}` : '+'}: ${b.add.toFixed(2)}`);
  main('ESTIMATE_ADD', 'action', ['Age-based reading add (D)', bands.slice(0, 4).join(' · '), bands.slice(4).join(' · '), 'Completed years; review working distance and near task'], ['WA_ADD', 'AGE_ESTIMATE'], 150, 'Yes', 1300);
  main('FRAILTY_ADD', 'decision', ['Frailty modifier', 'selected?'], ['WA_ADD'], 160);
  side('INCREMENT_ADD', 'action', 'FRAILTY_ADD', [`Age-derived add: +${C.add.healthBoost} D`, 'No increment to an entered or measured add'], 'right', ['WA_ADD', 'FRAILTY_INCREMENT'], 110, 880);
  y += 130;
  main('RESULT', 'result', ['Proposed Rx: RE + LE and reading add', 'Retain rule IDs, confidence basis and review flags', 'Review cues: age <18, either q <1 or missing recorded anchor'], [], 160, 'No', 2200);
  sideTo('INCREMENT_ADD', 'RESULT', .7, 180);
  main('END', 'terminal', ['Prescriber reviews the whole Rx', 'Engineering agreement is not clinical approval'], [], 95, null, 960);

  const groups = new Map();
  for (const p of pending) {
    const key = `${p.group}:${p.direction}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  }
  for (const [key, entries] of groups) {
    entries.sort((a, b) => g.get(a.id).y - g.get(b.id).y);
    entries.forEach((p, i) => {
      const target = g.get(p.target), left = p.direction === 'left';
      const base = p.group === 'components' ? 4580 : p.group === 'anchor' ? 4840 : p.group === 'sphere' ? (left ? 380 : 3580) : p.group === 'add' ? (left ? 140 : 3580) : 40;
      const lane = base + (left ? i * 90 : -i * 90);
      const port = left ? .08 + i * .085 : p.group === 'components' ? .94 - i * .044 : .91 - i * .12;
      g.bypass(p.id, p.target, p.direction, lane, target.y - 65 - i * 50, port);
    });
  }
  return g;
}

const direct = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (direct) {
  if (process.argv.includes('--self-test')) console.log(JSON.stringify(geometrySelfTest()));
  else {
    const source = fs.existsSync(path.join(APP, 'src', 'weighted-prescribing.js')) ? path.join(APP, 'src', 'weighted-prescribing.js') : path.join(OUTPUT, 'candidate.mjs');
    const { PARAMETERS, WEIGHTED_RULES, RULE_CATALOGUE, computeWeightedPrescription } = await import(pathToFileURL(source).href);
    const chart = buildWeightedChart(PARAMETERS, WEIGHTED_RULES, RULE_CATALOGUE);
    chart.semanticChecks = engineSemanticChecks(computeWeightedPrescription);
    chart.sources = [source, path.join(APP, 'src', 'prescribing-rules.js'), path.join(APP, 'src', 'prescription-config.js'), path.join(APP, 'src', 'prescription-logic.js')].map(file => ({ file: path.relative(APP, file), sha256: createHash('sha256').update(fs.readFileSync(file)).digest('hex') }));
    writeChart(chart);
  }
}
