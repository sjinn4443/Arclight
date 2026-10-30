// Authoring source shared by the asset builder, narration and runtime config.
export const EYE_PAD_SHIELD_SCROLL_PAGE = "makeEyePadShieldScrollPage";
export const EYE_PAD_SHIELD_SCROLL_ROUTE = "makeEyePadShieldScroll";
export const EYE_PAD_SHIELD_LANGUAGES = {
  en: "English",
  "es-419": "Español (Latinoamérica)",
  ko: "한국어",
  ne: "नेपाली",
  fr: "Français",
  lg: "Luganda",
  ha: "Hausa",
  yo: "Yorùbá",
  ig: "Igbo",
};
export const EYE_PAD_SHIELD_SECTIONS = [
  { startIndex: 0, title: "Preparation" },
  { startIndex: 1, title: "Make an eye pad" },
  { startIndex: 4, title: "Make an eye shield" },
];
export const EYE_PAD_SHIELD_TITLE_SECONDS = 3;
export const EYE_PAD_SHIELD_STAGES = [
  {
    name: "Equipment",
    seconds: 10,
    scenes: [1],
    cues: [
      {
        id: "equipment",
        offset: 0,
        end: 10,
        en: "You will need gauze, cotton wool, cardboard, pencil, cup, sticky paper and scissors.",
      },
    ],
  },
  {
    name: "Spread the cotton wool",
    seconds: 13,
    scenes: [2],
    cues: [
      {
        id: "cotton",
        offset: 0,
        end: 13,
        en: "For the eye pad, spread a cotton wool ball into an oval shape about 5 to 6 centimetres wide.",
      },
    ],
  },
  {
    name: "Fold and tape the gauze",
    seconds: 16,
    scenes: [3],
    cues: [
      {
        id: "gauze",
        offset: 0,
        end: 9,
        en: "Fold the gauze around the cotton wool.",
      },
      { id: "pad-tape", offset: 9, end: 16, en: "Tape at the open end." },
    ],
  },
  {
    name: "Trim the eye pad",
    seconds: 13,
    scenes: [4],
    cues: [
      {
        id: "trim",
        offset: 0,
        end: 10,
        en: "Trim the edges of the gauze to the shape of the cotton wool.",
      },
      {
        id: "finished-pad",
        offset: 10.5,
        end: 13,
        en: "This is your eye pad.",
      },
    ],
  },
  {
    name: "Choose clean cardboard",
    seconds: 11,
    scenes: [5],
    cues: [
      {
        id: "cardboard",
        offset: 0,
        end: 11,
        en: "For the shield, find some clean cardboard. Reusing medical packaging works well.",
      },
    ],
  },
  {
    name: "Draw the circle",
    seconds: 14,
    scenes: [6, 7],
    cues: [
      {
        id: "draw",
        offset: 0,
        end: 14,
        en: "Using a cup as a template, draw a circle with a diameter of about 8 centimetres.",
      },
    ],
  },
  {
    name: "Cut the circle and slit",
    seconds: 20,
    scenes: [8, 9],
    cues: [
      {
        id: "cut",
        offset: 0,
        end: 13,
        en: "Cut out the circle.",
      },
      {
        id: "slit",
        offset: 13,
        end: 20,
        en: "Then make a cut from the edge to the centre.",
      },
    ],
  },
  {
    name: "Shape and secure the shield",
    seconds: 21,
    scenes: [10, 11, 12],
    cues: [
      {
        id: "cone",
        offset: 0,
        end: 11,
        en: "Curve the card into a cone and secure with sticky tape.",
      },
      {
        id: "finished-shield",
        offset: 11,
        end: 21,
        en: "This is your eye shield.",
      },
    ],
  },
];

