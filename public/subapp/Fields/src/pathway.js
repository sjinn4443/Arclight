let pathwayInitialised = false;

function normaliseText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function getSideFromText(text) {
  if (text.includes("right")) return "right";
  if (text.includes("left")) return "left";
  return "both";
}

function getJunctionalOpticNerveSegments(conditionText) {
  const targets = [];
  if (
    conditionText.includes("right centre") ||
    conditionText.includes("right center")
  ) {
    targets.push("part-nerve-right");
  }
  if (
    conditionText.includes("left centre") ||
    conditionText.includes("left center")
  ) {
    targets.push("part-nerve-left");
  }
  return targets.length ? targets : ["part-nerve-right", "part-nerve-left"];
}

function dedupeIds(ids) {
  return [...new Set(ids)];
}

function getPreChiasmalSegments(side) {
  if (side === "right") {
    return ["part-retina-right", "part-nerve-right"];
  }
  if (side === "left") {
    return ["part-retina-left", "part-nerve-left"];
  }
  return [
    "part-retina-right",
    "part-retina-left",
    "part-nerve-right",
    "part-nerve-left",
  ];
}

function getRetinaSegments(side) {
  if (side === "right") return ["part-retina-right"];
  if (side === "left") return ["part-retina-left"];
  return ["part-retina-right", "part-retina-left"];
}

function getOpticNerveSegments(side) {
  if (side === "right") return ["part-nerve-right"];
  if (side === "left") return ["part-nerve-left"];
  return ["part-nerve-right", "part-nerve-left"];
}

function getLateralChiasmSegments() {
  return ["part-chiasm-lateral-right", "part-chiasm-lateral-left"];
}

function getPostChiasmalSegments(side, mode = "hemi") {
  function segmentsFor(singleSide) {
    const isLeft = singleSide === "left";
    const tract = isLeft ? "part-tract-left" : "part-tract-right";
    const lgn = isLeft ? "part-lgn-left" : "part-lgn-right";
    const radA = isLeft ? "part-radiation-left-a" : "part-radiation-right-a";
    const radB = isLeft ? "part-radiation-left-b" : "part-radiation-right-b";
    const occ = isLeft ? "part-occipital-left" : "part-occipital-right";
    const v1 = isLeft ? "part-v1-left" : "part-v1-right";
    const fissure = isLeft
      ? "part-calcarine-fissure-left"
      : "part-calcarine-fissure-right";
    const upper = isLeft
      ? "part-calcarine-upper-left"
      : "part-calcarine-upper-right";
    const lower = isLeft
      ? "part-calcarine-lower-left"
      : "part-calcarine-lower-right";
    const pole = isLeft
      ? "part-occipital-pole-left"
      : "part-occipital-pole-right";

    if (mode === "superior") {
      // Superior field defect: temporal/Meyer pathway + lower bank representation.
      return [radB, occ, v1, lower];
    }
    if (mode === "inferior") {
      // Inferior field defect: parietal pathway + upper bank representation.
      return [radA, occ, v1, upper];
    }
    return [tract, lgn, radA, radB, occ, v1, fissure, upper, lower, pole];
  }

  if (side === "left") return segmentsFor("left");
  if (side === "right") return segmentsFor("right");
  return [...segmentsFor("left"), ...segmentsFor("right")];
}

function getPosteriorPostChiasmalSegments(side) {
  function segmentsFor(singleSide) {
    const isLeft = singleSide === "left";
    const radA = isLeft ? "part-radiation-left-a" : "part-radiation-right-a";
    const radB = isLeft ? "part-radiation-left-b" : "part-radiation-right-b";
    const occ = isLeft ? "part-occipital-left" : "part-occipital-right";
    const v1 = isLeft ? "part-v1-left" : "part-v1-right";
    const fissure = isLeft
      ? "part-calcarine-fissure-left"
      : "part-calcarine-fissure-right";
    const upper = isLeft
      ? "part-calcarine-upper-left"
      : "part-calcarine-upper-right";
    const lower = isLeft
      ? "part-calcarine-lower-left"
      : "part-calcarine-lower-right";
    const pole = isLeft
      ? "part-occipital-pole-left"
      : "part-occipital-pole-right";
    return [radA, radB, occ, v1, fissure, upper, lower, pole];
  }

  if (side === "left") return segmentsFor("left");
  if (side === "right") return segmentsFor("right");
  return [...segmentsFor("left"), ...segmentsFor("right")];
}

