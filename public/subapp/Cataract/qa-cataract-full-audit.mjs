import fs from 'node:fs';
import path from 'node:path';
import { evaluateCataractDecision } from './src/cataract-engine.js';

const OUTPUT_REPORT_FILE = 'full-audit-report.txt';

const onsetOptions = ['', 'gradual', 'sudden'];
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
  '',
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
const fundalOptions = ['', 'normal', 'dark', 'patches', 'spots', 'white'];
const backOptions = ['', 'normal', 'cupping', 'diabetic', 'detached', 'poor view'];
const orderedDistanceOptions = ['6/6', '6/12', '6/36', '6/60', 'HM'];

const SEVERITY_ORDER = ['P0', 'P1', 'P2', 'P3'];
const ACTION_COLOUR_TO_RANK = {
  black: 0,
  green: 1,
  orange: 2,
  red: 3
};

const MAX_ACTION_NOTES_BY_COLOUR = {
  black: 0,
  green: 2,
  orange: 3,
  red: 3
};

const ROUTINE_REVIEW_ACTION_CODES = new Set([
  'cataract_routine',
  'cataract_early_review_va_6_6',
  'cataract_early_review_mild_va',
  'normal_reflex_mild_review',
  'normal_reflex_no_referral'
]);

const PAEDIATRIC_AGE_BANDS = new Set(['baby', 'child', 'adolescent']);
const NEAR_VA_NOTE_CODE_BY_VALUE = {
  N8: 'near_va_n8',
  N12: 'near_va_n12',
  N18: 'near_va_n18',
  N36: 'near_va_n36'
};

const ISSUE_DEFINITIONS = {
  complete_state_no_result: {
    severity: 'P0',
    description: 'A clinically complete state did not produce an action.'
  },
  posterior_override_missing: {
    severity: 'P0',
    description: 'Posterior disease did not map to posterior-first pathway.'
  },
  painful_sudden_unilateral_not_urgent: {
    severity: 'P0',
    description: 'Sudden painful unilateral pattern did not trigger urgent signaling.'
  },
  white_reflex_priority_missing: {
    severity: 'P0',
    description: 'White reflex did not stay on priority cataract pathway.'
  },
  incomplete_state_returned_action: {
    severity: 'P1',
    description: 'Incomplete state returned a definitive action.'
  },
  missing_expected_recheck_warning: {
    severity: 'P1',
    description: 'Contradictory state did not include re-check warning.'
  },
  missing_expected_recheck_highlight: {
    severity: 'P1',
    description: 'Contradictory state did not include expected re-check fields.'
  },
  normal_6_6_has_cataract_referral: {
    severity: 'P1',
    description: 'Normal reflex + normal back + VA 6/6 produced cataract referral wording.'
  },
  sudden_pain_white_not_urgent_main: {
    severity: 'P1',
    description: 'Sudden painful white-reflex scenario did not route to urgent same-day main action.'
  },
  gradual_unilateral_pain_overurgent: {
    severity: 'P1',
    description: 'Gradual painful unilateral baseline was escalated to red urgent action without extra red flags.'
  },
  posterior_non_detached_overurgent: {
    severity: 'P1',
    description: 'Non-detached posterior override (cupping/diabetic) was red without acute red flags.'
  },
  posterior_action_without_posterior_finding: {
    severity: 'P1',
    description: 'Posterior-first action was emitted without posterior pathology.'
  },
  detached_not_red: {
    severity: 'P1',
    description: 'Detached retina pathway was not red.'
  },
  child_abnormal_fundal_under_escalated: {
    severity: 'P1',
    description: 'Child with abnormal fundal pattern was not escalated at least to orange.'
  },
  child_reduced_va_under_escalated: {
    severity: 'P1',
    description: 'Child with reduced vision and normal reflex was not escalated at least to orange.'
  },
  severity_rank_mismatch: {
    severity: 'P2',
    description: 'Engine severity rank is inconsistent with action colour.'
  },
  contradictory_action_text: {
    severity: 'P2',
    description: 'Action text contains conflicting pathway wording.'
  },
  urgent_word_not_red: {
    severity: 'P2',
    description: 'Action text contains urgent wording but action colour is not red.'
  },
  urgency_note_exceeds_action_colour: {
    severity: 'P2',
    description: 'Urgency note colour implies higher severity than the main action colour.'
  },
  non_monotonic_va_severity: {
    severity: 'P2',
    description: 'Severity dropped as VA worsened within a fixed clinical signature.'
  },
  missing_cataract_explanation_for_abnormal_reflex: {
    severity: 'P2',
    description: 'Abnormal reflex pathway did not provide cataract explanation text.'
  },
  routine_action_with_high_risk_checks: {
    severity: 'P2',
    description: 'Routine/review action persisted despite re-check warning in high-risk context.'
  },
  red_action_without_red_trigger: {
    severity: 'P2',
    description: 'Red action occurred without a matching red clinical trigger.'
  },
  rapd_override_without_neuro_flags: {
    severity: 'P2',
    description: 'RAPD/non-cataract override was used without neuro flags.'
  },
  missing_rapd_override_when_eligible: {
    severity: 'P2',
    description: 'Neuro flags eligible for RAPD override did not route to non-cataract-first/urgent.'
  },
  non_cataract_main_action_without_competing_confidence: {
    severity: 'P2',
    description: 'Non-cataract-first urgent pathway kept cataract confidence too definitive.'
  },
  requires_recheck_without_fields: {
    severity: 'P2',
    description: 'Re-check flag was set but no fields were highlighted.'
  },
  recheck_fields_without_flag: {
    severity: 'P2',
    description: 'Re-check fields were highlighted without re-check flag.'
  },
  black_action_with_notes: {
    severity: 'P2',
    description: 'Black/low-severity action still displayed supporting warning notes.'
  },
  action_notes_over_policy_limit: {
    severity: 'P2',
    description: 'Supporting note count exceeded policy limit for the action colour.'
  },
  red_action_contains_near_va_note: {
    severity: 'P2',
    description: 'Red outputs should suppress near-VA detail notes to keep urgent messaging concise.'
  },
  action_text_over_18_words: {
    severity: 'P3',
    description: 'Core action text exceeds 18 words and may be too long for rapid use.'
  },
  ui_unreachable_combo_returns_action: {
    severity: 'P3',
    description: 'UI-unreachable combo still produces a decision in the engine.'
  },
  missing_posterior_specific_note: {
    severity: 'P3',
    description: 'Posterior-first action lacked the expected specific posterior check note.'
  },
  near_va_note_mismatch: {
    severity: 'P3',
    description: 'Near-VA note presence did not match near-VA input pattern.'
  },
  pupil_confidence_note_without_pupil_abnormal: {
    severity: 'P3',
    description: 'Pupil-specific confidence wording appeared without abnormal pupil input.'
  },
  recorded_normal_pupil_downgraded_confidence: {
    severity: 'P2',
    description: 'Recorded normal pupil was treated like an unrecorded pupil.'
  }
};

