export const DEFAULT_BASE_REFLEX_COLOR = {
  r: Math.round(218 * 0.7),
  g: Math.round(58 * 0.7),
  b: Math.round(0 * 0.7),
};

export const DEFAULT_REFRACTION_VALUE = "zero";

export const DEFAULT_RETINOSCOPY_STATE = {
  retStreakOffset: 0,
  retStreakRotation: 0,
  currentRefraction: DEFAULT_REFRACTION_VALUE,
  cylinderAxisDeg: null, // random axis for cylinder cases
  cataractLevel: 0, // 0 to 100
  nystagmusLevel: 0, // 0 to 100
  activeRetEye: "left", // examiner view: screen-left = RE, screen-right = LE
};

export const REFRACTION_GROUPS = [
  {
    label: "Sphere",
    category: "sphere",
    options: [
      { value: "high-minus", label: "High minus (---)" },
      { value: "minus", label: "Minus (-)" },
      { value: "zero", label: "Neutral (0)" },
      { value: "plus", label: "Plus (+)" },
      { value: "high-plus", label: "High plus (+++)" },
    ],
  },
  {
    label: "Regular astigmatism",
    category: "astig",
    options: [
      { value: "low-cylinder", label: "Low astigmatism (Cyl)" },
      { value: "high-cylinder", label: "High astigmatism (Cyl++)" },
    ],
  },
  {
    label: "Irregular reflex",
    category: "irregular",
    options: [
      { value: "small-scissors", label: "Small scissors reflex" },
      { value: "keratoconus", label: "Keratoconus (large scissors reflex)" },
      { value: "corneal-scar", label: "Corneal scar (large diffuse reflex)" },
      { value: "poor-tear-film", label: "Poor tear film" },
    ],
  },
  {
    label: "Other conditions",
    category: "other",
    options: [
      { value: "acg", label: "ACG (vertical oval pupil)" },
      { value: "aniridia", label: "Aniridia" },
      { value: "anisometropia", label: "Anisometropia (RE+, LE-)" },
      { value: "aphakia", label: "Aphakia" },
      { value: "iris-transillumination", label: "Iris transillumination" },
      { value: "nasal-coloboma", label: "Nasal coloboma" },
      { value: "small-pupils", label: "Small pupils" },
    ],
  },
  {
    label: "Media and fundus",
    category: "media-fundus",
    options: [
      { value: "small-cortical-cataract", label: "Small cortical cataract" },
      { value: "big-cortical-cataract", label: "Big cortical cataract" },
      {
        value: "central-sub-cortical-cataract",
        label: "Posterior subcapsular cataract",
      },
      { value: "posterior-pole-cataract", label: "Posterior pole cataract" },
      { value: "dense-cataract", label: "Dense cataract" },
      { value: "floaters", label: "Vitreous floaters" },
      { value: "vitreous-haemorrhage", label: "Vitreous haemorrhage" },
      { value: "leucocoria", label: "Leucocoria" },
      {
        value: "partial-retinal-detachment",
        label: "Partial retinal detachment",
      },
      {
        value: "posterior-capsular-thickening",
        label: "Posterior capsular thickening (IOL)",
      },
    ],
  },
];

export const REFRACTION_OPTIONS = REFRACTION_GROUPS.flatMap(
  ({ category, options }) => options.map((option) => ({ ...option, category })),
);

export const TEST_REFRACTION_OPTIONS = REFRACTION_OPTIONS.filter(
  ({ value }) => value !== "anisometropia",
);

export const REFRACTION_VALUE_SET = new Set(
  REFRACTION_OPTIONS.map(({ value }) => value),
);

export const CYLINDER_REFRACTION_VALUES = new Set([
  "low-cylinder",
  "high-cylinder",
]);

export const AXIS_DEPENDENT_REFRACTION_VALUES = new Set([
  ...CYLINDER_REFRACTION_VALUES,
  "small-scissors",
  "keratoconus",
  "corneal-scar",
]);

