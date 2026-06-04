# Progress

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: black `#000000` on a red appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

## Completed

- Built and maintained static OTS-style calculator flow.
- Added dynamic score/category/outcome rendering.
- Added collapsible "Calculation" section for transparency.
- Refined mobile layout and spacing for 360x740 use.
- Separated Presenting VA and Risk Factors into distinct UI sections.
- Added tiered MCQ modal flow:
  - Primary
  - Intermediate
  - Advanced
  - level-specific content complexity and pass marks
- Added result utilities:
  - copy summary
  - export summary text file
- Added repository documentation (`README.md`).
- Added structured memory-bank documentation files.
- Copied the Fundal Reflex UI lessons into the Trauma app while preserving the Trauma identity:
  - red app bar with black Quicksand title
  - compact mobile-first clinical layout
  - off-white panels with blue-grey borders
  - light side menu with small level dots for MCQs
  - compact info popup with basics first
  - softer panel hierarchy with tighter nested MCQ options
- Replaced visible dynamic HTML string rendering with DOM/text rendering for MCQs, result summary, outcome table and calculation details.
- MCQ answer options now shuffle while preserving the correct answer.
- Reworked MCQ sections to better match the Fundal app:
  - side-menu MCQ rows include small level metadata
  - modal uses contained scrolling and Fundal-style question cards
  - option rows are tighter nested targets with hover states
  - result feedback is boxed and level pass marks are absolute counts
  - banks expanded to Primary 10, Intermediate 13 and Advanced 14

## Open/Next Candidates

- Optional: add explicit reset button for form state.
- Optional: lock MCQ level progression (unlock next tier after pass).
- Optional: persist MCQ best scores/progress in localStorage.
- Optional: add lightweight smoke tests (manual checklist or scripted checks).
- Optional: move inline index modal/sidebar script into `script.js` for single-controller architecture.
