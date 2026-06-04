# Project Brief

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

## Purpose

Provide a fast, browser-based Amsler grid tool for screening and documenting perceived visual distortion or scotoma patterns per eye.

## Goals

- [x] Keep app as a no-build static web app.
- [x] Support drawing overlays separately for `RE` and `LE`.
- [x] Provide quick visual mode toggles (`Flash`, `Red`, `Diag`).
- [x] Provide simple patient metadata capture (name/date).
- [x] Generate an on-screen report with eye snapshots and screenshot export.
- [x] Move instructions info icon into app bar and keep app bar sizing constraints.
- [x] Add structured memory-bank docs aligned with Swollen Discs repo format.
- [x] Add burger-menu MCQ learning flows (`Primary`, `Intermediate`, `Advanced`).
- [x] Use list-style MCQ pages with one submit and restart.
- [x] Keep primary MCQ bank concise (5 questions).

## Deliverables

- App bar with centered title and right-aligned instructions icon.
- App bar left burger menu for MCQ access.
- Canvas-based Amsler grid with drawing tools and eye tabs.
- Defect analysis output (`total`, `central`, `peripheral` percentages).
- Report generation with embedded RE/LE captures and screenshot button.
- Memory-bank files for project continuity.

## Success Criteria

- Users can run locally in under 1 minute.
- Core interactions (draw, switch eye, compute, report) work on desktop and mobile browsers.
- MCQ interactions (open menu, start level, submit, restart) work on desktop and mobile browsers.
- UI constraints remain fixed:
  - app bar height `54px`
  - title font size `25px`
  - title font weight bold (`700`)
- Memory-bank structure matches reference pattern exactly.

## Scope

In scope:

- Static front-end implementation
- Drawing, analysis, and report UX
- MCQ educational UX
- Lightweight refactors that preserve behavior

Out of scope:

- Backend storage or authentication
- Clinical diagnosis claims or regulated decision support workflows
