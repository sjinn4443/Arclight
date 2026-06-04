import fs from 'node:fs';
import path from 'node:path';
import { evaluateCataractDecision } from './src/cataract-engine.js';

const OUTPUT_REPORT_FILE = 'result-output-audit-report.txt';

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
const eyesOptions = ['one', 'two'];
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
const pupilAbnormalOptions = [false, true];
const frontOptions = [false, true];
const neuroOptions = [false, true];
const fundalOptions = ['normal', 'dark', 'patches', 'spots', 'white'];
const backOptions = ['normal', 'cupping', 'diabetic', 'detached', 'poor view'];

const MAX_DISPLAY_NOTES = 3;
const MAX_REPORT_PANELS = 80;
const MAX_SAMPLES_PER_FINDING = 6;

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

const NOTE_DEDUP_STOPWORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'before',
  'both',
  'by',
  'can',
  'consider',
  'for',
  'first',
  'from',
  'in',
  'is',
  'it',
  'key',
  'needed',
  'no',
  'not',
  'now',
  'of',
  'on',
  'or',
  're',
  'review',
  'same',
  'step',
  'the',
  'to',
  'up',
  'with'
]);

const PAEDIATRIC_AGE_BANDS = new Set(['baby', 'child', 'adolescent']);
const YOUNGER_ADULT_AGE_BANDS = new Set(['young_adult', 'adult']);
const POSTERIOR_BACK_VALUES = new Set(['cupping', 'diabetic', 'detached']);

const ISSUE_DEFINITIONS = {
  ui_combo_no_result: {
    severity: 'P0',
    description: 'A complete UI-feasible combination did not render a Result panel.'
  },
  visible_result_blank: {
    severity: 'P0',
    description: 'A visible Result panel had blank cataract type or next step text.'
  },
  posterior_missing_override: {
    severity: 'P0',
    description: 'Posterior disease did not route to posterior-first wording.'
  },
  urgent_sudden_pain_not_red: {
    severity: 'P0',
    description: 'Sudden painful vision loss did not produce red urgent or posterior-first guidance.'
  },
  probable_label_visible_in_ui: {
    severity: 'P1',
    description: 'A UI-feasible state displayed a Probable cataract label.'
  },
  normal_reflex_cataract_referral: {
    severity: 'P1',
    description: 'Normal fundal reflex with no posterior disease produced cataract referral wording.'
  },
  abnormal_reflex_no_cataract_pathway: {
    severity: 'P1',
    description: 'Abnormal fundal reflex with no posterior disease produced no-cataract wording.'
  },
  child_dense_missing_paediatric_wording: {
    severity: 'P1',
    description: 'Dense child cataract did not keep paediatric referral wording in non-acute states.'
  },
  posterior_specific_note_mismatch: {
    severity: 'P2',
    description: 'Posterior-specific check text appeared with the wrong Back of Eye state.'
  },
  risk_note_without_trigger: {
    severity: 'P2',
    description: 'A check note referred to a risk finding that the user did not select.'
  },
  visible_note_duplicate: {
    severity: 'P2',
    description: 'The visible Check section repeated the same note.'
  },
  visible_note_repeats_action: {
    severity: 'P2',
    description: 'A visible Check line repeated the main Next Step text.'
  },
  visible_note_policy_exceeded: {
    severity: 'P2',
    description: 'The visible Check section exceeded the note count policy.'
  },
  urgency_word_colour_mismatch: {
    severity: 'P2',
    description: 'Urgent or same-day wording appeared outside a red output.'
  },
  cataract_type_input_mismatch: {
    severity: 'P2',
    description: 'Displayed cataract type did not match the selected reflex pathway.'
  },
  action_text_too_long: {
    severity: 'P3',
    description: 'Next Step text was longer than 12 words.'
  }
};

const SEVERITY_ORDER = ['P0', 'P1', 'P2', 'P3'];

function normalizeSnippet(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function getMeaningfulTokenSet(text) {
  const tokens = String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !NOTE_DEDUP_STOPWORDS.has(token));
  return new Set(tokens);
}

function isMostlyRepeatOfAction(noteText, actionText, actionTokenSet) {
  const noteTokens = getMeaningfulTokenSet(noteText);
  const actionTokens = actionTokenSet || getMeaningfulTokenSet(actionText);
  if (noteTokens.size < 2 || actionTokens.size < 2) {
    return false;
  }

  let shared = 0;
  noteTokens.forEach((token) => {
    if (actionTokens.has(token)) {
      shared += 1;
    }
  });

  const noteCoverage = shared / noteTokens.size;
  const actionCoverage = shared / actionTokens.size;
  return noteCoverage >= 0.67 || (noteCoverage >= 0.5 && actionCoverage >= 0.5);
}

