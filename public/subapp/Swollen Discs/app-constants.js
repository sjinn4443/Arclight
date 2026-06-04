export const IMAGE_ASSET_SETS = Object.freeze({
  full: Object.freeze({
    normal: 'assets/images/ret180.webp',
    suspicious: 'assets/images/ret180_2.webp',
    swollen: 'assets/images/ret180_4.webp'
  }),
  mobile: Object.freeze({
    normal: 'assets/images/ret180_2048.webp',
    suspicious: 'assets/images/ret180_2_2048.webp',
    swollen: 'assets/images/ret180_4_2048.webp'
  })
});

export const DEFAULT_IMAGE_SRC = IMAGE_ASSET_SETS.full.normal;

export const TIMED_IMAGES = [
  { src: IMAGE_ASSET_SETS.full.normal, label: 'normal' },
  { src: IMAGE_ASSET_SETS.full.suspicious, label: 'suspicious' },
  { src: IMAGE_ASSET_SETS.full.swollen, label: 'swollen' }
];

export const TIMED_ROUNDS_PER_CATEGORY = 4;
export const TIMED_SET_SIZE = 4;

export const MCQ_TIER_CONFIGS = [
  {
    name: 'Primary',
    className: 'primary-star',
    questionCount: 4,
    optionCount: 3,
    passRatio: 0.5,
    timeLimitSeconds: 0,
    questionIds: ['q01', 'q02', 'q06', 'q08', 'q11', 'q16', 'q26', 'q30']
  },
  {
    name: 'Intermediate',
    className: 'intermediate-star',
    questionCount: 5,
    optionCount: 4,
    passRatio: 0.6,
    timeLimitSeconds: 110,
    questionIds: ['q03', 'q05', 'q07', 'q10', 'q12', 'q14', 'q18', 'q22', 'q25', 'q27']
  },
  {
    name: 'Advanced',
    className: 'advanced-star',
    questionCount: 7,
    optionCount: 5,
    passRatio: 0.7,
    timeLimitSeconds: 80,
    questionIds: [
      'q04',
      'q09',
      'q13',
      'q15',
      'q17',
      'q19',
      'q20',
      'q21',
      'q23',
      'q24',
      'q28',
      'q29'
    ]
  }
];

export const TIMED_ROUND_PROFILES = [
  { seconds: 8, isDilated: true, cataractLevel: 0 },
  { seconds: 6, isDilated: false, cataractLevel: 0 },
  { seconds: 5, isDilated: false, cataractLevel: 1 }
];

export const SHIFT_INTERVAL = 4000;

export const CATARACT_PRESETS = [
  {
    label: 'None',
    blurPx: 0,
    brightness: 1,
    contrast: 1,
    saturation: 1,
    yellowTint: 0,
    darkTint: 0,
    hazeTint: 0
  },
  {
    label: 'Slight',
    blurPx: 0.45,
    brightness: 0.92,
    contrast: 0.95,
    saturation: 0.9,
    yellowTint: 0.05,
    darkTint: 0.06,
    hazeTint: 0.015
  },
  {
    label: 'Medium',
    blurPx: 1.65,
    brightness: 0.7,
    contrast: 0.76,
    saturation: 0.58,
    yellowTint: 0.2,
    darkTint: 0.24,
    hazeTint: 0.05
  },
  {
    label: 'Dense',
    blurPx: 3.2,
    brightness: 0.56,
    contrast: 0.66,
    saturation: 0.46,
    yellowTint: 0.34,
    darkTint: 0.4,
    hazeTint: 0.14
  }
];

