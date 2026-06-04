import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_READING_ADD_BANDS } from '../../src/prescription-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DEFAULT_CASES_PATH = path.resolve(__dirname, '..', 'allan-rx-full.csv');
export const FEATURE_SETS = ['full', 'simplified_eye', 'simplified_ui_any', 'simplified_ui_all'];
export const TARGETS = [
  'sphere_action',
  'cylinder_action',
  'axis_action',
  'add_presence',
  'add_source'
];

const EPSILON = 0.001;
const QUARTER = 0.25;

export function parseNumber(value) {
  return value === '' || value == null ? Number.NaN : Number(value);
}

export function isBlank(value) {
  return value === null || Number.isNaN(value);
}

export function valuesMatch(left, right) {
  if (isBlank(left) || isBlank(right)) {
    return isBlank(left) && isBlank(right);
  }

  return Math.abs(left - right) < EPSILON;
}

export function loadWorkbookCases(filePath = DEFAULT_CASES_PATH) {
  const csvText = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = csvText.split(/\r?\n/).slice(2, 62);

  return lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => line.trim() !== '')
    .map(({ line, index }) => parseCase(line, index));
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

function roundAxis(value, multiple) {
  const rounded = Math.round(value / multiple) * multiple;
  if (rounded < 1 || rounded > 180) {
    return 180;
  }

  return rounded;
}

function normalizeAxis(axis) {
  let value = axis;

  while (value <= 0) {
    value += 180;
  }

  while (value > 180) {
    value -= 180;
  }

  if (Math.abs(value) < EPSILON) {
    return 180;
  }

  return value;
}

function unwrapAxis(axis) {
  return axis === 180 ? 0 : axis;
}

function axisDistance(firstAxis, secondAxis) {
  let difference = Math.abs(firstAxis - secondAxis);
  if (difference > 90) {
    difference = 180 - difference;
  }

  return difference;
}

function averageAxis(firstAxis, secondAxis) {
  const first = unwrapAxis(firstAxis);
  const second = unwrapAxis(secondAxis);
  let difference = second - first;

  if (difference > 90) {
    difference -= 180;
  }

  if (difference < -90) {
    difference += 180;
  }

  return normalizeAxis(first + difference / 2);
}

function interpolateAxis(firstAxis, secondAxis, pull) {
  const first = unwrapAxis(firstAxis);
  const second = unwrapAxis(secondAxis);
  let difference = second - first;

  if (difference > 90) {
    difference -= 180;
  }

  if (difference < -90) {
    difference += 180;
  }

  return normalizeAxis(first + difference * pull);
}

function softenSphere(value) {
  if (Number.isNaN(value)) {
    return Number.NaN;
  }

  return Math.round((value - Math.sign(value) * QUARTER) / QUARTER) * QUARTER;
}

function reduceCylinderTowardPlano(value) {
  if (Number.isNaN(value)) {
    return Number.NaN;
  }

  const reducedMagnitude = Math.max(0, Math.abs(value) - QUARTER);
  return Math.sign(value) * reducedMagnitude;
}

function roundedObjectiveAxis(axis, cyl) {
  if (Number.isNaN(axis) || Number.isNaN(cyl) || Math.abs(cyl) < EPSILON) {
    return Number.NaN;
  }

  const multiple = Math.abs(cyl) < 1.75 ? 5 : 1;
  return roundAxis(axis, multiple);
}

function boolBucket(value) {
  if (Number.isNaN(value)) {
    return 'blank';
  }

  return value === 1 ? 'yes' : 'no';
}

function signBucket(value) {
  if (Number.isNaN(value)) {
    return 'blank';
  }

  if (Math.abs(value) < EPSILON) {
    return 'zero';
  }

  return value > 0 ? 'plus' : 'minus';
}

function magnitudeBucket(value) {
  if (Number.isNaN(value)) {
    return 'blank';
  }

  const magnitude = Math.abs(value);

  if (magnitude < EPSILON) {
    return 'zero';
  }

  if (magnitude <= 0.25 + EPSILON) {
    return 'q25';
  }

  if (magnitude <= 0.5 + EPSILON) {
    return 'q50';
  }

  if (magnitude <= 1 + EPSILON) {
    return 'q75to1';
  }

  if (magnitude <= 2 + EPSILON) {
    return '1to2';
  }

  return '2plus';
}

