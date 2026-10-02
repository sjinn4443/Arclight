(function () {
  const sideMenu = document.getElementById('sideMenu');
  const burgerIcon = document.getElementById('burger-icon');
  const resetButton = document.getElementById('newSessionButton');
  let menuReturnFocus = null;
  let resetTimer = null;

  burgerIcon?.addEventListener(
    'click',
    () => {
      if (sideMenu?.getAttribute('aria-hidden') === 'true')
        menuReturnFocus = document.activeElement;
    },
    true
  );

  if (sideMenu) {
    new MutationObserver(() => {
      const isOpen = sideMenu.getAttribute('aria-hidden') === 'false';
      if (isOpen) {
        requestAnimationFrame(() => sideMenu.querySelector('button:not([disabled])')?.focus());
      } else if (menuReturnFocus?.isConnected) {
        menuReturnFocus.focus();
        menuReturnFocus = null;
      }
    }).observe(sideMenu, { attributes: true, attributeFilter: ['aria-hidden'] });
  }

  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'Tab' || sideMenu?.getAttribute('aria-hidden') !== 'false') return;
      if (document.querySelector('.modal.is-open')) return;
      const focusable = Array.from(
        sideMenu.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!sideMenu.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    true
  );

  resetButton?.addEventListener('click', () => {
    if (resetButton.dataset.confirm !== 'true') {
      resetButton.dataset.confirm = 'true';
      resetButton.textContent = 'Press again to reset';
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        delete resetButton.dataset.confirm;
        resetButton.textContent = 'New training session';
      }, 5000);
      return;
    }
    location.reload();
  });

  if (location.protocol === 'http:' || location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker?.register('./service-worker.js'));
  }
})();
