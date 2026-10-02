/*
 * Recurrent eye animation/effects engine.
 */

(function attachEyeEffectsController(globalObj) {
  const AppStateRef = globalObj.AppState;

  function clamp(value, min, max) {
    return Math.min(Math.max(Number(value) || 0, min), max);
  }

  function startCycloJitterEngine() {
    let phase = 0;
    setInterval(() => {
      phase += 0.11;
      document.querySelectorAll(".iris").forEach((iris, index) => {
        const baseDeg = Number(iris.cycloBaseDeg || 0);
        if (!baseDeg) {
          iris.style.setProperty("--cyclo-angle", "0deg");
          return;
        }
        // Subtle torsional wobble around selected intorsion/extorsion.
        const jitter = 1.25 * Math.sin(phase * Math.PI * 2 + index * 0.65);
        const blended = baseDeg + jitter;
        iris.style.setProperty("--cyclo-angle", `${blended.toFixed(2)}deg`);
      });
    }, 80);
  }

  function clearNystagmusOffset(updateIrisTransform) {
    document.querySelectorAll(".iris").forEach((iris) => {
      iris.nystagmusOffset = { x: 0, y: 0 };
      updateIrisTransform(iris);
    });
  }

  function startNystagmusEngine(updateIrisTransform) {
    let phase = 0;
    setInterval(() => {
      const presetKey = String(
        AppStateRef.state.activePresetKey || "",
      ).toLowerCase();
      const isInoPreset = presetKey === "ino-like pattern";
      const enabled = document.getElementById("toggle-nystagmus")?.checked;
      if (!enabled && !isInoPreset) {
        clearNystagmusOffset(updateIrisTransform);
        return;
      }

      const direction = String(
        document.getElementById("nyst-direction")?.value || "horizontal",
      ).toLowerCase();
      const wave = String(
        document.getElementById("nyst-wave")?.value || "jerk",
      ).toLowerCase();
      const rate = String(
        document.getElementById("nyst-rate")?.value || "slow",
      ).toLowerCase();
      const isLatentPreset = presetKey === "latent nystagmus-like";
      const isGazeEvokedPreset = presetKey === "gaze-evoked nystagmus-like";
      const coverEye = String(AppStateRef.state.coverEye || "none");
      const coverActive = coverEye !== "none";
      const gazeX = clamp(AppStateRef.state?.gazeVector?.x, -1, 1);
      const gazeY = clamp(AppStateRef.state?.gazeVector?.y, -1, 1);
      const gazeEccentricity = Math.min(
        1,
        Math.sqrt(gazeX * gazeX + gazeY * gazeY),
      );
      const gazeAxisDemand =
        direction === "vertical"
          ? Math.abs(gazeY)
          : direction === "mixed"
            ? gazeEccentricity
            : Math.max(Math.abs(gazeX), Math.max(-gazeY, 0));

      if (isLatentPreset && !coverActive) {
        AppStateRef.state.nystagmusFastPhase = "none";
        clearNystagmusOffset(updateIrisTransform);
        return;
      }
      if (isGazeEvokedPreset && gazeAxisDemand < 0.08) {
        AppStateRef.state.nystagmusFastPhase = "none";
        clearNystagmusOffset(updateIrisTransform);
        return;
      }
      if (isInoPreset && gazeX >= -0.12) {
        AppStateRef.state.nystagmusFastPhase = "none";
        clearNystagmusOffset(updateIrisTransform);
        return;
      }

      const ampBase = rate === "fast" ? 4.2 : 2.8;
      // Most nystagmus increases towards eccentric gaze.
      // Gaze-evoked pattern has a stronger primary null zone.
      let ampGain = 0.82 + 0.58 * gazeEccentricity;
      if (isGazeEvokedPreset) {
        ampGain = 0.02 + 1.58 * gazeAxisDemand;
      }
      let amp = ampBase * ampGain;
      if (isLatentPreset) amp *= 1.45;
      if (isInoPreset) amp = 3.6 * Math.abs(gazeX);
      const ampMixedY = amp * 0.58;
      const step = rate === "fast" ? 0.16 : 0.09;
      phase += step;

      let valueX;
      let valueY = 0;
      if (wave === "pendular") {
        valueX = amp * Math.sin(phase * Math.PI * 2);
        if (direction === "mixed") {
          valueY = ampMixedY * Math.sin(phase * Math.PI * 2 + Math.PI / 2);
        }
      } else {
        const p = phase % 1;
        valueX =
          p < 0.75
            ? amp - (p / 0.75) * (2 * amp)
            : -amp + ((p - 0.75) / 0.25) * (2 * amp);
        if (direction === "mixed") {
          valueY = valueX >= 0 ? ampMixedY : -ampMixedY;
        }
      }

      let directionSign = 1;
      if (isLatentPreset) {
        directionSign = coverEye === "left" ? 1 : -1;
        AppStateRef.state.nystagmusFastPhase =
          coverEye === "left" ? "towards-le" : "towards-re";
      } else if (isGazeEvokedPreset) {
        directionSign = Math.abs(gazeX) >= 0.08 ? Math.sign(gazeX) : -1;
        AppStateRef.state.nystagmusFastPhase =
          Math.abs(gazeX) >= 0.08
            ? gazeX > 0
              ? "with-right-gaze"
              : "with-left-gaze"
            : "with-upgaze";
      } else if (isInoPreset) {
        directionSign = -1;
        AppStateRef.state.nystagmusFastPhase = "fellow-abducting-eye";
      }
      valueX *= directionSign;
      valueY *= directionSign;

      document.querySelectorAll(".iris").forEach((iris) => {
        const eyeType = String(
          iris.closest(".eye")?.dataset.eye || "",
        ).toLowerCase();
        if (isInoPreset && eyeType !== "left") {
          iris.nystagmusOffset = { x: 0, y: 0 };
          updateIrisTransform(iris);
          return;
        }
        if (direction === "vertical") {
          iris.nystagmusOffset = { x: 0, y: valueX };
        } else if (direction === "mixed") {
          iris.nystagmusOffset = { x: valueX, y: valueY };
        } else {
          iris.nystagmusOffset = { x: valueX, y: 0 };
        }
        updateIrisTransform(iris);
      });
    }, 70);
  }

  function startConditionVariationEngine(updateIrisTransform) {
    let phase = 0;
    let wasActive = false;
    setInterval(() => {
      const active =
        String(AppStateRef.state.activePresetKey || "").toLowerCase() ===
          "myasthenic pattern" &&
        Boolean(document.getElementById("toggle-fatigable")?.checked);
      const eye = document.querySelector('.eye[data-eye="right"]');
      const iris = eye?.querySelector(".iris");
      const upperLid = eye?.querySelector(".upper-eyelid");
      const slider = document.querySelector(
        '.vertical-eye-slider[data-eye="right"]',
      );
      if (!iris || !upperLid || !slider) return;

      if (!active) {
        if (wasActive) {
          iris.conditionOffset = { x: 0, y: 0 };
          upperLid.style.height = `${parseFloat(slider.value || 0) * 1.5}px`;
          updateIrisTransform(iris);
        }
        wasActive = false;
        return;
      }

      wasActive = true;
      phase += 0.19;
      const slow = (Math.sin(phase) + 1) / 2;
      const irregular = Math.sin(phase * 2.7 + 0.8);
      iris.conditionOffset = {
        x: parseFloat((irregular * 2.4).toFixed(2)),
        y: parseFloat((slow * 4.2 + irregular * 0.8).toFixed(2)),
      };
      const baseLidHeight = parseFloat(slider.value || 0) * 1.5;
      upperLid.style.height = `${(baseLidHeight + 2 + slow * 7).toFixed(2)}px`;
      updateIrisTransform(iris);
    }, 120);
  }

  function blinkEyes() {
    document.querySelectorAll(".eye").forEach((eye) => {
      const upper = eye.querySelector(".upper-eyelid");
      const lower = eye.querySelector(".lower-eyelid");
      const originalUpper = upper?.style.height || "0px";
      const originalLower = lower?.style.height || "0px";

      if (upper) upper.style.height = `${eye.clientHeight * 0.7}px`;
      if (lower) lower.style.height = `${eye.clientHeight * 0.3}px`;

      setTimeout(() => {
        if (upper) upper.style.height = originalUpper;
        if (lower) lower.style.height = originalLower;
      }, 100);
    });
  }

  function startMicroSaccades(updateIrisTransform) {
    document.querySelectorAll(".iris").forEach((iris) => {
      iris.microOffset = { x: 0, y: 0 };
      iris.presetOffset = iris.presetOffset || { x: 0, y: 0 };
      iris.gazeOffset = iris.gazeOffset || { x: 0, y: 0 };
      iris.coverOffset = iris.coverOffset || { x: 0, y: 0 };
      iris.nystagmusOffset = { x: 0, y: 0 };
      iris.cycloBaseDeg = 0;
    });

    setInterval(() => {
      const offsetX = parseFloat((Math.random() * 2 - 1).toFixed(2));
      const offsetY = parseFloat((Math.random() * 2 - 1).toFixed(2));

      document.querySelectorAll(".iris").forEach((iris) => {
        if (!iris.isDragging && !iris.conditionApplied) {
          iris.microOffset = { x: offsetX, y: offsetY };
          updateIrisTransform(iris);
        }
      });

      setTimeout(() => {
        document.querySelectorAll(".iris").forEach((iris) => {
          if (!iris.isDragging && !iris.conditionApplied) {
            iris.microOffset = { x: 0, y: 0 };
            updateIrisTransform(iris);
          }
        });
      }, 100);
    }, 3000);
  }

  function startBackgroundJitter(updateIrisTransform) {
    document.querySelectorAll(".iris").forEach((iris) => {
      iris.backgroundOffset = { x: 0, y: 0 };
    });

    setInterval(() => {
      document.querySelectorAll(".iris").forEach((iris) => {
        if (!iris.isDragging && !iris.conditionApplied) {
          iris.backgroundOffset = {
            x: parseFloat((Math.random() * 0.4 - 0.2).toFixed(2)),
            y: parseFloat((Math.random() * 0.4 - 0.2).toFixed(2)),
          };
          updateIrisTransform(iris);
        }
      });
    }, 200);
  }

  globalObj.EyeEffectsController = {
    startCycloJitterEngine,
    startNystagmusEngine,
    startConditionVariationEngine,
    blinkEyes,
    startMicroSaccades,
    startBackgroundJitter,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
