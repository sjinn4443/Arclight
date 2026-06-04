import {
  FEATURE_SETS,
  TARGETS,
  buildTargetExamples,
  loadWorkbookCases,
  summarizeLabels
} from './lib/workbook-analysis.mjs';

const argv = new Set(process.argv.slice(2));
const targetArgIndex = process.argv.indexOf('--target');
const featureSetArgIndex = process.argv.indexOf('--feature-set');
const target =
  targetArgIndex >= 0 && process.argv[targetArgIndex + 1]
    ? process.argv[targetArgIndex + 1]
    : null;
const featureSet =
  featureSetArgIndex >= 0 && process.argv[featureSetArgIndex + 1]
    ? process.argv[featureSetArgIndex + 1]
    : 'full';

if (!FEATURE_SETS.includes(featureSet)) {
  throw new Error(`Unknown feature set: ${featureSet}`);
}

const cases = loadWorkbookCases();
const targets = target ? [target] : TARGETS;

for (const currentTarget of targets) {
  const examples = buildTargetExamples(cases, currentTarget, featureSet);
  const ambiguous = examples.filter((example) => example.ambiguous).length;
  const custom = examples.filter((example) => example.label === 'custom').length;

  console.log('');
  console.log(currentTarget);
  console.log(
    JSON.stringify(
      {
        featureSet,
        examples: examples.length,
        ambiguous,
        custom,
        customRate: examples.length === 0 ? 0 : custom / examples.length
      },
      null,
      2
    )
  );

  for (const row of summarizeLabels(examples)) {
    console.log(`  ${row.label}: ${row.count}`);
  }
}

if (argv.has('--show-sample')) {
  const sampleTarget = targets[0];
  const examples = buildTargetExamples(cases, sampleTarget, featureSet).slice(0, 10);
  console.log('');
  console.log(JSON.stringify(examples, null, 2));
}
