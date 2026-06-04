# Progress

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

## What Works

- Static single-page UI with `Current`, `Objective`, and `Output` sections
- App bar with burger menu, info popup, and MCQ drawer shell
- Top controls split into `Age`, `Patient`, and `Mode`
- Spinner-based entry for age, sphere, cylinder, axis, and add
- Long-press acceleration for age and axis spinners
- Parameterized component-weighted prescription logic
- Objective sphere offset, cylinder reduction, and axis rounding rules
- Age-based reading add calculation with `health?` adjustment
- Fallback to current LE add when age is missing
- Simple mode that hides cylinder/axis fields and applies best mean sphere
- Shared signed-field rendering for both editable and output fields
- Single transpose controller path with section normalization
- Orange background state for low-risk near-plano outputs outside precise mode
- Layered CSS and split JS modules for maintainability
- Local documentation via `README.md` and `memory-bank/`
- Separate live heuristic and benchmark workbook engine paths
- Local audit and calibration-generation tooling in `tools/`
- Local heuristic fitter in `tools/fit-prescription-config.mjs`
- Local workbook action-analysis and ordered-rule tooling in `tools/lib/workbook-analysis.mjs`, `tools/extract-workbook-actions.mjs`, `tools/learn-workbook-rules.mjs`, and `tools/study-workbook-ceiling.mjs`

## What's Left To Build

- Extract generalized rules from the Allan workbook into `src/prescription-logic.js`
- Improve sphere, cylinder, axis, and add behavior until the heuristic audit is materially closer to the benchmark
- Formal automated tests for calculation rules and key UI regressions
- Real behavior for the MCQ drawer buttons, if they are meant to be more than placeholder UI
- Optional accessibility review for popup, drawer, and spinner controls
- Optional packaging/vendoring if full offline dependency independence is needed

## Current Status

Core functionality is present, locally runnable, and significantly easier to maintain than before the refactor. The live app is back on a heuristic-only runtime path, the benchmark engine preserves exact `60/60` workbook replay, and the fitted fixed-input heuristic audit currently sits at `24/60` full-case matches against the workbook, with `39/60` right eyes, `33/60` left eyes, and `52/60` adds matching.

The new action-level rule studies suggest the current bottleneck is not simply “missing calm/repeat in the app.” On leave-one-out ordered-rule tests, full workbook features score about the same as simplified features, which points more toward regime structure and target decomposition than toward restoring removed workbook columns.

## Known Issues

- There is still no formal automated test suite
- Runtime fonts and icons depend on remote CDNs
- DOM structure and field IDs still matter heavily because recalculation is DOM-driven
- The heuristic rules still underfit the workbook benchmark substantially
- The workbook calibration is generated benchmark data, so regeneration needs to stay in sync with the local workbook export
- Some workbook rows appear internally inconsistent or plausibly mis-entered, so rule extraction needs an explicit anti-overfitting bias
- The component-weighted engine still lacks enough inputs to explain every workbook add / distance-vs-near decision
- The current ordered-rule learner is analytical tooling, not yet the live engine

## Evolution of Decisions

- Kept the project fully static to minimize friction
- Moved from large script files to focused ES modules
- Moved from duplicated sign-handling logic to one shared sign system
- Split the stylesheet into smaller concern-based files
- Kept the mobile-first, one-page layout instead of expanding into a larger multi-panel UI
- Moved the spreadsheet-derived calibration layer out of the live runtime path and into benchmark-only tooling
