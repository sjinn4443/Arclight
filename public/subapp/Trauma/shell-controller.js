"use strict";

(() => {
  const infoIcon = document.getElementById("info-icon");
  const infoModal = document.getElementById("infoModal");
  const closeModal = document.getElementById("closeModal");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  const closeSidebar = document.getElementById("close-sidebar");
  const backdrop = document.getElementById("menu-backdrop");

  function setModalState(open) {
    infoModal.style.display = open ? "block" : "none";
    infoModal.setAttribute("aria-hidden", String(!open));
    infoIcon.setAttribute("aria-expanded", String(open));
    if (open) closeModal.focus();
    else infoIcon.focus();
  }

  function setSidebarState(open) {
    sidebar.classList.toggle("is-open", open);
    sidebar.inert = !open;
    sidebar.setAttribute("aria-hidden", String(!open));
    sidebarToggle.setAttribute("aria-expanded", String(open));
    backdrop.hidden = !open;
    if (open) closeSidebar.focus({ preventScroll: true });
  }

  infoIcon.addEventListener("click", () => {
    setModalState(infoModal.style.display !== "block");
  });

  closeModal.addEventListener("click", () => setModalState(false));
  sidebarToggle.addEventListener("click", () => setSidebarState(true));
  closeSidebar.addEventListener("click", () => {
    setSidebarState(false);
    sidebarToggle.focus();
  });
  backdrop.addEventListener("click", () => {
    setSidebarState(false);
    sidebarToggle.focus({ preventScroll: true });
  });

  window.addEventListener("click", (event) => {
    if (event.target === infoModal) setModalState(false);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (sidebar.classList.contains("is-open")) {
        setSidebarState(false);
        sidebarToggle.focus({ preventScroll: true });
        return;
      }
      if (infoModal.style.display === "block") setModalState(false);
    }
  });

  infoModal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || infoModal.style.display !== "block") return;
    const focusable = Array.from(
      infoModal.querySelectorAll(
        'button, a[href], [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.getClientRects().length > 0);
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
})();
