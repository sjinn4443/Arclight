// Post-chiasmal rule families.

function checkHomonymousHemianopia(right, left) {
  function classifySide(sumR, sumL) {
    const total = sumR + sumL;
    if (total === 4) return "Possible";
    if (total === 8) return "Definite";
    return "Probable";
  }

  // Right Homonymous => right eye ST+IT >=1, left eye SN+IN >=1
  const stR = codeToScore(right.st),
    itR = codeToScore(right.it),
    snL = codeToScore(left.sn),
    inL = codeToScore(left.in);
  const snR = codeToScore(right.sn),
    inR = codeToScore(right.in),
    stL = codeToScore(left.st),
    itL = codeToScore(left.it);

  if (
    stR >= 1 &&
    itR >= 1 &&
    snL >= 1 &&
    inL >= 1 &&
    snR === 0 &&
    inR === 0 &&
    stL === 0 &&
    itL === 0
  ) {
    const sumR = stR + itR;
    const sumL = snL + inL;
    const lvl = classifySide(sumR, sumL);
    const congruous = stR === snL && itR === inL;
    const congruitySuffix = congruous ? "" : " (Incongruous)";
    return `<em>${lvl}</em> <strong>Right Homonymous Hemianopia${congruitySuffix}</strong>`;
  }

  // Left Homonymous => right eye SN+IN >=1, left eye ST+IT >=1
  if (
    snR >= 1 &&
    inR >= 1 &&
    stL >= 1 &&
    itL >= 1 &&
    stR === 0 &&
    itR === 0 &&
    snL === 0 &&
    inL === 0
  ) {
    const sumX = snR + inR;
    const sumY = stL + itL;
    const lvl = classifySide(sumX, sumY);
    const congruous = snR === stL && inR === itL;
    const congruitySuffix = congruous ? "" : " (Incongruous)";
    return `<em>${lvl}</em> <strong>Left Homonymous Hemianopia${congruitySuffix}</strong>`;
  }

  return null;
}

/**************************************************************************
 * 8) Homonymous Quadrantanopia (Temporal)
 **************************************************************************/
function checkHomonymousQuadrantanopiaTemporal(right, left) {
  let results = [];

  function classify2to4(s) {
    if (s === 2) return "Possible";
    if (s === 4) return "Definite";
    return "Probable";
  }

  const rST = codeToScore(right.st);
  const rSN = codeToScore(right.sn);
  const rIT = codeToScore(right.it);
  const rIN = codeToScore(right.in);
  const lST = codeToScore(left.st);
  const lSN = codeToScore(left.sn);
  const lIT = codeToScore(left.it);
  const lIN = codeToScore(left.in);

  // Exclude full homonymous hemianopia patterns.
  const hasRightHomonymousHemi = rST >= 1 && rIT >= 1 && lSN >= 1 && lIN >= 1;
  const hasLeftHomonymousHemi = rSN >= 1 && rIN >= 1 && lST >= 1 && lIT >= 1;
  if (hasRightHomonymousHemi || hasLeftHomonymousHemi) {
    return null;
  }

  // Right superior quadrantanopia should have inferior homonymous quadrants spared.
  if (
    rST >= 1 &&
    lSN >= 1 &&
    rIT === 0 &&
    lIN === 0 &&
    rSN === 0 &&
    lST === 0
  ) {
    const sumRU = rST + lSN;
    const lvl = classify2to4(sumRU);
    results.push(
      `<em>${lvl}</em> <strong>Right Superior Quadrantanopia</strong>`,
    );
  }

  // Left superior quadrantanopia should have inferior homonymous quadrants spared.
  if (
    rSN >= 1 &&
    lST >= 1 &&
    rIN === 0 &&
    lIT === 0 &&
    rST === 0 &&
    lSN === 0
  ) {
    const sumLU = rSN + lST;
    const lvl = classify2to4(sumLU);
    results.push(
      `<em>${lvl}</em> <strong>Left Superior Quadrantanopia</strong>`,
    );
  }

  if (!results.length) return null;
  return results.join(" / ");
}

/**************************************************************************
 * 9) Homonymous Quadrantanopia (Parietal)
 **************************************************************************/
function checkHomonymousQuadrantanopiaParietal(right, left) {
  let results = [];

  function classify2to4(s) {
    if (s === 2) return "Possible";
    if (s === 4) return "Definite";
    return "Probable";
  }

  const rST = codeToScore(right.st);
  const rSN = codeToScore(right.sn);
  const rIT = codeToScore(right.it);
  const rIN = codeToScore(right.in);
  const lST = codeToScore(left.st);
  const lSN = codeToScore(left.sn);
  const lIT = codeToScore(left.it);
  const lIN = codeToScore(left.in);

  // Exclude full homonymous hemianopia patterns.
  const hasRightHomonymousHemi = rST >= 1 && rIT >= 1 && lSN >= 1 && lIN >= 1;
  const hasLeftHomonymousHemi = rSN >= 1 && rIN >= 1 && lST >= 1 && lIT >= 1;
  if (hasRightHomonymousHemi || hasLeftHomonymousHemi) {
    return null;
  }

  // Right inferior quadrantanopia should have superior homonymous quadrants spared.
  if (
    rIT >= 1 &&
    lIN >= 1 &&
    rST === 0 &&
    lSN === 0 &&
    rIN === 0 &&
    lIT === 0
  ) {
    const sumRI = rIT + lIN;
    const lvl = classify2to4(sumRI);
    results.push(
      `<em>${lvl}</em> <strong>Right Inferior Quadrantanopia</strong>`,
    );
  }

  // Left inferior quadrantanopia should have superior homonymous quadrants spared.
  if (
    rIN >= 1 &&
    lIT >= 1 &&
    rSN === 0 &&
    lST === 0 &&
    rIT === 0 &&
    lIN === 0
  ) {
    const sumLI = rIN + lIT;
    const lvl = classify2to4(sumLI);
    results.push(
      `<em>${lvl}</em> <strong>Left Inferior Quadrantanopia</strong>`,
    );
  }

  if (!results.length) return null;
  return results.join(" / ");
}

/********************************************************
 * 10) Junctional Scotoma (Strict Classic)
 ********************************************************/
