import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const url = process.argv[2] || 'http://127.0.0.1:8090/Squint/index.html';
const port = process.argv[3] || '9335';
const route = url.startsWith('file:') ? 'file' : 'http';
const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, {method:'PUT'}).then(r=>r.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r=>socket.onopen=r);
let id=0; const pending=new Map(); const errors=[];
socket.onmessage=({data})=>{const m=JSON.parse(data); if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails); if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params); if(pending.has(m.id)){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}};
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});
await send('Runtime.enable');
await send('Network.setCacheDisabled',{cacheDisabled:true});
await send('Network.setBypassServiceWorker',{bypass:true});
await send('Emulation.setDeviceMetricsOverride',{width:360,height:740,deviceScaleFactor:1,mobile:true});
await send('Page.navigate',{url});
await new Promise(r=>setTimeout(r,1200));
const result=await send('Runtime.evaluate',{awaitPromise:true,returnByValue:true,expression:`(async()=>{
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const iris=e=>document.querySelector('.eye[data-eye="'+e+'"] .iris');
const sizes=()=>[...document.querySelectorAll('.pupil')].map(e=>Number(e.dataset.effectiveSize));
const apply=c=>ControlsController.applyCondition(c,c,{suppressFlash:true});
const cover=async c=>{EyeController.applyCoverState(c);await wait(1500);};
const torch=async s=>{AppState.state.lightPillPos=s==='left'?0:1;LightController.setLightState(s,{allowToggle:false});await wait(1400);return sizes();};
ControlsController.resetEyes();GazeController.applyDirection('right');await cover('left');
const fixation={gaze:iris('right').gazeOffset,correction:CoverController.computeFixationOffset(iris('right'))};
await cover('right');const alternate=document.getElementById('analysis-output').textContent;
ControlsController.resetEyes();const resetText=document.getElementById('analysis-output').textContent;
const lit=await torch('left');await cover('left');await wait(700);const blocked=sizes();const consensual=await torch('right');
const near=[];for(const c of ['3rd nerve palsy','compressive 3rd nerve palsy','pupil-sparing 3rd nerve palsy','duane type i-like','ino-like pattern','brown syndrome-like']){apply(c);LightController.setNearState(true);near.push({c,re:iris('left').nearOffset.x,le:iris('right').nearOffset.x});LightController.setNearState(false);}
const state=()=>JSON.stringify({preset:AppState.state.activePresetKey,hints:AppState.state.activeDiagnosticHints,models:AppState.state.pupilModelByEye,gains:AppState.state.pupilReactivityByEye,rapd:AppState.state.rapdValue,sizes:[...document.querySelectorAll('.slider[data-eye]')].map(e=>e.value)});
const dilation=[];for(const c of ["adie's pupil",'rapd (re marked)','compressive 3rd nerve palsy']){apply(c);const before=state();const toggle=document.getElementById('toggle-dilated');toggle.checked=true;toggle.dispatchEvent(new Event('change'));const during=state();toggle.checked=false;toggle.dispatchEvent(new Event('change'));dilation.push({c,before,during,after:state()});}
const vertical=[];for(const c of ['right hyperphoria','left hyperphoria','hyperphoria (decompensating)','hypophoria (decompensating)','dvd-like pattern']){apply(c);await cover('left');const re=iris('left').coverOffset.y;await cover('right');vertical.push({c,re,le:iris('right').coverOffset.y});}
const nyst=[];for(const [c,dir,occlusion] of [['latent nystagmus-like','primary','left'],['latent nystagmus-like','primary','right'],['gaze-evoked nystagmus-like','right','none'],['gaze-evoked nystagmus-like','left','none'],['ino-like pattern','left','none']]){apply(c);GazeController.applyDirection(dir);EyeController.applyCoverState(occlusion);const values=[];for(let n=0;n<80;n++){await wait(35);values.push(iris('left').nystagmusOffset.x);}const changes=values.slice(1).map((v,i)=>v-values[i]);nyst.push({c,dir,occlusion,min:Math.min(...changes),max:Math.max(...changes)});}
ControlsController.resetEyes();await wait(1500);
const settledResetText=document.getElementById('analysis-output').textContent;
return {fixation,alternate,resetText,settledResetText,lit,blocked,consensual,near,dilation,vertical,nyst,third:SquintAnalysis.determineCondition('large out and large down | large ptosis | dilated pupil'),fourth:SquintAnalysis.determineCondition('large out and large up'),width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth};
})()`});
if(result.exceptionDetails)throw Error(JSON.stringify(result.exceptionDetails));
const evidence=result.result.value;
await fs.writeFile(new URL(`../output/playwright/interaction-regression-${route}.json`,import.meta.url),JSON.stringify({evidence,errors},null,2));
const shot=await send('Page.captureScreenshot',{format:'png'});
await fs.writeFile(new URL(`../output/playwright/interaction-regression-${route}.png`,import.meta.url),Buffer.from(shot.data,'base64'));
socket.close();
assert.equal(errors.length,0);
assert.equal(evidence.width,360);assert.equal(evidence.height,740);assert.equal(evidence.scrollWidth,360);
assert.ok(evidence.fixation.gaze.x>10);assert.ok(Math.abs(evidence.fixation.correction.x)<1);
assert.match(evidence.alternate,/Alternate cover:/);assert.doesNotMatch(evidence.alternate,/Cover-uncover:/);
assert.doesNotMatch(evidence.resetText,/Uncover:|Cover-uncover:|Alternate cover:/);
assert.doesNotMatch(evidence.settledResetText,/Uncover:|Cover-uncover:|Alternate cover:/);
assert.ok(evidence.blocked[1]>evidence.lit[1]+5);assert.ok(evidence.consensual[0]<evidence.blocked[0]-5);
for(const x of evidence.near){assert.equal(x.re,4);assert.equal(x.le,x.c.includes('3rd')?-.64:x.c.includes('duane')?-2.88:-4);}
for(const x of evidence.dilation){assert.equal(x.before,x.during);assert.equal(x.before,x.after);}
for(const x of evidence.vertical){if(x.c==='dvd-like pattern'){assert.ok(x.re<0&&x.le<0);}else{assert.ok(x.re*x.le<0);assert.equal(Math.abs(x.re),Math.abs(x.le));}}
for(const [i,x] of evidence.nyst.entries()){const positive=i===0||i===2;assert.ok(positive?x.max>Math.abs(x.min)*1.3:Math.abs(x.min)>x.max*1.3,JSON.stringify(x));}
assert.doesNotMatch(evidence.third,/definite/);assert.match(evidence.fourth,/possible/);
console.log('Eight interaction regressions passed: '+route);
