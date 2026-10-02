# Active Context

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

## Fleet repair receipt — 30 September 2026

Contained the quiz within the mobile screen and corrected its opening-focus timing. Built the existing MCQ controller as a separate classic bundle so direct-file use works. Prescribing logic, weights, cases and the flowchart are untouched. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Direct learning completed — 30 September 2026

The approved direct input-to-output experiment is complete: 52 fitted ridge/tree models plus the existing comparator. Corrected learned-only excluded-case rates are 57.92% within `0.25 D` and 84.25% within `0.50 D`, mean worse-eye disagreement `0.33307 D`. Baseline stays 75%/91.67%, mean `0.16104 D`; selected in all 120 outer folds. No promotion or production/chart/data changes. Evidence: `outputs/direct-learning-corrected-20260930/report.md`, `results.json` and passing `verification.json`. Initial age-text parsing bug is preserved in the invalid earlier study; production age handling was unaffected. Verification covers all ages, independent lens scoring, ridge fits, tree support, grouped nested selection, symmetry and transposition. Existing logic and bundle parity pass; browser output-fit launch blocked by sandbox `EPERM`. No new mobile/browser or clinical acceptance. This family failed, not the principle of learning input-to-output rules. Case-similarity learning remains a possible separately approved next experiment.

## Coupled study completed — 30 September 2026

Source audit: all 1,740 compared original Excel values match the CSV. Cases 14, 19 and 22, including plus-cylinder entries, are genuine source values rather than CSV transcription errors. Nine predeclared coupled candidates failed promotion: baseline selected in all 120 folds and all 1,200 withheld outputs unchanged. Both-eye agreement stays 75% within `0.25 D` and 91.7% within `0.50 D`. App, bundle, main chart and source data are unchanged. Evidence and remaining 15 misses: `outputs/coupled-calibration-20260930/report.md`, `verification.json` and `miss-analysis.json`. Earlier recommendation to audit these cases and study coupling is now completed. Next proposal requires separate approval: an interpretable data-fitted conditional model with regularisation, preserved guards and a fresh predeclared evaluation. Do not call development agreement clinical accuracy or independent validation. No browser was opened or new retained-toolbar/physical-device acceptance established in this offline study.

## Offline calibration completed — 30 September 2026

The 379-variant offline experiment is complete; no candidate was promoted. App logic, flowchart and original workbook/case data are unchanged. Baseline case-level agreement is 45/60 (75%) with both eyes within `0.25 D` and 55/60 (91.7%) within `0.50 D`; mean worse-eye maximum meridional difference is `0.1610 D`.

C011 changes only `largeStepRamp: 1 → 1.5`. Its full-data fit gives 46/60 (76.7%) within `0.25 D`, 55/60 within `0.50 D` and mean `0.1527 D`. Case 6 LE and case 18 LE improve; all other 118 eye prescriptions are unchanged. Across 20 repeats of six-fold case-grouped cross-validation, all 60 held-out prescriptions remain unchanged in every repeat. Both eyes stay together but longitudinal patient identifiers are unavailable. Do not present the full-fit gain as predictive improvement. All 60 cases have prior development use, so even this held-out procedure is internal evaluation, not independent validation.

Health is frozen with only one positive record. Evidence includes 15 source hashes and 4,927 passing synthetic candidate-fixture checks in `outputs/calibration-20260930/`, with `report.md`, `Refract-calibration.xlsx` and `results.json` as the hand-off artefacts. Recommendation: no promotion; audit source cases 14, 19 and 22 before a separately approved coupled-component study. No new browser, mobile, physical-device or clinical verification was performed for this offline task. Earlier implementation and presentation entries below remain historical evidence.

## Weights visible on the chart — 30 September 2026

