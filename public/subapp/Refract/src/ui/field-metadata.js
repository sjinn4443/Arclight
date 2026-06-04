export const POSITIVE_SIGN = "+";
export const NEGATIVE_SIGN = "-";

function getPlaceholder(input) {
  return (input?.placeholder || "").trim().toLowerCase();
}

function getFieldId(input) {
  return (input?.id || "").trim().toLowerCase();
}

export function getFieldStep(input) {
  return parseFloat(input.getAttribute("step")) || 0.25;
}

export function isAxisField(input) {
  const placeholder = getPlaceholder(input);
  const id = getFieldId(input);
  return placeholder === "axis" || id.includes("axis");
}

export function isAgeField(input) {
  return getFieldId(input) === "age";
}

export function isAddField(input) {
  const placeholder = getPlaceholder(input);
  const id = getFieldId(input);
  return placeholder === "add" || id.includes("add");
}

export function isCylinderField(input) {
  return getPlaceholder(input) === "cyl";
}

export function isSphereField(input) {
  return getPlaceholder(input) === "sph";
}

export function formatFieldValue(value, step) {
  const numericValue = parseFloat(value) || 0;
  const roundedValue = Math.round(numericValue / step) * step;
  return step < 1 ? roundedValue.toFixed(2) : String(Math.round(roundedValue));
}

export function getDefaultInputBorder(input) {
  return input.closest(".results-section")
    ? "1.5px solid #2c3038"
    : "1.5px solid var(--input-border)";
}
