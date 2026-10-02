import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
await mkdir('output/playwright', { recursive: true });
try {
  for (const url of [process.env.MIRES_BASE_URL || 'http://127.0.0.1:8090/Mires/index.html', pathToFileURL(resolve('index.html')).href]) {
    const context = await browser.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true, serviceWorkers: 'block' });
    const page = await context.newPage();
    const exceptions = [], consoleErrors = [];
    page.on('pageerror', e => exceptions.push(e.message));
    page.on('console', e => { if (e.type() === 'error') consoleErrors.push(e.text()); });
    const set = (id, value) => page.locator(`#${id}`).evaluate((e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(value));
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    await set('jitterSlider', 0); await set('suddenSlider', 0); await set('driftSlider', 0);
    await page.locator('#resetControlsButton').click();
    await set('jitterSlider', 0); await set('suddenSlider', 0); await set('driftSlider', 0);
    for (const zoom of [1, 2, 0.5]) {
      await set('zoomSlider', zoom); await page.waitForTimeout(250);
      const centre = await page.evaluate(() => {
        const a = document.querySelector('#mires svg').getBoundingClientRect();
        const b = document.querySelector('#blueCircle').getBoundingClientRect();
        return [a.x + a.width / 2 - b.x - b.width / 2, a.y + a.height / 2 - b.y - b.height / 2];
      });
      assert.ok(centre.every(v => Math.abs(v) < 1), `Centred at zoom ${zoom}: ${centre}`);
    }
    await set('zoomSlider', 1);
    await page.locator('#newtonPanelToggle').click();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'newtonPanelClose');
    const translation = async () => Number((await page.locator('.semi-circle.top').getAttribute('transform')).match(/translate\(([-.\d]+)/)[1]);
    const before = await translation();
    await set('thicknessSlider', 20);
    assert.ok(Math.abs(await translation() - before + 5) < 0.001, 'Thickness refreshes geometry immediately');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#newtonPanel').evaluate(e => e.inert), true);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'newtonPanelToggle');
    await page.locator('#casePanelToggle').click();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'casePanelClose');
    const start = Number(await page.locator('#separationSlider').inputValue());
    await set('driftSlider', 5); await page.waitForTimeout(450);
    assert.ok(Number(await page.locator('#separationSlider').inputValue()) > start, 'Touch drift works');
    await set('driftSlider', 0);
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'casePanelToggle');
    await page.locator('#burger-icon').click();
    await page.locator('.mcq-level-button[data-level-index="0"]').click();
    await page.locator('#submitTestButton').click();
    assert.equal(await page.evaluate(() => document.activeElement.name), 'question-0');
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: `output/playwright/mires-fixed-${url.startsWith('file:') ? 'file' : 'http'}.png` });
    assert.deepEqual(exceptions, []);
    // Chromium file-origin font CORS restrictions are recorded, not hidden.
    console.log(JSON.stringify({ url, passed: true, exceptions, consoleErrors }));
    if (!url.startsWith('file:')) assert.deepEqual(consoleErrors, []);
    await context.close();
  }
} finally { await browser.close(); }
