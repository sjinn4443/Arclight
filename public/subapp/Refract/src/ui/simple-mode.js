import { isAxisField, isCylinderField } from "./field-metadata.js";

export function initializeSimpleModeToggle(onSimpleModeDisabled) {
  const simpleToggleCheckbox = document.getElementById("toggle-simple");
  if (!simpleToggleCheckbox) {
    return;
  }

  simpleToggleCheckbox.checked = false;
  updateSimpleMode(simpleToggleCheckbox.checked);

  simpleToggleCheckbox.addEventListener("change", () => {
    if (
      !simpleToggleCheckbox.checked &&
      typeof onSimpleModeDisabled === "function"
    ) {
      onSimpleModeDisabled();
    }

    updateSimpleMode(simpleToggleCheckbox.checked);
  });
}

function updateSimpleMode(isAdvancedModeEnabled) {
  document.body.classList.toggle("advanced-mode", isAdvancedModeEnabled);

  document.querySelectorAll('input[type="number"]').forEach((input) => {
    if (!isAxisField(input) && !isCylinderField(input)) {
      return;
    }

    const wrapper = input.closest(".spinner-container");
    if (wrapper) {
      wrapper.style.display = isAdvancedModeEnabled ? "inline-flex" : "none";
    }
  });
}
