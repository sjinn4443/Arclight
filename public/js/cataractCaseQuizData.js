import { evaluateCataractDecision } from "../subapp/Cataract/src/cataract-engine.js";

const baseline = {
  onsetValue: "gradual",
  ageBand: "elderly",
  eyes: "two",
  distanceVA: "6/36",
  nearVAValue: "N18",
  painYes: false,
  painRecorded: true,
  pupilRecorded: true,
  pupilAbnormal: false,
  frontRecorded: true,
  frontPresent: false,
  afferentRecorded: true,
  afferentConcern: false,
  fundalSelection: "dark",
  backSelection: "normal",
};

export const CATARACT_QUIZ_CASES = [
  {
    id: "child-white-reflex",
    retinalViews: { right: "obscured", left: "clear" },
    findings: {
      ageBand: "baby",
      eyes: "one",
      distanceVA: "fix_follow_poor",
      nearVAValue: "",
      fundalSelection: "white",
      backSelection: "poor view",
    },
    lines: [
      "This is a 1-year-old child. The mother is giving the history.",
      "Only the right eye is affected; the left eye appears normal.",
      "The mother says she noticed a white pupil when the child was very young.",
      "She says the child does not fix on or follow a toy well with that eye.",
      "She reports no pain or redness.",
    ],
    answer: "White reflex in a child — urgent paediatric eye review",
    distractors: [
      "Age-related nuclear cataract",
      "Normal eyes — no review needed",
      "Cortical cataract — routine adult referral",
    ],
    explanation:
      "A white pupil in a child needs urgent review by an eye specialist. It may be a cataract, but retinoblastoma must be ruled out. The retina cannot be seen clearly.",
    nextStep: "Arrange urgent review by a paediatric eye specialist.",
  },
  {
    id: "nuclear",
    retinalViews: { right: "diffuse", left: "diffuse" },
    findings: {},
    lines: [
      "This patient is 74 years old.",
      "Both eyes are affected.",
      "The patient reports that their vision has become cloudy slowly over many months.",
      "There is no pain or redness.",
      "Their worse eye reads 6/36 at distance and N18 near.",
    ],
    answer: "Nuclear cataract — early cataract assessment",
    distractors: [
      "Cortical cataract",
      "Subcapsular cataract",
      "Normal reflex — no cataract referral",
    ],
    explanation:
      "Slow, painless blur and a dull reflex suggest a nuclear cataract. The cloudy lens also makes the retina harder to see. Check the lens and ask how vision affects daily life. VA alone does not decide the need for surgery.",
    nextStep: "Arrange a cataract assessment and check the retina.",
  },
  {
    id: "cortical",
    retinalViews: { right: "mild", left: "clear" },
    findings: {
      fundalSelection: "patches",
      distanceVA: "6/12",
      nearVAValue: "N12",
    },
    lines: [
      "This patient is 68 years old.",
      "Both eyes are affected, one more than the other.",
      "The patient reports a gradual change in vision.",
      "They say glare makes seeing more difficult.",
      "There is no pain or redness. Their worse-eye distance VA is 6/12.",
    ],
    answer: "Cortical cataract — cataract assessment advised",
    distractors: [
      "Nuclear cataract",
      "Subcapsular cataract",
      "Retinal detachment — same-day assessment",
    ],
    explanation:
      "Spoke-like shadows suggest a cortical cataract. The retina may still be seen through clearer parts of the lens. Glare can make daily tasks difficult, so arrange a cataract assessment.",
    nextStep: "Arrange a cataract assessment and a full retinal check.",
  },
  {
    id: "subcapsular",
    retinalViews: { right: "central", left: "clear" },
    findings: { ageBand: "middle_aged", eyes: "one", fundalSelection: "spots" },
    lines: [
      "This patient is 52 years old.",
      "The right eye is affected; the left eye appears normal.",
      "The blur has developed gradually.",
      "The patient reports difficulty with glare and reading small print.",
      "There is no pain or redness. Distance VA is 6/36 and near VA is N18.",
    ],
    answer: "Posterior subcapsular cataract — early cataract assessment",
    distractors: [
      "Nuclear cataract",
      "Cortical cataract",
      "Normal eyes — no review needed",
    ],
    explanation:
      "A central shadow in the reflex with glare and reading difficulty suggests a posterior subcapsular cataract. The lens can blur the retinal view. Check the lens with a slit lamp and examine the retina.",
    nextStep: "Arrange an early cataract assessment.",
  },
  {
    id: "mature",
    retinalViews: { right: "obscured", left: "obscured" },
    findings: {
      fundalSelection: "white",
      backSelection: "poor view",
      distanceVA: "HM",
      nearVAValue: "",
    },
    lines: [
      "This patient is 79 years old.",
      "The patient reports that both eyes have slowly become worse over years.",
      "There is no pain or redness.",
      "They can only see hand movements with their worse eye.",
      "Both pupils look white and the back of each eye is difficult to see.",
    ],
    answer: "Probable mature cataract — prompt cataract assessment",
    distractors: [
      "Normal lens — no cataract referral",
      "Mild cortical cataract only",
      "Childhood white reflex",
    ],
    explanation:
      "A white lens and very poor vision suggest a mature cataract. The retina is hidden, so other eye disease cannot be ruled out. An eye specialist may need an ultrasound scan to check behind the lens.",
    nextStep: "Arrange prompt review by an eye specialist.",
  },
  {
    id: "detached",
    retinalViews: { right: "clear", left: "clear" },
    findings: {
      onsetValue: "sudden",
      eyes: "one",
      fundalSelection: "normal",
      backSelection: "detached",
      distanceVA: "6/60",
    },
    lines: [
      "This patient is 67 years old.",
      "Only the right eye is affected; the left eye appears normal.",
      "The patient reports a sudden change in vision today.",
      "They describe a shadow across their vision.",
      "There is no pain or redness. Their affected-eye VA is 6/60.",
    ],
    answer: "Suspected retinal detachment — same-day retinal assessment",
    distractors: [
      "Nuclear cataract — routine referral",
      "Cortical cataract",
      "Normal reflex — reassure without assessment",
    ],
    explanation:
      "Sudden loss of vision with a curtain-like shadow may be a retinal detachment. The edited right-eye image shows a raised, folded retina. A normal red reflex does not rule this out. The patient needs a retinal check today.",
    nextStep: "Arrange same-day assessment by a retinal specialist.",
  },
  {
    id: "cupping",
    retinalViews: { right: "diffuse", left: "diffuse" },
    findings: { fundalSelection: "dark", backSelection: "cupping" },
    lines: [
      "This patient is 72 years old.",
      "The patient reports a slow change in vision in both eyes.",
      "There is no pain or redness.",
      "Their worse-eye distance VA is 6/36.",
      "The examination also shows a cupped optic disc.",
    ],
    answer:
      "Possible cataract with disc cupping — assess posterior disease first",
    distractors: [
      "Nuclear cataract alone explains everything",
      "Retinal detachment",
      "Normal back of eye — no further assessment",
    ],
    explanation:
      "A cloudy lens may explain the dull reflex, but the large optic disc cup may be a sign of glaucoma. Check the eye pressure and visual fields. Do not assume the cataract explains all the vision loss.",
    nextStep: "Arrange a glaucoma assessment as well as a cataract assessment.",
  },
  {
    id: "retinal-disease",
    retinalViews: { right: "mild", left: "mild" },
    nextStep:
      "Arrange urgent review by a retinal specialist. Do not delay this for cataract treatment.",
    findings: { backSelection: "diabetic", fundalSelection: "patches" },
    lines: [
      "This patient is 70 years old.",
      "The patient reports gradually worsening blur in both eyes.",
      "They have longstanding diabetes and report no pain or redness.",
      "Their worse-eye distance VA is 6/36.",
      "The retinal examination shows new vessels at the disc and elsewhere.",
    ],
    answer:
      "Proliferative diabetic retinopathy with possible cataract — urgent retinal assessment",
    distractors: [
      "Cortical cataract alone — ignore the retina",
      "Normal retina",
      "Childhood cataract",
    ],
    explanation:
      "New blood vessels at the optic disc and elsewhere suggest proliferative diabetic retinopathy. This needs urgent treatment by a retinal specialist. A cataract does not explain these new vessels.",
  },
].map((item) => {
  const findings = { ...baseline, ...item.findings };
  return { ...item, findings, result: evaluateCataractDecision(findings) };
});