const summary = {
  totalStates: 0,
  whiteConstraintReachable: 0,
  whiteConstraintUnreachable: 0,
  normalizedWhiteBackStates: 0,
  completeStates: 0,
  incompleteStates: 0,
  completeReachableStates: 0,
  completeUnreachableStates: 0,
  hasResultStates: 0,
  noResultStates: 0,
  completeHasResultStates: 0,
  completeNoResultStates: 0,
  incompleteHasResultStates: 0,
  incompleteNoResultStates: 0
};

const issues = new Map();
const monotonicBuckets = new Map();

function comboToText(combo) {
  return `onset=${combo.onsetValue || '-'}, age=${combo.ageBand || '-'}, eyes=${combo.eyes || '-'}, pain=${
    combo.painYes ? 'yes' : 'no'
  }, distance=${combo.distanceVA || '-'}, near=${combo.nearVAValue || '-'}, pupil=${
    combo.pupilStatus || '-'
  }, front=${combo.frontPresent ? 'yes' : 'no'}, rapd=${combo.rapdPresent ? 'yes' : 'no'}, light_poor=${
    combo.directionLightPoor ? 'yes' : 'no'
  }, fundal=${combo.fundalSelection || '-'}, back=${
    combo.backSelection || '-'
  }`;
}

function buildPupilInput(pupilStatus) {
  return {
    pupilStatus,
    pupilSelected: pupilStatus !== 'unrecorded',
    pupilRecorded: pupilStatus !== 'unrecorded',
    pupilAbnormal: pupilStatus === 'abnormal'
  };
}

function addIssue(id, combo, decision, note, sampleLimit = 8) {
  const definition = ISSUE_DEFINITIONS[id];
  if (!definition) {
    throw new Error(`Unknown issue id: ${id}`);
  }

  const existing = issues.get(id) || {
    severity: definition.severity,
    description: definition.description,
    count: 0,
    samples: []
  };
  existing.count += 1;
  if (existing.samples.length < sampleLimit) {
    existing.samples.push({
      combo,
      note,
      actionCode: decision?.actionCode || '',
      actionColour: decision?.actionColour || '',
      severityRank: decision?.severityRank ?? '',
      actionText: decision?.actionText || '',
      flags: Array.isArray(decision?.flags) ? decision.flags : [],
      recheckFieldKeys: Array.isArray(decision?.recheckFieldKeys) ? decision.recheckFieldKeys : []
    });
  }
  issues.set(id, existing);
}

