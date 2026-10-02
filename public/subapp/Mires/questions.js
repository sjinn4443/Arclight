export const MCQ_TIERS = [
  {
    name: "Primary",
    questionCount: 5,
    optionCount: 4,
    passRatio: 0.7,
    timeLimitSeconds: 0,
    questionIds: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10"],
  },
  {
    name: "Intermediate",
    questionCount: 6,
    optionCount: 4,
    passRatio: 0.75,
    timeLimitSeconds: 0,
    questionIds: ["i1", "i2", "i3", "i4", "i5", "i6", "i7", "i8", "i9", "i10"],
  },
  {
    name: "Advanced",
    questionCount: 7,
    optionCount: 5,
    passRatio: 0.8,
    timeLimitSeconds: 150,
    questionIds: ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "a10"],
  },
];

export const MCQ_SOURCE_REFERENCES = {
  "haag-streit-at900-2025": {
    title: "Haag-Streit AT 900 instructions for use",
    url: "https://haag-streit.com/2%20Products/General%20diagnostics/Tonometers/Tonometer%20AT%20900/Instructions%20for%20use/1500%207006000%2004270_IFU_AT_900_01_en_web.pdf",
    reviewed: "2026-07-26",
    status: "primary-source-reviewed",
  },
  "egs-gat-guidance-2017": {
    title:
      "European Glaucoma Society terminology and guidelines: Goldmann applanation tonometry",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5583682/",
    reviewed: "2026-07-26",
    status: "guideline-source-reviewed",
  },
  "mires-training-scope-v1": {
    title: "Mires v1 simulator scope and Newton practice rules",
    url: null,
    reviewed: "2026-07-26",
    status: "internal-engineering-review",
  },
};

