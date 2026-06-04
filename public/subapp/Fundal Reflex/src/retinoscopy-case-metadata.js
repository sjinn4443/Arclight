import {
  AXIS_DEPENDENT_REFRACTION_VALUES,
  CYLINDER_REFRACTION_VALUES,
} from "./constants.js?v=20260310-194";
export {
  DEFAULT_REFLEX_BACKGROUND,
  REFRACTION_VALUES,
} from "./retinoscopy-refraction-values.js?v=20260430-3";
export {
  buildCorticalCataractOverlay,
  createCorticalCataractPattern,
  normalizeTo180,
  randomCylinderAxisDeg,
  smallestAxisDifference,
} from "./retinoscopy-cortical-utils.js?v=20260308-133";
export {
  getCataractVisualState,
  getEdgeVisualState,
  getMovementStatusHtml,
} from "./retinoscopy-visual-state.js?v=20260428-6";
import { REFRACTION_VALUES } from "./retinoscopy-refraction-values.js?v=20260430-3";

export function getCaseFlags(currentRefraction) {
  const acgCase = currentRefraction === REFRACTION_VALUES.ACG;
  const aniridiaCase = currentRefraction === REFRACTION_VALUES.ANIRIDIA;
  const aphakiaCase = currentRefraction === REFRACTION_VALUES.APHAKIA;
  const cylinderCase = CYLINDER_REFRACTION_VALUES.has(currentRefraction);
  const scissorsCase = currentRefraction === REFRACTION_VALUES.SMALL_SCISSORS;
  const keratoconusCase = currentRefraction === REFRACTION_VALUES.KERATOCONUS;
  const cornealScarCase = currentRefraction === REFRACTION_VALUES.CORNEAL_SCAR;
  const denseCataractCase =
    currentRefraction === REFRACTION_VALUES.DENSE_CATARACT;
  const floatersCase = currentRefraction === REFRACTION_VALUES.FLOATERS;
  const anisometropiaCase =
    currentRefraction === REFRACTION_VALUES.ANISOMETROPIA;
  const irisTransilluminationCase =
    currentRefraction === REFRACTION_VALUES.IRIS_TRANSILLUMINATION;
  const iridocyclitisKpsCase =
    currentRefraction === REFRACTION_VALUES.IRIDOCYCLITIS_KPS;
  const leucocoriaCase = currentRefraction === REFRACTION_VALUES.LEUCOCORIA;
  const nasalColobomaCase =
    currentRefraction === REFRACTION_VALUES.NASAL_COLOBOMA;
  const normalDarkCase = currentRefraction === REFRACTION_VALUES.NORMAL_DARK;
  const partialRetinalDetachmentCase =
    currentRefraction === REFRACTION_VALUES.PARTIAL_RETINAL_DETACHMENT;
  const posteriorCapsularThickeningCase =
    currentRefraction === REFRACTION_VALUES.POSTERIOR_CAPSULAR_THICKENING;
  const poorTearFilmCase =
    currentRefraction === REFRACTION_VALUES.POOR_TEAR_FILM;
  const rightColobomaLeftNormalCase =
    currentRefraction === REFRACTION_VALUES.RIGHT_COLOBOMA_LEFT_NORMAL;
  const rightAcgLeftNormalCase =
    currentRefraction === REFRACTION_VALUES.RIGHT_ACG_LEFT_NORMAL;
  const rightBigCorticalLeftSmallCorticalCase =
    currentRefraction ===
    REFRACTION_VALUES.RIGHT_BIG_CORTICAL_LEFT_SMALL_CORTICAL;
  const rightHyperLeftPosteriorPoleCase =
    currentRefraction === REFRACTION_VALUES.RIGHT_HYPER_LEFT_POSTERIOR_POLE;
  const rightHyperLeftMyopiaCase =
    currentRefraction === REFRACTION_VALUES.RIGHT_HYPER_LEFT_MYOPIA;
  const rightIridocyclitisLeftNormalCase =
    currentRefraction === REFRACTION_VALUES.RIGHT_IRIDOCYCLITIS_LEFT_NORMAL;
  const rightIrisTransilluminationLeftNormalCase =
    currentRefraction ===
    REFRACTION_VALUES.RIGHT_IRIS_TRANSILLUMINATION_LEFT_NORMAL;
  const rightIolLeftPosteriorCapsularThickeningCase =
    currentRefraction ===
    REFRACTION_VALUES.RIGHT_IOL_LEFT_POSTERIOR_CAPSULAR_THICKENING;
  const rightLargeExotropiaLeftCornealScarCase =
    currentRefraction ===
    REFRACTION_VALUES.RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR;
  const rightAphakiaLeftNormalCase =
    currentRefraction === REFRACTION_VALUES.RIGHT_APHAKIA_LEFT_NORMAL;
  const rightFloatersLeftNormalCase =
    currentRefraction === REFRACTION_VALUES.RIGHT_FLOATERS_LEFT_NORMAL;
  const rightNormalLeftAnisocoriaCase =
    currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_ANISOCORIA;
  const rightNormalLeftCornealOpacityCase =
    currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY;
  const rightNormalLeftSubluxatedLensCase =
    currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS;
  const rightRetinalDetachmentLeftNormalCase =
    currentRefraction ===
    REFRACTION_VALUES.RIGHT_RETINAL_DETACHMENT_LEFT_NORMAL;
  const rightRetinoblastomaLeftNormalCase =
    currentRefraction === REFRACTION_VALUES.RIGHT_RETINOBLASTOMA_LEFT_NORMAL;
  const rightNormalLeftLargeEsotropiaCase =
    currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_LARGE_ESOTROPIA;
  const rightVitreousHaemorrhageLeftNormalCase =
    currentRefraction ===
    REFRACTION_VALUES.RIGHT_VITREOUS_HAEMORRHAGE_LEFT_NORMAL;
  const techniqueChildLookingAwayCase =
    currentRefraction === REFRACTION_VALUES.TECHNIQUE_CHILD_LOOKING_AWAY;
  const techniqueUpperLidBlockingCase =
    currentRefraction === REFRACTION_VALUES.TECHNIQUE_UPPER_LID_BLOCKING;
  const smallCorticalCataractCase =
    currentRefraction === REFRACTION_VALUES.SMALL_CORTICAL_CATARACT;
  const smallPupilsCase = currentRefraction === REFRACTION_VALUES.SMALL_PUPILS;
  const bigCorticalCataractCase =
    currentRefraction === REFRACTION_VALUES.BIG_CORTICAL_CATARACT;
  const bilateralBlueNormalCase =
    currentRefraction === REFRACTION_VALUES.BILATERAL_BLUE_NORMAL;
  const bilateralPoorTearFilmCase =
    currentRefraction === REFRACTION_VALUES.BILATERAL_POOR_TEAR_FILM;
  const bilateralDullReflexCase =
    currentRefraction === REFRACTION_VALUES.BILATERAL_DULL_REFLEX;
  const bilateralDenseCataractCase =
    currentRefraction === REFRACTION_VALUES.BILATERAL_DENSE_CATARACT;
  const bilateralAniridiaCase =
    currentRefraction === REFRACTION_VALUES.BILATERAL_ANIRIDIA;
  const bilateralHighHypermetropiaCase =
    currentRefraction === REFRACTION_VALUES.BILATERAL_HIGH_HYPERMETROPIA;
  const bilateralKeratoconusCase =
    currentRefraction === REFRACTION_VALUES.BILATERAL_KERATOCONUS;
  const bilateralMyopiaCase =
    currentRefraction === REFRACTION_VALUES.BILATERAL_MYOPIA;
  const bilateralSmallPupilsCase =
    currentRefraction === REFRACTION_VALUES.BILATERAL_SMALL_PUPILS;
  const bilateralSubcapsularCataractCase =
    currentRefraction === REFRACTION_VALUES.BILATERAL_SUBCAPSULAR_CATARACT;
  const centralSubCorticalCataractCase =
    currentRefraction === REFRACTION_VALUES.CENTRAL_SUB_CORTICAL_CATARACT;
  const posteriorPoleCataractCase =
    currentRefraction === REFRACTION_VALUES.POSTERIOR_POLE_CATARACT;
  const vitreousHaemorrhageCase =
    currentRefraction === REFRACTION_VALUES.VITREOUS_HAEMORRHAGE;

  return {
    acgCase,
    aniridiaCase,
    aphakiaCase,
    anisometropiaCase,
    bigCorticalCataractCase,
    bilateralBlueNormalCase,
    bilateralPoorTearFilmCase,
    bilateralDullReflexCase,
    bilateralDenseCataractCase,
    bilateralAniridiaCase,
    bilateralHighHypermetropiaCase,
    bilateralKeratoconusCase,
    bilateralMyopiaCase,
    bilateralSmallPupilsCase,
    bilateralSubcapsularCataractCase,
    centralSubCorticalCataractCase,
    cornealScarCase,
    corticalCataractCase: smallCorticalCataractCase || bigCorticalCataractCase,
    cylinderCase,
    denseCataractCase,
    floatersCase,
    iridocyclitisKpsCase,
    irisTransilluminationCase,
    keratoconusCase,
    leucocoriaCase,
    nasalColobomaCase,
    normalDarkCase,
    partialRetinalDetachmentCase,
    posteriorCapsularThickeningCase,
    posteriorPoleCataractCase,
    poorTearFilmCase,
    rightAcgLeftNormalCase,
    rightColobomaLeftNormalCase,
    rightBigCorticalLeftSmallCorticalCase,
    rightHyperLeftPosteriorPoleCase,
    rightHyperLeftMyopiaCase,
    rightIridocyclitisLeftNormalCase,
    rightIrisTransilluminationLeftNormalCase,
    rightIolLeftPosteriorCapsularThickeningCase,
    rightLargeExotropiaLeftCornealScarCase,
    rightAphakiaLeftNormalCase,
    rightFloatersLeftNormalCase,
    rightNormalLeftAnisocoriaCase,
    rightNormalLeftCornealOpacityCase,
    rightNormalLeftSubluxatedLensCase,
    rightRetinalDetachmentLeftNormalCase,
    rightRetinoblastomaLeftNormalCase,
    rightNormalLeftLargeEsotropiaCase,
    rightVitreousHaemorrhageLeftNormalCase,
    scissorsCase,
    smallCorticalCataractCase,
    smallPupilsCase,
    techniqueChildLookingAwayCase,
    techniqueUpperLidBlockingCase,
    vitreousHaemorrhageCase,
  };
}

