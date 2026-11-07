import { b as g } from "./chunk-KKOYVSFI.js";
var p = {
  en: {
    label: "English",
    src: "/narration/visual-acuity/full-animation/en.m4a",
  },
  "es-419": {
    label: "Espa\xF1ol (Latinoam\xE9rica)",
    src: "/narration/visual-acuity/full-animation/es-419.m4a",
  },
  ko: {
    label: "\uD55C\uAD6D\uC5B4",
    src: "/narration/visual-acuity/full-animation/ko.m4a",
  },
  fr: {
    label: "Fran\xE7ais",
    src: "/narration/visual-acuity/full-animation/fr.m4a",
  },
  ne: {
    label: "\u0928\u0947\u092A\u093E\u0932\u0940",
    src: "/narration/visual-acuity/full-animation/ne.m4a",
  },
  lg: {
    label: "Luganda",
    src: "/narration/visual-acuity/full-animation/lg.m4a",
  },
  ha: { label: "Hausa", src: "/narration/visual-acuity/full-animation/ha.m4a" },
  yo: {
    label: "Yor\xF9b\xE1",
    src: "/narration/visual-acuity/full-animation/yo.m4a",
  },
  ig: { label: "Igbo", src: "/narration/visual-acuity/full-animation/ig.m4a" },
};
var M = {
    pageId: "visualAcuityExaminationScrollPage",
    label: "Visual Acuity",
    fitCaptionsInViewport: !0,
    formatCaption: (e) =>
      e
        .replace(
          /([.!?])\s+(?=[A-Z])/g,
          `$1

`,
        )
        .replace(
          `Record the test distance as the top number of the Snellen fraction.

Here, it is three metres.`,
          "Record the test distance as the top number of the Snellen fraction. Here, it is three metres.",
        )
        .split(/\n{2,}/)
        .map((t) => t.trim().replace(/\s+(\S+)$/, "\xA0$1")).join(`

`),
    enableReplay: !0,
    segmentTextToggleOnTitle: !0,
    persistentSettleSnapshotOverlay: !0,
    playMode: "stageAutoplay",
    strictFrameLockNoFallback: !0,
    strictFrameRemountOnBlank: !0,
    lazyLoadStageAnimations: !0,
    lazyInitialStageCount: 1,
    skipRouteImageWarmup: !0,
    progressStoragePrefix: "lessonProgress:",
    paths: [
      "/scrolly/coreexam/visualacuity/01Preparation/1/data.json",
      "/scrolly/coreexam/visualacuity/01Preparation/2/data.json",
      "/scrolly/coreexam/visualacuity/01Preparation/3/data.json",
      "/scrolly/coreexam/visualacuity/01Preparation/4/data.json",
      "/scrolly/coreexam/visualacuity/02DistanceVision/1/data.json",
      "/scrolly/coreexam/visualacuity/02DistanceVision/2/data.json",
      "/scrolly/coreexam/visualacuity/02DistanceVision/3/data.json",
      "/scrolly/coreexam/visualacuity/03TestWithPinholeOrGlasses/1/data.json",
      "/scrolly/coreexam/visualacuity/03TestWithPinholeOrGlasses/2/data.json",
      "/scrolly/coreexam/visualacuity/03TestWithPinholeOrGlasses/3/data.json",
      "/scrolly/coreexam/visualacuity/04LowVisionCF-HM-LP/data.json",
      "/scrolly/coreexam/visualacuity/05NearVision/1/data.json",
      "/scrolly/coreexam/visualacuity/05NearVision/2/data.json",
      "/scrolly/coreexam/visualacuity/05NearVision/3/data.json",
      "/scrolly/coreexam/visualacuity/05NearVision/4/data.json",
    ],
    sections: [
      { startIndex: 0, title: "Preparation" },
      { startIndex: 4, title: "Distance Vision" },
      { startIndex: 7, title: "Test with Pinhole or glasses" },
      { startIndex: 10, title: "Low Vision CF-HM-LP" },
      { startIndex: 11, title: "Near Vision" },
    ],
    segmentRanges: [
      [{ from: 0, to: 89 }],
      [{ from: 0, to: 179 }],
      [{ from: 0, to: 129 }],
      [{ from: 0, to: 199 }],
      [{ from: 0, to: 119 }],
      [{ from: 0, to: 209 }],
      [{ from: 0, to: 1259 }],
      [{ from: 0, to: 129 }],
      [{ from: 0, to: 179 }],
      [{ from: 0, to: 219 }],
      [{ from: 0, to: 1139 }],
      [{ from: 0, to: 179 }],
      [{ from: 0, to: 449 }],
      [{ from: 0, to: 449 }],
      [{ from: 0, to: 449 }],
    ],
    completionHoldFrameByFile: [
      89, 179, 129, 199, 119, 209, 1259, 129, 179, 219, 1139, 179, 449, 449,
      449,
    ],
    segmentStartTexts: [
      [
        "Prepare the charts, measuring tape, pen and a safety pin to make pinholes.",
      ],
      [
        "Practise the tumbling E optotype before the actual test. Ask the patient to point in the direction of the E.",
      ],
      [
        "Light should fall onto the chart. Make sure the light is not coming from behind the chart.",
      ],
      [
        "Make sure the distance from the patient\u2019s eyes to the chart is three metres.",
      ],
      ["Cover one eye with the palm, not the fingers."],
      ["Start with the largest letters and work down the chart."],
      [
        "Record the test distance as the top number of the Snellen fraction. Here, it is three metres.",
        "Ask the patient to show the direction of each E. For the left eye, use the letters on the left of the chart, from largest to smallest. For the right eye, use the letters on the right, from largest to smallest.",
        "Continue until the patient can no longer correctly identify the letters, or has completed the chart.",
        "Record the last complete line seen correctly. In this example, the acuity is three over nineteen.",
      ],
      [
        "If vision is reduced to less than three over three, repeat the test with a pinhole or glasses.",
      ],
      [
        "You can make a set of pinholes by pushing a pin through the near card where the black dots are.",
      ],
      [
        "If vision improves with pinholes or glasses, it means they need glasses.",
      ],
      [
        "If the largest E cannot be seen at three metres, try one and a half metres. If still unseen, test counting fingers.",
        "Ask how many fingers are held up. Record counting fingers and the distance at which they are seen.",
        "If fingers cannot be counted, move your hand and ask whether movement is visible. Record hand movements and the distance.",
        "If movement cannot be seen, test light perception. Record whether the patient can see the light, or has no light perception.",
      ],
      [
        "For near vision, hold the reading chart forty centimetres away, with both eyes open.",
      ],
      [
        "Ask them to read aloud, starting with the largest print.",
        "Record the smallest line read comfortably and the test distance.",
      ],
      [
        "If reading is difficult, ask them to identify letters or match their shapes.",
        "They can point in the direction of the E, as in distance acuity testing, or copy its shape in the air with a finger.",
      ],
      [
        "If near vision is worse than N12, repeat with reading glasses of different powers.",
        "If the vision improves, it means they need glasses",
      ],
    ],
    narrationTracks: p,
    narrationClipsByFile: [
      { start: 3, end: 9.1, cueIds: ["va-01"] },
      { start: 9.1, end: 18.6, cueIds: ["va-02"] },
      { start: 21.6, end: 29.866667, cueIds: ["va-03"] },
      { start: 29.866667, end: 38.366667, cueIds: ["va-04"] },
      { start: 40.866667, end: 45.866667, cueIds: ["va-05"] },
      { start: 45.866667, end: 52.866667, cueIds: ["va-06"] },
      {
        start: 52.866667,
        end: 97.1,
        cueIds: ["va-07", "va-08", "va-09", "va-10"],
      },
      { start: 100.6, end: 107.333333, cueIds: ["va-11"] },
      { start: 107.333333, end: 113.4, cueIds: ["va-12"] },
      { start: 113.4, end: 119.033333, cueIds: ["va-13"] },
      {
        start: 124.533333,
        end: 164.9,
        cueIds: ["va-14", "va-15", "va-16", "va-17"],
      },
      { start: 170.4, end: 177.4, cueIds: ["va-18"] },
      { start: 177.4, end: 190.4, cueIds: ["va-19", "va-20"] },
      { start: 192.4, end: 206.4, cueIds: ["va-21", "va-22"] },
      { start: 207.4, end: 222.4, cueIds: ["va-23", "va-24"] },
    ],
  },
  S = {
    folder: "visual-acuity",
    languages: Object.keys(p),
    stages: [
      [
        [3, 0],
        [4.4, 83],
        [9, 83],
        [9.1, 89],
      ],
      [
        [9.1, 0],
        [13, 101],
        [18.6, 101],
        [21.6, 179],
      ],
      [
        [21.6, 0],
        [25.133333, 127],
        [29.8, 127],
        [29.866667, 129],
      ],
      [
        [29.866667, 0],
        [38.366667, 199],
      ],
      [
        [40.866667, 0],
        [45.866667, 119],
      ],
      [
        [45.866667, 0],
        [52.866667, 209],
      ],
      [
        [52.866667, 0],
        [73.266667, 619],
        [76, 619],
        [97.1, 1259],
      ],
      [
        [100.6, 0],
        [105.533333, 127],
        [107.266666, 127],
        [107.333333, 129],
      ],
      [
        [107.333333, 0],
        [113.266666, 177],
        [113.333333, 177],
        [113.4, 179],
      ],
      [
        [113.4, 0],
        [118.8, 215],
        [118.933333, 215],
        [119.033333, 219],
      ],
      [
        [124.533333, 0],
        [129.933333, 151],
        [133.8, 151],
        [164.9, 1139],
      ],
      [
        [170.4, 0],
        [177.4, 179],
      ],
      [
        [177.4, 0],
        [190.4, 449],
      ],
      [
        [192.4, 0],
        [206.4, 449],
      ],
      [
        [207.4, 0],
        [222.4, 449],
      ],
    ],
  };
