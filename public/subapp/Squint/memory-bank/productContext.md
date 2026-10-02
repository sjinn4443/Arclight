# Product Context

Advanced dependency and preset-finding follow-up, 24 July 2026: controls now reveal their dependency rather than appearing simultaneously actionable. Direct alignment drag and conjugate gaze teaching are described as separate interactions. The safer neutral observation describes selected urgency context rather than implying assessment. Preset search improves access to the 68-condition catalogue without flattening its teaching hierarchy.

Result and Advanced-panel clarity follow-up, 24 July 2026: the result now distinguishes the persistent alignment pattern from transient examination observations. Friendly neutral wording avoids exposing internal token language and clearing a released-cover note on a later gaze action avoids merging two examination moments. The Advanced panel favours readable names, explicit laterality and clear grouping while preserving the compact black and yellow simulator identity.

Gaze-tracker UI follow-up, 24 July 2026: the clearer name, live direction pill and target-style puck make the tracker’s purpose and state visible without adding instructions. Yellow graded muscle feedback links the tracker to the Squint identity while the RE/LE examination order remains intact.

Torch and ambient-light follow-up, 24 July 2026: the lower examination torch now traverses its full track and its illumination strength follows the control position rather than jumping to near-full strength beside the centre. The separate top ambient-light control uses a downward-facing ceiling-light bulb symbol, reducing label competition and clarifying that the two controls have different purposes. Accessible names remain textual.

Interaction and teaching review, 24 July 2026: Near now shows the physiological triad more faithfully through pupil constriction and a small visual convergence movement. The swinging light moves steadily rather than abruptly. Cover controls distinguish manifest re-fixation, dissociated drift and recovery. Generic manual pupil edits remove stale named-condition physiology.

Eye-scene UI correction, 24 July 2026: the Near stimulus remains a momentary examination control but now sits neatly beneath the torch. The cover test again uses an unmistakable circular paddle so the teaching action is visually separate from the eye itself.

Condition-logic correction, 24 July 2026: the product now distinguishes a finding from a diagnosis more carefully. Esotropia requires demonstrated abduction deficit or specific preset context before a 6th nerve label, miosis does not by itself establish Horner syndrome and small anisocoria prompts light, dark, reaction and stability checks. The compact `Near` control lets the pupil presets demonstrate rather than merely claim a near response.

Review correction, 23 July 2026: accessibility refinements preserve the same teaching workflow. Keyboard users can operate diagnostic gaze and swinging light without adding persistent clinical state, while screen readers receive cover-state changes.

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

`Squint` is a rapid visual teaching tool for ocular alignment, ptosis and pupil-sign interpretation.

## Core User Goals

1. Match observed eye findings quickly with a visual simulator.
2. Get a concise likely pattern output for RE and LE.
3. Learn by cycling through graded preset sets.
4. Test recall and triage via short MCQ rounds.
5. Practise torch/RAPD technique with equal timing between eyes.
6. See a patient-like live gaze behaviour without changing diagnostic output.

## UX Intent

1. Keep the eye simulator central, large and touch-friendly.
2. Keep the first page focused on the highest-value controls: `Gaze`, `Dilated`, `Baby` and `Adv`.
3. Keep low-frequency clinical detail in `Adv` so the front page is not cluttered.
4. Use the Fundal Reflex visual language for consistency across Arclight apps.
5. Keep text concise and clinically recognisable.
6. Support low-friction teaching flow:
   - observe,
   - match,
   - interpret,
   - test.
7. Keep swinging-light behaviour realistic enough for teaching:
   - steady equal-timed swing,
   - short settle,
   - visible effect of prolonged hold.

## Gaze Intent

1. `Gaze` switch: starts patient-like live eye movement copied from the Fundal Reflex behaviour.
2. Gaze track pad: records diagnostic gaze position and muscle activation.
3. Live movement must not alter RE/LE motility output.
4. Track pad movement must snap back to primary when released.

## Clinical Output Intent

1. Prefer simple wording where possible.
2. Escalate urgency only when pattern and modifiers justify it.
3. Preserve uncertainty language (`possible`/`probable`) where needed.
4. Avoid stale preset over-labelling after manual edits.
5. Keep wording concise and plain even when advanced logic is active.

# Fleet upgrade note — 23 July 2026

The initial normal scene is an intentional teaching baseline rather than an unassessed patient record. Session reset restores that scene deliberately.

## MCQ review experience — 26 July 2026

Incomplete attempts must not reveal partial correctness. Completed attempts should present the result before answer rationales and source status, then offer tier-preserving retry. Clinical sign-off remains separate from engineering consistency.
