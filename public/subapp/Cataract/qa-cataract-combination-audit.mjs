import { evaluateCataractDecision } from './src/cataract-engine.js';

const onsetOptions = ['gradual', 'sudden'];
const ageOptions = [
  '',
  'baby',
  'child',
  'adolescent',
  'young_adult',
  'adult',
  'middle_aged',
  'elderly',
  'very_elderly'
];
const eyesOptions = ['', 'one', 'two'];
const painOptions = [false, true];
const distanceOptions = [
  '6/6',
  '6/12',
  '6/36',
  '6/60',
  'HM',
  'fix_follow_good',
  'fix_follow_poor',
  'unable_test'
];
const nearOptions = ['', 'N5', 'N8', 'N12', 'N18', 'N36'];
const pupilOptions = ['normal', 'abnormal', 'unrecorded'];
const frontOptions = [false, true];
const rapdOptions = [false, true];
const lightOptions = [false, true];
const fundalOptions = ['normal', 'dark', 'patches', 'spots', 'white'];
const backOptions = ['normal', 'cupping', 'diabetic', 'detached', 'poor view'];

const MAX_ACTION_NOTES_BY_COLOUR = {
  black: 0,
  green: 2,
  orange: 3,
  red: 3
};

const findings = new Map();
const uniqueActions = new Map();

let total = 0;
let reachable = 0;
let unreachable = 0;

function addFinding(key, combo, decision, note) {
  const existing = findings.get(key) || { count: 0, samples: [] };
  existing.count += 1;
  if (existing.samples.length < 8) {
    existing.samples.push({
      combo,
      actionText: decision.actionText,
      actionColour: decision.actionColour,
      cataractType: decision.cataractType,
      note
    });
  }
  findings.set(key, existing);
}

function pushUniqueAction(decision) {
  const key = `${decision.actionColour} | ${decision.actionText}`;
  uniqueActions.set(key, (uniqueActions.get(key) || 0) + 1);
}

function comboToText(combo) {
  return `onset=${combo.onsetValue || '-'}, age=${combo.ageBand || '-'}, eyes=${combo.eyes || '-'}, pain=${combo.painYes ? 'yes' : 'no'}, distance=${combo.distanceVA || '-'}, near=${combo.nearVAValue || '-'}, pupil=${combo.pupilStatus || '-'}, front=${combo.frontPresent ? 'yes' : 'no'}, rapd=${combo.rapdPresent ? 'yes' : 'no'}, light_poor=${combo.directionLightPoor ? 'yes' : 'no'}, fundal=${combo.fundalSelection}, back=${combo.backSelection}`;
}

function buildPupilInput(pupilStatus) {
  return {
    pupilStatus,
    pupilSelected: pupilStatus !== 'unrecorded',
    pupilRecorded: pupilStatus !== 'unrecorded',
    pupilAbnormal: pupilStatus === 'abnormal'
  };
}

