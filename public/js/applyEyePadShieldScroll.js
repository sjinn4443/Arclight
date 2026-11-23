// Teaching sequence derived from PEC's 8.Applypadandshield video.
export const APPLY_EYE_PAD_SHIELD_SCROLL_PAGE = "applyEyePadShieldScrollPage";
export const APPLY_EYE_PAD_SHIELD_SCROLL_ROUTE = "applyEyePadShieldScroll";
export const APPLY_EYE_PAD_SHIELD_NARRATION_CUES = [
  {
    name: "Equipment",
    seconds: 5.54,
    en: "Prepare an eye pad, an eye shield, adhesive tape and scissors.",
    ko: "안대 패드, 눈 보호대, 반창고와 가위를 준비합니다.",
    ur: "آئی پیڈ، آئی شیلڈ، چپکنے والی ٹیپ اور قینچی تیار کریں۔",
  },
  {
    name: "Explain the procedure",
    seconds: 4.44,
    en: "Explain the procedure to the patient and help them sit comfortably.",
    ko: "환자에게 절차를 설명하고 편안하게 앉도록 돕습니다.",
    ur: "مریض کو طریقہ بتائیں اور آرام سے بٹھائیں۔",
  },
  {
    name: "Prepare the skin",
    seconds: 9.32,
    en: "Gently clean the skin around the eye, then dry it so the tape will stick.",
    ko: "눈 주위 피부를 부드럽게 닦고 반창고가 잘 붙도록 말립니다.",
    ur: "آنکھ کے ارد گرد کی جلد کو آہستہ سے صاف کریں، پھر اسے خشک کریں تاکہ ٹیپ چپک جائے۔",
  },
  {
    name: "Prepare the tape",
    seconds: 11.12,
    en: "Measure and cut strips of adhesive tape before applying the pad.",
    ko: "패드를 붙이기 전에 반창고의 길이를 재고 잘라 준비합니다.",
    ur: "پیڈ لگانے سے پہلے چپکنے والی ٹیپ کی پٹیوں کی پیمائش اور کاٹ لیں۔",
  },
  {
    name: "Prepare the pad",
    seconds: 6.52,
    en: "Prepare the eye pad and attach the strips of tape, as shown.",
    ko: "그림과 같이 안대 패드에 반창고를 붙여 준비합니다.",
    ur: "آئی پیڈ تیار کریں اور ٹیپ کی پٹیوں کو جوڑیں، جیسا کہ دکھایا گیا ہے۔",
  },
  {
    name: "Close the eye",
    seconds: 6.22,
    en: "Ask the patient to gently close the eye. Place the pad over the closed eyelid.",
    ko: "환자에게 눈을 부드럽게 감도록 한 뒤 감긴 눈꺼풀 위에 패드를 놓습니다.",
    ur: "مریض کو آہستہ سے آنکھ بند کرنے کو کہیں۔ بند پپوٹا کے اوپر پیڈ رکھیں۔",
  },
  {
    name: "Secure the pad",
    seconds: 8.67,
    en: "Secure the tape diagonally from the forehead to the cheek. Keep the other eye uncovered.",
    ko: "이마에서 볼 방향으로 반창고를 비스듬히 붙여 패드를 고정합니다. 반대쪽 눈은 가리지 않습니다.",
    ur: "ٹیپ کو پیشانی سے گال تک ترچھی طور پر محفوظ کریں۔ دوسری آنکھ کو بے پردہ رکھیں۔",
  },
  {
    name: "Apply the shield",
    seconds: 9.62,
    en: "Place the eye shield over the pad and secure it with tape. This is how you apply an eye shield.",
    ko: "패드 위에 눈 보호대를 놓고 반창고로 고정합니다. 이렇게 눈 보호대 부착을 마칩니다.",
    ur: "آئی شیلڈ کو پیڈ پر رکھیں اور اسے ٹیپ سے محفوظ کریں۔ اس طرح آپ آئی شیلڈ لگاتے ہیں۔",
  },
];
let clock = 1;
export const APPLY_EYE_PAD_SHIELD_SOURCE_CLIPS =
  APPLY_EYE_PAD_SHIELD_NARRATION_CUES.map((stage, index) => {
    const clip = {
      start: clock,
      end: clock + stage.seconds,
      cueIds: [`apply-${index + 1}`],
    };
    clock = clip.end;
    return clip;
  });
