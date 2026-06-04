import fs from 'node:fs';
import path from 'node:path';
import { evaluateCataractDecision } from './src/cataract-engine.js';

const OUTPUT_REPORT_FILE = 'acceptance-audit-report.txt';

function createInput(overrides = {}) {
  return {
    onsetValue: 'gradual',
    ageBand: '',
    distanceVA: '6/6',
    nearVAValue: '',
    eyes: '',
    painYes: false,
    pupilSelected: false,
    pupilRecorded: true,
    pupilAbnormal: false,
    frontPresent: false,
    rapdPresent: false,
    directionLightPoor: false,
    fundalSelection: 'normal',
    backSelection: 'normal',
    ...overrides
  };
}

function evaluate(inputOverrides) {
  return evaluateCataractDecision(createInput(inputOverrides));
}

function severityFromColour(colour) {
  if (colour === 'red') return 3;
  if (colour === 'orange') return 2;
  if (colour === 'green') return 1;
  return 0;
}

function hasAll(items, expected) {
  return expected.every((entry) => items.includes(entry));
}

const checks = [];

function addCheck(id, runFn) {
  checks.push({ id, runFn });
}

addCheck('urgent_main_action_when_sudden_pain_with_risk_flags', () => {
  const decision = evaluate({
    onsetValue: 'sudden',
    eyes: 'one',
    painYes: true,
    distanceVA: '6/12',
    pupilSelected: true,
    pupilAbnormal: true,
    frontPresent: true,
    fundalSelection: 'normal',
    backSelection: 'normal'
  });

  const pass =
    decision.actionCode === 'urgent_same_day_investigation' &&
    decision.actionColour === 'red' &&
    decision.actionText === 'Urgent same-day investigation needed.' &&
    decision.cataractType === 'Nil' &&
    decision.actionNotes.length <= 3 &&
    decision.actionNoteCodes.includes('urgent_trigger_painful_one_or_sudden');

  return {
    pass,
    detail: pass
      ? 'Urgent scenario maps to red urgent main action with concise priority notes.'
      : `Got actionCode=${decision.actionCode}, colour=${decision.actionColour}, actionText=${decision.actionText}, notes=${decision.actionNoteCodes.join(', ') || '-'}`
  };
});

addCheck('missing_eyes_blocks_result', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    eyes: '',
    distanceVA: '6/36',
    fundalSelection: 'dark',
    backSelection: 'normal'
  });

  const pass = !decision.hasResult && decision.missingFields.includes('eyes');

  return {
    pass,
    detail: pass
      ? 'Engine requires eyes before returning a definitive action.'
      : `Got hasResult=${decision.hasResult}, missing=${decision.missingFields.join(', ') || '-'}`
  };
});

addCheck('invariance_eyes_one_vs_two_for_same_urgent_context', () => {
  const oneEye = evaluate({
    onsetValue: 'sudden',
    eyes: 'one',
    painYes: true,
    distanceVA: '6/12',
    pupilSelected: true,
    pupilAbnormal: true,
    frontPresent: true,
    fundalSelection: 'normal',
    backSelection: 'normal'
  });

  const twoEyes = evaluate({
    onsetValue: 'sudden',
    eyes: 'two',
    painYes: true,
    distanceVA: '6/12',
    pupilSelected: true,
    pupilAbnormal: true,
    frontPresent: true,
    fundalSelection: 'normal',
    backSelection: 'normal'
  });

  const pass =
    oneEye.actionCode === twoEyes.actionCode &&
    oneEye.actionText === twoEyes.actionText &&
    oneEye.actionColour === twoEyes.actionColour;

  return {
    pass,
    detail: pass
      ? 'Changing eyes one/two does not alter main urgent guidance in this context.'
      : `one={${oneEye.actionCode}|${oneEye.actionText}|${oneEye.actionColour}} two={${twoEyes.actionCode}|${twoEyes.actionText}|${twoEyes.actionColour}}`
  };
});

