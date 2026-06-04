/*
 * output-lesion-map.js
 *
 * Dedicated lesion-site text mapping logic used by src/output.js.
 */
(function registerOutputLesionMap(globalScope) {
  function mapConditionToLesionCore(cond, rapdState = "none") {
    if (cond.includes("Full Fields of Vision")) {
      return "No clear field defect on screening.";
    }
    // If it's binocular total loss
    if (cond.includes("Binocular Blindness")) {
      const bilateralBase = "Likely bilateral severe pre-chiasmal disease.";
      return applyBilateralRapdConsistencyNote(bilateralBase, rapdState);
    }
    if (cond.includes("Monocular Blind Eye")) {
      const severeMonocular = cond.includes("Definite");
      return applyAnteriorRapdModifier(
        "Likely pre-chiasmal (retina/optic nerve).",
        cond,
        rapdState,
        { severeMonocular },
      );
    }
    if (cond.includes("Monocular Central Scotoma")) {
      return applyAnteriorRapdModifier(
        "Likely macular cause (haemorrhage/hole/fluid) or optic nerve.",
        cond,
        rapdState,
      );
    }
    if (cond.includes("Monocular Temporal Hemianopia")) {
      return applyAnteriorRapdModifier(
        "Likely pre-chiasmal (temporal side).",
        cond,
        rapdState,
      );
    }
    if (cond.includes("Monocular Nasal Hemianopia")) {
      return applyAnteriorRapdModifier(
        "Likely pre-chiasmal (nasal side).",
        cond,
        rapdState,
      );
    }
    if (cond.includes("Monocular") && cond.includes("Quadrantanopia")) {
      return applyAnteriorRapdModifier(
        "Likely focal pre-chiasmal defect.",
        cond,
        rapdState,
      );
    }
    if (cond.includes("Cecocentral-like Defect")) {
      return applyAnteriorRapdModifier(
        "Likely central retina/optic nerve involvement.",
        cond,
        rapdState,
      );
    }
    if (cond.includes("Bilateral Central Scotoma")) {
      const bilateralBase =
        "Likely bilateral macular or toxic/nutritional optic neuropathy.";
      return applyBilateralRapdConsistencyNote(bilateralBase, rapdState);
    }
    // -- Insert these for altitudinal patterns --
    if (cond.includes("Superior Altitudinal")) {
      // Superior field lost => lesion typically in the inferior retina / inferior nerve supply
      return "Likely optic nerve/retinal perfusion defect of the inferior half.";
    }
    if (cond.includes("Inferior Altitudinal")) {
      // Inferior field lost => lesion typically in the superior retina / superior nerve supply
      return "Likely optic nerve/retinal perfusion defect of the superior half.";
    }
    // Fallback if something says "Altitudinal" but doesn't specify
    if (cond.includes("Altitudinal")) {
      return "Likely optic nerve head/retinal vascular pattern.";
    }
    // TUNNEL VISION special cases
    if (cond.includes("Tunnel Vision")) {
      // Check if the word "Bilateral" also appears
      if (cond.includes("Bilateral")) {
        // Bilateral
        return "Likely peripheral retinal or advanced optic nerve disease.";
      } else {
        // Unilateral
        return "Likely advanced optic nerve disease.";
      }
    }
    if (cond.includes("Bitemporal Hemianopia")) {
      return applyBilateralRapdConsistencyNote(
        "Likely chiasmal compression of crossing nasal fibres.",
        rapdState,
      );
    }
    if (cond.includes("Bitemporal Quadrantanopia")) {
      return applyBilateralRapdConsistencyNote(
        "Likely partial chiasmal compression.",
        rapdState,
      );
    }
    if (cond.includes("Binasal Hemianopia")) {
      return applyBilateralRapdConsistencyNote(
        "Uncommon bilateral pattern: optic nerve/ocular or lateral chiasm.",
        rapdState,
      );
    }
    if (
      cond.includes("Homonymous Hemianopia") &&
      cond.includes("Incongruous")
    ) {
      if (rapdSupportsTractLocalization(cond, rapdState)) {
        return "Likely optic tract lesion (post-chiasmal); RAPD supports tract localisation.";
      }
      if (isUnilateralRapd(rapdState)) {
        return "Likely optic tract lesion (post-chiasmal). RAPD side does not match homonymous pattern; re-check.";
      }
      return "Likely optic tract lesion (post-chiasmal).";
    }
    if (cond.includes("Right Homonymous Hemianopia")) {
      if (rapdSupportsTractLocalization(cond, rapdState)) {
        return "Likely left post-chiasmal lesion; RAPD suggests left optic tract involvement.";
      }
      if (isUnilateralRapd(rapdState)) {
        return "Likely left post-chiasmal (radiations/occipital). RAPD side mismatch; re-check.";
      }
      return "Likely left post-chiasmal (radiations/occipital).";
    }
    if (cond.includes("Left Homonymous Hemianopia")) {
      if (rapdSupportsTractLocalization(cond, rapdState)) {
        return "Likely right post-chiasmal lesion; RAPD suggests right optic tract involvement.";
      }
      if (isUnilateralRapd(rapdState)) {
        return "Likely right post-chiasmal (radiations/occipital). RAPD side mismatch; re-check.";
      }
      return "Likely right post-chiasmal (radiations/occipital).";
    }
    if (cond.includes("Homonymous Hemianopia")) {
      return "Likely post-chiasmal lesion.";
    }
    if (cond.includes("Superior Quadrantanopia")) {
      return "Likely temporal (Meyer's loop) or lower calcarine lesion.";
    }
    if (cond.includes("Inferior Quadrantanopia")) {
      return "Likely parietal radiations or upper calcarine lesion.";
    }
    if (cond.includes("Junctional Scotoma")) {
      return "Likely optic nerve-chiasm junction lesion.";
    }

    if (cond.includes("Glaucoma-like")) {
      return "Nasal-predominant change with central sparing.";
    }
    if (
      cond.includes("Monocular Partial") ||
      cond.includes("Monocular Large")
    ) {
      return applyAnteriorRapdModifier(
        "Single-eye patch/multi-quadrant loss.",
        cond,
        rapdState,
      );
    }
    if (cond.includes("Mixed/Unclassified Field Defect")) {
      return "Mixed pattern. Repeat fields and reassess.";
    }
    return "";
  }

  globalScope.mapConditionToLesionCore = mapConditionToLesionCore;
})(typeof window !== "undefined" ? window : globalThis);
