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
      question: "An eye has MA and dot/blot haemorrhages only. Best action?",
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
      question: "If CWS is seen, the safer finding is:",
      options: [
        "Record CWS as a DR sign",
        "Call no referable signs",
        "Ignore the lesion",
        "Record normal retina",
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
        "What should routine DR signs without macula or proliferative signs use?",
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
        "Soon (days)",
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
      question: "Why is no referable signs unsafe when NVD is present?",
      options: [
        "NVD is urgent proliferative disease",
        "NVD is a normal vessel",
        "NVD means routine review only",
        "NVD confirms DMO",
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
      question:
        "Which finding is enough for same-day referral even if VA is not recorded?",
      options: ["NVD", "Microaneurysm only", "Mild hard exudate", "No signs"],
      answer: 0,
      topic: "urgent",
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
      question: "Which finding group contains venous beading?",
      options: ["DR signs", "Proliferative signs", "Macula-only", "Systemic"],
      answer: 0,
      topic: "npdr",
    },
    {
      question:
        "Which category should CWS plus venous beading enter if no macula or proliferative signs?",
      options: [
        "Routine (weeks) or Soon (days) if concerning",
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
