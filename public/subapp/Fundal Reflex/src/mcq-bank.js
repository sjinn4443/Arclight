export const MCQ_LEVEL_META = {
  primary: { title: "Primary", passMark: 3, questionCount: 5 },
  intermediate: { title: "Intermediate", passMark: 4, questionCount: 6 },
  advanced: { title: "Advanced", passMark: 6, questionCount: 8 },
};

export const MCQ_SOURCE_REFERENCES = {
  "nipe-eye-screening-2026": {
    title:
      "NHS Newborn and Infant Physical Examination screening programme handbook",
    url: "https://www.gov.uk/government/publications/newborn-and-infant-physical-examination-programme-handbook/newborn-and-infant-physical-examination-screening-programme-handbook",
    reviewed: "2026-07-26",
    status: "primary-source-reviewed",
  },
  "fundal-reflex-case-catalogue-v1": {
    title: "Fundal Reflex v1 simulator case catalogue and teaching scope",
    url: null,
    reviewed: "2026-07-26",
    status: "internal-engineering-review",
  },
  "fundal-reflex-safety-v1": {
    title: "Fundal Reflex v1 safety and escalation wording",
    url: null,
    reviewed: "2026-07-26",
    status: "pending-independent-clinical-sign-off",
  },
};

const RAW_MCQ_BANK = {
  primary: [
    {
      question:
        "Both eyes show similar bright orange-red reflexes. Best match:",
      options: [
        "Normal eyes",
        "Dense cataracts",
        "Corneal opacity",
        "Dark reflex problem",
      ],
      answer: 0,
    },
    {
      question:
        "One eye has a much darker reflex than the other. The key first observation is:",
      options: [
        "Asymmetry between the eyes",
        "Equal bright reflexes",
        "A white reflex",
        "A corneal scar",
      ],
      answer: 0,
    },
    {
      question:
        "What can create a falsely unequal reflex during the examination?",
      options: [
        "Unequal gaze or partial lid obstruction",
        "Equal viewing distance",
        "Centred pupils with both eyes open",
        "A bright symmetrical reflex",
      ],
      answer: 0,
    },
    {
      question: "A creamy white pupil is most concerning for:",
      options: [
        "Retinoblastoma",
        "Normal blue reflex",
        "Large esotropia",
        "Poor tear film",
      ],
      answer: 0,
    },
    {
      question: "A baby with a white pupil needs:",
      options: [
        "Urgent eye referral via the local pathway",
        "Routine non-urgent review",
        "Watching only if both eyes move",
        "A colour-only check",
      ],
      answer: 0,
    },
    {
      question:
        "Both eyes have a blue-white but otherwise even reflex. Best label:",
      options: [
        "Normal blue reflex",
        "Dense cataract",
        "White reflex concern",
        "Dark reflex problem",
      ],
      answer: 0,
    },
    {
      question:
        "What must still be checked before an even blue-white reflex is called a colour variant?",
      options: [
        "Brightness, shape and symmetry",
        "Hair colour only",
        "One pupil only",
        "Age alone",
      ],
      answer: 0,
    },
    {
      question:
        "The child is looking away and the reflex view is poor. Best next step:",
      options: [
        "Repeat after improving the view",
        "Call it normal",
        "Refer as a white reflex",
        "Judge colour only",
      ],
      answer: 0,
    },
    {
      question:
        "Upper lids cover both pupils and the reflex cannot be judged. How should the finding be recorded?",
      options: [
        "View inadequate or unassessed",
        "Normal reflexes",
        "Bilateral cataracts",
        "Normal because both sides match",
      ],
      answer: 0,
    },
    {
      question:
        "One eye turns in towards the nose and its reflex appears brighter. This is:",
      options: [
        "Esotropia (eye turns in)",
        "Exotropia (eye turns out)",
        "Anisocoria (unequal pupils)",
        "Corneal opacity",
      ],
      answer: 0,
    },
    {
      question:
        "When one eye turns in, what should be assessed separately from reflex brightness?",
      options: [
        "Eye alignment",
        "Hair colour",
        "Lens surgery history only",
        "Tear-film shimmer only",
      ],
      answer: 0,
    },
    {
      question: "One eye turns out away from the nose. This is:",
      options: [
        "Esotropia (eye turns in)",
        "Exotropia (eye turns out)",
        "Anisocoria (unequal pupils)",
        "Coloboma (notched pupil)",
      ],
      answer: 1,
    },
    {
      question:
        "One eye turns out and has an obvious corneal scar. Best Primary match:",
      options: [
        "Large exotropia with corneal scar",
        "Large esotropia",
        "Retinoblastoma",
        "Normal blue reflex",
      ],
      answer: 0,
    },
    {
      question: "Which clue localises reduced reflex clarity to the cornea?",
      options: [
        "A visible anterior scar crossing the pupil",
        "A freely drifting dark dot",
        "A fixed posterior sector",
        "An equal blue-white reflex",
      ],
      answer: 0,
    },
    {
      question: "The simplest normal case should have:",
      options: [
        "Equal reflexes in right and left eyes",
        "A fixed dark sector",
        "Blood-like haze",
        "A lens edge",
      ],
      answer: 0,
    },
    {
      question:
        "If the two reflexes cannot be compared reliably, the safest next step is to:",
      options: [
        "Improve the view and repeat or seek eye assessment",
        "Record both as normal",
        "Judge colour alone",
        "Ignore the obscured eye",
      ],
      answer: 0,
    },
  ],
  intermediate: [
    {
      question: "Both eyes show a superior crescent. Best match:",
      options: ["High hypermetropia", "Myopia", "Poor tear film", "Anisocoria"],
      answer: 0,
    },
    {
      question:
        "Why is a refractive crescent not a final spectacle prescription?",
      options: [
        "It is a screening cue that still needs formal refraction",
        "It measures the exact lens power",
        "It excludes astigmatism",
        "It confirms normal acuity",
      ],
      answer: 0,
    },
    {
      question:
        "Both eyes have a duller-than-normal corneal reflex. Best match:",
      options: [
        "Dull corneal reflex",
        "Retinal detachment",
        "Aphakia",
        "Keratoconus",
      ],
      answer: 0,
    },
    {
      question:
        "Which observation helps separate surface-related dullness from a fixed lens opacity?",
      options: [
        "The appearance changes after a blink",
        "The pupil becomes keyhole-shaped",
        "A lens edge is visible",
        "A fixed sector stays in place",
      ],
      answer: 0,
    },
    {
      question:
        "The reflex flickers and shimmers as the light moves. Best match:",
      options: [
        "Poor tear film",
        "Dense cataract",
        "Retinal detachment",
        "Vitreous haemorrhage",
      ],
      answer: 0,
    },
    {
      question:
        "When surface shimmer makes the reflex unstable, the next useful step is to:",
      options: [
        "Encourage a blink and reassess",
        "Record a retinal detachment",
        "Call the view normal",
        "Diagnose aphakia",
      ],
      answer: 0,
    },
    {
      question:
        "Right eye has a superior crescent; left eye has an inferior crescent. Best interpretation:",
      options: [
        "Bilateral myopia",
        "Bilateral hypermetropia",
        "Right hypermetropia with left myopia",
        "Keratoconus",
      ],
      answer: 2,
    },
    {
      question: "Different crescent directions between eyes should prompt:",
      options: [
        "A refractive comparison of both eyes",
        "A colour-only check",
        "Immediate labelling as cataract",
        "Ignoring the clearer eye",
      ],
      answer: 0,
    },
    {
      question:
        "An inferior keyhole-shaped pupil with an altered reflex is most typical of:",
      options: ["Coloboma", "Aniridia", "Acute angle closure", "Iridocyclitis"],
      answer: 0,
    },
    {
      question:
        "Which feature separates an iris coloboma from a round central opacity?",
      options: [
        "A visible keyhole extension of the pupil margin",
        "A freely mobile dark dot",
        "A diffuse vitreous haze",
        "An equal round pupil",
      ],
      answer: 0,
    },
    {
      question: "Marked loss of iris tissue in both eyes is called:",
      options: [
        "Aniridia",
        "Small pupils",
        "Acute angle closure",
        "Iris transillumination",
      ],
      answer: 0,
    },
    {
      question: "Bilateral aniridia may also show:",
      options: [
        "Subtle nystagmus",
        "Retinal detachment",
        "A pseudophakic second reflex",
        "A lens edge",
      ],
      answer: 0,
    },
    {
      question: "One pupil is clearly smaller than the other. The term is:",
      options: ["Anisocoria", "Aniridia", "Coloboma", "Aphakia"],
      answer: 0,
    },
    {
      question: "Which finding is not explained safely by simple anisocoria?",
      options: [
        "A white or obscured reflex",
        "Unequal pupil size",
        "Equal clear reflexes",
        "A visible larger pupil",
      ],
      answer: 0,
    },
    {
      question:
        "A small extra patch of light is seen passing through the iris. Best match:",
      options: [
        "Anisocoria",
        "Posterior pole cataract",
        "Iris transillumination",
        "Aphakia",
      ],
      answer: 2,
    },
    {
      question: "Which feature favours iris transillumination over coloboma?",
      options: [
        "A light patch through the iris without a keyhole pupil margin",
        "A fixed retinal sector",
        "A dense central lens plaque",
        "A missing crystalline lens",
      ],
      answer: 0,
    },
    {
      question:
        "Both pupils are small, making the reflex harder to view. Best match:",
      options: ["Small pupils", "Aphakia", "Keratoconus", "Retinal detachment"],
      answer: 0,
    },
    {
      question:
        "If small pupils prevent an adequate reflex view, the result should be:",
      options: [
        "Recorded as limited or unassessed",
        "Recorded as normal",
        "Called aphakia",
        "Called retinal detachment",
      ],
      answer: 0,
    },
    {
      question:
        "One eye has a dense central posterior opacity but the other is normal. Best match:",
      options: [
        "Retinal detachment",
        "Poor tear film",
        "Posterior pole cataract",
        "Floaters",
      ],
      answer: 2,
    },
    {
      question:
        "Which comparison helps distinguish a posterior lens opacity from a corneal scar?",
      options: [
        "A clear corneal surface with a deeper central shadow",
        "A freely moving opacity",
        "A keyhole pupil margin",
        "A changing tear-film shimmer",
      ],
      answer: 0,
    },
    {
      question:
        "In a baby, both reflexes are dull with lens-media haze. Most concerning for:",
      options: [
        "Poor tear film",
        "Keratoconus",
        "Congenital cataract",
        "Physiological anisocoria",
      ],
      answer: 2,
    },
    {
      question:
        "An infant with an obscured or markedly asymmetric reflex should receive:",
      options: [
        "Urgent eye referral through the local pathway",
        "Routine observation only",
        "A normal result if both eyes move",
        "Colour reassessment at adulthood",
      ],
      answer: 0,
    },
    {
      question:
        "A full grey reflex with only a faint hazy corneal reflection suggests:",
      options: [
        "Myopia",
        "Floaters",
        "Corneal opacity",
        "Posterior pole cataract",
      ],
      answer: 2,
    },
    {
      question:
        "When a visible corneal opacity limits the reflex, the record should include:",
      options: [
        "The anterior opacity and the limited fundal view",
        "A normal fundus",
        "Only pupil size",
        "Only eye alignment",
      ],
      answer: 0,
    },
    {
      question:
        "Left eye shows a sharp lens edge and reversed inferior crescent; right eye is normal. Best match:",
      options: [
        "Aphakia",
        "Posterior pole cataract",
        "Myopia",
        "Downward lens subluxation",
      ],
      answer: 3,
    },
    {
      question: "Which feature separates lens subluxation from aphakia?",
      options: [
        "A displaced lens edge is still visible",
        "The reflex is always white",
        "Both pupils are small",
        "The opacity drifts freely",
      ],
      answer: 0,
    },
  ],
  advanced: [
    {
      question:
        "One painful-looking eye has a vertically oval pupil and duller reflex. Treat as:",
      options: [
        "Benign anisocoria",
        "Acute angle closure",
        "Keratoconus",
        "Aphakia",
      ],
      answer: 1,
    },
    {
      question:
        "Why is a vertically oval pupil in a painful red eye not safely classified as simple anisocoria?",
      options: [
        "It may indicate an acute anterior-segment emergency",
        "It confirms a refractive error",
        "It is expected with normal pigmentation",
        "It excludes raised pressure",
      ],
      answer: 0,
    },
    {
      question:
        "What is the key limitation of using the fundal reflex in a painful red eye?",
      options: [
        "It cannot rule out an anterior-segment emergency",
        "It confirms angle closure by itself",
        "It replaces pressure assessment",
        "It makes the fellow eye irrelevant",
      ],
      answer: 0,
    },
    {
      question:
        "Small black dots sit on the reflex near the pupil margin. Best match:",
      options: [
        "Retinal detachment",
        "Iridocyclitis",
        "Acute angle closure",
        "Poor tear film",
      ],
      answer: 1,
    },
    {
      question:
        "Iridocyclitis is more likely than simple anisocoria when there are:",
      options: [
        "Inflammatory-looking pupil-margin changes",
        "Equal normal reflexes",
        "Both eyes blue-white only",
        "A drifting floater",
      ],
      answer: 0,
    },
    {
      question:
        "Both eyes show a large distorted scissors-like reflex. Best match:",
      options: [
        "High hypermetropia",
        "Dense cataract",
        "Keratoconus",
        "Small pupils",
      ],
      answer: 2,
    },
    {
      question: "A markedly distorted scissors reflex should prompt:",
      options: [
        "Corneal and refractive assessment",
        "A diagnosis from the reflex alone",
        "A retinal-detachment label",
        "A normal result if bilateral",
      ],
      answer: 0,
    },
    {
      question: "Spoke-like radial lens shadows cross the reflex. Best match:",
      options: [
        "Subcapsular cataract",
        "Cortical cataract",
        "Posterior pole cataract",
        "Aniridia",
      ],
      answer: 1,
    },
    {
      question:
        "Which feature separates cortical lens spokes from vitreous floaters?",
      options: [
        "Lens spokes remain fixed while floaters drift",
        "Lens spokes are always blue",
        "Floaters form a keyhole pupil",
        "Floaters create an IOL reflection",
      ],
      answer: 0,
    },
    {
      question:
        "A central posterior plaque causes glare and reduces the reflex. Best match:",
      options: [
        "Dense cataract",
        "Corneal opacity",
        "Subcapsular cataract",
        "Floaters",
      ],
      answer: 2,
    },
    {
      question:
        "Why can a small posterior subcapsular opacity cause marked symptoms?",
      options: [
        "Its central position can interfere with the visual axis and glare",
        "It always turns the eye out",
        "It makes floaters stationary",
        "It enlarges the iris",
      ],
      answer: 0,
    },
    {
      question:
        "A second corneal reflection appears in a pseudophakic eye. Best match:",
      options: [
        "IOL reflection",
        "Posterior vitreous detachment",
        "Corneal opacity",
        "Anisocoria",
      ],
      answer: 0,
    },
    {
      question:
        "In the IOL and capsular thickening case, the left-eye clue is:",
      options: [
        "Posterior capsule haze",
        "Retinal detachment",
        "Coloboma notch",
        "Large esotropia",
      ],
      answer: 0,
    },
    {
      question:
        "The crystalline lens is absent, giving a very bright altered reflex. This is:",
      options: ["Aniridia", "Anisometropia", "Aphakia", "Ametropia"],
      answer: 2,
    },
    {
      question: "Which clue favours pseudophakia rather than aphakia?",
      options: [
        "An intraocular-lens reflection or lens-surgery history",
        "No crystalline lens and no implant",
        "A changing tear-film shimmer",
        "A fixed retinal sector",
      ],
      answer: 0,
    },
    {
      question:
        "Mobile dark opacities drift across an otherwise present reflex. Best match:",
      options: [
        "Retinal detachment",
        "Floaters",
        "Vitreous haemorrhage",
        "Dense cataract",
      ],
      answer: 1,
    },
    {
      question:
        "New mobile opacities reported with flashes or visual loss should be:",
      options: [
        "Assessed clinically rather than dismissed as harmless floaters",
        "Recorded as normal",
        "Treated as a colour variant",
        "Explained by pupil size alone",
      ],
      answer: 0,
    },
    {
      question:
        "A diffuse blood-like haze obscures much of the reflex rather than forming small dots. Best match:",
      options: [
        "Poor tear film",
        "Floaters",
        "Vitreous haemorrhage",
        "Corneal opacity",
      ],
      answer: 2,
    },
    {
      question:
        "A diffuse blood-like haze behind a clear cornea should be recorded as:",
      options: [
        "A limited posterior view needing urgent assessment",
        "A normal fundus",
        "A tear-film problem only",
        "A refractive crescent",
      ],
      answer: 0,
    },
    {
      question:
        "A fixed dark sector stays in the same part of the pupil as the light moves. Best match:",
      options: ["Aniridia", "Aphakia", "Retinal detachment", "Floaters"],
      answer: 2,
    },
    {
      question: "A fixed dark sector with new visual symptoms should prompt:",
      options: [
        "Urgent eye assessment",
        "Routine colour review only",
        "A normal result if the other eye is clear",
        "A tear-film treatment assumption",
      ],
      answer: 0,
    },
    {
      question:
        "Retroillumination is useful for cortical lens opacity because it:",
      options: [
        "Outlines fixed spokes against the fundal reflex",
        "Makes floaters stationary",
        "Confirms retinal attachment",
        "Measures pupil alignment",
      ],
      answer: 0,
    },
    {
      question:
        "Why can vitreous haemorrhage not be assessed fully from the reflex pattern alone?",
      options: [
        "The haze can conceal the underlying retina",
        "It always clears after a blink",
        "It is identical to a corneal scar",
        "It proves the retina is attached",
      ],
      answer: 0,
    },
    {
      question:
        "What is the key limitation of a fixed retinal-sector reflex pattern?",
      options: [
        "It suggests posterior pathology but does not replace a retinal examination",
        "It confirms the exact retinal break",
        "It becomes normal when the fellow eye is clear",
        "It measures visual acuity",
      ],
      answer: 0,
    },
    {
      question:
        "Which history is most relevant when an IOL reflection or capsular haze is seen?",
      options: [
        "Previous cataract surgery",
        "Childhood eye colour",
        "Recent tear-film change",
        "Physiological anisocoria",
      ],
      answer: 0,
    },
    {
      question: "Aphakia and IOL/capsular thickening both point first to:",
      options: [
        "Lens status or previous lens surgery",
        "Primary alignment only",
        "Pupil size alone",
        "Tear-film shimmer",
      ],
      answer: 0,
    },
  ],
};

