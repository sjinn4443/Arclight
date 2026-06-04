export const MCQ_STORAGE_KEY = "cataract_mcq_progress_v1";

export const MCQ_LEVELS = [
  {
    name: "Primary",
    totalQuestions: 5,
    passScore: 4,
    timeSeconds: 90,
    questions: [
      {
        prompt:
          "Which reflex pattern most strongly suggests a mature cataract?",
        options: [
          "Normal red reflex",
          "White reflex",
          "Dark reflex only",
          "Patchy peripheral reflex",
        ],
        answerIndex: 1,
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
        prompt: "Fundal Reflex unlocks when the app has:",
        options: [
          "Age only",
          "Onset, eyes and Dist VA",
          "Near VA only",
          "Back of Eye first",
        ],
        answerIndex: 1,
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
        prompt: "White reflex with poor back view generally indicates:",
        options: [
          "No visual relevance",
          "Priority surgery / dense cataract pathway",
          "Normal ageing only",
          "Always glaucoma only",
        ],
        answerIndex: 1,
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
        prompt: "If fundal reflex is white, the back section becomes:",
        options: [
          "Forced open",
          "Disabled with poor-view preselection",
          "Hidden permanently",
          "Unchanged but irrelevant",
        ],
        answerIndex: 1,
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
        prompt: "Why are red outputs kept short?",
        options: [
          "Urgent action should be clear",
          "Near VA is never useful",
          "The result is less important",
          "The app cannot show notes",
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
