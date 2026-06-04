export function initShellControls() {
  const infoIcon = document.getElementById("info-icon");
  const infoPopup = document.getElementById("info-popup");
  const closePopup = document.getElementById("close-popup");
  const burgerIcon = document.getElementById("burger-icon");
  const sideMenu = document.getElementById("sideMenu");
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");
  const mcqButtons = document.querySelectorAll(".mcq-level-button");

  function setInfoPopupOpen(isOpen) {
    if (!infoPopup) {
      return;
    }

    infoPopup.classList.toggle("active", isOpen);
    infoPopup.setAttribute("aria-hidden", String(!isOpen));
    if (infoIcon) {
      infoIcon.setAttribute("aria-expanded", String(isOpen));
    }
  }

  function setSideMenuOpen(isOpen) {
    if (!sideMenu || !sidebarBackdrop || !burgerIcon) {
      return;
    }

    sideMenu.classList.toggle("open", isOpen);
    sideMenu.setAttribute("aria-hidden", String(!isOpen));
    sidebarBackdrop.classList.toggle("open", isOpen);
    burgerIcon.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  }

  infoIcon?.addEventListener("click", (event) => {
    event.stopPropagation();
    setSideMenuOpen(false);
    setInfoPopupOpen(!infoPopup?.classList.contains("active"));
  });

  closePopup?.addEventListener("click", (event) => {
    event.stopPropagation();
    setInfoPopupOpen(false);
  });

  infoPopup?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  burgerIcon?.addEventListener("click", (event) => {
    event.stopPropagation();
    setInfoPopupOpen(false);
    setSideMenuOpen(!sideMenu?.classList.contains("open"));
  });

  sideMenu?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  sidebarBackdrop?.addEventListener("click", () => {
    setSideMenuOpen(false);
  });

  mcqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setSideMenuOpen(false);
    });
  });

  document.addEventListener("click", () => {
    setInfoPopupOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setInfoPopupOpen(false);
      setSideMenuOpen(false);
    }
  });

  setSideMenuOpen(false);
  setInfoPopupOpen(false);
}
