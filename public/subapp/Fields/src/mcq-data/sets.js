/*
 * mcq-data/sets.js
 */
(function registerMcqDataPart(globalScope) {
  const FIELD_SPECS_PRIMARY = [
    {
      id: "fp1",
      stem: "monoL",
      answer: "monoL",
      opts: ["monoL", "monoR", "biTemp", "leftHom"],
    },
    {
      id: "fp2",
      stem: "monoR",
      answer: "monoR",
      opts: ["monoR", "monoL", "biTemp", "rightHom"],
    },
    {
      id: "fp3",
      stem: "biTemp",
      answer: "biTemp",
      opts: ["biTemp", "biNasal", "rightHom", "leftHom"],
    },
    {
      id: "fp4",
      stem: "leftHom",
      answer: "leftHom",
      opts: ["leftHom", "rightHom", "biTemp", "biNasal"],
    },
    {
      id: "fp5",
      stem: "rightHom",
      answer: "rightHom",
      opts: ["rightHom", "leftHom", "biTemp", "biNasal"],
    },
  ];

  const FIELD_SPECS_HIGHER = [
    {
      id: "f1",
      stem: "biNasal",
      answer: "biNasal",
      opts: ["biNasal", "biTemp", "rightHom", "leftHom"],
    },
    {
      id: "f2",
      stem: "leftSup",
      answer: "leftSup",
      opts: ["leftSup", "rightSup", "leftInf", "rightInf"],
    },
    {
      id: "f3",
      stem: "rightInf",
      answer: "rightInf",
      opts: ["rightInf", "leftInf", "rightSup", "leftSup"],
    },
    {
      id: "f4",
      stem: "rightSup",
      answer: "rightSup",
      opts: ["rightSup", "leftSup", "rightInf", "leftInf"],
    },
    {
      id: "f5",
      stem: "leftInf",
      answer: "leftInf",
      opts: ["leftInf", "rightInf", "leftSup", "rightSup"],
    },
  ];

  const FIELD_SPECS_ADVANCED_EXTRA = [
    {
      id: "fa1",
      stem: "rightHomInc",
      answer: "rightHom",
      opts: ["rightHom", "leftHom", "biTemp", "biNasal"],
    },
    {
      id: "fa2",
      stem: "leftHomInc",
      answer: "leftHom",
      opts: ["leftHom", "rightHom", "biTemp", "biNasal"],
    },
    {
      id: "fa3",
      stem: "rightSupInc",
      answer: "rightSup",
      opts: ["rightSup", "leftSup", "rightInf", "leftInf"],
    },
    {
      id: "fa4",
      stem: "leftInfInc",
      answer: "leftInf",
      opts: ["leftInf", "rightInf", "leftSup", "rightSup"],
    },
  ];

  const PATHWAY_SPECS_PRIMARY = [
    {
      id: "pp1",
      prompt: "Pick the best matching field pattern.",
      stem: { kind: "pathway", key: "chiasm", caption: "Site" },
      answer: "biTemp",
      optionKind: "pattern",
      opts: ["biTemp", "biNasal", "rightHom", "leftHom"],
    },
    {
      id: "pp2",
      prompt: "Pick the best matching field pattern.",
      stem: { kind: "pathway", key: "leftTract", caption: "Site" },
      answer: "rightHom",
      optionKind: "pattern",
      opts: ["rightHom", "leftHom", "biTemp", "monoL"],
    },
    {
      id: "pp3",
      prompt: "Pick the best matching field pattern.",
      stem: { kind: "pathway", key: "rightNerve", caption: "Site" },
      answer: "monoR",
      optionKind: "pattern",
      opts: ["monoR", "monoL", "rightHom", "biTemp"],
    },
    {
      id: "pp4",
      prompt: "Pattern shown. Pick the best matching site.",
      stem: { kind: "pattern", key: "leftHom", caption: "Pattern" },
      answer: "rightPost",
      optionKind: "pathway",
      opts: ["rightPost", "leftPost", "chiasm", "rightNerve"],
    },
    {
      id: "pp5",
      prompt: "Pattern shown. Pick the best matching site.",
      stem: { kind: "pattern", key: "monoL", caption: "Pattern" },
      answer: "leftAnteriorMixed",
      optionKind: "pathway",
      opts: ["leftAnteriorMixed", "leftNerve", "leftRetina", "leftTract"],
    },
  ];

  const PATHWAY_SPECS_HIGHER = [
    {
      id: "ph1",
      prompt: "Pick the best matching field pattern.",
      stem: { kind: "pathway", key: "rightMeyer", caption: "Site" },
      answer: "leftSup",
      optionKind: "pattern",
      opts: ["leftSup", "leftInf", "rightSup", "rightInf"],
    },
    {
      id: "ph2",
      prompt: "Pick the best matching field pattern.",
      stem: { kind: "pathway", key: "leftParietal", caption: "Site" },
      answer: "rightInf",
      optionKind: "pattern",
      opts: ["rightInf", "rightSup", "leftInf", "leftSup"],
    },
    {
      id: "ph3",
      prompt: "Pick the best matching field pattern.",
      stem: { kind: "pathway", key: "binasalSite", caption: "Site" },
      answer: "biNasal",
      optionKind: "pattern",
      opts: ["biNasal", "biTemp", "rightHom", "leftHom"],
    },
    {
      id: "ph4",
      prompt: "Pattern shown. Pick the best matching site.",
      stem: {
        kind: "pattern",
        key: "teachJunctionalScotoma",
        caption: "Pattern",
      },
      answer: "rightJunction",
      optionKind: "pathway",
      opts: ["rightJunction", "rightNerve", "chiasm", "rightPost"],
    },
    {
      id: "ph5",
      prompt: "Pattern shown. Pick the best matching site.",
      stem: {
        kind: "pattern",
        key: "teachBitemporalQuadrantanopia",
        caption: "Pattern",
      },
      answer: "chiasm",
      optionKind: "pathway",
      opts: ["chiasm", "leftTract", "rightTract", "bilateralAnterior"],
    },
  ];

  const PATHWAY_SPECS_ADVANCED_EXTRA = [
    {
      id: "pa1",
      prompt: "Pattern shown. Pick the best matching site.",
      stem: { kind: "pattern", key: "rightHomInc", caption: "Pattern" },
      answer: "leftTract",
      optionKind: "pathway",
      opts: ["leftTract", "rightTract", "chiasm", "leftNerve"],
    },
    {
      id: "pa2",
      prompt: "Pattern shown. Pick the best matching site.",
      stem: { kind: "pattern", key: "leftInfInc", caption: "Pattern" },
      answer: "rightParietal",
      optionKind: "pathway",
      opts: ["rightParietal", "rightMeyer", "leftParietal", "chiasm"],
    },
    {
      id: "pa3",
      prompt:
        "Monocular pattern with sudden flashes and a curtain-like symptom. Retinal pathology is suspected. Pick the best site.",
      stem: { kind: "pattern", key: "monoR", caption: "Pattern" },
      answer: "rightRetina",
      optionKind: "pathway",
      opts: ["rightRetina", "rightNerve", "chiasm", "rightPost"],
    },
    {
      id: "pa4",
      prompt:
        "Monocular pattern with dyschromatopsia, a matching RAPD and no retinal explanation. Pick the best site.",
      stem: { kind: "pattern", key: "monoR", caption: "Pattern" },
      answer: "rightNerve",
      optionKind: "pathway",
      opts: ["rightNerve", "rightRetina", "chiasm", "rightPost"],
    },
  ];

  const TEACHING_CASES = [
    {
      number: 1,
      family: "Binocular Blindness",
      pattern: "teachBinocularTotalLoss",
      site: "bilateralAnterior",
    },
    {
      number: 2,
      family: "Monocular Total Loss",
      pattern: "monoR",
      site: "rightAnteriorMixed",
    },
    {
      number: 3,
      family: "Homonymous Hemianopia",
      pattern: "leftHom",
      site: "rightPost",
    },
    {
      number: 4,
      family: "Homonymous Quadrantanopia (Temporal)",
      pattern: "leftSup",
      site: "rightMeyer",
    },
    {
      number: 5,
      family: "Homonymous Quadrantanopia (Parietal)",
      pattern: "leftInf",
      site: "rightParietal",
    },
    {
      number: 6,
      family: "Bitemporal Hemianopia",
      pattern: "biTemp",
      site: "chiasm",
    },
    {
      number: 7,
      family: "Bitemporal Quadrantanopia",
      pattern: "teachBitemporalQuadrantanopia",
      site: "chiasm",
    },
    {
      number: 8,
      family: "Binocular Superior Altitudinal",
      pattern: "teachAltitudinalHemianopia",
      site: "bilateralAnterior",
    },
    {
      number: 9,
      family: "Tunnel Vision",
      pattern: "teachTunnelVision",
      site: "bilateralAnterior",
    },
    {
      number: 10,
      family: "Monocular Central Scotoma",
      pattern: "teachMonocularCentralScotoma",
      site: "rightRetina",
    },
    {
      number: 11,
      family: "Bilateral Central Scotoma",
      pattern: "teachBilateralCentralScotoma",
      site: "bilateralRetina",
    },
    {
      number: 12,
      family: "Junctional Scotoma",
      pattern: "teachJunctionalScotoma",
      site: "rightJunction",
    },
    {
      number: 13,
      family: "Monocular Cecocentral-like",
      pattern: "teachMonocularCecocentralLike",
      site: "rightNerve",
    },
    {
      number: 14,
      family: "Monocular Temporal Hemianopia",
      pattern: "teachMonocularTemporalHemianopia",
      site: "rightAnteriorMixed",
    },
    {
      number: 15,
      family: "Monocular Nasal Hemianopia",
      pattern: "teachMonocularNasalHemianopia",
      site: "rightAnteriorMixed",
    },
    {
      number: 16,
      family: "Glaucoma-like",
      pattern: "teachGlaucomaSimple",
      site: "rightNerve",
    },
    {
      number: 17,
      family: "Binasal Hemianopia",
      pattern: "biNasal",
      site: "binasalSite",
    },
    {
      number: 18,
      family: "Monocular Large Defect",
      pattern: "teachMonocularOtherDefect",
      site: "rightAnteriorMixed",
    },
  ];

  const FIELD_RATIONALES = Object.freeze({
    monoL: "Loss confined to the left eye is a left monocular field pattern.",
    monoR: "Loss confined to the right eye is a right monocular field pattern.",
    biTemp: "Temporal field loss in both eyes is a bitemporal pattern.",
    biNasal: "Nasal field loss in both eyes is a binasal pattern.",
    leftHom:
      "Loss of the left visual hemifield in both eyes is a left homonymous pattern.",
    rightHom:
      "Loss of the right visual hemifield in both eyes is a right homonymous pattern.",
    leftSup:
      "Loss of the left superior quadrant in both eyes is a left superior homonymous quadrantanopia.",
    rightSup:
      "Loss of the right superior quadrant in both eyes is a right superior homonymous quadrantanopia.",
    leftInf:
      "Loss of the left inferior quadrant in both eyes is a left inferior homonymous quadrantanopia.",
    rightInf:
      "Loss of the right inferior quadrant in both eyes is a right inferior homonymous quadrantanopia.",
  });

  const SITE_RATIONALES = Object.freeze({
    chiasm:
      "Central chiasmal dysfunction classically affects crossing nasal retinal fibres and produces bitemporal loss.",
    leftTract:
      "The left optic tract carries the right visual hemifield, so injury produces a right homonymous defect.",
    rightTract:
      "The right optic tract carries the left visual hemifield, so injury produces a left homonymous defect.",
    leftPost:
      "The left post-chiasmal pathway carries the right visual hemifield.",
    rightPost:
      "The right post-chiasmal pathway carries the left visual hemifield.",
    leftMeyer:
      "Left temporal optic radiations in Meyer loop carry the right superior visual field.",
    rightMeyer:
      "Right temporal optic radiations in Meyer loop carry the left superior visual field.",
    leftParietal:
      "Left parietal optic radiations carry the right inferior visual field.",
    rightParietal:
      "Right parietal optic radiations carry the left inferior visual field.",
    leftNerve:
      "A left optic-nerve lesion produces monocular left-eye loss and can cause a left RAPD.",
    rightNerve:
      "A right optic-nerve lesion produces monocular right-eye loss and can cause a right RAPD.",
    leftRetina:
      "A left retinal lesion can produce monocular left-eye field loss.",
    rightRetina:
      "A right retinal lesion can produce monocular right-eye field loss; flashes and a curtain-like symptom strengthen retinal concern.",
    leftAnteriorMixed:
      "A monocular pattern localises before the chiasm but field shape alone may not distinguish retina from optic nerve.",
  });

  function attachQuestionMetadata(collection, explanationFor) {
    collection.forEach((question) => {
      question.explanation = explanationFor(question);
      question.sourceIds = ["VISUAL-PATHWAY-2023", "VISUAL-PATHWAY-2021"];
      question.reviewStatus = "Independent clinical sign-off pending";
    });
  }

  [FIELD_SPECS_PRIMARY, FIELD_SPECS_HIGHER, FIELD_SPECS_ADVANCED_EXTRA].forEach(
    (collection) => {
      attachQuestionMetadata(
        collection,
        (question) =>
          FIELD_RATIONALES[question.answer] ||
          "Name the defect from the eye and hemifield pattern shown.",
      );
    },
  );

  [
    PATHWAY_SPECS_PRIMARY,
    PATHWAY_SPECS_HIGHER,
    PATHWAY_SPECS_ADVANCED_EXTRA,
  ].forEach((collection) => {
    attachQuestionMetadata(collection, (question) => {
      if (question.optionKind === "pattern") {
        return (
          SITE_RATIONALES[question.stem.key] ||
          FIELD_RATIONALES[question.answer] ||
          "Match the highlighted pathway site to its expected field pattern."
        );
      }
      return (
        SITE_RATIONALES[question.answer] ||
        "Match the field pattern to the most likely pathway site."
      );
    });
  });

  const parts = (globalScope.MCQ_DATA_PARTS = globalScope.MCQ_DATA_PARTS || {});
  Object.assign(parts, {
    FIELD_SPECS_PRIMARY,
    FIELD_SPECS_HIGHER,
    FIELD_SPECS_ADVANCED_EXTRA,
    PATHWAY_SPECS_PRIMARY,
    PATHWAY_SPECS_HIGHER,
    PATHWAY_SPECS_ADVANCED_EXTRA,
    TEACHING_CASES,
  });
})(typeof window !== "undefined" ? window : globalThis);
