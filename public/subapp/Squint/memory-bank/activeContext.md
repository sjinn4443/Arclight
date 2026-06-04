# Active Context

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

Date: 18/5/2026
Repo: `Arclight App/Squint`

## Current Snapshot

1. One-page teaching app tuned for a 360x740 mobile viewport.
2. Visual direction now follows the Fundal Reflex app more closely: black app bar, red title, pale rounded control cards and a dark Fundal-style eye scene.
3. The front-page control hierarchy is deliberately small: `Gaze`, `Dilated`, `Baby` and `Adv`.
4. `Adv` holds lower-frequency clinical controls: Sudden, Pain/HA, Trauma, Diplopia, Head tilt, Tired, iris colour, nystagmus, cyclo, pupil size, fade and upper lid.
5. The gaze track pad remains visible as the diagnostic motility control.
6. The eye scene uses small `RE`/`LE` cover overlays rather than large cover pills.
7. The `Gaze` switch now runs Fundal Reflex-style live gaze movement rather than showing or hiding the track pad.
8. Live gaze uses separate `liveGazeOffset` values so animation does not contaminate RE/LE diagnostic output.
9. Output writing now uses stored simulator offsets rather than DOM geometry, preventing live animation, micro jitter and transient transitions from creating false palsy text.
10. Sidebar supports preset teaching sets and MCQ levels.
11. Preset library totals 30 patterns across Primary, Intermediate and Advanced.
12. Analysis uses RE/LE output strings plus preset hint tokens.

## Recently Completed

1. Copied the Fundal Reflex UI direction into Squint:
   - compact top controls,
   - Fundal-style dark eye card,
   - rounded pale cards,
   - clearer first-page hierarchy.
2. Removed reflex colour from the main workflow and moved iris/pupil/lid detail into `Adv`.
3. Added main-page `Gaze`, `Dilated` and `Baby` controls.
4. Reworked `Gaze` so it starts live patient gaze movement:
   - `src/gaze-controller.js` owns the live gaze timer,
   - `src/state.js` stores `isLiveMotionEnabled` and `gazeShiftTimerId`,
   - `src/eye-controller.js` composes `liveGazeOffset` into the visual transform.
5. Kept the diagnostic gaze pad separate:
   - `iris.gazeOffset` is the diagnostic pad offset,
   - `iris.liveGazeOffset` is only ambient/live motion.
6. Restored gaze pad snap-back to primary gaze on pointer release.
7. Updated output writing to ignore live gaze movement and other ambient motion.
8. Replaced large `Cover` eye-scene pills with smaller Fundal-style `RE`/`LE` overlays.
9. Verified in the Codex in-app browser:
   - `Gaze` on animates eyes,
   - gaze pad stays visible,
   - results remain `RE: normal | LE: normal` when no diagnostic offset is set,
   - `Gaze` off resets live movement.
10. Earlier refactor work remains in place:

- `src/sim-core.js`,
- `src/preset-runner.js`,
- `src/analysis-core.js`,
- `src/mcq-data.js`,
- focused runtime modules under `src/`,
- `script.js` as bootstrap-only wiring.

## Key Runtime Behaviour

1. `src/state.js` owns shared mutable runtime state.
2. `src/output-writer.js` owns RE/LE token output composition from stored offsets.
3. `src/eye-controller.js` owns drag/slider/fade wrappers and visual transform composition.
4. `src/gaze-controller.js` owns the diagnostic gaze pad and live gaze movement.
5. `src/light-controller.js` owns torch/RAPD/ambient pupil dynamics.
6. `src/cover-controller.js` owns cover state and fixation handover timing.
7. `src/eye-effects-controller.js` owns blink, micro, cyclo and nystagmus loops.
8. `src/controls-controller.js` owns front controls, advanced controls and preset apply.
9. `src/ui-shell.js` owns sidebar and info popup behaviour.
10. `script.js` only bootstraps module init and compatibility globals.
11. `analysis.js` parses hidden RE/LE lines and renders interpretation.
12. `mcq.js` owns quiz state and marking.

## Open Follow-Up

1. Optional: keep refining exact Fundal-style proportions for the eye scene at 360x740.
2. Optional: split remaining `analysis.js` render/rule blocks into smaller modules.
3. Optional: add browser smoke checks for:
   - preset apply,
   - manual edit clears hints,
   - MCQ open/answer/next,
   - live gaze on/off,
   - analysis show/hide.
