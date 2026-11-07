// Teaching order follows the six rows of Cataract_Edit5.pdf, left to right.
// The green column is cataract-compatible, not an all-normal column (row 5).
export const CATARACT_SCROLL_PAGE = "cataractScrollPage";
export const CATARACT_SCROLL_ROUTE = "cataractScroll";
export const CATARACT_LANGUAGES = {
  en: { label: "English", voice: "en-GB-SoniaNeural" },
  ko: { label: "한국어", voice: "ko-KR-SunHiNeural" },
};
export const CATARACT_SECTIONS = [
  {
    startIndex: 0,
    title: "History Taking",
    shortcut: "#/medicalStudentsWorkshop/medicalHistoryTakingPage",
  },
  {
    startIndex: 3,
    title: "Visual Acuity",
    shortcut: "#/videos/visualAcuityExaminationScrollPage",
  },
  {
    startIndex: 6,
    title: "Front of Eye",
    shortcut: "#/videos/frontOfEyeExaminationScrollPage",
  },
  { startIndex: 9, title: "Pupils", shortcut: "#/videos/pupilsPecScrollPage" },
  {
    startIndex: 12,
    title: "Fundal Reflex",
    shortcut: "#/videos/fundalReflexExaminationScrollPage",
  },
  {
    startIndex: 15,
    title: "Fundoscopy",
    shortcut: "#/videos/directOphthalmoscopyScrollPage",
  },
];
export const CATARACT_SECTION_KOREAN = [
  "병력 청취",
  "시력",
  "눈 앞부분",
  "동공",
  "안저반사",
  "안저검사",
];
// Generous cue slots preserve the existing voices without accelerated speech.
export const CATARACT_STAGES = [
  {
    art: "history-method",
    seconds: 18,
    cues: [
      {
        id: "history-onset",
        offset: 0,
        end: 9,
        en: "Ask if the vision has changed and whether it has worsened gradually or suddenly.",
        ko: "시력이 변했는지, 서서히 나빠졌는지 갑자기 나빠졌는지 묻습니다.",
      },
      {
        id: "history-symptoms",
        offset: 9,
        end: 18,
        en: "Ask about pain, redness, one or both eyes, and difficulty with everyday activities.",
        ko: "통증과 충혈, 한쪽 눈인지 양쪽 눈인지, 일상생활에서 겪는 불편을 확인합니다.",
      },
    ],
  },
  {
    art: "history-cataract",
    seconds: 18,
    cues: [
      {
        id: "history-gradual",
        offset: 0,
        end: 9,
        en: "Cataract usually causes gradual, painless blurring of vision.",
        ko: "백내장은 대개 통증 없이 서서히 시야가 흐려지는 증상을 일으킵니다.",
      },
      {
        id: "history-both",
        offset: 9,
        end: 18,
        en: "It may affect both eyes, but the symptoms can be different in each eye.",
        ko: "양쪽 눈에 생길 수 있지만 눈마다 증상은 다를 수 있습니다.",
      },
    ],
  },
  {
    art: "history-refer",
    seconds: 18,
    cues: [
      {
        id: "history-sudden",
        offset: 0,
        end: 9,
        en: "Sudden loss of vision may indicate a problem at the front or back of the eye and needs urgent assessment.",
        ko: "갑작스러운 시력 소실은 눈 앞부분이나 뒷부분의 문제일 수 있으며 긴급한 평가가 필요합니다.",
      },
      {
        id: "history-pain",
        offset: 9,
        end: 18,
        en: "Pain or a red eye suggests a problem at the front of the eye. Arrange referral rather than assuming cataract.",
        ko: "통증이나 충혈은 눈 앞부분의 문제를 시사합니다. 백내장으로 단정하지 말고 의뢰합니다.",
      },
    ],
  },
  {
    art: "acuity-method",
    seconds: 20,
    cues: [
      {
        id: "acuity-distance",
        offset: 0,
        end: 10,
        en: "Measure distance vision in each eye separately, using the patient's usual distance glasses.",
        ko: "평소 원거리 안경을 착용한 상태에서 한쪽 눈씩 가리고 원거리 시력을 측정합니다.",
      },
      {
        id: "acuity-near",
        offset: 10,
        end: 20,
        en: "Check near vision and repeat reduced distance vision with a pinhole.",
        ko: "근거리 시력을 확인하고, 원거리 시력이 낮으면 핀홀을 통해 다시 측정합니다.",
      },
    ],
  },
  {
    art: "acuity-cataract",
    seconds: 20,
    cues: [
      {
        id: "acuity-reduced",
        offset: 0,
        end: 10,
        en: "Cataract can reduce distance and near vision, as shown by the downward arrows.",
        ko: "아래 화살표처럼 백내장은 원거리와 근거리 시력을 모두 낮출 수 있습니다.",
      },
      {
        id: "acuity-pinhole",
        offset: 10,
        end: 20,
        en: "Vision may remain reduced through a pinhole. This supports further examination, but does not diagnose cataract by itself.",
        ko: "핀홀을 사용해도 시력이 낮을 수 있습니다. 추가 검사가 필요하지만, 이것만으로 백내장을 진단하지는 않습니다.",
      },
    ],
  },
  {
    art: "acuity-refer",
    seconds: 18,
    cues: [
      {
        id: "acuity-improves",
        offset: 0,
        end: 9,
        en: "Improvement with a pinhole suggests that a refractive error contributes to the reduced vision.",
        ko: "핀홀을 통해 시력이 좋아지면 굴절이상이 시력 저하의 원인일 수 있습니다.",
      },
      {
        id: "acuity-refraction",
        offset: 9,
        end: 18,
        en: "Arrange refraction and assess the remaining findings. Cataract and refractive error can occur together.",
        ko: "굴절검사를 안내하고 나머지 소견도 평가합니다. 백내장과 굴절이상은 함께 있을 수 있습니다.",
      },
    ],
  },
  {
    art: "method-3",
    seconds: 16,
    cues: [
      {
        id: "front-examine",
        offset: 0,
        end: 8,
        en: "Use the Arclight to inspect the front of each eye with its examination light.",
        ko: "아크라이트의 검사 조명을 사용해 양쪽 눈의 앞부분을 살펴봅니다.",
      },
      {
        id: "front-compare",
        offset: 8,
        end: 16,
        en: "Compare the eyes and look for redness, corneal clouding and other visible abnormalities.",
        ko: "양쪽 눈을 비교하며 충혈, 각막 혼탁과 그 밖의 눈에 보이는 이상을 확인합니다.",
      },
    ],
  },
  {
    art: "front-cataract",
    seconds: 16,
    cues: [
      {
        id: "front-quiet",
        offset: 0,
        end: 8,
        en: "The front of the eye may look quiet, without redness or an obvious surface abnormality.",
        ko: "눈 앞부분은 충혈이나 뚜렷한 표면 이상 없이 정상처럼 보일 수 있습니다.",
      },
      {
        id: "front-not-excluded",
        offset: 8,
        end: 16,
        en: "A normal-looking front of eye does not exclude a cataract behind the pupil.",
        ko: "눈 앞부분이 정상처럼 보여도 동공 뒤 수정체의 백내장을 배제할 수는 없습니다.",
      },
    ],
  },
  {
    art: "front-refer",
    seconds: 18,
    cues: [
      {
        id: "front-opacity",
        offset: 0,
        end: 9,
        en: "A visible opacity or another abnormal appearance needs further eye assessment.",
        ko: "눈에 보이는 혼탁이나 다른 비정상 소견이 있으면 추가 안과 평가가 필요합니다.",
      },
      {
        id: "front-red",
        offset: 9,
        end: 18,
        en: "A red or painful eye is not explained by an uncomplicated cataract. Assess and refer appropriately.",
        ko: "단순 백내장으로 충혈이나 통증을 설명해서는 안 됩니다. 상태를 평가하고 적절히 의뢰합니다.",
      },
    ],
  },
  {
    art: "method-4",
    seconds: 18,
    cues: [
      {
        id: "pupil-direct",
        offset: 0,
        end: 9,
        en: "Shine the light into each eye in turn and observe the direct and consensual pupil responses.",
        ko: "한쪽 눈씩 번갈아 빛을 비추며 직접 대광반사와 간접 대광반사를 관찰합니다.",
      },
      {
        id: "pupil-swing",
        offset: 9,
        end: 18,
        en: "Compare the responses as the light moves between the eyes.",
        ko: "빛을 양쪽 눈 사이로 옮기면서 동공 반응을 비교합니다.",
      },
    ],
  },
  {
    art: "pupil-cataract",
    seconds: 16,
    cues: [
      {
        id: "pupil-constrict",
        offset: 0,
        end: 8,
        en: "In the illustrated normal responses, the pupils become smaller when light is shone into the eyes.",
        ko: "그림의 정상 반응에서는 눈에 빛을 비추면 동공이 작아집니다.",
      },
      {
        id: "pupil-cataract",
        offset: 8,
        end: 16,
        en: "Normal pupil reactions can be present in a patient with cataract.",
        ko: "백내장이 있는 환자에서도 정상 동공 반응을 보일 수 있습니다.",
      },
    ],
  },
  {
    art: "pupil-refer",
    seconds: 18,
    cues: [
      {
        id: "pupil-abnormal",
        offset: 0,
        end: 9,
        en: "A weak, absent or unequal pupil response needs further assessment.",
        ko: "동공 반응이 약하거나 없거나 양쪽이 다르면 추가 평가가 필요합니다.",
      },
      {
        id: "pupil-rapd",
        offset: 9,
        end: 18,
        en: "An afferent pupil defect suggests disease beyond a simple cataract. Arrange referral.",
        ko: "구심성 동공운동장애는 단순 백내장 이외의 질환을 시사하므로 의뢰합니다.",
      },
    ],
  },
  {
    art: "method-5",
    seconds: 18,
    cues: [
      {
        id: "reflex-position",
        offset: 0,
        end: 9,
        en: "In a dim room, look through the Arclight from a distance and compare the fundal reflexes.",
        ko: "어두운 방에서 거리를 두고 아크라이트를 통해 양쪽 안저반사를 비교합니다.",
      },
      {
        id: "reflex-observe",
        offset: 9,
        end: 18,
        en: "Look for the brightness, colour and any shadows within each pupil.",
        ko: "동공 안의 반사 밝기와 색, 그림자가 있는지 관찰합니다.",
      },
    ],
  },
  {
    art: "reflex-cataract",
    seconds: 22,
    cues: [
      {
        id: "reflex-opacity",
        offset: 0,
        end: 11,
        en: "This green-column example is an exception: it shows lens opacity and dark interruptions consistent with cataract, not normal findings.",
        ko: "초록 열의 이 예시는 예외입니다. 정상 소견이 아니라 백내장에 부합하는 수정체 혼탁과 검은 그림자를 보여 줍니다.",
      },
      {
        id: "reflex-patterns",
        offset: 11,
        end: 22,
        en: "The appearance varies with the position and density of the opacity. Assess it together with the history and vision.",
        ko: "혼탁의 위치와 정도에 따라 모습이 달라집니다. 병력 및 시력과 함께 평가합니다.",
      },
    ],
  },
  {
    art: "reflex-refer",
    seconds: 20,
    cues: [
      {
        id: "reflex-white",
        offset: 0,
        end: 10,
        en: "A white, unusually pale, absent or asymmetric reflex must not automatically be labelled cataract.",
        ko: "흰색이거나 유난히 창백하거나 없거나 비대칭인 반사를 백내장으로 단정해서는 안 됩니다.",
      },
      {
        id: "reflex-referral",
        offset: 10,
        end: 20,
        en: "Other eye disease may cause an abnormal reflex. Arrange eye assessment; a white pupil in a child needs urgent referral.",
        ko: "다른 안질환도 반사 이상을 일으킬 수 있습니다. 안과 평가를 의뢰하며, 소아의 흰 동공은 긴급 의뢰가 필요합니다.",
      },
    ],
  },
  {
    art: "method-6",
    seconds: 18,
    cues: [
      {
        id: "fundus-close",
        offset: 0,
        end: 9,
        en: "Move closer for fundoscopy, keeping the Arclight aligned with the pupil.",
        ko: "아크라이트를 동공에 맞춘 상태에서 가까이 다가가 안저를 검사합니다.",
      },
      {
        id: "fundus-view",
        offset: 9,
        end: 18,
        en: "Assess the view through the lens and inspect the optic disc and retina when visible.",
        ko: "수정체를 통한 시야를 평가하고, 보이는 경우 시신경유두와 망막을 살펴봅니다.",
      },
    ],
  },
  {
    art: "fundus-cataract",
    seconds: 18,
    cues: [
      {
        id: "fundus-hazy",
        offset: 0,
        end: 9,
        en: "Lens opacity can make the fundus look hazy or prevent a clear view.",
        ko: "수정체 혼탁으로 안저가 흐리게 보이거나 선명하게 관찰되지 않을 수 있습니다.",
      },
      {
        id: "fundus-limits",
        offset: 9,
        end: 18,
        en: "An obscured fundus does not prove that the retina is healthy. Consider specialist assessment.",
        ko: "안저가 가려져 보이지 않는다고 망막이 정상이라는 뜻은 아닙니다. 전문 평가를 고려합니다.",
      },
    ],
  },
  {
    art: "fundus-refer",
    seconds: 20,
    cues: [
      {
        id: "fundus-abnormal",
        offset: 0,
        end: 10,
        en: "Visible abnormalities of the optic disc or retina may explain vision loss and require referral.",
        ko: "시신경유두나 망막의 이상은 시력 저하의 원인일 수 있으며 의뢰가 필요합니다.",
      },
      {
        id: "fundus-combine",
        offset: 10,
        end: 20,
        en: "Combine all six parts of the examination. Cataract can coexist with other disease, so refer according to the complete findings.",
        ko: "여섯 단계의 검사 결과를 종합합니다. 백내장은 다른 질환과 함께 있을 수 있으므로 전체 소견에 따라 의뢰합니다.",
      },
    ],
  },
];
let clock = 1;
const clips = CATARACT_STAGES.map((stage) => {
  const clip = {
    start: clock,
    end: clock + stage.seconds,
    cueIds: stage.cues.map((cue) => cue.id),
  };
  clock = clip.end;
  return clip;
});
export const CATARACT_SCROLL_TIMING = {
  folder: "cataract",
  route: "videos",
  languages: Object.keys(CATARACT_LANGUAGES),
  stages: clips.map((clip, i) => [
    [clip.start, 0],
    [clip.end, CATARACT_STAGES[i].seconds * 30 - 1],
  ]),
};
export const CATARACT_SCROLL_CONFIG = {
  pageId: CATARACT_SCROLL_PAGE,
  label: "Cataract",
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
  paths: CATARACT_STAGES.map(
    (_, i) => `/scrolly/conditions/cataract/${i + 1}/data.json`,
  ),
  stageAspectRatioByFile: CATARACT_STAGES.map(() => "1169 / 1280"),
  sections: CATARACT_SECTIONS,
  getSectionShortcutLabel: (language) =>
    language === "ko" ? "바로가기" : "Open guide",
  segmentRanges: CATARACT_STAGES.map((s) => [
    { from: 0, to: s.seconds * 30 - 1 },
  ]),
  completionHoldFrameByFile: CATARACT_STAGES.map((s) => s.seconds * 30 - 1),
  segmentStartTexts: CATARACT_STAGES.map((s) => s.cues.map((c) => c.en)),
  segmentTextModeByFile: CATARACT_STAGES.map(() => "append"),
  narrationTracks: Object.fromEntries(
    Object.entries(CATARACT_LANGUAGES).map(([lang, { label }]) => [
      lang,
      { label, src: `/narration/cataract/full-animation/${lang}.m4a` },
    ]),
  ),
  narrationClipsByFile: clips,
};
