export const MCQ_LEVEL_META = {
  primary: {
    title: "Primary",
    passMark: 3,
    questionCount: 5,
    targetBankSize: 16,
  },
  intermediate: {
    title: "Intermediate",
    passMark: 4,
    questionCount: 6,
    targetBankSize: 26,
  },
  advanced: {
    title: "Advanced",
    passMark: 6,
    questionCount: 8,
    targetBankSize: 26,
  },
};

export const MCQ_SOURCE_REFERENCES = {
  "nhs-des-grading-2025": {
    title: "NHS Diabetic Eye Screening Programme grading definitions",
    url: "https://www.gov.uk/government/publications/diabetic-eye-screening-retinal-image-grading-criteria/nhs-diabetic-eye-screening-programme-grading-definitions-for-referable-disease-start-date-october-01",
    reviewed: "2026-07-26",
  },
  "diabetic-app-scope-v1": {
    title: "Diabetic app v1 scope and recording workflow",
    url: null,
    reviewed: "2026-07-26",
  },
  "diabetic-app-triage-v1": {
    title: "Diabetic app v1 LMIC-oriented triage rules",
    url: null,
    reviewed: "2026-07-26",
    status: "Pending independent clinical sign-off",
  },
};

const RAW_MCQ_BANKS = {
  primary: [
    {
      question: "What does an ungradable view mean?",
      options: [
        "Normal retina",
        "Cannot assess safely",
        "No screening needed",
        "Only BP review",
      ],
      answer: 1,
      topic: "view-quality",
    },
    {
      question:
        "What is the safest wording after a partial clear view with no lesions seen?",
      options: [
        "Normal",
        "No referable signs seen in the view obtained",
        "No DR ever",
        "Discharge forever",
      ],
      answer: 1,
      topic: "safety-copy",
    },
    {
      question:
        "Which finding is the earliest visible sign of diabetic retinopathy?",
      options: [
        "Microaneurysms",
        "New vessels at the disc",
        "Vitreous haemorrhage",
        "Preretinal haemorrhage",
      ],
      answer: 0,
      topic: "npdr",
    },
    {
      question: "Which finding is a red flag?",
      options: ["CWS", "Dot/blot haemorrhage", "NVE", "Microaneurysm"],
      answer: 2,
      topic: "pdr",
    },
    {
      question: "What should Holo (BIO) prompt before recording the view?",
      options: [
        "Local dilation check",
        "Anti-VEGF choice",
        "Laser choice",
        "Spectacle prescription",
      ],
      answer: 0,
      topic: "dilation",
    },
    {
      question: "Which action fits possible vitreous haemorrhage?",
      options: [
        "Routine screening only",
        "Urgent today",
        "Ignore if VA is good",
        "Medical review only",
      ],
      answer: 1,
      topic: "urgent",
    },
    {
      question: "What does Distance VA 6/36 suggest when DR signs are present?",
      options: [
        "Possible macula risk",
        "No concern",
        "Confirmed DMO",
        "Confirmed proliferative DR",
      ],
      answer: 0,
      topic: "va",
    },
    {
      question: "Which measure reflects longer-term glycaemic control?",
      options: [
        "HbA1c",
        "A single random glucose",
        "Blood pressure",
        "Serum cholesterol",
      ],
      answer: 0,
      topic: "systemic",
    },
    {
      question: "What should the app record for eyes?",
      options: [
        "Right and left eyes",
        "Only the better eye",
        "Only the first eye seen",
        "No eye label",
      ],
      answer: 0,
      topic: "both-eyes",
    },
    {
      question: "Which option belongs to Arclight (DO) area seen?",
      options: [
        "Limited glimpses only",
        "Four-quadrant sweep",
        "OCT cube",
        "Fluorescein frame",
      ],
      answer: 0,
      topic: "mode",
    },
    {
      question: "Which option belongs to Holo (BIO)?",
      options: [
        "Four-quadrant sweep",
        "Spectacle axis",
        "Near add",
        "K reading",
      ],
      answer: 0,
      topic: "mode",
    },
    {
      question: "What does no referable signs mean?",
      options: [
        "No referable signs seen in the view obtained",
        "No diabetes",
        "Full normal retina",
        "Discharge from screening",
      ],
      answer: 0,
      topic: "safety-copy",
    },
    {
      question: "What is the app mainly for?",
      options: [
        "DR triage and teaching",
        "OCT diagnosis",
        "Treatment selection",
        "AI grading",
      ],
      answer: 0,
      topic: "scope",
    },
    {
      question: "Which is a macula-risk clue?",
      options: [
        "Hard exudates near macula",
        "Normal disc colour",
        "No diabetes history",
        "Clear lens",
      ],
      answer: 0,
      topic: "macula",
    },
    {
      question:
        "If both eyes are adequate with no referable signs, what remains required?",
      options: [
        "Routine diabetic screening",
        "No future screening",
        "Laser today",
        "Ignore diabetes",
      ],
      answer: 0,
      topic: "safety-copy",
    },
    {
      question: "Which sign suggests proliferative DR?",
      options: [
        "New vessels",
        "Microaneurysms",
        "Cotton-wool spots",
        "Hard exudates",
      ],
      answer: 0,
      topic: "pdr",
    },
  ],
  intermediate: [
    {
      question:
        "A few microaneurysms and dot/blot haemorrhages are seen, without macular or proliferative signs. Which app action applies?",
      options: [
        "Routine (weeks)",
        "Urgent today",
        "No screening required",
        "Choose laser",
      ],
      answer: 0,
      topic: "npdr",
    },
    {
      question:
        "Hard exudates near macula with 6/36 VA should usually trigger:",
      options: [
        "Soon (days)",
        "Routine screening only",
        "No action",
        "Confirmed DMO treatment",
      ],
      answer: 0,
      topic: "macula",
    },
    {
      question:
        "Which VA value is a documented reduced-VA trigger when DR context is present?",
      options: ["6/36", "6/6", "Blank", "Fix/follow"],
      answer: 0,
      topic: "va",
    },
    {
      question: "Which VA value is mild and should not escalate by itself?",
      options: ["6/12", "6/60", "HM", "No fix"],
      answer: 0,
      topic: "va",
    },
    {
      question: "One eye is clear, the other ungradable. Best output?",
      options: [
        "Ungradable or limited, not reassuring",
        "Routine screening only",
        "Normal",
        "Urgent laser",
      ],
      answer: 0,
      topic: "view-quality",
    },
    {
      question: "NVE in one eye and ungradable fellow eye should trigger:",
      options: [
        "Urgent today",
        "Ungradable only",
        "Routine screening",
        "No referral",
      ],
      answer: 0,
      topic: "priority",
    },
    {
      question:
        "What should ungradable fellow-eye information become when proliferative signs are seen in the other eye?",
      options: [
        "Limitation note",
        "Main action overriding proliferative signs",
        "Deleted",
        "Treatment choice",
      ],
      answer: 0,
      topic: "priority",
    },
    {
      question:
        "Which finding is macula risk rather than proliferative disease?",
      options: [
        "Hard exudates near macula",
        "NVD",
        "NVE",
        "Vitreous haemorrhage",
      ],
      answer: 0,
      topic: "macula",
    },
    {
      question: "Which finding is proliferative?",
      options: [
        "New vessels at disc",
        "Cotton-wool spots",
        "Microaneurysms",
        "Hard exudates",
      ],
      answer: 0,
      topic: "pdr",
    },
    {
      question: "A brief Arclight (DO) glimpse should usually be recorded as:",
      options: [
        "Limited unless disc and macula are clearly seen",
        "Full four-quadrant view",
        "Confirmed normal retina",
        "Confirmed no maculopathy",
      ],
      answer: 0,
      topic: "mode",
    },
    {
      question: "BP, lipids and HbA1c tick-boxes should:",
      options: [
        "Support medical review without changing retinal urgency",
        "Always make urgent",
        "Replace eye findings",
        "Confirm DMO",
      ],
      answer: 0,
      topic: "systemic",
    },
    {
      question: "If a cotton-wool spot is seen, what is the safest next step?",
      options: [
        "Record it and look carefully for other DR features",
        "Call no referable signs",
        "Ignore it",
        "Record a normal retina",
      ],
      answer: 0,
      topic: "npdr",
    },
    {
      question: "If lesions are visible, no referable signs is unsafe because:",
      options: [
        "A finding has been seen",
        "VA is always normal",
        "Dilation is impossible",
        "Macula is always clear",
      ],
      answer: 0,
      topic: "safety-copy",
    },
    {
      question:
        "What is a safe Action-panel phrase after no lesions in partial view?",
      options: [
        "No referable signs seen in the view obtained",
        "Normal retina",
        "No DR in either eye",
        "Discharge",
      ],
      answer: 0,
      topic: "safety-copy",
    },
    {
      question: "What should the referral note include?",
      options: [
        "Right and left eye sections",
        "Only one combined eye",
        "Treatment dose",
        "Laser plan",
      ],
      answer: 0,
      topic: "referral-note",
    },
    {
      question: "Reduced VA with hard exudates near the macula suggests:",
      options: [
        "Macula risk needing soon referral",
        "Confirmed PDR",
        "No retinal concern",
        "Systemic review only",
      ],
      answer: 0,
      topic: "macula",
    },
    {
      question: "Which sign belongs in proliferative signs?",
      options: ["NVE", "CWS", "Microaneurysm", "Hard exudate"],
      answer: 0,
      topic: "pdr",
    },
    {
      question: "Which wording is safest for suspected maculopathy?",
      options: [
        "Possible maculopathy or macula risk",
        "Confirmed DMO",
        "No DR",
        "Laser required",
      ],
      answer: 0,
      topic: "macula",
    },
    {
      question:
        "In this app, what action applies to DR signs without macular or proliferative features?",
      options: [
        "Routine (weeks)",
        "Urgent today",
        "No follow-up ever",
        "Anti-VEGF decision",
      ],
      answer: 0,
      topic: "npdr",
    },
    {
      question: "What should suspected foveal involvement trigger?",
      options: ["Soon (days)", "Routine only", "Ignore", "Confirmed DMO"],
      answer: 0,
      topic: "macula",
    },
    {
      question: "What does No test VA mean?",
      options: [
        "A limitation",
        "Perfect vision",
        "Confirmed proliferative DR",
        "No referral possible",
      ],
      answer: 0,
      topic: "va",
    },
    {
      question:
        "Which viewing method usually needs dilation for wider assessment?",
      options: ["Holo (BIO)", "Referral note", "VA line", "Systemic checks"],
      answer: 0,
      topic: "dilation",
    },
    {
      question:
        "The teaching viewer is dilated but the patient was not. What should the examination record say?",
      options: [
        "Dilated: No",
        "Dilated: Yes",
        "Leave both eye findings blank",
        "Change the recorded VA",
      ],
      answer: 0,
      topic: "dilation",
    },
    {
      question: "What wins in mixed-risk findings?",
      options: [
        "Highest-risk sign",
        "First ticked sign",
        "Lowest-risk sign",
        "Drawer order",
      ],
      answer: 0,
      topic: "priority",
    },
    {
      question: "What should the app avoid?",
      options: [
        "Treatment selection",
        "Referral note",
        "Both-eye recording",
        "VA recording",
      ],
      answer: 0,
      topic: "scope",
    },
    {
      question: "Which DR sign makes a routine case more concerning?",
      options: [
        "Venous beading",
        "Normal disc colour",
        "Clear lens",
        "Equal pupils",
      ],
      answer: 0,
      topic: "npdr",
    },
  ],
  advanced: [
    {
      question: "Right eye NVD, left eye ungradable. Overall action?",
      options: [
        "Urgent today, with left-eye limitation note",
        "Ungradable only",
        "Routine referral",
        "Routine screening",
      ],
      answer: 0,
      topic: "priority",
    },
    {
      question:
        "Right eye clear adequate, left eye ungradable. Overall action?",
      options: [
        "Ungradable or limited view",
        "Routine screening still required only",
        "Urgent today",
        "No note needed",
      ],
      answer: 0,
      topic: "priority",
    },
    {
      question:
        "Both views are adequate with no signs selected but one VA is blank. What is appropriate?",
      options: [
        "Complete the missing VA before routine screening output",
        "Assume the missing VA is 6/6",
        "Diagnose macular oedema",
        "Treat the clear view as a VA test",
      ],
      answer: 0,
      topic: "routine",
      explanation:
        "A clear retinal view does not measure vision. Complete the missing VA before issuing a reassuring routine result.",
    },
    {
      question:
        "A patient reports sudden visual loss but the limited view shows no DR. How should this tool be used?",
      options: [
        "Assess the acute complaint separately; this screening tool cannot clear it",
        "Use the no-signs result to exclude urgent disease",
        "Assume cataract without further assessment",
        "Wait for the next screening visit",
      ],
      answer: 0,
      topic: "scope",
    },
    {
      question: "6/36 VA plus dot/blot haemorrhages should support:",
      options: [
        "Soon (days)",
        "No action",
        "Confirmed proliferative DR",
        "Treatment choice",
      ],
      answer: 0,
      topic: "va",
    },
    {
      question:
        "A patient fixes and follows but cannot complete a chart test. Which interpretation is justified?",
      options: [
        "Record the observation without assigning a Snellen equivalent",
        "Record 6/6",
        "Exclude macular disease",
        "Omit the retinal examination",
      ],
      answer: 0,
      topic: "va",
    },
    {
      question: "No fix with DR signs should be treated as:",
      options: [
        "Reduced VA supporting Soon (days)",
        "Normal VA",
        "Confirmed proliferative DR",
        "No test needed",
      ],
      answer: 0,
      topic: "va",
    },
    {
      question: "No test VA with DR signs should:",
      options: [
        "Prevent reassuring wording and support Soon (days)",
        "Confirm normal vision",
        "Delete DR signs",
        "Choose laser",
      ],
      answer: 0,
      topic: "va",
    },
    {
      question:
        "Which finding should never be downgraded by ungradable fellow-eye view?",
      options: ["NVE", "Microaneurysm only", "No signs", "Blank VA"],
      answer: 0,
      topic: "priority",
    },
    {
      question: "Which combination is macula risk?",
      options: [
        "Hard exudates near macula plus reduced VA",
        "Clear view plus 6/6",
        "No signs plus blank VA",
        "BP checked only",
      ],
      answer: 0,
      topic: "macula",
    },
    {
      question: "Why avoid confirmed DMO wording?",
      options: [
        "OCT or stereo assessment is needed",
        "VA is never relevant",
        "DR cannot affect macula",
        "Referral notes cannot mention macula",
      ],
      answer: 0,
      topic: "macula",
    },
    {
      question:
        "Fine abnormal vessels cross the disc surface despite good VA. What drives the next step?",
      options: [
        "Suspected NVD warrants urgent assessment despite good VA",
        "Good VA excludes proliferative disease",
        "Wait until central vision falls",
        "Record no signs if the macula looks clear",
      ],
      answer: 0,
      topic: "pdr",
    },
    {
      question:
        "If one eye has no signs and the fellow eye has NVE, overall action is:",
      options: [
        "Urgent today",
        "Routine screening only",
        "No referral",
        "Medical review only",
      ],
      answer: 0,
      topic: "priority",
    },
    {
      question:
        "Arclight (DO) cannot see the far periphery well. The key limitation is:",
      options: [
        "Peripheral disease may be missed",
        "Macula is always invisible",
        "VA cannot be recorded",
        "Dilation is irrelevant",
      ],
      answer: 0,
      topic: "mode",
    },
    {
      question:
        "NVD is visible through a hazy view in the same eye. What should the referral include?",
      options: [
        "Urgent findings and the limited view",
        "Only the NVD because urgency removes limitations",
        "Only the haze until the view improves",
        "A normal peripheral examination",
      ],
      answer: 0,
      topic: "referral-note",
    },
    {
      question: "Which systemic action is sensible in LMIC settings?",
      options: [
        "Arrange diabetes/medical review when possible",
        "Ignore BP",
        "Let HbA1c change retinal urgency",
        "Use lipids as proliferative sign",
      ],
      answer: 0,
      topic: "systemic",
    },
    {
      question:
        "Which output should be avoided for limited Arclight (DO) view?",
      options: [
        "Normal retina",
        "Limitation note",
        "Routine screening reminder",
        "Referral note",
      ],
      answer: 0,
      topic: "safety-copy",
    },
    {
      question:
        "Which finding is enough for same-day referral even if VA is not recorded?",
      options: ["NVD", "Microaneurysm only", "Mild hard exudate", "No signs"],
      answer: 0,
      topic: "urgent",
    },
    {
      question:
        "Suspected vitreous blood obscures the fundus and the patient cannot perform VA testing. Which response is safest?",
      options: [
        "Retain urgent referral and record both assessment limitations",
        "Wait for measurable VA before referring",
        "Treat the obscured fundus as no DR",
        "Use the fellow-eye VA for this eye",
      ],
      answer: 0,
      topic: "urgent",
    },
    {
      question: "What should an urgent proliferative output emphasise?",
      options: [
        "Same-day eye referral",
        "Routine annual screening only",
        "Spectacle prescription",
        "No follow-up",
      ],
      answer: 0,
      topic: "urgent",
    },
    {
      question: "When R/L findings conflict, triage should use:",
      options: [
        "The highest-risk eye finding",
        "The better eye only",
        "The first completed field",
        "VA alone",
      ],
      answer: 0,
      topic: "priority",
    },
    {
      question:
        "Venous beading is recorded without its extent. What can this app conclude?",
      options: [
        "DR is present but full severity cannot be graded",
        "Severe NPDR is excluded",
        "PDR is confirmed",
        "Macular oedema is confirmed",
      ],
      answer: 0,
      topic: "npdr",
    },
    {
      question: "Venous beading is seen. What is the safest interpretation?",
      options: [
        "Record it and assess extent plus other ischaemic signs",
        "Call it proliferative disease by itself",
        "Treat it as a normal vessel",
        "Confirm diabetic macular oedema",
      ],
      answer: 0,
      topic: "npdr",
    },
    {
      question: "Which statement about Holo (BIO) is safest?",
      options: [
        "It can record four-quadrant sweep but only reports selected findings",
        "It confirms no DR if clear",
        "It replaces screening forever",
        "It chooses treatment",
      ],
      answer: 0,
      topic: "mode",
    },
    {
      question: "Which statement about Arclight (DO) is safest?",
      options: [
        "It should not imply a complete peripheral assessment",
        "It always sees four quadrants",
        "It confirms no maculopathy",
        "It replaces referral",
      ],
      answer: 0,
      topic: "mode",
    },
    {
      question:
        "Ungradable view with suspected vitreous blood should be treated as:",
      options: [
        "Urgent today",
        "Routine screening only",
        "No DR",
        "Confirmed DMO",
      ],
      answer: 0,
      topic: "urgent",
    },
  ],
};

