# Progress

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Production bundle minified from its canonical source. Shipped JavaScript: 211,173 → 121,120 bytes. Mobile Lighthouse performance: 85 → 94/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Refraction trigger enlarged; established teaching arrangement retained.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## Netlify folder configuration, 3 September 2026

- Added `netlify.toml` to the existing Sauron folder with `publish = "."` and the existing `npm run build` command.
- Removed the unchanged temporary `dist` and ZIP copies created during upload troubleshooting.
- Parsed the configuration and confirmed all 48 local resource references resolve within the publish folder.
- Existing runtime contracts passed and syntax checks passed for all 28 JavaScript files. The build and bundle-parity check were not rerun; simulator files are unchanged. A live Netlify deployment has not been performed.

## Logic-integrity follow-up, 25 July 2026

- Removed systematic hidden-axis disclosure from timed tests by restoring the visible pre-round streak angle.
- Constrained Baby timed tests to cases in the Baby catalogue.
- Corrected stacked case and safety dialog semantics, focus restoration and background suspension.
- Clarified the ACG warning and summary while preserving the exaggerated vertical oval.
- Rebuilt the bundle and advanced the app cache to `20260725-logic1`.
- Passed build, contract tests, lint and an isolated `360 x 740` browser review.

## 25 July 2026

- Corrected four approved teaching-tier assignments and regrouped numbering to `5 / 10 / 13`.
- Added accessible warning controls and a compact safety dialog for four defined cases.
- Rebuilt `app.bundle.js` and advanced the scoped cache to `20260725-cases2`.
- Build, contracts and lint pass. Fresh HTTP review at `360 x 740` found no overflow, marker collisions or console errors.
- Direct-file interaction passes, with Chromium local-font CORS noted as a route limitation.
- Independent clinical review, physical-device review and installed cold-offline review remain pending.

- [x] Eye-engine follow-up: radial pupil-response target protected by pure contracts.
- [x] Paired pupil and upper-lid controls announce RE and LE.
- [x] Final bundle rebuilt and `npm run build`, `npm test` and `npm run lint` passed.
- [x] Fresh HTTP browser review passed at `360 x 740` with no warnings or errors.
- [ ] Independent clinical sign-off and physical-device review remain pending.

- [x] Fleet edge follow-up: control deck and stage use `10px` margins and `340px` width.

## 23 July 2026

- [x] Added confirmed whole-simulator reset
- [x] Added active-eye accessibility state
- [x] Added manifest and scoped offline worker
- [x] Added build, syntax and contract checks
- [x] Added exact `360 x 740` browser-review harness
- [x] Added clinical and device status documents
- [ ] Independent clinical sign-off
- [ ] Physical-device and installed offline checks

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: black `#111111` on an orange-red appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

## What Works

- Interactive retinoscopy controls:
  - direct sweep handle
  - direct rotate handle
  - refraction case state
  - active-eye switching
- Active-eye targeting with correct examiner orientation:
  - `RE` -> screen-left
  - `LE` -> screen-right
- Top-level controls:
  - `Colour` slider with blue and red anchors
  - `Gaze` switch
  - `Dilated` switch
  - `Baby` switch
- Advanced panel:
  - squint drag-eye switch
  - left and right pupil sliders
  - left and right lid sliders
  - cataract slider
  - nystagmus slider
- Gaze mode now follows the Fundal Reflex action more closely:
  - timeout-based gaze shifts
  - small face translation and tilt
  - temporary lid droop on larger looks
  - random blink and double-blink scheduling
  - fixed examiner-owned beam position while the eyes move
- Lid timing now follows Fundal Reflex baseline rules:
  - transient blink or droop height cannot become the resting lid height
  - `Baby` alone does not trigger the slower blink model
  - `Baby` initialisation does not reset blink timers unless the mode actually changes
- Dilated mode enlarges pupils and restores the previous pupil values when disabled.
- Baby mode changes stage proportions and filters the visual case list to baby-relevant cases.
- Nystagmus moves the eyes while the examiner-owned streak and reflex logic remain stable.
- Stage-mounted case pill works with:
  - previous button
  - next button
  - modal trigger
  - answer masking in test mode
- Fundal-style visual case picker works with:
  - large stacked cards
  - Primary, Intermediate and Advanced sections
  - similar-case helper
  - selected-card state
  - full WebP thumbnails
- Shared case order now starts with `Neutral (0)` as case `1`.
- Case library currently presents 28 cases:
  - 6 Primary
  - 8 Intermediate
  - 14 Advanced
- Tiered MCQ flow works with:
  - Primary
  - Intermediate
  - Advanced
- Timed `test me` flow works:
  - random condition selection
  - staged countdown sequence
  - hidden case answer during countdown
  - answer reveal with axis detail where relevant
  - immediate repeat avoidance
- Modal accessibility is centralised through shared focus-trap and body-lock logic.
- Reduced-motion preference is respected in startup motion handling.
- Structural pupil and iris cases work, including:
  - `ACG`
  - `Aniridia`
  - `Small pupils`
  - `Nasal coloboma`
  - `Iris transillumination`
- Media and fundus condition library works, including:
  - posterior subcapsular cataract
  - posterior pole cataract
  - posterior capsular thickening after `IOL`
  - dense cataract
  - floaters
  - vitreous haemorrhage
  - leucocoria
  - partial retinal detachment
- Pupil clipping is more robust on iOS/WebKit through explicit ellipse clipping and mask fallback.
- Fundal-style corneal reflex sizing and movement now works in Sauron.
- All runtime images and generated visual assets are WebP.

