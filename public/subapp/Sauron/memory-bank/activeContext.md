# Active Context

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

## Fleet repair receipt — 30 September 2026

Removed direct-file font preload CORS errors while retaining and verifying both local font families. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

29 September 2026: five approved logic/teaching corrections implemented. See README for scope. Preserve the ACG oval. Test mode now uses a clean modifier baseline and restores prior settings including dilation history. Pupil responses include consensual illumination with fixed-aperture exceptions. All contracts, bundle parity and syntax checks pass; cache 20260929-logic2. Fresh rendered interaction verification and clinical sign-off remain pending.

## Logic-integrity follow-up, 25 July 2026

Timed tests now preserve the visible pre-round streak angle while keeping the generated answer axis hidden until reveal. Baby mode draws only from the Baby catalogue and the existing timed-test exclusions still apply. Stacked case and safety dialogs now suspend the underlying case dialog correctly. The exaggerated ACG vertical oval remains intentional and its wording now identifies it as a stylised teaching cue. Current browser-visible cache token: `20260725-logic1`.

## Case curriculum and safety follow-up, 25 July 2026

The case picker now has Primary `5`, Intermediate `10` and Advanced `13`. Low astigmatism is Intermediate, posterior subcapsular cataract is Advanced, dense cataract is Intermediate and vitreous floaters is Intermediate. ACG, leucocoria, vitreous haemorrhage and partial retinal detachment have separate accessible warning notes. Simulator maths, MCQ answers and timed-test selection are unchanged. Build, tests, lint and HTTP review at `360 x 740` pass. Clinical sign-off and physical-device testing remain pending.

Eye-engine follow-up, 23 July 2026: the existing radial pupil-response target is now a pure tested helper and paired advanced controls announce examiner-facing RE and LE. The production bundle, contracts and 28-file syntax check pass. Response timing, simulator maths, cases and geometry are unchanged.

Fleet edge follow-up, 23 July 2026: the control deck and stage measure `x=10`, `width=340` at `360 x 740`; simulator maths and internal geometry are unchanged.

## Fleet upgrade, 23 July 2026

Sauron v1.1 adds two-step reset safety, active-eye `aria-pressed` state, scoped PWA/offline support and automated contracts without changing simulator maths or teaching content. Exact `360 x 740` review is reproducible through `tests/browser-review.mjs`. Clinical sign-off and physical-device testing remain pending.

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

## Current Focus

Stabilise Sauron after the Fundal Reflex UI alignment and the latest engine pass:

- keep the orange-red app bar and black title typography
- keep the compact clinical hierarchy from app bar to controls, stage and modal
- keep the `Colour` slider short, clear and anchored with blue and red labels
- preserve the Fundal-style case picker layout with large visual cards
- keep all case thumbnails centred, WebP-only and free of streak-handle cue artefacts
- keep the advanced panel tidy, with switch-style modifier controls and consistent slider sizing
- keep `Gaze`, `Dilated` and `Baby` as switches, not plain buttons
- keep the corneal reflex system aligned with Fundal Reflex sizing and movement
- keep gaze mode aligned with Fundal Reflex motion while preserving a fixed examiner-owned beam
- keep eyelid timing baseline-driven so blink and gaze-droop timers cannot turn transient lid height into rest height
- keep the retinoscopy stage proportions and dark panel shape that now work well
- keep docs aligned with the actual split module structure

## Recent Changes

- Renamed the user-facing reflex colour label to `Colour`.
- Added blue and red word anchors to the colour slider.
- Kept the Sauron app bar colour and black title font treatment.
- Reworked the top modifiers as Fundal-style switches for:
  - `Gaze`
  - `Dilated`
  - `Baby`
- Rebuilt the advanced panel into compact cells with:
  - `squint` switch
  - paired pupil sliders
  - paired lid sliders
  - cataract slider
  - nystagmus slider
- Reworked the case pill to use previous and next arrow buttons plus a centred trigger.
- Reworked the case picker into a Fundal-style visual modal:
  - Primary cases: 6
  - Intermediate cases: 8
  - Advanced cases: 14
