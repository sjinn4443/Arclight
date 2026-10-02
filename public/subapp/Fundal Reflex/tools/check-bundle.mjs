import fs from 'node:fs/promises';
import { build } from 'esbuild';

const result = await build({
  entryPoints: ['script.js'],
  bundle: true,
  format: 'iife',
  target: 'es2018',
  minify: true,
  write: false,
  logLevel: 'silent',
});

const generated = Buffer.from(result.outputFiles[0].contents);
const committed = await fs.readFile('app.bundle.js');

if (!committed.equals(generated)) {
  throw new Error(
    'app.bundle.js differs from the current script.js source graph; run npm run build',
  );
}

console.log('Bundle parity passed.');
