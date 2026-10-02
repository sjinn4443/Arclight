export const MCQ_STORAGE_KEY = "cataract_mcq_progress_v1";

export const MCQ_SOURCE_REFERENCES = {
  "nhs-adult-cataract-2025": {
    label: "NHS cataracts in adults",
    url: "https://www.nhs.uk/conditions/cataracts/",
    status: "current-authoritative",
  },
  "nhs-childhood-cataract": {
    label: "NHS childhood cataracts",
    url: "https://www.nhs.uk/conditions/childhood-cataracts/",
    status: "current-authoritative",
  },
  "cataract-app-scope-v1": {
    label: "Cataract app scope and recording contract",
    url: null,
    status: "internal-engineering-contract",
  },
  "cataract-app-triage-v1": {
    label: "Cataract app triage and referral wording",
    url: null,
    status: "pending-independent-clinical-sign-off",
  },
};

const RAW_MCQ_LEVELS = [
  {
    name: "Primary",
    totalQuestions: 5,
    passScore: 4,
    timeSeconds: 90,
    questions: [
      {
        prompt: "What is the safest interpretation of a white pupil reflex?",
        options: [
          "An abnormal sign needing eye assessment",
          "Proof of mature cataract",
          "Normal ageing",
          "No action if painless",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "If fundal reflex is normal and VA is 6/6, the most likely action is:",
        options: [
          "Urgent surgery",
          "Routine surgery",
          "No cataract referral needed",
          "Immediate retinal referral",
        ],
        answerIndex: 2,
      },
      {
        prompt: "Best first step before deciding cataract referral is to:",
        options: [
          "Only inspect lens colour",
          "Check history and vision carefully",
          "Skip back-of-eye check",
          "Refer everyone with blur",
        ],
        answerIndex: 1,
      },
      {
        prompt: "Which VA indicates the poorest distance vision in this tool?",
        options: ["6/12", "6/36", "6/60", "HM"],
        answerIndex: 3,
      },
      {
        prompt: "Pain/red eye with sudden one-eye loss should trigger:",
        options: [
          "Routine cataract pathway",
          "No action",
          "Urgent investigation for other pathology",
          "Yearly review only",
        ],
        answerIndex: 2,
      },
      {
        prompt:
          "Which history is least typical of simple age-related cataract?",
        options: [
          "Gradual painless blur",
          "Glare and faded colours",
          "Sudden painful loss",
          "Slowly worsening distance vision",
        ],
        answerIndex: 2,
      },
      {
        prompt: "What does the Back of Eye section check for?",
        options: [
          "Only lens colour",
          "Other disease behind the lens",
          "Phone brightness",
          "Age band only",
        ],
        answerIndex: 1,
      },
      {
        prompt: "A normal fundal reflex usually means the pupil glow is:",
        options: [
          "Bright and clear",
          "Always white",
          "Always black",
          "Hidden by default",
        ],
        answerIndex: 0,
      },
      {
        prompt: "Which choice is a Back of Eye finding in this app?",
        options: ["Spots", "Patches", "Cupped", "Dense"],
        answerIndex: 2,
      },
      {
        prompt: "Which choice is a Fundal Reflex finding in this app?",
        options: ["Detached", "DR/Scar", "Patches", "Cupped"],
        answerIndex: 2,
      },
      {
        prompt: "Why does the app ask for Dist VA?",
        options: [
          "To judge vision severity",
          "To change the title",
          "To unlock the menu",
          "To replace all examination",
        ],
        answerIndex: 0,
      },
      {
        prompt: "If the result asks for re-checks, the safest response is to:",
        options: [
          "Ignore them",
          "Re-check the highlighted findings",
          "Clear the browser",
          "Choose the fastest referral only",
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    name: "Intermediate",
    totalQuestions: 5,
    passScore: 4,
    timeSeconds: 80,
    questions: [
      {
        prompt: "White reflex with a poor back view means:",
        options: [
          "Posterior disease cannot be excluded",
          "Dense cataract is confirmed",
          "No eye assessment is needed",
          "The retina is normal",
        ],
        answerIndex: 0,
      },
      {
        prompt: "Back-of-eye finding of detached retina should usually be:",
        options: [
          "Routine cataract surgery",
          "No referral",
          "Managed as non-cataract urgent retinal disease",
          "Observed yearly",
        ],
        answerIndex: 2,
      },
      {
        prompt: "Near VA deterioration (e.g. N18/N36) in this app:",
        options: [
          "Is ignored completely",
          "Adds context to referral wording",
          "Cancels distance VA",
          "Always means no cataract",
        ],
        answerIndex: 1,
      },
      {
        prompt: "Abnormal pupils in this workflow are treated as:",
        options: [
          "Simple cataract only",
          "Possible non-cataract pathology",
          "Always normal",
          "Not relevant to triage",
        ],
        answerIndex: 1,
      },
      {
        prompt: "Front-of-eye scar/distortion should lead to:",
        options: [
          "Guarded outcome warning",
          "Automatic discharge",
          "No change",
          "Primary care only",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "If the reflex is white and the fundus cannot be seen, the safest record is:",
        options: [
          "Poor view; posterior disease not excluded",
          "Normal back of eye",
          "Definite mature cataract only",
          "No further assessment required",
        ],
        answerIndex: 0,
      },
      {
        prompt: "A dense reflex with relatively good VA should make you:",
        options: [
          "Ignore the mismatch",
          "Re-check reflex and VA",
          "Always discharge",
          "Skip Back of Eye",
        ],
        answerIndex: 1,
      },
      {
        prompt: "Distance poor but near good usually means:",
        options: [
          "The result is automatically normal",
          "VA method or refraction should be re-checked",
          "Cataract is impossible",
          "Age band should be deleted",
        ],
        answerIndex: 1,
      },
      {
        prompt: "A normal reflex with very poor VA should prompt:",
        options: [
          "No further thought",
          "Early specialist review for another cause",
          "Routine cataract surgery only",
          "Ignore the back view",
        ],
        answerIndex: 1,
      },
      {
        prompt: "Deep cupping in Back of Eye points towards:",
        options: [
          "Glaucoma review first",
          "Mature cataract only",
          "Normal result",
          "Near-vision testing only",
        ],
        answerIndex: 0,
      },
      {
        prompt: "DR/Scar in Back of Eye means:",
        options: [
          "Retinal disease may limit cataract benefit",
          "The lens is definitely clear",
          "No referral can be needed",
          "The result must be green",
        ],
        answerIndex: 0,
      },
      {
        prompt: "A child with cataract-pattern signs should usually get:",
        options: [
          "Yearly adult review",
          "Prompt paediatric referral",
          "No action until age 18",
          "Reading glasses only",
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    name: "Advanced",
    totalQuestions: 5,
    passScore: 4,
    timeSeconds: 75,
    questions: [
      {
        prompt: "Most safety-critical trap in cataract triage is:",
        options: [
          "Over-documenting history",
          "Assuming all blur is cataract",
          "Checking pupils",
          "Using fundal images",
        ],
        answerIndex: 1,
      },
      {
        prompt:
          "If back-of-eye shows diabetic/retinal pathology, cataract surgery in this app is:",
        options: [
          "Always urgent",
          "Usually not the primary immediate pathway",
          "Guaranteed to restore vision",
          "Always first-line",
        ],
        answerIndex: 1,
      },
      {
        prompt: "Sudden + painful visual loss should bias toward:",
        options: [
          "Elective cataract list",
          "Urgent diagnostic escalation",
          "Annual follow-up only",
          "Reassure and discharge",
        ],
        answerIndex: 1,
      },
      {
        prompt: "The main role of this tool is to:",
        options: [
          "Replace specialist diagnosis",
          "Support rapid triage and safe signposting",
          "Provide final surgical booking",
          "Assess refractive error only",
        ],
        answerIndex: 1,
      },
      {
        prompt: "Best interpretation of poor Back of Eye view is:",
        options: [
          "Definitely simple cataract only",
          "Needs further assessment for alternate pathology",
          "Always normal",
          "Ignore if near VA is good",
        ],
        answerIndex: 1,
      },
      {
        prompt:
          "When two findings conflict (e.g. cataract-like reflex but retinal red flags), priority should be:",
        options: [
          "The least severe interpretation",
          "Safety-first escalation for red flags",
          "Ignore retinal signs",
          "Wait 12 months",
        ],
        answerIndex: 1,
      },
      {
        prompt: "RAPD or poor light direction should make the app consider:",
        options: [
          "Optic nerve or retinal disease first",
          "Only routine cataract",
          "No vision problem",
          "Near VA only",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "Why does the engine keep posterior override ahead of cataract type?",
        options: [
          "Posterior disease can be urgent or vision-limiting",
          "It makes the MCQ shorter",
          "It hides all cataract signs",
          "It avoids taking history",
        ],
        answerIndex: 0,
      },
      {
        prompt: "Sudden painful white reflex is handled as:",
        options: [
          "Routine cataract only",
          "Urgent same-day investigation",
          "No cataract pathway",
          "Back section hidden forever",
        ],
        answerIndex: 1,
      },
      {
        prompt: "Which wording is safest for a red-flag result?",
        options: [
          "Urgent action, brief reason and next step",
          "A long differential with no action",
          "Definite cataract diagnosis",
          "Reassurance before referral",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "If abnormal reflex and VA 6/6 appear together, the app should:",
        options: [
          "Show a re-check warning",
          "Force urgent surgery",
          "Delete the reflex choice",
          "Ignore VA",
        ],
        answerIndex: 0,
      },
      {
        prompt: "A non-cataract-first pathway should avoid:",
        options: [
          "Over-stating cataract as the definite cause",
          "Mentioning safety",
          "Checking the back of eye",
          "Using plain language",
        ],
        answerIndex: 0,
      },
    ],
  },
];

const TOPICS_BY_LEVEL = {
  Primary: [
    "white-reflex",
    "routine",
    "assessment",
    "va",
    "acute-loss",
    "acute-loss",
    "posterior-view",
    "red-reflex",
    "posterior-view",
    "reflex-pattern",
    "va",
    "recheck",
  ],
  Intermediate: [
    "white-reflex",
    "retinal-red-flag",
    "near-va",
    "pupils",
    "cornea",
    "posterior-view",
    "recheck",
    "refraction",
    "posterior-view",
    "cupping",
    "retinal-comorbidity",
    "paediatric",
  ],
  Advanced: [
    "safety-scope",
    "retinal-comorbidity",
    "acute-loss",
    "safety-scope",
    "posterior-view",
    "retinal-red-flag",
    "rapd",
    "posterior-view",
    "acute-loss",
    "urgent-wording",
    "recheck",
    "safety-scope",
  ],
};

const TOPIC_METADATA = {
  "white-reflex": {
    explanation:
      "A white reflex is abnormal but does not prove mature cataract. Record the visual context and arrange eye assessment because posterior causes must not be missed.",
    source: "cataract-app-triage-v1",
  },
  routine: {
    explanation:
      "Cataract usually causes gradual visual difficulty. A normal reflex with good acuity does not by itself justify a cataract referral, though symptoms and daily function still matter.",
    source: "nhs-adult-cataract-2025",
  },
  assessment: {
    explanation:
      "History, visual acuity, anterior findings and the available posterior view must be considered together before choosing a pathway.",
    source: "cataract-app-scope-v1",
  },
  va: {
    explanation:
      "Visual acuity records functional severity and helps expose a mismatch between the reported vision and the observed reflex.",
    source: "cataract-app-scope-v1",
  },
  "acute-loss": {
    explanation:
      "Age-related cataract is usually gradual and painless. Sudden loss, pain or redness needs assessment for another cause rather than a routine cataract assumption.",
    source: "nhs-adult-cataract-2025",
  },
  "posterior-view": {
    explanation:
      "A limited or absent posterior view is a limitation, not a normal retinal finding. Cataract and posterior disease can coexist.",
    source: "cataract-app-triage-v1",
  },
  "red-reflex": {
    explanation:
      "A bright clear red reflex is the comparison pattern in this teaching app. It must still be interpreted with visual acuity and the rest of the examination.",
    source: "cataract-app-scope-v1",
  },
  "reflex-pattern": {
    explanation:
      "Patches are an anterior reflex pattern in this app. Back-of-eye choices are recorded separately to avoid mixing lens and posterior findings.",
    source: "cataract-app-scope-v1",
  },
  recheck: {
    explanation:
      "Conflicting visual acuity and examination findings should be rechecked before a referral conclusion is recorded.",
    source: "cataract-app-scope-v1",
  },
  "retinal-red-flag": {
    explanation:
      "A retinal red flag overrides a cataract-like reflex because delay could miss urgent or vision-limiting posterior disease.",
    source: "cataract-app-triage-v1",
  },
  "near-va": {
    explanation:
      "Near acuity adds functional context but does not replace distance acuity or the eye examination.",
    source: "cataract-app-scope-v1",
  },
  pupils: {
    explanation:
      "An abnormal pupil or light response is not explained safely by simple cataract alone and should prompt assessment for another cause.",
    source: "cataract-app-triage-v1",
  },
  cornea: {
    explanation:
      "Corneal scar or distortion can limit the expected visual outcome and should be recorded alongside any cataract finding.",
    source: "cataract-app-triage-v1",
  },
  refraction: {
    explanation:
      "A mismatch between distance and near acuity can reflect test method or refractive error, so the measurements should be checked before escalation.",
    source: "cataract-app-scope-v1",
  },
  cupping: {
    explanation:
      "Marked disc cupping suggests a possible glaucoma pathway and should not be explained by cataract alone.",
    source: "cataract-app-triage-v1",
  },
  "retinal-comorbidity": {
    explanation:
      "Retinal disease can coexist with cataract, alter urgency and limit the likely visual benefit from cataract surgery.",
    source: "cataract-app-triage-v1",
  },
  paediatric: {
    explanation:
      "A cataract affecting a child can impair visual development. Prompt paediatric eye assessment is important when vision may be affected.",
    source: "nhs-childhood-cataract",
  },
  "safety-scope": {
    explanation:
      "The app supports structured triage and signposting. It does not replace specialist diagnosis or prove that cataract is the cause of visual loss.",
    source: "cataract-app-scope-v1",
  },
  rapd: {
    explanation:
      "RAPD or an abnormal light response suggests retinal or optic-nerve dysfunction and should not be attributed to routine cataract without assessment.",
    source: "cataract-app-triage-v1",
  },
  "urgent-wording": {
    explanation:
      "Urgent results should put the action first, then give a brief reason and practical next step.",
    source: "cataract-app-triage-v1",
  },
};

export const MCQ_LEVELS = RAW_MCQ_LEVELS.map((level) => ({
  ...level,
  questions: level.questions.map((question, questionIndex) => {
    const topic = TOPICS_BY_LEVEL[level.name][questionIndex];
    const metadata = TOPIC_METADATA[topic];
    return {
      ...question,
      id: `cataract-${level.name.toLowerCase()}-${String(questionIndex + 1).padStart(2, "0")}`,
      topic,
      explanation: metadata.explanation,
      source: metadata.source,
    };
  }),
}));
