import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { MCQ_LEVELS, MCQ_SOURCE_REFERENCES } from '../src/mcq-data.js';
import { evaluateMcqAnswers } from '../src/mcq-engine.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(ROOT, path), 'utf8');
const html = read('index.html');
const css = read('style.css');
const serviceWorker = read('service-worker.js');

test('runtime styles and scripts do not depend on a CDN', () => {
  const runtimeTags = html.match(/<(?:script|link)\b[^>]*(?:src|href)=["'][^"']+["'][^>]*>/gi) || [];
  const remoteRuntimeTags = runtimeTags.filter((tag) => /https?:\/\//i.test(tag));
  assert.deepEqual(remoteRuntimeTags, []);
});

test('HTML IDs are unique and aria-controls targets exist', () => {
  const ids = Array.from(html.matchAll(/\bid=["']([^"']+)["']/gi), (match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'duplicate HTML ID found');
  const controls = Array.from(html.matchAll(/\baria-controls=["']([^"']+)["']/gi), (match) => match[1]);
  controls.forEach((id) => assert.ok(ids.includes(id), `missing aria-controls target: ${id}`));
});

test('compact assessment styling keeps neutral state and readable labels explicit', () => {
  const neutralOptions = html.match(/<option value="">&mdash;<\/option>/g) || [];
  assert.equal(neutralOptions.length, 7, 'age, acuity and safety controls should show a neutral marker');
  ['painStatus', 'pupilStatus', 'frontStatus', 'afferentStatus'].forEach((id) => {
    assert.match(html, new RegExp(`id="${id}"`), `${id} should be a deliberate status control`);
  });
  assert.match(html, /id="distance-va-label">Eye VA:/);
  assert.doesNotMatch(html, /<option value="unknown">/);
  const controller = read('src/cataract-controller.js');
  assert.match(controller, /Affected VA:/);
  assert.match(controller, /Worse VA:/);
  assert.match(controller, /afferentRecorded: Boolean\(afferentStatus\)/);
  assert.doesNotMatch(html, /class="button-label"><em>/);
  assert.match(css, /--radius-control: 8px;/);
  assert.match(css, /--radius-md: 10px;/);
  assert.match(css, /--radius-panel: 14px;/);
  assert.match(css, /\.history-row--three\s*\{[\s\S]*?grid-template-columns:[^;]*minmax\(0,[^;]*minmax\(0,[^;]*minmax\(0,/);
  assert.match(css, /@media \(max-width: 380px\)[\s\S]*?\.history-row--three\s*\{[\s\S]*?minmax\(82px, 0\.95fr\)[\s\S]*?minmax\(112px, 1\.2fr\)[\s\S]*?minmax\(86px, 0\.95fr\)/);
  assert.match(css, /@media \(max-width: 380px\)[\s\S]*?\.history-field--vision \.small-text\s*\{\s*display:\s*none;/);
  assert.match(css, /#ageBand\s*\{[\s\S]*?min-width:\s*60px;[\s\S]*?width:\s*60px;/);
  assert.match(html, /<strong>Eyes<\/strong>/);
  assert.match(html, /<strong>Pain\/red<\/strong>/);
  assert.match(html, /<strong>Age<\/strong>/);
  assert.match(html, /<option value="unable_test" class="child-va-option">Unable<\/option>/);
  assert.doesNotMatch(html, />No test<\/option>/);
});

test('younger-adult cataract prompt names practical causes', () => {
  const copy = read('src/cataract-copy.js');
  assert.match(copy, /Ask about trauma, steroids, diabetes and eye inflammation\./);
  assert.doesNotMatch(copy, /Check secondary causes\./);
});

test('assessment reset uses a deliberate two-step control', () => {
  assert.match(html, /id="new-assessment-button"/);
  const controller = read('src/cataract-controller.js');
  assert.match(controller, /Clear assessment\?/);
  assert.match(controller, /cataractForm\?\.reset\(\)/);
  assert.match(controller, /Assessment cleared\./);
  const bundle = read('app.bundle.js');
  assert.match(bundle, /Clear assessment\?/);
  assert.match(bundle, /Assessment cleared\./);
});

test('manifest is app-scoped and linked from the page', () => {
  assert.match(html, /rel="manifest" href="manifest\.webmanifest"/);
  const manifest = JSON.parse(read('manifest.webmanifest'));
  assert.equal(manifest.lang, 'en-GB');
  assert.equal(manifest.start_url, './index.html');
  assert.equal(manifest.scope, './');
  assert.equal(manifest.display, 'standalone');
});

test('every pre-cached app-shell asset exists', () => {
  const assets = Array.from(serviceWorker.matchAll(/'\.\/([^']*)'/g), (match) => match[1]);
  assets
    .filter(Boolean)
    .forEach((asset) => {
      const localPath = asset.split('?')[0];
      assert.ok(existsSync(resolve(ROOT, localPath)), `missing cached asset: ${asset}`);
    });
});

test('service worker cache cleanup is restricted to Cataract', () => {
  assert.match(serviceWorker, /const CACHE_PREFIX = 'arclight-cataract-';/);
  assert.match(serviceWorker, /key\.startsWith\(CACHE_PREFIX\)/);
  assert.doesNotMatch(serviceWorker, /caches\.delete\(key\)[\s\S]*filter\(\(key\) => key !== CACHE_NAME\)/);
});

test('UI stylesheet query and offline cache share one release identifier', () => {
  const releaseMatch = serviceWorker.match(/const RELEASE_VERSION = '([^']+)';/);
  assert.ok(releaseMatch, 'service worker release identifier is missing');
  assert.match(serviceWorker, /CACHE_NAME = `\$\{CACHE_PREFIX\}v1\.1-\$\{RELEASE_VERSION\}`/);
  assert.match(html, new RegExp(`style\\.css\\?v=${releaseMatch[1]}`));
  assert.match(html, new RegExp(`app\\.bundle\\.js\\?v=${releaseMatch[1]}`));
  assert.match(serviceWorker, new RegExp(`app\\.bundle\\.js\\?v=${releaseMatch[1]}`));
});

test('patient images are not implied by the interface or offline cache', () => {
  assert.doesNotMatch(html, /<input\b[^>]*type=["']file["']/i);
  assert.doesNotMatch(serviceWorker, /blob:/i);
});

test('MCQ banks retain valid, varied three-tier structure', () => {
  assert.deepEqual(MCQ_LEVELS.map((level) => level.name), ['Primary', 'Intermediate', 'Advanced']);
  const allIds = [];
  MCQ_LEVELS.forEach((level) => {
    assert.ok(level.questions.length > level.totalQuestions, `${level.name} needs retry variation`);
    assert.ok(level.passScore > level.totalQuestions / 2, `${level.name} pass mark must require a majority`);
    const prompts = level.questions.map((question) => question.prompt.trim().toLowerCase());
    assert.equal(new Set(prompts).size, prompts.length, `${level.name} contains a duplicate prompt`);
    level.questions.forEach((question) => {
      assert.equal(question.options.length, 4, `${level.name}: ${question.prompt}`);
      assert.equal(new Set(question.options).size, question.options.length, `${level.name}: duplicate option`);
      assert.ok(question.answerIndex >= 0 && question.answerIndex < question.options.length, `${level.name}: invalid answer`);
      assert.match(question.id, /^cataract-(primary|intermediate|advanced)-\d{2}$/);
      assert.ok(question.explanation.length >= 40, `${question.id}: explanation is too short`);
      assert.ok(MCQ_SOURCE_REFERENCES[question.source], `${question.id}: unknown source`);
      allIds.push(question.id);
    });
  });
  assert.equal(new Set(allIds).size, allIds.length, 'MCQ IDs must be unique');
});

test('MCQ quality fixes keep white reflex cautious and retries actionable', () => {
  const allQuestions = MCQ_LEVELS.flatMap((level) => level.questions);
  const whiteReflexQuestions = allQuestions.filter((question) => /white (?:pupil )?reflex/i.test(question.prompt));
  assert.ok(whiteReflexQuestions.length >= 2);
  whiteReflexQuestions.forEach((question) => {
    const correctAnswer = question.options[question.answerIndex];
    assert.doesNotMatch(correctAnswer, /proof|confirmed|mature cataract|priority surgery/i);
  });
  assert.doesNotMatch(allQuestions.map((question) => question.prompt).join('\n'), /unlocks when|section becomes/i);

  const timedAttempt = evaluateMcqAnswers(
    [{ answerIndex: 0 }, { answerIndex: 0 }],
    [0, null],
    true
  );
  assert.equal(timedAttempt.unansweredCount, 1);

  const controller = read('src/mcq-controller.js');
  assert.match(controller, /evaluation\.unansweredCount === 0/);
  assert.match(controller, /submitMcqButton\.textContent = passed \? 'New attempt' : 'Try again'/);
  assert.match(controller, /Why: \$\{question\.explanation\}/);
  assert.match(controller, /modalReturnFocus = burgerIcon/);
});

test('MCQ shell keeps result, touch targets and release assets aligned', () => {
  const mcqCss = read('mcq-ui.css');
  assert.ok(html.indexOf('id="mcqResult"') < html.indexOf('id="submitMcqButton"'));
  assert.match(mcqCss, /\.mcq-option\s*\{[\s\S]*?min-height:\s*var\(--tap-target-min\)/);
  assert.match(mcqCss, /\.mcq-explanation\s*\{/);
  const bundle = read('app.bundle.js');
  assert.match(bundle, /New attempt/);
  assert.match(bundle, /Review and retry/);
});
