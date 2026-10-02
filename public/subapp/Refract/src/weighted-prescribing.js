// Deterministic authored decision support. Coefficients require independent clinical review.
import { canonicalEye, RULE_LIMITS } from "./prescribing-rules.js";
import { processEye, selectReadingAddition } from "./prescription-logic.js";

export const PARAMETERS = Object.freeze({
  qualityFloor: 5,
  qualityCeiling: 8,
  unknownQuality: 0.25,
  preciseResistance: 0.2,
  calmBonus: 0.04,
  newPatientPenalty: 0.05,
  returningBonus: 0.025,
  frailtyPenalty: 0.05,
  olderPenalty: 0.05,
  basePull: 0.4,
  qualityPull: 0.5,
  largeChangeBonus: 0.2,
  smallChangeDeadband: 0.25,
  largeChangeStart: 1.25,
  largeStepRamp: 1,
  maxSphereStep: 1.5,
  highSphereStep: 0.25,
  cylinderSignalScale: 1.5,
  cylinderPreciseResistance: 2,
  repeatEnabled: true,
  firstSphereBias: 0.25,
  firstCylinderReduction: 0.25,
  cylinderQuarterPull: 0.25,
});
export const WEIGHTED_RULES = Object.freeze(
  [
    [
      "W0_VALIDATE",
      "Validate sphere and non-zero cylinder axis before any weighting",
    ],
    [
      "W1_LARGE_DISCREPANCY",
      "Retain both current eyes and request measurement review for a large discrepancy",
    ],
    [
      "W2_SIMPLE",
      "Project to spherical equivalent when simple mode is explicitly selected",
    ],
    [
      "W3_NO_OBJECTIVE",
      "Retain a recorded current eye when objective sphere is absent",
    ],
    [
      "W4_NO_ANCHOR",
      "With no recorded prior Rx use the existing seed provisionally, not a plano anchor",
    ],
    ["W5_GOOD_VA", "Explicit good VA retains the current eye"],
    [
      "W6_LOW_CONFIDENCE",
      "Quality at or below the floor retains an existing current eye",
    ],
    [
      "W7_WEIGHTED_COMPONENTS",
      "Grade the established sphere, cylinder and axis component policy by confidence and adaptation modifiers",
    ],
    [
      "W8_SMALL_SPHERE",
      "Retain sphere for objective changes of 0.25 D or less",
    ],
    [
      "W9_LARGE_SPHERE",
      "Above 1.25 D progressively enlarge the ordinary sphere-step allowance by the excess gap",
    ],
    [
      "W10_YOUNGER_SPHERE",
      "Otherwise retain the younger half-change seed with bounded adaptation weighting",
    ],
    [
      "W11_YOUNGER_CYLINDER",
      "Retain the established cautious younger cylinder introduction seed",
    ],
    [
      "W12_HIGH_CYLINDER_AXIS",
      "Hold a small axis change when the established high cylinder is unchanged",
    ],
    [
      "WA_ADD",
      "Entered current add precedes measured add, then existing age estimate and frailty increment",
    ],
  ].map(([id, description]) => Object.freeze({ id, description })),
);
const ruleConditions = {
  W0_VALIDATE:
    "Non-zero cylinder requires a finite axis within 0–180°; plus cylinder is transposed",
  W1_LARGE_DISCREPANCY:
    "Either eye: sphere gap ≥3 D, cylinder gap ≥2 D or axis gap ≥60° with both cylinders ≥1 D",
  W2_SIMPLE: "Simple mode explicitly selected, after the discrepancy check",
  W3_NO_OBJECTIVE: "Objective sphere missing",
  W4_NO_ANCHOR: "Current sphere missing, objective sphere recorded",
  W5_GOOD_VA: "Current prescription present and good VA explicitly selected",
  W6_LOW_CONFIDENCE: "Current prescription present and confidence q=0",
  W7_WEIGHTED_COMPONENTS:
    "Current and objective present, q>0; signal includes bounded adaptation modifiers",
  W8_SMALL_SPHERE: "Absolute measured sphere difference ≤0.25 D",
  W9_LARGE_SPHERE:
    "Absolute measured sphere difference ≥1.25 D; cap = ordinary step + excess above 1.25 D, subject to 1.5 D maximum",
  W10_YOUNGER_SPHERE:
    "Age <40 and sphere gap ≥0.5 D, unless the large-change branch applies",
  W11_YOUNGER_CYLINDER:
    "Age <40, no current cylinder, measured cylinder magnitude ≥0.5 D and seed omits cylinder",
  W12_HIGH_CYLINDER_AXIS:
    "Current cylinder magnitude ≥1.75 D, cylinder unchanged and axis gap ≤5°",
  WA_ADD:
    "Finite current add, otherwise finite measured add, otherwise existing age bands",
};
export const RULE_CATALOGUE = Object.freeze([
  ...WEIGHTED_RULES.map((rule) =>
    Object.freeze([
      rule.id,
      ruleConditions[rule.id],
      rule.description,
      rule.id === "WA_ADD"
        ? "Age-only addition is a provisional estimate; near tasks and working distance remain unmeasured."
        : "Provisional decision support. Coefficients and thresholds require independent clinical review.",
    ]),
  ),
  Object.freeze([
    "RETAIN_ENTERED_ADD",
    "Finite current add supplied, including zero",
    "Retain the entered current addition.",
    "An explicit zero is not missing. Age and frailty do not override an entered addition.",
  ]),
  Object.freeze([
    "MEASURED_ADD",
    "No current add and a finite objective add supplied",
    "Use the measured objective addition.",
    "Current-add precedence is retained from the established engine.",
  ]),
  Object.freeze([
    "AGE_ESTIMATE",
    "Neither current nor objective add supplied",
    "Use the existing age bands; below the age gate leave the addition blank.",
    "Age alone cannot establish working distance, near demand or the need for a near prescription.",
  ]),
  Object.freeze([
    "FRAILTY_INCREMENT",
    "A non-blank age-derived addition and the health modifier selected",
    "Apply the existing +0.25 D frailty increment.",
    "This is an authored heuristic pending independent clinical review, not an override of a supplied addition.",
  ]),
]);
const finite = (value) => typeof value === "number" && Number.isFinite(value);
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const quarter = (n) => Math.round(n * 4) / 4;
const blank = () => ({ sph: null, cyl: null, axis: null });
const gap = (a, b) => Math.min(Math.abs(a - b), 180 - Math.abs(a - b));
const legacy = (rx) =>
  Object.fromEntries(
    Object.entries(rx).map(([k, v]) => [k, v === null ? NaN : v]),
  );
