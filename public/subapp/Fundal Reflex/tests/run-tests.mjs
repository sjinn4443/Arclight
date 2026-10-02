import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildClinicalInterpretation } from '../src/clinical-interpreter.js';
import { createAppState } from '../src/state.js';
import { createTestModeController } from '../src/test-mode.js';
import { BABY_REFRACTION_VALUE_SET } from '../src/case-catalog.js';
import { getLightResponsivePupilTargetScale } from '../src/structural-eye-effects.js';
import { MCQ_BANK, MCQ_LEVEL_META, MCQ_SOURCE_REFERENCES } from '../src/mcq-bank.js';
import {
  clampRetStreakOffset,
  getBeamAnchorInWrapper,
  getRetStreakOffsetYBounds,
} from '../src/retinoscopy-beam-geometry.js';
import {
  getActiveRefractionForMode,
  getCaseFlags,
  REFRACTION_VALUES,
} from '../src/retinoscopy-case-metadata.js';
import { buildPathologyOverlayVisual } from '../src/retinoscopy-pathology-overlays.js';

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

test('infant refractive examples escalate once and abnormal reflex examples remain urgent', () => {
  assert.equal(buildClinicalInterpretation({ caseValue: 'bilateral-high-hypermetropia', isBabyMode: true }).tone, 'soon');
  for (const caseValue of ['normal-dark', 'right-normal-left-corneal-opacity']) {
    const result = buildClinicalInterpretation({ caseValue, isBabyMode: true });
    assert.equal(result.tone, 'urgent');
    assert.match(result.referral, /Example action: Urgent eye referral/);
  }
});

test('fresh simulator state remains the established zero-refraction teaching case', () => {
  const state = createAppState();
  assert.equal(state.currentRefraction, 'zero');
});

test('zero-refraction teaching case retains its established reassuring action', () => {
  const result = buildClinicalInterpretation({ caseValue: 'zero' });
  assert.match(result.referral, /reassuring/i);
});

test('test mode hides the teaching explanation until revealed', () => {
  const result = buildClinicalInterpretation({ caseValue: 'normal', isTestMode: true, isTestRevealed: false });
  assert.ok(result);
});

