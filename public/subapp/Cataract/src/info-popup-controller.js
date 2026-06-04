import { $ } from "./dom-utils.js";
import { UI_COPY } from "./cataract-copy.js?v=20260511-1";

export function initInfoPopupController() {
  const infoIcon = $("#info-icon");
  const infoPopup = $("#info-popup");
  const infoClose = $("#info-close");
  const sideMenu = $("#sideMenu");
  const burgerIcon = $("#burger-icon");

  function hydrateInfoCopy() {
    const intro = $("#info-copy-intro");
    const outro = $("#info-copy-outro");
    const bulletEls = [
      $("#info-copy-bullet-1"),
      $("#info-copy-bullet-2"),
      $("#info-copy-bullet-3"),
      $("#info-copy-bullet-4"),
      $("#info-copy-bullet-5"),
    ];

    if (intro) {
      intro.textContent = UI_COPY.infoPopup.intro;
    }
    UI_COPY.infoPopup.bullets.forEach((text, index) => {
      const bulletEl = bulletEls[index];
      if (bulletEl) {
        bulletEl.textContent = text;
      }
    });
    if (outro) {
      outro.textContent = UI_COPY.infoPopup.outro;
    }
  }

  function setInfoPopupOpen(isOpen) {
    if (!infoPopup) {
      return;
    }
    if (isOpen && sideMenu) {
      sideMenu.classList.remove("open");
      sideMenu.setAttribute("aria-hidden", "true");
      sideMenu.setAttribute("inert", "");
      if (burgerIcon) {
        burgerIcon.setAttribute("aria-expanded", "false");
      }
    }
    infoPopup.hidden = !isOpen;
    if (infoIcon) {
      infoIcon.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
  }

  if (infoIcon && infoPopup) {
    infoIcon.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setInfoPopupOpen(infoPopup.hidden);
    });
  }

  if (infoClose) {
    infoClose.addEventListener("click", () => {
      setInfoPopupOpen(false);
    });
  }

  document.addEventListener("click", (event) => {
    if (!infoPopup || infoPopup.hidden) {
      return;
    }
    const clickedInsidePopup = infoPopup.contains(event.target);
    const clickedInfoIcon = infoIcon && infoIcon.contains(event.target);
    if (!clickedInsidePopup && !clickedInfoIcon) {
      setInfoPopupOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setInfoPopupOpen(false);
    }
  });

  hydrateInfoCopy();

  return {
    close: () => setInfoPopupOpen(false),
  };
}