const flag = (v) =>
  v === true || v === 1 ? true : v === false || v === 0 ? false : null;

export function confidenceFor(input, side, parameters = PARAMETERS) {
  const context = input.context ?? {};
  const raw =
    context[`${side}Quality`] ??
    input[`quality${side === "right" ? "Right" : "Left"}`];
  let quality;
  let basis;
  if (finite(raw) && raw >= 0 && raw <= 10) {
    quality = clamp(
      (raw - parameters.qualityFloor) /
        (parameters.qualityCeiling - parameters.qualityFloor),
      0,
      1,
    );
    basis = "recorded quality";
  } else {
    const accurate = context[`${side}Accurate`] ?? context.accurate;
    quality =
      accurate === true
        ? 1
        : accurate === false
          ? 0
          : parameters.unknownQuality;
    basis =
      accurate === true || accurate === false
        ? "accuracy flag fallback"
        : "quality missing";
  }
  const precise = flag(context.precise ?? input.precise);
  const calm = flag(context.calm ?? input.calm);
  const health = flag(context.health ?? input.health);
  const repeat = flag(context.repeat ?? input.repeat);
  const age = input.age === "" || input.age == null ? NaN : Number(input.age);
  const modifier =
    (calm === true ? parameters.calmBonus : 0) -
    (health === true ? parameters.frailtyPenalty : 0) -
    (finite(age) && age >= 65 ? parameters.olderPenalty : 0) +
    (!parameters.repeatEnabled
      ? 0
      : repeat === true
        ? parameters.returningBonus
        : repeat === false
          ? -parameters.newPatientPenalty
          : 0);
  const pull = clamp(
    parameters.basePull +
      quality * parameters.qualityPull -
      (precise === true ? parameters.preciseResistance : 0) +
      modifier,
    0,
    1,
  );
  return {
    rawQuality: finite(raw) ? raw : null,
    quality,
    basis,
    precise,
    calm,
    health,
    repeat,
    age,
    modifier,
    pull,
  };
}

