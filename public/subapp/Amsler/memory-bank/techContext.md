# Technical Context

## Compute repair technical context (24/7/2026)

- Pure engine: `js/amsler-engine.js`.
- Analysis resolution: fixed `400 x 400` normalised mask.
- Tests: `npm test` runs 16 contracts, including seven direct engine cases, then checks generated-bundle alignment.
- Browser-visible asset token: `20260724-compute1`. Worker cache token: `20260726-refactor2`, advanced for the shared information-footer date correction.
- HTTP 360 x 740 review passed with invariant resize results, no horizontal overflow and no console warnings or errors.
- Direct-file local assets and the generated classic bundle loaded in isolated Chrome. Its command-line minimum layout viewport prevents that capture from counting as a genuine 360 x 740 direct-file review.

## v1.1 Technical Context (22/7/2026)

- Local assets: Inter, Quicksand and html2canvas 1.4.1 with its MIT licence.
- Runtime has no Google Fonts, Font Awesome or CDN script dependency.
- Direct-file launch uses `app.bundle.js` and remains supported.
- HTTP launch adds app-scoped manifest and service-worker offline support.
- Build: `npm run build`.
- Bundle alignment: `npm run build:check`.
- Contracts: `npm test`.
- Clinical sign-off and physical-device acceptance remain pending.

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

## Technologies Used

- HTML5
- CSS3
- JavaScript (vanilla, browser runtime)
- Canvas API
- local `html2canvas` for screenshot export
- local CSS and text iconography
- local Inter and Quicksand fonts

## Local Development Setup

- Open `index.html` directly for the simple packaged launch path.
- A local static server is still useful for cache-free browser testing:
  - `python -m http.server 5500`
  - `http://localhost:5500`

## Constraints

- Modular source with a deterministic classic-bundle build
- No backend services
- Must remain lightweight and mobile-friendly
- Must preserve app bar constraints (`54px`, `25px`, bold title)

## File Map

- `index.html`: DOM structure and modal containers
- `styles.css`: layout and component styles
- `script.js`: app bootstrap and controller composition
- `js/canvas.js`: canvas drawing + pointer interaction
- `js/amsler-engine.js`: pure normalised mark analysis
- `js/analysis.js`: geometry and compute logic
- `js/report.js`: report rendering + screenshot hook
- `js/ui.js`: event wiring and modal/toggle behavior
- `js/mcq.js`: MCQ sidebar/modal logic
- `js/mcq-data.js`: question banks
- `js/state.js`: state initializer + analysis dirty flags
- `js/constants.js`: grid/tool constants
- `memory-bank/*.md`: continuity docs

## Verification Commands

- JS syntax checks:
  - `node --check script.js`
  - `node --check js/canvas.js`
  - `node --check js/analysis.js`
  - `node --check js/report.js`
  - `node --check js/ui.js`
  - `node --check js/mcq.js`
  - `node --check js/mcq-data.js`
  - `node --check js/state.js`
  - `node --check js/constants.js`
- Server availability check:
  - `Invoke-WebRequest http://localhost:5500 -UseBasicParsing`

## Refactor verification — 26 July 2026

- `node --check js/analysis.js`
- `npm run build`
- `npm test`
- `npm run build:check`

The 26 July clean-up reduced `js/analysis.js` to the live normalised engine integration and overlay renderer. Direct-file support remains provided by the generated classic bundle.

The final MCQ pass advances the stylesheet, bundle and app-scoped cache to `20260726-mcq2`. Rebuild with `npm run build`, then require `npm test` and the byte-equivalent `build:check` result. The clinical bank sources are NICE NG82 and NCBI Bookshelf `Amsler Grid`. Current result: 18/18 tests and exact bundle parity pass. Isolated browser evidence is under `output/playwright/mcq-quality/`.
