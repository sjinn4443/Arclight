# Progress

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

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

- [x] 28 September 2026: eight authorised logic corrections implemented; 27 focused tests, 59,049 field combinations and 1,062,882 pathway combinations pass. See `../LOGIC_REVIEW_20260928.md`. Explicit completion replaces automatic normal assumptions. Clinical sign-off and physical-device acceptance remain pending.

- [x] RAPD follow-up: the unchanged `R / 0 / L` states are explicitly labelled beneath `0`; a dedicated top band gives every heading and quadrant marker at least `4.73px` circle clearance with zero control overlap at `360 x 740`.
- [x] Fleet edge follow-up: principal field, result and pathway panels use `10px` margins and `340px` width.
- [x] Fleet pathway follow-up: larger existing SVG, no false inner scrollbars and concise active localisation labels at `360 x 740`.
- [x] Safety follow-up: incomplete urgent context remains visible and unresolved parsing fails closed.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (23/7/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: blue `#2f80ff` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
- v1.1 engineering pass completed with explicit unassessed state, local runtime, reset, PWA support and refreshed verification.
<!-- APP-DOC-STATUS:END -->

Last updated: 23/7/2026

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
32. Added a pure UI assessment-state module so untouched controls no longer produce a normal patient conclusion.
33. Added `Mark all seen` and `Mark rest seen`; the latter preserves any assessed suspect or absent points.
34. Added a two-step `New` then `Clear?` examination reset that leaves teaching achievements and preferences intact.
35. Removed the remaining Google Fonts runtime request and retained the existing bundled Inter and Quicksand files.
36. Added manifest, app-scoped service worker and HTTP(S)-only registration while preserving direct-file operation.
37. Added dialog semantics, Escape handling, focus entry and focus return for the drawer and guide. Improved MCQ and pathway-image focus handling.
38. Added seven state-safety, runtime, accessibility and PWA contracts and repaired the local ESLint configuration.
39. Verified untouched, normal, partial, abnormal, reset, guide and offline states at `360 x 740` with zero console messages.
40. Restored the established defect-first workflow after user review: selecting suspect or absent now completes untouched points as seen and shows the result immediately, while a wholly untouched screen remains `Not assessed`.
41. Added explicit clinical-review and constrained-device records. Independent clinical sign-off and physical-device testing remain pending.
42. Enlarged the existing mobile pathway SVG from `72%` to `82%`, removed false internal scrollbar controls and kept all SVG paths, transforms and `part-*` IDs unchanged.
43. Reworked the existing bottom legend into concise dynamic labels which identify eye, hemisphere, radiation branch and V1 bank only when active.
44. Added five pure pathway-legend contracts and reviewed untouched, monocular, bitemporal, superior, inferior and homonymous states in the live app at `360 x 740`.
45. Preserved `Not assessed` for incomplete fields while surfacing the existing neuro, flash/curtain and sudden-onset urgent warnings beneath it.
46. Replaced the unresolved-parser normal fallback with `Unable to interpret`, caution styling, no pathway target and retention of any urgent context.
47. Added four output-safety contracts and live-checked incomplete urgent context in simple and advanced modes at `360 x 740`.

## Current Quality Snapshot

1. Matrix coverage: `59,049` states.
2. Regression suite: `15/15` passing.
3. Severity findings: `P0=0, P1=0, P2=0, P3=0`.
4. MCQ QA checks: pass, including `25` semantic patterns and `112` pathway marks.
5. Pathway audit: `1,062,882` rendered combinations, no alignment issues detected.
6. Output mode audit: `17,006,112` comparisons, all simple/advanced outputs differ.
7. Context modifier audit: `14` representative cases, no source, severity or pathway target issues detected.
8. Latest lint run after documentation and UI updates: pass.
9. Current contract suite: `17/17` pass.

## Next Useful Refactors

1. Extract family metadata into a shared config consumed by `summary`, `pathway` and audits.
2. Consider adding a maintained automated browser suite. The current v1.1 pass is documented Playwright evidence at `360 x 740`.
3. Update `qa-pathway-audit.mjs` so it can write the saved report artifact directly.

## Information popup consistency — 23 July 2026

- Added an effective `44 x 44px` modal close target.
- Standardised the guide version separator.
- Preserved field state, pathway SVG behaviour and result logic.

## Information-card typography and fit — 23 July 2026

- Applied the shared popup type hierarchy.
- Verified a `524px` card at `360 x 740` with no internal scrolling.
- Standardised the simple visible `v1` label and `23/7/2026` date in the shared bottom-right footer position.

## Main-page typography review — 23 July 2026

- Raised the smallest operational labels to `9.5–10px`.
- Verified zero RAPD, eye-name or quadrant-marker collisions at `360 x 740`.
- Lint and all targeted contract suites passed.

- Verified the standard sidebar hierarchy, focus entry and Escape focus return at `360 x 740`.
- Hardened the Cup pass contract without changing field entry, pathway logic or the existing 43-question QA bank.

## Refactor completion — 26 July 2026

- Centralised paired output and analysis refresh work behind one re-entry guard.
- Removed the duplicate result-mode input listener.
- Consolidated one proven adjacent duplicate CSS rule.
- Advanced changed asset and offline cache tokens together.
- Contracts, lint and targeted plus exhaustive non-browser audits passed. Independent clinical review and physical-device testing remain pending.

## MCQ clinical quality — 26 July 2026

- Audited all 43 questions across the three teaching sets and tiers.
- Added source metadata and concise rationales without merging the set purposes.
- Added fail-safe unanswered handling, correct/wrong review, result hierarchy, 44px rows and focused retry.
- Revised `tp3`, `tp4`, `pa3` and `pa4`; operational assessment logic was not changed.
- Replaced repeated Higher field and pathway items while preserving Text 5/5/5, Field 5/5/4 and Pathway 5/5/4 pools.
- Corrected globally duplicated pathway IDs and added global-ID plus exact stem/answer repetition guards.
- Verified mutually exclusive Submit/New Set actions, unanswered safety, rationale review, retry and Escape return at `360 x 740`.
- Captured three final MCQ screenshots with no overflow, overlap, console error or page error.
- Independent clinical review and physical-device testing remain pending.