function discordant(c, o) {
  if (!finite(c.sph) || !finite(o.sph)) return false;
  return (
    Math.abs(c.sph - o.sph) >= RULE_LIMITS.discordantSphere ||
    Math.abs((c.cyl ?? 0) - (o.cyl ?? 0)) >= RULE_LIMITS.discordantCylinder ||
    (Math.min(Math.abs(c.cyl ?? 0), Math.abs(o.cyl ?? 0)) >= 1 &&
      gap(c.axis, o.axis) >= RULE_LIMITS.discordantAxis)
  );
}

function prescribeEye(c, o, confidence, context, p, trace, config = {}) {
  if (!finite(o.sph)) {
    trace.push("W3_NO_OBJECTIVE");
    return { ...c };
  }
  if (!finite(c.sph)) {
    trace.push("W4_NO_ANCHOR");
    // Missing current Rx is not a plano prescription or proof of a first pair.
    if (confidence.precise !== true)
      return {
        ...o,
        sph: quarter(o.sph),
        cyl: o.cyl === null ? null : quarter(o.cyl),
      };
    return processEye(
      legacy(c),
      legacy(o),
      false,
      true,
      confidence.quality > 0,
      {
        ...config,
        sphere: { objectiveBias: p.firstSphereBias, ...config.sphere },
        cylinder: {
          objectiveReduction: p.firstCylinderReduction,
          ...config.cylinder,
        },
      },
    );
  }
  if (context.vaGood === true) {
    trace.push("W5_GOOD_VA");
    return { ...c };
  }
  if (confidence.quality <= 0) {
    trace.push("W6_LOW_CONFIDENCE");
    return { ...c };
  }
  trace.push("W7_WEIGHTED_COMPONENTS");
  // Retain established cylinder/axis-specific policies while grading their signal.
  const result = processEye(
    legacy(c),
    legacy(o),
    false,
    confidence.precise === true,
    true,
    {
      ...config,
      confidence: {
        ...config.confidence,
        objectiveAccurate:
          (config.confidence?.objectiveAccurate ?? p.cylinderSignalScale) *
            confidence.quality +
          confidence.modifier,
        currentPrecise:
          config.confidence?.currentPrecise ?? p.cylinderPreciseResistance,
      },
      sphere: {
        maxStep: confidence.precise === true ? 0.25 : 0.5,
        ...config.sphere,
      },
      cylinder: { quarterPull: p.cylinderQuarterPull, ...config.cylinder },
    },
  );
  const delta = o.sph - c.sph;
  if (Math.abs(delta) <= p.smallChangeDeadband) {
    result.sph = c.sph;
    trace.push("W8_SMALL_SPHERE");
  } else if (Math.abs(delta) >= p.largeChangeStart) {
    // Proportional movement to the measured sphere. Resistance is not a blanket
    // 0.25 D step cap: large corroborated changes can warrant a larger compromise.
    const pull = clamp(
      (confidence.pull + p.largeChangeBonus) * confidence.quality,
      0,
      1,
    );
    const ordinaryStep =
      confidence.age < 40 || confidence.precise !== true ? 0.5 : 0.25;
    const progressiveCap = Math.min(
      p.maxSphereStep,
      ordinaryStep +
        Math.max(0, Math.abs(delta) - p.largeChangeStart) * p.largeStepRamp,
    );
    const cap =
      config.sphere?.maxStep ??
      (Math.max(Math.abs(c.sph), Math.abs(o.sph)) >= RULE_LIMITS.highSphere
        ? p.highSphereStep
        : progressiveCap);
    const movement = Math.min(
      Math.abs(delta),
      cap,
      quarter(Math.abs(delta) * pull),
    );
    result.sph = quarter(c.sph + Math.sign(delta) * movement);
    trace.push("W9_LARGE_SPHERE");
  } else if (confidence.age < 40 && Math.abs(delta) >= 0.5) {
    const cap =
      config.sphere?.maxStep ??
      (Math.max(Math.abs(c.sph), Math.abs(o.sph)) >= RULE_LIMITS.highSphere
        ? p.highSphereStep
        : 0.5);
    result.sph = quarter(
      c.sph +
        Math.sign(delta) *
          Math.min(
            cap,
            quarter(
              Math.abs(delta) *
                0.5 *
                confidence.quality *
                clamp(1 + confidence.modifier, 0, 1.2),
            ),
          ),
    );
    trace.push("W10_YOUNGER_SPHERE");
  }
  if (
    confidence.age < 40 &&
    c.cyl === null &&
    Math.abs(o.cyl ?? 0) >= 0.5 &&
    result.cyl === null
  ) {
    result.cyl = -0.25;
    result.axis = Math.round(o.axis / 5) * 5 || 180;
    trace.push("W11_YOUNGER_CYLINDER");
  }
  if (
    Math.abs(c.cyl ?? 0) >= RULE_LIMITS.highCylinder &&
    Math.abs((result.cyl ?? 0) - c.cyl) < 0.001 &&
    finite(o.axis) &&
    gap(c.axis, o.axis) <= RULE_LIMITS.smallAxisGap
  ) {
    result.axis = c.axis;
    trace.push("W12_HIGH_CYLINDER_AXIS");
  }
  return result;
}

