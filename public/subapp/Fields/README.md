# Fields

<!-- APP-DOC-STATUS:START -->

## Current Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: blue `#2f80ff` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Last updated: 18/5/2026

One-page, mobile-first confrontation visual-field app for rapid bedside screening.

## Structure

- `home.html`: single-page UI and quick-guide popup.
- `styles.css`: mobile layout, hierarchy, responsive rules, pathway styling and status colours.
- `src/field-core.js`: shared eye-state and score helpers used by state, rules, summary and output.
- `src/state.js`: point state model (`R/?/W`), RAPD/onset/neuro/old modifiers, compact raw line and field shading.
- `src/rules/helpers.js`, `src/rules/anterior.js`, `src/rules/chiasmal.js`, `src/rules/posterior.js`: 18 rule families plus shared helpers.
- `src/rules.js`: compatibility entrypoint and load-order validation for rules modules.
- `src/summary.js`: priority ordering, overlap suppression and compact `Also:` output.
- `src/output-lesion-map.js`: lesion-site mapping text.
- `src/output.js`: simple/advanced wording, severity, hidden `Calc` readout and result rendering.
- `src/pathway.js`: visual pathway target mapping and red highlight activation.
- `src/mcq-data/core.js`, `src/mcq-data/library.js`, `src/mcq-data/sets.js`: split MCQ data parts.
- `src/mcq-data.js`: MCQ data aggregator and load-order validation.
- `src/mcq.js`: 3-level MCQs, teaching cards, grayscale SVG field snapshots and pathway mini-diagrams.
- `src/main.js`, `src/popup.js`: DOM wiring and popup behaviour.
- `qa-fields-audit.mjs`: full-state audit and regression suite.
- `qa-pathway-audit.mjs`: rendered pathway-target alignment audit.
- `qa-output-mode-audit.mjs`: simple vs advanced wording audit.
- `qa-mcq-audit.mjs`: MCQ structure, teaching-card semantics and pathway SVG mark audit.
- `qa-context-modifier-audit.mjs`: onset, stroke/HA, old known, night vision, flash/curtain and colour-fade source/severity audit.
- Audit report `.txt` files are generated on demand and are not kept in the handover folder.

## Run Locally

1. `python -m http.server 8080`
2. Open `http://127.0.0.1:8080/home.html`

## UI Baseline

The base design target is `360x740`.

1. Keep the app compact enough to avoid slight scroll in the base layout.
2. Context stays folded and low-priority unless the user opens it.
3. The field-entry stage is the main surface: mid grey, 12px radius, compact RAPD and no centre triangle.
4. Result and pathway cards use flatter 8px radius so they do not compete with the field stage.
5. Field quadrants stay neutral; state colour belongs to the score circles only.
6. Eye dividers are faint but visible across green, orange and red circle states.
7. The raw calculation string is hidden behind `Calc` and opens as an overlay, avoiding layout jump.
8. The quick-guide popup date sits at the bottom and currently reads `v1 - 18/5/2026`.
9. The MCQ modal follows the same quiet UI direction: white shell, compact rows, thin dividers and colour used only for selected or answer states.
10. Context is optional: field entry and result must remain usable when `Context None selected`; the pathway panel can stay muted until a field point changes.

## Core Behaviour

1. Primary line shows highest-priority family.
2. Secondary uncertainty uses `Also:` with a maximum of 2 alternatives for compact output.
3. Simple mode avoids specialist terms where possible.
4. Advanced mode keeps formal family labels.
5. Pathway diagram highlights likely segment(s) in red from family plus lesion text.
6. Core point-state symbols are native text: tick, `?` and `X`.

## Scope Decision

The named-condition set deliberately stops at the Classic 18 families. With 5 test points per eye and 3 states per point, adding extra named diagnoses would overfit a coarse confrontation screen. Keep additional nuance in RAPD, context modifiers, `Also:` alternatives and `Mixed/Unclassified`, not by expanding the family list.

## Result Colour Policy

1. `Green`: normal (`Full Fields of Vision`) only when no urgent context is active.
2. `Orange`: abnormal but not urgent.
3. `Red`: urgent context such as neuro flags, sudden onset or urgent lesion note.
4. Clinical modifiers adjust urgency and likely source hints; they do not rename posterior or chiasmal field patterns.
5. For single-eye anterior patterns, flash/curtain can prioritise a retinal headline and colour fade can prioritise optic-nerve highlighting.

## Rule Families

Priority order in `src/summary.js`:

1. `BinocularTotalLoss`
2. `MonocularTotalLoss`
3. `HomonymousHemianopia`
4. `HomonymousQuadrantanopiaTemporal`
5. `HomonymousQuadrantanopiaParietal`
6. `BitemporalHemianopia`
7. `BitemporalQuadrantanopia`
8. `AltitudinalHemianopia`
9. `TunnelVision`
10. `MonocularCentralScotoma`
11. `BilateralCentralScotoma`
12. `JunctionalScotoma`
13. `MonocularCecocentralLike`
14. `MonocularTemporalHemianopia`
15. `MonocularNasalHemianopia`
16. `GlaucomaSimple`
17. `BinasalHemianopia`
18. `MonocularOtherDefect`

## QA Commands

1. `npm run lint`
2. `npm run qa:fields`
3. `npm run qa:mcq`
4. `npm run qa:pathway`
5. `npm run qa:output`
6. `npm run qa:context`
7. `npm run qa:all`

Targeted syntax checks remain useful before commits:

1. `node --check src/field-core.js`
2. `node --check src/state.js`
3. `node --check src/rules.js`
4. `node --check src/rules/helpers.js`
5. `node --check src/rules/anterior.js`
6. `node --check src/rules/chiasmal.js`
7. `node --check src/rules/posterior.js`
8. `node --check src/summary.js`
9. `node --check src/output-lesion-map.js`
10. `node --check src/output.js`
11. `node --check src/pathway.js`
12. `node --check src/mcq-data/core.js`
13. `node --check src/mcq-data/library.js`
14. `node --check src/mcq-data/sets.js`
15. `node --check src/mcq-data.js`
16. `node --check src/mcq.js`
17. `node --check src/main.js`
18. `node --check qa-context-modifier-audit.mjs`

## Latest QA Snapshot

Recorded from the 10 May 2026 full audit:

1. Full matrix run: `59,049` states.
2. Regression suite: `15/15` passed.
3. Severity findings: `P0=0, P1=0, P2=0, P3=0`.
4. No policy findings detected.

Recorded from the 10 May 2026 MCQ audit:

1. Pattern bank: `26`.
2. Site bank: `19`.
3. Text MCQs: `15`; field-loss MCQs: `14`; pathway MCQs: `14`.
4. Teaching cards: `18`.
5. Semantic patterns audited: `25`.
6. Pathway SVG IDs: `29`; pathway marks checked: `112`.
7. Overall MCQ QA: `PASS`.

Additional May 2026 checks:

1. `node qa-pathway-audit.mjs`: `1,062,882` rendered combinations, no pathway alignment issues detected.
2. `node qa-output-mode-audit.mjs`: `17,006,112` simple/advanced comparisons, all outputs differed and no simple-only technical term cases were detected.
3. `node qa-context-modifier-audit.mjs`: `14` representative context cases, no source, severity or pathway target issues detected.
4. `npm run -s lint`: pass after the latest UI and documentation updates.