addCheck('gradual_pain_unilateral_not_auto_urgent_without_red_flags', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    eyes: 'one',
    painYes: true,
    distanceVA: '6/6',
    pupilSelected: false,
    pupilAbnormal: false,
    frontPresent: false,
    rapdPresent: false,
    directionLightPoor: false,
    fundalSelection: 'normal',
    backSelection: 'normal'
  });

  const pass =
    decision.actionCode !== 'urgent_same_day_investigation' &&
    decision.actionColour !== 'red' &&
    decision.actionText === 'No cataract referral now. Investigate non-cataract causes.';

  return {
    pass,
    detail: pass
      ? 'Gradual painful unilateral baseline is not auto-escalated to red urgent action.'
      : `Got actionCode=${decision.actionCode}, colour=${decision.actionColour}, actionText=${decision.actionText}`
  };
});

addCheck('white_reflex_priority_preserved_under_pain', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    eyes: 'one',
    painYes: true,
    distanceVA: '6/6',
    fundalSelection: 'white',
    backSelection: 'poor view'
  });

  const pass =
    decision.actionCode === 'cataract_priority_white' &&
    decision.actionText === 'Priority cataract referral.' &&
    decision.actionColour === 'red';

  return {
    pass,
    detail: pass
      ? 'White reflex still routes to priority cataract referral.'
      : `Got actionCode=${decision.actionCode}, actionText=${decision.actionText}, colour=${decision.actionColour}`
  };
});

addCheck('white_reflex_sudden_pain_routes_to_urgent_main', () => {
  const decision = evaluate({
    onsetValue: 'sudden',
    eyes: 'one',
    painYes: true,
    distanceVA: '6/12',
    fundalSelection: 'white',
    backSelection: 'poor view'
  });

  const pass =
    decision.actionCode === 'urgent_same_day_investigation' &&
    decision.actionText === 'Urgent same-day investigation needed.' &&
    decision.actionColour === 'red';

  return {
    pass,
    detail: pass
      ? 'Sudden painful white-reflex scenario now uses urgent main action.'
      : `Got actionCode=${decision.actionCode}, actionText=${decision.actionText}, colour=${decision.actionColour}`
  };
});

addCheck('posterior_override_always_wins', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    eyes: 'two',
    painYes: false,
    distanceVA: '6/36',
    fundalSelection: 'patches',
    backSelection: 'detached'
  });

  const pass =
    decision.actionCode === 'posterior_disease_first' &&
    decision.actionText === 'Treat posterior eye disease first.' &&
    decision.actionColour === 'red';

  return {
    pass,
    detail: pass
      ? 'Posterior override preserved.'
      : `Got actionCode=${decision.actionCode}, actionText=${decision.actionText}, colour=${decision.actionColour}`
  };
});

addCheck('posterior_non_detached_not_auto_red_without_acute_flags', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    ageBand: 'adult',
    eyes: 'two',
    painYes: false,
    distanceVA: '6/36',
    pupilSelected: false,
    pupilAbnormal: false,
    frontPresent: false,
    rapdPresent: false,
    directionLightPoor: false,
    fundalSelection: 'dark',
    backSelection: 'diabetic'
  });

  const pass =
    decision.actionCode === 'posterior_disease_first' &&
    decision.actionColour === 'orange' &&
    decision.actionText === 'Treat posterior eye disease first.';

  return {
    pass,
    detail: pass
      ? 'Non-detached posterior disease defaults to orange without acute red flags.'
      : `Got actionCode=${decision.actionCode}, colour=${decision.actionColour}, actionText=${decision.actionText}`
  };
});

addCheck('phenotype_explanation_not_lost_by_confidence_label', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    eyes: 'two',
    painYes: false,
    distanceVA: '6/12',
    pupilSelected: false,
    pupilRecorded: false,
    fundalSelection: 'dark',
    backSelection: 'normal'
  });

  const pass =
    decision.cataractType.startsWith('Probable ') &&
    decision.cataractPhenotype === 'Nuclear' &&
    Boolean(decision.explanations.cataract);

  return {
    pass,
    detail: pass
      ? 'Confidence label does not remove cataract phenotype explanation.'
      : `Got type=${decision.cataractType}, phenotype=${decision.cataractPhenotype}, hasExplanation=${Boolean(decision.explanations.cataract)}`
  };
});

