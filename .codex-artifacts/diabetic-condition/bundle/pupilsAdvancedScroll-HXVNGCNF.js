import { a as r, c as i } from "./chunk-KKOYVSFI.js";
import "./chunk-WOT6VMZA.js";
var h = "pupilsAdvancedScrollPage",
  u = "pupilsAdvancedScroll",
  d = {
    en: { label: "English", locale: "en-GB", voice: "en-GB-SoniaNeural" },
    ko: {
      label: "\uD55C\uAD6D\uC5B4",
      locale: "ko-KR",
      voice: "ko-KR-SunHiNeural",
    },
  },
  f = [
    { startIndex: 0, title: "Afferent and Efferent Pathways" },
    { startIndex: 3, title: "Direct and Consensual Light Response Explained" },
    { startIndex: 4, title: "Observation" },
    { startIndex: 5, title: "Direct Light Response" },
    { startIndex: 10, title: "Consensual Response" },
    { startIndex: 11, title: "Swinging Light Test" },
    { startIndex: 13, title: "Near Response" },
  ],
  g = [
    "\uAD6C\uC2EC\uC131 \uBC0F \uC6D0\uC2EC\uC131 \uACBD\uB85C",
    "\uC9C1\uC811\xB7\uAC04\uC811 \uB300\uAD11\uBC18\uC0AC \uACBD\uB85C",
    "\uAD00\uCC30",
    "\uC9C1\uC811 \uB300\uAD11\uBC18\uC0AC",
    "\uAC04\uC811 \uB300\uAD11\uBC18\uC0AC",
    "\uAD50\uB300\uBD88\uBE5B\uAC80\uC0AC",
    "\uADFC\uC811\uBC18\uC751",
  ],
  l = [
    {
      name: "Afferent sensory pathway",
      seconds: 30,
      cues: [
        {
          id: "afferent-light",
          offset: 0,
          end: 5.6,
          en: "Light entering the eye starts a signal in the afferent, or sensory pathway.",
          ko: "\uB208\uC73C\uB85C \uB4E4\uC5B4\uC628 \uBE5B\uC740 \uAD6C\uC2EC\uC131 \uAC10\uAC01 \uACBD\uB85C\uC758 \uC2E0\uD638\uB97C \uC2DC\uC791\uD569\uB2C8\uB2E4.",
        },
        {
          id: "afferent-brain",
          offset: 5.6,
          end: 30,
          en: "Follow the coloured pathways (retina, optic nerve, chiasm, tract and nuclei).",
          ko: "\uC0C9\uC73C\uB85C \uD45C\uC2DC\uB41C \uACBD\uB85C(\uB9DD\uB9C9, \uC2DC\uC2E0\uACBD, \uC2DC\uC2E0\uACBD\uAD50\uCC28, \uC2DC\uC0AD, \uC2E0\uACBD\uD575)\uB97C \uB530\uB77C\uAC11\uB2C8\uB2E4.",
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
          ko: "\uC6D0\uC2EC\uC131 \uACBD\uB85C\uB294 \uAD6C\uC2EC\uC131 \uACBD\uB85C\uC640 \uBC18\uB300\uB85C, \uB1CC\uC5D0\uC11C \uB208\uC73C\uB85C \uC2E0\uD638\uB97C \uC804\uB2EC\uD569\uB2C8\uB2E4.",
        },
        {
          id: "parasympathetic",
          offset: 8,
          end: 18,
          en: "The parasympathetic pathway passes through the third cranial nerve and the ciliary ganglion.",
          ko: "\uBD80\uAD50\uAC10\uC2E0\uACBD \uACBD\uB85C\uB294 \uC81C3\uB1CC\uC2E0\uACBD\uACFC \uC12C\uBAA8\uCCB4\uC2E0\uACBD\uC808\uC744 \uC9C0\uB0A9\uB2C8\uB2E4.",
        },
        {
          id: "constrictor",
          offset: 18,
          end: 25,
          en: "It supplies the pupil constrictor and the ciliary muscle.",
          ko: "\uC774 \uACBD\uB85C\uB294 \uB3D9\uACF5\uAD04\uC57D\uADFC\uACFC \uC12C\uBAA8\uCCB4\uADFC\uC5D0 \uC5F0\uACB0\uB429\uB2C8\uB2E4.",
        },
        {
          id: "third-nerve",
          offset: 25,
          end: 32,
          en: "The third cranial nerve also supplies eye movements and the main eyelid muscle.",
          ko: "\uC81C3\uB1CC\uC2E0\uACBD\uC740 \uC548\uAD6C\uC6B4\uB3D9\uACFC \uB208\uAEBC\uD480\uC744 \uC62C\uB9AC\uB294 \uC8FC\uB41C \uADFC\uC721\uC5D0\uB3C4 \uC5F0\uACB0\uB429\uB2C8\uB2E4.",
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
          ko: "\uAD50\uAC10\uC2E0\uACBD \uACBD\uB85C\uB294 \uAD50\uAC10\uC2E0\uACBD\uC904\uAE30\uC640 \uC704\uBAA9\uC2E0\uACBD\uC808\uC744 \uC9C0\uB0A9\uB2C8\uB2E4.",
        },
        {
          id: "dilator",
          offset: 10,
          end: 20,
          en: "It supplies the pupil dilator and a minor eyelid muscle, as shown in the diagram.",
          ko: "\uADF8\uB9BC\uCC98\uB7FC \uC774 \uACBD\uB85C\uB294 \uB3D9\uACF5\uC0B0\uB300\uADFC\uACFC \uB208\uAEBC\uD480\uC758 \uBCF4\uC870 \uADFC\uC721\uC5D0 \uC5F0\uACB0\uB429\uB2C8\uB2E4.",
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
          ko: "\uD55C\uCABD \uB208\uC5D0 \uBE44\uCE5C \uBE5B\uC740 \uAD6C\uC2EC\uC131 \uC2E0\uD638\uB97C \uB1CC\uB85C \uC804\uB2EC\uD569\uB2C8\uB2E4.",
        },
        {
          id: "reflex-output",
          offset: 8,
          end: 16,
          en: "Efferent signals then travel to both pupils, causing them to constrict in response to light.",
          ko: "\uC774\uC5B4\uC11C \uC6D0\uC2EC\uC131 \uC2E0\uD638\uAC00 \uC591\uCABD \uB3D9\uACF5\uC73C\uB85C \uC804\uB2EC\uB418\uC5B4, \uBE5B\uC5D0 \uBC18\uC751\uD574 \uB3D9\uACF5\uC774 \uC218\uCD95\uD569\uB2C8\uB2E4.",
        },
        {
          id: "reflex-direct",
          offset: 16,
          end: 19.5,
          en: "The illuminated pupil has a direct response.",
          ko: "\uC774\uAC83\uC774 \uC9C1\uC811 \uB300\uAD11\uBC18\uC0AC\uC785\uB2C8\uB2E4.",
        },
        {
          id: "reflex-consensual",
          offset: 19.5,
          end: 24,
          en: "The other pupil has a consensual response.",
          ko: "\uBC18\uB300\uCABD \uB3D9\uACF5\uC740 \uAC04\uC811 \uB300\uAD11\uBC18\uC0AC\uB97C \uBCF4\uC785\uB2C8\uB2E4.",
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
          ko: "\uD55C\uCABD \uB208\uC5D0 \uBE5B\uC744 \uBE44\uCD9C \uB54C \uBC18\uB300\uCABD \uB3D9\uACF5\uB3C4 \uC218\uCD95\uD558\uB294 \uAC83\uC774 \uAC04\uC811 \uB300\uAD11\uBC18\uC0AC\uC785\uB2C8\uB2E4.",
        },
        {
          id: "consensual-other",
          offset: 8,
          end: 22,
          en: "Repeat from the other side, watching the pupil that is not being directly illuminated.",
          ko: "\uBC18\uB300\uCABD\uC5D0\uC11C\uB3C4 \uBC18\uBCF5\uD558\uBA70 \uBE5B\uC744 \uC9C1\uC811 \uBE44\uCD94\uC9C0 \uC54A\uC740 \uB208\uC758 \uB3D9\uACF5\uC744 \uAD00\uCC30\uD569\uB2C8\uB2E4.",
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
          ko: "\uBE5B\uC744 \uD55C\uCABD \uB208\uC5D0\uC11C \uBC18\uB300\uCABD \uB208\uC73C\uB85C \uC62E\uAE30\uBA70 \uB3D9\uACF5 \uBC18\uC751\uC744 \uBE44\uAD50\uD569\uB2C8\uB2E4.",
        },
        {
          id: "swing-return",
          offset: 10,
          end: 20,
          en: "Swing the light back and observe both pupils each time the illuminated eye changes.",
          ko: "\uBE5B\uC744 \uB2E4\uC2DC \uC62E\uAE30\uACE0, \uBE5B\uC744 \uBE44\uCD94\uB294 \uB208\uC774 \uBC14\uB014 \uB54C\uB9C8\uB2E4 \uC591\uCABD \uB3D9\uACF5\uC744 \uAD00\uCC30\uD569\uB2C8\uB2E4.",
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
          ko: "\uC815\uC0C1 \uC608\uC2DC\uC5D0\uC11C\uB294 \uBE5B\uC774 \uC774 \uB208\uC73C\uB85C \uB3CC\uC544\uC640\uB3C4 \uB3D9\uACF5\uC774 \uC218\uCD95\uB41C \uC0C1\uD0DC\uB97C \uC720\uC9C0\uD569\uB2C8\uB2E4.",
        },
        {
          id: "swing-rapd",
          offset: 10,
          end: 24,
          en: "A relative afferent pupillary defect, or RAPD, means a weaker light signal from one eye. Here, the pupils paradoxically dilate when light moves to the affected right eye.",
          caption: {
            en: `A relative afferent pupillary defect, or RAPD, means a weaker light signal from one\xA0eye.
Here, the pupils paradoxically dilate when light moves to the affected right eye.`,
          },
          ko: "\uC0C1\uB300\uAD6C\uC2EC\uB3D9\uACF5\uC6B4\uB3D9\uC7A5\uC560, \uC989 RAPD\uB294 \uD55C\uCABD \uB208\uC758 \uBE5B \uC2E0\uD638\uAC00 \uC57D\uD574\uC9C4 \uC0C1\uD0DC\uC785\uB2C8\uB2E4. \uBE5B\uC744 \uC774\uC0C1\uC774 \uC788\uB294 \uC624\uB978\uCABD \uB208\uC73C\uB85C \uC62E\uAE30\uBA74 \uB3D9\uACF5\uC774 \uC5ED\uC124\uC801\uC73C\uB85C \uCEE4\uC9D1\uB2C8\uB2E4.",
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
          end: 161.25 / 30,
          en: "First ask the patient to look at a distant target.",
          ko: "\uBA3C\uC800 \uD658\uC790\uAC00 \uBA40\uB9AC \uC788\uB294 \uBAA9\uD45C\uBB3C\uC744 \uBCF4\uAC8C \uD569\uB2C8\uB2E4.",
        },
        {
          id: "near-target",
          offset: 161.25 / 30,
          end: 21,
          en: "Then ask them to look at a near target, as shown here with the Arclight.",
          ko: "\uADF8\uB2E4\uC74C \uADF8\uB9BC\uC758 \uC544\uD06C\uB77C\uC774\uD2B8\uCC98\uB7FC \uAC00\uAE4C\uC774 \uC788\uB294 \uBAA9\uD45C\uBB3C\uC744 \uBCF4\uAC8C \uD569\uB2C8\uB2E4.",
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
          ko: "\uAC00\uAE4C\uC6B4 \uBAA9\uD45C\uBB3C\uC744 \uBCFC \uB54C \uB450 \uB208\uC774 \uD568\uAED8 \uC548\uCABD\uC73C\uB85C \uD5A5\uD558\uB294 \uBC18\uC751\uC744 \uB208\uBAA8\uC74C, \uB610\uB294 \uD3ED\uC8FC\uB77C\uACE0 \uD569\uB2C8\uB2E4.",
        },
        {
          id: "near-abnormal",
          offset: 10,
          end: 20,
          en: "If the eyes do not turn inward together for a near target, further examination is needed.",
          ko: "\uAC00\uAE4C\uC6B4 \uBAA9\uD45C\uBB3C\uC744 \uBCFC \uB54C \uB450 \uB208\uC774 \uD568\uAED8 \uC548\uCABD\uC73C\uB85C \uD5A5\uD558\uC9C0 \uC54A\uC73C\uBA74 \uCD94\uAC00 \uAC80\uC0AC\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.",
        },
      ],
    },
  ],
  a = [
    ...l.slice(0, 4),
    ...r.map((e, t) => ({ ...e, pecStageIndex: t })),
    ...l.slice(4),
  ],
  s = 1,
  y = { retina: 246, "optic nerve": 294, chiasm: 348, tract: 399, nuclei: 453 },
  A = {
    speed: 0.85,
    segments: [
      { from: 0, to: 2.03, at: 5.6 },
      { from: 2.03, to: 2.87, at: 8.06035 },
      { from: 2.87, to: 4.07, at: 9.61965 },
      { from: 4.07, to: 5.07, at: 11.3661 },
      { from: 5.07, to: 5.76, at: 13.1219 },
      { from: 5.76, to: 7.01, at: 14.62094 },
    ],
  },
  o = { 0: 562, 10: 390, 13: 341.25 },
  p = a.map((e, t) => {
    let n = { start: s, end: s + e.seconds, cueIds: e.cues.map((c) => c.id) };
    return (
      (s = n.end),
      t === 0 &&
        (n.endByLanguage = {
          en: n.start + 562 / 30 + 1.5,
          ko: n.start + 562 / 30 + 1.5,
        }),
      t === 9 &&
        (n.endByLanguage = { en: n.start + 17.76, ko: n.start + 19.32 }),
      t === 10 &&
        (n.endByLanguage = { en: n.start + 15.43, ko: n.start + 16.12 }),
      t === 13 &&
        (n.endByLanguage = {
          en: n.start + 341.25 / 30 + 1.5,
          ko: n.start + 341.25 / 30 + 1.5,
        }),
      n
    );
  }),
  S = {
    folder: "pupils-advanced",
    route: "videos",
    languages: Object.keys(d),
    stages: p.map((e, t) => [
      [e.start, 0],
      ...(o[t] == null ? [] : [[e.start + o[t] / 30, o[t]]]),
      [e.end, a[t].seconds * 30 - 1],
    ]),
  },
  k = {
    pageId: h,
    label: "Pupils",
    playMode: "stageAutoplay",
    enableReplay: !0,
    stageAspectRatioByFile: a.map((e, t) =>
      t === 3 ? "1169 / 1093" : "1169 / 1280",
    ),
    fitCaptionsInViewport: !0,
    centerPlaybackGroup: !0,
    topAlignedFirstStage: !0,
    strictFrameLockNoFallback: !0,
    strictFrameRemountOnBlank: !0,
    persistentSettleSnapshotOverlay: !0,
    lazyLoadStageAnimations: !0,
    lazyInitialStageCount: 1,
    skipRouteImageWarmup: !0,
    progressStoragePrefix: "lessonProgress:",
    paths: a.map((e, t) =>
      e.pecStageIndex == null
        ? "/scrolly/coreexam/pupils-advanced/" + (t + 1) + "/data.json"
        : i.paths[e.pecStageIndex],
    ),
    sections: f,
    segmentRanges: a.map((e) => [{ from: 0, to: e.seconds * 30 - 1 }]),
    completionHoldFrameByFile: a.map((e) => e.seconds * 30 - 1),
    segmentStartTexts: a.map((e) => e.cues.map((t) => t.caption?.en ?? t.en)),
    segmentTextModeByFile: a.map(() => "append"),
    narrationTracks: Object.fromEntries(
      Object.entries(d).map(([e, { label: t }]) => [
        e,
        {
          label: t,
          src: "/narration/pupils-advanced/full-animation/" + e + ".m4a",
        },
      ]),
    ),
    narrationClipsByFile: p,
  };
export {
  A as PUPILS_ADVANCED_AFFERENT_PACING,
  y as PUPILS_ADVANCED_AFFERENT_WORD_FRAMES,
  d as PUPILS_ADVANCED_LANGUAGES,
  k as PUPILS_ADVANCED_SCROLL_CONFIG,
  h as PUPILS_ADVANCED_SCROLL_PAGE,
  u as PUPILS_ADVANCED_SCROLL_ROUTE,
  S as PUPILS_ADVANCED_SCROLL_TIMING,
  f as PUPILS_ADVANCED_SECTIONS,
  a as PUPILS_ADVANCED_STAGES,
  g as PUPILS_ADVANCED_TITLE_TRANSLATIONS,
  o as PUPILS_ADVANCED_VISUAL_END_FRAMES,
};
