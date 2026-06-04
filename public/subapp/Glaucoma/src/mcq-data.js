export const MCQ_STORAGE_KEY = "glaucoma_mcq_progress_v1";

export const MCQ_LEVELS = [
  {
    name: "Primary",
    passScore: 2,
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
        prompt: "Best use of this tool is:",
        options: [
          "Triage support",
          "Final diagnosis alone",
          "Replace specialist review",
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
        prompt: "When C/D is high and IOP is 25-29, the grid trend is usually:",
        options: [
          "Toward green",
          "Toward orange/red",
          "Always white",
          "Unchanged by C/D",
        ],
        answerIndex: 1,
      },
      {
        prompt:
          "Risk factors (age, family history, myopia, etc.) should be used to:",
        options: [
          "Ignore grid result",
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
    ],
  },
  {
    name: "Advanced",
    passScore: 5,
    totalQuestions: 7,
    timeSeconds: 80,
    questions: [
      {
        prompt: "Which combination is most concerning for urgent pathway?",
        options: [
          "Low C/D + <=20 + no signs",
          "High C/D + >=30 + suspicious signs",
          "Mid C/D + <=20 + no risk factors",
          "Low C/D + 20-24 + good VA",
          "Large disc + no findings",
        ],
        answerIndex: 1,
      },
      {
        prompt: "Best interpretation of a dark grey (end-stage) zone is:",
        options: [
          "No follow-up needed",
          "Likely severe damage; assess fellow eye and escalate",
          "Safer than green",
          "Equivalent to white",
          "Normal with age",
        ],
        answerIndex: 1,
      },
      {
        prompt: "In this calculator, disc size modifies risk by:",
        options: [
          "Small tends to increase and large tends to reduce",
          "Always reducing risk",
          "Always increasing risk",
          "No effect",
          "Only changing VA weighting",
        ],
        answerIndex: 0,
      },
      {
        prompt: "Why keep the reasoning line visible?",
        options: [
          "For cosmetic reasons only",
          "To hide uncertainty",
          "To show weighted contributors behind urgency",
          "To replace clinical judgement",
          "To avoid specialist input",
        ],
        answerIndex: 2,
      },
      {
        prompt: "If signs and grid disagree, safest approach is usually:",
        options: [
          "Pick lower urgency",
          "Ignore structural signs",
          "Use clinical caution and escalate when suspicious",
          "Delete risk factors",
          "Retest in 5 years",
        ],
        answerIndex: 2,
      },
      {
        prompt: "Suspicious pupils plus suspicious fields should generally:",
        options: [
          "Reduce concern",
          "Increase concern",
          "Have no effect",
          "Only matter if IOP <20",
          "Only matter in large discs",
        ],
        answerIndex: 1,
      },
      {
        prompt: "Core purpose of the 3-level MCQ progression is to:",
        options: [
          "Test memory only",
          "Build from basic recognition to safer decisions",
          "Replace bedside assessment",
          "Minimise use of all referrals",
          "Ignore uncertainty",
        ],
        answerIndex: 1,
      },
    ],
  },
];