addCheck('unticked_pupil_does_not_weaken_cataract_type', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    eyes: 'two',
    painYes: false,
    distanceVA: '6/12',
    pupilSelected: false,
    pupilRecorded: true,
    pupilAbnormal: false,
    fundalSelection: 'dark',
    backSelection: 'normal'
  });

  const pass =
    decision.cataractType === 'Nuclear' &&
    !decision.flags.includes('pupil_not_recorded');

  return {
    pass,
    detail: pass
      ? 'Unticked positive-only pupil control is treated as no abnormal pupil.'
      : `Got type=${decision.cataractType}, flags=${decision.flags.join(', ') || '-'}`
  };
});

addCheck('normal_reflex_va_severity_non_decreasing', () => {
  const vaLadder = ['6/6', '6/12', '6/36', '6/60', 'HM'];
  const severities = vaLadder.map((distanceVA) => {
    const decision = evaluate({
      onsetValue: 'gradual',
      eyes: 'two',
      painYes: false,
      distanceVA,
      pupilSelected: false,
      pupilAbnormal: false,
      frontPresent: false,
      fundalSelection: 'normal',
      backSelection: 'normal'
    });
    return severityFromColour(decision.actionColour);
  });

  let pass = true;
  for (let index = 0; index < severities.length - 1; index += 1) {
    if (severities[index + 1] < severities[index]) {
      pass = false;
      break;
    }
  }

  return {
    pass,
    detail: pass
      ? `Severity ladder monotonic: ${severities.join(' -> ')}`
      : `Non-monotonic severity ladder: ${severities.join(' -> ')}`
  };
});

addCheck('child_cataract_pattern_not_left_as_routine', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    ageBand: 'child',
    eyes: 'two',
    painYes: false,
    distanceVA: '6/12',
    pupilSelected: false,
    pupilAbnormal: false,
    frontPresent: false,
    fundalSelection: 'patches',
    backSelection: 'normal'
  });

  const pass =
    decision.actionColour === 'orange' &&
    decision.actionText === 'Child cataract signs: prompt paediatric referral.';

  return {
    pass,
    detail: pass
      ? 'Child cataract pattern is escalated to prompt paediatric specialist referral.'
      : `Got actionText=${decision.actionText}, colour=${decision.actionColour}`
  };
});

addCheck('dense_child_cataract_keeps_paediatric_wording', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    ageBand: 'child',
    eyes: 'two',
    painYes: false,
    distanceVA: 'HM',
    pupilRecorded: true,
    pupilAbnormal: false,
    frontPresent: false,
    fundalSelection: 'white',
    backSelection: 'poor view'
  });

  const pass =
    decision.actionColour === 'red' &&
    decision.actionText === 'Child cataract signs: prompt paediatric referral.' &&
    decision.actionNoteCodes.includes('child_cataract_delay_risk');

  return {
    pass,
    detail: pass
      ? 'Dense child cataract keeps paediatric wording while staying red.'
      : `Got actionText=${decision.actionText}, colour=${decision.actionColour}, notes=${decision.actionNoteCodes.join(', ') || '-'}`
  };
});

addCheck('rapd_routes_to_non_cataract_first_when_not_otherwise_urgent', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    ageBand: 'adult',
    eyes: 'two',
    painYes: false,
    distanceVA: '6/12',
    rapdPresent: true,
    fundalSelection: 'patches',
    backSelection: 'normal'
  });

  const pass =
    decision.actionColour === 'orange' &&
    decision.actionText === 'Neuro red flags: investigate non-cataract cause.';

  return {
    pass,
    detail: pass
      ? 'RAPD correctly shifts pathway toward non-cataract first assessment.'
      : `Got actionText=${decision.actionText}, colour=${decision.actionColour}`
  };
});

