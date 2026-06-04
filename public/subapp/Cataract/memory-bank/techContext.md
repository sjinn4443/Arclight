# Tech Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: orange `#ff8a00` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

- Runtime: browser, no framework.
- Language: vanilla JavaScript (ES modules).
- Core files:
  - `index.html`
  - `style.css`
  - `script.js`
  - `src/*.js`
- Assets: local PNG images for fundal/back-of-eye choices.
- External resources:
  - Google Fonts (Quicksand)
  - Font Awesome CDN

## Local Run

- `python -m http.server 8080`
- open `http://127.0.0.1:8080`

## Validation Commands

- `npm run audit`
- `node qa-cataract-acceptance.mjs`
- `node qa-cataract-combination-audit.mjs`
- `node qa-cataract-result-output-audit.mjs`
- `node qa-cataract-full-audit.mjs`
- `node qa-cataract-lmic-content.mjs`

## Latest Validation Snapshot (2026-05-11)

- Acceptance audit:
  - checks passed `26/26`
- Combination audit:
  - no findings
- Result-output audit:
  - complete UI combinations `580,608`
  - unique visible Result panels `2,577`
  - findings `P0=0, P1=0, P2=0, P3=0`
- Full-state audit:
  - total states `7,558,272`
  - complete states `2,073,600`
  - complete+reachable `1,741,824`
  - findings `P0=0, P1=0, P2=0, P3=0`
- LMIC content audit:
  - PASS

## Tooling Status

- No separate lint runner configured.
- QA baseline is enforced through deterministic audit scripts, visible Result-output checks and acceptance scenarios.
