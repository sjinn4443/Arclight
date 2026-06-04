import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computePrescriptionCase } from '../src/prescription-engine.js';
import { DEFAULT_PRESCRIPTION_CONFIG } from '../src/prescription-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_CASES_PATH = path.resolve(__dirname, 'allan-rx-full.csv');
const PASSES = 4;

function parseNumber(value) {
  return value === '' || value == null ? Number.NaN : Number(value);
}

function parseCase(line, index) {
  const columns = line.split(',');

  return {
    caseNumber: parseNumber(columns[2]) || index + 1,
    age: columns[3],
    health: parseNumber(columns[4]),
    precise: parseNumber(columns[6]),
    currentAdd: parseNumber(columns[14]),
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

function loadCases(filePath) {
  const csvText = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = csvText.split(/\r?\n/).slice(2, 62);

  return lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => line.trim() !== '')
    .map(({ line, index }) => parseCase(line, index));
}

function cloneConfig(config) {
  return {
    confidence: { ...config.confidence },
    sphere: { ...config.sphere },
    cylinder: { ...config.cylinder },
    axis: { ...config.axis },
    add: {
      ...config.add,
      bands: config.add.bands.map((band) => ({ ...band }))
    }
  };
}

function setConfigValue(config, key, value) {
  const [section, field] = key.split('.');
  config[section][field] = value;
}

function setBandValue(config, index, value) {
  config.add.bands[index] = {
    ...config.add.bands[index],
    add: value
  };
}

function isBlank(value) {
  return value === null || Number.isNaN(value);
}

function valuesMatch(left, right) {
  if (isBlank(left) || isBlank(right)) {
    return isBlank(left) && isBlank(right);
  }

  return Math.abs(left - right) < 0.001;
}

function valuePenalty(actual, expected, step, blankPenalty) {
  if (valuesMatch(actual, expected)) {
    return 0;
  }

  if (isBlank(actual) || isBlank(expected)) {
    return blankPenalty;
  }

  return Math.abs(actual - expected) / step;
}

function scoreOutput(actual, expected) {
  return (
    valuePenalty(actual.sph, expected.sph, 0.25, 3) +
    valuePenalty(actual.cyl, expected.cyl, 0.25, 3) +
    valuePenalty(actual.axis, expected.axis, 5, 1.5)
  );
}

function evaluateConfig(config, cases) {
  let fullCases = 0;
  let rightEyes = 0;
  let leftEyes = 0;
  let adds = 0;
  let penalty = 0;

  for (const caseData of cases) {
    const output = computePrescriptionCase({
      age: caseData.age,
      context: {
        precise: caseData.precise === 1,
        vaGood: false,
        accurate: false,
        rightAccurate: caseData.qualityRight >= 8,
        leftAccurate: caseData.qualityLeft >= 8,
        health: caseData.health === 1
      },
      currentRightEye: caseData.currentRightEye,
      currentLeftEye: caseData.currentLeftEye,
      objectiveRightEye: caseData.objectiveRightEye,
      objectiveLeftEye: caseData.objectiveLeftEye,
      currentAdd: caseData.currentAdd,
      objectiveAdd: Number.NaN,
      config
    });

    const rightEyeMatch = scoreOutput(output.rightEye, caseData.expectedRightEye) === 0;
    const leftEyeMatch = scoreOutput(output.leftEye, caseData.expectedLeftEye) === 0;
    const addMatch = valuesMatch(output.readingAdd, caseData.expectedAdd);

    if (rightEyeMatch) {
      rightEyes += 1;
    }

    if (leftEyeMatch) {
      leftEyes += 1;
    }

    if (addMatch) {
      adds += 1;
    }

    if (rightEyeMatch && leftEyeMatch && addMatch) {
      fullCases += 1;
    }

    penalty += scoreOutput(output.rightEye, caseData.expectedRightEye);
    penalty += scoreOutput(output.leftEye, caseData.expectedLeftEye);
    penalty += valuePenalty(output.readingAdd, caseData.expectedAdd, 0.25, 2);
  }

  return {
    fullCases,
    rightEyes,
    leftEyes,
    adds,
    penalty,
    score:
      fullCases * 2000 +
      rightEyes * 250 +
      leftEyes * 250 +
      adds * 120 -
      penalty * 10
  };
}

const parameterDomains = [
  { key: 'confidence.currentPrecise', values: [0.75, 1, 1.25, 1.5, 1.75, 2] },
  { key: 'confidence.currentVaGood', values: [0.25, 0.5, 0.75, 1] },
  { key: 'confidence.objectiveAccurate', values: [1, 1.25, 1.5, 1.75, 2, 2.25] },
  { key: 'confidence.objectiveNoCurrent', values: [2, 2.5, 3, 3.5, 4] },
  { key: 'sphere.objectiveBias', values: [0, 0.25, 0.5] },
  { key: 'sphere.pullOffset', values: [0.25, 0.5, 0.75, 1, 1.25] },
  { key: 'sphere.pullScale', values: [2, 2.5, 3, 3.5, 4] },
  { key: 'sphere.quarterPull', values: [0.1, 0.15, 0.2, 0.25, 0.3] },
  { key: 'sphere.maxStep', values: [0.25, 0.5, 0.75, 1] },
  { key: 'cylinder.objectiveReduction', values: [0, 0.25, 0.5] },
  { key: 'cylinder.pullOffset', values: [0.25, 0.5, 0.75, 1, 1.25] },
  { key: 'cylinder.pullScale', values: [2, 2.5, 3, 3.5, 4] },
  { key: 'cylinder.quarterPull', values: [0.1, 0.15, 0.2, 0.25, 0.3] },
  { key: 'cylinder.maxStep', values: [0.25, 0.5, 0.75, 1] },
  { key: 'cylinder.dropMagnitude', values: [0.25, 0.5] },
  { key: 'cylinder.introduceMagnitude', values: [0.25, 0.5] },
  { key: 'cylinder.tokenCurrentDrop', values: [0, 0.25, 0.5] },
  { key: 'cylinder.corroboratedKeepGap', values: [5, 8, 10] },
  { key: 'cylinder.corroboratedBlendGap', values: [12, 16, 20, 24] },
  { key: 'cylinder.lowCylHoldGap', values: [10, 12, 15] },
  { key: 'axis.lowCylRounding', values: [1, 5] },
  { key: 'axis.highCylCutoff', values: [1, 1.25, 1.5, 1.75, 2] },
  { key: 'axis.pullOffset', values: [0, 0.25, 0.5, 0.75] },
  { key: 'axis.pullScale', values: [2, 2.5, 3, 3.5] },
  { key: 'axis.compromisePull', values: [0.15, 0.25, 0.35, 0.45, 0.55] },
  { key: 'axis.objectiveFollowRatio', values: [0.25, 0.4, 0.5, 0.6, 0.75] },
  { key: 'axis.nonPreciseFollowGap', values: [10, 15, 20] },
  { key: 'add.ageGate', values: [40, 42, 44, 46] },
  { bandIndex: 0, label: 'add.band40_43', values: [0.75, 1.0] },
  { bandIndex: 1, label: 'add.band44_47', values: [1.0, 1.25, 1.5] },
  { bandIndex: 2, label: 'add.band48_51', values: [1.25, 1.5, 1.75] },
  { bandIndex: 3, label: 'add.band52_55', values: [1.5, 1.75, 2.0] },
  { bandIndex: 4, label: 'add.band56_59', values: [1.75, 2.0, 2.25] },
  { bandIndex: 5, label: 'add.band60_63', values: [2.0, 2.25, 2.5] },
  { bandIndex: 6, label: 'add.band64_68', values: [2.25, 2.5, 2.75] },
  { bandIndex: 7, label: 'add.band69_77', values: [2.25, 2.5, 2.75] },
  { key: 'add.healthBoost', values: [0, 0.25, 0.5] }
];

function describeParameter(definition) {
  return definition.label ?? definition.key;
}

function applyParameterValue(config, definition, value) {
  if (definition.bandIndex != null) {
    setBandValue(config, definition.bandIndex, value);
    return;
  }

  setConfigValue(config, definition.key, value);
}

const cases = loadCases(DEFAULT_CASES_PATH);
let bestConfig = cloneConfig(DEFAULT_PRESCRIPTION_CONFIG);
let bestSummary = evaluateConfig(bestConfig, cases);
let improved = true;

for (let pass = 0; pass < PASSES && improved; pass += 1) {
  improved = false;

  for (const definition of parameterDomains) {
    let localBestConfig = bestConfig;
    let localBestSummary = bestSummary;

    for (const value of definition.values) {
      const candidateConfig = cloneConfig(bestConfig);
      applyParameterValue(candidateConfig, definition, value);
      const candidateSummary = evaluateConfig(candidateConfig, cases);

      if (candidateSummary.score > localBestSummary.score) {
        localBestConfig = candidateConfig;
        localBestSummary = candidateSummary;
      }
    }

    if (localBestSummary.score > bestSummary.score) {
      bestConfig = localBestConfig;
      bestSummary = localBestSummary;
      improved = true;
      console.log(
        `${describeParameter(definition)} -> ${JSON.stringify(
          definition.bandIndex != null
            ? bestConfig.add.bands[definition.bandIndex].add
            : definition.key
              .split('.')
              .reduce((current, segment) => current[segment], bestConfig),
          null,
          0
        )} | full=${bestSummary.fullCases} re=${bestSummary.rightEyes} le=${bestSummary.leftEyes} add=${bestSummary.adds} penalty=${bestSummary.penalty.toFixed(2)}`
      );
    }
  }
}

console.log('');
console.log(JSON.stringify(bestSummary, null, 2));
console.log('');
console.log(JSON.stringify(bestConfig, null, 2));
