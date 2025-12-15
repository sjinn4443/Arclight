/**
 * @fileoverview This file contains onboarding related functions and logic, Including name input, professional field selection, and job role/student year details.
 */
import { loadPage } from "./navigation.js";
import { saveProfile } from "./telemetry.js";
import { getCurrentCountryCode, getCurrentArea } from "./location-service.js";

export function initializeOnboarding() {
  const nameInput = document.getElementById("username");
  const nameTip = document.getElementById("usernameTooltip");

  const fieldSelect = document.getElementById("fieldSelect");
  const jobSelect = document.getElementById("jobSelect");
  const studentYearField = document.getElementById("studentYearField");
  const studentYearSelect = document.getElementById("studentYearSelect");

  const continueBtn = document.getElementById("completeOnboardingBtn");

  const infoBtn = document.getElementById("onboardingInfoBtn");
  if (infoBtn) {
    infoBtn.addEventListener("click", () => {
      showPrivacyTermsModal();
    });
  }

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
      const show = jobSelect.querySelector(
        `optgroup[data-field="${selected}"]`,
      );
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
      const isMedStudent = jobSelect.value === "medical_student";
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
  continueBtn?.addEventListener("click", async (e) => {
    if (!checkForm()) {
      e.preventDefault();
      return;
    }
    try {
      await saveProfile({
        name: (nameInput?.value || "").trim(), // Save the trimmed name directly
        aims: null, // you’ll fill aims via the Interests page
        interest: null,
        experience: jobSelect?.value || null, // Save the selected role to experience
        contact: null, // add later if you collect it
        country: getCurrentCountryCode(), // Save the user's country code
        area: getCurrentArea(), // Save the user's area (city/locality)
        language:
          document.documentElement.getAttribute("lang") ||
          localStorage.getItem("prefLang") ||
          "en",
      });
    } catch {}
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

    // Replace #skipBtn (Go Straight to App) with guest CTA pair
    function replaceIntroPrimaryCtaOnce() {
      const trySwap = () => {
        const targetBtn = document.getElementById("skipBtn");
        if (!targetBtn) return false;

        // Create Account button
        const createBtn = document.createElement("button");
        createBtn.id = "createAccountBtn";
        createBtn.className = "onb-cta intro-primary";
        createBtn.textContent = "Create Account";
        createBtn.addEventListener("click", () => {
          localStorage.setItem("cameFromSkipPath", "true");
          loadPage("onboarding");
        });

        // Continue as Guest button
        const guestBtn = document.createElement("button");
        guestBtn.id = "continueAsGuestBtn";

        const skipStyleRef = document.getElementById("skipContinueBtn");
        if (skipStyleRef) {
          guestBtn.className = skipStyleRef.className;
        } else {
          guestBtn.className = "btn-outline intro-outline";
        }

        guestBtn.textContent = "Continue as Guest";
        guestBtn.addEventListener("click", () => {
          localStorage.setItem("guestMode", "true");
          localStorage.setItem("guestClicks", "0");
          localStorage.setItem("guestStartAt", String(Date.now()));
          loadPage("dashboard");
        });

        // Group them
        const btnGroup = document.createElement("div");
        btnGroup.className = "intro-cta-group";
        btnGroup.appendChild(createBtn);
        btnGroup.appendChild(guestBtn);

        // Swap in place of Go Straight to App
        targetBtn.replaceWith(btnGroup);
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

function showPrivacyTermsModal() {
  // Prevent duplicates
  if (document.getElementById("infoModalOverlay")) return;

  const modal = document.createElement("div");
  modal.id = "infoModalOverlay";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  modal.innerHTML = `
    <div class="guest-modal">
      <button class="guest-modal__close" aria-label="Close">&times;</button>
      <h2 class="guest-modal__title">Privacy &amp; Terms</h2>

      <div class="guest-modal__text privacyterms__text">
        <p><strong>Information we collect</strong></p>
        <p>We collect a small amount of personal data:</p>
        <ul>
          <li>name</li>
          <li>email address</li>
          <li>learning goals</li>
          <li>IP address or an approximate location based on it</li>
        </ul>
        <p>Only information needed to run and improve the service is collected.</p>

        <p><strong>How we use it</strong></p>
        <p>
          This data helps to tailor the app to each person’s goals, understand how the app is used and improve features over time.
          It may also be used to get in touch about important changes to the app or an account.<br />
          Personal data is never sold.
        </p>

        <p><strong>Where it is stored</strong></p>
        <p>
          Information is stored on a managed server and database provided by Railway.
          Railway provides the hosting and infrastructure; we control how data is used within the app and keep it only for as long as reasonably needed.
        </p>

        <p><strong>Third-party services</strong></p>
        <p>
          We rely on trusted third-party services, such as hosting providers, to run the app.
          These services only process data as needed to provide the infrastructure and do not have permission to use it for their own purposes.
        </p>

        <p><strong>Seeing or deleting data</strong></p>
        <p>
          Anyone can ask to see, update or delete the information held about them.<br />
          Please email: __
        </p>
        <p>
          Identity may need to be confirmed before a request is completed.
          If any information must be kept for legal or security reasons, this will be explained.
        </p>

        <p><strong>Your account</strong></p>
        <p>
          If you create an account, please keep your login details secure.<br />
          You are responsible for activity on your account unless you let us know about misuse or a security problem.
        </p>

        <p><strong>Education only</strong></p>
        <p>
          This app is an education tool to support learning and revision.
          It is not formal academic, legal or professional advice and cannot guarantee exam passes, grades or any particular outcome.
          Study choices and decisions remain the user’s responsibility.
        </p>

        <p><strong>Responsibility and limits</strong></p>
        <p>
          The aim is to keep the app helpful and reliable, but no service is perfect.
          Continuous availability or complete freedom from errors cannot be promised, and the app may not suit every situation.
        </p>
        <p>
          As far as UK law allows, we are not responsible for losses such as missed marks, lost income or opportunities that arise from using, or being unable to use, the app.
          Nothing here removes any rights provided by UK law.
        </p>

        <p>Using the app means accepting these Privacy &amp; Terms.</p>
      </div>

      <button class="guest-modal__cta" type="button" aria-label="OK">
        <span aria-hidden="true" style="display:inline-flex; align-items:center; gap:8px;">
          OK
        </span>
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => {
    modal.classList.add("fade-out");
    setTimeout(() => modal.remove(), 250);
  };

  modal.querySelector(".guest-modal__close")?.addEventListener("click", close);
  modal.querySelector(".guest-modal__cta")?.addEventListener("click", close);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
}
