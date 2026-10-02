export const MCQ_STORAGE_KEY = "glaucoma_mcq_progress_v1";

export const MCQ_SOURCE_REFERENCES = {
  "nice-ng81-2022": {
    title: "NICE NG81: Glaucoma diagnosis and management",
    url: "https://www.nice.org.uk/guidance/ng81/chapter/Recommendations",
    reviewed: "2026-07-26",
    status: "primary-source-reviewed",
  },
  "glaucoma-risk-model-v1": {
    title: "Glaucoma app v1 risk model and referral wording",
    url: null,
    reviewed: "2026-07-26",
    status: "pending-independent-clinical-sign-off",
  },
  "glaucoma-app-scope-v1": {
    title: "Glaucoma app v1 assessment and teaching scope",
    url: null,
    reviewed: "2026-07-26",
    status: "internal-engineering-review",
  },
};

const RAW_MCQ_LEVELS = [
  {
    name: "Primary",
    passScore: 3,
    totalQuestions: 4,
    timeSeconds: 0,
    questions: [
      {
        prompt: "Higher IOP generally pushes risk:",
        options: ["Down", "Up", "No change"],
        answerIndex: 1,
      },
      {
        prompt: "A very large cup-disc ratio is usually:",
        options: ["Lower risk", "Higher risk", "Unrelated to risk"],
        answerIndex: 1,
      },
      {
        prompt: "A small crowded disc tends to:",
        options: ["Increase concern", "Always be normal", "Hide all risk"],
        answerIndex: 0,
      },
      {
        prompt:
          "Which method does NICE recommend for measuring IOP when deciding whether to refer?",
        options: [
          "Goldmann-type applanation tonometry",
          "Non-contact air-puff tonometry alone",
          "Digital palpation through the lid",
        ],
        answerIndex: 0,
      },
      {
        prompt: "Which assessment checks for glaucomatous functional loss?",
        options: [
          "Automated perimetry",
          "Central corneal thickness",
          "Gonioscopy",
          "Visual acuity alone",
        ],
        answerIndex: 0,
      },
      {
        prompt: "A cup-disc ratio describes:",
        options: [
          "Cup size relative to disc size",
          "Pressure relative to age",
          "VA relative to field",
          "Pupil size relative to cornea",
        ],
        answerIndex: 0,
      },
      {
        prompt: "A visible rim notch is recorded as:",
        options: [
          "A suspicious structural sign",
          "A normal pressure value",
          "A visual acuity category",
          "A pupil measurement",
        ],
        answerIndex: 0,
      },
      {
        prompt: "Family history belongs in:",
        options: [
          "Risk context",
          "Visual acuity",
          "IOP measurement",
          "Disc size",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "An initially abnormal visual field may be repeated before referral when:",
        options: [
          "There is no urgent concern and confirmation is needed",
          "It already agrees with clear disc damage",
          "The pressure is definitely high",
          "Visual acuity is reduced",
        ],
        answerIndex: 0,
      },
      {
        prompt: "The safest response to uncertain findings is to:",
        options: [
          "Record the uncertainty and use clinical judgement",
          "Mark every item normal",
          "Ignore the finding",
          "Use the lowest urgency",
        ],
        answerIndex: 0,
      },
    ],
  },
  {
    name: "Intermediate",
    passScore: 3,
    totalQuestions: 5,
    timeSeconds: 110,
    questions: [
      {
        prompt: "Thin rim/notch and disc haem together should usually:",
        options: [
          "Lower urgency",
          "Increase urgency",
          "Cancel each other out",
          "Only matter if VA is normal",
        ],
        answerIndex: 1,
      },
      {
        prompt: "Suspicious fields add risk because they may reflect:",
        options: [
          "Better perfusion",
          "Functional loss",
          "Normal variation only",
          "Lens artefact only",
        ],
        answerIndex: 1,
      },
      {
        prompt:
          "Which set best matches NICE case-finding assessment before referral?",
        options: [
          "Visual fields, optic nerve assessment, GAT and anterior chamber assessment",
          "Visual acuity, colour vision and pupil size only",
          "Non-contact tonometry and symptoms only",
          "Corneal thickness and family history only",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "Risk factors (age, family history, myopia, etc.) should be used to:",
        options: [
          "Ignore pressure and optic-disc findings",
          "Refine urgency",
          "Replace optic disc findings",
          "Avoid referral decisions",
        ],
        answerIndex: 1,
      },
      {
        prompt: "If unsure of disc signs but several risk factors are present:",
        options: [
          "Assume normal",
          "Treat as lower concern",
          "Escalate caution",
          "Remove all weighting",
        ],
        answerIndex: 2,
      },
      {
        prompt: "High IOP with a suspicious rim should be interpreted as:",
        options: [
          "Combined pressure and structural concern",
          "Pressure concern only",
          "A normal combination",
          "A visual acuity result",
        ],
        answerIndex: 0,
      },
      {
        prompt: "A normal-looking field does not by itself:",
        options: [
          "Exclude structural concern",
          "Provide useful context",
          "Need recording",
          "Support comparison",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "Why is stereoscopic optic nerve head assessment useful when available?",
        options: [
          "It helps evaluate cup and rim morphology",
          "It measures corneal thickness",
          "It replaces visual-field testing",
          "It determines visual acuity",
        ],
        answerIndex: 0,
      },
      {
        prompt: "If the view is not reliable, the result should:",
        options: [
          "Remain cautious rather than reassuring",
          "Automatically become low risk",
          "Discard all context",
          "Confirm glaucoma",
        ],
        answerIndex: 0,
      },
      {
        prompt: "Myopia and family history are best understood as:",
        options: [
          "Context that modifies concern",
          "Definitive diagnoses",
          "Visual field results",
          "IOP categories",
        ],
        answerIndex: 0,
      },
      {
        prompt: "Central corneal thickness is best used as:",
        options: [
          "Risk and diagnostic context, not a referral decision on its own",
          "A stand-alone diagnosis of glaucoma",
          "A replacement for visual fields",
          "A measure of optic nerve damage",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "After an accurate GAT reading of 24 mmHg or more during case finding, NICE advises:",
        options: [
          "Referral for further investigation",
          "Discharge if visual acuity is normal",
          "Reliance on non-contact tonometry instead",
          "Ignoring pressure unless pain is present",
        ],
        answerIndex: 0,
      },
    ],
  },
  {
    name: "Advanced",
    passScore: 5,
    totalQuestions: 7,
    timeSeconds: 140,
    questions: [
      {
        prompt:
          "Which measurement should not be used alone to decide glaucoma referral?",
        options: [
          "Non-contact air-puff tonometry",
          "Goldmann-type applanation tonometry",
          "Optic nerve head assessment",
          "Central visual-field testing",
          "Peripheral anterior chamber assessment",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "In the app’s sparse-information LMIC triage model, a dark grey end-stage appearance should prompt:",
        options: [
          "No further assessment",
          "Escalation of the affected eye and assessment of the fellow eye",
          "Reassurance based on visual acuity",
          "Pressure measurement only",
          "Routine discharge",
        ],
        answerIndex: 1,
      },
      {
        prompt: "Why can a focal rim notch in a small optic disc be important?",
        options: [
          "Localised rim loss may be suspicious despite a modest cup-disc ratio",
          "Small discs cannot develop glaucoma",
          "Disc size determines IOP",
          "A notch confirms the visual field is normal",
          "Only large discs require comparison",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "Why should elevated IOP be interpreted alongside disc and field findings?",
        options: [
          "The findings provide complementary risk information",
          "IOP alone confirms glaucoma",
          "A normal field always excludes structural damage",
          "Disc size alone determines urgency",
          "The tests are interchangeable",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "A suspicious optic nerve appearance with a normal visual field should usually lead to:",
        options: [
          "Further assessment rather than dismissal",
          "Automatic discharge",
          "A diagnosis based on visual acuity",
          "Ignoring the optic nerve finding",
          "Treatment without confirmation",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "Which visual-field method does NICE include in glaucoma diagnosis?",
        options: [
          "Standard automated perimetry using a central thresholding test",
          "Confrontation alone in every case",
          "Amsler testing",
          "Colour vision plates",
          "Visual acuity alone",
        ],
        answerIndex: 0,
      },
      {
        prompt: "Which statement best separates triage support from diagnosis?",
        options: [
          "The estimate supports referral reasoning but does not diagnose glaucoma",
          "The estimate confirms glaucoma without examination",
          "The estimate selects treatment",
          "The estimate replaces specialist review",
          "The estimate makes uncertainty irrelevant",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "If the first visual field is unreliable and there is no urgent concern, the next step is usually to:",
        options: [
          "Repeat the field to seek a reliable result",
          "Record it as normal",
          "Replace it with visual acuity",
          "Ignore any disc abnormality",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "Can glaucoma-related optic nerve damage occur when IOP is not raised?",
        options: [
          "Yes, pressure must be interpreted with structural and functional findings",
          "No, raised IOP is always required",
          "Only when visual acuity is poor",
          "Only in a large optic disc",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "Why should the fellow eye still be assessed when one eye is high risk?",
        options: [
          "Bilateral comparison may alter interpretation and planning",
          "The high-risk eye becomes normal",
          "Only the fellow eye determines IOP",
          "It removes the need for referral",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "A strong family history with borderline structural findings should:",
        options: [
          "Increase caution without becoming a diagnosis by itself",
          "Confirm glaucoma automatically",
          "Be ignored",
          "Replace pressure measurement",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "What supports future comparison of optic nerve appearance after diagnosis?",
        options: [
          "A baseline optic nerve head image",
          "A colour vision score alone",
          "A single visual acuity result",
          "A symptom checklist without examination",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "Which examination is used to assess the anterior chamber angle at glaucoma diagnosis?",
        options: [
          "Gonioscopy",
          "Colour vision testing",
          "Retinoscopy",
          "Amsler testing",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "How often does NICE recommend measuring central corneal thickness?",
        options: [
          "At diagnosis, with repeat measurement only when clinically indicated",
          "At every pressure check",
          "Only after visual-field loss",
          "Never if gonioscopy is available",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "When uncertainty and red flags coexist, the safer principle is:",
        options: [
          "The higher concern should dominate",
          "Uncertainty should always downgrade",
          "Use the first field only",
          "Ignore red flags",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "Which group of tests forms an appropriate glaucoma diagnostic baseline?",
        options: [
          "GAT, gonioscopy, CCT, visual fields and optic nerve assessment",
          "Visual acuity and colour vision only",
          "Non-contact tonometry alone",
          "Symptoms and family history without examination",
        ],
        answerIndex: 0,
      },
    ],
  },
];

const TOPIC_METADATA = {
  iop: {
    explanation:
      "Goldmann-type applanation IOP is one part of glaucoma case-finding. Higher pressure increases concern but must be interpreted with the rest of the assessment.",
    source: "nice-ng81-2022",
  },
  disc: {
    explanation:
      "Optic nerve head assessment looks for suspicious structural damage. Cup-disc ratio is contextual and does not establish risk safely on its own.",
    source: "nice-ng81-2022",
  },
  "disc-size": {
    explanation:
      "Disc size changes how cupping is interpreted in this app model. The weighting is app-specific and remains pending independent clinical sign-off.",
    source: "glaucoma-risk-model-v1",
  },
  scope: {
    explanation:
      "A transparent triage estimate based on recorded findings does not make a definitive diagnosis or replace specialist assessment.",
    source: "glaucoma-app-scope-v1",
  },
  "iop-measurement": {
    explanation:
      "NICE recommends Goldmann-type applanation tonometry for IOP measurement in glaucoma case finding and advises against basing referral decisions on non-contact tonometry alone.",
    source: "nice-ng81-2022",
  },
  "functional-testing": {
    explanation:
      "Central visual-field testing with standard automated perimetry assesses functional loss that may support referral or diagnosis.",
    source: "nice-ng81-2022",
  },
  "disc-examination": {
    explanation:
      "Stereoscopic optic nerve head assessment, through a dilated pupil when clinically appropriate, supports evaluation of cup and rim morphology.",
    source: "nice-ng81-2022",
  },
  "field-method": {
    explanation:
      "NICE includes standard automated perimetry using a central thresholding test in glaucoma diagnostic assessment.",
    source: "nice-ng81-2022",
  },
  "baseline-imaging": {
    explanation:
      "NICE recommends an optic nerve head image at diagnosis to provide a baseline for future comparison.",
    source: "nice-ng81-2022",
  },
  "repeat-confirmation": {
    explanation:
      "When there is no urgent concern, NICE allows repeat IOP or visual-field measurements on another occasion to confirm an abnormal finding.",
    source: "nice-ng81-2022",
  },
  "case-finding-set": {
    explanation:
      "NICE case finding combines visual fields, optic nerve assessment, Goldmann-type applanation tonometry and peripheral anterior chamber assessment.",
    source: "nice-ng81-2022",
  },
  cct: {
    explanation:
      "Central corneal thickness contributes to risk assessment and diagnostic context but should not determine referral on its own. NICE recommends measuring it at diagnosis and repeating only when clinically indicated.",
    source: "nice-ng81-2022",
  },
  "referral-iop": {
    explanation:
      "NICE recommends referral for further investigation when IOP is 24 mmHg or more using Goldmann-type applanation tonometry, while local pathways determine operational handling.",
    source: "nice-ng81-2022",
  },
  "disc-interpretation": {
    explanation:
      "Optic disc size affects the meaning of a cup-disc ratio. Focal rim loss may still be suspicious in a small disc and requires clinical interpretation.",
    source: "nice-ng81-2022",
  },
  "structural-functional": {
    explanation:
      "Structural optic nerve damage and functional visual-field loss may not appear at the same time. A suspicious finding should be assessed rather than cancelled by a normal companion test.",
    source: "nice-ng81-2022",
  },
  "normal-tension": {
    explanation:
      "Glaucoma-related optic nerve damage may occur without raised IOP, so pressure must be interpreted alongside optic nerve and visual-field findings.",
    source: "nice-ng81-2022",
  },
  gonioscopy: {
    explanation:
      "Gonioscopy is part of the diagnostic assessment because it evaluates the anterior chamber angle and helps distinguish glaucoma mechanisms.",
    source: "nice-ng81-2022",
  },
  "diagnostic-baseline": {
    explanation:
      "NICE diagnostic assessment includes Goldmann-type applanation tonometry, gonioscopy, central corneal thickness, visual fields and optic nerve assessment with imaging where available.",
    source: "nice-ng81-2022",
  },
  "risk-context": {
    explanation:
      "Age, family history and myopia add context to structural, pressure and field findings but do not diagnose glaucoma by themselves.",
    source: "glaucoma-risk-model-v1",
  },
  unassessed: {
    explanation:
      "Before findings are recorded, the safe state is not assessed rather than normal or low risk.",
    source: "glaucoma-app-scope-v1",
  },
  uncertainty: {
    explanation:
      "Unreliable or uncertain findings should be documented and repeated or escalated as clinically appropriate, not converted into reassurance.",
    source: "nice-ng81-2022",
  },
  "combined-risk": {
    explanation:
      "Pressure, optic nerve structure and visual field provide complementary information. Several concerning findings should not cancel one another out.",
    source: "nice-ng81-2022",
  },
  field: {
    explanation:
      "A glaucomatous visual field defect is functional evidence that can warrant referral even when another recorded feature appears less concerning.",
    source: "nice-ng81-2022",
  },
  triage: {
    explanation:
      "The app combines entered findings into a triage estimate. Its thresholds and timescales remain app-specific and need independent clinical sign-off.",
    source: "glaucoma-risk-model-v1",
  },
  severe: {
    explanation:
      "In this app’s sparse-information LMIC triage model, a dark grey end-stage appearance prompts escalation of the affected eye and assessment of the fellow eye. This app-specific action remains pending independent clinical sign-off.",
    source: "glaucoma-risk-model-v1",
  },
  bilateral: {
    explanation:
      "Assessing both eyes supports comparison, identifies asymmetric disease and informs the overall clinical plan.",
    source: "nice-ng81-2022",
  },
  boundaries: {
    explanation:
      "Inclusive category boundaries make the app model predictable at threshold values. They are engineering contracts, not universal clinical cut-offs.",
    source: "glaucoma-risk-model-v1",
  },
  "data-integrity": {
    explanation:
      "The triage reasoning must correspond to the recorded findings. A mismatch is a reason to stop and recheck the assessment before use.",
    source: "glaucoma-app-scope-v1",
  },
};

const TOPICS_BY_LEVEL = [
  [
    "iop",
    "disc",
    "disc-size",
    "iop-measurement",
    "functional-testing",
    "disc",
    "disc",
    "risk-context",
    "repeat-confirmation",
    "uncertainty",
  ],
  [
    "combined-risk",
    "field",
    "case-finding-set",
    "risk-context",
    "uncertainty",
    "combined-risk",
    "field",
    "disc-examination",
    "uncertainty",
    "risk-context",
    "cct",
    "referral-iop",
  ],
  [
    "iop-measurement",
    "severe",
    "disc-interpretation",
    "combined-risk",
    "structural-functional",
    "field-method",
    "scope",
    "repeat-confirmation",
    "normal-tension",
    "bilateral",
    "risk-context",
    "baseline-imaging",
    "gonioscopy",
    "cct",
    "uncertainty",
    "diagnostic-baseline",
  ],
];

export const MCQ_LEVELS = RAW_MCQ_LEVELS.map((level, levelIndex) => ({
  ...level,
  questions: level.questions.map((question, questionIndex) => {
    const topic = TOPICS_BY_LEVEL[levelIndex][questionIndex];
    const metadata = TOPIC_METADATA[topic];
    return {
      id: `glaucoma-${level.name.toLowerCase()}-${String(questionIndex + 1).padStart(2, "0")}`,
      ...question,
      topic,
      ...metadata,
      reviewStatus: MCQ_SOURCE_REFERENCES[metadata.source].status,
    };
  }),
}));
