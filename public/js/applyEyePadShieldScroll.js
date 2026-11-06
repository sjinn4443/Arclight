// Teaching sequence derived from PEC's 8.Applypadandshield video.
export const APPLY_EYE_PAD_SHIELD_SCROLL_PAGE = "applyEyePadShieldScrollPage";
export const APPLY_EYE_PAD_SHIELD_SCROLL_ROUTE = "applyEyePadShieldScroll";
export const APPLY_EYE_PAD_SHIELD_STAGES = [
  {
    name: "Equipment",
    seconds: 12,
    en: "Prepare an eye pad, an eye shield, adhesive tape and scissors.",
    ko: "안대 패드, 눈 보호대, 반창고와 가위를 준비합니다.",
  },
  {
    name: "Explain the procedure",
    seconds: 12,
    en: "Explain the procedure to the patient and help them sit comfortably.",
    ko: "환자에게 절차를 설명하고 편안하게 앉도록 돕습니다.",
  },
  {
    name: "Prepare the skin",
    seconds: 14,
    en: "Gently clean the skin around the eye, then dry it so the tape will stick.",
    ko: "눈 주위 피부를 부드럽게 닦고 반창고가 잘 붙도록 말립니다.",
  },
  {
    name: "Prepare the tape",
    seconds: 12,
    en: "Measure and cut strips of adhesive tape before applying the pad.",
    ko: "패드를 붙이기 전에 반창고의 길이를 재고 잘라 준비합니다.",
  },
  {
    name: "Prepare the pad",
    seconds: 12,
    en: "Prepare the eye pad and attach the strips of tape, as shown.",
    ko: "그림과 같이 안대 패드에 반창고를 붙여 준비합니다.",
  },
  {
    name: "Close the eye",
    seconds: 12,
    en: "Ask the patient to gently close the eye. Place the pad over the closed eyelid.",
    ko: "환자에게 눈을 부드럽게 감도록 한 뒤 감긴 눈꺼풀 위에 패드를 놓습니다.",
  },
  {
    name: "Secure the pad",
    seconds: 14,
    en: "Secure the tape diagonally from the forehead to the cheek. Keep the other eye uncovered.",
    ko: "이마에서 볼 방향으로 반창고를 비스듬히 붙여 패드를 고정합니다. 반대쪽 눈은 가리지 않습니다.",
  },
  {
    name: "Apply the shield",
    seconds: 14,
    en: "Place the eye shield over the pad and secure it with tape, as demonstrated in the video.",
    ko: "영상에서 보여 주는 것처럼 패드 위에 눈 보호대를 놓고 반창고로 고정합니다.",
  },
];
let clock = 1;
export const APPLY_EYE_PAD_SHIELD_CLIPS = APPLY_EYE_PAD_SHIELD_STAGES.map(
  (stage, index) => {
    const clip = {
      start: clock,
      end: clock + stage.seconds,
      cueIds: [`apply-${index + 1}`],
    };
    clock = clip.end;
    return clip;
  },
);
export const APPLY_EYE_PAD_SHIELD_TIMING = {
  folder: "apply-eye-pad-shield",
  route: "eyePadShield",
  languages: ["en", "ko"],
  stages: APPLY_EYE_PAD_SHIELD_CLIPS.map((clip, i) => [
    [clip.start, 0],
    [clip.end, APPLY_EYE_PAD_SHIELD_STAGES[i].seconds * 30 - 1],
  ]),
};
export const APPLY_EYE_PAD_SHIELD_SCROLL_CONFIG = {
  pageId: APPLY_EYE_PAD_SHIELD_SCROLL_PAGE,
  label: "Apply an Eye Pad and Eye Shield",
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
  paths: APPLY_EYE_PAD_SHIELD_STAGES.map(
    (_, i) => `/scrolly/eyeprocedures/apply-eye-pad-shield/${i + 1}/data.json`,
  ),
  sections: [
    { startIndex: 0, title: "Preparation" },
    { startIndex: 4, title: "Apply the eye pad" },
    { startIndex: 7, title: "Apply the eye shield" },
  ],
  segmentRanges: APPLY_EYE_PAD_SHIELD_STAGES.map((s) => [
    { from: 0, to: s.seconds * 30 - 1 },
  ]),
  completionHoldFrameByFile: APPLY_EYE_PAD_SHIELD_STAGES.map(
    (s) => s.seconds * 30 - 1,
  ),
  segmentStartTexts: APPLY_EYE_PAD_SHIELD_STAGES.map((s) => [s.en]),
  segmentTextModeByFile: APPLY_EYE_PAD_SHIELD_STAGES.map(() => "append"),
  narrationTracks: Object.fromEntries(
    [
      ["en", "English"],
      ["ko", "한국어"],
    ].map(([lang, label]) => [
      lang,
      {
        label,
        src: `/narration/apply-eye-pad-shield/full-animation/${lang}.m4a`,
      },
    ]),
  ),
  narrationClipsByFile: APPLY_EYE_PAD_SHIELD_CLIPS,
};