export function computeWeightedPrescription(input, overrides = {}) {
  const p = { ...PARAMETERS, ...overrides },
    context = input.context ?? {};
  const trace = { right: ["W0_VALIDATE"], left: ["W0_VALIDATE"], add: [] },
    review = [];
  const eyes = [
    "currentRightEye",
    "currentLeftEye",
    "objectiveRightEye",
    "objectiveLeftEye",
  ].map((key) => canonicalEye(input[key]));
  if (eyes.some((e) => e === null))
    return {
      rightEye: blank(),
      leftEye: blank(),
      readingAdd: null,
      trace,
      review: ["Invalid non-zero cylinder axis."],
    };
  let [cr, cl, or, ol] = eyes;
  const discrepancy = discordant(cr, or) || discordant(cl, ol);
  if (context.simple === true) {
    const spherical = (e) =>
      finite(e.sph)
        ? { sph: quarter(e.sph + (e.cyl ?? 0) / 2), cyl: null, axis: null }
        : blank();
    [cr, cl, or, ol] = [cr, cl, or, ol].map(spherical);
    trace.right.push("W2_SIMPLE");
    trace.left.push("W2_SIMPLE");
  }
  const confidence = {
    right: confidenceFor(input, "right", p),
    left: confidenceFor(input, "left", p),
  };
  let rightEye, leftEye;
  if (discrepancy) {
    rightEye = { ...cr };
    leftEye = { ...cl };
    trace.right.push("W1_LARGE_DISCREPANCY");
    trace.left.push("W1_LARGE_DISCREPANCY");
    review.push(
      "Large change: verify measurements before changing the current prescription.",
    );
  } else {
    rightEye = prescribeEye(
      cr,
      or,
      confidence.right,
      context,
      p,
      trace.right,
      input.config,
    );
    leftEye = prescribeEye(
      cl,
      ol,
      confidence.left,
      context,
      p,
      trace.left,
      input.config,
    );
  }
  let readingAdd = selectReadingAddition(
    input.age,
    flag(context.health ?? input.health) === true,
    input.currentAdd,
    input.objectiveAdd,
    input.config,
  );
  if (!finite(readingAdd)) readingAdd = null;
  trace.add.push(
    "WA_ADD",
    finite(input.currentAdd)
      ? "RETAIN_ENTERED_ADD"
      : finite(input.objectiveAdd)
        ? "MEASURED_ADD"
        : "AGE_ESTIMATE",
  );
  if (
    !finite(input.currentAdd) &&
    !finite(input.objectiveAdd) &&
    readingAdd !== null &&
    flag(context.health ?? input.health) === true
  )
    trace.add.push("FRAILTY_INCREMENT");
  if (confidence.right.age < 18)
    review.push(
      "Child: confirm the refraction and clinical context before prescribing.",
    );
  if (confidence.right.quality < 1 || confidence.left.quality < 1)
    review.push("Unconfirmed measurement: provisional suggestion only.");
  if (
    (!finite(cr.sph) && finite(or.sph)) ||
    (!finite(cl.sph) && finite(ol.sph))
  )
    review.push(
      "No current prescription recorded: provisional suggestion without an established prescription anchor.",
    );
  return { rightEye, leftEye, readingAdd, trace, review, confidence };
}
