# Project Brief

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

## Purpose

Deliver a lightweight browser-based retinoscopy training tool where learners can practise sweep and rotate interpretation, eye targeting, condition recognition and rapid self-assessment.

## Goals

- [x] Provide a clear retinoscopy interaction model
- [x] Keep examiner-view mapping explicit
- [x] Add side-menu navigation from the app bar burger
- [x] Add tiered MCQs with plain radio-list presentation
- [x] Add timed condition-recognition practice through `test me`
- [x] Keep the app fully client-side and easy to run
- [x] Expand the simulator beyond basic refraction into structural pupil, iris, media and fundus cases
- [x] Align the case picker and modal hierarchy with the Fundal Reflex app
- [x] Use WebP for runtime visual assets and thumbnails

## Objectives

- teach with and against movement interpretation
- reinforce principal-meridian recognition in astigmatic cases
- expose learners to structural pupil abnormalities and abnormal red-reflex patterns
- support repeated short assessment loops
- keep the codebase maintainable without build tooling
- keep the UI compact, inspectable and mobile-usable

## Deliverables

- interactive dual-eye retinoscopy UI
- `RE/LE` active-eye selector above the eye stage
- direct streak drag controls for sweep and rotate
- colour slider with blue and red anchors in its own Fundal-style card
- switch controls for `Gaze`, `Dilated` and `Baby` in their own modifier row
- vertical `Adv` dock matching the Fundal Reflex control deck
- Fundal-style gaze motion with fixed beam anchoring, blink timing and subtle face tilt
- baseline-driven lid timing so transient blink or gaze droop does not persist
- compact advanced panel for squint, pupil, lid, cataract and nystagmus
- responsive switch sizing so the top modifier row remains readable at `360px`
- stage-mounted case pill with previous and next buttons
- Fundal-style visual case picker populated from shared metadata
- shared case ordering with `Neutral (0)` first
- WebP thumbnail set for all 28 cases
- condition library spanning:
  - sphere and astigmatism
  - irregular reflex
  - structural pupil and iris cases
  - media and fundus pathology
- side menu with:
  - Primary MCQ
  - Intermediate MCQ
  - Advanced MCQ
  - `test me`
- MCQ modal with level-specific scoring
- MCQ result feedback that stays hidden until needed
- non-modal timed-test overlay with staged countdown and answer reveal

## Success Criteria

- users can identify with and against movement reliably
- the simulator feels immediate during sweep and rotate changes
- gaze mode does not recenter the retinoscopy beam after the initial layout has settled
- gaze mode includes visible eye motion, blink or lid movement and subtle face tilt
- blink and gaze-droop timing restores the upper and lower lids to the correct resting state
- structural and media-opacity cases read as meaningfully distinct from one another
- the case picker looks and behaves like the Fundal Reflex visual picker
- thumbnails are centred, readable and free of cue-handle artefacts
- MCQs are readable on desktop and mobile
- closed menus and panels do not leave hidden focusable controls behind
- timed test rounds do not expose the answer before reveal
- runtime visual assets remain WebP-only

## Scope

### In Scope

- client-side retinoscopy simulation
- UI and UX refinements for teaching and assessment
- local MCQ logic and timed-test logic
- condition-specific visual teaching patterns
- visual case picker thumbnails
- local documentation and memory bank maintenance

### Out of Scope

- backend accounts, sync or analytics
- server-side persistence
- packaged build pipeline
- automated thumbnail generation pipeline unless explicitly requested

## Stakeholders

- medical educators
- ophthalmology trainees
- optometry trainees
- Arclight simulation collaborators
