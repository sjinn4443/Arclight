import { fetchDictionary, get, getLanguage } from "./i18n.js";

const LOTTIE_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js";
const FUNDAL_STAGE_POSTER_FILENAME = "img_0.png";
const FUNDAL_ASSET_PRIME_CACHE = new Set();
const FUNDAL_LOTTIE_RENDERER = (() => {
  if (typeof navigator === "undefined") return "svg";
  const ua = navigator.userAgent || "";
  const iOSDevice = /iPad|iPhone|iPod/.test(ua);
  const iPadOSDesktopUA =
    navigator.platform === "MacIntel" &&
    Number(navigator.maxTouchPoints || 0) > 1;
  return iOSDevice || iPadOSDesktopUA ? "canvas" : "svg";
})();

const ROUTE_CONFIG = {
  childhoodFundalPreparation: {
    pageId: "childhoodFundalPreparationPage",
    label: "Preparation",
    enableReplay: true,
    persistentSettleSnapshotOverlay: true,
    segmentTextToggleOnTitle: true,
    paths: [
      "/scrolly/coreexam/fundalreflex/prep/1/data.json",
      "/scrolly/coreexam/fundalreflex/prep/2/data.json",
      "/scrolly/coreexam/fundalreflex/prep/3/data.json",
      "/scrolly/coreexam/fundalreflex/prep/4/data.json",
    ],
    playMode: "segmentScroll",
    // User-provided segment plan (inclusive frame ranges).
    // file1: one full segment (0 -> END).
    segmentRanges: [
      [{ from: 37, to: 239 }],
      [
        { from: 0, to: 120 },
        { from: 121, to: 205 },
        { from: 206, to: 299 },
      ],
      [
        { from: 0, to: 101 },
        { from: 102, to: 222 },
        { from: 236, to: 354 },
        { from: 380, to: 539 },
      ],
      [
        { from: 0, to: 164 },
        { from: 271, to: 316 },
        { from: 317, to: 398 },
        { from: 399, to: 539 },
      ],
    ],
    settleFrameOverrides: [
      [239],
      [120, 205, 299],
      [101, 222, 354, 539],
      [164, 316, 398, 539],
    ],
    segmentStartTexts: [
      ["Wash hands"],
      [
        "Use brightest light setting",
        "Ensure lenses are at top",
        "Examine in quiet, dim room",
      ],
      ["Hold Arclight close to your eye"],
      [
        "Swaddle newborn securely",
        "Parent holds older baby",
        "",
        "Older child can sit independently",
      ],
    ],
    segmentTextModeByFile: ["append", "append", "append", "append"],
    strictFrameLockNoFallback: true,
    strictFrameRemountOnBlank: true,
    iosAggressiveSettleSegments: [[0], [1, 2], [3], [1, 2, 3]],
    richSettleContentFiles: [0, 1, 2, 3],
    richSettleMinAreaByFile: [0.08, 0.12, 0.12, 0.12],
  },
  childhoodFundalExamination: {
    pageId: "childhoodFundalExaminationPage",
    label: "Examination",
    enableReplay: true,
    segmentTextToggleOnTitle: true,
    paths: [
      "/scrolly/coreexam/fundalreflex/exam/1/data.json",
      "/scrolly/coreexam/fundalreflex/exam/2/data.json",
      "/scrolly/coreexam/fundalreflex/exam/3/data.json",
      "/scrolly/coreexam/fundalreflex/exam/4/data.json",
      "/scrolly/coreexam/fundalreflex/exam/5/data.json",
    ],
    playMode: "segmentScroll",
    segmentRanges: [
      [{ from: 16, to: 149 }],
      [
        { from: 0, to: 186 },
        { from: 186, to: 329 },
      ],
      [
        { from: 0, to: 78 },
        { from: 79, to: 209 },
        { from: 210, to: 351 },
        { from: 352, to: 449 },
      ],
      [
        { from: 0, to: 114 },
        { from: 115, to: 359 },
      ],
      [
        { from: 0, to: 138 },
        { from: 139, to: 265 },
        { from: 266, to: 449 },
      ],
    ],
    settleFrameOverrides: [
      [149],
      [186, 329],
      [78, 209, 351, 449],
      [114, 359],
      [138, 265, 449],
    ],
    segmentStartTexts: [
      ["Observe reflex at arm's length"],
      ["Move side to side, get closer if needed"],
      ["Examine both eyes together at arm's length"],
      ["Should be no difference in brightness or colour between eyes"],
      [
        "Reflex varies by race\n\nBlack baby: yellow / white / blue reflex",
        "White baby: orange / red reflex",
        "Asian baby: orange / yellow reflex",
      ],
    ],
    segmentTextModeByFile: ["append", "append", "append", "append", "append"],
    strictFrameLockNoFallback: true,
    strictFrameRemountOnBlank: true,
    iosAggressiveSettleSegments: [[0], [1], [2, 3], [1], [2]],
    richSettleContentFiles: [0, 1, 2, 3, 4],
    richSettleMinAreaByFile: [0.08, 0.1, 0.12, 0.1, 0.1],
  },
  childhoodFundalNewbornEyesOpen: {
    pageId: "childhoodFundalNewbornEyesOpenPage",
    label: "Newborn - Eyes Open",
    enableReplay: true,
    segmentTextToggleOnTitle: true,
    paths: [
      "/scrolly/coreexam/fundalreflex/eyesopen/1/data.json",
      "/scrolly/coreexam/fundalreflex/eyesopen/2/data.json",
      "/scrolly/coreexam/fundalreflex/eyesopen/3/data.json",
    ],
    playMode: "segmentScroll",
    segmentRanges: [
      [{ from: 16, to: 419 }],
      [
        { from: 0, to: 147 },
        { from: 148, to: 205 },
        { from: 381, to: 659 },
      ],
      [
        { from: 0, to: 114 },
        { from: 115, to: 262 },
        { from: 263, to: 419 },
      ],
    ],
    settleFrameOverrides: [[419], [147, 205, 659], [114, 262, 419]],
    segmentStartTexts: [
      ["Parent holds baby securely swaddled, arms tucked"],
      ["Observe both eyes together without touching", "", ""],
      [
        "Occasional and short-lasting squints\nare common in the first month of life,",
        "and will usually disappear by three months of age",
      ],
    ],
    segmentTextModeByFile: ["append", "append", "append"],
    strictFrameLockNoFallback: true,
    strictFrameRemountOnBlank: true,
    iosAggressiveSettleSegments: [[0], [2], [1]],
    richSettleContentFiles: [0, 1, 2],
    richSettleMinAreaByFile: [0.08, 0.18, 0.18],
  },
  childhoodFundalNewbornEyesClosed: {
    pageId: "childhoodFundalNewbornEyesClosedPage",
    label: "Newborn - Eyes Closed",
    enableReplay: true,
    segmentTextToggleOnTitle: true,
    paths: [
      "/scrolly/coreexam/fundalreflex/eyesclosed/1/data.json",
      "/scrolly/coreexam/fundalreflex/eyesclosed/2/data.json",
    ],
    playMode: "segmentScroll",
    segmentRanges: [
      [{ from: 0, to: 389 }],
      [
        { from: 0, to: 240 },
        { from: 241, to: 419 },
      ],
    ],
    settleFrameOverrides: [[389], [240, 419]],
    segmentStartTexts: [
      ["Parent holds baby securely swaddled, arms tucked"],
      ["If baby is asleep, gently open one eye at a time"],
    ],
    segmentTextModeByFile: ["append", "append"],
    strictFrameLockNoFallback: true,
    strictFrameRemountOnBlank: true,
    iosAggressiveSettleSegments: [[0], [1]],
    richSettleContentFiles: [0, 1],
    richSettleMinAreaByFile: [0.08, 0.12],
  },
  childhoodFundalUnclearFindings: {
    pageId: "childhoodFundalUnclearFindingsPage",
    label: "Unclear Findings",
    enableReplay: true,
    segmentTextToggleOnTitle: true,
    paths: [
      "/scrolly/coreexam/fundalreflex/unclear/0/data.json",
      "/scrolly/coreexam/fundalreflex/unclear/1/data.json",
      "/scrolly/coreexam/fundalreflex/unclear/2/data.json",
      "/scrolly/coreexam/fundalreflex/unclear/3/data.json",
    ],
    stageAspectRatioByFile: [
      "1169 / 1280",
      "1169 / 1368",
      "1169 / 1368",
      "1169 / 1368",
    ],
    centerTopBiasByFile: [88, 0, 0, 0],
    firstFileExtraTopGap: 30,
    playMode: "segmentScroll",
    segmentRanges: [
      [
        { from: 16, to: 146 },
        { from: 147, to: 269 },
      ],
      [
        { from: 0, to: 172 },
        { from: 172, to: 239 },
      ],
      [
        { from: 0, to: 82 },
        { from: 83, to: 135 },
        { from: 136, to: 209 },
      ],
      [
        { from: 0, to: 235 },
        { from: 240, to: 475 },
        { from: 568, to: 779 },
      ],
    ],
    settleFrameOverrides: [
      [146, 269],
      [172, 239],
      [82, 135, 209],
      [235, 475, 779],
    ],
    segmentStartTexts: [
      ["", "If unclear, follow next steps"],
      ["Compare with parent's reflex; should be similar"],
      ["If unsure, seek colleague's opinion"],
      [
        "If alone, gain consent and record video",
        "Attach Arclight to phone camera",
        "Share securely for second opinion",
      ],
    ],
    segmentTextModeByFile: ["append", "append", "append", "append"],
    strictFrameLockNoFallback: true,
    strictFrameRemountOnBlank: true,
    iosAggressiveSettleSegments: [[0], [1, 2], [2]],
    richSettleContentFiles: [0, 1, 2, 3],
    richSettleMinAreaByFile: [0.1, 0.12, 0.12, 0.12],
  },
  childhoodFundalPossibleFinding: {
    pageId: "childhoodFundalPossibleFindingPage",
    label: "Possible Findings",
    enableReplay: true,
    segmentTextToggleOnTitle: true,
    paths: [
      "/scrolly/coreexam/fundalreflex/findings/1/data.json",
      "/scrolly/coreexam/fundalreflex/findings/2/data.json",
    ],
    stageAspectRatioByFile: ["1146 / 947", "1146 / 1476"],
    preserveAspectRatioByFile: ["xMidYMid meet", "xMidYMid meet"],
    mobileStageTopAligned: false,
    centerTopBiasByFile: [0, -35],
    desktopTopGapByFile: [18, 0],
    playMode: "segmentScroll",
    segmentRanges: [
      [{ from: 0, to: 79 }],
      [
        { from: 0, to: 214 },
        { from: 220, to: 317 },
        { from: 333, to: 509 },
      ],
    ],
    settleFrameOverrides: [[79], [214, 317, 509]],
    segmentStartTexts: [
      ["Similar colour and brightness = normal"],
      [
        "Occasional and short-lasting squints\nare common in the first month of life",
        "and will usually disappear by three months of age",
        "Any colour difference or partial/complete loss = abnormal",
      ],
    ],
    segmentTextModeByFile: ["replace", "replace"],
    strictFrameLockNoFallback: true,
    strictFrameRemountOnBlank: true,
    finalSummaryBulletsByFile: [
      [],
      [
        "Occasional and short-lasting squints are common in the first month of life and will usually disappear by three months of age",
        "Any colour difference or partial/complete loss = abnormal",
      ],
    ],
    iosAggressiveSettleSegments: [[3, 4]],
  },
  childhoodFundalAfterExamination: {
    pageId: "childhoodFundalAfterExaminationPage",
    label: "After Examination",
    enableReplay: true,
    segmentTextToggleOnTitle: true,
    paths: [
      "/scrolly/coreexam/fundalreflex/afterexam/1/data.json",
      "/scrolly/coreexam/fundalreflex/afterexam/2/data.json",
    ],
    playMode: "segmentScroll",
    segmentRanges: [
      [
        { from: 0, to: 89 },
        { from: 90, to: 149 },
      ],
      [{ from: 0, to: 158 }],
    ],
    settleFrameOverrides: [[89, 149], [158]],
    segmentStartTexts: [
      ["Thank parent,", "explain findings, plan next steps"],
      ["Repeat hand wash"],
    ],
    segmentTextModeByFile: ["appendInline", "append"],
    strictFrameLockNoFallback: true,
    strictFrameRemountOnBlank: true,
    iosAggressiveSettleSegments: [[1]],
    richSettleContentFiles: [0, 1],
    richSettleMinAreaByFile: [0.1, 0.12],
  },
};

const FUNDAL_TEXT_KEYS = new Map([
  ["Wash hands", "i18nExtra.fundal_reflex.wash_hands"],
  [
    "Use brightest light setting",
    "i18nExtra.fundal_reflex.select_brightest_light_setting",
  ],
  [
    "Ensure lenses are at top",
    "i18nExtra.fundal_reflex.make_sure_lens_rack_top",
  ],
  ["Examine in quiet, dim room", "i18nExtra.fundal_reflex.room_quiet_and_dim"],
  [
    "Hold Arclight close to your eye",
    "i18nExtra.fundal_reflex.hold_arclight_close_to_eye",
  ],
  [
    "Swaddle newborn securely",
    "i18nExtra.fundal_reflex.newborns_swaddled_securely",
  ],
  [
    "Parent holds older baby",
    "i18nExtra.fundal_reflex.older_babies_parent_hold_lap",
  ],
  [
    "Older child can sit independently",
    "i18nExtra.fundal_reflex.older_children_sit_by_themselves",
  ],
  [
    "Observe reflex at arm's length",
    "i18nExtra.fundal_reflex.observe_reflex_arms_length",
  ],
  [
    "Move side to side, get closer if needed",
    "i18nExtra.fundal_reflex.move_side_get_closer_detail",
  ],
  [
    "Examine both eyes together at arm's length",
    "i18nExtra.fundal_reflex.examine_both_eyes_same_time",
  ],
  [
    "Should be no difference in brightness or colour between eyes",
    "i18nExtra.fundal_reflex.normal_no_difference_between_eyes",
  ],
  [
    "Reflex varies by race\n\nBlack baby: yellow / white / blue reflex",
    "i18nExtra.fundal_reflex.appearance_varies_by_race_black_baby",
  ],
  [
    "White baby: orange / red reflex",
    "i18nExtra.fundal_reflex.white_baby_orange_red_reflex",
  ],
  [
    "Asian baby: orange / yellow reflex",
    "i18nExtra.fundal_reflex.asian_baby_orange_yellow_reflex",
  ],
  [
    "Parent holds baby securely swaddled, arms tucked",
    "i18nExtra.fundal_reflex.parents_hold_baby_swaddled",
  ],
  [
    "Observe both eyes together without touching",
    "i18nExtra.fundal_reflex.observe_reflex_both_eyes_same_time",
  ],
  ["without touching", "i18nExtra.fundal_reflex.without_touching_baby"],
  [
    "Occasional and short-lasting squints\nare common in the first month of life,",
    "i18nExtra.fundal_reflex.occasional_squints_first_month_comma",
  ],
  [
    "and will usually disappear by three months of age",
    "i18nExtra.fundal_reflex.disappear_by_three_months",
  ],
  [
    "If baby is asleep, gently open one eye at a time",
    "i18nExtra.fundal_reflex.if_baby_asleep_open_one_eye",
  ],
  [
    "If unclear, follow next steps",
    "i18nExtra.fundal_reflex.if_unclear_follow_next_steps",
  ],
  [
    "Compare with parent's reflex; should be similar",
    "i18nExtra.fundal_reflex.compare_reflex_with_parent",
  ],
  [
    "If unsure, seek colleague's opinion",
    "i18nExtra.fundal_reflex.ask_colleague_second_opinion",
  ],
  [
    "If alone, gain consent and record video",
    "i18nExtra.fundal_reflex.if_alone_gain_consent_record_video",
  ],
  [
    "Attach Arclight to phone camera",
    "i18nExtra.fundal_reflex.attach_arclight_mobile_camera",
  ],
  [
    "Share securely for second opinion",
    "i18nExtra.fundal_reflex.share_securely_second_opinion",
  ],
  [
    "Similar colour and brightness = normal",
    "i18nExtra.fundal_reflex.if_overall_similar_exam_normal",
  ],
  [
    "Occasional and short-lasting squints\nare common in the first month of life",
    "i18nExtra.fundal_reflex.occasional_squints_first_month",
  ],
  [
    "Any colour difference or partial/complete loss = abnormal",
    "i18nExtra.fundal_reflex.difference_in_reflex_abnormal",
  ],
  [
    "Occasional and short-lasting squints are common in the first month of life and will usually disappear by three months of age",
    "i18nExtra.fundal_reflex.occasional_squints_summary",
  ],
  ["Thank parent,", "i18nExtra.fundal_reflex.offer_thanks"],
  [
    "explain findings, plan next steps",
    "i18nExtra.fundal_reflex.explain_findings_make_plan",
  ],
  ["Repeat hand wash", "i18nExtra.fundal_reflex.repeat_hand_wash"],
  ["Replay", "i18nExtra.fundal_reflex.replay"],
]);

let fundalI18nDict = {};
let fundalI18nLang = null;

async function ensureFundalI18nDictionary() {
  const lang = getLanguage();
  if (fundalI18nLang === lang && fundalI18nDict) return;
  fundalI18nDict = await fetchDictionary(lang);
  fundalI18nLang = lang;
}

function translateFundalText(rawText) {
  const normalized = rawText == null ? "" : String(rawText).trim();
  if (!normalized) return "";

  const key = FUNDAL_TEXT_KEYS.get(normalized);
  if (!key) return normalized;

  return String(get(fundalI18nDict, key) ?? normalized).trim();
}

let activeSession = null;
const IS_IOS_WEBKIT = (() => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const iOSDevice = /iPad|iPhone|iPod/.test(ua);
  const iPadOSDesktopUA =
    navigator.platform === "MacIntel" &&
    Number(navigator.maxTouchPoints || 0) > 1;
  return iOSDevice || iPadOSDesktopUA;
})();
const IOS_REPAINT_NUDGE_PENDING = new WeakSet();

const IOS_FR06_PREPARATION_SEGMENT_RANGES = [
  [{ from: 37, to: 239 }],
  [
    { from: 0, to: 120 },
    { from: 121, to: 207 },
    { from: 208, to: "last" },
  ],
  [
    { from: 0, to: 110 },
    { from: 111, to: 238 },
    { from: 239, to: 378 },
    { from: 379, to: "last" },
  ],
  [
    { from: 0, to: 270 },
    { from: 271, to: 357 },
    { from: 358, to: 453 },
    { from: 454, to: "last" },
  ],
];

const IOS_FR06_PREPARATION_SETTLE_OVERRIDES = [
  [239],
  [120, 207, "last"],
  [110, 238, 378, "last"],
  [270, 357, 453, "last"],
];

function cloneSegmentRanges(segmentRanges) {
  if (!Array.isArray(segmentRanges)) return [];
  return segmentRanges.map((fileSegments) => {
    if (!Array.isArray(fileSegments)) return [];
    return fileSegments.map((segment) => {
      if (!segment || typeof segment !== "object") return segment;
      return { ...segment };
    });
  });
}

function cloneSettleFrameOverrides(settleFrameOverrides) {
  if (!Array.isArray(settleFrameOverrides)) return [];
  return settleFrameOverrides.map((fileOverrides) => {
    if (!Array.isArray(fileOverrides)) return [];
    return fileOverrides.slice();
  });
}

function resolveRuntimeRouteConfig(routeName, baseCfg) {
  if (!baseCfg) return null;
  if (!IS_IOS_WEBKIT) return baseCfg;
  if (routeName !== "childhoodFundalPreparation") return baseCfg;

  // FR06 was user-verified stable on iPhone for Preparation.
  // Keep desktop/Android config untouched; only adjust iOS runtime behavior.
  return {
    ...baseCfg,
    segmentRanges: cloneSegmentRanges(IOS_FR06_PREPARATION_SEGMENT_RANGES),
    settleFrameOverrides: cloneSettleFrameOverrides(
      IOS_FR06_PREPARATION_SETTLE_OVERRIDES,
    ),
    strictFrameLockNoFallback: true,
  };
}

function cleanupActiveSession() {
  if (!activeSession) return;

  try {
    activeSession.observer?.disconnect();
  } catch {}

  try {
    activeSession.removeInputListeners?.();
  } catch {}

  const liveAnimations = Array.isArray(activeSession.controllers)
    ? activeSession.controllers
        .map((controller) => controller?.anim)
        .filter((anim) => !!anim)
    : activeSession.animations || [];

  liveAnimations.forEach((anim) => {
    try {
      anim.destroy();
    } catch {}
  });

  activeSession = null;
}

