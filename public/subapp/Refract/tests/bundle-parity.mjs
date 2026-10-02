import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const root = path.resolve(import.meta.dirname, '..');
const normaliseNewlines = (value) => value.replace(/\r\n/g, '\n');

const result = await build({
  absWorkingDir: root,
  entryPoints: ['scripts.js'],
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

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.match(
  html,
  /<script src="mcq\.bundle\.js\?[^"]+"><\/script>/,
  'MCQ must remain a separate classic bundle outside the core bundle for direct-file use'
);

const quizBuild = await build({
  absWorkingDir: root, entryPoints: ['src/mcq-controller.js'], bundle: true, minify: true,
  format: 'iife', target: 'es2018', write: false, logLevel: 'silent'
});
assert.equal(
  normaliseNewlines(Buffer.from(quizBuild.outputFiles[0].contents).toString('utf8')),
  normaliseNewlines(fs.readFileSync(path.join(root, 'mcq.bundle.js'), 'utf8')),
  'mcq.bundle.js is stale: run npm run build'
);

console.log('Bundle parity passed.');
