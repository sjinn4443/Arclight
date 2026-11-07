import { a as Tr } from "./chunk-XB5IK5RI.js";
import {
  a as vr,
  d as Sr,
  g as xr,
  h as wr,
  i as Ar,
  j as Er,
  k as Hn,
  m as Rr,
} from "./chunk-KNLC6FEO.js";
import { c as Nr } from "./chunk-KKOYVSFI.js";
import { s as Ot } from "./chunk-C3DWFWW5.js";
import "./chunk-P2HPNKQY.js";
import { a as br, b as lt, c as Fr } from "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
var Qt = "/vendor/lottie.min.js",
  Pa = "img_0.png",
  Ia = !1,
  Cr = new Set(),
  qn = new Map(),
  Dn = new Map(),
  Wr = "videoNarration:",
  yn = "videoNarrationLanguage:",
  jr = Object.freeze({
    ha: Object.freeze({
      label: "Hausa",
      src: "/narration/fundal-reflex/full-animation/ha.m4a",
    }),
    yo: Object.freeze({
      label: "Yor\xF9b\xE1",
      src: "/narration/fundal-reflex/full-animation/yo.m4a",
    }),
    ig: Object.freeze({
      label: "Igbo",
      src: "/narration/fundal-reflex/full-animation/ig.m4a",
    }),
    ne: Object.freeze({
      label: "\u0928\u0947\u092A\u093E\u0932\u0940",
      src: "/narration/fundal-reflex/full-animation/ne.m4a",
    }),
    fr: Object.freeze({
      label: "Fran\xE7ais",
      src: "/narration/fundal-reflex/full-animation/fr.m4a",
    }),
    lg: Object.freeze({
      label: "Luganda",
      src: "/narration/fundal-reflex/full-animation/lg.m4a",
    }),
    en: Object.freeze({
      label: "English",
      src: "/narration/fundal-reflex/full-animation/en.m4a",
    }),
    "es-419": Object.freeze({
      label: "Espa\xF1ol (Latinoam\xE9rica)",
      src: "/narration/fundal-reflex/full-animation/es-419.m4a",
    }),
    ko: Object.freeze({
      label: "\uD55C\uAD6D\uC5B4",
      src: "/narration/fundal-reflex/full-animation/ko.m4a",
    }),
  }),
  La = Object.freeze([
    Object.freeze({ start: 4.2, end: 9.2, cueIds: ["preparation-01"] }),
    Object.freeze({ start: 9.2, end: 19.2, cueIds: ["preparation-02"] }),
    Object.freeze({
      start: 19.2,
      end: 35.2,
      cueIds: ["preparation-03a", "preparation-03b"],
    }),
    Object.freeze({
      start: 36.2,
      end: 52.2,
      cueIds: ["preparation-04a", "preparation-04b", "preparation-04c"],
    }),
    Object.freeze({ start: 55.8, end: 59.8, cueIds: ["examination-01"] }),
    Object.freeze({ start: 60.4, end: 71.4, cueIds: ["examination-02"] }),
    Object.freeze({ start: 71.4, end: 87.4, cueIds: ["examination-03"] }),
    Object.freeze({ start: 87.4, end: 99.4, cueIds: ["examination-04"] }),
    Object.freeze({
      start: 99.4,
      end: 114.35,
      cueIds: ["examination-05a", "examination-05b"],
    }),
    Object.freeze({ start: 118.4, end: 129.4, cueIds: ["eyes-open-01"] }),
    Object.freeze({ start: 129.4, end: 144.4, cueIds: ["eyes-open-02"] }),
    Object.freeze({ start: 180, end: 192, cueIds: ["possible-findings-01"] }),
    Object.freeze({
      start: 150,
      end: 158.2,
      cueIds: ["eyes-closed-01", "eyes-closed-02"],
    }),
    Object.freeze({ start: 158.2, end: 170.4, cueIds: ["eyes-closed-03"] }),
    Object.freeze({
      start: 211.35,
      end: 220.35,
      cueIds: ["unclear-findings-01"],
    }),
    Object.freeze({
      start: 220.35,
      end: 230.35,
      cueIds: ["unclear-findings-02"],
    }),
    Object.freeze({
      start: 230.35,
      end: 237.35,
      cueIds: ["unclear-findings-03"],
    }),
    Object.freeze({
      start: 237.35,
      end: 260.35,
      cueIds: [
        "unclear-findings-04",
        "unclear-findings-05a",
        "unclear-findings-05b",
      ],
    }),
    Object.freeze({ start: 175.2, end: 180, cueIds: ["possible-findings-02"] }),
    Object.freeze({
      start: 180,
      end: 207,
      cueIds: ["possible-findings-01", "possible-findings-03"],
    }),
    Object.freeze({
      start: 264.3,
      end: 268.3,
      cueIds: ["after-examination-01"],
    }),
    Object.freeze({
      start: 268.3,
      end: 274.27,
      cueIds: ["after-examination-02"],
    }),
  ]);
function rr(e) {
  return Object.freeze(
    Object.fromEntries(
      Object.entries(jr).map(([n, r]) => [
        n,
        Object.freeze({
          label: r.label,
          src: `/narration/${e}/full-animation/${n}.m4a`,
        }),
      ]),
    ),
  );
}
var ka = rr("direct-ophthalmoscopy"),
  Ba = rr("binocular-indirect-ophthalmoscopy"),
  Ma = Object.freeze(
    [
      { start: 3.2, end: 7.2, cueIds: ["observation-01"] },
      { start: 7.2, end: 14, cueIds: ["observation-02"] },
      { start: 14, end: 24.4, cueIds: ["observation-03"] },
      {
        start: 25,
        end: 40.5,
        cueIds: ["observation-04a", "observation-04b", "observation-04c"],
      },
      { start: 43.8, end: 55.2, cueIds: ["observation-05", "observation-06"] },
      { start: 57, end: 68.3, cueIds: ["positioning-01"] },
      { start: 71, end: 81.2, cueIds: ["positioning-02"] },
      { start: 82, end: 94.4, cueIds: ["positioning-03"] },
      { start: 94.6, end: 113.2, cueIds: ["positioning-04", "positioning-05"] },
      { start: 118, end: 133.5, cueIds: ["features-01", "features-02"] },
      { start: 135.6, end: 144.62, cueIds: ["features-03"] },
      { start: 145, end: 153.7, cueIds: ["examine-01"] },
      {
        start: 154,
        end: 183.05,
        cueIds: ["examine-02", "examine-03", "examine-04"],
      },
    ].map(Object.freeze),
  ),
  _a = Object.freeze(
    [
      { start: 2.5, end: 6.1, cueIds: ["preparation-01"] },
      { start: 6.5, end: 25.5, cueIds: ["preparation-02", "preparation-03"] },
      { start: 26, end: 39.7, cueIds: ["preparation-04", "preparation-05"] },
      { start: 39.95, end: 47.1, cueIds: ["preparation-06"] },
      { start: 51, end: 59.9, cueIds: ["sitting-01"] },
      { start: 60.2, end: 68.5, cueIds: ["sitting-02"] },
      { start: 68.7, end: 76.3, cueIds: ["sitting-03"] },
      { start: 76.5, end: 87.7, cueIds: ["sitting-04", "sitting-05"] },
      { start: 88, end: 93.2, cueIds: ["sitting-06"] },
      { start: 97.8, end: 102, cueIds: ["indentation-01"] },
      {
        start: 102,
        end: 117.8,
        cueIds: ["indentation-02", "indentation-03", "indentation-04"],
      },
      { start: 117.8, end: 122.2, cueIds: ["indentation-05"] },
      { start: 122.2, end: 130.6, cueIds: ["indentation-06"] },
    ].map(Object.freeze),
  );
function Oa() {
  if (typeof navigator > "u")
    return { iosLikeWebKit: !1, desktopSafariWebKit: !1, safariWebKit: !1 };
  let e = navigator.userAgent || "",
    n = /iPad|iPhone|iPod/i.test(e),
    r =
      navigator.platform === "MacIntel" &&
      Number(navigator.maxTouchPoints || 0) > 1,
    a = n || r,
    o = /AppleWebKit/i.test(e),
    l = /Safari/i.test(e),
    m = /Version\//i.test(e),
    c =
      /(?:Chrome|Chromium|CriOS|FxiOS|Edg|EdgiOS|OPR|OPiOS|SamsungBrowser|DuckDuckGo)\//i.test(
        e,
      ),
    f = !a && o && l && m && !c;
  return { iosLikeWebKit: a, desktopSafariWebKit: f, safariWebKit: a || f };
}
var ar = Oa(),
  Ha = ar.safariWebKit ? "canvas" : "svg",
  qa = "canvas";
function Cn() {
  if (typeof window > "u") return null;
  let e = window.__ARCLIGHT_E2E__;
  return e && typeof e == "object" ? e : null;
}
function zr() {
  let e = Number(Cn()?.fundalPlaybackRate);
  return !Number.isFinite(e) || e <= 0 ? null : Math.min(20, e);
}
function Da() {
  return Cn()?.disableFundalAutoplay === !0;
}
function Yr() {
  let e = Cn();
  if (!e) return null;
  (!e.fundal || typeof e.fundal != "object") && (e.fundal = {});
  let n = e.fundal;
  return (
    (!n.sessions || typeof n.sessions != "object") && (n.sessions = {}),
    typeof n.hasRoute != "function" && (n.hasRoute = (r) => !!n.sessions?.[r]),
    typeof n.getStageState != "function" &&
      (n.getStageState = (r, a) => n.sessions?.[r]?.getStageState?.(a) || null),
    typeof n.seekStage != "function" &&
      (n.seekStage = (r, a, o, l) =>
        n.sessions?.[r]?.seekStage?.(a, o, l) || null),
    n
  );
}
function Va(e, n) {
  let r = Yr();
  !r || !e || !n || (r.sessions[e] = n);
}
function Ua(e) {
  let n = Yr();
  !n || !e || delete n.sessions[e];
}
function Wa() {
  return new Promise((e) => {
    if (typeof requestAnimationFrame == "function") {
      requestAnimationFrame(() => e());
      return;
    }
    setTimeout(e, 16);
  });
}
async function hn(e = 2) {
  let n = Math.max(1, Math.floor(Number(e) || 0));
  for (let r = 0; r < n; r += 1) await Wa();
}
function Gn(e, n) {
  let r = Array.isArray(e?.playbackRateByFile)
      ? e.playbackRateByFile[n]
      : e?.playbackRate,
    a = Number(r);
  return !Number.isFinite(a) || a <= 0 ? 1 : a;
}
function Kn(e, n, r) {
  let a = Array.isArray(e?.segmentPlaybackRateByFile)
    ? e.segmentPlaybackRateByFile[n]
    : null;
  if (!Array.isArray(a)) return null;
  let o = Number(a[r]);
  return !Number.isFinite(o) || o <= 0 ? null : o;
}
function Gr(e, n, r) {
  for (let a = 0; a < Math.max(0, Number(r) || 0); a += 1)
    if (Kn(e, n, a) !== null) return !0;
  return !1;
}
function Kr(e, n) {
  let r = Array.isArray(e?.autoplayStartFrameByFile)
      ? e.autoplayStartFrameByFile[n]
      : e?.autoplayStartFrame,
    a = Number(r);
  return !Number.isFinite(a) || a < 0 ? 0 : Math.floor(a);
}
function ja(e, n) {
  let r = Array.isArray(e?.autoplayEndFrameByFile)
    ? e.autoplayEndFrameByFile[n]
    : e?.autoplayEndFrame;
  if (r == null || r === "") return null;
  let a = Number(r);
  return !Number.isFinite(a) || a < 0 ? null : Math.floor(a);
}
function Pr(e, n) {
  let r = Array.isArray(e?.completionHoldFrameByFile)
    ? e.completionHoldFrameByFile[n]
    : e?.completionHoldFrame;
  if (r == null || r === "") return null;
  let a = Number(r);
  return !Number.isFinite(a) || a < 0 ? null : Math.floor(a);
}
function za(e, n) {
  let r = Array.isArray(e?.advanceArrowAnchorParagraphByFile)
    ? e.advanceArrowAnchorParagraphByFile[n]
    : e?.advanceArrowAnchorParagraph;
  if (r == null || r === "") return null;
  let a = Number(r);
  return !Number.isFinite(a) || a < 1 ? null : Math.floor(a);
}
function bn(e, n, r) {
  let a = zr() ?? Gn(n, r);
  if (!(a === 1 || typeof e?.setSpeed != "function"))
    try {
      e.setSpeed(a);
    } catch {}
}
var le = {
    childhoodFundalPreparation: {
      pageId: "childhoodFundalPreparationPage",
      label: "Preparation",
      enableReplay: !0,
      persistentSettleSnapshotOverlay: !0,
      segmentTextToggleOnTitle: !0,
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
      strictFrameLockNoFallback: !0,
      strictFrameRemountOnBlank: !0,
      iosAggressiveSettleSegments: [[0], [1, 2], [3], [1, 2, 3]],
      richSettleContentFiles: [0, 1, 2, 3],
      richSettleMinAreaByFile: [0.08, 0.12, 0.12, 0.12],
    },
    childhoodFundalExamination: {
      pageId: "childhoodFundalExaminationPage",
      label: "Examination",
      enableReplay: !0,
      segmentTextToggleOnTitle: !0,
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
          `Reflex varies by race

Black baby: yellow / white / blue reflex`,
          "White baby: orange / red reflex",
          "Asian baby: orange / yellow reflex",
        ],
      ],
      segmentTextModeByFile: ["append", "append", "append", "append", "append"],
      strictFrameLockNoFallback: !0,
      strictFrameRemountOnBlank: !0,
      iosRendererByFile: [null, null, null, null, "svg"],
      iosAggressiveSettleSegments: [[0], [1], [2, 3], [1], [2]],
      richSettleContentFiles: [0, 1, 2, 3, 4],
      richSettleMinAreaByFile: [0.08, 0.1, 0.12, 0.1, 0.1],
    },
    childhoodFundalNewbornEyesOpen: {
      pageId: "childhoodFundalNewbornEyesOpenPage",
      label: "Newborn - Eyes Open",
      enableReplay: !0,
      segmentTextToggleOnTitle: !0,
      paths: [
        "/scrolly/coreexam/fundalreflex/eyesopen/1/data.json",
        "/scrolly/coreexam/fundalreflex/eyesopen/2/data.json",
        "/scrolly/coreexam/fundalreflex/eyesopen/3/data.json",
      ],
      playMode: "stageAutoplay",
      playbackRateByFile: [1.5, 1, 1],
      autoplayLegacySegmentPlaybackByFile: [!1, !0, !1],
      preferLastVisibleCompletionFrameByFile: [!1, !0, !1],
      forceInitialFrameHoldByFile: [0],
      rendererByFile: [null, "canvas", null],
      preserveCompletionSnapshotOverlayByFile: [!1, !0, !1],
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
          `Occasional and short-lasting squints
are common in the first month of life,`,
          "and will usually disappear by three months of age",
        ],
      ],
      segmentTextModeByFile: ["append", "append", "append"],
      strictFrameLockNoFallback: !0,
      strictFrameRemountOnBlank: !0,
      iosAggressiveSettleSegments: [[0], [2], [1]],
      richSettleContentFiles: [0, 1, 2],
      richSettleMinAreaByFile: [0.08, 0.18, 0.18],
    },
    childhoodFundalNewbornEyesClosed: {
      pageId: "childhoodFundalNewbornEyesClosedPage",
      label: "Newborn - Eyes Closed",
      enableReplay: !0,
      segmentTextToggleOnTitle: !0,
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
      strictFrameLockNoFallback: !0,
      strictFrameRemountOnBlank: !0,
      iosRendererByFile: ["svg", "svg"],
      iosAggressiveSettleSegments: [[0], [1]],
      richSettleContentFiles: [0, 1],
      richSettleMinAreaByFile: [0.08, 0.12],
    },
    childhoodFundalUnclearFindings: {
      pageId: "childhoodFundalUnclearFindingsPage",
      label: "Unclear Findings",
      enableReplay: !0,
      segmentTextToggleOnTitle: !0,
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
      autoplayLegacySegmentPlaybackByFile: [!1, !1, !1, !0],
      preferLastVisibleCompletionFrameByFile: [!1, !1, !1, !0],
      preserveCompletionSnapshotOverlayByFile: [!1, !1, !1, !0],
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
      strictFrameLockNoFallback: !0,
      strictFrameRemountOnBlank: !0,
      iosAggressiveSettleSegments: [[0], [1, 2], [2]],
      richSettleContentFiles: [0, 1, 2, 3],
      richSettleMinAreaByFile: [0.1, 0.12, 0.12, 0.12],
    },
    childhoodFundalPossibleFinding: {
      pageId: "childhoodFundalPossibleFindingPage",
      label: "Possible Findings",
      enableReplay: !0,
      segmentTextToggleOnTitle: !0,
      paths: [
        "/scrolly/coreexam/fundalreflex/findings/1/data.json",
        "/scrolly/coreexam/fundalreflex/findings/2/data.json",
      ],
      stageAspectRatioByFile: ["1146 / 947", "1146 / 1476"],
      preserveAspectRatioByFile: ["xMidYMid meet", "xMidYMid meet"],
      mobileStageTopAligned: !1,
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
          `Occasional and short-lasting squints
are common in the first month of life`,
          "and will usually disappear by three months of age",
          "Any colour difference or partial/complete loss = abnormal",
        ],
      ],
      segmentTextModeByFile: ["replace", "replace"],
      strictFrameLockNoFallback: !0,
      strictFrameRemountOnBlank: !0,
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
      enableReplay: !0,
      segmentTextToggleOnTitle: !0,
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
      strictFrameLockNoFallback: !0,
      strictFrameRemountOnBlank: !0,
      iosRendererByFile: ["svg", null],
      iosAggressiveSettleSegments: [[1]],
      richSettleContentFiles: [0, 1],
      richSettleMinAreaByFile: [0.1, 0.12],
    },
    diabeticObservationFundalReflex: {
      pageId: "diabeticObservationFundalReflexPage",
      label: "Observation and Fundal Reflex",
      enableReplay: !0,
      segmentTextToggleOnTitle: !0,
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
      segmentPauseAfterMsByFile: [null, null, null, null, [3e3]],
      advanceArrowAnchorParagraphByFile: [null, 2],
      centerTopBiasByFile: [0, 0, 0, 0, -96],
      desktopTopGapByFile: [18, 18, 18, 18, -24],
      segmentStartTexts: [
        ["Start with hand hygiene"],
        [
          `Take a few seconds to look at the area around the periorbita, the eyelids and the eyes themselves

Mention any normal or abnormal findings

Fundal Reflex

Perform the fundal reflex test
to assess for media opacity`,
        ],
        [
          "Use brightest light setting",
          "Push lens racks up",
          "Examine in quiet, dim room",
        ],
        [
          `Stand at arm's length
and look through the sight hole`,
        ],
        [
          "Ask the patient to look at the light while you observe both eyes together",
          "The light should reflect from the fundus back through the pupils, looking symmetrically bright with similar colour",
          "Any asymmetry suggests an abnormality such as a corneal scar, cataract, blood in the vitreous or a retinal tumour",
        ],
      ],
      segmentTextModeByFile: ["append", "append", "append", "append", "append"],
      leftAlignedTextFiles: [4],
      bulletTextFiles: [4],
      strictFrameLockNoFallback: !0,
      strictFrameRemountOnBlank: !0,
      richSettleContentFiles: [0, 1, 2, 3, 4],
      richSettleMinAreaByFile: [0.08, 0.08, 0.08, 0.08, 0.08],
    },
    diabeticPositioningFlightPath: {
      pageId: "diabeticPositioningFlightPathPage",
      label: "Positioning and Flight Path",
      enableReplay: !0,
      segmentTextToggleOnTitle: !0,
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
      segmentPauseAfterMsByFile: [null, null, [3e3]],
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
      strictFrameLockNoFallback: !0,
      strictFrameRemountOnBlank: !0,
      richSettleContentFiles: [0, 1, 2, 3, 4, 5],
      richSettleMinAreaByFile: [0.08, 0.08, 0.08, 0.08, 0.08, 0.08],
    },
    diabeticHowToExamine: {
      pageId: "diabeticHowToExaminePage",
      label: "How to Examine",
      enableReplay: !0,
      segmentTextToggleOnTitle: !0,
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
      segmentPauseAfterMsByFile: [null, [4e3, 4e3, 4e3]],
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
      preserveCompletionSnapshotOverlayByFile: [!1, !0],
      completionSnapshotImageByFile: [
        null,
        "/scrolly/coreexam/ophths/DO/03HowtoExamine/2/final_frame.png",
      ],
      strictFrameLockNoFallback: !0,
      strictFrameRemountOnBlank: !0,
      richSettleContentFiles: [0, 1],
      richSettleMinAreaByFile: [0.08, 0.08],
    },
    diabeticBioPreparation: {
      pageId: "diabeticBioPreparationPage",
      label: "Preparation",
      enableReplay: !0,
      persistentSettleSnapshotOverlay: !0,
      segmentTextToggleOnTitle: !0,
      paths: [
        "/scrolly/coreexam/fundalreflex/prep/1/data.json",
        "/scrolly/coreexam/ophths/BIO/01Preparation/1/data.json",
        "/scrolly/coreexam/ophths/BIO/01Preparation/3/data.json",
        "/scrolly/coreexam/ophths/BIO/01Preparation/2/data.json",
      ],
      playMode: "stageAutoplay",
      segmentPlaybackRateByFile: [null, [1.5, 1]],
      iosRendererByFile: [null, "svg", "canvas", null],
      preserveCompletionSnapshotOverlayByFile: [!1, !0, !0, !1],
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
      segmentTextTriggerFramesByFile: [
        null,
        [0, 393],
        [0, 184, 301, 341],
        null,
      ],
      segmentPauseAfterMsByFile: [null, null, [3e3, 3e3, 3e3], [2e3]],
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
          `Eyepieces would angle outwards
so they are at 90 degrees to your line of sight
looking slightly downwards`,
        ],
      ],
      segmentTextModeByFile: ["append", "append", "append", "append"],
      leftAlignedTextFiles: [2],
      bulletTextFiles: [2],
      strictFrameLockNoFallback: !0,
      strictFrameRemountOnBlank: !0,
      richSettleContentFiles: [0, 1, 2, 3],
      richSettleMinAreaByFile: [0.08, 0.08, 0.08, 0.08],
    },
    diabeticBioFundoscopySitting: {
      pageId: "diabeticBioFundoscopySittingPage",
      label: "Fundoscopy Sitting",
      enableReplay: !0,
      persistentSettleSnapshotOverlay: !0,
      disableCompletedRouteRestore: !0,
      segmentTextToggleOnTitle: !0,
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
      preserveCompletionSnapshotOverlayByFile: [!1, !0, !0, !1, !1],
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
      skipRouteImageWarmup: !0,
      lazyLoadStageAnimations: !0,
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
      segmentPauseAfterMsByFile: [null, [3e3], [3e3, 3e3]],
      segmentStartTexts: [
        [
          `Dilate the patient's pupils
to allow a full wider view of the fundus`,
        ],
        [
          `Hold the condensing lens close to the eye,
lift the upper eyelid`,
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
        [
          `After the macula, examine the peripheral
4 quadrants of the fundus`,
        ],
      ],
      segmentTextModeByFile: ["append", "append", "append", "append", "append"],
      leftAlignedTextFiles: [1, 2, 3],
      bulletTextFiles: [1, 2, 3],
      strictFrameLockNoFallback: !0,
      strictFrameRemountOnBlank: !0,
      richSettleContentFiles: [0, 1, 2, 3, 4],
      richSettleMinAreaByFile: [0.08, 0.08, 0.08, 0.08, 0.08],
    },
    diabeticBioFundoscopyIndentation: {
      pageId: "diabeticBioFundoscopyIndentationPage",
      label: "Fundoscopy with Indentation",
      enableReplay: !0,
      segmentTextToggleOnTitle: !0,
      paths: [
        "/scrolly/coreexam/ophths/BIO/03FundoscopywithIndentation/1/data.json",
        "/scrolly/coreexam/ophths/BIO/03FundoscopywithIndentation/2/data.json",
        "/scrolly/coreexam/ophths/BIO/03FundoscopywithIndentation/3/data.json",
        "/scrolly/coreexam/ophths/BIO/03FundoscopywithIndentation/4/data.json",
      ],
      playMode: "stageAutoplay",
      playbackRateByFile: [1, 1, 0.5, 1],
      completionHoldFrameByFile: [104, 104, 134, 299],
      forceExactCompletionHoldFrameByFile: [!1, !0, !1, !1],
      preserveCompletionSnapshotOverlayByFile: [!0, !0, !1, !1],
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
      segmentPauseAfterMsByFile: [[3e3], null],
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
        [
          `You should be able to examine
the far periphery of the retina`,
        ],
      ],
      segmentTextModeByFile: ["append", "append", "append", "append"],
      leftAlignedTextFiles: [0, 1],
      bulletTextFiles: [0, 1],
      strictFrameLockNoFallback: !0,
      strictFrameRemountOnBlank: !0,
      richSettleContentFiles: [0, 1, 2, 3],
      richSettleMinAreaByFile: [0.08, 0.08, 0.08, 0.08],
    },
  },
  ir = "fundalReflexExaminationScroll",
  Ya = [
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
  ],
  Ga = "directOphthalmoscopyScroll",
  Ka = [
    {
      routeName: "diabeticObservationFundalReflex",
      title: "Observation and Fundal Reflex",
    },
    {
      routeName: "diabeticPositioningFlightPath",
      title: "Positioning and Flight Path",
    },
    { routeName: "diabeticHowToExamine", title: "How to Examine" },
  ],
  $a = "binocularIndirectOphthalmoscopyScroll",
  Xa = [
    { routeName: "diabeticBioPreparation", title: "Preparation" },
    { routeName: "diabeticBioFundoscopySitting", title: "Fundoscopy Sitting" },
    {
      routeName: "diabeticBioFundoscopyIndentation",
      title: "Fundoscopy with Indentation",
    },
  ];