const TOPIC_METADATA = {
  normal: {
    explanation:
      "A reassuring screening comparison is bright, round and similar between the two eyes, while normal colour varies with pigmentation.",
    source: "nipe-eye-screening-2026",
  },
  asymmetry: {
    explanation:
      "A reflex that differs in colour or brightness from the fellow eye is an abnormal screening finding and needs further assessment.",
    source: "nipe-eye-screening-2026",
  },
  "white-reflex": {
    explanation:
      "A white reflex is abnormal. It can reflect cataract or a posterior cause, so it requires urgent eye referral rather than observation alone.",
    source: "nipe-eye-screening-2026",
  },
  "normal-variation": {
    explanation:
      "The simulator includes an even blue-white reflex as a pigmentation-related teaching variant. Symmetry and clarity remain essential comparisons.",
    source: "fundal-reflex-case-catalogue-v1",
  },
  "limited-view": {
    explanation:
      "A view obscured by gaze or eyelids is unassessed, not normal. Improve the view and repeat before interpreting the reflex.",
    source: "fundal-reflex-safety-v1",
  },
  "examination-quality": {
    explanation:
      "Compare both eyes from a centred, unobstructed position. Unequal gaze or partial lid coverage can create an apparent brightness difference that should be corrected before interpretation.",
    source: "fundal-reflex-safety-v1",
  },
  alignment: {
    explanation:
      "Esotropia turns an eye in and exotropia turns it out. Alignment changes the apparent position of the reflected light between the eyes.",
    source: "fundal-reflex-case-catalogue-v1",
  },
  "corneal-opacity": {
    explanation:
      "A corneal opacity or scar reduces reflex clarity at the anterior surface and should not be mistaken for an alignment or colour variant.",
    source: "fundal-reflex-case-catalogue-v1",
  },
  refractive: {
    explanation:
      "The simulator uses the direction and symmetry of crescents to teach refractive comparison, including different refractive states between eyes.",
    source: "fundal-reflex-case-catalogue-v1",
  },
  "refractive-limitation": {
    explanation:
      "A crescent is a qualitative screening cue. It does not measure an exact refractive correction and should not replace formal refraction.",
    source: "fundal-reflex-case-catalogue-v1",
  },
  "corneal-quality": {
    explanation:
      "A dull corneal reflection is an anterior-surface quality cue. It is distinct from a fixed posterior shadow or mobile vitreous opacity.",
    source: "fundal-reflex-case-catalogue-v1",
  },
  "tear-film": {
    explanation:
      "An irregular tear film changes as the light or blink changes, producing unstable shimmer rather than a fixed opacity.",
    source: "fundal-reflex-case-catalogue-v1",
  },
  iris: {
    explanation:
      "Iris findings alter pupil shape or permit light through an iris defect. Compare the pupil anatomy as well as the fundal reflex.",
    source: "fundal-reflex-case-catalogue-v1",
  },
  pupil: {
    explanation:
      "Pupil size changes the available view. Unequal or small pupils must be recorded rather than converted into a reflex diagnosis.",
    source: "fundal-reflex-case-catalogue-v1",
  },
  "lens-opacity": {
    explanation:
      "A central or dense lens opacity obscures the reflex in a fixed pattern and may limit the view of the fundus.",
    source: "fundal-reflex-case-catalogue-v1",
  },
  cataract: {
    explanation:
      "Cataract patterns are fixed lens opacities. Their position and shape help distinguish them from surface shimmer or vitreous movement.",
    source: "fundal-reflex-case-catalogue-v1",
  },
  "lens-position": {
    explanation:
      "A displaced lens can expose a visible lens edge and alter the crescent. Lens position is the key cue rather than retinal shadowing.",
    source: "fundal-reflex-case-catalogue-v1",
  },
  "acute-angle": {
    explanation:
      "A painful red eye with a vertically oval or poorly reactive pupil is an emergency pattern and must not be treated as benign anisocoria.",
    source: "fundal-reflex-safety-v1",
  },
  inflammation: {
    explanation:
      "Inflammatory pupil-margin changes are not explained by simple physiological anisocoria and require clinical assessment.",
    source: "fundal-reflex-safety-v1",
  },
  "corneal-shape": {
    explanation:
      "A scissors-like or markedly distorted reflex is a corneal-shape cue rather than a white-reflex or retinal-sector pattern.",
    source: "fundal-reflex-case-catalogue-v1",
  },
  "lens-surgery": {
    explanation:
      "Aphakia, an intraocular lens and posterior capsule haze are lens-status clues. Previous lens surgery should be considered when interpreting the reflex.",
    source: "fundal-reflex-case-catalogue-v1",
  },
  "lens-status": {
    explanation:
      "Aphakia means absence of the crystalline lens and produces a different optical pattern from a small pupil or retinal detachment.",
    source: "fundal-reflex-case-catalogue-v1",
  },
  vitreous: {
    explanation:
      "Small mobile opacities suggest floaters, while a diffuse blood-like haze suggests vitreous haemorrhage. Both differ from a fixed retinal sector.",
    source: "fundal-reflex-case-catalogue-v1",
  },
  retinal: {
    explanation:
      "A fixed sector that remains in the same position as the light moves is the simulator cue for retinal detachment and warrants urgent assessment.",
    source: "fundal-reflex-safety-v1",
  },
};

