# Progress

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Production bundle minified from its canonical source. Shipped JavaScript: 189,016 → 104,056 bytes. Mobile Lighthouse performance: 87 → 93/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Viewer navigation and recording controls enlarged; collapsed desktop recording state remains a compact centred column.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## v1.1 completed engineering and UI work (23/7/2026)

- Preserved all triage priorities, action and referral wording, copied internal IDs, 20 teaching cases and user source assets.
- Added a two-step operational-only assessment reset which retains viewer, mode, coupled dilation and achievement state.
- Added modal focus trapping and opener restoration, drawer and Quick guide focus restoration, Quick guide outside-tap close and complete finding-tab keyboard behaviour.
- Added local manifest and Discs-scoped shell-first/runtime service worker.
- Added pinned esbuild toolchain plus 13 Node built-in logic and static contracts.
- Rebuilt `app.bundle.js` from source.
- Automated contracts and syntax checks pass.
- Lead desktop-browser review at 360 x 740, offline reload, focus, reset and clean-console checks pass. Direct-file physical-device acceptance, physical-device testing and independent clinical sign-off remain pending.
- Corrective UI polish and versioned-cache verification pass with `360px` document width and no horizontal overflow.
- Follow-up comparison with Swollen Discs aligned the stage and Exam shell to `10px` mobile edges and `340px` width while preserving all internal geometry and logic. The full 13-test suite and build pass.

<!-- APP-DOC-STATUS:START -->

## Historical Memory Status (31/5/2026)

- Discs app is live locally at `http://localhost:8081/Discs/`.
- Image folder has been cleaned and verified.
- Root-folder dead files and obsolete generated checks have been removed.
- Practice thumbnails have been regenerated as clean crops.
- README and memory bank now describe Discs rather than Diabetic.
- 11 physiological/glaucoma disc cases have been converted from `Pys_disc` and wired.
- Diabetic-app lessons have been applied to quiz depth, safety wording and drawer clarity.
- Triage now separates cup/size context, fast glaucoma review and urgent disc swelling.
- 360 x 740 overlay scrolling now locks the background page to avoid duplicate visible scrollbars.
- Action sheet review removed over-broad `Not dilated` wording and empty limitation placeholders.
- Whole-app review fixes route severe reduced VA to `Soon`, prevent failed Advanced quiz cup unlock and hide the locked cup card.
<!-- APP-DOC-STATUS:END -->

Last updated: 30/9/2026

## Completed

- Copied the Diabetic app into a new `Discs` folder on the Desktop Arclight app root.
- Corrected work location after the OneDrive/Desktop confusion.
- Set appbar to black with white title and icon text.
- Kept mobile target at `360 x 740`.
- Updated quick guide popup for optic disc assessment.
- Added the original general optic disc set:
  - normal disc.
  - disc swelling.
  - diffuse atrophy.
  - cupped disc.
  - temporal atrophy.
  - disc drusen.
  - hypoplasia.
  - morning glory.
  - myelination.
- Added light and dark assets for every case.
- Converted all live case assets to WebP.
- Kept all full-size case images at `2915 x 2834`.
- Tuned full-size case scaling to the current accepted size.
- Removed the visible green edge problem by using extended retina backgrounds.
- Cleaned `assets/images/discs` down to the original general disc live files.
- Moved raw numbered PNG sources to `tools/disc-image-sources`.
- Removed old unused WebPs and obsolete root-level contact sheets.
- Updated the conversion script to read sources from `tools/disc-image-sources`.
- Regenerated thumbnails as clean `480 x 360` crops.
- Fixed the old 10-case label error in the practice modal.
- Bumped the cache token for the cropped thumbnail pass.
- Rebuilt `app.bundle.js`.
- Converted 11 `Pys_disc` light/dark pairs to `phys-*` WebPs.
- Added C/D 0.1, 0.3, 0.5 and 0.7 cases plus physiological cup variants and tilted disc.
- Bumped the cache token to `20260531-casesets`.
- Removed the wide feathered physiological/glaucoma asset edge and regenerated the set slightly more zoomed out.
- Reduced the physiological/glaucoma asset scale again to `0.72` after browser review.
- Replaced mirrored physiological/glaucoma extension with non-mirrored edge extension and reduced scale to `0.64`.
- Reduced the physiological/glaucoma asset scale again to `0.58` after browser review.
- Set the physiological/glaucoma asset scale to `0.52`.
- Added a low-strength blended physiological/glaucoma background with a small feather for the Holo view.
- Added case-set selection for General, Normal cups and Glaucoma in the viewer and Practice modal.
- Grouped Normal cups and Glaucoma visually as cup-assessment sets.
- Changed drawer wording to `20 disc cases`.
- Expanded MCQ banks to 16 Primary, 24 Intermediate and 24 Advanced items.
- Added README scope lock clarifying that Discs is not a diagnostic glaucoma calculator, formal optic nerve assessment, field test or OCT replacement.
- Split action logic so C/D 0.3 and disc size context do not trigger referral by themselves.
- Split urgent true disc swelling from fast glaucoma review for C/D 0.9, notch, splinter haemorrhage, lamina and bayoneting.
- Suppressed dilation limitation wording while the action is still just incomplete recording.
- Added scroll locking for popup, modal, drawer and expanded Action surfaces.
- Shortened Action safety wording and kept Holo/BIO undilated as the relevant dilation limitation.
- Changed severe reduced VA without selected disc signs from green routine review to orange `Soon`.
- Changed cup achievement unlock detection so a failed score does not count as completion.
- Hid the locked cup achievement card in the drawer and bumped achievement storage to v2.
- Rebuilt `app.bundle.js` again after wiring 20 cases.
- Removed `.playwright-mcp`, obsolete green-background tooling, old unused image parking and generated root contact sheets.
- Updated conversion scripts so future diagnostic contact sheets go to `tools/generated-checks` rather than the app root.

