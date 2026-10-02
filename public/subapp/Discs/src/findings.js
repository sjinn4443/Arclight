export const EYE_LABELS = {
  right: "RE",
  left: "LE",
};

export const MODE_LABELS = {
  "arclight-do": "Arclight (DO)",
  "holo-bio": "Holo (BIO)",
};

export const AREA_OPTIONS = {
  "arclight-do": [
    {
      value: "posterior-pole",
      label: "Posterior pole",
      shortLabel: "Post pole",
    },
    { value: "disc-macula", label: "Disc and macula", shortLabel: "Disc+mac" },
    { value: "limited", label: "Limited glimpses only", shortLabel: "Limited" },
  ],
  "holo-bio": [
    {
      value: "posterior-pole",
      label: "Posterior pole",
      shortLabel: "Post pole",
    },
    { value: "disc-macula", label: "Disc and macula", shortLabel: "Disc+mac" },
    {
      value: "four-quadrants",
      label: "Four-quadrant sweep",
      shortLabel: "4 quad",
    },
    { value: "limited", label: "Limited glimpses only", shortLabel: "Limited" },
  ],
};

export const VIEW_QUALITY_OPTIONS = [
  { value: "clear", label: "Clear" },
  { value: "partial", label: "Partial" },
  { value: "hazy", label: "Hazy" },
  { value: "ungradable", label: "Ungradable" },
];

export const VA_OPTIONS = [
  { value: "", label: "" },
  { value: "6/6", label: "6/6" },
  { value: "6/12", label: "6/12" },
  { value: "6/36", label: "6/36" },
  { value: "6/60", label: "6/60" },
  { value: "HM", label: "HM" },
  { value: "unable_test", label: "No test" },
  { value: "fix_follow_good", label: "Fix/follow" },
  { value: "fix_follow_poor", label: "No fix" },
];

export const DILATION_REASONS = [
  { value: "", label: "" },
  { value: "not_available", label: "Not available" },
  { value: "not_appropriate", label: "Not appropriate" },
  { value: "declined", label: "Patient declined" },
  { value: "other", label: "Other" },
];

export const SYSTEMIC_CHECKS = [
  { key: "bp", label: "IOP checked", note: "record IOP if possible" },
  {
    key: "lipids",
    label: "Family history",
    note: "ask about glaucoma family history",
  },
  { key: "hba1c", label: "High myopia", note: "record high myopia if present" },
];

