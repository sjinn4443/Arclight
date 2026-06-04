# Progress

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

## Completed

1. Reworked app to shared Arclight visual style.
2. Added structured sidebar flows for presets and MCQ levels.
3. Expanded preset library to 30 conditions.
4. Added preset hint tokens for nuanced disambiguation.
5. Added improved analysis recognition for hinted patterns:
   - pupil-sparing 3rd,
   - partial 6th small/medium,
   - myasthenic,
   - thyroid restrictive,
   - INO-like.
6. Added preset-name flash overlay above eye simulator.
7. Added context modifiers:
   - Sudden,
   - Pain/HA,
   - Trauma,
   - Diplopia,
   - Head tilt,
   - Tired.
8. Added staged refactor parity harness and baseline output files.
9. Refactor split completed:
   - `src/sim-core.js`,
   - `src/preset-runner.js`,
   - `src/analysis-core.js`,
   - `src/mcq-data.js`,
   - `src/state.js`,
   - `src/output-writer.js`,
   - `src/eye-controller.js`,
   - `src/gaze-controller.js`,
   - `src/controls-controller.js`,
   - `src/ui-shell.js`,
   - `script.js` reduced to bootstrap-only.
10. Further split eye runtime into:

- `src/light-controller.js` for torch/RAPD/ambient,
- `src/cover-controller.js` for cover/fixation handover,
- `src/eye-effects-controller.js` for blink/micro/cyclo/nystagmus loops.

11. Added compact ambient light control in the eye card.
12. Swinging-light model updated to:

- brisk side transfer around 0.3-0.8s,
- around 3s stabilisation behaviour,
- mild pupillary escape after longer holds over 4s.

13. Reworked main page hierarchy for 360x740:

- `Gaze`,
- `Dilated`,
- `Baby`,
- `Adv`.

14. Moved advanced details behind `Adv`, including iris colour, pupil size, fade, upper lid, nystagmus and cyclo.
15. Copied Fundal Reflex-style live gaze movement into Squint.
16. Separated live motion from diagnostic gaze:

- `liveGazeOffset` drives visual movement,
- `gazeOffset` remains the diagnostic pad offset.

17. Updated output writing so ambient/live motion does not cause false RE/LE findings.
18. Shrunk eye-scene cover controls to compact `RE`/`LE` overlays, following the lighter Fundal in-stage control pattern.
19. Fixed logic audit issues:

- RAPD light response now matches RE/LE output labelling,
- Adie's preset injects a diagnostic hint,
- unilateral pinhole pupils are no longer ignored,
- MCQ wording now matches current pupil and cyclo logic,
- gaze track pad snaps back to primary on release.

20. Restored momentary torch behaviour: dragged light pill snaps back to centre and turns off on release.

## Current Quality Snapshot

1. Syntax checks pass across all JS modules.
2. Refactor parity check passes against the refreshed 68-preset baseline.
3. In-app browser check passed for `Gaze` on/off:
   - eyes animate when enabled,
   - gaze pad remains visible,
   - output stays neutral without diagnostic offset,
   - live motion resets when disabled.
4. Refactor parity baseline remains available through `node qa-refactor-check.cjs check`.

## Next Useful Refactors

1. Split remaining `analysis.js` rule/render blocks into smaller modules.
2. Add lightweight browser smoke checks for:
   - preset apply,
   - manual edit clears hints,
   - MCQ open/answer/next,
   - live gaze on/off.
