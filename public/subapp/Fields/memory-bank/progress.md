# Progress

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: blue `#2f80ff` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Last updated: 18/5/2026

## Completed

1. Refactored field logic into modular `src/` files and kept the one-page mobile UI.
2. Maintained 18-family rule engine with ranked summary output.
3. Tightened output compactness:
   - `Also:` is capped at 2 secondary alternatives.
4. Refreshed MCQs:
   - Primary wording simplified.
   - Intermediate and Advanced wording tightened.
5. Added dynamic result status colouring:
   - green normal,
   - orange caution,
   - red urgent.
6. Added `src/field-core.js` and refactored state/summary helpers around it.
7. Preserved audit-engine compatibility in non-browser VM contexts.
8. Added repo-wide ESLint setup and `npm run lint`.
9. Modularised rules into `src/rules/*.js`.
10. Split lesion mapping into `src/output-lesion-map.js`.
11. Split MCQ data into core, library and sets modules.
12. Updated loaders in `home.html` for split rules, output, pathway and MCQ data.
13. Added output mode and pathway alignment audits.
14. Applied Fundal Reflex-style UI direction to Fields:

- quieter cards,
- lower-key labels,
- compact context,
- mid-grey field stage.

15. Set the `360x740` viewport as the base layout target.
16. Removed the centre triangle between the eyes.
17. Made RAPD compact enough not to crowd the eye labels.
18. Restored neutral quadrant fills and kept green/orange/red state colour on the circles only.
19. Added faint horizontal and vertical eye dividers that remain visible on dark states.
20. Hid the raw calculation string behind a `Calc` button so the result row no longer truncates.
21. Kept result and pathway panels flatter than the field stage to clarify hierarchy.
22. Updated quick-guide popup date to `v1 - 18/5/2026`.
23. Aligned Classic 18 teaching-card names with current rule-engine classifications.
24. Updated MCQ and teaching mini field diagrams to use fixed grayscale SVG snapshots with white, grey and black field states plus visible quadrant dividers. Centre circles now appear on every snapshot, sit above quadrant fills and match the divider stroke weight.
25. Extended `qa-mcq-audit.mjs` to check teaching semantics and pathway SVG mark resolution.
26. Restyled the MCQ modal toward the Fundal Reflex look with a white shell, compact question rows and restrained option states.
27. Added `qa-context-modifier-audit.mjs` to verify onset, stroke/HA, old known, night vision, flash/curtain and colour-fade effects on severity, source and pathway highlighting.
28. Fixed result severity so urgent context is not hidden by an otherwise normal field label.
29. Added npm QA scripts for the full audit set.
30. Made context optional again: field entry and result no longer stay washed out when `Context None selected`; pathway remains muted until a field point changes.
31. Confirmed the product scope decision to keep named families at the Classic 18 rather than adding extra diagnoses beyond the resolution of the 5-point screen.

## Current Quality Snapshot

1. Matrix coverage: `59,049` states.
2. Regression suite: `15/15` passing.
3. Severity findings: `P0=0, P1=0, P2=0, P3=0`.
4. MCQ QA checks: pass, including `25` semantic patterns and `112` pathway marks.
5. Pathway audit: `1,062,882` rendered combinations, no alignment issues detected.
6. Output mode audit: `17,006,112` comparisons, all simple/advanced outputs differ.
7. Context modifier audit: `14` representative cases, no source, severity or pathway target issues detected.
8. Latest lint run after documentation and UI updates: pass.

## Next Useful Refactors

1. Extract family metadata into a shared config consumed by `summary`, `pathway` and audits.
2. Add automated UI smoke checks at `360x740` and `390x844`.
3. Update `qa-pathway-audit.mjs` so it can write the saved report artifact directly.
