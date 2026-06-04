# Product Context

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

## Problem Statement

Learners need repeated interactive retinoscopy practice. Static notes do not build intuition for reflex movement, axis behaviour, structural pupil findings or rapid pattern recognition.

## Target Users

- medical students
- optometry trainees
- ophthalmology trainees
- clinical educators demonstrating retinoscopy

## User Needs

- quick direct control over sweep and rotate
- clear examiner-view `RE` and `LE` targeting
- believable reflex changes with minimal lag
- easy colour adjustment between blue and red reflex appearance
- modifier switches for gaze, dilation and baby mode
- Fundal-like gaze behaviour with tilt, blink and lid motion while the beam remains fixed
- blink and lid timing that returns to a stable open baseline after transient gaze or baby-mode motion
- advanced control over squint, pupil size, lids, cataract and nystagmus
- mobile modifier controls that keep their switch affordance and text labels visible
- realistic structural pupil, iris, media and fundus variants
- a case selector that is visually tied to the eye stage
- a visual case picker with large snapshots of every condition
- a beginner-friendly case order starting from `Neutral (0)`
- timed recognition practice without leaving the simulator
- short level-appropriate MCQ checks in the same session

## Product Vision

A focused retinoscopy micro-simulator that is simple to run, quick to understand and useful for repeated teaching and self-testing.

## Current UX Direction

- strong Sauron app bar with orange-red background and black title text
- local `Inter` body typography with `Quicksand` title styling
- compact Fundal-style split control deck above the stage
- `Colour` slider with visible blue and red anchors
- switch-style modifier controls for `Gaze`, `Dilated` and `Baby` in their own row
- vertical `Adv` dock that opens the compact advanced panel
- `RE/LE` segmented eye selector above the dark stage
- stage-mounted case pill with previous and next arrows
- Fundal-style visual case picker with stacked full-width cards
- Primary, Intermediate and Advanced case sections with distinct header colours
- MCQ and test flows reachable from the burger menu
- MCQ feedback space that appears only when a warning or result is shown

## Experience Principles

- The simulator should open straight into the usable experience.
- Controls should be compact but readable on mobile.
- Hidden drawers and panels should not leave focusable or offscreen active UI behind.
- Case imagery should show the actual retinoscopy state, not abstract labels.
- Thumbnails should be centred and large enough to compare findings.
- Advanced controls should look like a folded tool panel, not a disorganised settings dump.
- Gaze should feel alive without moving the examiner-owned retinoscopy beam.
- Blinks and lid droop should be transient cues, never a persistent obstruction unless the lid slider has been deliberately adjusted.
- Test mode should hide the answer but leave the eye stage available for inspection.
- New UI should follow the Fundal Reflex app where it already solved the same problem well.

## Teaching Scope

Sauron now covers:

- with and against movement
- neutrality
- broad and narrow reflex behaviour
- cylinder and axis-dependent cases
- anisometropia
- small pupils
- scissors reflexes
- keratoconus and corneal scar
- `ACG`, aniridia, aphakia, iris transillumination and nasal coloboma
- cortical cataract, posterior subcapsular cataract, posterior pole cataract, dense cataract and posterior capsular thickening after `IOL`
- floaters, vitreous haemorrhage, leucocoria and partial retinal detachment
