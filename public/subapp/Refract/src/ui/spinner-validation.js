import { getDefaultInputBorder } from "./field-metadata.js?v=20260310-14";
import { CYLINDER_CLEANUP_DELAY } from "./spinner-constants.js?v=20260310-14";
import {
  clearValue,
  normalizeInputValue,
} from "./spinner-values.js?v=20260310-14";
import { syncVisualPlaceholder } from "./visual-placeholders.js?v=20260310-14";

export function attachValidationHandlers(input, meta) {
  let cylinderCleanupTimer = null;

  const getRow = () => input.closest(".form-row");

  input.addEventListener("blur", () => {
    normalizeInputValue(input, meta);

    if (meta.isCylinder && parseFloat(input.value) === 0) {
      scheduleCylinderCleanup();
    }

    if (meta.isAxis) {
      clearAxisIfCylinderInvalid(getRow(), input);
    }

    if (meta.isSphere || meta.isCylinder || meta.isAxis) {
      enforceSphereAutofill(getRow());
    }

    syncAxisBorder(getRow());
  });

  if (meta.isCylinder) {
    input.addEventListener("input", () => {
      if (parseFloat(input.value) === 0) {
        scheduleCylinderCleanup();
      } else if (cylinderCleanupTimer) {
        window.clearTimeout(cylinderCleanupTimer);
      }

      enforceSphereAutofill(getRow());
      syncAxisBorder(getRow());
    });
  }

  if (meta.isAxis) {
    input.addEventListener("input", () => {
      clearAxisIfCylinderInvalid(getRow(), input);
      enforceSphereAutofill(getRow());
      syncAxisBorder(getRow());
    });
  }

  if (meta.isAdd) {
    input.addEventListener("input", () => {
      const numericValue = parseFloat(input.value) || 0;
      if (numericValue < 0.25) {
        clearValue(input, meta);
      }
    });
  }

  if (meta.isSphere) {
    input.addEventListener("blur", () => {
      enforceSphereAutofill(getRow());
    });
  }

  function scheduleCylinderCleanup() {
    if (cylinderCleanupTimer) {
      window.clearTimeout(cylinderCleanupTimer);
    }

    cylinderCleanupTimer = window.setTimeout(() => {
      if (parseFloat(input.value) === 0) {
        clearCylinderAndAxis(getRow(), input, meta);
      }
    }, CYLINDER_CLEANUP_DELAY);
  }
}

function clearAxisIfCylinderInvalid(formRow, axisInput) {
  if (!formRow || !axisInput) {
    return;
  }

  const cylinderInput = getRowInput(formRow, "cyl");
  if (!hasValidCylinderValue(cylinderInput)) {
    axisInput.value = "";
    syncVisualPlaceholder(axisInput);
    axisInput.dispatchEvent(new Event("change"));
  }
}

function clearCylinderAndAxis(formRow, cylinderInput, cylinderMeta) {
  clearValue(cylinderInput, cylinderMeta, { dispatch: false });

  const axisInput = getRowInput(formRow, "axis");
  if (axisInput) {
    axisInput.value = "";
    axisInput.style.border = getDefaultInputBorder(axisInput);
    syncVisualPlaceholder(axisInput);
    axisInput.dispatchEvent(new Event("change"));
  }

  cylinderInput.dispatchEvent(new Event("change"));
}

function syncAxisBorder(formRow) {
  if (!formRow) {
    return;
  }

  const cylinderInput = getRowInput(formRow, "cyl");
  const axisInput = getRowInput(formRow, "axis");
  if (!cylinderInput || !axisInput) {
    return;
  }

  const hasAxis = axisInput.value.trim() !== "";
  axisInput.style.border =
    hasValidCylinderValue(cylinderInput) !== hasAxis
      ? "2px solid red"
      : getDefaultInputBorder(axisInput);
}

function enforceSphereAutofill(formRow) {
  if (!formRow) {
    return;
  }

  const sphereInput = getRowInput(formRow, "sph");
  const cylinderInput = getRowInput(formRow, "cyl");
  const axisInput = getRowInput(formRow, "axis");

  if (!sphereInput || !cylinderInput || !axisInput) {
    return;
  }

  if (
    sphereInput.value.trim() === "" &&
    cylinderInput.value.trim() !== "" &&
    axisInput.value.trim() !== ""
  ) {
    sphereInput.value = "0.00";
    syncVisualPlaceholder(sphereInput);
    sphereInput.dispatchEvent(new Event("change"));
  }
}

function hasValidCylinderValue(cylinderInput) {
  return (
    Boolean(cylinderInput?.value.trim()) &&
    parseFloat(cylinderInput.value) >= 0.25
  );
}

function getRowInput(formRow, placeholder) {
  return formRow.querySelector(`input[placeholder="${placeholder}"]`);
}
