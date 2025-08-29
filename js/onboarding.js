import { loadPage } from './navigation.js';

export function initializeOnboarding() {
  const btn = document.getElementById('startOnboarding');
  const next = document.getElementById('continueFromLanguage');
  const interestNext = document.getElementById('interestNext');
  const introProceed = document.getElementById('introProceed');

  if (btn) btn.addEventListener('click', () => loadPage('languageinstall'));
  if (next) next.addEventListener('click', () => loadPage('interest'));
  if (interestNext) interestNext.addEventListener('click', () => loadPage('intro'));
  if (introProceed) introProceed.addEventListener('click', () => loadPage('dashboard'));
}


// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: initializeOnboarding, isValidName, showNameTooltip, wireNameValidation, completeOnboarding, handleFieldSelection, paintSelectColor

function initializeOnboardingImpl() {
  // Splash: logo-only, then go to Language & Install page
  window.addEventListener('load', () => {
    setTimeout(() => {
      showPage('languageInstallPage');
    }, 1800); // ~1.8s splash
  });

  // Onboarding form logic
  const completeOnboardingBtn = document.getElementById('completeOnboardingBtn');
  if (completeOnboardingBtn) {
    completeOnboardingBtn.addEventListener('click', completeOnboarding);
  }

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

    // Name input validation UI
  wireNameValidation();
}

function isValidName(value) {
  // Letters incl. accents + spaces; min length 2
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,}$/.test((value || "").trim());
}

function showNameTooltip(show) {
  const tip = document.getElementById('usernameTooltip');
  if (tip) tip.classList.toggle('hidden', !show);
}

function wireNameValidation() {
  const input = document.getElementById('username');
  const btn   = document.getElementById('completeOnboardingBtn');
  if (!input || !btn) return;

  // initial state
  btn.disabled = true;
  showNameTooltip(false);

  input.addEventListener('input', () => {
    const ok = isValidName(input.value);
    // show bubble only when something is typed but still invalid
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

  const username = usernameEl?.value.trim() || "";
  const nameOK = isValidName(username);

  if (!nameOK) {
    showNameTooltip(true);          // show speech bubble
    usernameEl?.focus();
    return;                         // 1) block going to next page
  }

  if (!job) {
    alert("Please complete all fields.");
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
  const optgroupToShow = jobSelect.querySelector(`optgroup[label="${selectedField.charAt(0).toUpperCase() + selectedField.slice(1)}"]`);
  if (optgroupToShow) {
    optgroupToShow.style.display = 'block';
  }

  jobSelect.value = ""; // Reset selection
  jobSelect.classList.remove('hidden');
  studentYearSelect.classList.add('hidden');
}

function paintSelectColor(el) {
  const opt = el.options[el.selectedIndex];
  const isPlaceholder = !opt || opt.disabled;
  el.style.color = isPlaceholder ? '#ccccd1' : '#000000';
}