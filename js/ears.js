// Ears page handles multiple sub-pages within the same HTML fragment.
// Uses [data-page] attributes to toggle sections.

function show(sectionId) {
  document.querySelectorAll('#page-content .page').forEach(p => p.style.display = 'none');
  const target = document.getElementById(sectionId);
  if (target) target.style.display = 'block';
}

export function initializeEars() {
  // default show root of ears
  if (document.getElementById('earsLearningModules')) {
    // If first load, ensure only root is visible
    show('earsLearningModules');
  }

  // delegate clicks
  document.getElementById('page-content').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-page]');
    if (!btn) return;
    const targetId = btn.getAttribute('data-page');
    if (document.getElementById(targetId)) {
      show(targetId);
    }
  });
}


// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: goToEarsDashboard

function goToEarsDashboard() {
  showPage('earsDashboard');
}