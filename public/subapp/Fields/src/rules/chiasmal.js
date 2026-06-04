// Chiasmal and junctional rule families.

function checkBitemporalHemianopia(right, left) {
  const rST = codeToScore(right.st),
    rIT = codeToScore(right.it);
  const lST = codeToScore(left.st),
    lIT = codeToScore(left.it);
  const rSN = codeToScore(right.sn),
    rIN = codeToScore(right.in);
  const lSN = codeToScore(left.sn),
    lIN = codeToScore(left.in);
  const rC = codeToScore(right.c),
    lC = codeToScore(left.c);

  // Keep chiasmal label strict: require clean vertical pattern and central sparing.
  if (rSN !== 0 || rIN !== 0 || lSN !== 0 || lIN !== 0) {
    return null;
  }
  if (rC !== 0 || lC !== 0) return null;

  if (rST >= 1 && rIT >= 1 && lST >= 1 && lIT >= 1) {
    const rSum = rST + rIT;
    const lSum = lST + lIT;
    const total = rSum + lSum;
    if (total === 4)
      return "<em>Possible</em> <strong>Bitemporal Hemianopia</strong>";
    if (total === 8)
      return "<em>Definite</em> <strong>Bitemporal Hemianopia</strong>";
    return "<em>Probable</em> <strong>Bitemporal Hemianopia</strong>";
  }
  return null;
}

/********************************************************
 * 5) Bitemporal Quadrantanopia
 ********************************************************/
function checkBitemporalQuadrantanopia(right, left) {
  if (codeToScore(right.c) !== 0 || codeToScore(left.c) !== 0) {
    return null;
  }

  const rST = codeToScore(right.st),
    rIT = codeToScore(right.it);
  const lST = codeToScore(left.st),
    lIT = codeToScore(left.it);
  const rSN = codeToScore(right.sn),
    rIN = codeToScore(right.in);
  const lSN = codeToScore(left.sn),
    lIN = codeToScore(left.in);

  // Keep this label for clean bitemporal quadrantic patterns.
  if (rSN !== 0 || rIN !== 0 || lSN !== 0 || lIN !== 0) {
    return null;
  }

  const results = [];

  // Superior bitemporal quadrant => st>=1 on both eyes, it=0 on both eyes
  if (rST >= 1 && rIT === 0 && lST >= 1 && lIT === 0) {
    const sumU = rST + lST;
    if (sumU === 2) {
      results.push(
        "<em>Possible</em> <strong>Superior Bitemporal Quadrantanopia</strong>",
      );
    } else if (sumU === 4) {
      results.push(
        "<em>Definite</em> <strong>Superior Bitemporal Quadrantanopia</strong>",
      );
    } else {
      results.push(
        "<em>Probable</em> <strong>Superior Bitemporal Quadrantanopia</strong>",
      );
    }
  }

  // Inferior bitemporal quadrant => it>=1 on both eyes, st=0 on both eyes
  if (rIT >= 1 && rST === 0 && lIT >= 1 && lST === 0) {
    const sumL = rIT + lIT;
    if (sumL === 2) {
      results.push(
        "<em>Possible</em> <strong>Inferior Bitemporal Quadrantanopia</strong>",
      );
    } else if (sumL === 4) {
      results.push(
        "<em>Definite</em> <strong>Inferior Bitemporal Quadrantanopia</strong>",
      );
    } else {
      results.push(
        "<em>Probable</em> <strong>Inferior Bitemporal Quadrantanopia</strong>",
      );
    }
  }

  if (!results.length) return null;
  return results.join(" / ");
}

/********************************************************
 * 6) Binasal Hemianopia
 ********************************************************/
function checkBinasal(right, left) {
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

  // Helper: centre must be normal and temporal quadrants (st, it) must be normal.
  function isBinasalCandidate(e) {
    // Side quadrants define family; centre is handled as a qualifier.
    if (!isCenterNormal(e)) return false;
    if (codeToScore(e.st) !== 0) return false;
    if (codeToScore(e.it) !== 0) return false;
    return true;
  }

  // Pure binasal (strict pattern)
  if (isBinasalCandidate(right) && isBinasalCandidate(left)) {
    const hasRightNasalPair = rSN >= 1 && rIN >= 1;
    const hasLeftNasalPair = lSN >= 1 && lIN >= 1;
    if (hasRightNasalPair && hasLeftNasalPair) {
      const rNasal = rSN + rIN;
      const lNasal = lSN + lIN;

      // Keep this conservative: each eye should have at least one definite nasal point.
      // This avoids overcalling rare binasal defects from all-partial noise.
      if (rNasal < 3 || lNasal < 3) return null;

      const total = rNasal + lNasal;
      if (total === 6)
        return "<em>Possible</em> <strong>Binasal Hemianopia</strong>";
      if (total === 8)
        return "<em>Definite</em> <strong>Binasal Hemianopia</strong>";
      return "<em>Probable</em> <strong>Binasal Hemianopia</strong>";
    }
  }

  return null;
}

/********************************************************
 * 7) Homonymous Hemianopia
 ********************************************************/

function checkJunctional(right, left) {
  // Eye has c>=1 (partial or definite) but all four quadrants normal
  function isPureCentralLoss(e) {
    const cVal = codeToScore(e.c);
    if (cVal < 1) return false; // centre must be partial or definite
    // st/sn/it/in must be normal => 0
    if (codeToScore(e.st) !== 0) return false;
    if (codeToScore(e.sn) !== 0) return false;
    if (codeToScore(e.it) !== 0) return false;
    if (codeToScore(e.in) !== 0) return false;
    return true;
  }

  // Eye has ST>=1 but c/sn/it/in = normal => 0
  function isPureSTDefect(e) {
    if (codeToScore(e.st) < 1) return false; // must be partial or definite in ST
    if (!isCenterNormal(e)) return false; // centre normal
    if (codeToScore(e.sn) !== 0) return false;
    if (codeToScore(e.it) !== 0) return false;
    if (codeToScore(e.in) !== 0) return false;
    return true;
  }

  let results = [];

  // Case 1: Right eye has pure central loss, Left eye has pure ST defect
  if (isPureCentralLoss(right) && isPureSTDefect(left)) {
    // Sum up their "lost" zones for classification
    const sumRL = codeToScore(right.c) + codeToScore(left.st);
    const lvl = classify2to4(sumRL);
    results.push(
      `<em>${lvl}</em> <strong>Junctional Scotoma (Right centre + Left ST)</strong>`,
    );
  }

  // Case 2: Left eye has pure central loss, Right eye has pure ST defect
  if (isPureCentralLoss(left) && isPureSTDefect(right)) {
    const sumLR = codeToScore(left.c) + codeToScore(right.st);
    const lvl = classify2to4(sumLR);
    results.push(
      `<em>${lvl}</em> <strong>Junctional Scotoma (Left centre + Right ST)</strong>`,
    );
  }

  if (!results.length) return null;
  return results.join(" / ");
}

/********************************************************
 * 11) Tunnel Vision (Advanced Glaucoma or RP if bilateral)
 ********************************************************/