function resolveStageAspectRatio(cfg, fileIndex) {
  const raw = Array.isArray(cfg?.stageAspectRatioByFile)
    ? cfg.stageAspectRatioByFile[fileIndex]
    : null;
  if (typeof raw === "string" && raw.trim()) return raw.trim();

  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric > 0) return String(numeric);
  return "";
}

function resolveCenterTopBias(cfg, fileIndex) {
  const raw = Array.isArray(cfg?.centerTopBiasByFile)
    ? cfg.centerTopBiasByFile[fileIndex]
    : null;
  const numeric = Number(raw);
  if (Number.isFinite(numeric)) return numeric;
  return 0;
}

function resolveDesktopTopGap(cfg, fileIndex) {
  const raw = Array.isArray(cfg?.desktopTopGapByFile)
    ? cfg.desktopTopGapByFile[fileIndex]
    : cfg?.desktopTopGap;
  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric >= 0) return numeric;
  return 18;
}

function resolvePreserveAspectRatio(cfg, fileIndex) {
  const raw = Array.isArray(cfg?.preserveAspectRatioByFile)
    ? cfg.preserveAspectRatioByFile[fileIndex]
    : null;
  const value = String(raw == null ? "" : raw).trim();
  return value || "xMidYMid meet";
}

function resolveFirstFileExtraTopGap(cfg) {
  const numeric = Number(cfg?.firstFileExtraTopGap);
  if (Number.isFinite(numeric) && numeric >= 0) return numeric;
  return 18;
}

function isNarrowMobileViewport() {
  if (typeof window === "undefined") return false;
  const width = window.innerWidth || document.documentElement?.clientWidth || 0;
  return width > 0 && width <= 768;
}

function isDesktopViewport() {
  if (typeof window === "undefined") return false;
  const width = window.innerWidth || document.documentElement?.clientWidth || 0;
  return width >= 1024;
}

function isWideDesktopViewport() {
  if (typeof window === "undefined") return false;
  const width = window.innerWidth || document.documentElement?.clientWidth || 0;
  return width >= 1440;
}

function shouldUseMobileStageTopAlignedMode(cfg) {
  return cfg?.mobileStageTopAligned === true && isNarrowMobileViewport();
}

function resolveSegmentStartTexts(cfg, fileIndex) {
  const raw = Array.isArray(cfg?.segmentStartTexts)
    ? cfg.segmentStartTexts[fileIndex]
    : null;
  if (!Array.isArray(raw)) return [];

  return raw.map((entry) => translateFundalText(entry));
}

function resolveFinalSummaryBullets(cfg, fileIndex) {
  const raw = Array.isArray(cfg?.finalSummaryBulletsByFile)
    ? cfg.finalSummaryBulletsByFile[fileIndex]
    : null;
  if (!Array.isArray(raw)) return [];

  return raw.map((entry) => translateFundalText(entry));
}

function resolveSegmentTextMode(cfg, fileIndex) {
  const raw = Array.isArray(cfg?.segmentTextModeByFile)
    ? cfg.segmentTextModeByFile[fileIndex]
    : null;
  const mode = String(raw == null ? "" : raw)
    .trim()
    .toLowerCase();
  if (
    mode === "append" ||
    mode === "appendinline" ||
    mode === "sticky" ||
    mode === "replace"
  ) {
    return mode;
  }
  // Default to append so future segment texts accumulate instead of replacing.
  return "append";
}

const TIGHT_LINE_HEIGHT_SEGMENT_TEXTS = new Set(["Parent holds older baby"]);

function normaliseSegmentTextLine(text) {
  return String(text == null ? "" : text)
    .replace(/\r\n?/g, "\n")
    .replace(/\s*\/\s*/g, " / ")
    .trim();
}

function shouldUseTightSegmentTextLineHeight(text) {
  const normalized = normaliseSegmentTextLine(text);
  if (!normalized) return false;
  if (TIGHT_LINE_HEIGHT_SEGMENT_TEXTS.has(normalized)) return true;
  // Keep same-sentence line breaks tighter while preserving paragraph breaks.
  return normalized.includes("\n") && !normalized.includes("\n\n");
}

function normaliseInlineSegmentText(text) {
  return normaliseSegmentTextLine(text)
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function appendInlineSegmentText(existingText, incomingText) {
  const existing = normaliseInlineSegmentText(existingText);
  const incoming = normaliseInlineSegmentText(incomingText);
  if (!incoming) return existing;
  if (!existing) return incoming;
  if (existing.endsWith(incoming)) return existing;
  return `${existing} ${incoming}`.replace(/\s+/g, " ").trim();
}

function renderSegmentTextLine(lineEl, text) {
  if (!lineEl) return;
  const normalized = normaliseSegmentTextLine(text);
  if (!normalized) {
    lineEl.textContent = "";
    return;
  }

  const paragraphs = normalized.split(/\n{2,}/).filter((part) => part.trim());
  if (paragraphs.length <= 1) {
    lineEl.textContent = normalized;
    return;
  }

  lineEl.classList.add("childhood-fundal-segment-text__line--paragraphized");
  paragraphs.forEach((paragraph, idx) => {
    const paragraphEl = document.createElement("div");
    paragraphEl.className = "childhood-fundal-segment-text__paragraph";
    if (idx > 0) {
      paragraphEl.classList.add(
        "childhood-fundal-segment-text__paragraph--half-gap",
      );
    }
    paragraphEl.textContent = paragraph.trim();
    lineEl.appendChild(paragraphEl);
  });
}

function createDownArrowElement() {
  const downArrow = document.createElement("div");
  downArrow.className = "childhood-fundal-scroll-down-arrow";
  downArrow.setAttribute("aria-hidden", "true");
  downArrow.innerHTML =
    '<div class="childhood-fundal-scroll-down-arrow__stack">' +
    '<span class="childhood-fundal-scroll-down-arrow__chev"></span>' +
    '<span class="childhood-fundal-scroll-down-arrow__chev"></span>' +
    '<span class="childhood-fundal-scroll-down-arrow__chev"></span>' +
    "</div>";
  return downArrow;
}

function ensureStageDownArrowElement(stage, existingArrow = null) {
  if (!stage) return null;
  if (existingArrow && existingArrow.parentElement === stage)
    return existingArrow;

  const found = stage.querySelector(".childhood-fundal-scroll-down-arrow");
  if (found) return found;

  const downArrow = existingArrow || createDownArrowElement();
  stage.appendChild(downArrow);
  return downArrow;
}

function resolveStagePosterPath(animationPath) {
  const rawPath = String(animationPath || "").trim();
  if (!rawPath || !/\/data\.json(?:\?.*)?$/i.test(rawPath)) return "";
  return rawPath.replace(
    /\/data\.json(?:\?.*)?$/i,
    `/images/${FUNDAL_STAGE_POSTER_FILENAME}`,
  );
}

function primeFundalAsset(url, options = {}) {
  if (typeof document === "undefined") return;
  const head = document.head || document.querySelector("head");
  if (!head) return;

  const href = String(url || "").trim();
  if (!href) return;

  const rel = String(options.rel || "preload").trim() || "preload";
  const asType = String(options.as || "").trim();
  const key = `${rel}|${asType}|${href}`;
  if (FUNDAL_ASSET_PRIME_CACHE.has(key)) return;
  FUNDAL_ASSET_PRIME_CACHE.add(key);

  const link = document.createElement("link");
  link.rel = rel;
  link.href = href;
  if (asType) link.as = asType;

  const fetchPriority = String(options.fetchPriority || "").trim();
  if (fetchPriority) {
    link.setAttribute("fetchpriority", fetchPriority);
  }

  if (options.crossOrigin) {
    link.crossOrigin = String(options.crossOrigin);
  } else if (asType === "script" && /^https?:\/\//i.test(href)) {
    link.crossOrigin = "anonymous";
  }

  head.appendChild(link);
}

function warmupFundalRouteAssets(cfg) {
  if (!cfg) return;
  const paths = Array.isArray(cfg.paths)
    ? cfg.paths
        .map((path) => String(path || "").trim())
        .filter((path) => !!path)
    : [];
  if (!paths.length) return;

  primeFundalAsset(LOTTIE_SRC, {
    as: "script",
    fetchPriority: "high",
  });

  const firstDataPath = paths[0];
  primeFundalAsset(firstDataPath, {
    as: "fetch",
    fetchPriority: "high",
  });
  primeFundalAsset(resolveStagePosterPath(firstDataPath), {
    as: "image",
    fetchPriority: "high",
  });

  for (let i = 1; i < Math.min(paths.length, 3); i += 1) {
    const path = paths[i];
    primeFundalAsset(path, { rel: "prefetch", as: "fetch" });
    primeFundalAsset(resolveStagePosterPath(path), {
      rel: "prefetch",
      as: "image",
    });
  }
}

function createStagePosterElement(posterPath, fileIndex = 0) {
  if (!posterPath) return null;
  const poster = document.createElement("img");
  poster.className = "childhood-fundal-prep-stage__poster";
  poster.src = posterPath;
  poster.alt = "";
  poster.setAttribute("aria-hidden", "true");
  poster.decoding = "async";
  poster.loading = fileIndex === 0 ? "eager" : "lazy";
  if (fileIndex === 0) {
    poster.setAttribute("fetchpriority", "high");
  }
  return poster;
}

function hideStagePoster(stage, options = {}) {
  if (!stage) return;
  const poster = stage.querySelector(".childhood-fundal-prep-stage__poster");
  stage.classList.remove("childhood-fundal-prep-stage--loading");
  stage.classList.add("childhood-fundal-prep-stage--ready");
  stage.dataset.posterHidden = "1";
  if (!poster) return;

  const removePoster = () => {
    if (poster.parentElement) {
      poster.parentElement.removeChild(poster);
    }
  };
  if (options.immediate === true) {
    removePoster();
    return;
  }

  poster.classList.add("is-fading-out");
  poster.addEventListener("transitionend", removePoster, { once: true });
  window.setTimeout(removePoster, 260);
}

function maybeHideStagePoster(controller, options = {}) {
  const stage = controller?.stage;
  if (!stage || stage.dataset.posterHidden === "1") return;
  if (isStageFrameBlank(controller)) return;
  hideStagePoster(stage, options);
}

function buildAnimationSlots(listEl, label, count, cfg = null) {
  if (!listEl) return [];

  listEl.innerHTML = "";
  const stages = [];

  for (let i = 0; i < count; i += 1) {
    const item = document.createElement("div");
    item.className = "childhood-fundal-prep-item";

    const stage = document.createElement("div");
    stage.className = "childhood-fundal-prep-stage";
    stage.setAttribute("role", "img");
    stage.setAttribute("aria-label", `${label} animation ${i + 1}`);
    stage.dataset.fileIndex = String(i);
    const customAspectRatio = resolveStageAspectRatio(cfg, i);
    if (customAspectRatio) {
      stage.style.aspectRatio = customAspectRatio;
    }
    const animationPath =
      Array.isArray(cfg?.paths) && typeof cfg.paths[i] === "string"
        ? cfg.paths[i]
        : "";
    const posterPath = resolveStagePosterPath(animationPath);
    if (posterPath) {
      stage.classList.add("childhood-fundal-prep-stage--loading");
      stage.dataset.posterHidden = "0";
      const posterEl = createStagePosterElement(posterPath, i);
      if (posterEl) {
        stage.appendChild(posterEl);
      }
    } else {
      stage.dataset.posterHidden = "1";
    }

    const downArrow = createDownArrowElement();

    const segmentText = document.createElement("div");
    segmentText.className = "childhood-fundal-segment-text";
    segmentText.setAttribute("aria-live", "polite");

    stage.appendChild(downArrow);
    item.appendChild(stage);
    item.appendChild(segmentText);
    listEl.appendChild(item);
    stages.push(stage);
  }

  return stages;
}

async function ensureLottie() {
  if (window.lottie) return true;

  if (!window.__lottieLoadPromise) {
    window.__lottieLoadPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${LOTTIE_SRC}"]`);
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = LOTTIE_SRC;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  try {
    await window.__lottieLoadPromise;
  } catch (err) {
    console.error("[fundalScroll] failed to load lottie", err);
  }

  return !!window.lottie;
}

function createViewportController(stages, animations) {
  if (!("IntersectionObserver" in window)) {
    animations.forEach((anim) => anim.play());
    return null;
  }

  const stageToAnimation = new Map();
  stages.forEach((stage, idx) => {
    stageToAnimation.set(stage, animations[idx]);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const anim = stageToAnimation.get(entry.target);
        if (!anim) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          anim.play();
        } else {
          anim.pause();
        }
      });
    },
    {
      threshold: [0, 0.35, 0.7, 1],
      root: null,
      rootMargin: "0px",
    },
  );

  stages.forEach((stage) => observer.observe(stage));
  return observer;
}

function getAnimationLastFrame(anim) {
  const op = Number(anim?.animationData?.op);
  if (Number.isFinite(op) && op > 0) return Math.max(0, Math.floor(op - 1));

  const total = Number(anim?.totalFrames);
  if (Number.isFinite(total) && total > 0)
    return Math.max(0, Math.floor(total - 1));

  return 0;
}

function normaliseSegment(rawSegment, lastFrame) {
  let from = 0;
  let to = lastFrame;
  let hasExplicitTo = false;

  if (Array.isArray(rawSegment)) {
    from = Number(rawSegment[0]);
    if (rawSegment[1] == null) {
      to = lastFrame;
    } else {
      to = Number(rawSegment[1]);
      hasExplicitTo = true;
    }
  } else if (rawSegment && typeof rawSegment === "object") {
    from = Number(rawSegment.from);
    if (rawSegment.to == null) {
      to = lastFrame;
    } else {
      to = Number(rawSegment.to);
      hasExplicitTo = true;
    }
  }

  if (!Number.isFinite(from)) from = 0;
  if (!Number.isFinite(to)) to = lastFrame;

  from = Math.max(0, Math.min(lastFrame, Math.floor(from)));
  to = Math.max(from, Math.min(lastFrame, Math.floor(to)));

  return { from, to, hasExplicitTo };
}

function resolveSegmentsForFile(cfg, fileIndex, anim) {
  const lastFrame = getAnimationLastFrame(anim);
  const rawList = cfg.segmentRanges?.[fileIndex];

  if (!Array.isArray(rawList) || rawList.length === 0) {
    return [{ from: 0, to: lastFrame }];
  }

  return rawList.map((raw) => normaliseSegment(raw, lastFrame));
}

function isStrictSegmentEndHold(cfg) {
  return cfg?.strictSegmentEndHold !== false;
}

function shouldUseStrictFrameLockNoFallback(cfg) {
  return cfg?.strictFrameLockNoFallback === true;
}

function shouldUsePersistentSettleSnapshotOverlay(cfg) {
  return cfg?.persistentSettleSnapshotOverlay === true;
}

function shouldUseExactSegmentTerminalHold(cfg, segment) {
  if (!isStrictSegmentEndHold(cfg)) return false;
  return segment?.hasExplicitTo === true;
}

function shouldRequireRichSettleContent(cfg, fileIndex) {
  const fileRules = cfg?.richSettleContentFiles;
  if (!Array.isArray(fileRules) || fileRules.length === 0) return false;
  return fileRules.includes(fileIndex);
}

function resolveRichSettleMinArea(cfg, fileIndex) {
  const raw = Array.isArray(cfg?.richSettleMinAreaByFile)
    ? cfg.richSettleMinAreaByFile[fileIndex]
    : null;
  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric > 0) return numeric;
  return 0.16;
}

function getSegmentEndFrame(segment) {
  if (!segment) return 0;
  const safeFrom = Number.isFinite(Number(segment.from))
    ? Math.floor(Number(segment.from))
    : 0;
  const safeTo = Number.isFinite(Number(segment.to))
    ? Math.floor(Number(segment.to))
    : safeFrom;
  return Math.max(safeFrom, safeTo);
}

function isFrameWithinSegment(frame, segment) {
  if (!segment) return false;
  const safeFrom = Number.isFinite(Number(segment.from))
    ? Math.floor(Number(segment.from))
    : 0;
  const safeTo = Number.isFinite(Number(segment.to))
    ? Math.floor(Number(segment.to))
    : safeFrom;
  const numeric = Number(frame);
  if (!Number.isFinite(numeric)) return false;
  const safeFrame = Math.floor(numeric);
  return safeFrame >= safeFrom && safeFrame <= safeTo;
}

function shouldUseIosAggressiveSettle(cfg, fileIndex, segmentIndex, segment) {
  if (shouldUseExactSegmentTerminalHold(cfg, segment)) return false;
  if (!IS_IOS_WEBKIT) return false;
  const fileRules = cfg?.iosAggressiveSettleSegments?.[fileIndex];
  if (!Array.isArray(fileRules) || fileRules.length === 0) return false;
  return fileRules.includes(segmentIndex);
}

function resolvePreferredSettleFrame(cfg, fileIndex, segmentIndex, segment) {
  const safeFrom = Number.isFinite(Number(segment?.from))
    ? Math.floor(Number(segment.from))
    : 0;
  const safeEnd = Number.isFinite(Number(segment?.to))
    ? Math.floor(Number(segment.to))
    : safeFrom;
  const fallback = Math.max(safeFrom, safeEnd);
  const strictSegmentEndHold = shouldUseExactSegmentTerminalHold(cfg, segment);
  if (strictSegmentEndHold) {
    return fallback;
  }
  const fileOverrides = cfg?.settleFrameOverrides?.[fileIndex];
  const raw = Array.isArray(fileOverrides) ? fileOverrides[segmentIndex] : null;
  const segLength = Math.max(0, safeEnd - safeFrom);

  let candidate = fallback;
  let allowOutsideSegment = false;
  if (raw == null || raw === "last") {
    if (IS_IOS_WEBKIT) {
      // iOS Safari frequently drops the terminal frame for some SVG Lottie files.
      // Prefer a slightly earlier "tail-safe" frame on iOS only.
      const tailOffset = Math.max(
        2,
        Math.min(12, Math.floor(segLength * 0.02)),
      );
      candidate = Math.max(safeFrom, safeEnd - tailOffset);
    }
  } else {
    const numeric = Number(raw);
    if (Number.isFinite(numeric)) {
      candidate = Math.floor(numeric);
      allowOutsideSegment = candidate < safeFrom || candidate > safeEnd;
      if (!allowOutsideSegment) {
        candidate = Math.max(safeFrom, Math.min(safeEnd, candidate));
      }
    }
  }

  if (
    !allowOutsideSegment &&
    shouldUseIosAggressiveSettle(cfg, fileIndex, segmentIndex, segment)
  ) {
    // Only for known-problem iOS segments: keep a safer margin from terminal/fade frames.
    const extraBackoff = Math.max(8, Math.min(28, Math.floor(segLength * 0.1)));
    candidate = Math.max(safeFrom, candidate - extraBackoff);
  }

  if (allowOutsideSegment) return candidate;
  return Math.max(safeFrom, Math.min(safeEnd, candidate));
}

function resolveNodeEffectiveVisibility(node, svgEl, cache) {
  if (!node || !svgEl) return { hidden: true, opacity: 0 };
  let opacity = 1;
  let current = node;

  while (current && current.nodeType === 1) {
    let cached = cache.get(current);
    if (!cached) {
      const style = window.getComputedStyle(current);
      const rawOpacity = Number.parseFloat(style?.opacity || "1");
      cached = {
        hidden:
          !style || style.display === "none" || style.visibility === "hidden",
        opacity: Number.isFinite(rawOpacity)
          ? Math.max(0, Math.min(1, rawOpacity))
          : 1,
      };
      cache.set(current, cached);
    }

    if (cached.hidden) return { hidden: true, opacity: 0 };
    opacity *= cached.opacity;
    if (!Number.isFinite(opacity) || opacity <= 0.02) {
      return { hidden: true, opacity: 0 };
    }

    if (current === svgEl) break;
    current = current.parentElement;
  }

  return { hidden: false, opacity };
}

function doesDomRectIntersect(a, b, epsilon = 0.5) {
  if (!a || !b) return false;
  return (
    a.right > b.left + epsilon &&
    a.left < b.right - epsilon &&
    a.bottom > b.top + epsilon &&
    a.top < b.bottom - epsilon
  );
}

