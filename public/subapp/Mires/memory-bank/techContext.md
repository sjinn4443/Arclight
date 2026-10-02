# Tech Context

## Refactor verification (26/7/2026)

- `frame-scheduler.js` owns visibility-aware fixed-step scheduling.
- `simulator-logic.js` owns pure Newton bands, scoring and training-lock transitions.
- `npm run check` runs nine tests and an exact non-writing bundle comparison.
- `npm run test:browser` protects the `340 × 656px` mobile stage, completed and dense states, reset, offline reload and direct-file launch.
- Runtime remains local and direct-file compatible. The service worker remains HTTP(S)-only.

## v1.1 toolchain (23/7/2026)

Use `npm test` for Node built-in contracts and `npm run build` for the pinned esbuild bundle. HTTP(S) enables the service worker and loads the local Inter/Quicksand files. `file://` keeps simulator operation and the `360 x 740` layout but cannot install or run the worker; Chromium may block the WOFF2 requests and use the system-font fallback.

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

## Maintenance verification - 26 July 2026

Run the nine contracts, source/bundle parity and browser suite after simulator or layout changes. The browser suite must assert the preserved `340 x 656` stage as well as untouched, completed, dense, transient, reset, offline and direct-file states.

The current mobile presentation uses stylesheet and cache version `20260726-point1`. Re-run `npm run check` and `npm run test:browser` after app-bar, launcher, drawer, Newton-panel or dock changes. The browser contract protects the `159px + 10px + 159px` launcher geometry, centred `328px` Controls dock, `44px` Newton targets, `2px` point versus `1px` estimate border hierarchy and scroll-free Newton panel at `360 x 740`.

## MCQ verification — 26 July 2026

Source-owned MCQ files are `questions.js` and `mcq.js`. The browser token and scoped cache are `20260726-mcq4`. Run `npm test`, `npm run build` and `npm run test:bundle`. The contracts specifically protect `p4` excess-fluorescein under-reading and `p5` insufficient-fluorescein over-reading. Final source tests, exact parity and the isolated `360 x 740` browser suite pass.
