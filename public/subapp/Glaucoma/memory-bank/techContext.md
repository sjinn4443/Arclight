# Tech Context

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

- Runtime: browser, no framework.
- JS format: ES modules (`type: module` in `package.json`).
- Assets: local WebP images (`assets/images/01.webp`, `assets/images/04.webp`, `assets/images/07.webp`, `assets/images/09.webp`, `assets/images/size.webp`, `assets/images/rim.webp`).
- Styling: modular CSS via `styles.css` import entrypoint:
  - `styles/base.css`,
  - `styles/layout.css`,
  - `styles/components.css`,
  - `styles/responsive.css`.
- Tests: Node-based lightweight tests in `tests/`.
- Lint: Node-based syntax lint in `tools/lint.mjs`.
- UI review target: `360 x 740` mobile viewport. Check both the blank state and a completed-result state.
- Current visual style target: copy the Fundal Reflex look where practical: black app bar with bright green title and icons, light clinical side menu, small level dots, soft popup shells, medium action surfaces and tighter nested cards.

Local commands:

- Run app: `python -m http.server 8080`
- Run tests: `npm test`
- Run lint: `npm run lint`
