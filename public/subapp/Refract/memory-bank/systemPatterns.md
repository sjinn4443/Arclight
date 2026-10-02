# System Patterns

## Weighted live path — 30 September 2026

The current calculation path is form context → `src/prescription-engine.js` → `src/weighted-prescribing.js` → the established component functions in `src/prescription-logic.js`. The old `src/prescribing-rules.js` remains the canonicalisation/limits source and historical ordered engine. Runtime code does not import the case CSV, expected outputs or workbook calibration lookup.

`context.rightQuality` and `leftQuality` are optional scores from 0 to 10. A recorded score overrides that eye's accuracy flag; null falls back to the per-eye/global flag. `context.calm` and `repeat` are optional booleans, not missing-as-false defaults. Practice familiarity affects a weak adaptation modifier only. Explicit good VA and the no-current route remain separate. Preserve quarter-dioptre rounding, circular axis handling, plus-cylinder equivalence and missing-versus-zero checks.

The engine exports one `PARAMETERS` object, 14 main `WEIGHTED_RULES` records and a fuller four-column `RULE_CATALOGUE` used by the interface. Add trace IDs have their own catalogue entries. The weighted chart generator imports these production definitions; regenerate it with `node tools/build-weighted-flowchart.mjs`. Its reviewed output is now promoted as the main chart. Future promotion requires visual checks and an explicit backup because `--promote` overwrites the main file without creating one. Keep the one-chart continuous-route layout contract and use the regenerated launcher to replace stale browser snapshots.

The large-sphere allowance is a ramp: `ordinaryStep + max(0, gap−1.25 D)`, limited to `1.5 D`, with the established `0.25 D` high-sphere cap. Do not restore the rejected abrupt threshold or a quality-specific branch that reverses spherical progress when confidence rises. Complete-lens optical distance is not globally monotonic under the inherited separate reduced-cylinder policy; test and describe that limitation instead of claiming otherwise.

Use `npm run build` to regenerate the bundle, `npm test` for contracts and the three scripts under `outputs/weighted-20260930/` for development replay, robustness and independent review. The current rule-review input mapping now includes recorded per-eye quality and tri-state calm/repeat; older tooling and historical scores may use different mappings. Saved pre-change sources and baseline analysis anchor comparisons. The inherited sphere target is clamped at zero before rounding so fractional inputs cannot cross plano through bias alone. Older architecture notes below are historical where they conflict with this entry.

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

## Architecture Overview

Refract is a client-side static web app that uses browser ES modules. `index.html` loads `scripts.js` as the entrypoint, which initializes the prescription form controller, spinner inputs, and shell controls. Live output calculation flows through a shared heuristic engine, while workbook-calibration replay is isolated to benchmark tooling.

## Key Technical Decisions

- Keep the app framework-free and backend-free for portability
- Use a small module graph instead of a single large script
- Keep pure prescription rules in `src/prescription-logic.js`
- Put cross-cutting output calculation in `src/prescription-engine.js`
- Keep workbook-calibration data out of the live app path
- Use benchmark tooling to compare heuristic behavior against the Allan workbook
- Keep DOM orchestration in focused `src/ui/*` modules
- Use a single shared sign system for both editable and output fields
- Recalculate outputs on both `input` and `change` events so spinner-driven and programmatic updates stay synchronized
- Keep the UI mobile-first and preserve the one-page `360x740` layout target

## Design Patterns

- Event-driven DOM updates
- Thin app bootstrap plus focused feature modules
- Derived output state from current DOM values rather than a central app store
- Input normalization before calculation:
  - axis depends on cylinder
  - sphere can be auto-filled when cylinder and axis are present
  - add values under `0.25` are cleared
- Shared signed-field state via wrapper `data-sign` attributes
- CSS layered by concern:
  - tokens
  - base
  - header
  - layout
  - forms
  - overlays
  - responsive

## Component Relationships

- `index.html`
  - defines the app bar, control boxes, prescription rows, output rows, popup, and MCQ drawer shell
- `scripts.js`
  - bootstraps the app on `DOMContentLoaded`
- `src/prescription-engine.js`
  - computes live final outputs for both eyes and add using heuristics only
- `src/prescription-logic.js`
  - exposes:
    - `selectRx`
    - `processEye`
    - `computeReadingAddition`
    - `checkOrangeFlag`
    - `transposePrescription`
- `src/workbook-benchmark-engine.js`
  - benchmark-only engine that replays workbook calibration first and falls back to heuristics
- `src/ui/prescription-form.js`
  - reads signed values, calls the shared engine, and owns transpose behavior
- `src/workbook-calibration.js`
  - generated lookup keyed by simplified app inputs:
    - age
    - `health?`
    - `exact`
    - current RE/LE values and add
    - objective RE/LE values
  - used only by benchmark tooling, not by the live runtime path
- `src/ui/sign-fields.js`
  - creates sign elements, stores sign state, reads signed values, and writes signed output/input values
- `src/ui/spinner-*.js`
  - owns spinner DOM, long-press interaction, normalization, and validation rules
- `src/ui/shell-controls.js`
  - owns burger menu and info popup interactions

## Critical Implementation Paths

- Input bootstrap:
  - find editable number inputs
  - wrap them in spinner containers if needed
  - ensure sign elements exist for signed fields
  - attach spinner buttons and validation rules
- Recalculation path:
  - read signed values from the shared sign-field system
  - build current/objective objects for each eye plus age/add/context
  - run the shared heuristic prescription engine
  - write output values through the same signed-field path
  - apply orange background rule
- Benchmark path:
  - run workbook audit or benchmark engine tooling
  - check generated workbook calibration first
  - compare heuristic behavior against known workbook outputs
- Simple mode path:
  - hide cylinder and axis inputs
  - convert rows to best mean sphere when advanced mode is switched off
- Transpose path:
  - transpose entered prescriptions
  - normalize cylinder sign direction across eyes in a section
  - recalculate outputs
- Shell path:
  - app bar info button toggles popup
  - burger button toggles drawer
  - backdrop and `Escape` close overlay UI

## Structural Risks

- Output state is still derived directly from the DOM, so future changes need to preserve field IDs and wiring carefully
- The app still has no automated regression suite
- Spinner-only entry is deliberate, but it means accessibility and keyboard behavior need explicit consideration
- Remote CDN dependencies for fonts/icons remain an operational dependency
- Generated workbook calibration data can drift if the local workbook export changes and the generator is not rerun
- The simplified app still collapses per-eye workbook quality into one global `accurate` toggle

## Maintenance pattern — 26 July 2026

- Keep form recalculation on one `input` event path.
- Generate `app.bundle.js` only from `scripts.js` and its imports.
- Keep `mcq-controller.js` separate and protect this boundary in the parity contract.

App-bar information glyphs use the shared plain `21px` form inside a `44 x 44px` touch target. Use Refract's blue `appbar-accent` and do not add an inner circular outline.

MCQ records must retain a stable `refract-{tier}-{NN}` ID, four distinct options, one valid `answerIndex`, a useful rationale, a known source key and explicit review status. Do not grade partially when answers are missing. After grading, show the result before explanations and source status, then expose `Try again` or `New attempt`.
