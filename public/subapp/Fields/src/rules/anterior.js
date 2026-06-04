// Anterior / monocular-oriented rule families.

function checkBinocularTotalLoss(right, left) {
  const sumR = scoreAllPoints(right);
  const sumL = scoreAllPoints(left);
  const allLostR =
    codeToScore(right.st) >= 1 &&
    codeToScore(right.sn) >= 1 &&
    codeToScore(right.it) >= 1 &&
    codeToScore(right.in) >= 1 &&
    codeToScore(right.c) >= 1;
  const allLostL =
    codeToScore(left.st) >= 1 &&
    codeToScore(left.sn) >= 1 &&
    codeToScore(left.it) >= 1 &&
    codeToScore(left.in) >= 1 &&
    codeToScore(left.c) >= 1;
  if (!allLostR || !allLostL) return null;

  if (sumR === 5 && sumL === 5)
    return "<em>Possible</em> <strong>Binocular Blindness</strong>";
  if (sumR === 10 && sumL === 10)
    return "<em>Definite</em> <strong>Binocular Blindness</strong>";
  return "<em>Probable</em> <strong>Binocular Blindness</strong>";
}

/********************************************************
 * 1) Monocular Blind Eye
 ********************************************************/
function checkMonocularTotalLoss(right, left) {
  const rightAllLost =
    codeToScore(right.st) >= 1 &&
    codeToScore(right.sn) >= 1 &&
    codeToScore(right.it) >= 1 &&
    codeToScore(right.in) >= 1 &&
    codeToScore(right.c) >= 1;
  const leftAllLost =
    codeToScore(left.st) >= 1 &&
    codeToScore(left.sn) >= 1 &&
    codeToScore(left.it) >= 1 &&
    codeToScore(left.in) >= 1 &&
    codeToScore(left.c) >= 1;

  if (rightAllLost && !leftAllLost) {
    const s = scoreAllPoints(right);
    const lvl = classify5to10(s);
    return `<em>${lvl}</em> <strong>Right Monocular Blind Eye</strong>`;
  }
  if (leftAllLost && !rightAllLost) {
    const s = scoreAllPoints(left);
    const lvl = classify5to10(s);
    return `<em>${lvl}</em> <strong>Left Monocular Blind Eye</strong>`;
  }
  return null;
}

/********************************************************
 * 2) Monocular Central Scotoma
 ********************************************************/
function checkMonocularCentralScotoma(right, left) {
  function classifyCentre(val) {
    if (val === 1) return "Possible";
    if (val === 2) return "Definite";
    return null;
  }

  function isPureCentral(e) {
    return (
      codeToScore(e.c) >= 1 &&
      e.st === "R" &&
      e.sn === "R" &&
      e.it === "R" &&
      e.in === "R"
    );
  }

  const rightPure = isPureCentral(right) && isEyeNormal(left);
  const leftPure = isPureCentral(left) && isEyeNormal(right);
  if (rightPure && leftPure) return null; // Bilateral central handled elsewhere

  if (rightPure) {
    const cVal = codeToScore(right.c);
    const lvl = classifyCentre(cVal);
    if (!lvl) return null;
    return `<em>${lvl}</em> <strong>Right Monocular Central Scotoma</strong>`;
  }

  if (leftPure) {
    const cVal = codeToScore(left.c);
    const lvl = classifyCentre(cVal);
    if (!lvl) return null;
    return `<em>${lvl}</em> <strong>Left Monocular Central Scotoma</strong>`;
  }

  return null;
}

/********************************************************
 * 2b) Monocular Temporal Hemianopia
 ********************************************************/
