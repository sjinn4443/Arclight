# Progress

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Targeted loading improvements — 30 September 2026

Menu imagery now uses 120 px WebP thumbnails loaded when the drawer opens. Full teaching cards load the untouched original images only when opened, with light and dark skin variants retained. Rebuild thumbnails with `py -3 tools/build-teaching-thumbnails.py`. Initial resource-body bytes: 1,180,801 → 402,935 (65.9% less). Mobile Lighthouse: 71 → 82/100 in separate same-day lab runs.

All nine main-page views at 360 x 740, 768 x 1024 and 1366 x 900 have no horizontal overflow or captured runtime errors. Targeted workflows pass over HTTP, direct-file and installed offline use. Amsler exports with patient/date metadata and a drawn grid mark pass first/repeated Download and mocked native Share; a deliberately failed library fetch recovers on retry. Allan full teaching-card variants and drawer thumbnails pass; Refract simple/advanced fields and completed output pass. These checks preserve functionality but do not claim exhaustive workflow or physical-device acceptance.

Full images and the export library remain precached for offline use, so the startup savings do not describe total offline installation traffic. Local asset queries and app-scoped caches were bumped. Browser tests use temporary viewports. The three retained preview tabs were each verified through real browser chrome at 360 x 740 after switching away and back; their intended loadingFix=20260930 URLs were re-read. Each started at 843 x 1192. Refract is the final selected preview. See [the scoped evidence receipt](../../LOADING_IMPROVEMENTS_20260930.md). This section supersedes the earlier three loading priorities, not the historical clinical review.

## Performance review — 30 September 2026

Runtime source retained. Image delivery is the main remaining load-time opportunity; hidden teaching imagery must keep its existing behaviour. Mobile Lighthouse performance: 70 → 71/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Larger dermoscopy-example controls with clearer line spacing; compact clinical arrangement retained.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

- [x] Fleet edge follow-up: principal mobile shells use `10px` margins and `340px` width without logic changes.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (21/7/2026)

- Static packaging: open `index.html` directly, or use HTTP for installable offline support and service-worker testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: purple `#a855f7` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 21/7/2026_

## Completed

- Copied Fundal Reflex visual language into Allan:
  - black app bar
  - purple title
  - compact white panels
  - dark image stage
  - soft borders and muted controls
- Tuned for `360 x 740`.
- Added side menu and quick guide popup.
- Added capture row:
  - Location
  - Close
  - Dermoscopy
- Added custom location picker with icons.
- Added skin type toggle with explicit `Skin type` caption.
- Added tab system:
  - Lesion
  - Dermoscopy
  - Rash
  - Wood's lamp
- Added stable comparison image sizing.
- Added reference image switching by tab.
- Added light/dark reference switching for Lesion and Dermoscopy.
- Added rash reference switching by Pattern and skin type.
- Added user-image empty state.
- Replaced hold expansion with persistent enlarged image comparison and an `X` close control.
- Added expanded teaching overlays for:
  - Lesion
  - Dermoscopy
- Teaching legends are clickable and reuse the shared explanation pop-up.
- ABCDEFG symptoms are handled as a separate note rather than an image callout.
- Removed the Dermoscopy teaching oval and kept numbered callouts only.
- Added low-key help icons and pop-ups for:
  - Lesion
  - Dermoscopy
  - Rash
  - Wood's lamp
- Changed visible wording so top tabs read `Lesion`, `Dermoscopy`, `Rash` and `Wood's`.
- Reworked Dermoscopy from the old internal BVPDS prompt to a Chaos + Clues teaching compression with chaos, colour, structure, edge growth, vessel / special site and exception rows.
- Kept `DPIC-R` as an Allan teaching prompt rather than a recognised formal score.
- Converted the route row into a compact real tab strip with ARIA tab semantics, arrow-key navigation, shared rail styling and a raised active tab.
- Kept a subtle inset accent on the raised active tab and capped the site picker width to give the skin-type control more breathing space.
- Removed main comparison-stage `Reference` and `Your image` captions to save vertical space.
- Reviewed and fixed clinical wording:
  - Yellow-orange for Pityriasis versicolor
  - wider red flag wording
  - simpler atypical-vessel wording
  - asymmetry includes shape or colour
  - the lesion checklist now follows A, B, C, D, E, F and G
  - Dermoscopy now uses chaos, malignant clues and exception rows
- Updated Dermoscopy referral logic:
  - chaos plus any clue maps to Susp cancer pathway (2 week wait)
  - dermoscopy exceptions map to Susp cancer pathway (2 week wait)
  - chaos alone prompts dermoscopy clue review
  - repeated Dermoscopy mini headings were replaced with row colour accents
