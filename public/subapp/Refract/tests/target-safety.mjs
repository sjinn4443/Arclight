// Mathematical robustness only; these checks are not clinical validation.
import assert from 'node:assert/strict';
import { processEye } from '../src/prescription-logic.js';
import { computePrescriptionCase } from '../src/prescription-engine.js';
import { computeWeightedPrescription } from '../outputs/weighted-20260930/candidate.mjs';
import { loadWorkbookCases } from '../tools/lib/workbook-analysis.mjs';
import { inputFor } from '../outputs/weighted-20260930/experiment.mjs';

const empty = { sph: NaN, cyl: NaN, axis: NaN };
const eye = sph => ({ sph, cyl: NaN, axis: NaN });
const input = sph => ({ age: 50, currentRightEye: empty, currentLeftEye: empty,
  objectiveRightEye: eye(sph), objectiveLeftEye: eye(sph),
  context: { precise: true, accurate: true, rightQuality: 9, leftQuality: 9 } });
let checks = 0;
for (const sphere of [-0.125, -0.10, 0, 0.10, 0.125]) {
  const direct = processEye(empty, eye(sphere), false, true, true);
  assert.equal(direct.sph, 0, `The softened ${sphere} D target must stop at plano`);
  const output = computePrescriptionCase(input(sphere));
  assert.equal(output.rightEye.sph, 0);
  assert.equal(output.leftEye.sph, 0);
  assert.ok(output.review.some(message => message.includes('No current prescription')));
  checks += 4;
}

// The default target for every quarter-dioptre input is unchanged.
for (let sphere = -20; sphere <= 20; sphere += 0.25) {
  const before = Math.round((sphere - Math.sign(sphere) * 0.25) * 4) / 4;
  const after = processEye(empty, eye(sphere), false, true, true).sph;
  assert.equal(after, before, `Quarter-step target changed at ${sphere} D`);
  checks += 1;
}

// Dense fractional samples cannot emerge with the opposite sign.
for (let i = -249; i <= 249; i += 1) {
  const sphere = i / 1000;
  const output = processEye(empty, eye(sphere), false, true, true).sph;
  assert.ok(output === 0 || Math.sign(output) === Math.sign(sphere));
  checks += 1;
}

for (const c of loadWorkbookCases()) {
  assert.deepEqual(computePrescriptionCase(inputFor(c)), computeWeightedPrescription(inputFor(c)));
  checks += 1;
}
console.log(`Target safety passed: ${checks} checks; fractional bias cannot cross plano and 60-case candidate parity holds.`);
