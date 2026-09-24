// Numeric folder order from scrolly/coreexam/visualacuity. Low Vision has a root data.json.
// Reuse the existing English Full Animation narration and script; no speech is generated at runtime.
export const VISUAL_ACUITY_EXAMINATION_SCROLL_CONFIG = {
  pageId: "visualAcuityExaminationScrollPage",
  label: "Visual Acuity",
  fitCaptionsInViewport: true,
  // Give each sentence its own balanced paragraph; keep its last two words
  // together even on browsers without balanced wrapping.
  formatCaption: (text) =>
    text
      .replace(/([.!?])\s+(?=[A-Z])/g, "$1\n\n")
      .replace(
        "Record the test distance as the top number of the Snellen fraction.\n\nHere, it is three metres.",
        "Record the test distance as the top number of the Snellen fraction. Here, it is three metres.",
      )
      .split(/\n{2,}/)
      .map((sentence) => sentence.trim().replace(/\s+(\S+)$/, "\u00a0$1"))
      .join("\n\n"),
  enableReplay: true,
  segmentTextToggleOnTitle: true,
  persistentSettleSnapshotOverlay: true,
  playMode: "stageAutoplay",
  strictFrameLockNoFallback: true,
  strictFrameRemountOnBlank: true,
  lazyLoadStageAnimations: true,
  lazyInitialStageCount: 1,
  skipRouteImageWarmup: true,
  progressStoragePrefix: "lessonProgress:",
  paths: [
    "/scrolly/coreexam/visualacuity/01Preparation/1/data.json",
    "/scrolly/coreexam/visualacuity/01Preparation/2/data.json",
    "/scrolly/coreexam/visualacuity/01Preparation/3/data.json",
    "/scrolly/coreexam/visualacuity/01Preparation/4/data.json",
    "/scrolly/coreexam/visualacuity/02DistanceVision/1/data.json",
    "/scrolly/coreexam/visualacuity/02DistanceVision/2/data.json",
    "/scrolly/coreexam/visualacuity/02DistanceVision/3/data.json",
    "/scrolly/coreexam/visualacuity/03TestWithPinholeOrGlasses/1/data.json",
    "/scrolly/coreexam/visualacuity/03TestWithPinholeOrGlasses/2/data.json",
    "/scrolly/coreexam/visualacuity/03TestWithPinholeOrGlasses/3/data.json",
    "/scrolly/coreexam/visualacuity/04LowVisionCF-HM-LP/data.json",
    "/scrolly/coreexam/visualacuity/05NearVision/1/data.json",
    "/scrolly/coreexam/visualacuity/05NearVision/2/data.json",
    "/scrolly/coreexam/visualacuity/05NearVision/3/data.json",
    "/scrolly/coreexam/visualacuity/05NearVision/4/data.json",
  ],
  sections: [
    {
      startIndex: 0,
      title: "Preparation",
    },
    {
      startIndex: 4,
      title: "Distance Vision",
    },
    {
      startIndex: 7,
      title: "Test with Pinhole or glasses",
    },
    {
      startIndex: 10,
      title: "Low Vision CF-HM-LP",
    },
    {
      startIndex: 11,
      title: "Near Vision",
    },
  ],
  segmentRanges: [
    [
      {
        from: 0,
        to: 89,
      },
    ],
    [
      {
        from: 0,
        to: 179,
      },
    ],
    [
      {
        from: 0,
        to: 129,
      },
    ],
    [
      {
        from: 0,
        to: 199,
      },
    ],
    [
      {
        from: 0,
        to: 119,
      },
    ],
    [
      {
        from: 0,
        to: 209,
      },
    ],
    [
      {
        from: 0,
        to: 1259,
      },
    ],
    [
      {
        from: 0,
        to: 129,
      },
    ],
    [
      {
        from: 0,
        to: 179,
      },
    ],
    [
      {
        from: 0,
        to: 219,
      },
    ],
    [
      {
        from: 0,
        to: 1139,
      },
    ],
    [
      {
        from: 0,
        to: 179,
      },
    ],
    [
      {
        from: 0,
        to: 449,
      },
    ],
    [
      {
        from: 0,
        to: 449,
      },
    ],
    [
      {
        from: 0,
        to: 449,
      },
    ],
  ],
  completionHoldFrameByFile: [
    89, 179, 129, 199, 119, 209, 1259, 129, 179, 219, 1139, 179, 449, 449, 449,
  ],
  segmentStartTexts: [
    [
      "Prepare the charts, measuring tape, pen and a safety pin to make pinholes.",
    ],
    [
      "Practise the tumbling E optotype before the actual test. Ask the patient to point in the direction of the E.",
    ],
    [
      "Light should fall onto the chart. Make sure the light is not coming from behind the chart.",
    ],
    [
      "Make sure the distance from the patient’s eyes to the chart is three metres.",
    ],
    ["Cover one eye with the palm, not the fingers."],
    ["Start with the largest letters and work down the chart."],
    [
      "Record the test distance as the top number of the Snellen fraction. Here, it is three metres.",
      "Ask the patient to show the direction of each E. For the left eye, use the letters on the left of the chart, from largest to smallest. For the right eye, use the letters on the right, from largest to smallest.",
      "Continue until the patient can no longer correctly identify the letters, or has completed the chart.",
      "Record the last complete line seen correctly. In this example, the acuity is three over nineteen.",
    ],
    [
      "If vision is reduced to less than three over three, repeat the test with a pinhole or glasses.",
    ],
    [
      "You can make a set of pinholes by pushing a pin through the near card where the black dots are.",
    ],
    [
      "If vision improves with pinholes or glasses, it means they need glasses.",
    ],
    [
      "If the largest E cannot be seen at three metres, try one and a half metres. If still unseen, test counting fingers.",
      "Ask how many fingers are held up. Record counting fingers and the distance at which they are seen.",
      "If fingers cannot be counted, move your hand and ask whether movement is visible. Record hand movements and the distance.",
      "If movement cannot be seen, test light perception. Record whether the patient can see the light, or has no light perception.",
    ],
    [
      "For near vision, hold the reading chart forty centimetres away, with both eyes open.",
    ],
    [
      "Ask them to read aloud, starting with the largest print.",
      "Record the smallest line read comfortably and the test distance.",
    ],
    [
      "If reading is difficult, ask them to identify letters or match their shapes.",
      "They can point in the direction of the E, as in distance acuity testing, or copy its shape in the air with a finger.",
    ],
    [
      "If near vision is worse than N12, repeat with reading glasses of different powers.",
      "If the vision improves, it means they need glasses",
    ],
  ],
  narrationTracks: {
    en: {
      label: "English",
      src: "/narration/visual-acuity/full-animation/en.m4a",
    },
  },
  narrationClipsByFile: [
    {
      start: 3,
      end: 9.1,
      cueIds: ["va-01"],
    },
    {
      start: 9.1,
      end: 18.6,
      cueIds: ["va-02"],
    },
    {
      start: 21.6,
      end: 29.866667,
      cueIds: ["va-03"],
    },
    {
      start: 29.866667,
      end: 38.366667,
      cueIds: ["va-04"],
    },
    {
      start: 40.866667,
      end: 45.866667,
      cueIds: ["va-05"],
    },
    {
      start: 45.866667,
      end: 52.866667,
      cueIds: ["va-06"],
    },
    {
      start: 52.866667,
      end: 97.1,
      cueIds: ["va-07", "va-08", "va-09", "va-10"],
    },
    {
      start: 100.6,
      end: 107.333333,
      cueIds: ["va-11"],
    },
    {
      start: 107.333333,
      end: 113.4,
      cueIds: ["va-12"],
    },
    {
      start: 113.4,
      end: 119.033333,
      cueIds: ["va-13"],
    },
    {
      start: 124.533333,
      end: 164.9,
      cueIds: ["va-14", "va-15", "va-16", "va-17"],
    },
    {
      start: 170.4,
      end: 177.4,
      cueIds: ["va-18"],
    },
    {
      start: 177.4,
      end: 190.4,
      cueIds: ["va-19", "va-20"],
    },
    {
      start: 192.4,
      end: 206.4,
      cueIds: ["va-21", "va-22"],
    },
    {
      start: 207.4,
      end: 222.4,
      cueIds: ["va-23", "va-24"],
    },
  ],
};

