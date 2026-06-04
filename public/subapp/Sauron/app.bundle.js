"use strict";
(() => {
  // src/color.js
  function parseRGB(rgbStr) {
    const result = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(rgbStr);
    if (!result) {
      return { r: 0, g: 0, b: 0 };
    }
    return {
      r: parseInt(result[1], 10),
      g: parseInt(result[2], 10),
      b: parseInt(result[3], 10),
    };
  }
  function brightenColor(color, factor) {
    return {
      r: Math.min(Math.round(color.r * factor), 255),
      g: Math.min(Math.round(color.g * factor), 255),
      b: Math.min(Math.round(color.b * factor), 255),
    };
  }
  function getReflexColor(value) {
    const colorStops = [
      {
        value: 0,
        color: {
          r: Math.round(173 * 0.7),
          g: Math.round(216 * 0.7),
          b: Math.round(230 * 0.7),
        },
      },
      {
        value: 33,
        color: {
          r: Math.round(255 * 0.7),
          g: Math.round(220 * 0.7),
          b: Math.round(0 * 0.7),
        },
      },
      {
        value: 66,
        color: {
          r: Math.round(218 * 0.7),
          g: Math.round(58 * 0.7),
          b: Math.round(0 * 0.7),
        },
      },
      {
        value: 100,
        color: {
          r: Math.round(255 * 0.7),
          g: Math.round(0 * 0.7),
          b: Math.round(0 * 0.7),
        },
      },
    ];
    let lowerStop;
    let upperStop;
    for (let i = 0; i < colorStops.length - 1; i += 1) {
      if (value >= colorStops[i].value && value <= colorStops[i + 1].value) {
        lowerStop = colorStops[i];
        upperStop = colorStops[i + 1];
        break;
      }
    }
    if (!lowerStop || !upperStop) {
      return "rgb(255, 0, 0)";
    }
    const factor =
      (value - lowerStop.value) / (upperStop.value - lowerStop.value);
    const r = Math.round(
      lowerStop.color.r + (upperStop.color.r - lowerStop.color.r) * factor,
    );
    const g = Math.round(
      lowerStop.color.g + (upperStop.color.g - lowerStop.color.g) * factor,
    );
    const b = Math.round(
      lowerStop.color.b + (upperStop.color.b - lowerStop.color.b) * factor,
    );
    return `rgb(${r}, ${g}, ${b})`;
  }

  // src/constants.js?v=20260506-2
  var DEFAULT_BASE_REFLEX_COLOR = {
    r: Math.round(218 * 0.7),
    g: Math.round(58 * 0.7),
    b: Math.round(0 * 0.7),
  };
  var DEFAULT_REFRACTION_VALUE = "zero";
  var REFRACTION_GROUPS = [
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
  var REFRACTION_OPTIONS = REFRACTION_GROUPS.flatMap(({ category, options }) =>
    options.map((option) => ({ ...option, category })),
  );
  var TEST_REFRACTION_OPTIONS = REFRACTION_OPTIONS.filter(
    ({ value }) => value !== "anisometropia",
  );
  var REFRACTION_VALUE_SET = new Set(
    REFRACTION_OPTIONS.map(({ value }) => value),
  );
  var CYLINDER_REFRACTION_VALUES = /* @__PURE__ */ new Set([
    "low-cylinder",
    "high-cylinder",
  ]);
  var AXIS_DEPENDENT_REFRACTION_VALUES = /* @__PURE__ */ new Set([
    ...CYLINDER_REFRACTION_VALUES,
    "small-scissors",
    "keratoconus",
    "corneal-scar",
  ]);

  // src/constants.js
  var DEFAULT_BASE_REFLEX_COLOR2 = {
    r: Math.round(218 * 0.7),
    g: Math.round(58 * 0.7),
    b: Math.round(0 * 0.7),
  };
  var DEFAULT_REFRACTION_VALUE2 = "zero";
  var DEFAULT_RETINOSCOPY_STATE = {
    retStreakOffset: 0,
    retStreakRotation: 0,
    currentRefraction: DEFAULT_REFRACTION_VALUE2,
    cylinderAxisDeg: null,
    // random axis for cylinder cases
    cataractLevel: 0,
    // 0 to 100
    nystagmusLevel: 0,
    // 0 to 100
    activeRetEye: "left",
    // examiner view: screen-left = RE, screen-right = LE
  };
  var REFRACTION_GROUPS2 = [
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
  var REFRACTION_OPTIONS2 = REFRACTION_GROUPS2.flatMap(
    ({ category, options }) =>
      options.map((option) => ({ ...option, category })),
  );
  var TEST_REFRACTION_OPTIONS2 = REFRACTION_OPTIONS2.filter(
    ({ value }) => value !== "anisometropia",
  );
  var REFRACTION_VALUE_SET2 = new Set(
    REFRACTION_OPTIONS2.map(({ value }) => value),
  );
  var CYLINDER_REFRACTION_VALUES2 = /* @__PURE__ */ new Set([
    "low-cylinder",
    "high-cylinder",
  ]);
  var AXIS_DEPENDENT_REFRACTION_VALUES2 = /* @__PURE__ */ new Set([
    ...CYLINDER_REFRACTION_VALUES2,
    "small-scissors",
    "keratoconus",
    "corneal-scar",
  ]);
  var MCQ_LEVEL_META = {
    primary: { title: "Primary", passMark: 3, questionCount: 5 },
    intermediate: { title: "Intermediate", passMark: 4, questionCount: 6 },
    advanced: { title: "Advanced", passMark: 4, questionCount: 8 },
  };
  var TEST_COUNTDOWN_SEQUENCE = [20, 15, 10, 8, 6];
  var MCQ_BANK = {
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

  // src/case-catalog.js?v=20260507-1
  var LEVEL_META = {
    primary: {
      label: "Primary cases",
      shortLabel: "Primary",
      marker: "P",
      order: 1,
    },
    intermediate: {
      label: "Intermediate cases",
      shortLabel: "Intermediate",
      marker: "I",
      order: 2,
    },
    advanced: {
      label: "Advanced cases",
      shortLabel: "Advanced",
      marker: "A",
      order: 3,
    },
  };
  var CASE_LEVEL_BY_VALUE = {
    "high-minus": "primary",
    minus: "primary",
    zero: "primary",
    plus: "primary",
    "high-plus": "primary",
    "low-cylinder": "primary",
    "high-cylinder": "intermediate",
    anisometropia: "intermediate",
    "small-pupils": "intermediate",
    "small-scissors": "intermediate",
    "poor-tear-film": "intermediate",
    "small-cortical-cataract": "intermediate",
    "big-cortical-cataract": "intermediate",
    "central-sub-cortical-cataract": "intermediate",
    keratoconus: "advanced",
    "corneal-scar": "advanced",
    acg: "advanced",
    aniridia: "advanced",
    aphakia: "advanced",
    "iris-transillumination": "advanced",
    "nasal-coloboma": "advanced",
    "posterior-pole-cataract": "advanced",
    "dense-cataract": "advanced",
    floaters: "advanced",
    "vitreous-haemorrhage": "advanced",
    leucocoria: "advanced",
    "partial-retinal-detachment": "advanced",
    "posterior-capsular-thickening": "advanced",
  };
  var CASE_SUMMARY_BY_VALUE = {
    "high-minus": "Fast against movement with a narrow reflex.",
    minus: "Against movement before neutralisation.",
    zero: "No directional movement at neutrality.",
    plus: "With movement before neutralisation.",
    "high-plus": "Slow broad with movement requiring more plus.",
    "low-cylinder": "Two meridians, mild axis-dependent change.",
    "high-cylinder": "Stronger meridional difference and axis finding.",
    anisometropia: "Different reflex behaviour between right and left eyes.",
    "small-pupils": "Reduced aperture makes the reflex harder to judge.",
    "small-scissors": "Subtle split reflex with irregular movement.",
    "poor-tear-film": "Unstable shimmering reflex surface.",
    "small-cortical-cataract":
      "Peripheral cortical opacity crossing the reflex.",
    "big-cortical-cataract": "More extensive cortical spokes.",
    "central-sub-cortical-cataract":
      "Central posterior opacity dulling the reflex.",
    keratoconus: "Large scissors reflex with marked irregularity.",
    "corneal-scar": "Diffuse corneal haze disrupting the streak.",
    acg: "Oval pupil geometry with abnormal reflex behaviour.",
    aniridia: "Large abnormal aperture with unstable reflex detail.",
    aphakia: "High plus behaviour with altered pupil optics.",
    "iris-transillumination":
      "Peripheral iris light leak alongside the reflex.",
    "nasal-coloboma": "Notched pupil aperture affecting the reflex edge.",
    "posterior-pole-cataract": "Dense central posterior pole defect.",
    "dense-cataract": "Very dull reflex through dense media opacity.",
    floaters: "Mobile vitreous shadows over the reflex.",
    "vitreous-haemorrhage": "Dark vitreous opacity reducing the view.",
    leucocoria: "White reflex appearance rather than normal red-orange.",
    "partial-retinal-detachment":
      "Fixed dark sector with remaining reflex visible.",
    "posterior-capsular-thickening":
      "IOL/capsule haze reducing reflex clarity.",
  };
  var BABY_CASE_VALUES = /* @__PURE__ */ new Set([
    "zero",
    "plus",
    "high-plus",
    "minus",
    "low-cylinder",
    "anisometropia",
    "small-pupils",
    "central-sub-cortical-cataract",
    "dense-cataract",
    "leucocoria",
  ]);
  var CASE_ORDER = [
    "zero",
    "minus",
    "plus",
    "high-minus",
    "high-plus",
    "low-cylinder",
    "high-cylinder",
    "anisometropia",
    "small-pupils",
    "small-scissors",
    "poor-tear-film",
    "small-cortical-cataract",
    "big-cortical-cataract",
    "central-sub-cortical-cataract",
    "keratoconus",
    "corneal-scar",
    "acg",
    "aniridia",
    "aphakia",
    "iris-transillumination",
    "nasal-coloboma",
    "posterior-pole-cataract",
    "dense-cataract",
    "floaters",
    "vitreous-haemorrhage",
    "leucocoria",
    "partial-retinal-detachment",
    "posterior-capsular-thickening",
  ];
  var CASE_ORDER_BY_VALUE = new Map(
    CASE_ORDER.map((value, index) => [value, index]),
  );
  var RETINOSCOPY_CASES = REFRACTION_OPTIONS2.map((option) => {
    var _a;
    const level = CASE_LEVEL_BY_VALUE[option.value] || "advanced";
    return {
      ...option,
      order:
        (_a = CASE_ORDER_BY_VALUE.get(option.value)) != null
          ? _a
          : Number.MAX_SAFE_INTEGER,
      level,
      levelLabel: LEVEL_META[level].shortLabel,
      levelMarker: LEVEL_META[level].marker,
      summary: CASE_SUMMARY_BY_VALUE[option.value] || option.label,
      thumbnailSrc: `assets/case-thumbnails/${option.value}.webp?v=20260507-fellow-corneal`,
      isBabyCase: BABY_CASE_VALUES.has(option.value),
    };
  })
    .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
    .map((caseItem, index) => ({
      ...caseItem,
      index: index + 1,
    }));
  var CASE_LEVELS = Object.entries(LEVEL_META)
    .map(([value, meta]) => ({ value, ...meta }))
    .sort((a, b) => a.order - b.order);
  function getCaseByValue(value) {
    return (
      RETINOSCOPY_CASES.find((caseItem) => caseItem.value === value) || null
    );
  }
  function getCaseList({ babyOnly = false } = {}) {
    if (!babyOnly) {
      return RETINOSCOPY_CASES;
    }
    return RETINOSCOPY_CASES.filter((caseItem) => caseItem.isBabyCase);
  }
  function getFallbackBabyCase() {
    return getCaseByValue("zero") || RETINOSCOPY_CASES[0] || null;
  }

  // src/dom.js?v=20260506-4
  function getDomRefs() {
    return {
      body: document.body,
      infoIcon: document.getElementById("info-icon"),
      infoModal: document.getElementById("infoModal"),
      infoModalContent: document.getElementById("infoModalContent"),
      closeModal: document.getElementById("closeModal"),
      burgerIcon: document.getElementById("burger-icon"),
      sideMenu: document.getElementById("sideMenu"),
      testModeButton: document.getElementById("test-mode-button"),
      mcqModal: document.getElementById("mcqModal"),
      mcqModalContent: document.getElementById("mcqModalContent"),
      closeMcqModalButton: document.getElementById("closeMcqModal"),
      mcqTitle: document.getElementById("mcqTitle"),
      mcqIntro: document.getElementById("mcqIntro"),
      mcqContainer: document.getElementById("mcqContainer"),
      submitMcqButton: document.getElementById("submitMcqButton"),
      mcqResult: document.getElementById("mcqResult"),
      mcqLevelButtons: Array.from(
        document.querySelectorAll(".mcq-level-button"),
      ),
      testStatusBanner: document.getElementById("test-status-banner"),
      testCountdownValue: document.getElementById("test-countdown-value"),
      testAnswerText: document.getElementById("test-answer-text"),
      testNextButton: document.getElementById("test-next-button"),
      reflexColorSlider: document.getElementById("reflex-color-slider"),
      gazeToggle: document.getElementById("gaze-toggle"),
      dilatedToggle: document.getElementById("dilated-toggle"),
      babyToggle: document.getElementById("baby-toggle"),
      manualEyeMoveToggle: document.getElementById("manual-eye-move-toggle"),
      caseModal: document.getElementById("caseModal"),
      caseModalContent: document.getElementById("caseModalContent"),
      closeCaseModalButton: document.getElementById("closeCaseModal"),
      caseSectionsContainer: document.getElementById("caseSectionsContainer"),
      caseSimilarTool: document.getElementById("case-similar-tool"),
      caseSimilarList: document.getElementById("case-similar-list"),
      casePicker: document.getElementById("case-picker"),
      casePreviousButton: document.getElementById("case-previous-button"),
      caseNextButton: document.getElementById("case-next-button"),
      caseTriggerButton: document.getElementById("case-trigger-button"),
      caseTriggerLabel: document.getElementById("case-trigger-label"),
      caseTriggerLevel: document.getElementById("case-trigger-level"),
      caseMaskLabel: document.getElementById("case-mask-label"),
      refractionShell: document.getElementById("refraction-shell"),
      refractionMaskLabel: document.getElementById("refraction-mask-label"),
      refractionStateSelect: document.getElementById("refraction-state"),
      retinoscopySlider: document.getElementById("retinoscopy-slider"),
      retinoscopyRotationSlider: document.getElementById(
        "retinoscopy-rotation",
      ),
      cataractSlider: document.getElementById("cataract-slider"),
      nystagmusSlider: document.getElementById("nystagmus-slider"),
      retEyeButtons: Array.from(document.querySelectorAll(".ret-eye-button")),
      pupilSizeSliders: Array.from(
        document.querySelectorAll(".slider[data-eye]"),
      ),
      eyelidSliders: Array.from(
        document.querySelectorAll(".vertical-eye-slider"),
      ),
      eyesWrapper: document.querySelector(".eyes-wrapper"),
      eyesContainer: document.querySelector(".eyes-container"),
      movementStatusLabel: document.getElementById("movement-status-label"),
      eyes: Array.from(document.querySelectorAll(".eye")),
      leftEye: document.getElementById("left-eye"),
      rightEye: document.getElementById("right-eye"),
      irises: Array.from(document.querySelectorAll(".iris")),
      retReflexElements: Array.from(document.querySelectorAll(".ret-reflex")),
      retStreak: document.getElementById("ret-streak"),
      retStreakRotateHandle: document.getElementById(
        "ret-streak-rotate-handle",
      ),
      retStreakSweepHandle: document.getElementById("ret-streak-sweep-handle"),
    };
  }

  // src/motion.js
  function prefersReducedMotion() {
    var _a;
    return Boolean(
      (_a = window.matchMedia) == null
        ? void 0
        : _a.call(window, "(prefers-reduced-motion: reduce)").matches,
    );
  }

  // src/eyes.js?v=20260506-5
  function createEyesController({ state, dom, onEyeGeometryChange }) {
    function applyPupilFill(target, fillValue) {
      if (!target) {
        return;
      }
      const pupil = target.querySelector(".pupil");
      if (pupil) {
        pupil.style.background = fillValue;
      }
      const colobomaExtension = target.querySelector(".coloboma-extension");
      if (colobomaExtension) {
        colobomaExtension.style.background = fillValue;
      }
      const irisTransilluminationPatch = target.querySelector(
        ".iris-transillumination-patch",
      );
      if (irisTransilluminationPatch) {
        irisTransilluminationPatch.style.background = fillValue;
      }
    }
    function applyManualEyeMoveState() {
      dom.irises.forEach((iris) => {
        iris.classList.toggle(
          "is-manual-drag-enabled",
          state.isManualEyeMoveEnabled,
        );
      });
    }
    function getCataractPupilFilter(level) {
      const normalized = Math.max(0, Math.min(100, level)) / 100;
      const brightness = 1 - normalized * 0.72;
      const saturation = 1 - normalized * 0.64;
      const contrast = 1 - normalized * 0.18;
      return `brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)}) contrast(${contrast.toFixed(2)})`;
    }
    function applyCataractToPupils() {
      const filterValue = getCataractPupilFilter(state.cataractLevel);
      dom.irises.forEach((iris) => {
        const pupil = iris.querySelector(".pupil");
        if (pupil) {
          pupil.style.filter = filterValue;
        }
        const colobomaExtension = iris.querySelector(".coloboma-extension");
        if (colobomaExtension) {
          colobomaExtension.style.filter = filterValue;
        }
        const irisTransilluminationPatch = iris.querySelector(
          ".iris-transillumination-patch",
        );
        if (irisTransilluminationPatch) {
          irisTransilluminationPatch.style.filter = filterValue;
        }
      });
    }
    function notifyEyeGeometryChange(includePosition = true) {
      if (typeof onEyeGeometryChange === "function") {
        onEyeGeometryChange({ includePosition });
      }
    }
    function notifyAmbientEyeGeometryChange(
      includePosition = state.nystagmusLevel === 0,
    ) {
      notifyEyeGeometryChange(state.isGazeMode ? false : includePosition);
    }
    function applyGazeFacePose({ x = 0, y = 0, tilt = 0 } = {}) {
      if (!dom.eyesContainer) {
        return;
      }
      dom.eyesContainer.style.setProperty("--gaze-face-x", `${x.toFixed(2)}px`);
      dom.eyesContainer.style.setProperty("--gaze-face-y", `${y.toFixed(2)}px`);
      dom.eyesContainer.style.setProperty(
        "--gaze-face-tilt",
        `${tilt.toFixed(2)}deg`,
      );
    }
    function resetGazeFacePose() {
      applyGazeFacePose();
    }
    function getRestingUpperLidHeight(upperEyelid) {
      return (
        (upperEyelid == null ? void 0 : upperEyelid.dataset.restingHeightPx) ||
        "0px"
      );
    }
    function getActiveUpperLidHeight(upperEyelid) {
      return (
        (upperEyelid == null
          ? void 0
          : upperEyelid.dataset.gazeLidDroopHeightPx) ||
        getRestingUpperLidHeight(upperEyelid)
      );
    }
    function resetTemporaryGazeLids() {
      dom.eyes.forEach((eye) => {
        const upperEyelid = eye.querySelector(".upper-eyelid");
        if (!upperEyelid) {
          return;
        }
        if (upperEyelid.gazeLidDroopTimerId) {
          window.clearTimeout(upperEyelid.gazeLidDroopTimerId);
          upperEyelid.gazeLidDroopTimerId = 0;
        }
        delete upperEyelid.dataset.gazeLidDroopHeightPx;
        if (upperEyelid.dataset.isBlinking !== "true") {
          upperEyelid.style.height = getRestingUpperLidHeight(upperEyelid);
        }
      });
    }
    function resetBlinkLids() {
      dom.eyes.forEach((eye) => {
        const upperEyelid = eye.querySelector(".upper-eyelid");
        const lowerEyelid = eye.querySelector(".lower-eyelid");
        if (upperEyelid == null ? void 0 : upperEyelid.blinkTimerId) {
          window.clearTimeout(upperEyelid.blinkTimerId);
          upperEyelid.blinkTimerId = 0;
        }
        if (lowerEyelid == null ? void 0 : lowerEyelid.blinkTimerId) {
          window.clearTimeout(lowerEyelid.blinkTimerId);
          lowerEyelid.blinkTimerId = 0;
        }
        if (upperEyelid) {
          delete upperEyelid.dataset.isBlinking;
          upperEyelid.style.height = getActiveUpperLidHeight(upperEyelid);
        }
        if (lowerEyelid) {
          lowerEyelid.style.height = "0px";
        }
      });
    }
    function updateIrisTransform(iris) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const totalX =
        (((_a = iris.microOffset) == null ? void 0 : _a.x) || 0) +
        (((_b = iris.backgroundOffset) == null ? void 0 : _b.x) || 0) +
        (((_c = iris.gazeOffset) == null ? void 0 : _c.x) || 0) +
        (((_d = iris.nystagmusOffset) == null ? void 0 : _d.x) || 0);
      const totalY =
        (((_e = iris.microOffset) == null ? void 0 : _e.y) || 0) +
        (((_f = iris.backgroundOffset) == null ? void 0 : _f.y) || 0) +
        (((_g = iris.gazeOffset) == null ? void 0 : _g.y) || 0) +
        (((_h = iris.nystagmusOffset) == null ? void 0 : _h.y) || 0);
      iris.style.transform = `translate(${totalX}px, ${totalY}px)`;
      const eye = iris.closest(".eye");
      if (eye) {
        eye.style.setProperty(
          "--corneal-reflex-micro-x",
          `${(totalX * 0.08).toFixed(2)}px`,
        );
        eye.style.setProperty(
          "--corneal-reflex-micro-y",
          `${(totalY * 0.06).toFixed(2)}px`,
        );
      }
    }
    function dispatchInput2(element) {
      if (!element) {
        return;
      }
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }
    function setPupilSliderValues(values) {
      dom.pupilSizeSliders.forEach((slider, index) => {
        var _a;
        const nextValue = (_a = values[index]) != null ? _a : values[0];
        if (nextValue === void 0) {
          return;
        }
        slider.value = String(nextValue);
        dispatchInput2(slider);
      });
    }
    function clearGazeTimers() {
      if (state.gazeIntervalId) {
        window.clearInterval(state.gazeIntervalId);
        state.gazeIntervalId = 0;
      }
      if (state.gazeReturnTimeoutId) {
        window.clearTimeout(state.gazeReturnTimeoutId);
        state.gazeReturnTimeoutId = 0;
      }
      if (state.gazeShiftTimerId) {
        window.clearTimeout(state.gazeShiftTimerId);
        state.gazeShiftTimerId = 0;
      }
      dom.irises.forEach((iris) => {
        if (iris.gazeSettleTimerId) {
          window.clearTimeout(iris.gazeSettleTimerId);
          iris.gazeSettleTimerId = 0;
        }
        if (iris.gazeStartTimerId) {
          window.clearTimeout(iris.gazeStartTimerId);
          iris.gazeStartTimerId = 0;
        }
      });
    }
    function applyIrisGazePose(
      resolveOffset,
      { overshoot = 0, settleMs = 0, staggerMs = 0 } = {},
    ) {
      dom.irises.forEach((iris, index) => {
        if (iris.isDragging) {
          return;
        }
        if (iris.gazeSettleTimerId) {
          window.clearTimeout(iris.gazeSettleTimerId);
          iris.gazeSettleTimerId = 0;
        }
        if (iris.gazeStartTimerId) {
          window.clearTimeout(iris.gazeStartTimerId);
          iris.gazeStartTimerId = 0;
        }
        const targetOffset = resolveOffset(iris, index);
        const previousOffset = iris.gazeOffset || { x: 0, y: 0 };
        const applyOffset = (offset) => {
          iris.gazeOffset = {
            x: parseFloat(offset.x.toFixed(2)),
            y: parseFloat(offset.y.toFixed(2)),
          };
          updateIrisTransform(iris);
        };
        const startMove = () => {
          if (overshoot > 0 && settleMs > 0) {
            applyOffset({
              x:
                targetOffset.x +
                (targetOffset.x - previousOffset.x) * overshoot,
              y:
                targetOffset.y +
                (targetOffset.y - previousOffset.y) * overshoot,
            });
            notifyAmbientEyeGeometryChange(false);
            iris.gazeSettleTimerId = window.setTimeout(() => {
              applyOffset(targetOffset);
              iris.gazeSettleTimerId = 0;
              notifyAmbientEyeGeometryChange(false);
            }, settleMs);
            return;
          }
          applyOffset(targetOffset);
          notifyAmbientEyeGeometryChange(false);
        };
        const startDelay = index * staggerMs;
        if (startDelay > 0) {
          iris.gazeStartTimerId = window.setTimeout(() => {
            iris.gazeStartTimerId = 0;
            startMove();
          }, startDelay);
        } else {
          startMove();
        }
      });
    }
    function resetGazeOffset() {
      dom.irises.forEach((iris) => {
        iris.gazeOffset = { x: 0, y: 0 };
        updateIrisTransform(iris);
      });
      notifyEyeGeometryChange(false);
    }
    function startGazeShifts() {
      clearGazeTimers();
      if (!state.isGazeMode || prefersReducedMotion()) {
        return;
      }
      let isFirstShift = true;
      const applyRestingGaze = () => {
        const side = Math.random() < 0.5 ? -1 : 1;
        const restingGazeX = parseFloat(
          (side * (2.2 + Math.random() * 2.2)).toFixed(2),
        );
        const restingGazeY = parseFloat((Math.random() * 2.2 - 1.1).toFixed(2));
        applyGazeFacePose({
          x: side * (0.6 + Math.random() * 0.7),
          y: Math.random() * 0.8 - 0.2,
          tilt: side * (0.24 + Math.random() * 0.22),
        });
        applyIrisGazePose(
          () => ({
            x: restingGazeX + (Math.random() * 0.35 - 0.18),
            y: restingGazeY + (Math.random() * 0.25 - 0.13),
          }),
          {
            overshoot: state.isBabyMode ? 0.07 : 0.045,
            settleMs: state.isBabyMode ? 210 : 250,
            staggerMs: state.isBabyMode ? 14 : 10,
          },
        );
      };
      const applyTemporaryGazeLidDroop = (holdDuration, strength = 0.18) => {
        dom.eyes.forEach((eye) => {
          const upperEyelid = eye.querySelector(".upper-eyelid");
          if (!upperEyelid) {
            return;
          }
          if (upperEyelid.gazeLidDroopTimerId) {
            window.clearTimeout(upperEyelid.gazeLidDroopTimerId);
          }
          const restingHeight =
            parseFloat(getRestingUpperLidHeight(upperEyelid)) || 0;
          const targetHeight = Math.max(
            restingHeight,
            eye.clientHeight * strength,
          );
          const targetHeightPx = `${targetHeight}px`;
          upperEyelid.dataset.gazeLidDroopHeightPx = targetHeightPx;
          if (upperEyelid.dataset.isBlinking !== "true") {
            upperEyelid.style.height = targetHeightPx;
          }
          upperEyelid.gazeLidDroopTimerId = window.setTimeout(() => {
            delete upperEyelid.dataset.gazeLidDroopHeightPx;
            upperEyelid.gazeLidDroopTimerId = 0;
            if (upperEyelid.dataset.isBlinking !== "true") {
              upperEyelid.style.height = getRestingUpperLidHeight(upperEyelid);
            }
          }, holdDuration);
        });
      };
      const scheduleNextGazeShift = () => {
        const babyGaze = state.isBabyMode;
        const delay = isFirstShift
          ? 450 + Math.random() * 650
          : babyGaze
            ? 820 + Math.random() * 850
            : 1250 + Math.random() * 1150;
        isFirstShift = false;
        state.gazeShiftTimerId = window.setTimeout(() => {
          if (!state.isGazeMode) {
            state.gazeShiftTimerId = 0;
            return;
          }
          const isLargeDistractedLook = Math.random() < (babyGaze ? 0.4 : 0.28);
          const holdDuration = isLargeDistractedLook
            ? babyGaze
              ? 760 + Math.random() * 760
              : 1200 + Math.random() * 850
            : babyGaze
              ? 620 + Math.random() * 640
              : 1100 + Math.random() * 800;
          const side = Math.random() < 0.5 ? -1 : 1;
          const sharedX = isLargeDistractedLook
            ? parseFloat((side * (15 + Math.random() * 6)).toFixed(2))
            : parseFloat((side * (8.5 + Math.random() * 5.5)).toFixed(2));
          const sharedY = isLargeDistractedLook
            ? parseFloat((7.5 + Math.random() * 4.5).toFixed(2))
            : parseFloat((Math.random() * 7 - 3.5).toFixed(2));
          const faceShiftX =
            side *
            (isLargeDistractedLook
              ? 2.4 + Math.random() * 1.2
              : 1.4 + Math.random() * 0.9);
          const faceShiftY = isLargeDistractedLook
            ? 1.8 + Math.random() * 1.1
            : Math.max(-0.8, Math.min(1.2, sharedY * 0.2));
          const headTiltRandom = Math.random();
          const hasLargeHeadTilt =
            isLargeDistractedLook && headTiltRandom < 0.16;
          const hasBiggerHeadTilt =
            isLargeDistractedLook && headTiltRandom < 0.42;
          const faceTilt =
            side *
            (hasLargeHeadTilt
              ? 1.02 + Math.random() * 0.34
              : hasBiggerHeadTilt
                ? 1.05 + Math.random() * 0.3
                : isLargeDistractedLook
                  ? 0.76 + Math.random() * 0.34
                  : 0.44 + Math.random() * 0.28);
          applyGazeFacePose({
            x: faceShiftX,
            y: faceShiftY,
            tilt: faceTilt,
          });
          if (isLargeDistractedLook) {
            applyTemporaryGazeLidDroop(
              holdDuration,
              0.16 + Math.random() * 0.06,
            );
          }
          if (
            isLargeDistractedLook &&
            Math.random() < (babyGaze ? 0.46 : 0.22)
          ) {
            window.setTimeout(
              () => blinkEyes({ doubleBlink: false }),
              babyGaze ? 80 : 140,
            );
          }
          applyIrisGazePose(
            () => ({
              x:
                sharedX +
                (Math.random() * (babyGaze ? 1.2 : 0.8) -
                  (babyGaze ? 0.6 : 0.4)),
              y:
                sharedY +
                (Math.random() * (babyGaze ? 0.75 : 0.5) -
                  (babyGaze ? 0.38 : 0.25)),
            }),
            {
              overshoot: babyGaze ? 0.1 : 0.065,
              settleMs: babyGaze ? 160 : 200,
              staggerMs: babyGaze ? 16 : 12,
            },
          );
          state.gazeShiftTimerId = window.setTimeout(() => {
            applyRestingGaze();
            if (state.isGazeMode) {
              scheduleNextGazeShift();
            } else {
              state.gazeShiftTimerId = 0;
            }
          }, holdDuration);
        }, delay);
      };
      applyRestingGaze();
      scheduleNextGazeShift();
    }
    function startGazeLoop() {
      startGazeShifts();
    }
    function initDraggable(draggable) {
      let dragging = false;
      const eye = draggable.closest(".eye");
      let eyeRect;
      let centreX;
      let centreY;
      let maxOffsetX;
      let maxOffsetY;
      function removePointerListeners() {
        document.removeEventListener("touchmove", onDrag);
        document.removeEventListener("touchend", endDrag);
        document.removeEventListener("touchcancel", endDrag);
        document.removeEventListener("mousemove", onDrag);
        document.removeEventListener("mouseup", endDrag);
      }
      function finishDrag() {
        dragging = false;
        draggable.isDragging = false;
        removePointerListeners();
      }
      function startDrag(event) {
        if (!state.isManualEyeMoveEnabled || state.isTestMode) {
          return;
        }
        event.preventDefault();
        dragging = true;
        draggable.isDragging = true;
        eyeRect = eye.getBoundingClientRect();
        centreX = eyeRect.left + eyeRect.width / 2;
        centreY = eyeRect.top + eyeRect.height / 2;
        maxOffsetX = (eyeRect.width / 2 - draggable.offsetWidth / 2) * 0.8;
        maxOffsetY = 30 * 0.8;
        if (event.type === "touchstart") {
          document.addEventListener("touchmove", onDrag, { passive: false });
          document.addEventListener("touchend", endDrag);
          document.addEventListener("touchcancel", endDrag);
        } else {
          document.addEventListener("mousemove", onDrag);
          document.addEventListener("mouseup", endDrag);
        }
      }
      function onDrag(event) {
        if (!dragging) {
          return;
        }
        if (!state.isManualEyeMoveEnabled || state.isTestMode) {
          finishDrag();
          return;
        }
        let pointerX;
        let pointerY;
        if (event.type === "touchmove") {
          pointerX = event.touches[0].clientX;
          pointerY = event.touches[0].clientY;
        } else {
          pointerX = event.clientX;
          pointerY = event.clientY;
        }
        let dx = pointerX - centreX;
        let dy = pointerY - centreY;
        if (Math.abs(dx) > maxOffsetX) {
          dx = Math.sign(dx) * maxOffsetX;
        }
        if (Math.abs(dy) > maxOffsetY) {
          dy = Math.sign(dy) * maxOffsetY;
        }
        draggable.style.left = `calc(50% + ${dx}px - ${draggable.offsetWidth / 2}px)`;
        draggable.style.top = `calc(50% + ${dy}px - ${draggable.offsetHeight / 2}px)`;
        const pupil = draggable.querySelector(".pupil");
        if (pupil) {
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = Math.sqrt(maxOffsetX ** 2 + maxOffsetY ** 2);
          const factor = 1 + Math.min(distance / maxDistance, 1);
          const brightColor = brightenColor(state.baseReflexColor, factor);
          applyPupilFill(
            draggable,
            `rgb(${brightColor.r}, ${brightColor.g}, ${brightColor.b})`,
          );
        }
        notifyEyeGeometryChange();
      }
      function endDrag() {
        finishDrag();
      }
      draggable.cancelManualDrag = finishDrag;
      draggable.addEventListener("mousedown", startDrag);
      draggable.addEventListener("touchstart", startDrag, { passive: false });
    }
    function initPupilSlider(slider) {
      function updatePupil() {
        const eyeData = slider.getAttribute("data-eye");
        const eye = document.querySelector(`.eye[data-eye="${eyeData}"]`);
        if (!eye) {
          return;
        }
        const pupil = eye.querySelector(".pupil");
        const newSize = parseInt(slider.value, 10);
        pupil.dataset.baseSizePx = String(newSize);
        pupil.style.width = `${newSize}px`;
        pupil.style.height = `${newSize}px`;
        pupil.style.left = `calc(50% - ${newSize / 2}px)`;
        pupil.style.top = `calc(50% - ${newSize / 2}px)`;
        notifyEyeGeometryChange(false);
      }
      function snapToCentre() {
        const centre = 32;
        const tolerance = 3;
        const current = parseInt(slider.value, 10);
        if (Math.abs(current - centre) <= tolerance) {
          slider.value = centre;
          updatePupil();
        }
      }
      slider.addEventListener("input", updatePupil);
      slider.addEventListener("change", snapToCentre);
      slider.addEventListener("mouseup", snapToCentre);
      slider.addEventListener("touchend", snapToCentre);
      updatePupil();
    }
    function initVerticalEyelidSlider() {
      dom.eyelidSliders.forEach((slider) => {
        slider.addEventListener("input", () => {
          const eyeData = slider.getAttribute("data-eye");
          const eye = document.querySelector(`.eye[data-eye="${eyeData}"]`);
          if (!eye) {
            return;
          }
          const upperEyelid = eye.querySelector(".upper-eyelid");
          if (upperEyelid) {
            const restingHeight = `${slider.value * 1.5}px`;
            upperEyelid.dataset.restingHeightPx = restingHeight;
            if (
              upperEyelid.dataset.isBlinking !== "true" &&
              !upperEyelid.dataset.gazeLidDroopHeightPx
            ) {
              upperEyelid.style.height = restingHeight;
            }
          }
          notifyEyeGeometryChange(false);
        });
      });
    }
    function startMicroSaccades() {
      const saccadeInterval = 2300;
      const saccadeDuration = 120;
      dom.irises.forEach((iris) => {
        iris.microOffset = { x: 0, y: 0 };
      });
      state.microSaccadeIntervalId = window.setInterval(() => {
        const hasLargerShift = state.isGazeMode && Math.random() < 0.18;
        const horizontalRange = state.isGazeMode
          ? hasLargerShift
            ? 4.8
            : 2.6
          : 2;
        const verticalRange = state.isGazeMode
          ? hasLargerShift
            ? 2.6
            : 1.4
          : 2;
        const sharedOffsetX =
          Math.random() * horizontalRange - horizontalRange / 2;
        const sharedOffsetY = Math.random() * verticalRange - verticalRange / 2;
        dom.irises.forEach((iris) => {
          if (!iris.isDragging) {
            const offsetX = parseFloat(
              (sharedOffsetX + (Math.random() * 0.28 - 0.14)).toFixed(2),
            );
            const offsetY = parseFloat(
              (sharedOffsetY + (Math.random() * 0.22 - 0.11)).toFixed(2),
            );
            iris.microOffset = { x: offsetX, y: offsetY };
            updateIrisTransform(iris);
          }
        });
        notifyAmbientEyeGeometryChange();
        setTimeout(() => {
          dom.irises.forEach((iris) => {
            if (!iris.isDragging) {
              iris.microOffset = { x: 0, y: 0 };
              updateIrisTransform(iris);
            }
          });
          notifyAmbientEyeGeometryChange();
        }, saccadeDuration);
      }, saccadeInterval);
    }
    function startBackgroundJitter() {
      dom.irises.forEach((iris) => {
        iris.backgroundOffset = { x: 0, y: 0 };
      });
      const applyBackgroundJitter = () => {
        dom.irises.forEach((iris) => {
          if (!iris.isDragging) {
            const jitterRangeX = state.isGazeMode ? 0.62 : 0.4;
            const jitterRangeY = state.isGazeMode ? 0.52 : 0.4;
            const jitterX = parseFloat(
              (Math.random() * jitterRangeX - jitterRangeX / 2).toFixed(2),
            );
            const jitterY = parseFloat(
              (Math.random() * jitterRangeY - jitterRangeY / 2).toFixed(2),
            );
            iris.backgroundOffset = { x: jitterX, y: jitterY };
            updateIrisTransform(iris);
          }
        });
        notifyAmbientEyeGeometryChange();
      };
      const scheduleNextJitter = () => {
        const jitterInterval = 170 + Math.random() * 95;
        state.backgroundJitterIntervalId = window.setTimeout(() => {
          applyBackgroundJitter();
          scheduleNextJitter();
        }, jitterInterval);
      };
      scheduleNextJitter();
    }
    function applyNystagmusFrame(timestampMs) {
      const normalizedLevel =
        Math.max(0, Math.min(100, state.nystagmusLevel)) / 100;
      if (normalizedLevel <= 0) {
        return;
      }
      const amplitudeX = normalizedLevel * 9.5;
      const amplitudeY = normalizedLevel * 1.3;
      const frequencyHz = 0.45 + normalizedLevel * 3.9;
      const phaseBase = (timestampMs / 1e3) * Math.PI * 2 * frequencyHz;
      let didMove = false;
      dom.irises.forEach((iris, index) => {
        if (iris.isDragging) {
          return;
        }
        const eyePhaseOffset = index * 0.22;
        const phase = phaseBase + eyePhaseOffset;
        const fastComponent = Math.sin(phase);
        const slowComponent = Math.sin(phase * 0.5);
        const x =
          amplitudeX *
          (0.82 * fastComponent +
            0.18 * Math.sign(fastComponent) * slowComponent);
        const y = amplitudeY * Math.sin(phase * 2 + 0.8);
        const previous = iris.nystagmusOffset || { x: 0, y: 0 };
        if (
          Math.abs(previous.x - x) > 0.02 ||
          Math.abs(previous.y - y) > 0.02
        ) {
          iris.nystagmusOffset = {
            x: parseFloat(x.toFixed(2)),
            y: parseFloat(y.toFixed(2)),
          };
          updateIrisTransform(iris);
          didMove = true;
        }
      });
      if (didMove) {
        notifyEyeGeometryChange(false);
      }
    }
    function startNystagmusLoop() {
      if (state.nystagmusRafId) {
        return;
      }
      const loop = (timestampMs) => {
        applyNystagmusFrame(timestampMs);
        if (state.nystagmusLevel > 0) {
          state.nystagmusRafId = requestAnimationFrame(loop);
        } else {
          state.nystagmusRafId = 0;
        }
      };
      state.nystagmusRafId = requestAnimationFrame(loop);
    }
    function blinkEyes({ doubleBlink = false } = {}) {
      state.lastBlinkAtMs = performance.now();
      const isBabyBlink = Boolean(state.isBabyMode && state.isGazeMode);
      const isLongBabyBlink = isBabyBlink && Math.random() < 0.26;
      const closeTransition = isBabyBlink
        ? `height ${isLongBabyBlink ? 0.34 : 0.28}s ease-in`
        : "";
      const openTransition = isBabyBlink
        ? `height ${isLongBabyBlink ? 0.38 : 0.3}s ease-out`
        : "";
      const blinkHoldMs = isLongBabyBlink
        ? 560 + Math.random() * 520
        : isBabyBlink
          ? 190 + Math.random() * 130
          : 115;
      dom.eyes.forEach((eye) => {
        const upperEyelid = eye.querySelector(".upper-eyelid");
        const lowerEyelid = eye.querySelector(".lower-eyelid");
        if (upperEyelid) {
          if (upperEyelid.blinkTimerId) {
            window.clearTimeout(upperEyelid.blinkTimerId);
          }
          upperEyelid.dataset.isBlinking = "true";
          upperEyelid.style.transition = closeTransition;
          upperEyelid.style.height = `${eye.clientHeight * 0.7}px`;
        }
        if (lowerEyelid) {
          if (lowerEyelid.blinkTimerId) {
            window.clearTimeout(lowerEyelid.blinkTimerId);
          }
          lowerEyelid.style.transition = closeTransition;
          lowerEyelid.style.height = `${eye.clientHeight * 0.3}px`;
        }
        const blinkRestoreTimerId = window.setTimeout(() => {
          if (upperEyelid) {
            delete upperEyelid.dataset.isBlinking;
            upperEyelid.blinkTimerId = 0;
            upperEyelid.style.transition = openTransition;
            upperEyelid.style.height = getActiveUpperLidHeight(upperEyelid);
            window.setTimeout(
              () => {
                if (upperEyelid.dataset.isBlinking !== "true") {
                  upperEyelid.style.transition = "";
                }
              },
              isBabyBlink ? 440 : 0,
            );
          }
          if (lowerEyelid) {
            lowerEyelid.blinkTimerId = 0;
            lowerEyelid.style.transition = openTransition;
            lowerEyelid.style.height = "0px";
            window.setTimeout(
              () => {
                if (!lowerEyelid.blinkTimerId) {
                  lowerEyelid.style.transition = "";
                }
              },
              isBabyBlink ? 440 : 0,
            );
          }
        }, blinkHoldMs);
        if (upperEyelid) {
          upperEyelid.blinkTimerId = blinkRestoreTimerId;
        }
        if (lowerEyelid) {
          lowerEyelid.blinkTimerId = blinkRestoreTimerId;
        }
      });
      if (doubleBlink && !isLongBabyBlink) {
        window.setTimeout(
          () => blinkEyes({ doubleBlink: false }),
          isBabyBlink ? 320 : 210,
        );
      }
    }
    function scheduleNextBlink() {
      const usesBabyGazeBlink = state.isBabyMode && state.isGazeMode;
      const nextBlinkDelay = usesBabyGazeBlink
        ? 2800 + Math.random() * 3200
        : 4200 + Math.random() * 3300;
      state.blinkIntervalId = window.setTimeout(() => {
        blinkEyes({
          doubleBlink: Math.random() < (usesBabyGazeBlink ? 0.1 : 0.14),
        });
        scheduleNextBlink();
      }, nextBlinkDelay);
    }
    function resetBlinkSchedule() {
      if (state.blinkIntervalId) {
        window.clearTimeout(state.blinkIntervalId);
        state.blinkIntervalId = 0;
      }
      if (!prefersReducedMotion()) {
        scheduleNextBlink();
      }
    }
    function startAmbientAnimations() {
      if (prefersReducedMotion()) {
        return;
      }
      if (!state.microSaccadeIntervalId) {
        startMicroSaccades();
      }
      if (!state.backgroundJitterIntervalId) {
        startBackgroundJitter();
      }
      if (!state.blinkIntervalId) {
        scheduleNextBlink();
      }
      if (state.nystagmusLevel > 0) {
        startNystagmusLoop();
      }
      if (state.isGazeMode && !state.gazeShiftTimerId) {
        startGazeLoop();
      }
    }
    function applyReflexColor(color) {
      dom.irises.forEach((iris) => {
        applyPupilFill(iris, color);
      });
      applyCataractToPupils();
    }
    function setCataractLevel(value) {
      const parsed = Number.isFinite(value) ? value : parseInt(value, 10);
      if (Number.isNaN(parsed)) {
        return;
      }
      state.cataractLevel = Math.max(0, Math.min(100, parsed));
      applyCataractToPupils();
    }
    function setNystagmusLevel(value) {
      const parsed = Number.isFinite(value) ? value : parseInt(value, 10);
      if (Number.isNaN(parsed)) {
        return;
      }
      state.nystagmusLevel = Math.max(0, Math.min(100, parsed));
      if (state.nystagmusLevel > 0) {
        startNystagmusLoop();
        notifyEyeGeometryChange(false);
      }
      if (state.nystagmusLevel === 0) {
        let resetNeeded = false;
        dom.irises.forEach((iris) => {
          const previous = iris.nystagmusOffset || { x: 0, y: 0 };
          if (Math.abs(previous.x) > 0.02 || Math.abs(previous.y) > 0.02) {
            iris.nystagmusOffset = { x: 0, y: 0 };
            updateIrisTransform(iris);
            resetNeeded = true;
          }
        });
        if (resetNeeded) {
          notifyEyeGeometryChange(true);
        }
      }
    }
    function setManualEyeMoveEnabled(isEnabled) {
      state.isManualEyeMoveEnabled = Boolean(isEnabled);
      if (!state.isManualEyeMoveEnabled || state.isTestMode) {
        dom.irises.forEach((iris) => {
          if (typeof iris.cancelManualDrag === "function") {
            iris.cancelManualDrag();
          }
        });
      }
      applyManualEyeMoveState();
    }
    function setGazeMode(isEnabled) {
      const nextEnabled = Boolean(isEnabled);
      if (nextEnabled === state.isGazeMode) {
        return;
      }
      state.isGazeMode = nextEnabled;
      resetBlinkLids();
      resetBlinkSchedule();
      if (nextEnabled) {
        startGazeShifts();
        return;
      }
      clearGazeTimers();
      resetTemporaryGazeLids();
      resetGazeFacePose();
      resetGazeOffset();
    }
    function setDilatedMode(isEnabled) {
      const nextEnabled = Boolean(isEnabled);
      if (nextEnabled === state.isDilatedMode) {
        return;
      }
      if (nextEnabled) {
        state.dilatedPreviousPupilValues = dom.pupilSizeSliders.map(
          (slider) => slider.value,
        );
        setPupilSliderValues([44, 44]);
      } else if (state.dilatedPreviousPupilValues) {
        setPupilSliderValues(state.dilatedPreviousPupilValues);
        state.dilatedPreviousPupilValues = null;
      } else {
        setPupilSliderValues([32, 32]);
      }
      state.isDilatedMode = nextEnabled;
      notifyEyeGeometryChange(false);
    }
    function setBabyMode(isEnabled) {
      const nextEnabled = Boolean(isEnabled);
      const previousEnabled = state.isBabyMode;
      state.isBabyMode = nextEnabled;
      if (dom.eyesWrapper) {
        dom.eyesWrapper.classList.toggle("is-baby-mode", state.isBabyMode);
      }
      if (previousEnabled !== nextEnabled) {
        resetBlinkLids();
        resetBlinkSchedule();
      }
      notifyEyeGeometryChange(true);
    }
    function init() {
      dom.irises.forEach((iris) => {
        iris.nystagmusOffset = { x: 0, y: 0 };
        iris.gazeOffset = { x: 0, y: 0 };
        iris.microOffset = { x: 0, y: 0 };
        iris.backgroundOffset = { x: 0, y: 0 };
      });
      dom.irises.forEach(initDraggable);
      dom.pupilSizeSliders.forEach(initPupilSlider);
      initVerticalEyelidSlider();
      applyCataractToPupils();
      applyManualEyeMoveState();
      if (dom.eyesWrapper) {
        dom.eyesWrapper.classList.toggle("is-baby-mode", state.isBabyMode);
      }
    }
    return {
      init,
      applyReflexColor,
      setCataractLevel,
      setBabyMode,
      setDilatedMode,
      setGazeMode,
      setManualEyeMoveEnabled,
      setNystagmusLevel,
      startAmbientAnimations,
    };
  }

  // src/modal.js
  var FOCUSABLE_SELECTOR = [
    "button:not([disabled])",
    "[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");
  function setBodyModalLock(body, shouldLock) {
    if (!body) {
      return;
    }
    const currentCount = parseInt(body.dataset.openModalCount || "0", 10);
    const nextCount = Math.max(0, currentCount + (shouldLock ? 1 : -1));
    body.dataset.openModalCount = String(nextCount);
    body.classList.toggle("modal-open", nextCount > 0);
  }
  function getFocusableElements(container) {
    if (!container) {
      return [];
    }
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
      (element) =>
        element instanceof HTMLElement &&
        element.getAttribute("aria-hidden") !== "true" &&
        element.getClientRects().length > 0,
    );
  }
  function createModalController({
    body,
    modal,
    focusRoot,
    initialFocusElement,
  }) {
    if (!modal) {
      return {
        close() {},
        isOpen() {
          return false;
        },
        open() {},
        toggle() {},
      };
    }
    if (focusRoot && !focusRoot.hasAttribute("tabindex")) {
      focusRoot.setAttribute("tabindex", "-1");
    }
    let isModalOpen = false;
    let lastFocusedElement = null;
    function focusInitialTarget() {
      const focusableElements = getFocusableElements(focusRoot || modal);
      const fallbackTarget = focusRoot || modal;
      const target =
        initialFocusElement || focusableElements[0] || fallbackTarget;
      if (target instanceof HTMLElement) {
        target.focus();
      }
    }
    function close({ restoreFocus = true } = {}) {
      if (!isModalOpen) {
        return;
      }
      isModalOpen = false;
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
      setBodyModalLock(body, false);
      if (
        restoreFocus &&
        lastFocusedElement instanceof HTMLElement &&
        document.contains(lastFocusedElement)
      ) {
        lastFocusedElement.focus();
      }
    }
    function open({ triggerElement } = {}) {
      if (isModalOpen) {
        return;
      }
      lastFocusedElement =
        triggerElement instanceof HTMLElement
          ? triggerElement
          : document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
      isModalOpen = true;
      modal.style.display = "block";
      modal.setAttribute("aria-hidden", "false");
      setBodyModalLock(body, true);
      requestAnimationFrame(() => {
        focusInitialTarget();
      });
    }
    function toggle({ triggerElement } = {}) {
      if (isModalOpen) {
        close();
        return;
      }
      open({ triggerElement });
    }
    modal.addEventListener("keydown", (event) => {
      if (!isModalOpen) {
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const focusableElements = getFocusableElements(focusRoot || modal);
      const fallbackTarget = focusRoot || modal;
      if (!focusableElements.length) {
        event.preventDefault();
        if (fallbackTarget instanceof HTMLElement) {
          fallbackTarget.focus();
        }
        return;
      }
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;
      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }
      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    });
    return {
      close,
      isOpen() {
        return isModalOpen;
      },
      open,
      toggle,
    };
  }

  // src/info-modal.js
  function initInfoModal(dom) {
    const { body, infoIcon, infoModal, infoModalContent, closeModal } = dom;
    if (!body || !infoIcon || !infoModal || !infoModalContent || !closeModal) {
      return;
    }
    const infoModalController = createModalController({
      body,
      focusRoot: infoModalContent,
      initialFocusElement: closeModal,
      modal: infoModal,
    });
    infoIcon.addEventListener("click", () => {
      infoModalController.toggle({ triggerElement: infoIcon });
      infoIcon.setAttribute(
        "aria-expanded",
        String(infoModalController.isOpen()),
      );
    });
    closeModal.addEventListener("click", () => {
      infoModalController.close();
      infoIcon.setAttribute("aria-expanded", "false");
    });
    infoModal.addEventListener("click", (event) => {
      if (event.target === infoModal) {
        infoModalController.close();
        infoIcon.setAttribute("aria-expanded", "false");
      }
    });
    infoModal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        infoIcon.setAttribute("aria-expanded", "false");
      }
    });
  }

  // src/mcq.js
  function shuffledCopy(items) {
    return items
      .map((item) => ({ item, sortKey: Math.random() }))
      .sort((a, b) => a.sortKey - b.sortKey)
      .map((entry) => entry.item);
  }
  function shuffleQuestionOptions(question) {
    const correctOption = question.options[question.answer];
    const options = shuffledCopy(question.options);
    return {
      ...question,
      options,
      answer: options.indexOf(correctOption),
    };
  }
  function sampleQuestions(level, count = 5) {
    const source = MCQ_BANK[level] || [];
    const shuffled = shuffledCopy(source);
    return shuffled
      .slice(0, Math.min(count, shuffled.length))
      .map(shuffleQuestionOptions);
  }
  function renderMcqQuestions(container, questions) {
    if (!container) {
      return;
    }
    const fragment = document.createDocumentFragment();
    questions.forEach((question, questionIndex) => {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "question";
      const legend = document.createElement("legend");
      legend.textContent = `${questionIndex + 1}. ${question.question}`;
      fieldset.appendChild(legend);
      const options = document.createElement("div");
      options.className = "options";
      question.options.forEach((option, optionIndex) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `mcq_q_${questionIndex}`;
        input.value = String(optionIndex);
        label.append(input, document.createTextNode(` ${option}`));
        options.appendChild(label);
      });
      fieldset.appendChild(options);
      fragment.appendChild(fieldset);
    });
    container.replaceChildren(fragment);
  }
  function getMcqAnswers(questions) {
    const answers = [];
    for (let i = 0; i < questions.length; i += 1) {
      const selected = document.querySelector(
        `input[name="mcq_q_${i}"]:checked`,
      );
      if (!selected) {
        return null;
      }
      answers.push(parseInt(selected.value, 10));
    }
    return answers;
  }
  function gradeMcq(questions, answers) {
    let score = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        score += 1;
      }
    });
    return score;
  }
  function revealMcqFeedback(container, questions, answers) {
    if (!container || !Array.isArray(questions) || !Array.isArray(answers)) {
      return;
    }
    const questionBlocks = Array.from(
      container.querySelectorAll("fieldset.question"),
    );
    questionBlocks.forEach((questionBlock, questionIndex) => {
      var _a;
      const optionLabels = Array.from(
        questionBlock.querySelectorAll(".options label"),
      );
      optionLabels.forEach((label) => {
        label.classList.remove("correct-answer-label", "wrong-answer-label");
      });
      const correctOptionIndex =
        (_a = questions[questionIndex]) == null ? void 0 : _a.answer;
      const selectedOptionIndex = answers[questionIndex];
      const correctLabel = optionLabels[correctOptionIndex];
      if (correctLabel) {
        correctLabel.classList.add("correct-answer-label");
      }
      if (
        Number.isInteger(selectedOptionIndex) &&
        selectedOptionIndex !== correctOptionIndex
      ) {
        const selectedLabel = optionLabels[selectedOptionIndex];
        if (selectedLabel) {
          selectedLabel.classList.add("wrong-answer-label");
        }
      }
      questionBlock.querySelectorAll("input[type='radio']").forEach((input) => {
        input.disabled = true;
      });
    });
  }

  // src/menu-mcq.js?v=20260506-9
  function initMenuMcq({ state, dom, onBeforeOpenMcq }) {
    const {
      body,
      burgerIcon,
      sideMenu,
      mcqModal,
      mcqModalContent,
      closeMcqModalButton,
      mcqTitle,
      mcqIntro,
      mcqContainer,
      submitMcqButton,
      mcqResult,
      mcqLevelButtons,
    } = dom;
    if (
      !body ||
      !burgerIcon ||
      !sideMenu ||
      !mcqModal ||
      !mcqModalContent ||
      !closeMcqModalButton ||
      !mcqTitle ||
      !mcqIntro ||
      !mcqContainer ||
      !submitMcqButton ||
      !mcqResult
    ) {
      return;
    }
    const setSideMenuOpen = (isOpen) => {
      sideMenu.classList.toggle("open", isOpen);
      sideMenu.setAttribute("aria-hidden", String(!isOpen));
      if (isOpen) {
        sideMenu.removeAttribute("inert");
      } else {
        sideMenu.setAttribute("inert", "");
      }
      burgerIcon.setAttribute("aria-expanded", String(isOpen));
      burgerIcon.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu",
      );
    };
    const mcqModalController = createModalController({
      body,
      focusRoot: mcqModalContent,
      initialFocusElement: closeMcqModalButton,
      modal: mcqModal,
    });
    const openMcqLevel = (level, triggerElement) => {
      const meta = MCQ_LEVEL_META[level];
      if (!meta) {
        return;
      }
      if (typeof onBeforeOpenMcq === "function") {
        onBeforeOpenMcq();
      }
      state.activeMcqLevel = level;
      state.activeMcqQuestions = sampleQuestions(
        level,
        meta.questionCount || 5,
      );
      mcqTitle.textContent = `${meta.title} MCQ`;
      mcqIntro.textContent = `${state.activeMcqQuestions.length} questions. Pass mark ${meta.passMark}.`;
      renderMcqQuestions(mcqContainer, state.activeMcqQuestions);
      mcqResult.textContent = "";
      mcqResult.style.color = "";
      mcqResult.hidden = true;
      submitMcqButton.disabled = false;
      setSideMenuOpen(false);
      mcqModalController.open({ triggerElement });
    };
    burgerIcon.addEventListener("click", () => {
      setSideMenuOpen(!sideMenu.classList.contains("open"));
    });
    mcqLevelButtons.forEach((button) => {
      button.addEventListener("click", () => {
        openMcqLevel(button.dataset.level, button);
      });
    });
    closeMcqModalButton.addEventListener("click", () => {
      mcqModalController.close();
    });
    submitMcqButton.addEventListener("click", () => {
      if (!state.activeMcqQuestions.length) {
        return;
      }
      const answers = getMcqAnswers(state.activeMcqQuestions);
      if (!answers) {
        mcqResult.textContent =
          "Please answer all questions before submitting.";
        mcqResult.style.color = "#c4171d";
        mcqResult.hidden = false;
        return;
      }
      const score = gradeMcq(state.activeMcqQuestions, answers);
      revealMcqFeedback(mcqContainer, state.activeMcqQuestions, answers);
      submitMcqButton.disabled = true;
      mcqResult.hidden = false;
      const passMark = MCQ_LEVEL_META[state.activeMcqLevel].passMark;
      const didPass = score >= passMark;
      if (didPass) {
        const star = document.createElement("span");
        star.className = "result-star";
        star.setAttribute("aria-label", "star earned");
        star.textContent = String.fromCharCode(9733);
        mcqResult.replaceChildren(
          document.createTextNode(
            `Score ${score}/${state.activeMcqQuestions.length} - Pass `,
          ),
          star,
        );
        mcqResult.style.color = "#0f9644";
      } else {
        mcqResult.textContent = `Score ${score}/${state.activeMcqQuestions.length} - Needs more practice`;
        mcqResult.style.color = "#c4171d";
      }
    });
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (target === mcqModal) {
        mcqModalController.close();
        return;
      }
      if (sideMenu.classList.contains("open") && target instanceof Node) {
        const clickedInsideMenu = sideMenu.contains(target);
        const clickedBurger = burgerIcon.contains(target);
        if (!clickedInsideMenu && !clickedBurger) {
          setSideMenuOpen(false);
        }
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") {
        return;
      }
      setSideMenuOpen(false);
      mcqModalController.close();
    });
  }

  // src/menu-visual-cases.js?v=20260507-1
  function createElement(tagName, className, textContent) {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (textContent !== void 0) {
      element.textContent = textContent;
    }
    return element;
  }
  function getCurrentCaseIndex(caseList, currentValue) {
    const index = caseList.findIndex(
      (caseItem) => caseItem.value === currentValue,
    );
    return index >= 0 ? index : 0;
  }
  function scrollCardIntoView(card) {
    if (!(card instanceof HTMLElement)) {
      return;
    }
    requestAnimationFrame(() => {
      card.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      });
    });
  }
  function buildFallbackPreview(caseItem) {
    const preview = createElement("div", "case-card-fallback-preview");
    preview.dataset.caseCategory = caseItem.category;
    preview.dataset.caseLevel = caseItem.level;
    const leftEye = createElement("span", "case-preview-eye");
    const rightEye = createElement("span", "case-preview-eye");
    preview.append(leftEye, rightEye);
    return preview;
  }
  function createVisualCasesController({
    state,
    dom,
    onSelectCase,
    onBeforeOpen,
  } = {}) {
    const {
      body,
      caseModal,
      caseModalContent,
      closeCaseModalButton,
      caseSectionsContainer,
      caseSimilarTool,
      caseSimilarList,
      casePicker,
      casePreviousButton,
      caseNextButton,
      caseTriggerButton,
      caseTriggerLabel,
      caseTriggerLevel,
    } = dom;
    if (
      !body ||
      !caseModal ||
      !caseModalContent ||
      !closeCaseModalButton ||
      !caseSectionsContainer ||
      !casePicker ||
      !casePreviousButton ||
      !caseNextButton ||
      !caseTriggerButton ||
      !caseTriggerLabel ||
      !caseTriggerLevel
    ) {
      return {
        init() {},
        update() {},
        selectNextCase() {},
        selectPreviousCase() {},
      };
    }
    const modalController = createModalController({
      body,
      focusRoot: caseModalContent,
      initialFocusElement: closeCaseModalButton,
      modal: caseModal,
    });
    function getVisibleCases() {
      return getCaseList({ babyOnly: state.isBabyMode });
    }
    function selectCase(value, triggerElement) {
      const caseItem = getCaseByValue(value);
      if (!caseItem || typeof onSelectCase !== "function") {
        return;
      }
      onSelectCase(caseItem.value);
      modalController.close({ restoreFocus: false });
      update();
      if (triggerElement instanceof HTMLElement) {
        triggerElement.focus();
      }
    }
    function selectByDelta(delta) {
      const caseList = getVisibleCases();
      if (!caseList.length || state.isTestMode) {
        return;
      }
      const currentIndex = getCurrentCaseIndex(
        caseList,
        state.currentRefraction,
      );
      const nextIndex =
        (currentIndex + delta + caseList.length) % caseList.length;
      selectCase(caseList[nextIndex].value);
    }
    function renderCaseCard(caseItem) {
      const button = createElement("button", "case-card");
      button.type = "button";
      button.dataset.caseValue = caseItem.value;
      button.dataset.level = caseItem.level;
      button.setAttribute(
        "aria-pressed",
        String(caseItem.value === state.currentRefraction),
      );
      const header = createElement("span", "case-card-header");
      const badge = createElement(
        "span",
        "case-card-badge",
        String(caseItem.index),
      );
      const text = createElement("span", "case-card-text");
      const title = createElement("span", "case-card-title", caseItem.label);
      const summary = createElement(
        "span",
        "case-card-summary",
        caseItem.summary,
      );
      text.append(title, summary);
      header.append(badge, text);
      const media = createElement("span", "case-card-media");
      const image = document.createElement("img");
      image.src = caseItem.thumbnailSrc;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener(
        "error",
        () => {
          media.replaceChildren(buildFallbackPreview(caseItem));
        },
        { once: true },
      );
      media.appendChild(image);
      button.append(header, media);
      button.addEventListener("click", () =>
        selectCase(caseItem.value, button),
      );
      button.addEventListener("focus", () => scrollCardIntoView(button));
      return button;
    }
    function renderSimilarCases() {
      if (!caseSimilarTool || !caseSimilarList) {
        return;
      }
      const visibleCases = getVisibleCases();
      const currentIndex = getCurrentCaseIndex(
        visibleCases,
        state.currentRefraction,
      );
      const currentCase = visibleCases[currentIndex];
      if (!currentCase) {
        caseSimilarTool.hidden = true;
        caseSimilarList.replaceChildren();
        return;
      }
      const adjacentCases = [-1, 1]
        .map((delta) => {
          const index = currentIndex + delta;
          return visibleCases[index] || null;
        })
        .filter((caseItem) => caseItem && caseItem.level === currentCase.level);
      if (!adjacentCases.length) {
        caseSimilarTool.hidden = true;
        caseSimilarList.replaceChildren();
        return;
      }
      const fragment = document.createDocumentFragment();
      adjacentCases.forEach((caseItem) => {
        const chip = createElement(
          "button",
          "case-similar-chip",
          `${caseItem.index}. ${caseItem.label}`,
        );
        chip.type = "button";
        chip.dataset.caseValue = caseItem.value;
        chip.addEventListener("click", () => selectCase(caseItem.value, chip));
        fragment.appendChild(chip);
      });
      caseSimilarList.replaceChildren(fragment);
      caseSimilarTool.hidden = false;
      caseSimilarTool.open = false;
    }
    function renderCaseSections() {
      const visibleCases = getVisibleCases();
      const fragment = document.createDocumentFragment();
      CASE_LEVELS.forEach((level) => {
        const levelCases = visibleCases.filter(
          (caseItem) => caseItem.level === level.value,
        );
        if (!levelCases.length) {
          return;
        }
        const details = document.createElement("details");
        details.className = "case-level-section";
        details.dataset.level = level.value;
        details.open = level.value === "primary";
        const summary = createElement("summary", "case-level-summary");
        const label = createElement("span", "case-level-label", level.label);
        const count = createElement(
          "span",
          "case-level-count",
          `(${levelCases.length})`,
        );
        summary.append(label, count);
        const grid = createElement("div", "case-card-grid");
        levelCases.forEach((caseItem) => {
          grid.appendChild(renderCaseCard(caseItem));
        });
        details.append(summary, grid);
        fragment.appendChild(details);
      });
      caseSectionsContainer.replaceChildren(fragment);
    }
    function update() {
      const currentCase = getCaseByValue(state.currentRefraction);
      if (!currentCase) {
        return;
      }
      caseTriggerLabel.textContent = currentCase.label;
      caseTriggerLevel.textContent = "";
      caseTriggerLevel.dataset.level = currentCase.level;
      caseTriggerButton.dataset.level = currentCase.level;
      const visibleCases = getVisibleCases();
      const hasMultipleCases = visibleCases.length > 1;
      casePreviousButton.disabled = state.isTestMode || !hasMultipleCases;
      caseNextButton.disabled = state.isTestMode || !hasMultipleCases;
      caseTriggerButton.disabled = state.isTestMode;
      if (modalController.isOpen()) {
        renderCaseSections();
        renderSimilarCases();
      }
    }
    function openCases(triggerElement) {
      if (state.isTestMode) {
        return;
      }
      if (typeof onBeforeOpen === "function") {
        onBeforeOpen();
      }
      renderCaseSections();
      renderSimilarCases();
      modalController.open({ triggerElement });
      const selectedCard = caseSectionsContainer.querySelector(
        `.case-card[data-case-value="${CSS.escape(state.currentRefraction)}"]`,
      );
      scrollCardIntoView(selectedCard);
    }
    function init() {
      casePreviousButton.addEventListener("click", () => selectByDelta(-1));
      caseNextButton.addEventListener("click", () => selectByDelta(1));
      caseTriggerButton.addEventListener("click", () =>
        openCases(caseTriggerButton),
      );
      closeCaseModalButton.addEventListener("click", () =>
        modalController.close(),
      );
      caseModal.addEventListener("click", (event) => {
        if (event.target === caseModal) {
          modalController.close();
        }
      });
      update();
    }
    return {
      init,
      selectNextCase: () => selectByDelta(1),
      selectPreviousCase: () => selectByDelta(-1),
      update,
    };
  }

  // src/central-media-masks.js?v=20260506-2
  function clearMask(maskElement) {
    if (!maskElement) {
      return;
    }
    maskElement.style.opacity = "0";
  }
  function applyMaskConfig(maskElement, config) {
    maskElement.style.width = config.width;
    maskElement.style.height = config.height;
    maskElement.style.minWidth = config.minWidth;
    maskElement.style.minHeight = config.minHeight;
    maskElement.style.maxWidth = config.maxWidth;
    maskElement.style.maxHeight = config.maxHeight;
    maskElement.style.borderRadius = config.borderRadius;
    maskElement.style.transform = config.transform;
    maskElement.style.background = config.background;
    maskElement.style.filter = config.filter;
    maskElement.style.opacity = config.opacity;
  }
  function getPosteriorCapsularThickeningMaskConfig() {
    return {
      width: "104%",
      height: "92%",
      minWidth: "24px",
      minHeight: "22px",
      maxWidth: "48px",
      maxHeight: "42px",
      borderRadius: "44% 56% 50% 48% / 50% 42% 60% 48%",
      transform: "translate(-50%, -50%) rotate(-9deg)",
      background: `
      radial-gradient(
        ellipse 94% 86% at 50% 50%,
        rgba(0, 0, 0, 0.34) 0%,
        rgba(0, 0, 0, 0.28) 34%,
        rgba(0, 0, 0, 0.16) 60%,
        rgba(0, 0, 0, 0) 80%
      ),
      linear-gradient(
        19deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 22%,
        rgba(0, 0, 0, 0.62) 27%,
        rgba(0, 0, 0, 0.78) 29%,
        rgba(0, 0, 0, 0.34) 33%,
        rgba(0, 0, 0, 0) 39%,
        rgba(0, 0, 0, 0) 100%
      ),
      linear-gradient(
        -16deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 30%,
        rgba(0, 0, 0, 0.58) 34%,
        rgba(0, 0, 0, 0.74) 36%,
        rgba(0, 0, 0, 0.3) 40%,
        rgba(0, 0, 0, 0) 47%,
        rgba(0, 0, 0, 0) 100%
      ),
      linear-gradient(
        57deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 39%,
        rgba(0, 0, 0, 0.54) 43%,
        rgba(0, 0, 0, 0.68) 45%,
        rgba(0, 0, 0, 0.28) 49%,
        rgba(0, 0, 0, 0) 56%,
        rgba(0, 0, 0, 0) 100%
      ),
      linear-gradient(
        -51deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 48%,
        rgba(0, 0, 0, 0.48) 52%,
        rgba(0, 0, 0, 0.62) 54%,
        rgba(0, 0, 0, 0.26) 58%,
        rgba(0, 0, 0, 0) 64%,
        rgba(0, 0, 0, 0) 100%
      ),
      radial-gradient(
        ellipse 18% 16% at 28% 30%,
        rgba(0, 0, 0, 0.72) 0%,
        rgba(0, 0, 0, 0.46) 32%,
        rgba(0, 0, 0, 0) 60%
      ),
      radial-gradient(
        ellipse 16% 14% at 66% 62%,
        rgba(0, 0, 0, 0.66) 0%,
        rgba(0, 0, 0, 0.4) 34%,
        rgba(0, 0, 0, 0) 60%
      ),
      radial-gradient(
        ellipse 13% 12% at 48% 42%,
        rgba(0, 0, 0, 0.62) 0%,
        rgba(0, 0, 0, 0.34) 36%,
        rgba(0, 0, 0, 0) 62%
      ),
      radial-gradient(
        ellipse 12% 10% at 58% 30%,
        rgba(0, 0, 0, 0.56) 0%,
        rgba(0, 0, 0, 0.28) 34%,
        rgba(0, 0, 0, 0) 62%
      ),
      radial-gradient(
        ellipse 12% 11% at 40% 68%,
        rgba(0, 0, 0, 0.54) 0%,
        rgba(0, 0, 0, 0.24) 34%,
        rgba(0, 0, 0, 0) 62%
      )
    `,
      filter: "blur(0.04px)",
      opacity: "0.9",
    };
  }
  function getPosteriorPoleCataractMaskConfig() {
    return {
      width: "48%",
      height: "48%",
      minWidth: "13px",
      minHeight: "13px",
      maxWidth: "26px",
      maxHeight: "26px",
      borderRadius: "28% 66% 34% 72% / 36% 24% 78% 62%",
      transform: "translate(-50%, -50%) rotate(-13deg)",
      background: `
      radial-gradient(
        ellipse 74% 72% at 50% 50%,
        rgba(8, 8, 8, 0.98) 0%,
        rgba(8, 8, 8, 0.98) 34%,
        rgba(8, 8, 8, 0.9) 46%,
        rgba(8, 8, 8, 0.36) 58%,
        rgba(8, 8, 8, 0) 72%
      ),
      radial-gradient(
        ellipse 20% 16% at 18% 52%,
        rgba(0, 0, 0, 0.99) 0%,
        rgba(0, 0, 0, 0.9) 34%,
        rgba(0, 0, 0, 0) 64%
      ),
      radial-gradient(
        ellipse 18% 15% at 22% 46%,
        rgba(0, 0, 0, 0.98) 0%,
        rgba(0, 0, 0, 0.88) 36%,
        rgba(0, 0, 0, 0) 62%
      ),
      radial-gradient(
        ellipse 20% 18% at 28% 34%,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.86) 38%,
        rgba(0, 0, 0, 0) 62%
      ),
      radial-gradient(
        ellipse 18% 16% at 72% 32%,
        rgba(0, 0, 0, 0.94) 0%,
        rgba(0, 0, 0, 0.82) 36%,
        rgba(0, 0, 0, 0) 60%
      ),
      radial-gradient(
        ellipse 22% 18% at 66% 72%,
        rgba(0, 0, 0, 0.94) 0%,
        rgba(0, 0, 0, 0.82) 34%,
        rgba(0, 0, 0, 0) 58%
      ),
      radial-gradient(
        ellipse 18% 16% at 34% 70%,
        rgba(0, 0, 0, 0.92) 0%,
        rgba(0, 0, 0, 0.78) 34%,
        rgba(0, 0, 0, 0) 58%
      ),
      radial-gradient(
        ellipse 16% 14% at 78% 56%,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.84) 34%,
        rgba(0, 0, 0, 0) 58%
      ),
      radial-gradient(
        ellipse 18% 16% at 82% 64%,
        rgba(0, 0, 0, 0.98) 0%,
        rgba(0, 0, 0, 0.88) 36%,
        rgba(0, 0, 0, 0) 60%
      ),
      conic-gradient(
        from 8deg at 50% 50%,
        rgba(0, 0, 0, 0) 0deg,
        rgba(0, 0, 0, 0) 10deg,
        rgba(0, 0, 0, 0.92) 10deg,
        rgba(0, 0, 0, 0.92) 30deg,
        rgba(0, 0, 0, 0) 30deg,
        rgba(0, 0, 0, 0) 50deg,
        rgba(0, 0, 0, 0.84) 50deg,
        rgba(0, 0, 0, 0.84) 68deg,
        rgba(0, 0, 0, 0) 68deg,
        rgba(0, 0, 0, 0) 96deg,
        rgba(0, 0, 0, 0.88) 96deg,
        rgba(0, 0, 0, 0.88) 118deg,
        rgba(0, 0, 0, 0) 118deg,
        rgba(0, 0, 0, 0) 146deg,
        rgba(0, 0, 0, 0.82) 146deg,
        rgba(0, 0, 0, 0.82) 164deg,
        rgba(0, 0, 0, 0) 164deg,
        rgba(0, 0, 0, 0) 196deg,
        rgba(0, 0, 0, 0.86) 196deg,
        rgba(0, 0, 0, 0.86) 218deg,
        rgba(0, 0, 0, 0) 218deg,
        rgba(0, 0, 0, 0) 248deg,
        rgba(0, 0, 0, 0.84) 248deg,
        rgba(0, 0, 0, 0.84) 268deg,
        rgba(0, 0, 0, 0) 268deg,
        rgba(0, 0, 0, 0) 300deg,
        rgba(0, 0, 0, 0.82) 300deg,
        rgba(0, 0, 0, 0.82) 322deg,
        rgba(0, 0, 0, 0) 322deg,
        rgba(0, 0, 0, 0) 360deg
      )
    `,
      filter: "blur(0.04px)",
      opacity: "0.95",
    };
  }
  function getPosteriorSubcapsularMaskConfig() {
    return {
      width: "44%",
      height: "44%",
      minWidth: "11px",
      minHeight: "11px",
      maxWidth: "23px",
      maxHeight: "23px",
      borderRadius: "48% 55% 57% 45% / 52% 48% 56% 44%",
      transform: "translate(-50%, -50%) rotate(-8deg)",
      background: `
      radial-gradient(
        ellipse 78% 74% at 50% 50%,
        rgba(38, 38, 38, 0.98) 0%,
        rgba(42, 42, 42, 0.92) 24%,
        rgba(48, 48, 48, 0.66) 44%,
        rgba(58, 58, 58, 0.3) 64%,
        rgba(58, 58, 58, 0) 82%
      ),
      radial-gradient(
        ellipse 26% 20% at 34% 36%,
        rgba(48, 48, 48, 0.66) 0%,
        rgba(52, 52, 52, 0.34) 34%,
        rgba(72, 72, 72, 0) 58%
      ),
      radial-gradient(
        ellipse 22% 18% at 66% 60%,
        rgba(46, 46, 46, 0.6) 0%,
        rgba(50, 50, 50, 0.3) 34%,
        rgba(66, 66, 66, 0) 58%
      )
    `,
      filter: "blur(0.9px)",
      opacity: "0.94",
    };
  }
  function getCentralMediaMaskConfig(flags) {
    if (flags.posteriorCapsularThickeningCase) {
      return getPosteriorCapsularThickeningMaskConfig();
    }
    if (flags.posteriorPoleCataractCase) {
      return getPosteriorPoleCataractMaskConfig();
    }
    if (flags.centralSubCorticalCataractCase) {
      return getPosteriorSubcapsularMaskConfig();
    }
    return null;
  }
  function updateCentralMediaMask({ maskElement, flags, isActiveEye }) {
    if (!maskElement) {
      return;
    }
    const config = isActiveEye && getCentralMediaMaskConfig(flags);
    if (!config) {
      clearMask(maskElement);
      return;
    }
    applyMaskConfig(maskElement, config);
  }

  // src/retinoscopy-case-metadata.js?v=20260506-2
  var REFRACTION_VALUES = {
    ACG: "acg",
    ANIRIDIA: "aniridia",
    APHAKIA: "aphakia",
    ANISOMETROPIA: "anisometropia",
    BIG_CORTICAL_CATARACT: "big-cortical-cataract",
    CENTRAL_SUB_CORTICAL_CATARACT: "central-sub-cortical-cataract",
    CORNEAL_SCAR: "corneal-scar",
    DENSE_CATARACT: "dense-cataract",
    FLOATERS: "floaters",
    HIGH_CYLINDER: "high-cylinder",
    HIGH_MINUS: "high-minus",
    HIGH_PLUS: "high-plus",
    KERATOCONUS: "keratoconus",
    IRIS_TRANSILLUMINATION: "iris-transillumination",
    LEUCOCORIA: "leucocoria",
    MINUS: "minus",
    NASAL_COLOBOMA: "nasal-coloboma",
    PARTIAL_RETINAL_DETACHMENT: "partial-retinal-detachment",
    POSTERIOR_CAPSULAR_THICKENING: "posterior-capsular-thickening",
    POSTERIOR_POLE_CATARACT: "posterior-pole-cataract",
    PLUS: "plus",
    POOR_TEAR_FILM: "poor-tear-film",
    SMALL_CORTICAL_CATARACT: "small-cortical-cataract",
    SMALL_PUPILS: "small-pupils",
    SMALL_SCISSORS: "small-scissors",
    VITREOUS_HAEMORRHAGE: "vitreous-haemorrhage",
    ZERO: DEFAULT_REFRACTION_VALUE2,
  };
  var EDGE_DIMMING_PROFILE = Object.freeze({
    minimumFactor: 0.12,
    fadeDistanceRatio: 1.35,
    softness: 1.15,
  });
  var EDGE_VISUAL_BLEND = Object.freeze({
    brightnessFloor: 0.4,
    blurBoostPx: 0.5,
    opacityFloor: 0.25,
  });
  var DEFAULT_REFLEX_BACKGROUND =
    "radial-gradient(ellipse 72% 62% at 50% 50%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.52) 28%, rgba(255, 255, 255, 0.16) 56%, rgba(255, 255, 255, 0.04) 72%, rgba(255, 255, 255, 0) 84%)";
  function randomIntInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function randomFloatInRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  function smallestCircularDifference(aDeg, bDeg) {
    const delta = Math.abs(aDeg - bDeg) % 360;
    return delta > 180 ? 360 - delta : delta;
  }
  function getEdgeDimmingFactor({
    probeOffsetX,
    probeOffsetY,
    pupilRadiusPx,
    profile = EDGE_DIMMING_PROFILE,
  }) {
    const centreDistance = Math.hypot(probeOffsetX, probeOffsetY);
    const startDistancePx = pupilRadiusPx;
    const { minimumFactor, fadeDistanceRatio, softness } = profile;
    if (centreDistance <= startDistancePx) {
      return 1;
    }
    const fadeDistancePx = Math.max(1.5, pupilRadiusPx * fadeDistanceRatio);
    const overshootPx = centreDistance - startDistancePx;
    const t = Math.max(0, Math.min(1, overshootPx / fadeDistancePx));
    const smoothT = t * t * (3 - 2 * t);
    const shapedT = Math.pow(smoothT, softness);
    return 1 - shapedT * (1 - Math.max(0, minimumFactor));
  }
  function getCaseFlags(currentRefraction) {
    const acgCase = currentRefraction === REFRACTION_VALUES.ACG;
    const aniridiaCase = currentRefraction === REFRACTION_VALUES.ANIRIDIA;
    const aphakiaCase = currentRefraction === REFRACTION_VALUES.APHAKIA;
    const cylinderCase = CYLINDER_REFRACTION_VALUES2.has(currentRefraction);
    const scissorsCase = currentRefraction === REFRACTION_VALUES.SMALL_SCISSORS;
    const keratoconusCase = currentRefraction === REFRACTION_VALUES.KERATOCONUS;
    const cornealScarCase =
      currentRefraction === REFRACTION_VALUES.CORNEAL_SCAR;
    const denseCataractCase =
      currentRefraction === REFRACTION_VALUES.DENSE_CATARACT;
    const floatersCase = currentRefraction === REFRACTION_VALUES.FLOATERS;
    const anisometropiaCase =
      currentRefraction === REFRACTION_VALUES.ANISOMETROPIA;
    const irisTransilluminationCase =
      currentRefraction === REFRACTION_VALUES.IRIS_TRANSILLUMINATION;
    const leucocoriaCase = currentRefraction === REFRACTION_VALUES.LEUCOCORIA;
    const nasalColobomaCase =
      currentRefraction === REFRACTION_VALUES.NASAL_COLOBOMA;
    const partialRetinalDetachmentCase =
      currentRefraction === REFRACTION_VALUES.PARTIAL_RETINAL_DETACHMENT;
    const posteriorCapsularThickeningCase =
      currentRefraction === REFRACTION_VALUES.POSTERIOR_CAPSULAR_THICKENING;
    const poorTearFilmCase =
      currentRefraction === REFRACTION_VALUES.POOR_TEAR_FILM;
    const smallCorticalCataractCase =
      currentRefraction === REFRACTION_VALUES.SMALL_CORTICAL_CATARACT;
    const smallPupilsCase =
      currentRefraction === REFRACTION_VALUES.SMALL_PUPILS;
    const bigCorticalCataractCase =
      currentRefraction === REFRACTION_VALUES.BIG_CORTICAL_CATARACT;
    const centralSubCorticalCataractCase =
      currentRefraction === REFRACTION_VALUES.CENTRAL_SUB_CORTICAL_CATARACT;
    const posteriorPoleCataractCase =
      currentRefraction === REFRACTION_VALUES.POSTERIOR_POLE_CATARACT;
    const vitreousHaemorrhageCase =
      currentRefraction === REFRACTION_VALUES.VITREOUS_HAEMORRHAGE;
    return {
      acgCase,
      aniridiaCase,
      aphakiaCase,
      anisometropiaCase,
      bigCorticalCataractCase,
      centralSubCorticalCataractCase,
      cornealScarCase,
      corticalCataractCase:
        smallCorticalCataractCase || bigCorticalCataractCase,
      cylinderCase,
      denseCataractCase,
      floatersCase,
      irisTransilluminationCase,
      keratoconusCase,
      leucocoriaCase,
      nasalColobomaCase,
      partialRetinalDetachmentCase,
      posteriorCapsularThickeningCase,
      posteriorPoleCataractCase,
      poorTearFilmCase,
      scissorsCase,
      smallCorticalCataractCase,
      smallPupilsCase,
      vitreousHaemorrhageCase,
    };
  }
  function isAxisDependentCase(currentRefraction) {
    return AXIS_DEPENDENT_REFRACTION_VALUES2.has(currentRefraction);
  }
  function getActiveRefractionForMode(currentRefraction, activeEye) {
    if (currentRefraction === REFRACTION_VALUES.ANISOMETROPIA) {
      return activeEye === "left"
        ? REFRACTION_VALUES.PLUS
        : REFRACTION_VALUES.MINUS;
    }
    if (currentRefraction === REFRACTION_VALUES.ACG) {
      return REFRACTION_VALUES.ZERO;
    }
    if (currentRefraction === REFRACTION_VALUES.ANIRIDIA) {
      return REFRACTION_VALUES.ZERO;
    }
    if (currentRefraction === REFRACTION_VALUES.IRIS_TRANSILLUMINATION) {
      return REFRACTION_VALUES.ZERO;
    }
    if (currentRefraction === REFRACTION_VALUES.NASAL_COLOBOMA) {
      return REFRACTION_VALUES.ZERO;
    }
    if (currentRefraction === REFRACTION_VALUES.POSTERIOR_CAPSULAR_THICKENING) {
      return REFRACTION_VALUES.ZERO;
    }
    if (currentRefraction === REFRACTION_VALUES.SMALL_PUPILS) {
      return REFRACTION_VALUES.ZERO;
    }
    return currentRefraction;
  }
  function normalizeTo180(angleDeg) {
    const normalized = angleDeg % 180;
    return normalized < 0 ? normalized + 180 : normalized;
  }
  function smallestAxisDifference(aDeg, bDeg) {
    const delta = Math.abs(aDeg - bDeg) % 180;
    return delta > 90 ? 180 - delta : delta;
  }
  function createCorticalCataractPattern(isLarge) {
    const wedgeCount = randomIntInRange(3, 4);
    const minSeparationDeg = isLarge ? 30 : 34;
    const wedgeAngles = [];
    let guard = 0;
    while (wedgeAngles.length < wedgeCount && guard < 500) {
      const candidate = randomIntInRange(0, 359);
      const hasCollision = wedgeAngles.some(
        (existingAngle) =>
          smallestCircularDifference(existingAngle, candidate) <
          minSeparationDeg,
      );
      if (!hasCollision) {
        wedgeAngles.push(candidate);
      }
      guard += 1;
    }
    while (wedgeAngles.length < wedgeCount) {
      wedgeAngles.push(randomIntInRange(0, 359));
    }
    return {
      wedges: wedgeAngles.map((angleDeg) => ({
        angleDeg,
        opacity: isLarge
          ? randomFloatInRange(0.82, 0.93)
          : randomFloatInRange(0.72, 0.86),
        widthDeg: isLarge
          ? randomFloatInRange(28, 40)
          : randomFloatInRange(20, 30),
      })),
    };
  }
  function normalizeTo360(angleDeg) {
    const normalized = angleDeg % 360;
    return normalized < 0 ? normalized + 360 : normalized;
  }
  function buildCorticalCataractOverlay(pattern) {
    return pattern.wedges
      .map((wedge) => {
        const startDeg = normalizeTo360(wedge.angleDeg - wedge.widthDeg * 0.5);
        const spanDeg = wedge.widthDeg.toFixed(1);
        const opacity = wedge.opacity.toFixed(2);
        return `
      conic-gradient(
        from ${startDeg.toFixed(1)}deg at 50% 50%,
        rgba(0, 0, 0, ${opacity}) 0deg,
        rgba(0, 0, 0, ${opacity}) ${spanDeg}deg,
        rgba(0, 0, 0, 0) ${spanDeg}deg,
        rgba(0, 0, 0, 0) 360deg
      )`;
      })
      .join(",\n");
  }
  function randomCylinderAxisDeg() {
    const weightedRanges = [
      { min: 20, max: 70, weight: 4 },
      { min: 110, max: 160, weight: 4 },
      { min: 0, max: 19, weight: 1 },
      { min: 71, max: 109, weight: 1 },
      { min: 161, max: 179, weight: 1 },
    ];
    const totalWeight = weightedRanges.reduce(
      (sum, range) => sum + range.weight,
      0,
    );
    let roll = Math.random() * totalWeight;
    for (const range of weightedRanges) {
      roll -= range.weight;
      if (roll <= 0) {
        return randomIntInRange(range.min, range.max);
      }
    }
    return randomIntInRange(20, 70);
  }
  function getCataractVisualState(cataractLevel) {
    const normalized = Math.max(0, Math.min(100, cataractLevel)) / 100;
    return {
      brightnessScale: 1 - normalized * 0.24,
      blurBoostPx: normalized * 0.8,
      opacityScale: 1 - normalized * 0.55,
    };
  }
  function getEdgeVisualState({ probeOffsetX, probeOffsetY, pupilRadiusPx }) {
    const edgeDimmingFactor = getEdgeDimmingFactor({
      probeOffsetX,
      probeOffsetY,
      pupilRadiusPx,
      profile: EDGE_DIMMING_PROFILE,
    });
    return {
      edgeBlurBoostPx: (1 - edgeDimmingFactor) * EDGE_VISUAL_BLEND.blurBoostPx,
      edgeBrightnessScale:
        EDGE_VISUAL_BLEND.brightnessFloor +
        edgeDimmingFactor * (1 - EDGE_VISUAL_BLEND.brightnessFloor),
      edgeOpacityScale:
        EDGE_VISUAL_BLEND.opacityFloor +
        edgeDimmingFactor * (1 - EDGE_VISUAL_BLEND.opacityFloor),
    };
  }
  function getMovementStatusHtml({
    activeEye,
    activeRefraction,
    currentRefraction,
    flags,
    movementSign,
  }) {
    if (currentRefraction === REFRACTION_VALUES.ZERO) {
      return "Neutral (0)";
    }
    if (flags.anisometropiaCase) {
      const eyeLabel = activeEye === "left" ? "RE" : "LE";
      const withDirection = activeRefraction.includes(REFRACTION_VALUES.PLUS);
      return withDirection
        ? `<em>${eyeLabel}</em> Fast With movement`
        : `<em>${eyeLabel}</em> Fast Against movement`;
    }
    if (flags.aphakiaCase) {
      return "<em>Very slow</em> With movement (aphakia)";
    }
    if (flags.acgCase) {
      return "<em>Vertical</em> Oval pupil (ACG)";
    }
    if (flags.aniridiaCase) {
      return "<em>Large</em> Pupil (aniridia)";
    }
    if (flags.smallPupilsCase) {
      return "<em>Small</em> Pupils";
    }
    if (flags.scissorsCase) {
      return "<em>Small</em> Scissors reflex";
    }
    if (flags.keratoconusCase) {
      return "<em>Irregular</em> Scissors reflex";
    }
    if (flags.cornealScarCase) {
      return "<em>Diffuse</em> Corneal scar reflex";
    }
    if (flags.vitreousHaemorrhageCase) {
      return "<em>Diffuse</em> Vitreous haemorrhage reflex";
    }
    if (flags.floatersCase) {
      return "<em>Mobile</em> Floater shadows";
    }
    if (flags.partialRetinalDetachmentCase) {
      return "<em>Sectoral</em> Dull reflex";
    }
    if (flags.poorTearFilmCase) {
      return "<em>Variable</em> Tear film reflex";
    }
    if (flags.smallCorticalCataractCase) {
      return "<em>Dull</em> Small cortical cataract reflex";
    }
    if (flags.bigCorticalCataractCase) {
      return "<em>Dull</em> Big cortical cataract reflex";
    }
    if (flags.centralSubCorticalCataractCase) {
      return "<em>Dull</em> Posterior subcapsular cataract reflex";
    }
    if (flags.posteriorPoleCataractCase) {
      return "<em>Very dull</em> Posterior pole cataract reflex";
    }
    if (flags.posteriorCapsularThickeningCase) {
      return "<em>Dull</em> Posterior capsular thickening reflex";
    }
    if (flags.denseCataractCase) {
      return "<em>Very dull</em> Dense cataract reflex";
    }
    if (flags.leucocoriaCase) {
      return "<em>White</em> Pupil reflex";
    }
    if (flags.irisTransilluminationCase) {
      return "<em>Normal</em> Iris transillumination";
    }
    if (flags.nasalColobomaCase) {
      return "<em>Normal</em> Nasal coloboma pupil";
    }
    if (flags.cylinderCase) {
      if (Math.abs(movementSign) < 0.08) {
        return "Neutral meridian (astigmatism)";
      }
      const highCylinder =
        currentRefraction === REFRACTION_VALUES.HIGH_CYLINDER;
      const movementStrength =
        Math.pow(Math.abs(movementSign), 0.9) * (highCylinder ? 0.75 : 0.58);
      const speedWord = movementStrength >= 0.38 ? "Fast" : "Slow";
      return movementSign > 0
        ? `<em>${speedWord}</em> With movement (astigmatism)`
        : `<em>${speedWord}</em> Against movement (astigmatism)`;
    }
    if (activeRefraction === REFRACTION_VALUES.HIGH_PLUS) {
      return "<em>Slow</em> With movement (+)";
    }
    if (activeRefraction === REFRACTION_VALUES.HIGH_MINUS) {
      return "<em>Slow</em> Against movement (-)";
    }
    if (activeRefraction === REFRACTION_VALUES.PLUS) {
      return "<em>Fast</em> With movement (+)";
    }
    if (activeRefraction === REFRACTION_VALUES.MINUS) {
      return "<em>Fast</em> Against movement (-)";
    }
    return "Neutral (0)";
  }

  // src/retinoscopy-pathology-overlays.js?v=20260506-2
  function buildPathologyOverlayVisual({ flags, timeSec }) {
    if (
      !flags.floatersCase &&
      !flags.vitreousHaemorrhageCase &&
      !flags.partialRetinalDetachmentCase &&
      !flags.leucocoriaCase
    ) {
      return {
        background: "none",
        blurPx: 0,
        opacity: 0,
        transform: "none",
      };
    }
    if (flags.partialRetinalDetachmentCase) {
      return {
        background: `
        radial-gradient(
          ellipse 124% 98% at 18% 20%,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 1) 54%,
          rgba(0, 0, 0, 0.2) 54%,
          rgba(0, 0, 0, 0.2) 55.8%,
          rgba(0, 0, 0, 0) 56.2%
        ),
        radial-gradient(
          ellipse 124% 98% at 18% 20%,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0) 53.4%,
          rgba(0, 0, 0, 0.9) 53.4%,
          rgba(0, 0, 0, 0.9) 54.2%,
          rgba(0, 0, 0, 0) 55%
        )
      `,
        blurPx: 0,
        opacity: 0.98,
        transform: "none",
      };
    }
    if (flags.leucocoriaCase) {
      return {
        background: `
        radial-gradient(
          ellipse 17% 4.8% at 20% 42%,
          rgba(214, 28, 24, 0.92) 0%,
          rgba(214, 28, 24, 0.64) 44%,
          rgba(214, 28, 24, 0.24) 62%,
          rgba(142, 42, 42, 0) 76%
        ),
        radial-gradient(
          ellipse 16% 4.4% at 34% 39%,
          rgba(220, 32, 26, 0.88) 0%,
          rgba(220, 32, 26, 0.6) 44%,
          rgba(220, 32, 26, 0.24) 62%,
          rgba(146, 46, 46, 0) 76%
        ),
        radial-gradient(
          ellipse 18% 4.8% at 49% 41%,
          rgba(226, 36, 28, 0.88) 0%,
          rgba(226, 36, 28, 0.58) 44%,
          rgba(226, 36, 28, 0.24) 62%,
          rgba(150, 48, 48, 0) 76%
        ),
        radial-gradient(
          ellipse 17% 4.4% at 65% 44%,
          rgba(218, 30, 26, 0.84) 0%,
          rgba(218, 30, 26, 0.54) 44%,
          rgba(218, 30, 26, 0.22) 62%,
          rgba(146, 44, 44, 0) 76%
        ),
        radial-gradient(
          ellipse 15% 4% at 79% 46%,
          rgba(208, 26, 24, 0.76) 0%,
          rgba(208, 26, 24, 0.48) 42%,
          rgba(208, 26, 24, 0.2) 60%,
          rgba(142, 40, 40, 0) 74%
        ),
        radial-gradient(
          ellipse 16% 4.4% at 18% 61%,
          rgba(212, 24, 22, 0.86) 0%,
          rgba(212, 24, 22, 0.58) 42%,
          rgba(212, 24, 22, 0.22) 60%,
          rgba(138, 38, 38, 0) 74%
        ),
        radial-gradient(
          ellipse 18% 4.6% at 36% 58%,
          rgba(220, 28, 26, 0.84) 0%,
          rgba(220, 28, 26, 0.56) 42%,
          rgba(220, 28, 26, 0.22) 60%,
          rgba(144, 42, 42, 0) 74%
        ),
        radial-gradient(
          ellipse 17% 4.4% at 55% 60%,
          rgba(224, 30, 28, 0.82) 0%,
          rgba(224, 30, 28, 0.52) 42%,
          rgba(224, 30, 28, 0.22) 60%,
          rgba(148, 46, 46, 0) 74%
        ),
        radial-gradient(
          ellipse 16% 4% at 73% 57%,
          rgba(210, 26, 26, 0.74) 0%,
          rgba(210, 26, 26, 0.46) 40%,
          rgba(210, 26, 26, 0.2) 58%,
          rgba(142, 40, 40, 0) 72%
        ),
        radial-gradient(
          ellipse 20% 16% at 29% 34%,
          rgba(102, 102, 102, 0.82) 0%,
          rgba(102, 102, 102, 0.58) 32%,
          rgba(102, 102, 102, 0) 58%
        ),
        radial-gradient(
          ellipse 17% 14% at 68% 32%,
          rgba(112, 112, 112, 0.78) 0%,
          rgba(112, 112, 112, 0.52) 30%,
          rgba(112, 112, 112, 0) 56%
        ),
        radial-gradient(
          ellipse 18% 15% at 63% 69%,
          rgba(108, 108, 108, 0.74) 0%,
          rgba(108, 108, 108, 0.48) 30%,
          rgba(108, 108, 108, 0) 56%
        ),
        radial-gradient(
          ellipse 15% 12% at 44% 57%,
          rgba(118, 118, 118, 0.72) 0%,
          rgba(118, 118, 118, 0.46) 28%,
          rgba(118, 118, 118, 0) 52%
        ),
        radial-gradient(
          ellipse 24% 18% at 38% 42%,
          rgba(126, 126, 126, 0.7) 0%,
          rgba(126, 126, 126, 0.46) 30%,
          rgba(116, 116, 116, 0) 54%
        ),
        radial-gradient(
          ellipse 18% 14% at 62% 36%,
          rgba(136, 136, 136, 0.66) 0%,
          rgba(136, 136, 136, 0.42) 28%,
          rgba(136, 136, 136, 0) 50%
        ),
        radial-gradient(
          ellipse 22% 16% at 58% 64%,
          rgba(130, 130, 130, 0.62) 0%,
          rgba(130, 130, 130, 0.38) 30%,
          rgba(130, 130, 130, 0) 52%
        ),
        radial-gradient(
          ellipse 28% 22% at 34% 40%,
          rgba(156, 156, 156, 0.62) 0%,
          rgba(156, 156, 156, 0.38) 34%,
          rgba(156, 156, 156, 0) 58%
        ),
        radial-gradient(
          ellipse 22% 18% at 64% 34%,
          rgba(166, 166, 166, 0.56) 0%,
          rgba(166, 166, 166, 0.34) 30%,
          rgba(166, 166, 166, 0) 54%
        ),
        radial-gradient(
          ellipse 26% 20% at 58% 66%,
          rgba(146, 146, 146, 0.54) 0%,
          rgba(146, 146, 146, 0.32) 30%,
          rgba(146, 146, 146, 0) 54%
        ),
        radial-gradient(
          ellipse 20% 16% at 46% 54%,
          rgba(170, 170, 170, 0.46) 0%,
          rgba(170, 170, 170, 0.24) 28%,
          rgba(170, 170, 170, 0) 50%
        ),
        radial-gradient(
          ellipse 16% 14% at 72% 58%,
          rgba(156, 156, 156, 0.4) 0%,
          rgba(156, 156, 156, 0.2) 26%,
          rgba(156, 156, 156, 0) 48%
        ),
      radial-gradient(
        ellipse 88% 84% at 50% 50%,
        rgba(248, 238, 216, 0.64) 0%,
        rgba(236, 224, 198, 0.36) 26%,
        rgba(214, 200, 176, 0.12) 54%,
        rgba(194, 180, 156, 0.04) 82%,
        rgba(255, 248, 232, 0) 94%
      )
      `,
        blurPx: 0.09,
        opacity: 0.72,
        transform: "none",
      };
    }
    if (flags.vitreousHaemorrhageCase) {
      return {
        background: `
        radial-gradient(
          ellipse 88% 78% at 50% 50%,
          rgba(0, 0, 0, 0.54) 0%,
          rgba(0, 0, 0, 0.3) 40%,
          rgba(0, 0, 0, 0.08) 74%,
          rgba(0, 0, 0, 0) 92%
        ),
        radial-gradient(
          ellipse 28% 24% at 30% 40%,
          rgba(0, 0, 0, 0.96) 0%,
          rgba(0, 0, 0, 0.96) 54%,
          rgba(0, 0, 0, 0.78) 70%,
          rgba(0, 0, 0, 0) 84%
        ),
        radial-gradient(
          ellipse 22% 18% at 66% 56%,
          rgba(0, 0, 0, 0.92) 0%,
          rgba(0, 0, 0, 0.92) 54%,
          rgba(0, 0, 0, 0.74) 70%,
          rgba(0, 0, 0, 0) 84%
        ),
        radial-gradient(
          ellipse 18% 14% at 54% 26%,
          rgba(0, 0, 0, 0.88) 0%,
          rgba(0, 0, 0, 0.88) 52%,
          rgba(0, 0, 0, 0.68) 68%,
          rgba(0, 0, 0, 0) 82%
        )
      `,
        blurPx: 0.08,
        opacity: 0.96,
        transform: "none",
      };
    }
    const driftX =
      Math.sin(timeSec * 0.32) * 2.2 + Math.cos(timeSec * 0.21 + 0.4) * 1.1;
    const driftY =
      Math.cos(timeSec * 0.28 + 0.7) * 1.7 +
      Math.sin(timeSec * 0.18 + 1.1) * 0.8;
    return {
      background: `
      radial-gradient(
        ellipse 13% 10% at 28% 38%,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 1) 58%,
        rgba(0, 0, 0, 0.84) 72%,
        rgba(0, 0, 0, 0) 84%
      ),
      radial-gradient(
        ellipse 7% 5% at 32% 35%,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.96) 54%,
        rgba(0, 0, 0, 0.76) 68%,
        rgba(0, 0, 0, 0) 80%
      ),
      radial-gradient(
        ellipse 11% 14% at 72% 62%,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 1) 58%,
        rgba(0, 0, 0, 0.82) 72%,
        rgba(0, 0, 0, 0) 84%
      ),
      radial-gradient(
        ellipse 6% 8% at 67% 58%,
        rgba(0, 0, 0, 0.94) 0%,
        rgba(0, 0, 0, 0.94) 52%,
        rgba(0, 0, 0, 0.74) 66%,
        rgba(0, 0, 0, 0) 78%
      )
    `,
      blurPx: 0,
      opacity: 0.98,
      transform: `translate(${driftX.toFixed(2)}px, ${driftY.toFixed(2)}px)`,
    };
  }

  // src/retinoscopy-active-reflex.js?v=20260506-3
  function isWithMovement(currentRefraction) {
    if (currentRefraction === REFRACTION_VALUES.ZERO) {
      return null;
    }
    return currentRefraction.includes(REFRACTION_VALUES.PLUS);
  }
  function getReflexScale(currentRefraction) {
    switch (currentRefraction) {
      case REFRACTION_VALUES.HIGH_MINUS:
      case REFRACTION_VALUES.HIGH_PLUS:
        return 0.1;
      case REFRACTION_VALUES.MINUS:
      case REFRACTION_VALUES.PLUS:
        return 0.3;
      default:
        return 0.2;
    }
  }
  function buildActiveReflexVisual({
    activeRefraction,
    axisDeltaRad,
    cataractLevel,
    cylinderAxisDeg,
    currentRefraction,
    flags,
    movementSign,
    retStreakOffset,
    timeSec,
  }) {
    let background = DEFAULT_REFLEX_BACKGROUND;
    let shift = 0;
    let opacity = Math.abs(retStreakOffset) < 1 ? 1 : 0.6;
    let extraTransform = "";
    let blurPx = 0;
    if (flags.scissorsCase) {
      const lobeSpread = Math.min(25, 10 + Math.abs(retStreakOffset) * 0.4);
      const skew = Math.max(-16, Math.min(16, retStreakOffset * 0.22));
      const leftX = (50 - lobeSpread + skew).toFixed(1);
      const rightX = (50 + lobeSpread + skew).toFixed(1);
      const upperY = (37 - skew * 0.35).toFixed(1);
      const lowerY = (63 + skew * 0.35).toFixed(1);
      background = `
      radial-gradient(
        ellipse 46% 42% at ${leftX}% ${upperY}%,
        rgba(255, 255, 255, 0.86) 0%,
        rgba(255, 255, 255, 0.3) 34%,
        rgba(255, 255, 255, 0.05) 62%,
        rgba(255, 255, 255, 0) 76%
      ),
      radial-gradient(
        ellipse 46% 42% at ${rightX}% ${lowerY}%,
        rgba(255, 255, 255, 0.86) 0%,
        rgba(255, 255, 255, 0.3) 34%,
        rgba(255, 255, 255, 0.05) 62%,
        rgba(255, 255, 255, 0) 76%
      )
    `;
      shift = retStreakOffset * 0.05;
      extraTransform = " scale(1.06, 1.02)";
      blurPx = 0.62;
      opacity = Math.abs(retStreakOffset) < 1 ? 0.8 : 0.74;
    } else if (flags.keratoconusCase) {
      const coneOscillation = Math.sin(timeSec * 3.2 + axisDeltaRad * 1.35);
      const coneBias = 12 + 3.4 * Math.sin(timeSec * 0.65);
      const apexX = (50 - coneBias).toFixed(1);
      const apexY = (63 + coneOscillation * 4).toFixed(1);
      const tailX = (52 + coneBias * 0.35).toFixed(1);
      const tailY = (39 - coneOscillation * 2.6).toFixed(1);
      background = `
      radial-gradient(
        ellipse 58% 50% at ${apexX}% ${apexY}%,
        rgba(255, 255, 255, 0.98) 0%,
        rgba(255, 255, 255, 0.34) 28%,
        rgba(255, 255, 255, 0.06) 58%,
        rgba(255, 255, 255, 0) 74%
      ),
      radial-gradient(
        ellipse 48% 44% at ${tailX}% ${tailY}%,
        rgba(255, 255, 255, 0.62) 0%,
        rgba(255, 255, 255, 0.22) 34%,
        rgba(255, 255, 255, 0.04) 60%,
        rgba(255, 255, 255, 0) 74%
      ),
      radial-gradient(
        ellipse 28% 24% at 52% 53%,
        rgba(0, 0, 0, 0.72) 0%,
        rgba(0, 0, 0, 0.36) 44%,
        rgba(0, 0, 0, 0) 72%
      )
    `;
      shift =
        retStreakOffset * movementSign * 0.18 +
        Math.sin(timeSec * 5.9 + axisDeltaRad) * 1.3;
      extraTransform = " scale(1.26, 1.14)";
      blurPx = 1.12 + (1 - Math.abs(movementSign)) * 1.22;
      opacity = Math.abs(retStreakOffset) < 1 ? 0.84 : 0.7;
    } else if (flags.aphakiaCase) {
      background = `
      radial-gradient(
        ellipse 40% 48% at 50% 50%,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 1) 22%,
        rgba(255, 255, 255, 0.88) 42%,
        rgba(255, 255, 255, 0.28) 62%,
        rgba(255, 255, 255, 0) 74%
      ),
      radial-gradient(
        ellipse 96% 82% at 50% 50%,
        rgba(255, 255, 255, 0.82) 0%,
        rgba(255, 255, 255, 0.42) 38%,
        rgba(255, 255, 255, 0.14) 66%,
        rgba(255, 255, 255, 0) 88%
      )
    `;
      shift = retStreakOffset * 0.06;
      extraTransform = " scale(1.02, 1.06)";
      blurPx = 0.08;
      opacity = Math.abs(retStreakOffset) < 1 ? 1 : 0.96;
    } else if (flags.cornealScarCase) {
      const scarAngle = ((cylinderAxisDeg + 22) % 180) * 2;
      background = `
      conic-gradient(
        from ${scarAngle.toFixed(1)}deg at 50% 50%,
        rgba(0, 0, 0, 1) 0deg,
        rgba(0, 0, 0, 0.96) 64deg,
        rgba(0, 0, 0, 0.78) 108deg,
        rgba(0, 0, 0, 0.46) 148deg,
        rgba(18, 18, 18, 0) 360deg
      ),
      radial-gradient(
        ellipse 34% 48% at 50% 50%,
        rgba(0, 0, 0, 0.82) 0%,
        rgba(0, 0, 0, 0.46) 30%,
        rgba(0, 0, 0, 0.16) 56%,
        rgba(0, 0, 0, 0) 74%
      ),
      radial-gradient(
        ellipse at 50% 50%,
        rgba(255, 255, 255, 0.22) 16%,
        rgba(255, 255, 255, 0.06) 42%,
        rgba(255, 255, 255, 0.015) 74%,
        rgba(255, 255, 255, 0) 82%
      )
    `;
      shift = retStreakOffset * 0.12;
      extraTransform = " scale(1.09, 1.05)";
      blurPx = 1.35;
      opacity = Math.abs(retStreakOffset) < 1 ? 0.84 : 0.72;
    } else if (flags.vitreousHaemorrhageCase) {
      background = `
      radial-gradient(
        ellipse 82% 70% at 50% 50%,
        rgba(255, 255, 255, 0.72) 0%,
        rgba(255, 255, 255, 0.2) 34%,
        rgba(255, 255, 255, 0.04) 70%,
        rgba(255, 255, 255, 0) 86%
      )
    `;
      shift = retStreakOffset * 0.08;
      extraTransform = " scale(1.04, 1.02)";
      blurPx = 0.58;
      opacity = Math.abs(retStreakOffset) < 1 ? 0.8 : 0.68;
    } else if (flags.floatersCase) {
      background = `
      radial-gradient(
        ellipse 78% 66% at 50% 50%,
        rgba(255, 255, 255, 0.94) 0%,
        rgba(255, 255, 255, 0.34) 34%,
        rgba(255, 255, 255, 0.04) 68%,
        rgba(255, 255, 255, 0) 84%
      )
    `;
      shift = retStreakOffset * 0.16;
      extraTransform = " scale(1.03, 1.02)";
      blurPx = 0.08;
      opacity = Math.abs(retStreakOffset) < 1 ? 1 : 0.92;
    } else if (flags.partialRetinalDetachmentCase) {
      const rdOffsetAbs = Math.abs(retStreakOffset);
      background = `
      radial-gradient(
        ellipse 74% 60% at 56% 54%,
        rgba(255, 255, 255, 0.92) 0%,
        rgba(255, 255, 255, 0.28) 34%,
        rgba(255, 255, 255, 0.08) 64%,
        rgba(255, 255, 255, 0) 82%
      )
    `;
      shift = 0;
      extraTransform = " scale(1.06, 1.03)";
      blurPx = 0.1;
      if (rdOffsetAbs <= 20) {
        opacity = 0.88;
      } else if (rdOffsetAbs >= 42) {
        opacity = 0.05;
      } else {
        const fadeT = (rdOffsetAbs - 20) / 22;
        const smoothFadeT = fadeT * fadeT * (3 - 2 * fadeT);
        opacity = 0.88 - smoothFadeT * 0.83;
      }
    } else if (flags.poorTearFilmCase) {
      const shimmerX =
        50 +
        Math.sin(timeSec * 2.2) * 6 +
        Math.sin(timeSec * 3.7 + 1.2) * 2.2 +
        Math.sin(timeSec * 0.7 + 0.4) * 1.4;
      const shimmerY =
        50 +
        Math.cos(timeSec * 1.9 + 0.4) * 4 +
        Math.sin(timeSec * 3.1 + 0.9) * 1.3;
      const flickerRaw =
        0.55 +
        0.25 * Math.sin(timeSec * 2.6 + 0.9) +
        0.2 * Math.sin(timeSec * 4.9 + 0.2);
      const flicker = Math.max(0.08, Math.min(0.98, flickerRaw));
      background = `
      radial-gradient(
        ellipse at ${shimmerX.toFixed(1)}% ${shimmerY.toFixed(1)}%,
        rgba(255, 255, 255, 0.98) 14%,
        rgba(255, 255, 255, ${(0.22 + flicker * 0.24).toFixed(2)}) 36%,
        rgba(255, 255, 255, 0.04) 72%,
        rgba(255, 255, 255, 0) 82%
      )
    `;
      shift =
        retStreakOffset * 0.18 +
        Math.sin(timeSec * 3.8 + 0.6) * 1.2 +
        Math.sin(timeSec * 7.1 + 2.1) * 0.55;
      blurPx = 0.45 + flicker * 1.35;
      opacity = 0.34 + flicker * 0.5;
    } else if (flags.corticalCataractCase) {
      shift = retStreakOffset * 0.2;
      blurPx = flags.bigCorticalCataractCase ? 0.65 : 0.4;
      opacity =
        Math.abs(retStreakOffset) < 1
          ? flags.bigCorticalCataractCase
            ? 0.82
            : 0.88
          : flags.bigCorticalCataractCase
            ? 0.7
            : 0.78;
    } else if (flags.centralSubCorticalCataractCase) {
      background = `
      radial-gradient(
        ellipse 74% 68% at 50% 50%,
        rgba(255, 255, 255, 0.52) 0%,
        rgba(255, 255, 255, 0.18) 28%,
        rgba(255, 255, 255, 0.04) 58%,
        rgba(255, 255, 255, 0) 80%
      )
    `;
      shift = retStreakOffset * 0.2;
      blurPx = 0.88 + cataractLevel * 5e-3;
      opacity = Math.abs(retStreakOffset) < 1 ? 0.64 : 0.5;
    } else if (flags.posteriorPoleCataractCase) {
      background = `
      radial-gradient(
        ellipse 74% 68% at 50% 50%,
        rgba(255, 255, 255, 0.58) 0%,
        rgba(255, 255, 255, 0.16) 26%,
        rgba(255, 255, 255, 0.04) 54%,
        rgba(255, 255, 255, 0) 76%
      )
    `;
      shift = retStreakOffset * 0.18;
      blurPx = 1;
      opacity = Math.abs(retStreakOffset) < 1 ? 0.54 : 0.44;
    } else if (flags.posteriorCapsularThickeningCase) {
      background = `
      radial-gradient(
        ellipse 104% 86% at 50% 50%,
        rgba(255, 255, 255, 0.56) 0%,
        rgba(255, 255, 255, 0.24) 34%,
        rgba(255, 255, 255, 0.08) 62%,
        rgba(255, 255, 255, 0) 78%
      ),
      linear-gradient(
        23deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 36%,
        rgba(255, 255, 255, 0.34) 40%,
        rgba(255, 255, 255, 0.5) 42%,
        rgba(255, 255, 255, 0.14) 47%,
        rgba(255, 255, 255, 0) 54%
      ),
      linear-gradient(
        -18deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 42%,
        rgba(255, 255, 255, 0.3) 46%,
        rgba(255, 255, 255, 0.46) 48%,
        rgba(255, 255, 255, 0.13) 53%,
        rgba(255, 255, 255, 0) 60%
      ),
      radial-gradient(
        ellipse 18% 14% at 34% 35%,
        rgba(255, 255, 255, 0.52) 0%,
        rgba(255, 255, 255, 0.22) 42%,
        rgba(255, 255, 255, 0) 68%
      ),
      radial-gradient(
        ellipse 16% 13% at 64% 60%,
        rgba(255, 255, 255, 0.48) 0%,
        rgba(255, 255, 255, 0.2) 40%,
        rgba(255, 255, 255, 0) 68%
      )
    `;
      shift = retStreakOffset * 0.08;
      blurPx = 0.24;
      opacity = Math.abs(retStreakOffset) < 1 ? 0.82 : 0.7;
    } else if (flags.denseCataractCase) {
      background = `
      radial-gradient(
        ellipse 96% 88% at 50% 50%,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.84) 46%,
        rgba(0, 0, 0, 0.48) 74%,
        rgba(0, 0, 0, 0) 92%
      ),
      radial-gradient(
        ellipse 38% 32% at 34% 38%,
        rgba(0, 0, 0, 0.98) 0%,
        rgba(0, 0, 0, 0.98) 28%,
        rgba(0, 0, 0, 0.88) 38%,
        rgba(0, 0, 0, 0.28) 56%,
        rgba(0, 0, 0, 0) 66%
      ),
      radial-gradient(
        ellipse 34% 28% at 64% 32%,
        rgba(0, 0, 0, 0.98) 0%,
        rgba(0, 0, 0, 0.98) 24%,
        rgba(0, 0, 0, 0.82) 34%,
        rgba(0, 0, 0, 0.24) 52%,
        rgba(0, 0, 0, 0) 64%
      ),
      radial-gradient(
        ellipse 40% 34% at 60% 66%,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.96) 26%,
        rgba(0, 0, 0, 0.78) 38%,
        rgba(0, 0, 0, 0.18) 56%,
        rgba(0, 0, 0, 0) 68%
      ),
      radial-gradient(
        ellipse 28% 22% at 44% 58%,
        rgba(0, 0, 0, 0.92) 0%,
        rgba(0, 0, 0, 0.92) 28%,
        rgba(0, 0, 0, 0.68) 40%,
        rgba(0, 0, 0, 0.14) 56%,
        rgba(0, 0, 0, 0) 66%
      ),
      radial-gradient(
        ellipse 24% 18% at 72% 54%,
        rgba(0, 0, 0, 0.88) 0%,
        rgba(0, 0, 0, 0.88) 24%,
        rgba(0, 0, 0, 0.56) 36%,
        rgba(0, 0, 0, 0.12) 50%,
        rgba(0, 0, 0, 0) 60%
      ),
      radial-gradient(
        ellipse 72% 68% at 50% 50%,
        rgba(255, 255, 255, 0.03) 0%,
        rgba(255, 255, 255, 0.01) 34%,
        rgba(255, 255, 255, 0.003) 56%,
        rgba(0, 0, 0, 0) 72%
      )
    `;
      shift = retStreakOffset * 0.08;
      extraTransform = " scale(1.02, 1.02)";
      blurPx = 1.16;
      opacity = 0.82;
    } else if (flags.leucocoriaCase) {
      background = `
      radial-gradient(
        ellipse 58% 52% at 51% 50%,
        rgba(255, 251, 238, 0.98) 0%,
        rgba(255, 246, 224, 0.9) 30%,
        rgba(255, 236, 206, 0.54) 58%,
        rgba(255, 232, 202, 0.18) 82%,
        rgba(255, 245, 228, 0) 92%
      ),
      radial-gradient(
        ellipse 88% 78% at 50% 50%,
        rgba(248, 240, 220, 0.8) 0%,
        rgba(240, 228, 202, 0.42) 42%,
        rgba(224, 208, 182, 0.14) 72%,
        rgba(255, 245, 228, 0) 90%
      )
    `;
      shift = retStreakOffset * 0.03;
      extraTransform = " scale(1.1, 1.08)";
      blurPx = 0.12;
      opacity = Math.abs(retStreakOffset) < 1 ? 0.9 : 0.74;
    } else if (
      currentRefraction === REFRACTION_VALUES.HIGH_PLUS ||
      currentRefraction === REFRACTION_VALUES.HIGH_MINUS
    ) {
      const hotspotY =
        currentRefraction === REFRACTION_VALUES.HIGH_PLUS ? 28 : 72;
      const hotspotX = (
        50 + Math.max(-8, Math.min(8, retStreakOffset * 0.06))
      ).toFixed(1);
      background = `
      radial-gradient(
        ellipse 46% 30% at ${hotspotX}% ${hotspotY}%,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0.64) 24%,
        rgba(255, 255, 255, 0.18) 52%,
        rgba(255, 255, 255, 0) 74%
      ),
      radial-gradient(
        ellipse 74% 64% at 50% 50%,
        rgba(255, 255, 255, 0.92) 0%,
        rgba(255, 255, 255, 0.28) 42%,
        rgba(255, 255, 255, 0.06) 70%,
        rgba(255, 255, 255, 0) 84%
      )
    `;
      const shiftBase = retStreakOffset * getReflexScale(activeRefraction);
      const withMovement = isWithMovement(activeRefraction);
      shift =
        withMovement === true
          ? shiftBase
          : withMovement === false
            ? -shiftBase
            : 0;
      blurPx = 0.12;
      opacity = Math.abs(retStreakOffset) < 1 ? 1 : 0.76;
    } else if (flags.cylinderCase) {
      const highCylinder =
        currentRefraction === REFRACTION_VALUES.HIGH_CYLINDER;
      const movementMagnitude =
        Math.pow(Math.abs(movementSign), 0.9) * (highCylinder ? 0.75 : 0.58);
      shift = retStreakOffset * movementSign * movementMagnitude;
      const axisAlignment = Math.abs(Math.cos(axisDeltaRad));
      const minScaleX = highCylinder ? 0.34 : 0.52;
      const maxScaleX = highCylinder ? 1.45 : 1.24;
      const scaleX = minScaleX + (1 - axisAlignment) * (maxScaleX - minScaleX);
      const scaleY = highCylinder
        ? 1.08 + (1 - axisAlignment) * 0.24
        : 1.04 + (1 - axisAlignment) * 0.14;
      extraTransform = ` scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
      blurPx = (1 - axisAlignment) * (highCylinder ? 1.6 : 1.05);
      opacity =
        Math.abs(retStreakOffset) < 1
          ? 1
          : (highCylinder ? 0.28 : 0.38) +
            axisAlignment * (highCylinder ? 0.62 : 0.46);
    } else {
      const shiftBase = retStreakOffset * getReflexScale(activeRefraction);
      const withMovement = isWithMovement(activeRefraction);
      shift =
        withMovement === true
          ? shiftBase
          : withMovement === false
            ? -shiftBase
            : 0;
    }
    return {
      background,
      blurPx,
      extraTransform,
      opacity,
      shift,
    };
  }

  // src/structural-eye-effects.js
  function clearMirroredReflex(reflexElement) {
    if (!reflexElement) {
      return;
    }
    reflexElement.style.opacity = "0";
    reflexElement.style.background = "none";
    reflexElement.style.transform = "none";
    reflexElement.style.filter = "none";
  }
  function syncMirroredReflex({
    eye,
    reflexSelector,
    shouldShow,
    reflexBackground,
    reflexTransform,
    reflexOpacity,
    reflexFilter,
  }) {
    const reflexElement =
      eye == null ? void 0 : eye.querySelector(reflexSelector);
    if (!reflexElement) {
      return;
    }
    if (!shouldShow) {
      clearMirroredReflex(reflexElement);
      return;
    }
    reflexElement.style.background = reflexBackground;
    reflexElement.style.transform = reflexTransform;
    reflexElement.style.opacity = reflexOpacity;
    reflexElement.style.filter = reflexFilter;
  }
  function applyStructuralEyeState({ eye, eyeType, flags, isActiveEye }) {
    if (!eye) {
      return;
    }
    eye.classList.toggle(
      "is-corneal-scar",
      flags.cornealScarCase && isActiveEye,
    );
    const pupilElement = eye.querySelector(".pupil");
    const colobomaExtension = eye.querySelector(".coloboma-extension");
    const colobomaReflex = eye.querySelector(".coloboma-extension-reflex");
    const irisTransilluminationPatch = eye.querySelector(
      ".iris-transillumination-patch",
    );
    const irisTransilluminationReflex = eye.querySelector(
      ".iris-transillumination-reflex",
    );
    const baseSizePx = Math.max(
      10,
      parseFloat(
        (pupilElement == null ? void 0 : pupilElement.dataset.baseSizePx) || "",
      ) ||
        (pupilElement == null ? void 0 : pupilElement.clientWidth) ||
        32,
    );
    const applyAcg = flags.acgCase && isActiveEye;
    const applyAniridia = flags.aniridiaCase;
    const applyIrisTransillumination =
      flags.irisTransilluminationCase && isActiveEye;
    const applyNasalColoboma = flags.nasalColobomaCase && isActiveEye;
    const applySmallPupils = flags.smallPupilsCase;
    if (pupilElement) {
      let targetWidthPx = baseSizePx;
      let targetHeightPx = baseSizePx;
      if (applyAniridia) {
        const targetSizePx = Math.min(74, Math.max(66, baseSizePx * 2.25));
        targetWidthPx = targetSizePx;
        targetHeightPx = targetSizePx;
      } else if (applySmallPupils) {
        const targetSizePx = Math.max(18, Math.min(22, baseSizePx * 0.62));
        targetWidthPx = targetSizePx;
        targetHeightPx = targetSizePx;
      } else if (applyAcg) {
        targetWidthPx = Math.min(38, Math.max(34, baseSizePx * 1.08));
        targetHeightPx = Math.min(46, Math.max(40, baseSizePx * 1.34));
      }
      pupilElement.style.width = `${targetWidthPx}px`;
      pupilElement.style.height = `${targetHeightPx}px`;
      pupilElement.style.left = `calc(50% - ${targetWidthPx / 2}px)`;
      pupilElement.style.top = `calc(50% - ${targetHeightPx / 2}px)`;
    }
    if (colobomaExtension) {
      colobomaExtension.classList.toggle("is-visible", applyNasalColoboma);
      colobomaExtension.classList.toggle(
        "is-screen-left",
        applyNasalColoboma && eyeType === "left",
      );
      colobomaExtension.classList.toggle(
        "is-screen-right",
        applyNasalColoboma && eyeType === "right",
      );
    }
    if (!applyNasalColoboma) {
      clearMirroredReflex(colobomaReflex);
    }
    if (irisTransilluminationPatch) {
      irisTransilluminationPatch.classList.toggle(
        "is-visible",
        applyIrisTransillumination,
      );
      irisTransilluminationPatch.classList.toggle(
        "is-screen-left",
        applyIrisTransillumination && eyeType === "left",
      );
      irisTransilluminationPatch.classList.toggle(
        "is-screen-right",
        applyIrisTransillumination && eyeType === "right",
      );
    }
    if (!applyIrisTransillumination) {
      clearMirroredReflex(irisTransilluminationReflex);
    }
  }
  function syncStructuralReflexApertures({
    eye,
    flags,
    reflexBackground,
    reflexTransform,
    reflexOpacity,
    reflexFilter,
  }) {
    syncMirroredReflex({
      eye,
      reflexSelector: ".coloboma-extension-reflex",
      shouldShow: flags.nasalColobomaCase,
      reflexBackground,
      reflexTransform,
      reflexOpacity,
      reflexFilter,
    });
    syncMirroredReflex({
      eye,
      reflexSelector: ".iris-transillumination-reflex",
      shouldShow: flags.irisTransilluminationCase,
      reflexBackground,
      reflexTransform,
      reflexOpacity,
      reflexFilter,
    });
  }
  function updateLightResponsivePupilScale({
    eye,
    flags,
    isActiveEye,
    pupilRadiusPx,
    sweepX,
    sweepY,
    maxConstriction = 0.075,
  }) {
    const iris = eye == null ? void 0 : eye.querySelector(".iris");
    if (!iris) {
      return;
    }
    if (flags.acgCase && isActiveEye) {
      iris.style.setProperty("--light-pupil-scale", "1");
      return;
    }
    const distancePx = Math.hypot(sweepX, sweepY);
    const responseRadiusPx = Math.max(1, pupilRadiusPx * 1.18);
    const rawT = Math.max(0, Math.min(1, distancePx / responseRadiusPx));
    const smoothT = rawT * rawT * (3 - 2 * rawT);
    const constrictionAmount = (1 - smoothT) * maxConstriction;
    const pupilScale = 1 - constrictionAmount;
    iris.style.setProperty("--light-pupil-scale", pupilScale.toFixed(3));
  }

  // src/retinoscopy.js?v=20260506-8
  function createRetinoscopyController({ state, dom }) {
    const GLOBAL_REFLEX_BRIGHTNESS_BOOST = 1.12;
    const GLOBAL_REFLEX_OPACITY_BOOST = 1.1;
    const FELLOW_EYE_REFLEX_BACKGROUND =
      "radial-gradient(ellipse at 50% 50%, rgba(94, 94, 94, 0.32) 14%, rgba(58, 58, 58, 0.08) 58%, rgba(40, 40, 40, 0.01) 76%, rgba(32, 32, 32, 0) 88%)";
    const FELLOW_EYE_REFLEX_BRIGHTNESS_SCALE = 0.22;
    const FELLOW_EYE_REFLEX_OPACITY_SCALE = 0.12;
    const FELLOW_EYE_REFLEX_BLUR_PX = 0.5;
    const CORNEAL_LIGHT_SHIFT_FACTOR = 0.02;
    const CORNEAL_LIGHT_SHIFT_X_LIMIT_PX = 0.8;
    const CORNEAL_LIGHT_SHIFT_Y_LIMIT_PX = 0.6;
    let lastMovementStatusHtml = "";
    let hasUserSweptSinceRefractionChange = false;
    function setMovementStatusVisible(isVisible) {
      if (!dom.movementStatusLabel) {
        return;
      }
      dom.movementStatusLabel.classList.toggle(
        "is-visible",
        !state.isTestMode && isVisible,
      );
    }
    function updateMovementStatusLabel(html) {
      if (!dom.movementStatusLabel || html === lastMovementStatusHtml) {
        return;
      }
      const emphasisMatch = html.match(/^<em>([^<]*)<\/em>\s*(.*)$/);
      if (!emphasisMatch) {
        dom.movementStatusLabel.textContent = html;
        lastMovementStatusHtml = html;
        return;
      }
      const emphasis = document.createElement("em");
      emphasis.textContent = emphasisMatch[1];
      dom.movementStatusLabel.replaceChildren(
        emphasis,
        document.createTextNode(` ${emphasisMatch[2]}`),
      );
      lastMovementStatusHtml = html;
    }
    function applyRetEyeClasses(activeEye) {
      dom.eyes.forEach((eye) => {
        const isActive = eye.dataset.eye === activeEye;
        eye.classList.toggle("is-ret-active", isActive);
        eye.classList.toggle("is-ret-fellow", !isActive);
      });
    }
    function clamp2(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }
    function getFellowEyeFocusBalance({
      beamCentre,
      eyeType,
      pupilRadiusPx,
      sweepX,
      sweepY,
      wrapperRect,
    }) {
      const currentDistancePx = Math.hypot(sweepX, sweepY);
      const fellowEye = eyeType === "left" ? dom.rightEye : dom.leftEye;
      const fellowPupilCentre = getPupilCentreInWrapper(
        fellowEye == null ? void 0 : fellowEye.querySelector(".pupil"),
        wrapperRect,
      );
      const fellowDistancePx =
        beamCentre && fellowPupilCentre
          ? Math.hypot(
              beamCentre.x - fellowPupilCentre.x,
              beamCentre.y - fellowPupilCentre.y,
            )
          : currentDistancePx;
      const distanceGapPx = Math.max(0, currentDistancePx - fellowDistancePx);
      const responseRadiusPx = Math.max(72, pupilRadiusPx * 4.8);
      const rawT = Math.max(0, Math.min(1, distanceGapPx / responseRadiusPx));
      const smoothT = rawT * rawT * (3 - 2 * rawT);
      return {
        currentDistancePx,
        fellowDistancePx,
        smoothT,
      };
    }
    function updateCornealReflex({
      beamCentre,
      eye,
      eyeType,
      lightOffsetX = 0,
      lightOffsetY = 0,
      pupilRadiusPx,
      sweepX,
      sweepY,
      wrapperRect,
    }) {
      if (!eye) {
        return;
      }
      const { currentDistancePx, fellowDistancePx } = getFellowEyeFocusBalance({
        beamCentre,
        eyeType,
        pupilRadiusPx,
        sweepX,
        sweepY,
        wrapperRect,
      });
      const responseRadiusPx = Math.max(72, pupilRadiusPx * 4.8);
      const directionalGapPx = fellowDistancePx - currentDistancePx;
      const rawT = Math.max(
        0,
        Math.min(1, Math.abs(directionalGapPx) / responseRadiusPx),
      );
      const smoothT = rawT * rawT * (3 - 2 * rawT);
      const cornealReflexScale =
        directionalGapPx > 0 ? 1 + smoothT * 0.2 : 1 - smoothT * 0.14;
      eye.style.setProperty(
        "--corneal-reflex-scale",
        cornealReflexScale.toFixed(3),
      );
      eye.style.setProperty(
        "--corneal-reflex-light-x",
        `${clamp2(
          lightOffsetX * CORNEAL_LIGHT_SHIFT_FACTOR,
          -CORNEAL_LIGHT_SHIFT_X_LIMIT_PX,
          CORNEAL_LIGHT_SHIFT_X_LIMIT_PX,
        ).toFixed(2)}px`,
      );
      eye.style.setProperty(
        "--corneal-reflex-light-y",
        `${clamp2(
          lightOffsetY * CORNEAL_LIGHT_SHIFT_FACTOR,
          -CORNEAL_LIGHT_SHIFT_Y_LIMIT_PX,
          CORNEAL_LIGHT_SHIFT_Y_LIMIT_PX,
        ).toFixed(2)}px`,
      );
    }
    function updateRetStreakPosition() {
      const { retStreak, eyesWrapper } = dom;
      if (!retStreak || !eyesWrapper) {
        return;
      }
      const targetEye =
        state.activeRetEye === "left" ? dom.leftEye : dom.rightEye;
      if (!targetEye) {
        return;
      }
      const pupil = targetEye.querySelector(".pupil");
      if (!pupil) {
        return;
      }
      const wrapperRect = eyesWrapper.getBoundingClientRect();
      const pupilRect = pupil.getBoundingClientRect();
      const pupilCentreX =
        (pupilRect.left + pupilRect.right) / 2 - wrapperRect.left;
      const pupilCentreY =
        (pupilRect.top + pupilRect.bottom) / 2 - wrapperRect.top;
      retStreak.style.left = `${pupilCentreX}px`;
      retStreak.style.top = `${pupilCentreY}px`;
    }
    function updateRetStreakTransform() {
      const { retStreak } = dom;
      if (!retStreak) {
        return;
      }
      retStreak.style.transform = `
    translate(-50%, -50%)
    rotate(${state.retStreakRotation}deg)
    translateX(${state.retStreakOffset}px)
  `;
    }
    function getPupilCentreInWrapper(pupilElement, wrapperRect) {
      if (!pupilElement || !wrapperRect) {
        return null;
      }
      const pupilRect = pupilElement.getBoundingClientRect();
      return {
        x: (pupilRect.left + pupilRect.right) / 2 - wrapperRect.left,
        y: (pupilRect.top + pupilRect.bottom) / 2 - wrapperRect.top,
      };
    }
    function getRetStreakCentreInWrapper(wrapperRect) {
      if (!dom.retStreak || !wrapperRect) {
        return null;
      }
      const streakRect = dom.retStreak.getBoundingClientRect();
      return {
        x: (streakRect.left + streakRect.right) / 2 - wrapperRect.left,
        y: (streakRect.top + streakRect.bottom) / 2 - wrapperRect.top,
      };
    }
    function updateCorticalCataractMask(maskElement, isActiveEye, flags) {
      if (!maskElement) {
        return;
      }
      const shouldShowMask = flags.corticalCataractCase && isActiveEye;
      if (!shouldShowMask) {
        maskElement.style.opacity = "0";
        maskElement.style.background = "none";
        maskElement.style.maskImage = "none";
        maskElement.style.webkitMaskImage = "none";
        return;
      }
      const isLargePattern = flags.bigCorticalCataractCase;
      const pattern =
        state.corticalCataractPattern ||
        createCorticalCataractPattern(isLargePattern);
      state.corticalCataractPattern = pattern;
      maskElement.style.background = buildCorticalCataractOverlay(pattern);
      const maskImage = isLargePattern
        ? `radial-gradient(
          circle at 50% 50%,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0) 18%,
          rgba(0, 0, 0, 0.36) 42%,
          rgba(0, 0, 0, 0.92) 74%,
          rgba(0, 0, 0, 1) 100%
        )`
        : `radial-gradient(
          circle at 50% 50%,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0) 18%,
          rgba(0, 0, 0, 0.34) 46%,
          rgba(0, 0, 0, 0.9) 76%,
          rgba(0, 0, 0, 1) 100%
        )`;
      maskElement.style.maskImage = maskImage;
      maskElement.style.webkitMaskImage = maskImage;
      maskElement.style.filter = isLargePattern
        ? "blur(0.36px)"
        : "blur(0.24px)";
      maskElement.style.opacity = isLargePattern ? "0.94" : "0.9";
    }
    function clearPathologyOverlay(overlayElement) {
      if (!overlayElement) {
        return;
      }
      overlayElement.style.opacity = "0";
      overlayElement.style.background = "none";
      overlayElement.style.transform = "none";
      overlayElement.style.filter = "none";
    }
    function getPathologyIlluminationFactor({
      flags,
      pupilRadiusPx,
      sweepX,
      sweepY,
    }) {
      if (flags.partialRetinalDetachmentCase) {
        return 1;
      }
      if (flags.leucocoriaCase) {
        const distancePx2 = Math.hypot(sweepX, sweepY);
        const fadeStartPx2 = pupilRadiusPx * 0.55;
        const fadeEndPx2 = pupilRadiusPx * 2.8;
        const fadeRangePx2 = Math.max(1, fadeEndPx2 - fadeStartPx2);
        const rawT2 = Math.max(
          0,
          Math.min(1, (distancePx2 - fadeStartPx2) / fadeRangePx2),
        );
        const smoothT2 = rawT2 * rawT2 * (3 - 2 * rawT2);
        const shapedT2 = Math.pow(smoothT2, 1.45);
        return 0.8 + (1 - shapedT2) * 0.16;
      }
      if (!flags.floatersCase && !flags.vitreousHaemorrhageCase) {
        return 0;
      }
      const distancePx = Math.hypot(sweepX, sweepY);
      const fadeStartPx =
        pupilRadiusPx * (flags.vitreousHaemorrhageCase ? 0.74 : 0.84);
      const fadeEndPx =
        pupilRadiusPx * (flags.vitreousHaemorrhageCase ? 6.1 : 6.4);
      const fadeRangePx = Math.max(1, fadeEndPx - fadeStartPx);
      const rawT = Math.max(
        0,
        Math.min(1, (distancePx - fadeStartPx) / fadeRangePx),
      );
      const smoothT = rawT * rawT * (3 - 2 * rawT);
      const shapedT = Math.pow(
        smoothT,
        flags.vitreousHaemorrhageCase ? 1.35 : 1.55,
      );
      const minimumVisibility = flags.vitreousHaemorrhageCase ? 0.26 : 0.18;
      return minimumVisibility + (1 - shapedT) * (1 - minimumVisibility);
    }
    function updatePathologyOverlay({
      flags,
      isActiveEye,
      overlayElement,
      pupilRadiusPx,
      sweepX,
      sweepY,
      timeSec,
    }) {
      if (!overlayElement || !isActiveEye) {
        clearPathologyOverlay(overlayElement);
        return;
      }
      const overlayVisual = buildPathologyOverlayVisual({ flags, timeSec });
      if (overlayVisual.opacity <= 0 || overlayVisual.background === "none") {
        clearPathologyOverlay(overlayElement);
        return;
      }
      const illuminationFactor = getPathologyIlluminationFactor({
        flags,
        pupilRadiusPx,
        sweepX,
        sweepY,
      });
      if (illuminationFactor <= 0.01) {
        clearPathologyOverlay(overlayElement);
        return;
      }
      overlayElement.style.background = overlayVisual.background;
      overlayElement.style.transform = overlayVisual.transform || "none";
      overlayElement.style.filter =
        overlayVisual.blurPx > 0.01
          ? `blur(${overlayVisual.blurPx.toFixed(2)}px)`
          : "none";
      overlayElement.style.opacity = Math.min(
        1,
        overlayVisual.opacity * illuminationFactor,
      ).toFixed(3);
    }
    function updateFellowEyeReflex({
      cataractVisual,
      pupilRadiusPx,
      reflex,
      reflexCompX,
      reflexCompY,
      sweepX,
      sweepY,
    }) {
      const distancePx = Math.hypot(sweepX, sweepY);
      const fadeStartPx = pupilRadiusPx * 0.02;
      const fadeEndPx = pupilRadiusPx * 0.62;
      const fadeRangePx = Math.max(1, fadeEndPx - fadeStartPx);
      const rawT = Math.max(
        0,
        Math.min(1, (distancePx - fadeStartPx) / fadeRangePx),
      );
      const smoothT = rawT * rawT * (3 - 2 * rawT);
      const sweepIllumination = 1 - smoothT;
      const opacityVisibility = Math.pow(sweepIllumination, 2.6);
      const brightnessVisibility = Math.pow(sweepIllumination, 2.15);
      reflex.style.background = FELLOW_EYE_REFLEX_BACKGROUND;
      reflex.style.transform = `translate(${-reflexCompX}px, ${-reflexCompY}px) rotate(${state.retStreakRotation}deg)`;
      reflex.style.opacity = Math.min(
        1,
        0.085 *
          opacityVisibility *
          cataractVisual.opacityScale *
          GLOBAL_REFLEX_OPACITY_BOOST *
          FELLOW_EYE_REFLEX_OPACITY_SCALE,
      );
      const brightnessScale =
        brightnessVisibility *
        cataractVisual.brightnessScale *
        GLOBAL_REFLEX_BRIGHTNESS_BOOST *
        FELLOW_EYE_REFLEX_BRIGHTNESS_SCALE;
      const filterParts = [`blur(${FELLOW_EYE_REFLEX_BLUR_PX.toFixed(2)}px)`];
      if (Math.abs(brightnessScale - 1) > 0.01) {
        filterParts.push(`brightness(${brightnessScale.toFixed(2)})`);
      }
      reflex.style.filter = filterParts.join(" ");
    }
    function updateActiveEyeReflex({
      angleRad,
      axisDeltaRad,
      beamOffsetX,
      beamOffsetY,
      cataractVisual,
      cylinderAxisDeg,
      eye,
      flags,
      movementSign,
      pupilRadiusPx,
      reflex,
      reflexCompX,
      reflexCompY,
      timeSec,
    }) {
      const reflexVisual = buildActiveReflexVisual({
        activeRefraction: getActiveRefractionForMode(
          state.currentRefraction,
          state.activeRetEye,
        ),
        axisDeltaRad,
        cataractLevel: state.cataractLevel,
        cylinderAxisDeg,
        currentRefraction: state.currentRefraction,
        flags,
        movementSign,
        retStreakOffset: state.retStreakOffset,
        timeSec,
      });
      reflex.style.background = reflexVisual.background;
      const shiftX = reflexVisual.shift * Math.cos(angleRad) - reflexCompX;
      const shiftY = reflexVisual.shift * Math.sin(angleRad) - reflexCompY;
      const sweepX = Number.isFinite(beamOffsetX)
        ? beamOffsetX
        : state.retStreakOffset * Math.cos(angleRad) - reflexCompX;
      const sweepY = Number.isFinite(beamOffsetY)
        ? beamOffsetY
        : state.retStreakOffset * Math.sin(angleRad) - reflexCompY;
      const { edgeBlurBoostPx, edgeBrightnessScale, edgeOpacityScale } =
        getEdgeVisualState({
          probeOffsetX: sweepX,
          probeOffsetY: sweepY,
          pupilRadiusPx,
        });
      let transformStr = `translate(${shiftX}px, ${shiftY}px) rotate(${state.retStreakRotation}deg)`;
      if (
        state.currentRefraction === REFRACTION_VALUES.HIGH_MINUS ||
        state.currentRefraction === REFRACTION_VALUES.HIGH_PLUS
      ) {
        transformStr += " scale(0.6)";
      }
      transformStr += reflexVisual.extraTransform;
      reflex.style.transform = transformStr;
      const adjustedOpacity =
        reflexVisual.opacity *
        edgeOpacityScale *
        cataractVisual.opacityScale *
        GLOBAL_REFLEX_OPACITY_BOOST;
      reflex.style.opacity = Math.max(0.015, Math.min(adjustedOpacity, 1));
      const totalBlurPx =
        reflexVisual.blurPx + cataractVisual.blurBoostPx + edgeBlurBoostPx;
      const filterParts = [];
      if (totalBlurPx > 0.01) {
        filterParts.push(`blur(${totalBlurPx.toFixed(2)}px)`);
      }
      const totalBrightnessScale =
        cataractVisual.brightnessScale *
        edgeBrightnessScale *
        GLOBAL_REFLEX_BRIGHTNESS_BOOST;
      if (Math.abs(totalBrightnessScale - 1) > 0.01) {
        filterParts.push(`brightness(${totalBrightnessScale.toFixed(2)})`);
      }
      reflex.style.filter = filterParts.length ? filterParts.join(" ") : "none";
      syncStructuralReflexApertures({
        eye,
        flags,
        reflexBackground: reflex.style.background,
        reflexTransform: reflex.style.transform,
        reflexOpacity: reflex.style.opacity,
        reflexFilter: reflex.style.filter,
      });
    }
    function updateRetReflex() {
      var _a;
      const activeRefraction = getActiveRefractionForMode(
        state.currentRefraction,
        state.activeRetEye,
      );
      const flags = getCaseFlags(state.currentRefraction);
      const cylinderAxisDeg =
        typeof state.cylinderAxisDeg === "number" ? state.cylinderAxisDeg : 0;
      const rotationNorm = normalizeTo180(state.retStreakRotation);
      const axisDeltaDeg = smallestAxisDifference(
        rotationNorm,
        cylinderAxisDeg,
      );
      const axisDeltaRad = (axisDeltaDeg * Math.PI) / 180;
      const movementSign = Math.cos(axisDeltaRad * 2);
      const cataractVisual = getCataractVisualState(state.cataractLevel);
      const hasActiveSweep =
        hasUserSweptSinceRefractionChange &&
        Math.abs(state.retStreakOffset) >= 1;
      const angleRad = state.retStreakRotation * (Math.PI / 180);
      const timeSec = performance.now() / 1e3;
      const wrapperRect =
        ((_a = dom.eyesWrapper) == null
          ? void 0
          : _a.getBoundingClientRect()) || null;
      const activeEyeElement =
        state.activeRetEye === "left" ? dom.leftEye : dom.rightEye;
      const activePupilElement =
        (activeEyeElement == null
          ? void 0
          : activeEyeElement.querySelector(".pupil")) || null;
      const activePupilCentre = getPupilCentreInWrapper(
        activePupilElement,
        wrapperRect,
      );
      const renderedBeamCentre = getRetStreakCentreInWrapper(wrapperRect);
      const fallbackBeamCentre = activePupilCentre
        ? {
            x: activePupilCentre.x + state.retStreakOffset * Math.cos(angleRad),
            y: activePupilCentre.y + state.retStreakOffset * Math.sin(angleRad),
          }
        : null;
      const beamCentre = renderedBeamCentre || fallbackBeamCentre;
      setMovementStatusVisible(hasActiveSweep);
      updateMovementStatusLabel(
        getMovementStatusHtml({
          activeEye: state.activeRetEye,
          activeRefraction,
          currentRefraction: state.currentRefraction,
          flags,
          movementSign,
        }),
      );
      dom.retReflexElements.forEach((reflex) => {
        var _a2, _b, _c, _d, _e, _f, _g, _h;
        const eye = reflex.closest(".eye");
        const eyeType = eye == null ? void 0 : eye.dataset.eye;
        const isActiveEye = eyeType === state.activeRetEye;
        applyStructuralEyeState({ eye, eyeType, flags, isActiveEye });
        const iris = eye == null ? void 0 : eye.querySelector(".iris");
        const pupil = eye == null ? void 0 : eye.querySelector(".pupil");
        const corticalCataractMask =
          eye == null ? void 0 : eye.querySelector(".cortical-cataract-mask");
        const centralSubcorticalMask =
          eye == null ? void 0 : eye.querySelector(".central-subcortical-mask");
        const pathologyOverlay =
          eye == null ? void 0 : eye.querySelector(".pathology-overlay");
        const pupilRadiusPx = Math.max(
          8,
          ((pupil == null ? void 0 : pupil.clientWidth) || 32) * 0.5,
        );
        const pupilCentre = getPupilCentreInWrapper(pupil, wrapperRect);
        const totalEyeOffsetX =
          (((_a2 = iris == null ? void 0 : iris.nystagmusOffset) == null
            ? void 0
            : _a2.x) || 0) +
          (((_b = iris == null ? void 0 : iris.microOffset) == null
            ? void 0
            : _b.x) || 0) +
          (((_c = iris == null ? void 0 : iris.backgroundOffset) == null
            ? void 0
            : _c.x) || 0) +
          (((_d = iris == null ? void 0 : iris.gazeOffset) == null
            ? void 0
            : _d.x) || 0);
        const totalEyeOffsetY =
          (((_e = iris == null ? void 0 : iris.nystagmusOffset) == null
            ? void 0
            : _e.y) || 0) +
          (((_f = iris == null ? void 0 : iris.microOffset) == null
            ? void 0
            : _f.y) || 0) +
          (((_g = iris == null ? void 0 : iris.backgroundOffset) == null
            ? void 0
            : _g.y) || 0) +
          (((_h = iris == null ? void 0 : iris.gazeOffset) == null
            ? void 0
            : _h.y) || 0);
        const shouldCompensateEyeMotion =
          state.nystagmusLevel > 0 || state.isGazeMode;
        const reflexCompX = shouldCompensateEyeMotion ? totalEyeOffsetX : 0;
        const reflexCompY = shouldCompensateEyeMotion ? totalEyeOffsetY : 0;
        const beamOffsetX =
          beamCentre && pupilCentre
            ? beamCentre.x - pupilCentre.x
            : state.retStreakOffset * Math.cos(angleRad) - reflexCompX;
        const beamOffsetY =
          beamCentre && pupilCentre
            ? beamCentre.y - pupilCentre.y
            : state.retStreakOffset * Math.sin(angleRad) - reflexCompY;
        updateLightResponsivePupilScale({
          eye,
          flags,
          isActiveEye,
          pupilRadiusPx,
          sweepX: beamOffsetX,
          sweepY: beamOffsetY,
        });
        updateCornealReflex({
          beamCentre,
          eye,
          eyeType,
          lightOffsetX: beamOffsetX,
          lightOffsetY: beamOffsetY,
          pupilRadiusPx,
          sweepX: beamOffsetX,
          sweepY: beamOffsetY,
          wrapperRect,
        });
        updateCentralMediaMask({
          maskElement: centralSubcorticalMask,
          flags,
          isActiveEye,
        });
        updateCorticalCataractMask(corticalCataractMask, isActiveEye, flags);
        updatePathologyOverlay({
          flags,
          isActiveEye,
          overlayElement: pathologyOverlay,
          pupilRadiusPx,
          sweepX: beamOffsetX,
          sweepY: beamOffsetY,
          timeSec,
        });
        if (!isActiveEye) {
          updateFellowEyeReflex({
            cataractVisual,
            pupilRadiusPx,
            reflex,
            reflexCompX,
            reflexCompY,
            sweepX: beamOffsetX,
            sweepY: beamOffsetY,
          });
          return;
        }
        updateActiveEyeReflex({
          angleRad,
          axisDeltaRad,
          beamOffsetX,
          beamOffsetY,
          cataractVisual,
          cylinderAxisDeg,
          eye,
          flags,
          movementSign,
          pupilRadiusPx,
          reflex,
          reflexCompX,
          reflexCompY,
          timeSec,
        });
      });
    }
    function updateRetinoscopy({ includePosition = true } = {}) {
      if (includePosition) {
        updateRetStreakPosition();
      }
      updateRetStreakTransform();
      updateRetReflex();
    }
    function renderNow(includePosition = true) {
      if (state.retinoscopyRafId) {
        cancelAnimationFrame(state.retinoscopyRafId);
        state.retinoscopyRafId = 0;
      }
      state.retinoscopyNeedsPosition = false;
      updateRetinoscopy({ includePosition });
    }
    function scheduleRetinoscopy(includePosition = false) {
      state.retinoscopyNeedsPosition =
        state.retinoscopyNeedsPosition || includePosition;
      if (state.retinoscopyRafId) {
        return;
      }
      state.retinoscopyRafId = requestAnimationFrame(() => {
        updateRetinoscopy({ includePosition: state.retinoscopyNeedsPosition });
        state.retinoscopyNeedsPosition = false;
        state.retinoscopyRafId = 0;
      });
    }
    function setActiveRetEye(nextEye) {
      if (nextEye !== "left" && nextEye !== "right") {
        return;
      }
      state.activeRetEye = nextEye;
      applyRetEyeClasses(nextEye);
      dom.retEyeButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.retEye === nextEye);
      });
      scheduleRetinoscopy(true);
    }
    function setRetStreakOffset(value) {
      state.retStreakOffset = value;
      hasUserSweptSinceRefractionChange = true;
      scheduleRetinoscopy(false);
    }
    function setRetStreakRotation(value) {
      state.retStreakRotation = value;
      scheduleRetinoscopy(false);
    }
    function setRefraction(value) {
      if (!REFRACTION_VALUE_SET2.has(value)) {
        return;
      }
      state.currentRefraction = value;
      const flags = getCaseFlags(value);
      if (flags.corticalCataractCase) {
        state.corticalCataractPattern = createCorticalCataractPattern(
          value === REFRACTION_VALUES.BIG_CORTICAL_CATARACT,
        );
      } else {
        state.corticalCataractPattern = null;
      }
      if (isAxisDependentCase(value)) {
        state.cylinderAxisDeg = randomCylinderAxisDeg();
        state.retStreakRotation =
          state.cylinderAxisDeg > 90
            ? state.cylinderAxisDeg - 180
            : state.cylinderAxisDeg;
      } else {
        state.cylinderAxisDeg = null;
        state.retStreakRotation = 0;
      }
      state.retStreakOffset = 0;
      if (dom.retinoscopySlider) {
        dom.retinoscopySlider.value = "0";
      }
      if (dom.retinoscopyRotationSlider) {
        dom.retinoscopyRotationSlider.value = String(state.retStreakRotation);
      }
      hasUserSweptSinceRefractionChange = false;
      setMovementStatusVisible(false);
      scheduleRetinoscopy(true);
    }
    function setCataractLevel(value) {
      const parsed = Number.isFinite(value) ? value : parseInt(value, 10);
      if (Number.isNaN(parsed)) {
        return;
      }
      state.cataractLevel = Math.max(0, Math.min(100, parsed));
      scheduleRetinoscopy(false);
    }
    return {
      renderNow,
      scheduleRetinoscopy,
      setActiveRetEye,
      setRetStreakOffset,
      setRetStreakRotation,
      setRefraction,
      setCataractLevel,
    };
  }

  // src/state.js?v=20260506-2
  function createAppState() {
    return {
      baseReflexColor: { ...DEFAULT_BASE_REFLEX_COLOR2 },
      ...DEFAULT_RETINOSCOPY_STATE,
      retinoscopyRafId: 0,
      retinoscopyNeedsPosition: true,
      activeMcqLevel: "primary",
      activeMcqQuestions: [],
      corticalCataractPattern: null,
      microSaccadeIntervalId: 0,
      backgroundJitterIntervalId: 0,
      blinkIntervalId: 0,
      gazeIntervalId: 0,
      gazeReturnTimeoutId: 0,
      gazeShiftTimerId: 0,
      lastBlinkAtMs: 0,
      nystagmusRafId: 0,
      isManualEyeMoveEnabled: false,
      isGazeMode: false,
      isDilatedMode: false,
      isBabyMode: false,
      dilatedPreviousPupilValues: null,
      isTestMode: false,
      isTestRevealed: false,
      testCountdown: 0,
      testTimerId: 0,
      testConditionValue: null,
      testRevealLabel: "",
      testPreviousState: null,
      testLastRefraction: null,
      testRoundIndex: 0,
    };
  }

  // src/streak-controls.js
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  function createStreakControlsController({
    state,
    dom,
    retinoscopyController,
  }) {
    const { retStreak, retStreakRotateHandle, retStreakSweepHandle } = dom;
    const SWEEP_LIMIT = 50;
    const ROTATION_LIMIT = 90;
    const SWEEP_PIXELS_PER_UNIT = 2;
    const ROTATION_PIXELS_PER_DEG = 1.15;
    let hintTimerId = 0;
    function hideHint() {
      if (!retStreak) {
        return;
      }
      if (hintTimerId) {
        window.clearTimeout(hintTimerId);
        hintTimerId = 0;
      }
      retStreak.classList.remove("is-hint-visible");
    }
    function showHint() {
      if (!retStreak) {
        return;
      }
      retStreak.classList.add("is-hint-visible");
      hintTimerId = window.setTimeout(() => {
        retStreak.classList.remove("is-hint-visible");
        hintTimerId = 0;
      }, 3e3);
    }
    function bindPointerDrag(
      handle,
      { getValue, max, min, pixelsPerUnit, setValue },
    ) {
      if (!handle) {
        return;
      }
      let activePointerId = null;
      let startX = 0;
      let startY = 0;
      let startAngleRad = 0;
      let startValue = 0;
      function endDrag(event) {
        var _a;
        if (activePointerId === null) {
          return;
        }
        if (event && event.pointerId !== activePointerId) {
          return;
        }
        activePointerId = null;
        (
          ((_a = handle.closest) == null
            ? void 0
            : _a.call(handle, ".ret-streak")) || handle
        ).classList.remove("is-dragging");
      }
      handle.addEventListener("pointerdown", (event) => {
        var _a, _b;
        if (event.button !== void 0 && event.button !== 0) {
          return;
        }
        hideHint();
        event.stopPropagation();
        activePointerId = event.pointerId;
        startX = event.clientX;
        startY = event.clientY;
        startAngleRad = (state.retStreakRotation * Math.PI) / 180;
        startValue = getValue();
        (
          ((_a = handle.closest) == null
            ? void 0
            : _a.call(handle, ".ret-streak")) || handle
        ).classList.add("is-dragging");
        (_b = handle.setPointerCapture) == null
          ? void 0
          : _b.call(handle, event.pointerId);
        event.preventDefault();
      });
      handle.addEventListener("pointermove", (event) => {
        if (event.pointerId !== activePointerId) {
          return;
        }
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
        const projectedDelta =
          deltaX * Math.cos(startAngleRad) + deltaY * Math.sin(startAngleRad);
        const nextValue = clamp(
          startValue + projectedDelta / pixelsPerUnit,
          min,
          max,
        );
        setValue(Math.round(nextValue));
      });
      handle.addEventListener("pointerup", endDrag);
      handle.addEventListener("pointercancel", endDrag);
      handle.addEventListener("lostpointercapture", endDrag);
    }
    function bindKeyboard(handle, { step, setNextValue }) {
      if (!handle) {
        return;
      }
      handle.addEventListener("keydown", (event) => {
        if (
          event.key !== "ArrowLeft" &&
          event.key !== "ArrowRight" &&
          event.key !== "Home" &&
          event.key !== "End"
        ) {
          return;
        }
        hideHint();
        event.preventDefault();
        setNextValue(event.key, step);
      });
    }
    function init() {
      if (!retStreak || !retStreakRotateHandle || !retStreakSweepHandle) {
        return;
      }
      bindPointerDrag(retStreakSweepHandle, {
        getValue: () => state.retStreakOffset,
        max: SWEEP_LIMIT,
        min: -SWEEP_LIMIT,
        pixelsPerUnit: SWEEP_PIXELS_PER_UNIT,
        setValue: (value) => retinoscopyController.setRetStreakOffset(value),
      });
      bindPointerDrag(retStreak, {
        getValue: () => state.retStreakOffset,
        max: SWEEP_LIMIT,
        min: -SWEEP_LIMIT,
        pixelsPerUnit: SWEEP_PIXELS_PER_UNIT,
        setValue: (value) => retinoscopyController.setRetStreakOffset(value),
      });
      bindPointerDrag(retStreakRotateHandle, {
        getValue: () => state.retStreakRotation,
        max: ROTATION_LIMIT,
        min: -ROTATION_LIMIT,
        pixelsPerUnit: ROTATION_PIXELS_PER_DEG,
        setValue: (value) => retinoscopyController.setRetStreakRotation(value),
      });
      bindKeyboard(retStreakSweepHandle, {
        step: 5,
        setNextValue: (key, step) => {
          if (key === "Home") {
            retinoscopyController.setRetStreakOffset(0);
            return;
          }
          if (key === "End") {
            retinoscopyController.setRetStreakOffset(SWEEP_LIMIT);
            return;
          }
          const delta = key === "ArrowLeft" ? -step : step;
          retinoscopyController.setRetStreakOffset(
            clamp(state.retStreakOffset + delta, -SWEEP_LIMIT, SWEEP_LIMIT),
          );
        },
      });
      bindKeyboard(retStreakRotateHandle, {
        step: 6,
        setNextValue: (key, step) => {
          if (key === "Home") {
            retinoscopyController.setRetStreakRotation(0);
            return;
          }
          if (key === "End") {
            retinoscopyController.setRetStreakRotation(ROTATION_LIMIT);
            return;
          }
          const delta = key === "ArrowLeft" ? -step : step;
          retinoscopyController.setRetStreakRotation(
            clamp(
              state.retStreakRotation + delta,
              -ROTATION_LIMIT,
              ROTATION_LIMIT,
            ),
          );
        },
      });
      showHint();
    }
    return {
      hideHint,
      init,
    };
  }

  // src/test-mode.js?v=20260506-3
  function dispatchInput(element) {
    if (!element) {
      return;
    }
    element.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function sampleRandomCondition(lastValue) {
    const candidates =
      TEST_REFRACTION_OPTIONS2.length > 1
        ? TEST_REFRACTION_OPTIONS2.filter(
            (option) => option.value !== lastValue,
          )
        : TEST_REFRACTION_OPTIONS2;
    const pool = candidates.length ? candidates : TEST_REFRACTION_OPTIONS2;
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }
  function getCountdownForRound(roundIndex) {
    const safeIndex = Math.max(
      0,
      Math.min(roundIndex, TEST_COUNTDOWN_SEQUENCE.length - 1),
    );
    return TEST_COUNTDOWN_SEQUENCE[safeIndex];
  }
  function createTestModeController({
    state,
    dom,
    retinoscopyController,
    onCaseChange,
  }) {
    const {
      sideMenu,
      testModeButton,
      testStatusBanner,
      testCountdownValue,
      testAnswerText,
      testNextButton,
      reflexColorSlider,
      gazeToggle,
      dilatedToggle,
      babyToggle,
      manualEyeMoveToggle,
      casePicker,
      casePreviousButton,
      caseNextButton,
      caseTriggerButton,
      refractionShell,
      refractionMaskLabel,
      refractionStateSelect,
      cataractSlider,
      nystagmusSlider,
      pupilSizeSliders,
      eyelidSliders,
      retinoscopySlider,
      retinoscopyRotationSlider,
    } = dom;
    const lockableControls = [
      reflexColorSlider,
      gazeToggle,
      dilatedToggle,
      babyToggle,
      manualEyeMoveToggle,
      casePreviousButton,
      caseNextButton,
      caseTriggerButton,
      refractionStateSelect,
      cataractSlider,
      nystagmusSlider,
      ...pupilSizeSliders,
      ...eyelidSliders,
    ].filter(Boolean);
    function clearTestTimer() {
      if (!state.testTimerId) {
        return;
      }
      window.clearInterval(state.testTimerId);
      state.testTimerId = 0;
    }
    function setSideMenuOpen(isOpen) {
      if (!sideMenu) {
        return;
      }
      sideMenu.classList.toggle("open", isOpen);
      sideMenu.setAttribute("aria-hidden", String(!isOpen));
      if (isOpen) {
        sideMenu.removeAttribute("inert");
      } else {
        sideMenu.setAttribute("inert", "");
      }
      if (dom.burgerIcon) {
        dom.burgerIcon.setAttribute("aria-expanded", String(isOpen));
        dom.burgerIcon.setAttribute(
          "aria-label",
          isOpen ? "Close menu" : "Open menu",
        );
      }
    }
    function setTestTriggerLabel() {
      if (!testModeButton) {
        return;
      }
      testModeButton.textContent = "Test me";
    }
    function setRefractionMask(isMasked) {
      if (!refractionShell || !refractionMaskLabel || !refractionStateSelect) {
        return;
      }
      refractionShell.classList.toggle("is-masked", isMasked);
      refractionMaskLabel.textContent = isMasked ? "Condition hidden" : "";
      if (casePicker) {
        casePicker.classList.toggle("is-masked", isMasked);
      }
    }
    function setObservationLock(isLocked) {
      lockableControls.forEach((control) => {
        control.disabled = isLocked;
      });
    }
    function renderBanner() {
      if (!testStatusBanner || !testCountdownValue || !testAnswerText) {
        return;
      }
      testStatusBanner.hidden = !state.isTestMode;
      if (!state.isTestMode) {
        return;
      }
      testCountdownValue.textContent = String(state.testCountdown);
      if (state.isTestRevealed) {
        testAnswerText.hidden = false;
        testAnswerText.textContent = state.testRevealLabel;
        if (testNextButton) {
          testNextButton.hidden = false;
        }
        return;
      }
      testAnswerText.hidden = true;
      testAnswerText.textContent = "";
      if (testNextButton) {
        testNextButton.hidden = true;
      }
    }
    function captureSnapshot() {
      var _a, _b, _c;
      return {
        activeRetEye: state.activeRetEye,
        corticalCataractPattern: state.corticalCataractPattern
          ? JSON.parse(JSON.stringify(state.corticalCataractPattern))
          : null,
        currentRefraction: state.currentRefraction,
        cylinderAxisDeg: state.cylinderAxisDeg,
        retStreakOffset: state.retStreakOffset,
        retStreakRotation: state.retStreakRotation,
        reflexColorValue:
          (_a = reflexColorSlider == null ? void 0 : reflexColorSlider.value) !=
          null
            ? _a
            : "",
        cataractValue:
          (_b = cataractSlider == null ? void 0 : cataractSlider.value) != null
            ? _b
            : "",
        nystagmusValue:
          (_c = nystagmusSlider == null ? void 0 : nystagmusSlider.value) !=
          null
            ? _c
            : "",
        pupilValues: pupilSizeSliders.map((slider) => slider.value),
        eyelidValues: eyelidSliders.map((slider) => slider.value),
      };
    }
    function restoreSnapshot() {
      const snapshot = state.testPreviousState;
      if (!snapshot) {
        return;
      }
      if (reflexColorSlider && snapshot.reflexColorValue !== "") {
        reflexColorSlider.value = snapshot.reflexColorValue;
        dispatchInput(reflexColorSlider);
      }
      pupilSizeSliders.forEach((slider, index) => {
        if (snapshot.pupilValues[index] === void 0) {
          return;
        }
        slider.value = snapshot.pupilValues[index];
        dispatchInput(slider);
      });
      eyelidSliders.forEach((slider, index) => {
        if (snapshot.eyelidValues[index] === void 0) {
          return;
        }
        slider.value = snapshot.eyelidValues[index];
        dispatchInput(slider);
      });
      if (cataractSlider && snapshot.cataractValue !== "") {
        cataractSlider.value = snapshot.cataractValue;
        dispatchInput(cataractSlider);
      }
      if (nystagmusSlider && snapshot.nystagmusValue !== "") {
        nystagmusSlider.value = snapshot.nystagmusValue;
        dispatchInput(nystagmusSlider);
      }
      retinoscopyController.setActiveRetEye(snapshot.activeRetEye);
      if (typeof onCaseChange === "function") {
        onCaseChange(snapshot.currentRefraction);
      } else {
        retinoscopyController.setRefraction(snapshot.currentRefraction);
      }
      state.cylinderAxisDeg = snapshot.cylinderAxisDeg;
      state.corticalCataractPattern = snapshot.corticalCataractPattern
        ? JSON.parse(JSON.stringify(snapshot.corticalCataractPattern))
        : null;
      if (refractionStateSelect) {
        refractionStateSelect.value = snapshot.currentRefraction;
      }
      if (retinoscopySlider) {
        retinoscopySlider.value = String(snapshot.retStreakOffset);
      }
      retinoscopyController.setRetStreakOffset(snapshot.retStreakOffset);
      if (retinoscopyRotationSlider) {
        retinoscopyRotationSlider.value = String(snapshot.retStreakRotation);
      }
      retinoscopyController.setRetStreakRotation(snapshot.retStreakRotation);
    }
    function buildRevealLabel(option) {
      if (typeof state.cylinderAxisDeg === "number") {
        if (
          option.value === "low-cylinder" ||
          option.value === "high-cylinder"
        ) {
          return `${option.label}, - cyl axis ${state.cylinderAxisDeg} deg`;
        }
        return `${option.label}, axis ${state.cylinderAxisDeg} deg`;
      }
      return option.label;
    }
    function revealAnswer() {
      clearTestTimer();
      state.isTestRevealed = true;
      state.testCountdown = 0;
      setRefractionMask(false);
      renderBanner();
    }
    function startCountdown() {
      clearTestTimer();
      state.testTimerId = window.setInterval(() => {
        if (state.testCountdown <= 1) {
          revealAnswer();
          return;
        }
        state.testCountdown -= 1;
        renderBanner();
      }, 1e3);
    }
    function startTestRound() {
      if (!state.testPreviousState) {
        state.testPreviousState = captureSnapshot();
        state.testRoundIndex = 0;
      } else {
        state.testRoundIndex = Math.min(
          state.testRoundIndex + 1,
          TEST_COUNTDOWN_SEQUENCE.length - 1,
        );
      }
      const nextCondition = sampleRandomCondition(state.testLastRefraction);
      if (!nextCondition) {
        return;
      }
      state.isTestMode = true;
      state.isTestRevealed = false;
      state.testConditionValue = nextCondition.value;
      state.testCountdown = getCountdownForRound(state.testRoundIndex);
      state.testLastRefraction = nextCondition.value;
      setObservationLock(true);
      setRefractionMask(true);
      if (typeof onCaseChange === "function") {
        onCaseChange(nextCondition.value);
      } else {
        retinoscopyController.setRefraction(nextCondition.value);
        if (refractionStateSelect) {
          refractionStateSelect.value = nextCondition.value;
        }
      }
      state.testRevealLabel = buildRevealLabel(nextCondition);
      renderBanner();
      setTestTriggerLabel();
      setSideMenuOpen(false);
      startCountdown();
    }
    function closeTestMode() {
      if (!state.isTestMode && !state.testPreviousState) {
        return;
      }
      clearTestTimer();
      setObservationLock(false);
      setRefractionMask(false);
      restoreSnapshot();
      state.isTestMode = false;
      state.isTestRevealed = false;
      state.testCountdown = 0;
      state.testConditionValue = null;
      state.testRevealLabel = "";
      state.testPreviousState = null;
      state.testRoundIndex = 0;
      renderBanner();
      setTestTriggerLabel();
    }
    function handleTestRequest() {
      startTestRound();
    }
    function init() {
      if (testModeButton) {
        testModeButton.addEventListener("click", handleTestRequest);
      }
      if (testNextButton) {
        testNextButton.addEventListener("click", startTestRound);
      }
      renderBanner();
      setTestTriggerLabel();
    }
    return {
      closeTestMode,
      init,
      startTestRound,
    };
  }

  // src/app.js?v=20260507-1
  function populateRefractionOptions(selectElement) {
    if (!selectElement) {
      return;
    }
    selectElement.replaceChildren();
    REFRACTION_GROUPS.forEach((group) => {
      const optGroup = document.createElement("optgroup");
      optGroup.label = group.label;
      group.options.forEach((optionConfig) => {
        const option = document.createElement("option");
        option.value = optionConfig.value;
        option.textContent = optionConfig.label;
        option.dataset.cat = group.category;
        option.selected = optionConfig.value === DEFAULT_REFRACTION_VALUE;
        optGroup.appendChild(option);
      });
      selectElement.appendChild(optGroup);
    });
  }
  function runStartupEyeAnimation({
    dom,
    eyesController,
    retinoscopyController,
  }) {
    if (!prefersReducedMotion()) {
      dom.irises.forEach((iris) => {
        iris.style.transform = "translate(0, 0)";
        iris.style.transition = "";
      });
    }
    eyesController.startAmbientAnimations();
    retinoscopyController.renderNow(true);
  }
  function initApp() {
    const dom = getDomRefs();
    const state = createAppState();
    populateRefractionOptions(dom.refractionStateSelect);
    if (dom.refractionStateSelect) {
      dom.refractionStateSelect.value = state.currentRefraction;
    }
    const retinoscopyController = createRetinoscopyController({ state, dom });
    const streakControlsController = createStreakControlsController({
      state,
      dom,
      retinoscopyController,
    });
    const testModeController = createTestModeController({
      state,
      dom,
      retinoscopyController,
      onCaseChange: setCurrentRefraction,
    });
    const eyesController = createEyesController({
      state,
      dom,
      onEyeGeometryChange: ({ includePosition = true } = {}) =>
        retinoscopyController.scheduleRetinoscopy(includePosition),
    });
    let visualCasesController = null;
    function setCurrentRefraction(value) {
      retinoscopyController.setRefraction(value);
      if (dom.refractionStateSelect) {
        dom.refractionStateSelect.value = value;
      }
      if (visualCasesController) {
        visualCasesController.update();
      }
    }
    function setModifierButtonState(button, isPressed) {
      if (!button) {
        return;
      }
      button.checked = isPressed;
    }
    function syncModifierButtons() {
      setModifierButtonState(dom.gazeToggle, state.isGazeMode);
      setModifierButtonState(dom.dilatedToggle, state.isDilatedMode);
      setModifierButtonState(dom.babyToggle, state.isBabyMode);
    }
    eyesController.init();
    initInfoModal(dom);
    streakControlsController.init();
    testModeController.init();
    initMenuMcq({
      state,
      dom,
      onBeforeOpenMcq: () => testModeController.closeTestMode(),
    });
    visualCasesController = createVisualCasesController({
      state,
      dom,
      onBeforeOpen: () => testModeController.closeTestMode(),
      onSelectCase: setCurrentRefraction,
    });
    visualCasesController.init();
    dom.retEyeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        retinoscopyController.setActiveRetEye(button.dataset.retEye);
      });
    });
    retinoscopyController.setActiveRetEye(state.activeRetEye);
    if (dom.reflexColorSlider) {
      dom.reflexColorSlider.addEventListener("input", (event) => {
        const sliderValue = parseInt(event.target.value, 10);
        const newColor = getReflexColor(sliderValue);
        eyesController.applyReflexColor(newColor);
        state.baseReflexColor = parseRGB(newColor);
      });
      dom.reflexColorSlider.dispatchEvent(new Event("input"));
    }
    if (dom.manualEyeMoveToggle) {
      dom.manualEyeMoveToggle.addEventListener("change", (event) => {
        eyesController.setManualEyeMoveEnabled(event.target.checked);
      });
      dom.manualEyeMoveToggle.checked = state.isManualEyeMoveEnabled;
      eyesController.setManualEyeMoveEnabled(state.isManualEyeMoveEnabled);
    }
    if (dom.refractionStateSelect) {
      dom.refractionStateSelect.addEventListener("change", (event) => {
        setCurrentRefraction(event.target.value);
      });
    }
    if (dom.gazeToggle) {
      dom.gazeToggle.addEventListener("change", (event) => {
        eyesController.setGazeMode(event.target.checked);
        syncModifierButtons();
      });
    }
    if (dom.dilatedToggle) {
      dom.dilatedToggle.addEventListener("change", (event) => {
        eyesController.setDilatedMode(event.target.checked);
        syncModifierButtons();
      });
    }
    if (dom.babyToggle) {
      dom.babyToggle.addEventListener("change", (event) => {
        eyesController.setBabyMode(event.target.checked);
        const visibleCases = getCaseList({ babyOnly: state.isBabyMode });
        const currentCaseVisible = visibleCases.some(
          (caseItem) => caseItem.value === state.currentRefraction,
        );
        if (!currentCaseVisible) {
          const fallbackCase = getFallbackBabyCase();
          if (fallbackCase) {
            setCurrentRefraction(fallbackCase.value);
          }
        }
        syncModifierButtons();
        visualCasesController.update();
      });
    }
    if (dom.retinoscopySlider) {
      dom.retinoscopySlider.addEventListener("input", (event) => {
        retinoscopyController.setRetStreakOffset(
          parseInt(event.target.value, 10),
        );
      });
    }
    if (dom.retinoscopyRotationSlider) {
      dom.retinoscopyRotationSlider.addEventListener("input", (event) => {
        retinoscopyController.setRetStreakRotation(
          parseInt(event.target.value, 10),
        );
      });
    }
    if (dom.cataractSlider) {
      dom.cataractSlider.addEventListener("input", (event) => {
        const value = parseInt(event.target.value, 10);
        eyesController.setCataractLevel(value);
        retinoscopyController.setCataractLevel(value);
      });
      dom.cataractSlider.dispatchEvent(new Event("input"));
    }
    if (dom.nystagmusSlider) {
      dom.nystagmusSlider.addEventListener("input", (event) => {
        eyesController.setNystagmusLevel(parseInt(event.target.value, 10));
      });
      dom.nystagmusSlider.dispatchEvent(new Event("input"));
    }
    runStartupEyeAnimation({ dom, eyesController, retinoscopyController });
    syncModifierButtons();
    window.addEventListener("resize", () => {
      retinoscopyController.scheduleRetinoscopy(true);
    });
  }

  // script.js
  function startApp() {
    initApp();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startApp, { once: true });
  } else {
    startApp();
  }
})();