const TOPIC_METADATA = {
  "view-quality": {
    explanation:
      "An inadequate view cannot exclude retinal disease. Record the limitation rather than describing the retina as normal.",
    source: "diabetic-app-scope-v1",
  },
  "safety-copy": {
    explanation:
      "Use wording that describes only what was actually seen and does not turn a limited view into reassurance.",
    source: "diabetic-app-scope-v1",
  },
  npdr: {
    explanation:
      "Microaneurysms and retinal haemorrhages are non-proliferative signs. Venous beading or IRMA can indicate more severe pre-proliferative disease and require fuller assessment.",
    source: "nhs-des-grading-2025",
  },
  pdr: {
    explanation:
      "New vessels, pre-retinal haemorrhage and vitreous haemorrhage are proliferative or potentially sight-threatening findings.",
    source: "nhs-des-grading-2025",
  },
  dilation: {
    explanation:
      "A wider retinal examination commonly needs dilation, but local contraindications and the reason for non-dilation must be recorded.",
    source: "diabetic-app-scope-v1",
  },
  urgent: {
    explanation:
      "The app uses its urgent action for active proliferative signs or suspected vitreous blood. The local referral pathway still requires clinical approval.",
    source: "diabetic-app-triage-v1",
  },
  va: {
    explanation:
      "Reduced or unmeasured visual acuity adds concern in the presence of retinal findings but does not diagnose macular oedema by itself.",
    source: "diabetic-app-triage-v1",
  },
  systemic: {
    explanation:
      "Blood pressure, glycaemic control and lipids support wider diabetes care but do not replace the retinal finding that determines eye urgency.",
    source: "diabetic-app-triage-v1",
  },
  "both-eyes": {
    explanation:
      "Record each eye separately because disease severity, image quality and referral drivers can differ between eyes.",
    source: "diabetic-app-scope-v1",
  },
  mode: {
    explanation:
      "The viewing method describes the examination obtained. It must not imply that unseen peripheral retina was assessed.",
    source: "diabetic-app-scope-v1",
  },
  scope: {
    explanation:
      "This app supports recording, triage prompts and teaching. It does not make a diagnosis or select treatment.",
    source: "diabetic-app-scope-v1",
  },
  macula: {
    explanation:
      "Hard exudates near the macula with reduced vision can support concern for maculopathy, but confirmation needs an appropriate macular assessment.",
    source: "nhs-des-grading-2025",
  },
  priority: {
    explanation:
      "The highest-risk recorded eye finding drives the overall action. A poor view in the fellow eye remains an important limitation.",
    source: "diabetic-app-triage-v1",
  },
  "referral-note": {
    explanation:
      "A useful referral note records each eye, visual acuity, view quality, dilation status, findings and the action driver.",
    source: "diabetic-app-scope-v1",
  },
  routine: {
    explanation:
      "No referable signs in an adequate recorded view does not end future diabetic eye screening.",
    source: "diabetic-app-triage-v1",
  },
};

export const MCQ_BANKS = Object.fromEntries(
  Object.entries(RAW_MCQ_BANKS).map(([level, questions]) => [
    level,
    questions.map((question, index) => ({
      id: `diabetic-${level}-${String(index + 1).padStart(2, "0")}`,
      ...TOPIC_METADATA[question.topic],
      ...question,
    })),
  ]),
);
