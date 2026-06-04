/*
 * mcq-data/library.js
 */
(function registerMcqDataPart(globalScope) {
  const PATTERNS = {
    monoR: {
      right: ["st", "sn", "it", "in"],
      left: [],
      center: { right: "loss", left: "normal" },
      names: {
        primary: "Right eye total loss",
        intermediate: "Right monocular vision loss",
        advanced: "Right Monocular Blind Eye",
      },
    },
    monoL: {
      right: [],
      left: ["st", "sn", "it", "in"],
      center: { right: "normal", left: "loss" },
      names: {
        primary: "Left eye total loss",
        intermediate: "Left monocular vision loss",
        advanced: "Left Monocular Blind Eye",
      },
    },
    biTemp: {
      right: ["st", "it"],
      left: ["st", "it"],
      names: {
        primary: "Outer-half loss in both eyes",
        intermediate: "Bitemporal hemianopia",
        advanced: "Bitemporal Hemianopia",
      },
    },
    biNasal: {
      right: ["sn", "in"],
      left: ["sn", "in"],
      names: {
        primary: "Inner-half loss in both eyes",
        intermediate: "Binasal hemianopia",
        advanced: "Binasal Hemianopia",
      },
    },
    rightHom: {
      right: ["st", "it"],
      left: ["sn", "in"],
      names: {
        primary: "Right half loss (both eyes)",
        intermediate: "Right homonymous hemianopia",
        advanced: "Right Homonymous Hemianopia",
      },
    },
    leftHom: {
      right: ["sn", "in"],
      left: ["st", "it"],
      names: {
        primary: "Left half loss (both eyes)",
        intermediate: "Left homonymous hemianopia",
        advanced: "Left Homonymous Hemianopia",
      },
    },
    rightSup: {
      right: ["st"],
      left: ["sn"],
      names: {
        primary: "Right upper quarter loss",
        intermediate: "Right superior quadrantanopia",
        advanced: "Right Superior Quadrantanopia",
      },
    },
    leftSup: {
      right: ["sn"],
      left: ["st"],
      names: {
        primary: "Left upper quarter loss",
        intermediate: "Left superior quadrantanopia",
        advanced: "Left Superior Quadrantanopia",
      },
    },
    rightInf: {
      right: ["it"],
      left: ["in"],
      names: {
        primary: "Right lower quarter loss",
        intermediate: "Right inferior quadrantanopia",
        advanced: "Right Inferior Quadrantanopia",
      },
    },
    leftInf: {
      right: ["in"],
      left: ["it"],
      names: {
        primary: "Left lower quarter loss",
        intermediate: "Left inferior quadrantanopia",
        advanced: "Left Inferior Quadrantanopia",
      },
    },
    rightHomInc: {
      right: ["st", "it"],
      left: ["sn"],
      leftSuspect: ["in"],
      names: {
        primary: "Right-half loss, uneven",
        intermediate: "Right homonymous (incongruous)",
        advanced: "Probable Right Homonymous Hemianopia (Incongruous)",
      },
    },
    leftHomInc: {
      right: ["sn"],
      rightSuspect: ["in"],
      left: ["st", "it"],
      names: {
        primary: "Left-half loss, uneven",
        intermediate: "Left homonymous (incongruous)",
        advanced: "Probable Left Homonymous Hemianopia (Incongruous)",
      },
    },
    rightSupInc: {
      right: ["st"],
      leftSuspect: ["sn"],
      names: {
        primary: "Right upper quarter, uneven",
        intermediate: "Right superior quadrantanopia (incongruous)",
        advanced: "Probable Right Superior Quadrantanopia",
      },
    },
    leftInfInc: {
      rightSuspect: ["in"],
      left: ["it"],
      names: {
        primary: "Left lower quarter, uneven",
        intermediate: "Left inferior quadrantanopia (incongruous)",
        advanced: "Probable Left Inferior Quadrantanopia",
      },
    },
    teachBinocularTotalLoss: {
      right: ["st", "sn", "it", "in"],
      left: ["st", "sn", "it", "in"],
      center: { right: "loss", left: "loss" },
      names: {
        primary: "Blindness in both eyes",
        intermediate: "Binocular blindness",
        advanced: "Binocular Blindness",
      },
    },
    teachBitemporalQuadrantanopia: {
      right: ["st"],
      left: ["st"],
      names: {
        primary: "Upper outer-quarter loss (both eyes)",
        intermediate: "Superior bitemporal quadrantanopia",
        advanced: "Superior Bitemporal Quadrantanopia",
      },
    },
    teachAltitudinalHemianopia: {
      right: ["st", "sn"],
      left: ["st", "sn"],
      names: {
        primary: "Upper-half loss in both eyes",
        intermediate: "Binocular superior altitudinal loss",
        advanced: "Binocular Superior Altitudinal",
      },
    },
    teachTunnelVision: {
      right: ["st", "sn", "it", "in"],
      left: ["st", "sn", "it", "in"],
      names: {
        primary: "Ring-like peripheral loss",
        intermediate: "Tunnel vision",
        advanced: "Tunnel Vision",
      },
    },
    teachMonocularCentralScotoma: {
      right: [],
      left: [],
      center: { right: "loss", left: "normal" },
      names: {
        primary: "Right central blind spot",
        intermediate: "Right monocular central scotoma",
        advanced: "Right Monocular Central Scotoma",
      },
    },
    teachBilateralCentralScotoma: {
      right: [],
      left: [],
      center: { right: "loss", left: "loss" },
      names: {
        primary: "Central blind spots in both eyes",
        intermediate: "Bilateral central scotoma",
        advanced: "Bilateral Central Scotoma",
      },
    },
    teachJunctionalScotoma: {
      right: [],
      left: ["st"],
      center: { right: "loss", left: "normal" },
      names: {
        primary: "Centre + opposite upper outer quarter",
        intermediate: "Junctional scotoma pattern",
        advanced: "Junctional Scotoma",
      },
    },
    teachMonocularCecocentralLike: {
      right: ["st", "it"],
      left: [],
      center: { right: "loss", left: "normal" },
      names: {
        primary: "Right centre + outer side loss",
        intermediate: "Right cecocentral-like defect",
        advanced: "Right Monocular Cecocentral-like Defect",
      },
    },
    teachMonocularTemporalHemianopia: {
      right: ["st", "it"],
      left: [],
      names: {
        primary: "Right outer-half loss (one eye)",
        intermediate: "Right monocular temporal hemianopia",
        advanced: "Right Monocular Temporal Hemianopia",
      },
    },
    teachMonocularNasalHemianopia: {
      right: ["sn", "in"],
      left: [],
      names: {
        primary: "Right inner-half loss (one eye)",
        intermediate: "Right monocular nasal hemianopia",
        advanced: "Right Monocular Nasal Hemianopia",
      },
    },
    teachGlaucomaSimple: {
      right: ["sn"],
      rightSuspect: ["st", "in"],
      left: [],
      names: {
        primary: "Nasal-weighted right eye change",
        intermediate: "Right glaucoma-like change",
        advanced: "Glaucoma-like Changes (Right Eye)",
      },
    },
    teachMonocularOtherDefect: {
      right: ["st", "in"],
      rightSuspect: ["sn"],
      left: [],
      names: {
        primary: "Large patchy right-eye loss",
        intermediate: "Right monocular large defect",
        advanced: "Right Monocular Large Defect",
      },
    },
  };

  const SITES = {
    rightRetina: {
      marks: ["part-retina-right"],
      names: {
        primary: "Right retina (before nerve)",
        intermediate: "Right retina (pre-chiasmal)",
        advanced: "Right Retina",
      },
    },
    leftRetina: {
      marks: ["part-retina-left"],
      names: {
        primary: "Left retina (before nerve)",
        intermediate: "Left retina (pre-chiasmal)",
        advanced: "Left Retina",
      },
    },
    rightNerve: {
      marks: ["part-nerve-right"],
      names: {
        primary: "Right eye nerve (before crossing)",
        intermediate: "Right optic nerve (pre-chiasmal)",
        advanced: "Right Optic Nerve",
      },
    },
    leftNerve: {
      marks: ["part-nerve-left"],
      names: {
        primary: "Left eye nerve (before crossing)",
        intermediate: "Left optic nerve (pre-chiasmal)",
        advanced: "Left Optic Nerve",
      },
    },
    chiasm: {
      marks: ["part-chiasm-a", "part-chiasm-b", "part-chiasm"],
      names: {
        primary: "Crossing point (chiasm)",
        intermediate: "Optic chiasm",
        advanced: "Optic Chiasm",
      },
    },
    leftTract: {
      marks: ["part-tract-left", "part-lgn-left"],
      names: {
        primary: "Left deep pathway (after crossing)",
        intermediate: "Left optic tract/LGN pathway",
        advanced: "Left Optic Tract / LGN",
      },
    },
    rightTract: {
      marks: ["part-tract-right", "part-lgn-right"],
      names: {
        primary: "Right deep pathway (after crossing)",
        intermediate: "Right optic tract/LGN pathway",
        advanced: "Right Optic Tract / LGN",
      },
    },
    leftPost: {
      marks: [
        "part-tract-left",
        "part-lgn-left",
        "part-radiation-left-a",
        "part-radiation-left-b",
        "part-occipital-left",
        "part-v1-left",
        "part-calcarine-fissure-left",
        "part-calcarine-upper-left",
        "part-calcarine-lower-left",
        "part-occipital-pole-left",
      ],
      names: {
        primary: "Left brain pathway (after crossing)",
        intermediate: "Left post-chiasmal pathway",
        advanced: "Left Post-chiasmal Pathway",
      },
    },
    rightPost: {
      marks: [
        "part-tract-right",
        "part-lgn-right",
        "part-radiation-right-a",
        "part-radiation-right-b",
        "part-occipital-right",
        "part-v1-right",
        "part-calcarine-fissure-right",
        "part-calcarine-upper-right",
        "part-calcarine-lower-right",
        "part-occipital-pole-right",
      ],
      names: {
        primary: "Right brain pathway (after crossing)",
        intermediate: "Right post-chiasmal pathway",
        advanced: "Right Post-chiasmal Pathway",
      },
    },
    leftMeyer: {
      marks: ["part-radiation-left-b"],
      names: {
        primary: "Left outer radiation pathway",
        intermediate: "Left temporal radiations (Meyer)",
        advanced: "Left Meyer Loop",
      },
    },
    rightMeyer: {
      marks: ["part-radiation-right-b"],
      names: {
        primary: "Right outer radiation pathway",
        intermediate: "Right temporal radiations (Meyer)",
        advanced: "Right Meyer Loop",
      },
    },
    leftParietal: {
      marks: ["part-radiation-left-a"],
      names: {
        primary: "Left inner radiation pathway",
        intermediate: "Left parietal radiations",
        advanced: "Left Parietal Radiations",
      },
    },
    rightParietal: {
      marks: ["part-radiation-right-a"],
      names: {
        primary: "Right inner radiation pathway",
        intermediate: "Right parietal radiations",
        advanced: "Right Parietal Radiations",
      },
    },
    bilateralAnterior: {
      marks: [
        "part-retina-right",
        "part-retina-left",
        "part-nerve-right",
        "part-nerve-left",
      ],
      names: {
        primary: "Both eyes: front pathway",
        intermediate: "Bilateral retina/optic-nerve pathway",
        advanced: "Bilateral Pre-chiasmal Pathway",
      },
    },
    rightAnteriorMixed: {
      marks: ["part-retina-right", "part-nerve-right"],
      names: {
        primary: "Right eye front pathway",
        intermediate: "Right retina/optic-nerve pathway",
        advanced: "Right Pre-chiasmal Pathway",
      },
    },
    leftAnteriorMixed: {
      marks: ["part-retina-left", "part-nerve-left"],
      names: {
        primary: "Left eye front pathway",
        intermediate: "Left retina/optic-nerve pathway",
        advanced: "Left Pre-chiasmal Pathway",
      },
    },
    bilateralRetina: {
      marks: ["part-retina-right", "part-retina-left"],
      names: {
        primary: "Both retinas",
        intermediate: "Bilateral retinal pathway",
        advanced: "Bilateral Retina",
      },
    },
    rightJunction: {
      marks: [
        "part-nerve-right",
        "part-chiasm-a",
        "part-chiasm-b",
        "part-chiasm",
      ],
      names: {
        primary: "Right nerve + crossing point",
        intermediate: "Right optic nerve-chiasm junction",
        advanced: "Right Nerve-Chiasm Junction",
      },
    },
    binasalSite: {
      marks: [
        "part-nerve-right",
        "part-nerve-left",
        "part-chiasm-a",
        "part-chiasm-b",
        "part-chiasm",
      ],
      names: {
        primary: "Both eye nerves / crossing area",
        intermediate: "Bilateral anterior / lateral chiasmal pathway",
        advanced: "Bilateral Anterior / Lateral Chiasmal Pathway",
      },
    },
  };

  const TEXT_BANK = {
    primary: [
      {
        id: "tp1",
        prompt: "Both outer halves are missing. Where is the likely site?",
        answer: "chiasm",
        options: [
          { key: "chiasm", label: "Crossing point" },
          { key: "rightNerve", label: "Right eye nerve" },
          { key: "leftNerve", label: "Left eye nerve" },
          { key: "post", label: "Brain pathway (after crossing)" },
        ],
      },
      {
        id: "tp2",
        prompt:
          "Right half is missing in both eyes. Which back-pathway side is likely affected?",
        answer: "leftPost",
        options: [
          { key: "leftPost", label: "Left brain pathway" },
          { key: "rightPost", label: "Right brain pathway" },
          { key: "chiasm", label: "Crossing point" },
          { key: "rightNerve", label: "Right eye nerve" },
        ],
      },
      {
        id: "tp3",
        prompt:
          "Only the left eye is severely reduced and the pupil defect is on the left. Best site?",
        answer: "leftNerve",
        options: [
          { key: "leftNerve", label: "Left optic nerve" },
          { key: "leftRetina", label: "Left retina" },
          { key: "chiasm", label: "Crossing point" },
          { key: "leftPost", label: "Left brain pathway" },
        ],
      },
      {
        id: "tp4",
        prompt:
          "Only the right eye is severely reduced, sudden onset, no pupil defect. Best site?",
        answer: "rightRetina",
        options: [
          { key: "rightRetina", label: "Right retina" },
          { key: "rightNerve", label: "Right optic nerve" },
          { key: "chiasm", label: "Crossing point" },
          { key: "rightPost", label: "Right brain pathway" },
        ],
      },
      {
        id: "tp5",
        prompt:
          "Left half is missing in both eyes. Which back-pathway side is likely affected?",
        answer: "rightPost",
        options: [
          { key: "rightPost", label: "Right brain pathway" },
          { key: "leftPost", label: "Left brain pathway" },
          { key: "chiasm", label: "Crossing point" },
          { key: "leftNerve", label: "Left eye nerve" },
        ],
      },
    ],
    intermediate: [
      {
        id: "ti1",
        prompt: "Bitemporal hemianopia localizes best to:",
        answer: "chiasm",
        options: [
          { key: "chiasm", label: "Optic chiasm" },
          { key: "leftTract", label: "Left optic tract" },
          { key: "rightTract", label: "Right optic tract" },
          { key: "rightNerve", label: "Right optic nerve" },
        ],
      },
      {
        id: "ti2",
        prompt: "Right homonymous hemianopia usually localizes to:",
        answer: "leftPost",
        options: [
          { key: "leftPost", label: "Left post-chiasmal pathway" },
          { key: "rightPost", label: "Right post-chiasmal pathway" },
          { key: "chiasm", label: "Optic chiasm" },
          { key: "rightNerve", label: "Right optic nerve" },
        ],
      },
      {
        id: "ti3",
        prompt: "Left superior quadrantanopia is most consistent with:",
        answer: "rightMeyer",
        options: [
          {
            key: "rightMeyer",
            label: "Right temporal radiations (Meyer loop)",
          },
          { key: "rightParietal", label: "Right parietal radiations" },
          { key: "leftMeyer", label: "Left temporal radiations (Meyer loop)" },
          { key: "chiasm", label: "Optic chiasm" },
        ],
      },
      {
        id: "ti4",
        prompt: "Right inferior quadrantanopia is most consistent with:",
        answer: "leftParietal",
        options: [
          { key: "leftParietal", label: "Left parietal radiations" },
          { key: "leftMeyer", label: "Left temporal radiations (Meyer loop)" },
          { key: "rightParietal", label: "Right parietal radiations" },
          { key: "rightNerve", label: "Right optic nerve" },
        ],
      },
      {
        id: "ti5",
        prompt: "Binasal hemianopia most often suggests:",
        answer: "rare",
        options: [
          {
            key: "rare",
            label:
              "Rare bilateral ocular/optic-nerve or lateral chiasmal causes",
          },
          { key: "leftPost", label: "Left post-chiasmal lesion" },
          { key: "rightPost", label: "Right post-chiasmal lesion" },
          { key: "chiasm", label: "Classic central chiasmal compression" },
        ],
      },
    ],
    advanced: [
      {
        id: "ta1",
        prompt: "Lesion at optic chiasm classically causes:",
        answer: "biTemp",
        options: [
          { key: "biTemp", label: "Bitemporal hemianopia" },
          { key: "biNasal", label: "Binasal hemianopia" },
          { key: "leftHom", label: "Left homonymous hemianopia" },
          { key: "rightHom", label: "Right homonymous hemianopia" },
        ],
      },
      {
        id: "ta2",
        prompt: "Left optic tract lesion classically causes:",
        answer: "rightHom",
        options: [
          { key: "rightHom", label: "Right homonymous hemianopia" },
          { key: "leftHom", label: "Left homonymous hemianopia" },
          { key: "biTemp", label: "Bitemporal hemianopia" },
          { key: "monoL", label: "Left monocular severe loss" },
        ],
      },
      {
        id: "ta3",
        prompt: "Right optic nerve lesion best matches:",
        answer: "monoR",
        options: [
          { key: "monoR", label: "Right monocular severe loss" },
          { key: "monoL", label: "Left monocular severe loss" },
          { key: "rightHom", label: "Right homonymous hemianopia" },
          { key: "biTemp", label: "Bitemporal hemianopia" },
        ],
      },
      {
        id: "ta4",
        prompt: "Left Meyer loop lesion most likely causes:",
        answer: "rightSup",
        options: [
          { key: "rightSup", label: "Right superior quadrantanopia" },
          { key: "rightInf", label: "Right inferior quadrantanopia" },
          { key: "leftSup", label: "Left superior quadrantanopia" },
          { key: "leftInf", label: "Left inferior quadrantanopia" },
        ],
      },
      {
        id: "ta5",
        prompt: "Homonymous hemianopia usually indicates:",
        answer: "post",
        options: [
          { key: "post", label: "Post-chiasmal pathway lesion" },
          { key: "chiasm", label: "Optic chiasm compression" },
          { key: "single", label: "Single optic nerve lesion" },
          { key: "retina", label: "Retinal disease only" },
        ],
      },
    ],
  };

  const parts = (globalScope.MCQ_DATA_PARTS = globalScope.MCQ_DATA_PARTS || {});
  Object.assign(parts, { PATTERNS, SITES, TEXT_BANK });
})(typeof window !== "undefined" ? window : globalThis);
