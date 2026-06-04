let infoBoxOpen = false;

function setInfoPopupState(isOpen) {
  const popup = document.getElementById("info-popup");
  if (!popup) return;

  infoBoxOpen = Boolean(isOpen);
  popup.hidden = !infoBoxOpen;
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
