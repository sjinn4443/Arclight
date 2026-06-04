import { formatNumber } from "../prescription-logic.js?v=20260310-14";
import {
  NEGATIVE_SIGN,
  POSITIVE_SIGN,
  formatFieldValue,
  getFieldStep,
} from "./field-metadata.js?v=20260310-14";
import { syncVisualPlaceholder } from "./visual-placeholders.js?v=20260310-14";

const FIELD_SIGN_SELECTOR = ".field-sign";

function isElement(value) {
  return typeof HTMLElement !== "undefined" && value instanceof HTMLElement;
}

function dispatchFieldChange(input, shouldDispatch) {
  if (shouldDispatch) {
    input.dispatchEvent(new Event("change"));
  }
}

function resolveInput(target) {
  if (typeof target === "string") {
    return document.getElementById(target);
  }

  return isElement(target) ? target : null;
}

function resolveWrapper(target) {
  if (isElement(target) && target.classList.contains("spinner-container")) {
    return target;
  }

  const input = resolveInput(target);
  return input?.closest(".spinner-container") ?? null;
}

function normalizeSign(sign) {
  return sign === NEGATIVE_SIGN || sign === POSITIVE_SIGN ? sign : "";
}

export function ensureFieldSignElement(target) {
  const wrapper = resolveWrapper(target);
  if (!wrapper) {
    return null;
  }

  let signElement = wrapper.querySelector(FIELD_SIGN_SELECTOR);
  if (signElement) {
    return signElement;
  }

  signElement = document.createElement("span");
  signElement.classList.add("field-sign");
  signElement.setAttribute("aria-hidden", "true");
  wrapper.insertBefore(signElement, wrapper.firstChild);
  return signElement;
}

export function getStoredFieldSign(target) {
  const wrapper = resolveWrapper(target);
  return normalizeSign(wrapper?.dataset.sign || "");
}

export function setStoredFieldSign(target, sign) {
  const wrapper = resolveWrapper(target);
  if (!wrapper) {
    return;
  }

  const normalizedSign = normalizeSign(sign);
  let signElement = wrapper.querySelector(FIELD_SIGN_SELECTOR);

  if (normalizedSign) {
    wrapper.dataset.sign = normalizedSign;
    signElement = signElement ?? ensureFieldSignElement(wrapper);
  } else {
    delete wrapper.dataset.sign;
  }

  if (signElement) {
    signElement.textContent = normalizedSign;
  }
}

export function syncFieldSign(target, value, options = {}) {
  const { unsigned = false } = options;
  if (unsigned || value === null || Number.isNaN(value) || value === 0) {
    setStoredFieldSign(target, "");
    return;
  }

  setStoredFieldSign(target, value > 0 ? POSITIVE_SIGN : NEGATIVE_SIGN);
}

export function readSignedFieldValue(target, options = {}) {
  const { unsigned = false } = options;
  const input = resolveInput(target);
  if (!input || !input.value.trim()) {
    return Number.NaN;
  }

  const numericValue = parseFloat(input.value);
  if (Number.isNaN(numericValue) || unsigned) {
    return numericValue;
  }

  return numericValue * (getStoredFieldSign(input) === NEGATIVE_SIGN ? -1 : 1);
}

export function clearFieldValue(target, options = {}) {
  const { dispatch = true, unsigned = false } = options;
  const input = resolveInput(target);
  if (!input) {
    return;
  }

  input.value = "";
  syncFieldSign(input, 0, { unsigned });
  syncVisualPlaceholder(input);
  dispatchFieldChange(input, dispatch);
}

export function writeSignedFieldValue(target, value, options = {}) {
  const { dispatch = true, step, unsigned = false, formatMagnitude } = options;
  const input = resolveInput(target);
  if (!input) {
    return;
  }

  if (value === null || Number.isNaN(value)) {
    clearFieldValue(input, { dispatch, unsigned });
    return;
  }

  const formatter =
    typeof formatMagnitude === "function"
      ? formatMagnitude
      : (magnitude) => formatFieldValue(magnitude, step ?? getFieldStep(input));

  input.value = formatter(Math.abs(value));
  syncFieldSign(input, value, { unsigned });
  syncVisualPlaceholder(input);
  dispatchFieldChange(input, dispatch);
}

export function getSignedValue(inputId) {
  return readSignedFieldValue(inputId);
}

export function setSignedValue(inputId, newValue, options = {}) {
  writeSignedFieldValue(inputId, newValue, options);
}

export function updateOutputWithSign(outputFieldId, value, decimals = 2) {
  writeSignedFieldValue(outputFieldId, value, {
    dispatch: false,
    formatMagnitude: (magnitude) => formatNumber(magnitude, decimals),
  });
}

export function readAxisValue(inputId) {
  const input = document.getElementById(inputId);
  const rawValue = input?.value.trim();
  return rawValue ? parseFloat(rawValue) : Number.NaN;
}

export function writeAxisValue(inputId, value, options = {}) {
  const { dispatch = true } = options;
  const input = document.getElementById(inputId);
  if (!input) {
    return;
  }

  input.value =
    value === null || Number.isNaN(value) ? "" : String(Math.round(value));
  syncVisualPlaceholder(input);
  dispatchFieldChange(input, dispatch);
}
