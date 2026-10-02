import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { computePrescriptionCase as run } from '../src/prescription-engine.js';
import { transposePrescription, selectReadingAddition } from '../src/prescription-logic.js';
import { cases, inputFor, evaluate, totals } from '../tools/review-prescribing-rules.mjs';

const empty={sph:NaN,cyl:NaN,axis:NaN};
const input={age:50,context:{precise:true,accurate:true,health:false,vaGood:false},
  currentRightEye:empty,currentLeftEye:empty,objectiveRightEye:empty,objectiveLeftEye:empty,
  currentAdd:NaN,objectiveAdd:NaN};
const noAge=run({...input,age:''});
assert.equal(noAge.rightEye.sph,null);assert.equal(noAge.readingAdd,null);
for(const blank of [null,undefined,NaN]) assert.equal(selectReadingAddition(75,true,blank,blank),2.75);
assert.equal(selectReadingAddition(75,true,0,2),0);
assert.equal(selectReadingAddition(75,true,1.5,2),1.5);
assert.equal(selectReadingAddition(47.5,false,NaN,NaN),1.25);
assert.ok(Number.isNaN(selectReadingAddition(Infinity,false,NaN,NaN)));
const invalid=run({...input,objectiveRightEye:{sph:1,cyl:-1,axis:NaN}});
assert.equal(invalid.rightEye.sph,null);assert.ok(invalid.review.length);
let count=0;
for(const c of cases) {
  const i=inputFor(c), before=JSON.stringify(i), a=run(i), b=run(i);
  assert.deepEqual(a,b);assert.equal(JSON.stringify(i),before,'inputs must not mutate');
  const swap=run({...i,currentRightEye:i.currentLeftEye,currentLeftEye:i.currentRightEye,
    objectiveRightEye:i.objectiveLeftEye,objectiveLeftEye:i.objectiveRightEye,
    context:{...i.context,rightAccurate:i.context.leftAccurate,leftAccurate:i.context.rightAccurate,
      rightQuality:i.context.leftQuality,leftQuality:i.context.rightQuality}});
  assert.deepEqual(a.rightEye,swap.leftEye);assert.deepEqual(a.leftEye,swap.rightEye);
  const trans=rx=>Number.isFinite(rx.cyl)&&rx.cyl!==0&&Number.isFinite(rx.axis)?transposePrescription(rx):rx;
  const equiv=run({...i,currentRightEye:trans(i.currentRightEye),currentLeftEye:trans(i.currentLeftEye),
    objectiveRightEye:trans(i.objectiveRightEye),objectiveLeftEye:trans(i.objectiveLeftEye)});
  assert.deepEqual(a.rightEye,equiv.rightEye,`transpose invariant case ${c.caseNumber}`);
  assert.deepEqual(a.leftEye,equiv.leftEye);
  for(const precise of [false,true]) for(const accurate of [false,true]) for(const vaGood of [false,true]) for(const health of [false,true]) {
    const r=run({...i,context:{precise,accurate,vaGood,health}});
    for(const eye of [r.rightEye,r.leftEye]) {
      assert.ok(eye.sph===null||Number.isFinite(eye.sph));
      if(eye.cyl) assert.ok(eye.axis>0&&eye.axis<=180);
    }
    count++;
  }
}
const simple=run({...input,context:{simple:true,precise:false,accurate:true},objectiveRightEye:{sph:2,cyl:-1,axis:90}});
assert.equal(simple.rightEye.sph,1.5);assert.equal(simple.rightEye.cyl,null);
const high=run({...input,age:35,currentRightEye:{sph:3.25,cyl:-1.75,axis:175},objectiveRightEye:{sph:4.5,cyl:-1.75,axis:179},context:{precise:false,accurate:true}});
assert.equal(high.rightEye.axis,175);assert.equal(high.rightEye.sph,3.75);
const result=evaluate(run), baseline=JSON.parse(fs.readFileSync(new URL('../tools/prescribing-baseline-20260929.json',import.meta.url)));
// Full authored context now includes graded quality, calm and returning status.
// Closeness and the small case-57 axis regression are protected in weighted-rules.
assert.deepEqual(totals(result),{full:29,right:43,left:41,add:52});
assert.equal(result.filter((r,i)=>baseline.rows[i].full&&!r.full).length,0);
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL('../tools/allan-rx-full.csv',import.meta.url))).digest('hex'),baseline.csvSha256);
console.log(`Prescribing rules passed: ${count} context combinations, 60 determinism/swap/transpose cases, add and missing-data boundaries; original CSV unchanged.`);