// Placement and securing play continuously; retain both original audio cues.
const sceneCues = [[0], [1], [2], [3], [4], [5, 6], [7]];
export const APPLY_EYE_PAD_SHIELD_STAGES = sceneCues.map((indices) => ({
  name:
    indices.length > 1
      ? "Place and secure the pad"
      : APPLY_EYE_PAD_SHIELD_NARRATION_CUES[indices[0]].name,
  seconds: indices.reduce(
    (sum, i) => sum + APPLY_EYE_PAD_SHIELD_NARRATION_CUES[i].seconds,
    0,
  ),
  ...Object.fromEntries(
    ["en", "ko", "ur"].map((language) => [
      language,
      indices
        .map((i) => APPLY_EYE_PAD_SHIELD_NARRATION_CUES[i][language])
        .join(" "),
    ]),
  ),
}));
export const APPLY_EYE_PAD_SHIELD_CLIPS = sceneCues.map((indices) => ({
  start: APPLY_EYE_PAD_SHIELD_SOURCE_CLIPS[indices[0]].start,
  end: APPLY_EYE_PAD_SHIELD_SOURCE_CLIPS[indices.at(-1)].end,
  endByLanguage: Object.fromEntries(
    Object.entries({
      en: [4.62, 4.12, 9.32, 11.12, 6.52, 11.9, 9.62],
      ko: [5.54, 4.44, 9.32, 11.12, 6.52, 14.89, 9.62],
    }).map(([lang, durations]) => [
      lang,
      APPLY_EYE_PAD_SHIELD_SOURCE_CLIPS[indices[0]].start +
        durations[sceneCues.indexOf(indices)],
    ]),
  ),
  cueIds: indices.flatMap((i) => APPLY_EYE_PAD_SHIELD_SOURCE_CLIPS[i].cueIds),
}));
export const APPLY_EYE_PAD_SHIELD_TIMING = {
  folder: "apply-eye-pad-shield",
  route: "eyePadShield",
  languages: ["en", "ko", "ur"],
  stages: APPLY_EYE_PAD_SHIELD_CLIPS.map((clip, i) => [
    [clip.start, 0],
    ...(i === 5
      ? [
          [
            APPLY_EYE_PAD_SHIELD_SOURCE_CLIPS[5].end,
            Math.round(APPLY_EYE_PAD_SHIELD_NARRATION_CUES[5].seconds * 30),
          ],
        ]
      : []),
    [clip.end, Math.round(APPLY_EYE_PAD_SHIELD_STAGES[i].seconds * 30) - 1],
  ]),
};
export const APPLY_EYE_PAD_SHIELD_SCROLL_CONFIG = {
  pageId: APPLY_EYE_PAD_SHIELD_SCROLL_PAGE,
  label: "Apply an Eye Pad and Eye Shield",
  playMode: "stageAutoplay",
  enableReplay: true,
  segmentTextToggleOnTitle: true,
  fitCaptionsInViewport: true,
  narrationCompletionPauseSeconds: 0.7,
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
    { startIndex: 6, title: "Apply the eye shield" },
  ],
  segmentRanges: APPLY_EYE_PAD_SHIELD_STAGES.map((s) => [
    { from: 0, to: Math.round(s.seconds * 30) - 1 },
  ]),
  completionHoldFrameByFile: APPLY_EYE_PAD_SHIELD_STAGES.map(
    (s) => Math.round(s.seconds * 30) - 1,
  ),
  segmentStartTexts: sceneCues.map((indices) =>
    indices.map((i) => APPLY_EYE_PAD_SHIELD_NARRATION_CUES[i].en),
  ),
  segmentTextModeByFile: APPLY_EYE_PAD_SHIELD_STAGES.map(() => "append"),
  narrationTracks: Object.fromEntries(
    [
      ["en", "English"],
      ["ko", "한국어"],
      ["ur", "اردو"],
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