function deltaBucket(value) {
  if (Number.isNaN(value)) {
    return 'blank';
  }

  const magnitude = Math.abs(value);

  if (magnitude < EPSILON) {
    return 'same';
  }

  if (magnitude <= 0.25 + EPSILON) {
    return 'q25';
  }

  if (magnitude <= 0.5 + EPSILON) {
    return 'q50';
  }

  if (magnitude <= 0.75 + EPSILON) {
    return 'q75';
  }

  if (magnitude <= 1 + EPSILON) {
    return 'q100';
  }

  return '1plus';
}

function ageBucket(ageValue) {
  const age = Number(ageValue);

  if (Number.isNaN(age)) {
    return 'blank';
  }

  if (age < 16) {
    return 'child';
  }

  if (age < 40) {
    return 'adult_under40';
  }

  if (age < 46) {
    return '40to45';
  }

  if (age < 50) {
    return '46to49';
  }

  if (age < 55) {
    return '50to54';
  }

  if (age < 60) {
    return '55to59';
  }

  if (age < 65) {
    return '60to64';
  }

  if (age < 70) {
    return '65to69';
  }

  return '70plus';
}

function qualityBucket(value) {
  if (Number.isNaN(value)) {
    return 'blank';
  }

  if (value >= 8) {
    return 'high';
  }

  if (value >= 6) {
    return 'mid';
  }

  return 'low';
}

function axisGapBucket(currentAxis, objectiveAxis) {
  if (Number.isNaN(currentAxis) || Number.isNaN(objectiveAxis)) {
    return 'blank';
  }

  const gap = axisDistance(currentAxis, objectiveAxis);

  if (gap < EPSILON) {
    return 'same';
  }

  if (gap <= 5 + EPSILON) {
    return 'lt5';
  }

  if (gap <= 10 + EPSILON) {
    return '5to10';
  }

  if (gap <= 20 + EPSILON) {
    return '10to20';
  }

  return '20plus';
}

function accuracyFromQuality(quality) {
  return !Number.isNaN(quality) && quality >= 8;
}

function eyeData(caseData, side) {
  return side === 'R'
    ? {
        side,
        quality: caseData.qualityRight,
        current: caseData.currentRightEye,
        objective: caseData.objectiveRightEye,
        expected: caseData.expectedRightEye,
        otherQuality: caseData.qualityLeft,
        otherCurrent: caseData.currentLeftEye,
        otherObjective: caseData.objectiveLeftEye,
        otherExpected: caseData.expectedLeftEye
      }
    : {
        side,
        quality: caseData.qualityLeft,
        current: caseData.currentLeftEye,
        objective: caseData.objectiveLeftEye,
        expected: caseData.expectedLeftEye,
        otherQuality: caseData.qualityRight,
        otherCurrent: caseData.currentRightEye,
        otherObjective: caseData.objectiveRightEye,
        otherExpected: caseData.expectedRightEye
      };
}

function classifyToward(currentValue, targetValue, expectedValue) {
  if (Number.isNaN(currentValue) || Number.isNaN(targetValue) || Number.isNaN(expectedValue)) {
    return null;
  }

  if (valuesMatch(expectedValue, currentValue)) {
    return 'keep';
  }

  if (valuesMatch(expectedValue, targetValue)) {
    return 'target';
  }

  const targetDelta = targetValue - currentValue;
  const outputDelta = expectedValue - currentValue;

  if (Math.abs(targetDelta) < EPSILON || Math.sign(targetDelta) !== Math.sign(outputDelta)) {
    return null;
  }

  if (Math.abs(outputDelta) - Math.abs(targetDelta) > EPSILON) {
    return null;
  }

  const movement = Math.round(Math.abs(outputDelta) / QUARTER) * QUARTER;

  if (Math.abs(movement - 0.25) < EPSILON) {
    return 'step_q25';
  }

  if (Math.abs(movement - 0.5) < EPSILON) {
    return 'step_q50';
  }

  if (movement >= 0.75 - EPSILON) {
    return 'step_q75plus';
  }

  return null;
}

