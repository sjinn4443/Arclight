import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computePrescriptionCase } from '../src/prescription-engine.js';
import { computeWorkbookBenchmarkCase } from '../src/workbook-benchmark-engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_CASES_PATH = path.resolve(__dirname, 'allan-rx-full.csv');
const argv = new Set(process.argv.slice(2));
const showMatches = argv.has('--show-matches');
const freeToggles = argv.has('--free-toggles');
const benchmarkMode = argv.has('--benchmark');
const sheetInputsMode = argv.has('--sheet-inputs');
const casesPathArgIndex = process.argv.indexOf('--cases');
const casesPath =
  casesPathArgIndex >= 0 && process.argv[casesPathArgIndex + 1]
    ? process.argv[casesPathArgIndex + 1]
    : DEFAULT_CASES_PATH;

function parseNumber(value) {
  return value === '' || value == null ? Number.NaN : Number(value);
}

function parseCase(line, index) {
  const columns = line.split(',');

  return {
    caseNumber: parseNumber(columns[2]) || index + 1,
    age: columns[3],
    health: parseNumber(columns[4]),
    calm: parseNumber(columns[5]),
    precise: parseNumber(columns[6]),
    currentAdd: parseNumber(columns[14]),
    repeat: parseNumber(columns[15]),
    qualityRight: parseNumber(columns[19]),
    qualityLeft: parseNumber(columns[23]),
    currentRightEye: {
      sph: parseNumber(columns[8]),
      cyl: parseNumber(columns[9]),
      axis: parseNumber(columns[10])
    },
    currentLeftEye: {
      sph: parseNumber(columns[11]),
      cyl: parseNumber(columns[12]),
      axis: parseNumber(columns[13])
    },
    objectiveRightEye: {
      sph: parseNumber(columns[16]),
      cyl: parseNumber(columns[17]),
      axis: parseNumber(columns[18])
    },
    objectiveLeftEye: {
      sph: parseNumber(columns[20]),
      cyl: parseNumber(columns[21]),
      axis: parseNumber(columns[22])
    },
    expectedRightEye: {
      sph: parseNumber(columns[24]),
      cyl: parseNumber(columns[25]),
      axis: parseNumber(columns[26])
    },
    expectedLeftEye: {
      sph: parseNumber(columns[27]),
      cyl: parseNumber(columns[28]),
      axis: parseNumber(columns[29])
    },
    expectedAdd: parseNumber(columns[30])
  };
}

function isBlankValue(value) {
  return value === null || Number.isNaN(value);
}

function valuesMatch(left, right) {
  if (isBlankValue(left) || isBlankValue(right)) {
    return isBlankValue(left) && isBlankValue(right);
  }

  return Math.abs(left - right) < 0.001;
}

function eyeMatches(actual, expected) {
  return (
    valuesMatch(actual.sph, expected.sph) &&
    valuesMatch(actual.cyl, expected.cyl) &&
    valuesMatch(actual.axis, expected.axis)
  );
}

function buildToggleCombinations(caseData) {
  if (sheetInputsMode) {
    return [
      {
        precise: caseData.precise === 1,
        vaGood: false,
        accurate: false,
        rightAccurate: caseData.qualityRight >= 8,
        leftAccurate: caseData.qualityLeft >= 8,
        health: caseData.health === 1
      }
    ];
  }

  const combinations = [];
  const preciseValues = freeToggles ? [false, true] : [caseData.precise === 1];
  const healthValues = freeToggles ? [false, true] : [caseData.health === 1];

  for (const precise of preciseValues) {
    for (const vaGood of [false, true]) {
      for (const accurate of [false, true]) {
        for (const health of healthValues) {
          combinations.push({ precise, vaGood, accurate, health });
        }
      }
    }
  }

  return combinations;
}

function formatValue(value) {
  if (value === null || Number.isNaN(value)) {
    return '';
  }

  if (Number.isInteger(value)) {
    return String(value);
  }

  return value.toFixed(2);
}

function formatEye(eye) {
  return `${formatValue(eye.sph)} / ${formatValue(eye.cyl)} x ${formatValue(eye.axis)}`;
}

