export const EYE_LABELS = {
  right: "Right eye",
  left: "Left eye",
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
  { key: "bp", label: "BP checked", note: "optimise BP" },
  { key: "lipids", label: "Lipids checked", note: "optimise lipids" },
  { key: "hba1c", label: "HbA1c checked", note: "optimise glucose control" },
];

export const FINDING_GROUPS = [
  {
    key: "clear",
    title: "No referable signs",
    tone: "neutral",
    findings: [
      {
        key: "noReferableSignsSeen",
        label: "No referable signs seen in view obtained",
        shortLabel: "No signs",
        group: "clear",
      },
    ],
  },
  {
    key: "npdr",
    title: "DR signs",
    tone: "green",
    findings: [
      {
        key: "microaneurysms",
        label: "Microaneurysms",
        shortLabel: "MA",
        group: "npdr",
      },
      {
        key: "dotBlotHaemorrhages",
        label: "Dot/blot haemorrhages",
        shortLabel: "D/B",
        group: "npdr",
      },
      {
        key: "cottonWoolSpots",
        label: "Cotton-wool spots",
        shortLabel: "CWS",
        group: "npdr",
      },
      {
        key: "venousBeading",
        label: "Venous beading",
        shortLabel: "VB",
        group: "npdr",
      },
    ],
  },
  {
    key: "macula",
    title: "Macula risk",
    tone: "orange",
    findings: [
      {
        key: "maculaHardExudates",
        label: "Hard exudates near macula",
        shortLabel: "Macula HE",
        group: "macula",
      },
      {
        key: "fovealRisk",
        label: "Possible foveal involvement",
        shortLabel: "Fovea risk",
        group: "macula",
      },
    ],
  },
  {
    key: "pdr",
    title: "Proliferative signs",
    tone: "red",
    findings: [
      {
        key: "nvd",
        label: "New vessels at disc",
        shortLabel: "NVD",
        group: "pdr",
      },
      {
        key: "nve",
        label: "New vessels elsewhere",
        shortLabel: "NVE",
        group: "pdr",
      },
      {
        key: "preretinalHaemorrhage",
        label: "Preretinal haemorrhage",
        shortLabel: "PR-H",
        group: "pdr",
      },
      {
        key: "vitreousHaemorrhage",
        label: "Vitreous haemorrhage",
        shortLabel: "Vit H",
        group: "pdr",
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
export const PDR_KEYS = FINDINGS.filter(
  (finding) => finding.group === "pdr",
).map((finding) => finding.key);

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
