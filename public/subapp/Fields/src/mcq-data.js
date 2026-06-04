/*
 * mcq-data.js (aggregator)
 *
 * Data parts are split into:
 * - src/mcq-data/core.js
 * - src/mcq-data/library.js
 * - src/mcq-data/sets.js
 */
(function initMcqData(globalScope) {
  const parts = globalScope.MCQ_DATA_PARTS || {};
  const requiredKeys = [
    "MCQ_SET_STORAGE_KEY",
    "MCQ_LEVELS",
    "MCQ_SET_KEYS",
    "MCQ_LEVEL_LABELS",
    "MCQ_SET_LABELS",
    "PATTERNS",
    "SITES",
    "TEXT_BANK",
    "FIELD_SPECS_PRIMARY",
    "FIELD_SPECS_HIGHER",
    "FIELD_SPECS_ADVANCED_EXTRA",
    "PATHWAY_SPECS_PRIMARY",
    "PATHWAY_SPECS_HIGHER",
    "PATHWAY_SPECS_ADVANCED_EXTRA",
    "TEACHING_CASES",
  ];

  const missing = requiredKeys.filter((key) => !(key in parts));
  if (missing.length) {
    throw new Error(
      `MCQ data parts not loaded before src/mcq-data.js. Missing: ${missing.join(", ")}`,
    );
  }

  globalScope.MCQ_DATA = {
    MCQ_SET_STORAGE_KEY: parts.MCQ_SET_STORAGE_KEY,
    MCQ_LEVELS: parts.MCQ_LEVELS,
    MCQ_SET_KEYS: parts.MCQ_SET_KEYS,
    MCQ_LEVEL_LABELS: parts.MCQ_LEVEL_LABELS,
    MCQ_SET_LABELS: parts.MCQ_SET_LABELS,
    PATTERNS: parts.PATTERNS,
    SITES: parts.SITES,
    TEXT_BANK: parts.TEXT_BANK,
    FIELD_SPECS_PRIMARY: parts.FIELD_SPECS_PRIMARY,
    FIELD_SPECS_HIGHER: parts.FIELD_SPECS_HIGHER,
    FIELD_SPECS_ADVANCED_EXTRA: parts.FIELD_SPECS_ADVANCED_EXTRA,
    PATHWAY_SPECS_PRIMARY: parts.PATHWAY_SPECS_PRIMARY,
    PATHWAY_SPECS_HIGHER: parts.PATHWAY_SPECS_HIGHER,
    PATHWAY_SPECS_ADVANCED_EXTRA: parts.PATHWAY_SPECS_ADVANCED_EXTRA,
    TEACHING_CASES: parts.TEACHING_CASES,
  };
})(typeof window !== "undefined" ? window : globalThis);
