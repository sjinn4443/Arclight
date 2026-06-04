export const MCQ_TIERS = [
  {
    name: "Primary",
    questionCount: 5,
    optionCount: 4,
    passRatio: 0.7,
    timeLimitSeconds: 0,
    questionIds: ["p1", "p2", "p3", "p4", "p5", "p6", "p7"],
  },
  {
    name: "Intermediate",
    questionCount: 6,
    optionCount: 4,
    passRatio: 0.75,
    timeLimitSeconds: 0,
    questionIds: ["i1", "i2", "i3", "i4", "i5", "i6", "i7"],
  },
  {
    name: "Advanced",
    questionCount: 7,
    optionCount: 5,
    passRatio: 0.8,
    timeLimitSeconds: 150,
    questionIds: ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8"],
  },
];

export const QUESTION_BANK = [
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
    prompt: "Too much fluorescein usually causes:",
    choices: [
      { id: "a", text: "Thin, faint mires and under-reading risk" },
      { id: "b", text: "No change to mire appearance" },
      { id: "c", text: "Thick bright mires and possible over-reading" },
      { id: "d", text: "Immediate corneal oedema" },
    ],
    correctId: "c",
  },
  {
    id: "p5",
    prompt: "Too little fluorescein usually causes:",
    choices: [
      { id: "a", text: "Thin mires with possible under-reading" },
      { id: "b", text: "Thick mires with over-reading only" },
      { id: "c", text: "No need for anaesthetic" },
      { id: "d", text: "False high readings in every case" },
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
];
