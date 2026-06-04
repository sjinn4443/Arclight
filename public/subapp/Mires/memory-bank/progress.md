# Progress Log

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: bright green `#00ff00` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

## 2026-03-03

Completed:

- Added left `Newton IOP` and right `Variable IOP's` training drawers.
- Implemented drawer exclusivity and mobile-safe layout behavior.
- Added tiered variable-case ranges and Newton estimate bands.
- Implemented balanced bucket sampling for broader low/mid/high case variety.
- Updated Newton scoring to grade estimate selection only (`+/-2` correct, `+/-3` close).
- Removed weight-based correctness gating and "better weight" feedback.
- Added/condensed Goldmann quick guide modal with version marker (`v1 - 18/5/2026`).
- Reworked MCQ bank toward clinical Goldmann principles.

Validation:

- JS syntax checks passing for `app.js`, `simulator.js`, `mcq.js`, `questions.js`.
- Local static serving verified at `http://localhost:5500`.

Next possible steps:

- Add small smoke checks for key simulator/scoring paths.

## 2026-05-09

Completed:

- Transferred the Fundal Reflex UI discipline without copying its palette.
- Kept Quicksand for the app bar and moved the main UI to an Inter-style font stack.
- Rethemed the MCQ side menu as a light clinical panel with small tier dots.
- Refined the side menu to match Fundal more closely: starts below the app bar, includes a `Menu` kicker and has a close button.
- Removed the invented MCQ unlock/progress pattern so all levels remain directly accessible.
- Restyled Quick Guide as a compact top-right popup while preserving its text content.
- Polished the Newton IOP drawer with a lighter panel surface, calmer button states and more compact controls.
- Polished modal and MCQ question surfaces with quieter cards, borders and focus treatment.
- Updated the Goldmann quick guide and Variable IOP status copy to use `Centre / Touch / Steady`.
- Made Newton feedback judgement-first, then actual IOP.
- Fixed logic so Variable IOP does not reveal before user adjustment and Newton submitted answers lock until `New Case`.
- Replaced remaining avoidable HTML string rendering in MCQ results with DOM/text construction.
- Audited MCQ bank integrity and corrected remaining British English spellings in answer text.
- Reworked the MCQ modal layout to follow Fundal Reflex: compact title/intro, contained question scrolling, visible submit area, live submit action and lighter option rows.
- Added cache-busting query strings for the stylesheet and modules; current UI pass is `20260509-ui13`.

Validation:

- JS syntax checks passing for `app.js`, `simulator.js`, `mcq.js` and `questions.js`.
- Unsafe HTML-injection search returned no matches.
- Codex in-app browser checked at `360 x 740` for the main screen, side menu, Quick Guide, MCQ modal and Newton IOP drawer.
