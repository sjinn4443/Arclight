import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("index.html");
const styles = read("styles.css");
const script = read("script.js");
const photoFileStore = read("photo-file-store.js");
const serviceWorker = read("service-worker.js");

test("hidden teaching cards load on demand and menu uses small derivatives", () => {
  for (const id of ["abcdeCardImage", "chaosCardImage"]) {
    const tag = html.match(new RegExp(`<img[^>]*id="${id}"[^>]*>`))[0];
    assert.doesNotMatch(tag, /\ssrc=/);
  }
  assert.match(html, /data-src="assets\/thumbnails\//);
  assert.match(
    script,
    /setMenuThumbnail\(image, getDermoscopyExampleImageSource/,
  );
  assert.match(script, /modalImage\.src = getAbcdeTeachingCardSource\(\)/);
  assert.match(script, /modalImage\.src = getChaosTeachingCardSource\(\)/);
});

test("HTML IDs and controlled targets remain valid", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual([...new Set(duplicates)], []);

  const idSet = new Set(ids);
  const controlledTargets = [
    ...html.matchAll(/\b(?:aria-controls|data-detail-target)="([^"]+)"/g),
  ].map((match) => match[1]);
  const missing = controlledTargets.filter((id) => !idSet.has(id));
  assert.deepEqual([...new Set(missing)], []);
});

test("runtime scripts, styles, manifest and icons are local files", () => {
  const resources = [
    ...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"/g),
  ]
    .map((match) => match[1].split("?")[0])
    .filter((resource) => !resource.startsWith("data:"));
  assert.ok(resources.length > 0);
  resources.forEach((resource) => {
    assert.ok(
      !/^https?:/i.test(resource),
      `external runtime resource: ${resource}`,
    );
    assert.ok(
      fs.existsSync(path.join(root, resource)),
      `missing runtime resource: ${resource}`,
    );
  });
});

test("capture previews use object URLs and original files rather than base64 conversion", () => {
  assert.match(photoFileStore, /createObjectURL\(file\)/);
  assert.match(photoFileStore, /revokeObjectURL\(/);
  assert.doesNotMatch(
    `${script}\n${photoFileStore}`,
    /readAsDataURL|new FileReader\(|\batob\(/,
  );
  assert.match(script, /\[entry\.file\]/);
});

test("release hardening controls and clinical status are present", () => {
  assert.match(html, /id="newAssessmentButton"/);
  assert.match(
    html,
    /id="generateReportButton"[\s\S]*?<svg class="generate-report-mark"[\s\S]*?<circle[\s\S]*?stroke="#e83c31"[\s\S]*?<text[\s\S]*?>R<\/text>/,
  );
  assert.match(
    styles,
    /\.generate-report-mark\s*\{[^}]*width:\s*22px;[^}]*height:\s*22px;/,
  );
  assert.doesNotMatch(styles, /\.generate-report-mark\s*\{[^}]*border:/);
  assert.match(html, /id="photoReadiness"/);
  assert.match(html, /application-version" content="1\.2"/);
  assert.match(html, /Independent clinical sign-off is still required/);
  assert.match(html, /NICE NG12/);
});

test("route tabs use compatible semantics and the initial reference uses an expandable preview asset", () => {
  assert.match(
    html,
    /<div class="button-row" role="tablist" aria-label="Assessment route">/,
  );
  assert.doesNotMatch(html, /<section class="button-row" role="tablist"/);
  assert.match(
    html,
    /id="referencePreview"[^>]*abcde-su-preview_light\.webp|src="assets\/images\/abcde-su-preview_light\.webp"[^>]*id="referencePreview"/,
  );
  assert.match(
    script,
    /full:\s*\{[\s\S]*?abcde-su_light\.webp[\s\S]*?abcde-su_dark\.webp/,
  );
  assert.match(script, /referenceImage\.dataset\.fullSrc/);
});

test("meaningful compact labels retain a legible mobile text floor", () => {
  assert.match(
    styles,
    /Keep meaningful control and teaching labels legible[\s\S]*?\.reference-menu-card small,[\s\S]*?\.lesion-check-heading,[\s\S]*?font-size:\s*12px;/,
  );
});

test("service worker precache contains every active WebP asset and app shell file", () => {
  const cachedPaths = new Set(
    [...serviceWorker.matchAll(/'\.\/([^']+)'/g)].map(
      (match) => match[1].split("?")[0],
    ),
  );
  [
    "index.html",
    "styles.css",
    "script.js",
    "photo-file-store.js",
    "referral-logic.js",
    "mcq-bank.js",
    "manifest.webmanifest",
    "favicon.svg",
  ].forEach((file) =>
    assert.ok(cachedPaths.has(file), `uncached app shell file: ${file}`),
  );

  const webpFiles = [];
  const visit = (directory) => {
    fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (entry.name.endsWith(".webp"))
        webpFiles.push(path.relative(root, absolute).replaceAll("\\", "/"));
    });
  };
  ["assets", "dermoscopy-examples", "variations"].forEach((directory) =>
    visit(path.join(root, directory)),
  );
  webpFiles.forEach((file) =>
    assert.ok(cachedPaths.has(file), `uncached WebP: ${file}`),
  );
});

test("versioned shell assets refresh from the network before cache fallback", () => {
  assert.match(
    serviceWorker,
    /if \(requestUrl\.search\)\s*\{[\s\S]*?fetch\(request\)[\s\S]*?matchAppCache\(request, \{ ignoreSearch: true \}\)/,
  );
});

test("service worker cleanup is restricted to Allan caches", () => {
  assert.match(
    serviceWorker,
    /key\.startsWith\(CACHE_PREFIX\)\s*&&\s*key\s*!==\s*CACHE_NAME/,
  );
  assert.doesNotMatch(
    serviceWorker,
    /keys\.filter\(key => key !== CACHE_NAME\)/,
  );
});

test("photo file lifecycle is isolated behind the tested local store", () => {
  assert.match(script, /ALLAN_PHOTO_FILE_STORE/);
  assert.match(photoFileStore, /URL|urlApi/);
  assert.match(photoFileStore, /createObjectURL\(file\)/);
  assert.match(photoFileStore, /revokeObjectURL\(/);
  assert.doesNotMatch(
    photoFileStore,
    /readAsDataURL|new FileReader\(|\batob\(/,
  );
});

test("location picker declares keyboard handling and does not close for internal menu scroll", () => {
  assert.match(script, /handleLocationPickerButtonKeydown/);
  assert.match(script, /handleLocationPickerMenuKeydown/);
  assert.match(script, /pickerMenu\?\.contains\(event\.target\)/);
});
