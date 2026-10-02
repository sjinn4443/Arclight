import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const galleryDir = path.dirname(fileURLToPath(import.meta.url));
const parentDir = path.dirname(galleryDir);
const manifestPath = path.join(galleryDir, "apps.json");
const indexPath = path.join(galleryDir, "index.html");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const html = fs.readFileSync(indexPath, "utf8");
const errors = [];

if (manifest.appCount !== manifest.apps.length) {
  errors.push(`appCount is ${manifest.appCount}, but apps contains ${manifest.apps.length} entries`);
}

if (manifest.apps.length !== 15) {
  errors.push(`expected 15 apps, found ${manifest.apps.length}`);
}

const unique = (values) => new Set(values).size === values.length;
if (!unique(manifest.apps.map((app) => app.title))) errors.push("app titles are not unique");
if (!unique(manifest.apps.map((app) => app.slug))) errors.push("app slugs are not unique");
if (!unique(manifest.apps.map((app) => app.entry))) errors.push("app entry paths are not unique");
if (!unique(manifest.apps.map((app) => app.thumbnail))) errors.push("thumbnail paths are not unique");

const cardCount = (html.match(/class="app-card"/g) || []).length;
if (cardCount !== manifest.apps.length) {
  errors.push(`index.html contains ${cardCount} cards for ${manifest.apps.length} manifest apps`);
}

for (const app of manifest.apps) {
  const entryPath = path.resolve(galleryDir, app.entry);
  const thumbnailPath = path.resolve(galleryDir, app.thumbnail);

  if (!entryPath.startsWith(`${parentDir}${path.sep}`) || !fs.existsSync(entryPath)) {
    errors.push(`${app.title}: missing or out-of-scope entry ${app.entry}`);
  }

  if (!thumbnailPath.startsWith(`${galleryDir}${path.sep}`) || !fs.existsSync(thumbnailPath)) {
    errors.push(`${app.title}: missing or out-of-scope thumbnail ${app.thumbnail}`);
  }

  const requiredHtml = [
    `data-app="${app.title}"`,
    `href="${app.entry}"`,
    `src="${app.thumbnail}"`,
    `<h2>${app.title}</h2>`,
    app.description
  ];

  for (const token of requiredHtml) {
    if (!html.includes(token)) {
      errors.push(`${app.title}: index.html is missing ${JSON.stringify(token)}`);
    }
  }
}

if (errors.length) {
  console.error(`Gallery verification failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Gallery verification passed: ${manifest.apps.length} apps, entries, cards and thumbnails are in sync.`);
