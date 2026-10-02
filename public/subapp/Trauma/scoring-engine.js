(function exposeTraumaScoring(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.TraumaScoring = api;
})(
  typeof globalThis !== "undefined" ? globalThis : this,
  function createTraumaScoring() {
    const VISUAL_SYSTEM = "Metric (6/6)";
    const acuityMap = {
      [VISUAL_SYSTEM]: [
        { name: "NPL", value: 60, tableValues: [73, 17, 7, 2, 1] },
        { name: "PL or HM", value: 70, tableValues: [28, 26, 18, 13, 15] },
        {
          name: "0.3/60 to <6/60",
          value: 80,
          tableValues: [2, 11, 15, 28, 44],
        },
        { name: "6/60 to 6/15", value: 90, tableValues: [1, 2, 2, 21, 74] },
        { name: "≥ 6/12", value: 100, tableValues: [0, 1, 2, 5, 92] },
      ],
    };
    const optionalFields = [
      {
        letter: "B",
        value: -23,
        name: "Globe Rupture",
        photoUrl: "assets/images/globe.webp",
        description:
          "A full-thickness eyewall wound caused by blunt trauma, from inside out. Urgent surgery is required.",
      },
      {
        letter: "C",
        value: -17,
        name: "Endophthalmitis",
        photoUrl: "assets/images/hypo.webp",
        description:
          "Endophthalmitis is a severe intraocular infection after surgery or injury. Urgent treatment is needed to preserve sight.",
      },
      {
        letter: "D",
        value: -14,
        name: "Perforating Injury",
        photoUrl: "assets/images/hook.webp",
        description:
          "A perforating injury has both entrance and exit wounds and can be missed if small.",
      },
      {
        letter: "E",
        value: -11,
        name: "Retinal Detachment",
        photoUrl: "assets/images/retd.webp",
        description:
          "Retinal detachment occurs when neuroretina separates from the retinal pigment epithelium. Urgent surgery is usually required.",
      },
      {
        letter: "F",
        value: -10,
        name: "RAPD",
        photoUrl: "assets/images/rapd.webp",
        description:
          "Relative afferent pupillary defect indicates reduced afferent response in the affected eye.",
      },
    ];
    const CATEGORY_BANDS = [
      { max: 44, category: 1, rule: "Score ≤ 44" },
      { max: 65, category: 2, rule: "45-65" },
      { max: 80, category: 3, rule: "66-80" },
      { max: 91, category: 4, rule: "81-91" },
      { max: Number.POSITIVE_INFINITY, category: 5, rule: "≥ 92" },
    ];
    const OUTCOME_LABELS = [
      "NPL",
      "PL or HM",
      "0.3/60 to <6/60",
      "6/60 to 6/15",
      "≥ 6/12",
    ];
    const CATEGORY_DESCRIPTIONS = [
      {
        category: 1,
        text: "Very poor prognosis. Severe visual loss is most likely.",
      },
      {
        category: 2,
        text: "Poor prognosis. Significant long-term vision limitation is likely.",
      },
      {
        category: 3,
        text: "Guarded prognosis. Outcomes are mixed and uncertain.",
      },
      {
        category: 4,
        text: "Fair prognosis. Useful vision is achievable in many cases.",
      },
      {
        category: 5,
        text: "Good prognosis. Better functional vision is most likely.",
      },
    ];
    function getCategoryInfo(finalScore) {
      return CATEGORY_BANDS.find((band) => finalScore <= band.max);
    }
    function calculateScore(acuityIndex, selectedPenaltyIndexes = []) {
      const acuity = acuityMap[VISUAL_SYSTEM][acuityIndex];
      if (!acuity) throw new RangeError("Unknown presenting VA index");
      const appliedPenalties = selectedPenaltyIndexes.map(
        (index) => optionalFields[index],
      );
      if (appliedPenalties.some((field) => !field))
        throw new RangeError("Unknown risk-factor index");
      const penaltySum = appliedPenalties.reduce(
        (sum, field) => sum + field.value,
        0,
      );
      const finalScore = acuity.value + penaltySum;
      const categoryInfo = getCategoryInfo(finalScore);
      return {
        acuity,
        appliedPenalties,
        penaltySum,
        finalScore,
        ...categoryInfo,
        outcomes:
          acuityMap[VISUAL_SYSTEM][categoryInfo.category - 1].tableValues,
      };
    }
    return {
      VISUAL_SYSTEM,
      acuityMap,
      optionalFields,
      CATEGORY_BANDS,
      OUTCOME_LABELS,
      CATEGORY_DESCRIPTIONS,
      getCategoryInfo,
      calculateScore,
    };
  },
);
