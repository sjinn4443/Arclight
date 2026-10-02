import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, resetOperationalState, setFinding } from '../src/state.js';
import { evaluateTriage } from '../src/triage.js';
import { buildReferralNote } from '../src/referral-note.js';
import { MCQ_BANKS, MCQ_LEVEL_META, MCQ_SOURCE_REGISTRY } from '../src/mcq-data.js';
import { evaluateMcqAttempt } from '../src/mcq.js';

function completeEye(eye, finding = 'noReferableSignsSeen') {
  eye.distanceVA = '6/6';
  eye.viewQuality = 'clear';
  eye.areaSeen = 'disc-macula';
  eye.findings[finding] = true;
}

test('untouched assessment remains incomplete and not recorded', () => {
  const result = evaluateTriage(createInitialState());
  assert.equal(result.actionKey, 'incomplete');
  assert.deepEqual(result.eyes.map(eye => eye.summary), ['Not recorded', 'Not recorded']);
});

test('explicit bilateral no-signs recording is routine', () => {
  const state = createInitialState();
  completeEye(state.eyes.right);
  completeEye(state.eyes.left);
  assert.equal(evaluateTriage(state).actionKey, 'routineScreen');
});

test('limited view is not reassuring', () => {
  const state = createInitialState();
  completeEye(state.eyes.right);
  state.eyes.right.viewQuality = 'ungradable';
  assert.equal(evaluateTriage(state).actionKey, 'ungradable');
});

test('established high-risk priorities remain protected', () => {
  const soon = createInitialState();
  completeEye(soon.eyes.right);
  soon.eyes.right.distanceVA = '6/60';
  soon.eyes.right.findings.noReferableSignsSeen = false;
  assert.equal(evaluateTriage(soon).actionKey, 'referSoon');
  const context = createInitialState();
  completeEye(context.eyes.right, 'cupDisc03');
  completeEye(context.eyes.left);
  assert.equal(evaluateTriage(context).actionKey, 'routineScreen');
  const glaucoma = createInitialState();
  completeEye(glaucoma.eyes.right, 'cupDisc09');
  assert.equal(evaluateTriage(glaucoma).actionKey, 'fastGlaucoma');
  const swelling = createInitialState();
  completeEye(swelling.eyes.right, 'swollenDisc');
  assert.equal(evaluateTriage(swelling).actionKey, 'urgent');
});

test('finding selection preserves mutual exclusion', () => {
  const state = createInitialState();
  setFinding(state, 'right', 'noReferableSignsSeen', true);
  setFinding(state, 'right', 'swollenDisc', true);
  assert.equal(state.eyes.right.findings.noReferableSignsSeen, false);
});

test('operational reset clears examination context but retains the teaching viewer', () => {
  const state = createInitialState();
  state.viewer.activeCondition = 'case-08';
  state.viewer.pigmentation = 'dark';
  state.mode = 'holo-bio';
  state.dilation = 'yes';
  completeEye(state.eyes.right, 'swollenDisc');
  state.systemicChecks.bp = true;
  resetOperationalState(state);
  assert.equal(state.viewer.activeCondition, 'case-08');
  assert.equal(state.viewer.pigmentation, 'dark');
  assert.equal(state.mode, 'arclight-do');
  assert.equal(state.dilation, '');
  assert.equal(state.eyes.right.distanceVA, '');
  assert.equal(state.systemicChecks.bp, false);
});

test('referral note keeps missing fields explicit', () => {
  const state = createInitialState();
  const note = buildReferralNote(state, evaluateTriage(state));
  assert.match(note, /VA Not recorded/);
  assert.match(note, /view not recorded/);
  assert.match(note, /findings: not recorded/);
  assert.match(note, /Dilated: not recorded/);
});

test('missing VA prevents routine reassurance without suppressing urgent signs', () => {
  const state = createInitialState();
  for (const eye of Object.values(state.eyes)) { completeEye(eye); eye.distanceVA = ''; }
  assert.equal(evaluateTriage(state).actionKey, 'incomplete');
  setFinding(state, 'right', 'swollenDisc', true);
  assert.equal(evaluateTriage(state).actionKey, 'urgent');
});

test('the winning urgent eye retains its limited-view warning', () => {
  const state = createInitialState();
  completeEye(state.eyes.right, 'swollenDisc');
  state.eyes.right.viewQuality = 'hazy';
  const result = evaluateTriage(state);
  assert.equal(result.actionKey, 'urgent');
  assert.ok(result.limitations.some(text => /RE: limited view/.test(text)));
});

test('disc size alone is not an explicit negative examination', () => {
  const state = createInitialState();
  completeEye(state.eyes.right, 'smallDisc');
  completeEye(state.eyes.left, 'largeDisc');
  assert.equal(evaluateTriage(state).actionKey, 'incomplete');
});

test('variant and lamina results keep their established clinical qualifications visible', () => {
  const state = createInitialState();
  completeEye(state.eyes.right, 'discDrusen');
  completeEye(state.eyes.left, 'visibleLaminaCribrosa');
  const result = evaluateTriage(state);
  assert.equal(result.actionKey, 'fastGlaucoma');
  assert.ok(result.limitations.some(text => /manage as swelling/.test(text)));
  assert.ok(result.limitations.some(text => /rim loss and fields/.test(text)));
});

test('MCQ banks retain configured sizes and valid answers', () => {
  for (const [level, meta] of Object.entries(MCQ_LEVEL_META)) {
    const bank = MCQ_BANKS[level];
    assert.equal(bank.length, meta.targetBankSize);
    assert.ok(meta.questionCount <= bank.length);
    assert.equal(new Set(bank.map(question => question.id)).size, bank.length);
    for (const question of bank) {
      assert.ok(Number.isInteger(question.answer));
      assert.ok(question.answer >= 0 && question.answer < question.options.length);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.ok(question.explanation.length >= 30);
      assert.ok(question.sourceIds.length >= 1);
      assert.ok(question.sourceIds.every(sourceId => MCQ_SOURCE_REGISTRY[sourceId]));
      assert.equal(question.reviewStatus, 'Independent clinical sign-off pending');
    }
  }
});

test('MCQ banks contain clinical teaching rather than app mechanics', () => {
  const authoredText = Object.values(MCQ_BANKS)
    .flatMap(bank => bank.flatMap(question => [question.question, ...question.options]))
    .join(' ');
  assert.doesNotMatch(
    authoredText,
    /\b(?:app|button|toggle|screenshot|case-set|Holo|Arclight|training)\b/i
  );
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
