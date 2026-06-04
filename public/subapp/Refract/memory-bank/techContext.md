# Technical Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: off-white `#f5f8ff` on a blue appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

## Technologies Used

- HTML5
- CSS3
- JavaScript ES modules in the browser
- Font Awesome from CDN
- Google Fonts from CDN

## Development Setup

- Static app, no package manager required
- No bundler, transpiler, or framework
- Entry point: `index.html`
- Script bootstrap: `scripts.js`
- Common local run command:
  - `python -m http.server 5000 --bind 127.0.0.1`

## Technical Constraints

- Must run fully in-browser
- Must remain usable without build tooling
- Must preserve the compact one-page mobile layout as a core design constraint
- Signed numeric fields depend on wrapper-level sign state plus separate sign glyph rendering
- Current implementation favors controlled spinner entry over free typing
- External icon/font dependencies come from CDNs, so fully offline rendering is not guaranteed unless those are vendored later

## Dependencies

- Runtime dependencies:
  - Font Awesome stylesheet
  - Google Fonts stylesheet (`Quicksand`)
- No local npm dependencies

## File Responsibilities

- `index.html`
  - page structure, control boxes, output fields, popup, and drawer shell
- `styles.css`
  - CSS manifest importing:
    - `styles/tokens.css`
    - `styles/base.css`
    - `styles/header.css`
    - `styles/layout.css`
    - `styles/forms.css`
    - `styles/overlays.css`
    - `styles/responsive.css`
- `logic.js`
  - compatibility re-export of `src/prescription-logic.js`
- `src/prescription-engine.js`
  - shared live computation path using heuristics only
- `src/prescription-logic.js`
  - pure-ish prescription selection and transformation rules
- `src/workbook-benchmark-engine.js`
  - benchmark-only path that checks workbook calibration before heuristic fallback
- `src/workbook-calibration.js`
  - generated workbook-case lookup keyed by simplified app inputs
  - benchmark-only, not part of live runtime behavior
- `src/ui/prescription-form.js`
  - recalculation, transpose, output writing, and orange-state updates
- `src/ui/sign-fields.js`
  - shared signed-field state, formatting, and rendering
- `src/ui/spinner-dom.js`
  - spinner wrapper and button creation
- `src/ui/spinner-interactions.js`
  - click and long-press spinner behavior
- `src/ui/spinner-validation.js`
  - cylinder/axis/add/sphere guardrails
- `src/ui/simple-mode.js`
  - advanced-mode toggle behavior
- `src/ui/shell-controls.js`
  - popup and drawer interactions
- `tools/audit-allan-rx.mjs`
  - local workbook regression harness
- `tools/generate-workbook-calibration.mjs`
  - regenerates `src/workbook-calibration.js` from `tools/allan-rx-full.csv`
- `tools/allan-rx-full.csv`
  - full workbook export with preserved blank columns
  - workbook quality values (`QR` and `QL`) of `8` or `9` generally indicate an accurate/reliable objective finding

## Tool Usage Patterns

- Local serving:
  - `python -m http.server 5000 --bind 127.0.0.1`
- Quick repo inspection:
  - `rg --files`
  - `rg -n "function|addEventListener|data-sign" src index.html styles`
- Workbook regression:
  - `node tools/audit-allan-rx.mjs`
  - `node tools/audit-allan-rx.mjs --benchmark`
- Regenerate workbook calibration:
  - `node tools/generate-workbook-calibration.mjs`

## Verification Patterns

- Primary manual verification target:
  - `http://localhost:5000/index.html`
- Baseline viewport:
  - `360x740`
- Important regression checks:
  - heuristic workbook audit improves from its current `20/60` full-case baseline
  - benchmark workbook audit stays at `60/60`
  - simple vs advanced mode
  - transpose flow
  - signed input/output rendering
  - drawer and info popup behavior
  - no unintended vertical overflow
