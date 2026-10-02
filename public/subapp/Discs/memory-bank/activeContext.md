# Active Context

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

## Fleet repair receipt — 30 September 2026

Prevented inactive information-panel Escape handling from stealing focus after the drawer closes. Rebuilt the UI bundle. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## 29 September 2026 — audit fixes supersede the older coupling contract

Keep teaching DO/BIO and dilation independent of clinical Exam selectors. Patient dilation starts blank and resets blank. Preserve urgent findings with incomplete information but do not reassure from blank VA or disc size alone. BIO retinal rotation is 180 degrees, independent of RE/LE mirroring; edge labels follow mode. Mobile cataract uses the full optical filter. Failed images show retry feedback. Only the active cataract label is displayed. Current verification: 24 tests and bundle parity, plus isolated-browser evidence in `../output/engine-20260929.json`. Refract and retained Codex tabs were not changed. Clinical and physical-device sign-off remain pending.

## v1.1 implementation and UI polish (23/7/2026)

The approved fleet engineering pass is implemented without changing Discs clinical logic or accepted layout. It adds two-step operational reset, overlay focus restoration and modal trapping, keyboard finding tabs, scoped shell-first offline support, a reproducible bundle build and 13 regression contracts. The existing Dilation control coupling is preserved exactly. Lead desktop-browser review passed at `360 x 740`, including expanded Exam body scroll, routine action, reset, focus, local-font readiness, offline reload and a clean console. Direct-file physical-device verification, independent clinical review and physical-device acceptance remain pending.

The corrective UI pass establishes `12px` mode/case groups, a `16px` viewer and image stage and an `18px` Exam shell, with a stronger Exam heading and upright dynamic viewer values without changing the accepted body-scroll behaviour or panel order.

The fleet-alignment follow-up uses Swollen Discs as the mobile edge reference. At `360 x 740`, the black stage and Exam shell now share `10px` outer margins and `340px` width. The stage uses the shared `16px` radius and shadow while Exam remains an `18px` secondary panel. No clinical, viewer or assessment logic changed.

<!-- APP-DOC-STATUS:START -->

## Historical Memory Status (31/5/2026)

- Current focus: Discs app polish after Diabetic-app comparison.
- Browser target: `http://localhost:8081/Discs/`.
- The live image folder has been cleaned and verified.
- Practice modal thumbnails have been regenerated as clean crops.
- README and memory bank have been updated to remove copied Diabetic scope.
- New physiological/glaucoma disc sources from `Pys_disc` have been converted and wired.
- Diabetic lessons have been applied: stronger MCQ banks, clearer case count wording and tighter safety scope.
- Current triage polish separates cup/size context, fast glaucoma review and urgent true disc swelling.
- Current 360 x 740 polish locks background scrolling behind overlay-style surfaces.
- Current Action polish suppresses empty limitation text and avoids `Not dilated` for clear Arclight disc views.
- Whole-app review fixes route severe reduced VA without disc signs to `Soon`, hide the locked cup and require a pass/completion result before cup unlock.
<!-- APP-DOC-STATUS:END -->

Last updated: 30/9/2026

## Accepted Product Decisions

- App name is `Discs`.
- Correct working folder is `C:\Users\William\Desktop\Arclight App\Discs`.
- Ignore the older OneDrive copy unless explicitly asked.
- Appbar is black.
- Title and icon text are white.
- Working mobile size is `360 x 740`.
- The app keeps the Diabetic viewer shell but uses optic disc content.
- Use `Arclight (DO)` and `Holo (BIO)` as viewing modes.
- Keep Practice in the side drawer.
- Image cases are 20 optic disc cases split into 3 sets: General discs, Normal cups and Glaucoma.
- Keep output as referral support and teaching, not diagnosis.
- Do not imply a limited or ungradable disc view is normal.
- Use cropped thumbnails in the Image cases modal.
- Keep the full-size case images at `2915 x 2834`.
- Keep raw numbered source PNGs outside the live image folder.

## Current Implementation

