const { webkit } = require('playwright');
(async () => {
 const b = await webkit.launch();
 const p = await b.newPage();
 await p.goto('http://127.0.0.1:4199/');
 for (const name of ['New_FrontofEyeFullAnim.mp4', 'New_FrontofEyeFullAnim_timed.mp4']) {
  const result = await p.evaluate(async name => {
   const v = document.createElement('video'); v.muted = true; v.playsInline = true; v.preload='auto';
   document.body.appendChild(v);
   const loaded = new Promise(resolve => { v.onloadeddata = () => resolve('loaded'); v.onerror = () => resolve('error'); setTimeout(() => resolve('timeout'), 5000); });
   v.src='/videos/FullAnim/'+name; v.load();
   const state = await loaded;
   return { state, ready: v.readyState, error: v.error?.message, code:v.error?.code, src: v.currentSrc };
  }, name);
  console.log(name, result);
 }
 await b.close();
})().catch(e => { console.error(e); process.exitCode=1; });