function resolveSvgViewportBounds(svgEl) {
  if (!svgEl) return null;
  const vb = svgEl.viewBox?.baseVal;
  const vbWidth = Number(vb?.width);
  const vbHeight = Number(vb?.height);
  if (
    Number.isFinite(vbWidth) &&
    vbWidth > 0.5 &&
    Number.isFinite(vbHeight) &&
    vbHeight > 0.5
  ) {
    const vbX = Number.isFinite(Number(vb?.x)) ? Number(vb.x) : 0;
    const vbY = Number.isFinite(Number(vb?.y)) ? Number(vb.y) : 0;
    return {
      left: vbX,
      top: vbY,
      right: vbX + vbWidth,
      bottom: vbY + vbHeight,
    };
  }

  const rawWidth = Number(svgEl.getAttribute("width"));
  const rawHeight = Number(svgEl.getAttribute("height"));
  const width =
    Number.isFinite(rawWidth) && rawWidth > 0.5
      ? rawWidth
      : Number(svgEl.clientWidth || 0);
  const height =
    Number.isFinite(rawHeight) && rawHeight > 0.5
      ? rawHeight
      : Number(svgEl.clientHeight || 0);
  if (
    !Number.isFinite(width) ||
    width <= 0.5 ||
    !Number.isFinite(height) ||
    height <= 0.5
  ) {
    return null;
  }
  return { left: 0, top: 0, right: width, bottom: height };
}

function doesNodeBBoxIntersectSvgViewport(node, svgEl, epsilon = 0.5) {
  if (!node || typeof node.getBBox !== "function") return false;
  let box = null;
  try {
    box = node.getBBox();
  } catch {}
  if (!box || box.width <= 0.5 || box.height <= 0.5) return false;

  const viewport = resolveSvgViewportBounds(svgEl);
  if (!viewport) return true;

  const boxRight = box.x + box.width;
  const boxBottom = box.y + box.height;
  return (
    boxRight > viewport.left + epsilon &&
    box.x < viewport.right - epsilon &&
    boxBottom > viewport.top + epsilon &&
    box.y < viewport.bottom - epsilon
  );
}

function getControllerSvgElement(controller) {
  return (
    controller?.anim?.renderer?.svgElement ||
    controller?.stage?.querySelector?.("svg") ||
    null
  );
}

function getControllerCanvasElement(controller) {
  const renderer = controller?.anim?.renderer;
  const rendererCanvas =
    renderer?.canvasContext?.canvas || renderer?.canvasElement || null;
  if (rendererCanvas) return rendererCanvas;
  return controller?.stage?.querySelector?.("canvas") || null;
}

function getControllerRenderElement(controller) {
  return (
    getControllerSvgElement(controller) ||
    getControllerCanvasElement(controller) ||
    null
  );
}

function isCanvasRenderElement(el) {
  return String(el?.tagName || "").toUpperCase() === "CANVAS";
}

function cloneCanvasSnapshotNode(canvasEl) {
  if (!canvasEl) return null;
  const width = Number(canvasEl.width || 0);
  const height = Number(canvasEl.height || 0);
  if (!Number.isFinite(width) || width <= 0) return null;
  if (!Number.isFinite(height) || height <= 0) return null;

  const clone = document.createElement("canvas");
  clone.width = width;
  clone.height = height;
  clone.style.display = "block";
  clone.style.width = "100%";
  clone.style.height = "100%";
  try {
    const ctx = clone.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(canvasEl, 0, 0, width, height);
    return clone;
  } catch {
    return null;
  }
}

function sampleCanvasContentMetrics(canvasEl, options = {}) {
  if (!canvasEl) return null;
  const sourceWidth = Number(canvasEl.width || 0);
  const sourceHeight = Number(canvasEl.height || 0);
  if (!Number.isFinite(sourceWidth) || sourceWidth <= 0) return null;
  if (!Number.isFinite(sourceHeight) || sourceHeight <= 0) return null;

  const sampleSize = Math.max(
    12,
    Math.min(
      36,
      Number.isFinite(Number(options.sampleSize))
        ? Math.floor(Number(options.sampleSize))
        : 24,
    ),
  );
  const alphaThreshold = Math.max(
    1,
    Math.min(
      254,
      Number.isFinite(Number(options.alphaThreshold))
        ? Math.floor(Number(options.alphaThreshold))
        : 16,
    ),
  );
  const nearWhiteThreshold = Math.max(
    180,
    Math.min(
      255,
      Number.isFinite(Number(options.nearWhiteThreshold))
        ? Math.floor(Number(options.nearWhiteThreshold))
        : 245,
    ),
  );

  let scratch = sampleCanvasContentMetrics._scratchCanvas;
  if (!scratch) {
    scratch = document.createElement("canvas");
    sampleCanvasContentMetrics._scratchCanvas = scratch;
  }
  if (scratch.width !== sampleSize) scratch.width = sampleSize;
  if (scratch.height !== sampleSize) scratch.height = sampleSize;

  const ctx = scratch.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.clearRect(0, 0, sampleSize, sampleSize);

  try {
    ctx.drawImage(
      canvasEl,
      0,
      0,
      sourceWidth,
      sourceHeight,
      0,
      0,
      sampleSize,
      sampleSize,
    );
  } catch {
    return null;
  }

  let imageData = null;
  try {
    imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
  } catch {
    return null;
  }
  if (!imageData?.data?.length) return null;

  let visibleCount = 0;
  let nonWhiteCount = 0;
  let darkCount = 0;
  const data = imageData.data;
  const totalPixels = sampleSize * sampleSize;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a <= alphaThreshold) continue;

    visibleCount += 1;
    if (
      r < nearWhiteThreshold ||
      g < nearWhiteThreshold ||
      b < nearWhiteThreshold
    ) {
      nonWhiteCount += 1;
    }
    if (r <= 40 && g <= 40 && b <= 40) {
      darkCount += 1;
    }
  }

  const visibleRatio = visibleCount / Math.max(1, totalPixels);
  const nonWhiteRatio = nonWhiteCount / Math.max(1, totalPixels);
  const nonWhiteAmongVisible = nonWhiteCount / Math.max(1, visibleCount);
  const darkRatio = darkCount / Math.max(1, totalPixels);

  return {
    visibleCount,
    totalPixels,
    visibleRatio,
    nonWhiteRatio,
    nonWhiteAmongVisible,
    darkRatio,
  };
}

function isStageFrameBlank(controller) {
  const renderEl = getControllerRenderElement(controller);
  if (!renderEl) return true;

  const renderStyle = window.getComputedStyle(renderEl);
  if (
    !renderStyle ||
    renderStyle.display === "none" ||
    renderStyle.visibility === "hidden"
  ) {
    return true;
  }
  const renderOpacity = Number.parseFloat(renderStyle.opacity || "1");
  if (Number.isFinite(renderOpacity) && renderOpacity <= 0.02) return true;

  const renderRect = renderEl.getBoundingClientRect?.();
  if (!renderRect || renderRect.width <= 0.5 || renderRect.height <= 0.5) {
    return true;
  }

  if (isCanvasRenderElement(renderEl)) {
    const metrics = sampleCanvasContentMetrics(renderEl, {
      sampleSize: 24,
      alphaThreshold: 16,
      nearWhiteThreshold: 246,
    });
    if (!metrics) return false;

    const transparentLike = metrics.visibleRatio <= 0.01;
    const sparseLike =
      metrics.visibleRatio <= 0.05 && metrics.nonWhiteRatio <= 0.015;
    const nearWhiteFlood =
      metrics.visibleRatio >= 0.6 && metrics.nonWhiteAmongVisible <= 0.012;
    return transparentLike || sparseLike || nearWhiteFlood;
  }

  const svgEl = getControllerSvgElement(controller);
  if (!svgEl) return true;

  const nodes = svgEl.querySelectorAll(
    "image,path,rect,circle,ellipse,polygon,polyline,line,use,text",
  );
  if (!nodes.length) return true;
  const visibilityCache = new WeakMap();

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    const effective = resolveNodeEffectiveVisibility(
      node,
      svgEl,
      visibilityCache,
    );
    if (effective.hidden) continue;

    try {
      const rect = node.getBoundingClientRect?.();
      if (!IS_IOS_WEBKIT) {
        if (!rect) continue;
        if (rect.width <= 0.5 || rect.height <= 0.5) continue;
        const intersectsViewport = doesDomRectIntersect(rect, renderRect, 0.5);
        if (!intersectsViewport) continue;
        return false;
      }

      if (
        rect &&
        rect.width > 0.5 &&
        rect.height > 0.5 &&
        doesDomRectIntersect(rect, renderRect, 0.5)
      ) {
        return false;
      }
    } catch {}

    // iOS Safari can intermittently report 0x0 client rects for SVG nodes.
    // Fall back to SVG-local bounds/attributes before treating the frame as blank.
    if (doesNodeBBoxIntersectSvgViewport(node, svgEl, 0.5)) return false;
  }

  return true;
}

function hasRichVisibleContent(controller, minTotalAreaRatio = 0.16) {
  const renderEl = getControllerRenderElement(controller);
  if (!renderEl) return false;

  const renderStyle = window.getComputedStyle(renderEl);
  if (
    !renderStyle ||
    renderStyle.display === "none" ||
    renderStyle.visibility === "hidden"
  ) {
    return false;
  }
  const renderOpacity = Number.parseFloat(renderStyle.opacity || "1");
  if (Number.isFinite(renderOpacity) && renderOpacity <= 0.02) return false;

  const renderRect = renderEl.getBoundingClientRect?.();
  if (!renderRect || renderRect.width <= 0.5 || renderRect.height <= 0.5) {
    return false;
  }

  if (isCanvasRenderElement(renderEl)) {
    const metrics = sampleCanvasContentMetrics(renderEl, {
      sampleSize: 24,
      alphaThreshold: 16,
      nearWhiteThreshold: 245,
    });
    if (!metrics) return true;

    const targetRatio = Number.isFinite(Number(minTotalAreaRatio))
      ? Math.max(0.01, Number(minTotalAreaRatio))
      : 0.16;
    const minVisibleRatio = Math.max(0.03, Math.min(0.35, targetRatio * 0.55));
    const minNonWhiteRatio = Math.max(0.012, Math.min(0.2, targetRatio * 0.5));

    if (metrics.visibleRatio < minVisibleRatio) return false;
    if (metrics.nonWhiteRatio < minNonWhiteRatio) return false;
    if (metrics.nonWhiteAmongVisible < 0.045) return false;
    return true;
  }

  const svgEl = getControllerSvgElement(controller);
  if (!svgEl) return false;

  const svgArea = Math.max(1, renderRect.width * renderRect.height);
  const nodes = svgEl.querySelectorAll(
    "image,path,rect,circle,ellipse,polygon,polyline,line,use,text",
  );
  if (!nodes.length) return false;

  const minimumAreaRatio = Number.isFinite(Number(minTotalAreaRatio))
    ? Math.max(0.01, Number(minTotalAreaRatio))
    : 0.16;
  let areaRatioSum = 0;
  const visibilityCache = new WeakMap();

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    const effective = resolveNodeEffectiveVisibility(
      node,
      svgEl,
      visibilityCache,
    );
    if (effective.hidden) continue;

    const rect = node.getBoundingClientRect?.();
    if (!rect || rect.width <= 0.5 || rect.height <= 0.5) continue;

    const overlapLeft = Math.max(renderRect.left, rect.left);
    const overlapRight = Math.min(renderRect.right, rect.right);
    const overlapTop = Math.max(renderRect.top, rect.top);
    const overlapBottom = Math.min(renderRect.bottom, rect.bottom);
    const overlapWidth = overlapRight - overlapLeft;
    const overlapHeight = overlapBottom - overlapTop;
    if (overlapWidth <= 0.5 || overlapHeight <= 0.5) continue;

    areaRatioSum += (overlapWidth * overlapHeight) / svgArea;
    if (areaRatioSum >= minimumAreaRatio) return true;
  }

  return areaRatioSum >= minimumAreaRatio;
}

function isPinnedFrameUnstable(controller, options = {}) {
  if (!IS_IOS_WEBKIT) return false;
  if (isStageFrameBlank(controller)) return true;
  if (options.requireRichContent !== true) return false;

  const minContentAreaRatio = Number.isFinite(
    Number(options.minContentAreaRatio),
  )
    ? Math.max(0.01, Number(options.minContentAreaRatio))
    : Number.isFinite(Number(controller?.minContentAreaRatio))
      ? Math.max(0.01, Number(controller.minContentAreaRatio))
      : 0.16;
  return !hasRichVisibleContent(controller, minContentAreaRatio);
}

function forceSvgVisibleForController(controller) {
  const renderEl = getControllerRenderElement(controller);
  if (!renderEl) return;

  if (IS_IOS_WEBKIT) {
    // Safari/iOS can drop renderer layers after rapid scroll + frame seeks.
    // Keep stage and render element on a stable compositing layer.
    if (controller?.stage) {
      controller.stage.style.willChange = "transform";
      controller.stage.style.transform = "translate3d(0,0,0)";
      controller.stage.style.webkitTransform = "translate3d(0,0,0)";
      controller.stage.style.backfaceVisibility = "hidden";
      controller.stage.style.webkitBackfaceVisibility = "hidden";
    }
    renderEl.style.willChange = "transform, opacity";
    renderEl.style.transform = "translate3d(0,0,0)";
    renderEl.style.webkitTransform = "translate3d(0,0,0)";
    renderEl.style.backfaceVisibility = "hidden";
    renderEl.style.webkitBackfaceVisibility = "hidden";
  }

  renderEl.style.display = "block";
  renderEl.style.visibility = "visible";
  renderEl.style.opacity = "1";
}

function requestIosStageRepaintNudge(stageEl) {
  if (!IS_IOS_WEBKIT) return;
  if (!stageEl) return;
  if (IOS_REPAINT_NUDGE_PENDING.has(stageEl)) return;
  IOS_REPAINT_NUDGE_PENDING.add(stageEl);

  requestAnimationFrame(() => {
    if (!stageEl?.isConnected) {
      IOS_REPAINT_NUDGE_PENDING.delete(stageEl);
      return;
    }

    const prevTransform = stageEl.style.transform;
    const prevWebkitTransform = stageEl.style.webkitTransform;
    stageEl.style.transform = "translate3d(0,0,0.001px)";
    stageEl.style.webkitTransform = "translate3d(0,0,0.001px)";

    requestAnimationFrame(() => {
      if (stageEl?.isConnected) {
        stageEl.style.transform = prevTransform;
        stageEl.style.webkitTransform = prevWebkitTransform;
      }
      IOS_REPAINT_NUDGE_PENDING.delete(stageEl);
    });
  });
}

function cloneRecoverySnapshotFromStoredMarkup(
  controller,
  maxAllowedFrame = null,
  allowedSegmentIndex = null,
) {
  const storedFrame = Number(controller?.recoverySnapshotFrame);
  const storedSegmentIndex = Number(controller?.recoverySnapshotSegmentIndex);
  const hasMaxAllowedFrame =
    maxAllowedFrame != null && Number.isFinite(Number(maxAllowedFrame));
  const hasAllowedSegmentIndex =
    allowedSegmentIndex != null && Number.isFinite(Number(allowedSegmentIndex));
  if (
    hasAllowedSegmentIndex &&
    Number.isFinite(storedSegmentIndex) &&
    Math.floor(storedSegmentIndex) > Math.floor(Number(allowedSegmentIndex))
  ) {
    return null;
  }
  if (
    hasMaxAllowedFrame &&
    Number.isFinite(storedFrame) &&
    storedFrame > Number(maxAllowedFrame) + 1
  ) {
    return null;
  }

  const canvasDataUrl = String(controller?.recoverySnapshotCanvasDataUrl || "");
  if (canvasDataUrl) {
    const img = document.createElement("img");
    img.src = canvasDataUrl;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.style.display = "block";
    img.style.width = "100%";
    img.style.height = "100%";
    return img;
  }

  const markup = String(controller?.recoverySnapshotMarkup || "").trim();
  if (!markup) return null;

  const template = document.createElement("template");
  template.innerHTML = markup;
  const node = template.content.firstElementChild;
  if (!node) return null;

  node.style.display = "block";
  node.style.width = "100%";
  node.style.height = "100%";
  return node;
}

function rememberRecoverySnapshot(controller, frameHint = null) {
  const renderEl = getControllerRenderElement(controller);
  if (!renderEl) return false;
  if (isStageFrameBlank(controller)) return false;

  let snapshot = null;
  if (isCanvasRenderElement(renderEl)) {
    const canvasSnapshot = cloneCanvasSnapshotNode(renderEl);
    if (canvasSnapshot) {
      snapshot = canvasSnapshot;
      controller.recoverySnapshotMarkup = "";
      controller.recoverySnapshotCanvasDataUrl = "";
      try {
        controller.recoverySnapshotCanvasDataUrl =
          canvasSnapshot.toDataURL("image/png");
      } catch {}
    }
  } else {
    try {
      snapshot = renderEl.cloneNode(true);
    } catch {}
    if (snapshot) {
      snapshot.style.display = "block";
      snapshot.style.width = "100%";
      snapshot.style.height = "100%";
      controller.recoverySnapshotMarkup = snapshot.outerHTML;
      controller.recoverySnapshotCanvasDataUrl = "";
    }
  }
  if (!snapshot) return false;

  const fallbackFrame = Math.floor(Number(controller?.anim?.currentFrame));
  const rawFrame = Number.isFinite(Number(frameHint))
    ? Number(frameHint)
    : fallbackFrame;
  if (Number.isFinite(rawFrame)) {
    controller.recoverySnapshotFrame = clampFrameToAnimation(
      controller,
      rawFrame,
    );
  }
  const snapshotSegIndex = Number(controller?.playingSegmentIndex);
  if (Number.isFinite(snapshotSegIndex) && snapshotSegIndex >= 0) {
    controller.recoverySnapshotSegmentIndex = Math.floor(snapshotSegIndex);
  }
  return true;
}

function captureRecoverySnapshot(controller) {
  const anim = controller?.anim;
  const rawFallbackSegment = controller?.playingSegmentIndex;
  const fallbackSegmentIndex =
    rawFallbackSegment == null || !Number.isFinite(Number(rawFallbackSegment))
      ? null
      : Math.floor(Number(rawFallbackSegment));
  const rawFallbackCeiling = controller?.targetEndFrame;
  const fallbackCeiling =
    rawFallbackCeiling == null || !Number.isFinite(Number(rawFallbackCeiling))
      ? null
      : Number(rawFallbackCeiling);
  if (!anim) {
    return cloneRecoverySnapshotFromStoredMarkup(
      controller,
      fallbackCeiling,
      fallbackSegmentIndex,
    );
  }

  const renderEl = getControllerRenderElement(controller);
  if (renderEl && rememberRecoverySnapshot(controller)) {
    if (isCanvasRenderElement(renderEl)) {
      const canvasSnapshot = cloneCanvasSnapshotNode(renderEl);
      if (canvasSnapshot) return canvasSnapshot;
    }
    const snapshot = cloneRecoverySnapshotFromStoredMarkup(
      controller,
      fallbackCeiling,
      fallbackSegmentIndex,
    );
    if (snapshot) return snapshot;
  }

  return cloneRecoverySnapshotFromStoredMarkup(
    controller,
    fallbackCeiling,
    fallbackSegmentIndex,
  );
}

function ensureRecoveryOverlay(controller) {
  const stage = controller?.stage;
  if (!stage) return null;

  let overlay = controller?.recoveryOverlayEl || null;
  if (overlay && overlay.parentElement === stage) return overlay;

  overlay = document.createElement("div");
  overlay.className = "childhood-fundal-recovery-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.position = "absolute";
  overlay.style.left = "0";
  overlay.style.top = "0";
  overlay.style.right = "0";
  overlay.style.bottom = "0";
  overlay.style.zIndex = "11";
  overlay.style.pointerEvents = "none";
  overlay.style.opacity = "0";
  overlay.style.visibility = "hidden";
  overlay.style.transition = "none";
  overlay.style.background = "transparent";
  stage.appendChild(overlay);
  controller.recoveryOverlayEl = overlay;
  return overlay;
}

function showRecoveryOverlay(controller) {
  const overlay = ensureRecoveryOverlay(controller);
  if (!overlay) return false;

  if (Number.isFinite(controller?.recoveryOverlayClearTimer)) {
    clearTimeout(controller.recoveryOverlayClearTimer);
    controller.recoveryOverlayClearTimer = null;
  }

  // Preserve the existing snapshot while recovery is in-flight.
  if (
    controller?.recoveryOverlayVisible &&
    overlay.style.visibility === "visible" &&
    overlay.childNodes.length > 0
  ) {
    overlay.style.opacity = "1";
    return true;
  }

  const snapshot = captureRecoverySnapshot(controller);
  if (snapshot) {
    overlay.replaceChildren(snapshot);
  }

  if (!overlay.childNodes.length) return false;
  overlay.style.visibility = "visible";
  overlay.style.opacity = "1";
  controller.recoveryOverlayVisible = true;
  return true;
}

