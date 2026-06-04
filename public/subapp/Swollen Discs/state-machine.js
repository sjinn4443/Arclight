export function createStateMachine(state) {
  function setSideMenuOpen(isOpen) {
    state.ui.sideMenuOpen = Boolean(isOpen);
    return state.ui.sideMenuOpen;
  }

  function setActiveModal(modalName) {
    state.ui.activeModal = modalName || null;
  }

  function beginMcqSession() {
    if (state.timed.isActive) {
      return false;
    }

    state.mcq.selectedQuestions = [];
    state.mcq.lastResult = null;
    return true;
  }

  function endMcqSession() {
    state.mcq.selectedQuestions = [];
  }

  function beginTimedSession() {
    if (state.timed.isActive) {
      return false;
    }

    state.timed.isActive = true;
    state.timed.round = 0;
    state.timed.score = 0;
    state.timed.currentLabel = '';
    return true;
  }

  function endTimedSession() {
    if (!state.timed.isActive) {
      return false;
    }

    state.timed.isActive = false;
    state.timed.currentLabel = '';
    return true;
  }

  function setTimedCountdownTimer(timerId) {
    state.timed.countdownTimer = timerId || null;
  }

  function setTimedFeedbackTimer(timerId) {
    state.timed.feedbackTimer = timerId || null;
  }

  return {
    setSideMenuOpen,
    setActiveModal,
    beginMcqSession,
    endMcqSession,
    beginTimedSession,
    endTimedSession,
    setTimedCountdownTimer,
    setTimedFeedbackTimer
  };
}
