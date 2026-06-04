# Project Brief

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: yellow `#ffb000` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Deliver and maintain a one-page squint teaching app that is:

1. fast on low-resource mobile devices,
2. clear for frontline non-specialist use,
3. clinically useful for common ocular-motility and pupil patterns first,
4. transparent about uncertainty and overlap patterns,
5. teachable with graded preset sets and MCQs,
6. visually consistent with the Fundal Reflex app where the same Arclight design language applies,
7. maintainable via clear simulator-output-analysis boundaries.
