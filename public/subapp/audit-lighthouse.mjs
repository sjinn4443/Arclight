#!/usr/bin/env node
import { createReadStream } from 'node:fs';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPORT_ROOT = path.join(ROOT, 'audit-reports', 'lighthouse');

const APPS = [
  { name: 'Allan', dir: 'Allan', entry: 'index.html' },
  { name: 'Amsler', dir: 'Amsler', entry: 'index.html' },
  { name: 'Cataract', dir: 'Cataract', entry: 'index.html' },
  { name: 'Diabetic', dir: 'Diabetic', entry: 'index.html' },
  { name: 'Fields', dir: 'Fields', entry: 'home.html' },
  { name: 'Fundal Reflex', dir: 'Fundal Reflex', entry: 'index.html' },
  { name: 'Glaucoma', dir: 'Glaucoma', entry: 'index.html' },
  { name: 'Mires', dir: 'Mires', entry: 'index.html' },
  { name: 'Morph', dir: 'Morph', entry: 'index.html' },
  { name: 'Refract', dir: 'Refract', entry: 'index.html' },
  { name: 'Sauron', dir: 'Sauron', entry: 'index.html' },
  { name: 'Squint', dir: 'Squint', entry: 'index.html' },
  { name: 'Swollen Discs', dir: 'Swollen Discs', entry: 'index.html' },
  { name: 'Trauma', dir: 'Trauma', entry: 'index.html' },
];

const MIME_TYPES = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.pdf', 'application/pdf'],
  ['.woff2', 'font/woff2'],
]);

function showHelp() {
  console.log(`
Usage:
  node audit-lighthouse.mjs
  node audit-lighthouse.mjs --app Sauron
  node audit-lighthouse.mjs --apps Allan,Sauron,Fields --format both
  node audit-lighthouse.mjs --desktop --format json

Options:
  --app <name>        Audit one app. Can be used more than once.
  --apps <list>       Comma-separated app names.
  --format <format>   html, json or both. Default: html.
  --desktop           Use Lighthouse desktop mode. Default: mobile.
  --port <number>     First local port. Default: 8900.
  --help              Show this help.

Reports are written to:
  audit-reports/lighthouse/<timestamp>/
`);
}

function parseArgs(argv) {
  const options = {
    appNames: [],
    format: 'html',
    mode: 'mobile',
    port: 8900,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }

    if (arg === '--desktop') {
      options.mode = 'desktop';
      continue;
    }

    if (arg === '--app') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error('--app needs an app name');
      }
      options.appNames.push(value);
      index += 1;
      continue;
    }

    if (arg === '--apps') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error('--apps needs a comma-separated list');
      }
      options.appNames.push(...value.split(',').map((item) => item.trim()).filter(Boolean));
      index += 1;
      continue;
    }

    if (arg === '--format') {
      const value = argv[index + 1];
      if (!['html', 'json', 'both'].includes(value)) {
        throw new Error('--format must be html, json or both');
      }
      options.format = value;
      index += 1;
      continue;
    }

    if (arg === '--port') {
      const value = Number(argv[index + 1]);
      if (!Number.isInteger(value) || value < 1024 || value > 65500) {
        throw new Error('--port must be a number between 1024 and 65500');
      }
      options.port = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function pickApps(appNames) {
  if (appNames.length === 0) {
    return APPS;
  }

  const wanted = appNames.map((name) => name.toLowerCase());
  const selected = APPS.filter((app) => wanted.includes(app.name.toLowerCase()));
  const found = selected.map((app) => app.name.toLowerCase());
  const missing = appNames.filter((name) => !found.includes(name.toLowerCase()));

  if (missing.length > 0) {
    throw new Error(`Unknown app name: ${missing.join(', ')}`);
  }

  return selected;
}

function createStaticServer(appRoot, entryFile) {
  return createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || '/', 'http://127.0.0.1');
      const requestPath = decodeURIComponent(requestUrl.pathname);
      const relativePath = requestPath === '/' ? entryFile : requestPath.replace(/^\/+/, '');
      const resolvedPath = path.resolve(appRoot, relativePath);

      if (!resolvedPath.startsWith(appRoot)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
      }

      const fileStat = await stat(resolvedPath);
      if (!fileStat.isFile()) {
        response.writeHead(404);
        response.end('Not found');
        return;
      }

      const extension = path.extname(resolvedPath).toLowerCase();
      response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': MIME_TYPES.get(extension) || 'application/octet-stream',
      });
      createReadStream(resolvedPath).pipe(response);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  });
}