- Added the Dermoscopy examples sidebar system with five light/dark image pairs in `dermoscopy-examples/`.
  - Dermoscopy bucket details now expand inline with chevrons instead of dense `i` popovers
  - expanded Dermoscopy bucket text now uses short GP-facing clinical reminders rather than repeated formal clue lists
- Added a side-menu Lesion teaching card that opens the light/dark ABCDEFG card full-screen.
- Added a side-menu Dermoscopy teaching card that opens the light/dark Chaos + Clues card full-screen.
- Added a Lesion reference carousel with previous/next arrows and five paired light/dark variation images.
- Toned down the Report button.
- Replaced Report placeholder alert with a copy and share report modal.
- Restyled Report as a Fundal Reflex style pop-out with `Copy note` and `Share note + photos`.
- Added a temporary-textarea copy fallback for browsers that block direct clipboard writes.
- Report now includes photo readiness and logic notes.
- Fresh load and cleared criteria now show `Not assessed yet`.
- Untouched report sections now show `not assessed` rather than default prompt scores.
- Split MCQ question banks into `mcq-bank.js`.
- Added Primary, Intermediate and Advanced MCQ banks.
- Added star progression and an Allan cup certificate unlock after Advanced MCQ completion.
- Updated first capture label from `Limb` to `Location`.
- Created README and memory-bank docs.
- Audited and corrected referral-state logic:
  - ABCDEFG remains a teaching prompt and no longer sets a suspected cancer pathway from its internal total
  - explicit SCC signs and qualifying dermoscopy findings still map to the suspected cancer pathway
  - equal-priority routes use deterministic action ranking rather than tab order
- Reworked rash assessment state:
  - every field starts explicitly unselected
  - clearing all fields returns to `Not assessed yet`
  - benign selections stay routine
  - concerning non-red-flag selections map to `Photo + Review`
  - only explicit red flags set same-day or emergency urgency
- Added an explicit Wood's lamp assessment selector and report output so tab navigation cannot create or erase recorded use.
- Made report photo expectations route-aware.
- Added route and skin-tone aware reference-image fallback behaviour.
- Added JPEG, PNG and WebP validation, a `12 MB` upload limit, read-error handling and an accessible upload status.
- Corrected completed-MCQ retry wording so it no longer claims Advanced is locked after all stars are unlocked.
- Split routine BCC-like features from additional SCC concerns for rapid growth, persistent ulceration or bleeding.
- Updated README and memory-bank documentation to match the corrected logic.
- Refreshed Quick Guide, referral-source and expanded teaching pop-up wording to match the corrected logic and current ABCDEFG naming.
- Added viewport-capped scrolling for long information pop-ups at handset sizes.
- Removed generated Playwright snapshots, dead JavaScript, unused CSS blocks and unused HTML data attributes.
- Removed redundant Google Fonts requests and replaced the Font Awesome CDN with a minimal locally bundled solid font and licence.
- Extracted referral priorities, action labels and shared clinical copy into `referral-logic.js`.
- Added 11 Node regression tests for teaching totals, BCC/SCC routing, dermoscopy sequence, rash red flags, tie handling and cross-route urgency.
- Resized and recompressed all 39 active WebP assets from `1254 x 1254` to `960 x 960`, saving approximately `3.51 MiB` with side-by-side visual review.

## Recent Verification

- `node --check script.js` passes.
- `node --check mcq-bank.js` passes.
- `node --check referral-logic.js` passes.
- `npm test` passes all 20 referral, MCQ and app-contract checks.
- `npm run test:ui` passes all three Chrome smoke tests, including service-worker offline reload.
- Browser checks in the Codex in-app browser passed for:
  - location picker open and selection
  - `Location` capture label
  - user-image empty state
  - info pop-up fit
  - Rash dark skin layout
  - report blank state and report output
  - ABCDEFG teaching overlay
  - Dermoscopy teaching overlay
  - ABCDEFG teaching totals versus explicit SCC routing
  - benign, concerning, same-day and emergency rash states
  - rash reset to `Not assessed yet`
  - equal-priority route resolution
  - Wood's lamp recorded and unrecorded report states
  - Wood's lamp compact layout at `360 x 740`
