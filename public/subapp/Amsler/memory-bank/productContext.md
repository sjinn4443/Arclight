# Product Context

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
- Simple ways to mark dark, missing, or hemorrhage-like regions
- Basic defect summary text (`total`, `central`, `peripheral`) that can be copied into notes
- Simple report capture for handoff or documentation
- Optional staged MCQ learning from primary to advanced level

## Product Vision

A practical, low-friction Amsler capture tool that runs anywhere in a browser, supports quick clinical communication, and includes lightweight competency reinforcement via tiered MCQs.

## UX Goals

- Keep interface minimal and touch-friendly.
- Keep primary actions visible and understandable in seconds.
- Keep instructions discoverable in the app bar via info icon.
- Keep advanced controls hidden unless needed (`+` for stroke width).
- Keep MCQ training discoverable but non-intrusive (burger menu).
- Preserve predictable app bar sizing across devices.
- Avoid blocking flows with unnecessary dialogs.
