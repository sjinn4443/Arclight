# Amsler App

<!-- APP-DOC-STATUS:START -->

## Current Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: red `#ff2a18` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Browser-based Amsler grid app for quick central-vision defect sketching, analysis, reporting, and MCQ training.

## Run Locally

1. Open a terminal in this folder.
2. Start a static server:
   `python -m http.server 5500`
3. Open:
   `http://localhost:5500`

## Current Features

- Eye-specific drawing for `RE` and `LE`.
- Tools:
  - `Pen` (black)
  - `Erase` (white/missing)
  - `Haemorrhage` (red)
- Hidden stroke width control under `+` (collapsed by default).
- Grid view toggles:
  - flashing fixation dot
  - red mode
  - diagonal mode
- Compute pipeline:
  - merges overlapping stroke groups by convex-hull overlap
  - classifies pen groups as `wavy` or `dark`
  - reports `% total`, `% central`, `% peripheral` per eye
  - draws zone overlays, hull fills, and green bounding boxes
- Report builder:
  - patient name/date
  - per-eye compute text
  - per-eye image snapshots
  - screenshot export (`html2canvas`)
- Education mode:
  - app-bar burger menu (top left)
  - tiered MCQ sets: `Primary`, `Intermediate`, `Advanced`
  - list-style questions (no Next flow)
  - single submit with score + explanations
  - restart current level

## UI Constraints

- App bar height: `54px`
- Title size: `25px`
- Title weight: `700`
- Info icon remains in app bar (right side)

## Architecture

- `script.js`: App bootstrap and dependency wiring.
- `js/state.js`: Shared runtime state and analysis-dirty helper.
- `js/ui.js`: DOM event wiring and modal/toggle behavior.
- `js/canvas.js`: Grid/stroke rendering and pointer input.
- `js/analysis.js`: Defect merge, shape classification, zone math, summary text.
- `js/report.js`: Report HTML generation and screenshot handling.
- `js/mcq.js`: Sidebar/menu + MCQ modal controller.
- `js/mcq-data.js`: Tier question banks.
- `js/constants.js`: Shared constants/tool styles.
- `memory-bank/*.md`: Continuity docs.

## Quick Checks

- Syntax checks:
  - `node --check script.js`
  - `node --check js/canvas.js`
  - `node --check js/analysis.js`
  - `node --check js/report.js`
  - `node --check js/ui.js`
  - `node --check js/mcq.js`