- no console errors in recent flows
- no missing runtime files, duplicate IDs, dead JavaScript functions or unused CSS variables
- no runtime CDN URLs remain
- Arm and leg location choices now use bespoke anatomy marks, replacing the fist and whole-person approximations.
- The additional SCC warning now fits one line at `360 x 740` while its detail panel retains the full rapid-growth, persistent-ulceration and unexplained-bleeding explanation.
- DOM contract check passes with no duplicate IDs, missing controlled targets or missing literal script ID references.
- MCQ retry and image validation branches were checked in an isolated JavaScript context.
- Replaced base64 capture storage with original files plus revocable object URLs.
- Added two-step New assessment reset, privacy guidance and route-aware photo readiness.
- Added full keyboard listbox navigation and fixed the picker closing during internal scroll.
- Added v1.2 PWA manifest, complete offline asset cache, clinical review record and constrained-device checklist.
- Added a standalone v1.2 sprint upgrade playbook that separates reusable cross-app engineering patterns from Allan-specific clinical content.

## Remaining

- Consider rash teaching overlays only if they remain morphology-based and do not imply diagnosis.
- Decide whether to rename `limbImage` and related internals to `locationImage`.
- Obtain independent clinical sign-off and complete physical constrained-device testing.

## Information popup consistency — 23 July 2026

- Corrected Quick Guide focus entry and return.
- Added an effective `44 x 44px` close target without enlarging the visible control.
- Preserved all clinical copy, links and version information.

## Information-card typography and fit — 23 July 2026

- Applied the shared `14px` title, `12.5px` body, `11px` label and `10.5px` version scale.
- Kept route detail and clinical sources in native disclosures without removing content.
- Verified the `590.7px` initial, `378.7px` route-detail and `296.3px` source states at `360 x 740`; all fit without internal scrolling.
- Standardised the simple visible `v1` label and `23/7/2026` date in the shared bottom-right footer position.

## Main-page typography review — 23 July 2026

- Equalised the four assessment-tab labels at `10.88px`.
- Raised the smallest tertiary labels to the fleet `10–10.4px` range.
- Verified the fresh main page at `360 x 740` without horizontal overflow or console errors.

- Standardised sidebar type roles and verified focus entry, Escape closure and trigger-focus return at `360 x 740`.
- Standardised the three MCQ level labels without changing Allan's questions, scoring or clinical content.

## Report icon follow-up — 24 July 2026

- Added Amsler's complete red circular `R` badge to Allan's result-bar Report button.
- Preserved the existing button dimensions, report behaviour and clinical logic.
- Versioned the stylesheet and service-worker cache as `20260724-report5`.
- Rendered the badge as a local inline SVG so the circle is not dependent on a newly downloaded stylesheet.
- Renamed the SVG class to prevent stale badge CSS from producing a double circle.
- Corrected versioned shell-asset handling to refresh from the network before using an offline fallback.
- All 21 contract, cache, MCQ and referral tests pass.
- Isolated `360 x 740` Chrome review found an `81.7 x 34px` Report button with a `22px` circular badge, exact `360px` document width and no console errors.

## Refactor hardening completed — 26 July 2026

- [x] Allan cache cleanup cannot delete sibling-app caches.
- [x] Original patient-photo files and revocable preview URLs are managed outside the main controller.
- [x] New photo-store unit tests pass with referral, MCQ and app-contract tests.
- [ ] Independent clinical sign-off remains external.
- [ ] Named physical-device acceptance remains external.

## Lighthouse remediation completed - 27 July 2026

- [x] Replaced the oversized initial reference with a checked `480 x 480` preview while preserving full resolution on expand.
- [x] Corrected the route-tab container semantics.
- [x] Raised meaningful compact text to a collision-free `12px` floor.
- [x] Passed 28/28 Node checks and isolated `360 x 740` review with no console error.
- [x] Reached Lighthouse `76 / 100 / 100 / 100` and `99.07%` legible text.
- [ ] Independent clinical sign-off and named physical-device acceptance remain external.

## 360 x 740 scrollbar correction completed — 26 July 2026

- [x] Reproduced the Lesion route at `744px` in a `740px` viewport.
- [x] Removed the 4px document overflow through a Lesion-only short-screen shell-gap adjustment.
- [x] Preserved every card, control, workflow and clinical rule.
- [x] Added all-route and direct-file no-overflow browser checks.
- [x] Passed 26/26 Node checks and 5/5 Playwright checks.
- [ ] Independent clinical sign-off remains external.
- [ ] Physical-device acceptance remains external.

## MCQ clinical-quality audit completed — 26 July 2026

- [x] Rechecked all 53 source-labelled prompts and answers without inventing clinical changes.
- [x] Added stable question IDs and pending clinical-sign-off metadata.
- [x] Added complete-answer focus handling, `44px` answer rows and a fresh retry action.
- [x] Preserved tier counts, sample sizes, pass marks, stars and cup unlock.
- [x] Passed 26/26 Node checks and 6/6 Playwright checks.
- [x] Captured the marked Primary state at `360 x 740`.
- [ ] Independent clinical sign-off remains external.
- [ ] Named physical-device acceptance remains external.
