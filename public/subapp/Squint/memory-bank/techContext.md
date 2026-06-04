# Tech Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: yellow `#ffb000` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Last updated: 18/5/2026

## Runtime

1. Browser-only static app with no backend.
2. Vanilla HTML/CSS/JavaScript.
3. External font: Google Fonts (`Quicksand`).
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
