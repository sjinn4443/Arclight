/*
 * mcq-data/core.js
 */
(function registerMcqDataPart(globalScope) {
  const MCQ_SET_STORAGE_KEY = "fields_mcq_set_v2";

  const MCQ_LEVELS = ["primary", "intermediate", "advanced"];

  const MCQ_SET_KEYS = ["textClassic", "fieldPattern", "pathwayVisual"];

  const MCQ_LEVEL_LABELS = {
    primary: "Primary",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };

  const MCQ_SET_LABELS = {
    textClassic: "Text MCQs (Original)",
    fieldPattern: "Field Loss: What Is It?",
    pathwayVisual: "Pathway Drawing: Site <-> Loss",
  };

  const parts = (globalScope.MCQ_DATA_PARTS = globalScope.MCQ_DATA_PARTS || {});
  Object.assign(parts, {
    MCQ_SET_STORAGE_KEY,
    MCQ_LEVELS,
    MCQ_SET_KEYS,
    MCQ_LEVEL_LABELS,
    MCQ_SET_LABELS,
  });
})(typeof window !== "undefined" ? window : globalThis);