function checkMonocularTemporalHemianopia(right, left) {
  function classifyEye(e) {
    const st = codeToScore(e.st);
    const sn = codeToScore(e.sn);
    const it = codeToScore(e.it);
    const inn = codeToScore(e.in);

    // Central point is treated as a qualifier elsewhere; side quadrants define family.
    if (sn !== 0 || inn !== 0) return null;
    if (st >= 1 && it >= 1) return classify2to4(st + it);
    return null;
  }

  const rLevel = classifyEye(right);
  const lLevel = classifyEye(left);

  if (rLevel && !lLevel) {
    return `<em>${rLevel}</em> <strong>Right Monocular Temporal Hemianopia</strong>`;
  }
  if (lLevel && !rLevel) {
    return `<em>${lLevel}</em> <strong>Left Monocular Temporal Hemianopia</strong>`;
  }
  return null;
}

/********************************************************
 * 2c) Monocular Nasal Hemianopia
 ********************************************************/
function checkMonocularNasalHemianopia(right, left) {
  function classifyEye(e) {
    const st = codeToScore(e.st);
    const sn = codeToScore(e.sn);
    const it = codeToScore(e.it);
    const inn = codeToScore(e.in);

    // Central point is treated as a qualifier elsewhere; side quadrants define family.
    if (st !== 0 || it !== 0) return null;
    if (sn >= 1 && inn >= 1) return classify2to4(sn + inn);
    return null;
  }

  const rLevel = classifyEye(right);
  const lLevel = classifyEye(left);

  if (rLevel && !lLevel) {
    return `<em>${rLevel}</em> <strong>Right Monocular Nasal Hemianopia</strong>`;
  }
  if (lLevel && !rLevel) {
    return `<em>${lLevel}</em> <strong>Left Monocular Nasal Hemianopia</strong>`;
  }
  return null;
}

/********************************************************
 * 2d) Monocular Cecocentral-like Defect
 ********************************************************/
function checkMonocularCecocentralLike(right, left) {
  function classify(values) {
    if (!values.length) return null;
    const allPartial = values.every((v) => v === 1);
    const allDefinite = values.every((v) => v === 2);
    if (allPartial) return "Possible";
    if (allDefinite && values.length >= 2) return "Definite";
    return "Probable";
  }

  function classifyEye(e) {
    const st = codeToScore(e.st);
    const sn = codeToScore(e.sn);
    const it = codeToScore(e.it);
    const inn = codeToScore(e.in);
    const c = codeToScore(e.c);

    if (sn !== 0 || inn !== 0) return null;
    if (c < 1) return null;

    const temporalVals = [st, it].filter((v) => v > 0);
    if (!temporalVals.length) return null;

    return classify([c, ...temporalVals]);
  }

  const rLevel = classifyEye(right);
  const lLevel = classifyEye(left);

  if (rLevel && !lLevel) {
    return `<em>${rLevel}</em> <strong>Right Monocular Cecocentral-like Defect</strong>`;
  }
  if (lLevel && !rLevel) {
    return `<em>${lLevel}</em> <strong>Left Monocular Cecocentral-like Defect</strong>`;
  }
  return null;
}

/********************************************************
 * 3) Altitudinal Hemianopia
 ********************************************************/
