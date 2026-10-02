# Product Context

## Descriptive Compute boundary (24/7/2026)

Amsler records patient-reported marks rather than diagnosing them. Each eye has a deliberate assessment state. Percentages describe coverage of the recorded grid, central zone and outer zone using a viewport-independent engine. They are not validated disease-severity scores. Line, Missing and Red mark are explicit tools so the app no longer assigns a `wavy` or `dark` interpretation from drawing geometry.

## v1.1 Product Boundary (22/7/2026)

Amsler remains a mixed examination, documentation and teaching app. Operational drawing and report state is separate from MCQ learning and achievement. Compute is the deliberate completion signal, while the untouched screen remains neutral. The v1.1 pass does not change clinical interpretation, calculation thresholds or report wording.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: red `#ff2a18` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

## Problem Statement

Clinicians need a quick way to record patient-reported Amsler distortions during exam flow without switching to heavyweight software. They also benefit from lightweight in-app training prompts for consistent testing practice.

## Target Users

- Optometrists
- Ophthalmology trainees
- Eye clinic staff
- Medical outreach teams using lightweight devices

## User Needs

- Fast startup with no install overhead
- Clear fixation target and grid visibility controls
- Separate recording for right eye and left eye
- Simple ways to mark distortion lines, missing or dim regions and red or colour-change regions
- Descriptive whole-grid, central-zone and outer-zone coverage which remains stable across responsive resizing
- Simple report capture for handoff or documentation
- Optional staged MCQ learning from primary to advanced level

## Product Vision

A practical, low-friction Amsler capture tool that runs anywhere in a browser, supports quick clinical communication and includes lightweight competency reinforcement via tiered MCQs.

## UX Goals

- Keep interface minimal and touch-friendly.
- Keep primary actions visible and understandable in seconds.
- Keep instructions discoverable in the app bar via info icon.
- Keep advanced controls hidden unless needed (`+` for stroke width).
- Keep MCQ training discoverable but non-intrusive (burger menu).
- Preserve predictable app bar sizing across devices.
- Avoid blocking flows with unnecessary dialogs.

## MCQ experience — 26 July 2026

The education surface should feel like one compact assessment: answer every item, receive a clear result with rationale-based review, then choose one New attempt action. It must not reveal answers on an incomplete submission or alter the operational Amsler examination. Higher tiers should add technique, interpretation or limitation decisions rather than repeat Primary wording.