// Last visible movement in each supplied scene; the remaining frames are holds.
export const EYE_PAD_SHIELD_MOTION_END_FRAMES = [
  0, 350, 395, 276, 0, 385, 510, 435,
];
// Actual spoken ends from the nine delivered tracks' narration QA report.
// Keep source audio/caption slots intact; skip only their trailing silence.
export const EYE_PAD_SHIELD_SPEECH_ENDS = {
  en: [8.39, 17.91, 34.99, 52.47, 59.48, 70.07, 94.19, 111.14],
  "es-419": [8.68, 19.14, 36.17, 52.97, 59.67, 70.17, 94.82, 111.88],
  ko: [8.61, 18.7, 36.72, 53, 60.94, 69.18, 95.56, 112.31],
  ne: [6.18, 19.11, 35.98, 52.9, 60.08, 69.64, 94.98, 112],
  fr: [8.8, 18.34, 37.1, 53, 60.13, 69.93, 94.36, 112.43],
  lg: [6.3, 21.94, 36.6, 52.63, 59.61, 72.21, 96.28, 111.3],
  ha: [7.45, 21.18, 36.22, 52.44, 60.26, 71.62, 95.27, 111.51],
  yo: [5.1, 16.82, 34.79, 51.99, 57.8, 68.91, 93.67, 110.41],
  ig: [7.02, 20.14, 35.78, 51.7, 59.76, 72.1, 95.96, 111.8],
};

let clock = 1;
export const EYE_PAD_SHIELD_SCROLL_CLIPS = EYE_PAD_SHIELD_STAGES.map(
  (stage, index) => {
    const clip = {
      start: clock,
      end: clock + stage.seconds,
      cueIds: stage.cues.map((cue) => cue.id),
    };
    clip.endByLanguage = Object.fromEntries(
      Object.entries(EYE_PAD_SHIELD_SPEECH_ENDS).map(([language, ends]) => [
        language,
        Math.min(
          clip.end,
          Math.max(
            clip.start + EYE_PAD_SHIELD_MOTION_END_FRAMES[index] / 30 + 0.001,
            ends[index] + 0.12,
          ),
        ),
      ]),
    );
    clock = clip.end;
    return clip;
  },
);
export const EYE_PAD_SHIELD_SCROLL_TIMING = {
  folder: "make-eye-pad-shield",
  route: "eyePadShield",
  languages: Object.keys(EYE_PAD_SHIELD_LANGUAGES),
  stages: EYE_PAD_SHIELD_SCROLL_CLIPS.map((clip, index) => [
    [clip.start, 0],
    [
      clip.start + EYE_PAD_SHIELD_MOTION_END_FRAMES[index] / 30,
      EYE_PAD_SHIELD_MOTION_END_FRAMES[index],
    ],
    [
      clip.start + EYE_PAD_SHIELD_MOTION_END_FRAMES[index] / 30 + 0.001,
      EYE_PAD_SHIELD_STAGES[index].seconds * 30 - 1,
    ],
    [clip.end, EYE_PAD_SHIELD_STAGES[index].seconds * 30 - 1],
  ]),
};

export const EYE_PAD_SHIELD_SCROLL_CONFIG = {
  pageId: EYE_PAD_SHIELD_SCROLL_PAGE,
  label: "Make an eye pad and eye shield",
  playMode: "stageAutoplay",
  enableReplay: true,
  segmentTextToggleOnTitle: true,
  fitCaptionsInViewport: true,
  narrationCompletionPauseSeconds: 1.5,
  strictFrameLockNoFallback: true,
  strictFrameRemountOnBlank: true,
  persistentSettleSnapshotOverlay: true,
  lazyLoadStageAnimations: true,
  lazyInitialStageCount: 1,
  skipRouteImageWarmup: true,
  progressStoragePrefix: "lessonProgress:",
  paths: EYE_PAD_SHIELD_STAGES.map(
    (_, index) =>
      `/scrolly/eyeprocedures/make-eye-pad-shield/${index + 2}/data.json`,
  ),
  sections: EYE_PAD_SHIELD_SECTIONS,
  segmentRanges: EYE_PAD_SHIELD_STAGES.map((stage) => [
    { from: 0, to: stage.seconds * 30 - 1 },
  ]),
  completionHoldFrameByFile: EYE_PAD_SHIELD_STAGES.map(
    (stage) => stage.seconds * 30 - 1,
  ),
  segmentStartTexts: EYE_PAD_SHIELD_STAGES.map((stage) =>
    stage.cues.map((cue) => cue.en),
  ),
  segmentTextModeByFile: EYE_PAD_SHIELD_STAGES.map(() => "append"),
  narrationTracks: Object.fromEntries(
    Object.entries(EYE_PAD_SHIELD_LANGUAGES).map(([language, label]) => [
      language,
      {
        label,
        src: `/narration/make-eye-pad-shield/full-animation/${language}.m4a`,
      },
    ]),
  ),
  narrationClipsByFile: EYE_PAD_SHIELD_SCROLL_CLIPS,
};