addCheck('rapd_with_abnormal_fundal_marks_competing_pathology_label', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    ageBand: 'adult',
    eyes: 'two',
    painYes: false,
    distanceVA: '6/12',
    rapdPresent: true,
    fundalSelection: 'patches',
    backSelection: 'normal'
  });

  const pass =
    decision.actionCode === 'rapd_non_cataract_first' &&
    decision.cataractType.includes('other urgent pathology suspected');

  return {
    pass,
    detail: pass
      ? 'RAPD + abnormal reflex now marks cataract label as possible competing pathology.'
      : `Got actionCode=${decision.actionCode}, cataractType=${decision.cataractType}`
  };
});

addCheck('child_va_option_maps_to_early_specialist_when_reduced', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    ageBand: 'child',
    eyes: 'two',
    painYes: false,
    distanceVA: 'fix_follow_poor',
    fundalSelection: 'normal',
    backSelection: 'normal'
  });

  const pass =
    decision.actionColour === 'orange' &&
    decision.actionText === 'Child reduced vision: early specialist assessment.';

  return {
    pass,
    detail: pass
      ? 'Child-friendly VA option triggers child reduced-vision pathway.'
      : `Got actionText=${decision.actionText}, colour=${decision.actionColour}`
  };
});

addCheck('red_output_hides_near_va_note_and_caps_notes', () => {
  const decision = evaluate({
    onsetValue: 'sudden',
    eyes: 'one',
    painYes: true,
    distanceVA: '6/60',
    nearVAValue: 'N36',
    pupilSelected: true,
    pupilAbnormal: true,
    frontPresent: true,
    rapdPresent: true,
    directionLightPoor: true,
    fundalSelection: 'patches',
    backSelection: 'normal'
  });

  const hasNearVaNoteCode = decision.actionNoteCodes.some((noteCode) =>
    noteCode.startsWith('near_va_')
  );
  const pass =
    decision.actionColour === 'red' &&
    !hasNearVaNoteCode &&
    decision.actionNotes.length <= 3 &&
    decision.actionNoteCodes.includes('urgent_trigger_painful_one_or_sudden');

  return {
    pass,
    detail: pass
      ? 'Red output stays concise: near-VA note removed, notes capped, urgent trigger preserved.'
      : `Got colour=${decision.actionColour}, noteCount=${decision.actionNotes.length}, notes=${decision.actionNoteCodes.join(', ') || '-'}.`
  };
});

addCheck('orange_output_caps_supporting_notes', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    ageBand: 'adult',
    eyes: 'two',
    painYes: false,
    distanceVA: '6/6',
    nearVAValue: 'N36',
    pupilSelected: true,
    pupilAbnormal: true,
    frontPresent: true,
    rapdPresent: true,
    directionLightPoor: true,
    fundalSelection: 'patches',
    backSelection: 'normal'
  });

  const pass = decision.actionColour === 'orange' && decision.actionNotes.length <= 3;

  return {
    pass,
    detail: pass
      ? `Orange output note count capped at ${decision.actionNotes.length}.`
      : `Got colour=${decision.actionColour}, noteCount=${decision.actionNotes.length}, notes=${decision.actionNoteCodes.join(', ') || '-'}.`
  };
});

addCheck('missing_assessment_note_names_only_missing_fields', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    ageBand: 'adult',
    eyes: 'two',
    painYes: false,
    painRecorded: false,
    distanceVA: '6/36',
    fundalSelection: 'dark',
    backSelection: 'normal',
    frontRecorded: true,
    rapdRecorded: true,
    lightRecorded: true
  });

  const pass =
    decision.actionNotes.includes('Record missing check: pain/redness.') &&
    !decision.actionNotes.includes('Record missing checks: pain, front eye, RAPD, light direction.');

  return {
    pass,
    detail: pass
      ? 'Missing-assessment note names only the missing field.'
      : `Got notes=${decision.actionNotes.join(' | ') || '-'}`
  };
});

