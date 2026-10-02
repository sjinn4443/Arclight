# Active Context

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Runtime source retained. Ordered classic-script dependencies and report/quiz code must not be removed on the basis of initial-load coverage. Mobile Lighthouse performance: 85 → 86/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Clinical follow-up — 30 September 2026

Corrected the claim of current exhaustive output-mode coverage: 17,006,112 comparisons belong to historical evidence and the 28 September rerun did not complete. Production logic is unchanged in this follow-up. The current 28 contract/regression tests pass. The earlier 30 September review also checked all 59,049 completed field patterns for output integrity, not independent clinical correctness.

Current receipt: `../../CLINICAL_LOGIC_FIXES_20260930.md`. Independent clinical sign-off and physical-device acceptance remain pending. Treat older dated entries as historical.

## Current fleet UI refinement receipt — 30 September 2026

Independent input/output columns on wider screens; mobile sequence retained with the original final-panel spacing.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Fleet repair receipt — 30 September 2026

Corrected the missing option index in pathway visual quizzes. Added coverage for all three authored tiers and restored the pinned local lint toolchain. Question content, answers and scoring are unchanged. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

28 September 2026: approved logic corrections supersede the July auto-completion behaviour. Never infer that untouched points were seen when a defect is selected. Use explicit `Mark rest seen`. Keep disease suggestions separate from field-pattern confidence. See `../LOGIC_REVIEW_20260928.md` for all eight corrections and verification limitations. Preserve the compact UI and existing field code cycle.

RAPD labelling follow-up, 23 July 2026: retain the established `82px` `R / 0 / L` selector and its logic. The visible `RAPD` label belongs directly beneath `0`. At mobile widths use the dedicated top band and separate heading, upper-label and lower-label spacing rather than moving labels sideways. At `360 x 740`, minimum circle clearance is `4.73px`, IT/IN clearance is `5.57–6.07px` and control overlap is zero.

Safety follow-up, 23 July 2026: incomplete assessment still reads `Not assessed`, but existing neuro, flash/curtain and sudden-onset warnings remain visible and urgent. An unresolved parser state now stops at `Unable to interpret` rather than falling through to normal.

Fleet pathway follow-up, 23 July 2026: the existing visual pathway SVG now renders at about `260 x 125px` inside its `340px` panel at `360 x 740`. The viewport has no internal scrollbar controls and the existing legend adds eye, hemisphere, radiation-branch and V1-bank specificity to active red labels. SVG geometry, `part-*` IDs, target mapping and clinical output remain unchanged.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (23/7/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: blue `#2f80ff` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
- v1.1 safety state: field points start unassessed. A suspect or absent selection completes the untouched remainder as seen and restores live results while the clinical `R/?/W` engine remains unchanged.
- Runtime and evidence: local fonts only, scoped PWA shell, two-step examination reset and a passing `npm test` run with 17 contracts.
<!-- APP-DOC-STATUS:END -->

Last updated: 23/7/2026

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
9. `src/assessment-state.js` owns the pure unassessed-to-assessed transition. The rule modules still receive only `R`, `?` and `W` after completion.

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
9. The quick-guide popup uses bottom version text and now reads `v1.1 - 22/7/2026`.
10. MCQ modal styling should stay Fundal Reflex-like: white shell, compact rows, thin dividers and restrained colour only for selected/correct/wrong state.
11. Context is optional. A wholly untouched field shows `Not assessed`; `Mark all seen` completes a normal examination.
12. Defect-first entry is live: reaching suspect or absent completes the untouched remainder as seen and immediately interprets the established `R/?/W` state.
13. `Mark rest seen` remains available after seen-only partial entry and fills only unassessed points.
14. `New` then `Clear?` clears examination selections without clearing teaching achievements or stored mode preferences.
15. Menu, MCQ, guide and pathway-image surfaces return focus appropriately and respond to Escape where applicable.
16. The pathway canvas uses `82%` of the mobile viewport width, the viewport clips rather than scrolls and the existing legend stays on one rendered line in the reviewed states.
17. Active pathway legend labels are presentation-only: examples include `RE Retina`, `Chiasm`, `L Meyer`, `L Parietal`, `L lower V1` and `L upper V1`.
18. Incomplete field state and urgent context are deliberately separated: the heading stays neutral `Not assessed` while the existing urgent context note is red and announced politely.
19. Unexpected interpretation failure is fail-closed: `Unable to interpret`, no pathway target and no normal conclusion.

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
9. v1.1 contracts: `17/17` pass, including five focused pathway-legend contracts and four output-safety contracts.
10. Browser review at `360 x 740`: untouched, incomplete urgent context, monocular, bitemporal, superior, inferior and homonymous pathway states passed with a contained one-line legend and zero console messages.
11. Independent clinical sign-off and physical-device testing remain pending.

## MCQ consistency status — 23 July 2026

The existing Primary, Intermediate and Advanced bank remains unchanged. Cup unlocking requires explicit Advanced pass evidence rather than generic result text. The full contracts, lint and QA suite passed, including 17,006,112 simple-versus-advanced output comparisons.

## Current refactor status — 26 July 2026

Repeated `updateOutput()` plus `updateAnalysisOutput()` call pairs have one guarded refresh route. Result-mode double dispatch was removed and the adjacent duplicate information-popup rule was consolidated without changing geometry. Current contracts, lint, field, pathway, MCQ and context checks pass. Clinical logic and clinical review status are unchanged.

## MCQ pass — 26 July 2026

The 15 text, 14 field-pattern and 14 pathway-localisation questions retain separate teaching purposes. Every question now carries a rationale, source IDs and pending-review status. Four ambiguous monocular localisation items were narrowed with discriminating context. The operational five-point assessment and pathway engine remain unchanged.

Final review removes Primary-to-Intermediate repeats in the Field and Pathway sets. Pathway IDs are globally unique as `pp1` to `pp5`, `ph1` to `ph5` and `pa1` to `pa4`. QA now rejects any global ID collision or exact stem-plus-answer repetition. Submit and New Set alternate cleanly. Isolated `360 x 740` browser checks passed unanswered, completed review, retry, Escape, overflow, overlap and zero-error checks.