function buildVisibleNotes(decision) {
  const actionNotes = Array.isArray(decision.actionNotes) ? decision.actionNotes : [];
  const noteCodes = Array.isArray(decision.actionNoteCodes) ? decision.actionNoteCodes : [];
  const actionNorm = normalizeSnippet(decision.actionText);
  const actionTokenSet = getMeaningfulTokenSet(decision.actionText);
  const visibleNotes = [];
  const visibleNoteCodes = [];
  const seenByCode = new Set();
  const seenByText = new Set();

  for (let index = 0; index < actionNotes.length; index += 1) {
    const rawNote = String(actionNotes[index] || '').trim();
    const noteCode = noteCodes[index] || '';
    const noteNorm = normalizeSnippet(rawNote);

    if (!noteNorm || noteNorm === actionNorm) {
      continue;
    }
    if (isMostlyRepeatOfAction(rawNote, decision.actionText, actionTokenSet)) {
      continue;
    }
    if (noteCode && seenByCode.has(noteCode)) {
      continue;
    }
    if (seenByText.has(noteNorm)) {
      continue;
    }

    if (noteCode) {
      seenByCode.add(noteCode);
    }
    seenByText.add(noteNorm);
    visibleNotes.push(rawNote);
    visibleNoteCodes.push(noteCode);

    if (visibleNotes.length >= MAX_DISPLAY_NOTES) {
      break;
    }
  }

  return { visibleNotes, visibleNoteCodes };
}

function getBackValuesForFundal(fundalSelection) {
  return fundalSelection === 'white' ? ['poor view'] : backOptions;
}

function createUiInput({
  onsetValue,
  ageBand,
  eyes,
  painYes,
  distanceVA,
  nearVAValue,
  pupilAbnormal,
  frontPresent,
  neuroPresent,
  fundalSelection,
  backSelection
}) {
  return {
    onsetValue,
    ageBand,
    eyes,
    painYes,
    painRecorded: true,
    distanceVA,
    nearVAValue,
    pupilSelected: true,
    pupilRecorded: true,
    pupilAbnormal,
    frontPresent,
    frontRecorded: true,
    rapdPresent: neuroPresent,
    rapdRecorded: true,
    directionLightPoor: neuroPresent,
    lightRecorded: true,
    fundalSelection,
    backSelection
  };
}

function expectedCataractType(combo, decision) {
  if (POSTERIOR_BACK_VALUES.has(combo.backSelection)) {
    return 'Nil';
  }
  if (combo.fundalSelection === 'normal') {
    return 'Nil';
  }

  const phenotypeByFundal = {
    dark: 'Nuclear',
    patches: 'Cortical',
    spots: 'Subcapsular',
    white: 'Mature'
  };
  const phenotype = phenotypeByFundal[combo.fundalSelection] || '';
  if (!phenotype) {
    return '';
  }
  if (combo.neuroPresent || (combo.onsetValue === 'sudden' && combo.painYes)) {
    return `Possible ${phenotype} (other urgent pathology suspected)`;
  }
  if (combo.pupilAbnormal) {
    return `Possible ${phenotype} (also pupil abnormality)`;
  }
  return phenotype;
}

function comboToText(combo) {
  return `onset=${combo.onsetValue}, age=${combo.ageBand || '-'}, eyes=${combo.eyes}, pain=${
    combo.painYes ? 'yes' : 'no'
  }, distance=${combo.distanceVA}, near=${combo.nearVAValue || '-'}, pupil=${
    combo.pupilAbnormal ? 'abnormal' : 'normal'
  }, front=${combo.frontPresent ? 'yes' : 'no'}, neuro=${
    combo.neuroPresent ? 'yes' : 'no'
  }, fundal=${combo.fundalSelection}, back=${combo.backSelection}`;
}

function panelKey(panel) {
  return [
    panel.cataractType,
    panel.actionColour,
    panel.actionText,
    panel.visibleNotes.join(' | ')
  ].join('\n');
}

function actionContainsCataractReferral(actionText) {
  const lower = actionText.toLowerCase();
  return (
    lower.includes('routine cataract referral') ||
    lower.includes('priority cataract referral') ||
    lower.includes('early cataract referral') ||
    lower.includes('prompt paediatric referral') ||
    lower.includes('cataract review')
  );
}

function visibleTextIncludesUrgency(panel) {
  const text = [panel.actionText, ...panel.visibleNotes].join(' ').toLowerCase();
  return text.includes('urgent') || text.includes('same-day');
}

