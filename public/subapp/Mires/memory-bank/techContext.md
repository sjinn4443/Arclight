# Tech Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: bright green `#00ff00` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Runtime:

- Modern browser with ES module support.

Dependencies:

- None.

Dev workflow:

- Edit files directly.
- Serve with a static server, for example:
  - `py -m http.server 5500`

Interaction notes:

- Keyboard + touch controls supported.
- Touch gesture handling ignores controls, drawers, and modals.
- Focus-visible outlines enabled.
- `Escape` closes menu/modal states.

Current in-app guide version marker:

- `v1 - 18/5/2026`
