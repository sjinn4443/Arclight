import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 360, height: 740 }, serviceWorkers: 'block' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.addInitScript(() => {
    const draw = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (...args) {
      if (this.canvas.id === 'fundusCanvas' && args[0] instanceof HTMLImageElement) {
        const matrix = this.getTransform();
        window.retinalMatrix = [matrix.a, matrix.d];
      }
      return draw.apply(this, args);
    };
  });
  await page.goto(process.env.DIABETIC_URL || 'http://127.0.0.1:8096/Diabetic/index.html');
  await page.waitForFunction(() => window.retinalMatrix);
  assert.deepEqual(await page.evaluate(() => window.retinalMatrix.map(Math.sign)), [1, 1]);
  await page.locator('#holoTab').click();
  await page.waitForFunction(() => window.retinalMatrix[0] < 0 && window.retinalMatrix[1] < 0);
  await page.locator('label:has(#eyeToggle)').click();
  await page.waitForFunction(() => window.retinalMatrix[0] > 0 && window.retinalMatrix[1] < 0);
  await page.locator('#arclightTab').click();
  await page.waitForFunction(() => window.retinalMatrix[0] < 0 && window.retinalMatrix[1] > 0);
  await page.locator('label:has(#eyeToggle)').click();
  await page.locator('#recordingSystemToggle').click();
  await page.locator('#clinicalMode').selectOption('holo-bio');
  await page.locator('#clinicalDilation').selectOption('no');
  await page.locator('#rightViewStatusSelect').selectOption('four-quadrants-clear');
  await page.locator('#holoTab').click();
  await page.locator('label[for="viewerDilationToggle"]').click();
  await page.locator('#arclightTab').click();
  assert.equal(await page.locator('#clinicalMode').inputValue(), 'holo-bio');
  assert.equal(await page.locator('#clinicalDilation').inputValue(), 'no');
  assert.equal(await page.locator('#rightViewStatusSelect').inputValue(), 'four-quadrants-clear');
  await page.locator('#leftViewStatusSelect').selectOption('disc-macula-clear');
  for (const eye of ['right', 'left']) {
    await page.locator(`details[data-eye="${eye}"] summary`).click();
    await page.locator(`input[name="finding-${eye}"][value="noReferableSignsSeen"]`).check();
  }
  assert.equal(await page.locator('#actionTitle').textContent(), 'Record both eyes');
  await page.locator('#rightDistanceVA').selectOption('6/6');
  await page.locator('#leftDistanceVA').selectOption('6/6');
  assert.equal(await page.locator('#actionTitle').textContent(), 'Routine (screening)');
  await page.locator('#rightViewStatusSelect').selectOption('ungradable');
  await page.locator('details[data-eye="right"] summary').click();
  await page.locator('input[name="finding-right"][value="nvd"]').check();
  assert.equal(await page.locator('#actionTitle').textContent(), 'Urgent (today)');
  assert.match(await page.locator('#actionLimitations').textContent(), /RE: limited view/);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await mkdir('output/playwright', { recursive: true });
  await page.screenshot({ path: 'output/playwright/diabetic-fixed-exam.png', fullPage: true });
  await page.reload();
  await page.locator('#infoButton').click();
  assert.equal(await page.locator('#infoPopup').evaluate(el => el.scrollHeight <= el.clientHeight + 1), true);
  await page.screenshot({ path: 'output/playwright/diabetic-fixed-guide.png' });
  await page.keyboard.press('Escape');
  await page.locator('#holoTab').click();
  await page.locator('label[for="viewerDilationToggle"]').click();
  await page.waitForFunction(() => window.retinalMatrix[0] < 0 && window.retinalMatrix[1] < 0);
  await page.screenshot({ path: 'output/playwright/diabetic-fixed-bio.png' });
  assert.deepEqual(errors, [], 'HTTP console must be clean');
  await page.goto(pathToFileURL(resolve('index.html')).href);
  await page.locator('#recordingSystemToggle').click();
  assert.equal(await page.locator('#clinicalDilation').inputValue(), '');
  assert.equal(await page.locator('#actionTitle').textContent(), 'Record both eyes');
  const unexpected = errors.filter(message => !message.includes('Access to font at') && message !== 'Failed to load resource: net::ERR_FAILED');
  assert.deepEqual(unexpected, []);
  console.log('PASS: DO/BIO and R/L matrices, teaching isolation, incomplete/normal/urgent paths, guide fit, no overflow and clean HTTP console. Direct-file controls work; local fonts are blocked by Chromium file-origin CORS.');
} finally { await browser.close(); }
