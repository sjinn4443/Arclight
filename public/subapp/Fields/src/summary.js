const SUMMARY_GLOBAL = typeof window !== "undefined" ? window : globalThis;
const SUMMARY_FIELD_CORE = SUMMARY_GLOBAL.FIELD_CORE || {};
const parseEyeStateString =
  SUMMARY_FIELD_CORE.parseEyeString ||
  function fallbackParseEyeString(str) {
    const result = { st: "R", sn: "R", it: "R", in: "R", c: "R" };
    String(str || "")
      .split(",")
      .forEach((piece) => {
        const trimmed = piece.trim();
        const pos = trimmed.slice(0, 2);
        const symbol = trimmed.slice(2);
        if (!Object.prototype.hasOwnProperty.call(result, pos)) return;
        if (symbol === "?") {
          result[pos] = "?";
        } else if (symbol === "X") {
          result[pos] = "W";
        } else {
          result[pos] = "R";
        }
      });
    return result;
  };

function resolveEyesForSummary(inputState) {
  if (inputState && inputState.right && inputState.left) {
    return { right: inputState.right, left: inputState.left };
  }

  if (typeof inputState === "string") {
    const [rightRaw, leftRaw] = inputState.split(" | ");
    const rightStr = rightRaw?.split(": ")[1]?.trim();
    const leftStr = leftRaw?.split(": ")[1]?.trim();
    if (rightStr && leftStr) {
      return {
        right: parseEyeStateString(rightStr),
        left: parseEyeStateString(leftStr),
      };
    }
  }

  return null;
}

