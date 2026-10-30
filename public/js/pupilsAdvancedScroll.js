// Shared PEC stages and audio are reused verbatim; Advanced artwork owns the rest.
import {
  PUPILS_PEC_STAGES,
  PUPILS_PEC_SCROLL_CONFIG,
} from "./pupilsPecScroll.js";
export const PUPILS_ADVANCED_SCROLL_PAGE = "pupilsAdvancedScrollPage";
export const PUPILS_ADVANCED_SCROLL_ROUTE = "pupilsAdvancedScroll";
export const PUPILS_ADVANCED_LANGUAGES = {
  en: { label: "English", locale: "en-GB", voice: "en-GB-SoniaNeural" },
  ko: { label: "한국어", locale: "ko-KR", voice: "ko-KR-SunHiNeural" },
};
export const PUPILS_ADVANCED_SECTIONS = [
  { startIndex: 0, title: "Afferent and Efferent Pathways" },
  { startIndex: 3, title: "Direct and Consensual Light Response Explained" },
  { startIndex: 4, title: "Observation" },
  { startIndex: 5, title: "Direct Light Response" },
  { startIndex: 10, title: "Consensual Response" },
  { startIndex: 11, title: "Swinging Light Test" },
  { startIndex: 13, title: "Near Response" },
];
export const PUPILS_ADVANCED_TITLE_TRANSLATIONS = [
  "구심성 및 원심성 경로",
  "직접·간접 대광반사 경로",
  "관찰",
  "직접 대광반사",
  "간접 대광반사",
  "교대불빛검사",
  "근접반응",
];
const OWN_STAGES = [
  {
    name: "Afferent sensory pathway",
    seconds: 30,
    cues: [
      {
        id: "afferent-light",
        offset: 0,
        end: 8,
        en: "Light entering the eye starts a signal in the afferent, or sensory, pathway.",
        ko: "눈으로 들어온 빛은 구심성 감각 경로의 신호를 시작합니다.",
      },
      {
        id: "afferent-brain",
        offset: 8,
        end: 30,
        en: "Follow the coloured pathways (retina, optic nerve, chiasm, tract and nuclei).",
        ko: "색으로 표시된 경로(망막, 시신경, 시신경교차, 시삭, 신경핵)를 따라갑니다.",
      },
    ],
  },
  {
    name: "Parasympathetic motor pathway",
    seconds: 32,
    cues: [
      {
        id: "efferent-definition",
        offset: 0,
        end: 8,
        en: "The efferent pathway is the opposite of the afferent pathway: it carries signals from the brain to the eye.",
        ko: "원심성 경로는 구심성 경로와 반대로, 뇌에서 눈으로 신호를 전달합니다.",
      },
      {
        id: "parasympathetic",
        offset: 8,
        end: 18,
        en: "The parasympathetic pathway passes through the third cranial nerve and the ciliary ganglion.",
        ko: "부교감신경 경로는 제3뇌신경과 섬모체신경절을 지납니다.",
      },
      {
        id: "constrictor",
        offset: 18,
        end: 25,
        en: "It supplies the pupil constrictor and the ciliary muscle.",
        ko: "이 경로는 동공괄약근과 섬모체근에 연결됩니다.",
      },
      {
        id: "third-nerve",
        offset: 25,
        end: 32,
        en: "The third cranial nerve also supplies eye movements and the main eyelid muscle.",
        ko: "제3뇌신경은 안구운동과 눈꺼풀을 올리는 주된 근육에도 연결됩니다.",
      },
    ],
  },
  {
    name: "Sympathetic motor pathway",
    seconds: 20,
    cues: [
      {
        id: "sympathetic",
        offset: 0,
        end: 10,
        en: "The sympathetic pathway passes through the sympathetic chain and the superior cervical ganglion.",
        ko: "교감신경 경로는 교감신경줄기와 위목신경절을 지납니다.",
      },
      {
        id: "dilator",
        offset: 10,
        end: 20,
        en: "It supplies the pupil dilator and a minor eyelid muscle, as shown in the diagram.",
        ko: "그림처럼 이 경로는 동공산대근과 눈꺼풀의 보조 근육에 연결됩니다.",
      },
    ],
  },
  {
    name: "Direct and consensual reflex pathways",
    seconds: 24,
    cues: [
      {
        id: "reflex-input",
        offset: 0,
        end: 8,
        en: "Light in one eye sends an afferent signal towards the brain.",
        ko: "한쪽 눈에 비친 빛은 구심성 신호를 뇌로 전달합니다.",
      },
      {
        id: "reflex-output",
        offset: 8,
        end: 16,
        en: "Efferent signals then travel to both pupils, causing them to constrict in response to light.",
        ko: "이어서 원심성 신호가 양쪽 동공으로 전달되어, 빛에 반응해 동공이 수축합니다.",
      },
      {
        id: "reflex-direct",
        offset: 16,
        end: 19.5,
        en: "The illuminated pupil has a direct response.",
        ko: "이것이 직접 대광반사입니다.",
      },
      {
        id: "reflex-consensual",
        offset: 19.5,
        end: 24,
        en: "The other pupil has a consensual response.",
        ko: "반대쪽 동공은 간접 대광반사를 보입니다.",
      },
    ],
  },
  {
    name: "Consensual response in both directions",
    seconds: 22,
    cues: [
      {
        id: "consensual-first",
        offset: 0,
        end: 8,
        en: "Shine light into one eye and watch the other pupil constrict. This is the consensual response.",
        ko: "한쪽 눈에 빛을 비출 때 반대쪽 동공도 수축하는 것이 간접 대광반사입니다.",
      },
      {
        id: "consensual-other",
        offset: 8,
        end: 22,
        en: "Repeat from the other side, watching the pupil that is not being directly illuminated.",
        ko: "반대쪽에서도 반복하며 빛을 직접 비추지 않은 눈의 동공을 관찰합니다.",
      },
    ],
  },
  {
    name: "Swinging the light between eyes",
    seconds: 20,
    cues: [
      {
        id: "swing-method",
        offset: 0,
        end: 10,
        en: "Move the light from one eye to the other, comparing the pupil responses.",
        ko: "빛을 한쪽 눈에서 반대쪽 눈으로 옮기며 동공 반응을 비교합니다.",
      },
      {
        id: "swing-return",
        offset: 10,
        end: 20,
        en: "Swing the light back and observe both pupils each time the illuminated eye changes.",
        ko: "빛을 다시 옮기고, 빛을 비추는 눈이 바뀔 때마다 양쪽 동공을 관찰합니다.",
      },
    ],
  },
  {
    name: "Normal response and right RAPD",
    seconds: 24,
    cues: [
      {
        id: "swing-normal",
        offset: 0,
        end: 10,
        en: "In the normal example, the pupil remains constricted when the light returns to this eye.",
        ko: "정상 예시에서는 빛이 이 눈으로 돌아와도 동공이 수축된 상태를 유지합니다.",
      },
      {
        id: "swing-rapd",
        offset: 10,
        end: 24,
        en: "A relative afferent pupillary defect, or RAPD, means a weaker light signal from one eye. Here, the pupils paradoxically dilate when light moves to the affected right eye.",
        ko: "상대구심동공운동장애, 즉 RAPD는 한쪽 눈의 빛 신호가 약해진 상태입니다. 빛을 이상이 있는 오른쪽 눈으로 옮기면 동공이 역설적으로 커집니다.",
      },
    ],
  },
  {
    name: "Near response examination",
    seconds: 21,
    cues: [
      {
        id: "near-distance",
        offset: 0,
        end: 9,
        en: "First ask the patient to look at a distant target.",
        ko: "먼저 환자가 멀리 있는 목표물을 보게 합니다.",
      },
      {
        id: "near-target",
        offset: 9,
        end: 21,
        en: "Then ask them to look at a near target, as shown here with the Arclight.",
        ko: "그다음 그림의 아크라이트처럼 가까이 있는 목표물을 보게 합니다.",
      },
    ],
  },
  {
    name: "Comparing near responses",
    seconds: 20,
    cues: [
      {
        id: "near-normal",
        offset: 0,
        end: 10,
        en: "When looking at a near target, both eyes normally turn inward together. This is called convergence.",
        ko: "가까운 목표물을 볼 때 두 눈이 함께 안쪽으로 향하는 반응을 눈모음, 또는 폭주라고 합니다.",
      },
      {
        id: "near-abnormal",
        offset: 10,
        end: 20,
        en: "If the eyes do not turn inward together for a near target, further examination is needed.",
        ko: "가까운 목표물을 볼 때 두 눈이 함께 안쪽으로 향하지 않으면 추가 검사가 필요합니다.",
      },
    ],
  },
];
export const PUPILS_ADVANCED_STAGES = [
  ...OWN_STAGES.slice(0, 4),
  ...PUPILS_PEC_STAGES.map((stage, pecStageIndex) => ({
    ...stage,
    pecStageIndex,
  })),
  ...OWN_STAGES.slice(4),
];
let clock = 1;
export const PUPILS_ADVANCED_VISUAL_END_FRAMES = { 0: 662, 10: 390 };
const clips = PUPILS_ADVANCED_STAGES.map((stage, i) => {
  const clip = {
    start: clock,
    end: clock + stage.seconds,
    cueIds: stage.cues.map((c) => c.id),
  };
  clock = clip.end;
  if (i === 0)
    clip.endByLanguage = {
      en: clip.start + 662 / 30 + 1.5,
      ko: clip.start + 662 / 30 + 1.5,
    };
  // Keep the reused PEC recording intact and skip only its silent tail.
  if (i === 9)
    clip.endByLanguage = { en: clip.start + 17.76, ko: clip.start + 19.32 };
  if (i === 10)
    clip.endByLanguage = { en: clip.start + 15.43, ko: clip.start + 16.12 };
  return clip;
});
export const PUPILS_ADVANCED_SCROLL_TIMING = {
  folder: "pupils-advanced",
  route: "videos",
  languages: Object.keys(PUPILS_ADVANCED_LANGUAGES),
  stages: clips.map((clip, i) => [
    [clip.start, 0],
    ...(PUPILS_ADVANCED_VISUAL_END_FRAMES[i] == null
      ? []
      : [
          [
            clip.start + PUPILS_ADVANCED_VISUAL_END_FRAMES[i] / 30,
            PUPILS_ADVANCED_VISUAL_END_FRAMES[i],
          ],
        ]),
    [clip.end, PUPILS_ADVANCED_STAGES[i].seconds * 30 - 1],
  ]),
};
export const PUPILS_ADVANCED_SCROLL_CONFIG = {
  pageId: PUPILS_ADVANCED_SCROLL_PAGE,
  label: "Pupils",
  playMode: "stageAutoplay",
  enableReplay: true,
  stageAspectRatioByFile: PUPILS_ADVANCED_STAGES.map((_, i) =>
    i === 3 ? "1169 / 1093" : "1169 / 1280",
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
  paths: PUPILS_ADVANCED_STAGES.map((stage, i) =>
    stage.pecStageIndex == null
      ? "/scrolly/coreexam/pupils-advanced/" + (i + 1) + "/data.json"
      : PUPILS_PEC_SCROLL_CONFIG.paths[stage.pecStageIndex],
  ),
  sections: PUPILS_ADVANCED_SECTIONS,
  segmentRanges: PUPILS_ADVANCED_STAGES.map((stage) => [
    { from: 0, to: stage.seconds * 30 - 1 },
  ]),
  completionHoldFrameByFile: PUPILS_ADVANCED_STAGES.map(
    (stage) => stage.seconds * 30 - 1,
  ),
  segmentStartTexts: PUPILS_ADVANCED_STAGES.map((stage) =>
    stage.cues.map((c) => c.caption?.en ?? c.en),
  ),
  segmentTextModeByFile: PUPILS_ADVANCED_STAGES.map(() => "append"),
  narrationTracks: Object.fromEntries(
    Object.entries(PUPILS_ADVANCED_LANGUAGES).map(([language, { label }]) => [
      language,
      {
        label,
        src: "/narration/pupils-advanced/full-animation/" + language + ".m4a",
      },
    ]),
  ),
  narrationClipsByFile: clips,
};
