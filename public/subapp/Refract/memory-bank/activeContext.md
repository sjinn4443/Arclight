# Active Context

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

## Current Focus

Rebuild the heuristic prescription engine against the Allan workbook benchmark while preserving the compact mobile UI.

## Recent Changes

- Refactored the large JS files into smaller ES modules under `src/`
- Split the stylesheet into layered files under `styles/`
- Moved `logic.js` to a compatibility re-export over `src/prescription-logic.js`
- Consolidated sign handling into `src/ui/sign-fields.js`
- Fixed the muddled `+/-` rendering by using shared sign state and shared spacing rules
- Added a shared `src/prescription-engine.js` path for app output calculation
- Added a generated `src/workbook-calibration.js` module derived from the Allan workbook
- Added `tools/audit-allan-rx.mjs` and `tools/generate-workbook-calibration.mjs`
- Split the old lookup-backed path into benchmark-only `src/workbook-benchmark-engine.js`
- Restored the live app path to pure heuristics
- Reworked `src/prescription-logic.js` into a parameterized component-weighted engine
- Added `src/prescription-config.js` as the shared heuristic parameter surface
- Added `tools/fit-prescription-config.mjs` to search heuristic weights against the workbook
- Added `tools/lib/workbook-analysis.mjs` for shared workbook parsing, feature derivation, inferred action labels, and ordered-rule learning
- Added `tools/extract-workbook-actions.mjs`, `tools/learn-workbook-rules.mjs`, and `tools/study-workbook-ceiling.mjs`
- Refreshed the header and top control layout:
  - left burger button
  - right info button
  - `Age`, `Patient`, and `Mode` boxes
  - separate faint-red `advanced` mode box
- Preserved the one-page `360x740` layout target

## Next Steps

- Use the workbook only as a benchmark and rule-discovery source
- Use the new action-level studies to decide whether the next gains should come from a regime engine rewrite or more input separation
- Re-run the fitter and workbook audit after each logic/config change
- Keep UI verification separate from logic verification

## Active Decisions

- Keep the app static and framework-free
- Keep the mobile-first one-page layout as a hard design constraint
- Keep `advanced` visually separate from patient context
- Keep signed values as magnitude-in-input plus sign state on the wrapper
- Keep `calm` and `repeat` as legacy workbook-only fields, not live app inputs
- Treat `health?` as a poor-condition flag that mainly affects the add
- Treat blank current fields as missing current/worn-glasses data
- Treat blank objective cyl/axis as a pure-sphere objective result
- Treat workbook quality values of `8` or `9` as generally meaning the objective result was accurate/reliable
- Keep workbook calibration out of the live runtime path

## Patterns and Preferences

- Prefer small, explicit modules over a single large script
- Preserve clinical heuristics in readable rule code
- Use workbook data as a benchmark, not as runtime output lookup
- Prefer fitted parameters over ad hoc threshold nudges when the model shape is already in place
- Prefer action-level rule discovery before another live-engine rewrite
- Keep startup and hosting simple enough for a local HTTP server
- Document behaviors that are easy to break accidentally:
  - sign handling
  - simple-mode conversions
  - transpose normalization

## Insights and Learnings

- Sign display must not be the source of truth for numeric meaning
- Layout changes can easily break the one-page mobile fit, so `360x740` should stay part of manual verification
- The `advanced` switch is a UI mode control with data consequences, not just a styling preference
- `VA good` means the patient was happy with current glasses
- `accurate` means the objective result was trustworthy
- Workbook quality is recorded per eye, but the simplified app currently exposes only one global `accurate` toggle
- The live engine now blends sphere, cyl, and axis with configurable component pulls instead of a mostly binary current-vs-objective switch
- `tools/fit-prescription-config.mjs` currently fits the live defaults to `24/60` full workbook cases under fixed sheet-derived inputs, with `39/60` RE matches, `33/60` LE matches, and `52/60` add matches; the benchmark engine remains `60/60`
- The fitted defaults currently prefer stronger `precise` resistance, a small `0.25D` sphere step cap, later age-gated add generation, and a less eager low-cylinder axis follow
- The inferred action taxonomy covers most of the workbook cleanly: `sphere_action` has only `4/120` custom eyes, `cylinder_action` `11/120`, `axis_action` `8/120`, and `add_source` only `1/60` other-present cases
- Leave-one-out ordered-rule studies show that workbook-only fields are not obviously the missing ingredient: average action accuracy is about `68.0%` with full workbook features and about `69.0%` with the simplified feature sets
- The hardest targets are `axis_action` and `add_source`; `cylinder_action` is the easiest of the current action targets
- Case 6 currently looks more like a likely workbook anomaly or transcription/sign issue than a defensible averaging rule, so it should not drive the live engine unless a repeated pattern appears