// Absolute audio time to local scene frames, including the existing speech holds.
export const VISUAL_ACUITY_SCROLL_TIMING = {
  folder: "visual-acuity",
  languages: ["en"],
  stages: [
    [
      [3, 0],
      [4.4, 83],
      [9, 83],
      [9.1, 89],
    ],
    [
      [9.1, 0],
      [13, 101],
      [18.6, 101],
      [21.6, 179],
    ],
    [
      [21.6, 0],
      [25.133333, 127],
      [29.8, 127],
      [29.866667, 129],
    ],
    [
      [29.866667, 0],
      [38.366667, 199],
    ],
    [
      [40.866667, 0],
      [45.866667, 119],
    ],
    [
      [45.866667, 0],
      [52.866667, 209],
    ],
    [
      [52.866667, 0],
      [73.266667, 619],
      [76, 619],
      [97.1, 1259],
    ],
    [
      [100.6, 0],
      [105.533333, 127],
      [107.266666, 127],
      [107.333333, 129],
    ],
    [
      [107.333333, 0],
      [113.266666, 177],
      [113.333333, 177],
      [113.4, 179],
    ],
    [
      [113.4, 0],
      [118.8, 215],
      [118.933333, 215],
      [119.033333, 219],
    ],
    [
      [124.533333, 0],
      // Pause before the CF crossfade begins at local frame 152.
      [129.933333, 151],
      [133.8, 151],
      [164.9, 1139],
    ],
    [
      [170.4, 0],
      [177.4, 179],
    ],
    [
      [177.4, 0],
      [190.4, 449],
    ],
    [
      // Keep this transition moving; the MP4 speech hold overlaps a crossfade.
      [192.4, 0],
      [206.4, 449],
    ],
    [
      [207.4, 0],
      [222.4, 449],
    ],
  ],
};
