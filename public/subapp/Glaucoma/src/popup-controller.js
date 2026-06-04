import { $, $$ } from "./dom-utils.js";
import { INFO_LOGIC_ITEMS, INFO_LOGIC_VERSION } from "./risk-config.js";

function positionPopupNearTrigger(popup, trigger) {
  const triggerRect = trigger.getBoundingClientRect();
  const top = window.scrollY + triggerRect.bottom + 5;
  const popupWidth = popup.offsetWidth;
  const iconWidth = triggerRect.width;
  let left = window.scrollX + triggerRect.left - (popupWidth - iconWidth) - 5;

  const minLeft = window.scrollX + 8;
  const maxLeft = window.scrollX + window.innerWidth - popupWidth - 8;
  left = Math.max(minLeft, Math.min(left, maxLeft));

  popup.style.top = `${top}px`;
  popup.style.left = `${left}px`;
}

function renderInfoLogicSection(root) {
  const logicList = $("#info-logic-list", root);
  const logicVersion = $("#info-logic-version", root);
  const doc = root.ownerDocument ?? root;

  if (logicList) {
    const lines = INFO_LOGIC_ITEMS.map((item) => {
      const line = doc.createElement("li");
      line.textContent = item;
      return line;
    });
    logicList.replaceChildren(...lines);
  }

  if (logicVersion) {
    logicVersion.textContent = INFO_LOGIC_VERSION;
  }
}

export function initPopupController(root = document) {
  const infoIcon = $("#info-icon", root);
  const infoPopup = $("#info-popup", root);
  const sideMenu = $("#sideMenu", root);
  const burgerIcon = $("#burger-icon", root);
  const anchoredPopups = $$(".popup", root);

  renderInfoLogicSection(root);

  if (!infoIcon && anchoredPopups.length === 0) {
    return;
  }

  function closeAnchoredPopups() {
    anchoredPopups.forEach((popup) => popup.classList.remove("active"));
  }

  function closeInfoPopup() {
    if (infoPopup) {
      infoPopup.classList.remove("active");
      infoIcon?.setAttribute("aria-expanded", "false");
    }
  }

  function closeSideMenu() {
    if (!sideMenu) {
      return;
    }
    sideMenu.classList.remove("open");
    sideMenu.setAttribute("aria-hidden", "true");
    sideMenu.setAttribute("inert", "");
    sideMenu.inert = true;
    burgerIcon?.setAttribute("aria-expanded", "false");
    burgerIcon?.setAttribute("aria-label", "Open menu");
  }

  function closeAllPopups() {
    closeAnchoredPopups();
    closeInfoPopup();
  }

  function openAnchoredPopup(trigger) {
    const popupId = trigger.dataset.popupTarget;
    if (!popupId) {
      return;
    }

    const popup = root.getElementById(popupId);
    if (!popup) {
      return;
    }

    const wasOpen = popup.classList.contains("active");
    closeAllPopups();
    if (wasOpen) {
      return;
    }

    popup.classList.add("active");
    positionPopupNearTrigger(popup, trigger);
  }

  if (infoIcon && infoPopup) {
    infoIcon.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const wasOpen = infoPopup.classList.contains("active");
      closeAnchoredPopups();
      closeSideMenu();
      infoPopup.classList.toggle("active", !wasOpen);
      infoIcon.setAttribute("aria-expanded", !wasOpen ? "true" : "false");
    });
  }

  root.addEventListener("click", (event) => {
    const target = event.target;

    const closeButton = target.closest(".popup-close-button");
    if (closeButton) {
      event.preventDefault();
      event.stopPropagation();
      const popup =
        closeButton.closest(".popup") ?? closeButton.closest("#info-popup");
      if (popup === infoPopup) {
        closeInfoPopup();
      } else if (popup) {
        popup.classList.remove("active");
      }
      return;
    }

    const anchoredTrigger = target.closest(".info-icon[data-popup-target]");
    if (anchoredTrigger) {
      event.preventDefault();
      event.stopPropagation();
      openAnchoredPopup(anchoredTrigger);
      return;
    }

    const insideAnchoredPopup = Boolean(target.closest(".popup"));
    const insideInfoPopup = Boolean(target.closest("#info-popup"));
    const clickedInfoIcon = Boolean(
      infoIcon && (target === infoIcon || infoIcon.contains(target)),
    );

    if (!insideAnchoredPopup) {
      closeAnchoredPopups();
    }

    if (!insideInfoPopup && !clickedInfoIcon) {
      closeInfoPopup();
    }
  });

  window.addEventListener("resize", () => {
    const activePopup = root.querySelector(".popup.active");
    if (!activePopup) {
      return;
    }
    const trigger = root.querySelector(
      `.info-icon[data-popup-target="${activePopup.id}"]`,
    );
    if (!trigger) {
      return;
    }
    positionPopupNearTrigger(activePopup, trigger);
  });
}
