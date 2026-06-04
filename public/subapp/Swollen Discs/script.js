import questionBank from './questions.js';
import {
  buildMcqTest,
  evaluateMcqSubmission,
  generatePassCode,
  formatMcqResultText
} from './mcq-engine.mjs';
import {
  IMAGE_ASSET_SETS,
  DEFAULT_IMAGE_SRC,
  MCQ_TIER_CONFIGS,
  TIMED_IMAGES,
  TIMED_ROUNDS_PER_CATEGORY,
  TIMED_SET_SIZE,
  TIMED_ROUND_PROFILES,
  SHIFT_INTERVAL,
  CATARACT_PRESETS,
  CATARACT_OCCLUSION_SPOTS,
  EXPLANATION_TEMPLATES
} from './app-constants.js';
import {
  IMAGE_SET_QUERY_PARAM,
  resolveImageAssetSet,
  buildTimedImagesFromSet,
  applyConditionButtonImageSet
} from './image-assets.js';
import { createAppState } from './app-state.js';
import { createStateMachine } from './state-machine.js';
import { createViewer } from './viewer.js';
import { createModalManager } from './modal-manager.js';
import { createMcqController } from './mcq-controller.js';
import { createTimedTestController } from './timed-test.js';

const canvas = document.getElementById('fundusCanvas');

const fovToggleCheckbox = document.getElementById('fovToggle');
const fovLabelSmall = document.getElementById('fovLabelSmall');
const fovLabelLeft = document.getElementById('fovLabelLeft');
const fovLabelRight = document.getElementById('fovLabelRight');

const eyeToggleCheckbox = document.getElementById('eyeToggle');
const eyeLabelRight = document.getElementById('eyeLabelRight');
const eyeLabelLeft = document.getElementById('eyeLabelLeft');

const cataractSlider = document.getElementById('cataractSlider');
const cataractStops = document.querySelectorAll('.cataract-stop');
const viewSummary = document.getElementById('viewSummary');
const phonePreviewControl = document.getElementById('phonePreviewControl');
const phoneViewToggleCheckbox = document.getElementById('phoneViewToggle');

const explanation = document.querySelector('.explanation');
const conditionButtons = document.querySelectorAll('.condition-button');

const burgerIcon = document.getElementById('burger-icon');
const sideMenu = document.getElementById('sideMenu');
const sideMenuButtons = sideMenu.querySelectorAll('button');

const infoIcon = document.getElementById('info-icon');
const infoModal = document.getElementById('infoModal');
const closeInfoModalButton = document.getElementById('closeInfoModal');

const testModal = document.getElementById('testModal');
const testModalTitle = document.getElementById('testModalTitle');
const mcqTimer = document.getElementById('mcqTimer');
const closeTestModalButton = document.getElementById('closeTestModal');
const testContainer = document.getElementById('testContainer');
const submitTestButton = document.getElementById('submitTestButton');
const saveResultButton = document.getElementById('saveResultButton');
const testResultDiv = document.getElementById('testResult');

const explanationDiv = document.querySelector('.explanation');
const mcqLevelButtons = sideMenu.querySelectorAll('.mcq-level-button');
const timedLevelButtons = sideMenu.querySelectorAll('.timed-level-button');
const cupAchievement = document.getElementById('cupAchievement');
const cupAchievementLabel = document.getElementById('cupAchievementLabel');
const cupAchievementCode = document.getElementById('cupAchievementCode');
const downloadCupCertificateButton = document.getElementById('downloadCupCertificateButton');
const timedGuessBox = document.getElementById('timedGuessBox');
const timedMessage = document.getElementById('timedMessage');
const timedCountdown = document.getElementById('timedCountdown');
const submitTimedGuessButton = document.getElementById('submitTimedGuessButton');
const timedTestResult = document.getElementById('timedTestResult');

