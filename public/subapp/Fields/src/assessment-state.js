(function initialiseAssessmentState(root) {
  const UNASSESSED = "unassessed";
  const ASSESSED_STATES = Object.freeze(["seen", "suspect", "absent"]);

  function normaliseState(value) {
    return value === UNASSESSED || ASSESSED_STATES.includes(value)
      ? value
      : UNASSESSED;
  }

  function nextState(currentState) {
    const current = normaliseState(currentState);
    if (current === UNASSESSED) return "seen";
    const index = ASSESSED_STATES.indexOf(current);
    return ASSESSED_STATES[(index + 1) % ASSESSED_STATES.length];
  }

  function isComplete(states, expectedCount = 10) {
    if (!Array.isArray(states) || states.length !== expectedCount) return false;
    return states.every((state) =>
      ASSESSED_STATES.includes(normaliseState(state)),
    );
  }

  function completionLabel(states) {
    const values = Array.isArray(states) ? states.map(normaliseState) : [];
    return values.some((state) => state !== UNASSESSED)
      ? "Mark rest seen"
      : "Mark all seen";
  }

  function shouldCompleteRemaining(nextState) {
    // An abnormal point does not establish that the other points were tested.
    return false;
  }

  const api = Object.freeze({
    UNASSESSED,
    ASSESSED_STATES,
    normaliseState,
    nextState,
    isComplete,
    completionLabel,
    shouldCompleteRemaining,
  });

  root.FIELD_ASSESSMENT = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
