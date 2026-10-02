# Tech Context

Advanced dependency and preset-finding follow-up, 24 July 2026: browser-visible assets and the app-scoped worker use `20260724-squint9`. `src/controls-controller.js` owns nystagmus dependency state and `src/ui-shell.js` owns non-destructive preset filtering. Browser contracts protect disabled and enabled dependency states, 44px search geometry, one-result Duane filtering, 68-result restoration, guide fit and zero overflow over HTTP and direct-file routes. Both 68-preset audits pass.

Result and Advanced-panel clarity follow-up, 24 July 2026: browser-visible assets and the app-scoped worker use `20260724-squint8`. `tests/browser-review.mjs` protects the structured neutral result, released-cover clearing, guide fit, Advanced section and label sizes, RE/LE lid labels, non-clipping Movement controls and zero horizontal overflow. HTTP and direct-file workflows plus both 68-preset audits pass at `360 x 740`. Service workers remain unavailable on `file://`.

Gaze-tracker UI follow-up, 24 July 2026: browser-visible assets and the app-scoped worker use `20260724-squint7`. `tests/browser-review.mjs` protects the `Gaze tracker` title, visible direction status, 22px target, neutral-point alignment, active muscle feedback and active Up-right state. HTTP and direct-file workflows plus both 68-preset audits pass at `360 x 740`.

Torch and ambient-light follow-up, 24 July 2026: browser-visible assets and the app-scoped worker use `20260724-squint6`. `src/light-controller.js` contains the request-animation-frame full-track sweep, position-proportional smoothstep illumination and direct pointer drag. `tests/browser-review.mjs` records position and active glow strength for animated and direct-drag states, captures near-centre, midpoint and terminal screenshots and verifies the rotated ambient bulb and accessible name. HTTP and direct-file workflow reviews and both 68-preset audits pass at `360 x 740`.

Interaction and teaching review, 24 July 2026: browser-visible assets and the app-scoped worker use `20260724-squint4`. `tests/condition-audit.mjs` now clears app-scoped HTTP storage before navigation, drives the complete 68-preset inventory and protects Near convergence, manual pupil-state reset and cover sequencing. `tests/browser-review.mjs` protects the 0.28s torch movement, Near rendering, cover observations and the complete mobile workflow.

Condition-logic correction, 24 July 2026: `tests/condition-audit.mjs` drives the complete 68-preset inventory and dynamic condition checks through a disposable 360 x 740 browser target. Both HTTP and direct-file audits pass. Service workers remain unavailable on `file://`.

Eye-engine follow-up, 23 July 2026: browser-visible assets use the `20260723-eye1` cache. Navigation is network-first when online and falls back to the cached index offline. Gaze and swinging-light keyboard handling remains inside their existing controllers.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (24/7/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: yellow `#ffb000` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Last updated: 24/7/2026

## Runtime

1. Browser-only static app with no backend.
2. Vanilla HTML/CSS/JavaScript.
3. Fonts: local Inter and Quicksand WOFF2 assets.
4. Primary target viewport for current UI work: 360x740.

## Local Run

1. `python -m http.server 8080`
2. Open `http://127.0.0.1:8080/`
3. In Codex work, prefer the in-app browser for visual checks.

## Main Files

1. `index.html` - page structure and script load order.
2. `style.css` - theme, responsive layout and Fundal-style eye scene.
3. `src/sim-core.js` - pure simulator constants/helpers.
4. `src/preset-runner.js` - preset case map.
5. `src/state.js` - shared runtime state and helper wrappers.
6. `src/output-writer.js` - RE/LE output composition.
7. `src/cover-controller.js` - cover/fixation handover state.
8. `src/light-controller.js` - torch swing, RAPD, ambient and pupil dynamics.
9. `src/eye-effects-controller.js` - blink/micro/cyclo/nystagmus engines.
10. `src/eye-controller.js` - drag/sliders/fade orchestration and transform composition.
11. `src/gaze-controller.js` - diagnostic gaze pad, muscle readout and live gaze movement.
12. `src/controls-controller.js` - control wiring, advanced panel and preset apply.
13. `src/ui-shell.js` - sidebar/info popup/preset list rendering.
14. `script.js` - bootstrap wiring and compatibility globals.
15. `src/analysis-core.js` - pure analysis helpers.
16. `analysis.js` - interpretation rendering/engine.
17. `src/mcq-data.js` - MCQ question data.
18. `mcq.js` - MCQ runtime state/UI.
19. `qa-refactor-check.cjs` - refactor parity harness.

## Quality Commands

1. `node --check src/sim-core.js`
2. `node --check src/preset-runner.js`
3. `node --check src/state.js`
4. `node --check src/output-writer.js`
5. `node --check src/cover-controller.js`
6. `node --check src/light-controller.js`
7. `node --check src/eye-effects-controller.js`
8. `node --check src/eye-controller.js`
9. `node --check src/gaze-controller.js`
10. `node --check src/controls-controller.js`
11. `node --check src/ui-shell.js`
12. `node --check script.js`
13. `node --check src/analysis-core.js`
14. `node --check analysis.js`
15. `node --check src/mcq-data.js`
16. `node --check mcq.js`
17. `node qa-refactor-check.cjs check`
18. `npm test` for the 19 platform and accessibility contracts.

For broad syntax checking:

```powershell
Get-ChildItem -LiteralPath src -Filter *.js | ForEach-Object { node --check $_.FullName }
node --check script.js
node --check analysis.js
node --check mcq.js
```

## Data Contract

1. Simulator writes RE/LE strings to hidden elements.
2. Analysis consumes those strings through update events.
3. Preset-specific hints are injected as `hint:*`.
4. Diagnostic gaze uses `iris.gazeOffset`.
5. Live patient-like gaze uses `iris.liveGazeOffset` and must stay visual-only.
6. Light/ambient state is carried in `AppState.state` (`activeLightSide`, `lightPillPos`, `rapdValue`, `ambientLevel`).
7. Parity baseline is maintained in `qa-refactor-baseline.json`.

# Fleet upgrade note — 23 July 2026

Runtime fonts are local. Run `node qa-refactor-check.cjs check`, `node tests/run-tests.cjs` and the documented syntax checks after changes. Service workers run only over HTTP(S), while direct-file use remains available without offline registration.

## Refactor verification — 26 July 2026

`npm test`, `npm run parity` and `npm run audit:conditions` pass. The audit covers all 68 presets at the target `360 x 740` dimensions without changing the retained browser toolbar.

The MCQ quality pass uses stylesheet, data-script, controller and Squint-cache token `20260726-mcqquality2`. `npm test`, `npm run parity` and `npm run audit:conditions` pass. Tests cover all 47 stable IDs, revised content and source routing, rationales, sources, atomic unanswered handling, result hierarchy and retry scroll reset.
