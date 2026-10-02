import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { evaluateCataractDecision as evaluate } from '../src/cataract-engine.js';
const baseline = { onsetValue: 'gradual', ageBand: 'elderly', distanceVA: '6/36',
  nearVAValue: '', eyes: 'one', painYes: false, painRecorded: true,
  pupilAbnormal: false, pupilRecorded: true, frontPresent: false, frontRecorded: true,
  afferentConcern: false, afferentRecorded: true, fundalSelection: 'dark', backSelection: 'normal' };
const run = changes => evaluate({ ...baseline, ...changes });

test('recorded concerns survive missing required inputs without a cataract diagnosis', () => {
  for (const [changes, action, note] of [
    [{ painYes: true }, 'recheck_investigate_first', 'pain_with_cataract_pattern'],
    [{ pupilAbnormal: true }, 'recheck_investigate_first', 'pupil_abnormal_review'],
    [{ frontPresent: true }, 'recheck_investigate_first', 'front_abnormal_prognosis_limited'],
    [{ afferentConcern: true }, 'rapd_non_cataract_first', 'neuro_red_flags'],
    [{ backSelection: 'cupping' }, 'posterior_disease_first', 'posterior_cupping_glaucoma'],
    [{ backSelection: 'diabetic' }, 'posterior_disease_first', 'posterior_diabetic_first']
  ]) {
    const result = run({ ...changes, ageBand: '' });
    assert.equal(result.hasResult, false);
    assert.equal(result.cataractType, '');
    assert.equal(result.actionCode, action);
    assert.equal(result.actionColour, 'orange');
    assert.ok(result.actionNoteCodes.includes(note));
  }
  const sudden = run({ ageBand: '', onsetValue: 'sudden', painYes: true, afferentConcern: true });
  assert.equal(sudden.actionCode, 'urgent_same_day_investigation');
  assert.ok(sudden.actionNoteCodes.includes('neuro_red_flags'));
  assert.ok(!sudden.actionNoteCodes.includes('urgency_note_early'));
  assert.equal(run({ distanceVA: '', fundalSelection: 'white' }).actionCode, 'white_reflex_prompt_review');
});

test('unrecorded safety checks qualify a suggested cataract phenotype', () => {
  for (const recordedKey of ['painRecorded', 'pupilRecorded', 'frontRecorded', 'afferentRecorded']) {
    const result = run({ [recordedKey]: false });
    assert.match(result.cataractType, /^Possible /);
    assert.ok(result.ruleTrace.includes('phenotype:provisional_missing_checks'));
  }
  assert.doesNotMatch(run({}).cataractType, /^Possible /);
  assert.equal(run({ fundalSelection: 'normal', painRecorded: false }).cataractType, 'Nil');
});
test('incomplete assessment retains observed urgent signals without diagnosing cataract', () => {
  for (const [changes, action] of [
    [{ onsetValue: 'sudden', ageBand: '' }, 'urgent_same_day_investigation'],
    [{ ageBand: 'baby', distanceVA: '', fundalSelection: 'white' }, 'child_white_reflex_urgent'],
    [{ backSelection: 'detached', ageBand: '' }, 'retinal_same_day']
  ]) {
    const result = run(changes);
    assert.equal(result.hasResult, false);
    assert.equal(result.cataractType, '');
    assert.equal(result.actionCode, action);
    assert.equal(result.actionColour, 'red');
  }
  assert.equal(run({ ageBand: '' }).actionText, '');
});
test('dense reflex retains recorded posterior disease and controller only defaults an empty entry', () => {
  for (const backSelection of ['detached', 'cupping', 'diabetic']) {
    assert.ok(run({ fundalSelection: 'white', backSelection }).flags.includes('posterior_priority'));
  }
  const controller = readFileSync(new URL('../src/cataract-controller.js', import.meta.url), 'utf8');
  assert.match(controller, /poorViewButton && !\$\('\.back-btn\.selected'\)/);
  assert.doesNotMatch(controller, /Dense reflex auto-sets/);
});
test('pupil and afferent warnings survive the compact note cap', () => {
  const result = run({ ageBand: 'child', nearVAValue: 'N5', pupilAbnormal: true,
    afferentConcern: true, backSelection: 'diabetic' });
  assert.ok(result.actionNoteCodes.includes('neuro_red_flags'));
  assert.ok(result.actionNoteCodes.includes('pupil_abnormal_review'));
  assert.ok(result.actionNotes.length <= 3);
});
test('good fixation alone does not establish reduced acuity or amblyopia risk', () => {
  const result = run({ ageBand: 'baby', distanceVA: 'fix_follow_good', fundalSelection: 'normal' });
  assert.notEqual(result.actionCode, 'child_reduced_vision_early_assessment');
  assert.ok(!result.actionNoteCodes.includes('child_reduced_vision_early_review'));
  assert.equal(run({ ageBand: 'baby', distanceVA: 'fix_follow_poor', fundalSelection: 'normal' }).actionCode,
    'child_reduced_vision_early_assessment');
});
test('6/6 can coexist with early cataract but white reflex mismatch remains', () => {
  for (const fundalSelection of ['dark', 'patches', 'spots']) {
    const result = run({ distanceVA: '6/6', fundalSelection });
    assert.ok(!result.flags.includes('consistency:abnormal_reflex_with_va_6_6'));
    assert.equal(result.actionText, 'Review if function affected.');
  }
  assert.ok(run({ distanceVA: '6/6', fundalSelection: 'white' }).flags.includes('consistency:white_reflex_with_relatively_good_va'));
});

test('white-reflex mismatch survives compact notes alongside recorded posterior disease', () => {
  for (const ageBand of ['baby', 'elderly']) {
    for (const backSelection of ['cupping', 'diabetic', 'detached']) {
      const result = run({ ageBand, backSelection, fundalSelection: 'white', distanceVA: '6/6' });
      assert.ok(result.flags.includes('consistency:white_reflex_with_relatively_good_va'));
      assert.ok(result.recheckFieldKeys.includes('distanceVA'));
      assert.ok(result.recheckFieldKeys.includes('fundal'));
      assert.ok(result.actionNoteCodes.includes('white_reflex_with_relatively_good_va') ||
        result.flags.includes('notes_trimmed'));
      assert.ok(result.actionNotes.length <= 3);
    }
  }
});