const CUP_ACHIEVEMENT_STORAGE_KEY = 'swollen_discs_cup_achievement_v1';
const MCQ_LEVEL_PROGRESS_STORAGE_KEY = 'swollen_discs_mcq_progress_v1';
const TIMED_LEVEL_PROGRESS_STORAGE_KEY = 'swollen_discs_timed_progress_v1';
const LOCKED_CUP_TEXT = 'Cup Locked: Complete Advanced in MCQ and Timed Sets';
const UNLOCKED_CUP_TEXT = 'Cup Unlocked: Advanced in MCQ and Timed Sets';
const PHONE_VIEW_STORAGE_KEY = 'swollen_discs_phone_view_v1';
const DEFAULT_CUP_ACHIEVEMENT_STATE = Object.freeze({
  unlocked: false,
  code: '',
  unlockedAt: ''
});
const DEFAULT_LEVEL_PROGRESS_STATE = Object.freeze({
  nextTierIndex: 0,
  unlockedTierIndex: -1
});
const queryValue = new window.URLSearchParams(window.location.search)
  .get(IMAGE_SET_QUERY_PARAM)
  ?.toLowerCase();
const hasCoarsePointer =
  typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
const viewportEdge = Math.max(window.innerWidth || 0, window.innerHeight || 0);
const selectedImageSet = resolveImageAssetSet({
  imageAssetSets: IMAGE_ASSET_SETS,
  queryValue,
  hasCoarsePointer,
  viewportEdge
});
applyConditionButtonImageSet(selectedImageSet, conditionButtons);
const resolvedDefaultImageSrc =
  typeof selectedImageSet.normal === 'string' && selectedImageSet.normal.length > 0
    ? selectedImageSet.normal
    : DEFAULT_IMAGE_SRC;
const resolvedTimedImages = buildTimedImagesFromSet(selectedImageSet, TIMED_IMAGES);
scheduleImagePrefetch(
  [
    selectedImageSet.normal,
    selectedImageSet.suspicious,
    selectedImageSet.swollen,
    ...resolvedTimedImages.map((image) => image?.src)
  ].filter((src) => typeof src === 'string' && src.length > 0)
);

const appState = createAppState({ defaultImageSrc: resolvedDefaultImageSrc });
const stateMachine = createStateMachine(appState);
const teardownCallbacks = [];
let gazeIntervalId = null;
let isAppDestroyed = false;
let mcqLevelProgressState = [];
let timedLevelProgressState = [];
let cupAchievementState = loadCupAchievementState();
const initialMcqProgressState = loadLevelProgressState(MCQ_LEVEL_PROGRESS_STORAGE_KEY);
const initialTimedProgressState = loadLevelProgressState(TIMED_LEVEL_PROGRESS_STORAGE_KEY);

const viewer = createViewer({
  state: appState,
  canvas,
  fovToggleCheckbox,
  fovLabelSmall,
  fovLabelLeft,
  fovLabelRight,
  eyeToggleCheckbox,
  eyeLabelRight,
  eyeLabelLeft,
  cataractSlider,
  cataractStops,
  viewSummary,
  explanation,
  conditionButtons,
  defaultImageSrc: resolvedDefaultImageSrc,
  explanationTemplates: EXPLANATION_TEMPLATES,
  cataractPresets: CATARACT_PRESETS,
  cataractOcclusionSpots: CATARACT_OCCLUSION_SPOTS
});

const modalManager = createModalManager({
  state: appState,
  stateMachine,
  sideMenu,
  sideMenuButtons,
  burgerIcon,
  infoIcon,
  infoModal,
  testModal
});

const mcqController = createMcqController({
  state: appState,
  stateMachine,
  questionBank,
  buildMcqTest,
  evaluateMcqSubmission,
  generatePassCode,
  formatMcqResultText,
  setModalState: modalManager.setModalState,
  testModal,
  triggerButton: burgerIcon,
  testContainer,
  submitTestButton,
  saveResultButton,
  testResultDiv,
  testModalTitle,
  mcqTimer,
  mcqTierConfigs: MCQ_TIER_CONFIGS,
  initialProgressState: initialMcqProgressState,
  onProgressChange: renderMcqLevelMenu
});

