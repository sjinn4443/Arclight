import {
  FEATURE_SETS,
  TARGETS,
  buildTargetExamples,
  evaluateRuleListLOO,
  loadWorkbookCases
} from './lib/workbook-analysis.mjs';

const cases = loadWorkbookCases();
const summary = [];

for (const featureSet of FEATURE_SETS) {
  for (const target of TARGETS) {
    const examples = buildTargetExamples(cases, target, featureSet);
    const evaluation = evaluateRuleListLOO(examples);

    summary.push({
      featureSet,
      target,
      examples: examples.length,
      accuracy: Number(evaluation.accuracy.toFixed(4)),
      correct: evaluation.correct,
      total: evaluation.total
    });
  }
}

const grouped = new Map();
for (const row of summary) {
  if (!grouped.has(row.featureSet)) {
    grouped.set(row.featureSet, []);
  }

  grouped.get(row.featureSet).push(row);
}

for (const [featureSet, rows] of grouped.entries()) {
  const aggregate = rows.reduce((accumulator, row) => accumulator + row.accuracy, 0) / rows.length;
  console.log('');
  console.log(
    JSON.stringify(
      {
        featureSet,
        averageAccuracy: Number(aggregate.toFixed(4))
      },
      null,
      2
    )
  );

  for (const row of rows) {
    console.log(
      `  ${row.target}: ${row.correct}/${row.total} (${(row.accuracy * 100).toFixed(1)}%)`
    );
  }
}
