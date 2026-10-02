# System Patterns

## Normalised analysis pattern (24/7/2026)

- `js/amsler-engine.js` is pure and DOM-free. It rasterises normalised marks at a fixed `400 x 400` analysis resolution.
- `normalisedLineWidth` is stored with each stroke. Responsive canvas redraws scale the visible width without changing the analysis result.
- `assessedEyes.RE` and `assessedEyes.LE` distinguish untouched, deliberately clear and marked states.
- Line marks count their stroke. Only a closed Missing or Red mark outline counts its actual polygon interior. Mask union prevents overlap double-counting.
- Central-zone coverage uses the central zone as its denominator. Outer-zone coverage uses the outer zone. Whole-grid coverage uses the complete grid.
- The controller handles presentation and overlays. It does not infer a symptom or diagnosis from mark geometry.
- `markAnalysisDirty` clears cached results and Report eligibility; the bootstrap wrapper also removes stale visible result and report surfaces.

## v1.1 Engineering Patterns (22/7/2026)

- `script.js` and `js/*.js` are authoritative modular sources.
- `tools/build-bundle.mjs` creates the classic `app.bundle.js` required for direct-file launch.
- Examination reset replaces in-memory assessment state, clears patient and report surfaces then redraws. It does not clear teaching achievement.
- Compute remains the only action that stores a completed analysis and enables Report.
- Dialog and drawer controllers manage expanded state, focus and Escape closure.
- The service worker uses an `arclight-amsler-` cache prefix and registers only over HTTP or HTTPS.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: red `#ff2a18` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

## Architecture Overview

Single-page static app:

- `index.html` for structure
- `styles.css` for layout and visual styling
- `script.js` for bootstrap + controller wiring
- feature controllers in `js/`:
  - `amsler-engine.js`
  - `canvas.js`
  - `analysis.js`
  - `report.js`
  - `ui.js`
  - `mcq.js`
  - `state.js`

## Key Technical Decisions

- Use a single canvas as the rendering and drawing surface.
- Store per-eye strokes and line width in normalised coordinates (`0..1`) so resize redraw and Compute are consistent.
- Keep data local in-memory during a session; no backend dependency.
- Use a fixed-resolution mask union for stable descriptive coverage.
- Fill only an explicitly closed Missing or Red mark polygon. Keep Line marks as strokes.
- Split marked coverage into whole-grid, central-zone and outer-zone percentages with explicit denominators.
- Keep modal handling centralized in JS (no inline modal scripts).

## Main State Model

- Mode flags: `flashDot`, `redMode`, `diagMode`
- Drawing state: `currentEye`, `currentTool`, `isDrawing`, `currentStroke`
- Stroke store: `strokes.RE` and `strokes.LE`
- Pen width state: `penLineWidth` with hidden settings panel
- Analysis cache state: `lastAnalysisResults`, `analysisDirty`

## Component Relationships

- Controls update state flags/tool selection.
- State change triggers `redraw()`.
- Analysis reads the pure engine result, updates result text and drives descriptive overlay drawing.
- Report generation captures canvas snapshots per eye and builds report markup with screenshot action.
- MCQ side menu opens modal quiz levels; submit computes score and explanation feedback.

## Current Design Tradeoffs

- Coverage remains a descriptive approximation of recorded marks, not a diagnostic or disease-severity measurement.
- Report HTML is currently assembled as an inline template string in JS, which is quick but harder to style centrally.
- MCQ options are forced to one-line rows for compactness; long text truncates on smaller screens.

## Analysis source of truth — 26 July 2026

- `js/amsler-engine.js` remains the pure source of Compute results, coverage and descriptive classification.
- `js/analysis.js` coordinates Compute state and draws recorded regions, mark boxes and zone highlights only.

## MCQ quality contract — 26 July 2026

- Keep stable question IDs, source IDs, concise rationales and pending-review metadata on every authored item.
- Do not use app mechanics as clinical teaching and do not repeat a Primary decision in a higher tier without adding a distinct decision.
- Grade only complete attempts. Reveal correct and selected-wrong states only after completion.
- Show Submit before grading and one New attempt action afterwards. Retry resamples, clears review and focuses the first input.
- Escape returns focus to the app-bar menu trigger.
- Do not reintroduce the removed hull-merging or canvas-mask branch beside the normalised engine.
- Continue rebuilding `app.bundle.js` from source and require `npm run build:check` to pass.

## MCQ content contract

- Question IDs use `amsler-{tier}-{two-digit authored index}` and are protected by tests.
- Every authored question carries `sourceIds`, `reviewStatus` and a concise `explanation`.
- Do not add app-control, scoring or report mechanics to the clinical question bank.
- Submission must not reveal answers until every question is answered.