const timedTestController = createTimedTestController({
  state: appState,
  stateMachine,
  timedImages: resolvedTimedImages,
  timedRoundsPerCategory: TIMED_ROUNDS_PER_CATEGORY,
  timedTotalRounds: TIMED_SET_SIZE,
  timedRoundProfiles: TIMED_ROUND_PROFILES,
  initialProgressState: initialTimedProgressState,
  onProgressChange: renderTimedLevelMenu,
  closeTestModal: mcqController.closeTestModal,
  setModalState: modalManager.setModalState,
  infoModal,
  infoIcon,
  explanationDiv,
  timedGuessBox,
  timedMessage,
  timedCountdown,
  submitTimedGuessButton,
  timedTestResult,
  viewer
});

function scheduleImagePrefetch(imageSources) {
  if (typeof window === 'undefined' || typeof Image === 'undefined') {
    return;
  }

  const uniqueSources = [...new Set(imageSources)];
  const prefetch = () => {
    uniqueSources.forEach((src) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
    });
  };

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(prefetch, { timeout: 1200 });
  } else {
    window.setTimeout(prefetch, 220);
  }
}

function normalizeLevelProgress(levelProgress) {
  return Array.isArray(levelProgress) ? levelProgress : [];
}

function renderLevelButtons(levelButtons, levelProgress) {
  levelButtons.forEach((button) => {
    const levelIndex = Number(button.dataset.levelIndex);
    const levelState = levelProgress[levelIndex];
    if (!levelState) {
      return;
    }

    button.dataset.locked = levelState.unlocked ? 'false' : 'true';
    button.classList.toggle('is-locked', !levelState.unlocked);
    button.classList.toggle('is-complete', levelState.completed);
    button.textContent = `Level ${levelIndex + 1}: ${levelState.name}`;
    button.setAttribute('aria-disabled', levelState.unlocked ? 'false' : 'true');
  });
}

function renderTimedLevelMenu(levelProgress = timedTestController.getLevelProgress()) {
  timedLevelProgressState = normalizeLevelProgress(levelProgress);
  renderLevelButtons(timedLevelButtons, timedLevelProgressState);
  saveLevelProgressState(
    TIMED_LEVEL_PROGRESS_STORAGE_KEY,
    deriveProgressStateFromLevelProgress(timedLevelProgressState)
  );

  renderCupAchievement();
}

function renderMcqLevelMenu(levelProgress = mcqController.getLevelProgress()) {
  mcqLevelProgressState = normalizeLevelProgress(levelProgress);
  renderLevelButtons(mcqLevelButtons, mcqLevelProgressState);
  saveLevelProgressState(
    MCQ_LEVEL_PROGRESS_STORAGE_KEY,
    deriveProgressStateFromLevelProgress(mcqLevelProgressState)
  );

  renderCupAchievement();
}

function isFinalTierCompleted(levelProgressState) {
  if (!Array.isArray(levelProgressState) || levelProgressState.length === 0) {
    return false;
  }

  return Boolean(levelProgressState[levelProgressState.length - 1]?.completed);
}