function inferSphereAction(current, objective, expected) {
  const target = softenSphere(objective.sph);

  if (Number.isNaN(expected.sph)) {
    return { label: 'blank', ambiguous: false };
  }

  if (Number.isNaN(current.sph)) {
    if (valuesMatch(expected.sph, target)) {
      return { label: 'no_current_target', ambiguous: false };
    }

    if (valuesMatch(expected.sph, objective.sph)) {
      return { label: 'no_current_objective_raw', ambiguous: false };
    }

    return { label: 'custom', ambiguous: false };
  }

  const toward = classifyToward(current.sph, target, expected.sph);
  if (toward) {
    return { label: toward, ambiguous: toward === 'target' && valuesMatch(current.sph, target) };
  }

  if (valuesMatch(expected.sph, current.sph)) {
    return { label: 'keep', ambiguous: false };
  }

  return { label: 'custom', ambiguous: false };
}

function inferCylinderAction(current, objective, expected) {
  const target =
    !Number.isNaN(current.cyl) &&
    !Number.isNaN(objective.cyl) &&
    valuesMatch(current.cyl, objective.cyl)
      ? objective.cyl
      : reduceCylinderTowardPlano(objective.cyl);

  if (isBlank(expected.cyl)) {
    if (Number.isNaN(current.cyl)) {
      return { label: 'blank', ambiguous: false };
    }

    return { label: 'drop', ambiguous: false };
  }

  if (Number.isNaN(current.cyl)) {
    const toward = classifyToward(0, target, expected.cyl);
    if (toward === 'target') {
      return { label: 'introduce_target', ambiguous: false };
    }

    if (toward === 'step_q25') {
      return { label: 'introduce_q25', ambiguous: false };
    }

    if (toward === 'step_q50') {
      return { label: 'introduce_q50', ambiguous: false };
    }

    if (toward === 'step_q75plus') {
      return { label: 'introduce_q75plus', ambiguous: false };
    }

    return { label: 'custom', ambiguous: false };
  }

  const toward = classifyToward(current.cyl, target, expected.cyl);
  if (toward) {
    return { label: toward, ambiguous: toward === 'target' && valuesMatch(current.cyl, target) };
  }

  if (valuesMatch(expected.cyl, current.cyl)) {
    return { label: 'keep', ambiguous: false };
  }

  return { label: 'custom', ambiguous: false };
}

function inferAxisAction(current, objective, expected) {
  if (isBlank(expected.axis)) {
    return { label: 'blank', ambiguous: false };
  }

  const roundingCylinder = isBlank(expected.cyl) ? objective.cyl : expected.cyl;
  const objectiveRounded = roundedObjectiveAxis(objective.axis, roundingCylinder);

  if (Number.isNaN(current.axis)) {
    if (valuesMatch(expected.axis, objectiveRounded)) {
      return { label: 'objective', ambiguous: false };
    }

    return { label: 'custom', ambiguous: false };
  }

  if (valuesMatch(expected.axis, current.axis)) {
    return { label: 'keep', ambiguous: false };
  }

  if (valuesMatch(expected.axis, objectiveRounded)) {
    return { label: 'objective', ambiguous: false };
  }

  if (!Number.isNaN(objective.axis)) {
    const midpoint = roundedObjectiveAxis(
      averageAxis(current.axis, objective.axis),
      roundingCylinder
    );

    if (valuesMatch(expected.axis, midpoint)) {
      return { label: 'midpoint', ambiguous: false };
    }

    for (const pull of [0.25, 0.5, 0.75]) {
      const interpolated = roundedObjectiveAxis(
        interpolateAxis(current.axis, objective.axis, pull),
        roundingCylinder
      );

      if (valuesMatch(expected.axis, interpolated)) {
        return {
          label: pull === 0.25 ? 'toward_q25' : pull === 0.5 ? 'toward_q50' : 'toward_q75',
          ambiguous: false
        };
      }
    }
  }

  return { label: 'custom', ambiguous: false };
}

function computeAgeAdd(ageValue, healthFlag) {
  const age = Number(ageValue);

  if (Number.isNaN(age) || age < 40) {
    return Number.NaN;
  }

  const band = DEFAULT_READING_ADD_BANDS.find((entry) => age >= entry.min && age <= entry.max);
  if (!band) {
    return Number.NaN;
  }

  return band.add + (healthFlag ? 0.25 : 0);
}

function inferAddPresence(caseData) {
  return isBlank(caseData.expectedAdd) ? 'none' : 'present';
}

