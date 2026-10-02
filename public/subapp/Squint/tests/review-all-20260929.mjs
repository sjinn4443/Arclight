// Read-only application audit in an isolated Chrome profile; writes evidence only.
import fs from 'node:fs/promises';
const port = process.argv[2] || '9335';
const target = await fetch(`http://127.0.0.1:${port}/json/new?http://127.0.0.1:8090/Squint/index.html`, {method:'PUT'}).then(r => r.json());
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map();
ws.onmessage = ({ data }) => { const m = JSON.parse(data); if (!pending.has(m.id)) return; const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(m.error) : p.resolve(m.result); };
const send = (method, params) => new Promise((resolve, reject) => { const key = ++id; pending.set(key, { resolve, reject }); ws.send(JSON.stringify({ id: key, method, params })); });
const run = async expression => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw Error(JSON.stringify(r.exceptionDetails)); return r.result.value; };
await send('Network.setBypassServiceWorker', {bypass:true});
await send('Network.setCacheDisabled', {cacheDisabled:true});
await send('Emulation.setDeviceMetricsOverride', {width:360,height:740,deviceScaleFactor:1,mobile:true});
await send('Page.reload', {ignoreCache:true});
await new Promise(r=>setTimeout(r,1200));
const inventory = await run('Object.entries(CONDITION_LIBRARY).flatMap(([tier,items])=>items.map(i=>({...i,tier})))');
const results = [];
for (const item of inventory) {
  const result = await run(`(async()=>{
    const wait=ms=>new Promise(r=>setTimeout(r,ms));
    const snap=()=>({state:{preset:AppState.state.activePresetKey,cover:AppState.state.coverEye,rapd:AppState.state.rapdValue},analysis:document.querySelector('#analysis-output').textContent,observation:AppState.state.coverObservation,eyes:[...document.querySelectorAll('.eye')].map(e=>{const i=e.querySelector('.iris');return {eye:e.dataset.eye,pupil:Number(e.querySelector('.pupil').dataset.effectiveSize),gaze:i.gazeOffset,near:i.nearOffset,cover:i.coverOffset,fix:CoverController.computeFixationOffset(i),transform:i.style.transform};})});
    ControlsController.applyCondition(${JSON.stringify(item.value)},${JSON.stringify(item.label)},{suppressFlash:true});
    await wait(150); const baseline=snap(); const gaze={};
    for(const d of ['primary','left','right','up','down','up-left','up-right','down-left','down-right']){GazeController.applyDirection(d);gaze[d]=snap();}
    GazeController.resetToPrimary();
    LightController.setNearState(true);await wait(500);const near=snap();LightController.setNearState(false);
    for(const side of ['left','right']){AppState.state.lightPillPos=side==='left'?0:1;LightController.setLightState(side,{allowToggle:false});await wait(450);}
    LightController.setLightState('none',{allowToggle:false});
    EyeController.applyCoverState('left');await wait(1400);const coverRe=snap();
    EyeController.applyCoverState('right');await wait(1400);const coverLe=snap();
    EyeController.applyCoverState('none');await wait(150);const uncovered=snap();
    ControlsController.resetEyes();await wait(180);const reset=snap();
    return {baseline,gaze,near,coverRe,coverLe,uncovered,reset};
  })()`);
  results.push({ ...item, ...result });
  console.log(`${results.length}/${inventory.length} ${item.value}`);
}
await fs.writeFile(new URL('../output/playwright/all-condition-fixed-20260929.json',import.meta.url),JSON.stringify(results,null,2));
ws.close();
