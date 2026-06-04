# Project Brief

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: black `#000000` on a red appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

## Project

Trauma is a static browser-based calculator for Ocular Trauma Score style estimation.

## Primary Goal

Provide a fast, mobile-friendly interface to estimate likely 6-month VA outcomes from:

- presenting VA
- selected risk factors

## Scope

- Mechanical trauma workflow support.
- Score + category + outcomes table display.
- Transparent "Calculation" panel so users can inspect the logic.
- Tiered sidebar MCQ training with progressive complexity:
  - Primary
  - Intermediate
  - Advanced
- Result copy/export utilities for handover and documentation.

## Non-Goals

- Not a full EMR or patient record system.
- Not a substitute for clinical judgement.
- No server-side persistence in current version.

## User Base

- Clinicians and trainees who need quick bedside/clinic estimation support.

## Constraints

- Must work as a simple static app.
- Should remain usable in narrow mobile viewports.
- Keep logic easy to audit in plain JavaScript.
- Keep MCQ language complexity proportional to level.
