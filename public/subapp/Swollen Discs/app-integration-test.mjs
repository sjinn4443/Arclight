import assert from 'node:assert/strict';

import { createAppState } from './app-state.js';
import { createStateMachine } from './state-machine.js';
import { createMcqController } from './mcq-controller.js';
import { createTimedTestController } from './timed-test.js';
import { createModalManager } from './modal-manager.js';
import {
  MOBILE_IMAGE_MAX_VIEWPORT_EDGE,
  resolveImageAssetSet,
  buildTimedImagesFromSet
} from './image-assets.js';

function createClassList() {
  const classes = new Set();
  return {
    add: (...tokens) => tokens.forEach((token) => classes.add(token)),
    remove: (...tokens) => tokens.forEach((token) => classes.delete(token)),
    contains: (token) => classes.has(token),
    toggle: (token, force) => {
      if (force === true) {
        classes.add(token);
        return true;
      }
      if (force === false) {
        classes.delete(token);
        return false;
      }
      if (classes.has(token)) {
        classes.delete(token);
        return false;
      }
      classes.add(token);
      return true;
    }
  };
}

function createFocusableElement(doc, id) {
  const attributes = new Map();
  const element = {
    id,
    classList: createClassList(),
    disabled: false,
    tabIndex: 0,
    isConnected: true,
    parentElement: { classList: createClassList() },
    setAttribute: (name, value) => {
      attributes.set(name, String(value));
      if (name === 'tabindex') {
        element.tabIndex = Number(value);
      }
    },
    getAttribute: (name) => attributes.get(name) || null,
    focus: () => {
      doc.activeElement = element;
    },
    contains: (target) => target === element,
    getClientRects: () => [1]
  };
  return element;
}

function createContainerElement(doc, id, focusableChildren = []) {
  const attributes = new Map();
  const element = {
    id,
    classList: createClassList(),
    inert: false,
    hidden: false,
    isConnected: true,
    returnFocusEl: null,
    setAttribute: (name, value) => {
      attributes.set(name, String(value));
    },
    getAttribute: (name) => attributes.get(name) || null,
    focus: () => {
      doc.activeElement = element;
    },
    contains: (target) => target === element || focusableChildren.includes(target),
    querySelectorAll: () => focusableChildren
  };
  return element;
}

function createTimedGuessBox() {
  const radios = ['normal', 'suspicious', 'swollen'].map((value) => ({
    value,
    checked: false,
    disabled: false,
    parentElement: { classList: createClassList() }
  }));

  return {
    hidden: true,
    querySelectorAll: (selector) => {
      return selector === 'input[name="timedGuess"]' ? radios : [];
    },
    querySelector: (selector) => {
      if (selector === 'input[name="timedGuess"]:checked') {
        return radios.find((radio) => radio.checked) || null;
      }

      const valueMatch = selector.match(/value="([^"]+)"/);
      if (valueMatch) {
        return radios.find((radio) => radio.value === valueMatch[1]) || null;
      }

      return null;
    }
  };
}

function runStateMachineGuardTest() {
  const state = createAppState({ defaultImageSrc: 'assets/images/ret180.webp' });
  const machine = createStateMachine(state);

  assert.equal(machine.beginTimedSession(), true);
  assert.equal(machine.beginTimedSession(), false);
  assert.equal(machine.beginMcqSession(), false);

  assert.equal(machine.endTimedSession(), true);
  assert.equal(machine.beginMcqSession(), true);
}

