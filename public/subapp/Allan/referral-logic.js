(function initialiseReferralLogic(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.ALLAN_REFERRAL_LOGIC = api;
  }
})(
  typeof globalThis !== "undefined" ? globalThis : this,
  function createReferralLogic() {
    "use strict";

    const ACTIONS = Object.freeze({
      ROUTINE: "Routine (weeks)",
      ROUTINE_REFERRAL: "Routine referral",
      REVIEW: "Photo + Review",
      CANCER_PATHWAY: "Susp cancer pathway (2 week wait)",
      SAME_DAY: "Same day",
      EMERGENCY: "Emergency (now)",
    });

    const ACTION_RANK = Object.freeze({
      [ACTIONS.ROUTINE]: 0,
      [ACTIONS.ROUTINE_REFERRAL]: 1,
      [ACTIONS.REVIEW]: 2,
      [ACTIONS.CANCER_PATHWAY]: 3,
      [ACTIONS.SAME_DAY]: 4,
      [ACTIONS.EMERGENCY]: 5,
    });

    const RULES = Object.freeze({
      abcde: Object.freeze({
        reviewDriver: "ABCDEFG teaching prompt concern; clinical review needed",
      }),
      dermoscopy: Object.freeze({
        urgentDriver: "dermoscopy chaos plus malignant clue",
        exceptionDriver: "dermoscopy exception",
        clueDriver: "dermoscopy clue recorded without chaos",
        chaosDriver: "dermoscopy chaos recorded; clues not yet recorded",
      }),
      bccScc: Object.freeze({
        routineDriver: "suspected BCC features",
        sccDriver: "suspected SCC signs",
      }),
      rash: Object.freeze({
        emergencyRedFlagScore: 6,
        sameDayRedFlagScore: 4,
        emergencyDriver: "rash emergency signs",
        sameDayRedFlagDriver: "rash same-day concern",
        reviewDriver: "rash teaching prompt concern; clinical review needed",
      }),
    });

    const LOGIC_SECTIONS = Object.freeze([
      "Logic: the app uses the highest recorded urgency. Teaching totals never trigger urgent pathways.",
      "Lesion: any ABCDEFG finding means Photo + Review. ABCDEFG is not the NICE weighted 7-point checklist. Suspected melanoma or high-risk BCC overrides the prompt and needs an appropriate urgent pathway. Suspected SCC, rapid growth, persistent ulceration or unexplained bleeding trigger the suspected cancer pathway. Scale or tenderness alone does not establish SCC.",
      "Dermoscopy: for trained users, chaos plus a clue or an exception means suspected cancer pathway. Chaos alone means Photo + Review and further assessment.",
      "Rash: benign selections remain routine. A selected pattern or concerning non-red-flag feature means Photo + Review. Only the explicit red-flag choice sets same-day or emergency urgency.",
      "Wood's lamp: it appears in the report only when an assessment result is selected and never changes urgency.",
      "Emergency: sudden mouth, tongue or throat swelling or breathing difficulty needs emergency help now.",
      "Sources: NICE NG12 suspected cancer, RACGP Chaos and Clues, NICE CG183, NHS anaphylaxis guidance and DermNet Wood lamp examination. Direct links are in the Quick Guide. Source traceability was updated 10 July 2026; independent clinical sign-off is pending. This is a referral aid, not a diagnosis.",
    ]);

    function evaluation(priority, riskState, action, driver = "") {
      return { priority, riskState, action, driver };
    }

    function evaluateABCDE(score = 0) {
      if (Number(score) > 0) {
        return evaluation(1, "soon", ACTIONS.REVIEW, RULES.abcde.reviewDriver);
      }
      return evaluation(0, "routine", ACTIONS.ROUTINE);
    }

    function evaluateDermoscopy(findings = {}) {
      if (findings.hasException) {
        return evaluation(
          2,
          "urgent",
          ACTIONS.CANCER_PATHWAY,
          RULES.dermoscopy.exceptionDriver,
        );
      }
      if (findings.hasChaos && findings.hasClue) {
        return evaluation(
          2,
          "urgent",
          ACTIONS.CANCER_PATHWAY,
          RULES.dermoscopy.urgentDriver,
        );
      }
      if (findings.hasClue) {
        return evaluation(
          1,
          "soon",
          ACTIONS.REVIEW,
          RULES.dermoscopy.clueDriver,
        );
      }
      if (findings.hasChaos) {
        return evaluation(
          1,
          "soon",
          ACTIONS.REVIEW,
          RULES.dermoscopy.chaosDriver,
        );
      }
      return evaluation(0, "routine", ACTIONS.ROUTINE);
    }

    function evaluateBccScc(findings = {}) {
      if (findings.hasSccConcern) {
        return evaluation(
          2,
          "urgent",
          ACTIONS.CANCER_PATHWAY,
          RULES.bccScc.sccDriver,
        );
      }
      if (findings.hasFeature) {
        return evaluation(
          0.5,
          "routine",
          ACTIONS.ROUTINE_REFERRAL,
          RULES.bccScc.routineDriver,
        );
      }
      return evaluation(0, "routine", ACTIONS.ROUTINE);
    }

    function evaluateRash(state = {}) {
      const redFlagsValue = Number(state.redFlagsValue) || 0;
      if (redFlagsValue >= RULES.rash.emergencyRedFlagScore) {
        return evaluation(
          4,
          "emergency",
          ACTIONS.EMERGENCY,
          RULES.rash.emergencyDriver,
        );
      }
      if (redFlagsValue >= RULES.rash.sameDayRedFlagScore) {
        return evaluation(
          3,
          "urgent",
          ACTIONS.SAME_DAY,
          RULES.rash.sameDayRedFlagDriver,
        );
      }
      if (state.hasClinicalConcern) {
        return evaluation(1, "soon", ACTIONS.REVIEW, RULES.rash.reviewDriver);
      }
      return evaluation(0, "routine", ACTIONS.ROUTINE);
    }

    function selectHighestEvaluation(evaluations) {
      const finalEvaluation = evaluations.reduce((highest, candidate) => {
        if (candidate.priority !== highest.priority) {
          return candidate.priority > highest.priority ? candidate : highest;
        }

        const candidateRank = ACTION_RANK[candidate.action] ?? -1;
        const highestRank = ACTION_RANK[highest.action] ?? -1;
        return candidateRank > highestRank ? candidate : highest;
      }, evaluations[0]);

      const drivers = evaluations
        .filter(
          (candidate) =>
            candidate.priority === finalEvaluation.priority &&
            candidate.priority > 0,
        )
        .map((candidate) => candidate.driver)
        .filter(Boolean);

      return { ...finalEvaluation, drivers };
    }

    function evaluateAssessment(state = {}) {
      return selectHighestEvaluation([
        evaluateABCDE(state.abcdeScore),
        evaluateDermoscopy(state.dermoscopy),
        evaluateBccScc(state.bccScc),
        evaluateRash(state.rash),
      ]);
    }

    function getLogicPopoverText() {
      return LOGIC_SECTIONS.join(" | ");
    }

    function getReportLogicNote() {
      return LOGIC_SECTIONS.slice(0, -1).join(" ");
    }

    return Object.freeze({
      ACTIONS,
      ACTION_RANK,
      RULES,
      LOGIC_SECTIONS,
      evaluateABCDE,
      evaluateDermoscopy,
      evaluateBccScc,
      evaluateRash,
      evaluateAssessment,
      selectHighestEvaluation,
      getLogicPopoverText,
      getReportLogicNote,
    });
  },
);
