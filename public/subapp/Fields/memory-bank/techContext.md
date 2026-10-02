# Tech Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (22/7/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: blue `#2f80ff` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
- Runtime assets are local. The HTTP(S) route adds a scoped service worker while `file://` remains functional without registration.
<!-- APP-DOC-STATUS:END -->

Last updated: 22/7/2026

## Runtime

1. Browser-only app with no backend.
2. Vanilla JavaScript plus static HTML/CSS.
3. Shared cross-file helper module: `src/field-core.js`.
4. Local UI assets:
   - variable Inter WOFF2,
   - Quicksand 700 WOFF2,
   - local WebP teaching and reference images,
   - native CSS and text icons.
5. No normal runtime CDN request is required.
6. Core field-state symbols are native text-rendered.
7. `manifest.webmanifest` and `service-worker.js` provide an app-scoped offline shell over HTTP(S).
8. `pwa-register.js` deliberately does nothing on `file://`.

## Local Run

1. `python -m http.server 8080`
2. Open `http://127.0.0.1:8080/home.html`
3. Direct-file route: open `index.html` without a server.

## Quality Commands

Syntax:

1. `node --check src/field-core.js`
2. `node --check src/assessment-state.js`
3. `node --check src/state.js`
4. `node --check src/rules/helpers.js`
5. `node --check src/rules/anterior.js`
6. `node --check src/rules/chiasmal.js`
7. `node --check src/rules/posterior.js`
8. `node --check src/rules.js`
9. `node --check src/summary.js`
10. `node --check src/output-lesion-map.js`
11. `node --check src/output.js`
12. `node --check src/pathway.js`
13. `node --check src/mcq-data/core.js`
14. `node --check src/mcq-data/library.js`
15. `node --check src/mcq-data/sets.js`
16. `node --check src/mcq-data.js`
17. `node --check src/popup.js`
18. `node --check src/main.js`
19. `npm run lint`
20. `node --check qa-fields-audit.mjs`
21. `node --check qa-mcq-audit.mjs`
22. `node --check qa-pathway-audit.mjs`
23. `node --check qa-output-mode-audit.mjs`
24. `node --check qa-context-modifier-audit.mjs`

Full audits:

1. `npm run qa:fields`
2. `npm run qa:mcq`
3. `npm run qa:pathway`
4. `npm run qa:output`
5. `npm run qa:context`
6. `npm run qa:all`
7. `npm test` runs contracts, lint and the full audit set.

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

1. `qa-pathway-audit.mjs` currently reports to stdout only. On 22 July 2026 it rendered `1,062,882` combinations and detected no pathway alignment issues.
2. `qa-context-modifier-audit.mjs` verifies that context flags affect urgency, likely anterior source and pathway targets without relabelling posterior or chiasmal field families.

## Browser UI Checks

Use `360x740` as the base smoke viewport. Check:

1. no slight page scroll when context is folded,
2. no result-card jump when wording changes,
3. `Calc` opens without moving layout,
4. context buttons do not distort,
5. field entry remains active with `Context None selected`,
6. pathway reference image appears only after the image button is clicked.
7. untouched points and output read unassessed,
8. `Mark all seen` restores the established normal layout,
9. partial entry stays unassessed and `Mark rest seen` preserves existing abnormal selections,
10. two-step New reset clears examination state,
11. offline reload succeeds under service-worker control.

## Refactor verification — 26 July 2026

The changed stylesheet, state, output and main scripts use the shared `20260726-refactor1` browser token and Fields cache identity. Run `npm test` for contracts, ESLint and exhaustive QA. No bundler was introduced and classic-script direct-file operation remains required.

The final MCQ stylesheet and classic scripts use `20260726-mcq2` with the same app-scoped cache identity. `npm run qa:mcq` validates global IDs, no exact stem-plus-answer repetition, unique options, source metadata, rationales, field-pattern semantics and pathway SVG references. The recorded sources are the 2023 chiasmal and retrochiasmal visual-loss review and the 2021 primary visual-pathway imaging review. Current results: lint, contract suites and MCQ QA pass. The pathway audit rendered 1,062,882 combinations without alignment issues. Isolated browser evidence is under `output/playwright/mcq-quality/`.
