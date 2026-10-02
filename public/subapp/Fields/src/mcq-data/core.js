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

  const MCQ_SOURCE_REGISTRY = Object.freeze({
    "VISUAL-PATHWAY-2023": Object.freeze({
      title:
        "Visual Loss Due to Optic Chiasm and Retrochiasmal Visual Pathway Lesions",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10564022/",
    }),
    "VISUAL-PATHWAY-2021": Object.freeze({
      title: "Imaging of the Primary Visual Pathway Based on Visual Deficits",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8053434/",
    }),
  });

  const MCQ_REVIEW_STATUS = "Independent clinical sign-off pending";

  const parts = (globalScope.MCQ_DATA_PARTS = globalScope.MCQ_DATA_PARTS || {});
  Object.assign(parts, {
    MCQ_SET_STORAGE_KEY,
    MCQ_LEVELS,
    MCQ_SET_KEYS,
    MCQ_LEVEL_LABELS,
    MCQ_SET_LABELS,
    MCQ_SOURCE_REGISTRY,
    MCQ_REVIEW_STATUS,
  });
})(typeof window !== "undefined" ? window : globalThis);
