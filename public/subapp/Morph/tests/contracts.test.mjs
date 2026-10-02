import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const viewerLogic = await readFile(path.join(root, 'viewer-logic.js'), 'utf8');
const sw = await readFile(path.join(root, 'service-worker.js'), 'utf8');
const manifest = JSON.parse(await readFile(path.join(root, 'manifest.webmanifest'), 'utf8'));

test('document identifiers and accessibility references are valid', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'IDs must be unique');
  for (const [, attribute, values] of html.matchAll(/\b(aria-controls|aria-labelledby)="([^"]+)"/g)) {
    for (const value of values.split(/\s+/)) assert.ok(ids.includes(value), `${attribute} must reference #${value}`);
  }
});

test('normal runtime has no remote script, stylesheet, image or font dependency', () => {
  const runtimeUrls = [...html.matchAll(/\b(?:src|href)="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(runtimeUrls.filter((url) => /^https?:\/\//i.test(url)).length, 0);
});

test('inline viewer script parses and preserves core teaching contracts', () => {
  const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.ok(blocks.length, 'Expected the inline viewer engine');
  assert.doesNotThrow(() => new Function(blocks.at(-1)[1]));
  for (const marker of ['CATARACT_PRESETS', 'VIEWER_BASE_SCALE = 1.2', '5: 38', '8: 48', '15: 68', '25: 92', '35: 114', '45: 136']) {
    assert.ok(`${html}\n${viewerLogic}`.includes(marker), `Missing viewer contract: ${marker}`);
  }
  for (const label of ['+++', '++', '0', '--', '---']) assert.ok(html.includes(label), `Missing Rx control ${label}`);
});

test('teaching image assets remain present', async () => {
  for (const name of ['morph.webp', 'ret180.webp', 'S.webp', 'C.webp', 'crvo.webp', 'zyx.webp']) {
    await access(path.join(root, 'assets', 'images', name));
  }
});

test('manifest and scoped offline shell cover the app assets', () => {
  assert.equal(manifest.start_url, './index.html');
  assert.equal(manifest.scope, './');
  assert.match(sw, /PREFIX='arclight-morph'/);
  assert.ok(sw.includes('./viewer-logic.js'));
  for (const name of ['morph.webp', 'ret180.webp', 'S.webp', 'C.webp', 'crvo.webp', 'zyx.webp']) assert.ok(sw.includes(`./assets/images/${name}`));
});

test('full-session reset is deliberate and two-step', () => {
  assert.match(html, /newSessionButton\.dataset\.confirm/);
  assert.match(html, /Press again to reset/);
  assert.match(html, /location\.reload\(\)/);
});

test('Cup remains tied to completing every simulator condition without an MCQ', () => {
  assert.doesNotMatch(html, /\bmcq-level-button\b/i);
  assert.match(html, /id="cupAchievement"[\s\S]*data-cup-mode="conditions"/);
  assert.match(html, /data-cup-target-selector="\.condition-button"/);
  const conditionNames = [...html.matchAll(/class="condition-button[^"]*"[\s\S]*?data-condition-name="([^"]+)"/g)]
    .map((match) => match[1]);
  assert.deepEqual(conditionNames, ['Normal', 'Swollen disc', 'Cupped disc', 'CRVO', 'AMD']);
  assert.equal(new Set(conditionNames).size, conditionNames.length);
});
