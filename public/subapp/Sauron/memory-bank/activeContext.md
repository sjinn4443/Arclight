# Active Context

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