export function isAxisDependentCase(currentRefraction) {
  return AXIS_DEPENDENT_REFRACTION_VALUES.has(currentRefraction);
}

export function getActiveRefractionForMode(currentRefraction, activeEye) {
  if (currentRefraction === REFRACTION_VALUES.ANISOMETROPIA) {
    return activeEye === "left"
      ? REFRACTION_VALUES.PLUS
      : REFRACTION_VALUES.MINUS;
  }

  if (currentRefraction === REFRACTION_VALUES.ACG) {
    return REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.ANIRIDIA) {
    return REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.BILATERAL_ANIRIDIA) {
    return REFRACTION_VALUES.ANIRIDIA;
  }

  if (currentRefraction === REFRACTION_VALUES.BILATERAL_BLUE_NORMAL) {
    return REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.BILATERAL_POOR_TEAR_FILM) {
    return REFRACTION_VALUES.POOR_TEAR_FILM;
  }

  if (currentRefraction === REFRACTION_VALUES.BILATERAL_DULL_REFLEX) {
    return REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.IRIS_TRANSILLUMINATION) {
    return REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.IRIDOCYCLITIS_KPS) {
    return REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.NASAL_COLOBOMA) {
    return REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.NORMAL_DARK) {
    return activeEye === "right"
      ? REFRACTION_VALUES.NORMAL_DARK
      : REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.RIGHT_COLOBOMA_LEFT_NORMAL) {
    return REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.RIGHT_ACG_LEFT_NORMAL) {
    return REFRACTION_VALUES.ZERO;
  }

  if (
    currentRefraction === REFRACTION_VALUES.RIGHT_RETINOBLASTOMA_LEFT_NORMAL
  ) {
    return activeEye === "left"
      ? REFRACTION_VALUES.LEUCOCORIA
      : REFRACTION_VALUES.ZERO;
  }

  if (
    currentRefraction ===
    REFRACTION_VALUES.RIGHT_IRIS_TRANSILLUMINATION_LEFT_NORMAL
  ) {
    return REFRACTION_VALUES.ZERO;
  }

  if (
    currentRefraction ===
    REFRACTION_VALUES.RIGHT_IOL_LEFT_POSTERIOR_CAPSULAR_THICKENING
  ) {
    return activeEye === "left"
      ? REFRACTION_VALUES.ZERO
      : REFRACTION_VALUES.POSTERIOR_CAPSULAR_THICKENING;
  }

  if (currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_ANISOCORIA) {
    return REFRACTION_VALUES.ZERO;
  }

  if (
    currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY
  ) {
    return REFRACTION_VALUES.ZERO;
  }

  if (
    currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS
  ) {
    return REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.RIGHT_APHAKIA_LEFT_NORMAL) {
    return activeEye === "left"
      ? REFRACTION_VALUES.APHAKIA
      : REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.RIGHT_FLOATERS_LEFT_NORMAL) {
    return REFRACTION_VALUES.ZERO;
  }

  if (
    currentRefraction ===
    REFRACTION_VALUES.RIGHT_VITREOUS_HAEMORRHAGE_LEFT_NORMAL
  ) {
    return REFRACTION_VALUES.ZERO;
  }

  if (
    currentRefraction === REFRACTION_VALUES.RIGHT_RETINAL_DETACHMENT_LEFT_NORMAL
  ) {
    return activeEye === "left"
      ? REFRACTION_VALUES.PARTIAL_RETINAL_DETACHMENT
      : REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.BILATERAL_DENSE_CATARACT) {
    return REFRACTION_VALUES.DENSE_CATARACT;
  }

  if (
    currentRefraction ===
    REFRACTION_VALUES.RIGHT_BIG_CORTICAL_LEFT_SMALL_CORTICAL
  ) {
    return activeEye === "left"
      ? REFRACTION_VALUES.BIG_CORTICAL_CATARACT
      : REFRACTION_VALUES.SMALL_CORTICAL_CATARACT;
  }

  if (currentRefraction === REFRACTION_VALUES.RIGHT_HYPER_LEFT_POSTERIOR_POLE) {
    return activeEye === "left"
      ? REFRACTION_VALUES.NORMAL_HYPER
      : REFRACTION_VALUES.POSTERIOR_POLE_CATARACT;
  }

  if (currentRefraction === REFRACTION_VALUES.RIGHT_HYPER_LEFT_MYOPIA) {
    return activeEye === "left"
      ? REFRACTION_VALUES.NORMAL_HYPER
      : REFRACTION_VALUES.MINUS;
  }

  if (currentRefraction === REFRACTION_VALUES.RIGHT_IRIDOCYCLITIS_LEFT_NORMAL) {
    return REFRACTION_VALUES.ZERO;
  }

  if (
    currentRefraction ===
    REFRACTION_VALUES.RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR
  ) {
    return activeEye === "left"
      ? REFRACTION_VALUES.ZERO
      : REFRACTION_VALUES.CORNEAL_SCAR;
  }

  if (currentRefraction === REFRACTION_VALUES.BILATERAL_HIGH_HYPERMETROPIA) {
    return REFRACTION_VALUES.NORMAL_HYPER;
  }

  if (currentRefraction === REFRACTION_VALUES.BILATERAL_MYOPIA) {
    return REFRACTION_VALUES.MINUS;
  }

  if (currentRefraction === REFRACTION_VALUES.BILATERAL_SMALL_PUPILS) {
    return REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.BILATERAL_SUBCAPSULAR_CATARACT) {
    return REFRACTION_VALUES.CENTRAL_SUB_CORTICAL_CATARACT;
  }

  if (currentRefraction === REFRACTION_VALUES.BILATERAL_KERATOCONUS) {
    return REFRACTION_VALUES.KERATOCONUS;
  }

  if (
    currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_LARGE_ESOTROPIA
  ) {
    return REFRACTION_VALUES.ZERO;
  }

  if (
    currentRefraction === REFRACTION_VALUES.TECHNIQUE_CHILD_LOOKING_AWAY ||
    currentRefraction === REFRACTION_VALUES.TECHNIQUE_UPPER_LID_BLOCKING
  ) {
    return REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.POSTERIOR_CAPSULAR_THICKENING) {
    return REFRACTION_VALUES.ZERO;
  }

  if (currentRefraction === REFRACTION_VALUES.SMALL_PUPILS) {
    return REFRACTION_VALUES.ZERO;
  }

  return currentRefraction;
}

