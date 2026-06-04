# Glaucoma

<!-- APP-DOC-STATUS:START -->

## Current Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: bright green `#00ff3b` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

Browser-based glaucoma risk calculator with a one-page UI and staged MCQ learning.

## Current Structure

- `index.html`: single-page UI markup.
- `styles.css`: stylesheet entrypoint that imports modular CSS files.
- `styles/base.css`: tokens + reset + global element defaults.
- `styles/layout.css`: page/grid/layout rules.
- `styles/components.css`: reusable components (popup, modal, menu, icons, etc).
- `styles/responsive.css`: media-query overrides.
- `scripts.js`: app entrypoint.
- `src/risk-engine.js`: pure risk computation + reasoning formatter.
- `src/risk-calculator-controller.js`: questionnaire, ratio/disc selection, grid highlighting.
- `src/popup-controller.js`: info popup + anchored popup open/close/positioning + config-driven scoring text render.
- `src/mcq-data.js`: MCQ level/question data.
- `src/mcq-engine.js`: pure MCQ evaluation/progress utilities.
- `src/mcq-controller.js`: menu/modal/timer/progression UI logic.
- `tests/*.mjs`: lightweight unit tests for pure engines.
- `tools/lint.mjs`: syntax lint runner used by `npm run lint`.

## Refactor Completed Today

- Split the old monolithic `scripts.js` into focused modules.
- Removed inline popup scripts/inline click handlers from `index.html`.
- Consolidated popup behavior into a single controller.
- Kept one-page layout while replacing layered CSS overrides with a maintainable modular stylesheet.
- Made the app-bar scoring logic popup list versioned and generated from `src/risk-config.js` constants.
- Added pure-function tests for:
  - risk scoring/mapping outcomes,
  - MCQ scoring/progression helpers.
- Added `package.json` with `type: module` and a test script.
- Added `npm run lint` (syntax checks across all app/test JS files).

## Logic Updates (Feb 25, 2026)

- Pressure input supports both measured IOP and digital palpation (`Normal`, `Firm`, `Rock`).
- If both palpation and measured IOP are selected, measured IOP is used and conflict is recorded in reasoning.
- `Rock` palpation triggers a dedicated emergency acute-glaucoma warning, including when C/D is not selected.
- Invalid pressure values no longer fall through to a normal message; they return an explicit incomplete-input message.
- App-bar info popup now shows a concise numbered scoring summary sourced from `src/risk-config.js` and a visible version label (`v1 - 18/5/2026`).

## UI Guardrails

- Keep the first-page experience usable at `360 x 740`.
- In the completed state, keep the top controls, question card, risk grid, reasoning line and final message visible without a scroll.
- Match the Fundal Reflex visual language where possible: black app bar with bright green title and icons, light clinical drawer, small level dots, soft popups and deliberate radius hierarchy.

## Run Locally

Option 1:

- Open `index.html` in a browser.

Option 2:

- Serve the folder with a static server (recommended):
  - `python -m http.server 8080`
  - open `http://localhost:8080`

## Tests

- `npm test`
- `npm run lint`

This runs `tests/run-tests.mjs` and validates the risk + MCQ engine behavior.
