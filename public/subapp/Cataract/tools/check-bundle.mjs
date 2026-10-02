import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const bundlePath = resolve(root, 'app.bundle.js');
const result = await build({
  absWorkingDir: root,
  entryPoints: ['src/app.js'],
  bundle: true, minify: true,
  format: 'iife',
  target: 'es2018',
  outfile: bundlePath,
  logLevel: 'silent',
  write: false
});

assert.equal(result.outputFiles.length, 1, 'expected one generated bundle');
const currentBundle = await readFile(bundlePath);
assert.deepEqual(
  Buffer.from(result.outputFiles[0].contents),
  currentBundle,
  'app.bundle.js is stale; run npm run build'
);
console.log('Cataract bundle matches src/app.js.');