const TOPICS_BY_LEVEL = {
  primary: [
    "normal",
    "asymmetry",
    "examination-quality",
    "white-reflex",
    "white-reflex",
    "normal-variation",
    "normal-variation",
    "limited-view",
    "limited-view",
    "alignment",
    "alignment",
    "alignment",
    "corneal-opacity",
    "corneal-opacity",
    "normal",
    "asymmetry",
  ],
  intermediate: [
    "refractive",
    "refractive-limitation",
    "corneal-quality",
    "corneal-quality",
    "tear-film",
    "tear-film",
    "refractive",
    "refractive",
    "iris",
    "iris",
    "iris",
    "iris",
    "pupil",
    "pupil",
    "iris",
    "iris",
    "pupil",
    "pupil",
    "lens-opacity",
    "lens-opacity",
    "cataract",
    "cataract",
    "corneal-opacity",
    "corneal-opacity",
    "lens-position",
    "lens-position",
  ],
  advanced: [
    "acute-angle",
    "acute-angle",
    "acute-angle",
    "inflammation",
    "inflammation",
    "corneal-shape",
    "corneal-shape",
    "cataract",
    "cataract",
    "cataract",
    "cataract",
    "lens-surgery",
    "lens-surgery",
    "lens-status",
    "lens-status",
    "vitreous",
    "vitreous",
    "vitreous",
    "vitreous",
    "retinal",
    "retinal",
    "cataract",
    "vitreous",
    "retinal",
    "lens-surgery",
    "lens-surgery",
  ],
};

export const MCQ_BANK = Object.fromEntries(
  Object.entries(RAW_MCQ_BANK).map(([level, questions]) => [
    level,
    questions.map((question, index) => {
      const topic = TOPICS_BY_LEVEL[level][index];
      const metadata = TOPIC_METADATA[topic];
      return {
        id: `fundal-${level}-${String(index + 1).padStart(2, "0")}`,
        ...question,
        topic,
        ...metadata,
        reviewStatus: MCQ_SOURCE_REFERENCES[metadata.source].status,
      };
    }),
  ]),
);
