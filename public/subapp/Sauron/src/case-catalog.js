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
  "low-cylinder": "intermediate",
  "high-cylinder": "intermediate",
  anisometropia: "intermediate",
  "small-pupils": "intermediate",
  "small-scissors": "intermediate",
  "poor-tear-film": "intermediate",
  "small-cortical-cataract": "intermediate",
  "big-cortical-cataract": "intermediate",
  "dense-cataract": "intermediate",
  floaters: "intermediate",
  "central-sub-cortical-cataract": "advanced",
  keratoconus: "advanced",
  "corneal-scar": "advanced",
  acg: "advanced",
  aniridia: "advanced",
  aphakia: "advanced",
  "iris-transillumination": "advanced",
  "nasal-coloboma": "advanced",
  "posterior-pole-cataract": "advanced",
  "vitreous-haemorrhage": "advanced",
  leucocoria: "advanced",
  "partial-retinal-detachment": "advanced",
  "posterior-capsular-thickening": "advanced",
};

export const CASE_SAFETY_BY_VALUE = Object.freeze({
  acg: Object.freeze({
    title: "Acute angle-closure warning",
    body: "The exaggerated oval is a stylised teaching cue, not a diagnostic pupil shape. A painful red eye with a fixed or poorly reactive mid-dilated pupil is an ocular emergency. This simulation does not diagnose angle closure; arrange urgent ophthalmic assessment.",
  }),
  leucocoria: Object.freeze({
    title: "Abnormal white reflex",
    body: "A white or absent red reflex, particularly in a child, requires urgent ophthalmic assessment. Causes include cataract, retinal disease and intraocular tumour.",
  }),
  "vitreous-haemorrhage": Object.freeze({
    title: "Vitreous haemorrhage warning",
    body: "A suddenly darkened reflex with new floaters or loss of vision may reflect vitreous haemorrhage and underlying retinal pathology. Arrange urgent ophthalmic assessment.",
  }),
  "partial-retinal-detachment": Object.freeze({
    title: "Retinal detachment warning",
    body: "A fixed dark sector with symptoms suggesting retinal detachment requires urgent ophthalmic assessment. The simulator appearance is illustrative only.",
  }),
});

const CASE_SUMMARY_BY_VALUE = {
  "high-minus": "Slow against movement with a narrow reflex.",
  minus: "Against movement before neutralisation.",
  zero: "No directional movement at neutrality.",
  plus: "With movement before neutralisation.",
  "high-plus": "Slow broad with movement requiring more plus.",
  "low-cylinder":
    "Stylised example: opposite movement in the two principal meridians.",
  "high-cylinder":
    "Stylised example: stronger change between the two principal meridians.",
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
  acg: "Stylised vertical oval pupil with abnormal reflex behaviour.",
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
  "dense-cataract",
  "floaters",
  "keratoconus",
  "corneal-scar",
  "acg",
  "aniridia",
  "aphakia",
  "iris-transillumination",
  "nasal-coloboma",
  "central-sub-cortical-cataract",
  "posterior-pole-cataract",
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
    safetyNote: CASE_SAFETY_BY_VALUE[option.value] || null,
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
