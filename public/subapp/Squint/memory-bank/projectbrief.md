# Project Brief

Advanced dependency and preset-finding follow-up, 24 July 2026: show dependent nystagmus settings only as actionable when Nystagmus is on, distinguish direct alignment drag from conjugate gaze teaching, use neutral wording that does not imply assessment and make the 68 presets searchable without changing their identity, order or level.

Result and Advanced-panel clarity follow-up, 24 July 2026: use friendly neutral output, keep persistent alignment findings separate from transient examination observations and prevent a released-cover note carrying into a later gaze action. Make Advanced controls legible and explicitly lateralised at `360 x 740` while preserving all control IDs, values, clinical rules, simulator maths and eye geometry.

Gaze-tracker UI follow-up, 24 July 2026: name the control by its teaching purpose, expose the existing direction state and make the draggable target and active muscle feedback obvious at mobile size. Preserve RE/LE order, tracker geometry and all gaze calculations.

Torch and ambient-light follow-up, 24 July 2026: keep ambient room illumination distinct from the examination torch. Use a downward-facing accessible ceiling-light symbol for ambient light and make torch motion and illumination strength follow the full control path smoothly. Do not change pupil physiology, eye geometry or diagnostic interpretation.

Interaction and teaching review, 24 July 2026: preserve the compact eye stage while making the cover sequence, Near response, torch timing and hidden pupil state clinically coherent. Visual convergence must remain separate from primary-alignment diagnosis. Generic edits must not inherit named-condition physiology and all urgency wording must retain appropriate uncertainty.

Eye-scene UI correction, 24 July 2026: preserve the compact eye stage while keeping Near visually subordinate to the torch and making the cover paddle visibly circular.

Condition-logic correction, 24 July 2026: preserve the direct-drag muscle teaching workflow while requiring sufficient context for named diagnoses. Specific presets may demonstrate characteristic dynamic signs, but the app must retain uncertainty wording and must not imply clinical approval from engineering consistency.

Review correction, 23 July 2026: the compact mobile simulator now has reliable MCQ focus return, collision-free preset notices, larger touch targets and keyboard-equivalent momentary controls. Clinical teaching behaviour is unchanged.

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

Deliver and maintain a one-page squint teaching app that is:

1. fast on low-resource mobile devices,
2. clear for frontline non-specialist use,
3. clinically useful for common ocular-motility and pupil patterns first,
4. transparent about uncertainty and overlap patterns,
5. teachable with graded preset sets and MCQs,
6. visually consistent with the Fundal Reflex app where the same Arclight design language applies,
7. maintainable via clear simulator-output-analysis boundaries.

# Fleet upgrade note — 23 July 2026

Squint remains a teaching simulator. The fleet pass changes engineering resilience and presentation only, not clinical simulation behaviour.

## MCQ quality boundary — 26 July 2026

The teaching bank may clarify an ambiguous prompt and add review evidence, but must not alter the 68 presets, simulator calculations, analysis thresholds, attempt sizes, pass marks or Cup rules.