function hideRecoveryOverlay(controller, options = {}) {
  const overlay = controller?.recoveryOverlayEl;
  if (!overlay) return;
  const immediate = options?.immediate === true;

  controller.recoveryOverlayVisible = false;
  if (Number.isFinite(controller?.recoveryOverlayClearTimer)) {
    clearTimeout(controller.recoveryOverlayClearTimer);
    controller.recoveryOverlayClearTimer = null;
  }

  const clear = () => {
    if (!controller || controller.recoveryOverlayVisible) return;
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";
    overlay.replaceChildren();
  };

  if (immediate || overlay.style.transition === "none") {
    clear();
    return;
  }

  overlay.style.opacity = "0";
  controller.recoveryOverlayClearTimer = setTimeout(() => {
    controller.recoveryOverlayClearTimer = null;
    clear();
  }, 140);
}

function hideRecoveryOverlayWhenStable(controller, options = {}) {
  if (!controller) return;
  const checks = Math.max(
    1,
    Math.min(
      8,
      Number.isFinite(Number(options.checks))
        ? Math.floor(Number(options.checks))
        : IS_IOS_WEBKIT
          ? 4
          : 2,
    ),
  );
  const requiredStablePasses = Math.max(
    1,
    Math.min(
      4,
      Number.isFinite(Number(options.requiredStablePasses))
        ? Math.floor(Number(options.requiredStablePasses))
        : IS_IOS_WEBKIT
          ? 2
          : 1,
    ),
  );
  let remaining = checks;
  let stablePasses = 0;

  const tick = () => {
    if (!controller) return;
    forceSvgVisibleForController(controller);
    const blank = isStageFrameBlank(controller);
    if (!blank) {
      stablePasses += 1;
      rememberRecoverySnapshot(controller);
    } else {
      stablePasses = 0;
    }
    if (stablePasses >= requiredStablePasses || remaining <= 1) {
      if (!blank) hideRecoveryOverlay(controller);
      return;
    }
    remaining -= 1;
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function syncPersistentSettleSnapshotOverlay(controller) {
  if (!controller?.persistentSettleSnapshotOverlay) return;
  if (controller.isPlaying || controller.isSnapping) return;
  if (isStageFrameBlank(controller)) {
    showRecoveryOverlay(controller);
    return;
  }
  rememberRecoverySnapshot(controller, controller.lastRenderedFrame);
  hideRecoveryOverlay(controller, { immediate: true });
}

function cancelArrowEnsure(controller) {
  const rafId = Number(controller?.arrowEnsureRafId);
  if (!Number.isFinite(rafId)) return;
  try {
    cancelAnimationFrame(rafId);
  } catch {}
  if (controller) controller.arrowEnsureRafId = null;
}

function ensureControllerDownArrow(controller) {
  const stage = controller?.stage;
  if (!stage) return null;

  const arrowEl = ensureStageDownArrowElement(
    stage,
    controller?.arrowEl || null,
  );
  if (!arrowEl) return null;
  controller.arrowEl = arrowEl;
  return arrowEl;
}

function clampFrameToAnimation(controller, frame) {
  const lastFrame = getAnimationLastFrame(controller?.anim);
  const numeric = Number(frame);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(lastFrame, Math.floor(numeric)));
}

function resolveTerminalHoldFrameForSegment(segment) {
  return getSegmentEndFrame(segment);
}

function pinExactFrameWithRecovery(controller, frame, options = {}) {
  const safeFrame = clampFrameToAnimation(controller, frame);
  const lastFrame = getAnimationLastFrame(controller?.anim);
  const allowFrameShift = options.allowFrameShift !== false;
  const attempts = Math.max(
    1,
    Math.min(
      10,
      Number.isFinite(Number(options.attempts))
        ? Math.floor(Number(options.attempts))
        : IS_IOS_WEBKIT
          ? 6
          : 3,
    ),
  );
  const minContentAreaRatio = Number.isFinite(
    Number(options.minContentAreaRatio),
  )
    ? Math.max(0.01, Number(options.minContentAreaRatio))
    : 0.16;
  let isBlank = true;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      controller.anim.pause();
      controller.anim.goToAndStop(safeFrame, true);
    } catch {}
    forceSvgVisibleForController(controller);
    isBlank = isStageFrameBlank(controller);
    if (!isBlank) break;

    if (allowFrameShift) {
      // Nudge for renderer refresh, then always return to the exact target frame.
      const nudgeDistance = Math.max(1, Math.min(12, attempt + 1));
      const backward = Math.max(0, safeFrame - nudgeDistance);
      const forward = Math.min(lastFrame, safeFrame + nudgeDistance);
      const nudgeFrame = attempt % 2 === 0 ? backward : forward;
      if (nudgeFrame !== safeFrame) {
        try {
          controller.anim.goToAndStop(nudgeFrame, true);
        } catch {}
        forceSvgVisibleForController(controller);
        try {
          controller.anim.goToAndStop(safeFrame, true);
        } catch {}
        forceSvgVisibleForController(controller);
        isBlank = isStageFrameBlank(controller);
        if (!isBlank) break;
      }

      // Some Safari/WebKit states need a larger seek jump before returning to target frame.
      if (IS_IOS_WEBKIT && isBlank) {
        const farJump = Math.max(
          0,
          Math.min(
            lastFrame,
            attempt % 2 === 0 ? safeFrame - 8 : safeFrame + 8,
          ),
        );
        if (farJump !== safeFrame) {
          try {
            controller.anim.goToAndStop(farJump, true);
          } catch {}
          forceSvgVisibleForController(controller);
          try {
            controller.anim.goToAndStop(safeFrame, true);
          } catch {}
          forceSvgVisibleForController(controller);
          isBlank = isStageFrameBlank(controller);
          if (!isBlank) break;
        }
      }
    }

    try {
      controller.anim.resize?.();
    } catch {}
    forceSvgVisibleForController(controller);
  }

  try {
    controller.anim.pause();
    controller.anim.goToAndStop(safeFrame, true);
  } catch {}
  forceSvgVisibleForController(controller);
  isBlank = isStageFrameBlank(controller);

  if (!isBlank) {
    controller.lastVisibleFrame = safeFrame;
    controller.lastVisibleFrameEver = safeFrame;
    if (hasRichVisibleContent(controller, minContentAreaRatio)) {
      controller.lastRichVisibleFrame = safeFrame;
      controller.lastRichVisibleFrameEver = safeFrame;
    }
    controller.lastPinnedFrame = safeFrame;
    rememberRecoverySnapshot(controller, safeFrame);
  } else if (IS_IOS_WEBKIT) {
    controller.lastPinnedFrame = null;
  }

  return { frame: safeFrame, isBlank };
}

