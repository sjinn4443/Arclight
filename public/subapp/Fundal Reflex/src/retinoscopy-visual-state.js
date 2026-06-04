import { REFRACTION_VALUES } from "./retinoscopy-refraction-values.js?v=20260310-194";

const EDGE_DIMMING_PROFILE = Object.freeze({
  minimumFactor: 0.12,
  fadeDistanceRatio: 1.35,
  softness: 1.15,
});

const EDGE_VISUAL_BLEND = Object.freeze({
  brightnessFloor: 0.4,
  blurBoostPx: 0.5,
  opacityFloor: 0.25,
});

function isWithMovement(currentRefraction) {
  if (currentRefraction === REFRACTION_VALUES.ZERO) {
    return null;
  }

  if (currentRefraction === REFRACTION_VALUES.NORMAL_HYPER) {
    return true;
  }

  return currentRefraction.includes(REFRACTION_VALUES.PLUS);
}

function getReflexScale(currentRefraction) {
  switch (currentRefraction) {
    case REFRACTION_VALUES.HIGH_MINUS:
    case REFRACTION_VALUES.HIGH_PLUS:
      return 0.1;
    case REFRACTION_VALUES.MINUS:
    case REFRACTION_VALUES.PLUS:
      return 0.3;
    case REFRACTION_VALUES.NORMAL_HYPER:
      return 0.24;
    default:
      return 0.2;
  }
}

function getEdgeDimmingFactor({
  probeOffsetX,
  probeOffsetY,
  pupilRadiusPx,
  profile = EDGE_DIMMING_PROFILE,
}) {
  const centreDistance = Math.hypot(probeOffsetX, probeOffsetY);
  const startDistancePx = pupilRadiusPx;
  const { minimumFactor, fadeDistanceRatio, softness } = profile;

  if (centreDistance <= startDistancePx) {
    return 1;
  }

  const fadeDistancePx = Math.max(1.5, pupilRadiusPx * fadeDistanceRatio);
  const overshootPx = centreDistance - startDistancePx;
  const t = Math.max(0, Math.min(1, overshootPx / fadeDistancePx));
  const smoothT = t * t * (3 - 2 * t);
  const shapedT = Math.pow(smoothT, softness);
  return 1 - shapedT * (1 - Math.max(0, minimumFactor));
}

export function getCataractVisualState(cataractLevel) {
  const normalized = Math.max(0, Math.min(100, cataractLevel)) / 100;
  return {
    brightnessScale: 1 - normalized * 0.24,
    blurBoostPx: normalized * 0.8,
    opacityScale: 1 - normalized * 0.55,
  };
}

export function getEdgeVisualState({
  probeOffsetX,
  probeOffsetY,
  pupilRadiusPx,
}) {
  const edgeDimmingFactor = getEdgeDimmingFactor({
    probeOffsetX,
    probeOffsetY,
    pupilRadiusPx,
    profile: EDGE_DIMMING_PROFILE,
  });

  return {
    edgeBlurBoostPx: (1 - edgeDimmingFactor) * EDGE_VISUAL_BLEND.blurBoostPx,
    edgeBrightnessScale:
      EDGE_VISUAL_BLEND.brightnessFloor +
      edgeDimmingFactor * (1 - EDGE_VISUAL_BLEND.brightnessFloor),
    edgeOpacityScale:
      EDGE_VISUAL_BLEND.opacityFloor +
      edgeDimmingFactor * (1 - EDGE_VISUAL_BLEND.opacityFloor),
  };
}