export function getVisualFlagsForEye(currentRefraction, eyeType) {
  if (currentRefraction === REFRACTION_VALUES.RIGHT_COLOBOMA_LEFT_NORMAL) {
    return getCaseFlags(
      eyeType === "left"
        ? REFRACTION_VALUES.NASAL_COLOBOMA
        : REFRACTION_VALUES.ZERO,
    );
  }

  if (
    currentRefraction ===
    REFRACTION_VALUES.RIGHT_IRIS_TRANSILLUMINATION_LEFT_NORMAL
  ) {
    return getCaseFlags(
      eyeType === "left"
        ? REFRACTION_VALUES.IRIS_TRANSILLUMINATION
        : REFRACTION_VALUES.ZERO,
    );
  }

  if (currentRefraction === REFRACTION_VALUES.RIGHT_ACG_LEFT_NORMAL) {
    return getCaseFlags(
      eyeType === "left" ? REFRACTION_VALUES.ACG : REFRACTION_VALUES.ZERO,
    );
  }

  if (currentRefraction === REFRACTION_VALUES.RIGHT_IRIDOCYCLITIS_LEFT_NORMAL) {
    return getCaseFlags(
      eyeType === "left"
        ? REFRACTION_VALUES.IRIDOCYCLITIS_KPS
        : REFRACTION_VALUES.ZERO,
    );
  }

  if (currentRefraction === REFRACTION_VALUES.RIGHT_FLOATERS_LEFT_NORMAL) {
    return getCaseFlags(
      eyeType === "left" ? REFRACTION_VALUES.FLOATERS : REFRACTION_VALUES.ZERO,
    );
  }

  if (
    currentRefraction ===
    REFRACTION_VALUES.RIGHT_VITREOUS_HAEMORRHAGE_LEFT_NORMAL
  ) {
    return getCaseFlags(
      eyeType === "left"
        ? REFRACTION_VALUES.VITREOUS_HAEMORRHAGE
        : REFRACTION_VALUES.ZERO,
    );
  }

  if (
    currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY
  ) {
    return getCaseFlags(REFRACTION_VALUES.ZERO);
  }

  if (currentRefraction === REFRACTION_VALUES.BILATERAL_SMALL_PUPILS) {
    return getCaseFlags(REFRACTION_VALUES.SMALL_PUPILS);
  }

  if (currentRefraction === REFRACTION_VALUES.BILATERAL_DULL_REFLEX) {
    return getCaseFlags(REFRACTION_VALUES.ZERO);
  }

  if (currentRefraction === REFRACTION_VALUES.BILATERAL_POOR_TEAR_FILM) {
    return getCaseFlags(REFRACTION_VALUES.POOR_TEAR_FILM);
  }

  if (
    currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS
  ) {
    return getCaseFlags(REFRACTION_VALUES.ZERO);
  }

  if (
    currentRefraction === REFRACTION_VALUES.NORMAL_DARK ||
    currentRefraction === REFRACTION_VALUES.BILATERAL_BLUE_NORMAL ||
    currentRefraction === REFRACTION_VALUES.BILATERAL_POOR_TEAR_FILM ||
    currentRefraction === REFRACTION_VALUES.BILATERAL_ANIRIDIA ||
    currentRefraction === REFRACTION_VALUES.BILATERAL_DENSE_CATARACT ||
    currentRefraction === REFRACTION_VALUES.BILATERAL_HIGH_HYPERMETROPIA ||
    currentRefraction === REFRACTION_VALUES.BILATERAL_KERATOCONUS ||
    currentRefraction === REFRACTION_VALUES.BILATERAL_MYOPIA ||
    currentRefraction === REFRACTION_VALUES.BILATERAL_SUBCAPSULAR_CATARACT ||
    currentRefraction === REFRACTION_VALUES.RIGHT_ACG_LEFT_NORMAL ||
    currentRefraction === REFRACTION_VALUES.RIGHT_COLOBOMA_LEFT_NORMAL ||
    currentRefraction ===
      REFRACTION_VALUES.RIGHT_BIG_CORTICAL_LEFT_SMALL_CORTICAL ||
    currentRefraction === REFRACTION_VALUES.RIGHT_HYPER_LEFT_MYOPIA ||
    currentRefraction === REFRACTION_VALUES.RIGHT_IRIDOCYCLITIS_LEFT_NORMAL ||
    currentRefraction === REFRACTION_VALUES.RIGHT_HYPER_LEFT_POSTERIOR_POLE ||
    currentRefraction ===
      REFRACTION_VALUES.RIGHT_IOL_LEFT_POSTERIOR_CAPSULAR_THICKENING ||
    currentRefraction ===
      REFRACTION_VALUES.RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR ||
    currentRefraction === REFRACTION_VALUES.RIGHT_APHAKIA_LEFT_NORMAL ||
    currentRefraction === REFRACTION_VALUES.RIGHT_FLOATERS_LEFT_NORMAL ||
    currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_ANISOCORIA ||
    currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY ||
    currentRefraction === REFRACTION_VALUES.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS ||
    currentRefraction === REFRACTION_VALUES.RIGHT_RETINOBLASTOMA_LEFT_NORMAL ||
    currentRefraction === REFRACTION_VALUES.TECHNIQUE_CHILD_LOOKING_AWAY ||
    currentRefraction === REFRACTION_VALUES.TECHNIQUE_UPPER_LID_BLOCKING ||
    currentRefraction ===
      REFRACTION_VALUES.RIGHT_RETINAL_DETACHMENT_LEFT_NORMAL ||
    currentRefraction ===
      REFRACTION_VALUES.RIGHT_VITREOUS_HAEMORRHAGE_LEFT_NORMAL
  ) {
    return getCaseFlags(getActiveRefractionForMode(currentRefraction, eyeType));
  }

  return getCaseFlags(currentRefraction);
}
