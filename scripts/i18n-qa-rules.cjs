const IGNORED_DATA_I18N_KEYS = new Set(["${key}"]);

const ALLOWED_EXACT_ENGLISH_KEYS = [
  /^menu\.(cybersight_link|retinopathy_of_prematurity_link|cvi_scotland_link)$/,
  /^videos\.(miresTitle|morphTitle|fundalReflexTitle)$/,
];

const ALLOWED_EXACT_ENGLISH_PATTERNS = [
  /^[<>&×☰⇐⇒()\s./:+\-|0-9]+$/,
  /\bArclight\b/i,
  /\bALAN\b/,
  /\bWHO\b/,
  /\bUSAID\b/,
  /\bAAPOS\b/,
  /\bCVI\b/,
  /\bSightSIM\b/i,
  /\bCybersight\b/i,
  /\bOrbis\b/i,
  /\bRCO\b/i,
  /\bPDF\b/i,
  /\bDOCX\b/i,
  /\bPOAG\b/,
  /\bACAG\b/,
  /\bRAPD\b/,
  /\bENT\b/,
  /^Logo (One|Two)$/i,
  /^\d+:\d+/,
];

const LOCALE_SPECIFIC_ALLOWED_EXACT_ENGLISH_KEYS = {
  te: [
    /^menu\.(cybersight_link|retinopathy_of_prematurity_link|cvi_scotland_link)$/,
  ],
};

const MEDICAL_HOMONYM_RULES = [
  {
    term: "discharge",
    guidance:
      "Use the medical secretion meaning for eye/ear discharge, not discharge from care or dismissal.",
  },
  {
    term: "history",
    guidance:
      "Translate as clinical history/history taking, not a historical timeline or school-subject history.",
  },
  {
    term: "case",
    guidance:
      "Translate as a patient case/case study, not a physical box/container or legal case.",
  },
  {
    term: "referral",
    guidance:
      "Use the clinical referral meaning, not a generic recommendation or informal handoff.",
  },
  {
    term: "field",
    guidance:
      "In ophthalmology contexts, prefer visual field/field of vision, not an outdoor field.",
  },
  {
    term: "acuity",
    guidance:
      "Translate as visual acuity or sharpness of vision, not severity, cleverness, or general ability.",
  },
  {
    term: "floaters",
    guidance:
      "Translate as vitreous floaters/spots in vision, not floating objects or swimmers.",
  },
  {
    term: "red reflex",
    guidance:
      "Translate as the clinical red reflex/fundal reflex finding, not a generic red reflection.",
  },
  {
    term: "fundus",
    guidance:
      "Translate as the ocular fundus, not a generic bottom/base meaning.",
  },
];

module.exports = {
  IGNORED_DATA_I18N_KEYS,
  ALLOWED_EXACT_ENGLISH_KEYS,
  ALLOWED_EXACT_ENGLISH_PATTERNS,
  LOCALE_SPECIFIC_ALLOWED_EXACT_ENGLISH_KEYS,
  MEDICAL_HOMONYM_RULES,
};
