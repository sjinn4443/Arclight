# Sauron

<!-- APP-DOC-STATUS:START -->

## Current Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: black `#111111` on an orange-red appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Interactive retinoscopy training simulator focused on direct streak handling, monocular eye targeting, case recognition and quick self-testing.

_Documentation last updated: 18/5/2026_

## Current Direction

Sauron keeps the orange-red app bar, black title text and compact clinical simulator feel. The main UI now follows the Fundal Reflex app more closely where that app is strongest:

- local `Inter` body font with `Quicksand` for the app title
- clear hierarchy between the app bar, control deck, advanced panel, eye selector, case pill and eye stage
- compact switch controls for `Gaze`, `Dilated` and `Baby`
- Fundal-style visual case picker with large stacked cards, tier headers and WebP thumbnails
- modal, MCQ and test layouts that stay readable on mobile

## Features

- Dual-eye retinoscopy simulator with examiner-view targeting:
  - `RE` maps to the screen-left eye
  - `LE` maps to the screen-right eye
- Direct streak interaction:
  - drag the lower handle to sweep
  - drag the upper handle to rotate
  - immediate reflex redraw
- Fundal Reflex-style corneal reflex:
  - `5px` primary corneal dot
  - `6px` secondary reflection layer
  - fellow-eye dot keeps the same `5px` live Fundal size rather than being reduced
  - dot position responds to eye movement and light position
- Fundal Reflex-style gaze behaviour:
  - gaze shifts use timeout-based looks rather than a fixed interval
  - subtle face translation and head tilt are applied to the eye container
  - temporary upper-lid droop and random blinks run during live gaze
  - lid timing is baseline-driven so blink and gaze droop restore to stable lid positions
  - the retinoscopy beam remains examiner-owned and does not recenter when gaze moves the eyes
  - beam and corneal-reflex calculations use the rendered streak centre during gaze
- Top control deck:
  - `Colour` slider with blue and red anchors
  - `Gaze`, `Dilated` and `Baby` switch buttons
  - compact `Adv` panel
  - Fundal Reflex-style split layout with the colour card, modifier row and vertical `Adv` dock separated
  - Fundal Reflex control CSS copied for the card radius, border, shadow, switch sizing, checked-switch red and mobile dock proportions
- Advanced panel:
  - `squint` switch for manual eye dragging
  - paired pupil sliders
  - paired lid sliders
  - cataract slider
  - nystagmus slider
  - collapsed panel hides its internal controls from layout
  - mobile switch sizing keeps `Gaze`, `Dilated` and `Baby` readable at `360px`
- Stage-mounted case pill:
  - previous and next case buttons
  - current case label
  - tier marker colour
  - answer masking during timed testing
- Fundal-style case picker:
  - Primary cases: 6
  - Intermediate cases: 8
  - Advanced cases: 14
  - case order starts with `1. Neutral (0)`
  - large full-width snapshot cards
  - centred `409 x 147` WebP thumbnails
  - no visible streak-handle cue artefacts in thumbnails
  - regenerated after corneal-reflex changes
- Structural pupil and iris cases including:
  - `ACG`
  - `Aniridia`
  - `Small pupils`
  - `Nasal coloboma`
  - `Iris transillumination`
- Media and fundus cases including:
  - cortical cataract variants
  - posterior subcapsular cataract
  - posterior pole cataract
  - posterior capsular thickening after `IOL`
  - dense cataract
  - floaters
  - vitreous haemorrhage
  - leucocoria
  - partial retinal detachment
- Border-aware reflex fade once the sweep crosses beyond the pupil edge
- Tiered MCQs:
  - Primary
  - Intermediate
  - Advanced
  - result area stays hidden until feedback is needed
- `test me` mode:
  - picks a random condition from the case pool
  - hides the case answer during the countdown
  - uses a staged timer sequence of `20`, `15`, `10`, `8` then `6` seconds
  - reveals axis detail for astigmatic and axis-dependent cases
  - closes the side menu back to an inert hidden state before the timed round starts

## Usage

