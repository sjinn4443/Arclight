const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function setBodyModalLock(body, shouldLock) {
  if (!body) {
    return;
  }

  const currentCount = parseInt(body.dataset.openModalCount || "0", 10);
  const nextCount = Math.max(0, currentCount + (shouldLock ? 1 : -1));
  body.dataset.openModalCount = String(nextCount);
  body.classList.toggle("modal-open", nextCount > 0);
}

function getFocusableElements(container) {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      element instanceof HTMLElement &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.getClientRects().length > 0,
  );
}

export function createModalController({
  body,
  modal,
  focusRoot,
  initialFocusElement,
}) {
  if (!modal) {
    return {
      close() {},
      isOpen() {
        return false;
      },
      open() {},
      toggle() {},
    };
  }

  if (focusRoot && !focusRoot.hasAttribute("tabindex")) {
    focusRoot.setAttribute("tabindex", "-1");
  }

  let isModalOpen = false;
  let lastFocusedElement = null;

  function focusInitialTarget() {
    const focusableElements = getFocusableElements(focusRoot || modal);
    const fallbackTarget = focusRoot || modal;
    const target =
      initialFocusElement || focusableElements[0] || fallbackTarget;
    if (target instanceof HTMLElement) {
      target.focus();
    }
  }

  function close({ restoreFocus = true } = {}) {
    if (!isModalOpen) {
      return;
    }

    isModalOpen = false;
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    setBodyModalLock(body, false);

    if (
      restoreFocus &&
      lastFocusedElement instanceof HTMLElement &&
      document.contains(lastFocusedElement)
    ) {
      lastFocusedElement.focus();
    }
  }

  function open({ triggerElement } = {}) {
    if (isModalOpen) {
      return;
    }

    lastFocusedElement =
      triggerElement instanceof HTMLElement
        ? triggerElement
        : document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

    isModalOpen = true;
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
    setBodyModalLock(body, true);

    requestAnimationFrame(() => {
      focusInitialTarget();
    });
  }

  function toggle({ triggerElement } = {}) {
    if (isModalOpen) {
      close();
      return;
    }

    open({ triggerElement });
  }

  modal.addEventListener("keydown", (event) => {
    if (!isModalOpen) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = getFocusableElements(focusRoot || modal);
    const fallbackTarget = focusRoot || modal;
    if (!focusableElements.length) {
      event.preventDefault();
      if (fallbackTarget instanceof HTMLElement) {
        fallbackTarget.focus();
      }
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  return {
    close,
    isOpen() {
      return isModalOpen;
    },
    open,
    toggle,
  };
}