const RAW_QUESTION_BANK = [
  {
    id: "p1",
    prompt: "Goldmann applanation tonometry mainly estimates:",
    choices: [
      { id: "a", text: "Corneal curvature only" },
      { id: "b", text: "IOP from force needed to flatten cornea" },
      { id: "c", text: "Axial length" },
      { id: "d", text: "Retinal thickness" },
    ],
    correctId: "b",
  },
  {
    id: "p2",
    prompt: "The standard Goldmann applanation diameter is:",
    choices: [
      { id: "a", text: "2.0 mm" },
      { id: "b", text: "2.5 mm" },
      { id: "c", text: "3.06 mm" },
      { id: "d", text: "4.0 mm" },
    ],
    correctId: "c",
  },
  {
    id: "p3",
    prompt: "Before Goldmann applanation, the usual setup is:",
    choices: [
      { id: "a", text: "No drops are needed" },
      { id: "b", text: "Cycloplegic only" },
      {
        id: "c",
        text: "Topical anaesthetic and a small amount of fluorescein",
      },
      { id: "d", text: "Topical steroid and antibiotic ointment" },
    ],
    correctId: "c",
  },
  {
    id: "p4",
    prompt: "Excess fluorescein can make the mires:",
    choices: [
      { id: "a", text: "Thin and faint" },
      { id: "b", text: "No change to mire appearance" },
      { id: "c", text: "Too wide for a reliable endpoint" },
      { id: "d", text: "Immediate corneal oedema" },
    ],
    correctId: "c",
  },
  {
    id: "p5",
    prompt: "Mires become too narrow as the tear film dries. What next?",
    choices: [
      { id: "a", text: "Withdraw, let the patient blink then repeat" },
      { id: "b", text: "Accept the reading without repeating" },
      { id: "c", text: "No need for anaesthetic" },
      { id: "d", text: "An exact reading despite a poor endpoint" },
    ],
    correctId: "a",
  },
  {
    id: "p6",
    prompt: "At correct endpoint, the inner edges of the two mires should:",
    choices: [
      { id: "a", text: "Stay clearly apart" },
      { id: "b", text: "Just touch" },
      { id: "c", text: "Overlap by half a ring width" },
      { id: "d", text: "Disappear completely" },
    ],
    correctId: "b",
  },
  {
    id: "p7",
    prompt:
      "If the eyelids are squeezing during applanation, the best immediate action is:",
    choices: [
      { id: "a", text: "Press harder on the lid to stabilise the eye" },
      {
        id: "b",
        text: "Ask the patient to relax and hold lids gently without globe pressure",
      },
      { id: "c", text: "Increase fluorescein until rings are very thick" },
      { id: "d", text: "Ignore it and take the reading anyway" },
    ],
    correctId: "b",
  },
  {
    id: "i1",
    prompt:
      "If the mires pulsate with the ocular pulse, the reading should be taken at:",
    choices: [
      { id: "a", text: "The maximum inward overlap" },
      { id: "b", text: "The maximum outward separation" },
      { id: "c", text: "The midpoint of pulsation" },
      { id: "d", text: "Any point, it makes no difference" },
    ],
    correctId: "c",
  },
  {
    id: "i2",
    prompt: "For routine Goldmann technique, the prism should applanate on:",
    choices: [
      { id: "a", text: "The central cornea with the prism perpendicular" },
      { id: "b", text: "The limbus to avoid the pupil" },
      { id: "c", text: "The superior conjunctiva" },
      { id: "d", text: "The cornea through a soft contact lens" },
    ],
    correctId: "a",
  },
  {
    id: "i3",
    prompt:
      "Pressure on the globe from lids or fingers during applanation usually causes:",
    choices: [
      { id: "a", text: "Falsely low IOP readings" },
      { id: "b", text: "No change to IOP readings" },
      { id: "c", text: "Only mire colour change" },
      { id: "d", text: "Falsely high IOP readings" },
    ],
    correctId: "d",
  },
  {
    id: "i4",
    prompt:
      "Markedly irregular or distorted mires are commonly associated with:",
    choices: [
      { id: "a", text: "A smooth healthy tear film" },
      { id: "b", text: "Corneal surface disease or scarring" },
      { id: "c", text: "A perfectly aligned prism" },
      { id: "d", text: "A naturally low IOP" },
    ],
    correctId: "b",
  },
  {
    id: "i5",
    prompt:
      "If a single Goldmann reading looks inconsistent, best practice is to:",
    choices: [
      { id: "a", text: "Accept it without repeating" },
      { id: "b", text: "Repeat and average consistent readings" },
      { id: "c", text: "Round to the nearest 5 mmHg" },
      { id: "d", text: "Switch immediately to another instrument" },
    ],
    correctId: "b",
  },
  {
    id: "i6",
    prompt: "Before Goldmann applanation, you should:",
    choices: [
      { id: "a", text: "Leave contact lenses in place for stability" },
      { id: "b", text: "Remove contact lenses first" },
      { id: "c", text: "Instill mydriatic in all cases" },
      { id: "d", text: "Avoid fluorescein to reduce artefacts" },
    ],
    correctId: "b",
  },
  {
    id: "i7",
    prompt: "After each patient, the Goldmann prism should be:",
    choices: [
      { id: "a", text: "Reused immediately if the cornea looked clear" },
      {
        id: "b",
        text: "Disinfected per local protocol, then rinsed if required",
      },
      { id: "c", text: "Wiped only with dry tissue" },
      { id: "d", text: "Flamed briefly and cooled" },
    ],
    correctId: "b",
  },
  {
    id: "a1",
    prompt: "Why is 3.06 mm used in Goldmann applanation?",
    choices: [
      { id: "a", text: "It maximises slit-lamp magnification" },
      {
        id: "b",
        text: "At this diameter, corneal rigidity and tear surface tension roughly cancel",
      },
      { id: "c", text: "It removes the need for anaesthetic" },
      { id: "d", text: "It corrects all corneal thickness errors" },
      { id: "e", text: "It converts readings directly to Pascal units" },
    ],
    correctId: "b",
  },
  {
    id: "a2",
    prompt:
      "Compared with average corneal thickness, a thicker cornea tends to make Goldmann readings:",
    choices: [
      { id: "a", text: "Falsely lower" },
      { id: "b", text: "Unchanged in all cases" },
      { id: "c", text: "Falsely higher" },
      { id: "d", text: "Random without pattern" },
      { id: "e", text: "Exactly corrected by fluorescein amount" },
    ],
    correctId: "c",
  },
  {
    id: "a3",
    prompt: "After myopic corneal refractive surgery, Goldmann often:",
    choices: [
      { id: "a", text: "Overestimates IOP markedly" },
      { id: "b", text: "Underestimates true IOP in many cases" },
      { id: "c", text: "Becomes unaffected by corneal biomechanics" },
      { id: "d", text: "Cannot be performed at all" },
      { id: "e", text: "Always reads exactly 20 mmHg" },
    ],
    correctId: "b",
  },
  {
    id: "a4",
    prompt:
      "With regular astigmatism greater than about 3D, a recommended approach is to:",
    choices: [
      { id: "a", text: "Ignore astigmatism and read as normal" },
      { id: "b", text: "Subtract a fixed 3 mmHg from every reading" },
      {
        id: "c",
        text: "Rotate prism appropriately (commonly about 43 deg) or average principal meridians",
      },
      { id: "d", text: "Use only non-contact tonometry" },
      { id: "e", text: "Increase fluorescein until rings overlap" },
    ],
    correctId: "c",
  },
  {
    id: "a5",
    prompt:
      "Which statement about fluorescein effect on mire appearance is correct?",
    choices: [
      { id: "a", text: "Excess fluorescein makes mires thinner" },
      { id: "b", text: "Deficiency makes mires thicker and broader" },
      {
        id: "c",
        text: "Excess gives thicker mires; deficiency gives thinner mires",
      },
      { id: "d", text: "Fluorescein changes colour only, not interpretation" },
      { id: "e", text: "Mire width is unrelated to fluorescein amount" },
    ],
    correctId: "c",
  },
  {
    id: "a6",
    prompt: "When lifting lids for a difficult view, safest technique is to:",
    choices: [
      { id: "a", text: "Press directly on the superior globe" },
      { id: "b", text: "Ask the patient to squeeze eyelids harder" },
      {
        id: "c",
        text: "Support lids/lashes against orbital rim and avoid globe pressure",
      },
      { id: "d", text: "Use no anaesthetic to preserve reflexes" },
      { id: "e", text: "Keep moving the prism while adjusting lids" },
    ],
    correctId: "c",
  },
  {
    id: "a7",
    prompt:
      "Which scenario is a caution for contact applanation with a Goldmann prism?",
    choices: [
      { id: "a", text: "Active corneal abrasion or infectious keratitis" },
      { id: "b", text: "Stable pseudophakia" },
      { id: "c", text: "Mild hyperopia" },
      { id: "d", text: "Physiological anisocoria" },
      { id: "e", text: "History of presbyopia" },
    ],
    correctId: "a",
  },
  {
    id: "a8",
    prompt:
      "If repeated Goldmann readings vary by more than about 4 mmHg, best next step is to:",
    choices: [
      { id: "a", text: "Record only the lowest value" },
      { id: "b", text: "Average all values regardless of quality" },
      {
        id: "c",
        text: "Re-check technique and ocular surface, then repeat carefully",
      },
      { id: "d", text: "Stop measurement and accept first reading" },
      { id: "e", text: "Increase fluorescein and read immediately" },
    ],
    correctId: "c",
  },
  {
    id: "p8",
    prompt: "Goldmann intraocular pressure is recorded in:",
    choices: [
      { id: "a", text: "Millimetres of mercury (mmHg)" },
      { id: "b", text: "Dioptres" },
      { id: "c", text: "Millimetres of corneal diameter" },
      { id: "d", text: "Degrees of prism rotation" },
    ],
    correctId: "a",
  },
  {
    id: "p9",
    prompt: "A reading taken while the patient is squeezing should usually be:",
    choices: [
      { id: "a", text: "Repeated after the patient relaxes" },
      { id: "b", text: "Recorded as the lowest possible value" },
      { id: "c", text: "Accepted without comment" },
      { id: "d", text: "Corrected by adding a fixed amount" },
    ],
    correctId: "a",
  },
  {
    id: "p10",
    prompt: "A training score should be understood as:",
    choices: [
      { id: "a", text: "Practice feedback" },
      { id: "b", text: "A patient diagnosis" },
      { id: "c", text: "A calibrated pressure measurement" },
      { id: "d", text: "A treatment decision" },
    ],
    correctId: "a",
  },
  {
    id: "i8",
    prompt:
      "Before judging horizontal mire overlap, a large vertical offset should be:",
    choices: [
      { id: "a", text: "Corrected" },
      { id: "b", text: "Ignored" },
      { id: "c", text: "Made larger" },
      { id: "d", text: "Recorded as a pressure value" },
    ],
    correctId: "a",
  },
  {
    id: "i9",
    prompt:
      "Broken or irregular fluorescein semicircles most strongly suggest:",
    choices: [
      { id: "a", text: "An unstable tear film or irregular corneal surface" },
      { id: "b", text: "A perfectly aligned prism" },
      { id: "c", text: "A definitive low IOP" },
      { id: "d", text: "An exact endpoint" },
    ],
    correctId: "a",
  },
  {
    id: "i10",
    prompt:
      "When repeated Goldmann readings are inconsistent, the most useful response is to:",
    choices: [
      {
        id: "a",
        text: "Review alignment, tear film and lid pressure, then repeat",
      },
      { id: "b", text: "Keep only the most favourable value" },
      { id: "c", text: "Average every value regardless of quality" },
      { id: "d", text: "Skip the endpoint check" },
    ],
    correctId: "a",
  },
  {
    id: "a9",
    prompt:
      "Why must a good simulator result not be treated as a patient measurement?",
    choices: [
      {
        id: "a",
        text: "The trainer does not include calibration, ocular surface and patient factors",
      },
      { id: "b", text: "The mires are always perfectly aligned" },
      { id: "c", text: "The pressure scale is a prescription scale" },
      { id: "d", text: "The Cup code is a clinical identifier" },
      { id: "e", text: "The timer changes corneal thickness" },
    ],
    correctId: "a",
  },
  {
    id: "a10",
    prompt: "Which sequence best supports reliable Goldmann applanation?",
    choices: [
      {
        id: "a",
        text: "Centre, correct vertical offset, judge overlap, then record",
      },
      { id: "b", text: "Confirm first, then move the mires" },
      { id: "c", text: "Ignore centring and use the timer alone" },
      { id: "d", text: "Maximise overlap regardless of endpoint" },
      { id: "e", text: "Use only the first visible ring position" },
    ],
    correctId: "a",
  },
];

