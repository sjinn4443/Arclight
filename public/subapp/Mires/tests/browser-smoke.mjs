import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dir = 'output/playwright';
const baseURL = process.env.MIRES_BASE_URL || 'http://127.0.0.1:8768/index.html';
await mkdir(dir, { recursive: true });

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 360, height: 740 },
  serviceWorkers: 'allow',
});
const page = await context.newPage();
const errors = [];

page.on('console', message => {
  if (message.type() === 'error') errors.push(message.text());
});
page.on('pageerror', error => errors.push(error.message));

const readBox = selector =>
  page.locator(selector).evaluate(element => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      radius: style.borderRadius,
    };
  });

await page.goto(`${baseURL}?ui=20260726-mcq4`);
await page.evaluate(() => document.fonts.ready);
assert.deepEqual(
  await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]),
  [360, 360],
);
assert.equal(
  await page.locator('.info-symbol').evaluate(
    element => getComputedStyle(element).fontSize,
  ),
  '21px',
);

const stage = await readBox('#content');
const gameArea = await readBox('#gameArea');
const dock = await readBox('#controlDock');
const newtonToggle = await readBox('#newtonPanelToggle');
const variableToggle = await readBox('#casePanelToggle');
assert.deepEqual([stage.x, stage.width, stage.radius], [10, 340, '16px']);
assert.deepEqual(
  [gameArea.x, gameArea.y, gameArea.width, gameArea.height],
  [10, 74, 340, 656],
);
assert.deepEqual([dock.x, dock.width, dock.radius], [16, 328, '16px']);
assert.deepEqual(
  [
    newtonToggle.x,
    newtonToggle.width,
    newtonToggle.height,
    variableToggle.x - (newtonToggle.x + newtonToggle.width),
    variableToggle.width,
    variableToggle.height,
  ],
  [16, 159, 44, 10, 159, 44],
);
await page.screenshot({ path: `${dir}/untouched.png` });

await page.getByRole('button', { name: 'Toggle Newton IOP panel' }).click();
await page.waitForTimeout(300);
const newtonPanel = await readBox('#newtonPanel');
assert.deepEqual(
  [newtonPanel.x, newtonPanel.width, newtonPanel.radius],
  [10, 340, '16px'],
);
const newtonClose = await readBox('#newtonPanelClose');
const newtonPoint = await readBox('[data-newton-point="20"]');
const newtonGuess = await readBox('[data-newton-guess="very_below_20"]');
const newtonAction = await readBox('#newtonNewCaseButton');
assert.deepEqual(
  [
    newtonClose.width,
    newtonClose.height,
    newtonPoint.height,
    newtonGuess.height,
    newtonAction.height,
  ],
  [44, 44, 44, 44, 44],
);
assert.deepEqual(
  await page.locator('[data-newton-point="25"]').evaluate(element => {
    const style = getComputedStyle(element);
    return [style.borderTopWidth, style.boxShadow === 'none'];
  }),
  ['2px', false],
);
assert.equal(
  await page.locator('[data-newton-guess="exactly_25"]').evaluate(
    element => getComputedStyle(element).borderTopWidth,
  ),
  '1px',
);
assert.equal(
  await page.locator('#newtonPanel').evaluate(
    element => element.scrollHeight === element.clientHeight,
  ),
  true,
);
await page.locator('[data-newton-guess="exactly_20"]').click();
await page.getByRole('button', { name: 'Submit' }).click();
await page.screenshot({ path: `${dir}/completed.png` });

await page.getByRole('button', { name: 'Close Newton IOP panel' }).click();
await page.waitForTimeout(300);
await page.getByRole('button', { name: 'Advanced motion' }).click();
await page.getByRole('button', { name: 'Toggle Variable IOP panel' }).click();
await page.waitForTimeout(300);
const variablePanel = await readBox('#casePanel');
assert.deepEqual(
  [variablePanel.x, variablePanel.width, variablePanel.radius],
  [10, 340, '16px'],
);
await page.screenshot({ path: `${dir}/dense.png` });

await page.getByRole('button', { name: 'Open menu' }).click();
await page.locator('#sideMenu .mcq-level-button[data-level-index="0"]').click();
await page.locator('#submitTestButton').click();
assert.match(await page.locator('#testResult').textContent(), /answer all questions/i);
await page.locator('.question').evaluateAll((questions) => {
  questions.forEach((question) => question.querySelector('input[type="radio"]')?.click());
});
await page.locator('#submitTestButton').click();
assert.equal(await page.locator('.question-feedback').count(), 5);
assert.equal(await page.locator('#testResult').evaluate((node) => node === document.activeElement), true);
assert.ok(await page.locator('.options label').evaluateAll((labels) =>
  Math.min(...labels.map((label) => label.getBoundingClientRect().height)) >= 44
));
await page.screenshot({ path: `${dir}/mires-mcq-review-360x740.png` });
await page.getByRole('button', { name: 'New set' }).click();
assert.equal(await page.locator('.question').count(), 5);
assert.equal(await page.locator('.question input[type="radio"]').first().evaluate((node) => node === document.activeElement), true);
await page.keyboard.press('Escape');
assert.equal(await page.locator('#testModal').getAttribute('aria-hidden'), 'true');
assert.equal(await page.evaluate(() => document.activeElement?.tagName), 'BUTTON');
await page.getByRole('button', { name: 'Open menu' }).click();
await page.getByRole('button', { name: 'New training session' }).click();
assert.equal(
  await page.getByRole('button', { name: 'Press again to reset' }).count(),
  1,
);

await page.reload();
await context.setOffline(true);
await page.reload();
assert.equal(await page.title(), 'Mires');
await context.setOffline(false);

const filePage = await context.newPage();
const fileErrors = [];
filePage.on('console', message => {
  if (message.type() === 'error') fileErrors.push(message.text());
});
filePage.on('pageerror', error => fileErrors.push(error.message));
await filePage.goto(pathToFileURL(resolve('index.html')).href);
await filePage.evaluate(() => document.fonts.ready);
assert.equal(await filePage.title(), 'Mires');
assert.deepEqual(
  await filePage.evaluate(() => [document.documentElement.scrollWidth, innerWidth]),
  [360, 360],
);
assert.ok(fileErrors.length > 0);
assert.ok(
  fileErrors.every(message =>
    /font|woff2|ERR_FAILED|CORS policy/i.test(message),
  ),
);
await filePage.close();

assert.deepEqual(errors, []);
console.log(
  '360x740 hierarchy, untouched, completed, dense, transient, reset and offline states passed; direct-file layout passed with expected local-font CORS fallback',
);
await browser.close();