function hasEveryValue(values, expected) {
  return expected.every((item) => values.includes(item));
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
                  summary.totalStates += 1;

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

                  const isWhiteConstraintReachable = !(
                    fundalSelection === 'white' &&
                    backSelection !== '' &&
                    backSelection !== 'poor view'
                  );
                  const isComplete = Boolean(
                    onsetValue && eyes && distanceVA && fundalSelection && backSelection
                  );

                  if (isWhiteConstraintReachable) {
                    summary.whiteConstraintReachable += 1;
                  } else {
                    summary.whiteConstraintUnreachable += 1;
                  }

                  if (isComplete) {
                    summary.completeStates += 1;
                    if (isWhiteConstraintReachable) {
                      summary.completeReachableStates += 1;
                    } else {
                      summary.completeUnreachableStates += 1;
                    }
                  } else {
                    summary.incompleteStates += 1;
                  }

                  const decision = evaluateCataractDecision(combo);
                  if (decision.hasResult) {
                    summary.hasResultStates += 1;
                    if (Array.isArray(decision.flags) && decision.flags.includes('normalized_white_back_forced_poor_view')) {
                      summary.normalizedWhiteBackStates += 1;
                    }
                    if (isComplete) {
                      summary.completeHasResultStates += 1;
                    } else {
                      summary.incompleteHasResultStates += 1;
                    }
                  } else {
                    summary.noResultStates += 1;
                    if (isComplete) {
                      summary.completeNoResultStates += 1;
                    } else {
                      summary.incompleteNoResultStates += 1;
                    }
                  }

                  if (isComplete && !decision.hasResult) {
                    addIssue(
                      'complete_state_no_result',
                      combo,
                      decision,
                      'Expected complete states to produce a decision.'
                    );
                  }

                  if (!isComplete && decision.hasResult) {
                    addIssue(
                      'incomplete_state_returned_action',
                      combo,
                      decision,
                      `Missing fields: ${decision.requiredInputKeys
                        ?.filter((field) => !(combo[field] || combo[`${field}Value`]))
                        .join(', ') || 'unknown'}`
                    );
                  }

                  if (
                    !isWhiteConstraintReachable &&
                    decision.hasResult &&
                    !(Array.isArray(decision.flags) &&
                      decision.flags.includes('normalized_white_back_forced_poor_view'))
                  ) {
                    addIssue(
                      'ui_unreachable_combo_returns_action',
                      combo,
                      decision,
                      'White reflex UI flow should force poor view.'
                    );
                  }

                  if (!decision.hasResult) {
                    continue;
                  }

                  const actionTextLower = decision.actionText.toLowerCase();
                  const actionRank = ACTION_COLOUR_TO_RANK[decision.actionColour] ?? 0;
                  const urgencyRank = ACTION_COLOUR_TO_RANK[decision.urgencyNoteColour] ?? 0;
                  const severeTriad =
                    onsetValue === 'sudden' && eyes === 'one' && Boolean(painYes);
                  const hasNormalizedWhiteBack =
                    Array.isArray(decision.flags) &&
                    decision.flags.includes('normalized_white_back_forced_poor_view');
                  const effectiveBackSelection = hasNormalizedWhiteBack
                    ? 'poor view'
                    : backSelection;
                  const hasPosteriorPriorityDisease = ['cupping', 'diabetic', 'detached'].includes(
                    effectiveBackSelection
                  );
                  const expectsRecheckForVaMismatch =
                    fundalSelection !== '' &&
                    ((fundalSelection === 'normal' &&
                      ['6/36', '6/60', 'HM', 'fix_follow_poor', 'unable_test'].includes(distanceVA)) ||
                      (fundalSelection !== 'normal' &&
                        distanceVA === '6/6' &&
                        !hasPosteriorPriorityDisease));
                  const expectsRecheckForDenseRelativelyGoodVa =
                    fundalSelection === 'white' &&
                    ['6/6', '6/12'].includes(distanceVA) &&
                    !hasPosteriorPriorityDisease;
                  const expectsRecheckForOnsetMismatch =
                    onsetValue === 'sudden' &&
                    fundalSelection !== '' &&
                    fundalSelection !== 'normal' &&
                    !hasPosteriorPriorityDisease &&
                    !severeTriad;
                  const expectsRecheckForPainMismatch =
                    Boolean(painYes) &&
                    fundalSelection !== '' &&
                    fundalSelection !== 'normal' &&
                    !hasPosteriorPriorityDisease &&
                    !severeTriad;
                  const expectsRecheckForPainWithoutEyes =
                    Boolean(painYes) && !eyes && !hasPosteriorPriorityDisease;
                  const expectsRecheckForNormalReflexPoorView =
                    fundalSelection === 'normal' && effectiveBackSelection === 'poor view';
                  const hasHighRiskContext =
                    onsetValue === 'sudden' ||
                    Boolean(painYes) ||
                    pupilStatus === 'abnormal' ||
                    frontPresent ||
                    rapdPresent ||
                    directionLightPoor;
                  const isPaediatric = PAEDIATRIC_AGE_BANDS.has(ageBand);
                  const hasNeuroFlags = Boolean(rapdPresent) || Boolean(directionLightPoor);
                  const noteCodes = Array.isArray(decision.actionNoteCodes)
                    ? decision.actionNoteCodes
                    : [];
                  const recheckFieldKeys = Array.isArray(decision.recheckFieldKeys)
                    ? decision.recheckFieldKeys
                    : [];
                  const hasRequiresRecheckFlag = decision.flags.includes('requires_recheck');
                  const hasRedTrigger =
                    effectiveBackSelection === 'detached' ||
                    (fundalSelection === 'white' && !hasPosteriorPriorityDisease) ||
                    (onsetValue === 'sudden' && Boolean(painYes));
                  const allowsWhiteRelativelyGoodVaRecheckOverride =
                    fundalSelection === 'white' &&
                    effectiveBackSelection === 'poor view' &&
                    ['6/6', '6/12', 'fix_follow_good'].includes(distanceVA) &&
                    onsetValue === 'gradual' &&
                    !Boolean(painYes) &&
                    pupilStatus !== 'abnormal' &&
                    !frontPresent &&
                    !hasNeuroFlags &&
                    !isPaediatric &&
                    decision.actionCode === 'recheck_investigate_first';
                  const allowsPaediatricWhiteAction =
                    isPaediatric &&
                    decision.actionCode === 'child_cataract_prompt_referral' &&
                    decision.actionColour === 'red';

                  if (
                    hasPosteriorPriorityDisease &&
                    decision.actionCode !== 'posterior_disease_first'
                  ) {
                    addIssue(
                      'posterior_override_missing',
                      combo,
                      decision,
                      'Posterior pathology should dominate action routing.'
                    );
                  }

                  if (
                    decision.actionCode === 'posterior_disease_first' &&
                    !hasPosteriorPriorityDisease
                  ) {
                    addIssue(
                      'posterior_action_without_posterior_finding',
                      combo,
                      decision,
                      'Posterior-first action should only occur with posterior pathology.'
                    );
                  }

                  if (
                    effectiveBackSelection === 'detached' &&
                    decision.actionCode === 'posterior_disease_first' &&
                    decision.actionColour !== 'red'
                  ) {
                    addIssue(
                      'detached_not_red',
                      combo,
                      decision,
                      'Detached retina pathway should remain red.'
                    );
                  }

                  if (
                    fundalSelection === 'white' &&
                    effectiveBackSelection === 'poor view' &&
                    decision.actionCode !== 'cataract_priority_white'
                    &&
                    !allowsWhiteRelativelyGoodVaRecheckOverride &&
                    !allowsPaediatricWhiteAction &&
                    !(onsetValue === 'sudden' && Boolean(painYes) && decision.actionCode === 'urgent_same_day_investigation')
                  ) {
                    addIssue(
                      'white_reflex_priority_missing',
                      combo,
                      decision,
                      'White reflex should map to priority cataract pathway.'
                    );
                  }

                  if (
                    fundalSelection === 'white' &&
                    !hasPosteriorPriorityDisease &&
                    onsetValue === 'sudden' &&
                    Boolean(painYes) &&
                    decision.actionCode !== 'urgent_same_day_investigation'
                  ) {
                    addIssue(
                      'sudden_pain_white_not_urgent_main',
                      combo,
                      decision,
                      'Sudden painful white-reflex states should use urgent same-day main action.'
                    );
                  }

                  if (
                    severeTriad &&
                    !decision.flags.includes('urgent_signal') &&
                    !decision.urgencyNote.toLowerCase().includes('urgent')
                  ) {
                    addIssue(
                      'painful_sudden_unilateral_not_urgent',
                      combo,
                      decision,
                      'High-risk triad did not trigger urgent path.'
                    );
                  }

                  if (
                    onsetValue === 'gradual' &&
                    eyes === 'one' &&
                    Boolean(painYes) &&
                    distanceVA === '6/6' &&
                    pupilStatus !== 'abnormal' &&
                    !frontPresent &&
                    !rapdPresent &&
                    !directionLightPoor &&
                    fundalSelection === 'normal' &&
                    effectiveBackSelection === 'normal' &&
                    (decision.actionCode === 'urgent_same_day_investigation' ||
                      decision.actionColour === 'red')
                  ) {
                    addIssue(
                      'gradual_unilateral_pain_overurgent',
                      combo,
                      decision,
                      'Baseline gradual painful unilateral case should not force red urgent action.'
                    );
                  }

                  if (
                    onsetValue === 'gradual' &&
                    !Boolean(painYes) &&
                    pupilStatus !== 'abnormal' &&
                    !frontPresent &&
                    !rapdPresent &&
                    !directionLightPoor &&
                    (effectiveBackSelection === 'cupping' || effectiveBackSelection === 'diabetic') &&
                    decision.actionCode === 'posterior_disease_first' &&
                    decision.actionColour === 'red'
                  ) {
                    addIssue(
                      'posterior_non_detached_overurgent',
                      combo,
                      decision,
                      'Cupping/diabetic posterior override should default to orange when no acute red flags are present.'
                    );
                  }

                  if (
                    isPaediatric &&
                    fundalSelection !== 'normal' &&
                    !hasPosteriorPriorityDisease &&
                    actionRank < 2
                  ) {
                    addIssue(
                      'child_abnormal_fundal_under_escalated',
                      combo,
                      decision,
                      'Child abnormal fundal states should not be black/green.'
                    );
                  }

                  if (
                    isPaediatric &&
                    fundalSelection === 'normal' &&
                    distanceVA !== '6/6' &&
                    !hasPosteriorPriorityDisease &&
                    actionRank < 2
                  ) {
                    addIssue(
                      'child_reduced_va_under_escalated',
                      combo,
                      decision,
                      'Child reduced-vision normal-reflex states should be at least orange.'
                    );
                  }

                  if (
                    fundalSelection === 'normal' &&
                    backSelection === 'normal' &&
                    distanceVA === '6/6' &&
                    (actionTextLower.includes('routine cataract referral') ||
                      actionTextLower.includes('priority cataract referral'))
                  ) {
                    addIssue(
                      'normal_6_6_has_cataract_referral',
                      combo,
                      decision,
                      'No reflex/pathology evidence but cataract referral wording appeared.'
                    );
                  }

                  if (
                    expectsRecheckForVaMismatch ||
                    expectsRecheckForDenseRelativelyGoodVa ||
                    expectsRecheckForOnsetMismatch ||
                    expectsRecheckForPainMismatch ||
                    expectsRecheckForPainWithoutEyes ||
                    expectsRecheckForNormalReflexPoorView
                  ) {
                    if (!decision.flags.includes('requires_recheck')) {
                      addIssue(
                        'missing_expected_recheck_warning',
                        combo,
                        decision,
                        'Expected a re-check warning for this mismatch pattern.'
                      );
                    } else {
                      const expectedFields = new Set();
                      if (expectsRecheckForVaMismatch) {
                        expectedFields.add('distanceVA');
                        expectedFields.add('fundal');
                      }
                      if (expectsRecheckForDenseRelativelyGoodVa) {
                        expectedFields.add('distanceVA');
                        expectedFields.add('fundal');
                      }
                      if (expectsRecheckForOnsetMismatch) {
                        expectedFields.add('onset');
                      }
                      if (expectsRecheckForPainMismatch) {
                        expectedFields.add('pain');
                        expectedFields.add('fundal');
                      }
                      if (expectsRecheckForPainWithoutEyes) {
                        expectedFields.add('eyes');
                        expectedFields.add('pain');
                      }
                      if (expectsRecheckForNormalReflexPoorView) {
                        expectedFields.add('fundal');
                        expectedFields.add('back');
                      }
                      const recheckFields = Array.isArray(decision.recheckFieldKeys)
                        ? decision.recheckFieldKeys
                        : [];
                      if (!hasEveryValue(recheckFields, [...expectedFields])) {
                        addIssue(
                          'missing_expected_recheck_highlight',
                          combo,
                          decision,
                          `Expected fields: ${[...expectedFields].join(', ')} | got: ${recheckFields.join(
                            ', '
                          )}`
                        );
                      }
                    }
                  }

                  const expectedSeverityRank = ACTION_COLOUR_TO_RANK[decision.actionColour];
                  if (decision.severityRank !== expectedSeverityRank) {
                    addIssue(
                      'severity_rank_mismatch',
                      combo,
                      decision,
                      `Expected severity rank ${expectedSeverityRank} from colour ${decision.actionColour}.`
                    );
                  }

                  const hasContradictoryText =
                    actionTextLower.includes('no cataract referral') &&
                    (actionTextLower.includes('routine cataract referral') ||
                      actionTextLower.includes('priority cataract referral'));
                  if (hasContradictoryText) {
                    addIssue(
                      'contradictory_action_text',
                      combo,
                      decision,
                      'Action string contains mutually contradictory pathway text.'
                    );
                  }

                  if (actionTextLower.includes('urgent') && decision.actionColour !== 'red') {
                    addIssue(
                      'urgent_word_not_red',
                      combo,
                      decision,
                      'Urgent wording should map to red action colour.'
                    );
                  }

                  if (urgencyRank > actionRank) {
                    addIssue(
                      'urgency_note_exceeds_action_colour',
                      combo,
                      decision,
                      `Urgency note colour ${decision.urgencyNoteColour} exceeds action colour ${decision.actionColour}.`
                    );
                  }

                  if (actionRank === ACTION_COLOUR_TO_RANK.red && !hasRedTrigger) {
                    addIssue(
                      'red_action_without_red_trigger',
                      combo,
                      decision,
                      'Red output should be traceable to detached/white or sudden+pain trigger.'
                    );
                  }

                  if (decision.actionCode === 'rapd_non_cataract_first' && !hasNeuroFlags) {
                    addIssue(
                      'rapd_override_without_neuro_flags',
                      combo,
                      decision,
                      'RAPD non-cataract override requires RAPD or poor light-direction flag.'
                    );
                  }

                  if (
                    hasNeuroFlags &&
                    !hasPosteriorPriorityDisease &&
                    fundalSelection !== 'white' &&
                    decision.actionCode !== 'rapd_non_cataract_first' &&
                    decision.actionCode !== 'urgent_same_day_investigation'
                  ) {
                    addIssue(
                      'missing_rapd_override_when_eligible',
                      combo,
                      decision,
                      'Neuro-flag states should route to RAPD non-cataract-first (or urgent if red-triggered).'
                    );
                  }

                  if (
                    (decision.actionCode === 'rapd_non_cataract_first' ||
                      decision.actionCode === 'urgent_same_day_investigation') &&
                    !hasPosteriorPriorityDisease &&
                    fundalSelection !== 'normal' &&
                    decision.cataractType !== 'Nil' &&
                    !decision.cataractType.includes('other urgent pathology suspected')
                  ) {
                    addIssue(
                      'non_cataract_main_action_without_competing_confidence',
                      combo,
                      decision,
                      'Non-cataract-first action with abnormal reflex should use possible-competing confidence label.'
                    );
                  }

                  if (
                    fundalSelection !== '' &&
                    fundalSelection !== 'normal' &&
                    !hasPosteriorPriorityDisease &&
                    !decision.explanations?.cataract
                  ) {
                    addIssue(
                      'missing_cataract_explanation_for_abnormal_reflex',
                      combo,
                      decision,
                      'Abnormal reflex should retain phenotype explanation text.'
                    );
                  }

                  if (
                    ROUTINE_REVIEW_ACTION_CODES.has(decision.actionCode) &&
                    decision.flags.includes('requires_recheck') &&
                    hasHighRiskContext
                  ) {
                    addIssue(
                      'routine_action_with_high_risk_checks',
                      combo,
                      decision,
                      'Routine/review action should be overridden in high-risk re-check contexts.'
                    );
                  }

                  if (hasRequiresRecheckFlag && recheckFieldKeys.length === 0) {
                    addIssue(
                      'requires_recheck_without_fields',
                      combo,
                      decision,
                      'Re-check warning should highlight at least one source field.'
                    );
                  }

                  if (!hasRequiresRecheckFlag && recheckFieldKeys.length > 0) {
                    addIssue(
                      'recheck_fields_without_flag',
                      combo,
                      decision,
                      'Re-check highlights should not appear without requires_recheck flag.'
                    );
                  }

                  if (actionRank === ACTION_COLOUR_TO_RANK.black && decision.actionNotes.length > 0) {
                    addIssue(
                      'black_action_with_notes',
                      combo,
                      decision,
                      'Black action should not carry residual warning/check note text.'
                    );
                  }

                  const maxAllowedNotes =
                    MAX_ACTION_NOTES_BY_COLOUR[decision.actionColour] ?? Number.POSITIVE_INFINITY;
                  if (decision.actionNotes.length > maxAllowedNotes) {
                    addIssue(
                      'action_notes_over_policy_limit',
                      combo,
                      decision,
                      `Action colour ${decision.actionColour} allows <=${maxAllowedNotes} notes, got ${decision.actionNotes.length}.`
                    );
                  }

                  if (
                    decision.actionColour === 'red' &&
                    noteCodes.some((noteCode) => noteCode.startsWith('near_va_'))
                  ) {
                    addIssue(
                      'red_action_contains_near_va_note',
                      combo,
                      decision,
                      'Red actions should hide near-VA notes to keep urgent messaging concise.'
                    );
                  }

                  if (decision.actionCode === 'posterior_disease_first') {
                    const posteriorExpectedNoteCode =
                      effectiveBackSelection === 'detached'
                        ? 'posterior_detached_same_day'
                        : effectiveBackSelection === 'diabetic'
                          ? 'posterior_diabetic_first'
                          : effectiveBackSelection === 'cupping'
                            ? 'posterior_cupping_glaucoma'
                            : '';
                    if (posteriorExpectedNoteCode && !noteCodes.includes(posteriorExpectedNoteCode)) {
                      addIssue(
                        'missing_posterior_specific_note',
                        combo,
                        decision,
                        `Expected noteCode=${posteriorExpectedNoteCode} for posterior pathway.`
                      );
                    }
                  }

                  if (
                    nearVAValue in NEAR_VA_NOTE_CODE_BY_VALUE &&
                    actionRank > ACTION_COLOUR_TO_RANK.black &&
                    decision.actionColour !== 'red' &&
                    !decision.flags.includes('notes_trimmed')
                  ) {
                    const expectedNearCode = NEAR_VA_NOTE_CODE_BY_VALUE[nearVAValue];
                    if (!noteCodes.includes(expectedNearCode)) {
                      addIssue(
                        'near_va_note_mismatch',
                        combo,
                        decision,
                        `Near VA ${nearVAValue} should include ${expectedNearCode} note when action is non-red and notes are not trimmed.`
                      );
                    }
                  }
                  if (
                    (nearVAValue === '' || nearVAValue === 'N5') &&
                    noteCodes.some((noteCode) => noteCode.startsWith('near_va_'))
                  ) {
                    addIssue(
                      'near_va_note_mismatch',
                      combo,
                      decision,
                      'Near VA notes should not appear for blank/N5 near VA.'
                    );
                  }

                  if (
                    decision.cataractType.toLowerCase().includes('pupil abnormality') &&
                    pupilStatus !== 'abnormal'
                  ) {
                    addIssue(
                      'pupil_confidence_note_without_pupil_abnormal',
                      combo,
                      decision,
                      'Pupil-abnormal confidence label should only appear when pupil abnormal is selected.'
                    );
                  }

                  if (
                    pupilStatus === 'normal' &&
                    decision.cataractType.toLowerCase().startsWith('probable ')
                  ) {
                    addIssue(
                      'recorded_normal_pupil_downgraded_confidence',
                      combo,
                      decision,
                      'A recorded normal pupil should not downgrade cataract type to probable.'
                    );
                  }

                  const actionWordCount = decision.actionText
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean).length;
                  if (actionWordCount > 18) {
                    addIssue(
                      'action_text_over_18_words',
                      combo,
                      decision,
                      `Action text has ${actionWordCount} words.`
                    );
                  }

                  if (isComplete && isWhiteConstraintReachable) {
                    const signature = [
                      onsetValue,
                      ageBand,
                      eyes,
                      painYes ? 'yes' : 'no',
                      nearVAValue,
                      pupilStatus,
                      frontPresent ? 'yes' : 'no',
                      rapdPresent ? 'yes' : 'no',
                      directionLightPoor ? 'yes' : 'no',
                      fundalSelection,
                      backSelection
                    ].join('|');
                    const existingBucket =
                      monotonicBuckets.get(signature) ||
                      {
                        base: {
                          onsetValue,
                          ageBand,
                          eyes,
                          painYes,
                          nearVAValue,
                          pupilStatus,
                          frontPresent,
                          rapdPresent,
                          directionLightPoor,
                          fundalSelection,
                          backSelection
                        },
                        decisionsByDistance: {}
                      };
                    existingBucket.decisionsByDistance[distanceVA] = decision;
                    monotonicBuckets.set(signature, existingBucket);
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

for (const bucket of monotonicBuckets.values()) {
  for (let index = 0; index < orderedDistanceOptions.length - 1; index += 1) {
    const currentDistance = orderedDistanceOptions[index];
    const nextDistance = orderedDistanceOptions[index + 1];
    const currentDecision = bucket.decisionsByDistance[currentDistance];
    const nextDecision = bucket.decisionsByDistance[nextDistance];

    if (!currentDecision || !nextDecision || !currentDecision.hasResult || !nextDecision.hasResult) {
      continue;
    }

    const isConsistencyPenaltyPair =
      currentDecision.flags.includes('consistency_warning') ||
      nextDecision.flags.includes('consistency_warning');
    if (isConsistencyPenaltyPair) {
      continue;
    }

    if (nextDecision.severityRank < currentDecision.severityRank) {
      addIssue(
        'non_monotonic_va_severity',
        {
          ...bucket.base,
          distanceVA: `${currentDistance} -> ${nextDistance}`,
          pupilSelected: bucket.base.pupilStatus !== 'unrecorded',
          pupilRecorded: bucket.base.pupilStatus !== 'unrecorded',
          pupilAbnormal: bucket.base.pupilStatus === 'abnormal',
          nearVAValue: bucket.base.nearVAValue
        },
        nextDecision,
        `Severity dropped from ${currentDecision.severityRank} to ${nextDecision.severityRank} when VA worsened.`
      );
    }
  }
}

const issueEntries = [...issues.entries()].sort((left, right) => {
  const leftSeverity = SEVERITY_ORDER.indexOf(left[1].severity);
  const rightSeverity = SEVERITY_ORDER.indexOf(right[1].severity);
  if (leftSeverity !== rightSeverity) {
    return leftSeverity - rightSeverity;
  }
  return right[1].count - left[1].count;
});

const issueCountsBySeverity = SEVERITY_ORDER.reduce((accumulator, severity) => {
  accumulator[severity] = issueEntries
    .filter((entry) => entry[1].severity === severity)
    .reduce((sum, entry) => sum + entry[1].count, 0);
  return accumulator;
}, {});

const recommendations = [];

if (issues.has('complete_state_no_result')) {
  recommendations.push(
    'P0: Complete states are dropping out with no result. Fix required-field logic or fallback rendering immediately.'
  );
}
if (issues.has('posterior_override_missing')) {
  recommendations.push(
    'P0: Posterior pathology override is leaking. Hard-lock posterior-disease routing before any cataract pathway.'
  );
}
if (issues.has('painful_sudden_unilateral_not_urgent')) {
  recommendations.push(
    'P0: Sudden painful unilateral risk triad must force urgent signal in both action and metadata flags.'
  );
}
if (issues.has('white_reflex_priority_missing')) {
  recommendations.push(
    'P0: White reflex pathway is inconsistent. Enforce priority referral code for white+poor view states.'
  );
}
if (issues.has('incomplete_state_returned_action')) {
  recommendations.push(
    'P1: Incomplete states are returning definitive actions. Consider hard-gating engine outputs until required fields are present.'
  );
}
if (issues.has('sudden_pain_white_not_urgent_main')) {
  recommendations.push(
    'P1: Sudden painful white-reflex states should use urgent same-day main action (not note-only urgency).'
  );
}
if (issues.has('posterior_action_without_posterior_finding')) {
  recommendations.push(
    'P1: Posterior-first action should be gated to posterior findings only (cupping/diabetic/detached).'
  );
}
if (issues.has('detached_not_red')) {
  recommendations.push('P1: Detached retina pathway should remain red unless policy explicitly changes.');
}
if (issues.has('gradual_unilateral_pain_overurgent')) {
  recommendations.push(
    'P1: Do not auto-force red urgent action for gradual painful unilateral baseline without extra red flags.'
  );
}
if (issues.has('posterior_non_detached_overurgent')) {
  recommendations.push(
    'P1: Keep non-detached posterior override (cupping/diabetic) at orange unless separate acute red flags exist.'
  );
}
if (issues.has('missing_expected_recheck_warning') || issues.has('missing_expected_recheck_highlight')) {
  recommendations.push(
    'P1: Re-check logic is incomplete. Add rule-specific recheck flags and ensure field highlights match warnings.'
  );
}
if (issues.has('child_abnormal_fundal_under_escalated') || issues.has('child_reduced_va_under_escalated')) {
  recommendations.push(
    'P1: Paediatric risk states should not remain low-severity; enforce at least orange escalation.'
  );
}
if (issues.has('non_monotonic_va_severity')) {
  recommendations.push(
    'P2: Severity non-monotonicity across VA transitions suggests inconsistent urgency scaling. Review VA ladder mapping.'
  );
}
if (issues.has('missing_cataract_explanation_for_abnormal_reflex')) {
  recommendations.push(
    'P2: Preserve phenotype explanation text for abnormal reflex states to keep cataract-specific guidance transparent.'
  );
}
if (issues.has('routine_action_with_high_risk_checks')) {
  recommendations.push(
    'P2: Override routine/review action when high-risk context also triggers re-check warnings.'
  );
}
if (issues.has('red_action_without_red_trigger')) {
  recommendations.push(
    'P2: Red outputs should require explicit red trigger pathways (detached/white/sudden+pain).'
  );
}
if (issues.has('rapd_override_without_neuro_flags') || issues.has('missing_rapd_override_when_eligible')) {
  recommendations.push(
    'P2: Keep RAPD non-cataract override tightly coupled to neuro flags when eligible.'
  );
}
if (issues.has('non_cataract_main_action_without_competing_confidence')) {
  recommendations.push(
    'P2: Non-cataract-first urgent pathways with abnormal reflex should label cataract as possible competing pathology.'
  );
}
if (issues.has('requires_recheck_without_fields') || issues.has('recheck_fields_without_flag')) {
  recommendations.push(
    'P2: Keep re-check flags and highlighted fields synchronized in both directions.'
  );
}
if (issues.has('black_action_with_notes')) {
  recommendations.push('P2: Remove warning/check notes from black action outputs.');
}
if (issues.has('action_notes_over_policy_limit')) {
  recommendations.push(
    'P2: Enforce max supporting-note count by action severity to prevent overloaded result panels.'
  );
}
if (issues.has('red_action_contains_near_va_note')) {
  recommendations.push(
    'P2: Suppress near-VA detail notes in red outputs so urgent actions stay concise.'
  );
}
if (issues.has('ui_unreachable_combo_returns_action')) {
  recommendations.push(
    'P3: Engine accepts UI-unreachable white-reflex/back combinations. Consider input normalization for robustness.'
  );
}
if (issues.has('action_text_over_18_words')) {
  recommendations.push(
    'P3: Keep core action lines under 18 words to preserve fast bedside readability.'
  );
}
if (issues.has('missing_posterior_specific_note')) {
  recommendations.push(
    'P3: Posterior-first outputs should include detached/diabetic/cupping-specific support notes.'
  );
}
if (issues.has('near_va_note_mismatch')) {
  recommendations.push(
    'P3: Keep near-VA notes consistent with near input, red-action suppression, and note-trimming policy.'
  );
}
if (issues.has('pupil_confidence_note_without_pupil_abnormal')) {
  recommendations.push(
    'P3: Pupil-specific confidence wording must only appear when abnormal pupil is explicitly selected.'
  );
}
if (issues.has('recorded_normal_pupil_downgraded_confidence')) {
  recommendations.push(
    'P2: Recorded normal pupil states should not be downgraded to probable cataract labels.'
  );
}
if (recommendations.length === 0) {
  recommendations.push('No corrective recommendations from this run: no issues were detected in configured checks.');
}

const reportLines = [];
reportLines.push('Cataract Full-State Audit Report');
reportLines.push(`Generated: ${new Date().toISOString()}`);
reportLines.push('');
reportLines.push('Run Details');
reportLines.push('-----------');
reportLines.push('Command: node qa-cataract-full-audit.mjs');
reportLines.push('Engine: src/cataract-engine.js');
reportLines.push('Audit script: qa-cataract-full-audit.mjs');
reportLines.push('Mode: exhaustive cartesian enumeration (not sampling)');
reportLines.push('');
reportLines.push('State Axes Enumerated');
reportLines.push('---------------------');
reportLines.push(`Onset: ${onsetOptions.length} -> ${onsetOptions.join(', ')}`);
reportLines.push(`Age: ${ageOptions.length} -> ${ageOptions.join(', ')}`);
reportLines.push(`Eyes: ${eyesOptions.length} -> ${eyesOptions.join(', ')}`);
reportLines.push(`Pain: ${painOptions.length} -> ${painOptions.join(', ')}`);
reportLines.push(`Distance VA: ${distanceOptions.length} -> ${distanceOptions.join(', ')}`);
reportLines.push(`Near VA: ${nearOptions.length} -> ${nearOptions.join(', ')}`);
reportLines.push(`Pupil: ${pupilOptions.length} -> ${pupilOptions.join(', ')}`);
reportLines.push(`Front of eye: ${frontOptions.length} -> ${frontOptions.join(', ')}`);
reportLines.push(`RAPD: ${rapdOptions.length} -> ${rapdOptions.join(', ')}`);
reportLines.push(`Direction-light poor: ${lightOptions.length} -> ${lightOptions.join(', ')}`);
reportLines.push(`Fundal reflex: ${fundalOptions.length} -> ${fundalOptions.join(', ')}`);
reportLines.push(`Back of eye: ${backOptions.length} -> ${backOptions.join(', ')}`);
reportLines.push(
  `Total cartesian states: ${onsetOptions.length} x ${ageOptions.length} x ${eyesOptions.length} x ${painOptions.length} x ${distanceOptions.length} x ${nearOptions.length} x ${pupilOptions.length} x ${frontOptions.length} x ${rapdOptions.length} x ${lightOptions.length} x ${fundalOptions.length} x ${backOptions.length} = ${summary.totalStates}`
);
reportLines.push('');
reportLines.push('Normalization and Reachability Rules');
reportLines.push('------------------------------------');
reportLines.push(
  '- UI reachability constraint: white reflex should force poor view in Back of Eye.'
);
reportLines.push(
  '- Engine robustness normalization: if fundal=white and back!=poor view, engine normalizes back to poor view and flags normalized_white_back_forced_poor_view.'
);
reportLines.push(
  '- Required fields for definitive action: onset, eyes, distanceVA, fundal, back.'
);
reportLines.push('');
reportLines.push('Coverage');
reportLines.push('--------');
reportLines.push(`Total states audited: ${summary.totalStates}`);
reportLines.push(`White-constraint reachable states: ${summary.whiteConstraintReachable}`);
reportLines.push(`White-constraint unreachable states: ${summary.whiteConstraintUnreachable}`);
reportLines.push(`White-back normalized states (engine robustness): ${summary.normalizedWhiteBackStates}`);
reportLines.push(`Complete states (required inputs present): ${summary.completeStates}`);
reportLines.push(`Incomplete states: ${summary.incompleteStates}`);
reportLines.push(`Complete + reachable states: ${summary.completeReachableStates}`);
reportLines.push(`Engine returned result states: ${summary.hasResultStates}`);
reportLines.push(`Engine returned no-result states: ${summary.noResultStates}`);
reportLines.push(`Complete states with result: ${summary.completeHasResultStates}`);
reportLines.push(`Complete states with no-result: ${summary.completeNoResultStates}`);
reportLines.push(`Incomplete states with result: ${summary.incompleteHasResultStates}`);
reportLines.push(`Incomplete states with no-result: ${summary.incompleteNoResultStates}`);
reportLines.push('');
reportLines.push('Checks Executed');
reportLines.push('---------------');
Object.entries(ISSUE_DEFINITIONS).forEach(([issueId, issueDefinition]) => {
  reportLines.push(`${issueId} (${issueDefinition.severity}): ${issueDefinition.description}`);
});
reportLines.push('');
reportLines.push('Issue Totals By Severity');
reportLines.push('------------------------');
for (const severity of SEVERITY_ORDER) {
  reportLines.push(`${severity}: ${issueCountsBySeverity[severity] || 0}`);
}
reportLines.push('');
reportLines.push('Issue Breakdown');
reportLines.push('---------------');
if (issueEntries.length === 0) {
  reportLines.push('No issues detected in configured checks.');
} else {
  for (const [issueId, issueData] of issueEntries) {
    reportLines.push(`${issueId} (${issueData.severity})`);
    reportLines.push(`Count: ${issueData.count}`);
    reportLines.push(`Description: ${issueData.description}`);
    for (const sample of issueData.samples) {
      reportLines.push(`  Sample: ${comboToText(sample.combo)}`);
      reportLines.push(
        `    -> actionCode=${sample.actionCode || '-'} colour=${sample.actionColour || '-'} rank=${sample.severityRank}`
      );
      reportLines.push(`    -> actionText=${sample.actionText || '-'}`);
      reportLines.push(`    -> flags=${sample.flags.join(', ') || '-'}`);
      reportLines.push(`    -> recheckFields=${sample.recheckFieldKeys.join(', ') || '-'}`);
      reportLines.push(`    -> note=${sample.note}`);
    }
    reportLines.push('');
  }
}

reportLines.push('Recommendations');
reportLines.push('---------------');
recommendations.forEach((recommendation, index) => {
  reportLines.push(`${index + 1}. ${recommendation}`);
});
reportLines.push('');

const reportText = reportLines.join('\n');
const outputPath = path.join(process.cwd(), OUTPUT_REPORT_FILE);
fs.writeFileSync(outputPath, reportText, 'utf8');

console.log(reportText);
console.log('');
console.log(`Report written to: ${OUTPUT_REPORT_FILE}`);