addCheck('dense_reflex_with_relatively_good_va_prompts_recheck', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    ageBand: 'middle_aged',
    eyes: 'two',
    painYes: false,
    distanceVA: '6/12',
    nearVAValue: 'N5',
    pupilSelected: false,
    pupilAbnormal: false,
    frontPresent: false,
    rapdPresent: false,
    directionLightPoor: false,
    fundalSelection: 'white',
    backSelection: 'poor view'
  });

  const pass =
    decision.actionNoteCodes.includes('white_reflex_with_relatively_good_va') &&
    Array.isArray(decision.recheckFieldKeys) &&
    decision.recheckFieldKeys.includes('distanceVA') &&
    decision.recheckFieldKeys.includes('fundal');

  return {
    pass,
    detail: pass
      ? 'Dense reflex with relatively good BCVA now triggers explicit re-check note and highlights.'
      : `Got actionCode=${decision.actionCode}, colour=${decision.actionColour}, notes=${decision.actionNoteCodes.join(', ') || '-'}, recheck=${decision.recheckFieldKeys.join(', ') || '-'}.`
  };
});

addCheck('dense_reflex_relatively_good_va_low_risk_uses_recheck_first', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    ageBand: 'adult',
    eyes: 'two',
    painYes: false,
    distanceVA: '6/6',
    nearVAValue: 'N5',
    pupilSelected: false,
    pupilAbnormal: false,
    frontPresent: false,
    rapdPresent: false,
    directionLightPoor: false,
    fundalSelection: 'white',
    backSelection: 'poor view'
  });

  const pass =
    decision.actionCode === 'recheck_investigate_first' &&
    decision.actionColour === 'orange' &&
    decision.actionText === 'Re-check key findings first.' &&
    decision.actionNoteCodes.includes('white_reflex_with_relatively_good_va');

  return {
    pass,
    detail: pass
      ? 'Low-risk dense/relatively-good-VA mismatch now uses re-check-first main action.'
      : `Got actionCode=${decision.actionCode}, colour=${decision.actionColour}, actionText=${decision.actionText}, notes=${decision.actionNoteCodes.join(', ') || '-'}`
  };
});

addCheck('normal_reflex_unable_test_does_not_claim_very_poor_va', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    ageBand: 'middle_aged',
    eyes: 'two',
    painYes: false,
    distanceVA: 'unable_test',
    nearVAValue: 'N12',
    pupilSelected: false,
    pupilAbnormal: false,
    frontPresent: false,
    rapdPresent: false,
    directionLightPoor: false,
    fundalSelection: 'normal',
    backSelection: 'normal'
  });

  const pass =
    decision.actionCode === 'normal_reflex_untestable_va_early' &&
    decision.actionText === 'Distance VA not testable: early specialist review.' &&
    !decision.actionText.toLowerCase().includes('very poor');

  return {
    pass,
    detail: pass
      ? 'Unable-test VA now uses neutral non-poor wording on normal-reflex pathway.'
      : `Got actionCode=${decision.actionCode}, actionText=${decision.actionText}`
  };
});

addCheck('fix_follow_non_child_age_prompts_recheck', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    ageBand: 'adult',
    eyes: 'two',
    painYes: false,
    distanceVA: 'fix_follow_good',
    nearVAValue: '',
    pupilSelected: false,
    pupilAbnormal: false,
    frontPresent: false,
    rapdPresent: false,
    directionLightPoor: false,
    fundalSelection: 'normal',
    backSelection: 'normal'
  });

  const pass =
    decision.flags.includes('requires_recheck') &&
    decision.actionNoteCodes.includes('fix_follow_with_non_child_age') &&
    decision.recheckFieldKeys.includes('age') &&
    decision.recheckFieldKeys.includes('distanceVA');

  return {
    pass,
    detail: pass
      ? 'Fix/Follow with non-child age now prompts re-check on age and distance VA.'
      : `Got notes=${decision.actionNoteCodes.join(', ') || '-'}, recheck=${decision.recheckFieldKeys.join(', ') || '-'}, flags=${decision.flags.join(', ') || '-'}`
  };
});