function runImageAssetSelectionTest() {
  const imageAssetSets = {
    full: {
      normal: 'assets/images/ret180.webp',
      suspicious: 'assets/images/ret180_2.webp',
      swollen: 'assets/images/ret180_4.webp'
    },
    mobile: {
      normal: 'assets/images/ret180_2048.webp',
      suspicious: 'assets/images/ret180_2_2048.webp',
      swollen: 'assets/images/ret180_4_2048.webp'
    }
  };

  assert.equal(
    resolveImageAssetSet({
      imageAssetSets,
      queryValue: 'full',
      hasCoarsePointer: true,
      viewportEdge: 500
    }),
    imageAssetSets.full
  );
  assert.equal(
    resolveImageAssetSet({
      imageAssetSets,
      queryValue: 'mobile',
      hasCoarsePointer: false,
      viewportEdge: 5000
    }),
    imageAssetSets.mobile
  );
  assert.equal(
    resolveImageAssetSet({
      imageAssetSets,
      queryValue: '',
      hasCoarsePointer: true,
      viewportEdge: 3000
    }),
    imageAssetSets.mobile
  );
  assert.equal(
    resolveImageAssetSet({
      imageAssetSets,
      queryValue: '',
      hasCoarsePointer: false,
      viewportEdge: MOBILE_IMAGE_MAX_VIEWPORT_EDGE
    }),
    imageAssetSets.mobile
  );
  assert.equal(
    resolveImageAssetSet({
      imageAssetSets,
      queryValue: '',
      hasCoarsePointer: false,
      viewportEdge: MOBILE_IMAGE_MAX_VIEWPORT_EDGE + 1
    }),
    imageAssetSets.full
  );

  const timedFallback = [
    { src: 'assets/images/ret180.webp', label: 'normal' },
    { src: 'assets/images/ret180_2.webp', label: 'suspicious' },
    { src: 'assets/images/ret180_4.webp', label: 'swollen' }
  ];
  const timedImages = buildTimedImagesFromSet(imageAssetSets.mobile, timedFallback);
  assert.deepEqual(timedImages, [
    { src: 'assets/images/ret180_2048.webp', label: 'normal' },
    { src: 'assets/images/ret180_2_2048.webp', label: 'suspicious' },
    { src: 'assets/images/ret180_4_2048.webp', label: 'swollen' }
  ]);
  assert.equal(buildTimedImagesFromSet(null, timedFallback), timedFallback);
}

function runTimedControllerIntegrationTest() {
  const state = createAppState({ defaultImageSrc: 'assets/images/ret180.webp' });
  const machine = createStateMachine(state);
  const timedGuessBox = createTimedGuessBox();
  const viewer = {
    setDiscVisible: () => {},
    setViewerControlsDisabled: () => {},
    setDilated: () => {},
    getIsDilated: () => false,
    setCataractLevel: () => {},
    getCataractLevel: () => 0,
    ensureUndilated: () => {},
    setImageSource: () => {},
    getActiveConditionImagePath: () => 'assets/images/ret180.webp'
  };

  const timedController = createTimedTestController({
    state,
    stateMachine: machine,
    timedImages: [
      { src: 'assets/images/ret180.webp', label: 'normal' },
      { src: 'assets/images/ret180_2.webp', label: 'suspicious' }
    ],
    timedTotalRounds: 2,
    closeTestModal: () => {},
    setModalState: () => {},
    infoModal: {},
    infoIcon: {},
    explanationDiv: { hidden: false },
    timedGuessBox,
    timedMessage: { textContent: '' },
    timedCountdown: { textContent: '' },
    submitTimedGuessButton: { disabled: false },
    timedTestResult: { textContent: '' },
    viewer
  });

  assert.equal(timedController.startTimedTest(), true);
  assert.equal(state.timed.isActive, true);
  assert.equal(state.timed.round, 1);
  assert.ok(state.timed.countdownTimer);

  assert.equal(timedController.startTimedTest(), false);

  timedController.destroy();
  assert.equal(state.timed.isActive, false);
  assert.equal(state.timed.countdownTimer, null);
  assert.equal(state.timed.feedbackTimer, null);
}

