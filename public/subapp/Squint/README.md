# Squint App

<!-- APP-DOC-STATUS:START -->

## Current Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: yellow `#ffb000` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Clinical teaching simulator for squint, ocular motility and pupil-sign pattern recognition.

## Purpose

1. Let users match what they see at the bedside using a visual binocular simulator.
2. Teach classic patterns through graded preset libraries.
3. Reinforce pattern recognition and triage logic with MCQs.
4. Keep the first page clear at a 360x740 mobile viewport.

## Core Workflow

1. Use the front-page controls for the common viewing state:
   - `Gaze` starts patient-like live gaze movement,
   - `Dilated` enlarges pupils,
   - `Baby` switches the eye scene to the baby scale,
   - `Adv` opens the detailed clinical controls.
2. Use the cover chips in the eye scene to cover `RE` or `LE`.
3. Use the light pill for torch and RAPD practice; dragged torch movement snaps back to centre on release.
4. Use the gaze track pad to set diagnostic gaze position and view muscle activation.
5. Add advanced clinical modifiers when needed.
6. Read concise RE/LE output and condition interpretation.
7. Use sidebar teaching sets (`Primary`, `Intermediate`, `Advanced`) and `Test Me`.
8. Use MCQ mode for rapid retrieval practice.

## Current UI Hierarchy

1. The main page follows the Fundal Reflex app visual language:
   - black app bar with yellow title and icons,
   - pale compact control cards,
   - dark eye scene,
   - soft rounded result cards.
2. First-page controls stay limited to `Gaze`, `Dilated`, `Baby` and `Adv`.
3. `Adv` holds lower-frequency detail:
   - Sudden,
   - Pain/HA,
   - Trauma,
   - Diplopia,
   - Head tilt,
   - Tired,
   - iris colour,
   - cyclo,
   - nystagmus,
   - pupil size,
   - fade,
   - upper lid.
4. Cover controls are small `RE`/`LE` overlays so they do not compete with the eyes.

## Gaze Behaviour

1. `Gaze` switch runs Fundal Reflex-style live eye movement.
2. Live movement is visual-only and uses `iris.liveGazeOffset`.
3. The gaze track pad is diagnostic and uses `iris.gazeOffset`.
4. The gaze track pad snaps back to primary gaze when released.
5. RE/LE output ignores live gaze, micro jitter and transient CSS motion to avoid false palsy text.

## Preset Library

The app includes 30 preset patterns across:

1. Primary: larger/common patterns.
2. Intermediate: mixed and moderate patterns.
3. Advanced: subtler/overlap patterns.

Included families cover:

1. Horizontal and vertical squints.
2. 3rd, 4th and 6th nerve palsy patterns.
3. Pupil-driven patterns including Adie's and Horner.
4. Ptosis severity patterns.
5. Higher-complexity patterns such as pupil-sparing 3rd, partial 6th, myasthenic, thyroid restrictive and INO-like.

## Analysis Engine Notes

1. RE/LE hidden output lines are the source for analysis state.
2. Preset-specific disambiguation uses `hint:*` tokens.
3. Manual diagnostic input clears preset hints to avoid stale over-labelling.
4. Modifier flags are appended to RE/LE tokens and shown as concise context notes.
5. Palsy image panel maps to recognised 3rd/4th/6th labels.

## Architecture Notes

1. `script.js` is bootstrap-only.
2. Runtime responsibilities are split into focused modules under `src/`.
3. Eye runtime is split by concern:
   - cover/fixation handover,
   - torch/RAPD/ambient pupil response,
   - gaze pad and live gaze,
   - recurrent blink/micro/nystagmus/cyclo effects.
4. Output writing uses stored simulator offsets rather than DOM geometry.

## File Map

1. `index.html`: app shell, controls, sidebar, popup and cards.
2. `style.css`: theme, responsive layout, components and state styling.
3. `src/sim-core.js`: pure simulator constants and colour helpers.
4. `src/preset-runner.js`: preset case execution map.
5. `src/state.js`: shared state and shared helper wrappers.
6. `src/output-writer.js`: RE/LE token output generation.
7. `src/cover-controller.js`: cover test state and fixation handover.
8. `src/light-controller.js`: torch swing, RAPD, ambient and pupil dynamics.
9. `src/eye-effects-controller.js`: blink, micro/background jitter, cyclo and nystagmus loops.
10. `src/eye-controller.js`: draggable eye and per-eye control wrappers.
11. `src/gaze-controller.js`: diagnostic gaze pad, muscle readout and live gaze movement.
12. `src/controls-controller.js`: control wiring and preset apply orchestration.
13. `src/ui-shell.js`: sidebar/info popup/render helpers and preset flash.
14. `script.js`: bootstrap wiring and compatibility exports.
15. `src/analysis-core.js`: pure analysis helper functions.
16. `analysis.js`: rule interpretation and rendering.
17. `src/mcq-data.js`: MCQ question bank.
18. `mcq.js`: MCQ runtime logic.
19. `qa-refactor-check.cjs`: refactor parity harness.

## Local Run

```powershell
python -m http.server 8080
```

Open `http://127.0.0.1:8080/`.

For Codex visual work, use the in-app browser.

## Quick Checks

```powershell
Get-ChildItem -LiteralPath src -Filter *.js | ForEach-Object { node --check $_.FullName }
node --check script.js
node --check analysis.js
node --check mcq.js
node qa-refactor-check.cjs check
```

## Clinical Scope

1. Teaching and screening support tool.
2. Not a replacement for full orthoptic, ophthalmic or neurological assessment.