addCheck('distance_good_near_poor_non_presbyopic_prompts_recheck', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    ageBand: 'adult',
    eyes: 'two',
    painYes: false,
    distanceVA: '6/6',
    nearVAValue: 'N36',
    pupilSelected: false,
    pupilAbnormal: false,
    frontPresent: false,
    rapdPresent: false,
    directionLightPoor: false,
    fundalSelection: 'normal',
    backSelection: 'normal'
  });

  const pass =
    decision.flags.includes('requires_recheck') &&
    decision.actionNoteCodes.includes('near_poor_with_good_distance') &&
    decision.recheckFieldKeys.includes('distanceVA') &&
    decision.recheckFieldKeys.includes('near');

  return {
    pass,
    detail: pass
      ? 'Distance-good + near-poor non-presbyopic mismatch now prompts re-check.'
      : `Got notes=${decision.actionNoteCodes.join(', ') || '-'}, recheck=${decision.recheckFieldKeys.join(', ') || '-'}, flags=${decision.flags.join(', ') || '-'}`
  };
});

addCheck('distance_good_near_poor_presbyopic_not_flagged_as_mismatch', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    ageBand: 'middle_aged',
    eyes: 'two',
    painYes: false,
    distanceVA: '6/6',
    nearVAValue: 'N36',
    pupilSelected: false,
    pupilAbnormal: false,
    frontPresent: false,
    rapdPresent: false,
    directionLightPoor: false,
    fundalSelection: 'normal',
    backSelection: 'normal'
  });

  const pass = !decision.actionNoteCodes.includes('near_poor_with_good_distance');

  return {
    pass,
    detail: pass
      ? 'Presbyopic-age near reduction is not over-flagged as mismatch.'
      : `Got notes=${decision.actionNoteCodes.join(', ') || '-'}`
  };
});

addCheck('distance_poor_near_good_prompts_recheck', () => {
  const decision = evaluate({
    onsetValue: 'gradual',
    ageBand: 'adult',
    eyes: 'two',
    painYes: false,
    distanceVA: 'HM',
    nearVAValue: 'N5',
    pupilSelected: false,
    pupilAbnormal: false,
    frontPresent: false,
    rapdPresent: false,
    directionLightPoor: false,
    fundalSelection: 'normal',
    backSelection: 'normal'
  });

  const pass =
    decision.flags.includes('requires_recheck') &&
    decision.actionNoteCodes.includes('near_good_with_poor_distance') &&
    decision.recheckFieldKeys.includes('distanceVA') &&
    decision.recheckFieldKeys.includes('near');

  return {
    pass,
    detail: pass
      ? 'Distance-poor + near-good mismatch now prompts re-check.'
      : `Got notes=${decision.actionNoteCodes.join(', ') || '-'}, recheck=${decision.recheckFieldKeys.join(', ') || '-'}, flags=${decision.flags.join(', ') || '-'}`
  };
});

const results = checks.map((check) => {
  const outcome = check.runFn();
  return {
    id: check.id,
    pass: Boolean(outcome.pass),
    detail: outcome.detail || ''
  };
});

const failed = results.filter((result) => !result.pass);
const passed = results.filter((result) => result.pass);

const lines = [];
lines.push('Cataract Acceptance Audit');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push(`Total checks: ${results.length}`);
lines.push(`Passed: ${passed.length}`);
lines.push(`Failed: ${failed.length}`);
lines.push('');
lines.push('Results');
lines.push('-------');
for (const result of results) {
  lines.push(`${result.pass ? 'PASS' : 'FAIL'} ${result.id}`);
  if (result.detail) {
    lines.push(`  ${result.detail}`);
  }
}
lines.push('');

const report = lines.join('\n');
const outputPath = path.join(process.cwd(), OUTPUT_REPORT_FILE);
fs.writeFileSync(outputPath, report, 'utf8');

console.log(report);
console.log(`Report written to: ${OUTPUT_REPORT_FILE}`);

if (failed.length > 0) {
  process.exitCode = 1;
}
