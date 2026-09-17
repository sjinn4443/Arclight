// Folder order and cue intervals for the shared Fundal scrollytelling engine.
// Speech and translated guidance reuse narration/front-of-eye/full-animation/script.json.
// Clip times use the timed MP4 audio clock, not the local Lottie frame clock.
let narrationScript = null;
let narrationScriptRequest = null;

async function loadText() {
  if (!narrationScriptRequest) {
    narrationScriptRequest = fetch(
      "/narration/front-of-eye/full-animation/script.json",
    )
      .then((response) => {
        if (!response.ok)
          throw new Error(`Front of Eye guidance: ${response.status}`);
        return response.json();
      })
      .then((script) => {
        narrationScript = script;
      })
      .catch((error) => {
        narrationScriptRequest = null;
        console.error(error);
      });
  }
  await narrationScriptRequest;
}

function getSegmentStartTexts(fileIndex, language) {
  if (!narrationScript) return null;
  const clip =
    FRONT_OF_EYE_EXAMINATION_SCROLL_CONFIG.narrationClipsByFile[fileIndex];
  return clip.cueIds.map((id) => {
    const cue = narrationScript.cues.find((entry) => entry.id === id);
    return cue?.[language] || cue?.en || "";
  });
}

export const FRONT_OF_EYE_EXAMINATION_SCROLL_CONFIG = {
  loadText,
  getSegmentStartTexts,
  pageId: "frontOfEyeExaminationScrollPage",
  label: "Front of Eye Examination",
  enableReplay: true,
  persistentSettleSnapshotOverlay: true,
  playMode: "stageAutoplay",
  strictFrameLockNoFallback: true,
  strictFrameRemountOnBlank: true,
  lazyLoadStageAnimations: true,
  lazyInitialStageCount: 1,
  skipRouteImageWarmup: true,
  progressStoragePrefix: "lessonProgress:",
  paths: [
    "/scrolly/coreexam/frontofeye/01ObservationandMagnifiedExamination/1/data.json",
    "/scrolly/coreexam/frontofeye/01ObservationandMagnifiedExamination/2/data.json",
    "/scrolly/coreexam/frontofeye/01ObservationandMagnifiedExamination/3/data.json",
    "/scrolly/coreexam/frontofeye/01ObservationandMagnifiedExamination/4/data.json",
    "/scrolly/coreexam/frontofeye/01ObservationandMagnifiedExamination/5/data.json",
    "/scrolly/coreexam/frontofeye/02AnteriorChamberDepth/1/data.json",
    "/scrolly/coreexam/frontofeye/02AnteriorChamberDepth/2/data.json",
    "/scrolly/coreexam/frontofeye/03FluoresceinCornealStaining/1/data.json",
    "/scrolly/coreexam/frontofeye/03FluoresceinCornealStaining/2/data.json",
    "/scrolly/coreexam/frontofeye/03FluoresceinCornealStaining/3/data.json",
    "/scrolly/coreexam/frontofeye/04UpperEyelidEversion/data.json",
  ],
  sections: [
    {
      startIndex: 0,
      title: "Observation and Magnified Examination",
    },
    {
      startIndex: 5,
      title: "Anterior Chamber Depth",
    },
    {
      startIndex: 7,
      title: "Fluorescein Corneal Staining",
    },
    {
      startIndex: 10,
      title: "Upper Eyelid Eversion",
    },
  ],
  segmentRanges: [
    [
      {
        from: 0,
        to: 89,
      },
    ],
    [
      {
        from: 0,
        to: 269,
      },
    ],
    [
      {
        from: 0,
        to: 629,
      },
    ],
    [
      {
        from: 0,
        to: 1019,
      },
    ],
    [
      {
        from: 0,
        to: 149,
      },
    ],
    [
      {
        from: 0,
        to: 119,
      },
    ],
    [
      {
        from: 0,
        to: 119,
      },
    ],
    [
      {
        from: 0,
        to: 149,
      },
    ],
    [
      {
        from: 0,
        to: 169,
      },
    ],
    [
      {
        from: 0,
        to: 89,
      },
    ],
    [
      {
        from: 0,
        to: 449,
      },
    ],
  ],
  completionHoldFrameByFile: [
    89, 269, 629, 1019, 149, 119, 119, 149, 169, 89, 449,
  ],
  segmentTextTriggerFramesByFile: [
    [0],
    [0, 158],
    [0, 330],
    [0, 187, 353, 554, 698, 850],
    [0],
    [0, 30],
    [0],
    [0],
    [0],
    [0],
    [0, 120, 270, 360],
  ],
  segmentStartTexts: [
    [
      "Observe the periorbital area, eyelids and eyes, noting any abnormalities.",
    ],
    [
      "Then perform a magnified examination. Prepare the Arclight by selecting the brightest light setting.",
      "Hold the device close to your eye. Slowly approach the patient's right eye first until it is in focus.",
    ],
    [
      "Ask the patient to look right, then left.",
      "Then ask them to look up and down while gently holding their eyelids. Note the different structures seen, thinking of them in groups.",
    ],
    [
      "The first group includes the upper and lower eyelashes and lid margins.",
      "The second includes the conjunctiva and sclera,",
      "including the lower fornix.",
      "The third group is the cornea,",
      "and its junction with the sclera, called the limbus,",
      "as well as the pupil, which is surrounded by the iris.",
    ],
    [
      "These are pictures of different conditions. Take time to examine with your Arclight.",
    ],
    [
      "The anterior chamber is the space between the cornea and the iris.",
      "By shining the light from the temporal side, the depth of the anterior chamber can be assessed.",
    ],
    ["A nasal shadow can suggest a shallow chamber. Refer."],
    [
      "Use a fluorescein strip or a Minims dropper to apply fluorescein to the eye.",
    ],
    ["Select the blue light and inspect the cornea."],
    [
      "Areas of epithelial loss and disease will be highlighted. Record the site and size of these areas.",
    ],
    [
      "Gently pinch and hold the eyelashes of the upper lid with your thumb and index finger.",
      "Place a cotton bud on the upper eyelid, use it as a fulcrum and turn the lid upwards.",
      "Hold the lid everted and inspect its inner surface, first with the naked eye,",
      "then bring in the Arclight for a magnified view.",
    ],
  ],
  segmentTextModeByFile: [
    "append",
    "append",
    "append",
    "append",
    "append",
    "append",
    "append",
    "append",
    "append",
    "append",
    "append",
  ],
  narrationClipsByFile: [
    {
      start: 3.7,
      end: 9.7,
      cueIds: ["observation-01"],
    },
    {
      start: 10,
      end: 24.5,
      cueIds: ["observation-02", "observation-03"],
    },
    {
      start: 27,
      end: 46.8,
      cueIds: ["observation-04", "observation-05"],
    },
    {
      start: 50,
      end: 85.7,
      cueIds: [
        "structures-01",
        "structures-02",
        "structures-03",
        "structures-04",
        "structures-05",
        "structures-06",
      ],
    },
    {
      start: 87,
      end: 94,
      cueIds: ["conditions-01"],
    },
    {
      start: 102,
      end: 113,
      cueIds: ["chamber-depth-01", "chamber-depth-02"],
    },
    {
      start: 115.5,
      end: 120.1,
      cueIds: ["chamber-depth-03"],
    },
    {
      start: 124,
      end: 129.6,
      cueIds: ["fluorescein-application"],
    },
    {
      start: 130.6,
      end: 134,
      cueIds: ["fluorescein-01"],
    },
    {
      start: 136,
      end: 143.5,
      cueIds: ["fluorescein-02"],
    },
    {
      start: 151,
      end: 171.4,
      cueIds: [
        "lid-eversion-grip",
        "lid-eversion-01",
        "lid-eversion-02",
        "lid-eversion-03",
      ],
    },
  ],
};
