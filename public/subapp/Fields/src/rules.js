/*
 * rules.js (compatibility entrypoint)
 *
 * Rule logic now lives in src/rules/helpers.js, src/rules/anterior.js,
 * src/rules/chiasmal.js, and src/rules/posterior.js.
 *
 * This file validates load order and keeps backward compatibility for
 * existing script tags/import expectations.
 */

(function initRulesCompatibility(globalScope) {
  const requiredRuleFunctions = [
    // Shared helpers
    "scoreAllPoints",
    "classify2to4",
    "classify5to10",
    "classifyScores",
    "isCenterNormal",
    "areQuadrantsNormal",

    // Rule families
    "checkBinocularTotalLoss",
    "checkMonocularTotalLoss",
    "checkMonocularCentralScotoma",
    "checkMonocularTemporalHemianopia",
    "checkMonocularNasalHemianopia",
    "checkMonocularCecocentralLike",
    "checkAltitudinalHemianopia",
    "checkBitemporalHemianopia",
    "checkBitemporalQuadrantanopia",
    "checkBinasal",
    "checkHomonymousHemianopia",
    "checkHomonymousQuadrantanopiaTemporal",
    "checkHomonymousQuadrantanopiaParietal",
    "checkJunctional",
    "checkTunnelVision",
    "checkGlaucomaSimple",
    "checkMonocularOtherDefect",
    "checkBilateralCentralScotoma",
  ];

  const missing = requiredRuleFunctions.filter(
    (name) => typeof globalScope[name] !== "function",
  );
  if (missing.length) {
    throw new Error(
      `Rules modules not loaded before src/rules.js. Missing: ${missing.join(", ")}`,
    );
  }
})(typeof window !== "undefined" ? window : globalThis);
