# Tech Context

## Current runtime — 30 September 2026

App-scoped cache: `arclight-trauma-v1.1-20260929-ots1-info-20260929-ui20260930`. Scoring and main-script queries retain `20260929-ots1`; the stylesheet retains `20260928-ui1`. See [fleet repair evidence](../../FLEET_FIXES_2026-09-30.md) for current tests and exclusions.

## Untouched-state verification, 25 July 2026

July cache and visible asset token: `20260725-unassessed1`. That browser review asserted a `360 x 740` viewport, `360px` document width, placeholder acuity, null score, null category, `Not assessed`, no text overlap and correct reset restoration.

## v1.1 commands

Run `npm ci`, `npm run lint` and `npm test`. Normal runtime uses local fonts and assets. Direct-file use remains supported while service-worker behaviour requires HTTP(S). The July dependency audit recorded one moderate and five high findings. It was not rerun in this UI repair and is not a current vulnerability assessment.

<!-- APP-DOC-STATUS:START -->

## Historical Memory Status (18/5/2026)

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

- No normal runtime CDN dependencies
- Inter and Quicksand are packaged under `assets/fonts`
- The CEHJ source remains a user-activated external reference link, not a runtime dependency
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
- Scoring and contract tests run through `npm test`.

## Refactor verification — 26 July 2026

`node --check shell-controller.js`, `npm test` and `npm run lint` pass. The service worker precaches `shell-controller.js?v=20260726-refactor1`. Direct-file use remains available because the runtime is unbundled local classic JavaScript.

The Presenting-VA copy refinement uses main-script and cache version `20260726-copy2`. `npm test` protects the `Select` placeholder and concise guidance while rejecting the former repeated untouched guidance.

The MCQ quality pass uses stylesheet, main-script and Trauma-cache token `20260726-mcqquality1`. `node --check script.js`, `npm test` and `npm run lint` pass. Contracts cover all 37 stable IDs, rationales, sources, review states, unanswered focus, full answer review and retry labels.
