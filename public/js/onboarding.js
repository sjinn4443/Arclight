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
  let jobAutoCloseTimer = null;
  const practiceYearsSelect = document.getElementById("practiceYearsSelect");
  const practiceMonthsSelect = document.getElementById("practiceMonthsSelect");
  const practiceRangeHint = document.getElementById("practiceRangeHint");
  const practiceLevelRange = document.getElementById("practiceLevelRange");
  const experienceByRole = document.getElementById("experienceByRole");
  const practiceLevelTemplate = document.getElementById(
    "practiceLevelTemplate",
  );

  const studentYearField = document.getElementById("studentYearField");
  const studentYearSelect = document.getElementById("studentYearSelect");

  const practiceLevelField = document.getElementById("practiceLevelField");

  const continueBtn = document.getElementById("completeOnboardingBtn");

  let interestAutoCloseTimer = null;

  function mapPracticeMonthsToRange(totalMonths) {
    // 규칙: 2.5년(30개월) => 3–5년으로 가야 하므로
    //      1–2년은 <=24개월, 그 초과는 다음 구간으로 올림.
    if (totalMonths <= 24) return "0-2";
    if (totalMonths <= 60) return "2-5";
    if (totalMonths <= 120) return "5-10";
    return "10+";
  }

  function formatPracticeHint(range) {
    // 화면에 예쁘게 보여주기용
    if (range === "10+") return "Selected band: 10+ years";
    const [a, b] = range.split("-");
    return `Selected band: ${a}–${b} years`;
  }

  function updatePracticeRangeUI() {
    if (!practiceYearsSelect || !practiceMonthsSelect) return;

    const yRaw = practiceYearsSelect.value;
    const mRaw = practiceMonthsSelect.value;

    // 둘 다 선택되기 전에는 range 계산 안 함
    if (yRaw === "" || mRaw === "") {
      if (practiceRangeHint) practiceRangeHint.style.display = "none";
      if (practiceLevelRange) practiceLevelRange.value = "";
      return;
    }

    const years = parseInt(yRaw, 10);
    const months = parseInt(mRaw, 10);
    const totalMonths = years * 12 + months;

    const range = mapPracticeMonthsToRange(totalMonths);

    if (practiceLevelRange) practiceLevelRange.value = range;

    if (practiceRangeHint) {
      practiceRangeHint.textContent = formatPracticeHint(range);
      practiceRangeHint.style.display = "block";
    }
  }

  const onPracticeInput = () => {
    normalisePracticeInputs(); // 아래에서 추가할 함수
    updatePracticeRangeUI();
    checkForm();
  };

  function normalisePracticeInputs() {
    if (!practiceYearsSelect || !practiceMonthsSelect) return;

    const years = parseInt(practiceYearsSelect.value || "0", 10);
    const months = parseInt(practiceMonthsSelect.value || "0", 10);

    const safeYears = Number.isFinite(years) && years >= 0 ? years : 0;

    let safeMonths = Number.isFinite(months) && months >= 0 ? months : 0;
    if (safeMonths > 11) safeMonths = 11;

    // 입력 중엔 사용자가 지우기도 하니까, 강제로 덮어쓰는 건 "유효 숫자일 때만" 하자
    if (
      practiceYearsSelect.value !== "" &&
      String(safeYears) !== practiceYearsSelect.value
    ) {
      practiceYearsSelect.value = String(safeYears);
    }
    if (
      practiceMonthsSelect.value !== "" &&
      String(safeMonths) !== practiceMonthsSelect.value
    ) {
      practiceMonthsSelect.value = String(safeMonths);
    }
  }

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
        updateJobsForInterests();
        checkForm();

        interestSelect.dispatchEvent(new Event("change"));

        if (interestAutoCloseTimer) clearTimeout(interestAutoCloseTimer);
        interestAutoCloseTimer = setTimeout(() => {
          closeInterestPanel();
        }, 600);
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

          if (jobAutoCloseTimer) clearTimeout(jobAutoCloseTimer);
          jobAutoCloseTimer = setTimeout(() => {
            closeJobPanel();
          }, 600);
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
    const nonStudentRoles = roles.filter((r) => r && r !== "medical_student");

    // Medical student → show studentYearField
    if (studentYearField) {
      studentYearField.classList.toggle("hidden", !hasMedicalStudent);
      if (!hasMedicalStudent && studentYearSelect) studentYearSelect.value = "";
      studentYearSelect?.dispatchEvent(new Event("change"));
    }

    // Any other role → show practiceLevelField
    if (practiceLevelField) {
      const show = nonStudentRoles.length > 0;
      practiceLevelField.classList.toggle("hidden", !show);

      // 보일 때: role별 입력 렌더
      if (show) {
        renderExperienceByRole(nonStudentRoles); // ✅ role별 experience select 렌더
      } else {
        if (experienceByRole) {
          experienceByRole.querySelectorAll(".role-exp-block").forEach((el) => {
            el.remove();
          });
        }
      }
    }
  }

  function getRoleLabel(roleValue) {
    const opt = jobSelect?.querySelector(
      `option[value="${CSS.escape(roleValue)}"]`,
    );
    return (opt?.textContent || roleValue).trim();
  }

  function clampInt(value, min, max) {
    const n = parseInt(value, 10);
    if (!Number.isFinite(n)) return "";
    return String(Math.min(max, Math.max(min, n)));
  }

  function toggleFilled(el) {
    if (!el) return;
    if (el.value && String(el.value).trim() !== "") el.classList.add("filled");
    else el.classList.remove("filled");
  }
  function renderExperienceByRole(roleValues) {
    if (!experienceByRole) return;

    // 기존 입력값 보존(렌더링 refresh 시)
    const previous = {};
    experienceByRole.querySelectorAll("[data-role]").forEach((block) => {
      const role = block.getAttribute("data-role");
      const range =
        block.querySelector('select[data-kind="practiceLevel"]')?.value || "";
      if (role) previous[role] = { range };
    });

    experienceByRole.innerHTML = "";

    roleValues.forEach((role) => {
      const label = getRoleLabel(role);

      if (!practiceLevelTemplate) return;

      const block =
        practiceLevelTemplate.content.firstElementChild?.cloneNode(true);
      if (!block) return;
      block.setAttribute("data-role", role);

      const title = block.querySelector(".role-exp-label");
      if (title) title.textContent = label;

      const select = block.querySelector('select[data-kind="practiceLevel"]');

      // 값 복원
      if (select) select.value = previous[role]?.range || "";

      // 선택 시 has-value/filled 갱신 + validation
      const paint = () => {
        if (!select) return;
        select.classList.toggle("has-value", !!select.value);
        select.classList.toggle("filled", !!select.value);
        checkForm();
      };
      select?.addEventListener("change", paint);
      paint();

      experienceByRole.appendChild(block);
    });
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
  [nameInput, interestSelect, studentYearSelect].forEach((el) => {
    if (!el) return;
    const check = () => {
      if (el.value && el.value.trim() !== "") el.classList.add("filled");
      else el.classList.remove("filled");
    };
    check();
    el.addEventListener("input", check);
    el.addEventListener("change", check);
  });

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
  [studentYearSelect].forEach((sel) => {
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
    const nonStudentRoles = roles.filter((r) => r && r !== "medical_student");

    if (hasMedicalStudent && !studentYearSelect?.value) return false;

    if (nonStudentRoles.length > 0) {
      if (!experienceByRole) return false;

      for (const role of nonStudentRoles) {
        const block = experienceByRole.querySelector(
          `[data-role="${CSS.escape(role)}"]`,
        );
        const v =
          block?.querySelector('select[data-kind="practiceLevel"]')?.value ||
          "";
        if (String(v).trim() === "") return false;
      }
    }

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

  // initial
  updateExperienceFields();
  checkForm();

  continueBtn?.addEventListener("click", async (e) => {
    if (!checkForm()) {
      e.preventDefault();
      return;
    }

    const roles = getSelectedRoles();
    const rolesString = roles.join("|");

    const interests = getSelectedInterests();
    const interestsString = interests.join("|");

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

    const name = nameInput?.value?.trim();
    if (name) localStorage.setItem("username", name);

    if (interestsString) localStorage.setItem("userField", interestsString);
    else localStorage.removeItem("userField");

    localStorage.setItem("userJob", rolesString);

    if (studentYearField && !studentYearField.classList.contains("hidden")) {
      localStorage.setItem("studentYears", studentYearSelect?.value || "");
    } else {
      localStorage.removeItem("studentYears");
    }

    if (
      practiceLevelField &&
      !practiceLevelField.classList.contains("hidden")
    ) {
      const nonStudentRoles = getSelectedRoles().filter(
        (r) => r && r !== "medical_student",
      );
      const byRole = {};

      nonStudentRoles.forEach((role) => {
        const block = experienceByRole?.querySelector(
          `[data-role="${CSS.escape(role)}"]`,
        );
        const range =
          block?.querySelector('select[data-kind="practiceLevel"]')?.value ||
          "";
        byRole[role] = { range };
      });

      localStorage.setItem("practiceByRole", JSON.stringify(byRole));
    } else {
      localStorage.removeItem("practiceByRole");
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

          const splashContainer = document.getElementById(
            "splashScreenContainer",
          );
          const pageContainer = document.getElementById("page-content");

          if (!splashContainer) {
            loadPage("dashboard");
            return;
          }

          splashContainer.classList.remove("fade-out");
          splashContainer.innerHTML = "";

          fetch("html/splashscreen_mid.html")
            .then((r) => r.text())
            .then((html) => {
              splashContainer.innerHTML = html;

              if (pageContainer) pageContainer.style.display = "none";
              splashContainer.classList.add("splash-full-screen"); // ✅ 여기 핵심
              splashContainer.classList.add("active");

              const logo =
                splashContainer.querySelector(".logo-one.mid-only") ||
                splashContainer.querySelector(".logo-one");

              const EXPECTED_MS = 4700 + 300;

              let finished = false;
              function finish() {
                if (finished) return;
                finished = true;

                splashContainer.classList.add("fade-out");

                setTimeout(() => {
                  loadPage("dashboard").finally(() => {
                    if (pageContainer) pageContainer.style.display = "";
                    splashContainer.classList.remove("active", "fade-out");
                    splashContainer.innerHTML = "";
                  });
                }, 300);
              }

              const fallback = setTimeout(finish, EXPECTED_MS);

              function onAnimationEnd(e) {
                if (e.animationName === "midHold") {
                  clearTimeout(fallback);
                  logo.removeEventListener("animationend", onAnimationEnd);
                  finish();
                }
              }

              if (logo) logo.addEventListener("animationend", onAnimationEnd);
              else {
                clearTimeout(fallback);
                finish();
              }
            })
            .catch(() => {
              if (pageContainer) pageContainer.style.display = "";
              loadPage("dashboard");
            });
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

      // ✅ mid splash(splashscreen_mid.html) 제거: 바로 Intro로 이동
      splashContainer.classList.remove(
        "active",
        "fade-out",
        "splash-full-screen",
      );
      splashContainer.innerHTML = "";
      if (pageContainer) pageContainer.style.display = "";

      loadPage("intro");
      hideIntroSkipButtonOnce();
      replaceIntroPrimaryCtaOnce();

      locked = false;
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

  const template = document.getElementById("privacyTermsModalTemplate");
  if (template) {
    modal.appendChild(template.content.cloneNode(true));
  }

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
