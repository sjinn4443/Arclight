# Active Context

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

## Compute and icon follow-up (24/7/2026)

- `js/amsler-engine.js` is the pure source of truth for normalised mark coverage. Results are invariant to canvas resizing.
- Compute records the selected eye. Untouched eyes remain `Not assessed`; deliberately computed empty eyes report `No marks recorded`.
- Any drawing change replaces the old summary with `Changes not computed`, clears a stale report and disables Report.
- Results describe whole-grid, central-zone and outer-zone coverage. Closed Missing and Red mark outlines count their actual polygon interior. Line marks remain strokes.
- Runtime no longer infers `wavy` or `dark` from aspect ratio or density.
- The patient button uses a local head-and-shoulders silhouette. The app-bar information button uses the shared bare `i`.
- Asset version: `20260724-compute1`. The shell cache is `20260726-refactor2` so the shared `v1 · 23/7/2026` information footer reaches existing installations. Sixteen tests and bundle alignment pass.

Fleet edge follow-up, 23 July 2026: controls, canvas and result/report shells measure `x=10`, `width=340` at `360 x 740`; drawing and reporting behaviour are unchanged.

## v1.1 Engineering and UI Context (23/7/2026)

- Runtime fonts and html2canvas are local. Font Awesome is no longer required.
- The modular source is authoritative and `npm run build` regenerates `app.bundle.js`.
- Compute remains the explicit selected-eye action.
- A two-step drawer action starts a new assessment without clearing MCQ achievement.
- Dialog, drawer and MCQ keyboard and focus behaviour have been strengthened without rearranging the compact workflow.
- App-scoped manifest and service-worker support is available over HTTP or HTTPS. Direct-file launch remains supported without a worker.
- Lead desktop-browser review passed at 360 x 740 for untouched, marked, computed, report, reset, modal, MCQ and offline states. Clinical sign-off and physical-device testing remain pending.
- The information card now gives a concise definition of the Amsler grid and keeps its close control in the header with measured clearance at 360 x 740.
- Corrective UI review confirmed the intended radius hierarchy: `12px` toolbar shells, smaller inner controls and an `18px` result/report shell. Grid geometry and workflow order are unchanged.

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

## Current Focus

- Keep the current modular architecture stable (`canvas`, `analysis`, `report`, `ui`, `mcq`, `state`).
- Polish MCQ usability:
  - single-page list questions
  - no "Next" button flow
  - clean inline radio + option spacing
- Keep UI constraints explicit and locked:
  - app bar height `54px`
  - title `25px` bold
  - info icon inside app bar

## Recent Changes

- Added burger menu in app bar (left) with MCQ sidebar.
- Added tiered MCQ levels: `Primary`, `Intermediate`, `Advanced`.
- Converted MCQ flow to list format with one `Submit` and `Restart`.
- Set primary bank to 5 questions.
- Updated MCQ option styling to plain inline rows with neater spacing.
- Kept hidden stroke settings under `+` control (collapsed by default).
- Current Compute output uses:
  - `% of grid marked`
  - `% of central zone`
  - `% of outer zone`

## Next Steps

- Add a small manual regression checklist for:
  - draw + compute
  - report generation
  - MCQ open/submit/restart
- Consider extracting report HTML template from inline string into dedicated markup helper.
- Optional: tune MCQ modal width so long advanced options truncate less on small screens.

## Active Decisions

- Prefer low-risk refactors that preserve user-visible behavior.
- Keep all processing client-side.
- Keep report generation in-browser without external services.

## MCQ consistency status — 23 July 2026

Every question must be answered before grading. Pass marks are Primary 4/6, Intermediate 6/8 and Advanced 6/8. An explicit Advanced pass is required for the Cup. The unanswered Advanced path was verified at `360 x 740` and remained locked.

## 26 July 2026 — analysis clean-up

- Removed the unreachable legacy geometry, mask and defect-merging branch from `js/analysis.js`.
- Preserved the live normalised `analyseEyes` engine and current zone/region overlays.
- Rebuilt `app.bundle.js`; the 16-test suite and exact bundle check pass.
- Clinical sign-off and physical-device acceptance remain pending external gates.

## MCQ pass — 26 July 2026

All 48 authored questions now expose stable IDs, concise rationales, source IDs and pending clinical-review metadata. Twelve app-mechanics questions were replaced without changing bank or attempt sizes. Unanswered, completed-review, new-attempt and focus-return behaviour is now contract protected. Assessment and report logic were not changed.

Final content review removed repeated basic decisions from the higher tiers. Submit and New attempt now alternate rather than competing after grading. The `20260726-mcq2` bundle and cache passed 18 contracts plus exact bundle parity. Isolated `360 x 740` MCQ review passed unanswered, completed, retry, Escape, overflow and zero-error checks. Clinical sign-off and physical-device acceptance remain pending.

# Current follow-up — 29 September 2026

Latest evidence: `LOGIC_REVIEW_20260929.md`. Reports invalidate on Compute, metadata edits and report-mode changes. Pointer capture finalises the captured portion on release/cancel/lost capture. Preserve patient-view RE/LE labels, Red-mode contrast and single-pass overlays in redraw. Do not change the descriptive coverage engine. 22 tests and parity pass; HTTP interaction review completed at 360 × 740. Clinical and physical-device acceptance remain pending.
