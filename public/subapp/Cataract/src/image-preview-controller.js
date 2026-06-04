import { $$ } from "./dom-utils.js";

const POPUP_DELAY_MS = 500;

export function initImagePreviewController() {
  let popupTimer;

  function showImagePopup(button) {
    let popup = document.getElementById("image-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "image-popup";
      popup.style.position = "fixed";
      popup.style.top = "50%";
      popup.style.left = "50%";
      popup.style.transform = "translate(-50%, -50%)";
      popup.style.zIndex = "1000";
      popup.style.backgroundColor = "#fff";
      popup.style.border = "2px solid #ccc";
      popup.style.borderRadius = "20px";
      popup.style.padding = "10px";
      popup.addEventListener("contextmenu", (event) => {
        event.preventDefault();
      });
      document.body.appendChild(popup);
    }

    popup.innerHTML = "";
    const image = button.querySelector("img");
    if (image) {
      const enlargedImage = image.cloneNode(true);
      enlargedImage.draggable = false;
      enlargedImage.addEventListener("contextmenu", (event) =>
        event.preventDefault(),
      );
      enlargedImage.style.maxWidth = "80vw";
      enlargedImage.style.height = "auto";
      enlargedImage.style.display = "block";
      enlargedImage.style.animation = "zoomImage 3s forwards";
      popup.appendChild(enlargedImage);
      popup.style.display = "block";
    }
  }

  function hideImagePopup() {
    clearTimeout(popupTimer);
    const popup = document.getElementById("image-popup");
    if (popup) {
      popup.style.display = "none";
    }
  }

  const buttons = $$(".button-item button");
  buttons.forEach((button) => {
    button.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
    button.addEventListener("mousedown", () => {
      popupTimer = setTimeout(() => showImagePopup(button), POPUP_DELAY_MS);
    });
    button.addEventListener("mouseup", hideImagePopup);
    button.addEventListener("mouseleave", hideImagePopup);
    button.addEventListener("touchstart", () => {
      popupTimer = setTimeout(() => showImagePopup(button), POPUP_DELAY_MS);
    });
    button.addEventListener("touchend", hideImagePopup);
    button.addEventListener("touchcancel", hideImagePopup);
  });
}
