# System Patterns

## Dependency and preset-filter pattern

- `syncNystagmusControls()` applies native disabled state, `aria-disabled` and a quiet visual card state to Direction, Waveform and Rate.
- Manual Nystagmus changes, resets and preset application all resynchronise the dependent controls.
- Preset search operates on the rendered buttons and never changes `CONDITION_LIBRARY`.
- Search opens only matching folders, keeps Alignment / palsy and Pupil grouping and restores the previous details state when cleared.
- Escape clears an active filter before the sidebar Escape handler closes the drawer.
- The match count is a polite live status and the search input retains a 44px mobile target.

## Result and Advanced-panel clarity pattern

- The result renders Pattern and Observations as separate rows.
- A neutral internal token pair is presented as `No alignment pattern detected.` rather than exposed as `nil | nil`.
- A non-primary gaze action clears a released-cover observation only when no eye remains covered. Active cover observations remain intact.
- Advanced controls retain their established IDs and values. Context, Movement and Pupils / lids provide the presentation hierarchy.
- Examiner-facing RE is screen-left and LE is screen-right. Upper-lid controls expose those labels directly.
- Movement selects stack their labels above the control at mobile width so full names remain visible without horizontal overflow.

## Gaze-tracker presentation pattern

- `#gaze-status` displays the direction already produced by `GazeController` and returns to `Primary` on release.
- The target puck remains positioned only through the existing neutral guide and `--gaze-thumb-x/y` values.
- Muscle activation retains the existing `--act` magnitude and threshold classes. CSS changes only its palette to the app accent.
- UI checks require the target to align with the app’s asymmetric primary-gaze neutral point rather than the geometric centre.

## Examination-light motion pattern

- Pointer drag writes `lightPillPos` directly so the torch remains attached to the user.
- Tap and keyboard changes animate `lightPillPos` with a 700ms full-track ease and transfer `activeLightSide` at the midpoint.
- Illumination and pupil stimulus use smoothstep gain over each half-track: zero at centre, approximately half at the midpoint towards an eye and full only at the relevant end.
- Release, Escape, blur or a second same-side tap animates the torch back to `0.5` and clears the active side.
- Reduced-motion preference shortens the transition without removing state feedback.
- Ambient illumination remains a separate switch with a downward-facing local decorative SVG and the textual accessible name `Ambient light`.

## Interaction-state safety pattern

- `nearOffset` is visual-only and is deliberately excluded from `OutputWriter.getDiagnosticOffset`.
- Manual pupil-size edits call `resetPupilPhysiology()` before output recalculation. Dilated is a display-only overlay: it never resets pupil physiology, RAPD, preset hints or slider values.
- Cover handover corrects alignment relative to the gaze target, not gaze itself. Each cover change invalidates queued fixation callbacks. Torch afferent drive is zero for the covered eye.
- Vertical phoria is a relative-eye deviation with opposite covered-eye drift on alternate fixation. Generic decompensating hyper/hypophoria is RE-referenced; DVD remains dissociated upward drift of either eye.
- Cover timing follows the visible 1080ms occluder settle and `coverObservation` distinguishes cover-uncover, alternate cover, under-cover drift and uncover.
- Torch visual movement and physiological side transfer use separate timings.

## Eye-scene control layout pattern

- The torch remains the primary pupil stimulus and occupies the centred track.
- `Near` is a small secondary control centred immediately below that track.
- Cover controls retain the compact RE/LE buttons but the active occluder is a distinct circular paddle outside the clipped eyelid aperture.
- Browser review protects centring, control separation, circular geometry and stage containment at `360 x 740`.

## Condition interpretation safety pattern

- Generic alignment and pupil findings remain descriptive.
- Named 3rd, 4th and 6th nerve, Horner, Adie, Argyll Robertson, pharmacological and traumatic patterns use explicit `hint:*` context.
- Specific pupil hints suppress conflicting generic anisocoria notes.
- Torch, cover, gaze and `Near` are examination controls and retain the active preset context.
- Dynamic teaching signs use visual offsets or classes that do not contaminate the primary-alignment output.
- `tests/condition-audit.mjs` records all 68 preset outputs and separately checks the dynamic behaviours at `360 x 740`.

## Eye-engine consistency pattern

- Examiner-facing display order is screen-left patient RE and screen-right patient LE.
- Internal DOM eye keys remain `left` and `right`; presentation labels, accessibility names and readout order translate them to RE and LE.
- Off and centred light controls use a neutral treatment. The yellow accent is reserved for active illumination.
- Toggle-like teaching controls expose `aria-pressed` and keep it synchronised through manual actions, presets and reset.

Review correction, 23 July 2026: momentary pointer behaviour is mirrored for keyboard users. Arrow keys drive gaze and swinging light while held, then release back to primary gaze or torch-off. Cover buttons synchronise visual state with `aria-pressed`. MCQ focus restoration captures its return target before clearing state.

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

1. Gaze examination pad writes to `iris.gazeOffset` and updates `AppState.state.gazeVector` while pressed.
2. Live `Gaze` switch writes to `iris.liveGazeOffset` and CSS face-pose variables.
3. `src/eye-controller.js` composes both offsets visually.
4. Releasing the gaze pad resets it to primary gaze.
5. `src/output-writer.js` excludes ordinary `gazeOffset` from primary-position alignment.
6. Manual iris drag, preset offsets and established cover displacement remain diagnostic inputs.
7. Preset-specific profiles still alter `gazeOffset` so restriction, underaction, upshoot and A/V-pattern change remain visible.
8. Live gaze timers are cleared and offsets reset when `Gaze` is disabled.
9. Baby mode restarts live gaze timing so the movement cadence matches the scaled eye state.
10. Focused gaze-pad arrow keys use the same examination vector path and return to primary gaze on key release.

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
   - `NEAR`,
   - `RAPD:RE+|LE+`.
5. optional preset disambiguation token `hint:*`

Ordinary trackpad gaze, live motion, micro jitter and transient CSS movement are visual-only and do not enter primary-alignment output. Comparative gaze sampling may still add an A/V-pattern cue.

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
7. Focused light-control arrow keys are also momentary and release to the centred torch-off state.

## Refactor Safety Pattern

1. `qa-refactor-check.cjs` provides baseline parity checks.
2. Refactor stages run:
   - syntax checks,
   - parity check with `node qa-refactor-check.cjs check`,
   - local HTTP or in-app browser reachability.

# Fleet upgrade note — 23 July 2026

Keep all simulator mathematics in the existing focused controllers. Offline support uses the app-scoped `squint-` cache namespace and reset is an independent two-press UI action.

## Maintenance pattern — 26 July 2026

- Treat `squint:outputs-updated` as the analysis refresh contract.
- Avoid periodic DOM polling and duplicate delayed refreshes.
- Preserve the ordered classic scripts because they support direct-file use and explicit ownership.

- Keep each MCQ's stable `squint-{tier}-{NN}` ID, one keyed answer, rationale, known source and explicit review status.
- In cover-test questions, state fixation, the eye covered or uncovered and the movement being interpreted.
- Collect all answers before applying any grading state. Show result, explanations and sources before retry.