function runTimedSetGuaranteedFlipTest() {
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;

  globalThis.setTimeout = (fn) => {
    fn();
    return 1;
  };
  globalThis.clearTimeout = () => {};

  try {
    const state = createAppState({ defaultImageSrc: 'assets/images/ret180.webp' });
    const machine = createStateMachine(state);
    const timedGuessBox = createTimedGuessBox();
    const timedAugmentationHistory = [];
    const viewer = {
      setDiscVisible: () => {},
      setViewerControlsDisabled: () => {},
      setFovDegrees: () => {},
      setDilated: () => {},
      getIsDilated: () => false,
      setCataractLevel: () => {},
      getCataractLevel: () => 0,
      ensureUndilated: () => {},
      setRightEye: () => {},
      getIsRightEye: () => true,
      getFovDegrees: () => 8,
      setImageSource: () => {},
      getActiveConditionImagePath: () => 'assets/images/ret180.webp',
      clearTimedAugmentation: () => {},
      setTimedAugmentation: (augmentation) => {
        timedAugmentationHistory.push(Boolean(augmentation?.flipVertical));
      },
      clearTimedMotionProfile: () => {},
      setTimedMotionProfile: () => {},
      doGazeShift: () => {}
    };

    const timedController = createTimedTestController({
      state,
      stateMachine: machine,
      timedImages: [
        { src: 'assets/images/ret180.webp', label: 'normal' },
        { src: 'assets/images/ret180_2.webp', label: 'suspicious' },
        { src: 'assets/images/ret180_4.webp', label: 'swollen' }
      ],
      timedTotalRounds: 4,
      timedRoundProfiles: [
        { seconds: 5, isDilated: true, cataractLevel: 0 },
        { seconds: 4, isDilated: false, cataractLevel: 0 },
        { seconds: 3, isDilated: false, cataractLevel: 1 }
      ],
      closeTestModal: () => {},
      setModalState: () => {},
      infoModal: {},
      infoIcon: {},
      explanationDiv: { hidden: false },
      timedGuessBox,
      timedMessage: { textContent: '' },
      timedCountdown: { textContent: '' },
      submitTimedGuessButton: { disabled: false },
      timedTestResult: { textContent: '', innerHTML: '' },
      viewer
    });

    assert.equal(timedController.startTimedTest(), true);

    let guard = 0;
    while (state.timed.isActive && guard < 10) {
      const radios = timedGuessBox.querySelectorAll('input[name="timedGuess"]');
      radios.forEach((radio) => {
        radio.checked = false;
      });
      const currentLabel = state.timed.currentLabel;
      const selected = timedGuessBox.querySelector(
        `input[name="timedGuess"][value="${currentLabel}"]`
      );
      assert.ok(selected, 'Expected a radio input for the current timed label.');
      selected.checked = true;
      timedController.submitTimedGuess();
      guard += 1;
    }

    assert.equal(state.timed.isActive, false);
    assert.ok(
      timedAugmentationHistory.length >= 4,
      'Expected one augmentation payload per timed round.'
    );
    assert.ok(
      timedAugmentationHistory.some(Boolean),
      'Expected at least one vertically flipped round per timed set.'
    );
  } finally {
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
  }
}

function runMcqControllerScopedQueryTest() {
  const state = createAppState({ defaultImageSrc: 'assets/images/ret180.webp' });
  const machine = createStateMachine(state);
  const ownerDocument = {
    createElement: () => ({
      appendChild: () => {},
      className: '',
      textContent: '',
      value: '',
      type: '',
      name: ''
    }),
    body: {
      appendChild: () => {},
      removeChild: () => {}
    }
  };
  const testContainer = {
    ownerDocument,
    innerHTML: '',
    querySelector: () => null,
    querySelectorAll: () => []
  };

  const mcqController = createMcqController({
    state,
    stateMachine: machine,
    questionBank: [],
    buildMcqTest: () => [],
    evaluateMcqSubmission: () => ({
      score: 0,
      maxScore: 0,
      passThreshold: 0,
      passed: false,
      details: []
    }),
    generatePassCode: () => 'AAAA',
    formatMcqResultText: () => 'result',
    setModalState: () => {},
    testModal: {},
    triggerButton: {},
    testContainer,
    submitTestButton: { hidden: false, disabled: false },
    saveResultButton: { hidden: false },
    testResultDiv: { textContent: '', innerHTML: '' }
  });

  assert.equal(mcqController.openTestModal(), true);
  assert.equal(state.mcq.selectedQuestions.length, 0);

  machine.beginTimedSession();
  assert.equal(mcqController.openTestModal(), false);
  machine.endTimedSession();

  mcqController.destroy();
  assert.equal(testContainer.innerHTML, '');
}

