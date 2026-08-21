"use strict";
(() => {
  // src/color.js?v=20260308-103
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
  var BLUE_END_REFLEX_COLOR = Object.freeze(parseRGB(getReflexColor(0)));

  // src/case-catalog.js?v=20260430-6
  var REFRACTION_GROUPS = [
    {
      label: "Normal / Refractive",
      category: "custom",
      options: [
        { value: "zero", label: "1. Normal (orange-red) R & L" },
        {
          value: "bilateral-blue-normal",
          label: "2. Normal (blue) R & L",
        },
        {
          value: "technique-child-looking-away",
          label: "3. Poor view: looking away",
          triggerLabel: "3. Poor view: looking away",
        },
        {
          value: "technique-upper-lid-blocking",
          label: "4. Poor view: upper lid blocking",
          triggerLabel: "4. Poor view: upper lid",
        },
        { value: "normal-dark", label: "8. R normal, L dark" },
        {
          value: "bilateral-dull-reflex",
          label: "15. Dull corneal reflex R & L",
          triggerLabel: "15. Dull corneal reflex R & L",
        },
        {
          value: "bilateral-poor-tear-film",
          label: "12. Poor tear film R & L",
        },
        {
          value: "bilateral-high-hypermetropia",
          label: "9. High hypermetropia R & L",
        },
        {
          value: "bilateral-myopia",
          label: "10. Myopia R & L",
        },
        {
          value: "right-hyper-left-myopia",
          label: "11. R hypermetropia, L myopia",
          triggerLabel: "11. R hyper, L myopia",
        },
      ],
    },
    {
      label: "Alignment",
      category: "custom",
      options: [
        {
          value: "right-normal-left-large-esotropia",
          label: "5. R normal, L large esotropia",
          triggerLabel: "5. R normal, L esotropia",
        },
        {
          value: "right-large-exotropia-left-corneal-scar",
          label: "6. R large exotropia, L scar",
          triggerLabel: "6. R exotropia, L scar",
        },
      ],
    },
    {
      label: "Iris / Pupil",
      category: "custom",
      options: [
        {
          value: "right-coloboma-left-normal",
          label: "19. R coloboma, L normal",
        },
        {
          value: "bilateral-aniridia",
          label: "20. Aniridia R & L",
        },
        {
          value: "right-normal-left-anisocoria",
          label: "14. R normal, L smaller pupil",
          triggerLabel: "14. R normal, L small pupil",
        },
        {
          value: "right-iris-transillumination-left-normal",
          label: "21. R transillumination, L normal",
          triggerLabel: "21. R transillum., L normal",
        },
        {
          value: "bilateral-small-pupils",
          label: "13. Small pupils R & L",
        },
        {
          value: "right-acg-left-normal",
          label: "30. R angle closure, L normal",
        },
        {
          value: "right-iridocyclitis-left-normal",
          label: "29. R iridocyclitis, L normal",
        },
      ],
    },
    {
      label: "Cornea",
      category: "custom",
      options: [
        {
          value: "bilateral-keratoconus",
          label: "28. Keratoconus R & L",
        },
        {
          value: "right-normal-left-corneal-opacity",
          label: "17. R normal, L corneal opacity",
          triggerLabel: "17. R normal, L opacity",
        },
      ],
    },
    {
      label: "Lens / Media",
      category: "custom",
      options: [
        {
          value: "right-hyper-left-posterior-pole",
          label: "18. R hypermetropia, L posterior pole",
          triggerLabel: "18. R hyper, L posterior pole",
        },
        {
          value: "bilateral-dense-cataract",
          label: "16. Dense cataract R & L",
        },
        {
          value: "right-big-cortical-left-small-cortical",
          label: "24. R large cortical, L slight cortical",
          triggerLabel: "24. R large cortical, L slight",
        },
        {
          value: "bilateral-subcapsular-cataract",
          label: "25. Subcapsular cataract R & L",
        },
        {
          value: "right-iol-left-posterior-capsular-thickening",
          label: "26. R IOL, L capsular thickening",
          triggerLabel: "26. R IOL, L capsular thick.",
        },
        {
          value: "right-aphakia-left-normal",
          label: "27. R aphakia, L normal",
        },
        {
          value: "right-normal-left-subluxated-lens",
          label: "22. R normal, L subluxated lens",
          triggerLabel: "22. R normal, L sublux lens",
        },
      ],
    },
    {
      label: "Vitreous / Retina",
      category: "custom",
      options: [
        {
          value: "right-retinoblastoma-left-normal",
          label: "7. R retinoblastoma, L normal",
          triggerLabel: "7. R retinoblastoma, L normal",
        },
        {
          value: "right-floaters-left-normal",
          label: "23. R floaters, L normal",
        },
        {
          value: "right-vitreous-haemorrhage-left-normal",
          label: "31. R vitreous haemorrhage, L normal",
          triggerLabel: "31. R vitreous haem., L normal",
        },
        {
          value: "right-retinal-detachment-left-normal",
          label: "32. R retinal detachment, L normal",
          triggerLabel: "32. R retinal detach., L normal",
        },
      ],
    },
  ];
  var REFRACTION_OPTIONS = REFRACTION_GROUPS.flatMap(
    ({ category, options, separator }) =>
      separator ? [] : options.map((option) => ({ ...option, category })),
  );
  var BABY_REFRACTION_VALUES = [
    "zero",
    "bilateral-blue-normal",
    "technique-child-looking-away",
    "technique-upper-lid-blocking",
    "bilateral-dull-reflex",
    "bilateral-high-hypermetropia",
    "right-hyper-left-myopia",
    "right-normal-left-large-esotropia",
    "right-large-exotropia-left-corneal-scar",
    "normal-dark",
    "right-coloboma-left-normal",
    "bilateral-aniridia",
    "right-normal-left-corneal-opacity",
    "bilateral-dense-cataract",
    "right-normal-left-subluxated-lens",
    "right-retinoblastoma-left-normal",
  ];
  var BABY_REFRACTION_VALUE_SET = new Set(BABY_REFRACTION_VALUES);
  var BABY_REFRACTION_OPTIONS = REFRACTION_OPTIONS.filter((option) =>
    BABY_REFRACTION_VALUE_SET.has(option.value),
  );
  var CASE_LEVELS = [
    {
      value: "primary",
      label: "Primary",
      values: [
        "zero",
        "bilateral-blue-normal",
        "technique-child-looking-away",
        "technique-upper-lid-blocking",
        "right-normal-left-large-esotropia",
        "right-large-exotropia-left-corneal-scar",
        "right-retinoblastoma-left-normal",
        "normal-dark",
      ],
    },
    {
      value: "intermediate",
      label: "Intermediate",
      values: [
        "bilateral-high-hypermetropia",
        "bilateral-myopia",
        "right-hyper-left-myopia",
        "bilateral-poor-tear-film",
        "bilateral-small-pupils",
        "right-normal-left-anisocoria",
        "bilateral-dull-reflex",
        "bilateral-dense-cataract",
        "right-normal-left-corneal-opacity",
        "right-hyper-left-posterior-pole",
        "right-coloboma-left-normal",
        "bilateral-aniridia",
        "right-iris-transillumination-left-normal",
        "right-normal-left-subluxated-lens",
      ],
    },
    {
      value: "advanced",
      label: "Advanced",
      values: [
        "right-floaters-left-normal",
        "right-big-cortical-left-small-cortical",
        "bilateral-subcapsular-cataract",
        "right-iol-left-posterior-capsular-thickening",
        "right-aphakia-left-normal",
        "bilateral-keratoconus",
        "right-iridocyclitis-left-normal",
        "right-acg-left-normal",
        "right-vitreous-haemorrhage-left-normal",
        "right-retinal-detachment-left-normal",
      ],
    },
  ];
  var TEST_REFRACTION_OPTIONS = REFRACTION_OPTIONS;
  var REFRACTION_VALUE_SET = new Set(
    REFRACTION_OPTIONS.map(({ value }) => value),
  );

  // src/case-teaching-metadata.js?v=20260430-6
  var CASE_TEACHING_METADATA = {
    zero: {
      why: "both eyes match in brightness, shape and crescent position",
      keyClue: "both eyes look closely matched",
      similarCases: ["bilateral-blue-normal", "bilateral-dull-reflex"],
    },
    "normal-dark": {
      why: "left reflex is much darker than the right",
      keyClue: "marked asymmetry, one eye looks dark",
      similarCases: [
        "right-normal-left-corneal-opacity",
        "right-retinoblastoma-left-normal",
      ],
    },
    "bilateral-blue-normal": {
      why: "both reflexes are blue-white but otherwise matched",
      keyClue: "colour shift with otherwise similar reflexes",
      similarCases: ["zero", "bilateral-dull-reflex"],
    },
    "technique-child-looking-away": {
      why: "the pupils are not looking towards the light, so this is a poor view",
      keyClue: "both eyes are looking away from the examiner",
      similarCases: ["zero", "right-normal-left-large-esotropia"],
    },
    "technique-upper-lid-blocking": {
      why: "the upper lids partly cover the pupils, so the reflex cannot be judged well",
      keyClue: "upper lids block the pupil opening",
      similarCases: ["zero", "bilateral-small-pupils"],
    },
    "bilateral-dull-reflex": {
      why: "both corneal reflexes are dimmer and greyer than normal",
      keyClue: "bilateral corneal reflex dullness without a focal plaque",
      similarCases: ["bilateral-dense-cataract", "bilateral-blue-normal"],
    },
    "bilateral-poor-tear-film": {
      why: "both surface reflexes look uneven and lose sharpness",
      keyClue: "surface reflex flickers rather than stays fixed",
      similarCases: ["bilateral-dull-reflex", "zero"],
    },
    "bilateral-high-hypermetropia": {
      why: "large bright superior crescents are present in both eyes",
      keyClue: "top crescents in both pupils",
      similarCases: ["right-hyper-left-myopia", "zero"],
    },
    "bilateral-myopia": {
      why: "large bright inferior crescents are present in both eyes",
      keyClue: "bottom crescents in both pupils",
      similarCases: ["right-hyper-left-myopia", "bilateral-keratoconus"],
    },
    "right-hyper-left-myopia": {
      why: "the right crescent is superior and the left crescent is inferior",
      keyClue: "crescent direction differs between the eyes",
      similarCases: ["bilateral-high-hypermetropia", "bilateral-myopia"],
    },
    "right-normal-left-large-esotropia": {
      why: "the left eye turns in so the two eyes no longer align equally",
      keyClue: "turned-in eye shows a brighter reflex",
      similarCases: [
        "right-large-exotropia-left-corneal-scar",
        "right-normal-left-anisocoria",
      ],
    },
    "right-large-exotropia-left-corneal-scar": {
      why: "the right eye turns out and the left reflex is broken by corneal irregularity",
      keyClue: "outward deviation plus corneal irregularity",
      similarCases: [
        "right-normal-left-large-esotropia",
        "right-normal-left-corneal-opacity",
      ],
    },
    "right-coloboma-left-normal": {
      why: "the right pupil has an inferior keyhole shape",
      keyClue: "notched keyhole pupil",
      similarCases: [
        "bilateral-aniridia",
        "right-iris-transillumination-left-normal",
      ],
    },
    "bilateral-aniridia": {
      why: "both pupils are very large with very little visible iris and typical nystagmus",
      keyClue: "absent iris tissue plus nystagmus",
      similarCases: ["right-coloboma-left-normal", "bilateral-small-pupils"],
    },
    "right-normal-left-anisocoria": {
      why: "the left pupil is clearly smaller while reflex shape stays similar",
      keyClue: "pupil sizes do not match",
      similarCases: ["bilateral-small-pupils", "right-acg-left-normal"],
    },
    "right-iris-transillumination-left-normal": {
      why: "light is seen passing through a patchy right iris, most likely from peripheral iridectomy or trauma",
      keyClue: "iris transillumination, often iridectomy or trauma",
      similarCases: [
        "right-coloboma-left-normal",
        "right-iridocyclitis-left-normal",
      ],
    },
    "bilateral-small-pupils": {
      why: "both pupils are symmetrically small and round",
      keyClue: "both pupils are small, not just one",
      similarCases: ["right-normal-left-anisocoria", "bilateral-aniridia"],
    },
    "right-acg-left-normal": {
      why: "the right pupil is vertically oval rather than round",
      keyClue: "oval pupil in one acute eye",
      similarCases: [
        "right-normal-left-anisocoria",
        "right-iridocyclitis-left-normal",
      ],
    },
    "right-iridocyclitis-left-normal": {
      why: "small dark deposits sit on the right reflex superiorly and temporally",
      keyClue: "tiny black dots on the reflex",
      similarCases: [
        "right-iris-transillumination-left-normal",
        "right-acg-left-normal",
      ],
    },
    "bilateral-keratoconus": {
      why: "the reflex is split into bilateral scissors-like bands",
      keyClue: "large bilateral scissors reflex",
      similarCases: ["bilateral-myopia", "bilateral-high-hypermetropia"],
    },
    "right-normal-left-corneal-opacity": {
      why: "the left reflex is grey and the corneal highlight is not sharp",
      keyClue: "grey reflex with hazy corneal highlight",
      similarCases: ["right-large-exotropia-left-corneal-scar", "normal-dark"],
    },
    "right-hyper-left-posterior-pole": {
      why: "the left has a focal posterior opacity and the right has a superior crescent",
      keyClue: "focal posterior opacity plus opposite-eye hypermetropia",
      similarCases: [
        "bilateral-subcapsular-cataract",
        "bilateral-dense-cataract",
      ],
    },
    "bilateral-dense-cataract": {
      why: "both reflexes are very dull and muted by dense opacity",
      keyClue: "bilateral dense media haze",
      similarCases: ["bilateral-dull-reflex", "bilateral-subcapsular-cataract"],
    },
    "right-big-cortical-left-small-cortical": {
      why: "radial spoke-like lens changes are present in both eyes, worse on the right",
      keyClue: "lens spokes, right greater than left",
      similarCases: [
        "bilateral-subcapsular-cataract",
        "bilateral-dense-cataract",
      ],
    },
    "bilateral-subcapsular-cataract": {
      why: "central posterior plaques interrupt the reflex in both pupils",
      keyClue: "central posterior plaques, often with glare",
      similarCases: [
        "right-hyper-left-posterior-pole",
        "bilateral-dense-cataract",
      ],
    },
    "right-iol-left-posterior-capsular-thickening": {
      why: "the right shows a second reflex and the left shows posterior capsular haze",
      keyClue: "double reflex on one side, capsule haze on the other",
      similarCases: [
        "right-aphakia-left-normal",
        "bilateral-subcapsular-cataract",
      ],
    },
    "right-aphakia-left-normal": {
      why: "the right reflex is unusually bright and fills most of the pupil",
      keyClue: "very bright full aphakic reflex",
      similarCases: ["right-iol-left-posterior-capsular-thickening", "zero"],
    },
    "right-normal-left-subluxated-lens": {
      why: "a lens edge is visible with a reversed inferior crescent on the left",
      keyClue: "inferior lens edge with reversed crescent",
      similarCases: [
        "right-hyper-left-posterior-pole",
        "right-aphakia-left-normal",
      ],
    },
    "right-retinoblastoma-left-normal": {
      why: "the right pupil is creamy white with red vessels across it",
      keyClue: "white pupil with red vessels",
      similarCases: ["normal-dark", "right-normal-left-corneal-opacity"],
    },
    "right-floaters-left-normal": {
      why: "dark vitreous strands cross an otherwise normal right reflex",
      keyClue: "moving vitreous opacities",
      similarCases: [
        "right-vitreous-haemorrhage-left-normal",
        "right-retinal-detachment-left-normal",
      ],
    },
    "right-vitreous-haemorrhage-left-normal": {
      why: "blood diffusely darkens and clouds the normal right reflex",
      keyClue: "diffuse blood-darkening within the vitreous",
      similarCases: [
        "right-floaters-left-normal",
        "right-retinal-detachment-left-normal",
      ],
    },
    "right-retinal-detachment-left-normal": {
      why: "a fixed shadowed sector reduces part of the right reflex",
      keyClue: "fixed shadowed segment with remaining peripheral reflex",
      similarCases: [
        "right-vitreous-haemorrhage-left-normal",
        "right-floaters-left-normal",
      ],
    },
  };
  var DEFAULT_CASE_TEACHING = {
    why: "pattern does not match a teaching note yet",
    keyClue: "compare the reflex carefully",
    similarCases: [],
  };
  function getCaseTeachingMetadata(caseValue) {
    return CASE_TEACHING_METADATA[caseValue] || DEFAULT_CASE_TEACHING;
  }
  function getSimilarCaseOptions(caseValue) {
    const similarValues = getCaseTeachingMetadata(caseValue).similarCases || [];
    return similarValues
      .map((value) =>
        REFRACTION_OPTIONS.find((option) => option.value === value),
      )
      .filter(Boolean);
  }

  // src/constants.js?v=20260430-6
  var DEFAULT_BASE_REFLEX_COLOR = {
    r: Math.round(218 * 0.7),
    g: Math.round(58 * 0.7),
    b: Math.round(0 * 0.7),
  };
  var DEFAULT_REFRACTION_VALUE = "zero";
  var DEFAULT_RETINOSCOPY_STATE = {
    retStreakOffset: 0,
    retStreakOffsetY: 0,
    currentRefraction: DEFAULT_REFRACTION_VALUE,
    cylinderAxisDeg: null,
    cataractLevel: 0,
    // 0 to 100
    nystagmusLevel: 0,
    // 0 to 100
    nystagmusDirection: "horizontal",
    nystagmusWave: "jerk",
    nystagmusRate: "slow",
  };
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
  var TEST_COUNTDOWN_SEQUENCE = [20, 15, 10, 8, 6];

  // src/clinical-interpreter.js?v=20260430-7
  var REFERRAL_LEVELS = {
    none: -1,
    unclear: -0.5,
    routine: 0,
    soon: 1,
    urgent: 2,
  };
  var REFERRAL_COPY = {
    none: {
      badge: "None",
      line: "Action: Reassuring",
    },
    unclear: {
      badge: "?",
      line: "? Action: Repeat view / ask for help",
    },
    routine: {
      badge: "Routine",
      line: "? Action: Routine review",
    },
    soon: {
      badge: "Soon",
      line: "! Action: Refer soon",
    },
    urgent: {
      badge: "Urgent",
      line: "! Action: Urgent today",
    },
  };
  var CASE_INTERPRETATIONS = {
    zero: {
      likely: "Normal reflexes R & L",
      likelyBaby: "Normal infant reflexes R & L",
      site: "Normal / refractive",
      referral: "none",
    },
    "normal-dark": {
      likely: "Reduced reflex L",
      likelyBaby: "Reduced infant reflex L",
      site: "Media or fundus",
      referral: "soon",
    },
    "bilateral-blue-normal": {
      likely: "Normal blue reflexes R & L",
      site: "Reflex colour",
      referral: "none",
    },
    "technique-child-looking-away": {
      likely: "Poor view: child looking away",
      site: "Technique",
      referral: "unclear",
    },
    "technique-upper-lid-blocking": {
      likely: "Poor view: upper lid blocking pupil",
      site: "Technique",
      referral: "unclear",
    },
    "bilateral-dull-reflex": {
      likely: "Dull corneal reflex R & L",
      likelyBaby: "Dull infant corneal reflexes R & L, ?congenital cataract",
      glareLikely: "Dull corneal reflex R & L, ?cataract / media opacity",
      site: "Cornea / media",
      referral: "soon",
      babyReferral: "urgent",
    },
    "bilateral-poor-tear-film": {
      likely: "Poor tear film R & L",
      site: "Tear film / cornea",
      referral: "routine",
    },
    "bilateral-high-hypermetropia": {
      likely: "High hypermetropia R & L",
      likelyBaby: "High hypermetropia R & L in infant",
      site: "Refractive",
      referral: "routine",
      babyReferral: "soon",
    },
    "bilateral-myopia": {
      likely: "Myopia R & L",
      likelyBaby: "Myopia R & L in infant",
      site: "Refractive",
      referral: "routine",
      babyReferral: "soon",
    },
    "right-hyper-left-myopia": {
      likely: "Anisometropia",
      likelyBaby: "Anisometropia in infant",
      site: "Refractive",
      referral: "soon",
    },
    "right-normal-left-large-esotropia": {
      likely: "Large esotropia L",
      likelyBaby: "Infantile esotropia L",
      site: "Alignment",
      referral: "soon",
    },
    "right-large-exotropia-left-corneal-scar": {
      likely: "Exotropia R, corneal scar L",
      site: "Alignment / cornea",
      referral: "soon",
    },
    "right-coloboma-left-normal": {
      likely: "Coloboma R",
      likelyBaby: "Congenital coloboma R",
      site: "Iris",
      referral: "soon",
    },
    "bilateral-aniridia": {
      likely: "Aniridia R & L with nystagmus",
      likelyBaby: "Congenital aniridia R & L with nystagmus",
      site: "Iris / ocular motor",
      referral: "soon",
    },
    "right-normal-left-anisocoria": {
      likely: "Anisocoria, L smaller",
      suddenLikely: "Acute anisocoria, L smaller",
      site: "Pupil",
      referral: "routine",
      suddenReferral: "soon",
    },
    "right-iris-transillumination-left-normal": {
      likely:
        "Iris transillumination R, likely peripheral iridectomy or trauma",
      site: "Iris / anterior segment",
      referral: "soon",
    },
    "bilateral-small-pupils": {
      likely: "Small pupils R & L",
      site: "Pupil",
      referral: "routine",
    },
    "right-acg-left-normal": {
      likely: "Possible acute angle closure R",
      site: "Angle / anterior segment",
      referral: "urgent",
    },
    "right-iridocyclitis-left-normal": {
      likely: "Possible iridocyclitis R",
      suddenLikely: "Possible acute iridocyclitis R",
      site: "Anterior uvea",
      referral: "urgent",
    },
    "bilateral-keratoconus": {
      likely: "Keratoconus R & L",
      site: "Cornea",
      referral: "soon",
    },
    "right-normal-left-corneal-opacity": {
      likely: "Corneal opacity L",
      site: "Cornea",
      referral: "soon",
    },
    "right-hyper-left-posterior-pole": {
      likely: "R hypermetropia, L posterior pole cataract",
      likelyBaby: "R hypermetropia, L posterior pole cataract in infant",
      glareLikely: "R hypermetropia, L posterior pole cataract with glare",
      site: "Lens",
      referral: "soon",
      babyReferral: "urgent",
    },
    "bilateral-dense-cataract": {
      likely: "Dense cataract R & L",
      likelyBaby: "Dense cataract R & L in infant",
      glareLikely: "Dense cataract R & L with glare",
      site: "Lens",
      referral: "soon",
      babyReferral: "urgent",
    },
    "right-big-cortical-left-small-cortical": {
      likely: "Cortical cataract, R > L",
      glareLikely: "Cortical cataract, R > L with glare",
      site: "Lens",
      referral: "soon",
    },
    "bilateral-subcapsular-cataract": {
      likely: "Subcapsular cataract R & L",
      glareLikely: "Subcapsular cataract R & L with glare",
      site: "Lens",
      referral: "soon",
    },
    "right-iol-left-posterior-capsular-thickening": {
      likely: "PCO L after IOL",
      glareLikely: "PCO L after IOL with glare",
      site: "Lens / capsule",
      referral: "soon",
    },
    "right-aphakia-left-normal": {
      likely: "Aphakia R",
      site: "Lens",
      referral: "soon",
    },
    "right-normal-left-subluxated-lens": {
      likely: "Subluxated lens L",
      suddenLikely: "Possible acute lens subluxation L",
      site: "Lens",
      referral: "soon",
      suddenReferral: "urgent",
    },
    "right-retinoblastoma-left-normal": {
      likely: "Leucocoria R, ?retinoblastoma",
      likelyBaby: "Infant leucocoria R, ?retinoblastoma",
      site: "Retina / fundus",
      referral: "urgent",
    },
    "right-floaters-left-normal": {
      likely: "Floaters R",
      suddenLikely: "Acute floaters R",
      site: "Vitreous",
      referral: "soon",
      suddenReferral: "urgent",
    },
    "right-vitreous-haemorrhage-left-normal": {
      likely: "Possible vitreous haemorrhage R",
      suddenLikely: "Possible acute vitreous haemorrhage R",
      site: "Vitreous",
      referral: "urgent",
    },
    "right-retinal-detachment-left-normal": {
      likely: "Possible retinal detachment R",
      suddenLikely: "Possible acute retinal detachment R",
      site: "Retina",
      referral: "urgent",
    },
  };
  function clampReferral(referral) {
    return REFERRAL_COPY[referral] ? referral : "routine";
  }
  function bumpReferral(referral) {
    const level = REFERRAL_LEVELS[clampReferral(referral)];
    if (level >= REFERRAL_LEVELS.urgent) {
      return "urgent";
    }
    if (level <= REFERRAL_LEVELS.none) {
      return "routine";
    }
    return level === REFERRAL_LEVELS.routine ? "soon" : "urgent";
  }
  function getBaseRecord(caseValue) {
    return (
      CASE_INTERPRETATIONS[caseValue] || {
        likely: "Pattern selected",
        site: "Observation",
        referral: "routine",
      }
    );
  }
  function buildClinicalInterpretation({
    caseValue,
    isBabyMode = false,
    onsetMode = "gradual",
    glareOn = false,
    isTestMode = false,
    isTestRevealed = false,
  }) {
    if (isTestMode && !isTestRevealed) {
      return {
        tone: "neutral",
        badge: "Masked",
        likely: "Likely: hidden during test mode",
        site: "Site: hidden during test mode",
        referral: "Action: hidden during test mode",
      };
    }
    const record = getBaseRecord(caseValue);
    let likely =
      isBabyMode && record.likelyBaby ? record.likelyBaby : record.likely;
    let referral = clampReferral(
      isBabyMode && record.babyReferral ? record.babyReferral : record.referral,
    );
    if (onsetMode === "sudden") {
      if (record.suddenLikely) {
        likely = record.suddenLikely;
      }
      if (record.suddenReferral) {
        referral = clampReferral(record.suddenReferral);
      }
    }
    if (glareOn) {
      if (record.glareLikely) {
        likely = record.glareLikely;
      }
    }
    if (
      isBabyMode &&
      ["bilateral-high-hypermetropia", "bilateral-myopia"].includes(caseValue)
    ) {
      referral = bumpReferral(referral);
    }
    const referralCopy = REFERRAL_COPY[referral];
    return {
      tone: referral,
      badge: referralCopy.badge,
      likely: `Likely: ${likely}`,
      site: `Site: ${record.site}`,
      referral: referralCopy.line,
    };
  }

  // src/test-condition-context.js?v=20260308-182
  var TEST_CONDITION_CONTEXT = {
    zero: ["Screening", "No symptoms"],
    "normal-dark": ["Incidental", "No symptoms"],
    "bilateral-blue-normal": ["Screening", "No symptoms"],
    "bilateral-dull-reflex": ["Gradual", "Blur"],
    "bilateral-poor-tear-film": ["Fluctuating", "Variable blur"],
    "bilateral-high-hypermetropia": ["Screening", "Blur/strain"],
    "bilateral-myopia": ["Gradual", "Distance blur"],
    "right-hyper-left-myopia": ["Screening", "Blur"],
    "right-normal-left-large-esotropia": ["Early onset", "No symptoms"],
    "right-large-exotropia-left-corneal-scar": ["Longstanding", "Blur"],
    "right-coloboma-left-normal": ["Congenital", "Photophobia"],
    "bilateral-aniridia": ["Congenital", "Photophobia"],
    "right-normal-left-anisocoria": ["Incidental", "No symptoms"],
    "right-iris-transillumination-left-normal": ["Gradual", "Photophobia"],
    "bilateral-small-pupils": ["Incidental", "No symptoms"],
    "right-acg-left-normal": ["Sudden", "Pain/haloes"],
    "right-iridocyclitis-left-normal": ["Sudden", "Pain/photo"],
    "bilateral-keratoconus": ["Gradual", "Blur/ghosting"],
    "right-normal-left-corneal-opacity": ["Longstanding", "Blur"],
    "right-hyper-left-posterior-pole": ["Screening", "Reduced vision"],
    "bilateral-dense-cataract": ["Gradual", "Glare/blur"],
    "right-big-cortical-left-small-cortical": ["Gradual", "Glare"],
    "bilateral-subcapsular-cataract": ["Gradual", "Glare/near blur"],
    "right-iol-left-posterior-capsular-thickening": ["After surgery", "Blur"],
    "right-aphakia-left-normal": ["After surgery", "Blur"],
    "right-normal-left-subluxated-lens": ["Longstanding", "Blur/diplopia"],
    "right-retinoblastoma-left-normal": ["Parent noticed", "White pupil"],
    "right-floaters-left-normal": ["Sudden", "Floaters"],
    "right-vitreous-haemorrhage-left-normal": ["Sudden", "Floaters/blur"],
    "right-retinal-detachment-left-normal": ["Sudden", "Shadow/flashes"],
  };
  var DEFAULT_TEST_CONTEXT = ["Incidental", "No symptoms"];
  function getTestConditionContext(conditionValue) {
    return TEST_CONDITION_CONTEXT[conditionValue] || DEFAULT_TEST_CONTEXT;
  }

  // src/condition-context-controls.js?v=20260430-1
  function createContextSwitch({ checked, context, disabled, label, title }) {
    const switchLabel = document.createElement("label");
    switchLabel.className =
      "advanced-switch advanced-toolbar-switch modifier-context-switch";
    switchLabel.title = title;
    const input = document.createElement("input");
    input.type = "checkbox";
    input.dataset.contextSwitch = context;
    input.checked = checked;
    input.disabled = disabled;
    const track = document.createElement("span");
    track.className = "advanced-switch-track";
    track.setAttribute("aria-hidden", "true");
    const text = document.createElement("span");
    text.className =
      "advanced-toolbar-switch-text modifier-context-switch-text";
    text.textContent = label;
    switchLabel.append(input, track, text);
    return switchLabel;
  }
  function createConditionContextController({ container, onChange, state }) {
    function applyDefaults(conditionValue) {
      const [onset = "Incidental", symptoms = "No symptoms"] =
        getTestConditionContext(conditionValue);
      state.contextOnsetMode = /^sudden$/i.test(onset) ? "sudden" : "gradual";
      state.contextGlareOn = /glare/i.test(symptoms);
    }
    function render() {
      if (!container) {
        return;
      }
      container.replaceChildren();
      const onsetSwitch = createContextSwitch({
        checked: state.contextOnsetMode === "sudden",
        context: "onset",
        disabled: state.isTestMode,
        label: state.contextOnsetMode === "sudden" ? "Sudden" : "Gradual",
        title: "Switch onset between gradual and sudden",
      });
      const glareSwitch = createContextSwitch({
        checked: state.contextGlareOn,
        context: "glare",
        disabled: state.isTestMode,
        label: state.contextGlareOn ? "Glare on" : "Glare",
        title: "Switch glare on or off",
      });
      container.append(onsetSwitch, glareSwitch);
    }
    function init() {
      if (!container) {
        return;
      }
      container.addEventListener("change", (event) => {
        const toggleInput =
          event.target instanceof Element
            ? event.target.closest("[data-context-switch]")
            : null;
        if (!toggleInput) {
          return;
        }
        const toggleKey = toggleInput.dataset.contextSwitch;
        if (toggleKey === "onset") {
          state.contextOnsetMode = toggleInput.checked ? "sudden" : "gradual";
        } else if (toggleKey === "glare") {
          state.contextGlareOn = toggleInput.checked;
        }
        render();
        onChange == null ? void 0 : onChange();
      });
    }
    return {
      applyDefaults,
      init,
      render,
    };
  }

  // src/dom.js?v=20260501-1
  function getDomRefs() {
    return {
      body: document.body,
      infoIcon: document.getElementById("info-icon"),
      infoModal: document.getElementById("infoModal"),
      infoModalContent: document.getElementById("infoModalContent"),
      closeModal: document.getElementById("closeModal"),
      infoLearnButton: document.getElementById("info-learn-button"),
      learnMenuButton: document.getElementById("learn-menu-button"),
      learnModal: document.getElementById("learnModal"),
      learnModalContent: document.getElementById("learnModalContent"),
      learnHandoutImage: document.getElementById("learnHandoutImage"),
      closeLearnModalButton: document.getElementById("closeLearnModal"),
      learnExplainList: document.getElementById("learnExplainList"),
      learnTabs: Array.from(document.querySelectorAll(".learn-tab")),
      learnPanels: Array.from(document.querySelectorAll(".learn-panel")),
      learnShareStatus: document.getElementById("learnShareStatus"),
      burgerIcon: document.getElementById("burger-icon"),
      sideMenu: document.getElementById("sideMenu"),
      testModeButton: document.getElementById("test-mode-button"),
      visualCaseTrigger: document.getElementById("visual-case-trigger"),
      visualCaseCurrentLabel: document.getElementById(
        "visual-case-current-label",
      ),
      casePrevButton: document.getElementById("case-prev-button"),
      caseNextButton: document.getElementById("case-next-button"),
      visualCaseModal: document.getElementById("visualCaseModal"),
      visualCaseModalContent: document.getElementById("visualCaseModalContent"),
      closeVisualCaseModalButton: document.getElementById(
        "closeVisualCaseModal",
      ),
      visualCaseModalList: document.getElementById("visual-case-modal-list"),
      visualCaseSimilar: document.getElementById("visual-case-similar"),
      visualCaseSimilarList: document.getElementById(
        "visual-case-similar-list",
      ),
      visualCasePhotoModal: document.getElementById("visualCasePhotoModal"),
      visualCasePhotoModalContent: document.getElementById(
        "visualCasePhotoModalContent",
      ),
      closeVisualCasePhotoModalButton: document.getElementById(
        "closeVisualCasePhotoModal",
      ),
      visualCasePhotoTitle: document.getElementById("visualCasePhotoTitle"),
      visualCasePhotoImage: document.getElementById("visualCasePhotoImage"),
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
      controlsDeck: document.querySelector(".controls-deck"),
      liveToggle: document.getElementById("live-toggle"),
      testStatusBanner: document.getElementById("test-status-banner"),
      testCountdownValue: document.getElementById("test-countdown-value"),
      testAnswerText: document.getElementById("test-answer-text"),
      testClueText: document.getElementById("test-clue-text"),
      testNextButton: document.getElementById("test-next-button"),
      observationGuide: document.querySelector(".observation-guide"),
      observationGuideToggle: document.getElementById(
        "observation-guide-toggle",
      ),
      observationGuideItems: Array.from(
        document.querySelectorAll(".observation-guide-item"),
      ),
      observationGuideDetail: document.getElementById(
        "observation-guide-detail",
      ),
      observationTeachingOverlay: document.getElementById(
        "observation-teaching-overlay",
      ),
      observationTeachingTargets: Array.from(
        document.querySelectorAll(".observation-teaching-target"),
      ),
      observationTeachingConnector: document.querySelector(
        ".observation-teaching-connector",
      ),
      resultsSummary: document.getElementById("results-summary"),
      resultsWhy: document.getElementById("results-why"),
      resultsSite: document.getElementById("results-site"),
      resultsUrgency: document.getElementById("results-urgency"),
      advancedDockToggle: document.getElementById("advanced-dock-toggle"),
      advancedPanel: document.getElementById("advanced-panel"),
      modifierContextBar: document.getElementById("modifier-context-bar"),
      reflexColorSlider: document.getElementById("reflex-color-slider"),
      babyToggle: document.getElementById("baby-toggle"),
      dilatedToggle: document.getElementById("dilated-toggle"),
      irisColourSelect: document.getElementById("iris-colour"),
      manualEyeMoveToggle: document.getElementById("manual-eye-move-toggle"),
      refractionShell: document.getElementById("refraction-shell"),
      refractionMaskLabel: document.getElementById("refraction-mask-label"),
      refractionStateSelect: document.getElementById("refraction-state"),
      cataractSlider: document.getElementById("cataract-slider"),
      nystagmusToggle: document.getElementById("toggle-nystagmus"),
      nystagmusDirectionSelect: document.getElementById("nyst-direction"),
      nystagmusWaveSelect: document.getElementById("nyst-wave"),
      nystagmusRateSelect: document.getElementById("nyst-rate"),
      pupilSizeSliders: Array.from(
        document.querySelectorAll(".slider[data-eye]"),
      ),
      eyelidSliders: Array.from(
        document.querySelectorAll(".vertical-eye-slider"),
      ),
      eyesWrapper: document.querySelector(".eyes-wrapper"),
      eyesContainer: document.querySelector(".eyes-container"),
      eyes: Array.from(document.querySelectorAll(".eye")),
      leftEye: document.getElementById("left-eye"),
      rightEye: document.getElementById("right-eye"),
      irises: Array.from(document.querySelectorAll(".iris")),
      retReflexElements: Array.from(document.querySelectorAll(".ret-reflex")),
      retStreak: document.getElementById("ret-streak"),
      retStreakVisual: document.getElementById("ret-streak-visual"),
    };
  }

  // src/motion.js
  function prefersReducedMotion() {
    var _a2;
    return Boolean(
      (_a2 = window.matchMedia) == null
        ? void 0
        : _a2.call(window, "(prefers-reduced-motion: reduce)").matches,
    );
  }

  // src/eyes-ambient.js?v=20260430-8
  function createAmbientEyeController({
    dom,
    notifyEyeGeometryChange,
    state,
    updateIrisTransform: updateIrisTransform2,
  }) {
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
    function notifyAmbientEyeGeometryChange(
      includePosition = state.nystagmusLevel === 0,
    ) {
      notifyEyeGeometryChange(
        state.isLiveMotionEnabled ? false : includePosition,
      );
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
          updateIrisTransform2(iris);
        };
        const startDelay = index * staggerMs;
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
    function getNystagmusSettings() {
      const allowedDirections = /* @__PURE__ */ new Set([
        "horizontal",
        "vertical",
        "mixed",
      ]);
      const allowedWaves = /* @__PURE__ */ new Set(["jerk", "pendular"]);
      const allowedRates = /* @__PURE__ */ new Set(["slow", "med", "fast"]);
      const direction = allowedDirections.has(state.nystagmusDirection)
        ? state.nystagmusDirection
        : "horizontal";
      const wave = allowedWaves.has(state.nystagmusWave)
        ? state.nystagmusWave
        : "jerk";
      const rate = allowedRates.has(state.nystagmusRate)
        ? state.nystagmusRate
        : "slow";
      return { direction, wave, rate };
    }
    function startMicroSaccades() {
      const saccadeInterval = 2300;
      const saccadeDuration = 120;
      dom.irises.forEach((iris) => {
        iris.microOffset = { x: 0, y: 0 };
      });
      state.microSaccadeIntervalId = window.setInterval(() => {
        const hasLargerShift =
          state.isLiveMotionEnabled && Math.random() < 0.18;
        const horizontalRange = state.isLiveMotionEnabled
          ? hasLargerShift
            ? 4.8
            : 2.6
          : 2;
        const verticalRange = state.isLiveMotionEnabled
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
            updateIrisTransform2(iris);
          }
        });
        notifyAmbientEyeGeometryChange();
        setTimeout(() => {
          dom.irises.forEach((iris) => {
            if (!iris.isDragging) {
              iris.microOffset = { x: 0, y: 0 };
              updateIrisTransform2(iris);
            }
          });
          notifyAmbientEyeGeometryChange();
        }, saccadeDuration);
      }, saccadeInterval);
    }
    function startGazeShifts() {
      if (state.gazeShiftTimerId) {
        clearTimeout(state.gazeShiftTimerId);
        state.gazeShiftTimerId = 0;
      }
      let isFirstShift = true;
      let restingGazeX = 0;
      let restingGazeY = 0;
      const applyRestingGaze = () => {
        const side = Math.random() < 0.5 ? -1 : 1;
        restingGazeX = parseFloat(
          (side * (2.2 + Math.random() * 2.2)).toFixed(2),
        );
        restingGazeY = parseFloat((Math.random() * 2.2 - 1.1).toFixed(2));
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
      applyRestingGaze();
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
          if (!state.isLiveMotionEnabled) {
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
            if (state.isLiveMotionEnabled) {
              scheduleNextGazeShift();
            } else {
              state.gazeShiftTimerId = 0;
            }
          }, holdDuration);
        }, delay);
      };
      scheduleNextGazeShift();
    }
    function startBackgroundJitter() {
      dom.irises.forEach((iris) => {
        iris.backgroundOffset = { x: 0, y: 0 };
      });
      const applyBackgroundJitter = () => {
        dom.irises.forEach((iris) => {
          if (!iris.isDragging) {
            const jitterRangeX = state.isLiveMotionEnabled ? 0.62 : 0.4;
            const jitterRangeY = state.isLiveMotionEnabled ? 0.52 : 0.4;
            const jitterX = parseFloat(
              (Math.random() * jitterRangeX - jitterRangeX / 2).toFixed(2),
            );
            const jitterY = parseFloat(
              (Math.random() * jitterRangeY - jitterRangeY / 2).toFixed(2),
            );
            iris.backgroundOffset = { x: jitterX, y: jitterY };
            updateIrisTransform2(iris);
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
      const { direction, wave, rate } = getNystagmusSettings();
      const rateCyclesByValue = {
        slow: 1.05,
        med: 1.75,
        fast: 2.45,
      };
      const amplitude = normalizedLevel * 9.2;
      const mixedAmplitudeY = amplitude * 0.58;
      const phaseCycles = (timestampMs / 1e3) * rateCyclesByValue[rate];
      const phaseRadians = phaseCycles * Math.PI * 2;
      const cycleFraction = phaseCycles % 1;
      let didMove = false;
      dom.irises.forEach((iris) => {
        if (iris.isDragging) {
          return;
        }
        let valueX = 0;
        let valueY = 0;
        if (wave === "pendular") {
          valueX = amplitude * Math.sin(phaseRadians);
          if (direction === "mixed") {
            valueY = mixedAmplitudeY * Math.sin(phaseRadians + Math.PI / 2);
          }
        } else {
          valueX =
            cycleFraction < 0.75
              ? -amplitude + (cycleFraction / 0.75) * (2 * amplitude)
              : amplitude - ((cycleFraction - 0.75) / 0.25) * (2 * amplitude);
          if (direction === "mixed") {
            valueY = valueX >= 0 ? mixedAmplitudeY : -mixedAmplitudeY;
          }
        }
        const x = direction === "vertical" ? 0 : valueX;
        const y =
          direction === "horizontal"
            ? 0
            : direction === "vertical"
              ? valueX
              : valueY;
        const previous = iris.nystagmusOffset || { x: 0, y: 0 };
        if (
          Math.abs(previous.x - x) > 0.02 ||
          Math.abs(previous.y - y) > 0.02
        ) {
          iris.nystagmusOffset = {
            x: parseFloat(x.toFixed(2)),
            y: parseFloat(y.toFixed(2)),
          };
          updateIrisTransform2(iris);
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
      const isBabyBlink = Boolean(
        state.isBabyMode && state.isLiveMotionEnabled,
      );
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
        setTimeout(
          () => blinkEyes({ doubleBlink: false }),
          isBabyBlink ? 320 : 210,
        );
      }
    }
    function scheduleNextBlink() {
      const usesBabyGazeBlink = state.isBabyMode && state.isLiveMotionEnabled;
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
      if (state.isLiveMotionEnabled && !state.gazeShiftTimerId) {
        startGazeShifts();
      }
      if (state.nystagmusLevel > 0) {
        startNystagmusLoop();
      }
    }
    function resetMotionOffsets({ includeNystagmus = true } = {}) {
      let resetNeeded = false;
      dom.irises.forEach((iris) => {
        if (iris.gazeSettleTimerId) {
          window.clearTimeout(iris.gazeSettleTimerId);
          iris.gazeSettleTimerId = 0;
        }
        if (iris.gazeStartTimerId) {
          window.clearTimeout(iris.gazeStartTimerId);
          iris.gazeStartTimerId = 0;
        }
        const previousNystagmus = iris.nystagmusOffset || { x: 0, y: 0 };
        const previousMicro = iris.microOffset || { x: 0, y: 0 };
        const previousJitter = iris.backgroundOffset || { x: 0, y: 0 };
        const previousGaze = iris.gazeOffset || { x: 0, y: 0 };
        if (
          Math.abs(previousMicro.x) > 0.02 ||
          Math.abs(previousMicro.y) > 0.02 ||
          Math.abs(previousJitter.x) > 0.02 ||
          Math.abs(previousJitter.y) > 0.02 ||
          Math.abs(previousGaze.x) > 0.02 ||
          Math.abs(previousGaze.y) > 0.02 ||
          (includeNystagmus &&
            (Math.abs(previousNystagmus.x) > 0.02 ||
              Math.abs(previousNystagmus.y) > 0.02))
        ) {
          iris.microOffset = { x: 0, y: 0 };
          iris.backgroundOffset = { x: 0, y: 0 };
          iris.gazeOffset = { x: 0, y: 0 };
          if (includeNystagmus) {
            iris.nystagmusOffset = { x: 0, y: 0 };
          }
          updateIrisTransform2(iris);
          resetNeeded = true;
        }
      });
      if (resetNeeded) {
        notifyEyeGeometryChange(true);
      }
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
        resetMotionOffsets({ includeNystagmus: true });
      }
    }
    function setNystagmusConfig({ direction, wave, rate } = {}) {
      if (direction) {
        state.nystagmusDirection = ["horizontal", "vertical", "mixed"].includes(
          direction,
        )
          ? direction
          : state.nystagmusDirection;
      }
      if (wave) {
        state.nystagmusWave = ["jerk", "pendular"].includes(wave)
          ? wave
          : state.nystagmusWave;
      }
      if (rate) {
        state.nystagmusRate = ["slow", "med", "fast"].includes(rate)
          ? rate
          : state.nystagmusRate;
      }
      if (state.nystagmusLevel > 0) {
        startNystagmusLoop();
        notifyEyeGeometryChange(false);
      }
    }
    function setNystagmusEnabled(isEnabled) {
      setNystagmusLevel(isEnabled ? 60 : 0);
    }
    function setLiveMotionEnabled(isEnabled) {
      state.isLiveMotionEnabled = Boolean(isEnabled);
      if (!state.isLiveMotionEnabled && state.gazeShiftTimerId) {
        clearTimeout(state.gazeShiftTimerId);
        state.gazeShiftTimerId = 0;
      }
      if (!state.isLiveMotionEnabled) {
        resetTemporaryGazeLids();
        resetGazeFacePose();
      }
      resetBlinkLids();
      resetMotionOffsets({ includeNystagmus: false });
      if (state.isBabyMode) {
        resetBlinkSchedule();
      }
      startAmbientAnimations();
    }
    return {
      blinkOnce: () => blinkEyes({ doubleBlink: false }),
      setLiveMotionEnabled,
      setNystagmusConfig,
      setNystagmusEnabled,
      setNystagmusLevel,
      resetBlinkSchedule,
      startAmbientAnimations,
    };
  }

  // src/eyes-controls.js?v=20260308-134
  function initDraggable({
    draggable,
    state,
    applyIrisLayoutPosition: applyIrisLayoutPosition2,
    applyPupilFill: applyPupilFill2,
    getBrightenedDragFillValue,
    notifyEyeGeometryChange,
    syncDeviationDrivenReflexBoost: syncDeviationDrivenReflexBoost2,
  }) {
    let dragging = false;
    const eye = draggable.closest(".eye");
    let eyeRect;
    let centreX;
    let centreY;
    let maxOffsetX;
    let maxOffsetY;
    let eyeScaleX = 1;
    let eyeScaleY = 1;
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
      const draggableRect = draggable.getBoundingClientRect();
      centreX = eyeRect.left + eyeRect.width / 2;
      centreY = eyeRect.top + eyeRect.height / 2;
      eyeScaleX = eye.offsetWidth > 0 ? eyeRect.width / eye.offsetWidth : 1;
      eyeScaleY = eye.offsetHeight > 0 ? eyeRect.height / eye.offsetHeight : 1;
      maxOffsetX = (eyeRect.width / 2 - draggableRect.width / 2) * 0.8;
      maxOffsetY = 30 * eyeScaleY * 0.8;
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
      const layoutDx = eyeScaleX > 0 ? dx / eyeScaleX : dx;
      const layoutDy = eyeScaleY > 0 ? dy / eyeScaleY : dy;
      draggable.manualOffset = { x: layoutDx, y: layoutDy };
      applyIrisLayoutPosition2(draggable);
      const pupil = draggable.querySelector(".pupil");
      if (pupil) {
        const factor = syncDeviationDrivenReflexBoost2(draggable);
        applyPupilFill2(draggable, getBrightenedDragFillValue(factor));
      }
      notifyEyeGeometryChange({ includePosition: true, immediate: true });
    }
    function endDrag() {
      finishDrag();
    }
    draggable.cancelManualDrag = finishDrag;
    draggable.addEventListener("mousedown", startDrag);
    draggable.addEventListener("touchstart", startDrag, { passive: false });
  }
  function initPupilSlider({ slider, notifyEyeGeometryChange }) {
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
  function initVerticalEyelidSliders({
    eyelidSliders,
    notifyEyeGeometryChange,
  }) {
    eyelidSliders.forEach((slider) => {
      slider.addEventListener("input", () => {
        const eyeData = slider.getAttribute("data-eye");
        const eye = document.querySelector(`.eye[data-eye="${eyeData}"]`);
        if (!eye) {
          return;
        }
        const upperEyelid = eye.querySelector(".upper-eyelid");
        if (upperEyelid) {
          const heightPx = `${slider.value * 1.5}px`;
          upperEyelid.dataset.restingHeightPx = heightPx;
          if (
            upperEyelid.dataset.isBlinking !== "true" &&
            !upperEyelid.dataset.gazeLidDroopHeightPx
          ) {
            upperEyelid.style.height = heightPx;
          }
        }
        notifyEyeGeometryChange(false);
      });
    });
  }

  // src/constants.js?v=20260310-194
  var DEFAULT_BASE_REFLEX_COLOR2 = {
    r: Math.round(218 * 0.7),
    g: Math.round(58 * 0.7),
    b: Math.round(0 * 0.7),
  };
  var DEFAULT_REFRACTION_VALUE2 = "zero";
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

  // src/retinoscopy-refraction-values.js?v=20260430-3
  var REFRACTION_VALUES = {
    ACG: "acg",
    ANIRIDIA: "aniridia",
    APHAKIA: "aphakia",
    ANISOMETROPIA: "anisometropia",
    BIG_CORTICAL_CATARACT: "big-cortical-cataract",
    BILATERAL_BLUE_NORMAL: "bilateral-blue-normal",
    BILATERAL_POOR_TEAR_FILM: "bilateral-poor-tear-film",
    BILATERAL_DULL_REFLEX: "bilateral-dull-reflex",
    BILATERAL_DENSE_CATARACT: "bilateral-dense-cataract",
    BILATERAL_ANIRIDIA: "bilateral-aniridia",
    BILATERAL_HIGH_HYPERMETROPIA: "bilateral-high-hypermetropia",
    BILATERAL_KERATOCONUS: "bilateral-keratoconus",
    BILATERAL_MYOPIA: "bilateral-myopia",
    BILATERAL_SMALL_PUPILS: "bilateral-small-pupils",
    BILATERAL_SUBCAPSULAR_CATARACT: "bilateral-subcapsular-cataract",
    CENTRAL_SUB_CORTICAL_CATARACT: "central-sub-cortical-cataract",
    CORNEAL_SCAR: "corneal-scar",
    DENSE_CATARACT: "dense-cataract",
    FLOATERS: "floaters",
    HIGH_CYLINDER: "high-cylinder",
    HIGH_MINUS: "high-minus",
    HIGH_PLUS: "high-plus",
    KERATOCONUS: "keratoconus",
    IRIDOCYCLITIS_KPS: "iridocyclitis-kps",
    IRIS_TRANSILLUMINATION: "iris-transillumination",
    LEUCOCORIA: "leucocoria",
    MINUS: "minus",
    NASAL_COLOBOMA: "nasal-coloboma",
    NORMAL_DARK: "normal-dark",
    NORMAL_HYPER: "normal-hyper",
    PARTIAL_RETINAL_DETACHMENT: "partial-retinal-detachment",
    POSTERIOR_CAPSULAR_THICKENING: "posterior-capsular-thickening",
    POSTERIOR_POLE_CATARACT: "posterior-pole-cataract",
    PLUS: "plus",
    POOR_TEAR_FILM: "poor-tear-film",
    RIGHT_COLOBOMA_LEFT_NORMAL: "right-coloboma-left-normal",
    RIGHT_ACG_LEFT_NORMAL: "right-acg-left-normal",
    RIGHT_BIG_CORTICAL_LEFT_SMALL_CORTICAL:
      "right-big-cortical-left-small-cortical",
    RIGHT_HYPER_LEFT_POSTERIOR_POLE: "right-hyper-left-posterior-pole",
    RIGHT_HYPER_LEFT_MYOPIA: "right-hyper-left-myopia",
    RIGHT_IRIDOCYCLITIS_LEFT_NORMAL: "right-iridocyclitis-left-normal",
    RIGHT_IRIS_TRANSILLUMINATION_LEFT_NORMAL:
      "right-iris-transillumination-left-normal",
    RIGHT_IOL_LEFT_POSTERIOR_CAPSULAR_THICKENING:
      "right-iol-left-posterior-capsular-thickening",
    RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR:
      "right-large-exotropia-left-corneal-scar",
    RIGHT_APHAKIA_LEFT_NORMAL: "right-aphakia-left-normal",
    RIGHT_FLOATERS_LEFT_NORMAL: "right-floaters-left-normal",
    RIGHT_NORMAL_LEFT_ANISOCORIA: "right-normal-left-anisocoria",
    RIGHT_NORMAL_LEFT_CORNEAL_OPACITY: "right-normal-left-corneal-opacity",
    RIGHT_NORMAL_LEFT_SUBLUXATED_LENS: "right-normal-left-subluxated-lens",
    RIGHT_RETINAL_DETACHMENT_LEFT_NORMAL:
      "right-retinal-detachment-left-normal",
    RIGHT_RETINOBLASTOMA_LEFT_NORMAL: "right-retinoblastoma-left-normal",
    RIGHT_NORMAL_LEFT_LARGE_ESOTROPIA: "right-normal-left-large-esotropia",
    RIGHT_VITREOUS_HAEMORRHAGE_LEFT_NORMAL:
      "right-vitreous-haemorrhage-left-normal",
    SMALL_CORTICAL_CATARACT: "small-cortical-cataract",
    SMALL_PUPILS: "small-pupils",
    SMALL_SCISSORS: "small-scissors",
    TECHNIQUE_CHILD_LOOKING_AWAY: "technique-child-looking-away",
    TECHNIQUE_UPPER_LID_BLOCKING: "technique-upper-lid-blocking",
    VITREOUS_HAEMORRHAGE: "vitreous-haemorrhage",
    ZERO: DEFAULT_REFRACTION_VALUE2,
  };
  var DEFAULT_REFLEX_BACKGROUND =
    "radial-gradient(ellipse 72% 62% at 50% 50%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.52) 28%, rgba(255, 255, 255, 0.16) 56%, rgba(255, 255, 255, 0.04) 72%, rgba(255, 255, 255, 0) 84%)";

  // src/retinoscopy-cortical-utils.js?v=20260308-133
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
  function createCorticalCataractPattern(isLarge) {
    const wedgeCount = isLarge
      ? randomIntInRange(4, 5)
      : randomIntInRange(4, 4);
    const minSeparationDeg = isLarge ? 22 : 26;
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
          ? randomFloatInRange(0.86, 0.96)
          : randomFloatInRange(0.8, 0.9),
        widthDeg: isLarge
          ? randomFloatInRange(32, 44)
          : randomFloatInRange(24, 34),
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

  // src/retinoscopy-refraction-values.js?v=20260310-194
  var REFRACTION_VALUES2 = {
    ACG: "acg",
    ANIRIDIA: "aniridia",
    APHAKIA: "aphakia",
    ANISOMETROPIA: "anisometropia",
    BIG_CORTICAL_CATARACT: "big-cortical-cataract",
    BILATERAL_BLUE_NORMAL: "bilateral-blue-normal",
    BILATERAL_POOR_TEAR_FILM: "bilateral-poor-tear-film",
    BILATERAL_DULL_REFLEX: "bilateral-dull-reflex",
    BILATERAL_DENSE_CATARACT: "bilateral-dense-cataract",
    BILATERAL_ANIRIDIA: "bilateral-aniridia",
    BILATERAL_HIGH_HYPERMETROPIA: "bilateral-high-hypermetropia",
    BILATERAL_KERATOCONUS: "bilateral-keratoconus",
    BILATERAL_MYOPIA: "bilateral-myopia",
    BILATERAL_SMALL_PUPILS: "bilateral-small-pupils",
    BILATERAL_SUBCAPSULAR_CATARACT: "bilateral-subcapsular-cataract",
    CENTRAL_SUB_CORTICAL_CATARACT: "central-sub-cortical-cataract",
    CORNEAL_SCAR: "corneal-scar",
    DENSE_CATARACT: "dense-cataract",
    FLOATERS: "floaters",
    HIGH_CYLINDER: "high-cylinder",
    HIGH_MINUS: "high-minus",
    HIGH_PLUS: "high-plus",
    KERATOCONUS: "keratoconus",
    IRIDOCYCLITIS_KPS: "iridocyclitis-kps",
    IRIS_TRANSILLUMINATION: "iris-transillumination",
    LEUCOCORIA: "leucocoria",
    MINUS: "minus",
    NASAL_COLOBOMA: "nasal-coloboma",
    NORMAL_DARK: "normal-dark",
    NORMAL_HYPER: "normal-hyper",
    PARTIAL_RETINAL_DETACHMENT: "partial-retinal-detachment",
    POSTERIOR_CAPSULAR_THICKENING: "posterior-capsular-thickening",
    POSTERIOR_POLE_CATARACT: "posterior-pole-cataract",
    PLUS: "plus",
    POOR_TEAR_FILM: "poor-tear-film",
    RIGHT_COLOBOMA_LEFT_NORMAL: "right-coloboma-left-normal",
    RIGHT_ACG_LEFT_NORMAL: "right-acg-left-normal",
    RIGHT_BIG_CORTICAL_LEFT_SMALL_CORTICAL:
      "right-big-cortical-left-small-cortical",
    RIGHT_HYPER_LEFT_POSTERIOR_POLE: "right-hyper-left-posterior-pole",
    RIGHT_HYPER_LEFT_MYOPIA: "right-hyper-left-myopia",
    RIGHT_IRIDOCYCLITIS_LEFT_NORMAL: "right-iridocyclitis-left-normal",
    RIGHT_IRIS_TRANSILLUMINATION_LEFT_NORMAL:
      "right-iris-transillumination-left-normal",
    RIGHT_IOL_LEFT_POSTERIOR_CAPSULAR_THICKENING:
      "right-iol-left-posterior-capsular-thickening",
    RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR:
      "right-large-exotropia-left-corneal-scar",
    RIGHT_APHAKIA_LEFT_NORMAL: "right-aphakia-left-normal",
    RIGHT_FLOATERS_LEFT_NORMAL: "right-floaters-left-normal",
    RIGHT_NORMAL_LEFT_ANISOCORIA: "right-normal-left-anisocoria",
    RIGHT_NORMAL_LEFT_CORNEAL_OPACITY: "right-normal-left-corneal-opacity",
    RIGHT_NORMAL_LEFT_SUBLUXATED_LENS: "right-normal-left-subluxated-lens",
    RIGHT_RETINAL_DETACHMENT_LEFT_NORMAL:
      "right-retinal-detachment-left-normal",
    RIGHT_RETINOBLASTOMA_LEFT_NORMAL: "right-retinoblastoma-left-normal",
    RIGHT_NORMAL_LEFT_LARGE_ESOTROPIA: "right-normal-left-large-esotropia",
    RIGHT_VITREOUS_HAEMORRHAGE_LEFT_NORMAL:
      "right-vitreous-haemorrhage-left-normal",
    SMALL_CORTICAL_CATARACT: "small-cortical-cataract",
    SMALL_PUPILS: "small-pupils",
    SMALL_SCISSORS: "small-scissors",
    TECHNIQUE_CHILD_LOOKING_AWAY: "technique-child-looking-away",
    TECHNIQUE_UPPER_LID_BLOCKING: "technique-upper-lid-blocking",
    VITREOUS_HAEMORRHAGE: "vitreous-haemorrhage",
    ZERO: DEFAULT_REFRACTION_VALUE2,
  };

  // src/retinoscopy-visual-state.js?v=20260428-6
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

  // src/retinoscopy-case-metadata.js?v=20260430-3
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
    const iridocyclitisKpsCase =
      currentRefraction === REFRACTION_VALUES.IRIDOCYCLITIS_KPS;
    const leucocoriaCase = currentRefraction === REFRACTION_VALUES.LEUCOCORIA;
    const nasalColobomaCase =
      currentRefraction === REFRACTION_VALUES.NASAL_COLOBOMA;
    const normalDarkCase = currentRefraction === REFRACTION_VALUES.NORMAL_DARK;
    const partialRetinalDetachmentCase =
      currentRefraction === REFRACTION_VALUES.PARTIAL_RETINAL_DETACHMENT;
    const posteriorCapsularThickeningCase =
      currentRefraction === REFRACTION_VALUES.POSTERIOR_CAPSULAR_THICKENING;
    const poorTearFilmCase =
      currentRefraction === REFRACTION_VALUES.POOR_TEAR_FILM;
    const rightColobomaLeftNormalCase =
      currentRefraction === REFRACTION_VALUES.RIGHT_COLOBOMA_LEFT_NORMAL;
    const rightAcgLeftNormalCase =
      currentRefraction === REFRACTION_VALUES.RIGHT_ACG_LEFT_NORMAL;
    const rightBigCorticalLeftSmallCorticalCase =
      currentRefraction ===
      REFRACTION_VALUES.RIGHT_BIG_CORTICAL_LEFT_SMALL_CORTICAL;
    const rightHyperLeftPosteriorPoleCase =
      currentRefraction === REFRACTION_VALUES.RIGHT_HYPER_LEFT_POSTERIOR_POLE;
    const rightHyperLeftMyopiaCase =
      currentRefraction === REFRACTION_VALUES.RIGHT_HYPER_LEFT_MYOPIA;
    const rightIridocyclitisLeftNormalCase =
      currentRefraction === REFRACTION_VALUES.RIGHT_IRIDOCYCLITIS_LEFT_NORMAL;
    const rightIrisTransilluminationLeftNormalCase =
      currentRefraction ===
      REFRACTION_VALUES.RIGHT_IRIS_TRANSILLUMINATION_LEFT_NORMAL;
    const rightIolLeftPosteriorCapsularThickeningCase =
      currentRefraction ===
      REFRACTION_VALUES.RIGHT_IOL_LEFT_POSTERIOR_CAPSULAR_THICKENING;
    const rightLargeExotropiaLeftCornealScarCase =
      currentRefraction ===
      REFRACTION_VALUES.RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR;
    const rightAphakiaLeftNormalCase =
      currentRefraction === REFRACTION_VALUES.RIGHT_APHAKIA_LEFT_NORMAL;
    const rightFloatersLeftNormalCase =
      currentRefraction === REFRACTION_VALUES.RIGHT_FLOATERS_LEFT_NORMAL;
    const rightNormalLeftAnisocoriaCase =
      currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_ANISOCORIA;
    const rightNormalLeftCornealOpacityCase =
      currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY;
    const rightNormalLeftSubluxatedLensCase =
      currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS;
    const rightRetinalDetachmentLeftNormalCase =
      currentRefraction ===
      REFRACTION_VALUES.RIGHT_RETINAL_DETACHMENT_LEFT_NORMAL;
    const rightRetinoblastomaLeftNormalCase =
      currentRefraction === REFRACTION_VALUES.RIGHT_RETINOBLASTOMA_LEFT_NORMAL;
    const rightNormalLeftLargeEsotropiaCase =
      currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_LARGE_ESOTROPIA;
    const rightVitreousHaemorrhageLeftNormalCase =
      currentRefraction ===
      REFRACTION_VALUES.RIGHT_VITREOUS_HAEMORRHAGE_LEFT_NORMAL;
    const techniqueChildLookingAwayCase =
      currentRefraction === REFRACTION_VALUES.TECHNIQUE_CHILD_LOOKING_AWAY;
    const techniqueUpperLidBlockingCase =
      currentRefraction === REFRACTION_VALUES.TECHNIQUE_UPPER_LID_BLOCKING;
    const smallCorticalCataractCase =
      currentRefraction === REFRACTION_VALUES.SMALL_CORTICAL_CATARACT;
    const smallPupilsCase =
      currentRefraction === REFRACTION_VALUES.SMALL_PUPILS;
    const bigCorticalCataractCase =
      currentRefraction === REFRACTION_VALUES.BIG_CORTICAL_CATARACT;
    const bilateralBlueNormalCase =
      currentRefraction === REFRACTION_VALUES.BILATERAL_BLUE_NORMAL;
    const bilateralPoorTearFilmCase =
      currentRefraction === REFRACTION_VALUES.BILATERAL_POOR_TEAR_FILM;
    const bilateralDullReflexCase =
      currentRefraction === REFRACTION_VALUES.BILATERAL_DULL_REFLEX;
    const bilateralDenseCataractCase =
      currentRefraction === REFRACTION_VALUES.BILATERAL_DENSE_CATARACT;
    const bilateralAniridiaCase =
      currentRefraction === REFRACTION_VALUES.BILATERAL_ANIRIDIA;
    const bilateralHighHypermetropiaCase =
      currentRefraction === REFRACTION_VALUES.BILATERAL_HIGH_HYPERMETROPIA;
    const bilateralKeratoconusCase =
      currentRefraction === REFRACTION_VALUES.BILATERAL_KERATOCONUS;
    const bilateralMyopiaCase =
      currentRefraction === REFRACTION_VALUES.BILATERAL_MYOPIA;
    const bilateralSmallPupilsCase =
      currentRefraction === REFRACTION_VALUES.BILATERAL_SMALL_PUPILS;
    const bilateralSubcapsularCataractCase =
      currentRefraction === REFRACTION_VALUES.BILATERAL_SUBCAPSULAR_CATARACT;
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
      bilateralBlueNormalCase,
      bilateralPoorTearFilmCase,
      bilateralDullReflexCase,
      bilateralDenseCataractCase,
      bilateralAniridiaCase,
      bilateralHighHypermetropiaCase,
      bilateralKeratoconusCase,
      bilateralMyopiaCase,
      bilateralSmallPupilsCase,
      bilateralSubcapsularCataractCase,
      centralSubCorticalCataractCase,
      cornealScarCase,
      corticalCataractCase:
        smallCorticalCataractCase || bigCorticalCataractCase,
      cylinderCase,
      denseCataractCase,
      floatersCase,
      iridocyclitisKpsCase,
      irisTransilluminationCase,
      keratoconusCase,
      leucocoriaCase,
      nasalColobomaCase,
      normalDarkCase,
      partialRetinalDetachmentCase,
      posteriorCapsularThickeningCase,
      posteriorPoleCataractCase,
      poorTearFilmCase,
      rightAcgLeftNormalCase,
      rightColobomaLeftNormalCase,
      rightBigCorticalLeftSmallCorticalCase,
      rightHyperLeftPosteriorPoleCase,
      rightHyperLeftMyopiaCase,
      rightIridocyclitisLeftNormalCase,
      rightIrisTransilluminationLeftNormalCase,
      rightIolLeftPosteriorCapsularThickeningCase,
      rightLargeExotropiaLeftCornealScarCase,
      rightAphakiaLeftNormalCase,
      rightFloatersLeftNormalCase,
      rightNormalLeftAnisocoriaCase,
      rightNormalLeftCornealOpacityCase,
      rightNormalLeftSubluxatedLensCase,
      rightRetinalDetachmentLeftNormalCase,
      rightRetinoblastomaLeftNormalCase,
      rightNormalLeftLargeEsotropiaCase,
      rightVitreousHaemorrhageLeftNormalCase,
      scissorsCase,
      smallCorticalCataractCase,
      smallPupilsCase,
      techniqueChildLookingAwayCase,
      techniqueUpperLidBlockingCase,
      vitreousHaemorrhageCase,
    };
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
    if (currentRefraction === REFRACTION_VALUES.BILATERAL_ANIRIDIA) {
      return REFRACTION_VALUES.ANIRIDIA;
    }
    if (currentRefraction === REFRACTION_VALUES.BILATERAL_BLUE_NORMAL) {
      return REFRACTION_VALUES.ZERO;
    }
    if (currentRefraction === REFRACTION_VALUES.BILATERAL_POOR_TEAR_FILM) {
      return REFRACTION_VALUES.POOR_TEAR_FILM;
    }
    if (currentRefraction === REFRACTION_VALUES.BILATERAL_DULL_REFLEX) {
      return REFRACTION_VALUES.ZERO;
    }
    if (currentRefraction === REFRACTION_VALUES.IRIS_TRANSILLUMINATION) {
      return REFRACTION_VALUES.ZERO;
    }
    if (currentRefraction === REFRACTION_VALUES.IRIDOCYCLITIS_KPS) {
      return REFRACTION_VALUES.ZERO;
    }
    if (currentRefraction === REFRACTION_VALUES.NASAL_COLOBOMA) {
      return REFRACTION_VALUES.ZERO;
    }
    if (currentRefraction === REFRACTION_VALUES.NORMAL_DARK) {
      return activeEye === "right"
        ? REFRACTION_VALUES.NORMAL_DARK
        : REFRACTION_VALUES.ZERO;
    }
    if (currentRefraction === REFRACTION_VALUES.RIGHT_COLOBOMA_LEFT_NORMAL) {
      return REFRACTION_VALUES.ZERO;
    }
    if (currentRefraction === REFRACTION_VALUES.RIGHT_ACG_LEFT_NORMAL) {
      return REFRACTION_VALUES.ZERO;
    }
    if (
      currentRefraction === REFRACTION_VALUES.RIGHT_RETINOBLASTOMA_LEFT_NORMAL
    ) {
      return activeEye === "left"
        ? REFRACTION_VALUES.LEUCOCORIA
        : REFRACTION_VALUES.ZERO;
    }
    if (
      currentRefraction ===
      REFRACTION_VALUES.RIGHT_IRIS_TRANSILLUMINATION_LEFT_NORMAL
    ) {
      return REFRACTION_VALUES.ZERO;
    }
    if (
      currentRefraction ===
      REFRACTION_VALUES.RIGHT_IOL_LEFT_POSTERIOR_CAPSULAR_THICKENING
    ) {
      return activeEye === "left"
        ? REFRACTION_VALUES.ZERO
        : REFRACTION_VALUES.POSTERIOR_CAPSULAR_THICKENING;
    }
    if (currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_ANISOCORIA) {
      return REFRACTION_VALUES.ZERO;
    }
    if (
      currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY
    ) {
      return REFRACTION_VALUES.ZERO;
    }
    if (
      currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS
    ) {
      return REFRACTION_VALUES.ZERO;
    }
    if (currentRefraction === REFRACTION_VALUES.RIGHT_APHAKIA_LEFT_NORMAL) {
      return activeEye === "left"
        ? REFRACTION_VALUES.APHAKIA
        : REFRACTION_VALUES.ZERO;
    }
    if (currentRefraction === REFRACTION_VALUES.RIGHT_FLOATERS_LEFT_NORMAL) {
      return REFRACTION_VALUES.ZERO;
    }
    if (
      currentRefraction ===
      REFRACTION_VALUES.RIGHT_VITREOUS_HAEMORRHAGE_LEFT_NORMAL
    ) {
      return REFRACTION_VALUES.ZERO;
    }
    if (
      currentRefraction ===
      REFRACTION_VALUES.RIGHT_RETINAL_DETACHMENT_LEFT_NORMAL
    ) {
      return activeEye === "left"
        ? REFRACTION_VALUES.PARTIAL_RETINAL_DETACHMENT
        : REFRACTION_VALUES.ZERO;
    }
    if (currentRefraction === REFRACTION_VALUES.BILATERAL_DENSE_CATARACT) {
      return REFRACTION_VALUES.DENSE_CATARACT;
    }
    if (
      currentRefraction ===
      REFRACTION_VALUES.RIGHT_BIG_CORTICAL_LEFT_SMALL_CORTICAL
    ) {
      return activeEye === "left"
        ? REFRACTION_VALUES.BIG_CORTICAL_CATARACT
        : REFRACTION_VALUES.SMALL_CORTICAL_CATARACT;
    }
    if (
      currentRefraction === REFRACTION_VALUES.RIGHT_HYPER_LEFT_POSTERIOR_POLE
    ) {
      return activeEye === "left"
        ? REFRACTION_VALUES.NORMAL_HYPER
        : REFRACTION_VALUES.POSTERIOR_POLE_CATARACT;
    }
    if (currentRefraction === REFRACTION_VALUES.RIGHT_HYPER_LEFT_MYOPIA) {
      return activeEye === "left"
        ? REFRACTION_VALUES.NORMAL_HYPER
        : REFRACTION_VALUES.MINUS;
    }
    if (
      currentRefraction === REFRACTION_VALUES.RIGHT_IRIDOCYCLITIS_LEFT_NORMAL
    ) {
      return REFRACTION_VALUES.ZERO;
    }
    if (
      currentRefraction ===
      REFRACTION_VALUES.RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR
    ) {
      return activeEye === "left"
        ? REFRACTION_VALUES.ZERO
        : REFRACTION_VALUES.CORNEAL_SCAR;
    }
    if (currentRefraction === REFRACTION_VALUES.BILATERAL_HIGH_HYPERMETROPIA) {
      return REFRACTION_VALUES.NORMAL_HYPER;
    }
    if (currentRefraction === REFRACTION_VALUES.BILATERAL_MYOPIA) {
      return REFRACTION_VALUES.MINUS;
    }
    if (currentRefraction === REFRACTION_VALUES.BILATERAL_SMALL_PUPILS) {
      return REFRACTION_VALUES.ZERO;
    }
    if (
      currentRefraction === REFRACTION_VALUES.BILATERAL_SUBCAPSULAR_CATARACT
    ) {
      return REFRACTION_VALUES.CENTRAL_SUB_CORTICAL_CATARACT;
    }
    if (currentRefraction === REFRACTION_VALUES.BILATERAL_KERATOCONUS) {
      return REFRACTION_VALUES.KERATOCONUS;
    }
    if (
      currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_LARGE_ESOTROPIA
    ) {
      return REFRACTION_VALUES.ZERO;
    }
    if (
      currentRefraction === REFRACTION_VALUES.TECHNIQUE_CHILD_LOOKING_AWAY ||
      currentRefraction === REFRACTION_VALUES.TECHNIQUE_UPPER_LID_BLOCKING
    ) {
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
  function getVisualFlagsForEye(currentRefraction, eyeType) {
    if (currentRefraction === REFRACTION_VALUES.RIGHT_COLOBOMA_LEFT_NORMAL) {
      return getCaseFlags(
        eyeType === "left"
          ? REFRACTION_VALUES.NASAL_COLOBOMA
          : REFRACTION_VALUES.ZERO,
      );
    }
    if (
      currentRefraction ===
      REFRACTION_VALUES.RIGHT_IRIS_TRANSILLUMINATION_LEFT_NORMAL
    ) {
      return getCaseFlags(
        eyeType === "left"
          ? REFRACTION_VALUES.IRIS_TRANSILLUMINATION
          : REFRACTION_VALUES.ZERO,
      );
    }
    if (currentRefraction === REFRACTION_VALUES.RIGHT_ACG_LEFT_NORMAL) {
      return getCaseFlags(
        eyeType === "left" ? REFRACTION_VALUES.ACG : REFRACTION_VALUES.ZERO,
      );
    }
    if (
      currentRefraction === REFRACTION_VALUES.RIGHT_IRIDOCYCLITIS_LEFT_NORMAL
    ) {
      return getCaseFlags(
        eyeType === "left"
          ? REFRACTION_VALUES.IRIDOCYCLITIS_KPS
          : REFRACTION_VALUES.ZERO,
      );
    }
    if (currentRefraction === REFRACTION_VALUES.RIGHT_FLOATERS_LEFT_NORMAL) {
      return getCaseFlags(
        eyeType === "left"
          ? REFRACTION_VALUES.FLOATERS
          : REFRACTION_VALUES.ZERO,
      );
    }
    if (
      currentRefraction ===
      REFRACTION_VALUES.RIGHT_VITREOUS_HAEMORRHAGE_LEFT_NORMAL
    ) {
      return getCaseFlags(
        eyeType === "left"
          ? REFRACTION_VALUES.VITREOUS_HAEMORRHAGE
          : REFRACTION_VALUES.ZERO,
      );
    }
    if (
      currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY
    ) {
      return getCaseFlags(REFRACTION_VALUES.ZERO);
    }
    if (currentRefraction === REFRACTION_VALUES.BILATERAL_SMALL_PUPILS) {
      return getCaseFlags(REFRACTION_VALUES.SMALL_PUPILS);
    }
    if (currentRefraction === REFRACTION_VALUES.BILATERAL_DULL_REFLEX) {
      return getCaseFlags(REFRACTION_VALUES.ZERO);
    }
    if (currentRefraction === REFRACTION_VALUES.BILATERAL_POOR_TEAR_FILM) {
      return getCaseFlags(REFRACTION_VALUES.POOR_TEAR_FILM);
    }
    if (
      currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS
    ) {
      return getCaseFlags(REFRACTION_VALUES.ZERO);
    }
    if (
      currentRefraction === REFRACTION_VALUES.NORMAL_DARK ||
      currentRefraction === REFRACTION_VALUES.BILATERAL_BLUE_NORMAL ||
      currentRefraction === REFRACTION_VALUES.BILATERAL_POOR_TEAR_FILM ||
      currentRefraction === REFRACTION_VALUES.BILATERAL_ANIRIDIA ||
      currentRefraction === REFRACTION_VALUES.BILATERAL_DENSE_CATARACT ||
      currentRefraction === REFRACTION_VALUES.BILATERAL_HIGH_HYPERMETROPIA ||
      currentRefraction === REFRACTION_VALUES.BILATERAL_KERATOCONUS ||
      currentRefraction === REFRACTION_VALUES.BILATERAL_MYOPIA ||
      currentRefraction === REFRACTION_VALUES.BILATERAL_SUBCAPSULAR_CATARACT ||
      currentRefraction === REFRACTION_VALUES.RIGHT_ACG_LEFT_NORMAL ||
      currentRefraction === REFRACTION_VALUES.RIGHT_COLOBOMA_LEFT_NORMAL ||
      currentRefraction ===
        REFRACTION_VALUES.RIGHT_BIG_CORTICAL_LEFT_SMALL_CORTICAL ||
      currentRefraction === REFRACTION_VALUES.RIGHT_HYPER_LEFT_MYOPIA ||
      currentRefraction === REFRACTION_VALUES.RIGHT_IRIDOCYCLITIS_LEFT_NORMAL ||
      currentRefraction === REFRACTION_VALUES.RIGHT_HYPER_LEFT_POSTERIOR_POLE ||
      currentRefraction ===
        REFRACTION_VALUES.RIGHT_IOL_LEFT_POSTERIOR_CAPSULAR_THICKENING ||
      currentRefraction ===
        REFRACTION_VALUES.RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR ||
      currentRefraction === REFRACTION_VALUES.RIGHT_APHAKIA_LEFT_NORMAL ||
      currentRefraction === REFRACTION_VALUES.RIGHT_FLOATERS_LEFT_NORMAL ||
      currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_ANISOCORIA ||
      currentRefraction ===
        REFRACTION_VALUES.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY ||
      currentRefraction ===
        REFRACTION_VALUES.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS ||
      currentRefraction ===
        REFRACTION_VALUES.RIGHT_RETINOBLASTOMA_LEFT_NORMAL ||
      currentRefraction === REFRACTION_VALUES.TECHNIQUE_CHILD_LOOKING_AWAY ||
      currentRefraction === REFRACTION_VALUES.TECHNIQUE_UPPER_LID_BLOCKING ||
      currentRefraction ===
        REFRACTION_VALUES.RIGHT_RETINAL_DETACHMENT_LEFT_NORMAL ||
      currentRefraction ===
        REFRACTION_VALUES.RIGHT_VITREOUS_HAEMORRHAGE_LEFT_NORMAL
    ) {
      return getCaseFlags(
        getActiveRefractionForMode(currentRefraction, eyeType),
      );
    }
    return getCaseFlags(currentRefraction);
  }

  // src/eyes-layout.js?v=20260821-1
  function getEffectiveBaseReflexColor(currentRefraction, baseReflexColor) {
    if (currentRefraction === REFRACTION_VALUES.BILATERAL_BLUE_NORMAL) {
      return BLUE_END_REFLEX_COLOR;
    }
    return baseReflexColor;
  }
  function getEffectiveBaseReflexColorCss(currentRefraction, baseReflexColor) {
    const { r, g, b } = getEffectiveBaseReflexColor(
      currentRefraction,
      baseReflexColor,
    );
    return `rgb(${r}, ${g}, ${b})`;
  }
  function getBrightenedReflexFillValue({
    currentRefraction,
    baseReflexColor,
    factor,
  }) {
    const brightColor = brightenColor(
      getEffectiveBaseReflexColor(currentRefraction, baseReflexColor),
      factor,
    );
    return `rgb(${brightColor.r}, ${brightColor.g}, ${brightColor.b})`;
  }
  function getDeviationBoostFactor(iris) {
    if (!iris) {
      return 1;
    }
    const eye = iris.closest(".eye");
    if (!eye) {
      return 1;
    }
    const caseOffset = iris.caseOffset || { x: 0, y: 0 };
    const manualOffset = iris.manualOffset || { x: 0, y: 0 };
    const totalX = caseOffset.x + manualOffset.x;
    const totalY = caseOffset.y + manualOffset.y;
    const distance = Math.hypot(totalX, totalY);
    const maxOffsetX = Math.max(
      1,
      (eye.clientWidth / 2 - (iris.offsetWidth || 80) / 2) * 0.8,
    );
    const maxOffsetY = 30 * 0.8;
    const maxDistance = Math.max(1, Math.hypot(maxOffsetX, maxOffsetY));
    return 1 + Math.min(distance / maxDistance, 1);
  }
  function applyIrisLayoutPosition(iris) {
    if (!iris) {
      return;
    }
    const caseOffset = iris.caseOffset || { x: 0, y: 0 };
    const manualOffset = iris.manualOffset || { x: 0, y: 0 };
    iris.style.setProperty(
      "--iris-layout-x",
      `${caseOffset.x + manualOffset.x}px`,
    );
    iris.style.setProperty(
      "--iris-layout-y",
      `${caseOffset.y + manualOffset.y}px`,
    );
  }
  function setManualDragReflexBoost(iris, factor) {
    const eye = iris == null ? void 0 : iris.closest(".eye");
    if (!eye) {
      return;
    }
    const safeFactor = Math.max(1, factor);
    const reflexBrightnessBoost = 1 + (safeFactor - 1) * 1.25;
    const reflexOpacityBoost = 1 + (safeFactor - 1) * 0.45;
    eye.style.setProperty(
      "--manual-drag-reflex-brightness-boost",
      reflexBrightnessBoost.toFixed(3),
    );
    eye.style.setProperty(
      "--manual-drag-reflex-opacity-boost",
      reflexOpacityBoost.toFixed(3),
    );
    eye.style.setProperty(
      "--manual-drag-pupil-fill-factor",
      safeFactor.toFixed(3),
    );
  }
  function syncDeviationDrivenReflexBoost(iris) {
    const factor = getDeviationBoostFactor(iris);
    setManualDragReflexBoost(iris, factor);
    return factor;
  }
  function getCaseEyeOffset(currentRefraction, eyeType) {
    if (currentRefraction === REFRACTION_VALUES.TECHNIQUE_CHILD_LOOKING_AWAY) {
      return { x: 26, y: -2 };
    }
    if (
      currentRefraction ===
        REFRACTION_VALUES.RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR &&
      eyeType === "left"
    ) {
      return { x: -20, y: 0 };
    }
    if (
      currentRefraction ===
        REFRACTION_VALUES.RIGHT_NORMAL_LEFT_LARGE_ESOTROPIA &&
      eyeType === "right"
    ) {
      return { x: -20, y: 0 };
    }
    return { x: 0, y: 0 };
  }
  function getIrisColourValue(irisColour) {
    const root = getComputedStyle(document.documentElement);
    switch (irisColour) {
      case "light-brown":
        return root.getPropertyValue("--iris-light-brown").trim();
      case "green":
        return root.getPropertyValue("--iris-green").trim();
      case "blue":
        return root.getPropertyValue("--iris-blue").trim();
      case "dark-brown":
      default:
        return root.getPropertyValue("--iris-dark-brown").trim();
    }
  }
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
  function applyManualEyeMoveState({ irises, isManualEyeMoveEnabled }) {
    irises.forEach((iris) => {
      iris.classList.toggle("is-manual-drag-enabled", isManualEyeMoveEnabled);
    });
  }
  function applyBabyModeState({ eyesWrapper, isBabyMode }) {
    eyesWrapper == null
      ? void 0
      : eyesWrapper.classList.toggle("is-baby-mode", isBabyMode);
  }
  function getCataractPupilFilter(level) {
    const normalized = Math.max(0, Math.min(100, level)) / 100;
    const brightness = 1 - normalized * 0.72;
    const saturation = 1 - normalized * 0.64;
    const contrast = 1 - normalized * 0.18;
    return `brightness(${brightness.toFixed(2)}) saturate(${saturation.toFixed(2)}) contrast(${contrast.toFixed(2)})`;
  }
  function applyCataractToPupils({ irises, cataractLevel }) {
    const filterValue = getCataractPupilFilter(cataractLevel);
    irises.forEach((iris) => {
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
  function updateIrisTransform(iris) {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    const totalX =
      (((_a2 = iris.gazeOffset) == null ? void 0 : _a2.x) || 0) +
      (((_b = iris.microOffset) == null ? void 0 : _b.x) || 0) +
      (((_c = iris.backgroundOffset) == null ? void 0 : _c.x) || 0) +
      (((_d = iris.nystagmusOffset) == null ? void 0 : _d.x) || 0);
    const totalY =
      (((_e = iris.gazeOffset) == null ? void 0 : _e.y) || 0) +
      (((_f = iris.microOffset) == null ? void 0 : _f.y) || 0) +
      (((_g = iris.backgroundOffset) == null ? void 0 : _g.y) || 0) +
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

  // src/eyes.js?v=20260821-1
  function createEyesController({ state, dom, onEyeGeometryChange }) {
    const NORMAL_PUPIL_SIZE = 32;
    const DILATED_PUPIL_SIZE = 46;
    const ambientController = createAmbientEyeController({
      dom,
      notifyEyeGeometryChange,
      state,
      updateIrisTransform,
    });
    function notifyEyeGeometryChange(options = true) {
      const normalizedOptions =
        typeof options === "boolean"
          ? { includePosition: options, immediate: false }
          : {
              includePosition:
                (options == null ? void 0 : options.includePosition) === void 0
                  ? true
                  : Boolean(options.includePosition),
              immediate: Boolean(options == null ? void 0 : options.immediate),
            };
      if (typeof onEyeGeometryChange === "function") {
        onEyeGeometryChange(normalizedOptions);
      }
    }
    function applyCaseEyePosture({ includePosition = true } = {}) {
      dom.irises.forEach((iris) => {
        var _a2;
        const eyeType =
          (_a2 = iris.closest(".eye")) == null ? void 0 : _a2.dataset.eye;
        const { x, y } = getCaseEyeOffset(state.currentRefraction, eyeType);
        iris.caseOffset = { x, y };
        applyIrisLayoutPosition(iris);
        syncDeviationDrivenReflexBoost(iris);
      });
      notifyEyeGeometryChange(includePosition);
    }
    function setIrisColour(value) {
      const nextValue = String(value || "").trim();
      const normalizedValue = nextValue || "dark-brown";
      const irisColourValue = getIrisColourValue(normalizedValue);
      state.irisColour = normalizedValue;
      dom.irises.forEach((iris) => {
        iris.style.background = irisColourValue;
      });
    }
    function applyReflexColor(color) {
      const effectiveColor =
        state.currentRefraction === REFRACTION_VALUES.BILATERAL_BLUE_NORMAL
          ? getEffectiveBaseReflexColorCss(
              state.currentRefraction,
              state.baseReflexColor,
            )
          : color;
      dom.irises.forEach((iris) => {
        applyPupilFill(iris, effectiveColor);
      });
      applyCataractToPupils({
        irises: dom.irises,
        cataractLevel: state.cataractLevel,
      });
    }
    function setCataractLevel(value) {
      const parsed = Number.isFinite(value) ? value : parseInt(value, 10);
      if (Number.isNaN(parsed)) {
        return;
      }
      state.cataractLevel = Math.max(0, Math.min(100, parsed));
      applyCataractToPupils({
        irises: dom.irises,
        cataractLevel: state.cataractLevel,
      });
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
      applyManualEyeMoveState({
        irises: dom.irises,
        isManualEyeMoveEnabled: state.isManualEyeMoveEnabled,
      });
    }
    function setBabyMode(isEnabled) {
      const nextValue = Boolean(isEnabled);
      const previousValue = state.isBabyMode;
      state.isBabyMode = nextValue;
      dom.irises.forEach((iris) => {
        if (typeof iris.cancelManualDrag === "function") {
          iris.cancelManualDrag();
        }
      });
      applyBabyModeState({
        eyesWrapper: dom.eyesWrapper,
        isBabyMode: state.isBabyMode,
      });
      applyCaseEyePosture({ includePosition: true });
      if (previousValue !== nextValue) {
        ambientController.resetBlinkSchedule();
      }
    }
    function setDilatedMode(isEnabled) {
      state.isDilatedMode = Boolean(isEnabled);
      const targetSize = state.isDilatedMode
        ? DILATED_PUPIL_SIZE
        : NORMAL_PUPIL_SIZE;
      dom.pupilSizeSliders.forEach((slider) => {
        slider.value = String(targetSize);
        slider.dispatchEvent(new Event("input"));
      });
      notifyEyeGeometryChange({ includePosition: true, immediate: true });
    }
    function syncRefractionPose() {
      applyCaseEyePosture({ includePosition: true });
    }
    function init() {
      dom.irises.forEach((iris) => {
        iris.nystagmusOffset = { x: 0, y: 0 };
        iris.caseOffset = { x: 0, y: 0 };
        iris.manualOffset = { x: 0, y: 0 };
        syncDeviationDrivenReflexBoost(iris);
      });
      dom.irises.forEach((iris) => {
        initDraggable({
          draggable: iris,
          state,
          applyIrisLayoutPosition,
          applyPupilFill,
          getBrightenedDragFillValue: (factor) =>
            getBrightenedReflexFillValue({
              currentRefraction: state.currentRefraction,
              baseReflexColor: state.baseReflexColor,
              factor,
            }),
          notifyEyeGeometryChange,
          syncDeviationDrivenReflexBoost,
        });
      });
      dom.pupilSizeSliders.forEach((slider) => {
        initPupilSlider({ slider, notifyEyeGeometryChange });
      });
      initVerticalEyelidSliders({
        eyelidSliders: dom.eyelidSliders,
        notifyEyeGeometryChange,
      });
      applyCataractToPupils({
        irises: dom.irises,
        cataractLevel: state.cataractLevel,
      });
      applyManualEyeMoveState({
        irises: dom.irises,
        isManualEyeMoveEnabled: state.isManualEyeMoveEnabled,
      });
      applyBabyModeState({
        eyesWrapper: dom.eyesWrapper,
        isBabyMode: state.isBabyMode,
      });
      setIrisColour(state.irisColour);
      applyCaseEyePosture({ includePosition: false });
    }
    return {
      init,
      applyReflexColor,
      setBabyMode,
      setDilatedMode,
      setIrisColour,
      setCataractLevel,
      blinkOnce: ambientController.blinkOnce,
      setLiveMotionEnabled: ambientController.setLiveMotionEnabled,
      setManualEyeMoveEnabled,
      setNystagmusConfig: ambientController.setNystagmusConfig,
      setNystagmusEnabled: ambientController.setNystagmusEnabled,
      setNystagmusLevel: ambientController.setNystagmusLevel,
      syncRefractionPose,
      startAmbientAnimations: ambientController.startAmbientAnimations,
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

  // src/info-modal.js?v=20260501-1
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
    return {
      close: ({ restoreFocus = false } = {}) => {
        infoModalController.close({ restoreFocus });
        infoIcon.setAttribute("aria-expanded", "false");
      },
      isOpen: () => infoModalController.isOpen(),
    };
  }

  // src/learn-content.js?v=20260501-3
  var HANDOUT_ASSETS = {
    pdf: {
      filename: "fundal-reflex-universal-handout.pdf",
      title: "Fundal reflex handout PDF",
      type: "application/pdf",
      url: "assets/handouts/fundal-reflex-universal-handout.pdf",
    },
    image: {
      filename: "fundal-reflex-universal-handout.webp",
      title: "Fundal reflex handout image",
      type: "image/webp",
      url: "assets/handouts/fundal-reflex-universal-handout.webp",
    },
  };
  var LEARN_PANELS = [
    {
      id: "preparation",
      image: "assets/handouts/panels/preparation.webp?v=20260501-1",
      title: "Get a good view",
      text: "Dim light. Calm or swaddle. Start at arm's length, then move side to side and closer.",
    },
    {
      id: "looking-away",
      image: "assets/handouts/panels/looking-away.webp?v=20260501-1",
      title: "Looking away",
      text: "If the child is not looking, adjust and repeat before judging.",
      caseLinks: [
        { label: "Try case 3", value: "technique-child-looking-away" },
      ],
    },
    {
      id: "eyelids",
      image: "assets/handouts/panels/eyelids.webp?v=20260501-1",
      title: "Lids blocking",
      text: "If the pupil is partly covered, open gently and repeat.",
      caseLinks: [
        { label: "Try case 4", value: "technique-upper-lid-blocking" },
      ],
    },
    {
      id: "normal-variation",
      image: "assets/handouts/panels/normal-variation.webp?v=20260501-1",
      title: "Normal can vary",
      text: "In those with darker pigmentation, a normal reflex may look orange-yellow or blue-white. Bright, equal and round is reassuring.",
      caseLinks: [
        { label: "Case 1", value: "zero" },
        { label: "Case 2", value: "bilateral-blue-normal" },
      ],
    },
    {
      id: "unclear-repeat",
      image: "assets/handouts/panels/unclear-repeat.webp?v=20260501-1",
      title: "Unclear is active",
      text: "Do not guess. Improve the view, repeat or ask for help.",
    },
    {
      id: "ask-help",
      image: "assets/handouts/panels/ask-help.webp?v=20260501-1",
      title: "Ask for help",
      text: "A photo or another trained person can help decide repeat or refer.",
    },
    {
      id: "possible-findings",
      image: "assets/handouts/panels/possible-findings.webp?v=20260501-1",
      title: "Refer when abnormal",
      text: "White, dull, absent, black or very unequal reflexes may mean scar, cataract or haemorrhage.",
      caseLinks: [
        { label: "Try case 7", value: "right-retinoblastoma-left-normal" },
        { label: "Try case 5", value: "right-normal-left-large-esotropia" },
        { label: "Try case 8", value: "normal-dark" },
      ],
    },
  ];

  // src/learn-modal.js?v=20260502-1
  function setSideMenuOpen({ burgerIcon, sideMenu }, isOpen) {
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
    if (burgerIcon) {
      burgerIcon.setAttribute("aria-expanded", String(isOpen));
      burgerIcon.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu",
      );
    }
  }
  function buildPanelCard(panel) {
    var _a2;
    const card = document.createElement("article");
    card.className = "learn-explain-card";
    card.dataset.learnPanelId = panel.id;
    const image = document.createElement("img");
    image.className = "learn-explain-image";
    image.src = panel.image;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.draggable = false;
    const body = document.createElement("div");
    body.className = "learn-explain-body";
    const title = document.createElement("h3");
    title.textContent = panel.title;
    const text = document.createElement("p");
    text.textContent = panel.text;
    body.append(title, text);
    if ((_a2 = panel.caseLinks) == null ? void 0 : _a2.length) {
      const actions = document.createElement("div");
      actions.className = "learn-case-actions";
      panel.caseLinks.forEach((caseLink) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "learn-case-button";
        button.dataset.caseValue = caseLink.value;
        button.textContent = caseLink.label;
        actions.appendChild(button);
      });
      body.appendChild(actions);
    }
    card.append(image, body);
    return card;
  }
  function setActiveTab({ panels, tabs }, activeTab) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.learnTab === activeTab;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });
    panels.forEach((panel) => {
      const isActive = panel.dataset.learnPanel === activeTab;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });
  }
  async function tryShareAsset(asset, statusElement) {
    if (!asset) {
      return;
    }
    const absoluteUrl = new URL(asset.url, window.location.href).href;
    if (!navigator.share) {
      statusElement.textContent =
        "Sharing is not available here. Use download.";
      return;
    }
    try {
      if (
        window.location.protocol !== "file:" &&
        window.File &&
        navigator.canShare
      ) {
        const response = await fetch(asset.url);
        const blob = await response.blob();
        const file = new File([blob], asset.filename, { type: asset.type });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: asset.title,
          });
          statusElement.textContent = "Share sheet opened.";
          return;
        }
      }
      await navigator.share({
        title: asset.title,
        url: absoluteUrl,
      });
      statusElement.textContent = "Share sheet opened.";
    } catch (error) {
      statusElement.textContent =
        (error == null ? void 0 : error.name) === "AbortError"
          ? "Share cancelled."
          : "Sharing failed here. Use download.";
    }
  }
  function initLearnModal({ dom, onBeforeOpen, onSelectCase }) {
    const {
      body,
      burgerIcon,
      sideMenu,
      infoIcon,
      infoLearnButton,
      learnMenuButton,
      learnModal,
      learnModalContent,
      learnHandoutImage,
      closeLearnModalButton,
      learnExplainList,
      learnTabs,
      learnPanels,
      learnShareStatus,
    } = dom;
    if (
      !body ||
      !learnModal ||
      !learnModalContent ||
      !closeLearnModalButton ||
      !learnExplainList ||
      !(learnTabs == null ? void 0 : learnTabs.length) ||
      !(learnPanels == null ? void 0 : learnPanels.length) ||
      !learnShareStatus
    ) {
      return;
    }
    const learnModalController = createModalController({
      body,
      focusRoot: learnModalContent,
      initialFocusElement: closeLearnModalButton,
      modal: learnModal,
    });
    learnExplainList.replaceChildren(
      ...LEARN_PANELS.map((panel) => buildPanelCard(panel)),
    );
    const ensureHandoutLoaded = () => {
      if (!learnHandoutImage || learnHandoutImage.src) {
        return;
      }
      const source = learnHandoutImage.dataset.src;
      if (source) {
        learnHandoutImage.src = source;
      }
    };
    const openLearnModal = (triggerElement, preferredTab = "handout") => {
      if (typeof onBeforeOpen === "function") {
        onBeforeOpen();
      }
      if (preferredTab === "handout") {
        ensureHandoutLoaded();
      }
      setActiveTab({ panels: learnPanels, tabs: learnTabs }, preferredTab);
      learnShareStatus.textContent = "";
      setSideMenuOpen({ burgerIcon, sideMenu }, false);
      if (infoIcon) {
        infoIcon.setAttribute("aria-expanded", "false");
      }
      learnModalController.open({
        triggerElement:
          triggerElement === infoLearnButton
            ? infoIcon || triggerElement
            : triggerElement,
      });
    };
    learnMenuButton == null
      ? void 0
      : learnMenuButton.addEventListener("click", () => {
          openLearnModal(learnMenuButton, "handout");
        });
    infoLearnButton == null
      ? void 0
      : infoLearnButton.addEventListener("click", () => {
          openLearnModal(infoLearnButton, "handout");
        });
    closeLearnModalButton.addEventListener("click", () => {
      learnModalController.close();
    });
    learnModal.addEventListener("click", (event) => {
      if (event.target === learnModal) {
        learnModalController.close({ restoreFocus: false });
      }
    });
    learnTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        if (tab.dataset.learnTab === "handout") {
          ensureHandoutLoaded();
        }
        setActiveTab(
          { panels: learnPanels, tabs: learnTabs },
          tab.dataset.learnTab,
        );
      });
    });
    learnExplainList.addEventListener("click", (event) => {
      const button =
        event.target instanceof Element
          ? event.target.closest(".learn-case-button")
          : null;
      if (!(button == null ? void 0 : button.dataset.caseValue)) {
        return;
      }
      if (typeof onSelectCase === "function") {
        onSelectCase(button.dataset.caseValue);
      }
      learnModalController.close({ restoreFocus: false });
    });
    learnModal.addEventListener("click", (event) => {
      const shareButton =
        event.target instanceof Element
          ? event.target.closest("[data-share-resource]")
          : null;
      if (!shareButton) {
        return;
      }
      const asset = HANDOUT_ASSETS[shareButton.dataset.shareResource];
      tryShareAsset(asset, learnShareStatus);
    });
    return {
      open: openLearnModal,
    };
  }

  // src/mcq-bank.js?v=20260430-2
  var MCQ_LEVEL_META = {
    primary: { title: "Primary", passMark: 3, questionCount: 5 },
    intermediate: { title: "Intermediate", passMark: 4, questionCount: 6 },
    advanced: { title: "Advanced", passMark: 6, questionCount: 8 },
  };
  var MCQ_BANK = {
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
          "A normal right reflex but dark left reflex should make you focus on:",
        options: [
          "Left-right comparison",
          "Pupil size alone",
          "Eye alignment alone",
          "A blue-white colour variant",
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
          "Urgent same-day referral",
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
          "A blue reflex that is equal in both eyes and otherwise normal is mainly a:",
        options: [
          "Colour variant",
          "Lens opacity",
          "White reflex concern",
          "Dark reflex problem",
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
          "Upper lids partly cover both pupils, so the reflex cannot be judged well. This is:",
        options: [
          "Poor view: adjust and repeat",
          "Normal blue reflex",
          "Dense cataract",
          "Large exotropia",
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
          "In esotropia, the apparent corneal-reflex offset is mostly because:",
        options: [
          "The eye has turned",
          "The pupil is smaller",
          "The reflex is blue-white",
          "The lens is cloudy",
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
        question: "A corneal scar in the Primary set mainly affects:",
        options: [
          "Clarity of the reflex",
          "Eye alignment",
          "Pupil size",
          "Reflex colour variant",
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
          "In the Primary set, the most important safety comparison is:",
        options: [
          "Right versus left reflex",
          "One eye at a time only",
          "Pupil size alone",
          "Eye colour alone",
        ],
        answer: 0,
      },
    ],
    intermediate: [
      {
        question:
          "Both eyes show a superior crescent. Best Intermediate match:",
        options: [
          "High hypermetropia",
          "Myopia",
          "Poor tear film",
          "Anisocoria",
        ],
        answer: 0,
      },
      {
        question:
          "Both eyes show an inferior crescent. Best Intermediate match:",
        options: [
          "Myopia",
          "High hypermetropia",
          "Dull corneal reflex",
          "Dense cataract",
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
        question: "A dull corneal reflex is mainly a problem of:",
        options: [
          "Corneal light quality",
          "Retinal detachment",
          "Absent lens",
          "Vitreous blood",
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
        question: "Poor tear film should look most like:",
        options: [
          "An unstable surface shimmer",
          "A fixed dark retinal sector",
          "A missing iris",
          "A sharp lens edge",
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
        question: "Different crescent directions in the two eyes suggest:",
        options: [
          "Anisometropia",
          "Retinoblastoma",
          "IOL reflection",
          "Vitreous haemorrhage",
        ],
        answer: 0,
      },
      {
        question:
          "An inferior keyhole-shaped pupil with an altered reflex is most typical of:",
        options: [
          "Coloboma",
          "Aniridia",
          "Acute angle closure",
          "Iridocyclitis",
        ],
        answer: 0,
      },
      {
        question: "In the coloboma case, the centred reflex should be:",
        options: [
          "Equal apart from the notch",
          "Absent in both eyes",
          "Mobile like floaters",
          "Hidden by blood",
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
        question: "In anisocoria, the key comparison is:",
        options: [
          "Pupil size right versus left",
          "Corneal scar position",
          "Crescent direction",
          "Lens opacity density",
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
        question: "Iris transillumination means light is:",
        options: [
          "Passing through an iris defect",
          "Blocked by vitreous blood",
          "Blocked by the retina",
          "Made blue by myopia",
        ],
        answer: 0,
      },
      {
        question:
          "Both pupils are small, making the reflex harder to view. Best match:",
        options: [
          "Small pupils",
          "Aphakia",
          "Keratoconus",
          "Retinal detachment",
        ],
        answer: 0,
      },
      {
        question: "Small pupils mainly make the screening task:",
        options: [
          "Trickier because the view is narrower",
          "Urgent by themselves",
          "A sign of aphakia",
          "A sign of IOL reflection",
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
        question: "Posterior pole opacity is most likely to affect:",
        options: [
          "The central reflex",
          "Crescent direction",
          "Pupil alignment",
          "Corneal surface",
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
          "Dense cataract in both eyes is an Intermediate case because it is:",
        options: [
          "A media opacity reducing both reflexes",
          "A normal blue reflex",
          "An alignment problem only",
          "A retinal shadow",
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
        question: "A corneal opacity should mainly be described under:",
        options: [
          "Cornea and clarity",
          "Retina and detachment",
          "Vitreous mobility",
          "IOL reflection",
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
        question: "A subluxated lens is suggested by:",
        options: [
          "A visible displaced lens edge",
          "A normal equal orange reflex",
          "Blue reflex in both eyes",
          "Mobile vitreous dots only",
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
          "A painful red eye pattern plus vertical oval pupil and dull reflex should be treated as:",
        options: ["Routine review", "Benign", "Soon review", "Urgent today"],
        answer: 3,
      },
      {
        question:
          "Acute angle closure in this simulator is mainly signalled by:",
        options: [
          "Painful-looking eye with oval pupil",
          "Equal normal reflexes",
          "A normal blue reflex",
          "Only poor tear film",
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
        question: "Keratoconus should be recognised by:",
        options: [
          "Distorted scissors-like reflex",
          "A white pupil",
          "A fixed retinal sector",
          "A second IOL reflection",
        ],
        answer: 0,
      },
      {
        question:
          "Spoke-like radial lens shadows cross the reflex. Best match:",
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
          "With vertical light movement, cortical cataract spokes should:",
        options: [
          "Stay fixed while the reflex behind changes",
          "Move up and down as a group",
          "Disappear completely",
          "Become a retinal detachment",
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
          "Subcapsular cataract is especially likely to be noticed with:",
        options: [
          "Glare symptoms",
          "Only large exotropia",
          "Only blue reflex",
          "Only nystagmus",
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
        question: "Aphakia means:",
        options: [
          "Absent crystalline lens",
          "Small pupil",
          "Poor tear film",
          "Retinal detachment",
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
        question: "Floaters differ from retinal detachment because they are:",
        options: [
          "Mobile opacities",
          "A fixed sector",
          "A white pupil",
          "A missing iris",
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
        question: "Vitreous haemorrhage should look more like:",
        options: [
          "Diffuse obscuring haze",
          "A clear normal reflex",
          "A blue reflex variant",
          "A sharp lens edge",
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
        question:
          "Retinal detachment differs from floaters because the shadow is:",
        options: [
          "Fixed in position",
          "Freely drifting",
          "Only a corneal reflection",
          "Only a blue colour change",
        ],
        answer: 0,
      },
      {
        question:
          "A specialist adult-skewed media case with radial lens spokes is:",
        options: [
          "Cortical cataract",
          "Dull corneal reflex",
          "Normal blue reflex",
          "Poor tear film",
        ],
        answer: 0,
      },
      {
        question:
          "A specialist adult-skewed posterior segment case with a blood-like reflex haze is:",
        options: [
          "Vitreous haemorrhage",
          "Anisocoria",
          "High hypermetropia",
          "Small pupils",
        ],
        answer: 0,
      },
      {
        question:
          "A fixed retinal shadow with urgent referral concern best fits:",
        options: [
          "Retinal detachment",
          "Poor tear film",
          "Normal blue reflex",
          "Dull corneal reflex",
        ],
        answer: 0,
      },
      {
        question:
          "In Advanced cases, a pseudophakic clue means the patient has:",
        options: [
          "An intraocular lens",
          "No iris tissue",
          "A small pupil only",
          "A normal infant reflex",
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

  // src/mcq.js?v=20260430-2
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
      var _a2;
      const optionLabels = Array.from(
        questionBlock.querySelectorAll(".options label"),
      );
      optionLabels.forEach((label) => {
        label.classList.remove("correct-answer-label", "wrong-answer-label");
      });
      const correctOptionIndex =
        (_a2 = questions[questionIndex]) == null ? void 0 : _a2.answer;
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

  // src/menu-mcq.js?v=20260430-2
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
    const setSideMenuOpen2 = (isOpen) => {
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
      submitMcqButton.disabled = false;
      setSideMenuOpen2(false);
      mcqModalController.open({ triggerElement });
    };
    burgerIcon.addEventListener("click", () => {
      setSideMenuOpen2(!sideMenu.classList.contains("open"));
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
        return;
      }
      const score = gradeMcq(state.activeMcqQuestions, answers);
      revealMcqFeedback(mcqContainer, state.activeMcqQuestions, answers);
      submitMcqButton.disabled = true;
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
          setSideMenuOpen2(false);
        }
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") {
        return;
      }
      setSideMenuOpen2(false);
      mcqModalController.close();
    });
  }

  // src/menu-visual-cases.js?v=20260430-9
  var CASE_THUMBNAIL_VERSION = "20260430-6";
  var CASE_PHOTO_VERSION = "20260426-10";
  var CASE_REFERENCE_PHOTOS = {
    zero: "1normal.webp",
    "normal-dark": "2dark.webp",
    "right-hyper-left-posterior-pole": "3postpole.webp",
    "right-normal-left-large-esotropia": "4eso.webp",
    "right-large-exotropia-left-corneal-scar": "5exo.webp",
    "bilateral-high-hypermetropia": "6phyper.webp",
    "bilateral-myopia": "7myopia.webp",
  };
  var FLAT_CASE_OPTIONS = REFRACTION_GROUPS.flatMap(
    (group) => group.options || [],
  );
  var CASE_OPTION_BY_VALUE = new Map(
    FLAT_CASE_OPTIONS.map((optionConfig) => [optionConfig.value, optionConfig]),
  );
  function uniqueCaseOptions(options) {
    const seenValues = /* @__PURE__ */ new Set();
    return options.filter((optionConfig) => {
      if (!optionConfig || seenValues.has(optionConfig.value)) {
        return false;
      }
      seenValues.add(optionConfig.value);
      return true;
    });
  }
  var LEVEL_ORDERED_CASE_OPTIONS = uniqueCaseOptions(
    CASE_LEVELS.flatMap((level) => level.values).map((caseValue) =>
      CASE_OPTION_BY_VALUE.get(caseValue),
    ),
  );
  var LEVEL_ORDERED_BABY_CASE_OPTIONS = LEVEL_ORDERED_CASE_OPTIONS.filter(
    (optionConfig) => BABY_REFRACTION_VALUE_SET.has(optionConfig.value),
  );
  var CASE_LEVEL_BY_VALUE = new Map(
    CASE_LEVELS.flatMap((level) =>
      level.values.map((caseValue) => [caseValue, level]),
    ),
  );
  function parseCaseLabel(label) {
    const match = /^(\d+)\.\s*(.*)$/.exec(String(label || "").trim());
    if (!match) {
      return { index: "", text: String(label || "").trim() };
    }
    return {
      index: match[1],
      text: match[2],
    };
  }
  function getCaseLabel(caseValue) {
    var _a2;
    for (const group of REFRACTION_GROUPS) {
      const match =
        (_a2 = group.options) == null
          ? void 0
          : _a2.find((optionConfig) => optionConfig.value === caseValue);
      if (match) {
        return match.label;
      }
    }
    return "";
  }
  function getCaseTriggerLabel(caseValue) {
    var _a2;
    for (const group of REFRACTION_GROUPS) {
      const match =
        (_a2 = group.options) == null
          ? void 0
          : _a2.find((optionConfig) => optionConfig.value === caseValue);
      if (match) {
        return match.triggerLabel || match.label;
      }
    }
    return "";
  }
  function getCaseLevel(caseValue) {
    return CASE_LEVEL_BY_VALUE.get(caseValue) || null;
  }
  function getCaseIndexInOptions(caseValue, options) {
    return options.findIndex(
      (optionConfig) => optionConfig.value === caseValue,
    );
  }
  function getCaseThumbnailSrc(caseValue) {
    return `assets/case-thumbnails/${caseValue}.webp?v=${CASE_THUMBNAIL_VERSION}`;
  }
  function getCasePhotoSrc(caseValue) {
    const filename = CASE_REFERENCE_PHOTOS[caseValue];
    if (!filename) {
      return "";
    }
    return `assets/images/${filename}?v=${CASE_PHOTO_VERSION}`;
  }
  function openVisualCaseModal({ modalController, triggerButton }) {
    if (!modalController || !triggerButton) {
      return;
    }
    triggerButton.setAttribute("aria-expanded", "true");
    modalController.open({ triggerElement: triggerButton });
  }
  function closeVisualCaseModal({
    modalController,
    triggerButton,
    restoreFocus = false,
  }) {
    if (!modalController || !triggerButton) {
      return;
    }
    triggerButton.setAttribute("aria-expanded", "false");
    modalController.close({ restoreFocus });
  }
  function openVisualCasePhotoModal({
    modalController,
    title,
    image,
    caseLabel,
    caseValue,
    triggerButton = null,
  }) {
    const photoSrc = getCasePhotoSrc(caseValue);
    if (!modalController || !title || !image || !photoSrc) {
      return false;
    }
    title.textContent = caseLabel || "Case photo";
    image.src = photoSrc;
    image.alt = caseLabel
      ? `Reference photo for ${caseLabel}`
      : "Reference photo";
    modalController.open({ triggerElement: triggerButton });
    return true;
  }
  function closeVisualCasePhotoModal({
    modalController,
    title,
    image,
    restoreFocus = false,
  }) {
    if (!modalController || !title || !image) {
      return;
    }
    modalController.close({ restoreFocus });
    title.textContent = "Case photo";
    image.src = "";
    image.alt = "";
  }
  function buildCaseCard(optionConfig, selectedValue) {
    const { index, text } = parseCaseLabel(optionConfig.label);
    const hasPhoto = Boolean(getCasePhotoSrc(optionConfig.value));
    const shell = document.createElement("div");
    shell.className = "visual-case-card-shell";
    const card = document.createElement("button");
    card.type = "button";
    card.className = "visual-case-card";
    if (hasPhoto) {
      card.classList.add("has-photo");
    }
    card.dataset.value = optionConfig.value;
    card.setAttribute(
      "aria-pressed",
      String(optionConfig.value === selectedValue),
    );
    if (optionConfig.value === selectedValue) {
      card.classList.add("is-selected");
    }
    const header = document.createElement("div");
    header.className = "visual-case-header";
    const indexBadge = document.createElement("span");
    indexBadge.className = "visual-case-index";
    indexBadge.textContent = index;
    const label = document.createElement("span");
    label.className = "visual-case-label";
    label.textContent = text;
    header.append(indexBadge, label);
    const preview = document.createElement("div");
    preview.className = "visual-case-preview";
    const image = document.createElement("img");
    image.className = "visual-case-preview-image";
    image.src = getCaseThumbnailSrc(optionConfig.value);
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.draggable = false;
    preview.appendChild(image);
    card.append(header, preview);
    shell.appendChild(card);
    if (hasPhoto) {
      const photoButton = document.createElement("button");
      photoButton.type = "button";
      photoButton.className = "visual-case-photo-button";
      photoButton.dataset.value = optionConfig.value;
      photoButton.title = `Open reference photo for ${optionConfig.label}`;
      photoButton.setAttribute(
        "aria-label",
        `Open reference photo for ${optionConfig.label}`,
      );
      photoButton.setAttribute("aria-haspopup", "dialog");
      const photoIcon = document.createElement("span");
      photoIcon.className = "visual-case-photo-icon";
      photoIcon.setAttribute("aria-hidden", "true");
      photoButton.appendChild(photoIcon);
      shell.appendChild(photoButton);
    }
    return shell;
  }
  function syncSelectedCase(container, selectedValue) {
    if (!container) {
      return;
    }
    container.querySelectorAll(".visual-case-card").forEach((card) => {
      const isSelected = card.dataset.value === selectedValue;
      card.classList.toggle("is-selected", isSelected);
      card.setAttribute("aria-pressed", String(isSelected));
    });
  }
  function initVisualCaseMenu({ dom, state, onBeforeSelectCase }) {
    const {
      body,
      refractionStateSelect,
      visualCaseTrigger,
      visualCaseCurrentLabel,
      casePrevButton,
      caseNextButton,
      visualCaseModal,
      visualCaseModalContent,
      closeVisualCaseModalButton,
      visualCaseSimilar,
      visualCaseSimilarList,
      visualCaseModalList,
      visualCasePhotoModal,
      visualCasePhotoModalContent,
      closeVisualCasePhotoModalButton,
      visualCasePhotoTitle,
      visualCasePhotoImage,
    } = dom;
    if (
      !body ||
      !refractionStateSelect ||
      !visualCaseTrigger ||
      !visualCaseCurrentLabel ||
      !visualCaseModal ||
      !visualCaseModalContent ||
      !closeVisualCaseModalButton ||
      !visualCaseSimilar ||
      !visualCaseSimilarList ||
      !visualCaseModalList ||
      !visualCasePhotoModal ||
      !visualCasePhotoModalContent ||
      !closeVisualCasePhotoModalButton ||
      !visualCasePhotoTitle ||
      !visualCasePhotoImage
    ) {
      return;
    }
    const visualCaseModalController = createModalController({
      body,
      focusRoot: visualCaseModalContent,
      initialFocusElement: closeVisualCaseModalButton,
      modal: visualCaseModal,
    });
    const visualCasePhotoModalController = createModalController({
      body,
      focusRoot: visualCasePhotoModalContent,
      initialFocusElement: closeVisualCasePhotoModalButton,
      modal: visualCasePhotoModal,
    });
    function setParentModalActiveForAssistiveTech(isActive) {
      if (visualCaseModal.getAttribute("aria-hidden") === "false") {
        visualCaseModal.setAttribute("aria-modal", String(isActive));
      }
    }
    function buildCaseLevelDetails({ level, isOpen = false }) {
      const details = document.createElement("details");
      details.className = "visual-case-level";
      details.dataset.level = level.value;
      details.open = isOpen;
      const summary = document.createElement("summary");
      summary.className = "visual-case-level-summary";
      summary.textContent = `${level.label} cases (${level.options.length})`;
      const cards = document.createElement("div");
      cards.className = "visual-case-group-cards";
      level.options.forEach((optionConfig) => {
        cards.appendChild(buildCaseCard(optionConfig, state.currentRefraction));
      });
      details.append(summary, cards);
      return details;
    }
    function getAvailableCaseOptions() {
      return state.isBabyMode
        ? LEVEL_ORDERED_BABY_CASE_OPTIONS
        : LEVEL_ORDERED_CASE_OPTIONS;
    }
    function isCaseAvailable(caseValue) {
      return !state.isBabyMode || BABY_REFRACTION_VALUE_SET.has(caseValue);
    }
    function getAvailableLevelGroups() {
      return CASE_LEVELS.map((level) => {
        const options = level.values
          .map((caseValue) => CASE_OPTION_BY_VALUE.get(caseValue))
          .filter(
            (optionConfig) =>
              optionConfig &&
              (!state.isBabyMode ||
                BABY_REFRACTION_VALUE_SET.has(optionConfig.value)),
          );
        return {
          label: level.label,
          value: level.value,
          options,
        };
      }).filter((level) => level.options.length);
    }
    function renderCasePickerOptions() {
      const groups = getAvailableLevelGroups();
      const fragment = document.createDocumentFragment();
      groups.forEach((level, index) => {
        fragment.appendChild(
          buildCaseLevelDetails({
            level,
            isOpen: index === 0,
          }),
        );
      });
      visualCaseModalList.replaceChildren(fragment);
      syncSelectedCase(visualCaseModalList, refractionStateSelect.value);
    }
    function syncCaseStepperState(caseValue) {
      const options = getAvailableCaseOptions();
      const currentIndex = getCaseIndexInOptions(caseValue, options);
      const hasCases = currentIndex !== -1;
      if (casePrevButton) {
        casePrevButton.disabled = !hasCases || options.length < 2;
      }
      if (caseNextButton) {
        caseNextButton.disabled = !hasCases || options.length < 2;
      }
    }
    function renderSimilarCases(caseValue) {
      const similarOptions = getSimilarCaseOptions(caseValue).filter(
        (optionConfig) => isCaseAvailable(optionConfig.value),
      );
      if (!similarOptions.length) {
        visualCaseSimilar.hidden = true;
        visualCaseSimilar.open = false;
        visualCaseSimilarList.replaceChildren();
        return;
      }
      const similarFragment = document.createDocumentFragment();
      similarOptions.forEach((optionConfig) => {
        const { index, text } = parseCaseLabel(optionConfig.label);
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "visual-case-similar-chip";
        chip.dataset.value = optionConfig.value;
        chip.textContent = index ? `${index}. ${text}` : text;
        similarFragment.appendChild(chip);
      });
      visualCaseSimilarList.replaceChildren(similarFragment);
      visualCaseSimilar.hidden = false;
      visualCaseSimilar.open = false;
    }
    function syncTriggerLabel(caseValue) {
      const fullLabel = getCaseLabel(caseValue) || "Select a case";
      const triggerLabel = getCaseTriggerLabel(caseValue) || fullLabel;
      const caseLevel = getCaseLevel(caseValue);
      visualCaseCurrentLabel.textContent = triggerLabel;
      visualCaseCurrentLabel.title = fullLabel;
      visualCaseCurrentLabel.dataset.level =
        (caseLevel == null ? void 0 : caseLevel.value) || "";
      visualCaseCurrentLabel.dataset.levelLabel =
        (caseLevel == null ? void 0 : caseLevel.label) || "";
      visualCaseTrigger.dataset.level =
        (caseLevel == null ? void 0 : caseLevel.value) || "";
      visualCaseTrigger.title = fullLabel;
      visualCaseTrigger.setAttribute(
        "aria-label",
        caseLevel ? `${caseLevel.label} case: ${fullLabel}` : fullLabel,
      );
      renderSimilarCases(caseValue);
      syncCaseStepperState(caseValue);
    }
    function openCasePicker() {
      const selectedValue = refractionStateSelect.value;
      renderCasePickerOptions();
      syncSelectedCase(visualCaseModalList, selectedValue);
      openVisualCaseModal({
        modalController: visualCaseModalController,
        triggerButton: visualCaseTrigger,
      });
    }
    function openPhotoForCase(caseValue, triggerButton = null) {
      const didOpen = openVisualCasePhotoModal({
        modalController: visualCasePhotoModalController,
        title: visualCasePhotoTitle,
        image: visualCasePhotoImage,
        caseLabel: getCaseLabel(caseValue),
        caseValue,
        triggerButton,
      });
      if (didOpen) {
        setParentModalActiveForAssistiveTech(false);
      }
      return didOpen;
    }
    function selectAdjacentCase(step) {
      var _a2, _b;
      const options = getAvailableCaseOptions();
      const currentIndex = getCaseIndexInOptions(
        refractionStateSelect.value,
        options,
      );
      if (!options.length) {
        return;
      }
      if (currentIndex === -1) {
        selectVisualCase((_a2 = options[0]) == null ? void 0 : _a2.value);
        return;
      }
      const lastIndex = options.length - 1;
      let nextIndex = currentIndex + step;
      if (nextIndex < 0) {
        nextIndex = lastIndex;
      } else if (nextIndex > lastIndex) {
        nextIndex = 0;
      }
      selectVisualCase((_b = options[nextIndex]) == null ? void 0 : _b.value);
    }
    function selectVisualCase(nextValue) {
      if (!nextValue || !isCaseAvailable(nextValue)) {
        return;
      }
      if (typeof onBeforeSelectCase === "function") {
        onBeforeSelectCase();
      }
      closeVisualCasePhotoModal({
        modalController: visualCasePhotoModalController,
        title: visualCasePhotoTitle,
        image: visualCasePhotoImage,
        restoreFocus: false,
      });
      refractionStateSelect.value = nextValue;
      refractionStateSelect.dispatchEvent(
        new Event("change", { bubbles: true }),
      );
      renderCasePickerOptions();
      syncSelectedCase(visualCaseModalList, nextValue);
      syncTriggerLabel(nextValue);
      closeVisualCaseModal({
        modalController: visualCaseModalController,
        triggerButton: visualCaseTrigger,
        restoreFocus: false,
      });
      visualCaseModal.setAttribute("aria-modal", "true");
    }
    visualCaseTrigger.addEventListener("click", () => {
      if (visualCaseTrigger.disabled) {
        return;
      }
      openCasePicker();
    });
    casePrevButton == null
      ? void 0
      : casePrevButton.addEventListener("click", () => {
          if (casePrevButton.disabled) {
            return;
          }
          selectAdjacentCase(-1);
        });
    caseNextButton == null
      ? void 0
      : caseNextButton.addEventListener("click", () => {
          if (caseNextButton.disabled) {
            return;
          }
          selectAdjacentCase(1);
        });
    closeVisualCaseModalButton.addEventListener("click", () => {
      closeVisualCasePhotoModal({
        modalController: visualCasePhotoModalController,
        title: visualCasePhotoTitle,
        image: visualCasePhotoImage,
        restoreFocus: false,
      });
      closeVisualCaseModal({
        modalController: visualCaseModalController,
        triggerButton: visualCaseTrigger,
        restoreFocus: true,
      });
      visualCaseModal.setAttribute("aria-modal", "true");
    });
    visualCaseModal.addEventListener("click", (event) => {
      if (event.target !== visualCaseModal) {
        return;
      }
      closeVisualCasePhotoModal({
        modalController: visualCasePhotoModalController,
        title: visualCasePhotoTitle,
        image: visualCasePhotoImage,
        restoreFocus: false,
      });
      closeVisualCaseModal({
        modalController: visualCaseModalController,
        triggerButton: visualCaseTrigger,
        restoreFocus: false,
      });
      visualCaseModal.setAttribute("aria-modal", "true");
    });
    visualCaseModal.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !event.defaultPrevented) {
        return;
      }
      closeVisualCaseModal({
        modalController: visualCaseModalController,
        triggerButton: visualCaseTrigger,
        restoreFocus: true,
      });
      visualCaseModal.setAttribute("aria-modal", "true");
    });
    closeVisualCasePhotoModalButton.addEventListener("click", () => {
      closeVisualCasePhotoModal({
        modalController: visualCasePhotoModalController,
        title: visualCasePhotoTitle,
        image: visualCasePhotoImage,
        restoreFocus: true,
      });
      setParentModalActiveForAssistiveTech(true);
    });
    visualCasePhotoModal.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !event.defaultPrevented) {
        return;
      }
      closeVisualCasePhotoModal({
        modalController: visualCasePhotoModalController,
        title: visualCasePhotoTitle,
        image: visualCasePhotoImage,
        restoreFocus: true,
      });
      setParentModalActiveForAssistiveTech(true);
    });
    visualCasePhotoModal.addEventListener("click", (event) => {
      if (event.target !== visualCasePhotoModal) {
        return;
      }
      closeVisualCasePhotoModal({
        modalController: visualCasePhotoModalController,
        title: visualCasePhotoTitle,
        image: visualCasePhotoImage,
        restoreFocus: false,
      });
      setParentModalActiveForAssistiveTech(true);
    });
    window.addEventListener("keydown", (event) => {
      if (event.defaultPrevented) {
        return;
      }
      if (event.key !== "Escape") {
        return;
      }
      if (visualCasePhotoModal.getAttribute("aria-hidden") === "false") {
        closeVisualCasePhotoModal({
          modalController: visualCasePhotoModalController,
          title: visualCasePhotoTitle,
          image: visualCasePhotoImage,
          restoreFocus: true,
        });
        setParentModalActiveForAssistiveTech(true);
        return;
      }
      if (visualCaseModal.getAttribute("aria-hidden") === "true") {
        return;
      }
      closeVisualCaseModal({
        modalController: visualCaseModalController,
        triggerButton: visualCaseTrigger,
        restoreFocus: true,
      });
      visualCaseModal.setAttribute("aria-modal", "true");
    });
    visualCaseModalList.addEventListener("click", (event) => {
      const photoButton =
        event.target instanceof Element
          ? event.target.closest(".visual-case-photo-button")
          : null;
      if (photoButton) {
        openPhotoForCase(photoButton.dataset.value, photoButton);
        return;
      }
      const button =
        event.target instanceof Element
          ? event.target.closest(".visual-case-card")
          : null;
      if (!button) {
        return;
      }
      selectVisualCase(button.dataset.value);
    });
    visualCaseSimilarList.addEventListener("click", (event) => {
      const button =
        event.target instanceof Element
          ? event.target.closest(".visual-case-similar-chip")
          : null;
      if (!button) {
        return;
      }
      selectVisualCase(button.dataset.value);
    });
    refractionStateSelect.addEventListener("change", (event) => {
      var _a2;
      if (!isCaseAvailable(event.target.value)) {
        const fallback =
          (_a2 = getAvailableCaseOptions()[0]) == null ? void 0 : _a2.value;
        if (fallback) {
          refractionStateSelect.value = fallback;
          refractionStateSelect.dispatchEvent(
            new Event("change", { bubbles: true }),
          );
        }
        return;
      }
      syncSelectedCase(visualCaseModalList, event.target.value);
      syncTriggerLabel(event.target.value);
    });
    function setBabyMode() {
      var _a2;
      renderCasePickerOptions();
      if (!isCaseAvailable(refractionStateSelect.value)) {
        const fallback =
          (_a2 = getAvailableCaseOptions()[0]) == null ? void 0 : _a2.value;
        if (fallback) {
          refractionStateSelect.value = fallback;
          refractionStateSelect.dispatchEvent(
            new Event("change", { bubbles: true }),
          );
        }
        return;
      }
      syncSelectedCase(visualCaseModalList, refractionStateSelect.value);
      syncTriggerLabel(refractionStateSelect.value);
    }
    renderCasePickerOptions();
    syncSelectedCase(visualCaseModalList, refractionStateSelect.value);
    syncTriggerLabel(refractionStateSelect.value);
    closeVisualCaseModal({
      modalController: visualCaseModalController,
      triggerButton: visualCaseTrigger,
      restoreFocus: false,
    });
    closeVisualCasePhotoModal({
      modalController: visualCasePhotoModalController,
      title: visualCasePhotoTitle,
      image: visualCasePhotoImage,
      restoreFocus: false,
    });
    visualCaseModal.setAttribute("aria-modal", "true");
    return {
      hasPhotoForCase: (caseValue = refractionStateSelect.value) =>
        Boolean(getCasePhotoSrc(caseValue)),
      openCasePicker,
      selectAdjacentCase,
      selectCase: selectVisualCase,
      setBabyMode,
    };
  }

  // src/observation-guide.js?v=20260430-1
  var OBSERVATION_GUIDE_COLLAPSE_DELAY_MS = 5e3;
  var TEACHING_REPLAY_OPEN_DELAY_MS = 900;
  var TEACHING_REPLAY_FINAL_HOLD_MS = 3e3;
  var PRIMARY_TEACHING_REPLAY_CUES = ["Match", "Bright", "Straight"];
  var FULL_TEACHING_REPLAY_CUES = [
    "Light",
    "Colour",
    "Shape",
    "Crescent",
    "Cornea",
    "Compare",
  ];
  var TEACHING_REPLAY_CUE_DURATIONS = {
    Bright: 2400,
    Crescent: 2600,
    Compare: 2600,
    Colour: 2400,
    Cornea: 2400,
    Light: 2400,
    Match: 2400,
    Shape: 2400,
    Straight: 2400,
  };
  function createObservationGuideController({ dom, isPrimaryCase, state }) {
    var _a2;
    if (
      !dom.observationGuide ||
      !dom.observationGuideToggle ||
      !((_a2 = dom.observationGuideItems) == null ? void 0 : _a2.length) ||
      !dom.observationGuideDetail
    ) {
      return null;
    }
    let selectedKey = "";
    let hoveredKey = "";
    let teachingKey = "";
    let hintTimerId = 0;
    let collapseTimerId = 0;
    let teachingReplayTimerIds = [];
    let isObservationGuideUserControlled = false;
    const getGuideMode = () =>
      isPrimaryCase(state.currentRefraction) ? "primary" : "full";
    const getActiveGuideKeys = () =>
      getGuideMode() === "primary"
        ? PRIMARY_TEACHING_REPLAY_CUES
        : FULL_TEACHING_REPLAY_CUES;
    const hideTeachingOverlay = () => {
      var _a3, _b, _c, _d;
      (_a3 = dom.observationTeachingOverlay) == null
        ? void 0
        : _a3.classList.remove("is-visible");
      (_b = dom.observationTeachingTargets) == null
        ? void 0
        : _b.forEach((target) => {
            target.classList.remove(
              "is-visible",
              "is-crescent-top",
              "is-crescent-bottom",
            );
            target.dataset.guideCue = "";
            target.removeAttribute("style");
          });
      (_c = dom.observationTeachingConnector) == null
        ? void 0
        : _c.classList.remove("is-visible");
      (_d = dom.observationTeachingConnector) == null
        ? void 0
        : _d.removeAttribute("style");
    };
    const syncObservationGuideMode = () => {
      const mode = getGuideMode();
      const activeKeys = getActiveGuideKeys();
      dom.observationGuide.classList.toggle(
        "is-primary-guide",
        mode === "primary",
      );
      dom.observationGuide.classList.toggle("is-full-guide", mode === "full");
      if (selectedKey && !activeKeys.includes(selectedKey)) {
        selectedKey = "";
      }
      if (hoveredKey && !activeKeys.includes(hoveredKey)) {
        hoveredKey = "";
      }
      if (teachingKey && !activeKeys.includes(teachingKey)) {
        teachingKey = "";
        hideTeachingOverlay();
      }
    };
    const getGuideItemByKey = (key) =>
      dom.observationGuideItems.find(
        (item) => item.dataset.guideLabel === key,
      ) || null;
    const clearObservationGuideCollapseTimer = () => {
      if (collapseTimerId) {
        window.clearTimeout(collapseTimerId);
        collapseTimerId = 0;
      }
    };
    const hideObservationGuideHint = () => {
      if (hintTimerId) {
        window.clearTimeout(hintTimerId);
        hintTimerId = 0;
      }
      dom.observationGuide.classList.remove("is-hint-visible");
    };
    const clearTeachingReplay = () => {
      teachingReplayTimerIds.forEach((timerId) => window.clearTimeout(timerId));
      teachingReplayTimerIds = [];
      teachingKey = "";
      hideTeachingOverlay();
    };
    const queueTeachingReplayTimer = (callback, delay) => {
      const timerId = window.setTimeout(() => {
        teachingReplayTimerIds = teachingReplayTimerIds.filter(
          (id) => id !== timerId,
        );
        callback();
      }, delay);
      teachingReplayTimerIds.push(timerId);
    };
    const showObservationGuideHint = () => {
      if (prefersReducedMotion()) {
        return;
      }
      hideObservationGuideHint();
      dom.observationGuide.classList.add("is-hint-visible");
      hintTimerId = window.setTimeout(() => {
        dom.observationGuide.classList.remove("is-hint-visible");
        hintTimerId = 0;
      }, 3e3);
    };
    const getStageRelativeRect = (element) => {
      var _a3, _b;
      const wrapperRect =
        (_a3 = dom.eyesWrapper) == null ? void 0 : _a3.getBoundingClientRect();
      const elementRect =
        (_b = element == null ? void 0 : element.getBoundingClientRect) == null
          ? void 0
          : _b.call(element);
      if (!wrapperRect || !elementRect) {
        return null;
      }
      return {
        bottom: elementRect.bottom - wrapperRect.top,
        height: elementRect.height,
        left: elementRect.left - wrapperRect.left,
        right: elementRect.right - wrapperRect.left,
        top: elementRect.top - wrapperRect.top,
        width: elementRect.width,
      };
    };
    const setTeachingTargetBox = (
      target,
      rect,
      {
        cue,
        expandX = 0,
        expandY = expandX,
        extraClass = "",
        forceCircle = false,
      } = {},
    ) => {
      if (!target || !rect) {
        return false;
      }
      let targetRect = rect;
      if (forceCircle) {
        const centreX = rect.left + rect.width * 0.5;
        const centreY = rect.top + rect.height * 0.5;
        const size = Math.max(
          rect.width + expandX * 2,
          rect.height + expandY * 2,
        );
        targetRect = {
          height: size,
          left: centreX - size * 0.5,
          top: centreY - size * 0.5,
          width: size,
        };
        expandX = 0;
        expandY = 0;
      }
      target.className = `observation-teaching-target ${target.classList.contains("observation-teaching-target--secondary") ? "observation-teaching-target--secondary" : "observation-teaching-target--primary"}`;
      if (extraClass) {
        target.classList.add(extraClass);
      }
      target.dataset.guideCue = cue || "";
      const renderedRect = {
        height: targetRect.height + expandY * 2,
        left: targetRect.left - expandX,
        top: targetRect.top - expandY,
        width: targetRect.width + expandX * 2,
      };
      target.style.left = `${renderedRect.left}px`;
      target.style.top = `${renderedRect.top}px`;
      target.style.width = `${renderedRect.width}px`;
      target.style.height = `${renderedRect.height}px`;
      target.classList.add("is-visible");
      return renderedRect;
    };
    const getInsetRect = (rect, insetRatio) => {
      if (!rect) {
        return null;
      }
      const insetX = rect.width * insetRatio;
      const insetY = rect.height * insetRatio;
      return {
        bottom: rect.bottom - insetY,
        height: Math.max(1, rect.height - insetY * 2),
        left: rect.left + insetX,
        right: rect.right - insetX,
        top: rect.top + insetY,
        width: Math.max(1, rect.width - insetX * 2),
      };
    };
    const getCornealDotRect = (eye) => {
      const eyeRect = getStageRelativeRect(eye);
      if (!eyeRect) {
        return null;
      }
      const size = 16;
      const direction =
        (eye == null ? void 0 : eye.dataset.eye) === "left" ? 1 : -1;
      const centreX = eyeRect.left + eyeRect.width * 0.5 + direction * 8;
      const centreY = eyeRect.top + eyeRect.height * 0.5;
      return {
        bottom: centreY + size * 0.5,
        height: size,
        left: centreX - size * 0.5,
        right: centreX + size * 0.5,
        top: centreY - size * 0.5,
        width: size,
      };
    };
    const getCrescentGuideRect = (pupilRect, isBottomCrescent) => {
      if (!pupilRect) {
        return null;
      }
      const width = pupilRect.width * 0.94;
      const height = pupilRect.height * 0.48;
      return {
        bottom: isBottomCrescent
          ? pupilRect.top + pupilRect.height
          : pupilRect.top + height,
        height,
        left: pupilRect.left + (pupilRect.width - width) * 0.5,
        right: pupilRect.left + (pupilRect.width + width) * 0.5,
        top: isBottomCrescent
          ? pupilRect.top + pupilRect.height - height
          : pupilRect.top,
        width,
      };
    };
    const setTeachingGuideConnector = (key, targetRectOverride = null) => {
      var _a3, _b, _c, _d;
      const connector = dom.observationTeachingConnector;
      const guideItem = getGuideItemByKey(key);
      const wrapperRect =
        (_a3 = dom.eyesWrapper) == null ? void 0 : _a3.getBoundingClientRect();
      const guideRect =
        (_b = guideItem == null ? void 0 : guideItem.getBoundingClientRect) ==
        null
          ? void 0
          : _b.call(guideItem);
      const primaryTarget =
        (_c = dom.observationTeachingTargets) == null ? void 0 : _c[0];
      const targetRect =
        targetRectOverride ||
        ((_d =
          primaryTarget == null
            ? void 0
            : primaryTarget.getBoundingClientRect) == null
          ? void 0
          : _d.call(primaryTarget));
      if (!connector || !wrapperRect || !guideRect || !targetRect) {
        return;
      }
      const start = {
        x: (guideRect.left + guideRect.right) * 0.5 - wrapperRect.left,
        y: guideRect.bottom - wrapperRect.top + 5,
      };
      const targetCentreX = targetRectOverride
        ? targetRect.left + targetRect.width * 0.5
        : (targetRect.left + targetRect.right) * 0.5 - wrapperRect.left;
      const targetTopY = targetRectOverride
        ? targetRect.top - 4
        : targetRect.top - wrapperRect.top - 4;
      const minEndY = start.y + 28;
      const end = {
        x: targetCentreX,
        y: Math.max(targetTopY, minEndY),
      };
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.hypot(dx, dy);
      const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
      connector.style.left = `${start.x}px`;
      connector.style.top = `${start.y}px`;
      connector.style.width = `${length}px`;
      connector.style.transform = `rotate(${angleDeg}deg)`;
      connector.classList.add("is-visible");
    };
    const showTeachingTarget = (key) => {
      var _a3, _b, _c, _d, _e;
      if (
        !dom.observationTeachingOverlay ||
        !((_a3 = dom.observationTeachingTargets) == null
          ? void 0
          : _a3.length) ||
        !dom.eyesWrapper
      ) {
        return;
      }
      hideTeachingOverlay();
      const [primaryTarget, secondaryTarget] = dom.observationTeachingTargets;
      const leftPupil =
        (_b = dom.leftEye) == null ? void 0 : _b.querySelector(".pupil");
      const rightPupil =
        (_c = dom.rightEye) == null ? void 0 : _c.querySelector(".pupil");
      const leftPupilRect = getStageRelativeRect(leftPupil);
      const rightPupilRect = getStageRelativeRect(rightPupil);
      const leftEyeRect = getStageRelativeRect(dom.leftEye);
      const rightEyeRect = getStageRelativeRect(dom.rightEye);
      const leftReflexRect = getStageRelativeRect(
        (_d = dom.leftEye) == null ? void 0 : _d.querySelector(".ret-reflex"),
      );
      const rightReflexRect = getStageRelativeRect(
        (_e = dom.rightEye) == null ? void 0 : _e.querySelector(".ret-reflex"),
      );
      const leftCornealRect = getCornealDotRect(dom.leftEye);
      const rightCornealRect = getCornealDotRect(dom.rightEye);
      const isBottomCrescent =
        state.currentRefraction.includes("myopia") ||
        state.currentRefraction.includes("minus");
      const leftCrescentRect = getCrescentGuideRect(
        leftPupilRect,
        isBottomCrescent,
      );
      const rightCrescentRect = getCrescentGuideRect(
        rightPupilRect,
        isBottomCrescent,
      );
      const crescentClass = isBottomCrescent
        ? "is-crescent-bottom"
        : "is-crescent-top";
      dom.observationTeachingOverlay.classList.add("is-visible");
      if (key === "Match") {
        const connectorRect = setTeachingTargetBox(primaryTarget, leftEyeRect, {
          cue: key,
          expandX: 8,
          expandY: 8,
        });
        setTeachingTargetBox(secondaryTarget, rightEyeRect, {
          cue: key,
          expandX: 8,
          expandY: 8,
        });
        setTeachingGuideConnector(key, connectorRect);
        return;
      }
      if (key === "Bright") {
        const connectorRect = setTeachingTargetBox(
          primaryTarget,
          getInsetRect(leftReflexRect || leftPupilRect, 0.16),
          {
            cue: key,
            expandX: 6,
            expandY: 6,
          },
        );
        setTeachingTargetBox(
          secondaryTarget,
          getInsetRect(rightReflexRect || rightPupilRect, 0.16),
          {
            cue: key,
            expandX: 6,
            expandY: 6,
          },
        );
        setTeachingGuideConnector(key, connectorRect);
        return;
      }
      if (key === "Straight") {
        const connectorRect = setTeachingTargetBox(
          primaryTarget,
          leftCornealRect,
          { cue: key, forceCircle: true, expandX: 2, expandY: 2 },
        );
        setTeachingTargetBox(secondaryTarget, rightCornealRect, {
          cue: key,
          forceCircle: true,
          expandX: 2,
          expandY: 2,
        });
        setTeachingGuideConnector(key, connectorRect);
        return;
      }
      if (key === "Light") {
        const connectorRect = setTeachingTargetBox(
          primaryTarget,
          leftPupilRect,
          {
            cue: key,
            expandX: 11,
            expandY: 9,
          },
        );
        setTeachingTargetBox(secondaryTarget, rightPupilRect, {
          cue: key,
          expandX: 11,
          expandY: 9,
        });
        setTeachingGuideConnector(key, connectorRect);
        return;
      }
      if (key === "Shape") {
        const connectorRect = setTeachingTargetBox(
          primaryTarget,
          leftPupilRect,
          {
            cue: key,
            expandX: 4,
            expandY: 4,
          },
        );
        setTeachingTargetBox(secondaryTarget, rightPupilRect, {
          cue: key,
          expandX: 4,
          expandY: 4,
        });
        setTeachingGuideConnector(key, connectorRect);
        return;
      }
      if (key === "Crescent") {
        const connectorRect = setTeachingTargetBox(
          primaryTarget,
          leftCrescentRect,
          {
            cue: key,
            extraClass: crescentClass,
          },
        );
        setTeachingTargetBox(secondaryTarget, rightCrescentRect, {
          cue: key,
          extraClass: crescentClass,
        });
        setTeachingGuideConnector(key, connectorRect);
        return;
      }
      if (key === "Colour") {
        const connectorRect = setTeachingTargetBox(
          primaryTarget,
          getInsetRect(leftReflexRect || leftPupilRect, 0.2),
          {
            cue: key,
            expandX: 3,
            expandY: 3,
          },
        );
        setTeachingTargetBox(
          secondaryTarget,
          getInsetRect(rightReflexRect || rightPupilRect, 0.2),
          {
            cue: key,
            expandX: 3,
            expandY: 3,
          },
        );
        setTeachingGuideConnector(key, connectorRect);
        return;
      }
      if (key === "Cornea") {
        const connectorRect = setTeachingTargetBox(
          primaryTarget,
          leftCornealRect,
          { cue: key, forceCircle: true },
        );
        setTeachingTargetBox(secondaryTarget, rightCornealRect, {
          cue: key,
          forceCircle: true,
        });
        setTeachingGuideConnector(key, connectorRect);
        return;
      }
      if (key === "Compare") {
        const connectorRect = setTeachingTargetBox(primaryTarget, leftEyeRect, {
          cue: key,
          expandX: 8,
          expandY: 8,
        });
        setTeachingTargetBox(secondaryTarget, rightEyeRect, {
          cue: key,
          expandX: 8,
          expandY: 8,
        });
        setTeachingGuideConnector(key, connectorRect);
      }
    };
    const setObservationGuideCollapsed = (isCollapsed) => {
      dom.observationGuide.classList.toggle("is-collapsed", isCollapsed);
      dom.observationGuideToggle.setAttribute(
        "aria-expanded",
        isCollapsed ? "false" : "true",
      );
      dom.observationGuideToggle.setAttribute(
        "aria-label",
        isCollapsed ? "Open observation guide" : "Close observation guide",
      );
      dom.observationGuideToggle.title = isCollapsed
        ? "Open observation guide"
        : "Close observation guide";
    };
    const scheduleObservationGuideCollapse = ({
      delay = OBSERVATION_GUIDE_COLLAPSE_DELAY_MS,
    } = {}) => {
      if (
        isObservationGuideUserControlled ||
        teachingKey ||
        teachingReplayTimerIds.length
      ) {
        return;
      }
      clearObservationGuideCollapseTimer();
      collapseTimerId = window.setTimeout(() => {
        const activeElement = document.activeElement;
        const isGuideFocused =
          activeElement instanceof Element &&
          dom.observationGuide.contains(activeElement) &&
          activeElement !== dom.observationGuideToggle;
        const isGuideHovered = dom.observationGuide.matches(":hover");
        if (isGuideFocused || isGuideHovered) {
          scheduleObservationGuideCollapse({ delay });
          return;
        }
        hoveredKey = "";
        hideObservationGuideHint();
        setObservationGuideCollapsed(true);
        renderObservationGuide();
      }, delay);
    };
    const expandObservationGuide = ({ replayHint = false } = {}) => {
      clearObservationGuideCollapseTimer();
      setObservationGuideCollapsed(false);
      if (replayHint) {
        showObservationGuideHint();
      }
      if (!isObservationGuideUserControlled) {
        scheduleObservationGuideCollapse();
      }
    };
    const renderObservationGuide = () => {
      syncObservationGuideMode();
      const activeKey = teachingKey || hoveredKey || selectedKey;
      const activeItem = getGuideItemByKey(activeKey);
      dom.observationGuideItems.forEach((item) => {
        const isSelected = item.dataset.guideLabel === selectedKey;
        const isActive = item.dataset.guideLabel === activeKey;
        item.classList.toggle("is-selected", isSelected);
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", isSelected ? "true" : "false");
      });
      if (!activeItem) {
        dom.observationGuideDetail.replaceChildren();
        dom.observationGuideDetail.classList.remove("is-visible");
        return;
      }
      const detail = activeItem.dataset.guideDetail || "";
      const detailText = document.createElement("em");
      detailText.textContent = detail;
      dom.observationGuideDetail.replaceChildren(detailText);
      dom.observationGuideDetail.classList.add("is-visible");
    };
    const startTeachingReplay = () => {
      clearTeachingReplay();
      clearObservationGuideCollapseTimer();
      hideObservationGuideHint();
      if (prefersReducedMotion()) {
        teachingKey = getActiveGuideKeys()[0] || "";
        renderObservationGuide();
        showTeachingTarget(teachingKey);
        queueTeachingReplayTimer(() => {
          teachingKey = "";
          hideTeachingOverlay();
          renderObservationGuide();
          setObservationGuideCollapsed(true);
        }, OBSERVATION_GUIDE_COLLAPSE_DELAY_MS);
        return;
      }
      let elapsedMs = TEACHING_REPLAY_OPEN_DELAY_MS;
      getActiveGuideKeys().forEach((key) => {
        queueTeachingReplayTimer(() => {
          teachingKey = key;
          renderObservationGuide();
          showTeachingTarget(key);
        }, elapsedMs);
        elapsedMs += TEACHING_REPLAY_CUE_DURATIONS[key] || 2400;
      });
      queueTeachingReplayTimer(() => {
        teachingKey = "";
        hideTeachingOverlay();
        renderObservationGuide();
      }, elapsedMs);
      queueTeachingReplayTimer(() => {
        hoveredKey = "";
        selectedKey = "";
        hideObservationGuideHint();
        setObservationGuideCollapsed(true);
        renderObservationGuide();
      }, elapsedMs + TEACHING_REPLAY_FINAL_HOLD_MS);
    };
    function init() {
      dom.observationGuide.addEventListener("mouseenter", () => {
        if (!dom.observationGuide.classList.contains("is-collapsed")) {
          clearObservationGuideCollapseTimer();
        }
      });
      dom.observationGuide.addEventListener("mouseleave", () => {
        hoveredKey = "";
        renderObservationGuide();
        if (!dom.observationGuide.classList.contains("is-collapsed")) {
          scheduleObservationGuideCollapse();
        }
      });
      dom.observationGuideToggle.addEventListener("click", () => {
        isObservationGuideUserControlled = true;
        const isCollapsed =
          dom.observationGuide.classList.contains("is-collapsed");
        if (isCollapsed) {
          isObservationGuideUserControlled = false;
          expandObservationGuide({ replayHint: true });
          startTeachingReplay();
          return;
        }
        clearObservationGuideCollapseTimer();
        hoveredKey = "";
        clearTeachingReplay();
        hideObservationGuideHint();
        setObservationGuideCollapsed(true);
        renderObservationGuide();
      });
      dom.observationGuideItems.forEach((item) => {
        item.addEventListener("mouseenter", () => {
          clearObservationGuideCollapseTimer();
          hoveredKey = item.dataset.guideLabel || "";
          renderObservationGuide();
        });
        item.addEventListener("mouseleave", () => {
          hoveredKey = "";
          renderObservationGuide();
          scheduleObservationGuideCollapse();
        });
        item.addEventListener("focus", () => {
          clearTeachingReplay();
          hideObservationGuideHint();
          expandObservationGuide();
          hoveredKey = item.dataset.guideLabel || "";
          renderObservationGuide();
        });
        item.addEventListener("blur", () => {
          hoveredKey = "";
          renderObservationGuide();
          scheduleObservationGuideCollapse();
        });
        item.addEventListener("click", () => {
          clearTeachingReplay();
          hideObservationGuideHint();
          clearObservationGuideCollapseTimer();
          const clickedKey = item.dataset.guideLabel || "";
          selectedKey = selectedKey === clickedKey ? "" : clickedKey;
          hoveredKey = clickedKey;
          renderObservationGuide();
          scheduleObservationGuideCollapse();
        });
      });
      setObservationGuideCollapsed(false);
      renderObservationGuide();
      showObservationGuideHint();
      scheduleObservationGuideCollapse();
    }
    return {
      init,
      syncForCurrentCase: () => {
        clearTeachingReplay();
        renderObservationGuide();
        scheduleObservationGuideCollapse();
      },
    };
  }

  // src/central-media-masks.js?v=20260427-19
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

  // src/retinoscopy-active-reflex-common.js?v=20260308-135
  function getBeamLightState({
    centredBase,
    centredPower,
    centredRange = 210,
    centredScale,
    focusedRange,
    retStreakOffset,
  }) {
    const localBeamDistance = Math.abs(retStreakOffset);
    const centredBeamFactor = Math.max(
      0,
      1 - Math.min(1, localBeamDistance / centredRange),
    );
    const localIlluminationFactor =
      centredBase + Math.pow(centredBeamFactor, centredPower) * centredScale;
    const focusedBeamBoost = Math.max(
      0,
      1 - Math.min(1, localBeamDistance / focusedRange),
    );
    return {
      focusedBeamBoost,
      localBeamDistance,
      localIlluminationFactor,
    };
  }

  // src/retinoscopy-active-reflex-refractive.js?v=20260308-135
  function resolveRefractiveCustomActiveReflexVisual({
    activeRefraction,
    currentRefraction,
    flags,
    retStreakOffset,
    sceneRefraction,
  }) {
    if (
      flags.normalDarkCase &&
      activeRefraction === REFRACTION_VALUES.NORMAL_DARK
    ) {
      const { focusedBeamBoost, localIlluminationFactor } = getBeamLightState({
        centredBase: 0.26,
        centredPower: 0.78,
        centredScale: 0.74,
        focusedRange: 52,
        retStreakOffset,
      });
      const warmCapAlpha = (2e-3 + localIlluminationFactor * 0.028).toFixed(2);
      const warmCapMidAlpha = (1e-3 + localIlluminationFactor * 0.015).toFixed(
        2,
      );
      const crescentAlpha = (3e-3 + localIlluminationFactor * 0.022).toFixed(2);
      const crescentMidAlpha = (1e-3 + localIlluminationFactor * 0.011).toFixed(
        2,
      );
      const baseGlowPeakAlpha = (
        6e-3 +
        localIlluminationFactor * 0.032 +
        focusedBeamBoost * 0.011
      ).toFixed(2);
      const baseGlowMidAlpha = (
        2e-3 +
        localIlluminationFactor * 0.014 +
        focusedBeamBoost * 6e-3
      ).toFixed(2);
      return {
        background: `
      radial-gradient(
        ellipse 42% 22% at 50% 22%,
        rgba(255, 214, 92, ${warmCapAlpha}) 0%,
        rgba(255, 198, 60, ${warmCapMidAlpha}) 34%,
        rgba(255, 188, 42, 0) 64%
      ),
      radial-gradient(
        ellipse 54% 24% at 50% 28%,
        rgba(234, 236, 242, ${crescentAlpha}) 0%,
        rgba(234, 236, 242, ${crescentMidAlpha}) 44%,
        rgba(234, 236, 242, 0) 74%
      ),
      radial-gradient(
        ellipse 70% 62% at 50% 50%,
        rgba(255, 255, 255, ${baseGlowPeakAlpha}) 0%,
        rgba(255, 255, 255, ${baseGlowMidAlpha}) 46%,
        rgba(255, 255, 255, 0) 78%
      )
    `,
        blurPx: 0.1,
        extraTransform: "",
        opacity: Math.min(
          1,
          0.04 + localIlluminationFactor * 0.038 + focusedBeamBoost * 0.016,
        ),
        shift: 0,
      };
    }
    if (sceneRefraction === REFRACTION_VALUES.BILATERAL_HIGH_HYPERMETROPIA) {
      const hyperLayerBrightnessBoost = 1.34;
      const { focusedBeamBoost, localIlluminationFactor } = getBeamLightState({
        centredBase: 0.42,
        centredPower: 0.74,
        centredScale: 0.58,
        focusedRange: 52,
        retStreakOffset,
      });
      const warmCapAlpha = (
        (0.09 + localIlluminationFactor * 0.36) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const warmCapMidAlpha = (
        (0.07 + localIlluminationFactor * 0.28) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const warmCapTailAlpha = (
        (0.04 + localIlluminationFactor * 0.16) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const bridgeGlowPeakAlpha = (
        (0.07 + localIlluminationFactor * 0.19 + focusedBeamBoost * 0.03) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const bridgeGlowMidAlpha = (
        (0.04 + localIlluminationFactor * 0.1 + focusedBeamBoost * 0.02) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const crescentCutoutPeakAlpha = (
        (0.08 + localIlluminationFactor * 0.1 + focusedBeamBoost * 0.02) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const crescentCutoutMidAlpha = (
        (0.03 + localIlluminationFactor * 0.05 + focusedBeamBoost * 0.02) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const crescentAlpha = (
        (0.18 + localIlluminationFactor * 0.44) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const crescentMidAlpha = (
        (0.09 + localIlluminationFactor * 0.28) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const baseGlowPeakAlpha = (
        (0.06 + localIlluminationFactor * 0.15 + focusedBeamBoost * 0.06) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const baseGlowMidAlpha = (
        (0.03 + localIlluminationFactor * 0.08 + focusedBeamBoost * 0.03) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      return {
        background: `
      radial-gradient(
        ellipse 50% 24% at 50% 20%,
        rgba(255, 226, 98, ${warmCapAlpha}) 0%,
        rgba(255, 218, 76, ${warmCapMidAlpha}) 30%,
        rgba(255, 208, 56, ${warmCapTailAlpha}) 56%,
        rgba(255, 198, 42, 0) 70%
      ),
      radial-gradient(
        ellipse 60% 20% at 50% 34%,
        rgba(255, 236, 168, ${bridgeGlowPeakAlpha}) 0%,
        rgba(255, 246, 224, ${bridgeGlowMidAlpha}) 42%,
        rgba(255, 252, 242, 0) 72%
      ),
      radial-gradient(
        ellipse 46% 14% at 50% 39%,
        rgba(255, 240, 210, ${crescentCutoutPeakAlpha}) 0%,
        rgba(255, 246, 228, ${crescentCutoutMidAlpha}) 52%,
        rgba(255, 252, 242, 0) 84%
      ),
      radial-gradient(
        ellipse 124% 60% at 50% 23%,
        rgba(247, 248, 252, ${crescentAlpha}) 0%,
        rgba(247, 248, 252, ${crescentMidAlpha}) 44%,
        rgba(247, 248, 252, 0) 82%
      ),
      radial-gradient(
        ellipse 68% 60% at 50% 54%,
        rgba(255, 255, 255, ${baseGlowPeakAlpha}) 0%,
        rgba(255, 255, 255, ${baseGlowMidAlpha}) 46%,
        rgba(255, 255, 255, 0) 80%
      )
    `,
        blurPx: 0.08,
        extraTransform: "",
        opacity: Math.min(
          1,
          0.7 + localIlluminationFactor * 0.28 + focusedBeamBoost * 0.08,
        ),
        shift: 0,
      };
    }
    if (currentRefraction === REFRACTION_VALUES.NORMAL_HYPER) {
      const hyperLayerBrightnessBoost = 1.32;
      const { focusedBeamBoost, localIlluminationFactor } = getBeamLightState({
        centredBase: 0.42,
        centredPower: 0.74,
        centredScale: 0.58,
        focusedRange: 52,
        retStreakOffset,
      });
      const warmCapAlpha = (
        (0.1 + localIlluminationFactor * 0.4) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const warmCapMidAlpha = (
        (0.08 + localIlluminationFactor * 0.32) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const warmCapTailAlpha = (
        (0.05 + localIlluminationFactor * 0.18) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const bridgeGlowPeakAlpha = (
        (0.06 + localIlluminationFactor * 0.17 + focusedBeamBoost * 0.03) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const bridgeGlowMidAlpha = (
        (0.03 + localIlluminationFactor * 0.09 + focusedBeamBoost * 0.02) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const crescentCutoutPeakAlpha = (
        (0.1 + localIlluminationFactor * 0.14 + focusedBeamBoost * 0.03) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const crescentCutoutMidAlpha = (
        (0.04 + localIlluminationFactor * 0.07 + focusedBeamBoost * 0.03) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const crescentAlpha = (
        (0.14 + localIlluminationFactor * 0.38) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const crescentMidAlpha = (
        (0.07 + localIlluminationFactor * 0.24) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const baseGlowPeakAlpha = (
        (0.08 + localIlluminationFactor * 0.2 + focusedBeamBoost * 0.08) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const baseGlowMidAlpha = (
        (0.04 + localIlluminationFactor * 0.1 + focusedBeamBoost * 0.04) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      return {
        background: `
      radial-gradient(
        ellipse 52% 28% at 50% 20%,
        rgba(255, 226, 98, ${warmCapAlpha}) 0%,
        rgba(255, 218, 76, ${warmCapMidAlpha}) 30%,
        rgba(255, 208, 56, ${warmCapTailAlpha}) 56%,
        rgba(255, 198, 42, 0) 70%
      ),
      radial-gradient(
        ellipse 56% 18% at 50% 34%,
        rgba(255, 236, 168, ${bridgeGlowPeakAlpha}) 0%,
        rgba(255, 246, 224, ${bridgeGlowMidAlpha}) 42%,
        rgba(255, 252, 242, 0) 72%
      ),
      radial-gradient(
        ellipse 50% 17% at 50% 37%,
        rgba(255, 240, 210, ${crescentCutoutPeakAlpha}) 0%,
        rgba(255, 246, 228, ${crescentCutoutMidAlpha}) 52%,
        rgba(255, 252, 242, 0) 84%
      ),
      radial-gradient(
        ellipse 98% 48% at 50% 24%,
        rgba(247, 248, 252, ${crescentAlpha}) 0%,
        rgba(247, 248, 252, ${crescentMidAlpha}) 44%,
        rgba(247, 248, 252, 0) 82%
      ),
      radial-gradient(
        ellipse 76% 70% at 50% 50%,
        rgba(255, 255, 255, ${baseGlowPeakAlpha}) 0%,
        rgba(255, 255, 255, ${baseGlowMidAlpha}) 46%,
        rgba(255, 255, 255, 0) 80%
      )
    `,
        blurPx: 0.08,
        extraTransform: "",
        opacity: Math.min(
          1,
          0.68 + localIlluminationFactor * 0.3 + focusedBeamBoost * 0.08,
        ),
        shift: 0,
      };
    }
    if (
      currentRefraction === REFRACTION_VALUES.ZERO ||
      (flags.normalDarkCase &&
        activeRefraction !== REFRACTION_VALUES.NORMAL_DARK)
    ) {
      const neutralLayerBrightnessBoost = 1.3;
      const { focusedBeamBoost, localIlluminationFactor } = getBeamLightState({
        centredBase: 0.4,
        centredPower: 0.75,
        centredScale: 0.6,
        focusedRange: 48,
        retStreakOffset,
      });
      const warmCapAlpha = (
        (0.08 + localIlluminationFactor * 0.42) *
        neutralLayerBrightnessBoost
      ).toFixed(2);
      const warmCapMidAlpha = (
        (0.06 + localIlluminationFactor * 0.34) *
        neutralLayerBrightnessBoost
      ).toFixed(2);
      const crescentAlpha = (
        (0.08 + localIlluminationFactor * 0.24) *
        neutralLayerBrightnessBoost
      ).toFixed(2);
      const crescentMidAlpha = (
        (0.03 + localIlluminationFactor * 0.14) *
        neutralLayerBrightnessBoost
      ).toFixed(2);
      const warmCapTailAlpha = (
        (0.04 + localIlluminationFactor * 0.18) *
        neutralLayerBrightnessBoost
      ).toFixed(2);
      const bridgeGlowPeakAlpha = (
        (0.05 + localIlluminationFactor * 0.14 + focusedBeamBoost * 0.03) *
        neutralLayerBrightnessBoost
      ).toFixed(2);
      const bridgeGlowMidAlpha = (
        (0.02 + localIlluminationFactor * 0.07 + focusedBeamBoost * 0.02) *
        neutralLayerBrightnessBoost
      ).toFixed(2);
      const crescentCutoutPeakAlpha = (
        (0.14 + localIlluminationFactor * 0.18 + focusedBeamBoost * 0.03) *
        neutralLayerBrightnessBoost
      ).toFixed(2);
      const crescentCutoutMidAlpha = (
        (0.06 + localIlluminationFactor * 0.09 + focusedBeamBoost * 0.03) *
        neutralLayerBrightnessBoost
      ).toFixed(2);
      const baseGlowPeakAlpha = (
        (0.08 + localIlluminationFactor * 0.18 + focusedBeamBoost * 0.08) *
        neutralLayerBrightnessBoost
      ).toFixed(2);
      const baseGlowMidAlpha = (
        (0.04 + localIlluminationFactor * 0.08 + focusedBeamBoost * 0.04) *
        neutralLayerBrightnessBoost
      ).toFixed(2);
      return {
        background: `
      radial-gradient(
        ellipse 46% 26% at 50% 22%,
        rgba(255, 226, 98, ${warmCapAlpha}) 0%,
        rgba(255, 218, 76, ${warmCapMidAlpha}) 28%,
        rgba(255, 208, 56, ${warmCapTailAlpha}) 52%,
        rgba(255, 198, 42, 0) 68%
      ),
      radial-gradient(
        ellipse 48% 16% at 50% 34%,
        rgba(255, 236, 168, ${bridgeGlowPeakAlpha}) 0%,
        rgba(255, 246, 224, ${bridgeGlowMidAlpha}) 42%,
        rgba(255, 252, 242, 0) 70%
      ),
      radial-gradient(
        ellipse 44% 18% at 50% 36%,
        rgba(255, 240, 210, ${crescentCutoutPeakAlpha}) 0%,
        rgba(255, 246, 228, ${crescentCutoutMidAlpha}) 52%,
        rgba(255, 252, 242, 0) 82%
      ),
      radial-gradient(
        ellipse 62% 28% at 50% 27%,
        rgba(247, 248, 252, ${crescentAlpha}) 0%,
        rgba(247, 248, 252, ${crescentMidAlpha}) 40%,
        rgba(247, 248, 252, 0) 74%
      ),
      radial-gradient(
        ellipse 74% 68% at 50% 51%,
        rgba(255, 255, 255, ${baseGlowPeakAlpha}) 0%,
        rgba(255, 255, 255, ${baseGlowMidAlpha}) 46%,
        rgba(255, 255, 255, 0) 80%
      )
    `,
        blurPx: 0.08,
        extraTransform: "",
        opacity: Math.min(
          1,
          0.62 + localIlluminationFactor * 0.34 + focusedBeamBoost * 0.08,
        ),
        shift: 0,
      };
    }
    return null;
  }

  // src/retinoscopy-active-reflex-special.js?v=20260426-3
  function resolveSpecialCustomActiveReflexVisual({
    currentRefraction,
    eyeType,
    retStreakOffset,
    sceneRefraction,
  }) {
    if (
      sceneRefraction === REFRACTION_VALUES.BILATERAL_MYOPIA ||
      (sceneRefraction === REFRACTION_VALUES.RIGHT_HYPER_LEFT_MYOPIA &&
        eyeType === "right")
    ) {
      const hyperLayerBrightnessBoost = 1.32;
      const { focusedBeamBoost, localIlluminationFactor } = getBeamLightState({
        centredBase: 0.42,
        centredPower: 0.74,
        centredScale: 0.58,
        focusedRange: 52,
        retStreakOffset,
      });
      const warmCapAlpha = (
        (0.1 + localIlluminationFactor * 0.4) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const warmCapMidAlpha = (
        (0.08 + localIlluminationFactor * 0.32) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const warmCapTailAlpha = (
        (0.05 + localIlluminationFactor * 0.18) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const bridgeGlowPeakAlpha = (
        (0.06 + localIlluminationFactor * 0.17 + focusedBeamBoost * 0.03) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const bridgeGlowMidAlpha = (
        (0.03 + localIlluminationFactor * 0.09 + focusedBeamBoost * 0.02) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const crescentCutoutPeakAlpha = (
        (0.1 + localIlluminationFactor * 0.14 + focusedBeamBoost * 0.03) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const crescentCutoutMidAlpha = (
        (0.04 + localIlluminationFactor * 0.07 + focusedBeamBoost * 0.03) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const crescentAlpha = (
        (0.14 + localIlluminationFactor * 0.38) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const crescentMidAlpha = (
        (0.07 + localIlluminationFactor * 0.24) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const baseGlowPeakAlpha = (
        (0.08 + localIlluminationFactor * 0.2 + focusedBeamBoost * 0.06) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      const baseGlowMidAlpha = (
        (0.04 + localIlluminationFactor * 0.1 + focusedBeamBoost * 0.04) *
        hyperLayerBrightnessBoost
      ).toFixed(2);
      return {
        background: `
      radial-gradient(
        ellipse 52% 28% at 50% 80%,
        rgba(255, 226, 98, ${warmCapAlpha}) 0%,
        rgba(255, 218, 76, ${warmCapMidAlpha}) 30%,
        rgba(255, 208, 56, ${warmCapTailAlpha}) 56%,
        rgba(255, 198, 42, 0) 70%
      ),
      radial-gradient(
        ellipse 56% 18% at 50% 66%,
        rgba(255, 236, 168, ${bridgeGlowPeakAlpha}) 0%,
        rgba(255, 246, 224, ${bridgeGlowMidAlpha}) 42%,
        rgba(255, 252, 242, 0) 72%
      ),
      radial-gradient(
        ellipse 50% 17% at 50% 63%,
        rgba(255, 240, 210, ${crescentCutoutPeakAlpha}) 0%,
        rgba(255, 246, 228, ${crescentCutoutMidAlpha}) 52%,
        rgba(255, 252, 242, 0) 84%
      ),
      radial-gradient(
        ellipse 98% 48% at 50% 76%,
        rgba(247, 248, 252, ${crescentAlpha}) 0%,
        rgba(247, 248, 252, ${crescentMidAlpha}) 44%,
        rgba(247, 248, 252, 0) 82%
      ),
      radial-gradient(
        ellipse 76% 70% at 50% 50%,
        rgba(255, 255, 255, ${baseGlowPeakAlpha}) 0%,
        rgba(255, 255, 255, ${baseGlowMidAlpha}) 46%,
        rgba(255, 255, 255, 0) 80%
      )
    `,
        blurPx: 0.08,
        extraTransform: "",
        opacity: Math.min(
          1,
          0.68 + localIlluminationFactor * 0.26 + focusedBeamBoost * 0.08,
        ),
        shift: 0,
      };
    }
    if (
      sceneRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS &&
      eyeType === "right" &&
      currentRefraction === REFRACTION_VALUES.ZERO
    ) {
      const subluxatedLayerBrightnessBoost = 1.72;
      const { focusedBeamBoost, localIlluminationFactor } = getBeamLightState({
        centredBase: 0.4,
        centredPower: 0.75,
        centredScale: 0.6,
        focusedRange: 48,
        retStreakOffset,
      });
      const warmCapAlpha = (
        (0.06 + localIlluminationFactor * 0.28) *
        subluxatedLayerBrightnessBoost
      ).toFixed(2);
      const warmCapMidAlpha = (
        (0.04 + localIlluminationFactor * 0.18) *
        subluxatedLayerBrightnessBoost
      ).toFixed(2);
      const warmCapTailAlpha = (
        (0.02 + localIlluminationFactor * 0.1) *
        subluxatedLayerBrightnessBoost
      ).toFixed(2);
      const borderPeakAlpha = (
        (0.28 + localIlluminationFactor * 0.4 + focusedBeamBoost * 0.1) *
        subluxatedLayerBrightnessBoost
      ).toFixed(2);
      const borderMidAlpha = (
        (0.14 + localIlluminationFactor * 0.24 + focusedBeamBoost * 0.06) *
        subluxatedLayerBrightnessBoost
      ).toFixed(2);
      const upperBorderPeakAlpha = (
        (0.24 + localIlluminationFactor * 0.34 + focusedBeamBoost * 0.08) *
        subluxatedLayerBrightnessBoost
      ).toFixed(2);
      const upperBorderMidAlpha = (
        (0.12 + localIlluminationFactor * 0.18 + focusedBeamBoost * 0.05) *
        subluxatedLayerBrightnessBoost
      ).toFixed(2);
      const bridgeGlowPeakAlpha = (
        (0.03 + localIlluminationFactor * 0.08 + focusedBeamBoost * 0.03) *
        subluxatedLayerBrightnessBoost
      ).toFixed(2);
      const bridgeGlowMidAlpha = (
        (0.01 + localIlluminationFactor * 0.04 + focusedBeamBoost * 0.02) *
        subluxatedLayerBrightnessBoost
      ).toFixed(2);
      const crescentAlpha = (
        (0.18 + localIlluminationFactor * 0.44) *
        subluxatedLayerBrightnessBoost
      ).toFixed(2);
      const crescentMidAlpha = (
        (0.08 + localIlluminationFactor * 0.22) *
        subluxatedLayerBrightnessBoost
      ).toFixed(2);
      const crescentCutoutPeakAlpha = (
        (0.18 + localIlluminationFactor * 0.18 + focusedBeamBoost * 0.04) *
        subluxatedLayerBrightnessBoost
      ).toFixed(2);
      const crescentCutoutMidAlpha = (
        (0.08 + localIlluminationFactor * 0.1 + focusedBeamBoost * 0.03) *
        subluxatedLayerBrightnessBoost
      ).toFixed(2);
      const baseGlowPeakAlpha = (
        (0.06 + localIlluminationFactor * 0.14 + focusedBeamBoost * 0.06) *
        subluxatedLayerBrightnessBoost
      ).toFixed(2);
      const baseGlowMidAlpha = (
        (0.02 + localIlluminationFactor * 0.06 + focusedBeamBoost * 0.03) *
        subluxatedLayerBrightnessBoost
      ).toFixed(2);
      return {
        background: `
      radial-gradient(
        ellipse 94% 88% at 50% 50%,
        rgba(255, 255, 255, 0) 50%,
        rgba(255, 255, 255, ${borderPeakAlpha}) 58%,
        rgba(255, 255, 255, ${borderPeakAlpha}) 61%,
        rgba(255, 255, 255, ${borderMidAlpha}) 70%,
        rgba(255, 255, 255, 0) 82%
      ),
      radial-gradient(
        ellipse 86% 52% at 50% 85%,
        rgba(255, 255, 255, 0) 38%,
        rgba(255, 255, 255, ${upperBorderPeakAlpha}) 49%,
        rgba(255, 255, 255, ${upperBorderPeakAlpha}) 53%,
        rgba(255, 255, 255, ${upperBorderMidAlpha}) 63%,
        rgba(255, 255, 255, 0) 76%
      ),
      linear-gradient(
        84deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 45%,
        rgba(255, 248, 220, ${borderPeakAlpha}) 48%,
        rgba(255, 255, 255, ${borderPeakAlpha}) 49.5%,
        rgba(255, 255, 255, ${borderMidAlpha}) 51.5%,
        rgba(255, 255, 255, 0) 55%,
        rgba(255, 255, 255, 0) 100%
      ),
      radial-gradient(
        ellipse 46% 24% at 50% 80%,
        rgba(255, 226, 98, ${warmCapAlpha}) 0%,
        rgba(255, 218, 76, ${warmCapMidAlpha}) 30%,
        rgba(255, 208, 56, ${warmCapTailAlpha}) 54%,
        rgba(255, 198, 42, 0) 70%
      ),
      radial-gradient(
        ellipse 52% 16% at 50% 56%,
        rgba(255, 236, 168, ${bridgeGlowPeakAlpha}) 0%,
        rgba(255, 246, 224, ${bridgeGlowMidAlpha}) 42%,
        rgba(255, 252, 242, 0) 72%
      ),
      radial-gradient(
        ellipse 72% 32% at 50% 70%,
        rgba(247, 248, 252, ${crescentAlpha}) 0%,
        rgba(247, 248, 252, ${crescentMidAlpha}) 40%,
        rgba(247, 248, 252, 0) 74%
      ),
      radial-gradient(
        ellipse 54% 20% at 50% 86%,
        rgba(255, 240, 210, ${crescentCutoutPeakAlpha}) 0%,
        rgba(255, 246, 228, ${crescentCutoutMidAlpha}) 52%,
        rgba(255, 252, 242, 0) 82%
      ),
      radial-gradient(
        ellipse 74% 68% at 50% 49%,
        rgba(255, 255, 255, ${baseGlowPeakAlpha}) 0%,
        rgba(255, 255, 255, ${baseGlowMidAlpha}) 46%,
        rgba(255, 255, 255, 0) 80%
      )
    `,
        blurPx: 0,
        extraTransform: "",
        opacity: Math.min(
          1,
          0.74 + localIlluminationFactor * 0.26 + focusedBeamBoost * 0.08,
        ),
        shift: 0,
      };
    }
    if (
      sceneRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY &&
      eyeType === "right" &&
      currentRefraction === REFRACTION_VALUES.ZERO
    ) {
      const { focusedBeamBoost, localIlluminationFactor } = getBeamLightState({
        centredBase: 0.46,
        centredPower: 0.72,
        centredScale: 0.54,
        focusedRange: 58,
        retStreakOffset,
      });
      const outerGreyAlpha = (0.18 + localIlluminationFactor * 0.34).toFixed(2);
      const midGreyAlpha = (
        0.12 +
        localIlluminationFactor * 0.24 +
        focusedBeamBoost * 0.04
      ).toFixed(2);
      const innerGreyAlpha = (
        0.18 +
        localIlluminationFactor * 0.28 +
        focusedBeamBoost * 0.05
      ).toFixed(2);
      const softWhiteAlpha = (
        0.06 +
        localIlluminationFactor * 0.16 +
        focusedBeamBoost * 0.04
      ).toFixed(2);
      const shadowPeakAlpha = (
        0.14 +
        localIlluminationFactor * 0.08 -
        focusedBeamBoost * 0.03
      ).toFixed(2);
      const shadowMidAlpha = (
        0.08 +
        localIlluminationFactor * 0.04 -
        focusedBeamBoost * 0.02
      ).toFixed(2);
      return {
        background: `
      radial-gradient(
        ellipse 100% 94% at 50% 50%,
        rgba(232, 236, 242, ${innerGreyAlpha}) 0%,
        rgba(220, 224, 230, ${midGreyAlpha}) 34%,
        rgba(188, 194, 202, ${outerGreyAlpha}) 66%,
        rgba(160, 166, 176, 0.08) 88%,
        rgba(160, 166, 176, 0) 98%
      ),
      radial-gradient(
        ellipse 38% 28% at 61% 43%,
        rgba(58, 62, 70, ${shadowPeakAlpha}) 0%,
        rgba(74, 79, 88, ${shadowMidAlpha}) 38%,
        rgba(92, 98, 108, 0) 72%
      ),
      radial-gradient(
        ellipse 74% 68% at 50% 50%,
        rgba(248, 250, 252, ${softWhiteAlpha}) 0%,
        rgba(240, 244, 248, ${midGreyAlpha}) 42%,
        rgba(224, 228, 234, 0) 78%
      )
    `,
        blurPx: 0.52,
        extraTransform: " scale(1.08, 1.05)",
        opacity: Math.min(
          1,
          0.74 + localIlluminationFactor * 0.14 + focusedBeamBoost * 0.02,
        ),
        shift: retStreakOffset * 0.04,
      };
    }
    return null;
  }

  // src/retinoscopy-active-reflex-custom.js?v=20260426-3
  function resolveCustomActiveReflexVisual({
    activeRefraction,
    currentRefraction,
    eyeType,
    flags,
    retStreakOffset,
    sceneRefraction,
  }) {
    return (
      resolveRefractiveCustomActiveReflexVisual({
        activeRefraction,
        currentRefraction,
        flags,
        retStreakOffset,
        sceneRefraction,
      }) ||
      resolveSpecialCustomActiveReflexVisual({
        currentRefraction,
        eyeType,
        retStreakOffset,
        sceneRefraction,
      })
    );
  }

  // src/retinoscopy-active-reflex-media.js?v=20260430-1
  function resolveMediaActiveReflexVisual({
    axisDeltaRad,
    cataractLevel,
    cylinderAxisDeg,
    flags,
    lastBlinkAgeSec = Infinity,
    movementSign = 0,
    retStreakOffset,
    timeSec,
  }) {
    if (flags.scissorsCase) {
      const lobeSpread = Math.min(25, 10 + Math.abs(retStreakOffset) * 0.4);
      const skew = Math.max(-16, Math.min(16, retStreakOffset * 0.22));
      const leftX = (50 - lobeSpread + skew).toFixed(1);
      const rightX = (50 + lobeSpread + skew).toFixed(1);
      const upperY = (37 - skew * 0.35).toFixed(1);
      const lowerY = (63 + skew * 0.35).toFixed(1);
      return {
        background: `
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
    `,
        shift: retStreakOffset * 0.05,
        extraTransform: " scale(1.06, 1.02)",
        blurPx: 0.62,
        opacity: Math.abs(retStreakOffset) < 1 ? 0.8 : 0.74,
      };
    }
    if (flags.keratoconusCase) {
      const coneOscillation = Math.sin(timeSec * 3.2 + axisDeltaRad * 1.35);
      const coneBias = 12 + 3.4 * Math.sin(timeSec * 0.65);
      const apexX = (50 - coneBias).toFixed(1);
      const apexY = (63 + coneOscillation * 4).toFixed(1);
      const tailX = (52 + coneBias * 0.35).toFixed(1);
      const tailY = (39 - coneOscillation * 2.6).toFixed(1);
      return {
        background: `
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
    `,
        shift:
          retStreakOffset * movementSign * 0.18 +
          Math.sin(timeSec * 5.9 + axisDeltaRad) * 1.3,
        extraTransform: " scale(1.26, 1.14)",
        blurPx: 1.12 + (1 - Math.abs(movementSign)) * 1.22,
        opacity: Math.abs(retStreakOffset) < 1 ? 0.84 : 0.7,
      };
    }
    if (flags.aphakiaCase) {
      return {
        background: `
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
    `,
        shift: retStreakOffset * 0.06,
        extraTransform: " scale(1.02, 1.06)",
        blurPx: 0.08,
        opacity: Math.abs(retStreakOffset) < 1 ? 1 : 0.96,
      };
    }
    if (flags.cornealScarCase) {
      const scarAngle = ((cylinderAxisDeg + 22) % 180) * 2;
      return {
        background: `
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
    `,
        shift: retStreakOffset * 0.12,
        extraTransform: " scale(1.09, 1.05)",
        blurPx: 1.35,
        opacity: Math.abs(retStreakOffset) < 1 ? 0.84 : 0.72,
      };
    }
    if (flags.partialRetinalDetachmentCase) {
      const rdOffsetAbs = Math.abs(retStreakOffset);
      let opacity = 0.88;
      if (rdOffsetAbs > 20 && rdOffsetAbs < 42) {
        const fadeT = (rdOffsetAbs - 20) / 22;
        const smoothFadeT = fadeT * fadeT * (3 - 2 * fadeT);
        opacity = 0.88 - smoothFadeT * 0.83;
      } else if (rdOffsetAbs >= 42) {
        opacity = 0.05;
      }
      return {
        background: `
      radial-gradient(
        ellipse 74% 60% at 56% 54%,
        rgba(255, 255, 255, 0.92) 0%,
        rgba(255, 255, 255, 0.28) 34%,
        rgba(255, 255, 255, 0.08) 64%,
        rgba(255, 255, 255, 0) 82%
      )
    `,
        shift: 0,
        extraTransform: " scale(1.06, 1.03)",
        blurPx: 0.1,
        opacity,
      };
    }
    if (flags.poorTearFilmCase) {
      const blinkClearT = Number.isFinite(lastBlinkAgeSec)
        ? Math.max(0, 1 - Math.min(1, lastBlinkAgeSec / 1.45))
        : 0;
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
      return {
        background: `
      radial-gradient(
        ellipse at ${shimmerX.toFixed(1)}% ${shimmerY.toFixed(1)}%,
        rgba(255, 255, 255, 0.98) 14%,
        rgba(255, 255, 255, ${(0.22 + flicker * 0.24).toFixed(2)}) 36%,
        rgba(255, 255, 255, 0.04) 72%,
        rgba(255, 255, 255, 0) 82%
      )
    `,
        shift:
          retStreakOffset * 0.18 +
          Math.sin(timeSec * 3.8 + 0.6) * (1.2 - blinkClearT * 0.58) +
          Math.sin(timeSec * 7.1 + 2.1) * (0.55 - blinkClearT * 0.28),
        extraTransform: "",
        blurPx: Math.max(0.08, 0.45 + flicker * 1.35 - blinkClearT * 0.58),
        opacity: 0.34 + flicker * 0.5 + blinkClearT * 0.12,
      };
    }
    if (flags.corticalCataractCase) {
      return {
        background: null,
        shift: retStreakOffset * 0.2,
        extraTransform: "",
        blurPx: flags.bigCorticalCataractCase ? 0.65 : 0.4,
        opacity:
          Math.abs(retStreakOffset) < 1
            ? flags.bigCorticalCataractCase
              ? 0.82
              : 0.88
            : flags.bigCorticalCataractCase
              ? 0.7
              : 0.78,
      };
    }
    if (flags.centralSubCorticalCataractCase) {
      return {
        background: `
      radial-gradient(
        ellipse 74% 68% at 50% 50%,
        rgba(255, 255, 255, 0.52) 0%,
        rgba(255, 255, 255, 0.18) 28%,
        rgba(255, 255, 255, 0.04) 58%,
        rgba(255, 255, 255, 0) 80%
      )
    `,
        shift: retStreakOffset * 0.2,
        extraTransform: "",
        blurPx: 0.88 + cataractLevel * 5e-3,
        opacity: Math.abs(retStreakOffset) < 1 ? 0.64 : 0.5,
      };
    }
    if (flags.posteriorPoleCataractCase) {
      return {
        background: `
      radial-gradient(
        ellipse 74% 68% at 50% 50%,
        rgba(255, 255, 255, 0.58) 0%,
        rgba(255, 255, 255, 0.16) 26%,
        rgba(255, 255, 255, 0.04) 54%,
        rgba(255, 255, 255, 0) 76%
      )
    `,
        shift: retStreakOffset * 0.18,
        extraTransform: "",
        blurPx: 1,
        opacity: Math.abs(retStreakOffset) < 1 ? 0.54 : 0.44,
      };
    }
    if (flags.posteriorCapsularThickeningCase) {
      return {
        background: `
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
    `,
        shift: retStreakOffset * 0.08,
        extraTransform: "",
        blurPx: 0.24,
        opacity: Math.abs(retStreakOffset) < 1 ? 0.82 : 0.7,
      };
    }
    if (flags.denseCataractCase) {
      return {
        background: `
      radial-gradient(
        ellipse 96% 88% at 50% 50%,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.84) 46%,
        rgba(0, 0, 0, 0.48) 74%,
        rgba(0, 0, 0, 0) 92%
      ),
      radial-gradient(
        ellipse 38% 32% at 34% 38%,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 1) 28%,
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
    `,
        shift: retStreakOffset * 0.08,
        extraTransform: " scale(1.02, 1.02)",
        blurPx: 1.16,
        opacity: 0.82,
      };
    }
    if (flags.leucocoriaCase) {
      return {
        background: `
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
    `,
        shift: retStreakOffset * 0.03,
        extraTransform: " scale(1.1, 1.08)",
        blurPx: 0.12,
        opacity: Math.abs(retStreakOffset) < 1 ? 0.9 : 0.74,
      };
    }
    return null;
  }

  // src/retinoscopy-active-reflex.js?v=20260430-1
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
    eyeType,
    flags,
    globalLightOffset = 0,
    lastBlinkAgeSec = Infinity,
    movementSign,
    retStreakOffset,
    retStreakOffsetY = 0,
    sceneRefraction = currentRefraction,
    timeSec,
  }) {
    let background = DEFAULT_REFLEX_BACKGROUND;
    let shift = 0;
    let opacity = Math.abs(retStreakOffset) < 1 ? 1 : 0.6;
    let extraTransform = "";
    let blurPx = 0;
    const mediaVisual = resolveMediaActiveReflexVisual({
      axisDeltaRad,
      cataractLevel,
      cylinderAxisDeg,
      flags,
      lastBlinkAgeSec,
      movementSign,
      retStreakOffset,
      retStreakOffsetY,
      timeSec,
    });
    const customVisual = resolveCustomActiveReflexVisual({
      activeRefraction,
      currentRefraction,
      eyeType,
      flags,
      retStreakOffset,
      sceneRefraction,
    });
    if (mediaVisual) {
      if (mediaVisual.background) {
        background = mediaVisual.background;
      }
      shift = mediaVisual.shift;
      opacity = mediaVisual.opacity;
      extraTransform = mediaVisual.extraTransform;
      blurPx = mediaVisual.blurPx;
    } else if (customVisual) {
      background = customVisual.background;
      shift = customVisual.shift;
      opacity = customVisual.opacity;
      extraTransform = customVisual.extraTransform;
      blurPx = customVisual.blurPx;
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

  // src/retinoscopy-beam-geometry.js?v=20260428-1
  function getRetStreakVisual(doc = document) {
    return doc.getElementById("ret-streak-visual");
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
  function getElementCentreInWrapper(element, wrapperRect) {
    if (!element || !wrapperRect) {
      return null;
    }
    const rect = element.getBoundingClientRect();
    return {
      x: (rect.left + rect.right) / 2 - wrapperRect.left,
      y: (rect.top + rect.bottom) / 2 - wrapperRect.top,
    };
  }
  function getBeamAnchorInWrapper({ wrapperRect, leftEye, rightEye }) {
    if (!wrapperRect) {
      return null;
    }
    const leftEyeCentre = getElementCentreInWrapper(leftEye, wrapperRect);
    const rightEyeCentre = getElementCentreInWrapper(rightEye, wrapperRect);
    if (leftEyeCentre && rightEyeCentre) {
      return {
        x: (leftEyeCentre.x + rightEyeCentre.x) * 0.5,
        y: (leftEyeCentre.y + rightEyeCentre.y) * 0.5,
      };
    }
    return leftEyeCentre || rightEyeCentre;
  }
  function updateRetStreakPosition({
    retStreak,
    retStreakVisual,
    eyesWrapper,
    leftEye,
    rightEye,
  }) {
    if (!retStreak || !eyesWrapper) {
      return;
    }
    const wrapperRect = eyesWrapper.getBoundingClientRect();
    const beamAnchor = getBeamAnchorInWrapper({
      wrapperRect,
      leftEye,
      rightEye,
    });
    if (!beamAnchor) {
      return;
    }
    retStreak.style.left = `${beamAnchor.x}px`;
    retStreak.style.top = `${beamAnchor.y}px`;
    if (retStreakVisual) {
      retStreakVisual.style.left = `${beamAnchor.x}px`;
      retStreakVisual.style.top = `${beamAnchor.y}px`;
    }
  }
  function updateRetStreakTransform({
    retStreak,
    retStreakVisual,
    retStreakOffset,
    retStreakOffsetY = 0,
  }) {
    if (!retStreak) {
      return;
    }
    retStreak.style.transform = `translate(-50%, -50%) translate(${retStreakOffset}px, ${retStreakOffsetY}px)`;
    if (retStreakVisual) {
      retStreakVisual.style.transform = `translate(-50%, -50%) translate(${retStreakOffset}px, ${retStreakOffsetY}px)`;
      retStreakVisual.classList.toggle(
        "is-emphasized",
        retStreak.classList.contains("is-hint-visible") ||
          retStreak.matches(":focus-visible"),
      );
    }
  }
  function getRetStreakOffsetBounds({
    eyesWrapper,
    leftEye,
    rightEye,
    defaultLimit,
  }) {
    const wrapperRect =
      eyesWrapper == null ? void 0 : eyesWrapper.getBoundingClientRect();
    const beamAnchor = getBeamAnchorInWrapper({
      wrapperRect,
      leftEye,
      rightEye,
    });
    if (!wrapperRect || !beamAnchor) {
      return {
        min: -defaultLimit,
        max: defaultLimit,
      };
    }
    const pupilOffsets = [leftEye, rightEye]
      .map((eye) => (eye == null ? void 0 : eye.querySelector(".pupil")))
      .map((pupil) => getPupilCentreInWrapper(pupil, wrapperRect))
      .filter(Boolean)
      .map((centre) => centre.x - beamAnchor.x);
    if (!pupilOffsets.length) {
      return {
        min: -defaultLimit,
        max: defaultLimit,
      };
    }
    return {
      min: Math.ceil(Math.min(...pupilOffsets)),
      max: Math.floor(Math.max(...pupilOffsets)),
    };
  }
  function getRetStreakOffsetYBounds({
    eyesWrapper,
    leftEye,
    rightEye,
    defaultLimit,
  }) {
    var _a2;
    const eyeHeights = [leftEye, rightEye]
      .map((eye) => {
        var _a3;
        return (_a3 = eye == null ? void 0 : eye.getBoundingClientRect) == null
          ? void 0
          : _a3.call(eye).height;
      })
      .filter((height) => Number.isFinite(height) && height > 0);
    const measuredLimit = eyeHeights.length
      ? Math.round(Math.min(...eyeHeights) * 0.24)
      : defaultLimit;
    const wrapperHeight =
      (_a2 =
        eyesWrapper == null ? void 0 : eyesWrapper.getBoundingClientRect) ==
      null
        ? void 0
        : _a2.call(eyesWrapper).height;
    const wrapperLimit = Number.isFinite(wrapperHeight)
      ? Math.max(8, Math.round(wrapperHeight * 0.04))
      : defaultLimit;
    const limit = Math.max(
      8,
      Math.min(defaultLimit, measuredLimit, wrapperLimit),
    );
    return {
      min: -limit,
      max: limit,
    };
  }
  function clampRetStreakOffset({
    value,
    currentValue,
    eyesWrapper,
    leftEye,
    rightEye,
    defaultLimit,
  }) {
    const numericValue = Number.isFinite(value)
      ? value
      : Number.parseFloat(value);
    if (Number.isNaN(numericValue)) {
      return currentValue;
    }
    const { min, max } = getRetStreakOffsetBounds({
      eyesWrapper,
      leftEye,
      rightEye,
      defaultLimit,
    });
    return Math.max(min, Math.min(max, Math.round(numericValue)));
  }
  function clampRetStreakOffsetY({
    value,
    currentValue,
    eyesWrapper,
    leftEye,
    rightEye,
    defaultLimit,
  }) {
    const numericValue = Number.isFinite(value)
      ? value
      : Number.parseFloat(value);
    if (Number.isNaN(numericValue)) {
      return currentValue;
    }
    const { min, max } = getRetStreakOffsetYBounds({
      eyesWrapper,
      leftEye,
      rightEye,
      defaultLimit,
    });
    return Math.max(min, Math.min(max, Math.round(numericValue)));
  }
  function getFellowEyeFocusBalance({
    beamCentre,
    eyeType,
    pupilRadiusPx,
    sweepX,
    sweepY,
    wrapperRect,
    leftEye,
    rightEye,
  }) {
    const currentDistancePx = Math.hypot(sweepX, sweepY);
    const fellowEye = eyeType === "left" ? rightEye : leftEye;
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

  // src/retinoscopy-pathology-overlays.js?v=20260428-5
  function buildPathologyOverlayVisual2({
    flags,
    sweepX = 0,
    sweepY = 0,
    timeSec,
  }) {
    if (
      !flags.floatersCase &&
      !flags.iridocyclitisKpsCase &&
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
          ellipse 28% 20% at 36% 46%,
          rgba(224, 202, 110, 0.42) 0%,
          rgba(224, 202, 110, 0.24) 34%,
          rgba(224, 202, 110, 0.08) 58%,
          rgba(224, 202, 110, 0) 74%
        ),
        radial-gradient(
          ellipse 18% 14% at 42% 50%,
          rgba(198, 174, 88, 0.36) 0%,
          rgba(198, 174, 88, 0.18) 38%,
          rgba(198, 174, 88, 0.06) 58%,
          rgba(198, 174, 88, 0) 76%
        ),
        radial-gradient(
          ellipse 20% 16% at 62% 46%,
          rgba(146, 138, 130, 0.52) 0%,
          rgba(146, 138, 130, 0.28) 34%,
          rgba(146, 138, 130, 0.08) 56%,
          rgba(146, 138, 130, 0) 74%
        ),
        radial-gradient(
          ellipse 13% 10% at 57% 53%,
          rgba(128, 120, 112, 0.42) 0%,
          rgba(128, 120, 112, 0.2) 34%,
          rgba(128, 120, 112, 0.06) 54%,
          rgba(128, 120, 112, 0) 72%
        ),
        radial-gradient(
          ellipse 12% 9% at 69% 40%,
          rgba(118, 112, 106, 0.36) 0%,
          rgba(118, 112, 106, 0.16) 34%,
          rgba(118, 112, 106, 0.04) 52%,
          rgba(118, 112, 106, 0) 70%
        ),
        radial-gradient(
          ellipse 20% 16% at 29% 34%,
          rgba(140, 130, 116, 0.54) 0%,
          rgba(140, 130, 116, 0.28) 32%,
          rgba(102, 102, 102, 0) 58%
        ),
        radial-gradient(
          ellipse 17% 14% at 68% 32%,
          rgba(148, 138, 122, 0.5) 0%,
          rgba(148, 138, 122, 0.24) 30%,
          rgba(112, 112, 112, 0) 56%
        ),
        radial-gradient(
          ellipse 18% 15% at 63% 69%,
          rgba(142, 132, 118, 0.48) 0%,
          rgba(142, 132, 118, 0.22) 30%,
          rgba(108, 108, 108, 0) 56%
        ),
        radial-gradient(
          ellipse 15% 12% at 44% 57%,
          rgba(152, 142, 126, 0.44) 0%,
          rgba(152, 142, 126, 0.22) 28%,
          rgba(118, 118, 118, 0) 52%
        ),
        radial-gradient(
          ellipse 24% 18% at 38% 42%,
          rgba(166, 154, 138, 0.4) 0%,
          rgba(166, 154, 138, 0.2) 30%,
          rgba(116, 116, 116, 0) 54%
        ),
        radial-gradient(
          ellipse 18% 14% at 62% 36%,
          rgba(174, 162, 146, 0.38) 0%,
          rgba(174, 162, 146, 0.18) 28%,
          rgba(136, 136, 136, 0) 50%
        ),
        radial-gradient(
          ellipse 22% 16% at 58% 64%,
          rgba(168, 156, 140, 0.36) 0%,
          rgba(168, 156, 140, 0.16) 30%,
          rgba(130, 130, 130, 0) 52%
        ),
        radial-gradient(
          ellipse 28% 22% at 34% 40%,
          rgba(196, 182, 160, 0.3) 0%,
          rgba(196, 182, 160, 0.14) 34%,
          rgba(156, 156, 156, 0) 58%
        ),
        radial-gradient(
          ellipse 22% 18% at 64% 34%,
          rgba(204, 190, 168, 0.26) 0%,
          rgba(204, 190, 168, 0.12) 30%,
          rgba(166, 166, 166, 0) 54%
        ),
        radial-gradient(
          ellipse 26% 20% at 58% 66%,
          rgba(188, 174, 154, 0.28) 0%,
          rgba(188, 174, 154, 0.12) 30%,
          rgba(146, 146, 146, 0) 54%
        ),
        radial-gradient(
          ellipse 20% 16% at 46% 54%,
          rgba(212, 198, 176, 0.18) 0%,
          rgba(212, 198, 176, 0.08) 28%,
          rgba(170, 170, 170, 0) 50%
        ),
        radial-gradient(
          ellipse 16% 14% at 72% 58%,
          rgba(192, 178, 158, 0.16) 0%,
          rgba(192, 178, 158, 0.08) 26%,
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
    if (flags.iridocyclitisKpsCase) {
      return {
        background: `
        radial-gradient(ellipse 8.4% 8.4% at 10% 14%, rgba(0, 0, 0, 0.99) 0%, rgba(0, 0, 0, 0.99) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 7.2% 7.2% at 20% 24%, rgba(0, 0, 0, 0.97) 0%, rgba(0, 0, 0, 0.97) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 8% 8% at 28% 12%, rgba(0, 0, 0, 0.99) 0%, rgba(0, 0, 0, 0.99) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 7% 7% at 40% 18%, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.95) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 7.8% 7.8% at 54% 14%, rgba(0, 0, 0, 0.97) 0%, rgba(0, 0, 0, 0.97) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 6.8% 6.8% at 58% 28%, rgba(0, 0, 0, 0.93) 0%, rgba(0, 0, 0, 0.93) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 7.2% 7.2% at 16% 40%, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.92) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 6.6% 6.6% at 34% 38%, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.9) 46%, rgba(0, 0, 0, 0) 68%)
      `,
        blurPx: 0.02,
        opacity: 0.88,
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

  // src/retinoscopy-beam-geometry.js?v=20260308-133
  function getPupilCentreInWrapper2(pupilElement, wrapperRect) {
    if (!pupilElement || !wrapperRect) {
      return null;
    }
    const pupilRect = pupilElement.getBoundingClientRect();
    return {
      x: (pupilRect.left + pupilRect.right) / 2 - wrapperRect.left,
      y: (pupilRect.top + pupilRect.bottom) / 2 - wrapperRect.top,
    };
  }
  function getFellowEyeFocusBalance2({
    beamCentre,
    eyeType,
    pupilRadiusPx,
    sweepX,
    sweepY,
    wrapperRect,
    leftEye,
    rightEye,
  }) {
    const currentDistancePx = Math.hypot(sweepX, sweepY);
    const fellowEye = eyeType === "left" ? rightEye : leftEye;
    const fellowPupilCentre = getPupilCentreInWrapper2(
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

  // src/retinoscopy-overlays.js?v=20260428-8
  var CORNEAL_LIGHT_SHIFT_FACTOR = 0.02;
  var CORNEAL_LIGHT_SHIFT_X_LIMIT_PX = 0.8;
  var CORNEAL_LIGHT_SHIFT_Y_LIMIT_PX = 0.6;
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  function createEmptyCorticalPatternState() {
    return {
      left: null,
      right: null,
    };
  }
  function createCorticalPatternStateForRefraction(value) {
    if (value === REFRACTION_VALUES2.BIG_CORTICAL_CATARACT) {
      return {
        left: createCorticalCataractPattern(true),
        right: createCorticalCataractPattern(true),
      };
    }
    if (value === REFRACTION_VALUES2.SMALL_CORTICAL_CATARACT) {
      return {
        left: createCorticalCataractPattern(false),
        right: createCorticalCataractPattern(false),
      };
    }
    if (value === REFRACTION_VALUES2.RIGHT_BIG_CORTICAL_LEFT_SMALL_CORTICAL) {
      return {
        left: createCorticalCataractPattern(true),
        right: createCorticalCataractPattern(false),
      };
    }
    return null;
  }
  function updateCornealReflexState({
    beamCentre,
    eye,
    eyeType,
    leftEye,
    lightOffsetX = 0,
    lightOffsetY = 0,
    pupilRadiusPx,
    rightEye,
    sweepX,
    sweepY,
    wrapperRect,
  }) {
    if (!eye) {
      return;
    }
    const { currentDistancePx, fellowDistancePx } = getFellowEyeFocusBalance2({
      beamCentre,
      eyeType,
      leftEye,
      pupilRadiusPx,
      rightEye,
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
      `${clamp(
        lightOffsetX * CORNEAL_LIGHT_SHIFT_FACTOR,
        -CORNEAL_LIGHT_SHIFT_X_LIMIT_PX,
        CORNEAL_LIGHT_SHIFT_X_LIMIT_PX,
      ).toFixed(2)}px`,
    );
    eye.style.setProperty(
      "--corneal-reflex-light-y",
      `${clamp(
        lightOffsetY * CORNEAL_LIGHT_SHIFT_FACTOR,
        -CORNEAL_LIGHT_SHIFT_Y_LIMIT_PX,
        CORNEAL_LIGHT_SHIFT_Y_LIMIT_PX,
      ).toFixed(2)}px`,
    );
  }
  function updateCorticalCataractMask({
    maskElement,
    isActiveEye,
    flags,
    eyeType,
    corticalCataractPattern,
  }) {
    if (!maskElement) {
      return corticalCataractPattern;
    }
    const shouldShowMask = flags.corticalCataractCase && isActiveEye;
    if (!shouldShowMask) {
      maskElement.style.opacity = "0";
      maskElement.style.background = "none";
      maskElement.style.maskImage = "none";
      maskElement.style.webkitMaskImage = "none";
      maskElement.style.transform = "none";
      return corticalCataractPattern;
    }
    const isLargePattern = flags.bigCorticalCataractCase;
    const patternState =
      corticalCataractPattern && typeof corticalCataractPattern === "object"
        ? corticalCataractPattern
        : createEmptyCorticalPatternState();
    const patternKey = eyeType === "right" ? "right" : "left";
    const pattern =
      patternState[patternKey] || createCorticalCataractPattern(isLargePattern);
    patternState[patternKey] = pattern;
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
        rgba(0, 0, 0, 0.92) 74%,
        rgba(0, 0, 0, 1) 100%
      )`;
    maskElement.style.maskImage = maskImage;
    maskElement.style.webkitMaskImage = maskImage;
    maskElement.style.filter = isLargePattern ? "blur(0.36px)" : "blur(0.24px)";
    maskElement.style.transform = "none";
    maskElement.style.opacity = isLargePattern ? "0.94" : "0.9";
    return patternState;
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
    if (flags.iridocyclitisKpsCase) {
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
    const overlayVisual = buildPathologyOverlayVisual2({
      flags,
      sweepX,
      sweepY,
      timeSec,
    });
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

  // src/structural-eye-effects.js?v=20260430-4
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
  function applyStructuralEyeState({
    eye,
    eyeType,
    flags,
    isActiveEye,
    sceneRefraction,
    sizeProfile = "live",
  }) {
    if (!eye) {
      return;
    }
    const applyDullReflexCornealDot =
      sceneRefraction === REFRACTION_VALUES.BILATERAL_DULL_REFLEX;
    const applyIolReflection =
      sceneRefraction ===
        REFRACTION_VALUES.RIGHT_IOL_LEFT_POSTERIOR_CAPSULAR_THICKENING &&
      eyeType === "left";
    const applyCornealOpacityReflex =
      sceneRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY &&
      eyeType === "right";
    const applySubluxatedLensEdge =
      sceneRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS &&
      eyeType === "right";
    const applyTechniqueUpperLidBlock =
      sceneRefraction === REFRACTION_VALUES.TECHNIQUE_UPPER_LID_BLOCKING;
    eye.classList.toggle(
      "is-corneal-scar",
      (flags.cornealScarCase || applyDullReflexCornealDot) && isActiveEye,
    );
    eye.classList.toggle(
      "is-technique-upper-lid-block",
      applyTechniqueUpperLidBlock && isActiveEye,
    );
    eye.classList.toggle(
      "has-iol-reflection",
      applyIolReflection && isActiveEye,
    );
    eye.classList.toggle(
      "has-corneal-opacity-reflex",
      applyCornealOpacityReflex && isActiveEye,
    );
    eye.classList.toggle(
      "has-subluxated-lens-edge",
      applySubluxatedLensEdge && isActiveEye,
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
    const applyLeftAnisocoria =
      sceneRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_ANISOCORIA &&
      eyeType === "right";
    if (pupilElement) {
      let targetWidthPx = baseSizePx;
      let targetHeightPx = baseSizePx;
      if (sizeProfile === "preview") {
        if (applyAniridia) {
          const targetSizePx = Math.min(44, Math.max(41, baseSizePx * 2.6));
          targetWidthPx = targetSizePx;
          targetHeightPx = targetSizePx;
        } else if (applyLeftAnisocoria) {
          const targetSizePx = Math.max(11, Math.min(13, baseSizePx * 0.72));
          targetWidthPx = targetSizePx;
          targetHeightPx = targetSizePx;
        } else if (applySmallPupils) {
          const targetSizePx = Math.max(9, Math.min(11, baseSizePx * 0.6));
          targetWidthPx = targetSizePx;
          targetHeightPx = targetSizePx;
        } else if (applyAcg) {
          targetWidthPx = Math.min(21, Math.max(18, baseSizePx * 1.18));
          targetHeightPx = Math.min(25, Math.max(22, baseSizePx * 1.46));
        }
      } else if (applyAniridia) {
        const targetSizePx = Math.min(74, Math.max(66, baseSizePx * 2.25));
        targetWidthPx = targetSizePx;
        targetHeightPx = targetSizePx;
      } else if (applyLeftAnisocoria) {
        const targetSizePx = Math.max(24, Math.min(27, baseSizePx * 0.82));
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
    const distancePx = Math.abs(sweepX);
    const responseRadiusPx = Math.max(1, pupilRadiusPx * 1.18);
    const rawT = Math.max(0, Math.min(1, distancePx / responseRadiusPx));
    const smoothT = rawT * rawT * (3 - 2 * rawT);
    const constrictionAmount = (1 - smoothT) * maxConstriction;
    const targetPupilScale = 1 - constrictionAmount;
    const previousPupilScale =
      parseFloat(iris.style.getPropertyValue("--light-pupil-scale")) || 1;
    const responseRate = targetPupilScale < previousPupilScale ? 0.28 : 0.16;
    const pupilScale =
      previousPupilScale +
      (targetPupilScale - previousPupilScale) * responseRate;
    iris.style.setProperty("--light-pupil-scale", pupilScale.toFixed(3));
  }

  // src/retinoscopy.js?v=20260430-11
  function createRetinoscopyController({ state, dom }) {
    const GLOBAL_REFLEX_BRIGHTNESS_BOOST = 1.752;
    const GLOBAL_REFLEX_OPACITY_BOOST = 1.1;
    const RIGHT_ANTERIOR_SEGMENT_DULL_BRIGHTNESS_SCALE = 0.62;
    const RIGHT_ANTERIOR_SEGMENT_DULL_OPACITY_SCALE = 0.84;
    const DEFAULT_RET_STREAK_LIMIT = 100;
    const DEFAULT_RET_STREAK_Y_LIMIT = 18;
    const LIGHT_JITTER_MIN_OFFSET_PX = 2;
    function getCaseSpecificDullingScale(eyeType) {
      const isAffectedRightEye =
        eyeType === "left" &&
        (state.currentRefraction === REFRACTION_VALUES.RIGHT_ACG_LEFT_NORMAL ||
          state.currentRefraction ===
            REFRACTION_VALUES.RIGHT_IRIDOCYCLITIS_LEFT_NORMAL);
      return {
        brightness: isAffectedRightEye
          ? RIGHT_ANTERIOR_SEGMENT_DULL_BRIGHTNESS_SCALE
          : 1,
        opacity: isAffectedRightEye
          ? RIGHT_ANTERIOR_SEGMENT_DULL_OPACITY_SCALE
          : 1,
      };
    }
    function createCorticalPatternStateForRefraction2(value) {
      return createCorticalPatternStateForRefraction(value);
    }
    function getManualDragFillFactor(eye) {
      if (!eye) {
        return 1;
      }
      const rawValue = parseFloat(
        eye.style.getPropertyValue("--manual-drag-pupil-fill-factor"),
      );
      return Number.isFinite(rawValue) ? Math.max(1, rawValue) : 1;
    }
    function getEffectiveBaseReflexColor2() {
      if (state.currentRefraction === REFRACTION_VALUES.BILATERAL_BLUE_NORMAL) {
        return BLUE_END_REFLEX_COLOR;
      }
      return state.baseReflexColor;
    }
    function getBasePupilFill(eye, flags, fillFactorOverride = null) {
      if (flags.normalDarkCase) {
        return "rgb(44, 44, 44)";
      }
      if (flags.leucocoriaCase) {
        return `
        radial-gradient(
          circle at 50% 44%,
          rgb(255, 249, 234) 0%,
          rgb(247, 238, 214) 40%,
          rgb(232, 221, 194) 72%,
          rgb(206, 193, 165) 100%
        )
      `;
      }
      const { r, g, b } = getEffectiveBaseReflexColor2();
      const fillFactor = Number.isFinite(fillFactorOverride)
        ? fillFactorOverride
        : getManualDragFillFactor(eye);
      const boostedColor = brightenColor({ r, g, b }, fillFactor);
      return `rgb(${boostedColor.r}, ${boostedColor.g}, ${boostedColor.b})`;
    }
    function getLiveEyeOffset(iris) {
      var _a2, _b, _c, _d, _e, _f;
      return {
        x:
          (((_a2 = iris == null ? void 0 : iris.caseOffset) == null
            ? void 0
            : _a2.x) || 0) +
          (((_b = iris == null ? void 0 : iris.manualOffset) == null
            ? void 0
            : _b.x) || 0) +
          (((_c = iris == null ? void 0 : iris.gazeOffset) == null
            ? void 0
            : _c.x) || 0),
        y:
          (((_d = iris == null ? void 0 : iris.caseOffset) == null
            ? void 0
            : _d.y) || 0) +
          (((_e = iris == null ? void 0 : iris.manualOffset) == null
            ? void 0
            : _e.y) || 0) +
          (((_f = iris == null ? void 0 : iris.gazeOffset) == null
            ? void 0
            : _f.y) || 0),
      };
    }
    function getAlignmentDeviationBoostWeight({
      eyeType,
      iris,
      pupilRadiusPx,
    }) {
      const isDeviationEye =
        (state.currentRefraction ===
          REFRACTION_VALUES.RIGHT_NORMAL_LEFT_LARGE_ESOTROPIA &&
          eyeType === "right") ||
        (state.currentRefraction ===
          REFRACTION_VALUES.RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR &&
          eyeType === "left");
      if (!isDeviationEye) {
        return 1;
      }
      const { x, y } = getLiveEyeOffset(iris);
      const distancePx = Math.hypot(x, y * 0.65);
      const fadeStartPx = Math.max(2, pupilRadiusPx * 0.12);
      const fadeEndPx = Math.max(fadeStartPx + 1, pupilRadiusPx * 0.95);
      const rawT = Math.max(
        0,
        Math.min(1, (distancePx - fadeStartPx) / (fadeEndPx - fadeStartPx)),
      );
      return rawT * rawT * (3 - 2 * rawT);
    }
    function applyAlignmentDeviationBoost(baseBoost, boostWeight) {
      return 1 + (Math.max(1, baseBoost) - 1) * boostWeight;
    }
    function getGazeFixationResponse(iris) {
      if (!state.isLiveMotionEnabled || !iris) {
        return {
          brightness: 1,
          fillFactor: 1,
          opacity: 1,
        };
      }
      const { x } = getLiveEyeOffset(iris);
      const horizontalT = Math.max(0, Math.min(1, Math.abs(x) / 18));
      const smoothT = horizontalT * horizontalT * (3 - 2 * horizontalT);
      return {
        brightness: 1 + smoothT * 0.24,
        fillFactor: 1 + smoothT * 0.34,
        opacity: 1 + smoothT * 0.08,
      };
    }
    function getNystagmusVisibilityResponse(iris, flags = {}) {
      const normalizedLevel =
        Math.max(0, Math.min(100, state.nystagmusLevel || 0)) / 100;
      if (normalizedLevel <= 0 || !iris) {
        return {
          blurPx: 0,
          brightness: 1,
          opacity: 1,
        };
      }
      const caseVisibilityWeight =
        flags.aniridiaCase || flags.bilateralAniridiaCase ? 0 : 1;
      const offset = iris.nystagmusOffset || { x: 0, y: 0 };
      const expectedAmplitude = Math.max(1, normalizedLevel * 9.2);
      const motionT = Math.max(
        0,
        Math.min(
          1,
          Math.hypot(offset.x || 0, offset.y || 0) / expectedAmplitude,
        ),
      );
      const smoothT = motionT * motionT * (3 - 2 * motionT);
      return {
        blurPx: smoothT * normalizedLevel * 0.28 * caseVisibilityWeight,
        brightness: 1 - smoothT * normalizedLevel * 0.08 * caseVisibilityWeight,
        opacity: 1 - smoothT * normalizedLevel * 0.1 * caseVisibilityWeight,
      };
    }
    function getLastBlinkAgeSec(timeSec) {
      return state.lastBlinkAtMs
        ? Math.max(0, timeSec - state.lastBlinkAtMs / 1e3)
        : Infinity;
    }
    function getRetStreakVisual2() {
      return getRetStreakVisual(document);
    }
    function updateRetStreakPosition2() {
      updateRetStreakPosition({
        retStreak: dom.retStreak,
        retStreakVisual: getRetStreakVisual2(),
        eyesWrapper: dom.eyesWrapper,
        leftEye: dom.leftEye,
        rightEye: dom.rightEye,
      });
    }
    function updateRetStreakTransform2() {
      const timeSec = performance.now() / 1e3;
      const lightJitter = getLightJitterOffset(timeSec);
      updateRetStreakTransform({
        retStreak: dom.retStreak,
        retStreakVisual: getRetStreakVisual2(),
        retStreakOffset: state.retStreakOffset + lightJitter.x,
        retStreakOffsetY: (state.retStreakOffsetY || 0) + lightJitter.y,
      });
    }
    function getLightJitterOffset(timeSec) {
      if (!state.lightHoldActive) {
        return { x: 0, y: 0 };
      }
      const offsetX = state.retStreakOffset || 0;
      const offsetY = state.retStreakOffsetY || 0;
      const distancePx = Math.hypot(offsetX, offsetY);
      if (distancePx < LIGHT_JITTER_MIN_OFFSET_PX) {
        return { x: 0, y: 0 };
      }
      const intensity = Math.min(1, distancePx / 52);
      const babyFactor = state.isBabyMode ? 1.14 : 1;
      const jitterX =
        (Math.sin(timeSec * 9.4 + 0.7) * 0.52 +
          Math.sin(timeSec * 16.8 + 1.9) * 0.12) *
        intensity *
        babyFactor;
      const jitterY =
        (Math.cos(timeSec * 8.2 + 0.2) * 0.34 +
          Math.sin(timeSec * 15.5 + 2.6) * 0.08) *
        intensity *
        babyFactor;
      return {
        x: Math.max(-1, Math.min(1, jitterX)),
        y: Math.max(-0.75, Math.min(0.75, jitterY)),
      };
    }
    function getPupilCentreInWrapper3(pupilElement, wrapperRect) {
      return getPupilCentreInWrapper(pupilElement, wrapperRect);
    }
    function getBeamAnchorInWrapper2(wrapperRect) {
      return getBeamAnchorInWrapper({
        wrapperRect,
        leftEye: dom.leftEye,
        rightEye: dom.rightEye,
      });
    }
    function getRetStreakOffsetBounds2() {
      return getRetStreakOffsetBounds({
        eyesWrapper: dom.eyesWrapper,
        leftEye: dom.leftEye,
        rightEye: dom.rightEye,
        defaultLimit: DEFAULT_RET_STREAK_LIMIT,
      });
    }
    function getRetStreakOffsetYBounds2() {
      return getRetStreakOffsetYBounds({
        eyesWrapper: dom.eyesWrapper,
        leftEye: dom.leftEye,
        rightEye: dom.rightEye,
        defaultLimit: DEFAULT_RET_STREAK_Y_LIMIT,
      });
    }
    function clampRetStreakOffset2(value) {
      return clampRetStreakOffset({
        value,
        currentValue: state.retStreakOffset,
        eyesWrapper: dom.eyesWrapper,
        leftEye: dom.leftEye,
        rightEye: dom.rightEye,
        defaultLimit: DEFAULT_RET_STREAK_LIMIT,
      });
    }
    function clampRetStreakOffsetY2(value) {
      return clampRetStreakOffsetY({
        value,
        currentValue: state.retStreakOffsetY || 0,
        eyesWrapper: dom.eyesWrapper,
        leftEye: dom.leftEye,
        rightEye: dom.rightEye,
        defaultLimit: DEFAULT_RET_STREAK_Y_LIMIT,
      });
    }
    function getFellowEyeFocusBalance3({
      beamCentre,
      eyeType,
      pupilRadiusPx,
      sweepX,
      sweepY,
      wrapperRect,
    }) {
      return getFellowEyeFocusBalance({
        beamCentre,
        eyeType,
        leftEye: dom.leftEye,
        pupilRadiusPx,
        rightEye: dom.rightEye,
        sweepX,
        sweepY,
        wrapperRect,
      });
    }
    function updateCornealReflexState2({
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
      updateCornealReflexState({
        beamCentre,
        eye,
        eyeType,
        leftEye: dom.leftEye,
        lightOffsetX,
        lightOffsetY,
        pupilRadiusPx,
        rightEye: dom.rightEye,
        sweepX,
        sweepY,
        wrapperRect,
      });
    }
    function updateCorticalCataractMask2({
      maskElement,
      isActiveEye,
      flags,
      eyeType,
      sweepY,
    }) {
      state.corticalCataractPattern = updateCorticalCataractMask({
        maskElement,
        isActiveEye,
        flags,
        eyeType,
        corticalCataractPattern: state.corticalCataractPattern,
        sweepY,
      });
    }
    function updatePathologyOverlay2({
      flags,
      isActiveEye,
      overlayElement,
      pupilRadiusPx,
      sweepX,
      sweepY,
      timeSec,
    }) {
      updatePathologyOverlay({
        flags,
        isActiveEye,
        overlayElement,
        pupilRadiusPx,
        sweepX,
        sweepY,
        timeSec,
      });
    }
    function updateActiveEyeReflex({
      activeRefraction,
      beamCentre,
      beamOffsetX,
      beamOffsetY,
      cataractVisual,
      eye,
      eyeType,
      flags,
      iris,
      pupilRadiusPx,
      reflex,
      reflexCompX,
      reflexCompY,
      timeSec,
      wrapperRect,
    }) {
      const alignmentBoostWeight = getAlignmentDeviationBoostWeight({
        eyeType,
        iris,
        pupilRadiusPx,
      });
      const reflexVisual = buildActiveReflexVisual({
        activeRefraction,
        axisDeltaRad: 0,
        cataractLevel: state.cataractLevel,
        cylinderAxisDeg: 0,
        currentRefraction: activeRefraction,
        eyeType,
        flags,
        globalLightOffset: state.retStreakOffset,
        lastBlinkAgeSec: getLastBlinkAgeSec(timeSec),
        movementSign: 1,
        retStreakOffset: beamOffsetX,
        retStreakOffsetY: beamOffsetY,
        sceneRefraction: state.currentRefraction,
        timeSec,
      });
      reflex.style.background = reflexVisual.background;
      const shiftX = reflexVisual.shift - reflexCompX;
      const shiftY = -reflexCompY;
      const sweepX = beamOffsetX;
      const sweepY = beamOffsetY;
      const lampDrivenSweepY = sweepY + reflexCompY;
      const { edgeBlurBoostPx, edgeBrightnessScale, edgeOpacityScale } =
        getEdgeVisualState({
          probeOffsetX: sweepX,
          probeOffsetY: lampDrivenSweepY,
          pupilRadiusPx,
        });
      const isAniridiaReflex =
        flags.aniridiaCase ||
        flags.bilateralAniridiaCase ||
        activeRefraction === REFRACTION_VALUES.ANIRIDIA;
      const isNeutralCase =
        state.currentRefraction === REFRACTION_VALUES.BILATERAL_MYOPIA ||
        state.currentRefraction === REFRACTION_VALUES.RIGHT_HYPER_LEFT_MYOPIA ||
        activeRefraction === REFRACTION_VALUES.ZERO ||
        activeRefraction === REFRACTION_VALUES.ANIRIDIA ||
        activeRefraction === REFRACTION_VALUES.NORMAL_DARK ||
        activeRefraction === REFRACTION_VALUES.NORMAL_HYPER;
      const effectiveEdgeBlurBoostPx = isAniridiaReflex
        ? 0
        : isNeutralCase
          ? edgeBlurBoostPx * 0.2
          : edgeBlurBoostPx;
      const effectiveEdgeBrightnessScale = isAniridiaReflex
        ? 1
        : isNeutralCase
          ? 0.86 + edgeBrightnessScale * 0.14
          : edgeBrightnessScale;
      const effectiveEdgeOpacityScale = isAniridiaReflex
        ? 1
        : isNeutralCase
          ? 0.72 + edgeOpacityScale * 0.28
          : edgeOpacityScale;
      const verticalReflexT = Math.max(-1, Math.min(1, lampDrivenSweepY / 18));
      const verticalReflexShiftPx = verticalReflexT * 1.25;
      const verticalReflexScaleY = 1 + Math.abs(verticalReflexT) * 0.018;
      let transformStr = `translate(${shiftX}px, ${(shiftY + verticalReflexShiftPx).toFixed(2)}px)`;
      if (
        state.currentRefraction === REFRACTION_VALUES.HIGH_MINUS ||
        state.currentRefraction === REFRACTION_VALUES.HIGH_PLUS
      ) {
        transformStr += " scale(0.6)";
      }
      transformStr += reflexVisual.extraTransform;
      transformStr += ` scale(1, ${verticalReflexScaleY.toFixed(3)})`;
      reflex.style.transform = transformStr;
      const { smoothT: rawFellowEyeFocusT } = getFellowEyeFocusBalance3({
        beamCentre,
        eyeType,
        pupilRadiusPx,
        sweepX,
        sweepY,
        wrapperRect,
      });
      const fellowEyeFocusT = isAniridiaReflex ? 0 : rawFellowEyeFocusT;
      const reflexEdgeOpacityScale = flags.denseCataractCase
        ? 0.18 + (1 - edgeOpacityScale) * 0.7
        : effectiveEdgeOpacityScale;
      const reflexVisualOpacity = isAniridiaReflex ? 0.6 : reflexVisual.opacity;
      const adjustedOpacity =
        reflexVisualOpacity *
        reflexEdgeOpacityScale *
        cataractVisual.opacityScale *
        GLOBAL_REFLEX_OPACITY_BOOST *
        (1 - fellowEyeFocusT * 0.3);
      const cornealOpacityOpacityScale =
        state.currentRefraction ===
          REFRACTION_VALUES.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY &&
        eyeType === "right"
          ? 0.82
          : 1;
      const caseSpecificDullingScale = getCaseSpecificDullingScale(eyeType);
      const dullReflexOpacityScale =
        state.currentRefraction === REFRACTION_VALUES.BILATERAL_DULL_REFLEX
          ? 0.5
          : 1;
      const manualDragOpacityBoost = Math.max(
        1,
        parseFloat(
          eye == null
            ? void 0
            : eye.style.getPropertyValue("--manual-drag-reflex-opacity-boost"),
        ) || 1,
      );
      const effectiveManualDragOpacityBoost = applyAlignmentDeviationBoost(
        manualDragOpacityBoost,
        alignmentBoostWeight,
      );
      const gazeFixationResponse = getGazeFixationResponse(iris);
      const nystagmusVisibilityResponse = getNystagmusVisibilityResponse(
        iris,
        flags,
      );
      reflex.style.opacity = Math.max(
        0.015,
        Math.min(
          adjustedOpacity *
            effectiveManualDragOpacityBoost *
            gazeFixationResponse.opacity *
            nystagmusVisibilityResponse.opacity *
            dullReflexOpacityScale *
            caseSpecificDullingScale.opacity *
            cornealOpacityOpacityScale,
          1,
        ),
      );
      const totalBlurPx =
        reflexVisual.blurPx +
        cataractVisual.blurBoostPx +
        effectiveEdgeBlurBoostPx +
        nystagmusVisibilityResponse.blurPx +
        (state.currentRefraction === REFRACTION_VALUES.BILATERAL_DULL_REFLEX
          ? 0.34
          : 0);
      const filterParts = [];
      if (totalBlurPx > 0.01) {
        filterParts.push(`blur(${totalBlurPx.toFixed(2)}px)`);
      }
      const totalBrightnessScale =
        cataractVisual.brightnessScale *
        effectiveEdgeBrightnessScale *
        GLOBAL_REFLEX_BRIGHTNESS_BOOST;
      const cornealOpacityBrightnessScale =
        state.currentRefraction ===
          REFRACTION_VALUES.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY &&
        eyeType === "right"
          ? 0.54
          : 1;
      const fellowEyeBrightnessScale = 1 - fellowEyeFocusT * 0.5;
      const manualDragBrightnessBoost = Math.max(
        1,
        parseFloat(
          eye == null
            ? void 0
            : eye.style.getPropertyValue(
                "--manual-drag-reflex-brightness-boost",
              ),
        ) || 1,
      );
      const effectiveManualDragBrightnessBoost = applyAlignmentDeviationBoost(
        manualDragBrightnessBoost,
        alignmentBoostWeight,
      );
      const adjustedBrightnessScale =
        totalBrightnessScale *
        cornealOpacityBrightnessScale *
        caseSpecificDullingScale.brightness *
        fellowEyeBrightnessScale *
        gazeFixationResponse.brightness *
        nystagmusVisibilityResponse.brightness *
        effectiveManualDragBrightnessBoost *
        (state.currentRefraction === REFRACTION_VALUES.BILATERAL_DULL_REFLEX
          ? 0.64
          : 1);
      if (Math.abs(adjustedBrightnessScale - 1) > 0.01) {
        filterParts.push(`brightness(${adjustedBrightnessScale.toFixed(2)})`);
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
      var _a2;
      const flags = getCaseFlags(state.currentRefraction);
      const cataractVisual = getCataractVisualState(state.cataractLevel);
      const timeSec = performance.now() / 1e3;
      const lightJitter = getLightJitterOffset(timeSec);
      const wrapperRect =
        ((_a2 = dom.eyesWrapper) == null
          ? void 0
          : _a2.getBoundingClientRect()) || null;
      const beamAnchor = getBeamAnchorInWrapper2(wrapperRect);
      const beamCentre = beamAnchor
        ? {
            x: beamAnchor.x + state.retStreakOffset + lightJitter.x,
            y: beamAnchor.y + (state.retStreakOffsetY || 0) + lightJitter.y,
          }
        : null;
      dom.retReflexElements.forEach((reflex) => {
        var _a3, _b, _c, _d, _e, _f;
        const eye = reflex.closest(".eye");
        const eyeType = eye == null ? void 0 : eye.dataset.eye;
        const activeRefraction = getActiveRefractionForMode(
          state.currentRefraction,
          eyeType,
        );
        const eyeFlags = getVisualFlagsForEye(state.currentRefraction, eyeType);
        applyStructuralEyeState({
          eye,
          eyeType,
          flags: eyeFlags,
          isActiveEye: true,
          sceneRefraction: state.currentRefraction,
        });
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
        const pupilCentre = getPupilCentreInWrapper3(pupil, wrapperRect);
        const totalEyeOffsetX =
          (((_a3 = iris == null ? void 0 : iris.nystagmusOffset) == null
            ? void 0
            : _a3.x) || 0) +
          (((_b = iris == null ? void 0 : iris.microOffset) == null
            ? void 0
            : _b.x) || 0) +
          (((_c = iris == null ? void 0 : iris.backgroundOffset) == null
            ? void 0
            : _c.x) || 0);
        const totalEyeOffsetY =
          (((_d = iris == null ? void 0 : iris.nystagmusOffset) == null
            ? void 0
            : _d.y) || 0) +
          (((_e = iris == null ? void 0 : iris.microOffset) == null
            ? void 0
            : _e.y) || 0) +
          (((_f = iris == null ? void 0 : iris.backgroundOffset) == null
            ? void 0
            : _f.y) || 0);
        const reflexCompX = state.nystagmusLevel > 0 ? totalEyeOffsetX : 0;
        const reflexCompY = state.nystagmusLevel > 0 ? totalEyeOffsetY : 0;
        const beamOffsetX =
          beamCentre && pupilCentre
            ? beamCentre.x - pupilCentre.x
            : state.retStreakOffset - reflexCompX;
        const beamOffsetY =
          beamCentre && pupilCentre
            ? beamCentre.y - pupilCentre.y
            : -reflexCompY;
        if (pupil) {
          const alignmentBoostWeight = getAlignmentDeviationBoostWeight({
            eyeType,
            iris,
            pupilRadiusPx,
          });
          const gazeFixationResponse = getGazeFixationResponse(iris);
          const effectiveFillFactor =
            applyAlignmentDeviationBoost(
              getManualDragFillFactor(eye),
              alignmentBoostWeight,
            ) * gazeFixationResponse.fillFactor;
          pupil.style.background = getBasePupilFill(
            eye,
            eyeFlags,
            effectiveFillFactor,
          );
        }
        updateLightResponsivePupilScale({
          eye,
          flags: eyeFlags,
          isActiveEye: true,
          pupilRadiusPx,
          sweepX: beamOffsetX,
          sweepY: beamOffsetY,
        });
        updateCornealReflexState2({
          beamCentre,
          eye,
          eyeType,
          lightOffsetX: state.retStreakOffset + lightJitter.x,
          lightOffsetY: (state.retStreakOffsetY || 0) + lightJitter.y,
          pupilRadiusPx,
          sweepX: beamOffsetX,
          sweepY: beamOffsetY,
          wrapperRect,
        });
        updateCentralMediaMask({
          maskElement: centralSubcorticalMask,
          flags: eyeFlags,
          isActiveEye: true,
        });
        updateCorticalCataractMask2({
          maskElement: corticalCataractMask,
          isActiveEye: true,
          flags: eyeFlags,
          eyeType,
        });
        updatePathologyOverlay2({
          flags: eyeFlags,
          isActiveEye: true,
          overlayElement: pathologyOverlay,
          pupilRadiusPx,
          sweepX: beamOffsetX,
          sweepY: beamOffsetY,
          timeSec,
        });
        updateActiveEyeReflex({
          activeRefraction,
          beamCentre,
          beamOffsetX,
          beamOffsetY,
          cataractVisual,
          eye,
          eyeType,
          flags: eyeFlags,
          iris,
          pupilRadiusPx,
          reflex,
          reflexCompX,
          reflexCompY,
          timeSec,
          wrapperRect,
        });
      });
    }
    function updateRetinoscopy({ includePosition = true } = {}) {
      if (includePosition) {
        updateRetStreakPosition2();
      }
      updateRetStreakTransform2();
      updateRetReflex();
    }
    function renderNow(includePosition = false) {
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
    function setRetStreakOffset(
      value,
      verticalValue = state.retStreakOffsetY || 0,
    ) {
      state.retStreakOffset = clampRetStreakOffset2(value);
      state.retStreakOffsetY = clampRetStreakOffsetY2(verticalValue);
      if (state.lightHoldActive) {
        startLightJitterLoop();
      }
      scheduleRetinoscopy(false);
    }
    function startLightJitterLoop() {
      if (state.lightJitterRafId) {
        return;
      }
      const loop = () => {
        const isOffCentre =
          Math.hypot(state.retStreakOffset || 0, state.retStreakOffsetY || 0) >=
          LIGHT_JITTER_MIN_OFFSET_PX;
        if (!state.lightHoldActive || !isOffCentre) {
          state.lightJitterRafId = 0;
          scheduleRetinoscopy(false);
          return;
        }
        updateRetinoscopy({ includePosition: false });
        state.lightJitterRafId = requestAnimationFrame(loop);
      };
      state.lightJitterRafId = requestAnimationFrame(loop);
    }
    function setLightHoldActive(isActive) {
      state.lightHoldActive = Boolean(isActive);
      if (state.lightHoldActive) {
        startLightJitterLoop();
        return;
      }
      if (state.lightJitterRafId) {
        cancelAnimationFrame(state.lightJitterRafId);
        state.lightJitterRafId = 0;
      }
      scheduleRetinoscopy(false);
    }
    function setRefraction(value) {
      if (!REFRACTION_VALUE_SET.has(value)) {
        return;
      }
      state.currentRefraction = value;
      state.corticalCataractPattern =
        createCorticalPatternStateForRefraction2(value);
      state.cylinderAxisDeg = null;
      state.retStreakOffset = 0;
      state.retStreakOffsetY = 0;
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
      getRetStreakOffsetBounds: getRetStreakOffsetBounds2,
      getRetStreakOffsetYBounds: getRetStreakOffsetYBounds2,
      renderNow,
      scheduleRetinoscopy,
      setLightHoldActive,
      setRetStreakOffset,
      setRefraction,
      setCataractLevel,
    };
  }

  // src/state.js?v=20260430-2
  function createAppState() {
    return {
      baseReflexColor: { ...DEFAULT_BASE_REFLEX_COLOR },
      irisColour: "dark-brown",
      isBabyMode: false,
      isDilatedMode: false,
      isLiveMotionEnabled: false,
      ...DEFAULT_RETINOSCOPY_STATE,
      retinoscopyRafId: 0,
      retinoscopyNeedsPosition: true,
      lightHoldActive: false,
      lightJitterRafId: 0,
      lastBlinkAtMs: 0,
      activeMcqLevel: "primary",
      activeMcqQuestions: [],
      corticalCataractPattern: null,
      microSaccadeIntervalId: 0,
      backgroundJitterIntervalId: 0,
      blinkIntervalId: 0,
      gazeShiftTimerId: 0,
      nystagmusRafId: 0,
      isManualEyeMoveEnabled: false,
      isTestMode: false,
      isTestRevealed: false,
      contextGlareOn: false,
      contextOnsetMode: "gradual",
      testCountdown: 0,
      testTimerId: 0,
      testConditionValue: null,
      testRevealLabel: "",
      testPreviousState: null,
      testLastRefraction: null,
      testRoundIndex: 0,
    };
  }

  // src/streak-controls.js?v=20260430-1
  function clamp2(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  function createStreakControlsController({
    state,
    dom,
    onLargeLightMove,
    retinoscopyController,
  }) {
    const { retStreak } = dom;
    const DEFAULT_SWEEP_LIMIT = 100;
    const DEFAULT_VERTICAL_SWEEP_LIMIT = 18;
    const SNAP_BACK_DURATION_MS = 130;
    const SWEEP_PIXELS_PER_UNIT = 2;
    let snapTimerId = 0;
    let hasDismissedHint = false;
    let lastLightBlinkAtMs = 0;
    function getBeamElements() {
      return [retStreak, document.getElementById("ret-streak-visual")].filter(
        Boolean,
      );
    }
    function disableSnapBack() {
      if (snapTimerId) {
        window.clearTimeout(snapTimerId);
        snapTimerId = 0;
      }
      getBeamElements().forEach((element) => {
        element.classList.remove("is-snapping");
      });
    }
    function enableSnapBack() {
      disableSnapBack();
      getBeamElements().forEach((element) => {
        element.classList.add("is-snapping");
      });
      snapTimerId = window.setTimeout(() => {
        getBeamElements().forEach((element) => {
          element.classList.remove("is-snapping");
        });
        snapTimerId = 0;
      }, SNAP_BACK_DURATION_MS + 40);
    }
    function hideHint() {
      if (!retStreak) {
        return;
      }
      hasDismissedHint = true;
      retStreak.classList.remove("is-hint-visible");
    }
    function showHint() {
      if (!retStreak || hasDismissedHint) {
        return;
      }
      retStreak.classList.add("is-hint-visible");
    }
    function getSweepBounds() {
      var _a2, _b;
      const boundsX =
        (_a2 = retinoscopyController.getRetStreakOffsetBounds) == null
          ? void 0
          : _a2.call(retinoscopyController);
      const boundsY =
        (_b = retinoscopyController.getRetStreakOffsetYBounds) == null
          ? void 0
          : _b.call(retinoscopyController);
      return {
        minX: Number.isFinite(boundsX == null ? void 0 : boundsX.min)
          ? boundsX.min
          : -DEFAULT_SWEEP_LIMIT,
        maxX: Number.isFinite(boundsX == null ? void 0 : boundsX.max)
          ? boundsX.max
          : DEFAULT_SWEEP_LIMIT,
        minY: Number.isFinite(boundsY == null ? void 0 : boundsY.min)
          ? boundsY.min
          : -DEFAULT_VERTICAL_SWEEP_LIMIT,
        maxY: Number.isFinite(boundsY == null ? void 0 : boundsY.max)
          ? boundsY.max
          : DEFAULT_VERTICAL_SWEEP_LIMIT,
      };
    }
    function bindPointerDrag(
      handle,
      { getValue, getBounds, pixelsPerUnit, setValue },
    ) {
      if (!handle) {
        return;
      }
      let activePointerId = null;
      let startX = 0;
      let startY = 0;
      let startValueX = 0;
      let startValueY = 0;
      let hasDragged = false;
      function resetToCentre() {
        const { x, y } = getValue();
        if (x !== 0 || y !== 0) {
          enableSnapBack();
          setValue(0, 0);
        }
      }
      function endDrag(event) {
        var _a2;
        if (activePointerId === null) {
          return;
        }
        if (event && event.pointerId !== activePointerId) {
          return;
        }
        activePointerId = null;
        (_a2 = retinoscopyController.setLightHoldActive) == null
          ? void 0
          : _a2.call(retinoscopyController, false);
        resetToCentre();
      }
      handle.addEventListener("pointerdown", (event) => {
        var _a2, _b;
        if (event.button !== void 0 && event.button !== 0) {
          return;
        }
        disableSnapBack();
        (_a2 = retinoscopyController.setLightHoldActive) == null
          ? void 0
          : _a2.call(retinoscopyController, true);
        activePointerId = event.pointerId;
        startX = event.clientX;
        startY = event.clientY;
        const startValue = getValue();
        startValueX = startValue.x || 0;
        startValueY = startValue.y || 0;
        hasDragged = false;
        (_b = handle.setPointerCapture) == null
          ? void 0
          : _b.call(handle, event.pointerId);
        event.preventDefault();
      });
      handle.addEventListener("pointermove", (event) => {
        if (event.pointerId !== activePointerId) {
          return;
        }
        const { minX, maxX, minY, maxY } = getBounds();
        const nextValueX = clamp2(
          startValueX + (event.clientX - startX) / pixelsPerUnit,
          minX,
          maxX,
        );
        const nextValueY = clamp2(
          startValueY + (event.clientY - startY) / pixelsPerUnit,
          minY,
          maxY,
        );
        const roundedValueX = Math.round(nextValueX);
        const roundedValueY = Math.round(nextValueY);
        const dragDistance = Math.hypot(
          roundedValueX - startValueX,
          roundedValueY - startValueY,
        );
        const nowMs = performance.now();
        if (
          dragDistance > 28 &&
          nowMs - lastLightBlinkAtMs > 2400 &&
          typeof onLargeLightMove === "function"
        ) {
          lastLightBlinkAtMs = nowMs;
          onLargeLightMove();
        }
        if (
          !hasDragged &&
          (roundedValueX !== startValueX || roundedValueY !== startValueY)
        ) {
          hasDragged = true;
          hideHint();
        }
        setValue(roundedValueX, roundedValueY);
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
          event.key !== "ArrowUp" &&
          event.key !== "ArrowDown" &&
          event.key !== "Home" &&
          event.key !== "End"
        ) {
          return;
        }
        event.preventDefault();
        const didMove = setNextValue(event.key, step);
        if (didMove) {
          hideHint();
        }
      });
    }
    function init() {
      if (!retStreak) {
        return;
      }
      const dragHandle =
        retStreak.querySelector(".fundal-light-probe__handle") || retStreak;
      bindPointerDrag(dragHandle, {
        getValue: () => ({
          x: state.retStreakOffset || 0,
          y: state.retStreakOffsetY || 0,
        }),
        getBounds: getSweepBounds,
        pixelsPerUnit: SWEEP_PIXELS_PER_UNIT,
        setValue: (xValue, yValue) =>
          retinoscopyController.setRetStreakOffset(xValue, yValue),
      });
      bindKeyboard(retStreak, {
        step: 5,
        setNextValue: (key, step) => {
          const { minX, maxX, minY, maxY } = getSweepBounds();
          if (key === "Home") {
            if (state.retStreakOffset === 0 && state.retStreakOffsetY === 0) {
              return false;
            }
            retinoscopyController.setRetStreakOffset(0, 0);
            return true;
          }
          if (key === "End") {
            if (
              state.retStreakOffset === maxX &&
              state.retStreakOffsetY === 0
            ) {
              return false;
            }
            retinoscopyController.setRetStreakOffset(maxX, 0);
            return true;
          }
          const deltaX =
            key === "ArrowLeft" ? -step : key === "ArrowRight" ? step : 0;
          const deltaY =
            key === "ArrowUp" ? -step : key === "ArrowDown" ? step : 0;
          const currentValueX = state.retStreakOffset || 0;
          const nextValueX = clamp2(currentValueX + deltaX, minX, maxX);
          const currentValueY = state.retStreakOffsetY || 0;
          const nextValueY = clamp2(currentValueY + deltaY, minY, maxY);
          if (nextValueX === currentValueX && nextValueY === currentValueY) {
            return false;
          }
          retinoscopyController.setRetStreakOffset(nextValueX, nextValueY);
          return true;
        },
      });
      showHint();
    }
    return {
      hideHint,
      init,
    };
  }

  // src/test-mode.js?v=20260430-1
  function dispatchInput(element) {
    if (!element) {
      return;
    }
    element.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function dispatchChange(element) {
    if (!element) {
      return;
    }
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }
  function sampleRandomCondition(lastValue) {
    const candidates =
      TEST_REFRACTION_OPTIONS.length > 1
        ? TEST_REFRACTION_OPTIONS.filter((option) => option.value !== lastValue)
        : TEST_REFRACTION_OPTIONS;
    const pool = candidates.length ? candidates : TEST_REFRACTION_OPTIONS;
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
    eyesController,
    retinoscopyController,
    setConditionContext,
    onTestStateChange,
  }) {
    const {
      sideMenu,
      testModeButton,
      testStatusBanner,
      testCountdownValue,
      testAnswerText,
      testClueText,
      testNextButton,
      reflexColorSlider,
      modifierContextBar,
      liveToggle,
      babyToggle,
      dilatedToggle,
      irisColourSelect,
      manualEyeMoveToggle,
      refractionShell,
      refractionMaskLabel,
      refractionStateSelect,
      visualCaseTrigger,
      casePrevButton,
      caseNextButton,
      cataractSlider,
      nystagmusToggle,
      nystagmusDirectionSelect,
      nystagmusWaveSelect,
      nystagmusRateSelect,
      pupilSizeSliders,
      eyelidSliders,
    } = dom;
    const lockableControls = [
      reflexColorSlider,
      liveToggle,
      babyToggle,
      dilatedToggle,
      irisColourSelect,
      manualEyeMoveToggle,
      refractionStateSelect,
      visualCaseTrigger,
      casePrevButton,
      caseNextButton,
      cataractSlider,
      nystagmusToggle,
      nystagmusDirectionSelect,
      nystagmusWaveSelect,
      nystagmusRateSelect,
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
    function setSideMenuOpen2(isOpen) {
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
      testModeButton.textContent = state.isTestMode ? "stop test" : "test me";
    }
    function setRefractionMask(isMasked) {
      if (!refractionShell || !refractionMaskLabel || !refractionStateSelect) {
        return;
      }
      refractionShell.classList.toggle("is-masked", isMasked);
      refractionMaskLabel.textContent = isMasked ? "Condition hidden" : "";
    }
    function setObservationLock(isLocked) {
      lockableControls.forEach((control) => {
        control.disabled = isLocked;
      });
      modifierContextBar == null
        ? void 0
        : modifierContextBar.querySelectorAll("input").forEach((control) => {
            control.disabled = isLocked;
          });
    }
    function renderBanner() {
      if (!testStatusBanner || !testCountdownValue || !testAnswerText) {
        return;
      }
      testStatusBanner.hidden = !state.isTestMode;
      if (!state.isTestMode) {
        if (testClueText) {
          testClueText.hidden = true;
          testClueText.textContent = "";
        }
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
      if (testClueText) {
        testClueText.hidden = true;
        testClueText.textContent = "";
      }
      if (testNextButton) {
        testNextButton.hidden = true;
      }
    }
    function captureSnapshot() {
      var _a2, _b, _c, _d, _e;
      return {
        corticalCataractPattern: state.corticalCataractPattern
          ? JSON.parse(JSON.stringify(state.corticalCataractPattern))
          : null,
        currentRefraction: state.currentRefraction,
        cylinderAxisDeg: state.cylinderAxisDeg,
        retStreakOffset: state.retStreakOffset,
        retStreakOffsetY: state.retStreakOffsetY,
        reflexColorValue:
          (_a2 =
            reflexColorSlider == null ? void 0 : reflexColorSlider.value) !=
          null
            ? _a2
            : "",
        cataractValue:
          (_b = cataractSlider == null ? void 0 : cataractSlider.value) != null
            ? _b
            : "",
        nystagmusEnabled: Boolean(
          nystagmusToggle == null ? void 0 : nystagmusToggle.checked,
        ),
        nystagmusDirectionValue:
          (_c =
            nystagmusDirectionSelect == null
              ? void 0
              : nystagmusDirectionSelect.value) != null
            ? _c
            : "",
        nystagmusWaveValue:
          (_d =
            nystagmusWaveSelect == null ? void 0 : nystagmusWaveSelect.value) !=
          null
            ? _d
            : "",
        nystagmusRateValue:
          (_e =
            nystagmusRateSelect == null ? void 0 : nystagmusRateSelect.value) !=
          null
            ? _e
            : "",
        pupilValues: pupilSizeSliders.map((slider) => slider.value),
        eyelidValues: eyelidSliders.map((slider) => slider.value),
      };
    }
    function restoreSnapshot() {
      var _a2;
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
      if (nystagmusDirectionSelect && snapshot.nystagmusDirectionValue !== "") {
        nystagmusDirectionSelect.value = snapshot.nystagmusDirectionValue;
      }
      if (nystagmusWaveSelect && snapshot.nystagmusWaveValue !== "") {
        nystagmusWaveSelect.value = snapshot.nystagmusWaveValue;
      }
      if (nystagmusRateSelect && snapshot.nystagmusRateValue !== "") {
        nystagmusRateSelect.value = snapshot.nystagmusRateValue;
      }
      if (nystagmusToggle) {
        nystagmusToggle.checked = Boolean(snapshot.nystagmusEnabled);
        dispatchChange(nystagmusToggle);
      }
      if (nystagmusDirectionSelect && snapshot.nystagmusDirectionValue !== "") {
        dispatchChange(nystagmusDirectionSelect);
      }
      if (nystagmusWaveSelect && snapshot.nystagmusWaveValue !== "") {
        dispatchChange(nystagmusWaveSelect);
      }
      if (nystagmusRateSelect && snapshot.nystagmusRateValue !== "") {
        dispatchChange(nystagmusRateSelect);
      }
      retinoscopyController.setRefraction(snapshot.currentRefraction);
      if (typeof setConditionContext === "function") {
        setConditionContext(snapshot.currentRefraction);
      }
      eyesController.syncRefractionPose();
      state.cylinderAxisDeg = snapshot.cylinderAxisDeg;
      state.corticalCataractPattern = snapshot.corticalCataractPattern
        ? JSON.parse(JSON.stringify(snapshot.corticalCataractPattern))
        : null;
      if (refractionStateSelect) {
        refractionStateSelect.value = snapshot.currentRefraction;
        dispatchChange(refractionStateSelect);
      }
      retinoscopyController.setRetStreakOffset(
        snapshot.retStreakOffset,
        (_a2 = snapshot.retStreakOffsetY) != null ? _a2 : 0,
      );
    }
    function buildRevealLabel(option) {
      if (typeof state.cylinderAxisDeg === "number") {
        if (
          option.value === "low-cylinder" ||
          option.value === "high-cylinder"
        ) {
          return `Answer: ${option.label}, - cyl axis ${state.cylinderAxisDeg} deg`;
        }
        return `Answer: ${option.label}, axis ${state.cylinderAxisDeg} deg`;
      }
      return `Answer: ${option.label}`;
    }
    function revealAnswer() {
      clearTestTimer();
      state.isTestRevealed = true;
      state.testCountdown = 0;
      setRefractionMask(false);
      renderBanner();
      if (typeof onTestStateChange === "function") {
        onTestStateChange();
      }
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
      retinoscopyController.setRefraction(nextCondition.value);
      if (typeof setConditionContext === "function") {
        setConditionContext(nextCondition.value);
      }
      eyesController.syncRefractionPose();
      if (refractionStateSelect) {
        refractionStateSelect.value = nextCondition.value;
        dispatchChange(refractionStateSelect);
      }
      setObservationLock(true);
      state.testRevealLabel = buildRevealLabel(nextCondition);
      renderBanner();
      setTestTriggerLabel();
      setSideMenuOpen2(false);
      if (typeof onTestStateChange === "function") {
        onTestStateChange();
      }
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
      if (
        typeof setConditionContext === "function" &&
        state.currentRefraction
      ) {
        setConditionContext(state.currentRefraction);
      }
      renderBanner();
      setTestTriggerLabel();
      setSideMenuOpen2(false);
      if (typeof onTestStateChange === "function") {
        onTestStateChange();
      }
    }
    function handleTestRequest() {
      if (state.isTestMode) {
        closeTestMode();
        return;
      }
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

  // src/app.js?v=20260821-1
  var CASE_NYSTAGMUS_SETTINGS = {
    "bilateral-aniridia": {
      direction: "horizontal",
      level: 46,
      rate: "slow",
      wave: "pendular",
    },
  };
  var _a;
  var PRIMARY_CASE_VALUE_SET = new Set(
    ((_a = CASE_LEVELS.find((level) => level.value === "primary")) == null
      ? void 0
      : _a.values) || [],
  );
  function populateRefractionOptions(selectElement) {
    if (!selectElement) {
      return;
    }
    selectElement.replaceChildren();
    REFRACTION_GROUPS.forEach((group) => {
      var _a2;
      if (group.separator) {
        const separatorOption = document.createElement("option");
        separatorOption.value = "";
        separatorOption.textContent = "--------------";
        separatorOption.disabled = true;
        separatorOption.dataset.cat = "separator";
        selectElement.appendChild(separatorOption);
        return;
      }
      if (!((_a2 = group.options) == null ? void 0 : _a2.length)) {
        return;
      }
      const optionParent = group.label
        ? document.createElement("optgroup")
        : document.createDocumentFragment();
      if ("label" in optionParent) {
        optionParent.label = group.label;
      }
      group.options.forEach((optionConfig) => {
        const option = document.createElement("option");
        option.value = optionConfig.value;
        option.textContent = optionConfig.label;
        option.dataset.cat = group.category;
        option.selected = optionConfig.value === DEFAULT_REFRACTION_VALUE;
        optionParent.appendChild(option);
      });
      selectElement.appendChild(optionParent);
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
    retinoscopyController.scheduleRetinoscopy(true);
  }
  function initApp() {
    const dom = getDomRefs();
    const state = createAppState();
    const conditionContextController = createConditionContextController({
      container: dom.modifierContextBar,
      state,
      onChange: () => renderInterpretationUi(),
    });
    function revealInitialControls() {
      var _a2;
      if (dom.controlsDeck) {
        dom.controlsDeck.hidden = false;
      }
      if (dom.retStreakVisual) {
        dom.retStreakVisual.hidden = false;
      }
      if (dom.retStreak) {
        dom.retStreak.hidden = false;
      }
      (_a2 = dom.body) == null ? void 0 : _a2.classList.add("app-ready");
    }
    function renderResults() {
      if (!dom.resultsSummary || !dom.resultsSite || !dom.resultsUrgency) {
        return;
      }
      const interpretation = buildClinicalInterpretation({
        caseValue: state.currentRefraction,
        isBabyMode: state.isBabyMode,
        onsetMode: state.contextOnsetMode,
        glareOn: state.contextGlareOn,
        isTestMode: state.isTestMode,
        isTestRevealed: state.isTestRevealed,
      });
      dom.resultsSummary.textContent = interpretation.likely;
      dom.resultsSite.textContent = interpretation.site;
      dom.resultsUrgency.textContent = interpretation.referral;
      dom.resultsUrgency.dataset.tone = interpretation.tone;
    }
    function renderResultsWhy() {
      if (!dom.resultsWhy) {
        return;
      }
      if (state.isTestMode && !state.isTestRevealed) {
        dom.resultsWhy.textContent = "Why: hidden during test mode";
        return;
      }
      const teaching = getCaseTeachingMetadata(state.currentRefraction);
      dom.resultsWhy.textContent = `Why: ${teaching.why}`;
    }
    function renderTestRevealClue() {
      if (!dom.testClueText) {
        return;
      }
      if (!state.isTestMode || !state.isTestRevealed) {
        dom.testClueText.hidden = true;
        dom.testClueText.textContent = "";
        return;
      }
      const caseValue = state.testConditionValue || state.currentRefraction;
      const teaching = getCaseTeachingMetadata(caseValue);
      dom.testClueText.textContent = `Key clue: ${teaching.keyClue}`;
      dom.testClueText.hidden = false;
    }
    function renderInterpretationUi() {
      renderResults();
      renderResultsWhy();
      renderTestRevealClue();
    }
    function initAdvancedDock() {
      if (!dom.advancedDockToggle || !dom.advancedPanel) {
        return;
      }
      const syncAdvancedDock = (isOpen) => {
        dom.advancedPanel.hidden = !isOpen;
        dom.advancedDockToggle.classList.toggle("is-open", isOpen);
        dom.advancedDockToggle.setAttribute(
          "aria-expanded",
          isOpen ? "true" : "false",
        );
        const label = isOpen
          ? "Close advanced controls"
          : "Open advanced controls";
        dom.advancedDockToggle.setAttribute("aria-label", label);
        dom.advancedDockToggle.title = label;
      };
      syncAdvancedDock(false);
      dom.advancedDockToggle.addEventListener("click", () => {
        syncAdvancedDock(dom.advancedPanel.hidden);
      });
    }
    populateRefractionOptions(dom.refractionStateSelect);
    if (dom.refractionStateSelect) {
      dom.refractionStateSelect.value = state.currentRefraction;
    }
    conditionContextController.applyDefaults(state.currentRefraction);
    conditionContextController.render();
    renderInterpretationUi();
    const retinoscopyController = createRetinoscopyController({ state, dom });
    const streakControlsController = createStreakControlsController({
      state,
      dom,
      onLargeLightMove: () => {
        var _a2;
        return (_a2 =
          eyesController == null ? void 0 : eyesController.blinkOnce) == null
          ? void 0
          : _a2.call(eyesController);
      },
      retinoscopyController,
    });
    const eyesController = createEyesController({
      state,
      dom,
      onEyeGeometryChange: ({
        includePosition = true,
        immediate = false,
      } = {}) => {
        if (immediate) {
          retinoscopyController.renderNow(includePosition);
          return;
        }
        retinoscopyController.scheduleRetinoscopy(includePosition);
      },
    });
    const observationGuideController = createObservationGuideController({
      dom,
      state,
      isPrimaryCase: (caseValue) => PRIMARY_CASE_VALUE_SET.has(caseValue),
    });
    const testModeController = createTestModeController({
      state,
      dom,
      eyesController,
      retinoscopyController,
      setConditionContext: (conditionValue) => {
        conditionContextController.applyDefaults(conditionValue);
        conditionContextController.render();
        renderInterpretationUi();
        observationGuideController == null
          ? void 0
          : observationGuideController.syncForCurrentCase();
      },
      onTestStateChange: () => {
        renderInterpretationUi();
        observationGuideController == null
          ? void 0
          : observationGuideController.syncForCurrentCase();
      },
    });
    eyesController.init();
    const infoModalController = initInfoModal(dom);
    streakControlsController.init();
    testModeController.init();
    initAdvancedDock();
    conditionContextController.init();
    observationGuideController == null
      ? void 0
      : observationGuideController.init();
    initMenuMcq({
      state,
      dom,
      onBeforeOpenMcq: () => testModeController.closeTestMode(),
    });
    const caseMenuController = initVisualCaseMenu({
      state,
      dom,
      onBeforeSelectCase: () => testModeController.closeTestMode(),
    });
    initLearnModal({
      dom,
      onBeforeOpen: () => {
        var _a2;
        return (_a2 =
          infoModalController == null ? void 0 : infoModalController.close) ==
          null
          ? void 0
          : _a2.call(infoModalController, { restoreFocus: false });
      },
      onSelectCase: (caseValue) =>
        caseMenuController == null
          ? void 0
          : caseMenuController.selectCase(caseValue),
    });
    if (dom.reflexColorSlider) {
      dom.reflexColorSlider.addEventListener("input", (event) => {
        const sliderValue = parseInt(event.target.value, 10);
        const newColor = getReflexColor(sliderValue);
        eyesController.applyReflexColor(newColor);
        state.baseReflexColor = parseRGB(newColor);
      });
      dom.reflexColorSlider.dispatchEvent(new Event("input"));
    }
    if (dom.babyToggle) {
      dom.babyToggle.checked = state.isBabyMode;
      dom.babyToggle.addEventListener("change", (event) => {
        eyesController.setBabyMode(event.target.checked);
        caseMenuController == null ? void 0 : caseMenuController.setBabyMode();
        renderInterpretationUi();
      });
      eyesController.setBabyMode(state.isBabyMode);
      caseMenuController == null ? void 0 : caseMenuController.setBabyMode();
    }
    if (dom.dilatedToggle) {
      dom.dilatedToggle.checked = state.isDilatedMode;
      dom.dilatedToggle.addEventListener("change", (event) => {
        eyesController.setDilatedMode(event.target.checked);
      });
      eyesController.setDilatedMode(state.isDilatedMode);
    }
    if (dom.liveToggle) {
      dom.liveToggle.checked = state.isLiveMotionEnabled;
      dom.liveToggle.addEventListener("change", (event) => {
        eyesController.setLiveMotionEnabled(event.target.checked);
        syncNystagmusControls();
      });
      eyesController.setLiveMotionEnabled(state.isLiveMotionEnabled);
    }
    if (dom.irisColourSelect) {
      dom.irisColourSelect.value = state.irisColour;
      dom.irisColourSelect.addEventListener("change", (event) => {
        eyesController.setIrisColour(event.target.value);
      });
      eyesController.setIrisColour(state.irisColour);
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
        retinoscopyController.setRefraction(event.target.value);
        conditionContextController.applyDefaults(event.target.value);
        conditionContextController.render();
        renderInterpretationUi();
        observationGuideController == null
          ? void 0
          : observationGuideController.syncForCurrentCase();
        eyesController.syncRefractionPose();
        syncNystagmusControls();
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
    let isManualNystagmusEnabled = state.nystagmusLevel > 0;
    const getActiveCaseNystagmusSettings = () =>
      CASE_NYSTAGMUS_SETTINGS[state.currentRefraction] || null;
    const syncNystagmusConfig = () => {
      var _a2, _b, _c;
      eyesController.setNystagmusConfig({
        direction:
          ((_a2 = dom.nystagmusDirectionSelect) == null ? void 0 : _a2.value) ||
          state.nystagmusDirection,
        wave:
          ((_b = dom.nystagmusWaveSelect) == null ? void 0 : _b.value) ||
          state.nystagmusWave,
        rate:
          ((_c = dom.nystagmusRateSelect) == null ? void 0 : _c.value) ||
          state.nystagmusRate,
      });
    };
    const syncNystagmusControls = () => {
      const caseSettings = getActiveCaseNystagmusSettings();
      const isAutoCaseEnabled =
        Boolean(caseSettings) && !isManualNystagmusEnabled;
      if (isAutoCaseEnabled) {
        eyesController.setNystagmusConfig(caseSettings);
        eyesController.setNystagmusLevel(caseSettings.level);
      } else {
        eyesController.setNystagmusEnabled(isManualNystagmusEnabled);
        syncNystagmusConfig();
      }
      [
        dom.nystagmusDirectionSelect,
        dom.nystagmusWaveSelect,
        dom.nystagmusRateSelect,
      ].forEach((control) => {
        if (control) {
          control.disabled = !isManualNystagmusEnabled;
        }
      });
    };
    if (dom.nystagmusToggle) {
      dom.nystagmusToggle.checked = state.nystagmusLevel > 0;
      isManualNystagmusEnabled = dom.nystagmusToggle.checked;
      dom.nystagmusToggle.addEventListener("change", () => {
        isManualNystagmusEnabled = dom.nystagmusToggle.checked;
        syncNystagmusControls();
      });
    }
    if (dom.nystagmusDirectionSelect) {
      dom.nystagmusDirectionSelect.value = state.nystagmusDirection;
      dom.nystagmusDirectionSelect.addEventListener(
        "change",
        syncNystagmusConfig,
      );
    }
    if (dom.nystagmusWaveSelect) {
      dom.nystagmusWaveSelect.value = state.nystagmusWave;
      dom.nystagmusWaveSelect.addEventListener("change", syncNystagmusConfig);
    }
    if (dom.nystagmusRateSelect) {
      dom.nystagmusRateSelect.value = state.nystagmusRate;
      dom.nystagmusRateSelect.addEventListener("change", syncNystagmusConfig);
    }
    syncNystagmusControls();
    runStartupEyeAnimation({ dom, eyesController, retinoscopyController });
    retinoscopyController.renderNow(true);
    revealInitialControls();
    const isShortcutTargetEditable = () => {
      const activeElement = document.activeElement;
      if (!(activeElement instanceof HTMLElement)) {
        return false;
      }
      if (activeElement.isContentEditable) {
        return true;
      }
      const tagName = activeElement.tagName;
      return (
        tagName === "INPUT" || tagName === "SELECT" || tagName === "TEXTAREA"
      );
    };
    const isAnyModalOpen = () => {
      var _a2, _b, _c, _d, _e;
      return (
        ((_a2 = dom.infoModal) == null
          ? void 0
          : _a2.getAttribute("aria-hidden")) === "false" ||
        ((_b = dom.mcqModal) == null
          ? void 0
          : _b.getAttribute("aria-hidden")) === "false" ||
        ((_c = dom.learnModal) == null
          ? void 0
          : _c.getAttribute("aria-hidden")) === "false" ||
        ((_d = dom.visualCaseModal) == null
          ? void 0
          : _d.getAttribute("aria-hidden")) === "false" ||
        ((_e = dom.visualCasePhotoModal) == null
          ? void 0
          : _e.getAttribute("aria-hidden")) === "false"
      );
    };
    window.addEventListener("keydown", (event) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      ) {
        return;
      }
      if (state.isTestMode || isAnyModalOpen() || isShortcutTargetEditable()) {
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        caseMenuController == null
          ? void 0
          : caseMenuController.selectAdjacentCase(-1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        caseMenuController == null
          ? void 0
          : caseMenuController.selectAdjacentCase(1);
        return;
      }
      if (event.key.toLowerCase() === "c") {
        event.preventDefault();
        caseMenuController == null
          ? void 0
          : caseMenuController.openCasePicker();
        return;
      }
    });
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
