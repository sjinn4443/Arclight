const TEST_CONDITION_CONTEXT = {
  zero: ["Screening", "No symptoms"],
  "normal-dark": ["Incidental", "No symptoms"],
  "bilateral-blue-normal": ["Screening", "No symptoms"],
  "bilateral-dull-reflex": ["Gradual", "Blur"],
  "bilateral-poor-tear-film": ["Fluctuating", "Variable blur"],
  "bilateral-high-hypermetropia": ["Screening", "Blur/strain"],
  "bilateral-myopia": ["Gradual", "Distance blur"],
  "right-hyper-left-myopia": ["Screening", "Blur"],
  "right-normal-left-large-esotropia": ["Early onset", "No symptoms"],
  "right-large-exotropia-left-corneal-scar": ["Longstanding", "Blur"],
  "right-coloboma-left-normal": ["Congenital", "Photophobia"],
  "bilateral-aniridia": ["Congenital", "Photophobia"],
  "right-normal-left-anisocoria": ["Incidental", "No symptoms"],
  "right-iris-transillumination-left-normal": ["Gradual", "Photophobia"],
  "bilateral-small-pupils": ["Incidental", "No symptoms"],
  "right-acg-left-normal": ["Sudden", "Pain/haloes"],
  "right-iridocyclitis-left-normal": ["Sudden", "Pain/photo"],
  "bilateral-keratoconus": ["Gradual", "Blur/ghosting"],
  "right-normal-left-corneal-opacity": ["Longstanding", "Blur"],
  "right-hyper-left-posterior-pole": ["Screening", "Reduced vision"],
  "bilateral-dense-cataract": ["Gradual", "Glare/blur"],
  "right-big-cortical-left-small-cortical": ["Gradual", "Glare"],
  "bilateral-subcapsular-cataract": ["Gradual", "Glare/near blur"],
  "right-iol-left-posterior-capsular-thickening": ["After surgery", "Blur"],
  "right-aphakia-left-normal": ["After surgery", "Blur"],
  "right-normal-left-subluxated-lens": ["Longstanding", "Blur/diplopia"],
  "right-retinoblastoma-left-normal": ["Parent noticed", "White pupil"],
  "right-floaters-left-normal": ["Sudden", "Floaters"],
  "right-vitreous-haemorrhage-left-normal": ["Sudden", "Floaters/blur"],
  "right-retinal-detachment-left-normal": ["Sudden", "Shadow/flashes"],
};

const DEFAULT_TEST_CONTEXT = ["Incidental", "No symptoms"];

export function getTestConditionContext(conditionValue) {
  return TEST_CONDITION_CONTEXT[conditionValue] || DEFAULT_TEST_CONTEXT;
}
