/*
 * Cover test and fixation handover controller.
 */

(function attachCoverController(globalObj) {
  const AppStateRef = globalObj.AppState;
  const OutputWriterRef = globalObj.OutputWriter;
  const COVER_SETTLE_MS = 340;
  const PHORIA_BREAK_DELAY_MS = COVER_SETTLE_MS + 160;
  const PHORIA_BREAK_MS = 1280;
  const FIXATION_SHIFT_MS = 1250;
  const PHORIA_RETURN_MS = 1250;
  const DECOMP_REST_RESET_MS = 5000;
  const DECOMP_COUNTDOWN_TICK_MS = 120;

  let fixationShiftTimer = null;
  let fixationHandoverTimer = null;
  let fixationHandoverActive = false;
  let phoriaBreakTimer = null;
  let phoriaBreakClassTimer = null;
  let phoriaBreakReady = false;
  let lastCoverActivityAt = 0;
  let lastPresetKey = "";
  let decompRecoveryTimer = null;
  let decompCountdownTimer = null;
  let coverCountByEye = { left: 0, right: 0 };
  const phoriaReturnTimers = { left: null, right: null };

  function resetCoverCounters() {
    coverCountByEye = { left: 0, right: 0 };
  }

  function syncCoverCountersWithPreset() {
    const currentKey = String(
      AppStateRef.state.activePresetKey || "",
    ).toLowerCase();
    if (currentKey !== lastPresetKey) {
      resetCoverCounters();
      lastPresetKey = currentKey;
      lastCoverActivityAt = 0;
      stopDecompRecoveryCountdown();
    }
  }

  function getDecompCountdownEl() {
    return document.getElementById("decomp-rest-countdown");
  }

  function stopDecompRecoveryCountdown() {
    if (decompRecoveryTimer) {
      clearTimeout(decompRecoveryTimer);
      decompRecoveryTimer = null;
    }
    if (decompCountdownTimer) {
      clearInterval(decompCountdownTimer);
      decompCountdownTimer = null;
    }
    const el = getDecompCountdownEl();
    if (!el) return;
    el.hidden = true;
    el.textContent = "";
  }

  function renderDecompRecoveryCountdown() {
    const key = String(AppStateRef.state.activePresetKey || "").toLowerCase();
    const profile = getPhoriaProfile(key);
    if (
      !profile?.delayed ||
      !lastCoverActivityAt ||
      String(AppStateRef.state.coverEye || "none").toLowerCase() !== "none"
    ) {
      stopDecompRecoveryCountdown();
      return;
    }

    const remainingMs =
      DECOMP_REST_RESET_MS - (performance.now() - lastCoverActivityAt);
    if (remainingMs <= 0) {
      resetCoverCounters();
      lastCoverActivityAt = 0;
      stopDecompRecoveryCountdown();
      return;
    }

    const seconds = Math.max(1, Math.ceil(remainingMs / 1000));
    const el = getDecompCountdownEl();
    if (!el) return;
    el.hidden = false;
    el.textContent = String(seconds);
  }

  function startDecompRecoveryCountdown() {
    stopDecompRecoveryCountdown();
    if (!lastCoverActivityAt) return;
    renderDecompRecoveryCountdown();
    decompCountdownTimer = setInterval(() => {
      renderDecompRecoveryCountdown();
    }, DECOMP_COUNTDOWN_TICK_MS);
    decompRecoveryTimer = setTimeout(() => {
      resetCoverCounters();
      lastCoverActivityAt = 0;
      stopDecompRecoveryCountdown();
    }, DECOMP_REST_RESET_MS + 20);
  }

  function maybeResetDecompFromRest() {
    const key = String(AppStateRef.state.activePresetKey || "").toLowerCase();
    const phoriaProfile = getPhoriaProfile(key);
    if (!phoriaProfile?.delayed) {
      stopDecompRecoveryCountdown();
      return;
    }
    const now = performance.now();
    if (!lastCoverActivityAt) return;
    if (now - lastCoverActivityAt >= DECOMP_REST_RESET_MS) {
      resetCoverCounters();
      lastCoverActivityAt = 0;
      stopDecompRecoveryCountdown();
    }
  }

  function outwardShiftForEye(eyeType, magnitude) {
    return eyeType === "left" ? -magnitude : magnitude;
  }

  function inwardShiftForEye(eyeType, magnitude) {
    return eyeType === "left" ? magnitude : -magnitude;
  }

  function getPhoriaProfile(presetKey) {
    const key = String(presetKey || "").toLowerCase();
    if (key === "exophoria (small)") {
      return { kind: "horizontal", mode: "exo", magnitude: 8, delayed: false };
    }
    if (key === "esophoria (small)") {
      return { kind: "horizontal", mode: "eso", magnitude: 8, delayed: false };
    }
    if (key === "exophoria (decompensating)") {
      return { kind: "horizontal", mode: "exo", magnitude: 16, delayed: true };
    }
    if (key === "esophoria (decompensating)") {
      return { kind: "horizontal", mode: "eso", magnitude: 16, delayed: true };
    }
    if (key === "hyperphoria (decompensating)") {
      return { kind: "vertical", mode: "hyper", magnitude: 14, delayed: true };
    }
    if (key === "hypophoria (decompensating)") {
      return { kind: "vertical", mode: "hypo", magnitude: 14, delayed: true };
    }
    if (key === "right hyperphoria") {
      return {
        kind: "vertical",
        affectedEye: "left",
        magnitude: 9,
        delayed: false,
      };
    }
    if (key === "left hyperphoria") {
      return {
        kind: "vertical",
        affectedEye: "right",
        magnitude: 9,
        delayed: false,
      };
    }
    return null;
  }

  function getBreakdownFactor(profile, eyeType) {
    if (!profile?.delayed) return 1;
    const count = Number(coverCountByEye[eyeType] || 0);
    if (count <= 1) return 0.38;
    if (count === 2) return 0.72;
    return 1;
  }

  function markPhoriaReturn(eyeType) {
    const key = String(eyeType || "").toLowerCase();
    if (key !== "left" && key !== "right") return;
    const eye = document.querySelector(`.eye[data-eye="${key}"]`);
    if (!eye) return;
    eye.classList.add("is-phoria-return");
    if (phoriaReturnTimers[key]) clearTimeout(phoriaReturnTimers[key]);
    phoriaReturnTimers[key] = setTimeout(() => {
      eye.classList.remove("is-phoria-return");
      phoriaReturnTimers[key] = null;
    }, PHORIA_RETURN_MS);
  }

  function clearPhoriaBreakTimers() {
    if (phoriaBreakTimer) {
      clearTimeout(phoriaBreakTimer);
      phoriaBreakTimer = null;
    }
    if (phoriaBreakClassTimer) {
      clearTimeout(phoriaBreakClassTimer);
      phoriaBreakClassTimer = null;
    }
  }

  function computeFixationOffset(iris) {
    if (!iris) return { x: 0, y: 0 };
    if (!fixationHandoverActive) return { x: 0, y: 0 };
    const eyeType = String(
      iris.closest(".eye")?.dataset?.eye || "",
    ).toLowerCase();
    const coveredEye = String(
      AppStateRef.state.coverEye || "none",
    ).toLowerCase();

    if (
      (coveredEye !== "left" && coveredEye !== "right") ||
      eyeType === coveredEye
    ) {
      return { x: 0, y: 0 };
    }

    // During cover, fellow eye takes fixation by recentring main offsets.
    const baseX =
      (iris.manualOffset?.x || 0) +
      (iris.presetOffset?.x || 0) +
      (iris.gazeOffset?.x || 0) +
      (iris.backgroundOffset?.x || 0);
    const baseY =
      (iris.manualOffset?.y || 0) +
      (iris.presetOffset?.y || 0) +
      (iris.gazeOffset?.y || 0) +
      (iris.backgroundOffset?.y || 0);

    return { x: -baseX, y: -baseY };
  }

  function computeCoverOffset(eyeType) {
    syncCoverCountersWithPreset();
    const coveredEye = String(
      AppStateRef.state.coverEye || "none",
    ).toLowerCase();
    if (coveredEye !== eyeType) return { x: 0, y: 0 };

    const phoriaProfile = getPhoriaProfile(
      AppStateRef.state.activePresetKey || "",
    );
    if (phoriaProfile) {
      if (!phoriaBreakReady) return { x: 0, y: 0 };
      const factor = getBreakdownFactor(phoriaProfile, eyeType);
      if (phoriaProfile.kind === "horizontal") {
        const dx =
          phoriaProfile.mode === "exo"
            ? outwardShiftForEye(eyeType, phoriaProfile.magnitude * factor)
            : inwardShiftForEye(eyeType, phoriaProfile.magnitude * factor);
        return { x: dx, y: 0 };
      }
      if (phoriaProfile.kind === "vertical") {
        if (
          phoriaProfile.affectedEye &&
          phoriaProfile.affectedEye !== eyeType
        ) {
          return { x: 0, y: 0 };
        }
        const sign = phoriaProfile.mode === "hypo" ? 1 : -1;
        return { x: 0, y: sign * (phoriaProfile.magnitude * factor) };
      }
    }

    const preset = String(
      AppStateRef.state.activePresetKey || "",
    ).toLowerCase();
    if (preset === "dvd-like pattern") {
      return { x: eyeType === "left" ? -4 : 4, y: -12 };
    }
    if (preset === "latent nystagmus-like") {
      return { x: eyeType === "left" ? -2 : 2, y: -3 };
    }
    if (preset === "duane type i-like") {
      return { x: eyeType === "left" ? -3 : 3, y: 0 };
    }
    return { x: 0, y: 0 };
  }

  function refreshAllIrisTransforms(updateIrisTransform) {
    if (typeof updateIrisTransform !== "function") return;
    document.querySelectorAll(".eye .iris").forEach((iris) => {
      updateIrisTransform(iris);
    });
  }

  function refreshCoverVisualState(updateIrisTransform) {
    const coveredEye = String(
      AppStateRef.state.coverEye || "none",
    ).toLowerCase();
    const reButton = document.getElementById("cover-re-btn");
    const leButton = document.getElementById("cover-le-btn");

    document.querySelectorAll(".eye").forEach((eye) => {
      const eyeType = String(eye.dataset.eye || "").toLowerCase();
      eye.classList.toggle("is-covered", eyeType === coveredEye);
      eye.classList.remove("is-fixation-shift");
      eye.classList.remove("is-phoria-break");
    });

    // Patient-facing mapping: DOM left eye = RE, DOM right eye = LE.
    reButton?.classList.toggle("is-active", coveredEye === "left");
    leButton?.classList.toggle("is-active", coveredEye === "right");

    if (fixationShiftTimer) {
      clearTimeout(fixationShiftTimer);
      fixationShiftTimer = null;
    }
    if (fixationHandoverTimer) {
      clearTimeout(fixationHandoverTimer);
      fixationHandoverTimer = null;
    }

    if (coveredEye === "left" || coveredEye === "right") {
      // Delay fixation handover until occluder has settled over covered eye.
      fixationHandoverActive = false;
      const expectedCoveredEye = coveredEye;
      fixationHandoverTimer = setTimeout(() => {
        const currentCoveredEye = String(
          AppStateRef.state.coverEye || "none",
        ).toLowerCase();
        if (currentCoveredEye !== expectedCoveredEye) return;

        const fellowEye = document.querySelector(
          `.eye[data-eye="${expectedCoveredEye === "left" ? "right" : "left"}"]`,
        );
        if (fellowEye) {
          fellowEye.classList.add("is-fixation-shift");
        }

        // Apply fixation recapture on next frame so slower CSS transition is honoured.
        requestAnimationFrame(() => {
          fixationHandoverActive = true;
          refreshAllIrisTransforms(updateIrisTransform);
          OutputWriterRef.updateAllOutputs();
        });

        if (fellowEye) {
          fixationShiftTimer = setTimeout(() => {
            fellowEye.classList.remove("is-fixation-shift");
            fixationShiftTimer = null;
          }, FIXATION_SHIFT_MS);
        }
        fixationHandoverTimer = null;
      }, COVER_SETTLE_MS);
    } else {
      fixationHandoverActive = false;
    }
  }

  function refreshCoverOffsets(updateIrisTransform) {
    if (typeof updateIrisTransform !== "function") return;
    document.querySelectorAll(".eye").forEach((eye) => {
      const eyeType = String(eye.dataset.eye || "").toLowerCase();
      const iris = eye.querySelector(".iris");
      if (!iris) return;
      iris.coverOffset = computeCoverOffset(eyeType);
      updateIrisTransform(iris);
    });
  }

  function applyCoverState(eyeType, updateIrisTransform, options = {}) {
    syncCoverCountersWithPreset();
    maybeResetDecompFromRest();
    const value = String(eyeType || "none").toLowerCase();
    const previous = String(AppStateRef.state.coverEye || "none").toLowerCase();
    const nextCoveredEye =
      value === "left" || value === "right" ? value : "none";
    AppStateRef.state.coverEye = nextCoveredEye;
    if (nextCoveredEye !== previous) {
      lastCoverActivityAt = performance.now();
      if (nextCoveredEye === "left" || nextCoveredEye === "right") {
        coverCountByEye[nextCoveredEye] =
          Number(coverCountByEye[nextCoveredEye] || 0) + 1;
      }
    }

    const phoriaProfile = getPhoriaProfile(
      AppStateRef.state.activePresetKey || "",
    );
    if (phoriaProfile?.delayed) {
      if (nextCoveredEye !== "none") {
        stopDecompRecoveryCountdown();
      } else if (nextCoveredEye !== previous) {
        startDecompRecoveryCountdown();
      } else if (!decompCountdownTimer) {
        renderDecompRecoveryCountdown();
      }
    } else {
      stopDecompRecoveryCountdown();
    }

    const returningEye =
      phoriaProfile &&
      (previous === "left" || previous === "right") &&
      previous !== nextCoveredEye
        ? previous
        : null;

    clearPhoriaBreakTimers();
    phoriaBreakReady = false;
    refreshCoverVisualState(updateIrisTransform);
    if (returningEye) {
      markPhoriaReturn(returningEye);
    }

    // For phorias: do not let covered-eye drift start before occluder settles.
    if (
      phoriaProfile &&
      (nextCoveredEye === "left" || nextCoveredEye === "right")
    ) {
      refreshCoverOffsets(updateIrisTransform);
      const targetCoveredEye = nextCoveredEye;
      phoriaBreakTimer = setTimeout(() => {
        if (
          String(AppStateRef.state.coverEye || "none").toLowerCase() !==
          targetCoveredEye
        )
          return;
        phoriaBreakReady = true;
        const coveredEyeEl = document.querySelector(
          `.eye[data-eye="${targetCoveredEye}"]`,
        );
        if (coveredEyeEl) {
          coveredEyeEl.classList.add("is-phoria-break");
          phoriaBreakClassTimer = setTimeout(() => {
            coveredEyeEl.classList.remove("is-phoria-break");
            phoriaBreakClassTimer = null;
          }, PHORIA_BREAK_MS);
        }
        refreshCoverOffsets(updateIrisTransform);
        OutputWriterRef.updateAllOutputs();
        phoriaBreakTimer = null;
      }, PHORIA_BREAK_DELAY_MS);
    } else {
      phoriaBreakReady = true;
      refreshCoverOffsets(updateIrisTransform);
    }
    if (!options.silent && previous !== AppStateRef.state.coverEye) {
      let visibleEye = "both";
      if (AppStateRef.state.coverEye === "left") visibleEye = "right";
      else if (AppStateRef.state.coverEye === "right") visibleEye = "left";
      globalObj.LightController?.triggerCoverPupilFluctuationForEye(
        visibleEye,
        1.15,
      );
    }
    if (!options.silent) {
      OutputWriterRef.updateAllOutputs();
    }
  }

  function toggleCover(eyeType, updateIrisTransform, options = {}) {
    const target = String(eyeType || "none").toLowerCase();
    const current = String(AppStateRef.state.coverEye || "none").toLowerCase();
    if (target !== "left" && target !== "right") {
      applyCoverState("none", updateIrisTransform, options);
      return;
    }
    applyCoverState(
      current === target ? "none" : target,
      updateIrisTransform,
      options,
    );
  }

  globalObj.CoverController = {
    computeFixationOffset,
    refreshCoverVisualState,
    refreshCoverOffsets,
    applyCoverState,
    toggleCover,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
