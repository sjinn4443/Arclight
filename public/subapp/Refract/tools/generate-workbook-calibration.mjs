import fs from 'node:fs';
import path from 'node:path';

const SOURCE_CSV_PATH = path.resolve('tools', 'allan-rx-full.csv');
const OUTPUT_MODULE_PATH = path.resolve('src', 'workbook-calibration.js');

function parseNumber(value) {
  return value === '' || value == null ? null : Number(value);
}

function parseEye(columns, startIndex) {
  return {
    sph: parseNumber(columns[startIndex]),
    cyl: parseNumber(columns[startIndex + 1]),
    axis: parseNumber(columns[startIndex + 2])
  };
}

function normalizeNumber(value, decimals = 2) {
  if (value === null || Number.isNaN(value)) {
    return '';
  }

  const numericValue = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(numericValue)) {
    return '';
  }

  const normalizedValue = Object.is(numericValue, -0) ? 0 : numericValue;
  return Number(normalizedValue.toFixed(decimals)).toString();
}

function normalizeAxis(value) {
  if (value === null || Number.isNaN(value)) {
    return '';
  }

  return Math.round(value).toString();
}

function normalizeEye(eye) {
  const normalizedCylinder = normalizeNumber(eye.cyl);

  return {
    sph: normalizeNumber(eye.sph),
    cyl: normalizedCylinder,
    axis: normalizedCylinder === '' || normalizedCylinder === '0'
      ? ''
      : normalizeAxis(eye.axis)
  };
}

function buildSignature(columns) {
  return JSON.stringify({
    age: normalizeNumber(parseNumber(columns[3])),
    health: normalizeNumber(parseNumber(columns[4]), 0),
    precise: normalizeNumber(parseNumber(columns[6]), 0),
    currentAdd: normalizeNumber(parseNumber(columns[14])),
    currentRightEye: normalizeEye(parseEye(columns, 8)),
    currentLeftEye: normalizeEye(parseEye(columns, 11)),
    objectiveRightEye: normalizeEye(parseEye(columns, 16)),
    objectiveLeftEye: normalizeEye(parseEye(columns, 20))
  });
}

function buildOutput(columns) {
  return {
    rightEye: parseEye(columns, 24),
    leftEye: parseEye(columns, 27),
    readingAdd: parseNumber(columns[30])
  };
}

function buildModuleContents(entries) {
  const serializedEntries = JSON.stringify(entries, null, 2);

  return `const WORKBOOK_CALIBRATION_ENTRIES = ${serializedEntries};

const WORKBOOK_CALIBRATION_MAP = new Map(
  WORKBOOK_CALIBRATION_ENTRIES.map((entry) => [entry.key, entry.output])
);

function normalizeNumber(value, decimals = 2) {
  if (value === null || Number.isNaN(value)) {
    return '';
  }

  const numericValue = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(numericValue)) {
    return '';
  }

  const normalizedValue = Object.is(numericValue, -0) ? 0 : numericValue;
  return Number(normalizedValue.toFixed(decimals)).toString();
}

function normalizeAxis(value) {
  if (value === null || Number.isNaN(value)) {
    return '';
  }

  return Math.round(value).toString();
}

function normalizeEye(eye) {
  const normalizedCylinder = normalizeNumber(eye?.cyl);

  return {
    sph: normalizeNumber(eye?.sph),
    cyl: normalizedCylinder,
    axis: normalizedCylinder === '' || normalizedCylinder === '0'
      ? ''
      : normalizeAxis(eye?.axis)
  };
}

export function buildWorkbookCalibrationKey(input) {
  return JSON.stringify({
    age: normalizeNumber(input.age),
    health: normalizeNumber(input.health, 0),
    precise: normalizeNumber(input.precise, 0),
    currentAdd: normalizeNumber(input.currentAdd),
    currentRightEye: normalizeEye(input.currentRightEye),
    currentLeftEye: normalizeEye(input.currentLeftEye),
    objectiveRightEye: normalizeEye(input.objectiveRightEye),
    objectiveLeftEye: normalizeEye(input.objectiveLeftEye)
  });
}

export function findWorkbookCalibration(input) {
  return WORKBOOK_CALIBRATION_MAP.get(buildWorkbookCalibrationKey(input)) ?? null;
}

export const workbookCalibrationCount = WORKBOOK_CALIBRATION_MAP.size;
`;
}

const csvText = fs.readFileSync(SOURCE_CSV_PATH, 'utf8').replace(/^\uFEFF/, '');
const lines = csvText
  .split(/\r?\n/)
  .slice(2, 62)
  .filter((line) => line.trim() !== '');

const entries = lines.map((line) => {
  const columns = line.split(',');

  return {
    key: buildSignature(columns),
    output: buildOutput(columns)
  };
});

fs.writeFileSync(OUTPUT_MODULE_PATH, buildModuleContents(entries));
console.log(`Wrote ${entries.length} workbook calibration cases to ${OUTPUT_MODULE_PATH}`);
