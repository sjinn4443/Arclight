const REFERRAL_LEVELS = {
  none: -1,
  unclear: -0.5,
  routine: 0,
  soon: 1,
  urgent: 2,
};

const REFERRAL_COPY = {
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

const CASE_INTERPRETATIONS = {
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
    likely: "Iris transillumination R, likely peripheral iridectomy or trauma",
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

export function buildClinicalInterpretation({
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
