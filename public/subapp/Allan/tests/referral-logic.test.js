import test from "node:test";
import assert from "node:assert/strict";

await import("../referral-logic.js");
const logic = globalThis.ALLAN_REFERRAL_LOGIC;

function assessment(overrides = {}) {
  return {
    abcdeScore: 0,
    dermoscopy: {},
    bccScc: {},
    rash: {},
    ...overrides,
  };
}

test("empty assessment remains routine", () => {
  const result = logic.evaluateAssessment(assessment());
  assert.equal(result.action, logic.ACTIONS.ROUTINE);
  assert.equal(result.priority, 0);
  assert.deepEqual(result.drivers, []);
});

test("high ABCDEFG teaching totals never trigger the cancer pathway", () => {
  const result = logic.evaluateAssessment(assessment({ abcdeScore: 12 }));
  assert.equal(result.action, logic.ACTIONS.REVIEW);
  assert.equal(result.priority, 1);
});

test("chaos plus a dermoscopy clue triggers the suspected cancer pathway", () => {
  const result = logic.evaluateAssessment(
    assessment({
      dermoscopy: { hasChaos: true, hasClue: true },
    }),
  );
  assert.equal(result.action, logic.ACTIONS.CANCER_PATHWAY);
  assert.equal(result.priority, 2);
});

test("a dermoscopy exception triggers the suspected cancer pathway without chaos", () => {
  const result = logic.evaluateAssessment(
    assessment({
      dermoscopy: { hasException: true },
    }),
  );
  assert.equal(result.action, logic.ACTIONS.CANCER_PATHWAY);
});

test("BCC-like features remain a routine referral", () => {
  const result = logic.evaluateAssessment(
    assessment({
      bccScc: { hasFeature: true },
    }),
  );
  assert.equal(result.action, logic.ACTIONS.ROUTINE_REFERRAL);
  assert.equal(result.priority, 0.5);
});

test("explicit SCC concern triggers the suspected cancer pathway", () => {
  const result = logic.evaluateAssessment(
    assessment({
      bccScc: { hasSccConcern: true },
    }),
  );
  assert.equal(result.action, logic.ACTIONS.CANCER_PATHWAY);
});

test("benign rash selections remain routine", () => {
  const result = logic.evaluateAssessment(
    assessment({
      rash: { redFlagsValue: 0, hasClinicalConcern: false },
    }),
  );
  assert.equal(result.action, logic.ACTIONS.ROUTINE);
});

test("a non-red-flag rash concern requests photo review", () => {
  const result = logic.evaluateAssessment(
    assessment({
      rash: { redFlagsValue: 0, hasClinicalConcern: true },
    }),
  );
  assert.equal(result.action, logic.ACTIONS.REVIEW);
});

test("explicit rash red flags set same-day and emergency urgency", () => {
  const sameDay = logic.evaluateAssessment(
    assessment({
      rash: { redFlagsValue: 4, hasClinicalConcern: false },
    }),
  );
  const emergency = logic.evaluateAssessment(
    assessment({
      rash: { redFlagsValue: 6, hasClinicalConcern: false },
    }),
  );
  assert.equal(sameDay.action, logic.ACTIONS.SAME_DAY);
  assert.equal(emergency.action, logic.ACTIONS.EMERGENCY);
});

test("equal-priority concerns keep a deterministic action and all tied drivers", () => {
  const result = logic.evaluateAssessment(
    assessment({
      abcdeScore: 1,
      rash: { hasClinicalConcern: true },
    }),
  );
  assert.equal(result.action, logic.ACTIONS.REVIEW);
  assert.equal(result.drivers.length, 2);
  assert.match(result.drivers.join(" "), /ABCDEFG/);
  assert.match(result.drivers.join(" "), /rash/);
});

test("higher urgency always wins across routes", () => {
  const result = logic.evaluateAssessment(
    assessment({
      abcdeScore: 1,
      dermoscopy: { hasChaos: true, hasClue: true },
      rash: { redFlagsValue: 6, hasClinicalConcern: true },
    }),
  );
  assert.equal(result.action, logic.ACTIONS.EMERGENCY);
  assert.equal(result.priority, 4);
});
