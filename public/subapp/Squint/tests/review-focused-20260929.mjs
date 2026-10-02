import fs from 'node:fs/promises';
const t = await fetch('http://127.0.0.1:9335/json/new?http://127.0.0.1:8090/Squint/index.html', {method:'PUT'}).then(r=>r.json());
const w = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r=>w.onopen=r);
let id=0;const jobs=new Map();w.onmessage=({data})=>{const m=JSON.parse(data);if(jobs.has(m.id)){jobs.get(m.id)(m.result);jobs.delete(m.id);}};
const send=(method,params={})=>new Promise(r=>{jobs.set(++id,r);w.send(JSON.stringify({id,method,params}));});
await send('Emulation.setDeviceMetricsOverride',{width:360,height:740,deviceScaleFactor:1,mobile:true});
await new Promise(r=>setTimeout(r,1200));
const response=await send('Runtime.evaluate',{awaitPromise:true,returnByValue:true,expression:`(async()=>{
const wait=ms=>new Promise(r=>setTimeout(r,ms));const iris=e=>document.querySelector('.eye[data-eye="'+e+'"] .iris');
const pupils=()=>[...document.querySelectorAll('.pupil')].map(e=>Number(e.dataset.effectiveSize));
const apply=c=>ControlsController.applyCondition(c,c,{suppressFlash:true});
const torch=async side=>{AppState.state.lightPillPos=side==='left'?0:1;LightController.setLightState(side,{allowToggle:false});await wait(1200);return pupils();};
const cases=Object.values(CONDITION_LIBRARY).flat().filter(i=>/pupil|rapd|anisocoria|horner|mydriasis|miosis|3rd/.test(i.value));const pupilCases=[];
for(const c of cases){apply(c.value);await wait(300);const baseline=pupils();const re=await torch('left');const le=await torch('right');LightController.setNearState(true);await wait(600);const near=pupils();LightController.setNearState(false);pupilCases.push({value:c.value,baseline,re,le,near});}
const nyst=[];
for(const [c,dir,cover] of [['latent nystagmus-like','primary','left'],['gaze-evoked nystagmus-like','right','none'],['ino-like pattern','left','none']]){apply(c);GazeController.applyDirection(dir);EyeController.applyCoverState(cover);let samples=[];for(let i=0;i<45;i++){await wait(72);samples.push(iris('left').nystagmusOffset.x);}nyst.push({c,dir,cover,samples,label:AppState.state.nystagmusFastPhase});}
ControlsController.resetEyes();GazeController.applyDirection('right');const before={...iris('right').gazeOffset};EyeController.applyCoverState('left');await wait(1450);const fix=CoverController.computeFixationOffset(iris('right'));
ControlsController.resetEyes();const uncoveredLight=await torch('left');EyeController.applyCoverState('left');await wait(1700);const coveredLight=pupils();
return {pupilCases,nyst,normalCover:{before,fix},coveredTorch:{uncoveredLight,coveredLight},manual:{third:SquintAnalysis.determineCondition('large out and large down | large ptosis | dilated pupil'),fourth:SquintAnalysis.determineCondition('large out and large up')}};
})()`});
if(response.exceptionDetails)throw Error(JSON.stringify(response.exceptionDetails));
await fs.writeFile(new URL('../output/playwright/focused-review-20260929.json',import.meta.url),JSON.stringify(response.result.value,null,2));
const shot=await send('Page.captureScreenshot',{format:'png'});await fs.writeFile(new URL('../output/playwright/focused-review-20260929.png',import.meta.url),Buffer.from(shot.data,'base64'));
w.close();console.log('Focused pupil, nystagmus and manual-analysis evidence saved.');
