import fs from 'node:fs';
import { loadWorkbookCases, valuesMatch } from '../../tools/lib/workbook-analysis.mjs';
import { difference } from '../refract-review-20260930/analyse.mjs';
import { computeWeightedPrescription, PARAMETERS } from './candidate.mjs';
const cases=loadWorkbookCases();
const baseline=JSON.parse(fs.readFileSync(new URL('../refract-review-20260930/analysis.json',import.meta.url),'utf8'));
const sum=a=>a.reduce((s,n)=>s+n,0);
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const eyeExact=(a,b)=>['sph','cyl','axis'].every(k=>valuesMatch(a[k],b[k]));
export const inputFor=c=>({age:c.age,currentRightEye:c.currentRightEye,currentLeftEye:c.currentLeftEye,
  objectiveRightEye:c.objectiveRightEye,objectiveLeftEye:c.objectiveLeftEye,currentAdd:c.currentAdd,objectiveAdd:NaN,
  context:{precise:c.precise===1,health:c.health===1,vaGood:false,rightAccurate:c.qualityRight>=8,leftAccurate:c.qualityLeft>=8,
    calm:c.calm===1?true:c.calm===0?false:null,repeat:c.repeat===1?true:c.repeat===0?false:null,rightQuality:c.qualityRight,leftQuality:c.qualityLeft}});
function describe(a) {return {n:a.length,mean:sum(a)/a.length,within025:a.filter(n=>n<=.25000001).length,within05:a.filter(n=>n<=.50000001).length,exact:a.filter(n=>n<1e-8).length,max:Math.max(...a)};}
export function assess(parameters={}) {
  const patients=cases.map((c,i)=>{
    const input=inputFor(c);
    input.context={...input.context,calm:c.calm===1?true:c.calm===0?false:null,repeat:c.repeat===1?true:c.repeat===0?false:null,rightQuality:c.qualityRight,leftQuality:c.qualityLeft};
    const output=computeWeightedPrescription(input,parameters);
    const eyes=['right','left'].map(side=>{const cap=side==='right'?'Right':'Left';return {side,output:output[`${side}Eye`],given:c[`expected${cap}Eye`],error:difference(output[`${side}Eye`],c[`expected${cap}Eye`])};});
    const worst=Math.max(...eyes.map(e=>e.error?.worstMeridian??Infinity));
    const exactRight=eyeExact(output.rightEye,c.expectedRightEye),exactLeft=eyeExact(output.leftEye,c.expectedLeftEye),exactAdd=valuesMatch(output.readingAdd,c.expectedAdd);
    const addError=finite(c.expectedAdd)&&finite(output.readingAdd)?Math.abs(c.expectedAdd-output.readingAdd):null;
    return {caseNumber:c.caseNumber,worst,baseline:baseline.patients[i].distanceWorst,delta:worst-baseline.patients[i].distanceWorst,
      componentWorst:Math.max(...eyes.flatMap(e=>[e.error.sphere,e.error.cylinder])),
      exactRight,exactLeft,exactAdd,full:exactRight&&exactLeft&&exactAdd,addError,joint:addError===null?null:Math.max(worst,addError),eyes,output};
  });
  const stats={patients:describe(patients.map(p=>p.worst)),eyes:describe(patients.flatMap(p=>p.eyes.map(e=>e.error.worstMeridian))),
    literal:{full:patients.filter(p=>p.full).length,right:patients.filter(p=>p.exactRight).length,left:patients.filter(p=>p.exactLeft).length,add:patients.filter(p=>p.exactAdd).length},
    components:describe(patients.map(p=>p.componentWorst)),recordedAdd:describe(patients.filter(p=>p.addError!==null).map(p=>p.addError)),
    jointRecorded:describe(patients.filter(p=>p.joint!==null).map(p=>p.joint)),
    previouslyFullRegressions:patients.filter((p,i)=>baseline.patients[i].legacyExact&&!p.full).map(p=>p.caseNumber),
    improved:patients.filter(p=>p.delta < -1e-8).length,worse:patients.filter(p=>p.delta>1e-8).length,unchanged:patients.filter(p=>Math.abs(p.delta)<=1e-8).length};
  return {parameters:{...PARAMETERS,...parameters},stats,patients};
}
if(process.argv.includes('--write')) {
  const variants={weighted:assess(),withoutRepeat:assess({repeatEnabled:false})};
  fs.writeFileSync(new URL('./experiment.json',import.meta.url),JSON.stringify(variants,null,2));
  console.log(JSON.stringify({baseline:baseline.summary.distance,...Object.fromEntries(Object.entries(variants).map(([k,v])=>[k,v.stats]))},null,2));
  console.log(JSON.stringify(variants.weighted.patients.filter(p=>Math.abs(p.delta)>1e-8).map(p=>({n:p.caseNumber,before:p.baseline,after:p.worst,delta:p.delta})),null,2));
}
