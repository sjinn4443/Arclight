let infoBoxOpen = false;
let infoReturnFocus = null;

function getInfoFocusableElements(popup) {
  if (!popup) return [];
  return Array.from(
    popup.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hidden);
}

function setInfoPopupState(isOpen) {
  const popup = document.getElementById("info-popup");
  const icon = document.getElementById("info-icon");
  if (!popup) return;

  infoBoxOpen = Boolean(isOpen);
  popup.hidden = !infoBoxOpen;
  if (icon) icon.setAttribute("aria-expanded", infoBoxOpen ? "true" : "false");

  if (infoBoxOpen) {
    infoReturnFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : icon;
    const focusTarget = document.getElementById("info-close") || popup;
    window.requestAnimationFrame(() => focusTarget.focus());
  } else if (
    infoReturnFocus instanceof HTMLElement &&
    document.contains(infoReturnFocus)
  ) {
    infoReturnFocus.focus();
    infoReturnFocus = null;
  }
}

function toggleInfoBox(forceOpen) {
  if (typeof forceOpen === "boolean") {
    setInfoPopupState(forceOpen);
    return;
  }
  setInfoPopupState(!infoBoxOpen);
}

function closeIfClickedOutside(event) {
  const popup = document.getElementById("info-popup");
  const icon = document.getElementById("info-icon");
  if (!popup || !icon || !infoBoxOpen) return;

  if (popup.contains(event.target) || icon.contains(event.target)) {
    return;
  }

  setInfoPopupState(false);
}

function handleInfoPopupKeydown(event) {
  if (!infoBoxOpen) return;
  const popup = document.getElementById("info-popup");
  if (!popup) return;

  if (event.key === "Escape") {
    event.preventDefault();
    setInfoPopupState(false);
    return;
  }
  if (event.key !== "Tab") return;

  const focusable = getInfoFocusableElements(popup);
  if (!focusable.length) {
    event.preventDefault();
    popup.focus();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

document.addEventListener("keydown", handleInfoPopupKeydown);