function requestExactHoldStabilization(controller, frame, options = {}) {
  if (!controller) return;
  const holdFrame = clampFrameToAnimation(controller, frame);
  const allowFrameShift = options.allowFrameShift !== false;
  const passes = Math.max(
    1,
    Math.min(
      8,
      Number.isFinite(Number(options.passes))
        ? Math.floor(Number(options.passes))
        : IS_IOS_WEBKIT
          ? 5
          : 3,
    ),
  );
  const attemptsPerPass = Math.max(
    1,
    Math.min(
      5,
      Number.isFinite(Number(options.attemptsPerPass))
        ? Math.floor(Number(options.attemptsPerPass))
        : IS_IOS_WEBKIT
          ? 3
          : 2,
    ),
  );
  const minContentAreaRatio = Number.isFinite(
    Number(options.minContentAreaRatio),
  )
    ? Math.max(0.01, Number(options.minContentAreaRatio))
    : 0.16;
  const expectedSegIndex = Number(controller.segmentIndex);
  let remaining = passes;

  const tick = () => {
    if (!controller || controller.isPlaying) return;
    if (
      Number.isFinite(expectedSegIndex) &&
      Number(controller.segmentIndex) !== expectedSegIndex
    ) {
      return;
    }

    pinExactFrameWithRecovery(controller, holdFrame, {
      attempts: attemptsPerPass,
      minContentAreaRatio,
      allowFrameShift,
    });

    remaining -= 1;
    if (remaining > 0) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

function waitForNextFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

async function recoverLockedExactFrame(
  controller,
  cfg,
  exactFrame,
  options = {},
) {
  if (!controller) {
    return { frame: 0, isBlank: true };
  }
  const holdFrame = clampFrameToAnimation(controller, exactFrame);
  const segmentCount = Array.isArray(controller?.segments)
    ? controller.segments.length
    : 0;
  const activeSegmentIndexRaw = Number(controller?.segmentIndex);
  const activeSegmentIndex =
    segmentCount > 0 && Number.isFinite(activeSegmentIndexRaw)
      ? Math.max(
          0,
          Math.min(segmentCount - 1, Math.floor(activeSegmentIndexRaw)),
        )
      : -1;
  const requireRichContent = shouldRequireRichSettleContent(
    cfg,
    controller.fileIndex,
  );
  const minContentAreaRatio = Number.isFinite(
    Number(options.minContentAreaRatio),
  )
    ? Math.max(0.01, Number(options.minContentAreaRatio))
    : 0.16;
  const settlePasses = Math.max(
    1,
    Math.min(
      6,
      Number.isFinite(Number(options.settlePasses))
        ? Math.floor(Number(options.settlePasses))
        : IS_IOS_WEBKIT
          ? 2
          : 2,
    ),
  );
  let overlayShown = false;
  const ensureOverlayVisible = () => {
    if (overlayShown) return true;
    overlayShown = showRecoveryOverlay(controller);
    return overlayShown;
  };
  const clearLockedFallback = () => {
    if (activeSegmentIndex < 0) return;
    controller.strictFallbackFrameBySegment?.delete?.(activeSegmentIndex);
  };

  let pinned = pinExactFrameWithRecovery(controller, holdFrame, {
    attempts: IS_IOS_WEBKIT ? 3 : 2,
    minContentAreaRatio,
    allowFrameShift: false,
  });
  if (
    !pinned.isBlank &&
    !isPinnedFrameUnstable(controller, {
      requireRichContent,
      minContentAreaRatio,
    })
  ) {
    clearLockedFallback();
    if (overlayShown) hideRecoveryOverlayWhenStable(controller);
    requestExactHoldStabilization(controller, holdFrame, {
      passes: settlePasses,
      attemptsPerPass: IS_IOS_WEBKIT ? 2 : 2,
      minContentAreaRatio,
      allowFrameShift: false,
    });
    return { frame: holdFrame, isBlank: false };
  }
  ensureOverlayVisible();

  for (let i = 0; i < settlePasses; i += 1) {
    await waitForNextFrame();
    pinned = pinExactFrameWithRecovery(controller, holdFrame, {
      attempts: 1,
      minContentAreaRatio,
      allowFrameShift: false,
    });
    if (
      !pinned.isBlank &&
      !isPinnedFrameUnstable(controller, {
        requireRichContent,
        minContentAreaRatio,
      })
    ) {
      clearLockedFallback();
      if (overlayShown) hideRecoveryOverlayWhenStable(controller);
      requestExactHoldStabilization(controller, holdFrame, {
        passes: settlePasses,
        attemptsPerPass: IS_IOS_WEBKIT ? 2 : 1,
        minContentAreaRatio,
        allowFrameShift: false,
      });
      return { frame: holdFrame, isBlank: false };
    }
  }

  if (
    cfg?.strictFrameRemountOnBlank !== false &&
    typeof controller.remountAtFrame === "function" &&
    !controller.isRemounting
  ) {
    try {
      const remounted = await controller.remountAtFrame(holdFrame, {
        timeoutMs: IS_IOS_WEBKIT ? 650 : 900,
      });
      if (remounted) {
        pinned = pinExactFrameWithRecovery(controller, holdFrame, {
          attempts: IS_IOS_WEBKIT ? 3 : 2,
          minContentAreaRatio,
          allowFrameShift: false,
        });
        if (
          !pinned.isBlank &&
          !isPinnedFrameUnstable(controller, {
            requireRichContent,
            minContentAreaRatio,
          })
        ) {
          clearLockedFallback();
          if (overlayShown) hideRecoveryOverlayWhenStable(controller);
          requestExactHoldStabilization(controller, holdFrame, {
            passes: settlePasses,
            attemptsPerPass: IS_IOS_WEBKIT ? 2 : 2,
            minContentAreaRatio,
            allowFrameShift: false,
          });
          return { frame: holdFrame, isBlank: false };
        }
      }
    } catch {}
  }

  if (activeSegmentIndex >= 0) {
    clearLockedFallback();
    controller.resolvedFrameBySegment?.set(activeSegmentIndex, holdFrame);
  }

  // Keep overlay visible when still blank. Do not shift to fallback frames.
  // strict terminal hold must remain on exact target frame.
  return { frame: holdFrame, isBlank: true };
}

function requestLockedExactFrameRecovery(
  controller,
  cfg,
  exactFrame,
  options = {},
) {
  if (!controller) return;
  if (controller.isLockedExactRecovering) return;
  controller.isLockedExactRecovering = true;

  recoverLockedExactFrame(controller, cfg, exactFrame, options)
    .then((recovered) => {
      if (!controller) return;
      if (!recovered?.isBlank) {
        hideRecoveryOverlayWhenStable(controller);
      } else {
        showRecoveryOverlay(controller);
      }
      syncPersistentSettleSnapshotOverlay(controller);
    })
    .finally(() => {
      if (!controller) return;
      controller.isLockedExactRecovering = false;
    });
}

function cancelStrictExactRecovery(controller, segmentIndex) {
  const map = controller?.strictRecoveryRafBySegment;
  if (!map) return;
  const key = Number(segmentIndex);
  if (!Number.isFinite(key)) return;
  const rafId = Number(map.get(key));
  if (Number.isFinite(rafId)) {
    try {
      cancelAnimationFrame(rafId);
    } catch {}
  }
  map.delete(key);
}

function cancelAllStrictExactRecovery(controller) {
  const map = controller?.strictRecoveryRafBySegment;
  if (!map) return;
  map.forEach((rafId) => {
    const safeRafId = Number(rafId);
    if (!Number.isFinite(safeRafId)) return;
    try {
      cancelAnimationFrame(safeRafId);
    } catch {}
  });
  map.clear();
}

function requestStrictExactRecovery(
  controller,
  segmentIndex,
  segment,
  exactFrame,
  fallbackFrame,
  options = {},
) {
  if (!controller || !segment) return;
  const key = Number(segmentIndex);
  if (!Number.isFinite(key)) return;
  const map = controller.strictRecoveryRafBySegment;
  if (!map) return;
  if (Number.isFinite(Number(map.get(key)))) return;

  const holdExact = clampFrameToAnimation(controller, exactFrame);
  const safeFallback = isFrameWithinSegment(fallbackFrame, segment)
    ? clampFrameToAnimation(controller, fallbackFrame)
    : null;
  const requireRichContent = controller?.requireRichContent === true;
  const minContentAreaRatio = Number.isFinite(
    Number(options.minContentAreaRatio),
  )
    ? Math.max(0.01, Number(options.minContentAreaRatio))
    : 0.16;
  let remaining = Math.max(
    1,
    Math.min(
      40,
      Number.isFinite(Number(options.passes))
        ? Math.floor(Number(options.passes))
        : IS_IOS_WEBKIT
          ? 20
          : 10,
    ),
  );
  const attemptsPerPass = Math.max(
    1,
    Math.min(
      5,
      Number.isFinite(Number(options.attemptsPerPass))
        ? Math.floor(Number(options.attemptsPerPass))
        : IS_IOS_WEBKIT
          ? 3
          : 2,
    ),
  );

  const finish = () => {
    cancelStrictExactRecovery(controller, key);
  };

  const tick = () => {
    if (!controller || controller.isPlaying) {
      finish();
      return;
    }
    if (Number(controller.segmentIndex) !== key) {
      finish();
      return;
    }

    const exactPinned = pinExactFrameWithRecovery(controller, holdExact, {
      attempts: attemptsPerPass,
      minContentAreaRatio,
    });
    if (
      !exactPinned.isBlank &&
      !isPinnedFrameUnstable(controller, {
        requireRichContent,
        minContentAreaRatio,
      })
    ) {
      controller.strictFallbackFrameBySegment?.delete?.(key);
      controller.resolvedFrameBySegment?.set(key, holdExact);
      finish();
      requestExactHoldStabilization(controller, holdExact, {
        passes: IS_IOS_WEBKIT ? 6 : 3,
        attemptsPerPass: IS_IOS_WEBKIT ? 3 : 2,
        minContentAreaRatio,
      });
      return;
    }

    if (Number.isFinite(safeFallback)) {
      pinExactFrameWithRecovery(controller, safeFallback, {
        attempts: 1,
        minContentAreaRatio,
      });
      controller.strictFallbackFrameBySegment?.set(key, safeFallback);
      controller.resolvedFrameBySegment?.set(key, holdExact);
    }

    remaining -= 1;
    if (remaining <= 0) {
      finish();
      return;
    }
    const rafId = requestAnimationFrame(tick);
    map.set(key, rafId);
  };

  const initialRafId = requestAnimationFrame(tick);
  map.set(key, initialRafId);
}

function resolveVisibleFrameInsideSegment(
  controller,
  segment,
  preferredFrame,
  options = {},
) {
  const safeFrom = Number.isFinite(Number(segment?.from))
    ? Math.floor(Number(segment.from))
    : 0;
  const safeTo = Number.isFinite(Number(segment?.to))
    ? Math.floor(Number(segment.to))
    : safeFrom;
  const minContentAreaRatio = Number.isFinite(
    Number(options.minContentAreaRatio),
  )
    ? Math.max(0.01, Number(options.minContentAreaRatio))
    : 0.16;
  const requireRichContent = !!options.requireRichContent;
  const start = Math.max(
    safeFrom,
    Math.min(safeTo, clampFrameToAnimation(controller, preferredFrame)),
  );

  for (let offset = 0; start - offset >= safeFrom; offset += 1) {
    const frame = start - offset;
    try {
      controller.anim.goToAndStop(frame, true);
      forceSvgVisibleForController(controller);
    } catch {}
    if (isStageFrameBlank(controller)) continue;
    if (
      requireRichContent &&
      !hasRichVisibleContent(controller, minContentAreaRatio)
    ) {
      continue;
    }
    return frame;
  }

  for (let frame = start + 1; frame <= safeTo; frame += 1) {
    try {
      controller.anim.goToAndStop(frame, true);
      forceSvgVisibleForController(controller);
    } catch {}
    if (isStageFrameBlank(controller)) continue;
    if (
      requireRichContent &&
      !hasRichVisibleContent(controller, minContentAreaRatio)
    ) {
      continue;
    }
    return frame;
  }

  return start;
}

function resolveStrictFallbackFrame(
  controller,
  segment,
  preferredFrame,
  options = {},
) {
  const requireRichContent = !!options.requireRichContent;
  const minContentAreaRatio = Number.isFinite(
    Number(options.minContentAreaRatio),
  )
    ? Math.max(0.01, Number(options.minContentAreaRatio))
    : 0.16;
  const safeFrom = Number.isFinite(Number(segment?.from))
    ? Math.floor(Number(segment.from))
    : 0;
  const safeTo = Number.isFinite(Number(segment?.to))
    ? Math.floor(Number(segment.to))
    : safeFrom;

  // Prefer frames close to the segment terminal frame.
  const terminalLookback = Math.max(0, Math.min(14, safeTo - safeFrom));
  for (let offset = 0; offset <= terminalLookback; offset += 1) {
    const frame = safeTo - offset;
    try {
      controller.anim.goToAndStop(frame, true);
      forceSvgVisibleForController(controller);
    } catch {}
    if (isStageFrameBlank(controller)) continue;
    if (
      requireRichContent &&
      !hasRichVisibleContent(controller, minContentAreaRatio)
    ) {
      continue;
    }
    return clampFrameToAnimation(controller, frame);
  }

  const candidates = [
    controller?.lastVisibleFrame,
    controller?.lastRenderedFrame,
    controller?.lastPinnedFrame,
    controller?.lastVisibleFrameEver,
  ];
  for (let i = 0; i < candidates.length; i += 1) {
    const candidate = Number(candidates[i]);
    if (!Number.isFinite(candidate)) continue;
    if (!isFrameWithinSegment(candidate, segment)) continue;
    return clampFrameToAnimation(controller, candidate);
  }

  let inside = resolveVisibleFrameInsideSegment(
    controller,
    segment,
    preferredFrame,
    {
      requireRichContent,
      minContentAreaRatio,
    },
  );
  if (!isFrameWithinSegment(inside, segment)) {
    inside = getSegmentEndFrame(segment);
  }

  // Last-resort global recovery if SVG metrics are temporarily broken.
  if (isStageFrameBlank(controller)) {
    const recovered = resolveAnyVisibleFrame(controller, inside, {
      requireRichContent,
      minContentAreaRatio,
    });
    if (isFrameWithinSegment(recovered, segment)) {
      return clampFrameToAnimation(controller, recovered);
    }
  }

  return clampFrameToAnimation(controller, inside);
}

function resolveAnyVisibleFrame(controller, preferredFrame, options = {}) {
  const lastFrame = getAnimationLastFrame(controller?.anim);
  const start = clampFrameToAnimation(controller, preferredFrame);
  const requireRichContent = !!options.requireRichContent;
  const minContentAreaRatio = Number.isFinite(
    Number(options.minContentAreaRatio),
  )
    ? Math.max(0.01, Number(options.minContentAreaRatio))
    : 0.16;

  for (let offset = 0; offset <= lastFrame; offset += 1) {
    const backward = start - offset;
    if (backward >= 0) {
      try {
        controller.anim.goToAndStop(backward, true);
        forceSvgVisibleForController(controller);
      } catch {}
      if (isStageFrameBlank(controller)) continue;
      const richBackward = hasRichVisibleContent(
        controller,
        minContentAreaRatio,
      );
      if (requireRichContent && !richBackward) continue;
      controller.lastVisibleFrame = backward;
      controller.lastVisibleFrameEver = backward;
      if (richBackward) {
        controller.lastRichVisibleFrame = backward;
        controller.lastRichVisibleFrameEver = backward;
      }
      return backward;
    }

    const forward = start + offset;
    if (offset === 0 || forward > lastFrame) continue;
    try {
      controller.anim.goToAndStop(forward, true);
      forceSvgVisibleForController(controller);
    } catch {}
    if (isStageFrameBlank(controller)) continue;
    const richForward = hasRichVisibleContent(controller, minContentAreaRatio);
    if (requireRichContent && !richForward) continue;
    controller.lastVisibleFrame = forward;
    controller.lastVisibleFrameEver = forward;
    if (richForward) {
      controller.lastRichVisibleFrame = forward;
      controller.lastRichVisibleFrameEver = forward;
    }
    return forward;
  }

  return start;
}

function resolveSettledFrame(
  controller,
  segment,
  preferredFrame,
  options = {},
) {
  const safeFrom = Number.isFinite(Number(segment?.from))
    ? Math.floor(Number(segment.from))
    : 0;
  const safeEnd = Number.isFinite(Number(segment?.to))
    ? Math.floor(Number(segment.to))
    : safeFrom;
  const allowOutsideSegment = !!options.allowOutsideSegment;
  const requireRichContent = !!options.requireRichContent;
  const minContentAreaRatio = Number.isFinite(
    Number(options.minContentAreaRatio),
  )
    ? Math.max(0.01, Number(options.minContentAreaRatio))
    : 0.16;
  const minFrame = allowOutsideSegment ? 0 : safeFrom;
  const maxFrame = allowOutsideSegment
    ? getAnimationLastFrame(controller?.anim)
    : safeEnd;

  let candidate = Number.isFinite(Number(preferredFrame))
    ? Math.floor(Number(preferredFrame))
    : safeEnd;
  candidate = Math.max(minFrame, Math.min(maxFrame, candidate));

  const maxLookback = Math.max(0, candidate - minFrame);

  for (let offset = 0; offset <= maxLookback; offset += 1) {
    const frame = candidate - offset;
    try {
      controller.anim.goToAndStop(frame, true);
      forceSvgVisibleForController(controller);
    } catch {}
    if (isStageFrameBlank(controller)) continue;
    if (
      requireRichContent &&
      !hasRichVisibleContent(controller, minContentAreaRatio)
    ) {
      continue;
    }
    if (!isStageFrameBlank(controller)) {
      controller.lastVisibleFrame = frame;
      controller.lastVisibleFrameEver = frame;
      const richFrame = hasRichVisibleContent(controller, minContentAreaRatio);
      if (richFrame) {
        controller.lastRichVisibleFrame = frame;
        controller.lastRichVisibleFrameEver = frame;
      }
      return frame;
    }
  }

  const rememberedInSegment = Number(controller?.lastVisibleFrame);
  if (Number.isFinite(rememberedInSegment)) {
    const rememberedFrame = Math.max(
      minFrame,
      Math.min(maxFrame, Math.floor(rememberedInSegment)),
    );
    try {
      controller.anim.goToAndStop(rememberedFrame, true);
      forceSvgVisibleForController(controller);
    } catch {}
    if (
      !isStageFrameBlank(controller) &&
      (!requireRichContent ||
        hasRichVisibleContent(controller, minContentAreaRatio))
    ) {
      return rememberedFrame;
    }
  }

  const rememberedAny = Number(controller?.lastVisibleFrameEver);
  if (Number.isFinite(rememberedAny)) {
    const rememberedFrame = clampFrameToAnimation(controller, rememberedAny);
    try {
      controller.anim.goToAndStop(rememberedFrame, true);
      forceSvgVisibleForController(controller);
    } catch {}
    if (
      !isStageFrameBlank(controller) &&
      (!requireRichContent ||
        hasRichVisibleContent(controller, minContentAreaRatio))
    ) {
      return rememberedFrame;
    }
  }

  if (requireRichContent) {
    const rememberedRichInSegment = Number(controller?.lastRichVisibleFrame);
    if (Number.isFinite(rememberedRichInSegment)) {
      const richFrame = Math.max(
        minFrame,
        Math.min(maxFrame, Math.floor(rememberedRichInSegment)),
      );
      try {
        controller.anim.goToAndStop(richFrame, true);
        forceSvgVisibleForController(controller);
      } catch {}
      if (
        !isStageFrameBlank(controller) &&
        hasRichVisibleContent(controller, minContentAreaRatio)
      ) {
        return richFrame;
      }
    }

    const rememberedRichAny = Number(controller?.lastRichVisibleFrameEver);
    if (Number.isFinite(rememberedRichAny)) {
      const richFrame = clampFrameToAnimation(controller, rememberedRichAny);
      try {
        controller.anim.goToAndStop(richFrame, true);
        forceSvgVisibleForController(controller);
      } catch {}
      if (
        !isStageFrameBlank(controller) &&
        hasRichVisibleContent(controller, minContentAreaRatio)
      ) {
        return richFrame;
      }
    }
  }

  return resolveAnyVisibleFrame(controller, candidate, {
    requireRichContent,
    minContentAreaRatio,
  });
}

function playSegment(controller, segmentIndex) {
  const seg = controller.segments[segmentIndex];
  if (!seg) return false;
  const storedSnapshotFrame = Number(controller?.recoverySnapshotFrame);
  if (
    Number.isFinite(storedSnapshotFrame) &&
    storedSnapshotFrame > Number(seg.to) + 1
  ) {
    controller.recoverySnapshotMarkup = "";
    controller.recoverySnapshotCanvasDataUrl = "";
    controller.recoverySnapshotFrame = null;
  }
  hideRecoveryOverlay(controller, { immediate: true });
  cancelStrictExactRecovery(controller, segmentIndex);
  controller.strictFallbackFrameBySegment?.delete?.(segmentIndex);
  const segmentText =
    Array.isArray(controller.segmentStartTexts) &&
    segmentIndex >= 0 &&
    segmentIndex < controller.segmentStartTexts.length
      ? controller.segmentStartTexts[segmentIndex]
      : "";
  controller.setSegmentText?.(segmentText);

  controller.hideDownArrow?.();
  controller.playingSegmentIndex = segmentIndex;
  controller.targetEndFrame = seg.to;
  controller.isPlaying = true;
  controller.cancelIosPostSettleRefresh?.();
  controller.lastRenderedFrame = seg.from;
  controller.lastPinnedFrame = null;

  try {
    controller.startCenterLock?.();
  } catch {}
  controller.setPlaybackViewportFreeze?.(true);

  forceSvgVisibleForController(controller);
  controller.anim.goToAndStop(seg.from, true);
  controller.anim.playSegments([seg.from, seg.to], true);
  return true;
}

function playPreviousOrNextSegment(controller, dir) {
  if (!controller.ready || controller.segments.length === 0) return false;
  if (controller.isSnapping) return false;

  if (dir > 0) {
    const nextIndex = controller.segmentIndex + 1;
    if (nextIndex < controller.segments.length) {
      return playSegment(controller, nextIndex);
    }
    return false;
  }

  const prevIndex = controller.segmentIndex - 1;
  if (prevIndex >= 0) {
    return playSegment(controller, prevIndex);
  }

  return false;
}

function stopAtSegmentEnd(controller, cfg) {
  if (!controller.isPlaying || controller.isSnapping) return;
  controller.isSnapping = true;

  const finishedSegIndex = controller.playingSegmentIndex;
  const finishedSeg =
    controller.segments[controller.playingSegmentIndex] || null;
  const strictSegmentEndHold = shouldUseExactSegmentTerminalHold(
    cfg,
    finishedSeg,
  );
  const preferredFrame = finishedSeg
    ? resolvePreferredSettleFrame(
        cfg,
        controller.fileIndex,
        finishedSegIndex,
        finishedSeg,
      )
    : null;
  const allowOutsideSegment =
    finishedSeg && Number.isFinite(Number(preferredFrame))
      ? Number(preferredFrame) < finishedSeg.from ||
        Number(preferredFrame) > finishedSeg.to
      : false;
  const requireRichContent = shouldRequireRichSettleContent(
    cfg,
    controller.fileIndex,
  );
  const minContentAreaRatio = resolveRichSettleMinArea(
    cfg,
    controller.fileIndex,
  );
  let holdFrame = 0;
  if (!finishedSeg && Number.isFinite(controller.targetEndFrame)) {
    holdFrame = Math.max(0, Math.floor(controller.targetEndFrame));
  }
  if (strictSegmentEndHold && finishedSeg) {
    holdFrame = resolveTerminalHoldFrameForSegment(finishedSeg);
  }
  const useLockedExactFrame = strictSegmentEndHold
    ? shouldUseStrictFrameLockNoFallback(cfg)
    : false;
  if (useLockedExactFrame) {
    // Keep a fresh snapshot ready, but only show overlay if recovery actually hits a blank frame.
    rememberRecoverySnapshot(controller, controller.lastRenderedFrame);
    if (IS_IOS_WEBKIT) {
      showRecoveryOverlay(controller);
    } else {
      hideRecoveryOverlay(controller, { immediate: true });
    }
  } else {
    hideRecoveryOverlay(controller, { immediate: true });
  }

  controller.isPlaying = false;
  controller.segmentIndex = controller.playingSegmentIndex;
  controller.targetEndFrame = null;
  try {
    controller.stopCenterLock?.();
  } catch {}
  try {
    controller.anim.pause();
  } catch {}

  requestAnimationFrame(async () => {
    try {
      if (strictSegmentEndHold && finishedSeg) {
        const exactFrame = resolveTerminalHoldFrameForSegment(finishedSeg);
        cancelStrictExactRecovery(controller, finishedSegIndex);
        holdFrame = exactFrame;
        controller.resolvedFrameBySegment?.set(finishedSegIndex, exactFrame);
        if (useLockedExactFrame) {
          controller.strictFallbackFrameBySegment?.delete?.(finishedSegIndex);
          const recovered = await recoverLockedExactFrame(
            controller,
            cfg,
            exactFrame,
            {
              minContentAreaRatio,
            },
          );
          holdFrame = recovered.frame;
          controller.resolvedFrameBySegment?.set(finishedSegIndex, exactFrame);
          if (!recovered?.isBlank) {
            hideRecoveryOverlayWhenStable(controller, {
              checks: IS_IOS_WEBKIT ? 5 : 3,
              requiredStablePasses: 2,
            });
          }
        } else {
          controller.strictFallbackFrameBySegment?.delete?.(finishedSegIndex);
          const pinned = pinExactFrameWithRecovery(controller, exactFrame, {
            attempts: IS_IOS_WEBKIT ? 10 : 6,
            minContentAreaRatio,
          });
          const exactFrameUnstable = isPinnedFrameUnstable(controller, {
            requireRichContent,
            minContentAreaRatio,
          });
          if (pinned.isBlank || exactFrameUnstable) {
            const fallbackFrame = resolveStrictFallbackFrame(
              controller,
              finishedSeg,
              exactFrame,
              {
                requireRichContent,
                minContentAreaRatio,
              },
            );
            holdFrame = fallbackFrame;
            controller.strictFallbackFrameBySegment?.set(
              finishedSegIndex,
              fallbackFrame,
            );
            const fallbackPinned = pinExactFrameWithRecovery(
              controller,
              fallbackFrame,
              {
                attempts: IS_IOS_WEBKIT ? 8 : 5,
                minContentAreaRatio,
              },
            );
            const fallbackUnstable = isPinnedFrameUnstable(controller, {
              requireRichContent,
              minContentAreaRatio,
            });
            if (fallbackPinned.isBlank || fallbackUnstable) {
              let rescueFrame = resolveVisibleFrameInsideSegment(
                controller,
                finishedSeg,
                exactFrame,
                {
                  requireRichContent,
                  minContentAreaRatio,
                },
              );
              if (!isFrameWithinSegment(rescueFrame, finishedSeg)) {
                rescueFrame = fallbackFrame;
              }
              holdFrame = rescueFrame;
              controller.strictFallbackFrameBySegment?.set(
                finishedSegIndex,
                rescueFrame,
              );
              pinExactFrameWithRecovery(controller, rescueFrame, {
                attempts: IS_IOS_WEBKIT ? 10 : 6,
                minContentAreaRatio,
              });
            }
            requestStrictExactRecovery(
              controller,
              finishedSegIndex,
              finishedSeg,
              exactFrame,
              holdFrame,
              {
                passes: IS_IOS_WEBKIT ? 24 : 12,
                attemptsPerPass: IS_IOS_WEBKIT ? 3 : 2,
                minContentAreaRatio,
              },
            );
          } else {
            holdFrame = exactFrame;
            controller.strictFallbackFrameBySegment?.delete?.(finishedSegIndex);
            requestExactHoldStabilization(controller, exactFrame, {
              passes: IS_IOS_WEBKIT ? 10 : 4,
              attemptsPerPass: IS_IOS_WEBKIT ? 4 : 2,
              minContentAreaRatio,
              allowFrameShift: false,
            });
          }
        }
        controller.resolvedFrameBySegment?.set(finishedSegIndex, exactFrame);
      } else {
        if (finishedSeg) {
          holdFrame = resolveSettledFrame(
            controller,
            finishedSeg,
            preferredFrame,
            {
              allowOutsideSegment,
              requireRichContent,
              minContentAreaRatio,
            },
          );
          controller.resolvedFrameBySegment?.set(finishedSegIndex, holdFrame);
        }
        controller.anim.goToAndStop(holdFrame, true);
        forceSvgVisibleForController(controller);
        const isSparseSettle =
          requireRichContent &&
          !isStageFrameBlank(controller) &&
          !hasRichVisibleContent(controller, minContentAreaRatio);
        if (isStageFrameBlank(controller) || isSparseSettle) {
          if (finishedSeg) {
            holdFrame = resolveSettledFrame(
              controller,
              finishedSeg,
              preferredFrame,
              {
                allowOutsideSegment,
                requireRichContent,
                minContentAreaRatio,
              },
            );
          }
          holdFrame = resolveAnyVisibleFrame(controller, holdFrame, {
            requireRichContent,
            minContentAreaRatio,
          });
          controller.anim.goToAndStop(holdFrame, true);
          forceSvgVisibleForController(controller);
        }
        if (!isStageFrameBlank(controller)) {
          controller.lastVisibleFrame = holdFrame;
          controller.lastVisibleFrameEver = holdFrame;
          controller.lastPinnedFrame = holdFrame;
        }
      }
      maybeHideStagePoster(controller);
    } finally {
      controller.isSnapping = false;
      controller.setPlaybackViewportFreeze?.(false);
      syncPersistentSettleSnapshotOverlay(controller);
      requestIosStageRepaintNudge(controller?.stage);
      if (IS_IOS_WEBKIT && Number.isFinite(Number(holdFrame))) {
        controller.requestIosPostSettleRefresh?.(holdFrame, {
          segmentIndex: controller.segmentIndex,
          minContentAreaRatio,
          passes: 8,
          intervalMs: 40,
          attemptsPerTick: 4,
        });
      }
      controller.inputLockUntil = Date.now() + (IS_IOS_WEBKIT ? 820 : 900);
      try {
        controller.onSegmentSettled?.();
      } catch {}
      controller.pendingDir = 0;
    }
  });
}

function getNearestVisibleControllerIndex(controllers) {
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  const viewportCenter = vh / 2;

  let bestIndex = -1;
  let bestDistance = Number.POSITIVE_INFINITY;

  controllers.forEach((controller, idx) => {
    if (!controller.ready) return;
    const rect = controller.stage.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= vh) return;

    const center = (rect.top + rect.bottom) / 2;
    const distance = Math.abs(center - viewportCenter);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = idx;
    }
  });

  return bestIndex;
}

