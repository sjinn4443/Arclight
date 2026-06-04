# Technical Context

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
- `html2canvas` (CDN) for screenshot export
- Font Awesome (CDN) for iconography
- Google Fonts (Quicksand) for app title

## Local Development Setup

- Open `index.html` directly for the simple packaged launch path.
- A local static server is still useful for cache-free browser testing:
  - `python -m http.server 5500`
  - `http://localhost:5500`

## Constraints

- No build step / bundler
- No backend services
- Must remain lightweight and mobile-friendly
- Must preserve app bar constraints (`54px`, `25px`, bold title)

## File Map

- `index.html`: DOM structure and modal containers
- `styles.css`: layout and component styles
- `script.js`: app bootstrap and controller composition
- `js/canvas.js`: canvas drawing + pointer interaction
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
