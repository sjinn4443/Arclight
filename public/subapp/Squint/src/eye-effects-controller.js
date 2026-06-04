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
      const enabled = document.getElementById("toggle-nystagmus")?.checked;
      if (!enabled) {
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
      const isLatentPreset =
        String(AppStateRef.state.activePresetKey || "").toLowerCase() ===
        "latent nystagmus-like";
      const isGazeEvokedPreset =
        String(AppStateRef.state.activePresetKey || "").toLowerCase() ===
        "gaze-evoked nystagmus-like";
      const coverActive =
        String(AppStateRef.state.coverEye || "none") !== "none";
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
            : Math.abs(gazeX);

      const ampBase = rate === "fast" ? 4.2 : 2.8;
      // Most nystagmus increases towards eccentric gaze.
      // Gaze-evoked pattern has a stronger primary null zone.
      let ampGain = 0.82 + 0.58 * gazeEccentricity;
      if (isGazeEvokedPreset) {
        ampGain = 0.18 + 1.42 * gazeAxisDemand;
      }
      let amp = ampBase * ampGain;
      if (isLatentPreset && coverActive) amp *= 1.45;
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
            ? -amp + (p / 0.75) * (2 * amp)
            : amp - ((p - 0.75) / 0.25) * (2 * amp);
        if (direction === "mixed") {
          valueY = valueX >= 0 ? ampMixedY : -ampMixedY;
        }
      }

      document.querySelectorAll(".iris").forEach((iris) => {
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
    blinkEyes,
    startMicroSaccades,
    startBackgroundJitter,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
