import {
  FEATURE_SETS,
  TARGETS,
  bootstrapRuleStability,
  buildTargetExamples,
  evaluateRuleListLOO,
  loadWorkbookCases,
  trainOrderedRuleList
} from './lib/workbook-analysis.mjs';

const targetArgIndex = process.argv.indexOf('--target');
const featureSetArgIndex = process.argv.indexOf('--feature-set');
const resamplesArgIndex = process.argv.indexOf('--bootstrap');
const target =
  targetArgIndex >= 0 && process.argv[targetArgIndex + 1]
    ? process.argv[targetArgIndex + 1]
    : 'sphere_action';
const featureSet =
  featureSetArgIndex >= 0 && process.argv[featureSetArgIndex + 1]
    ? process.argv[featureSetArgIndex + 1]
    : 'full';
const bootstrapResamples =
  resamplesArgIndex >= 0 && process.argv[resamplesArgIndex + 1]
    ? Number(process.argv[resamplesArgIndex + 1])
    : 100;

if (!TARGETS.includes(target)) {
  throw new Error(`Unknown target: ${target}`);
}

if (!FEATURE_SETS.includes(featureSet)) {
  throw new Error(`Unknown feature set: ${featureSet}`);
}

const cases = loadWorkbookCases();
const examples = buildTargetExamples(cases, target, featureSet);
const model = trainOrderedRuleList(examples);
const loo = evaluateRuleListLOO(examples);
const stability = bootstrapRuleStability(examples, {}, bootstrapResamples).slice(0, 10);

console.log(
  JSON.stringify(
    {
      target,
      featureSet,
      examples: examples.length,
      leaveOneOutAccuracy: loo.accuracy,
      correct: loo.correct,
      total: loo.total,
      rules: model.rules.length,
      defaultLabel: model.defaultLabel
    },
    null,
    2
  )
);

console.log('');
for (const rule of model.rules) {
  console.log(
    `${rule.condition.map(({ key, value }) => `${key}=${value}`).join(' AND ')} -> ${rule.label} ` +
      `(support=${rule.support}, precision=${rule.precision.toFixed(2)})`
  );
}

console.log('');
console.log('Top stable rules');
for (const row of stability) {
  console.log(`  ${row.frequency.toFixed(2)} ${row.rule}`);
}
