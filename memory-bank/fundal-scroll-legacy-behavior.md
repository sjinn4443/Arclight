# Fundal Scroll Legacy Behavior

Snapshot date: 2026-03-09

## Purpose

This document preserves the pre-refactor Fundal Reflex scroll behavior before the autoplay-per-animation change.

The legacy runtime lived in `public/js/childhoodFundalPreparation.js` and was driven by:

- `playMode: "segmentScroll"`
- per-file `segmentRanges`
- per-file `settleFrameOverrides`
- the topbar replay button created by `ensureReplayButton()`

The legacy segment-scroll code remains in the file for reference, but the active routes no longer use it after the autoplay refactor.

## Legacy Runtime Summary

- Each page consisted of multiple Lottie files.
- Scroll direction advanced playback one segment at a time inside the current file.
- A completed segment settled on `settleFrameOverrides` rather than always holding the literal last frame.
- The existing down arrow was shown on the current file while there was still forward progress available.
- After all files finished, the route dispatched `childhoodWorkshop:route-complete`.
- The old red replay button lived in the eyes topbar, not inside the animation stage.

## Legacy Frame Maps

### childhoodFundalPreparation

- `pageId`: `childhoodFundalPreparationPage`
- `paths`:
  - `/scrolly/coreexam/fundalreflex/prep/2/data.json`
  - `/scrolly/coreexam/fundalreflex/prep/3/data.json`
  - `/scrolly/coreexam/fundalreflex/prep/4/data.json`
- `segmentRanges`:

```js
[
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
];
```

- `settleFrameOverrides`:

```js
[
  [120, 205, 299],
  [101, 222, 354, 539],
  [164, 316, 398, 539],
];
```

### childhoodFundalExamination

- `pageId`: `childhoodFundalExaminationPage`
- `paths`:
  - `/scrolly/coreexam/fundalreflex/exam/1/data.json`
  - `/scrolly/coreexam/fundalreflex/exam/2/data.json`
  - `/scrolly/coreexam/fundalreflex/exam/3/data.json`
  - `/scrolly/coreexam/fundalreflex/exam/4/data.json`
  - `/scrolly/coreexam/fundalreflex/exam/5/data.json`
- `segmentRanges`:

```js
[
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
];
```

- `settleFrameOverrides`:

```js
[[149], [186, 329], [78, 209, 351, 449], [114, 359], [133, 253, 449]];
```

### childhoodFundalNewbornEyesOpen

- `pageId`: `childhoodFundalNewbornEyesOpenPage`
- `paths`:
  - `/scrolly/coreexam/fundalreflex/eyesopen/1/data.json`
  - `/scrolly/coreexam/fundalreflex/eyesopen/2/data.json`
  - `/scrolly/coreexam/fundalreflex/eyesopen/3/data.json`
- `segmentRanges`:

```js
[
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
];
```

- `settleFrameOverrides`:

```js
[[329], [147, 205, 659], [113, 265, 419]];
```

### childhoodFundalNewbornEyesClosed

- `pageId`: `childhoodFundalNewbornEyesClosedPage`
- `paths`:
  - `/scrolly/coreexam/fundalreflex/prep/1/data.json`
  - `/scrolly/coreexam/fundalreflex/eyesclosed/1/data.json`
  - `/scrolly/coreexam/fundalreflex/eyesclosed/2/data.json`
- `segmentRanges`:

```js
[
  [{ from: 37, to: 239 }],
  [{ from: 0, to: 389 }],
  [
    { from: 0, to: 240 },
    { from: 241, to: 419 },
  ],
];
```

- `settleFrameOverrides`:

```js
[[239], [389], [240, 419]];
```

### childhoodFundalUnclearFindings

- `pageId`: `childhoodFundalUnclearFindingsPage`
- `paths`:
  - `/scrolly/coreexam/fundalreflex/unclear/0/data.json`
  - `/scrolly/coreexam/fundalreflex/unclear/1/data.json`
  - `/scrolly/coreexam/fundalreflex/unclear/2/data.json`
  - `/scrolly/coreexam/fundalreflex/unclear/3/data.json`
- `segmentRanges`:

```js
[
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
];
```

- `settleFrameOverrides`:

```js
[
  [204, 269],
  [79, 253, 299],
  [82, 135, 209],
  [235, 475, 779],
];
```

### childhoodFundalPossibleFinding

- `pageId`: `childhoodFundalPossibleFindingPage`
- `paths`:
  - `/scrolly/coreexam/fundalreflex/findings/1/data.json`
  - `/scrolly/coreexam/fundalreflex/findings/2/data.json`
- `segmentRanges`:

```js
[
  [{ from: 0, to: 79 }],
  [
    { from: 0, to: 214 },
    { from: 220, to: 317 },
    { from: 333, to: 509 },
  ],
];
```

- `settleFrameOverrides`:

```js
[[79], [214, 317, 509]];
```

- `finalSummaryBulletsByFile`:

```js
[
  [],
  [
    "Occasional and short-lasting squints are common in the first month of life and will usually disappear by three months of age",
    "Any colour difference or partial/complete loss = abnormal",
  ],
];
```

### childhoodFundalAfterExamination

- `pageId`: `childhoodFundalAfterExaminationPage`
- `paths`:
  - `/scrolly/coreexam/fundalreflex/afterexam/1/data.json`
- `segmentRanges`:

```js
[
  [
    { from: 0, to: 89 },
    { from: 90, to: 149 },
  ],
];
```

- `settleFrameOverrides`:

```js
[[89, 149]];
```

## Legacy Topbar Replay Button

The old replay button was part of the eyes topbar and was not a stage-level control.

### Legacy JS entry points

- `ensureReplayButton()`
- `showReplayButton()`
- `hideReplayButton()`
- `resetAllAnimationsToStart()`

### Legacy behavior

- The button was created inside `.childhood-fundal-title-group`.
- It used `data-fundal-replay-btn="1"` and class `childhood-fundal-replay-btn`.
- Clicking it called `resetAllAnimationsToStart()`.
- The old segment-scroll runtime showed it through `showReplayButton()` once the route was already complete and the learner attempted reverse/no-op navigation after completion.

### Legacy CSS

The button styling lived in `public/style/pages.css` under `.childhood-fundal-replay-btn`.

Key values before the autoplay refactor:

- `position: absolute`
- `top: 50%`
- `left: 121px`
- `transform: translateY(-50%)`
- `width: 86px`
- `height: 28px`
- `border-radius: 14px`
- `background: #e41e21`
- `color: #fff`

Responsive legacy offsets:

- mobile: `left: 239px`
- 1024-1439px: `left: 675px`
- 1440px+: `left: 870px`

## Legacy Completion Behavior

Inside the old `initializeSegmentScrollMode()` flow:

- each controller finished its current segment and called `controller.onSegmentSettled`
- if the route still had remaining files, the current stage kept the down arrow visible
- when all files were complete, the old logic:
  - showed final summary bullets where configured
  - hid all down arrows
  - released the playback lock
  - pinned settled frames
  - dispatched `childhoodWorkshop:route-complete`

## Legacy Code References

Preserved code names for later restoration:

- `initializeSegmentScrollMode`
- `resolveSegmentsForFile`
- `pinControllerToSettledFrame`
- `showFinalSummaryBulletsForCompletedControllers`
- `ensureReplayButton`
- `showReplayButton`
- `hideReplayButton`
- `resetAllAnimationsToStart`
