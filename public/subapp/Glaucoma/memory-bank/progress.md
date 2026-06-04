# Progress

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

## Completed

- Full JS modularization delivered:
  - risk controller + pure risk engine,
  - popup controller,
  - MCQ controller + pure MCQ engine/data.
- Inline popup JS removed from HTML.
- Popup close (`x`) support standardized in JS.
- Stylesheet split into maintainable modules with `styles.css` as import entrypoint.
- Added unit-style tests for core engines.
- Added `package.json` scripts for testing and linting:
  - `npm test`
  - `npm run lint`
- Added pressure-path hardening in risk engine:
  - validated pressure inputs,
  - explicit conflict handling (IOP overrides palpation),
  - dedicated emergency warning for `Rock` palpation, including without C/D.
- Made scoring explainer popup dynamic and versioned from `risk-config` constants.

## Verified

- `npm run lint` passed.
- `npm test` passed.

## Remaining Gaps

- No browser automation test yet.
- No CI workflow yet.
