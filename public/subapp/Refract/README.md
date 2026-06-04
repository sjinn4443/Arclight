# Refract

<!-- APP-DOC-STATUS:START -->

## Current Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: off-white `#f5f8ff` on a blue appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Refract is a static browser app for estimating a likely final spectacle prescription from a patient's current prescription and objective refraction.

It runs entirely in the browser. There is no backend, no package manager requirement, and no build step.

## Features

- Enter current and objective refraction for right eye (`RE`) and left eye (`LE`)
- Capture context through:
  - `health?`
  - `exact`
  - `VA good`
  - `accurate`
- Keep `advanced` as a separate UI mode control rather than patient context
- Auto-calculate output sphere, cylinder, axis, and reading add
- Switch between simple and advanced entry modes
- Transpose prescriptions from the current/objective inputs
- Use touch-friendly spinner inputs with long-press acceleration
- Apply inline guardrails for cylinder/axis consistency and low-value add fields
- Render signed values consistently in both editable and output fields
- Show a compact app bar with info popup and MCQ drawer shell

## Calculation Rules

Current rules implemented in the app:

1. Build a softened objective target:
   - objective sphere gets a `-0.25` offset
   - objective cylinder is reduced toward plano by `0.25`
2. If the current sphere is missing, treat that as no current/worn glasses data and use the softened objective target
3. If a current prescription exists, blend each component separately rather than making one binary current-vs-objective choice:
   - sphere, cyl, and axis each use a configurable pull toward the objective
   - `exact` and `VA good` increase resistance to change
   - `accurate` increases objective pull, and workbook `8/9` quality values map to that in the audit workflow
4. Keep corroborated low-cylinder axes conservative:
   - exact low-cylinder cases often keep current axis or use a compromise axis instead of fully following the objective
5. Treat blank objective cyl/axis as a pure-sphere objective result
6. Round objective axis based on reduced cylinder:
   - `< 1.00` -> nearest `5`
   - `>= 1.00` -> nearest `1`
7. Preserve an entered add when present:
   - prefer current add
   - otherwise use objective add
   - otherwise compute add from age bands, with `health?` meaning poor condition and adding `+0.25`
   - the current fitted defaults only start generating age-based add from age `46`
8. In non-`exact` mode, outputs turn orange when both output spheres are between `-0.50` and `+0.75`

Cylinder reduction amount:

- objective cylinder is reduced toward plano by `0.25`

## Workbook Benchmark

The Allan workbook is now used as a benchmark and rule-discovery source, not as live runtime lookup.

- `src/prescription-engine.js` is the live heuristic path used by the UI
- `src/workbook-benchmark-engine.js` is the benchmark-only path that can replay workbook calibration data
- `tools/audit-allan-rx.mjs` runs either:
  - heuristic mode: `node tools/audit-allan-rx.mjs`
  - benchmark mode: `node tools/audit-allan-rx.mjs --benchmark`
  - fixed spreadsheet-input mode: `node tools/audit-allan-rx.mjs --sheet-inputs`
- `tools/fit-prescription-config.mjs` searches the live heuristic parameters against the workbook and reports the best config it finds
- `tools/extract-workbook-actions.mjs` summarizes inferred workbook action labels such as `keep`, `drop`, `target`, and `midpoint`
- `tools/learn-workbook-rules.mjs` trains a short ordered rule list for one action target and reports leave-one-out accuracy plus bootstrap stability
- `tools/study-workbook-ceiling.mjs` compares action-level rule performance across full workbook features and simplified app-style feature sets

## UI Notes

- The working layout is intentionally compact and designed to fit a `360x740` mobile viewport on one page
- The top controls are split into `Age`, `Patient`, and `Mode` boxes
- `advanced` is a UI mode switch with its own faint red treatment
- When advanced mode is off, cylinder and axis inputs are hidden and best mean sphere (`sphere + cylinder / 2`) is applied
- Signed fields use a shared sign system so editable and output boxes reserve the same spacing

## Running Locally

Because this is a static site, any local HTTP server will work.

Example:

```powershell
python -m http.server 5000 --bind 127.0.0.1
```

Then open:

`http://localhost:5000/index.html`

## Project Structure

- `index.html` - main UI markup, popup copy, and output field structure
- `styles.css` - CSS manifest that imports layered styles from `styles/`
- `styles/` - split styling for tokens, base, header, layout, forms, overlays, and responsive rules
- `scripts.js` - small app bootstrap
- `logic.js` - compatibility re-export for the prescription logic module
- `src/prescription-logic.js` - pure prescription selection and transformation rules
- `src/prescription-config.js` - default heuristic parameters shared by the engine and fitter
- `src/prescription-engine.js` - live heuristic output engine used by the UI
- `src/workbook-benchmark-engine.js` - benchmark-only engine for workbook replay
- `src/workbook-calibration.js` - generated lookup table for the 60 Allan workbook cases, used only for benchmarking
- `src/ui/prescription-form.js` - recalculation, transpose flow, and output updates
- `src/ui/sign-fields.js` - shared signed-field state and rendering
- `src/ui/spinner-*.js` - spinner DOM, values, interaction, validation, and constants
- `src/ui/shell-controls.js` - burger menu and info popup behavior
- `tools/audit-allan-rx.mjs` - workbook regression harness
- `tools/fit-prescription-config.mjs` - workbook-driven fitter for the live heuristic parameters
- `tools/lib/workbook-analysis.mjs` - shared workbook parsing, feature engineering, action extraction, and rule-learning helpers
- `tools/extract-workbook-actions.mjs` - workbook action summary
- `tools/learn-workbook-rules.mjs` - ordered-rule learner for action targets
- `tools/study-workbook-ceiling.mjs` - feature-set comparison for action-level leave-one-out accuracy
- `tools/generate-workbook-calibration.mjs` - regenerates the workbook calibration module from the local CSV export
- `tools/allan-rx-full.csv` - full-column workbook export used by the audit/generator
- `memory-bank/` - project context and maintenance notes

## Current Status

- The large JS files have been refactored into smaller ES modules
- The stylesheet has been split into layered files
- The output/input sign system has been unified
- The transpose flow is now routed through one controller path
- The live app now runs on heuristics only
- The live heuristic engine is now parameterized and can be tuned with the workbook fitter
- The benchmark engine still reproduces all 60 Allan workbook cases exactly
- The current fitted heuristic audit baseline is `24/60` full-case matches against the workbook, with `39/60` right eyes, `33/60` left eyes, and `52/60` adds matching in fixed spreadsheet-input mode
- The new action-level studies currently show roughly `68-69%` leave-one-out accuracy across the main inferred action targets, and full workbook features do not outperform the simplified feature sets on this dataset

## Known Gaps

- No formal automated test suite yet, although the local workbook audit harness is in place
- MCQ drawer buttons are present as UI shell only
- Runtime fonts and icons still come from remote CDNs