var L = "makeEyePadShieldScrollPage",
  H = "makeEyePadShieldScroll",
  I = {
    en: "English",
    "es-419": "Espa\xF1ol (Latinoam\xE9rica)",
    ko: "\uD55C\uAD6D\uC5B4",
    ne: "\u0928\u0947\u092A\u093E\u0932\u0940",
    fr: "Fran\xE7ais",
    lg: "Luganda",
    ha: "Hausa",
    yo: "Yor\xF9b\xE1",
    ig: "Igbo",
  },
  C = [
    { startIndex: 0, title: "Preparation" },
    { startIndex: 1, title: "Make an eye pad" },
    { startIndex: 4, title: "Make an eye shield" },
  ];
var c = [
    {
      name: "Equipment",
      seconds: 10,
      scenes: [1],
      cues: [
        {
          id: "equipment",
          offset: 0,
          end: 10,
          en: "You will need gauze, cotton wool, cardboard, pencil, cup, sticky paper and scissors.",
        },
      ],
    },
    {
      name: "Spread the cotton wool",
      seconds: 13,
      scenes: [2],
      cues: [
        {
          id: "cotton",
          offset: 0,
          end: 13,
          en: "For the eye pad, spread a cotton wool ball into an oval shape about 5 to 6 centimetres wide.",
        },
      ],
    },
    {
      name: "Fold and tape the gauze",
      seconds: 16,
      scenes: [3],
      cues: [
        {
          id: "gauze",
          offset: 0,
          end: 9,
          en: "Fold the gauze around the cotton wool.",
        },
        { id: "pad-tape", offset: 9, end: 16, en: "Tape at the open end." },
      ],
    },
    {
      name: "Trim the eye pad",
      seconds: 13,
      scenes: [4],
      cues: [
        {
          id: "trim",
          offset: 0,
          end: 10,
          en: "Trim the edges of the gauze to the shape of the cotton wool.",
        },
        {
          id: "finished-pad",
          offset: 10.5,
          end: 13,
          en: "This is your eye pad.",
        },
      ],
    },
    {
      name: "Choose clean cardboard",
      seconds: 11,
      scenes: [5],
      cues: [
        {
          id: "cardboard",
          offset: 0,
          end: 11,
          en: "For the shield, find some clean cardboard. Reusing medical packaging works well.",
        },
      ],
    },
    {
      name: "Draw the circle",
      seconds: 14,
      scenes: [6, 7],
      cues: [
        {
          id: "draw",
          offset: 0,
          end: 14,
          en: "Using a cup as a template, draw a circle with a diameter of about 8 centimetres.",
        },
      ],
    },
    {
      name: "Cut the circle and slit",
      seconds: 20,
      scenes: [8, 9],
      cues: [
        { id: "cut", offset: 0, end: 13, en: "Cut out the circle." },
        {
          id: "slit",
          offset: 13,
          end: 20,
          en: "Then make a cut from the edge to the centre.",
        },
      ],
    },
    {
      name: "Shape and secure the shield",
      seconds: 21,
      scenes: [10, 11, 12],
      cues: [
        {
          id: "cone",
          offset: 0,
          end: 11,
          en: "Curve the card into a cone and secure with sticky tape.",
        },
        {
          id: "finished-shield",
          offset: 11,
          end: 21,
          en: "This is your eye shield.",
        },
      ],
    },
  ],
  h = [0, 350, 395, 276, 0, 385, 510, 435],
  w = {
    en: [8.39, 17.91, 34.99, 52.47, 59.48, 70.07, 94.19, 111.14],
    "es-419": [8.68, 19.14, 36.17, 52.97, 59.67, 70.17, 94.82, 111.88],
    ko: [8.61, 18.7, 36.72, 53, 60.94, 69.18, 95.56, 112.31],
    ne: [6.18, 19.11, 35.98, 52.9, 60.08, 69.64, 94.98, 112],
    fr: [8.8, 18.34, 37.1, 53, 60.13, 69.93, 94.36, 112.43],
    lg: [6.3, 21.94, 36.6, 52.63, 59.61, 72.21, 96.28, 111.3],
    ha: [7.45, 21.18, 36.22, 52.44, 60.26, 71.62, 95.27, 111.51],
    yo: [5.1, 16.82, 34.79, 51.99, 57.8, 68.91, 93.67, 110.41],
    ig: [7.02, 20.14, 35.78, 51.7, 59.76, 72.1, 95.96, 111.8],
  },
  m = 1,
  A = c.map((e, t) => {
    let a = { start: m, end: m + e.seconds, cueIds: e.cues.map((n) => n.id) };
    return (
      (a.endByLanguage = Object.fromEntries(
        Object.entries(w).map(([n, l]) => [
          n,
          Math.min(a.end, Math.max(a.start + h[t] / 30 + 0.001, l[t] + 0.12)),
        ]),
      )),
      (m = a.end),
      a
    );
  }),
  _ = {
    folder: "make-eye-pad-shield",
    route: "eyePadShield",
    languages: Object.keys(I),
    stages: A.map((e, t) => [
      [e.start, 0],
      [e.start + h[t] / 30, h[t]],
      [e.start + h[t] / 30 + 0.001, c[t].seconds * 30 - 1],
      [e.end, c[t].seconds * 30 - 1],
    ]),
  },
  j = {
    pageId: L,
    label: "Make an eye pad and eye shield",
    playMode: "stageAutoplay",
    enableReplay: !0,
    segmentTextToggleOnTitle: !0,
    fitCaptionsInViewport: !0,
    narrationCompletionPauseSeconds: 1.5,
    strictFrameLockNoFallback: !0,
    strictFrameRemountOnBlank: !0,
    persistentSettleSnapshotOverlay: !0,
    lazyLoadStageAnimations: !0,
    lazyInitialStageCount: 1,
    skipRouteImageWarmup: !0,
    progressStoragePrefix: "lessonProgress:",
    paths: c.map(
      (e, t) => `/scrolly/eyeprocedures/make-eye-pad-shield/${t + 2}/data.json`,
    ),
    sections: C,
    segmentRanges: c.map((e) => [{ from: 0, to: e.seconds * 30 - 1 }]),
    completionHoldFrameByFile: c.map((e) => e.seconds * 30 - 1),
    segmentStartTexts: c.map((e) => e.cues.map((t) => t.en)),
    segmentTextModeByFile: c.map(() => "append"),
    narrationTracks: Object.fromEntries(
      Object.entries(I).map(([e, t]) => [
        e,
        {
          label: t,
          src: `/narration/make-eye-pad-shield/full-animation/${e}.m4a`,
        },
      ]),
    ),
    narrationClipsByFile: A,
  };
