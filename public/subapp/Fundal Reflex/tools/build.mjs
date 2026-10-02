import { build } from 'esbuild';

await build({
  entryPoints: ['script.js'],
  bundle: true,
  format: 'iife',
  target: 'es2018',
  outfile: 'app.bundle.js',
  minify: true,
  logLevel: 'warning',
});
