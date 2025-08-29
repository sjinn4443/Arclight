export function initializeMenu() {}


// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: setActiveTab

function setActiveTab(type) {
  const eyesBtn = document.getElementById('eyesTab');
  const earsBtn = document.getElementById('earsTab');
  if (eyesBtn && earsBtn) {
    eyesBtn.classList.toggle('active', type === 'eyes');
    earsBtn.classList.toggle('active', type === 'ears');
  }
}