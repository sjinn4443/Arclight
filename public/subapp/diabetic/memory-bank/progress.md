# Progress

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests. The receiving repository uses the lowercase diabetic route; Gallery links and metadata match it.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Production bundle minified from its canonical source. Shipped JavaScript: 167,895 → 89,861 bytes. Mobile Lighthouse performance: 85 → 92/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Viewer navigation and recording controls enlarged; collapsed desktop recording state remains a compact centred column.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## v1.1 Engineering and UI Pass (23/7/2026)

- Added confirmed operational assessment reset with teaching-state retention.
- Added focus restoration and containment for the drawer and modal surfaces.
- Replaced inaccurate tab semantics with a viewing-mode radiogroup.
- Expanded compact control hit regions without rearranging the mobile geometry.
- Added local manifest, scoped service worker, reproducible app-local build and 20 Node tests.
- Rebuilt `app.bundle.js` from `script.js` and `src/`.
- Automated checks pass. Lead desktop-browser review at 360 x 740, offline reload and clean-console checks pass. Independent clinical sign-off and physical-device acceptance remain pending.
- Corrective UI polish and versioned-cache verification pass with `360px` document width and no horizontal overflow.
- Follow-up comparison with Swollen Discs aligned the stage and Exam shell to `10px` mobile edges and `340px` width while preserving all internal geometry and logic. The full test suite, syntax check and build pass.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (21/5/2026)

- v1 app review completed on `21/5/26`.
- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Main screen: image-led diabetic case practice viewer using the Swollen Discs draggable circular viewing engine.
- Case assets: ten expanded WebP diabetic cases in `assets/images/diabetic/`, with thumbnails plus light and dark pigmentation support.
- Viewer controls: `<` / `>` case navigation, icon-only case information, R/L orientation, Gaze, Dilated, Skin and full-width Adv controls for cataract blur and nystagmus.
- Arclight (DO): compact direct-view simulation.
- Holo (BIO): wider lens-style view; corneal reflection is hidden; field is `15 deg` undilated and `25 deg` dilated, and switching to Holo does not automatically switch Dilated on.
- Exam system: RE and LE VA, View, Findings and Action live in one separate compact Exam box below or beside the viewer.
- Findings: paired per-eye dropdowns are both labelled `Findings` and group no referable signs, DR signs, macula risk and proliferative signs with mini explanations.
- Action logic: outputs `Routine (weeks)`, `Soon (days)`, `Urgent (today)`, `Ungradable (repeat)` or `Record both eyes` using green, orange, red and neutral chips, with a compact `+` expander for details.
- Quick guide, side drawer, practice cases, findings guide and referral note follow the Fundal Reflex compact UI pattern.
- Quick guide popup shows `v1 21/5/26` at bottom right.
- MCQs use Primary, Intermediate and Advanced banks. Engineering checks protect bank counts, answers, metadata and rendering while independent clinical sign-off remains pending.
- Final UI polish: equal-width VA/View selects, lighter select text and muted mid-grey Temporal/Nasal canvas labels.
- Responsive checks completed at `360 x 740`, `768 x 1024`, `1024 x 768` and `1366 x 768`.
- Latest Lighthouse: mobile `90 / 100 / 100 / 100`; desktop `100 / 100 / 100 / 100`.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Favicon: black square with a centred red `D`.
<!-- APP-DOC-STATUS:END -->

Last updated: 21/5/2026

## Current Status

v1 app review completed on 21/5/26. The app is built, image cases are wired, light and dark pigmentation support is available and final responsive checks have passed.

## Completed

- Created `Diabetic/README.md`.
- Defined DR-only scope.
- Chose black appbar with red title and red icons.
- Defined Arclight (DO) and Holo (BIO) clinical modes.
- Defined dilation as a prominent View-panel state rather than a separate mode.
- Studied Allan's tab system and added real tab semantics for Arclight (DO)/Holo (BIO).
- Defined both-eye recording with per-eye view quality, VA, area seen and findings.
- Defined view quality, per-eye findings and action flow.
- Defined conservative referral categories.
- Replaced the old routine DR assessment wording with `Routine (weeks)`.
- Clarified `Routine (weeks)`, `Soon (days)` and `Urgent (today)` boundaries.
- Added Cataract-style compact right and left distance VA dropdowns to the plan.
- Added BP, lipids and HbA1c tick-boxes to the plan.
- Moved Practice out of the main clinical tab rail and into the side drawer.
- Added image-first practice plus MCQ practice plan.
- Added red-flags-win popup wording.
- Added diabetes/medical review prompt when routine diabetes care is not available.
- Fixed triage priority so proliferative signs in one eye override an ungradable fellow eye.
- Tightened routine-clear wording so both eyes must be adequate before reassuring output.
- Added explicit VA thresholds.
- Removed active-eye and per-eye summary chips; Findings now uses right and left dropdown summaries.
- Added mutual exclusivity for `No referable signs seen` and lesion findings.
- Removed drawer-mode duplication from the MVP plan.
- Defined and wired the final diabetic image case set.
- Added MCQ setup based on previous apps: Primary, Intermediate, Advanced, bank counts, sampled round sizes, pass marks and modal UI.
- Added full memory-bank structure.
- Created `index.html`, `styles.css`, `script.js` and `src/` modules.
- Implemented Fundal-style appbar, side drawer, info popup, modal pattern and compact panels.
- Added local Inter and Quicksand font files from the Fundal Reflex pattern; the appbar title uses Quicksand.
- Reworked the phone layout so the main clinical screen fits in one `360 x 740` viewport without page scrolling.
- Replaced long main-screen wording with compact labels and chips; longer text remains in guide, practice and referral note surfaces.
- Matched the Fundal Reflex appbar sizing more closely: fixed `54px` header, `44px` icon targets, Quicksand title and `21px` info glyph.
- Restyled the quick guide popup to the Fundal Reflex popover pattern.
- Rolled up the Action section by default and moved the referral note button into the expanded details.
- Implemented Allan-style `Arclight (DO) | Holo (BIO)` tabs with ARIA state and keyboard navigation.
- Implemented right/left eye recording, Distance VA dropdowns, right/left view dropdowns and right/left findings dropdowns.
- Simplified dilation to a Fundal Reflex-style `Dilated` switch, with non-dilated limitations in Action and referral note.
- Implemented action triage, referral-note modal and BP, lipids and HbA1c tick-boxes.
- Implemented image practice cases in the drawer using final diabetic thumbnails.
- Implemented Primary, Intermediate and Advanced MCQ modals with sampled rounds and pass marks.
- Added data-test-friendly finding values and aria labels.
- Added inline favicon to avoid a local 404 console error.
- Fixed ungradable priority so an ungradable fellow eye with no higher-risk signs cannot become reassuring or routine by VA alone.
- Verified MCQ bank counts and answer indexes.
- Verified the app in browser at `360 x 740`.
- Renamed the recording system from `Assessment` to `Exam`.
- Replaced the Action `More` button with a compact `+` expander.
- Equalised RE/LE VA and View dropdown widths and reduced select text weight.
- Simplified findings dropdown labels to `Findings` for both RE and LE.
- Muted the canvas Temporal/Nasal labels to mid-grey.
- Audited MCQs so content stays clinical rather than app-navigation focused.
- Matched the MCQ modal to fleet behaviour: scrolling questions, fixed green `Submit` button and question-card borders clear of the legend text.