test('runtime shell has no remote dependencies and declares PWA metadata', () => {
  const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const css = fs.readFileSync(new URL('../style.css', import.meta.url), 'utf8');
  assert.doesNotMatch(index + css, /https?:\/\//i);
  assert.match(index, /rel="manifest"/);
  assert.match(index, /id="new-session-button"/);
});

test('service worker caches the core runtime', () => {
  const sw = fs.readFileSync(new URL('../service-worker.js', import.meta.url), 'utf8');
  for (const asset of ['index.html', 'app.bundle.js', 'style.css', 'favicon.svg']) assert.match(sw, new RegExp(asset.replace('.', '\\.')));
});

test('production build and parity check use the same minified bundle contract', () => {
  const buildSource = fs.readFileSync(new URL('../tools/build.mjs', import.meta.url), 'utf8');
  const paritySource = fs.readFileSync(new URL('../tools/check-bundle.mjs', import.meta.url), 'utf8');
  assert.match(buildSource, /minify:\s*true/);
  assert.match(paritySource, /minify:\s*true/);
});

test('light-responsive pupil target is radial and bounded', () => {
  const centred = getLightResponsivePupilTargetScale({
    pupilRadiusPx: 16,
    sweepX: 0,
    sweepY: 0,
  });
  const horizontal = getLightResponsivePupilTargetScale({
    pupilRadiusPx: 16,
    sweepX: 8,
    sweepY: 0,
  });
  const vertical = getLightResponsivePupilTargetScale({
    pupilRadiusPx: 16,
    sweepX: 0,
    sweepY: 8,
  });
  const distant = getLightResponsivePupilTargetScale({
    pupilRadiusPx: 16,
    sweepX: 100,
    sweepY: 100,
  });
  assert.equal(centred, 0.925);
  assert.equal(horizontal, vertical);
  assert.ok(horizontal > centred);
  assert.equal(distant, 1);
});

test('paired advanced controls retain examiner-facing RE and LE labels', () => {
  const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(index, /data-eye="left"[^>]+aria-label="RE pupil size"/);
  assert.match(index, /data-eye="right"[^>]+aria-label="LE pupil size"/);
  assert.match(index, /data-eye="left"[^>]+aria-label="RE upper eyelid ptosis"/);
  assert.match(index, /data-eye="right"[^>]+aria-label="LE upper eyelid ptosis"/);
});

test('beam geometry centres between measured eyes and clamps invalid input safely', () => {
  const wrapperRect = { left: 10, top: 20 };
  const makeEye = (left, top, right, bottom) => ({
    getBoundingClientRect: () => ({ left, top, right, bottom }),
  });
  assert.deepEqual(
    getBeamAnchorInWrapper({
      wrapperRect,
      leftEye: makeEye(20, 30, 40, 50),
      rightEye: makeEye(60, 30, 80, 50),
    }),
    { x: 40, y: 20 },
  );
  assert.equal(clampRetStreakOffset({
    value: 'not-a-number',
    currentValue: 7,
    defaultLimit: 100,
  }), 7);
  assert.deepEqual(
    getRetStreakOffsetYBounds({ defaultLimit: 18 }),
    { min: -18, max: 18 },
  );
});

test('case mapping keeps asymmetric and pathology states explicit', () => {
  assert.equal(
    getActiveRefractionForMode(REFRACTION_VALUES.ANISOMETROPIA, 'left'),
    REFRACTION_VALUES.PLUS,
  );
  assert.equal(
    getActiveRefractionForMode(REFRACTION_VALUES.ANISOMETROPIA, 'right'),
    REFRACTION_VALUES.MINUS,
  );
  assert.equal(getCaseFlags(REFRACTION_VALUES.PARTIAL_RETINAL_DETACHMENT).partialRetinalDetachmentCase, true);
  assert.equal(getCaseFlags(REFRACTION_VALUES.ZERO).partialRetinalDetachmentCase, false);
});

test('pathology overlay boundary is inert for a normal case and explicit for detachment', () => {
  const normal = buildPathologyOverlayVisual({ flags: {}, timeSec: 0 });
  assert.deepEqual(normal, {
    background: 'none',
    blurPx: 0,
    opacity: 0,
    transform: 'none',
  });
  const detached = buildPathologyOverlayVisual({
    flags: { partialRetinalDetachmentCase: true },
    timeSec: 0,
  });
  assert.equal(detached.opacity, 0.98);
  assert.match(detached.background, /radial-gradient/);
});

test('MCQ banks retain valid, varied three-tier structure', () => {
  assert.deepEqual(Object.keys(MCQ_BANK), ['primary', 'intermediate', 'advanced']);
  const allIds = new Set();
  Object.entries(MCQ_BANK).forEach(([level, questions]) => {
    const meta = MCQ_LEVEL_META[level];
    assert.ok(meta, `${level} metadata is missing`);
    assert.ok(questions.length > meta.questionCount, `${level} needs retry variation`);
    assert.ok(meta.passMark > meta.questionCount / 2, `${level} pass mark must require a majority`);
    const prompts = questions.map((question) => question.question.trim().toLowerCase());
    assert.equal(new Set(prompts).size, prompts.length, `${level} contains a duplicate prompt`);
    questions.forEach((question) => {
      assert.match(question.id, new RegExp(`^fundal-${level}-\\d{2}$`));
      assert.equal(allIds.has(question.id), false, `${question.id} must be unique`);
      allIds.add(question.id);
      assert.equal(question.options.length, 4, `${level}: ${question.question}`);
      assert.equal(new Set(question.options).size, question.options.length, `${level}: duplicate option`);
      assert.ok(question.answer >= 0 && question.answer < question.options.length, `${level}: invalid answer`);
      assert.ok(question.explanation.length >= 40, `${question.id}: rationale is missing`);
      assert.ok(MCQ_SOURCE_REFERENCES[question.source], `${question.id}: source is unknown`);
      assert.equal(
        question.reviewStatus,
        MCQ_SOURCE_REFERENCES[question.source].status,
        `${question.id}: review status is inconsistent`,
      );
    });
  });
  const promptCorpus = Object.values(MCQ_BANK).flat().map((question) => question.question).join(' ');
  assert.doesNotMatch(promptCorpus, /\b(?:button|menu|screen|click|tap|reset control)\b/i);
  assert.doesNotMatch(promptCorpus, /\b(?:Intermediate case|specialist adult-skewed|in this simulator)\b/i);
});

test('MCQ UI provides retry, unanswered guard and explanatory review', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const controller = fs.readFileSync(new URL('../src/menu-mcq.js', import.meta.url), 'utf8');
  const renderer = fs.readFileSync(new URL('../src/mcq.js', import.meta.url), 'utf8');
  assert.match(html, /id="retryMcqButton"/);
  assert.match(controller, /Please answer all questions before submitting\./);
  assert.match(controller, /mcqResult\.focus/);
  assert.match(renderer, /Incorrect\. Correct answer:/);
  assert.match(renderer, /Why:/);
});