var O = "applyEyePadShieldScrollPage",
  V = "applyEyePadShieldScroll",
  u = [
    {
      name: "Equipment",
      seconds: 12,
      en: "Prepare an eye pad, an eye shield, adhesive tape and scissors.",
      ko: "\uC548\uB300 \uD328\uB4DC, \uB208 \uBCF4\uD638\uB300, \uBC18\uCC3D\uACE0\uC640 \uAC00\uC704\uB97C \uC900\uBE44\uD569\uB2C8\uB2E4.",
    },
    {
      name: "Explain the procedure",
      seconds: 12,
      en: "Explain the procedure to the patient and help them sit comfortably.",
      ko: "\uD658\uC790\uC5D0\uAC8C \uC808\uCC28\uB97C \uC124\uBA85\uD558\uACE0 \uD3B8\uC548\uD558\uAC8C \uC549\uB3C4\uB85D \uB3D5\uC2B5\uB2C8\uB2E4.",
    },
    {
      name: "Prepare the skin",
      seconds: 14,
      en: "Gently clean the skin around the eye, then dry it so the tape will stick.",
      ko: "\uB208 \uC8FC\uC704 \uD53C\uBD80\uB97C \uBD80\uB4DC\uB7FD\uAC8C \uB2E6\uACE0 \uBC18\uCC3D\uACE0\uAC00 \uC798 \uBD99\uB3C4\uB85D \uB9D0\uB9BD\uB2C8\uB2E4.",
    },
    {
      name: "Prepare the tape",
      seconds: 12,
      en: "Measure and cut strips of adhesive tape before applying the pad.",
      ko: "\uD328\uB4DC\uB97C \uBD99\uC774\uAE30 \uC804\uC5D0 \uBC18\uCC3D\uACE0\uC758 \uAE38\uC774\uB97C \uC7AC\uACE0 \uC798\uB77C \uC900\uBE44\uD569\uB2C8\uB2E4.",
    },
    {
      name: "Prepare the pad",
      seconds: 12,
      en: "Prepare the eye pad and attach the strips of tape, as shown.",
      ko: "\uADF8\uB9BC\uACFC \uAC19\uC774 \uC548\uB300 \uD328\uB4DC\uC5D0 \uBC18\uCC3D\uACE0\uB97C \uBD99\uC5EC \uC900\uBE44\uD569\uB2C8\uB2E4.",
    },
    {
      name: "Close the eye",
      seconds: 12,
      en: "Ask the patient to gently close the eye. Place the pad over the closed eyelid.",
      ko: "\uD658\uC790\uC5D0\uAC8C \uB208\uC744 \uBD80\uB4DC\uB7FD\uAC8C \uAC10\uB3C4\uB85D \uD55C \uB4A4 \uAC10\uAE34 \uB208\uAEBC\uD480 \uC704\uC5D0 \uD328\uB4DC\uB97C \uB193\uC2B5\uB2C8\uB2E4.",
    },
    {
      name: "Secure the pad",
      seconds: 14,
      en: "Secure the tape diagonally from the forehead to the cheek. Keep the other eye uncovered.",
      ko: "\uC774\uB9C8\uC5D0\uC11C \uBCFC \uBC29\uD5A5\uC73C\uB85C \uBC18\uCC3D\uACE0\uB97C \uBE44\uC2A4\uB4EC\uD788 \uBD99\uC5EC \uD328\uB4DC\uB97C \uACE0\uC815\uD569\uB2C8\uB2E4. \uBC18\uB300\uCABD \uB208\uC740 \uAC00\uB9AC\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
    },
    {
      name: "Apply the shield",
      seconds: 14,
      en: "Place the eye shield over the pad and secure it with tape, as demonstrated in the video.",
      ko: "\uC601\uC0C1\uC5D0\uC11C \uBCF4\uC5EC \uC8FC\uB294 \uAC83\uCC98\uB7FC \uD328\uB4DC \uC704\uC5D0 \uB208 \uBCF4\uD638\uB300\uB97C \uB193\uACE0 \uBC18\uCC3D\uACE0\uB85C \uACE0\uC815\uD569\uB2C8\uB2E4.",
    },
  ],
  f = 1,
  k = u.map((e, t) => {
    let a = { start: f, end: f + e.seconds, cueIds: [`apply-${t + 1}`] };
    return ((f = a.end), a);
  }),
  v = {
    folder: "apply-eye-pad-shield",
    route: "eyePadShield",
    languages: ["en", "ko"],
    stages: k.map((e, t) => [
      [e.start, 0],
      [e.end, u[t].seconds * 30 - 1],
    ]),
  },
  B = {
    pageId: O,
    label: "Apply an Eye Pad and Eye Shield",
    playMode: "stageAutoplay",
    enableReplay: !0,
    segmentTextToggleOnTitle: !0,
    fitCaptionsInViewport: !0,
    narrationCompletionPauseSeconds: 1.5,
    strictFrameLockNoFallback: !0,
    strictFrameRemountOnBlank: !0,
    persistentSettleSnapshotOverlay: !0,
    lazyLoadStageAnimations: !0,
    lazyInitialStageCount: 1,
    skipRouteImageWarmup: !0,
    progressStoragePrefix: "lessonProgress:",
    paths: u.map(
      (e, t) =>
        `/scrolly/eyeprocedures/apply-eye-pad-shield/${t + 1}/data.json`,
    ),
    sections: [
      { startIndex: 0, title: "Preparation" },
      { startIndex: 4, title: "Apply the eye pad" },
      { startIndex: 7, title: "Apply the eye shield" },
    ],
    segmentRanges: u.map((e) => [{ from: 0, to: e.seconds * 30 - 1 }]),
    completionHoldFrameByFile: u.map((e) => e.seconds * 30 - 1),
    segmentStartTexts: u.map((e) => [e.en]),
    segmentTextModeByFile: u.map(() => "append"),
    narrationTracks: Object.fromEntries(
      [
        ["en", "English"],
        ["ko", "\uD55C\uAD6D\uC5B4"],
      ].map(([e, t]) => [
        e,
        {
          label: t,
          src: `/narration/apply-eye-pad-shield/full-animation/${e}.m4a`,
        },
      ]),
    ),
    narrationClipsByFile: k,
  };
