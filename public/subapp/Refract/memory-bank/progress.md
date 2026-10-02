# Progress

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests. Prescribing sources and the supplied editable chart are unchanged; both bundles were rebuilt with locked esbuild 0.25.5.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Targeted loading improvements — 30 September 2026

Initial CSS now hides cylinder and axis fields in the existing default simple mode before JavaScript arrives. The Advanced control still reveals them normally. With the app bundle delayed by one second, mobile CLS fell from 0.17910 to 0.00009. Mobile Lighthouse: 88 → 97/100 in separate same-day lab runs. No prescribing weights, engine, original data or flowchart changes.

All nine main-page views at 360 x 740, 768 x 1024 and 1366 x 900 have no horizontal overflow or captured runtime errors. Targeted workflows pass over HTTP, direct-file and installed offline use. Amsler exports with patient/date metadata and a drawn grid mark pass first/repeated Download and mocked native Share; a deliberately failed library fetch recovers on retry. Allan full teaching-card variants and drawer thumbnails pass; Refract simple/advanced fields and completed output pass. These checks preserve functionality but do not claim exhaustive workflow or physical-device acceptance.

Full images and the export library remain precached for offline use, so the startup savings do not describe total offline installation traffic. Local asset queries and app-scoped caches were bumped. Browser tests use temporary viewports. The three retained preview tabs were each verified through real browser chrome at 360 x 740 after switching away and back; their intended loadingFix=20260930 URLs were re-read. Each started at 843 x 1192. Refract is the final selected preview. See [the scoped evidence receipt](../../LOADING_IMPROVEMENTS_20260930.md). This section supersedes the earlier three loading priorities, not the historical clinical review.

## Performance review — 30 September 2026

Both canonical production bundles minified. The fleet build now includes the MCQ bundle. Clinical weights, engine source, original data and flowchart are unchanged. Initial-load layout shift remains a separate optimisation opportunity. Shipped JavaScript: app 72,303 → 34,132 bytes; MCQ 21,153 → 15,096 bytes. Mobile Lighthouse performance: 85 → 88/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Main mobile spacing reduced to accommodate enlarged inputs; advanced-fields control clarified; wider input/results columns added. Engine and flowchart unchanged.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## 30 September 2026 — direct learned prescriptions, no promotion

- Completed 52 fitted models plus comparator, with 20 repeats of six grouped outer folds and four inner folds. Both eyes remain together.
- Corrected learned-only agreement: 57.92% within `0.25 D`, 84.25% within `0.50 D`, mean `0.33307 D`, maximum `3.50 D`. Existing engine: 75%/91.67%, mean `0.16104 D`, maximum `1.00 D`; selected in all 120 outer folds.
- Independent verifier passes 240 selector checks, 4,800 transpose-eye checks, 4,800 symmetry-eye checks, 2,400 case scores, 396 tree nodes, 59 ridge fits and 40 repeat summaries. Original workbook and 15 protected production/data/chart hashes unchanged.
- Initial study invalidated by numeric-text age parsing; preserved with `INVALID.md`. Corrected protocol and fresh manifest freeze preceded rerun. All 60 ages now correctly represented; production unaffected.
- Existing app/MCQ, prescribing, context UI, weighted rules, 740 safety checks and bundle parity pass. Optional browser output-fit test blocked at launch by sandbox `EPERM`; no new visual/mobile claim.
- No app or flowchart update justified. Report: `outputs/direct-learning-corrected-20260930/report.md`. Internal historical evaluation only, not independent clinical validation.

## 30 September 2026 — source audit and coupled study, no promotion

- Original Excel unchanged; 1,740 compared values match CSV, including cases 14, 19 and 22.
- Nine predeclared candidates tested. Baseline selected in all 120 training folds; 1,200 withheld outputs exactly unchanged. Scores remain 45/60 within `0.25 D` and 55/60 within `0.50 D`.
- Passed 1,080 independent scoring checks, 1,080 transposition checks, 1,080 symmetry checks, 120 selection checks and 153 safety checks. Fifteen production/data/chart files unchanged.
- Existing MCQ/app, prescribing, context UI, weighted-rule, 740 target-safety and bundle-parity tests pass; parity required an authorised rerun after a sandbox subprocess restriction.
- No promotion or app/flowchart changes. Remaining misses analysed in `outputs/coupled-calibration-20260930/miss-analysis.json`; report in the same folder. Internal evaluation only, not independent clinical validation. No new browser/mobile or physical-device claim.

