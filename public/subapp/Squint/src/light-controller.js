/*
 * Torch/light and RAPD interaction controller.
 */

(function attachLightController(globalObj) {
  const AppStateRef = globalObj.AppState;
  const OutputWriterRef = globalObj.OutputWriter;
  const LIGHT_CONSTRICTION_MAX = 11;
  const AMBIENT_CONSTRICTION_MAX = 4;
  const PUPIL_RESPONSE_TAU_MS = 235;
  const AMBIENT_RESPONSE_TAU_MS = 520;
  const HORNERS_DARK_DILATION_GAIN = 0.34;
  const HORNERS_DARK_LAG_WINDOW_MS = 3200;
  const HORNERS_DARK_LAG_TAU_MS = 2600;
  const HORNERS_DARK_TAU_MS = 980;
  const HIPPUS_AMPLITUDE_PX = 0.26;
  const HIPPUS_FREQ_HZ = 1.25;
  const TONIC_CAPTURE_GAIN = 0.42;
  const TONIC_CAPTURE_BIAS = 0.55;
  const TONIC_REDILATION_TAU_MS = 2200;
  const SEGMENTAL_WORMY_AMPLITUDE = 0.35;
  const SEGMENTAL_WORMY_AMPLITUDE_2 = 0.18;
  const SEGMENTAL_WORMY_FREQ_HZ = 2.3;
  const SEGMENTAL_WORMY_FREQ_2_HZ = 3.9;
  const SWING_TRANSFER_MIN_MS = 320;
  const SWING_TRANSFER_MAX_MS = 760;
  const SWING_REBOUND_MS = 460;
  const SWING_REBOUND_AMPLITUDE = 0.9;
  const SWING_STABILISE_MS = 3000;
  const SWING_STABILISE_AMPLITUDE = 0.95;
  const ESCAPE_START_MS = 4000;
  const ESCAPE_RAMP_MS = 1500;
  const ESCAPE_MAX_RELEASE = 0.75;
  const COVER_FLUCT_MS = 1200;
  const COVER_FLUCT_BASE_AMPLITUDE = 2.1;
  const CORNEAL_LIGHT_SHIFT_X_LIMIT_PX = 0.8;
  const CORNEAL_LIGHT_SHIFT_Y_LIMIT_PX = 0.6;

  const pupilResponseState = {
    currentConstriction: 0,
    targetConstriction: 0,
    ambientByEye: {
      left: { current: 0, target: 0, lastDarkShiftAt: 0 },
      right: { current: 0, target: 0, lastDarkShiftAt: 0 },
    },
    phaseSeconds: 0,
    lastTs: 0,
    rafId: null,
  };
  const lightTransferState = {
    active: false,
    fromSide: "none",
    toSide: "none",
    startedAt: 0,
    durationMs: 0,
    reboundStartAt: 0,
    reboundAmplitude: 0,
    settleStartAt: 0,
    settleAmplitude: 0,
    settleSide: "none",
    holdSide: "none",
    holdStartedAt: 0,
    coverPulseStartAt: 0,
    coverPulseAmplitude: 0,
    coverPulseEye: "both",
  };
  const tonicPupilState = {
    left: { carryPx: 0 },
    right: { carryPx: 0 },
  };

  function clampNumber(value, min, max) {
    return Math.min(Math.max(Number(value) || 0, min), max);
  }

  function getEyePupilReactivity(eyeType) {
    const key = String(eyeType || "").toLowerCase();
    if (key !== "left" && key !== "right") return 1;
    const value = Number(AppStateRef.state?.pupilReactivityByEye?.[key]);
    if (!Number.isFinite(value)) return 1;
    return clampNumber(value, 0, 1);
  }

  function getEyePupilModel(eyeType) {
    const key = String(eyeType || "").toLowerCase();
    if (key !== "left" && key !== "right") return "normal";
    const rawModel = String(
      AppStateRef.state?.pupilModelByEye?.[key] || "normal",
    ).toLowerCase();
    const model = rawModel.replace(/_/g, "-");
    const allowed = new Set([
      "normal",
      "horner",
      "adie",
      "peaked",
      "argyll-robertson",
      "acute-angle-closure",
      "pharmacological-mydriasis",
      "pharmacological-miosis",
      "traumatic-mydriasis",
      "traumatic-miotic",
    ]);
    return allowed.has(model) ? model : "normal";
  }

  function isHornerEye(eyeType) {
    return getEyePupilModel(eyeType) === "horner";
  }

  function isAdieEye(eyeType) {
    return getEyePupilModel(eyeType) === "adie";
  }

  function isPeakedEye(eyeType) {
    return getEyePupilModel(eyeType) === "peaked";
  }

  function isAcuteAngleClosureEye(eyeType) {
    return getEyePupilModel(eyeType) === "acute-angle-closure";
  }

  function getAmbientTargetForEye(eyeType, baseAmbientPx) {
    if (baseAmbientPx < 0 && isHornerEye(eyeType)) {
      return baseAmbientPx * HORNERS_DARK_DILATION_GAIN;
    }
    return baseAmbientPx;
  }

  function ensureAmbientState() {
    const fallback = getAmbientConstrictionPx();
    ["left", "right"].forEach((eyeType) => {
      const state = pupilResponseState.ambientByEye[eyeType];
      if (!state) {
        pupilResponseState.ambientByEye[eyeType] = {
          current: getAmbientTargetForEye(eyeType, fallback),
          target: getAmbientTargetForEye(eyeType, fallback),
          lastDarkShiftAt: 0,
        };
        return;
      }
      if (!Number.isFinite(state.current))
        state.current = getAmbientTargetForEye(eyeType, fallback);
      if (!Number.isFinite(state.target))
        state.target = getAmbientTargetForEye(eyeType, fallback);
      if (!Number.isFinite(state.lastDarkShiftAt)) state.lastDarkShiftAt = 0;
    });
  }

  function getLightAfferentGain(lightSide) {
    const side = String(lightSide || "none").toLowerCase();
    if (side !== "left" && side !== "right") return 0;

    const rapd = clampNumber(AppStateRef.state.rapdValue || 0, -100, 100);
    const severity = Math.abs(rapd) / 100;
    const affectedSide = rapd > 0.5 ? "left" : rapd < -0.5 ? "right" : "none";

    if (affectedSide === side) {
      // If light is on affected side, constriction signal weakens.
      return Math.max(0.2, 1 - 0.8 * severity);
    }
    return 1;
  }

  function syncRapdLabel() {
    const label = document.getElementById("rapd-value-label");
    if (!label) return;
    const rapd = clampNumber(AppStateRef.state.rapdValue || 0, -100, 100);
    if (rapd < -1) label.textContent = `L${Math.round(Math.abs(rapd))}`;
    else if (rapd > 1) label.textContent = `R${Math.round(Math.abs(rapd))}`;
    else label.textContent = "0";
  }

  function getLightPillPosition() {
    return clampNumber(AppStateRef.state.lightPillPos ?? 0, 0, 1);
  }

  function prefersReducedMotion() {
    try {
      return Boolean(
        globalObj.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
      );
    } catch (_error) {
      return false;
    }
  }

  function getSwingDurationMs() {
    if (prefersReducedMotion()) return 180;
    const jitter =
      Math.random() * (SWING_TRANSFER_MAX_MS - SWING_TRANSFER_MIN_MS);
    return SWING_TRANSFER_MIN_MS + jitter;
  }

  function getAmbientLevel() {
    return clampNumber(AppStateRef.state.ambientLevel ?? 100, 0, 100);
  }

  function getLightSideFromPosition(position) {
    return Number(position) >= 0.5 ? "right" : "left";
  }

  function getLightPositionGain(lightSide) {
    const pos = getLightPillPosition();
    if (lightSide === "left") {
      return clampNumber(1 - 0.45 * pos, 0.55, 1);
    }
    if (lightSide === "right") {
      return clampNumber(1 - 0.45 * (1 - pos), 0.55, 1);
    }
    return 0;
  }

  function getSideStimulus(side) {
    const lightSide = String(side || "none").toLowerCase();
    if (lightSide !== "left" && lightSide !== "right") return 0;
    const gain = getLightAfferentGain(lightSide);
    const positionGain = getLightPositionGain(lightSide);
    return gain * positionGain;
  }

  function startLightTransfer(fromSide, toSide) {
    const from = String(fromSide || "none").toLowerCase();
    const to = String(toSide || "none").toLowerCase();
    if (
      (from !== "left" && from !== "right") ||
      (to !== "left" && to !== "right") ||
      from === to
    ) {
      lightTransferState.active = false;
      lightTransferState.fromSide = "none";
      lightTransferState.toSide = "none";
      lightTransferState.startedAt = 0;
      lightTransferState.durationMs = 0;
      lightTransferState.reboundStartAt = 0;
      lightTransferState.reboundAmplitude = 0;
      lightTransferState.settleStartAt = 0;
      lightTransferState.settleAmplitude = 0;
      lightTransferState.settleSide = "none";
      lightTransferState.holdSide = "none";
      lightTransferState.holdStartedAt = 0;
      return;
    }
    lightTransferState.active = true;
    lightTransferState.fromSide = from;
    lightTransferState.toSide = to;
    lightTransferState.startedAt = performance.now();
    lightTransferState.durationMs = getSwingDurationMs();
    lightTransferState.reboundStartAt = 0;
    lightTransferState.reboundAmplitude = 0;
    lightTransferState.settleStartAt = 0;
    lightTransferState.settleAmplitude = 0;
    lightTransferState.settleSide = to;
    lightTransferState.holdSide = "none";
    lightTransferState.holdStartedAt = 0;
  }

  function clearLightTransfer(options = {}) {
    const clearSettle = options.clearSettle !== false;
    lightTransferState.active = false;
    lightTransferState.fromSide = "none";
    lightTransferState.toSide = "none";
    lightTransferState.startedAt = 0;
    lightTransferState.durationMs = 0;
    lightTransferState.reboundStartAt = 0;
    lightTransferState.reboundAmplitude = 0;
    if (clearSettle) {
      lightTransferState.settleStartAt = 0;
      lightTransferState.settleAmplitude = 0;
      lightTransferState.settleSide = "none";
      lightTransferState.holdSide = "none";
      lightTransferState.holdStartedAt = 0;
    }
  }

  function startSettlePhase(
    side,
    amplitude = SWING_STABILISE_AMPLITUDE,
    nowMs = performance.now(),
  ) {
    const s = String(side || "none").toLowerCase();
    if (s !== "left" && s !== "right") {
      lightTransferState.settleStartAt = 0;
      lightTransferState.settleAmplitude = 0;
      lightTransferState.settleSide = "none";
      lightTransferState.holdSide = "none";
      lightTransferState.holdStartedAt = 0;
      return;
    }
    lightTransferState.settleStartAt = nowMs;
    lightTransferState.settleAmplitude = Math.max(0, Number(amplitude) || 0);
    lightTransferState.settleSide = s;
    lightTransferState.holdSide = s;
    lightTransferState.holdStartedAt = nowMs;
  }

  function getSwingReboundRelease(nowMs) {
    if (
      !lightTransferState.reboundStartAt ||
      lightTransferState.reboundAmplitude <= 0
    )
      return 0;
    const elapsed = nowMs - lightTransferState.reboundStartAt;
    if (elapsed <= 0 || elapsed >= SWING_REBOUND_MS) {
      lightTransferState.reboundStartAt = 0;
      lightTransferState.reboundAmplitude = 0;
      return 0;
    }
    const normalised = elapsed / SWING_REBOUND_MS;
    const envelope = Math.sin(normalised * Math.PI);
    return lightTransferState.reboundAmplitude * envelope;
  }

  function getStabiliseRelease(nowMs) {
    if (
      !lightTransferState.settleStartAt ||
      lightTransferState.settleAmplitude <= 0
    )
      return 0;
    const activeSide = String(
      AppStateRef.state.activeLightSide || "none",
    ).toLowerCase();
    if (activeSide !== lightTransferState.settleSide) {
      lightTransferState.settleStartAt = 0;
      lightTransferState.settleAmplitude = 0;
      lightTransferState.settleSide = "none";
      return 0;
    }
    const elapsed = nowMs - lightTransferState.settleStartAt;
    if (elapsed <= 0) return lightTransferState.settleAmplitude;
    if (elapsed >= SWING_STABILISE_MS) {
      lightTransferState.settleStartAt = 0;
      lightTransferState.settleAmplitude = 0;
      return 0;
    }
    const t = clampNumber(elapsed / SWING_STABILISE_MS, 0, 1);
    return lightTransferState.settleAmplitude * (1 - t);
  }

  function getEscapeRelease(nowMs) {
    const activeSide = String(
      AppStateRef.state.activeLightSide || "none",
    ).toLowerCase();
    if (activeSide !== "left" && activeSide !== "right") return 0;

    if (lightTransferState.holdSide !== activeSide) {
      lightTransferState.holdSide = activeSide;
      lightTransferState.holdStartedAt = nowMs;
      return 0;
    }

    const elapsed = nowMs - (lightTransferState.holdStartedAt || nowMs);
    if (elapsed <= ESCAPE_START_MS) return 0;

    const ramp = clampNumber(
      (elapsed - ESCAPE_START_MS) / ESCAPE_RAMP_MS,
      0,
      1,
    );
    return ESCAPE_MAX_RELEASE * ramp;
  }

  function triggerCoverPupilFluctuation(scale = 1) {
    const s = clampNumber(scale, 0, 2);
    if (!s) return;
    lightTransferState.coverPulseStartAt = performance.now();
    lightTransferState.coverPulseAmplitude = COVER_FLUCT_BASE_AMPLITUDE * s;
    lightTransferState.coverPulseEye = "both";
    ensurePupilResponseAnimation();
  }

  function triggerCoverPupilFluctuationForEye(targetEye = "both", scale = 1) {
    let eye = String(targetEye || "both").toLowerCase();
    if (eye !== "left" && eye !== "right") eye = "both";
    const s = clampNumber(scale, 0, 2);
    if (!s) return;
    lightTransferState.coverPulseStartAt = performance.now();
    lightTransferState.coverPulseAmplitude = COVER_FLUCT_BASE_AMPLITUDE * s;
    lightTransferState.coverPulseEye = eye;
    ensurePupilResponseAnimation();
  }

  function getCoverFluctuation(nowMs) {
    if (
      !lightTransferState.coverPulseStartAt ||
      lightTransferState.coverPulseAmplitude <= 0
    )
      return 0;
    const elapsed = nowMs - lightTransferState.coverPulseStartAt;
    if (elapsed <= 0) return 0;
    if (elapsed >= COVER_FLUCT_MS) {
      lightTransferState.coverPulseStartAt = 0;
      lightTransferState.coverPulseAmplitude = 0;
      lightTransferState.coverPulseEye = "both";
      return 0;
    }

    const t = clampNumber(elapsed / COVER_FLUCT_MS, 0, 1);
    const decay = Math.exp(-1.75 * t);
    const wave = Math.sin(t * Math.PI * 2 * 2.1);
    return lightTransferState.coverPulseAmplitude * decay * wave;
  }

  function getEffectiveLightStimulus(nowMs) {
    const activeLightSide = String(
      AppStateRef.state.activeLightSide || "none",
    ).toLowerCase();

    if (!lightTransferState.active) {
      return getSideStimulus(activeLightSide);
    }

    const fromDrive = getSideStimulus(lightTransferState.fromSide);
    const toDrive = getSideStimulus(lightTransferState.toSide);
    const elapsed = Math.max(0, nowMs - lightTransferState.startedAt);
    const progress = clampNumber(
      elapsed / Math.max(lightTransferState.durationMs, 1),
      0,
      1,
    );
    const blended = fromDrive + (toDrive - fromDrive) * progress;

    if (progress >= 1) {
      lightTransferState.active = false;
      if (
        lightTransferState.toSide === activeLightSide &&
        activeLightSide !== "none"
      ) {
        lightTransferState.reboundStartAt = nowMs;
        lightTransferState.reboundAmplitude = SWING_REBOUND_AMPLITUDE;
        startSettlePhase(activeLightSide, SWING_STABILISE_AMPLITUDE, nowMs);
      } else {
        lightTransferState.reboundStartAt = 0;
        lightTransferState.reboundAmplitude = 0;
        lightTransferState.settleStartAt = 0;
        lightTransferState.settleAmplitude = 0;
        lightTransferState.settleSide = "none";
        lightTransferState.holdSide = "none";
        lightTransferState.holdStartedAt = 0;
      }
    }

    return blended;
  }

  function getAmbientConstrictionPx() {
    const normalised = (getAmbientLevel() - 50) / 50; // -1..1
    return normalised * AMBIENT_CONSTRICTION_MAX;
  }

  function lerpChannel(a, b, t) {
    return Math.round(a + (b - a) * t);
  }

  function applyAmbientVisual() {
    const t = getAmbientLevel() / 100;
    const eyesCard = document.querySelector(".eyes-card");
    const darkCard = { r: 8, g: 10, b: 8 };
    const brightCard = { r: 82, g: 85, b: 72 };
    const darkEye = { r: 96, g: 100, b: 104 };
    const brightEye = { r: 197, g: 199, b: 197 };

    const cardR = lerpChannel(darkCard.r, brightCard.r, t);
    const cardG = lerpChannel(darkCard.g, brightCard.g, t);
    const cardB = lerpChannel(darkCard.b, brightCard.b, t);
    const eyeR = lerpChannel(darkEye.r, brightEye.r, t);
    const eyeG = lerpChannel(darkEye.g, brightEye.g, t);
    const eyeB = lerpChannel(darkEye.b, brightEye.b, t);

    if (eyesCard) {
      const cardColor = `rgb(${cardR}, ${cardG}, ${cardB})`;
      eyesCard.style.setProperty("--eyes-card-bg", cardColor);
    }
    document.querySelectorAll(".eye").forEach((eye) => {
      const eyeColor = `rgb(${eyeR}, ${eyeG}, ${eyeB})`;
      eye.style.setProperty("--eye-ambient-bg", eyeColor);
    });
  }

  function refreshCornealReflexLightOffset(
    lightSide,
    gain = 1,
    positionGain = 1,
  ) {
    const activeSide = String(lightSide || "none").toLowerCase();
    const isActive = activeSide === "left" || activeSide === "right";
    const sweepX = isActive
      ? clampNumber(
          (getLightPillPosition() - 0.5) * 2 * CORNEAL_LIGHT_SHIFT_X_LIMIT_PX,
          -CORNEAL_LIGHT_SHIFT_X_LIMIT_PX,
          CORNEAL_LIGHT_SHIFT_X_LIMIT_PX,
        )
      : 0;
    const sweepY = isActive
      ? clampNumber(
          (1 - positionGain) * CORNEAL_LIGHT_SHIFT_Y_LIMIT_PX,
          0,
          CORNEAL_LIGHT_SHIFT_Y_LIMIT_PX,
        )
      : 0;

    document.querySelectorAll(".eye").forEach((eye) => {
      const eyeType = String(eye.dataset.eye || "").toLowerCase();
      const hasDirectLight = isActive && eyeType === activeSide;
      const directGain = clampNumber(gain * positionGain, 0, 1);
      const scale = !isActive
        ? 1
        : hasDirectLight
          ? 1 + 0.12 * directGain
          : 0.92;
      const opacity = !isActive ? 1 : hasDirectLight ? 1 : 0.72;

      eye.style.setProperty(
        "--corneal-reflex-light-x",
        `${sweepX.toFixed(2)}px`,
      );
      eye.style.setProperty(
        "--corneal-reflex-light-y",
        `${sweepY.toFixed(2)}px`,
      );
      eye.style.setProperty("--corneal-reflex-scale", scale.toFixed(3));
      eye.style.setProperty("--corneal-reflex-opacity", opacity.toFixed(2));
    });
  }

  function syncLightPillVisual() {
    const zone = document.getElementById("light-drag-zone");
    const pill = document.getElementById("light-pill");
    const arrow = document.getElementById("light-pill-arrow");
    if (!zone || !pill) return;

    const position = getLightPillPosition();
    const positionSide = getLightSideFromPosition(position);
    const lightSide = String(
      AppStateRef.state.activeLightSide || "none",
    ).toLowerCase();
    const isActive = lightSide === "left" || lightSide === "right";
    const side = isActive
      ? lightSide
      : String(AppStateRef.state.lightPillSide || positionSide).toLowerCase();

    zone.classList.toggle("is-right", side === "right");
    pill.classList.toggle("is-active", isActive);

    const zoneWidth =
      zone.clientWidth || zone.getBoundingClientRect().width || 0;
    const pillWidth = pill.offsetWidth || 34;
    const travelPx = Math.max(zoneWidth - pillWidth - 2, 0);
    const leftPx = 1 + travelPx * position;
    pill.style.setProperty("--light-pill-left", `${leftPx}px`);

    if (arrow) {
      arrow.textContent = side === "right" ? "<" : ">";
    }

    zone.setAttribute("aria-valuenow", String(Math.round(position * 100)));
    zone.setAttribute(
      "aria-valuetext",
      side === "right" ? "Left eye temporal side" : "Right eye temporal side",
    );
  }

  function setupLightPillControl() {
    const zone = document.getElementById("light-drag-zone");
    const pill = document.getElementById("light-pill");
    if (!zone || !pill) return;
    if (zone.dataset.boundLightPill === "1") {
      syncLightPillVisual();
      return;
    }

    zone.dataset.boundLightPill = "1";
    let activePointerId = null;
    let dragMoved = false;
    let startX = 0;
    let startY = 0;
    let wasActiveOnPress = false;
    let tapSide = getLightSideFromPosition(getLightPillPosition());

    function positionFromClientX(clientX) {
      const rect = zone.getBoundingClientRect();
      const zoneWidth = rect.width || zone.clientWidth || 0;
      const pillWidth = pill.offsetWidth || 34;
      const usable = Math.max(zoneWidth - pillWidth - 2, 0);
      const pillLeft = clampNumber(
        clientX - rect.left - pillWidth / 2,
        0,
        usable,
      );
      if (!usable) return 0;
      return clampNumber(pillLeft / usable, 0, 1);
    }

    function sideFromClientX(clientX) {
      return getLightSideFromPosition(positionFromClientX(clientX));
    }

    function applyPositionFromPointer(clientX, options = {}) {
      const position = positionFromClientX(clientX);
      AppStateRef.state.lightPillPos = position;
      const side = getLightSideFromPosition(position);
      AppStateRef.state.lightPillSide = side;
      if (options.activate) {
        setLightState(side, { allowToggle: false, silent: options.silent });
      } else {
        syncLightPillVisual();
      }
    }

    function snapPillBackToCentre() {
      AppStateRef.state.lightPillPos = 0.5;
      AppStateRef.state.lightPillSide = getLightSideFromPosition(0.5);
      setLightState("none", { allowToggle: false });
    }

    function activateSideFromCentre(side) {
      const targetSide =
        side === "left" || side === "right"
          ? side
          : getLightSideFromPosition(0.5);
      AppStateRef.state.lightPillPos = 0.5;
      AppStateRef.state.lightPillSide = targetSide;
      setLightState(targetSide, { allowToggle: false });
    }

    function onPointerMove(event) {
      if (event.pointerId !== activePointerId) return;
      const dx = Math.abs(event.clientX - startX);
      const dy = Math.abs(event.clientY - startY);
      if (!dragMoved && (dx > 4 || dy > 4)) {
        dragMoved = true;
      }
      if (!dragMoved) return;
      event.preventDefault();
      pill.classList.add("is-dragging");
      applyPositionFromPointer(event.clientX, { activate: true });
    }

    function onPointerEnd(event) {
      if (event.pointerId !== activePointerId) return;
      zone.releasePointerCapture(activePointerId);
      activePointerId = null;
      zone.removeEventListener("pointermove", onPointerMove);
      zone.removeEventListener("pointerup", onPointerEnd);
      zone.removeEventListener("pointercancel", onPointerEnd);
      pill.classList.remove("is-dragging");

      if (!dragMoved) {
        if (wasActiveOnPress) {
          snapPillBackToCentre();
        } else {
          activateSideFromCentre(tapSide);
        }
      } else {
        snapPillBackToCentre();
      }
    }

    zone.addEventListener("pointerdown", (event) => {
      AppStateRef.markManualInteraction();
      activePointerId = event.pointerId;
      dragMoved = false;
      startX = event.clientX;
      startY = event.clientY;
      wasActiveOnPress =
        String(AppStateRef.state.activeLightSide || "none") !== "none";
      tapSide = sideFromClientX(event.clientX);
      zone.setPointerCapture(activePointerId);
      zone.addEventListener("pointermove", onPointerMove);
      zone.addEventListener("pointerup", onPointerEnd);
      zone.addEventListener("pointercancel", onPointerEnd);
    });

    syncLightPillVisual();
  }

  function refreshLightVisualState() {
    const lightSide = String(
      AppStateRef.state.activeLightSide || "none",
    ).toLowerCase();
    syncLightPillVisual();

    const gain = getLightAfferentGain(lightSide);
    const positionGain = getLightPositionGain(lightSide);
    document.querySelectorAll(".eye").forEach((eye) => {
      const eyeType = String(eye.dataset.eye || "").toLowerCase();
      const patch = eye.querySelector(".torch-patch");
      if (!patch) return;

      patch.classList.remove("is-active", "source-left", "source-right");
      patch.style.removeProperty("--torch-alpha");

      if (lightSide !== "left" && lightSide !== "right") return;
      if (eyeType !== lightSide) return;

      patch.classList.add(
        "is-active",
        lightSide === "left" ? "source-left" : "source-right",
      );
      patch.style.setProperty(
        "--torch-alpha",
        (0.86 * gain * positionGain).toFixed(3),
      );
    });

    refreshCornealReflexLightOffset(lightSide, gain, positionGain);
    syncRapdLabel();
  }

  function refreshLightPupilResponse() {
    const now = performance.now();
    const stimulus = getEffectiveLightStimulus(now);
    const reboundRelease = getSwingReboundRelease(now);
    const stabiliseRelease = getStabiliseRelease(now);
    const escapeRelease = getEscapeRelease(now);
    const constriction = Math.max(
      0,
      LIGHT_CONSTRICTION_MAX * stimulus -
        reboundRelease -
        stabiliseRelease -
        escapeRelease,
    );
    pupilResponseState.targetConstriction = constriction;
    ensureAmbientState();
    const baseAmbient = getAmbientConstrictionPx();
    ["left", "right"].forEach((eyeType) => {
      const eyeAmbientState = pupilResponseState.ambientByEye[eyeType];
      const nextTarget = getAmbientTargetForEye(eyeType, baseAmbient);
      if (isHornerEye(eyeType) && nextTarget < eyeAmbientState.target - 0.02) {
        eyeAmbientState.lastDarkShiftAt = now;
      }
      eyeAmbientState.target = nextTarget;
    });
    ensurePupilResponseAnimation();
  }

  function applyPupilConstriction(
    constrictionPx,
    ambientConstrictionByEye,
    includeHippus,
    dtMs = 16,
  ) {
    const now = performance.now();
    const lightSide = String(
      AppStateRef.state.activeLightSide || "none",
    ).toLowerCase();
    const isLightActive = lightSide === "left" || lightSide === "right";
    const coverFluctuation = getCoverFluctuation(now);
    const hippus =
      isLightActive && includeHippus
        ? Math.sin(
            pupilResponseState.phaseSeconds * Math.PI * 2 * HIPPUS_FREQ_HZ,
          ) * HIPPUS_AMPLITUDE_PX
        : 0;

    document.querySelectorAll(".eye").forEach((eye) => {
      const eyeType = String(eye.dataset.eye || "").toLowerCase();
      const slider = document.querySelector(`.slider[data-eye="${eyeType}"]`);
      const pupil = eye.querySelector(".pupil");
      const iris = eye.querySelector(".iris");
      if (!slider || !pupil) return;

      const baseSize = clampNumber(
        slider.value || AppStateRef.BASE_PUPIL_SIZE,
        10,
        55,
      );
      const reactivity = getEyePupilReactivity(eyeType);
      const model = getEyePupilModel(eyeType);
      const ambientConstrictionPx = Number(
        ambientConstrictionByEye?.[eyeType] ?? 0,
      );
      const isAdieModel = model === "adie";
      const isPeakedModel = model === "peaked";
      const isHyporeactive = reactivity > 0 && reactivity < 0.5;
      const isTonicEye = isAdieModel && isHyporeactive;
      const hasDirectLight = isLightActive && lightSide === eyeType;
      const coverFluctuationForEye =
        lightTransferState.coverPulseEye === "both" ||
        lightTransferState.coverPulseEye === eyeType
          ? coverFluctuation
          : 0;
      const eyeConstriction = constrictionPx * reactivity;
      const eyeAmbientConstriction = ambientConstrictionPx * reactivity;
      const eyeHippus = hippus * reactivity;
      const tonicEyeState = tonicPupilState[eyeType] || { carryPx: 0 };

      if (isTonicEye) {
        if (hasDirectLight) {
          const capture =
            eyeConstriction * TONIC_CAPTURE_GAIN + TONIC_CAPTURE_BIAS;
          tonicEyeState.carryPx = Math.max(tonicEyeState.carryPx, capture);
        } else {
          const decay = Math.exp(-Math.max(dtMs, 0) / TONIC_REDILATION_TAU_MS);
          tonicEyeState.carryPx *= decay;
        }
      } else {
        tonicEyeState.carryPx = 0;
      }
      tonicPupilState[eyeType] = tonicEyeState;

      const tonicCarryPx = hasDirectLight ? 0 : tonicEyeState.carryPx;
      const allowSegmentalWormy =
        hasDirectLight && includeHippus && (isAdieModel || isPeakedModel);
      const wormyGain = isPeakedModel ? 1.22 : 1;
      const segmentalWormyPx = allowSegmentalWormy
        ? wormyGain *
          (SEGMENTAL_WORMY_AMPLITUDE *
            Math.sin(
              pupilResponseState.phaseSeconds *
                Math.PI *
                2 *
                SEGMENTAL_WORMY_FREQ_HZ +
                (eyeType === "left" ? 0.6 : 1.1),
            ) +
            SEGMENTAL_WORMY_AMPLITUDE_2 *
              Math.sin(
                pupilResponseState.phaseSeconds *
                  Math.PI *
                  2 *
                  SEGMENTAL_WORMY_FREQ_2_HZ +
                  (eyeType === "left" ? 1.7 : 2.3),
              ))
        : 0;
      const effective = clampNumber(
        baseSize -
          eyeConstriction -
          eyeAmbientConstriction -
          tonicCarryPx +
          eyeHippus +
          coverFluctuationForEye +
          segmentalWormyPx,
        8,
        56,
      );
      pupil.classList.toggle("is-peaked", isPeakedEye(eyeType));
      pupil.classList.toggle(
        "is-oval-vertical",
        isAcuteAngleClosureEye(eyeType),
      );
      if (iris) {
        iris.classList.toggle(
          "is-ciliary-injection",
          isAcuteAngleClosureEye(eyeType),
        );
      }
      pupil.style.width = `${effective.toFixed(2)}px`;
      pupil.style.height = `${effective.toFixed(2)}px`;
      pupil.dataset.effectiveSize = String(effective);
      pupil.dataset.baseSize = String(baseSize);
    });
  }

  function stepPupilResponse(ts) {
    const now = Number(ts) || performance.now();
    const dynamicStimulus = getEffectiveLightStimulus(now);
    const reboundRelease = getSwingReboundRelease(now);
    const stabiliseRelease = getStabiliseRelease(now);
    const escapeRelease = getEscapeRelease(now);
    pupilResponseState.targetConstriction = Math.max(
      0,
      LIGHT_CONSTRICTION_MAX * dynamicStimulus -
        reboundRelease -
        stabiliseRelease -
        escapeRelease,
    );

    const previous = pupilResponseState.lastTs || now;
    const dtMs = clampNumber(now - previous, 0, 120);
    pupilResponseState.lastTs = now;
    const alpha = 1 - Math.exp(-(dtMs / Math.max(PUPIL_RESPONSE_TAU_MS, 1)));

    const target = pupilResponseState.targetConstriction;
    const current = pupilResponseState.currentConstriction;
    const next = current + (target - current) * alpha;
    pupilResponseState.currentConstriction = next;
    ensureAmbientState();
    const ambientApplied = { left: 0, right: 0 };
    ["left", "right"].forEach((eyeType) => {
      const eyeAmbientState = pupilResponseState.ambientByEye[eyeType];
      const movingIntoDark =
        eyeAmbientState.target < eyeAmbientState.current - 0.01;
      let tauMs = AMBIENT_RESPONSE_TAU_MS;
      if (isHornerEye(eyeType) && movingIntoDark) {
        const sinceDarkShift = now - (eyeAmbientState.lastDarkShiftAt || now);
        tauMs =
          sinceDarkShift < HORNERS_DARK_LAG_WINDOW_MS
            ? HORNERS_DARK_LAG_TAU_MS
            : HORNERS_DARK_TAU_MS;
      }
      const eyeAmbientAlpha = 1 - Math.exp(-(dtMs / Math.max(tauMs, 1)));
      eyeAmbientState.current =
        eyeAmbientState.current +
        (eyeAmbientState.target - eyeAmbientState.current) * eyeAmbientAlpha;
      ambientApplied[eyeType] = eyeAmbientState.current;
    });
    pupilResponseState.phaseSeconds += dtMs / 1000;

    applyPupilConstriction(next, ambientApplied, true, dtMs);

    const lightSide = String(
      AppStateRef.state.activeLightSide || "none",
    ).toLowerCase();
    const isLightActive = lightSide === "left" || lightSide === "right";
    const transferOrReboundActive =
      lightTransferState.active ||
      lightTransferState.reboundStartAt > 0 ||
      lightTransferState.settleStartAt > 0;
    const coverFluctActive = lightTransferState.coverPulseStartAt > 0;
    const isSettled = Math.abs(target - next) < 0.04;
    const isAmbientSettled = ["left", "right"].every((eyeType) => {
      const eyeAmbientState = pupilResponseState.ambientByEye[eyeType];
      return (
        Math.abs(
          (eyeAmbientState.target || 0) - (eyeAmbientState.current || 0),
        ) < 0.03
      );
    });

    if (
      !isLightActive &&
      !transferOrReboundActive &&
      !coverFluctActive &&
      isSettled &&
      isAmbientSettled
    ) {
      const ambientTargets = {
        left: pupilResponseState.ambientByEye.left.target,
        right: pupilResponseState.ambientByEye.right.target,
      };
      applyPupilConstriction(target, ambientTargets, false, dtMs);
      pupilResponseState.currentConstriction = target;
      pupilResponseState.rafId = null;
      return;
    }

    pupilResponseState.rafId = requestAnimationFrame(stepPupilResponse);
  }

  function ensurePupilResponseAnimation() {
    if (pupilResponseState.rafId !== null) return;
    pupilResponseState.lastTs = 0;
    pupilResponseState.rafId = requestAnimationFrame(stepPupilResponse);
  }

  function setLightState(side, options = {}) {
    const target = String(side || "none").toLowerCase();
    const current = String(
      AppStateRef.state.activeLightSide || "none",
    ).toLowerCase();
    const allowToggle = options.allowToggle !== false;
    let next = target === "left" || target === "right" ? target : "none";

    if (allowToggle && next !== "none" && next === current) {
      next = "none";
    }

    AppStateRef.state.activeLightSide = next;
    if (next === "left" || next === "right") {
      AppStateRef.state.lightPillSide = next;
    }

    if (
      (current === "left" || current === "right") &&
      (next === "left" || next === "right") &&
      current !== next
    ) {
      startLightTransfer(current, next);
    } else if (next === "none") {
      clearLightTransfer({ clearSettle: true });
    } else if (current === "none" && (next === "left" || next === "right")) {
      clearLightTransfer({ clearSettle: false });
      startSettlePhase(
        next,
        SWING_STABILISE_AMPLITUDE * 0.75,
        performance.now(),
      );
    } else if (
      lightTransferState.active &&
      next === lightTransferState.toSide
    ) {
      // Keep current transfer running while pointer events continue on same destination.
    } else {
      // Same-side updates should not reset settling dynamics.
      clearLightTransfer({ clearSettle: false });
    }

    refreshLightVisualState();
    refreshLightPupilResponse();
    if (!options.silent) OutputWriterRef.updateAllOutputs();
  }

  function setRapdValue(value, options = {}) {
    AppStateRef.state.rapdValue = clampNumber(value, -100, 100);
    const slider = document.getElementById("rapd-slider");
    if (
      slider &&
      String(slider.value) !== String(Math.round(AppStateRef.state.rapdValue))
    ) {
      slider.value = String(Math.round(AppStateRef.state.rapdValue));
    }
    refreshLightVisualState();
    refreshLightPupilResponse();
    if (!options.silent) OutputWriterRef.updateAllOutputs();
  }

  function setAmbientLevel(value, options = {}) {
    AppStateRef.state.ambientLevel = clampNumber(value, 0, 100);
    const toggle = document.getElementById("ambient-toggle");
    const shouldBeOn = AppStateRef.state.ambientLevel >= 50;
    if (toggle && toggle.checked !== shouldBeOn) {
      toggle.checked = shouldBeOn;
    }
    applyAmbientVisual();
    refreshLightPupilResponse();
    if (!options.silent) OutputWriterRef.updateAllOutputs();
  }

  globalObj.LightController = {
    setupLightPillControl,
    refreshLightVisualState,
    refreshLightPupilResponse,
    setLightState,
    setRapdValue,
    setAmbientLevel,
    triggerCoverPupilFluctuation,
    triggerCoverPupilFluctuationForEye,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