const findings = new Map();
const uniquePanels = new Map();
const actionCounts = new Map();

function addFinding(id, combo, decision, panel, note) {
  const definition = ISSUE_DEFINITIONS[id];
  if (!definition) {
    throw new Error(`Unknown issue id: ${id}`);
  }

  const existing = findings.get(id) || {
    severity: definition.severity,
    description: definition.description,
    count: 0,
    samples: []
  };
  existing.count += 1;
  if (existing.samples.length < MAX_SAMPLES_PER_FINDING) {
    existing.samples.push({
      combo,
      cataractType: panel?.cataractType || decision.cataractType,
      actionColour: panel?.actionColour || decision.actionColour,
      actionText: panel?.actionText || decision.actionText,
      visibleNotes: panel?.visibleNotes || [],
      note
    });
  }
  findings.set(id, existing);
}

function rememberPanel(combo, decision, panel) {
  const key = panelKey(panel);
  const existing = uniquePanels.get(key) || {
    count: 0,
    panel,
    sampleCombo: combo,
    actionCodes: new Set(),
    noteCodeSets: new Set()
  };
  existing.count += 1;
  existing.actionCodes.add(decision.actionCode);
  existing.noteCodeSets.add(panel.visibleNoteCodes.join(',') || '-');
  uniquePanels.set(key, existing);

  const actionKey = `${panel.actionColour} | ${panel.actionText}`;
  actionCounts.set(actionKey, (actionCounts.get(actionKey) || 0) + 1);
}

function auditResult(combo, decision, panel) {
  if (!decision.hasResult) {
    addFinding('ui_combo_no_result', combo, decision, panel, 'Complete UI combo returned no result.');
    return;
  }

  if (!panel.cataractType || !panel.actionText) {
    addFinding('visible_result_blank', combo, decision, panel, 'Cataract Type or Next Step was blank.');
  }

  const hasPosteriorDisease = POSTERIOR_BACK_VALUES.has(combo.backSelection);
  const actionLower = panel.actionText.toLowerCase();
  const notesLower = panel.visibleNotes.join(' ').toLowerCase();
  const isPaediatric = PAEDIATRIC_AGE_BANDS.has(combo.ageBand);
  const hasAcuteUrgency = combo.onsetValue === 'sudden' && combo.painYes;

  if (hasPosteriorDisease && decision.actionCode !== 'posterior_disease_first') {
    addFinding(
      'posterior_missing_override',
      combo,
      decision,
      panel,
      'Back of Eye posterior disease should dominate the result.'
    );
  }

  if (
    hasAcuteUrgency &&
    decision.actionColour !== 'red' &&
    decision.actionCode !== 'posterior_disease_first'
  ) {
    addFinding(
      'urgent_sudden_pain_not_red',
      combo,
      decision,
      panel,
      'Sudden painful vision loss should surface red urgency unless posterior-first dominates.'
    );
  }

  if (panel.cataractType.startsWith('Probable ')) {
    addFinding(
      'probable_label_visible_in_ui',
      combo,
      decision,
      panel,
      'The UI has no unknown pupil state, so probable labels should not be visible.'
    );
  }

  if (
    combo.fundalSelection === 'normal' &&
    !hasPosteriorDisease &&
    actionContainsCataractReferral(panel.actionText)
  ) {
    addFinding(
      'normal_reflex_cataract_referral',
      combo,
      decision,
      panel,
      'Normal reflex without posterior disease should not use cataract-referral wording.'
    );
  }

  if (
    combo.fundalSelection !== 'normal' &&
    !hasPosteriorDisease &&
    actionLower.includes('no cataract referral')
  ) {
    addFinding(
      'abnormal_reflex_no_cataract_pathway',
      combo,
      decision,
      panel,
      'Abnormal reflex should not be labelled no cataract referral unless posterior disease dominates.'
    );
  }

  if (
    isPaediatric &&
    combo.fundalSelection === 'white' &&
    !hasAcuteUrgency &&
    !hasPosteriorDisease &&
    decision.actionCode !== 'child_cataract_prompt_referral'
  ) {
    addFinding(
      'child_dense_missing_paediatric_wording',
      combo,
      decision,
      panel,
      'Dense child cataract should keep paediatric referral wording in non-acute states.'
    );
  }

  if (
    notesLower.includes('detached retina suspected') &&
    combo.backSelection !== 'detached'
  ) {
    addFinding('posterior_specific_note_mismatch', combo, decision, panel, 'Detached note without Detached back selection.');
  }
  if (
    notesLower.includes('retinal disease/scarring') &&
    combo.backSelection !== 'diabetic'
  ) {
    addFinding('posterior_specific_note_mismatch', combo, decision, panel, 'DR/scar note without DR/Scar back selection.');
  }
  if (notesLower.includes('glaucoma') && combo.backSelection !== 'cupping') {
    addFinding('posterior_specific_note_mismatch', combo, decision, panel, 'Glaucoma note without Cupped back selection.');
  }

  if (notesLower.includes('abnormal pupils') && !combo.pupilAbnormal) {
    addFinding('risk_note_without_trigger', combo, decision, panel, 'Abnormal-pupil note without abnormal pupil selection.');
  }
  if (notesLower.includes('front eye scar') && !combo.frontPresent) {
    addFinding('risk_note_without_trigger', combo, decision, panel, 'Front-eye note without front-eye selection.');
  }
  if (notesLower.includes('retina/optic nerve') && !combo.neuroPresent) {
    addFinding('risk_note_without_trigger', combo, decision, panel, 'Neuro note without RAPD/light-direction selection.');
  }
  if (notesLower.includes('younger age') && !YOUNGER_ADULT_AGE_BANDS.has(combo.ageBand)) {
    addFinding('risk_note_without_trigger', combo, decision, panel, 'Younger-age note outside younger-adult age bands.');
  }

  const visibleNoteNorms = panel.visibleNotes.map((note) => normalizeSnippet(note));
  if (new Set(visibleNoteNorms).size !== visibleNoteNorms.length) {
    addFinding('visible_note_duplicate', combo, decision, panel, 'Visible Check notes contained duplicate text.');
  }

  const actionTokenSet = getMeaningfulTokenSet(panel.actionText);
  if (panel.visibleNotes.some((note) => isMostlyRepeatOfAction(note, panel.actionText, actionTokenSet))) {
    addFinding('visible_note_repeats_action', combo, decision, panel, 'A visible Check line repeated the Next Step.');
  }

  const maxNotes = MAX_ACTION_NOTES_BY_COLOUR[panel.actionColour] ?? 3;
  if (panel.visibleNotes.length > maxNotes || panel.visibleNotes.length > MAX_DISPLAY_NOTES) {
    addFinding(
      'visible_note_policy_exceeded',
      combo,
      decision,
      panel,
      `Visible note count ${panel.visibleNotes.length} exceeded policy ${maxNotes}.`
    );
  }

  if (visibleTextIncludesUrgency(panel) && panel.actionColour !== 'red') {
    addFinding(
      'urgency_word_colour_mismatch',
      combo,
      decision,
      panel,
      'Urgent or same-day wording should only appear in red visible outputs.'
    );
  }

  const expectedType = expectedCataractType(combo, decision);
  if (expectedType && panel.cataractType !== expectedType) {
    addFinding(
      'cataract_type_input_mismatch',
      combo,
      decision,
      panel,
      `Expected ${expectedType} from selected inputs.`
    );
  }

  const actionWordCount = panel.actionText.trim().split(/\s+/).filter(Boolean).length;
  if (actionWordCount > 12) {
    addFinding('action_text_too_long', combo, decision, panel, `Next Step has ${actionWordCount} words.`);
  }
}