for (const onsetValue of onsetOptions) {
  for (const ageBand of ageOptions) {
  for (const eyes of eyesOptions) {
    for (const painYes of painOptions) {
      for (const distanceVA of distanceOptions) {
        for (const nearVAValue of nearOptions) {
          for (const pupilStatus of pupilOptions) {
            for (const frontPresent of frontOptions) {
              for (const rapdPresent of rapdOptions) {
                for (const directionLightPoor of lightOptions) {
                  for (const fundalSelection of fundalOptions) {
                    for (const backSelection of backOptions) {
                  total += 1;

                  const isReachable = !(fundalSelection === 'white' && backSelection !== 'poor view');
                  if (isReachable) {
                    reachable += 1;
                  } else {
                    unreachable += 1;
                  }

                  const combo = {
                    onsetValue,
                    ageBand,
                    distanceVA,
                    nearVAValue,
                    eyes,
                    painYes,
                    ...buildPupilInput(pupilStatus),
                    frontPresent,
                    rapdPresent,
                    directionLightPoor,
                    fundalSelection,
                    backSelection
                  };

                  const decision = evaluateCataractDecision(combo);
                  const isComplete = Boolean(onsetValue && eyes && distanceVA && fundalSelection && backSelection);
                  if (!isComplete) {
                    if (decision.hasResult) {
                      addFinding('incomplete_result', combo, decision, 'Incomplete state returned a populated decision');
                    }
                    continue;
                  }

                  if (!decision.hasResult) {
                    addFinding('missing_result', combo, decision, 'Expected a populated decision');
                    continue;
                  }

                  if (isReachable) {
                    pushUniqueAction(decision);
                  }

                  const actionLower = decision.actionText.toLowerCase();
                  const cataractReferralAction =
                    actionLower.includes('routine cataract referral') ||
                    actionLower.includes('priority cataract referral');
                  const hasPosteriorPriorityDisease = ['cupping', 'diabetic', 'detached'].includes(
                    backSelection
                  );
                  const isPaediatric = ['baby', 'child', 'adolescent'].includes(ageBand);
                  const hasNeuroFlags = Boolean(rapdPresent) || Boolean(directionLightPoor);
                  const maxAllowedNotes =
                    MAX_ACTION_NOTES_BY_COLOUR[decision.actionColour] ?? Number.POSITIVE_INFINITY;
                  const allowsWhiteRelativelyGoodVaRecheckOverride =
                    fundalSelection === 'white' &&
                    backSelection === 'poor view' &&
                    ['6/6', '6/12', 'fix_follow_good'].includes(distanceVA) &&
                    onsetValue === 'gradual' &&
                    !painYes &&
                    pupilStatus !== 'abnormal' &&
                    !frontPresent &&
                    !hasNeuroFlags &&
                    !isPaediatric &&
                    decision.actionCode === 'recheck_investigate_first';
                  const allowsPaediatricWhiteAction =
                    isPaediatric &&
                    decision.actionCode === 'child_cataract_prompt_referral' &&
                    decision.actionColour === 'red';

                  if (!isReachable) {
                    continue;
                  }

                  if (fundalSelection === 'normal' && cataractReferralAction) {
                    addFinding(
                      'normal_fundal_but_cataract_referral',
                      combo,
                      decision,
                      'Normal fundal reflex still leads to cataract referral wording'
                    );
                  }

                  if (fundalSelection !== 'normal' && actionLower.includes('no cataract referral')) {
                    addFinding(
                      'abnormal_fundal_but_no_referral',
                      combo,
                      decision,
                      'Abnormal fundal pattern still outputs no cataract referral'
                    );
                  }

                  if (
                    fundalSelection !== 'normal' &&
                    decision.cataractType === 'Nil' &&
                    !hasPosteriorPriorityDisease
                  ) {
                    addFinding(
                      'abnormal_fundal_but_nil_pattern',
                      combo,
                      decision,
                      'Fundal pattern indicates cataract subtype but output says Nil'
                    );
                  }

                  if (
                    fundalSelection === 'white' &&
                    backSelection === 'poor view' &&
                    !actionLower.includes('priority cataract referral') &&
                    !allowsWhiteRelativelyGoodVaRecheckOverride &&
                    !allowsPaediatricWhiteAction &&
                    !(onsetValue === 'sudden' && painYes && actionLower.includes('urgent same-day'))
                  ) {
                    addFinding(
                      'white_reflex_not_priority',
                      combo,
                      decision,
                      'White reflex does not stay in priority cataract pathway'
                    );
                  }

                  if (
                    fundalSelection === 'white' &&
                    ['6/6', '6/12'].includes(distanceVA) &&
                    !decision.actionNoteCodes.includes('white_reflex_with_relatively_good_va')
                  ) {
                    addFinding(
                      'dense_reflex_relatively_good_va_missing_recheck_note',
                      combo,
                      decision,
                      'Dense/white reflex with relatively good BCVA should prompt re-check note.'
                    );
                  }

                  if (
                    onsetValue === 'sudden' &&
                    painYes &&
                    fundalSelection === 'white' &&
                    !['cupping', 'diabetic', 'detached'].includes(backSelection) &&
                    decision.actionCode !== 'urgent_same_day_investigation'
                  ) {
                    addFinding(
                      'sudden_pain_white_not_urgent_main',
                      combo,
                      decision,
                      'Sudden painful white-reflex should use urgent same-day main action.'
                    );
                  }

                  if (
                    (decision.actionCode === 'rapd_non_cataract_first' ||
                      decision.actionCode === 'urgent_same_day_investigation') &&
                    !['cupping', 'diabetic', 'detached'].includes(backSelection) &&
                    fundalSelection !== 'normal' &&
                    decision.cataractType !== 'Nil' &&
                    !decision.cataractType.includes('other urgent pathology suspected')
                  ) {
                    addFinding(
                      'non_cataract_main_action_without_competing_confidence',
                      combo,
                      decision,
                      'Abnormal reflex + non-cataract-first main action should use possible competing-pathology cataract label.'
                    );
                  }

                  if (
                    backSelection === 'detached' &&
                    !actionLower.includes('posterior eye disease')
                  ) {
                    addFinding(
                      'detached_without_posterior_override',
                      combo,
                      decision,
                      'Detached retina should stay on posterior disease pathway'
                    );
                  }

                  if (
                    onsetValue === 'gradual' &&
                    !painYes &&
                    pupilStatus !== 'abnormal' &&
                    !frontPresent &&
                    !rapdPresent &&
                    !directionLightPoor &&
                    (backSelection === 'cupping' || backSelection === 'diabetic') &&
                    decision.actionCode === 'posterior_disease_first' &&
                    decision.actionColour === 'red'
                  ) {
                    addFinding(
                      'posterior_non_detached_overurgent',
                      combo,
                      decision,
                      'Cupping/diabetic posterior override should not default to red without acute features.'
                    );
                  }

                  if (
                    pupilStatus !== 'abnormal' &&
                    (actionLower.includes('abnormal pupil') ||
                      decision.cataractType.toLowerCase().includes('pupil abnormality'))
                  ) {
                    addFinding(
                      'pupil_not_recorded_triggers_abnormal',
                      combo,
                      decision,
                      'Unrecorded pupil should not be treated as abnormal'
                    );
                  }

                  if (
                    pupilStatus === 'normal' &&
                    decision.cataractType.toLowerCase().startsWith('probable ')
                  ) {
                    addFinding(
                      'recorded_normal_pupil_downgraded_confidence',
                      combo,
                      decision,
                      'Recorded normal pupil should not be treated as not recorded'
                    );
                  }

                  if (
                    onsetValue === 'sudden' &&
                    eyes === 'one' &&
                    painYes &&
                    !actionLower.includes('urgent') &&
                    !actionLower.includes('posterior eye disease') &&
                    !decision.urgencyNote.toLowerCase().includes('urgent')
                  ) {
                    addFinding(
                      'painful_sudden_unilateral_without_urgent_signal',
                      combo,
                      decision,
                      'High-risk triad should surface urgent wording or note'
                    );
                  }

                  if (
                    onsetValue === 'gradual' &&
                    eyes === 'one' &&
                    painYes &&
                    distanceVA === '6/6' &&
                    pupilStatus !== 'abnormal' &&
                    !frontPresent &&
                    !rapdPresent &&
                    !directionLightPoor &&
                    fundalSelection === 'normal' &&
                    backSelection === 'normal' &&
                    (decision.actionCode === 'urgent_same_day_investigation' ||
                      decision.actionColour === 'red')
                  ) {
                    addFinding(
                      'gradual_unilateral_pain_overurgent',
                      combo,
                      decision,
                      'Baseline gradual painful unilateral case should not be forced to red urgent action.'
                    );
                  }

                  if (decision.actionNotes.length > maxAllowedNotes) {
                    addFinding(
                      'action_notes_over_policy_limit',
                      combo,
                      decision,
                      `Action colour ${decision.actionColour} allows <=${maxAllowedNotes} notes, got ${decision.actionNotes.length}.`
                    );
                  }

                  if (
                    decision.actionColour === 'red' &&
                    decision.actionNoteCodes.some((noteCode) => noteCode.startsWith('near_va_'))
                  ) {
                    addFinding(
                      'red_action_contains_near_va_note',
                      combo,
                      decision,
                      'Red output should suppress near-VA notes.'
                    );
                  }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  }
}

const sortedFindings = [...findings.entries()].sort((a, b) => b[1].count - a[1].count);
const topActions = [...uniqueActions.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);

console.log('Cataract Combination Audit');
console.log('=========================');
console.log(`Total combos evaluated: ${total}`);
console.log(`Reachable combos (UI-feasible): ${reachable}`);
console.log(`Unreachable combos (white forces poor view): ${unreachable}`);
console.log('');

console.log('Top Actions (reachable combos)');
console.log('------------------------------');
for (const [action, count] of topActions) {
  console.log(`${count.toString().padStart(4, ' ')}  ${action}`);
}
console.log('');

console.log('Findings');
console.log('--------');
if (sortedFindings.length === 0) {
  console.log('No edge-case findings triggered by the current rules.');
} else {
  for (const [key, data] of sortedFindings) {
    console.log(`${key}: ${data.count}`);
    for (const sample of data.samples) {
      console.log(`  - ${comboToText(sample.combo)}`);
      console.log(`    -> ${sample.actionColour} | ${sample.cataractType} | ${sample.actionText}`);
      console.log(`    -> note: ${sample.note}`);
    }
  }
}