function initializeSegmentScrollMode(cfg, page, stages) {
  let activeFileIndex = 0;
  let hasAnchoredStart = false;
  const shouldEnableTitleSegmentTextToggle =
    cfg.segmentTextToggleOnTitle === true;
  let areSegmentTextsVisible = true;
  let removeTitleSegmentTextToggleListeners = null;
  let hasDispatchedRouteComplete = false;

  const getTopbarHeight = () => {
    const topbar = page.querySelector(".eyes-topbar");
    const raw = topbar?.getBoundingClientRect?.().height;
    return Number.isFinite(raw) && raw > 0 ? raw : 56;
  };

  const dispatchRouteComplete = () => {
    if (hasDispatchedRouteComplete) return;
    const target = cfg?.pageId;
    if (!target) return;

    hasDispatchedRouteComplete = true;
    document.dispatchEvent(
      new CustomEvent("childhoodWorkshop:route-complete", {
        detail: { target },
      }),
    );
  };

  const setSegmentTextsVisibility = (visible) => {
    areSegmentTextsVisible = visible !== false;
    page.classList.toggle(
      "childhood-fundal-segment-text-hidden",
      !areSegmentTextsVisible,
    );
  };

  const updateArrowAnchorForController = (controller) => {
    const arrowEl = ensureControllerDownArrow(controller);
    const stage = controller?.stage;
    if (!arrowEl || !stage) return;

    if (!isDesktopViewport()) {
      arrowEl.style.removeProperty("--fundal-arrow-right");
      arrowEl.style.removeProperty("--fundal-arrow-bottom");
      return;
    }

    const svgEl =
      getControllerRenderElement(controller) || stage.querySelector("canvas");
    if (!svgEl) return;

    const stageRect = stage.getBoundingClientRect?.();
    const svgRect = svgEl.getBoundingClientRect?.();
    if (
      !stageRect ||
      !svgRect ||
      stageRect.width <= 0.5 ||
      svgRect.width <= 0.5
    ) {
      return;
    }

    let rightInset = 10;
    let bottomInset = 10;

    if (
      isWideDesktopViewport() &&
      String(svgEl?.tagName || "").toUpperCase() === "SVG"
    ) {
      // 1440+에서는 SVG viewBox 기준의 실제 렌더 영역 우하단으로 보정한다.
      const vb = svgEl.viewBox?.baseVal;
      const vbWidth = Number(vb?.width);
      const vbHeight = Number(vb?.height);
      if (
        Number.isFinite(vbWidth) &&
        vbWidth > 0 &&
        Number.isFinite(vbHeight) &&
        vbHeight > 0
      ) {
        const scale = Math.min(
          stageRect.width / vbWidth,
          stageRect.height / vbHeight,
        );
        const renderWidth = vbWidth * scale;
        const renderHeight = vbHeight * scale;
        const gutterX = Math.max(0, (stageRect.width - renderWidth) / 2);
        const gutterY = Math.max(0, (stageRect.height - renderHeight) / 2);
        rightInset = Math.max(10, Math.round(gutterX + 10));
        bottomInset = Math.max(10, Math.round(gutterY + 10));
      }
    } else {
      rightInset = Math.max(
        10,
        Math.round(stageRect.right - svgRect.right + 10),
      );
      bottomInset = Math.max(
        10,
        Math.round(stageRect.bottom - svgRect.bottom + 10),
      );
    }

    arrowEl.style.setProperty("--fundal-arrow-right", `${rightInset}px`);
    arrowEl.style.setProperty("--fundal-arrow-bottom", `${bottomInset}px`);
  };

  const updateAllArrowAnchors = () => {
    controllers.forEach((controller) => {
      updateArrowAnchorForController(controller);
    });
  };

  const wireTitleSegmentTextToggle = () => {
    if (!shouldEnableTitleSegmentTextToggle) return;
    const titleEl = page.querySelector(".eyes-topbar .eyes-topbar__title");
    if (!titleEl) return;

    titleEl.classList.add("childhood-fundal-title-toggle");
    titleEl.setAttribute("role", "button");
    titleEl.setAttribute("tabindex", "0");
    titleEl.setAttribute(
      "aria-label",
      "Toggle preparation guidance text on or off",
    );
    titleEl.setAttribute(
      "aria-pressed",
      areSegmentTextsVisible ? "true" : "false",
    );

    const onToggle = (e) => {
      if (e?.type === "keydown") {
        const key = e.key || "";
        if (key !== "Enter" && key !== " ") return;
        e.preventDefault();
      }
      const nextVisible = !areSegmentTextsVisible;
      setSegmentTextsVisibility(nextVisible);
      titleEl.setAttribute("aria-pressed", nextVisible ? "true" : "false");
    };

    titleEl.addEventListener("click", onToggle);
    titleEl.addEventListener("keydown", onToggle);
    removeTitleSegmentTextToggleListeners = () => {
      titleEl.removeEventListener("click", onToggle);
      titleEl.removeEventListener("keydown", onToggle);
      titleEl.classList.remove("childhood-fundal-title-toggle");
      titleEl.removeAttribute("role");
      titleEl.removeAttribute("tabindex");
      titleEl.removeAttribute("aria-label");
      titleEl.removeAttribute("aria-pressed");
    };
  };

  const getCenteredScrollTopForStage = (stage) => {
    const rect = stage.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    const topbarHeight = getTopbarHeight();
    const fileIndex = Number(stage?.dataset?.fileIndex);
    if (shouldUseMobileStageTopAlignedMode(cfg)) {
      return Math.max(0, absoluteTop - topbarHeight);
    }
    if (isDesktopViewport()) {
      const desktopTopGap = Number.isFinite(fileIndex)
        ? resolveDesktopTopGap(cfg, fileIndex)
        : 18;
      return Math.max(0, absoluteTop - topbarHeight - desktopTopGap);
    }
    const stageCenterAbs = absoluteTop + rect.height / 2;
    const availableHeight = Math.max(0, vh - topbarHeight);
    const effectiveViewportCenter = topbarHeight + availableHeight / 2;
    let centerTopBias = Number.isFinite(fileIndex)
      ? resolveCenterTopBias(cfg, fileIndex)
      : 0;
    if (
      isNarrowMobileViewport() &&
      Number.isFinite(fileIndex) &&
      fileIndex > 0
    ) {
      const firstStage = stages?.[0];
      const firstRect = firstStage?.getBoundingClientRect?.();
      const firstHeight = Number(firstRect?.height);
      const currentHeight = Number(rect?.height);
      if (
        Number.isFinite(firstHeight) &&
        firstHeight > 0 &&
        Number.isFinite(currentHeight) &&
        currentHeight > 0
      ) {
        // On mobile, align each file to the same visual lock position as file 1.
        centerTopBias += (currentHeight - firstHeight) / 2;
      }
      // Lift non-first animations a bit higher than file 1 on mobile.
      centerTopBias -= 24;
    }
    return Math.max(
      0,
      stageCenterAbs - effectiveViewportCenter - centerTopBias,
    );
  };

  const centerStage = (stage) => {
    const targetTop = getCenteredScrollTopForStage(stage);
    const currentTop = window.scrollY || window.pageYOffset || 0;
    if (Math.abs(targetTop - currentTop) <= 1) return;
    window.scrollTo({ top: targetTop, behavior: "auto" });
  };

  const scrollToFirstFileStart = () => {
    const firstStage = stages[0];
    if (!firstStage) return;

    const topbarHeight = getTopbarHeight();
    const extraTopGap = shouldUseMobileStageTopAlignedMode(cfg)
      ? 0
      : resolveFirstFileExtraTopGap(cfg);
    const rect = firstStage.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const targetTop = Math.max(0, absoluteTop - topbarHeight - extraTopGap);

    window.scrollTo({
      top: targetTop,
      behavior: "auto",
    });
    activeFileIndex = 0;
  };

  const anchorToFirstFile = () => {
    if (hasAnchoredStart) return;
    hasAnchoredStart = true;
    requestAnimationFrame(() => requestAnimationFrame(scrollToFirstFileStart));
  };

  const controllers = stages.map((stage, idx) => {
    const controller = {
      stage,
      anim: null,
      fileIndex: idx,
      arrowEl:
        stage.parentElement?.querySelector(
          ".childhood-fundal-scroll-down-arrow",
        ) || null,
      segmentTextEl:
        stage.parentElement?.querySelector(".childhood-fundal-segment-text") ||
        null,
      segmentStartTexts: resolveSegmentStartTexts(cfg, idx),
      finalSummaryBulletLines: resolveFinalSummaryBullets(cfg, idx),
      segmentTextMode: resolveSegmentTextMode(cfg, idx),
      segmentTextLines: [],
      segments: [],
      ready: false,
      isPlaying: false,
      isSnapping: false,
      segmentIndex: -1, // last fully completed segment
      playingSegmentIndex: -1,
      targetEndFrame: null,
      pendingDir: 0,
      inputLockUntil: 0,
      failed: false,
      lastRenderedFrame: null,
      lastVisibleFrame: null,
      lastVisibleFrameEver: null,
      lastRichVisibleFrame: null,
      lastRichVisibleFrameEver: null,
      lastPinnedFrame: null,
      resolvedFrameBySegment: new Map(),
      strictFallbackFrameBySegment: new Map(),
      strictRecoveryRafBySegment: new Map(),
      isLockedExactRecovering: false,
      isRemounting: false,
      recoveryOverlayEl: null,
      recoveryOverlayClearTimer: null,
      recoveryOverlayVisible: false,
      recoverySnapshotMarkup: "",
      recoverySnapshotCanvasDataUrl: "",
      recoverySnapshotFrame: null,
      recoverySnapshotSegmentIndex: -1,
      arrowEnsureRafId: null,
      requireRichContent: shouldRequireRichSettleContent(cfg, idx),
      persistentSettleSnapshotOverlay:
        shouldUsePersistentSettleSnapshotOverlay(cfg),
      minContentAreaRatio: resolveRichSettleMinArea(cfg, idx),
      centerLockRafId: null,
      iosPostSettleTimerId: null,
      iosPostSettlePassesRemaining: 0,
      requestIosPostSettleRefresh: null,
      cancelIosPostSettleRefresh: null,
      startCenterLock: null,
      stopCenterLock: null,
      setPlaybackViewportFreeze: null,
      onSegmentSettled: null,
      showDownArrow: null,
      hideDownArrow: null,
      setSegmentText: null,
      clearSegmentText: null,
      showFinalSummaryBullets: null,
      handleAnimationReady: null,
      handleAnimationFailed: null,
      handleAnimationEnterFrame: null,
      handleAnimationComplete: null,
      attachAnimationListeners: null,
      detachAnimationListeners: null,
      remountAtFrame: null,
    };

    controller.showDownArrow = () => {
      const arrowEl = ensureControllerDownArrow(controller);
      if (!arrowEl) return;
      cancelArrowEnsure(controller);
      updateArrowAnchorForController(controller);
      arrowEl.classList.add("is-visible");
    };

    controller.setPlaybackViewportFreeze = setPlaybackViewportFreeze;

    controller.hideDownArrow = () => {
      cancelArrowEnsure(controller);
      const arrowEl = ensureControllerDownArrow(controller);
      if (!arrowEl) return;
      arrowEl.classList.remove("is-visible");
    };

    controller.setSegmentText = (text) => {
      if (!controller.segmentTextEl) return;
      controller.segmentTextEl.classList.remove(
        "childhood-fundal-segment-text--bullet-summary",
      );
      const value = normaliseSegmentTextLine(text);
      if (controller.segmentTextMode === "append") {
        if (value && !controller.segmentTextLines.includes(value)) {
          controller.segmentTextLines.push(value);
        }
      } else if (controller.segmentTextMode === "appendinline") {
        if (value) {
          const merged = appendInlineSegmentText(
            controller.segmentTextLines[0] || "",
            value,
          );
          controller.segmentTextLines = merged ? [merged] : [];
        }
      } else if (controller.segmentTextMode === "sticky") {
        if (value) {
          controller.segmentTextLines = [value];
        }
      } else {
        controller.segmentTextLines = value ? [value] : [];
      }

      controller.segmentTextEl.replaceChildren();
      controller.segmentTextLines.forEach((line) => {
        const lineEl = document.createElement("div");
        lineEl.className = "childhood-fundal-segment-text__line";
        if (shouldUseTightSegmentTextLineHeight(line)) {
          lineEl.classList.add("childhood-fundal-segment-text__line--tight");
        }
        renderSegmentTextLine(lineEl, line);
        controller.segmentTextEl.appendChild(lineEl);
      });
      controller.segmentTextEl.classList.toggle(
        "is-empty",
        controller.segmentTextLines.length === 0,
      );
    };

    controller.showFinalSummaryBullets = () => {
      if (!controller.segmentTextEl) return;
      const lines = Array.isArray(controller.finalSummaryBulletLines)
        ? controller.finalSummaryBulletLines
            .map((line) => normaliseSegmentTextLine(line))
            .filter((line) => !!line)
        : [];
      if (!lines.length) return;

      controller.segmentTextLines = lines.slice();
      controller.segmentTextEl.replaceChildren();

      const listEl = document.createElement("ul");
      listEl.className = "childhood-fundal-segment-text__bullet-list";
      lines.forEach((line) => {
        const itemEl = document.createElement("li");
        itemEl.className = "childhood-fundal-segment-text__bullet-item";
        if (shouldUseTightSegmentTextLineHeight(line)) {
          itemEl.classList.add("childhood-fundal-segment-text__line--tight");
        }
        renderSegmentTextLine(itemEl, line);
        listEl.appendChild(itemEl);
      });

      controller.segmentTextEl.appendChild(listEl);
      controller.segmentTextEl.classList.remove("is-empty");
      controller.segmentTextEl.classList.add(
        "childhood-fundal-segment-text--bullet-summary",
      );
    };

    controller.clearSegmentText = () => {
      controller.segmentTextLines = [];
      if (!controller.segmentTextEl) return;
      controller.segmentTextEl.replaceChildren();
      controller.segmentTextEl.classList.remove(
        "childhood-fundal-segment-text--bullet-summary",
      );
      controller.segmentTextEl.classList.add("is-empty");
    };

    controller.hideDownArrow();
    controller.clearSegmentText();

    controller.stopCenterLock = () => {
      if (!Number.isFinite(controller.centerLockRafId)) return;
      try {
        cancelAnimationFrame(controller.centerLockRafId);
      } catch {}
      controller.centerLockRafId = null;
    };

    controller.requestIosPostSettleRefresh = (frame, options = {}) => {
      scheduleIosPostSettleRefresh(controller, frame, options);
    };

    controller.cancelIosPostSettleRefresh = () => {
      cancelIosPostSettleRefresh(controller);
    };

    controller.startCenterLock = () => {
      controller.stopCenterLock();
      centerStage(controller.stage);

      const tick = () => {
        if (!controller.isPlaying) {
          controller.centerLockRafId = null;
          return;
        }
        centerStage(controller.stage);
        controller.centerLockRafId = requestAnimationFrame(tick);
      };

      controller.centerLockRafId = requestAnimationFrame(tick);
    };

    const createAnimationInstance = () =>
      window.lottie.loadAnimation({
        container: stage,
        renderer: FUNDAL_LOTTIE_RENDERER,
        loop: false,
        autoplay: false,
        path: cfg.paths[idx],
        rendererSettings: {
          preserveAspectRatio: resolvePreserveAspectRatio(cfg, idx),
          hideOnTransparent: false,
        },
      });

    const onReady = () => {
      const activeAnim = controller.anim;
      if (!activeAnim) return;
      if (controller.ready) return;
      if (!controller.isRemounting) {
        hideRecoveryOverlay(controller, { immediate: true });
      }
      controller.segments = resolveSegmentsForFile(cfg, idx, activeAnim);
      controller.ready = true;

      const first = controller.segments[0];
      if (first) {
        activeAnim.goToAndStop(first.from, true);
        forceSvgVisibleForController(controller);
        if (isStageFrameBlank(controller)) {
          const recovered = resolveAnyVisibleFrame(controller, first.from);
          activeAnim.goToAndStop(recovered, true);
          forceSvgVisibleForController(controller);
        }
        if (!isStageFrameBlank(controller)) {
          const currentFrame = clampFrameToAnimation(
            controller,
            Math.floor(Number(activeAnim.currentFrame)),
          );
          controller.lastVisibleFrame = currentFrame;
          controller.lastVisibleFrameEver = currentFrame;
          if (
            hasRichVisibleContent(controller, controller.minContentAreaRatio)
          ) {
            controller.lastRichVisibleFrame = currentFrame;
            controller.lastRichVisibleFrameEver = currentFrame;
          }
          controller.lastPinnedFrame = currentFrame;
          rememberRecoverySnapshot(controller, currentFrame);
        }
      }
      maybeHideStagePoster(controller);

      if (idx === 0) {
        anchorToFirstFile();
      }
      requestAnimationFrame(() => {
        ensureControllerDownArrow(controller);
        updateArrowAnchorForController(controller);
      });
    };

    const onDataFailed = () => {
      controller.failed = true;
      console.error("[fundalScroll] animation data failed:", cfg.paths[idx]);
    };

    const onEnterFrame = () => {
      const activeAnim = controller.anim;
      if (!activeAnim) return;
      if (controller.stage?.dataset?.posterHidden !== "1") {
        maybeHideStagePoster(controller);
      }

      if (controller.isPlaying) {
        const activeSeg = controller.segments[controller.playingSegmentIndex];
        if (activeSeg) {
          const current = Math.floor(Number(activeAnim.currentFrame));
          if (Number.isFinite(current)) {
            controller.lastRenderedFrame = Math.max(
              activeSeg.from,
              Math.min(activeSeg.to, current),
            );
            if (!isStageFrameBlank(controller)) {
              controller.lastVisibleFrame = controller.lastRenderedFrame;
              controller.lastVisibleFrameEver = controller.lastRenderedFrame;
              if (
                hasRichVisibleContent(
                  controller,
                  controller.minContentAreaRatio,
                )
              ) {
                controller.lastRichVisibleFrame = controller.lastRenderedFrame;
                controller.lastRichVisibleFrameEver =
                  controller.lastRenderedFrame;
              }

              const nearEndBackoff = Math.max(
                8,
                Math.min(
                  24,
                  Math.floor((activeSeg.to - activeSeg.from + 1) * 0.08),
                ),
              );
              if (
                controller.recoverySnapshotSegmentIndex !==
                  controller.playingSegmentIndex &&
                controller.lastRenderedFrame >= activeSeg.to - nearEndBackoff
              ) {
                if (
                  rememberRecoverySnapshot(
                    controller,
                    controller.lastRenderedFrame,
                  )
                ) {
                  controller.recoverySnapshotSegmentIndex =
                    controller.playingSegmentIndex;
                }
              }
            }
          }
        }
      }

      if (!controller.isPlaying || controller.targetEndFrame == null) return;
      if (
        Math.floor(Number(activeAnim.currentFrame)) >= controller.targetEndFrame
      ) {
        stopAtSegmentEnd(controller, cfg);
      }
    };

    const onComplete = () => {
      if (controller.isPlaying) {
        stopAtSegmentEnd(controller, cfg);
      }
    };

    controller.handleAnimationReady = onReady;
    controller.handleAnimationFailed = onDataFailed;
    controller.handleAnimationEnterFrame = onEnterFrame;
    controller.handleAnimationComplete = onComplete;

    controller.attachAnimationListeners = (targetAnim = controller.anim) => {
      if (!targetAnim) return;
      targetAnim.addEventListener("data_ready", onReady);
      targetAnim.addEventListener("DOMLoaded", onReady);
      targetAnim.addEventListener("data_failed", onDataFailed);
      targetAnim.addEventListener("enterFrame", onEnterFrame);
      targetAnim.addEventListener("complete", onComplete);
    };

    controller.detachAnimationListeners = (targetAnim = controller.anim) => {
      if (!targetAnim) return;
      try {
        targetAnim.removeEventListener("data_ready", onReady);
      } catch {}
      try {
        targetAnim.removeEventListener("DOMLoaded", onReady);
      } catch {}
      try {
        targetAnim.removeEventListener("data_failed", onDataFailed);
      } catch {}
      try {
        targetAnim.removeEventListener("enterFrame", onEnterFrame);
      } catch {}
      try {
        targetAnim.removeEventListener("complete", onComplete);
      } catch {}
    };

    controller.remountAtFrame = (frame, options = {}) =>
      new Promise((resolve) => {
        if (controller.isRemounting) {
          resolve(false);
          return;
        }
        if (!controller.stage) {
          resolve(false);
          return;
        }

        controller.isRemounting = true;
        const priorAnim = controller.anim;
        const targetFrame = clampFrameToAnimation(controller, frame);
        let timeoutId = null;
        let remountReady = false;
        let nextAnim = null;

        const onRemountReady = () => {
          const activeAnim = controller.anim;
          if (!activeAnim || activeAnim !== nextAnim) {
            finish(false);
            return;
          }
          requestAnimationFrame(() => {
            const pinned = pinExactFrameWithRecovery(controller, targetFrame, {
              attempts: IS_IOS_WEBKIT ? 5 : 3,
              minContentAreaRatio: controller.minContentAreaRatio,
              allowFrameShift: false,
            });
            finish(!pinned.isBlank);
          });
        };

        const onRemountFail = () => {
          finish(false);
        };

        const finish = (ok) => {
          if (remountReady) return;
          remountReady = true;
          if (nextAnim) {
            try {
              nextAnim.removeEventListener("data_ready", onRemountReady);
            } catch {}
            try {
              nextAnim.removeEventListener("DOMLoaded", onRemountReady);
            } catch {}
            try {
              nextAnim.removeEventListener("data_failed", onRemountFail);
            } catch {}
          }
          if (timeoutId != null) {
            clearTimeout(timeoutId);
          }
          controller.isRemounting = false;
          resolve(!!ok);
        };

        try {
          controller.detachAnimationListeners?.(priorAnim);
        } catch {}
        try {
          priorAnim?.destroy?.();
        } catch {}

        controller.ready = false;
        controller.failed = false;
        controller.segments = [];

        nextAnim = createAnimationInstance();
        controller.anim = nextAnim;
        controller.attachAnimationListeners?.(nextAnim);

        nextAnim.addEventListener("data_ready", onRemountReady);
        nextAnim.addEventListener("DOMLoaded", onRemountReady);
        nextAnim.addEventListener("data_failed", onRemountFail);

        timeoutId = setTimeout(
          () => {
            finish(false);
          },
          Math.max(
            600,
            Number.isFinite(Number(options.timeoutMs))
              ? Math.floor(Number(options.timeoutMs))
              : 1800,
          ),
        );
      });

    controller.anim = createAnimationInstance();
    controller.attachAnimationListeners(controller.anim);

    return controller;
  });

  let replayBtn = null;
  const shouldSupportReplay = cfg.enableReplay === true;
  const hideAllDownArrows = () => {
    controllers.forEach((controller) => controller.hideDownArrow?.());
  };
  const ensureArrowVisibleForController = (target, passes = 12) => {
    if (!target) return;
    const initialArrow = ensureControllerDownArrow(target);
    if (!initialArrow) return;
    cancelArrowEnsure(target);
    let remaining = Math.max(
      1,
      Number.isFinite(Number(passes)) ? Math.floor(Number(passes)) : 12,
    );

    const tick = () => {
      const arrowEl = ensureControllerDownArrow(target);
      if (!arrowEl) return;
      if (target.isPlaying || target.isSnapping) {
        target.arrowEnsureRafId = null;
        return;
      }
      updateArrowAnchorForController(target);
      arrowEl.classList.add("is-visible");
      remaining -= 1;
      if (remaining <= 0) {
        target.arrowEnsureRafId = null;
        return;
      }
      target.arrowEnsureRafId = requestAnimationFrame(tick);
    };

    target.arrowEnsureRafId = requestAnimationFrame(tick);
  };
  const showDownArrowForController = (target) => {
    hideAllDownArrows();
    target?.showDownArrow?.();
    ensureArrowVisibleForController(target, IS_IOS_WEBKIT ? 18 : 12);
  };
  let iosCenterCorrectionRafId = null;

  function isAnyControllerPlaybackActive() {
    return controllers.some(
      (controller) => controller?.isPlaying || controller?.isSnapping,
    );
  }

  function stopIosCenterCorrection() {
    if (!Number.isFinite(iosCenterCorrectionRafId)) return;
    try {
      cancelAnimationFrame(iosCenterCorrectionRafId);
    } catch {}
    iosCenterCorrectionRafId = null;
  }

  function requestIosCenterCorrection(options = {}) {
    const force = options?.force === true;
    if (!IS_IOS_WEBKIT) return;
    if (areAllControllersComplete()) return;
    if (!force && !isAnyControllerPlaybackActive()) return;
    if (Number.isFinite(iosCenterCorrectionRafId)) return;

    iosCenterCorrectionRafId = requestAnimationFrame(() => {
      iosCenterCorrectionRafId = null;
      if (areAllControllersComplete()) return;
      if (!force && !isAnyControllerPlaybackActive()) return;
      const controller = getGateController();
      if (!controller?.stage) return;
      centerStage(controller.stage);
    });
  }

  let playbackFreezeRafId = null;
  let isPlaybackViewportFrozen = false;

  function clearPlaybackFreezeRaf() {
    if (!Number.isFinite(playbackFreezeRafId)) return;
    try {
      cancelAnimationFrame(playbackFreezeRafId);
    } catch {}
    playbackFreezeRafId = null;
  }

  function onPlaybackFreezeViewportShift() {
    if (!isPlaybackViewportFrozen) return;
    if (Number.isFinite(playbackFreezeRafId)) return;

    playbackFreezeRafId = requestAnimationFrame(() => {
      playbackFreezeRafId = null;
      if (!isPlaybackViewportFrozen) return;
      const controller = getGateController();
      if (!controller?.stage) return;
      centerStage(controller.stage);
    });
  }

  function preventPlaybackViewportShift(event) {
    if (!isPlaybackViewportFrozen) return;
    if (event.cancelable) event.preventDefault();
  }

  function setPlaybackViewportFreeze(enabled) {
    // Desktop keeps natural scroll behavior; mobile gets a playback lock.
    if (isDesktopViewport()) return;

    if (enabled) {
      if (isPlaybackViewportFrozen) {
        onPlaybackFreezeViewportShift();
        return;
      }

      isPlaybackViewportFrozen = true;
      page.style.overscrollBehaviorY = "none";
      document.body.style.overscrollBehaviorY = "none";
      document.documentElement.style.overscrollBehaviorY = "none";
      document.addEventListener("touchmove", preventPlaybackViewportShift, {
        passive: false,
        capture: true,
      });
      document.addEventListener("wheel", preventPlaybackViewportShift, {
        passive: false,
        capture: true,
      });
      window.addEventListener("scroll", onPlaybackFreezeViewportShift, {
        passive: true,
      });
      onPlaybackFreezeViewportShift();
      return;
    }

    if (!isPlaybackViewportFrozen) return;
    isPlaybackViewportFrozen = false;
    clearPlaybackFreezeRaf();
    document.removeEventListener(
      "touchmove",
      preventPlaybackViewportShift,
      true,
    );
    document.removeEventListener("wheel", preventPlaybackViewportShift, true);
    window.removeEventListener("scroll", onPlaybackFreezeViewportShift);

    if (IS_IOS_WEBKIT && !areAllControllersComplete()) {
      page.style.overscrollBehaviorY = "contain";
      document.body.style.overscrollBehaviorY = "contain";
      document.documentElement.style.overscrollBehaviorY = "contain";
      return;
    }

    if (IS_IOS_WEBKIT && areAllControllersComplete()) {
      page.style.overscrollBehaviorY = "contain";
      document.body.style.overscrollBehaviorY = "contain";
      document.documentElement.style.overscrollBehaviorY = "contain";
      return;
    }

    page.style.removeProperty("overscroll-behavior-y");
    document.body.style.removeProperty("overscroll-behavior-y");
    document.documentElement.style.removeProperty("overscroll-behavior-y");
  }

  function setMobileTouchLock(enabled) {
    if (!IS_IOS_WEBKIT) return;
    // Allow normal vertical paging between files; just suppress bounce chaining.
    page.style.touchAction = enabled ? "pan-y" : "";
    page.style.overscrollBehaviorY = enabled ? "contain" : "";
    document.body.style.overscrollBehaviorY = enabled ? "contain" : "";
    document.documentElement.style.overscrollBehaviorY = enabled
      ? "contain"
      : "";
  }

  function isControllerComplete(controller) {
    return (
      !!controller &&
      controller.ready &&
      controller.segments.length > 0 &&
      controller.segmentIndex >= controller.segments.length - 1
    );
  }

  function areAllControllersComplete() {
    if (!controllers.length) return false;
    return controllers.every((controller) => isControllerComplete(controller));
  }

  let finalPinRafId = null;
  let finalPinPassesRemaining = 0;
  let deferredFinalPinRafId = null;
  let iosFinalPinIntervalId = null;
  let iosFinalPinPassesRemaining = 0;
  const IOS_FINAL_PIN_INTERVAL_MS = 120;
  const IOS_FINAL_PIN_BURST_PASSES = 4;

  function stopIosFinalPinKeepAlive() {
    iosFinalPinPassesRemaining = 0;
    if (!Number.isFinite(iosFinalPinIntervalId)) return;
    try {
      clearInterval(iosFinalPinIntervalId);
    } catch {}
    iosFinalPinIntervalId = null;
  }

  function cancelIosPostSettleRefresh(controller) {
    if (!controller) return;
    controller.iosPostSettlePassesRemaining = 0;
    const timeoutId = Number(controller.iosPostSettleTimerId);
    if (!Number.isFinite(timeoutId)) {
      controller.iosPostSettleTimerId = null;
      return;
    }
    try {
      clearTimeout(timeoutId);
    } catch {}
    controller.iosPostSettleTimerId = null;
  }

  function scheduleIosPostSettleRefresh(controller, frame, options = {}) {
    if (!IS_IOS_WEBKIT) return;
    if (!controller?.ready || !controller.segments?.length) return;

    const holdFrame = clampFrameToAnimation(controller, frame);
    const expectedSegmentIndex = Number.isFinite(Number(options.segmentIndex))
      ? Math.floor(Number(options.segmentIndex))
      : Number.isFinite(Number(controller.segmentIndex))
        ? Math.floor(Number(controller.segmentIndex))
        : null;
    const passes = Math.max(
      1,
      Math.min(
        12,
        Number.isFinite(Number(options.passes))
          ? Math.floor(Number(options.passes))
          : 7,
      ),
    );
    const intervalMs = Math.max(
      24,
      Math.min(
        180,
        Number.isFinite(Number(options.intervalMs))
          ? Math.floor(Number(options.intervalMs))
          : 48,
      ),
    );
    const attemptsPerTick = Math.max(
      1,
      Math.min(
        4,
        Number.isFinite(Number(options.attemptsPerTick))
          ? Math.floor(Number(options.attemptsPerTick))
          : 3,
      ),
    );
    const minContentAreaRatio = Number.isFinite(
      Number(options.minContentAreaRatio),
    )
      ? Math.max(0.01, Number(options.minContentAreaRatio))
      : Number.isFinite(Number(controller.minContentAreaRatio))
        ? Math.max(0.01, Number(controller.minContentAreaRatio))
        : 0.16;

    cancelIosPostSettleRefresh(controller);
    controller.iosPostSettlePassesRemaining = passes;

    const tick = () => {
      if (!controller) return;
      if (controller.isPlaying || controller.isSnapping) {
        cancelIosPostSettleRefresh(controller);
        return;
      }
      if (
        Number.isFinite(expectedSegmentIndex) &&
        Number(controller.segmentIndex) !== expectedSegmentIndex
      ) {
        cancelIosPostSettleRefresh(controller);
        return;
      }

      forceSvgVisibleForController(controller);
      const pinned = pinExactFrameWithRecovery(controller, holdFrame, {
        attempts: attemptsPerTick,
        minContentAreaRatio,
        allowFrameShift: false,
      });
      const pinnedUnstable = isPinnedFrameUnstable(controller, {
        requireRichContent: controller.requireRichContent === true,
        minContentAreaRatio,
      });
      if (pinned.isBlank || pinnedUnstable) {
        showRecoveryOverlay(controller);
      } else {
        hideRecoveryOverlayWhenStable(controller, {
          checks: 6,
          requiredStablePasses: 2,
        });
      }
      syncPersistentSettleSnapshotOverlay(controller);
      requestIosStageRepaintNudge(controller?.stage);

      controller.iosPostSettlePassesRemaining -= 1;
      if (controller.iosPostSettlePassesRemaining <= 0) {
        controller.iosPostSettleTimerId = null;
        return;
      }

      controller.iosPostSettleTimerId = window.setTimeout(tick, intervalMs);
    };

    // Kick once immediately so white-frame exposure is minimized on iOS.
    controller.iosPostSettleTimerId = window.setTimeout(tick, 0);
  }

  function stopFinalPinLoop() {
    if (Number.isFinite(finalPinRafId)) {
      try {
        cancelAnimationFrame(finalPinRafId);
      } catch {}
      finalPinRafId = null;
    }
    if (Number.isFinite(deferredFinalPinRafId)) {
      try {
        cancelAnimationFrame(deferredFinalPinRafId);
      } catch {}
      deferredFinalPinRafId = null;
    }
    finalPinPassesRemaining = 0;
  }

  function pinControllerToSettledFrame(controller) {
    if (!controller?.ready || !controller.segments.length) return;

    const segIndex =
      controller.segmentIndex >= 0
        ? Math.min(controller.segmentIndex, controller.segments.length - 1)
        : controller.segments.length - 1;
    const seg = controller.segments[segIndex];
    if (!seg) return;
    const strictSegmentEndHold = shouldUseExactSegmentTerminalHold(cfg, seg);
    const minContentAreaRatio = resolveRichSettleMinArea(
      cfg,
      controller.fileIndex,
    );

    if (strictSegmentEndHold) {
      const exactFrame = resolveTerminalHoldFrameForSegment(seg);
      const useLockedExactFrame = shouldUseStrictFrameLockNoFallback(cfg);
      cancelStrictExactRecovery(controller, segIndex);
      controller.resolvedFrameBySegment?.set(segIndex, exactFrame);
      if (useLockedExactFrame) {
        const lockedFallbackFrame = Number(
          controller.strictFallbackFrameBySegment?.get?.(segIndex),
        );
        const hasLockedFallback = isFrameWithinSegment(
          lockedFallbackFrame,
          seg,
        );
        if (!hasLockedFallback) {
          controller.strictFallbackFrameBySegment?.delete?.(segIndex);
        }
        const prevPinned = Number(controller.lastPinnedFrame);
        if (
          IS_IOS_WEBKIT &&
          Number.isFinite(prevPinned) &&
          Math.floor(prevPinned) === exactFrame
        ) {
          forceSvgVisibleForController(controller);
          if (
            !isPinnedFrameUnstable(controller, {
              requireRichContent: controller.requireRichContent === true,
              minContentAreaRatio,
            })
          ) {
            syncPersistentSettleSnapshotOverlay(controller);
            return;
          }
        }
        const pinned = pinExactFrameWithRecovery(controller, exactFrame, {
          attempts: IS_IOS_WEBKIT ? 8 : 4,
          minContentAreaRatio,
          allowFrameShift: false,
        });
        if (
          !pinned.isBlank &&
          !isPinnedFrameUnstable(controller, {
            requireRichContent: controller.requireRichContent === true,
            minContentAreaRatio,
          })
        ) {
          controller.strictFallbackFrameBySegment?.delete?.(segIndex);
          hideRecoveryOverlayWhenStable(controller);
          requestExactHoldStabilization(controller, exactFrame, {
            passes: IS_IOS_WEBKIT ? 4 : 2,
            attemptsPerPass: IS_IOS_WEBKIT ? 2 : 1,
            minContentAreaRatio,
            allowFrameShift: false,
          });
          controller.resolvedFrameBySegment?.set(segIndex, exactFrame);
          syncPersistentSettleSnapshotOverlay(controller);
          return;
        }

        if (IS_IOS_WEBKIT) {
          controller.strictFallbackFrameBySegment?.delete?.(segIndex);
          showRecoveryOverlay(controller);
          requestLockedExactFrameRecovery(controller, cfg, exactFrame, {
            minContentAreaRatio,
          });
          return;
        }

        if (
          cfg?.strictFrameRemountOnBlank !== false &&
          typeof controller.remountAtFrame === "function" &&
          !controller.isRemounting
        ) {
          controller
            .remountAtFrame(exactFrame, {
              timeoutMs: IS_IOS_WEBKIT ? 1200 : 900,
            })
            .then((remounted) => {
              if (!remounted) return;
              const repinned = pinExactFrameWithRecovery(
                controller,
                exactFrame,
                {
                  attempts: IS_IOS_WEBKIT ? 5 : 3,
                  minContentAreaRatio,
                  allowFrameShift: false,
                },
              );
              if (
                !repinned.isBlank &&
                !isPinnedFrameUnstable(controller, {
                  requireRichContent: controller.requireRichContent === true,
                  minContentAreaRatio,
                })
              ) {
                hideRecoveryOverlayWhenStable(controller);
              }
              requestExactHoldStabilization(controller, exactFrame, {
                passes: IS_IOS_WEBKIT ? 4 : 2,
                attemptsPerPass: IS_IOS_WEBKIT ? 2 : 1,
                minContentAreaRatio,
                allowFrameShift: false,
              });
              syncPersistentSettleSnapshotOverlay(controller);
            });
        }
        return;
      }

      const requireRichContent = shouldRequireRichSettleContent(
        cfg,
        controller.fileIndex,
      );
      const pinned = pinExactFrameWithRecovery(controller, exactFrame, {
        attempts: IS_IOS_WEBKIT ? 8 : 5,
        minContentAreaRatio,
      });
      if (
        !pinned.isBlank &&
        !isPinnedFrameUnstable(controller, {
          requireRichContent,
          minContentAreaRatio,
        })
      ) {
        controller.strictFallbackFrameBySegment?.delete?.(segIndex);
        controller.resolvedFrameBySegment?.set(segIndex, exactFrame);
        syncPersistentSettleSnapshotOverlay(controller);
        return;
      }

      const cachedFallback = Number(
        controller.strictFallbackFrameBySegment?.get?.(segIndex),
      );
      const fallbackFrame = isFrameWithinSegment(cachedFallback, seg)
        ? clampFrameToAnimation(controller, cachedFallback)
        : resolveStrictFallbackFrame(controller, seg, exactFrame, {
            requireRichContent,
            minContentAreaRatio,
          });
      controller.strictFallbackFrameBySegment?.set(segIndex, fallbackFrame);
      const fallbackPinned = pinExactFrameWithRecovery(
        controller,
        fallbackFrame,
        {
          attempts: IS_IOS_WEBKIT ? 8 : 5,
          minContentAreaRatio,
        },
      );
      if (
        fallbackPinned.isBlank ||
        isPinnedFrameUnstable(controller, {
          requireRichContent,
          minContentAreaRatio,
        })
      ) {
        let rescueFrame = resolveVisibleFrameInsideSegment(
          controller,
          seg,
          exactFrame,
          {
            requireRichContent,
            minContentAreaRatio,
          },
        );
        if (!isFrameWithinSegment(rescueFrame, seg)) {
          rescueFrame = fallbackFrame;
        }
        controller.strictFallbackFrameBySegment?.set(segIndex, rescueFrame);
        pinExactFrameWithRecovery(controller, rescueFrame, {
          attempts: IS_IOS_WEBKIT ? 10 : 6,
          minContentAreaRatio,
        });
      }
      requestStrictExactRecovery(
        controller,
        segIndex,
        seg,
        exactFrame,
        controller.strictFallbackFrameBySegment?.get?.(segIndex),
        {
          passes: IS_IOS_WEBKIT ? 18 : 10,
          attemptsPerPass: IS_IOS_WEBKIT ? 3 : 2,
          minContentAreaRatio,
        },
      );
      controller.resolvedFrameBySegment?.set(segIndex, exactFrame);
      syncPersistentSettleSnapshotOverlay(controller);
      return;
    }

    cancelStrictExactRecovery(controller, segIndex);
    controller.strictFallbackFrameBySegment?.delete?.(segIndex);
    const preferredFrame = resolvePreferredSettleFrame(
      cfg,
      controller.fileIndex,
      segIndex,
      seg,
    );
    const allowOutsideSegment = Number.isFinite(Number(preferredFrame))
      ? Number(preferredFrame) < seg.from || Number(preferredFrame) > seg.to
      : false;
    const requireRichContent = shouldRequireRichSettleContent(
      cfg,
      controller.fileIndex,
    );

    const cached = controller.resolvedFrameBySegment?.get(segIndex);
    const holdFrame = Number.isFinite(cached)
      ? cached
      : resolveSettledFrame(controller, seg, preferredFrame, {
          allowOutsideSegment,
          requireRichContent,
          minContentAreaRatio,
        });
    let safeHoldFrame = holdFrame;
    controller.resolvedFrameBySegment?.set(segIndex, safeHoldFrame);

    const prevPinned = Number(controller.lastPinnedFrame);
    if (
      IS_IOS_WEBKIT &&
      Number.isFinite(prevPinned) &&
      Math.floor(prevPinned) === safeHoldFrame
    ) {
      forceSvgVisibleForController(controller);
      if (!isStageFrameBlank(controller)) return;
    }

    try {
      controller.anim.pause();
      controller.anim.goToAndStop(safeHoldFrame, true);
    } catch {}
    forceSvgVisibleForController(controller);
    const isSparsePinned =
      requireRichContent &&
      !isStageFrameBlank(controller) &&
      !hasRichVisibleContent(controller, minContentAreaRatio);
    if (isStageFrameBlank(controller) || isSparsePinned) {
      safeHoldFrame = resolveSettledFrame(controller, seg, preferredFrame, {
        allowOutsideSegment,
        requireRichContent,
        minContentAreaRatio,
      });
      safeHoldFrame = resolveAnyVisibleFrame(controller, safeHoldFrame, {
        requireRichContent,
        minContentAreaRatio,
      });
      controller.resolvedFrameBySegment?.set(segIndex, safeHoldFrame);
      try {
        controller.anim.goToAndStop(safeHoldFrame, true);
      } catch {}
      forceSvgVisibleForController(controller);
    }
    if (!isStageFrameBlank(controller)) {
      controller.lastVisibleFrame = safeHoldFrame;
      controller.lastVisibleFrameEver = safeHoldFrame;
      controller.lastPinnedFrame = safeHoldFrame;
    } else if (IS_IOS_WEBKIT) {
      controller.lastPinnedFrame = null;
    }
    syncPersistentSettleSnapshotOverlay(controller);
  }

  function getControllersNearViewport(margin = 96) {
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    if (!Number.isFinite(vh) || vh <= 0) return [];

    return controllers.filter((controller) => {
      if (!controller?.stage) return false;
      const rect = controller.stage.getBoundingClientRect?.();
      if (!rect) return false;
      return rect.bottom >= -margin && rect.top <= vh + margin;
    });
  }

  function pinAllAnimationsToSettledFrames(options = {}) {
    const pinAndNudgeController = (controller) => {
      if (!controller) return;
      pinControllerToSettledFrame(controller);
      requestIosStageRepaintNudge(controller.stage);
    };

    const visibleOnly = options?.visibleOnly === true;
    if (!visibleOnly) {
      controllers.forEach((controller) => {
        pinAndNudgeController(controller);
      });
      return;
    }

    const visibleControllers = getControllersNearViewport();
    if (visibleControllers.length) {
      visibleControllers.forEach((controller) => {
        pinAndNudgeController(controller);
      });
      return;
    }

    const fallback =
      controllers[activeFileIndex] || controllers[controllers.length - 1];
    if (fallback) {
      pinAndNudgeController(fallback);
    }
  }

  function startFinalPinLoop(passCount = 4) {
    if (!areAllControllersComplete()) return;

    // Bounded pin passes prevent long-running frame pin loops from destabilizing SVG layers.
    finalPinPassesRemaining = Math.max(
      finalPinPassesRemaining,
      Math.max(1, Math.floor(Number(passCount) || 0)),
    );

    if (Number.isFinite(deferredFinalPinRafId)) return;
    deferredFinalPinRafId = requestAnimationFrame(() => {
      deferredFinalPinRafId = null;
      if (!areAllControllersComplete()) return;
      if (Number.isFinite(finalPinRafId)) return;

      const tick = () => {
        if (!areAllControllersComplete()) {
          finalPinRafId = null;
          finalPinPassesRemaining = 0;
          return;
        }

        pinAllAnimationsToSettledFrames({ visibleOnly: true });
        finalPinPassesRemaining -= 1;
        if (finalPinPassesRemaining > 0) {
          finalPinRafId = requestAnimationFrame(tick);
          return;
        }
        finalPinRafId = null;
      };

      finalPinRafId = requestAnimationFrame(tick);
    });
  }

  function startIosFinalPinKeepAlive(passCount = IOS_FINAL_PIN_BURST_PASSES) {
    if (!IS_IOS_WEBKIT) return;
    iosFinalPinPassesRemaining = Math.max(
      iosFinalPinPassesRemaining,
      Math.max(1, Math.floor(Number(passCount) || 0)),
    );

    if (areAllControllersComplete() && document.visibilityState !== "hidden") {
      pinAllAnimationsToSettledFrames({ visibleOnly: true });
    }

    if (Number.isFinite(iosFinalPinIntervalId)) return;

    iosFinalPinIntervalId = window.setInterval(() => {
      if (!areAllControllersComplete()) {
        stopIosFinalPinKeepAlive();
        return;
      }
      if (document.visibilityState === "hidden") return;

      pinAllAnimationsToSettledFrames({ visibleOnly: true });
      iosFinalPinPassesRemaining -= 1;
      if (iosFinalPinPassesRemaining <= 0) {
        stopIosFinalPinKeepAlive();
      }
    }, IOS_FINAL_PIN_INTERVAL_MS);
  }

  function applyReplayButtonTitleOffset(buttonEl, titleEl) {
    if (!buttonEl) return;
    const normalizedTitle = String(titleEl?.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
    const isLongTitle = normalizedTitle.length >= 18;
    buttonEl.classList.toggle(
      "childhood-fundal-replay-btn--compact-offset",
      isLongTitle,
    );
  }

  function ensureReplayButton() {
    if (!shouldSupportReplay) return null;
    if (replayBtn) {
      const topbar = page.querySelector(".eyes-topbar");
      const titleEl = topbar?.querySelector(".eyes-topbar__title");
      applyReplayButtonTitleOffset(replayBtn, titleEl);
      return replayBtn;
    }

    const topbar = page.querySelector(".eyes-topbar");
    if (!topbar) return null;

    let titleGroup = topbar.querySelector("[data-fundal-title-group]");
    if (!titleGroup) {
      titleGroup = document.createElement("div");
      titleGroup.dataset.fundalTitleGroup = "1";
      titleGroup.className = "childhood-fundal-title-group";

      const titleEl = topbar.querySelector(".eyes-topbar__title");
      const topbarIcons = topbar.querySelector(".eyes-topbar__icons");
      if (topbarIcons) {
        topbar.insertBefore(titleGroup, topbarIcons);
      } else {
        topbar.prepend(titleGroup);
      }
      if (titleEl && titleEl.parentElement !== titleGroup) {
        titleGroup.appendChild(titleEl);
      }
    }

    const titleEl = topbar.querySelector(".eyes-topbar__title");
    if (titleEl && titleEl.parentElement !== titleGroup) {
      titleGroup.appendChild(titleEl);
    }

    const existing = titleGroup.querySelector("[data-fundal-replay-btn]");
    if (existing) {
      replayBtn = existing;
      applyReplayButtonTitleOffset(replayBtn, titleEl);
      return replayBtn;
    }

    const topbarIcons = page.querySelector(".eyes-topbar__icons");
    if (!topbarIcons && !titleGroup) return null;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.fundalReplayBtn = "1";
    btn.className = "childhood-fundal-replay-btn";
    btn.textContent = translateFundalText("Replay");
    btn.style.display = "none";

    if (titleGroup) {
      titleGroup.appendChild(btn);
    } else {
      topbarIcons.prepend(btn);
    }
    applyReplayButtonTitleOffset(btn, titleEl);
    replayBtn = btn;
    return replayBtn;
  }

  function showReplayButton() {
    const btn = ensureReplayButton();
    if (!btn) return;
    btn.style.display = "inline-flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
  }

  function hideReplayButton() {
    if (!replayBtn) return;
    replayBtn.style.display = "none";
  }

  function resetAllAnimationsToStart() {
    setPlaybackViewportFreeze(false);
    hasDispatchedRouteComplete = false;
    stopFinalPinLoop();
    stopIosFinalPinKeepAlive();
    stopIosCenterCorrection();
    setMobileTouchLock(true);
    hideAllDownArrows();
    controllers.forEach((controller) => {
      try {
        controller.stopCenterLock?.();
      } catch {}
      controller.clearSegmentText?.();
      controller.isPlaying = false;
      controller.isSnapping = false;
      controller.isLockedExactRecovering = false;
      controller.cancelIosPostSettleRefresh?.();
      controller.segmentIndex = -1;
      controller.playingSegmentIndex = -1;
      controller.targetEndFrame = null;
      controller.pendingDir = 0;
      controller.inputLockUntil = 0;
      controller.lastRenderedFrame = null;
      controller.lastVisibleFrame = null;
      controller.lastVisibleFrameEver = null;
      controller.lastRichVisibleFrame = null;
      controller.lastRichVisibleFrameEver = null;
      controller.lastPinnedFrame = null;
      controller.recoverySnapshotMarkup = "";
      controller.recoverySnapshotCanvasDataUrl = "";
      controller.recoverySnapshotFrame = null;
      controller.recoverySnapshotSegmentIndex = -1;
      hideRecoveryOverlay(controller, { immediate: true });
      controller.resolvedFrameBySegment?.clear?.();
      controller.strictFallbackFrameBySegment?.clear?.();
      cancelAllStrictExactRecovery(controller);

      const firstSeg = controller.segments[0];
      if (controller.ready && firstSeg) {
        try {
          controller.anim.pause();
        } catch {}
        controller.anim.goToAndStop(firstSeg.from, true);
        forceSvgVisibleForController(controller);
        if (isStageFrameBlank(controller)) {
          const recovered = resolveAnyVisibleFrame(controller, firstSeg.from);
          controller.anim.goToAndStop(recovered, true);
          forceSvgVisibleForController(controller);
        }
        if (!isStageFrameBlank(controller)) {
          const currentFrame = clampFrameToAnimation(
            controller,
            Math.floor(Number(controller.anim.currentFrame)),
          );
          controller.lastVisibleFrame = currentFrame;
          controller.lastVisibleFrameEver = currentFrame;
          if (
            hasRichVisibleContent(controller, controller.minContentAreaRatio)
          ) {
            controller.lastRichVisibleFrame = currentFrame;
            controller.lastRichVisibleFrameEver = currentFrame;
          }
          controller.lastPinnedFrame = currentFrame;
        }
      }
    });

    hideReplayButton();
    if (controllers[0]) {
      activeFileIndex = 0;
      showDownArrowForController(controllers[0]);
    }
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        scrollToFirstFileStart();
        requestIosCenterCorrection({ force: true });
      }),
    );
  }

  if (shouldSupportReplay) {
    const btn = ensureReplayButton();
    if (btn && btn.dataset.wiredReplay !== "1") {
      btn.dataset.wiredReplay = "1";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        resetAllAnimationsToStart();
      });
    }
  }
  setSegmentTextsVisibility(true);
  wireTitleSegmentTextToggle();

  function showFinalSummaryBulletsForCompletedControllers() {
    controllers.forEach((controller) => {
      if (!isControllerComplete(controller)) return;
      controller.showFinalSummaryBullets?.();
    });
  }

  controllers.forEach((controller) => {
    controller.onSegmentSettled = () => {
      pinControllerToSettledFrame(controller);
      wheelAccum = 0;
      touchStartY = null;
      lastTriggerAt = Date.now() + (IS_IOS_WEBKIT ? 320 : 220);
      if (!areAllControllersComplete()) {
        showDownArrowForController(controller);
        setMobileTouchLock(true);
        return;
      }
      showFinalSummaryBulletsForCompletedControllers();
      hideAllDownArrows();
      setMobileTouchLock(false);
      if (IS_IOS_WEBKIT) {
        // Keep iOS bounce chaining off after completion to avoid white blank flashes.
        page.style.overscrollBehaviorY = "contain";
        document.body.style.overscrollBehaviorY = "contain";
      }
      if (isStrictSegmentEndHold(cfg)) {
        stopFinalPinLoop();
        pinAllAnimationsToSettledFrames({ visibleOnly: true });
        if (IS_IOS_WEBKIT) {
          startIosFinalPinKeepAlive(IOS_FINAL_PIN_BURST_PASSES + 2);
        } else {
          stopIosFinalPinKeepAlive();
        }
      } else {
        startFinalPinLoop();
        startIosFinalPinKeepAlive();
      }
      dispatchRouteComplete();
    };
  });

  if (!areAllControllersComplete() && controllers[0]) {
    activeFileIndex = 0;
    showDownArrowForController(controllers[0]);
  }

  setMobileTouchLock(!areAllControllersComplete());

  let wheelAccum = 0;
  let touchStartY = null;
  let lastTriggerAt = 0;
  const WHEEL_THRESHOLD = 30;
  const TOUCH_THRESHOLD = 24;
  const TOUCH_MOVE_LOCK_THRESHOLD = 8;
  const TRIGGER_COOLDOWN_MS = 120;

  function getGateController() {
    const playingIndex = controllers.findIndex((c) => c.isPlaying);
    if (playingIndex >= 0) {
      activeFileIndex = playingIndex;
      return controllers[playingIndex];
    }

    const nearestIndex = getNearestVisibleControllerIndex(controllers);
    if (nearestIndex >= 0) {
      activeFileIndex = nearestIndex;
    }

    return controllers[activeFileIndex] || null;
  }

  function canConsumeDirection(dir) {
    if (areAllControllersComplete()) return false;

    const controller = getGateController();
    if (!controller) return false;
    if (controller.failed) return false;
    if (controller.isSnapping) return true;
    if (controller.isPlaying) return true;
    if (dir > 0 && Date.now() < Number(controller.inputLockUntil || 0)) {
      return true;
    }

    // Never consume upward input when not actively playing.
    if (dir < 0) return false;

    if (!controller.ready) return true;
    if (!controller.segments.length) return false;
    return controller.segmentIndex < controller.segments.length - 1;
  }

  function handleDirection(dir) {
    if (areAllControllersComplete()) {
      if (dir < 0) {
        showReplayButton();
      }
      if (isStrictSegmentEndHold(cfg)) {
        pinAllAnimationsToSettledFrames({ visibleOnly: true });
        if (IS_IOS_WEBKIT) startIosFinalPinKeepAlive(4);
      } else {
        startFinalPinLoop();
      }
      return false;
    }

    const controller = getGateController();
    if (!controller) return false;
    if (controller.failed) return false;
    if (controller.isSnapping) return true;
    if (!controller.ready) return dir > 0;
    if (dir > 0 && Date.now() < Number(controller.inputLockUntil || 0)) {
      return true;
    }

    if (controller.isPlaying) {
      // Block direction input while a segment is running to avoid inertial auto-advance.
      controller.pendingDir = 0;
      return true;
    }

    // Upward input should not trigger reverse segment playback.
    if (dir < 0) {
      if (areAllControllersComplete()) {
        showReplayButton();
      }
      return false;
    }

    if (playPreviousOrNextSegment(controller, dir)) return true;
    return false;
  }

  function onWheel(e) {
    if (!Number.isFinite(e.deltaY) || e.deltaY === 0) return;

    const instantaneousDir = e.deltaY > 0 ? 1 : -1;
    if (canConsumeDirection(instantaneousDir)) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (wheelAccum !== 0 && Math.sign(wheelAccum) !== Math.sign(e.deltaY)) {
      wheelAccum = 0;
    }
    wheelAccum += e.deltaY;
    if (Math.abs(wheelAccum) < WHEEL_THRESHOLD) return;

    const now = Date.now();
    if (now - lastTriggerAt < TRIGGER_COOLDOWN_MS) return;
    lastTriggerAt = now;

    const dir = wheelAccum > 0 ? 1 : -1;
    wheelAccum = 0;

    const consumed = handleDirection(dir);
    if (!consumed && dir < 0 && areAllControllersComplete()) {
      showReplayButton();
    }
    if (consumed) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function onTouchStart(e) {
    if (!e.touches || e.touches.length !== 1) return;
    touchStartY = e.touches[0].clientY;
  }

  function onTouchMove(e) {
    if (touchStartY == null) return;
    const currentY = e.touches?.[0]?.clientY;
    if (!Number.isFinite(currentY)) return;

    const dy = touchStartY - currentY;
    if (Math.abs(dy) < TOUCH_MOVE_LOCK_THRESHOLD) return;

    const dir = dy > 0 ? 1 : -1;
    if (canConsumeDirection(dir)) {
      e.preventDefault();
      e.stopPropagation();
      requestIosCenterCorrection();
    }
  }

  function onTouchEnd(e) {
    if (touchStartY == null) return;
    const endY = e.changedTouches?.[0]?.clientY ?? touchStartY;
    const dy = touchStartY - endY;
    touchStartY = null;

    if (Math.abs(dy) < TOUCH_THRESHOLD) return;

    const now = Date.now();
    if (now - lastTriggerAt < TRIGGER_COOLDOWN_MS) return;
    lastTriggerAt = now;

    const dir = dy > 0 ? 1 : -1;
    let consumed = handleDirection(dir);
    if (!consumed && dir < 0 && areAllControllersComplete()) {
      showReplayButton();
    }
    if (consumed) {
      e.preventDefault();
      e.stopPropagation();
      requestIosCenterCorrection();
    }
  }

  function onViewportChangeDuringProgress() {
    if (!IS_IOS_WEBKIT) return;
    if (areAllControllersComplete()) return;
    if (!isAnyControllerPlaybackActive()) return;
    requestIosCenterCorrection();
  }

  function onViewportChangeAfterCompletion() {
    if (!areAllControllersComplete()) return;
    if (isStrictSegmentEndHold(cfg)) {
      stopFinalPinLoop();
      pinAllAnimationsToSettledFrames({ visibleOnly: true });
      if (IS_IOS_WEBKIT) {
        startIosFinalPinKeepAlive(4);
      } else {
        stopIosFinalPinKeepAlive();
      }
      return;
    }
    startFinalPinLoop(2);
    startIosFinalPinKeepAlive();
  }

  function onVisibilityChangeAfterCompletion() {
    if (!areAllControllersComplete()) return;
    if (document.visibilityState !== "visible") return;
    if (isStrictSegmentEndHold(cfg)) {
      stopFinalPinLoop();
      pinAllAnimationsToSettledFrames({ visibleOnly: true });
      if (IS_IOS_WEBKIT) {
        startIosFinalPinKeepAlive(6);
      } else {
        stopIosFinalPinKeepAlive();
      }
      return;
    }
    startFinalPinLoop(IS_IOS_WEBKIT ? 3 : 1);
    startIosFinalPinKeepAlive();
  }

  page.addEventListener("wheel", onWheel, { passive: false });
  page.addEventListener("touchstart", onTouchStart, { passive: true });
  page.addEventListener("touchmove", onTouchMove, { passive: false });
  page.addEventListener("touchend", onTouchEnd, { passive: false });
  window.addEventListener("scroll", onViewportChangeDuringProgress, {
    passive: true,
  });
  window.addEventListener("resize", onViewportChangeDuringProgress, {
    passive: true,
  });
  window.addEventListener("resize", updateAllArrowAnchors, {
    passive: true,
  });
  window.addEventListener("pageshow", onViewportChangeDuringProgress);
  window.addEventListener("pageshow", updateAllArrowAnchors);
  window.addEventListener("orientationchange", onViewportChangeDuringProgress);
  window.addEventListener("orientationchange", updateAllArrowAnchors);
  window.addEventListener("scroll", onViewportChangeAfterCompletion, {
    passive: true,
  });
  window.addEventListener("resize", onViewportChangeAfterCompletion, {
    passive: true,
  });
  window.addEventListener("pageshow", onViewportChangeAfterCompletion);
  window.addEventListener("orientationchange", onViewportChangeAfterCompletion);
  document.addEventListener(
    "visibilitychange",
    onVisibilityChangeAfterCompletion,
  );

  return {
    controllers,
    animations: controllers.map((c) => c.anim),
    observer: null,
    removeInputListeners: () => {
      stopFinalPinLoop();
      stopIosFinalPinKeepAlive();
      stopIosCenterCorrection();
      setPlaybackViewportFreeze(false);
      setMobileTouchLock(false);
      removeTitleSegmentTextToggleListeners?.();
      removeTitleSegmentTextToggleListeners = null;
      setSegmentTextsVisibility(true);
      controllers.forEach((c) => {
        try {
          c.stopCenterLock?.();
        } catch {}
        cancelArrowEnsure(c);
        c.cancelIosPostSettleRefresh?.();
        hideRecoveryOverlay(c, { immediate: true });
        c.recoverySnapshotMarkup = "";
        c.recoverySnapshotCanvasDataUrl = "";
        c.recoverySnapshotFrame = null;
        c.recoverySnapshotSegmentIndex = -1;
        try {
          c.detachAnimationListeners?.();
        } catch {}
        cancelAllStrictExactRecovery(c);
      });
      page.removeEventListener("wheel", onWheel);
      page.removeEventListener("touchstart", onTouchStart);
      page.removeEventListener("touchmove", onTouchMove);
      page.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("scroll", onViewportChangeDuringProgress);
      window.removeEventListener("resize", onViewportChangeDuringProgress);
      window.removeEventListener("resize", updateAllArrowAnchors);
      window.removeEventListener("pageshow", onViewportChangeDuringProgress);
      window.removeEventListener("pageshow", updateAllArrowAnchors);
      window.removeEventListener(
        "orientationchange",
        onViewportChangeDuringProgress,
      );
      window.removeEventListener("orientationchange", updateAllArrowAnchors);
      window.removeEventListener("scroll", onViewportChangeAfterCompletion);
      window.removeEventListener("resize", onViewportChangeAfterCompletion);
      window.removeEventListener("pageshow", onViewportChangeAfterCompletion);
      window.removeEventListener(
        "orientationchange",
        onViewportChangeAfterCompletion,
      );
      document.removeEventListener(
        "visibilitychange",
        onVisibilityChangeAfterCompletion,
      );
    },
  };
}

