export const REFRACTION_GROUPS = [
  {
    label: "Normal / Refractive",
    category: "custom",
    options: [
      { value: "zero", label: "1. Normal (orange-red) R & L" },
      {
        value: "bilateral-blue-normal",
        label: "2. Normal (blue) R & L",
      },
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
      {
        value: "bilateral-myopia",
        label: "10. Myopia R & L",
      },
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
      {
        value: "bilateral-aniridia",
        label: "20. Aniridia R & L",
      },
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
      {
        value: "bilateral-small-pupils",
        label: "13. Small pupils R & L",
      },
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
      {
        value: "bilateral-keratoconus",
        label: "28. Keratoconus R & L",
      },
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
];

export const REFRACTION_OPTIONS = REFRACTION_GROUPS.flatMap(
  ({ category, options, separator }) =>
    separator ? [] : options.map((option) => ({ ...option, category })),
);

export const BABY_REFRACTION_VALUES = [
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
];

export const BABY_REFRACTION_VALUE_SET = new Set(BABY_REFRACTION_VALUES);

export const BABY_REFRACTION_OPTIONS = REFRACTION_OPTIONS.filter((option) =>
  BABY_REFRACTION_VALUE_SET.has(option.value),
);

export const CASE_LEVELS = [
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
];

export const TEST_REFRACTION_OPTIONS = REFRACTION_OPTIONS;

export const REFRACTION_VALUE_SET = new Set(
  REFRACTION_OPTIONS.map(({ value }) => value),
);
