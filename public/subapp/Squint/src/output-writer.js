/*
 * RE/LE output composition.
 */

(function attachOutputWriter(globalObj) {
  const AppStateRef = globalObj.AppState;

  function updateEyeOutput(eye, dx, dy) {
    const neutralThreshold = 3;
    const eyeType = eye.getAttribute("data-eye");
    let irisPosition = "";
    let ptosisOutput = "";
    let pupilOutput = "";
    let fadeOutput = "";

    const absDx = Math.abs(dx);
    let horizontalGrade = "";
    if (absDx > neutralThreshold && absDx <= 10) horizontalGrade = "small ";
    if (absDx > 10 && absDx <= 20) horizontalGrade = "medium ";
    if (absDx > 20) horizontalGrade = "large ";

    let horizontal = "";
    if (eyeType === "left") {
      if (dx > neutralThreshold) horizontal = `${horizontalGrade}in`;
      if (dx < -neutralThreshold) horizontal = `${horizontalGrade}out`;
    }
    if (eyeType === "right") {
      if (dx < -neutralThreshold) horizontal = `${horizontalGrade}in`;
      if (dx > neutralThreshold) horizontal = `${horizontalGrade}out`;
    }

    const absDy = Math.abs(dy);
    let verticalGrade = "";
    if (absDy > neutralThreshold && absDy <= 10) verticalGrade = "small ";
    if (absDy > 10 && absDy <= 20) verticalGrade = "med ";
    if (absDy > 20) verticalGrade = "large ";

    let vertical = "";
    if (dy < -neutralThreshold) vertical = `${verticalGrade}up`;
    if (dy > neutralThreshold) vertical = `${verticalGrade}down`;

    if (horizontal || vertical) {
      irisPosition =
        horizontal && vertical
          ? `${horizontal} and ${vertical}`
          : horizontal || vertical;
    }

    const lidSlider = document.querySelector(
      `.vertical-eye-slider[data-eye="${eyeType}"]`,
    );
    if (lidSlider) {
      const value = parseFloat(lidSlider.value);
      if (value > neutralThreshold && value <= 10)
        ptosisOutput = "small ptosis";
      if (value > 10 && value <= 20) ptosisOutput = "med ptosis";
      if (value > 20) ptosisOutput = "large ptosis";
    }

    const pupilSlider = document.querySelector(
      `.slider[data-eye="${eyeType}"]`,
    );
    if (pupilSlider) {
      const value = parseFloat(pupilSlider.value);
      const diff = value - AppStateRef.BASE_PUPIL_SIZE;
      const absDiff = Math.abs(diff);
      if (absDiff > 3 && absDiff <= 8)
        pupilOutput =
          diff < 0 ? "slightly smaller pupil" : "slightly larger pupil";
      if (absDiff > 8 && absDiff <= 15)
        pupilOutput = diff < 0 ? "smaller pupil" : "larger pupil";
      if (absDiff > 15)
        pupilOutput = diff < 0 ? "pinhole pupil" : "dilated pupil";
    }

    const iris = eye.querySelector(".iris");
    if (iris?.classList.contains("faded")) fadeOutput = "faded";

    const outputs = [];
    if (irisPosition) outputs.push(irisPosition);
    if (ptosisOutput) outputs.push(ptosisOutput);
    if (pupilOutput) outputs.push(pupilOutput);
    if (fadeOutput) outputs.push(fadeOutput);
    if (AppStateRef.state.activeDiagnosticHints[eyeType]) {
      outputs.push(`hint:${AppStateRef.state.activeDiagnosticHints[eyeType]}`);
    }
    if (eye.classList.contains("is-covered")) {
      outputs.push("COVERED");
    }

    const lightSide = String(
      AppStateRef.state.activeLightSide || "none",
    ).toLowerCase();
    if (lightSide === eyeType) {
      outputs.push(`LIGHT:${eyeType === "left" ? "RE" : "LE"}`);
    }

    const rapd = Number(AppStateRef.state.rapdValue || 0);
    // Patient-facing mapping:
    // DOM left eye writes RE line, DOM right eye writes LE line.
    if (rapd > 1 && eyeType === "left") outputs.push("RAPD:RE+");
    if (rapd < -1 && eyeType === "right") outputs.push("RAPD:LE+");

    if (document.getElementById("toggle-sudden")?.checked)
      outputs.push("SUDDEN");
    if (document.getElementById("toggle-pain")?.checked) outputs.push("PAIN");
    if (document.getElementById("toggle-trauma")?.checked)
      outputs.push("TRAUMA");
    if (document.getElementById("toggle-fatigable")?.checked)
      outputs.push("FATIGABLE");
    if (document.getElementById("toggle-diplopia")?.checked)
      outputs.push("DIPLOPIA");

    const headTilt = (
      document.getElementById("head-tilt")?.value || "none"
    ).toLowerCase();
    if (headTilt === "right" || headTilt === "left") {
      outputs.push(`HEADTILT:${headTilt.toUpperCase()}`);
    }

    const cycloControlId = eyeType === "left" ? "cyclo-re" : "cyclo-le";
    const cyclo = (
      document.getElementById(cycloControlId)?.value || "none"
    ).toLowerCase();
    let cycloLabel = "";
    if (cyclo === "in" || cyclo === "out") {
      cycloLabel = cyclo.toUpperCase();
    } else if (cyclo === "up") {
      cycloLabel = "IN";
    } else if (cyclo === "down") {
      cycloLabel = "OUT";
    }
    if (cycloLabel) {
      outputs.push(`CYCLO:${cycloLabel}`);
    }

    if (document.getElementById("toggle-nystagmus")?.checked) {
      const nystDirection = (
        document.getElementById("nyst-direction")?.value || "horizontal"
      ).toLowerCase();
      const nystWave = (
        document.getElementById("nyst-wave")?.value || "jerk"
      ).toLowerCase();
      const nystRate = (
        document.getElementById("nyst-rate")?.value || "slow"
      ).toLowerCase();
      outputs.push(`NYST:${nystDirection}:${nystWave}:${nystRate}`);
    }

    const finalOutput = outputs.length ? outputs.join(" | ") : "normal";
    const reOutput = document.getElementById("right-output");
    const leOutput = document.getElementById("left-output");

    // Patient-facing mapping: left DOM eye -> RE display, right DOM eye -> LE display.
    if (eyeType === "left" && reOutput) {
      reOutput.textContent = `RE: ${finalOutput}`;
    }
    if (eyeType === "right" && leOutput) {
      leOutput.textContent = `LE: ${finalOutput}`;
    }
  }

  function updateOutputForEye(eye) {
    const iris = eye?.querySelector(".iris");
    if (!eye || !iris) return;

    const dx =
      (iris.manualOffset?.x || 0) +
      (iris.presetOffset?.x || 0) +
      (iris.gazeOffset?.x || 0) +
      (iris.coverOffset?.x || 0);
    const dy =
      (iris.manualOffset?.y || 0) +
      (iris.presetOffset?.y || 0) +
      (iris.gazeOffset?.y || 0) +
      (iris.coverOffset?.y || 0);
    updateEyeOutput(eye, dx, dy);
  }

  function updateAllOutputs() {
    document.querySelectorAll(".eye").forEach((eye) => updateOutputForEye(eye));
    document.dispatchEvent(new CustomEvent("squint:outputs-updated"));
  }

  globalObj.OutputWriter = {
    updateOutputForEye,
    updateAllOutputs,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
