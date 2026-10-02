import fs from 'node:fs';
import crypto from 'node:crypto';
import { loadWorkbookCases, valuesMatch } from './lib/workbook-analysis.mjs';
import { computePrescriptionCase } from '../src/prescription-engine.js';

export const cases = loadWorkbookCases();
export const eyeMatch = (a, b) => ['sph', 'cyl', 'axis'].every(k => valuesMatch(a[k], b[k]));
export function inputFor(c) {
  return { ...c, objectiveAdd: NaN, context: { precise: c.precise === 1,
    vaGood: false, accurate: false, rightAccurate: c.qualityRight >= 8,
    leftAccurate: c.qualityLeft >= 8, health: c.health === 1,
    rightQuality: c.qualityRight, leftQuality: c.qualityLeft,
    calm: c.calm === 1 ? true : c.calm === 0 ? false : null,
    repeat: c.repeat === 1 ? true : c.repeat === 0 ? false : null } };
}
export function evaluate(engine) {
  return cases.map(c => {
    const output = engine(inputFor(c));
    const right = eyeMatch(output.rightEye, c.expectedRightEye);
    const left = eyeMatch(output.leftEye, c.expectedLeftEye);
    const add = valuesMatch(output.readingAdd, c.expectedAdd);
    return { caseNumber: c.caseNumber, output, right, left, add, full: right && left && add };
  });
}
export function totals(rows) {
  return Object.fromEntries(['full', 'right', 'left', 'add'].map(k => [k, rows.filter(r => r[k]).length]));
}
if (process.argv.includes('--baseline')) {
  const target = new URL('./prescribing-baseline-20260929.json', import.meta.url);
  if (fs.existsSync(target)) throw new Error('Baseline already exists: will not overwrite');
  fs.writeFileSync(target, JSON.stringify({
    date: '2026-09-29', mapping: 'Fixed sheet inputs; quality >= 8; VA-good false; no optimised toggles',
    csvSha256: crypto.createHash('sha256').update(fs.readFileSync(new URL('./allan-rx-full.csv', import.meta.url))).digest('hex'),
    rows: evaluate(computePrescriptionCase)
  }, null, 2));
}
if (process.argv.includes('--report')) {
  const rows = evaluate(computePrescriptionCase);
  console.log(totals(rows));
  for (const row of rows.filter(r => !r.full)) {
    const c = cases.find(c => c.caseNumber === row.caseNumber);
    console.log(JSON.stringify({ n: row.caseNumber, flags: [row.right,row.left,row.add], actual: row.output,
      expected: [c.expectedRightEye,c.expectedLeftEye,c.expectedAdd] }));
  }
}