export const MCQ_LEVEL_META = {
  primary: { title: "Primary", passMark: 3, questionCount: 5 },
  intermediate: { title: "Intermediate", passMark: 4, questionCount: 6 },
  advanced: { title: "Advanced", passMark: 4, questionCount: 8 },
};

export const TEST_COUNTDOWN_SEQUENCE = [20, 15, 10, 8, 6];

export const MCQ_BANK = {
  primary: [
    {
      question:
        'In plane mirror retinoscopy, a "with" reflex is neutralised with:',
      options: [
        "Plus or less minus",
        "Minus or less plus",
        "Axis change",
        "No lens change",
      ],
      answer: 0,
    },
    {
      question:
        'In plane mirror retinoscopy, an "against" reflex is neutralised with:',
      options: [
        "Plus or less minus",
        "Minus or less plus",
        "Axis change",
        "No lens change",
      ],
      answer: 1,
    },
    {
      question: "Neutrality at the working distance means:",
      options: [
        "No directional reflex movement",
        "The reflex still moves with the streak",
        "The reflex still moves against the streak",
        "No red reflex is visible",
      ],
      answer: 0,
    },
    {
      question: "Sweeping the streak mainly changes the:",
      options: [
        "Streak position",
        "Streak angle",
        "Working distance",
        "Pupil size",
      ],
      answer: 0,
    },
    {
      question: "Rotating the streak mainly changes the:",
      options: [
        "Streak angle",
        "Streak position",
        "Working distance",
        "Pupil size",
      ],
      answer: 0,
    },
    {
      question: "At 50 cm, the working distance allowance is:",
      options: ["0.50 D", "1.00 D", "1.50 D", "2.00 D"],
      answer: 3,
    },
    {
      question: "Why should working distance stay steady?",
      options: [
        "It changes the working distance allowance",
        "It sets the streak angle",
        "It keeps the reflex centred on the pupil",
        "It fixes the pupil size",
      ],
      answer: 0,
    },
    {
      question: "As neutrality is approached, the reflex is usually:",
      options: [
        "Brighter, broader and faster",
        "Darker, narrower and slower",
        "Brighter, narrower and slower",
        "Dimmer, broader and slower",
      ],
      answer: 0,
    },
  ],
  intermediate: [
    {
      question: "At 67 cm, you convert gross retinoscopy to net by:",
      options: [
        "Adding 1.50 D",
        "Subtracting 1.50 D",
        "Adding 2.00 D",
        "Subtracting 2.00 D",
      ],
      answer: 1,
    },
    {
      question: "As plus lenses are added, neutrality lies:",
      options: [
        'At the first clearly "against" lens',
        'Between the last clearly "with" lens and the first clearly "against" lens',
        'At the last clearly "with" lens',
        "At plano (0.00 D)",
      ],
      answer: 1,
    },
    {
      question: "Why rotate the streak during retinoscopy?",
      options: [
        "To align with principal meridians",
        "To keep the beam in the middle of the pupil",
        "To change the working distance allowance",
        "To make the pupil larger",
      ],
      answer: 0,
    },
    {
      question:
        "One meridian neutralises at +2.00 D and the perpendicular meridian at +0.50 D. Cylinder power is:",
      options: ["0.50 D", "1.00 D", "1.50 D", "2.50 D"],
      answer: 2,
    },
    {
      question: "Which endpoint method is most reliable in practice?",
      options: [
        "Stop at the first bright reflex",
        "Bracket neutrality with small lens steps such as +/- 0.25 D",
        "Use whole-dioptre steps only",
        "Rely on brightness alone",
      ],
      answer: 1,
    },
    {
      question:
        "If the pupil is too small to judge the reflex well, the best next step is:",
      options: [
        "Move farther back and accept a dimmer view",
        "Improve dilatation conditions or use pharmacological dilatation when appropriate",
        "Judge neutrality from brightness alone",
        "Rotate to 0 degrees and continue",
      ],
      answer: 1,
    },
    {
      question:
        "At 67 cm, gross neutralities are +1.75 D @ 90 and +0.25 D @ 180. Net minus-cylinder form is:",
      options: [
        "+0.25 / -1.50 x 90",
        "+0.25 / -1.50 x 180",
        "-1.25 / +1.50 x 90",
        "+1.75 / -1.50 x 90",
      ],
      answer: 0,
    },
    {
      question:
        "A practical sign that the streak is not aligned with a principal meridian is:",
      options: [
        "Break or skew of the reflex relative to the streak",
        "A brighter reflex without any change in axis",
        "Equal speed in every meridian",
        "A wider pupil than expected",
      ],
      answer: 0,
    },
  ],
  advanced: [
    {
      question:
        "Working distance is 50 cm. Gross neutrality in one meridian is +3.00 D. Net meridional power is:",
      options: ["+3.00 D", "+2.00 D", "+1.00 D", "-1.00 D"],
      answer: 2,
    },
    {
      question:
        "At 67 cm, gross meridional powers are +2.25 D @ 90 and +0.75 D @ 180. Net refraction in minus-cylinder form is:",
      options: [
        "+0.75 / -1.50 x 90",
        "+0.75 / -1.50 x 180",
        "-0.75 / -1.50 x 90",
        "+0.75 / -0.75 x 90",
      ],
      answer: 0,
    },
    {
      question:
        "At 67 cm, gross meridional powers are +1.00 D @ 180 and -0.50 D @ 90. Net refraction in minus-cylinder form is:",
      options: [
        "-0.50 / -1.50 x 180",
        "-2.00 / -1.50 x 90",
        "-0.50 / +1.50 x 180",
        "+0.50 / -1.50 x 90",
      ],
      answer: 0,
    },
    {
      question:
        "Axis refinement is most accurate when the streak is oriented so that the reflex:",
      options: [
        "Appears as the narrowest, least broken band",
        "Looks circular and diffuse",
        "Shows the greatest shimmer",
        "Becomes equally broad at every axis",
      ],
      answer: 0,
    },
    {
      question: "For high astigmatism, the best sequence is:",
      options: [
        "Estimate sphere first then refine axis later",
        "Neutralise one meridian then infer the second",
        "Neutralise each principal meridian, apply working distance correction and convert to sphere and cylinder form",
        "Apply working distance correction before neutralising",
      ],
      answer: 2,
    },
    {
      question: "Partial retinal detachment is most likely to appear as:",
      options: [
        "A fixed dark sector with reflex confined to the remaining pupil",
        "A uniformly bright reflex in all meridians",
        "A pure central dark spot only",
        "A scissoring reflex that changes axis",
      ],
      answer: 0,
    },
    {
      question: "Which finding most strongly suggests irregular astigmatism?",
      options: [
        "Scissoring reflex",
        "Equal neutrality in both meridians",
        "A broad bright reflex near neutrality",
        "A stable with movement in one meridian only",
      ],
      answer: 0,
    },
    {
      question:
        "In posterior subcapsular cataract, the reflex is most likely to appear as:",
      options: [
        "A moving reflex with a dull central defect",
        "A uniformly dull reflex with no central change",
        "A pure scissoring reflex",
        "A uniformly bright reflex",
      ],
      answer: 0,
    },
    {
      question: "Posterior pole cataract is most likely to appear as:",
      options: [
        "A very dull reflex with a dense irregular central defect",
        "A uniformly bright reflex in every meridian",
        "A pure scissoring reflex",
        "A mild diffuse haze with no central opacity",
      ],
      answer: 0,
    },
    {
      question: "Aphakia is most likely to show:",
      options: [
        "Slow with movement requiring large plus to neutralise",
        "Against movement requiring large minus to neutralise",
        "Immediate neutrality with no lens",
        "A fixed scissoring reflex",
      ],
      answer: 0,
    },
  ],
};
