import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, resetAssessmentState, setFinding, setMode } from '../src/state.js';
import { evaluateTriage } from '../src/triage.js';
import { buildReferralNote } from '../src/referral-note.js';

function completeClearEye(eye) {
  eye.distanceVA = '6/6';
  eye.viewQuality = 'clear';
  eye.areaSeen = 'disc-macula';
  eye.findings.noReferableSignsSeen = true;
}

test('untouched assessment remains incomplete', () => {
  assert.equal(evaluateTriage(createInitialState()).actionKey, 'incomplete');
});

test('two adequate clear eyes follow the established routine screening path', () => {
  const state = createInitialState();
  completeClearEye(state.eyes.right);
  completeClearEye(state.eyes.left);
  assert.equal(evaluateTriage(state).actionKey, 'routineScreen');
});

test('an ungradable fellow eye prevents a routine result', () => {
  const state = createInitialState();
  completeClearEye(state.eyes.right);
  state.eyes.left.viewQuality = 'ungradable';
  state.eyes.left.areaSeen = 'limited';
  assert.equal(evaluateTriage(state).actionKey, 'ungradable');
});

test('proliferative sign wins over a fellow ungradable eye', () => {
  const state = createInitialState();
  state.eyes.right.findings.nvd = true;
  state.eyes.left.viewQuality = 'ungradable';
  state.eyes.left.areaSeen = 'limited';
  assert.equal(evaluateTriage(state).actionKey, 'urgent');
});

test('macula risk and NPDR retain established priorities', () => {
  const macula = createInitialState();
  macula.eyes.right.findings.maculaHardExudates = true;
  assert.equal(evaluateTriage(macula).actionKey, 'referSoon');
  const npdr = createInitialState();
  npdr.eyes.right.findings.microaneurysms = true;
  assert.equal(evaluateTriage(npdr).actionKey, 'routineReferral');
});

test('finding choices remain mutually exclusive', () => {
  const state = createInitialState();
  setFinding(state, 'right', 'noReferableSignsSeen', true);
  setFinding(state, 'right', 'nvd', true);
  assert.equal(state.eyes.right.findings.noReferableSignsSeen, false);
  setFinding(state, 'right', 'noReferableSignsSeen', true);
  assert.equal(state.eyes.right.findings.nvd, false);
});

test('DO mode clears an invalid Holo four-quadrant area', () => {
  const state = createInitialState();
  setMode(state, 'holo-bio');
  state.eyes.right.areaSeen = 'four-quadrants';
  setMode(state, 'arclight-do');
  assert.equal(state.eyes.right.areaSeen, '');
});

test('assessment reset clears clinical state and preserves viewer practice', () => {
  const state = createInitialState();
  state.viewer.activeCondition = 'case-07';
  state.viewer.pigmentation = 'dark';
  state.eyes.right.distanceVA = '6/36';
  state.systemicChecks.bp = true;
  state.dilation = 'yes';
  resetAssessmentState(state);
  assert.equal(state.eyes.right.distanceVA, '');
  assert.equal(state.systemicChecks.bp, false);
  assert.equal(state.dilation, '');
  assert.equal(state.viewer.activeCondition, 'case-07');
  assert.equal(state.viewer.pigmentation, 'dark');
});

test('referral note reports both eyes and incomplete state honestly', () => {
  const state = createInitialState();
  const note = buildReferralNote(state, evaluateTriage(state));
  assert.match(note, /Record both eyes/);
  assert.match(note, /RE:/);
  assert.match(note, /LE:/);
  assert.match(note, /not recorded/i);
  assert.doesNotMatch(note, /findings: none/i);
});

test('blank VA cannot produce reassuring routine screening', () => {
  const state = createInitialState();
  Object.values(state.eyes).forEach(completeClearEye);
  state.eyes.right.distanceVA = '';
  assert.equal(evaluateTriage(state).actionKey, 'incomplete');
});

test('winning findings retain same-eye poor-view and missing-VA limitations', () => {
  for (const finding of ['microaneurysms', 'maculaHardExudates', 'nvd']) {
    const state = createInitialState();
    state.eyes.right.findings[finding] = true;
    state.eyes.right.viewQuality = 'ungradable';
    const result = evaluateTriage(state);
    assert.match(result.limitations.join(' '), /RE: limited view/);
    assert.match(result.limitations.join(' '), /RE: VA not recorded/);
    assert.notEqual(result.actionKey, 'incomplete');
  }
});
