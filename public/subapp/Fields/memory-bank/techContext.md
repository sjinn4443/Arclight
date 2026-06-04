# Tech Context

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

## Runtime

1. Browser-only app with no backend.
2. Vanilla JavaScript plus static HTML/CSS.
3. Shared cross-file helper module: `src/field-core.js`.
4. External UI assets:
   - Google Fonts (`Quicksand`)
   - Font Awesome icons
5. Core field-state symbols are native text-rendered so core interaction remains clear if icon CSS fails.

## Local Run

1. `python -m http.server 8080`
2. Open `http://127.0.0.1:8080/home.html`

## Quality Commands

Syntax:

1. `node --check src/field-core.js`
2. `node --check src/state.js`
3. `node --check src/rules/helpers.js`
4. `node --check src/rules/anterior.js`
5. `node --check src/rules/chiasmal.js`
6. `node --check src/rules/posterior.js`
7. `node --check src/rules.js`
8. `node --check src/summary.js`
9. `node --check src/output-lesion-map.js`
10. `node --check src/output.js`
11. `node --check src/pathway.js`
12. `node --check src/mcq-data/core.js`
13. `node --check src/mcq-data/library.js`
14. `node --check src/mcq-data/sets.js`
15. `node --check src/mcq-data.js`
16. `node --check src/popup.js`
17. `node --check src/main.js`
18. `npm run lint`
19. `node --check qa-fields-audit.mjs`
20. `node --check qa-mcq-audit.mjs`
21. `node --check qa-pathway-audit.mjs`
22. `node --check qa-output-mode-audit.mjs`
23. `node --check qa-context-modifier-audit.mjs`

Full audits:

1. `npm run qa:fields`
2. `npm run qa:mcq`
3. `npm run qa:pathway`
4. `npm run qa:output`
5. `npm run qa:context`
6. `npm run qa:all`

## Audit Output Model

`qa-fields-audit.mjs` reports:

1. Full matrix coverage (`59,049` states).
2. Family catalogue with 18 priority-ordered families.
3. Family metrics:
   - raw rule hits,
   - primary output hits,
   - shown mentions.
4. Top overlap pairs.
5. Regression suite pass/fail.
6. Severity findings (`P0-P3`).
7. Secondary-line prevalence (`Summary with "Also" states`).

Clinical scope:

1. The 18-family catalogue is a deliberate product boundary for the 5-point confrontation model.
2. New nuance should be added through context modifiers, RAPD, source confidence and uncertainty text rather than extra named field families.

Generated output files:

1. Audit `.txt` outputs are regenerated on demand by the QA scripts.
2. The handover folder does not keep stale generated report files.

Current note:

1. `qa-pathway-audit.mjs` currently reports to stdout only. On 10 May 2026 it rendered `1,062,882` combinations and detected no pathway alignment issues.
2. `qa-context-modifier-audit.mjs` verifies that context flags affect urgency, likely anterior source and pathway targets without relabelling posterior or chiasmal field families.

## Browser UI Checks

Use `360x740` as the base smoke viewport. Check:

1. no slight page scroll when context is folded,
2. no result-card jump when wording changes,
3. `Calc` opens without moving layout,
4. context buttons do not distort,
5. field entry remains active with `Context None selected`,
6. pathway reference image appears only after the image button is clicked.
