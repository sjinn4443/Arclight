export function initializeInterest() {}


// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: initializeProfessionalInterest

function initializeProfessionalInterest() {
  // Let user toggle chips on/off
  document.querySelectorAll('#proInterestPage .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });

  // When they click "Join us!", go to intro page
  const submit = document.getElementById('interestSubmitBtn');
  if (submit) {
    submit.addEventListener('click', () => {
      showPage('introPage');
    });
  }
}