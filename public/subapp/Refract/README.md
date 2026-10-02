# Refract

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests. Prescribing sources and the supplied editable chart are unchanged; both bundles were rebuilt with locked esbuild 0.25.5.

Current receiving-host evidence is in [the integration report](../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Targeted loading improvements — 30 September 2026

Initial CSS now hides cylinder and axis fields in the existing default simple mode before JavaScript arrives. The Advanced control still reveals them normally. With the app bundle delayed by one second, mobile CLS fell from 0.17910 to 0.00009. Mobile Lighthouse: 88 → 97/100 in separate same-day lab runs. No prescribing weights, engine, original data or flowchart changes.

All nine main-page views at 360 x 740, 768 x 1024 and 1366 x 900 have no horizontal overflow or captured runtime errors. Targeted workflows pass over HTTP, direct-file and installed offline use. Amsler exports with patient/date metadata and a drawn grid mark pass first/repeated Download and mocked native Share; a deliberately failed library fetch recovers on retry. Allan full teaching-card variants and drawer thumbnails pass; Refract simple/advanced fields and completed output pass. These checks preserve functionality but do not claim exhaustive workflow or physical-device acceptance.

Full images and the export library remain precached for offline use, so the startup savings do not describe total offline installation traffic. Local asset queries and app-scoped caches were bumped. Browser tests use temporary viewports. The three retained preview tabs were each verified through real browser chrome at 360 x 740 after switching away and back; their intended loadingFix=20260930 URLs were re-read. Each started at 843 x 1192. Refract is the final selected preview. See [the scoped evidence receipt](../LOADING_IMPROVEMENTS_20260930.md). This section supersedes the earlier three loading priorities, not the historical clinical review.

## Performance review — 30 September 2026

Both canonical production bundles minified. The fleet build now includes the MCQ bundle. Clinical weights, engine source, original data and flowchart are unchanged. Initial-load layout shift remains a separate optimisation opportunity. Shipped JavaScript: app 72,303 → 34,132 bytes; MCQ 21,153 → 15,096 bytes. Mobile Lighthouse performance: 85 → 88/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Main mobile spacing reduced to accommodate enlarged inputs; advanced-fields control clarified; wider input/results columns added. Engine and flowchart unchanged.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Fleet repair receipt — 30 September 2026

Contained the quiz within the mobile screen and corrected its opening-focus timing. Built the existing MCQ controller as a separate classic bundle so direct-file use works. Prescribing logic, weights, cases and the flowchart are untouched. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Direct input-to-output learning — 30 September 2026

Completed the authorised offline test of 52 data-fitted ridge and tree models that predict recorded final distance prescriptions directly. Both eyes stay together in 20 repeats of six outer folds, with selection inside each training fold. Learned-only excluded-case agreement is 57.92% within `0.25 D` and 84.25% within `0.50 D`, with mean worse-eye optical disagreement `0.33307 D`. Existing-engine agreement remains 75% and 91.67%, mean `0.16104 D`; the selector including it chose it in all 120 outer folds. No improvement was promoted: app logic, bundle, main chart and original data are unchanged.

An experiment-only age-parsing error invalidated the initial run; that run is preserved with `INVALID.md`. The fresh corrected run parses all 60 ages correctly and changes no model, split or selection rule. Independent scoring, fitted-model reconstruction, grouping, selection, symmetry and transposition checks pass. Existing logic and bundle-parity tests pass; browser output-fit launch was blocked by sandbox `EPERM`, so no new browser/mobile acceptance is claimed. Evidence: `outputs/direct-learning-corrected-20260930/report.md`, `results.json` and `verification.json`. This is exploratory internal historical agreement, not independent clinical validation. It does not establish that input-to-output learning is impossible. A case-similarity model is a possible next study, not yet run or promoted.

## Coupled-component study — 30 September 2026

Completed the approved source audit and nine-candidate coupled sphere/cylinder/axis experiment. All 1,740 compared source Excel values match the CSV, including cases 14, 19 and 22; original data are unchanged. The baseline was selected in all 120 training folds across 20 repeats of six-fold case-grouped evaluation. All 1,200 withheld outputs are unchanged: 45/60 (75%) within `0.25 D`, 55/60 (91.7%) within `0.50 D` and mean worse-eye disagreement `0.16104 D`. No candidate earned promotion, so app logic, bundle and main flowchart remain unchanged. Independent scoring, transpose/symmetry, selection and guard checks pass; 15 production/data/chart hashes are unchanged. See `outputs/coupled-calibration-20260930/report.md` and its JSON evidence. The source-audit and coupled-study recommendations in the earlier entry below are now completed. Next proposed work is a separately approved interpretable data-fitted model, not further arbitrary modifier increases. This is internal historical agreement testing, not independent clinical validation or a new mobile/browser acceptance claim.

## Offline calibration experiment — 30 September 2026

Completed a bounded offline comparison of 379 parameter variants. Production app logic, the flowchart and the original workbook/case data are unchanged. The baseline achieves both eyes within `0.25 D` in 45/60 case records (75%) and within `0.50 D` in 55/60 (91.7%), with mean worse-eye maximum meridional difference `0.1610 D`.

The best full-data fit, C011, changes only `largeStepRamp` from `1` to `1.5`: 46/60 (76.7%) within `0.25 D`, 55/60 within `0.50 D` and mean `0.1527 D`. Only case 6 LE and case 18 LE improve; the other 118 eye prescriptions are unchanged, including the better eyes. However, 20 repeats of six-fold case-grouped cross-validation leave all 60 held-out prescriptions unchanged in every repeat. Both eyes stay together; without longitudinal patient identifiers we cannot guarantee that separate records never belong to the same person. The full-data gain therefore has no demonstrated held-out benefit. All 60 cases were previously used in development, so this is internal evaluation, not independent validation.

Health weighting was frozen because only one record is positive. The experiment records 15 source hashes and passes 4,927 synthetic candidate-fixture checks; these do not establish clinical performance. **Do not promote C011.** First audit the source values in cases 14, 19 and 22, then consider a separately approved study of coupled sphere, cylinder and axis rules. Evidence: `outputs/calibration-20260930/report.md`, `outputs/calibration-20260930/Refract-calibration.xlsx` and `outputs/calibration-20260930/results.json`. This offline task adds no browser, mobile, physical-device or clinical acceptance claim.

## Visible flowchart weights — 30 September 2026

The integrated chart now has a prominent **Weightings — current values** panel beside its opening decisions. It displays source-derived numeric modifiers, separate precision penalties, confidence conversion, combination formulas and the age-derived frailty add increment. These are provisional authored settings, not clinically validated coefficients. The panel is editable and regenerates from production parameters. This presentation-only change preserves all 69 previous nodes and all 92 connectors exactly, adding one reference panel. Geometry checks, eight validator self-tests and 22 semantic examples pass. The new panel was inspected in draw.io at 50% and 70% zoom without text clipping or route collisions. Evidence: `outputs/weighted-20260930/visible-weights-drawio.png`. Prescribing source, shipped bundle, workbook and recorded cases are unchanged. The former chart is preserved as `baseline/Refract-integrated-before-visible-weights.drawio` in that output folder.

## Visible mobile hand-off correction — 30 September 2026

The user's subsequent check showed that the earlier hand-off claim did not cover the visible retained tab. Its device toolbar was hidden and its size was 1365 x 1192. The personal hand-off script enabled the real toolbar, set 360 x 740 and confirmed the exact weighted3 URL and 360 x 740 after switching to the chart and back. No app content or prescribing logic changed. The workspace helper now rejects hidden/ambiguous controls and requires the same tab identity after a distinct-tab switch. Its stricter live rerun could not finish because another chat became foreground; the successful size correction is evidence from the personal script, not a claim that the revised helper passed live testing.

## Weighted prescribing engine — 30 September 2026

The authorised weighted revision is implemented in `src/weighted-prescribing.js`, called through the unchanged `computePrescriptionCase` API in `src/prescription-engine.js`. It is a deterministic authored policy, not a case lookup or a learned predictor. The former engine remains in `src/prescribing-rules.js`; frozen pre-change sources are under `outputs/weighted-20260930/baseline/`. The original 60-case CSV is unchanged.

Patient context now includes optional calm and returning/new-to-practice fields plus separate optional RE and LE quality scores. `repeat=1` means previously seen at this practice. `repeat=0` means new to the practice, **not** first glasses. Blank remains unknown. Calm means calm/easy-going, not satisfaction with the current prescription or good VA. A returning patient is not automatically happy or accurately measured.

Recorded quality `Q` takes precedence over the accuracy switch for that eye: `q = clamp((Q−5)/3, 0, 1)`. Thus scores at or below 5 hold an existing prescription and scores at or above 8 reach the high-confidence plateau. Blank quality falls back to the existing accuracy switch; zero is not blank. The raw score and confidence basis remain in the diagnostic output. With no recorded current prescription, the existing provisional seed remains available, accompanied by a no-anchor warning; no current entry is never treated as plano or proof of a first pair.

Small, declared adaptation modifiers are calm `+0.04`, new patient `−0.05`, returning patient `+0.025`, poor health/frailty `−0.05` and age 65 or over `−0.05`. Unknown calm/repeat contributes zero. Precise wearers retain the existing stronger prior-prescription resistance. These modifiers influence the established component policy and bounded sphere movement; they are assumptions requiring clinical review, not independently established effect sizes.

The engine preserves validation, equivalent plus-cylinder transposition, pair-wide large-discrepancy review, explicit good-VA retention, simple-mode projection and entered-add precedence. Sphere differences of at most `0.25 D` retain the current sphere. At a sphere gap of `1.25 D` or more, the maximum step grows progressively: ordinary step plus the gap above `1.25 D`, capped at `1.5 D`. The ordinary step is `0.50 D` for younger/flexible wearers and `0.25 D` otherwise. The existing high-sphere guard keeps the cap at `0.25 D` when either sphere magnitude is at least `6 D`. The discrepancy stop still applies first at a `3 D` sphere gap. This ramp replaces a rejected abrupt large-change branch. All output powers remain quarter-dioptre quantised.

### Development agreement, not clinical accuracy

The principal measure is each patient's worse-eye maximum meridional lens-power difference from the recorded prescription, after equivalent minus-cylinder normalisation. It is an engineering distance, not an accepted clinical tolerance.

| Measure on the same 60 recorded cases  | Previous engine | Weighted engine |
| -------------------------------------- | --------------: | --------------: |
| Mean worse-eye difference              |       0.18531 D |       0.16104 D |
| Maximum worse-eye difference           |       1.63951 D |       1.00000 D |
| Both eyes within 0.25 D                |           45/60 |           45/60 |
| Both eyes within 0.50 D                |           54/60 |           55/60 |
| Exact equivalent distance prescription |           32/60 |           32/60 |
| Literal complete prescription match    |           29/60 |           29/60 |
| Literal RE / LE / add match            |    44 / 40 / 52 |    43 / 41 / 52 |

Mean error falls by `13.1%`. Cases 6, 18 and 42 improve, case 57 worsens by `0.04358 D` and 56 cases have unchanged worse-eye distance. The case 57 regression is a `5°` RE axis rounding change and loses one previously complete literal match; it is not hidden by the unchanged overall count. Sphere/cylinder components are within `0.25 D` in 54/60 patients and within `0.50 D` in 59/60. Among 38 recorded numeric adds, 33 are exact and all 38 are within `0.25 D`; the joint distance/add result is within `0.25 D` for 27/38 and within `0.50 D` for 34/38. Blank given adds remain unscored in this numeric-add comparison.

Turning repeat weighting off gives a slightly lower mean error, `0.16031 D`, with no previous complete-case regression. Repeat therefore has no demonstrated incremental benefit in this small dataset. The coefficients were explored against these same cases, so none of these results is held-out validation. The 29,520 controlled spherical confidence probes pass, but full cylinder/axis distance to the raw measured Rx is not globally monotonic: the inherited policy uses a reduced cylinder target and separate component rules. Independent review records 431 worse complete-lens transitions and 222 worse cylinder transitions among 56,160 adjacent-quality comparisons, with no worse sphere transitions in that grid. Engineering checks do not establish clinical sign-off or physical-device acceptance.

Evidence is in `outputs/weighted-20260930/experiment.json`, `research-report.json` and `independent-review.json`. The reviewed weighted chart is now the main editable `Refract-integrated-flowchart.drawio`. The previous approved chart is preserved in `outputs/weighted-20260930/baseline/Refract-integrated-flowchart-before-weighting.drawio`. Follow `FLOWCHART_LAYOUT_RULES.md` before changing its layout. The following older sections are historical unless explicitly restated above.

### Rebuild and reproduce

Run from the `Refract` folder:

```powershell
npm run build
npm test
node outputs/weighted-20260930/experiment.mjs --write
node outputs/weighted-20260930/robustness.mjs
node outputs/weighted-20260930/independent-review.mjs
node tools/build-weighted-flowchart.mjs
```

The experiment and current `tools/review-prescribing-rules.mjs` input mapping preserve recorded per-eye quality and tri-state calm/repeat. Older audit tools and historical scores are not automatically interchangeable with this weighted evaluation. Rebuild the bundle from source after implementation changes. Regenerate the weighted chart, run its checks and visually inspect the actual draw.io rendering before using `--promote` to update the main chart. Back up the current main chart first: promotion does not create a backup. Direct-file service workers are unavailable and local-font/MCQ CORS restrictions remain separate from HTTP verification. See `WEIGHTED_RULE_ENGINE_2026-09-30.md` and the hand-off receipt for browser evidence.

Run `npm run browser:output-fit` separately; it uses Morph's local Playwright-core and installed Windows Edge to place temporary display-only fixtures in a disposable 360 x 740 page. All 4,000 signed-output fixtures through 99.75 fit after an output-only padding/type refinement; field widths and positions are unchanged. This is not an engine, retained-tab or physical-device test. Final release assets use `20260930-weighted3`. The final real-toolbar check passed after the user returned to this chat: exact weighted3 URL and 360 x 740 before, after and after switching to the diagram and back. See `outputs/weighted-20260930/handoff-review.json`.

## Editable flowchart — 30 September 2026

Future revisions must follow `FLOWCHART_LAYOUT_RULES.md`, the user-approved presentation contract. `AGENTS.md` directs future agents to read it before editing.

`Refract-integrated-flowchart.drawio` is the editable integrated weighted-rule chart. It has 70 nodes (including the visible-weight reference panel) and 92 connectors covering all 18 catalogue IDs. All lettered continuation circles are removed. Continuous outside paths use separate destination ports, with no shared merge segments. The chart was inspected in draw.io at readable zoom after geometry and semantic checks. Open `outputs/weighted-20260930/open-weighted-flowchart.html` for the current snapshot with white background, no grid and hidden sidebars. The browser diagram is a snapshot, not automatic two-way synchronisation with the engine. Use `tools/build-weighted-flowchart.mjs` for future updates, not the older presentation-only generators.

## Rule-engine revision — 29 September 2026

The authorised prescribing revision is now implemented. See `RULE_ENGINE_2026-09-29.md` for decision order, limitations and evidence. Fixed-input agreement improves from 24/60 to 29/60 complete cases, with no previously exact complete case lost. Original author data is unchanged. The separate workbook is `outputs/refract-rules-20260929/Refract-logical-rules.xlsx`.

The engine is deterministic and inspectable, not a case lookup. Simple/Advanced transitions are reversible; entered adds retain precedence over age/frailty estimation. Clinical sign-off remains pending. HTTP checks pass; direct-file core works but Edge blocks local fonts and the separate MCQ module. Older entries below describe earlier releases.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. Refract logic remains deliberately outside the current clinical-audit programme. This entry records a documentation and popup-date update only. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## Fleet upgrade status — 23 July 2026

Engineering upgrade complete without tuning the live heuristic or changing prescription configuration, outputs, IDs or workflow order. The documented 24/60 full-case, 39/60 RE, 33/60 LE and 52/60 Add baseline remains unchanged and benchmark replay remains 60/60. Runtime fonts and the transpose glyph are local, browser zoom is available and a two-press case reset plus scoped PWA shell have been added.

See `REFRACT_V1.1_EVIDENCE_RECEIPT.md` for verification and open gates. Independent clinical sign-off and physical-device review are not established.

<!-- APP-DOC-STATUS:START -->

## Current Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: off-white `#f5f8ff` on a blue appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Refract is a static browser app for estimating a likely final spectacle prescription from a patient's current prescription and objective refraction.

It runs entirely in the browser without a backend. End users can open the shipped static files; maintainers must rebuild the classic bundle with `npm run build` after source changes.

## Features

- Enter current and objective refraction for right eye (`RE`) and left eye (`LE`)
- Capture context through:
  - `health?`
  - `exact`
  - `VA good`
  - `accurate`
- Keep `advanced` as a separate UI mode control rather than patient context
- Auto-calculate output sphere, cylinder, axis, and reading add
- Switch between simple and advanced entry modes
- Transpose prescriptions from the current/objective inputs
- Use touch-friendly spinner inputs with long-press acceleration
- Apply inline guardrails for cylinder/axis consistency and low-value add fields
- Render signed values consistently in both editable and output fields
- Show a compact app bar with info popup and MCQ drawer shell

## Historical component rules (superseded by the revision above)

The previous component core, now wrapped by the ordered rules above:

1. Build a softened objective target:
   - objective sphere moves `0.25 D` towards zero
   - objective cylinder is reduced toward plano by `0.25`
2. If the current sphere is missing, treat that as no current/worn glasses data and use the softened objective target
3. If a current prescription exists, blend each component separately rather than making one binary current-vs-objective choice:
   - sphere, cyl, and axis each use a configurable pull toward the objective
   - `exact` and `VA good` increase resistance to change
   - `accurate` increases objective pull, and workbook `8/9` quality values map to that in the audit workflow
4. Keep corroborated low-cylinder axes conservative:
   - exact low-cylinder cases often keep current axis or use a compromise axis instead of fully following the objective
5. Treat blank objective cyl/axis as a pure-sphere objective result
6. Round objective axis based on reduced cylinder:
   - `< 1.75 D` -> nearest `5°`
   - `>= 1.75 D` -> nearest `1°`
7. Preserve an entered add when present:
   - prefer current add
   - otherwise use objective add
   - otherwise compute add from age bands, with `health?` meaning poor condition and adding `+0.25`
   - the current fitted defaults only start generating age-based add from age `46`
8. In non-`exact` mode, outputs turn orange when both output spheres are between `-0.50` and `+0.75`

Cylinder reduction amount:

- objective cylinder is reduced toward plano by `0.25`

## Workbook Benchmark

The Allan workbook is now used as a benchmark and rule-discovery source, not as live runtime lookup.

- `src/prescription-engine.js` is the live heuristic path used by the UI
- `src/workbook-benchmark-engine.js` is the benchmark-only path that can replay workbook calibration data
- `tools/audit-allan-rx.mjs` runs either:
  - heuristic mode: `node tools/audit-allan-rx.mjs`
  - benchmark mode: `node tools/audit-allan-rx.mjs --benchmark`
  - fixed spreadsheet-input mode: `node tools/audit-allan-rx.mjs --sheet-inputs`
- `tools/fit-prescription-config.mjs` searches the live heuristic parameters against the workbook and reports the best config it finds
- `tools/extract-workbook-actions.mjs` summarizes inferred workbook action labels such as `keep`, `drop`, `target`, and `midpoint`
- `tools/learn-workbook-rules.mjs` trains a short ordered rule list for one action target and reports leave-one-out accuracy plus bootstrap stability
- `tools/study-workbook-ceiling.mjs` compares action-level rule performance across full workbook features and simplified app-style feature sets

## UI Notes

- The working layout is intentionally compact and designed to fit a `360x740` mobile viewport on one page
- The top controls are split into `Age`, `Patient`, and `Mode` boxes
- `advanced` is a UI mode switch with its own faint red treatment
- When advanced mode is off, cylinder and axis inputs are hidden and best mean sphere (`sphere + cylinder / 2`) is applied
- Signed fields use a shared sign system so editable and output boxes reserve the same spacing

## Running Locally

Because this is a static site, any local HTTP server will work.

Example:

```powershell
python -m http.server 5000 --bind 127.0.0.1
```

Then open:

`http://localhost:5000/index.html`

## Project Structure

- `index.html` - main UI markup, popup copy, and output field structure
- `styles.css` - CSS manifest that imports layered styles from `styles/`
- `styles/` - split styling for tokens, base, header, layout, forms, overlays, and responsive rules
- `scripts.js` - small app bootstrap
- `logic.js` - compatibility re-export for the prescription logic module
- `src/prescription-logic.js` - pure prescription selection and transformation rules
- `src/prescription-config.js` - default heuristic parameters shared by the engine and fitter
- `src/prescription-engine.js` - live heuristic output engine used by the UI
- `src/workbook-benchmark-engine.js` - benchmark-only engine for workbook replay
- `src/workbook-calibration.js` - generated lookup table for the 60 Allan workbook cases, used only for benchmarking
- `src/ui/prescription-form.js` - recalculation, transpose flow, and output updates
- `src/ui/sign-fields.js` - shared signed-field state and rendering
- `src/ui/spinner-*.js` - spinner DOM, values, interaction, validation, and constants
- `src/ui/shell-controls.js` - burger menu and info popup behavior
- `tools/audit-allan-rx.mjs` - workbook regression harness
- `tools/fit-prescription-config.mjs` - workbook-driven fitter for the live heuristic parameters
- `tools/lib/workbook-analysis.mjs` - shared workbook parsing, feature engineering, action extraction, and rule-learning helpers
- `tools/extract-workbook-actions.mjs` - workbook action summary
- `tools/learn-workbook-rules.mjs` - ordered-rule learner for action targets
- `tools/study-workbook-ceiling.mjs` - feature-set comparison for action-level leave-one-out accuracy
- `tools/generate-workbook-calibration.mjs` - regenerates the workbook calibration module from the local CSV export
- `tools/allan-rx-full.csv` - full-column workbook export used by the audit/generator
- `memory-bank/` - project context and maintenance notes

## Current Status

- The large JS files have been refactored into smaller ES modules
- The stylesheet has been split into layered files
- The output/input sign system has been unified
- The transpose flow is now routed through one controller path
- The live app now runs on heuristics only
- The live heuristic engine is now parameterized and can be tuned with the workbook fitter
- The benchmark engine still reproduces all 60 Allan workbook cases exactly
- The current fitted heuristic audit baseline is `24/60` full-case matches against the workbook, with `39/60` right eyes, `33/60` left eyes, and `52/60` adds matching in fixed spreadsheet-input mode
- The new action-level studies currently show roughly `68-69%` leave-one-out accuracy across the main inferred action targets, and full workbook features do not outperform the simplified feature sets on this dataset

## Known Gaps

- No formal automated test suite yet, although the local workbook audit harness is in place
- MCQ drawer buttons are present as UI shell only
- Exact automated `360 x 740` Chrome/CDP evidence passes over HTTP and direct-file routes for the main workflow, overlays, transpose and reset

## Information popup consistency — 23 July 2026

The anchored Quick Guide now has an effective `44 x 44px` close target and a visible `version · date` line. Prescription conversion, heuristic logic and report wording are unchanged.

## Information-card typography and fit — 23 July 2026

The guide now uses the fleet scale of `14px` title, `12.5px` body, `11px` section labels and `10.5px` version text. It measured `352.4px` at `360 x 740` and required no internal scrolling. Its simple visible `v1` label and current `23/7/2026` date now occupy the shared bottom-right footer position.

## Sidebar consistency — 23 July 2026

The blue identity and existing menu actions are unchanged. The drawer uses the fleet `14px` title, `11px` section-label and `12.5px` supporting-copy roles where present, with focus entry, Escape closure and trigger-focus return verified at `360 x 740`.

## MCQ consistency — 23 July 2026

The previous non-functional level buttons now open complete Primary, Intermediate and Advanced question sets. Questions and options vary on retry, every answer is required, pass marks unlock the next level and only an Advanced pass can unlock the Cup. The modal, unanswered guard and 4/4 Primary progression were verified at `360 x 740`.

## Maintenance refactor — 26 July 2026

Prescription-form changes now trigger one calculation path rather than duplicate `input` and `change` recalculations. Confirmed unused selectors were removed and `npm test` now checks that the committed classic bundle exactly matches the authored module graph. The separately loaded MCQ controller remains outside that bundle by design. Prescription logic, clinical wording and layout are unchanged. Independent clinical sign-off and physical-device acceptance remain open.

## App-bar information glyph correction — 26 July 2026

The obsolete 18px outlined information badge has been replaced by the fleet-standard plain `21px` glyph inside the unchanged `44 x 44px` button. Its colour now uses Refract's blue `appbar-accent`, matching the title and menu control. App-bar geometry, prescription logic and MCQ behaviour are unchanged. Browser-visible styling and the app-scoped cache use `20260726-info2`.

## MCQ quality and review workflow — 26 July 2026

All 38 authored questions now have stable `refract-{tier}-{NN}` IDs, a concise answer rationale, a named source and an explicit review status. App-interface mechanics were replaced by refraction knowledge while preserving the existing attempt sizes and pass marks. An unanswered attempt stops before grading and focuses the first missing answer. Completed attempts show the result first, then correct-answer explanations and source status. Failed attempts offer `Try again` and passes offer `New attempt`. Prescription calculations and the Cup rule are unchanged. Independent clinical sign-off remains pending.

The final content spot-check retained the IDs while replacing three repeated or interface-facing items: `refract-primary-03` now tests plano notation under the optics contract, `refract-primary-09` tests visual-acuity verification under College guidance and `refract-advanced-16` tests binocular acceptance of unequal proposed changes under College guidance.

## Information purpose pass — 27 July 2026

The existing `i` panel now tells the user to enter the measured current and objective prescriptions plus the patient context. It states that the cautious teaching result does not replace subjective refraction or prescribing judgement. No prescription calculation or report logic changed. The open panel passed the shared non-scrolling `360 x 740` review.

## Lighthouse accessibility remediation - 27 July 2026

The closed side menu is now genuinely inert as well as hidden from assistive technology. Opening removes `inert`; Escape or the close action restores it and returns focus to the burger control. The generated bundle was rebuilt from source and its exact SHA-256 parity was confirmed.

All app contracts pass. Isolated `360 x 740` review found a `360px` document width and no console errors. A repeat Lighthouse run reported zero layout shift and improved the final scores from `96 / 94 / 100 / 100` to `95 / 100 / 100 / 100`. Prescription calculations and workbook data are unchanged.

## Fleet UI alignment — 28 September 2026

The information card now uses the shared `16px` radius and a measured `44 x 44px` close target. Clean Chromium checks at `360 x 740` found no horizontal overflow, no information-card scrolling, correct Escape focus return and no console errors. Prescription calculations and workbook data are unchanged. Physical-device acceptance and independent clinical sign-off remain pending.

## Flowchart presentation polish — 30 September 2026

The main editable `Refract-integrated-flowchart.drawio` now has shorter wording in 21 nodes and subtly rounded connector elbows. All 92 routes, 70 node geometries and visible numerical weights are preserved. Prescribing logic and benchmark performance are unchanged.

Open [the latest chart launcher](outputs/flowchart-polish-20260930/open-weighted-flowchart.html) for the clean draw.io snapshot. The folder also contains the SVG, baseline backup, screenshots and verification receipts. Eight geometry-validator self-tests, 22 semantic examples and `tools/test-flowchart-polish.mjs` pass. Full readable-zoom route inspection and the overview passed with no captured browser warnings or errors. Visual verification is not clinical approval.
