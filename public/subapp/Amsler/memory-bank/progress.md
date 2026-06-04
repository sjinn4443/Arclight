# Progress

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

## What Works

- Amsler grid renders and resizes to viewport.
- Drawing per-eye (`RE`, `LE`) with tool modes:
  - pen (dark)
  - erase (missing)
  - haemorrhage (red)
- Visual toggles work:
  - flashing fixation dot
  - red mode
  - diagonal mode
- Compute flow produces per-eye summaries as:
  - `% total`
  - `% central`
  - `% peripheral`
- Defect overlays render on compute:
  - zone highlights (central/peripheral)
  - hull fills
  - green bounding boxes with labels
- Report flow builds side-by-side RE/LE snapshot section and allows screenshot download.
- Instructions and patient modals open/close correctly, including backdrop-close behavior.
- App bar now meets required dimensions and icon placement.
- MCQ system works:
  - burger sidebar menu
  - primary/intermediate/advanced levels
  - list-based questions (no Next)
  - submit scoring + explanations + restart
  - primary bank capped at 5 items

## Remaining Work

- Add explicit regression checklist for touch drawing, compute overlays, report export, and MCQ flows.
- Optional cleanup: move report inline HTML string to a template helper for easier maintenance.
- Consider local persistence for strokes if session continuity becomes a requirement.

## Known Limitations

- No persistent patient/session storage.
- Defect metrics are geometric approximations based on convex hull area, not diagnostic measurements.
- No automated test suite currently in this repo (only manual checks).

## Current Status

Stable modular static app with requested UI updates completed, including MCQ sidebar/list flow and updated documentation.