function getPostChiasmalSideFromCondition(conditionText) {
  // Right homonymous visual field loss implies left post-chiasmal pathway lesion.
  if (
    conditionText.includes("right homonymous") ||
    conditionText.includes("right superior quadrantanopia") ||
    conditionText.includes("right inferior quadrantanopia")
  ) {
    return "left";
  }
  // Left homonymous visual field loss implies right post-chiasmal pathway lesion.
  if (
    conditionText.includes("left homonymous") ||
    conditionText.includes("left superior quadrantanopia") ||
    conditionText.includes("left inferior quadrantanopia")
  ) {
    return "right";
  }
  return "both";
}

function isMonocularQuadrantanopiaLabel(text) {
  return text.includes("monocular") && text.includes("quadrantanopia");
}

function rapdSupportsTractForPathway(conditionText, rapdState) {
  if (rapdState !== "left" && rapdState !== "right") return false;
  if (conditionText.includes("left homonymous")) return rapdState === "left";
  if (conditionText.includes("right homonymous")) return rapdState === "right";
  return false;
}

function getPathwayTargetIds(
  conditionHtml,
  lesionHtml,
  rapdState = "none",
  sourceAssessment = null,
) {
  const conditionText = normaliseText(conditionHtml);
  const lesionText = normaliseText(lesionHtml);
  const hasRapdOpticNerveSupport = lesionText.includes(
    "rapd supports optic nerve involvement",
  );
  const hasRapdTractSupport =
    lesionText.includes("rapd supports tract localisation") ||
    lesionText.includes("rapd supports tract localization") ||
    lesionText.includes("optic tract involvement") ||
    rapdSupportsTractForPathway(conditionText, rapdState);
  const hasPostChiasmalPhrase = lesionText.includes("post-chiasmal");
  const mentionsChiasmLesion =
    (!hasPostChiasmalPhrase && lesionText.includes("chiasmal lesion")) ||
    lesionText.includes("chiasmal region") ||
    lesionText.includes("optic nerve-chiasm junction") ||
    lesionText.includes("anterior chiasmal region") ||
    lesionText.includes("compressing crossing nasal fibres");

  if (!conditionText || conditionText.includes("full fields of vision")) {
    return [];
  }

  if (sourceAssessment && typeof sourceAssessment === "object") {
    const category = sourceAssessment.category || "";
    const side =
      sourceAssessment.side || getSideFromText(conditionText || lesionText);

    if (category === "retina_likely") {
      return dedupeIds(getRetinaSegments(side));
    }
    if (category === "optic_nerve_likely") {
      return dedupeIds(getOpticNerveSegments(side));
    }
    if (category === "anterior_mixed") {
      return dedupeIds(getPreChiasmalSegments(side));
    }
  }

  if (hasRapdOpticNerveSupport) {
    const side = getSideFromText(conditionText || lesionText);
    return getOpticNerveSegments(side);
  }

  // Incongruous homonymous patterns: prioritise optic tract only.
  if (
    conditionText.includes("homonymous hemianopia") &&
    conditionText.includes("incongruous")
  ) {
    const side = getPostChiasmalSideFromCondition(conditionText);
    if (side === "left") return ["part-tract-left"];
    if (side === "right") return ["part-tract-right"];
    return ["part-tract-left", "part-tract-right"];
  }

  // Congruous homonymous patterns: prioritise posterior radiations/occipital pathway.
  if (conditionText.includes("homonymous hemianopia")) {
    const side = getPostChiasmalSideFromCondition(conditionText);
    if (hasRapdTractSupport) {
      if (side === "left") return ["part-tract-left"];
      if (side === "right") return ["part-tract-right"];
      return ["part-tract-left", "part-tract-right"];
    }
    return dedupeIds(getPosteriorPostChiasmalSegments(side));
  }

  if (conditionText.includes("mixed/unclassified")) {
    return [
      "part-nerve-right",
      "part-nerve-left",
      "part-chiasm-a",
      "part-chiasm-b",
      "part-tract-left",
      "part-tract-right",
      "part-lgn-left",
      "part-lgn-right",
    ];
  }

  if (conditionText.includes("binocular blindness")) {
    return [
      "part-retina-right",
      "part-retina-left",
      "part-nerve-right",
      "part-nerve-left",
      "part-v1-left",
      "part-v1-right",
    ];
  }

  if (conditionText.includes("junctional scotoma")) {
    return dedupeIds([
      ...getJunctionalOpticNerveSegments(conditionText),
      "part-chiasm-a",
      "part-chiasm-b",
      "part-chiasm",
    ]);
  }

  if (conditionText.includes("bitemporal")) {
    return ["part-chiasm-a", "part-chiasm-b", "part-chiasm"];
  }

  if (conditionText.includes("binasal")) {
    return [
      "part-nerve-right",
      "part-nerve-left",
      ...getLateralChiasmSegments(),
    ];
  }

  if (mentionsChiasmLesion) {
    return ["part-chiasm-a", "part-chiasm-b", "part-chiasm"];
  }

  const postChiasmalByCondition =
    conditionText.includes("homonymous hemianopia") ||
    (conditionText.includes("quadrantanopia") &&
      !isMonocularQuadrantanopiaLabel(conditionText));
  const postChiasmalByLesion =
    lesionText.includes("post-chiasmal") ||
    lesionText.includes("optic tract") ||
    lesionText.includes("lgn") ||
    lesionText.includes("radiations") ||
    lesionText.includes("occipital") ||
    lesionText.includes("meyer") ||
    lesionText.includes("parietal") ||
    lesionText.includes("calcarine");

  if (postChiasmalByCondition || postChiasmalByLesion) {
    const side = postChiasmalByCondition
      ? getPostChiasmalSideFromCondition(conditionText)
      : getSideFromText(conditionText || lesionText);

    let mode = "hemi";
    if (
      conditionText.includes("superior quadrantanopia") ||
      lesionText.includes("meyer")
    ) {
      mode = "superior";
    } else if (
      conditionText.includes("inferior quadrantanopia") ||
      lesionText.includes("parietal")
    ) {
      mode = "inferior";
    }

    return dedupeIds(getPostChiasmalSegments(side, mode));
  }

  const preChiasmalByCondition =
    conditionText.includes("monocular blind eye") ||
    conditionText.includes("monocular central scotoma") ||
    conditionText.includes("monocular temporal hemianopia") ||
    conditionText.includes("monocular nasal hemianopia") ||
    conditionText.includes("cecocentral-like defect") ||
    conditionText.includes("glaucoma-like") ||
    conditionText.includes("altitudinal") ||
    conditionText.includes("tunnel vision") ||
    conditionText.includes("monocular partial") ||
    conditionText.includes("monocular large defect") ||
    isMonocularQuadrantanopiaLabel(conditionText);
  const preChiasmalByLesion =
    lesionText.includes("anterior to the chiasm") ||
    lesionText.includes("retina or optic nerve") ||
    lesionText.includes("papillomacular") ||
    lesionText.includes("macular");

  if (preChiasmalByCondition || preChiasmalByLesion) {
    const side = conditionText.includes("mixed altitudinal")
      ? "both"
      : getSideFromText(conditionText || lesionText);
    const targets = getPreChiasmalSegments(side);
    return dedupeIds(targets);
  }

  // If uncertain but abnormal, show central pathway as broad suggestion.
  return [
    "part-chiasm-a",
    "part-chiasm-b",
    "part-chiasm",
    "part-tract-left",
    "part-tract-right",
  ];
}

