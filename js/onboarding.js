// js/onboarding.js (ES module)
// Splash, language, and user registration + Professional Interest → Intro
import { showPage } from './navigation.js';

// Public API
export function initializeOnboarding() {
  // Splash → Language & Install (after ~1.8s)
  window.addEventListener('load', () => {
    setTimeout(() => { showPage('languageInstallPage'); }, 1800);
  });

  // Language & Install actions
  const installBtn = document.getElementById('installAppBtn');
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      try {
        if (typeof window.handleInstallPrompt === 'function') {
          await window.handleInstallPrompt();
        }
      } catch (e) {
        console.warn('Install prompt failed or dismissed:', e);
      } finally {
        showPage('onboarding');
      }
    });
  }
  const useOnlineBtn = document.getElementById('useOnlineBtn');
  if (useOnlineBtn) useOnlineBtn.addEventListener('click', () => showPage('onboarding'));

  // Onboarding form actions
  const completeOnboardingBtn = document.getElementById('completeOnboardingBtn');
  if (completeOnboardingBtn) completeOnboardingBtn.addEventListener('click', completeOnboarding);

  const fieldSelect = document.getElementById('fieldSelect');
  if (fieldSelect) fieldSelect.addEventListener('change', handleFieldSelection);

  const jobSelect = document.getElementById('jobSelect');
  if (jobSelect) {
    jobSelect.addEventListener('change', () => {
      const studentYearField = document.getElementById('studentYearField');
      if (!studentYearField) return;
      const isMedStudent = jobSelect.value === 'Medical Student';
      studentYearField.classList.toggle('hidden', !isMedStudent);
      const inner = document.getElementById('studentYearSelect');
      if (inner) inner.classList.remove('hidden');
    });
  }

  // Live name validation
  wireNameValidation();

  // Paint initial select colors and keep them in sync
  ['fieldSelect','jobSelect','studentYearSelect','location'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      paintSelectColor(el);
      el.addEventListener('change', () => paintSelectColor(el));
    }
  });

  // --- Professional Interest page wiring ---

  // 1) Chips toggle selection
  document.querySelectorAll('#proInterestPage .chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('selected'));
  });

  // 2) Join us → Intro (direct binding)
  const interestSubmitBtn = document.getElementById('interestSubmitBtn');
  if (interestSubmitBtn) {
    interestSubmitBtn.addEventListener('click', handleInterestSubmit);
  }

  // 3) Delegated fallback (bulletproof)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#interestSubmitBtn');
    if (btn) handleInterestSubmit(e);
  });
}

/* ------------ helpers (private) ------------ */

function handleInterestSubmit(e) {
  e.preventDefault();
  // collect selected chips (if any)
  const selected = Array.from(document.querySelectorAll('#proInterestPage .chip.selected'))
    .map(chip => chip.textContent.trim());
  if (selected.length) {
    try { localStorage.setItem('professionalInterests', JSON.stringify(selected)); } catch {}
  }
  // Navigate to Intro
  showPage('introPage');
}

function isValidName(value) {
  // Letters (incl accents) + spaces; min length 2
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,}$/.test((value || '').trim());
}
function showNameTooltip(show) {
  const tip = document.getElementById('usernameTooltip');
  if (tip) tip.classList.toggle('hidden', !show);
}
function wireNameValidation() {
  const input = document.getElementById('username');
  const btn   = document.getElementById('completeOnboardingBtn');
  if (!input || !btn) return;

  btn.disabled = true;
  showNameTooltip(false);

  input.addEventListener('input', () => {
    const ok = isValidName(input.value);
    showNameTooltip(input.value.length > 0 && !ok);
    btn.disabled = !ok;
  });

  input.addEventListener('blur', () => {
    const ok = isValidName(input.value);
    showNameTooltip(!ok && input.value.length > 0);
  });
}

function completeOnboarding() {
  const usernameEl = document.getElementById('username');
  const job = document.getElementById('jobSelect')?.value;

  const username = usernameEl?.value.trim() || '';
  const nameOK = isValidName(username);

  if (!nameOK) {
    showNameTooltip(true);
    usernameEl?.focus();
    return;
  }
  if (!job) {
    alert('Please complete all fields.');
    return;
  }

  localStorage.setItem('username', username);
  showPage('proInterestPage');
}

function handleFieldSelection() {
  const fieldSelect = document.getElementById('fieldSelect');
  const jobSelect = document.getElementById('jobSelect');
  const studentYearSelect = document.getElementById('studentYearSelect');
  const selectedField = fieldSelect.value;

  // Hide all optgroups first
  jobSelect.querySelectorAll('optgroup').forEach(optgroup => {
    optgroup.style.display = 'none';
  });

  // Show the relevant optgroup
  const label = selectedField.charAt(0).toUpperCase() + selectedField.slice(1);
  const optgroupToShow = jobSelect.querySelector(`optgroup[label="${label}"]`);
  if (optgroupToShow) optgroupToShow.style.display = 'block';

  jobSelect.value = '';
  jobSelect.classList.remove('hidden');
  studentYearSelect.classList.add('hidden');
}

function paintSelectColor(el) {
  const opt = el.options[el.selectedIndex];
  const isPlaceholder = !opt || opt.disabled;
  el.style.color = isPlaceholder ? '#ccccd1' : '#000000';
}