The latest user request is fulfilled by a source-derived numeric weightings panel beside the flowchart's opening decisions. Current main chart has 70 nodes and 92 connectors; all 69 previous nodes and all connectors are unchanged. The panel separates patient adjustment, precision penalties, confidence and conditional frailty add. Rebuilt and promoted after geometry/semantic checks and readable 50%/70% draw.io review. Evidence is `outputs/weighted-20260930/visible-weights-drawio.png`; baseline is `baseline/Refract-integrated-before-visible-weights.drawio` in the same folder. Engine, bundle, workbook and original cases are unchanged. Existing development-agreement results are not new clinical validation. The wide diagram was not resized to mobile and the Refract app tab was not changed in this presentation-only task.

## Visible-tab correction — 30 September 2026

User reported the retained app was not mobile after the previous completion. Direct browser-chrome inspection confirmed its toolbar was hidden; the approved personal script measured 1365 x 1192, set 360 x 740 and verified the same weighted3 URL and size after switching to the diagram and back. Treat the earlier blanket hand-off claim as insufficient. Workspace helper filtering now rejects hidden/ambiguous controls and checks tab identity, but its live rerun was blocked when the user moved to another chat. Do not claim the revised helper itself passed until it has a foreground live test. No app/engine changes in this correction.

## Weighted revision — 30 September 2026

Final assets use `20260930-weighted3`. Output digit clipping is fixed within the original field geometry; all 4,000 signed display-fit fixtures pass. App tab 9 and weighted chart tab 10 are retained. Final persistent-toolbar verification passed after the user returned to this chat: exact weighted3 URL and 360 x 740 before, after and after switching to the diagram and back. This is a fresh real-toolbar check, not the earlier weighted1 result. Exact status and hashes: `outputs/weighted-20260930/handoff-review.json`.

The live wrapper now calls `src/weighted-prescribing.js`. Its authored weights combine per-eye quality with prior-prescription resistance, calm, health, age and tri-state practice familiarity. `repeat=1` means returning to this practice, `0` means new here and blank means unknown; it never means first glasses, satisfaction or measurement accuracy. Numeric zero remains distinct from missing data. Calm means calm/easy-going, not good VA. Source-only mathematical evaluation is documented in `outputs/weighted-20260930/research-report.json` and the independent review receipt.

The final model uses a progressive sphere-step cap above a `1.25 D` gap, not the rejected abrupt `1.5 D` branch. Quality is `clamp((Q−5)/3,0,1)` with an accuracy-switch fallback only when no score is recorded. Preserve the existing discrepancy stop, no-objective retention, explicit good-VA hold, simple mode and current-add precedence. No recorded current Rx means no anchor, not plano or first glasses; the inherited no-current seed carries an explicit provisional warning.

The same 60-case development set gives mean worse-eye meridional error `0.16104 D` versus `0.18531 D` before, a `13.1%` reduction. Distance ≤`0.25 D`: 45/60 unchanged; ≤`0.50 D`: 55/60 versus 54; literal full 29/60 unchanged, RE 43, LE 41 and add 52. Cases 6, 18 and 42 improve; case 57 has a `0.04358 D` axis-rounding regression and was previously an exact full match. Without repeat the mean is slightly better at `0.16031 D`: do not claim the repeat coefficient was validated. No held-out or clinical validation is established. Spherical controlled probes pass but cylinder/complete-lens confidence monotonicity does not generally hold because the inherited target reduces cylinder.

Maintain the production policy, its exported `PARAMETERS`, the 14 main `WEIGHTED_RULES` IDs and the fuller `RULE_CATALOGUE` together. Add-path trace labels have human-readable catalogue entries. Rebuild with `npm run build`; run `npm test`, `node outputs/weighted-20260930/experiment.mjs --write`, `node outputs/weighted-20260930/robustness.mjs` and `node outputs/weighted-20260930/independent-review.mjs`. The reviewed weighted chart has now been promoted to `Refract-integrated-flowchart.drawio`; its predecessor is preserved under `outputs/weighted-20260930/baseline/`. For future authorised revisions use `node tools/build-weighted-flowchart.mjs`, inspect the real rendered chart and back up the main file before `--promote`. Do not use older generators. Browser acceptance, clinical sign-off and physical-device status must be reported separately. Older statements below are historical and do not supersede this entry.

## Prescribing revision — 29 September 2026

