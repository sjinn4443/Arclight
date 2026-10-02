// Development agreement and engineering invariants, not clinical validation.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { computePrescriptionCase as run } from '../src/prescription-engine.js';
import { computeRulePrescription as baseline } from '../outputs/weighted-20260930/baseline/prescribing-rules.js';
import { confidenceFor, RULE_CATALOGUE } from '../src/weighted-prescribing.js';
import { loadWorkbookCases, valuesMatch } from '../tools/lib/workbook-analysis.mjs';
import { transposePrescription } from '../src/prescription-logic.js';

const cases = loadWorkbookCases(), finite = Number.isFinite;
const boolean = n => n === 1 ? true : n === 0 ? false : null;
const empty = { sph: NaN, cyl: NaN, axis: NaN };
const makeInput = c => ({ ...c, objectiveAdd: NaN, context: {
  precise: c.precise === 1, health: c.health === 1, vaGood: false, accurate: false,
  calm: boolean(c.calm), repeat: boolean(c.repeat),
  rightQuality: finite(c.qualityRight) ? c.qualityRight : null,
  leftQuality: finite(c.qualityLeft) ? c.qualityLeft : null,
  rightAccurate: c.qualityRight >= 8, leftAccurate: c.qualityLeft >= 8
} });
// Independent power-matrix implementation: max absolute eigenvalue of the
// difference is max meridional power error and respects cylinder transposition.
function matrix(rx) {
  assert.ok(finite(rx.sph));
  const c = finite(rx.cyl) ? rx.cyl : 0, a = (rx.axis || 0) * Math.PI / 180;
  return [rx.sph + c*Math.sin(a)**2, rx.sph + c*Math.cos(a)**2, -c*Math.sin(a)*Math.cos(a)];
}
function distance(a, b) {
  const x = matrix(a), y = matrix(b), d = x.map((n,i) => n-y[i]);
  return Math.abs((d[0]+d[1])/2) + Math.hypot((d[0]-d[1])/2, d[2]);
}
const eyeMatch = (a,b) => ['sph','cyl','axis'].every(k => valuesMatch(a[k],b[k]));
const summarise = rows => ({
  n: rows.length,
  meanWorstEyeD: rows.reduce((n,r) => n+r.error,0)/rows.length,
  exactDistance: rows.filter(r=>r.error<1e-8).length,
  within025: rows.filter(r=>r.error<=0.25000001).length,
  within050: rows.filter(r=>r.error<=0.50000001).length,
  maximum: Math.max(...rows.map(r=>r.error)),
  literalFull: rows.filter(r=>r.full).length
});
const before = [], after = [], changes = [];
const catalogue = new Set(RULE_CATALOGUE.map(r=>r[0]));
let combinations = 0;
for (const c of cases) {
  const input = makeInput(c), original = structuredClone(input), a = run(input);
  assert.deepEqual(run(input), a, `deterministic ${c.caseNumber}`);
  assert.deepEqual(input, original, `immutable ${c.caseNumber}`);
  const old = baseline(input);
  for (const [output,rows] of [[old,before],[a,after]]) {
    const error = Math.max(distance(output.rightEye,c.expectedRightEye),distance(output.leftEye,c.expectedLeftEye));
    rows.push({caseNumber:c.caseNumber,error,full:eyeMatch(output.rightEye,c.expectedRightEye)&&eyeMatch(output.leftEye,c.expectedLeftEye)&&valuesMatch(output.readingAdd,c.expectedAdd)});
  }
  if (Math.abs(before.at(-1).error-after.at(-1).error)>1e-8) changes.push({caseNumber:c.caseNumber,before:before.at(-1).error,after:after.at(-1).error});
  for (const ids of Object.values(a.trace)) for (const id of ids) assert.ok(catalogue.has(id), `unknown trace ${id}`);
  const swap = run({...input,currentRightEye:input.currentLeftEye,currentLeftEye:input.currentRightEye,
    objectiveRightEye:input.objectiveLeftEye,objectiveLeftEye:input.objectiveRightEye,
    context:{...input.context,rightQuality:input.context.leftQuality,leftQuality:input.context.rightQuality,
      rightAccurate:input.context.leftAccurate,leftAccurate:input.context.rightAccurate}});
  assert.deepEqual(a.rightEye,swap.leftEye); assert.deepEqual(a.leftEye,swap.rightEye);
  const transpose = e => finite(e.cyl)&&e.cyl!==0&&finite(e.axis)?transposePrescription(e):e;
  const equivalent=run({...input,currentRightEye:transpose(input.currentRightEye),currentLeftEye:transpose(input.currentLeftEye),objectiveRightEye:transpose(input.objectiveRightEye),objectiveLeftEye:transpose(input.objectiveLeftEye)});
  assert.deepEqual(a.rightEye,equivalent.rightEye); assert.deepEqual(a.leftEye,equivalent.leftEye);
  for (const quality of [null,0,5,6,7,8,10]) for (const repeat of [null,false,true]) for(const calm of [null,false,true]) {
    const r=run({...input,context:{...input.context,rightQuality:quality,leftQuality:quality,repeat,calm}});
    for (const e of [r.rightEye,r.leftEye]) {
      assert.ok(e.sph===null||finite(e.sph));
      assert.ok(e.cyl===null||finite(e.cyl));
      if(e.cyl) assert.ok(e.axis>0&&e.axis<=180);
    }
    combinations++;
  }
}
assert.equal(cases.length,60);
assert.ok(summarise(after).meanWorstEyeD < summarise(before).meanWorstEyeD);
assert.ok(before.every((b,i)=>!b.full||after[i].error<=0.25000001),'previously exact complete cases stay within the declared quarter-dioptre engineering band');
const base={age:50,context:{precise:true,accurate:true},currentRightEye:{sph:1,cyl:-1,axis:175},currentLeftEye:empty,objectiveRightEye:{sph:3,cyl:-1.25,axis:5},objectiveLeftEye:empty,currentAdd:NaN,objectiveAdd:NaN};
assert.equal(run({...base,currentRightEye:empty,objectiveRightEye:empty,age:''}).rightEye.sph,null);
assert.equal(run({...base,currentAdd:0,objectiveAdd:2}).readingAdd,0);
assert.equal(run({...base,objectiveRightEye:{sph:1,cyl:-1,axis:NaN}}).rightEye.sph,null);
assert.deepEqual(run({...base,context:{...base.context,rightQuality:0}}).rightEye,base.currentRightEye);
assert.deepEqual(run({...base,objectiveRightEye:{sph:4,cyl:-1,axis:175}}).rightEye,base.currentRightEye);
let previous=-Infinity;
for(let q=0;q<=10;q++) {
  const i={...base,context:{...base.context,rightQuality:q}};
  const confidence=confidenceFor(i,'right'); assert.ok(confidence.quality>=previous); previous=confidence.quality;
  assert.equal(confidenceFor({...i,context:{...i.context,repeat:true}},'right').quality,confidence.quality,'repeat never upgrades quality');
}
const records=JSON.parse(fs.readFileSync(new URL('../outputs/refract-review-20260930/analysis.json',import.meta.url)));
assert.ok(Math.abs(summarise(before).meanWorstEyeD-records.summary.distance.meanWorstEyeD)<1e-8 || Math.abs(summarise(before).meanWorstEyeD-0.1853103)<1e-7);
const csvSha256=crypto.createHash('sha256').update(fs.readFileSync(new URL('../tools/allan-rx-full.csv',import.meta.url))).digest('hex');
assert.equal(csvSha256,'c286c8fa03a9375609088d6092bb99da7f58c334b72e9eb1679b53d6454b44e2');
const report={date:'2026-09-30',status:'in-sample development, not clinical validation',metric:'maximum absolute meridional power difference, worse eye per patient',before:summarise(before),after:summarise(after),changes,combinations,csvSha256};
if(process.argv.includes('--write')) fs.writeFileSync(new URL('../outputs/weighted-20260930/independent-report.json',import.meta.url),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
