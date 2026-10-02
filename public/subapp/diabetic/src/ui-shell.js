export function setupDrawer({ menuButton, closeButton, drawer, overlay }) {
  let returnFocus = null;

  function getFocusable() {
    return [
      ...drawer.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ];
  }

  function open() {
    returnFocus = document.activeElement;
    overlay.hidden = false;
    drawer.classList.add("is-open");
    overlay.classList.add("is-visible");
    drawer.inert = false;
    drawer.removeAttribute("inert");
    drawer.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");
    closeButton.focus();
  }

  function close() {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    overlay.hidden = true;
    drawer.inert = true;
    drawer.setAttribute("inert", "");
    drawer.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
    if (returnFocus instanceof HTMLElement) returnFocus.focus();
    returnFocus = null;
  }

  menuButton.addEventListener("click", open);
  closeButton.addEventListener("click", close);
  overlay.addEventListener("click", close);
  document.addEventListener("keydown", (event) => {
    if (!drawer.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = getFocusable();
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  return { open, close };
}

export function setupInfoPopup({ button, popup, closeButton }) {
  function open() {
    popup.hidden = false;
    popup.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
    popup.focus();
  }

  function close() {
    if (popup.hidden) return;
    popup.hidden = true;
    popup.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
    button.focus();
  }

  button.addEventListener("click", () => {
    if (popup.hidden) {
      open();
    } else {
      close();
    }
  });
  closeButton.addEventListener("click", close);
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
      if (button.getAttribute("role") === "radio") {
        button.setAttribute("aria-checked", String(selected));
      } else {
        button.setAttribute("aria-selected", String(selected));
      }
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

const modalState = new WeakMap();

function getModalFocusable(modal) {
  return [
    ...modal.querySelectorAll(
      'button:not([disabled]):not([hidden]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ].filter((element) => !element.closest("[hidden]"));
}

export function openModal(
  modal,
  content,
  returnFocus = document.activeElement,
) {
  const opener = returnFocus;
  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal(modal);
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = getModalFocusable(modal);
    if (focusable.length === 0) {
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
  modalState.set(modal, { opener, handleKeydown });
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  document.addEventListener("keydown", handleKeydown);
  content?.focus();
}

export function closeModal(modal) {
  if (modal.hidden) return;
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  const state = modalState.get(modal);
  if (state) {
    document.removeEventListener("keydown", state.handleKeydown);
    if (state.opener instanceof HTMLElement) state.opener.focus();
    modalState.delete(modal);
  }
}