## Verification

Verified on `31/5/26`:

- `assets/images/discs` contains 60 live case WebP files.
- There are no extra files in the live image folder.
- There are no missing live images.
- All light images are `2915 x 2834`.
- All dark images are `2915 x 2834`.
- All thumbnails are `480 x 360`.
- All 60 live case image files are present with expected dimensions.
- The Image cases modal uses the cropped thumbnail assets.
- The Image cases modal labels should match the active set: `1/9`, `1/5` or `1/6`.
- Primary, Intermediate and Advanced quiz modals should render `5`, `6` and `8` questions from larger banks.
- Drawer Practice item should read `20 disc cases`.
- Browser console shows no errors after reload.
- Source-level triage checks passed for incomplete recording, context-only cups, C/D 0.9 and swollen disc actions.
- Live browser triage checks passed for blank recording, context-only C/D 0.3, C/D 0.9 fast glaucoma review and urgent swollen disc.
- Live 360 x 740 browser checks passed for main view, Quick guide, Image cases and expanded Action scroll locking.
- Live 360 x 740 browser check passed for a `Soon` pallor action sheet without clipped text, `Not dilated` clutter or empty limitation wording.
- Live browser check confirmed failed Advanced quiz stays locked and the locked cup block is not visible.
- App root now contains only the main app files plus `assets`, `discs`, `memory-bank`, `src` and `tools`.
- `tools` now contains only the current conversion scripts and numbered source folder, with generated checks created only when scripts are rerun.

## Remaining Work

- Review the glaucoma disc tab against the standalone Glaucoma app popups.
- Run a final responsive sweep after further copy or image changes.
- Consider Lighthouse checks once the app is clinically stable.

## Current Risks

- Some copied Diabetic naming remains in internal identifiers such as `DIABETIC_IMAGE_CASES`; this is cosmetic but could confuse future maintenance.
- Any future thumbnail regeneration must use clean source crops, not the blended full-size images.
- Keep true disc swelling and fast glaucoma review separate in future copy changes.

## Information popup consistency — 23 July 2026

- Added an effective `44 x 44px` Quick Guide close target.
- Standardised the guide version separator and four-digit year.
- Preserved disc triage, viewer and referral behaviour.

## Information-card typography and fit — 23 July 2026

- Applied the shared `14px` title, `12.5px` body, `11px` label and `10.5px` version scale.
- Kept the complete long-form reference in a native More detail disclosure.
- Verified the `489.6px` initial card and `423.3px` expanded detail card at `360 x 740`; neither required internal scrolling.
- Standardised the simple visible `v1` label and `23/7/2026` date in the shared bottom-right footer position in both states.

- Verified the standard sidebar hierarchy and keyboard focus lifecycle at `360 x 740`.
- Standardised MCQ labels and restricted Cup unlocking to an explicit Advanced pass while preserving the existing bank and scoring.

## Refactor completion — 26 July 2026

- Added local finding-detail rendering without triage recomputation.
- Removed verified unused controller and triage helpers plus orphaned legacy viewer CSS.
- Added viewer geometry and disclosure-route contracts.
- Rebuilt `app.bundle.js` and verified exact parity.
- All automated tests passed. Independent clinical review and physical-device testing remain pending.

## MCQ clinical quality — 26 July 2026

- Audited all 64 questions across three tiers.
- Added stable IDs, source metadata and concise rationales.
- Removed repetitive limited-view, drusen, context and physiological-cup stems while preserving 16/24/24 banks and 5/6/8 attempts.
- Verified the drawer settles before MCQ opening and result/action blocks cannot overlap.
- Verified unanswered, completed review, New attempt and Escape focus return at `360 x 740` with zero console or page errors.
- Independent clinical sign-off and physical-device acceptance remain pending.
- Added correct/wrong review, unanswered focus, visible result hierarchy and `New attempt`.
- Preserved bank sizes, attempt sizes, pass marks and all operational clinical logic.
- Independent clinical review and physical-device testing remain pending.
