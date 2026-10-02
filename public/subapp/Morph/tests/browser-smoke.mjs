import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const baseURL = process.env.MORPH_BASE_URL || 'http://127.0.0.1:8769';
const output = path.resolve('output', 'playwright');
await mkdir(output, { recursive: true });
const executablePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await chromium.launch({ executablePath, headless: true });
const context = await browser.newContext({ viewport: { width: 360, height: 740 }, serviceWorkers: 'allow' });
const page = await context.newPage();
await page.addInitScript(() => localStorage.clear());
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
page.on('pageerror', (error) => errors.push(`page: ${error.message}`));

async function settled() {
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(700);
}

try {
  await page.goto(`${baseURL}/index.html`, { waitUntil: 'networkidle' });
  await settled();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 360, 'page must not overflow horizontally');
  await page.screenshot({ path: path.join(output, 'morph-360x740-untouched.png'), fullPage: true });

  const controls = await page.locator('button, input, select').evaluateAll((nodes) => nodes.map((node) => ({ tag: node.tagName, id: node.id, text: node.textContent?.trim(), value: node.value, aria: node.getAttribute('aria-label') })));
  const cataract = page.locator('input[type="range"]').first();
  await cataract.fill('3');
  await cataract.dispatchEvent('input');
  const field45 = page.getByRole('button', { name: /45/ }).first();
  if (await field45.count()) await field45.click();
  const rxMinus = page.getByRole('button', { name: '---', exact: true }).first();
  if (await rxMinus.count()) await rxMinus.click();
  const select = page.locator('select').first();
  if (await select.count()) {
    const options = await select.locator('option').evaluateAll((nodes) => nodes.map((node) => node.value));
    const target = options.find((value) => /crvo/i.test(value)) || options.at(-1);
    await select.selectOption(target);
  }
  const child = page.getByRole('button', { name: /child/i }).first();
  if (await child.count()) await child.click();
  await settled();
  assert.equal(await cataract.inputValue(), '3');
  assert.equal(await page.locator('.fov-button.active').getAttribute('data-degree'), '45');
  assert.equal(await select.locator('option:checked').getAttribute('data-condition-name'), 'CRVO');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 360, 'dense state must not overflow horizontally');
  await page.screenshot({ path: path.join(output, 'morph-360x740-dense.png'), fullPage: true });

  const menuButton = page.locator('[aria-controls="sideMenu"]').first();
  await menuButton.click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(output, 'morph-360x740-transient.png'), fullPage: true });
  for (const name of ['Swollen disc', 'Cupped disc', 'CRVO', 'AMD']) {
    await page.getByRole('button', { name, exact: true }).click();
    await page.waitForTimeout(80);
    await page.locator('[aria-controls="sideMenu"]').first().click();
  }
  const cup = page.locator('#cupAchievement');
  assert.equal(await cup.getAttribute('aria-hidden'), 'false');
  assert.equal(await cup.evaluate((node) => node.classList.contains('is-unlocked')), true);
  assert.match(await page.locator('#cupAchievementLabel').textContent(), /unlocked/i);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 360);
  await page.screenshot({ path: path.join(output, 'morph-cup-unlocked-360x740.png'), fullPage: true });
  const reset = page.locator('#newSessionButton');
  await reset.click();
  await assert.doesNotReject(async () => assert.equal(await reset.textContent(), 'Press again to reset'));
  await Promise.all([page.waitForLoadState('domcontentloaded'), reset.click()]);
  await settled();
  assert.equal(await page.locator('#newSessionButton').count(), 1);

  await page.reload({ waitUntil: 'networkidle' });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  assert.equal(await page.title(), 'Morph');
  await context.setOffline(false);
  assert.deepEqual(errors, [], `browser errors:\n${errors.join('\n')}`);
  const directContext = await browser.newContext({ viewport: { width: 360, height: 740 } });
  const directPage = await directContext.newPage();
  await directPage.goto(pathToFileURL(path.resolve('index.html')).href, { waitUntil: 'load' });
  await directPage.waitForTimeout(500);
  assert.equal(await directPage.title(), 'Morph');
  assert.equal(await directPage.locator('#fundusCanvas').count(), 1);
  await directContext.close();
  console.log(JSON.stringify({ viewport: '360x740', screenshots: 4, offlineReload: true, resetReload: true, directFile: true, controlsObserved: controls.length }));
} finally {
  await browser.close();
}
