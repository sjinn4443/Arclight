"use strict";
(() => {
  function at(e) {
    let t = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(e);
    return t
      ? { r: parseInt(t[1], 10), g: parseInt(t[2], 10), b: parseInt(t[3], 10) }
      : { r: 0, g: 0, b: 0 };
  }
  function rt(e, t) {
    return {
      r: Math.min(Math.round(e.r * t), 255),
      g: Math.min(Math.round(e.g * t), 255),
      b: Math.min(Math.round(e.b * t), 255),
    };
  }
  function it(e) {
    let t = [
        {
          value: 0,
          color: {
            r: Math.round(121.1),
            g: Math.round(151.2),
            b: Math.round(161),
          },
        },
        {
          value: 33,
          color: { r: Math.round(178.5), g: Math.round(154), b: Math.round(0) },
        },
        {
          value: 66,
          color: {
            r: Math.round(152.6),
            g: Math.round(40.599999999999994),
            b: Math.round(0),
          },
        },
        {
          value: 100,
          color: { r: Math.round(178.5), g: Math.round(0), b: Math.round(0) },
        },
      ],
      a,
      i;
    for (let E = 0; E < t.length - 1; E += 1)
      if (e >= t[E].value && e <= t[E + 1].value) {
        ((a = t[E]), (i = t[E + 1]));
        break;
      }
    if (!a || !i) return "rgb(255, 0, 0)";
    let c = (e - a.value) / (i.value - a.value),
      u = Math.round(a.color.r + (i.color.r - a.color.r) * c),
      x = Math.round(a.color.g + (i.color.g - a.color.g) * c),
      d = Math.round(a.color.b + (i.color.b - a.color.b) * c);
    return `rgb(${u}, ${x}, ${d})`;
  }
  var Wa = {
      r: Math.round(152.6),
      g: Math.round(40.599999999999994),
      b: Math.round(0),
    },
    nt = "zero";
  var Re = [
      {
        label: "Sphere",
        category: "sphere",
        options: [
          { value: "high-minus", label: "High minus (---)" },
          { value: "minus", label: "Minus (-)" },
          { value: "zero", label: "Neutral (0)" },
          { value: "plus", label: "Plus (+)" },
          { value: "high-plus", label: "High plus (+++)" },
        ],
      },
      {
        label: "Regular astigmatism",
        category: "astig",
        options: [
          { value: "low-cylinder", label: "Low astigmatism (Cyl)" },
          { value: "high-cylinder", label: "High astigmatism (Cyl++)" },
        ],
      },
      {
        label: "Irregular reflex",
        category: "irregular",
        options: [
          { value: "small-scissors", label: "Small scissors reflex" },
          {
            value: "keratoconus",
            label: "Keratoconus (large scissors reflex)",
          },
          {
            value: "corneal-scar",
            label: "Corneal scar (large diffuse reflex)",
          },
          { value: "poor-tear-film", label: "Poor tear film" },
        ],
      },
      {
        label: "Other conditions",
        category: "other",
        options: [
          { value: "acg", label: "ACG (vertical oval pupil)" },
          { value: "aniridia", label: "Aniridia" },
          { value: "anisometropia", label: "Anisometropia (RE+, LE-)" },
          { value: "aphakia", label: "Aphakia" },
          { value: "iris-transillumination", label: "Iris transillumination" },
          { value: "nasal-coloboma", label: "Nasal coloboma" },
          { value: "small-pupils", label: "Small pupils" },
        ],
      },
      {
        label: "Media and fundus",
        category: "media-fundus",
        options: [
          {
            value: "small-cortical-cataract",
            label: "Small cortical cataract",
          },
          { value: "big-cortical-cataract", label: "Big cortical cataract" },
          {
            value: "central-sub-cortical-cataract",
            label: "Posterior subcapsular cataract",
          },
          {
            value: "posterior-pole-cataract",
            label: "Posterior pole cataract",
          },
          { value: "dense-cataract", label: "Dense cataract" },
          { value: "floaters", label: "Vitreous floaters" },
          { value: "vitreous-haemorrhage", label: "Vitreous haemorrhage" },
          { value: "leucocoria", label: "Leucocoria" },
          {
            value: "partial-retinal-detachment",
            label: "Partial retinal detachment",
          },
          {
            value: "posterior-capsular-thickening",
            label: "Posterior capsular thickening (IOL)",
          },
        ],
      },
    ],
    ot = Re.flatMap(({ category: e, options: t }) =>
      t.map((a) => ({ ...a, category: e })),
    ),
    Xa = ot.filter(({ value: e }) => e !== "anisometropia"),
    Ya = new Set(ot.map(({ value: e }) => e)),
    sa = new Set(["low-cylinder", "high-cylinder"]),
    ja = new Set([...sa, "small-scissors", "keratoconus", "corneal-scar"]);
  var la = {
    "aao-retinoscopy": {
      label: "AAO EyeWiki: Retinoscopy",
      url: "https://eyewiki.aao.org/Retinoscopy",
      status: "current-clinical-reference",
    },
    "sauron-optics-contract-v1": {
      label: "Sauron working-distance and meridional-power contract",
      url: null,
      status: "engineering-formula-reviewed",
    },
    "sauron-pathology-visuals-v1": {
      label: "Sauron pathology-visual teaching contract",
      url: null,
      status: "pending-independent-clinical-sign-off",
    },
  };
  var st = {
      primary: [
        {
          question:
            'In plane mirror retinoscopy, a "with" reflex is neutralised with:',
          options: [
            "Plus or less minus",
            "Minus or less plus",
            "Axis change",
            "No lens change",
          ],
          answer: 0,
        },
        {
          question:
            'In plane mirror retinoscopy, an "against" reflex is neutralised with:',
          options: [
            "Plus or less minus",
            "Minus or less plus",
            "Axis change",
            "No lens change",
          ],
          answer: 1,
        },
        {
          question: "Neutrality at the working distance means:",
          options: [
            "No directional reflex movement",
            "The reflex still moves with the streak",
            "The reflex still moves against the streak",
            "No red reflex is visible",
          ],
          answer: 0,
        },
        {
          question: "Sweeping the streak mainly changes the:",
          options: [
            "Streak position",
            "Streak angle",
            "Working distance",
            "Pupil size",
          ],
          answer: 0,
        },
        {
          question: "Rotating the streak mainly changes the:",
          options: [
            "Streak angle",
            "Streak position",
            "Working distance",
            "Pupil size",
          ],
          answer: 0,
        },
        {
          question: "At 50 cm, the working distance allowance is:",
          options: ["0.50 D", "1.00 D", "1.50 D", "2.00 D"],
          answer: 3,
        },
        {
          question: "Why should working distance stay steady?",
          options: [
            "It changes the working distance allowance",
            "It sets the streak angle",
            "It keeps the reflex centred on the pupil",
            "It fixes the pupil size",
          ],
          answer: 0,
        },
        {
          question: "As neutrality is approached, the reflex is usually:",
          options: [
            "Brighter, broader and faster",
            "Darker, narrower and slower",
            "Brighter, narrower and slower",
            "Dimmer, broader and slower",
          ],
          answer: 0,
        },
      ],
      intermediate: [
        {
          question: "At 67 cm, you convert gross retinoscopy to net by:",
          options: [
            "Adding 1.50 D",
            "Subtracting 1.50 D",
            "Adding 2.00 D",
            "Subtracting 2.00 D",
          ],
          answer: 1,
        },
        {
          question: "As plus lenses are added, neutrality lies:",
          options: [
            'At the first clearly "against" lens',
            'Between the last clearly "with" lens and the first clearly "against" lens',
            'At the last clearly "with" lens',
            "At plano (0.00 D)",
          ],
          answer: 1,
        },
        {
          question: "Why rotate the streak during retinoscopy?",
          options: [
            "To align with principal meridians",
            "To keep the beam in the middle of the pupil",
            "To change the working distance allowance",
            "To make the pupil larger",
          ],
          answer: 0,
        },
        {
          question:
            "One meridian neutralises at +2.00 D and the perpendicular meridian at +0.50 D. Cylinder power is:",
          options: ["0.50 D", "1.00 D", "1.50 D", "2.50 D"],
          answer: 2,
        },
        {
          question: "Which endpoint method is most reliable in practice?",
          options: [
            "Stop at the first bright reflex",
            "Bracket neutrality with small lens steps such as +/- 0.25 D",
            "Use whole-dioptre steps only",
            "Rely on brightness alone",
          ],
          answer: 1,
        },
        {
          question:
            "If a small pupil makes the reflex difficult to judge, the safest next step is:",
          options: [
            "Optimise fixation, illumination and viewing conditions, then dilate only when appropriate and authorised",
            "Move farther back and accept a dimmer view",
            "Judge neutrality from brightness alone",
            "Rotate to 0 degrees and continue",
          ],
          answer: 0,
        },
        {
          question:
            "At 67 cm, gross neutralities are +1.75 D @ 90 and +0.25 D @ 180. Net minus-cylinder form is:",
          options: [
            "+0.25 / -1.50 x 90",
            "+0.25 / -1.50 x 180",
            "-1.25 / +1.50 x 90",
            "+1.75 / -1.50 x 90",
          ],
          answer: 0,
        },
        {
          question:
            "A practical sign that the streak is not aligned with a principal meridian is:",
          options: [
            "Break or skew of the reflex relative to the streak",
            "A brighter reflex without any change in axis",
            "Equal speed in every meridian",
            "A wider pupil than expected",
          ],
          answer: 0,
        },
      ],
      advanced: [
        {
          question:
            "Working distance is 50 cm. Gross neutrality in one meridian is +3.00 D. Net meridional power is:",
          options: ["+3.00 D", "+2.00 D", "+1.00 D", "-1.00 D"],
          answer: 2,
        },
        {
          question:
            "At 67 cm, gross meridional powers are +2.25 D @ 90 and +0.75 D @ 180. Net refraction in minus-cylinder form is:",
          options: [
            "+0.75 / -1.50 x 90",
            "+0.75 / -1.50 x 180",
            "-0.75 / -1.50 x 90",
            "+0.75 / -0.75 x 90",
          ],
          answer: 0,
        },
        {
          question:
            "At 67 cm, gross meridional powers are +1.00 D @ 180 and -0.50 D @ 90. Net refraction in minus-cylinder form is:",
          options: [
            "-0.50 / -1.50 x 180",
            "-2.00 / -1.50 x 90",
            "-0.50 / +1.50 x 180",
            "+0.50 / -1.50 x 90",
          ],
          answer: 0,
        },
        {
          question:
            "Axis refinement is most accurate when the streak is oriented so that the reflex:",
          options: [
            "Appears as the narrowest, least broken band",
            "Looks circular and diffuse",
            "Shows the greatest shimmer",
            "Becomes equally broad at every axis",
          ],
          answer: 0,
        },
        {
          question: "For high astigmatism, the best sequence is:",
          options: [
            "Estimate sphere first then refine axis later",
            "Neutralise one meridian then infer the second",
            "Neutralise each principal meridian, apply working distance correction and convert to sphere and cylinder form",
            "Apply working distance correction before neutralising",
          ],
          answer: 2,
        },
        {
          question:
            "In this simulator, which cue represents partial retinal detachment?",
          options: [
            "A fixed dark sector with reflex confined to the remaining pupil",
            "A uniformly bright reflex in all meridians",
            "A pure central dark spot only",
            "A scissoring reflex that changes axis",
          ],
          answer: 0,
        },
        {
          question:
            "Which finding most strongly suggests irregular astigmatism?",
          options: [
            "Scissoring reflex",
            "Equal neutrality in both meridians",
            "A broad bright reflex near neutrality",
            "A stable with movement in one meridian only",
          ],
          answer: 0,
        },
        {
          question:
            "In this simulator, posterior subcapsular cataract is represented by:",
          options: [
            "A moving reflex with a dull central defect",
            "A uniformly dull reflex with no central change",
            "A pure scissoring reflex",
            "A uniformly bright reflex",
          ],
          answer: 0,
        },
        {
          question:
            "In this simulator, posterior pole cataract is represented by:",
          options: [
            "A very dull reflex with a dense irregular central defect",
            "A uniformly bright reflex in every meridian",
            "A pure scissoring reflex",
            "A mild diffuse haze with no central opacity",
          ],
          answer: 0,
        },
        {
          question: "Aphakia is most likely to show:",
          options: [
            "Slow with movement requiring large plus to neutralise",
            "Against movement requiring large minus to neutralise",
            "Immediate neutrality with no lens",
            "A fixed scissoring reflex",
          ],
          answer: 0,
        },
      ],
    },
    ca = {
      primary: [
        "With movement is neutralised by adding plus power or reducing minus power until movement disappears.",
        "Against movement is neutralised by adding minus power or reducing plus power until movement disappears.",
        "At neutrality the reflex fills the pupil without a discernible direction of movement at the working distance.",
        "Sweeping translates the streak across the pupil while keeping its selected meridian unchanged.",
        "Rotating the streak changes the meridian being assessed rather than the working distance or pupil size.",
        "A 50 cm working distance has a dioptric equivalent of 2.00 D.",
        "The working-distance correction is the inverse of distance in metres, so an unstable distance changes the correction.",
        "Near neutrality the reflex generally becomes brighter, broader and faster before movement reverses beyond the endpoint.",
      ],
      intermediate: [
        "A 67 cm working distance is approximately 1.50 D, which is subtracted from each gross meridional finding.",
        "Bracketing uses the last clear with movement and first clear against movement to refine the neutral endpoint.",
        "Rotating the streak helps identify and align with the principal meridians before each is neutralised.",
        "The difference between +2.00 D and +0.50 D is 1.50 D, which is the cylinder magnitude.",
        "Small lens steps on either side of neutrality are more reliable than brightness alone for locating the endpoint.",
        "Start by improving ordinary viewing conditions. Pharmacological dilation requires an appropriate indication, competence and local protocol.",
        "After subtracting 1.50 D from each meridian, the powers are +0.25 D at 90 and -1.25 D at 180, giving +0.25 / -1.50 x 90.",
        "A break or skew between the retinal reflex and streak suggests that the streak is not aligned with a principal meridian.",
      ],
      advanced: [
        "Subtracting the 2.00 D working-distance allowance from +3.00 D leaves a net meridional power of +1.00 D.",
        "Subtracting 1.50 D gives +0.75 D at 90 and -0.75 D at 180, which is +0.75 / -1.50 x 90.",
        "Subtracting 1.50 D gives -0.50 D at 180 and -2.00 D at 90, which is -0.50 / -1.50 x 180.",
        "The narrowest and least broken alignment helps identify the principal meridian before power is refined.",
        "Each principal meridian is neutralised first, then the working-distance correction is applied before conversion to sphero-cylinder form.",
        "The simulator uses a fixed dark sector to teach a limited reflex from its partial-retinal-detachment case. This visual still awaits independent clinical sign-off.",
        "A scissoring reflex is a recognised clue to irregular astigmatism, though the cause still needs full examination.",
        "The simulator uses a moving reflex with a dull central defect for its posterior-subcapsular-cataract teaching case. This representation still awaits clinical sign-off.",
        "The simulator uses a dense irregular central defect for its posterior-pole-cataract teaching case. This representation still awaits clinical sign-off.",
        "Without the crystalline lens, the eye is markedly hyperopic and typically requires substantial plus power to neutralise.",
      ],
    };
  function ua(e, t) {
    return e === "advanced" && t >= 5 && t <= 8
      ? "sauron-pathology-visuals-v1"
      : /working distance|gross|net|meridian neutralises|Cylinder power/i.test(
            st[e][t].question,
          )
        ? "sauron-optics-contract-v1"
        : "aao-retinoscopy";
  }
  var Qa = Object.fromEntries(
    Object.entries(st).map(([e, t]) => [
      e,
      t.map((a, i) => {
        let c = ua(e, i);
        return {
          ...a,
          id: `sauron-${e}-${String(i + 1).padStart(2, "0")}`,
          explanation: ca[e][i],
          source: c,
          reviewStatus: la[c].status,
        };
      }),
    ]),
  );
  var lt = {
      r: Math.round(152.6),
      g: Math.round(40.599999999999994),
      b: Math.round(0),
    },
    ke = "zero",
    ct = {
      retStreakOffset: 0,
      retStreakRotation: 0,
      currentRefraction: ke,
      cylinderAxisDeg: null,
      cataractLevel: 0,
      nystagmusLevel: 0,
      activeRetEye: "left",
    },
    da = [
      {
        label: "Sphere",
        category: "sphere",
        options: [
          { value: "high-minus", label: "High minus (---)" },
          { value: "minus", label: "Minus (-)" },
          { value: "zero", label: "Neutral (0)" },
          { value: "plus", label: "Plus (+)" },
          { value: "high-plus", label: "High plus (+++)" },
        ],
      },
      {
        label: "Regular astigmatism",
        category: "astig",
        options: [
          { value: "low-cylinder", label: "Low astigmatism (Cyl)" },
          { value: "high-cylinder", label: "High astigmatism (Cyl++)" },
        ],
      },
      {
        label: "Irregular reflex",
        category: "irregular",
        options: [
          { value: "small-scissors", label: "Small scissors reflex" },
          {
            value: "keratoconus",
            label: "Keratoconus (large scissors reflex)",
          },
          {
            value: "corneal-scar",
            label: "Corneal scar (large diffuse reflex)",
          },
          { value: "poor-tear-film", label: "Poor tear film" },
        ],
      },
      {
        label: "Other conditions",
        category: "other",
        options: [
          { value: "acg", label: "ACG (vertical oval pupil)" },
          { value: "aniridia", label: "Aniridia" },
          { value: "anisometropia", label: "Anisometropia (RE+, LE-)" },
          { value: "aphakia", label: "Aphakia" },
          { value: "iris-transillumination", label: "Iris transillumination" },
          { value: "nasal-coloboma", label: "Nasal coloboma" },
          { value: "small-pupils", label: "Small pupils" },
        ],
      },
      {
        label: "Media and fundus",
        category: "media-fundus",
        options: [
          {
            value: "small-cortical-cataract",
            label: "Small cortical cataract",
          },
          { value: "big-cortical-cataract", label: "Big cortical cataract" },
          {
            value: "central-sub-cortical-cataract",
            label: "Posterior subcapsular cataract",
          },
          {
            value: "posterior-pole-cataract",
            label: "Posterior pole cataract",
          },
          { value: "dense-cataract", label: "Dense cataract" },
          { value: "floaters", label: "Vitreous floaters" },
          { value: "vitreous-haemorrhage", label: "Vitreous haemorrhage" },
          { value: "leucocoria", label: "Leucocoria" },
          {
            value: "partial-retinal-detachment",
            label: "Partial retinal detachment",
          },
          {
            value: "posterior-capsular-thickening",
            label: "Posterior capsular thickening (IOL)",
          },
        ],
      },
    ],
    he = da.flatMap(({ category: e, options: t }) =>
      t.map((a) => ({ ...a, category: e })),
    ),
    Oe = he.filter(({ value: e }) => e !== "anisometropia"),
    ut = new Set(he.map(({ value: e }) => e)),
    _e = new Set(["low-cylinder", "high-cylinder"]),
    dt = new Set([..._e, "small-scissors", "keratoconus", "corneal-scar"]),
    Pe = {
      primary: { title: "Primary", passMark: 3, questionCount: 5 },
      intermediate: { title: "Intermediate", passMark: 4, questionCount: 6 },
      advanced: { title: "Advanced", passMark: 6, questionCount: 8 },
    },
    De = {
      "aao-retinoscopy": {
        label: "AAO EyeWiki: Retinoscopy",
        url: "https://eyewiki.aao.org/Retinoscopy",
        status: "current-clinical-reference",
      },
      "sauron-optics-contract-v1": {
        label: "Sauron working-distance and meridional-power contract",
        url: null,
        status: "engineering-formula-reviewed",
      },
      "sauron-pathology-visuals-v1": {
        label: "Sauron pathology-visual teaching contract",
        url: null,
        status: "pending-independent-clinical-sign-off",
      },
    },
    Ce = [20, 15, 10, 8, 6],
    gt = {
      primary: [
        {
          question:
            'In plane mirror retinoscopy, a "with" reflex is neutralised with:',
          options: [
            "Plus or less minus",
            "Minus or less plus",
            "Axis change",
            "No lens change",
          ],
          answer: 0,
        },
        {
          question:
            'In plane mirror retinoscopy, an "against" reflex is neutralised with:',
          options: [
            "Plus or less minus",
            "Minus or less plus",
            "Axis change",
            "No lens change",
          ],
          answer: 1,
        },
        {
          question: "Neutrality at the working distance means:",
          options: [
            "No directional reflex movement",
            "The reflex still moves with the streak",
            "The reflex still moves against the streak",
            "No red reflex is visible",
          ],
          answer: 0,
        },
        {
          question: "Sweeping the streak mainly changes the:",
          options: [
            "Streak position",
            "Streak angle",
            "Working distance",
            "Pupil size",
          ],
          answer: 0,
        },
        {
          question: "Rotating the streak mainly changes the:",
          options: [
            "Streak angle",
            "Streak position",
            "Working distance",
            "Pupil size",
          ],
          answer: 0,
        },
        {
          question: "At 50 cm, the working distance allowance is:",
          options: ["0.50 D", "1.00 D", "1.50 D", "2.00 D"],
          answer: 3,
        },
        {
          question: "Why should working distance stay steady?",
          options: [
            "It changes the working distance allowance",
            "It sets the streak angle",
            "It keeps the reflex centred on the pupil",
            "It fixes the pupil size",
          ],
          answer: 0,
        },
        {
          question: "As neutrality is approached, the reflex is usually:",
          options: [
            "Brighter, broader and faster",
            "Darker, narrower and slower",
            "Brighter, narrower and slower",
            "Dimmer, broader and slower",
          ],
          answer: 0,
        },
      ],
      intermediate: [
        {
          question: "At 67 cm, you convert gross retinoscopy to net by:",
          options: [
            "Adding 1.50 D",
            "Subtracting 1.50 D",
            "Adding 2.00 D",
            "Subtracting 2.00 D",
          ],
          answer: 1,
        },
        {
          question: "As plus lenses are added, neutrality lies:",
          options: [
            'At the first clearly "against" lens',
            'Between the last clearly "with" lens and the first clearly "against" lens',
            'At the last clearly "with" lens',
            "At plano (0.00 D)",
          ],
          answer: 1,
        },
        {
          question: "Why rotate the streak during retinoscopy?",
          options: [
            "To align with principal meridians",
            "To keep the beam in the middle of the pupil",
            "To change the working distance allowance",
            "To make the pupil larger",
          ],
          answer: 0,
        },
        {
          question:
            "One meridian neutralises at +2.00 D and the perpendicular meridian at +0.50 D. Cylinder power is:",
          options: ["0.50 D", "1.00 D", "1.50 D", "2.50 D"],
          answer: 2,
        },
        {
          question: "Which endpoint method is most reliable in practice?",
          options: [
            "Stop at the first bright reflex",
            "Bracket neutrality with small lens steps such as +/- 0.25 D",
            "Use whole-dioptre steps only",
            "Rely on brightness alone",
          ],
          answer: 1,
        },
        {
          question:
            "If a small pupil makes the reflex difficult to judge, the safest next step is:",
          options: [
            "Optimise fixation, illumination and viewing conditions, then dilate only when appropriate and authorised",
            "Move farther back and accept a dimmer view",
            "Judge neutrality from brightness alone",
            "Rotate to 0 degrees and continue",
          ],
          answer: 0,
        },
        {
          question:
            "At 67 cm, gross neutralities are +1.75 D @ 90 and +0.25 D @ 180. Net minus-cylinder form is:",
          options: [
            "+0.25 / -1.50 x 90",
            "+0.25 / -1.50 x 180",
            "-1.25 / +1.50 x 90",
            "+1.75 / -1.50 x 90",
          ],
          answer: 0,
        },
        {
          question:
            "A practical sign that the streak is not aligned with a principal meridian is:",
          options: [
            "Break or skew of the reflex relative to the streak",
            "A brighter reflex without any change in axis",
            "Equal speed in every meridian",
            "A wider pupil than expected",
          ],
          answer: 0,
        },
      ],
      advanced: [
        {
          question:
            "Working distance is 50 cm. Gross neutrality in one meridian is +3.00 D. Net meridional power is:",
          options: ["+3.00 D", "+2.00 D", "+1.00 D", "-1.00 D"],
          answer: 2,
        },
        {
          question:
            "At 67 cm, gross meridional powers are +2.25 D @ 90 and +0.75 D @ 180. Net refraction in minus-cylinder form is:",
          options: [
            "+0.75 / -1.50 x 90",
            "+0.75 / -1.50 x 180",
            "-0.75 / -1.50 x 90",
            "+0.75 / -0.75 x 90",
          ],
          answer: 0,
        },
        {
          question:
            "At 67 cm, gross meridional powers are +1.00 D @ 180 and -0.50 D @ 90. Net refraction in minus-cylinder form is:",
          options: [
            "-0.50 / -1.50 x 180",
            "-2.00 / -1.50 x 90",
            "-0.50 / +1.50 x 180",
            "+0.50 / -1.50 x 90",
          ],
          answer: 0,
        },
        {
          question:
            "Axis refinement is most accurate when the streak is oriented so that the reflex:",
          options: [
            "Appears as the narrowest, least broken band",
            "Looks circular and diffuse",
            "Shows the greatest shimmer",
            "Becomes equally broad at every axis",
          ],
          answer: 0,
        },
        {
          question: "For high astigmatism, the best sequence is:",
          options: [
            "Estimate sphere first then refine axis later",
            "Neutralise one meridian then infer the second",
            "Neutralise each principal meridian, apply working distance correction and convert to sphere and cylinder form",
            "Apply working distance correction before neutralising",
          ],
          answer: 2,
        },
        {
          question:
            "In this simulator, which cue represents partial retinal detachment?",
          options: [
            "A fixed dark sector with reflex confined to the remaining pupil",
            "A uniformly bright reflex in all meridians",
            "A pure central dark spot only",
            "A scissoring reflex that changes axis",
          ],
          answer: 0,
        },
        {
          question:
            "Which finding most strongly suggests irregular astigmatism?",
          options: [
            "Scissoring reflex",
            "Equal neutrality in both meridians",
            "A broad bright reflex near neutrality",
            "A stable with movement in one meridian only",
          ],
          answer: 0,
        },
        {
          question:
            "In this simulator, posterior subcapsular cataract is represented by:",
          options: [
            "A moving reflex with a dull central defect",
            "A uniformly dull reflex with no central change",
            "A pure scissoring reflex",
            "A uniformly bright reflex",
          ],
          answer: 0,
        },
        {
          question:
            "In this simulator, posterior pole cataract is represented by:",
          options: [
            "A very dull reflex with a dense irregular central defect",
            "A uniformly bright reflex in every meridian",
            "A pure scissoring reflex",
            "A mild diffuse haze with no central opacity",
          ],
          answer: 0,
        },
        {
          question: "Aphakia is most likely to show:",
          options: [
            "Slow with movement requiring large plus to neutralise",
            "Against movement requiring large minus to neutralise",
            "Immediate neutrality with no lens",
            "A fixed scissoring reflex",
          ],
          answer: 0,
        },
      ],
    },
    ga = {
      primary: [
        "With movement is neutralised by adding plus power or reducing minus power until movement disappears.",
        "Against movement is neutralised by adding minus power or reducing plus power until movement disappears.",
        "At neutrality the reflex fills the pupil without a discernible direction of movement at the working distance.",
        "Sweeping translates the streak across the pupil while keeping its selected meridian unchanged.",
        "Rotating the streak changes the meridian being assessed rather than the working distance or pupil size.",
        "A 50 cm working distance has a dioptric equivalent of 2.00 D.",
        "The working-distance correction is the inverse of distance in metres, so an unstable distance changes the correction.",
        "Near neutrality the reflex generally becomes brighter, broader and faster before movement reverses beyond the endpoint.",
      ],
      intermediate: [
        "A 67 cm working distance is approximately 1.50 D, which is subtracted from each gross meridional finding.",
        "Bracketing uses the last clear with movement and first clear against movement to refine the neutral endpoint.",
        "Rotating the streak helps identify and align with the principal meridians before each is neutralised.",
        "The difference between +2.00 D and +0.50 D is 1.50 D, which is the cylinder magnitude.",
        "Small lens steps on either side of neutrality are more reliable than brightness alone for locating the endpoint.",
        "Start by improving ordinary viewing conditions. Pharmacological dilation requires an appropriate indication, competence and local protocol.",
        "After subtracting 1.50 D from each meridian, the powers are +0.25 D at 90 and -1.25 D at 180, giving +0.25 / -1.50 x 90.",
        "A break or skew between the retinal reflex and streak suggests that the streak is not aligned with a principal meridian.",
      ],
      advanced: [
        "Subtracting the 2.00 D working-distance allowance from +3.00 D leaves a net meridional power of +1.00 D.",
        "Subtracting 1.50 D gives +0.75 D at 90 and -0.75 D at 180, which is +0.75 / -1.50 x 90.",
        "Subtracting 1.50 D gives -0.50 D at 180 and -2.00 D at 90, which is -0.50 / -1.50 x 180.",
        "The narrowest and least broken alignment helps identify the principal meridian before power is refined.",
        "Each principal meridian is neutralised first, then the working-distance correction is applied before conversion to sphero-cylinder form.",
        "The simulator uses a fixed dark sector to teach a limited reflex from its partial-retinal-detachment case. This visual still awaits independent clinical sign-off.",
        "A scissoring reflex is a recognised clue to irregular astigmatism, though the cause still needs full examination.",
        "The simulator uses a moving reflex with a dull central defect for its posterior-subcapsular-cataract teaching case. This representation still awaits clinical sign-off.",
        "The simulator uses a dense irregular central defect for its posterior-pole-cataract teaching case. This representation still awaits clinical sign-off.",
        "Without the crystalline lens, the eye is markedly hyperopic and typically requires substantial plus power to neutralise.",
      ],
    };
  function pa(e, t) {
    return e === "advanced" && t >= 5 && t <= 8
      ? "sauron-pathology-visuals-v1"
      : /working distance|gross|net|meridian neutralises|Cylinder power/i.test(
            gt[e][t].question,
          )
        ? "sauron-optics-contract-v1"
        : "aao-retinoscopy";
  }
  var pt = Object.fromEntries(
    Object.entries(gt).map(([e, t]) => [
      e,
      t.map((a, i) => {
        let c = pa(e, i);
        return {
          ...a,
          id: `sauron-${e}-${String(i + 1).padStart(2, "0")}`,
          explanation: ga[e][i],
          source: c,
          reviewStatus: De[c].status,
        };
      }),
    ]),
  );
  var Be = {
      primary: {
        label: "Primary cases",
        shortLabel: "Primary",
        marker: "P",
        order: 1,
      },
      intermediate: {
        label: "Intermediate cases",
        shortLabel: "Intermediate",
        marker: "I",
        order: 2,
      },
      advanced: {
        label: "Advanced cases",
        shortLabel: "Advanced",
        marker: "A",
        order: 3,
      },
    },
    ma = {
      "high-minus": "primary",
      minus: "primary",
      zero: "primary",
      plus: "primary",
      "high-plus": "primary",
      "low-cylinder": "intermediate",
      "high-cylinder": "intermediate",
      anisometropia: "intermediate",
      "small-pupils": "intermediate",
      "small-scissors": "intermediate",
      "poor-tear-film": "intermediate",
      "small-cortical-cataract": "intermediate",
      "big-cortical-cataract": "intermediate",
      "dense-cataract": "intermediate",
      floaters: "intermediate",
      "central-sub-cortical-cataract": "advanced",
      keratoconus: "advanced",
      "corneal-scar": "advanced",
      acg: "advanced",
      aniridia: "advanced",
      aphakia: "advanced",
      "iris-transillumination": "advanced",
      "nasal-coloboma": "advanced",
      "posterior-pole-cataract": "advanced",
      "vitreous-haemorrhage": "advanced",
      leucocoria: "advanced",
      "partial-retinal-detachment": "advanced",
      "posterior-capsular-thickening": "advanced",
    },
    fa = Object.freeze({
      acg: Object.freeze({
        title: "Acute angle-closure warning",
        body: "The exaggerated oval is a stylised teaching cue, not a diagnostic pupil shape. A painful red eye with a fixed or poorly reactive mid-dilated pupil is an ocular emergency. This simulation does not diagnose angle closure; arrange urgent ophthalmic assessment.",
      }),
      leucocoria: Object.freeze({
        title: "Abnormal white reflex",
        body: "A white or absent red reflex, particularly in a child, requires urgent ophthalmic assessment. Causes include cataract, retinal disease and intraocular tumour.",
      }),
      "vitreous-haemorrhage": Object.freeze({
        title: "Vitreous haemorrhage warning",
        body: "A suddenly darkened reflex with new floaters or loss of vision may reflect vitreous haemorrhage and underlying retinal pathology. Arrange urgent ophthalmic assessment.",
      }),
      "partial-retinal-detachment": Object.freeze({
        title: "Retinal detachment warning",
        body: "A fixed dark sector with symptoms suggesting retinal detachment requires urgent ophthalmic assessment. The simulator appearance is illustrative only.",
      }),
    }),
    ha = {
      "high-minus": "Slow against movement with a narrow reflex.",
      minus: "Against movement before neutralisation.",
      zero: "No directional movement at neutrality.",
      plus: "With movement before neutralisation.",
      "high-plus": "Slow broad with movement requiring more plus.",
      "low-cylinder":
        "Stylised example: opposite movement in the two principal meridians.",
      "high-cylinder":
        "Stylised example: stronger change between the two principal meridians.",
      anisometropia: "Different reflex behaviour between right and left eyes.",
      "small-pupils": "Reduced aperture makes the reflex harder to judge.",
      "small-scissors": "Subtle split reflex with irregular movement.",
      "poor-tear-film": "Unstable shimmering reflex surface.",
      "small-cortical-cataract":
        "Peripheral cortical opacity crossing the reflex.",
      "big-cortical-cataract": "More extensive cortical spokes.",
      "central-sub-cortical-cataract":
        "Central posterior opacity dulling the reflex.",
      keratoconus: "Large scissors reflex with marked irregularity.",
      "corneal-scar": "Diffuse corneal haze disrupting the streak.",
      acg: "Stylised vertical oval pupil with abnormal reflex behaviour.",
      aniridia: "Large abnormal aperture with unstable reflex detail.",
      aphakia: "High plus behaviour with altered pupil optics.",
      "iris-transillumination":
        "Peripheral iris light leak alongside the reflex.",
      "nasal-coloboma": "Notched pupil aperture affecting the reflex edge.",
      "posterior-pole-cataract": "Dense central posterior pole defect.",
      "dense-cataract": "Very dull reflex through dense media opacity.",
      floaters: "Mobile vitreous shadows over the reflex.",
      "vitreous-haemorrhage": "Dark vitreous opacity reducing the view.",
      leucocoria: "White reflex appearance rather than normal red-orange.",
      "partial-retinal-detachment":
        "Fixed dark sector with remaining reflex visible.",
      "posterior-capsular-thickening":
        "IOL/capsule haze reducing reflex clarity.",
    },
    ba = new Set([
      "zero",
      "plus",
      "high-plus",
      "minus",
      "low-cylinder",
      "anisometropia",
      "small-pupils",
      "central-sub-cortical-cataract",
      "dense-cataract",
      "leucocoria",
    ]),
    ya = [
      "zero",
      "minus",
      "plus",
      "high-minus",
      "high-plus",
      "low-cylinder",
      "high-cylinder",
      "anisometropia",
      "small-pupils",
      "small-scissors",
      "poor-tear-film",
      "small-cortical-cataract",
      "big-cortical-cataract",
      "dense-cataract",
      "floaters",
      "keratoconus",
      "corneal-scar",
      "acg",
      "aniridia",
      "aphakia",
      "iris-transillumination",
      "nasal-coloboma",
      "central-sub-cortical-cataract",
      "posterior-pole-cataract",
      "vitreous-haemorrhage",
      "leucocoria",
      "partial-retinal-detachment",
      "posterior-capsular-thickening",
    ],
    xa = new Map(ya.map((e, t) => [e, t])),
    Me = he
      .map((e) => {
        var a;
        let t = ma[e.value] || "advanced";
        return {
          ...e,
          order: (a = xa.get(e.value)) != null ? a : Number.MAX_SAFE_INTEGER,
          level: t,
          levelLabel: Be[t].shortLabel,
          levelMarker: Be[t].marker,
          summary: ha[e.value] || e.label,
          safetyNote: fa[e.value] || null,
          thumbnailSrc: `assets/case-thumbnails/${e.value}.webp?v=20260507-fellow-corneal`,
          isBabyCase: ba.has(e.value),
        };
      })
      .sort((e, t) => e.order - t.order || e.label.localeCompare(t.label))
      .map((e, t) => ({ ...e, index: t + 1 })),
    mt = Object.entries(Be)
      .map(([e, t]) => ({ value: e, ...t }))
      .sort((e, t) => e.order - t.order);
  function we(e) {
    return Me.find((t) => t.value === e) || null;
  }
  function Ae({ babyOnly: e = !1 } = {}) {
    return e ? Me.filter((t) => t.isBabyCase) : Me;
  }
  function ft() {
    return we("zero") || Me[0] || null;
  }
  function ht() {
    return {
      body: document.body,
      infoIcon: document.getElementById("info-icon"),
      infoModal: document.getElementById("infoModal"),
      infoModalContent: document.getElementById("infoModalContent"),
      closeModal: document.getElementById("closeModal"),
      burgerIcon: document.getElementById("burger-icon"),
      sideMenu: document.getElementById("sideMenu"),
      testModeButton: document.getElementById("test-mode-button"),
      resetSimulatorButton: document.getElementById("reset-simulator-button"),
      resetSimulatorStatus: document.getElementById("reset-simulator-status"),
      mcqModal: document.getElementById("mcqModal"),
      mcqModalContent: document.getElementById("mcqModalContent"),
      closeMcqModalButton: document.getElementById("closeMcqModal"),
      mcqTitle: document.getElementById("mcqTitle"),
      mcqIntro: document.getElementById("mcqIntro"),
      mcqContainer: document.getElementById("mcqContainer"),
      submitMcqButton: document.getElementById("submitMcqButton"),
      mcqResult: document.getElementById("mcqResult"),
      mcqLevelButtons: Array.from(
        document.querySelectorAll(".mcq-level-button"),
      ),
      testStatusBanner: document.getElementById("test-status-banner"),
      testCountdownValue: document.getElementById("test-countdown-value"),
      testAnswerText: document.getElementById("test-answer-text"),
      testNextButton: document.getElementById("test-next-button"),
      reflexColorSlider: document.getElementById("reflex-color-slider"),
      gazeToggle: document.getElementById("gaze-toggle"),
      dilatedToggle: document.getElementById("dilated-toggle"),
      babyToggle: document.getElementById("baby-toggle"),
      manualEyeMoveToggle: document.getElementById("manual-eye-move-toggle"),
      caseModal: document.getElementById("caseModal"),
      caseModalContent: document.getElementById("caseModalContent"),
      closeCaseModalButton: document.getElementById("closeCaseModal"),
      caseSectionsContainer: document.getElementById("caseSectionsContainer"),
      caseSimilarTool: document.getElementById("case-similar-tool"),
      caseSimilarList: document.getElementById("case-similar-list"),
      caseSafetyModal: document.getElementById("caseSafetyModal"),
      caseSafetyModalContent: document.getElementById("caseSafetyModalContent"),
      closeCaseSafetyModalButton: document.getElementById(
        "closeCaseSafetyModal",
      ),
      caseSafetyTitle: document.getElementById("caseSafetyTitle"),
      caseSafetyBody: document.getElementById("caseSafetyBody"),
      casePicker: document.getElementById("case-picker"),
      casePreviousButton: document.getElementById("case-previous-button"),
      caseNextButton: document.getElementById("case-next-button"),
      caseTriggerButton: document.getElementById("case-trigger-button"),
      caseTriggerLabel: document.getElementById("case-trigger-label"),
      caseTriggerLevel: document.getElementById("case-trigger-level"),
      caseTriggerSafety: document.getElementById("case-trigger-safety"),
      caseMaskLabel: document.getElementById("case-mask-label"),
      refractionShell: document.getElementById("refraction-shell"),
      refractionMaskLabel: document.getElementById("refraction-mask-label"),
      refractionStateSelect: document.getElementById("refraction-state"),
      retinoscopySlider: document.getElementById("retinoscopy-slider"),
      retinoscopyRotationSlider: document.getElementById(
        "retinoscopy-rotation",
      ),
      cataractSlider: document.getElementById("cataract-slider"),
      nystagmusSlider: document.getElementById("nystagmus-slider"),
      retEyeButtons: Array.from(document.querySelectorAll(".ret-eye-button")),
      pupilSizeSliders: Array.from(
        document.querySelectorAll(".slider[data-eye]"),
      ),
      eyelidSliders: Array.from(
        document.querySelectorAll(".vertical-eye-slider"),
      ),
      eyesWrapper: document.querySelector(".eyes-wrapper"),
      eyesContainer: document.querySelector(".eyes-container"),
      movementStatusLabel: document.getElementById("movement-status-label"),
      eyes: Array.from(document.querySelectorAll(".eye")),
      leftEye: document.getElementById("left-eye"),
      rightEye: document.getElementById("right-eye"),
      irises: Array.from(document.querySelectorAll(".iris")),
      retReflexElements: Array.from(document.querySelectorAll(".ret-reflex")),
      retStreak: document.getElementById("ret-streak"),
      retStreakRotateHandle: document.getElementById(
        "ret-streak-rotate-handle",
      ),
      retStreakSweepHandle: document.getElementById("ret-streak-sweep-handle"),
    };
  }
  function be() {
    var e;
    return !!(
      (e = window.matchMedia) != null &&
      e.call(window, "(prefers-reduced-motion: reduce)").matches
    );
  }
  function bt({ state: e, dom: t, onEyeGeometryChange: a }) {
    function i(r, o) {
      if (!r) return;
      let n = r.querySelector(".pupil");
      n && (n.style.background = o);
      let g = r.querySelector(".coloboma-extension");
      g && (g.style.background = o);
      let l = r.querySelector(".iris-transillumination-patch");
      l && (l.style.background = o);
    }
    function c() {
      t.irises.forEach((r) => {
        r.classList.toggle("is-manual-drag-enabled", e.isManualEyeMoveEnabled);
      });
    }
    function u(r) {
      let o = Math.max(0, Math.min(100, r)) / 100,
        n = 1 - o * 0.72,
        g = 1 - o * 0.64,
        l = 1 - o * 0.18;
      return `brightness(${n.toFixed(2)}) saturate(${g.toFixed(2)}) contrast(${l.toFixed(2)})`;
    }
    function x() {
      let r = u(e.cataractLevel);
      t.irises.forEach((o) => {
        let n = o.querySelector(".pupil");
        n && (n.style.filter = r);
        let g = o.querySelector(".coloboma-extension");
        g && (g.style.filter = r);
        let l = o.querySelector(".iris-transillumination-patch");
        l && (l.style.filter = r);
      });
    }
    function d(r = !0) {
      typeof a == "function" && a({ includePosition: r });
    }
    function E(r = e.nystagmusLevel === 0) {
      d(e.isGazeMode ? !1 : r);
    }
    function S({ x: r = 0, y: o = 0, tilt: n = 0 } = {}) {
      t.eyesContainer &&
        (t.eyesContainer.style.setProperty(
          "--gaze-face-x",
          `${r.toFixed(2)}px`,
        ),
        t.eyesContainer.style.setProperty("--gaze-face-y", `${o.toFixed(2)}px`),
        t.eyesContainer.style.setProperty(
          "--gaze-face-tilt",
          `${n.toFixed(2)}deg`,
        ));
    }
    function p() {
      S();
    }
    function v(r) {
      return (r == null ? void 0 : r.dataset.restingHeightPx) || "0px";
    }
    function h(r) {
      return (r == null ? void 0 : r.dataset.gazeLidDroopHeightPx) || v(r);
    }
    function C() {
      t.eyes.forEach((r) => {
        let o = r.querySelector(".upper-eyelid");
        o &&
          (o.gazeLidDroopTimerId &&
            (window.clearTimeout(o.gazeLidDroopTimerId),
            (o.gazeLidDroopTimerId = 0)),
          delete o.dataset.gazeLidDroopHeightPx,
          o.dataset.isBlinking !== "true" && (o.style.height = v(o)));
      });
    }
    function I() {
      t.eyes.forEach((r) => {
        let o = r.querySelector(".upper-eyelid"),
          n = r.querySelector(".lower-eyelid");
        (o != null &&
          o.blinkTimerId &&
          (window.clearTimeout(o.blinkTimerId), (o.blinkTimerId = 0)),
          n != null &&
            n.blinkTimerId &&
            (window.clearTimeout(n.blinkTimerId), (n.blinkTimerId = 0)),
          o && (delete o.dataset.isBlinking, (o.style.height = h(o))),
          n && (n.style.height = "0px"));
      });
    }
    function A(r) {
      var l, w, m, f, O, D, _, W;
      let o =
          (((l = r.microOffset) == null ? void 0 : l.x) || 0) +
          (((w = r.backgroundOffset) == null ? void 0 : w.x) || 0) +
          (((m = r.gazeOffset) == null ? void 0 : m.x) || 0) +
          (((f = r.nystagmusOffset) == null ? void 0 : f.x) || 0),
        n =
          (((O = r.microOffset) == null ? void 0 : O.y) || 0) +
          (((D = r.backgroundOffset) == null ? void 0 : D.y) || 0) +
          (((_ = r.gazeOffset) == null ? void 0 : _.y) || 0) +
          (((W = r.nystagmusOffset) == null ? void 0 : W.y) || 0);
      r.style.transform = `translate(${o}px, ${n}px)`;
      let g = r.closest(".eye");
      g &&
        (g.style.setProperty(
          "--corneal-reflex-micro-x",
          `${(o * 0.08).toFixed(2)}px`,
        ),
        g.style.setProperty(
          "--corneal-reflex-micro-y",
          `${(n * 0.06).toFixed(2)}px`,
        ));
    }
    function b(r) {
      r && r.dispatchEvent(new Event("input", { bubbles: !0 }));
    }
    function k(r) {
      t.pupilSizeSliders.forEach((o, n) => {
        var l;
        let g = (l = r[n]) != null ? l : r[0];
        g !== void 0 && ((o.value = String(g)), b(o));
      });
    }
    function H() {
      (e.gazeIntervalId &&
        (window.clearInterval(e.gazeIntervalId), (e.gazeIntervalId = 0)),
        e.gazeReturnTimeoutId &&
          (window.clearTimeout(e.gazeReturnTimeoutId),
          (e.gazeReturnTimeoutId = 0)),
        e.gazeShiftTimerId &&
          (window.clearTimeout(e.gazeShiftTimerId), (e.gazeShiftTimerId = 0)),
        t.irises.forEach((r) => {
          (r.gazeSettleTimerId &&
            (window.clearTimeout(r.gazeSettleTimerId),
            (r.gazeSettleTimerId = 0)),
            r.gazeStartTimerId &&
              (window.clearTimeout(r.gazeStartTimerId),
              (r.gazeStartTimerId = 0)));
        }));
    }
    function R(
      r,
      { overshoot: o = 0, settleMs: n = 0, staggerMs: g = 0 } = {},
    ) {
      t.irises.forEach((l, w) => {
        if (l.isDragging) return;
        (l.gazeSettleTimerId &&
          (window.clearTimeout(l.gazeSettleTimerId), (l.gazeSettleTimerId = 0)),
          l.gazeStartTimerId &&
            (window.clearTimeout(l.gazeStartTimerId),
            (l.gazeStartTimerId = 0)));
        let m = r(l, w),
          f = l.gazeOffset || { x: 0, y: 0 },
          O = (W) => {
            ((l.gazeOffset = {
              x: parseFloat(W.x.toFixed(2)),
              y: parseFloat(W.y.toFixed(2)),
            }),
              A(l));
          },
          D = () => {
            if (o > 0 && n > 0) {
              (O({ x: m.x + (m.x - f.x) * o, y: m.y + (m.y - f.y) * o }),
                E(!1),
                (l.gazeSettleTimerId = window.setTimeout(() => {
                  (O(m), (l.gazeSettleTimerId = 0), E(!1));
                }, n)));
              return;
            }
            (O(m), E(!1));
          },
          _ = w * g;
        _ > 0
          ? (l.gazeStartTimerId = window.setTimeout(() => {
              ((l.gazeStartTimerId = 0), D());
            }, _))
          : D();
      });
    }
    function q() {
      (t.irises.forEach((r) => {
        ((r.gazeOffset = { x: 0, y: 0 }), A(r));
      }),
        d(!1));
    }
    function z() {
      if ((H(), !e.isGazeMode || be())) return;
      let r = !0,
        o = () => {
          let l = Math.random() < 0.5 ? -1 : 1,
            w = parseFloat((l * (2.2 + Math.random() * 2.2)).toFixed(2)),
            m = parseFloat((Math.random() * 2.2 - 1.1).toFixed(2));
          (S({
            x: l * (0.6 + Math.random() * 0.7),
            y: Math.random() * 0.8 - 0.2,
            tilt: l * (0.24 + Math.random() * 0.22),
          }),
            R(
              () => ({
                x: w + (Math.random() * 0.35 - 0.18),
                y: m + (Math.random() * 0.25 - 0.13),
              }),
              {
                overshoot: e.isBabyMode ? 0.07 : 0.045,
                settleMs: e.isBabyMode ? 210 : 250,
                staggerMs: e.isBabyMode ? 14 : 10,
              },
            ));
        },
        n = (l, w = 0.18) => {
          t.eyes.forEach((m) => {
            let f = m.querySelector(".upper-eyelid");
            if (!f) return;
            f.gazeLidDroopTimerId && window.clearTimeout(f.gazeLidDroopTimerId);
            let O = parseFloat(v(f)) || 0,
              _ = `${Math.max(O, m.clientHeight * w)}px`;
            ((f.dataset.gazeLidDroopHeightPx = _),
              f.dataset.isBlinking !== "true" && (f.style.height = _),
              (f.gazeLidDroopTimerId = window.setTimeout(() => {
                (delete f.dataset.gazeLidDroopHeightPx,
                  (f.gazeLidDroopTimerId = 0),
                  f.dataset.isBlinking !== "true" && (f.style.height = v(f)));
              }, l)));
          });
        },
        g = () => {
          let l = e.isBabyMode,
            w = r
              ? 450 + Math.random() * 650
              : l
                ? 820 + Math.random() * 850
                : 1250 + Math.random() * 1150;
          ((r = !1),
            (e.gazeShiftTimerId = window.setTimeout(() => {
              if (!e.isGazeMode) {
                e.gazeShiftTimerId = 0;
                return;
              }
              let m = Math.random() < (l ? 0.4 : 0.28),
                f = m
                  ? l
                    ? 760 + Math.random() * 760
                    : 1200 + Math.random() * 850
                  : l
                    ? 620 + Math.random() * 640
                    : 1100 + Math.random() * 800,
                O = Math.random() < 0.5 ? -1 : 1,
                D = parseFloat(
                  m
                    ? (O * (15 + Math.random() * 6)).toFixed(2)
                    : (O * (8.5 + Math.random() * 5.5)).toFixed(2),
                ),
                _ = parseFloat(
                  m
                    ? (7.5 + Math.random() * 4.5).toFixed(2)
                    : (Math.random() * 7 - 3.5).toFixed(2),
                ),
                W =
                  O *
                  (m ? 2.4 + Math.random() * 1.2 : 1.4 + Math.random() * 0.9),
                Y = m
                  ? 1.8 + Math.random() * 1.1
                  : Math.max(-0.8, Math.min(1.2, _ * 0.2)),
                N = Math.random(),
                ie = m && N < 0.16,
                ne = m && N < 0.42,
                re =
                  O *
                  (ie
                    ? 1.02 + Math.random() * 0.34
                    : ne
                      ? 1.05 + Math.random() * 0.3
                      : m
                        ? 0.76 + Math.random() * 0.34
                        : 0.44 + Math.random() * 0.28);
              (S({ x: W, y: Y, tilt: re }),
                m && n(f, 0.16 + Math.random() * 0.06),
                m &&
                  Math.random() < (l ? 0.46 : 0.22) &&
                  window.setTimeout(
                    () => ee({ doubleBlink: !1 }),
                    l ? 80 : 140,
                  ),
                R(
                  () => ({
                    x: D + (Math.random() * (l ? 1.2 : 0.8) - (l ? 0.6 : 0.4)),
                    y:
                      _ +
                      (Math.random() * (l ? 0.75 : 0.5) - (l ? 0.38 : 0.25)),
                  }),
                  {
                    overshoot: l ? 0.1 : 0.065,
                    settleMs: l ? 160 : 200,
                    staggerMs: l ? 16 : 12,
                  },
                ),
                (e.gazeShiftTimerId = window.setTimeout(() => {
                  (o(), e.isGazeMode ? g() : (e.gazeShiftTimerId = 0));
                }, f)));
            }, w)));
        };
      (o(), g());
    }
    function $() {
      z();
    }
    function G(r) {
      let o = !1,
        n = r.closest(".eye"),
        g,
        l,
        w,
        m,
        f;
      function O() {
        (document.removeEventListener("touchmove", W),
          document.removeEventListener("touchend", Y),
          document.removeEventListener("touchcancel", Y),
          document.removeEventListener("mousemove", W),
          document.removeEventListener("mouseup", Y));
      }
      function D() {
        ((o = !1), (r.isDragging = !1), O());
      }
      function _(N) {
        !e.isManualEyeMoveEnabled ||
          e.isTestMode ||
          (N.preventDefault(),
          (o = !0),
          (r.isDragging = !0),
          (g = n.getBoundingClientRect()),
          (l = g.left + g.width / 2),
          (w = g.top + g.height / 2),
          (m = (g.width / 2 - r.offsetWidth / 2) * 0.8),
          (f = 30 * 0.8),
          N.type === "touchstart"
            ? (document.addEventListener("touchmove", W, { passive: !1 }),
              document.addEventListener("touchend", Y),
              document.addEventListener("touchcancel", Y))
            : (document.addEventListener("mousemove", W),
              document.addEventListener("mouseup", Y)));
      }
      function W(N) {
        if (!o) return;
        if (!e.isManualEyeMoveEnabled || e.isTestMode) {
          D();
          return;
        }
        let ie, ne;
        N.type === "touchmove"
          ? ((ie = N.touches[0].clientX), (ne = N.touches[0].clientY))
          : ((ie = N.clientX), (ne = N.clientY));
        let re = ie - l,
          F = ne - w;
        if (
          (Math.abs(re) > m && (re = Math.sign(re) * m),
          Math.abs(F) > f && (F = Math.sign(F) * f),
          (r.style.left = `calc(50% + ${re}px - ${r.offsetWidth / 2}px)`),
          (r.style.top = `calc(50% + ${F}px - ${r.offsetHeight / 2}px)`),
          r.querySelector(".pupil"))
        ) {
          let ce = Math.sqrt(re * re + F * F),
            V = Math.sqrt(m ** 2 + f ** 2),
            se = 1 + Math.min(ce / V, 1),
            de = rt(e.baseReflexColor, se);
          i(r, `rgb(${de.r}, ${de.g}, ${de.b})`);
        }
        d();
      }
      function Y() {
        D();
      }
      ((r.cancelManualDrag = D),
        r.addEventListener("mousedown", _),
        r.addEventListener("touchstart", _, { passive: !1 }));
    }
    function j(r) {
      function o() {
        let g = r.getAttribute("data-eye"),
          l = document.querySelector(`.eye[data-eye="${g}"]`);
        if (!l) return;
        let w = l.querySelector(".pupil"),
          m = parseInt(r.value, 10);
        ((w.dataset.baseSizePx = String(m)),
          (w.style.width = `${m}px`),
          (w.style.height = `${m}px`),
          (w.style.left = `calc(50% - ${m / 2}px)`),
          (w.style.top = `calc(50% - ${m / 2}px)`),
          d(!1));
      }
      function n() {
        let w = parseInt(r.value, 10);
        Math.abs(w - 32) <= 3 && ((r.value = 32), o());
      }
      (r.addEventListener("input", o),
        r.addEventListener("change", n),
        r.addEventListener("mouseup", n),
        r.addEventListener("touchend", n),
        o());
    }
    function X() {
      t.eyelidSliders.forEach((r) => {
        r.addEventListener("input", () => {
          let o = r.getAttribute("data-eye"),
            n = document.querySelector(`.eye[data-eye="${o}"]`);
          if (!n) return;
          let g = n.querySelector(".upper-eyelid");
          if (g) {
            let l = `${r.value * 1.5}px`;
            ((g.dataset.restingHeightPx = l),
              g.dataset.isBlinking !== "true" &&
                !g.dataset.gazeLidDroopHeightPx &&
                (g.style.height = l));
          }
          d(!1);
        });
      });
    }
    function te() {
      (t.irises.forEach((n) => {
        n.microOffset = { x: 0, y: 0 };
      }),
        (e.microSaccadeIntervalId = window.setInterval(() => {
          let n = e.isGazeMode && Math.random() < 0.18,
            g = e.isGazeMode ? (n ? 4.8 : 2.6) : 2,
            l = e.isGazeMode ? (n ? 2.6 : 1.4) : 2,
            w = Math.random() * g - g / 2,
            m = Math.random() * l - l / 2;
          (t.irises.forEach((f) => {
            if (!f.isDragging) {
              let O = parseFloat(
                  (w + (Math.random() * 0.28 - 0.14)).toFixed(2),
                ),
                D = parseFloat((m + (Math.random() * 0.22 - 0.11)).toFixed(2));
              ((f.microOffset = { x: O, y: D }), A(f));
            }
          }),
            E(),
            setTimeout(() => {
              (t.irises.forEach((f) => {
                f.isDragging || ((f.microOffset = { x: 0, y: 0 }), A(f));
              }),
                E());
            }, 120));
        }, 2300)));
    }
    function Z() {
      t.irises.forEach((n) => {
        n.backgroundOffset = { x: 0, y: 0 };
      });
      let r = () => {
          (t.irises.forEach((n) => {
            if (!n.isDragging) {
              let g = e.isGazeMode ? 0.62 : 0.4,
                l = e.isGazeMode ? 0.52 : 0.4,
                w = parseFloat((Math.random() * g - g / 2).toFixed(2)),
                m = parseFloat((Math.random() * l - l / 2).toFixed(2));
              ((n.backgroundOffset = { x: w, y: m }), A(n));
            }
          }),
            E());
        },
        o = () => {
          let n = 170 + Math.random() * 95;
          e.backgroundJitterIntervalId = window.setTimeout(() => {
            (r(), o());
          }, n);
        };
      o();
    }
    function U(r) {
      let o = Math.max(0, Math.min(100, e.nystagmusLevel)) / 100;
      if (o <= 0) return;
      let n = o * 9.5,
        g = o * 1.3,
        l = 0.45 + o * 3.9,
        w = (r / 1e3) * Math.PI * 2 * l,
        m = !1;
      (t.irises.forEach((f, O) => {
        if (f.isDragging) return;
        let D = O * 0.22,
          _ = w + D,
          W = Math.sin(_),
          Y = Math.sin(_ * 0.5),
          N = n * (0.82 * W + 0.18 * Math.sign(W) * Y),
          ie = g * Math.sin(_ * 2 + 0.8),
          ne = f.nystagmusOffset || { x: 0, y: 0 };
        (Math.abs(ne.x - N) > 0.02 || Math.abs(ne.y - ie) > 0.02) &&
          ((f.nystagmusOffset = {
            x: parseFloat(N.toFixed(2)),
            y: parseFloat(ie.toFixed(2)),
          }),
          A(f),
          (m = !0));
      }),
        m && d(!1));
    }
    function Q() {
      if (e.nystagmusRafId) return;
      let r = (o) => {
        (U(o),
          e.nystagmusLevel > 0
            ? (e.nystagmusRafId = requestAnimationFrame(r))
            : (e.nystagmusRafId = 0));
      };
      e.nystagmusRafId = requestAnimationFrame(r);
    }
    function ee({ doubleBlink: r = !1 } = {}) {
      e.lastBlinkAtMs = performance.now();
      let o = !!(e.isBabyMode && e.isGazeMode),
        n = o && Math.random() < 0.26,
        g = o ? `height ${n ? 0.34 : 0.28}s ease-in` : "",
        l = o ? `height ${n ? 0.38 : 0.3}s ease-out` : "",
        w = n ? 560 + Math.random() * 520 : o ? 190 + Math.random() * 130 : 115;
      (t.eyes.forEach((m) => {
        let f = m.querySelector(".upper-eyelid"),
          O = m.querySelector(".lower-eyelid");
        (f &&
          (f.blinkTimerId && window.clearTimeout(f.blinkTimerId),
          (f.dataset.isBlinking = "true"),
          (f.style.transition = g),
          (f.style.height = `${m.clientHeight * 0.7}px`)),
          O &&
            (O.blinkTimerId && window.clearTimeout(O.blinkTimerId),
            (O.style.transition = g),
            (O.style.height = `${m.clientHeight * 0.3}px`)));
        let D = window.setTimeout(() => {
          (f &&
            (delete f.dataset.isBlinking,
            (f.blinkTimerId = 0),
            (f.style.transition = l),
            (f.style.height = h(f)),
            window.setTimeout(
              () => {
                f.dataset.isBlinking !== "true" && (f.style.transition = "");
              },
              o ? 440 : 0,
            )),
            O &&
              ((O.blinkTimerId = 0),
              (O.style.transition = l),
              (O.style.height = "0px"),
              window.setTimeout(
                () => {
                  O.blinkTimerId || (O.style.transition = "");
                },
                o ? 440 : 0,
              )));
        }, w);
        (f && (f.blinkTimerId = D), O && (O.blinkTimerId = D));
      }),
        r &&
          !n &&
          window.setTimeout(() => ee({ doubleBlink: !1 }), o ? 320 : 210));
    }
    function ae() {
      let r = e.isBabyMode && e.isGazeMode,
        o = r ? 2800 + Math.random() * 3200 : 4200 + Math.random() * 3300;
      e.blinkIntervalId = window.setTimeout(() => {
        (ee({ doubleBlink: Math.random() < (r ? 0.1 : 0.14) }), ae());
      }, o);
    }
    function K() {
      (e.blinkIntervalId &&
        (window.clearTimeout(e.blinkIntervalId), (e.blinkIntervalId = 0)),
        be() || ae());
    }
    function le() {
      be() ||
        (e.microSaccadeIntervalId || te(),
        e.backgroundJitterIntervalId || Z(),
        e.blinkIntervalId || ae(),
        e.nystagmusLevel > 0 && Q(),
        e.isGazeMode && !e.gazeShiftTimerId && $());
    }
    function oe(r) {
      (t.irises.forEach((o) => {
        i(o, r);
      }),
        x());
    }
    function ge(r) {
      let o = Number.isFinite(r) ? r : parseInt(r, 10);
      Number.isNaN(o) ||
        ((e.cataractLevel = Math.max(0, Math.min(100, o))), x());
    }
    function T(r) {
      let o = Number.isFinite(r) ? r : parseInt(r, 10);
      if (
        !Number.isNaN(o) &&
        ((e.nystagmusLevel = Math.max(0, Math.min(100, o))),
        e.nystagmusLevel > 0 && (Q(), d(!1)),
        e.nystagmusLevel === 0)
      ) {
        let n = !1;
        (t.irises.forEach((g) => {
          let l = g.nystagmusOffset || { x: 0, y: 0 };
          (Math.abs(l.x) > 0.02 || Math.abs(l.y) > 0.02) &&
            ((g.nystagmusOffset = { x: 0, y: 0 }), A(g), (n = !0));
        }),
          n && d(!0));
      }
    }
    function B(r) {
      ((e.isManualEyeMoveEnabled = !!r),
        (!e.isManualEyeMoveEnabled || e.isTestMode) &&
          t.irises.forEach((o) => {
            typeof o.cancelManualDrag == "function" && o.cancelManualDrag();
          }),
        c());
    }
    function s(r) {
      let o = !!r;
      if (o !== e.isGazeMode) {
        if (((e.isGazeMode = o), I(), K(), o)) {
          z();
          return;
        }
        (H(), C(), p(), q());
      }
    }
    function y(r) {
      let o = !!r;
      o !== e.isDilatedMode &&
        (o
          ? ((e.dilatedPreviousPupilValues = t.pupilSizeSliders.map(
              (n) => n.value,
            )),
            k([44, 44]))
          : e.dilatedPreviousPupilValues
            ? (k(e.dilatedPreviousPupilValues),
              (e.dilatedPreviousPupilValues = null))
            : k([32, 32]),
        (e.isDilatedMode = o),
        d(!1));
    }
    function M(r) {
      let o = !!r,
        n = e.isBabyMode;
      ((e.isBabyMode = o),
        t.eyesWrapper &&
          t.eyesWrapper.classList.toggle("is-baby-mode", e.isBabyMode),
        n !== o && (I(), K()),
        d(!0));
    }
    function P() {
      (t.irises.forEach((r) => {
        ((r.nystagmusOffset = { x: 0, y: 0 }),
          (r.gazeOffset = { x: 0, y: 0 }),
          (r.microOffset = { x: 0, y: 0 }),
          (r.backgroundOffset = { x: 0, y: 0 }));
      }),
        t.irises.forEach(G),
        t.pupilSizeSliders.forEach(j),
        X(),
        x(),
        c(),
        t.eyesWrapper &&
          t.eyesWrapper.classList.toggle("is-baby-mode", e.isBabyMode));
    }
    return {
      init: P,
      applyReflexColor: oe,
      setCataractLevel: ge,
      setBabyMode: M,
      setDilatedMode: y,
      setGazeMode: s,
      setManualEyeMoveEnabled: B,
      setNystagmusLevel: T,
      startAmbientAnimations: le,
    };
  }
  var va = [
    "button:not([disabled])",
    "[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");
  function yt(e, t) {
    if (!e) return;
    let a = parseInt(e.dataset.openModalCount || "0", 10),
      i = Math.max(0, a + (t ? 1 : -1));
    ((e.dataset.openModalCount = String(i)),
      e.classList.toggle("modal-open", i > 0));
  }
  function xt(e) {
    return e
      ? Array.from(e.querySelectorAll(va)).filter(
          (t) =>
            t instanceof HTMLElement &&
            t.getAttribute("aria-hidden") !== "true" &&
            t.getClientRects().length > 0,
        )
      : [];
  }
  function pe({
    body: e,
    modal: t,
    focusRoot: a,
    initialFocusElement: i,
    onAfterClose: c,
    onAfterOpen: u,
  }) {
    if (!t)
      return {
        close() {},
        isOpen() {
          return !1;
        },
        open() {},
        toggle() {},
      };
    a && !a.hasAttribute("tabindex") && a.setAttribute("tabindex", "-1");
    let x = !1,
      d = null;
    function E() {
      let h = xt(a || t),
        C = a || t,
        I = i || h[0] || C;
      I instanceof HTMLElement && I.focus();
    }
    function S({ restoreFocus: h = !0 } = {}) {
      x &&
        ((x = !1),
        (t.style.display = "none"),
        t.setAttribute("aria-hidden", "true"),
        yt(e, !1),
        typeof c == "function" && c(),
        h && d instanceof HTMLElement && document.contains(d) && d.focus());
    }
    function p({ triggerElement: h } = {}) {
      x ||
        ((d =
          h instanceof HTMLElement
            ? h
            : document.activeElement instanceof HTMLElement
              ? document.activeElement
              : null),
        (x = !0),
        (t.style.display = "block"),
        t.setAttribute("aria-hidden", "false"),
        yt(e, !0),
        typeof u == "function" && u(),
        requestAnimationFrame(() => {
          E();
        }));
    }
    function v({ triggerElement: h } = {}) {
      if (x) {
        S();
        return;
      }
      p({ triggerElement: h });
    }
    return (
      t.addEventListener("keydown", (h) => {
        if (!x) return;
        if (h.key === "Escape") {
          (h.preventDefault(), S());
          return;
        }
        if (h.key !== "Tab") return;
        let C = xt(a || t),
          I = a || t;
        if (!C.length) {
          (h.preventDefault(), I instanceof HTMLElement && I.focus());
          return;
        }
        let A = C[0],
          b = C[C.length - 1],
          k = document.activeElement;
        if (h.shiftKey && k === A) {
          (h.preventDefault(), b.focus());
          return;
        }
        !h.shiftKey && k === b && (h.preventDefault(), A.focus());
      }),
      {
        close: S,
        isOpen() {
          return x;
        },
        open: p,
        toggle: v,
      }
    );
  }
  function vt(e) {
    let {
      body: t,
      infoIcon: a,
      infoModal: i,
      infoModalContent: c,
      closeModal: u,
    } = e;
    if (!t || !a || !i || !c || !u) return;
    let x = pe({ body: t, focusRoot: c, initialFocusElement: u, modal: i });
    (a.addEventListener("click", () => {
      (x.toggle({ triggerElement: a }),
        a.setAttribute("aria-expanded", String(x.isOpen())));
    }),
      u.addEventListener("click", () => {
        (x.close(), a.setAttribute("aria-expanded", "false"));
      }),
      i.addEventListener("click", (d) => {
        d.target === i && (x.close(), a.setAttribute("aria-expanded", "false"));
      }),
      i.addEventListener("keydown", (d) => {
        d.key === "Escape" && a.setAttribute("aria-expanded", "false");
      }));
  }
  function St(e) {
    return e
      .map((t) => ({ item: t, sortKey: Math.random() }))
      .sort((t, a) => t.sortKey - a.sortKey)
      .map((t) => t.item);
  }
  function Sa(e) {
    let t = e.options[e.answer],
      a = St(e.options);
    return { ...e, options: a, answer: a.indexOf(t) };
  }
  function Et(e, t = 5) {
    let a = pt[e] || [],
      i = St(a);
    return i.slice(0, Math.min(t, i.length)).map(Sa);
  }
  function Ct(e, t) {
    if (!e) return;
    let a = document.createDocumentFragment();
    (t.forEach((i, c) => {
      let u = document.createElement("fieldset");
      ((u.className = "question"), (u.dataset.questionId = i.id));
      let x = document.createElement("legend");
      ((x.textContent = `${c + 1}. ${i.question}`), u.appendChild(x));
      let d = document.createElement("div");
      ((d.className = "options"),
        i.options.forEach((h, C) => {
          let I = document.createElement("label"),
            A = document.createElement("input");
          ((A.type = "radio"),
            (A.name = `mcq_q_${c}`),
            (A.value = String(C)),
            I.append(A, document.createTextNode(` ${h}`)),
            d.appendChild(I));
        }),
        u.appendChild(d));
      let E = document.createElement("div");
      ((E.className = "mcq-item-review"), (E.hidden = !0));
      let S = document.createElement("p");
      ((S.className = "mcq-item-feedback"),
        (S.textContent = `Why: ${i.explanation}`));
      let p = document.createElement("p");
      p.className = "mcq-item-source";
      let v = De[i.source];
      ((p.textContent = `Source: ${(v == null ? void 0 : v.label) || i.source}. Status: ${i.reviewStatus}.`),
        E.append(S, p),
        u.appendChild(E),
        a.appendChild(u));
    }),
      e.replaceChildren(a));
  }
  function Mt(e) {
    let t = [];
    for (let a = 0; a < e.length; a += 1) {
      let i = document.querySelector(`input[name="mcq_q_${a}"]:checked`);
      if (!i) return null;
      t.push(parseInt(i.value, 10));
    }
    return t;
  }
  function wt(e, t) {
    let a = 0;
    return (
      e.forEach((i, c) => {
        t[c] === i.answer && (a += 1);
      }),
      a
    );
  }
  function At(e, t, a) {
    if (!e || !Array.isArray(t) || !Array.isArray(a)) return;
    Array.from(e.querySelectorAll("fieldset.question")).forEach((c, u) => {
      var v;
      let x = Array.from(c.querySelectorAll(".options label"));
      x.forEach((h) => {
        h.classList.remove("correct-answer-label", "wrong-answer-label");
      });
      let d = (v = t[u]) == null ? void 0 : v.answer,
        E = a[u],
        S = x[d];
      if (
        (S && S.classList.add("correct-answer-label"),
        Number.isInteger(E) && E !== d)
      ) {
        let h = x[E];
        h && h.classList.add("wrong-answer-label");
      }
      c.querySelectorAll("input[type='radio']").forEach((h) => {
        h.disabled = !0;
      });
      let p = c.querySelector(".mcq-item-review");
      p && (p.hidden = !1);
    });
  }
  function Tt({ state: e, dom: t, onBeforeOpenMcq: a }) {
    let {
      body: i,
      burgerIcon: c,
      sideMenu: u,
      mcqModal: x,
      mcqModalContent: d,
      closeMcqModalButton: E,
      mcqTitle: S,
      mcqIntro: p,
      mcqContainer: v,
      submitMcqButton: h,
      mcqResult: C,
      mcqLevelButtons: I,
    } = t;
    if (!i || !c || !u || !x || !d || !E || !S || !p || !v || !h || !C) return;
    let A = (R) => {
        var q;
        (u.classList.toggle("open", R),
          u.setAttribute("aria-hidden", String(!R)),
          R
            ? (u.removeAttribute("inert"),
              (q = u.querySelector("button:not([disabled])")) == null ||
                q.focus({ preventScroll: !0 }))
            : u.setAttribute("inert", ""),
          c.setAttribute("aria-expanded", String(R)),
          c.setAttribute("aria-label", R ? "Close menu" : "Open menu"));
      },
      b = pe({ body: i, focusRoot: d, initialFocusElement: E, modal: x }),
      k = !1,
      H = (R, q) => {
        let z = Pe[R];
        z &&
          (typeof a == "function" && a(),
          (e.activeMcqLevel = R),
          (e.activeMcqQuestions = Et(R, z.questionCount || 5)),
          (S.textContent = `${z.title} MCQ`),
          (p.textContent = `${e.activeMcqQuestions.length} questions. Pass mark ${z.passMark}.`),
          Ct(v, e.activeMcqQuestions),
          (C.textContent = ""),
          (C.className = "result-text"),
          (C.hidden = !0),
          (k = !1),
          (h.textContent = "Submit answers"),
          (h.disabled = !1),
          A(!1),
          b.open({ triggerElement: c }));
      };
    (c.addEventListener("click", () => {
      A(!u.classList.contains("open"));
    }),
      I.forEach((R) => {
        R.addEventListener("click", () => {
          H(R.dataset.level, R);
        });
      }),
      E.addEventListener("click", () => {
        b.close();
      }),
      h.addEventListener("click", () => {
        var G, j;
        if (!e.activeMcqQuestions.length) return;
        if (k) {
          H(e.activeMcqLevel, c);
          return;
        }
        let R = Mt(e.activeMcqQuestions);
        if (!R) {
          ((C.textContent = "Please answer all questions before submitting."),
            (C.className = "result-text is-review"),
            (C.hidden = !1),
            (j =
              (G = Array.from(v.querySelectorAll("fieldset.question")).find(
                (X) => !X.querySelector("input:checked"),
              )) == null
                ? void 0
                : G.querySelector("input")) == null || j.focus());
          return;
        }
        let q = wt(e.activeMcqQuestions, R);
        (At(v, e.activeMcqQuestions, R), (C.hidden = !1));
        let z = Pe[e.activeMcqLevel].passMark,
          $ = q >= z;
        if ($) {
          let X = document.createElement("span");
          ((X.className = "result-star"),
            X.setAttribute("aria-label", "star earned"),
            (X.textContent = "\u2605"),
            C.replaceChildren(
              document.createTextNode(
                `Score ${q}/${e.activeMcqQuestions.length} - Pass `,
              ),
              X,
            ),
            (C.className = "result-text is-pass"));
        } else
          ((C.textContent = `Score ${q}/${e.activeMcqQuestions.length} - Review and retry`),
            (C.className = "result-text is-review"));
        ((k = !0),
          (h.textContent = $ ? "New attempt" : "Try again"),
          (h.disabled = !1));
      }),
      document.addEventListener("click", (R) => {
        let q = R.target;
        if (q === x) {
          b.close();
          return;
        }
        if (u.classList.contains("open") && q instanceof Node) {
          let z = u.contains(q),
            $ = c.contains(q);
          !z && !$ && A(!1);
        }
      }),
      document.addEventListener("keydown", (R) => {
        if (R.key !== "Escape") return;
        let q = u.classList.contains("open");
        (A(!1), q && c.focus({ preventScroll: !0 }), b.close());
      }));
  }
  function J(e, t, a) {
    let i = document.createElement(e);
    return (t && (i.className = t), a !== void 0 && (i.textContent = a), i);
  }
  function Lt(e, t) {
    let a = e.findIndex((i) => i.value === t);
    return a >= 0 ? a : 0;
  }
  function Ne(e) {
    e instanceof HTMLElement &&
      requestAnimationFrame(() => {
        e.scrollIntoView({ block: "nearest", inline: "nearest" });
      });
  }
  function Ea(e) {
    let t = J("div", "case-card-fallback-preview");
    ((t.dataset.caseCategory = e.category), (t.dataset.caseLevel = e.level));
    let a = J("span", "case-preview-eye"),
      i = J("span", "case-preview-eye");
    return (t.append(a, i), t);
  }
  function It({ state: e, dom: t, onSelectCase: a, onBeforeOpen: i } = {}) {
    let {
      body: c,
      caseModal: u,
      caseModalContent: x,
      closeCaseModalButton: d,
      caseSectionsContainer: E,
      caseSimilarTool: S,
      caseSimilarList: p,
      caseSafetyModal: v,
      caseSafetyModalContent: h,
      closeCaseSafetyModalButton: C,
      caseSafetyTitle: I,
      caseSafetyBody: A,
      casePicker: b,
      casePreviousButton: k,
      caseNextButton: H,
      caseTriggerButton: R,
      caseTriggerLabel: q,
      caseTriggerLevel: z,
      caseTriggerSafety: $,
    } = t;
    if (
      !c ||
      !u ||
      !x ||
      !d ||
      !E ||
      !v ||
      !h ||
      !C ||
      !I ||
      !A ||
      !b ||
      !k ||
      !H ||
      !R ||
      !q ||
      !z ||
      !$
    )
      return {
        init() {},
        update() {},
        selectNextCase() {},
        selectPreviousCase() {},
      };
    let G = pe({ body: c, focusRoot: x, initialFocusElement: d, modal: u });
    function j(T) {
      G.isOpen() &&
        (u.toggleAttribute("inert", T),
        u.setAttribute("aria-hidden", String(T)));
    }
    let X = pe({
      body: c,
      focusRoot: h,
      initialFocusElement: C,
      modal: v,
      onAfterClose: () => j(!1),
      onAfterOpen: () => j(!0),
    });
    function te() {
      return Ae({ babyOnly: e.isBabyMode });
    }
    function Z(T, B) {
      let s = we(T);
      !s ||
        typeof a != "function" ||
        (a(s.value),
        G.close({ restoreFocus: !1 }),
        le(),
        B instanceof HTMLElement && B.focus());
    }
    function U(T) {
      let B = te();
      if (!B.length || e.isTestMode) return;
      let y = (Lt(B, e.currentRefraction) + T + B.length) % B.length;
      Z(B[y].value);
    }
    function Q(T, B) {
      T != null &&
        T.safetyNote &&
        ((I.textContent = T.safetyNote.title),
        (A.textContent = T.safetyNote.body),
        X.open({ triggerElement: B }));
    }
    function ee(T) {
      let B = J("div", "case-card-shell");
      ((B.dataset.caseValue = T.value),
        T.safetyNote && B.classList.add("has-safety-note"));
      let s = J("button", "case-card");
      ((s.type = "button"),
        (s.dataset.caseValue = T.value),
        (s.dataset.level = T.level),
        s.setAttribute("aria-pressed", String(T.value === e.currentRefraction)),
        T.safetyNote &&
          s.setAttribute("aria-label", `${T.label}. Safety note available.`));
      let y = J("span", "case-card-header"),
        M = J("span", "case-card-badge", String(T.index)),
        P = J("span", "case-card-text"),
        r = J("span", "case-card-title", T.label),
        o = J("span", "case-card-summary", T.summary);
      (P.append(r, o), y.append(M, P));
      let n = J("span", "case-card-media"),
        g = document.createElement("img");
      if (
        ((g.src = T.thumbnailSrc),
        (g.alt = ""),
        (g.loading = "lazy"),
        (g.decoding = "async"),
        g.addEventListener(
          "error",
          () => {
            n.replaceChildren(Ea(T));
          },
          { once: !0 },
        ),
        n.appendChild(g),
        s.append(y, n),
        s.addEventListener("click", () => Z(T.value, s)),
        s.addEventListener("focus", () => Ne(s)),
        B.appendChild(s),
        T.safetyNote)
      ) {
        let l = J("button", "case-safety-button");
        ((l.type = "button"),
          (l.dataset.caseValue = T.value),
          l.setAttribute("aria-label", `Safety note for ${T.label}`),
          l.setAttribute("aria-haspopup", "dialog"),
          l.setAttribute("aria-controls", "caseSafetyModal"));
        let w = J("span", "case-warning-symbol");
        (w.setAttribute("aria-hidden", "true"),
          l.appendChild(w),
          l.addEventListener("click", () => Q(T, l)),
          l.addEventListener("focus", () => Ne(B)),
          B.appendChild(l));
      }
      return B;
    }
    function ae() {
      if (!S || !p) return;
      let T = te(),
        B = Lt(T, e.currentRefraction),
        s = T[B];
      if (!s) {
        ((S.hidden = !0), p.replaceChildren());
        return;
      }
      let y = [-1, 1]
        .map((P) => {
          let r = B + P;
          return T[r] || null;
        })
        .filter((P) => P && P.level === s.level);
      if (!y.length) {
        ((S.hidden = !0), p.replaceChildren());
        return;
      }
      let M = document.createDocumentFragment();
      (y.forEach((P) => {
        let r = J("button", "case-similar-chip", `${P.index}. ${P.label}`);
        ((r.type = "button"),
          (r.dataset.caseValue = P.value),
          r.addEventListener("click", () => Z(P.value, r)),
          M.appendChild(r));
      }),
        p.replaceChildren(M),
        (S.hidden = !1),
        (S.open = !1));
    }
    function K() {
      let T = te(),
        B = document.createDocumentFragment();
      (mt.forEach((s) => {
        let y = T.filter((g) => g.level === s.value);
        if (!y.length) return;
        let M = document.createElement("details");
        ((M.className = "case-level-section"),
          (M.dataset.level = s.value),
          (M.open = s.value === "primary"));
        let P = J("summary", "case-level-summary"),
          r = J("span", "case-level-label", s.label),
          o = J("span", "case-level-count", `(${y.length})`);
        P.append(r, o);
        let n = J("div", "case-card-grid");
        (y.forEach((g) => {
          n.appendChild(ee(g));
        }),
          M.append(P, n),
          B.appendChild(M));
      }),
        E.replaceChildren(B));
    }
    function le() {
      let T = we(e.currentRefraction);
      if (!T) return;
      ((q.textContent = T.label),
        (z.textContent = ""),
        (z.dataset.level = T.level),
        (R.dataset.level = T.level),
        ($.hidden = !T.safetyNote),
        R.classList.toggle("has-safety-note", !!T.safetyNote),
        R.setAttribute(
          "aria-label",
          `Case: ${T.label}. ${T.levelLabel}.${T.safetyNote ? " Safety note available." : ""}`,
        ));
      let s = te().length > 1;
      ((k.disabled = e.isTestMode || !s),
        (H.disabled = e.isTestMode || !s),
        (R.disabled = e.isTestMode),
        G.isOpen() && (K(), ae()));
    }
    function oe(T) {
      if (e.isTestMode) return;
      (typeof i == "function" && i(), K(), ae(), G.open({ triggerElement: T }));
      let B = E.querySelector(
        `.case-card[data-case-value="${CSS.escape(e.currentRefraction)}"]`,
      );
      Ne(B);
    }
    function ge() {
      (k.addEventListener("click", () => U(-1)),
        H.addEventListener("click", () => U(1)),
        R.addEventListener("click", () => oe(R)),
        d.addEventListener("click", () => G.close()),
        C.addEventListener("click", () => X.close()),
        u.addEventListener("click", (T) => {
          T.target === u && G.close();
        }),
        v.addEventListener("click", (T) => {
          T.target === v && X.close();
        }),
        le());
    }
    return {
      init: ge,
      selectNextCase: () => U(1),
      selectPreviousCase: () => U(-1),
      update: le,
    };
  }
  function Ca(e) {
    e && (e.style.opacity = "0");
  }
  function Ma(e, t) {
    ((e.style.width = t.width),
      (e.style.height = t.height),
      (e.style.minWidth = t.minWidth),
      (e.style.minHeight = t.minHeight),
      (e.style.maxWidth = t.maxWidth),
      (e.style.maxHeight = t.maxHeight),
      (e.style.borderRadius = t.borderRadius),
      (e.style.transform = t.transform),
      (e.style.background = t.background),
      (e.style.filter = t.filter),
      (e.style.opacity = t.opacity));
  }
  function wa() {
    return {
      width: "104%",
      height: "92%",
      minWidth: "24px",
      minHeight: "22px",
      maxWidth: "48px",
      maxHeight: "42px",
      borderRadius: "44% 56% 50% 48% / 50% 42% 60% 48%",
      transform: "translate(-50%, -50%) rotate(-9deg)",
      background: `
      radial-gradient(
        ellipse 94% 86% at 50% 50%,
        rgba(0, 0, 0, 0.34) 0%,
        rgba(0, 0, 0, 0.28) 34%,
        rgba(0, 0, 0, 0.16) 60%,
        rgba(0, 0, 0, 0) 80%
      ),
      linear-gradient(
        19deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 22%,
        rgba(0, 0, 0, 0.62) 27%,
        rgba(0, 0, 0, 0.78) 29%,
        rgba(0, 0, 0, 0.34) 33%,
        rgba(0, 0, 0, 0) 39%,
        rgba(0, 0, 0, 0) 100%
      ),
      linear-gradient(
        -16deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 30%,
        rgba(0, 0, 0, 0.58) 34%,
        rgba(0, 0, 0, 0.74) 36%,
        rgba(0, 0, 0, 0.3) 40%,
        rgba(0, 0, 0, 0) 47%,
        rgba(0, 0, 0, 0) 100%
      ),
      linear-gradient(
        57deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 39%,
        rgba(0, 0, 0, 0.54) 43%,
        rgba(0, 0, 0, 0.68) 45%,
        rgba(0, 0, 0, 0.28) 49%,
        rgba(0, 0, 0, 0) 56%,
        rgba(0, 0, 0, 0) 100%
      ),
      linear-gradient(
        -51deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 48%,
        rgba(0, 0, 0, 0.48) 52%,
        rgba(0, 0, 0, 0.62) 54%,
        rgba(0, 0, 0, 0.26) 58%,
        rgba(0, 0, 0, 0) 64%,
        rgba(0, 0, 0, 0) 100%
      ),
      radial-gradient(
        ellipse 18% 16% at 28% 30%,
        rgba(0, 0, 0, 0.72) 0%,
        rgba(0, 0, 0, 0.46) 32%,
        rgba(0, 0, 0, 0) 60%
      ),
      radial-gradient(
        ellipse 16% 14% at 66% 62%,
        rgba(0, 0, 0, 0.66) 0%,
        rgba(0, 0, 0, 0.4) 34%,
        rgba(0, 0, 0, 0) 60%
      ),
      radial-gradient(
        ellipse 13% 12% at 48% 42%,
        rgba(0, 0, 0, 0.62) 0%,
        rgba(0, 0, 0, 0.34) 36%,
        rgba(0, 0, 0, 0) 62%
      ),
      radial-gradient(
        ellipse 12% 10% at 58% 30%,
        rgba(0, 0, 0, 0.56) 0%,
        rgba(0, 0, 0, 0.28) 34%,
        rgba(0, 0, 0, 0) 62%
      ),
      radial-gradient(
        ellipse 12% 11% at 40% 68%,
        rgba(0, 0, 0, 0.54) 0%,
        rgba(0, 0, 0, 0.24) 34%,
        rgba(0, 0, 0, 0) 62%
      )
    `,
      filter: "blur(0.04px)",
      opacity: "0.9",
    };
  }
  function Aa() {
    return {
      width: "48%",
      height: "48%",
      minWidth: "13px",
      minHeight: "13px",
      maxWidth: "26px",
      maxHeight: "26px",
      borderRadius: "28% 66% 34% 72% / 36% 24% 78% 62%",
      transform: "translate(-50%, -50%) rotate(-13deg)",
      background: `
      radial-gradient(
        ellipse 74% 72% at 50% 50%,
        rgba(8, 8, 8, 0.98) 0%,
        rgba(8, 8, 8, 0.98) 34%,
        rgba(8, 8, 8, 0.9) 46%,
        rgba(8, 8, 8, 0.36) 58%,
        rgba(8, 8, 8, 0) 72%
      ),
      radial-gradient(
        ellipse 20% 16% at 18% 52%,
        rgba(0, 0, 0, 0.99) 0%,
        rgba(0, 0, 0, 0.9) 34%,
        rgba(0, 0, 0, 0) 64%
      ),
      radial-gradient(
        ellipse 18% 15% at 22% 46%,
        rgba(0, 0, 0, 0.98) 0%,
        rgba(0, 0, 0, 0.88) 36%,
        rgba(0, 0, 0, 0) 62%
      ),
      radial-gradient(
        ellipse 20% 18% at 28% 34%,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.86) 38%,
        rgba(0, 0, 0, 0) 62%
      ),
      radial-gradient(
        ellipse 18% 16% at 72% 32%,
        rgba(0, 0, 0, 0.94) 0%,
        rgba(0, 0, 0, 0.82) 36%,
        rgba(0, 0, 0, 0) 60%
      ),
      radial-gradient(
        ellipse 22% 18% at 66% 72%,
        rgba(0, 0, 0, 0.94) 0%,
        rgba(0, 0, 0, 0.82) 34%,
        rgba(0, 0, 0, 0) 58%
      ),
      radial-gradient(
        ellipse 18% 16% at 34% 70%,
        rgba(0, 0, 0, 0.92) 0%,
        rgba(0, 0, 0, 0.78) 34%,
        rgba(0, 0, 0, 0) 58%
      ),
      radial-gradient(
        ellipse 16% 14% at 78% 56%,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.84) 34%,
        rgba(0, 0, 0, 0) 58%
      ),
      radial-gradient(
        ellipse 18% 16% at 82% 64%,
        rgba(0, 0, 0, 0.98) 0%,
        rgba(0, 0, 0, 0.88) 36%,
        rgba(0, 0, 0, 0) 60%
      ),
      conic-gradient(
        from 8deg at 50% 50%,
        rgba(0, 0, 0, 0) 0deg,
        rgba(0, 0, 0, 0) 10deg,
        rgba(0, 0, 0, 0.92) 10deg,
        rgba(0, 0, 0, 0.92) 30deg,
        rgba(0, 0, 0, 0) 30deg,
        rgba(0, 0, 0, 0) 50deg,
        rgba(0, 0, 0, 0.84) 50deg,
        rgba(0, 0, 0, 0.84) 68deg,
        rgba(0, 0, 0, 0) 68deg,
        rgba(0, 0, 0, 0) 96deg,
        rgba(0, 0, 0, 0.88) 96deg,
        rgba(0, 0, 0, 0.88) 118deg,
        rgba(0, 0, 0, 0) 118deg,
        rgba(0, 0, 0, 0) 146deg,
        rgba(0, 0, 0, 0.82) 146deg,
        rgba(0, 0, 0, 0.82) 164deg,
        rgba(0, 0, 0, 0) 164deg,
        rgba(0, 0, 0, 0) 196deg,
        rgba(0, 0, 0, 0.86) 196deg,
        rgba(0, 0, 0, 0.86) 218deg,
        rgba(0, 0, 0, 0) 218deg,
        rgba(0, 0, 0, 0) 248deg,
        rgba(0, 0, 0, 0.84) 248deg,
        rgba(0, 0, 0, 0.84) 268deg,
        rgba(0, 0, 0, 0) 268deg,
        rgba(0, 0, 0, 0) 300deg,
        rgba(0, 0, 0, 0.82) 300deg,
        rgba(0, 0, 0, 0.82) 322deg,
        rgba(0, 0, 0, 0) 322deg,
        rgba(0, 0, 0, 0) 360deg
      )
    `,
      filter: "blur(0.04px)",
      opacity: "0.95",
    };
  }
  function Ta() {
    return {
      width: "44%",
      height: "44%",
      minWidth: "11px",
      minHeight: "11px",
      maxWidth: "23px",
      maxHeight: "23px",
      borderRadius: "48% 55% 57% 45% / 52% 48% 56% 44%",
      transform: "translate(-50%, -50%) rotate(-8deg)",
      background: `
      radial-gradient(
        ellipse 78% 74% at 50% 50%,
        rgba(38, 38, 38, 0.98) 0%,
        rgba(42, 42, 42, 0.92) 24%,
        rgba(48, 48, 48, 0.66) 44%,
        rgba(58, 58, 58, 0.3) 64%,
        rgba(58, 58, 58, 0) 82%
      ),
      radial-gradient(
        ellipse 26% 20% at 34% 36%,
        rgba(48, 48, 48, 0.66) 0%,
        rgba(52, 52, 52, 0.34) 34%,
        rgba(72, 72, 72, 0) 58%
      ),
      radial-gradient(
        ellipse 22% 18% at 66% 60%,
        rgba(46, 46, 46, 0.6) 0%,
        rgba(50, 50, 50, 0.3) 34%,
        rgba(66, 66, 66, 0) 58%
      )
    `,
      filter: "blur(0.9px)",
      opacity: "0.94",
    };
  }
  function La(e) {
    return e.posteriorCapsularThickeningCase
      ? wa()
      : e.posteriorPoleCataractCase
        ? Aa()
        : e.centralSubCorticalCataractCase
          ? Ta()
          : null;
  }
  function Rt({ maskElement: e, flags: t, isActiveEye: a }) {
    if (!e) return;
    let i = a && La(t);
    if (!i) {
      Ca(e);
      return;
    }
    Ma(e, i);
  }
  var L = {
      ACG: "acg",
      ANIRIDIA: "aniridia",
      APHAKIA: "aphakia",
      ANISOMETROPIA: "anisometropia",
      BIG_CORTICAL_CATARACT: "big-cortical-cataract",
      CENTRAL_SUB_CORTICAL_CATARACT: "central-sub-cortical-cataract",
      CORNEAL_SCAR: "corneal-scar",
      DENSE_CATARACT: "dense-cataract",
      FLOATERS: "floaters",
      HIGH_CYLINDER: "high-cylinder",
      HIGH_MINUS: "high-minus",
      HIGH_PLUS: "high-plus",
      KERATOCONUS: "keratoconus",
      IRIS_TRANSILLUMINATION: "iris-transillumination",
      LEUCOCORIA: "leucocoria",
      MINUS: "minus",
      NASAL_COLOBOMA: "nasal-coloboma",
      PARTIAL_RETINAL_DETACHMENT: "partial-retinal-detachment",
      POSTERIOR_CAPSULAR_THICKENING: "posterior-capsular-thickening",
      POSTERIOR_POLE_CATARACT: "posterior-pole-cataract",
      PLUS: "plus",
      POOR_TEAR_FILM: "poor-tear-film",
      SMALL_CORTICAL_CATARACT: "small-cortical-cataract",
      SMALL_PUPILS: "small-pupils",
      SMALL_SCISSORS: "small-scissors",
      VITREOUS_HAEMORRHAGE: "vitreous-haemorrhage",
      ZERO: ke,
    },
    kt = Object.freeze({
      minimumFactor: 0.12,
      fadeDistanceRatio: 1.35,
      softness: 1.15,
    }),
    ve = Object.freeze({
      brightnessFloor: 0.4,
      blurBoostPx: 0.5,
      opacityFloor: 0.25,
    }),
    Ot =
      "radial-gradient(ellipse 72% 62% at 50% 50%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.52) 28%, rgba(255, 255, 255, 0.16) 56%, rgba(255, 255, 255, 0.04) 72%, rgba(255, 255, 255, 0) 84%)";
  function Se(e, t) {
    return Math.floor(Math.random() * (t - e + 1)) + e;
  }
  function Te(e, t) {
    return Math.random() * (t - e) + e;
  }
  function Ia(e, t) {
    let a = Math.abs(e - t) % 360;
    return a > 180 ? 360 - a : a;
  }
  function Ra({
    probeOffsetX: e,
    probeOffsetY: t,
    pupilRadiusPx: a,
    profile: i = kt,
  }) {
    let c = Math.hypot(e, t),
      u = a,
      { minimumFactor: x, fadeDistanceRatio: d, softness: E } = i;
    if (c <= u) return 1;
    let S = Math.max(1.5, a * d),
      p = c - u,
      v = Math.max(0, Math.min(1, p / S)),
      h = v * v * (3 - 2 * v);
    return 1 - Math.pow(h, E) * (1 - Math.max(0, x));
  }
  function Fe(e) {
    let t = e === L.ACG,
      a = e === L.ANIRIDIA,
      i = e === L.APHAKIA,
      c = _e.has(e),
      u = e === L.SMALL_SCISSORS,
      x = e === L.KERATOCONUS,
      d = e === L.CORNEAL_SCAR,
      E = e === L.DENSE_CATARACT,
      S = e === L.FLOATERS,
      p = e === L.ANISOMETROPIA,
      v = e === L.IRIS_TRANSILLUMINATION,
      h = e === L.LEUCOCORIA,
      C = e === L.NASAL_COLOBOMA,
      I = e === L.PARTIAL_RETINAL_DETACHMENT,
      A = e === L.POSTERIOR_CAPSULAR_THICKENING,
      b = e === L.POOR_TEAR_FILM,
      k = e === L.SMALL_CORTICAL_CATARACT,
      H = e === L.SMALL_PUPILS,
      R = e === L.BIG_CORTICAL_CATARACT,
      q = e === L.CENTRAL_SUB_CORTICAL_CATARACT,
      z = e === L.POSTERIOR_POLE_CATARACT,
      $ = e === L.VITREOUS_HAEMORRHAGE;
    return {
      acgCase: t,
      aniridiaCase: a,
      aphakiaCase: i,
      anisometropiaCase: p,
      bigCorticalCataractCase: R,
      centralSubCorticalCataractCase: q,
      cornealScarCase: d,
      corticalCataractCase: k || R,
      cylinderCase: c,
      denseCataractCase: E,
      floatersCase: S,
      irisTransilluminationCase: v,
      keratoconusCase: x,
      leucocoriaCase: h,
      nasalColobomaCase: C,
      partialRetinalDetachmentCase: I,
      posteriorCapsularThickeningCase: A,
      posteriorPoleCataractCase: z,
      poorTearFilmCase: b,
      scissorsCase: u,
      smallCorticalCataractCase: k,
      smallPupilsCase: H,
      vitreousHaemorrhageCase: $,
    };
  }
  function _t(e) {
    return dt.has(e);
  }
  function qe(e, t) {
    return e === L.ANISOMETROPIA
      ? t === "left"
        ? L.PLUS
        : L.MINUS
      : e === L.ACG ||
          e === L.ANIRIDIA ||
          e === L.IRIS_TRANSILLUMINATION ||
          e === L.NASAL_COLOBOMA ||
          e === L.POSTERIOR_CAPSULAR_THICKENING ||
          e === L.SMALL_PUPILS
        ? L.ZERO
        : e;
  }
  function Pt(e) {
    let t = e % 180;
    return t < 0 ? t + 180 : t;
  }
  function Dt(e, t) {
    let a = Math.abs(e - t) % 180;
    return a > 90 ? 180 - a : a;
  }
  function ze(e) {
    let t = Se(3, 4),
      a = e ? 30 : 34,
      i = [],
      c = 0;
    for (; i.length < t && c < 500; ) {
      let u = Se(0, 359);
      (i.some((d) => Ia(d, u) < a) || i.push(u), (c += 1));
    }
    for (; i.length < t; ) i.push(Se(0, 359));
    return {
      wedges: i.map((u) => ({
        angleDeg: u,
        opacity: e ? Te(0.82, 0.93) : Te(0.72, 0.86),
        widthDeg: e ? Te(28, 40) : Te(20, 30),
      })),
    };
  }
  function ka(e) {
    let t = e % 360;
    return t < 0 ? t + 360 : t;
  }
  function Bt(e) {
    return e.wedges.map((t) => {
      let a = ka(t.angleDeg - t.widthDeg * 0.5),
        i = t.widthDeg.toFixed(1),
        c = t.opacity.toFixed(2);
      return `
      conic-gradient(
        from ${a.toFixed(1)}deg at 50% 50%,
        rgba(0, 0, 0, ${c}) 0deg,
        rgba(0, 0, 0, ${c}) ${i}deg,
        rgba(0, 0, 0, 0) ${i}deg,
        rgba(0, 0, 0, 0) 360deg
      )`;
    }).join(`,
`);
  }
  function Nt() {
    let e = [
        { min: 20, max: 70, weight: 4 },
        { min: 110, max: 160, weight: 4 },
        { min: 0, max: 19, weight: 1 },
        { min: 71, max: 109, weight: 1 },
        { min: 161, max: 179, weight: 1 },
      ],
      t = e.reduce((i, c) => i + c.weight, 0),
      a = Math.random() * t;
    for (let i of e) if (((a -= i.weight), a <= 0)) return Se(i.min, i.max);
    return Se(20, 70);
  }
  function Ft(e) {
    let t = Math.max(0, Math.min(100, e)) / 100;
    return {
      brightnessScale: 1 - t * 0.24,
      blurBoostPx: t * 0.8,
      opacityScale: 1 - t * 0.55,
    };
  }
  function qt({ probeOffsetX: e, probeOffsetY: t, pupilRadiusPx: a }) {
    let i = Ra({
      probeOffsetX: e,
      probeOffsetY: t,
      pupilRadiusPx: a,
      profile: kt,
    });
    return {
      edgeBlurBoostPx: (1 - i) * ve.blurBoostPx,
      edgeBrightnessScale: ve.brightnessFloor + i * (1 - ve.brightnessFloor),
      edgeOpacityScale: ve.opacityFloor + i * (1 - ve.opacityFloor),
    };
  }
  function zt({
    activeEye: e,
    activeRefraction: t,
    currentRefraction: a,
    flags: i,
    movementSign: c,
  }) {
    if (a === L.ZERO) return "Neutral (0)";
    if (i.anisometropiaCase) {
      let u = e === "left" ? "RE" : "LE";
      return t.includes(L.PLUS)
        ? `<em>${u}</em> Fast With movement`
        : `<em>${u}</em> Fast Against movement`;
    }
    if (i.aphakiaCase) return "<em>Very slow</em> With movement (aphakia)";
    if (i.acgCase) return "<em>Stylised</em> Vertical oval pupil (ACG)";
    if (i.aniridiaCase) return "<em>Large</em> Pupil (aniridia)";
    if (i.smallPupilsCase) return "<em>Small</em> Pupils";
    if (i.scissorsCase) return "<em>Small</em> Scissors reflex";
    if (i.keratoconusCase) return "<em>Irregular</em> Scissors reflex";
    if (i.cornealScarCase) return "<em>Diffuse</em> Corneal scar reflex";
    if (i.vitreousHaemorrhageCase)
      return "<em>Diffuse</em> Vitreous haemorrhage reflex";
    if (i.floatersCase) return "<em>Mobile</em> Floater shadows";
    if (i.partialRetinalDetachmentCase) return "<em>Sectoral</em> Dull reflex";
    if (i.poorTearFilmCase) return "<em>Variable</em> Tear film reflex";
    if (i.smallCorticalCataractCase)
      return "<em>Dull</em> Small cortical cataract reflex";
    if (i.bigCorticalCataractCase)
      return "<em>Dull</em> Big cortical cataract reflex";
    if (i.centralSubCorticalCataractCase)
      return "<em>Dull</em> Posterior subcapsular cataract reflex";
    if (i.posteriorPoleCataractCase)
      return "<em>Very dull</em> Posterior pole cataract reflex";
    if (i.posteriorCapsularThickeningCase)
      return "<em>Dull</em> Posterior capsular thickening reflex";
    if (i.denseCataractCase) return "<em>Very dull</em> Dense cataract reflex";
    if (i.leucocoriaCase) return "<em>White</em> Pupil reflex";
    if (i.irisTransilluminationCase)
      return "<em>Normal</em> Iris transillumination";
    if (i.nasalColobomaCase) return "<em>Normal</em> Nasal coloboma pupil";
    if (i.cylinderCase) {
      if (Math.abs(c) < 0.08) return "Transition in stylised reflex";
      let u = a === L.HIGH_CYLINDER,
        d =
          Math.pow(Math.abs(c), 0.9) * (u ? 0.75 : 0.58) >= 0.38
            ? "Fast"
            : "Slow";
      return c > 0
        ? `<em>${d}</em> With movement (astigmatism)`
        : `<em>${d}</em> Against movement (astigmatism)`;
    }
    return t === L.HIGH_PLUS
      ? "<em>Slow</em> With movement (+)"
      : t === L.HIGH_MINUS
        ? "<em>Slow</em> Against movement (-)"
        : t === L.PLUS
          ? "<em>Fast</em> With movement (+)"
          : t === L.MINUS
            ? "<em>Fast</em> Against movement (-)"
            : "Neutral (0)";
  }
  function He({ flags: e, timeSec: t }) {
    if (
      !e.floatersCase &&
      !e.vitreousHaemorrhageCase &&
      !e.partialRetinalDetachmentCase &&
      !e.leucocoriaCase
    )
      return { background: "none", blurPx: 0, opacity: 0, transform: "none" };
    if (e.partialRetinalDetachmentCase)
      return {
        background: `
        radial-gradient(
          ellipse 124% 98% at 18% 20%,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 1) 54%,
          rgba(0, 0, 0, 0.2) 54%,
          rgba(0, 0, 0, 0.2) 55.8%,
          rgba(0, 0, 0, 0) 56.2%
        ),
        radial-gradient(
          ellipse 124% 98% at 18% 20%,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0) 53.4%,
          rgba(0, 0, 0, 0.9) 53.4%,
          rgba(0, 0, 0, 0.9) 54.2%,
          rgba(0, 0, 0, 0) 55%
        )
      `,
        blurPx: 0,
        opacity: 0.98,
        transform: "none",
      };
    if (e.leucocoriaCase)
      return {
        background: `
        radial-gradient(
          ellipse 17% 4.8% at 20% 42%,
          rgba(214, 28, 24, 0.92) 0%,
          rgba(214, 28, 24, 0.64) 44%,
          rgba(214, 28, 24, 0.24) 62%,
          rgba(142, 42, 42, 0) 76%
        ),
        radial-gradient(
          ellipse 16% 4.4% at 34% 39%,
          rgba(220, 32, 26, 0.88) 0%,
          rgba(220, 32, 26, 0.6) 44%,
          rgba(220, 32, 26, 0.24) 62%,
          rgba(146, 46, 46, 0) 76%
        ),
        radial-gradient(
          ellipse 18% 4.8% at 49% 41%,
          rgba(226, 36, 28, 0.88) 0%,
          rgba(226, 36, 28, 0.58) 44%,
          rgba(226, 36, 28, 0.24) 62%,
          rgba(150, 48, 48, 0) 76%
        ),
        radial-gradient(
          ellipse 17% 4.4% at 65% 44%,
          rgba(218, 30, 26, 0.84) 0%,
          rgba(218, 30, 26, 0.54) 44%,
          rgba(218, 30, 26, 0.22) 62%,
          rgba(146, 44, 44, 0) 76%
        ),
        radial-gradient(
          ellipse 15% 4% at 79% 46%,
          rgba(208, 26, 24, 0.76) 0%,
          rgba(208, 26, 24, 0.48) 42%,
          rgba(208, 26, 24, 0.2) 60%,
          rgba(142, 40, 40, 0) 74%
        ),
        radial-gradient(
          ellipse 16% 4.4% at 18% 61%,
          rgba(212, 24, 22, 0.86) 0%,
          rgba(212, 24, 22, 0.58) 42%,
          rgba(212, 24, 22, 0.22) 60%,
          rgba(138, 38, 38, 0) 74%
        ),
        radial-gradient(
          ellipse 18% 4.6% at 36% 58%,
          rgba(220, 28, 26, 0.84) 0%,
          rgba(220, 28, 26, 0.56) 42%,
          rgba(220, 28, 26, 0.22) 60%,
          rgba(144, 42, 42, 0) 74%
        ),
        radial-gradient(
          ellipse 17% 4.4% at 55% 60%,
          rgba(224, 30, 28, 0.82) 0%,
          rgba(224, 30, 28, 0.52) 42%,
          rgba(224, 30, 28, 0.22) 60%,
          rgba(148, 46, 46, 0) 74%
        ),
        radial-gradient(
          ellipse 16% 4% at 73% 57%,
          rgba(210, 26, 26, 0.74) 0%,
          rgba(210, 26, 26, 0.46) 40%,
          rgba(210, 26, 26, 0.2) 58%,
          rgba(142, 40, 40, 0) 72%
        ),
        radial-gradient(
          ellipse 20% 16% at 29% 34%,
          rgba(102, 102, 102, 0.82) 0%,
          rgba(102, 102, 102, 0.58) 32%,
          rgba(102, 102, 102, 0) 58%
        ),
        radial-gradient(
          ellipse 17% 14% at 68% 32%,
          rgba(112, 112, 112, 0.78) 0%,
          rgba(112, 112, 112, 0.52) 30%,
          rgba(112, 112, 112, 0) 56%
        ),
        radial-gradient(
          ellipse 18% 15% at 63% 69%,
          rgba(108, 108, 108, 0.74) 0%,
          rgba(108, 108, 108, 0.48) 30%,
          rgba(108, 108, 108, 0) 56%
        ),
        radial-gradient(
          ellipse 15% 12% at 44% 57%,
          rgba(118, 118, 118, 0.72) 0%,
          rgba(118, 118, 118, 0.46) 28%,
          rgba(118, 118, 118, 0) 52%
        ),
        radial-gradient(
          ellipse 24% 18% at 38% 42%,
          rgba(126, 126, 126, 0.7) 0%,
          rgba(126, 126, 126, 0.46) 30%,
          rgba(116, 116, 116, 0) 54%
        ),
        radial-gradient(
          ellipse 18% 14% at 62% 36%,
          rgba(136, 136, 136, 0.66) 0%,
          rgba(136, 136, 136, 0.42) 28%,
          rgba(136, 136, 136, 0) 50%
        ),
        radial-gradient(
          ellipse 22% 16% at 58% 64%,
          rgba(130, 130, 130, 0.62) 0%,
          rgba(130, 130, 130, 0.38) 30%,
          rgba(130, 130, 130, 0) 52%
        ),
        radial-gradient(
          ellipse 28% 22% at 34% 40%,
          rgba(156, 156, 156, 0.62) 0%,
          rgba(156, 156, 156, 0.38) 34%,
          rgba(156, 156, 156, 0) 58%
        ),
        radial-gradient(
          ellipse 22% 18% at 64% 34%,
          rgba(166, 166, 166, 0.56) 0%,
          rgba(166, 166, 166, 0.34) 30%,
          rgba(166, 166, 166, 0) 54%
        ),
        radial-gradient(
          ellipse 26% 20% at 58% 66%,
          rgba(146, 146, 146, 0.54) 0%,
          rgba(146, 146, 146, 0.32) 30%,
          rgba(146, 146, 146, 0) 54%
        ),
        radial-gradient(
          ellipse 20% 16% at 46% 54%,
          rgba(170, 170, 170, 0.46) 0%,
          rgba(170, 170, 170, 0.24) 28%,
          rgba(170, 170, 170, 0) 50%
        ),
        radial-gradient(
          ellipse 16% 14% at 72% 58%,
          rgba(156, 156, 156, 0.4) 0%,
          rgba(156, 156, 156, 0.2) 26%,
          rgba(156, 156, 156, 0) 48%
        ),
      radial-gradient(
        ellipse 88% 84% at 50% 50%,
        rgba(248, 238, 216, 0.64) 0%,
        rgba(236, 224, 198, 0.36) 26%,
        rgba(214, 200, 176, 0.12) 54%,
        rgba(194, 180, 156, 0.04) 82%,
        rgba(255, 248, 232, 0) 94%
      )
      `,
        blurPx: 0.09,
        opacity: 0.72,
        transform: "none",
      };
    if (e.vitreousHaemorrhageCase)
      return {
        background: `
        radial-gradient(
          ellipse 88% 78% at 50% 50%,
          rgba(0, 0, 0, 0.54) 0%,
          rgba(0, 0, 0, 0.3) 40%,
          rgba(0, 0, 0, 0.08) 74%,
          rgba(0, 0, 0, 0) 92%
        ),
        radial-gradient(
          ellipse 28% 24% at 30% 40%,
          rgba(0, 0, 0, 0.96) 0%,
          rgba(0, 0, 0, 0.96) 54%,
          rgba(0, 0, 0, 0.78) 70%,
          rgba(0, 0, 0, 0) 84%
        ),
        radial-gradient(
          ellipse 22% 18% at 66% 56%,
          rgba(0, 0, 0, 0.92) 0%,
          rgba(0, 0, 0, 0.92) 54%,
          rgba(0, 0, 0, 0.74) 70%,
          rgba(0, 0, 0, 0) 84%
        ),
        radial-gradient(
          ellipse 18% 14% at 54% 26%,
          rgba(0, 0, 0, 0.88) 0%,
          rgba(0, 0, 0, 0.88) 52%,
          rgba(0, 0, 0, 0.68) 68%,
          rgba(0, 0, 0, 0) 82%
        )
      `,
        blurPx: 0.08,
        opacity: 0.96,
        transform: "none",
      };
    let a = Math.sin(t * 0.32) * 2.2 + Math.cos(t * 0.21 + 0.4) * 1.1,
      i = Math.cos(t * 0.28 + 0.7) * 1.7 + Math.sin(t * 0.18 + 1.1) * 0.8;
    return {
      background: `
      radial-gradient(
        ellipse 13% 10% at 28% 38%,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 1) 58%,
        rgba(0, 0, 0, 0.84) 72%,
        rgba(0, 0, 0, 0) 84%
      ),
      radial-gradient(
        ellipse 7% 5% at 32% 35%,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.96) 54%,
        rgba(0, 0, 0, 0.76) 68%,
        rgba(0, 0, 0, 0) 80%
      ),
      radial-gradient(
        ellipse 11% 14% at 72% 62%,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 1) 58%,
        rgba(0, 0, 0, 0.82) 72%,
        rgba(0, 0, 0, 0) 84%
      ),
      radial-gradient(
        ellipse 6% 8% at 67% 58%,
        rgba(0, 0, 0, 0.94) 0%,
        rgba(0, 0, 0, 0.94) 52%,
        rgba(0, 0, 0, 0.74) 66%,
        rgba(0, 0, 0, 0) 78%
      )
    `,
      blurPx: 0,
      opacity: 0.98,
      transform: `translate(${a.toFixed(2)}px, ${i.toFixed(2)}px)`,
    };
  }
  function Ht(e) {
    return e === L.ZERO ? null : e.includes(L.PLUS);
  }
  function Vt(e) {
    switch (e) {
      case L.HIGH_MINUS:
      case L.HIGH_PLUS:
        return 0.1;
      case L.MINUS:
      case L.PLUS:
        return 0.3;
      default:
        return 0.2;
    }
  }
  function Ve({
    activeRefraction: e,
    axisDeltaRad: t,
    cataractLevel: a,
    cylinderAxisDeg: i,
    currentRefraction: c,
    flags: u,
    movementSign: x,
    retStreakOffset: d,
    timeSec: E,
  }) {
    let S = Ot,
      p = 0,
      v = Math.abs(d) < 1 ? 1 : 0.6,
      h = "",
      C = 0;
    if (u.scissorsCase) {
      let I = Math.min(25, 10 + Math.abs(d) * 0.4),
        A = Math.max(-16, Math.min(16, d * 0.22)),
        b = (50 - I + A).toFixed(1),
        k = (50 + I + A).toFixed(1),
        H = (37 - A * 0.35).toFixed(1),
        R = (63 + A * 0.35).toFixed(1);
      ((S = `
      radial-gradient(
        ellipse 46% 42% at ${b}% ${H}%,
        rgba(255, 255, 255, 0.86) 0%,
        rgba(255, 255, 255, 0.3) 34%,
        rgba(255, 255, 255, 0.05) 62%,
        rgba(255, 255, 255, 0) 76%
      ),
      radial-gradient(
        ellipse 46% 42% at ${k}% ${R}%,
        rgba(255, 255, 255, 0.86) 0%,
        rgba(255, 255, 255, 0.3) 34%,
        rgba(255, 255, 255, 0.05) 62%,
        rgba(255, 255, 255, 0) 76%
      )
    `),
        (p = d * 0.05),
        (h = " scale(1.06, 1.02)"),
        (C = 0.62),
        (v = Math.abs(d) < 1 ? 0.8 : 0.74));
    } else if (u.keratoconusCase) {
      let I = Math.sin(E * 3.2 + t * 1.35),
        A = 12 + 3.4 * Math.sin(E * 0.65),
        b = (50 - A).toFixed(1),
        k = (63 + I * 4).toFixed(1),
        H = (52 + A * 0.35).toFixed(1),
        R = (39 - I * 2.6).toFixed(1);
      ((S = `
      radial-gradient(
        ellipse 58% 50% at ${b}% ${k}%,
        rgba(255, 255, 255, 0.98) 0%,
        rgba(255, 255, 255, 0.34) 28%,
        rgba(255, 255, 255, 0.06) 58%,
        rgba(255, 255, 255, 0) 74%
      ),
      radial-gradient(
        ellipse 48% 44% at ${H}% ${R}%,
        rgba(255, 255, 255, 0.62) 0%,
        rgba(255, 255, 255, 0.22) 34%,
        rgba(255, 255, 255, 0.04) 60%,
        rgba(255, 255, 255, 0) 74%
      ),
      radial-gradient(
        ellipse 28% 24% at 52% 53%,
        rgba(0, 0, 0, 0.72) 0%,
        rgba(0, 0, 0, 0.36) 44%,
        rgba(0, 0, 0, 0) 72%
      )
    `),
        (p = d * x * 0.18 + Math.sin(E * 5.9 + t) * 1.3),
        (h = " scale(1.26, 1.14)"),
        (C = 1.12 + (1 - Math.abs(x)) * 1.22),
        (v = Math.abs(d) < 1 ? 0.84 : 0.7));
    } else if (u.aphakiaCase)
      ((S = `
      radial-gradient(
        ellipse 40% 48% at 50% 50%,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 1) 22%,
        rgba(255, 255, 255, 0.88) 42%,
        rgba(255, 255, 255, 0.28) 62%,
        rgba(255, 255, 255, 0) 74%
      ),
      radial-gradient(
        ellipse 96% 82% at 50% 50%,
        rgba(255, 255, 255, 0.82) 0%,
        rgba(255, 255, 255, 0.42) 38%,
        rgba(255, 255, 255, 0.14) 66%,
        rgba(255, 255, 255, 0) 88%
      )
    `),
        (p = d * 0.06),
        (h = " scale(1.02, 1.06)"),
        (C = 0.08),
        (v = Math.abs(d) < 1 ? 1 : 0.96));
    else if (u.cornealScarCase)
      ((S = `
      conic-gradient(
        from ${(((i + 22) % 180) * 2).toFixed(1)}deg at 50% 50%,
        rgba(0, 0, 0, 1) 0deg,
        rgba(0, 0, 0, 0.96) 64deg,
        rgba(0, 0, 0, 0.78) 108deg,
        rgba(0, 0, 0, 0.46) 148deg,
        rgba(18, 18, 18, 0) 360deg
      ),
      radial-gradient(
        ellipse 34% 48% at 50% 50%,
        rgba(0, 0, 0, 0.82) 0%,
        rgba(0, 0, 0, 0.46) 30%,
        rgba(0, 0, 0, 0.16) 56%,
        rgba(0, 0, 0, 0) 74%
      ),
      radial-gradient(
        ellipse at 50% 50%,
        rgba(255, 255, 255, 0.22) 16%,
        rgba(255, 255, 255, 0.06) 42%,
        rgba(255, 255, 255, 0.015) 74%,
        rgba(255, 255, 255, 0) 82%
      )
    `),
        (p = d * 0.12),
        (h = " scale(1.09, 1.05)"),
        (C = 1.35),
        (v = Math.abs(d) < 1 ? 0.84 : 0.72));
    else if (u.vitreousHaemorrhageCase)
      ((S = `
      radial-gradient(
        ellipse 82% 70% at 50% 50%,
        rgba(255, 255, 255, 0.72) 0%,
        rgba(255, 255, 255, 0.2) 34%,
        rgba(255, 255, 255, 0.04) 70%,
        rgba(255, 255, 255, 0) 86%
      )
    `),
        (p = d * 0.08),
        (h = " scale(1.04, 1.02)"),
        (C = 0.58),
        (v = Math.abs(d) < 1 ? 0.8 : 0.68));
    else if (u.floatersCase)
      ((S = `
      radial-gradient(
        ellipse 78% 66% at 50% 50%,
        rgba(255, 255, 255, 0.94) 0%,
        rgba(255, 255, 255, 0.34) 34%,
        rgba(255, 255, 255, 0.04) 68%,
        rgba(255, 255, 255, 0) 84%
      )
    `),
        (p = d * 0.16),
        (h = " scale(1.03, 1.02)"),
        (C = 0.08),
        (v = Math.abs(d) < 1 ? 1 : 0.92));
    else if (u.partialRetinalDetachmentCase) {
      let I = Math.abs(d);
      if (
        ((S = `
      radial-gradient(
        ellipse 74% 60% at 56% 54%,
        rgba(255, 255, 255, 0.92) 0%,
        rgba(255, 255, 255, 0.28) 34%,
        rgba(255, 255, 255, 0.08) 64%,
        rgba(255, 255, 255, 0) 82%
      )
    `),
        (p = 0),
        (h = " scale(1.06, 1.03)"),
        (C = 0.1),
        I <= 20)
      )
        v = 0.88;
      else if (I >= 42) v = 0.05;
      else {
        let A = (I - 20) / 22;
        v = 0.88 - A * A * (3 - 2 * A) * 0.83;
      }
    } else if (u.poorTearFilmCase) {
      let I =
          50 +
          Math.sin(E * 2.2) * 6 +
          Math.sin(E * 3.7 + 1.2) * 2.2 +
          Math.sin(E * 0.7 + 0.4) * 1.4,
        A = 50 + Math.cos(E * 1.9 + 0.4) * 4 + Math.sin(E * 3.1 + 0.9) * 1.3,
        b =
          0.55 + 0.25 * Math.sin(E * 2.6 + 0.9) + 0.2 * Math.sin(E * 4.9 + 0.2),
        k = Math.max(0.08, Math.min(0.98, b));
      ((S = `
      radial-gradient(
        ellipse at ${I.toFixed(1)}% ${A.toFixed(1)}%,
        rgba(255, 255, 255, 0.98) 14%,
        rgba(255, 255, 255, ${(0.22 + k * 0.24).toFixed(2)}) 36%,
        rgba(255, 255, 255, 0.04) 72%,
        rgba(255, 255, 255, 0) 82%
      )
    `),
        (p =
          d * 0.18 +
          Math.sin(E * 3.8 + 0.6) * 1.2 +
          Math.sin(E * 7.1 + 2.1) * 0.55),
        (C = 0.45 + k * 1.35),
        (v = 0.34 + k * 0.5));
    } else if (u.corticalCataractCase)
      ((p = d * 0.2),
        (C = u.bigCorticalCataractCase ? 0.65 : 0.4),
        (v =
          Math.abs(d) < 1
            ? u.bigCorticalCataractCase
              ? 0.82
              : 0.88
            : u.bigCorticalCataractCase
              ? 0.7
              : 0.78));
    else if (u.centralSubCorticalCataractCase)
      ((S = `
      radial-gradient(
        ellipse 74% 68% at 50% 50%,
        rgba(255, 255, 255, 0.52) 0%,
        rgba(255, 255, 255, 0.18) 28%,
        rgba(255, 255, 255, 0.04) 58%,
        rgba(255, 255, 255, 0) 80%
      )
    `),
        (p = d * 0.2),
        (C = 0.88 + a * 0.005),
        (v = Math.abs(d) < 1 ? 0.64 : 0.5));
    else if (u.posteriorPoleCataractCase)
      ((S = `
      radial-gradient(
        ellipse 74% 68% at 50% 50%,
        rgba(255, 255, 255, 0.58) 0%,
        rgba(255, 255, 255, 0.16) 26%,
        rgba(255, 255, 255, 0.04) 54%,
        rgba(255, 255, 255, 0) 76%
      )
    `),
        (p = d * 0.18),
        (C = 1),
        (v = Math.abs(d) < 1 ? 0.54 : 0.44));
    else if (u.posteriorCapsularThickeningCase)
      ((S = `
      radial-gradient(
        ellipse 104% 86% at 50% 50%,
        rgba(255, 255, 255, 0.56) 0%,
        rgba(255, 255, 255, 0.24) 34%,
        rgba(255, 255, 255, 0.08) 62%,
        rgba(255, 255, 255, 0) 78%
      ),
      linear-gradient(
        23deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 36%,
        rgba(255, 255, 255, 0.34) 40%,
        rgba(255, 255, 255, 0.5) 42%,
        rgba(255, 255, 255, 0.14) 47%,
        rgba(255, 255, 255, 0) 54%
      ),
      linear-gradient(
        -18deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 42%,
        rgba(255, 255, 255, 0.3) 46%,
        rgba(255, 255, 255, 0.46) 48%,
        rgba(255, 255, 255, 0.13) 53%,
        rgba(255, 255, 255, 0) 60%
      ),
      radial-gradient(
        ellipse 18% 14% at 34% 35%,
        rgba(255, 255, 255, 0.52) 0%,
        rgba(255, 255, 255, 0.22) 42%,
        rgba(255, 255, 255, 0) 68%
      ),
      radial-gradient(
        ellipse 16% 13% at 64% 60%,
        rgba(255, 255, 255, 0.48) 0%,
        rgba(255, 255, 255, 0.2) 40%,
        rgba(255, 255, 255, 0) 68%
      )
    `),
        (p = d * 0.08),
        (C = 0.24),
        (v = Math.abs(d) < 1 ? 0.82 : 0.7));
    else if (u.denseCataractCase)
      ((S = `
      radial-gradient(
        ellipse 96% 88% at 50% 50%,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.84) 46%,
        rgba(0, 0, 0, 0.48) 74%,
        rgba(0, 0, 0, 0) 92%
      ),
      radial-gradient(
        ellipse 38% 32% at 34% 38%,
        rgba(0, 0, 0, 0.98) 0%,
        rgba(0, 0, 0, 0.98) 28%,
        rgba(0, 0, 0, 0.88) 38%,
        rgba(0, 0, 0, 0.28) 56%,
        rgba(0, 0, 0, 0) 66%
      ),
      radial-gradient(
        ellipse 34% 28% at 64% 32%,
        rgba(0, 0, 0, 0.98) 0%,
        rgba(0, 0, 0, 0.98) 24%,
        rgba(0, 0, 0, 0.82) 34%,
        rgba(0, 0, 0, 0.24) 52%,
        rgba(0, 0, 0, 0) 64%
      ),
      radial-gradient(
        ellipse 40% 34% at 60% 66%,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.96) 26%,
        rgba(0, 0, 0, 0.78) 38%,
        rgba(0, 0, 0, 0.18) 56%,
        rgba(0, 0, 0, 0) 68%
      ),
      radial-gradient(
        ellipse 28% 22% at 44% 58%,
        rgba(0, 0, 0, 0.92) 0%,
        rgba(0, 0, 0, 0.92) 28%,
        rgba(0, 0, 0, 0.68) 40%,
        rgba(0, 0, 0, 0.14) 56%,
        rgba(0, 0, 0, 0) 66%
      ),
      radial-gradient(
        ellipse 24% 18% at 72% 54%,
        rgba(0, 0, 0, 0.88) 0%,
        rgba(0, 0, 0, 0.88) 24%,
        rgba(0, 0, 0, 0.56) 36%,
        rgba(0, 0, 0, 0.12) 50%,
        rgba(0, 0, 0, 0) 60%
      ),
      radial-gradient(
        ellipse 72% 68% at 50% 50%,
        rgba(255, 255, 255, 0.03) 0%,
        rgba(255, 255, 255, 0.01) 34%,
        rgba(255, 255, 255, 0.003) 56%,
        rgba(0, 0, 0, 0) 72%
      )
    `),
        (p = d * 0.08),
        (h = " scale(1.02, 1.02)"),
        (C = 1.16),
        (v = 0.82));
    else if (u.leucocoriaCase)
      ((S = `
      radial-gradient(
        ellipse 58% 52% at 51% 50%,
        rgba(255, 251, 238, 0.98) 0%,
        rgba(255, 246, 224, 0.9) 30%,
        rgba(255, 236, 206, 0.54) 58%,
        rgba(255, 232, 202, 0.18) 82%,
        rgba(255, 245, 228, 0) 92%
      ),
      radial-gradient(
        ellipse 88% 78% at 50% 50%,
        rgba(248, 240, 220, 0.8) 0%,
        rgba(240, 228, 202, 0.42) 42%,
        rgba(224, 208, 182, 0.14) 72%,
        rgba(255, 245, 228, 0) 90%
      )
    `),
        (p = d * 0.03),
        (h = " scale(1.1, 1.08)"),
        (C = 0.12),
        (v = Math.abs(d) < 1 ? 0.9 : 0.74));
    else if (c === L.HIGH_PLUS || c === L.HIGH_MINUS) {
      let I = c === L.HIGH_PLUS ? 28 : 72;
      S = `
      radial-gradient(
        ellipse 46% 30% at ${(50 + Math.max(-8, Math.min(8, d * 0.06))).toFixed(1)}% ${I}%,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0.64) 24%,
        rgba(255, 255, 255, 0.18) 52%,
        rgba(255, 255, 255, 0) 74%
      ),
      radial-gradient(
        ellipse 74% 64% at 50% 50%,
        rgba(255, 255, 255, 0.92) 0%,
        rgba(255, 255, 255, 0.28) 42%,
        rgba(255, 255, 255, 0.06) 70%,
        rgba(255, 255, 255, 0) 84%
      )
    `;
      let b = d * Vt(e),
        k = Ht(e);
      ((p = k === !0 ? b : k === !1 ? -b : 0),
        (C = 0.12),
        (v = Math.abs(d) < 1 ? 1 : 0.76));
    } else if (u.cylinderCase) {
      let I = c === L.HIGH_CYLINDER,
        A = Math.pow(Math.abs(x), 0.9) * (I ? 0.75 : 0.58);
      p = d * x * A;
      let b = Math.abs(Math.cos(t)),
        k = I ? 0.34 : 0.52,
        H = I ? 1.45 : 1.24,
        R = k + (1 - b) * (H - k),
        q = I ? 1.08 + (1 - b) * 0.24 : 1.04 + (1 - b) * 0.14;
      ((h = ` scale(${R.toFixed(3)}, ${q.toFixed(3)})`),
        (C = (1 - b) * (I ? 1.6 : 1.05)),
        (v = Math.abs(d) < 1 ? 1 : (I ? 0.28 : 0.38) + b * (I ? 0.62 : 0.46)));
    } else {
      let I = d * Vt(e),
        A = Ht(e);
      p = A === !0 ? I : A === !1 ? -I : 0;
    }
    return {
      background: S,
      blurPx: C,
      extraTransform: h,
      opacity: v,
      shift: p,
    };
  }
  function $e(e) {
    e &&
      ((e.style.opacity = "0"),
      (e.style.background = "none"),
      (e.style.transform = "none"),
      (e.style.filter = "none"));
  }
  function $t({
    eye: e,
    reflexSelector: t,
    shouldShow: a,
    reflexBackground: i,
    reflexTransform: c,
    reflexOpacity: u,
    reflexFilter: x,
  }) {
    let d = e == null ? void 0 : e.querySelector(t);
    if (d) {
      if (!a) {
        $e(d);
        return;
      }
      ((d.style.background = i),
        (d.style.transform = c),
        (d.style.opacity = u),
        (d.style.filter = x));
    }
  }
  function Ut({ eye: e, eyeType: t, flags: a, isActiveEye: i }) {
    if (!e) return;
    e.classList.toggle("is-corneal-scar", a.cornealScarCase && i);
    let c = e.querySelector(".pupil"),
      u = e.querySelector(".coloboma-extension"),
      x = e.querySelector(".coloboma-extension-reflex"),
      d = e.querySelector(".iris-transillumination-patch"),
      E = e.querySelector(".iris-transillumination-reflex"),
      S = Math.max(
        10,
        parseFloat((c == null ? void 0 : c.dataset.baseSizePx) || "") ||
          (c == null ? void 0 : c.clientWidth) ||
          32,
      ),
      p = a.acgCase && i,
      v = a.aniridiaCase,
      h = a.irisTransilluminationCase && i,
      C = a.nasalColobomaCase && i,
      I = a.smallPupilsCase;
    if (c) {
      let A = S,
        b = S;
      if (v) {
        let k = Math.min(74, Math.max(66, S * 2.25));
        ((A = k), (b = k));
      } else if (I) {
        let k = Math.max(18, Math.min(22, S * 0.62));
        ((A = k), (b = k));
      } else
        p &&
          ((A = Math.min(38, Math.max(34, S * 1.08))),
          (b = Math.min(46, Math.max(40, S * 1.34))));
      ((c.style.width = `${A}px`),
        (c.style.height = `${b}px`),
        (c.style.left = `calc(50% - ${A / 2}px)`),
        (c.style.top = `calc(50% - ${b / 2}px)`));
    }
    (u &&
      (u.classList.toggle("is-visible", C),
      u.classList.toggle("is-screen-left", C && t === "left"),
      u.classList.toggle("is-screen-right", C && t === "right")),
      C || $e(x),
      d &&
        (d.classList.toggle("is-visible", h),
        d.classList.toggle("is-screen-left", h && t === "left"),
        d.classList.toggle("is-screen-right", h && t === "right")),
      h || $e(E));
  }
  function Gt({
    eye: e,
    flags: t,
    reflexBackground: a,
    reflexTransform: i,
    reflexOpacity: c,
    reflexFilter: u,
  }) {
    ($t({
      eye: e,
      reflexSelector: ".coloboma-extension-reflex",
      shouldShow: t.nasalColobomaCase,
      reflexBackground: a,
      reflexTransform: i,
      reflexOpacity: c,
      reflexFilter: u,
    }),
      $t({
        eye: e,
        reflexSelector: ".iris-transillumination-reflex",
        shouldShow: t.irisTransilluminationCase,
        reflexBackground: a,
        reflexTransform: i,
        reflexOpacity: c,
        reflexFilter: u,
      }));
  }
  function Wt({
    eye: e,
    flags: t,
    isActiveEye: a,
    pupilRadiusPx: i,
    sweepX: c,
    sweepY: u,
    maxConstriction: x = 0.075,
    isDilated: d = !1,
    consensualScale: E = 1,
  }) {
    let S = e == null ? void 0 : e.querySelector(".iris");
    if (!S) return;
    if (d || t.aniridiaCase || (t.acgCase && a)) {
      S.style.setProperty("--light-pupil-scale", "1");
      return;
    }
    let p = Ue({ pupilRadiusPx: i, sweepX: c, sweepY: u, maxConstriction: x });
    S.style.setProperty("--light-pupil-scale", Math.min(p, E).toFixed(3));
  }
  function Ue({
    pupilRadiusPx: e,
    sweepX: t,
    sweepY: a,
    maxConstriction: i = 0.075,
  }) {
    let c = Math.hypot(t, a),
      u = Math.max(1, e * 1.18),
      x = Math.max(0, Math.min(1, c / u));
    return 1 - (1 - x * x * (3 - 2 * x)) * i;
  }
  function Xt({ state: e, dom: t }) {
    let c =
        "radial-gradient(ellipse at 50% 50%, rgba(94, 94, 94, 0.32) 14%, rgba(58, 58, 58, 0.08) 58%, rgba(40, 40, 40, 0.01) 76%, rgba(32, 32, 32, 0) 88%)",
      v = "",
      h = !1;
    function C(s) {
      t.movementStatusLabel &&
        t.movementStatusLabel.classList.toggle(
          "is-visible",
          !e.isTestMode && s,
        );
    }
    function I(s) {
      if (!t.movementStatusLabel || s === v) return;
      let y = s.match(/^<em>([^<]*)<\/em>\s*(.*)$/);
      if (!y) {
        ((t.movementStatusLabel.textContent = s), (v = s));
        return;
      }
      let M = document.createElement("em");
      ((M.textContent = y[1]),
        t.movementStatusLabel.replaceChildren(
          M,
          document.createTextNode(` ${y[2]}`),
        ),
        (v = s));
    }
    function A(s) {
      t.eyes.forEach((y) => {
        let M = y.dataset.eye === s;
        (y.classList.toggle("is-ret-active", M),
          y.classList.toggle("is-ret-fellow", !M));
      });
    }
    function b(s, y, M) {
      return Math.max(y, Math.min(M, s));
    }
    function k({
      beamCentre: s,
      eyeType: y,
      pupilRadiusPx: M,
      sweepX: P,
      sweepY: r,
      wrapperRect: o,
    }) {
      let n = Math.hypot(P, r),
        g = y === "left" ? t.rightEye : t.leftEye,
        l = z(g == null ? void 0 : g.querySelector(".pupil"), o),
        w = s && l ? Math.hypot(s.x - l.x, s.y - l.y) : n,
        m = Math.max(0, n - w),
        f = Math.max(72, M * 4.8),
        O = Math.max(0, Math.min(1, m / f)),
        D = O * O * (3 - 2 * O);
      return { currentDistancePx: n, fellowDistancePx: w, smoothT: D };
    }
    function H({
      beamCentre: s,
      eye: y,
      eyeType: M,
      lightOffsetX: P = 0,
      lightOffsetY: r = 0,
      pupilRadiusPx: o,
      sweepX: n,
      sweepY: g,
      wrapperRect: l,
    }) {
      if (!y) return;
      let { currentDistancePx: w, fellowDistancePx: m } = k({
          beamCentre: s,
          eyeType: M,
          pupilRadiusPx: o,
          sweepX: n,
          sweepY: g,
          wrapperRect: l,
        }),
        f = Math.max(72, o * 4.8),
        O = m - w,
        D = Math.max(0, Math.min(1, Math.abs(O) / f)),
        _ = D * D * (3 - 2 * D),
        W = O > 0 ? 1 + _ * 0.2 : 1 - _ * 0.14;
      (y.style.setProperty("--corneal-reflex-scale", W.toFixed(3)),
        y.style.setProperty(
          "--corneal-reflex-light-x",
          `${b(P * 0.02, -0.8, 0.8).toFixed(2)}px`,
        ),
        y.style.setProperty(
          "--corneal-reflex-light-y",
          `${b(r * 0.02, -0.6, 0.6).toFixed(2)}px`,
        ));
    }
    function R() {
      let { retStreak: s, eyesWrapper: y } = t;
      if (!s || !y) return;
      let M = e.activeRetEye === "left" ? t.leftEye : t.rightEye;
      if (!M) return;
      let P = M.querySelector(".pupil");
      if (!P) return;
      let r = y.getBoundingClientRect(),
        o = P.getBoundingClientRect(),
        n = (o.left + o.right) / 2 - r.left,
        g = (o.top + o.bottom) / 2 - r.top;
      ((s.style.left = `${n}px`), (s.style.top = `${g}px`));
    }
    function q() {
      let { retStreak: s } = t;
      s &&
        (s.style.transform = `
    translate(-50%, -50%)
    rotate(${e.retStreakRotation}deg)
    translateX(${e.retStreakOffset}px)
  `);
    }
    function z(s, y) {
      if (!s || !y) return null;
      let M = s.getBoundingClientRect();
      return {
        x: (M.left + M.right) / 2 - y.left,
        y: (M.top + M.bottom) / 2 - y.top,
      };
    }
    function $(s) {
      if (!t.retStreak || !s) return null;
      let y = t.retStreak.getBoundingClientRect();
      return {
        x: (y.left + y.right) / 2 - s.left,
        y: (y.top + y.bottom) / 2 - s.top,
      };
    }
    function G(s, y, M) {
      if (!s) return;
      if (!(M.corticalCataractCase && y)) {
        ((s.style.opacity = "0"),
          (s.style.background = "none"),
          (s.style.maskImage = "none"),
          (s.style.webkitMaskImage = "none"));
        return;
      }
      let r = M.bigCorticalCataractCase,
        o = e.corticalCataractPattern || ze(r);
      ((e.corticalCataractPattern = o), (s.style.background = Bt(o)));
      let n = r
        ? `radial-gradient(
          circle at 50% 50%,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0) 18%,
          rgba(0, 0, 0, 0.36) 42%,
          rgba(0, 0, 0, 0.92) 74%,
          rgba(0, 0, 0, 1) 100%
        )`
        : `radial-gradient(
          circle at 50% 50%,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0) 18%,
          rgba(0, 0, 0, 0.34) 46%,
          rgba(0, 0, 0, 0.9) 76%,
          rgba(0, 0, 0, 1) 100%
        )`;
      ((s.style.maskImage = n),
        (s.style.webkitMaskImage = n),
        (s.style.filter = r ? "blur(0.36px)" : "blur(0.24px)"),
        (s.style.opacity = r ? "0.94" : "0.9"));
    }
    function j(s) {
      s &&
        ((s.style.opacity = "0"),
        (s.style.background = "none"),
        (s.style.transform = "none"),
        (s.style.filter = "none"));
    }
    function X({ flags: s, pupilRadiusPx: y, sweepX: M, sweepY: P }) {
      if (s.partialRetinalDetachmentCase) return 1;
      if (s.leucocoriaCase) {
        let O = Math.hypot(M, P),
          D = y * 0.55,
          _ = y * 2.8,
          W = Math.max(1, _ - D),
          Y = Math.max(0, Math.min(1, (O - D) / W)),
          N = Y * Y * (3 - 2 * Y);
        return 0.8 + (1 - Math.pow(N, 1.45)) * 0.16;
      }
      if (!s.floatersCase && !s.vitreousHaemorrhageCase) return 0;
      let r = Math.hypot(M, P),
        o = y * (s.vitreousHaemorrhageCase ? 0.74 : 0.84),
        n = y * (s.vitreousHaemorrhageCase ? 6.1 : 6.4),
        g = Math.max(1, n - o),
        l = Math.max(0, Math.min(1, (r - o) / g)),
        w = l * l * (3 - 2 * l),
        m = Math.pow(w, s.vitreousHaemorrhageCase ? 1.35 : 1.55),
        f = s.vitreousHaemorrhageCase ? 0.26 : 0.18;
      return f + (1 - m) * (1 - f);
    }
    function te({
      flags: s,
      isActiveEye: y,
      overlayElement: M,
      pupilRadiusPx: P,
      sweepX: r,
      sweepY: o,
      timeSec: n,
    }) {
      if (!M || !y) {
        j(M);
        return;
      }
      let g = He({ flags: s, timeSec: n });
      if (g.opacity <= 0 || g.background === "none") {
        j(M);
        return;
      }
      let l = X({ flags: s, pupilRadiusPx: P, sweepX: r, sweepY: o });
      if (l <= 0.01) {
        j(M);
        return;
      }
      ((M.style.background = g.background),
        (M.style.transform = g.transform || "none"),
        (M.style.filter =
          g.blurPx > 0.01 ? `blur(${g.blurPx.toFixed(2)}px)` : "none"),
        (M.style.opacity = Math.min(1, g.opacity * l).toFixed(3)));
    }
    function Z({
      cataractVisual: s,
      pupilRadiusPx: y,
      reflex: M,
      reflexCompX: P,
      reflexCompY: r,
      sweepX: o,
      sweepY: n,
    }) {
      let g = Math.hypot(o, n),
        l = y * 0.02,
        w = y * 0.62,
        m = Math.max(1, w - l),
        f = Math.max(0, Math.min(1, (g - l) / m)),
        D = 1 - f * f * (3 - 2 * f),
        _ = Math.pow(D, 2.6),
        W = Math.pow(D, 2.15);
      ((M.style.background = c),
        (M.style.transform = `translate(${-P}px, ${-r}px) rotate(${e.retStreakRotation}deg)`),
        (M.style.opacity = Math.min(
          1,
          0.085 * _ * s.opacityScale * 1.1 * 0.12,
        )));
      let Y = W * s.brightnessScale * 1.12 * 0.22,
        N = [`blur(${(0.5).toFixed(2)}px)`];
      (Math.abs(Y - 1) > 0.01 && N.push(`brightness(${Y.toFixed(2)})`),
        (M.style.filter = N.join(" ")));
    }
    function U({
      angleRad: s,
      axisDeltaRad: y,
      beamOffsetX: M,
      beamOffsetY: P,
      cataractVisual: r,
      cylinderAxisDeg: o,
      eye: n,
      flags: g,
      movementSign: l,
      pupilRadiusPx: w,
      reflex: m,
      reflexCompX: f,
      reflexCompY: O,
      timeSec: D,
    }) {
      let _ = Ve({
        activeRefraction: qe(e.currentRefraction, e.activeRetEye),
        axisDeltaRad: y,
        cataractLevel: e.cataractLevel,
        cylinderAxisDeg: o,
        currentRefraction: e.currentRefraction,
        flags: g,
        movementSign: l,
        retStreakOffset: e.retStreakOffset,
        timeSec: D,
      });
      m.style.background = _.background;
      let W = _.shift * Math.cos(s) - f,
        Y = _.shift * Math.sin(s) - O,
        N = Number.isFinite(M) ? M : e.retStreakOffset * Math.cos(s) - f,
        ie = Number.isFinite(P) ? P : e.retStreakOffset * Math.sin(s) - O,
        {
          edgeBlurBoostPx: ne,
          edgeBrightnessScale: re,
          edgeOpacityScale: F,
        } = qt({ probeOffsetX: N, probeOffsetY: ie, pupilRadiusPx: w }),
        ue = `translate(${W}px, ${Y}px) rotate(${e.retStreakRotation}deg)`;
      ((e.currentRefraction === L.HIGH_MINUS ||
        e.currentRefraction === L.HIGH_PLUS) &&
        (ue += " scale(0.6)"),
        (ue += _.extraTransform),
        (m.style.transform = ue));
      let ce = _.opacity * F * r.opacityScale * 1.1;
      m.style.opacity = Math.max(0.015, Math.min(ce, 1));
      let V = _.blurPx + r.blurBoostPx + ne,
        se = [];
      V > 0.01 && se.push(`blur(${V.toFixed(2)}px)`);
      let de = r.brightnessScale * re * 1.12;
      (Math.abs(de - 1) > 0.01 && se.push(`brightness(${de.toFixed(2)})`),
        (m.style.filter = se.length ? se.join(" ") : "none"),
        Gt({
          eye: n,
          flags: g,
          reflexBackground: m.style.background,
          reflexTransform: m.style.transform,
          reflexOpacity: m.style.opacity,
          reflexFilter: m.style.filter,
        }));
    }
    function Q() {
      var ne;
      let s = qe(e.currentRefraction, e.activeRetEye),
        y = Fe(e.currentRefraction),
        M = typeof e.cylinderAxisDeg == "number" ? e.cylinderAxisDeg : 0,
        P = Pt(e.retStreakRotation),
        o = (Dt(P, M) * Math.PI) / 180,
        n = Math.cos(o * 2),
        g = Ft(e.cataractLevel),
        l = h && Math.abs(e.retStreakOffset) >= 1,
        w = e.retStreakRotation * (Math.PI / 180),
        m = performance.now() / 1e3,
        f =
          ((ne = t.eyesWrapper) == null
            ? void 0
            : ne.getBoundingClientRect()) || null,
        O = e.activeRetEye === "left" ? t.leftEye : t.rightEye,
        D = (O == null ? void 0 : O.querySelector(".pupil")) || null,
        _ = z(D, f),
        W = $(f),
        Y = _
          ? {
              x: _.x + e.retStreakOffset * Math.cos(w),
              y: _.y + e.retStreakOffset * Math.sin(w),
            }
          : null,
        N = W || Y;
      (C(l),
        I(
          zt({
            activeEye: e.activeRetEye,
            activeRefraction: s,
            currentRefraction: e.currentRefraction,
            flags: y,
            movementSign: n,
          }),
        ));
      let ie = Ue({
        pupilRadiusPx: Math.max(
          8,
          ((D == null ? void 0 : D.clientWidth) || 32) * 0.5,
        ),
        sweepX: N && _ ? N.x - _.x : e.retStreakOffset,
        sweepY: N && _ ? N.y - _.y : 0,
      });
      t.retReflexElements.forEach((re) => {
        var Ye, je, Qe, Ke, Je, Ze, et, tt;
        let F = re.closest(".eye"),
          ue = F == null ? void 0 : F.dataset.eye,
          ce = ue === e.activeRetEye;
        Ut({ eye: F, eyeType: ue, flags: y, isActiveEye: ce });
        let V = F == null ? void 0 : F.querySelector(".iris"),
          se = F == null ? void 0 : F.querySelector(".pupil"),
          de = F == null ? void 0 : F.querySelector(".cortical-cataract-mask"),
          ra =
            F == null ? void 0 : F.querySelector(".central-subcortical-mask"),
          ia = F == null ? void 0 : F.querySelector(".pathology-overlay"),
          xe = Math.max(
            8,
            ((se == null ? void 0 : se.clientWidth) || 32) * 0.5,
          ),
          Ee = z(se, f),
          na =
            (((Ye = V == null ? void 0 : V.nystagmusOffset) == null
              ? void 0
              : Ye.x) || 0) +
            (((je = V == null ? void 0 : V.microOffset) == null
              ? void 0
              : je.x) || 0) +
            (((Qe = V == null ? void 0 : V.backgroundOffset) == null
              ? void 0
              : Qe.x) || 0) +
            (((Ke = V == null ? void 0 : V.gazeOffset) == null
              ? void 0
              : Ke.x) || 0),
          oa =
            (((Je = V == null ? void 0 : V.nystagmusOffset) == null
              ? void 0
              : Je.y) || 0) +
            (((Ze = V == null ? void 0 : V.microOffset) == null
              ? void 0
              : Ze.y) || 0) +
            (((et = V == null ? void 0 : V.backgroundOffset) == null
              ? void 0
              : et.y) || 0) +
            (((tt = V == null ? void 0 : V.gazeOffset) == null
              ? void 0
              : tt.y) || 0),
          Xe = e.nystagmusLevel > 0 || e.isGazeMode,
          Le = Xe ? na : 0,
          Ie = Xe ? oa : 0,
          me = N && Ee ? N.x - Ee.x : e.retStreakOffset * Math.cos(w) - Le,
          fe = N && Ee ? N.y - Ee.y : e.retStreakOffset * Math.sin(w) - Ie;
        if (
          (Wt({
            isDilated: e.isDilatedMode,
            consensualScale: ie,
            eye: F,
            flags: y,
            isActiveEye: ce,
            pupilRadiusPx: xe,
            sweepX: me,
            sweepY: fe,
          }),
          H({
            beamCentre: N,
            eye: F,
            eyeType: ue,
            lightOffsetX: me,
            lightOffsetY: fe,
            pupilRadiusPx: xe,
            sweepX: me,
            sweepY: fe,
            wrapperRect: f,
          }),
          Rt({ maskElement: ra, flags: y, isActiveEye: ce }),
          G(de, ce, y),
          te({
            flags: y,
            isActiveEye: ce,
            overlayElement: ia,
            pupilRadiusPx: xe,
            sweepX: me,
            sweepY: fe,
            timeSec: m,
          }),
          !ce)
        ) {
          Z({
            cataractVisual: g,
            pupilRadiusPx: xe,
            reflex: re,
            reflexCompX: Le,
            reflexCompY: Ie,
            sweepX: me,
            sweepY: fe,
          });
          return;
        }
        U({
          angleRad: w,
          axisDeltaRad: o,
          beamOffsetX: me,
          beamOffsetY: fe,
          cataractVisual: g,
          cylinderAxisDeg: M,
          eye: F,
          flags: y,
          movementSign: n,
          pupilRadiusPx: xe,
          reflex: re,
          reflexCompX: Le,
          reflexCompY: Ie,
          timeSec: m,
        });
      });
    }
    function ee({ includePosition: s = !0 } = {}) {
      (s && R(), q(), Q());
    }
    function ae(s = !0) {
      (e.retinoscopyRafId &&
        (cancelAnimationFrame(e.retinoscopyRafId), (e.retinoscopyRafId = 0)),
        (e.retinoscopyNeedsPosition = !1),
        ee({ includePosition: s }));
    }
    function K(s = !1) {
      ((e.retinoscopyNeedsPosition = e.retinoscopyNeedsPosition || s),
        !e.retinoscopyRafId &&
          (e.retinoscopyRafId = requestAnimationFrame(() => {
            (ee({ includePosition: e.retinoscopyNeedsPosition }),
              (e.retinoscopyNeedsPosition = !1),
              (e.retinoscopyRafId = 0));
          })));
    }
    function le(s) {
      (s !== "left" && s !== "right") ||
        ((e.activeRetEye = s),
        A(s),
        t.retEyeButtons.forEach((y) => {
          (y.classList.toggle("is-active", y.dataset.retEye === s),
            y.setAttribute("aria-pressed", String(y.dataset.retEye === s)));
        }),
        K(!0));
    }
    function oe(s) {
      ((e.retStreakOffset = s), (h = !0), K(!1));
    }
    function ge(s) {
      ((e.retStreakRotation = s), K(!1));
    }
    function T(s) {
      if (!ut.has(s)) return;
      ((e.currentRefraction = s),
        Fe(s).corticalCataractCase
          ? (e.corticalCataractPattern = ze(s === L.BIG_CORTICAL_CATARACT))
          : (e.corticalCataractPattern = null),
        _t(s)
          ? ((e.cylinderAxisDeg = Nt()),
            (e.retStreakRotation =
              e.cylinderAxisDeg > 90
                ? e.cylinderAxisDeg - 180
                : e.cylinderAxisDeg))
          : ((e.cylinderAxisDeg = null), (e.retStreakRotation = 0)),
        (e.retStreakOffset = 0),
        t.retinoscopySlider && (t.retinoscopySlider.value = "0"),
        t.retinoscopyRotationSlider &&
          (t.retinoscopyRotationSlider.value = String(e.retStreakRotation)),
        (h = !1),
        C(!1),
        K(!0));
    }
    function B(s) {
      let y = Number.isFinite(s) ? s : parseInt(s, 10);
      Number.isNaN(y) ||
        ((e.cataractLevel = Math.max(0, Math.min(100, y))), K(!1));
    }
    return {
      renderNow: ae,
      scheduleRetinoscopy: K,
      setActiveRetEye: le,
      setRetStreakOffset: oe,
      setRetStreakRotation: ge,
      setRefraction: T,
      setCataractLevel: B,
    };
  }
  function Yt() {
    return {
      baseReflexColor: { ...lt },
      ...ct,
      retinoscopyRafId: 0,
      retinoscopyNeedsPosition: !0,
      activeMcqLevel: "primary",
      activeMcqQuestions: [],
      corticalCataractPattern: null,
      microSaccadeIntervalId: 0,
      backgroundJitterIntervalId: 0,
      blinkIntervalId: 0,
      gazeIntervalId: 0,
      gazeReturnTimeoutId: 0,
      gazeShiftTimerId: 0,
      lastBlinkAtMs: 0,
      nystagmusRafId: 0,
      isManualEyeMoveEnabled: !1,
      isGazeMode: !1,
      isDilatedMode: !1,
      isBabyMode: !1,
      dilatedPreviousPupilValues: null,
      isTestMode: !1,
      isTestRevealed: !1,
      testCountdown: 0,
      testTimerId: 0,
      testConditionValue: null,
      testRevealLabel: "",
      testPreviousState: null,
      testLastRefraction: null,
      testRoundIndex: 0,
    };
  }
  function Ge(e, t, a) {
    return Math.max(t, Math.min(a, e));
  }
  function jt({ state: e, dom: t, retinoscopyController: a }) {
    let { retStreak: i, retStreakRotateHandle: c, retStreakSweepHandle: u } = t,
      x = 50,
      d = 90,
      E = 2,
      S = 1.15,
      p = 0;
    function v() {
      i &&
        (p && (window.clearTimeout(p), (p = 0)),
        i.classList.remove("is-hint-visible"));
    }
    function h() {
      i &&
        (i.classList.add("is-hint-visible"),
        (p = window.setTimeout(() => {
          (i.classList.remove("is-hint-visible"), (p = 0));
        }, 3e3)));
    }
    function C(
      b,
      { getValue: k, max: H, min: R, pixelsPerUnit: q, setValue: z },
    ) {
      if (!b) return;
      let $ = null,
        G = 0,
        j = 0,
        X = 0,
        te = 0;
      function Z(U) {
        var Q;
        $ !== null &&
          ((U && U.pointerId !== $) ||
            (($ = null),
            (
              ((Q = b.closest) == null ? void 0 : Q.call(b, ".ret-streak")) || b
            ).classList.remove("is-dragging")));
      }
      (b.addEventListener("pointerdown", (U) => {
        var Q, ee;
        (U.button !== void 0 && U.button !== 0) ||
          (v(),
          U.stopPropagation(),
          ($ = U.pointerId),
          (G = U.clientX),
          (j = U.clientY),
          (X = (e.retStreakRotation * Math.PI) / 180),
          (te = k()),
          (
            ((Q = b.closest) == null ? void 0 : Q.call(b, ".ret-streak")) || b
          ).classList.add("is-dragging"),
          (ee = b.setPointerCapture) == null || ee.call(b, U.pointerId),
          U.preventDefault());
      }),
        b.addEventListener("pointermove", (U) => {
          if (U.pointerId !== $) return;
          let Q = U.clientX - G,
            ee = U.clientY - j,
            ae = Q * Math.cos(X) + ee * Math.sin(X),
            K = Ge(te + ae / q, R, H);
          z(Math.round(K));
        }),
        b.addEventListener("pointerup", Z),
        b.addEventListener("pointercancel", Z),
        b.addEventListener("lostpointercapture", Z));
    }
    function I(b, { step: k, setNextValue: H }) {
      b &&
        b.addEventListener("keydown", (R) => {
          (R.key !== "ArrowLeft" &&
            R.key !== "ArrowRight" &&
            R.key !== "Home" &&
            R.key !== "End") ||
            (v(), R.preventDefault(), H(R.key, k));
        });
    }
    function A() {
      !i ||
        !c ||
        !u ||
        (C(u, {
          getValue: () => e.retStreakOffset,
          max: x,
          min: -x,
          pixelsPerUnit: E,
          setValue: (b) => a.setRetStreakOffset(b),
        }),
        C(i, {
          getValue: () => e.retStreakOffset,
          max: x,
          min: -x,
          pixelsPerUnit: E,
          setValue: (b) => a.setRetStreakOffset(b),
        }),
        C(c, {
          getValue: () => e.retStreakRotation,
          max: d,
          min: -d,
          pixelsPerUnit: S,
          setValue: (b) => a.setRetStreakRotation(b),
        }),
        I(u, {
          step: 5,
          setNextValue: (b, k) => {
            if (b === "Home") {
              a.setRetStreakOffset(0);
              return;
            }
            if (b === "End") {
              a.setRetStreakOffset(x);
              return;
            }
            let H = b === "ArrowLeft" ? -k : k;
            a.setRetStreakOffset(Ge(e.retStreakOffset + H, -x, x));
          },
        }),
        I(c, {
          step: 6,
          setNextValue: (b, k) => {
            if (b === "Home") {
              a.setRetStreakRotation(0);
              return;
            }
            if (b === "End") {
              a.setRetStreakRotation(d);
              return;
            }
            let H = b === "ArrowLeft" ? -k : k;
            a.setRetStreakRotation(Ge(e.retStreakRotation + H, -d, d));
          },
        }),
        h());
    }
    return { hideHint: v, init: A };
  }
  var We = {
      primary: {
        label: "Primary cases",
        shortLabel: "Primary",
        marker: "P",
        order: 1,
      },
      intermediate: {
        label: "Intermediate cases",
        shortLabel: "Intermediate",
        marker: "I",
        order: 2,
      },
      advanced: {
        label: "Advanced cases",
        shortLabel: "Advanced",
        marker: "A",
        order: 3,
      },
    },
    Oa = {
      "high-minus": "primary",
      minus: "primary",
      zero: "primary",
      plus: "primary",
      "high-plus": "primary",
      "low-cylinder": "intermediate",
      "high-cylinder": "intermediate",
      anisometropia: "intermediate",
      "small-pupils": "intermediate",
      "small-scissors": "intermediate",
      "poor-tear-film": "intermediate",
      "small-cortical-cataract": "intermediate",
      "big-cortical-cataract": "intermediate",
      "dense-cataract": "intermediate",
      floaters: "intermediate",
      "central-sub-cortical-cataract": "advanced",
      keratoconus: "advanced",
      "corneal-scar": "advanced",
      acg: "advanced",
      aniridia: "advanced",
      aphakia: "advanced",
      "iris-transillumination": "advanced",
      "nasal-coloboma": "advanced",
      "posterior-pole-cataract": "advanced",
      "vitreous-haemorrhage": "advanced",
      leucocoria: "advanced",
      "partial-retinal-detachment": "advanced",
      "posterior-capsular-thickening": "advanced",
    },
    _a = Object.freeze({
      acg: Object.freeze({
        title: "Acute angle-closure warning",
        body: "The exaggerated oval is a stylised teaching cue, not a diagnostic pupil shape. A painful red eye with a fixed or poorly reactive mid-dilated pupil is an ocular emergency. This simulation does not diagnose angle closure; arrange urgent ophthalmic assessment.",
      }),
      leucocoria: Object.freeze({
        title: "Abnormal white reflex",
        body: "A white or absent red reflex, particularly in a child, requires urgent ophthalmic assessment. Causes include cataract, retinal disease and intraocular tumour.",
      }),
      "vitreous-haemorrhage": Object.freeze({
        title: "Vitreous haemorrhage warning",
        body: "A suddenly darkened reflex with new floaters or loss of vision may reflect vitreous haemorrhage and underlying retinal pathology. Arrange urgent ophthalmic assessment.",
      }),
      "partial-retinal-detachment": Object.freeze({
        title: "Retinal detachment warning",
        body: "A fixed dark sector with symptoms suggesting retinal detachment requires urgent ophthalmic assessment. The simulator appearance is illustrative only.",
      }),
    }),
    Pa = {
      "high-minus": "Slow against movement with a narrow reflex.",
      minus: "Against movement before neutralisation.",
      zero: "No directional movement at neutrality.",
      plus: "With movement before neutralisation.",
      "high-plus": "Slow broad with movement requiring more plus.",
      "low-cylinder":
        "Stylised example: opposite movement in the two principal meridians.",
      "high-cylinder":
        "Stylised example: stronger change between the two principal meridians.",
      anisometropia: "Different reflex behaviour between right and left eyes.",
      "small-pupils": "Reduced aperture makes the reflex harder to judge.",
      "small-scissors": "Subtle split reflex with irregular movement.",
      "poor-tear-film": "Unstable shimmering reflex surface.",
      "small-cortical-cataract":
        "Peripheral cortical opacity crossing the reflex.",
      "big-cortical-cataract": "More extensive cortical spokes.",
      "central-sub-cortical-cataract":
        "Central posterior opacity dulling the reflex.",
      keratoconus: "Large scissors reflex with marked irregularity.",
      "corneal-scar": "Diffuse corneal haze disrupting the streak.",
      acg: "Stylised vertical oval pupil with abnormal reflex behaviour.",
      aniridia: "Large abnormal aperture with unstable reflex detail.",
      aphakia: "High plus behaviour with altered pupil optics.",
      "iris-transillumination":
        "Peripheral iris light leak alongside the reflex.",
      "nasal-coloboma": "Notched pupil aperture affecting the reflex edge.",
      "posterior-pole-cataract": "Dense central posterior pole defect.",
      "dense-cataract": "Very dull reflex through dense media opacity.",
      floaters: "Mobile vitreous shadows over the reflex.",
      "vitreous-haemorrhage": "Dark vitreous opacity reducing the view.",
      leucocoria: "White reflex appearance rather than normal red-orange.",
      "partial-retinal-detachment":
        "Fixed dark sector with remaining reflex visible.",
      "posterior-capsular-thickening":
        "IOL/capsule haze reducing reflex clarity.",
    },
    Da = new Set([
      "zero",
      "plus",
      "high-plus",
      "minus",
      "low-cylinder",
      "anisometropia",
      "small-pupils",
      "central-sub-cortical-cataract",
      "dense-cataract",
      "leucocoria",
    ]),
    Ba = [
      "zero",
      "minus",
      "plus",
      "high-minus",
      "high-plus",
      "low-cylinder",
      "high-cylinder",
      "anisometropia",
      "small-pupils",
      "small-scissors",
      "poor-tear-film",
      "small-cortical-cataract",
      "big-cortical-cataract",
      "dense-cataract",
      "floaters",
      "keratoconus",
      "corneal-scar",
      "acg",
      "aniridia",
      "aphakia",
      "iris-transillumination",
      "nasal-coloboma",
      "central-sub-cortical-cataract",
      "posterior-pole-cataract",
      "vitreous-haemorrhage",
      "leucocoria",
      "partial-retinal-detachment",
      "posterior-capsular-thickening",
    ],
    Na = new Map(Ba.map((e, t) => [e, t])),
    Qt = he
      .map((e) => {
        var a;
        let t = Oa[e.value] || "advanced";
        return {
          ...e,
          order: (a = Na.get(e.value)) != null ? a : Number.MAX_SAFE_INTEGER,
          level: t,
          levelLabel: We[t].shortLabel,
          levelMarker: We[t].marker,
          summary: Pa[e.value] || e.label,
          safetyNote: _a[e.value] || null,
          thumbnailSrc: `assets/case-thumbnails/${e.value}.webp?v=20260507-fellow-corneal`,
          isBabyCase: Da.has(e.value),
        };
      })
      .sort((e, t) => e.order - t.order || e.label.localeCompare(t.label))
      .map((e, t) => ({ ...e, index: t + 1 })),
    Fr = Object.entries(We)
      .map(([e, t]) => ({ value: e, ...t }))
      .sort((e, t) => e.order - t.order);
  function Kt({ babyOnly: e = !1 } = {}) {
    return e ? Qt.filter((t) => t.isBabyCase) : Qt;
  }
  function ye(e) {
    e && e.dispatchEvent(new Event("input", { bubbles: !0 }));
  }
  function Fa({ babyOnly: e = !1 } = {}) {
    if (!e) return Oe;
    let t = new Set(Kt({ babyOnly: !0 }).map((a) => a.value));
    return Oe.filter((a) => t.has(a.value));
  }
  function qa(e) {
    let t = Number(e);
    return Number.isFinite(t) ? Math.max(-90, Math.min(90, t)) : 0;
  }
  function za(e, { babyOnly: t = !1 } = {}) {
    let a = Fa({ babyOnly: t }),
      i = a.length > 1 ? a.filter((x) => x.value !== e) : a,
      c = i.length ? i : a;
    if (!c.length) return null;
    let u = Math.floor(Math.random() * c.length);
    return c[u];
  }
  function Ha(e) {
    let t = Math.max(0, Math.min(e, Ce.length - 1));
    return Ce[t];
  }
  function Jt({ state: e, dom: t, retinoscopyController: a, onCaseChange: i }) {
    let {
        sideMenu: c,
        testModeButton: u,
        testStatusBanner: x,
        testCountdownValue: d,
        testAnswerText: E,
        testNextButton: S,
        reflexColorSlider: p,
        gazeToggle: v,
        dilatedToggle: h,
        babyToggle: C,
        manualEyeMoveToggle: I,
        casePicker: A,
        casePreviousButton: b,
        caseNextButton: k,
        caseTriggerButton: H,
        refractionShell: R,
        refractionMaskLabel: q,
        refractionStateSelect: z,
        cataractSlider: $,
        nystagmusSlider: G,
        pupilSizeSliders: j,
        eyelidSliders: X,
        retinoscopySlider: te,
        retinoscopyRotationSlider: Z,
      } = t,
      U = [p, v, h, C, I, b, k, H, z, $, G, ...j, ...X].filter(Boolean);
    function Q() {
      e.testTimerId &&
        (window.clearInterval(e.testTimerId), (e.testTimerId = 0));
    }
    function ee(n) {
      c &&
        (c.classList.toggle("open", n),
        c.setAttribute("aria-hidden", String(!n)),
        n ? c.removeAttribute("inert") : c.setAttribute("inert", ""),
        t.burgerIcon &&
          (t.burgerIcon.setAttribute("aria-expanded", String(n)),
          t.burgerIcon.setAttribute(
            "aria-label",
            n ? "Close menu" : "Open menu",
          )));
    }
    function ae() {
      u && (u.textContent = "Test me");
    }
    function K(n) {
      !R ||
        !q ||
        !z ||
        (R.classList.toggle("is-masked", n),
        (q.textContent = n ? "Condition hidden" : ""),
        A && A.classList.toggle("is-masked", n));
    }
    function le(n) {
      U.forEach((g) => {
        g.disabled = n;
      });
    }
    function oe() {
      if (!(!x || !d || !E) && ((x.hidden = !e.isTestMode), !!e.isTestMode)) {
        if (((d.textContent = String(e.testCountdown)), e.isTestRevealed)) {
          ((E.hidden = !1),
            (E.textContent = e.testRevealLabel),
            S && (S.hidden = !1));
          return;
        }
        ((E.hidden = !0), (E.textContent = ""), S && (S.hidden = !0));
      }
    }
    function ge() {
      var n, g, l, w;
      return {
        activeRetEye: e.activeRetEye,
        modifiers: [v, h, I].map((m) => !!(m != null && m.checked)),
        dilatedPreviousPupilValues:
          ((n = e.dilatedPreviousPupilValues) == null ? void 0 : n.slice()) ||
          null,
        corticalCataractPattern: e.corticalCataractPattern
          ? JSON.parse(JSON.stringify(e.corticalCataractPattern))
          : null,
        currentRefraction: e.currentRefraction,
        cylinderAxisDeg: e.cylinderAxisDeg,
        retStreakOffset: e.retStreakOffset,
        retStreakRotation: e.retStreakRotation,
        reflexColorValue: (g = p == null ? void 0 : p.value) != null ? g : "",
        cataractValue: (l = $ == null ? void 0 : $.value) != null ? l : "",
        nystagmusValue: (w = G == null ? void 0 : G.value) != null ? w : "",
        pupilValues: j.map((m) => m.value),
        eyelidValues: X.map((m) => m.value),
      };
    }
    function T() {
      var g;
      let n = e.testPreviousState;
      n &&
        ([v, h, I].forEach((l, w) => {
          l &&
            ((l.checked = n.modifiers[w]),
            l.dispatchEvent(new Event("change", { bubbles: !0 })));
        }),
        (e.dilatedPreviousPupilValues =
          ((g = n.dilatedPreviousPupilValues) == null ? void 0 : g.slice()) ||
          null),
        p &&
          n.reflexColorValue !== "" &&
          ((p.value = n.reflexColorValue), ye(p)),
        j.forEach((l, w) => {
          n.pupilValues[w] !== void 0 && ((l.value = n.pupilValues[w]), ye(l));
        }),
        X.forEach((l, w) => {
          n.eyelidValues[w] !== void 0 &&
            ((l.value = n.eyelidValues[w]), ye(l));
        }),
        $ && n.cataractValue !== "" && (($.value = n.cataractValue), ye($)),
        G && n.nystagmusValue !== "" && ((G.value = n.nystagmusValue), ye(G)),
        a.setActiveRetEye(n.activeRetEye),
        typeof i == "function"
          ? i(n.currentRefraction)
          : a.setRefraction(n.currentRefraction),
        (e.cylinderAxisDeg = n.cylinderAxisDeg),
        (e.corticalCataractPattern = n.corticalCataractPattern
          ? JSON.parse(JSON.stringify(n.corticalCataractPattern))
          : null),
        z && (z.value = n.currentRefraction),
        te && (te.value = String(n.retStreakOffset)),
        a.setRetStreakOffset(n.retStreakOffset),
        Z && (Z.value = String(n.retStreakRotation)),
        a.setRetStreakRotation(n.retStreakRotation));
    }
    function B(n) {
      return typeof e.cylinderAxisDeg == "number"
        ? n.value === "low-cylinder" || n.value === "high-cylinder"
          ? `${n.label}, - cyl axis ${e.cylinderAxisDeg} deg`
          : `${n.label}, axis ${e.cylinderAxisDeg} deg`
        : n.label;
    }
    function s() {
      (Q(), (e.isTestRevealed = !0), (e.testCountdown = 0), K(!1), oe());
    }
    function y() {
      (Q(),
        (e.testTimerId = window.setInterval(() => {
          if (e.testCountdown <= 1) {
            s();
            return;
          }
          ((e.testCountdown -= 1), oe());
        }, 1e3)));
    }
    function M() {
      e.testPreviousState
        ? (e.testRoundIndex = Math.min(e.testRoundIndex + 1, Ce.length - 1))
        : ((e.testPreviousState = ge()), (e.testRoundIndex = 0));
      let n = qa(e.retStreakRotation),
        g = za(e.testLastRefraction, { babyOnly: e.isBabyMode });
      g &&
        ((e.isTestMode = !0),
        (e.isTestRevealed = !1),
        (e.testConditionValue = g.value),
        (e.testCountdown = Ha(e.testRoundIndex)),
        (e.testLastRefraction = g.value),
        [v, h, I].forEach((l) => {
          l &&
            ((l.checked = !1),
            l.dispatchEvent(new Event("change", { bubbles: !0 })));
        }),
        [p, $, G, ...j, ...X].forEach((l) => {
          l && ((l.value = l.defaultValue), ye(l));
        }),
        le(!0),
        K(!0),
        typeof i == "function"
          ? i(g.value)
          : (a.setRefraction(g.value), z && (z.value = g.value)),
        Z && (Z.value = String(n)),
        a.setRetStreakRotation(n),
        (e.testRevealLabel = B(g)),
        oe(),
        ae(),
        ee(!1),
        y());
    }
    function P() {
      (!e.isTestMode && !e.testPreviousState) ||
        (Q(),
        le(!1),
        K(!1),
        T(),
        (e.isTestMode = !1),
        (e.isTestRevealed = !1),
        (e.testCountdown = 0),
        (e.testConditionValue = null),
        (e.testRevealLabel = ""),
        (e.testPreviousState = null),
        (e.testRoundIndex = 0),
        oe(),
        ae());
    }
    function r() {
      M();
    }
    function o() {
      (u && u.addEventListener("click", r),
        S && S.addEventListener("click", M),
        oe(),
        ae());
    }
    return { closeTestMode: P, init: o, startTestRound: M };
  }
  function Va(e = window.location, t = navigator) {
    return "serviceWorker" in t && ["http:", "https:"].includes(e.protocol);
  }
  function Zt() {
    Va() &&
      window.addEventListener(
        "load",
        () => {
          navigator.serviceWorker
            .register("./sw.js", { scope: "./" })
            .catch((e) => {
              console.warn("Sauron offline support could not start.", e);
            });
        },
        { once: !0 },
      );
  }
  function ea(e, t = () => window.location.reload()) {
    let a = e.resetSimulatorButton,
      i = e.resetSimulatorStatus;
    if (!a || !i) return;
    let c = 0;
    a.addEventListener("click", () => {
      let u = Date.now();
      if (u <= c) {
        t();
        return;
      }
      ((c = u + 8e3),
        (a.textContent = "Confirm reset"),
        (i.textContent =
          "Press again within 8 seconds to restore the starting simulator state."),
        window.setTimeout(() => {
          Date.now() <= c ||
            ((c = 0),
            (a.textContent = "Reset simulator"),
            (i.textContent = ""));
        }, 8100));
    });
  }
  function $a(e) {
    e &&
      (e.replaceChildren(),
      Re.forEach((t) => {
        let a = document.createElement("optgroup");
        ((a.label = t.label),
          t.options.forEach((i) => {
            let c = document.createElement("option");
            ((c.value = i.value),
              (c.textContent = i.label),
              (c.dataset.cat = t.category),
              (c.selected = i.value === nt),
              a.appendChild(c));
          }),
          e.appendChild(a));
      }));
  }
  function Ua({ dom: e, eyesController: t, retinoscopyController: a }) {
    (be() ||
      e.irises.forEach((i) => {
        ((i.style.transform = "translate(0, 0)"), (i.style.transition = ""));
      }),
      t.startAmbientAnimations(),
      a.renderNow(!0));
  }
  function ta() {
    let e = ht(),
      t = Yt();
    ($a(e.refractionStateSelect),
      e.refractionStateSelect &&
        (e.refractionStateSelect.value = t.currentRefraction));
    let a = Xt({ state: t, dom: e }),
      i = jt({ state: t, dom: e, retinoscopyController: a }),
      c = Jt({ state: t, dom: e, retinoscopyController: a, onCaseChange: d }),
      u = bt({
        state: t,
        dom: e,
        onEyeGeometryChange: ({ includePosition: p = !0 } = {}) =>
          a.scheduleRetinoscopy(p),
      }),
      x = null;
    function d(p) {
      (a.setRefraction(p),
        e.refractionStateSelect && (e.refractionStateSelect.value = p),
        x && x.update());
    }
    function E(p, v) {
      p && (p.checked = v);
    }
    function S() {
      (E(e.gazeToggle, t.isGazeMode),
        E(e.dilatedToggle, t.isDilatedMode),
        E(e.babyToggle, t.isBabyMode));
    }
    (u.init(),
      vt(e),
      i.init(),
      c.init(),
      ea(e),
      Tt({ state: t, dom: e, onBeforeOpenMcq: () => c.closeTestMode() }),
      (x = It({
        state: t,
        dom: e,
        onBeforeOpen: () => c.closeTestMode(),
        onSelectCase: d,
      })),
      x.init(),
      e.retEyeButtons.forEach((p) => {
        p.addEventListener("click", () => {
          a.setActiveRetEye(p.dataset.retEye);
        });
      }),
      a.setActiveRetEye(t.activeRetEye),
      e.reflexColorSlider &&
        (e.reflexColorSlider.addEventListener("input", (p) => {
          let v = parseInt(p.target.value, 10),
            h = it(v);
          (u.applyReflexColor(h), (t.baseReflexColor = at(h)));
        }),
        e.reflexColorSlider.dispatchEvent(new Event("input"))),
      e.manualEyeMoveToggle &&
        (e.manualEyeMoveToggle.addEventListener("change", (p) => {
          u.setManualEyeMoveEnabled(p.target.checked);
        }),
        (e.manualEyeMoveToggle.checked = t.isManualEyeMoveEnabled),
        u.setManualEyeMoveEnabled(t.isManualEyeMoveEnabled)),
      e.refractionStateSelect &&
        e.refractionStateSelect.addEventListener("change", (p) => {
          d(p.target.value);
        }),
      e.gazeToggle &&
        e.gazeToggle.addEventListener("change", (p) => {
          (u.setGazeMode(p.target.checked), S());
        }),
      e.dilatedToggle &&
        e.dilatedToggle.addEventListener("change", (p) => {
          (u.setDilatedMode(p.target.checked), S());
        }),
      e.babyToggle &&
        e.babyToggle.addEventListener("change", (p) => {
          if (
            (u.setBabyMode(p.target.checked),
            !Ae({ babyOnly: t.isBabyMode }).some(
              (C) => C.value === t.currentRefraction,
            ))
          ) {
            let C = ft();
            C && d(C.value);
          }
          (S(), x.update());
        }),
      e.retinoscopySlider &&
        e.retinoscopySlider.addEventListener("input", (p) => {
          a.setRetStreakOffset(parseInt(p.target.value, 10));
        }),
      e.retinoscopyRotationSlider &&
        e.retinoscopyRotationSlider.addEventListener("input", (p) => {
          a.setRetStreakRotation(parseInt(p.target.value, 10));
        }),
      e.cataractSlider &&
        (e.cataractSlider.addEventListener("input", (p) => {
          let v = parseInt(p.target.value, 10);
          (u.setCataractLevel(v), a.setCataractLevel(v));
        }),
        e.cataractSlider.dispatchEvent(new Event("input"))),
      e.nystagmusSlider &&
        (e.nystagmusSlider.addEventListener("input", (p) => {
          u.setNystagmusLevel(parseInt(p.target.value, 10));
        }),
        e.nystagmusSlider.dispatchEvent(new Event("input"))),
      Ua({ dom: e, eyesController: u, retinoscopyController: a }),
      S(),
      window.addEventListener("resize", () => {
        a.scheduleRetinoscopy(!0);
      }),
      Zt());
  }
  function aa() {
    ta();
  }
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", aa, { once: !0 })
    : aa();
})();
