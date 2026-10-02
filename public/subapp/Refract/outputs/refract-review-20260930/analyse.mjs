import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { cases, inputFor, evaluate, totals } from '../../tools/review-prescribing-rules.mjs';
import { computePrescriptionCase } from '../../src/prescription-engine.js';

export const EPS = 1e-8;
export const numeric = n => typeof n === 'number' && Number.isFinite(n);
export const clean = n => typeof n === 'number' && !Number.isFinite(n) ? null : n;
export const axisGap = (a, b) => Math.min(Math.abs(a-b)%180, 180-Math.abs(a-b)%180);
export function normalise(eye) {
  if (!numeric(eye.sph)) return null;
  let {sph, cyl, axis} = eye;
  // This dataset's populated sphere with blank cylinder is interpreted as sphere-only.
  // Original cells stay blank in Source. A wholly blank eye is never plano.
  cyl = numeric(cyl) ? cyl : 0;
  if (cyl === 0) return {sph, cyl:0, axis:0};
  if (!numeric(axis) || axis<0 || axis>180) return null;
  if (cyl>0) { sph += cyl; cyl = -cyl; axis += 90; }
  axis = (axis%180+180)%180;
  return {sph, cyl, axis:axis===0?180:axis};
}
export function vector(eye) {
  const e = normalise(eye);
  if (!e) return null;
  return [e.sph+e.cyl/2, -e.cyl/2*Math.cos(e.axis*Math.PI/90), -e.cyl/2*Math.sin(e.axis*Math.PI/90)];
}
export function difference(a,b) {
  const x=normalise(a), y=normalise(b), p=vector(a), q=vector(b);
  if (!x||!y) return null;
  const d=p.map((n,i)=>n-q[i]);
  const astig=Math.hypot(d[1],d[2]);
  return {sphere:Math.abs(x.sph-y.sph), cylinder:Math.abs(x.cyl-y.cyl),
    axis:x.cyl&&y.cyl?axisGap(x.axis,y.axis):null,
    mean:Math.abs(d[0]), astigResidual:2*astig, vectorNorm:Math.hypot(...d),
    // Maximum absolute meridional lens-power difference: spectral norm of
    // the difference power matrix. Engineering distance, not a tolerance standard.
    worstMeridian:Math.abs(d[0])+astig,
    exact:Math.abs(d[0])+astig<EPS};
}
export const rxText = eye => {
  if (!numeric(eye.sph)) return 'Not recorded';
  const sign=n=>(n>0?'+':'')+n.toFixed(2);
  return sign(eye.sph)+(numeric(eye.cyl)&&eye.cyl!==0?` / ${sign(eye.cyl)} x ${eye.axis}°`:' DS');
};
export function direction(current, proposed) {
  const c=normalise(current), p=normalise(proposed);
  if (!p) return 'Not scored';
  if (!c) return 'First recorded Rx';
  const d=difference(current, proposed);
  if (d.exact) return 'Retain';
  const delta=p.sph+p.cyl/2-c.sph-c.cyl/2;
  return delta>EPS?'More plus M':delta<-EPS?'More minus M':'Cylinder/axis only';
}
export function buildAnalysis() {
  const csvUrl=new URL('../../tools/allan-rx-full.csv',import.meta.url);
  const text=fs.readFileSync(csvUrl,'utf8').replace(/^\uFEFF/,'');
  const lines=text.split(/\r?\n/).slice(0,62).map(l=>l.split(','));
  assert.equal(cases.length,60);
  assert.equal(lines.length,62);
  const sourceRows=lines.slice(2).map(r=>r.map(v=>v===''?null:Number(v)));
  sourceRows.forEach(r=>assert.equal(r.length,31));
  const results=evaluate(computePrescriptionCase);
  const eyeRows=[], patients=[];
  for(let i=0;i<60;i++) {
    const c=cases[i], output=results[i].output, pe=[];
    for(const side of ['right','left']) {
      const cap=side==='right'?'Right':'Left';
      const current=c[`current${cap}Eye`], objective=c[`objective${cap}Eye`], given=c[`expected${cap}Eye`], engine=output[`${side}Eye`];
      const errors=difference(engine,given);
      const eye={caseNumber:c.caseNumber, side, current, objective, given, engine, errors,
        givenDirection:direction(current,given), engineDirection:direction(current,engine),
        trace:output.trace[side], currentVsGiven:difference(current,given), objectiveVsGiven:difference(objective,given)};
      eyeRows.push(eye); pe.push(eye);
    }
    const addError=numeric(c.expectedAdd)&&numeric(output.readingAdd)?Math.abs(c.expectedAdd-output.readingAdd):null;
    const flags=[];
    if(c.caseNumber===14) flags.push('RE given cylinder exceeds both recorded endpoints');
    if([c.currentRightEye,c.currentLeftEye,c.expectedRightEye,c.expectedLeftEye].some(e=>e.cyl>0)) flags.push('Plus cylinder transposed for comparison only');
    if(numeric(c.currentAdd)&&numeric(c.expectedAdd)&&c.currentAdd!==c.expectedAdd) flags.push('Given add changes current add');
    if(!numeric(c.expectedAdd)&&Number(c.age)>=46) flags.push('Given add blank at age 46+; intention unresolved');
    if(sourceRows[i][7]!==null) flags.push('B code unresolved');
    patients.push({caseNumber:c.caseNumber, age:Number(c.age), eyes:pe, add:{current:clean(c.currentAdd), given:clean(c.expectedAdd), engine:output.readingAdd, error:addError},
      distanceWorst:pe.every(e=>e.errors)?Math.max(...pe.map(e=>e.errors.worstMeridian)):null,
      componentWorst:pe.every(e=>e.errors)?Math.max(...pe.flatMap(e=>[e.errors.sphere,e.errors.cylinder])):null,
      scoredFullWorst:pe.every(e=>e.errors)&&addError!==null?Math.max(addError,...pe.map(e=>e.errors.worstMeridian)):null,
      directionsAgree:pe.every(e=>e.givenDirection===e.engineDirection),flags,legacyExact:results[i].full,
      modifiers:{I:clean(c.health),calm:clean(c.calm),precise:clean(c.precise),B:sourceRows[i][7],repeat:clean(c.repeat),QR:c.qualityRight,QL:c.qualityLeft}});
  }
  const dist=patients.filter(p=>p.distanceWorst!==null), full=patients.filter(p=>p.scoredFullWorst!==null), adds=patients.filter(p=>p.add.error!==null);
  const describe=arr=>{const ordered=[...arr].sort((a,b)=>a-b),mid=Math.floor(arr.length/2); return {n:arr.length,mean:arr.reduce((a,b)=>a+b,0)/arr.length,median:arr.length%2?ordered[mid]:(ordered[mid-1]+ordered[mid])/2,max:Math.max(...arr),within025:arr.filter(n=>n<=.25+EPS).length,within050:arr.filter(n=>n<=.5+EPS).length,exact:arr.filter(n=>n<EPS).length};};
  const summary={legacyExact:totals(results),distance:describe(dist.map(p=>p.distanceWorst)),fullRecorded:describe(full.map(p=>p.scoredFullWorst)),add:describe(adds.map(p=>p.add.error)),
    components:describe(patients.map(p=>p.componentWorst)),eyes:describe(eyeRows.map(e=>e.errors.worstMeridian)),
    sphere:describe(eyeRows.map(e=>e.errors.sphere)),cylinder:describe(eyeRows.map(e=>e.errors.cylinder)),
    directionsAgree:patients.filter(p=>p.directionsAgree).length,
    noCurrentRxRecorded:patients.filter(p=>p.eyes.every(e=>!normalise(e.current))).length,
    precise:cases.filter(c=>c.precise===1).length, healthMarked:cases.filter(c=>c.health===1).length,
    absentAdds:patients.filter(p=>p.add.given===null).map(p=>p.caseNumber),
    largerDistance:patients.filter(p=>p.distanceWorst>.5+EPS).map(p=>({n:p.caseNumber,D:p.distanceWorst})),
    mixedQuality:cases.filter(c=>(c.qualityRight>=8)!==(c.qualityLeft>=8)).map(c=>c.caseNumber)};
  const hashes=Object.fromEntries(['../../tools/allan-rx-full.csv','../../src/prescribing-rules.js','../../src/prescription-logic.js','../../src/prescription-config.js','../../app.bundle.js','../../Refract-integrated-flowchart.drawio'].map(p=>[p,crypto.createHash('sha256').update(fs.readFileSync(new URL(p,import.meta.url))).digest('hex')]));
  return {date:'2026-09-30', mapping:'Existing replay: QR/QL >= 8 independently; precise and I equal 1 only; VA-good false; objective add unavailable; calm/B/repeat unused. Not new clinical assumptions.', sourceHeaders:lines.slice(0,2),sourceRows,hashes,summary,patients,eyeRows};
}
export function selfTest() {
  const eq=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
  eq(difference({sph:1,cyl:-2,axis:180},{sph:1,cyl:-2,axis:0}).worstMeridian,0);
  eq(difference({sph:1,cyl:2,axis:30},{sph:3,cyl:-2,axis:120}).worstMeridian,0);
  eq(difference({sph:0,cyl:0,axis:null},{sph:0,cyl:null,axis:90}).worstMeridian,0);
  eq(difference({sph:0,cyl:0},{sph:.25,cyl:0}).worstMeridian,.25);
  eq(difference({sph:0,cyl:-1,axis:0},{sph:0,cyl:-1,axis:90}).worstMeridian,1);
  assert.equal(difference({sph:null},{sph:0}),null);
  assert.equal(normalise({sph:0,cyl:-1,axis:null}),null);
  // Independent sampled-meridian calculation validates the combined metric.
  for(const a of [{sph:1,cyl:-2,axis:23},{sph:-2,cyl:.75,axis:155}]) for(const b of [{sph:0,cyl:-1,axis:91},{sph:1,cyl:0,axis:0}]) {
    let worst=0;
    const power=(e,t)=>e.sph+e.cyl*Math.sin((t-e.axis)*Math.PI/180)**2;
    for(let theta=0;theta<180;theta+=.01) worst=Math.max(worst,Math.abs(power(a,theta)-power(b,theta)));
    assert.ok(Math.abs(worst-difference(a,b).worstMeridian)<1e-6);
    eq(difference(a,b).worstMeridian,difference(b,a).worstMeridian);
  }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
  selfTest(); const data=buildAnalysis();
  fs.writeFileSync(new URL('./analysis.json',import.meta.url),JSON.stringify(data,(_,v)=>clean(v),2));
  console.log(JSON.stringify(data.summary,null,2));
}