function checkAltitudinalHemianopia(right, left) {
  function eyeAlt(e) {
    const st = codeToScore(e.st),
      sn = codeToScore(e.sn),
      it = codeToScore(e.it),
      inn = codeToScore(e.in);

    // Superior altitudinal: both upper quadrants lost, both lower normal
    if (st >= 1 && sn >= 1 && it === 0 && inn === 0) {
      const sumTop = st + sn; // sum of upper quadrant scores
      return { level: classify2to4(sumTop), half: "Superior Altitudinal" };
    }
    // Inferior altitudinal: both lower quadrants lost, both upper normal
    if (it >= 1 && inn >= 1 && st === 0 && sn === 0) {
      const sumBot = it + inn; // sum of lower quadrant scores
      return { level: classify2to4(sumBot), half: "Inferior Altitudinal" };
    }
    return null;
  }

  const rAlt = eyeAlt(right);
  const lAlt = eyeAlt(left);
  const results = [];

  // Right only
  if (rAlt && !lAlt) {
    results.push(`<em>${rAlt.level}</em> <strong>Right ${rAlt.half}</strong>`);
  }
  // Left only
  if (lAlt && !rAlt) {
    results.push(`<em>${lAlt.level}</em> <strong>Left ${lAlt.half}</strong>`);
  }
  // Both
  if (rAlt && lAlt) {
    // Both are Superior Altitudinal
    if (
      rAlt.half === "Superior Altitudinal" &&
      lAlt.half === "Superior Altitudinal"
    ) {
      if (rAlt.level === "Definite" && lAlt.level === "Definite") {
        results.push(
          "<em>Definite</em> <strong>Binocular Superior Altitudinal</strong>",
        );
      } else if (rAlt.level === "Possible" && lAlt.level === "Possible") {
        results.push(
          "<em>Possible</em> <strong>Binocular Superior Altitudinal</strong>",
        );
      } else {
        results.push(
          "<em>Probable</em> <strong>Binocular Superior Altitudinal</strong>",
        );
      }
    }
    // Both are Inferior Altitudinal
    else if (
      rAlt.half === "Inferior Altitudinal" &&
      lAlt.half === "Inferior Altitudinal"
    ) {
      if (rAlt.level === "Definite" && lAlt.level === "Definite") {
        results.push(
          "<em>Definite</em> <strong>Binocular Inferior Altitudinal</strong>",
        );
      } else if (rAlt.level === "Possible" && lAlt.level === "Possible") {
        results.push(
          "<em>Possible</em> <strong>Binocular Inferior Altitudinal</strong>",
        );
      } else {
        results.push(
          "<em>Probable</em> <strong>Binocular Inferior Altitudinal</strong>",
        );
      }
    }
    // One side is Superior, the other Inferior
    else {
      const rDesc = `${rAlt.level} Right ${rAlt.half}`;
      const lDesc = `${lAlt.level} Left ${lAlt.half}`;
      results.push(`<strong>Mixed Altitudinal</strong>: (${rDesc} / ${lDesc})`);
    }
  }

  if (!results.length) return null;
  return results.join(" / ");
}

/********************************************************
 * 4) Bitemporal Hemianopia
 ********************************************************/

function checkTunnelVision(right, left) {
  function classifyTunnel(e) {
    // All four quadrants partial or definite => st/sn/it/in >= 1
    if (!isCenterNormal(e)) return null;

    const st = codeToScore(e.st),
      sn = codeToScore(e.sn),
      it = codeToScore(e.it),
      inn = codeToScore(e.in);

    // If any quadrant is still normal, not tunnel vision
    if (st < 1 || sn < 1 || it < 1 || inn < 1) return null;

    // Sum up the quadrant scores: 4 => all partial, 8 => all definite, else mixed
    const sumQuad = st + sn + it + inn;
    if (sumQuad === 4) return "Possible";
    if (sumQuad === 8) return "Definite";
    return "Probable";
  }

  const rStatus = classifyTunnel(right);
  const lStatus = classifyTunnel(left);

  if (rStatus && lStatus) {
    // If both eyes match tunnel vision, mention RP as a possibility
    if (rStatus === "Definite" && lStatus === "Definite") {
      return "<em>Definite</em> <strong>Bilateral Advanced Glaucoma / Retinitis Pigmentosa (Tunnel Vision)</strong>";
    }
    if (rStatus === "Possible" && lStatus === "Possible") {
      return "<em>Possible</em> <strong>Bilateral Advanced Glaucoma / Retinitis Pigmentosa (Tunnel Vision)</strong>";
    }
    return "<em>Probable</em> <strong>Bilateral Advanced Glaucoma / Retinitis Pigmentosa (Tunnel Vision)</strong>";
  }

  // If only the right eye matches, no mention of RP
  if (rStatus) {
    return `<em>${rStatus}</em> <strong>Right Advanced Glaucoma (Tunnel Vision)</strong>`;
  }

  // If only the left eye matches, no mention of RP
  if (lStatus) {
    return `<em>${lStatus}</em> <strong>Left Advanced Glaucoma (Tunnel Vision)</strong>`;
  }

  // No match
  return null;
}

