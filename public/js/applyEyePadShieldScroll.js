// Keep cue IDs stable when editing the lesson so recordings stay paired with their text.
export const APPLY_EYE_PAD_SHIELD_SCROLL_PAGE = "applyEyePadShieldScrollPage";
export const APPLY_EYE_PAD_SHIELD_SCROLL_ROUTE = "applyEyePadShieldScroll";
export const APPLY_EYE_PAD_SHIELD_NARRATION_CUES = [
  {
    start: 0,
    end: 6.3,
    en: "You will need Steri-Strips, sticky tape, an eye pad, shield and scissors.",
    ko: "스테리 스트립, 반창고, 안대 패드, 눈 보호대와 가위가 필요합니다.",
    ur: "اسٹیری اسٹرپس، ٹیپ، آنکھ کا پیڈ، شیلڈ اور قینچی تیار کریں۔",
    ny: "Konzani timizere ta Steri-Strip, tepi yomata, chophimba chofewa, chotetezera diso ndi lumo.",
    id: "apply-3",
  },
  {
    start: 6.3,
    end: 17.85,
    en: "Explain what you're going to do and gain consent.",
    ko: "환자에게 절차를 설명하고 동의를 구합니다.",
    ur: "طریقہ سمجھائیں اور رضامندی لیں۔",
    ny: "Fotokozani zimene muchite ndipo pemphani chilolezo.",
    id: "apply-4",
  },
  {
    start: 17.85,
    end: 22.9,
    en: "Ask the patient to gently close both eyelids.",
    ko: "환자에게 양쪽 눈을 가볍게 감아 보도록 합니다.",
    ur: "مریض کو دونوں پلکیں آہستہ بند کرنے کو کہیں۔",
    ny: "Pemphani wodwala kuti atseke zikope zonse mofatsa.",
    id: "apply-6",
  },
  {
    start: 22.9,
    end: 29.85,
    en: "Place a strip on the upper lid, pulling it down to close the lids, then stick to the lower lid and cheek.",
    ko: "윗눈꺼풀에 스트립을 붙이고 아래로 당겨 눈을 감긴 뒤, 아랫눈꺼풀과 볼에 붙입니다.",
    ur: "پٹی اوپری پلک پر رکھیں، پلک بند کرنے کے لیے نیچے کھینچیں، پھر نچلی پلک اور گال پر چپکائیں۔",
    ny: "Ikani kamzere pa chikope chakumtunda. Kokani pansi kuti zikope zitseke, ndipo matani pa chikope chapansi ndi patsaya.",
    id: "apply-7",
  },
  {
    start: 29.85,
    end: 32.65,
    en: "Use two or three Steri-Strips.",
    ko: "스테리 스트립을 두세 줄 사용합니다.",
    ur: "دو یا تین پٹیاں لگائیں۔",
    ny: "Gwiritsani timizere tiwiri kapena titatu.",
    id: "apply-8",
  },
  {
    start: 32.65,
    end: 40.15,
    en: "Next, place a piece of sticky tape across the eye pad that is roughly two to three times the length of the pad.",
    ko: "다음으로 패드 길이의 두세 배 정도 되는 반창고 한 줄을 안대 패드에 가로질러 붙입니다.",
    ur: "پیڈ کے اوپر چپکنے والی ٹیپ لگائیں۔ ٹیپ پیڈ کی لمبائی سے تقریباً دو سے تین گنا ہو۔",
    ny: "Kenako ikani tepi pa chophimba chofewa. Tepi ikhale yaitali kuwirikiza kawiri kapena katatu utali wa chophimbacho.",
    id: "apply-9",
  },
  {
    start: 40.15,
    end: 47.15,
    en: "Place the taped pad over the closed eye and secure it to the forehead.",
    ko: "반창고가 붙은 패드를 감긴 눈꺼풀 위에 놓고 이마에 고정합니다.",
    ur: "بند پلکوں پر ٹیپ والا پیڈ رکھیں اور پیشانی پر چپکائیں۔",
    ny: "Ikani chophimba chokhala ndi tepi pa zikope zotsekedwa ndipo matani pamphumi.",
    id: "apply-11",
  },
  {
    start: 47.15,
    end: 50.35,
    en: "Add another two or three pieces of sticky tape.",
    ko: "반창고를 두세 줄 더 붙입니다.",
    ur: "ٹیپ کے دو یا تین اور ٹکڑے لگائیں۔",
    ny: "Onjezerani zidutswa ziwiri kapena zitatu za tepi.",
    id: "apply-12",
  },
  {
    start: 50.35,
    end: 54.25,
    en: "Finally, place a length of sticky tape over the shield.",
    ko: "마지막으로 보호대 겉면에 반창고 한 줄을 붙입니다.",
    ur: "آخر میں شیلڈ پر ٹیپ کی ایک پٹی لگائیں۔",
    ny: "Pomaliza, ikani tepi pa chotetezera cholimba.",
    id: "apply-13",
  },
  {
    start: 54.25,
    end: 58.8,
    en: "Position over the eye pad and secure to the forehead and cheek.",
    ko: "보호대를 패드 위에 놓고 이마와 볼에 고정합니다.",
    ur: "شیلڈ پیڈ کے اوپر رکھ کر پیشانی اور گال پر چپکائیں۔",
    ny: "Ikani chotetezera pamwamba pa chophimba chofewa ndipo chimateni pamphumi ndi patsaya.",
    id: "apply-14",
  },
  {
    start: 58.8,
    end: 61.7,
    en: "Add a second length of sticky tape.",
    ko: "두 번째 반창고를 붙입니다.",
    ur: "ٹیپ کی دوسری پٹی لگائیں۔",
    ny: "Ikani tepi yachiwiri.",
    id: "apply-15",
  },
];

