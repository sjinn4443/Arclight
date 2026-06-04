# Product Context

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
   - brisk swing,
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
