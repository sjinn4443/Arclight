// Teaching order and artwork follow Pupils PEC_110826.pdf (one-page handout).
export const PUPILS_PEC_SCROLL_PAGE = "pupilsPecScrollPage";
export const PUPILS_PEC_SCROLL_ROUTE = "pupilsPecScroll";
export const PUPILS_PEC_LANGUAGES = {
  en: { label: "English", locale: "en-GB", voice: "en-GB-SoniaNeural" },
  ko: { label: "한국어", locale: "ko-KR", voice: "ko-KR-SunHiNeural" },
};
export const PUPILS_PEC_SECTIONS = [
  { startIndex: 0, title: "Observation" },
  { startIndex: 1, title: "Direct Light Response" },
];
export const PUPILS_PEC_CANVAS_HEIGHTS = [1280, 1280, 1280, 1280, 1280, 1280];
export const PUPILS_PEC_STAGES = [
  {
    name: "Observation: four examples",
    seconds: 18,
    cues: [
      {
        id: "observe",
        offset: 0,
        end: 6,
        en: "Observe the size, shape and symmetry of both pupils.",
        ko: "양쪽 동공의 크기, 모양, 대칭성을 관찰합니다.",
      },
      {
        id: "compare-observation",
        offset: 6,
        end: 18,
        en: "Compare normal pupils with changes in colour or shape, unequal pupil size and eyelids.",
        ko: "정상 동공과 색이나 모양의 변화, 양쪽 동공 크기의 차이, 눈꺼풀을 비교합니다.",
      },
    ],
  },
  {
    name: "Switch on the examination light",
    seconds: 9,
    cues: [
      {
        id: "light",
        offset: 0,
        end: 9,
        en: "Switch on the Arclight and select the brightest light setting. Use a quiet, dim room.",
        ko: "조용하고 어두운 방에서 아크라이트를 켜고 조명을 가장 밝게 설정합니다.",
      },
    ],
  },
  {
    name: "Fixation and examination position",
    seconds: 18,
    cues: [
      {
        id: "distance",
        offset: 0,
        end: 6,
        en: "Ask the patient to look at a distant target.",
        ko: "환자가 멀리 있는 목표물을 보게 합니다.",
      },
      {
        id: "clear-view",
        caption: {
          en: "Make sure they do not look at the examiner or the light itself.",
          ko: "검사자나 조명 자체를 바라보지 않도록 합니다.",
        },
        captionUntil: "avoid-light",
        offset: 6,
        end: 9.5,
        en: "Make sure they do not look at the examiner",
        ko: "검사자를 바라보지 않도록 합니다.",
      },
      {
        id: "avoid-light",
        caption: { en: "", ko: "" },
        offset: 9.5,
        end: 18,
        en: "or the light itself.",
        ko: "조명 자체도 바라보지 않도록 합니다.",
      },
    ],
  },
  {
    name: "Move the light towards the pupil",
    seconds: 12,
    cues: [
      {
        id: "move-light",
        offset: 0,
        end: 6,
        en: "Move the light from the side towards the pupil.",
        ko: "조명을 옆에서 동공 쪽으로 움직입니다.",
      },
      {
        id: "watch",
        offset: 6,
        end: 12,
        en: "Watch the illuminated pupil for the direct light response.",
        ko: "빛을 비춘 동공의 직접 대광반사를 관찰합니다.",
      },
    ],
  },
  {
    name: "Compare three direct light responses",
    seconds: 20,
    cues: [
      {
        id: "shine-constrict",
        offset: 0,
        end: 6,
        en: "Shine the light into the eye and watch the pupil constrict.",
        ko: "눈에 빛을 비추고 동공이 수축하는지 관찰합니다.",
      },
      {
        id: "compare-responses",
        offset: 6,
        end: 12,
        en: "Look for reduced or absent constriction.",
        ko: "동공 수축이 약하거나 없는지 확인합니다.",
      },
      {
        id: "corresponding-examples",
        offset: 12,
        end: 20,
        en: "The pupil responses on the left may be associated with the conditions at the back of the eye shown on the right.",
        ko: "왼쪽과 같은 동공 반응은 오른쪽 그림처럼 눈 뒤쪽의 상태와 관련이 있을 수 있습니다.",
      },
    ],
  },
  {
    name: "Pupil colour and cataract",
    seconds: 24,
    cues: [
      {
        id: "pupil-colour",
        offset: 0,
        end: 8,
        en: "Pupil colour does not determine the light response.",
        ko: "동공의 색이 대광반사를 결정하는 것은 아닙니다.",
      },
      {
        id: "cataract-constriction",
        offset: 8,
        end: 24,
        en: "A cataract may make the pupil look grey or white, but the pupil should still constrict if the light reflex pathway is intact.",
        ko: "백내장이 있으면 동공이 회색이나 흰색으로 보일 수 있지만, 대광반사 경로가 정상이라면 동공은 여전히 수축해야 합니다.",
      },
    ],
  },
];
let time = 1;
const clips = PUPILS_PEC_STAGES.map((stage) => {
  const clip = {
    start: time,
    end: time + stage.seconds,
    cueIds: stage.cues.map((cue) => cue.id),
  };
  time = clip.end;
  return clip;
});
export const PUPILS_PEC_SCROLL_TIMING = {
  folder: "pupils-pec",
  route: "videos",
  languages: Object.keys(PUPILS_PEC_LANGUAGES),
  stages: clips.map((clip, index) => [
    [clip.start, 0],
    [clip.end, PUPILS_PEC_STAGES[index].seconds * 30 - 1],
  ]),
};
export const PUPILS_PEC_SCROLL_CONFIG = {
  pageId: PUPILS_PEC_SCROLL_PAGE,
  label: "Pupils PEC",
  playMode: "stageAutoplay",
  enableReplay: true,
  stageAspectRatioByFile: PUPILS_PEC_CANVAS_HEIGHTS.map(
    (height) => `1169 / ${height}`,
  ),
  fitCaptionsInViewport: true,
  centerPlaybackGroup: true,
  topAlignedFirstStage: true,
  strictFrameLockNoFallback: true,
  strictFrameRemountOnBlank: true,
  persistentSettleSnapshotOverlay: true,
  lazyLoadStageAnimations: true,
  lazyInitialStageCount: 1,
  skipRouteImageWarmup: true,
  progressStoragePrefix: "lessonProgress:",
  paths: PUPILS_PEC_STAGES.map(
    (_, index) => `/scrolly/coreexam/pupils-pec/${index + 1}/data.json`,
  ),
  sections: PUPILS_PEC_SECTIONS,
  segmentRanges: PUPILS_PEC_STAGES.map((stage) => [
    { from: 0, to: stage.seconds * 30 - 1 },
  ]),
  completionHoldFrameByFile: PUPILS_PEC_STAGES.map(
    (stage) => stage.seconds * 30 - 1,
  ),
  segmentStartTexts: PUPILS_PEC_STAGES.map((stage) =>
    stage.cues.map((cue) => cue.caption?.en ?? cue.en),
  ),
  segmentTextModeByFile: PUPILS_PEC_STAGES.map(() => "append"),
  narrationTracks: Object.fromEntries(
    Object.entries(PUPILS_PEC_LANGUAGES).map(([language, { label }]) => [
      language,
      { label, src: `/narration/pupils-pec/full-animation/${language}.m4a` },
    ]),
  ),
  narrationClipsByFile: clips,
};