export const FINDING_GROUPS = [
  {
    key: "clear",
    title: "No referable signs",
    tone: "neutral",
    modes: ["general", "glaucoma"],
    findings: [
      {
        key: "noReferableSignsSeen",
        label: "No referable disc signs seen in view obtained",
        shortLabel: "No signs",
        group: "clear",
        detail:
          "Use only when no referable disc signs are seen in the view obtained. It does not replace symptoms, pupils, fields or local review pathways.",
      },
    ],
  },
  {
    key: "npdr",
    title: "General disc variants",
    tone: "green",
    modes: ["general"],
    findings: [
      {
        key: "discDrusen",
        label: "Disc drusen or pseudo-swelling",
        shortLabel: "Drusen",
        group: "npdr",
        detail:
          "Lumpy elevated disc appearance that can mimic true disc swelling. If symptomatic or uncertain, manage as swelling.",
      },
      {
        key: "anomalousTiltedDisc",
        label: "Tilted or anomalous disc",
        shortLabel: "Tilted",
        group: "npdr",
        detail:
          "Congenital tilt, myopic disc shape or unusual vessel entry can distort the cup and margin. Compare with the other eye and previous records.",
      },
      {
        key: "crowdedDisc",
        label: "Small crowded disc",
        shortLabel: "Crowded",
        group: "npdr",
        detail:
          "A small crowded disc may look raised and has little visible cup. Distinguish from true swelling, especially if symptoms are present.",
      },
      {
        key: "peripapillaryAtrophy",
        label: "Peripapillary atrophy or pigment change",
        shortLabel: "PPA",
        group: "npdr",
        detail:
          "Peripapillary atrophy, crescent or pigment change is common in myopia and can alter glaucoma assessment.",
      },
    ],
  },
  {
    key: "macula",
    title: "Concerning disc signs",
    tone: "orange",
    modes: ["general", "glaucoma"],
    findings: [
      {
        key: "opticDiscPallor",
        label: "Optic disc pallor",
        shortLabel: "Pallor",
        group: "macula",
        detail:
          "Pallor may indicate optic nerve damage. Reduced VA, field loss or an abnormal pupil should increase urgency.",
      },
      {
        key: "cupDisc06",
        label: "C/D about 0.6",
        shortLabel: "C/D 0.6",
        group: "macula",
        modes: ["glaucoma"],
        detail:
          "A moderate cup is more suspicious when the rim is thin, the disc is small, the fellow eye differs or fields match.",
      },
      {
        key: "thinRim",
        label: "Thin neuroretinal rim",
        shortLabel: "Thin rim",
        group: "macula",
        modes: ["glaucoma"],
        detail:
          "Diffuse or focal rim thinning makes glaucoma more likely, especially with matching field loss or progression.",
      },
    ],
  },
  {
    key: "context",
    title: "Cup and size context",
    tone: "green",
    modes: ["glaucoma"],
    findings: [
      {
        key: "cupDisc03",
        label: "C/D about 0.3",
        shortLabel: "C/D 0.3",
        group: "context",
        modes: ["glaucoma"],
        detail:
          "A small cup is usually lower risk if the rim is healthy and the disc is not suspicious.",
      },
      {
        key: "smallDisc",
        label: "Small disc",
        shortLabel: "Small",
        group: "context",
        modes: ["glaucoma"],
        detail:
          "Small discs can have small cups. A moderate cup in a small disc is more suspicious.",
      },
      {
        key: "mediumDisc",
        label: "Medium disc",
        shortLabel: "Medium",
        group: "context",
        modes: ["glaucoma"],
        detail:
          "Medium disc size means cup/disc ratio can be interpreted more directly alongside rim health.",
      },
      {
        key: "largeDisc",
        label: "Large disc",
        shortLabel: "Large",
        group: "context",
        modes: ["glaucoma"],
        detail:
          "Large discs may have larger physiological cups. Judge the rim, not the cup alone.",
      },
    ],
  },
  {
    key: "urgent",
    title: "Urgent disc swelling",
    tone: "red",
    modes: ["general", "glaucoma"],
    findings: [
      {
        key: "swollenDisc",
        label: "Swollen disc",
        shortLabel: "Swollen",
        group: "urgent",
        detail:
          "Blurred disc margin, raised nerve head or obscured vessels can indicate papilloedema, optic neuritis, inflammation or vascular disease. True swelling is urgent.",
      },
    ],
  },
  {
    key: "glaucomaHigh",
    title: "Fast glaucoma signs",
    tone: "red",
    modes: ["glaucoma"],
    findings: [
      {
        key: "rimNotch",
        label: "Rim notch",
        shortLabel: "Notch",
        group: "glaucomaHigh",
        modes: ["glaucoma"],
        detail:
          "A focal rim notch is a strong glaucoma-pattern structural sign, especially with local nerve fibre layer loss.",
      },
      {
        key: "splinterHaemorrhage",
        label: "Splinter haemorrhage",
        shortLabel: "Splinter",
        group: "glaucomaHigh",
        modes: ["glaucoma"],
        detail:
          "A splinter or flame haemorrhage at the disc margin can indicate active nerve fibre layer damage or glaucoma progression.",
      },
      {
        key: "cupDisc09",
        label: "C/D about 0.9",
        shortLabel: "C/D 0.9",
        group: "glaucomaHigh",
        modes: ["glaucoma"],
        detail:
          "Very large cup with little remaining rim is high risk for advanced glaucoma, especially with vessel change or field loss.",
      },
      {
        key: "visibleLaminaCribrosa",
        label: "Visible lamina cribrosa",
        shortLabel: "Lam crib",
        group: "glaucomaHigh",
        modes: ["glaucoma"],
        detail:
          "Visible lamina pores suggest deep cupping. Interpret with rim loss, vessel displacement and fields.",
      },
      {
        key: "vesselBayoneting",
        label: "Vessel bayoneting or baring",
        shortLabel: "BV change",
        group: "glaucomaHigh",
        modes: ["glaucoma"],
        detail:
          "Baring of circumlinear vessels or bayoneting suggests rim loss and advanced cupping. Do not overcall simple early bending.",
      },
    ],
  },
];

export const FINDINGS = FINDING_GROUPS.flatMap((group) => group.findings);
export const FINDING_MAP = Object.fromEntries(
  FINDINGS.map((finding) => [finding.key, finding]),
);
export const FINDING_KEYS = FINDINGS.map((finding) => finding.key);
export const LESION_FINDING_KEYS = FINDING_KEYS.filter(
  (key) => key !== "noReferableSignsSeen",
);
export const NPDR_KEYS = FINDINGS.filter(
  (finding) => finding.group === "npdr",
).map((finding) => finding.key);
export const MACULA_KEYS = FINDINGS.filter(
  (finding) => finding.group === "macula",
).map((finding) => finding.key);
export const CONTEXT_KEYS = FINDINGS.filter(
  (finding) => finding.group === "context",
).map((finding) => finding.key);
export const URGENT_KEYS = FINDINGS.filter(
  (finding) => finding.group === "urgent",
).map((finding) => finding.key);
export const GLAUCOMA_HIGH_KEYS = FINDINGS.filter(
  (finding) => finding.group === "glaucomaHigh",
).map((finding) => finding.key);
export const PDR_KEYS = [...URGENT_KEYS, ...GLAUCOMA_HIGH_KEYS];

export function createEmptyFindings() {
  return Object.fromEntries(FINDING_KEYS.map((key) => [key, false]));
}

export function getFindingLabels(findings) {
  return FINDINGS.filter((finding) => Boolean(findings[finding.key])).map(
    (finding) => finding.label,
  );
}

export function getAreaLabel(mode, value) {
  return (
    AREA_OPTIONS[mode]?.find((option) => option.value === value)?.label ||
    "Not recorded"
  );
}

export function getVaLabel(value) {
  return (
    VA_OPTIONS.find((option) => option.value === value)?.label || "Not recorded"
  );
}
