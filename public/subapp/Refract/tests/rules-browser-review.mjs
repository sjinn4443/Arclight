// Isolated Edge review: never modifies retained Codex browser tab dimensions.
import { chromium } from '../../Morph/node_modules/playwright-core/index.mjs';
import { build } from '../../Cataract/node_modules/esbuild/lib/main.js';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const evidence=path.join(root,'output/playwright/rules-20260929');await fs.mkdir(evidence,{recursive:true});
const bundled=await build({absWorkingDir:root,entryPoints:['scripts.js'],bundle:true,minify:true,format:'iife',target:'es2018',write:false,logLevel:'silent'});
assert.equal(Buffer.from(bundled.outputFiles[0].contents).toString().replaceAll('\r\n','\n'),(await fs.readFile(path.join(root,'app.bundle.js'),'utf8')).replaceAll('\r\n','\n'));
const server=http.createServer(async(req,res)=>{
  try {
    const requested=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if(!requested.startsWith(root)) {res.writeHead(403);res.end();return;}
    const ext=path.extname(requested),mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.webmanifest':'application/manifest+json'}[ext]||'application/octet-stream';
    const data=await fs.readFile(requested.endsWith(path.sep)?path.join(requested,'index.html'):requested);
    res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-store'});res.end(data);
  } catch {res.writeHead(404);res.end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const report=[];
try {
 for(const [label,url] of [['http',`http://127.0.0.1:${server.address().port}/index.html`],['file',pathToFileURL(path.join(root,'index.html')).href]]) {
  const context=await browser.newContext({viewport:{width:360,height:740}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(url);await page.waitForSelector('#current-re-sph');
  await page.screenshot({path:path.join(evidence,`${label}-untouched.png`)});
  assert.equal(await page.locator('#output-re-sph').inputValue(),'');
  const toggleMode = () => page.locator('label.top-toggle-advanced').click();
  await toggleMode();
  await page.evaluate(()=>{
    const values={'age':25,'current-re-sph':2.5,'current-re-cyl':1.75,'current-re-axis':165,'objective-re-sph':2,'objective-re-cyl':1.75,'objective-re-axis':164};
    for(const [id,value] of Object.entries(values)) {
      const el=document.getElementById(id);el.value=String(value);
      if(id.includes('sph')||id.includes('cyl')) {el.closest('.spinner-container').dataset.sign='-';el.closest('.spinner-container').querySelector('.field-sign').textContent='-';}
    }
    document.getElementById('toggle-precise').checked=true;document.getElementById('toggle-accurate').checked=true;
    document.getElementById('age').dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await page.locator('#output-re-sph').inputValue(),'2.25');
  const original=await page.locator('#current-re-sph').inputValue();
  for(let n=0;n<4;n++) {await toggleMode();await toggleMode();}
  assert.equal(Number(await page.locator('#current-re-sph').inputValue()),Number(original));
  assert.equal(await page.locator('#current-re-cyl').inputValue(),'1.75');
  assert.equal(await page.locator('#output-re-sph').inputValue(),'2.25');
  await page.screenshot({path:path.join(evidence,`${label}-advanced.png`)});
  await page.locator('#prescribing-rules summary').click();
  assert.ok((await page.locator('#prescribing-rule-list').innerText()).includes('halfway'));
  await page.screenshot({path:path.join(evidence,`${label}-rules.png`)});
  await page.locator('#prescribing-rules summary').click();
  await toggleMode();
  assert.equal(await page.locator('#current-re-sph').inputValue(),'3.25');
  await page.evaluate(()=>{const e=document.getElementById('current-re-sph');e.value='3';e.dispatchEvent(new Event('input',{bubbles:true}));});
  await toggleMode();
  assert.equal(await page.locator('#current-re-sph').inputValue(),'3.00');
  assert.equal(await page.locator('#current-re-cyl').inputValue(),'');
  const geometry=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth}));
  assert.equal(geometry.scrollWidth,360);
  // The direct-file MCQ module may be blocked by browser CORS; core bundled engine must still work.
  const coreErrors=errors.filter(e=>!(label==='file'&&(/mcq-controller|CORS policy|net::ERR_FAILED/.test(e))));
  assert.deepEqual(coreErrors,[]);
  report.push({label,geometry,errors,modeSwitchCycles:4,bundleParity:true});await context.close();
 }
} finally {await browser.close();server.close();}
await fs.writeFile(path.join(evidence,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