function evaluateCase(caseData) {
  let bestResult = null;
  const toggleCombinations = buildToggleCombinations(caseData);
  const computeCase = benchmarkMode ? computeWorkbookBenchmarkCase : computePrescriptionCase;

  for (const toggles of toggleCombinations) {
    const output = computeCase({
      age: caseData.age,
      context: toggles,
      currentRightEye: caseData.currentRightEye,
      currentLeftEye: caseData.currentLeftEye,
      objectiveRightEye: caseData.objectiveRightEye,
      objectiveLeftEye: caseData.objectiveLeftEye,
      currentAdd: caseData.currentAdd,
      objectiveAdd: Number.NaN
    });
    const rightEye = output.rightEye;
    const leftEye = output.leftEye;
    const readingAdd = output.readingAdd;
    const rightEyeMatch = eyeMatches(rightEye, caseData.expectedRightEye);
    const leftEyeMatch = eyeMatches(leftEye, caseData.expectedLeftEye);
    const addMatch = valuesMatch(readingAdd, caseData.expectedAdd);
    const score = Number(rightEyeMatch) + Number(leftEyeMatch) + Number(addMatch);

    if (
      !bestResult ||
      score > bestResult.score ||
      (score === bestResult.score &&
        Number(toggles.precise) +
          Number(toggles.vaGood) +
          Number(toggles.accurate) +
          Number(toggles.rightAccurate) +
          Number(toggles.leftAccurate) +
          Number(toggles.health) <
          Number(bestResult.toggles.precise) +
            Number(bestResult.toggles.vaGood) +
            Number(bestResult.toggles.accurate) +
            Number(bestResult.toggles.rightAccurate) +
            Number(bestResult.toggles.leftAccurate) +
            Number(bestResult.toggles.health))
    ) {
      bestResult = {
        score,
        toggles,
        rightEye,
        leftEye,
        readingAdd,
        rightEyeMatch,
        leftEyeMatch,
        addMatch
      };
    }
  }

  return bestResult;
}

function loadCases(filePath) {
  const csvText = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = csvText.split(/\r?\n/).slice(2, 62);

  return lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => line.trim() !== '')
    .map(({ line, index }) => parseCase(line, index));
}

const cases = loadCases(casesPath);
const results = cases.map((caseData) => ({
  caseData,
  result: evaluateCase(caseData)
}));

const summary = results.reduce(
  (accumulator, entry) => {
    if (entry.result.rightEyeMatch) {
      accumulator.rightEyes += 1;
    }

    if (entry.result.leftEyeMatch) {
      accumulator.leftEyes += 1;
    }

    if (entry.result.addMatch) {
      accumulator.adds += 1;
    }

    if (entry.result.rightEyeMatch && entry.result.leftEyeMatch && entry.result.addMatch) {
      accumulator.fullCases += 1;
    }

    return accumulator;
  },
  { fullCases: 0, rightEyes: 0, leftEyes: 0, adds: 0 }
);

console.log(
  JSON.stringify(
    {
      casesFile: path.relative(path.resolve(__dirname, '..'), casesPath),
      totalCases: cases.length,
      mode: benchmarkMode ? 'benchmark' : sheetInputsMode ? 'sheet-inputs' : 'heuristic',
      freeToggles,
      fullCases: summary.fullCases,
      rightEyes: summary.rightEyes,
      leftEyes: summary.leftEyes,
      adds: summary.adds
    },
    null,
    2
  )
);

for (const { caseData, result } of results) {
  if (!showMatches && result.rightEyeMatch && result.leftEyeMatch && result.addMatch) {
    continue;
  }

  const status = result.rightEyeMatch && result.leftEyeMatch && result.addMatch ? 'match' : 'miss';
  console.log(
    [
      '',
      `Case ${caseData.caseNumber}: ${status}`,
      `  sheet fields: ${JSON.stringify({ health: caseData.health, calm: caseData.calm, precise: caseData.precise, repeat: caseData.repeat, qualityRight: caseData.qualityRight, qualityLeft: caseData.qualityLeft })}`,
      `  toggles best-fit: ${JSON.stringify(result.toggles)}`,
      `  RE actual: ${formatEye(result.rightEye)}`,
      `  RE expect: ${formatEye(caseData.expectedRightEye)}`,
      `  LE actual: ${formatEye(result.leftEye)}`,
      `  LE expect: ${formatEye(caseData.expectedLeftEye)}`,
      `  Add actual: ${formatValue(result.readingAdd)}`,
      `  Add expect: ${formatValue(caseData.expectedAdd)}`
    ].join('\n')
  );
}
