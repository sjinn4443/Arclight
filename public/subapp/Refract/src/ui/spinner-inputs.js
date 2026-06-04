import {
  attachVisibilityHandlers,
  createSpinnerVisibilityController,
  disableKeyboardInput,
  ensureSpinnerButtons,
  ensureSpinnerWrapper,
} from "./spinner-dom.js?v=20260310-14";
import { ensureFieldSignElement } from "./sign-fields.js?v=20260310-14";
import { attachSpinnerHandlers } from "./spinner-interactions.js?v=20260310-14";
import { initializeSimpleModeToggle } from "./simple-mode.js?v=20260310-14";
import {
  getInputMeta,
  syncSignedDisplay,
} from "./spinner-values.js?v=20260310-14";
import { attachValidationHandlers } from "./spinner-validation.js?v=20260310-14";
import { initVisualPlaceholder } from "./visual-placeholders.js?v=20260310-14";

export function initSpinnerInputs(options = {}) {
  const { onSimpleModeDisabled } = options;
  const editableInputs = document.querySelectorAll(
    'input[type="number"]:not([readonly])',
  );
  const allNumberInputs = document.querySelectorAll('input[type="number"]');

  editableInputs.forEach((input) => {
    initializeSpinnerInput(input);
  });

  allNumberInputs.forEach((input) => {
    initVisualPlaceholder(input);
  });

  initializeSimpleModeToggle(onSimpleModeDisabled);
}

function initializeSpinnerInput(input) {
  const meta = getInputMeta(input);
  const wrapper = ensureSpinnerWrapper(input);
  const spinnerButtons = ensureSpinnerButtons(wrapper);
  const showSpinners = createSpinnerVisibilityController(
    spinnerButtons.container,
  );

  if (!meta.isAxis && !meta.isAge) {
    ensureFieldSignElement(input);
  }

  disableKeyboardInput(input);
  syncSignedDisplay(input, meta, 0);
  attachSpinnerHandlers(input, meta, spinnerButtons, showSpinners);
  attachValidationHandlers(input, meta);
  attachVisibilityHandlers(wrapper, spinnerButtons.container, showSpinners);
}
