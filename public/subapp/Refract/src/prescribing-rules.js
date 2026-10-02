import {
  processEye,
  selectReadingAddition,
  transposePrescription,
} from "./prescription-logic.js";

// Authored decision support, not a fitted model. Thresholds require clinical review.
export const RULE_LIMITS = Object.freeze({
  youngerAge: 40,
  meaningfulSphereGap: 0.5,
  youngerPull: 0.5,
  ordinarySphereStep: 0.5,
  highSphere: 6,
  highSphereStep: 0.25,
  highCylinder: 1.75,
  smallAxisGap: 5,
  discordantSphere: 3,
  discordantCylinder: 2,
  discordantAxis: 60,
});
const quarter = (n) => Math.round(n * 4) / 4;
const blank = () => ({ sph: null, cyl: null, axis: null });
const finite = (n) => typeof n === "number" && Number.isFinite(n);
const axisGap = (a, b) => Math.min(Math.abs(a - b), 180 - Math.abs(a - b));

export function canonicalEye(eye = {}) {
  if (!finite(eye.sph)) return blank();
  const cyl = finite(eye.cyl) ? eye.cyl : 0;
  if (Math.abs(cyl) < 0.001)
    return { sph: eye.sph, cyl: eye.cyl === 0 ? 0 : null, axis: null };
  if (!finite(eye.axis) || eye.axis < 0 || eye.axis > 180) return null;
  const rx = { sph: eye.sph, cyl, axis: eye.axis === 0 ? 180 : eye.axis };
  return cyl > 0 ? transposePrescription(rx) : rx;
}

const forLegacy = (rx) =>
  Object.fromEntries(
    Object.entries(rx).map(([k, v]) => [k, v === null ? NaN : v]),
  );
function sphericalEye(rx) {
  return finite(rx.sph)
    ? { sph: quarter(rx.sph + (rx.cyl || 0) / 2), cyl: null, axis: null }
    : blank();
}
function discrepancy(c, o) {
  if (!finite(c.sph) || !finite(o.sph)) return false;
  return (
    Math.abs(c.sph - o.sph) >= RULE_LIMITS.discordantSphere ||
    Math.abs((c.cyl || 0) - (o.cyl || 0)) >= RULE_LIMITS.discordantCylinder ||
    (Math.min(Math.abs(c.cyl || 0), Math.abs(o.cyl || 0)) >= 1 &&
      axisGap(c.axis, o.axis) >= RULE_LIMITS.discordantAxis)
  );
}

function prescribeEye(c, o, context, age, accurate, config, trace) {
  if (!finite(o.sph)) {
    trace.push("D1_NO_OBJECTIVE");
    return { ...c };
  }
  if (!finite(c.sph)) {
    trace.push(context.precise ? "D2_FIRST_PRECISE" : "D3_FIRST_FLEXIBLE");
    // An established prescription cannot anchor a first pair. A flexible wearer
    // gets the measured target; a precise wearer keeps the conservative seed rule.
    return context.precise
      ? processEye(forLegacy(c), forLegacy(o), false, true, accurate, config)
      : {
          ...o,
          sph: quarter(o.sph),
          cyl: o.cyl === null ? null : quarter(o.cyl),
        };
  }
  if (!accurate || context.vaGood) {
    trace.push(!accurate ? "D4_UNCERTAIN_HOLD" : "D5_GOOD_VA_HOLD");
    return { ...c };
  }
  trace.push("D6_COMPONENT_COMPROMISE");
  const adjustedConfig = context.precise
    ? config
    : {
        ...config,
        sphere: { ...config?.sphere, maxStep: RULE_LIMITS.ordinarySphereStep },
      };
  const result = processEye(
    forLegacy(c),
    forLegacy(o),
    false,
    context.precise,
    true,
    adjustedConfig,
  );
  const delta = o.sph - c.sph;
  if (
    finite(age) &&
    age < RULE_LIMITS.youngerAge &&
    Math.abs(delta) >= RULE_LIMITS.meaningfulSphereGap
  ) {
    const cap =
      Math.max(Math.abs(c.sph), Math.abs(o.sph)) >= RULE_LIMITS.highSphere
        ? RULE_LIMITS.highSphereStep
        : RULE_LIMITS.ordinarySphereStep;
    result.sph =
      c.sph +
      Math.sign(delta) *
        Math.min(cap, quarter(Math.abs(delta) * RULE_LIMITS.youngerPull));
    trace.push("D7_YOUNGER_MEANINGFUL_CHANGE");
  }
  if (
    finite(age) &&
    age < RULE_LIMITS.youngerAge &&
    c.cyl === null &&
    Math.abs(o.cyl || 0) >= 0.5 &&
    result.cyl === null
  ) {
    result.cyl = -0.25;
    result.axis = Math.round(o.axis / 5) * 5 || 180;
    trace.push("D8_YOUNGER_FIRST_CYLINDER");
  }
  if (
    Math.abs(c.cyl || 0) >= RULE_LIMITS.highCylinder &&
    Math.abs((result.cyl || 0) - c.cyl) < 0.001 &&
    finite(o.axis) &&
    axisGap(c.axis, o.axis) <= RULE_LIMITS.smallAxisGap
  ) {
    result.axis = c.axis;
    trace.push("D9_HIGH_CYLINDER_AXIS_HOLD");
  }
  return result;
}

