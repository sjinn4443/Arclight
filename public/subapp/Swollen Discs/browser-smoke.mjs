import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const baseURL = process.env.SWOLLEN_DISCS_BASE_URL || 'http://127.0.0.1:8770';
const output = path.resolve('output', 'playwright');
const executablePath =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ executablePath, headless: true });
const context = await browser.newContext({
  viewport: { width: 360, height: 740 },
  serviceWorkers: 'allow'
});
const page = await context.newPage();
page.setDefaultTimeout(5000);
const errors = [];
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(`console: ${message.text()}`);
});
page.on('pageerror', (error) => errors.push(`page: ${error.message}`));

async function settle() {
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(700);
}

try {
  await page.goto(`${baseURL}/index.html`, { waitUntil: 'networkidle' });
  await settle();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 360);
  assert.equal(
    await page.locator('.condition-button.active').getAttribute('data-condition'),
    'normal'
  );
  await page.screenshot({
    path: path.join(output, 'swollen-discs-360x740-untouched.png'),
    fullPage: true
  });
  console.log('checkpoint: untouched');

  await page.locator('[data-condition="swollen"]').click();
  await page.locator('#fovToggle').fill('0');
  await page.locator('#fovToggle').dispatchEvent('input');
  await page.locator('#cataractSlider').fill('3');
  await page.locator('#cataractSlider').dispatchEvent('input');
  await page.locator('#eyeToggle').evaluate((input) => {
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await settle();
  assert.equal(
    await page.locator('.condition-button.active').getAttribute('data-condition'),
    'swollen'
  );
  assert.equal(await page.locator('#fovToggle').inputValue(), '0');
  assert.equal(await page.locator('#cataractSlider').inputValue(), '3');
  assert.equal(await page.locator('#eyeToggle').isChecked(), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 360);
  await page.screenshot({
    path: path.join(output, 'swollen-discs-360x740-dense.png'),
    fullPage: true
  });
  console.log('checkpoint: dense');

  await page.locator('#burger-icon').click();
  await page.waitForTimeout(300);
  assert.equal(await page.locator('#sideMenu').getAttribute('aria-hidden'), 'false');
  await page.screenshot({
    path: path.join(output, 'swollen-discs-360x740-transient.png'),
    fullPage: true
  });
  console.log('checkpoint: transient');

  const reset = page.locator('#newSessionButton');
  await reset.scrollIntoViewIfNeeded();
  await reset.click();
  assert.equal(await reset.textContent(), 'Press again to reset');
  await page.screenshot({
    path: path.join(output, 'swollen-discs-360x740-reset-confirmation.png'),
    fullPage: true
  });
  await Promise.all([page.waitForLoadState('domcontentloaded'), reset.click()]);
  await settle();
  assert.equal(
    await page.locator('.condition-button.active').getAttribute('data-condition'),
    'normal'
  );
  assert.equal(await page.locator('#fovToggle').inputValue(), '1');
  assert.equal(await page.locator('#cataractSlider').inputValue(), '0');
  assert.equal(await page.locator('#eyeToggle').isChecked(), false);
  await page.screenshot({
    path: path.join(output, 'swollen-discs-360x740-reset.png'),
    fullPage: true
  });
  console.log('checkpoint: reset');

  await page.locator('#burger-icon').click();
  await page.locator('.mcq-level-button[data-level-index="0"]').click();
  await page.waitForTimeout(200);
  assert.equal(await page.locator('#testModal').getAttribute('aria-hidden'), 'false');
  assert.equal(await page.locator('#testModalTitle').textContent(), 'Primary MCQ');
  assert.match(await page.locator('#mcqTimer').textContent(), /Pass mark 3\/4 · Untimed/);

  await page.locator('#submitTestButton').click();
  assert.match(await page.locator('#testResult').textContent(), /answer all questions/i);

  const mcqQuestions = page.locator('#testContainer .question');
  assert.equal(await mcqQuestions.count(), 4);
  for (let index = 0; index < 4; index += 1) {
    await mcqQuestions.nth(index).locator('input[type="radio"]').first().check();
  }
  await page.locator('#submitTestButton').click();
  assert.equal(await page.locator('.answer-explanation:not([hidden])').count(), 4);
  assert.equal(await page.locator('#retryTestButton').isVisible(), true);
  assert.equal(await page.locator('#saveResultButton').isVisible(), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 360);
  await page.screenshot({
    path: path.join(output, 'swollen-discs-mcq-primary-review-360x740.png')
  });
  console.log('checkpoint: mcq review');

  await page.locator('#retryTestButton').click();
  assert.equal(await page.locator('#testResult').textContent(), '');
  assert.equal(await page.locator('#testContainer input:checked').count(), 0);
  assert.equal(await page.locator('#submitTestButton').isVisible(), true);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(100);
  assert.equal(await page.locator('#testModal').getAttribute('aria-hidden'), 'true');
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'burger-icon');

  await page.reload({ waitUntil: 'networkidle' });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  assert.equal(await page.title(), 'Swollen Discs');
  await context.setOffline(false);
  assert.deepEqual(errors, [], `Browser errors:\n${errors.join('\n')}`);

  const directContext = await browser.newContext({ viewport: { width: 360, height: 740 } });
  const directPage = await directContext.newPage();
  await directPage.goto(pathToFileURL(path.resolve('index.html')).href, { waitUntil: 'load' });
  await directPage.waitForTimeout(500);
  assert.equal(await directPage.title(), 'Swollen Discs');
  assert.equal(await directPage.locator('#fundusCanvas').count(), 1);
  await directContext.close();

  console.log(
    JSON.stringify({
      viewport: '360x740',
      screenshots: 6,
      dense: true,
      transient: true,
      reset: true,
      mcqReview: true,
      mcqRetry: true,
      mcqFocusReturn: true,
      offlineReload: true,
      directFile: true
    })
  );
} finally {
  await browser.close();
}