// Reuse the Fundal Reflex app's paired teaching drawings and the retinal
// reference images used by the Disc / Diabetic learning apps.
const reflexPreview = "/subapp/Fundal Reflex/assets/case-thumbnails/";
export const CATARACT_QUIZ_IMAGES = {
  fundal: {
    normal: `${reflexPreview}zero.webp`,
    dark: `${reflexPreview}bilateral-dull-reflex.webp`,
    patches: `${reflexPreview}right-big-cortical-left-small-cortical.webp`,
    spots: `${reflexPreview}bilateral-subcapsular-cataract.webp`,
    // The view overlays a white pupil on the normal drawing, so a generic
    // white reflex does not introduce a retinoblastoma-specific lesion.
    white: `${reflexPreview}zero.webp`,
  },
  back: {
    normal: "/subapp/diabetic/assets/images/diabetic/case-01_thumb.webp",
    cupping: "/subapp/Discs/assets/images/discs/case-04_thumb.webp",
    diabetic: "/subapp/diabetic/assets/images/diabetic/case-03_thumb.webp",
    detached: "/images/quiz/cataract/retinal-detachment-reference-v2.webp",
    "poor view": "/subapp/diabetic/assets/images/diabetic/case-01_thumb.webp",
  },
};

// All fundus references, including the edited detachment image, are right eyes.
export const CATARACT_QUIZ_BACK_SOURCE_EYES = {
  normal: "right",
  cupping: "right",
  diabetic: "right",
  detached: "right",
  "poor view": "right",
};

// Qualitative teaching views, chosen per case rather than inferred from reflex
// brightness. They illustrate media clarity, not measured cataract severity.
export function getCataractQuizRetinalView(item, side) {
  return item.retinalViews[side];
}

export function getCataractQuizEyeFindings(item) {
  const affected = {
    fundal: item.findings.fundalSelection,
    back: item.findings.backSelection,
  };
  return {
    right: { ...affected },
    left:
      item.findings.eyes === "one"
        ? { fundal: "normal", back: "normal" }
        : { ...affected },
  };
}
