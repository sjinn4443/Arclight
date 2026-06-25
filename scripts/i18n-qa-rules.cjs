const IGNORED_DATA_I18N_KEYS = new Set(["${key}"]);

const ALLOWED_EXACT_ENGLISH_KEYS = [
  /^menu\.(cybersight_link|retinopathy_of_prematurity_link|cvi_scotland_link)$/,
  /^videos\.(miresTitle|morphTitle|fundalReflexTitle)$/,
];

const ALLOWED_EXACT_ENGLISH_PATTERNS = [
  /^[<>&×☰⇐⇒()\s./:+\-|0-9]+$/,
  /\bArclight\b/i,
  /\bALAN\b/,
  /^Alan$/,
  /^Sujin Kang$/,
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
  /^OK$/,
  /^[A-Z]$/,
  /^\d+(?:\.\d+)?\s*m$/i,
  /^\d+[.-][A-Za-z]$/i,
  /^[A-Z](?:\s+[A-Z])+$/,
  /^(Amsler|IRMA|Morph|RAAB|Sauron)$/i,
];

const LOCALE_SPECIFIC_ALLOWED_EXACT_ENGLISH_KEYS = {
  french: [/^auto\.videos\.patient_b$/],
  portuguese: [/^auto\.glaucomascrollimages\.(central|halos|normal)$/],
  spanish: [/^i18nExtra\.no$/, /^auto\.glaucomascrollimages\.halos$/],
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
  {
    term: "pupil",
    guidance: "Translate as the eye pupil, not a school pupil/student.",
  },
  {
    term: "pupillary",
    guidance: "Translate as relating to the eye pupil, not to students.",
  },
];

const MEDICAL_HOMONYM_FORBIDDEN_TERMS = {
  pupil: {
    sourcePattern: /\bpupil(s|lary)?\b|\bdilat(e|es|ed|ing|ation)\b/i,
    sourcePathPattern: /pupil/i,
    subtitleSourcePattern: /\bpupil(s|lary)?\b|student-duce/i,
    forbiddenByLocale: {
      amharic: [/\u1270\u121b\u122a/],
      am: [/\u1270\u121b\u122a/],
      arabic: [/\u0637\u0627\u0644\u0628/],
      ar: [/\u0637\u0627\u0644\u0628/],
      bangla: [/\u099b\u09be\u09a4\u09cd\u09b0/, /\bstudent\b/i],
      bn: [/\u099b\u09be\u09a4\u09cd\u09b0/, /\bstudent\b/i],
      chichewa: [/wophunzira/i],
      ny: [/wophunzira/i],
      chinese: [/\u5b66\u751f/],
      zh: [/\u5b66\u751f/],
      french: [/\u00e9l\u00e8ves?/i],
      fr: [/\u00e9l\u00e8ves?/i],
      hausa: [/dalibi/i],
      ha: [/dalibi/i],
      hindi: [
        /\u091b\u093e\u0924\u094d\u0930/,
        /\u0935\u093f\u0926\u094d\u092f\u093e\u0930\u094d\u0925\u0940/,
      ],
      hi: [
        /\u091b\u093e\u0924\u094d\u0930/,
        /\u0935\u093f\u0926\u094d\u092f\u093e\u0930\u094d\u0925\u0940/,
      ],
      igbo: [/\bstudent\b/i],
      ig: [/\bstudent\b/i],
      indonesian: [/murid/i, /mahasiswa/i],
      id: [/murid/i, /mahasiswa/i],
      kinyarwanda: [/umunyeshuri/i, /abanyeshuri/i],
      rw: [/umunyeshuri/i, /abanyeshuri/i],
      korean: [/\uD559\uC0DD/],
      ko: [/\uD559\uC0DD/],
      lingala: [/\u00e9l\u00e8ves?/i],
      ln: [/\u00e9l\u00e8ves?/i],
      nepali: [
        /\u091b\u093e\u0924\u094d\u0930/,
        /\u0935\u093f\u0926\u094d\u092f\u093e\u0930\u094d\u0925\u0940/,
      ],
      ne: [
        /\u091b\u093e\u0924\u094d\u0930/,
        /\u0935\u093f\u0926\u094d\u092f\u093e\u0930\u094d\u0925\u0940/,
      ],
      portuguese: [/\balunos?\b/i],
      pt: [/\balunos?\b/i],
      shona: [/mudzidzi/i],
      sn: [/mudzidzi/i],
      spanish: [/\balumnos?\b/i],
      es: [/\balumnos?\b/i],
      swahili: [/mwanafunzi/i, /wanafunzi/i],
      sw: [/mwanafunzi/i, /wanafunzi/i],
      telugu: [/\u0c35\u0c3f\u0c26\u0c4d\u0c2f\u0c3e\u0c30\u0c4d\u0c25\u0c3f/],
      te: [/\u0c35\u0c3f\u0c26\u0c4d\u0c2f\u0c3e\u0c30\u0c4d\u0c25\u0c3f/],
      urdu: [/\u0637\u0627\u0644\u0628/],
      ur: [/\u0637\u0627\u0644\u0628/],
      zulu: [/umfundi/i, /abafundi/i],
      zu: [/umfundi/i, /abafundi/i],
    },
  },
};

module.exports = {
  IGNORED_DATA_I18N_KEYS,
  ALLOWED_EXACT_ENGLISH_KEYS,
  ALLOWED_EXACT_ENGLISH_PATTERNS,
  LOCALE_SPECIFIC_ALLOWED_EXACT_ENGLISH_KEYS,
  MEDICAL_HOMONYM_RULES,
  MEDICAL_HOMONYM_FORBIDDEN_TERMS,
};
