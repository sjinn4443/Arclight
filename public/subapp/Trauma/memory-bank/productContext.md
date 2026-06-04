# Product Context

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

## Problem

Users need to turn presenting VA and key risk findings into a quick, understandable prognosis estimate.

## User Flow

1. Choose presenting VA.
2. Toggle risk factors that are present.
3. Read:
   - computed score
   - category badge
   - 6-month outcome table
   - plain-language category summary
   - calculation breakdown
4. Optionally:
   - copy summary text
   - export summary text file
5. Optionally open sidebar MCQ and run a level test:
   - Primary
   - Intermediate
   - Advanced

## UX Priorities

- Fast interaction on mobile (reference viewport has been 360x740).
- Clear separation between input sections:
  - Presenting VA
  - Risk Factors
- High legibility of core output values.
- Visible explanation of why a result was produced.
- Training mode should scale content/language by level complexity.

## Risk and Safety Framing

- App should communicate that it is an aid, not a replacement for clinical judgement.
