"use strict";
(() => {
  // src/prescription-config.js
  var DEFAULT_READING_ADD_BANDS = [
    { min: 40, max: 43, add: 0.75 },
    { min: 44, max: 47, add: 1.25 },
    { min: 48, max: 51, add: 1.25 },
    { min: 52, max: 55, add: 1.5 },
    { min: 56, max: 59, add: 1.75 },
    { min: 60, max: 63, add: 2.25 },
    { min: 64, max: 68, add: 2.25 },
    { min: 69, max: 77, add: 2.5 },
    { min: 78, max: Number.POSITIVE_INFINITY, add: 2.75 },
  ];
  var DEFAULT_PRESCRIPTION_CONFIG = {
    confidence: {
      currentBase: 1,
      currentPrecise: 2,
      currentVaGood: 0.75,
      objectiveBase: 1,
      objectiveAccurate: 1.5,
      objectiveNoCurrent: 2.5,
    },
    sphere: {
      objectiveBias: 0.25,
      pullOffset: 1,
      pullScale: 4,
      quarterPull: 0.2,
      maxStep: 0.25,
    },
    cylinder: {
      objectiveReduction: 0.25,
      pullOffset: 1,
      pullScale: 2.6,
      quarterPull: 0.2,
      maxStep: 0.75,
      dropMagnitude: 0.25,
      introduceMagnitude: 0.25,
      tokenCurrentDrop: 0.25,
      corroboratedKeepGap: 8,
      corroboratedBlendGap: 20,
      lowCylHoldGap: 10,
    },
    axis: {
      lowCylRounding: 5,
      highCylCutoff: 1.75,
      pullOffset: 0,
      pullScale: 3,
      compromisePull: 0.3,
      objectiveFollowRatio: 0.5,
      nonPreciseFollowGap: 15,
    },
    add: {
      bands: DEFAULT_READING_ADD_BANDS,
      healthBoost: 0.25,
      ageGate: 46,
    },
  };
  function resolvePrescriptionConfig(overrides = {}) {
    var _a, _b;
    return {
      confidence: {
        ...DEFAULT_PRESCRIPTION_CONFIG.confidence,
        ...overrides.confidence,
      },
      sphere: {
        ...DEFAULT_PRESCRIPTION_CONFIG.sphere,
        ...overrides.sphere,
      },
      cylinder: {
        ...DEFAULT_PRESCRIPTION_CONFIG.cylinder,
        ...overrides.cylinder,
      },
      axis: {
        ...DEFAULT_PRESCRIPTION_CONFIG.axis,
        ...overrides.axis,
      },
      add: {
        ...DEFAULT_PRESCRIPTION_CONFIG.add,
        ...overrides.add,
        bands:
          (_b = (_a = overrides.add) == null ? void 0 : _a.bands) != null
            ? _b
            : DEFAULT_PRESCRIPTION_CONFIG.add.bands,
      },
    };
  }

  // src/prescription-logic.js?v=20260310-17
  function checkOrangeFlag(sph) {
    return !Number.isNaN(sph) && sph > -0.5 && sph < 0.75;
  }
  function transposePrescription(prescription) {
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

  // src/prescription-logic.js
  var QUARTER_STEP = 0.25;
  var HALF_STEP = 0.5;
  var EPSILON = 1e-3;
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
  function roundAxis(value, multiple) {
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
  function processEye(
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
    const objectiveTarget = buildObjectiveTarget(
      currentRx,
      objectiveRx,
      config,
    );
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
        Math.abs(currentRx.cyl) >= 0.75 && Math.abs(currentRx.cyl) < 1
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
  function computeReadingAddition(ageValue, health, overrides) {
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
  function selectReadingAddition(
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

  // src/prescription-engine.js?v=20260310-17
  function computePrescriptionCase({
    age,
    context,
    currentRightEye,
    currentLeftEye,
    objectiveRightEye,
    objectiveLeftEye,
    currentAdd,
    objectiveAdd,
    config,
  }) {
    var _a, _b;
    const rightAccurate =
      (_a = context.rightAccurate) != null ? _a : context.accurate;
    const leftAccurate =
      (_b = context.leftAccurate) != null ? _b : context.accurate;
    return {
      rightEye: processEye(
        currentRightEye,
        objectiveRightEye,
        context.vaGood,
        context.precise,
        rightAccurate,
        config,
      ),
      leftEye: processEye(
        currentLeftEye,
        objectiveLeftEye,
        context.vaGood,
        context.precise,
        leftAccurate,
        config,
      ),
      readingAdd: selectReadingAddition(
        age,
        context.health,
        currentAdd,
        objectiveAdd,
        config,
      ),
    };
  }

  // src/prescription-logic.js?v=20260310-14
  function formatNumber(num, decimals) {
    return num.toFixed(decimals);
  }

  // src/ui/field-metadata.js?v=20260310-14
  var POSITIVE_SIGN = "+";
  var NEGATIVE_SIGN = "-";
  function getPlaceholder(input) {
    return ((input == null ? void 0 : input.placeholder) || "")
      .trim()
      .toLowerCase();
  }
  function getFieldId(input) {
    return ((input == null ? void 0 : input.id) || "").trim().toLowerCase();
  }
  function getFieldStep(input) {
    return parseFloat(input.getAttribute("step")) || 0.25;
  }
  function isAxisField(input) {
    const placeholder = getPlaceholder(input);
    const id = getFieldId(input);
    return placeholder === "axis" || id.includes("axis");
  }
  function isAgeField(input) {
    return getFieldId(input) === "age";
  }
  function isAddField(input) {
    const placeholder = getPlaceholder(input);
    const id = getFieldId(input);
    return placeholder === "add" || id.includes("add");
  }
  function isCylinderField(input) {
    return getPlaceholder(input) === "cyl";
  }
  function isSphereField(input) {
    return getPlaceholder(input) === "sph";
  }
  function formatFieldValue(value, step) {
    const numericValue = parseFloat(value) || 0;
    const roundedValue = Math.round(numericValue / step) * step;
    return step < 1
      ? roundedValue.toFixed(2)
      : String(Math.round(roundedValue));
  }
  function getDefaultInputBorder(input) {
    return input.closest(".results-section")
      ? "1.5px solid #2c3038"
      : "1.5px solid var(--input-border)";
  }

  // src/ui/visual-placeholders.js?v=20260310-14
  function resolveWrapper(input) {
    var _a;
    return (_a =
      input == null ? void 0 : input.closest(".spinner-container")) != null
      ? _a
      : null;
  }
  function getPlaceholderText(input) {
    return (
      (input == null ? void 0 : input.getAttribute("placeholder")) || ""
    ).trim();
  }
  function syncVisualPlaceholder(input) {
    const wrapper = resolveWrapper(input);
    const placeholder = getPlaceholderText(input);
    if (!wrapper || !placeholder) {
      return;
    }
    wrapper.classList.add("has-visual-placeholder");
    wrapper.dataset.placeholder = placeholder;
    wrapper.dataset.empty = input.value.trim() === "" ? "true" : "false";
  }
  function initVisualPlaceholder(input) {
    const placeholder = getPlaceholderText(input);
    if (!placeholder) {
      return;
    }
    syncVisualPlaceholder(input);
    input.addEventListener("input", () => {
      syncVisualPlaceholder(input);
    });
    input.addEventListener("change", () => {
      syncVisualPlaceholder(input);
    });
  }

  // src/ui/sign-fields.js?v=20260310-16
  var FIELD_SIGN_SELECTOR = ".field-sign";
  function isElement(value) {
    return typeof HTMLElement !== "undefined" && value instanceof HTMLElement;
  }
  function dispatchFieldChange(input, shouldDispatch) {
    if (shouldDispatch) {
      input.dispatchEvent(new Event("change"));
    }
  }
  function resolveInput(target) {
    if (typeof target === "string") {
      return document.getElementById(target);
    }
    return isElement(target) ? target : null;
  }
  function resolveWrapper2(target) {
    var _a;
    if (isElement(target) && target.classList.contains("spinner-container")) {
      return target;
    }
    const input = resolveInput(target);
    return (_a =
      input == null ? void 0 : input.closest(".spinner-container")) != null
      ? _a
      : null;
  }
  function normalizeSign(sign) {
    return sign === NEGATIVE_SIGN || sign === POSITIVE_SIGN ? sign : "";
  }
  function ensureFieldSignElement(target) {
    const wrapper = resolveWrapper2(target);
    if (!wrapper) {
      return null;
    }
    let signElement = wrapper.querySelector(FIELD_SIGN_SELECTOR);
    if (signElement) {
      return signElement;
    }
    signElement = document.createElement("span");
    signElement.classList.add("field-sign");
    signElement.setAttribute("aria-hidden", "true");
    wrapper.insertBefore(signElement, wrapper.firstChild);
    return signElement;
  }
  function getStoredFieldSign(target) {
    const wrapper = resolveWrapper2(target);
    return normalizeSign(
      (wrapper == null ? void 0 : wrapper.dataset.sign) || "",
    );
  }
  function setStoredFieldSign(target, sign) {
    const wrapper = resolveWrapper2(target);
    if (!wrapper) {
      return;
    }
    const normalizedSign = normalizeSign(sign);
    let signElement = wrapper.querySelector(FIELD_SIGN_SELECTOR);
    if (normalizedSign) {
      wrapper.dataset.sign = normalizedSign;
      signElement =
        signElement != null ? signElement : ensureFieldSignElement(wrapper);
    } else {
      delete wrapper.dataset.sign;
    }
    if (signElement) {
      signElement.textContent = normalizedSign;
    }
  }
  function syncFieldSign(target, value, options = {}) {
    const { unsigned = false } = options;
    if (unsigned || value === null || Number.isNaN(value) || value === 0) {
      setStoredFieldSign(target, "");
      return;
    }
    setStoredFieldSign(target, value > 0 ? POSITIVE_SIGN : NEGATIVE_SIGN);
  }
  function readSignedFieldValue(target, options = {}) {
    const { unsigned = false } = options;
    const input = resolveInput(target);
    if (!input || !input.value.trim()) {
      return Number.NaN;
    }
    const numericValue = parseFloat(input.value);
    if (Number.isNaN(numericValue) || unsigned) {
      return numericValue;
    }
    return (
      numericValue * (getStoredFieldSign(input) === NEGATIVE_SIGN ? -1 : 1)
    );
  }
  function clearFieldValue(target, options = {}) {
    const { dispatch = true, unsigned = false } = options;
    const input = resolveInput(target);
    if (!input) {
      return;
    }
    input.value = "";
    syncFieldSign(input, 0, { unsigned });
    syncVisualPlaceholder(input);
    dispatchFieldChange(input, dispatch);
  }
  function writeSignedFieldValue(target, value, options = {}) {
    const {
      dispatch = true,
      step,
      unsigned = false,
      formatMagnitude,
    } = options;
    const input = resolveInput(target);
    if (!input) {
      return;
    }
    if (value === null || Number.isNaN(value)) {
      clearFieldValue(input, { dispatch, unsigned });
      return;
    }
    const formatter =
      typeof formatMagnitude === "function"
        ? formatMagnitude
        : (magnitude) =>
            formatFieldValue(
              magnitude,
              step != null ? step : getFieldStep(input),
            );
    input.value = formatter(Math.abs(value));
    syncFieldSign(input, value, { unsigned });
    syncVisualPlaceholder(input);
    dispatchFieldChange(input, dispatch);
  }
  function getSignedValue(inputId) {
    return readSignedFieldValue(inputId);
  }
  function setSignedValue(inputId, newValue, options = {}) {
    writeSignedFieldValue(inputId, newValue, options);
  }
  function updateOutputWithSign(outputFieldId, value, decimals = 2) {
    writeSignedFieldValue(outputFieldId, value, {
      dispatch: false,
      formatMagnitude: (magnitude) => formatNumber(magnitude, decimals),
    });
  }
  function readAxisValue(inputId) {
    const input = document.getElementById(inputId);
    const rawValue = input == null ? void 0 : input.value.trim();
    return rawValue ? parseFloat(rawValue) : Number.NaN;
  }
  function writeAxisValue(inputId, value, options = {}) {
    const { dispatch = true } = options;
    const input = document.getElementById(inputId);
    if (!input) {
      return;
    }
    input.value =
      value === null || Number.isNaN(value) ? "" : String(Math.round(value));
    syncVisualPlaceholder(input);
    dispatchFieldChange(input, dispatch);
  }

  // src/ui/prescription-form.js?v=20260310-17
  var SECTION_NAMES = ["current", "objective"];
  var EYE_NAMES = ["re", "le"];
  function createPrescriptionFormController() {
    function init() {
      attachRecalculationListeners();
      attachTransposeButton();
      recalcPrescription();
    }
    function attachRecalculationListeners() {
      document.querySelectorAll("input").forEach((input) => {
        input.addEventListener("change", recalcPrescription);
        input.addEventListener("input", recalcPrescription);
      });
    }
    function attachTransposeButton() {
      const transposeButton = document.getElementById("transpose-btn");
      if (!transposeButton) {
        return;
      }
      transposeButton.addEventListener("click", () => {
        handleTranspose();
      });
    }
    function handleTranspose() {
      SECTION_NAMES.forEach((section) => {
        EYE_NAMES.forEach((eye) => {
          transposeInputGroup(section, eye);
        });
      });
      SECTION_NAMES.forEach((section) => {
        normalizeSectionCylinderSigns(section);
      });
      recalcPrescription();
    }
    function transposeInputGroup(section, eye) {
      const prescription = buildEyePrescription(section, eye);
      if (
        [prescription.sph, prescription.cyl, prescription.axis].some((value) =>
          Number.isNaN(value),
        )
      ) {
        return;
      }
      const transposed = transposePrescription(prescription);
      writeEyePrescription(section, eye, transposed);
    }
    function normalizeSectionCylinderSigns(section) {
      const rightEye = buildEyePrescription(section, "re");
      const leftEye = buildEyePrescription(section, "le");
      if (
        Number.isNaN(rightEye.cyl) ||
        Number.isNaN(leftEye.cyl) ||
        rightEye.cyl * leftEye.cyl >= 0
      ) {
        return;
      }
      const normalizedRightEye =
        rightEye.cyl > 0 ? transposePrescription(rightEye) : rightEye;
      const normalizedLeftEye =
        leftEye.cyl > 0 ? transposePrescription(leftEye) : leftEye;
      writeEyePrescription(section, "re", normalizedRightEye);
      writeEyePrescription(section, "le", normalizedLeftEye);
    }
    function writeEyePrescription(section, eye, prescription) {
      setSignedValue(`${section}-${eye}-sph`, prescription.sph, {
        dispatch: false,
      });
      setSignedValue(`${section}-${eye}-cyl`, prescription.cyl, {
        dispatch: false,
      });
      writeAxisValue(`${section}-${eye}-axis`, prescription.axis, {
        dispatch: false,
      });
    }
    function buildEyePrescription(section, eye) {
      return {
        sph: getSignedValue(`${section}-${eye}-sph`),
        cyl: getSignedValue(`${section}-${eye}-cyl`),
        axis: readAxisValue(`${section}-${eye}-axis`),
      };
    }
    function buildContextState() {
      return {
        vaGood: isChecked("toggle-va-good"),
        precise: isChecked("toggle-precise"),
        accurate: isChecked("toggle-accurate"),
        health: isChecked("toggle-health"),
      };
    }
    function isChecked(inputId) {
      var _a;
      return Boolean(
        (_a = document.getElementById(inputId)) == null ? void 0 : _a.checked,
      );
    }
    function recalcPrescription() {
      var _a;
      const context = buildContextState();
      const currentRightEye = buildEyePrescription("current", "re");
      const currentLeftEye = buildEyePrescription("current", "le");
      const objectiveRightEye = buildEyePrescription("objective", "re");
      const objectiveLeftEye = buildEyePrescription("objective", "le");
      const ageValue =
        (_a = document.getElementById("age")) == null ? void 0 : _a.value;
      const output = computePrescriptionCase({
        age: ageValue,
        context,
        currentRightEye,
        currentLeftEye,
        objectiveRightEye,
        objectiveLeftEye,
        currentAdd: getSignedValue("current-le-add"),
        objectiveAdd: getSignedValue("objective-le-add"),
      });
      updateOutputWithSign("output-re-sph", output.rightEye.sph);
      updateOutputWithSign("output-re-cyl", output.rightEye.cyl);
      updateOutputWithSign("output-le-sph", output.leftEye.sph);
      updateOutputWithSign("output-le-cyl", output.leftEye.cyl);
      updateOutputWithSign("output-le-add", output.readingAdd);
      updateOutputAxis("output-re-axis", output.rightEye.axis);
      updateOutputAxis("output-le-axis", output.leftEye.axis);
      updateOrangeState(
        output.rightEye.sph,
        output.leftEye.sph,
        context.precise,
      );
    }
    function updateOutputAxis(outputId, axis) {
      const outputField = document.getElementById(outputId);
      if (!outputField) {
        return;
      }
      outputField.value =
        axis === null || Number.isNaN(axis) ? "" : String(Math.round(axis));
      syncVisualPlaceholder(outputField);
    }
    function updateOrangeState(rightSphere, leftSphere, precise) {
      const outputFields = document.querySelectorAll(
        ".results-section input[readonly]",
      );
      const shouldHighlight =
        !precise && checkOrangeFlag(rightSphere) && checkOrangeFlag(leftSphere);
      outputFields.forEach((field) => {
        field.classList.toggle("orange-bg", shouldHighlight);
      });
    }
    function applyBestMeanSphereAll() {
      SECTION_NAMES.forEach((section) => {
        EYE_NAMES.forEach((eye) => {
          applyBestMeanSphereToEye(section, eye);
        });
      });
      recalcPrescription();
    }
    function applyBestMeanSphereToEye(section, eye) {
      const sphereId = `${section}-${eye}-sph`;
      const cylinderId = `${section}-${eye}-cyl`;
      const sphereValue = getSignedValue(sphereId);
      const cylinderValue = getSignedValue(cylinderId);
      if (Number.isNaN(sphereValue) || Number.isNaN(cylinderValue)) {
        return;
      }
      setSignedValue(sphereId, sphereValue + cylinderValue / 2, {
        dispatch: false,
      });
    }
    return {
      init,
      recalcPrescription,
      applyBestMeanSphereAll,
    };
  }

  // src/ui/shell-controls.js?v=20260310-14
  function initShellControls() {
    const infoIcon = document.getElementById("info-icon");
    const infoPopup = document.getElementById("info-popup");
    const closePopup = document.getElementById("close-popup");
    const burgerIcon = document.getElementById("burger-icon");
    const sideMenu = document.getElementById("sideMenu");
    const sidebarBackdrop = document.getElementById("sidebar-backdrop");
    const mcqButtons = document.querySelectorAll(".mcq-level-button");
    function setInfoPopupOpen(isOpen) {
      if (!infoPopup) {
        return;
      }
      infoPopup.classList.toggle("active", isOpen);
      infoPopup.setAttribute("aria-hidden", String(!isOpen));
      if (infoIcon) {
        infoIcon.setAttribute("aria-expanded", String(isOpen));
      }
    }
    function setSideMenuOpen(isOpen) {
      if (!sideMenu || !sidebarBackdrop || !burgerIcon) {
        return;
      }
      sideMenu.classList.toggle("open", isOpen);
      sideMenu.setAttribute("aria-hidden", String(!isOpen));
      sidebarBackdrop.classList.toggle("open", isOpen);
      burgerIcon.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    }
    infoIcon == null
      ? void 0
      : infoIcon.addEventListener("click", (event) => {
          event.stopPropagation();
          setSideMenuOpen(false);
          setInfoPopupOpen(
            !(infoPopup == null
              ? void 0
              : infoPopup.classList.contains("active")),
          );
        });
    closePopup == null
      ? void 0
      : closePopup.addEventListener("click", (event) => {
          event.stopPropagation();
          setInfoPopupOpen(false);
        });
    infoPopup == null
      ? void 0
      : infoPopup.addEventListener("click", (event) => {
          event.stopPropagation();
        });
    burgerIcon == null
      ? void 0
      : burgerIcon.addEventListener("click", (event) => {
          event.stopPropagation();
          setInfoPopupOpen(false);
          setSideMenuOpen(
            !(sideMenu == null ? void 0 : sideMenu.classList.contains("open")),
          );
        });
    sideMenu == null
      ? void 0
      : sideMenu.addEventListener("click", (event) => {
          event.stopPropagation();
        });
    sidebarBackdrop == null
      ? void 0
      : sidebarBackdrop.addEventListener("click", () => {
          setSideMenuOpen(false);
        });
    mcqButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setSideMenuOpen(false);
      });
    });
    document.addEventListener("click", () => {
      setInfoPopupOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setInfoPopupOpen(false);
        setSideMenuOpen(false);
      }
    });
    setSideMenuOpen(false);
    setInfoPopupOpen(false);
  }

  // src/ui/spinner-constants.js
  var AUTO_HIDE_DELAY = 1500;
  var INITIAL_REPEAT_DELAY = 500;
  var REPEAT_RATE = 100;
  var AXIS_REPEAT_STEP = 5;
  var AGE_REPEAT_STEP = 5;

  // src/ui/spinner-dom.js?v=20260310-14
  function ensureSpinnerWrapper(input) {
    const parent = input.parentElement;
    if (
      parent == null ? void 0 : parent.classList.contains("spinner-container")
    ) {
      return parent;
    }
    const wrapper = document.createElement("div");
    wrapper.classList.add("spinner-container");
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    return wrapper;
  }
  function ensureSpinnerButtons(wrapper) {
    let container = wrapper.querySelector(".spinner-buttons");
    if (!container) {
      container = document.createElement("div");
      container.classList.add("spinner-buttons");
      const upButton = document.createElement("button");
      upButton.type = "button";
      upButton.classList.add("spinner-btn", "spinner-up");
      upButton.textContent = "+";
      const downButton = document.createElement("button");
      downButton.type = "button";
      downButton.classList.add("spinner-btn", "spinner-down");
      downButton.textContent = "-";
      container.appendChild(upButton);
      container.appendChild(downButton);
      wrapper.appendChild(container);
    }
    return {
      container,
      upButton: container.querySelector(".spinner-up"),
      downButton: container.querySelector(".spinner-down"),
    };
  }
  function disableKeyboardInput(input) {
    input.addEventListener("keydown", (event) => {
      event.preventDefault();
    });
  }
  function createSpinnerVisibilityController(activeButtons) {
    let hideTimer = null;
    return function showSpinners() {
      document.querySelectorAll(".spinner-buttons").forEach((buttons) => {
        if (buttons !== activeButtons) {
          buttons.style.display = "none";
        }
      });
      activeButtons.style.display = "flex";
      if (hideTimer) {
        window.clearTimeout(hideTimer);
      }
      hideTimer = window.setTimeout(() => {
        activeButtons.style.display = "none";
      }, AUTO_HIDE_DELAY);
    };
  }
  function attachVisibilityHandlers(wrapper, spinnerButtons, showSpinners) {
    wrapper.addEventListener("focusin", showSpinners);
    wrapper.addEventListener("mousedown", showSpinners);
    wrapper.addEventListener("touchstart", showSpinners);
    spinnerButtons.addEventListener("click", showSpinners);
  }

  // src/ui/sign-fields.js?v=20260310-14
  var FIELD_SIGN_SELECTOR2 = ".field-sign";
  function isElement2(value) {
    return typeof HTMLElement !== "undefined" && value instanceof HTMLElement;
  }
  function dispatchFieldChange2(input, shouldDispatch) {
    if (shouldDispatch) {
      input.dispatchEvent(new Event("change"));
    }
  }
  function resolveInput2(target) {
    if (typeof target === "string") {
      return document.getElementById(target);
    }
    return isElement2(target) ? target : null;
  }
  function resolveWrapper3(target) {
    var _a;
    if (isElement2(target) && target.classList.contains("spinner-container")) {
      return target;
    }
    const input = resolveInput2(target);
    return (_a =
      input == null ? void 0 : input.closest(".spinner-container")) != null
      ? _a
      : null;
  }
  function normalizeSign2(sign) {
    return sign === NEGATIVE_SIGN || sign === POSITIVE_SIGN ? sign : "";
  }
  function ensureFieldSignElement2(target) {
    const wrapper = resolveWrapper3(target);
    if (!wrapper) {
      return null;
    }
    let signElement = wrapper.querySelector(FIELD_SIGN_SELECTOR2);
    if (signElement) {
      return signElement;
    }
    signElement = document.createElement("span");
    signElement.classList.add("field-sign");
    signElement.setAttribute("aria-hidden", "true");
    wrapper.insertBefore(signElement, wrapper.firstChild);
    return signElement;
  }
  function getStoredFieldSign2(target) {
    const wrapper = resolveWrapper3(target);
    return normalizeSign2(
      (wrapper == null ? void 0 : wrapper.dataset.sign) || "",
    );
  }
  function setStoredFieldSign2(target, sign) {
    const wrapper = resolveWrapper3(target);
    if (!wrapper) {
      return;
    }
    const normalizedSign = normalizeSign2(sign);
    let signElement = wrapper.querySelector(FIELD_SIGN_SELECTOR2);
    if (normalizedSign) {
      wrapper.dataset.sign = normalizedSign;
      signElement =
        signElement != null ? signElement : ensureFieldSignElement2(wrapper);
    } else {
      delete wrapper.dataset.sign;
    }
    if (signElement) {
      signElement.textContent = normalizedSign;
    }
  }
  function syncFieldSign2(target, value, options = {}) {
    const { unsigned = false } = options;
    if (unsigned || value === null || Number.isNaN(value) || value === 0) {
      setStoredFieldSign2(target, "");
      return;
    }
    setStoredFieldSign2(target, value > 0 ? POSITIVE_SIGN : NEGATIVE_SIGN);
  }
  function readSignedFieldValue2(target, options = {}) {
    const { unsigned = false } = options;
    const input = resolveInput2(target);
    if (!input || !input.value.trim()) {
      return Number.NaN;
    }
    const numericValue = parseFloat(input.value);
    if (Number.isNaN(numericValue) || unsigned) {
      return numericValue;
    }
    return (
      numericValue * (getStoredFieldSign2(input) === NEGATIVE_SIGN ? -1 : 1)
    );
  }
  function clearFieldValue2(target, options = {}) {
    const { dispatch = true, unsigned = false } = options;
    const input = resolveInput2(target);
    if (!input) {
      return;
    }
    input.value = "";
    syncFieldSign2(input, 0, { unsigned });
    syncVisualPlaceholder(input);
    dispatchFieldChange2(input, dispatch);
  }
  function writeSignedFieldValue2(target, value, options = {}) {
    const {
      dispatch = true,
      step,
      unsigned = false,
      formatMagnitude,
    } = options;
    const input = resolveInput2(target);
    if (!input) {
      return;
    }
    if (value === null || Number.isNaN(value)) {
      clearFieldValue2(input, { dispatch, unsigned });
      return;
    }
    const formatter =
      typeof formatMagnitude === "function"
        ? formatMagnitude
        : (magnitude) =>
            formatFieldValue(
              magnitude,
              step != null ? step : getFieldStep(input),
            );
    input.value = formatter(Math.abs(value));
    syncFieldSign2(input, value, { unsigned });
    syncVisualPlaceholder(input);
    dispatchFieldChange2(input, dispatch);
  }

  // src/ui/spinner-constants.js?v=20260310-14
  var MIN_AXIS = 1;
  var MAX_AXIS = 180;
  var MIN_AGE = 1;
  var MAX_AGE = 130;
  var CYLINDER_CLEANUP_DELAY = 1e3;

  // src/ui/spinner-values.js
  function getCurrentFieldValue(input, meta) {
    const numericValue = parseFloat(input.value) || 0;
    if (meta.isAxis || meta.isAge) {
      return numericValue;
    }
    const signedValue = readSignedFieldValue2(input);
    return Number.isNaN(signedValue) ? numericValue : signedValue;
  }
  function writeSignedValue(input, meta, value, options = {}) {
    writeSignedFieldValue2(input, value, {
      ...options,
      step: meta.step,
      unsigned: meta.isAxis || meta.isAge,
    });
  }
  function cycleAxis(input, offset) {
    const currentValue = parseFloat(input.value) || 0;
    return ((currentValue - 1 + offset + MAX_AXIS) % MAX_AXIS) + 1;
  }
  function adjustAge(input, offset) {
    const currentValue = parseFloat(input.value) || 0;
    return Math.max(MIN_AGE, Math.min(MAX_AGE, currentValue + offset));
  }

  // src/ui/spinner-interactions.js?v=20260310-14
  function attachSpinnerHandlers(input, meta, spinnerButtons, showSpinners) {
    const applyValue = (nextValue) => {
      writeSignedValue(input, meta, nextValue, { dispatch: true });
      showSpinners();
    };
    if (meta.isAxis) {
      addLongPress(
        spinnerButtons.upButton,
        () => {
          applyValue(cycleAxis(input, 1));
        },
        () => {
          applyValue(cycleAxis(input, AXIS_REPEAT_STEP));
        },
      );
      addLongPress(
        spinnerButtons.downButton,
        () => {
          applyValue(cycleAxis(input, -1));
        },
        () => {
          applyValue(cycleAxis(input, -AXIS_REPEAT_STEP));
        },
      );
      return;
    }
    if (meta.isAge) {
      addLongPress(
        spinnerButtons.upButton,
        () => {
          applyValue(adjustAge(input, 1));
        },
        () => {
          applyValue(adjustAge(input, AGE_REPEAT_STEP));
        },
      );
      addLongPress(
        spinnerButtons.downButton,
        () => {
          applyValue(adjustAge(input, -1));
        },
        () => {
          applyValue(adjustAge(input, -AGE_REPEAT_STEP));
        },
      );
      return;
    }
    addLongPress(spinnerButtons.upButton, () => {
      applyValue(getCurrentFieldValue(input, meta) + meta.step);
    });
    addLongPress(spinnerButtons.downButton, () => {
      let nextValue = getCurrentFieldValue(input, meta) - meta.step;
      if (meta.isAdd && nextValue < 0) {
        nextValue = 0;
      }
      applyValue(nextValue);
    });
  }
  function addLongPress(
    button,
    normalCallback,
    repeatCallback = normalCallback,
  ) {
    let repeatTimeout = null;
    let repeatInterval = null;
    const stop = () => {
      if (repeatTimeout) {
        window.clearTimeout(repeatTimeout);
        repeatTimeout = null;
      }
      if (repeatInterval) {
        window.clearInterval(repeatInterval);
        repeatInterval = null;
      }
    };
    const start = (event) => {
      event.preventDefault();
      normalCallback();
      repeatTimeout = window.setTimeout(() => {
        repeatCallback();
        repeatInterval = window.setInterval(repeatCallback, REPEAT_RATE);
      }, INITIAL_REPEAT_DELAY);
    };
    button.addEventListener("mousedown", start);
    button.addEventListener("touchstart", start);
    button.addEventListener("mouseup", stop);
    button.addEventListener("mouseleave", stop);
    button.addEventListener("touchend", stop);
    button.addEventListener("touchcancel", stop);
  }

  // src/ui/field-metadata.js
  function getPlaceholder2(input) {
    return ((input == null ? void 0 : input.placeholder) || "")
      .trim()
      .toLowerCase();
  }
  function getFieldId2(input) {
    return ((input == null ? void 0 : input.id) || "").trim().toLowerCase();
  }
  function isAxisField2(input) {
    const placeholder = getPlaceholder2(input);
    const id = getFieldId2(input);
    return placeholder === "axis" || id.includes("axis");
  }
  function isCylinderField2(input) {
    return getPlaceholder2(input) === "cyl";
  }

  // src/ui/simple-mode.js?v=20260310-14
  function initializeSimpleModeToggle(onSimpleModeDisabled) {
    const simpleToggleCheckbox = document.getElementById("toggle-simple");
    if (!simpleToggleCheckbox) {
      return;
    }
    simpleToggleCheckbox.checked = false;
    updateSimpleMode(simpleToggleCheckbox.checked);
    simpleToggleCheckbox.addEventListener("change", () => {
      if (
        !simpleToggleCheckbox.checked &&
        typeof onSimpleModeDisabled === "function"
      ) {
        onSimpleModeDisabled();
      }
      updateSimpleMode(simpleToggleCheckbox.checked);
    });
  }
  function updateSimpleMode(isAdvancedModeEnabled) {
    document.body.classList.toggle("advanced-mode", isAdvancedModeEnabled);
    document.querySelectorAll('input[type="number"]').forEach((input) => {
      if (!isAxisField2(input) && !isCylinderField2(input)) {
        return;
      }
      const wrapper = input.closest(".spinner-container");
      if (wrapper) {
        wrapper.style.display = isAdvancedModeEnabled ? "inline-flex" : "none";
      }
    });
  }

  // src/ui/spinner-values.js?v=20260310-14
  function getInputMeta(input) {
    return {
      step: getFieldStep(input),
      isAxis: isAxisField(input),
      isAge: isAgeField(input),
      isAdd: isAddField(input),
      isCylinder: isCylinderField(input),
      isSphere: isSphereField(input),
    };
  }
  function getCurrentFieldValue2(input, meta) {
    const numericValue = parseFloat(input.value) || 0;
    if (meta.isAxis || meta.isAge) {
      return numericValue;
    }
    const signedValue = readSignedFieldValue2(input);
    return Number.isNaN(signedValue) ? numericValue : signedValue;
  }
  function clearValue(input, meta, options = {}) {
    clearFieldValue2(input, {
      ...options,
      unsigned: meta.isAxis || meta.isAge,
    });
  }
  function normalizeInputValue(input, meta) {
    const numericValue = parseFloat(input.value) || 0;
    if (meta.isAxis) {
      input.value = formatFieldValue(
        Math.max(MIN_AXIS, Math.min(MAX_AXIS, numericValue)),
        meta.step,
      );
      syncFieldSign2(input, 0, { unsigned: true });
      syncVisualPlaceholder(input);
      return;
    }
    if (meta.isAge) {
      input.value = formatFieldValue(
        Math.max(MIN_AGE, Math.min(MAX_AGE, numericValue)),
        meta.step,
      );
      syncFieldSign2(input, 0, { unsigned: true });
      syncVisualPlaceholder(input);
      return;
    }
    if (meta.isAdd) {
      if (numericValue < 0.25) {
        clearValue(input, meta);
        return;
      }
      input.value = formatFieldValue(numericValue, meta.step);
      syncFieldSign2(input, numericValue);
      syncVisualPlaceholder(input);
      return;
    }
    const currentValue = getCurrentFieldValue2(input, meta);
    input.value = formatFieldValue(Math.abs(currentValue), meta.step);
    syncFieldSign2(input, currentValue);
    syncVisualPlaceholder(input);
  }
  function syncSignedDisplay(input, meta, value) {
    syncFieldSign2(input, value, { unsigned: meta.isAxis || meta.isAge });
  }

  // src/ui/spinner-validation.js?v=20260310-14
  function attachValidationHandlers(input, meta) {
    let cylinderCleanupTimer = null;
    const getRow = () => input.closest(".form-row");
    input.addEventListener("blur", () => {
      normalizeInputValue(input, meta);
      if (meta.isCylinder && parseFloat(input.value) === 0) {
        scheduleCylinderCleanup();
      }
      if (meta.isAxis) {
        clearAxisIfCylinderInvalid(getRow(), input);
      }
      if (meta.isSphere || meta.isCylinder || meta.isAxis) {
        enforceSphereAutofill(getRow());
      }
      syncAxisBorder(getRow());
    });
    if (meta.isCylinder) {
      input.addEventListener("input", () => {
        if (parseFloat(input.value) === 0) {
          scheduleCylinderCleanup();
        } else if (cylinderCleanupTimer) {
          window.clearTimeout(cylinderCleanupTimer);
        }
        enforceSphereAutofill(getRow());
        syncAxisBorder(getRow());
      });
    }
    if (meta.isAxis) {
      input.addEventListener("input", () => {
        clearAxisIfCylinderInvalid(getRow(), input);
        enforceSphereAutofill(getRow());
        syncAxisBorder(getRow());
      });
    }
    if (meta.isAdd) {
      input.addEventListener("input", () => {
        const numericValue = parseFloat(input.value) || 0;
        if (numericValue < 0.25) {
          clearValue(input, meta);
        }
      });
    }
    if (meta.isSphere) {
      input.addEventListener("blur", () => {
        enforceSphereAutofill(getRow());
      });
    }
    function scheduleCylinderCleanup() {
      if (cylinderCleanupTimer) {
        window.clearTimeout(cylinderCleanupTimer);
      }
      cylinderCleanupTimer = window.setTimeout(() => {
        if (parseFloat(input.value) === 0) {
          clearCylinderAndAxis(getRow(), input, meta);
        }
      }, CYLINDER_CLEANUP_DELAY);
    }
  }
  function clearAxisIfCylinderInvalid(formRow, axisInput) {
    if (!formRow || !axisInput) {
      return;
    }
    const cylinderInput = getRowInput(formRow, "cyl");
    if (!hasValidCylinderValue(cylinderInput)) {
      axisInput.value = "";
      syncVisualPlaceholder(axisInput);
      axisInput.dispatchEvent(new Event("change"));
    }
  }
  function clearCylinderAndAxis(formRow, cylinderInput, cylinderMeta) {
    clearValue(cylinderInput, cylinderMeta, { dispatch: false });
    const axisInput = getRowInput(formRow, "axis");
    if (axisInput) {
      axisInput.value = "";
      axisInput.style.border = getDefaultInputBorder(axisInput);
      syncVisualPlaceholder(axisInput);
      axisInput.dispatchEvent(new Event("change"));
    }
    cylinderInput.dispatchEvent(new Event("change"));
  }
  function syncAxisBorder(formRow) {
    if (!formRow) {
      return;
    }
    const cylinderInput = getRowInput(formRow, "cyl");
    const axisInput = getRowInput(formRow, "axis");
    if (!cylinderInput || !axisInput) {
      return;
    }
    const hasAxis = axisInput.value.trim() !== "";
    axisInput.style.border =
      hasValidCylinderValue(cylinderInput) !== hasAxis
        ? "2px solid red"
        : getDefaultInputBorder(axisInput);
  }
  function enforceSphereAutofill(formRow) {
    if (!formRow) {
      return;
    }
    const sphereInput = getRowInput(formRow, "sph");
    const cylinderInput = getRowInput(formRow, "cyl");
    const axisInput = getRowInput(formRow, "axis");
    if (!sphereInput || !cylinderInput || !axisInput) {
      return;
    }
    if (
      sphereInput.value.trim() === "" &&
      cylinderInput.value.trim() !== "" &&
      axisInput.value.trim() !== ""
    ) {
      sphereInput.value = "0.00";
      syncVisualPlaceholder(sphereInput);
      sphereInput.dispatchEvent(new Event("change"));
    }
  }
  function hasValidCylinderValue(cylinderInput) {
    return (
      Boolean(cylinderInput == null ? void 0 : cylinderInput.value.trim()) &&
      parseFloat(cylinderInput.value) >= 0.25
    );
  }
  function getRowInput(formRow, placeholder) {
    return formRow.querySelector(`input[placeholder="${placeholder}"]`);
  }

  // src/ui/spinner-inputs.js?v=20260310-14
  function initSpinnerInputs(options = {}) {
    const { onSimpleModeDisabled } = options;
    const editableInputs = document.querySelectorAll(
      'input[type="number"]:not([readonly])',
    );
    const allNumberInputs = document.querySelectorAll('input[type="number"]');
    editableInputs.forEach((input) => {
      initializeSpinnerInput(input);
    });
    allNumberInputs.forEach((input) => {
      initVisualPlaceholder(input);
    });
    initializeSimpleModeToggle(onSimpleModeDisabled);
  }
  function initializeSpinnerInput(input) {
    const meta = getInputMeta(input);
    const wrapper = ensureSpinnerWrapper(input);
    const spinnerButtons = ensureSpinnerButtons(wrapper);
    const showSpinners = createSpinnerVisibilityController(
      spinnerButtons.container,
    );
    if (!meta.isAxis && !meta.isAge) {
      ensureFieldSignElement2(input);
    }
    disableKeyboardInput(input);
    syncSignedDisplay(input, meta, 0);
    attachSpinnerHandlers(input, meta, spinnerButtons, showSpinners);
    attachValidationHandlers(input, meta);
    attachVisibilityHandlers(wrapper, spinnerButtons.container, showSpinners);
  }

  // scripts.js
  function initApp() {
    const prescriptionForm = createPrescriptionFormController();
    initSpinnerInputs({
      onSimpleModeDisabled: prescriptionForm.applyBestMeanSphereAll,
    });
    prescriptionForm.init();
    initShellControls();
  }
  document.addEventListener("DOMContentLoaded", initApp);
})();
