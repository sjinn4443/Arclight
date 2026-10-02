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
    targetBankSize: 24,
  },
  advanced: {
    title: "Advanced",
    passMark: 6,
    questionCount: 8,
    targetBankSize: 24,
  },
};

const RAW_MCQ_BANKS = {
  primary: [
    {
      question: "What does no referable disc signs mean?",
      options: [
        "No signs seen in the view obtained",
        "No optic nerve disease ever",
        "No need to check pupils",
        "No need to ask symptoms",
      ],
      answer: 0,
      topic: "safety-copy",
    },
    {
      question: "Which finding can mimic papilloedema?",
      options: ["Disc drusen", "Large disc", "Clear rim", "Normal cup"],
      answer: 0,
      topic: "drusen",
    },
    {
      question: "Which sign should raise concern for glaucoma?",
      options: [
        "Thin rim",
        "Clear disc margin",
        "Normal vessels",
        "Symmetric small cups",
      ],
      answer: 0,
      topic: "glaucoma",
    },
    {
      question: "What does a swollen disc need?",
      options: [
        "Urgent clinical review if true or uncertain",
        "Routine discharge",
        "Spectacle change only",
        "Ignore if painless",
      ],
      answer: 0,
      topic: "urgent",
    },
    {
      question: "What is the neuroretinal rim?",
      options: [
        "The neural tissue between the cup and disc margin",
        "The edge of the crystalline lens",
        "The macular reflex",
        "The visible sclera outside the disc",
      ],
      answer: 0,
      topic: "rim-anatomy",
    },
    {
      question: "Why does disc size matter?",
      options: [
        "Large discs can have larger physiological cups",
        "It confirms glaucoma by itself",
        "Small discs are always normal",
        "It replaces field testing",
      ],
      answer: 0,
      topic: "disc-size",
    },
    {
      question: "Which finding is a glaucoma clue?",
      options: [
        "Splinter haemorrhage",
        "Clear macula",
        "Equal red reflex",
        "Normal cornea",
      ],
      answer: 0,
      topic: "glaucoma",
    },
    {
      question: "What context should be recorded where possible?",
      options: [
        "IOP, family history and high myopia",
        "Hair colour",
        "Shoe size",
        "Dominant hand",
      ],
      answer: 0,
      topic: "context",
    },
    {
      question: "What does optic-disc pallor describe?",
      options: [
        "Reduced normal pink colour of the neuroretinal tissue",
        "A larger physiological cup only",
        "A cloudy crystalline lens",
        "A redder macular reflex",
      ],
      answer: 0,
      topic: "pallor",
    },
    {
      question: "What does an ungradable disc view mean?",
      options: [
        "Cannot assess safely",
        "Normal disc",
        "No referral possible",
        "Glaucoma excluded",
      ],
      answer: 0,
      topic: "view-quality",
    },
    {
      question: "Why should the two optic discs be compared?",
      options: [
        "Asymmetry or a unilateral acquired change can add useful context",
        "The right disc is always larger",
        "Only the better-seeing eye matters",
        "Comparison establishes a diagnosis by itself",
      ],
      answer: 0,
      topic: "comparison",
    },
    {
      question: "Which symptom context increases concern with disc swelling?",
      options: [
        "Headache or acute visual loss",
        "Hair colour",
        "Old spectacles only",
        "A stable refractive error",
      ],
      answer: 0,
      topic: "urgent",
    },
    {
      question:
        "Which disc-swelling feature can make vessels harder to follow at the margin?",
      options: [
        "Oedematous tissue obscuring vessel segments",
        "A clear physiological cup",
        "A transparent lens",
        "A sharp flat rim",
      ],
      answer: 0,
      topic: "papilloedema-sign",
    },
    {
      question:
        "Why should right-eye and left-eye findings be recorded separately?",
      options: [
        "Disc appearance and acquired abnormalities can differ between eyes",
        "Eye identity only changes the screen colour",
        "The right eye is always at higher risk",
        "A single eye label proves symmetry",
      ],
      answer: 0,
      topic: "comparison",
    },
    {
      question: "Which sign belongs to general disc signs?",
      options: [
        "Myelinated nerve fibre layer",
        "Anti-VEGF plan",
        "Laser scar count",
        "Specular reflex",
      ],
      answer: 0,
      topic: "general-discs",
    },
    {
      question: "Which finding suggests a congenital or anatomical variant?",
      options: [
        "Tilted disc",
        "Confirmed glaucoma",
        "Lens opacity",
        "Macula oedema",
      ],
      answer: 0,
      topic: "disc-variant",
    },
  ],
  intermediate: [
    {
      question: "C/D 0.6 in a small disc is:",
      options: [
        "More suspicious than in a large disc",
        "Always normal",
        "Always end-stage",
        "Not a disc finding",
      ],
      answer: 0,
      topic: "cup-disc",
    },
    {
      question: "Disc pallor may suggest:",
      options: [
        "Optic nerve damage",
        "Confirmed cataract",
        "Normal ageing only",
        "No need for VA",
      ],
      answer: 0,
      topic: "pallor",
    },
    {
      question: "A rim notch is important because it suggests:",
      options: [
        "Focal neuroretinal rim loss",
        "Lens opacity",
        "Macula oedema",
        "Retinal detachment",
      ],
      answer: 0,
      topic: "glaucoma",
    },
    {
      question:
        "Which examination assesses whether the anterior chamber angle is open or closed?",
      options: [
        "Gonioscopy",
        "Cup/disc ratio alone",
        "Amsler testing",
        "Colour-vision naming",
      ],
      answer: 0,
      topic: "gonioscopy",
    },
    {
      question: "Which combination should push urgency?",
      options: [
        "Swollen disc and abnormal pupil",
        "Large disc and normal rim",
        "C/D 0.3 alone",
        "Clear view alone",
      ],
      answer: 0,
      topic: "urgent",
    },
    {
      question:
        "Which observation is strongest evidence of structural progression?",
      options: [
        "New focal rim or retinal nerve fibre layer loss on comparable serial assessment",
        "One isolated cup ratio without a baseline",
        "A different camera exposure",
        "A clearer crystalline lens",
      ],
      answer: 0,
      topic: "serial-change",
    },
    {
      question: "Peripapillary atrophy is often linked with:",
      options: [
        "Myopia or disc margin change",
        "Confirmed papilloedema",
        "Acute glaucoma only",
        "Lens opacity",
      ],
      answer: 0,
      topic: "ppa",
    },
    {
      question: "A disc splinter haemorrhage may indicate:",
      options: [
        "A clue associated with glaucomatous damage or progression",
        "A normal vessel crossing",
        "Dense cataract",
        "No need for review",
      ],
      answer: 0,
      topic: "glaucoma",
    },
    {
      question: "When both eyes differ, action should use:",
      options: [
        "The highest-risk eye finding",
        "The better eye only",
        "The first eye seen",
        "VA alone",
      ],
      answer: 0,
      topic: "priority",
    },
    {
      question:
        "Which conclusion should be avoided from an isolated disc photograph?",
      options: [
        "A definitive glaucoma diagnosis without the wider assessment",
        "A description of rim appearance",
        "A record of view quality",
        "Comparison with the fellow eye",
      ],
      answer: 0,
      topic: "scope",
    },
    {
      question: "Why can a tilted disc complicate cup/disc assessment?",
      options: [
        "Oblique insertion can distort the apparent disc margin and cup shape",
        "Tilt confirms glaucoma",
        "Tilt removes all neuroretinal rim tissue",
        "Tilt makes fields unnecessary",
      ],
      answer: 0,
      topic: "disc-variant",
    },
    {
      question:
        "Which feature favours physiological rather than glaucomatous cupping?",
      options: [
        "A continuous rim without focal notch or RNFL defect",
        "A focal inferior rim notch",
        "A matching wedge RNFL defect",
        "Progressive disc haemorrhage",
      ],
      answer: 0,
      topic: "normal-cups",
    },
    {
      question: "Bayoneting should not be overcalled in:",
      options: [
        "Early simple vessel bending",
        "Advanced cupping",
        "Near-total rim loss",
        "Severe nasalisation",
      ],
      answer: 0,
      topic: "glaucoma",
    },
    {
      question:
        "Which approach is most useful when buried optic-disc drusen and true oedema are difficult to distinguish?",
      options: [
        "Multimodal imaging interpreted with the clinical findings",
        "Cup/disc ratio alone",
        "Visual acuity alone",
        "Lens photography alone",
      ],
      answer: 0,
      topic: "drusen-imaging",
    },
    {
      question:
        "Which associated finding makes optic-disc pallor more concerning?",
      options: [
        "A relative afferent pupillary defect",
        "A healthy continuous rim",
        "A clear media view",
        "Symmetric physiological cupping",
      ],
      answer: 0,
      topic: "pallor",
    },
    {
      question: "What remains true after a wide-field fundus view?",
      options: [
        "Only structures adequately seen can be described or excluded",
        "A wide view confirms no optic-nerve disease",
        "It replaces formal visual fields",
        "It removes the need to assess view quality",
      ],
      answer: 0,
      topic: "viewing",
    },
    {
      question:
        "Why is stereoscopic assessment useful when disc elevation is suspected?",
      options: [
        "It helps assess three-dimensional contour and true elevation",
        "It measures intraocular pressure directly",
        "It proves the cause of swelling",
        "It replaces symptom history",
      ],
      answer: 0,
      topic: "viewing",
    },
    {
      question:
        "If a disc looks swollen but drusen is possible, the safe action is:",
      options: [
        "Treat uncertainty as swelling",
        "Ignore symptoms",
        "Discharge",
        "Record no signs",
      ],
      answer: 0,
      topic: "drusen",
    },
    {
      question:
        "Why is central corneal thickness recorded in a glaucoma assessment?",
      options: [
        "It helps interpret applanation IOP and overall risk",
        "It measures the cup directly",
        "It confirms papilloedema",
        "It replaces gonioscopy",
      ],
      answer: 0,
      topic: "cct",
    },
    {
      question: "Which sign suggests nerve fibre layer loss?",
      options: [
        "Wedge-shaped RNFL defect",
        "Clear lens",
        "Equal red reflex",
        "Normal cornea",
      ],
      answer: 0,
      topic: "rnfl",
    },
    {
      question:
        "Which case should not be called glaucoma just because it is tilted?",
      options: [
        "Tilted normal disc",
        "End-stage cupping",
        "Rim notch with haemorrhage",
        "C/D 0.9 with little rim",
      ],
      answer: 0,
      topic: "disc-variant",
    },
    {
      question: "What does a disc haemorrhage near a notch suggest?",
      options: [
        "Possible active glaucoma progression",
        "Normal vessel crossing",
        "Dense cataract",
        "No follow-up",
      ],
      answer: 0,
      topic: "glaucoma",
    },
    {
      question: "Why are dated comparable disc images useful?",
      options: [
        "They can support detection of structural change over time",
        "They replace formal visual fields",
        "They prove the diagnosis from one visit",
        "They remove the need to record image quality",
      ],
      answer: 0,
      topic: "serial-change",
    },
    {
      question:
        "Which finding belongs in fast glaucoma review rather than general normal variation?",
      options: [
        "Severe cupping with little rim",
        "Healthy C/D 0.3",
        "Symmetric small cups",
        "Clear disc margin",
      ],
      answer: 0,
      topic: "glaucoma",
    },
  ],
  advanced: [
    {
      question: "C/D 0.9 with little rim should usually be treated as:",
      options: [
        "High-risk severe cupping",
        "Normal if painless",
        "Disc drusen",
        "A cataract sign",
      ],
      answer: 0,
      topic: "cup-disc",
    },
    {
      question:
        "Which factor can make a cup/disc estimate less dependable from a single two-dimensional image?",
      options: [
        "An obliquely inserted or tilted disc with an uncertain margin",
        "A clearly focused stereoscopic view",
        "A documented disc size",
        "A comparable baseline image",
      ],
      answer: 0,
      topic: "disc-variant",
    },
    {
      question:
        "Which imaging finding is most characteristic of superficial optic-disc drusen?",
      options: [
        "Autofluorescent deposits at the optic nerve head",
        "A clear crystalline lens",
        "Macular hard drusen only",
        "A flat physiological cup",
      ],
      answer: 0,
      topic: "drusen-imaging",
    },
    {
      question:
        "Which finding should not be dismissed because the fellow eye looks normal?",
      options: [
        "Swollen disc",
        "A clear media view",
        "A small symmetric cup",
        "A sharp disc margin",
      ],
      answer: 0,
      topic: "priority",
    },
    {
      question: "Why record VA with disc findings?",
      options: [
        "Reduced VA can increase concern",
        "It confirms disc drusen",
        "It replaces pupil testing",
        "It proves IOP",
      ],
      answer: 0,
      topic: "va",
    },
    {
      question: "Which sign supports advanced cupping?",
      options: [
        "Vessel bayoneting",
        "Normal vessel entry",
        "Clear red reflex",
        "No symptoms",
      ],
      answer: 0,
      topic: "glaucoma",
    },
    {
      question:
        "Swollen disc with headache, acute visual loss or abnormal pupils should trigger:",
      options: [
        "Urgent review",
        "Annual review only",
        "No action",
        "Spectacles only",
      ],
      answer: 0,
      topic: "urgent",
    },
    {
      question:
        "Why should optic-disc contour be assessed stereoscopically where possible?",
      options: [
        "Depth information helps distinguish excavation from elevation",
        "It directly measures visual-field sensitivity",
        "It removes the need for dilation",
        "It confirms the diagnosis without other tests",
      ],
      answer: 0,
      topic: "viewing",
    },
    {
      question: "A C/D 0.6 plus thin rim and field symptoms should be:",
      options: [
        "Referred soon or urgently depending context",
        "Ignored",
        "Called normal",
        "Recorded as cataract",
      ],
      answer: 0,
      topic: "glaucoma",
    },
    {
      question:
        "Why does gonioscopy matter before classifying glaucoma management?",
      options: [
        "Angle configuration separates open-angle from angle-closure mechanisms",
        "It measures the neuroretinal rim",
        "It identifies optic-disc drusen",
        "It replaces IOP and field assessment",
      ],
      answer: 0,
      topic: "gonioscopy",
    },
    {
      question: "Which combination supports asymmetric glaucomatous damage?",
      options: [
        "A focal notch with a corresponding nerve fibre layer defect",
        "Symmetric small cups",
        "Clear media only",
        "Normal vessel entry alone",
      ],
      answer: 0,
      topic: "glaucoma",
    },
    {
      question:
        "Which combination is compatible with advanced glaucomatous damage?",
      options: [
        "Deep cupping with marked rim and nerve fibre layer loss",
        "A tiny cup with a broad healthy rim",
        "A clear lens without disc change",
        "Disc swelling alone",
      ],
      answer: 0,
      topic: "glaucoma",
    },
    {
      question: "Which finding is most concerning in very advanced cupping?",
      options: [
        "Near-total excavation with little residual rim and vessel bayoneting",
        "A broad continuous rim",
        "No lamina visibility",
        "Lens opacity alone",
      ],
      answer: 0,
      topic: "glaucoma",
    },
    {
      question: "End-stage cupping means:",
      options: [
        "Near-total excavation with minimal rim",
        "Normal baseline cup",
        "Disc drusen only",
        "Mild physiological cupping",
      ],
      answer: 0,
      topic: "glaucoma-sequence",
    },
    {
      question:
        "Which paired findings strengthen concern for focal glaucomatous damage?",
      options: [
        "A splinter haemorrhage with a local rim notch",
        "A clear rim with normal fields",
        "Lens opacity with a large disc",
        "A healthy rim with symmetric cups",
      ],
      answer: 0,
      topic: "glaucoma",
    },
    {
      question:
        "Baring of circumlinear vessels means vessels look exposed because:",
      options: [
        "Rim beneath has been lost",
        "The lens is cloudy",
        "The macula is swollen",
        "Dilation is off",
      ],
      answer: 0,
      topic: "glaucoma",
    },
    {
      question:
        "Which change is compatible with moderate or more advanced glaucomatous damage?",
      options: [
        "An asymmetric cup with a focal rim notch",
        "A broad continuous rim",
        "A stable symmetric small cup",
        "No structural disc change",
      ],
      answer: 0,
      topic: "glaucoma",
    },
    {
      question: "What does loss of the ISNT pattern describe?",
      options: [
        "Rim thickness no longer follows the usual inferior-superior-nasal-temporal order",
        "A detached retina",
        "A definitively normal disc",
        "A diagnosed cataract",
      ],
      answer: 0,
      topic: "glaucoma",
    },
    {
      question:
        "Which longitudinal finding carries more weight than a single cup/disc ratio?",
      options: [
        "Reproducible progressive rim or retinal nerve fibre layer loss",
        "A different flash exposure",
        "A new file name",
        "A one-off larger image scale",
      ],
      answer: 0,
      topic: "serial-change",
    },
    {
      question:
        "Which principle helps avoid over-referral for physiological cupping?",
      options: [
        "Interpret cup size with disc size, rim integrity, symmetry and other findings",
        "Refer every large cup urgently",
        "Use cup size as a diagnosis",
        "Ignore visual fields",
      ],
      answer: 0,
      topic: "normal-cups",
    },
    {
      question:
        "What should happen if one eye is ungradable and the other has high-risk cupping?",
      options: [
        "High-risk eye drives action, fellow eye is a limitation",
        "Ungradable eye cancels the finding",
        "Call both normal",
        "Use the better eye only",
      ],
      answer: 0,
      topic: "priority",
    },
    {
      question:
        "What should happen before two images are used to judge progression?",
      options: [
        "Confirm that view, focus, scale and disc orientation are sufficiently comparable",
        "Assume every apparent difference is biological change",
        "Ignore image quality if the cup is visible",
        "Compare only the file dates",
      ],
      answer: 0,
      topic: "serial-change",
    },
    {
      question:
        "Which wider assessment best complements a suspicious glaucoma-pattern disc?",
      options: [
        "IOP, gonioscopy, central corneal thickness and visual-field testing",
        "Lens colour and near add only",
        "Amsler testing alone",
        "One repeat cup estimate without context",
      ],
      answer: 0,
      topic: "context",
    },
    {
      question:
        "Which examination detail helps the receiving clinician interpret the disc view?",
      options: [
        "Whether the pupils were dilated",
        "Unrelated laser settings",
        "An invented OCT thickness",
        "A treatment dose not prescribed",
      ],
      answer: 0,
      topic: "referral-note",
    },
  ],
};