export function getMovementStatusHtml({
  activeEye,
  activeRefraction,
  currentRefraction,
  flags,
  movementSign,
}) {
  if (currentRefraction === REFRACTION_VALUES.ZERO) {
    return "Neutral (0)";
  }

  if (flags.anisometropiaCase) {
    const eyeLabel = activeEye === "left" ? "RE" : "LE";
    const withDirection = activeRefraction.includes(REFRACTION_VALUES.PLUS);
    return withDirection
      ? `<em>${eyeLabel}</em> Fast With movement`
      : `<em>${eyeLabel}</em> Fast Against movement`;
  }

  if (flags.aphakiaCase) {
    return "<em>Very slow</em> With movement (aphakia)";
  }

  if (flags.acgCase) {
    return "<em>Vertical</em> Oval pupil (ACG)";
  }

  if (flags.aniridiaCase) {
    return "<em>Large</em> Pupil (aniridia)";
  }

  if (flags.smallPupilsCase) {
    return "<em>Small</em> Pupils";
  }

  if (flags.scissorsCase) {
    return "<em>Small</em> Scissors reflex";
  }

  if (flags.keratoconusCase) {
    return "<em>Irregular</em> Scissors reflex";
  }

  if (flags.cornealScarCase) {
    return "<em>Diffuse</em> Corneal scar reflex";
  }

  if (flags.vitreousHaemorrhageCase) {
    return "<em>Diffuse</em> Vitreous haemorrhage reflex";
  }

  if (flags.floatersCase) {
    return "<em>Mobile</em> Floater shadows";
  }

  if (flags.partialRetinalDetachmentCase) {
    return "<em>Sectoral</em> Dull reflex";
  }

  if (flags.poorTearFilmCase) {
    return "<em>Variable</em> Tear film reflex";
  }

  if (flags.smallCorticalCataractCase) {
    return "<em>Dull</em> Small cortical cataract reflex";
  }

  if (flags.bigCorticalCataractCase) {
    return "<em>Dull</em> Big cortical cataract reflex";
  }

  if (flags.centralSubCorticalCataractCase) {
    return "<em>Dull</em> Posterior subcapsular cataract reflex";
  }

  if (flags.posteriorPoleCataractCase) {
    return "<em>Very dull</em> Posterior pole cataract reflex";
  }

  if (flags.posteriorCapsularThickeningCase) {
    return "<em>Dull</em> Posterior capsular thickening reflex";
  }

  if (flags.denseCataractCase) {
    return "<em>Very dull</em> Dense cataract reflex";
  }

  if (flags.leucocoriaCase) {
    return "<em>White</em> Pupil reflex";
  }

  if (flags.irisTransilluminationCase) {
    return "<em>Normal</em> Iris transillumination";
  }

  if (flags.iridocyclitisKpsCase) {
    return "<em>Normal</em> Reflex with KPs";
  }

  if (flags.nasalColobomaCase) {
    return "<em>Normal</em> Nasal coloboma pupil";
  }

  if (flags.normalDarkCase) {
    return "<em>Normal</em> R, <em>very dull</em> L";
  }

  if (flags.bilateralAniridiaCase) {
    return "<em>RE</em>, <em>LE</em> aniridia";
  }

  if (flags.bilateralBlueNormalCase) {
    return "<em>RE</em>, <em>LE</em> normal blue reflex";
  }

  if (flags.bilateralPoorTearFilmCase) {
    return "<em>RE</em>, <em>LE</em> poor tear film";
  }

  if (flags.bilateralDullReflexCase) {
    return "<em>RE</em>, <em>LE</em> dull corneal reflex";
  }

  if (flags.bilateralDenseCataractCase) {
    return "<em>RE</em>, <em>LE</em> dense cataract";
  }

  if (flags.rightColobomaLeftNormalCase) {
    return "<em>RE</em> coloboma, <em>LE</em> normal";
  }

  if (flags.rightAcgLeftNormalCase) {
    return "<em>RE</em> ACG, <em>LE</em> normal";
  }

  if (flags.rightBigCorticalLeftSmallCorticalCase) {
    return "<em>RE</em> big cortical, <em>LE</em> slight cortical";
  }

  if (flags.rightIrisTransilluminationLeftNormalCase) {
    return "<em>RE</em> iris transillumination, <em>LE</em> normal";
  }

  if (flags.rightIolLeftPosteriorCapsularThickeningCase) {
    return "<em>RE</em> IOL reflection, <em>LE</em> capsular thickening";
  }

  if (flags.rightAphakiaLeftNormalCase) {
    return "<em>RE</em> aphakia, <em>LE</em> normal";
  }

  if (flags.rightFloatersLeftNormalCase) {
    return "<em>RE</em> floaters, <em>LE</em> normal";
  }

  if (flags.rightNormalLeftAnisocoriaCase) {
    return "<em>RE</em> normal, <em>LE</em> smaller pupil";
  }

  if (flags.rightNormalLeftCornealOpacityCase) {
    return "<em>RE</em> normal, <em>LE</em> corneal opacity";
  }

  if (flags.rightNormalLeftSubluxatedLensCase) {
    return "<em>RE</em> normal, <em>LE</em> subluxated lens";
  }

  if (flags.rightRetinalDetachmentLeftNormalCase) {
    return "<em>RE</em> retinal detachment, <em>LE</em> normal";
  }

  if (flags.rightRetinoblastomaLeftNormalCase) {
    return "<em>RE</em> retinoblastoma, <em>LE</em> normal";
  }

  if (flags.rightHyperLeftPosteriorPoleCase) {
    return "<em>RE</em> hypermetropia, <em>LE</em> posterior pole cataract";
  }

  if (flags.rightHyperLeftMyopiaCase) {
    return "<em>RE</em> hypermetropia, <em>LE</em> myopia";
  }

  if (flags.rightIridocyclitisLeftNormalCase) {
    return "<em>RE</em> iridocyclitis, <em>LE</em> normal";
  }

  if (flags.rightLargeExotropiaLeftCornealScarCase) {
    return "<em>RE</em> Large exotropia, <em>LE</em> corneal scar";
  }

  if (flags.rightVitreousHaemorrhageLeftNormalCase) {
    return "<em>RE</em> vitreous haemorrhage, <em>LE</em> normal";
  }

  if (flags.bilateralHighHypermetropiaCase) {
    return "<em>RE</em>, <em>LE</em> high hypermetropia";
  }

  if (flags.bilateralMyopiaCase) {
    return "<em>RE</em>, <em>LE</em> myopia";
  }

  if (flags.bilateralSmallPupilsCase) {
    return "<em>RE</em>, <em>LE</em> small pupils";
  }

  if (flags.bilateralSubcapsularCataractCase) {
    return "<em>RE</em>, <em>LE</em> posterior subcapsular cataract";
  }

  if (flags.bilateralKeratoconusCase) {
    return "<em>RE</em>, <em>LE</em> keratoconus";
  }

  if (flags.rightNormalLeftLargeEsotropiaCase) {
    return "<em>RE</em> Normal, <em>LE</em> large esotropia";
  }

  if (flags.cylinderCase) {
    if (Math.abs(movementSign) < 0.08) {
      return "Neutral meridian (astigmatism)";
    }

    const highCylinder = currentRefraction === REFRACTION_VALUES.HIGH_CYLINDER;
    const movementStrength =
      Math.pow(Math.abs(movementSign), 0.9) * (highCylinder ? 0.75 : 0.58);
    const speedWord = movementStrength >= 0.38 ? "Fast" : "Slow";

    return movementSign > 0
      ? `<em>${speedWord}</em> With movement (astigmatism)`
      : `<em>${speedWord}</em> Against movement (astigmatism)`;
  }

  if (activeRefraction === REFRACTION_VALUES.HIGH_PLUS) {
    return "<em>Slow</em> With movement (+)";
  }

  if (activeRefraction === REFRACTION_VALUES.HIGH_MINUS) {
    return "<em>Slow</em> Against movement (-)";
  }

  if (activeRefraction === REFRACTION_VALUES.PLUS) {
    return "<em>Fast</em> With movement (+)";
  }

  if (activeRefraction === REFRACTION_VALUES.MINUS) {
    return "<em>Fast</em> Against movement (-)";
  }

  return "Neutral (0)";
}
