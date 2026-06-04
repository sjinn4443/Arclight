# System Patterns

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
