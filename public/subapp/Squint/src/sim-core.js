/*
 * Pure simulator core helpers (no DOM state).
 */

(function attachSimCore(globalObj) {
  const BASE_PUPIL_SIZE = 32;

  const CONDITION_LIBRARY = {
    primary: [
      { label: "Exotropia (L)", value: "exotropia (large)" },
      { label: "Esotropia (L)", value: "esotropia (large)" },
      { label: "3rd nerve palsy", value: "3rd nerve palsy" },
      { label: "6th nerve palsy", value: "6th nerve palsy" },
      { label: "Unilateral dilated pupil", value: "unilateral dilated pupil" },
      { label: "Bilateral dilated pupils", value: "bilateral dilated pupils" },
      {
        label: "Bilateral constricted pupils",
        value: "bilateral constricted pupils",
      },
      { label: "Ptosis (Severe)", value: "ptosis (severe)" },
    ],
    intermediate: [
      { label: "Exotropia (M)", value: "exotropia (medium)" },
      { label: "Esotropia (M)", value: "esotropia (medium)" },
      { label: "Exophoria (S)", value: "exophoria (small)" },
      { label: "Esophoria (S)", value: "esophoria (small)" },
      { label: "Hypertropia (M)", value: "hypertropia (medium)" },
      { label: "Hypotropia (M)", value: "hypotropia (medium)" },
      { label: "Horner's syndrome", value: "horner's syndrome" },
      { label: "Ptosis (Moderate)", value: "ptosis (moderate)" },
      { label: "Adie's pupil", value: "adie's pupil" },
      { label: "Benign anisocoria", value: "benign anisocoria" },
      {
        label: "Pupil-sparing 3rd palsy",
        value: "pupil-sparing 3rd nerve palsy",
      },
      {
        label: "Partial 6th palsy (M)",
        value: "partial 6th nerve palsy (medium)",
      },
    ],
    advanced: [
      { label: "4th nerve palsy", value: "4th nerve palsy" },
      { label: "Mixed squint", value: "mixed squint" },
      {
        label: "Exophoria (decompensating)",
        value: "exophoria (decompensating)",
      },
      {
        label: "Esophoria (decompensating)",
        value: "esophoria (decompensating)",
      },
      {
        label: "Hyperphoria (decompensating)",
        value: "hyperphoria (decompensating)",
      },
      {
        label: "Hypophoria (decompensating)",
        value: "hypophoria (decompensating)",
      },
      { label: "Right hyperphoria", value: "right hyperphoria" },
      { label: "Left hyperphoria", value: "left hyperphoria" },
      { label: "Compressive 3rd palsy", value: "compressive 3rd nerve palsy" },
      {
        label: "Acute angle-closure pupil",
        value: "acute angle-closure pupil",
      },
      { label: "Argyll Robertson pupils", value: "argyll robertson pupils" },
      {
        label: "Pharmacological mydriasis",
        value: "pharmacological mydriasis",
      },
      { label: "Pharmacological miosis", value: "pharmacological miosis" },
      { label: "RAPD (RE subtle)", value: "rapd (re subtle)" },
      { label: "RAPD (RE marked)", value: "rapd (re marked)" },
      { label: "RAPD (LE subtle)", value: "rapd (le subtle)" },
      { label: "RAPD (LE marked)", value: "rapd (le marked)" },
      { label: "Traumatic mydriasis", value: "traumatic mydriasis" },
      { label: "Traumatic miotic pupil", value: "traumatic miotic pupil" },
      { label: "Traumatic peaked pupil", value: "traumatic peaked pupil" },
      { label: "Exotropia (S)", value: "exotropia (small)" },
      { label: "Esotropia (S)", value: "esotropia (small)" },
      { label: "Hypertropia (S)", value: "hypertropia (small)" },
      { label: "Hypotropia (S)", value: "hypotropia (small)" },
      { label: "Ptosis (Slight)", value: "ptosis (slight)" },
      {
        label: "Unilateral constricted pupil",
        value: "unilateral constricted pupil",
      },
      {
        label: "Partial 6th palsy (S)",
        value: "partial 6th nerve palsy (small)",
      },
      { label: "Myasthenic pattern", value: "myasthenic pattern" },
      {
        label: "Thyroid restrictive pattern",
        value: "thyroid restrictive pattern",
      },
      { label: "INO-like pattern", value: "ino-like pattern" },
      { label: "Cyclo pattern (RE in)", value: "cyclo pattern (re in)" },
      { label: "Cyclo pattern (RE out)", value: "cyclo pattern (re out)" },
      { label: "Cyclo pattern (LE in)", value: "cyclo pattern (le in)" },
      { label: "Cyclo pattern (LE out)", value: "cyclo pattern (le out)" },
      { label: "Nystagmus (H jerk)", value: "nystagmus (h jerk)" },
      { label: "Nystagmus (H pendular)", value: "nystagmus (h pendular)" },
      { label: "Nystagmus (H jerk fast)", value: "nystagmus (h jerk fast)" },
      { label: "Nystagmus (V jerk)", value: "nystagmus (v jerk)" },
      {
        label: "Nystagmus (Mixed pendular)",
        value: "nystagmus (mixed pendular)",
      },
      { label: "Latent nystagmus-like", value: "latent nystagmus-like" },
      {
        label: "Gaze-evoked nystagmus-like",
        value: "gaze-evoked nystagmus-like",
      },
      { label: "A-pattern esotropia", value: "a-pattern esotropia" },
      { label: "V-pattern esotropia", value: "v-pattern esotropia" },
      { label: "A-pattern exotropia", value: "a-pattern exotropia" },
      { label: "V-pattern exotropia", value: "v-pattern exotropia" },
      { label: "Brown syndrome-like", value: "brown syndrome-like" },
      { label: "Duane type I-like", value: "duane type i-like" },
      { label: "DVD-like pattern", value: "dvd-like pattern" },
    ],
  };

  function parseRGB(rgbStr) {
    const result = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(String(rgbStr || ""));
    if (!result) return { r: 0, g: 0, b: 0 };
    return {
      r: parseInt(result[1], 10),
      g: parseInt(result[2], 10),
      b: parseInt(result[3], 10),
    };
  }

  function brightenColor(color, factor) {
    return {
      r: Math.min(Math.round(color.r * factor), 255),
      g: Math.min(Math.round(color.g * factor), 255),
      b: Math.min(Math.round(color.b * factor), 255),
    };
  }

  function getReflexColor(value) {
    const colourStops = [
      {
        value: 0,
        color: {
          r: Math.round(173 * 0.7),
          g: Math.round(216 * 0.7),
          b: Math.round(230 * 0.7),
        },
      },
      {
        value: 33,
        color: { r: Math.round(255 * 0.7), g: Math.round(220 * 0.7), b: 0 },
      },
      {
        value: 66,
        color: { r: Math.round(218 * 0.7), g: Math.round(58 * 0.7), b: 0 },
      },
      { value: 100, color: { r: Math.round(255 * 0.7), g: 0, b: 0 } },
    ];

    let lower = colourStops[0];
    let upper = colourStops[colourStops.length - 1];
    for (let i = 0; i < colourStops.length - 1; i += 1) {
      if (value >= colourStops[i].value && value <= colourStops[i + 1].value) {
        lower = colourStops[i];
        upper = colourStops[i + 1];
        break;
      }
    }

    const factor =
      (value - lower.value) / Math.max(upper.value - lower.value, 1);
    const r = Math.round(
      lower.color.r + (upper.color.r - lower.color.r) * factor,
    );
    const g = Math.round(
      lower.color.g + (upper.color.g - lower.color.g) * factor,
    );
    const b = Math.round(
      lower.color.b + (upper.color.b - lower.color.b) * factor,
    );
    return `rgb(${r}, ${g}, ${b})`;
  }

  globalObj.SimCore = {
    BASE_PUPIL_SIZE,
    CONDITION_LIBRARY,
    parseRGB,
    brightenColor,
    getReflexColor,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