## Recently Completed

- Fundal Reflex UI review and Sauron alignment pass.
- Advanced panel cleanup after review feedback.
- Modifier controls changed back to switch controls.
- Case pill rebuilt to avoid oversized level letters and mismatched arrows.
- Visual case cards resized to match the Fundal-style layout more closely.
- Thumbnails regenerated with hidden streak cue handles.
- High-minus thumbnail crop corrected and rechecked against the other primary cases.
- Corneal reflex system copied from Fundal Reflex and thumbnails regenerated from it.
- Fundal Reflex gaze, blink, lid-droop and face-tilt behaviour copied into Sauron.
- Startup eye animation simplified to avoid first-render timing races.
- Eyelid baseline and timer restore logic matched to Fundal Reflex.
- Case ordering updated so Primary begins with `Neutral (0)`, then simple minus/plus and higher-power examples.
- Retinoscopy beam anchoring corrected so gaze no longer recentres the beam.
- Retinoscopy engine now reads the rendered streak centre during gaze-driven eye movement.
- Runtime cue SVGs converted to WebP.
- Remaining PNG verification files converted to WebP.
- Documentation updated to match the current codebase.
- Full review pass completed across main UI, Advanced, side menu, cases, MCQs and timed test mode.
- Collapsed `Adv` layout tightened so hidden controls no longer create offscreen width.
- Mobile modifier switches adjusted so `Dilated` no longer clips at `360px`.
- Top control deck rebuilt to match Fundal Reflex:
  - colour card separated from the modifiers
  - modifier switches placed in their own row
  - collapsed `Adv` changed back to a rotated vertical dock
- Top control deck CSS rechecked against the Fundal Reflex source and aligned beyond structure:
  - shared `--radius-control`
  - Fundal border, background and shadow rules
  - Fundal modifier switch sizing and mobile gaps
  - Fundal checked-switch red
  - Fundal vertical `Adv` dock styling
- Fellow-eye corneal reflection changed back to Fundal live sizing:
  - `is-ret-fellow::after` no longer shrinks the dot to `3px`
  - the fellow dot now uses the same `5px` size and `1.5px` border as the examined eye
- All 28 visual case thumbnails regenerated from the current engine after the fellow-eye corneal reflection fix.
- Case thumbnail cache key updated to `20260507-fellow-corneal`.
- Removed the one-off local-server helper so Sauron keeps the same direct `index.html` handover shape as the other apps.
- Info modal date changed to `18/5/2026`.
- MCQ result area now stays hidden until feedback is shown.
- `test me` now closes the side menu with `inert` restored.

## Known Gaps

- No automated UI or timing test suite.
- MCQ content still needs educator review for final teaching quality.
- Browser visual inspection remains essential after rendering changes.
- iOS verification of pupil clipping still needs a real-device pass.
- Thumbnail regeneration is still a manual or semi-manual workflow.
- Open `index.html` directly for the simple packaged launch path; a local server is optional for cache-free repeat testing.

## Evolution of Decisions

- Shifted from monolithic `script.js` logic to focused modules.
- Moved shared modal behaviour into `src/modal.js`.
- Split retinoscopy visuals from retinoscopy scheduling.
- Split visual rendering further into active reflex, media mask, pathology overlay and case metadata modules.
- Added a test-specific assessment path instead of forcing everything through MCQs.
- Moved fixed defects such as retinal detachment, floaters, vitreous haemorrhage and leucocoria into more appropriate rendering layers.
- Moved the main case selector into the dark stage instead of keeping it below the eye area.
- Adopted the Fundal Reflex app visual case picker pattern for Sauron case selection.
- Standardised runtime visual assets on WebP.

## Information popup consistency — 23 July 2026

- Added an effective `44 x 44px` Quick Guide close target.
- Standardised version presentation.
- Preserved optics, cases and stage behaviour.

## Information-card typography and fit — 23 July 2026

- Applied the shared popup type hierarchy.
- Verified a `355.2px` card at `360 x 740` with no internal scrolling.
- Standardised the simple visible `v1` label and `23/7/2026` date in the shared bottom-right footer position.
- Made Advanced instructions, controls and colour anchors upright while retaining italics for clinical movement descriptions.

- Standardised the sidebar hierarchy and added verified focus entry and Escape focus return.
- Standardised MCQ level labels and hardened Cup unlocking while preserving existing retinoscopy questions.
- Corrected the Advanced teaching pass mark from 4/8 to 6/8, added real-bank structural contracts, rebuilt `app.bundle.js` and versioned the app-scoped offline cache.

## Maintenance refactor — 26 July 2026

- Added full canonical thumbnail-to-precache contract coverage.
- Removed confirmed orphan and superseded CSS.
- Rebuilt the classic bundle and passed tests, exact parity and syntax lint.
- Preserved simulator maths, cases and eye geometry.

## MCQ quality — 26 July 2026

- [x] Audited all 26 authored questions and added stable IDs, rationales, sources and review states.
- [x] Narrowed the unsafe small-pupil absolute and labelled simulator-specific visual observations.
- [x] Added unanswered-focus, explanation, source and retry contracts.
- [x] Rebuilt the bundle and passed build, tests, parity and lint.
- [x] Passed the isolated HTTP MCQ path at temporary `360 x 740` with screenshots, 44px rows, no horizontal overflow and no browser errors.
- [ ] Independent clinical sign-off, physical-device review and installed offline review.
