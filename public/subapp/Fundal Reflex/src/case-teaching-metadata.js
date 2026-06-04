import { REFRACTION_OPTIONS } from "./case-catalog.js?v=20260430-6";

const CASE_TEACHING_METADATA = {
  zero: {
    why: "both eyes match in brightness, shape and crescent position",
    keyClue: "both eyes look closely matched",
    similarCases: ["bilateral-blue-normal", "bilateral-dull-reflex"],
  },
  "normal-dark": {
    why: "left reflex is much darker than the right",
    keyClue: "marked asymmetry, one eye looks dark",
    similarCases: [
      "right-normal-left-corneal-opacity",
      "right-retinoblastoma-left-normal",
    ],
  },
  "bilateral-blue-normal": {
    why: "both reflexes are blue-white but otherwise matched",
    keyClue: "colour shift with otherwise similar reflexes",
    similarCases: ["zero", "bilateral-dull-reflex"],
  },
  "technique-child-looking-away": {
    why: "the pupils are not looking towards the light, so this is a poor view",
    keyClue: "both eyes are looking away from the examiner",
    similarCases: ["zero", "right-normal-left-large-esotropia"],
  },
  "technique-upper-lid-blocking": {
    why: "the upper lids partly cover the pupils, so the reflex cannot be judged well",
    keyClue: "upper lids block the pupil opening",
    similarCases: ["zero", "bilateral-small-pupils"],
  },
  "bilateral-dull-reflex": {
    why: "both corneal reflexes are dimmer and greyer than normal",
    keyClue: "bilateral corneal reflex dullness without a focal plaque",
    similarCases: ["bilateral-dense-cataract", "bilateral-blue-normal"],
  },
  "bilateral-poor-tear-film": {
    why: "both surface reflexes look uneven and lose sharpness",
    keyClue: "surface reflex flickers rather than stays fixed",
    similarCases: ["bilateral-dull-reflex", "zero"],
  },
  "bilateral-high-hypermetropia": {
    why: "large bright superior crescents are present in both eyes",
    keyClue: "top crescents in both pupils",
    similarCases: ["right-hyper-left-myopia", "zero"],
  },
  "bilateral-myopia": {
    why: "large bright inferior crescents are present in both eyes",
    keyClue: "bottom crescents in both pupils",
    similarCases: ["right-hyper-left-myopia", "bilateral-keratoconus"],
  },
  "right-hyper-left-myopia": {
    why: "the right crescent is superior and the left crescent is inferior",
    keyClue: "crescent direction differs between the eyes",
    similarCases: ["bilateral-high-hypermetropia", "bilateral-myopia"],
  },
  "right-normal-left-large-esotropia": {
    why: "the left eye turns in so the two eyes no longer align equally",
    keyClue: "turned-in eye shows a brighter reflex",
    similarCases: [
      "right-large-exotropia-left-corneal-scar",
      "right-normal-left-anisocoria",
    ],
  },
  "right-large-exotropia-left-corneal-scar": {
    why: "the right eye turns out and the left reflex is broken by corneal irregularity",
    keyClue: "outward deviation plus corneal irregularity",
    similarCases: [
      "right-normal-left-large-esotropia",
      "right-normal-left-corneal-opacity",
    ],
  },
  "right-coloboma-left-normal": {
    why: "the right pupil has an inferior keyhole shape",
    keyClue: "notched keyhole pupil",
    similarCases: [
      "bilateral-aniridia",
      "right-iris-transillumination-left-normal",
    ],
  },
  "bilateral-aniridia": {
    why: "both pupils are very large with very little visible iris and typical nystagmus",
    keyClue: "absent iris tissue plus nystagmus",
    similarCases: ["right-coloboma-left-normal", "bilateral-small-pupils"],
  },
  "right-normal-left-anisocoria": {
    why: "the left pupil is clearly smaller while reflex shape stays similar",
    keyClue: "pupil sizes do not match",
    similarCases: ["bilateral-small-pupils", "right-acg-left-normal"],
  },
  "right-iris-transillumination-left-normal": {
    why: "light is seen passing through a patchy right iris, most likely from peripheral iridectomy or trauma",
    keyClue: "iris transillumination, often iridectomy or trauma",
    similarCases: [
      "right-coloboma-left-normal",
      "right-iridocyclitis-left-normal",
    ],
  },
  "bilateral-small-pupils": {
    why: "both pupils are symmetrically small and round",
    keyClue: "both pupils are small, not just one",
    similarCases: ["right-normal-left-anisocoria", "bilateral-aniridia"],
  },
  "right-acg-left-normal": {
    why: "the right pupil is vertically oval rather than round",
    keyClue: "oval pupil in one acute eye",
    similarCases: [
      "right-normal-left-anisocoria",
      "right-iridocyclitis-left-normal",
    ],
  },
  "right-iridocyclitis-left-normal": {
    why: "small dark deposits sit on the right reflex superiorly and temporally",
    keyClue: "tiny black dots on the reflex",
    similarCases: [
      "right-iris-transillumination-left-normal",
      "right-acg-left-normal",
    ],
  },
  "bilateral-keratoconus": {
    why: "the reflex is split into bilateral scissors-like bands",
    keyClue: "large bilateral scissors reflex",
    similarCases: ["bilateral-myopia", "bilateral-high-hypermetropia"],
  },
  "right-normal-left-corneal-opacity": {
    why: "the left reflex is grey and the corneal highlight is not sharp",
    keyClue: "grey reflex with hazy corneal highlight",
    similarCases: ["right-large-exotropia-left-corneal-scar", "normal-dark"],
  },
  "right-hyper-left-posterior-pole": {
    why: "the left has a focal posterior opacity and the right has a superior crescent",
    keyClue: "focal posterior opacity plus opposite-eye hypermetropia",
    similarCases: [
      "bilateral-subcapsular-cataract",
      "bilateral-dense-cataract",
    ],
  },
  "bilateral-dense-cataract": {
    why: "both reflexes are very dull and muted by dense opacity",
    keyClue: "bilateral dense media haze",
    similarCases: ["bilateral-dull-reflex", "bilateral-subcapsular-cataract"],
  },
  "right-big-cortical-left-small-cortical": {
    why: "radial spoke-like lens changes are present in both eyes, worse on the right",
    keyClue: "lens spokes, right greater than left",
    similarCases: [
      "bilateral-subcapsular-cataract",
      "bilateral-dense-cataract",
    ],
  },
  "bilateral-subcapsular-cataract": {
    why: "central posterior plaques interrupt the reflex in both pupils",
    keyClue: "central posterior plaques, often with glare",
    similarCases: [
      "right-hyper-left-posterior-pole",
      "bilateral-dense-cataract",
    ],
  },
  "right-iol-left-posterior-capsular-thickening": {
    why: "the right shows a second reflex and the left shows posterior capsular haze",
    keyClue: "double reflex on one side, capsule haze on the other",
    similarCases: [
      "right-aphakia-left-normal",
      "bilateral-subcapsular-cataract",
    ],
  },
  "right-aphakia-left-normal": {
    why: "the right reflex is unusually bright and fills most of the pupil",
    keyClue: "very bright full aphakic reflex",
    similarCases: ["right-iol-left-posterior-capsular-thickening", "zero"],
  },
  "right-normal-left-subluxated-lens": {
    why: "a lens edge is visible with a reversed inferior crescent on the left",
    keyClue: "inferior lens edge with reversed crescent",
    similarCases: [
      "right-hyper-left-posterior-pole",
      "right-aphakia-left-normal",
    ],
  },
  "right-retinoblastoma-left-normal": {
    why: "the right pupil is creamy white with red vessels across it",
    keyClue: "white pupil with red vessels",
    similarCases: ["normal-dark", "right-normal-left-corneal-opacity"],
  },
  "right-floaters-left-normal": {
    why: "dark vitreous strands cross an otherwise normal right reflex",
    keyClue: "moving vitreous opacities",
    similarCases: [
      "right-vitreous-haemorrhage-left-normal",
      "right-retinal-detachment-left-normal",
    ],
  },
  "right-vitreous-haemorrhage-left-normal": {
    why: "blood diffusely darkens and clouds the normal right reflex",
    keyClue: "diffuse blood-darkening within the vitreous",
    similarCases: [
      "right-floaters-left-normal",
      "right-retinal-detachment-left-normal",
    ],
  },
  "right-retinal-detachment-left-normal": {
    why: "a fixed shadowed sector reduces part of the right reflex",
    keyClue: "fixed shadowed segment with remaining peripheral reflex",
    similarCases: [
      "right-vitreous-haemorrhage-left-normal",
      "right-floaters-left-normal",
    ],
  },
};

const DEFAULT_CASE_TEACHING = {
  why: "pattern does not match a teaching note yet",
  keyClue: "compare the reflex carefully",
  similarCases: [],
};

export function getCaseTeachingMetadata(caseValue) {
  return CASE_TEACHING_METADATA[caseValue] || DEFAULT_CASE_TEACHING;
}

export function getSimilarCaseOptions(caseValue) {
  const similarValues = getCaseTeachingMetadata(caseValue).similarCases || [];
  return similarValues
    .map((value) => REFRACTION_OPTIONS.find((option) => option.value === value))
    .filter(Boolean);
}