export async function initializeChildhoodFundalReflexScrollPage(routeName) {
  const baseCfg = ROUTE_CONFIG[routeName];
  if (!baseCfg) return;
  const cfg = resolveRuntimeRouteConfig(routeName, baseCfg);
  if (!cfg) return;

  const page = document.getElementById(cfg.pageId);
  if (!page) return;

  cleanupActiveSession();

  const listEl = page.querySelector(".childhood-fundal-prep-list");
  const stages = buildAnimationSlots(listEl, cfg.label, cfg.paths.length, cfg);
  if (!stages.length) return;
  warmupFundalRouteAssets(cfg);

  const i18nReadyPromise = ensureFundalI18nDictionary();
  const lottieReadyPromise = ensureLottie();

  await i18nReadyPromise;
  const isLottieReady = await lottieReadyPromise;
  if (!isLottieReady) {
    console.error("[fundalScroll] lottie is not available");
    return;
  }

  if (cfg.playMode === "segmentScroll") {
    activeSession = initializeSegmentScrollMode(cfg, page, stages);
    return;
  }

  const animations = stages.map((stage, idx) =>
    window.lottie.loadAnimation({
      container: stage,
      renderer: FUNDAL_LOTTIE_RENDERER,
      loop: true,
      autoplay: false,
      path: cfg.paths[idx],
      rendererSettings: {
        preserveAspectRatio: resolvePreserveAspectRatio(cfg, idx),
        hideOnTransparent: false,
      },
    }),
  );

  const observer = createViewportController(stages, animations);
  activeSession = { observer, animations };
}

if (!window.__fundalScrollCleanupWired) {
  window.__fundalScrollCleanupWired = true;
  window.addEventListener("page:loaded", (e) => {
    const routeName = e?.detail?.routeName || "";
    if (!ROUTE_CONFIG[routeName]) cleanupActiveSession();
  });
}
