# Active Context

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

## Current UI State

- App bar:
  - red background
  - title text black
  - title size 25px
  - Quicksand title font
  - height 54px
- Current UI pass has copied the Fundal Reflex layout discipline while preserving the Trauma app bar identity:
  - compact mobile-first panels around the 360x740 review size
  - light clinical card surfaces with blue-grey borders
  - light side menu with small Primary, Intermediate and Advanced level dots
  - softer outer panels, medium action controls and tighter nested MCQ rows
  - compact info popup with basics first and detail second
- MCQ modal now follows the Fundal-style hierarchy:
  - contained modal scroll
  - medium question cards
  - tighter option rows
  - green submit action
  - level-specific modal border tint
- Current MCQ bank rules:
  - Primary samples 5 from 10 and passes at 3/5
  - Intermediate samples 6 from 13 and passes at 4/6
  - Advanced samples 8 from 14 and passes at 6/8
- Input card is split into two visual sections:
  - Presenting VA
  - Risk Factors
- Risk rows are compact and no longer rendered as bordered "pill" blocks.
- Result headline row is tuned to stay on one line in narrow mobile widths.
- Sidebar now shows tiered MCQ entry buttons:
  - Primary
  - Intermediate
  - Advanced

## Current Result/Explanation State

- Result area includes:
  - estimated score and category badge
  - outcome probability table
  - active plain-language prognosis line
  - collapsible calculation panel describing formula inputs and category mapping
  - compact copy/export controls
- MCQ modal includes:
  - level intro and pass mark
  - random question subset
  - submit + pass/fail feedback
  - retry set

## Recent Interaction Focus

- Mobile layout refinement (Chrome phone viewport baseline 360x740).
- Spacing and readability balancing for score row and risk controls.

## Guardrails For Next Changes

- Preserve one-line behaviour for the "Estimated VA at 6 months" row on mobile.
- Keep touch targets for selects/toggles usable even when compacting layout.
- Keep MCQ complexity/language progression clear between levels.
- Preserve the red app bar, black Quicksand title and 54px app bar height.