Author authorised a predictable rule engine and separate logical spreadsheet. Implemented in `src/prescribing-rules.js` with named rule catalogue and trace. Fixed sheet inputs: 29/60 complete, 44/60 RE, 40/60 LE, 52/60 add; previous 24/60 complete cases retained. Original CSV unchanged. See `RULE_ENGINE_2026-09-29.md` and `outputs/refract-rules-20260929/Refract-logical-rules.xlsx`. Do not mistake the workbook snapshots for a live Excel prescription calculator or the score for external validation. Entered add precedence retained pending clarification. Simple/Advanced switching no longer accumulates sphere offsets. HTTP and direct-file core checks pass; file fonts/MCQ CORS and retained-toolbar hand-off remain limited. Clinical sign-off pending. This supersedes the earlier exclusion from logic review below.

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

## Current Focus

- Fleet review now includes exact `360 x 740` HTTP and direct-file browser evidence for the main workflow, overlays, transpose and two-step reset. Independent clinical sign-off, installed offline review and physical-device review remain pending.

Rebuild the heuristic prescription engine against the Allan workbook benchmark while preserving the compact mobile UI.

## Recent Changes

- Refactored the large JS files into smaller ES modules under `src/`
- Split the stylesheet into layered files under `styles/`
- Moved `logic.js` to a compatibility re-export over `src/prescription-logic.js`
- Consolidated sign handling into `src/ui/sign-fields.js`
- Fixed the muddled `+/-` rendering by using shared sign state and shared spacing rules
- Added a shared `src/prescription-engine.js` path for app output calculation
- Added a generated `src/workbook-calibration.js` module derived from the Allan workbook
- Added `tools/audit-allan-rx.mjs` and `tools/generate-workbook-calibration.mjs`
- Split the old lookup-backed path into benchmark-only `src/workbook-benchmark-engine.js`
- Restored the live app path to pure heuristics
- Reworked `src/prescription-logic.js` into a parameterized component-weighted engine
- Added `src/prescription-config.js` as the shared heuristic parameter surface
- Added `tools/fit-prescription-config.mjs` to search heuristic weights against the workbook
- Added `tools/lib/workbook-analysis.mjs` for shared workbook parsing, feature derivation, inferred action labels, and ordered-rule learning
- Added `tools/extract-workbook-actions.mjs`, `tools/learn-workbook-rules.mjs`, and `tools/study-workbook-ceiling.mjs`
- Refreshed the header and top control layout:
  - left burger button
  - right info button
  - `Age`, `Patient`, and `Mode` boxes
  - separate faint-red `advanced` mode box
- Preserved the one-page `360x740` layout target

## Next Steps

- Use the workbook only as a benchmark and rule-discovery source
- Use the new action-level studies to decide whether the next gains should come from a regime engine rewrite or more input separation
- Re-run the fitter and workbook audit after each logic/config change
- Keep UI verification separate from logic verification

## Active Decisions

- Keep the app static and framework-free
- Keep the mobile-first one-page layout as a hard design constraint
- Keep `advanced` visually separate from patient context
- Keep signed values as magnitude-in-input plus sign state on the wrapper
- Keep `calm` and `repeat` as legacy workbook-only fields, not live app inputs
- Treat `health?` as a poor-condition flag that mainly affects the add
- Treat blank current fields as missing current/worn-glasses data
- Treat blank objective cyl/axis as a pure-sphere objective result
- Treat workbook quality values of `8` or `9` as generally meaning the objective result was accurate/reliable
- Keep workbook calibration out of the live runtime path

## Patterns and Preferences

- Prefer small, explicit modules over a single large script
- Preserve clinical heuristics in readable rule code
- Use workbook data as a benchmark, not as runtime output lookup
- Prefer fitted parameters over ad hoc threshold nudges when the model shape is already in place
- Prefer action-level rule discovery before another live-engine rewrite
- Keep startup and hosting simple enough for a local HTTP server
- Document behaviors that are easy to break accidentally:
  - sign handling
  - simple-mode conversions
  - transpose normalization

