// js/onboarding.js
import { loadPage } from './navigation.js';

export function initializeOnboarding() {
  const nameInput        = document.getElementById('username');
  const nameTip          = document.getElementById('usernameTooltip');

  const fieldSelect      = document.getElementById('fieldSelect');
  const jobSelect        = document.getElementById('jobSelect');
  const studentYearField = document.getElementById('studentYearField');
  const studentYearSelect= document.getElementById('studentYearSelect');

  const continueBtn      = document.getElementById('completeOnboardingBtn');

  // --- Name validation UI (same behavior as before) ---
  if (nameInput && nameTip) {
    const isValidName = (v) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,}$/.test((v || '').trim());
    const paint = () => {
      const ok = isValidName(nameInput.value);
      nameTip.classList.toggle('hidden', ok);
    };
    nameInput.addEventListener('input', paint);
    paint();
  }

  // --- Field → narrow job optgroups (Eyes | Ears | Skin) ---
  if (fieldSelect && jobSelect) {
    const updateJobsForField = () => {
      const selected = fieldSelect.value; // 'eyes' | 'ears' | 'skin'
      // Hide all optgroups
      jobSelect.querySelectorAll('optgroup').forEach(g => (g.style.display = 'none'));
      // Show the matching optgroup by label (capitalized)
      const label = selected ? (selected.charAt(0).toUpperCase() + selected.slice(1)) : '';
      const show = jobSelect.querySelector(`optgroup[label="${label}"]`);
      if (show) show.style.display = 'block';
      // Reset job & student year on field change
      jobSelect.value = '';
      studentYearField?.classList.add('hidden');
    };
    fieldSelect.addEventListener('change', updateJobsForField);
    updateJobsForField(); // run once on load
  }

  // --- If Medical Student → show “How many years have you studied?” ---
  if (jobSelect && studentYearField) {
    jobSelect.addEventListener('change', () => {
      const isMedStudent = jobSelect.value === 'Medical Student';
      studentYearField.classList.toggle('hidden', !isMedStudent);
      // optional: reset year if not student
      if (!isMedStudent && studentYearSelect) studentYearSelect.value = '';
    });
  }

  // --- Continue → go to Interest page (store a couple of bits for later if needed) ---
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      const name = nameInput?.value?.trim();
      // (soft) validation like before
      if (name) localStorage.setItem('username', name);
      if (fieldSelect?.value) localStorage.setItem('userField', fieldSelect.value);
      if (jobSelect?.value)   localStorage.setItem('userJob', jobSelect.value);
      if (studentYearSelect && !studentYearField.classList.contains('hidden')) {
        localStorage.setItem('studentYears', studentYearSelect.value || '');
      }
      // proceed
      loadPage('interest');
    });
  }
}
