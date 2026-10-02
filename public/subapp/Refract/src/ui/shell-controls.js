export function initShellControls() {
  const infoIcon = document.getElementById("info-icon");
  const infoPopup = document.getElementById("info-popup");
  const closePopup = document.getElementById("close-popup");
  const burgerIcon = document.getElementById("burger-icon");
  const sideMenu = document.getElementById("sideMenu");
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");
  const mcqButtons = document.querySelectorAll(".mcq-level-button");
  const focusableSelector =
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';
  let infoReturnFocus = null;
  let menuReturnFocus = null;

  function focusFirst(container, preferred) {
    window.requestAnimationFrame(() => {
      (preferred || container?.querySelector(focusableSelector))?.focus();
    });
  }

  function restoreFocus(element) {
    if (element?.isConnected) {
      window.requestAnimationFrame(() => element.focus());
    }
  }

  function trapFocus(event, container) {
    if (event.key !== "Tab" || !container) return;
    const focusable = [...container.querySelectorAll(focusableSelector)].filter(
      (element) => element.offsetParent !== null,
    );
    if (!focusable.length) return;
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

  function setInfoPopupOpen(isOpen) {
    if (!infoPopup) {
      return;
    }

    infoPopup.classList.toggle("active", isOpen);
    infoPopup.setAttribute("aria-hidden", String(!isOpen));
    if (infoIcon) {
      infoIcon.setAttribute("aria-expanded", String(isOpen));
    }
    if (isOpen) {
      infoReturnFocus = document.activeElement;
      focusFirst(infoPopup, closePopup);
    } else if (infoReturnFocus && infoPopup.contains(document.activeElement)) {
      restoreFocus(infoReturnFocus);
      infoReturnFocus = null;
    }
  }

  function setSideMenuOpen(isOpen) {
    if (!sideMenu || !sidebarBackdrop || !burgerIcon) {
      return;
    }

    const focusWasInside = sideMenu.contains(document.activeElement);
    sideMenu.classList.toggle("open", isOpen);
    sideMenu.setAttribute("aria-hidden", String(!isOpen));
    sideMenu.inert = !isOpen;
    sidebarBackdrop.classList.toggle("open", isOpen);
    burgerIcon.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
    if (isOpen) {
      menuReturnFocus = document.activeElement;
      focusFirst(sideMenu);
    } else if (menuReturnFocus && focusWasInside) {
      restoreFocus(menuReturnFocus);
      menuReturnFocus = null;
    }
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
    if (infoPopup?.classList.contains("active")) {
      trapFocus(event, infoPopup);
    } else if (sideMenu?.classList.contains("open")) {
      trapFocus(event, sideMenu);
    }
    if (event.key === "Escape") {
      setInfoPopupOpen(false);
      setSideMenuOpen(false);
    }
  });

  setSideMenuOpen(false);
  setInfoPopupOpen(false);
}