## Insights and Learnings

- Sign display must not be the source of truth for numeric meaning
- Layout changes can easily break the one-page mobile fit, so `360x740` should stay part of manual verification
- The `advanced` switch is a UI mode control with data consequences, not just a styling preference
- `VA good` means the patient was happy with current glasses
- `accurate` means the objective result was trustworthy
- Workbook quality is recorded per eye, but the simplified app currently exposes only one global `accurate` toggle
- The live engine now blends sphere, cyl, and axis with configurable component pulls instead of a mostly binary current-vs-objective switch
- `tools/fit-prescription-config.mjs` currently fits the live defaults to `24/60` full workbook cases under fixed sheet-derived inputs, with `39/60` RE matches, `33/60` LE matches, and `52/60` add matches; the benchmark engine remains `60/60`
- The fitted defaults currently prefer stronger `precise` resistance, a small `0.25D` sphere step cap, later age-gated add generation, and a less eager low-cylinder axis follow
- The inferred action taxonomy covers most of the workbook cleanly: `sphere_action` has only `4/120` custom eyes, `cylinder_action` `11/120`, `axis_action` `8/120`, and `add_source` only `1/60` other-present cases
- Leave-one-out ordered-rule studies show that workbook-only fields are not obviously the missing ingredient: average action accuracy is about `68.0%` with full workbook features and about `69.0%` with the simplified feature sets
- The hardest targets are `axis_action` and `add_source`; `cylinder_action` is the easiest of the current action targets
- Case 6 currently looks more like a likely workbook anomaly or transcription/sign issue than a defensible averaging rule, so it should not drive the live engine unless a repeated pattern appears

# Fleet upgrade context — 23 July 2026

The engineering upgrade preserved the live heuristic and its 24/60, 39/60, 33/60 and 52/60 audit boundary. Local runtime assets, deliberate case reset, scoped PWA support and contracts are now present. Exact mobile screenshot, physical-device and independent clinical gates remain open.

## MCQ consistency status — 23 July 2026

The former level-button facade is now a functional three-level MCQ system. It requires all answers, shuffles questions and answer-remapped options, uses explicit pass marks and progressively unlocks Intermediate then Advanced. Only an Advanced pass unlocks the Cup. The new teaching questions await independent clinical review.

## Maintenance refactor — 26 July 2026

The prescription form now uses its `input` event as the single recalculation trigger. The committed bundle is protected by exact non-writing parity and the MCQ controller deliberately remains a separate classic script. Clinical logic and visible layout were not changed. Clinical and physical-device gates remain open.

## App-bar information glyph — 26 July 2026

- Replaced the legacy 18px outlined badge and 11px `i` with the shared plain `21px` information glyph.
- Retained the existing `44 x 44px` button, blue accent and app-bar position.
- Kept prescription, report and MCQ logic unchanged.
- Matched the information glyph to Refract's blue `appbar-accent`.
- Versioned the stylesheet and Refract-only cache as `20260726-info2`.

## MCQ quality pass — 26 July 2026

All 38 questions now use stable IDs, rationales, named sources and explicit review status. Interface-mechanics prompts were replaced by refraction knowledge. Unanswered attempts focus the first gap and completed attempts show result, explanations and source status before retry. Prescription logic, attempt sizes, pass marks and Cup unlocking remain unchanged.

The final content spot-check retained `refract-primary-03`, `refract-primary-09` and `refract-advanced-16` while replacing repeated scope or interface content with plano notation, visual-acuity verification and binocular acceptance.

## 27 July 2026 - Lighthouse accessibility remediation

- `#sideMenu` starts inert, becomes interactive only while open and is inert again after closure.
- Escape closure restores focus to `#burger-icon`.
- The generated bundle was rebuilt from source and exact SHA-256 parity was confirmed.
- Contracts and isolated `360 x 740` checks pass with a `360px` document width and no console errors.
- The repeat Lighthouse run reports `95 / 100 / 100 / 100` with zero layout shift.
- Prescription calculation and workbook data remain unchanged.
