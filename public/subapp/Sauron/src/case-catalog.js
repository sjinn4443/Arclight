import { REFRACTION_OPTIONS } from "./constants.js";

const LEVEL_META = {
  primary: {
    label: "Primary cases",
    shortLabel: "Primary",
    marker: "P",
    order: 1,
  },
  intermediate: {
    label: "Intermediate cases",
    shortLabel: "Intermediate",
    marker: "I",
    order: 2,
  },
  advanced: {
    label: "Advanced cases",
    shortLabel: "Advanced",
    marker: "A",
    order: 3,
  },
};

const CASE_LEVEL_BY_VALUE = {
  "high-minus": "primary",
  minus: "primary",
  zero: "primary",
  plus: "primary",
  "high-plus": "primary",
  "low-cylinder": "primary",
  "high-cylinder": "intermediate",
  anisometropia: "intermediate",
  "small-pupils": "intermediate",
  "small-scissors": "intermediate",
  "poor-tear-film": "intermediate",
  "small-cortical-cataract": "intermediate",
  "big-cortical-cataract": "intermediate",
  "central-sub-cortical-cataract": "intermediate",
  keratoconus: "advanced",
  "corneal-scar": "advanced",
  acg: "advanced",
  aniridia: "advanced",
  aphakia: "advanced",
  "iris-transillumination": "advanced",
  "nasal-coloboma": "advanced",
  "posterior-pole-cataract": "advanced",
  "dense-cataract": "advanced",
  floaters: "advanced",
  "vitreous-haemorrhage": "advanced",
  leucocoria: "advanced",
  "partial-retinal-detachment": "advanced",
  "posterior-capsular-thickening": "advanced",
};

const CASE_SUMMARY_BY_VALUE = {
  "high-minus": "Fast against movement with a narrow reflex.",
  minus: "Against movement before neutralisation.",
  zero: "No directional movement at neutrality.",
  plus: "With movement before neutralisation.",
  "high-plus": "Slow broad with movement requiring more plus.",
  "low-cylinder": "Two meridians, mild axis-dependent change.",
  "high-cylinder": "Stronger meridional difference and axis finding.",
  anisometropia: "Different reflex behaviour between right and left eyes.",
  "small-pupils": "Reduced aperture makes the reflex harder to judge.",
  "small-scissors": "Subtle split reflex with irregular movement.",
  "poor-tear-film": "Unstable shimmering reflex surface.",
  "small-cortical-cataract": "Peripheral cortical opacity crossing the reflex.",
  "big-cortical-cataract": "More extensive cortical spokes.",
  "central-sub-cortical-cataract":
    "Central posterior opacity dulling the reflex.",
  keratoconus: "Large scissors reflex with marked irregularity.",
  "corneal-scar": "Diffuse corneal haze disrupting the streak.",
  acg: "Oval pupil geometry with abnormal reflex behaviour.",
  aniridia: "Large abnormal aperture with unstable reflex detail.",
  aphakia: "High plus behaviour with altered pupil optics.",
  "iris-transillumination": "Peripheral iris light leak alongside the reflex.",
  "nasal-coloboma": "Notched pupil aperture affecting the reflex edge.",
  "posterior-pole-cataract": "Dense central posterior pole defect.",
  "dense-cataract": "Very dull reflex through dense media opacity.",
  floaters: "Mobile vitreous shadows over the reflex.",
  "vitreous-haemorrhage": "Dark vitreous opacity reducing the view.",
  leucocoria: "White reflex appearance rather than normal red-orange.",
  "partial-retinal-detachment":
    "Fixed dark sector with remaining reflex visible.",
  "posterior-capsular-thickening": "IOL/capsule haze reducing reflex clarity.",
};

const BABY_CASE_VALUES = new Set([
  "zero",
  "plus",
  "high-plus",
  "minus",
  "low-cylinder",
  "anisometropia",
  "small-pupils",
  "central-sub-cortical-cataract",
  "dense-cataract",
  "leucocoria",
]);

const CASE_ORDER = [
  "zero",
  "minus",
  "plus",
  "high-minus",
  "high-plus",
  "low-cylinder",
  "high-cylinder",
  "anisometropia",
  "small-pupils",
  "small-scissors",
  "poor-tear-film",
  "small-cortical-cataract",
  "big-cortical-cataract",
  "central-sub-cortical-cataract",
  "keratoconus",
  "corneal-scar",
  "acg",
  "aniridia",
  "aphakia",
  "iris-transillumination",
  "nasal-coloboma",
  "posterior-pole-cataract",
  "dense-cataract",
  "floaters",
  "vitreous-haemorrhage",
  "leucocoria",
  "partial-retinal-detachment",
  "posterior-capsular-thickening",
];

const CASE_ORDER_BY_VALUE = new Map(
  CASE_ORDER.map((value, index) => [value, index]),
);

export const RETINOSCOPY_CASES = REFRACTION_OPTIONS.map((option) => {
  const level = CASE_LEVEL_BY_VALUE[option.value] || "advanced";
  return {
    ...option,
    order: CASE_ORDER_BY_VALUE.get(option.value) ?? Number.MAX_SAFE_INTEGER,
    level,
    levelLabel: LEVEL_META[level].shortLabel,
    levelMarker: LEVEL_META[level].marker,
    summary: CASE_SUMMARY_BY_VALUE[option.value] || option.label,
    thumbnailSrc: `assets/case-thumbnails/${option.value}.webp?v=20260507-fellow-corneal`,
    isBabyCase: BABY_CASE_VALUES.has(option.value),
  };
})
  .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
  .map((caseItem, index) => ({
    ...caseItem,
    index: index + 1,
  }));

export const CASE_LEVELS = Object.entries(LEVEL_META)
  .map(([value, meta]) => ({ value, ...meta }))
  .sort((a, b) => a.order - b.order);

export function getCaseByValue(value) {
  return RETINOSCOPY_CASES.find((caseItem) => caseItem.value === value) || null;
}

export function getCaseList({ babyOnly = false } = {}) {
  if (!babyOnly) {
    return RETINOSCOPY_CASES;
  }

  return RETINOSCOPY_CASES.filter((caseItem) => caseItem.isBabyCase);
}

export function getFallbackBabyCase() {
  return getCaseByValue("zero") || RETINOSCOPY_CASES[0] || null;
}
