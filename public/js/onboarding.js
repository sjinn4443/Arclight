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
}