export const CATARACT_OCCLUSION_SPOTS = [
  [],
  [
    {
      x: -0.34,
      y: -0.2,
      r: 0.2,
      alpha: 0.13,
      blur: 0.95,
      coreAlpha: 0.05,
      stretchX: 1.45,
      stretchY: 0.8,
      angle: -0.45
    },
    {
      x: 0.4,
      y: 0.22,
      r: 0.16,
      alpha: 0.11,
      blur: 0.9,
      coreAlpha: 0.04,
      stretchX: 1.35,
      stretchY: 0.82,
      angle: 0.35
    },
    {
      x: 0.06,
      y: 0.34,
      r: 0.13,
      alpha: 0.09,
      blur: 0.82,
      coreAlpha: 0.03,
      stretchX: 1.3,
      stretchY: 0.9,
      angle: -0.1
    }
  ],
  [
    {
      x: -0.46,
      y: -0.3,
      r: 0.28,
      alpha: 0.26,
      blur: 1.2,
      coreAlpha: 0.1,
      stretchX: 1.75,
      stretchY: 0.74,
      angle: -0.62
    },
    {
      x: 0.4,
      y: -0.16,
      r: 0.24,
      alpha: 0.23,
      blur: 1.12,
      coreAlpha: 0.09,
      stretchX: 1.6,
      stretchY: 0.78,
      angle: 0.52
    },
    {
      x: 0.08,
      y: 0.34,
      r: 0.22,
      alpha: 0.21,
      blur: 1.08,
      coreAlpha: 0.08,
      stretchX: 1.55,
      stretchY: 0.8,
      angle: -0.22
    },
    {
      x: -0.18,
      y: 0.02,
      r: 0.19,
      alpha: 0.18,
      blur: 1.0,
      coreAlpha: 0.07,
      stretchX: 1.5,
      stretchY: 0.85,
      angle: 0.12
    },
    {
      x: 0.26,
      y: 0.1,
      r: 0.16,
      alpha: 0.16,
      blur: 0.94,
      coreAlpha: 0.06,
      stretchX: 1.4,
      stretchY: 0.88,
      angle: -0.35
    }
  ],
  [
    {
      x: -0.5,
      y: -0.34,
      r: 0.34,
      alpha: 0.42,
      blur: 1.55,
      coreAlpha: 0.18,
      stretchX: 2.0,
      stretchY: 0.66,
      angle: -0.72
    },
    {
      x: 0.42,
      y: -0.22,
      r: 0.31,
      alpha: 0.39,
      blur: 1.46,
      coreAlpha: 0.17,
      stretchX: 1.9,
      stretchY: 0.68,
      angle: 0.58
    },
    {
      x: 0.14,
      y: 0.4,
      r: 0.29,
      alpha: 0.37,
      blur: 1.4,
      coreAlpha: 0.16,
      stretchX: 1.82,
      stretchY: 0.7,
      angle: -0.26
    },
    {
      x: -0.1,
      y: 0.04,
      r: 0.27,
      alpha: 0.34,
      blur: 1.34,
      coreAlpha: 0.15,
      stretchX: 1.75,
      stretchY: 0.74,
      angle: 0.08
    },
    {
      x: 0.32,
      y: 0.18,
      r: 0.24,
      alpha: 0.31,
      blur: 1.28,
      coreAlpha: 0.14,
      stretchX: 1.7,
      stretchY: 0.78,
      angle: -0.42
    },
    {
      x: -0.3,
      y: 0.24,
      r: 0.21,
      alpha: 0.28,
      blur: 1.2,
      coreAlpha: 0.12,
      stretchX: 1.62,
      stretchY: 0.82,
      angle: 0.44
    }
  ]
];

export const EXPLANATION_TEMPLATES = {
  normal: `
    <div class="interpretation-summary interpretation-summary--normal">
      <span class="interpretation-kicker">Referral</span>
      <strong class="interpretation-referral text-green">No urgent referral</strong>
    </div>
    <p class="interpretation-detail">
      Why: crisp disc margins, visible cup and healthy vessels.
    </p>
    <div class="interpretation-meta">
      <span>Likely: normal optic disc</span>
      <span>Next: compare with suspicious and swollen</span>
    </div>
  `,
  suspicious: `
    <div class="interpretation-summary interpretation-summary--suspicious">
      <span class="interpretation-kicker">Referral</span>
      <strong class="interpretation-referral text-orange">Same-day advice</strong>
    </div>
    <p class="interpretation-detail">
      Why: C-shaped or full halo, nasal elevation and no major vessel obscuration.
    </p>
    <div class="interpretation-meta">
      <span>Likely: suspicious disc swelling</span>
      <span>Next: seek urgent advice today</span>
    </div>
  `,
  swollen: `
    <div class="interpretation-summary interpretation-summary--swollen">
      <span class="interpretation-kicker">Referral</span>
      <strong class="interpretation-referral text-red">Emergency now</strong>
    </div>
    <p class="interpretation-detail">
      Why: elevated disc with obscured major vessels or haemorrhages around the disc.
    </p>
    <div class="interpretation-meta">
      <span>Likely: definite disc swelling</span>
      <span>Next: arrange emergency review</span>
    </div>
  `
};
