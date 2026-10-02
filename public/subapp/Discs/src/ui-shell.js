const scrollLockTokens = new Set();
const modalOpeners = new WeakMap();
const modalKeyHandlers = new WeakMap();

function getFocusable(container) {
  return [
    ...container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ].filter(
    (element) =>
      !element.hidden && element.getAttribute("aria-hidden") !== "true",
  );
}

function syncScrollLock() {
  const locked = scrollLockTokens.size > 0;
  document.documentElement.classList.toggle("is-scroll-locked", locked);
  document.body?.classList.toggle("is-scroll-locked", locked);
}

export function lockPageScroll(token) {
  scrollLockTokens.add(token);
  syncScrollLock();
}

export function unlockPageScroll(token) {
  scrollLockTokens.delete(token);
  syncScrollLock();
}

export function setupDrawer({ menuButton, closeButton, drawer, overlay }) {
  function open() {
    modalOpeners.set(drawer, document.activeElement);
    overlay.hidden = false;
    drawer.classList.add("is-open");
    overlay.classList.add("is-visible");
    drawer.inert = false;
    drawer.removeAttribute("inert");
    drawer.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");
    lockPageScroll("drawer");
    closeButton.focus();
  }

  function close() {
    if (!drawer.classList.contains("is-open")) return;
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    overlay.hidden = true;
    drawer.inert = true;
    drawer.setAttribute("inert", "");
    drawer.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
    unlockPageScroll("drawer");
    modalOpeners.get(drawer)?.focus?.();
  }

  menuButton.addEventListener("click", open);
  closeButton.addEventListener("click", close);
  overlay.addEventListener("click", close);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  return { open, close };
}

export function setupInfoPopup({ button, popup, closeButton }) {
  function open() {
    modalOpeners.set(popup, document.activeElement);
    popup.hidden = false;
    popup.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
    lockPageScroll("info-popup");
    popup.focus();
  }

  function close() {
    if (popup.hidden) return;
    popup.hidden = true;
    popup.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
    unlockPageScroll("info-popup");
    modalOpeners.get(popup)?.focus?.();
  }

  button.addEventListener("click", () => {
    if (popup.hidden) {
      open();
    } else {
      close();
    }
  });
  closeButton.addEventListener("click", close);
  document.addEventListener("pointerdown", (event) => {
    if (
      !popup.hidden &&
      !popup.contains(event.target) &&
      event.target !== button
    )
      close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  return { open, close };
}

export function setupTabs({ tabs, panels = [], onChange }) {
  const tabList = [...tabs];
  const panelList = [...panels];

  function activate(tab) {
    const targetId = tab.dataset.tabTarget;
    tabList.forEach((button) => {
      const selected = button === tab;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    panelList.forEach((panel) => {
      const selected = panel.id === targetId;
      panel.classList.toggle("active", selected);
      panel.hidden = !selected;
    });
    onChange?.(tab.dataset.mode);
  }

  function handleKeydown(event) {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const currentIndex = tabList.indexOf(event.currentTarget);
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabList.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabList.length) % tabList.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabList.length - 1;
    }
    tabList[nextIndex].focus();
    activate(tabList[nextIndex]);
  }

  tabList.forEach((tab) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", handleKeydown);
  });
}

export function openModal(modal, content) {
  modalOpeners.set(modal, document.activeElement);
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  lockPageScroll(modal.id || "modal");
  content?.focus();
  const handler = (event) => {
    if (event.key !== "Tab") return;
    const focusable = getFocusable(content || modal);
    if (!focusable.length) {
      event.preventDefault();
      content?.focus();
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
  };
  modalKeyHandlers.set(modal, handler);
  modal.addEventListener("keydown", handler);
}

export function closeModal(modal) {
  if (modal.hidden) return;
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  unlockPageScroll(modal.id || "modal");
  const handler = modalKeyHandlers.get(modal);
  if (handler) modal.removeEventListener("keydown", handler);
  modalOpeners.get(modal)?.focus?.();
}
