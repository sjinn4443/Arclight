/**
 * @fileoverview This file contains onboarding related functions and logic,
 * including name input, professional field selection, multi-select job roles,
 * and conditional experience fields.
 */
import { loadPage } from "./navigation.js";
import { saveProfile } from "./telemetry.js";
import { getCurrentCountryCode, getCurrentArea } from "./location-service.js";

export function initializeOnboarding() {
  const nameInput = document.getElementById("username");
  const nameTip = document.getElementById("usernameTooltip");

  const interestSelect = document.getElementById("interestSelect");
  const interestSelectDisplay = document.getElementById(
    "interestSelectDisplay",
  );
  const interestSelectText = document.getElementById("interestSelectText");
  const interestSelectPanel = document.getElementById("interestSelectPanel");
  const interestSelectUi = document.getElementById("interestSelectUi");
  const interestError = document.getElementById("interestError");
  const jobSelect = document.getElementById("jobSelect");
  const jobSelectDisplay = document.getElementById("jobSelectDisplay");
  const jobSelectText = document.getElementById("jobSelectText");
  const jobSelectPanel = document.getElementById("jobSelectPanel");
  const jobSelectUi = document.getElementById("jobSelectUi");

  const studentYearField = document.getElementById("studentYearField");
  const studentYearSelect = document.getElementById("studentYearSelect");

  const practiceLevelField = document.getElementById("practiceLevelField");
  const practiceLevelSelect = document.getElementById("practiceLevelSelect");

  const continueBtn = document.getElementById("completeOnboardingBtn");

  // Info modal
  const infoBtn = document.getElementById("onboardingInfoBtn");
  if (infoBtn) {
    infoBtn.addEventListener("click", () => {
      showPrivacyTermsModal();
    });
  }

  // ---------------------------
  // Helpers
  // ---------------------------
  function getSelectedInterests() {
    if (!interestSelect) return [];
    return Array.from(interestSelect.selectedOptions || [])
      .map((o) => o.value)
      .filter((v) => v && v !== "");
  }

  function rebuildInterestDropdownPanel() {
    if (!interestSelect || !interestSelectPanel) return;

    interestSelectPanel.innerHTML = "";

    Array.from(interestSelect.querySelectorAll("option")).forEach((opt) => {
      const value = opt.value;
      if (!value) return; // placeholder option skip

      const labelText = (opt.textContent || "").trim();

      const row = document.createElement("div");
      row.className = "multi-select__option";
      row.setAttribute("role", "option");

      const tick = document.createElement("span");
      tick.className = "multi-select__tick";
      tick.textContent = "✓";

      const text = document.createElement("span");
      text.className = "multi-select__label";
      text.textContent = labelText;

      row.appendChild(tick);
      row.appendChild(text);

      const paint = () => {
        row.setAttribute("aria-selected", opt.selected ? "true" : "false");
      };

      row.addEventListener("click", () => {
        opt.selected = !opt.selected;
        paint();

        syncInterestDisplayText();
        updateJobsForInterests(); // 아래에서 새로 만들 거예요
        checkForm();

        interestSelect.dispatchEvent(new Event("change"));
      });

      paint();
      interestSelectPanel.appendChild(row);
    });
  }

  function syncInterestDisplayText() {
    if (!interestSelectText || !interestSelect) return;

    const interests = getSelectedInterests();
    if (!interests.length) {
      interestSelectText.textContent = "Select";
      return;
    }

    const labels = interests
      .map((v) =>
        interestSelect
          .querySelector(`option[value="${CSS.escape(v)}"]`)
          ?.textContent?.trim(),
      )
      .filter(Boolean);

    interestSelectText.textContent = labels.join(", ");
  }

  function openInterestPanel() {
    if (!interestSelectPanel || !interestSelectDisplay) return;
    rebuildInterestDropdownPanel();
    syncInterestDisplayText();
    interestSelectPanel.classList.remove("hidden");
    interestSelectDisplay.setAttribute("aria-expanded", "true");
  }

  function closeInterestPanel() {
    if (!interestSelectPanel || !interestSelectDisplay) return;
    interestSelectPanel.classList.add("hidden");
    interestSelectDisplay.setAttribute("aria-expanded", "false");
  }

  interestSelectDisplay?.addEventListener("click", () => {
    const isOpen =
      interestSelectPanel && !interestSelectPanel.classList.contains("hidden");
    if (isOpen) closeInterestPanel();
    else openInterestPanel();
  });

  document.addEventListener("click", (e) => {
    if (!interestSelectUi) return;
    if (interestSelectUi.contains(e.target)) return;
    closeInterestPanel();
  });

  function getSelectedRoles() {
    if (!jobSelect) return [];
    return Array.from(jobSelect.selectedOptions || [])
      .map((o) => o.value)
      .filter((v) => v && v !== "");
  }

  function clearJobSelection() {
    if (!jobSelect) return;
    Array.from(jobSelect.options).forEach((opt) => {
      opt.selected = false;
    });
  }
  function rebuildJobDropdownPanel() {
    if (!jobSelect || !jobSelectPanel || !interestSelect) return;

    jobSelectPanel.innerHTML = "";

    const selectedInterests = getSelectedInterests();

    if (!selectedInterests.length) {
      const empty = document.createElement("div");
      empty.className = "multi-select__group-title";
      empty.textContent = "Select an interest first";
      jobSelectPanel.appendChild(empty);
      return;
    }

    // 선택된 interest들의 optgroup을 순서대로 렌더링 (각 그룹 헤더 포함)
    selectedInterests.forEach((field) => {
      const group = jobSelect.querySelector(`optgroup[data-field="${field}"]`);
      if (!group) return;

      const title = document.createElement("div");
      title.className = "multi-select__group-title";
      title.textContent = group.getAttribute("label") || "Roles";
      jobSelectPanel.appendChild(title);

      Array.from(group.querySelectorAll("option")).forEach((opt) => {
        const labelText = (opt.textContent || "").trim();

        const row = document.createElement("div");
        row.className = "multi-select__option";
        row.setAttribute("role", "option");

        const tick = document.createElement("span");
        tick.className = "multi-select__tick";
        tick.textContent = "✓";

        const text = document.createElement("span");
        text.className = "multi-select__label";
        text.textContent = labelText;

        row.appendChild(tick);
        row.appendChild(text);

        const paint = () => {
          row.setAttribute("aria-selected", opt.selected ? "true" : "false");
        };

        row.addEventListener("click", () => {
          opt.selected = !opt.selected;
          paint();

          syncJobDisplayText();
          updateExperienceFields();
          checkForm();

          jobSelect.dispatchEvent(new Event("change"));
        });

        paint();
        jobSelectPanel.appendChild(row);
      });
    });
  }

  // custom dropdown open/close
  jobSelectDisplay?.addEventListener("click", () => {
    const isOpen =
      jobSelectPanel && !jobSelectPanel.classList.contains("hidden");
    if (isOpen) closeJobPanel();
    else openJobPanel();
  });

  document.addEventListener("click", (e) => {
    if (!jobSelectUi) return;
    if (jobSelectUi.contains(e.target)) return;
    closeJobPanel();
  });

  function syncJobDisplayText() {
    if (!jobSelectText) return;
    const roles = getSelectedRoles();
    if (!roles.length) {
      jobSelectText.textContent = "Select";
      return;
    }

    const labels = roles
      .map((v) =>
        jobSelect
          ?.querySelector(`option[value="${CSS.escape(v)}"]`)
          ?.textContent?.trim(),
      )
      .filter(Boolean);

    jobSelectText.textContent = labels.join(", ");
  }

  function openJobPanel() {
    if (!jobSelectPanel || !jobSelectDisplay) return;

    rebuildJobDropdownPanel();
    syncJobDisplayText();

    jobSelectPanel.classList.remove("hidden");
    jobSelectDisplay.setAttribute("aria-expanded", "true");
  }

  function closeJobPanel() {
    if (!jobSelectPanel || !jobSelectDisplay) return;
    jobSelectPanel.classList.add("hidden");
    jobSelectDisplay.setAttribute("aria-expanded", "false");
  }

  function updateExperienceFields() {
    const roles = getSelectedRoles();

    const hasMedicalStudent = roles.includes("medical_student");
    const hasNonStudentRole = roles.some((r) => r && r !== "medical_student");

    // Medical student → show studentYearField
    if (studentYearField) {
      studentYearField.classList.toggle("hidden", !hasMedicalStudent);
      if (!hasMedicalStudent && studentYearSelect) studentYearSelect.value = "";
      studentYearSelect?.dispatchEvent(new Event("change"));
    }

    // Any other role → show practiceLevelField
    if (practiceLevelField) {
      practiceLevelField.classList.toggle("hidden", !hasNonStudentRole);
      if (!hasNonStudentRole && practiceLevelSelect)
        practiceLevelSelect.value = "";
      practiceLevelSelect?.dispatchEvent(new Event("change"));
    }
  }

  // ---------------------------
  // Name validation UI
  // ---------------------------
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

  // ---------------------------
  // Toggle .filled / .has-value on inputs/selects
  // (원본 txt 패턴을 유지하되, fieldSelect → interestSelectDisplay로 교체)
  // ---------------------------

  // name + experience selects (일반 input/select)
  [nameInput, interestSelect, studentYearSelect, practiceLevelSelect].forEach(
    (el) => {
      if (!el) return;
      const check = () => {
        if (el.value && el.value.trim() !== "") el.classList.add("filled");
        else el.classList.remove("filled");
      };
      check();
      el.addEventListener("input", check);
      el.addEventListener("change", check);
    },
  );

  // interestSelect(multiple) 전용: 선택 개수로 filled/has-value 처리 (jobSelect와 동일한 방식)
  if (interestSelect) {
    const syncInterestClasses = () => {
      const interests = getSelectedInterests();
      if (interestSelectDisplay) {
        interestSelectDisplay.classList.toggle("filled", interests.length > 0);
        interestSelectDisplay.classList.toggle(
          "has-value",
          interests.length > 0,
        );
      }
    };
    syncInterestClasses();
    interestSelect.addEventListener("change", syncInterestClasses);
  }

  // jobSelect(multiple) 전용: 선택 개수로 filled/has-value 처리 (원래 있던 그대로 유지)
  if (jobSelect) {
    const syncJobClasses = () => {
      const roles = getSelectedRoles();
      if (jobSelectDisplay) {
        jobSelectDisplay.classList.toggle("filled", roles.length > 0);
        jobSelectDisplay.classList.toggle("has-value", roles.length > 0);
      }
    };
    syncJobClasses();
    jobSelect.addEventListener("change", syncJobClasses);
  }

  // experience selects의 has-value (원본 txt 유지하되 fieldSelect 제거)
  [studentYearSelect, practiceLevelSelect].forEach((sel) => {
    if (!sel) return;
    const syncHasValue = () => {
      if (sel.value) sel.classList.add("has-value");
      else sel.classList.remove("has-value");
    };
    syncHasValue();
    sel.addEventListener("change", syncHasValue);
  });

  // ---------------------------
  // Interest(s) (multi) → narrow job optgroups (union)
  // ---------------------------
  function getSelectedInterests() {
    if (!interestSelect) return [];
    return Array.from(interestSelect.selectedOptions || [])
      .map((o) => o.value)
      .filter((v) => v && v !== "");
  }

  function updateJobsForInterests() {
    if (!interestSelect || !jobSelect) return;

    const selected = getSelectedInterests(); // ["eyes","ears",...]
    const hasAny = selected.length > 0;

    // 1) 일단 전부 숨김
    jobSelect.querySelectorAll("optgroup").forEach((g) => {
      g.style.display = "none";
    });

    // 2) 선택된 interest들에 해당하는 optgroup은 모두 표시
    selected.forEach((field) => {
      const group = jobSelect.querySelector(`optgroup[data-field="${field}"]`);
      if (group) group.style.display = "block";
    });

    // 3) interest가 하나도 없으면 roles/experience 전부 초기화
    if (!hasAny) {
      clearJobSelection();

      if (studentYearSelect) studentYearSelect.value = "";
      if (practiceLevelSelect) practiceLevelSelect.value = "";
      studentYearField?.classList.add("hidden");
      practiceLevelField?.classList.add("hidden");

      jobSelect.dispatchEvent(new Event("change"));
      rebuildJobDropdownPanel();
      syncJobDisplayText();
      checkForm();
      return;
    }

    // 4) 선택된 interest 밖(optgroup 밖)의 role만 해제 (전체 리셋보다 UX 좋음)
    const allowedGroups = new Set(selected);
    Array.from(jobSelect.querySelectorAll("option")).forEach((opt) => {
      const og = opt.closest("optgroup");
      const ogField = og?.getAttribute("data-field");
      if (!ogField) return;
      if (!allowedGroups.has(ogField)) opt.selected = false;
    });

    // 5) 리빌드 + 검증
    jobSelect.dispatchEvent(new Event("change"));
    rebuildJobDropdownPanel();
    syncJobDisplayText();
    checkForm();
  }

  // 기존 fieldSelect.addEventListener(...) 대신 이걸로
  if (interestSelect && jobSelect) {
    interestSelect.addEventListener("change", updateJobsForInterests);
    updateJobsForInterests(); // initial
  }

  // jobSelect change → experience fields + validation
  jobSelect?.addEventListener("change", () => {
    updateExperienceFields();
    checkForm();
  });

  // ---------------------------
  // Form validation
  // ---------------------------
  function isValidName() {
    const s = (nameInput?.value || "").trim();
    if (s === "") return false;
    const tooShort = s.replace(/\s+/g, "").length < 2;
    const hasDigits = /[0-9]/.test(s);
    const hasSpecial = /[^A-Za-zÀ-ÖØ-öø-ÿ\s]/.test(s);
    return !(tooShort || hasDigits || hasSpecial);
  }

  function isValidField() {
    return getSelectedInterests().length > 0;
  }

  function isValidJob() {
    const roles = getSelectedRoles();
    return roles.length > 0;
  }

  function isValidExperience() {
    const roles = getSelectedRoles();
    const hasMedicalStudent = roles.includes("medical_student");
    const hasNonStudentRole = roles.some((r) => r && r !== "medical_student");

    if (hasMedicalStudent && !studentYearSelect?.value) return false;
    if (hasNonStudentRole && !practiceLevelSelect?.value) return false;

    return true;
  }

  function checkForm() {
    const ok =
      isValidName() && isValidField() && isValidJob() && isValidExperience();

    if (continueBtn) {
      continueBtn.disabled = !ok; // ✅ 처음엔 disabled, 조건 충족 시 활성화
    }

    return ok;
  }

  nameInput?.addEventListener("input", checkForm);
  interestSelect?.addEventListener("change", checkForm);

  jobSelect?.addEventListener("change", checkForm);
  studentYearSelect?.addEventListener("change", checkForm);
  practiceLevelSelect?.addEventListener("change", checkForm);

  // initial
  updateExperienceFields();
  checkForm();

  continueBtn?.addEventListener("click", async (e) => {
    if (!checkForm()) {
      e.preventDefault();
      return;
    }

    // ✅ 먼저 문자열들을 만들어 둔다 (순서 중요)
    const roles = getSelectedRoles();
    const rolesString = roles.join("|"); // multi-role 저장

    const interests = getSelectedInterests();
    const interestsString = interests.join("|"); // multi-interest 저장

    // ✅ 서버/텔레메트리 저장
    try {
      await saveProfile({
        name: (nameInput?.value || "").trim(),
        aims: null,
        interest: interestsString || null,
        experience: rolesString || null,
        contact: null,
        country: getCurrentCountryCode(),
        area: getCurrentArea(),
        language:
          document.documentElement.getAttribute("lang") ||
          localStorage.getItem("prefLang") ||
          "en",
      });
    } catch {}

    // ✅ localStorage 저장 (기존 로직 유지, 다만 interestsString은 이미 위에서 준비됨)
    const name = nameInput?.value?.trim();
    if (name) localStorage.setItem("username", name);

    if (interestsString) localStorage.setItem("userField", interestsString);
    else localStorage.removeItem("userField");

    // roles 저장
    localStorage.setItem("userJob", rolesString);

    // years 저장(보일 때만)
    if (studentYearField && !studentYearField.classList.contains("hidden")) {
      localStorage.setItem("studentYears", studentYearSelect?.value || "");
    } else {
      localStorage.removeItem("studentYears");
    }

    if (
      practiceLevelField &&
      !practiceLevelField.classList.contains("hidden")
    ) {
      localStorage.setItem("practiceYears", practiceLevelSelect?.value || "");
    } else {
      localStorage.removeItem("practiceYears");
    }

    loadPage("interest");
  });

  // ---------------------------
  // Skip and Continue button logic — onboarding path: custom intro + return tweaks
  // (원본 로직 그대로 유지)
  // ---------------------------
  const skip = document.getElementById("skipContinueBtn");
  if (skip) {
    let locked = false;

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

    function replaceIntroPrimaryCtaOnce() {
      const trySwap = () => {
        const targetBtn = document.getElementById("skipBtn");
        if (!targetBtn) return false;

        const createBtn = document.createElement("button");
        createBtn.id = "createAccountBtn";
        createBtn.className = "onb-cta intro-primary";
        createBtn.textContent = "Create Account";
        createBtn.addEventListener("click", () => {
          localStorage.setItem("cameFromSkipPath", "true");
          loadPage("onboarding");
        });

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

        const btnGroup = document.createElement("div");
        btnGroup.className = "intro-cta-group";
        btnGroup.appendChild(createBtn);
        btnGroup.appendChild(guestBtn);

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

    function hideSkipContinueBtnIfReturned() {
      if (localStorage.getItem("cameFromSkipPath") === "true") {
        const btn = document.getElementById("skipContinueBtn");
        if (btn) btn.style.display = "none";
        localStorage.removeItem("cameFromSkipPath");
      }
    }

    hideSkipContinueBtnIfReturned();

    skip.addEventListener("click", () => {
      if (locked) return;
      locked = true;

      const splashContainer = document.getElementById("splashScreenContainer");
      const pageContainer = document.getElementById("page-content");

      if (!splashContainer) {
        loadPage("intro");
        hideIntroSkipButtonOnce();
        replaceIntroPrimaryCtaOnce();
        locked = false;
        return;
      }

      splashContainer.classList.remove("fade-out");
      splashContainer.innerHTML = "";

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
