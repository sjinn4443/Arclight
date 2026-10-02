// Run separately with npm run browser:output-fit, not in the portable unit suite.
// Requires the neighbouring Morph/node_modules/playwright-core installation and
// local Windows Edge at the explicit executable path below, matching fleet reviews.
// Fixture values are written only to read-only outputs in a disposable browser page
// to measure rendering. They are not engine decisions, persisted patient inputs or
// clinical validation. The 360 x 740 viewport is temporary desktop emulation, not
// retained Codex browser state or physical-device acceptance.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '../../Morph/node_modules/playwright-core/index.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const evidence = path.join(root, 'output/playwright/context-20260930');
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 360, height: 740 } });
  await page.goto(pathToFileURL(path.join(root, 'index.html')).href);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('label.top-toggle-advanced').click();
  const report = await page.evaluate(() => {
    const context = document.createElement('canvas').getContext('2d');
    const fields = [...document.querySelectorAll('.results-section input')].filter(input => !input.id.includes('axis'));
    const values = Array.from({ length: 400 }, (_, index) => index / 4);
    const metrics = [];
    for (const input of fields) for (const sign of ['+', '-']) for (const value of values) {
      input.value = value.toFixed(2);
      const wrapper = input.closest('.spinner-container');
      wrapper.dataset.sign = sign; wrapper.dataset.empty = 'false';
      wrapper.querySelector('.field-sign').textContent = sign;
      const style = getComputedStyle(input), signStyle = getComputedStyle(wrapper.querySelector('.field-sign'));
      context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const textWidth = context.measureText(input.value).width;
      const width = input.getBoundingClientRect().width;
      const contentWidth = width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth);
      const textLeft = parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft) + (contentWidth - textWidth) / 2;
      const signRight = wrapper.querySelector('.field-sign').getBoundingClientRect().right - input.getBoundingClientRect().left;
      metrics.push({ id: input.id, value: sign + input.value, width, contentWidth, textWidth, textLeft, signRight, font: context.font, paddingLeft: style.paddingLeft, paddingRight: style.paddingRight, signLeft: signStyle.left, fits: textWidth <= contentWidth && signRight <= textLeft });
    }
    for (const [id, value, sign] of [['output-re-sph', '12.75', '+'], ['output-re-cyl', '0.50', '-'], ['output-le-sph', '19.75', '-'], ['output-le-cyl', '0.75', '-'], ['output-le-add', '2.50', '+']]) {
      const input = document.getElementById(id), wrapper = input.closest('.spinner-container');
      input.value = value; wrapper.dataset.sign = sign; wrapper.querySelector('.field-sign').textContent = sign;
    }
    return {
      viewport: { width: innerWidth, height: innerHeight }, samples: metrics.length,
      smallestSpareWidth: Math.min(...metrics.map(metric => metric.contentWidth - metric.textWidth)),
      smallestSignGap: Math.min(...metrics.map(metric => metric.textLeft - metric.signRight)),
      representative: metrics.filter(metric => ['+0.50', '-0.75', '+12.75', '-19.75', '+20.00', '-99.75'].includes(metric.value)),
      failures: metrics.filter(metric => !metric.fits)
    };
  });
  await page.locator('.results-section').screenshot({ path: path.join(evidence, 'output-fit.png') });
  await fs.writeFile(path.join(evidence, 'output-fit.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ samples: report.samples, smallestSpareWidth: report.smallestSpareWidth, smallestSignGap: report.smallestSignGap, failures: report.failures }, null, 2));
  assert.deepEqual(report.failures, [], 'Every quarter-step signed output magnitude through 99.75 must fit');
} finally { await browser.close(); }
