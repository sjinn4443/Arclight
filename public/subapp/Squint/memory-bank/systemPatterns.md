# System Patterns

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

## UI Pattern

1. Fixed app bar:
   - left burger menu,
   - centred title,
   - right info icon.
2. Single-column, mobile-first card stack for 360x740.
3. Front-page controls stay limited to `Gaze`, `Dilated`, `Baby` and `Adv`.
4. Eye simulator card stays central and follows the Fundal Reflex visual style.
5. Eye-scene controls should be small overlays with short labels where position provides context.
6. Diagnostic gaze track pad remains visible below the eye card.
7. Sidebar is the teaching/quiz command surface.

## State Pattern

In `src/state.js`:

1. `activePresetLevel`
2. `activeMcqLevel`
3. `isApplyingPreset`
4. `isBabyMode`
5. `isLiveMotionEnabled`
6. `gazeShiftTimerId`
7. `activeDiagnosticHints`
8. flash timers and shared colour state
9. torch/ambient state:
   - `activeLightSide`,
   - `lightPillPos`,
   - `rapdValue`,
   - `ambientLevel`.
10. gaze diagnostic state:

- `gazeDirection`,
- `gazeVector`,
- `gazePatternCue`,
- `gazeSamples`.

11. wrapped refs to:

- `SimCore`,
- `PresetRunner`.

In `mcq.js`:

1. `MCQ_STATE.level`
2. shuffled index arrays per level
3. current question index and answered flag

## Module Responsibility Pattern

1. `src/eye-controller.js`: eye drag, pupil/lid/fade control wrappers and transform orchestration.
2. `src/gaze-controller.js`: diagnostic gaze pad, muscle readout, named gaze positions and Fundal-style live gaze motion.
3. `src/light-controller.js`: torch pill, RAPD weighting, ambient light and pupil dynamics.
4. `src/cover-controller.js`: cover state and fixation handover timing.
5. `src/eye-effects-controller.js`: recurrent blink/micro/cyclo/nystagmus loops.
6. `src/controls-controller.js`: front controls, advanced controls and preset apply orchestration.
7. `src/output-writer.js`: RE/LE hidden output writes from stored simulator offsets.
8. `src/ui-shell.js`: sidebar/popup open-close and preset list rendering.
9. `script.js`: bootstraps all modules and exports compatibility hooks.

## Gaze Pattern

1. Diagnostic gaze pad writes to `iris.gazeOffset` and updates `AppState.state.gazeVector` while pressed.
2. Live `Gaze` switch writes to `iris.liveGazeOffset` and CSS face-pose variables.
3. `src/eye-controller.js` composes both offsets visually.
4. Releasing the diagnostic gaze pad resets it to primary gaze.
5. `src/output-writer.js` only reads diagnostic offsets for RE/LE motility text.
6. Live gaze timers are cleared and offsets reset when `Gaze` is disabled.
7. Baby mode restarts live gaze timing so the movement cadence matches the scaled eye state.

## Output Contract Pattern

Simulator writes RE/LE hidden text token streams:

1. motility/ptosis/pupil/faded tokens
2. timing token `SUDDEN`
3. modifier tokens:
   - `PAIN`,
   - `TRAUMA`,
   - `FATIGABLE`,
   - `DIPLOPIA`,
   - `HEADTILT:R|L`.
4. light tokens:
   - `LIGHT:RE|LE`,
   - `RAPD:RE+|LE+`.
5. optional preset disambiguation token `hint:*`

Live motion, micro jitter and transient CSS movement are visual-only and do not enter the output contract.

## Analysis Pattern

1. `analysis.js` listens for RE/LE output update events.
2. `AnalysisCore` provides pure helper logic.
3. Engine checks `hint:*` overrides first.
4. Then applies generic pattern rules.
5. Modifier summary/guidance is appended concisely.
6. 3rd/4th/6th labels map to CSS cue badges, not separate image cards.

## Interaction Safety Pattern

1. Manual diagnostic interaction clears preset hints to avoid stale labels.
2. Preset apply sets `isApplyingPreset` to preserve intended hint injection.
3. `Gaze` live motion is visual-only and must not clear preset hints.
4. Sidebar and popup close on `Escape`.
5. Swinging-light model uses:
   - brisk side transfer,
   - around 3 second stabilisation,
   - mild pupillary escape after longer sustained hold.
6. Dragging the light pill is momentary: releasing it snaps the pill back to centre and clears active torch light.

## Refactor Safety Pattern

1. `qa-refactor-check.cjs` provides baseline parity checks.
2. Refactor stages run:
   - syntax checks,
   - parity check with `node qa-refactor-check.cjs check`,
   - local HTTP or in-app browser reachability.
