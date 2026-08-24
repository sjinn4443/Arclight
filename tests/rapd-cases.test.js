import {
  buildRapdTestQuestions,
  caseFromPatientSelection,
  formatRapdCase,
  formatRapdTestAnswer,
  getRapdDilationTarget,
  getRapdDirectResponseRatio,
  getRapdHippusScale,
  internalSideToPatientSide,
  pickRandomRapdCase,
  RAPD_RANDOM_CASES,
  RAPD_TEST_ANSWER_CASES,
  rapdCasesMatch,
  scoreRapdAnswers,
} from "../public/js/rapdCases.js";

describe("RAPD cases", () => {
  it("provides no RAPD plus left/right mild, moderate and severe cases", () => {
    expect(RAPD_RANDOM_CASES).toEqual([
      { side: null, severity: null },
      { side: "left", severity: 1 },
      { side: "left", severity: 2 },
      { side: "left", severity: 3 },
      { side: "right", severity: 1 },
      { side: "right", severity: 2 },
      { side: "right", severity: 3 },
    ]);
  });

  it("selects each case across the random range", () => {
    RAPD_RANDOM_CASES.forEach((expected, index) => {
      const random = () => (index + 0.25) / RAPD_RANDOM_CASES.length;
      expect(pickRandomRapdCase(random)).toEqual(expected);
    });
  });

  it("formats reveal answers", () => {
    expect(formatRapdCase({ side: null, severity: null })).toBe("No RAPD");
    expect(formatRapdCase({ side: "left", severity: 1 })).toBe(
      "Left Mild RAPD",
    );
    expect(formatRapdCase({ side: "right", severity: 3 })).toBe(
      "Right Severe RAPD",
    );
    expect(formatRapdCase({ side: "left", severity: null })).toBe("Left RAPD");
  });

  it("builds seven allowed answers plus three random questions", () => {
    const questions = buildRapdTestQuestions(() => 0);
    expect(questions).toHaveLength(10);
    expect(RAPD_TEST_ANSWER_CASES).toHaveLength(7);
    expect(
      RAPD_TEST_ANSWER_CASES.some(
        (answer) => answer.side && answer.severity === null,
      ),
    ).toBe(false);
    RAPD_TEST_ANSWER_CASES.forEach((answer) => {
      expect(
        questions.some((question) => rapdCasesMatch(question, answer)),
      ).toBe(true);
    });
  });

  it("labels test answers from the patient's perspective", () => {
    expect(formatRapdTestAnswer({ side: null, severity: null })).toBe(
      "No RAPD",
    );
    expect(formatRapdTestAnswer({ side: "left", severity: 1 })).toBe(
      "Right Mild RAPD",
    );
    expect(formatRapdTestAnswer({ side: "right", severity: 3 })).toBe(
      "Left Severe RAPD",
    );
  });

  it("maps patient-facing side controls to the opposite screen-side eye", () => {
    expect(caseFromPatientSelection("left", 2)).toEqual({
      side: "right",
      severity: 2,
    });
    expect(caseFromPatientSelection("right", 1)).toEqual({
      side: "left",
      severity: 1,
    });
    expect(caseFromPatientSelection("none", null)).toEqual({
      side: null,
      severity: null,
    });
    expect(internalSideToPatientSide("left")).toBe("right");
  });

  it("increases dilation with RAPD severity", () => {
    expect(getRapdDilationTarget(1)).toBeLessThan(getRapdDilationTarget(2));
    expect(getRapdDilationTarget(2)).toBeLessThan(getRapdDilationTarget(3));
  });

  it("softens the direct response and hippus for severe RAPD on either side", () => {
    expect(getRapdDirectResponseRatio(3)).toBeLessThan(
      getRapdDirectResponseRatio(2),
    );
    expect(getRapdHippusScale(3)).toBeLessThan(getRapdHippusScale(2));
    expect(getRapdDirectResponseRatio(null)).toBe(0.8);
    expect(getRapdHippusScale(null)).toBe(1);
    ["left", "right"].forEach((side) => {
      const severeCase = { side, severity: 3 };
      expect(getRapdDirectResponseRatio(severeCase.severity)).toBe(0.5);
      expect(getRapdHippusScale(severeCase.severity)).toBe(0.5);
    });
  });

  it("scores all ten submitted answers", () => {
    const questions = buildRapdTestQuestions(() => 0);
    const answers = questions.map((question) => ({ ...question }));
    answers[0] = { side: "right", severity: 3 };

    expect(scoreRapdAnswers(questions, answers)).toBe(9);
    expect(scoreRapdAnswers(questions, questions)).toBe(10);
  });
});