const PATHWAY_LEGEND_DEFAULTS = Object.freeze({
  retina: "Retina",
  nerve: "Nerve",
  chiasm: "Chiasm",
  tract: "Tract",
  lgn: "LGN",
  radiations: "Radiations",
  cortex: "V1",
});

function getPathwayLegendState(targetIds) {
  const ids = Array.isArray(targetIds) ? targetIds : [];
  const targetSet = new Set(ids);
  const labels = { ...PATHWAY_LEGEND_DEFAULTS };
  const activeKeys = [];
  const activate = (key, label) => {
    labels[key] = label;
    activeKeys.push(key);
  };

  const rightRetina = targetSet.has("part-retina-right");
  const leftRetina = targetSet.has("part-retina-left");
  if (rightRetina || leftRetina) {
    activate(
      "retina",
      rightRetina && leftRetina
        ? "Both Retina"
        : rightRetina
          ? "RE Retina"
          : "LE Retina",
    );
  }

  const rightNerve = targetSet.has("part-nerve-right");
  const leftNerve = targetSet.has("part-nerve-left");
  if (rightNerve || leftNerve) {
    activate(
      "nerve",
      rightNerve && leftNerve
        ? "Both Nerves"
        : rightNerve
          ? "RE Nerve"
          : "LE Nerve",
    );
  }

  const chiasmIds = ids.filter((id) => id.includes("chiasm"));
  if (chiasmIds.length) {
    const lateralOnly = chiasmIds.every((id) => id.includes("lateral"));
    activate("chiasm", lateralOnly ? "Lateral chiasm" : "Chiasm");
  }

  const leftTract = targetSet.has("part-tract-left");
  const rightTract = targetSet.has("part-tract-right");
  if (leftTract || rightTract) {
    activate(
      "tract",
      leftTract && rightTract
        ? "Both Tracts"
        : leftTract
          ? "L Tract"
          : "R Tract",
    );
  }

  const leftLgn = targetSet.has("part-lgn-left");
  const rightLgn = targetSet.has("part-lgn-right");
  if (leftLgn || rightLgn) {
    activate(
      "lgn",
      leftLgn && rightLgn ? "Both LGN" : leftLgn ? "L LGN" : "R LGN",
    );
  }

  const leftRadiationA = targetSet.has("part-radiation-left-a");
  const leftRadiationB = targetSet.has("part-radiation-left-b");
  const rightRadiationA = targetSet.has("part-radiation-right-a");
  const rightRadiationB = targetSet.has("part-radiation-right-b");
  const leftRadiations = leftRadiationA || leftRadiationB;
  const rightRadiations = rightRadiationA || rightRadiationB;
  if (leftRadiations || rightRadiations) {
    let radiationLabel = "Both Radiations";
    if (leftRadiations && !rightRadiations) {
      radiationLabel =
        leftRadiationA && leftRadiationB
          ? "L Radiations"
          : leftRadiationB
            ? "L Meyer"
            : "L Parietal";
    } else if (rightRadiations && !leftRadiations) {
      radiationLabel =
        rightRadiationA && rightRadiationB
          ? "R Radiations"
          : rightRadiationB
            ? "R Meyer"
            : "R Parietal";
    }
    activate("radiations", radiationLabel);
  }

  const leftCortex = ids.some(
    (id) =>
      id === "part-occipital-left" ||
      id === "part-v1-left" ||
      (id.endsWith("-left") &&
        (id.includes("calcarine") || id.includes("occipital-pole"))),
  );
  const rightCortex = ids.some(
    (id) =>
      id === "part-occipital-right" ||
      id === "part-v1-right" ||
      (id.endsWith("-right") &&
        (id.includes("calcarine") || id.includes("occipital-pole"))),
  );
  if (leftCortex || rightCortex) {
    let cortexLabel = "Both V1";
    if (leftCortex && !rightCortex) {
      const upper = targetSet.has("part-calcarine-upper-left");
      const lower = targetSet.has("part-calcarine-lower-left");
      cortexLabel =
        upper && !lower
          ? "L upper V1"
          : lower && !upper
            ? "L lower V1"
            : "L V1";
    } else if (rightCortex && !leftCortex) {
      const upper = targetSet.has("part-calcarine-upper-right");
      const lower = targetSet.has("part-calcarine-lower-right");
      cortexLabel =
        upper && !lower
          ? "R upper V1"
          : lower && !upper
            ? "R lower V1"
            : "R V1";
    }
    activate("cortex", cortexLabel);
  }

  return { labels, activeKeys };
}