## 30 September 2026 — offline calibration, no promotion

- Completed 379 bounded parameter variants with 20 repeats of six-fold case-grouped cross-validation. Both eyes stay together but longitudinal patient identifiers are unavailable. All 60 held-out prescriptions are unchanged in every repeat; all cases have prior development use, so this is internal evaluation rather than independent validation.
- Baseline: both eyes within `0.25 D` in 45/60 case records (75%) and within `0.50 D` in 55/60 (91.7%); mean worse-eye maximum meridional difference `0.1610 D`.
- Best full-data candidate C011 changes only `largeStepRamp` from `1` to `1.5`: 46/60 (76.7%) within `0.25 D`, 55/60 within `0.50 D` and mean `0.1527 D`. Only case 6 LE and case 18 LE improve; all other 118 eye prescriptions are unchanged. There is no hidden better-eye regression and no demonstrated held-out gain.
- Health weighting remains frozen because only one record is positive. Recorded 15 source hashes and passed 4,927 synthetic candidate-fixture checks. These are engineering checks, not clinical acceptance.
- App logic, flowchart and original workbook/case data are unchanged. Recommendation: do not promote C011; audit source cases 14, 19 and 22, then seek separate approval for a coupled sphere, cylinder and axis study.
- Evidence: `outputs/calibration-20260930/report.md`, `outputs/calibration-20260930/Refract-calibration.xlsx` and `outputs/calibration-20260930/results.json`. No new browser, mobile, physical-device or clinical verification is claimed.

## 30 September 2026 — numerical weights on the flowchart

Added the requested source-derived numeric weights panel beside the opening decisions and promoted the reviewed editable chart. All 69 original nodes and 92 connectors are unchanged; total is now 70 nodes. Eight validator self-tests, geometry checks and 22 semantic examples pass. Draw.io review at 50% and 70% confirmed the panel is readable with no text clipping or route collision; screenshot saved in `outputs/weighted-20260930/visible-weights-drawio.png`. Prescribing source and bundle hashes are unchanged. No workbook or app changes, clinical sign-off or physical-device acceptance claimed.

## 30 September 2026 — visible mobile correction

The visible Refract tab was found at 1365 x 1192 after the earlier hand-off. Corrected through the personal skill script to 360 x 740 with matching weighted3 URL after a real switch to the chart and back. Hardened the workspace helper against hidden/ambiguous controls and same-tab switch checks; stricter helper live verification remains pending because the user switched chats. This does not invalidate the successful personal-script size correction. No prescribing code or page layout changed.

## 30 September 2026 — bounded weighted engine

- Final `weighted3` release fixes clipped output digits without changing field geometry or calculation. All 4,000 signed quarter-step display-fit fixtures pass. Final asset loading and clean HTTP console were confirmed in the Codex app tab. Fresh persistent real-toolbar verification passed after the user returned to this chat: exact weighted3 URL and 360 x 740 before, after and after switching to the diagram and back.
- Promoted the visually reviewed 69-node, 92-connector weighted flowchart to `Refract-integrated-flowchart.drawio`. All 18 catalogue IDs are covered, geometry checks report no crossings/shared segments and readable-zoom draw.io review covered branch labels, outside bypasses and distinct result-box ports. The former main chart is preserved in the weighted baseline folder. The chart remains one editable diagram without lettered circles, with white background and hidden sidebars.
- Rebuilt the production bundle and passed the complete npm test suite, including exact source/bundle parity and 740 fractional-target safety checks. The bias clamp fix preserves all 60 recorded case outputs exactly. HTTP review has no captured console errors; isolated direct-file core calculation works with the recorded MCQ/font-preload CORS limitations. See `WEIGHTED_RULE_ENGINE_2026-09-30.md` for current evidence and acceptance boundaries.
- Implemented the authorised weighted policy in `src/weighted-prescribing.js` while preserving the public engine API and old ordered engine for comparison. Production and frozen candidate outputs match on all 60 recorded cases.
- Added explicit per-eye quality, calm and tri-state returning/new-to-practice semantics. Missing quality uses the existing switch; zero is low confidence. Familiarity is not first glasses, satisfaction or accuracy.
- Rejected a replay-improving but non-monotonic intermediate sphere rule and an abrupt large-change threshold. The accepted step cap grows progressively above a `1.25 D` sphere gap and retains the high-sphere and discrepancy safeguards.
- Mean worse-eye meridional error: `0.18531 → 0.16104 D` (`13.1%` lower). Maximum: `1.63951 → 1.00000 D`. Both eyes ≤`0.25 D`: 45/60 unchanged; ≤`0.50 D`: 54 → 55/60. Literal full matches remain 29/60; RE 43/60, LE 41/60 and add 52/60.
- Three cases improve, one worsens slightly and 56 are unchanged. Case 57 loses a previous literal full match through a `5°` RE axis difference (`0.04358 D` optical error). This regression is explicitly retained in the evidence.
- Repeat-off mean error is `0.16031 D`, slightly better than repeat-on. The user-authored familiarity weight is not empirically validated by this dataset.
- Passed 29,649 offline checks including 29,520 controlled spherical quality probes. Independent testing reports no worse sphere transitions in its grid but 431 worse complete-lens and 222 worse cylinder transitions among 56,160 adjacent-quality comparisons. The inherited reduced-cylinder policy prevents a claim of global optical monotonicity.
- Evidence: `outputs/weighted-20260930/experiment.json`, `research-report.json` and `independent-review.json`. These are same-data development checks, not held-out accuracy, clinical approval or physical-device acceptance. Current HTTP/file and retained-browser evidence belongs to the implementation hand-off.

