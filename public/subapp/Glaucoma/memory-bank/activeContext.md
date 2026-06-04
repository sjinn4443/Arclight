# Active Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: bright green `#00ff3b` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

## Current Focus

Maintain the exact one-page Glaucoma UI while keeping the scoring logic transparent, explicit, and safe under edge cases.

Current UI guardrail: the app should keep the Fundal Reflex visual language and fit the first-page workflow inside a `360 x 740` mobile viewport. The completed-result state must show the top controls, question card, risk grid, reasoning line and final message without requiring a scroll.

## Completed in this refactor

- Broke monolithic `scripts.js` logic into focused modules under `src/`.
- Centralized all popup open/close logic in `src/popup-controller.js`.
- Moved risk scoring to pure `src/risk-engine.js`.
- Moved MCQ scoring/progress helpers to pure `src/mcq-engine.js`.
- Removed inline popup scripts and inline `onclick` handlers from `index.html`.
- Replaced duplicated/overridden CSS layers with a modular stylesheet split:
  - `styles/base.css`,
  - `styles/layout.css`,
  - `styles/components.css`,
  - `styles/responsive.css`.
- Added lightweight tests in `tests/` and `npm test` runner.
- Added `npm run lint` syntax checks via `tools/lint.mjs`.
- Hardened risk logic:
  - `Rock` palpation now has a dedicated emergency warning path.
  - Invalid pressure input returns an incomplete message (no false reassurance).
  - IOP-vs-palpation conflict is explicitly surfaced in reasoning.
- Made app-bar scoring popup logic text config-driven from `src/risk-config.js` with visible version label `v1 - 18/5/2026`.

## Immediate Next Checks

- Manual visual QA on 360x740 viewport.
- Quick interaction QA:
  - popup open/close + X buttons,
  - risk cell highlight + message updates,
  - MCQ unlock progression + timer,
  - emergency warning behavior when `Rock` is selected without C/D.
