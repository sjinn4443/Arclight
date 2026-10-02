import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => readFile(path.join(root, name), 'utf8');

test('HTML IDs and ARIA references are valid', async () => {
  const html = await read('index.html');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  const idSet = new Set(ids);
  for (const match of html.matchAll(/\baria-(?:controls|labelledby|describedby)="([^"]+)"/g)) {
    for (const id of match[1].split(/\s+/)) assert.ok(idSet.has(id), `Missing ARIA target: ${id}`);
  }
});

test('runtime has no remote CDN dependency', async () => {
  assert.doesNotMatch(await read('index.html'), /(?:src|href)="https?:\/\//i);
});

test('manifest and scoped worker contracts are present', async () => {
  const manifest = JSON.parse(await read('manifest.webmanifest'));
  assert.equal(manifest.scope, './');
  assert.equal(manifest.start_url, './index.html');
  const worker = await read('service-worker.js');
  assert.match(worker, /arclight-discs/);
  assert.match(worker, /url\.origin !== self\.location\.origin/);
});

test('all configured case assets exist', async () => {
  const config = await read('src/viewer-config.js');
  const paths = [...config.matchAll(/'(assets\/images\/discs\/[^'?]+\.webp)/g)].map(match => match[1]);
  assert.equal(new Set(paths).size, 60);
  await Promise.all([...new Set(paths)].map(asset => access(path.join(root, asset))));
});

test('generated bundle is loaded and source remains the build entry', async () => {
  const html = await read('index.html');
  const pkg = JSON.parse(await read('package.json'));
  assert.match(html, /app\.bundle\.js\?v=20260929-engine1/);
  assert.match(pkg.scripts.build, /^esbuild script\.js /);
  await access(path.join(root, 'app.bundle.js'));
});

test('runtime bundle and UI release assets use their current tokens', async () => {
  const worker = await read('service-worker.js');
  assert.match(worker, /v1\.1-20260929-engine1/);
  assert.match(worker, /styles\.css\?v=20260929-engine1/);
  assert.match(worker, /app\.bundle\.js\?v=20260929-engine1/);
});

test('MCQ modal provides review rationales, retry and 44px option rows', async () => {
  const [html, source, css] = await Promise.all([
    read('index.html'),
    read('src/mcq.js'),
    read('styles.css')
  ]);
  assert.match(html, /id="mcqResult"[^>]+tabindex="-1"/);
  assert.match(html, /id="restartMcqButton"[^>]*>New attempt</);
  assert.match(source, /mcq-question-feedback/);
  assert.match(source, /question\.explanation/);
  assert.match(source, /elements\.restart\.addEventListener\('click', restart\)/);
  assert.match(source, /firstUnansweredIndex[\s\S]*\.focus\(\)/);
  assert.match(source, /elements\.result\.focus\(\)/);
  assert.match(css, /\.mcq-option\s*\{[\s\S]*min-height: 44px/);
});

test('finding explanations update locally without rerunning the clinical render', async () => {
  const source = await read('script.js');
  const handler = source.match(/detailToggle\.addEventListener\('click', \(\) => \{([\s\S]*?)\n\s*\}\);/);
  assert.ok(handler, 'finding explanation click handler is missing');
  assert.match(handler[1], /toggleFindingDetail\(detailToggle, detailKey\)/);
  assert.doesNotMatch(handler[1], /\brender\(\)/);
  assert.doesNotMatch(await read('styles.css'), /advanced-dock-toggle|viewer-advanced-panel/);
});
