# System Patterns

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
  - `canvas.js`
  - `analysis.js`
  - `report.js`
  - `ui.js`
  - `mcq.js`
  - `state.js`

## Key Technical Decisions

- Use a single canvas as the rendering and drawing surface.
- Store per-eye strokes in normalized coordinates (`0..1`) so resize redraw is consistent.
- Keep data local in-memory during a session; no backend dependency.
- Use convex hull merging by overlap for lightweight defect grouping.
- Compute area percentages from hull geometry.
- Split defect burden into central vs peripheral via polygon clipping against a central zone rectangle.
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
- Analysis reads strokes, computes merged defect groups, updates result text, and drives overlay drawing.
- Report generation captures canvas snapshots per eye and builds report markup with screenshot action.
- MCQ side menu opens modal quiz levels; submit computes score and explanation feedback.

## Current Design Tradeoffs

- Geometry is lightweight and fast but still approximate, not diagnostic.
- Report HTML is currently assembled as an inline template string in JS, which is quick but harder to style centrally.
- MCQ options are forced to one-line rows for compactness; long text truncates on smaller screens.
