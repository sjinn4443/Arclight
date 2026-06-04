# Progress

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
