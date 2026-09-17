// Absolute narration times -> local Lottie frames. Repeated frames are teaching
// holds, matching the scenes/cues in the corresponding Full Animation lesson.
// Keep the final frames and the WebKit renderer/snapshot settings in the engine.
export const EXAMINATION_SCROLL_TIMING = {
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
        // English delivery: "ten" 90.88, "fifteen" 91.28, "degrees" 91.76.
        // Keep the green angle demonstration on screen throughout that phrase.
        [88.2, 0],
        [88.7, 15],
        [90.88, 45],
        [91.38, 60],
        [92.2, 106],
        // Continue the red examples at the source animation's 29.97 fps.
        // The visual tail finishes after this stage's narration has stopped.
        [92.2 + (315 - 106) / 29.97, 315],
      ],
      [
        [94.6, 0],
        [103.4, 263],
        [103.8, 264],
        // Lose the disc (109.09), follow (110.23), back (111.59).
        [109.09, 524],
        // Start on "lose the disc", then preserve the original motion speed.
        [109.09 + (645 - 524) / 29.97, 645],
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
        // The strap motion runs at its original ~30 fps, without the old
        // 2x compression. Alignment/thumb checkpoints after 32 s are retained.
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

export function frameAtNarrationTime(points, time) {
  if (time <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i++) {
    const [endTime, endFrame] = points[i];
    const [startTime, startFrame] = points[i - 1];
    if (time <= endTime) {
      return Math.round(
        startFrame +
          (endFrame - startFrame) *
            ((time - startTime) / (endTime - startTime)),
      );
    }
  }
  return points[points.length - 1][1];
}

export function configureExaminationTiming(cfg) {
  const timing = EXAMINATION_SCROLL_TIMING[cfg.pageId];
  if (!timing) return;
  cfg.narrationTimeline = timing.stages;
  if (cfg.pageId === "directOphthalmoscopyScrollPage") {
    // The old excerpt stopped at 525, before the branch-back-to-disc graphic
    // (583–645) described by positioning-05 in the Full Animation.
    cfg.segmentRanges[8] = [{ from: 0, to: 645 }];
    cfg.settleFrameOverrides[8] = [645];
    cfg.completionHoldFrameByFile[8] = 645;
  }
  let script;
  let request;
  const previousLoad = cfg.loadText;
  const previousTexts = cfg.getSegmentStartTexts;
  cfg.loadText = async () => {
    await previousLoad?.();
    request ||= fetch(`/narration/${timing.folder}/full-animation/script.json`)
      .then((response) => {
        if (!response.ok)
          throw new Error(`Examination captions: ${response.status}`);
        return response.json();
      })
      .then((value) => {
        script = value;
      })
      .catch((error) => {
        request = null;
        console.error(error);
      });
    await request;
  };
  cfg.getNarrationCues = (index) =>
    cfg.narrationClipsByFile[index].cueIds
      .map((id) => script?.cues.find((cue) => cue.id === id))
      .filter(Boolean);
  cfg.getSectionTitle = (title, language) => {
    const cue = script?.videoTitleCues?.find(
      (entry) => entry.sourceText === title,
    );
    return cue?.translations?.[language] || title;
  };
  cfg.getSegmentStartTexts = (index, language) =>
    script
      ? cfg.getNarrationCues(index).map((cue) => cue[language] || cue.en)
      : previousTexts?.(index, language);
  cfg.segmentTextModeByFile = timing.stages.map(() => "append");
}

// Called in the launcher click's user activation, before asynchronous page and
// animation loading. Reuse this exact media element to retain iOS authorization.
export function primeExaminationNarration(pageId, language = "en") {
  const timing = EXAMINATION_SCROLL_TIMING[pageId];
  if (!timing) return;
  let selection = language;
  try {
    if (localStorage.getItem(`videoNarration:${pageId}`) === "off") return;
    const stored = localStorage.getItem(`videoNarrationLanguage:${pageId}`);
    if (stored === "off") return;
    if (stored && stored !== "auto") selection = stored;
  } catch {
    /* Storage is optional. */
  }
  selection = String(selection).toLowerCase().split(/[-_]/)[0];
  if (selection === "es") selection = "es-419";
  if (
    !["en", "es-419", "ko", "ne", "fr", "lg", "ha", "yo", "ig"].includes(
      selection,
    )
  )
    selection = "en";
  const old = window.__arclightPrimedScrollAudio;
  if (old) {
    old.audio.pause();
    old.audio.remove();
  }
  const audio = document.createElement("audio");
  audio.hidden = true;
  audio.preload = "auto";
  audio.src = `/narration/${timing.folder}/full-animation/${selection}.m4a`;
  document.body.appendChild(audio);
  const entry = { pageId, audio };
  window.__arclightPrimedScrollAudio = entry;
  // The full narration tracks start with silence. Pause after unlocking, before
  // speech starts; the controller will seek to the first teaching cue.
  const pauseIfUnclaimed = () => {
    if (window.__arclightPrimedScrollAudio === entry) audio.pause();
  };
  try {
    Promise.resolve(audio.play()).then(pauseIfUnclaimed, pauseIfUnclaimed);
  } catch {
    pauseIfUnclaimed();
  }
}

export function takePrimedExaminationAudio(pageId) {
  const entry = window.__arclightPrimedScrollAudio;
  if (!entry || entry.pageId !== pageId) return null;
  delete window.__arclightPrimedScrollAudio;
  return entry.audio;
}