var R = "cataractScrollPage";
var E = {
    en: { label: "English", voice: "en-GB-SoniaNeural" },
    ko: { label: "\uD55C\uAD6D\uC5B4", voice: "ko-KR-SunHiNeural" },
  },
  F = [
    { startIndex: 0, title: "history taking" },
    { startIndex: 3, title: "visual acuity" },
    { startIndex: 6, title: "front of eye" },
    { startIndex: 9, title: "pupils" },
    { startIndex: 12, title: "fundal reflex" },
    { startIndex: 15, title: "fundoscopy" },
  ];
var d = [
    {
      art: "history-method",
      seconds: 18,
      cues: [
        {
          id: "history-onset",
          offset: 0,
          end: 9,
          en: "Ask when the vision changed and whether it has worsened gradually or suddenly.",
          ko: "\uC2DC\uB825\uC774 \uC5B8\uC81C\uBD80\uD130 \uBCC0\uD588\uB294\uC9C0, \uC11C\uC11C\uD788 \uB098\uBE60\uC84C\uB294\uC9C0 \uAC11\uC790\uAE30 \uB098\uBE60\uC84C\uB294\uC9C0 \uBB3B\uC2B5\uB2C8\uB2E4.",
        },
        {
          id: "history-symptoms",
          offset: 9,
          end: 18,
          en: "Ask about pain, redness, one or both eyes, and difficulty with everyday activities.",
          ko: "\uD1B5\uC99D\uACFC \uCDA9\uD608, \uD55C\uCABD \uB208\uC778\uC9C0 \uC591\uCABD \uB208\uC778\uC9C0, \uC77C\uC0C1\uC0DD\uD65C\uC5D0\uC11C \uACAA\uB294 \uBD88\uD3B8\uC744 \uD655\uC778\uD569\uB2C8\uB2E4.",
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
          ko: "\uBC31\uB0B4\uC7A5\uC740 \uB300\uAC1C \uD1B5\uC99D \uC5C6\uC774 \uC11C\uC11C\uD788 \uC2DC\uC57C\uAC00 \uD750\uB824\uC9C0\uB294 \uC99D\uC0C1\uC744 \uC77C\uC73C\uD0B5\uB2C8\uB2E4.",
        },
        {
          id: "history-both",
          offset: 9,
          end: 18,
          en: "It may affect both eyes, but the symptoms can be different in each eye.",
          ko: "\uC591\uCABD \uB208\uC5D0 \uC0DD\uAE38 \uC218 \uC788\uC9C0\uB9CC \uB208\uB9C8\uB2E4 \uC99D\uC0C1\uC740 \uB2E4\uB97C \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
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
          en: "Sudden loss of vision is not the usual cataract history and needs urgent assessment.",
          ko: "\uAC11\uC791\uC2A4\uB7EC\uC6B4 \uC2DC\uB825 \uC18C\uC2E4\uC740 \uC77C\uBC18\uC801\uC778 \uBC31\uB0B4\uC7A5 \uACBD\uACFC\uAC00 \uC544\uB2C8\uBA70 \uAE34\uAE09\uD55C \uD3C9\uAC00\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.",
        },
        {
          id: "history-pain",
          offset: 9,
          end: 18,
          en: "Pain or a red eye also suggests another cause. Arrange referral rather than assuming cataract.",
          ko: "\uD1B5\uC99D\uC774\uB098 \uCDA9\uD608\uB3C4 \uB2E4\uB978 \uC6D0\uC778\uC744 \uC2DC\uC0AC\uD569\uB2C8\uB2E4. \uBC31\uB0B4\uC7A5\uC73C\uB85C \uB2E8\uC815\uD558\uC9C0 \uB9D0\uACE0 \uC758\uB8B0\uD569\uB2C8\uB2E4.",
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
          ko: "\uD3C9\uC18C \uC6D0\uAC70\uB9AC \uC548\uACBD\uC744 \uCC29\uC6A9\uD55C \uC0C1\uD0DC\uC5D0\uC11C \uD55C\uCABD \uB208\uC529 \uAC00\uB9AC\uACE0 \uC6D0\uAC70\uB9AC \uC2DC\uB825\uC744 \uCE21\uC815\uD569\uB2C8\uB2E4.",
        },
        {
          id: "acuity-near",
          offset: 10,
          end: 20,
          en: "Check near vision and repeat reduced distance vision with a pinhole.",
          ko: "\uADFC\uAC70\uB9AC \uC2DC\uB825\uC744 \uD655\uC778\uD558\uACE0, \uC6D0\uAC70\uB9AC \uC2DC\uB825\uC774 \uB0AE\uC73C\uBA74 \uD540\uD640\uC744 \uD1B5\uD574 \uB2E4\uC2DC \uCE21\uC815\uD569\uB2C8\uB2E4.",
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
          ko: "\uC544\uB798 \uD654\uC0B4\uD45C\uCC98\uB7FC \uBC31\uB0B4\uC7A5\uC740 \uC6D0\uAC70\uB9AC\uC640 \uADFC\uAC70\uB9AC \uC2DC\uB825\uC744 \uBAA8\uB450 \uB0AE\uCD9C \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
        },
        {
          id: "acuity-pinhole",
          offset: 10,
          end: 20,
          en: "Vision may remain reduced through a pinhole. This supports further examination, but does not diagnose cataract by itself.",
          ko: "\uD540\uD640\uC744 \uC0AC\uC6A9\uD574\uB3C4 \uC2DC\uB825\uC774 \uB0AE\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uCD94\uAC00 \uAC80\uC0AC\uAC00 \uD544\uC694\uD558\uC9C0\uB9CC, \uC774\uAC83\uB9CC\uC73C\uB85C \uBC31\uB0B4\uC7A5\uC744 \uC9C4\uB2E8\uD558\uC9C0\uB294 \uC54A\uC2B5\uB2C8\uB2E4.",
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
          ko: "\uD540\uD640\uC744 \uD1B5\uD574 \uC2DC\uB825\uC774 \uC88B\uC544\uC9C0\uBA74 \uAD74\uC808\uC774\uC0C1\uC774 \uC2DC\uB825 \uC800\uD558\uC758 \uC6D0\uC778\uC77C \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
        },
        {
          id: "acuity-refraction",
          offset: 9,
          end: 18,
          en: "Arrange refraction and assess the remaining findings. Cataract and refractive error can occur together.",
          ko: "\uAD74\uC808\uAC80\uC0AC\uB97C \uC548\uB0B4\uD558\uACE0 \uB098\uBA38\uC9C0 \uC18C\uACAC\uB3C4 \uD3C9\uAC00\uD569\uB2C8\uB2E4. \uBC31\uB0B4\uC7A5\uACFC \uAD74\uC808\uC774\uC0C1\uC740 \uD568\uAED8 \uC788\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
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
          ko: "\uC544\uD06C\uB77C\uC774\uD2B8\uC758 \uAC80\uC0AC \uC870\uBA85\uC744 \uC0AC\uC6A9\uD574 \uC591\uCABD \uB208\uC758 \uC55E\uBD80\uBD84\uC744 \uC0B4\uD3B4\uBD05\uB2C8\uB2E4.",
        },
        {
          id: "front-compare",
          offset: 8,
          end: 16,
          en: "Compare the eyes and look for redness, corneal clouding and other visible abnormalities.",
          ko: "\uC591\uCABD \uB208\uC744 \uBE44\uAD50\uD558\uBA70 \uCDA9\uD608, \uAC01\uB9C9 \uD63C\uD0C1\uACFC \uADF8 \uBC16\uC758 \uB208\uC5D0 \uBCF4\uC774\uB294 \uC774\uC0C1\uC744 \uD655\uC778\uD569\uB2C8\uB2E4.",
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
          ko: "\uB208 \uC55E\uBD80\uBD84\uC740 \uCDA9\uD608\uC774\uB098 \uB69C\uB837\uD55C \uD45C\uBA74 \uC774\uC0C1 \uC5C6\uC774 \uC815\uC0C1\uCC98\uB7FC \uBCF4\uC77C \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
        },
        {
          id: "front-not-excluded",
          offset: 8,
          end: 16,
          en: "A normal-looking front of eye does not exclude a cataract behind the pupil.",
          ko: "\uB208 \uC55E\uBD80\uBD84\uC774 \uC815\uC0C1\uCC98\uB7FC \uBCF4\uC5EC\uB3C4 \uB3D9\uACF5 \uB4A4 \uC218\uC815\uCCB4\uC758 \uBC31\uB0B4\uC7A5\uC744 \uBC30\uC81C\uD560 \uC218\uB294 \uC5C6\uC2B5\uB2C8\uB2E4.",
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
          ko: "\uB208\uC5D0 \uBCF4\uC774\uB294 \uD63C\uD0C1\uC774\uB098 \uB2E4\uB978 \uBE44\uC815\uC0C1 \uC18C\uACAC\uC774 \uC788\uC73C\uBA74 \uCD94\uAC00 \uC548\uACFC \uD3C9\uAC00\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.",
        },
        {
          id: "front-red",
          offset: 9,
          end: 18,
          en: "A red or painful eye is not explained by an uncomplicated cataract. Assess and refer appropriately.",
          ko: "\uB2E8\uC21C \uBC31\uB0B4\uC7A5\uC73C\uB85C \uCDA9\uD608\uC774\uB098 \uD1B5\uC99D\uC744 \uC124\uBA85\uD574\uC11C\uB294 \uC548 \uB429\uB2C8\uB2E4. \uC0C1\uD0DC\uB97C \uD3C9\uAC00\uD558\uACE0 \uC801\uC808\uD788 \uC758\uB8B0\uD569\uB2C8\uB2E4.",
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
          ko: "\uD55C\uCABD \uB208\uC529 \uBC88\uAC08\uC544 \uBE5B\uC744 \uBE44\uCD94\uBA70 \uC9C1\uC811 \uB300\uAD11\uBC18\uC0AC\uC640 \uAC04\uC811 \uB300\uAD11\uBC18\uC0AC\uB97C \uAD00\uCC30\uD569\uB2C8\uB2E4.",
        },
        {
          id: "pupil-swing",
          offset: 9,
          end: 18,
          en: "Compare the responses as the light moves between the eyes.",
          ko: "\uBE5B\uC744 \uC591\uCABD \uB208 \uC0AC\uC774\uB85C \uC62E\uAE30\uBA74\uC11C \uB3D9\uACF5 \uBC18\uC751\uC744 \uBE44\uAD50\uD569\uB2C8\uB2E4.",
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
          ko: "\uADF8\uB9BC\uC758 \uC815\uC0C1 \uBC18\uC751\uC5D0\uC11C\uB294 \uB208\uC5D0 \uBE5B\uC744 \uBE44\uCD94\uBA74 \uB3D9\uACF5\uC774 \uC791\uC544\uC9D1\uB2C8\uB2E4.",
        },
        {
          id: "pupil-cataract",
          offset: 8,
          end: 16,
          en: "Normal pupil reactions can be present in a patient with cataract.",
          ko: "\uBC31\uB0B4\uC7A5\uC774 \uC788\uB294 \uD658\uC790\uC5D0\uC11C\uB3C4 \uC815\uC0C1 \uB3D9\uACF5 \uBC18\uC751\uC744 \uBCF4\uC77C \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
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
          ko: "\uB3D9\uACF5 \uBC18\uC751\uC774 \uC57D\uD558\uAC70\uB098 \uC5C6\uAC70\uB098 \uC591\uCABD\uC774 \uB2E4\uB974\uBA74 \uCD94\uAC00 \uD3C9\uAC00\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.",
        },
        {
          id: "pupil-rapd",
          offset: 9,
          end: 18,
          en: "An afferent pupil defect suggests disease beyond a simple cataract. Arrange referral.",
          ko: "\uAD6C\uC2EC\uC131 \uB3D9\uACF5\uC6B4\uB3D9\uC7A5\uC560\uB294 \uB2E8\uC21C \uBC31\uB0B4\uC7A5 \uC774\uC678\uC758 \uC9C8\uD658\uC744 \uC2DC\uC0AC\uD558\uBBC0\uB85C \uC758\uB8B0\uD569\uB2C8\uB2E4.",
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
          ko: "\uC5B4\uB450\uC6B4 \uBC29\uC5D0\uC11C \uAC70\uB9AC\uB97C \uB450\uACE0 \uC544\uD06C\uB77C\uC774\uD2B8\uB97C \uD1B5\uD574 \uC591\uCABD \uC548\uC800\uBC18\uC0AC\uB97C \uBE44\uAD50\uD569\uB2C8\uB2E4.",
        },
        {
          id: "reflex-observe",
          offset: 9,
          end: 18,
          en: "Look for the brightness, colour and any shadows within each pupil.",
          ko: "\uB3D9\uACF5 \uC548\uC758 \uBC18\uC0AC \uBC1D\uAE30\uC640 \uC0C9, \uADF8\uB9BC\uC790\uAC00 \uC788\uB294\uC9C0 \uAD00\uCC30\uD569\uB2C8\uB2E4.",
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
          ko: "\uCD08\uB85D \uC5F4\uC758 \uC774 \uC608\uC2DC\uB294 \uC608\uC678\uC785\uB2C8\uB2E4. \uC815\uC0C1 \uC18C\uACAC\uC774 \uC544\uB2C8\uB77C \uBC31\uB0B4\uC7A5\uC5D0 \uBD80\uD569\uD558\uB294 \uC218\uC815\uCCB4 \uD63C\uD0C1\uACFC \uAC80\uC740 \uADF8\uB9BC\uC790\uB97C \uBCF4\uC5EC \uC90D\uB2C8\uB2E4.",
        },
        {
          id: "reflex-patterns",
          offset: 11,
          end: 22,
          en: "The appearance varies with the position and density of the opacity. Assess it together with the history and vision.",
          ko: "\uD63C\uD0C1\uC758 \uC704\uCE58\uC640 \uC815\uB3C4\uC5D0 \uB530\uB77C \uBAA8\uC2B5\uC774 \uB2EC\uB77C\uC9D1\uB2C8\uB2E4. \uBCD1\uB825 \uBC0F \uC2DC\uB825\uACFC \uD568\uAED8 \uD3C9\uAC00\uD569\uB2C8\uB2E4.",
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
          ko: "\uD770\uC0C9\uC774\uAC70\uB098 \uC720\uB09C\uD788 \uCC3D\uBC31\uD558\uAC70\uB098 \uC5C6\uAC70\uB098 \uBE44\uB300\uCE6D\uC778 \uBC18\uC0AC\uB97C \uBC31\uB0B4\uC7A5\uC73C\uB85C \uB2E8\uC815\uD574\uC11C\uB294 \uC548 \uB429\uB2C8\uB2E4.",
        },
        {
          id: "reflex-referral",
          offset: 10,
          end: 20,
          en: "Other eye disease may cause an abnormal reflex. Arrange eye assessment; a white pupil in a child needs urgent referral.",
          ko: "\uB2E4\uB978 \uC548\uC9C8\uD658\uB3C4 \uBC18\uC0AC \uC774\uC0C1\uC744 \uC77C\uC73C\uD0AC \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uC548\uACFC \uD3C9\uAC00\uB97C \uC758\uB8B0\uD558\uBA70, \uC18C\uC544\uC758 \uD770 \uB3D9\uACF5\uC740 \uAE34\uAE09 \uC758\uB8B0\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.",
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
          ko: "\uC544\uD06C\uB77C\uC774\uD2B8\uB97C \uB3D9\uACF5\uC5D0 \uB9DE\uCD98 \uC0C1\uD0DC\uC5D0\uC11C \uAC00\uAE4C\uC774 \uB2E4\uAC00\uAC00 \uC548\uC800\uB97C \uAC80\uC0AC\uD569\uB2C8\uB2E4.",
        },
        {
          id: "fundus-view",
          offset: 9,
          end: 18,
          en: "Assess the view through the lens and inspect the optic disc and retina when visible.",
          ko: "\uC218\uC815\uCCB4\uB97C \uD1B5\uD55C \uC2DC\uC57C\uB97C \uD3C9\uAC00\uD558\uACE0, \uBCF4\uC774\uB294 \uACBD\uC6B0 \uC2DC\uC2E0\uACBD\uC720\uB450\uC640 \uB9DD\uB9C9\uC744 \uC0B4\uD3B4\uBD05\uB2C8\uB2E4.",
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
          ko: "\uC218\uC815\uCCB4 \uD63C\uD0C1\uC73C\uB85C \uC548\uC800\uAC00 \uD750\uB9AC\uAC8C \uBCF4\uC774\uAC70\uB098 \uC120\uBA85\uD558\uAC8C \uAD00\uCC30\uB418\uC9C0 \uC54A\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
        },
        {
          id: "fundus-limits",
          offset: 9,
          end: 18,
          en: "An obscured fundus does not prove that the retina is healthy. Consider specialist assessment.",
          ko: "\uC548\uC800\uAC00 \uAC00\uB824\uC838 \uBCF4\uC774\uC9C0 \uC54A\uB294\uB2E4\uACE0 \uB9DD\uB9C9\uC774 \uC815\uC0C1\uC774\uB77C\uB294 \uB73B\uC740 \uC544\uB2D9\uB2C8\uB2E4. \uC804\uBB38 \uD3C9\uAC00\uB97C \uACE0\uB824\uD569\uB2C8\uB2E4.",
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
          ko: "\uC2DC\uC2E0\uACBD\uC720\uB450\uB098 \uB9DD\uB9C9\uC758 \uC774\uC0C1\uC740 \uC2DC\uB825 \uC800\uD558\uC758 \uC6D0\uC778\uC77C \uC218 \uC788\uC73C\uBA70 \uC758\uB8B0\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.",
        },
        {
          id: "fundus-combine",
          offset: 10,
          end: 20,
          en: "Combine all six parts of the examination. Cataract can coexist with other disease, so refer according to the complete findings.",
          ko: "\uC5EC\uC12F \uB2E8\uACC4\uC758 \uAC80\uC0AC \uACB0\uACFC\uB97C \uC885\uD569\uD569\uB2C8\uB2E4. \uBC31\uB0B4\uC7A5\uC740 \uB2E4\uB978 \uC9C8\uD658\uACFC \uD568\uAED8 \uC788\uC744 \uC218 \uC788\uC73C\uBBC0\uB85C \uC804\uCCB4 \uC18C\uACAC\uC5D0 \uB530\uB77C \uC758\uB8B0\uD569\uB2C8\uB2E4.",
        },
      ],
    },
  ],
  y = 1,
  x = d.map((e) => {
    let t = { start: y, end: y + e.seconds, cueIds: e.cues.map((a) => a.id) };
    return ((y = t.end), t);
  }),
  P = {
    folder: "cataract",
    route: "videos",
    languages: Object.keys(E),
    stages: x.map((e, t) => [
      [e.start, 0],
      [e.end, d[t].seconds * 30 - 1],
    ]),
  },
  $ = {
    pageId: R,
    label: "Cataract",
    playMode: "stageAutoplay",
    enableReplay: !0,
    segmentTextToggleOnTitle: !0,
    fitCaptionsInViewport: !0,
    narrationCompletionPauseSeconds: 1.5,
    strictFrameLockNoFallback: !0,
    strictFrameRemountOnBlank: !0,
    persistentSettleSnapshotOverlay: !0,
    lazyLoadStageAnimations: !0,
    lazyInitialStageCount: 1,
    skipRouteImageWarmup: !0,
    progressStoragePrefix: "lessonProgress:",
    paths: d.map((e, t) => `/scrolly/conditions/cataract/${t + 1}/data.json`),
    stageAspectRatioByFile: d.map(() => "1169 / 1280"),
    sections: F,
    segmentRanges: d.map((e) => [{ from: 0, to: e.seconds * 30 - 1 }]),
    completionHoldFrameByFile: d.map((e) => e.seconds * 30 - 1),
    segmentStartTexts: d.map((e) => e.cues.map((t) => t.en)),
    segmentTextModeByFile: d.map(() => "append"),
    narrationTracks: Object.fromEntries(
      Object.entries(E).map(([e, { label: t }]) => [
        e,
        { label: t, src: `/narration/cataract/full-animation/${e}.m4a` },
      ]),
    ),
    narrationClipsByFile: x,
  };
