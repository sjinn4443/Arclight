# Product Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: off-white `#f5f8ff` on a blue appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

## Problem Statement

When combining a patient's current glasses prescription with objective findings, clinicians often apply quick heuristics rather than copying raw autorefractor output. Refract exists to make those heuristics fast, consistent, and repeatable in a lightweight browser tool.

## Target Users

- Optometrists
- Ophthalmic clinicians
- Trainees learning refraction decision-making
- Arclight collaborators reviewing prescription logic

## User Needs

- Very fast input for sphere, cylinder, axis, add, and age
- A compact screen that works comfortably on a phone-sized viewport
- A clear distinction between patient context and UI mode
- Immediate output without page reloads or form submission
- A simple mode that reduces cylindrical detail to a more basic spherical result
- A reading add suggestion when age is known
- Reliable signed-value display in both editable and output boxes

## Product Vision

Provide a lightweight refraction helper that runs anywhere in a browser, stays easy to maintain, and encodes practical prescription heuristics in a transparent way.

## User Experience Goals

- Minimal setup: open the page and use it immediately
- Fast touch interaction through spinner buttons and long-press acceleration
- Keep the whole working surface on one page at the baseline mobile size
- Make top controls easy to parse:
  - `Age` box
  - `Patient` box for `health?` and `precise`
  - `Mode` box for `advanced`
- Keep the `advanced` switch visually distinct from patient context
- Keep terminology concise and clinically recognizable
- Provide immediate visual feedback when output is near plano and not in a precise scenario

## Non-Goals

- Rich navigation-heavy workflows
- Multi-page onboarding or wizard flows
- Replacing clinician judgement with opaque automation
