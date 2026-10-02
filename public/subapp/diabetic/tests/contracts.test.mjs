import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { evaluateMcqAttempt, validateMcqBanks } from '../src/mcq.js';
import { MCQ_BANKS, MCQ_LEVEL_META, MCQ_SOURCE_REFERENCES } from '../src/mcq-data.js';
import { canRegisterServiceWorker } from '../src/pwa.js';

const root = resolve(import.meta.dirname, '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

test('MCQ banks preserve counts and valid answers', () => {
  for (const result of validateMcqBanks()) {
    assert.equal(result.actual, result.expected);
    assert.equal(result.invalidAnswers, 0);
    assert.equal(result.invalidQuestions, 0);
  }
  assert.deepEqual(
    Object.values(MCQ_LEVEL_META).map(({ questionCount, passMark }) => [questionCount, passMark]),
    [[5, 3], [6, 4], [8, 6]]
  );
});

test('MCQ banks carry review metadata and one unambiguous answer', () => {
  const ids = [];
  const prompts = [];
  for (const questions of Object.values(MCQ_BANKS)) {
    for (const question of questions) {
      ids.push(question.id);
      prompts.push(question.question.trim().toLocaleLowerCase());
      assert.ok(question.explanation.length >= 30);
      assert.ok(MCQ_SOURCE_REFERENCES[question.source]);
      assert.equal(
        new Set(question.options.map(option => option.trim().toLocaleLowerCase())).size,
        question.options.length
      );
      assert.ok(question.answer >= 0 && question.answer < question.options.length);
    }
  }
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(prompts).size, prompts.length);
  assert.match(MCQ_BANKS.primary[2].question, /earliest visible sign/);
  assert.equal(MCQ_BANKS.primary[2].options[MCQ_BANKS.primary[2].answer], 'Microaneurysms');
  assert.doesNotMatch(MCQ_BANKS.advanced[22].options.join(' '), /Routine \(weeks\) or Soon/);
});

test('MCQ attempts cannot pass until every question is answered', () => {
  const questions = [
    { answer: 0, topic: 'one' },
    { answer: 1, topic: 'two' },
    { answer: 2, topic: 'three' }
  ];
  assert.deepEqual(
    evaluateMcqAttempt(questions, [0, 1, null], 2),
    {
      isComplete: false,
      score: 2,
      passed: false,
      missedTopics: ['three']
    }
  );
  assert.equal(evaluateMcqAttempt(questions, [0, 1, 2], 2).passed, true);
});

test('HTML IDs and ARIA references are valid', () => {
  const html = read('index.html');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  const references = [...html.matchAll(/\b(?:aria-controls|aria-labelledby|aria-describedby)="([^"]+)"/g)]
    .flatMap(match => match[1].split(/\s+/));
  assert.deepEqual(references.filter(reference => !ids.includes(reference)), []);
});

test('runtime has local assets and an app-scoped offline shell', () => {
  const html = read('index.html');
  assert.doesNotMatch(html, /https?:\/\//i);
  assert.match(html, /manifest\.webmanifest/);
  assert.ok(existsSync(resolve(root, 'manifest.webmanifest')));
  const worker = read('sw.js');
  assert.match(worker, /arclight-diabetic-/);
  assert.doesNotMatch(worker, /caches\.keys\(\)[\s\S]*filter\(key => key !== CACHE_NAME\)/);
});

test('service worker registration is HTTP-only', () => {
  const supported = { serviceWorker: {} };
  assert.equal(canRegisterServiceWorker({ protocol: 'https:' }, supported), true);
  assert.equal(canRegisterServiceWorker({ protocol: 'http:' }, supported), true);
  assert.equal(canRegisterServiceWorker({ protocol: 'file:' }, supported), false);
});

test('runtime bundle contains the current v1.1 feature markers', () => {
  const bundle = read('app.bundle.js');
  assert.match(bundle, /Confirm new assessment/);
  assert.match(bundle, /serviceWorker\.register\("\.\/sw\.js"/);
  assert.match(bundle, /Try again/);
  assert.match(bundle, /Why:/);
  assert.match(read('script.js'), /returnFocus: \$\('#menuButton'\)/);
});

test('runtime bundle and UI release assets use their current tokens', () => {
  assert.match(read('index.html'), /styles\.css\?v=20260929-engine1/);
  assert.match(read('index.html'), /app\.bundle\.js\?v=20260929-engine1/);
  const worker = read('sw.js');
  assert.match(worker, /v1\.1-20260929-engine1/);
  assert.match(worker, /styles\.css\?v=20260929-engine1/);
  assert.match(worker, /app\.bundle\.js\?v=20260929-engine1/);
});

test('initial viewer load does not prefetch adjacent full-resolution cases', () => {
  const source = read('script.js');
  const initBody = source.match(/function init\(\) \{([\s\S]*?)\n\}/)?.[1] || '';
  assert.doesNotMatch(initBody, /prefetchViewerImages\(\)/);
  assert.match(source, /function setViewerCase\(index\)[\s\S]*?prefetchViewerImages\(\)/);
});

test('finding explanations update locally without rerunning the clinical render', () => {
  const source = read('script.js');
  const handler = source.match(/detailToggle\.addEventListener\('click', \(\) => \{([\s\S]*?)\n\s*\}\);/);
  assert.ok(handler, 'finding explanation click handler is missing');
  assert.match(handler[1], /toggleFindingDetail\(detailToggle, detailKey\)/);
  assert.doesNotMatch(handler[1], /\brender\(\)/);
  assert.doesNotMatch(read('styles.css'), /advanced-dock-toggle|viewer-advanced-panel/);
});
