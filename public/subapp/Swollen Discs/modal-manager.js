const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

export function createModalManager({
  state,
  stateMachine,
  sideMenu,
  sideMenuButtons,
  burgerIcon,
  infoIcon,
  infoModal,
  testModal
}) {
  function setSideMenuOpen(isOpen) {
    stateMachine.setSideMenuOpen(isOpen);
    sideMenu.classList.toggle('open', isOpen);
    sideMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    burgerIcon.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    sideMenu.inert = !isOpen;

    sideMenuButtons.forEach((button) => {
      const isLocked = button.dataset?.locked === 'true';
      button.disabled = !isOpen || isLocked;
      button.tabIndex = isOpen && !isLocked ? 0 : -1;
    });
  }

  function toggleSideMenu() {
    setSideMenuOpen(!state.ui.sideMenuOpen);
  }

  function isModalOpen(modal) {
    return modal.classList.contains('is-open');
  }

  function setModalState(modal, isOpen, triggerButton) {
    if (isOpen) {
      const returnFocusEl =
        triggerButton ||
        (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      modal.returnFocusEl = returnFocusEl;
    }

    modal.classList.toggle('is-open', isOpen);
    modal.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    stateMachine.setActiveModal(isOpen ? modal.id : null);

    if (triggerButton) {
      triggerButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    const hasOpenModal = isModalOpen(infoModal) || isModalOpen(testModal);
    document.body.classList.toggle('modal-open', hasOpenModal);

    if (isOpen) {
      queueMicrotask(() => {
        focusFirstElement(modal);
      });
      return;
    }

    const returnFocusEl = modal.returnFocusEl;
    modal.returnFocusEl = null;

    if (returnFocusEl && typeof returnFocusEl.focus === 'function' && returnFocusEl.isConnected) {
      returnFocusEl.focus();
    }
  }

  function getTopOpenModal() {
    if (isModalOpen(testModal)) {
      return testModal;
    }

    if (isModalOpen(infoModal)) {
      return infoModal;
    }

    return null;
  }

  function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((element) => {
      return element.getClientRects().length > 0;
    });
  }

  function focusFirstElement(modal) {
    const focusableElements = getFocusableElements(modal);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
      return;
    }

    modal.setAttribute('tabindex', '-1');
    modal.focus();
  }

  function trapFocusInModal(event, modal) {
    const focusableElements = getFocusableElements(modal);
    if (focusableElements.length === 0) {
      event.preventDefault();
      modal.focus();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (!modal.contains(activeElement)) {
      event.preventDefault();
      if (event.shiftKey) {
        last.focus();
      } else {
        first.focus();
      }
      return;
    }

    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleDocumentClick(event, { closeTestModal }) {
    const target = event.target;

    if (target === infoModal) {
      setModalState(infoModal, false, infoIcon);
    }

    if (target === testModal) {
      closeTestModal();
    }

    if (state.ui.sideMenuOpen && !sideMenu.contains(target) && !burgerIcon.contains(target)) {
      setSideMenuOpen(false);
    }
  }

  function handleDocumentKeyDown(event, { closeTestModal }) {
    if (event.key === 'Tab') {
      const openModal = getTopOpenModal();
      if (openModal) {
        trapFocusInModal(event, openModal);
      }
    }

    if (event.key !== 'Escape') {
      return;
    }

    if (isModalOpen(infoModal)) {
      setModalState(infoModal, false, infoIcon);
    }

    if (isModalOpen(testModal)) {
      closeTestModal();
    }

    if (state.ui.sideMenuOpen) {
      setSideMenuOpen(false);
    }
  }

  return {
    setSideMenuOpen,
    toggleSideMenu,
    isModalOpen,
    setModalState,
    handleDocumentClick,
    handleDocumentKeyDown,
    destroy: () => {}
  };
}
