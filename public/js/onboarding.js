/**
 * @fileoverview This file contains onboarding related functions and logic, Including name input, professional field selection, and job role/student year details.
 */
import { loadPage } from "./navigation.js";

export function initializeOnboarding() {
  const nameInput = document.getElementById("username");
  const nameTip = document.getElementById("usernameTooltip");

  const fieldSelect = document.getElementById("fieldSelect");
  const jobSelect = document.getElementById("jobSelect");
  const studentYearField = document.getElementById("studentYearField");
  const studentYearSelect = document.getElementById("studentYearSelect");

  const continueBtn = document.getElementById("completeOnboardingBtn");

  // --- Name validation UI ---
  if (nameInput && nameTip) {
    const sanitize = (raw) => raw.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");

    const paint = () => {
      let s = sanitize(nameInput.value);

      if (s !== nameInput.value) {
        nameInput.value = s;
      }

      const compact = s.replace(/\s+/g, "");
      const tooShort = compact.length < 2;

      if (s === "") {
        nameTip.classList.add("hidden");
      } else {
        nameTip.classList.toggle("hidden", !tooShort);
      }
    };

    nameInput.addEventListener("input", paint);
    paint();
  }

  // --- Toggle .filled on inputs/selects when they have a non-empty value ---
  [nameInput, fieldSelect, jobSelect, studentYearSelect].forEach((el) => {
    if (!el) return;
    const check = () => {
      if (el.value && el.value.trim() !== "") {
        el.classList.add("filled");
      } else {
        el.classList.remove("filled");
      }
    };
    check();
    el.addEventListener("input", check);
    el.addEventListener("change", check);
  });

  // --- Toggle .has-value on selects  ---
  [fieldSelect, jobSelect, studentYearSelect].forEach((sel) => {
    if (!sel) return;
    const syncHasValue = () => {
      if (sel.value) sel.classList.add("has-value");
      else sel.classList.remove("has-value");
    };
    syncHasValue();
    sel.addEventListener("change", syncHasValue);
  });

  // --- Field → narrow job optgroups ---
  if (fieldSelect && jobSelect) {
    const updateJobsForField = () => {
      const selected = fieldSelect.value;
      jobSelect
        .querySelectorAll("optgroup")
        .forEach((g) => (g.style.display = "none"));
      const label = selected
        ? selected.charAt(0).toUpperCase() + selected.slice(1)
        : "";
      const show = jobSelect.querySelector(`optgroup[label="${label}"]`);
      if (show) show.style.display = "block";
      jobSelect.value = "";
      studentYearField?.classList.add("hidden");
      // Re-sync states
      jobSelect.dispatchEvent(new Event("change"));
    };
    fieldSelect.addEventListener("change", updateJobsForField);
    updateJobsForField();
  }

  // --- Show student year when "Medical Student" ---
  if (jobSelect && studentYearField) {
    jobSelect.addEventListener("change", () => {
      const isMedStudent = jobSelect.value === "Medical Student";
      studentYearField.classList.toggle("hidden", !isMedStudent);
      if (!isMedStudent && studentYearSelect) studentYearSelect.value = "";
      // Re-sync states
      studentYearSelect?.dispatchEvent(new Event("change"));
    });
  }

  // --- Form validation ---
  function isValidName() {
    const s = (nameInput?.value || "").trim();
    if (s === "") return false;
    const tooShort = s.replace(/\s+/g, "").length < 2;
    const hasDigits = /[0-9]/.test(s);
    const hasSpecial = /[^A-Za-zÀ-ÖØ-öø-ÿ\s]/.test(s);
    return !(tooShort || hasDigits || hasSpecial);
  }
  function isValidField() {
    return !!fieldSelect?.value;
  }
  function isValidJob() {
    return !!jobSelect?.value;
  }
  function isValidYears() {
    const needYears = jobSelect?.value === "Medical Student";
    return !needYears || !!studentYearSelect?.value;
  }
  function checkForm() {
    const ok =
      isValidName() && isValidField() && isValidJob() && isValidYears();
    continueBtn?.toggleAttribute("disabled", !ok);
    return ok;
  }
  nameInput?.addEventListener("input", checkForm);
  fieldSelect?.addEventListener("change", checkForm);
  jobSelect?.addEventListener("change", checkForm);
  studentYearSelect?.addEventListener("change", checkForm);
  checkForm();

  // --- Continue ---
  continueBtn?.addEventListener("click", (e) => {
    if (!checkForm()) {
      e.preventDefault();
      return;
    }
    const name = nameInput?.value?.trim();
    if (name) localStorage.setItem("username", name);
    if (fieldSelect?.value)
      localStorage.setItem("userField", fieldSelect.value);
    if (jobSelect?.value) localStorage.setItem("userJob", jobSelect.value);
    if (studentYearSelect && !studentYearField.classList.contains("hidden")) {
      localStorage.setItem("studentYears", studentYearSelect.value || "");
    }
    loadPage("interest");
  });

  // Skip and Continue button logic — onboarding path: custom intro + return tweaks
  const skip = document.getElementById("skipContinueBtn");
  if (skip) {
    let locked = false;

    // Hide #skipBtn on the intro page exactly once after navigation
    function hideIntroSkipButtonOnce() {
      const immediate = document.getElementById("skipBtn");
      if (immediate) {
        immediate.style.display = "none";
        return;
      }
      const obs = new MutationObserver((_, o) => {
        const btn = document.getElementById("skipBtn");
        if (btn) {
          btn.style.display = "none";
          o.disconnect();
        }
      });
      obs.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
      });
      setTimeout(() => obs.disconnect(), 4000);
    }

    // Replace #seeWhatBtn with "Create Account" that routes back to onboarding
    function replaceIntroPrimaryCtaOnce() {
      const trySwap = () => {
        const oldBtn = document.getElementById("seeWhatBtn");
        if (!oldBtn) return false;

        const createBtn = document.createElement("button");
        createBtn.id = "createAccountBtn";
        createBtn.className = oldBtn.className || "onb-cta intro-primary";
        createBtn.textContent = "Create Account";

        // When clicked -> go to onboarding + mark that it came from skip path
        createBtn.addEventListener("click", () => {
          // Remember in localStorage that user came back from skip path
          localStorage.setItem("cameFromSkipPath", "true");
          loadPage("onboarding");
        });

        oldBtn.replaceWith(createBtn);
        return true;
      };

      if (trySwap()) return;
      const obs = new MutationObserver((_, o) => {
        if (trySwap()) o.disconnect();
      });
      obs.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
      });
      setTimeout(() => obs.disconnect(), 4000);
    }

    // Hide #skipContinueBtn on onboarding if came from skip path
    function hideSkipContinueBtnIfReturned() {
      if (localStorage.getItem("cameFromSkipPath") === "true") {
        const btn = document.getElementById("skipContinueBtn");
        if (btn) btn.style.display = "none";
        // Clear the flag so it only hides once
        localStorage.removeItem("cameFromSkipPath");
      }
    }

    // Run this check immediately (handles returning user instantly)
    hideSkipContinueBtnIfReturned();

    skip.addEventListener("click", () => {
      if (locked) return;
      locked = true;

      const splashContainer = document.getElementById("splashScreenContainer");
      const pageContainer = document.getElementById("page-content");

      // If overlay isn't present, just navigate and apply intro tweaks
      if (!splashContainer) {
        loadPage("intro");
        hideIntroSkipButtonOnce();
        replaceIntroPrimaryCtaOnce();
        locked = false;
        return;
      }

      // Clean overlay state
      splashContainer.classList.remove("fade-out");
      splashContainer.innerHTML = "";

      // Load mid-splash and animate
      fetch("html/splashscreen_mid.html")
        .then((r) => r.text())
        .then((html) => {
          splashContainer.innerHTML = html;
          if (pageContainer) pageContainer.style.display = "none";
          splashContainer.classList.add("active");

          const logo =
            splashContainer.querySelector(".logo-one.mid-only") ||
            splashContainer.querySelector(".logo-one");

          const EXPECTED_MS = 4700 + 300;

          const finish = () => {
            splashContainer.classList.add("fade-out");
            setTimeout(() => {
              if (pageContainer) pageContainer.style.display = "";
              splashContainer.classList.remove("active", "fade-out");
              splashContainer.innerHTML = "";

              loadPage("intro");
              hideIntroSkipButtonOnce();
              replaceIntroPrimaryCtaOnce();

              locked = false;
            }, 300);
          };

          const fallback = setTimeout(finish, EXPECTED_MS);

          if (logo) {
            const onAnimationEnd = (e) => {
              if (e.animationName === "midHold") {
                logo.removeEventListener("animationend", onAnimationEnd);
                clearTimeout(fallback);
                finish();
              }
            };
            logo.addEventListener("animationend", onAnimationEnd);
          } else {
            clearTimeout(fallback);
            finish();
          }
        })
        .catch(() => {
          if (pageContainer) pageContainer.style.display = "";
          loadPage("intro");
          hideIntroSkipButtonOnce();
          replaceIntroPrimaryCtaOnce();
          locked = false;
        });
    });
  }
}