function updatePathwayLegend(targetIds) {
  const legendRoot = document.getElementById("pathway-structures");
  if (!legendRoot) return;

  const { labels, activeKeys } = getPathwayLegendState(targetIds);
  const segments = legendRoot.querySelectorAll(".pathway-segment");
  segments.forEach((segment) => {
    const key = segment.dataset.legend;
    segment.textContent = labels[key] || segment.textContent;
    segment.classList.remove("pathway-segment-active");
  });

  activeKeys.forEach((key) => {
    const segment = legendRoot.querySelector(`[data-legend="${key}"]`);
    if (segment) {
      segment.classList.add("pathway-segment-active");
    }
  });
}

function initPathwayDiagram() {
  if (pathwayInitialised) return;
  pathwayInitialised = true;
}

function updatePathwayDiagram(
  conditionHtml,
  lesionHtml,
  rapdState = "none",
  sourceAssessment = null,
) {
  initPathwayDiagram();

  const mainPathwaySvg = document.getElementById("pathway-svg");
  if (!mainPathwaySvg) return;

  const allParts = mainPathwaySvg.querySelectorAll(".pathway-part");
  if (!allParts.length) return;

  allParts.forEach((part) => {
    part.classList.remove("pathway-active");
    part.classList.remove("pathway-flash");
  });

  const targets = getPathwayTargetIds(
    conditionHtml,
    lesionHtml,
    rapdState,
    sourceAssessment,
  );
  targets.forEach((id) => {
    const el = mainPathwaySvg.querySelector(`[id="${id}"]`);
    if (!el) return;
    el.classList.add("pathway-active");
    void el.offsetWidth;
    el.classList.add("pathway-flash");
  });
  updatePathwayLegend(targets);
}
