# Project Brief

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: blue `#2f80ff` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Last updated: 18/5/2026

Deliver and maintain a one-page confrontation visual fields app that is:

1. fast on low-resource mobile devices,
2. simple for non-expert frontline users,
3. clinically useful in common patterns first,
4. transparent about uncertainty in mixed or fuzzy patterns,
5. maintainable through modular rule, summary and output separation,
6. continuously verified by full-state automated auditing,
7. clear in both simple and advanced language modes,
8. compact in phrasing and visually explicit about urgency,
9. stable on the `360x740` base viewport,
10. visually calm enough for repeated clinical teaching use,
11. explicit about how clinical context changes urgency and likely anterior source without renaming the field pattern,
12. intentionally limited to the Classic 18 named families, with mixed cases handled through uncertainty output rather than extra diagnoses.

## Current Product Direction

The Fields UI should follow the Fundal Reflex app lessons:

1. keep controls compact,
2. avoid decorative clutter,
3. make hierarchy obvious,
4. fold secondary context away,
5. reserve height where wording can vary,
6. reveal detailed calculation and reference-image surfaces only on request.
