// js/interest.js
import { loadPage } from './navigation.js';

export function initializeInterest() {
  // Toggle chips
  document.querySelectorAll('#proInterestPage .chip').forEach((chip) => {
    chip.addEventListener('click', () => chip.classList.toggle('selected'));
  });

  // "Join us!" -> Intro page
  const submit = document.getElementById('interestSubmitBtn');
  if (submit) {
    submit.addEventListener('click', () => loadPage('intro'));
  }
}
