// Isolated desktop browser review, not persistent Codex tab or physical-device acceptance.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '../../Morph/node_modules/playwright-core/index.mjs';
import { build } from '../../Cataract/node_modules/esbuild/lib/main.js';
import { computePrescriptionCase } from '../src/prescription-engine.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const evidence = path.join(root, 'output/playwright/context-20260930');
await fs.mkdir(evidence, { recursive: true });
const bundle = await build({ absWorkingDir: root, entryPoints: ['scripts.js'], bundle: true, minify: true, format: 'iife', target: 'es2018', write: false, logLevel: 'silent' });
const sourceOnly = process.argv.includes('--source');
if (!sourceOnly) assert.equal(Buffer.from(bundle.outputFiles[0].contents).toString().replaceAll('\r\n', '\n'), (await fs.readFile(path.join(root, 'app.bundle.js'), 'utf8')).replaceAll('\r\n', '\n'), 'Rebuild the shipped bundle before final browser verification');
const server = http.createServer(async (req, res) => {
  try {
    const requested = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!requested.startsWith(root)) { res.writeHead(403); res.end(); return; }
    const ext = path.extname(requested);
    const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' }[ext] || 'application/octet-stream';
    const data = sourceOnly && path.basename(requested) === 'app.bundle.js'
      ? bundle.outputFiles[0].contents
      : await fs.readFile(requested.endsWith(path.sep) ? path.join(requested, 'index.html') : requested);
    res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-store' }); res.end(data);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const review = { sourceBundleInMemory: sourceOnly, shippedBundleParity: !sourceOnly, viewportEmulation: 'temporary desktop 360 x 740', routes: {} };
try {
 for (const [label, url] of [
   ['http', `http://127.0.0.1:${server.address().port}/index.html`],
   ...(!sourceOnly ? [['file', pathToFileURL(path.join(root, 'index.html')).href]] : [])
 ]) {
  const report = { states: {} };
  review.routes[label] = report;
  const context = await browser.newContext({ viewport: { width: 360, height: 740 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);

  const capture = async (name) => {
    const geometry = await page.evaluate(() => {
      const rect = element => { const r = element.getBoundingClientRect(); return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height }; };
      const canvas = document.createElement('canvas').getContext('2d');
      const outputTextFit = [...document.querySelectorAll('.results-section input')].filter(input => input.value && input.checkVisibility()).map(input => {
        const style = getComputedStyle(input);
        canvas.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const contentWidth = input.getBoundingClientRect().width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth);
        return { id: input.id, value: input.value, contentWidth, textWidth: canvas.measureText(input.value).width };
      });
      return {
        width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth,
        output: rect(document.querySelector('.results-section')),
        controls: [...document.querySelectorAll('.context-choice select')].filter(e => e.checkVisibility()).map(e => ({ id: e.id, ...rect(e) })),
        quality: rect(document.getElementById('measurement-quality')),
        outputTextFit
      };
    });
    assert.equal(geometry.scrollWidth, 360, `${name}: no horizontal overflow`);
    for (const control of geometry.controls) {
      assert.ok(control.height >= 44, `${control.id}: minimum touch height`);
      assert.ok(control.left >= 0 && control.right <= 360, `${control.id}: visible width`);
    }
    for (const field of geometry.outputTextFit) assert.ok(field.textWidth <= field.contentWidth, `${field.id}: all output digits fit`);
    report.states[name] = geometry;
    await page.screenshot({ path: path.join(evidence, `${label}-${name}.png`) });
  };

  for (const id of ['context-repeat', 'context-calm', 'quality-right', 'quality-left']) assert.equal(await page.locator(`#${id}`).inputValue(), '');
  assert.equal(await page.locator('#output-re-sph').inputValue(), '');
  await capture('untouched');
  assert.ok(report.states.untouched.output.bottom <= 740, 'untouched output remains on the first screen');
  await page.locator('#context-repeat').focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#context-repeat').inputValue(), '0');
  await page.locator('#context-repeat').selectOption('1');
  await page.locator('#context-calm').selectOption('0');
  await page.locator('#measurement-quality summary').click();
  await page.locator('#quality-right').selectOption('5');
  await page.locator('#quality-left').selectOption('10');
  assert.equal(await page.locator('#measurement-quality-state').innerText(), 'RE 5 · LE 10');
  await page.locator('label.top-toggle-advanced').click();
  await capture('expanded-advanced');
  await page.locator('#measurement-quality summary').click();

  const eye = { sph: 1, cyl: -0.5, axis: 90 };
  const objective = { sph: 2.5, cyl: -1, axis: 100 };
  await page.evaluate(() => {
    const values = { age: 50, 'current-re-sph': 1, 'current-re-cyl': 0.5, 'current-re-axis': 90, 'current-le-sph': 1, 'current-le-cyl': 0.5, 'current-le-axis': 90, 'objective-re-sph': 2.5, 'objective-re-cyl': 1, 'objective-re-axis': 100, 'objective-le-sph': 2.5, 'objective-le-cyl': 1, 'objective-le-axis': 100 };
    for (const [id, value] of Object.entries(values)) {
      const el = document.getElementById(id); el.value = String(value);
      if (id.includes('-cyl')) { const wrapper = el.closest('.spinner-container'); wrapper.dataset.sign = '-'; wrapper.querySelector('.field-sign').textContent = '-'; }
    }
    for (const id of Object.keys(values)) {
      document.getElementById(id).dispatchEvent(new Event('input', { bubbles: true }));
      document.getElementById(id).dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  const expected = computePrescriptionCase({ age: 50, context: { simple: false, vaGood: false, precise: false, accurate: false, health: false, repeat: true, calm: false, rightQuality: 5, leftQuality: 10 }, currentRightEye: eye, currentLeftEye: eye, objectiveRightEye: objective, objectiveLeftEye: objective, currentAdd: NaN, objectiveAdd: NaN });
  const actual = await page.evaluate(() => {
    const value = id => { const el = document.getElementById(id); return el.value === '' ? null : Number(el.value) * (el.closest('.spinner-container').dataset.sign === '-' ? -1 : 1); };
    return { rightEye: { sph: value('output-re-sph'), cyl: value('output-re-cyl'), axis: value('output-re-axis') }, leftEye: { sph: value('output-le-sph'), cyl: value('output-le-cyl'), axis: value('output-le-axis') }, readingAdd: value('output-le-add') };
  });
  assert.deepEqual(actual, { rightEye: expected.rightEye, leftEye: expected.leftEye, readingAdd: expected.readingAdd }, 'UI sends explicit context and per-eye quality to the current pure engine');
  await capture('completed-advanced');
  await page.locator('#prescribing-rules summary').click();
  const rationale = await page.locator('#prescribing-rule-list').innerText();
  assert.ok(rationale.length > 60, 'Applied rules have readable explanations');
  assert.doesNotMatch(rationale, /\bW(?:\d+|A)_[A-Z_]+\b/, 'Internal rule IDs are resolved through the catalogue');
  assert.match(rationale, /before any weighting\. Quality/, 'Each applied rule description is a separate sentence');
  report.rationale = rationale;
  await page.locator('#prescribing-rule-list').scrollIntoViewIfNeeded();
  await capture('rules');
  await page.locator('#prescribing-rules summary').click();
  const readEntered = () => page.evaluate(() => Object.fromEntries([...document.querySelectorAll('main input[id^="current-"], main input[id^="objective-"]')].map(input => [input.id, input.value === '' ? null : Number(input.value) * (input.closest('.spinner-container').dataset.sign === '-' ? -1 : 1)])));
  const entered = await readEntered();
  for (let cycle = 0; cycle < 4; cycle++) {
    await page.locator('label.top-toggle-advanced').click();
    await page.locator('label.top-toggle-advanced').click();
  }
  assert.deepEqual(await readEntered(), entered, 'Repeated simple/advanced switches preserve the advanced entries');
  await page.locator('#transpose-btn').click();
  await page.locator('#transpose-btn').click();
  assert.deepEqual(await readEntered(), entered, 'Double transpose preserves all entered Rx components');
  report.modeSwitchCycles = 4;
  report.doubleTranspose = true;
  await page.locator('#info-icon').click();
  await page.evaluate(async () => { await Promise.all(document.getElementById('info-popup').getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {}))); });
  report.guide = await page.evaluate(() => {
    const popup = document.getElementById('info-popup'), footer = popup.querySelector('.info-version');
    const rect = popup.getBoundingClientRect(), f = footer.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, scrollHeight: popup.scrollHeight, clientHeight: popup.clientHeight, footerBottom: f.bottom, footerText: footer.textContent.trim(), visible: popup.getAttribute('aria-hidden') === 'false' };
  });
  assert.ok(report.guide.visible && report.guide.top >= 0 && report.guide.bottom <= 740 && report.guide.left >= 0 && report.guide.right <= 360, 'Guide fits the viewport');
  assert.ok(report.guide.scrollHeight <= report.guide.clientHeight + 1, 'Guide has no internal scrolling');
  assert.ok(report.guide.footerBottom <= report.guide.bottom, 'Guide footer remains visible');
  await page.screenshot({ path: path.join(evidence, `${label}-guide.png`) });
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#info-popup').getAttribute('aria-hidden'), 'true');
  await page.waitForFunction(() => document.activeElement.id === 'info-icon', null, { timeout: 1000 });
  assert.equal(await page.evaluate(() => document.activeElement.id), 'info-icon');
  const eventRenders = await page.evaluate(async () => {
    const countRenders = async update => {
      let renders = 0;
      const observer = new MutationObserver(records => { renders += records.filter(record => record.removedNodes.length > 0).length; });
      observer.observe(document.getElementById('prescribing-rule-list'), { childList: true });
      update();
      await new Promise(resolve => setTimeout(resolve, 0));
      observer.disconnect();
      return renders;
    };
    const both = await countRenders(() => {
      const input = document.getElementById('toggle-precise'); input.checked = true;
      input.dispatchEvent(new Event('input')); input.dispatchEvent(new Event('change'));
    });
    const changeOnly = await countRenders(() => {
      const input = document.getElementById('current-re-sph'); input.value = '1.25';
      input.dispatchEvent(new Event('change'));
    });
    return { both, changeOnly };
  });
  assert.deepEqual(eventRenders, { both: 1, changeOnly: 1 }, 'paired events recalculate once and legacy change-only helpers still recalculate');
  report.eventRenders = eventRenders;
  await page.locator('#measurement-quality summary').click();
  await page.locator('#quality-right').selectOption('0');
  assert.equal(await page.locator('#measurement-quality-state').innerText(), 'RE 0 · LE 10');
  await page.locator('#measurement-quality summary').click();
  await page.locator('#burger-icon').click();
  await page.locator('#new-case-button').click();
  await page.locator('#new-case-button').click();
  await page.waitForLoadState('load');
  for (const id of ['context-repeat', 'context-calm', 'quality-right', 'quality-left']) assert.equal(await page.locator(`#${id}`).inputValue(), '', 'case reset clears new context');
  assert.equal(await page.locator('#output-re-sph').inputValue(), '');
  assert.equal(await page.locator('#measurement-quality').getAttribute('open'), null);
  await capture('reset');
  report.errors = errors;
  report.fonts = await page.evaluate(() => [...document.fonts].map(font => ({ family: font.family, status: font.status })));
  report.engineParity = true;
  report.reset = 'new context and output cleared';
  const knownFileCors = error => label === 'file' && /blocked by CORS policy/.test(error) && /(?:inter-latin-400-800\.woff2|quicksand-latin-700\.woff2|mcq-controller\.js)/.test(error);
  const knownFileFailures = errors.filter(knownFileCors).length;
  const genericFileFailures = errors.filter(error => error === 'Failed to load resource: net::ERR_FAILED').length;
  if (label === 'file') assert.ok(genericFileFailures <= knownFileFailures, 'Unexpected direct-file resource failure');
  const coreErrors = errors.filter(error => !knownFileCors(error) && !(label === 'file' && knownFileFailures && error === 'Failed to load resource: net::ERR_FAILED'));
  report.fileLimitation = label === 'file' ? 'Font preload and separate MCQ module requests encounter browser CORS restrictions. Core bundled Rx UI works; service workers do not run on file pages. See recorded font statuses and console messages.' : null;
  assert.deepEqual(coreErrors, []);
  await context.close();
 }
} finally { await browser.close(); server.close(); }
await fs.writeFile(path.join(evidence, 'report.json'), JSON.stringify(review, null, 2));
console.log(JSON.stringify(review, null, 2));
