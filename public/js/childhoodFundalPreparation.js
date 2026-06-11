import { loadPage } from "./navigation.js";
import { fetchDictionary, get, getLanguage } from "./i18n.js";

const LOTTIE_SRC = "/vendor/lottie.min.js";
const FUNDAL_STAGE_POSTER_FILENAME = "img_0.png";
const FUNDAL_STAGE_POSTER_ENABLED = false;
const FUNDAL_ASSET_PRIME_CACHE = new Set();
const FUNDAL_LOTTIE_IMAGE_ASSET_URLS_CACHE = new Map();
const FUNDAL_IMAGE_WARMUP_PROMISE_CACHE = new Map();

function detectFundalWebKitEnvironment() {
  if (typeof navigator === "undefined") {
    return {
      iosLikeWebKit: false,
      desktopSafariWebKit: false,
      safariWebKit: false,
    };
  }

  const ua = navigator.userAgent || "";
  const iOSDevice = /iPad|iPhone|iPod/i.test(ua);
  const iPadOSDesktopUA =
    navigator.platform === "MacIntel" &&
    Number(navigator.maxTouchPoints || 0) > 1;
  const iosLikeWebKit = iOSDevice || iPadOSDesktopUA;
  const hasAppleWebKit = /AppleWebKit/i.test(ua);
  const hasSafari = /Safari/i.test(ua);
  const hasSafariVersion = /Version\//i.test(ua);
  const hasNonSafariShell =
    /(?:Chrome|Chromium|CriOS|FxiOS|Edg|EdgiOS|OPR|OPiOS|SamsungBrowser|DuckDuckGo)\//i.test(
      ua,
    );
  const desktopSafariWebKit =
    !iosLikeWebKit &&
    hasAppleWebKit &&
    hasSafari &&
    hasSafariVersion &&
    !hasNonSafariShell;

  return {
    iosLikeWebKit,
    desktopSafariWebKit,
    safariWebKit: iosLikeWebKit || desktopSafariWebKit,
  };
}

const FUNDAL_WEBKIT_ENVIRONMENT = detectFundalWebKitEnvironment();
const FUNDAL_LOTTIE_RENDERER = FUNDAL_WEBKIT_ENVIRONMENT.safariWebKit
  ? "canvas"
  : "svg";
const FUNDAL_IOS_DEFAULT_RENDERER = "canvas";

function getFundalE2ERuntime() {
  if (typeof window === "undefined") return null;
  const runtime = window.__ARCLIGHT_E2E__;
  return runtime && typeof runtime === "object" ? runtime : null;
}

function resolveFundalE2EPlaybackRate() {
  const raw = Number(getFundalE2ERuntime()?.fundalPlaybackRate);
  if (!Number.isFinite(raw) || raw <= 0) return null;
  return Math.min(20, raw);
}

function shouldDisableFundalE2EAutoplay() {
  return getFundalE2ERuntime()?.disableFundalAutoplay === true;
}

function ensureFundalE2ERegistry() {
  const runtime = getFundalE2ERuntime();
  if (!runtime) return null;

  if (!runtime.fundal || typeof runtime.fundal !== "object") {
    runtime.fundal = {};
  }
  const fundal = runtime.fundal;

  if (!fundal.sessions || typeof fundal.sessions !== "object") {
    fundal.sessions = {};
  }

  if (typeof fundal.hasRoute !== "function") {
    fundal.hasRoute = (routeName) => !!fundal.sessions?.[routeName];
  }

  if (typeof fundal.getStageState !== "function") {
    fundal.getStageState = (routeName, stageIndex) =>
      fundal.sessions?.[routeName]?.getStageState?.(stageIndex) || null;
  }

  if (typeof fundal.seekStage !== "function") {
    fundal.seekStage = (routeName, stageIndex, frame, options) =>
      fundal.sessions?.[routeName]?.seekStage?.(stageIndex, frame, options) ||
      null;
  }

  return fundal;
}

function registerFundalE2ESession(routeName, sessionApi) {
  const fundal = ensureFundalE2ERegistry();
  if (!fundal || !routeName || !sessionApi) return;
  fundal.sessions[routeName] = sessionApi;
}

function unregisterFundalE2ESession(routeName) {
  const fundal = ensureFundalE2ERegistry();
  if (!fundal || !routeName) return;
  delete fundal.sessions[routeName];
}

function waitForFundalE2ERenderFrame() {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => resolve());
      return;
    }
    setTimeout(resolve, 16);
  });
}

async function waitForFundalE2ERenderStability(frameCount = 2) {
  const totalFrames = Math.max(1, Math.floor(Number(frameCount) || 0));
  for (let i = 0; i < totalFrames; i += 1) {
    await waitForFundalE2ERenderFrame();
  }
}

function resolveConfiguredFundalPlaybackRate(cfg, fileIndex) {
  const raw = Array.isArray(cfg?.playbackRateByFile)
    ? cfg.playbackRateByFile[fileIndex]
    : cfg?.playbackRate;
  const playbackRate = Number(raw);
  if (!Number.isFinite(playbackRate) || playbackRate <= 0) return 1;
  return playbackRate;
}

function resolveConfiguredSegmentPlaybackRate(cfg, fileIndex, segmentIndex) {
  const rawFileRules = Array.isArray(cfg?.segmentPlaybackRateByFile)
    ? cfg.segmentPlaybackRateByFile[fileIndex]
    : null;
  if (!Array.isArray(rawFileRules)) return null;

  const playbackRate = Number(rawFileRules[segmentIndex]);
  if (!Number.isFinite(playbackRate) || playbackRate <= 0) return null;
  return playbackRate;
}

function hasConfiguredSegmentPlaybackRate(cfg, fileIndex, segmentCount) {
  for (let i = 0; i < Math.max(0, Number(segmentCount) || 0); i += 1) {
    if (resolveConfiguredSegmentPlaybackRate(cfg, fileIndex, i) !== null) {
      return true;
    }
  }
  return false;
}

function resolveConfiguredAutoplayStartFrame(cfg, fileIndex) {
  const raw = Array.isArray(cfg?.autoplayStartFrameByFile)
    ? cfg.autoplayStartFrameByFile[fileIndex]
    : cfg?.autoplayStartFrame;
  const startFrame = Number(raw);
  if (!Number.isFinite(startFrame) || startFrame < 0) return 0;
  return Math.floor(startFrame);
}

function resolveConfiguredAutoplayEndFrame(cfg, fileIndex) {
  const raw = Array.isArray(cfg?.autoplayEndFrameByFile)
    ? cfg.autoplayEndFrameByFile[fileIndex]
    : cfg?.autoplayEndFrame;
  if (raw == null || raw === "") return null;
  const endFrame = Number(raw);
  if (!Number.isFinite(endFrame) || endFrame < 0) return null;
  return Math.floor(endFrame);
}

function resolveConfiguredCompletionHoldFrame(cfg, fileIndex) {
  const raw = Array.isArray(cfg?.completionHoldFrameByFile)
    ? cfg.completionHoldFrameByFile[fileIndex]
    : cfg?.completionHoldFrame;
  if (raw == null || raw === "") return null;
  const holdFrame = Number(raw);
  if (!Number.isFinite(holdFrame) || holdFrame < 0) return null;
  return Math.floor(holdFrame);
}

function resolveAdvanceArrowAnchorParagraph(cfg, fileIndex) {
  const raw = Array.isArray(cfg?.advanceArrowAnchorParagraphByFile)
    ? cfg.advanceArrowAnchorParagraphByFile[fileIndex]
    : cfg?.advanceArrowAnchorParagraph;
  if (raw == null || raw === "") return null;
  const paragraphIndex = Number(raw);
  if (!Number.isFinite(paragraphIndex) || paragraphIndex < 1) return null;
  return Math.floor(paragraphIndex);
}