Open `index.html` directly for normal use. A local HTTP server is still useful for cache-free browser testing, but the app is packaged to run from the file itself.

Optional local-server test command:

```powershell
npx http-server . -p 8766 -c-1 -o /index.html
```

Or:

```powershell
python -m http.server 8766
```

Then open if the browser did not launch automatically:

```text
http://127.0.0.1:8766/index.html
```

Typical flow:

1. Use `RE` or `LE` above the eye stage to choose the active retinoscopy eye.
2. Drag the streak handles to sweep and rotate.
3. Use `Colour` to move between blue and red reflex appearance.
4. Use `Gaze`, `Dilated` or `Baby` to change the eye model.
5. Open `Adv` for squint, pupil, lid, cataract and nystagmus controls.
6. Use the case pill arrows or open the case picker to compare conditions.
7. Open the burger menu for MCQs or `test me`.

## Project Structure

- `index.html`: page structure, controls and modal shells
- `style.css`: theme, layout, case picker, advanced panel and responsive styling
- `script.js`: module entrypoint
- `src/app.js`: bootstrap and controller wiring
- `src/state.js`: central mutable application state
- `src/dom.js`: cached DOM references
- `src/constants.js`: refraction groups, MCQ bank and test timing
- `src/case-catalog.js`: tiered visual case metadata, baby-case filtering and thumbnail paths
- `src/menu-visual-cases.js`: Fundal-style case picker modal
- `src/retinoscopy.js`: streak placement, redraw scheduling and DOM visual application
- `src/retinoscopy-visuals.js`: barrel export for retinoscopy visual helpers
- `src/retinoscopy-case-metadata.js`: case flags, movement helpers, axis helpers and shared constants
- `src/retinoscopy-active-reflex.js`: moving reflex render strategies
- `src/central-media-masks.js`: central media-opacity mask strategies
- `src/retinoscopy-pathology-overlays.js`: fixed pathology overlays
- `src/structural-eye-effects.js`: structural pupil and iris effects
- `src/eyes.js`: pupil, lid, gaze, baby, dilation and eye-motion behaviour
- `src/streak-controls.js`: direct streak drag controls and hint timing
- `src/menu-mcq.js`: burger menu and MCQ flow
- `src/mcq.js`: MCQ rendering helpers
- `src/test-mode.js`: timed condition-recognition mode
- `src/modal.js`: shared modal accessibility and focus management
- `src/info-modal.js`: instructions modal wiring
- `src/color.js`: colour parsing helpers
- `src/motion.js`: reduced-motion helper

## Assets

- Runtime UI images must be WebP.
- Case thumbnails live in `assets/case-thumbnails/*.webp`.
- Streak cue images live at:
  - `assets/images/ret-rotate-cue.webp`
  - `assets/images/ret-sweep-cue.webp`
- Local fonts live in `assets/fonts`.
- The current asset sweep leaves no legacy raster cue or verification images under the Sauron folder; the current SVG favicon is retained.

## Local Checks

```powershell
node --check script.js
Get-ChildItem src\*.js | ForEach-Object { node --check $_.FullName }
Get-ChildItem -Path . -Recurse -File | Where-Object { $_.Extension -in '.gif', '.ico' }
```

Browser checks should include:

- main simulator at `425px` and `360px` mobile widths
- advanced panel open and closed
- `Gaze`, `Dilated` and `Baby` switches
- gaze mode with a fixed beam centre while pupil, lid and face motion continue
- baseline lid timing after blink, `Gaze` and `Baby` toggles
- case picker modal with Primary, Intermediate and Advanced sections
- MCQ modal with the empty result row hidden before submit
- side menu open and hidden/inert states
- `test me` masking and reveal

## Current Refactor Note

The broad retinoscopy split has already started. The next work should stay targeted:

- keep case metadata centralised so the case picker, MCQs and test mode stay aligned
- keep thumbnail generation rules strict and centred
- keep fixed pathology overlays separate from moving reflex logic
- avoid broad rewrites unless a new condition makes the current module ownership unclear
