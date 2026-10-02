import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 360, height: 740 }, hasTouch: true, serviceWorkers: 'block' });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', e => { if (e.type() === 'error') errors.push(e.text()); });
  await page.addInitScript(() => {
    const original = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (...args) {
      if (this.canvas.id === 'fundusCanvas') window.lastFundusTransform = [this.getTransform().a, this.getTransform().d];
      return original.apply(this, args);
    };
  });
  await page.goto('http://127.0.0.1:8090/Morph/index.html');
  await page.waitForTimeout(500);
  assert.ok((await page.evaluate(() => window.lastFundusTransform)).every(n => n > 0));
  await page.locator('[data-refractive="highMinus"]').click();
  await page.locator('[data-degree="45"]').click();
  await page.waitForTimeout(50);
  assert.ok((await page.evaluate(() => window.lastFundusTransform)).every(n => n < 0));
  assert.equal(await page.locator('[data-refractive="highMinus"]').isDisabled(), true);
  assert.equal(await page.locator('.refractive-button[aria-pressed="true"]').count(), 0);
  await page.locator('[data-degree="5"]').click();
  assert.equal(await page.locator('[data-refractive="highMinus"]').getAttribute('aria-pressed'), 'true');
  await page.locator('#cataractSlider').fill('3');
  assert.match(await page.evaluate(() => buildFundusFilter(getCataractVisualState())), /blur\(3.2px\).*contrast\(0.66\).*saturate\(0.46\)/);
  const box = await page.locator('#fundusCanvas').boundingBox();
  await page.mouse.move(box.x + 12, box.y + 12); await page.mouse.down(); await page.mouse.up();
  assert.equal(await page.evaluate(() => viewX >= getApertureRadius() && viewY >= getApertureRadius()), true);
  await page.locator('#info-icon').click();
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(() => document.querySelector('#infoModal').contains(document.activeElement)), true);
  assert.equal(await page.locator('#infoModalContent').evaluate(e => e.scrollHeight <= e.clientHeight + 1), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'info-icon');
  assert.equal(await page.locator('.fov-button,.refractive-button').evaluateAll(es => es.every(e => e.getBoundingClientRect().height >= 44)), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await mkdir('output/playwright', { recursive: true });
  await page.screenshot({ path: 'output/playwright/morph-fixed-360x740.png' });
  assert.deepEqual(errors, []);
  console.log('Morph optical orientation, Rx scope, mobile filtering, bounds, focus, hit heights and overflow checks passed.');
} finally { await browser.close(); }