export const MCQ_SOURCE_REGISTRY = Object.freeze({
  "NICE-NG81": Object.freeze({
    title: "NICE NG81: Glaucoma diagnosis and management",
    url: "https://www.nice.org.uk/guidance/ng81/chapter/Recommendations",
  }),
  "EGS-5": Object.freeze({
    title:
      "European Glaucoma Society Terminology and Guidelines, fifth edition",
    url: "https://bjo.bmj.com/content/105/Suppl_1/1",
  }),
  "ODD-IMAGING-2021": Object.freeze({
    title:
      "Updates on imaging features of optic disc drusen, papilloedema and optic disc oedema",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7813448/",
  }),
  "IIH-CONSENSUS-2018": Object.freeze({
    title:
      "Idiopathic intracranial hypertension: consensus guidelines on management",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6166610/",
  }),
});

const MCQ_REVIEW_STATUS = "Independent clinical sign-off pending";

const TOPIC_RATIONALES = Object.freeze({
  "safety-copy":
    "Describe only what was seen and the quality of the view; absence of a recorded sign does not exclude optic-nerve disease.",
  drusen:
    "Optic-disc drusen can mimic true swelling, so uncertainty requires clinical correlation and appropriate imaging rather than reassurance from appearance alone.",
  glaucoma:
    "Glaucomatous concern is strengthened by characteristic rim, retinal nerve fibre layer, vessel and visual-field findings rather than cup size alone.",
  urgent:
    "True or uncertain disc swelling can represent sight-threatening or neurological disease and should be assessed promptly in its clinical context.",
  "cup-disc":
    "Cup-to-disc ratio must be interpreted with disc size, rim integrity, symmetry and other structural and functional findings.",
  "disc-size":
    "Large discs may have larger physiological cups while the same ratio in a small disc can be more suspicious.",
  context:
    "Disc interpretation is safer when combined with intraocular pressure, visual fields, family history, refractive context and comparison over time.",
  "view-quality":
    "An inadequate view is a limitation, not a normal result; obtain an adequate assessment or refer according to the clinical context.",
  viewing:
    "A wider view still supports only structures that were adequately visualised and does not replace the wider glaucoma assessment.",
  scope:
    "Optic-disc appearance supports assessment but cannot establish a definitive diagnosis or treatment plan in isolation.",
  "general-discs":
    "Congenital and anatomical disc appearances should be described and distinguished from acquired optic-nerve disease.",
  "disc-variant":
    "Tilt and other anatomical variants can alter apparent disc shape, so diagnosis should not rest on appearance alone.",
  "normal-cups":
    "Physiological cupping is judged from the whole disc and rim pattern, not a single cup ratio.",
  pallor:
    "Disc pallor with reduced visual function or an afferent pupil defect raises concern for optic neuropathy and needs clinical correlation.",
  priority:
    "The highest-risk finding drives action while limitations in the fellow eye remain explicitly recorded.",
  ppa: "Peripapillary atrophy can accompany myopia and disc-margin change but is not diagnostic by itself.",
  rnfl: "A wedge-shaped retinal nerve fibre layer defect is a structural clue that should be correlated with rim and field findings.",
  va: "Visual acuity helps describe optic-nerve function and can increase concern when reduced, but it does not identify the cause alone.",
  "referral-note":
    "Recording examination conditions such as dilation and view quality helps the receiving clinician interpret the observation.",
  "glaucoma-sequence":
    "Increasing rim and nerve fibre loss, excavation and vessel change are compatible with more advanced glaucomatous damage.",
  "rim-anatomy":
    "The neuroretinal rim is the remaining neural tissue between the optic cup and the disc margin; its integrity matters more than a cup number alone.",
  comparison:
    "Comparing separately recorded eyes can reveal asymmetry or unilateral acquired change, but interpretation still needs the wider assessment.",
  "papilloedema-sign":
    "True disc oedema can blur the margin and obscure vessel segments as they cross swollen tissue.",
  gonioscopy:
    "Gonioscopy identifies anterior chamber angle configuration and is part of the wider glaucoma assessment.",
  "serial-change":
    "Progression requires comparable observations; repeatable rim or retinal nerve fibre layer change is more meaningful than image or scale variation.",
  "drusen-imaging":
    "Buried optic-disc drusen and true oedema may overlap in appearance, so multimodal imaging and clinical correlation are safer than inspection alone.",
  cct: "Central corneal thickness contributes to interpretation of applanation intraocular pressure and glaucoma risk.",
});