## Not Started

- Local pathway wording customisation beyond the default v1 labels.
- Further image compression only if deployment size becomes a practical issue.

## Open Questions

- Local pathways may later customise `Soon (days)` and `Urgent (today)` wording. MVP should keep labels in constants.

## Implementation Risks

- The app could overclaim what Arclight (DO) can exclude.
- The flow could become too long for `360 x 740`.
- Drawer practice could accidentally blur into clinical mode.
- Mode switching could leave Holo-only area state active in Arclight (DO) if not handled explicitly.
- Red could dominate the UI if used for every DR item.
- Future asset replacement could cause layout shift if card dimensions are not fixed.

## Verification Completed

- Phone viewport `360 x 740`: main UI fits cleanly without unwanted horizontal overflow.
- Tablet portrait `768 x 1024`: stacked viewer and Exam layout checked.
- Tablet landscape `1024 x 768`: side-by-side viewer and Exam layout checked.
- Laptop `1366 x 768`: side-by-side layout checked.
- Browser interaction sweep: case switching, Skin, Holo, case information and reload all passed.
- Console: no errors in the final sweep.
- Lighthouse mobile: `90 / 100 / 100 / 100`.
- Lighthouse desktop: `100 / 100 / 100 / 100`.
- Appbar, drawer, quick guide, modal shells, referral note and findings guide align with the Fundal Reflex compact UI pattern.
- Triage spot checks: record-both-eyes, ungradable, routine, soon and urgent paths behave as intended.
- MCQ bank counts and answer indexes remain valid.
- MCQ sampled rounds and fixed submit layout were rechecked after the final audit.

## Verification Still Useful Later

- Visual review against final supplied clinical images.
- Manual comparison against Fundal Reflex once the user has reviewed the feel.
- Offline launch on the target device or deployment package.

## Information popup consistency — 23 July 2026

- Retained focus management and the existing effective `44 x 44px` close target.
- Standardised the guide version separator and four-digit year.
- Preserved assessment, viewer and referral behaviour.

## Information-card typography and fit — 23 July 2026

- Applied the shared popup type hierarchy.
- Verified a `643.9px` card at `360 x 740` with no internal scrolling.
- Standardised the simple visible `v1` label and `23/7/2026` date in the shared bottom-right footer position.

- Verified the standard sidebar hierarchy and keyboard focus lifecycle at `360 x 740`.
- Standardised MCQ level labels and hardened the Cup pass contract without changing the authored bank or diabetic-retinopathy logic.

## Refactor completion — 26 July 2026

- Added local finding-detail rendering without triage recomputation.
- Removed verified unused controller and triage helpers plus orphaned legacy viewer CSS.
- Added viewer geometry and disclosure-route contracts.
- Rebuilt `app.bundle.js` and verified exact parity.
- All 20 automated tests and source-to-bundle parity pass. Independent clinical review and physical-device testing remain pending.

## MCQ quality completion — 26 July 2026

- Corrected one invalid multi-answer item and narrowed ambiguous cotton-wool spot, venous-beading and app-action wording.
- Added stable IDs, explanations, source metadata and validation for duplicate prompts, duplicate answers and unknown sources.
- Added a real retry/new-attempt flow, full result visibility and reliable focus return to the menu button.
- Verified the untouched guard, failed attempt, explanations, retry, Escape, `360 x 740` overflow and clean console in an isolated browser session.

## Lighthouse loading remediation - 27 July 2026

- [x] Removed only the automatic initial neighbour-image prefetch.
- [x] Preserved post-navigation prefetch and the established offline asset set.
- [x] Rebuilt the bundle and confirmed exact SHA-256 parity.
- [x] Passed 21/21 tests and clean `360 x 740` layout review.
- [x] Reduced Lighthouse initial transfer from about `2.26 MiB` to `483 KiB`.
- [ ] Independent clinical sign-off and physical-device acceptance remain pending.
