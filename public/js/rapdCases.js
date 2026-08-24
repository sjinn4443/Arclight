export const RAPD_SEVERITY_LEVELS = Object.freeze({
  1: Object.freeze({
    key: "mild",
    label: "Mild",
    dilationTarget: 1,
    directResponseRatio: 0.8,
    hippusScale: 1,
  }),
  2: Object.freeze({
    key: "moderate",
    label: "Moderate",
    dilationTarget: 1.1,
    directResponseRatio: 0.8,
    hippusScale: 1,
  }),
  3: Object.freeze({
    key: "severe",
    label: "Severe",
    dilationTarget: 1.2,
    directResponseRatio: 0.5,
    hippusScale: 0.5,
  }),
});

export const RAPD_RANDOM_CASES = Object.freeze([
  Object.freeze({ side: null, severity: null }),
  ...["left", "right"].flatMap((side) =>
    [1, 2, 3].map((severity) => Object.freeze({ side, severity })),
  ),
]);

export const RAPD_TEST_ANSWER_CASES = Object.freeze([...RAPD_RANDOM_CASES]);

export function pickRandomRapdCase(random = Math.random) {
  const sample = Number(random());
  const safeSample = Number.isFinite(sample) ? sample : 0;
  const index = Math.min(
    RAPD_RANDOM_CASES.length - 1,
    Math.max(0, Math.floor(safeSample * RAPD_RANDOM_CASES.length)),
  );
  const selected = RAPD_RANDOM_CASES[index];
  return { ...selected };
}

export function formatRapdCase(rapdCase) {
  if (!rapdCase?.side) return "No RAPD";

  const side = rapdCase.side === "left" ? "Left" : "Right";
  if (rapdCase.severity == null) return `${side} RAPD`;
  const severity = RAPD_SEVERITY_LEVELS[rapdCase.severity]?.label || "Severe";
  return `${side} ${severity} RAPD`;
}

export function formatRapdTestAnswer(rapdCase) {
  if (!rapdCase?.side) return "No RAPD";
  return formatRapdCase({
    ...rapdCase,
    side: rapdCase.side === "left" ? "right" : "left",
  });
}

export function patientSideToInternalSide(side) {
  if (side === "left") return "right";
  if (side === "right") return "left";
  return null;
}

export function internalSideToPatientSide(side) {
  return patientSideToInternalSide(side);
}

export function caseFromPatientSelection(side, severity) {
  const internalSide = patientSideToInternalSide(side);
  if (!internalSide) return { side: null, severity: null };
  return { side: internalSide, severity: Number(severity) };
}

export function getRapdDilationTarget(severity) {
  return (
    RAPD_SEVERITY_LEVELS[severity]?.dilationTarget ||
    RAPD_SEVERITY_LEVELS[3].dilationTarget
  );
}

export function getRapdDirectResponseRatio(severity) {
  return (
    RAPD_SEVERITY_LEVELS[severity]?.directResponseRatio ??
    RAPD_SEVERITY_LEVELS[1].directResponseRatio
  );
}

export function getRapdHippusScale(severity) {
  return (
    RAPD_SEVERITY_LEVELS[severity]?.hippusScale ??
    RAPD_SEVERITY_LEVELS[1].hippusScale
  );
}

export function rapdCasesMatch(first, second) {
  return first?.side === second?.side && first?.severity === second?.severity;
}

export function scoreRapdAnswers(questions = [], answers = []) {
  return questions.reduce(
    (score, question, index) =>
      score +
      (answers[index] && rapdCasesMatch(answers[index], question) ? 1 : 0),
    0,
  );
}

export function buildRapdTestQuestions(random = Math.random) {
  const fixed = RAPD_TEST_ANSWER_CASES.map((rapdCase) => ({ ...rapdCase }));
  const questions = [...fixed];
  while (questions.length < 10) {
    questions.push(pickRandomRapdCase(random));
  }

  for (let index = questions.length - 1; index > 0; index -= 1) {
    const sample = Number(random());
    const safeSample = Number.isFinite(sample) ? sample : 0;
    const swapIndex = Math.min(
      index,
      Math.max(0, Math.floor(safeSample * (index + 1))),
    );
    [questions[index], questions[swapIndex]] = [
      questions[swapIndex],
      questions[index],
    ];
  }

  return questions;
}