const TOPIC_SOURCES = Object.freeze({
  drusen: ["ODD-IMAGING-2021", "IIH-CONSENSUS-2018"],
  urgent: ["IIH-CONSENSUS-2018"],
  "view-quality": ["NICE-NG81", "IIH-CONSENSUS-2018"],
  pallor: ["IIH-CONSENSUS-2018"],
  scope: ["NICE-NG81"],
  viewing: ["NICE-NG81", "IIH-CONSENSUS-2018"],
  "papilloedema-sign": ["IIH-CONSENSUS-2018"],
  gonioscopy: ["NICE-NG81", "EGS-5"],
  "serial-change": ["NICE-NG81", "EGS-5"],
  "drusen-imaging": ["ODD-IMAGING-2021", "IIH-CONSENSUS-2018"],
  cct: ["NICE-NG81", "EGS-5"],
});

export const MCQ_BANKS = Object.freeze(
  Object.fromEntries(
    Object.entries(RAW_MCQ_BANKS).map(([level, questions]) => [
      level,
      Object.freeze(
        questions.map((question, index) =>
          Object.freeze({
            ...question,
            id: `discs-${level}-${String(index + 1).padStart(2, "0")}`,
            explanation:
              TOPIC_RATIONALES[question.topic] ||
              "Use the best-supported observation and interpret it with the wider clinical assessment.",
            sourceIds: Object.freeze(
              TOPIC_SOURCES[question.topic] || ["NICE-NG81", "EGS-5"],
            ),
            reviewStatus: MCQ_REVIEW_STATUS,
          }),
        ),
      ),
    ]),
  ),
);
