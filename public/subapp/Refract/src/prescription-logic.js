import { resolvePrescriptionConfig } from "./prescription-config.js";

const QUARTER_STEP = 0.25;
const HALF_STEP = 0.5;
const EPSILON = 0.001;

export function formatNumber(num, decimals) {
  return num.toFixed(decimals);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function roundAxis(value, multiple) {
  const rounded = Math.round(value / multiple) * multiple;
  if (rounded < 1 || rounded > 180) {
    return 180;
  }

  return rounded;
}

function roundQuarter(value) {
  return Math.round(value / QUARTER_STEP) * QUARTER_STEP;
}

function roundOutputAxis(axis, cylinder, config) {
  const magnitude = Math.abs(cylinder);
  const multiple =
    magnitude < config.axis.highCylCutoff ? config.axis.lowCylRounding : 1;

  return roundAxis(axis, multiple);
}

function numbersMatch(left, right) {
  if (left === null || right === null) {
    return left === right;
  }

  if (Number.isNaN(left) || Number.isNaN(right)) {
    return false;
  }

  return Math.abs(left - right) < EPSILON;
}

function reduceCylinder(cyl, reduction) {
  if (Number.isNaN(cyl)) {
    return Number.NaN;
  }

  const magnitude = Math.abs(cyl);
  const reducedMagnitude = Math.max(0, magnitude - reduction);
  return Math.sign(cyl) * reducedMagnitude;
}

function axisDistance(firstAxis, secondAxis) {
  let difference = Math.abs(firstAxis - secondAxis);
  if (difference > 90) {
    difference = 180 - difference;
  }

  return difference;
}

function unwrapAxis(axis) {
  return axis === 180 ? 0 : axis;
}

function normalizeAxis(axis) {
  let value = axis;

  while (value <= 0) {
    value += 180;
  }

  while (value > 180) {
    value -= 180;
  }

  if (Math.abs(value) < EPSILON) {
    return 180;
  }

  return value;
}

function crossesAxisSeam(firstAxis, secondAxis) {
  const first = unwrapAxis(firstAxis);
  const second = unwrapAxis(secondAxis);

  return (first <= 15 && second >= 165) || (second <= 15 && first >= 165);
}

function averageAxis(firstAxis, secondAxis) {
  const first = unwrapAxis(firstAxis);
  const second = unwrapAxis(secondAxis);
  let difference = second - first;

  if (difference > 90) {
    difference -= 180;
  }

  if (difference < -90) {
    difference += 180;
  }

  return normalizeAxis(first + difference / 2);
}

function interpolateAxis(firstAxis, secondAxis, pull) {
  const first = unwrapAxis(firstAxis);
  const second = unwrapAxis(secondAxis);
  let difference = second - first;

  if (difference > 90) {
    difference -= 180;
  }

  if (difference < -90) {
    difference += 180;
  }

  return normalizeAxis(first + difference * pull);
}

function buildConfidence(currentRx, vaGood, precise, accurate, config) {
  const noCurrent = Number.isNaN(currentRx.sph);
  const current =
    config.confidence.currentBase +
    (precise ? config.confidence.currentPrecise : 0) +
    (vaGood ? config.confidence.currentVaGood : 0);
  const objective =
    config.confidence.objectiveBase +
    (accurate ? config.confidence.objectiveAccurate : 0) +
    (noCurrent ? config.confidence.objectiveNoCurrent : 0);

  return {
    current,
    objective,
    signal: objective - current,
    noCurrent,
  };
}

function computePull(signal, componentConfig) {
  return clamp(
    (signal + componentConfig.pullOffset) / componentConfig.pullScale,
    0,
    1,
  );
}

function computeMovement(delta, pull, componentConfig) {
  const absDelta = Math.abs(delta);
  if (absDelta < EPSILON) {
    return 0;
  }

  let movement = roundQuarter(absDelta * pull);

  if (
    movement < QUARTER_STEP &&
    absDelta >= QUARTER_STEP &&
    pull >= componentConfig.quarterPull
  ) {
    movement = QUARTER_STEP;
  }

  if (componentConfig.maxStep != null) {
    movement = Math.min(movement, componentConfig.maxStep);
  }

  return Math.min(movement, absDelta);
}

function moveTowardTarget(currentValue, targetValue, pull, componentConfig) {
  if (Number.isNaN(currentValue)) {
    return Number.isNaN(targetValue) ? Number.NaN : roundQuarter(targetValue);
  }

  if (Number.isNaN(targetValue)) {
    return roundQuarter(currentValue);
  }

  const delta = targetValue - currentValue;
  const movement = computeMovement(delta, pull, componentConfig);

  if (movement < EPSILON) {
    return roundQuarter(currentValue);
  }

  return roundQuarter(currentValue + Math.sign(delta) * movement);
}

function buildObjectiveTarget(currentRx, objectiveRx, config) {
  const corroboratedCylinder =
    !Number.isNaN(currentRx.cyl) &&
    !Number.isNaN(objectiveRx.cyl) &&
    numbersMatch(currentRx.cyl, objectiveRx.cyl);
  const sphere = Number.isNaN(objectiveRx.sph)
    ? Number.NaN
    : roundQuarter(
        objectiveRx.sph -
          Math.sign(objectiveRx.sph) * config.sphere.objectiveBias,
      );
  const cylinder = corroboratedCylinder
    ? objectiveRx.cyl
    : reduceCylinder(objectiveRx.cyl, config.cylinder.objectiveReduction);
  const cyl = Number.isNaN(cylinder) ? Number.NaN : roundQuarter(cylinder);
  const axis =
    Number.isNaN(objectiveRx.axis) ||
    Number.isNaN(cyl) ||
    Math.abs(cyl) < EPSILON
      ? Number.NaN
      : roundOutputAxis(objectiveRx.axis, cyl, config);

  return { sphere, cyl, axis, corroboratedCylinder };
}

export function selectRx(
  currentRx,
  objectiveRx,
  vaGood,
  precise,
  accurate,
  overrides,
) {
  const config = resolvePrescriptionConfig(overrides);
  const confidence = buildConfidence(
    currentRx,
    vaGood,
    precise,
    accurate,
    config,
  );

  return {
    useObjective: confidence.signal > 0,
    rx: confidence.signal > 0 ? objectiveRx : currentRx,
    currentWeight: confidence.current,
    objectiveWeight: confidence.objective,
    signal: confidence.signal,
  };
}

export function processEye(
  currentRx,
  objectiveRx,
  vaGood,
  precise,
  accurate,
  overrides,
) {
  const config = resolvePrescriptionConfig(overrides);
  const confidence = buildConfidence(
    currentRx,
    vaGood,
    precise,
    accurate,
    config,
  );
  const objectiveTarget = buildObjectiveTarget(currentRx, objectiveRx, config);
  const spherePull = computePull(confidence.signal, config.sphere);
  const cylinderPull = computePull(confidence.signal, config.cylinder);
  const axisPull = computePull(confidence.signal, config.axis);
  const output = { sph: null, cyl: null, axis: null };
  const objectiveIsSphereOnly =
    !Number.isNaN(objectiveRx.cyl) && Math.abs(objectiveRx.cyl) < EPSILON;

  if (confidence.noCurrent) {
    output.sph = objectiveTarget.sphere;

    if (
      Number.isNaN(objectiveTarget.cyl) ||
      Math.abs(objectiveTarget.cyl) < config.cylinder.dropMagnitude
    ) {
      output.cyl = null;
      output.axis = null;
      return output;
    }

    output.cyl = objectiveTarget.cyl;
    output.axis = objectiveTarget.axis;
    return output;
  }

  output.sph = moveTowardTarget(
    currentRx.sph,
    objectiveTarget.sphere,
    spherePull,
    config.sphere,
  );

  if (Number.isNaN(currentRx.cyl)) {
    const introducedCylinder = moveTowardTarget(
      0,
      objectiveTarget.cyl,
      cylinderPull,
      config.cylinder,
    );

    if (
      Number.isNaN(objectiveTarget.cyl) ||
      Math.abs(introducedCylinder) < config.cylinder.introduceMagnitude
    ) {
      output.cyl = null;
      output.axis = null;
      return output;
    }

    output.cyl = introducedCylinder;
    output.axis = objectiveTarget.axis;
    return output;
  }

  if (
    accurate &&
    !vaGood &&
    objectiveIsSphereOnly &&
    Math.abs(currentRx.cyl) <= config.cylinder.tokenCurrentDrop
  ) {
    output.sph = moveTowardTarget(
      currentRx.sph,
      objectiveTarget.sphere,
      Math.max(spherePull, config.sphere.quarterPull),
      config.sphere,
    );
    output.cyl = null;
    output.axis = null;
    return output;
  }

  output.cyl = moveTowardTarget(
    currentRx.cyl,
    objectiveTarget.cyl,
    cylinderPull,
    config.cylinder,
  );

  const sphereGap =
    Number.isNaN(currentRx.sph) || Number.isNaN(objectiveRx.sph)
      ? Number.POSITIVE_INFINITY
      : Math.abs(currentRx.sph - objectiveRx.sph);
  const axisGap =
    Number.isNaN(currentRx.axis) || Number.isNaN(objectiveRx.axis)
      ? Number.POSITIVE_INFINITY
      : axisDistance(currentRx.axis, objectiveRx.axis);
  const canKeepCorroboratedAxis =
    accurate &&
    precise &&
    objectiveTarget.corroboratedCylinder &&
    sphereGap <= QUARTER_STEP &&
    axisGap < config.cylinder.corroboratedKeepGap;
  const canBlendCorroboratedAxis =
    accurate &&
    precise &&
    objectiveTarget.corroboratedCylinder &&
    sphereGap <= QUARTER_STEP &&
    axisGap >= config.cylinder.corroboratedKeepGap &&
    axisGap <= config.cylinder.corroboratedBlendGap;

  if (sphereGap < EPSILON) {
    output.sph = currentRx.sph;
  }

  if (canKeepCorroboratedAxis) {
    output.cyl = currentRx.cyl;
  } else if (canBlendCorroboratedAxis) {
    output.cyl =
      Math.abs(currentRx.cyl) >= 0.75 && Math.abs(currentRx.cyl) < 1.0
        ? reduceCylinder(currentRx.cyl, config.cylinder.objectiveReduction)
        : currentRx.cyl;
  }

  if (
    output.cyl !== null &&
    !Number.isNaN(output.cyl) &&
    Math.abs(output.cyl) < config.cylinder.dropMagnitude
  ) {
    output.cyl = null;
    output.axis = null;
    return output;
  }

  if (Number.isNaN(currentRx.axis)) {
    output.axis = objectiveTarget.axis;
    return output;
  }

  if (Number.isNaN(objectiveTarget.axis)) {
    output.axis = currentRx.axis;
    return output;
  }

  if (canKeepCorroboratedAxis) {
    output.axis =
      axisGap < EPSILON
        ? currentRx.axis
        : roundOutputAxis(currentRx.axis, output.cyl, config);
    return output;
  }

  if (canBlendCorroboratedAxis) {
    if (
      !crossesAxisSeam(currentRx.axis, objectiveRx.axis) &&
      Math.abs(output.cyl) <= HALF_STEP &&
      axisGap >= config.cylinder.lowCylHoldGap
    ) {
      output.axis = currentRx.axis;
      return output;
    }

    output.axis = crossesAxisSeam(currentRx.axis, objectiveRx.axis)
      ? roundOutputAxis(objectiveRx.axis, output.cyl, config)
      : roundOutputAxis(
          averageAxis(currentRx.axis, objectiveRx.axis),
          output.cyl,
          config,
        );
    return output;
  }

  const objectiveAxis = objectiveTarget.axis;
  const objectiveCylinderDelta =
    Number.isNaN(objectiveTarget.cyl) || Number.isNaN(currentRx.cyl)
      ? 0
      : Math.abs(objectiveTarget.cyl - currentRx.cyl);
  const outputCylinderDelta =
    output.cyl === null || Number.isNaN(output.cyl)
      ? Math.abs(currentRx.cyl)
      : Math.abs(output.cyl - currentRx.cyl);
  const cylinderProgress =
    objectiveCylinderDelta < EPSILON
      ? 0
      : clamp(outputCylinderDelta / objectiveCylinderDelta, 0, 1);
  const shouldHoldLowCylinderAxis =
    !crossesAxisSeam(currentRx.axis, objectiveRx.axis) &&
    Math.abs(output.cyl) <= HALF_STEP &&
    axisGap >= config.cylinder.lowCylHoldGap &&
    cylinderProgress < config.axis.objectiveFollowRatio;

  if (shouldHoldLowCylinderAxis) {
    output.axis = currentRx.axis;
    return output;
  }

  if (
    cylinderProgress >= config.axis.objectiveFollowRatio ||
    (!precise && accurate && axisGap <= config.axis.nonPreciseFollowGap)
  ) {
    const pull = Math.max(axisPull, cylinderProgress);
    const targetAxis = crossesAxisSeam(currentRx.axis, objectiveRx.axis)
      ? objectiveRx.axis
      : interpolateAxis(currentRx.axis, objectiveAxis, pull);
    output.axis = roundOutputAxis(targetAxis, output.cyl, config);
    return output;
  }

  if (
    axisPull >= config.axis.compromisePull &&
    axisGap <= config.cylinder.corroboratedBlendGap
  ) {
    const targetAxis = crossesAxisSeam(currentRx.axis, objectiveRx.axis)
      ? objectiveRx.axis
      : averageAxis(currentRx.axis, objectiveAxis);
    output.axis = roundOutputAxis(targetAxis, output.cyl, config);
    return output;
  }

  output.axis = currentRx.axis;
  return output;
}

export function computeReadingAddition(ageValue, health, overrides) {
  const config = resolvePrescriptionConfig(overrides);
  const age = parseFloat(ageValue);
  if (Number.isNaN(age) || age < config.add.ageGate) {
    return Number.NaN;
  }

  const matchingBand = config.add.bands.find(
    (band) => age >= band.min && age <= band.max,
  );
  if (!matchingBand) {
    return null;
  }

  return matchingBand.add + (health ? config.add.healthBoost : 0);
}

export function selectReadingAddition(
  ageValue,
  health,
  currentAdd,
  objectiveAdd,
  overrides,
) {
  if (!Number.isNaN(currentAdd)) {
    return currentAdd;
  }

  if (!Number.isNaN(objectiveAdd)) {
    return objectiveAdd;
  }

  return computeReadingAddition(ageValue, health, overrides);
}

export function checkOrangeFlag(sph) {
  return !Number.isNaN(sph) && sph > -0.5 && sph < 0.75;
}

export function transposePrescription(prescription) {
  const values = [prescription.sph, prescription.cyl, prescription.axis];
  if (values.some((value) => Number.isNaN(value))) {
    return prescription;
  }

  let axis = prescription.axis + 90;
  if (axis > 180) {
    axis -= 180;
  }

  return {
    sph: prescription.sph + prescription.cyl,
    cyl: -prescription.cyl,
    axis,
  };
}
