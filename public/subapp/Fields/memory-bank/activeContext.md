# Active Context

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

## Current Focus

Keep Fields compact, clinically clear and stable on the `360x740` base viewport.

1. Preserve the Fundal Reflex-inspired visual direction: quiet surfaces, clear state colour and compact controls.
2. Avoid slight scroll and layout jump on the base mobile screen.
3. Keep context folded by default and treat it as secondary to the field-entry stage.
4. Keep the interpreted result visible and stable even when wording length changes.
5. Keep the pathway diagram aligned with selected patterns and show the reference image only when the image button is used.

## Confirmed Working Repo

- `C:\Users\William\Desktop\Arclight App\Fields`

## Current Logic State

1. 18 defect families are modularised in:
   - `src/rules/helpers.js`
   - `src/rules/anterior.js`
   - `src/rules/chiasmal.js`
   - `src/rules/posterior.js`
2. `src/rules.js` is a compatibility and load-order validation entrypoint.
3. Priority ordering and overlap suppression remain in `src/summary.js`.
4. Secondary line uses `Also:` and is limited to a maximum of 2 alternatives.
5. `Mixed/Unclassified Field Defect` remains fallback only when no safe named family fits.
6. Scope decision: do not expand beyond the Classic 18 named families for this 5-point confrontation model; use RAPD, context modifiers, `Also:` and `Mixed/Unclassified` for nuance.
7. Shared helpers remain centralised in `src/field-core.js` and support non-browser audit contexts.
8. Repo-wide lint is configured via `eslint.config.mjs` and `npm run lint`.

## Output and UI State

1. Output is split:
   - `src/output-lesion-map.js`: lesion mapping text logic.
   - `src/output.js`: language modes, modifiers, severity, hidden `Calc` readout and rendering.
2. Result modes:
   - `Simple`: plain terms.
   - `Advanced`: formal terms.
3. Result status colour:
   - green normal,
   - orange caution,
   - red urgent.
4. Urgent colouring is triggered by sudden onset, neuro flags, flash/curtain or urgent lesion wording, even if the field pattern label is normal.
5. The raw calculation string is hidden behind `Calc` and opens as an overlay to avoid layout movement.
6. The field-entry stage uses a mid-grey background, compact RAPD and no central triangle.
7. Field quadrants stay neutral; score circles carry green, orange and red state colour.
8. Eye quadrant labels are deliberately low-key and dividers remain faint but visible.
9. The quick-guide popup uses bottom version text and now reads `v1 - 18/5/2026`.
10. MCQ modal styling should stay Fundal Reflex-like: white shell, compact rows, thin dividers and restrained colour only for selected/correct/wrong state.
11. Context is optional: field entry and result must stay active with `Context None selected`; only pathway remains muted until a field point changes.

## MCQ Data State

1. MCQ data is split into:
   - `src/mcq-data/core.js`
   - `src/mcq-data/library.js`
   - `src/mcq-data/sets.js`
2. `src/mcq-data.js` is an aggregator and load-order validator.
3. Teaching-card labels now align with current rule-engine output for the Classic 18 set.
4. Teaching mini field diagrams use fixed grayscale SVG field snapshots: white normal, grey suspect and black absent, with faint vertical and horizontal quadrant lines kept visible. Centre circles appear on every snapshot, sit above quadrant fills and use the same stroke weight as the quadrant lines.
5. `qa-mcq-audit.mjs` loads split data parts explicitly and checks quiz structure, teaching semantics and pathway SVG mark IDs.

## QA State

1. Full matrix audit: `59,049` states.
2. Regression suite: `15/15` pass.
3. Latest severity findings: `P0=0, P1=0, P2=0, P3=0`.
4. MCQ QA: pass with no structural, semantic or pathway-mark issues.
5. Output mode audit: `17,006,112` simple/advanced comparisons and all outputs differ.
6. Pathway audit: `1,062,882` rendered combinations and no alignment issues detected.
7. Context modifier audit: `14` representative cases covering onset, stroke/HA, old known, night vision, flash/curtain and colour fade, with no source, severity or pathway target issues.
8. Latest local lint after UI/documentation changes: pass.