/********************************************************
 * 12) Glaucoma Check (Modified)
 *    - Must have at least one nasal quadrant partial or definite => suspect
 *    - If central is also lost (c=2), label eye as "Probable" not "Definite"
 *    - Otherwise do single-quadrant rules as before
 ********************************************************/
function checkGlaucomaSimple(right, left) {
  function classifyEye(e) {
    const stScore = codeToScore(e.st);
    const snScore = codeToScore(e.sn);
    const itScore = codeToScore(e.it);
    const inScore = codeToScore(e.in);
    const cScore = codeToScore(e.c);
    const nasalScores = [snScore, inScore].filter((v) => v > 0);
    const temporalScores = [stScore, itScore];
    const temporalDefiniteCount = temporalScores.filter((v) => v === 2).length;
    const temporalSuspectCount = temporalScores.filter((v) => v === 1).length;

    // Must have nasal change to be glaucoma-like.
    if (!nasalScores.length) {
      return null; // no abnormal nasal quadrant => not glaucoma-like
    }

    // Keep this rule specific: reject clear temporal loss (likely non-glaucoma family).
    if (temporalDefiniteCount > 0) {
      return null;
    }
    // Allow only mild temporal uncertainty (one suspect temporal point) as overlap.
    if (temporalSuspectCount > 1) return null;

    // Keep central sparing strict for this rule.
    if (cScore !== 0) {
      return null;
    }

    // Preserve dedicated monocular nasal hemianopia label.
    const isStrongPureNasalHemianopia =
      snScore === 2 &&
      inScore === 2 &&
      stScore === 0 &&
      itScore === 0 &&
      cScore === 0;
    if (isStrongPureNasalHemianopia) {
      return null;
    }

    // Single nasal-point defect is weak evidence.
    if (nasalScores.length === 1) {
      const base = nasalScores[0] === 1 ? "Possible" : "Probable";
      if (temporalSuspectCount === 1 && base === "Possible") return "Probable";
      return base;
    }

    const bothPartial = nasalScores[0] === 1 && nasalScores[1] === 1;
    const bothDefinite = nasalScores[0] === 2 && nasalScores[1] === 2;
    if (bothDefinite) {
      if (temporalSuspectCount === 1) return "Probable";
      return "Definite";
    }

    if (bothPartial) {
      return "Possible";
    }

    // Any mixed nasal severity stays probable.
    return "Probable";
  }

  // Evaluate each eye
  const rVal = classifyEye(right);
  const lVal = classifyEye(left);

  // If neither eye meets the criteria
  if (!rVal && !lVal) {
    return null;
  }

  // If both eyes match
  if (rVal && lVal) {
    if (rVal === lVal) {
      return `<em>${rVal}</em> <strong>Glaucoma-like Changes Both Eyes</strong>`;
    } else {
      return `<strong>Glaucoma-like Changes:</strong> Right(${rVal}) & Left(${lVal})`;
    }
  }

  // Only right eye matches
  if (rVal) {
    return `<em>${rVal}</em> <strong>Glaucoma-like Changes (Right Eye)</strong>`;
  }

  // Only left eye matches
  return `<em>${lVal}</em> <strong>Glaucoma-like Changes (Left Eye)</strong>`;
}

/********************************************************
 * 13) Monocular Partial (Unclassified) Defect
 ********************************************************/