- Reordered the shared case list so `Neutral (0)` is case `1`, followed by the rest of Primary, then Intermediate and Advanced.
- Regenerated all 28 case thumbnails as centred `409 x 147` WebP assets.
- Removed thumbnail cue artefacts caused by visible sweep and rotate handles.
- Corrected the high-minus thumbnail crop so its eye centre aligns with the other primary cases.
- Updated case thumbnail cache keys to the latest high-minus crop.
- Ported the Fundal Reflex corneal reflex system into Sauron:
  - `5px` primary dot
  - `6px` secondary reflection layer
  - `5px` fellow-eye dot
  - micro-offset from iris movement
  - light-offset and scale from retinoscopy beam position
- Ported the Fundal Reflex gaze action into Sauron:
  - timeout-based gaze shifts
  - small face translation and head tilt on `.eyes-container`
  - temporary upper-lid droop during larger looks
  - random blink and double-blink scheduling
  - baby-mode blink timing when `Baby` and `Gaze` are both active
- Copied the Fundal Reflex eyelid timing fix:
  - upper lids restore only to `dataset.restingHeightPx` or `0px`
  - lower lids restore to `0px`
  - lid slider changes do not overwrite active blink or gaze-droop state
  - `Baby` initialisation no longer resets blink timers when the value has not changed
- Simplified Sauron startup to render from neutral iris transforms rather than racing through a random first-paint eye offset.
- Fixed the gaze beam anchor so selecting `Gaze` moves the eyes, lids and face without moving the visible retinoscopy beam.
- Updated retinoscopy calculations to use the rendered streak centre during gaze instead of deriving the beam from the moving pupil centre.
- Regenerated all 28 case thumbnails after the corneal-reflex change.
- Regenerated all 28 case thumbnails after the fellow-eye corneal reflection size fix.
- Updated the case thumbnail cache key to `20260507-fellow-corneal`.
- Removed the one-off local-server helper so Sauron matches the direct `index.html` handover pattern used by the other apps.
- Changed the info modal version date to `18/5/2026`.
- Converted runtime cue images to WebP:
  - `ret-rotate-cue.webp`
  - `ret-sweep-cue.webp`
- Removed old SVG cue images and PNG verification images.
- Verified that no legacy raster cue or verification images remain under Sauron; the current SVG favicon is retained.
- Split retinoscopy rendering ownership further across:
  - `retinoscopy-case-metadata.js`
  - `retinoscopy-active-reflex.js`
  - `central-media-masks.js`
  - `retinoscopy-pathology-overlays.js`
  - `structural-eye-effects.js`
- Completed a full UI and engine review pass across the main stage, Advanced panel, side menu, MCQ modal, case picker and timed test flow.
- Tightened the collapsed `Adv` cell so its internal controls no longer contribute offscreen layout.
- Scaled the mobile modifier switches so `Gaze`, `Dilated` and `Baby` stay readable at `360px`.
- Reworked the top controls to match the Fundal Reflex deck structure:
  - separate colour card
  - separate modifier switch row
  - narrow vertical `Adv` dock spanning both rows
- Rechecked the Fundal Reflex source CSS and copied the missing control styling into Sauron:
  - `--radius-control`
  - Fundal control borders, shadows and translucent card backgrounds
  - `Gaze`, `Dilated` and `Baby` switch-card sizing
  - Fundal checked-switch red and mobile switch gaps
  - vertical `Adv` dock radius, background, shadow and indicator sizing
- Updated the non-examined fellow-eye corneal reflection to match Fundal live behaviour:
  - removed the Sauron-only visual shrink from `3px` to `5px`
  - kept the dynamic beam-distance scale and light offsets intact
  - verified with `output/playwright/sauron-fellow-corneal-425.webp`
- Hid the empty MCQ result row until the user submits or receives feedback.
- Restored the side menu to an inert hidden state when `test me` starts.

## Current Verification State

- JavaScript syntax checks pass:
  - `node --check script.js`
  - `Get-ChildItem src\*.js | ForEach-Object { node --check $_.FullName }`
