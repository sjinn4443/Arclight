// Authoring source shared by the asset builder, narration and runtime config.
export const EYE_PAD_SHIELD_SCROLL_PAGE = "makeEyePadShieldScrollPage";
export const EYE_PAD_SHIELD_SCROLL_ROUTE = "makeEyePadShieldScroll";
export const EYE_PAD_SHIELD_STAGES = [
  {
    name: "Hand hygiene",
    seconds: 6,
    scenes: [],
    cues: [
      {
        id: "hygiene",
        offset: 0,
        end: 6,
        en: "Wash your hands and don PPE.",
        ttsText: { en: "Wash your hands and don P P E." },
      },
    ],
  },
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

let clock = 1;
export const EYE_PAD_SHIELD_SCROLL_CLIPS = EYE_PAD_SHIELD_STAGES.map(
  (stage) => {
    const clip = {
      start: clock,
      end: clock + stage.seconds,
      cueIds: stage.cues.map((cue) => cue.id),
    };
    clock = clip.end;
    return clip;
  },
);
export const EYE_PAD_SHIELD_SCROLL_TIMING = {
  folder: "make-eye-pad-shield",
  route: "eyePadShield",
  languages: ["en"],
  stages: EYE_PAD_SHIELD_SCROLL_CLIPS.map((clip, index) => [
    [clip.start, 0],
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
  strictFrameLockNoFallback: true,
  strictFrameRemountOnBlank: true,
  persistentSettleSnapshotOverlay: true,
  lazyLoadStageAnimations: true,
  lazyInitialStageCount: 1,
  skipRouteImageWarmup: true,
  progressStoragePrefix: "lessonProgress:",
  paths: EYE_PAD_SHIELD_STAGES.map(
    (_, index) =>
      `/scrolly/eyeprocedures/make-eye-pad-shield/${index + 1}/data.json`,
  ),
  sections: [
    { startIndex: 0, title: "Preparation" },
    { startIndex: 2, title: "Make an eye pad" },
    { startIndex: 5, title: "Make an eye shield" },
  ],
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
  narrationTracks: {
    en: {
      label: "English",
      src: "/narration/make-eye-pad-shield/full-animation/en.m4a",
    },
  },
  narrationClipsByFile: EYE_PAD_SHIELD_SCROLL_CLIPS,
};
