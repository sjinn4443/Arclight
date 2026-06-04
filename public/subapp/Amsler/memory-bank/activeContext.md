# Active Context

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

## Current Focus

- Keep the current modular architecture stable (`canvas`, `analysis`, `report`, `ui`, `mcq`, `state`).
- Polish MCQ usability:
  - single-page list questions
  - no "Next" button flow
  - clean inline radio + option spacing
- Keep UI constraints explicit and locked:
  - app bar height `54px`
  - title `25px` bold
  - info icon inside app bar

## Recent Changes

- Added burger menu in app bar (left) with MCQ sidebar.
- Added tiered MCQ levels: `Primary`, `Intermediate`, `Advanced`.
- Converted MCQ flow to list format with one `Submit` and `Restart`.
- Set primary bank to 5 questions.
- Updated MCQ option styling to plain inline rows with neater spacing.
- Kept hidden stroke settings under `+` control (collapsed by default).
- Maintained compute output format:
  - `% total`
  - `% central`
  - `% peripheral`

## Next Steps

- Add a small manual regression checklist for:
  - draw + compute
  - report generation
  - MCQ open/submit/restart
- Consider extracting report HTML template from inline string into dedicated markup helper.
- Optional: tune MCQ modal width so long advanced options truncate less on small screens.

## Active Decisions

- Prefer low-risk refactors that preserve user-visible behavior.
- Keep all processing client-side.
- Keep report generation in-browser without external services.
