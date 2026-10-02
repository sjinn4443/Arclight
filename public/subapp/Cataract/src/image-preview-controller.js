import { $$ } from "./dom-utils.js";

const POPUP_DELAY_MS = 500;

export function initImagePreviewController() {
  let popupTimer;
  let activeButton = null;
  let suppressNextClick = false;

  function showImagePopup(button) {
    let popup = document.getElementById("image-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "image-popup";
      popup.className = "image-preview-dialog";
      popup.setAttribute("role", "dialog");
      popup.setAttribute("aria-modal", "true");
      popup.setAttribute("aria-label", "Enlarged illustrative image");
      popup.hidden = true;
      popup.addEventListener("contextmenu", (event) => {
        event.preventDefault();
      });
      popup.addEventListener("click", (event) => {
        if (event.target === popup) {
          hideImagePopup();
        }
      });
      document.body.appendChild(popup);
    }

    popup.innerHTML = "";
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "image-preview-close";
    closeButton.setAttribute("aria-label", "Close enlarged image");
    closeButton.textContent = "\u00d7";
    closeButton.addEventListener("click", hideImagePopup);
    popup.appendChild(closeButton);

    const image = button.querySelector("img");
    if (image) {
      const enlargedImage = image.cloneNode(true);
      enlargedImage.draggable = false;
      enlargedImage.addEventListener("contextmenu", (event) =>
        event.preventDefault(),
      );
      enlargedImage.className = "image-preview-image";
      popup.appendChild(enlargedImage);
      popup.hidden = false;
      document.body.classList.add("modal-open");
      activeButton = button;
      suppressNextClick = true;
      closeButton.focus();
    }
  }

  function hideImagePopup() {
    clearTimeout(popupTimer);
    const popup = document.getElementById("image-popup");
    if (popup && !popup.hidden) {
      popup.hidden = true;
      document.body.classList.remove("modal-open");
      activeButton?.focus();
    }
    activeButton = null;
  }

  const buttons = $$(".button-item button");
  buttons.forEach((button) => {
    button.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
    button.addEventListener("mousedown", () => {
      popupTimer = setTimeout(() => showImagePopup(button), POPUP_DELAY_MS);
    });
    button.addEventListener("mouseup", () => clearTimeout(popupTimer));
    button.addEventListener("mouseleave", () => clearTimeout(popupTimer));
    button.addEventListener(
      "touchstart",
      () => {
        popupTimer = setTimeout(() => showImagePopup(button), POPUP_DELAY_MS);
      },
      { passive: true },
    );
    button.addEventListener("touchend", () => clearTimeout(popupTimer));
    button.addEventListener("touchcancel", () => clearTimeout(popupTimer));
    button.addEventListener(
      "click",
      (event) => {
        if (!suppressNextClick) {
          return;
        }
        suppressNextClick = false;
        event.preventDefault();
        event.stopImmediatePropagation();
      },
      true,
    );
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideImagePopup();
    }
  });
}
