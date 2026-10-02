import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const root = path.resolve(import.meta.dirname, '..');
const normaliseNewlines = (value) => value.replace(/\r\n/g, '\n');

const result = await build({
  absWorkingDir: root,
  entryPoints: ['script.js'],
  bundle: true, minify: true,
  format: 'iife',
  target: 'es2018',
  write: false,
  logLevel: 'silent'
});

const generated = normaliseNewlines(Buffer.from(result.outputFiles[0].contents).toString('utf8'));
const committed = normaliseNewlines(fs.readFileSync(path.join(root, 'app.bundle.js'), 'utf8'));

assert.equal(
  generated,
  committed,
  'app.bundle.js is stale: run npm run build and commit the generated bundle'
);

console.log('Bundle parity passed.');
