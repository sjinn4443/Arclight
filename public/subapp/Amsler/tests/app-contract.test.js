import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

test("runtime has no CDN dependency", () => {
  const html = read("index.html");
  const css = read("styles.css");
  assert.doesNotMatch(html, /https?:\/\//i);
  assert.doesNotMatch(html, /<script[^>]*html2canvas/);
  assert.match(read("js/report.js"), /assets\/html2canvas\.min\.js/);
  assert.match(read("js/report.js"), /await loadReportCaptureLibrary\(\)/);
  assert.match(css, /assets\/fonts\/inter-latin-400-800\.woff2/);
});

test("document IDs are unique and ARIA control targets exist", () => {
  const html = read("index.html");
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  const targets = [...html.matchAll(/aria-controls="([^"]+)"/g)].map(
    (match) => match[1],
  );
  for (const target of targets)
    assert.ok(ids.includes(target), `Missing ARIA target: ${target}`);
});

test("manifest and scoped service worker contain the local shell", () => {
  const manifest = JSON.parse(read("manifest.webmanifest"));
  assert.equal(manifest.scope, "./");
  assert.equal(manifest.start_url, "./index.html");
  const worker = read("service-worker.js");
  assert.match(worker, /arclight-amsler-/);
  assert.match(worker, /assets\/html2canvas\.min\.js/);
  assert.doesNotMatch(
    worker,
    /caches\.keys\(\)[\s\S]*filter\(\(key\) => key !== CACHE_NAME/,
  );
});

test("MCQ runtime and the UI release assets use their current tokens", () => {
  const html = read("index.html");
  const worker = read("service-worker.js");
  assert.match(html, /styles\.css\?v=20260929-logic1/);
  assert.match(html, /app\.bundle\.js\?v=20261002-host1/);
  assert.match(worker, /arclight-amsler-v1\.1-20260929-logic1/);
  assert.match(worker, /styles\.css\?v=20260929-logic1/);
  assert.match(worker, /app\.bundle\.js\?v=20261002-host1/);
});

test("MCQ modal provides fail-safe completion, review and a real new attempt", () => {
  const html = read("index.html");
  const source = read("js/mcq.js");
  const css = read("styles.css");
  assert.match(html, /id="mcqFeedback"[^>]+tabindex="-1"/);
  assert.match(html, /id="mcqRestartBtn"[^>]*>New attempt</);
  assert.match(source, /Not submitted:/);
  assert.match(
    source,
    /\.find\(\(fieldset\) => !fieldset\.querySelector\("input:checked"\)\)/,
  );
  assert.match(source, /mcqFeedback\.focus\(\)/);
  assert.match(source, /questions = sampleLevelQuestions\(activeLevel\)/);
  assert.match(source, /itemFeedback[\s\S]*question\.explanation/);
  assert.match(
    css,
    /\.mcq-option-label\s*\{[\s\S]*min-height: var\(--tap-target-min\)/,
  );
});

test("assessment reset is separate from teaching achievement", () => {
  const html = read("index.html");
  const ui = read("js/ui.js");
  assert.match(html, /id="newAssessmentBtn"/);
  assert.match(ui, /Confirm new assessment/);
  assert.doesNotMatch(ui, /localStorage\.(clear|removeItem)/);
});

test("Compute remains the explicit analysis action and report guard remains", () => {
  assert.match(read("index.html"), /id="analyzeBtn"[^>]*>Compute</);
  assert.match(
    read("js/report.js"),
    /!app\.state\.lastAnalysisResults \|\| app\.state\.analysisDirty/,
  );
  assert.match(read("js/amsler-engine.js"), /<b>\$\{eye\}:<\/b> Not assessed/);
  assert.match(
    read("js/amsler-engine.js"),
    /<b>\$\{eye\}:<\/b> No marks recorded/,
  );
  assert.match(read("script.js"), /Results: Changes not computed\./);
});

test("app-bar information and patient controls use the fleet icon treatment", () => {
  const html = read("index.html");
  const css = read("styles.css");
  assert.match(html, /class="appbar-glyph-info"/);
  assert.doesNotMatch(html, /local-icon-info/);
  assert.match(
    html,
    /class="local-icon local-icon-user" aria-hidden="true"><\/span>/,
  );
  assert.match(css, /\.appbar-glyph-info::before[\s\S]*content: "i"/);
  assert.match(css, /\.local-icon-user::before[\s\S]*\.local-icon-user::after/);
});