- `index.html` has Discs metadata, `20 disc cases` drawer wording and optic disc quick guide copy.
- `script.js` has Discs guide wording and current UI wiring.
- `src/triage.js` keeps C/D 0.3 and disc size as context-only unless other concerning signs are recorded.
- `src/mcq-data.js` has expanded Diabetic-style banks: 16 Primary, 24 Intermediate and 24 Advanced items.
- `src/viewer-config.js` references `case-*` and `phys-*` assets with cache token `20260531-casesets`.
- `script.js` filters viewer and Practice modal cases by the active case set.
- `assets/images/discs` contains 60 live case WebP files.
- `discs/` contains user-provided named general-disc source images and is retained for reference.
- `tools/convert-numbered-disc-assets.py` reads from `tools/disc-image-sources`.
- `tools/convert-phys-disc-assets.py` reads from `assets/images/discs/Pys_disc`.
- Dead root contact sheets, old unused WebPs and obsolete green-background tooling have been removed.

## Recent Work Completed

- Copied app from Diabetic into `Discs`.
- Set appbar to black with white text and icons.
- Reworked popup copy for optic disc assessment.
- Added 9 disc cases with light and dark versions.
- Converted images to right-eye convention where required.
- Built full-size `2915 x 2834` WebPs.
- Removed green-border outputs and switched to extended retina backgrounds.
- Tuned full-size case scale to the current accepted size.
- Cleaned `assets/images/discs` to the original general disc live files.
- Regenerated practice thumbnails from clean source crops.
- Fixed the old 10-case label error in the practice modal.
- Converted and wired 11 physiological/glaucoma disc cases from `assets/images/discs/Pys_disc`.
- Reworked the physiological/glaucoma image edge treatment to remove the wide feathered vessel boundary.
- Added the case-set selector and grouped cases as General, Normal cups and Glaucoma.
- Added a stronger shared visual group for Normal cups and Glaucoma.
- Expanded MCQs after studying Diabetic's larger quiz banks.
- Added scope-lock wording to the README.
- Split urgent disc swelling from fast glaucoma review in action logic and guide copy.
- Fixed duplicate visible vertical scrollbar risk by locking page scroll behind popup, modal, drawer and expanded Action surfaces.
- Tightened Action sheet copy after review of a `Soon` pallor state at 360 x 740.
- Fixed whole-app review findings around reduced VA triage and Advanced quiz cup unlocking.
- Tidied dead generated files out of the app root and pointed future diagnostic contact sheets to `tools/generated-checks`.

## Next Useful Work

1. Review the glaucoma disc tab against the standalone Glaucoma app.
2. Run a final responsive sweep after further copy or image changes.
3. Consider Lighthouse checks once the app is clinically stable.
4. Keep README and memory bank updated with dated decisions.

## Watch Points

- Do not put raw PNGs back into `assets/images/discs`.
- Do not delete the user-provided `discs/` source folder unless explicitly asked.
- Do not regenerate thumbnails from the blended full-size images.
- Do not revert to diabetic wording.
- Do not change the accepted main case scale unless asked.
- Do not let C/D 0.3 or disc size context trigger referral wording by themselves.
- Keep high-risk glaucoma signs as fast glaucoma review rather than same-day swelling language.
- Keep generated contact sheets out of the app root.
- Use Desktop `Arclight App`, not the OneDrive folder.

## MCQ consistency status — 23 July 2026

Visible levels use Primary, Intermediate and Advanced. Existing optic-disc questions, attempt sizes and scoring remain unchanged. Cup unlocking now requires an explicit Advanced pass. Long teaching content may continue to use deliberate drawer scrolling.

## Current refactor status — 26 July 2026

Disclosure-only finding help no longer invokes the full assessment render. Dead helpers and orphaned advanced-view styles were removed, geometry tests were added and the rebuilt bundle has exact parity. Shared viewer extraction is deliberately deferred to avoid cross-app runtime or release coupling. Clinical behaviour and clinical review status are unchanged.

## MCQ pass — 26 July 2026

The 64-question bank retains its 16, 24 and 24 tier sizes and its 5, 6 and 8-question attempts. Stable IDs, source metadata and rationales now cover every item. App-mechanics wording and unsafe isolated-sign conclusions were removed or narrowed. MCQ presentation changed but triage, referral and viewer logic did not.

Final de-duplication separates basic view-quality and cup-size teaching from distinct decisions about rim anatomy, papilloedema signs, stereoscopy, multimodal drusen imaging, gonioscopy, central corneal thickness and serial comparability. The `20260726-mcq2` bundle and cache pass 20 contracts plus exact parity. Isolated `360 x 740` review passed unanswered, completed, retry, drawer settle, Escape, overflow, overlap and zero-error checks.
