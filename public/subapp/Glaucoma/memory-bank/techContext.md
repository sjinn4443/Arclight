# Tech Context

## Maintenance verification (26/7/2026)

- `npm run build` regenerates `app.bundle.js` from `scripts.js`.
- `npm run check` runs JavaScript syntax checks, controller and risk tests then exact bundle parity.
- Browser-visible bundle token and app-scoped worker cache are `20260726-refactor2`. The shared information footer is `v1 · 23/7/2026`.

## Verification update (25/7/2026)

- `npm test` includes an 86,400-combination risk-engine sweep.
- `npm run browser:review` checks optional laterality, report enablement and modal behaviour, the referral floor, the rock-hard emergency, reset, accessibility semantics and Primary MCQ answer review.
- Latest exact HTTP and direct-file results: width 360, scroll width 360 and page height 740 for untouched, completed and fully dense states with no runtime errors. The report card bottom was `468.61` within the 740px viewport.
- Use an isolated Chrome profile. Do not alter the user's retained Codex browser device-toolbar state.

## v1.1 Verification (23/7/2026)

```powershell
npm run build
npm run lint
npm test
```

Local Inter and Quicksand are the only runtime fonts. `manifest.webmanifest`, `sw.js` and `src/pwa.js` provide scoped offline infrastructure. `tests/browser-review.mjs` uses Chrome device emulation for an exact `360 x 740` CSS viewport. Direct-file use works without service-worker registration.

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

## Maintenance verification - 26 July 2026

The final maintenance state passed the full lint, controller, contract and source/bundle parity suites. Browser checks covered untouched, laterality, completed, report, dense, information, reset, safety and MCQ states at `360 x 740`.

## MCQ verification — 26 July 2026

Source-owned MCQ files are `src/mcq-data.js`, `src/mcq-engine.js` and `src/mcq-controller.js`. The browser token and scoped cache are `20260726-mcq4`. Run `npm run lint`, `npm test`, `npm run build` and `npm run test:bundle`. Final lint, source tests, exact parity and isolated `360 x 740` MCQ browser review pass.