const TOPIC_METADATA = {
  principle: {
    explanation:
      "Goldmann applanation estimates IOP from the force needed to flatten a 3.06 mm corneal area, where tear-film and corneal forces approximately balance.",
    source: "haag-streit-at900-2025",
  },
  setup: {
    explanation:
      "Goldmann applanation uses an anaesthetised central cornea, fluorescein in the tear film and a correctly aligned measuring prism.",
    source: "haag-streit-at900-2025",
  },
  fluorescein: {
    explanation:
      "Wide or narrow fluorescein bands make the endpoint unreliable. Correct excess fluid or drying before repeating; let the patient blink when the tear film has dried.",
    source: "haag-streit-at900-2025",
  },
  endpoint: {
    explanation:
      "At the Goldmann endpoint the inner edges of the fluorescein semicircles just touch, judged after the mires are centred and vertically aligned.",
    source: "haag-streit-at900-2025",
  },
  lids: {
    explanation:
      "Squeezing or pressure on the globe can raise the measured IOP. Support the lids without pressing on the eye and repeat a compromised reading.",
    source: "egs-gat-guidance-2017",
  },
  recording: {
    explanation:
      "Intraocular pressure is recorded in millimetres of mercury. A simulator display or training score is not a patient measurement.",
    source: "mires-training-scope-v1",
  },
  scope: {
    explanation:
      "The simulator provides practice feedback only. It does not include the patient, calibration and ocular-surface factors needed for a clinical measurement.",
    source: "mires-training-scope-v1",
  },
  surface: {
    explanation:
      "An unstable tear film, corneal surface disease or scarring can break or distort the fluorescein semicircles and make the endpoint unreliable.",
    source: "egs-gat-guidance-2017",
  },
  repeat: {
    explanation:
      "Inconsistent readings need a technique and surface check followed by careful repeat measurements rather than selective or uncritical averaging.",
    source: "egs-gat-guidance-2017",
  },
  hygiene: {
    explanation:
      "The measuring prism must be disinfected between patients in accordance with the manufacturer and local infection-control procedure.",
    source: "haag-streit-at900-2025",
  },
  cornea: {
    explanation:
      "Corneal thickness and biomechanics affect Goldmann readings. Thick corneas tend to read higher while myopic corneal refractive surgery often biases readings lower.",
    source: "egs-gat-guidance-2017",
  },
  astigmatism: {
    explanation:
      "Marked regular astigmatism changes the applanation geometry, so prism orientation or averaged principal-meridian readings may be required.",
    source: "haag-streit-at900-2025",
  },
  contraindications: {
    explanation:
      "Active corneal epithelial injury or infection is a reason to avoid or defer contact applanation and use an appropriate local alternative.",
    source: "haag-streit-at900-2025",
  },
};

const TOPICS_BY_ID = {
  p1: "principle",
  p2: "principle",
  p3: "setup",
  p4: "fluorescein",
  p5: "fluorescein",
  p6: "endpoint",
  p7: "lids",
  p8: "recording",
  p9: "lids",
  p10: "scope",
  i1: "endpoint",
  i2: "setup",
  i3: "lids",
  i4: "surface",
  i5: "repeat",
  i6: "setup",
  i7: "hygiene",
  i8: "endpoint",
  i9: "surface",
  i10: "repeat",
  a1: "principle",
  a2: "cornea",
  a3: "cornea",
  a4: "astigmatism",
  a5: "fluorescein",
  a6: "lids",
  a7: "contraindications",
  a8: "repeat",
  a9: "scope",
  a10: "endpoint",
};

export const QUESTION_BANK = RAW_QUESTION_BANK.map((question) => {
  const topic = TOPICS_BY_ID[question.id];
  const metadata = TOPIC_METADATA[topic];
  return {
    ...question,
    topic,
    ...metadata,
    reviewStatus: MCQ_SOURCE_REFERENCES[metadata.source].status,
  };
});
