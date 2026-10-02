# Fields

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Runtime source retained. Ordered classic-script dependencies and report/quiz code must not be removed on the basis of initial-load coverage. Mobile Lighthouse performance: 85 → 86/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Clinical follow-up — 30 September 2026

Corrected the claim of current exhaustive output-mode coverage: 17,006,112 comparisons belong to historical evidence and the 28 September rerun did not complete. Production logic is unchanged in this follow-up. The current 28 contract/regression tests pass. The earlier 30 September review also checked all 59,049 completed field patterns for output integrity, not independent clinical correctness.

See [the repair receipt](../CLINICAL_LOGIC_FIXES_20260930.md). Independent clinical sign-off and physical-device acceptance remain pending. Earlier preservation statements refer to their dated work, not this authorised follow-up.

## Current fleet UI refinement receipt — 30 September 2026

Independent input/output columns on wider screens; mobile sequence retained with the original final-panel spacing.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Fleet repair receipt — 30 September 2026

Corrected the missing option index in pathway visual quizzes. Added coverage for all three authored tiers and restored the pinned local lint toolchain. Question content, answers and scoring are unchanged. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## Logic corrections — 28 September 2026

The approved logic review is implemented. Unentered points remain unassessed until individually entered or explicitly confirmed with `Mark rest seen`. Retinal detachment is suspected, not confirmed by field severity. Tunnel results name peripheral constriction rather than definite glaucoma. Bilateral total loss retains retinal, optic nerve and cortical possibilities. Clean homonymous defects no longer acquire a fabricated mixed alternative. Bitemporal loss retains its chiasmal interpretation with central involvement. Opposite altitudinal patterns describe and highlight both eyes. RAPD allows asymmetric bilateral disease and retinal as well as optic nerve involvement.

Evidence and limitations: see `LOGIC_REVIEW_20260928.md`. Independent clinical sign-off remains pending.

RAPD labelling follow-up, 23 July 2026: the existing `R / 0 / L` selector remains centred and its explicit `RAPD` label sits directly beneath `0`. A dedicated top band now separates the control, heading and quadrant-label rows from the original eye circles without moving labels sideways. At `360 x 740`, every heading and quadrant label clears both the RAPD group and circular outlines by at least `4.73px`; quadrant-label contrast is `0.72`. Selector state and assessment logic are unchanged.

Safety follow-up, 23 July 2026: urgent context now remains visible while the field is incomplete without presenting an assessment result. An unexpected parsing failure now fails closed as `Unable to interpret` rather than being converted to a normal result.

Fleet pathway follow-up, 23 July 2026: the existing visual pathway SVG is larger and clearer at `360 x 740`, its viewport no longer shows false scrollbar controls and the existing legend now identifies the highlighted eye, hemisphere, radiation branch and V1 bank. SVG geometry, `part-*` IDs, target mapping and clinical output are unchanged.

Fleet edge follow-up, 23 July 2026: the principal field, result and pathway panels use exact `10px` outer margins and `340px` width at `360 x 740`.

<!-- APP-DOC-STATUS:START -->

## Current Status (23/7/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: blue `#2f80ff` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
- Assessment safety: all ten points start unassessed. Selecting an abnormal point leaves other points untouched; `Mark rest seen` explicitly completes them.
- Runtime: local fonts and assets only. Direct-file use remains supported. Installable offline use is available over HTTP(S).
- Verification: `npm test` passes 17 contracts, lint and five established QA suites. The RAPD follow-up additionally passed live R, 0 and L state and ARIA checks at `360 x 740`.
<!-- APP-DOC-STATUS:END -->

Last updated: 23/7/2026

One-page, mobile-first confrontation visual-field app for rapid bedside screening.

## Structure

- `home.html`: single-page UI and quick-guide popup.
- `styles.css`: mobile layout, hierarchy, responsive rules, pathway styling and status colours.
- `src/field-core.js`: shared eye-state and score helpers used by state, rules, summary and output.
- `src/assessment-state.js`: pure unassessed/completion transition model. It does not alter the clinical `R/?/W` engine.
- `src/state.js`: point state model (`R/?/W`), RAPD/onset/neuro/old modifiers, compact raw line and field shading.
- `src/rules/helpers.js`, `src/rules/anterior.js`, `src/rules/chiasmal.js`, `src/rules/posterior.js`: 18 rule families plus shared helpers.
- `src/rules.js`: compatibility entrypoint and load-order validation for rules modules.
- `src/summary.js`: priority ordering, overlap suppression and compact `Also:` output.
- `src/output-lesion-map.js`: lesion-site mapping text.
- `src/output.js`: simple/advanced wording, severity, hidden `Calc` readout and result rendering.
- `src/pathway.js`: visual pathway target mapping, red highlight activation and pure concise-legend state.
- `src/mcq-data/core.js`, `src/mcq-data/library.js`, `src/mcq-data/sets.js`: split MCQ data parts.
- `src/mcq-data.js`: MCQ data aggregator and load-order validation.
- `src/mcq.js`: 3-level MCQs, teaching cards, grayscale SVG field snapshots and pathway mini-diagrams.
- `src/main.js`, `src/popup.js`: DOM wiring and popup behaviour.
- `manifest.webmanifest`, `service-worker.js`, `pwa-register.js`: app-scoped install and offline shell.
- `tests/`: state-safety, pathway-legend, runtime, accessibility and PWA contracts.
- `qa-fields-audit.mjs`: full-state audit and regression suite.
- `qa-pathway-audit.mjs`: rendered pathway-target alignment audit.
- `qa-output-mode-audit.mjs`: simple vs advanced wording audit.
- `qa-mcq-audit.mjs`: MCQ structure, teaching-card semantics and pathway SVG mark audit.
- `qa-context-modifier-audit.mjs`: onset, stroke/HA, old known, night vision, flash/curtain and colour-fade source/severity audit.
- Audit report `.txt` files are generated on demand and are not kept in the handover folder.