function summarizeCondition(inputState) {
  const eyes = resolveEyesForSummary(inputState);
  if (!eyes) return "Condition not identified";
  const { right, left } = eyes;

  // Ordered by priority (common/high-yield first; rarer families later).
  const checks = [
    { key: "binocularTotalLoss", fn: checkBinocularTotalLoss },
    { key: "monocularTotalLoss", fn: checkMonocularTotalLoss },
    { key: "homonymousHemianopia", fn: checkHomonymousHemianopia },
    {
      key: "homonymousQuadrantanopiaTemporal",
      fn: checkHomonymousQuadrantanopiaTemporal,
    },
    {
      key: "homonymousQuadrantanopiaParietal",
      fn: checkHomonymousQuadrantanopiaParietal,
    },
    { key: "bitemporalHemianopia", fn: checkBitemporalHemianopia },
    { key: "bitemporalQuadrantanopia", fn: checkBitemporalQuadrantanopia },
    { key: "altitudinalHemianopia", fn: checkAltitudinalHemianopia },
    { key: "tunnelVision", fn: checkTunnelVision },
    { key: "monocularCentralScotoma", fn: checkMonocularCentralScotoma },
    { key: "bilateralCentralScotoma", fn: checkBilateralCentralScotoma },
    { key: "junctionalScotoma", fn: checkJunctional },
    { key: "monocularCecocentralLike", fn: checkMonocularCecocentralLike },
    {
      key: "monocularTemporalHemianopia",
      fn: checkMonocularTemporalHemianopia,
    },
    { key: "monocularNasalHemianopia", fn: checkMonocularNasalHemianopia },
    { key: "glaucomaSimple", fn: checkGlaucomaSimple },
    { key: "binasalHemianopia", fn: checkBinasal },
    { key: "monocularOtherDefect", fn: checkMonocularOtherDefect },
  ];

  // Collect all matches instead of returning on the first.
  const rawMatches = [];
  for (const check of checks) {
    const result = check.fn(right, left);
    if (result) {
      rawMatches.push({ key: check.key, text: result });
    }
  }

  // De-duplicate identical rendered matches while preserving order.
  const uniqueMatches = [];
  const seen = new Set();
  for (const item of rawMatches) {
    const id = `${item.key}::${item.text}`;
    if (seen.has(id)) continue;
    seen.add(id);
    uniqueMatches.push(item);
  }

  // Suppress incompatible secondary labels.
  function hasKey(key) {
    return uniqueMatches.some((m) => m.key === key);
  }
  function removeKeys(keysToRemove) {
    return uniqueMatches.filter((m) => !keysToRemove.includes(m.key));
  }
  function keyRank(key) {
    const ranks = {
      binocularTotalLoss: 0,
      monocularTotalLoss: 1,
      homonymousHemianopia: 2,
      homonymousQuadrantanopiaTemporal: 3,
      homonymousQuadrantanopiaParietal: 4,
      bitemporalHemianopia: 5,
      bitemporalQuadrantanopia: 6,
      altitudinalHemianopia: 7,
      tunnelVision: 8,
      monocularCentralScotoma: 9,
      bilateralCentralScotoma: 10,
      junctionalScotoma: 11,
      monocularCecocentralLike: 12,
      monocularTemporalHemianopia: 13,
      monocularNasalHemianopia: 14,
      glaucomaSimple: 15,
      binasalHemianopia: 16,
      monocularOtherDefect: 17,
      mixedOverlapHint: 90,
      otherEyeDefectHint: 91,
    };
    return Object.prototype.hasOwnProperty.call(ranks, key) ? ranks[key] : 99;
  }
  function shouldAvoidFallbackSecondary(primaryKey, secondaryKey) {
    if (secondaryKey === "monocularOtherDefect") return true;

    const blockedByPrimary = {
      tunnelVision: new Set([
        "glaucomaSimple",
        "homonymousHemianopia",
        "homonymousQuadrantanopiaTemporal",
        "homonymousQuadrantanopiaParietal",
        "bitemporalHemianopia",
        "bitemporalQuadrantanopia",
      ]),
      homonymousHemianopia: new Set([
        "homonymousQuadrantanopiaTemporal",
        "homonymousQuadrantanopiaParietal",
        "glaucomaSimple",
        "monocularTemporalHemianopia",
        "monocularNasalHemianopia",
        "monocularCecocentralLike",
      ]),
      bitemporalHemianopia: new Set(["glaucomaSimple"]),
      bitemporalQuadrantanopia: new Set([
        "homonymousQuadrantanopiaTemporal",
        "homonymousQuadrantanopiaParietal",
        "glaucomaSimple",
      ]),
      altitudinalHemianopia: new Set([
        "glaucomaSimple",
        "monocularOtherDefect",
      ]),
      monocularCentralScotoma: new Set(["monocularOtherDefect"]),
      bilateralCentralScotoma: new Set(["monocularOtherDefect"]),
      monocularTemporalHemianopia: new Set([
        "glaucomaSimple",
        "monocularOtherDefect",
      ]),
      monocularNasalHemianopia: new Set(["monocularOtherDefect"]),
      monocularCecocentralLike: new Set([
        "glaucomaSimple",
        "monocularOtherDefect",
      ]),
      binasalHemianopia: new Set(["glaucomaSimple", "monocularOtherDefect"]),
      glaucomaSimple: new Set(["monocularOtherDefect"]),
    };

    const blocked = blockedByPrimary[primaryKey];
    return blocked ? blocked.has(secondaryKey) : false;
  }
  function shouldKeepGlaucomaSecondaryForAltitudinal() {
    function isNasalWeightedSuperiorAlt(eye) {
      const st = codeToScore(eye.st);
      const sn = codeToScore(eye.sn);
      const it = codeToScore(eye.it);
      const inn = codeToScore(eye.in);
      const c = codeToScore(eye.c);

      // Narrow exception:
      // superior altitudinal-like loss with stronger superior-nasal involvement.
      return (
        c === 0 &&
        st >= 1 &&
        sn >= 1 &&
        it === 0 &&
        inn === 0 &&
        sn >= st &&
        sn === 2
      );
    }

    const rightPattern = isNasalWeightedSuperiorAlt(right) && isEyeNormal(left);
    const leftPattern = isNasalWeightedSuperiorAlt(left) && isEyeNormal(right);
    const bilateralPattern =
      isNasalWeightedSuperiorAlt(right) && isNasalWeightedSuperiorAlt(left);
    return rightPattern || leftPattern || bilateralPattern;
  }

  let filteredMatches = uniqueMatches;
  if (hasKey("binocularTotalLoss")) {
    filteredMatches = filteredMatches.filter(
      (m) => m.key === "binocularTotalLoss",
    );
  } else if (hasKey("monocularTotalLoss")) {
    // If one eye is fully down, keep monocular-loss primary, but keep meaningful
    // secondary patterns from the other eye so bilateral pathology is not hidden.
    filteredMatches = filteredMatches.filter(
      (m) => m.key !== "monocularOtherDefect",
    );

    // In monocular-total-loss contexts, altitudinal already explains the patterned loss;
    // suppress extra glaucoma wording to keep output concise and non-conflicting.
    if (hasKey("altitudinalHemianopia")) {
      filteredMatches = filteredMatches.filter(
        (m) => m.key !== "glaucomaSimple",
      );
    }
  } else {
    if (hasKey("tunnelVision")) {
      filteredMatches = removeKeys([
        "glaucomaSimple",
        "homonymousHemianopia",
        "homonymousQuadrantanopiaTemporal",
        "homonymousQuadrantanopiaParietal",
        "bitemporalHemianopia",
        "bitemporalQuadrantanopia",
      ]);
    }
    if (hasKey("homonymousHemianopia")) {
      filteredMatches = filteredMatches.filter(
        (m) =>
          m.key !== "homonymousQuadrantanopiaTemporal" &&
          m.key !== "homonymousQuadrantanopiaParietal" &&
          m.key !== "glaucomaSimple" &&
          m.key !== "monocularTemporalHemianopia" &&
          m.key !== "monocularNasalHemianopia" &&
          m.key !== "monocularCecocentralLike",
      );
    }
    if (
      hasKey("homonymousQuadrantanopiaTemporal") ||
      hasKey("homonymousQuadrantanopiaParietal")
    ) {
      filteredMatches = filteredMatches.filter(
        (m) => m.key !== "glaucomaSimple",
      );
    }
    if (hasKey("bitemporalHemianopia")) {
      filteredMatches = filteredMatches.filter(
        (m) => m.key !== "glaucomaSimple",
      );
    }
    if (hasKey("bitemporalQuadrantanopia")) {
      filteredMatches = filteredMatches.filter(
        (m) =>
          m.key !== "homonymousQuadrantanopiaTemporal" &&
          m.key !== "homonymousQuadrantanopiaParietal" &&
          m.key !== "glaucomaSimple",
      );
    }
    if (hasKey("altitudinalHemianopia")) {
      const keepGlaucomaSecondary =
        hasKey("glaucomaSimple") && shouldKeepGlaucomaSecondaryForAltitudinal();
      filteredMatches = filteredMatches.filter(
        (m) =>
          m.key !== "monocularOtherDefect" &&
          (keepGlaucomaSecondary || m.key !== "glaucomaSimple"),
      );
    }
    if (
      hasKey("monocularCentralScotoma") ||
      hasKey("bilateralCentralScotoma")
    ) {
      filteredMatches = filteredMatches.filter(
        (m) => m.key !== "monocularOtherDefect",
      );
    }
    if (
      hasKey("monocularTemporalHemianopia") ||
      hasKey("monocularNasalHemianopia") ||
      hasKey("monocularCecocentralLike")
    ) {
      filteredMatches = filteredMatches.filter(
        (m) => m.key !== "monocularOtherDefect",
      );
    }
    if (hasKey("glaucomaSimple")) {
      filteredMatches = filteredMatches.filter(
        (m) => m.key !== "monocularOtherDefect",
      );
    }

    // Bilateral nasal-dominant patterns are better represented by binasal family.
    if (hasKey("binasalHemianopia") && hasKey("glaucomaSimple")) {
      const rST = codeToScore(right.st);
      const rSN = codeToScore(right.sn);
      const rIT = codeToScore(right.it);
      const rIN = codeToScore(right.in);
      const rC = codeToScore(right.c);
      const lST = codeToScore(left.st);
      const lSN = codeToScore(left.sn);
      const lIT = codeToScore(left.it);
      const lIN = codeToScore(left.in);
      const lC = codeToScore(left.c);

      const temporalNoise = rST + rIT + lST + lIT;
      const centralNoise = rC + lC;
      const bilateralNasalCore = rSN >= 1 && rIN >= 1 && lSN >= 1 && lIN >= 1;

      if (bilateralNasalCore && temporalNoise <= 1 && centralNoise === 0) {
        filteredMatches = filteredMatches.filter(
          (m) => m.key !== "glaucomaSimple",
        );
      }
    }
  }

  // Keep alternatives visible for fuzzy/mixed real-world patterns.
  if (filteredMatches.length === 1 && uniqueMatches.length > 1) {
    const primary = filteredMatches[0];
    const suppressGlaucomaSecondary =
      primary.key === "monocularTotalLoss" && hasKey("altitudinalHemianopia");
    const fallbackSecondary = uniqueMatches
      .filter((m) => {
        if (m.key === primary.key) return false;
        if (suppressGlaucomaSecondary && m.key === "glaucomaSimple")
          return false;
        return !shouldAvoidFallbackSecondary(primary.key, m.key);
      })
      .sort((a, b) => keyRank(a.key) - keyRank(b.key))[0];

    if (fallbackSecondary) {
      filteredMatches = [primary, fallbackSecondary];
    } else if (
      primary.key !== "binocularTotalLoss" &&
      primary.key !== "binasalHemianopia"
    ) {
      filteredMatches = [
        primary,
        {
          key: "mixedOverlapHint",
          text: "<em>Possible</em> <strong>Mixed pattern</strong>",
        },
      ];
    }
  }

  // If one eye is fully down, always surface when the other eye is also abnormal.
  if (
    filteredMatches.length === 1 &&
    filteredMatches[0].key === "monocularTotalLoss"
  ) {
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

    if (rightAllLost && !isEyeNormal(left)) {
      filteredMatches = [
        filteredMatches[0],
        {
          key: "otherEyeDefectHint",
          text: "<em>Possible</em> <strong>Additional left-eye defect</strong>",
        },
      ];
    } else if (leftAllLost && !isEyeNormal(right)) {
      filteredMatches = [
        filteredMatches[0],
        {
          key: "otherEyeDefectHint",
          text: "<em>Possible</em> <strong>Additional right-eye defect</strong>",
        },
      ];
    }
  }

  if (filteredMatches.length === 0) {
    const hasAnyAbnormal = !isEyeNormal(right) || !isEyeNormal(left);
    if (hasAnyAbnormal) {
      return "<em>Possible</em> <strong>Mixed/Unclassified Field Defect</strong>";
    }
    return "<em>Normal</em> <strong>Full Fields of Vision</strong>";
  }

  // Show the most common/high-yield label first; keep rarer labels as alternatives.
  filteredMatches = filteredMatches
    .map((m, idx) => ({ ...m, __idx: idx }))
    .sort((a, b) => {
      const byRank = keyRank(a.key) - keyRank(b.key);
      if (byRank !== 0) return byRank;
      return a.__idx - b.__idx;
    })
    .map(({ __idx, ...rest }) => rest);

  if (filteredMatches.length === 1) {
    return filteredMatches[0].text;
  }

  const mainMatch = filteredMatches[0].text;
  const alsoConsider = filteredMatches
    .slice(1, 3)
    .map((m) => m.text)
    .join(" / ");
  const moreCount = filteredMatches.length - 3;
  const moreSuffix = moreCount > 0 ? ` (+${moreCount} more)` : "";
  return `${mainMatch}<br><small>Also: ${alsoConsider}${moreSuffix}</small>`;
}