function checkMonocularOtherDefect(right, left) {
  const rightAbn = !isEyeNormal(right);
  const leftAbn = !isEyeNormal(left);

  // Only check monocular if exactly one eye is abnormal
  if (rightAbn && !leftAbn) {
    return subCheckEye(right, "Right");
  }
  if (leftAbn && !rightAbn) {
    return subCheckEye(left, "Left");
  }
  return null;

  function subCheckEye(e, side) {
    const st = codeToScore(e.st),
      sn = codeToScore(e.sn),
      it = codeToScore(e.it),
      inn = codeToScore(e.in),
      c = codeToScore(e.c);

    const activeVals = [st, sn, it, inn, c].filter((x) => x > 0);
    if (!activeVals.length) return null;

    // Skip patterns already captured by specific rules.
    const isMonocularTotal = st > 0 && sn > 0 && it > 0 && inn > 0 && c > 0;
    const isMonocularTunnel = st > 0 && sn > 0 && it > 0 && inn > 0 && c === 0;
    const isPureSuperiorAlt =
      st > 0 && sn > 0 && it === 0 && inn === 0 && c === 0;
    const isPureInferiorAlt =
      st === 0 && sn === 0 && it > 0 && inn > 0 && c === 0;
    const isNasalOnly = st === 0 && it === 0 && (sn > 0 || inn > 0);
    const isTemporalHemi = st > 0 && it > 0 && sn === 0 && inn === 0 && c === 0;
    const isCecocentralLike =
      c > 0 && (st > 0 || it > 0) && sn === 0 && inn === 0;
    if (
      isMonocularTotal ||
      isMonocularTunnel ||
      isPureSuperiorAlt ||
      isPureInferiorAlt ||
      isNasalOnly ||
      isTemporalHemi ||
      isCecocentralLike
    ) {
      return null;
    }

    // If all four quadrants are abnormal but centre is normal
    if (st > 0 && sn > 0 && it > 0 && inn > 0 && c === 0) {
      const quads = [st, sn, it, inn];
      const lvl = classifyScores(quads);
      return `<em>${lvl}</em> <strong>${side} Monocular 4-Quadrant Defect</strong>`;
    }

    const quadArray = [st, sn, it, inn];
    const activeQuads = quadArray.filter((q) => q > 0).length;

    // Single isolated quadrant loss with central sparing is best labelled
    // as a monocular quadrantanopia pattern (rather than generic partial defect).
    if (activeQuads === 1 && c === 0) {
      const quadrantMap = [
        { score: st, label: "Superior Temporal" },
        { score: sn, label: "Superior Nasal" },
        { score: it, label: "Inferior Temporal" },
        { score: inn, label: "Inferior Nasal" },
      ];
      const activeQuadrant = quadrantMap.find((item) => item.score > 0);
      const qLevel = classifyScores(
        activeQuadrant ? [activeQuadrant.score] : activeVals,
      );
      if (activeQuadrant) {
        return `<em>${qLevel}</em> <strong>${side} Monocular ${activeQuadrant.label} Quadrantanopia</strong>`;
      }
    }

    let baseLabel;
    if (activeQuads === 3) baseLabel = "Large Defect";
    else baseLabel = "Partial Defect";

    const mainLevel = classifyScores(activeVals);

    let cNote = "";
    if (c === 1) cNote = "(with partial central loss)";
    else if (c === 2) cNote = "(with definite central loss)";

    let result = `<em>${mainLevel}</em> <strong>${side} Monocular ${baseLabel}</strong>`;
    if (cNote) result += ` ${cNote}`;
    return result;
  }
}

/********************************************************
 * 14) Bilateral Central Scotoma
 ********************************************************/
function checkBilateralCentralScotoma(right, left) {
  // We classify a bilateral central scotoma based on both central zones being lost or partial
  // while each eye's quadrants are normal.
  function classifyTwoEyes(rC, lC) {
    // rC and lC can be 1 (partial) or 2 (definite)
    if (rC === 1 && lC === 1) return "Possible";
    if (rC === 2 && lC === 2) return "Definite";
    // Otherwise e.g. one partial + one definite => "Probable"
    return "Probable";
  }

  const rC = codeToScore(right.c);
  const lC = codeToScore(left.c);

  // Check both eyes have central scotoma (>= 1)
  // and that all quadrants in each eye are normal (st/sn/it/in = 'R').
  if (rC >= 1 && lC >= 1) {
    const rightNormalQuads = areQuadrantsNormal(right);
    const leftNormalQuads = areQuadrantsNormal(left);

    if (rightNormalQuads && leftNormalQuads) {
      const level = classifyTwoEyes(rC, lC);
      return `<em>${level}</em> <strong>Bilateral Central Scotoma</strong>`;
    }
  }
  return null;
}