function applyFundalPlaybackRate(anim, cfg, fileIndex) {
  const playbackRate =
    resolveFundalE2EPlaybackRate() ??
    resolveConfiguredFundalPlaybackRate(cfg, fileIndex);
  if (playbackRate === 1 || typeof anim?.setSpeed !== "function") return;
  try {
    anim.setSpeed(playbackRate);
  } catch {
    // Ignore test-only playback-rate overrides when the renderer rejects them.
  }
}

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
    playMode: "stageAutoplay",
    playbackRateByFile: [1, 1, 1, 1.3],
    autoplayStartFrameByFile: [0, 0, 0, 90],
    autoplayEndFrameByFile: [null, null, 375, null],
    segmentTextTriggerFramesByFile: [null, null, null, [0, 196, 317, 384]],
    // User-provided segment plan (inclusive frame ranges).
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
        "Push lenses up",
        "Examine in quiet, dim room",
      ],
      ["Hold Arclight close to your eye"],
      [
        "Swaddle newborn",
        "Parents should hold older baby",
        "",
        "Older children can sit alone",
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
    playMode: "stageAutoplay",
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
        { from: 0, to: 133 },
        { from: 142, to: 253 },
        { from: 268, to: 449 },
      ],
    ],
    settleFrameOverrides: [
      [149],
      [186, 329],
      [78, 209, 351, 449],
      [114, 359],
      [133, 253, 449],
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
    iosRendererByFile: [null, null, null, null, "svg"],
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
    playMode: "stageAutoplay",
    playbackRateByFile: [1.5, 1, 1],
    autoplayLegacySegmentPlaybackByFile: [false, true, false],
    preferLastVisibleCompletionFrameByFile: [false, true, false],
    forceInitialFrameHoldByFile: [0],
    rendererByFile: [null, "canvas", null],
    preserveCompletionSnapshotOverlayByFile: [false, true, false],
    segmentRanges: [
      [{ from: 0, to: 329 }],
      [
        { from: 0, to: 147 },
        { from: 148, to: 205 },
        { from: 381, to: 659 },
      ],
      [
        { from: 0, to: 113 },
        { from: 119, to: 265 },
        { from: 266, to: 419 },
      ],
    ],
    settleFrameOverrides: [[329], [147, 205, 659], [113, 265, 419]],
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
    playMode: "stageAutoplay",
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
    iosRendererByFile: ["svg", "svg"],
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
    playMode: "stageAutoplay",
    autoplayLegacySegmentPlaybackByFile: [false, false, false, true],
    preferLastVisibleCompletionFrameByFile: [false, false, false, true],
    preserveCompletionSnapshotOverlayByFile: [false, false, false, true],
    segmentRanges: [
      [
        { from: 0, to: 204 },
        { from: 206, to: 269 },
      ],
      [
        { from: 0, to: 79 },
        { from: 80, to: 253 },
        { from: 254, to: 299 },
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
      [204, 269],
      [79, 253, 299],
      [82, 135, 209],
      [235, 475, 779],
    ],
    segmentStartTexts: [
      ["", "If unclear, follow next three steps"],
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
    centerTopBiasByFile: [0, -96],
    desktopTopGapByFile: [18, 0],
    playMode: "stageAutoplay",
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
    playMode: "stageAutoplay",
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
    iosRendererByFile: ["svg", null],
    iosAggressiveSettleSegments: [[1]],
    richSettleContentFiles: [0, 1],
    richSettleMinAreaByFile: [0.1, 0.12],
  },
  diabeticObservationFundalReflex: {
    pageId: "diabeticObservationFundalReflexPage",
    label: "Observation and Fundal Reflex",
    enableReplay: true,
    segmentTextToggleOnTitle: true,
    paths: [
      "/scrolly/coreexam/ophths/DO/01ObservationandFundalReflex/1/data.json",
      "/scrolly/coreexam/ophths/DO/01ObservationandFundalReflex/2/data.json",
      "/scrolly/coreexam/ophths/DO/01ObservationandFundalReflex/3/data.json",
      "/scrolly/coreexam/ophths/DO/01ObservationandFundalReflex/4/data.json",
      "/scrolly/coreexam/ophths/DO/01ObservationandFundalReflex/5/data.json",
    ],
    playMode: "stageAutoplay",
    segmentRanges: [
      [{ from: 0, to: 158 }],
      [{ from: 0, to: 196 }],
      [
        { from: 0, to: 120 },
        { from: 121, to: 205 },
        { from: 206, to: 299 },
      ],
      [{ from: 0, to: 509 }],
      [
        { from: 0, to: 77 },
        { from: 78, to: 329 },
      ],
    ],
    settleFrameOverrides: [[158], [196], [120, 205, 299], [509], [77, 329]],
    segmentTextTriggerFramesByFile: [null, null, null, null, [0, 77, 137]],
    segmentPauseAfterMsByFile: [null, null, null, null, [3000]],
    advanceArrowAnchorParagraphByFile: [null, 2],
    centerTopBiasByFile: [0, 0, 0, 0, -96],
    desktopTopGapByFile: [18, 18, 18, 18, -24],
    segmentStartTexts: [
      ["Start with hand hygiene"],
      [
        "Take a few seconds to look at the area around the periorbita, the eyelids and the eyes themselves\n\nMention any normal or abnormal findings\n\nFundal Reflex\n\nPerform the fundal reflex test\nto assess for media opacity",
      ],
      [
        "Use brightest light setting",
        "Push lens racks up",
        "Examine in quiet, dim room",
      ],
      ["Stand at arm's length\nand look through the sight hole"],
      [
        "Ask the patient to look at the light while you observe both eyes together",
        "The light should reflect from the fundus back through the pupils, looking symmetrically bright with similar colour",
        "Any asymmetry suggests an abnormality such as a corneal scar, cataract, blood in the vitreous or a retinal tumour",
      ],
    ],
    segmentTextModeByFile: ["append", "append", "append", "append", "append"],
    leftAlignedTextFiles: [4],
    bulletTextFiles: [4],
    strictFrameLockNoFallback: true,
    strictFrameRemountOnBlank: true,
    richSettleContentFiles: [0, 1, 2, 3, 4],
    richSettleMinAreaByFile: [0.08, 0.08, 0.08, 0.08, 0.08],
  },
  diabeticPositioningFlightPath: {
    pageId: "diabeticPositioningFlightPathPage",
    label: "Positioning and Flight Path",
    enableReplay: true,
    segmentTextToggleOnTitle: true,
    paths: [
      "/scrolly/coreexam/ophths/DO/02PositioningandFlightPath/1/data.json",
      "/scrolly/coreexam/ophths/DO/02PositioningandFlightPath/2/data.json",
      "/scrolly/coreexam/ophths/DO/02PositioningandFlightPath/3/data.json",
      "/scrolly/coreexam/ophths/DO/02PositioningandFlightPath/4/data.json",
      "/scrolly/coreexam/ophths/DO/02PositioningandFlightPath/5/data.json",
      "/scrolly/coreexam/ophths/DO/02PositioningandFlightPath/6/data.json",
    ],
    playMode: "stageAutoplay",
    segmentRanges: [
      [{ from: 0, to: 389 }],
      [{ from: 0, to: 389 }],
      [
        { from: 0, to: 0 },
        { from: 1, to: 315 },
      ],
      [{ from: 0, to: 525 }],
      [{ from: 0, to: 479 }],
      [{ from: 0, to: 194 }],
    ],
    settleFrameOverrides: [[389], [389], [0, 315], [525], [479], [194]],
    segmentTextTriggerFramesByFile: [
      null,
      [0, 0],
      [0, 1],
      null,
      [56, 193, 330],
      [0, 87],
    ],
    segmentPauseAfterMsByFile: [null, null, [3000]],
    segmentStartTexts: [
      ["Ask the patient to look at a target in the distance"],
      [
        "Use right hand and right eye to examine the patient's right eye",
        "Use your left hand and left eye for the left eye",
      ],
      [
        "Stand close to the patient with your feet together and lean back slightly",
        "Find the fundal reflex and follow as you move in, about 10 to 15 degrees to the ear side of the pupil",
      ],
      [
        "As you get closer, the optic disc should come into view. Move closer for a wider and steadier view",
      ],
      [
        "Examine the edge margin of the optic disc,",
        "the colour of the neuro-retinal rim",
        "and the cup-to-disc ratio",
      ],
      ["Healthy disc", "swollen disc, pale disc and cupped disc"],
    ],
    segmentTextModeByFile: [
      "append",
      "append",
      "append",
      "append",
      "append",
      "append",
    ],
    leftAlignedTextFiles: [1, 2],
    bulletTextFiles: [1, 2],
    iosRendererByFile: [null, null, null, "svg", null, null],
    strictFrameLockNoFallback: true,
    strictFrameRemountOnBlank: true,
    richSettleContentFiles: [0, 1, 2, 3, 4, 5],
    richSettleMinAreaByFile: [0.08, 0.08, 0.08, 0.08, 0.08, 0.08],
  },
  diabeticHowToExamine: {
    pageId: "diabeticHowToExaminePage",
    label: "How to Examine",
    enableReplay: true,
    segmentTextToggleOnTitle: true,
    paths: [
      "/scrolly/coreexam/ophths/DO/03HowtoExamine/1/data.json",
      "/scrolly/coreexam/ophths/DO/03HowtoExamine/2/data.json",
    ],
    playMode: "stageAutoplay",
    centerTopBiasByFile: [0, -250],
    desktopTopGapByFile: [18, -70],
    completionHoldFrameByFile: [224, 794],
    segmentRanges: [
      [{ from: 0, to: 224 }],
      [
        { from: 0, to: 98 },
        { from: 99, to: 629 },
        { from: 670, to: 700 },
        { from: 750, to: 794 },
      ],
    ],
    settleFrameOverrides: [[224], [98, 629, 700, 794]],
    segmentTextTriggerFramesByFile: [
      [0, 0],
      [0, 98, 629, 750],
    ],
    segmentPauseAfterMsByFile: [null, [4000, 4000, 4000]],
    segmentStartTexts: [
      [
        "Dilate the pupil before examining the fovea, as looking at the fovea in an undilated eye will make the pupil constrict",
        "In a dilated pupil, the fovea appears as a slightly darker area with a pin-point reflection",
      ],
      [
        "Start at the optic disc. Check how clear the disc margins are, the colour of the neuro-retinal rim and the cup-to-disc ratio",
        "Follow the four main branches of the retinal vessels and look for any abnormal signs",
        "Finally, ask the patient to look directly into the light to bring the macula and fovea into view",
        "Repeat the examination on the other eye",
      ],
    ],
    segmentTextModeByFile: ["append", "append"],
    leftAlignedTextFiles: [0, 1],
    bulletTextFiles: [0, 1],
    preserveCompletionSnapshotOverlayByFile: [false, true],
    completionSnapshotImageByFile: [
      null,
      "/scrolly/coreexam/ophths/DO/03HowtoExamine/2/final_frame.png",
    ],
    strictFrameLockNoFallback: true,
    strictFrameRemountOnBlank: true,
    richSettleContentFiles: [0, 1],
    richSettleMinAreaByFile: [0.08, 0.08],
  },
  diabeticBioPreparation: {
    pageId: "diabeticBioPreparationPage",
    label: "Preparation",
    enableReplay: true,
    persistentSettleSnapshotOverlay: true,
    segmentTextToggleOnTitle: true,
    paths: [
      "/scrolly/coreexam/fundalreflex/prep/1/data.json",
      "/scrolly/coreexam/ophths/BIO/01Preparation/1/data.json",
      "/scrolly/coreexam/ophths/BIO/01Preparation/3/data.json",
      "/scrolly/coreexam/ophths/BIO/01Preparation/2/data.json",
    ],
    playMode: "stageAutoplay",
    segmentPlaybackRateByFile: [null, [1.5, 1]],
    iosRendererByFile: [null, "svg", "canvas", null],
    preserveCompletionSnapshotOverlayByFile: [false, true, true, false],
    completionSnapshotImageByFile: [
      null,
      "/scrolly/coreexam/ophths/BIO/01Preparation/1/final_frame.png",
      "/scrolly/coreexam/ophths/BIO/01Preparation/3/final_frame.png",
      null,
    ],
    settleSnapshotImageByFile: [
      null,
      null,
      {
        183: "/scrolly/coreexam/ophths/BIO/01Preparation/3/pause_frame_183.png",
        271: "/scrolly/coreexam/ophths/BIO/01Preparation/3/pause_frame_271.png",
        340: "/scrolly/coreexam/ophths/BIO/01Preparation/3/pause_frame_340.png",
      },
      null,
    ],
    centerTopBiasByFile: [0, 0, -96, 0],
    desktopTopGapByFile: [18, 18, -24, 18],
    segmentRanges: [
      [{ from: 37, to: 239 }],
      [
        { from: 0, to: 392 },
        { from: 393, to: 598 },
      ],
      [
        { from: 0, to: 183 },
        { from: 184, to: 271 },
        { from: 272, to: 340 },
        { from: 341, to: 404 },
      ],
      [
        { from: 0, to: 0 },
        { from: 1, to: 119 },
      ],
    ],
    settleFrameOverrides: [[239], [598], [183, 271, 340, 404], [0, 119]],
    segmentTextTriggerFramesByFile: [null, [0, 393], [0, 184, 301, 341], null],
    segmentPauseAfterMsByFile: [null, null, [3000, 3000, 3000], [2000]],
    segmentStartTexts: [
      ["Wash hands"],
      [
        "Switch the light on and select the brightness level",
        "The device switches off automatically after 90 seconds",
      ],
      [
        "Place the BIO on your head and adjust the strap so it feels secure and comfortable",
        "Align the centre of the BIO with your nose",
        "Check the alignment by looking at your thumb at arm's length",
        "Close one eye and then the other to make sure your thumb stays in the centre of each view",
      ],
      [
        "Eyepieces would angle outwards\nso they are at 90 degrees to your line of sight\nlooking slightly downwards",
      ],
    ],
    segmentTextModeByFile: ["append", "append", "append", "append"],
    leftAlignedTextFiles: [2],
    bulletTextFiles: [2],
    strictFrameLockNoFallback: true,
    strictFrameRemountOnBlank: true,
    richSettleContentFiles: [0, 1, 2, 3],
    richSettleMinAreaByFile: [0.08, 0.08, 0.08, 0.08],
  },
  diabeticBioFundoscopySitting: {
    pageId: "diabeticBioFundoscopySittingPage",
    label: "Fundoscopy Sitting",
    enableReplay: true,
    persistentSettleSnapshotOverlay: true,
    disableCompletedRouteRestore: true,
    segmentTextToggleOnTitle: true,
    paths: [
      "/scrolly/coreexam/ophths/DO/03HowtoExamine/1/data.json",
      "/scrolly/coreexam/ophths/BIO/02FundoscopySitting/2/data.json",
      "/scrolly/coreexam/ophths/BIO/02FundoscopySitting/3/data.json",
      "/scrolly/coreexam/ophths/BIO/02FundoscopySitting/4/data.json",
      "/scrolly/coreexam/ophths/BIO/02FundoscopySitting/5/data.json",
    ],
    playMode: "stageAutoplay",
    lazyInitialStageCount: 1,
    completionHoldFrameByFile: [224, 224, 224, 270, 164],
    autoplayEndFrameByFile: [null, null, null, 270, null],
    iosRendererByFile: ["canvas", "canvas", "canvas", "canvas", "canvas"],
    preserveCompletionSnapshotOverlayByFile: [false, true, true, false, false],
    completionSnapshotImageByFile: [
      null,
      "/scrolly/coreexam/ophths/BIO/02FundoscopySitting/2/final_frame.png",
      "/scrolly/coreexam/ophths/BIO/02FundoscopySitting/3/final_frame.png",
      null,
      null,
    ],
    settleSnapshotImageByFile: [
      null,
      {
        166: "/scrolly/coreexam/ophths/BIO/02FundoscopySitting/2/pause_frame_166.png",
      },
      {
        75: "/scrolly/coreexam/ophths/BIO/02FundoscopySitting/3/pause_frame_75.png",
        158: "/scrolly/coreexam/ophths/BIO/02FundoscopySitting/3/pause_frame_158.png",
      },
      null,
      null,
    ],
    skipRouteImageWarmup: true,
    lazyLoadStageAnimations: true,
    centerTopBiasByFile: [0, 0, -96, 0, 0],
    desktopTopGapByFile: [18, 18, -24, 18, 18],
    segmentRanges: [
      [{ from: 0, to: 224 }],
      [
        { from: 0, to: 166 },
        { from: 167, to: 224 },
      ],
      [
        { from: 0, to: 75 },
        { from: 76, to: 158 },
        { from: 159, to: 224 },
      ],
      [{ from: 0, to: 270 }],
      [{ from: 0, to: 164 }],
    ],
    settleFrameOverrides: [[224], [166, 224], [75, 158, 224], [270], [164]],
    segmentTextTriggerFramesByFile: [
      null,
      [0, 167],
      [0, 76, 159],
      [0, 175],
      null,
    ],
    segmentPauseAfterMsByFile: [null, [3000], [3000, 3000]],
    segmentStartTexts: [
      ["Dilate the patient's pupils\nto allow a full wider view of the fundus"],
      [
        "Hold the condensing lens close to the eye,\nlift the upper eyelid",
        "and rest your other fingers gently on the patient's brow and cheek",
      ],
      [
        "Keep the condensing lens at arm's length",
        "and line it up with the light and the patient's retina",
        "If you see shadows at the edge of the view, it means the light, lens and retina may not be properly aligned.",
      ],
      [
        "To examine the edges of the retina, ask the patient to look in different directions",
        "If needed, use a fixation target such as the patient's finger or thumb held at arm's length",
      ],
      ["After the macula, examine the peripheral\n4 quadrants of the fundus"],
    ],
    segmentTextModeByFile: ["append", "append", "append", "append", "append"],
    leftAlignedTextFiles: [1, 2, 3],
    bulletTextFiles: [1, 2, 3],
    strictFrameLockNoFallback: true,
    strictFrameRemountOnBlank: true,
    richSettleContentFiles: [0, 1, 2, 3, 4],
    richSettleMinAreaByFile: [0.08, 0.08, 0.08, 0.08, 0.08],
  },
  diabeticBioFundoscopyIndentation: {
    pageId: "diabeticBioFundoscopyIndentationPage",
    label: "Fundoscopy with Indentation",
    enableReplay: true,
    segmentTextToggleOnTitle: true,
    paths: [
      "/scrolly/coreexam/ophths/BIO/03FundoscopywithIndentation/1/data.json",
      "/scrolly/coreexam/ophths/BIO/03FundoscopywithIndentation/2/data.json",
      "/scrolly/coreexam/ophths/BIO/03FundoscopywithIndentation/3/data.json",
      "/scrolly/coreexam/ophths/BIO/03FundoscopywithIndentation/4/data.json",
    ],
    playMode: "stageAutoplay",
    playbackRateByFile: [1, 1, 0.5, 1],
    completionHoldFrameByFile: [104, 104, 134, 299],
    forceExactCompletionHoldFrameByFile: [false, true, false, false],
    preserveCompletionSnapshotOverlayByFile: [true, true, false, false],
    completionSnapshotImageByFile: [
      "/scrolly/coreexam/ophths/BIO/03FundoscopywithIndentation/1/final_frame.png",
      "/scrolly/coreexam/ophths/BIO/03FundoscopywithIndentation/2/final_frame.png",
      null,
      null,
    ],
    centerTopBiasByFile: [0, -96, 0, 0],
    desktopTopGapByFile: [18, -24, 18, 18],
    segmentRanges: [
      [
        { from: 0, to: 14 },
        { from: 15, to: 104 },
      ],
      [
        { from: 0, to: 59 },
        { from: 60, to: 87 },
        { from: 88, to: 104 },
      ],
      [{ from: 0, to: 134 }],
      [{ from: 0, to: 299 }],
    ],
    settleFrameOverrides: [[14, 104], [59, 87, 104], [134], [299]],
    segmentTextTriggerFramesByFile: [[0, 15], [0, 30, 61], null, null],
    segmentPlaybackRateByFile: [null, [1, 0.5, 0.5], null, null],
    segmentPauseAfterMsByFile: [[3000], null],
    segmentStartTexts: [
      [
        "If the patient is lying down, you can also perform scleral indentation",
        "Inform the patient that this may feel uncomfortable",
      ],
      [
        "Ask the patient to look in the opposite area being examined",
        "Place the indenter on the area to be indented",
        "Ask the patient to look towards the area being examined and apply gentle pressure",
        "This example shows the examination of the superior retina",
      ],
      [
        "Align the light, condensing lens and patient's retina to achieve a full fundus view",
      ],
      ["You should be able to examine\nthe far periphery of the retina"],
    ],
    segmentTextModeByFile: ["append", "append", "append", "append"],
    leftAlignedTextFiles: [0, 1],
    bulletTextFiles: [0, 1],
    strictFrameLockNoFallback: true,
    strictFrameRemountOnBlank: true,
    richSettleContentFiles: [0, 1, 2, 3],
    richSettleMinAreaByFile: [0.08, 0.08, 0.08, 0.08],
  },
};

const FUNDAL_REFLEX_EXAMINATION_SCROLL_ROUTE = "fundalReflexExaminationScroll";
const FUNDAL_REFLEX_EXAMINATION_SECTION_SOURCES = [
  {
    routeName: "childhoodFundalPreparation",
    title: "Preparation",
    titleKey: "auto.childhoodeyescreeningworkshop.preparation",
  },
  {
    routeName: "childhoodFundalExamination",
    title: "Examination",
    titleKey: "auto.childhoodeyescreeningworkshop.examination",
  },
  {
    routeName: "childhoodFundalNewbornEyesOpen",
    title: "Newborn - Eyes Open",
    titleKey: "auto.childhoodeyescreeningworkshop.newborn_eyes_open",
  },
  {
    routeName: "childhoodFundalNewbornEyesClosed",
    title: "Newborn - Eyes Closed",
    titleKey: "auto.childhoodeyescreeningworkshop.newborn_eyes_closed",
  },
  {
    routeName: "childhoodFundalUnclearFindings",
    title: "Unclear Findings",
    titleKey: "auto.childhoodeyescreeningworkshop.unclear_findings",
  },
  {
    routeName: "childhoodFundalPossibleFinding",
    title: "Possible Findings",
    titleKey: "auto.childhoodeyescreeningworkshop.possible_findings",
  },
  {
    routeName: "childhoodFundalAfterExamination",
    title: "After Examination",
    titleKey: "auto.childhoodeyescreeningworkshop.after_examination",
  },
];
const DIRECT_OPHTHALMOSCOPY_SCROLL_ROUTE = "directOphthalmoscopyScroll";
const DIRECT_OPHTHALMOSCOPY_SECTION_SOURCES = [
  {
    routeName: "diabeticObservationFundalReflex",
    title: "Observation and Fundal Reflex",
  },
  {
    routeName: "diabeticPositioningFlightPath",
    title: "Positioning and Flight Path",
  },
  {
    routeName: "diabeticHowToExamine",
    title: "How to Examine",
  },
];
const BINOCULAR_INDIRECT_OPHTHALMOSCOPY_SCROLL_ROUTE =
  "binocularIndirectOphthalmoscopyScroll";
const BINOCULAR_INDIRECT_OPHTHALMOSCOPY_SECTION_SOURCES = [
  {
    routeName: "diabeticBioPreparation",
    title: "Preparation",
  },
  {
    routeName: "diabeticBioFundoscopySitting",
    title: "Fundoscopy Sitting",
  },
  {
    routeName: "diabeticBioFundoscopyIndentation",
    title: "Fundoscopy with Indentation",
  },
];

function cloneFundalConfigValue(value) {
  if (value == null) return value;

  if (typeof structuredClone === "function") {
    try {
      return structuredClone(value);
    } catch {
      // Fall through to the recursive clone for config-only data.
    }
  }

  if (Array.isArray(value)) {
    return value.map((item) => cloneFundalConfigValue(item));
  }

  if (typeof value === "object") {
    const next = {};
    Object.entries(value).forEach(([key, entryValue]) => {
      next[key] = cloneFundalConfigValue(entryValue);
    });
    return next;
  }

  return value;
}

function buildCombinedFundalPerFileArray(sectionDefs, key) {
  const result = [];

  sectionDefs.forEach((section) => {
    const cfg = ROUTE_CONFIG[section?.routeName];
    const fileCount = Array.isArray(cfg?.paths) ? cfg.paths.length : 0;
    const values = Array.isArray(cfg?.[key]) ? cfg[key] : [];

    for (let i = 0; i < fileCount; i += 1) {
      result.push(cloneFundalConfigValue(values[i]));
    }
  });

  return result.some((value) => value !== undefined) ? result : undefined;
}

function buildCombinedFundalIndexedFileList(sectionDefs, key) {
  const result = [];
  let offset = 0;

  sectionDefs.forEach((section) => {
    const cfg = ROUTE_CONFIG[section?.routeName];
    const fileCount = Array.isArray(cfg?.paths) ? cfg.paths.length : 0;
    const values = Array.isArray(cfg?.[key]) ? cfg[key] : [];

    values.forEach((value) => {
      const idx = Number(value);
      if (!Number.isInteger(idx) || idx < 0) return;
      result.push(offset + idx);
    });

    offset += fileCount;
  });

  return result.length ? result : undefined;
}

function createCombinedFundalRouteConfig(pageId, label, sectionDefs = []) {
  const normalizedSections = [];
  const paths = [];
  let startIndex = 0;

  sectionDefs.forEach((section) => {
    const cfg = ROUTE_CONFIG[section?.routeName];
    const sectionPaths = Array.isArray(cfg?.paths)
      ? cfg.paths
          .map((path) => String(path || "").trim())
          .filter((path) => !!path)
      : [];
    if (!sectionPaths.length) return;

    normalizedSections.push({
      startIndex,
      title: String(section?.title || cfg?.label || label).trim() || label,
      titleKey: String(section?.titleKey || "").trim(),
    });

    paths.push(...sectionPaths);
    startIndex += sectionPaths.length;
  });

  return {
    pageId,
    label,
    enableReplay: true,
    persistentSettleSnapshotOverlay: true,
    segmentTextToggleOnTitle: true,
    playMode: "stageAutoplay",
    strictFrameLockNoFallback: true,
    strictFrameRemountOnBlank: true,
    paths,
    sections: normalizedSections,
    playbackRateByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "playbackRateByFile",
    ),
    autoplayStartFrameByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "autoplayStartFrameByFile",
    ),
    autoplayEndFrameByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "autoplayEndFrameByFile",
    ),
    segmentTextTriggerFramesByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "segmentTextTriggerFramesByFile",
    ),
    segmentPlaybackRateByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "segmentPlaybackRateByFile",
    ),
    segmentPauseAfterMsByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "segmentPauseAfterMsByFile",
    ),
    segmentRanges: buildCombinedFundalPerFileArray(
      sectionDefs,
      "segmentRanges",
    ),
    settleFrameOverrides: buildCombinedFundalPerFileArray(
      sectionDefs,
      "settleFrameOverrides",
    ),
    completionHoldFrameByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "completionHoldFrameByFile",
    ),
    forceExactCompletionHoldFrameByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "forceExactCompletionHoldFrameByFile",
    ),
    segmentStartTexts: buildCombinedFundalPerFileArray(
      sectionDefs,
      "segmentStartTexts",
    ),
    segmentTextModeByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "segmentTextModeByFile",
    ),
    iosAggressiveSettleSegments: buildCombinedFundalPerFileArray(
      sectionDefs,
      "iosAggressiveSettleSegments",
    ),
    richSettleMinAreaByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "richSettleMinAreaByFile",
    ),
    stageAspectRatioByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "stageAspectRatioByFile",
    ),
    centerTopBiasByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "centerTopBiasByFile",
    ),
    desktopTopGapByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "desktopTopGapByFile",
    ),
    preserveAspectRatioByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "preserveAspectRatioByFile",
    ),
    iosRendererByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "iosRendererByFile",
    ),
    autoplayLegacySegmentPlaybackByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "autoplayLegacySegmentPlaybackByFile",
    ),
    preferLastVisibleCompletionFrameByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "preferLastVisibleCompletionFrameByFile",
    ),
    preserveCompletionSnapshotOverlayByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "preserveCompletionSnapshotOverlayByFile",
    ),
    completionSnapshotImageByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "completionSnapshotImageByFile",
    ),
    settleSnapshotImageByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "settleSnapshotImageByFile",
    ),
    finalSummaryBulletsByFile: buildCombinedFundalPerFileArray(
      sectionDefs,
      "finalSummaryBulletsByFile",
    ),
    forceInitialFrameHoldByFile: buildCombinedFundalIndexedFileList(
      sectionDefs,
      "forceInitialFrameHoldByFile",
    ),
    leftAlignedTextFiles: buildCombinedFundalIndexedFileList(
      sectionDefs,
      "leftAlignedTextFiles",
    ),
    bulletTextFiles: buildCombinedFundalIndexedFileList(
      sectionDefs,
      "bulletTextFiles",
    ),
    richSettleContentFiles: buildCombinedFundalIndexedFileList(
      sectionDefs,
      "richSettleContentFiles",
    ),
  };
}

ROUTE_CONFIG[FUNDAL_REFLEX_EXAMINATION_SCROLL_ROUTE] =
  createCombinedFundalRouteConfig(
    "fundalReflexExaminationScrollPage",
    "Fundal Reflex Examination",
    FUNDAL_REFLEX_EXAMINATION_SECTION_SOURCES,
  );
ROUTE_CONFIG[DIRECT_OPHTHALMOSCOPY_SCROLL_ROUTE] = {
  ...createCombinedFundalRouteConfig(
    "directOphthalmoscopyScrollPage",
    "Direct Ophthalmoscopy",
    DIRECT_OPHTHALMOSCOPY_SECTION_SOURCES,
  ),
  disableCompletedRouteRestore: true,
  lazyInitialStageCount: 1,
  lazyLoadStageAnimations: true,
  skipRouteImageWarmup: true,
};
ROUTE_CONFIG[BINOCULAR_INDIRECT_OPHTHALMOSCOPY_SCROLL_ROUTE] = {
  ...createCombinedFundalRouteConfig(
    "binocularIndirectOphthalmoscopyScrollPage",
    "Binocular Indirect Ophthalmoscopy",
    BINOCULAR_INDIRECT_OPHTHALMOSCOPY_SECTION_SOURCES,
  ),
  disableCompletedRouteRestore: true,
  lazyInitialStageCount: 1,
  lazyLoadStageAnimations: true,
  skipRouteImageWarmup: true,
};

const FUNDAL_PAGE_ROUTE_SEQUENCE = [
  "childhoodFundalPreparation",
  "childhoodFundalExamination",
  "childhoodFundalNewbornEyesOpen",
  "childhoodFundalNewbornEyesClosed",
  "childhoodFundalUnclearFindings",
  "childhoodFundalPossibleFinding",
  "childhoodFundalAfterExamination",
];
const DIABETIC_DO_FUNDAL_PAGE_ROUTE_SEQUENCE = [
  "diabeticObservationFundalReflex",
  "diabeticPositioningFlightPath",
  "diabeticHowToExamine",
];
const DIABETIC_BIO_FUNDAL_PAGE_ROUTE_SEQUENCE = [
  "diabeticBioPreparation",
  "diabeticBioFundoscopySitting",
  "diabeticBioFundoscopyIndentation",
];
const FUNDAL_PAGE_ROUTE_SEQUENCES = [
  FUNDAL_PAGE_ROUTE_SEQUENCE,
  DIABETIC_DO_FUNDAL_PAGE_ROUTE_SEQUENCE,
  DIABETIC_BIO_FUNDAL_PAGE_ROUTE_SEQUENCE,
];
const FUNDAL_CROSS_PAGE_BOUNDARY_LOCK_MS = 900;

let pendingFundalPageEntry = null;
let fundalPageNavigationInFlight = false;

function getFundalPageRouteSequence(routeName) {
  const normalized = String(routeName || "").trim();
  if (!normalized) return [];
  return (
    FUNDAL_PAGE_ROUTE_SEQUENCES.find((sequence) =>
      sequence.includes(normalized),
    ) || []
  );
}

function findFundalPageSequenceIndex(routeName) {
  const normalized = String(routeName || "").trim();
  if (!normalized) return -1;
  return getFundalPageRouteSequence(normalized).indexOf(normalized);
}

function getAdjacentFundalRoute(routeName, direction = 1) {
  const normalized = String(routeName || "").trim();
  const sequence = getFundalPageRouteSequence(normalized);
  const currentIndex = findFundalPageSequenceIndex(routeName);
  if (currentIndex < 0) return "";

  const step = direction < 0 ? -1 : 1;
  return sequence[currentIndex + step] || "";
}

function hasPreviousFundalRoute(routeName) {
  return !!getAdjacentFundalRoute(routeName, -1);
}

function hasNextFundalRoute(routeName) {
  return !!getAdjacentFundalRoute(routeName, 1);
}

function rememberFundalWorkshopFolderRestore() {
  try {
    sessionStorage.setItem("childhoodWorkshop:restoreOpenFolder", "1");
  } catch {}
}

function setPendingFundalPageEntry(routeName, edge, options = {}) {
  const normalizedRoute = String(routeName || "").trim();
  const normalizedEdge = String(edge || "")
    .trim()
    .toLowerCase();
  if (!normalizedRoute || !normalizedEdge) {
    pendingFundalPageEntry = null;
    return;
  }

  pendingFundalPageEntry = {
    routeName: normalizedRoute,
    edge: normalizedEdge === "end" ? "end" : "start",
    boundaryInputLockUntil: Number(options?.boundaryInputLockUntil || 0),
  };
}

function consumePendingFundalPageEntry(routeName) {
  const pending = pendingFundalPageEntry;
  if (!pending) return null;

  if (
    String(pending.routeName || "").trim() !== String(routeName || "").trim()
  ) {
    return null;
  }

  pendingFundalPageEntry = null;
  return pending;
}

function showFundalPageWithFallbackAndEvent(pageId) {
  const normalizedPageId = String(pageId || "").trim();
  if (!normalizedPageId) return false;

  const pageEl = document.getElementById(normalizedPageId);
  if (!pageEl) return false;

  const hasShowPage = typeof window.showPage === "function";
  const needsManualDispatch =
    !hasShowPage || window.__pageShownPatched !== true;

  if (hasShowPage) {
    window.showPage(normalizedPageId);
  } else {
    document.querySelectorAll(".page").forEach((candidate) => {
      candidate.style.display = "none";
    });
    pageEl.style.display = "block";
  }

  if (needsManualDispatch) {
    document.dispatchEvent(
      new CustomEvent("page:shown", { detail: { id: normalizedPageId } }),
    );
  }

  return true;
}

async function navigateAdjacentFundalPage(routeName, direction = 1) {
  if (fundalPageNavigationInFlight) return false;

  const targetRoute = getAdjacentFundalRoute(routeName, direction);
  if (!targetRoute) return false;

  const targetCfg = resolveFundalRouteConfig(targetRoute);
  if (!targetCfg?.pageId) return false;

  fundalPageNavigationInFlight = true;
  rememberFundalWorkshopFolderRestore();
  setPendingFundalPageEntry(targetRoute, direction < 0 ? "end" : "start", {
    boundaryInputLockUntil: Date.now() + FUNDAL_CROSS_PAGE_BOUNDARY_LOCK_MS,
  });

  try {
    await loadPage(targetRoute);
    showFundalPageWithFallbackAndEvent(targetCfg.pageId);
    return true;
  } catch (err) {
    pendingFundalPageEntry = null;
    console.error(
      "[fundalScroll] failed to navigate between fundal pages",
      err,
    );
    return false;
  } finally {
    fundalPageNavigationInFlight = false;
  }
}

function rememberDiabeticWorkshopFolderRestore(folderKey, focusSelector = "") {
  const normalizedFolder = String(folderKey || "").trim();
  if (!normalizedFolder) return;

  try {
    sessionStorage.setItem("diabeticWorkshop:restoreOpenFolder", "1");
    sessionStorage.setItem("diabeticWorkshop:openFolderKey", normalizedFolder);
    if (focusSelector) {
      sessionStorage.setItem(
        "diabeticWorkshop:focusSelector",
        String(focusSelector),
      );
    }
  } catch {}
}

