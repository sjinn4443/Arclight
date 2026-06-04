import {
  formatFieldValue,
  getFieldStep,
  isAddField,
  isAgeField,
  isAxisField,
  isCylinderField,
  isSphereField,
} from "./field-metadata.js?v=20260310-14";
import {
  clearFieldValue,
  readSignedFieldValue,
  syncFieldSign,
  writeSignedFieldValue,
} from "./sign-fields.js?v=20260310-14";
import {
  MAX_AXIS,
  MAX_AGE,
  MIN_AGE,
  MIN_AXIS,
} from "./spinner-constants.js?v=20260310-14";
import { syncVisualPlaceholder } from "./visual-placeholders.js?v=20260310-14";

export function getInputMeta(input) {
  return {
    step: getFieldStep(input),
    isAxis: isAxisField(input),
    isAge: isAgeField(input),
    isAdd: isAddField(input),
    isCylinder: isCylinderField(input),
    isSphere: isSphereField(input),
  };
}

export function getCurrentFieldValue(input, meta) {
  const numericValue = parseFloat(input.value) || 0;

  if (meta.isAxis || meta.isAge) {
    return numericValue;
  }

  const signedValue = readSignedFieldValue(input);
  return Number.isNaN(signedValue) ? numericValue : signedValue;
}

export function writeSignedValue(input, meta, value, options = {}) {
  writeSignedFieldValue(input, value, {
    ...options,
    step: meta.step,
    unsigned: meta.isAxis || meta.isAge,
  });
}

export function clearValue(input, meta, options = {}) {
  clearFieldValue(input, {
    ...options,
    unsigned: meta.isAxis || meta.isAge,
  });
}

export function normalizeInputValue(input, meta) {
  const numericValue = parseFloat(input.value) || 0;

  if (meta.isAxis) {
    input.value = formatFieldValue(
      Math.max(MIN_AXIS, Math.min(MAX_AXIS, numericValue)),
      meta.step,
    );
    syncFieldSign(input, 0, { unsigned: true });
    syncVisualPlaceholder(input);
    return;
  }

  if (meta.isAge) {
    input.value = formatFieldValue(
      Math.max(MIN_AGE, Math.min(MAX_AGE, numericValue)),
      meta.step,
    );
    syncFieldSign(input, 0, { unsigned: true });
    syncVisualPlaceholder(input);
    return;
  }

  if (meta.isAdd) {
    if (numericValue < 0.25) {
      clearValue(input, meta);
      return;
    }

    input.value = formatFieldValue(numericValue, meta.step);
    syncFieldSign(input, numericValue);
    syncVisualPlaceholder(input);
    return;
  }

  const currentValue = getCurrentFieldValue(input, meta);
  input.value = formatFieldValue(Math.abs(currentValue), meta.step);
  syncFieldSign(input, currentValue);
  syncVisualPlaceholder(input);
}

export function syncSignedDisplay(input, meta, value) {
  syncFieldSign(input, value, { unsigned: meta.isAxis || meta.isAge });
}

export function cycleAxis(input, offset) {
  const currentValue = parseFloat(input.value) || 0;
  return ((currentValue - 1 + offset + MAX_AXIS) % MAX_AXIS) + 1;
}

export function adjustAge(input, offset) {
  const currentValue = parseFloat(input.value) || 0;
  return Math.max(MIN_AGE, Math.min(MAX_AGE, currentValue + offset));
}
