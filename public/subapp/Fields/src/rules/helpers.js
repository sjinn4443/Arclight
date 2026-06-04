// Shared helpers for visual field rule families.
// Loaded before rule family modules.

function scoreAllPoints(eye) {
  return (
    codeToScore(eye.st) +
    codeToScore(eye.sn) +
    codeToScore(eye.it) +
    codeToScore(eye.in) +
    codeToScore(eye.c)
  );
}

function classify2to4(sum) {
  if (sum === 2) return "Possible";
  if (sum === 4) return "Definite";
  return "Probable";
}

function classify5to10(sum) {
  if (sum === 5) return "Possible";
  if (sum === 10) return "Definite";
  return "Probable";
}

function classifyScores(scores) {
  if (!scores.length) return "Probable";
  const allPartial = scores.every((v) => v === 1);
  const allDefinite = scores.every((v) => v === 2);
  if (allPartial) return "Possible";
  if (allDefinite) return "Definite";
  return "Probable";
}

function isCenterNormal(eye) {
  return codeToScore(eye.c) === 0;
}

function areQuadrantsNormal(eye) {
  return eye.st === "R" && eye.sn === "R" && eye.it === "R" && eye.in === "R";
}