## Run Locally

Direct file:

1. Open `index.html`.
2. The assessment works without a network connection. Service-worker installation is unavailable on `file://` by browser design.

Local HTTP:

1. Run `python -m http.server 8080` from this folder.
2. Open `http://127.0.0.1:8080/home.html`.
3. The manifest and service worker provide the installable offline shell.

## UI Baseline

The base design target is `360x740`.

1. Keep the app compact enough to avoid slight scroll in the base layout.
2. Context stays folded and low-priority unless the user opens it.
3. The field-entry stage is the main surface: mid grey, 16px radius, compact RAPD and no centre triangle.
4. Result and pathway cards use a flatter 12px radius so they do not compete with the field stage. Controls use 10px or 8px where space is tight.
5. Field quadrants stay neutral; state colour belongs to the score circles only.
6. Eye dividers are faint but visible across green, orange and red circle states.
7. The raw calculation string is hidden behind `Calc` and opens as an overlay, avoiding layout jump.
8. The quick-guide popup date sits at the bottom and currently reads `v1.1 - 22/7/2026`.
9. The MCQ modal follows the same quiet UI direction: white shell, compact rows, thin dividers and colour used only for selected or answer states.
10. Context is optional: field entry remains usable when `Context None selected`. The pathway stays muted for incomplete or completed-normal fields. Complete the remaining points individually or use `Mark rest seen`.
11. The pathway viewport stays free of internal scrolling. Its existing bottom legend uses concise inactive labels and adds eye, hemisphere, radiation-branch and V1-bank detail only to active red labels.
12. An incomplete field remains headed `Not assessed`. Existing urgent context warnings still appear beneath it in red and do not unlock or highlight the pathway.

## Core Behaviour

1. Primary line shows highest-priority family.
2. Secondary uncertainty uses `Also:` with a maximum of 2 alternatives for compact output.
3. Simple mode avoids specialist terms where possible.
4. Advanced mode keeps formal family labels.
5. Pathway diagram highlights likely segment(s) in red from family plus lesion text. Its presentation legend describes the existing target selection without changing it.
6. Core point-state symbols are native text: tick, `?` and `X`.
7. Each point starts as unassessed. One tap records it as seen, then the established cycle continues to suspect, absent and seen.
8. Reaching suspect or absent does not record other points as normal. Confirm those observations separately.
9. `Mark all seen` records a normal examination efficiently. After any partial entry it becomes `Mark rest seen` and fills only untouched points.
10. `New` in the drawer uses the deliberate `New` then `Clear?` sequence and clears examination state without clearing MCQ achievements or preferences.
11. An unresolved internal interpretation stops at `Unable to interpret`; it never falls back to a normal field result.

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

1. `npm test` - contracts, lint and the complete existing audit set.
2. `npm run test:contracts`
3. `npm run lint`
4. `npm run qa:fields`
5. `npm run qa:mcq`
6. `npm run qa:pathway`
7. `npm run qa:output`
8. `npm run qa:context`
9. `npm run qa:all`

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

Recorded from the 22 July 2026 full audit:

1. Full matrix run: `59,049` states.
2. Regression suite: `15/15` passed.
3. Severity findings: `P0=0, P1=0, P2=0, P3=0`.
4. No policy findings detected.

Recorded from the 22 July 2026 MCQ audit:

1. Pattern bank: `26`.
2. Site bank: `19`.
3. Text MCQs: `15`; field-loss MCQs: `14`; pathway MCQs: `14`.
4. Teaching cards: `18`.
5. Semantic patterns audited: `25`.
6. Pathway SVG IDs: `29`; pathway marks checked: `112`.
7. Overall MCQ QA: `PASS`.

Additional 23 July 2026 checks:

1. `node qa-pathway-audit.mjs`: `1,062,882` rendered combinations, no pathway alignment issues detected.
2. `node qa-output-mode-audit.mjs`: `17,006,112` simple/advanced comparisons, all outputs differed and no simple-only technical term cases were detected.
3. `node qa-context-modifier-audit.mjs`: `14` representative context cases, no source, severity or pathway target issues detected.
4. `npm run -s lint`: pass after the latest UI and documentation updates.
5. `npm run test:contracts`: `17/17` pass, including five focused pathway-legend contracts and four fail-safe output contracts.
6. Browser review: untouched, incomplete urgent-context, monocular, bitemporal, superior quadrantanopia, inferior quadrantanopia and homonymous pathway states passed at `360 x 740`; the enlarged SVG, active legend and hidden overflow remained contained with zero console messages.

## Review Status

- Engineering review: complete for v1.1.
- Independent clinical sign-off: pending. Existing clinical rules and wording were not re-approved by this engineering pass.
- Physical-device review: pending. The constrained-device checklist records the external gate.
- Detailed evidence: `FIELDS_V1.1_EVIDENCE_RECEIPT.md`.

## Information popup consistency — 23 July 2026

The modal Quick Guide now uses an effective `44 x 44px` close target and the shared `version · date` presentation. Field-entry state, pathway logic and result wording are unchanged.

## Information-card typography and fit — 23 July 2026

The guide now uses the fleet scale of `14px` title, `12.5px` body, `11px` section labels and `10.5px` version text. It measured `524px` at `360 x 740` and required no internal scrolling. Its simple visible `v1` label and current `23/7/2026` date now occupy the shared bottom-right footer position.

## Main-page typography review — 23 July 2026

Compact field labels now use a controlled `9.5–10px` floor: quadrant legend `9.5px`, RAPD label `9.5px` and assessment, mode and onset controls `10px`. A measured `360 x 740` check found no overlap between RAPD, eye names or quadrant markers and no horizontal overflow. Field-entry and pathway logic are unchanged.

## Sidebar consistency — 23 July 2026

The blue identity and existing menu actions are unchanged. The drawer uses the fleet `14px` title, `11px` section-label and `12.5px` supporting-copy roles where present, with focus entry, Escape closure and trigger-focus return verified at `360 x 740`.

## MCQ consistency — 23 July 2026

The existing Primary, Intermediate and Advanced labels remain the fleet reference. Cup unlocking now requires explicit Advanced pass evidence rather than generic result text. At that stage the 43-question QA bank and field logic were unchanged.

## Output refresh refactor — 26 July 2026

Field, RAPD, context, completion, reset and result-mode changes now share one guarded `refreshAssessmentOutputs()` route. The result-mode checkbox listens to `change` only, preventing the former `input` plus `change` double render. One adjacent duplicate information-popup rule was consolidated. Script order, direct-file operation, field rules, output wording, pathway logic and the blue layout are unchanged.

Changed asset tokens and the Fields cache were advanced together. Contracts, lint, the 59,049-state field audit, the 1,062,882-case pathway audit and targeted output-safety checks passed. Independent clinical sign-off and physical-device acceptance remain pending.

## MCQ clinical-quality pass — 26 July 2026

The three teaching purposes remain separate: 15 text localisation questions, 14 field-pattern recognition questions and 14 pathway localisation questions. Stable question and option identities, concise rationales, source references and pending-review metadata are enforced across every set and level. `tp3`, `tp4`, `pa3` and `pa4` were narrowed so monocular retina-versus-optic-nerve localisation has discriminating clinical context rather than relying on RAPD alone. Repeated Primary-to-Intermediate field and pathway items were replaced with distinct supported patterns. Primary pathway IDs are now `pp1` to `pp5`, Higher pathway IDs are `ph1` to `ph5` and the audit rejects any global ID collision or exact stem-plus-answer repeat.

Unanswered attempts now fail before revealing any answer and focus the first missing row. Completed attempts show correct and selected wrong rows plus a rationale for every question. Submit and New Set are mutually exclusive. `New Set` creates a fresh attempt and returns focus to its first option. The result hierarchy, 44px option rows and compact modal are presentation-only changes. The operational field assessment, output rules, pathway highlighting and teaching-card classifications were not changed.

## Information purpose pass — 27 July 2026

The existing `i` panel now leads with the real bedside action: while the patient faces the user, the user tests one eye at a time and selects Seen, Suspect or Absent to match what the patient reports at each field point. It states that the app summarises the pattern but does not diagnose the cause. No field, pathway or context logic changed. The open panel passed the shared non-scrolling `360 x 740` review.

## Fleet UI alignment — 28 September 2026

The information card now uses a `16px` radius and a measured `44 x 44px` close target. Seven pixels of mobile document overflow were removed by tightening only the final panel spacing. Clean Chromium checks at `360 x 740` found an exact `360 x 740` document, no horizontal overflow, no information-card scrolling and no console errors. Field, pathway and context logic are unchanged. Physical-device acceptance and independent clinical sign-off remain pending.