function inferAddSource(caseData) {
  if (isBlank(caseData.expectedAdd)) {
    return { label: 'none', ambiguous: false };
  }

  if (valuesMatch(caseData.expectedAdd, caseData.currentAdd)) {
    return { label: 'current', ambiguous: false };
  }

  const ageAdd = computeAgeAdd(caseData.age, false);
  const ageAddHealth = computeAgeAdd(caseData.age, true);

  if (valuesMatch(caseData.expectedAdd, ageAdd)) {
    return { label: 'age', ambiguous: false };
  }

  if (valuesMatch(caseData.expectedAdd, ageAddHealth)) {
    return { label: 'age_health', ambiguous: false };
  }

  return { label: 'other_present', ambiguous: false };
}

function deriveAllFeatures(caseData, side) {
  const eye = eyeData(caseData, side);
  const accurateEye = accuracyFromQuality(eye.quality);
  const accurateOtherEye = accuracyFromQuality(eye.otherQuality);
  const accurateGlobalAny = accurateEye || accurateOtherEye;
  const accurateGlobalAll = accurateEye && accurateOtherEye;
  const targetSphere = softenSphere(eye.objective.sph);
  const targetCylinder =
    !Number.isNaN(eye.current.cyl) &&
    !Number.isNaN(eye.objective.cyl) &&
    valuesMatch(eye.current.cyl, eye.objective.cyl)
      ? eye.objective.cyl
      : reduceCylinderTowardPlano(eye.objective.cyl);

  return {
    side: eye.side,
    age_bucket: ageBucket(caseData.age),
    health: boolBucket(caseData.health),
    precise: boolBucket(caseData.precise),
    calm: boolBucket(caseData.calm),
    repeat: boolBucket(caseData.repeat),
    current_add_present: isBlank(caseData.currentAdd) ? 'no' : 'yes',
    quality_bucket: qualityBucket(eye.quality),
    accurate_eye: accurateEye ? 'yes' : 'no',
    accurate_global_any: accurateGlobalAny ? 'yes' : 'no',
    accurate_global_all: accurateGlobalAll ? 'yes' : 'no',
    current_present: Number.isNaN(eye.current.sph) ? 'no' : 'yes',
    current_has_cyl: isBlank(eye.current.cyl) ? 'no' : 'yes',
    current_sphere_only:
      !Number.isNaN(eye.current.sph) && isBlank(eye.current.cyl) ? 'yes' : 'no',
    objective_has_cyl: isBlank(eye.objective.cyl) ? 'no' : 'yes',
    objective_sphere_only:
      !Number.isNaN(eye.objective.sph) &&
      (isBlank(eye.objective.cyl) || Math.abs(eye.objective.cyl) < EPSILON)
        ? 'yes'
        : 'no',
    current_sph_sign: signBucket(eye.current.sph),
    objective_sph_sign: signBucket(eye.objective.sph),
    current_sph_mag: magnitudeBucket(eye.current.sph),
    objective_sph_mag: magnitudeBucket(eye.objective.sph),
    current_cyl_mag: magnitudeBucket(eye.current.cyl),
    objective_cyl_mag: magnitudeBucket(eye.objective.cyl),
    target_sph_delta: deltaBucket(targetSphere - eye.current.sph),
    target_cyl_delta: deltaBucket(targetCylinder - eye.current.cyl),
    target_sph_direction: signBucket(targetSphere - eye.current.sph),
    target_cyl_direction: signBucket(targetCylinder - eye.current.cyl),
    corroborated_cyl:
      !Number.isNaN(eye.current.cyl) &&
      !Number.isNaN(eye.objective.cyl) &&
      valuesMatch(eye.current.cyl, eye.objective.cyl)
        ? 'yes'
        : 'no',
    axis_gap: axisGapBucket(eye.current.axis, eye.objective.axis),
    other_current_present: Number.isNaN(eye.otherCurrent.sph) ? 'no' : 'yes',
    other_current_has_cyl: isBlank(eye.otherCurrent.cyl) ? 'no' : 'yes',
    other_objective_has_cyl: isBlank(eye.otherObjective.cyl) ? 'no' : 'yes',
    other_accurate_eye: accurateOtherEye ? 'yes' : 'no',
    both_no_current:
      Number.isNaN(eye.current.sph) && Number.isNaN(eye.otherCurrent.sph) ? 'yes' : 'no',
    binocular_current_sph_gap: deltaBucket(eye.current.sph - eye.otherCurrent.sph),
    binocular_objective_sph_gap: deltaBucket(eye.objective.sph - eye.otherObjective.sph)
  };
}

