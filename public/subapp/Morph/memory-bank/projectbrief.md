# Project Brief

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: black `#111111` on a white appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Morph is a single-page fundus-view simulator. The goal is to help learners understand how the hand-held view changes with field size, Rx, cataract and patient movement.

The app should feel like part of the same family as Fundal Reflex and Swollen Discs, but Morph keeps its own white app bar, black title text, black stage and cartoon character.

The intended page size for design review is 360 x 740.

## Core Requirements

- Main controls must stay compact and usable on a phone-sized viewport.
- First-page control hierarchy is Cataract, Field, Rx then Condition and Adult/Child.
- Field should distinguish 5, 8 and 15 degree direct ophthalmoscopy from 25, 35 and 45 degree indirect BIO views.
- Rx should use `+++`, `++`, `0`, `--` and `---` labels.
- Adult/Child is a switch.
- Condition is a dropdown on the main screen.
- Side menu contains Conditions only.
- Quick guide is concise, clinical and dated.
- Corneal reflex and cataract behaviour should follow Swollen Discs.
- Background patient movement should follow Swollen Discs, including the irregular jerky motion.
- Artwork scale should not be corrected in code; image artwork quality and framing is a source-asset issue.
