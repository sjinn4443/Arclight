#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const normaliseNewlines = (value) => value.replace(/\r\n/g, '\n');

const result = await build({
  entryPoints: ['script.js'],
  bundle: true, minify: true,
  format: 'iife',
  target: 'es2018',
  write: false,
  logLevel: 'silent'
});

assert.equal(result.outputFiles.length, 1, 'Expected one generated JavaScript bundle');

const generated = normaliseNewlines(result.outputFiles[0].text);
const committed = normaliseNewlines(
  fs.readFileSync(path.join(process.cwd(), 'app.bundle.js'), 'utf8')
);

assert.equal(
  committed,
  generated,
  'app.bundle.js does not exactly match the bundle generated from script.js'
);

console.log('Bundle parity test passed.');