const cues = APPLY_EYE_PAD_SHIELD_NARRATION_CUES;
export const APPLY_EYE_PAD_SHIELD_STAGES = [
  ["Equipment", cues.slice(0, 1)],
  ["Explain the procedure", cues.slice(1, 2)],
  ["Tape the eyelid", cues.slice(2, 5)],
  ["Prepare the pad", cues.slice(5, 6)],
  ["Place and secure the pad", cues.slice(6, 8)],
  ["Apply the shield", cues.slice(8)],
].map(([name, lines]) => ({
  name,
  cues: lines,
  seconds: lines.at(-1).end - lines[0].start,
}));

export const APPLY_EYE_PAD_SHIELD_CLIPS = APPLY_EYE_PAD_SHIELD_STAGES.map(
  (stage) => ({
    start: stage.cues[0].start,
    end: stage.cues.at(-1).end,
    cueIds: stage.cues.map((cue) => cue.id),
  }),
);
export const APPLY_EYE_PAD_SHIELD_TIMING = {
  folder: "apply-eye-pad-shield",
  route: "eyePadShield",
  languages: ["en", "ko", "ur", "ny"],
  captionMode: "replace",
  stages: APPLY_EYE_PAD_SHIELD_CLIPS.map(({ start, end }) => [
    [start, 0],
    [end, Math.round((end - start) * 30) - 1],
  ]),
};
export const APPLY_EYE_PAD_SHIELD_SCROLL_CONFIG = {
  pageId: APPLY_EYE_PAD_SHIELD_SCROLL_PAGE,
  label: "Apply an Eye Pad and Eye Shield",
  playMode: "stageAutoplay",
  requireStageAdvance: true,
  enableReplay: true,
  segmentTextToggleOnTitle: true,
  fitCaptionsInViewport: true,
  showAllCaptionsOnCompletion: true,
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
    { startIndex: 3, title: "Apply the eye pad" },
    { startIndex: 5, title: "Apply the eye shield" },
  ],
  segmentRanges: APPLY_EYE_PAD_SHIELD_STAGES.map((s) => [
    { from: 0, to: Math.round(s.seconds * 30) - 1 },
  ]),
  completionHoldFrameByFile: APPLY_EYE_PAD_SHIELD_STAGES.map(
    (s) => Math.round(s.seconds * 30) - 1,
  ),
  segmentStartTexts: APPLY_EYE_PAD_SHIELD_STAGES.map((stage) =>
    stage.cues.map((cue) => cue.en),
  ),
  narrationTracks: Object.fromEntries(
    [
      ["en", "English"],
      ["ko", "한국어"],
      ["ur", "اردو"],
      ["ny", "Chichewa"],
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