function pickFeatureSet(features, featureSet) {
  const simplifiedEye = {
    side: features.side,
    age_bucket: features.age_bucket,
    health: features.health,
    precise: features.precise,
    current_add_present: features.current_add_present,
    accurate_eye: features.accurate_eye,
    current_present: features.current_present,
    current_has_cyl: features.current_has_cyl,
    current_sphere_only: features.current_sphere_only,
    objective_has_cyl: features.objective_has_cyl,
    objective_sphere_only: features.objective_sphere_only,
    current_sph_sign: features.current_sph_sign,
    objective_sph_sign: features.objective_sph_sign,
    current_sph_mag: features.current_sph_mag,
    objective_sph_mag: features.objective_sph_mag,
    current_cyl_mag: features.current_cyl_mag,
    objective_cyl_mag: features.objective_cyl_mag,
    target_sph_delta: features.target_sph_delta,
    target_cyl_delta: features.target_cyl_delta,
    target_sph_direction: features.target_sph_direction,
    target_cyl_direction: features.target_cyl_direction,
    corroborated_cyl: features.corroborated_cyl,
    axis_gap: features.axis_gap,
    other_current_present: features.other_current_present,
    other_current_has_cyl: features.other_current_has_cyl,
    other_objective_has_cyl: features.other_objective_has_cyl,
    other_accurate_eye: features.other_accurate_eye,
    both_no_current: features.both_no_current,
    binocular_current_sph_gap: features.binocular_current_sph_gap,
    binocular_objective_sph_gap: features.binocular_objective_sph_gap
  };

  if (featureSet === 'full') {
    return features;
  }

  if (featureSet === 'simplified_eye') {
    return simplifiedEye;
  }

  if (featureSet === 'simplified_ui_any') {
    const { accurate_eye, other_accurate_eye, ...rest } = simplifiedEye;
    return {
      ...rest,
      accurate_global: features.accurate_global_any
    };
  }

  if (featureSet === 'simplified_ui_all') {
    const { accurate_eye, other_accurate_eye, ...rest } = simplifiedEye;
    return {
      ...rest,
      accurate_global: features.accurate_global_all
    };
  }

  return features;
}

export function buildTargetExamples(cases, target, featureSet = 'full') {
  if (!FEATURE_SETS.includes(featureSet)) {
    throw new Error(`Unknown feature set: ${featureSet}`);
  }

  if (!TARGETS.includes(target)) {
    throw new Error(`Unknown target: ${target}`);
  }

  if (target === 'add_presence' || target === 'add_source') {
    return cases.map((caseData) => {
      const baseFeatures = deriveAllFeatures(caseData, 'R');
      const features = pickFeatureSet(baseFeatures, featureSet);
      const action =
        target === 'add_presence'
          ? { label: inferAddPresence(caseData), ambiguous: false }
          : inferAddSource(caseData);

      return {
        id: `case-${caseData.caseNumber}`,
        caseNumber: caseData.caseNumber,
        side: null,
        features,
        label: action.label,
        ambiguous: action.ambiguous
      };
    });
  }

  const examples = [];

  for (const caseData of cases) {
    for (const side of ['R', 'L']) {
      const eye = eyeData(caseData, side);
      const baseFeatures = deriveAllFeatures(caseData, side);
      const features = pickFeatureSet(baseFeatures, featureSet);
      const action =
        target === 'sphere_action'
          ? inferSphereAction(eye.current, eye.objective, eye.expected)
          : target === 'cylinder_action'
            ? inferCylinderAction(eye.current, eye.objective, eye.expected)
            : inferAxisAction(eye.current, eye.objective, eye.expected);

      examples.push({
        id: `${side}-${caseData.caseNumber}`,
        caseNumber: caseData.caseNumber,
        side,
        features,
        label: action.label,
        ambiguous: action.ambiguous
      });
    }
  }

  return examples;
}

function countLabels(examples) {
  const counts = new Map();

  for (const example of examples) {
    counts.set(example.label, (counts.get(example.label) ?? 0) + 1);
  }

  return counts;
}

function majorityLabel(examples) {
  let bestLabel = null;
  let bestCount = -1;

  for (const [label, count] of countLabels(examples)) {
    if (count > bestCount || (count === bestCount && label < bestLabel)) {
      bestLabel = label;
      bestCount = count;
    }
  }

  return bestLabel ?? 'unknown';
}

