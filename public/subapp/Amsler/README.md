# Amsler App

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests. Report export includes local CSS and fonts in the capture clone for the host CSP and offline operation, with direct-file support retained.

Current receiving-host evidence is in [the integration report](../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Targeted loading improvements — 30 September 2026

The local report-capture library now loads on first Download or Share rather than at startup. Subsequent exports reuse it. Failed loads show a recoverable message and re-enable both actions for retry. Initial resource-body bytes: 391,415 → 194,492 (50.3% less). Mobile Lighthouse: 86 → 96/100 in separate same-day lab runs. The canonical custom builder regenerated `app.bundle.js` from source.

All nine main-page views at 360 x 740, 768 x 1024 and 1366 x 900 have no horizontal overflow or captured runtime errors. Targeted workflows pass over HTTP, direct-file and installed offline use. Amsler exports with patient/date metadata and a drawn grid mark pass first/repeated Download and mocked native Share; a deliberately failed library fetch recovers on retry. Allan full teaching-card variants and drawer thumbnails pass; Refract simple/advanced fields and completed output pass. These checks preserve functionality but do not claim exhaustive workflow or physical-device acceptance.

Full images and the export library remain precached for offline use, so the startup savings do not describe total offline installation traffic. Local asset queries and app-scoped caches were bumped. Browser tests use temporary viewports. The three retained preview tabs were each verified through real browser chrome at 360 x 740 after switching away and back; their intended loadingFix=20260930 URLs were re-read. Each started at 843 x 1192. Refract is the final selected preview. See [the scoped evidence receipt](../LOADING_IMPROVEMENTS_20260930.md). This section supersedes the earlier three loading priorities, not the historical clinical review.

## Performance review — 30 September 2026

Runtime source retained. The canonical custom builder is now respected by the fleet build. The report-capture library is required for export, not dead code; deferring it needs a dedicated export/offline check. Mobile Lighthouse performance: 86 → 86/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Quiz answer labels now keep the radio and text on one row with regular unmarked text; result actions use consistent rounding.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

Fleet edge follow-up, 23 July 2026: the controls, canvas and result/report shells now use exact `10px` outer margins and `340px` width at `360 x 740`. Drawing and reporting behaviour is unchanged.

<!-- APP-DOC-STATUS:START -->

## Current Status (24/7/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: red `#ff2a18` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
- v1.1 engineering pass: local runtime assets, accessible transient surfaces, examination reset, app-scoped offline support and Node contracts.
- Lead desktop-browser review passed at `360 x 740`, including drawing, Compute, report, reset, modal focus, MCQ and offline reload.
- The information card now explains what an Amsler grid checks and places its `44 x 44px` close control in a dedicated header position clear of the title and body copy.
- Corrective visual pass applies `12px` toolbar shells, smaller inner-control radii and an `18px` result/report shell while preserving the square clinical grid and compact workflow.
- Compute now uses a pure fixed-resolution normalised engine. The same recorded mark produces the same percentages after canvas or viewport resizing.
- Compute records the selected eye only. An untouched fellow eye remains `Not assessed`, while a deliberately computed empty eye reports `No marks recorded`.
- Drawing after Compute replaces the stale summary with `Changes not computed`, clears any stale report and disables Report.
- Percentages now state coverage of the whole grid, the defined central zone and the outer zone using explicit denominators. Closed Missing and Red mark outlines count their recorded polygon interior while open lines count their stroke.
- The former geometry-based `wavy` versus `dark` inference is no longer used. Tool meaning is explicit and descriptive rather than diagnostic.
- The patient control uses a local head-and-shoulders silhouette and the app-bar information control uses the fleet bare `i`.
- Clinical sign-off: pending independent review.
- Physical-device review: pending. Desktop browser review does not count as device acceptance.
<!-- APP-DOC-STATUS:END -->

Browser-based Amsler grid app for quick central-vision defect sketching, analysis, reporting and MCQ training.

## Run Locally

1. Open a terminal in this folder.
2. Start a static server:
   `python -m http.server 5500`
3. Open:
   `http://localhost:5500`

Direct-file use remains supported by opening `index.html`. The app works from local files, but browser installation and service-worker offline caching require HTTP or HTTPS.

## Build and Verify

- Rebuild the generated classic-script bundle: `npm run build`
- Confirm that the bundle matches the modular sources: `npm run build:check`
- Run the built-in contracts: `npm test`
- Check JavaScript syntax: `node --check app.bundle.js`

`app.bundle.js` is generated from `script.js` and `js/*.js`. Do not edit it directly.

## Offline Support

- Runtime fonts and html2canvas are local.
- The manifest and service worker are scoped to this Amsler folder.
- The worker registers only over HTTP or HTTPS and uses an `arclight-amsler-` cache prefix.
- Load the app once over HTTP while online before testing an offline reload.

## Current Features

- Eye-specific drawing for `RE` and `LE`.
- Tools:
  - `Line` (black distortion line)
  - `Missing` (white missing or dim region)
  - `Red mark` (red or colour-change region)
- Hidden stroke width control under `+` (collapsed by default).
- Grid view toggles:
  - flashing fixation dot
  - red mode
  - diagonal mode
- Compute pipeline:
  - stores line width relative to the grid so results remain stable across responsive resizing
  - distinguishes `Not assessed`, `No marks recorded` and recorded-mark states per eye
  - reports coverage of the whole grid, central zone and outer zone
  - counts overlapping marks once
  - fills only explicitly closed Missing or Red mark regions and does not infer diagnoses from drawing geometry
  - draws zone overlays, actual closed regions and green mark boxes
- Report builder:
  - patient name/date
  - per-eye compute text
  - per-eye image snapshots
  - screenshot export (`html2canvas`)
- Two-step `New assessment` reset in the drawer clears examination and patient state while retaining MCQ achievement.
- Education mode:
  - app-bar burger menu (top left)
  - tiered MCQ sets: `Primary`, `Intermediate`, `Advanced`
  - list-style questions (no Next flow)
  - single submit with score + explanations
  - restart current level

## UI Constraints

- App bar height: `54px`
- Title size: `25px`
- Title weight: `700`
- Info icon remains in app bar (right side)

## Architecture

- `script.js`: App bootstrap and dependency wiring.
- `js/state.js`: Shared runtime state and analysis-dirty helper.
- `js/ui.js`: DOM event wiring and modal/toggle behavior.
- `js/canvas.js`: Grid/stroke rendering and pointer input.
- `js/amsler-engine.js`: Pure normalised mark analysis, zone coverage and result formatting.
- `js/analysis.js`: Compute controller and descriptive canvas overlays.
- `js/report.js`: Report HTML generation and screenshot handling.
- `js/mcq.js`: Sidebar/menu + MCQ modal controller.
- `js/mcq-data.js`: Tier question banks.
- `js/constants.js`: Shared constants/tool styles.
- `memory-bank/*.md`: Continuity docs.

## Quick Checks

- Syntax checks:
  - `node --check script.js`
  - `node --check js/amsler-engine.js`
  - `node --check js/canvas.js`
  - `node --check js/analysis.js`
  - `node --check js/report.js`
  - `node --check js/ui.js`
  - `node --check js/mcq.js`
- Full suite: `npm test` — 18 tests plus generated-bundle alignment.

The lead fleet review is recorded in `AMSLER_V1.1_EVIDENCE_RECEIPT.md`. Independent clinical sign-off and physical-device acceptance remain pending in `CLINICAL_REVIEW.md` and `DEVICE-TEST-CHECKLIST.md`.

## Information popup consistency — 23 July 2026

The focus-managed Quick Guide retains its `44 x 44px` close control, uses the shared `version · date` presentation and explains the revised descriptive Compute semantics.

## Information-card typography and fit — 23 July 2026

The guide uses the fleet scale of `14px` title, `12.5px` body, `11px` section labels and `10.5px` version text. After the Compute clarification it measured `340 x 384.1px` at `360 x 740`, with `scrollHeight` equal to `clientHeight`. Its simple visible `v1` label and shared fleet date `23/7/2026` occupy the common bottom-right footer position.

## Sidebar consistency — 23 July 2026

The red identity and existing menu actions are unchanged. The drawer uses the fleet `14px` title, `11px` section-label and `12.5px` supporting-copy roles where present, with focus entry, Escape closure and trigger-focus return verified at `360 x 740`.

## MCQ consistency — 23 July 2026

MCQs now require every question to be answered before grading. Explicit pass marks protect Cup unlocking and the level labels match the fleet. An unanswered Advanced set was verified at `360 x 740` to remain unsubmitted with the Cup locked.

## Analysis clean-up — 26 July 2026

The obsolete pre-normalisation geometry, canvas-mask and defect-merging route has been removed from `js/analysis.js`. Live Compute behaviour continues through the tested pure `js/amsler-engine.js`, while `js/analysis.js` retains only result coordination and descriptive overlays. No drawing tool, result wording, report behaviour, MCQ or visible layout changed.

`app.bundle.js` was rebuilt from source. All 16 tests and the non-writing bundle parity check pass.

## MCQ clinical-quality pass — 26 July 2026

The 48-question bank remains 12 Primary, 18 Intermediate and 18 Advanced questions with attempt sizes of 6, 8 and 8. Stable question IDs, per-question source references, concise rationales and an explicit pending-review status are now enforced. Twelve app-mechanics questions were replaced with technique, limitation, documentation or assessment questions supported by NICE NG82 and the NCBI Amsler review. A second content pass removed repeated higher-tier stems by adding distinct chart-variant, geometry, micropsia, dilation, relative-scotoma, filling-in and screening-limitation decisions.

Unanswered attempts remain ungraded and move focus to the first unanswered row. Completed attempts show the correct answer, the selected wrong answer and a rationale for every question. `New attempt` draws a fresh attempt while Escape returns focus to the app-bar menu trigger. Submit and New attempt are mutually exclusive so the completed result has one clear next action. MCQ rows retain a 44px minimum touch height. The assessment, drawing, Compute and report workflows were not changed.

## Information purpose pass — 27 July 2026

The existing `i` panel now explains that the user tests one eye at a time and marks the distortion, missing area or colour change where the patient reports it. It also states that the marks describe the test rather than diagnose macular disease. No drawing, Compute or report logic changed. The open panel passed the shared non-scrolling `360 x 740` review.

## Fleet UI alignment — 28 September 2026

The information card now uses the shared `16px` radius and a measured `44 x 44px` close target. Clean Chromium checks at `360 x 740` found no horizontal overflow, no information-card scrolling, correct Escape focus return and no console errors. Drawing, Compute and report logic are unchanged. Physical-device acceptance and independent clinical sign-off remain pending.

# Interaction fixes — 29 September 2026

See [LOGIC_REVIEW_20260929.md](LOGIC_REVIEW_20260929.md) for the latest evidence: report invalidation, eye-specific labels, captured drawing, Red-mode contrast and persistent computed overlays. Coverage calculations remain unchanged. All 22 tests and bundle parity pass; HTTP reviewed at 360 × 740. Direct-file, physical-device and independent clinical approval remain pending.