async function runModalFocusAndEscapeTest() {
  const originalDocument = globalThis.document;
  const fakeDocument = {
    activeElement: null,
    body: {
      classList: createClassList()
    }
  };
  globalThis.document = fakeDocument;

  try {
    const sideMenuButtonA = createFocusableElement(fakeDocument, 'takeTestButton');
    const sideMenuButtonB = createFocusableElement(fakeDocument, 'takeTimedTestButton');
    const burgerIcon = createFocusableElement(fakeDocument, 'burger-icon');
    const infoIcon = createFocusableElement(fakeDocument, 'info-icon');

    const infoCloseButton = createFocusableElement(fakeDocument, 'closeInfoModal');
    const infoSecondaryButton = createFocusableElement(fakeDocument, 'infoSecondaryButton');
    const testCloseButton = createFocusableElement(fakeDocument, 'closeTestModal');

    const sideMenu = createContainerElement(fakeDocument, 'sideMenu', [
      sideMenuButtonA,
      sideMenuButtonB
    ]);
    const infoModal = createContainerElement(fakeDocument, 'infoModal', [
      infoCloseButton,
      infoSecondaryButton
    ]);
    const testModal = createContainerElement(fakeDocument, 'testModal', [testCloseButton]);

    const state = createAppState({ defaultImageSrc: 'assets/images/ret180.webp' });
    const stateMachine = createStateMachine(state);
    const modalManager = createModalManager({
      state,
      stateMachine,
      sideMenu,
      sideMenuButtons: [sideMenuButtonA, sideMenuButtonB],
      burgerIcon,
      infoIcon,
      infoModal,
      testModal
    });

    modalManager.setSideMenuOpen(true);
    assert.equal(state.ui.sideMenuOpen, true);
    assert.equal(sideMenu.classList.contains('open'), true);
    assert.equal(sideMenuButtonA.disabled, false);
    assert.equal(sideMenuButtonA.tabIndex, 0);

    modalManager.setModalState(infoModal, true, infoIcon);
    await Promise.resolve();
    assert.equal(fakeDocument.activeElement, infoCloseButton);
    assert.equal(state.ui.activeModal, 'infoModal');

    fakeDocument.activeElement = infoSecondaryButton;
    let tabPrevented = false;
    modalManager.handleDocumentKeyDown(
      {
        key: 'Tab',
        shiftKey: false,
        preventDefault: () => {
          tabPrevented = true;
        }
      },
      { closeTestModal: () => {} }
    );
    assert.equal(tabPrevented, true);
    assert.equal(fakeDocument.activeElement, infoCloseButton);

    fakeDocument.activeElement = infoCloseButton;
    let reverseTabPrevented = false;
    modalManager.handleDocumentKeyDown(
      {
        key: 'Tab',
        shiftKey: true,
        preventDefault: () => {
          reverseTabPrevented = true;
        }
      },
      { closeTestModal: () => {} }
    );
    assert.equal(reverseTabPrevented, true);
    assert.equal(fakeDocument.activeElement, infoSecondaryButton);

    modalManager.setModalState(testModal, true, burgerIcon);
    modalManager.setSideMenuOpen(true);

    let closeTestModalCalls = 0;
    modalManager.handleDocumentKeyDown(
      {
        key: 'Escape'
      },
      {
        closeTestModal: () => {
          closeTestModalCalls += 1;
          modalManager.setModalState(testModal, false, burgerIcon);
        }
      }
    );

    assert.equal(closeTestModalCalls, 1);
    assert.equal(modalManager.isModalOpen(infoModal), false);
    assert.equal(modalManager.isModalOpen(testModal), false);
    assert.equal(state.ui.sideMenuOpen, false);
    assert.equal(state.ui.activeModal, null);
  } finally {
    globalThis.document = originalDocument;
  }
}

async function run() {
  runStateMachineGuardTest();
  runImageAssetSelectionTest();
  runTimedControllerIntegrationTest();
  runTimedSetGuaranteedFlipTest();
  runMcqControllerScopedQueryTest();
  await runModalFocusAndEscapeTest();
}

run()
  .then(() => {
    console.log('App integration tests passed.');
  })
  .catch((error) => {
    console.error(`App integration tests failed: ${error.message}`);
    process.exit(1);
  });
