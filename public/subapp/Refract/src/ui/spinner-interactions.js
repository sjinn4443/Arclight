import {
  AGE_REPEAT_STEP,
  AXIS_REPEAT_STEP,
  INITIAL_REPEAT_DELAY,
  REPEAT_RATE,
} from "./spinner-constants.js";
import {
  adjustAge,
  cycleAxis,
  getCurrentFieldValue,
  writeSignedValue,
} from "./spinner-values.js";

export function attachSpinnerHandlers(
  input,
  meta,
  spinnerButtons,
  showSpinners,
) {
  const applyValue = (nextValue) => {
    writeSignedValue(input, meta, nextValue, { dispatch: true });
    showSpinners();
  };

  if (meta.isAxis) {
    addLongPress(
      spinnerButtons.upButton,
      () => {
        applyValue(cycleAxis(input, 1));
      },
      () => {
        applyValue(cycleAxis(input, AXIS_REPEAT_STEP));
      },
    );

    addLongPress(
      spinnerButtons.downButton,
      () => {
        applyValue(cycleAxis(input, -1));
      },
      () => {
        applyValue(cycleAxis(input, -AXIS_REPEAT_STEP));
      },
    );

    return;
  }

  if (meta.isAge) {
    addLongPress(
      spinnerButtons.upButton,
      () => {
        applyValue(adjustAge(input, 1));
      },
      () => {
        applyValue(adjustAge(input, AGE_REPEAT_STEP));
      },
    );

    addLongPress(
      spinnerButtons.downButton,
      () => {
        applyValue(adjustAge(input, -1));
      },
      () => {
        applyValue(adjustAge(input, -AGE_REPEAT_STEP));
      },
    );

    return;
  }

  addLongPress(spinnerButtons.upButton, () => {
    applyValue(getCurrentFieldValue(input, meta) + meta.step);
  });

  addLongPress(spinnerButtons.downButton, () => {
    let nextValue = getCurrentFieldValue(input, meta) - meta.step;
    if (meta.isAdd && nextValue < 0) {
      nextValue = 0;
    }

    applyValue(nextValue);
  });
}

function addLongPress(button, normalCallback, repeatCallback = normalCallback) {
  let repeatTimeout = null;
  let repeatInterval = null;

  const stop = () => {
    if (repeatTimeout) {
      window.clearTimeout(repeatTimeout);
      repeatTimeout = null;
    }

    if (repeatInterval) {
      window.clearInterval(repeatInterval);
      repeatInterval = null;
    }
  };

  const start = (event) => {
    event.preventDefault();
    normalCallback();
    repeatTimeout = window.setTimeout(() => {
      repeatCallback();
      repeatInterval = window.setInterval(repeatCallback, REPEAT_RATE);
    }, INITIAL_REPEAT_DELAY);
  };

  button.addEventListener("mousedown", start);
  button.addEventListener("touchstart", start);
  button.addEventListener("mouseup", stop);
  button.addEventListener("mouseleave", stop);
  button.addEventListener("touchend", stop);
  button.addEventListener("touchcancel", stop);
}
