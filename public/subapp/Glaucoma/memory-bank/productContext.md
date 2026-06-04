# Product Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: bright green `#00ff3b` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

This app is a rapid glaucoma triage support tool.

User goals:

- enter findings quickly,
- see urgency immediately,
- understand why urgency changed,
- see transparent, concise scoring rules in-app,
- practice through short MCQ sets (Primary -> Intermediate -> Advanced).

Design guardrails:

- keep layout one-page and uncluttered,
- keep interaction minimal,
- prioritize 360x740 mobile readability,
- avoid hidden logic: show key weighting/threshold rules in the app-bar info popup.

Clinical safety emphasis:

- `Rock` digital palpation is treated as an acute emergency warning path.
- Measured IOP takes precedence when both palpation and IOP are provided.
- Incomplete/invalid pressure input should never produce a falsely reassuring normal output.