function $n(e) {
  if (e == null) return e;
  if (typeof structuredClone == "function")
    try {
      return structuredClone(e);
    } catch {}
  if (Array.isArray(e)) return e.map((n) => $n(n));
  if (typeof e == "object") {
    let n = {};
    return (
      Object.entries(e).forEach(([r, a]) => {
        n[r] = $n(a);
      }),
      n
    );
  }
  return e;
}
function re(e, n) {
  let r = [];
  return (
    e.forEach((a) => {
      let o = le[a?.routeName],
        l = Array.isArray(o?.paths) ? o.paths.length : 0,
        m = Array.isArray(o?.[n]) ? o[n] : [];
      for (let c = 0; c < l; c += 1) r.push($n(m[c]));
    }),
    r.some((a) => a !== void 0) ? r : void 0
  );
}
function pn(e, n) {
  let r = [],
    a = 0;
  return (
    e.forEach((o) => {
      let l = le[o?.routeName],
        m = Array.isArray(l?.paths) ? l.paths.length : 0;
      ((Array.isArray(l?.[n]) ? l[n] : []).forEach((f) => {
        let g = Number(f);
        !Number.isInteger(g) || g < 0 || r.push(a + g);
      }),
        (a += m));
    }),
    r.length ? r : void 0
  );
}
function or(e, n, r = []) {
  let a = [],
    o = [],
    l = 0;
  return (
    r.forEach((m) => {
      let c = le[m?.routeName],
        f = Array.isArray(c?.paths)
          ? c.paths.map((g) => String(g || "").trim()).filter((g) => !!g)
          : [];
      f.length &&
        (a.push({
          startIndex: l,
          title: String(m?.title || c?.label || n).trim() || n,
          titleKey: String(m?.titleKey || "").trim(),
        }),
        o.push(...f),
        (l += f.length));
    }),
    {
      pageId: e,
      label: n,
      enableReplay: !0,
      persistentSettleSnapshotOverlay: !0,
      segmentTextToggleOnTitle: !0,
      playMode: "stageAutoplay",
      strictFrameLockNoFallback: !0,
      strictFrameRemountOnBlank: !0,
      paths: o,
      sections: a,
      playbackRateByFile: re(r, "playbackRateByFile"),
      autoplayStartFrameByFile: re(r, "autoplayStartFrameByFile"),
      autoplayEndFrameByFile: re(r, "autoplayEndFrameByFile"),
      segmentTextTriggerFramesByFile: re(r, "segmentTextTriggerFramesByFile"),
      segmentPlaybackRateByFile: re(r, "segmentPlaybackRateByFile"),
      segmentPauseAfterMsByFile: re(r, "segmentPauseAfterMsByFile"),
      segmentRanges: re(r, "segmentRanges"),
      settleFrameOverrides: re(r, "settleFrameOverrides"),
      completionHoldFrameByFile: re(r, "completionHoldFrameByFile"),
      forceExactCompletionHoldFrameByFile: re(
        r,
        "forceExactCompletionHoldFrameByFile",
      ),
      segmentStartTexts: re(r, "segmentStartTexts"),
      segmentTextModeByFile: re(r, "segmentTextModeByFile"),
      iosAggressiveSettleSegments: re(r, "iosAggressiveSettleSegments"),
      richSettleMinAreaByFile: re(r, "richSettleMinAreaByFile"),
      stageAspectRatioByFile: re(r, "stageAspectRatioByFile"),
      centerTopBiasByFile: re(r, "centerTopBiasByFile"),
      desktopTopGapByFile: re(r, "desktopTopGapByFile"),
      preserveAspectRatioByFile: re(r, "preserveAspectRatioByFile"),
      iosRendererByFile: re(r, "iosRendererByFile"),
      autoplayLegacySegmentPlaybackByFile: re(
        r,
        "autoplayLegacySegmentPlaybackByFile",
      ),
      preferLastVisibleCompletionFrameByFile: re(
        r,
        "preferLastVisibleCompletionFrameByFile",
      ),
      preserveCompletionSnapshotOverlayByFile: re(
        r,
        "preserveCompletionSnapshotOverlayByFile",
      ),
      completionSnapshotImageByFile: re(r, "completionSnapshotImageByFile"),
      settleSnapshotImageByFile: re(r, "settleSnapshotImageByFile"),
      finalSummaryBulletsByFile: re(r, "finalSummaryBulletsByFile"),
      forceInitialFrameHoldByFile: pn(r, "forceInitialFrameHoldByFile"),
      leftAlignedTextFiles: pn(r, "leftAlignedTextFiles"),
      bulletTextFiles: pn(r, "bulletTextFiles"),
      richSettleContentFiles: pn(r, "richSettleContentFiles"),
    }
  );
}
le[ir] = or(
  "fundalReflexExaminationScrollPage",
  "Fundal Reflex Examination",
  Ya,
);
le[ir].narrationTracks = jr;
le[ir].narrationClipsByFile = La;
le[Ga] = {
  narrationTracks: ka,
  narrationClipsByFile: Ma,
  ...or("directOphthalmoscopyScrollPage", "Direct Ophthalmoscopy", Ka),
  disableCompletedRouteRestore: !1,
  progressStoragePrefix: "diabeticWorkshop:progress:",
  lazyInitialStageCount: 1,
  lazyLoadStageAnimations: !0,
  skipRouteImageWarmup: !0,
};
le[$a] = {
  narrationTracks: Ba,
  narrationClipsByFile: _a,
  ...or(
    "binocularIndirectOphthalmoscopyScrollPage",
    "Binocular Indirect Ophthalmoscopy",
    Xa,
  ),
  disableCompletedRouteRestore: !1,
  progressStoragePrefix: "diabeticWorkshop:progress:",
  lazyInitialStageCount: 1,
  lazyLoadStageAnimations: !0,
  skipRouteImageWarmup: !0,
};
le.frontOfEyeExaminationScroll = { ...Tr, narrationTracks: rr("front-of-eye") };
le.visualAcuityExaminationScroll = { ...vr };
le.makeEyePadShieldScroll = { ...Sr };
le.applyEyePadShieldScroll = { ...xr };
le.cataractScroll = { ...wr };
le.pupilsPecScroll = { ...Nr };
Object.values(le).forEach(Hn);
function co(e, n, r) {
  ((Ar[n.pageId] = r), (le[e] = { ...n }), Hn(le[e]));
}
function Fn(e) {
  let n = String(e || "")
    .trim()
    .replace(/_/g, "-")
    .toLowerCase();
  if (n === "ko" || n.startsWith("ko-")) return "ko";
  if (n === "es" || n.startsWith("es-")) return "es-419";
  let r = n.split("-")[0];
  return ["ne", "fr", "lg", "ha", "yo", "ig"].includes(r) ? r : "en";
}
function $r(e) {
  try {
    let n = String(localStorage.getItem(`${yn}${e}`) || "auto")
        .trim()
        .toLowerCase(),
      r = localStorage.getItem(`${Wr}${e}`) !== "off",
      a = [
        "auto",
        "en",
        "es-419",
        "ko",
        "ne",
        "fr",
        "lg",
        "ha",
        "yo",
        "ig",
      ].includes(n)
        ? n
        : "auto";
    return { enabled: n !== "off" && r, language: a };
  } catch {
    return { enabled: !0, language: "auto" };
  }
}
function Vn(e, { enabled: n, language: r }) {
  try {
    (localStorage.setItem(`${Wr}${e}`, n ? "on" : "off"),
      r === "auto"
        ? localStorage.removeItem(`${yn}${e}`)
        : localStorage.setItem(`${yn}${e}`, r));
  } catch {}
}
function Qa(e = lt()) {
  let n = Fn(e),
    r = {
      ha: {
        auto: "Ta atomatik",
        language: "Harshen bayani",
        on: "Kunna bayani",
        off: "Kashe bayani",
        blocked: "Ta\u0253a don sauraron bayani",
      },
      yo: {
        auto: "L\xE1\xECf\u1ECDw\u1ECD\u0301y\xED",
        language: "\xC8d\xE8 \xECt\xFAm\u1ECD\u0300 oh\xF9n",
        on: "Tan oh\xF9n",
        off: "Pa oh\xF9n",
        blocked: "T\u1EB9\u0300 l\xE1ti gb\u1ECD\u0301 oh\xF9n",
      },
      ig: {
        auto: "Na-akpagh\u1ECB aka",
        language: "As\u1EE5s\u1EE5 nk\u1ECDwa",
        on: "Gbanye nk\u1ECDwa",
        off: "Gbany\u1EE5\u1ECD nk\u1ECDwa",
        blocked: "P\u1ECBa ka \u1ECB n\u1EE5 nk\u1ECDwa",
      },
      ne: {
        auto: "\u0938\u094D\u0935\u091A\u093E\u0932\u093F\u0924",
        language:
          "\u0935\u093E\u091A\u0928\u0915\u094B \u092D\u093E\u0937\u093E",
        on: "\u0935\u093E\u091A\u0928 \u0916\u094B\u0932\u094D\u0928\u0941\u0939\u094B\u0938\u094D",
        off: "\u0935\u093E\u091A\u0928 \u092C\u0928\u094D\u0926 \u0917\u0930\u094D\u0928\u0941\u0939\u094B\u0938\u094D",
        blocked:
          "\u0935\u093E\u091A\u0928 \u0938\u0941\u0928\u094D\u0928 \u0925\u093F\u091A\u094D\u0928\u0941\u0939\u094B\u0938\u094D",
      },
      fr: {
        auto: "Automatique",
        language: "Langue de narration",
        on: "Activer la narration",
        off: "D\xE9sactiver la narration",
        blocked: "Appuyez pour \xE9couter la narration",
      },
      lg: {
        auto: "Kyokka",
        language: "Olulimi lw'okunyonyola",
        on: "Tandika eddoboozi",
        off: "Zikiza eddoboozi",
        blocked: "Nyiga okuwuliriza",
      },
    };
  return r[n]
    ? r[n]
    : n === "ko"
      ? {
          auto: "\uC790\uB3D9",
          language: "\uB0B4\uB808\uC774\uC158 \uC5B8\uC5B4",
          on: "\uB0B4\uB808\uC774\uC158 \uCF1C\uAE30",
          off: "\uB0B4\uB808\uC774\uC158 \uB044\uAE30",
          blocked:
            "\uB0B4\uB808\uC774\uC158\uC744 \uC7AC\uC0DD\uD558\uB824\uBA74 \uB204\uB974\uC138\uC694",
        }
      : n === "es-419"
        ? {
            auto: "Autom\xE1tico",
            language: "Idioma de narraci\xF3n",
            on: "Activar narraci\xF3n",
            off: "Desactivar narraci\xF3n",
            blocked: "Toca para reproducir la narraci\xF3n",
          }
        : {
            auto: "Auto",
            language: "Narration language",
            on: "Turn narration on",
            off: "Turn narration off",
            blocked: "Tap to play narration",
          };
}
function Ja(e, n, r, a = null) {
  let o = n?.narrationTracks,
    l = n?.narrationClipsByFile,
    m = r.querySelector("[data-fundal-scroll-narration-controls]"),
    c = m?.querySelector("[data-fundal-scroll-narration-toggle]"),
    f = m?.querySelector("[data-fundal-scroll-narration-language]");
  if (!o || !Array.isArray(l) || !l.length || !m || !c || !f) return null;
  let g = $r(n.pageId),
    F = !!n.narrationTimeline,
    y = (F && Rr(n.pageId)) || document.createElement("audio");
  ((y.hidden = !0),
    (y.preload = "auto"),
    y.setAttribute("aria-hidden", "true"),
    y.setAttribute("data-fundal-scroll-narration-audio", "true"),
    r.appendChild(y));
  let S = g.enabled,
    w = g.language,
    _ = lt(),
    L = "",
    A = null,
    j = !1,
    G = null,
    B = null,
    q = !1,
    U = 0,
    $ = performance.now(),
    Z = 0,
    we = !1,
    P = F
      ? Math.max(1, Math.min(16, Number(Cn()?.fundalPlaybackRate) || 1))
      : 1;
  F && (y.playbackRate = P);
  let Ne = () => {
      let O = performance.now();
      return (
        A &&
          j &&
          (S
            ? G == null &&
              y.readyState >= 1 &&
              (U = Math.max(U, Number(y.currentTime) - A.start))
            : (U += (Math.max(0, O - $) * P) / 1e3),
          (U = Math.min(A.end - A.start, U)),
          U >= A.end - A.start && Ae()),
        ($ = O),
        { time: (A?.start || 0) + U, elapsed: U, finished: !!A && !j }
      );
    },
    me = () => {
      let O = Fn(w === "auto" ? lt() : w);
      return o[O] ? O : "en";
    },
    oe = () => {
      B != null && (clearTimeout(B), (B = null));
    },
    Ae = () => {
      (oe(), (Z += 1), A && (U = A.end - A.start), (j = !1), (q = !1));
      try {
        y.pause();
      } catch {}
      if (A)
        try {
          y.currentTime = Number(A.end);
        } catch {}
      ce();
    },
    Ee = () => {
      if ((oe(), F || !S || !j || !A || y.paused)) return;
      let O = Math.max(0, Number(A.end) - Number(y.currentTime || A.start));
      B = setTimeout(Ae, Math.max(50, Math.ceil((O + 0.08) * 1e3)));
    };
  function ce() {
    let O = Qa(),
      W = me(),
      D = o[W]?.label || W,
      se = W === "es-419" ? "ES" : W.toUpperCase(),
      Ue = S ? (q && !F ? O.blocked : O.off) : O.on;
    ((c.textContent = S ? "\u{1F50A}" : "\u{1F507}"),
      (c.title = Ue),
      c.setAttribute("aria-label", Ue),
      c.setAttribute("aria-pressed", S ? "true" : "false"),
      c.classList.toggle("is-off", !S),
      c.classList.toggle("is-playback-blocked", q),
      (m.dataset.narrationLanguage = W),
      (m.dataset.narrationEnabled = S ? "true" : "false"),
      f.setAttribute("aria-label", O.language),
      (f.title = `${O.language}: ${D}`),
      f.replaceChildren());
    let mt = document.createElement("option");
    ((mt.value = "auto"),
      (mt.textContent = `${O.auto} \xB7 ${se}`),
      f.appendChild(mt),
      Object.entries(o).forEach(([ve, Qe]) => {
        let wt = document.createElement("option");
        ((wt.value = ve), (wt.textContent = Qe.label || ve), f.appendChild(wt));
      }),
      (f.value = w));
  }
  let at = (O, W = null) => {
      Z += 1;
      let D = Fn(O),
        se = o[D] || o.en;
      if (!se?.src) return !1;
      let Ue = y.getAttribute("src") || "";
      if (
        ((L = D),
        A?.endByLanguage && (A.end = A.endByLanguage[D] ?? A.defaultEnd),
        y.setAttribute("lang", D),
        Ue === se.src)
      )
        return (Number.isFinite(Number(W)) && (G = Number(W)), !0);
      oe();
      try {
        y.pause();
      } catch {}
      ((G = Number.isFinite(Number(W)) ? Number(W) : null),
        y.setAttribute("src", se.src));
      try {
        y.load();
      } catch {}
      return !0;
    },
    ue = (O = null) => {
      if (!S || !j || !A) return;
      let W = Number.isFinite(Number(O)) ? Number(O) : Number(A.start);
      G = null;
      try {
        y.currentTime = Math.max(
          Number(A.start),
          Math.min(Number(A.end) - 0.02, W),
        );
      } catch {
        G = W;
        return;
      }
      q = !1;
      let D = ++Z,
        se;
      try {
        se = y.play();
      } catch {
        ((q = !0), ce());
        return;
      }
      se && typeof se.then == "function"
        ? se
            .then(() => {
              we || D !== Z || ((q = !1), Ee(), ce());
            })
            .catch(() => {
              we || D !== Z || (oe(), (q = !0), ce());
            })
        : Ee();
    },
    $e = (O) => {
      let W = l[Number(O)];
      if (!W) return;
      oe();
      try {
        y.pause();
      } catch {}
      ((A = { ...W, defaultEnd: W.end }),
        (U = 0),
        ($ = performance.now()),
        (j = !0),
        (q = !1));
      let D = me();
      if ((at(D, W.start), !S)) {
        ce();
        return;
      }
      y.readyState >= 1 && ue(W.start);
    },
    Xe = () => {
      !S || !j || G == null || ue(G);
    },
    _e = () => {
      !j ||
        !A ||
        (F && G != null) ||
        (Number(y.currentTime) >= Number(A.end) - (F ? 0 : 0.03) && Ae());
    },
    xt = (O) => {
      if ((O.preventDefault(), O.stopPropagation(), S && q && !F)) {
        ((q = !1), ue(y.currentTime || A?.start));
        return;
      }
      if (
        (F && Ne(),
        (S = !S),
        (Z += 1),
        Vn(n.pageId, { enabled: S, language: w }),
        S)
      ) {
        if (j && A) {
          let W = F ? A.start + U : Number(y.currentTime);
          ue(Number.isFinite(W) && W >= A.start ? W : A.start);
        }
      } else {
        oe();
        try {
          y.pause();
        } catch {}
      }
      ce();
    },
    ee = () => {
      let O = String(f.value || "auto"),
        W = F
          ? Ne().elapsed
          : A
            ? Math.max(0, Number(y.currentTime || A.start) - A.start)
            : 0;
      ((w = O), Vn(n.pageId, { enabled: S, language: w }));
      let D = me(),
        se = A ? Math.min(A.end - 0.02, A.start + W) : null;
      (at(D, se),
        S && j && A && y.readyState >= 1 && ue(se),
        ce(),
        Promise.resolve(a?.()).catch((Ue) => {
          console.error("[fundalScroll] text language refresh failed", Ue);
        }));
    },
    Re = (O) => {
      m.contains(O.target) ||
        !S ||
        !j ||
        (!q && !y.paused) ||
        ((q = !1), ue(y.currentTime || A?.start));
    };
  return (
    c.addEventListener("click", xt),
    f.addEventListener("change", ee),
    y.addEventListener("loadedmetadata", Xe),
    y.addEventListener("timeupdate", _e),
    y.addEventListener("ended", Ae),
    r.addEventListener("pointerdown", Re, !0),
    at(me()),
    ce(),
    {
      playForStage: $e,
      getPosition: Ne,
      getLanguage: me,
      refreshLanguage: () => {
        let O = lt();
        O !== _ &&
          ((_ = O),
          (w = "auto"),
          Vn(n.pageId, { enabled: S, language: "auto" }));
        let W = me();
        if (w === "auto" && W !== L) {
          let D = j ? (F ? Ne().time : Number(y.currentTime)) : null;
          (at(W, D), S && j && y.readyState >= 1 && ue(D));
        }
        ce();
      },
      destroy: () => {
        ((we = !0), (Z += 1), oe(), (j = !1));
        try {
          y.pause();
        } catch {}
        (c.removeEventListener("click", xt),
          f.removeEventListener("change", ee),
          y.removeEventListener("loadedmetadata", Xe),
          y.removeEventListener("timeupdate", _e),
          y.removeEventListener("ended", Ae),
          r.removeEventListener("pointerdown", Re, !0),
          y.remove());
      },
    }
  );
}
var Za = [
    "childhoodFundalPreparation",
    "childhoodFundalExamination",
    "childhoodFundalNewbornEyesOpen",
    "childhoodFundalNewbornEyesClosed",
    "childhoodFundalUnclearFindings",
    "childhoodFundalPossibleFinding",
    "childhoodFundalAfterExamination",
  ],
  ei = [
    "diabeticObservationFundalReflex",
    "diabeticPositioningFlightPath",
    "diabeticHowToExamine",
  ],
  ti = [
    "diabeticBioPreparation",
    "diabeticBioFundoscopySitting",
    "diabeticBioFundoscopyIndentation",
  ],
  ni = [Za, ei, ti],
  ri = {
    childhoodFundalPreparation: {
      previous: {
        type: "route",
        routeName: "fundalReflexPdf",
        pageId: "fundalReflexPdfPage",
      },
      next: { type: "fundal", routeName: "childhoodFundalExamination" },
    },
    childhoodFundalExamination: {
      previous: { type: "fundal", routeName: "childhoodFundalPreparation" },
      next: { type: "fundal", routeName: "childhoodFundalNewbornEyesOpen" },
    },
    childhoodFundalNewbornEyesOpen: {
      previous: { type: "fundal", routeName: "childhoodFundalExamination" },
      next: { type: "fundal", routeName: "childhoodFundalNewbornEyesClosed" },
    },
    childhoodFundalNewbornEyesClosed: {
      previous: { type: "fundal", routeName: "childhoodFundalNewbornEyesOpen" },
      next: { type: "fundal", routeName: "childhoodFundalUnclearFindings" },
    },
    childhoodFundalUnclearFindings: {
      previous: {
        type: "fundal",
        routeName: "childhoodFundalNewbornEyesClosed",
      },
      next: { type: "fundal", routeName: "childhoodFundalPossibleFinding" },
    },
    childhoodFundalPossibleFinding: {
      previous: { type: "fundal", routeName: "childhoodFundalUnclearFindings" },
      next: { type: "fundal", routeName: "childhoodFundalAfterExamination" },
    },
    childhoodFundalAfterExamination: {
      previous: { type: "fundal", routeName: "childhoodFundalPossibleFinding" },
      next: { type: "video", target: "usaidNormalAbnormalPage" },
    },
    diabeticObservationFundalReflex: {
      previous: { type: "video", target: "directOphthalmoscopyVideoPage" },
      next: { type: "fundal", routeName: "diabeticPositioningFlightPath" },
    },
    diabeticPositioningFlightPath: {
      previous: {
        type: "fundal",
        routeName: "diabeticObservationFundalReflex",
      },
      next: { type: "fundal", routeName: "diabeticHowToExamine" },
    },
    diabeticHowToExamine: {
      previous: { type: "fundal", routeName: "diabeticPositioningFlightPath" },
      next: {
        type: "route",
        routeName: "directOphthalmoscopyPdf",
        pageId: "directOphthalmoscopyPdfPage",
        diabeticFolder: "directOphthalmoscopy",
        diabeticFocusSelector: '[data-target="directOphthalmoscopyPdfPage"]',
      },
    },
    diabeticBioPreparation: {
      previous: {
        type: "video",
        target: "binocularIndirectOphthalmoscopyVideoPage",
      },
      next: { type: "fundal", routeName: "diabeticBioFundoscopySitting" },
    },
    diabeticBioFundoscopySitting: {
      previous: { type: "fundal", routeName: "diabeticBioPreparation" },
      next: { type: "fundal", routeName: "diabeticBioFundoscopyIndentation" },
    },
    diabeticBioFundoscopyIndentation: {
      previous: { type: "fundal", routeName: "diabeticBioFundoscopySitting" },
      next: {
        type: "route",
        routeName: "binocularIndirectOphthalmoscopyPdf",
        pageId: "binocularIndirectOphthalmoscopyPdfPage",
        diabeticFolder: "binocularIndirectOphthalmoscopy",
        diabeticFocusSelector:
          '[data-target="binocularIndirectOphthalmoscopyPdfPage"]',
      },
    },
  },
  Xr = 900,
  Zt = null,
  Tt = !1;
function Qr(e) {
  let n = String(e || "").trim();
  return n ? ni.find((r) => r.includes(n)) || [] : [];
}
function ai(e) {
  let n = String(e || "").trim();
  return n ? Qr(n).indexOf(n) : -1;
}
function sr(e, n = 1) {
  let r = String(e || "").trim(),
    a = Qr(r),
    o = ai(e);
  if (o < 0) return "";
  let l = n < 0 ? -1 : 1;
  return a[o + l] || "";
}
function Jr(e) {
  return !!sr(e, -1);
}
function Zr(e) {
  return !!sr(e, 1);
}
function lr() {
  try {
    sessionStorage.setItem("childhoodWorkshop:restoreOpenFolder", "1");
  } catch {}
}
function ea(e, n, r = {}) {
  let a = String(e || "").trim(),
    o = String(n || "")
      .trim()
      .toLowerCase();
  if (!a || !o) {
    Zt = null;
    return;
  }
  Zt = {
    routeName: a,
    edge: o === "end" ? "end" : "start",
    boundaryInputLockUntil: Number(r?.boundaryInputLockUntil || 0),
  };
}
function ii(e) {
  let n = Zt;
  return !n || String(n.routeName || "").trim() !== String(e || "").trim()
    ? null
    : ((Zt = null), n);
}
function ur(e) {
  let n = String(e || "").trim();
  if (!n) return !1;
  let r = document.getElementById(n);
  if (!r) return !1;
  let a = typeof window.showPage == "function",
    o = !a || window.__pageShownPatched !== !0;
  return (
    a
      ? window.showPage(n)
      : (document.querySelectorAll(".page").forEach((l) => {
          l.style.display = "none";
        }),
        (r.style.display = "block")),
    o &&
      document.dispatchEvent(
        new CustomEvent("page:shown", { detail: { id: n } }),
      ),
    !0
  );
}
async function Un(e, n = 1) {
  if (Tt) return !1;
  let r = sr(e, n);
  if (!r) return !1;
  let a = nn(r);
  if (!a?.pageId) return !1;
  ((Tt = !0),
    lr(),
    ea(r, n < 0 ? "end" : "start", {
      boundaryInputLockUntil: Date.now() + Xr,
    }));
  try {
    return (await Ot(r), ur(a.pageId), !0);
  } catch (o) {
    return (
      (Zt = null),
      console.error(
        "[fundalScroll] failed to navigate between fundal pages",
        o,
      ),
      !1
    );
  } finally {
    Tt = !1;
  }
}
function ta(e, n = "") {
  let r = String(e || "").trim();
  if (r)
    try {
      (sessionStorage.setItem("diabeticWorkshop:restoreOpenFolder", "1"),
        sessionStorage.setItem("diabeticWorkshop:openFolderKey", r),
        n &&
          sessionStorage.setItem("diabeticWorkshop:focusSelector", String(n)));
    } catch {}
}
async function na(e, n = {}) {
  let r = String(e || "").trim();
  if (!r) return !1;
  let a = nn(r);
  if (!a?.pageId) {
    ta(n.diabeticFolder, n.diabeticFocusSelector);
    try {
      return (await Ot(r), !0);
    } catch (o) {
      return (
        console.error("[fundalScroll] failed to navigate to route", o),
        !1
      );
    }
  }
  lr();
  try {
    return (await Ot(r), ur(a.pageId), !0);
  } catch (o) {
    return (
      console.error("[fundalScroll] failed to navigate to fundal route", o),
      !1
    );
  }
}
function Wn(e, n) {
  let r = String(e || "").trim(),
    a = n < 0 ? "previous" : "next";
  return ri[r]?.[a] || null;
}
async function oi(e) {
  let n = String(e || "").trim();
  if (!n) return !1;
  try {
    ((window.__videosPendingTarget = n),
      (window.__videosSuppressFlash = !0),
      sessionStorage.setItem("gotoSubPage", n));
  } catch {}
  try {
    await Ot("videos");
  } catch (o) {
    return (
      console.error("[fundalScroll] failed to load video lesson target", o),
      !1
    );
  }
  try {
    let { goToVideosSection: o, showVideosPageById: l } =
      await import("./videos-YJRPAZ42.js");
    (typeof o == "function" && o(n, { skipDefault: !0 }),
      typeof l == "function" && l(n));
  } catch {}
  let r = document.getElementById(n);
  return r
    ? (document
        .getElementById("videos")
        ?.querySelectorAll?.(".page")
        ?.forEach((o) => {
          o.style.display = "none";
        }),
      (r.style.display = "block"),
      document.dispatchEvent(
        new CustomEvent("page:shown", { detail: { id: n } }),
      ),
      !0)
    : !1;
}
async function si(e, n = 1) {
  if (!e || Tt) return !1;
  Tt = !0;
  try {
    if (e.type === "fundal" && e.routeName) {
      let r = n < 0 ? "end" : "start";
      return (
        ea(e.routeName, r, { boundaryInputLockUntil: Date.now() + Xr }),
        na(e.routeName)
      );
    }
    return e.type === "video" && e.target
      ? oi(e.target)
      : e.type === "route" && e.routeName
        ? (e.diabeticFolder
            ? ta(e.diabeticFolder, e.diabeticFocusSelector)
            : lr(),
          await Ot(e.routeName),
          e.pageId && ur(e.pageId),
          !0)
        : !1;
  } catch (r) {
    return (
      console.error("[fundalScroll] failed to navigate lesson target", r),
      !1
    );
  } finally {
    Tt = !1;
  }
}
function li(e) {
  e?.querySelectorAll("[data-fundal-nav-route]")?.forEach((n) => {
    n.dataset.fundalNavBound !== "1" &&
      ((n.dataset.fundalNavBound = "1"),
      n.addEventListener("click", (r) => {
        (r.preventDefault(),
          r.stopPropagation(),
          na(n.dataset.fundalNavRoute, {
            diabeticFolder: n.dataset.fundalNavFolder,
            diabeticFocusSelector: n.dataset.fundalNavFocusSelector,
          }));
      }));
  });
}
var ui = new Map([
    ["Wash hands", "i18nExtra.fundal_reflex.wash_hands"],
    [
      "Use brightest light setting",
      "i18nExtra.fundal_reflex.select_brightest_light_setting",
    ],
    ["Push lenses up", "i18nExtra.fundal_reflex.make_sure_lens_rack_top"],
    [
      "Examine in quiet, dim room",
      "i18nExtra.fundal_reflex.room_quiet_and_dim",
    ],
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
      `Reflex varies by race

Black baby: yellow / white / blue reflex`,
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
      `Occasional and short-lasting squints
are common in the first month of life,`,
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
      `Occasional and short-lasting squints
are common in the first month of life`,
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
    ["Next animation", "i18nExtra.next"],
    ["Replay", "i18nExtra.fundal_reflex.replay"],
  ]),
  vn = {},
  Ir = null,
  di = "childhoodWorkshop:progress:";
function ci(e) {
  return String(e ?? "")
    .replace(
      /\r\n?/g,
      `
`,
    )
    .replace(/\s+/g, " ")
    .trim();
}
var Lr = 0;
function Rt(e) {
  if (!e?.narrationTracks) return lt();
  let { language: n } = $r(e.pageId);
  return Fn(n === "auto" ? lt() : n);
}
async function dr(e = lt()) {
  let n = e === "es-419" ? "es" : e,
    r = ++Lr;
  if (Ir === n && vn) return;
  let a = await Fr(n);
  r === Lr && ((vn = a), (Ir = n));
}
function qe(e) {
  let n = e == null ? "" : String(e).trim();
  if (!n) return "";
  let r = ui.get(n);
  if (!r) {
    let a = vn?.i18nLiteral || {},
      o = a[n] || a[ci(n)];
    return o == null ? n : String(o).trim();
  }
  return String(br(vn, r) ?? n).trim();
}
var Fe = null;
function mi(e, n = di) {
  if (!e) return { percent: 0, updatedAt: 0 };
  try {
    let r = JSON.parse(localStorage.getItem(`${n}${e}`) || "null"),
      a = Number(r?.percent),
      o = Number(r?.updatedAt);
    return {
      percent: Number.isFinite(a) && a > 0 ? Math.max(0, Math.min(100, a)) : 0,
      updatedAt: Number.isFinite(o) && o > 0 ? Math.round(o) : 0,
    };
  } catch {
    return { percent: 0, updatedAt: 0 };
  }
}
function fi(e, n) {
  return mi(e, n).percent >= 100;
}
async function ra() {
  if (!(!Fe || typeof Fe.refreshLanguage != "function"))
    try {
      await Fe.refreshLanguage();
    } catch (e) {
      console.error("[fundalScroll] language refresh failed", e);
    }
}
window.__fundalScrollLanguageRefreshWired ||
  ((window.__fundalScrollLanguageRefreshWired = !0),
  window.addEventListener("i18n:languageChanged", () => {
    try {
      for (let e of Object.values(le))
        e.narrationTracks && localStorage.removeItem(`${yn}${e.pageId}`);
    } catch {}
    ra();
  }));
var v = ar.iosLikeWebKit,
  aa = ar.safariWebKit,
  gn = new WeakSet(),
  hi = [
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
  ],
  pi = [
    [120, 207, "last"],
    [101, 222, 354, "last"],
    [270, 357, 453, "last"],
  ];
function gi(e) {
  return Array.isArray(e)
    ? e.map((n) =>
        Array.isArray(n)
          ? n.map((r) => (!r || typeof r != "object" ? r : { ...r }))
          : [],
      )
    : [];
}
function yi(e) {
  return Array.isArray(e)
    ? e.map((n) => (Array.isArray(n) ? n.slice() : []))
    : [];
}
function bi(e, n) {
  return n
    ? !v || e !== "childhoodFundalPreparation"
      ? n
      : {
          ...n,
          segmentRanges: gi(hi),
          settleFrameOverrides: yi(pi),
          strictFrameLockNoFallback: !0,
        }
    : null;
}
function cr(e, n) {
  let r = Array.isArray(e?.rendererByFile) ? e.rendererByFile[n] : null,
    a = String(r ?? "")
      .trim()
      .toLowerCase();
  if (a === "svg" || a === "canvas" || a === "html") return a;
  if (!v) return Ha;
  let o = Array.isArray(e?.iosRendererByFile) ? e.iosRendererByFile[n] : null,
    l = String(o ?? "")
      .trim()
      .toLowerCase();
  return l === "svg" || l === "canvas" || l === "html" ? l : qa;
}
function mr() {
  if (!Fe) return;
  Ua(Fe.routeName);
  try {
    Fe.observer?.disconnect();
  } catch {}
  try {
    Fe.removeInputListeners?.();
  } catch {}
  ((Array.isArray(Fe.controllers)
    ? Fe.controllers.map((n) => n?.anim).filter((n) => !!n)
    : Fe.animations || []
  ).forEach((n) => {
    try {
      n.destroy();
    } catch {}
  }),
    (Fe = null));
}
window.__fundalScrollPageShownCleanupWired ||
  ((window.__fundalScrollPageShownCleanupWired = !0),
  document.addEventListener("page:shown", (e) => {
    let n = e?.detail?.id || "";
    if (!Fe) return;
    let a = nn(Fe.routeName)?.pageId || "";
    !a || n === a || mr();
  }));
