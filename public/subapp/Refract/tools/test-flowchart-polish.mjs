import fs from 'node:fs';
import assert from 'node:assert/strict';
import { roundedRoute } from './build-weighted-flowchart.mjs';

const directory = new URL('../outputs/flowchart-polish-20260930/', import.meta.url);
const read = name => JSON.parse(fs.readFileSync(new URL(name, directory), 'utf8'));
const before = read('baseline/flowchart-model.json');
const after = read('flowchart-model.json');
assert.deepEqual(after.edges, before.edges, 'Every route, label and destination must be unchanged');
assert.deepEqual(after.nodes.map(({ lines, ...node }) => node), before.nodes.map(({ lines, ...node }) => node), 'Shape geometry and rule ownership must be unchanged');
assert.deepEqual(after.sources, before.sources, 'Prescribing sources must be unchanged');
assert.deepEqual(after.nodes.find(n => n.id === 'VISIBLE_WEIGHTS'), before.nodes.find(n => n.id === 'VISIBLE_WEIGHTS'), 'Numerical reference panel must be unchanged');
assert.equal(after.semanticChecks.passed, true);
assert.equal(roundedRoute([{x: 0, y: 0}, {x: 20, y: 0}, {x: 20, y: 20}]), 'M0 0 L14 0 Q20 0 20 6 L20 20');
assert.equal(roundedRoute([{x: 0, y: 0}, {x: 20, y: 0}]), 'M0 0 L20 0');
const words = nodes => nodes.flatMap(n => n.lines).join(' ').trim().split(/\s+/).length;
const receipt = {
  passed: true,
  unchangedNodes: after.nodes.length,
  unchangedRoutes: after.edges.length,
  unchangedPrescribingSources: after.sources.length,
  unchangedWeightPanel: true,
  semanticExamples: after.semanticChecks.examples.length,
  svgCornerRadius: 6,
  drawioArcSize: 12,
  wordsBefore: words(before.nodes),
  wordsAfter: words(after.nodes),
  changedWordingNodes: after.nodes.filter((n, i) => JSON.stringify(n.lines) !== JSON.stringify(before.nodes[i].lines)).map(n => n.id)
};
fs.writeFileSync(new URL('presentation-regression.json', directory), JSON.stringify(receipt, null, 2));
console.log(JSON.stringify(receipt));