var T = {
  cataractScrollPage: P,
  pupilsPecScrollPage: g,
  makeEyePadShieldScrollPage: _,
  applyEyePadShieldScrollPage: v,
  visualAcuityExaminationScrollPage: S,
  frontOfEyeExaminationScrollPage: {
    folder: "front-of-eye",
    stages: [
      [
        [3.7, 0],
        [6, 89],
        [9.7, 89],
      ],
      [
        [10, 0],
        [15.3, 157],
        [17, 158],
        [20.7, 269],
        [24.5, 269],
      ],
      [
        [27, 0],
        [37.8, 323],
        [38, 324],
        [46.8, 629],
      ],
      [
        [50, 0],
        [50.8, 24],
        [55, 46],
        [58.5, 187],
        [64.5, 353],
        [70.5, 554],
        [75.5, 698],
        [81.5, 850],
        [85.7, 1019],
      ],
      [
        [87, 0],
        [88, 149],
        [94, 149],
      ],
      [
        [102, 0],
        [103, 29],
        [106.85, 29],
        [109.85, 119],
        [113, 119],
      ],
      [
        [115.5, 0],
        [117.5, 119],
        [120.1, 119],
      ],
      [
        [124, 0],
        [129, 149],
        [129.6, 149],
      ],
      [
        [130.6, 0],
        [134, 169],
      ],
      [
        [136, 0],
        [137, 89],
        [143.5, 89],
      ],
      [
        [151, 0],
        [154, 119],
        [156.7, 119],
        [157.5, 163],
        [160.7, 241],
        [162.2, 320],
        [165.2, 360],
        [167.7, 398],
        [170.7, 449],
        [171.4, 449],
      ],
    ],
  },
  directOphthalmoscopyScrollPage: {
    folder: "direct-ophthalmoscopy",
    stages: [
      [
        [3.2, 0],
        [7.2, 158],
      ],
      [
        [7.2, 0],
        [13.8, 196],
        [14, 196],
      ],
      [
        [14, 0],
        [18, 120],
        [21, 205],
        [24.4, 299],
      ],
      [
        [25, 0],
        [33, 239],
        [37, 383],
        [40.5, 509],
      ],
      [
        [43.8, 0],
        [46, 77],
        [49.1, 77],
        [51.1, 137],
        [55.2, 329],
      ],
      [
        [57, 0],
        [68.3, 389],
      ],
      [
        [71, 0],
        [81.2, 389],
      ],
      [
        [82, 0],
        [88.2, 0],
        [88.7, 15],
        [90.88, 45],
        [91.38, 60],
        [92.2, 106],
        [92.2 + 209 / 29.97, 315],
      ],
      [
        [94.6, 0],
        [103.4, 263],
        [103.8, 264],
        [109.09, 524],
        [109.09 + 121 / 29.97, 645],
        [113.2, 645],
      ],
      [
        [118, 0],
        [119.9, 56],
        [125, 193],
        [129.25, 330],
        [133.5, 479],
      ],
      [
        [135.6, 0],
        [138.5, 87],
        [142, 194],
        [144.62, 194],
      ],
      [
        [145, 0],
        [152.5, 224],
        [153.7, 224],
      ],
      [
        [154, 0],
        [157.3, 98],
        [158, 98],
        [176.4, 629],
        [176.6, 670],
        [177.6, 700],
        [180.6, 700],
        [180.61, 750],
        [182.1, 794],
        [183.05, 794],
      ],
    ],
  },
  binocularIndirectOphthalmoscopyScrollPage: {
    folder: "binocular-indirect-ophthalmoscopy",
    stages: [
      [
        [2.5, 37],
        [6.1, 158],
      ],
      [
        [6.5, 0],
        [14.5, 392],
        [19, 392],
        [25.5, 598],
      ],
      [
        [26, 0],
        [32, 183],
        [34, 271],
        [35, 271],
        [37, 340],
        [38, 340],
        [39.7, 404],
      ],
      [
        [39.95, 0],
        [41.95, 0],
        [45.95, 119],
        [47.1, 119],
      ],
      [
        [51, 0],
        [58.5, 224],
        [59.9, 224],
      ],
      [
        [60.2, 0],
        [65.7, 166],
        [67, 166],
        [68.5, 224],
      ],
      [
        [68.7, 0],
        [71.2, 75],
        [72.2, 75],
        [74, 158],
        [75, 158],
        [76.3, 224],
      ],
      [
        [76.5, 0],
        [82, 175],
        [85.2, 270],
        [87.7, 270],
      ],
      [
        [88, 0],
        [93.2, 164],
      ],
      [
        [97.8, 0],
        [98.3, 14],
        [99, 14],
        [102, 104],
      ],
      [
        [102, 0],
        [104, 59],
        [108.5, 59],
        [110.4, 87],
        [114, 87],
        [115.2, 104],
        [117.8, 104],
      ],
      [
        [117.8, 0],
        [122.2, 134],
      ],
      [
        [122.2, 0],
        [130.6, 299],
      ],
    ],
  },
};
function J(e, t) {
  if (t <= e[0][0]) return e[0][1];
  for (let a = 1; a < e.length; a++) {
    let [n, l] = e[a],
      [s, o] = e[a - 1];
    if (t <= n) return Math.round(o + (l - o) * ((t - s) / (n - s)));
  }
  return e[e.length - 1][1];
}
function Q(e) {
  let t = T[e.pageId];
  if (!t) return;
  ((e.narrationTimeline = t.stages),
    e.pageId === "directOphthalmoscopyScrollPage" &&
      ((e.segmentRanges[8] = [{ from: 0, to: 645 }]),
      (e.settleFrameOverrides[8] = [645]),
      (e.completionHoldFrameByFile[8] = 645)));
  let a,
    n,
    l = e.loadText,
    s = e.getSegmentStartTexts;
  ((e.loadText = async () => {
    (await l?.(),
      (n ||= fetch(`/narration/${t.folder}/full-animation/script.json`)
        .then((o) => {
          if (!o.ok) throw new Error(`Examination captions: ${o.status}`);
          return o.json();
        })
        .then((o) => {
          a = o;
        })
        .catch((o) => {
          ((n = null), console.error(o));
        })),
      await n);
  }),
    (e.getNarrationCues = (o) =>
      e.narrationClipsByFile[o].cueIds
        .map((r) => a?.cues.find((i) => i.id === r))
        .filter(Boolean)),
    (e.getSectionTitle = (o, r) =>
      a?.videoTitleCues?.find((b) => b.sourceText === o)?.translations?.[r] ||
      o),
    (e.getSegmentStartTexts = (o, r) =>
      a
        ? e.getNarrationCues(o).map((i) => i.caption?.[r] ?? i[r] ?? i.en)
        : s?.(o, r)),
    (e.segmentTextModeByFile = t.stages.map(() => "append")));
}
function ee(e, t = "en") {
  let a = T[e];
  if (!a) return;
  let n = t;
  try {
    if (localStorage.getItem(`videoNarration:${e}`) === "off") return;
    let i = localStorage.getItem(`videoNarrationLanguage:${e}`);
    if (i === "off") return;
    i && i !== "auto" && (n = i);
  } catch {}
  ((n = String(n).toLowerCase().split(/[-_]/)[0]),
    n === "es" && (n = "es-419"),
    ["en", "es-419", "ko", "ne", "fr", "lg", "ha", "yo", "ig"].includes(n) ||
      (n = "en"),
    a.languages && !a.languages.includes(n) && (n = "en"));
  let l = window.__arclightPrimedScrollAudio;
  l && (l.audio.pause(), l.audio.remove());
  let s = document.createElement("audio");
  ((s.hidden = !0),
    (s.preload = "auto"),
    (s.src = `/narration/${a.folder}/full-animation/${n}.m4a`),
    document.body.appendChild(s));
  let o = { pageId: e, audio: s };
  window.__arclightPrimedScrollAudio = o;
  let r = () => {
    window.__arclightPrimedScrollAudio === o && s.pause();
  };
  try {
    Promise.resolve(s.play()).then(r, r);
  } catch {
    r();
  }
}
function te(e) {
  let t = window.__arclightPrimedScrollAudio;
  return !t || t.pageId !== e
    ? null
    : (delete window.__arclightPrimedScrollAudio, t.audio);
}
export {
  M as a,
  L as b,
  H as c,
  j as d,
  O as e,
  V as f,
  B as g,
  $ as h,
  T as i,
  J as j,
  Q as k,
  ee as l,
  te as m,
};