function Fi(e, n) {
  let r = Array.isArray(e?.stageAspectRatioByFile)
    ? e.stageAspectRatioByFile[n]
    : null;
  if (typeof r == "string" && r.trim()) return r.trim();
  let a = Number(r);
  return Number.isFinite(a) && a > 0 ? String(a) : "";
}
function ia(e, n) {
  let r = Array.isArray(e?.centerTopBiasByFile)
      ? e.centerTopBiasByFile[n]
      : null,
    a = Number(r);
  return Number.isFinite(a) ? a : 0;
}
function oa(e, n) {
  let r = Array.isArray(e?.desktopTopGapByFile)
      ? e.desktopTopGapByFile[n]
      : e?.desktopTopGap,
    a = Number(r);
  return Number.isFinite(a) ? a : 18;
}
function fr(e, n) {
  let r = Array.isArray(e?.preserveAspectRatioByFile)
    ? e.preserveAspectRatioByFile[n]
    : null;
  return String(r ?? "").trim() || "xMidYMid meet";
}
function vi(e, n) {
  let r = e?.forceInitialFrameHoldByFile;
  return r === !0 ? !0 : Array.isArray(r) ? r.includes(n) : !1;
}
function sa(e) {
  let n = Number(e?.firstFileExtraTopGap);
  return Number.isFinite(n) && n >= 0 ? n : 18;
}
function hr() {
  if (typeof window > "u") return !1;
  let e = window.innerWidth || document.documentElement?.clientWidth || 0;
  return e > 0 && e <= 768;
}
function Dt() {
  return typeof window > "u"
    ? !1
    : (window.innerWidth || document.documentElement?.clientWidth || 0) >= 1024;
}
function la() {
  return typeof window > "u"
    ? !1
    : (window.innerWidth || document.documentElement?.clientWidth || 0) >= 1440;
}
function Sn(e) {
  return e?.mobileStageTopAligned === !0 && hr();
}
function Xn(e, n) {
  let r = e?.getSegmentStartTexts?.(n, Rt(e));
  if (Array.isArray(r)) return r;
  let a = Array.isArray(e?.segmentStartTexts) ? e.segmentStartTexts[n] : null;
  return Array.isArray(a) ? a.map((o) => qe(o)) : [];
}
function Qn(e, n) {
  let r = Array.isArray(e?.segmentTextTriggerFramesByFile)
    ? e.segmentTextTriggerFramesByFile[n]
    : null;
  return Array.isArray(r)
    ? r
        .map((a) => {
          let o = Number(a);
          return Number.isFinite(o) && o >= 0 ? Math.floor(o) : null;
        })
        .filter((a) => a != null)
    : [];
}
function Jn(e, n) {
  let r = Array.isArray(e?.finalSummaryBulletsByFile)
    ? e.finalSummaryBulletsByFile[n]
    : null;
  return Array.isArray(r) ? r.map((a) => qe(a)) : [];
}
function ua(e, n) {
  let r = Array.isArray(e?.segmentTextModeByFile)
      ? e.segmentTextModeByFile[n]
      : null,
    a = String(r ?? "")
      .trim()
      .toLowerCase();
  return a === "append" ||
    a === "appendinline" ||
    a === "sticky" ||
    a === "replace"
    ? a
    : "append";
}
function da(e, n, r) {
  let a = e?.[n];
  return a === !0
    ? !0
    : Array.isArray(a)
      ? a[r] === !0
        ? !0
        : a.includes(r)
      : !1;
}
function Si(e, n) {
  return da(e, "leftAlignedTextFiles", n);
}
function xi(e, n) {
  return da(e, "bulletTextFiles", n);
}
function kr(e) {
  return e?.lazyLoadStageAnimations === !0;
}
function ca(e, n, r) {
  let a = Array.isArray(e?.segmentPauseAfterMsByFile)
      ? e.segmentPauseAfterMsByFile[n]
      : null,
    o = Array.isArray(a) ? a[r] : r === 0 ? a : null,
    l = Number(o);
  return !Number.isFinite(l) || l <= 0
    ? 0
    : Math.max(0, Math.min(1e4, Math.round(l)));
}
function ma(e, n, r) {
  for (let a = 0; a < Math.max(0, Number(r) || 0); a += 1)
    if (ca(e, n, a) > 0) return !0;
  return !1;
}
function wi(e) {
  let n = Number(e);
  return !Number.isFinite(n) || n <= 0
    ? Promise.resolve()
    : new Promise((r) => {
        setTimeout(r, n);
      });
}
var Ni = new Set(["Parents should hold older baby"]);
function ct(e) {
  return String(e ?? "")
    .replace(
      /\r\n?/g,
      `
`,
    )
    .replace(/\s*\/\s*/g, " / ")
    .trim();
}
function xn(e) {
  let n = ct(e);
  return n
    ? Ni.has(n)
      ? !0
      : n.includes(`
`) &&
        !n.includes(`

`)
    : !1;
}
function Br(e) {
  return ct(e).replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
}
function fa(e, n) {
  let r = Br(e),
    a = Br(n);
  return a
    ? r
      ? r.endsWith(a)
        ? r
        : `${r} ${a}`.replace(/\s+/g, " ").trim()
      : a
    : r;
}
function wn(e, n) {
  if (!e) return;
  let r = ct(n);
  if (!r) {
    e.textContent = "";
    return;
  }
  let a = r.split(/\n{2,}/).filter((o) => o.trim());
  if (a.length <= 1) {
    e.textContent = r;
    return;
  }
  (e.classList.add("childhood-fundal-segment-text__line--paragraphized"),
    a.forEach((o, l) => {
      let m = document.createElement("div");
      ((m.className = "childhood-fundal-segment-text__paragraph"),
        l > 0 &&
          (e.appendChild(
            document.createTextNode(`

`),
          ),
          m.classList.add(
            "childhood-fundal-segment-text__paragraph--half-gap",
          )),
        (m.textContent = o.trim()),
        e.appendChild(m));
    }));
}
function Ai() {
  return '<div class="childhood-fundal-scroll-down-arrow__stack"><span class="childhood-fundal-scroll-down-arrow__chev"></span><span class="childhood-fundal-scroll-down-arrow__chev"></span><span class="childhood-fundal-scroll-down-arrow__chev"></span></div>';
}
function Ei() {
  return '<span class="childhood-fundal-page-next-pill"><span class="childhood-fundal-page-next-pill__label"></span><span class="childhood-fundal-page-next-pill__stack"><img class="childhood-fundal-page-next-pill__down" src="/scrolly/workshop/childhood/eyesbrain/down.png" alt="" aria-hidden="true" loading="eager" draggable="false"><img class="childhood-fundal-page-next-pill__hand" src="/scrolly/workshop/childhood/eyesbrain/hand.png" alt="" aria-hidden="true" loading="eager" draggable="false"><span class="childhood-fundal-page-next-pill__chev"></span><span class="childhood-fundal-page-next-pill__chev"></span><span class="childhood-fundal-page-next-pill__chev"></span></span></span>';
}
function Ri(e = "previous page") {
  return (
    '<span class="childhood-fundal-page-next-pill childhood-fundal-page-next-pill--previous"><span class="childhood-fundal-page-next-pill__stack"><span class="childhood-fundal-page-next-pill__chev"></span><span class="childhood-fundal-page-next-pill__chev"></span><span class="childhood-fundal-page-next-pill__chev"></span></span><span class="childhood-fundal-page-next-pill__label">' +
    e +
    "</span></span>"
  );
}
function qt(e, n = "stage", r = "") {
  if (!e) return;
  let a =
      String(n || "stage")
        .trim()
        .toLowerCase() === "page"
        ? "page"
        : "stage",
    o = String(r || "").trim();
  if (
    ((e.dataset.fundalAdvanceMode = a),
    e.classList.toggle(
      "childhood-fundal-scroll-down-arrow--page",
      a === "page",
    ),
    a === "page")
  ) {
    e.innerHTML = Ei();
    let l = e.querySelector(".childhood-fundal-page-next-pill__label");
    (l && (l.textContent = o || "Next page"),
      e.setAttribute("aria-label", o || "Next page"),
      (e.title = o || "Next page"));
    return;
  }
  ((e.innerHTML = Ai()),
    e.setAttribute("aria-label", o || "Next animation"),
    (e.title = o || "Next animation"));
}
function ha() {
  let e = document.createElement("button");
  return (
    (e.type = "button"),
    (e.className = "childhood-fundal-scroll-down-arrow"),
    (e.dataset.fundalStageNextBtn = "1"),
    (e.disabled = !0),
    qt(e, "stage", "Next animation"),
    e
  );
}
function Ti(e, n = null) {
  if (!e) return null;
  let r = e.parentElement || e;
  if (n && n.parentElement === r) return n;
  let a = r.querySelector(".childhood-fundal-scroll-down-arrow");
  if (a) return (a.parentElement !== r && r.appendChild(a), a);
  let o = n || ha();
  return (r.appendChild(o), o);
}
function Ci() {
  let e = document.createElement("button");
  return (
    (e.type = "button"),
    (e.className = "childhood-fundal-stage-replay-btn"),
    (e.dataset.fundalStageReplayBtn = "1"),
    e.setAttribute("aria-label", "Replay"),
    (e.title = "Replay"),
    e.setAttribute(
      "data-i18n",
      "i18nExtra.fundal_reflex.replay:aria-label;i18nExtra.fundal_reflex.replay:title",
    ),
    (e.innerHTML =
      '<img class="childhood-fundal-stage-replay-btn__icon" src="/images/icon/base/replay.webp" alt="" aria-hidden="true" draggable="false">'),
    (e.style.display = "none"),
    e
  );
}
function Ht(e, n = null) {
  if (!e) return null;
  if (n && n.parentElement === e) return n;
  let r = e.querySelector(".childhood-fundal-stage-replay-btn");
  if (r) return r;
  let a = n || Ci();
  return (e.appendChild(a), a);
}
function Mr(e) {
  e &&
    (e.replaceChildren(),
    e.classList.remove("childhood-fundal-segment-text--bullet-summary"),
    e.classList.add("is-empty"));
}
function jn(e, n, r = {}) {
  if (!e) return;
  let a = Array.isArray(n) ? n.map((o) => ct(o)).filter((o) => !!o) : [];
  if (
    (e.replaceChildren(),
    e.classList.toggle("is-empty", a.length === 0),
    e.classList.toggle(
      "childhood-fundal-segment-text--bullet-summary",
      r.bullet === !0 && a.length > 0,
    ),
    !!a.length)
  ) {
    if (r.bullet === !0) {
      let o = document.createElement("ul");
      ((o.className = "childhood-fundal-segment-text__bullet-list"),
        a.forEach((l) => {
          let m = document.createElement("li");
          ((m.className = "childhood-fundal-segment-text__bullet-item"),
            xn(l) &&
              m.classList.add("childhood-fundal-segment-text__line--tight"),
            wn(m, l),
            o.appendChild(m));
        }),
        e.appendChild(o));
      return;
    }
    a.forEach((o) => {
      let l = document.createElement("div");
      ((l.className = "childhood-fundal-segment-text__line"),
        xn(o) && l.classList.add("childhood-fundal-segment-text__line--tight"),
        wn(l, o),
        e.appendChild(l));
    });
  }
}
function _r(e) {
  if (!e) return;
  e.querySelector("[data-fundal-replay-btn]")?.remove();
  let r = e.querySelector(".eyes-topbar .eyes-topbar__title");
  r &&
    (r.classList.remove("childhood-fundal-title-toggle"),
    r.removeAttribute("role"),
    r.removeAttribute("tabindex"),
    r.removeAttribute("aria-label"),
    r.removeAttribute("aria-pressed"));
}
function zn(e, n) {
  if (!e) return;
  let r = String(n || "Replay").trim() || "Replay";
  (e.setAttribute("aria-label", r), (e.title = r));
}
function Zn(e) {
  let n = String(e || "").trim();
  return !n || !/\/data\.json(?:\?.*)?$/i.test(n)
    ? ""
    : n.replace(/\/data\.json(?:\?.*)?$/i, `/images/${Pa}`);
}
function er(e, n = 0) {
  return Ia
    ? v
      ? e?.disableIosFirstStagePoster === !0 && Number(n) === 0
      : !1
    : !0;
}
function Ft(e, n = {}) {
  if (typeof document > "u") return;
  let r = document.head || document.querySelector("head");
  if (!r) return;
  let a = String(e || "").trim();
  if (!a) return;
  let o = String(n.rel || "preload").trim() || "preload",
    l = String(n.as || "").trim(),
    m = `${o}|${l}|${a}`;
  if (Cr.has(m)) return;
  Cr.add(m);
  let c = document.createElement("link");
  ((c.rel = o), (c.href = a), l && (c.as = l));
  let f = String(n.fetchPriority || "").trim();
  (f && c.setAttribute("fetchpriority", f),
    n.crossOrigin
      ? (c.crossOrigin = String(n.crossOrigin))
      : l === "script" &&
        /^https?:\/\//i.test(a) &&
        (c.crossOrigin = "anonymous"),
    r.appendChild(c));
}
function Pi(e, n) {
  let r = String(n?.p || "").trim();
  if (!r) return "";
  if (/^(?:data:|blob:|https?:)?\/\//i.test(r)) return r;
  if (typeof window > "u") return "";
  let a = new URL(String(e || "").trim(), window.location.origin),
    l = `${String(n?.u || "").trim()}${r}`;
  return new URL(l, a).toString();
}
async function Ii(e) {
  let n = String(e || "").trim();
  if (!n || typeof fetch != "function") return [];
  if (qn.has(n)) return qn.get(n);
  let r = fetch(n, {
    method: "GET",
    credentials: "same-origin",
    cache: "force-cache",
  })
    .then(async (a) => {
      if (!a.ok) return [];
      let o = await a.json(),
        m = (Array.isArray(o?.assets) ? o.assets : [])
          .filter((c) =>
            !c || c.e === 1
              ? !1
              : typeof c.p == "string" && c.p.trim().length > 0,
          )
          .map((c) => Pi(n, c))
          .filter((c) => !!c);
      return Array.from(new Set(m));
    })
    .catch(() => []);
  return (qn.set(n, r), r);
}
function pa(e, n = {}) {
  let r = String(e || "").trim();
  if (!r || typeof Image > "u") return Promise.resolve(!1);
  if (Dn.has(r)) return Dn.get(r);
  let a = new Promise((o) => {
    let l = new Image();
    ((l.decoding = "async"), (l.loading = "eager"));
    let m = String(n.fetchPriority || "").trim();
    m && l.setAttribute("fetchpriority", m);
    let c = (f) => {
      ((l.onload = null), (l.onerror = null), o(f));
    };
    ((l.onload = () => c(!0)),
      (l.onerror = () => c(!1)),
      (l.src = r),
      l.complete && c(!0));
  });
  return (Dn.set(r, a), a);
}
async function tr(e, n = {}) {
  let r = await Ii(e);
  if (!r.length) return 0;
  let a = String(n.rel || "preload").trim() || "preload",
    o = String(n.fetchPriority || "").trim();
  if (
    (r.forEach((g, F) => {
      Ft(g, { rel: a, as: "image", fetchPriority: F < 4 ? o : "" });
    }),
    !(n.warmup !== !1))
  )
    return r.length;
  let m = Math.max(
      1,
      Math.min(
        r.length,
        Number.isFinite(Number(n.warmCount))
          ? Math.floor(Number(n.warmCount))
          : v
            ? 8
            : 6,
      ),
    ),
    c = Promise.allSettled(
      r.slice(0, m).map((g) => pa(g, { fetchPriority: o })),
    );
  if (n.awaitWarmup !== !0) return r.length;
  let f = Math.max(
    80,
    Math.min(
      2400,
      Number.isFinite(Number(n.timeoutMs))
        ? Math.floor(Number(n.timeoutMs))
        : v
          ? 1200
          : 800,
    ),
  );
  return (
    await Promise.race([c, new Promise((g) => setTimeout(g, f))]),
    r.length
  );
}
function ga(e, n = {}) {
  if (!e) return;
  let r = Array.isArray(e.paths)
    ? e.paths.map((c) => String(c || "").trim()).filter((c) => !!c)
    : [];
  if (!r.length) return;
  let o =
      String(n.mode || "route")
        .trim()
        .toLowerCase() === "idle",
    l = e.skipRouteImageWarmup === !0;
  o
    ? Ft(Qt, { rel: "prefetch", as: "script" })
    : Ft(Qt, { as: "script", fetchPriority: "high" });
  let m = r[0];
  if (
    (Ft(
      m,
      o
        ? { rel: "prefetch", as: "fetch" }
        : { as: "fetch", fetchPriority: "high" },
    ),
    l ||
      tr(
        m,
        o
          ? { rel: "prefetch", warmup: !1 }
          : {
              rel: "preload",
              fetchPriority: "high",
              warmup: !0,
              warmCount: v ? 8 : 6,
              awaitWarmup: !1,
            },
      ),
    er(e, 0) ||
      Ft(
        Zn(m),
        o
          ? { rel: "prefetch", as: "image" }
          : { as: "image", fetchPriority: "high" },
      ),
    !o)
  ) {
    Vi(e).forEach((c, f) => {
      (Ft(c, {
        rel: f < 4 ? "preload" : "prefetch",
        as: "image",
        fetchPriority: f < 4 ? "high" : "",
      }),
        pa(c, { fetchPriority: f < 4 ? "high" : "" }));
    });
    for (let c = 1; c < Math.min(r.length, 3); c += 1) {
      let f = r[c];
      (Ft(f, { rel: "prefetch", as: "fetch" }),
        l || tr(f, { rel: "prefetch", warmup: !1 }),
        er(e, c) || Ft(Zn(f), { rel: "prefetch", as: "image" }));
    }
  }
}
function Li(e, n = 0) {
  if (!e) return null;
  let r = document.createElement("img");
  return (
    (r.className = "childhood-fundal-prep-stage__poster"),
    (r.src = e),
    (r.alt = ""),
    r.setAttribute("aria-hidden", "true"),
    (r.decoding = "async"),
    (r.loading = n === 0 ? "eager" : "lazy"),
    n === 0 && r.setAttribute("fetchpriority", "high"),
    r
  );
}
function ki(e, n = {}) {
  if (!e) return;
  let r = e.querySelector(".childhood-fundal-prep-stage__poster"),
    a = () => {
      (e.classList.remove("childhood-fundal-prep-stage--loading"),
        e.classList.add("childhood-fundal-prep-stage--ready"),
        (e.dataset.posterHidden = "1"));
    };
  if (!r) {
    a();
    return;
  }
  let o = () => {
    (r.parentElement && r.parentElement.removeChild(r), a());
  };
  if (n.immediate === !0) {
    o();
    return;
  }
  (r.classList.add("is-fading-out"),
    r.addEventListener("transitionend", o, { once: !0 }),
    window.setTimeout(o, 260));
}
function Ze(e, n = {}) {
  let r = e?.stage;
  if (!r || r.dataset.posterHidden === "1" || H(e)) return !1;
  if (n.requireRichContent === !0 || (n.requireRichContent == null && v)) {
    let o = Number.isFinite(Number(n.minContentAreaRatio))
      ? Math.max(0.01, Number(n.minContentAreaRatio))
      : Number.isFinite(Number(e?.minContentAreaRatio))
        ? Math.max(0.01, Number(e.minContentAreaRatio))
        : 0.16;
    if (!ie(e, o)) return !1;
  }
  return (ki(r, n), !0);
}
function Nn(e) {
  let n = Number(e?.posterHideCheckRafId);
  if (Number.isFinite(n)) {
    try {
      cancelAnimationFrame(n);
    } catch {}
    e && (e.posterHideCheckRafId = null);
  }
}
function Jt(e, n = {}) {
  let r = e?.stage;
  if (!r || r.dataset.posterHidden === "1") return;
  Nn(e);
  let a = Math.max(
      1,
      Math.min(
        360,
        Number.isFinite(Number(n.checks))
          ? Math.floor(Number(n.checks))
          : v
            ? 240
            : 60,
      ),
    ),
    o = () => {
      if (!e?.stage || e.stage.dataset.posterHidden === "1") {
        e && (e.posterHideCheckRafId = null);
        return;
      }
      if (Ze(e, n) || a <= 1) {
        e.posterHideCheckRafId = null;
        return;
      }
      ((a -= 1), (e.posterHideCheckRafId = requestAnimationFrame(o)));
    };
  e.posterHideCheckRafId = requestAnimationFrame(o);
}
function Bi(e, n, r, a = null) {
  if (!e) return [];
  ((e.innerHTML = ""),
    e.parentElement
      ?.querySelector(":scope > .childhood-fundal-stage-top-nav")
      ?.remove());
  let o = [],
    m = (Array.isArray(a?.sections) ? a.sections : [])
      .map((F) => {
        let y = Number(F?.startIndex);
        if (!Number.isInteger(y) || y < 0 || y >= r) return null;
        let S = String(F?.title || n || "").trim();
        return S
          ? {
              startIndex: y,
              title: S,
              titleKey: String(F?.titleKey || "").trim(),
            }
          : null;
      })
      .filter((F) => !!F)
      .sort((F, y) => F.startIndex - y.startIndex),
    c = new Map(m.map((F) => [F.startIndex, F])),
    f = e,
    g = String(a?.routeName || "").trim();
  for (let F = 0; F < r; F += 1) {
    let y = c.get(F);
    if (y) {
      let U = document.createElement("section");
      U.className = "fundal-reflex-examination-section";
      let $ = document.createElement("div");
      $.className = "fundal-reflex-section-divider";
      let Z = document.createElement("h3");
      ((Z.className = "fundal-reflex-section-divider__title"),
        (Z.dataset.sectionTitle = y.title),
        a?.getSectionTitle && (Z.dataset.i18nSkip = "true"),
        (Z.textContent = a?.getSectionTitle?.(y.title, Rt(a)) || y.title),
        y.titleKey &&
          !a?.getSectionTitle &&
          Z.setAttribute("data-i18n", y.titleKey),
        $.appendChild(Z));
      let we = document.createElement("div");
      ((we.className = "fundal-reflex-examination-section-items"),
        U.appendChild($),
        U.appendChild(we),
        e.appendChild(U),
        (f = we));
    }
    let S = document.createElement("div");
    ((S.className = "childhood-fundal-prep-item"),
      (S.dataset.fileIndex = String(F)));
    let w = document.createElement("div");
    ((w.className = "childhood-fundal-prep-stage"),
      w.setAttribute("role", "img"),
      w.setAttribute("aria-label", `${n} animation ${F + 1}`),
      (w.dataset.fileIndex = String(F)));
    let _ = Fi(a, F);
    (S.style.setProperty("--fundal-stage-aspect-ratio", _ || "1169 / 1280"),
      _ &&
        ((w.style.aspectRatio = _),
        w.style.setProperty("--fundal-stage-aspect-ratio", _)));
    let L =
        Array.isArray(a?.paths) && typeof a.paths[F] == "string"
          ? a.paths[F]
          : "",
      A = Zn(L);
    if (A && !er(a, F)) {
      (w.classList.add("childhood-fundal-prep-stage--loading"),
        (w.dataset.posterHidden = "0"));
      let U = Li(A, F);
      U && w.appendChild(U);
    } else w.dataset.posterHidden = "1";
    let G = F === 0 && Jr(g) ? document.createElement("div") : null;
    if (G) {
      let U = "previous page";
      ((G.className = "childhood-fundal-stage-top-nav"),
        (G.innerHTML = `
        <button type="button" class="childhood-fundal-page-prev-pill-btn" data-fundal-page-prev-btn="1" aria-label="${U}" title="${U}">
          ${Ri(U)}
        </button>
      `),
        e.parentElement?.insertBefore(G, e));
    }
    let B = ha(),
      q = document.createElement("div");
    ((q.className = "childhood-fundal-segment-text"),
      q.setAttribute("aria-live", "polite"),
      S.appendChild(w),
      S.appendChild(q),
      S.appendChild(B),
      f.appendChild(S),
      o.push(w));
  }
  return o;
}
function ya(e, n) {
  if (!e) return null;
  let r = e
    .closest(".childhood-fundal-scroll-page")
    ?.querySelector(".childhood-fundal-stage-top-nav");
  return (
    r ||
    (!Array.isArray(n?.sections) || n.sections.length === 0
      ? e
      : e
          .closest(".fundal-reflex-examination-section")
          ?.querySelector(".fundal-reflex-section-divider") || e)
  );
}
async function ba() {
  if (window.lottie) return !0;
  window.__lottieLoadPromise ||
    (window.__lottieLoadPromise = new Promise((e, n) => {
      let r = new URL(Qt, window.location.origin).pathname,
        a = Array.from(document.querySelectorAll("script[src]")).find((l) => {
          let m = String(l.getAttribute("src") || "").trim();
          if (!m) return !1;
          if (m === Qt) return !0;
          try {
            return new URL(m, window.location.origin).pathname === r;
          } catch {
            return !1;
          }
        });
      if (a) {
        if (window.lottie) {
          e();
          return;
        }
        (a.addEventListener("load", e, { once: !0 }),
          a.addEventListener("error", n, { once: !0 }));
        return;
      }
      let o = document.createElement("script");
      ((o.src = Qt),
        (o.onload = e),
        (o.onerror = n),
        document.head.appendChild(o));
    }));
  try {
    await window.__lottieLoadPromise;
  } catch (e) {
    console.error("[fundalScroll] failed to load lottie", e);
  }
  return !!window.lottie;
}
function Mi(e, n) {
  if (!("IntersectionObserver" in window))
    return (n.forEach((o) => o.play()), null);
  let r = new Map();
  e.forEach((o, l) => {
    r.set(o, n[l]);
  });
  let a = new IntersectionObserver(
    (o) => {
      o.forEach((l) => {
        let m = r.get(l.target);
        m &&
          (l.isIntersecting && l.intersectionRatio >= 0.35
            ? m.play()
            : m.pause());
      });
    },
    { threshold: [0, 0.35, 0.7, 1], root: null, rootMargin: "0px" },
  );
  return (e.forEach((o) => a.observe(o)), a);
}
function Pt(e) {
  let n = Number(e?.animationData?.op);
  if (Number.isFinite(n) && n > 0) return Math.max(0, Math.floor(n - 1));
  let r = Number(e?.totalFrames);
  return Number.isFinite(r) && r > 0 ? Math.max(0, Math.floor(r - 1)) : 0;
}
function Fa(e, n) {
  let r = 0,
    a = n,
    o = !1;
  return (
    Array.isArray(e)
      ? ((r = Number(e[0])),
        e[1] == null ? (a = n) : ((a = Number(e[1])), (o = !0)))
      : e &&
        typeof e == "object" &&
        ((r = Number(e.from)),
        e.to == null ? (a = n) : ((a = Number(e.to)), (o = !0))),
    Number.isFinite(r) || (r = 0),
    Number.isFinite(a) || (a = n),
    (r = Math.max(0, Math.min(n, Math.floor(r)))),
    (a = Math.max(r, Math.min(n, Math.floor(a)))),
    { from: r, to: a, hasExplicitTo: o }
  );
}
function va(e, n, r) {
  let a = Pt(r),
    o = e.segmentRanges?.[n];
  return !Array.isArray(o) || o.length === 0
    ? [{ from: 0, to: a }]
    : o.map((l) => Fa(l, a));
}
function _i(e, n) {
  return (
    (Array.isArray(e?.autoplayLegacySegmentPlaybackByFile)
      ? e.autoplayLegacySegmentPlaybackByFile[n]
      : null) === !0
  );
}
function Or(e, n, r, a = []) {
  let o = Pt(r),
    l = Math.max(0, Math.min(o, Kr(e, n))),
    m = ja(e, n),
    c = Number.isFinite(m) ? Math.max(l, Math.min(o, m)) : o;
  if (
    (_i(e, n) || ma(e, n, a.length) || Gr(e, n, a.length)) &&
    Array.isArray(a) &&
    a.length > 0
  ) {
    let f = a
      .map((g) => ({ ...g }))
      .filter((g) => dt(g) >= l)
      .filter((g) => Number(g.from) <= c)
      .map((g, F) =>
        F === 0 && l > Number(g.from)
          ? { ...g, from: l, to: Math.min(dt(g), c) }
          : { ...g, to: Math.min(dt(g), c) },
      );
    if (f.length > 0) return f;
  }
  return [Fa({ from: l, to: c }, o)];
}
function Oi(e, n) {
  return (
    (Array.isArray(e?.preferLastVisibleCompletionFrameByFile)
      ? e.preferLastVisibleCompletionFrameByFile[n]
      : null) === !0
  );
}
function Hi(e, n) {
  return (
    (Array.isArray(e?.preserveCompletionSnapshotOverlayByFile)
      ? e.preserveCompletionSnapshotOverlayByFile[n]
      : null) === !0
  );
}
function qi(e, n) {
  return (
    (Array.isArray(e?.forceExactCompletionHoldFrameByFile)
      ? e.forceExactCompletionHoldFrameByFile[n]
      : null) === !0
  );
}
function Di(e, n) {
  let r = Array.isArray(e?.completionSnapshotImageByFile)
    ? e.completionSnapshotImageByFile[n]
    : null;
  return String(r ?? "").trim() || "";
}
function Sa(e, n) {
  let r = Array.isArray(e?.settleSnapshotImageByFile)
    ? e.settleSnapshotImageByFile[n]
    : null;
  if (!r || typeof r != "object" || Array.isArray(r)) return {};
  let a = {};
  return (
    Object.entries(r).forEach(([o, l]) => {
      let m = Math.floor(Number(o)),
        c = String(l ?? "").trim();
      !Number.isFinite(m) || !c || (a[String(m)] = c);
    }),
    a
  );
}
function xa(e, n) {
  let r = yr(e, n),
    a = e?.settleSnapshotImages || {},
    o = String(a[String(r)] || "").trim();
  if (o) return o;
  for (let l = 1; l <= 1; l += 1) {
    let m = String(a[String(r - l)] || "").trim();
    if (m) return m;
    let c = String(a[String(r + l)] || "").trim();
    if (c) return c;
  }
  return "";
}
function Vi(e) {
  let n = [];
  return (
    (Array.isArray(e?.completionSnapshotImageByFile)
      ? e.completionSnapshotImageByFile
      : []
    ).forEach((o) => {
      let l = String(o ?? "").trim();
      l && n.push(l);
    }),
    (Array.isArray(e?.settleSnapshotImageByFile)
      ? e.settleSnapshotImageByFile
      : []
    ).forEach((o) => {
      !o ||
        typeof o != "object" ||
        Object.values(o).forEach((l) => {
          let m = String(l ?? "").trim();
          m && n.push(m);
        });
    }),
    Array.from(new Set(n))
  );
}
function $t(e) {
  return e?.strictSegmentEndHold !== !1;
}
function An(e) {
  return e?.strictFrameLockNoFallback === !0;
}
function Ui(e) {
  return e?.persistentSettleSnapshotOverlay === !0;
}
function Pn(e, n) {
  return $t(e) ? n?.hasExplicitTo === !0 : !1;
}
function Vt(e, n) {
  let r = e?.richSettleContentFiles;
  return !Array.isArray(r) || r.length === 0 ? !1 : r.includes(n);
}
function En(e, n) {
  let r = Array.isArray(e?.richSettleMinAreaByFile)
      ? e.richSettleMinAreaByFile[n]
      : null,
    a = Number(r);
  return Number.isFinite(a) && a > 0 ? a : 0.16;
}
function dt(e) {
  if (!e) return 0;
  let n = Number.isFinite(Number(e.from)) ? Math.floor(Number(e.from)) : 0,
    r = Number.isFinite(Number(e.to)) ? Math.floor(Number(e.to)) : n;
  return Math.max(n, r);
}
function nt(e, n) {
  if (!n) return !1;
  let r = Number.isFinite(Number(n.from)) ? Math.floor(Number(n.from)) : 0,
    a = Number.isFinite(Number(n.to)) ? Math.floor(Number(n.to)) : r,
    o = Number(e);
  if (!Number.isFinite(o)) return !1;
  let l = Math.floor(o);
  return l >= r && l <= a;
}
function Wi(e, n, r, a) {
  if (Pn(e, a) || !v) return !1;
  let o = e?.iosAggressiveSettleSegments?.[n];
  return !Array.isArray(o) || o.length === 0 ? !1 : o.includes(r);
}
function wa(e, n, r, a) {
  let o = Number.isFinite(Number(a?.from)) ? Math.floor(Number(a.from)) : 0,
    l = Number.isFinite(Number(a?.to)) ? Math.floor(Number(a.to)) : o,
    m = Math.max(o, l);
  if (Pn(e, a)) return m;
  let f = e?.settleFrameOverrides?.[n],
    g = Array.isArray(f) ? f[r] : null,
    F = Math.max(0, l - o),
    y = m,
    S = !1;
  if (g == null || g === "last") {
    if (v) {
      let w = Math.max(2, Math.min(12, Math.floor(F * 0.02)));
      y = Math.max(o, l - w);
    }
  } else {
    let w = Number(g);
    Number.isFinite(w) &&
      ((y = Math.floor(w)),
      (S = y < o || y > l),
      S || (y = Math.max(o, Math.min(l, y))));
  }
  if (!S && Wi(e, n, r, a)) {
    let w = Math.max(8, Math.min(28, Math.floor(F * 0.1)));
    y = Math.max(o, y - w);
  }
  return S ? y : Math.max(o, Math.min(l, y));
}
function Na(e, n, r) {
  if (!e || !n) return { hidden: !0, opacity: 0 };
  let a = 1,
    o = e;
  for (; o && o.nodeType === 1; ) {
    let l = r.get(o);
    if (!l) {
      let m = window.getComputedStyle(o),
        c = Number.parseFloat(m?.opacity || "1");
      ((l = {
        hidden: !m || m.display === "none" || m.visibility === "hidden",
        opacity: Number.isFinite(c) ? Math.max(0, Math.min(1, c)) : 1,
      }),
        r.set(o, l));
    }
    if (l.hidden) return { hidden: !0, opacity: 0 };
    if (((a *= l.opacity), !Number.isFinite(a) || a <= 0.02))
      return { hidden: !0, opacity: 0 };
    if (o === n) break;
    o = o.parentElement;
  }
  return { hidden: !1, opacity: a };
}
function Hr(e, n, r = 0.5) {
  return !e || !n
    ? !1
    : e.right > n.left + r &&
        e.left < n.right - r &&
        e.bottom > n.top + r &&
        e.top < n.bottom - r;
}
function ji(e) {
  if (!e) return null;
  let n = e.viewBox?.baseVal,
    r = Number(n?.width),
    a = Number(n?.height);
  if (Number.isFinite(r) && r > 0.5 && Number.isFinite(a) && a > 0.5) {
    let f = Number.isFinite(Number(n?.x)) ? Number(n.x) : 0,
      g = Number.isFinite(Number(n?.y)) ? Number(n.y) : 0;
    return { left: f, top: g, right: f + r, bottom: g + a };
  }
  let o = Number(e.getAttribute("width")),
    l = Number(e.getAttribute("height")),
    m = Number.isFinite(o) && o > 0.5 ? o : Number(e.clientWidth || 0),
    c = Number.isFinite(l) && l > 0.5 ? l : Number(e.clientHeight || 0);
  return !Number.isFinite(m) || m <= 0.5 || !Number.isFinite(c) || c <= 0.5
    ? null
    : { left: 0, top: 0, right: m, bottom: c };
}
function zi(e, n, r = 0.5) {
  if (!e || typeof e.getBBox != "function") return !1;
  let a = null;
  try {
    a = e.getBBox();
  } catch {}
  if (!a || a.width <= 0.5 || a.height <= 0.5) return !1;
  let o = ji(n);
  if (!o) return !0;
  let l = a.x + a.width,
    m = a.y + a.height;
  return (
    l > o.left + r && a.x < o.right - r && m > o.top + r && a.y < o.bottom - r
  );
}
function pr(e) {
  return (
    e?.anim?.renderer?.svgElement || e?.stage?.querySelector?.("svg") || null
  );
}
function Yi(e) {
  let n = e?.anim?.renderer,
    r = n?.canvasContext?.canvas || n?.canvasElement || null;
  return r || e?.stage?.querySelector?.("canvas") || null;
}
function rt(e) {
  return pr(e) || Yi(e) || null;
}
function Ct(e) {
  return String(e?.tagName || "").toUpperCase() === "CANVAS";
}
function Rn(e) {
  if (!e) return null;
  let n = Number(e.width || 0),
    r = Number(e.height || 0);
  if (!Number.isFinite(n) || n <= 0 || !Number.isFinite(r) || r <= 0)
    return null;
  let a = document.createElement("canvas");
  ((a.width = n),
    (a.height = r),
    (a.style.display = "block"),
    (a.style.width = "100%"),
    (a.style.height = "100%"));
  try {
    let o = a.getContext("2d");
    return o ? (o.drawImage(e, 0, 0, n, r), a) : null;
  } catch {
    return null;
  }
}
function en(e, n = {}) {
  if (!e) return null;
  let r = Number(e.width || 0),
    a = Number(e.height || 0);
  if (!Number.isFinite(r) || r <= 0 || !Number.isFinite(a) || a <= 0)
    return null;
  let o = Math.max(
      12,
      Math.min(
        36,
        Number.isFinite(Number(n.sampleSize))
          ? Math.floor(Number(n.sampleSize))
          : 24,
      ),
    ),
    l = Math.max(
      1,
      Math.min(
        254,
        Number.isFinite(Number(n.alphaThreshold))
          ? Math.floor(Number(n.alphaThreshold))
          : 16,
      ),
    ),
    m = Math.max(
      180,
      Math.min(
        255,
        Number.isFinite(Number(n.nearWhiteThreshold))
          ? Math.floor(Number(n.nearWhiteThreshold))
          : 245,
      ),
    ),
    c = en._scratchCanvas;
  (c || ((c = document.createElement("canvas")), (en._scratchCanvas = c)),
    c.width !== o && (c.width = o),
    c.height !== o && (c.height = o));
  let f = c.getContext("2d", { willReadFrequently: !0 });
  if (!f) return null;
  f.clearRect(0, 0, o, o);
  try {
    f.drawImage(e, 0, 0, r, a, 0, 0, o, o);
  } catch {
    return null;
  }
  let g = null;
  try {
    g = f.getImageData(0, 0, o, o);
  } catch {
    return null;
  }
  if (!g?.data?.length) return null;
  let F = 0,
    y = 0,
    S = 0,
    w = g.data,
    _ = o * o;
  for (let B = 0; B < w.length; B += 4) {
    let q = w[B],
      U = w[B + 1],
      $ = w[B + 2];
    w[B + 3] <= l ||
      ((F += 1),
      (q < m || U < m || $ < m) && (y += 1),
      q <= 40 && U <= 40 && $ <= 40 && (S += 1));
  }
  let L = F / Math.max(1, _),
    A = y / Math.max(1, _),
    j = y / Math.max(1, F),
    G = S / Math.max(1, _);
  return {
    visibleCount: F,
    totalPixels: _,
    visibleRatio: L,
    nonWhiteRatio: A,
    nonWhiteAmongVisible: j,
    darkRatio: G,
  };
}
function H(e) {
  let n = rt(e);
  if (!n) return !0;
  let r = window.getComputedStyle(n);
  if (!r || r.display === "none" || r.visibility === "hidden") return !0;
  let a = Number.parseFloat(r.opacity || "1");
  if (Number.isFinite(a) && a <= 0.02) return !0;
  let o = n.getBoundingClientRect?.();
  if (!o || o.width <= 0.5 || o.height <= 0.5) return !0;
  if (Ct(n)) {
    let f = en(n, {
      sampleSize: 24,
      alphaThreshold: 16,
      nearWhiteThreshold: 246,
    });
    if (!f) return !1;
    let g = f.visibleRatio <= 0.01,
      F = f.visibleRatio <= 0.05 && f.nonWhiteRatio <= 0.015,
      y = f.visibleRatio >= 0.6 && f.nonWhiteAmongVisible <= 0.012;
    return g || F || y;
  }
  let l = pr(e);
  if (!l) return !0;
  let m = l.querySelectorAll(
    "image,path,rect,circle,ellipse,polygon,polyline,line,use,text",
  );
  if (!m.length) return !0;
  let c = new WeakMap();
  for (let f = 0; f < m.length; f += 1) {
    let g = m[f];
    if (!Na(g, l, c).hidden) {
      try {
        let y = g.getBoundingClientRect?.();
        if (!v) {
          if (!y || y.width <= 0.5 || y.height <= 0.5 || !Hr(y, o, 0.5))
            continue;
          return !1;
        }
        if (y && y.width > 0.5 && y.height > 0.5 && Hr(y, o, 0.5)) return !1;
      } catch {}
      if (zi(g, l, 0.5)) return !1;
    }
  }
  return !0;
}
function ie(e, n = 0.16) {
  let r = rt(e);
  if (!r) return !1;
  let a = window.getComputedStyle(r);
  if (!a || a.display === "none" || a.visibility === "hidden") return !1;
  let o = Number.parseFloat(a.opacity || "1");
  if (Number.isFinite(o) && o <= 0.02) return !1;
  let l = r.getBoundingClientRect?.();
  if (!l || l.width <= 0.5 || l.height <= 0.5) return !1;
  if (Ct(r)) {
    let S = en(r, {
      sampleSize: 24,
      alphaThreshold: 16,
      nearWhiteThreshold: 245,
    });
    if (!S) return !0;
    let w = Number.isFinite(Number(n)) ? Math.max(0.01, Number(n)) : 0.16,
      _ = Math.max(0.03, Math.min(0.35, w * 0.55)),
      L = Math.max(0.012, Math.min(0.2, w * 0.5));
    return !(
      S.visibleRatio < _ ||
      S.nonWhiteRatio < L ||
      S.nonWhiteAmongVisible < 0.045
    );
  }
  let m = pr(e);
  if (!m) return !1;
  let c = Math.max(1, l.width * l.height),
    f = m.querySelectorAll(
      "image,path,rect,circle,ellipse,polygon,polyline,line,use,text",
    );
  if (!f.length) return !1;
  let g = Number.isFinite(Number(n)) ? Math.max(0.01, Number(n)) : 0.16,
    F = 0,
    y = new WeakMap();
  for (let S = 0; S < f.length; S += 1) {
    let w = f[S];
    if (Na(w, m, y).hidden) continue;
    let L = w.getBoundingClientRect?.();
    if (!L || L.width <= 0.5 || L.height <= 0.5) continue;
    let A = Math.max(l.left, L.left),
      j = Math.min(l.right, L.right),
      G = Math.max(l.top, L.top),
      B = Math.min(l.bottom, L.bottom),
      q = j - A,
      U = B - G;
    if (!(q <= 0.5 || U <= 0.5) && ((F += (q * U) / c), F >= g)) return !0;
  }
  return F >= g;
}
function Me(e, n = {}) {
  if (!v) return !1;
  if (H(e)) return !0;
  if (n.requireRichContent !== !0) return !1;
  let r = Number.isFinite(Number(n.minContentAreaRatio))
    ? Math.max(0.01, Number(n.minContentAreaRatio))
    : Number.isFinite(Number(e?.minContentAreaRatio))
      ? Math.max(0.01, Number(e.minContentAreaRatio))
      : 0.16;
  return !ie(e, r);
}
function k(e) {
  let n = rt(e);
  n &&
    (aa &&
      (e?.stage &&
        ((e.stage.style.willChange = "transform"),
        (e.stage.style.transform = "translate3d(0,0,0)"),
        (e.stage.style.webkitTransform = "translate3d(0,0,0)"),
        (e.stage.style.backfaceVisibility = "hidden"),
        (e.stage.style.webkitBackfaceVisibility = "hidden")),
      (n.style.willChange = "transform, opacity"),
      (n.style.transform = "translate3d(0,0,0)"),
      (n.style.webkitTransform = "translate3d(0,0,0)"),
      (n.style.backfaceVisibility = "hidden"),
      (n.style.webkitBackfaceVisibility = "hidden")),
    (n.style.display = "block"),
    (n.style.visibility = "visible"),
    (n.style.opacity = "1"));
}
function De(e) {
  aa &&
    e &&
    (gn.has(e) ||
      (gn.add(e),
      requestAnimationFrame(() => {
        if (!e?.isConnected) {
          gn.delete(e);
          return;
        }
        let n = e.style.transform,
          r = e.style.webkitTransform;
        ((e.style.transform = "translate3d(0,0,0.001px)"),
          (e.style.webkitTransform = "translate3d(0,0,0.001px)"),
          requestAnimationFrame(() => {
            (e?.isConnected &&
              ((e.style.transform = n), (e.style.webkitTransform = r)),
              gn.delete(e));
          }));
      })));
}
function Yn(e, n = null, r = null) {
  let a = Number(e?.recoverySnapshotFrame),
    o = Number(e?.recoverySnapshotSegmentIndex),
    l = n != null && Number.isFinite(Number(n));
  if (
    (r != null &&
      Number.isFinite(Number(r)) &&
      Number.isFinite(o) &&
      Math.floor(o) > Math.floor(Number(r))) ||
    (l && Number.isFinite(a) && a > Number(n) + 1)
  )
    return null;
  let c = String(e?.recoverySnapshotCanvasDataUrl || "");
  if (c) {
    let y = document.createElement("img");
    return (
      (y.src = c),
      (y.alt = ""),
      y.setAttribute("aria-hidden", "true"),
      (y.style.display = "block"),
      (y.style.width = "100%"),
      (y.style.height = "100%"),
      y
    );
  }
  let f = String(e?.recoverySnapshotMarkup || "").trim();
  if (!f) return null;
  let g = document.createElement("template");
  g.innerHTML = f;
  let F = g.content.firstElementChild;
  return F
    ? ((F.style.display = "block"),
      (F.style.width = "100%"),
      (F.style.height = "100%"),
      F)
    : null;
}
function Pe(e, n = null) {
  let r = rt(e);
  if (!r || H(e)) return !1;
  let a = null;
  if (Ct(r)) {
    let c = Rn(r);
    if (c) {
      ((a = c),
        (e.recoverySnapshotMarkup = ""),
        (e.recoverySnapshotCanvasDataUrl = ""));
      try {
        e.recoverySnapshotCanvasDataUrl = c.toDataURL("image/png");
      } catch {}
    }
  } else {
    try {
      a = r.cloneNode(!0);
    } catch {}
    a &&
      ((a.style.display = "block"),
      (a.style.width = "100%"),
      (a.style.height = "100%"),
      (e.recoverySnapshotMarkup = a.outerHTML),
      (e.recoverySnapshotCanvasDataUrl = ""));
  }
  if (!a) return !1;
  let o = Math.floor(Number(e?.anim?.currentFrame)),
    l = Number.isFinite(Number(n)) ? Number(n) : o;
  Number.isFinite(l) && (e.recoverySnapshotFrame = V(e, l));
  let m = Number(e?.playingSegmentIndex);
  return (
    Number.isFinite(m) &&
      m >= 0 &&
      (e.recoverySnapshotSegmentIndex = Math.floor(m)),
    !0
  );
}
function Gi(e) {
  let n = e?.anim,
    r = e?.playingSegmentIndex,
    a = r == null || !Number.isFinite(Number(r)) ? null : Math.floor(Number(r)),
    o = e?.targetEndFrame,
    l = o == null || !Number.isFinite(Number(o)) ? null : Number(o);
  if (!n) return Yn(e, l, a);
  let m = rt(e);
  if (m && Pe(e)) {
    if (Ct(m)) {
      let f = Rn(m);
      if (f) return f;
    }
    let c = Yn(e, l, a);
    if (c) return c;
  }
  return Yn(e, l, a);
}
function gr(e) {
  let n = e?.stage;
  if (!n) return null;
  let r = e?.recoveryOverlayEl || null;
  return (
    (r && r.parentElement === n) ||
      ((r = document.createElement("div")),
      (r.className = "childhood-fundal-recovery-overlay"),
      r.setAttribute("aria-hidden", "true"),
      (r.style.position = "absolute"),
      (r.style.left = "0"),
      (r.style.top = "0"),
      (r.style.right = "0"),
      (r.style.bottom = "0"),
      (r.style.zIndex = "11"),
      (r.style.pointerEvents = "none"),
      (r.style.opacity = "0"),
      (r.style.visibility = "hidden"),
      (r.style.transition = "none"),
      (r.style.background = "transparent"),
      n.appendChild(r),
      (e.recoveryOverlayEl = r)),
    r
  );
}
function et(e) {
  let n = gr(e);
  if (!n) return !1;
  if (
    ((e.preserveRecoveryOverlay = !1),
    Number.isFinite(e?.recoveryOverlayClearTimer) &&
      (clearTimeout(e.recoveryOverlayClearTimer),
      (e.recoveryOverlayClearTimer = null)),
    e?.recoveryOverlayVisible &&
      n.style.visibility === "visible" &&
      n.childNodes.length > 0)
  )
    return ((n.style.opacity = "1"), !0);
  let r = Gi(e);
  return (
    r && n.replaceChildren(r),
    n.childNodes.length
      ? ((n.style.visibility = "visible"),
        (n.style.opacity = "1"),
        (e.recoveryOverlayVisible = !0),
        !0)
      : !1
  );
}
function qr(e, n) {
  let r = String(n || "").trim();
  if (!r) return !1;
  let a = gr(e);
  if (!a) return !1;
  Number.isFinite(e?.recoveryOverlayClearTimer) &&
    (clearTimeout(e.recoveryOverlayClearTimer),
    (e.recoveryOverlayClearTimer = null));
  let o = Aa(r);
  return o
    ? (a.replaceChildren(o),
      (a.style.visibility = "visible"),
      (a.style.opacity = "1"),
      (e.recoveryOverlayVisible = !0),
      (e.preserveRecoveryOverlay = !0),
      !0)
    : !1;
}
function Aa(e) {
  let n = String(e || "").trim();
  if (!n) return null;
  let r = document.createElement("img");
  return (
    (r.src = n),
    (r.alt = ""),
    r.setAttribute("aria-hidden", "true"),
    (r.decoding = "sync"),
    (r.loading = "eager"),
    (r.style.display = "block"),
    (r.style.width = "100%"),
    (r.style.height = "100%"),
    (r.style.objectFit = "contain"),
    (r.style.objectPosition = "center"),
    (r.style.pointerEvents = "none"),
    r
  );
}
function ge(e, n = {}) {
  let r = e?.recoveryOverlayEl;
  if (!r) return;
  let a = n?.immediate === !0;
  if (e?.preserveRecoveryOverlay && !a && n?.force !== !0) return;
  ((e.recoveryOverlayVisible = !1),
    (a || n?.force === !0) && (e.preserveRecoveryOverlay = !1),
    Number.isFinite(e?.recoveryOverlayClearTimer) &&
      (clearTimeout(e.recoveryOverlayClearTimer),
      (e.recoveryOverlayClearTimer = null)));
  let o = () => {
    !e ||
      e.recoveryOverlayVisible ||
      ((r.style.opacity = "0"),
      (r.style.visibility = "hidden"),
      r.replaceChildren());
  };
  if (a || r.style.transition === "none") {
    o();
    return;
  }
  ((r.style.opacity = "0"),
    (e.recoveryOverlayClearTimer = setTimeout(() => {
      ((e.recoveryOverlayClearTimer = null), o());
    }, 140)));
}
function Ve(e, n = {}) {
  if (!e) return;
  let r = Math.max(
      1,
      Math.min(
        8,
        Number.isFinite(Number(n.checks))
          ? Math.floor(Number(n.checks))
          : v
            ? 4
            : 2,
      ),
    ),
    a = Math.max(
      1,
      Math.min(
        4,
        Number.isFinite(Number(n.requiredStablePasses))
          ? Math.floor(Number(n.requiredStablePasses))
          : v
            ? 2
            : 1,
      ),
    ),
    o = r,
    l = 0,
    m = () => {
      if (!e) return;
      k(e);
      let c = H(e);
      if ((c ? (l = 0) : ((l += 1), Pe(e)), l >= a || o <= 1)) {
        c || ge(e);
        return;
      }
      ((o -= 1), requestAnimationFrame(m));
    };
  requestAnimationFrame(m);
}
function ut(e) {
  if (e?.persistentSettleSnapshotOverlay && !(e.isPlaying || e.isSnapping)) {
    if (H(e)) {
      if (tt(e)) {
        Ke(e);
        return;
      }
      et(e);
      return;
    }
    (Pe(e, e.lastRenderedFrame), ge(e, { immediate: !0 }));
  }
}
function tt(e) {
  return v && e?.preserveRecoveryOverlay !== !0 && Ct(rt(e));
}
function yr(e, n = null) {
  let r = [
    n,
    e?.activePauseFrame,
    e?.lastPinnedFrame,
    e?.targetEndFrame,
    e?.anim?.currentFrame,
    e?.lastRenderedFrame,
  ];
  for (let a = 0; a < r.length; a += 1) {
    let o = Number(r[a]);
    if (Number.isFinite(o)) return V(e, o);
  }
  return 0;
}
function Ki(e, n, r = {}) {
  if (!e?.anim) return null;
  let a = yr(e, n),
    o = Number.isFinite(Number(r.minContentAreaRatio))
      ? Math.max(0.01, Number(r.minContentAreaRatio))
      : Number.isFinite(Number(e.minContentAreaRatio))
        ? Number(e.minContentAreaRatio)
        : 0.16;
  try {
    (e.anim.pause?.(), e.anim.goToAndStop?.(a, !0));
  } catch {}
  (k(e), De(e.stage));
  let l = rt(e);
  if (!l) return null;
  let m = null;
  if (Ct(l)) {
    let f = en(l, {
      sampleSize: 24,
      alphaThreshold: 16,
      nearWhiteThreshold: 246,
    });
    (!f || !H(e) || f.nonWhiteRatio > 0.02 || f.nonWhiteAmongVisible > 0.03) &&
      (m = Rn(l));
  } else
    try {
      m = l.cloneNode(!0);
    } catch {}
  if (!m) return null;
  ((m.style.display = "block"),
    (m.style.width = "100%"),
    (m.style.height = "100%"),
    (e.recoverySnapshotFrame = a));
  let c = Number(e?.playingSegmentIndex);
  if (
    (Number.isFinite(c) &&
      c >= 0 &&
      (e.recoverySnapshotSegmentIndex = Math.floor(c)),
    Ct(m))
  ) {
    e.recoverySnapshotMarkup = "";
    try {
      e.recoverySnapshotCanvasDataUrl = m.toDataURL("image/png");
    } catch {
      e.recoverySnapshotCanvasDataUrl = "";
    }
  } else
    ((e.recoverySnapshotMarkup = m.outerHTML || ""),
      (e.recoverySnapshotCanvasDataUrl = ""));
  return m;
}
function Ke(e, n = null, r = {}) {
  if (!e?.anim) return 0;
  let a = yr(e, n),
    o = Number.isFinite(Number(r.minContentAreaRatio))
      ? Math.max(0.01, Number(r.minContentAreaRatio))
      : Number.isFinite(Number(e.minContentAreaRatio))
        ? Number(e.minContentAreaRatio)
        : 0.16;
  try {
    (e.anim.pause?.(), e.anim.goToAndStop?.(a, !0));
  } catch {}
  k(e);
  let l = gr(e),
    m = xa(e, a),
    c = m ? Aa(m) : Ki(e, a, { minContentAreaRatio: o });
  if (l && c) {
    e.recoverySnapshotFrame = a;
    let f = Number(e?.playingSegmentIndex);
    (Number.isFinite(f) &&
      f >= 0 &&
      (e.recoverySnapshotSegmentIndex = Math.floor(f)),
      Number.isFinite(e?.recoveryOverlayClearTimer) &&
        (clearTimeout(e.recoveryOverlayClearTimer),
        (e.recoveryOverlayClearTimer = null)),
      (e.preserveRecoveryOverlay = !1),
      l.replaceChildren(c),
      (l.style.visibility = "visible"),
      (l.style.opacity = "1"),
      (e.recoveryOverlayVisible = !0));
  } else ge(e, { immediate: !0, force: !0 });
  return (
    k(e),
    (e.lastPinnedFrame = a),
    De(e.stage),
    vt(e, a, {
      passes: Number.isFinite(Number(r.passes)) ? Number(r.passes) : v ? 5 : 2,
      attemptsPerPass: Number.isFinite(Number(r.attemptsPerPass))
        ? Number(r.attemptsPerPass)
        : v
          ? 2
          : 1,
      minContentAreaRatio: o,
      allowFrameShift: !1,
    }),
    a
  );
}
function Xt(e) {
  let n = Number(e?.arrowEnsureRafId);
  if (Number.isFinite(n)) {
    try {
      cancelAnimationFrame(n);
    } catch {}
    e && (e.arrowEnsureRafId = null);
  }
}
function xe(e) {
  let n = e?.stage;
  if (!n) return null;
  let r = Ti(n, e?.arrowEl || null);
  return r ? ((e.arrowEl = r), r) : null;
}
function V(e, n) {
  let r = Pt(e?.anim),
    a = Number(n);
  return Number.isFinite(a) ? Math.max(0, Math.min(r, Math.floor(a))) : 0;
}
function nr(e) {
  return dt(e);
}
function ye(e, n, r = {}) {
  let a = V(e, n),
    o = Pt(e?.anim),
    l = r.allowFrameShift !== !1,
    m = Math.max(
      1,
      Math.min(
        10,
        Number.isFinite(Number(r.attempts))
          ? Math.floor(Number(r.attempts))
          : v
            ? 6
            : 3,
      ),
    ),
    c = Number.isFinite(Number(r.minContentAreaRatio))
      ? Math.max(0.01, Number(r.minContentAreaRatio))
      : 0.16,
    f = !0;
  for (let g = 0; g < m; g += 1) {
    try {
      (e.anim.pause(), e.anim.goToAndStop(a, !0));
    } catch {}
    if ((k(e), (f = H(e)), !f)) break;
    if (l) {
      let F = Math.max(1, Math.min(12, g + 1)),
        y = Math.max(0, a - F),
        S = Math.min(o, a + F),
        w = g % 2 === 0 ? y : S;
      if (w !== a) {
        try {
          e.anim.goToAndStop(w, !0);
        } catch {}
        k(e);
        try {
          e.anim.goToAndStop(a, !0);
        } catch {}
        if ((k(e), (f = H(e)), !f)) break;
      }
      if (v && f) {
        let _ = Math.max(0, Math.min(o, g % 2 === 0 ? a - 8 : a + 8));
        if (_ !== a) {
          try {
            e.anim.goToAndStop(_, !0);
          } catch {}
          k(e);
          try {
            e.anim.goToAndStop(a, !0);
          } catch {}
          if ((k(e), (f = H(e)), !f)) break;
        }
      }
    }
    try {
      e.anim.resize?.();
    } catch {}
    k(e);
  }
  try {
    (e.anim.pause(), e.anim.goToAndStop(a, !0));
  } catch {}
  return (
    k(e),
    (f = H(e)),
    f
      ? v && (e.lastPinnedFrame = null)
      : ((e.lastVisibleFrame = a),
        (e.lastVisibleFrameEver = a),
        ie(e, c) &&
          ((e.lastRichVisibleFrame = a), (e.lastRichVisibleFrameEver = a)),
        (e.lastPinnedFrame = a),
        Pe(e, a)),
    { frame: a, isBlank: f }
  );
}
function vt(e, n, r = {}) {
  if (!e) return;
  let a = V(e, n),
    o = r.allowFrameShift !== !1,
    l = Math.max(
      1,
      Math.min(
        8,
        Number.isFinite(Number(r.passes))
          ? Math.floor(Number(r.passes))
          : v
            ? 5
            : 3,
      ),
    ),
    m = Math.max(
      1,
      Math.min(
        5,
        Number.isFinite(Number(r.attemptsPerPass))
          ? Math.floor(Number(r.attemptsPerPass))
          : v
            ? 3
            : 2,
      ),
    ),
    c = Number.isFinite(Number(r.minContentAreaRatio))
      ? Math.max(0.01, Number(r.minContentAreaRatio))
      : 0.16,
    f = Number(e.segmentIndex),
    g = l,
    F = () => {
      !e ||
        e.isPlaying ||
        (Number.isFinite(f) && Number(e.segmentIndex) !== f) ||
        (ye(e, a, { attempts: m, minContentAreaRatio: c, allowFrameShift: o }),
        (g -= 1),
        g > 0 && requestAnimationFrame(F));
    };
  requestAnimationFrame(F);
}
function $i() {
  return new Promise((e) => {
    requestAnimationFrame(() => e());
  });
}
async function Ea(e, n, r, a = {}) {
  if (!e) return { frame: 0, isBlank: !0 };
  let o = V(e, r),
    l = Array.isArray(e?.segments) ? e.segments.length : 0,
    m = Number(e?.segmentIndex),
    c =
      l > 0 && Number.isFinite(m)
        ? Math.max(0, Math.min(l - 1, Math.floor(m)))
        : -1,
    f = Vt(n, e.fileIndex),
    g = Number.isFinite(Number(a.minContentAreaRatio))
      ? Math.max(0.01, Number(a.minContentAreaRatio))
      : 0.16,
    F = Math.max(
      1,
      Math.min(
        6,
        Number.isFinite(Number(a.settlePasses))
          ? Math.floor(Number(a.settlePasses))
          : 2,
      ),
    ),
    y = !1,
    S = () =>
      tt(e)
        ? (Ke(e, o, { minContentAreaRatio: g }), !1)
        : y
          ? !0
          : ((y = et(e)), y),
    w = () => {
      c < 0 || e.strictFallbackFrameBySegment?.delete?.(c);
    },
    _ = ye(e, o, {
      attempts: v ? 3 : 2,
      minContentAreaRatio: g,
      allowFrameShift: !1,
    });
  if (!_.isBlank && !Me(e, { requireRichContent: f, minContentAreaRatio: g }))
    return (
      w(),
      y && Ve(e),
      vt(e, o, {
        passes: F,
        attemptsPerPass: 2,
        minContentAreaRatio: g,
        allowFrameShift: !1,
      }),
      { frame: o, isBlank: !1 }
    );
  S();
  for (let L = 0; L < F; L += 1)
    if (
      (await $i(),
      (_ = ye(e, o, {
        attempts: 1,
        minContentAreaRatio: g,
        allowFrameShift: !1,
      })),
      !_.isBlank && !Me(e, { requireRichContent: f, minContentAreaRatio: g }))
    )
      return (
        w(),
        y && Ve(e),
        vt(e, o, {
          passes: F,
          attemptsPerPass: v ? 2 : 1,
          minContentAreaRatio: g,
          allowFrameShift: !1,
        }),
        { frame: o, isBlank: !1 }
      );
  if (
    n?.strictFrameRemountOnBlank !== !1 &&
    typeof e.remountAtFrame == "function" &&
    !e.isRemounting
  )
    try {
      if (
        (await e.remountAtFrame(o, { timeoutMs: v ? 650 : 900 })) &&
        ((_ = ye(e, o, {
          attempts: v ? 3 : 2,
          minContentAreaRatio: g,
          allowFrameShift: !1,
        })),
        !_.isBlank && !Me(e, { requireRichContent: f, minContentAreaRatio: g }))
      )
        return (
          w(),
          y && Ve(e),
          vt(e, o, {
            passes: F,
            attemptsPerPass: 2,
            minContentAreaRatio: g,
            allowFrameShift: !1,
          }),
          { frame: o, isBlank: !1 }
        );
    } catch {}
  return (
    c >= 0 && (w(), e.resolvedFrameBySegment?.set(c, o)),
    { frame: o, isBlank: !0 }
  );
}
function Xi(e, n, r, a = {}) {
  e &&
    (e.isLockedExactRecovering ||
      ((e.isLockedExactRecovering = !0),
      Ea(e, n, r, a)
        .then((o) => {
          e &&
            (o?.isBlank
              ? tt(e)
                ? Ke(e, r, { minContentAreaRatio: a.minContentAreaRatio })
                : et(e)
              : Ve(e),
            ut(e));
        })
        .finally(() => {
          e && (e.isLockedExactRecovering = !1);
        })));
}
function tn(e, n) {
  let r = e?.strictRecoveryRafBySegment;
  if (!r) return;
  let a = Number(n);
  if (!Number.isFinite(a)) return;
  let o = Number(r.get(a));
  if (Number.isFinite(o))
    try {
      cancelAnimationFrame(o);
    } catch {}
  r.delete(a);
}
function Dr(e) {
  let n = e?.strictRecoveryRafBySegment;
  n &&
    (n.forEach((r) => {
      let a = Number(r);
      if (Number.isFinite(a))
        try {
          cancelAnimationFrame(a);
        } catch {}
    }),
    n.clear());
}
function Ra(e, n, r, a, o, l = {}) {
  if (!e || !r) return;
  let m = Number(n);
  if (!Number.isFinite(m)) return;
  let c = e.strictRecoveryRafBySegment;
  if (!c || Number.isFinite(Number(c.get(m)))) return;
  let f = V(e, a),
    g = nt(o, r) ? V(e, o) : null,
    F = e?.requireRichContent === !0,
    y = Number.isFinite(Number(l.minContentAreaRatio))
      ? Math.max(0.01, Number(l.minContentAreaRatio))
      : 0.16,
    S = Math.max(
      1,
      Math.min(
        40,
        Number.isFinite(Number(l.passes))
          ? Math.floor(Number(l.passes))
          : v
            ? 20
            : 10,
      ),
    ),
    w = Math.max(
      1,
      Math.min(
        5,
        Number.isFinite(Number(l.attemptsPerPass))
          ? Math.floor(Number(l.attemptsPerPass))
          : v
            ? 3
            : 2,
      ),
    ),
    _ = () => {
      tn(e, m);
    },
    L = () => {
      if (!e || e.isPlaying) {
        _();
        return;
      }
      if (Number(e.segmentIndex) !== m) {
        _();
        return;
      }
      if (
        !ye(e, f, { attempts: w, minContentAreaRatio: y }).isBlank &&
        !Me(e, { requireRichContent: F, minContentAreaRatio: y })
      ) {
        (e.strictFallbackFrameBySegment?.delete?.(m),
          e.resolvedFrameBySegment?.set(m, f),
          _(),
          vt(e, f, {
            passes: v ? 6 : 3,
            attemptsPerPass: v ? 3 : 2,
            minContentAreaRatio: y,
          }));
        return;
      }
      if (
        (Number.isFinite(g) &&
          (ye(e, g, { attempts: 1, minContentAreaRatio: y }),
          e.strictFallbackFrameBySegment?.set(m, g),
          e.resolvedFrameBySegment?.set(m, f)),
        (S -= 1),
        S <= 0)
      ) {
        _();
        return;
      }
      let G = requestAnimationFrame(L);
      c.set(m, G);
    },
    A = requestAnimationFrame(L);
  c.set(m, A);
}
function In(e, n, r, a = {}) {
  let o = Number.isFinite(Number(n?.from)) ? Math.floor(Number(n.from)) : 0,
    l = Number.isFinite(Number(n?.to)) ? Math.floor(Number(n.to)) : o,
    m = Number.isFinite(Number(a.minContentAreaRatio))
      ? Math.max(0.01, Number(a.minContentAreaRatio))
      : 0.16,
    c = !!a.requireRichContent,
    f = Math.max(o, Math.min(l, V(e, r)));
  for (let g = 0; f - g >= o; g += 1) {
    let F = f - g;
    try {
      (e.anim.goToAndStop(F, !0), k(e));
    } catch {}
    if (!H(e) && !(c && !ie(e, m))) return F;
  }
  for (let g = f + 1; g <= l; g += 1) {
    try {
      (e.anim.goToAndStop(g, !0), k(e));
    } catch {}
    if (!H(e) && !(c && !ie(e, m))) return g;
  }
  return f;
}
function Ta(e, n, r, a = {}) {
  let o = !!a.requireRichContent,
    l = Number.isFinite(Number(a.minContentAreaRatio))
      ? Math.max(0.01, Number(a.minContentAreaRatio))
      : 0.16,
    m = Number.isFinite(Number(n?.from)) ? Math.floor(Number(n.from)) : 0,
    c = Number.isFinite(Number(n?.to)) ? Math.floor(Number(n.to)) : m,
    f = Math.max(0, Math.min(14, c - m));
  for (let y = 0; y <= f; y += 1) {
    let S = c - y;
    try {
      (e.anim.goToAndStop(S, !0), k(e));
    } catch {}
    if (!H(e) && !(o && !ie(e, l))) return V(e, S);
  }
  let g = [
    e?.lastVisibleFrame,
    e?.lastRenderedFrame,
    e?.lastPinnedFrame,
    e?.lastVisibleFrameEver,
  ];
  for (let y = 0; y < g.length; y += 1) {
    let S = Number(g[y]);
    if (Number.isFinite(S) && nt(S, n)) return V(e, S);
  }
  let F = In(e, n, r, { requireRichContent: o, minContentAreaRatio: l });
  if ((nt(F, n) || (F = dt(n)), H(e))) {
    let y = St(e, F, { requireRichContent: o, minContentAreaRatio: l });
    if (nt(y, n)) return V(e, y);
  }
  return V(e, F);
}
function St(e, n, r = {}) {
  let a = Pt(e?.anim),
    o = V(e, n),
    l = !!r.requireRichContent,
    m = Number.isFinite(Number(r.minContentAreaRatio))
      ? Math.max(0.01, Number(r.minContentAreaRatio))
      : 0.16;
  for (let c = 0; c <= a; c += 1) {
    let f = o - c;
    if (f >= 0) {
      try {
        (e.anim.goToAndStop(f, !0), k(e));
      } catch {}
      if (H(e)) continue;
      let y = ie(e, m);
      if (l && !y) continue;
      return (
        (e.lastVisibleFrame = f),
        (e.lastVisibleFrameEver = f),
        y && ((e.lastRichVisibleFrame = f), (e.lastRichVisibleFrameEver = f)),
        f
      );
    }
    let g = o + c;
    if (c === 0 || g > a) continue;
    try {
      (e.anim.goToAndStop(g, !0), k(e));
    } catch {}
    if (H(e)) continue;
    let F = ie(e, m);
    if (!(l && !F))
      return (
        (e.lastVisibleFrame = g),
        (e.lastVisibleFrameEver = g),
        F && ((e.lastRichVisibleFrame = g), (e.lastRichVisibleFrameEver = g)),
        g
      );
  }
  return o;
}
function Tn(e, n, r, a = {}) {
  let o = Number.isFinite(Number(n?.from)) ? Math.floor(Number(n.from)) : 0,
    l = Number.isFinite(Number(n?.to)) ? Math.floor(Number(n.to)) : o,
    m = !!a.allowOutsideSegment,
    c = !!a.requireRichContent,
    f = Number.isFinite(Number(a.minContentAreaRatio))
      ? Math.max(0.01, Number(a.minContentAreaRatio))
      : 0.16,
    g = m ? 0 : o,
    F = m ? Pt(e?.anim) : l,
    y = Number.isFinite(Number(r)) ? Math.floor(Number(r)) : l;
  y = Math.max(g, Math.min(F, y));
  let S = Math.max(0, y - g);
  for (let L = 0; L <= S; L += 1) {
    let A = y - L;
    try {
      (e.anim.goToAndStop(A, !0), k(e));
    } catch {}
    if (!H(e) && !(c && !ie(e, f)) && !H(e))
      return (
        (e.lastVisibleFrame = A),
        (e.lastVisibleFrameEver = A),
        ie(e, f) &&
          ((e.lastRichVisibleFrame = A), (e.lastRichVisibleFrameEver = A)),
        A
      );
  }
  let w = Number(e?.lastVisibleFrame);
  if (Number.isFinite(w)) {
    let L = Math.max(g, Math.min(F, Math.floor(w)));
    try {
      (e.anim.goToAndStop(L, !0), k(e));
    } catch {}
    if (!H(e) && (!c || ie(e, f))) return L;
  }
  let _ = Number(e?.lastVisibleFrameEver);
  if (Number.isFinite(_)) {
    let L = V(e, _);
    try {
      (e.anim.goToAndStop(L, !0), k(e));
    } catch {}
    if (!H(e) && (!c || ie(e, f))) return L;
  }
  if (c) {
    let L = Number(e?.lastRichVisibleFrame);
    if (Number.isFinite(L)) {
      let j = Math.max(g, Math.min(F, Math.floor(L)));
      try {
        (e.anim.goToAndStop(j, !0), k(e));
      } catch {}
      if (!H(e) && ie(e, f)) return j;
    }
    let A = Number(e?.lastRichVisibleFrameEver);
    if (Number.isFinite(A)) {
      let j = V(e, A);
      try {
        (e.anim.goToAndStop(j, !0), k(e));
      } catch {}
      if (!H(e) && ie(e, f)) return j;
    }
  }
  return St(e, y, { requireRichContent: c, minContentAreaRatio: f });
}
function Vr(e, n) {
  let r = e.segments[n];
  if (!r) return !1;
  let a = Number(e?.recoverySnapshotFrame);
  (Number.isFinite(a) &&
    a > Number(r.to) + 1 &&
    ((e.recoverySnapshotMarkup = ""),
    (e.recoverySnapshotCanvasDataUrl = ""),
    (e.recoverySnapshotFrame = null)),
    ge(e, { immediate: !0 }),
    tn(e, n),
    e.strictFallbackFrameBySegment?.delete?.(n));
  let o =
    Array.isArray(e.segmentStartTexts) &&
    n >= 0 &&
    n < e.segmentStartTexts.length
      ? e.segmentStartTexts[n]
      : "";
  (e.setSegmentText?.(o),
    e.hideDownArrow?.(),
    (e.playingSegmentIndex = n),
    (e.targetEndFrame = r.to),
    (e.isPlaying = !0),
    e.cancelIosPostSettleRefresh?.(),
    (e.lastRenderedFrame = r.from),
    (e.lastPinnedFrame = null));
  try {
    e.startCenterLock?.();
  } catch {}
  return (
    e.setPlaybackViewportFreeze?.(!0),
    k(e),
    e.anim.goToAndStop(r.from, !0),
    e.anim.playSegments([r.from, r.to], !0),
    !0
  );
}
function Qi(e, n) {
  if (!e.ready || e.segments.length === 0 || e.isSnapping) return !1;
  if (n > 0) {
    let a = e.segmentIndex + 1;
    return a < e.segments.length ? Vr(e, a) : !1;
  }
  let r = e.segmentIndex - 1;
  return r >= 0 ? Vr(e, r) : !1;
}
function Ur(e, n) {
  if (!e.isPlaying || e.isSnapping) return;
  e.isSnapping = !0;
  let r = e.playingSegmentIndex,
    a = e.segments[e.playingSegmentIndex] || null,
    o = Pn(n, a),
    l = a ? wa(n, e.fileIndex, r, a) : null,
    m =
      a && Number.isFinite(Number(l))
        ? Number(l) < a.from || Number(l) > a.to
        : !1,
    c = Vt(n, e.fileIndex),
    f = En(n, e.fileIndex),
    g = 0;
  (!a &&
    Number.isFinite(e.targetEndFrame) &&
    (g = Math.max(0, Math.floor(e.targetEndFrame))),
    o && a && (g = nr(a)));
  let F = o ? An(n) : !1;
  (F
    ? (Pe(e, e.lastRenderedFrame),
      v && tt(e)
        ? Ke(e, g, { minContentAreaRatio: f })
        : v
          ? et(e)
          : ge(e, { immediate: !0 }))
    : ge(e, { immediate: !0 }),
    (e.isPlaying = !1),
    (e.segmentIndex = e.playingSegmentIndex),
    (e.targetEndFrame = null));
  try {
    e.stopCenterLock?.();
  } catch {}
  try {
    e.anim.pause();
  } catch {}
  requestAnimationFrame(async () => {
    try {
      if (o && a) {
        let S = nr(a);
        if ((tn(e, r), (g = S), e.resolvedFrameBySegment?.set(r, S), F)) {
          e.strictFallbackFrameBySegment?.delete?.(r);
          let w = await Ea(e, n, S, { minContentAreaRatio: f });
          ((g = w.frame),
            e.resolvedFrameBySegment?.set(r, S),
            w?.isBlank ||
              Ve(e, { checks: v ? 5 : 3, requiredStablePasses: 2 }));
        } else {
          e.strictFallbackFrameBySegment?.delete?.(r);
          let w = ye(e, S, { attempts: v ? 10 : 6, minContentAreaRatio: f }),
            _ = Me(e, { requireRichContent: c, minContentAreaRatio: f });
          if (w.isBlank || _) {
            let L = Ta(e, a, S, {
              requireRichContent: c,
              minContentAreaRatio: f,
            });
            ((g = L), e.strictFallbackFrameBySegment?.set(r, L));
            let A = ye(e, L, { attempts: v ? 8 : 5, minContentAreaRatio: f }),
              j = Me(e, { requireRichContent: c, minContentAreaRatio: f });
            if (A.isBlank || j) {
              let G = In(e, a, S, {
                requireRichContent: c,
                minContentAreaRatio: f,
              });
              (nt(G, a) || (G = L),
                (g = G),
                e.strictFallbackFrameBySegment?.set(r, G),
                ye(e, G, { attempts: v ? 10 : 6, minContentAreaRatio: f }));
            }
            Ra(e, r, a, S, g, {
              passes: v ? 24 : 12,
              attemptsPerPass: v ? 3 : 2,
              minContentAreaRatio: f,
            });
          } else
            ((g = S),
              e.strictFallbackFrameBySegment?.delete?.(r),
              vt(e, S, {
                passes: v ? 10 : 4,
                attemptsPerPass: v ? 4 : 2,
                minContentAreaRatio: f,
                allowFrameShift: !1,
              }));
        }
        e.resolvedFrameBySegment?.set(r, S);
      } else {
        (a &&
          ((g = Tn(e, a, l, {
            allowOutsideSegment: m,
            requireRichContent: c,
            minContentAreaRatio: f,
          })),
          e.resolvedFrameBySegment?.set(r, g)),
          e.anim.goToAndStop(g, !0),
          k(e));
        let S = c && !H(e) && !ie(e, f);
        ((H(e) || S) &&
          (a &&
            (g = Tn(e, a, l, {
              allowOutsideSegment: m,
              requireRichContent: c,
              minContentAreaRatio: f,
            })),
          (g = St(e, g, { requireRichContent: c, minContentAreaRatio: f })),
          e.anim.goToAndStop(g, !0),
          k(e)),
          H(e) ||
            ((e.lastVisibleFrame = g),
            (e.lastVisibleFrameEver = g),
            (e.lastPinnedFrame = g)));
      }
      !Ze(e, {
        immediate: !0,
        requireRichContent: v,
        minContentAreaRatio: e.minContentAreaRatio,
      }) &&
        e.stage?.dataset?.posterHidden !== "1" &&
        Jt(e, {
          requireRichContent: v,
          minContentAreaRatio: e.minContentAreaRatio,
          checks: v ? 220 : 45,
        });
    } finally {
      ((e.isSnapping = !1),
        e.setPlaybackViewportFreeze?.(!1),
        ut(e),
        De(e?.stage),
        v &&
          Number.isFinite(Number(g)) &&
          e.requestIosPostSettleRefresh?.(g, {
            segmentIndex: e.segmentIndex,
            minContentAreaRatio: f,
            passes: 8,
            intervalMs: 40,
            attemptsPerTick: 4,
          }),
        (e.inputLockUntil = Date.now() + (v ? 1400 : 1500)));
      try {
        e.onSegmentSettled?.();
      } catch {}
      e.pendingDir = 0;
    }
  });
}
function Ji(e) {
  let n = window.innerHeight || document.documentElement.clientHeight || 0,
    r = n / 2,
    a = -1,
    o = Number.POSITIVE_INFINITY;
  return (
    e.forEach((l, m) => {
      if (!l.ready) return;
      let c = l.stage.getBoundingClientRect();
      if (c.bottom <= 0 || c.top >= n) return;
      let f = (c.top + c.bottom) / 2,
        g = Math.abs(f - r);
      g < o && ((o = g), (a = m));
    }),
    a
  );
}
function Zi(e, n, r) {
  let a = 0,
    o = !1,
    l = e.segmentTextToggleOnTitle === !0,
    m = !0,
    c = null,
    f = !1,
    g = () => {
      let p = n.querySelector(".eyes-topbar")?.getBoundingClientRect?.().height;
      return Number.isFinite(p) && p > 0 ? p : 56;
    },
    F = () => {
      if (f) return;
      let i = e?.pageId;
      i &&
        ((f = !0),
        document.dispatchEvent(
          new CustomEvent("childhoodWorkshop:route-complete", {
            detail: { target: i },
          }),
        ));
    },
    y = (i) => {
      ((m = i !== !1),
        n.classList.toggle("childhood-fundal-segment-text-hidden", !m));
    },
    S = (i) => {
      let p = xe(i),
        u = i?.stage;
      if (!p || !u) return;
      if (!Dt()) {
        (p.style.removeProperty("--fundal-arrow-right"),
          p.style.removeProperty("--fundal-arrow-bottom"));
        return;
      }
      let I = rt(i) || u.querySelector("canvas");
      if (!I) return;
      let N = u.getBoundingClientRect?.(),
        C = I.getBoundingClientRect?.();
      if (!N || !C || N.width <= 0.5 || C.width <= 0.5) return;
      let ne = 10,
        Q = 10;
      if (la() && String(I?.tagName || "").toUpperCase() === "SVG") {
        let R = I.viewBox?.baseVal,
          M = Number(R?.width),
          T = Number(R?.height);
        if (Number.isFinite(M) && M > 0 && Number.isFinite(T) && T > 0) {
          let J = Math.min(N.width / M, N.height / T),
            Be = M * J,
            ae = T * J,
            te = Math.max(0, (N.width - Be) / 2),
            fe = Math.max(0, (N.height - ae) / 2);
          ((ne = Math.max(10, Math.round(te + 10))),
            (Q = Math.max(10, Math.round(fe + 10))));
        }
      } else
        ((ne = Math.max(10, Math.round(N.right - C.right + 10))),
          (Q = Math.max(10, Math.round(N.bottom - C.bottom + 10))));
      (p.style.setProperty("--fundal-arrow-right", `${ne}px`),
        p.style.setProperty("--fundal-arrow-bottom", `${Q}px`));
    },
    w = () => {
      B.forEach((i) => {
        S(i);
      });
    },
    _ = () => {
      if (!l) return;
      let i = n.querySelector(".eyes-topbar .eyes-topbar__title");
      if (!i) return;
      (i.classList.add("childhood-fundal-title-toggle"),
        i.setAttribute("role", "button"),
        i.setAttribute("tabindex", "0"),
        i.setAttribute(
          "aria-label",
          "Toggle preparation guidance text on or off",
        ),
        i.setAttribute("aria-pressed", m ? "true" : "false"));
      let p = (u) => {
        if (u?.type === "keydown") {
          let N = u.key || "";
          if (N !== "Enter" && N !== " ") return;
          u.preventDefault();
        }
        let I = !m;
        (y(I), i.setAttribute("aria-pressed", I ? "true" : "false"));
      };
      (i.addEventListener("click", p),
        i.addEventListener("keydown", p),
        (c = () => {
          (i.removeEventListener("click", p),
            i.removeEventListener("keydown", p),
            i.classList.remove("childhood-fundal-title-toggle"),
            i.removeAttribute("role"),
            i.removeAttribute("tabindex"),
            i.removeAttribute("aria-label"),
            i.removeAttribute("aria-pressed"));
        }));
    },
    L = (i) => {
      let p = i.getBoundingClientRect(),
        u = window.scrollY + p.top,
        I = window.innerHeight || document.documentElement.clientHeight || 0,
        N = g(),
        C = Number(i?.dataset?.fileIndex);
      if (Sn(e)) return Math.max(0, u - N);
      if (Dt()) {
        let T = Number.isFinite(C) ? oa(e, C) : 18;
        return Math.max(0, u - N - T);
      }
      let ne = u + p.height / 2,
        Q = Math.max(0, I - N),
        R = N + Q / 2,
        M = Number.isFinite(C) ? ia(e, C) : 0;
      if (hr() && Number.isFinite(C) && C > 0) {
        let J = r?.[0]?.getBoundingClientRect?.(),
          Be = Number(J?.height),
          ae = Number(p?.height);
        (Number.isFinite(Be) &&
          Be > 0 &&
          Number.isFinite(ae) &&
          ae > 0 &&
          (M += (ae - Be) / 2),
          (M -= 24));
      }
      return Math.max(0, ne - R - M);
    },
    A = (i) => {
      let p = L(i),
        u = window.scrollY || window.pageYOffset || 0;
      Math.abs(p - u) <= 1 || window.scrollTo({ top: p, behavior: "auto" });
    },
    j = () => {
      let i = r[0];
      if (!i) return;
      let p = ya(i, e),
        u = g(),
        I = p === i ? (Sn(e) ? 0 : sa(e)) : 0,
        N = p.getBoundingClientRect(),
        C = window.scrollY + N.top,
        ne = Math.max(0, C - u - I);
      (window.scrollTo({ top: ne, behavior: "auto" }), (a = 0));
    },
    G = () => {
      o || ((o = !0), requestAnimationFrame(() => requestAnimationFrame(j)));
    },
    B = r.map((i, p) => {
      let u = {
        stage: i,
        anim: null,
        fileIndex: p,
        arrowEl:
          i.parentElement?.querySelector(
            ".childhood-fundal-scroll-down-arrow",
          ) || null,
        segmentTextEl:
          i.parentElement?.querySelector(".childhood-fundal-segment-text") ||
          null,
        segmentStartTexts: Xn(e, p),
        segmentTextTriggerFrames: Qn(e, p),
        finalSummaryBulletLines: Jn(e, p),
        segmentTextMode: ua(e, p),
        settleSnapshotImages: Sa(e, p),
        segmentTextLines: [],
        segments: [],
        ready: !1,
        isPlaying: !1,
        isSnapping: !1,
        segmentIndex: -1,
        playingSegmentIndex: -1,
        targetEndFrame: null,
        pendingDir: 0,
        inputLockUntil: 0,
        failed: !1,
        lastRenderedFrame: null,
        lastVisibleFrame: null,
        lastVisibleFrameEver: null,
        lastRichVisibleFrame: null,
        lastRichVisibleFrameEver: null,
        lastPinnedFrame: null,
        resolvedFrameBySegment: new Map(),
        strictFallbackFrameBySegment: new Map(),
        strictRecoveryRafBySegment: new Map(),
        isLockedExactRecovering: !1,
        isRemounting: !1,
        recoveryOverlayEl: null,
        recoveryOverlayClearTimer: null,
        recoveryOverlayVisible: !1,
        recoverySnapshotMarkup: "",
        recoverySnapshotCanvasDataUrl: "",
        recoverySnapshotFrame: null,
        recoverySnapshotSegmentIndex: -1,
        posterHideCheckRafId: null,
        arrowEnsureRafId: null,
        requireRichContent: Vt(e, p),
        persistentSettleSnapshotOverlay: Ui(e),
        minContentAreaRatio: En(e, p),
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
      ((u.showDownArrow = () => {
        let R = xe(u);
        R && (Xt(u), S(u), R.classList.add("is-visible"));
      }),
        (u.setPlaybackViewportFreeze = Xe),
        (u.hideDownArrow = () => {
          Xt(u);
          let R = xe(u);
          R && R.classList.remove("is-visible");
        }),
        (u.setSegmentText = (R) => {
          if (!u.segmentTextEl) return;
          u.segmentTextEl.classList.remove(
            "childhood-fundal-segment-text--bullet-summary",
          );
          let M = ct(R);
          if (u.segmentTextMode === "append")
            M && !u.segmentTextLines.includes(M) && u.segmentTextLines.push(M);
          else if (u.segmentTextMode === "appendinline") {
            if (M) {
              let T = fa(u.segmentTextLines[0] || "", M);
              u.segmentTextLines = T ? [T] : [];
            }
          } else
            u.segmentTextMode === "sticky"
              ? M && (u.segmentTextLines = [M])
              : (u.segmentTextLines = M ? [M] : []);
          (u.segmentTextEl.replaceChildren(),
            u.segmentTextLines.forEach((T) => {
              let J = document.createElement("div");
              ((J.className = "childhood-fundal-segment-text__line"),
                xn(T) &&
                  J.classList.add("childhood-fundal-segment-text__line--tight"),
                wn(J, T),
                u.segmentTextEl.appendChild(J));
            }),
            u.segmentTextEl.classList.toggle(
              "is-empty",
              u.segmentTextLines.length === 0,
            ));
        }),
        (u.showFinalSummaryBullets = () => {
          if (!u.segmentTextEl) return;
          let R = Array.isArray(u.finalSummaryBulletLines)
            ? u.finalSummaryBulletLines.map((T) => ct(T)).filter((T) => !!T)
            : [];
          if (!R.length) return;
          ((u.segmentTextLines = R.slice()), u.segmentTextEl.replaceChildren());
          let M = document.createElement("ul");
          ((M.className = "childhood-fundal-segment-text__bullet-list"),
            R.forEach((T) => {
              let J = document.createElement("li");
              ((J.className = "childhood-fundal-segment-text__bullet-item"),
                xn(T) &&
                  J.classList.add("childhood-fundal-segment-text__line--tight"),
                wn(J, T),
                M.appendChild(J));
            }),
            u.segmentTextEl.appendChild(M),
            u.segmentTextEl.classList.remove("is-empty"),
            u.segmentTextEl.classList.add(
              "childhood-fundal-segment-text--bullet-summary",
            ));
        }),
        (u.clearSegmentText = () => {
          ((u.segmentTextLines = []),
            u.segmentTextEl &&
              (u.segmentTextEl.replaceChildren(),
              u.segmentTextEl.classList.remove(
                "childhood-fundal-segment-text--bullet-summary",
              ),
              u.segmentTextEl.classList.add("is-empty")));
        }),
        u.hideDownArrow(),
        u.clearSegmentText(),
        (u.stopCenterLock = () => {
          if (Number.isFinite(u.centerLockRafId)) {
            try {
              cancelAnimationFrame(u.centerLockRafId);
            } catch {}
            u.centerLockRafId = null;
          }
        }),
        (u.requestIosPostSettleRefresh = (R, M = {}) => {
          wt(u, R, M);
        }),
        (u.cancelIosPostSettleRefresh = () => {
          Qe(u);
        }),
        (u.startCenterLock = () => {
          (u.stopCenterLock(), A(u.stage));
          let R = () => {
            if (!u.isPlaying) {
              u.centerLockRafId = null;
              return;
            }
            (A(u.stage), (u.centerLockRafId = requestAnimationFrame(R)));
          };
          u.centerLockRafId = requestAnimationFrame(R);
        }));
      let I = () => {
          let R = window.lottie.loadAnimation({
            container: i,
            renderer: cr(e, p),
            loop: !1,
            autoplay: !1,
            path: e.paths[p],
            rendererSettings: {
              preserveAspectRatio: fr(e, p),
              hideOnTransparent: !1,
            },
          });
          return (bn(R, e, p), R);
        },
        N = () => {
          let R = u.anim;
          if (!R || u.ready) return;
          (ge(u, { immediate: !0 }),
            (u.segments = va(e, p, R)),
            (u.ready = !0));
          let M = u.segments[0];
          if (M) {
            let Be = vi(e, p);
            if ((R.goToAndStop(M.from, !0), k(u), !Be && H(u))) {
              let ae = St(u, M.from);
              (R.goToAndStop(ae, !0), k(u));
            }
            if (!H(u)) {
              let ae = V(u, Math.floor(Number(R.currentFrame)));
              ((u.lastVisibleFrame = ae),
                (u.lastVisibleFrameEver = ae),
                ie(u, u.minContentAreaRatio) &&
                  ((u.lastRichVisibleFrame = ae),
                  (u.lastRichVisibleFrameEver = ae)),
                (u.lastPinnedFrame = ae),
                Pe(u, ae));
            }
          }
          let T = v;
          (!Ze(u, {
            immediate: !0,
            requireRichContent: T,
            minContentAreaRatio: u.minContentAreaRatio,
          }) &&
            u.stage?.dataset?.posterHidden !== "1" &&
            Jt(u, {
              requireRichContent: T,
              minContentAreaRatio: u.minContentAreaRatio,
              checks: T ? 260 : 60,
            }),
            p === 0 && G(),
            requestAnimationFrame(() => {
              (xe(u), S(u));
            }));
        },
        C = () => {
          ((u.failed = !0),
            console.error("[fundalScroll] animation data failed:", e.paths[p]));
        },
        ne = () => {
          let R = u.anim;
          if (R) {
            if (
              (u.stage?.dataset?.posterHidden !== "1" &&
                Ze(u, {
                  requireRichContent: v,
                  minContentAreaRatio: u.minContentAreaRatio,
                }),
              u.isPlaying)
            ) {
              let M = u.segments[u.playingSegmentIndex];
              if (M) {
                let T = Math.floor(Number(R.currentFrame));
                if (
                  Number.isFinite(T) &&
                  ((u.lastRenderedFrame = Math.max(M.from, Math.min(M.to, T))),
                  !H(u))
                ) {
                  ((u.lastVisibleFrame = u.lastRenderedFrame),
                    (u.lastVisibleFrameEver = u.lastRenderedFrame),
                    ie(u, u.minContentAreaRatio) &&
                      ((u.lastRichVisibleFrame = u.lastRenderedFrame),
                      (u.lastRichVisibleFrameEver = u.lastRenderedFrame)));
                  let J = Math.max(
                    8,
                    Math.min(24, Math.floor((M.to - M.from + 1) * 0.08)),
                  );
                  u.recoverySnapshotSegmentIndex !== u.playingSegmentIndex &&
                    u.lastRenderedFrame >= M.to - J &&
                    Pe(u, u.lastRenderedFrame) &&
                    (u.recoverySnapshotSegmentIndex = u.playingSegmentIndex);
                }
              }
            }
            !u.isPlaying ||
              u.targetEndFrame == null ||
              (Math.floor(Number(R.currentFrame)) >= u.targetEndFrame &&
                Ur(u, e));
          }
        },
        Q = () => {
          u.isPlaying && Ur(u, e);
        };
      return (
        (u.handleAnimationReady = N),
        (u.handleAnimationFailed = C),
        (u.handleAnimationEnterFrame = ne),
        (u.handleAnimationComplete = Q),
        (u.attachAnimationListeners = (R = u.anim) => {
          R &&
            (R.addEventListener("data_ready", N),
            R.addEventListener("DOMLoaded", N),
            R.addEventListener("data_failed", C),
            R.addEventListener("enterFrame", ne),
            R.addEventListener("complete", Q));
        }),
        (u.detachAnimationListeners = (R = u.anim) => {
          if (R) {
            try {
              R.removeEventListener("data_ready", N);
            } catch {}
            try {
              R.removeEventListener("DOMLoaded", N);
            } catch {}
            try {
              R.removeEventListener("data_failed", C);
            } catch {}
            try {
              R.removeEventListener("enterFrame", ne);
            } catch {}
            try {
              R.removeEventListener("complete", Q);
            } catch {}
          }
        }),
        (u.remountAtFrame = (R, M = {}) =>
          new Promise((T) => {
            if (u.isRemounting) {
              T(!1);
              return;
            }
            if (!u.stage) {
              T(!1);
              return;
            }
            u.isRemounting = !0;
            let J = u.anim,
              Be = V(u, R),
              ae = null,
              te = !1,
              fe = null,
              Ye = () => {
                let Se = u.anim;
                if (!Se || Se !== fe) {
                  ot(!1);
                  return;
                }
                requestAnimationFrame(() => {
                  let mn = ye(u, Be, {
                    attempts: v ? 5 : 3,
                    minContentAreaRatio: u.minContentAreaRatio,
                    allowFrameShift: !1,
                  });
                  ot(!mn.isBlank);
                });
              },
              Gt = () => {
                ot(!1);
              },
              ot = (Se) => {
                if (!te) {
                  if (((te = !0), fe)) {
                    try {
                      fe.removeEventListener("data_ready", Ye);
                    } catch {}
                    try {
                      fe.removeEventListener("DOMLoaded", Ye);
                    } catch {}
                    try {
                      fe.removeEventListener("data_failed", Gt);
                    } catch {}
                  }
                  (ae != null && clearTimeout(ae),
                    (u.isRemounting = !1),
                    T(!!Se));
                }
              };
            try {
              u.detachAnimationListeners?.(J);
            } catch {}
            try {
              J?.destroy?.();
            } catch {}
            ((u.ready = !1),
              (u.failed = !1),
              (u.segments = []),
              (fe = I()),
              (u.anim = fe),
              u.attachAnimationListeners?.(fe),
              fe.addEventListener("data_ready", Ye),
              fe.addEventListener("DOMLoaded", Ye),
              fe.addEventListener("data_failed", Gt),
              (ae = setTimeout(
                () => {
                  ot(!1);
                },
                Math.max(
                  600,
                  Number.isFinite(Number(M.timeoutMs))
                    ? Math.floor(Number(M.timeoutMs))
                    : 1800,
                ),
              )));
          })),
        (u.anim = I()),
        u.attachAnimationListeners(u.anim),
        u
      );
    }),
    q = null,
    U = e.enableReplay === !0,
    $ = async () => {
      if (
        (await dr(),
        B.forEach((i) => {
          let p = Number(i?.fileIndex);
          if (!Number.isFinite(p) || p < 0) return;
          if (
            ((i.segmentStartTexts = Xn(e, p)),
            (i.segmentTextTriggerFrames = Qn(e, p)),
            (i.finalSummaryBulletLines = Jn(e, p)),
            !!i.segmentTextEl?.classList?.contains(
              "childhood-fundal-segment-text--bullet-summary",
            ))
          ) {
            i.finalSummaryBulletLines.length
              ? i.showFinalSummaryBullets?.()
              : i.clearSegmentText?.();
            return;
          }
          i.clearSegmentText?.();
          let I = Math.min(
            Number(i.segmentIndex),
            i.segmentStartTexts.length - 1,
          );
          if (!(!Number.isFinite(I) || I < 0))
            for (let N = 0; N <= I; N += 1)
              i.setSegmentText?.(i.segmentStartTexts[N]);
        }),
        U)
      ) {
        let i = q || Lt();
        i && (i.textContent = qe("Replay"));
      }
    },
    Z = () => {
      B.forEach((i) => i.hideDownArrow?.());
    },
    we = (i, p = 12) => {
      if (!i || !xe(i)) return;
      Xt(i);
      let I = Math.max(
          1,
          Number.isFinite(Number(p)) ? Math.floor(Number(p)) : 12,
        ),
        N = () => {
          let C = xe(i);
          if (C) {
            if (i.isPlaying || i.isSnapping) {
              i.arrowEnsureRafId = null;
              return;
            }
            if ((S(i), C.classList.add("is-visible"), (I -= 1), I <= 0)) {
              i.arrowEnsureRafId = null;
              return;
            }
            i.arrowEnsureRafId = requestAnimationFrame(N);
          }
        };
      i.arrowEnsureRafId = requestAnimationFrame(N);
    },
    P = (i) => {
      (Z(), i?.showDownArrow?.(), we(i, v ? 18 : 12));
    },
    Ne = null;
  function me() {
    return B.some((i) => i?.isPlaying || i?.isSnapping);
  }
  function oe() {
    if (Number.isFinite(Ne)) {
      try {
        cancelAnimationFrame(Ne);
      } catch {}
      Ne = null;
    }
  }
  function Ae(i = {}) {
    let p = i?.force === !0;
    v &&
      (ee() ||
        (!p && !me()) ||
        Number.isFinite(Ne) ||
        (Ne = requestAnimationFrame(() => {
          if (((Ne = null), ee() || (!p && !me()))) return;
          let u = Mt();
          u?.stage && A(u.stage);
        })));
  }
  let Ee = null,
    ce = !1;
  function at() {
    if (Number.isFinite(Ee)) {
      try {
        cancelAnimationFrame(Ee);
      } catch {}
      Ee = null;
    }
  }
  function ue() {
    ce &&
      (Number.isFinite(Ee) ||
        (Ee = requestAnimationFrame(() => {
          if (((Ee = null), !ce)) return;
          let i = Mt();
          i?.stage && A(i.stage);
        })));
  }
  function $e(i) {
    ce && i.cancelable && i.preventDefault();
  }
  function Xe(i) {
    if (!Dt()) {
      if (i) {
        if (ce) {
          ue();
          return;
        }
        ((ce = !0),
          (n.style.overscrollBehaviorY = "none"),
          (document.body.style.overscrollBehaviorY = "none"),
          (document.documentElement.style.overscrollBehaviorY = "none"),
          document.addEventListener("touchmove", $e, {
            passive: !1,
            capture: !0,
          }),
          document.addEventListener("wheel", $e, { passive: !1, capture: !0 }),
          window.addEventListener("scroll", ue, { passive: !0 }),
          ue());
        return;
      }
      if (ce) {
        if (
          ((ce = !1),
          at(),
          document.removeEventListener("touchmove", $e, !0),
          document.removeEventListener("wheel", $e, !0),
          window.removeEventListener("scroll", ue),
          v && !ee())
        ) {
          ((n.style.overscrollBehaviorY = "contain"),
            (document.body.style.overscrollBehaviorY = "contain"),
            (document.documentElement.style.overscrollBehaviorY = "contain"));
          return;
        }
        if (v && ee()) {
          ((n.style.overscrollBehaviorY = "contain"),
            (document.body.style.overscrollBehaviorY = "contain"),
            (document.documentElement.style.overscrollBehaviorY = "contain"));
          return;
        }
        (n.style.removeProperty("overscroll-behavior-y"),
          document.body.style.removeProperty("overscroll-behavior-y"),
          document.documentElement.style.removeProperty(
            "overscroll-behavior-y",
          ));
      }
    }
  }
  function _e(i) {
    v &&
      ((n.style.touchAction = i ? "pan-y" : ""),
      (n.style.overscrollBehaviorY = i ? "contain" : ""),
      (document.body.style.overscrollBehaviorY = i ? "contain" : ""),
      (document.documentElement.style.overscrollBehaviorY = i
        ? "contain"
        : ""));
  }
  function xt(i) {
    return (
      !!i &&
      i.ready &&
      i.segments.length > 0 &&
      i.segmentIndex >= i.segments.length - 1
    );
  }
  function ee() {
    return B.length ? B.every((i) => xt(i)) : !1;
  }
  let Re = null,
    O = 0,
    W = null,
    D = null,
    se = 0,
    Ue = 120,
    mt = 4;
  function ve() {
    if (((se = 0), !!Number.isFinite(D))) {
      try {
        clearInterval(D);
      } catch {}
      D = null;
    }
  }
  function Qe(i) {
    if (!i) return;
    i.iosPostSettlePassesRemaining = 0;
    let p = Number(i.iosPostSettleTimerId);
    if (!Number.isFinite(p)) {
      i.iosPostSettleTimerId = null;
      return;
    }
    try {
      clearTimeout(p);
    } catch {}
    i.iosPostSettleTimerId = null;
  }
  function wt(i, p, u = {}) {
    if (!v || !i?.ready || !i.segments?.length) return;
    let I = V(i, p),
      N = Number.isFinite(Number(u.segmentIndex))
        ? Math.floor(Number(u.segmentIndex))
        : Number.isFinite(Number(i.segmentIndex))
          ? Math.floor(Number(i.segmentIndex))
          : null,
      C = Math.max(
        1,
        Math.min(
          12,
          Number.isFinite(Number(u.passes)) ? Math.floor(Number(u.passes)) : 7,
        ),
      ),
      ne = Math.max(
        24,
        Math.min(
          180,
          Number.isFinite(Number(u.intervalMs))
            ? Math.floor(Number(u.intervalMs))
            : 48,
        ),
      ),
      Q = Math.max(
        1,
        Math.min(
          4,
          Number.isFinite(Number(u.attemptsPerTick))
            ? Math.floor(Number(u.attemptsPerTick))
            : 3,
        ),
      ),
      R = Number.isFinite(Number(u.minContentAreaRatio))
        ? Math.max(0.01, Number(u.minContentAreaRatio))
        : Number.isFinite(Number(i.minContentAreaRatio))
          ? Math.max(0.01, Number(i.minContentAreaRatio))
          : 0.16;
    (Qe(i), (i.iosPostSettlePassesRemaining = C));
    let M = () => {
      if (!i) return;
      if (i.isPlaying || i.isSnapping) {
        Qe(i);
        return;
      }
      if (Number.isFinite(N) && Number(i.segmentIndex) !== N) {
        Qe(i);
        return;
      }
      k(i);
      let T = ye(i, I, {
          attempts: Q,
          minContentAreaRatio: R,
          allowFrameShift: !1,
        }),
        J = Me(i, {
          requireRichContent: i.requireRichContent === !0,
          minContentAreaRatio: R,
        });
      if (
        (T.isBlank || J
          ? tt(i)
            ? Ke(i, I, {
                minContentAreaRatio: R,
                passes: 2,
                attemptsPerPass: Q,
              })
            : et(i)
          : Ve(i, { checks: 6, requiredStablePasses: 2 }),
        ut(i),
        De(i?.stage),
        (i.iosPostSettlePassesRemaining -= 1),
        i.iosPostSettlePassesRemaining <= 0)
      ) {
        i.iosPostSettleTimerId = null;
        return;
      }
      i.iosPostSettleTimerId = window.setTimeout(M, ne);
    };
    i.iosPostSettleTimerId = window.setTimeout(M, 0);
  }
  function ft() {
    if (Number.isFinite(Re)) {
      try {
        cancelAnimationFrame(Re);
      } catch {}
      Re = null;
    }
    if (Number.isFinite(W)) {
      try {
        cancelAnimationFrame(W);
      } catch {}
      W = null;
    }
    O = 0;
  }
  function Ln(i) {
    let p = Array.isArray(i?.segments) ? i.segments.length : 0;
    if (p <= 0) return -1;
    let u = i?.resolvedFrameBySegment,
      I = Number.isFinite(Number(i?.segmentIndex))
        ? Math.floor(Number(i.segmentIndex))
        : -1;
    if (I >= 0 && I < p && Number.isFinite(Number(u?.get?.(I)))) return I;
    let N = -1;
    return (
      u?.forEach?.((C, ne) => {
        let Q = Number.isFinite(Number(ne)) ? Math.floor(Number(ne)) : -1;
        Q < 0 || Q >= p || (Number.isFinite(Number(C)) && (N = Math.max(N, Q)));
      }),
      N
    );
  }
  function Ut(i) {
    if (!i?.ready || !i.segments.length) return;
    let p = Ln(i);
    if (p < 0) return;
    let u = i.segments[p];
    if (!u) return;
    let I = Pn(e, u),
      N = En(e, i.fileIndex);
    if (I) {
      let ae = Number(i.resolvedFrameBySegment?.get?.(p)),
        te = Number.isFinite(ae) ? V(i, ae) : nr(u),
        fe = An(e);
      if ((tn(i, p), i.resolvedFrameBySegment?.set(p, te), fe)) {
        let He = Number(i.strictFallbackFrameBySegment?.get?.(p));
        nt(He, u) || i.strictFallbackFrameBySegment?.delete?.(p);
        let Kt = Number(i.lastPinnedFrame);
        if (
          v &&
          Number.isFinite(Kt) &&
          Math.floor(Kt) === te &&
          (k(i),
          !Me(i, {
            requireRichContent: i.requireRichContent === !0,
            minContentAreaRatio: N,
          }))
        ) {
          ut(i);
          return;
        }
        if (
          !ye(i, te, {
            attempts: v ? 8 : 4,
            minContentAreaRatio: N,
            allowFrameShift: !1,
          }).isBlank &&
          !Me(i, {
            requireRichContent: i.requireRichContent === !0,
            minContentAreaRatio: N,
          })
        ) {
          (i.strictFallbackFrameBySegment?.delete?.(p),
            Ve(i),
            vt(i, te, {
              passes: v ? 4 : 2,
              attemptsPerPass: v ? 2 : 1,
              minContentAreaRatio: N,
              allowFrameShift: !1,
            }),
            i.resolvedFrameBySegment?.set(p, te),
            ut(i));
          return;
        }
        if (v) {
          (i.strictFallbackFrameBySegment?.delete?.(p),
            tt(i) ? Ke(i, te, { minContentAreaRatio: N }) : et(i),
            Xi(i, e, te, { minContentAreaRatio: N }));
          return;
        }
        e?.strictFrameRemountOnBlank !== !1 &&
          typeof i.remountAtFrame == "function" &&
          !i.isRemounting &&
          i.remountAtFrame(te, { timeoutMs: v ? 1200 : 900 }).then((_n) => {
            if (!_n) return;
            (!ye(i, te, {
              attempts: v ? 5 : 3,
              minContentAreaRatio: N,
              allowFrameShift: !1,
            }).isBlank &&
              !Me(i, {
                requireRichContent: i.requireRichContent === !0,
                minContentAreaRatio: N,
              }) &&
              Ve(i),
              vt(i, te, {
                passes: v ? 4 : 2,
                attemptsPerPass: v ? 2 : 1,
                minContentAreaRatio: N,
                allowFrameShift: !1,
              }),
              ut(i));
          });
        return;
      }
      let Ye = Vt(e, i.fileIndex);
      if (
        !ye(i, te, { attempts: v ? 8 : 5, minContentAreaRatio: N }).isBlank &&
        !Me(i, { requireRichContent: Ye, minContentAreaRatio: N })
      ) {
        (i.strictFallbackFrameBySegment?.delete?.(p),
          i.resolvedFrameBySegment?.set(p, te),
          ut(i));
        return;
      }
      let ot = Number(i.strictFallbackFrameBySegment?.get?.(p)),
        Se = nt(ot, u)
          ? V(i, ot)
          : Ta(i, u, te, { requireRichContent: Ye, minContentAreaRatio: N });
      if (
        (i.strictFallbackFrameBySegment?.set(p, Se),
        ye(i, Se, { attempts: v ? 8 : 5, minContentAreaRatio: N }).isBlank ||
          Me(i, { requireRichContent: Ye, minContentAreaRatio: N }))
      ) {
        let He = In(i, u, te, {
          requireRichContent: Ye,
          minContentAreaRatio: N,
        });
        (nt(He, u) || (He = Se),
          i.strictFallbackFrameBySegment?.set(p, He),
          ye(i, He, { attempts: v ? 10 : 6, minContentAreaRatio: N }));
      }
      (Ra(i, p, u, te, i.strictFallbackFrameBySegment?.get?.(p), {
        passes: v ? 18 : 10,
        attemptsPerPass: v ? 3 : 2,
        minContentAreaRatio: N,
      }),
        i.resolvedFrameBySegment?.set(p, te),
        ut(i));
      return;
    }
    (tn(i, p), i.strictFallbackFrameBySegment?.delete?.(p));
    let C = wa(e, i.fileIndex, p, u),
      ne = Number.isFinite(Number(C))
        ? Number(C) < u.from || Number(C) > u.to
        : !1,
      Q = Vt(e, i.fileIndex),
      R = i.resolvedFrameBySegment?.get(p),
      T = Number.isFinite(R)
        ? R
        : Tn(i, u, C, {
            allowOutsideSegment: ne,
            requireRichContent: Q,
            minContentAreaRatio: N,
          });
    i.resolvedFrameBySegment?.set(p, T);
    let J = Number(i.lastPinnedFrame);
    if (v && Number.isFinite(J) && Math.floor(J) === T && (k(i), !H(i))) return;
    try {
      (i.anim.pause(), i.anim.goToAndStop(T, !0));
    } catch {}
    k(i);
    let Be = Q && !H(i) && !ie(i, N);
    if (H(i) || Be) {
      ((T = Tn(i, u, C, {
        allowOutsideSegment: ne,
        requireRichContent: Q,
        minContentAreaRatio: N,
      })),
        (T = St(i, T, { requireRichContent: Q, minContentAreaRatio: N })),
        i.resolvedFrameBySegment?.set(p, T));
      try {
        i.anim.goToAndStop(T, !0);
      } catch {}
      k(i);
    }
    (H(i)
      ? v && (i.lastPinnedFrame = null)
      : ((i.lastVisibleFrame = T),
        (i.lastVisibleFrameEver = T),
        (i.lastPinnedFrame = T)),
      ut(i));
  }
  function Ie(i = 96) {
    let p = window.innerHeight || document.documentElement.clientHeight || 0;
    return !Number.isFinite(p) || p <= 0
      ? []
      : B.filter((u) => {
          if (!u?.stage) return !1;
          let I = u.stage.getBoundingClientRect?.();
          return I ? I.bottom >= -i && I.top <= p + i : !1;
        });
  }
  function Le(i = {}) {
    let p = (C) => {
      C && (Ut(C), De(C.stage));
    };
    if (!(i?.visibleOnly === !0)) {
      B.forEach((C) => {
        p(C);
      });
      return;
    }
    let I = Ie();
    if (I.length) {
      I.forEach((C) => {
        p(C);
      });
      return;
    }
    let N = B[a] || B[B.length - 1];
    N && p(N);
  }
  function It(i = 4) {
    ee() &&
      ((O = Math.max(O, Math.max(1, Math.floor(Number(i) || 0)))),
      !Number.isFinite(W) &&
        (W = requestAnimationFrame(() => {
          if (((W = null), !ee() || Number.isFinite(Re))) return;
          let p = () => {
            if (!ee()) {
              ((Re = null), (O = 0));
              return;
            }
            if ((Le({ visibleOnly: !0 }), (O -= 1), O > 0)) {
              Re = requestAnimationFrame(p);
              return;
            }
            Re = null;
          };
          Re = requestAnimationFrame(p);
        })));
  }
  function it(i = mt) {
    v &&
      ((se = Math.max(se, Math.max(1, Math.floor(Number(i) || 0)))),
      ee() && document.visibilityState !== "hidden" && Le({ visibleOnly: !0 }),
      !Number.isFinite(D) &&
        (D = window.setInterval(() => {
          if (!ee()) {
            ve();
            return;
          }
          document.visibilityState !== "hidden" &&
            (Le({ visibleOnly: !0 }), (se -= 1), se <= 0 && ve());
        }, Ue)));
  }
  function Wt(i) {
    i && i.classList.remove("childhood-fundal-replay-btn--compact-offset");
  }
  function Lt() {
    if (!U) return null;
    if (q) return (Wt(q), q);
    let i = n.querySelector(".eyes-topbar");
    if (!i) return null;
    let p = i.querySelector("[data-fundal-title-group]");
    if (!p) {
      ((p = document.createElement("div")),
        (p.dataset.fundalTitleGroup = "1"),
        (p.className = "childhood-fundal-title-group"));
      let ne = i.querySelector(".eyes-topbar__title"),
        Q = i.querySelector(".eyes-topbar__icons");
      (Q ? i.insertBefore(p, Q) : i.prepend(p),
        ne && ne.parentElement !== p && p.appendChild(ne));
    }
    let u = i.querySelector(".eyes-topbar__title");
    u && u.parentElement !== p && p.appendChild(u);
    let I = p.querySelector("[data-fundal-replay-btn]");
    if (I) return ((q = I), Wt(q), q);
    let N = n.querySelector(".eyes-topbar__icons");
    if (!N && !p) return null;
    let C = document.createElement("button");
    return (
      (C.type = "button"),
      (C.dataset.fundalReplayBtn = "1"),
      (C.className = "childhood-fundal-replay-btn"),
      (C.textContent = qe("Replay")),
      (C.style.display = "none"),
      p ? p.appendChild(C) : N.prepend(C),
      Wt(C),
      (q = C),
      q
    );
  }
  function ht() {
    let i = Lt();
    i &&
      ((i.style.display = "inline-flex"),
      (i.style.alignItems = "center"),
      (i.style.justifyContent = "center"));
  }
  function kt() {
    q && (q.style.display = "none");
  }
  function jt() {
    (Xe(!1),
      (f = !1),
      ft(),
      ve(),
      oe(),
      gt(),
      (Je = !1),
      _e(!0),
      Z(),
      B.forEach((i) => {
        try {
          i.stopCenterLock?.();
        } catch {}
        (Nn(i),
          i.clearSegmentText?.(),
          (i.isPlaying = !1),
          (i.isSnapping = !1),
          (i.isLockedExactRecovering = !1),
          i.cancelIosPostSettleRefresh?.(),
          (i.segmentIndex = -1),
          (i.playingSegmentIndex = -1),
          (i.targetEndFrame = null),
          (i.pendingDir = 0),
          (i.inputLockUntil = 0),
          (i.lastRenderedFrame = null),
          (i.lastVisibleFrame = null),
          (i.lastVisibleFrameEver = null),
          (i.lastRichVisibleFrame = null),
          (i.lastRichVisibleFrameEver = null),
          (i.lastPinnedFrame = null),
          (i.recoverySnapshotMarkup = ""),
          (i.recoverySnapshotCanvasDataUrl = ""),
          (i.recoverySnapshotFrame = null),
          (i.recoverySnapshotSegmentIndex = -1),
          ge(i, { immediate: !0 }),
          i.resolvedFrameBySegment?.clear?.(),
          i.strictFallbackFrameBySegment?.clear?.(),
          Dr(i));
        let p = i.segments[0];
        if (i.ready && p) {
          try {
            i.anim.pause();
          } catch {}
          if ((i.anim.goToAndStop(p.from, !0), k(i), H(i))) {
            let u = St(i, p.from);
            (i.anim.goToAndStop(u, !0), k(i));
          }
          if (!H(i)) {
            let u = V(i, Math.floor(Number(i.anim.currentFrame)));
            ((i.lastVisibleFrame = u),
              (i.lastVisibleFrameEver = u),
              ie(i, i.minContentAreaRatio) &&
                ((i.lastRichVisibleFrame = u),
                (i.lastRichVisibleFrameEver = u)),
              (i.lastPinnedFrame = u));
          }
        }
      }),
      kt(),
      B[0] && ((a = 0), P(B[0])),
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          (j(), Ae({ force: !0 }));
        }),
      ));
  }
  if (U) {
    let i = Lt();
    i &&
      i.dataset.wiredReplay !== "1" &&
      ((i.dataset.wiredReplay = "1"),
      i.addEventListener("click", (p) => {
        (p.preventDefault(), p.stopPropagation(), jt());
      }));
  }
  (y(!0), _());
  function zt() {
    B.forEach((i) => {
      xt(i) && i.showFinalSummaryBullets?.();
    });
  }
  (B.forEach((i) => {
    i.onSegmentSettled = () => {
      if (
        (Mn(),
        Ut(i),
        (We = 0),
        (Te = null),
        (Nt = Date.now() + (v ? 320 : 220)),
        !ee())
      ) {
        (P(i), _e(!0));
        return;
      }
      (zt(),
        Z(),
        _e(!1),
        v &&
          ((n.style.overscrollBehaviorY = "contain"),
          (document.body.style.overscrollBehaviorY = "contain")),
        $t(e)
          ? (ft(), Le({ visibleOnly: !0 }), v ? it(mt + 2) : ve())
          : (It(), it()),
        F());
    };
  }),
    !ee() && B[0] && ((a = 0), P(B[0])),
    _e(!ee()));
  let We = 0,
    Te = null,
    Nt = 0,
    kn = 30,
    Bn = 24,
    rn = 8,
    Yt = 120,
    an = 320,
    At = 280,
    Bt = !1,
    pt = null,
    Je = !1,
    be = null,
    on = () => {
      Number.isFinite(Number(pt)) && (clearTimeout(pt), (pt = null));
    },
    sn = () => {
      (on(),
        (pt = setTimeout(() => {
          ((Bt = !1), (We = 0), (pt = null));
        }, an)));
    },
    gt = () => {
      Number.isFinite(Number(be)) && (clearTimeout(be), (be = null));
    },
    Oe = () => {
      (gt(),
        (be = setTimeout(() => {
          ((Je = !1), (be = null));
        }, At)));
    },
    Mn = () => {
      ((Je = !0), Oe());
    };
  function Mt() {
    let i = B.findIndex((u) => u.isPlaying);
    if (i >= 0) return ((a = i), B[i]);
    let p = Ji(B);
    return (p >= 0 && (a = p), B[a] || null);
  }
  function ln(i) {
    if (ee()) return !1;
    let p = Mt();
    return !p || p.failed
      ? !1
      : p.isSnapping ||
          p.isPlaying ||
          (i > 0 && Date.now() < Number(p.inputLockUntil || 0))
        ? !0
        : i < 0
          ? !1
          : p.ready
            ? p.segments.length
              ? p.segmentIndex < p.segments.length - 1
              : !1
            : !0;
  }
  function un(i) {
    if (ee())
      return (
        i < 0 && ht(),
        $t(e) ? (Le({ visibleOnly: !0 }), v && it(4)) : It(),
        !1
      );
    let p = Mt();
    return !p || p.failed
      ? !1
      : p.isSnapping
        ? !0
        : p.ready
          ? i > 0 && Date.now() < Number(p.inputLockUntil || 0)
            ? !0
            : p.isPlaying
              ? ((p.pendingDir = 0), !0)
              : i < 0
                ? (ee() && ht(), !1)
                : !!Qi(p, i)
          : i > 0;
  }
  function dn(i) {
    if (!Number.isFinite(i.deltaY) || i.deltaY === 0) return;
    let p = i.deltaY > 0 ? 1 : -1;
    if ((ln(p) && (i.preventDefault(), i.stopPropagation()), p > 0 && Je)) {
      (Oe(), i.preventDefault(), i.stopPropagation());
      return;
    }
    if (
      (sn(),
      Bt ||
        (We !== 0 && Math.sign(We) !== Math.sign(i.deltaY) && (We = 0),
        (We += i.deltaY),
        Math.abs(We) < kn))
    )
      return;
    let u = Date.now();
    if (u - Nt < Yt) return;
    Nt = u;
    let I = We > 0 ? 1 : -1;
    We = 0;
    let N = un(I);
    (N && I > 0 && ((Bt = !0), sn()),
      !N && I < 0 && ee() && ht(),
      N && (i.preventDefault(), i.stopPropagation()));
  }
  function cn(i) {
    !i.touches || i.touches.length !== 1 || (Te = i.touches[0].clientY);
  }
  function _t(i) {
    if (Te == null) return;
    let p = i.touches?.[0]?.clientY;
    if (!Number.isFinite(p)) return;
    let u = Te - p;
    if (Math.abs(u) < rn) return;
    let I = u > 0 ? 1 : -1;
    ln(I) && (i.preventDefault(), i.stopPropagation(), Ae());
  }
  function Et(i) {
    if (Te == null) return;
    let p = i.changedTouches?.[0]?.clientY ?? Te,
      u = Te - p;
    if (((Te = null), Math.abs(u) < Bn)) return;
    let I = Date.now();
    if (I - Nt < Yt) return;
    Nt = I;
    let N = u > 0 ? 1 : -1,
      C = un(N);
    (!C && N < 0 && ee() && ht(),
      C && (i.preventDefault(), i.stopPropagation(), Ae()));
  }
  function ke() {
    v && (ee() || (me() && Ae()));
  }
  function je() {
    if (ee()) {
      if ($t(e)) {
        (ft(), Le({ visibleOnly: !0 }), v ? it(4) : ve());
        return;
      }
      (It(2), it());
    }
  }
  function ze() {
    if (ee() && document.visibilityState === "visible") {
      if ($t(e)) {
        (ft(), Le({ visibleOnly: !0 }), v ? it(6) : ve());
        return;
      }
      (It(v ? 3 : 1), it());
    }
  }
  return (
    n.addEventListener("wheel", dn, { passive: !1 }),
    n.addEventListener("touchstart", cn, { passive: !0 }),
    n.addEventListener("touchmove", _t, { passive: !1 }),
    n.addEventListener("touchend", Et, { passive: !1 }),
    window.addEventListener("scroll", ke, { passive: !0 }),
    window.addEventListener("resize", ke, { passive: !0 }),
    window.addEventListener("resize", w, { passive: !0 }),
    window.addEventListener("pageshow", ke),
    window.addEventListener("pageshow", w),
    window.addEventListener("orientationchange", ke),
    window.addEventListener("orientationchange", w),
    window.addEventListener("scroll", je, { passive: !0 }),
    window.addEventListener("resize", je, { passive: !0 }),
    window.addEventListener("pageshow", je),
    window.addEventListener("orientationchange", je),
    document.addEventListener("visibilitychange", ze),
    {
      cfg: e,
      page: n,
      refreshLanguage: $,
      controllers: B,
      animations: B.map((i) => i.anim),
      observer: null,
      removeInputListeners: () => {
        (ft(),
          ve(),
          oe(),
          on(),
          gt(),
          (Je = !1),
          Xe(!1),
          _e(!1),
          c?.(),
          (c = null),
          y(!0),
          B.forEach((i) => {
            try {
              i.stopCenterLock?.();
            } catch {}
            (Nn(i),
              Xt(i),
              i.cancelIosPostSettleRefresh?.(),
              ge(i, { immediate: !0 }),
              (i.recoverySnapshotMarkup = ""),
              (i.recoverySnapshotCanvasDataUrl = ""),
              (i.recoverySnapshotFrame = null),
              (i.recoverySnapshotSegmentIndex = -1));
            try {
              i.detachAnimationListeners?.();
            } catch {}
            Dr(i);
          }),
          n.removeEventListener("wheel", dn),
          n.removeEventListener("touchstart", cn),
          n.removeEventListener("touchmove", _t),
          n.removeEventListener("touchend", Et),
          window.removeEventListener("scroll", ke),
          window.removeEventListener("resize", ke),
          window.removeEventListener("resize", w),
          window.removeEventListener("pageshow", ke),
          window.removeEventListener("pageshow", w),
          window.removeEventListener("orientationchange", ke),
          window.removeEventListener("orientationchange", w),
          window.removeEventListener("scroll", je),
          window.removeEventListener("resize", je),
          window.removeEventListener("pageshow", je),
          window.removeEventListener("orientationchange", je),
          document.removeEventListener("visibilitychange", ze));
      },
    }
  );
}
function eo(e, n, r, a, o = null) {
  let l = document.getElementById("page-content"),
    m = {
      page: r.style.overscrollBehaviorY,
      body: document.body.style.overscrollBehaviorY,
      doc: document.documentElement.style.overscrollBehaviorY,
    },
    c = new Set(["ArrowDown", "PageDown", "End"]),
    f = String(o?.edge || "")
      .trim()
      .toLowerCase(),
    g = Number(o?.boundaryInputLockUntil || 0),
    F = f === "start",
    y = f === "end",
    S =
      n.disableCompletedRouteRestore === !0
        ? !1
        : y || (!F && fi(n.pageId, n.progressStoragePrefix)),
    w = !1,
    _ = S,
    L = !1,
    A = !1,
    j = 0,
    G = 0,
    B = null,
    q = null,
    U = () => {
      let s = r.querySelector(".eyes-topbar")?.getBoundingClientRect?.().height;
      return Number.isFinite(s) && s > 0 ? s : 56;
    },
    $ = () => {
      if (!!l && (l.scrollHeight || 0) - (l.clientHeight || 0) > 1) {
        let s = l.getBoundingClientRect();
        return {
          type: "page",
          scrollTop: l.scrollTop || 0,
          viewportHeight: l.clientHeight || window.innerHeight || 0,
          topOffset: s.top || 0,
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
    },
    Z = (t, s = $()) => {
      let d = t?.getBoundingClientRect?.();
      return d
        ? s.type === "page"
          ? s.scrollTop + (d.top - s.topOffset)
          : s.scrollTop + d.top
        : 0;
    },
    we = (t, s = $()) => {
      let d = Math.max(0, Math.round(Number(t) || 0));
      if (s.type === "page" && l) {
        typeof l.scrollTo == "function"
          ? l.scrollTo({ top: d, behavior: "auto" })
          : (l.scrollTop = d);
        return;
      }
      window.scrollTo({ top: d, behavior: "auto" });
    },
    P = a.map((t, s) => {
      let d =
          t.parentElement?.querySelector(".childhood-fundal-segment-text") ||
          null,
        h =
          t.parentElement?.querySelector(".childhood-fundal-stage-top-nav") ||
          (s === 0 ? r.querySelector(".childhood-fundal-stage-top-nav") : null),
        b = {
          stage: t,
          anim: null,
          fileIndex: s,
          arrowEl:
            t.parentElement?.querySelector(
              ".childhood-fundal-scroll-down-arrow",
            ) || null,
          topNavEl: h,
          topPrevBtn:
            h?.querySelector("[data-fundal-page-prev-btn='1']") || null,
          topNextBtn:
            h?.querySelector("[data-fundal-page-next-btn='1']") || null,
          replayBtn: null,
          segmentTextEl: d,
          segmentStartTexts: [],
          segmentTextTriggerFrames: [],
          finalSummaryBulletLines: [],
          segmentTextMode: ua(n, s),
          settleSnapshotImages: Sa(n, s),
          segmentTextLeftAligned: Si(n, s),
          segmentTextBullet: xi(n, s),
          segmentTextLines: [],
          currentTextSegmentIndex: -1,
          segments: [],
          playbackSegments: [],
          ready: !1,
          failed: !1,
          started: !1,
          completed: !1,
          playing: !1,
          activePauseFrame: null,
          playingSegmentIndex: -1,
          targetEndFrame: null,
          lastRenderedFrame: null,
          lastVisibleFrame: null,
          lastVisibleFrameEver: null,
          lastRichVisibleFrame: null,
          lastRichVisibleFrameEver: null,
          lastPinnedFrame: null,
          loading: !1,
          minContentAreaRatio: En(n, s),
          requireRichContent: Vt(n, s),
          animationListeners: null,
        };
      (d?.classList.toggle(
        "childhood-fundal-segment-text--left-aligned",
        b.segmentTextLeftAligned === !0,
      ),
        (b.replayBtn = Ht(t, b.replayBtn)),
        zn(b.replayBtn, qe("Replay")),
        b.replayBtn.addEventListener("click", (E) => {
          (E.preventDefault(), E.stopPropagation(), mn(b));
        }));
      let x = xe(b);
      return (
        x &&
          x.dataset.fundalNextBound !== "1" &&
          ((x.dataset.fundalNextBound = "1"),
          x.addEventListener("click", (E) => {
            (E.preventDefault(), E.stopPropagation(), rn(b));
          })),
        ve(b),
        Mr(d),
        b
      );
    }),
    Ne = 0,
    me = !1,
    oe = Ja(e, n, r, Kt),
    Ae = null;
  function Ee(t) {
    return Number(t?.fileIndex) < P.length - 1;
  }
  function ce() {
    return Jr(e);
  }
  function at() {
    return Zr(e);
  }
  function ue(t) {
    return !Ee(t) && at();
  }
  function $e(t) {
    return Ee(t) || ue(t);
  }
  function Xe(t) {
    if (!t?.topNavEl) return;
    let s = !!Wn(e, -1),
      h = !!Wn(e, 1);
    (t.topPrevBtn?.toggleAttribute("disabled", !s),
      t.topNextBtn?.toggleAttribute("disabled", !h),
      t.topNextBtn?.classList.toggle("is-ready", h),
      t.topNavEl.classList.toggle("is-stage-complete", h));
  }
  function _e() {
    P.forEach((t) => Xe(t));
  }
  function xt() {
    return P.length > 0 && P.every((t) => t.completed);
  }
  function ee(t) {
    ((t.segmentStartTexts = Xn(n, t.fileIndex).map((s) => ct(s))),
      (t.segmentTextTriggerFrames = Qn(n, t.fileIndex)),
      (t.finalSummaryBulletLines = (
        n.narrationTimeline ? [] : Jn(n, t.fileIndex)
      )
        .map((s) => ct(s))
        .filter((s) => !!s)));
  }
  function Re(t, s) {
    if (!t?.segmentTextEl) return;
    let d = ct(s);
    if (t.segmentTextMode === "append")
      d && !t.segmentTextLines.includes(d) && t.segmentTextLines.push(d);
    else if (t.segmentTextMode === "appendinline") {
      if (d) {
        let h = fa(t.segmentTextLines[0] || "", d);
        t.segmentTextLines = h ? [h] : [];
      }
    } else
      t.segmentTextMode === "sticky"
        ? (t.segmentTextLines = d ? [d] : [])
        : (t.segmentTextLines = d ? [d] : []);
    jn(
      t.segmentTextEl,
      t.segmentTextLines.map((h) => n.formatCaption?.(h) ?? h),
      { bullet: t.segmentTextBullet === !0 },
    );
  }
  function O(t) {
    t &&
      ((t.segmentTextLines = []),
      (t.currentTextSegmentIndex = -1),
      Mr(t.segmentTextEl));
  }
  function W(t, s) {
    if ((O(t), !!Array.isArray(t.segmentStartTexts))) {
      for (let d = 0; d <= s; d += 1) {
        let h = t.segmentStartTexts[d];
        Re(t, h);
      }
      t.currentTextSegmentIndex = s;
    }
  }
  function D(t, s) {
    if (
      (n.renderStageArtwork?.(t, s, oe?.getLanguage() || Rt(n)),
      !t ||
        !Array.isArray(t.segments) ||
        !t.segments.length ||
        !Array.isArray(t.segmentStartTexts) ||
        !t.segmentStartTexts.length)
    )
      return;
    let d = -1,
      h = n.getNarrationCues?.(t.fileIndex);
    if (n.narrationTimeline && h?.length) {
      if (
        (h.forEach((b, x) => {
          Number(t.timelineTime) >= b.start && (d = x);
        }),
        d < 0)
      )
        return;
    } else
      Array.isArray(t.segmentTextTriggerFrames) &&
        t.segmentTextTriggerFrames.forEach((b, x) => {
          Number.isFinite(b) && Number(s) >= Number(b) && (d = x);
        });
    if (
      (d < 0 &&
        t.segments.forEach((b, x) => {
          nt(s, b) && (d = x);
        }),
      !(d < 0) &&
        d !== t.currentTextSegmentIndex &&
        !(t.manualSegmentPlayback === !0 && d < t.currentTextSegmentIndex))
    ) {
      if (d < t.currentTextSegmentIndex) {
        W(t, d);
        return;
      }
      for (let b = t.currentTextSegmentIndex + 1; b <= d; b += 1) {
        let x = t.segmentStartTexts[b];
        Re(t, x);
      }
      t.currentTextSegmentIndex = d;
    }
  }
  function se(t) {
    t?.segmentTextEl &&
      t.finalSummaryBulletLines.length &&
      jn(t.segmentTextEl, t.finalSummaryBulletLines, { bullet: !0 });
  }
  function Ue(t) {
    if (t?.segmentTextEl) {
      if (t.finalSummaryBulletLines.length) {
        se(t);
        return;
      }
      (t.segmentTextMode === "append" ||
        t.segmentTextMode === "appendinline") &&
        Array.isArray(t.segmentStartTexts) &&
        t.segmentStartTexts.length > 0 &&
        W(t, t.segmentStartTexts.length - 1);
    }
  }
  function mt(t) {
    if (t) {
      if (t.finalSummaryBulletLines.length && t.completed) {
        se(t);
        return;
      }
      if (t.currentTextSegmentIndex >= 0) {
        W(t, t.currentTextSegmentIndex);
        return;
      }
      O(t);
    }
  }
  function ve(t) {
    if (!t) return;
    let s = Ht(t.stage, t.replayBtn);
    s && (s.style.display = "none");
    let d = xe(t);
    (d &&
      (qt(d, "stage", qe("Next animation") || "Next animation"),
      d.classList.remove("is-visible"),
      (d.disabled = !0)),
      Xe(t));
  }
  function Qe(t) {
    if (!t) return;
    let s = xe(t);
    s && s.classList.remove("is-visible");
  }
  function wt() {
    P.forEach((t) => {
      Qe(t);
    });
  }
  function ft(t) {
    if (!t || (n.narrationTimeline && t.playing)) return;
    let s = Ht(t.stage, t.replayBtn);
    s &&
      (zn(s, qe("Replay")),
      (s.style.display = "inline-flex"),
      (s.style.alignItems = "center"),
      (s.style.justifyContent = "center"));
    let d = xe(t);
    if (d) {
      let h = $e(t);
      (ue(t)
        ? qt(d, "page", qe("Next page") || "Next page")
        : qt(d, "stage", qe("Next animation") || "Next animation"),
        (d.disabled = !h),
        d.classList.toggle("is-visible", h));
    }
    (Ie(t), Xe(t));
  }
  function Ln(t, s = 10) {
    if (!t || !$e(t)) return;
    let d = Math.max(
        1,
        Math.min(24, Number.isFinite(Number(s)) ? Math.floor(Number(s)) : 10),
      ),
      h = () => {
        if (!t || t.playing || !t.completed) return;
        let b = xe(t);
        b &&
          ((b.disabled = !1),
          b.classList.add("is-visible"),
          Ie(t),
          (d -= 1),
          !(d <= 0) && requestAnimationFrame(h));
      };
    requestAnimationFrame(h);
  }
  function Ut() {
    P.forEach((t) => {
      if (!t?.completed || !$e(t) || ue(t)) return;
      let s = P[Number(t.fileIndex) + 1];
      (s && !s.started) ||
        !xe(t)?.classList?.contains("is-visible") ||
        u(t) ||
        Qe(t);
    });
  }
  function Ie(t) {
    let s = xe(t),
      d = Ht(t.stage, t.replayBtn),
      h = t?.stage;
    if (!h) return;
    let b = za(n, t.fileIndex);
    if (s && b != null) {
      let X = h.parentElement,
        he = X?.querySelectorAll?.(
          ".childhood-fundal-segment-text__paragraph",
        )?.[b - 1],
        pe = X?.getBoundingClientRect?.(),
        Ce = he?.getBoundingClientRect?.();
      pe && Ce && pe.height > 0.5 && Ce.height > 0.5
        ? (s.style.top = `${Math.round(Ce.bottom - pe.top + 12)}px`)
        : s.style.removeProperty("top");
    } else s?.style.removeProperty("top");
    if (!Dt()) {
      (s?.style.removeProperty("--fundal-arrow-right"),
        s?.style.removeProperty("--fundal-arrow-bottom"),
        d?.style.removeProperty("--fundal-replay-left"),
        d?.style.removeProperty("--fundal-replay-right"),
        d?.style.removeProperty("--fundal-replay-bottom"));
      return;
    }
    let x = rt(t) || h.querySelector("canvas"),
      E = h.getBoundingClientRect?.(),
      z = x?.getBoundingClientRect?.();
    if (!E || !z || E.width <= 0.5 || z.width <= 0.5) return;
    let Y = 10,
      K = 10;
    if (la() && String(x?.tagName || "").toUpperCase() === "SVG") {
      let X = x.viewBox?.baseVal,
        de = Number(X?.width),
        he = Number(X?.height);
      if (Number.isFinite(de) && de > 0 && Number.isFinite(he) && he > 0) {
        let pe = Math.min(E.width / de, E.height / he),
          Ce = he * pe,
          fn = de * pe,
          On = Math.max(0, (E.width - fn) / 2),
          bt = Math.max(0, (E.height - Ce) / 2);
        ((Y = Math.max(10, Math.round(On + 10))),
          (K = Math.max(10, Math.round(bt + 10))));
      }
    } else
      ((Y = Math.max(10, Math.round(E.right - z.right + 10))),
        (K = Math.max(10, Math.round(E.bottom - z.bottom + 10))));
    (s?.style.setProperty("--fundal-arrow-right", `${Y}px`),
      s?.style.setProperty("--fundal-arrow-bottom", `${K}px`),
      d?.style.setProperty("--fundal-replay-right", `${Y}px`),
      d?.style.setProperty("--fundal-replay-bottom", `${K}px`));
  }
  function Le() {
    P.forEach((t) => Ie(t));
  }
  function It(t) {
    if (!t?.ready || t.failed) return;
    ((t.started = !0), (t.completed = !0), (t.playing = !1), O(t));
    let s = C(t);
    (D(t, s), Ue(t));
    let d = v;
    (!Ze(t, {
      immediate: !0,
      requireRichContent: d,
      minContentAreaRatio: t.minContentAreaRatio,
    }) &&
      t.stage?.dataset?.posterHidden !== "1" &&
      Jt(t, {
        requireRichContent: d,
        minContentAreaRatio: t.minContentAreaRatio,
        checks: d ? 260 : 60,
      }),
      De(t.stage),
      ft(t));
  }
  function it() {
    !S ||
      L ||
      !P.every((s) => s.ready || s.failed) ||
      ((L = !0),
      (w = !0),
      p(!1),
      P.forEach((s) => {
        It(s);
      }),
      y ? We() : zt(),
      Le(),
      requestAnimationFrame(() => {
        (Le(), Ut());
      }));
  }
  function Wt(t, s = $()) {
    let d = t.getBoundingClientRect(),
      h = Z(t, s),
      b = s.viewportHeight || 0,
      x = U(),
      E = Number(t?.dataset?.fileIndex);
    if (Sn(n)) return Math.max(0, h - x);
    if (Dt()) {
      let de = Number.isFinite(E) ? oa(n, E) : 18;
      return Math.max(0, h - x - de);
    }
    let z = h + d.height / 2,
      Y = Math.max(0, b - x),
      K = x + Y / 2,
      X = Number.isFinite(E) ? ia(n, E) : 0;
    if (hr() && Number.isFinite(E) && E > 0) {
      let he = a?.[0]?.getBoundingClientRect?.(),
        pe = Number(he?.height),
        Ce = Number(d?.height);
      (Number.isFinite(pe) &&
        pe > 0 &&
        Number.isFinite(Ce) &&
        Ce > 0 &&
        (X += (Ce - pe) / 2),
        (X -= 24));
    }
    return Math.max(0, z - K - X);
  }
  function Lt(t, s, d = 0, h = 0) {
    let b = Math.max(0, s.viewportHeight - U()),
      [x, E] = String(
        n.stageAspectRatioByFile?.[Number(t.dataset.fileIndex)] ||
          "1169 / 1280",
      )
        .split("/")
        .map(Number);
    t.style.maxWidth = `${(Math.max(120, b - d - h - 32) * x) / E}px`;
    let z = t.getBoundingClientRect().height + h + d,
      Y = U() + (b - z) / 2;
    if (t === a[0]) {
      let he = t.parentElement,
        pe = parseFloat(he.style.paddingTop) || 0,
        Ce = Z(t, s) - pe;
      he.style.paddingTop = `${Math.max(0, Y - Ce)}px`;
    }
    let K = Math.max(0, Z(t, s) - Y),
      X = s.type === "page" ? l : document.documentElement,
      de = Math.max(0, X.scrollHeight - s.viewportHeight);
    if (K > de) {
      let he = t.closest(".childhood-fundal-prep-list");
      he &&
        (he.style.paddingBottom = `${(parseFloat(getComputedStyle(he).paddingBottom) || 0) + K - de + 1}px`);
    }
    return K;
  }
  function ht(t, s = $()) {
    if (n.topAlignedFirstStage && t === a[0]) return jt(s);
    let d = Wt(t, s);
    if (!n.fitCaptionsInViewport && !n.centerPlaybackGroup) return d;
    let h = P[Number(t.dataset.fileIndex)],
      b = h?.segmentTextEl;
    if (!b || r.classList.contains("childhood-fundal-segment-text-hidden"))
      return n.centerPlaybackGroup ? Lt(t, s) : d;
    let x = b.cloneNode(!1);
    (x.removeAttribute("aria-live"),
      x.setAttribute("aria-hidden", "true"),
      Object.assign(x.style, {
        minHeight: "0",
        position: "absolute",
        visibility: "hidden",
        pointerEvents: "none",
        width: `${b.getBoundingClientRect().width}px`,
      }),
      jn(
        x,
        (h.segmentStartTexts || []).map((K) => n.formatCaption?.(K) ?? K),
      ),
      b.parentElement.appendChild(x));
    let E = x.getBoundingClientRect().height;
    x.remove();
    let z = parseFloat(getComputedStyle(b).marginTop) || 0;
    if (n.centerPlaybackGroup)
      return ((b.style.minHeight = `${E}px`), Lt(t, s, E, z));
    let Y = Z(t, s) - d + t.getBoundingClientRect().height + z + E;
    return d + Math.max(0, Y - s.viewportHeight + 16);
  }
  function kt(t) {
    let s = $(),
      d = ht(t, s);
    Math.abs(d - s.scrollTop) <= 1 || we(d, s);
  }
  function jt(t = $()) {
    let s = a[0];
    if (!s) return 0;
    if (n.centerPlaybackGroup && !n.topAlignedFirstStage) return ht(s, t);
    let d = ya(s, n),
      h = U(),
      b = d === s ? (Sn(n) ? 0 : sa(n)) : 0,
      x = Z(d, t);
    return Math.max(0, x - h - b);
  }
  function zt() {
    let t = $(),
      s = jt(t);
    we(s, t);
  }
  function We() {
    let t = P[P.length - 1];
    t?.stage && kt(t.stage);
  }
  function Te(t) {
    if (t?.stage) {
      if (
        t.fileIndex === 0 &&
        (!n.centerPlaybackGroup || n.topAlignedFirstStage)
      ) {
        zt();
        return;
      }
      kt(t.stage);
    }
  }
  function Nt(t) {
    if (n.centerPlaybackGroup) return (kt(t.stage), !0);
    if (Dt() || !t?.stage) return !1;
    let s = $(),
      d = Z(t.stage, s);
    return (we(d - U() - 8, s), !0);
  }
  function kn(t) {
    if (!t || t.playing || P.some((h) => h.playing)) return;
    let s = Ee(t) ? P[t.fileIndex + 1] : null;
    if (!s?.stage) return;
    (n.narrationTimeline && (s.requestedPlayback = !0), Qe(t), st(s), Te(s));
    let d = () => {
      if (me || (n.narrationTimeline && s.started)) return;
      Te(s);
      let h = !1;
      if (
        (u(s) || (h = Nt(s)),
        Le(),
        s.ready &&
          !s.started &&
          !P.some((b) => b.playing) &&
          (n.narrationTimeline || u(s)))
      ) {
        Se(s, { skipAlign: h });
        return;
      }
      He();
    };
    (requestAnimationFrame(() => {
      d();
    }),
      window.setTimeout(d, 180));
  }
  function Bn(t) {
    if (!t || t.playing || P.some((h) => h.playing)) return;
    let s = Number(t.fileIndex) > 0 ? P[t.fileIndex - 1] : null;
    if (!s?.stage) return;
    (st(s), Te(s));
    let d = () => {
      (Te(s),
        Le(),
        _e(),
        s.ready && !s.started && !P.some((h) => h.playing) && u(s) && Se(s));
    };
    (requestAnimationFrame(d), window.setTimeout(d, 180));
  }
  async function rn(t) {
    if (t) {
      if (Ee(t)) {
        kn(t);
        return;
      }
      ue(t) && (await Un(e, 1));
    }
  }
  function Yt(t) {
    let s = t?.target?.closest?.(
      "[data-fundal-page-next-btn='1'], [data-fundal-page-prev-btn='1']",
    );
    if (s && r.contains(s)) {
      (t.preventDefault(), t.stopPropagation());
      let E = s.matches("[data-fundal-page-prev-btn='1']") ? -1 : 1,
        z = Wn(e, E);
      si(z, E);
      return;
    }
    let d = t?.target?.closest?.(
      "[data-fundal-stage-next-btn='1'], [data-fundal-stage-prev-btn='1']",
    );
    if (!d || !r.contains(d)) return;
    let h = d.closest(".childhood-fundal-prep-item"),
      b = Number(h?.dataset?.fileIndex);
    if (!Number.isInteger(b)) return;
    let x = P[b];
    if (x) {
      if (
        (t.preventDefault(),
        t.stopPropagation(),
        d.matches("[data-fundal-stage-prev-btn='1']"))
      ) {
        Bn(x);
        return;
      }
      rn(x);
    }
  }
  function an() {
    ((j =
      window.scrollY ??
      document.documentElement?.scrollTop ??
      document.body?.scrollTop ??
      0),
      (G = l?.scrollTop || 0));
  }
  function At() {
    if (!A) return;
    ((window.scrollY ??
      document.documentElement?.scrollTop ??
      document.body?.scrollTop ??
      0) >
      j + 1 && window.scrollTo({ top: j, behavior: "auto" }),
      l && (l.scrollTop || 0) > G + 1 && (l.scrollTop = G));
  }
  function Bt(t = $()) {
    return t.type === "page"
      ? Math.max(0, Number(G) || 0)
      : Math.max(0, Number(j) || 0);
  }
  function pt(t = $()) {
    return A ? Math.max(0, Number(t?.scrollTop) || 0) >= Bt(t) - 1 : !1;
  }
  function Je(t) {
    if (!t?.touches || t.touches.length !== 1) {
      B = null;
      return;
    }
    let s = Number(t.touches[0]?.clientY);
    B = Number.isFinite(s) ? s : null;
  }
  function be() {
    B = null;
  }
  function on(t) {
    let s = Number(t?.touches?.[0]?.clientY);
    if (!Number.isFinite(s)) return 0;
    let d = B;
    return (
      (B = s),
      !Number.isFinite(d) || Math.abs(s - d) < 0.5 ? 0 : s < d ? 1 : -1
    );
  }
  function sn(t) {
    if (!t) return !1;
    if (t.type === "wheel") {
      let s = Number(t.deltaY);
      return Number.isFinite(s) && s > 0;
    }
    return t.type === "touchmove" ? on(t) > 0 : !1;
  }
  function gt(t) {
    if (!t?.touches || t.touches.length !== 1) {
      q = null;
      return;
    }
    let s = Number(t.touches[0]?.clientY);
    q = Number.isFinite(s) ? s : null;
  }
  function Oe() {
    q = null;
  }
  function Mn(t) {
    let s = Number(t?.touches?.[0]?.clientY);
    if (!Number.isFinite(s)) return 0;
    let d = q;
    return (
      (q = s),
      !Number.isFinite(d) || Math.abs(s - d) < 0.5 ? 0 : s < d ? 1 : -1
    );
  }
  function Mt(t) {
    let s = String(t?.key || ""),
      d = (s === " " || s === "Spacebar") && t.shiftKey === !0,
      h = (s === " " || s === "Spacebar") && t.shiftKey !== !0;
    return s === "ArrowUp" || s === "PageUp" || s === "Home" || d
      ? -1
      : s === "ArrowDown" || s === "PageDown" || s === "End" || h
        ? 1
        : 0;
  }
  function ln(t = $()) {
    return t.scrollTop <= jt(t) + 10;
  }
  function un(t, s = $()) {
    if (!t) return !1;
    let d = xe(t),
      h = d?.getBoundingClientRect?.();
    if (!h || d.disabled || !d.classList.contains("is-visible")) return !1;
    let b = s.type === "page" ? s.topOffset : 0,
      x = b + (s.viewportHeight || 0);
    return h.top >= b + 8 && h.bottom <= x - 8;
  }
  function dn(t = $()) {
    let s = P[P.length - 1];
    return s?.stage ? t.scrollTop >= ht(s.stage, t) - 18 : !1;
  }
  function cn(t = $()) {
    if (t.type === "page" && l)
      return (
        Number(l.scrollTop || 0) + Number(l.clientHeight || 0) >=
        Number(l.scrollHeight || 0) - 2
      );
    let s = document.documentElement,
      d = document.body,
      h = Math.max(Number(s?.scrollHeight || 0), Number(d?.scrollHeight || 0));
    return Number(t.scrollTop || 0) + Number(t.viewportHeight || 0) >= h - 2;
  }
  function _t(t, s) {
    if (Tt || Date.now() < g) return !1;
    if (t < 0)
      return !ce() || !P[0]?.ready || !ln()
        ? !1
        : (s?.preventDefault?.(), s?.stopPropagation?.(), Un(e, -1), !0);
    if (t > 0) {
      if (!at()) return !1;
      let d = P[P.length - 1];
      if (!d?.ready || !d.completed || d.playing) return !1;
      let h = $(),
        b = ue(d) && un(d, h);
      if (ue(d)) {
        if (!b || !cn(h)) return !1;
      } else if (!dn(h)) return !1;
      return (s?.preventDefault?.(), s?.stopPropagation?.(), Un(e, 1), !0);
    }
    return !1;
  }
  function Et(t) {
    let s = Number(t?.deltaY);
    !Number.isFinite(s) || Math.abs(s) < 0.5 || _t(s > 0 ? 1 : -1, t);
  }
  function ke(t) {
    let s = Mn(t);
    s && _t(s, t);
  }
  function je(t) {
    let s = Mt(t);
    s && _t(s, t);
  }
  function ze(t) {
    if (!A || !sn(t)) return;
    let s = $(),
      d = Bt(s),
      h = Math.max(0, Number(s?.scrollTop) || 0);
    if (t.type === "wheel") {
      let b = Number(t.deltaY);
      if (Number.isFinite(b) && b > 0 && h < d - 1) {
        (t.preventDefault(), we(Math.min(d, h + b), s));
        return;
      }
    }
    pt(s) && (t.preventDefault(), At());
  }
  function i(t) {
    if (!A) return;
    let s = t.key || "";
    (!((s === " " || s === "Spacebar") && t.shiftKey !== !0) && !c.has(s)) ||
      (pt() && t.preventDefault());
  }
  function p(t) {
    if (A !== t) {
      if (((A = t), t)) {
        (an(),
          be(),
          (r.style.overscrollBehaviorY = "none"),
          (document.body.style.overscrollBehaviorY = "none"),
          (document.documentElement.style.overscrollBehaviorY = "none"),
          window.addEventListener("touchstart", Je, { passive: !0 }),
          l?.addEventListener("touchstart", Je, { passive: !0 }),
          window.addEventListener("wheel", ze, { passive: !1 }),
          l?.addEventListener("wheel", ze, { passive: !1 }),
          window.addEventListener("touchmove", ze, { passive: !1 }),
          l?.addEventListener("touchmove", ze, { passive: !1 }),
          window.addEventListener("touchend", be, { passive: !0 }),
          l?.addEventListener("touchend", be, { passive: !0 }),
          window.addEventListener("touchcancel", be, { passive: !0 }),
          l?.addEventListener("touchcancel", be, { passive: !0 }),
          window.addEventListener("keydown", i),
          window.addEventListener("scroll", At, { passive: !0 }),
          l?.addEventListener("scroll", At, { passive: !0 }));
        return;
      }
      (be(),
        window.removeEventListener("touchstart", Je),
        l?.removeEventListener("touchstart", Je),
        window.removeEventListener("wheel", ze),
        l?.removeEventListener("wheel", ze),
        window.removeEventListener("touchmove", ze),
        l?.removeEventListener("touchmove", ze),
        window.removeEventListener("touchend", be),
        l?.removeEventListener("touchend", be),
        window.removeEventListener("touchcancel", be),
        l?.removeEventListener("touchcancel", be),
        window.removeEventListener("keydown", i),
        window.removeEventListener("scroll", At),
        l?.removeEventListener("scroll", At),
        (r.style.overscrollBehaviorY = m.page),
        (document.body.style.overscrollBehaviorY = m.body),
        (document.documentElement.style.overscrollBehaviorY = m.doc));
    }
  }
  function u(t) {
    let s = t?.stage?.getBoundingClientRect?.(),
      d = window.innerHeight || document.documentElement?.clientHeight || 0;
    if (!s || s.height <= 0.5 || d <= 0 || s.bottom <= 0 || s.top >= d)
      return !1;
    let h = d / 2,
      b = s.top + s.height / 2,
      x = Math.max(90, Math.min(220, d * 0.22));
    return Math.abs(b - h) <= x;
  }
  function I() {
    for (let t = 0; t < P.length; t += 1) {
      let s = P[t];
      if (!(s.failed || s.started))
        return t > 0 && !P[t - 1]?.completed ? null : s;
    }
    return null;
  }
  function N(t, s) {
    if (!t || !s || !Oi(n, t.fileIndex)) return null;
    let d = [
      t.lastRichVisibleFrameEver,
      t.lastVisibleFrameEver,
      t.lastRichVisibleFrame,
      t.lastVisibleFrame,
    ];
    for (let h = 0; h < d.length; h += 1) {
      let b = Number(d[h]);
      if (Number.isFinite(b) && nt(b, s)) return V(t, b);
    }
    return null;
  }
  function C(t) {
    let s = Pt(t?.anim),
      d = Pr(n, t?.fileIndex),
      h = Array.isArray(t?.playbackSegments)
        ? t.playbackSegments[t.playbackSegments.length - 1]
        : null,
      b = (X, de = {}) => (h ? In(t, h, X, de) : St(t, X, de)),
      x = N(t, h),
      E = V(t, d ?? x ?? (h ? dt(h) : s));
    try {
      t.anim?.goToAndStop(E, !0);
    } catch {}
    k(t);
    let z = !H(t),
      Y = !t.requireRichContent || ie(t, t.minContentAreaRatio);
    if (z && (Y || An(n))) return (Pe(t, E), E);
    if (d != null)
      return (
        tt(t)
          ? Ke(t, E, { minContentAreaRatio: t.minContentAreaRatio })
          : et(t),
        E
      );
    let K = b(E, {
      requireRichContent: t.requireRichContent === !0,
      minContentAreaRatio: t.minContentAreaRatio,
    });
    E = V(t, K);
    try {
      t.anim?.goToAndStop(E, !0);
    } catch {}
    if (
      (k(t),
      H(t) || (t.requireRichContent === !0 && !ie(t, t.minContentAreaRatio)))
    ) {
      let X = b(E);
      E = V(t, X);
      try {
        t.anim?.goToAndStop(E, !0);
      } catch {}
      k(t);
    }
    return (Pe(t, E), E);
  }
  function ne(t = null) {
    if (xt()) return !0;
    let s = Number(t?.fileIndex);
    return Number.isFinite(s) && s === P.length - 1 && t?.completed === !0;
  }
  function Q(t = null) {
    w ||
      !ne(t) ||
      ((w = !0),
      document.dispatchEvent(
        new CustomEvent("childhoodWorkshop:route-complete", {
          detail: { target: n.pageId },
        }),
      ));
  }
  async function R(t, s) {
    let d = V(t, Number(s));
    for (let h = 0; h < 4; h += 1) {
      ge(t, { immediate: !0 });
      try {
        (t.anim?.pause?.(), t.anim?.goToAndStop?.(d, !0));
      } catch {}
      if ((k(t), D(t, d), T(t), De(t.stage), await hn(1), !H(t)))
        return (Pe(t, d), ge(t, { immediate: !0 }), d);
    }
    return (ge(t, { immediate: !0 }), d);
  }
  async function M(t) {
    if (me) return;
    if (((t.playing = !1), p(!1), Hi(n, t.fileIndex))) {
      let b = V(t, Math.floor(Number(t.anim?.currentFrame || 0)));
      (Pe(t, b), t.anim?.pause?.());
      let x = Di(n, t.fileIndex);
      (x
        ? qr(t, x)
        : tt(t)
          ? Ke(t, b, { minContentAreaRatio: t.minContentAreaRatio })
          : et(t),
        (t.lastPinnedFrame = b));
    } else {
      t.lastPinnedFrame = C(t);
      let b = Pr(n, t.fileIndex);
      b != null && qi(n, t.fileIndex)
        ? (t.lastPinnedFrame = await R(t, b))
        : Ve(t, { checks: 2, requiredStablePasses: 1 });
    }
    let d = v;
    (!Ze(t, {
      immediate: !0,
      requireRichContent: d,
      minContentAreaRatio: t.minContentAreaRatio,
    }) &&
      t.stage?.dataset?.posterHidden !== "1" &&
      Jt(t, {
        requireRichContent: d,
        minContentAreaRatio: t.minContentAreaRatio,
        checks: d ? 260 : 60,
      }),
      !me &&
        (De(t.stage),
        t.completed || (t.completed = !0),
        Ue(t),
        ft(t),
        _e(),
        Ln(t, v ? 18 : 12),
        Q(t),
        requestAnimationFrame(() => {
          He();
        })));
  }
  function T(t) {
    let s = t?.anim;
    if (!s) return null;
    t.stage?.dataset?.posterHidden !== "1" &&
      Ze(t, {
        requireRichContent: v,
        minContentAreaRatio: t.minContentAreaRatio,
      });
    let d = Math.floor(Number(s.currentFrame));
    return Number.isFinite(d)
      ? ((t.lastRenderedFrame = V(t, d)),
        H(t) ||
          ((t.lastVisibleFrame = t.lastRenderedFrame),
          (t.lastVisibleFrameEver = t.lastRenderedFrame),
          ie(t, t.minContentAreaRatio) &&
            ((t.lastRichVisibleFrame = t.lastRenderedFrame),
            (t.lastRichVisibleFrameEver = t.lastRenderedFrame))),
        t.lastRenderedFrame)
      : null;
  }
  function J(t) {
    let s = Kr(n, t.fileIndex);
    try {
      t.anim?.goToAndStop(s, !0);
    } catch {}
    if ((k(t), H(t))) {
      let b = St(t, s);
      try {
        t.anim?.goToAndStop(b, !0);
      } catch {}
      k(t);
    }
    if (!H(t)) {
      let b = V(t, Math.floor(Number(t.anim?.currentFrame || 0)));
      ((t.lastVisibleFrame = b),
        (t.lastVisibleFrameEver = b),
        ie(t, t.minContentAreaRatio) &&
          ((t.lastRichVisibleFrame = b), (t.lastRichVisibleFrameEver = b)),
        (t.lastPinnedFrame = b));
    }
    let d = v;
    !Ze(t, {
      immediate: !0,
      requireRichContent: d,
      minContentAreaRatio: t.minContentAreaRatio,
    }) &&
      t.stage?.dataset?.posterHidden !== "1" &&
      Jt(t, {
        requireRichContent: d,
        minContentAreaRatio: t.minContentAreaRatio,
        checks: d ? 260 : 60,
      });
  }
  function Be(t, s, d) {
    if (!t) return;
    let h = Number(t.recoverySnapshotFrame),
      b = Number(t.recoverySnapshotSegmentIndex);
    ((Number.isFinite(h) && h > Number(s) + 1) ||
      (Number.isFinite(b) && b > Number(d))) &&
      ((t.recoverySnapshotMarkup = ""),
      (t.recoverySnapshotCanvasDataUrl = ""),
      (t.recoverySnapshotFrame = null),
      (t.recoverySnapshotSegmentIndex = -1));
  }
  function ae(t, s, d, h) {
    let b = Number(s),
      x = Number(d);
    if (!Number.isFinite(b) || !Number.isFinite(x) || b > x + 0.75) return;
    let E = Math.max(3, Math.min(18, Math.floor(x * 0.04)));
    b < x - E ||
      H(t) ||
      ((t.playingSegmentIndex = h),
      Pe(t, b) && (t.recoverySnapshotSegmentIndex = h));
  }
  function te(t, s, d = {}) {
    let h = V(t, Number(s)),
      b = Number.isFinite(Number(d.minContentAreaRatio))
        ? Math.max(0.01, Number(d.minContentAreaRatio))
        : t.minContentAreaRatio,
      x = Number.isFinite(Number(d.attempts))
        ? Math.floor(Number(d.attempts))
        : v
          ? 6
          : 3,
      E = ye(t, h, {
        attempts: x,
        minContentAreaRatio: b,
        allowFrameShift: !1,
      });
    return (
      k(t),
      D(t, h),
      T(t),
      !E.isBlank &&
      (An(n) ||
        !Me(t, {
          requireRichContent: t.requireRichContent === !0,
          minContentAreaRatio: b,
        }))
        ? (Pe(t, h),
          Ve(t, { checks: v ? 4 : 2, requiredStablePasses: 1 }),
          { frame: h, isBlank: !1 })
        : (tt(t) ? Ke(t, h, { minContentAreaRatio: b }) : et(t),
          { frame: h, isBlank: !0 })
    );
  }
  function fe(t, s, d = 0, h = {}) {
    return new Promise((b) => {
      let x = t?.anim;
      if (!x) {
        b(!1);
        return;
      }
      let E = !1,
        z = h?.pinOnFinish !== !1,
        Y = V(t, Number(s?.[0])),
        K = V(t, Number(s?.[1]));
      if (
        (Be(t, K, d),
        (t.playingSegmentIndex = d),
        (t.targetEndFrame = K),
        Y === K)
      ) {
        (z
          ? te(t, Y, { attempts: v ? 6 : 3 })
          : (x.goToAndStop?.(Y, !0), k(t), D(t, Y), T(t)),
          b(!0));
        return;
      }
      let X = Math.max(1, Math.abs(K - Y)),
        de = Math.max(0.1, zr() ?? Kn(n, t.fileIndex, d) ?? Gn(n, t.fileIndex)),
        he = Math.max(2500, Math.min(45e3, (X / 29.97 / de) * 1e3 + 5e3)),
        pe = (bt) => {
          if (!E) {
            ((E = !0), clearTimeout(On));
            try {
              x.removeEventListener("complete", Ce);
            } catch {}
            try {
              x.removeEventListener("enterFrame", fn);
            } catch {}
            try {
              x.pause?.();
            } catch {}
            if (z) te(t, K, { attempts: v ? 6 : 3 });
            else {
              try {
                x.goToAndStop?.(K, !0);
              } catch {}
              (k(t), D(t, K), T(t));
            }
            b(bt);
          }
        },
        Ce = () => pe(!0),
        fn = () => {
          let bt = T(t);
          (Number.isFinite(Number(bt)) && (D(t, bt), ae(t, bt, K, d)),
            Number(bt) >= K - 0.25 && pe(!0));
        },
        On = setTimeout(() => pe(!1), he);
      try {
        (typeof x.setSpeed == "function" && x.setSpeed(de),
          x.addEventListener("complete", Ce),
          x.addEventListener("enterFrame", fn),
          x.pause?.(),
          x.goToAndStop(Y, !0),
          k(t),
          D(t, Y),
          x.playSegments([Y, K], !0));
      } catch {
        pe(!1);
      }
    });
  }
  async function Ye(t, s) {
    let d = V(t, Number(s));
    return (
      (t.activePauseFrame = d),
      te(t, d, { attempts: v ? 8 : 4 }),
      De(t.stage),
      tt(t)
        ? (Ke(t, d, { minContentAreaRatio: t.minContentAreaRatio }), d)
        : (await hn(2),
          te(t, d, { attempts: v ? 8 : 4 }),
          De(t.stage),
          H(t)
            ? (et(t), d)
            : (Pe(t, d), Ve(t, { checks: 2, requiredStablePasses: 1 }), d))
    );
  }
  async function Gt(t, s) {
    t.manualSegmentPlayback = !0;
    try {
      for (let h = 0; h < s.length; h += 1) {
        if (!t.playing) return !1;
        let b = s[h],
          x = ca(n, t.fileIndex, h),
          E = x > 0 && h < s.length - 1,
          z = h === s.length - 1 || E;
        (ge(t, { immediate: !0 }),
          D(t, b[0]),
          await fe(t, b, h, { pinOnFinish: z }),
          E &&
            (await Ye(t, b[1]),
            await wi(x),
            (t.activePauseFrame = null),
            D(t, b[1]),
            Ve(t, { checks: 2, requiredStablePasses: 1 })));
      }
    } finally {
      ((t.manualSegmentPlayback = !1),
        (t.activePauseFrame = null),
        (t.playingSegmentIndex = -1),
        (t.targetEndFrame = null),
        bn(t.anim, n, t.fileIndex));
    }
    let d = s[s.length - 1] || null;
    return (d && D(t, d[1]), await M(t), !0);
  }
  function ot(t) {
    let s = n.narrationTimeline[t.fileIndex];
    ((t.manualSegmentPlayback = !0), (t.timelineTime = s[0][0]));
    let d = null,
      h = null,
      b = () => {
        if (me || !t.playing) return;
        let x =
            n.narrationClipsByFile?.[t.fileIndex]?.endByLanguage?.[
              oe.getLanguage()
            ],
          E = Number.isFinite(x) ? [...s.slice(0, -1), [x, s.at(-1)[1]]] : s,
          z =
            E[E.length - 1][0] +
            Math.max(0, Number(n.narrationCompletionPauseSeconds) || 0),
          Y = oe.getPosition();
        Y.finished && h == null && (h = performance.now());
        let K = Y.finished
          ? Math.min(z, Y.time + (performance.now() - h) / 1e3)
          : Y.time;
        t.timelineTime = K;
        let X = V(t, Er(E, K));
        if (X !== d) {
          ((t.activePauseFrame = null),
            ge(t, { immediate: !0 }),
            t.anim.goToAndStop(X, !0),
            k(t));
          let de = xa(t, X);
          (de && qr(t, de), (d = X));
        }
        if ((D(t, X), Y.finished && K >= z)) {
          ((t.timelineRaf = null),
            (t.manualSegmentPlayback = !1),
            (t.lastPinnedFrame = X),
            M(t));
          return;
        }
        t.timelineRaf = requestAnimationFrame(b);
      };
    b();
  }
  async function Se(t, { replay: s = !1, skipAlign: d = !1 } = {}) {
    if (
      !t?.ready ||
      t.failed ||
      t.playing ||
      P.some((X) => X.playing) ||
      (!s && t.started) ||
      (!s && t.fileIndex > 0 && !P[t.fileIndex - 1]?.completed)
    )
      return !1;
    if (
      ((t.started = !0),
      (t.playing = !0),
      n.narrationTimeline && (t.completed = !1),
      oe?.playForStage(t.fileIndex),
      _e(),
      _n(t),
      wt(),
      ge(t, { immediate: !0 }),
      O(t),
      ve(t),
      d || Te(t),
      p(!0),
      n.narrationTimeline && oe)
    )
      return (ot(t), Ie(t), !0);
    let h =
        Array.isArray(t.playbackSegments) && t.playbackSegments.length > 0
          ? t.playbackSegments
          : Or(n, t.fileIndex, t.anim),
      b = h[0] || null,
      x = V(t, Number(b?.from)),
      E = dt(h[h.length - 1]);
    if (E <= 0) return (await M(t), !0);
    let z = h.map((X) => [V(t, Number(X?.from)), V(t, dt(X))]),
      Y = ma(n, t.fileIndex, z.length),
      K = Gr(n, t.fileIndex, z.length);
    try {
      (t.anim?.pause(),
        t.anim?.goToAndStop(x, !0),
        Y || K
          ? Gt(t, z)
          : z.length > 1
            ? t.anim?.playSegments(z, !0)
            : t.anim?.playSegments(z[0] || [x, E], !0));
    } catch {
      try {
        t.anim?.goToAndPlay(x, !0);
      } catch {}
    }
    return (k(t), D(t, x), Ie(t), !0);
  }
  async function mn(t) {
    !t || t.playing || !t.ready || (await Se(t, { replay: !0 }));
  }
  function He() {
    if (Da() || P.some((s) => s.playing)) return;
    let t = I();
    if (!t) {
      Q();
      return;
    }
    if (t.fileIndex === 0) {
      !_ && t.ready && ((_ = !0), Se(t));
      return;
    }
    if (!t.ready) {
      st(t);
      return;
    }
    u(t) && Se(t);
  }
  function Ge() {
    if (n.centerPlaybackGroup) {
      let h = P.find((b) => b.playing);
      h && (kt(h.stage), an());
    }
    let t = $(),
      s = Number(t?.scrollTop || 0),
      d = Number.isFinite(Ae) && s > Ae + 6;
    ((Ae = s), d && Ut(), Le(), He());
  }
  async function Kt() {
    let t = ++Ne;
    if (
      (oe?.refreshLanguage(),
      await dr(oe?.getLanguage() || lt()),
      !(me || t !== Ne))
    ) {
      if (n.getSectionTitle) {
        let s = oe?.getLanguage() || Rt(n);
        r.querySelectorAll("[data-section-title]").forEach((d) => {
          d.textContent = n.getSectionTitle(d.dataset.sectionTitle, s);
        });
      }
      P.forEach((s) => {
        (ee(s),
          n.renderStageArtwork?.(
            s,
            s.anim?.currentFrame ?? 0,
            oe?.getLanguage() || Rt(n),
          ));
        let d = Ht(s.stage, s.replayBtn);
        d && zn(d, qe("Replay"));
        let h = xe(s);
        (h &&
          (ue(s)
            ? qt(h, "page", qe("Next page") || "Next page")
            : qt(h, "stage", qe("Next animation") || "Next animation")),
          mt(s));
      });
    }
  }
  function st(t) {
    if (!t || t.anim || t.loading) return;
    (ee(t), (t.loading = !0));
    let s = window.lottie.loadAnimation({
      container: t.stage,
      renderer: cr(n, t.fileIndex),
      loop: !1,
      autoplay: !1,
      path: n.paths[t.fileIndex],
      rendererSettings: {
        preserveAspectRatio: fr(n, t.fileIndex),
        hideOnTransparent: !1,
      },
    });
    (bn(s, n, t.fileIndex), (t.anim = s));
    let d = () => {
        if (
          ((t.loading = !1),
          (t.segments = va(n, t.fileIndex, s)),
          (t.playbackSegments = Or(n, t.fileIndex, s, t.segments)),
          (t.ready = !0),
          J(t),
          Ie(t),
          n.narrationTimeline && t.requestedPlayback && !me)
        ) {
          Se(t);
          return;
        }
        if (S) {
          it();
          return;
        }
        t.fileIndex === 0 && !_
          ? requestAnimationFrame(() => {
              (zt(), He());
            })
          : requestAnimationFrame(() => {
              He();
            });
      },
      h = () => {
        ((t.loading = !1),
          (t.failed = !0),
          console.error(
            "[fundalScroll] animation data failed:",
            n.paths[t.fileIndex],
          ));
      },
      b = () => {
        if (
          (n.renderStageArtwork?.(
            t,
            t.anim?.currentFrame ?? 0,
            oe?.getLanguage() || Rt(n),
          ),
          t.activePauseFrame != null &&
            Number.isFinite(Number(t.activePauseFrame)))
        ) {
          let z = V(t, Number(t.activePauseFrame)),
            Y = Number(t.anim?.currentFrame);
          try {
            (t.anim?.pause?.(),
              (!Number.isFinite(Y) || Math.abs(Y - z) > 0.75) &&
                t.anim?.goToAndStop?.(z, !0));
          } catch {}
          (k(t), T(t), D(t, z), Ie(t));
          return;
        }
        let E = T(t);
        (t.playing && Number.isFinite(E) && D(t, E), Ie(t));
      },
      x = () => {
        t.manualSegmentPlayback !== !0 && M(t);
      };
    (s.addEventListener("DOMLoaded", d),
      s.addEventListener("data_failed", h),
      s.addEventListener("enterFrame", b),
      s.addEventListener("complete", x),
      (t.animationListeners = {
        onReady: d,
        onDataFailed: h,
        onEnterFrame: b,
        onComplete: x,
      }));
  }
  function _n(t) {
    if (!kr(n)) return;
    let s = P[Number(t?.fileIndex) + 1];
    s && st(s);
  }
  if (S) P.forEach((t) => st(t));
  else if (kr(n)) {
    let t = Math.max(
      1,
      Math.min(
        P.length,
        Number.isFinite(Number(n.lazyInitialStageCount))
          ? Math.floor(Number(n.lazyInitialStageCount))
          : 2,
      ),
    );
    for (let s = 0; s < t; s += 1) st(P[s]);
  } else P.forEach((t) => st(t));
  function yt(t) {
    if (!t) return null;
    let s = rt(t),
      d = String(s?.tagName || "").toLowerCase(),
      h = s?.getBoundingClientRect?.();
    return {
      routeName: e,
      fileIndex: Number(t.fileIndex),
      ready: t.ready === !0,
      failed: t.failed === !0,
      started: t.started === !0,
      completed: t.completed === !0,
      playing: t.playing === !0,
      posterHidden: t.stage?.dataset?.posterHidden === "1",
      renderType: d || "missing",
      hasSvg: d === "svg",
      hasCanvas: d === "canvas",
      currentFrame: V(t, Math.floor(Number(t.anim?.currentFrame || 0))),
      renderWidth: Number.isFinite(Number(h?.width)) ? Number(h.width) : 0,
      renderHeight: Number.isFinite(Number(h?.height)) ? Number(h.height) : 0,
      playbackSegments: Array.isArray(t.playbackSegments)
        ? t.playbackSegments.map((b) => ({ from: Number(b?.from), to: dt(b) }))
        : [],
      playbackSegmentRates: Array.isArray(t.playbackSegments)
        ? t.playbackSegments.map(
            (b, x) => Kn(n, t.fileIndex, x) ?? Gn(n, t.fileIndex),
          )
        : [],
      recoveryOverlayVisible: (() => {
        let b = t.stage?.querySelector(".childhood-fundal-recovery-overlay");
        return (
          !!b && b.style.visibility !== "hidden" && b.style.opacity !== "0"
        );
      })(),
      recoveryOverlayImageSrc:
        t.stage
          ?.querySelector(".childhood-fundal-recovery-overlay img")
          ?.getAttribute("src") || "",
      recoverySnapshotFrame: Number.isFinite(Number(t.recoverySnapshotFrame))
        ? Number(t.recoverySnapshotFrame)
        : null,
      replayVisible: Ht(t.stage, t.replayBtn)?.style?.display !== "none",
    };
  }
  async function Ca(t, s, d = {}) {
    let h = P[Number(t)];
    if (!h)
      return {
        routeName: e,
        fileIndex: Number(t),
        ready: !1,
        failed: !0,
        reason: "missing-stage",
      };
    if (!h.ready || !h.anim) return { ...yt(h), reason: "not-ready" };
    let b = V(h, Number(s)),
      x = d?.requireRichContent == null ? v : d.requireRichContent === !0;
    try {
      (h.anim.pause?.(), h.anim.goToAndStop(b, !0));
    } catch {
      return { ...yt(h), reason: "seek-failed" };
    }
    return (
      ge(h, { immediate: !0 }),
      ve(h),
      k(h),
      Ze(h, {
        immediate: !0,
        requireRichContent: x,
        minContentAreaRatio: h.minContentAreaRatio,
      }),
      T(h),
      D(h, b),
      Ie(h),
      De(h.stage),
      await hn(3),
      k(h),
      Ze(h, {
        immediate: !0,
        requireRichContent: x,
        minContentAreaRatio: h.minContentAreaRatio,
      }),
      T(h),
      D(h, b),
      Ie(h),
      De(h.stage),
      await hn(2),
      yt(h)
    );
  }
  return (
    Va(e, {
      getStageState: (t) => yt(P[Number(t)]),
      seekStage: (t, s, d) => Ca(t, s, d),
      loadStage: (t) => {
        let s = P[Number(t)];
        return (!s || s.failed || st(s), yt(s));
      },
      showExactFrameFallback: (t, s) => {
        let d = P[Number(t)];
        if (!d?.ready || !d.anim) return null;
        let h = Ke(d, s, { minContentAreaRatio: d.minContentAreaRatio });
        return (D(d, h), Ie(d), yt(d));
      },
    }),
    _r(r),
    r.addEventListener("click", Yt),
    window.addEventListener("touchstart", gt, { passive: !0 }),
    l?.addEventListener("touchstart", gt, { passive: !0 }),
    window.addEventListener("touchend", Oe, { passive: !0 }),
    l?.addEventListener("touchend", Oe, { passive: !0 }),
    window.addEventListener("touchcancel", Oe, { passive: !0 }),
    l?.addEventListener("touchcancel", Oe, { passive: !0 }),
    window.addEventListener("wheel", Et, { passive: !1 }),
    l?.addEventListener("wheel", Et, { passive: !1 }),
    window.addEventListener("touchmove", ke, { passive: !1 }),
    l?.addEventListener("touchmove", ke, { passive: !1 }),
    window.addEventListener("keydown", je),
    window.addEventListener("scroll", Ge, { passive: !0 }),
    l?.addEventListener("scroll", Ge, { passive: !0 }),
    window.addEventListener("resize", Ge, { passive: !0 }),
    window.addEventListener("pageshow", Ge, { passive: !0 }),
    window.addEventListener("orientationchange", Ge, { passive: !0 }),
    {
      routeName: e,
      refreshLanguage: Kt,
      controllers: P,
      animations: P.map((t) => t.anim).filter((t) => !!t),
      observer: null,
      removeInputListeners: () => {
        ((me = !0),
          oe?.destroy(),
          p(!1),
          Oe(),
          window.removeEventListener("touchstart", gt),
          l?.removeEventListener("touchstart", gt),
          window.removeEventListener("touchend", Oe),
          l?.removeEventListener("touchend", Oe),
          window.removeEventListener("touchcancel", Oe),
          l?.removeEventListener("touchcancel", Oe),
          window.removeEventListener("wheel", Et),
          l?.removeEventListener("wheel", Et),
          window.removeEventListener("touchmove", ke),
          l?.removeEventListener("touchmove", ke),
          window.removeEventListener("keydown", je),
          window.removeEventListener("scroll", Ge),
          l?.removeEventListener("scroll", Ge),
          window.removeEventListener("resize", Ge),
          window.removeEventListener("pageshow", Ge),
          window.removeEventListener("orientationchange", Ge),
          r.removeEventListener("click", Yt),
          P.forEach((t) => {
            (t.timelineRaf != null && cancelAnimationFrame(t.timelineRaf),
              Nn(t),
              Xt(t),
              ge(t, { immediate: !0 }),
              ve(t));
            try {
              (t.anim?.removeEventListener(
                "DOMLoaded",
                t.animationListeners?.onReady,
              ),
                t.anim?.removeEventListener(
                  "data_failed",
                  t.animationListeners?.onDataFailed,
                ),
                t.anim?.removeEventListener(
                  "enterFrame",
                  t.animationListeners?.onEnterFrame,
                ),
                t.anim?.removeEventListener(
                  "complete",
                  t.animationListeners?.onComplete,
                ));
            } catch {}
            t.animationListeners = null;
          }),
          _r(r));
      },
    }
  );
}
function nn(e) {
  let n = le[e];
  return n ? { ...bi(e, n), routeName: e } : null;
}
function mo(e = [], n = {}) {
  let a = (Array.isArray(e) ? e : [String(e || "").trim()])
      .map((f) => String(f || "").trim())
      .filter((f) => !!f),
    o = a.length ? a : Object.keys(le),
    m =
      String(n?.mode || "idle")
        .trim()
        .toLowerCase() === "route"
        ? "route"
        : "idle",
    c = n?.loadLottie !== !1;
  (o.forEach((f) => {
    let g = nn(f);
    g && ga(g, { mode: m });
  }),
    c && ba());
}
async function fo(e) {
  let n = nn(e);
  if (!n) return;
  if (n.loadText) {
    await n.loadText();
    let w = document.getElementById(n.pageId);
    if (!w?.isConnected || w.style.display === "none") return;
  }
  let r = ii(e),
    a = document.getElementById(n.pageId);
  if (!a) return;
  (li(a),
    a.classList.toggle("childhood-fundal-scroll-page--has-next-page", Zr(e)),
    mr());
  let o = a.querySelector(".childhood-fundal-prep-list"),
    l = Bi(o, n.label, n.paths.length, n);
  if (!l.length) return;
  (window.I18N?.applyTranslations?.(a), ga(n, { mode: "route" }));
  let m = String(n.paths?.[0] || "").trim(),
    c =
      m && n.skipRouteImageWarmup !== !0
        ? tr(m, {
            rel: "preload",
            fetchPriority: "high",
            warmup: !0,
            warmCount: v ? 8 : 6,
            awaitWarmup: !0,
            timeoutMs: v ? 1200 : 800,
          }).catch(() => 0)
        : Promise.resolve(0);
  await new Promise((w) => {
    if (typeof requestAnimationFrame == "function") {
      requestAnimationFrame(() => w());
      return;
    }
    setTimeout(w, 0);
  });
  let f = dr(Rt(n)).catch((w) => {
      console.error("[fundalScroll] dictionary preload failed", w);
    }),
    g = ba(),
    [F] = await Promise.all([g, c]);
  if (!F) {
    console.error("[fundalScroll] lottie is not available");
    return;
  }
  if (n.playMode === "stageAutoplay") {
    (await f, (Fe = eo(e, n, a, l, r)));
    return;
  }
  if (n.playMode === "segmentScroll") {
    ((Fe = Zi(n, a, l)), f.then(() => ra()));
    return;
  }
  await f;
  let y = l.map((w, _) => {
      let L = window.lottie.loadAnimation({
        container: w,
        renderer: cr(n, _),
        loop: !0,
        autoplay: !1,
        path: n.paths[_],
        rendererSettings: {
          preserveAspectRatio: fr(n, _),
          hideOnTransparent: !1,
        },
      });
      return (bn(L, n, _), L);
    }),
    S = Mi(l, y);
  Fe = { routeName: e, observer: S, animations: y };
}
window.__fundalScrollCleanupWired ||
  ((window.__fundalScrollCleanupWired = !0),
  window.addEventListener("page:loaded", (e) => {
    let n = e?.detail?.routeName || "";
    le[n] || mr();
  }));
export {
  _a as BINOCULAR_INDIRECT_OPHTHALMOSCOPY_SCROLL_NARRATION_CLIPS,
  Ba as BINOCULAR_INDIRECT_OPHTHALMOSCOPY_SCROLL_NARRATION_TRACKS,
  Ma as DIRECT_OPHTHALMOSCOPY_SCROLL_NARRATION_CLIPS,
  ka as DIRECT_OPHTHALMOSCOPY_SCROLL_NARRATION_TRACKS,
  La as FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_CLIPS,
  jr as FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_TRACKS,
  ba as ensureLottie,
  fo as initializeChildhoodFundalReflexScrollPage,
  Ja as initializeFundalStageNarration,
  mo as prewarmChildhoodFundalRouteAssets,
  co as registerExaminationScrollRoute,
};
