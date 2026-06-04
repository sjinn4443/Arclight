export const DEFAULT_DISC_SIZE = "Medium";

export const IOP_ROW_MAP = {
  gte30: 1,
  "25-29": 2,
  "20-24": 3,
  lte20: 4,
};

export const CD_RATIO_COL_MAP = {
  "0-0.2": 1,
  "0.3-0.5": 2,
  "0.6-0.8": 3,
  "0.9-1": 4,
};

export const VISION_POINTS = {
  "6/12": 0.25,
  "6/36": 0.5,
  "6/60": 0.75,
  HM: 1,
};

export const PALPATION_TO_IOP_MAP = {
  normal: {
    iopBand: "20-24",
    points: 1,
    note: "Palpation normal: provisional IOP <=24 (scored as 20-24)",
  },
  firm: {
    iopBand: "gte30",
    points: 3,
    note: "Palpation firm: provisional IOP >=30",
  },
  rock: {
    iopBand: "gte30",
    points: 3,
    note: "Palpation rock-hard: provisional IOP >=30",
  },
};

export const PROVISIONAL_URGENCY_PREFIX = "PROVISIONAL (No tonometer): ";
export const ROCK_PALPATION_WARNING = {
  message:
    "EMERGENCY WARNING: Rock-hard eye on palpation - suspect acute glaucoma. Immediate specialist review.",
  textColour: "red",
};

export const RISK_FACTOR_POINT = 0.2;
export const RISK_FACTOR_VALUES = [
  "Age",
  "Race",
  "Family Hist",
  "Myopia",
  "Diabetes/BP",
];
export const TOGGLE_ROW_SHIFT_THRESHOLD = 2;

function formatPointValue(value) {
  if (Number.isInteger(value)) {
    return String(value);
  }
  return value.toFixed(2).replace(/\.?0+$/, "");
}

const palpationSummary = [
  `Normal +${formatPointValue(PALPATION_TO_IOP_MAP.normal.points)} (treated as 20-24)`,
  `Firm +${formatPointValue(PALPATION_TO_IOP_MAP.firm.points)}`,
  `Rock +${formatPointValue(PALPATION_TO_IOP_MAP.rock.points)}`,
].join(", ");

const visionSummary = Object.entries(VISION_POINTS)
  .filter(([, points]) => points > 0)
  .map(([label, points]) => `${label} +${formatPointValue(points)}`)
  .join(", ");

export const INFO_LOGIC_ITEMS = [
  "Main grid needs pressure + C/D; exception: Rock palp triggers emergency warning even without C/D.",
  "Pressure points: <=20 +0, 20-24 +1, 25-29 +2, >=30 +3.",
  `Without tonometer, palp substitutes pressure: ${palpationSummary}.`,
  `Add-ons: Thin rim +1, Susp fields +1, Susp pupils +0.5, VA up to +1 (${visionSummary}), each risk factor +${formatPointValue(RISK_FACTOR_POINT)}.`,
  `If add-ons (not pressure/disc size) total >=${formatPointValue(TOGGLE_ROW_SHIFT_THRESHOLD)}, one IOP row shifts up.`,
  "Disc size: Small +2 and right-shift from low C/D bands; Large -2 and left-shift. Measured IOP overrides palpation.",
];

export const INFO_LOGIC_VERSION = "v1 - 18/5/2026";

export const GRID_CELL_COLOURS = [
  ["orange", "red", "red", "red"],
  ["orange", "orange", "red", "darkgrey"],
  ["white", "green", "orange", "darkgrey"],
  ["white", "white", "green", "darkgrey"],
];

export const URGENCY_BY_COLOUR = {
  red: {
    message: "URGENT: See specialist within 3 weeks",
    textColour: "red",
  },
  orange: {
    message: "SOON: See specialist within 2 months",
    textColour: "orange",
  },
  green: {
    message: "REVIEW: Check in 1 year",
    textColour: "green",
  },
  darkgrey: {
    message: "END-STAGE: Check other eye",
    textColour: "black",
  },
  white: {
    message: "NORMAL: Routine check-up only",
    textColour: "black",
  },
};