let totalCombos = 0;

for (const onsetValue of onsetOptions) {
  for (const ageBand of ageOptions) {
    for (const eyes of eyesOptions) {
      for (const painYes of painOptions) {
        for (const distanceVA of distanceOptions) {
          for (const nearVAValue of nearOptions) {
            for (const pupilAbnormal of pupilAbnormalOptions) {
              for (const frontPresent of frontOptions) {
                for (const neuroPresent of neuroOptions) {
                  for (const fundalSelection of fundalOptions) {
                    for (const backSelection of getBackValuesForFundal(fundalSelection)) {
                      totalCombos += 1;
                      const combo = {
                        onsetValue,
                        ageBand,
                        eyes,
                        painYes,
                        distanceVA,
                        nearVAValue,
                        pupilAbnormal,
                        frontPresent,
                        neuroPresent,
                        fundalSelection,
                        backSelection
                      };
                      const decision = evaluateCataractDecision(createUiInput(combo));
                      const visible = buildVisibleNotes(decision);
                      const panel = {
                        cataractType: decision.cataractType,
                        actionColour: decision.actionColour,
                        actionText: decision.actionText,
                        visibleNotes: visible.visibleNotes,
                        visibleNoteCodes: visible.visibleNoteCodes
                      };
                      auditResult(combo, decision, panel);
                      if (decision.hasResult) {
                        rememberPanel(combo, decision, panel);
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

const sortedFindings = [...findings.entries()].sort((left, right) => {
  const leftSeverity = SEVERITY_ORDER.indexOf(left[1].severity);
  const rightSeverity = SEVERITY_ORDER.indexOf(right[1].severity);
  if (leftSeverity !== rightSeverity) {
    return leftSeverity - rightSeverity;
  }
  return right[1].count - left[1].count;
});

const issueCountsBySeverity = SEVERITY_ORDER.reduce((accumulator, severity) => {
  accumulator[severity] = sortedFindings
    .filter((entry) => entry[1].severity === severity)
    .reduce((sum, entry) => sum + entry[1].count, 0);
  return accumulator;
}, {});

const topActions = [...actionCounts.entries()].sort((left, right) => right[1] - left[1]).slice(0, 16);
const topPanels = [...uniquePanels.values()].sort((left, right) => right.count - left.count).slice(0, MAX_REPORT_PANELS);

const reportLines = [];
reportLines.push('Cataract Result Output Audit');
reportLines.push(`Generated: ${new Date().toISOString()}`);
reportLines.push('');
reportLines.push('Scope');
reportLines.push('-----');
reportLines.push('Mode: complete UI-feasible combinations with visible Result text.');
reportLines.push(`Complete UI combinations audited: ${totalCombos}`);
reportLines.push(`Unique visible Result panels: ${uniquePanels.size}`);
reportLines.push('');
reportLines.push('Axes');
reportLines.push('----');
reportLines.push(`Onset: ${onsetOptions.join(', ')}`);
reportLines.push(`Age: ${ageOptions.join(', ')}`);
reportLines.push(`Eyes: ${eyesOptions.join(', ')}`);
reportLines.push(`Pain/redness: ${painOptions.map((value) => (value ? 'yes' : 'no')).join(', ')}`);
reportLines.push(`Distance VA: ${distanceOptions.join(', ')}`);
reportLines.push(`Near VA: ${nearOptions.join(', ')}`);
reportLines.push('Pupils: normal, abnormal');
reportLines.push('Front eye: normal, scar/distortion');
reportLines.push('RAPD/light direction: normal, abnormal');
reportLines.push('Fundal + Back: white reflex forces poor view; other reflexes allow all Back of Eye choices.');
reportLines.push('');
reportLines.push('Issue Totals');
reportLines.push('------------');
for (const severity of SEVERITY_ORDER) {
  reportLines.push(`${severity}: ${issueCountsBySeverity[severity] || 0}`);
}
reportLines.push('');
reportLines.push('Findings');
reportLines.push('--------');
if (sortedFindings.length === 0) {
  reportLines.push('No result-output findings detected.');
} else {
  for (const [id, finding] of sortedFindings) {
    reportLines.push(`${id} (${finding.severity}): ${finding.count}`);
    reportLines.push(`  ${finding.description}`);
    for (const sample of finding.samples) {
      reportLines.push(`  - ${comboToText(sample.combo)}`);
      reportLines.push(`    -> ${sample.actionColour} | ${sample.cataractType} | ${sample.actionText || '-'}`);
      if (sample.visibleNotes.length > 0) {
        reportLines.push(`    -> checks: ${sample.visibleNotes.join(' | ')}`);
      }
      reportLines.push(`    -> note: ${sample.note}`);
    }
    reportLines.push('');
  }
}
reportLines.push('');
reportLines.push('Top Next Step Outputs');
reportLines.push('---------------------');
for (const [action, count] of topActions) {
  reportLines.push(`${count.toString().padStart(6, ' ')}  ${action}`);
}
reportLines.push('');
reportLines.push(`Top Visible Result Panels (${Math.min(MAX_REPORT_PANELS, uniquePanels.size)} shown)`);
reportLines.push('-------------------------');
for (const entry of topPanels) {
  const { panel, sampleCombo, count, actionCodes, noteCodeSets } = entry;
  reportLines.push(`${count.toString().padStart(6, ' ')}  ${panel.actionColour} | ${panel.cataractType} | ${panel.actionText}`);
  if (panel.visibleNotes.length > 0) {
    reportLines.push(`        Check: ${panel.visibleNotes.join(' | ')}`);
  }
  reportLines.push(`        Codes: ${[...actionCodes].sort().join(', ')} / notes ${[...noteCodeSets].sort().join('; ')}`);
  reportLines.push(`        Example: ${comboToText(sampleCombo)}`);
}

const reportText = reportLines.join('\n');
const outputPath = path.join(process.cwd(), OUTPUT_REPORT_FILE);
fs.writeFileSync(outputPath, reportText, 'utf8');

console.log(reportText);
console.log('');
console.log(`Report written to: ${OUTPUT_REPORT_FILE}`);