function renderCupAchievement() {
  if (!cupAchievement) {
    return;
  }

  const hasMcqFinalTier = isFinalTierCompleted(mcqLevelProgressState);
  const hasTimedFinalTier = isFinalTierCompleted(timedLevelProgressState);
  const hasCompletedBothFinalTiers = hasMcqFinalTier && hasTimedFinalTier;
  if (!hasCompletedBothFinalTiers && cupAchievementState.unlocked) {
    cupAchievementState = {
      unlocked: false,
      code: '',
      unlockedAt: ''
    };
    saveCupAchievementState(cupAchievementState);
  } else {
    unlockCupAchievementIfNeeded(hasCompletedBothFinalTiers);
  }

  cupAchievement.hidden = false;
  cupAchievement.setAttribute('aria-hidden', 'false');
  cupAchievement.classList.toggle('is-unlocked', cupAchievementState.unlocked);
  cupAchievement.classList.toggle('is-locked', !cupAchievementState.unlocked);

  if (cupAchievementLabel) {
    cupAchievementLabel.textContent = cupAchievementState.unlocked
      ? UNLOCKED_CUP_TEXT
      : LOCKED_CUP_TEXT;
  }

  if (cupAchievementCode) {
    if (cupAchievementState.unlocked && cupAchievementState.code) {
      cupAchievementCode.hidden = false;
      cupAchievementCode.textContent = `Code: ${cupAchievementState.code}`;
    } else {
      cupAchievementCode.hidden = true;
      cupAchievementCode.textContent = '';
    }
  }

  if (downloadCupCertificateButton) {
    const isCertificateLocked = !cupAchievementState.unlocked;
    downloadCupCertificateButton.disabled = isCertificateLocked;
    downloadCupCertificateButton.dataset.locked = isCertificateLocked ? 'true' : 'false';
    downloadCupCertificateButton.setAttribute(
      'aria-disabled',
      isCertificateLocked ? 'true' : 'false'
    );
  }
}

function unlockCupAchievementIfNeeded(hasCompletedBothFinalTiers) {
  if (!hasCompletedBothFinalTiers || cupAchievementState.unlocked) {
    return;
  }

  cupAchievementState = {
    unlocked: true,
    code: createCupAchievementCode(),
    unlockedAt: new Date().toISOString()
  };
  saveCupAchievementState(cupAchievementState);
}

function hasLocalStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function loadJsonStorage(storageKey) {
  if (!hasLocalStorage()) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

function saveJsonStorage(storageKey, value) {
  if (!hasLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Storage failures are non-fatal for runtime behavior.
  }
}

function loadStringStorage(storageKey) {
  if (!hasLocalStorage()) {
    return null;
  }

  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function saveStringStorage(storageKey, value) {
  if (!hasLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, value);
  } catch {
    // Storage failures are non-fatal for runtime behavior.
  }
}

function loadCupAchievementState() {
  const parsedValue = loadJsonStorage(CUP_ACHIEVEMENT_STORAGE_KEY);
  if (!parsedValue || typeof parsedValue !== 'object') {
    return { ...DEFAULT_CUP_ACHIEVEMENT_STATE };
  }

  return {
    unlocked: Boolean(parsedValue.unlocked),
    code: typeof parsedValue.code === 'string' ? parsedValue.code : '',
    unlockedAt: typeof parsedValue.unlockedAt === 'string' ? parsedValue.unlockedAt : ''
  };
}

function loadLevelProgressState(storageKey) {
  const parsedValue = loadJsonStorage(storageKey);
  if (!parsedValue || typeof parsedValue !== 'object') {
    return { ...DEFAULT_LEVEL_PROGRESS_STATE };
  }

  const nextTierIndex = Number.isFinite(Number(parsedValue.nextTierIndex))
    ? Math.max(0, Math.floor(Number(parsedValue.nextTierIndex)))
    : 0;
  const unlockedTierIndex = Number.isFinite(Number(parsedValue.unlockedTierIndex))
    ? Math.max(-1, Math.floor(Number(parsedValue.unlockedTierIndex)))
    : -1;

  return {
    nextTierIndex,
    unlockedTierIndex
  };
}

function isDesktopPhonePreviewAvailable() {
  if (typeof window === 'undefined') {
    return false;
  }

  const hasCoarsePointer =
    typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
  const viewportWidth = window.innerWidth || 0;
  return !hasCoarsePointer && viewportWidth > 900;
}

function loadPhoneViewPreference() {
  return loadStringStorage(PHONE_VIEW_STORAGE_KEY) === 'true';
}

function savePhoneViewPreference(enabled) {
  saveStringStorage(PHONE_VIEW_STORAGE_KEY, enabled ? 'true' : 'false');
}

function setPhoneViewPreviewEnabled(enabled) {
  document.body.classList.toggle('simulate-phone-frame', Boolean(enabled));
  if (phoneViewToggleCheckbox) {
    phoneViewToggleCheckbox.checked = Boolean(enabled);
  }
}

function saveLevelProgressState(storageKey, progressState) {
  saveJsonStorage(storageKey, progressState);
}

function deriveProgressStateFromLevelProgress(levelProgress) {
  if (!Array.isArray(levelProgress) || levelProgress.length === 0) {
    return {
      nextTierIndex: 0,
      unlockedTierIndex: -1
    };
  }

  const completedIndices = levelProgress
    .filter((level) => level && level.completed)
    .map((level) => Number(level.index))
    .filter((index) => Number.isFinite(index));
  const unlockedIndices = levelProgress
    .filter((level) => level && level.unlocked)
    .map((level) => Number(level.index))
    .filter((index) => Number.isFinite(index));
  const activeLevel = levelProgress.find((level) => level && level.active);
  const maxCompletedIndex = completedIndices.length > 0 ? Math.max(...completedIndices) : -1;
  const maxUnlockedIndex = unlockedIndices.length > 0 ? Math.max(...unlockedIndices) : -1;
  const allCompleted = levelProgress.every((level) => Boolean(level?.completed));

  let nextTierIndex = 0;
  if (allCompleted) {
    nextTierIndex = levelProgress.length;
  } else if (activeLevel && Number.isFinite(Number(activeLevel.index))) {
    nextTierIndex = Math.max(0, Math.floor(Number(activeLevel.index)));
  } else if (maxUnlockedIndex >= 0) {
    nextTierIndex = Math.max(0, Math.min(levelProgress.length - 1, maxUnlockedIndex));
  }

  return {
    nextTierIndex,
    unlockedTierIndex: maxCompletedIndex
  };
}

function saveCupAchievementState(nextState) {
  saveJsonStorage(CUP_ACHIEVEMENT_STORAGE_KEY, nextState);
}

function createCupAchievementCode() {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(0, 14);
  return `SDCUP-${timestamp}-${generatePassCode(6)}`;
}

function downloadCupCertificate() {
  if (!cupAchievementState.unlocked || !cupAchievementState.code) {
    return;
  }

  const unlockedAtDate = cupAchievementState.unlockedAt
    ? new Date(cupAchievementState.unlockedAt)
    : null;
  const issuedAtText =
    unlockedAtDate && !Number.isNaN(unlockedAtDate.valueOf())
      ? unlockedAtDate.toLocaleString()
      : new Date().toLocaleString();

  const certificateText = [
    'Swollen Discs',
    'Practice Certificate of Achievement',
    '(Local Certificate - Not Externally Verified)',
    '',
    'Awarded for completing:',
    '- MCQ Advanced Level',
    '- Timed Set Advanced Level',
    '',
    `Achievement Code: ${cupAchievementState.code}`,
    `Issued: ${issuedAtText}`,
    '',
    'Keep this code for your records.'
  ].join('\n');

  const blob = new Blob([certificateText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const safeCode = cupAchievementState.code.toLowerCase().replace(/[^a-z0-9-]/g, '');

  anchor.href = url;
  anchor.download = `swollen_discs_certificate_${safeCode}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

initialize();

function initialize() {
  if (typeof window !== 'undefined' && typeof window.__swollenDiscsDestroy === 'function') {
    window.__swollenDiscsDestroy();
  }

  viewer.initialize();
  renderMcqLevelMenu();
  renderTimedLevelMenu();
  modalManager.setSideMenuOpen(false);

  const canUsePhoneViewPreview = isDesktopPhonePreviewAvailable();
  if (phonePreviewControl) {
    phonePreviewControl.hidden = !canUsePhoneViewPreview;
  }
  if (phoneViewToggleCheckbox) {
    const initialPhoneViewPreviewEnabled = canUsePhoneViewPreview && loadPhoneViewPreference();
    setPhoneViewPreviewEnabled(initialPhoneViewPreviewEnabled);
    phoneViewToggleCheckbox.disabled = !canUsePhoneViewPreview;

    const onPhoneViewToggleChange = () => {
      const shouldEnablePhoneView = canUsePhoneViewPreview && phoneViewToggleCheckbox.checked;
      setPhoneViewPreviewEnabled(shouldEnablePhoneView);
      savePhoneViewPreference(shouldEnablePhoneView);
      viewer.setDiscVisible(appState.viewer.isDiscVisible);
    };
    addAppListener(phoneViewToggleCheckbox, 'change', onPhoneViewToggleChange);
  } else {
    setPhoneViewPreviewEnabled(false);
  }

  const onBurgerClick = () => {
    modalManager.toggleSideMenu();
  };
  addAppListener(burgerIcon, 'click', onBurgerClick);

  const onInfoClick = () => {
    modalManager.setModalState(infoModal, !modalManager.isModalOpen(infoModal), infoIcon);
  };
  addAppListener(infoIcon, 'click', onInfoClick);

  const onCloseInfoClick = () => {
    modalManager.setModalState(infoModal, false, infoIcon);
  };
  addAppListener(closeInfoModalButton, 'click', onCloseInfoClick);

  addAppListener(closeTestModalButton, 'click', mcqController.closeTestModal);
  addAppListener(submitTestButton, 'click', mcqController.handleSubmitTest);
  addAppListener(saveResultButton, 'click', mcqController.handleSaveResult);
  addAppListener(downloadCupCertificateButton, 'click', downloadCupCertificate);

  mcqLevelButtons.forEach((button) => {
    const onTakeMcqLevelClick = () => {
      const levelIndex = Number(button.dataset.levelIndex);
      const started = mcqController.openTestModal({
        tierIndex: levelIndex,
        beforeOpen: () => {
          if (appState.timed.isActive) {
            timedTestController.exitTimedMode();
          }
        }
      });
      if (!started) {
        return;
      }

      modalManager.setSideMenuOpen(false);
    };

    addAppListener(button, 'click', onTakeMcqLevelClick);
  });

  timedLevelButtons.forEach((button) => {
    const onTakeTimedLevelClick = () => {
      const levelIndex = Number(button.dataset.levelIndex);
      const started = timedTestController.startTimedTest({ tierIndex: levelIndex });
      if (!started) {
        return;
      }

      modalManager.setSideMenuOpen(false);
    };

    addAppListener(button, 'click', onTakeTimedLevelClick);
  });

  addAppListener(submitTimedGuessButton, 'click', timedTestController.submitTimedGuess);

  const onDocumentClick = (event) => {
    modalManager.handleDocumentClick(event, {
      closeTestModal: mcqController.closeTestModal
    });
  };
  addAppListener(document, 'click', onDocumentClick);

  const onDocumentKeyDown = (event) => {
    modalManager.handleDocumentKeyDown(event, {
      closeTestModal: mcqController.closeTestModal
    });
  };
  addAppListener(document, 'keydown', onDocumentKeyDown);

  gazeIntervalId = setInterval(() => {
    if (!appState.viewer.shiftInProgress && !appState.timed.isActive) {
      viewer.doGazeShift();
    }
  }, SHIFT_INTERVAL);

  teardownCallbacks.push(() => {
    if (gazeIntervalId !== null) {
      clearInterval(gazeIntervalId);
      gazeIntervalId = null;
    }
  });

  if (typeof window !== 'undefined') {
    window.__swollenDiscsDestroy = destroyApp;
  }
}

function addAppListener(target, eventName, handler, options) {
  target.addEventListener(eventName, handler, options);
  teardownCallbacks.push(() => {
    target.removeEventListener(eventName, handler, options);
  });
}

function destroyApp() {
  if (isAppDestroyed) {
    return;
  }

  isAppDestroyed = true;

  teardownCallbacks.splice(0).forEach((dispose) => {
    dispose();
  });

  timedTestController.destroy();
  mcqController.destroy();
  modalManager.destroy();
  viewer.destroy();

  if (typeof window !== 'undefined' && window.__swollenDiscsDestroy === destroyApp) {
    window.__swollenDiscsDestroy = null;
  }
}