async function navigateToFundalRoute(routeName, options = {}) {
  const targetRoute = String(routeName || "").trim();
  if (!targetRoute) return false;

  const targetCfg = resolveFundalRouteConfig(targetRoute);
  if (!targetCfg?.pageId) {
    rememberDiabeticWorkshopFolderRestore(
      options.diabeticFolder,
      options.diabeticFocusSelector,
    );
    try {
      await loadPage(targetRoute);
      return true;
    } catch (err) {
      console.error("[fundalScroll] failed to navigate to route", err);
      return false;
    }
  }

  rememberFundalWorkshopFolderRestore();

  try {
    await loadPage(targetRoute);
    showFundalPageWithFallbackAndEvent(targetCfg.pageId);
    return true;
  } catch (err) {
    console.error("[fundalScroll] failed to navigate to fundal route", err);
    return false;
  }
}

function wireFundalInlineNavigation(page) {
  page?.querySelectorAll("[data-fundal-nav-route]")?.forEach((button) => {
    if (button.dataset.fundalNavBound === "1") return;
    button.dataset.fundalNavBound = "1";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void navigateToFundalRoute(button.dataset.fundalNavRoute, {
        diabeticFolder: button.dataset.fundalNavFolder,
        diabeticFocusSelector: button.dataset.fundalNavFocusSelector,
      });
    });
  });
}

const FUNDAL_TEXT_KEYS = new Map([
  ["Wash hands", "i18nExtra.fundal_reflex.wash_hands"],
  [
    "Use brightest light setting",
    "i18nExtra.fundal_reflex.select_brightest_light_setting",
  ],
  ["Push lenses up", "i18nExtra.fundal_reflex.make_sure_lens_rack_top"],
  ["Examine in quiet, dim room", "i18nExtra.fundal_reflex.room_quiet_and_dim"],
  [
    "Hold Arclight close to your eye",
    "i18nExtra.fundal_reflex.hold_arclight_close_to_eye",
  ],
  ["Swaddle newborn", "i18nExtra.fundal_reflex.newborns_swaddled_securely"],
  [
    "Parents should hold older baby",
    "i18nExtra.fundal_reflex.older_babies_parent_hold_lap",
  ],
  [
    "Older children can sit alone",
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
    "If unclear, follow next three steps",
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
  ["Next page", "i18nExtra.fundal_reflex.next_page"],
  ["Replay", "i18nExtra.fundal_reflex.replay"],
]);

let fundalI18nDict = {};
let fundalI18nLang = null;
const CHILDHOOD_WORKSHOP_PROGRESS_PREFIX = "childhoodWorkshop:progress:";

function normalizeFundalLiteralText(value) {
  return String(value == null ? "" : value)
    .replace(/\r\n?/g, "\n")
    .replace(/\s+/g, " ")
    .trim();
}

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
  if (!key) {
    const literalMap = fundalI18nDict?.i18nLiteral || {};
    const literal =
      literalMap[normalized] ||
      literalMap[normalizeFundalLiteralText(normalized)];
    return literal == null ? normalized : String(literal).trim();
  }

  return String(get(fundalI18nDict, key) ?? normalized).trim();
}

let activeSession = null;

function readStoredChildhoodWorkshopProgress(target) {
  if (!target) return { percent: 0, updatedAt: 0 };

  try {
    const raw = JSON.parse(
      localStorage.getItem(`${CHILDHOOD_WORKSHOP_PROGRESS_PREFIX}${target}`) ||
        "null",
    );
    const percent = Number(raw?.percent);
    const updatedAt = Number(raw?.updatedAt);
    return {
      percent:
        Number.isFinite(percent) && percent > 0
          ? Math.max(0, Math.min(100, percent))
          : 0,
      updatedAt:
        Number.isFinite(updatedAt) && updatedAt > 0 ? Math.round(updatedAt) : 0,
    };
  } catch {
    return { percent: 0, updatedAt: 0 };
  }
}

function isStoredChildhoodWorkshopRouteComplete(target) {
  return readStoredChildhoodWorkshopProgress(target).percent >= 100;
}

async function refreshActiveFundalLanguageSession() {
  if (!activeSession || typeof activeSession.refreshLanguage !== "function") {
    return;
  }
  try {
    await activeSession.refreshLanguage();
  } catch (err) {
    console.error("[fundalScroll] language refresh failed", err);
  }
}

if (!window.__fundalScrollLanguageRefreshWired) {
  window.__fundalScrollLanguageRefreshWired = true;
  window.addEventListener("i18n:languageChanged", () => {
    void refreshActiveFundalLanguageSession();
  });
}

const IS_IOS_WEBKIT = FUNDAL_WEBKIT_ENVIRONMENT.iosLikeWebKit;
const IS_SAFARI_WEBKIT = FUNDAL_WEBKIT_ENVIRONMENT.safariWebKit;
const IOS_REPAINT_NUDGE_PENDING = new WeakSet();

const IOS_FR06_PREPARATION_SEGMENT_RANGES = [
  [
    { from: 0, to: 120 },
    { from: 121, to: 207 },
    { from: 208, to: "last" },
  ],
  [
    { from: 0, to: 101 },
    { from: 102, to: 222 },
    { from: 236, to: 354 },
    { from: 380, to: "last" },
  ],
  [
    { from: 0, to: 270 },
    { from: 271, to: 357 },
    { from: 358, to: 453 },
    { from: 454, to: "last" },
  ],
];

const IOS_FR06_PREPARATION_SETTLE_OVERRIDES = [
  [120, 207, "last"],
  [101, 222, 354, "last"],
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
  // FR06 also rendered Preparation with SVG on iPhone.
  return {
    ...baseCfg,
    segmentRanges: cloneSegmentRanges(IOS_FR06_PREPARATION_SEGMENT_RANGES),
    settleFrameOverrides: cloneSettleFrameOverrides(
      IOS_FR06_PREPARATION_SETTLE_OVERRIDES,
    ),
    strictFrameLockNoFallback: true,
  };
}

function resolveFundalRenderer(cfg, fileIndex) {
  const rendererOverride = Array.isArray(cfg?.rendererByFile)
    ? cfg.rendererByFile[fileIndex]
    : null;
  const normalizedOverride = String(
    rendererOverride == null ? "" : rendererOverride,
  )
    .trim()
    .toLowerCase();
  if (
    normalizedOverride === "svg" ||
    normalizedOverride === "canvas" ||
    normalizedOverride === "html"
  ) {
    return normalizedOverride;
  }

  if (!IS_IOS_WEBKIT) return FUNDAL_LOTTIE_RENDERER;

  const override = Array.isArray(cfg?.iosRendererByFile)
    ? cfg.iosRendererByFile[fileIndex]
    : null;
  const normalized = String(override == null ? "" : override)
    .trim()
    .toLowerCase();
  if (
    normalized === "svg" ||
    normalized === "canvas" ||
    normalized === "html"
  ) {
    return normalized;
  }

  return FUNDAL_IOS_DEFAULT_RENDERER;
}

