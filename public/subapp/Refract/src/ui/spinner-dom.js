import { AUTO_HIDE_DELAY } from "./spinner-constants.js";

export function ensureSpinnerWrapper(input) {
  const parent = input.parentElement;
  if (parent?.classList.contains("spinner-container")) {
    return parent;
  }

  const wrapper = document.createElement("div");
  wrapper.classList.add("spinner-container");
  input.parentNode.insertBefore(wrapper, input);
  wrapper.appendChild(input);
  return wrapper;
}

export function ensureSpinnerButtons(wrapper) {
  let container = wrapper.querySelector(".spinner-buttons");
  if (!container) {
    container = document.createElement("div");
    container.classList.add("spinner-buttons");

    const upButton = document.createElement("button");
    upButton.type = "button";
    upButton.classList.add("spinner-btn", "spinner-up");
    upButton.textContent = "+";

    const downButton = document.createElement("button");
    downButton.type = "button";
    downButton.classList.add("spinner-btn", "spinner-down");
    downButton.textContent = "-";

    container.appendChild(upButton);
    container.appendChild(downButton);
    wrapper.appendChild(container);
  }

  return {
    container,
    upButton: container.querySelector(".spinner-up"),
    downButton: container.querySelector(".spinner-down"),
  };
}

export function disableKeyboardInput(input) {
  input.addEventListener("keydown", (event) => {
    event.preventDefault();
  });
}

export function createSpinnerVisibilityController(activeButtons) {
  let hideTimer = null;

  return function showSpinners() {
    document.querySelectorAll(".spinner-buttons").forEach((buttons) => {
      if (buttons !== activeButtons) {
        buttons.style.display = "none";
      }
    });

    activeButtons.style.display = "flex";
    if (hideTimer) {
      window.clearTimeout(hideTimer);
    }

    hideTimer = window.setTimeout(() => {
      activeButtons.style.display = "none";
    }, AUTO_HIDE_DELAY);
  };
}

export function attachVisibilityHandlers(
  wrapper,
  spinnerButtons,
  showSpinners,
) {
  wrapper.addEventListener("focusin", showSpinners);
  wrapper.addEventListener("mousedown", showSpinners);
  wrapper.addEventListener("touchstart", showSpinners);
  spinnerButtons.addEventListener("click", showSpinners);
}
