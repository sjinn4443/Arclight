export function createAppState({ defaultImageSrc }) {
  return {
    ui: {
      sideMenuOpen: false,
      activeModal: null
    },
    viewer: {
      activeImageSrc: defaultImageSrc,
      conditionImageSrc: defaultImageSrc,
      activeCondition: 'normal',
      isRightEye: true,
      isDiscVisible: true,
      cataractLevel: 0,
      shiftInProgress: false
    },
    mcq: {
      selectedQuestions: [],
      lastResult: null
    },
    timed: {
      isActive: false,
      round: 0,
      score: 0,
      currentLabel: '',
      countdownTimer: null,
      feedbackTimer: null
    }
  };
}
