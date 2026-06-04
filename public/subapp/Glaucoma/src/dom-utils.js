export function $(selector, root = document) {
  return root.querySelector(selector);
}

export function $$(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