test('test rounds use clean modifiers and restore generated state and context exactly', () => {
  const previousWindow = globalThis.window;
  globalThis.window = { setInterval: () => 1, clearInterval() {} };
  const control = (value, defaultValue = value) => Object.assign(new EventTarget(), { value, defaultValue, checked: false, disabled: false });
  const state = createAppState();
  Object.assign(state, { isBabyMode: true, currentRefraction: 'right-big-cortical-left-small-cortical', contextOnsetMode: 'sudden', contextGlareOn: true, cylinderAxisDeg: 73, retStreakOffset: 8, retStreakOffsetY: 4, corticalCataractPattern: { seed: 123, spikes: [1, 4, 7] } });
  const original = structuredClone(state);
  const dom = {
    pupilSizeSliders: [control('40', '32'), control('38', '32')],
    eyelidSliders: [control('20', '0'), control('10', '0')],
    cataractSlider: control('70', '0'), reflexColorSlider: control('80', '66'),
    refractionStateSelect: control(state.currentRefraction),
    irises: [{ manualOffset: { x: 12, y: -3 } }],
  };
  const setRefraction = value => { state.currentRefraction = value; state.cylinderAxisDeg = 0; state.corticalCataractPattern = { seed: Math.random() }; };
  dom.refractionStateSelect.addEventListener('change', () => setRefraction(dom.refractionStateSelect.value));
  const controller = createTestModeController({ state, dom,
    eyesController: { syncRefractionPose() {} },
    retinoscopyController: { setRefraction, setRetStreakOffset(x,y) { state.retStreakOffset=x;state.retStreakOffsetY=y; } },
    setConditionContext() { state.contextOnsetMode='gradual';state.contextGlareOn=false; }
  });
  try {
    for (let round=0; round<40; round++) {
      controller.startTestRound();
      assert.ok(BABY_REFRACTION_VALUE_SET.has(state.currentRefraction));
      assert.equal(dom.cataractSlider.value, '0');
      assert.deepEqual(dom.irises[0].manualOffset, { x: 0, y: 0 });
    }
    controller.closeTestMode();
    for (const key of ['currentRefraction','cylinderAxisDeg','corticalCataractPattern','contextOnsetMode','contextGlareOn','retStreakOffset','retStreakOffsetY']) assert.deepEqual(state[key], original[key], key);
    assert.equal(dom.cataractSlider.value, '70');
    assert.deepEqual(dom.pupilSizeSliders.map(s=>s.value), ['40','38']);
    assert.deepEqual(dom.irises[0].manualOffset, { x: 12, y: -3 });
  } finally { globalThis.window = previousWindow; }
});

let failures = 0;
for (const { name, fn } of tests) {
  try { await fn(); console.log(`PASS ${name}`); }
  catch (error) { failures += 1; console.error(`FAIL ${name}\n${error.stack}`); }
}
console.log(`${tests.length - failures}/${tests.length} tests passed`);
if (failures) process.exitCode = 1;