function uniqueFeatureValues(examples) {
  const values = new Map();

  for (const example of examples) {
    for (const [key, value] of Object.entries(example.features)) {
      if (!values.has(key)) {
        values.set(key, new Set());
      }

      values.get(key).add(value);
    }
  }

  return values;
}

function matchesCondition(features, condition) {
  return condition.every(({ key, value }) => features[key] === value);
}

function canonicalRuleKey(rule) {
  const conditionText = rule.condition
    .map(({ key, value }) => `${key}=${value}`)
    .join('&');

  return `${conditionText}->${rule.label}`;
}

export function trainOrderedRuleList(
  examples,
  {
    minSupport = 3,
    minPrecision = 0.75,
    maxRules = 8,
    maxConditions = 2
  } = {}
) {
  const uncovered = [...examples];
  const rules = [];
  const featureValues = uniqueFeatureValues(examples);

  while (uncovered.length >= minSupport && rules.length < maxRules) {
    let bestRule = null;

    const singles = [];
    for (const [key, values] of featureValues.entries()) {
      for (const value of values) {
        singles.push([{ key, value }]);
      }
    }

    const conditions = [...singles];
    if (maxConditions >= 2) {
      for (let i = 0; i < singles.length; i += 1) {
        for (let j = i + 1; j < singles.length; j += 1) {
          const first = singles[i][0];
          const second = singles[j][0];
          if (first.key === second.key) {
            continue;
          }

          conditions.push(
            [first, second].sort((left, right) => left.key.localeCompare(right.key))
          );
        }
      }
    }

    for (const condition of conditions) {
      const matches = uncovered.filter((example) => matchesCondition(example.features, condition));
      if (matches.length < minSupport) {
        continue;
      }

      const label = majorityLabel(matches);
      const correct = matches.filter((example) => example.label === label).length;
      const wrong = matches.length - correct;
      const precision = correct / matches.length;

      if (precision < minPrecision) {
        continue;
      }

      const score = correct * 4 - wrong * 3 - (condition.length - 1) * 0.5;

      if (!bestRule || score > bestRule.score) {
        bestRule = {
          condition,
          label,
          correct,
          wrong,
          support: matches.length,
          precision,
          score
        };
      }
    }

    if (!bestRule) {
      break;
    }

    rules.push(bestRule);

    for (let index = uncovered.length - 1; index >= 0; index -= 1) {
      if (matchesCondition(uncovered[index].features, bestRule.condition)) {
        uncovered.splice(index, 1);
      }
    }
  }

  return {
    rules,
    defaultLabel: majorityLabel(uncovered.length > 0 ? uncovered : examples)
  };
}

export function predictWithRuleList(model, features) {
  for (const rule of model.rules) {
    if (matchesCondition(features, rule.condition)) {
      return rule.label;
    }
  }

  return model.defaultLabel;
}

export function evaluateRuleListLOO(
  examples,
  options = {}
) {
  let correct = 0;
  const confusion = new Map();

  for (let index = 0; index < examples.length; index += 1) {
    const test = examples[index];
    const train = examples.filter((_, candidateIndex) => candidateIndex !== index);
    const model = trainOrderedRuleList(train, options);
    const predicted = predictWithRuleList(model, test.features);

    if (predicted === test.label) {
      correct += 1;
    }

    const key = `${test.label}->${predicted}`;
    confusion.set(key, (confusion.get(key) ?? 0) + 1);
  }

  return {
    total: examples.length,
    correct,
    accuracy: examples.length === 0 ? 0 : correct / examples.length,
    confusion
  };
}

export function bootstrapRuleStability(
  examples,
  options = {},
  resamples = 100
) {
  const counts = new Map();

  for (let iteration = 0; iteration < resamples; iteration += 1) {
    const sample = [];
    for (let index = 0; index < examples.length; index += 1) {
      sample.push(examples[Math.floor(Math.random() * examples.length)]);
    }

    const model = trainOrderedRuleList(sample, options);
    for (const rule of model.rules) {
      const key = canonicalRuleKey(rule);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([rule, count]) => ({
      rule,
      frequency: count / resamples
    }))
    .sort((left, right) => right.frequency - left.frequency);
}

export function summarizeLabels(examples) {
  return [...countLabels(examples).entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
}