## 29 September 2026 — explicit rule engine

Implemented and tested authorised prescribing revision: complete-case agreement 24 → 29/60, exact eyes 72 → 84/120 and add 52/60 unchanged. No original data changes or lost previous complete matches. 960 modifier combinations, 60 transpose/symmetry/determinism checks, bundle parity and isolated 360 x 740 browser checks pass. Workbook contains ordered rules, parameters, original cases and differences. See `RULE_ENGINE_2026-09-29.md` for caveats and source questions. Clinical approval, native Excel and physical-device acceptance remain unverified; persistent Codex toolbar script could not locate the window.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. Refract logic remains deliberately outside the current clinical-audit programme. This entry records a documentation and popup-date update only. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: off-white `#f5f8ff` on a blue appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

## What Works

- Static single-page UI with `Current`, `Objective`, and `Output` sections
- App bar with burger menu, info popup, and MCQ drawer shell
- Top controls split into `Age`, `Patient`, and `Mode`
- Spinner-based entry for age, sphere, cylinder, axis, and add
- Long-press acceleration for age and axis spinners
- Parameterized component-weighted prescription logic
- Objective sphere offset, cylinder reduction, and axis rounding rules
- Age-based reading add calculation with `health?` adjustment
- Fallback to current LE add when age is missing
- Simple mode that hides cylinder/axis fields and applies best mean sphere
- Shared signed-field rendering for both editable and output fields
- Single transpose controller path with section normalization
- Orange background state for low-risk near-plano outputs outside precise mode
- Layered CSS and split JS modules for maintainability
- Local documentation via `README.md` and `memory-bank/`
- Separate live heuristic and benchmark workbook engine paths
- Local audit and calibration-generation tooling in `tools/`
- Local heuristic fitter in `tools/fit-prescription-config.mjs`
- Local workbook action-analysis and ordered-rule tooling in `tools/lib/workbook-analysis.mjs`, `tools/extract-workbook-actions.mjs`, `tools/learn-workbook-rules.mjs`, and `tools/study-workbook-ceiling.mjs`

## What's Left To Build

- Extract generalized rules from the Allan workbook into `src/prescription-logic.js`
- Improve sphere, cylinder, axis, and add behavior until the heuristic audit is materially closer to the benchmark
- Formal automated tests for calculation rules and key UI regressions
- Real behavior for the MCQ drawer buttons, if they are meant to be more than placeholder UI
- Optional accessibility review for popup, drawer, and spinner controls
- Optional packaging/vendoring if full offline dependency independence is needed

## Current Status

Core functionality is present, locally runnable, and significantly easier to maintain than before the refactor. The live app is back on a heuristic-only runtime path, the benchmark engine preserves exact `60/60` workbook replay, and the fitted fixed-input heuristic audit currently sits at `24/60` full-case matches against the workbook, with `39/60` right eyes, `33/60` left eyes, and `52/60` adds matching.