export function computeRulePrescription(input) {
  const context = input.context || {};
  const trace = { right: [], left: [], add: [] };
  const review = [];
  let cr = canonicalEye(input.currentRightEye),
    cl = canonicalEye(input.currentLeftEye);
  let or = canonicalEye(input.objectiveRightEye),
    ol = canonicalEye(input.objectiveLeftEye);
  if ([cr, cl, or, ol].some((rx) => rx === null)) {
    return {
      rightEye: blank(),
      leftEye: blank(),
      readingAdd: null,
      trace,
      review: ["A non-zero cylinder needs an axis between 0 and 180 degrees."],
    };
  }
  const discordant = discrepancy(cr, or) || discrepancy(cl, ol);
  if (context.simple) {
    [cr, cl, or, ol] = [cr, cl, or, ol].map(sphericalEye);
    trace.right.push("D0_SPHERICAL_EQUIVALENT");
    trace.left.push("D0_SPHERICAL_EQUIVALENT");
  }
  const age = input.age === "" || input.age == null ? NaN : Number(input.age);
  let rightEye, leftEye;
  if (discordant) {
    rightEye = { ...cr };
    leftEye = { ...cl };
    trace.right.push("D10_LARGE_DISCREPANCY");
    trace.left.push("D10_LARGE_DISCREPANCY");
    review.push(
      "Large change: verify measurements before changing the current prescription.",
    );
  } else {
    rightEye = prescribeEye(
      cr,
      or,
      context,
      age,
      context.rightAccurate ?? context.accurate,
      input.config,
      trace.right,
    );
    leftEye = prescribeEye(
      cl,
      ol,
      context,
      age,
      context.leftAccurate ?? context.accurate,
      input.config,
      trace.left,
    );
  }
  const currentAdd = finite(input.currentAdd) ? input.currentAdd : NaN;
  const objectiveAdd = finite(input.objectiveAdd) ? input.objectiveAdd : NaN;
  let readingAdd = selectReadingAddition(
    age,
    context.health,
    currentAdd,
    objectiveAdd,
    input.config,
  );
  if (!finite(readingAdd)) readingAdd = null;
  trace.add.push(
    finite(currentAdd)
      ? "A1_RETAIN_ENTERED"
      : finite(objectiveAdd)
        ? "A2_MEASURED_ADD"
        : "A3_AGE_ESTIMATE",
  );
  if (
    trace.add[0] === "A3_AGE_ESTIMATE" &&
    readingAdd !== null &&
    context.health
  )
    trace.add.push("A4_FRAILTY_INCREMENT");
  if (finite(age) && age < 18)
    review.push(
      "Child: confirm the refraction and clinical context before prescribing.",
    );
  if (
    ![
      context.rightAccurate ?? context.accurate,
      context.leftAccurate ?? context.accurate,
    ].every(Boolean)
  )
    review.push("Unconfirmed measurement: provisional suggestion only.");
  return { rightEye, leftEye, readingAdd, trace, review };
}
