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

export const MCQ_BANKS = {
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
      question: "Which finding is a DR sign?",
      options: [
        "Microaneurysms",
        "NVD",
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
      question: "Which systemic check belongs in the Action panel?",
      options: ["HbA1c", "Shoe size", "Height only", "Hair colour"],
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
      question: "What should no referable signs do when a lesion is selected?",
      options: [
        "Stay selected",
        "Clear because findings conflict",
        "Become urgent",
        "Open MCQ",
      ],
      answer: 1,
      topic: "state",
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
      question: "Where should practice live in this app?",
      options: [
        "Side drawer",
        "Main clinical tab rail",
        "Referral note only",
        "Dilation dropdown",
      ],
      answer: 0,
      topic: "practice",
    },
  ],
  intermediate: [
    {
      question: "An eye has MA and dot/blot haemorrhages only. Best action?",
      options: [
        "Routine referral when possible",
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
        "Refer soon (2 weeks)",
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
      question:
        "For Holo (BIO), four-quadrant sweep should be removed when switching to:",
      options: ["Arclight (DO)", "Practice drawer", "Referral note", "MCQ"],
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
      question:
        "If no referable signs is selected then CWS is ticked, the app should:",
      options: [
        "Clear no referable signs",
        "Clear CWS",
        "Ignore CWS",
        "Submit MCQ",
      ],
      answer: 0,
      topic: "state",
    },
    {
      question:
        "If no referable signs is selected after lesions, the app should:",
      options: [
        "Clear lesion findings for that eye",
        "Keep all lesions",
        "Mark urgent",
        "Switch mode",
      ],
      answer: 0,
      topic: "state",
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
      question: "Which app pattern should VA reuse?",
      options: [
        "Cataract compact select",
        "Large text area",
        "Slider",
        "Freehand drawing",
      ],
      answer: 0,
      topic: "ui",
    },
    {
      question: "What is the main clinical tab rail?",
      options: [
        "Arclight (DO) and Holo (BIO)",
        "Primary and Advanced",
        "Right and Left only",
        "BP and HbA1c",
      ],
      answer: 0,
      topic: "ui",
    },
    {
      question: "Where should longer teaching text live?",
      options: [
        "Popup or drawer",
        "Crowded main panel",
        "Action title",
        "VA dropdown",
      ],
      answer: 0,
      topic: "ui",
    },
    {
      question:
        "What should routine DR signs without macula or proliferative signs use?",
      options: [
        "Routine referral when possible",
        "Urgent today",
        "No follow-up ever",
        "Anti-VEGF decision",
      ],
      answer: 0,
      topic: "npdr",
    },
    {
      question: "What should suspected foveal involvement trigger?",
      options: [
        "Refer soon (2 weeks)",
        "Routine only",
        "Ignore",
        "Confirmed DMO",
      ],
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
      question: "Which mode should visibly prompt dilation before recording?",
      options: [
        "Holo (BIO)",
        "MCQ only",
        "Practice only",
        "Referral note only",
      ],
      answer: 0,
      topic: "dilation",
    },
    {
      question: "What should be stored if not dilated?",
      options: [
        "Reason if not dilated",
        "Laser type",
        "OCT thickness",
        "Lens power",
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
      question: "What should a 360 x 740 layout avoid?",
      options: [
        "Two full duplicated eye panels",
        "Compact chips",
        "A small popup",
        "Short labels",
      ],
      answer: 0,
      topic: "ui",
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
        "Both eyes clear adequate with no referable signs selected. Overall action?",
      options: [
        "Routine screening still required",
        "Ungradable",
        "Urgent today",
        "Refer soon",
      ],
      answer: 0,
      topic: "routine",
    },
    {
      question: "6/12 VA without DR findings should:",
      options: [
        "Be recorded without escalation by itself",
        "Trigger urgent today",
        "Confirm DMO",
        "Clear all findings",
      ],
      answer: 0,
      topic: "va",
    },
    {
      question: "6/36 VA plus dot/blot haemorrhages should support:",
      options: [
        "Refer soon (2 weeks)",
        "No action",
        "Confirmed proliferative DR",
        "Treatment choice",
      ],
      answer: 0,
      topic: "va",
    },
    {
      question: "Fix/follow means:",
      options: [
        "Non-standard VA, no escalation by itself",
        "Always urgent",
        "Confirmed maculopathy",
        "Ignore all findings",
      ],
      answer: 0,
      topic: "va",
    },
    {
      question: "No fix with DR signs should be treated as:",
      options: [
        "Reduced VA supporting refer soon",
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
        "Prevent reassuring wording and support refer soon",
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
        "What should happen to no referable signs when NVD is selected?",
      options: [
        "It clears for that eye",
        "It stays selected",
        "It becomes the action",
        "It hides VA",
      ],
      answer: 0,
      topic: "state",
    },
    {
      question:
        "What should happen to lesions when no referable signs is selected?",
      options: [
        "They clear for that eye",
        "They remain active",
        "They become systemic checks",
        "They move to fellow eye",
      ],
      answer: 0,
      topic: "state",
    },
    {
      question:
        "A user changes Holo (BIO) to Arclight (DO) after four-quadrant sweep. The app should:",
      options: [
        "Reset or require new valid area for that eye",
        "Keep four quadrants",
        "Delete all findings",
        "Open practice",
      ],
      answer: 0,
      topic: "mode",
    },
    {
      question: "Which data belongs in the referral note?",
      options: [
        "Whether dilation was done",
        "Anti-VEGF dose",
        "Laser settings",
        "OCT map",
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
      question: "Which should remain in the drawer?",
      options: [
        "Image practice cases",
        "Clinical equipment mode",
        "Action panel",
        "Right/Left eye switcher",
      ],
      answer: 0,
      topic: "practice",
    },
    {
      question: "What does red-flags-win mean?",
      options: [
        "Proliferative signs drive urgent today",
        "Red title changes urgency",
        "BP tick-box means urgent",
        "Practice score changes referral",
      ],
      answer: 0,
      topic: "urgent",
    },
    {
      question: "What should an urgent output suppress?",
      options: [
        "Long low-yield teaching text",
        "Reason text",
        "Eye label",
        "Referral note",
      ],
      answer: 0,
      topic: "ui",
    },
    {
      question: "Which first-screen layout rule is safest?",
      options: [
        "R/L VA and R/L view in the View panel",
        "Two large eye panels stacked",
        "Practice as main tab",
        "Long manual text before controls",
      ],
      answer: 0,
      topic: "ui",
    },
    {
      question: "Which finding group contains venous beading?",
      options: ["DR signs", "Proliferative signs", "Macula-only", "Systemic"],
      answer: 0,
      topic: "npdr",
    },
    {
      question:
        "Which category should CWS plus venous beading enter if no macula or proliferative signs?",
      options: [
        "Routine referral when possible or soon if concerning",
        "Urgent today always",
        "Routine screening only",
        "Confirmed DMO",
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
      question: "What should pure triage tests include?",
      options: [
        "Mixed-eye priority edge cases",
        "Only colour checks",
        "Only drawer clicks",
        "Only image filenames",
      ],
      answer: 0,
      topic: "testing",
    },
  ],
};