The new action-level rule studies suggest the current bottleneck is not simply “missing calm/repeat in the app.” On leave-one-out ordered-rule tests, full workbook features score about the same as simplified features, which points more toward regime structure and target decomposition than toward restoring removed workbook columns.

## Known Issues

- There is still no formal automated test suite
- Runtime fonts and icons depend on remote CDNs
- DOM structure and field IDs still matter heavily because recalculation is DOM-driven
- The heuristic rules still underfit the workbook benchmark substantially
- The workbook calibration is generated benchmark data, so regeneration needs to stay in sync with the local workbook export
- Some workbook rows appear internally inconsistent or plausibly mis-entered, so rule extraction needs an explicit anti-overfitting bias
- The component-weighted engine still lacks enough inputs to explain every workbook add / distance-vs-near decision
- The current ordered-rule learner is analytical tooling, not yet the live engine

## Evolution of Decisions

- Kept the project fully static to minimize friction
- Moved from large script files to focused ES modules
- Moved from duplicated sign-handling logic to one shared sign system
- Split the stylesheet into smaller concern-based files
- Kept the mobile-first, one-page layout instead of expanding into a larger multi-panel UI
- Moved the spreadsheet-derived calibration layer out of the live runtime path and into benchmark-only tooling

# 23 July 2026 fleet upgrade

- Preserved the full heuristic and 60/60 benchmark replay boundaries.
- Localised fonts and transpose icon, restored browser zoom and added two-press case reset.
- Added manifest, service worker, build declaration and 5 passing contracts.
- Exact `360 x 740` Chrome/CDP screenshots now pass over HTTP and direct-file routes for untouched, dense, completed, transpose, guide, drawer and reset states. Physical-device review remains outstanding.

## Information popup consistency — 23 July 2026

- Added an effective `44 x 44px` guide close target.
- Added the shared `version · date` line.
- Preserved prescription conversion, heuristic logic and report wording.

## Information-card typography and fit — 23 July 2026

- Applied the shared popup type hierarchy.
- Verified a `352.4px` card at `360 x 740` with no internal scrolling.
- Standardised the simple visible `v1` label and `23/7/2026` date in the shared bottom-right footer position.

- Verified the standard sidebar hierarchy, focus entry and Escape focus return at `360 x 740`.
- Replaced the MCQ button facade with three tested levels, shuffled retry sets, answer-required grading, progressive unlocking and explicit Advanced-pass Cup protection.

## Maintenance refactor — 26 July 2026

- Removed duplicate prescription recalculation on `change`.
- Removed confirmed orphan selectors.
- Rebuilt `app.bundle.js` and passed contracts plus exact bundle parity.
- Preserved the separate MCQ runtime, calculation rules and layout.

## App-bar information glyph — 26 July 2026

- [x] Removed the obsolete circular outline.
- [x] Standardised the visible `i` at `21px`.
- [x] Matched the glyph colour to Refract's blue app-bar accent.
- [x] Retained the `44 x 44px` touch target and Refract app-bar geometry.
- [x] Added a contract protecting the glyph size and absence of the old ring.

## MCQ quality — 26 July 2026

- [x] Audited all 38 authored questions and added stable IDs, rationales, sources and review states.
- [x] Removed app-interface mechanics from the question bank.
- [x] Added unanswered-focus, result-review and retry contracts.
- [x] Rebuilt assets and passed `npm test` with exact bundle parity.
- [x] Replaced repeated or interface-facing items at Primary 03, Primary 09 and Advanced 16 without changing bank sizes.
- [x] Passed the isolated HTTP MCQ path at temporary `360 x 740` with screenshots, 44px rows, no horizontal overflow and no browser errors.
- [ ] Independent clinical sign-off, physical-device review and installed offline review.

## Lighthouse accessibility remediation - 27 July 2026

- [x] Removed focusable descendants from the closed accessibility tree by applying `inert`.
- [x] Preserved opening, Escape closure and burger-focus return.
- [x] Rebuilt the bundle and confirmed exact source parity.
- [x] Passed contracts and isolated `360 x 740` browser review.
- [x] Improved Lighthouse accessibility from `94` to `100`; repeat layout shift is zero.
- [ ] Independent clinical sign-off, physical-device review and first-install offline review remain external.
