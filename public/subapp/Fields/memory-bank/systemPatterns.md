# System Patterns

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (22/7/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: blue `#2f80ff` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
- v1.1 separates UI assessment completion from the unchanged clinical state codes.
<!-- APP-DOC-STATUS:END -->

Last updated: 22/7/2026

## Architecture Pattern

Static one-page app with clear separation:

1. `src/field-core.js`: shared parsing and score helpers.
2. `src/assessment-state.js`: pure UI completion state and transitions.
3. `src/state.js`: DOM interaction state, raw string output and translation to clinical point codes.
4. Rules are modular:
   - `src/rules/helpers.js`,
   - `src/rules/anterior.js`,
   - `src/rules/chiasmal.js`,
   - `src/rules/posterior.js`.
5. `src/rules.js`: compatibility and load-order guard for modular rules.
6. `src/summary.js`: prioritisation, suppression and secondary alternative policy.
7. Output is split:
   - `src/output-lesion-map.js` for lesion phrasing,
   - `src/output.js` for mode, severity, `Calc` and render orchestration.
8. MCQ data is split:
   - `src/mcq-data/core.js`,
   - `src/mcq-data/library.js`,
   - `src/mcq-data/sets.js`,
   - `src/mcq-data.js` aggregator.
9. `src/pathway.js`: pathway target mapping and legend activation.
10. `src/popup.js` plus `src/main.js`: UI plumbing.
11. `manifest.webmanifest`, `service-worker.js` and `pwa-register.js`: app-scoped offline shell.

Audit and quality layer:

1. `qa-fields-audit.mjs`: full matrix, policy checks and regression suite.
2. `qa-mcq-audit.mjs`: MCQ structure and semantic checks.
3. `qa-pathway-audit.mjs`: rendered pathway alignment checks.
4. `qa-output-mode-audit.mjs`: simple vs advanced wording comparison.
5. `qa-context-modifier-audit.mjs`: context modifier source, severity and pathway-target checks.

## Interaction Pattern

1. Every test point starts `unassessed`, then cycles `seen -> suspect -> absent -> seen`.
2. UI state key is canonical (`dataset.state`), not parsed from colours.
3. Logic code map per point is `R`, `?`, `W`.
4. Core state symbol display uses native text glyphs instead of icon-font class swapping.
5. RAPD is a compact three-position control.
6. Context modifiers are folded by default, optional and use class-driven active states.
7. Field entry and result stay available when no context modifier is selected.
8. Result interpretation waits for all ten points. The pathway stays muted when unassessed or completed normal.
9. The raw calculation string is hidden and shown only through `Calc`.
10. `Mark rest seen` changes only unassessed points.
11. `New` then `Clear?` resets examination state without touching MCQ progress.

## Logic Pattern

1. Rule family matching happens in `src/rules/*.js` (`check*` functions).
2. Summary ranking in `src/summary.js` promotes common/high-yield families first.
3. Overlap suppression removes incompatible alternatives.
4. Fuzzy cases keep `Also:` where safe with up to 2 alternatives.
5. If no safe named family fits an abnormal state, use `Mixed/Unclassified Field Defect`.
6. The Classic 18 is the intended ceiling for named families in this app; RAPD and context can shift source confidence without creating more condition labels.

## Audit Pattern

Per state (`59,049` total):

1. Run all 18 rule families and track raw overlaps.
2. Generate summary text and capture primary family.
3. Track family-level raw matches, primary matches and shown mentions.
4. Apply policy checks for known overcalls.
5. Run fixed regression scenarios before report generation.

Additional audits:

1. Pathway target audit renders `1,062,882` condition/RAPD/modifier combinations.
2. Output mode audit compares `17,006,112` simple/advanced outputs.
3. MCQ audit checks structure, teaching cards and semantic pattern mapping.
4. Context modifier audit checks representative onset, stroke/HA, old known, night vision, flash/curtain and colour-fade cases.

## Language and Severity Pattern

1. `src/output.js` provides simple vs advanced wording transforms.
2. Simple mode suppresses specialist terms where possible.
3. Result severity classes are applied at render time:
   - `status-normal`,
   - `status-caution`,
   - `status-urgent`.
4. Urgent status is driven by sudden onset, neuro flags, flash/curtain or urgent lesion wording.
5. Urgent context takes priority over a normal field label, so a normal field screen can still show urgent status if red-flag history is selected.
6. Context modifiers can shift likely anterior source highlighting, but posterior and chiasmal field patterns stay anatomically anchored.

## UI Pattern

1. Fixed app bar.
2. Optional instruction legend.
3. Folded context bar.
4. Dual-eye input panel with:
   - mid-grey stage,
   - neutral quadrant fills,
   - coloured score circles,
   - faint eye dividers,
   - compact RAPD,
   - no centre triangle.
5. Result card with:
   - interpreted family label,
   - lesion guidance text,
   - `Calc` button for the raw string,
   - simple/advanced toggle.
6. Pathway panel:
   - SVG segment highlighting in red,
   - matching text legend segment highlighting,
   - reference image hidden until the image button is clicked.
7. Result and pathway cards use flatter radius than the main field stage.

## Refresh routing — 26 July 2026

- All user-driven paired output and analysis updates call `refreshAssessmentOutputs()`.
- The guard prevents re-entrant refresh work.
- Result language mode uses one `change` listener. Label buttons call the same handler directly.
- Keep classic-script order unchanged for direct-file support.

## MCQ content contract

- Keep text localisation, field-pattern recognition and pathway localisation as distinct sets.
- Question IDs remain authored IDs. Option IDs combine question and semantic option keys so shuffling does not change identity.
- Every question requires a rationale, source IDs and pending review status.
- Check completeness before applying any correct or wrong review state.
- Treat question IDs as globally unique across all authored sets and tiers.
- Reject exact stem-plus-answer repetition across the full bank.
- Keep Primary, Intermediate and Advanced pools progressive while preserving the distinct Text, Field and Pathway teaching purposes.
- Show Submit before grading and one New Set action after completion. New Set clears review and focuses its first input.