function listen(server, port) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolve());
  });
}

function closeServer(server) {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      shell: process.platform === 'win32',
      stdio: ['ignore', 'inherit', 'inherit'],
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

async function runLighthouse({ app, mode, output, outputPath, port }) {
  const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const url = `http://127.0.0.1:${port}/${app.entry}`;
  const relativeOutputPath = path.relative(ROOT, outputPath).split(path.sep).join('/');
  const args = [
    '--yes',
    'lighthouse',
    url,
    '--quiet',
    '--only-categories=performance,accessibility,best-practices,seo',
    `--output=${output}`,
    `--output-path=${relativeOutputPath}`,
    '--chrome-flags=--headless=new',
  ];

  if (mode === 'desktop') {
    args.push('--preset=desktop');
  } else {
    args.push('--form-factor=mobile');
    args.push('--screenEmulation.mobile=true');
    args.push('--screenEmulation.width=360');
    args.push('--screenEmulation.height=740');
    args.push('--screenEmulation.deviceScaleFactor=3');
  }

  await runCommand(npxCommand, args);
}

async function readSummary(app, jsonPath) {
  try {
    const report = JSON.parse(await readFile(jsonPath, 'utf8'));
    const category = (key) => Math.round((report.categories?.[key]?.score ?? 0) * 100);
    return {
      app: app.name,
      performance: category('performance'),
      accessibility: category('accessibility'),
      bestPractices: category('best-practices'),
      seo: category('seo'),
    };
  } catch {
    return null;
  }
}

function toCsv(rows) {
  const header = ['App', 'Performance', 'Accessibility', 'Best practices', 'SEO'];
  const lines = rows.map((row) => [
    row.app,
    row.performance,
    row.accessibility,
    row.bestPractices,
    row.seo,
  ]);
  return [header, ...lines]
    .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    showHelp();
    return;
  }

  const selectedApps = pickApps(options.appNames);
  const reportDir = path.join(REPORT_ROOT, `${timestamp()}-${options.mode}`);
  await mkdir(reportDir, { recursive: true });

  const summaries = [];

  for (let index = 0; index < selectedApps.length; index += 1) {
    const app = selectedApps[index];
    const appRoot = path.resolve(ROOT, app.dir);
    const port = options.port + index;
    const server = createStaticServer(appRoot, app.entry);

    console.log(`\n${app.name}: serving ${app.entry} on http://127.0.0.1:${port}`);
    await listen(server, port);

    try {
      const slug = `${slugify(app.name)}-${options.mode}`;
      const htmlPath = path.join(reportDir, `${slug}.html`);
      const jsonPath = path.join(reportDir, `${slug}.json`);

      if (options.format === 'html' || options.format === 'both') {
        console.log(`${app.name}: writing HTML report`);
        await runLighthouse({ app, mode: options.mode, output: 'html', outputPath: htmlPath, port });
      }

      if (options.format === 'json' || options.format === 'both') {
        console.log(`${app.name}: writing JSON report`);
        await runLighthouse({ app, mode: options.mode, output: 'json', outputPath: jsonPath, port });
        const summary = await readSummary(app, jsonPath);
        if (summary) {
          summaries.push(summary);
        }
      }
    } finally {
      await closeServer(server);
    }
  }

  if (summaries.length > 0) {
    const summaryPath = path.join(reportDir, 'summary.csv');
    await writeFile(summaryPath, `${toCsv(summaries)}\n`, 'utf8');
    console.log(`\nSummary written to ${summaryPath}`);
  }

  console.log(`\nReports written to ${reportDir}`);
}

main().catch((error) => {
  console.error(`\nAudit failed: ${error.message}`);
  process.exitCode = 1;
});
