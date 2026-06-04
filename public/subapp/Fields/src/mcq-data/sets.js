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
      stem: "monoL",
      answer: "monoL",
      opts: ["monoL", "monoR", "biTemp", "leftHom"],
    },
    {
      id: "f2",
      stem: "biTemp",
      answer: "biTemp",
      opts: ["biTemp", "biNasal", "rightHom", "leftHom"],
    },
    {
      id: "f3",
      stem: "leftHom",
      answer: "leftHom",
      opts: ["leftHom", "rightHom", "leftSup", "leftInf"],
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
      id: "p1",
      prompt: "Pick the best matching field pattern.",
      stem: { kind: "pathway", key: "chiasm", caption: "Site" },
      answer: "biTemp",
      optionKind: "pattern",
      opts: ["biTemp", "biNasal", "rightHom", "leftHom"],
    },
    {
      id: "p2",
      prompt: "Pick the best matching field pattern.",
      stem: { kind: "pathway", key: "leftTract", caption: "Site" },
      answer: "rightHom",
      optionKind: "pattern",
      opts: ["rightHom", "leftHom", "biTemp", "monoL"],
    },
    {
      id: "p3",
      prompt: "Pick the best matching field pattern.",
      stem: { kind: "pathway", key: "rightNerve", caption: "Site" },
      answer: "monoR",
      optionKind: "pattern",
      opts: ["monoR", "monoL", "rightHom", "biTemp"],
    },
    {
      id: "p4",
      prompt: "Pattern shown. Pick the best matching site.",
      stem: { kind: "pattern", key: "leftHom", caption: "Pattern" },
      answer: "rightPost",
      optionKind: "pathway",
      opts: ["rightPost", "leftPost", "chiasm", "rightNerve"],
    },
    {
      id: "p6",
      prompt: "Pattern shown. Pick the best matching site.",
      stem: { kind: "pattern", key: "monoL", caption: "Pattern" },
      answer: "leftAnteriorMixed",
      optionKind: "pathway",
      opts: ["leftAnteriorMixed", "leftNerve", "leftRetina", "leftTract"],
    },
  ];

  const PATHWAY_SPECS_HIGHER = [
    {
      id: "p1",
      prompt: "Pick the best matching field pattern.",
      stem: { kind: "pathway", key: "chiasm", caption: "Site" },
      answer: "biTemp",
      optionKind: "pattern",
      opts: ["biTemp", "biNasal", "rightHom", "leftHom"],
    },
    {
      id: "p2",
      prompt: "Pick the best matching field pattern.",
      stem: { kind: "pathway", key: "leftTract", caption: "Site" },
      answer: "rightHom",
      optionKind: "pattern",
      opts: ["rightHom", "leftHom", "biTemp", "monoL"],
    },
    {
      id: "p3",
      prompt: "Pick the best matching field pattern.",
      stem: { kind: "pathway", key: "rightNerve", caption: "Site" },
      answer: "monoR",
      optionKind: "pattern",
      opts: ["monoR", "monoL", "rightHom", "biTemp"],
    },
    {
      id: "p4",
      prompt: "Pattern shown. Pick the best matching site.",
      stem: { kind: "pattern", key: "leftHom", caption: "Pattern" },
      answer: "rightPost",
      optionKind: "pathway",
      opts: ["rightPost", "leftPost", "chiasm", "rightNerve"],
    },
    {
      id: "p5",
      prompt: "Pattern shown. Pick the best matching site.",
      stem: { kind: "pattern", key: "rightSup", caption: "Pattern" },
      answer: "leftMeyer",
      optionKind: "pathway",
      opts: ["leftMeyer", "leftParietal", "rightMeyer", "rightParietal"],
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
        "Pattern shown with sudden onset and no RAPD. Pick the best site.",
      stem: { kind: "pattern", key: "monoR", caption: "Pattern" },
      answer: "rightRetina",
      optionKind: "pathway",
      opts: ["rightRetina", "rightNerve", "chiasm", "rightPost"],
    },
    {
      id: "pa4",
      prompt: "Pattern shown with matching RAPD. Pick the best site.",
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
