import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modulePath = process.env.ARCLIGHT_PLAYWRIGHT_MODULE || path.join(root, 'Mires/node_modules/playwright-core/index.mjs');
const { chromium } = await import(pathToFileURL(modulePath).href);
const browser = await chromium.launch({headless: true, executablePath: process.env.ARCLIGHT_BROWSER_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const base = process.env.ARCLIGHT_PREVIEW_BASE || (process.argv.includes('--staged')
  ? 'http://127.0.0.1:8090/output/developer-handover-20260930/Arclight%20App/'
  : 'http://127.0.0.1:8090/');
const destination = path.join(root, 'output/playwright/gallery-handover-20260930', process.argv.includes('--staged') ? 'staged' : '');
fs.mkdirSync(destination, {recursive: true});
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'gallery/apps.json'), 'utf8'));
const results = [];

async function capture(label, url, viewport, screenshot, gallery = false) {
  const context = await browser.newContext({viewport, deviceScaleFactor: 1, serviceWorkers: 'block'});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', message => {if (message.type() === 'error') errors.push(message.text());});
  await page.goto(url, {waitUntil: 'load'});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  if (gallery) {
    await page.locator('img').evaluateAll(async images => {
      images.forEach(image => image.loading = 'eager');
      await Promise.all(images.map(image => image.decode()));
    });
  }
  const state = await page.evaluate(() => ({
    title: document.title,
    width: innerWidth,
    height: innerHeight,
    overflow: document.documentElement.scrollWidth > innerWidth,
    cards: document.querySelectorAll('.app-card').length,
    images: [...document.querySelectorAll('.app-thumb img')].map(i => ({width: i.naturalWidth, height: i.naturalHeight})),
    links: [...document.querySelectorAll('.app-card')].map(a => a.getAttribute('href'))
  }));
  await page.screenshot({path: screenshot, fullPage: gallery, animations: 'disabled'});
  results.push({label, url, viewport, ...state, errors});
  await context.close();
}
try {
  if (process.argv.includes('--gallery')) {
    for (const viewport of [{width:360,height:740},{width:768,height:1024},{width:1366,height:900}]) {
      await capture(`gallery-http-${viewport.width}`, new URL('gallery/index.html?handover=20260930', base).href, viewport, path.join(destination, `gallery-http-${viewport.width}.png`), true);
    }
    await capture('gallery-file-360', pathToFileURL(path.join(root, 'gallery/index.html')).href, {width:360,height:740}, path.join(destination, 'gallery-file-360.png'), true);
    fs.copyFileSync(path.join(destination, 'gallery-http-1366.png'), path.join(root, 'gallery/contact-sheet.png'));
  } else {
    for (const app of manifest.apps) {
      const relative = 'gallery/' + app.entry;
      await capture(app.title, new URL(relative, base).href, {width:360,height:740}, path.join(destination, `${app.slug}.png`));
    }
  }
  fs.writeFileSync(path.join(destination, process.argv.includes('--gallery') ? 'gallery-results.json' : 'app-results.json'), JSON.stringify(results, null, 2));
  for (const result of results) {
    if (result.overflow || result.errors.length) throw new Error(`${result.label}: overflow or browser error`);
    if (process.argv.includes('--gallery') && (result.cards !== 15 || result.images.some(i => i.width !== 180 || i.height !== 370))) throw new Error(`${result.label}: incomplete catalogue`);
  }
  console.log(JSON.stringify(results.map(({label, overflow, errors, cards}) => ({label, overflow, errors, cards}))));
} finally { await browser.close(); }