function cleanupActiveSession() {
  if (!activeSession) return;

  unregisterFundalE2ESession(activeSession.routeName);

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

if (!window.__fundalScrollPageShownCleanupWired) {
  window.__fundalScrollPageShownCleanupWired = true;
  document.addEventListener("page:shown", (e) => {
    const shownId = e?.detail?.id || "";
    if (!activeSession) return;

    const activeCfg = resolveFundalRouteConfig(activeSession.routeName);
    const activePageId = activeCfg?.pageId || "";
    if (!activePageId || shownId === activePageId) return;

    cleanupActiveSession();
  });
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
  if (Number.isFinite(numeric)) return numeric;
  return 18;
}

function resolvePreserveAspectRatio(cfg, fileIndex) {
  const raw = Array.isArray(cfg?.preserveAspectRatioByFile)
    ? cfg.preserveAspectRatioByFile[fileIndex]
    : null;
  const value = String(raw == null ? "" : raw).trim();
  return value || "xMidYMid meet";
}

function shouldForceInitialFrameHold(cfg, fileIndex) {
  const raw = cfg?.forceInitialFrameHoldByFile;
  if (raw === true) return true;
  if (!Array.isArray(raw)) return false;
  return raw.includes(fileIndex);
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

function resolveSegmentTextTriggerFrames(cfg, fileIndex) {
  const raw = Array.isArray(cfg?.segmentTextTriggerFramesByFile)
    ? cfg.segmentTextTriggerFramesByFile[fileIndex]
    : null;
  if (!Array.isArray(raw)) return [];

  return raw
    .map((frame) => {
      const numeric = Number(frame);
      return Number.isFinite(numeric) && numeric >= 0
        ? Math.floor(numeric)
        : null;
    })
    .filter((frame) => frame != null);
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

function isSegmentTextFileFlagged(cfg, key, fileIndex) {
  const raw = cfg?.[key];
  if (raw === true) return true;
  if (!Array.isArray(raw)) return false;
  if (raw[fileIndex] === true) return true;
  return raw.includes(fileIndex);
}

function shouldLeftAlignSegmentText(cfg, fileIndex) {
  return isSegmentTextFileFlagged(cfg, "leftAlignedTextFiles", fileIndex);
}

function shouldRenderSegmentTextAsBullets(cfg, fileIndex) {
  return isSegmentTextFileFlagged(cfg, "bulletTextFiles", fileIndex);
}

function shouldLazyLoadStageAnimations(cfg) {
  return cfg?.lazyLoadStageAnimations === true;
}

function resolveSegmentPauseAfterMs(cfg, fileIndex, segmentIndex) {
  const rawFileRules = Array.isArray(cfg?.segmentPauseAfterMsByFile)
    ? cfg.segmentPauseAfterMsByFile[fileIndex]
    : null;
  const raw = Array.isArray(rawFileRules)
    ? rawFileRules[segmentIndex]
    : segmentIndex === 0
      ? rawFileRules
      : null;
  const pauseMs = Number(raw);
  if (!Number.isFinite(pauseMs) || pauseMs <= 0) return 0;
  return Math.max(0, Math.min(10000, Math.round(pauseMs)));
}

function hasConfiguredSegmentPause(cfg, fileIndex, segmentCount) {
  for (let i = 0; i < Math.max(0, Number(segmentCount) || 0); i += 1) {
    if (resolveSegmentPauseAfterMs(cfg, fileIndex, i) > 0) return true;
  }
  return false;
}

function waitFundalDelay(ms) {
  const delay = Number(ms);
  if (!Number.isFinite(delay) || delay <= 0) return Promise.resolve();
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const TIGHT_LINE_HEIGHT_SEGMENT_TEXTS = new Set([
  "Parents should hold older baby",
]);

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

function createStageAdvanceArrowMarkup() {
  return (
    '<div class="childhood-fundal-scroll-down-arrow__stack">' +
    '<span class="childhood-fundal-scroll-down-arrow__chev"></span>' +
    '<span class="childhood-fundal-scroll-down-arrow__chev"></span>' +
    '<span class="childhood-fundal-scroll-down-arrow__chev"></span>' +
    "</div>"
  );
}

function createFundalNextPagePillMarkup() {
  return (
    '<span class="childhood-fundal-page-next-pill">' +
    '<span class="childhood-fundal-page-next-pill__label"></span>' +
    '<span class="childhood-fundal-page-next-pill__stack">' +
    '<img class="childhood-fundal-page-next-pill__down" src="/scrolly/workshop/childhood/eyesbrain/down.png" alt="" aria-hidden="true" loading="eager" draggable="false">' +
    '<img class="childhood-fundal-page-next-pill__hand" src="/scrolly/workshop/childhood/eyesbrain/hand.png" alt="" aria-hidden="true" loading="eager" draggable="false">' +
    '<span class="childhood-fundal-page-next-pill__chev"></span>' +
    '<span class="childhood-fundal-page-next-pill__chev"></span>' +
    '<span class="childhood-fundal-page-next-pill__chev"></span>' +
    "</span>" +
    "</span>"
  );
}

function setStageAdvanceControlAppearance(
  buttonEl,
  mode = "stage",
  label = "",
) {
  if (!buttonEl) return;

  const nextMode =
    String(mode || "stage")
      .trim()
      .toLowerCase() === "page"
      ? "page"
      : "stage";
  const safeLabel = String(label || "").trim();

  buttonEl.dataset.fundalAdvanceMode = nextMode;
  buttonEl.classList.toggle(
    "childhood-fundal-scroll-down-arrow--page",
    nextMode === "page",
  );

  if (nextMode === "page") {
    buttonEl.innerHTML = createFundalNextPagePillMarkup();
    const labelEl = buttonEl.querySelector(
      ".childhood-fundal-page-next-pill__label",
    );
    if (labelEl) {
      labelEl.textContent = safeLabel || "Next page";
    }
    buttonEl.setAttribute("aria-label", safeLabel || "Next page");
    buttonEl.title = safeLabel || "Next page";
    return;
  }

  buttonEl.innerHTML = createStageAdvanceArrowMarkup();
  buttonEl.setAttribute("aria-label", safeLabel || "Next animation");
  buttonEl.title = safeLabel || "Next animation";
}

function createDownArrowElement() {
  const downArrow = document.createElement("button");
  downArrow.type = "button";
  downArrow.className = "childhood-fundal-scroll-down-arrow";
  downArrow.dataset.fundalStageNextBtn = "1";
  downArrow.disabled = true;
  setStageAdvanceControlAppearance(downArrow, "stage", "Next animation");
  return downArrow;
}

function ensureStageDownArrowElement(stage, existingArrow = null) {
  if (!stage) return null;
  const arrowContainer = stage.parentElement || stage;
  if (existingArrow && existingArrow.parentElement === arrowContainer)
    return existingArrow;

  const found = arrowContainer.querySelector(
    ".childhood-fundal-scroll-down-arrow",
  );
  if (found) {
    if (found.parentElement !== arrowContainer) {
      arrowContainer.appendChild(found);
    }
    return found;
  }

  const downArrow = existingArrow || createDownArrowElement();
  arrowContainer.appendChild(downArrow);
  return downArrow;
}

function createStageReplayButtonElement() {
  const replayBtn = document.createElement("button");
  replayBtn.type = "button";
  replayBtn.className = "childhood-fundal-stage-replay-btn";
  replayBtn.dataset.fundalStageReplayBtn = "1";
  replayBtn.setAttribute("aria-label", "Replay");
  replayBtn.title = "Replay";
  replayBtn.innerHTML =
    '<img class="childhood-fundal-stage-replay-btn__icon" src="/images/icon/base/replay.webp" alt="" aria-hidden="true" draggable="false">';
  replayBtn.style.display = "none";
  return replayBtn;
}

function ensureStageReplayButtonElement(stage, existingBtn = null) {
  if (!stage) return null;
  if (existingBtn && existingBtn.parentElement === stage) return existingBtn;

  const found = stage.querySelector(".childhood-fundal-stage-replay-btn");
  if (found) return found;

  const replayBtn = existingBtn || createStageReplayButtonElement();
  stage.appendChild(replayBtn);
  return replayBtn;
}

function clearFundalTextContainer(container) {
  if (!container) return;
  container.replaceChildren();
  container.classList.remove("childhood-fundal-segment-text--bullet-summary");
  container.classList.add("is-empty");
}

function renderFundalTextLines(container, lines, options = {}) {
  if (!container) return;

  const safeLines = Array.isArray(lines)
    ? lines
        .map((line) => normaliseSegmentTextLine(line))
        .filter((line) => !!line)
    : [];

  container.replaceChildren();
  container.classList.toggle("is-empty", safeLines.length === 0);
  container.classList.toggle(
    "childhood-fundal-segment-text--bullet-summary",
    options.bullet === true && safeLines.length > 0,
  );

  if (!safeLines.length) return;

  if (options.bullet === true) {
    const listEl = document.createElement("ul");
    listEl.className = "childhood-fundal-segment-text__bullet-list";
    safeLines.forEach((line) => {
      const itemEl = document.createElement("li");
      itemEl.className = "childhood-fundal-segment-text__bullet-item";
      if (shouldUseTightSegmentTextLineHeight(line)) {
        itemEl.classList.add("childhood-fundal-segment-text__line--tight");
      }
      renderSegmentTextLine(itemEl, line);
      listEl.appendChild(itemEl);
    });
    container.appendChild(listEl);
    return;
  }

  safeLines.forEach((line) => {
    const lineEl = document.createElement("div");
    lineEl.className = "childhood-fundal-segment-text__line";
    if (shouldUseTightSegmentTextLineHeight(line)) {
      lineEl.classList.add("childhood-fundal-segment-text__line--tight");
    }
    renderSegmentTextLine(lineEl, line);
    container.appendChild(lineEl);
  });
}

function cleanupLegacyTopbarReplay(page) {
  if (!page) return;

  const legacyReplayBtn = page.querySelector("[data-fundal-replay-btn]");
  legacyReplayBtn?.remove();

  const titleEl = page.querySelector(".eyes-topbar .eyes-topbar__title");
  if (titleEl) {
    titleEl.classList.remove("childhood-fundal-title-toggle");
    titleEl.removeAttribute("role");
    titleEl.removeAttribute("tabindex");
    titleEl.removeAttribute("aria-label");
    titleEl.removeAttribute("aria-pressed");
  }
}

function setStageReplayButtonLabel(buttonEl, label) {
  if (!buttonEl) return;
  const safeLabel = String(label || "Replay").trim() || "Replay";
  buttonEl.setAttribute("aria-label", safeLabel);
  buttonEl.title = safeLabel;
}

function resolveStagePosterPath(animationPath) {
  const rawPath = String(animationPath || "").trim();
  if (!rawPath || !/\/data\.json(?:\?.*)?$/i.test(rawPath)) return "";
  return rawPath.replace(
    /\/data\.json(?:\?.*)?$/i,
    `/images/${FUNDAL_STAGE_POSTER_FILENAME}`,
  );
}

function shouldSkipStagePoster(cfg, fileIndex = 0) {
  if (!FUNDAL_STAGE_POSTER_ENABLED) return true;
  if (!IS_IOS_WEBKIT) return false;
  return cfg?.disableIosFirstStagePoster === true && Number(fileIndex) === 0;
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

function resolveLottieImageAssetUrl(dataPath, asset) {
  const file = String(asset?.p || "").trim();
  if (!file) return "";
  if (/^(?:data:|blob:|https?:)?\/\//i.test(file)) return file;
  if (typeof window === "undefined") return "";

  const base = new URL(String(dataPath || "").trim(), window.location.origin);
  const relDir = String(asset?.u || "").trim();
  const mergedPath = `${relDir}${file}`;
  return new URL(mergedPath, base).toString();
}

async function listLottieImageAssetUrls(dataPath) {
  const path = String(dataPath || "").trim();
  if (!path || typeof fetch !== "function") return [];
  if (FUNDAL_LOTTIE_IMAGE_ASSET_URLS_CACHE.has(path)) {
    return FUNDAL_LOTTIE_IMAGE_ASSET_URLS_CACHE.get(path);
  }

  const promise = fetch(path, {
    method: "GET",
    credentials: "same-origin",
    cache: "force-cache",
  })
    .then(async (response) => {
      if (!response.ok) return [];
      const payload = await response.json();
      const assets = Array.isArray(payload?.assets) ? payload.assets : [];
      const urls = assets
        .filter((asset) => {
          if (!asset || asset.e === 1) return false;
          return typeof asset.p === "string" && asset.p.trim().length > 0;
        })
        .map((asset) => resolveLottieImageAssetUrl(path, asset))
        .filter((url) => !!url);
      return Array.from(new Set(urls));
    })
    .catch(() => []);

  FUNDAL_LOTTIE_IMAGE_ASSET_URLS_CACHE.set(path, promise);
  return promise;
}

function warmFundalImage(url, options = {}) {
  const href = String(url || "").trim();
  if (!href) return Promise.resolve(false);
  if (typeof Image === "undefined") return Promise.resolve(false);
  if (FUNDAL_IMAGE_WARMUP_PROMISE_CACHE.has(href)) {
    return FUNDAL_IMAGE_WARMUP_PROMISE_CACHE.get(href);
  }

  const promise = new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    const fetchPriority = String(options.fetchPriority || "").trim();
    if (fetchPriority) {
      img.setAttribute("fetchpriority", fetchPriority);
    }

    const done = (ok) => {
      img.onload = null;
      img.onerror = null;
      resolve(ok);
    };
    img.onload = () => done(true);
    img.onerror = () => done(false);
    img.src = href;
    if (img.complete) done(true);
  });

  FUNDAL_IMAGE_WARMUP_PROMISE_CACHE.set(href, promise);
  return promise;
}

async function primeFundalLottieImageAssets(dataPath, options = {}) {
  const urls = await listLottieImageAssetUrls(dataPath);
  if (!urls.length) return 0;

  const rel = String(options.rel || "preload").trim() || "preload";
  const fetchPriority = String(options.fetchPriority || "").trim();

  urls.forEach((url, index) => {
    primeFundalAsset(url, {
      rel,
      as: "image",
      fetchPriority: index < 4 ? fetchPriority : "",
    });
  });

  const shouldWarmup = options.warmup !== false;
  if (!shouldWarmup) return urls.length;

  const warmCount = Math.max(
    1,
    Math.min(
      urls.length,
      Number.isFinite(Number(options.warmCount))
        ? Math.floor(Number(options.warmCount))
        : IS_IOS_WEBKIT
          ? 8
          : 6,
    ),
  );
  const warmupPromise = Promise.allSettled(
    urls
      .slice(0, warmCount)
      .map((url) => warmFundalImage(url, { fetchPriority })),
  );
  if (options.awaitWarmup !== true) return urls.length;

  const timeoutMs = Math.max(
    80,
    Math.min(
      2400,
      Number.isFinite(Number(options.timeoutMs))
        ? Math.floor(Number(options.timeoutMs))
        : IS_IOS_WEBKIT
          ? 1200
          : 800,
    ),
  );
  await Promise.race([
    warmupPromise,
    new Promise((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
  return urls.length;
}

function warmupFundalRouteAssets(cfg, options = {}) {
  if (!cfg) return;
  const paths = Array.isArray(cfg.paths)
    ? cfg.paths
        .map((path) => String(path || "").trim())
        .filter((path) => !!path)
    : [];
  if (!paths.length) return;
  const mode = String(options.mode || "route")
    .trim()
    .toLowerCase();
  const isIdleWarmup = mode === "idle";
  const skipImageWarmup = cfg.skipRouteImageWarmup === true;

  if (isIdleWarmup) {
    primeFundalAsset(LOTTIE_SRC, {
      rel: "prefetch",
      as: "script",
    });
  } else {
    primeFundalAsset(LOTTIE_SRC, {
      as: "script",
      fetchPriority: "high",
    });
  }

  const firstDataPath = paths[0];
  primeFundalAsset(
    firstDataPath,
    isIdleWarmup
      ? { rel: "prefetch", as: "fetch" }
      : {
          as: "fetch",
          fetchPriority: "high",
        },
  );
  if (!skipImageWarmup) {
    void primeFundalLottieImageAssets(
      firstDataPath,
      isIdleWarmup
        ? {
            rel: "prefetch",
            warmup: false,
          }
        : {
            rel: "preload",
            fetchPriority: "high",
            warmup: true,
            warmCount: IS_IOS_WEBKIT ? 8 : 6,
            awaitWarmup: false,
          },
    );
  }
  if (!shouldSkipStagePoster(cfg, 0)) {
    primeFundalAsset(
      resolveStagePosterPath(firstDataPath),
      isIdleWarmup
        ? { rel: "prefetch", as: "image" }
        : {
            as: "image",
            fetchPriority: "high",
          },
    );
  }

  if (isIdleWarmup) return;

  collectConfiguredSnapshotImageUrls(cfg).forEach((url, index) => {
    primeFundalAsset(url, {
      rel: index < 4 ? "preload" : "prefetch",
      as: "image",
      fetchPriority: index < 4 ? "high" : "",
    });
    void warmFundalImage(url, {
      fetchPriority: index < 4 ? "high" : "",
    });
  });

  for (let i = 1; i < Math.min(paths.length, 3); i += 1) {
    const path = paths[i];
    primeFundalAsset(path, { rel: "prefetch", as: "fetch" });
    if (!skipImageWarmup) {
      void primeFundalLottieImageAssets(path, {
        rel: "prefetch",
        warmup: false,
      });
    }
    if (!shouldSkipStagePoster(cfg, i)) {
      primeFundalAsset(resolveStagePosterPath(path), {
        rel: "prefetch",
        as: "image",
      });
    }
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
  const markReady = () => {
    stage.classList.remove("childhood-fundal-prep-stage--loading");
    stage.classList.add("childhood-fundal-prep-stage--ready");
    stage.dataset.posterHidden = "1";
  };
  if (!poster) {
    markReady();
    return;
  }

  const removePoster = () => {
    if (poster.parentElement) {
      poster.parentElement.removeChild(poster);
    }
    markReady();
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
  if (!stage || stage.dataset.posterHidden === "1") return false;
  if (isStageFrameBlank(controller)) return false;

  const requireRichContent =
    options.requireRichContent === true ||
    (options.requireRichContent == null && IS_IOS_WEBKIT);
  if (requireRichContent) {
    const minContentAreaRatio = Number.isFinite(
      Number(options.minContentAreaRatio),
    )
      ? Math.max(0.01, Number(options.minContentAreaRatio))
      : Number.isFinite(Number(controller?.minContentAreaRatio))
        ? Math.max(0.01, Number(controller.minContentAreaRatio))
        : 0.16;
    if (!hasRichVisibleContent(controller, minContentAreaRatio)) return false;
  }

  hideStagePoster(stage, options);
  return true;
}

function cancelStagePosterHideCheck(controller) {
  const rafId = Number(controller?.posterHideCheckRafId);
  if (!Number.isFinite(rafId)) return;
  try {
    cancelAnimationFrame(rafId);
  } catch {}
  if (controller) controller.posterHideCheckRafId = null;
}

function scheduleStagePosterHideCheck(controller, options = {}) {
  const stage = controller?.stage;
  if (!stage || stage.dataset.posterHidden === "1") return;

  cancelStagePosterHideCheck(controller);

  let remainingChecks = Math.max(
    1,
    Math.min(
      360,
      Number.isFinite(Number(options.checks))
        ? Math.floor(Number(options.checks))
        : IS_IOS_WEBKIT
          ? 240
          : 60,
    ),
  );

  const tick = () => {
    if (!controller?.stage || controller.stage.dataset.posterHidden === "1") {
      if (controller) controller.posterHideCheckRafId = null;
      return;
    }

    const hidden = maybeHideStagePoster(controller, options);
    if (hidden || remainingChecks <= 1) {
      controller.posterHideCheckRafId = null;
      return;
    }

    remainingChecks -= 1;
    controller.posterHideCheckRafId = requestAnimationFrame(tick);
  };

  controller.posterHideCheckRafId = requestAnimationFrame(tick);
}

function buildAnimationSlots(listEl, label, count, cfg = null) {
  if (!listEl) return [];

  listEl.innerHTML = "";
  const stages = [];
  const rawSections = Array.isArray(cfg?.sections) ? cfg.sections : [];
  const sections = rawSections
    .map((section) => {
      const startIndex = Number(section?.startIndex);
      if (
        !Number.isInteger(startIndex) ||
        startIndex < 0 ||
        startIndex >= count
      )
        return null;

      const title = String(section?.title || label || "").trim();
      if (!title) return null;

      return {
        startIndex,
        title,
        titleKey: String(section?.titleKey || "").trim(),
      };
    })
    .filter((section) => !!section)
    .sort((a, b) => a.startIndex - b.startIndex);
  const sectionStarts = new Map(
    sections.map((section) => [section.startIndex, section]),
  );
  let currentListEl = listEl;

  for (let i = 0; i < count; i += 1) {
    const sectionMeta = sectionStarts.get(i);
    if (sectionMeta) {
      const sectionEl = document.createElement("section");
      sectionEl.className = "fundal-reflex-examination-section";

      const dividerEl = document.createElement("div");
      dividerEl.className = "fundal-reflex-section-divider";

      const titleEl = document.createElement("h3");
      titleEl.className = "fundal-reflex-section-divider__title";
      titleEl.textContent = sectionMeta.title;
      if (sectionMeta.titleKey) {
        titleEl.setAttribute("data-i18n", sectionMeta.titleKey);
      }

      dividerEl.appendChild(titleEl);

      const itemsEl = document.createElement("div");
      itemsEl.className = "fundal-reflex-examination-section-items";

      sectionEl.appendChild(dividerEl);
      sectionEl.appendChild(itemsEl);
      listEl.appendChild(sectionEl);
      currentListEl = itemsEl;
    }

    const item = document.createElement("div");
    item.className = "childhood-fundal-prep-item";
    item.dataset.fileIndex = String(i);

    const stage = document.createElement("div");
    stage.className = "childhood-fundal-prep-stage";
    stage.setAttribute("role", "img");
    stage.setAttribute("aria-label", `${label} animation ${i + 1}`);
    stage.dataset.fileIndex = String(i);
    const customAspectRatio = resolveStageAspectRatio(cfg, i);
    item.style.setProperty(
      "--fundal-stage-aspect-ratio",
      customAspectRatio || "1169 / 1280",
    );
    if (customAspectRatio) {
      stage.style.aspectRatio = customAspectRatio;
      stage.style.setProperty("--fundal-stage-aspect-ratio", customAspectRatio);
    }
    const animationPath =
      Array.isArray(cfg?.paths) && typeof cfg.paths[i] === "string"
        ? cfg.paths[i]
        : "";
    const posterPath = resolveStagePosterPath(animationPath);
    const shouldRenderPoster = posterPath && !shouldSkipStagePoster(cfg, i);
    if (shouldRenderPoster) {
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

    item.appendChild(stage);
    item.appendChild(segmentText);
    item.appendChild(downArrow);
    currentListEl.appendChild(item);
    stages.push(stage);
  }

  return stages;
}

function resolveFirstStageAnchorElement(stage, cfg) {
  if (!stage) return null;
  if (!Array.isArray(cfg?.sections) || cfg.sections.length === 0) return stage;

  return (
    stage
      .closest(".fundal-reflex-examination-section")
      ?.querySelector(".fundal-reflex-section-divider") || stage
  );
}

async function ensureLottie() {
  if (window.lottie) return true;

  if (!window.__lottieLoadPromise) {
    window.__lottieLoadPromise = new Promise((resolve, reject) => {
      const targetPath = new URL(LOTTIE_SRC, window.location.origin).pathname;
      const existing = Array.from(
        document.querySelectorAll("script[src]"),
      ).find((scriptEl) => {
        const rawSrc = String(scriptEl.getAttribute("src") || "").trim();
        if (!rawSrc) return false;
        if (rawSrc === LOTTIE_SRC) return true;
        try {
          return (
            new URL(rawSrc, window.location.origin).pathname === targetPath
          );
        } catch {
          return false;
        }
      });
      if (existing) {
        if (window.lottie) {
          resolve();
          return;
        }
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

function shouldUseLegacySegmentPlaybackForAutoplay(cfg, fileIndex) {
  const rule = Array.isArray(cfg?.autoplayLegacySegmentPlaybackByFile)
    ? cfg.autoplayLegacySegmentPlaybackByFile[fileIndex]
    : null;
  return rule === true;
}

function resolveAutoplayPlaybackSegments(cfg, fileIndex, anim, segments = []) {
  const lastFrame = getAnimationLastFrame(anim);
  const autoplayStartFrame = Math.max(
    0,
    Math.min(lastFrame, resolveConfiguredAutoplayStartFrame(cfg, fileIndex)),
  );
  const configuredAutoplayEndFrame = resolveConfiguredAutoplayEndFrame(
    cfg,
    fileIndex,
  );
  const autoplayEndFrame = Number.isFinite(configuredAutoplayEndFrame)
    ? Math.max(
        autoplayStartFrame,
        Math.min(lastFrame, configuredAutoplayEndFrame),
      )
    : lastFrame;

  if (
    (shouldUseLegacySegmentPlaybackForAutoplay(cfg, fileIndex) ||
      hasConfiguredSegmentPause(cfg, fileIndex, segments.length) ||
      hasConfiguredSegmentPlaybackRate(cfg, fileIndex, segments.length)) &&
    Array.isArray(segments) &&
    segments.length > 0
  ) {
    const clippedSegments = segments
      .map((segment) => ({ ...segment }))
      .filter((segment) => getSegmentEndFrame(segment) >= autoplayStartFrame)
      .filter((segment) => Number(segment.from) <= autoplayEndFrame)
      .map((segment, index) =>
        index === 0 && autoplayStartFrame > Number(segment.from)
          ? {
              ...segment,
              from: autoplayStartFrame,
              to: Math.min(getSegmentEndFrame(segment), autoplayEndFrame),
            }
          : {
              ...segment,
              to: Math.min(getSegmentEndFrame(segment), autoplayEndFrame),
            },
      );
    if (clippedSegments.length > 0) return clippedSegments;
  }

  return [
    normaliseSegment(
      { from: autoplayStartFrame, to: autoplayEndFrame },
      lastFrame,
    ),
  ];
}

function shouldPreferLastVisibleCompletionFrame(cfg, fileIndex) {
  const rule = Array.isArray(cfg?.preferLastVisibleCompletionFrameByFile)
    ? cfg.preferLastVisibleCompletionFrameByFile[fileIndex]
    : null;
  return rule === true;
}

function shouldPreserveCompletionSnapshotOverlay(cfg, fileIndex) {
  const rule = Array.isArray(cfg?.preserveCompletionSnapshotOverlayByFile)
    ? cfg.preserveCompletionSnapshotOverlayByFile[fileIndex]
    : null;
  return rule === true;
}

function shouldForceExactCompletionHoldFrame(cfg, fileIndex) {
  const rule = Array.isArray(cfg?.forceExactCompletionHoldFrameByFile)
    ? cfg.forceExactCompletionHoldFrameByFile[fileIndex]
    : null;
  return rule === true;
}

function resolveCompletionSnapshotImage(cfg, fileIndex) {
  const raw = Array.isArray(cfg?.completionSnapshotImageByFile)
    ? cfg.completionSnapshotImageByFile[fileIndex]
    : null;
  const value = String(raw == null ? "" : raw).trim();
  return value || "";
}

function resolveSettleSnapshotImages(cfg, fileIndex) {
  const raw = Array.isArray(cfg?.settleSnapshotImageByFile)
    ? cfg.settleSnapshotImageByFile[fileIndex]
    : null;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};

  const result = {};
  Object.entries(raw).forEach(([frame, url]) => {
    const safeFrame = Math.floor(Number(frame));
    const safeUrl = String(url == null ? "" : url).trim();
    if (!Number.isFinite(safeFrame) || !safeUrl) return;
    result[String(safeFrame)] = safeUrl;
  });
  return result;
}

function resolveConfiguredSettleSnapshotImage(controller, frame) {
  const safeFrame = resolveExactFrameFallbackTarget(controller, frame);
  const images = controller?.settleSnapshotImages || {};
  const direct = String(images[String(safeFrame)] || "").trim();
  if (direct) return direct;

  for (let offset = 1; offset <= 1; offset += 1) {
    const before = String(images[String(safeFrame - offset)] || "").trim();
    if (before) return before;
    const after = String(images[String(safeFrame + offset)] || "").trim();
    if (after) return after;
  }

  return "";
}

function collectConfiguredSnapshotImageUrls(cfg) {
  const urls = [];
  const completionImages = Array.isArray(cfg?.completionSnapshotImageByFile)
    ? cfg.completionSnapshotImageByFile
    : [];
  completionImages.forEach((url) => {
    const value = String(url == null ? "" : url).trim();
    if (value) urls.push(value);
  });

  const settleImages = Array.isArray(cfg?.settleSnapshotImageByFile)
    ? cfg.settleSnapshotImageByFile
    : [];
  settleImages.forEach((fileImages) => {
    if (!fileImages || typeof fileImages !== "object") return;
    Object.values(fileImages).forEach((url) => {
      const value = String(url == null ? "" : url).trim();
      if (value) urls.push(value);
    });
  });

  return Array.from(new Set(urls));
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

  if (IS_SAFARI_WEBKIT) {
    // Safari/WebKit can drop renderer layers after rapid scroll + frame seeks.
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
  if (!IS_SAFARI_WEBKIT) return;
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
  controller.preserveRecoveryOverlay = false;

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

function showRecoveryImageOverlay(controller, imageUrl) {
  const safeUrl = String(imageUrl || "").trim();
  if (!safeUrl) return false;

  const overlay = ensureRecoveryOverlay(controller);
  if (!overlay) return false;

  if (Number.isFinite(controller?.recoveryOverlayClearTimer)) {
    clearTimeout(controller.recoveryOverlayClearTimer);
    controller.recoveryOverlayClearTimer = null;
  }

  const img = createRecoveryImageElement(safeUrl);
  if (!img) return false;

  overlay.replaceChildren(img);
  overlay.style.visibility = "visible";
  overlay.style.opacity = "1";
  controller.recoveryOverlayVisible = true;
  controller.preserveRecoveryOverlay = true;
  return true;
}

function createRecoveryImageElement(imageUrl) {
  const safeUrl = String(imageUrl || "").trim();
  if (!safeUrl) return null;

  const img = document.createElement("img");
  img.src = safeUrl;
  img.alt = "";
  img.setAttribute("aria-hidden", "true");
  img.decoding = "sync";
  img.loading = "eager";
  img.style.display = "block";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "contain";
  img.style.objectPosition = "center";
  img.style.pointerEvents = "none";
  return img;
}

function hideRecoveryOverlay(controller, options = {}) {
  const overlay = controller?.recoveryOverlayEl;
  if (!overlay) return;
  const immediate = options?.immediate === true;
  if (
    controller?.preserveRecoveryOverlay &&
    !immediate &&
    options?.force !== true
  ) {
    return;
  }

  controller.recoveryOverlayVisible = false;
  if (immediate || options?.force === true) {
    controller.preserveRecoveryOverlay = false;
  }
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
    if (shouldUseSnapshotlessExactFrameFallback(controller)) {
      showExactFrameFallbackOverlay(controller);
      return;
    }
    showRecoveryOverlay(controller);
    return;
  }
  rememberRecoverySnapshot(controller, controller.lastRenderedFrame);
  hideRecoveryOverlay(controller, { immediate: true });
}

function shouldUseSnapshotlessExactFrameFallback(controller) {
  return (
    IS_IOS_WEBKIT &&
    controller?.preserveRecoveryOverlay !== true &&
    isCanvasRenderElement(getControllerRenderElement(controller))
  );
}

function resolveExactFrameFallbackTarget(controller, frame = null) {
  const candidates = [
    frame,
    controller?.activePauseFrame,
    controller?.lastPinnedFrame,
    controller?.targetEndFrame,
    controller?.anim?.currentFrame,
    controller?.lastRenderedFrame,
  ];

  for (let i = 0; i < candidates.length; i += 1) {
    const candidate = Number(candidates[i]);
    if (!Number.isFinite(candidate)) continue;
    return clampFrameToAnimation(controller, candidate);
  }

  return 0;
}

function createExactFrameSnapshotNode(controller, frame, options = {}) {
  if (!controller?.anim) return null;
  const safeFrame = resolveExactFrameFallbackTarget(controller, frame);
  const minContentAreaRatio = Number.isFinite(
    Number(options.minContentAreaRatio),
  )
    ? Math.max(0.01, Number(options.minContentAreaRatio))
    : Number.isFinite(Number(controller.minContentAreaRatio))
      ? Number(controller.minContentAreaRatio)
      : 0.16;

  try {
    controller.anim.pause?.();
    controller.anim.goToAndStop?.(safeFrame, true);
  } catch {}
  forceSvgVisibleForController(controller);
  requestIosStageRepaintNudge(controller.stage);

  const renderEl = getControllerRenderElement(controller);
  if (!renderEl) return null;

  let snapshot = null;
  if (isCanvasRenderElement(renderEl)) {
    const metrics = sampleCanvasContentMetrics(renderEl, {
      sampleSize: 24,
      alphaThreshold: 16,
      nearWhiteThreshold: 246,
    });
    if (!metrics || !isStageFrameBlank(controller)) {
      snapshot = cloneCanvasSnapshotNode(renderEl);
    } else if (
      metrics.nonWhiteRatio > 0.02 ||
      metrics.nonWhiteAmongVisible > 0.03
    ) {
      snapshot = cloneCanvasSnapshotNode(renderEl);
    }
  } else {
    try {
      snapshot = renderEl.cloneNode(true);
    } catch {}
  }

  if (!snapshot) return null;
  snapshot.style.display = "block";
  snapshot.style.width = "100%";
  snapshot.style.height = "100%";
  controller.recoverySnapshotFrame = safeFrame;
  const snapshotSegIndex = Number(controller?.playingSegmentIndex);
  if (Number.isFinite(snapshotSegIndex) && snapshotSegIndex >= 0) {
    controller.recoverySnapshotSegmentIndex = Math.floor(snapshotSegIndex);
  }
  if (isCanvasRenderElement(snapshot)) {
    controller.recoverySnapshotMarkup = "";
    try {
      controller.recoverySnapshotCanvasDataUrl =
        snapshot.toDataURL("image/png");
    } catch {
      controller.recoverySnapshotCanvasDataUrl = "";
    }
  } else {
    controller.recoverySnapshotMarkup = snapshot.outerHTML || "";
    controller.recoverySnapshotCanvasDataUrl = "";
  }
  return snapshot;
}

function showExactFrameFallbackOverlay(controller, frame = null, options = {}) {
  if (!controller?.anim) return 0;
  const safeFrame = resolveExactFrameFallbackTarget(controller, frame);
  const minContentAreaRatio = Number.isFinite(
    Number(options.minContentAreaRatio),
  )
    ? Math.max(0.01, Number(options.minContentAreaRatio))
    : Number.isFinite(Number(controller.minContentAreaRatio))
      ? Number(controller.minContentAreaRatio)
      : 0.16;

  try {
    controller.anim.pause?.();
    controller.anim.goToAndStop?.(safeFrame, true);
  } catch {}
  forceSvgVisibleForController(controller);

  const overlay = ensureRecoveryOverlay(controller);
  const configuredSnapshotImage = resolveConfiguredSettleSnapshotImage(
    controller,
    safeFrame,
  );
  const snapshot = configuredSnapshotImage
    ? createRecoveryImageElement(configuredSnapshotImage)
    : createExactFrameSnapshotNode(controller, safeFrame, {
        minContentAreaRatio,
      });
  if (overlay && snapshot) {
    controller.recoverySnapshotFrame = safeFrame;
    const snapshotSegIndex = Number(controller?.playingSegmentIndex);
    if (Number.isFinite(snapshotSegIndex) && snapshotSegIndex >= 0) {
      controller.recoverySnapshotSegmentIndex = Math.floor(snapshotSegIndex);
    }
    if (Number.isFinite(controller?.recoveryOverlayClearTimer)) {
      clearTimeout(controller.recoveryOverlayClearTimer);
      controller.recoveryOverlayClearTimer = null;
    }
    controller.preserveRecoveryOverlay = false;
    overlay.replaceChildren(snapshot);
    overlay.style.visibility = "visible";
    overlay.style.opacity = "1";
    controller.recoveryOverlayVisible = true;
  } else {
    hideRecoveryOverlay(controller, { immediate: true, force: true });
  }

  forceSvgVisibleForController(controller);
  controller.lastPinnedFrame = safeFrame;
  requestIosStageRepaintNudge(controller.stage);
  requestExactHoldStabilization(controller, safeFrame, {
    passes: Number.isFinite(Number(options.passes))
      ? Number(options.passes)
      : IS_IOS_WEBKIT
        ? 5
        : 2,
    attemptsPerPass: Number.isFinite(Number(options.attemptsPerPass))
      ? Number(options.attemptsPerPass)
      : IS_IOS_WEBKIT
        ? 2
        : 1,
    minContentAreaRatio,
    allowFrameShift: false,
  });
  return safeFrame;
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
    if (shouldUseSnapshotlessExactFrameFallback(controller)) {
      showExactFrameFallbackOverlay(controller, holdFrame, {
        minContentAreaRatio,
      });
      return false;
    }
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
        if (shouldUseSnapshotlessExactFrameFallback(controller)) {
          showExactFrameFallbackOverlay(controller, exactFrame, {
            minContentAreaRatio: options.minContentAreaRatio,
          });
        } else {
          showRecoveryOverlay(controller);
        }
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
    if (IS_IOS_WEBKIT && shouldUseSnapshotlessExactFrameFallback(controller)) {
      showExactFrameFallbackOverlay(controller, holdFrame, {
        minContentAreaRatio,
      });
    } else if (IS_IOS_WEBKIT) {
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
      const didHidePoster = maybeHideStagePoster(controller, {
        immediate: true,
        requireRichContent: IS_IOS_WEBKIT,
        minContentAreaRatio: controller.minContentAreaRatio,
      });
      if (!didHidePoster && controller.stage?.dataset?.posterHidden !== "1") {
        scheduleStagePosterHideCheck(controller, {
          requireRichContent: IS_IOS_WEBKIT,
          minContentAreaRatio: controller.minContentAreaRatio,
          checks: IS_IOS_WEBKIT ? 220 : 45,
        });
      }
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
      controller.inputLockUntil = Date.now() + (IS_IOS_WEBKIT ? 1400 : 1500);
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

    const anchorEl = resolveFirstStageAnchorElement(firstStage, cfg);
    const topbarHeight = getTopbarHeight();
    const extraTopGap =
      anchorEl === firstStage
        ? shouldUseMobileStageTopAlignedMode(cfg)
          ? 0
          : resolveFirstFileExtraTopGap(cfg)
        : 0;
    const rect = anchorEl.getBoundingClientRect();
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
      segmentTextTriggerFrames: resolveSegmentTextTriggerFrames(cfg, idx),
      finalSummaryBulletLines: resolveFinalSummaryBullets(cfg, idx),
      segmentTextMode: resolveSegmentTextMode(cfg, idx),
      settleSnapshotImages: resolveSettleSnapshotImages(cfg, idx),
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
      posterHideCheckRafId: null,
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

    const createAnimationInstance = () => {
      const anim = window.lottie.loadAnimation({
        container: stage,
        renderer: resolveFundalRenderer(cfg, idx),
        loop: false,
        autoplay: false,
        path: cfg.paths[idx],
        rendererSettings: {
          preserveAspectRatio: resolvePreserveAspectRatio(cfg, idx),
          hideOnTransparent: false,
        },
      });
      applyFundalPlaybackRate(anim, cfg, idx);
      return anim;
    };

    const onReady = () => {
      const activeAnim = controller.anim;
      if (!activeAnim) return;
      if (controller.ready) return;
      hideRecoveryOverlay(controller, { immediate: true });
      controller.segments = resolveSegmentsForFile(cfg, idx, activeAnim);
      controller.ready = true;

      const first = controller.segments[0];
      if (first) {
        const forceInitialFrameHold = shouldForceInitialFrameHold(cfg, idx);
        activeAnim.goToAndStop(first.from, true);
        forceSvgVisibleForController(controller);
        if (!forceInitialFrameHold && isStageFrameBlank(controller)) {
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
      const shouldRequirePosterRichContent = IS_IOS_WEBKIT;
      const didHidePoster = maybeHideStagePoster(controller, {
        immediate: true,
        requireRichContent: shouldRequirePosterRichContent,
        minContentAreaRatio: controller.minContentAreaRatio,
      });
      if (!didHidePoster && controller.stage?.dataset?.posterHidden !== "1") {
        scheduleStagePosterHideCheck(controller, {
          requireRichContent: shouldRequirePosterRichContent,
          minContentAreaRatio: controller.minContentAreaRatio,
          checks: shouldRequirePosterRichContent ? 260 : 60,
        });
      }

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
        maybeHideStagePoster(controller, {
          requireRichContent: IS_IOS_WEBKIT,
          minContentAreaRatio: controller.minContentAreaRatio,
        });
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
  const refreshSessionLanguage = async () => {
    await ensureFundalI18nDictionary();

    controllers.forEach((controller) => {
      const fileIndex = Number(controller?.fileIndex);
      if (!Number.isFinite(fileIndex) || fileIndex < 0) return;

      controller.segmentStartTexts = resolveSegmentStartTexts(cfg, fileIndex);
      controller.segmentTextTriggerFrames = resolveSegmentTextTriggerFrames(
        cfg,
        fileIndex,
      );
      controller.finalSummaryBulletLines = resolveFinalSummaryBullets(
        cfg,
        fileIndex,
      );

      const isBulletSummaryVisible = Boolean(
        controller.segmentTextEl?.classList?.contains(
          "childhood-fundal-segment-text--bullet-summary",
        ),
      );
      if (isBulletSummaryVisible) {
        if (controller.finalSummaryBulletLines.length) {
          controller.showFinalSummaryBullets?.();
        } else {
          controller.clearSegmentText?.();
        }
        return;
      }

      controller.clearSegmentText?.();
      const maxIndex = Math.min(
        Number(controller.segmentIndex),
        controller.segmentStartTexts.length - 1,
      );
      if (!Number.isFinite(maxIndex) || maxIndex < 0) return;

      for (let i = 0; i <= maxIndex; i += 1) {
        controller.setSegmentText?.(controller.segmentStartTexts[i]);
      }
    });

    if (shouldSupportReplay) {
      const btn = replayBtn || ensureReplayButton();
      if (btn) btn.textContent = translateFundalText("Replay");
    }
  };
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
        if (shouldUseSnapshotlessExactFrameFallback(controller)) {
          showExactFrameFallbackOverlay(controller, holdFrame, {
            minContentAreaRatio,
            passes: 2,
            attemptsPerPass: attemptsPerTick,
          });
        } else {
          showRecoveryOverlay(controller);
        }
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

  function resolveLatestSettledSegmentIndex(controller) {
    const segmentCount = Array.isArray(controller?.segments)
      ? controller.segments.length
      : 0;
    if (segmentCount <= 0) return -1;

    const resolvedMap = controller?.resolvedFrameBySegment;
    const activeIndex = Number.isFinite(Number(controller?.segmentIndex))
      ? Math.floor(Number(controller.segmentIndex))
      : -1;

    if (
      activeIndex >= 0 &&
      activeIndex < segmentCount &&
      Number.isFinite(Number(resolvedMap?.get?.(activeIndex)))
    ) {
      return activeIndex;
    }

    let latestResolvedIndex = -1;
    resolvedMap?.forEach?.((frame, key) => {
      const safeKey = Number.isFinite(Number(key))
        ? Math.floor(Number(key))
        : -1;
      if (safeKey < 0 || safeKey >= segmentCount) return;
      if (!Number.isFinite(Number(frame))) return;
      latestResolvedIndex = Math.max(latestResolvedIndex, safeKey);
    });

    return latestResolvedIndex;
  }

  function pinControllerToSettledFrame(controller) {
    if (!controller?.ready || !controller.segments.length) return;

    const segIndex = resolveLatestSettledSegmentIndex(controller);
    if (segIndex < 0) return;
    const seg = controller.segments[segIndex];
    if (!seg) return;
    const strictSegmentEndHold = shouldUseExactSegmentTerminalHold(cfg, seg);
    const minContentAreaRatio = resolveRichSettleMinArea(
      cfg,
      controller.fileIndex,
    );

    if (strictSegmentEndHold) {
      const cachedExactFrame = Number(
        controller.resolvedFrameBySegment?.get?.(segIndex),
      );
      const exactFrame = Number.isFinite(cachedExactFrame)
        ? clampFrameToAnimation(controller, cachedExactFrame)
        : resolveTerminalHoldFrameForSegment(seg);
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
          if (shouldUseSnapshotlessExactFrameFallback(controller)) {
            showExactFrameFallbackOverlay(controller, exactFrame, {
              minContentAreaRatio,
            });
          } else {
            showRecoveryOverlay(controller);
          }
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

  function applyReplayButtonTitleOffset(buttonEl) {
    if (!buttonEl) return;
    buttonEl.classList.remove("childhood-fundal-replay-btn--compact-offset");
  }

  function ensureReplayButton() {
    if (!shouldSupportReplay) return null;
    if (replayBtn) {
      applyReplayButtonTitleOffset(replayBtn);
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
      applyReplayButtonTitleOffset(replayBtn);
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
    applyReplayButtonTitleOffset(btn);
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
    clearForwardWheelUnlockTimer();
    forwardWheelLocked = false;
    setMobileTouchLock(true);
    hideAllDownArrows();
    controllers.forEach((controller) => {
      try {
        controller.stopCenterLock?.();
      } catch {}
      cancelStagePosterHideCheck(controller);
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
      lockForwardWheelUntilIdle();
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
  const WHEEL_BURST_IDLE_MS = 320;
  const FORWARD_WHEEL_IDLE_UNLOCK_MS = 280;
  let wheelBurstLocked = false;
  let wheelBurstReleaseTimer = null;
  let forwardWheelLocked = false;
  let forwardWheelUnlockTimer = null;

  const clearWheelBurstReleaseTimer = () => {
    if (!Number.isFinite(Number(wheelBurstReleaseTimer))) return;
    clearTimeout(wheelBurstReleaseTimer);
    wheelBurstReleaseTimer = null;
  };

  const scheduleWheelBurstRelease = () => {
    clearWheelBurstReleaseTimer();
    wheelBurstReleaseTimer = setTimeout(() => {
      wheelBurstLocked = false;
      wheelAccum = 0;
      wheelBurstReleaseTimer = null;
    }, WHEEL_BURST_IDLE_MS);
  };

  const clearForwardWheelUnlockTimer = () => {
    if (!Number.isFinite(Number(forwardWheelUnlockTimer))) return;
    clearTimeout(forwardWheelUnlockTimer);
    forwardWheelUnlockTimer = null;
  };

  const scheduleForwardWheelUnlock = () => {
    clearForwardWheelUnlockTimer();
    forwardWheelUnlockTimer = setTimeout(() => {
      forwardWheelLocked = false;
      forwardWheelUnlockTimer = null;
    }, FORWARD_WHEEL_IDLE_UNLOCK_MS);
  };

  const lockForwardWheelUntilIdle = () => {
    forwardWheelLocked = true;
    scheduleForwardWheelUnlock();
  };

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
    if (instantaneousDir > 0 && forwardWheelLocked) {
      scheduleForwardWheelUnlock();
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    scheduleWheelBurstRelease();
    if (wheelBurstLocked) return;

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
    if (consumed && dir > 0) {
      wheelBurstLocked = true;
      scheduleWheelBurstRelease();
    }
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
    cfg,
    page,
    refreshLanguage: refreshSessionLanguage,
    controllers,
    animations: controllers.map((c) => c.anim),
    observer: null,
    removeInputListeners: () => {
      stopFinalPinLoop();
      stopIosFinalPinKeepAlive();
      stopIosCenterCorrection();
      clearWheelBurstReleaseTimer();
      clearForwardWheelUnlockTimer();
      forwardWheelLocked = false;
      setPlaybackViewportFreeze(false);
      setMobileTouchLock(false);
      removeTitleSegmentTextToggleListeners?.();
      removeTitleSegmentTextToggleListeners = null;
      setSegmentTextsVisibility(true);
      controllers.forEach((c) => {
        try {
          c.stopCenterLock?.();
        } catch {}
        cancelStagePosterHideCheck(c);
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

function initializeStageAutoplayMode(
  routeName,
  cfg,
  page,
  stages,
  entryContext = null,
) {
  const pageContent = document.getElementById("page-content");
  const overscrollRestore = {
    page: page.style.overscrollBehaviorY,
    body: document.body.style.overscrollBehaviorY,
    doc: document.documentElement.style.overscrollBehaviorY,
  };
  const forwardScrollKeys = new Set(["ArrowDown", "PageDown", "End"]);
  const crossPageEntryEdge = String(entryContext?.edge || "")
    .trim()
    .toLowerCase();
  let boundaryInputLockUntil = Number(
    entryContext?.boundaryInputLockUntil || 0,
  );
  const forceStartEntry = crossPageEntryEdge === "start";
  const forceEndEntry = crossPageEntryEdge === "end";
  const shouldRestoreCompletedRoute =
    cfg.disableCompletedRouteRestore === true
      ? false
      : forceEndEntry ||
        (!forceStartEntry &&
          isStoredChildhoodWorkshopRouteComplete(cfg.pageId));

  let routeCompleteDispatched = false;
  let firstStageStartQueued = shouldRestoreCompletedRoute;
  let restoredCompletedRouteState = false;
  let isPlaybackScrollLocked = false;
  let lockedWindowScrollTop = 0;
  let lockedPageContentScrollTop = 0;
  let playbackTouchLastY = null;
  let boundaryTouchLastY = null;

  const getTopbarHeight = () => {
    const topbar = page.querySelector(".eyes-topbar");
    const raw = topbar?.getBoundingClientRect?.().height;
    return Number.isFinite(raw) && raw > 0 ? raw : 56;
  };

  const getScrollHostMetrics = () => {
    const canUsePageContent =
      !!pageContent &&
      (pageContent.scrollHeight || 0) - (pageContent.clientHeight || 0) > 1;

    if (canUsePageContent) {
      const rect = pageContent.getBoundingClientRect();
      return {
        type: "page",
        scrollTop: pageContent.scrollTop || 0,
        viewportHeight: pageContent.clientHeight || window.innerHeight || 0,
        topOffset: rect.top || 0,
      };
    }

    return {
      type: "window",
      scrollTop:
        window.scrollY ??
        document.documentElement?.scrollTop ??
        document.body?.scrollTop ??
        0,
      viewportHeight:
        window.innerHeight || document.documentElement?.clientHeight || 0,
      topOffset: 0,
    };
  };

  const getAbsoluteTopForStage = (stage, metrics = getScrollHostMetrics()) => {
    const rect = stage?.getBoundingClientRect?.();
    if (!rect) return 0;

    if (metrics.type === "page") {
      return metrics.scrollTop + (rect.top - metrics.topOffset);
    }

    return metrics.scrollTop + rect.top;
  };

  const setScrollHostTop = (targetTop, metrics = getScrollHostMetrics()) => {
    const safeTop = Math.max(0, Math.round(Number(targetTop) || 0));

    if (metrics.type === "page" && pageContent) {
      if (typeof pageContent.scrollTo === "function") {
        pageContent.scrollTo({ top: safeTop, behavior: "auto" });
      } else {
        pageContent.scrollTop = safeTop;
      }
      return;
    }

    window.scrollTo({ top: safeTop, behavior: "auto" });
  };

  const states = stages.map((stage, idx) => {
    const segmentTextEl =
      stage.parentElement?.querySelector(".childhood-fundal-segment-text") ||
      null;
    const state = {
      stage,
      anim: null,
      fileIndex: idx,
      arrowEl:
        stage.parentElement?.querySelector(
          ".childhood-fundal-scroll-down-arrow",
        ) || null,
      replayBtn: null,
      segmentTextEl,
      segmentStartTexts: [],
      segmentTextTriggerFrames: [],
      finalSummaryBulletLines: [],
      segmentTextMode: resolveSegmentTextMode(cfg, idx),
      settleSnapshotImages: resolveSettleSnapshotImages(cfg, idx),
      segmentTextLeftAligned: shouldLeftAlignSegmentText(cfg, idx),
      segmentTextBullet: shouldRenderSegmentTextAsBullets(cfg, idx),
      segmentTextLines: [],
      currentTextSegmentIndex: -1,
      segments: [],
      playbackSegments: [],
      ready: false,
      failed: false,
      started: false,
      completed: false,
      playing: false,
      activePauseFrame: null,
      playingSegmentIndex: -1,
      targetEndFrame: null,
      lastRenderedFrame: null,
      lastVisibleFrame: null,
      lastVisibleFrameEver: null,
      lastRichVisibleFrame: null,
      lastRichVisibleFrameEver: null,
      lastPinnedFrame: null,
      loading: false,
      minContentAreaRatio: resolveRichSettleMinArea(cfg, idx),
      requireRichContent: shouldRequireRichSettleContent(cfg, idx),
      animationListeners: null,
    };

    segmentTextEl?.classList.toggle(
      "childhood-fundal-segment-text--left-aligned",
      state.segmentTextLeftAligned === true,
    );

    state.replayBtn = ensureStageReplayButtonElement(stage, state.replayBtn);
    setStageReplayButtonLabel(state.replayBtn, translateFundalText("Replay"));
    state.replayBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      void replayStage(state);
    });

    const arrowEl = ensureControllerDownArrow(state);
    if (arrowEl && arrowEl.dataset.fundalNextBound !== "1") {
      arrowEl.dataset.fundalNextBound = "1";
      arrowEl.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        void handleAdvanceControlClick(state);
      });
    }
    hideStageControls(state);
    clearFundalTextContainer(segmentTextEl);

    return state;
  });

  let lastViewportScrollTop = null;

  function hasNextStage(state) {
    return Number(state?.fileIndex) < states.length - 1;
  }

  function hasPreviousFundalPage() {
    return hasPreviousFundalRoute(routeName);
  }

  function hasNextFundalPage() {
    return hasNextFundalRoute(routeName);
  }

  function shouldShowNextPageAdvanceControl(state) {
    return !hasNextStage(state) && hasNextFundalPage();
  }

  function hasAdvanceControl(state) {
    return hasNextStage(state) || shouldShowNextPageAdvanceControl(state);
  }

  function areAllStagesComplete() {
    return states.length > 0 && states.every((state) => state.completed);
  }

  function resolveStageSummary(state) {
    state.segmentStartTexts = resolveSegmentStartTexts(
      cfg,
      state.fileIndex,
    ).map((line) => normaliseSegmentTextLine(line));
    state.segmentTextTriggerFrames = resolveSegmentTextTriggerFrames(
      cfg,
      state.fileIndex,
    );
    state.finalSummaryBulletLines = resolveFinalSummaryBullets(
      cfg,
      state.fileIndex,
    )
      .map((line) => normaliseSegmentTextLine(line))
      .filter((line) => !!line);
  }

  function setStageSegmentText(state, text) {
    if (!state?.segmentTextEl) return;
    const value = normaliseSegmentTextLine(text);

    if (state.segmentTextMode === "append") {
      if (value && !state.segmentTextLines.includes(value)) {
        state.segmentTextLines.push(value);
      }
    } else if (state.segmentTextMode === "appendinline") {
      if (value) {
        const merged = appendInlineSegmentText(
          state.segmentTextLines[0] || "",
          value,
        );
        state.segmentTextLines = merged ? [merged] : [];
      }
    } else if (state.segmentTextMode === "sticky") {
      state.segmentTextLines = value ? [value] : [];
    } else {
      state.segmentTextLines = value ? [value] : [];
    }

    renderFundalTextLines(state.segmentTextEl, state.segmentTextLines, {
      bullet: state.segmentTextBullet === true,
    });
  }

  function clearStageSegmentText(state) {
    if (!state) return;
    state.segmentTextLines = [];
    state.currentTextSegmentIndex = -1;
    clearFundalTextContainer(state.segmentTextEl);
  }

  function applyStageTextUpToIndex(state, maxIndex) {
    clearStageSegmentText(state);
    if (!Array.isArray(state.segmentStartTexts)) return;

    for (let i = 0; i <= maxIndex; i += 1) {
      const text = state.segmentStartTexts[i];
      setStageSegmentText(state, text);
    }
    state.currentTextSegmentIndex = maxIndex;
  }

  function updateStageTextForFrame(state, frame) {
    if (!state || !Array.isArray(state.segments) || !state.segments.length) {
      return;
    }
    if (
      !Array.isArray(state.segmentStartTexts) ||
      !state.segmentStartTexts.length
    ) {
      return;
    }

    let nextIndex = -1;
    if (Array.isArray(state.segmentTextTriggerFrames)) {
      state.segmentTextTriggerFrames.forEach((triggerFrame, idx) => {
        if (
          Number.isFinite(triggerFrame) &&
          Number(frame) >= Number(triggerFrame)
        ) {
          nextIndex = idx;
        }
      });
    }

    if (nextIndex < 0) {
      state.segments.forEach((segment, idx) => {
        if (isFrameWithinSegment(frame, segment)) {
          nextIndex = idx;
        }
      });
    }

    if (nextIndex < 0) return;
    if (nextIndex === state.currentTextSegmentIndex) return;
    if (
      state.manualSegmentPlayback === true &&
      nextIndex < state.currentTextSegmentIndex
    ) {
      return;
    }

    if (nextIndex < state.currentTextSegmentIndex) {
      applyStageTextUpToIndex(state, nextIndex);
      return;
    }

    for (let i = state.currentTextSegmentIndex + 1; i <= nextIndex; i += 1) {
      const text = state.segmentStartTexts[i];
      setStageSegmentText(state, text);
    }
    state.currentTextSegmentIndex = nextIndex;
  }

  function showStageFinalSummaryBullets(state) {
    if (!state?.segmentTextEl) return;
    if (!state.finalSummaryBulletLines.length) return;
    renderFundalTextLines(state.segmentTextEl, state.finalSummaryBulletLines, {
      bullet: true,
    });
  }

  function showStageCompletionText(state) {
    if (!state?.segmentTextEl) return;
    if (state.finalSummaryBulletLines.length) {
      showStageFinalSummaryBullets(state);
      return;
    }

    if (
      (state.segmentTextMode === "append" ||
        state.segmentTextMode === "appendinline") &&
      Array.isArray(state.segmentStartTexts) &&
      state.segmentStartTexts.length > 0
    ) {
      applyStageTextUpToIndex(state, state.segmentStartTexts.length - 1);
    }
  }

  function restoreTranslatedPlaybackText(state) {
    if (!state) return;
    if (state.finalSummaryBulletLines.length && state.completed) {
      showStageFinalSummaryBullets(state);
      return;
    }

    if (state.currentTextSegmentIndex >= 0) {
      applyStageTextUpToIndex(state, state.currentTextSegmentIndex);
      return;
    }

    clearStageSegmentText(state);
  }

  function hideStageControls(state) {
    if (!state) return;
    const replayBtn = ensureStageReplayButtonElement(
      state.stage,
      state.replayBtn,
    );
    if (replayBtn) {
      replayBtn.style.display = "none";
    }
    const arrowEl = ensureControllerDownArrow(state);
    if (arrowEl) {
      setStageAdvanceControlAppearance(
        arrowEl,
        "stage",
        translateFundalText("Next animation") || "Next animation",
      );
      arrowEl.classList.remove("is-visible");
      arrowEl.disabled = true;
    }
  }

  function hideStageDownArrow(state) {
    if (!state) return;
    const arrowEl = ensureControllerDownArrow(state);
    if (!arrowEl) return;
    arrowEl.classList.remove("is-visible");
  }

  function hideAllStageDownArrows() {
    states.forEach((state) => {
      hideStageDownArrow(state);
    });
  }

  function showStageControls(state) {
    if (!state) return;
    const replayBtn = ensureStageReplayButtonElement(
      state.stage,
      state.replayBtn,
    );
    if (replayBtn) {
      setStageReplayButtonLabel(replayBtn, translateFundalText("Replay"));
      replayBtn.style.display = "inline-flex";
      replayBtn.style.alignItems = "center";
      replayBtn.style.justifyContent = "center";
    }
    const arrowEl = ensureControllerDownArrow(state);
    if (arrowEl) {
      const showAdvance = hasAdvanceControl(state);
      if (shouldShowNextPageAdvanceControl(state)) {
        setStageAdvanceControlAppearance(
          arrowEl,
          "page",
          translateFundalText("Next page") || "Next page",
        );
      } else {
        setStageAdvanceControlAppearance(
          arrowEl,
          "stage",
          translateFundalText("Next animation") || "Next animation",
        );
      }
      arrowEl.disabled = !showAdvance;
      arrowEl.classList.toggle("is-visible", showAdvance);
    }
    updateStageControlAnchors(state);
  }

  function reinforceStageAdvanceControl(state, passes = 10) {
    if (!state || !hasAdvanceControl(state)) return;
    let remaining = Math.max(
      1,
      Math.min(
        24,
        Number.isFinite(Number(passes)) ? Math.floor(Number(passes)) : 10,
      ),
    );

    const tick = () => {
      if (!state || state.playing || !state.completed) return;
      const arrowEl = ensureControllerDownArrow(state);
      if (!arrowEl) return;
      arrowEl.disabled = false;
      arrowEl.classList.add("is-visible");
      updateStageControlAnchors(state);
      remaining -= 1;
      if (remaining <= 0) return;
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  function hideCompletedOffCenterDownArrows() {
    states.forEach((state) => {
      if (!state?.completed || !hasAdvanceControl(state)) return;
      if (shouldShowNextPageAdvanceControl(state)) return;
      const nextState = states[Number(state.fileIndex) + 1];
      if (nextState && !nextState.started) return;
      const arrowEl = ensureControllerDownArrow(state);
      if (!arrowEl?.classList?.contains("is-visible")) return;
      if (isStateNearViewportCenter(state)) return;
      hideStageDownArrow(state);
    });
  }

  function updateStageControlAnchors(state) {
    const arrowEl = ensureControllerDownArrow(state);
    const replayBtn = ensureStageReplayButtonElement(
      state.stage,
      state.replayBtn,
    );
    const stage = state?.stage;

    if (!stage) return;

    const anchorParagraphIndex = resolveAdvanceArrowAnchorParagraph(
      cfg,
      state.fileIndex,
    );
    if (arrowEl && anchorParagraphIndex != null) {
      const item = stage.parentElement;
      const paragraphEls = item?.querySelectorAll?.(
        ".childhood-fundal-segment-text__paragraph",
      );
      const anchorEl = paragraphEls?.[anchorParagraphIndex - 1];
      const itemRect = item?.getBoundingClientRect?.();
      const anchorRect = anchorEl?.getBoundingClientRect?.();
      if (
        itemRect &&
        anchorRect &&
        itemRect.height > 0.5 &&
        anchorRect.height > 0.5
      ) {
        arrowEl.style.top = `${Math.round(anchorRect.bottom - itemRect.top + 12)}px`;
      } else {
        arrowEl.style.removeProperty("top");
      }
    } else {
      arrowEl?.style.removeProperty("top");
    }

    if (!isDesktopViewport()) {
      arrowEl?.style.removeProperty("--fundal-arrow-right");
      arrowEl?.style.removeProperty("--fundal-arrow-bottom");
      replayBtn?.style.removeProperty("--fundal-replay-left");
      replayBtn?.style.removeProperty("--fundal-replay-right");
      replayBtn?.style.removeProperty("--fundal-replay-bottom");
      return;
    }

    const renderEl =
      getControllerRenderElement(state) || stage.querySelector("canvas");
    const stageRect = stage.getBoundingClientRect?.();
    const renderRect = renderEl?.getBoundingClientRect?.();
    if (
      !stageRect ||
      !renderRect ||
      stageRect.width <= 0.5 ||
      renderRect.width <= 0.5
    ) {
      return;
    }

    let rightInset = 10;
    let bottomInset = 10;

    if (
      isWideDesktopViewport() &&
      String(renderEl?.tagName || "").toUpperCase() === "SVG"
    ) {
      const vb = renderEl.viewBox?.baseVal;
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
        const renderHeight = vbHeight * scale;
        const renderWidth = vbWidth * scale;
        const gutterX = Math.max(0, (stageRect.width - renderWidth) / 2);
        const gutterY = Math.max(0, (stageRect.height - renderHeight) / 2);
        rightInset = Math.max(10, Math.round(gutterX + 10));
        bottomInset = Math.max(10, Math.round(gutterY + 10));
      }
    } else {
      rightInset = Math.max(
        10,
        Math.round(stageRect.right - renderRect.right + 10),
      );
      bottomInset = Math.max(
        10,
        Math.round(stageRect.bottom - renderRect.bottom + 10),
      );
    }

    arrowEl?.style.setProperty("--fundal-arrow-right", `${rightInset}px`);
    arrowEl?.style.setProperty("--fundal-arrow-bottom", `${bottomInset}px`);
    replayBtn?.style.setProperty("--fundal-replay-right", `${rightInset}px`);
    replayBtn?.style.setProperty("--fundal-replay-bottom", `${bottomInset}px`);
  }

  function updateAllStageControlAnchors() {
    states.forEach((state) => updateStageControlAnchors(state));
  }

  function restoreCompletedStageState(state) {
    if (!state?.ready || state.failed) return;

    state.started = true;
    state.completed = true;
    state.playing = false;
    clearStageSegmentText(state);

    const holdFrame = resolveCompletionHoldFrame(state);
    updateStageTextForFrame(state, holdFrame);
    if (state.finalSummaryBulletLines.length) {
      showStageFinalSummaryBullets(state);
    }

    const shouldRequirePosterRichContent = IS_IOS_WEBKIT;
    const didHidePoster = maybeHideStagePoster(state, {
      immediate: true,
      requireRichContent: shouldRequirePosterRichContent,
      minContentAreaRatio: state.minContentAreaRatio,
    });
    if (!didHidePoster && state.stage?.dataset?.posterHidden !== "1") {
      scheduleStagePosterHideCheck(state, {
        requireRichContent: shouldRequirePosterRichContent,
        minContentAreaRatio: state.minContentAreaRatio,
        checks: shouldRequirePosterRichContent ? 260 : 60,
      });
    }

    requestIosStageRepaintNudge(state.stage);
    showStageControls(state);
  }

  function maybeRestoreCompletedRouteState() {
    if (!shouldRestoreCompletedRoute || restoredCompletedRouteState) return;

    const allStatesReady = states.every((state) => state.ready || state.failed);
    if (!allStatesReady) return;

    restoredCompletedRouteState = true;
    routeCompleteDispatched = true;
    setPlaybackScrollLocked(false);

    states.forEach((state) => {
      restoreCompletedStageState(state);
    });

    if (forceEndEntry) {
      scrollToLastStageEntry();
    } else {
      scrollToFirstStageStart();
    }
    updateAllStageControlAnchors();
    requestAnimationFrame(() => {
      updateAllStageControlAnchors();
      hideCompletedOffCenterDownArrows();
    });
  }

  function getCenteredScrollTopForStage(
    stage,
    metrics = getScrollHostMetrics(),
  ) {
    const rect = stage.getBoundingClientRect();
    const absoluteTop = getAbsoluteTopForStage(stage, metrics);
    const vh = metrics.viewportHeight || 0;
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
        centerTopBias += (currentHeight - firstHeight) / 2;
      }
      centerTopBias -= 24;
    }

    return Math.max(
      0,
      stageCenterAbs - effectiveViewportCenter - centerTopBias,
    );
  }

  function centerStageForPlayback(stage) {
    const metrics = getScrollHostMetrics();
    const targetTop = getCenteredScrollTopForStage(stage, metrics);
    if (Math.abs(targetTop - metrics.scrollTop) <= 1) return;
    setScrollHostTop(targetTop, metrics);
  }

  function getFirstStageStartScrollTop(metrics = getScrollHostMetrics()) {
    const firstStage = stages[0];
    if (!firstStage) return 0;

    const anchorEl = resolveFirstStageAnchorElement(firstStage, cfg);
    const topbarHeight = getTopbarHeight();
    const extraTopGap =
      anchorEl === firstStage
        ? shouldUseMobileStageTopAlignedMode(cfg)
          ? 0
          : resolveFirstFileExtraTopGap(cfg)
        : 0;
    const absoluteTop = getAbsoluteTopForStage(anchorEl, metrics);
    return Math.max(0, absoluteTop - topbarHeight - extraTopGap);
  }

  function scrollToFirstStageStart() {
    const metrics = getScrollHostMetrics();
    const targetTop = getFirstStageStartScrollTop(metrics);
    setScrollHostTop(targetTop, metrics);
  }

  function scrollToLastStageEntry() {
    const lastState = states[states.length - 1];
    if (!lastState?.stage) return;
    centerStageForPlayback(lastState.stage);
  }

  function alignStageForPlayback(state) {
    if (!state?.stage) return;
    if (state.fileIndex === 0) {
      scrollToFirstStageStart();
      return;
    }
    centerStageForPlayback(state.stage);
  }

  function alignStageForMobileAdvanceFallback(state) {
    if (isDesktopViewport() || !state?.stage) return false;
    const metrics = getScrollHostMetrics();
    const absoluteTop = getAbsoluteTopForStage(state.stage, metrics);
    setScrollHostTop(absoluteTop - getTopbarHeight() - 8, metrics);
    return true;
  }

  function scrollToNextStage(state) {
    if (
      !state ||
      state.playing ||
      states.some((candidate) => candidate.playing)
    )
      return;

    const nextState = hasNextStage(state) ? states[state.fileIndex + 1] : null;
    if (!nextState?.stage) return;

    hideStageDownArrow(state);
    ensureStageAnimationLoaded(nextState);
    alignStageForPlayback(nextState);

    const alignAndStartWhenReady = () => {
      alignStageForPlayback(nextState);
      let usedMobileFallback = false;
      if (!isStateNearViewportCenter(nextState)) {
        usedMobileFallback = alignStageForMobileAdvanceFallback(nextState);
      }
      updateAllStageControlAnchors();
      if (
        nextState.ready &&
        !nextState.started &&
        !states.some((candidate) => candidate.playing) &&
        isStateNearViewportCenter(nextState)
      ) {
        void playStage(nextState, { skipAlign: usedMobileFallback });
        return;
      }
      maybeStartEligibleStage();
    };

    requestAnimationFrame(() => {
      alignAndStartWhenReady();
    });
    window.setTimeout(alignAndStartWhenReady, 180);
  }

  async function handleAdvanceControlClick(state) {
    if (!state) return;
    if (hasNextStage(state)) {
      scrollToNextStage(state);
      return;
    }
    if (!shouldShowNextPageAdvanceControl(state)) return;
    await navigateAdjacentFundalPage(routeName, 1);
  }

  function handleDelegatedAdvanceControlClick(event) {
    const button = event?.target?.closest?.("[data-fundal-stage-next-btn='1']");
    if (!button || !page.contains(button)) return;
    const item = button.closest(".childhood-fundal-prep-item");
    const fileIndex = Number(item?.dataset?.fileIndex);
    if (!Number.isInteger(fileIndex)) return;
    const state = states[fileIndex];
    if (!state) return;
    event.preventDefault();
    event.stopPropagation();
    void handleAdvanceControlClick(state);
  }

  function rememberLockedScrollPosition() {
    lockedWindowScrollTop =
      window.scrollY ??
      document.documentElement?.scrollTop ??
      document.body?.scrollTop ??
      0;
    lockedPageContentScrollTop = pageContent?.scrollTop || 0;
  }

  function syncLockedViewport() {
    if (!isPlaybackScrollLocked) return;

    const currentWindowScrollTop =
      window.scrollY ??
      document.documentElement?.scrollTop ??
      document.body?.scrollTop ??
      0;

    if (currentWindowScrollTop > lockedWindowScrollTop + 1) {
      window.scrollTo({ top: lockedWindowScrollTop, behavior: "auto" });
    }

    if (
      pageContent &&
      (pageContent.scrollTop || 0) > lockedPageContentScrollTop + 1
    ) {
      pageContent.scrollTop = lockedPageContentScrollTop;
    }
  }

  function getPlaybackLockedScrollTop(metrics = getScrollHostMetrics()) {
    if (metrics.type === "page") {
      return Math.max(0, Number(lockedPageContentScrollTop) || 0);
    }
    return Math.max(0, Number(lockedWindowScrollTop) || 0);
  }

  function hasReachedPlaybackLowerBound(metrics = getScrollHostMetrics()) {
    if (!isPlaybackScrollLocked) return false;
    const currentTop = Math.max(0, Number(metrics?.scrollTop) || 0);
    return currentTop >= getPlaybackLockedScrollTop(metrics) - 1;
  }

  function rememberPlaybackTouchPoint(event) {
    if (!event?.touches || event.touches.length !== 1) {
      playbackTouchLastY = null;
      return;
    }
    const nextY = Number(event.touches[0]?.clientY);
    playbackTouchLastY = Number.isFinite(nextY) ? nextY : null;
  }

  function clearPlaybackTouchPoint() {
    playbackTouchLastY = null;
  }

  function resolvePlaybackTouchDirection(event) {
    const currentY = Number(event?.touches?.[0]?.clientY);
    if (!Number.isFinite(currentY)) return 0;
    const previousY = playbackTouchLastY;
    playbackTouchLastY = currentY;
    if (!Number.isFinite(previousY)) return 0;
    if (Math.abs(currentY - previousY) < 0.5) return 0;
    // Finger moving up scrolls the content down toward the next animation.
    return currentY < previousY ? 1 : -1;
  }

  function isForwardPlaybackScrollEvent(event) {
    if (!event) return false;
    if (event.type === "wheel") {
      const deltaY = Number(event.deltaY);
      return Number.isFinite(deltaY) && deltaY > 0;
    }
    if (event.type === "touchmove") {
      return resolvePlaybackTouchDirection(event) > 0;
    }
    return false;
  }

  function rememberBoundaryTouchPoint(event) {
    if (!event?.touches || event.touches.length !== 1) {
      boundaryTouchLastY = null;
      return;
    }
    const nextY = Number(event.touches[0]?.clientY);
    boundaryTouchLastY = Number.isFinite(nextY) ? nextY : null;
  }

  function clearBoundaryTouchPoint() {
    boundaryTouchLastY = null;
  }

  function resolveBoundaryTouchDirection(event) {
    const currentY = Number(event?.touches?.[0]?.clientY);
    if (!Number.isFinite(currentY)) return 0;
    const previousY = boundaryTouchLastY;
    boundaryTouchLastY = currentY;
    if (!Number.isFinite(previousY)) return 0;
    if (Math.abs(currentY - previousY) < 0.5) return 0;
    return currentY < previousY ? 1 : -1;
  }

  function resolveBoundaryKeyDirection(event) {
    const key = String(event?.key || "");
    const isSpaceBackward =
      (key === " " || key === "Spacebar") && event.shiftKey === true;
    const isSpaceForward =
      (key === " " || key === "Spacebar") && event.shiftKey !== true;
    if (key === "ArrowUp" || key === "PageUp" || key === "Home") return -1;
    if (isSpaceBackward) return -1;
    if (
      key === "ArrowDown" ||
      key === "PageDown" ||
      key === "End" ||
      isSpaceForward
    ) {
      return 1;
    }
    return 0;
  }

  function isAtFirstStageBoundary(metrics = getScrollHostMetrics()) {
    const threshold = 10;
    return (
      metrics.scrollTop <= getFirstStageStartScrollTop(metrics) + threshold
    );
  }

  function isAdvanceControlFullyVisibleInViewport(
    state,
    metrics = getScrollHostMetrics(),
  ) {
    if (!state) return false;
    const arrowEl = ensureControllerDownArrow(state);
    const rect = arrowEl?.getBoundingClientRect?.();
    if (
      !rect ||
      arrowEl.disabled ||
      !arrowEl.classList.contains("is-visible")
    ) {
      return false;
    }

    const viewportTop = metrics.type === "page" ? metrics.topOffset : 0;
    const viewportBottom = viewportTop + (metrics.viewportHeight || 0);
    return rect.top >= viewportTop + 8 && rect.bottom <= viewportBottom - 8;
  }

  function isAtLastStageBoundary(metrics = getScrollHostMetrics()) {
    const lastState = states[states.length - 1];
    if (!lastState?.stage) return false;
    const threshold = 18;
    return (
      metrics.scrollTop >=
      getCenteredScrollTopForStage(lastState.stage, metrics) - threshold
    );
  }

  function hasReachedScrollHostLowerBoundary(metrics = getScrollHostMetrics()) {
    if (metrics.type === "page" && pageContent) {
      return (
        Number(pageContent.scrollTop || 0) +
          Number(pageContent.clientHeight || 0) >=
        Number(pageContent.scrollHeight || 0) - 2
      );
    }

    const doc = document.documentElement;
    const body = document.body;
    const scrollHeight = Math.max(
      Number(doc?.scrollHeight || 0),
      Number(body?.scrollHeight || 0),
    );
    return (
      Number(metrics.scrollTop || 0) + Number(metrics.viewportHeight || 0) >=
      scrollHeight - 2
    );
  }

  function maybeNavigateAcrossFundalPages(direction, event) {
    if (fundalPageNavigationInFlight) return false;
    if (Date.now() < boundaryInputLockUntil) return false;
    if (direction < 0) {
      if (!hasPreviousFundalPage()) return false;
      const firstState = states[0];
      if (!firstState?.ready) return false;
      if (!isAtFirstStageBoundary()) return false;
      event?.preventDefault?.();
      event?.stopPropagation?.();
      void navigateAdjacentFundalPage(routeName, -1);
      return true;
    }

    if (direction > 0) {
      if (!hasNextFundalPage()) return false;
      const lastState = states[states.length - 1];
      if (!lastState?.ready || !lastState.completed || lastState.playing) {
        return false;
      }
      const metrics = getScrollHostMetrics();
      const pageAdvanceVisible =
        shouldShowNextPageAdvanceControl(lastState) &&
        isAdvanceControlFullyVisibleInViewport(lastState, metrics);

      if (shouldShowNextPageAdvanceControl(lastState)) {
        if (!pageAdvanceVisible) return false;
        if (!hasReachedScrollHostLowerBoundary(metrics)) return false;
      } else if (!isAtLastStageBoundary(metrics)) {
        return false;
      }

      event?.preventDefault?.();
      event?.stopPropagation?.();
      void navigateAdjacentFundalPage(routeName, 1);
      return true;
    }

    return false;
  }

  function handleBoundaryWheel(event) {
    const deltaY = Number(event?.deltaY);
    if (!Number.isFinite(deltaY) || Math.abs(deltaY) < 0.5) return;
    maybeNavigateAcrossFundalPages(deltaY > 0 ? 1 : -1, event);
  }

  function handleBoundaryTouchMove(event) {
    const direction = resolveBoundaryTouchDirection(event);
    if (!direction) return;
    maybeNavigateAcrossFundalPages(direction, event);
  }

  function handleBoundaryKeyDown(event) {
    const direction = resolveBoundaryKeyDirection(event);
    if (!direction) return;
    maybeNavigateAcrossFundalPages(direction, event);
  }

  function preventPlaybackScroll(event) {
    if (!isPlaybackScrollLocked) return;
    if (!isForwardPlaybackScrollEvent(event)) return;
    const metrics = getScrollHostMetrics();
    const lockedTop = getPlaybackLockedScrollTop(metrics);
    const currentTop = Math.max(0, Number(metrics?.scrollTop) || 0);

    if (event.type === "wheel") {
      const deltaY = Number(event.deltaY);
      if (Number.isFinite(deltaY) && deltaY > 0 && currentTop < lockedTop - 1) {
        event.preventDefault();
        setScrollHostTop(Math.min(lockedTop, currentTop + deltaY), metrics);
        return;
      }
    }

    if (!hasReachedPlaybackLowerBound(metrics)) return;
    event.preventDefault();
    syncLockedViewport();
  }

  function preventPlaybackScrollKeys(event) {
    if (!isPlaybackScrollLocked) return;
    const key = event.key || "";
    const isSpaceForward =
      (key === " " || key === "Spacebar") && event.shiftKey !== true;
    if (!isSpaceForward && !forwardScrollKeys.has(key)) return;
    if (!hasReachedPlaybackLowerBound()) return;
    event.preventDefault();
  }

  function setPlaybackScrollLocked(locked) {
    if (isPlaybackScrollLocked === locked) return;
    isPlaybackScrollLocked = locked;

    if (locked) {
      rememberLockedScrollPosition();
      clearPlaybackTouchPoint();
      page.style.overscrollBehaviorY = "none";
      document.body.style.overscrollBehaviorY = "none";
      document.documentElement.style.overscrollBehaviorY = "none";
      window.addEventListener("touchstart", rememberPlaybackTouchPoint, {
        passive: true,
      });
      pageContent?.addEventListener("touchstart", rememberPlaybackTouchPoint, {
        passive: true,
      });
      window.addEventListener("wheel", preventPlaybackScroll, {
        passive: false,
      });
      pageContent?.addEventListener("wheel", preventPlaybackScroll, {
        passive: false,
      });
      window.addEventListener("touchmove", preventPlaybackScroll, {
        passive: false,
      });
      pageContent?.addEventListener("touchmove", preventPlaybackScroll, {
        passive: false,
      });
      window.addEventListener("touchend", clearPlaybackTouchPoint, {
        passive: true,
      });
      pageContent?.addEventListener("touchend", clearPlaybackTouchPoint, {
        passive: true,
      });
      window.addEventListener("touchcancel", clearPlaybackTouchPoint, {
        passive: true,
      });
      pageContent?.addEventListener("touchcancel", clearPlaybackTouchPoint, {
        passive: true,
      });
      window.addEventListener("keydown", preventPlaybackScrollKeys);
      window.addEventListener("scroll", syncLockedViewport, { passive: true });
      pageContent?.addEventListener("scroll", syncLockedViewport, {
        passive: true,
      });
      return;
    }

    clearPlaybackTouchPoint();
    window.removeEventListener("touchstart", rememberPlaybackTouchPoint);
    pageContent?.removeEventListener("touchstart", rememberPlaybackTouchPoint);
    window.removeEventListener("wheel", preventPlaybackScroll);
    pageContent?.removeEventListener("wheel", preventPlaybackScroll);
    window.removeEventListener("touchmove", preventPlaybackScroll);
    pageContent?.removeEventListener("touchmove", preventPlaybackScroll);
    window.removeEventListener("touchend", clearPlaybackTouchPoint);
    pageContent?.removeEventListener("touchend", clearPlaybackTouchPoint);
    window.removeEventListener("touchcancel", clearPlaybackTouchPoint);
    pageContent?.removeEventListener("touchcancel", clearPlaybackTouchPoint);
    window.removeEventListener("keydown", preventPlaybackScrollKeys);
    window.removeEventListener("scroll", syncLockedViewport);
    pageContent?.removeEventListener("scroll", syncLockedViewport);
    page.style.overscrollBehaviorY = overscrollRestore.page;
    document.body.style.overscrollBehaviorY = overscrollRestore.body;
    document.documentElement.style.overscrollBehaviorY = overscrollRestore.doc;
  }

  function isStateNearViewportCenter(state) {
    const rect = state?.stage?.getBoundingClientRect?.();
    const viewportHeight =
      window.innerHeight || document.documentElement?.clientHeight || 0;
    if (!rect || rect.height <= 0.5 || viewportHeight <= 0) return false;
    if (rect.bottom <= 0 || rect.top >= viewportHeight) return false;

    const viewportCenter = viewportHeight / 2;
    const stageCenter = rect.top + rect.height / 2;
    const centerBand = Math.max(90, Math.min(220, viewportHeight * 0.22));
    return Math.abs(stageCenter - viewportCenter) <= centerBand;
  }

  function getNextAutoplayCandidate() {
    for (let i = 0; i < states.length; i += 1) {
      const state = states[i];
      if (state.failed || state.started) continue;
      if (i > 0 && !states[i - 1]?.completed) return null;
      return state;
    }
    return null;
  }

  function resolvePreferredCompletionVisibleFrame(state, terminalSegment) {
    if (
      !state ||
      !terminalSegment ||
      !shouldPreferLastVisibleCompletionFrame(cfg, state.fileIndex)
    ) {
      return null;
    }

    const candidates = [
      state.lastRichVisibleFrameEver,
      state.lastVisibleFrameEver,
      state.lastRichVisibleFrame,
      state.lastVisibleFrame,
    ];

    for (let i = 0; i < candidates.length; i += 1) {
      const candidate = Number(candidates[i]);
      if (!Number.isFinite(candidate)) continue;
      if (!isFrameWithinSegment(candidate, terminalSegment)) continue;
      return clampFrameToAnimation(state, candidate);
    }

    return null;
  }

  function resolveCompletionHoldFrame(state) {
    const lastFrame = getAnimationLastFrame(state?.anim);
    const configuredHoldFrame = resolveConfiguredCompletionHoldFrame(
      cfg,
      state?.fileIndex,
    );
    const terminalPlaybackSegment = Array.isArray(state?.playbackSegments)
      ? state.playbackSegments[state.playbackSegments.length - 1]
      : null;
    const resolveCompletionFallbackFrame = (preferredFrame, options = {}) => {
      if (terminalPlaybackSegment) {
        return resolveVisibleFrameInsideSegment(
          state,
          terminalPlaybackSegment,
          preferredFrame,
          options,
        );
      }
      return resolveAnyVisibleFrame(state, preferredFrame, options);
    };
    const preferredVisibleFrame = resolvePreferredCompletionVisibleFrame(
      state,
      terminalPlaybackSegment,
    );
    let holdFrame = clampFrameToAnimation(
      state,
      configuredHoldFrame ??
        preferredVisibleFrame ??
        (terminalPlaybackSegment
          ? getSegmentEndFrame(terminalPlaybackSegment)
          : lastFrame),
    );
    try {
      state.anim?.goToAndStop(holdFrame, true);
    } catch {
      // Ignore renderer seek failures and fall back to visible-frame recovery.
    }
    forceSvgVisibleForController(state);

    const isExactFrameVisible = !isStageFrameBlank(state);
    const hasRichFrame =
      !state.requireRichContent ||
      hasRichVisibleContent(state, state.minContentAreaRatio);
    if (
      isExactFrameVisible &&
      (hasRichFrame || shouldUseStrictFrameLockNoFallback(cfg))
    ) {
      rememberRecoverySnapshot(state, holdFrame);
      return holdFrame;
    }

    if (configuredHoldFrame != null) {
      if (shouldUseSnapshotlessExactFrameFallback(state)) {
        showExactFrameFallbackOverlay(state, holdFrame, {
          minContentAreaRatio: state.minContentAreaRatio,
        });
      } else {
        showRecoveryOverlay(state);
      }
      return holdFrame;
    }

    const recoveredFrame = resolveCompletionFallbackFrame(holdFrame, {
      requireRichContent: state.requireRichContent === true,
      minContentAreaRatio: state.minContentAreaRatio,
    });
    holdFrame = clampFrameToAnimation(state, recoveredFrame);
    try {
      state.anim?.goToAndStop(holdFrame, true);
    } catch {
      // Ignore renderer seek failures and keep the recovered candidate flow.
    }
    forceSvgVisibleForController(state);
    if (
      isStageFrameBlank(state) ||
      (state.requireRichContent === true &&
        !hasRichVisibleContent(state, state.minContentAreaRatio))
    ) {
      const visibleFallbackFrame = resolveCompletionFallbackFrame(holdFrame);
      holdFrame = clampFrameToAnimation(state, visibleFallbackFrame);
      try {
        state.anim?.goToAndStop(holdFrame, true);
      } catch {
        // Keep the richer recovery candidate if the fallback seek also fails.
      }
      forceSvgVisibleForController(state);
    }
    rememberRecoverySnapshot(state, holdFrame);
    return holdFrame;
  }

  function isRouteCompletionSatisfied(completedState = null) {
    if (areAllStagesComplete()) return true;
    const completedIndex = Number(completedState?.fileIndex);
    return (
      Number.isFinite(completedIndex) &&
      completedIndex === states.length - 1 &&
      completedState?.completed === true
    );
  }

  function dispatchRouteCompleteOnce(completedState = null) {
    if (routeCompleteDispatched || !isRouteCompletionSatisfied(completedState))
      return;
    routeCompleteDispatched = true;
    document.dispatchEvent(
      new CustomEvent("childhoodWorkshop:route-complete", {
        detail: { target: cfg.pageId },
      }),
    );
  }

  async function reinforceExactCompletionHoldFrame(state, frame) {
    const safeFrame = clampFrameToAnimation(state, Number(frame));

    for (let attempt = 0; attempt < 4; attempt += 1) {
      hideRecoveryOverlay(state, { immediate: true });
      try {
        state.anim?.pause?.();
        state.anim?.goToAndStop?.(safeFrame, true);
      } catch {
        // Keep retrying below; the renderer can reject a seek while settling.
      }
      forceSvgVisibleForController(state);
      updateStageTextForFrame(state, safeFrame);
      refreshVisibleFrameState(state);
      requestIosStageRepaintNudge(state.stage);
      await waitForFundalE2ERenderStability(1);

      if (!isStageFrameBlank(state)) {
        rememberRecoverySnapshot(state, safeFrame);
        hideRecoveryOverlay(state, { immediate: true });
        return safeFrame;
      }
    }

    hideRecoveryOverlay(state, { immediate: true });
    return safeFrame;
  }

  async function finishStagePlayback(state) {
    state.playing = false;
    setPlaybackScrollLocked(false);

    const shouldPreserveSnapshot = shouldPreserveCompletionSnapshotOverlay(
      cfg,
      state.fileIndex,
    );
    if (shouldPreserveSnapshot) {
      const currentFrame = clampFrameToAnimation(
        state,
        Math.floor(Number(state.anim?.currentFrame || 0)),
      );
      rememberRecoverySnapshot(state, currentFrame);
      state.anim?.pause?.();
      const snapshotImage = resolveCompletionSnapshotImage(
        cfg,
        state.fileIndex,
      );
      if (snapshotImage) {
        showRecoveryImageOverlay(state, snapshotImage);
      } else {
        if (shouldUseSnapshotlessExactFrameFallback(state)) {
          showExactFrameFallbackOverlay(state, currentFrame, {
            minContentAreaRatio: state.minContentAreaRatio,
          });
        } else {
          showRecoveryOverlay(state);
        }
      }
      state.lastPinnedFrame = currentFrame;
    } else {
      state.lastPinnedFrame = resolveCompletionHoldFrame(state);
      const configuredHoldFrame = resolveConfiguredCompletionHoldFrame(
        cfg,
        state.fileIndex,
      );
      if (
        configuredHoldFrame != null &&
        shouldForceExactCompletionHoldFrame(cfg, state.fileIndex)
      ) {
        state.lastPinnedFrame = await reinforceExactCompletionHoldFrame(
          state,
          configuredHoldFrame,
        );
      } else {
        hideRecoveryOverlayWhenStable(state, {
          checks: 2,
          requiredStablePasses: 1,
        });
      }
    }
    const shouldRequirePosterRichContent = IS_IOS_WEBKIT;
    const didHidePoster = maybeHideStagePoster(state, {
      immediate: true,
      requireRichContent: shouldRequirePosterRichContent,
      minContentAreaRatio: state.minContentAreaRatio,
    });
    if (!didHidePoster && state.stage?.dataset?.posterHidden !== "1") {
      scheduleStagePosterHideCheck(state, {
        requireRichContent: shouldRequirePosterRichContent,
        minContentAreaRatio: state.minContentAreaRatio,
        checks: shouldRequirePosterRichContent ? 260 : 60,
      });
    }

    requestIosStageRepaintNudge(state.stage);
    if (!state.completed) {
      state.completed = true;
    }
    showStageCompletionText(state);
    showStageControls(state);
    reinforceStageAdvanceControl(state, IS_IOS_WEBKIT ? 18 : 12);
    dispatchRouteCompleteOnce(state);

    requestAnimationFrame(() => {
      maybeStartEligibleStage();
    });
  }

  function refreshVisibleFrameState(state) {
    const activeAnim = state?.anim;
    if (!activeAnim) return null;

    if (state.stage?.dataset?.posterHidden !== "1") {
      maybeHideStagePoster(state, {
        requireRichContent: IS_IOS_WEBKIT,
        minContentAreaRatio: state.minContentAreaRatio,
      });
    }

    const current = Math.floor(Number(activeAnim.currentFrame));
    if (!Number.isFinite(current)) return null;

    state.lastRenderedFrame = clampFrameToAnimation(state, current);
    if (isStageFrameBlank(state)) return state.lastRenderedFrame;

    state.lastVisibleFrame = state.lastRenderedFrame;
    state.lastVisibleFrameEver = state.lastRenderedFrame;
    if (hasRichVisibleContent(state, state.minContentAreaRatio)) {
      state.lastRichVisibleFrame = state.lastRenderedFrame;
      state.lastRichVisibleFrameEver = state.lastRenderedFrame;
    }
    return state.lastRenderedFrame;
  }

  function prepareInitialFrame(state) {
    const startFrame = resolveConfiguredAutoplayStartFrame(
      cfg,
      state.fileIndex,
    );
    try {
      state.anim?.goToAndStop(startFrame, true);
    } catch {
      // Some renderers can reject an eager first-frame seek before settling.
    }
    forceSvgVisibleForController(state);

    if (isStageFrameBlank(state)) {
      const recoveredFrame = resolveAnyVisibleFrame(state, startFrame);
      try {
        state.anim?.goToAndStop(recoveredFrame, true);
      } catch {
        // If this also fails, the poster fallback remains in place.
      }
      forceSvgVisibleForController(state);
    }

    if (!isStageFrameBlank(state)) {
      const currentFrame = clampFrameToAnimation(
        state,
        Math.floor(Number(state.anim?.currentFrame || 0)),
      );
      state.lastVisibleFrame = currentFrame;
      state.lastVisibleFrameEver = currentFrame;
      if (hasRichVisibleContent(state, state.minContentAreaRatio)) {
        state.lastRichVisibleFrame = currentFrame;
        state.lastRichVisibleFrameEver = currentFrame;
      }
      state.lastPinnedFrame = currentFrame;
    }

    const shouldRequirePosterRichContent = IS_IOS_WEBKIT;
    const didHidePoster = maybeHideStagePoster(state, {
      immediate: true,
      requireRichContent: shouldRequirePosterRichContent,
      minContentAreaRatio: state.minContentAreaRatio,
    });
    if (!didHidePoster && state.stage?.dataset?.posterHidden !== "1") {
      scheduleStagePosterHideCheck(state, {
        requireRichContent: shouldRequirePosterRichContent,
        minContentAreaRatio: state.minContentAreaRatio,
        checks: shouldRequirePosterRichContent ? 260 : 60,
      });
    }
  }

  function clearFutureStageRecoverySnapshot(state, maxFrame, segmentIndex) {
    if (!state) return;
    const storedFrame = Number(state.recoverySnapshotFrame);
    const storedSegment = Number(state.recoverySnapshotSegmentIndex);
    if (
      (Number.isFinite(storedFrame) && storedFrame > Number(maxFrame) + 1) ||
      (Number.isFinite(storedSegment) && storedSegment > Number(segmentIndex))
    ) {
      state.recoverySnapshotMarkup = "";
      state.recoverySnapshotCanvasDataUrl = "";
      state.recoverySnapshotFrame = null;
      state.recoverySnapshotSegmentIndex = -1;
    }
  }

  function rememberStagePlaybackSnapshotNearEnd(
    state,
    currentFrame,
    targetFrame,
    segmentIndex,
  ) {
    const frame = Number(currentFrame);
    const target = Number(targetFrame);
    if (!Number.isFinite(frame) || !Number.isFinite(target)) return;
    if (frame > target + 0.75) return;

    const backoff = Math.max(3, Math.min(18, Math.floor(target * 0.04)));
    if (frame < target - backoff) return;
    if (isStageFrameBlank(state)) return;

    state.playingSegmentIndex = segmentIndex;
    if (rememberRecoverySnapshot(state, frame)) {
      state.recoverySnapshotSegmentIndex = segmentIndex;
    }
  }

  function pinStageAutoplayFrame(state, frame, options = {}) {
    const safeFrame = clampFrameToAnimation(state, Number(frame));
    const minContentAreaRatio = Number.isFinite(
      Number(options.minContentAreaRatio),
    )
      ? Math.max(0.01, Number(options.minContentAreaRatio))
      : state.minContentAreaRatio;
    const attempts = Number.isFinite(Number(options.attempts))
      ? Math.floor(Number(options.attempts))
      : IS_IOS_WEBKIT
        ? 6
        : 3;

    const pinned = pinExactFrameWithRecovery(state, safeFrame, {
      attempts,
      minContentAreaRatio,
      allowFrameShift: false,
    });
    forceSvgVisibleForController(state);
    updateStageTextForFrame(state, safeFrame);
    refreshVisibleFrameState(state);

    if (
      !pinned.isBlank &&
      (shouldUseStrictFrameLockNoFallback(cfg) ||
        !isPinnedFrameUnstable(state, {
          requireRichContent: state.requireRichContent === true,
          minContentAreaRatio,
        }))
    ) {
      rememberRecoverySnapshot(state, safeFrame);
      hideRecoveryOverlayWhenStable(state, {
        checks: IS_IOS_WEBKIT ? 4 : 2,
        requiredStablePasses: 1,
      });
      return { frame: safeFrame, isBlank: false };
    }

    if (shouldUseSnapshotlessExactFrameFallback(state)) {
      showExactFrameFallbackOverlay(state, safeFrame, {
        minContentAreaRatio,
      });
    } else {
      showRecoveryOverlay(state);
    }
    return { frame: safeFrame, isBlank: true };
  }

  function playStageSegmentOnce(state, pair, segmentIndex = 0, options = {}) {
    return new Promise((resolve) => {
      const anim = state?.anim;
      if (!anim) {
        resolve(false);
        return;
      }

      let settled = false;
      const shouldPinOnFinish = options?.pinOnFinish !== false;
      const safeFrom = clampFrameToAnimation(state, Number(pair?.[0]));
      const safeTo = clampFrameToAnimation(state, Number(pair?.[1]));
      clearFutureStageRecoverySnapshot(state, safeTo, segmentIndex);
      state.playingSegmentIndex = segmentIndex;
      state.targetEndFrame = safeTo;
      if (safeFrom === safeTo) {
        if (shouldPinOnFinish) {
          pinStageAutoplayFrame(state, safeFrom, {
            attempts: IS_IOS_WEBKIT ? 6 : 3,
          });
        } else {
          anim.goToAndStop?.(safeFrom, true);
          forceSvgVisibleForController(state);
          updateStageTextForFrame(state, safeFrom);
          refreshVisibleFrameState(state);
        }
        resolve(true);
        return;
      }

      const frameDistance = Math.max(1, Math.abs(safeTo - safeFrom));
      const playbackRate = Math.max(
        0.1,
        resolveFundalE2EPlaybackRate() ??
          resolveConfiguredSegmentPlaybackRate(
            cfg,
            state.fileIndex,
            segmentIndex,
          ) ??
          resolveConfiguredFundalPlaybackRate(cfg, state.fileIndex),
      );
      const timeoutMs = Math.max(
        2500,
        Math.min(45000, (frameDistance / 29.97 / playbackRate) * 1000 + 5000),
      );

      const finish = (value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        try {
          anim.removeEventListener("complete", onComplete);
        } catch {
          // Ignore cleanup failures from renderer teardown.
        }
        try {
          anim.removeEventListener("enterFrame", onEnterFrame);
        } catch {
          // Ignore cleanup failures from renderer teardown.
        }
        try {
          anim.pause?.();
        } catch {}
        if (shouldPinOnFinish) {
          pinStageAutoplayFrame(state, safeTo, {
            attempts: IS_IOS_WEBKIT ? 6 : 3,
          });
        } else {
          try {
            anim.goToAndStop?.(safeTo, true);
          } catch {
            // Keep the last rendered frame if an intermediate seek fails.
          }
          forceSvgVisibleForController(state);
          updateStageTextForFrame(state, safeTo);
          refreshVisibleFrameState(state);
        }
        resolve(value);
      };

      const onComplete = () => finish(true);
      const onEnterFrame = () => {
        const currentFrame = refreshVisibleFrameState(state);
        if (Number.isFinite(Number(currentFrame))) {
          updateStageTextForFrame(state, currentFrame);
          rememberStagePlaybackSnapshotNearEnd(
            state,
            currentFrame,
            safeTo,
            segmentIndex,
          );
        }
        if (Number(currentFrame) >= safeTo - 0.25) {
          finish(true);
        }
      };
      const timeoutId = setTimeout(() => finish(false), timeoutMs);

      try {
        if (typeof anim.setSpeed === "function") {
          anim.setSpeed(playbackRate);
        }
        anim.addEventListener("complete", onComplete);
        anim.addEventListener("enterFrame", onEnterFrame);
        anim.pause?.();
        anim.goToAndStop(safeFrom, true);
        forceSvgVisibleForController(state);
        updateStageTextForFrame(state, safeFrom);
        anim.playSegments([safeFrom, safeTo], true);
      } catch {
        finish(false);
      }
    });
  }

  async function holdStageAtPauseFrame(state, frame) {
    const safeFrame = clampFrameToAnimation(state, Number(frame));
    state.activePauseFrame = safeFrame;
    pinStageAutoplayFrame(state, safeFrame, {
      attempts: IS_IOS_WEBKIT ? 8 : 4,
    });
    requestIosStageRepaintNudge(state.stage);

    if (shouldUseSnapshotlessExactFrameFallback(state)) {
      showExactFrameFallbackOverlay(state, safeFrame, {
        minContentAreaRatio: state.minContentAreaRatio,
      });
      return safeFrame;
    }

    await waitForFundalE2ERenderStability(2);

    pinStageAutoplayFrame(state, safeFrame, {
      attempts: IS_IOS_WEBKIT ? 8 : 4,
    });
    requestIosStageRepaintNudge(state.stage);

    if (!isStageFrameBlank(state)) {
      rememberRecoverySnapshot(state, safeFrame);
      hideRecoveryOverlayWhenStable(state, {
        checks: 2,
        requiredStablePasses: 1,
      });
      return safeFrame;
    }

    showRecoveryOverlay(state);
    return safeFrame;
  }

  async function playStageSegmentsWithPauses(state, playbackPairs) {
    state.manualSegmentPlayback = true;
    try {
      for (let i = 0; i < playbackPairs.length; i += 1) {
        if (!state.playing) return false;
        const pair = playbackPairs[i];
        const pauseMs = resolveSegmentPauseAfterMs(cfg, state.fileIndex, i);
        const shouldPauseAfterSegment =
          pauseMs > 0 && i < playbackPairs.length - 1;
        const shouldPinOnFinish =
          i === playbackPairs.length - 1 || shouldPauseAfterSegment;
        hideRecoveryOverlay(state, { immediate: true });
        updateStageTextForFrame(state, pair[0]);
        await playStageSegmentOnce(state, pair, i, {
          pinOnFinish: shouldPinOnFinish,
        });

        if (shouldPauseAfterSegment) {
          await holdStageAtPauseFrame(state, pair[1]);
          await waitFundalDelay(pauseMs);
          state.activePauseFrame = null;
          updateStageTextForFrame(state, pair[1]);
          hideRecoveryOverlayWhenStable(state, {
            checks: 2,
            requiredStablePasses: 1,
          });
        }
      }
    } finally {
      state.manualSegmentPlayback = false;
      state.activePauseFrame = null;
      state.playingSegmentIndex = -1;
      state.targetEndFrame = null;
      applyFundalPlaybackRate(state.anim, cfg, state.fileIndex);
    }

    const finalPair = playbackPairs[playbackPairs.length - 1] || null;
    if (finalPair) {
      updateStageTextForFrame(state, finalPair[1]);
    }
    await finishStagePlayback(state);
    return true;
  }

  async function playStage(state, { replay = false, skipAlign = false } = {}) {
    if (!state?.ready || state.failed || state.playing) return false;
    if (states.some((candidate) => candidate.playing)) return false;
    if (!replay && state.started) return false;
    if (
      !replay &&
      state.fileIndex > 0 &&
      !states[state.fileIndex - 1]?.completed
    ) {
      return false;
    }

    state.started = true;
    state.playing = true;
    ensureAdjacentStageAnimationLoaded(state);
    hideAllStageDownArrows();
    hideRecoveryOverlay(state, { immediate: true });
    clearStageSegmentText(state);
    hideStageControls(state);
    if (!skipAlign) {
      alignStageForPlayback(state);
    }
    setPlaybackScrollLocked(true);

    const playbackSegments =
      Array.isArray(state.playbackSegments) && state.playbackSegments.length > 0
        ? state.playbackSegments
        : resolveAutoplayPlaybackSegments(cfg, state.fileIndex, state.anim);
    const firstPlaybackSegment = playbackSegments[0] || null;
    const startFrame = clampFrameToAnimation(
      state,
      Number(firstPlaybackSegment?.from),
    );
    const endFrame = getSegmentEndFrame(
      playbackSegments[playbackSegments.length - 1],
    );
    if (endFrame <= 0) {
      await finishStagePlayback(state);
      return true;
    }

    const playbackPairs = playbackSegments.map((segment) => [
      clampFrameToAnimation(state, Number(segment?.from)),
      clampFrameToAnimation(state, getSegmentEndFrame(segment)),
    ]);

    const shouldPlayWithPauses = hasConfiguredSegmentPause(
      cfg,
      state.fileIndex,
      playbackPairs.length,
    );
    const shouldPlayWithSegmentRates = hasConfiguredSegmentPlaybackRate(
      cfg,
      state.fileIndex,
      playbackPairs.length,
    );

    try {
      state.anim?.pause();
      state.anim?.goToAndStop(startFrame, true);
      if (shouldPlayWithPauses || shouldPlayWithSegmentRates) {
        void playStageSegmentsWithPauses(state, playbackPairs);
      } else if (playbackPairs.length > 1) {
        state.anim?.playSegments(playbackPairs, true);
      } else {
        state.anim?.playSegments(
          playbackPairs[0] || [startFrame, endFrame],
          true,
        );
      }
    } catch {
      try {
        state.anim?.goToAndPlay(startFrame, true);
      } catch {
        // Leave the stage idle if both playback strategies fail.
      }
    }
    forceSvgVisibleForController(state);
    updateStageTextForFrame(state, startFrame);
    updateStageControlAnchors(state);
    return true;
  }

  async function replayStage(state) {
    if (!state || state.playing || !state.ready) return;
    await playStage(state, { replay: true });
  }

  function maybeStartEligibleStage() {
    if (shouldDisableFundalE2EAutoplay()) return;
    if (states.some((state) => state.playing)) return;

    const nextState = getNextAutoplayCandidate();
    if (!nextState) {
      dispatchRouteCompleteOnce();
      return;
    }

    if (nextState.fileIndex === 0) {
      if (!firstStageStartQueued && nextState.ready) {
        firstStageStartQueued = true;
        void playStage(nextState);
      }
      return;
    }

    if (!nextState.ready) {
      ensureStageAnimationLoaded(nextState);
      return;
    }
    if (!isStateNearViewportCenter(nextState)) return;
    void playStage(nextState);
  }

  function onViewportChange() {
    const metrics = getScrollHostMetrics();
    const currentScrollTop = Number(metrics?.scrollTop || 0);
    const isScrollingDown =
      Number.isFinite(lastViewportScrollTop) &&
      currentScrollTop > lastViewportScrollTop + 6;
    lastViewportScrollTop = currentScrollTop;

    if (isScrollingDown) {
      hideCompletedOffCenterDownArrows();
    }
    updateAllStageControlAnchors();
    maybeStartEligibleStage();
  }

  async function refreshLanguage() {
    await ensureFundalI18nDictionary();
    states.forEach((state) => {
      resolveStageSummary(state);
      const replayBtn = ensureStageReplayButtonElement(
        state.stage,
        state.replayBtn,
      );
      if (replayBtn) {
        setStageReplayButtonLabel(replayBtn, translateFundalText("Replay"));
      }
      const arrowEl = ensureControllerDownArrow(state);
      if (arrowEl) {
        if (shouldShowNextPageAdvanceControl(state)) {
          setStageAdvanceControlAppearance(
            arrowEl,
            "page",
            translateFundalText("Next page") || "Next page",
          );
        } else {
          setStageAdvanceControlAppearance(
            arrowEl,
            "stage",
            translateFundalText("Next animation") || "Next animation",
          );
        }
      }
      restoreTranslatedPlaybackText(state);
    });
  }

  function ensureStageAnimationLoaded(state) {
    if (!state || state.anim || state.loading) return;
    resolveStageSummary(state);
    state.loading = true;

    const anim = window.lottie.loadAnimation({
      container: state.stage,
      renderer: resolveFundalRenderer(cfg, state.fileIndex),
      loop: false,
      autoplay: false,
      path: cfg.paths[state.fileIndex],
      rendererSettings: {
        preserveAspectRatio: resolvePreserveAspectRatio(cfg, state.fileIndex),
        hideOnTransparent: false,
      },
    });
    applyFundalPlaybackRate(anim, cfg, state.fileIndex);
    state.anim = anim;

    const onReady = () => {
      state.loading = false;
      state.segments = resolveSegmentsForFile(cfg, state.fileIndex, anim);
      state.playbackSegments = resolveAutoplayPlaybackSegments(
        cfg,
        state.fileIndex,
        anim,
        state.segments,
      );
      state.ready = true;
      prepareInitialFrame(state);
      updateStageControlAnchors(state);
      if (shouldRestoreCompletedRoute) {
        maybeRestoreCompletedRouteState();
        return;
      }
      if (state.fileIndex === 0 && !firstStageStartQueued) {
        requestAnimationFrame(() => {
          scrollToFirstStageStart();
          maybeStartEligibleStage();
        });
      } else {
        requestAnimationFrame(() => {
          maybeStartEligibleStage();
        });
      }
    };

    const onDataFailed = () => {
      state.loading = false;
      state.failed = true;
      console.error(
        "[fundalScroll] animation data failed:",
        cfg.paths[state.fileIndex],
      );
    };

    const onEnterFrame = () => {
      if (
        state.activePauseFrame != null &&
        Number.isFinite(Number(state.activePauseFrame))
      ) {
        const pauseFrame = clampFrameToAnimation(
          state,
          Number(state.activePauseFrame),
        );
        const currentFrame = Number(state.anim?.currentFrame);
        try {
          state.anim?.pause?.();
          if (
            !Number.isFinite(currentFrame) ||
            Math.abs(currentFrame - pauseFrame) > 0.75
          ) {
            state.anim?.goToAndStop?.(pauseFrame, true);
          }
        } catch {
          // Keep the previous rendered frame if the renderer rejects the lock.
        }
        forceSvgVisibleForController(state);
        refreshVisibleFrameState(state);
        updateStageTextForFrame(state, pauseFrame);
        updateStageControlAnchors(state);
        return;
      }

      const currentFrame = refreshVisibleFrameState(state);
      if (state.playing && Number.isFinite(currentFrame)) {
        updateStageTextForFrame(state, currentFrame);
      }
      updateStageControlAnchors(state);
    };

    const onComplete = () => {
      if (state.manualSegmentPlayback === true) return;
      void finishStagePlayback(state);
    };

    anim.addEventListener("DOMLoaded", onReady);
    anim.addEventListener("data_failed", onDataFailed);
    anim.addEventListener("enterFrame", onEnterFrame);
    anim.addEventListener("complete", onComplete);

    state.animationListeners = {
      onReady,
      onDataFailed,
      onEnterFrame,
      onComplete,
    };
  }

  function ensureAdjacentStageAnimationLoaded(state) {
    if (!shouldLazyLoadStageAnimations(cfg)) return;
    const nextState = states[Number(state?.fileIndex) + 1];
    if (nextState) ensureStageAnimationLoaded(nextState);
  }

  if (shouldRestoreCompletedRoute) {
    states.forEach((state) => ensureStageAnimationLoaded(state));
  } else if (shouldLazyLoadStageAnimations(cfg)) {
    const initialStageCount = Math.max(
      1,
      Math.min(
        states.length,
        Number.isFinite(Number(cfg.lazyInitialStageCount))
          ? Math.floor(Number(cfg.lazyInitialStageCount))
          : 2,
      ),
    );
    for (let idx = 0; idx < initialStageCount; idx += 1) {
      ensureStageAnimationLoaded(states[idx]);
    }
  } else {
    states.forEach((state) => ensureStageAnimationLoaded(state));
  }

  function serializeFundalE2EStageState(state) {
    if (!state) return null;

    const renderEl = getControllerRenderElement(state);
    const tagName = String(renderEl?.tagName || "").toLowerCase();
    const renderRect = renderEl?.getBoundingClientRect?.();

    return {
      routeName,
      fileIndex: Number(state.fileIndex),
      ready: state.ready === true,
      failed: state.failed === true,
      started: state.started === true,
      completed: state.completed === true,
      playing: state.playing === true,
      posterHidden: state.stage?.dataset?.posterHidden === "1",
      renderType: tagName || "missing",
      hasSvg: tagName === "svg",
      hasCanvas: tagName === "canvas",
      currentFrame: clampFrameToAnimation(
        state,
        Math.floor(Number(state.anim?.currentFrame || 0)),
      ),
      renderWidth: Number.isFinite(Number(renderRect?.width))
        ? Number(renderRect.width)
        : 0,
      renderHeight: Number.isFinite(Number(renderRect?.height))
        ? Number(renderRect.height)
        : 0,
      playbackSegments: Array.isArray(state.playbackSegments)
        ? state.playbackSegments.map((segment) => ({
            from: Number(segment?.from),
            to: getSegmentEndFrame(segment),
          }))
        : [],
      playbackSegmentRates: Array.isArray(state.playbackSegments)
        ? state.playbackSegments.map(
            (_segment, segmentIndex) =>
              resolveConfiguredSegmentPlaybackRate(
                cfg,
                state.fileIndex,
                segmentIndex,
              ) ?? resolveConfiguredFundalPlaybackRate(cfg, state.fileIndex),
          )
        : [],
      recoveryOverlayVisible: (() => {
        const overlay = state.stage?.querySelector(
          ".childhood-fundal-recovery-overlay",
        );
        return (
          !!overlay &&
          overlay.style.visibility !== "hidden" &&
          overlay.style.opacity !== "0"
        );
      })(),
      recoveryOverlayImageSrc:
        state.stage
          ?.querySelector(".childhood-fundal-recovery-overlay img")
          ?.getAttribute("src") || "",
      recoverySnapshotFrame: Number.isFinite(
        Number(state.recoverySnapshotFrame),
      )
        ? Number(state.recoverySnapshotFrame)
        : null,
      replayVisible:
        ensureStageReplayButtonElement(state.stage, state.replayBtn)?.style
          ?.display !== "none",
    };
  }

  async function seekFundalE2EStage(stageIndex, frame, options = {}) {
    const state = states[Number(stageIndex)];
    if (!state) {
      return {
        routeName,
        fileIndex: Number(stageIndex),
        ready: false,
        failed: true,
        reason: "missing-stage",
      };
    }

    if (!state.ready || !state.anim) {
      return {
        ...serializeFundalE2EStageState(state),
        reason: "not-ready",
      };
    }

    const safeFrame = clampFrameToAnimation(state, Number(frame));
    const requireRichContent =
      options?.requireRichContent == null
        ? IS_IOS_WEBKIT
        : options.requireRichContent === true;

    try {
      state.anim.pause?.();
      state.anim.goToAndStop(safeFrame, true);
    } catch {
      return {
        ...serializeFundalE2EStageState(state),
        reason: "seek-failed",
      };
    }

    hideRecoveryOverlay(state, { immediate: true });
    hideStageControls(state);
    forceSvgVisibleForController(state);
    maybeHideStagePoster(state, {
      immediate: true,
      requireRichContent,
      minContentAreaRatio: state.minContentAreaRatio,
    });
    refreshVisibleFrameState(state);
    updateStageTextForFrame(state, safeFrame);
    updateStageControlAnchors(state);
    requestIosStageRepaintNudge(state.stage);

    await waitForFundalE2ERenderStability(3);

    forceSvgVisibleForController(state);
    maybeHideStagePoster(state, {
      immediate: true,
      requireRichContent,
      minContentAreaRatio: state.minContentAreaRatio,
    });
    refreshVisibleFrameState(state);
    updateStageTextForFrame(state, safeFrame);
    updateStageControlAnchors(state);
    requestIosStageRepaintNudge(state.stage);

    await waitForFundalE2ERenderStability(2);

    return serializeFundalE2EStageState(state);
  }

  registerFundalE2ESession(routeName, {
    getStageState: (stageIndex) =>
      serializeFundalE2EStageState(states[Number(stageIndex)]),
    seekStage: (stageIndex, frame, options) =>
      seekFundalE2EStage(stageIndex, frame, options),
    loadStage: (stageIndex) => {
      const state = states[Number(stageIndex)];
      if (!state || state.failed) return serializeFundalE2EStageState(state);
      ensureStageAnimationLoaded(state);
      return serializeFundalE2EStageState(state);
    },
    showExactFrameFallback: (stageIndex, frame) => {
      const state = states[Number(stageIndex)];
      if (!state?.ready || !state.anim) return null;
      const safeFrame = showExactFrameFallbackOverlay(state, frame, {
        minContentAreaRatio: state.minContentAreaRatio,
      });
      updateStageTextForFrame(state, safeFrame);
      updateStageControlAnchors(state);
      return serializeFundalE2EStageState(state);
    },
  });

  cleanupLegacyTopbarReplay(page);
  page.addEventListener("click", handleDelegatedAdvanceControlClick);
  window.addEventListener("touchstart", rememberBoundaryTouchPoint, {
    passive: true,
  });
  pageContent?.addEventListener("touchstart", rememberBoundaryTouchPoint, {
    passive: true,
  });
  window.addEventListener("touchend", clearBoundaryTouchPoint, {
    passive: true,
  });
  pageContent?.addEventListener("touchend", clearBoundaryTouchPoint, {
    passive: true,
  });
  window.addEventListener("touchcancel", clearBoundaryTouchPoint, {
    passive: true,
  });
  pageContent?.addEventListener("touchcancel", clearBoundaryTouchPoint, {
    passive: true,
  });
  window.addEventListener("wheel", handleBoundaryWheel, { passive: false });
  pageContent?.addEventListener("wheel", handleBoundaryWheel, {
    passive: false,
  });
  window.addEventListener("touchmove", handleBoundaryTouchMove, {
    passive: false,
  });
  pageContent?.addEventListener("touchmove", handleBoundaryTouchMove, {
    passive: false,
  });
  window.addEventListener("keydown", handleBoundaryKeyDown);
  window.addEventListener("scroll", onViewportChange, { passive: true });
  pageContent?.addEventListener("scroll", onViewportChange, { passive: true });
  window.addEventListener("resize", onViewportChange, { passive: true });
  window.addEventListener("pageshow", onViewportChange, { passive: true });
  window.addEventListener("orientationchange", onViewportChange, {
    passive: true,
  });

  return {
    routeName,
    refreshLanguage,
    controllers: states,
    animations: states.map((state) => state.anim).filter((anim) => !!anim),
    observer: null,
    removeInputListeners: () => {
      setPlaybackScrollLocked(false);
      clearBoundaryTouchPoint();
      window.removeEventListener("touchstart", rememberBoundaryTouchPoint);
      pageContent?.removeEventListener(
        "touchstart",
        rememberBoundaryTouchPoint,
      );
      window.removeEventListener("touchend", clearBoundaryTouchPoint);
      pageContent?.removeEventListener("touchend", clearBoundaryTouchPoint);
      window.removeEventListener("touchcancel", clearBoundaryTouchPoint);
      pageContent?.removeEventListener("touchcancel", clearBoundaryTouchPoint);
      window.removeEventListener("wheel", handleBoundaryWheel);
      pageContent?.removeEventListener("wheel", handleBoundaryWheel);
      window.removeEventListener("touchmove", handleBoundaryTouchMove);
      pageContent?.removeEventListener("touchmove", handleBoundaryTouchMove);
      window.removeEventListener("keydown", handleBoundaryKeyDown);
      window.removeEventListener("scroll", onViewportChange);
      pageContent?.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("pageshow", onViewportChange);
      window.removeEventListener("orientationchange", onViewportChange);
      page.removeEventListener("click", handleDelegatedAdvanceControlClick);
      states.forEach((state) => {
        cancelStagePosterHideCheck(state);
        cancelArrowEnsure(state);
        hideRecoveryOverlay(state, { immediate: true });
        hideStageControls(state);
        try {
          state.anim?.removeEventListener(
            "DOMLoaded",
            state.animationListeners?.onReady,
          );
          state.anim?.removeEventListener(
            "data_failed",
            state.animationListeners?.onDataFailed,
          );
          state.anim?.removeEventListener(
            "enterFrame",
            state.animationListeners?.onEnterFrame,
          );
          state.anim?.removeEventListener(
            "complete",
            state.animationListeners?.onComplete,
          );
        } catch {
          // Ignore listener cleanup failures during route teardown.
        }
        state.animationListeners = null;
      });
      cleanupLegacyTopbarReplay(page);
    },
  };
}

function resolveFundalRouteConfig(routeName) {
  const baseCfg = ROUTE_CONFIG[routeName];
  if (!baseCfg) return null;
  return resolveRuntimeRouteConfig(routeName, baseCfg);
}

export function prewarmChildhoodFundalRouteAssets(
  routeNames = [],
  options = {},
) {
  const rawList = Array.isArray(routeNames)
    ? routeNames
    : [String(routeNames || "").trim()];
  const filtered = rawList
    .map((name) => String(name || "").trim())
    .filter((name) => !!name);
  const targets = filtered.length ? filtered : Object.keys(ROUTE_CONFIG);
  const mode = String(options?.mode || "idle")
    .trim()
    .toLowerCase();
  const warmupMode = mode === "route" ? "route" : "idle";
  const shouldLoadLottie = options?.loadLottie !== false;

  targets.forEach((routeName) => {
    const cfg = resolveFundalRouteConfig(routeName);
    if (!cfg) return;
    warmupFundalRouteAssets(cfg, { mode: warmupMode });
  });

  if (shouldLoadLottie) {
    void ensureLottie();
  }
}

export async function initializeChildhoodFundalReflexScrollPage(routeName) {
  const cfg = resolveFundalRouteConfig(routeName);
  if (!cfg) return;
  const pendingEntry = consumePendingFundalPageEntry(routeName);

  const page = document.getElementById(cfg.pageId);
  if (!page) return;
  wireFundalInlineNavigation(page);
  page.classList.toggle(
    "childhood-fundal-scroll-page--has-next-page",
    hasNextFundalRoute(routeName),
  );

  cleanupActiveSession();

  const listEl = page.querySelector(".childhood-fundal-prep-list");
  const stages = buildAnimationSlots(listEl, cfg.label, cfg.paths.length, cfg);
  if (!stages.length) return;
  window.I18N?.applyTranslations?.(page);
  warmupFundalRouteAssets(cfg, { mode: "route" });
  const firstDataPath = String(cfg.paths?.[0] || "").trim();
  const firstStageImageWarmupPromise =
    firstDataPath && cfg.skipRouteImageWarmup !== true
      ? primeFundalLottieImageAssets(firstDataPath, {
          rel: "preload",
          fetchPriority: "high",
          warmup: true,
          warmCount: IS_IOS_WEBKIT ? 8 : 6,
          awaitWarmup: true,
          timeoutMs: IS_IOS_WEBKIT ? 1200 : 800,
        }).catch(() => 0)
      : Promise.resolve(0);

  await new Promise((resolve) => {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => resolve());
      return;
    }
    setTimeout(resolve, 0);
  });

  const i18nReadyPromise = ensureFundalI18nDictionary().catch((err) => {
    console.error("[fundalScroll] dictionary preload failed", err);
  });
  const lottieReadyPromise = ensureLottie();

  const [isLottieReady] = await Promise.all([
    lottieReadyPromise,
    firstStageImageWarmupPromise,
  ]);
  if (!isLottieReady) {
    console.error("[fundalScroll] lottie is not available");
    return;
  }

  if (cfg.playMode === "stageAutoplay") {
    await i18nReadyPromise;
    activeSession = initializeStageAutoplayMode(
      routeName,
      cfg,
      page,
      stages,
      pendingEntry,
    );
    return;
  }

  if (cfg.playMode === "segmentScroll") {
    activeSession = initializeSegmentScrollMode(cfg, page, stages);
    void i18nReadyPromise.then(() => refreshActiveFundalLanguageSession());
    return;
  }

  await i18nReadyPromise;

  const animations = stages.map((stage, idx) => {
    const anim = window.lottie.loadAnimation({
      container: stage,
      renderer: resolveFundalRenderer(cfg, idx),
      loop: true,
      autoplay: false,
      path: cfg.paths[idx],
      rendererSettings: {
        preserveAspectRatio: resolvePreserveAspectRatio(cfg, idx),
        hideOnTransparent: false,
      },
    });
    applyFundalPlaybackRate(anim, cfg, idx);
    return anim;
  });

  const observer = createViewportController(stages, animations);
  activeSession = { routeName, observer, animations };
}

if (!window.__fundalScrollCleanupWired) {
  window.__fundalScrollCleanupWired = true;
  window.addEventListener("page:loaded", (e) => {
    const routeName = e?.detail?.routeName || "";
    if (!ROUTE_CONFIG[routeName]) cleanupActiveSession();
  });
}
