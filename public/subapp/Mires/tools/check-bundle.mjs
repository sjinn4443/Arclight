import fs from 'node:fs/promises';
import { build } from 'esbuild';

const result = await build({
  entryPoints: ['app.js'],
  bundle: true, minify: true,
  format: 'iife',
  target: 'es2018',
  write: false,
  logLevel: 'silent'
});

const generated = Buffer.from(result.outputFiles[0].contents);
const committed = await fs.readFile('app.bundle.js');
if (!committed.equals(generated)) {
  throw new Error(
    'app.bundle.js differs from the current app.js source graph; run npm run build'
  );
}

console.log('Bundle parity passed.');
