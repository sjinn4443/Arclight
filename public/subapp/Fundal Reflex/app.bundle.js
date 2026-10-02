"use strict";
(() => {
  function st(e) {
    let t = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(e);
    return t
      ? { r: parseInt(t[1], 10), g: parseInt(t[2], 10), b: parseInt(t[3], 10) }
      : { r: 0, g: 0, b: 0 };
  }
  function Ge(e, t) {
    return {
      r: Math.min(Math.round(e.r * t), 255),
      g: Math.min(Math.round(e.g * t), 255),
      b: Math.min(Math.round(e.b * t), 255),
    };
  }
  function ct(e) {
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
      r;
    for (let d = 0; d < t.length - 1; d += 1)
      if (e >= t[d].value && e <= t[d + 1].value) {
        ((a = t[d]), (r = t[d + 1]));
        break;
      }
    if (!a || !r) return "rgb(255, 0, 0)";
    let o = (e - a.value) / (r.value - a.value),
      l = Math.round(a.color.r + (r.color.r - a.color.r) * o),
      i = Math.round(a.color.g + (r.color.g - a.color.g) * o),
      s = Math.round(a.color.b + (r.color.b - a.color.b) * o);
    return `rgb(${l}, ${i}, ${s})`;
  }
  var De = Object.freeze(st(ct(0)));
  var se = [
      {
        label: "Normal / Refractive",
        category: "custom",
        options: [
          { value: "zero", label: "1. Normal (orange-red) R & L" },
          { value: "bilateral-blue-normal", label: "2. Normal (blue) R & L" },
          {
            value: "technique-child-looking-away",
            label: "3. Poor view: looking away",
            triggerLabel: "3. Poor view: looking away",
          },
          {
            value: "technique-upper-lid-blocking",
            label: "4. Poor view: upper lid blocking",
            triggerLabel: "4. Poor view: upper lid",
          },
          { value: "normal-dark", label: "8. R normal, L dark" },
          {
            value: "bilateral-dull-reflex",
            label: "15. Dull corneal reflex R & L",
            triggerLabel: "15. Dull corneal reflex R & L",
          },
          {
            value: "bilateral-poor-tear-film",
            label: "12. Poor tear film R & L",
          },
          {
            value: "bilateral-high-hypermetropia",
            label: "9. High hypermetropia R & L",
          },
          { value: "bilateral-myopia", label: "10. Myopia R & L" },
          {
            value: "right-hyper-left-myopia",
            label: "11. R hypermetropia, L myopia",
            triggerLabel: "11. R hyper, L myopia",
          },
        ],
      },
      {
        label: "Alignment",
        category: "custom",
        options: [
          {
            value: "right-normal-left-large-esotropia",
            label: "5. R normal, L large esotropia",
            triggerLabel: "5. R normal, L esotropia",
          },
          {
            value: "right-large-exotropia-left-corneal-scar",
            label: "6. R large exotropia, L scar",
            triggerLabel: "6. R exotropia, L scar",
          },
        ],
      },
      {
        label: "Iris / Pupil",
        category: "custom",
        options: [
          {
            value: "right-coloboma-left-normal",
            label: "19. R coloboma, L normal",
          },
          { value: "bilateral-aniridia", label: "20. Aniridia R & L" },
          {
            value: "right-normal-left-anisocoria",
            label: "14. R normal, L smaller pupil",
            triggerLabel: "14. R normal, L small pupil",
          },
          {
            value: "right-iris-transillumination-left-normal",
            label: "21. R transillumination, L normal",
            triggerLabel: "21. R transillum., L normal",
          },
          { value: "bilateral-small-pupils", label: "13. Small pupils R & L" },
          {
            value: "right-acg-left-normal",
            label: "30. R angle closure, L normal",
          },
          {
            value: "right-iridocyclitis-left-normal",
            label: "29. R iridocyclitis, L normal",
          },
        ],
      },
      {
        label: "Cornea",
        category: "custom",
        options: [
          { value: "bilateral-keratoconus", label: "28. Keratoconus R & L" },
          {
            value: "right-normal-left-corneal-opacity",
            label: "17. R normal, L corneal opacity",
            triggerLabel: "17. R normal, L opacity",
          },
        ],
      },
      {
        label: "Lens / Media",
        category: "custom",
        options: [
          {
            value: "right-hyper-left-posterior-pole",
            label: "18. R hypermetropia, L posterior pole",
            triggerLabel: "18. R hyper, L posterior pole",
          },
          {
            value: "bilateral-dense-cataract",
            label: "16. Dense cataract R & L",
          },
          {
            value: "right-big-cortical-left-small-cortical",
            label: "24. R large cortical, L slight cortical",
            triggerLabel: "24. R large cortical, L slight",
          },
          {
            value: "bilateral-subcapsular-cataract",
            label: "25. Subcapsular cataract R & L",
          },
          {
            value: "right-iol-left-posterior-capsular-thickening",
            label: "26. R IOL, L capsular thickening",
            triggerLabel: "26. R IOL, L capsular thick.",
          },
          {
            value: "right-aphakia-left-normal",
            label: "27. R aphakia, L normal",
          },
          {
            value: "right-normal-left-subluxated-lens",
            label: "22. R normal, L subluxated lens",
            triggerLabel: "22. R normal, L sublux lens",
          },
        ],
      },
      {
        label: "Vitreous / Retina",
        category: "custom",
        options: [
          {
            value: "right-retinoblastoma-left-normal",
            label: "7. R retinoblastoma, L normal",
            triggerLabel: "7. R retinoblastoma, L normal",
          },
          {
            value: "right-floaters-left-normal",
            label: "23. R floaters, L normal",
          },
          {
            value: "right-vitreous-haemorrhage-left-normal",
            label: "31. R vitreous haemorrhage, L normal",
            triggerLabel: "31. R vitreous haem., L normal",
          },
          {
            value: "right-retinal-detachment-left-normal",
            label: "32. R retinal detachment, L normal",
            triggerLabel: "32. R retinal detach., L normal",
          },
        ],
      },
    ],
    Ae = se.flatMap(({ category: e, options: t, separator: a }) =>
      a ? [] : t.map((r) => ({ ...r, category: e })),
    ),
    ut = [
      "zero",
      "bilateral-blue-normal",
      "technique-child-looking-away",
      "technique-upper-lid-blocking",
      "bilateral-dull-reflex",
      "bilateral-high-hypermetropia",
      "right-hyper-left-myopia",
      "right-normal-left-large-esotropia",
      "right-large-exotropia-left-corneal-scar",
      "normal-dark",
      "right-coloboma-left-normal",
      "bilateral-aniridia",
      "right-normal-left-corneal-opacity",
      "bilateral-dense-cataract",
      "right-normal-left-subluxated-lens",
      "right-retinoblastoma-left-normal",
    ],
    Ee = new Set(ut),
    Mt = Ae.filter((e) => Ee.has(e.value)),
    me = [
      {
        value: "primary",
        label: "Primary",
        values: [
          "zero",
          "bilateral-blue-normal",
          "technique-child-looking-away",
          "technique-upper-lid-blocking",
          "right-normal-left-large-esotropia",
          "right-large-exotropia-left-corneal-scar",
          "right-retinoblastoma-left-normal",
          "normal-dark",
        ],
      },
      {
        value: "intermediate",
        label: "Intermediate",
        values: [
          "bilateral-high-hypermetropia",
          "bilateral-myopia",
          "right-hyper-left-myopia",
          "bilateral-poor-tear-film",
          "bilateral-small-pupils",
          "right-normal-left-anisocoria",
          "bilateral-dull-reflex",
          "bilateral-dense-cataract",
          "right-normal-left-corneal-opacity",
          "right-hyper-left-posterior-pole",
          "right-coloboma-left-normal",
          "bilateral-aniridia",
          "right-iris-transillumination-left-normal",
          "right-normal-left-subluxated-lens",
        ],
      },
      {
        value: "advanced",
        label: "Advanced",
        values: [
          "right-floaters-left-normal",
          "right-big-cortical-left-small-cortical",
          "bilateral-subcapsular-cataract",
          "right-iol-left-posterior-capsular-thickening",
          "right-aphakia-left-normal",
          "bilateral-keratoconus",
          "right-iridocyclitis-left-normal",
          "right-acg-left-normal",
          "right-vitreous-haemorrhage-left-normal",
          "right-retinal-detachment-left-normal",
        ],
      },
    ],
    Ue = Ae,
    qe = new Set(Ae.map(({ value: e }) => e));
  var Er = {
      zero: {
        why: "both eyes match in brightness, shape and crescent position",
        keyClue: "both eyes look closely matched",
        similarCases: ["bilateral-blue-normal", "bilateral-dull-reflex"],
      },
      "normal-dark": {
        why: "left reflex is much darker than the right",
        keyClue: "marked asymmetry, one eye looks dark",
        similarCases: [
          "right-normal-left-corneal-opacity",
          "right-retinoblastoma-left-normal",
        ],
      },
      "bilateral-blue-normal": {
        why: "both reflexes are blue-white but otherwise matched",
        keyClue: "colour shift with otherwise similar reflexes",
        similarCases: ["zero", "bilateral-dull-reflex"],
      },
      "technique-child-looking-away": {
        why: "the pupils are not looking towards the light, so this is a poor view",
        keyClue: "both eyes are looking away from the examiner",
        similarCases: ["zero", "right-normal-left-large-esotropia"],
      },
      "technique-upper-lid-blocking": {
        why: "the upper lids partly cover the pupils, so the reflex cannot be judged well",
        keyClue: "upper lids block the pupil opening",
        similarCases: ["zero", "bilateral-small-pupils"],
      },
      "bilateral-dull-reflex": {
        why: "both corneal reflexes are dimmer and greyer than normal",
        keyClue: "bilateral corneal reflex dullness without a focal plaque",
        similarCases: ["bilateral-dense-cataract", "bilateral-blue-normal"],
      },
      "bilateral-poor-tear-film": {
        why: "both surface reflexes look uneven and lose sharpness",
        keyClue: "surface reflex flickers rather than stays fixed",
        similarCases: ["bilateral-dull-reflex", "zero"],
      },
      "bilateral-high-hypermetropia": {
        why: "large bright superior crescents are present in both eyes",
        keyClue: "top crescents in both pupils",
        similarCases: ["right-hyper-left-myopia", "zero"],
      },
      "bilateral-myopia": {
        why: "large bright inferior crescents are present in both eyes",
        keyClue: "bottom crescents in both pupils",
        similarCases: ["right-hyper-left-myopia", "bilateral-keratoconus"],
      },
      "right-hyper-left-myopia": {
        why: "the right crescent is superior and the left crescent is inferior",
        keyClue: "crescent direction differs between the eyes",
        similarCases: ["bilateral-high-hypermetropia", "bilateral-myopia"],
      },
      "right-normal-left-large-esotropia": {
        why: "the left eye turns in so the two eyes no longer align equally",
        keyClue: "turned-in eye shows a brighter reflex",
        similarCases: [
          "right-large-exotropia-left-corneal-scar",
          "right-normal-left-anisocoria",
        ],
      },
      "right-large-exotropia-left-corneal-scar": {
        why: "the right eye turns out and the left reflex is broken by corneal irregularity",
        keyClue: "outward deviation plus corneal irregularity",
        similarCases: [
          "right-normal-left-large-esotropia",
          "right-normal-left-corneal-opacity",
        ],
      },
      "right-coloboma-left-normal": {
        why: "the right pupil has an inferior keyhole shape",
        keyClue: "notched keyhole pupil",
        similarCases: [
          "bilateral-aniridia",
          "right-iris-transillumination-left-normal",
        ],
      },
      "bilateral-aniridia": {
        why: "both pupils are very large with very little visible iris and typical nystagmus",
        keyClue: "absent iris tissue plus nystagmus",
        similarCases: ["right-coloboma-left-normal", "bilateral-small-pupils"],
      },
      "right-normal-left-anisocoria": {
        why: "the left pupil is clearly smaller while reflex shape stays similar",
        keyClue: "pupil sizes do not match",
        similarCases: ["bilateral-small-pupils", "right-acg-left-normal"],
      },
      "right-iris-transillumination-left-normal": {
        why: "light is seen passing through a patchy right iris, most likely from peripheral iridectomy or trauma",
        keyClue: "iris transillumination, often iridectomy or trauma",
        similarCases: [
          "right-coloboma-left-normal",
          "right-iridocyclitis-left-normal",
        ],
      },
      "bilateral-small-pupils": {
        why: "both pupils are symmetrically small and round",
        keyClue: "both pupils are small, not just one",
        similarCases: ["right-normal-left-anisocoria", "bilateral-aniridia"],
      },
      "right-acg-left-normal": {
        why: "the right pupil is vertically oval rather than round",
        keyClue: "oval pupil in one acute eye",
        similarCases: [
          "right-normal-left-anisocoria",
          "right-iridocyclitis-left-normal",
        ],
      },
      "right-iridocyclitis-left-normal": {
        why: "small dark deposits sit on the right reflex superiorly and temporally",
        keyClue: "tiny black dots on the reflex",
        similarCases: [
          "right-iris-transillumination-left-normal",
          "right-acg-left-normal",
        ],
      },
      "bilateral-keratoconus": {
        why: "the reflex is split into bilateral scissors-like bands",
        keyClue: "large bilateral scissors reflex",
        similarCases: ["bilateral-myopia", "bilateral-high-hypermetropia"],
      },
      "right-normal-left-corneal-opacity": {
        why: "the left reflex is grey and the corneal highlight is not sharp",
        keyClue: "grey reflex with hazy corneal highlight",
        similarCases: [
          "right-large-exotropia-left-corneal-scar",
          "normal-dark",
        ],
      },
      "right-hyper-left-posterior-pole": {
        why: "the left has a focal posterior opacity and the right has a superior crescent",
        keyClue: "focal posterior opacity plus opposite-eye hypermetropia",
        similarCases: [
          "bilateral-subcapsular-cataract",
          "bilateral-dense-cataract",
        ],
      },
      "bilateral-dense-cataract": {
        why: "both reflexes are very dull and muted by dense opacity",
        keyClue: "bilateral dense media haze",
        similarCases: [
          "bilateral-dull-reflex",
          "bilateral-subcapsular-cataract",
        ],
      },
      "right-big-cortical-left-small-cortical": {
        why: "radial spoke-like lens changes are present in both eyes, worse on the right",
        keyClue: "lens spokes, right greater than left",
        similarCases: [
          "bilateral-subcapsular-cataract",
          "bilateral-dense-cataract",
        ],
      },
      "bilateral-subcapsular-cataract": {
        why: "central posterior plaques interrupt the reflex in both pupils",
        keyClue: "central posterior plaques, often with glare",
        similarCases: [
          "right-hyper-left-posterior-pole",
          "bilateral-dense-cataract",
        ],
      },
      "right-iol-left-posterior-capsular-thickening": {
        why: "the right shows a second reflex and the left shows posterior capsular haze",
        keyClue: "double reflex on one side, capsule haze on the other",
        similarCases: [
          "right-aphakia-left-normal",
          "bilateral-subcapsular-cataract",
        ],
      },
      "right-aphakia-left-normal": {
        why: "the right reflex is unusually bright and fills most of the pupil",
        keyClue: "very bright full aphakic reflex",
        similarCases: ["right-iol-left-posterior-capsular-thickening", "zero"],
      },
      "right-normal-left-subluxated-lens": {
        why: "a lens edge is visible with a reversed inferior crescent on the left",
        keyClue: "inferior lens edge with reversed crescent",
        similarCases: [
          "right-hyper-left-posterior-pole",
          "right-aphakia-left-normal",
        ],
      },
      "right-retinoblastoma-left-normal": {
        why: "the right pupil is creamy white with red vessels across it",
        keyClue: "white pupil with red vessels",
        similarCases: ["normal-dark", "right-normal-left-corneal-opacity"],
      },
      "right-floaters-left-normal": {
        why: "dark vitreous strands cross an otherwise normal right reflex",
        keyClue: "moving vitreous opacities",
        similarCases: [
          "right-vitreous-haemorrhage-left-normal",
          "right-retinal-detachment-left-normal",
        ],
      },
      "right-vitreous-haemorrhage-left-normal": {
        why: "blood diffusely darkens and clouds the normal right reflex",
        keyClue: "diffuse blood-darkening within the vitreous",
        similarCases: [
          "right-floaters-left-normal",
          "right-retinal-detachment-left-normal",
        ],
      },
      "right-retinal-detachment-left-normal": {
        why: "a fixed shadowed sector reduces part of the right reflex",
        keyClue: "fixed shadowed segment with remaining peripheral reflex",
        similarCases: [
          "right-vitreous-haemorrhage-left-normal",
          "right-floaters-left-normal",
        ],
      },
    },
    yr = {
      why: "pattern does not match a teaching note yet",
      keyClue: "compare the reflex carefully",
      similarCases: [],
    };
  function Ye(e) {
    return Er[e] || yr;
  }
  function St(e) {
    return (Ye(e).similarCases || [])
      .map((a) => Ae.find((r) => r.value === a))
      .filter(Boolean);
  }
  var vt = {
      r: Math.round(218 * 0.7),
      g: Math.round(58 * 0.7),
      b: Math.round(0 * 0.7),
    },
    dt = "zero",
    Nt = {
      retStreakOffset: 0,
      retStreakOffsetY: 0,
      currentRefraction: dt,
      cylinderAxisDeg: null,
      cataractLevel: 0,
      nystagmusLevel: 0,
      nystagmusDirection: "horizontal",
      nystagmusWave: "jerk",
      nystagmusRate: "slow",
    },
    Rr = new Set(["low-cylinder", "high-cylinder"]),
    Pi = new Set([...Rr, "small-scissors", "keratoconus", "corneal-scar"]),
    $e = [20, 15, 10, 8, 6];
  var Pt = {
      none: { badge: "None", line: "Action: Reassuring" },
      unclear: { badge: "?", line: "? Action: Repeat view / ask for help" },
      routine: { badge: "Routine", line: "? Action: Routine review" },
      soon: { badge: "Soon", line: "! Action: Refer soon" },
      urgent: { badge: "Urgent", line: "! Action: Urgent today" },
    },
    Tr = {
      zero: {
        likely: "Normal reflexes R & L",
        likelyBaby: "Normal infant reflexes R & L",
        site: "Normal / refractive",
        referral: "none",
      },
      "normal-dark": {
        likely: "Reduced reflex L",
        likelyBaby: "Reduced infant reflex L",
        site: "Media or fundus",
        referral: "soon",
        babyReferral: "urgent",
      },
      "bilateral-blue-normal": {
        likely: "Normal blue reflexes R & L",
        site: "Reflex colour",
        referral: "none",
      },
      "technique-child-looking-away": {
        likely: "Poor view: child looking away",
        site: "Technique",
        referral: "unclear",
      },
      "technique-upper-lid-blocking": {
        likely: "Poor view: upper lid blocking pupil",
        site: "Technique",
        referral: "unclear",
      },
      "bilateral-dull-reflex": {
        likely: "Dull corneal reflex R & L",
        likelyBaby: "Dull infant corneal reflexes R & L, ?congenital cataract",
        glareLikely: "Dull corneal reflex R & L, ?cataract / media opacity",
        site: "Cornea / media",
        referral: "soon",
        babyReferral: "urgent",
      },
      "bilateral-poor-tear-film": {
        likely: "Poor tear film R & L",
        site: "Tear film / cornea",
        referral: "routine",
      },
      "bilateral-high-hypermetropia": {
        likely: "High hypermetropia R & L",
        likelyBaby: "High hypermetropia R & L in infant",
        site: "Refractive",
        referral: "routine",
        babyReferral: "soon",
      },
      "bilateral-myopia": {
        likely: "Myopia R & L",
        likelyBaby: "Myopia R & L in infant",
        site: "Refractive",
        referral: "routine",
        babyReferral: "soon",
      },
      "right-hyper-left-myopia": {
        likely: "Anisometropia",
        likelyBaby: "Anisometropia in infant",
        site: "Refractive",
        referral: "soon",
      },
      "right-normal-left-large-esotropia": {
        likely: "Large esotropia L",
        likelyBaby: "Infantile esotropia L",
        site: "Alignment",
        referral: "soon",
      },
      "right-large-exotropia-left-corneal-scar": {
        likely: "Exotropia R, corneal scar L",
        site: "Alignment / cornea",
        referral: "soon",
      },
      "right-coloboma-left-normal": {
        likely: "Coloboma R",
        likelyBaby: "Congenital coloboma R",
        site: "Iris",
        referral: "soon",
      },
      "bilateral-aniridia": {
        likely: "Aniridia R & L with nystagmus",
        likelyBaby: "Congenital aniridia R & L with nystagmus",
        site: "Iris / ocular motor",
        referral: "soon",
      },
      "right-normal-left-anisocoria": {
        likely: "Anisocoria, L smaller",
        suddenLikely: "Acute anisocoria, L smaller",
        site: "Pupil",
        referral: "routine",
        suddenReferral: "soon",
      },
      "right-iris-transillumination-left-normal": {
        likely:
          "Iris transillumination R, likely peripheral iridectomy or trauma",
        site: "Iris / anterior segment",
        referral: "soon",
      },
      "bilateral-small-pupils": {
        likely: "Small pupils R & L",
        site: "Pupil",
        referral: "routine",
      },
      "right-acg-left-normal": {
        likely: "Possible acute angle closure R",
        site: "Angle / anterior segment",
        referral: "urgent",
      },
      "right-iridocyclitis-left-normal": {
        likely: "Possible iridocyclitis R",
        suddenLikely: "Possible acute iridocyclitis R",
        site: "Anterior uvea",
        referral: "urgent",
      },
      "bilateral-keratoconus": {
        likely: "Keratoconus R & L",
        site: "Cornea",
        referral: "soon",
      },
      "right-normal-left-corneal-opacity": {
        likely: "Corneal opacity L",
        site: "Cornea",
        referral: "soon",
        babyReferral: "urgent",
      },
      "right-hyper-left-posterior-pole": {
        likely: "R hypermetropia, L posterior pole cataract",
        likelyBaby: "R hypermetropia, L posterior pole cataract in infant",
        glareLikely: "R hypermetropia, L posterior pole cataract with glare",
        site: "Lens",
        referral: "soon",
        babyReferral: "urgent",
      },
      "bilateral-dense-cataract": {
        likely: "Dense cataract R & L",
        likelyBaby: "Dense cataract R & L in infant",
        glareLikely: "Dense cataract R & L with glare",
        site: "Lens",
        referral: "soon",
        babyReferral: "urgent",
      },
      "right-big-cortical-left-small-cortical": {
        likely: "Cortical cataract, R > L",
        glareLikely: "Cortical cataract, R > L with glare",
        site: "Lens",
        referral: "soon",
      },
      "bilateral-subcapsular-cataract": {
        likely: "Subcapsular cataract R & L",
        glareLikely: "Subcapsular cataract R & L with glare",
        site: "Lens",
        referral: "soon",
      },
      "right-iol-left-posterior-capsular-thickening": {
        likely: "PCO L after IOL",
        glareLikely: "PCO L after IOL with glare",
        site: "Lens / capsule",
        referral: "soon",
      },
      "right-aphakia-left-normal": {
        likely: "Aphakia R",
        site: "Lens",
        referral: "soon",
      },
      "right-normal-left-subluxated-lens": {
        likely: "Subluxated lens L",
        suddenLikely: "Possible acute lens subluxation L",
        site: "Lens",
        referral: "soon",
        suddenReferral: "urgent",
      },
      "right-retinoblastoma-left-normal": {
        likely: "Leucocoria R, ?retinoblastoma",
        likelyBaby: "Infant leucocoria R, ?retinoblastoma",
        site: "Retina / fundus",
        referral: "urgent",
      },
      "right-floaters-left-normal": {
        likely: "Floaters R",
        suddenLikely: "Acute floaters R",
        site: "Vitreous",
        referral: "soon",
        suddenReferral: "urgent",
      },
      "right-vitreous-haemorrhage-left-normal": {
        likely: "Possible vitreous haemorrhage R",
        suddenLikely: "Possible acute vitreous haemorrhage R",
        site: "Vitreous",
        referral: "urgent",
      },
      "right-retinal-detachment-left-normal": {
        likely: "Possible retinal detachment R",
        suddenLikely: "Possible acute retinal detachment R",
        site: "Retina",
        referral: "urgent",
      },
    };
  function Bt(e) {
    return Pt[e] ? e : "routine";
  }
  function Cr(e) {
    return (
      Tr[e] || {
        likely: "Pattern selected",
        site: "Observation",
        referral: "routine",
      }
    );
  }
  function wt({
    caseValue: e,
    isBabyMode: t = !1,
    onsetMode: a = "gradual",
    glareOn: r = !1,
    isTestMode: o = !1,
    isTestRevealed: l = !1,
  }) {
    if (o && !l)
      return {
        tone: "neutral",
        badge: "Masked",
        likely: "Likely: hidden during test mode",
        site: "Site: hidden during test mode",
        referral: "Action: hidden during test mode",
      };
    let i = Cr(e),
      s = t && i.likelyBaby ? i.likelyBaby : i.likely,
      d = Bt(t && i.babyReferral ? i.babyReferral : i.referral);
    (a === "sudden" &&
      (i.suddenLikely && (s = i.suddenLikely),
      i.suddenReferral && (d = Bt(i.suddenReferral))),
      r && i.glareLikely && (s = i.glareLikely));
    let g = Pt[d];
    return {
      tone: d,
      badge: g.badge,
      likely: `Likely: ${s}`,
      site: `Site: ${i.site}`,
      referral: g.line
        .replace("Action:", "Example action:")
        .replace("Urgent today", t ? "Urgent eye referral" : "Urgent today"),
    };
  }
  var Ir = {
      zero: ["Screening", "No symptoms"],
      "normal-dark": ["Incidental", "No symptoms"],
      "bilateral-blue-normal": ["Screening", "No symptoms"],
      "bilateral-dull-reflex": ["Gradual", "Blur"],
      "bilateral-poor-tear-film": ["Fluctuating", "Variable blur"],
      "bilateral-high-hypermetropia": ["Screening", "Blur/strain"],
      "bilateral-myopia": ["Gradual", "Distance blur"],
      "right-hyper-left-myopia": ["Screening", "Blur"],
      "right-normal-left-large-esotropia": ["Early onset", "No symptoms"],
      "right-large-exotropia-left-corneal-scar": ["Longstanding", "Blur"],
      "right-coloboma-left-normal": ["Congenital", "Photophobia"],
      "bilateral-aniridia": ["Congenital", "Photophobia"],
      "right-normal-left-anisocoria": ["Incidental", "No symptoms"],
      "right-iris-transillumination-left-normal": ["Gradual", "Photophobia"],
      "bilateral-small-pupils": ["Incidental", "No symptoms"],
      "right-acg-left-normal": ["Sudden", "Pain/haloes"],
      "right-iridocyclitis-left-normal": ["Sudden", "Pain/photo"],
      "bilateral-keratoconus": ["Gradual", "Blur/ghosting"],
      "right-normal-left-corneal-opacity": ["Longstanding", "Blur"],
      "right-hyper-left-posterior-pole": ["Screening", "Reduced vision"],
      "bilateral-dense-cataract": ["Gradual", "Glare/blur"],
      "right-big-cortical-left-small-cortical": ["Gradual", "Glare"],
      "bilateral-subcapsular-cataract": ["Gradual", "Glare/near blur"],
      "right-iol-left-posterior-capsular-thickening": ["After surgery", "Blur"],
      "right-aphakia-left-normal": ["After surgery", "Blur"],
      "right-normal-left-subluxated-lens": ["Longstanding", "Blur/diplopia"],
      "right-retinoblastoma-left-normal": ["Parent noticed", "White pupil"],
      "right-floaters-left-normal": ["Sudden", "Floaters"],
      "right-vitreous-haemorrhage-left-normal": ["Sudden", "Floaters/blur"],
      "right-retinal-detachment-left-normal": ["Sudden", "Shadow/flashes"],
    },
    _r = ["Incidental", "No symptoms"];
  function Ft(e) {
    return Ir[e] || _r;
  }
  function kt({ checked: e, context: t, disabled: a, label: r, title: o }) {
    let l = document.createElement("label");
    ((l.className =
      "advanced-switch advanced-toolbar-switch modifier-context-switch"),
      (l.title = o));
    let i = document.createElement("input");
    ((i.type = "checkbox"),
      (i.dataset.contextSwitch = t),
      (i.checked = e),
      (i.disabled = a));
    let s = document.createElement("span");
    ((s.className = "advanced-switch-track"),
      s.setAttribute("aria-hidden", "true"));
    let d = document.createElement("span");
    return (
      (d.className =
        "advanced-toolbar-switch-text modifier-context-switch-text"),
      (d.textContent = r),
      l.append(i, s, d),
      l
    );
  }
  function Ht({ container: e, onChange: t, state: a }) {
    function r(i) {
      let [s = "Incidental", d = "No symptoms"] = Ft(i);
      ((a.contextOnsetMode = /^sudden$/i.test(s) ? "sudden" : "gradual"),
        (a.contextGlareOn = /glare/i.test(d)));
    }
    function o() {
      if (!e) return;
      e.replaceChildren();
      let i = kt({
          checked: a.contextOnsetMode === "sudden",
          context: "onset",
          disabled: a.isTestMode,
          label: a.contextOnsetMode === "sudden" ? "Sudden" : "Gradual",
          title: "Switch onset between gradual and sudden",
        }),
        s = kt({
          checked: a.contextGlareOn,
          context: "glare",
          disabled: a.isTestMode,
          label: a.contextGlareOn ? "Glare on" : "Glare",
          title: "Switch glare on or off",
        });
      e.append(i, s);
    }
    function l() {
      e &&
        e.addEventListener("change", (i) => {
          let s =
            i.target instanceof Element
              ? i.target.closest("[data-context-switch]")
              : null;
          if (!s) return;
          let d = s.dataset.contextSwitch;
          (d === "onset"
            ? (a.contextOnsetMode = s.checked ? "sudden" : "gradual")
            : d === "glare" && (a.contextGlareOn = s.checked),
            o(),
            t == null || t());
        });
    }
    return { applyDefaults: r, init: l, render: o };
  }
  function Gt() {
    return {
      body: document.body,
      infoIcon: document.getElementById("info-icon"),
      infoModal: document.getElementById("infoModal"),
      infoModalContent: document.getElementById("infoModalContent"),
      closeModal: document.getElementById("closeModal"),
      infoLearnButton: document.getElementById("info-learn-button"),
      learnMenuButton: document.getElementById("learn-menu-button"),
      learnModal: document.getElementById("learnModal"),
      learnModalContent: document.getElementById("learnModalContent"),
      learnHandoutImage: document.getElementById("learnHandoutImage"),
      closeLearnModalButton: document.getElementById("closeLearnModal"),
      learnExplainList: document.getElementById("learnExplainList"),
      learnTabs: Array.from(document.querySelectorAll(".learn-tab")),
      learnPanels: Array.from(document.querySelectorAll(".learn-panel")),
      learnShareStatus: document.getElementById("learnShareStatus"),
      burgerIcon: document.getElementById("burger-icon"),
      sideMenu: document.getElementById("sideMenu"),
      testModeButton: document.getElementById("test-mode-button"),
      visualCaseTrigger: document.getElementById("visual-case-trigger"),
      visualCaseCurrentLabel: document.getElementById(
        "visual-case-current-label",
      ),
      casePrevButton: document.getElementById("case-prev-button"),
      caseNextButton: document.getElementById("case-next-button"),
      visualCaseModal: document.getElementById("visualCaseModal"),
      visualCaseModalContent: document.getElementById("visualCaseModalContent"),
      closeVisualCaseModalButton: document.getElementById(
        "closeVisualCaseModal",
      ),
      visualCaseModalList: document.getElementById("visual-case-modal-list"),
      visualCaseSimilar: document.getElementById("visual-case-similar"),
      visualCaseSimilarList: document.getElementById(
        "visual-case-similar-list",
      ),
      visualCasePhotoModal: document.getElementById("visualCasePhotoModal"),
      visualCasePhotoModalContent: document.getElementById(
        "visualCasePhotoModalContent",
      ),
      closeVisualCasePhotoModalButton: document.getElementById(
        "closeVisualCasePhotoModal",
      ),
      visualCasePhotoTitle: document.getElementById("visualCasePhotoTitle"),
      visualCasePhotoImage: document.getElementById("visualCasePhotoImage"),
      mcqModal: document.getElementById("mcqModal"),
      mcqModalContent: document.getElementById("mcqModalContent"),
      closeMcqModalButton: document.getElementById("closeMcqModal"),
      mcqTitle: document.getElementById("mcqTitle"),
      mcqIntro: document.getElementById("mcqIntro"),
      mcqContainer: document.getElementById("mcqContainer"),
      submitMcqButton: document.getElementById("submitMcqButton"),
      retryMcqButton: document.getElementById("retryMcqButton"),
      mcqResult: document.getElementById("mcqResult"),
      mcqLevelButtons: Array.from(
        document.querySelectorAll(".mcq-level-button"),
      ),
      controlsDeck: document.querySelector(".controls-deck"),
      liveToggle: document.getElementById("live-toggle"),
      testStatusBanner: document.getElementById("test-status-banner"),
      testCountdownValue: document.getElementById("test-countdown-value"),
      testAnswerText: document.getElementById("test-answer-text"),
      testClueText: document.getElementById("test-clue-text"),
      testNextButton: document.getElementById("test-next-button"),
      observationGuide: document.querySelector(".observation-guide"),
      observationGuideToggle: document.getElementById(
        "observation-guide-toggle",
      ),
      observationGuideItems: Array.from(
        document.querySelectorAll(".observation-guide-item"),
      ),
      observationGuideDetail: document.getElementById(
        "observation-guide-detail",
      ),
      observationTeachingOverlay: document.getElementById(
        "observation-teaching-overlay",
      ),
      observationTeachingTargets: Array.from(
        document.querySelectorAll(".observation-teaching-target"),
      ),
      observationTeachingConnector: document.querySelector(
        ".observation-teaching-connector",
      ),
      resultsSummary: document.getElementById("results-summary"),
      resultsWhy: document.getElementById("results-why"),
      resultsSite: document.getElementById("results-site"),
      resultsUrgency: document.getElementById("results-urgency"),
      advancedDockToggle: document.getElementById("advanced-dock-toggle"),
      advancedPanel: document.getElementById("advanced-panel"),
      modifierContextBar: document.getElementById("modifier-context-bar"),
      reflexColorSlider: document.getElementById("reflex-color-slider"),
      babyToggle: document.getElementById("baby-toggle"),
      dilatedToggle: document.getElementById("dilated-toggle"),
      irisColourSelect: document.getElementById("iris-colour"),
      manualEyeMoveToggle: document.getElementById("manual-eye-move-toggle"),
      refractionShell: document.getElementById("refraction-shell"),
      refractionMaskLabel: document.getElementById("refraction-mask-label"),
      refractionStateSelect: document.getElementById("refraction-state"),
      cataractSlider: document.getElementById("cataract-slider"),
      nystagmusToggle: document.getElementById("toggle-nystagmus"),
      nystagmusDirectionSelect: document.getElementById("nyst-direction"),
      nystagmusWaveSelect: document.getElementById("nyst-wave"),
      nystagmusRateSelect: document.getElementById("nyst-rate"),
      pupilSizeSliders: Array.from(
        document.querySelectorAll(".slider[data-eye]"),
      ),
      eyelidSliders: Array.from(
        document.querySelectorAll(".vertical-eye-slider"),
      ),
      eyesWrapper: document.querySelector(".eyes-wrapper"),
      eyesContainer: document.querySelector(".eyes-container"),
      eyes: Array.from(document.querySelectorAll(".eye")),
      leftEye: document.getElementById("left-eye"),
      rightEye: document.getElementById("right-eye"),
      irises: Array.from(document.querySelectorAll(".iris")),
      retReflexElements: Array.from(document.querySelectorAll(".ret-reflex")),
      retStreak: document.getElementById("ret-streak"),
      retStreakVisual: document.getElementById("ret-streak-visual"),
    };
  }
  function he() {
    var e;
    return !!(
      (e = window.matchMedia) != null &&
      e.call(window, "(prefers-reduced-motion: reduce)").matches
    );
  }
  function Dt({
    dom: e,
    notifyEyeGeometryChange: t,
    state: a,
    updateIrisTransform: r,
  }) {
    function o({ x: _ = 0, y: x = 0, tilt: O = 0 } = {}) {
      e.eyesContainer &&
        (e.eyesContainer.style.setProperty(
          "--gaze-face-x",
          `${_.toFixed(2)}px`,
        ),
        e.eyesContainer.style.setProperty("--gaze-face-y", `${x.toFixed(2)}px`),
        e.eyesContainer.style.setProperty(
          "--gaze-face-tilt",
          `${O.toFixed(2)}deg`,
        ));
    }
    function l() {
      o();
    }
    function i(_ = a.nystagmusLevel === 0) {
      t(a.isLiveMotionEnabled ? !1 : _);
    }
    function s(_) {
      return (_ == null ? void 0 : _.dataset.restingHeightPx) || "0px";
    }
    function d(_) {
      return (_ == null ? void 0 : _.dataset.gazeLidDroopHeightPx) || s(_);
    }
    function g() {
      e.eyes.forEach((_) => {
        let x = _.querySelector(".upper-eyelid");
        x &&
          (x.gazeLidDroopTimerId &&
            (window.clearTimeout(x.gazeLidDroopTimerId),
            (x.gazeLidDroopTimerId = 0)),
          delete x.dataset.gazeLidDroopHeightPx,
          x.dataset.isBlinking !== "true" && (x.style.height = s(x)));
      });
    }
    function f() {
      e.eyes.forEach((_) => {
        let x = _.querySelector(".upper-eyelid"),
          O = _.querySelector(".lower-eyelid");
        (x != null &&
          x.blinkTimerId &&
          (window.clearTimeout(x.blinkTimerId), (x.blinkTimerId = 0)),
          O != null &&
            O.blinkTimerId &&
            (window.clearTimeout(O.blinkTimerId), (O.blinkTimerId = 0)),
          x && (delete x.dataset.isBlinking, (x.style.height = d(x))),
          O && (O.style.height = "0px"));
      });
    }
    function m(
      _,
      { overshoot: x = 0, settleMs: O = 0, staggerMs: D = 0 } = {},
    ) {
      e.irises.forEach((U, J) => {
        if (U.isDragging) return;
        (U.gazeSettleTimerId &&
          (window.clearTimeout(U.gazeSettleTimerId), (U.gazeSettleTimerId = 0)),
          U.gazeStartTimerId &&
            (window.clearTimeout(U.gazeStartTimerId),
            (U.gazeStartTimerId = 0)));
        let G = _(U, J),
          c = U.gazeOffset || { x: 0, y: 0 },
          b = (v) => {
            ((U.gazeOffset = {
              x: parseFloat(v.x.toFixed(2)),
              y: parseFloat(v.y.toFixed(2)),
            }),
              r(U));
          },
          u = J * D,
          y = () => {
            if (x > 0 && O > 0) {
              (b({ x: G.x + (G.x - c.x) * x, y: G.y + (G.y - c.y) * x }),
                i(!1),
                (U.gazeSettleTimerId = window.setTimeout(() => {
                  (b(G), (U.gazeSettleTimerId = 0), i(!1));
                }, O)));
              return;
            }
            (b(G), i(!1));
          };
        u > 0
          ? (U.gazeStartTimerId = window.setTimeout(() => {
              ((U.gazeStartTimerId = 0), y());
            }, u))
          : y();
      });
    }
    function L() {
      let _ = new Set(["horizontal", "vertical", "mixed"]),
        x = new Set(["jerk", "pendular"]),
        O = new Set(["slow", "med", "fast"]),
        D = _.has(a.nystagmusDirection) ? a.nystagmusDirection : "horizontal",
        U = x.has(a.nystagmusWave) ? a.nystagmusWave : "jerk",
        J = O.has(a.nystagmusRate) ? a.nystagmusRate : "slow";
      return { direction: D, wave: U, rate: J };
    }
    function S() {
      (e.irises.forEach((O) => {
        O.microOffset = { x: 0, y: 0 };
      }),
        (a.microSaccadeIntervalId = window.setInterval(() => {
          let O = a.isLiveMotionEnabled && Math.random() < 0.18,
            D = a.isLiveMotionEnabled ? (O ? 4.8 : 2.6) : 2,
            U = a.isLiveMotionEnabled ? (O ? 2.6 : 1.4) : 2,
            J = Math.random() * D - D / 2,
            G = Math.random() * U - U / 2;
          (e.irises.forEach((c) => {
            if (!c.isDragging) {
              let b = parseFloat(
                  (J + (Math.random() * 0.28 - 0.14)).toFixed(2),
                ),
                u = parseFloat((G + (Math.random() * 0.22 - 0.11)).toFixed(2));
              ((c.microOffset = { x: b, y: u }), r(c));
            }
          }),
            i(),
            setTimeout(() => {
              (e.irises.forEach((c) => {
                c.isDragging || ((c.microOffset = { x: 0, y: 0 }), r(c));
              }),
                i());
            }, 120));
        }, 2300)));
    }
    function C() {
      a.gazeShiftTimerId &&
        (clearTimeout(a.gazeShiftTimerId), (a.gazeShiftTimerId = 0));
      let _ = !0,
        x = 0,
        O = 0,
        D = () => {
          let G = Math.random() < 0.5 ? -1 : 1;
          ((x = parseFloat((G * (2.2 + Math.random() * 2.2)).toFixed(2))),
            (O = parseFloat((Math.random() * 2.2 - 1.1).toFixed(2))),
            o({
              x: G * (0.6 + Math.random() * 0.7),
              y: Math.random() * 0.8 - 0.2,
              tilt: G * (0.24 + Math.random() * 0.22),
            }),
            m(
              () => ({
                x: x + (Math.random() * 0.35 - 0.18),
                y: O + (Math.random() * 0.25 - 0.13),
              }),
              {
                overshoot: a.isBabyMode ? 0.07 : 0.045,
                settleMs: a.isBabyMode ? 210 : 250,
                staggerMs: a.isBabyMode ? 14 : 10,
              },
            ));
        };
      D();
      let U = (G, c = 0.18) => {
          e.eyes.forEach((b) => {
            let u = b.querySelector(".upper-eyelid");
            if (!u) return;
            u.gazeLidDroopTimerId && window.clearTimeout(u.gazeLidDroopTimerId);
            let y = parseFloat(s(u)) || 0,
              w = `${Math.max(y, b.clientHeight * c)}px`;
            ((u.dataset.gazeLidDroopHeightPx = w),
              u.dataset.isBlinking !== "true" && (u.style.height = w),
              (u.gazeLidDroopTimerId = window.setTimeout(() => {
                (delete u.dataset.gazeLidDroopHeightPx,
                  (u.gazeLidDroopTimerId = 0),
                  u.dataset.isBlinking !== "true" && (u.style.height = s(u)));
              }, G)));
          });
        },
        J = () => {
          let G = a.isBabyMode,
            c = _
              ? 450 + Math.random() * 650
              : G
                ? 820 + Math.random() * 850
                : 1250 + Math.random() * 1150;
          ((_ = !1),
            (a.gazeShiftTimerId = window.setTimeout(() => {
              if (!a.isLiveMotionEnabled) {
                a.gazeShiftTimerId = 0;
                return;
              }
              let b = Math.random() < (G ? 0.4 : 0.28),
                u = b
                  ? G
                    ? 760 + Math.random() * 760
                    : 1200 + Math.random() * 850
                  : G
                    ? 620 + Math.random() * 640
                    : 1100 + Math.random() * 800,
                y = Math.random() < 0.5 ? -1 : 1,
                v = parseFloat(
                  b
                    ? (y * (15 + Math.random() * 6)).toFixed(2)
                    : (y * (8.5 + Math.random() * 5.5)).toFixed(2),
                ),
                w = parseFloat(
                  b
                    ? (7.5 + Math.random() * 4.5).toFixed(2)
                    : (Math.random() * 7 - 3.5).toFixed(2),
                ),
                z =
                  y *
                  (b ? 2.4 + Math.random() * 1.2 : 1.4 + Math.random() * 0.9),
                W = b
                  ? 1.8 + Math.random() * 1.1
                  : Math.max(-0.8, Math.min(1.2, w * 0.2)),
                Z = Math.random(),
                ae = b && Z < 0.16,
                A = b && Z < 0.42,
                H =
                  y *
                  (ae
                    ? 1.02 + Math.random() * 0.34
                    : A
                      ? 1.05 + Math.random() * 0.3
                      : b
                        ? 0.76 + Math.random() * 0.34
                        : 0.44 + Math.random() * 0.28);
              (o({ x: z, y: W, tilt: H }),
                b && U(u, 0.16 + Math.random() * 0.06),
                b &&
                  Math.random() < (G ? 0.46 : 0.22) &&
                  window.setTimeout(() => N({ doubleBlink: !1 }), G ? 80 : 140),
                m(
                  () => ({
                    x: v + (Math.random() * (G ? 1.2 : 0.8) - (G ? 0.6 : 0.4)),
                    y:
                      w +
                      (Math.random() * (G ? 0.75 : 0.5) - (G ? 0.38 : 0.25)),
                  }),
                  {
                    overshoot: G ? 0.1 : 0.065,
                    settleMs: G ? 160 : 200,
                    staggerMs: G ? 16 : 12,
                  },
                ),
                (a.gazeShiftTimerId = window.setTimeout(() => {
                  (D(), a.isLiveMotionEnabled ? J() : (a.gazeShiftTimerId = 0));
                }, u)));
            }, c)));
        };
      J();
    }
    function I() {
      e.irises.forEach((O) => {
        O.backgroundOffset = { x: 0, y: 0 };
      });
      let _ = () => {
          (e.irises.forEach((O) => {
            if (!O.isDragging) {
              let D = a.isLiveMotionEnabled ? 0.62 : 0.4,
                U = a.isLiveMotionEnabled ? 0.52 : 0.4,
                J = parseFloat((Math.random() * D - D / 2).toFixed(2)),
                G = parseFloat((Math.random() * U - U / 2).toFixed(2));
              ((O.backgroundOffset = { x: J, y: G }), r(O));
            }
          }),
            i());
        },
        x = () => {
          let O = 170 + Math.random() * 95;
          a.backgroundJitterIntervalId = window.setTimeout(() => {
            (_(), x());
          }, O);
        };
      x();
    }
    function E(_) {
      let x = Math.max(0, Math.min(100, a.nystagmusLevel)) / 100;
      if (x <= 0) return;
      let { direction: O, wave: D, rate: U } = L(),
        J = { slow: 1.05, med: 1.75, fast: 2.45 },
        G = x * 9.2,
        c = G * 0.58,
        b = (_ / 1e3) * J[U],
        u = b * Math.PI * 2,
        y = b % 1,
        v = !1;
      (e.irises.forEach((w) => {
        if (w.isDragging) return;
        let z = 0,
          W = 0;
        D === "pendular"
          ? ((z = G * Math.sin(u)),
            O === "mixed" && (W = c * Math.sin(u + Math.PI / 2)))
          : ((z =
              y < 0.75
                ? -G + (y / 0.75) * (2 * G)
                : G - ((y - 0.75) / 0.25) * (2 * G)),
            O === "mixed" && (W = z >= 0 ? c : -c));
        let Z = O === "vertical" ? 0 : z,
          ae = O === "horizontal" ? 0 : O === "vertical" ? z : W,
          A = w.nystagmusOffset || { x: 0, y: 0 };
        (Math.abs(A.x - Z) > 0.02 || Math.abs(A.y - ae) > 0.02) &&
          ((w.nystagmusOffset = {
            x: parseFloat(Z.toFixed(2)),
            y: parseFloat(ae.toFixed(2)),
          }),
          r(w),
          (v = !0));
      }),
        v && t(!1));
    }
    function M() {
      if (a.nystagmusRafId) return;
      let _ = (x) => {
        (E(x),
          a.nystagmusLevel > 0
            ? (a.nystagmusRafId = requestAnimationFrame(_))
            : (a.nystagmusRafId = 0));
      };
      a.nystagmusRafId = requestAnimationFrame(_);
    }
    function N({ doubleBlink: _ = !1 } = {}) {
      a.lastBlinkAtMs = performance.now();
      let x = !!(a.isBabyMode && a.isLiveMotionEnabled),
        O = x && Math.random() < 0.26,
        D = x ? `height ${O ? 0.34 : 0.28}s ease-in` : "",
        U = x ? `height ${O ? 0.38 : 0.3}s ease-out` : "",
        J = O ? 560 + Math.random() * 520 : x ? 190 + Math.random() * 130 : 115;
      (e.eyes.forEach((G) => {
        let c = G.querySelector(".upper-eyelid"),
          b = G.querySelector(".lower-eyelid");
        (c &&
          (c.blinkTimerId && window.clearTimeout(c.blinkTimerId),
          (c.dataset.isBlinking = "true"),
          (c.style.transition = D),
          (c.style.height = `${G.clientHeight * 0.7}px`)),
          b &&
            (b.blinkTimerId && window.clearTimeout(b.blinkTimerId),
            (b.style.transition = D),
            (b.style.height = `${G.clientHeight * 0.3}px`)));
        let u = window.setTimeout(() => {
          (c &&
            (delete c.dataset.isBlinking,
            (c.blinkTimerId = 0),
            (c.style.transition = U),
            (c.style.height = d(c)),
            window.setTimeout(
              () => {
                c.dataset.isBlinking !== "true" && (c.style.transition = "");
              },
              x ? 440 : 0,
            )),
            b &&
              ((b.blinkTimerId = 0),
              (b.style.transition = U),
              (b.style.height = "0px"),
              window.setTimeout(
                () => {
                  b.blinkTimerId || (b.style.transition = "");
                },
                x ? 440 : 0,
              )));
        }, J);
        (c && (c.blinkTimerId = u), b && (b.blinkTimerId = u));
      }),
        _ && !O && setTimeout(() => N({ doubleBlink: !1 }), x ? 320 : 210));
    }
    function k() {
      let _ = a.isBabyMode && a.isLiveMotionEnabled,
        x = _ ? 2800 + Math.random() * 3200 : 4200 + Math.random() * 3300;
      a.blinkIntervalId = window.setTimeout(() => {
        (N({ doubleBlink: Math.random() < (_ ? 0.1 : 0.14) }), k());
      }, x);
    }
    function R() {
      (a.blinkIntervalId &&
        (window.clearTimeout(a.blinkIntervalId), (a.blinkIntervalId = 0)),
        he() || k());
    }
    function p() {
      he() ||
        (a.microSaccadeIntervalId || S(),
        a.backgroundJitterIntervalId || I(),
        a.blinkIntervalId || k(),
        a.isLiveMotionEnabled && !a.gazeShiftTimerId && C(),
        a.nystagmusLevel > 0 && M());
    }
    function h({ includeNystagmus: _ = !0 } = {}) {
      let x = !1;
      (e.irises.forEach((O) => {
        (O.gazeSettleTimerId &&
          (window.clearTimeout(O.gazeSettleTimerId), (O.gazeSettleTimerId = 0)),
          O.gazeStartTimerId &&
            (window.clearTimeout(O.gazeStartTimerId),
            (O.gazeStartTimerId = 0)));
        let D = O.nystagmusOffset || { x: 0, y: 0 },
          U = O.microOffset || { x: 0, y: 0 },
          J = O.backgroundOffset || { x: 0, y: 0 },
          G = O.gazeOffset || { x: 0, y: 0 };
        (Math.abs(U.x) > 0.02 ||
          Math.abs(U.y) > 0.02 ||
          Math.abs(J.x) > 0.02 ||
          Math.abs(J.y) > 0.02 ||
          Math.abs(G.x) > 0.02 ||
          Math.abs(G.y) > 0.02 ||
          (_ && (Math.abs(D.x) > 0.02 || Math.abs(D.y) > 0.02))) &&
          ((O.microOffset = { x: 0, y: 0 }),
          (O.backgroundOffset = { x: 0, y: 0 }),
          (O.gazeOffset = { x: 0, y: 0 }),
          _ && (O.nystagmusOffset = { x: 0, y: 0 }),
          r(O),
          (x = !0));
      }),
        x && t(!0));
    }
    function B(_) {
      let x = Number.isFinite(_) ? _ : parseInt(_, 10);
      Number.isNaN(x) ||
        ((a.nystagmusLevel = Math.max(0, Math.min(100, x))),
        a.nystagmusLevel > 0 && (M(), t(!1)),
        a.nystagmusLevel === 0 && h({ includeNystagmus: !0 }));
    }
    function P({ direction: _, wave: x, rate: O } = {}) {
      (_ &&
        (a.nystagmusDirection = ["horizontal", "vertical", "mixed"].includes(_)
          ? _
          : a.nystagmusDirection),
        x &&
          (a.nystagmusWave = ["jerk", "pendular"].includes(x)
            ? x
            : a.nystagmusWave),
        O &&
          (a.nystagmusRate = ["slow", "med", "fast"].includes(O)
            ? O
            : a.nystagmusRate),
        a.nystagmusLevel > 0 && (M(), t(!1)));
    }
    function F(_) {
      B(_ ? 60 : 0);
    }
    function j(_) {
      ((a.isLiveMotionEnabled = !!_),
        !a.isLiveMotionEnabled &&
          a.gazeShiftTimerId &&
          (clearTimeout(a.gazeShiftTimerId), (a.gazeShiftTimerId = 0)),
        a.isLiveMotionEnabled || (g(), l()),
        f(),
        h({ includeNystagmus: !1 }),
        a.isBabyMode && R(),
        p());
    }
    return {
      blinkOnce: () => N({ doubleBlink: !1 }),
      setLiveMotionEnabled: j,
      setNystagmusConfig: P,
      setNystagmusEnabled: F,
      setNystagmusLevel: B,
      resetBlinkSchedule: R,
      startAmbientAnimations: p,
    };
  }
  function Ut({
    draggable: e,
    state: t,
    applyIrisLayoutPosition: a,
    applyPupilFill: r,
    getBrightenedDragFillValue: o,
    notifyEyeGeometryChange: l,
    syncDeviationDrivenReflexBoost: i,
  }) {
    let s = !1,
      d = e.closest(".eye"),
      g,
      f,
      m,
      L,
      S,
      C = 1,
      I = 1;
    function E() {
      (document.removeEventListener("touchmove", k),
        document.removeEventListener("touchend", R),
        document.removeEventListener("touchcancel", R),
        document.removeEventListener("mousemove", k),
        document.removeEventListener("mouseup", R));
    }
    function M() {
      ((s = !1), (e.isDragging = !1), E());
    }
    function N(p) {
      if (!t.isManualEyeMoveEnabled || t.isTestMode) return;
      (p.preventDefault(),
        (s = !0),
        (e.isDragging = !0),
        (g = d.getBoundingClientRect()));
      let h = e.getBoundingClientRect();
      ((f = g.left + g.width / 2),
        (m = g.top + g.height / 2),
        (C = d.offsetWidth > 0 ? g.width / d.offsetWidth : 1),
        (I = d.offsetHeight > 0 ? g.height / d.offsetHeight : 1),
        (L = (g.width / 2 - h.width / 2) * 0.8),
        (S = 30 * I * 0.8),
        p.type === "touchstart"
          ? (document.addEventListener("touchmove", k, { passive: !1 }),
            document.addEventListener("touchend", R),
            document.addEventListener("touchcancel", R))
          : (document.addEventListener("mousemove", k),
            document.addEventListener("mouseup", R)));
    }
    function k(p) {
      if (!s) return;
      if (!t.isManualEyeMoveEnabled || t.isTestMode) {
        M();
        return;
      }
      let h, B;
      p.type === "touchmove"
        ? ((h = p.touches[0].clientX), (B = p.touches[0].clientY))
        : ((h = p.clientX), (B = p.clientY));
      let P = h - f,
        F = B - m;
      (Math.abs(P) > L && (P = Math.sign(P) * L),
        Math.abs(F) > S && (F = Math.sign(F) * S));
      let j = C > 0 ? P / C : P,
        _ = I > 0 ? F / I : F;
      if (
        ((e.manualOffset = { x: j, y: _ }), a(e), e.querySelector(".pupil"))
      ) {
        let O = i(e);
        r(e, o(O));
      }
      l({ includePosition: !0, immediate: !0 });
    }
    function R() {
      M();
    }
    ((e.cancelManualDrag = M),
      e.addEventListener("mousedown", N),
      e.addEventListener("touchstart", N, { passive: !1 }));
  }
  function qt({ slider: e, notifyEyeGeometryChange: t }) {
    function a() {
      let o = e.getAttribute("data-eye"),
        l = document.querySelector(`.eye[data-eye="${o}"]`);
      if (!l) return;
      let i = l.querySelector(".pupil"),
        s = parseInt(e.value, 10);
      ((i.dataset.baseSizePx = String(s)),
        (i.style.width = `${s}px`),
        (i.style.height = `${s}px`),
        (i.style.left = `calc(50% - ${s / 2}px)`),
        (i.style.top = `calc(50% - ${s / 2}px)`),
        t(!1));
    }
    function r() {
      let i = parseInt(e.value, 10);
      Math.abs(i - 32) <= 3 && ((e.value = 32), a());
    }
    (e.addEventListener("input", a),
      e.addEventListener("change", r),
      e.addEventListener("mouseup", r),
      e.addEventListener("touchend", r),
      a());
  }
  function Yt({ eyelidSliders: e, notifyEyeGeometryChange: t }) {
    e.forEach((a) => {
      a.addEventListener("input", () => {
        let r = a.getAttribute("data-eye"),
          o = document.querySelector(`.eye[data-eye="${r}"]`);
        if (!o) return;
        let l = o.querySelector(".upper-eyelid");
        if (l) {
          let i = `${a.value * 1.5}px`;
          ((l.dataset.restingHeightPx = i),
            l.dataset.isBlinking !== "true" &&
              !l.dataset.gazeLidDroopHeightPx &&
              (l.style.height = i));
        }
        t(!1);
      });
    });
  }
  var zi = {
      r: Math.round(218 * 0.7),
      g: Math.round(58 * 0.7),
      b: Math.round(0 * 0.7),
    },
    Ve = "zero";
  var ze = new Set(["low-cylinder", "high-cylinder"]),
    $t = new Set([...ze, "small-scissors", "keratoconus", "corneal-scar"]);
  var n = {
      ACG: "acg",
      ANIRIDIA: "aniridia",
      APHAKIA: "aphakia",
      ANISOMETROPIA: "anisometropia",
      BIG_CORTICAL_CATARACT: "big-cortical-cataract",
      BILATERAL_BLUE_NORMAL: "bilateral-blue-normal",
      BILATERAL_POOR_TEAR_FILM: "bilateral-poor-tear-film",
      BILATERAL_DULL_REFLEX: "bilateral-dull-reflex",
      BILATERAL_DENSE_CATARACT: "bilateral-dense-cataract",
      BILATERAL_ANIRIDIA: "bilateral-aniridia",
      BILATERAL_HIGH_HYPERMETROPIA: "bilateral-high-hypermetropia",
      BILATERAL_KERATOCONUS: "bilateral-keratoconus",
      BILATERAL_MYOPIA: "bilateral-myopia",
      BILATERAL_SMALL_PUPILS: "bilateral-small-pupils",
      BILATERAL_SUBCAPSULAR_CATARACT: "bilateral-subcapsular-cataract",
      CENTRAL_SUB_CORTICAL_CATARACT: "central-sub-cortical-cataract",
      CORNEAL_SCAR: "corneal-scar",
      DENSE_CATARACT: "dense-cataract",
      FLOATERS: "floaters",
      HIGH_CYLINDER: "high-cylinder",
      HIGH_MINUS: "high-minus",
      HIGH_PLUS: "high-plus",
      KERATOCONUS: "keratoconus",
      IRIDOCYCLITIS_KPS: "iridocyclitis-kps",
      IRIS_TRANSILLUMINATION: "iris-transillumination",
      LEUCOCORIA: "leucocoria",
      MINUS: "minus",
      NASAL_COLOBOMA: "nasal-coloboma",
      NORMAL_DARK: "normal-dark",
      NORMAL_HYPER: "normal-hyper",
      PARTIAL_RETINAL_DETACHMENT: "partial-retinal-detachment",
      POSTERIOR_CAPSULAR_THICKENING: "posterior-capsular-thickening",
      POSTERIOR_POLE_CATARACT: "posterior-pole-cataract",
      PLUS: "plus",
      POOR_TEAR_FILM: "poor-tear-film",
      RIGHT_COLOBOMA_LEFT_NORMAL: "right-coloboma-left-normal",
      RIGHT_ACG_LEFT_NORMAL: "right-acg-left-normal",
      RIGHT_BIG_CORTICAL_LEFT_SMALL_CORTICAL:
        "right-big-cortical-left-small-cortical",
      RIGHT_HYPER_LEFT_POSTERIOR_POLE: "right-hyper-left-posterior-pole",
      RIGHT_HYPER_LEFT_MYOPIA: "right-hyper-left-myopia",
      RIGHT_IRIDOCYCLITIS_LEFT_NORMAL: "right-iridocyclitis-left-normal",
      RIGHT_IRIS_TRANSILLUMINATION_LEFT_NORMAL:
        "right-iris-transillumination-left-normal",
      RIGHT_IOL_LEFT_POSTERIOR_CAPSULAR_THICKENING:
        "right-iol-left-posterior-capsular-thickening",
      RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR:
        "right-large-exotropia-left-corneal-scar",
      RIGHT_APHAKIA_LEFT_NORMAL: "right-aphakia-left-normal",
      RIGHT_FLOATERS_LEFT_NORMAL: "right-floaters-left-normal",
      RIGHT_NORMAL_LEFT_ANISOCORIA: "right-normal-left-anisocoria",
      RIGHT_NORMAL_LEFT_CORNEAL_OPACITY: "right-normal-left-corneal-opacity",
      RIGHT_NORMAL_LEFT_SUBLUXATED_LENS: "right-normal-left-subluxated-lens",
      RIGHT_RETINAL_DETACHMENT_LEFT_NORMAL:
        "right-retinal-detachment-left-normal",
      RIGHT_RETINOBLASTOMA_LEFT_NORMAL: "right-retinoblastoma-left-normal",
      RIGHT_NORMAL_LEFT_LARGE_ESOTROPIA: "right-normal-left-large-esotropia",
      RIGHT_VITREOUS_HAEMORRHAGE_LEFT_NORMAL:
        "right-vitreous-haemorrhage-left-normal",
      SMALL_CORTICAL_CATARACT: "small-cortical-cataract",
      SMALL_PUPILS: "small-pupils",
      SMALL_SCISSORS: "small-scissors",
      TECHNIQUE_CHILD_LOOKING_AWAY: "technique-child-looking-away",
      TECHNIQUE_UPPER_LID_BLOCKING: "technique-upper-lid-blocking",
      VITREOUS_HAEMORRHAGE: "vitreous-haemorrhage",
      ZERO: Ve,
    },
    Ke =
      "radial-gradient(ellipse 72% 62% at 50% 50%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.52) 28%, rgba(255, 255, 255, 0.16) 56%, rgba(255, 255, 255, 0.04) 72%, rgba(255, 255, 255, 0) 84%)";
  function Xe(e, t) {
    return Math.floor(Math.random() * (t - e + 1)) + e;
  }
  function We(e, t) {
    return Math.random() * (t - e) + e;
  }
  function xr(e, t) {
    let a = Math.abs(e - t) % 360;
    return a > 180 ? 360 - a : a;
  }
  function oe(e) {
    let t = e ? Xe(4, 5) : Xe(4, 4),
      a = e ? 22 : 26,
      r = [],
      o = 0;
    for (; r.length < t && o < 500; ) {
      let l = Xe(0, 359);
      (r.some((s) => xr(s, l) < a) || r.push(l), (o += 1));
    }
    for (; r.length < t; ) r.push(Xe(0, 359));
    return {
      wedges: r.map((l) => ({
        angleDeg: l,
        opacity: e ? We(0.86, 0.96) : We(0.8, 0.9),
        widthDeg: e ? We(32, 44) : We(24, 34),
      })),
    };
  }
  function Or(e) {
    let t = e % 360;
    return t < 0 ? t + 360 : t;
  }
  function Ze(e) {
    return e.wedges.map((t) => {
      let a = Or(t.angleDeg - t.widthDeg * 0.5),
        r = t.widthDeg.toFixed(1),
        o = t.opacity.toFixed(2);
      return `
      conic-gradient(
        from ${a.toFixed(1)}deg at 50% 50%,
        rgba(0, 0, 0, ${o}) 0deg,
        rgba(0, 0, 0, ${o}) ${r}deg,
        rgba(0, 0, 0, 0) ${r}deg,
        rgba(0, 0, 0, 0) 360deg
      )`;
    }).join(`,
`);
  }
  var Me = {
    ACG: "acg",
    ANIRIDIA: "aniridia",
    APHAKIA: "aphakia",
    ANISOMETROPIA: "anisometropia",
    BIG_CORTICAL_CATARACT: "big-cortical-cataract",
    BILATERAL_BLUE_NORMAL: "bilateral-blue-normal",
    BILATERAL_POOR_TEAR_FILM: "bilateral-poor-tear-film",
    BILATERAL_DULL_REFLEX: "bilateral-dull-reflex",
    BILATERAL_DENSE_CATARACT: "bilateral-dense-cataract",
    BILATERAL_ANIRIDIA: "bilateral-aniridia",
    BILATERAL_HIGH_HYPERMETROPIA: "bilateral-high-hypermetropia",
    BILATERAL_KERATOCONUS: "bilateral-keratoconus",
    BILATERAL_MYOPIA: "bilateral-myopia",
    BILATERAL_SMALL_PUPILS: "bilateral-small-pupils",
    BILATERAL_SUBCAPSULAR_CATARACT: "bilateral-subcapsular-cataract",
    CENTRAL_SUB_CORTICAL_CATARACT: "central-sub-cortical-cataract",
    CORNEAL_SCAR: "corneal-scar",
    DENSE_CATARACT: "dense-cataract",
    FLOATERS: "floaters",
    HIGH_CYLINDER: "high-cylinder",
    HIGH_MINUS: "high-minus",
    HIGH_PLUS: "high-plus",
    KERATOCONUS: "keratoconus",
    IRIDOCYCLITIS_KPS: "iridocyclitis-kps",
    IRIS_TRANSILLUMINATION: "iris-transillumination",
    LEUCOCORIA: "leucocoria",
    MINUS: "minus",
    NASAL_COLOBOMA: "nasal-coloboma",
    NORMAL_DARK: "normal-dark",
    NORMAL_HYPER: "normal-hyper",
    PARTIAL_RETINAL_DETACHMENT: "partial-retinal-detachment",
    POSTERIOR_CAPSULAR_THICKENING: "posterior-capsular-thickening",
    POSTERIOR_POLE_CATARACT: "posterior-pole-cataract",
    PLUS: "plus",
    POOR_TEAR_FILM: "poor-tear-film",
    RIGHT_COLOBOMA_LEFT_NORMAL: "right-coloboma-left-normal",
    RIGHT_ACG_LEFT_NORMAL: "right-acg-left-normal",
    RIGHT_BIG_CORTICAL_LEFT_SMALL_CORTICAL:
      "right-big-cortical-left-small-cortical",
    RIGHT_HYPER_LEFT_POSTERIOR_POLE: "right-hyper-left-posterior-pole",
    RIGHT_HYPER_LEFT_MYOPIA: "right-hyper-left-myopia",
    RIGHT_IRIDOCYCLITIS_LEFT_NORMAL: "right-iridocyclitis-left-normal",
    RIGHT_IRIS_TRANSILLUMINATION_LEFT_NORMAL:
      "right-iris-transillumination-left-normal",
    RIGHT_IOL_LEFT_POSTERIOR_CAPSULAR_THICKENING:
      "right-iol-left-posterior-capsular-thickening",
    RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR:
      "right-large-exotropia-left-corneal-scar",
    RIGHT_APHAKIA_LEFT_NORMAL: "right-aphakia-left-normal",
    RIGHT_FLOATERS_LEFT_NORMAL: "right-floaters-left-normal",
    RIGHT_NORMAL_LEFT_ANISOCORIA: "right-normal-left-anisocoria",
    RIGHT_NORMAL_LEFT_CORNEAL_OPACITY: "right-normal-left-corneal-opacity",
    RIGHT_NORMAL_LEFT_SUBLUXATED_LENS: "right-normal-left-subluxated-lens",
    RIGHT_RETINAL_DETACHMENT_LEFT_NORMAL:
      "right-retinal-detachment-left-normal",
    RIGHT_RETINOBLASTOMA_LEFT_NORMAL: "right-retinoblastoma-left-normal",
    RIGHT_NORMAL_LEFT_LARGE_ESOTROPIA: "right-normal-left-large-esotropia",
    RIGHT_VITREOUS_HAEMORRHAGE_LEFT_NORMAL:
      "right-vitreous-haemorrhage-left-normal",
    SMALL_CORTICAL_CATARACT: "small-cortical-cataract",
    SMALL_PUPILS: "small-pupils",
    SMALL_SCISSORS: "small-scissors",
    TECHNIQUE_CHILD_LOOKING_AWAY: "technique-child-looking-away",
    TECHNIQUE_UPPER_LID_BLOCKING: "technique-upper-lid-blocking",
    VITREOUS_HAEMORRHAGE: "vitreous-haemorrhage",
    ZERO: Ve,
  };
  var Vt = Object.freeze({
      minimumFactor: 0.12,
      fadeDistanceRatio: 1.35,
      softness: 1.15,
    }),
    Se = Object.freeze({
      brightnessFloor: 0.4,
      blurBoostPx: 0.5,
      opacityFloor: 0.25,
    });
  function Mr({
    probeOffsetX: e,
    probeOffsetY: t,
    pupilRadiusPx: a,
    profile: r = Vt,
  }) {
    let o = Math.hypot(e, t),
      l = a,
      { minimumFactor: i, fadeDistanceRatio: s, softness: d } = r;
    if (o <= l) return 1;
    let g = Math.max(1.5, a * s),
      f = o - l,
      m = Math.max(0, Math.min(1, f / g)),
      L = m * m * (3 - 2 * m);
    return 1 - Math.pow(L, d) * (1 - Math.max(0, i));
  }
  function Qe(e) {
    let t = Math.max(0, Math.min(100, e)) / 100;
    return {
      brightnessScale: 1 - t * 0.24,
      blurBoostPx: t * 0.8,
      opacityScale: 1 - t * 0.55,
    };
  }
  function je({ probeOffsetX: e, probeOffsetY: t, pupilRadiusPx: a }) {
    let r = Mr({
      probeOffsetX: e,
      probeOffsetY: t,
      pupilRadiusPx: a,
      profile: Vt,
    });
    return {
      edgeBlurBoostPx: (1 - r) * Se.blurBoostPx,
      edgeBrightnessScale: Se.brightnessFloor + r * (1 - Se.brightnessFloor),
      edgeOpacityScale: Se.opacityFloor + r * (1 - Se.opacityFloor),
    };
  }
  function re(e) {
    let t = e === n.ACG,
      a = e === n.ANIRIDIA,
      r = e === n.APHAKIA,
      o = ze.has(e),
      l = e === n.SMALL_SCISSORS,
      i = e === n.KERATOCONUS,
      s = e === n.CORNEAL_SCAR,
      d = e === n.DENSE_CATARACT,
      g = e === n.FLOATERS,
      f = e === n.ANISOMETROPIA,
      m = e === n.IRIS_TRANSILLUMINATION,
      L = e === n.IRIDOCYCLITIS_KPS,
      S = e === n.LEUCOCORIA,
      C = e === n.NASAL_COLOBOMA,
      I = e === n.NORMAL_DARK,
      E = e === n.PARTIAL_RETINAL_DETACHMENT,
      M = e === n.POSTERIOR_CAPSULAR_THICKENING,
      N = e === n.POOR_TEAR_FILM,
      k = e === n.RIGHT_COLOBOMA_LEFT_NORMAL,
      R = e === n.RIGHT_ACG_LEFT_NORMAL,
      p = e === n.RIGHT_BIG_CORTICAL_LEFT_SMALL_CORTICAL,
      h = e === n.RIGHT_HYPER_LEFT_POSTERIOR_POLE,
      B = e === n.RIGHT_HYPER_LEFT_MYOPIA,
      P = e === n.RIGHT_IRIDOCYCLITIS_LEFT_NORMAL,
      F = e === n.RIGHT_IRIS_TRANSILLUMINATION_LEFT_NORMAL,
      j = e === n.RIGHT_IOL_LEFT_POSTERIOR_CAPSULAR_THICKENING,
      _ = e === n.RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR,
      x = e === n.RIGHT_APHAKIA_LEFT_NORMAL,
      O = e === n.RIGHT_FLOATERS_LEFT_NORMAL,
      D = e === n.RIGHT_NORMAL_LEFT_ANISOCORIA,
      U = e === n.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY,
      J = e === n.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS,
      G = e === n.RIGHT_RETINAL_DETACHMENT_LEFT_NORMAL,
      c = e === n.RIGHT_RETINOBLASTOMA_LEFT_NORMAL,
      b = e === n.RIGHT_NORMAL_LEFT_LARGE_ESOTROPIA,
      u = e === n.RIGHT_VITREOUS_HAEMORRHAGE_LEFT_NORMAL,
      y = e === n.TECHNIQUE_CHILD_LOOKING_AWAY,
      v = e === n.TECHNIQUE_UPPER_LID_BLOCKING,
      w = e === n.SMALL_CORTICAL_CATARACT,
      z = e === n.SMALL_PUPILS,
      W = e === n.BIG_CORTICAL_CATARACT,
      Z = e === n.BILATERAL_BLUE_NORMAL,
      ae = e === n.BILATERAL_POOR_TEAR_FILM,
      A = e === n.BILATERAL_DULL_REFLEX,
      H = e === n.BILATERAL_DENSE_CATARACT,
      V = e === n.BILATERAL_ANIRIDIA,
      K = e === n.BILATERAL_HIGH_HYPERMETROPIA,
      Q = e === n.BILATERAL_KERATOCONUS,
      T = e === n.BILATERAL_MYOPIA,
      Y = e === n.BILATERAL_SMALL_PUPILS,
      $ = e === n.BILATERAL_SUBCAPSULAR_CATARACT,
      q = e === n.CENTRAL_SUB_CORTICAL_CATARACT,
      te = e === n.POSTERIOR_POLE_CATARACT,
      ee = e === n.VITREOUS_HAEMORRHAGE;
    return {
      acgCase: t,
      aniridiaCase: a,
      aphakiaCase: r,
      anisometropiaCase: f,
      bigCorticalCataractCase: W,
      bilateralBlueNormalCase: Z,
      bilateralPoorTearFilmCase: ae,
      bilateralDullReflexCase: A,
      bilateralDenseCataractCase: H,
      bilateralAniridiaCase: V,
      bilateralHighHypermetropiaCase: K,
      bilateralKeratoconusCase: Q,
      bilateralMyopiaCase: T,
      bilateralSmallPupilsCase: Y,
      bilateralSubcapsularCataractCase: $,
      centralSubCorticalCataractCase: q,
      cornealScarCase: s,
      corticalCataractCase: w || W,
      cylinderCase: o,
      denseCataractCase: d,
      floatersCase: g,
      iridocyclitisKpsCase: L,
      irisTransilluminationCase: m,
      keratoconusCase: i,
      leucocoriaCase: S,
      nasalColobomaCase: C,
      normalDarkCase: I,
      partialRetinalDetachmentCase: E,
      posteriorCapsularThickeningCase: M,
      posteriorPoleCataractCase: te,
      poorTearFilmCase: N,
      rightAcgLeftNormalCase: R,
      rightColobomaLeftNormalCase: k,
      rightBigCorticalLeftSmallCorticalCase: p,
      rightHyperLeftPosteriorPoleCase: h,
      rightHyperLeftMyopiaCase: B,
      rightIridocyclitisLeftNormalCase: P,
      rightIrisTransilluminationLeftNormalCase: F,
      rightIolLeftPosteriorCapsularThickeningCase: j,
      rightLargeExotropiaLeftCornealScarCase: _,
      rightAphakiaLeftNormalCase: x,
      rightFloatersLeftNormalCase: O,
      rightNormalLeftAnisocoriaCase: D,
      rightNormalLeftCornealOpacityCase: U,
      rightNormalLeftSubluxatedLensCase: J,
      rightRetinalDetachmentLeftNormalCase: G,
      rightRetinoblastomaLeftNormalCase: c,
      rightNormalLeftLargeEsotropiaCase: b,
      rightVitreousHaemorrhageLeftNormalCase: u,
      scissorsCase: l,
      smallCorticalCataractCase: w,
      smallPupilsCase: z,
      techniqueChildLookingAwayCase: y,
      techniqueUpperLidBlockingCase: v,
      vitreousHaemorrhageCase: ee,
    };
  }
  function gt(e, t) {
    return e === n.ANISOMETROPIA
      ? t === "left"
        ? n.PLUS
        : n.MINUS
      : e === n.ACG
        ? n.ZERO
        : e === n.ANIRIDIA
          ? n.ZERO
          : e === n.BILATERAL_ANIRIDIA
            ? n.ANIRIDIA
            : e === n.BILATERAL_BLUE_NORMAL
              ? n.ZERO
              : e === n.BILATERAL_POOR_TEAR_FILM
                ? n.POOR_TEAR_FILM
                : e === n.BILATERAL_DULL_REFLEX
                  ? n.ZERO
                  : e === n.IRIS_TRANSILLUMINATION
                    ? n.ZERO
                    : e === n.IRIDOCYCLITIS_KPS
                      ? n.ZERO
                      : e === n.NASAL_COLOBOMA
                        ? n.ZERO
                        : e === n.NORMAL_DARK
                          ? t === "right"
                            ? n.NORMAL_DARK
                            : n.ZERO
                          : e === n.RIGHT_COLOBOMA_LEFT_NORMAL
                            ? n.ZERO
                            : e === n.RIGHT_ACG_LEFT_NORMAL
                              ? n.ZERO
                              : e === n.RIGHT_RETINOBLASTOMA_LEFT_NORMAL
                                ? t === "left"
                                  ? n.LEUCOCORIA
                                  : n.ZERO
                                : e ===
                                    n.RIGHT_IRIS_TRANSILLUMINATION_LEFT_NORMAL
                                  ? n.ZERO
                                  : e ===
                                      n.RIGHT_IOL_LEFT_POSTERIOR_CAPSULAR_THICKENING
                                    ? t === "left"
                                      ? n.ZERO
                                      : n.POSTERIOR_CAPSULAR_THICKENING
                                    : e === n.RIGHT_NORMAL_LEFT_ANISOCORIA
                                      ? n.ZERO
                                      : e ===
                                          n.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY
                                        ? n.ZERO
                                        : e ===
                                            n.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS
                                          ? n.ZERO
                                          : e === n.RIGHT_APHAKIA_LEFT_NORMAL
                                            ? t === "left"
                                              ? n.APHAKIA
                                              : n.ZERO
                                            : e === n.RIGHT_FLOATERS_LEFT_NORMAL
                                              ? n.ZERO
                                              : e ===
                                                  n.RIGHT_VITREOUS_HAEMORRHAGE_LEFT_NORMAL
                                                ? n.ZERO
                                                : e ===
                                                    n.RIGHT_RETINAL_DETACHMENT_LEFT_NORMAL
                                                  ? t === "left"
                                                    ? n.PARTIAL_RETINAL_DETACHMENT
                                                    : n.ZERO
                                                  : e ===
                                                      n.BILATERAL_DENSE_CATARACT
                                                    ? n.DENSE_CATARACT
                                                    : e ===
                                                        n.RIGHT_BIG_CORTICAL_LEFT_SMALL_CORTICAL
                                                      ? t === "left"
                                                        ? n.BIG_CORTICAL_CATARACT
                                                        : n.SMALL_CORTICAL_CATARACT
                                                      : e ===
                                                          n.RIGHT_HYPER_LEFT_POSTERIOR_POLE
                                                        ? t === "left"
                                                          ? n.NORMAL_HYPER
                                                          : n.POSTERIOR_POLE_CATARACT
                                                        : e ===
                                                            n.RIGHT_HYPER_LEFT_MYOPIA
                                                          ? t === "left"
                                                            ? n.NORMAL_HYPER
                                                            : n.MINUS
                                                          : e ===
                                                              n.RIGHT_IRIDOCYCLITIS_LEFT_NORMAL
                                                            ? n.ZERO
                                                            : e ===
                                                                n.RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR
                                                              ? t === "left"
                                                                ? n.ZERO
                                                                : n.CORNEAL_SCAR
                                                              : e ===
                                                                  n.BILATERAL_HIGH_HYPERMETROPIA
                                                                ? n.NORMAL_HYPER
                                                                : e ===
                                                                    n.BILATERAL_MYOPIA
                                                                  ? n.MINUS
                                                                  : e ===
                                                                      n.BILATERAL_SMALL_PUPILS
                                                                    ? n.ZERO
                                                                    : e ===
                                                                        n.BILATERAL_SUBCAPSULAR_CATARACT
                                                                      ? n.CENTRAL_SUB_CORTICAL_CATARACT
                                                                      : e ===
                                                                          n.BILATERAL_KERATOCONUS
                                                                        ? n.KERATOCONUS
                                                                        : e ===
                                                                            n.RIGHT_NORMAL_LEFT_LARGE_ESOTROPIA
                                                                          ? n.ZERO
                                                                          : e ===
                                                                                n.TECHNIQUE_CHILD_LOOKING_AWAY ||
                                                                              e ===
                                                                                n.TECHNIQUE_UPPER_LID_BLOCKING
                                                                            ? n.ZERO
                                                                            : e ===
                                                                                n.POSTERIOR_CAPSULAR_THICKENING
                                                                              ? n.ZERO
                                                                              : e ===
                                                                                  n.SMALL_PUPILS
                                                                                ? n.ZERO
                                                                                : e;
  }
  function zt(e, t) {
    return e === n.RIGHT_COLOBOMA_LEFT_NORMAL
      ? re(t === "left" ? n.NASAL_COLOBOMA : n.ZERO)
      : e === n.RIGHT_IRIS_TRANSILLUMINATION_LEFT_NORMAL
        ? re(t === "left" ? n.IRIS_TRANSILLUMINATION : n.ZERO)
        : e === n.RIGHT_ACG_LEFT_NORMAL
          ? re(t === "left" ? n.ACG : n.ZERO)
          : e === n.RIGHT_IRIDOCYCLITIS_LEFT_NORMAL
            ? re(t === "left" ? n.IRIDOCYCLITIS_KPS : n.ZERO)
            : e === n.RIGHT_FLOATERS_LEFT_NORMAL
              ? re(t === "left" ? n.FLOATERS : n.ZERO)
              : e === n.RIGHT_VITREOUS_HAEMORRHAGE_LEFT_NORMAL
                ? re(t === "left" ? n.VITREOUS_HAEMORRHAGE : n.ZERO)
                : e === n.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY
                  ? re(n.ZERO)
                  : e === n.BILATERAL_SMALL_PUPILS
                    ? re(n.SMALL_PUPILS)
                    : e === n.BILATERAL_DULL_REFLEX
                      ? re(n.ZERO)
                      : e === n.BILATERAL_POOR_TEAR_FILM
                        ? re(n.POOR_TEAR_FILM)
                        : e === n.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS
                          ? re(n.ZERO)
                          : e === n.NORMAL_DARK ||
                              e === n.BILATERAL_BLUE_NORMAL ||
                              e === n.BILATERAL_POOR_TEAR_FILM ||
                              e === n.BILATERAL_ANIRIDIA ||
                              e === n.BILATERAL_DENSE_CATARACT ||
                              e === n.BILATERAL_HIGH_HYPERMETROPIA ||
                              e === n.BILATERAL_KERATOCONUS ||
                              e === n.BILATERAL_MYOPIA ||
                              e === n.BILATERAL_SUBCAPSULAR_CATARACT ||
                              e === n.RIGHT_ACG_LEFT_NORMAL ||
                              e === n.RIGHT_COLOBOMA_LEFT_NORMAL ||
                              e === n.RIGHT_BIG_CORTICAL_LEFT_SMALL_CORTICAL ||
                              e === n.RIGHT_HYPER_LEFT_MYOPIA ||
                              e === n.RIGHT_IRIDOCYCLITIS_LEFT_NORMAL ||
                              e === n.RIGHT_HYPER_LEFT_POSTERIOR_POLE ||
                              e ===
                                n.RIGHT_IOL_LEFT_POSTERIOR_CAPSULAR_THICKENING ||
                              e === n.RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR ||
                              e === n.RIGHT_APHAKIA_LEFT_NORMAL ||
                              e === n.RIGHT_FLOATERS_LEFT_NORMAL ||
                              e === n.RIGHT_NORMAL_LEFT_ANISOCORIA ||
                              e === n.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY ||
                              e === n.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS ||
                              e === n.RIGHT_RETINOBLASTOMA_LEFT_NORMAL ||
                              e === n.TECHNIQUE_CHILD_LOOKING_AWAY ||
                              e === n.TECHNIQUE_UPPER_LID_BLOCKING ||
                              e === n.RIGHT_RETINAL_DETACHMENT_LEFT_NORMAL ||
                              e === n.RIGHT_VITREOUS_HAEMORRHAGE_LEFT_NORMAL
                            ? re(gt(e, t))
                            : re(e);
  }
  function Kt(e, t) {
    return e === n.BILATERAL_BLUE_NORMAL ? De : t;
  }
  function Xt(e, t) {
    let { r: a, g: r, b: o } = Kt(e, t);
    return `rgb(${a}, ${r}, ${o})`;
  }
  function Wt({ currentRefraction: e, baseReflexColor: t, factor: a }) {
    let r = Ge(Kt(e, t), a);
    return `rgb(${r.r}, ${r.g}, ${r.b})`;
  }
  function Pr(e) {
    if (!e) return 1;
    let t = e.closest(".eye");
    if (!t) return 1;
    let a = e.caseOffset || { x: 0, y: 0 },
      r = e.manualOffset || { x: 0, y: 0 },
      o = a.x + r.x,
      l = a.y + r.y,
      i = Math.hypot(o, l),
      s = Math.max(1, (t.clientWidth / 2 - (e.offsetWidth || 80) / 2) * 0.8),
      d = 30 * 0.8,
      g = Math.max(1, Math.hypot(s, d));
    return 1 + Math.min(i / g, 1);
  }
  function mt(e) {
    if (!e) return;
    let t = e.caseOffset || { x: 0, y: 0 },
      a = e.manualOffset || { x: 0, y: 0 };
    (e.style.setProperty("--iris-layout-x", `${t.x + a.x}px`),
      e.style.setProperty("--iris-layout-y", `${t.y + a.y}px`));
  }
  function wr(e, t) {
    let a = e == null ? void 0 : e.closest(".eye");
    if (!a) return;
    let r = Math.max(1, t),
      o = 1 + (r - 1) * 1.25,
      l = 1 + (r - 1) * 0.45;
    (a.style.setProperty("--manual-drag-reflex-brightness-boost", o.toFixed(3)),
      a.style.setProperty("--manual-drag-reflex-opacity-boost", l.toFixed(3)),
      a.style.setProperty("--manual-drag-pupil-fill-factor", r.toFixed(3)));
  }
  function Je(e) {
    let t = Pr(e);
    return (wr(e, t), t);
  }
  function Zt(e, t) {
    return e === n.TECHNIQUE_CHILD_LOOKING_AWAY
      ? { x: 26, y: -2 }
      : e === n.RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR && t === "left"
        ? { x: -20, y: 0 }
        : e === n.RIGHT_NORMAL_LEFT_LARGE_ESOTROPIA && t === "right"
          ? { x: -20, y: 0 }
          : { x: 0, y: 0 };
  }
  function Qt(e) {
    let t = getComputedStyle(document.documentElement);
    switch (e) {
      case "light-brown":
        return t.getPropertyValue("--iris-light-brown").trim();
      case "green":
        return t.getPropertyValue("--iris-green").trim();
      case "blue":
        return t.getPropertyValue("--iris-blue").trim();
      case "dark-brown":
      default:
        return t.getPropertyValue("--iris-dark-brown").trim();
    }
  }
  function ht(e, t) {
    if (!e) return;
    let a = e.querySelector(".pupil");
    a && (a.style.background = t);
    let r = e.querySelector(".coloboma-extension");
    r && (r.style.background = t);
    let o = e.querySelector(".iris-transillumination-patch");
    o && (o.style.background = t);
  }
  function ft({ irises: e, isManualEyeMoveEnabled: t }) {
    e.forEach((a) => {
      a.classList.toggle("is-manual-drag-enabled", t);
    });
  }
  function pt({ eyesWrapper: e, isBabyMode: t }) {
    e == null || e.classList.toggle("is-baby-mode", t);
  }
  function Fr(e) {
    let t = Math.max(0, Math.min(100, e)) / 100,
      a = 1 - t * 0.72,
      r = 1 - t * 0.64,
      o = 1 - t * 0.18;
    return `brightness(${a.toFixed(2)}) saturate(${r.toFixed(2)}) contrast(${o.toFixed(2)})`;
  }
  function et({ irises: e, cataractLevel: t }) {
    let a = Fr(t);
    e.forEach((r) => {
      let o = r.querySelector(".pupil");
      o && (o.style.filter = a);
      let l = r.querySelector(".coloboma-extension");
      l && (l.style.filter = a);
      let i = r.querySelector(".iris-transillumination-patch");
      i && (i.style.filter = a);
    });
  }
  function jt(e) {
    var o, l, i, s, d, g, f, m;
    let t =
        (((o = e.gazeOffset) == null ? void 0 : o.x) || 0) +
        (((l = e.microOffset) == null ? void 0 : l.x) || 0) +
        (((i = e.backgroundOffset) == null ? void 0 : i.x) || 0) +
        (((s = e.nystagmusOffset) == null ? void 0 : s.x) || 0),
      a =
        (((d = e.gazeOffset) == null ? void 0 : d.y) || 0) +
        (((g = e.microOffset) == null ? void 0 : g.y) || 0) +
        (((f = e.backgroundOffset) == null ? void 0 : f.y) || 0) +
        (((m = e.nystagmusOffset) == null ? void 0 : m.y) || 0);
    e.style.transform = `translate(${t}px, ${a}px)`;
    let r = e.closest(".eye");
    r &&
      (r.style.setProperty(
        "--corneal-reflex-micro-x",
        `${(t * 0.08).toFixed(2)}px`,
      ),
      r.style.setProperty(
        "--corneal-reflex-micro-y",
        `${(a * 0.06).toFixed(2)}px`,
      ));
  }
  function Jt({ state: e, dom: t, onEyeGeometryChange: a }) {
    let l = Dt({
      dom: t,
      notifyEyeGeometryChange: i,
      state: e,
      updateIrisTransform: jt,
    });
    function i(E = !0) {
      let M =
        typeof E == "boolean"
          ? { includePosition: E, immediate: !1 }
          : {
              includePosition:
                (E == null ? void 0 : E.includePosition) === void 0
                  ? !0
                  : !!E.includePosition,
              immediate: !!(E != null && E.immediate),
            };
      typeof a == "function" && a(M);
    }
    function s({ includePosition: E = !0 } = {}) {
      (t.irises.forEach((M) => {
        var p;
        let N = (p = M.closest(".eye")) == null ? void 0 : p.dataset.eye,
          { x: k, y: R } = Zt(e.currentRefraction, N);
        ((M.caseOffset = { x: k, y: R }), mt(M), Je(M));
      }),
        i(E));
    }
    function d(E) {
      let N = String(E || "").trim() || "dark-brown",
        k = Qt(N);
      ((e.irisColour = N),
        t.irises.forEach((R) => {
          R.style.background = k;
        }));
    }
    function g(E) {
      let M =
        e.currentRefraction === n.BILATERAL_BLUE_NORMAL
          ? Xt(e.currentRefraction, e.baseReflexColor)
          : E;
      (t.irises.forEach((N) => {
        ht(N, M);
      }),
        et({ irises: t.irises, cataractLevel: e.cataractLevel }));
    }
    function f(E) {
      let M = Number.isFinite(E) ? E : parseInt(E, 10);
      Number.isNaN(M) ||
        ((e.cataractLevel = Math.max(0, Math.min(100, M))),
        et({ irises: t.irises, cataractLevel: e.cataractLevel }));
    }
    function m(E) {
      ((e.isManualEyeMoveEnabled = !!E),
        (!e.isManualEyeMoveEnabled || e.isTestMode) &&
          t.irises.forEach((M) => {
            typeof M.cancelManualDrag == "function" && M.cancelManualDrag();
          }),
        ft({
          irises: t.irises,
          isManualEyeMoveEnabled: e.isManualEyeMoveEnabled,
        }));
    }
    function L(E) {
      let M = !!E,
        N = e.isBabyMode;
      ((e.isBabyMode = M),
        t.irises.forEach((k) => {
          typeof k.cancelManualDrag == "function" && k.cancelManualDrag();
        }),
        pt({ eyesWrapper: t.eyesWrapper, isBabyMode: e.isBabyMode }),
        s({ includePosition: !0 }),
        N !== M && l.resetBlinkSchedule());
    }
    function S(E) {
      e.isDilatedMode = !!E;
      let M = e.isDilatedMode ? 46 : 32;
      (t.pupilSizeSliders.forEach((N) => {
        ((N.value = String(M)), N.dispatchEvent(new Event("input")));
      }),
        i({ includePosition: !0, immediate: !0 }));
    }
    function C() {
      s({ includePosition: !0 });
    }
    function I() {
      (t.irises.forEach((E) => {
        ((E.nystagmusOffset = { x: 0, y: 0 }),
          (E.caseOffset = { x: 0, y: 0 }),
          (E.manualOffset = { x: 0, y: 0 }),
          Je(E));
      }),
        t.irises.forEach((E) => {
          Ut({
            draggable: E,
            state: e,
            applyIrisLayoutPosition: mt,
            applyPupilFill: ht,
            getBrightenedDragFillValue: (M) =>
              Wt({
                currentRefraction: e.currentRefraction,
                baseReflexColor: e.baseReflexColor,
                factor: M,
              }),
            notifyEyeGeometryChange: i,
            syncDeviationDrivenReflexBoost: Je,
          });
        }),
        t.pupilSizeSliders.forEach((E) => {
          qt({ slider: E, notifyEyeGeometryChange: i });
        }),
        Yt({ eyelidSliders: t.eyelidSliders, notifyEyeGeometryChange: i }),
        et({ irises: t.irises, cataractLevel: e.cataractLevel }),
        ft({
          irises: t.irises,
          isManualEyeMoveEnabled: e.isManualEyeMoveEnabled,
        }),
        pt({ eyesWrapper: t.eyesWrapper, isBabyMode: e.isBabyMode }),
        d(e.irisColour),
        s({ includePosition: !1 }));
    }
    return {
      init: I,
      applyReflexColor: g,
      setBabyMode: L,
      setDilatedMode: S,
      setIrisColour: d,
      setCataractLevel: f,
      blinkOnce: l.blinkOnce,
      setLiveMotionEnabled: l.setLiveMotionEnabled,
      setManualEyeMoveEnabled: m,
      setNystagmusConfig: l.setNystagmusConfig,
      setNystagmusEnabled: l.setNystagmusEnabled,
      setNystagmusLevel: l.setNystagmusLevel,
      syncRefractionPose: C,
      startAmbientAnimations: l.startAmbientAnimations,
    };
  }
  var kr = [
    "button:not([disabled])",
    "[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");
  function ea(e, t) {
    if (!e) return;
    let a = parseInt(e.dataset.openModalCount || "0", 10),
      r = Math.max(0, a + (t ? 1 : -1));
    ((e.dataset.openModalCount = String(r)),
      e.classList.toggle("modal-open", r > 0));
  }
  function ta(e) {
    return e
      ? Array.from(e.querySelectorAll(kr)).filter(
          (t) =>
            t instanceof HTMLElement &&
            t.getAttribute("aria-hidden") !== "true" &&
            t.getClientRects().length > 0,
        )
      : [];
  }
  function ce({ body: e, modal: t, focusRoot: a, initialFocusElement: r }) {
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
    let o = !1,
      l = null;
    function i() {
      let f = ta(a || t),
        m = a || t,
        L = r || f[0] || m;
      L instanceof HTMLElement && L.focus();
    }
    function s({ restoreFocus: f = !0 } = {}) {
      o &&
        ((o = !1),
        (t.style.display = "none"),
        t.setAttribute("aria-hidden", "true"),
        ea(e, !1),
        f && l instanceof HTMLElement && document.contains(l) && l.focus());
    }
    function d({ triggerElement: f } = {}) {
      o ||
        ((l =
          f instanceof HTMLElement
            ? f
            : document.activeElement instanceof HTMLElement
              ? document.activeElement
              : null),
        (o = !0),
        (t.style.display = "block"),
        t.setAttribute("aria-hidden", "false"),
        ea(e, !0),
        requestAnimationFrame(() => {
          i();
        }));
    }
    function g({ triggerElement: f } = {}) {
      if (o) {
        s();
        return;
      }
      d({ triggerElement: f });
    }
    return (
      t.addEventListener("keydown", (f) => {
        if (!o) return;
        if (f.key === "Escape") {
          (f.preventDefault(), s());
          return;
        }
        if (f.key !== "Tab") return;
        let m = ta(a || t),
          L = a || t;
        if (!m.length) {
          (f.preventDefault(), L instanceof HTMLElement && L.focus());
          return;
        }
        let S = m[0],
          C = m[m.length - 1],
          I = document.activeElement;
        if (f.shiftKey && I === S) {
          (f.preventDefault(), C.focus());
          return;
        }
        !f.shiftKey && I === C && (f.preventDefault(), S.focus());
      }),
      {
        close: s,
        isOpen() {
          return o;
        },
        open: d,
        toggle: g,
      }
    );
  }
  function aa(e) {
    let {
      body: t,
      infoIcon: a,
      infoModal: r,
      infoModalContent: o,
      closeModal: l,
    } = e;
    if (!t || !a || !r || !o || !l) return;
    let i = ce({ body: t, focusRoot: o, initialFocusElement: l, modal: r });
    return (
      a.addEventListener("click", () => {
        (i.toggle({ triggerElement: a }),
          a.setAttribute("aria-expanded", String(i.isOpen())));
      }),
      l.addEventListener("click", () => {
        (i.close(), a.setAttribute("aria-expanded", "false"));
      }),
      r.addEventListener("click", (s) => {
        s.target === r && (i.close(), a.setAttribute("aria-expanded", "false"));
      }),
      r.addEventListener("keydown", (s) => {
        s.key === "Escape" && a.setAttribute("aria-expanded", "false");
      }),
      {
        close: ({ restoreFocus: s = !1 } = {}) => {
          (i.close({ restoreFocus: s }),
            a.setAttribute("aria-expanded", "false"));
        },
        isOpen: () => i.isOpen(),
      }
    );
  }
  var ra = {
      pdf: {
        filename: "fundal-reflex-universal-handout.pdf",
        title: "Fundal reflex handout PDF",
        type: "application/pdf",
        url: "assets/handouts/fundal-reflex-universal-handout.pdf",
      },
      image: {
        filename: "fundal-reflex-universal-handout.webp",
        title: "Fundal reflex handout image",
        type: "image/webp",
        url: "assets/handouts/fundal-reflex-universal-handout.webp",
      },
    },
    ia = [
      {
        id: "preparation",
        image: "assets/handouts/panels/preparation.webp?v=20260501-1",
        title: "Get a good view",
        text: "Dim light. Calm or swaddle. Start at arm's length, then move side to side and closer.",
      },
      {
        id: "looking-away",
        image: "assets/handouts/panels/looking-away.webp?v=20260501-1",
        title: "Looking away",
        text: "If the child is not looking, adjust and repeat before judging.",
        caseLinks: [
          { label: "Try case 3", value: "technique-child-looking-away" },
        ],
      },
      {
        id: "eyelids",
        image: "assets/handouts/panels/eyelids.webp?v=20260501-1",
        title: "Lids blocking",
        text: "If the pupil is partly covered, open gently and repeat.",
        caseLinks: [
          { label: "Try case 4", value: "technique-upper-lid-blocking" },
        ],
      },
      {
        id: "normal-variation",
        image: "assets/handouts/panels/normal-variation.webp?v=20260501-1",
        title: "Normal can vary",
        text: "In those with darker pigmentation, a normal reflex may look orange-yellow or blue-white. Bright, equal and round is reassuring.",
        caseLinks: [
          { label: "Case 1", value: "zero" },
          { label: "Case 2", value: "bilateral-blue-normal" },
        ],
      },
      {
        id: "unclear-repeat",
        image: "assets/handouts/panels/unclear-repeat.webp?v=20260501-1",
        title: "Unclear is active",
        text: "Do not guess. Improve the view, repeat or ask for help.",
      },
      {
        id: "ask-help",
        image: "assets/handouts/panels/ask-help.webp?v=20260501-1",
        title: "Ask for help",
        text: "A photo or another trained person can help decide repeat or refer.",
      },
      {
        id: "possible-findings",
        image: "assets/handouts/panels/possible-findings.webp?v=20260501-1",
        title: "Refer when abnormal",
        text: "White, dull, absent, black or very unequal reflexes may mean scar, cataract or haemorrhage.",
        caseLinks: [
          { label: "Try case 7", value: "right-retinoblastoma-left-normal" },
          { label: "Try case 5", value: "right-normal-left-large-esotropia" },
          { label: "Try case 8", value: "normal-dark" },
        ],
      },
    ];
  function Hr({ burgerIcon: e, sideMenu: t }, a) {
    t &&
      (t.classList.toggle("open", a),
      t.setAttribute("aria-hidden", String(!a)),
      a ? t.removeAttribute("inert") : t.setAttribute("inert", ""),
      e &&
        (e.setAttribute("aria-expanded", String(a)),
        e.setAttribute("aria-label", a ? "Close menu" : "Open menu")));
  }
  function Gr(e) {
    var i;
    let t = document.createElement("article");
    ((t.className = "learn-explain-card"), (t.dataset.learnPanelId = e.id));
    let a = document.createElement("img");
    ((a.className = "learn-explain-image"),
      (a.src = e.image),
      (a.alt = ""),
      (a.loading = "lazy"),
      (a.decoding = "async"),
      (a.draggable = !1));
    let r = document.createElement("div");
    r.className = "learn-explain-body";
    let o = document.createElement("h3");
    o.textContent = e.title;
    let l = document.createElement("p");
    if (
      ((l.textContent = e.text),
      r.append(o, l),
      (i = e.caseLinks) != null && i.length)
    ) {
      let s = document.createElement("div");
      ((s.className = "learn-case-actions"),
        e.caseLinks.forEach((d) => {
          let g = document.createElement("button");
          ((g.type = "button"),
            (g.className = "learn-case-button"),
            (g.dataset.caseValue = d.value),
            (g.textContent = d.label),
            s.appendChild(g));
        }),
        r.appendChild(s));
    }
    return (t.append(a, r), t);
  }
  function na({ panels: e, tabs: t }, a) {
    (t.forEach((r) => {
      let o = r.dataset.learnTab === a;
      (r.classList.toggle("is-active", o),
        r.setAttribute("aria-selected", String(o)));
    }),
      e.forEach((r) => {
        let o = r.dataset.learnPanel === a;
        ((r.hidden = !o), r.classList.toggle("is-active", o));
      }));
  }
  async function Dr(e, t) {
    if (!e) return;
    let a = new URL(e.url, window.location.href).href;
    if (!navigator.share) {
      t.textContent = "Sharing is not available here. Use download.";
      return;
    }
    try {
      if (
        window.location.protocol !== "file:" &&
        window.File &&
        navigator.canShare
      ) {
        let o = await (await fetch(e.url)).blob(),
          l = new File([o], e.filename, { type: e.type });
        if (navigator.canShare({ files: [l] })) {
          (await navigator.share({ files: [l], title: e.title }),
            (t.textContent = "Share sheet opened."));
          return;
        }
      }
      (await navigator.share({ title: e.title, url: a }),
        (t.textContent = "Share sheet opened."));
    } catch (r) {
      t.textContent =
        (r == null ? void 0 : r.name) === "AbortError"
          ? "Share cancelled."
          : "Sharing failed here. Use download.";
    }
  }
  function oa({ dom: e, onBeforeOpen: t, onSelectCase: a }) {
    let {
      body: r,
      burgerIcon: o,
      sideMenu: l,
      infoIcon: i,
      infoLearnButton: s,
      learnMenuButton: d,
      learnModal: g,
      learnModalContent: f,
      learnHandoutImage: m,
      closeLearnModalButton: L,
      learnExplainList: S,
      learnTabs: C,
      learnPanels: I,
      learnShareStatus: E,
    } = e;
    if (
      !r ||
      !g ||
      !f ||
      !L ||
      !S ||
      !(C != null && C.length) ||
      !(I != null && I.length) ||
      !E
    )
      return;
    let M = ce({ body: r, focusRoot: f, initialFocusElement: L, modal: g });
    S.replaceChildren(...ia.map((R) => Gr(R)));
    let N = () => {
        if (!m || m.src) return;
        let R = m.dataset.src;
        R && (m.src = R);
      },
      k = (R, p = "handout") => {
        (typeof t == "function" && t(),
          p === "handout" && N(),
          na({ panels: I, tabs: C }, p),
          (E.textContent = ""),
          Hr({ burgerIcon: o, sideMenu: l }, !1),
          i && i.setAttribute("aria-expanded", "false"),
          M.open({ triggerElement: R === s ? i || R : o || R }));
      };
    return (
      d == null ||
        d.addEventListener("click", () => {
          k(d, "handout");
        }),
      s == null ||
        s.addEventListener("click", () => {
          k(s, "handout");
        }),
      L.addEventListener("click", () => {
        M.close();
      }),
      g.addEventListener("click", (R) => {
        R.target === g && M.close();
      }),
      C.forEach((R) => {
        R.addEventListener("click", () => {
          (R.dataset.learnTab === "handout" && N(),
            na({ panels: I, tabs: C }, R.dataset.learnTab));
        });
      }),
      S.addEventListener("click", (R) => {
        let p =
          R.target instanceof Element
            ? R.target.closest(".learn-case-button")
            : null;
        p != null &&
          p.dataset.caseValue &&
          (typeof a == "function" && a(p.dataset.caseValue),
          M.close({ restoreFocus: !1 }));
      }),
      g.addEventListener("click", (R) => {
        let p =
          R.target instanceof Element
            ? R.target.closest("[data-share-resource]")
            : null;
        if (!p) return;
        let h = ra[p.dataset.shareResource];
        Dr(h, E);
      }),
      { open: k }
    );
  }
  var bt = {
      primary: { title: "Primary", passMark: 3, questionCount: 5 },
      intermediate: { title: "Intermediate", passMark: 4, questionCount: 6 },
      advanced: { title: "Advanced", passMark: 6, questionCount: 8 },
    },
    Ur = {
      "nipe-eye-screening-2026": {
        title:
          "NHS Newborn and Infant Physical Examination screening programme handbook",
        url: "https://www.gov.uk/government/publications/newborn-and-infant-physical-examination-programme-handbook/newborn-and-infant-physical-examination-screening-programme-handbook",
        reviewed: "2026-07-26",
        status: "primary-source-reviewed",
      },
      "fundal-reflex-case-catalogue-v1": {
        title: "Fundal Reflex v1 simulator case catalogue and teaching scope",
        url: null,
        reviewed: "2026-07-26",
        status: "internal-engineering-review",
      },
      "fundal-reflex-safety-v1": {
        title: "Fundal Reflex v1 safety and escalation wording",
        url: null,
        reviewed: "2026-07-26",
        status: "pending-independent-clinical-sign-off",
      },
    },
    qr = {
      primary: [
        {
          question:
            "Both eyes show similar bright orange-red reflexes. Best match:",
          options: [
            "Normal eyes",
            "Dense cataracts",
            "Corneal opacity",
            "Dark reflex problem",
          ],
          answer: 0,
        },
        {
          question:
            "One eye has a much darker reflex than the other. The key first observation is:",
          options: [
            "Asymmetry between the eyes",
            "Equal bright reflexes",
            "A white reflex",
            "A corneal scar",
          ],
          answer: 0,
        },
        {
          question:
            "What can create a falsely unequal reflex during the examination?",
          options: [
            "Unequal gaze or partial lid obstruction",
            "Equal viewing distance",
            "Centred pupils with both eyes open",
            "A bright symmetrical reflex",
          ],
          answer: 0,
        },
        {
          question: "A creamy white pupil is most concerning for:",
          options: [
            "Retinoblastoma",
            "Normal blue reflex",
            "Large esotropia",
            "Poor tear film",
          ],
          answer: 0,
        },
        {
          question: "A baby with a white pupil needs:",
          options: [
            "Urgent eye referral via the local pathway",
            "Routine non-urgent review",
            "Watching only if both eyes move",
            "A colour-only check",
          ],
          answer: 0,
        },
        {
          question:
            "Both eyes have a blue-white but otherwise even reflex. Best label:",
          options: [
            "Normal blue reflex",
            "Dense cataract",
            "White reflex concern",
            "Dark reflex problem",
          ],
          answer: 0,
        },
        {
          question:
            "What must still be checked before an even blue-white reflex is called a colour variant?",
          options: [
            "Brightness, shape and symmetry",
            "Hair colour only",
            "One pupil only",
            "Age alone",
          ],
          answer: 0,
        },
        {
          question:
            "The child is looking away and the reflex view is poor. Best next step:",
          options: [
            "Repeat after improving the view",
            "Call it normal",
            "Refer as a white reflex",
            "Judge colour only",
          ],
          answer: 0,
        },
        {
          question:
            "Upper lids cover both pupils and the reflex cannot be judged. How should the finding be recorded?",
          options: [
            "View inadequate or unassessed",
            "Normal reflexes",
            "Bilateral cataracts",
            "Normal because both sides match",
          ],
          answer: 0,
        },
        {
          question:
            "One eye turns in towards the nose and its reflex appears brighter. This is:",
          options: [
            "Esotropia (eye turns in)",
            "Exotropia (eye turns out)",
            "Anisocoria (unequal pupils)",
            "Corneal opacity",
          ],
          answer: 0,
        },
        {
          question:
            "When one eye turns in, what should be assessed separately from reflex brightness?",
          options: [
            "Eye alignment",
            "Hair colour",
            "Lens surgery history only",
            "Tear-film shimmer only",
          ],
          answer: 0,
        },
        {
          question: "One eye turns out away from the nose. This is:",
          options: [
            "Esotropia (eye turns in)",
            "Exotropia (eye turns out)",
            "Anisocoria (unequal pupils)",
            "Coloboma (notched pupil)",
          ],
          answer: 1,
        },
        {
          question:
            "One eye turns out and has an obvious corneal scar. Best Primary match:",
          options: [
            "Large exotropia with corneal scar",
            "Large esotropia",
            "Retinoblastoma",
            "Normal blue reflex",
          ],
          answer: 0,
        },
        {
          question:
            "Which clue localises reduced reflex clarity to the cornea?",
          options: [
            "A visible anterior scar crossing the pupil",
            "A freely drifting dark dot",
            "A fixed posterior sector",
            "An equal blue-white reflex",
          ],
          answer: 0,
        },
        {
          question: "The simplest normal case should have:",
          options: [
            "Equal reflexes in right and left eyes",
            "A fixed dark sector",
            "Blood-like haze",
            "A lens edge",
          ],
          answer: 0,
        },
        {
          question:
            "If the two reflexes cannot be compared reliably, the safest next step is to:",
          options: [
            "Improve the view and repeat or seek eye assessment",
            "Record both as normal",
            "Judge colour alone",
            "Ignore the obscured eye",
          ],
          answer: 0,
        },
      ],
      intermediate: [
        {
          question: "Both eyes show a superior crescent. Best match:",
          options: [
            "High hypermetropia",
            "Myopia",
            "Poor tear film",
            "Anisocoria",
          ],
          answer: 0,
        },
        {
          question:
            "Why is a refractive crescent not a final spectacle prescription?",
          options: [
            "It is a screening cue that still needs formal refraction",
            "It measures the exact lens power",
            "It excludes astigmatism",
            "It confirms normal acuity",
          ],
          answer: 0,
        },
        {
          question:
            "Both eyes have a duller-than-normal corneal reflex. Best match:",
          options: [
            "Dull corneal reflex",
            "Retinal detachment",
            "Aphakia",
            "Keratoconus",
          ],
          answer: 0,
        },
        {
          question:
            "Which observation helps separate surface-related dullness from a fixed lens opacity?",
          options: [
            "The appearance changes after a blink",
            "The pupil becomes keyhole-shaped",
            "A lens edge is visible",
            "A fixed sector stays in place",
          ],
          answer: 0,
        },
        {
          question:
            "The reflex flickers and shimmers as the light moves. Best match:",
          options: [
            "Poor tear film",
            "Dense cataract",
            "Retinal detachment",
            "Vitreous haemorrhage",
          ],
          answer: 0,
        },
        {
          question:
            "When surface shimmer makes the reflex unstable, the next useful step is to:",
          options: [
            "Encourage a blink and reassess",
            "Record a retinal detachment",
            "Call the view normal",
            "Diagnose aphakia",
          ],
          answer: 0,
        },
        {
          question:
            "Right eye has a superior crescent; left eye has an inferior crescent. Best interpretation:",
          options: [
            "Bilateral myopia",
            "Bilateral hypermetropia",
            "Right hypermetropia with left myopia",
            "Keratoconus",
          ],
          answer: 2,
        },
        {
          question: "Different crescent directions between eyes should prompt:",
          options: [
            "A refractive comparison of both eyes",
            "A colour-only check",
            "Immediate labelling as cataract",
            "Ignoring the clearer eye",
          ],
          answer: 0,
        },
        {
          question:
            "An inferior keyhole-shaped pupil with an altered reflex is most typical of:",
          options: [
            "Coloboma",
            "Aniridia",
            "Acute angle closure",
            "Iridocyclitis",
          ],
          answer: 0,
        },
        {
          question:
            "Which feature separates an iris coloboma from a round central opacity?",
          options: [
            "A visible keyhole extension of the pupil margin",
            "A freely mobile dark dot",
            "A diffuse vitreous haze",
            "An equal round pupil",
          ],
          answer: 0,
        },
        {
          question: "Marked loss of iris tissue in both eyes is called:",
          options: [
            "Aniridia",
            "Small pupils",
            "Acute angle closure",
            "Iris transillumination",
          ],
          answer: 0,
        },
        {
          question: "Bilateral aniridia may also show:",
          options: [
            "Subtle nystagmus",
            "Retinal detachment",
            "A pseudophakic second reflex",
            "A lens edge",
          ],
          answer: 0,
        },
        {
          question: "One pupil is clearly smaller than the other. The term is:",
          options: ["Anisocoria", "Aniridia", "Coloboma", "Aphakia"],
          answer: 0,
        },
        {
          question:
            "Which finding is not explained safely by simple anisocoria?",
          options: [
            "A white or obscured reflex",
            "Unequal pupil size",
            "Equal clear reflexes",
            "A visible larger pupil",
          ],
          answer: 0,
        },
        {
          question:
            "A small extra patch of light is seen passing through the iris. Best match:",
          options: [
            "Anisocoria",
            "Posterior pole cataract",
            "Iris transillumination",
            "Aphakia",
          ],
          answer: 2,
        },
        {
          question:
            "Which feature favours iris transillumination over coloboma?",
          options: [
            "A light patch through the iris without a keyhole pupil margin",
            "A fixed retinal sector",
            "A dense central lens plaque",
            "A missing crystalline lens",
          ],
          answer: 0,
        },
        {
          question:
            "Both pupils are small, making the reflex harder to view. Best match:",
          options: [
            "Small pupils",
            "Aphakia",
            "Keratoconus",
            "Retinal detachment",
          ],
          answer: 0,
        },
        {
          question:
            "If small pupils prevent an adequate reflex view, the result should be:",
          options: [
            "Recorded as limited or unassessed",
            "Recorded as normal",
            "Called aphakia",
            "Called retinal detachment",
          ],
          answer: 0,
        },
        {
          question:
            "One eye has a dense central posterior opacity but the other is normal. Best match:",
          options: [
            "Retinal detachment",
            "Poor tear film",
            "Posterior pole cataract",
            "Floaters",
          ],
          answer: 2,
        },
        {
          question:
            "Which comparison helps distinguish a posterior lens opacity from a corneal scar?",
          options: [
            "A clear corneal surface with a deeper central shadow",
            "A freely moving opacity",
            "A keyhole pupil margin",
            "A changing tear-film shimmer",
          ],
          answer: 0,
        },
        {
          question:
            "In a baby, both reflexes are dull with lens-media haze. Most concerning for:",
          options: [
            "Poor tear film",
            "Keratoconus",
            "Congenital cataract",
            "Physiological anisocoria",
          ],
          answer: 2,
        },
        {
          question:
            "An infant with an obscured or markedly asymmetric reflex should receive:",
          options: [
            "Urgent eye referral through the local pathway",
            "Routine observation only",
            "A normal result if both eyes move",
            "Colour reassessment at adulthood",
          ],
          answer: 0,
        },
        {
          question:
            "A full grey reflex with only a faint hazy corneal reflection suggests:",
          options: [
            "Myopia",
            "Floaters",
            "Corneal opacity",
            "Posterior pole cataract",
          ],
          answer: 2,
        },
        {
          question:
            "When a visible corneal opacity limits the reflex, the record should include:",
          options: [
            "The anterior opacity and the limited fundal view",
            "A normal fundus",
            "Only pupil size",
            "Only eye alignment",
          ],
          answer: 0,
        },
        {
          question:
            "Left eye shows a sharp lens edge and reversed inferior crescent; right eye is normal. Best match:",
          options: [
            "Aphakia",
            "Posterior pole cataract",
            "Myopia",
            "Downward lens subluxation",
          ],
          answer: 3,
        },
        {
          question: "Which feature separates lens subluxation from aphakia?",
          options: [
            "A displaced lens edge is still visible",
            "The reflex is always white",
            "Both pupils are small",
            "The opacity drifts freely",
          ],
          answer: 0,
        },
      ],
      advanced: [
        {
          question:
            "One painful-looking eye has a vertically oval pupil and duller reflex. Treat as:",
          options: [
            "Benign anisocoria",
            "Acute angle closure",
            "Keratoconus",
            "Aphakia",
          ],
          answer: 1,
        },
        {
          question:
            "Why is a vertically oval pupil in a painful red eye not safely classified as simple anisocoria?",
          options: [
            "It may indicate an acute anterior-segment emergency",
            "It confirms a refractive error",
            "It is expected with normal pigmentation",
            "It excludes raised pressure",
          ],
          answer: 0,
        },
        {
          question:
            "What is the key limitation of using the fundal reflex in a painful red eye?",
          options: [
            "It cannot rule out an anterior-segment emergency",
            "It confirms angle closure by itself",
            "It replaces pressure assessment",
            "It makes the fellow eye irrelevant",
          ],
          answer: 0,
        },
        {
          question:
            "Small black dots sit on the reflex near the pupil margin. Best match:",
          options: [
            "Retinal detachment",
            "Iridocyclitis",
            "Acute angle closure",
            "Poor tear film",
          ],
          answer: 1,
        },
        {
          question:
            "Iridocyclitis is more likely than simple anisocoria when there are:",
          options: [
            "Inflammatory-looking pupil-margin changes",
            "Equal normal reflexes",
            "Both eyes blue-white only",
            "A drifting floater",
          ],
          answer: 0,
        },
        {
          question:
            "Both eyes show a large distorted scissors-like reflex. Best match:",
          options: [
            "High hypermetropia",
            "Dense cataract",
            "Keratoconus",
            "Small pupils",
          ],
          answer: 2,
        },
        {
          question: "A markedly distorted scissors reflex should prompt:",
          options: [
            "Corneal and refractive assessment",
            "A diagnosis from the reflex alone",
            "A retinal-detachment label",
            "A normal result if bilateral",
          ],
          answer: 0,
        },
        {
          question:
            "Spoke-like radial lens shadows cross the reflex. Best match:",
          options: [
            "Subcapsular cataract",
            "Cortical cataract",
            "Posterior pole cataract",
            "Aniridia",
          ],
          answer: 1,
        },
        {
          question:
            "Which feature separates cortical lens spokes from vitreous floaters?",
          options: [
            "Lens spokes remain fixed while floaters drift",
            "Lens spokes are always blue",
            "Floaters form a keyhole pupil",
            "Floaters create an IOL reflection",
          ],
          answer: 0,
        },
        {
          question:
            "A central posterior plaque causes glare and reduces the reflex. Best match:",
          options: [
            "Dense cataract",
            "Corneal opacity",
            "Subcapsular cataract",
            "Floaters",
          ],
          answer: 2,
        },
        {
          question:
            "Why can a small posterior subcapsular opacity cause marked symptoms?",
          options: [
            "Its central position can interfere with the visual axis and glare",
            "It always turns the eye out",
            "It makes floaters stationary",
            "It enlarges the iris",
          ],
          answer: 0,
        },
        {
          question:
            "A second corneal reflection appears in a pseudophakic eye. Best match:",
          options: [
            "IOL reflection",
            "Posterior vitreous detachment",
            "Corneal opacity",
            "Anisocoria",
          ],
          answer: 0,
        },
        {
          question:
            "In the IOL and capsular thickening case, the left-eye clue is:",
          options: [
            "Posterior capsule haze",
            "Retinal detachment",
            "Coloboma notch",
            "Large esotropia",
          ],
          answer: 0,
        },
        {
          question:
            "The crystalline lens is absent, giving a very bright altered reflex. This is:",
          options: ["Aniridia", "Anisometropia", "Aphakia", "Ametropia"],
          answer: 2,
        },
        {
          question: "Which clue favours pseudophakia rather than aphakia?",
          options: [
            "An intraocular-lens reflection or lens-surgery history",
            "No crystalline lens and no implant",
            "A changing tear-film shimmer",
            "A fixed retinal sector",
          ],
          answer: 0,
        },
        {
          question:
            "Mobile dark opacities drift across an otherwise present reflex. Best match:",
          options: [
            "Retinal detachment",
            "Floaters",
            "Vitreous haemorrhage",
            "Dense cataract",
          ],
          answer: 1,
        },
        {
          question:
            "New mobile opacities reported with flashes or visual loss should be:",
          options: [
            "Assessed clinically rather than dismissed as harmless floaters",
            "Recorded as normal",
            "Treated as a colour variant",
            "Explained by pupil size alone",
          ],
          answer: 0,
        },
        {
          question:
            "A diffuse blood-like haze obscures much of the reflex rather than forming small dots. Best match:",
          options: [
            "Poor tear film",
            "Floaters",
            "Vitreous haemorrhage",
            "Corneal opacity",
          ],
          answer: 2,
        },
        {
          question:
            "A diffuse blood-like haze behind a clear cornea should be recorded as:",
          options: [
            "A limited posterior view needing urgent assessment",
            "A normal fundus",
            "A tear-film problem only",
            "A refractive crescent",
          ],
          answer: 0,
        },
        {
          question:
            "A fixed dark sector stays in the same part of the pupil as the light moves. Best match:",
          options: ["Aniridia", "Aphakia", "Retinal detachment", "Floaters"],
          answer: 2,
        },
        {
          question:
            "A fixed dark sector with new visual symptoms should prompt:",
          options: [
            "Urgent eye assessment",
            "Routine colour review only",
            "A normal result if the other eye is clear",
            "A tear-film treatment assumption",
          ],
          answer: 0,
        },
        {
          question:
            "Retroillumination is useful for cortical lens opacity because it:",
          options: [
            "Outlines fixed spokes against the fundal reflex",
            "Makes floaters stationary",
            "Confirms retinal attachment",
            "Measures pupil alignment",
          ],
          answer: 0,
        },
        {
          question:
            "Why can vitreous haemorrhage not be assessed fully from the reflex pattern alone?",
          options: [
            "The haze can conceal the underlying retina",
            "It always clears after a blink",
            "It is identical to a corneal scar",
            "It proves the retina is attached",
          ],
          answer: 0,
        },
        {
          question:
            "What is the key limitation of a fixed retinal-sector reflex pattern?",
          options: [
            "It suggests posterior pathology but does not replace a retinal examination",
            "It confirms the exact retinal break",
            "It becomes normal when the fellow eye is clear",
            "It measures visual acuity",
          ],
          answer: 0,
        },
        {
          question:
            "Which history is most relevant when an IOL reflection or capsular haze is seen?",
          options: [
            "Previous cataract surgery",
            "Childhood eye colour",
            "Recent tear-film change",
            "Physiological anisocoria",
          ],
          answer: 0,
        },
        {
          question: "Aphakia and IOL/capsular thickening both point first to:",
          options: [
            "Lens status or previous lens surgery",
            "Primary alignment only",
            "Pupil size alone",
            "Tear-film shimmer",
          ],
          answer: 0,
        },
      ],
    },
    Yr = {
      normal: {
        explanation:
          "A reassuring screening comparison is bright, round and similar between the two eyes, while normal colour varies with pigmentation.",
        source: "nipe-eye-screening-2026",
      },
      asymmetry: {
        explanation:
          "A reflex that differs in colour or brightness from the fellow eye is an abnormal screening finding and needs further assessment.",
        source: "nipe-eye-screening-2026",
      },
      "white-reflex": {
        explanation:
          "A white reflex is abnormal. It can reflect cataract or a posterior cause, so it requires urgent eye referral rather than observation alone.",
        source: "nipe-eye-screening-2026",
      },
      "normal-variation": {
        explanation:
          "The simulator includes an even blue-white reflex as a pigmentation-related teaching variant. Symmetry and clarity remain essential comparisons.",
        source: "fundal-reflex-case-catalogue-v1",
      },
      "limited-view": {
        explanation:
          "A view obscured by gaze or eyelids is unassessed, not normal. Improve the view and repeat before interpreting the reflex.",
        source: "fundal-reflex-safety-v1",
      },
      "examination-quality": {
        explanation:
          "Compare both eyes from a centred, unobstructed position. Unequal gaze or partial lid coverage can create an apparent brightness difference that should be corrected before interpretation.",
        source: "fundal-reflex-safety-v1",
      },
      alignment: {
        explanation:
          "Esotropia turns an eye in and exotropia turns it out. Alignment changes the apparent position of the reflected light between the eyes.",
        source: "fundal-reflex-case-catalogue-v1",
      },
      "corneal-opacity": {
        explanation:
          "A corneal opacity or scar reduces reflex clarity at the anterior surface and should not be mistaken for an alignment or colour variant.",
        source: "fundal-reflex-case-catalogue-v1",
      },
      refractive: {
        explanation:
          "The simulator uses the direction and symmetry of crescents to teach refractive comparison, including different refractive states between eyes.",
        source: "fundal-reflex-case-catalogue-v1",
      },
      "refractive-limitation": {
        explanation:
          "A crescent is a qualitative screening cue. It does not measure an exact refractive correction and should not replace formal refraction.",
        source: "fundal-reflex-case-catalogue-v1",
      },
      "corneal-quality": {
        explanation:
          "A dull corneal reflection is an anterior-surface quality cue. It is distinct from a fixed posterior shadow or mobile vitreous opacity.",
        source: "fundal-reflex-case-catalogue-v1",
      },
      "tear-film": {
        explanation:
          "An irregular tear film changes as the light or blink changes, producing unstable shimmer rather than a fixed opacity.",
        source: "fundal-reflex-case-catalogue-v1",
      },
      iris: {
        explanation:
          "Iris findings alter pupil shape or permit light through an iris defect. Compare the pupil anatomy as well as the fundal reflex.",
        source: "fundal-reflex-case-catalogue-v1",
      },
      pupil: {
        explanation:
          "Pupil size changes the available view. Unequal or small pupils must be recorded rather than converted into a reflex diagnosis.",
        source: "fundal-reflex-case-catalogue-v1",
      },
      "lens-opacity": {
        explanation:
          "A central or dense lens opacity obscures the reflex in a fixed pattern and may limit the view of the fundus.",
        source: "fundal-reflex-case-catalogue-v1",
      },
      cataract: {
        explanation:
          "Cataract patterns are fixed lens opacities. Their position and shape help distinguish them from surface shimmer or vitreous movement.",
        source: "fundal-reflex-case-catalogue-v1",
      },
      "lens-position": {
        explanation:
          "A displaced lens can expose a visible lens edge and alter the crescent. Lens position is the key cue rather than retinal shadowing.",
        source: "fundal-reflex-case-catalogue-v1",
      },
      "acute-angle": {
        explanation:
          "A painful red eye with a vertically oval or poorly reactive pupil is an emergency pattern and must not be treated as benign anisocoria.",
        source: "fundal-reflex-safety-v1",
      },
      inflammation: {
        explanation:
          "Inflammatory pupil-margin changes are not explained by simple physiological anisocoria and require clinical assessment.",
        source: "fundal-reflex-safety-v1",
      },
      "corneal-shape": {
        explanation:
          "A scissors-like or markedly distorted reflex is a corneal-shape cue rather than a white-reflex or retinal-sector pattern.",
        source: "fundal-reflex-case-catalogue-v1",
      },
      "lens-surgery": {
        explanation:
          "Aphakia, an intraocular lens and posterior capsule haze are lens-status clues. Previous lens surgery should be considered when interpreting the reflex.",
        source: "fundal-reflex-case-catalogue-v1",
      },
      "lens-status": {
        explanation:
          "Aphakia means absence of the crystalline lens and produces a different optical pattern from a small pupil or retinal detachment.",
        source: "fundal-reflex-case-catalogue-v1",
      },
      vitreous: {
        explanation:
          "Small mobile opacities suggest floaters, while a diffuse blood-like haze suggests vitreous haemorrhage. Both differ from a fixed retinal sector.",
        source: "fundal-reflex-case-catalogue-v1",
      },
      retinal: {
        explanation:
          "A fixed sector that remains in the same position as the light moves is the simulator cue for retinal detachment and warrants urgent assessment.",
        source: "fundal-reflex-safety-v1",
      },
    },
    $r = {
      primary: [
        "normal",
        "asymmetry",
        "examination-quality",
        "white-reflex",
        "white-reflex",
        "normal-variation",
        "normal-variation",
        "limited-view",
        "limited-view",
        "alignment",
        "alignment",
        "alignment",
        "corneal-opacity",
        "corneal-opacity",
        "normal",
        "asymmetry",
      ],
      intermediate: [
        "refractive",
        "refractive-limitation",
        "corneal-quality",
        "corneal-quality",
        "tear-film",
        "tear-film",
        "refractive",
        "refractive",
        "iris",
        "iris",
        "iris",
        "iris",
        "pupil",
        "pupil",
        "iris",
        "iris",
        "pupil",
        "pupil",
        "lens-opacity",
        "lens-opacity",
        "cataract",
        "cataract",
        "corneal-opacity",
        "corneal-opacity",
        "lens-position",
        "lens-position",
      ],
      advanced: [
        "acute-angle",
        "acute-angle",
        "acute-angle",
        "inflammation",
        "inflammation",
        "corneal-shape",
        "corneal-shape",
        "cataract",
        "cataract",
        "cataract",
        "cataract",
        "lens-surgery",
        "lens-surgery",
        "lens-status",
        "lens-status",
        "vitreous",
        "vitreous",
        "vitreous",
        "vitreous",
        "retinal",
        "retinal",
        "cataract",
        "vitreous",
        "retinal",
        "lens-surgery",
        "lens-surgery",
      ],
    },
    la = Object.fromEntries(
      Object.entries(qr).map(([e, t]) => [
        e,
        t.map((a, r) => {
          let o = $r[e][r],
            l = Yr[o];
          return {
            id: `fundal-${e}-${String(r + 1).padStart(2, "0")}`,
            ...a,
            topic: o,
            ...l,
            reviewStatus: Ur[l.source].status,
          };
        }),
      ]),
    );
  function sa(e) {
    return e
      .map((t) => ({ item: t, sortKey: Math.random() }))
      .sort((t, a) => t.sortKey - a.sortKey)
      .map((t) => t.item);
  }
  function Vr(e) {
    let t = e.options[e.answer],
      a = sa(e.options);
    return { ...e, options: a, answer: a.indexOf(t) };
  }
  function ca(e, t = 5) {
    let a = la[e] || [],
      r = sa(a);
    return r.slice(0, Math.min(t, r.length)).map(Vr);
  }
  function ua(e, t) {
    if (!e) return;
    let a = document.createDocumentFragment();
    (t.forEach((r, o) => {
      let l = document.createElement("fieldset");
      ((l.className = "question"), (l.dataset.questionId = r.id));
      let i = document.createElement("legend");
      ((i.textContent = `${o + 1}. ${r.question}`), l.appendChild(i));
      let s = document.createElement("div");
      ((s.className = "options"),
        r.options.forEach((g, f) => {
          let m = document.createElement("label"),
            L = document.createElement("input");
          ((L.type = "radio"),
            (L.name = `mcq_q_${o}`),
            (L.value = String(f)),
            m.append(L, document.createTextNode(` ${g}`)),
            s.appendChild(m));
        }),
        l.appendChild(s));
      let d = document.createElement("p");
      ((d.className = "mcq-explanation"),
        (d.hidden = !0),
        d.setAttribute("aria-live", "polite"),
        l.appendChild(d),
        a.appendChild(l));
    }),
      e.replaceChildren(a));
  }
  function da(e) {
    let t = [];
    for (let a = 0; a < e.length; a += 1) {
      let r = document.querySelector(`input[name="mcq_q_${a}"]:checked`);
      if (!r) return null;
      t.push(parseInt(r.value, 10));
    }
    return t;
  }
  function ga(e, t) {
    let a = 0;
    return (
      e.forEach((r, o) => {
        t[o] === r.answer && (a += 1);
      }),
      a
    );
  }
  function ma(e, t, a) {
    if (!e || !Array.isArray(t) || !Array.isArray(a)) return;
    Array.from(e.querySelectorAll("fieldset.question")).forEach((o, l) => {
      var m, L, S;
      let i = Array.from(o.querySelectorAll(".options label"));
      i.forEach((C) => {
        C.classList.remove("correct-answer-label", "wrong-answer-label");
      });
      let s = (m = t[l]) == null ? void 0 : m.answer,
        d = a[l],
        g = i[s];
      if (
        (g && g.classList.add("correct-answer-label"),
        Number.isInteger(d) && d !== s)
      ) {
        let C = i[d];
        C && C.classList.add("wrong-answer-label");
      }
      o.querySelectorAll("input[type='radio']").forEach((C) => {
        C.disabled = !0;
      });
      let f = o.querySelector(".mcq-explanation");
      if (f) {
        let C =
          ((S = (L = t[l]) == null ? void 0 : L.options) == null
            ? void 0
            : S[s]) || "";
        ((f.textContent =
          d === s
            ? `Correct. Why: ${t[l].explanation}`
            : `Incorrect. Correct answer: ${C}. Why: ${t[l].explanation}`),
          f.classList.toggle("is-correct", d === s),
          f.classList.toggle("is-incorrect", d !== s),
          (f.hidden = !1));
      }
    });
  }
  function ha({ state: e, dom: t, onBeforeOpenMcq: a }) {
    let {
      body: r,
      burgerIcon: o,
      sideMenu: l,
      mcqModal: i,
      mcqModalContent: s,
      closeMcqModalButton: d,
      mcqTitle: g,
      mcqIntro: f,
      mcqContainer: m,
      submitMcqButton: L,
      retryMcqButton: S,
      mcqResult: C,
      mcqLevelButtons: I,
    } = t;
    if (!r || !o || !l || !i || !s || !d || !g || !f || !m || !L || !C) return;
    let E = (R) => {
        var p;
        (l.classList.toggle("open", R),
          l.setAttribute("aria-hidden", String(!R)),
          R
            ? (l.removeAttribute("inert"),
              (p = l.querySelector("button:not([disabled])")) == null ||
                p.focus({ preventScroll: !0 }))
            : l.setAttribute("inert", ""),
          o.setAttribute("aria-expanded", String(R)),
          o.setAttribute("aria-label", R ? "Close menu" : "Open menu"));
      },
      M = ce({ body: r, focusRoot: s, initialFocusElement: d, modal: i }),
      N = () => {
        (M.close({ restoreFocus: !1 }), o.focus({ preventScroll: !0 }));
      },
      k = (R, p) => {
        let h = bt[R];
        h &&
          (typeof a == "function" && a(),
          (e.activeMcqLevel = R),
          (e.activeMcqQuestions = ca(R, h.questionCount || 5)),
          (g.textContent = `${h.title} MCQ`),
          (f.textContent = `${e.activeMcqQuestions.length} questions. Pass mark ${h.passMark}.`),
          ua(m, e.activeMcqQuestions),
          (C.textContent = ""),
          (C.style.color = ""),
          (L.disabled = !1),
          S && (S.hidden = !0),
          E(!1),
          M.open({ triggerElement: o }));
      };
    (o.addEventListener("click", () => {
      E(!l.classList.contains("open"));
    }),
      I.forEach((R) => {
        R.addEventListener("click", () => {
          k(R.dataset.level, R);
        });
      }),
      d.addEventListener("click", () => {
        N();
      }),
      L.addEventListener("click", () => {
        var P;
        if (!e.activeMcqQuestions.length) return;
        let R = da(e.activeMcqQuestions);
        if (!R) {
          ((C.textContent = "Please answer all questions before submitting."),
            (C.style.color = "#c4171d"));
          let F = [...m.querySelectorAll(".question")].find(
            (j) => !j.querySelector("input:checked"),
          );
          (P = F == null ? void 0 : F.querySelector('input[type="radio"]')) ==
            null || P.focus();
          return;
        }
        let p = ga(e.activeMcqQuestions, R);
        (ma(m, e.activeMcqQuestions, R),
          (L.disabled = !0),
          S && (S.hidden = !1));
        let h = bt[e.activeMcqLevel].passMark;
        if (p >= h) {
          let F = document.createElement("span");
          ((F.className = "result-star"),
            F.setAttribute("aria-label", "star earned"),
            (F.textContent = "\u2605"),
            C.replaceChildren(
              document.createTextNode(
                `Score ${p}/${e.activeMcqQuestions.length} - Pass `,
              ),
              F,
            ),
            (C.style.color = "#0f9644"));
        } else
          ((C.textContent = `Score ${p}/${e.activeMcqQuestions.length} - Needs more practice`),
            (C.style.color = "#c4171d"));
        C.focus({ preventScroll: !0 });
      }),
      S == null ||
        S.addEventListener("click", () => {
          var R;
          e.activeMcqLevel &&
            (k(e.activeMcqLevel, S),
            (R = m.querySelector("input[type='radio']")) == null ||
              R.focus({ preventScroll: !0 }));
        }),
      document.addEventListener("click", (R) => {
        let p = R.target;
        if (p === i) {
          N();
          return;
        }
        if (l.classList.contains("open") && p instanceof Node) {
          let h = l.contains(p),
            B = o.contains(p);
          !h && !B && E(!1);
        }
      }),
      document.addEventListener("keydown", (R) => {
        if (R.key === "Escape") {
          if (M.isOpen()) {
            N();
            return;
          }
          l.classList.contains("open") &&
            (E(!1), o.focus({ preventScroll: !0 }));
        }
      }));
  }
  var zr = "20260430-6",
    Kr = "20260426-10",
    Xr = {
      zero: "1normal.webp",
      "normal-dark": "2dark.webp",
      "right-hyper-left-posterior-pole": "3postpole.webp",
      "right-normal-left-large-esotropia": "4eso.webp",
      "right-large-exotropia-left-corneal-scar": "5exo.webp",
      "bilateral-high-hypermetropia": "6phyper.webp",
      "bilateral-myopia": "7myopia.webp",
    },
    Wr = se.flatMap((e) => e.options || []),
    ba = new Map(Wr.map((e) => [e.value, e]));
  function Zr(e) {
    let t = new Set();
    return e.filter((a) => (!a || t.has(a.value) ? !1 : (t.add(a.value), !0)));
  }
  var La = Zr(me.flatMap((e) => e.values).map((e) => ba.get(e))),
    Qr = La.filter((e) => Ee.has(e.value)),
    jr = new Map(me.flatMap((e) => e.values.map((t) => [t, e])));
  function Aa(e) {
    let t = /^(\d+)\.\s*(.*)$/.exec(String(e || "").trim());
    return t
      ? { index: t[1], text: t[2] }
      : { index: "", text: String(e || "").trim() };
  }
  function fa(e) {
    var t;
    for (let a of se) {
      let r = (t = a.options) == null ? void 0 : t.find((o) => o.value === e);
      if (r) return r.label;
    }
    return "";
  }
  function Jr(e) {
    var t;
    for (let a of se) {
      let r = (t = a.options) == null ? void 0 : t.find((o) => o.value === e);
      if (r) return r.triggerLabel || r.label;
    }
    return "";
  }
  function ei(e) {
    return jr.get(e) || null;
  }
  function pa(e, t) {
    return t.findIndex((a) => a.value === e);
  }
  function ti(e) {
    return `assets/case-thumbnails/${e}.webp?v=${zr}`;
  }
  function Lt(e) {
    let t = Xr[e];
    return t ? `assets/images/${t}?v=${Kr}` : "";
  }
  function ai({ modalController: e, triggerButton: t }) {
    !e ||
      !t ||
      (t.setAttribute("aria-expanded", "true"), e.open({ triggerElement: t }));
  }
  function Ce({ modalController: e, triggerButton: t, restoreFocus: a = !1 }) {
    !e ||
      !t ||
      (t.setAttribute("aria-expanded", "false"), e.close({ restoreFocus: a }));
  }
  function ri({
    modalController: e,
    title: t,
    image: a,
    caseLabel: r,
    caseValue: o,
    triggerButton: l = null,
  }) {
    let i = Lt(o);
    return !e || !t || !a || !i
      ? !1
      : ((t.textContent = r || "Case photo"),
        (a.src = i),
        (a.alt = r ? `Reference photo for ${r}` : "Reference photo"),
        e.open({ triggerElement: l }),
        !0);
  }
  function fe({
    modalController: e,
    title: t,
    image: a,
    restoreFocus: r = !1,
  }) {
    !e ||
      !t ||
      !a ||
      (e.close({ restoreFocus: r }),
      (t.textContent = "Case photo"),
      (a.src = ""),
      (a.alt = ""));
  }
  function ii(e, t) {
    let { index: a, text: r } = Aa(e.label),
      o = !!Lt(e.value),
      l = document.createElement("div");
    l.className = "visual-case-card-shell";
    let i = document.createElement("button");
    ((i.type = "button"),
      (i.className = "visual-case-card"),
      o && i.classList.add("has-photo"),
      (i.dataset.value = e.value),
      i.setAttribute("aria-pressed", String(e.value === t)),
      e.value === t && i.classList.add("is-selected"));
    let s = document.createElement("div");
    s.className = "visual-case-header";
    let d = document.createElement("span");
    ((d.className = "visual-case-index"), (d.textContent = a));
    let g = document.createElement("span");
    ((g.className = "visual-case-label"), (g.textContent = r), s.append(d, g));
    let f = document.createElement("div");
    f.className = "visual-case-preview";
    let m = document.createElement("img");
    if (
      ((m.className = "visual-case-preview-image"),
      (m.src = ti(e.value)),
      (m.alt = ""),
      (m.loading = "lazy"),
      (m.decoding = "async"),
      (m.draggable = !1),
      f.appendChild(m),
      i.append(s, f),
      l.appendChild(i),
      o)
    ) {
      let L = document.createElement("button");
      ((L.type = "button"),
        (L.className = "visual-case-photo-button"),
        (L.dataset.value = e.value),
        (L.title = `Open reference photo for ${e.label}`),
        L.setAttribute("aria-label", `Open reference photo for ${e.label}`),
        L.setAttribute("aria-haspopup", "dialog"));
      let S = document.createElement("span");
      ((S.className = "visual-case-photo-icon"),
        S.setAttribute("aria-hidden", "true"),
        L.appendChild(S),
        l.appendChild(L));
    }
    return l;
  }
  function Ie(e, t) {
    e &&
      e.querySelectorAll(".visual-case-card").forEach((a) => {
        let r = a.dataset.value === t;
        (a.classList.toggle("is-selected", r),
          a.setAttribute("aria-pressed", String(r)));
      });
  }
  function Ea({ dom: e, state: t, onBeforeSelectCase: a }) {
    let {
      body: r,
      refractionStateSelect: o,
      visualCaseTrigger: l,
      visualCaseCurrentLabel: i,
      casePrevButton: s,
      caseNextButton: d,
      visualCaseModal: g,
      visualCaseModalContent: f,
      closeVisualCaseModalButton: m,
      visualCaseSimilar: L,
      visualCaseSimilarList: S,
      visualCaseModalList: C,
      visualCasePhotoModal: I,
      visualCasePhotoModalContent: E,
      closeVisualCasePhotoModalButton: M,
      visualCasePhotoTitle: N,
      visualCasePhotoImage: k,
    } = e;
    if (
      !r ||
      !o ||
      !l ||
      !i ||
      !g ||
      !f ||
      !m ||
      !L ||
      !S ||
      !C ||
      !I ||
      !E ||
      !M ||
      !N ||
      !k
    )
      return;
    let R = ce({ body: r, focusRoot: f, initialFocusElement: m, modal: g }),
      p = ce({ body: r, focusRoot: E, initialFocusElement: M, modal: I });
    function h(u) {
      g.getAttribute("aria-hidden") === "false" &&
        g.setAttribute("aria-modal", String(u));
    }
    function B({ level: u, isOpen: y = !1 }) {
      let v = document.createElement("details");
      ((v.className = "visual-case-level"),
        (v.dataset.level = u.value),
        (v.open = y));
      let w = document.createElement("summary");
      ((w.className = "visual-case-level-summary"),
        (w.textContent = `${u.label} cases (${u.options.length})`));
      let z = document.createElement("div");
      return (
        (z.className = "visual-case-group-cards"),
        u.options.forEach((W) => {
          z.appendChild(ii(W, t.currentRefraction));
        }),
        v.append(w, z),
        v
      );
    }
    function P() {
      return t.isBabyMode ? Qr : La;
    }
    function F(u) {
      return !t.isBabyMode || Ee.has(u);
    }
    function j() {
      return me
        .map((u) => {
          let y = u.values
            .map((v) => ba.get(v))
            .filter((v) => v && (!t.isBabyMode || Ee.has(v.value)));
          return { label: u.label, value: u.value, options: y };
        })
        .filter((u) => u.options.length);
    }
    function _() {
      let u = j(),
        y = document.createDocumentFragment();
      (u.forEach((v, w) => {
        y.appendChild(B({ level: v, isOpen: w === 0 }));
      }),
        C.replaceChildren(y),
        Ie(C, o.value));
    }
    function x(u) {
      let y = P(),
        w = pa(u, y) !== -1;
      (s && (s.disabled = !w || y.length < 2),
        d && (d.disabled = !w || y.length < 2));
    }
    function O(u) {
      let y = St(u).filter((w) => F(w.value));
      if (!y.length) {
        ((L.hidden = !0), (L.open = !1), S.replaceChildren());
        return;
      }
      let v = document.createDocumentFragment();
      (y.forEach((w) => {
        let { index: z, text: W } = Aa(w.label),
          Z = document.createElement("button");
        ((Z.type = "button"),
          (Z.className = "visual-case-similar-chip"),
          (Z.dataset.value = w.value),
          (Z.textContent = z ? `${z}. ${W}` : W),
          v.appendChild(Z));
      }),
        S.replaceChildren(v),
        (L.hidden = !1),
        (L.open = !1));
    }
    function D(u) {
      let y = fa(u) || "Select a case",
        v = Jr(u) || y,
        w = ei(u);
      ((i.textContent = v),
        (i.title = y),
        (i.dataset.level = (w == null ? void 0 : w.value) || ""),
        (i.dataset.levelLabel = (w == null ? void 0 : w.label) || ""),
        (l.dataset.level = (w == null ? void 0 : w.value) || ""),
        (l.title = y),
        l.setAttribute("aria-label", w ? `${w.label} case: ${y}` : y),
        O(u),
        x(u));
    }
    function U() {
      let u = o.value;
      (_(), Ie(C, u), ai({ modalController: R, triggerButton: l }));
    }
    function J(u, y = null) {
      let v = ri({
        modalController: p,
        title: N,
        image: k,
        caseLabel: fa(u),
        caseValue: u,
        triggerButton: y,
      });
      return (v && h(!1), v);
    }
    function G(u) {
      var W, Z;
      let y = P(),
        v = pa(o.value, y);
      if (!y.length) return;
      if (v === -1) {
        c((W = y[0]) == null ? void 0 : W.value);
        return;
      }
      let w = y.length - 1,
        z = v + u;
      (z < 0 ? (z = w) : z > w && (z = 0),
        c((Z = y[z]) == null ? void 0 : Z.value));
    }
    function c(u) {
      !u ||
        !F(u) ||
        (typeof a == "function" && a(),
        fe({ modalController: p, title: N, image: k, restoreFocus: !1 }),
        (o.value = u),
        o.dispatchEvent(new Event("change", { bubbles: !0 })),
        _(),
        Ie(C, u),
        D(u),
        Ce({ modalController: R, triggerButton: l, restoreFocus: !1 }),
        g.setAttribute("aria-modal", "true"));
    }
    (l.addEventListener("click", () => {
      l.disabled || U();
    }),
      s == null ||
        s.addEventListener("click", () => {
          s.disabled || G(-1);
        }),
      d == null ||
        d.addEventListener("click", () => {
          d.disabled || G(1);
        }),
      m.addEventListener("click", () => {
        (fe({ modalController: p, title: N, image: k, restoreFocus: !1 }),
          Ce({ modalController: R, triggerButton: l, restoreFocus: !0 }),
          g.setAttribute("aria-modal", "true"));
      }),
      g.addEventListener("click", (u) => {
        u.target === g &&
          (fe({ modalController: p, title: N, image: k, restoreFocus: !1 }),
          Ce({ modalController: R, triggerButton: l, restoreFocus: !1 }),
          g.setAttribute("aria-modal", "true"));
      }),
      g.addEventListener("keydown", (u) => {
        u.key !== "Escape" ||
          !u.defaultPrevented ||
          (Ce({ modalController: R, triggerButton: l, restoreFocus: !0 }),
          g.setAttribute("aria-modal", "true"));
      }),
      M.addEventListener("click", () => {
        (fe({ modalController: p, title: N, image: k, restoreFocus: !0 }),
          h(!0));
      }),
      I.addEventListener("keydown", (u) => {
        u.key !== "Escape" ||
          !u.defaultPrevented ||
          (fe({ modalController: p, title: N, image: k, restoreFocus: !0 }),
          h(!0));
      }),
      I.addEventListener("click", (u) => {
        u.target === I &&
          (fe({ modalController: p, title: N, image: k, restoreFocus: !1 }),
          h(!0));
      }),
      window.addEventListener("keydown", (u) => {
        if (!u.defaultPrevented && u.key === "Escape") {
          if (I.getAttribute("aria-hidden") === "false") {
            (fe({ modalController: p, title: N, image: k, restoreFocus: !0 }),
              h(!0));
            return;
          }
          g.getAttribute("aria-hidden") !== "true" &&
            (Ce({ modalController: R, triggerButton: l, restoreFocus: !0 }),
            g.setAttribute("aria-modal", "true"));
        }
      }),
      C.addEventListener("click", (u) => {
        let y =
          u.target instanceof Element
            ? u.target.closest(".visual-case-photo-button")
            : null;
        if (y) {
          J(y.dataset.value, y);
          return;
        }
        let v =
          u.target instanceof Element
            ? u.target.closest(".visual-case-card")
            : null;
        v && c(v.dataset.value);
      }),
      S.addEventListener("click", (u) => {
        let y =
          u.target instanceof Element
            ? u.target.closest(".visual-case-similar-chip")
            : null;
        y && c(y.dataset.value);
      }),
      o.addEventListener("change", (u) => {
        var y;
        if (!F(u.target.value)) {
          let v = (y = P()[0]) == null ? void 0 : y.value;
          v &&
            ((o.value = v),
            o.dispatchEvent(new Event("change", { bubbles: !0 })));
          return;
        }
        (Ie(C, u.target.value), D(u.target.value));
      }));
    function b() {
      var u;
      if ((_(), !F(o.value))) {
        let y = (u = P()[0]) == null ? void 0 : u.value;
        y &&
          ((o.value = y),
          o.dispatchEvent(new Event("change", { bubbles: !0 })));
        return;
      }
      (Ie(C, o.value), D(o.value));
    }
    return (
      _(),
      Ie(C, o.value),
      D(o.value),
      Ce({ modalController: R, triggerButton: l, restoreFocus: !1 }),
      fe({ modalController: p, title: N, image: k, restoreFocus: !1 }),
      g.setAttribute("aria-modal", "true"),
      {
        hasPhotoForCase: (u = o.value) => !!Lt(u),
        openCasePicker: U,
        selectAdjacentCase: G,
        selectCase: c,
        setBabyMode: b,
      }
    );
  }
  var ya = 5e3,
    ni = 900,
    oi = 3e3,
    li = ["Match", "Bright", "Straight"],
    si = ["Light", "Colour", "Shape", "Crescent", "Cornea", "Compare"],
    ci = {
      Bright: 2400,
      Crescent: 2600,
      Compare: 2600,
      Colour: 2400,
      Cornea: 2400,
      Light: 2400,
      Match: 2400,
      Shape: 2400,
      Straight: 2400,
    };
  function Ra({ dom: e, isPrimaryCase: t, state: a }) {
    var G;
    if (
      !e.observationGuide ||
      !e.observationGuideToggle ||
      !((G = e.observationGuideItems) != null && G.length) ||
      !e.observationGuideDetail
    )
      return null;
    let r = "",
      o = "",
      l = "",
      i = 0,
      s = 0,
      d = [],
      g = !1,
      f = () => (t(a.currentRefraction) ? "primary" : "full"),
      m = () => (f() === "primary" ? li : si),
      L = () => {
        var c, b, u, y;
        ((c = e.observationTeachingOverlay) == null ||
          c.classList.remove("is-visible"),
          (b = e.observationTeachingTargets) == null ||
            b.forEach((v) => {
              (v.classList.remove(
                "is-visible",
                "is-crescent-top",
                "is-crescent-bottom",
              ),
                (v.dataset.guideCue = ""),
                v.removeAttribute("style"));
            }),
          (u = e.observationTeachingConnector) == null ||
            u.classList.remove("is-visible"),
          (y = e.observationTeachingConnector) == null ||
            y.removeAttribute("style"));
      },
      S = () => {
        let c = f(),
          b = m();
        (e.observationGuide.classList.toggle(
          "is-primary-guide",
          c === "primary",
        ),
          e.observationGuide.classList.toggle("is-full-guide", c === "full"),
          r && !b.includes(r) && (r = ""),
          o && !b.includes(o) && (o = ""),
          l && !b.includes(l) && ((l = ""), L()));
      },
      C = (c) =>
        e.observationGuideItems.find((b) => b.dataset.guideLabel === c) || null,
      I = () => {
        s && (window.clearTimeout(s), (s = 0));
      },
      E = () => {
        (i && (window.clearTimeout(i), (i = 0)),
          e.observationGuide.classList.remove("is-hint-visible"));
      },
      M = () => {
        (d.forEach((c) => window.clearTimeout(c)), (d = []), (l = ""), L());
      },
      N = (c, b) => {
        let u = window.setTimeout(() => {
          ((d = d.filter((y) => y !== u)), c());
        }, b);
        d.push(u);
      },
      k = () => {
        he() ||
          (E(),
          e.observationGuide.classList.add("is-hint-visible"),
          (i = window.setTimeout(() => {
            (e.observationGuide.classList.remove("is-hint-visible"), (i = 0));
          }, 3e3)));
      },
      R = (c) => {
        var y, v;
        let b =
            (y = e.eyesWrapper) == null ? void 0 : y.getBoundingClientRect(),
          u =
            (v = c == null ? void 0 : c.getBoundingClientRect) == null
              ? void 0
              : v.call(c);
        return !b || !u
          ? null
          : {
              bottom: u.bottom - b.top,
              height: u.height,
              left: u.left - b.left,
              right: u.right - b.left,
              top: u.top - b.top,
              width: u.width,
            };
      },
      p = (
        c,
        b,
        {
          cue: u,
          expandX: y = 0,
          expandY: v = y,
          extraClass: w = "",
          forceCircle: z = !1,
        } = {},
      ) => {
        if (!c || !b) return !1;
        let W = b;
        if (z) {
          let ae = b.left + b.width * 0.5,
            A = b.top + b.height * 0.5,
            H = Math.max(b.width + y * 2, b.height + v * 2);
          ((W = { height: H, left: ae - H * 0.5, top: A - H * 0.5, width: H }),
            (y = 0),
            (v = 0));
        }
        ((c.className = `observation-teaching-target ${c.classList.contains("observation-teaching-target--secondary") ? "observation-teaching-target--secondary" : "observation-teaching-target--primary"}`),
          w && c.classList.add(w),
          (c.dataset.guideCue = u || ""));
        let Z = {
          height: W.height + v * 2,
          left: W.left - y,
          top: W.top - v,
          width: W.width + y * 2,
        };
        return (
          (c.style.left = `${Z.left}px`),
          (c.style.top = `${Z.top}px`),
          (c.style.width = `${Z.width}px`),
          (c.style.height = `${Z.height}px`),
          c.classList.add("is-visible"),
          Z
        );
      },
      h = (c, b) => {
        if (!c) return null;
        let u = c.width * b,
          y = c.height * b;
        return {
          bottom: c.bottom - y,
          height: Math.max(1, c.height - y * 2),
          left: c.left + u,
          right: c.right - u,
          top: c.top + y,
          width: Math.max(1, c.width - u * 2),
        };
      },
      B = (c) => {
        let b = R(c);
        if (!b) return null;
        let u = 16,
          y = (c == null ? void 0 : c.dataset.eye) === "left" ? 1 : -1,
          v = b.left + b.width * 0.5 + y * 8,
          w = b.top + b.height * 0.5;
        return {
          bottom: w + u * 0.5,
          height: u,
          left: v - u * 0.5,
          right: v + u * 0.5,
          top: w - u * 0.5,
          width: u,
        };
      },
      P = (c, b) => {
        if (!c) return null;
        let u = c.width * 0.94,
          y = c.height * 0.48;
        return {
          bottom: b ? c.top + c.height : c.top + y,
          height: y,
          left: c.left + (c.width - u) * 0.5,
          right: c.left + (c.width + u) * 0.5,
          top: b ? c.top + c.height - y : c.top,
          width: u,
        };
      },
      F = (c, b = null) => {
        var $, q, te, ee;
        let u = e.observationTeachingConnector,
          y = C(c),
          v = ($ = e.eyesWrapper) == null ? void 0 : $.getBoundingClientRect(),
          w =
            (q = y == null ? void 0 : y.getBoundingClientRect) == null
              ? void 0
              : q.call(y),
          z = (te = e.observationTeachingTargets) == null ? void 0 : te[0],
          W =
            b ||
            ((ee = z == null ? void 0 : z.getBoundingClientRect) == null
              ? void 0
              : ee.call(z));
        if (!u || !v || !w || !W) return;
        let Z = {
            x: (w.left + w.right) * 0.5 - v.left,
            y: w.bottom - v.top + 5,
          },
          ae = b ? W.left + W.width * 0.5 : (W.left + W.right) * 0.5 - v.left,
          A = b ? W.top - 4 : W.top - v.top - 4,
          H = Z.y + 28,
          V = { x: ae, y: Math.max(A, H) },
          K = V.x - Z.x,
          Q = V.y - Z.y,
          T = Math.hypot(K, Q),
          Y = Math.atan2(Q, K) * (180 / Math.PI);
        ((u.style.left = `${Z.x}px`),
          (u.style.top = `${Z.y}px`),
          (u.style.width = `${T}px`),
          (u.style.transform = `rotate(${Y}deg)`),
          u.classList.add("is-visible"));
      },
      j = (c) => {
        var $, q, te, ee, ie;
        if (
          !e.observationTeachingOverlay ||
          !(($ = e.observationTeachingTargets) != null && $.length) ||
          !e.eyesWrapper
        )
          return;
        L();
        let [b, u] = e.observationTeachingTargets,
          y = (q = e.leftEye) == null ? void 0 : q.querySelector(".pupil"),
          v = (te = e.rightEye) == null ? void 0 : te.querySelector(".pupil"),
          w = R(y),
          z = R(v),
          W = R(e.leftEye),
          Z = R(e.rightEye),
          ae = R(
            (ee = e.leftEye) == null ? void 0 : ee.querySelector(".ret-reflex"),
          ),
          A = R(
            (ie = e.rightEye) == null
              ? void 0
              : ie.querySelector(".ret-reflex"),
          ),
          H = B(e.leftEye),
          V = B(e.rightEye),
          K =
            a.currentRefraction.includes("myopia") ||
            a.currentRefraction.includes("minus"),
          Q = P(w, K),
          T = P(z, K),
          Y = K ? "is-crescent-bottom" : "is-crescent-top";
        if (
          (e.observationTeachingOverlay.classList.add("is-visible"),
          c === "Match")
        ) {
          let X = p(b, W, { cue: c, expandX: 8, expandY: 8 });
          (p(u, Z, { cue: c, expandX: 8, expandY: 8 }), F(c, X));
          return;
        }
        if (c === "Bright") {
          let X = p(b, h(ae || w, 0.16), { cue: c, expandX: 6, expandY: 6 });
          (p(u, h(A || z, 0.16), { cue: c, expandX: 6, expandY: 6 }), F(c, X));
          return;
        }
        if (c === "Straight") {
          let X = p(b, H, { cue: c, forceCircle: !0, expandX: 2, expandY: 2 });
          (p(u, V, { cue: c, forceCircle: !0, expandX: 2, expandY: 2 }),
            F(c, X));
          return;
        }
        if (c === "Light") {
          let X = p(b, w, { cue: c, expandX: 11, expandY: 9 });
          (p(u, z, { cue: c, expandX: 11, expandY: 9 }), F(c, X));
          return;
        }
        if (c === "Shape") {
          let X = p(b, w, { cue: c, expandX: 4, expandY: 4 });
          (p(u, z, { cue: c, expandX: 4, expandY: 4 }), F(c, X));
          return;
        }
        if (c === "Crescent") {
          let X = p(b, Q, { cue: c, extraClass: Y });
          (p(u, T, { cue: c, extraClass: Y }), F(c, X));
          return;
        }
        if (c === "Colour") {
          let X = p(b, h(ae || w, 0.2), { cue: c, expandX: 3, expandY: 3 });
          (p(u, h(A || z, 0.2), { cue: c, expandX: 3, expandY: 3 }), F(c, X));
          return;
        }
        if (c === "Cornea") {
          let X = p(b, H, { cue: c, forceCircle: !0 });
          (p(u, V, { cue: c, forceCircle: !0 }), F(c, X));
          return;
        }
        if (c === "Compare") {
          let X = p(b, W, { cue: c, expandX: 8, expandY: 8 });
          (p(u, Z, { cue: c, expandX: 8, expandY: 8 }), F(c, X));
        }
      },
      _ = (c) => {
        (e.observationGuide.classList.toggle("is-collapsed", c),
          e.observationGuideToggle.setAttribute(
            "aria-expanded",
            c ? "false" : "true",
          ),
          e.observationGuideToggle.setAttribute(
            "aria-label",
            c ? "Open observation guide" : "Close observation guide",
          ),
          (e.observationGuideToggle.title = c
            ? "Open observation guide"
            : "Close observation guide"));
      },
      x = ({ delay: c = ya } = {}) => {
        g ||
          l ||
          d.length ||
          (I(),
          (s = window.setTimeout(() => {
            let b = document.activeElement,
              u =
                b instanceof Element &&
                e.observationGuide.contains(b) &&
                b !== e.observationGuideToggle,
              y = e.observationGuide.matches(":hover");
            if (u || y) {
              x({ delay: c });
              return;
            }
            ((o = ""), E(), _(!0), D());
          }, c)));
      },
      O = ({ replayHint: c = !1 } = {}) => {
        (I(), _(!1), c && k(), g || x());
      },
      D = () => {
        S();
        let c = l || o || r,
          b = C(c);
        if (
          (e.observationGuideItems.forEach((v) => {
            let w = v.dataset.guideLabel === r,
              z = v.dataset.guideLabel === c;
            (v.classList.toggle("is-selected", w),
              v.classList.toggle("is-active", z),
              v.setAttribute("aria-pressed", w ? "true" : "false"));
          }),
          !b)
        ) {
          (e.observationGuideDetail.replaceChildren(),
            e.observationGuideDetail.classList.remove("is-visible"));
          return;
        }
        let u = b.dataset.guideDetail || "",
          y = document.createElement("em");
        ((y.textContent = u),
          e.observationGuideDetail.replaceChildren(y),
          e.observationGuideDetail.classList.add("is-visible"));
      },
      U = () => {
        if ((M(), I(), E(), he())) {
          ((l = m()[0] || ""),
            D(),
            j(l),
            N(() => {
              ((l = ""), L(), D(), _(!0));
            }, ya));
          return;
        }
        let c = ni;
        (m().forEach((b) => {
          (N(() => {
            ((l = b), D(), j(b));
          }, c),
            (c += ci[b] || 2400));
        }),
          N(() => {
            ((l = ""), L(), D());
          }, c),
          N(() => {
            ((o = ""), (r = ""), E(), _(!0), D());
          }, c + oi));
      };
    function J() {
      (e.observationGuide.addEventListener("mouseenter", () => {
        e.observationGuide.classList.contains("is-collapsed") || I();
      }),
        e.observationGuide.addEventListener("mouseleave", () => {
          ((o = ""),
            D(),
            e.observationGuide.classList.contains("is-collapsed") || x());
        }),
        e.observationGuideToggle.addEventListener("click", () => {
          if (
            ((g = !0), e.observationGuide.classList.contains("is-collapsed"))
          ) {
            ((g = !1), O({ replayHint: !0 }), U());
            return;
          }
          (I(), (o = ""), M(), E(), _(!0), D());
        }),
        e.observationGuideItems.forEach((c) => {
          (c.addEventListener("mouseenter", () => {
            (I(), (o = c.dataset.guideLabel || ""), D());
          }),
            c.addEventListener("mouseleave", () => {
              ((o = ""), D(), x());
            }),
            c.addEventListener("focus", () => {
              (M(), E(), O(), (o = c.dataset.guideLabel || ""), D());
            }),
            c.addEventListener("blur", () => {
              ((o = ""), D(), x());
            }),
            c.addEventListener("click", () => {
              (M(), E(), I());
              let b = c.dataset.guideLabel || "";
              ((r = r === b ? "" : b), (o = b), D(), x());
            }));
        }),
        _(!1),
        D(),
        k(),
        x());
    }
    return {
      init: J,
      syncForCurrentCase: () => {
        (M(), D(), x());
      },
    };
  }
  function ui(e) {
    e && (e.style.opacity = "0");
  }
  function di(e, t) {
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
  function gi() {
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
  function mi() {
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
  function hi() {
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
  function fi(e) {
    return e.posteriorCapsularThickeningCase
      ? gi()
      : e.posteriorPoleCataractCase
        ? mi()
        : e.centralSubCorticalCataractCase
          ? hi()
          : null;
  }
  function Ta({ maskElement: e, flags: t, isActiveEye: a }) {
    if (!e) return;
    let r = a && fi(t);
    if (!r) {
      ui(e);
      return;
    }
    di(e, r);
  }
  function ue({
    centredBase: e,
    centredPower: t,
    centredRange: a = 210,
    centredScale: r,
    focusedRange: o,
    retStreakOffset: l,
  }) {
    let i = Math.abs(l),
      s = Math.max(0, 1 - Math.min(1, i / a)),
      d = e + Math.pow(s, t) * r;
    return {
      focusedBeamBoost: Math.max(0, 1 - Math.min(1, i / o)),
      localBeamDistance: i,
      localIlluminationFactor: d,
    };
  }
  function Ca({
    activeRefraction: e,
    currentRefraction: t,
    flags: a,
    retStreakOffset: r,
    sceneRefraction: o,
  }) {
    if (a.normalDarkCase && e === n.NORMAL_DARK) {
      let { focusedBeamBoost: l, localIlluminationFactor: i } = ue({
          centredBase: 0.26,
          centredPower: 0.78,
          centredScale: 0.74,
          focusedRange: 52,
          retStreakOffset: r,
        }),
        s = (0.002 + i * 0.028).toFixed(2),
        d = (0.001 + i * 0.015).toFixed(2),
        g = (0.003 + i * 0.022).toFixed(2),
        f = (0.001 + i * 0.011).toFixed(2),
        m = (0.006 + i * 0.032 + l * 0.011).toFixed(2),
        L = (0.002 + i * 0.014 + l * 0.006).toFixed(2);
      return {
        background: `
      radial-gradient(
        ellipse 42% 22% at 50% 22%,
        rgba(255, 214, 92, ${s}) 0%,
        rgba(255, 198, 60, ${d}) 34%,
        rgba(255, 188, 42, 0) 64%
      ),
      radial-gradient(
        ellipse 54% 24% at 50% 28%,
        rgba(234, 236, 242, ${g}) 0%,
        rgba(234, 236, 242, ${f}) 44%,
        rgba(234, 236, 242, 0) 74%
      ),
      radial-gradient(
        ellipse 70% 62% at 50% 50%,
        rgba(255, 255, 255, ${m}) 0%,
        rgba(255, 255, 255, ${L}) 46%,
        rgba(255, 255, 255, 0) 78%
      )
    `,
        blurPx: 0.1,
        extraTransform: "",
        opacity: Math.min(1, 0.04 + i * 0.038 + l * 0.016),
        shift: 0,
      };
    }
    if (o === n.BILATERAL_HIGH_HYPERMETROPIA) {
      let { focusedBeamBoost: i, localIlluminationFactor: s } = ue({
          centredBase: 0.42,
          centredPower: 0.74,
          centredScale: 0.58,
          focusedRange: 52,
          retStreakOffset: r,
        }),
        d = ((0.09 + s * 0.36) * 1.34).toFixed(2),
        g = ((0.07 + s * 0.28) * 1.34).toFixed(2),
        f = ((0.04 + s * 0.16) * 1.34).toFixed(2),
        m = ((0.07 + s * 0.19 + i * 0.03) * 1.34).toFixed(2),
        L = ((0.04 + s * 0.1 + i * 0.02) * 1.34).toFixed(2),
        S = ((0.08 + s * 0.1 + i * 0.02) * 1.34).toFixed(2),
        C = ((0.03 + s * 0.05 + i * 0.02) * 1.34).toFixed(2),
        I = ((0.18 + s * 0.44) * 1.34).toFixed(2),
        E = ((0.09 + s * 0.28) * 1.34).toFixed(2),
        M = ((0.06 + s * 0.15 + i * 0.06) * 1.34).toFixed(2),
        N = ((0.03 + s * 0.08 + i * 0.03) * 1.34).toFixed(2);
      return {
        background: `
      radial-gradient(
        ellipse 50% 24% at 50% 20%,
        rgba(255, 226, 98, ${d}) 0%,
        rgba(255, 218, 76, ${g}) 30%,
        rgba(255, 208, 56, ${f}) 56%,
        rgba(255, 198, 42, 0) 70%
      ),
      radial-gradient(
        ellipse 60% 20% at 50% 34%,
        rgba(255, 236, 168, ${m}) 0%,
        rgba(255, 246, 224, ${L}) 42%,
        rgba(255, 252, 242, 0) 72%
      ),
      radial-gradient(
        ellipse 46% 14% at 50% 39%,
        rgba(255, 240, 210, ${S}) 0%,
        rgba(255, 246, 228, ${C}) 52%,
        rgba(255, 252, 242, 0) 84%
      ),
      radial-gradient(
        ellipse 124% 60% at 50% 23%,
        rgba(247, 248, 252, ${I}) 0%,
        rgba(247, 248, 252, ${E}) 44%,
        rgba(247, 248, 252, 0) 82%
      ),
      radial-gradient(
        ellipse 68% 60% at 50% 54%,
        rgba(255, 255, 255, ${M}) 0%,
        rgba(255, 255, 255, ${N}) 46%,
        rgba(255, 255, 255, 0) 80%
      )
    `,
        blurPx: 0.08,
        extraTransform: "",
        opacity: Math.min(1, 0.7 + s * 0.28 + i * 0.08),
        shift: 0,
      };
    }
    if (t === n.NORMAL_HYPER) {
      let { focusedBeamBoost: i, localIlluminationFactor: s } = ue({
          centredBase: 0.42,
          centredPower: 0.74,
          centredScale: 0.58,
          focusedRange: 52,
          retStreakOffset: r,
        }),
        d = ((0.1 + s * 0.4) * 1.32).toFixed(2),
        g = ((0.08 + s * 0.32) * 1.32).toFixed(2),
        f = ((0.05 + s * 0.18) * 1.32).toFixed(2),
        m = ((0.06 + s * 0.17 + i * 0.03) * 1.32).toFixed(2),
        L = ((0.03 + s * 0.09 + i * 0.02) * 1.32).toFixed(2),
        S = ((0.1 + s * 0.14 + i * 0.03) * 1.32).toFixed(2),
        C = ((0.04 + s * 0.07 + i * 0.03) * 1.32).toFixed(2),
        I = ((0.14 + s * 0.38) * 1.32).toFixed(2),
        E = ((0.07 + s * 0.24) * 1.32).toFixed(2),
        M = ((0.08 + s * 0.2 + i * 0.08) * 1.32).toFixed(2),
        N = ((0.04 + s * 0.1 + i * 0.04) * 1.32).toFixed(2);
      return {
        background: `
      radial-gradient(
        ellipse 52% 28% at 50% 20%,
        rgba(255, 226, 98, ${d}) 0%,
        rgba(255, 218, 76, ${g}) 30%,
        rgba(255, 208, 56, ${f}) 56%,
        rgba(255, 198, 42, 0) 70%
      ),
      radial-gradient(
        ellipse 56% 18% at 50% 34%,
        rgba(255, 236, 168, ${m}) 0%,
        rgba(255, 246, 224, ${L}) 42%,
        rgba(255, 252, 242, 0) 72%
      ),
      radial-gradient(
        ellipse 50% 17% at 50% 37%,
        rgba(255, 240, 210, ${S}) 0%,
        rgba(255, 246, 228, ${C}) 52%,
        rgba(255, 252, 242, 0) 84%
      ),
      radial-gradient(
        ellipse 98% 48% at 50% 24%,
        rgba(247, 248, 252, ${I}) 0%,
        rgba(247, 248, 252, ${E}) 44%,
        rgba(247, 248, 252, 0) 82%
      ),
      radial-gradient(
        ellipse 76% 70% at 50% 50%,
        rgba(255, 255, 255, ${M}) 0%,
        rgba(255, 255, 255, ${N}) 46%,
        rgba(255, 255, 255, 0) 80%
      )
    `,
        blurPx: 0.08,
        extraTransform: "",
        opacity: Math.min(1, 0.68 + s * 0.3 + i * 0.08),
        shift: 0,
      };
    }
    if (t === n.ZERO || (a.normalDarkCase && e !== n.NORMAL_DARK)) {
      let { focusedBeamBoost: i, localIlluminationFactor: s } = ue({
          centredBase: 0.4,
          centredPower: 0.75,
          centredScale: 0.6,
          focusedRange: 48,
          retStreakOffset: r,
        }),
        d = ((0.08 + s * 0.42) * 1.3).toFixed(2),
        g = ((0.06 + s * 0.34) * 1.3).toFixed(2),
        f = ((0.08 + s * 0.24) * 1.3).toFixed(2),
        m = ((0.03 + s * 0.14) * 1.3).toFixed(2),
        L = ((0.04 + s * 0.18) * 1.3).toFixed(2),
        S = ((0.05 + s * 0.14 + i * 0.03) * 1.3).toFixed(2),
        C = ((0.02 + s * 0.07 + i * 0.02) * 1.3).toFixed(2),
        I = ((0.14 + s * 0.18 + i * 0.03) * 1.3).toFixed(2),
        E = ((0.06 + s * 0.09 + i * 0.03) * 1.3).toFixed(2),
        M = ((0.08 + s * 0.18 + i * 0.08) * 1.3).toFixed(2),
        N = ((0.04 + s * 0.08 + i * 0.04) * 1.3).toFixed(2);
      return {
        background: `
      radial-gradient(
        ellipse 46% 26% at 50% 22%,
        rgba(255, 226, 98, ${d}) 0%,
        rgba(255, 218, 76, ${g}) 28%,
        rgba(255, 208, 56, ${L}) 52%,
        rgba(255, 198, 42, 0) 68%
      ),
      radial-gradient(
        ellipse 48% 16% at 50% 34%,
        rgba(255, 236, 168, ${S}) 0%,
        rgba(255, 246, 224, ${C}) 42%,
        rgba(255, 252, 242, 0) 70%
      ),
      radial-gradient(
        ellipse 44% 18% at 50% 36%,
        rgba(255, 240, 210, ${I}) 0%,
        rgba(255, 246, 228, ${E}) 52%,
        rgba(255, 252, 242, 0) 82%
      ),
      radial-gradient(
        ellipse 62% 28% at 50% 27%,
        rgba(247, 248, 252, ${f}) 0%,
        rgba(247, 248, 252, ${m}) 40%,
        rgba(247, 248, 252, 0) 74%
      ),
      radial-gradient(
        ellipse 74% 68% at 50% 51%,
        rgba(255, 255, 255, ${M}) 0%,
        rgba(255, 255, 255, ${N}) 46%,
        rgba(255, 255, 255, 0) 80%
      )
    `,
        blurPx: 0.08,
        extraTransform: "",
        opacity: Math.min(1, 0.62 + s * 0.34 + i * 0.08),
        shift: 0,
      };
    }
    return null;
  }
  function Ia({
    currentRefraction: e,
    eyeType: t,
    retStreakOffset: a,
    sceneRefraction: r,
  }) {
    if (
      r === n.BILATERAL_MYOPIA ||
      (r === n.RIGHT_HYPER_LEFT_MYOPIA && t === "right")
    ) {
      let { focusedBeamBoost: l, localIlluminationFactor: i } = ue({
          centredBase: 0.42,
          centredPower: 0.74,
          centredScale: 0.58,
          focusedRange: 52,
          retStreakOffset: a,
        }),
        s = ((0.1 + i * 0.4) * 1.32).toFixed(2),
        d = ((0.08 + i * 0.32) * 1.32).toFixed(2),
        g = ((0.05 + i * 0.18) * 1.32).toFixed(2),
        f = ((0.06 + i * 0.17 + l * 0.03) * 1.32).toFixed(2),
        m = ((0.03 + i * 0.09 + l * 0.02) * 1.32).toFixed(2),
        L = ((0.1 + i * 0.14 + l * 0.03) * 1.32).toFixed(2),
        S = ((0.04 + i * 0.07 + l * 0.03) * 1.32).toFixed(2),
        C = ((0.14 + i * 0.38) * 1.32).toFixed(2),
        I = ((0.07 + i * 0.24) * 1.32).toFixed(2),
        E = ((0.08 + i * 0.2 + l * 0.06) * 1.32).toFixed(2),
        M = ((0.04 + i * 0.1 + l * 0.04) * 1.32).toFixed(2);
      return {
        background: `
      radial-gradient(
        ellipse 52% 28% at 50% 80%,
        rgba(255, 226, 98, ${s}) 0%,
        rgba(255, 218, 76, ${d}) 30%,
        rgba(255, 208, 56, ${g}) 56%,
        rgba(255, 198, 42, 0) 70%
      ),
      radial-gradient(
        ellipse 56% 18% at 50% 66%,
        rgba(255, 236, 168, ${f}) 0%,
        rgba(255, 246, 224, ${m}) 42%,
        rgba(255, 252, 242, 0) 72%
      ),
      radial-gradient(
        ellipse 50% 17% at 50% 63%,
        rgba(255, 240, 210, ${L}) 0%,
        rgba(255, 246, 228, ${S}) 52%,
        rgba(255, 252, 242, 0) 84%
      ),
      radial-gradient(
        ellipse 98% 48% at 50% 76%,
        rgba(247, 248, 252, ${C}) 0%,
        rgba(247, 248, 252, ${I}) 44%,
        rgba(247, 248, 252, 0) 82%
      ),
      radial-gradient(
        ellipse 76% 70% at 50% 50%,
        rgba(255, 255, 255, ${E}) 0%,
        rgba(255, 255, 255, ${M}) 46%,
        rgba(255, 255, 255, 0) 80%
      )
    `,
        blurPx: 0.08,
        extraTransform: "",
        opacity: Math.min(1, 0.68 + i * 0.26 + l * 0.08),
        shift: 0,
      };
    }
    if (
      r === n.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS &&
      t === "right" &&
      e === n.ZERO
    ) {
      let { focusedBeamBoost: l, localIlluminationFactor: i } = ue({
          centredBase: 0.4,
          centredPower: 0.75,
          centredScale: 0.6,
          focusedRange: 48,
          retStreakOffset: a,
        }),
        s = ((0.06 + i * 0.28) * 1.72).toFixed(2),
        d = ((0.04 + i * 0.18) * 1.72).toFixed(2),
        g = ((0.02 + i * 0.1) * 1.72).toFixed(2),
        f = ((0.28 + i * 0.4 + l * 0.1) * 1.72).toFixed(2),
        m = ((0.14 + i * 0.24 + l * 0.06) * 1.72).toFixed(2),
        L = ((0.24 + i * 0.34 + l * 0.08) * 1.72).toFixed(2),
        S = ((0.12 + i * 0.18 + l * 0.05) * 1.72).toFixed(2),
        C = ((0.03 + i * 0.08 + l * 0.03) * 1.72).toFixed(2),
        I = ((0.01 + i * 0.04 + l * 0.02) * 1.72).toFixed(2),
        E = ((0.18 + i * 0.44) * 1.72).toFixed(2),
        M = ((0.08 + i * 0.22) * 1.72).toFixed(2),
        N = ((0.18 + i * 0.18 + l * 0.04) * 1.72).toFixed(2),
        k = ((0.08 + i * 0.1 + l * 0.03) * 1.72).toFixed(2),
        R = ((0.06 + i * 0.14 + l * 0.06) * 1.72).toFixed(2),
        p = ((0.02 + i * 0.06 + l * 0.03) * 1.72).toFixed(2);
      return {
        background: `
      radial-gradient(
        ellipse 94% 88% at 50% 50%,
        rgba(255, 255, 255, 0) 50%,
        rgba(255, 255, 255, ${f}) 58%,
        rgba(255, 255, 255, ${f}) 61%,
        rgba(255, 255, 255, ${m}) 70%,
        rgba(255, 255, 255, 0) 82%
      ),
      radial-gradient(
        ellipse 86% 52% at 50% 85%,
        rgba(255, 255, 255, 0) 38%,
        rgba(255, 255, 255, ${L}) 49%,
        rgba(255, 255, 255, ${L}) 53%,
        rgba(255, 255, 255, ${S}) 63%,
        rgba(255, 255, 255, 0) 76%
      ),
      linear-gradient(
        84deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 45%,
        rgba(255, 248, 220, ${f}) 48%,
        rgba(255, 255, 255, ${f}) 49.5%,
        rgba(255, 255, 255, ${m}) 51.5%,
        rgba(255, 255, 255, 0) 55%,
        rgba(255, 255, 255, 0) 100%
      ),
      radial-gradient(
        ellipse 46% 24% at 50% 80%,
        rgba(255, 226, 98, ${s}) 0%,
        rgba(255, 218, 76, ${d}) 30%,
        rgba(255, 208, 56, ${g}) 54%,
        rgba(255, 198, 42, 0) 70%
      ),
      radial-gradient(
        ellipse 52% 16% at 50% 56%,
        rgba(255, 236, 168, ${C}) 0%,
        rgba(255, 246, 224, ${I}) 42%,
        rgba(255, 252, 242, 0) 72%
      ),
      radial-gradient(
        ellipse 72% 32% at 50% 70%,
        rgba(247, 248, 252, ${E}) 0%,
        rgba(247, 248, 252, ${M}) 40%,
        rgba(247, 248, 252, 0) 74%
      ),
      radial-gradient(
        ellipse 54% 20% at 50% 86%,
        rgba(255, 240, 210, ${N}) 0%,
        rgba(255, 246, 228, ${k}) 52%,
        rgba(255, 252, 242, 0) 82%
      ),
      radial-gradient(
        ellipse 74% 68% at 50% 49%,
        rgba(255, 255, 255, ${R}) 0%,
        rgba(255, 255, 255, ${p}) 46%,
        rgba(255, 255, 255, 0) 80%
      )
    `,
        blurPx: 0,
        extraTransform: "",
        opacity: Math.min(1, 0.74 + i * 0.26 + l * 0.08),
        shift: 0,
      };
    }
    if (
      r === n.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY &&
      t === "right" &&
      e === n.ZERO
    ) {
      let { focusedBeamBoost: o, localIlluminationFactor: l } = ue({
          centredBase: 0.46,
          centredPower: 0.72,
          centredScale: 0.54,
          focusedRange: 58,
          retStreakOffset: a,
        }),
        i = (0.18 + l * 0.34).toFixed(2),
        s = (0.12 + l * 0.24 + o * 0.04).toFixed(2),
        d = (0.18 + l * 0.28 + o * 0.05).toFixed(2),
        g = (0.06 + l * 0.16 + o * 0.04).toFixed(2),
        f = (0.14 + l * 0.08 - o * 0.03).toFixed(2),
        m = (0.08 + l * 0.04 - o * 0.02).toFixed(2);
      return {
        background: `
      radial-gradient(
        ellipse 100% 94% at 50% 50%,
        rgba(232, 236, 242, ${d}) 0%,
        rgba(220, 224, 230, ${s}) 34%,
        rgba(188, 194, 202, ${i}) 66%,
        rgba(160, 166, 176, 0.08) 88%,
        rgba(160, 166, 176, 0) 98%
      ),
      radial-gradient(
        ellipse 38% 28% at 61% 43%,
        rgba(58, 62, 70, ${f}) 0%,
        rgba(74, 79, 88, ${m}) 38%,
        rgba(92, 98, 108, 0) 72%
      ),
      radial-gradient(
        ellipse 74% 68% at 50% 50%,
        rgba(248, 250, 252, ${g}) 0%,
        rgba(240, 244, 248, ${s}) 42%,
        rgba(224, 228, 234, 0) 78%
      )
    `,
        blurPx: 0.52,
        extraTransform: " scale(1.08, 1.05)",
        opacity: Math.min(1, 0.74 + l * 0.14 + o * 0.02),
        shift: a * 0.04,
      };
    }
    return null;
  }
  function _a({
    activeRefraction: e,
    currentRefraction: t,
    eyeType: a,
    flags: r,
    retStreakOffset: o,
    sceneRefraction: l,
  }) {
    return (
      Ca({
        activeRefraction: e,
        currentRefraction: t,
        flags: r,
        retStreakOffset: o,
        sceneRefraction: l,
      }) ||
      Ia({
        currentRefraction: t,
        eyeType: a,
        retStreakOffset: o,
        sceneRefraction: l,
      })
    );
  }
  function xa({
    axisDeltaRad: e,
    cataractLevel: t,
    cylinderAxisDeg: a,
    flags: r,
    lastBlinkAgeSec: o = 1 / 0,
    movementSign: l = 0,
    retStreakOffset: i,
    timeSec: s,
  }) {
    if (r.scissorsCase) {
      let d = Math.min(25, 10 + Math.abs(i) * 0.4),
        g = Math.max(-16, Math.min(16, i * 0.22)),
        f = (50 - d + g).toFixed(1),
        m = (50 + d + g).toFixed(1),
        L = (37 - g * 0.35).toFixed(1),
        S = (63 + g * 0.35).toFixed(1);
      return {
        background: `
      radial-gradient(
        ellipse 46% 42% at ${f}% ${L}%,
        rgba(255, 255, 255, 0.86) 0%,
        rgba(255, 255, 255, 0.3) 34%,
        rgba(255, 255, 255, 0.05) 62%,
        rgba(255, 255, 255, 0) 76%
      ),
      radial-gradient(
        ellipse 46% 42% at ${m}% ${S}%,
        rgba(255, 255, 255, 0.86) 0%,
        rgba(255, 255, 255, 0.3) 34%,
        rgba(255, 255, 255, 0.05) 62%,
        rgba(255, 255, 255, 0) 76%
      )
    `,
        shift: i * 0.05,
        extraTransform: " scale(1.06, 1.02)",
        blurPx: 0.62,
        opacity: Math.abs(i) < 1 ? 0.8 : 0.74,
      };
    }
    if (r.keratoconusCase) {
      let d = Math.sin(s * 3.2 + e * 1.35),
        g = 12 + 3.4 * Math.sin(s * 0.65),
        f = (50 - g).toFixed(1),
        m = (63 + d * 4).toFixed(1),
        L = (52 + g * 0.35).toFixed(1),
        S = (39 - d * 2.6).toFixed(1);
      return {
        background: `
      radial-gradient(
        ellipse 58% 50% at ${f}% ${m}%,
        rgba(255, 255, 255, 0.98) 0%,
        rgba(255, 255, 255, 0.34) 28%,
        rgba(255, 255, 255, 0.06) 58%,
        rgba(255, 255, 255, 0) 74%
      ),
      radial-gradient(
        ellipse 48% 44% at ${L}% ${S}%,
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
    `,
        shift: i * l * 0.18 + Math.sin(s * 5.9 + e) * 1.3,
        extraTransform: " scale(1.26, 1.14)",
        blurPx: 1.12 + (1 - Math.abs(l)) * 1.22,
        opacity: Math.abs(i) < 1 ? 0.84 : 0.7,
      };
    }
    if (r.aphakiaCase)
      return {
        background: `
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
    `,
        shift: i * 0.06,
        extraTransform: " scale(1.02, 1.06)",
        blurPx: 0.08,
        opacity: Math.abs(i) < 1 ? 1 : 0.96,
      };
    if (r.cornealScarCase)
      return {
        background: `
      conic-gradient(
        from ${(((a + 22) % 180) * 2).toFixed(1)}deg at 50% 50%,
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
    `,
        shift: i * 0.12,
        extraTransform: " scale(1.09, 1.05)",
        blurPx: 1.35,
        opacity: Math.abs(i) < 1 ? 0.84 : 0.72,
      };
    if (r.partialRetinalDetachmentCase) {
      let d = Math.abs(i),
        g = 0.88;
      if (d > 20 && d < 42) {
        let f = (d - 20) / 22;
        g = 0.88 - f * f * (3 - 2 * f) * 0.83;
      } else d >= 42 && (g = 0.05);
      return {
        background: `
      radial-gradient(
        ellipse 74% 60% at 56% 54%,
        rgba(255, 255, 255, 0.92) 0%,
        rgba(255, 255, 255, 0.28) 34%,
        rgba(255, 255, 255, 0.08) 64%,
        rgba(255, 255, 255, 0) 82%
      )
    `,
        shift: 0,
        extraTransform: " scale(1.06, 1.03)",
        blurPx: 0.1,
        opacity: g,
      };
    }
    if (r.poorTearFilmCase) {
      let d = Number.isFinite(o) ? Math.max(0, 1 - Math.min(1, o / 1.45)) : 0,
        g =
          50 +
          Math.sin(s * 2.2) * 6 +
          Math.sin(s * 3.7 + 1.2) * 2.2 +
          Math.sin(s * 0.7 + 0.4) * 1.4,
        f = 50 + Math.cos(s * 1.9 + 0.4) * 4 + Math.sin(s * 3.1 + 0.9) * 1.3,
        m =
          0.55 + 0.25 * Math.sin(s * 2.6 + 0.9) + 0.2 * Math.sin(s * 4.9 + 0.2),
        L = Math.max(0.08, Math.min(0.98, m));
      return {
        background: `
      radial-gradient(
        ellipse at ${g.toFixed(1)}% ${f.toFixed(1)}%,
        rgba(255, 255, 255, 0.98) 14%,
        rgba(255, 255, 255, ${(0.22 + L * 0.24).toFixed(2)}) 36%,
        rgba(255, 255, 255, 0.04) 72%,
        rgba(255, 255, 255, 0) 82%
      )
    `,
        shift:
          i * 0.18 +
          Math.sin(s * 3.8 + 0.6) * (1.2 - d * 0.58) +
          Math.sin(s * 7.1 + 2.1) * (0.55 - d * 0.28),
        extraTransform: "",
        blurPx: Math.max(0.08, 0.45 + L * 1.35 - d * 0.58),
        opacity: 0.34 + L * 0.5 + d * 0.12,
      };
    }
    return r.corticalCataractCase
      ? {
          background: null,
          shift: i * 0.2,
          extraTransform: "",
          blurPx: r.bigCorticalCataractCase ? 0.65 : 0.4,
          opacity:
            Math.abs(i) < 1
              ? r.bigCorticalCataractCase
                ? 0.82
                : 0.88
              : r.bigCorticalCataractCase
                ? 0.7
                : 0.78,
        }
      : r.centralSubCorticalCataractCase
        ? {
            background: `
      radial-gradient(
        ellipse 74% 68% at 50% 50%,
        rgba(255, 255, 255, 0.52) 0%,
        rgba(255, 255, 255, 0.18) 28%,
        rgba(255, 255, 255, 0.04) 58%,
        rgba(255, 255, 255, 0) 80%
      )
    `,
            shift: i * 0.2,
            extraTransform: "",
            blurPx: 0.88 + t * 0.005,
            opacity: Math.abs(i) < 1 ? 0.64 : 0.5,
          }
        : r.posteriorPoleCataractCase
          ? {
              background: `
      radial-gradient(
        ellipse 74% 68% at 50% 50%,
        rgba(255, 255, 255, 0.58) 0%,
        rgba(255, 255, 255, 0.16) 26%,
        rgba(255, 255, 255, 0.04) 54%,
        rgba(255, 255, 255, 0) 76%
      )
    `,
              shift: i * 0.18,
              extraTransform: "",
              blurPx: 1,
              opacity: Math.abs(i) < 1 ? 0.54 : 0.44,
            }
          : r.posteriorCapsularThickeningCase
            ? {
                background: `
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
    `,
                shift: i * 0.08,
                extraTransform: "",
                blurPx: 0.24,
                opacity: Math.abs(i) < 1 ? 0.82 : 0.7,
              }
            : r.denseCataractCase
              ? {
                  background: `
      radial-gradient(
        ellipse 96% 88% at 50% 50%,
        rgba(0, 0, 0, 0.96) 0%,
        rgba(0, 0, 0, 0.84) 46%,
        rgba(0, 0, 0, 0.48) 74%,
        rgba(0, 0, 0, 0) 92%
      ),
      radial-gradient(
        ellipse 38% 32% at 34% 38%,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 1) 28%,
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
    `,
                  shift: i * 0.08,
                  extraTransform: " scale(1.02, 1.02)",
                  blurPx: 1.16,
                  opacity: 0.82,
                }
              : r.leucocoriaCase
                ? {
                    background: `
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
    `,
                    shift: i * 0.03,
                    extraTransform: " scale(1.1, 1.08)",
                    blurPx: 0.12,
                    opacity: Math.abs(i) < 1 ? 0.9 : 0.74,
                  }
                : null;
  }
  function Oa(e) {
    return e === n.ZERO ? null : e.includes(n.PLUS);
  }
  function Ma(e) {
    switch (e) {
      case n.HIGH_MINUS:
      case n.HIGH_PLUS:
        return 0.1;
      case n.MINUS:
      case n.PLUS:
        return 0.3;
      default:
        return 0.2;
    }
  }
  function At({
    activeRefraction: e,
    axisDeltaRad: t,
    cataractLevel: a,
    cylinderAxisDeg: r,
    currentRefraction: o,
    eyeType: l,
    flags: i,
    globalLightOffset: s = 0,
    lastBlinkAgeSec: d = 1 / 0,
    movementSign: g,
    retStreakOffset: f,
    retStreakOffsetY: m = 0,
    sceneRefraction: L = o,
    timeSec: S,
  }) {
    let C = Ke,
      I = 0,
      E = Math.abs(f) < 1 ? 1 : 0.6,
      M = "",
      N = 0,
      k = xa({
        axisDeltaRad: t,
        cataractLevel: a,
        cylinderAxisDeg: r,
        flags: i,
        lastBlinkAgeSec: d,
        movementSign: g,
        retStreakOffset: f,
        retStreakOffsetY: m,
        timeSec: S,
      }),
      R = _a({
        activeRefraction: e,
        currentRefraction: o,
        eyeType: l,
        flags: i,
        retStreakOffset: f,
        sceneRefraction: L,
      });
    if (k)
      (k.background && (C = k.background),
        (I = k.shift),
        (E = k.opacity),
        (M = k.extraTransform),
        (N = k.blurPx));
    else if (R)
      ((C = R.background),
        (I = R.shift),
        (E = R.opacity),
        (M = R.extraTransform),
        (N = R.blurPx));
    else if (o === n.HIGH_PLUS || o === n.HIGH_MINUS) {
      let p = o === n.HIGH_PLUS ? 28 : 72;
      C = `
      radial-gradient(
        ellipse 46% 30% at ${(50 + Math.max(-8, Math.min(8, f * 0.06))).toFixed(1)}% ${p}%,
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
      let B = f * Ma(e),
        P = Oa(e);
      ((I = P === !0 ? B : P === !1 ? -B : 0),
        (N = 0.12),
        (E = Math.abs(f) < 1 ? 1 : 0.76));
    } else if (i.cylinderCase) {
      let p = o === n.HIGH_CYLINDER,
        h = Math.pow(Math.abs(g), 0.9) * (p ? 0.75 : 0.58);
      I = f * g * h;
      let B = Math.abs(Math.cos(t)),
        P = p ? 0.34 : 0.52,
        F = p ? 1.45 : 1.24,
        j = P + (1 - B) * (F - P),
        _ = p ? 1.08 + (1 - B) * 0.24 : 1.04 + (1 - B) * 0.14;
      ((M = ` scale(${j.toFixed(3)}, ${_.toFixed(3)})`),
        (N = (1 - B) * (p ? 1.6 : 1.05)),
        (E = Math.abs(f) < 1 ? 1 : (p ? 0.28 : 0.38) + B * (p ? 0.62 : 0.46)));
    } else {
      let p = f * Ma(e),
        h = Oa(e);
      I = h === !0 ? p : h === !1 ? -p : 0;
    }
    return {
      background: C,
      blurPx: N,
      extraTransform: M,
      opacity: E,
      shift: I,
    };
  }
  function va(e = document) {
    return e.getElementById("ret-streak-visual");
  }
  function tt(e, t) {
    if (!e || !t) return null;
    let a = e.getBoundingClientRect();
    return {
      x: (a.left + a.right) / 2 - t.left,
      y: (a.top + a.bottom) / 2 - t.top,
    };
  }
  function Sa(e, t) {
    if (!e || !t) return null;
    let a = e.getBoundingClientRect();
    return {
      x: (a.left + a.right) / 2 - t.left,
      y: (a.top + a.bottom) / 2 - t.top,
    };
  }
  function at({ wrapperRect: e, leftEye: t, rightEye: a }) {
    if (!e) return null;
    let r = Sa(t, e),
      o = Sa(a, e);
    return r && o ? { x: (r.x + o.x) * 0.5, y: (r.y + o.y) * 0.5 } : r || o;
  }
  function Na({
    retStreak: e,
    retStreakVisual: t,
    eyesWrapper: a,
    leftEye: r,
    rightEye: o,
  }) {
    if (!e || !a) return;
    let l = a.getBoundingClientRect(),
      i = at({ wrapperRect: l, leftEye: r, rightEye: o });
    i &&
      ((e.style.left = `${i.x}px`),
      (e.style.top = `${i.y}px`),
      t && ((t.style.left = `${i.x}px`), (t.style.top = `${i.y}px`)));
  }
  function Ba({
    retStreak: e,
    retStreakVisual: t,
    retStreakOffset: a,
    retStreakOffsetY: r = 0,
  }) {
    e &&
      ((e.style.transform = `translate(-50%, -50%) translate(${a}px, ${r}px)`),
      t &&
        ((t.style.transform = `translate(-50%, -50%) translate(${a}px, ${r}px)`),
        t.classList.toggle(
          "is-emphasized",
          e.classList.contains("is-hint-visible") ||
            e.matches(":focus-visible"),
        )));
  }
  function Et({ eyesWrapper: e, leftEye: t, rightEye: a, defaultLimit: r }) {
    let o = e == null ? void 0 : e.getBoundingClientRect(),
      l = at({ wrapperRect: o, leftEye: t, rightEye: a });
    if (!o || !l) return { min: -r, max: r };
    let i = [t, a]
      .map((s) => (s == null ? void 0 : s.querySelector(".pupil")))
      .map((s) => tt(s, o))
      .filter(Boolean)
      .map((s) => s.x - l.x);
    return i.length
      ? { min: Math.ceil(Math.min(...i)), max: Math.floor(Math.max(...i)) }
      : { min: -r, max: r };
  }
  function yt({ eyesWrapper: e, leftEye: t, rightEye: a, defaultLimit: r }) {
    var g;
    let o = [t, a]
        .map((f) => {
          var m;
          return (m = f == null ? void 0 : f.getBoundingClientRect) == null
            ? void 0
            : m.call(f).height;
        })
        .filter((f) => Number.isFinite(f) && f > 0),
      l = o.length ? Math.round(Math.min(...o) * 0.24) : r,
      i =
        (g = e == null ? void 0 : e.getBoundingClientRect) == null
          ? void 0
          : g.call(e).height,
      s = Number.isFinite(i) ? Math.max(8, Math.round(i * 0.04)) : r,
      d = Math.max(8, Math.min(r, l, s));
    return { min: -d, max: d };
  }
  function Pa({
    value: e,
    currentValue: t,
    eyesWrapper: a,
    leftEye: r,
    rightEye: o,
    defaultLimit: l,
  }) {
    let i = Number.isFinite(e) ? e : Number.parseFloat(e);
    if (Number.isNaN(i)) return t;
    let { min: s, max: d } = Et({
      eyesWrapper: a,
      leftEye: r,
      rightEye: o,
      defaultLimit: l,
    });
    return Math.max(s, Math.min(d, Math.round(i)));
  }
  function wa({
    value: e,
    currentValue: t,
    eyesWrapper: a,
    leftEye: r,
    rightEye: o,
    defaultLimit: l,
  }) {
    let i = Number.isFinite(e) ? e : Number.parseFloat(e);
    if (Number.isNaN(i)) return t;
    let { min: s, max: d } = yt({
      eyesWrapper: a,
      leftEye: r,
      rightEye: o,
      defaultLimit: l,
    });
    return Math.max(s, Math.min(d, Math.round(i)));
  }
  function Fa({
    beamCentre: e,
    eyeType: t,
    pupilRadiusPx: a,
    sweepX: r,
    sweepY: o,
    wrapperRect: l,
    leftEye: i,
    rightEye: s,
  }) {
    let d = Math.hypot(r, o),
      g = t === "left" ? s : i,
      f = tt(g == null ? void 0 : g.querySelector(".pupil"), l),
      m = e && f ? Math.hypot(e.x - f.x, e.y - f.y) : d,
      L = Math.max(0, d - m),
      S = Math.max(72, a * 4.8),
      C = Math.max(0, Math.min(1, L / S)),
      I = C * C * (3 - 2 * C);
    return { currentDistancePx: d, fellowDistancePx: m, smoothT: I };
  }
  function ka({ flags: e, sweepX: t = 0, sweepY: a = 0, timeSec: r }) {
    if (
      !e.floatersCase &&
      !e.iridocyclitisKpsCase &&
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
          ellipse 28% 20% at 36% 46%,
          rgba(224, 202, 110, 0.42) 0%,
          rgba(224, 202, 110, 0.24) 34%,
          rgba(224, 202, 110, 0.08) 58%,
          rgba(224, 202, 110, 0) 74%
        ),
        radial-gradient(
          ellipse 18% 14% at 42% 50%,
          rgba(198, 174, 88, 0.36) 0%,
          rgba(198, 174, 88, 0.18) 38%,
          rgba(198, 174, 88, 0.06) 58%,
          rgba(198, 174, 88, 0) 76%
        ),
        radial-gradient(
          ellipse 20% 16% at 62% 46%,
          rgba(146, 138, 130, 0.52) 0%,
          rgba(146, 138, 130, 0.28) 34%,
          rgba(146, 138, 130, 0.08) 56%,
          rgba(146, 138, 130, 0) 74%
        ),
        radial-gradient(
          ellipse 13% 10% at 57% 53%,
          rgba(128, 120, 112, 0.42) 0%,
          rgba(128, 120, 112, 0.2) 34%,
          rgba(128, 120, 112, 0.06) 54%,
          rgba(128, 120, 112, 0) 72%
        ),
        radial-gradient(
          ellipse 12% 9% at 69% 40%,
          rgba(118, 112, 106, 0.36) 0%,
          rgba(118, 112, 106, 0.16) 34%,
          rgba(118, 112, 106, 0.04) 52%,
          rgba(118, 112, 106, 0) 70%
        ),
        radial-gradient(
          ellipse 20% 16% at 29% 34%,
          rgba(140, 130, 116, 0.54) 0%,
          rgba(140, 130, 116, 0.28) 32%,
          rgba(102, 102, 102, 0) 58%
        ),
        radial-gradient(
          ellipse 17% 14% at 68% 32%,
          rgba(148, 138, 122, 0.5) 0%,
          rgba(148, 138, 122, 0.24) 30%,
          rgba(112, 112, 112, 0) 56%
        ),
        radial-gradient(
          ellipse 18% 15% at 63% 69%,
          rgba(142, 132, 118, 0.48) 0%,
          rgba(142, 132, 118, 0.22) 30%,
          rgba(108, 108, 108, 0) 56%
        ),
        radial-gradient(
          ellipse 15% 12% at 44% 57%,
          rgba(152, 142, 126, 0.44) 0%,
          rgba(152, 142, 126, 0.22) 28%,
          rgba(118, 118, 118, 0) 52%
        ),
        radial-gradient(
          ellipse 24% 18% at 38% 42%,
          rgba(166, 154, 138, 0.4) 0%,
          rgba(166, 154, 138, 0.2) 30%,
          rgba(116, 116, 116, 0) 54%
        ),
        radial-gradient(
          ellipse 18% 14% at 62% 36%,
          rgba(174, 162, 146, 0.38) 0%,
          rgba(174, 162, 146, 0.18) 28%,
          rgba(136, 136, 136, 0) 50%
        ),
        radial-gradient(
          ellipse 22% 16% at 58% 64%,
          rgba(168, 156, 140, 0.36) 0%,
          rgba(168, 156, 140, 0.16) 30%,
          rgba(130, 130, 130, 0) 52%
        ),
        radial-gradient(
          ellipse 28% 22% at 34% 40%,
          rgba(196, 182, 160, 0.3) 0%,
          rgba(196, 182, 160, 0.14) 34%,
          rgba(156, 156, 156, 0) 58%
        ),
        radial-gradient(
          ellipse 22% 18% at 64% 34%,
          rgba(204, 190, 168, 0.26) 0%,
          rgba(204, 190, 168, 0.12) 30%,
          rgba(166, 166, 166, 0) 54%
        ),
        radial-gradient(
          ellipse 26% 20% at 58% 66%,
          rgba(188, 174, 154, 0.28) 0%,
          rgba(188, 174, 154, 0.12) 30%,
          rgba(146, 146, 146, 0) 54%
        ),
        radial-gradient(
          ellipse 20% 16% at 46% 54%,
          rgba(212, 198, 176, 0.18) 0%,
          rgba(212, 198, 176, 0.08) 28%,
          rgba(170, 170, 170, 0) 50%
        ),
        radial-gradient(
          ellipse 16% 14% at 72% 58%,
          rgba(192, 178, 158, 0.16) 0%,
          rgba(192, 178, 158, 0.08) 26%,
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
    if (e.iridocyclitisKpsCase)
      return {
        background: `
        radial-gradient(ellipse 8.4% 8.4% at 10% 14%, rgba(0, 0, 0, 0.99) 0%, rgba(0, 0, 0, 0.99) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 7.2% 7.2% at 20% 24%, rgba(0, 0, 0, 0.97) 0%, rgba(0, 0, 0, 0.97) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 8% 8% at 28% 12%, rgba(0, 0, 0, 0.99) 0%, rgba(0, 0, 0, 0.99) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 7% 7% at 40% 18%, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.95) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 7.8% 7.8% at 54% 14%, rgba(0, 0, 0, 0.97) 0%, rgba(0, 0, 0, 0.97) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 6.8% 6.8% at 58% 28%, rgba(0, 0, 0, 0.93) 0%, rgba(0, 0, 0, 0.93) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 7.2% 7.2% at 16% 40%, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.92) 46%, rgba(0, 0, 0, 0) 68%),
        radial-gradient(ellipse 6.6% 6.6% at 34% 38%, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.9) 46%, rgba(0, 0, 0, 0) 68%)
      `,
        blurPx: 0.02,
        opacity: 0.88,
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
    let o = Math.sin(r * 0.32) * 2.2 + Math.cos(r * 0.21 + 0.4) * 1.1,
      l = Math.cos(r * 0.28 + 0.7) * 1.7 + Math.sin(r * 0.18 + 1.1) * 0.8;
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
      transform: `translate(${o.toFixed(2)}px, ${l.toFixed(2)}px)`,
    };
  }
  function pi(e, t) {
    if (!e || !t) return null;
    let a = e.getBoundingClientRect();
    return {
      x: (a.left + a.right) / 2 - t.left,
      y: (a.top + a.bottom) / 2 - t.top,
    };
  }
  function Ha({
    beamCentre: e,
    eyeType: t,
    pupilRadiusPx: a,
    sweepX: r,
    sweepY: o,
    wrapperRect: l,
    leftEye: i,
    rightEye: s,
  }) {
    let d = Math.hypot(r, o),
      g = t === "left" ? s : i,
      f = pi(g == null ? void 0 : g.querySelector(".pupil"), l),
      m = e && f ? Math.hypot(e.x - f.x, e.y - f.y) : d,
      L = Math.max(0, d - m),
      S = Math.max(72, a * 4.8),
      C = Math.max(0, Math.min(1, L / S)),
      I = C * C * (3 - 2 * C);
    return { currentDistancePx: d, fellowDistancePx: m, smoothT: I };
  }
  var Ga = 0.02,
    Da = 0.8,
    Ua = 0.6;
  function qa(e, t, a) {
    return Math.max(t, Math.min(a, e));
  }
  function bi() {
    return { left: null, right: null };
  }
  function Ya(e) {
    return e === Me.BIG_CORTICAL_CATARACT
      ? { left: oe(!0), right: oe(!0) }
      : e === Me.SMALL_CORTICAL_CATARACT
        ? { left: oe(!1), right: oe(!1) }
        : e === Me.RIGHT_BIG_CORTICAL_LEFT_SMALL_CORTICAL
          ? { left: oe(!0), right: oe(!1) }
          : null;
  }
  function $a({
    beamCentre: e,
    eye: t,
    eyeType: a,
    leftEye: r,
    lightOffsetX: o = 0,
    lightOffsetY: l = 0,
    pupilRadiusPx: i,
    rightEye: s,
    sweepX: d,
    sweepY: g,
    wrapperRect: f,
  }) {
    if (!t) return;
    let { currentDistancePx: m, fellowDistancePx: L } = Ha({
        beamCentre: e,
        eyeType: a,
        leftEye: r,
        pupilRadiusPx: i,
        rightEye: s,
        sweepX: d,
        sweepY: g,
        wrapperRect: f,
      }),
      S = Math.max(72, i * 4.8),
      C = L - m,
      I = Math.max(0, Math.min(1, Math.abs(C) / S)),
      E = I * I * (3 - 2 * I),
      M = C > 0 ? 1 + E * 0.2 : 1 - E * 0.14;
    (t.style.setProperty("--corneal-reflex-scale", M.toFixed(3)),
      t.style.setProperty(
        "--corneal-reflex-light-x",
        `${qa(o * Ga, -Da, Da).toFixed(2)}px`,
      ),
      t.style.setProperty(
        "--corneal-reflex-light-y",
        `${qa(l * Ga, -Ua, Ua).toFixed(2)}px`,
      ));
  }
  function Va({
    maskElement: e,
    isActiveEye: t,
    flags: a,
    eyeType: r,
    corticalCataractPattern: o,
  }) {
    if (!e) return o;
    if (!(a.corticalCataractCase && t))
      return (
        (e.style.opacity = "0"),
        (e.style.background = "none"),
        (e.style.maskImage = "none"),
        (e.style.webkitMaskImage = "none"),
        (e.style.transform = "none"),
        o
      );
    let i = a.bigCorticalCataractCase,
      s = o && typeof o == "object" ? o : bi(),
      d = r === "right" ? "right" : "left",
      g = s[d] || oe(i);
    ((s[d] = g), (e.style.background = Ze(g)));
    let f = i
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
        rgba(0, 0, 0, 0.92) 74%,
        rgba(0, 0, 0, 1) 100%
      )`;
    return (
      (e.style.maskImage = f),
      (e.style.webkitMaskImage = f),
      (e.style.filter = i ? "blur(0.36px)" : "blur(0.24px)"),
      (e.style.transform = "none"),
      (e.style.opacity = i ? "0.94" : "0.9"),
      s
    );
  }
  function Rt(e) {
    e &&
      ((e.style.opacity = "0"),
      (e.style.background = "none"),
      (e.style.transform = "none"),
      (e.style.filter = "none"));
  }
  function Li({ flags: e, pupilRadiusPx: t, sweepX: a, sweepY: r }) {
    if (e.partialRetinalDetachmentCase || e.iridocyclitisKpsCase) return 1;
    if (e.leucocoriaCase) {
      let L = Math.hypot(a, r),
        S = t * 0.55,
        C = t * 2.8,
        I = Math.max(1, C - S),
        E = Math.max(0, Math.min(1, (L - S) / I)),
        M = E * E * (3 - 2 * E);
      return 0.8 + (1 - Math.pow(M, 1.45)) * 0.16;
    }
    if (!e.floatersCase && !e.vitreousHaemorrhageCase) return 0;
    let o = Math.hypot(a, r),
      l = t * (e.vitreousHaemorrhageCase ? 0.74 : 0.84),
      i = t * (e.vitreousHaemorrhageCase ? 6.1 : 6.4),
      s = Math.max(1, i - l),
      d = Math.max(0, Math.min(1, (o - l) / s)),
      g = d * d * (3 - 2 * d),
      f = Math.pow(g, e.vitreousHaemorrhageCase ? 1.35 : 1.55),
      m = e.vitreousHaemorrhageCase ? 0.26 : 0.18;
    return m + (1 - f) * (1 - m);
  }
  function za({
    flags: e,
    isActiveEye: t,
    overlayElement: a,
    pupilRadiusPx: r,
    sweepX: o,
    sweepY: l,
    timeSec: i,
  }) {
    if (!a || !t) {
      Rt(a);
      return;
    }
    let s = ka({ flags: e, sweepX: o, sweepY: l, timeSec: i });
    if (s.opacity <= 0 || s.background === "none") {
      Rt(a);
      return;
    }
    let d = Li({ flags: e, pupilRadiusPx: r, sweepX: o, sweepY: l });
    if (d <= 0.01) {
      Rt(a);
      return;
    }
    ((a.style.background = s.background),
      (a.style.transform = s.transform || "none"),
      (a.style.filter =
        s.blurPx > 0.01 ? `blur(${s.blurPx.toFixed(2)}px)` : "none"),
      (a.style.opacity = Math.min(1, s.opacity * d).toFixed(3)));
  }
  function Tt(e) {
    e &&
      ((e.style.opacity = "0"),
      (e.style.background = "none"),
      (e.style.transform = "none"),
      (e.style.filter = "none"));
  }
  function Ka({
    eye: e,
    reflexSelector: t,
    shouldShow: a,
    reflexBackground: r,
    reflexTransform: o,
    reflexOpacity: l,
    reflexFilter: i,
  }) {
    let s = e == null ? void 0 : e.querySelector(t);
    if (s) {
      if (!a) {
        Tt(s);
        return;
      }
      ((s.style.background = r),
        (s.style.transform = o),
        (s.style.opacity = l),
        (s.style.filter = i));
    }
  }
  function Xa({
    eye: e,
    eyeType: t,
    flags: a,
    isActiveEye: r,
    sceneRefraction: o,
    sizeProfile: l = "live",
  }) {
    if (!e) return;
    let i = o === n.BILATERAL_DULL_REFLEX,
      s = o === n.RIGHT_IOL_LEFT_POSTERIOR_CAPSULAR_THICKENING && t === "left",
      d = o === n.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY && t === "right",
      g = o === n.RIGHT_NORMAL_LEFT_SUBLUXATED_LENS && t === "right",
      f = o === n.TECHNIQUE_UPPER_LID_BLOCKING;
    (e.classList.toggle("is-corneal-scar", (a.cornealScarCase || i) && r),
      e.classList.toggle("is-technique-upper-lid-block", f && r),
      e.classList.toggle("has-iol-reflection", s && r),
      e.classList.toggle("has-corneal-opacity-reflex", d && r),
      e.classList.toggle("has-subluxated-lens-edge", g && r));
    let m = e.querySelector(".pupil"),
      L = e.querySelector(".coloboma-extension"),
      S = e.querySelector(".coloboma-extension-reflex"),
      C = e.querySelector(".iris-transillumination-patch"),
      I = e.querySelector(".iris-transillumination-reflex"),
      E = Math.max(
        10,
        parseFloat((m == null ? void 0 : m.dataset.baseSizePx) || "") ||
          (m == null ? void 0 : m.clientWidth) ||
          32,
      ),
      M = a.acgCase && r,
      N = a.aniridiaCase,
      k = a.irisTransilluminationCase && r,
      R = a.nasalColobomaCase && r,
      p = a.smallPupilsCase,
      h = o === n.RIGHT_NORMAL_LEFT_ANISOCORIA && t === "right";
    if (m) {
      let B = E,
        P = E;
      if (l === "preview")
        if (N) {
          let F = Math.min(44, Math.max(41, E * 2.6));
          ((B = F), (P = F));
        } else if (h) {
          let F = Math.max(11, Math.min(13, E * 0.72));
          ((B = F), (P = F));
        } else if (p) {
          let F = Math.max(9, Math.min(11, E * 0.6));
          ((B = F), (P = F));
        } else
          M &&
            ((B = Math.min(21, Math.max(18, E * 1.18))),
            (P = Math.min(25, Math.max(22, E * 1.46))));
      else if (N) {
        let F = Math.min(74, Math.max(66, E * 2.25));
        ((B = F), (P = F));
      } else if (h) {
        let F = Math.max(24, Math.min(27, E * 0.82));
        ((B = F), (P = F));
      } else if (p) {
        let F = Math.max(18, Math.min(22, E * 0.62));
        ((B = F), (P = F));
      } else
        M &&
          ((B = Math.min(38, Math.max(34, E * 1.08))),
          (P = Math.min(46, Math.max(40, E * 1.34))));
      ((m.style.width = `${B}px`),
        (m.style.height = `${P}px`),
        (m.style.left = `calc(50% - ${B / 2}px)`),
        (m.style.top = `calc(50% - ${P / 2}px)`));
    }
    (L &&
      (L.classList.toggle("is-visible", R),
      L.classList.toggle("is-screen-left", R && t === "left"),
      L.classList.toggle("is-screen-right", R && t === "right")),
      R || Tt(S),
      C &&
        (C.classList.toggle("is-visible", k),
        C.classList.toggle("is-screen-left", k && t === "left"),
        C.classList.toggle("is-screen-right", k && t === "right")),
      k || Tt(I));
  }
  function Wa({
    eye: e,
    flags: t,
    reflexBackground: a,
    reflexTransform: r,
    reflexOpacity: o,
    reflexFilter: l,
  }) {
    (Ka({
      eye: e,
      reflexSelector: ".coloboma-extension-reflex",
      shouldShow: t.nasalColobomaCase,
      reflexBackground: a,
      reflexTransform: r,
      reflexOpacity: o,
      reflexFilter: l,
    }),
      Ka({
        eye: e,
        reflexSelector: ".iris-transillumination-reflex",
        shouldShow: t.irisTransilluminationCase,
        reflexBackground: a,
        reflexTransform: r,
        reflexOpacity: o,
        reflexFilter: l,
      }));
  }
  function Za({
    eye: e,
    flags: t,
    isActiveEye: a,
    pupilRadiusPx: r,
    sweepX: o,
    sweepY: l,
    maxConstriction: i = 0.075,
  }) {
    let s = e == null ? void 0 : e.querySelector(".iris");
    if (!s) return;
    if (t.acgCase && a) {
      s.style.setProperty("--light-pupil-scale", "1");
      return;
    }
    let d = Ai({ pupilRadiusPx: r, sweepX: o, sweepY: l, maxConstriction: i }),
      g = parseFloat(s.style.getPropertyValue("--light-pupil-scale")) || 1,
      f = d < g ? 0.28 : 0.16,
      m = g + (d - g) * f;
    s.style.setProperty("--light-pupil-scale", m.toFixed(3));
  }
  function Ai({
    pupilRadiusPx: e,
    sweepX: t,
    sweepY: a,
    maxConstriction: r = 0.075,
  }) {
    let o = Math.hypot(t, a),
      l = Math.max(1, e * 1.18),
      i = Math.max(0, Math.min(1, o / l));
    return 1 - (1 - i * i * (3 - 2 * i)) * r;
  }
  function Qa({ state: e, dom: t }) {
    function g(A) {
      let H =
        A === "left" &&
        (e.currentRefraction === n.RIGHT_ACG_LEFT_NORMAL ||
          e.currentRefraction === n.RIGHT_IRIDOCYCLITIS_LEFT_NORMAL);
      return { brightness: H ? 0.62 : 1, opacity: H ? 0.84 : 1 };
    }
    function f(A) {
      return Ya(A);
    }
    function m(A) {
      if (!A) return 1;
      let H = parseFloat(
        A.style.getPropertyValue("--manual-drag-pupil-fill-factor"),
      );
      return Number.isFinite(H) ? Math.max(1, H) : 1;
    }
    function L() {
      return e.currentRefraction === n.BILATERAL_BLUE_NORMAL
        ? De
        : e.baseReflexColor;
    }
    function S(A, H, V = null) {
      if (H.normalDarkCase) return "rgb(44, 44, 44)";
      if (H.leucocoriaCase)
        return `
        radial-gradient(
          circle at 50% 44%,
          rgb(255, 249, 234) 0%,
          rgb(247, 238, 214) 40%,
          rgb(232, 221, 194) 72%,
          rgb(206, 193, 165) 100%
        )
      `;
      let { r: K, g: Q, b: T } = L(),
        Y = Number.isFinite(V) ? V : m(A),
        $ = Ge({ r: K, g: Q, b: T }, Y);
      return `rgb(${$.r}, ${$.g}, ${$.b})`;
    }
    function C(A) {
      var H, V, K, Q, T, Y;
      return {
        x:
          (((H = A == null ? void 0 : A.caseOffset) == null ? void 0 : H.x) ||
            0) +
          (((V = A == null ? void 0 : A.manualOffset) == null ? void 0 : V.x) ||
            0) +
          (((K = A == null ? void 0 : A.gazeOffset) == null ? void 0 : K.x) ||
            0),
        y:
          (((Q = A == null ? void 0 : A.caseOffset) == null ? void 0 : Q.y) ||
            0) +
          (((T = A == null ? void 0 : A.manualOffset) == null ? void 0 : T.y) ||
            0) +
          (((Y = A == null ? void 0 : A.gazeOffset) == null ? void 0 : Y.y) ||
            0),
      };
    }
    function I({ eyeType: A, iris: H, pupilRadiusPx: V }) {
      if (
        !(
          (e.currentRefraction === n.RIGHT_NORMAL_LEFT_LARGE_ESOTROPIA &&
            A === "right") ||
          (e.currentRefraction === n.RIGHT_LARGE_EXOTROPIA_LEFT_CORNEAL_SCAR &&
            A === "left")
        )
      )
        return 1;
      let { x: Q, y: T } = C(H),
        Y = Math.hypot(Q, T * 0.65),
        $ = Math.max(2, V * 0.12),
        q = Math.max($ + 1, V * 0.95),
        te = Math.max(0, Math.min(1, (Y - $) / (q - $)));
      return te * te * (3 - 2 * te);
    }
    function E(A, H) {
      return 1 + (Math.max(1, A) - 1) * H;
    }
    function M(A) {
      if (!e.isLiveMotionEnabled || !A)
        return { brightness: 1, fillFactor: 1, opacity: 1 };
      let { x: H } = C(A),
        V = Math.max(0, Math.min(1, Math.abs(H) / 18)),
        K = V * V * (3 - 2 * V);
      return {
        brightness: 1 + K * 0.24,
        fillFactor: 1 + K * 0.34,
        opacity: 1 + K * 0.08,
      };
    }
    function N(A, H = {}) {
      let V = Math.max(0, Math.min(100, e.nystagmusLevel || 0)) / 100;
      if (V <= 0 || !A) return { blurPx: 0, brightness: 1, opacity: 1 };
      let K = H.aniridiaCase || H.bilateralAniridiaCase ? 0 : 1,
        Q = A.nystagmusOffset || { x: 0, y: 0 },
        T = Math.max(1, V * 9.2),
        Y = Math.max(0, Math.min(1, Math.hypot(Q.x || 0, Q.y || 0) / T)),
        $ = Y * Y * (3 - 2 * Y);
      return {
        blurPx: $ * V * 0.28 * K,
        brightness: 1 - $ * V * 0.08 * K,
        opacity: 1 - $ * V * 0.1 * K,
      };
    }
    function k(A) {
      return e.lastBlinkAtMs ? Math.max(0, A - e.lastBlinkAtMs / 1e3) : 1 / 0;
    }
    function R() {
      return va(document);
    }
    function p() {
      Na({
        retStreak: t.retStreak,
        retStreakVisual: R(),
        eyesWrapper: t.eyesWrapper,
        leftEye: t.leftEye,
        rightEye: t.rightEye,
      });
    }
    function h() {
      let A = performance.now() / 1e3,
        H = B(A);
      Ba({
        retStreak: t.retStreak,
        retStreakVisual: R(),
        retStreakOffset: e.retStreakOffset + H.x,
        retStreakOffsetY: (e.retStreakOffsetY || 0) + H.y,
      });
    }
    function B(A) {
      if (!e.lightHoldActive) return { x: 0, y: 0 };
      let H = e.retStreakOffset || 0,
        V = e.retStreakOffsetY || 0,
        K = Math.hypot(H, V);
      if (K < 2) return { x: 0, y: 0 };
      let Q = Math.min(1, K / 52),
        T = e.isBabyMode ? 1.14 : 1,
        Y =
          (Math.sin(A * 9.4 + 0.7) * 0.52 + Math.sin(A * 16.8 + 1.9) * 0.12) *
          Q *
          T,
        $ =
          (Math.cos(A * 8.2 + 0.2) * 0.34 + Math.sin(A * 15.5 + 2.6) * 0.08) *
          Q *
          T;
      return {
        x: Math.max(-1, Math.min(1, Y)),
        y: Math.max(-0.75, Math.min(0.75, $)),
      };
    }
    function P(A, H) {
      return tt(A, H);
    }
    function F(A) {
      return at({ wrapperRect: A, leftEye: t.leftEye, rightEye: t.rightEye });
    }
    function j() {
      return Et({
        eyesWrapper: t.eyesWrapper,
        leftEye: t.leftEye,
        rightEye: t.rightEye,
        defaultLimit: 100,
      });
    }
    function _() {
      return yt({
        eyesWrapper: t.eyesWrapper,
        leftEye: t.leftEye,
        rightEye: t.rightEye,
        defaultLimit: 18,
      });
    }
    function x(A) {
      return Pa({
        value: A,
        currentValue: e.retStreakOffset,
        eyesWrapper: t.eyesWrapper,
        leftEye: t.leftEye,
        rightEye: t.rightEye,
        defaultLimit: 100,
      });
    }
    function O(A) {
      return wa({
        value: A,
        currentValue: e.retStreakOffsetY || 0,
        eyesWrapper: t.eyesWrapper,
        leftEye: t.leftEye,
        rightEye: t.rightEye,
        defaultLimit: 18,
      });
    }
    function D({
      beamCentre: A,
      eyeType: H,
      pupilRadiusPx: V,
      sweepX: K,
      sweepY: Q,
      wrapperRect: T,
    }) {
      return Fa({
        beamCentre: A,
        eyeType: H,
        leftEye: t.leftEye,
        pupilRadiusPx: V,
        rightEye: t.rightEye,
        sweepX: K,
        sweepY: Q,
        wrapperRect: T,
      });
    }
    function U({
      beamCentre: A,
      eye: H,
      eyeType: V,
      lightOffsetX: K = 0,
      lightOffsetY: Q = 0,
      pupilRadiusPx: T,
      sweepX: Y,
      sweepY: $,
      wrapperRect: q,
    }) {
      $a({
        beamCentre: A,
        eye: H,
        eyeType: V,
        leftEye: t.leftEye,
        lightOffsetX: K,
        lightOffsetY: Q,
        pupilRadiusPx: T,
        rightEye: t.rightEye,
        sweepX: Y,
        sweepY: $,
        wrapperRect: q,
      });
    }
    function J({
      maskElement: A,
      isActiveEye: H,
      flags: V,
      eyeType: K,
      sweepY: Q,
    }) {
      e.corticalCataractPattern = Va({
        maskElement: A,
        isActiveEye: H,
        flags: V,
        eyeType: K,
        corticalCataractPattern: e.corticalCataractPattern,
        sweepY: Q,
      });
    }
    function G({
      flags: A,
      isActiveEye: H,
      overlayElement: V,
      pupilRadiusPx: K,
      sweepX: Q,
      sweepY: T,
      timeSec: Y,
    }) {
      za({
        flags: A,
        isActiveEye: H,
        overlayElement: V,
        pupilRadiusPx: K,
        sweepX: Q,
        sweepY: T,
        timeSec: Y,
      });
    }
    function c({
      activeRefraction: A,
      beamCentre: H,
      beamOffsetX: V,
      beamOffsetY: K,
      cataractVisual: Q,
      eye: T,
      eyeType: Y,
      flags: $,
      iris: q,
      pupilRadiusPx: te,
      reflex: ee,
      reflexCompX: ie,
      reflexCompY: X,
      timeSec: le,
      wrapperRect: it,
    }) {
      let Ne = I({ eyeType: Y, iris: q, pupilRadiusPx: te }),
        pe = At({
          activeRefraction: A,
          axisDeltaRad: 0,
          cataractLevel: e.cataractLevel,
          cylinderAxisDeg: 0,
          currentRefraction: A,
          eyeType: Y,
          flags: $,
          globalLightOffset: e.retStreakOffset,
          lastBlinkAgeSec: k(le),
          movementSign: 1,
          retStreakOffset: V,
          retStreakOffsetY: K,
          sceneRefraction: e.currentRefraction,
          timeSec: le,
        });
      ee.style.background = pe.background;
      let be = pe.shift - ie,
        ye = -X,
        Be = V,
        Pe = K,
        _e = Pe + X,
        {
          edgeBlurBoostPx: xe,
          edgeBrightnessScale: Le,
          edgeOpacityScale: de,
        } = je({ probeOffsetX: Be, probeOffsetY: _e, pupilRadiusPx: te }),
        ge = $.aniridiaCase || $.bilateralAniridiaCase || A === n.ANIRIDIA,
        Re =
          e.currentRefraction === n.BILATERAL_MYOPIA ||
          e.currentRefraction === n.RIGHT_HYPER_LEFT_MYOPIA ||
          A === n.ZERO ||
          A === n.ANIRIDIA ||
          A === n.NORMAL_DARK ||
          A === n.NORMAL_HYPER,
        we = ge ? 0 : Re ? xe * 0.2 : xe,
        Fe = ge ? 1 : Re ? 0.86 + Le * 0.14 : Le,
        ke = ge ? 1 : Re ? 0.72 + de * 0.28 : de,
        Oe = Math.max(-1, Math.min(1, _e / 18)),
        nt = Oe * 1.25,
        ot = 1 + Math.abs(Oe) * 0.018,
        Te = `translate(${be}px, ${(ye + nt).toFixed(2)}px)`;
      ((e.currentRefraction === n.HIGH_MINUS ||
        e.currentRefraction === n.HIGH_PLUS) &&
        (Te += " scale(0.6)"),
        (Te += pe.extraTransform),
        (Te += ` scale(1, ${ot.toFixed(3)})`),
        (ee.style.transform = Te));
      let { smoothT: sr } = D({
          beamCentre: H,
          eyeType: Y,
          pupilRadiusPx: te,
          sweepX: Be,
          sweepY: Pe,
          wrapperRect: it,
        }),
        Ct = ge ? 0 : sr,
        cr = $.denseCataractCase ? 0.18 + (1 - de) * 0.7 : ke,
        ur =
          (ge ? 0.6 : pe.opacity) * cr * Q.opacityScale * 1.1 * (1 - Ct * 0.3),
        dr =
          e.currentRefraction === n.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY &&
          Y === "right"
            ? 0.82
            : 1,
        It = g(Y),
        gr = e.currentRefraction === n.BILATERAL_DULL_REFLEX ? 0.5 : 1,
        mr = Math.max(
          1,
          parseFloat(
            T == null
              ? void 0
              : T.style.getPropertyValue("--manual-drag-reflex-opacity-boost"),
          ) || 1,
        ),
        hr = E(mr, Ne),
        _t = M(q),
        lt = N(q, $);
      ee.style.opacity = Math.max(
        0.015,
        Math.min(ur * hr * _t.opacity * lt.opacity * gr * It.opacity * dr, 1),
      );
      let xt =
          pe.blurPx +
          Q.blurBoostPx +
          we +
          lt.blurPx +
          (e.currentRefraction === n.BILATERAL_DULL_REFLEX ? 0.34 : 0),
        He = [];
      xt > 0.01 && He.push(`blur(${xt.toFixed(2)}px)`);
      let fr = Q.brightnessScale * Fe * 1.752,
        pr =
          e.currentRefraction === n.RIGHT_NORMAL_LEFT_CORNEAL_OPACITY &&
          Y === "right"
            ? 0.54
            : 1,
        br = 1 - Ct * 0.5,
        Lr = Math.max(
          1,
          parseFloat(
            T == null
              ? void 0
              : T.style.getPropertyValue(
                  "--manual-drag-reflex-brightness-boost",
                ),
          ) || 1,
        ),
        Ar = E(Lr, Ne),
        Ot =
          fr *
          pr *
          It.brightness *
          br *
          _t.brightness *
          lt.brightness *
          Ar *
          (e.currentRefraction === n.BILATERAL_DULL_REFLEX ? 0.64 : 1);
      (Math.abs(Ot - 1) > 0.01 && He.push(`brightness(${Ot.toFixed(2)})`),
        (ee.style.filter = He.length ? He.join(" ") : "none"),
        Wa({
          eye: T,
          flags: $,
          reflexBackground: ee.style.background,
          reflexTransform: ee.style.transform,
          reflexOpacity: ee.style.opacity,
          reflexFilter: ee.style.filter,
        }));
    }
    function b() {
      var Y;
      let A = Qe(e.cataractLevel),
        H = performance.now() / 1e3,
        V = B(H),
        K =
          ((Y = t.eyesWrapper) == null ? void 0 : Y.getBoundingClientRect()) ||
          null,
        Q = F(K),
        T = Q
          ? {
              x: Q.x + e.retStreakOffset + V.x,
              y: Q.y + (e.retStreakOffsetY || 0) + V.y,
            }
          : null;
      t.retReflexElements.forEach(($) => {
        var ge, Re, we, Fe, ke, Oe;
        let q = $.closest(".eye"),
          te = q == null ? void 0 : q.dataset.eye,
          ee = gt(e.currentRefraction, te),
          ie = zt(e.currentRefraction, te);
        Xa({
          eye: q,
          eyeType: te,
          flags: ie,
          isActiveEye: !0,
          sceneRefraction: e.currentRefraction,
        });
        let X = q == null ? void 0 : q.querySelector(".iris"),
          le = q == null ? void 0 : q.querySelector(".pupil"),
          it = q == null ? void 0 : q.querySelector(".cortical-cataract-mask"),
          Ne =
            q == null ? void 0 : q.querySelector(".central-subcortical-mask"),
          pe = q == null ? void 0 : q.querySelector(".pathology-overlay"),
          be = Math.max(
            8,
            ((le == null ? void 0 : le.clientWidth) || 32) * 0.5,
          ),
          ye = P(le, K),
          Be =
            (((ge = X == null ? void 0 : X.nystagmusOffset) == null
              ? void 0
              : ge.x) || 0) +
            (((Re = X == null ? void 0 : X.microOffset) == null
              ? void 0
              : Re.x) || 0) +
            (((we = X == null ? void 0 : X.backgroundOffset) == null
              ? void 0
              : we.x) || 0),
          Pe =
            (((Fe = X == null ? void 0 : X.nystagmusOffset) == null
              ? void 0
              : Fe.y) || 0) +
            (((ke = X == null ? void 0 : X.microOffset) == null
              ? void 0
              : ke.y) || 0) +
            (((Oe = X == null ? void 0 : X.backgroundOffset) == null
              ? void 0
              : Oe.y) || 0),
          _e = e.nystagmusLevel > 0 ? Be : 0,
          xe = e.nystagmusLevel > 0 ? Pe : 0,
          Le = T && ye ? T.x - ye.x : e.retStreakOffset - _e,
          de = T && ye ? T.y - ye.y : -xe;
        if (le) {
          let nt = I({ eyeType: te, iris: X, pupilRadiusPx: be }),
            ot = M(X),
            Te = E(m(q), nt) * ot.fillFactor;
          le.style.background = S(q, ie, Te);
        }
        (Za({
          eye: q,
          flags: ie,
          isActiveEye: !0,
          pupilRadiusPx: be,
          sweepX: Le,
          sweepY: de,
        }),
          U({
            beamCentre: T,
            eye: q,
            eyeType: te,
            lightOffsetX: e.retStreakOffset + V.x,
            lightOffsetY: (e.retStreakOffsetY || 0) + V.y,
            pupilRadiusPx: be,
            sweepX: Le,
            sweepY: de,
            wrapperRect: K,
          }),
          Ta({ maskElement: Ne, flags: ie, isActiveEye: !0 }),
          J({ maskElement: it, isActiveEye: !0, flags: ie, eyeType: te }),
          G({
            flags: ie,
            isActiveEye: !0,
            overlayElement: pe,
            pupilRadiusPx: be,
            sweepX: Le,
            sweepY: de,
            timeSec: H,
          }),
          c({
            activeRefraction: ee,
            beamCentre: T,
            beamOffsetX: Le,
            beamOffsetY: de,
            cataractVisual: A,
            eye: q,
            eyeType: te,
            flags: ie,
            iris: X,
            pupilRadiusPx: be,
            reflex: $,
            reflexCompX: _e,
            reflexCompY: xe,
            timeSec: H,
            wrapperRect: K,
          }));
      });
    }
    function u({ includePosition: A = !0 } = {}) {
      (A && p(), h(), b());
    }
    function y(A = !1) {
      u({ includePosition: A });
    }
    function v(A = !1) {
      ((e.retinoscopyNeedsPosition = e.retinoscopyNeedsPosition || A),
        !e.retinoscopyRafId &&
          (e.retinoscopyRafId = requestAnimationFrame(() => {
            (u({ includePosition: e.retinoscopyNeedsPosition }),
              (e.retinoscopyNeedsPosition = !1),
              (e.retinoscopyRafId = 0));
          })));
    }
    function w(A, H = e.retStreakOffsetY || 0) {
      ((e.retStreakOffset = x(A)),
        (e.retStreakOffsetY = O(H)),
        e.lightHoldActive && z(),
        v(!1));
    }
    function z() {
      if (e.lightJitterRafId) return;
      let A = () => {
        let H =
          Math.hypot(e.retStreakOffset || 0, e.retStreakOffsetY || 0) >= 2;
        if (!e.lightHoldActive || !H) {
          ((e.lightJitterRafId = 0), v(!1));
          return;
        }
        (u({ includePosition: !1 }),
          (e.lightJitterRafId = requestAnimationFrame(A)));
      };
      e.lightJitterRafId = requestAnimationFrame(A);
    }
    function W(A) {
      if (((e.lightHoldActive = !!A), e.lightHoldActive)) {
        z();
        return;
      }
      (e.lightJitterRafId &&
        (cancelAnimationFrame(e.lightJitterRafId), (e.lightJitterRafId = 0)),
        v(!1));
    }
    function Z(A) {
      qe.has(A) &&
        ((e.currentRefraction = A),
        (e.corticalCataractPattern = f(A)),
        (e.cylinderAxisDeg = null),
        (e.retStreakOffset = 0),
        (e.retStreakOffsetY = 0),
        v(!0));
    }
    function ae(A) {
      let H = Number.isFinite(A) ? A : parseInt(A, 10);
      Number.isNaN(H) ||
        ((e.cataractLevel = Math.max(0, Math.min(100, H))), v(!1));
    }
    return {
      getRetStreakOffsetBounds: j,
      getRetStreakOffsetYBounds: _,
      renderNow: y,
      scheduleRetinoscopy: v,
      setLightHoldActive: W,
      setRetStreakOffset: w,
      setRefraction: Z,
      setCataractLevel: ae,
    };
  }
  function ja() {
    return {
      baseReflexColor: { ...vt },
      irisColour: "dark-brown",
      isBabyMode: !1,
      isDilatedMode: !1,
      isLiveMotionEnabled: !1,
      ...Nt,
      retinoscopyRafId: 0,
      retinoscopyNeedsPosition: !0,
      lightHoldActive: !1,
      lightJitterRafId: 0,
      lastBlinkAtMs: 0,
      activeMcqLevel: "primary",
      activeMcqQuestions: [],
      corticalCataractPattern: null,
      microSaccadeIntervalId: 0,
      backgroundJitterIntervalId: 0,
      blinkIntervalId: 0,
      gazeShiftTimerId: 0,
      nystagmusRafId: 0,
      isManualEyeMoveEnabled: !1,
      isTestMode: !1,
      isTestRevealed: !1,
      contextGlareOn: !1,
      contextOnsetMode: "gradual",
      testCountdown: 0,
      testTimerId: 0,
      testConditionValue: null,
      testRevealLabel: "",
      testPreviousState: null,
      testLastRefraction: null,
      testRoundIndex: 0,
    };
  }
  function rt(e, t, a) {
    return Math.max(t, Math.min(a, e));
  }
  function Ja({
    state: e,
    dom: t,
    onLargeLightMove: a,
    retinoscopyController: r,
  }) {
    let { retStreak: o } = t,
      l = 100,
      i = 18,
      s = 130,
      d = 2,
      g = 0,
      f = !1,
      m = 0;
    function L() {
      return [o, document.getElementById("ret-streak-visual")].filter(Boolean);
    }
    function S() {
      (g && (window.clearTimeout(g), (g = 0)),
        L().forEach((p) => {
          p.classList.remove("is-snapping");
        }));
    }
    function C() {
      (S(),
        L().forEach((p) => {
          p.classList.add("is-snapping");
        }),
        (g = window.setTimeout(() => {
          (L().forEach((p) => {
            p.classList.remove("is-snapping");
          }),
            (g = 0));
        }, s + 40)));
    }
    function I() {
      o && ((f = !0), o.classList.remove("is-hint-visible"));
    }
    function E() {
      !o || f || o.classList.add("is-hint-visible");
    }
    function M() {
      var B, P;
      let p = (B = r.getRetStreakOffsetBounds) == null ? void 0 : B.call(r),
        h = (P = r.getRetStreakOffsetYBounds) == null ? void 0 : P.call(r);
      return {
        minX: Number.isFinite(p == null ? void 0 : p.min) ? p.min : -l,
        maxX: Number.isFinite(p == null ? void 0 : p.max) ? p.max : l,
        minY: Number.isFinite(h == null ? void 0 : h.min) ? h.min : -i,
        maxY: Number.isFinite(h == null ? void 0 : h.max) ? h.max : i,
      };
    }
    function N(
      p,
      { getValue: h, getBounds: B, pixelsPerUnit: P, setValue: F },
    ) {
      if (!p) return;
      let j = null,
        _ = 0,
        x = 0,
        O = 0,
        D = 0,
        U = !1;
      function J() {
        let { x: c, y: b } = h();
        (c !== 0 || b !== 0) && (C(), F(0, 0));
      }
      function G(c) {
        var b;
        j !== null &&
          ((c && c.pointerId !== j) ||
            ((j = null),
            (b = r.setLightHoldActive) == null || b.call(r, !1),
            J()));
      }
      (p.addEventListener("pointerdown", (c) => {
        var u, y;
        if (c.button !== void 0 && c.button !== 0) return;
        (S(),
          (u = r.setLightHoldActive) == null || u.call(r, !0),
          (j = c.pointerId),
          (_ = c.clientX),
          (x = c.clientY));
        let b = h();
        ((O = b.x || 0),
          (D = b.y || 0),
          (U = !1),
          (y = p.setPointerCapture) == null || y.call(p, c.pointerId),
          c.preventDefault());
      }),
        p.addEventListener("pointermove", (c) => {
          if (c.pointerId !== j) return;
          let { minX: b, maxX: u, minY: y, maxY: v } = B(),
            w = rt(O + (c.clientX - _) / P, b, u),
            z = rt(D + (c.clientY - x) / P, y, v),
            W = Math.round(w),
            Z = Math.round(z),
            ae = Math.hypot(W - O, Z - D),
            A = performance.now();
          (ae > 28 && A - m > 2400 && typeof a == "function" && ((m = A), a()),
            !U && (W !== O || Z !== D) && ((U = !0), I()),
            F(W, Z));
        }),
        p.addEventListener("pointerup", G),
        p.addEventListener("pointercancel", G),
        p.addEventListener("lostpointercapture", G));
    }
    function k(p, { step: h, setNextValue: B }) {
      p &&
        p.addEventListener("keydown", (P) => {
          if (
            P.key !== "ArrowLeft" &&
            P.key !== "ArrowRight" &&
            P.key !== "ArrowUp" &&
            P.key !== "ArrowDown" &&
            P.key !== "Home" &&
            P.key !== "End"
          )
            return;
          (P.preventDefault(), B(P.key, h) && I());
        });
    }
    function R() {
      if (!o) return;
      let p = o.querySelector(".fundal-light-probe__handle") || o;
      (N(p, {
        getValue: () => ({
          x: e.retStreakOffset || 0,
          y: e.retStreakOffsetY || 0,
        }),
        getBounds: M,
        pixelsPerUnit: d,
        setValue: (h, B) => r.setRetStreakOffset(h, B),
      }),
        k(o, {
          step: 5,
          setNextValue: (h, B) => {
            let { minX: P, maxX: F, minY: j, maxY: _ } = M();
            if (h === "Home")
              return e.retStreakOffset === 0 && e.retStreakOffsetY === 0
                ? !1
                : (r.setRetStreakOffset(0, 0), !0);
            if (h === "End")
              return e.retStreakOffset === F && e.retStreakOffsetY === 0
                ? !1
                : (r.setRetStreakOffset(F, 0), !0);
            let x = h === "ArrowLeft" ? -B : h === "ArrowRight" ? B : 0,
              O = h === "ArrowUp" ? -B : h === "ArrowDown" ? B : 0,
              D = e.retStreakOffset || 0,
              U = rt(D + x, P, F),
              J = e.retStreakOffsetY || 0,
              G = rt(J + O, j, _);
            return U === D && G === J ? !1 : (r.setRetStreakOffset(U, G), !0);
          },
        }),
        E());
    }
    return { hideHint: I, init: R };
  }
  var Ei = [
      {
        label: "Normal / Refractive",
        category: "custom",
        options: [
          { value: "zero", label: "1. Normal (orange-red) R & L" },
          { value: "bilateral-blue-normal", label: "2. Normal (blue) R & L" },
          {
            value: "technique-child-looking-away",
            label: "3. Poor view: looking away",
            triggerLabel: "3. Poor view: looking away",
          },
          {
            value: "technique-upper-lid-blocking",
            label: "4. Poor view: upper lid blocking",
            triggerLabel: "4. Poor view: upper lid",
          },
          { value: "normal-dark", label: "8. R normal, L dark" },
          {
            value: "bilateral-dull-reflex",
            label: "15. Dull corneal reflex R & L",
            triggerLabel: "15. Dull corneal reflex R & L",
          },
          {
            value: "bilateral-poor-tear-film",
            label: "12. Poor tear film R & L",
          },
          {
            value: "bilateral-high-hypermetropia",
            label: "9. High hypermetropia R & L",
          },
          { value: "bilateral-myopia", label: "10. Myopia R & L" },
          {
            value: "right-hyper-left-myopia",
            label: "11. R hypermetropia, L myopia",
            triggerLabel: "11. R hyper, L myopia",
          },
        ],
      },
      {
        label: "Alignment",
        category: "custom",
        options: [
          {
            value: "right-normal-left-large-esotropia",
            label: "5. R normal, L large esotropia",
            triggerLabel: "5. R normal, L esotropia",
          },
          {
            value: "right-large-exotropia-left-corneal-scar",
            label: "6. R large exotropia, L scar",
            triggerLabel: "6. R exotropia, L scar",
          },
        ],
      },
      {
        label: "Iris / Pupil",
        category: "custom",
        options: [
          {
            value: "right-coloboma-left-normal",
            label: "19. R coloboma, L normal",
          },
          { value: "bilateral-aniridia", label: "20. Aniridia R & L" },
          {
            value: "right-normal-left-anisocoria",
            label: "14. R normal, L smaller pupil",
            triggerLabel: "14. R normal, L small pupil",
          },
          {
            value: "right-iris-transillumination-left-normal",
            label: "21. R transillumination, L normal",
            triggerLabel: "21. R transillum., L normal",
          },
          { value: "bilateral-small-pupils", label: "13. Small pupils R & L" },
          {
            value: "right-acg-left-normal",
            label: "30. R angle closure, L normal",
          },
          {
            value: "right-iridocyclitis-left-normal",
            label: "29. R iridocyclitis, L normal",
          },
        ],
      },
      {
        label: "Cornea",
        category: "custom",
        options: [
          { value: "bilateral-keratoconus", label: "28. Keratoconus R & L" },
          {
            value: "right-normal-left-corneal-opacity",
            label: "17. R normal, L corneal opacity",
            triggerLabel: "17. R normal, L opacity",
          },
        ],
      },
      {
        label: "Lens / Media",
        category: "custom",
        options: [
          {
            value: "right-hyper-left-posterior-pole",
            label: "18. R hypermetropia, L posterior pole",
            triggerLabel: "18. R hyper, L posterior pole",
          },
          {
            value: "bilateral-dense-cataract",
            label: "16. Dense cataract R & L",
          },
          {
            value: "right-big-cortical-left-small-cortical",
            label: "24. R large cortical, L slight cortical",
            triggerLabel: "24. R large cortical, L slight",
          },
          {
            value: "bilateral-subcapsular-cataract",
            label: "25. Subcapsular cataract R & L",
          },
          {
            value: "right-iol-left-posterior-capsular-thickening",
            label: "26. R IOL, L capsular thickening",
            triggerLabel: "26. R IOL, L capsular thick.",
          },
          {
            value: "right-aphakia-left-normal",
            label: "27. R aphakia, L normal",
          },
          {
            value: "right-normal-left-subluxated-lens",
            label: "22. R normal, L subluxated lens",
            triggerLabel: "22. R normal, L sublux lens",
          },
        ],
      },
      {
        label: "Vitreous / Retina",
        category: "custom",
        options: [
          {
            value: "right-retinoblastoma-left-normal",
            label: "7. R retinoblastoma, L normal",
            triggerLabel: "7. R retinoblastoma, L normal",
          },
          {
            value: "right-floaters-left-normal",
            label: "23. R floaters, L normal",
          },
          {
            value: "right-vitreous-haemorrhage-left-normal",
            label: "31. R vitreous haemorrhage, L normal",
            triggerLabel: "31. R vitreous haem., L normal",
          },
          {
            value: "right-retinal-detachment-left-normal",
            label: "32. R retinal detachment, L normal",
            triggerLabel: "32. R retinal detach., L normal",
          },
        ],
      },
    ],
    er = Ei.flatMap(({ category: e, options: t, separator: a }) =>
      a ? [] : t.map((r) => ({ ...r, category: e })),
    ),
    yi = [
      "zero",
      "bilateral-blue-normal",
      "technique-child-looking-away",
      "technique-upper-lid-blocking",
      "bilateral-dull-reflex",
      "bilateral-high-hypermetropia",
      "right-hyper-left-myopia",
      "right-normal-left-large-esotropia",
      "right-large-exotropia-left-corneal-scar",
      "normal-dark",
      "right-coloboma-left-normal",
      "bilateral-aniridia",
      "right-normal-left-corneal-opacity",
      "bilateral-dense-cataract",
      "right-normal-left-subluxated-lens",
      "right-retinoblastoma-left-normal",
    ],
    Ri = new Set(yi),
    tr = er.filter((e) => Ri.has(e.value));
  var Po = new Set(er.map(({ value: e }) => e));
  function ve(e) {
    e && e.dispatchEvent(new Event("input", { bubbles: !0 }));
  }
  function ne(e) {
    e && e.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  function Ti(e, t = !1) {
    let a = t ? tr : Ue,
      r = a.length > 1 ? a.filter((i) => i.value !== e) : a,
      o = r.length ? r : a,
      l = Math.floor(Math.random() * o.length);
    return o[l];
  }
  function Ci(e) {
    let t = Math.max(0, Math.min(e, $e.length - 1));
    return $e[t];
  }
  function ar({
    state: e,
    dom: t,
    eyesController: a,
    retinoscopyController: r,
    setConditionContext: o,
    onTestStateChange: l,
  }) {
    let {
        sideMenu: i,
        testModeButton: s,
        testStatusBanner: d,
        testCountdownValue: g,
        testAnswerText: f,
        testClueText: m,
        testNextButton: L,
        reflexColorSlider: S,
        modifierContextBar: C,
        liveToggle: I,
        babyToggle: E,
        dilatedToggle: M,
        irisColourSelect: N,
        manualEyeMoveToggle: k,
        refractionShell: R,
        refractionMaskLabel: p,
        refractionStateSelect: h,
        visualCaseTrigger: B,
        casePrevButton: P,
        caseNextButton: F,
        cataractSlider: j,
        nystagmusToggle: _,
        nystagmusDirectionSelect: x,
        nystagmusWaveSelect: O,
        nystagmusRateSelect: D,
        pupilSizeSliders: U,
        eyelidSliders: J,
      } = t,
      G = [S, I, E, M, N, k, h, B, P, F, j, _, x, O, D, ...U, ...J].filter(
        Boolean,
      );
    function c() {
      e.testTimerId &&
        (window.clearInterval(e.testTimerId), (e.testTimerId = 0));
    }
    function b(T) {
      i &&
        (i.classList.toggle("open", T),
        i.setAttribute("aria-hidden", String(!T)),
        T ? i.removeAttribute("inert") : i.setAttribute("inert", ""),
        t.burgerIcon &&
          (t.burgerIcon.setAttribute("aria-expanded", String(T)),
          t.burgerIcon.setAttribute(
            "aria-label",
            T ? "Close menu" : "Open menu",
          )));
    }
    function u() {
      s && (s.textContent = e.isTestMode ? "stop test" : "test me");
    }
    function y(T) {
      !R ||
        !p ||
        !h ||
        (R.classList.toggle("is-masked", T),
        (p.textContent = T ? "Condition hidden" : ""));
    }
    function v(T) {
      (G.forEach((Y) => {
        Y.disabled = T;
      }),
        C == null ||
          C.querySelectorAll("input").forEach((Y) => {
            Y.disabled = T;
          }));
    }
    function w() {
      if (!(!d || !g || !f)) {
        if (((d.hidden = !e.isTestMode), !e.isTestMode)) {
          m && ((m.hidden = !0), (m.textContent = ""));
          return;
        }
        if (((g.textContent = String(e.testCountdown)), e.isTestRevealed)) {
          ((f.hidden = !1),
            (f.textContent = e.testRevealLabel),
            L && (L.hidden = !1));
          return;
        }
        ((f.hidden = !0),
          (f.textContent = ""),
          m && ((m.hidden = !0), (m.textContent = "")),
          L && (L.hidden = !0));
      }
    }
    function z() {
      var T, Y, $, q, te;
      return {
        contextOnsetMode: e.contextOnsetMode,
        contextGlareOn: e.contextGlareOn,
        toggles: [I, M, k].map((ee) => !!(ee != null && ee.checked)),
        irisColourValue: N == null ? void 0 : N.value,
        manualOffsets: (t.irises || []).map((ee) => ({ ...ee.manualOffset })),
        corticalCataractPattern: e.corticalCataractPattern
          ? JSON.parse(JSON.stringify(e.corticalCataractPattern))
          : null,
        currentRefraction: e.currentRefraction,
        cylinderAxisDeg: e.cylinderAxisDeg,
        retStreakOffset: e.retStreakOffset,
        retStreakOffsetY: e.retStreakOffsetY,
        reflexColorValue: (T = S == null ? void 0 : S.value) != null ? T : "",
        cataractValue: (Y = j == null ? void 0 : j.value) != null ? Y : "",
        nystagmusEnabled: !!(_ != null && _.checked),
        nystagmusDirectionValue:
          ($ = x == null ? void 0 : x.value) != null ? $ : "",
        nystagmusWaveValue: (q = O == null ? void 0 : O.value) != null ? q : "",
        nystagmusRateValue:
          (te = D == null ? void 0 : D.value) != null ? te : "",
        pupilValues: U.map((ee) => ee.value),
        eyelidValues: J.map((ee) => ee.value),
      };
    }
    function W() {
      var Y;
      let T = e.testPreviousState;
      T &&
        ([I, M, k].forEach(($, q) => {
          $ && (($.checked = T.toggles[q]), ne($));
        }),
        N && T.irisColourValue && ((N.value = T.irisColourValue), ne(N)),
        S &&
          T.reflexColorValue !== "" &&
          ((S.value = T.reflexColorValue), ve(S)),
        U.forEach(($, q) => {
          T.pupilValues[q] !== void 0 && (($.value = T.pupilValues[q]), ve($));
        }),
        J.forEach(($, q) => {
          T.eyelidValues[q] !== void 0 &&
            (($.value = T.eyelidValues[q]), ve($));
        }),
        j && T.cataractValue !== "" && ((j.value = T.cataractValue), ve(j)),
        x &&
          T.nystagmusDirectionValue !== "" &&
          (x.value = T.nystagmusDirectionValue),
        O && T.nystagmusWaveValue !== "" && (O.value = T.nystagmusWaveValue),
        D && T.nystagmusRateValue !== "" && (D.value = T.nystagmusRateValue),
        _ && ((_.checked = !!T.nystagmusEnabled), ne(_)),
        x && T.nystagmusDirectionValue !== "" && ne(x),
        O && T.nystagmusWaveValue !== "" && ne(O),
        D && T.nystagmusRateValue !== "" && ne(D),
        r.setRefraction(T.currentRefraction),
        typeof o == "function" && o(T.currentRefraction),
        h && ((h.value = T.currentRefraction), ne(h)),
        (e.contextOnsetMode = T.contextOnsetMode),
        (e.contextGlareOn = T.contextGlareOn),
        (e.cylinderAxisDeg = T.cylinderAxisDeg),
        (e.corticalCataractPattern = T.corticalCataractPattern
          ? JSON.parse(JSON.stringify(T.corticalCataractPattern))
          : null),
        (t.irises || []).forEach(($, q) => {
          $.manualOffset = { ...T.manualOffsets[q] };
        }),
        a.syncRefractionPose(),
        r.setRetStreakOffset(
          T.retStreakOffset,
          (Y = T.retStreakOffsetY) != null ? Y : 0,
        ));
    }
    function Z(T) {
      return typeof e.cylinderAxisDeg == "number"
        ? T.value === "low-cylinder" || T.value === "high-cylinder"
          ? `Answer: ${T.label}, - cyl axis ${e.cylinderAxisDeg} deg`
          : `Answer: ${T.label}, axis ${e.cylinderAxisDeg} deg`
        : `Answer: ${T.label}`;
    }
    function ae() {
      (c(),
        (e.isTestRevealed = !0),
        (e.testCountdown = 0),
        y(!1),
        w(),
        typeof l == "function" && l());
    }
    function A() {
      (c(),
        (e.testTimerId = window.setInterval(() => {
          if (e.testCountdown <= 1) {
            ae();
            return;
          }
          ((e.testCountdown -= 1), w());
        }, 1e3)));
    }
    function H() {
      e.testPreviousState
        ? (e.testRoundIndex = Math.min(e.testRoundIndex + 1, $e.length - 1))
        : ((e.testPreviousState = z()), (e.testRoundIndex = 0));
      let T = Ti(e.testLastRefraction, e.isBabyMode);
      if (T) {
        ((e.isTestMode = !0),
          (e.isTestRevealed = !1),
          (e.testConditionValue = T.value),
          (e.testCountdown = Ci(e.testRoundIndex)),
          (e.testLastRefraction = T.value),
          v(!0),
          y(!0));
        for (let Y of [I, M, k].filter(Boolean)) ((Y.checked = !1), ne(Y));
        (N && ((N.value = "dark-brown"), ne(N)),
          (t.irises || []).forEach((Y) => {
            Y.manualOffset = { x: 0, y: 0 };
          }));
        for (let Y of [...U, ...J, j, S].filter(Boolean))
          ((Y.value = Y.defaultValue), ve(Y));
        (_ && ((_.checked = !1), ne(_)),
          r.setRefraction(T.value),
          typeof o == "function" && o(T.value),
          a.syncRefractionPose(),
          h && ((h.value = T.value), ne(h)),
          v(!0),
          (e.testRevealLabel = Z(T)),
          w(),
          u(),
          b(!1),
          typeof l == "function" && l(),
          A());
      }
    }
    function V() {
      (!e.isTestMode && !e.testPreviousState) ||
        (c(),
        v(!1),
        y(!1),
        (e.isTestMode = !1),
        W(),
        (e.isTestMode = !1),
        (e.isTestRevealed = !1),
        (e.testCountdown = 0),
        (e.testConditionValue = null),
        (e.testRevealLabel = ""),
        (e.testPreviousState = null),
        (e.testRoundIndex = 0),
        w(),
        u(),
        b(!1),
        typeof l == "function" && l());
    }
    function K() {
      if (e.isTestMode) {
        V();
        return;
      }
      H();
    }
    function Q() {
      (s && s.addEventListener("click", K),
        L && L.addEventListener("click", H),
        w(),
        u());
    }
    return { closeTestMode: V, init: Q, startTestRound: H };
  }
  var Ii = {
      "bilateral-aniridia": {
        direction: "horizontal",
        level: 46,
        rate: "slow",
        wave: "pendular",
      },
    },
    rr,
    _i = new Set(
      ((rr = me.find((e) => e.value === "primary")) == null
        ? void 0
        : rr.values) || [],
    );
  function xi(e) {
    e &&
      (e.replaceChildren(),
      se.forEach((t) => {
        var r;
        if (t.separator) {
          let o = document.createElement("option");
          ((o.value = ""),
            (o.textContent = "--------------"),
            (o.disabled = !0),
            (o.dataset.cat = "separator"),
            e.appendChild(o));
          return;
        }
        if (!((r = t.options) != null && r.length)) return;
        let a = t.label
          ? document.createElement("optgroup")
          : document.createDocumentFragment();
        ("label" in a && (a.label = t.label),
          t.options.forEach((o) => {
            let l = document.createElement("option");
            ((l.value = o.value),
              (l.textContent = o.label),
              (l.dataset.cat = t.category),
              (l.selected = o.value === dt),
              a.appendChild(l));
          }),
          e.appendChild(a));
      }));
  }
  function Oi({ dom: e, eyesController: t, retinoscopyController: a }) {
    (he() ||
      e.irises.forEach((r) => {
        ((r.style.transform = "translate(0, 0)"), (r.style.transition = ""));
      }),
      t.startAmbientAnimations(),
      a.scheduleRetinoscopy(!0));
  }
  function ir() {
    let e = Gt(),
      t = ja(),
      a = Ht({
        container: e.modifierContextBar,
        state: t,
        onChange: () => s(),
      });
    function r() {
      var h;
      (e.controlsDeck && (e.controlsDeck.hidden = !1),
        e.retStreakVisual && (e.retStreakVisual.hidden = !1),
        e.retStreak && (e.retStreak.hidden = !1),
        (h = e.body) == null || h.classList.add("app-ready"));
    }
    function o() {
      if (!e.resultsSummary || !e.resultsSite || !e.resultsUrgency) return;
      let h = wt({
        caseValue: t.currentRefraction,
        isBabyMode: t.isBabyMode,
        onsetMode: t.contextOnsetMode,
        glareOn: t.contextGlareOn,
        isTestMode: t.isTestMode,
        isTestRevealed: t.isTestRevealed,
      });
      ((e.resultsSummary.textContent = h.likely),
        (e.resultsSite.textContent = h.site),
        (e.resultsUrgency.textContent = h.referral),
        (e.resultsUrgency.dataset.tone = h.tone));
    }
    function l() {
      if (!e.resultsWhy) return;
      if (t.isTestMode && !t.isTestRevealed) {
        e.resultsWhy.textContent = "Why: hidden during test mode";
        return;
      }
      let h = Ye(t.currentRefraction);
      e.resultsWhy.textContent = `Why: ${h.why}`;
    }
    function i() {
      if (!e.testClueText) return;
      if (!t.isTestMode || !t.isTestRevealed) {
        ((e.testClueText.hidden = !0), (e.testClueText.textContent = ""));
        return;
      }
      let h = t.testConditionValue || t.currentRefraction,
        B = Ye(h);
      ((e.testClueText.textContent = `Key clue: ${B.keyClue}`),
        (e.testClueText.hidden = !1));
    }
    function s() {
      (o(), l(), i());
    }
    function d() {
      if (!e.advancedDockToggle || !e.advancedPanel) return;
      let h = (B) => {
        ((e.advancedPanel.hidden = !B),
          e.advancedDockToggle.classList.toggle("is-open", B),
          e.advancedDockToggle.setAttribute(
            "aria-expanded",
            B ? "true" : "false",
          ));
        let P = B ? "Close advanced controls" : "Open advanced controls";
        (e.advancedDockToggle.setAttribute("aria-label", P),
          (e.advancedDockToggle.title = P));
      };
      (h(!1),
        e.advancedDockToggle.addEventListener("click", () => {
          h(e.advancedPanel.hidden);
        }));
    }
    (xi(e.refractionStateSelect),
      e.refractionStateSelect &&
        (e.refractionStateSelect.value = t.currentRefraction),
      a.applyDefaults(t.currentRefraction),
      a.render(),
      s());
    let g = Qa({ state: t, dom: e }),
      f = Ja({
        state: t,
        dom: e,
        onLargeLightMove: () => {
          var h;
          return (h = m == null ? void 0 : m.blinkOnce) == null
            ? void 0
            : h.call(m);
        },
        retinoscopyController: g,
      }),
      m = Jt({
        state: t,
        dom: e,
        onEyeGeometryChange: ({
          includePosition: h = !0,
          immediate: B = !1,
        } = {}) => {
          if (B) {
            g.renderNow(h);
            return;
          }
          g.scheduleRetinoscopy(h);
        },
      }),
      L = Ra({ dom: e, state: t, isPrimaryCase: (h) => _i.has(h) }),
      S = ar({
        state: t,
        dom: e,
        eyesController: m,
        retinoscopyController: g,
        setConditionContext: (h) => {
          (a.applyDefaults(h),
            a.render(),
            s(),
            L == null || L.syncForCurrentCase());
        },
        onTestStateChange: () => {
          (a.render(), s(), L == null || L.syncForCurrentCase());
        },
      });
    m.init();
    let C = aa(e);
    (f.init(),
      S.init(),
      d(),
      a.init(),
      L == null || L.init(),
      ha({ state: t, dom: e, onBeforeOpenMcq: () => S.closeTestMode() }));
    let I = Ea({
      state: t,
      dom: e,
      onBeforeSelectCase: () => S.closeTestMode(),
    });
    (oa({
      dom: e,
      onBeforeOpen: () => {
        var h;
        return (h = C == null ? void 0 : C.close) == null
          ? void 0
          : h.call(C, { restoreFocus: !1 });
      },
      onSelectCase: (h) => (I == null ? void 0 : I.selectCase(h)),
    }),
      e.reflexColorSlider &&
        (e.reflexColorSlider.addEventListener("input", (h) => {
          let B = parseInt(h.target.value, 10),
            P = ct(B);
          (m.applyReflexColor(P), (t.baseReflexColor = st(P)));
        }),
        e.reflexColorSlider.dispatchEvent(new Event("input"))),
      e.babyToggle &&
        ((e.babyToggle.checked = t.isBabyMode),
        e.babyToggle.addEventListener("change", (h) => {
          (m.setBabyMode(h.target.checked), I == null || I.setBabyMode(), s());
        }),
        m.setBabyMode(t.isBabyMode),
        I == null || I.setBabyMode()),
      e.dilatedToggle &&
        ((e.dilatedToggle.checked = t.isDilatedMode),
        e.dilatedToggle.addEventListener("change", (h) => {
          m.setDilatedMode(h.target.checked);
        }),
        m.setDilatedMode(t.isDilatedMode)),
      e.liveToggle &&
        ((e.liveToggle.checked = t.isLiveMotionEnabled),
        e.liveToggle.addEventListener("change", (h) => {
          (m.setLiveMotionEnabled(h.target.checked), k());
        }),
        m.setLiveMotionEnabled(t.isLiveMotionEnabled)),
      e.irisColourSelect &&
        ((e.irisColourSelect.value = t.irisColour),
        e.irisColourSelect.addEventListener("change", (h) => {
          m.setIrisColour(h.target.value);
        }),
        m.setIrisColour(t.irisColour)),
      e.manualEyeMoveToggle &&
        (e.manualEyeMoveToggle.addEventListener("change", (h) => {
          m.setManualEyeMoveEnabled(h.target.checked);
        }),
        (e.manualEyeMoveToggle.checked = t.isManualEyeMoveEnabled),
        m.setManualEyeMoveEnabled(t.isManualEyeMoveEnabled)),
      e.refractionStateSelect &&
        e.refractionStateSelect.addEventListener("change", (h) => {
          (g.setRefraction(h.target.value),
            a.applyDefaults(h.target.value),
            a.render(),
            s(),
            L == null || L.syncForCurrentCase(),
            m.syncRefractionPose(),
            k());
        }),
      e.cataractSlider &&
        (e.cataractSlider.addEventListener("input", (h) => {
          let B = parseInt(h.target.value, 10);
          (m.setCataractLevel(B), g.setCataractLevel(B));
        }),
        e.cataractSlider.dispatchEvent(new Event("input"))));
    let E = t.nystagmusLevel > 0,
      M = () => Ii[t.currentRefraction] || null,
      N = () => {
        var h, B, P;
        m.setNystagmusConfig({
          direction:
            ((h = e.nystagmusDirectionSelect) == null ? void 0 : h.value) ||
            t.nystagmusDirection,
          wave:
            ((B = e.nystagmusWaveSelect) == null ? void 0 : B.value) ||
            t.nystagmusWave,
          rate:
            ((P = e.nystagmusRateSelect) == null ? void 0 : P.value) ||
            t.nystagmusRate,
        });
      },
      k = () => {
        let h = M();
        (!!h && !E
          ? (m.setNystagmusConfig(h), m.setNystagmusLevel(h.level))
          : (m.setNystagmusEnabled(E), N()),
          [
            e.nystagmusDirectionSelect,
            e.nystagmusWaveSelect,
            e.nystagmusRateSelect,
          ].forEach((P) => {
            P && (P.disabled = !E);
          }));
      };
    (e.nystagmusToggle &&
      ((e.nystagmusToggle.checked = t.nystagmusLevel > 0),
      (E = e.nystagmusToggle.checked),
      e.nystagmusToggle.addEventListener("change", () => {
        ((E = e.nystagmusToggle.checked), k());
      })),
      e.nystagmusDirectionSelect &&
        ((e.nystagmusDirectionSelect.value = t.nystagmusDirection),
        e.nystagmusDirectionSelect.addEventListener("change", N)),
      e.nystagmusWaveSelect &&
        ((e.nystagmusWaveSelect.value = t.nystagmusWave),
        e.nystagmusWaveSelect.addEventListener("change", N)),
      e.nystagmusRateSelect &&
        ((e.nystagmusRateSelect.value = t.nystagmusRate),
        e.nystagmusRateSelect.addEventListener("change", N)),
      k(),
      Oi({ dom: e, eyesController: m, retinoscopyController: g }),
      g.renderNow(!0),
      r());
    let R = () => {
        let h = document.activeElement;
        if (!(h instanceof HTMLElement)) return !1;
        if (h.isContentEditable) return !0;
        let B = h.tagName;
        return B === "INPUT" || B === "SELECT" || B === "TEXTAREA";
      },
      p = () => {
        var h, B, P, F, j;
        return (
          ((h = e.infoModal) == null
            ? void 0
            : h.getAttribute("aria-hidden")) === "false" ||
          ((B = e.mcqModal) == null
            ? void 0
            : B.getAttribute("aria-hidden")) === "false" ||
          ((P = e.learnModal) == null
            ? void 0
            : P.getAttribute("aria-hidden")) === "false" ||
          ((F = e.visualCaseModal) == null
            ? void 0
            : F.getAttribute("aria-hidden")) === "false" ||
          ((j = e.visualCasePhotoModal) == null
            ? void 0
            : j.getAttribute("aria-hidden")) === "false"
        );
      };
    (window.addEventListener("keydown", (h) => {
      if (
        !(h.defaultPrevented || h.ctrlKey || h.metaKey || h.altKey) &&
        !(t.isTestMode || p() || R())
      ) {
        if (h.key === "ArrowLeft") {
          (h.preventDefault(), I == null || I.selectAdjacentCase(-1));
          return;
        }
        if (h.key === "ArrowRight") {
          (h.preventDefault(), I == null || I.selectAdjacentCase(1));
          return;
        }
        if (h.key.toLowerCase() === "c") {
          (h.preventDefault(), I == null || I.openCasePicker());
          return;
        }
      }
    }),
      window.addEventListener("resize", () => {
        g.scheduleRetinoscopy(!0);
      }));
  }
  function nr({
    reload: e = () => window.location.reload(),
    timeoutMs: t = 5e3,
  } = {}) {
    let a = document.getElementById("new-session-button"),
      r = document.getElementById("new-session-status");
    if (!a || !r) return null;
    let o = null;
    function l() {
      (window.clearTimeout(o),
        (o = null),
        (a.dataset.armed = "false"),
        (a.textContent = "New session"),
        (r.textContent = ""));
    }
    return (
      a.addEventListener("click", () => {
        if (a.dataset.armed === "true") {
          (window.clearTimeout(o), e());
          return;
        }
        ((a.dataset.armed = "true"),
          (a.textContent = "Clear session?"),
          (r.textContent =
            "Press again to restore the starting teaching case."),
          (o = window.setTimeout(l, t)));
      }),
      { disarm: l }
    );
  }
  function or() {
    !("serviceWorker" in navigator) ||
      !/^https?:$/.test(window.location.protocol) ||
      window.addEventListener(
        "load",
        () => {
          navigator.serviceWorker
            .register("./service-worker.js")
            .catch(() => {});
        },
        { once: !0 },
      );
  }
  function lr() {
    (ir(), nr(), or());
  }
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", lr, { once: !0 })
    : lr();
})();
