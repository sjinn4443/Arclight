export function setupDrawer({ menuButton, closeButton, drawer, overlay }) {
  function open() {
    overlay.hidden = false;
    drawer.classList.add("is-open");
    overlay.classList.add("is-visible");
    drawer.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");
  }

  function close() {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    overlay.hidden = true;
    drawer.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
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
    popup.hidden = false;
    popup.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
    popup.focus();
  }

  function close() {
    popup.hidden = true;
    popup.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
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

export function setupTabs({ tabs, panels, onChange }) {
  const tabList = [...tabs];

  function activate(tab) {
    const targetId = tab.dataset.tabTarget;
    tabList.forEach((button) => {
      const selected = button === tab;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
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
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  content?.focus();
}

export function closeModal(modal) {
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
}