- Browser check through `http://127.0.0.1:8766` confirmed:
  - no console messages or page errors
  - no horizontal page scroll at `425px` or `360px`
  - no visible text clipping in the reviewed controls, pills, modals or case cards
  - collapsed `Adv` content computes as `display: none`
  - Primary MCQ opens with the result area hidden and shows the empty-submit warning only after submit
  - side menu is open and focusable when visible, then hidden and inert after MCQ launch and after `test me`
  - `test me` masks the case pill and disables answer-leaking controls
  - case modal opens
  - 30 rendered images are WebP
  - all rendered images have non-zero dimensions
  - case order starts `Neutral`, `Minus`, `Plus`, `High minus`, `High plus`, `Low astigmatism`
  - latest Playwright CLI screenshots at `425 x 1237` and `360 x 1237` confirm the Fundal-style control deck renders after animation wait
  - screenshots converted to WebP and saved at `output/playwright/sauron-controls-425.webp` and `output/playwright/sauron-controls-360.webp`
  - gaze mode keeps the settled streak centre at `0,0` delta while the pupil and face transform move
  - latest sampled gaze beam delta was `-0.11, 0`
  - dilation enlarged the sampled pupil from about `29.63px` to `40.74px`
  - baby mode reduced the sampled eye from about `140 x 75px` to `118 x 66px`
  - cataract slider applies a pupil filter and nystagmus produces changing iris transforms
  - gaze mode produces multiple face-tilt values and blink or lid-height movement over an `8.5s` sample
  - baseline blink returns upper and lower lids to `0px` after a visible blink
  - `Gaze` plus `Baby` shows droop/tilt and returns lids open after both switches are turned off
- Asset check confirms:
  - 71 WebP files
  - no remaining PNG, JPG, JPEG, GIF or SVG files

## Active Decisions

- Keep all runtime UI images and thumbnails as WebP.
- Keep local font files in `assets/fonts`.
- Keep the Fundal-style modal card layout as the case picker standard.
- Keep `Neutral (0)` as the first case in the shared case order.
- Keep case thumbnails large enough to inspect the eye stage.
- Keep the first case crop aligned with all other thumbnails.
- Keep answers hidden in test mode by masking the case pill rather than freezing the simulator.
- Keep `Baby` mode filtering the case list to baby-relevant cases.
- Keep `Gaze`, `Dilated` and `Baby` switch UI in the top control deck.
- Keep the top controls aligned to the Fundal Reflex split deck, not a single combined card.
- Keep the collapsed Advanced control as a rotated vertical `Adv` dock.
- Keep gaze movement from recentering the retinoscopy beam.
- Keep advanced sliders visually consistent and mobile-fit.
- Keep fixed defects out of the moving reflex layer where possible.

## Next Steps

- Run a fresh visual pass on mobile width after any style change touching the case modal or advanced panel.
- Preserve the current thumbnail capture rules before regenerating images:
  - WebP output
  - handles hidden
  - centred crop
  - no blink state
  - high-minus crop aligned with the other primary thumbnails
  - corneal reflex matching the live app
- Review MCQ content for educator accuracy once the UI settles.
- Continue targeted rendering cleanup only where module ownership is unclear.

## MCQ consistency status — 23 July 2026

Visible level names are Primary, Intermediate and Advanced. Existing random question and option selection, attempt sizes and retinoscopy teaching content remain unchanged. The Advanced teaching pass mark is 6/8, correcting the previous anomalous 4/8 threshold. Cup unlocking requires explicit Advanced pass evidence. Simulator and clinical decision logic are unchanged.

## Maintenance refactor — 26 July 2026

Offline contracts now compare the full generated thumbnail inventory with the canonical case catalogue. Exact bundle parity is mandatory. The established eye oval and all simulator behaviour remain frozen. Clinical and physical-device gates remain open.

## MCQ quality pass — 26 July 2026

All 26 questions now use stable IDs, rationales, named sources and explicit review status. Small-pupil advice is conditional and simulator-specific pathology observations say so. Unanswered focus, full explanations, source display and real retry are implemented. Simulator optics, attempt sizes, pass marks and Cup unlocking remain unchanged.
