# Progress

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests. Report export includes local CSS and fonts in the capture clone for the host CSP and offline operation, with direct-file support retained.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Targeted loading improvements — 30 September 2026

The local report-capture library now loads on first Download or Share rather than at startup. Subsequent exports reuse it. Failed loads show a recoverable message and re-enable both actions for retry. Initial resource-body bytes: 391,415 → 194,492 (50.3% less). Mobile Lighthouse: 86 → 96/100 in separate same-day lab runs. The canonical custom builder regenerated `app.bundle.js` from source.

All nine main-page views at 360 x 740, 768 x 1024 and 1366 x 900 have no horizontal overflow or captured runtime errors. Targeted workflows pass over HTTP, direct-file and installed offline use. Amsler exports with patient/date metadata and a drawn grid mark pass first/repeated Download and mocked native Share; a deliberately failed library fetch recovers on retry. Allan full teaching-card variants and drawer thumbnails pass; Refract simple/advanced fields and completed output pass. These checks preserve functionality but do not claim exhaustive workflow or physical-device acceptance.

Full images and the export library remain precached for offline use, so the startup savings do not describe total offline installation traffic. Local asset queries and app-scoped caches were bumped. Browser tests use temporary viewports. The three retained preview tabs were each verified through real browser chrome at 360 x 740 after switching away and back; their intended loadingFix=20260930 URLs were re-read. Each started at 843 x 1192. Refract is the final selected preview. See [the scoped evidence receipt](../../LOADING_IMPROVEMENTS_20260930.md). This section supersedes the earlier three loading priorities, not the historical clinical review.

## Performance review — 30 September 2026

Runtime source retained. The canonical custom builder is now respected by the fleet build. The report-capture library is required for export, not dead code; deferring it needs a dedicated export/offline check. Mobile Lighthouse performance: 86 → 86/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Quiz answer labels now keep the radio and text on one row with regular unmarked text; result actions use consistent rounding.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

- [x] Compute repair: normalised viewport-invariant engine, per-eye assessment state, explicit zone denominators, stale-result invalidation, closed-region handling and no geometry-based symptom inference.
- [x] Icon follow-up: local patient silhouette and fleet-consistent bare information `i`.
- [x] Verification: 16 tests plus bundle alignment, HTTP workflow and report at `360 x 740`, direct-file runtime load and clean console.
- [x] Fleet edge follow-up: controls, canvas and result/report shells use `10px` margins and `340px` width.

## v1.1 Progress (23/7/2026)

Completed engineering work:

- local runtime fonts, icons and html2canvas,
- reproducible generated-bundle build and alignment check,
- accessible dialog, drawer, tab, tool and result semantics,
- examination-only two-step reset,
- app-scoped manifest and service worker,
- Node built-in state, content and contract tests,
- updated governance, clinical-review and device-test records.
- lead desktop-browser review at 360 x 740, including offline reload and a clean online console.
- corrective UI polish for toolbar-shell hierarchy, surface opacity and final versioned-cache verification.

Pending gates:

- independent clinical sign-off,
- physical-device testing.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: red `#ff2a18` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

## What Works

- Amsler grid renders and resizes to viewport.
- Drawing per-eye (`RE`, `LE`) with tool modes:
  - Line (distortion)
  - Missing (missing or dim region)
  - Red mark (red or colour-change region)
- Visual toggles work:
  - flashing fixation dot
  - red mode
  - diagonal mode
- Compute flow produces per-eye summaries as:
  - `% of grid marked`
  - `% of central zone`
  - `% of outer zone`
- Defect overlays render on compute:
  - zone highlights (central/peripheral)
  - hull fills
  - green bounding boxes with labels
- Report flow builds side-by-side RE/LE snapshot section and allows screenshot download.
- Instructions and patient modals open/close correctly, including backdrop-close behavior.
- Instructions now define the Amsler grid before giving the test method and the close control sits in a dedicated collision-free header position.
- App bar now meets required dimensions and icon placement.
- MCQ system works:
  - burger sidebar menu
  - primary/intermediate/advanced levels
  - list-based questions (no Next)
  - submit scoring + explanations + restart
  - primary bank capped at 5 items

## Remaining Work

- Add explicit regression checklist for touch drawing, compute overlays, report export and MCQ flows.
- Optional cleanup: move report inline HTML string to a template helper for easier maintenance.
- Consider local persistence for strokes if session continuity becomes a requirement.

## Known Limitations

- No persistent patient/session storage.
- Mark coverage is descriptive and not a validated diagnostic or disease-severity measurement.
- Independent review of the central-zone definition and closed-region semantics remains pending.

## Current Status

Stable modular static app with requested UI updates completed, including MCQ sidebar/list flow and updated documentation.

## Information popup consistency — 23 July 2026

- Retained the existing focus-managed `44 x 44px` close control.
- Standardised the version separator without changing guide content.

## Information-card typography and fit — 23 July 2026

- Applied the shared popup type hierarchy.
- Verified a `283.9px` card at `360 x 740` with no internal scrolling.
- Standardised the simple visible `v1` label and `23/7/2026` date in the shared bottom-right footer position.

- Verified the standard sidebar hierarchy, focus entry and Escape focus return at `360 x 740`.
- Added explicit MCQ pass marks and blocked unanswered submission. Verified an unanswered Advanced set leaves the Cup locked at `360 x 740`.

## Refactor clean-up completed — 26 July 2026

- [x] Removed the unused pre-normalisation analysis route and its private helpers.
- [x] Retained the pure tested Amsler engine as the sole Compute decision path.
- [x] Rebuilt and verified the generated classic bundle.
- [ ] Independent clinical sign-off remains external.
- [ ] Named physical-device acceptance remains external.

## MCQ clinical quality — 26 July 2026

- [x] Audited Primary 12, Intermediate 18 and Advanced 18.
- [x] Replaced 12 app-mechanics questions with sourced clinical teaching.
- [x] Removed repeated higher-tier decisions while preserving 12/18/18 bank and 6/8/8 attempt sizes.
- [x] Verified mutually exclusive Submit/New attempt actions and 44px option rows at `360 x 740`.
- [x] Captured unanswered, completed-review and retry screenshots with zero console or page errors.
- [ ] Independent clinical sign-off.
- [ ] Physical-device acceptance.
- [x] Added stable IDs, metadata, 44px rows, per-question review and a real new attempt.
- [ ] Independent clinical sign-off and physical-device acceptance remain external.
- 29/9/2026: Five approved interaction fixes implemented and tested. See `LOGIC_REVIEW_20260929.md`; 22 tests and bundle parity pass. Browser test case reset after review.
