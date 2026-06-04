# Tech Context

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

## Stack

- HTML5
- CSS3
- Vanilla JavaScript (no framework)

## External Assets

- Google Fonts (Quicksand)
- Font Awesome stylesheet (currently linked, minimal direct use)
- Local image assets for risk tooltips

## Runtime

- Any modern browser.
- No build step.
- Node modules are only required for lint/dev tooling.

## Local Development

- Open `index.html` directly, or
- Serve statically via local HTTP server.

## Important Files

- `index.html`: layout and static UI shell
- `styles.css`: visual design and responsive behavior
- `script.js`: scoring model, MCQ logic, and dynamic render logic
- `package.json`: lint scripts and dev dependency definitions

## Current Operational Notes

- Linting is configured (`eslint`, `stylelint`, `htmlhint`).
- `npm run lint` is the current quality gate.
- No automated runtime/unit test suite is configured yet.
