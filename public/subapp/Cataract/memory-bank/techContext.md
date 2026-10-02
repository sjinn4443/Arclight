# Tech Context

<!-- APP-DOC-STATUS:START -->

## Historical Memory Status (26/7/2026)

- Release: `v1.1`; local runtime, offline packaging and safety bundle verified 26 July 2026.
- Static packaging: direct-file basic use plus HTTP/HTTPS installable offline support.
- Mobile target: `360 x 740`, using one document scroll and no internal card scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: orange `#ff8a00` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
- Runtime fonts are local and no CDN script or stylesheet is required.
- Manifest and service worker provide app-scoped offline reload.
<!-- APP-DOC-STATUS:END -->

- Runtime: browser, no framework.
- Language: vanilla JavaScript (ES modules).
- Core files:
  - `index.html`
  - `style.css`
  - `script.js`
  - `src/*.js`
- Assets: local PNG images for fundal/back-of-eye choices.
- External runtime resources: none.
- Offline files: `manifest.webmanifest`, `service-worker.js`, `pwa-register.js`.

## Local Run

- `python -m http.server 8080`
- open `http://127.0.0.1:8080`

## Validation Commands

- `npm test`
- `npm run test:contracts`
- `npm run audit`
- `node qa-cataract-acceptance.mjs`
- `node qa-cataract-combination-audit.mjs`
- `node qa-cataract-result-output-audit.mjs`
- `node qa-cataract-full-audit.mjs`
- `node qa-cataract-lmic-content.mjs`

## Latest Validation Snapshot (2026-07-26)

- App contracts:
  - checks passed `13/13`
- Acceptance audit:
  - checks passed `30/30`
- Combination audit:
  - no findings
- Result-output audit:
  - complete UI combinations `516,096`
  - unique visible Result panels `2,828`
  - findings `P0=0, P1=0, P2=0, P3=0`
- Full-state audit:
  - total states `7,558,272`
  - complete states `1,843,200`
  - complete+reachable `1,548,288`
  - findings `P0=0, P1=0, P2=0, P3=0`
- LMIC content audit:
  - PASS

## Tooling Status

- No separate lint runner is required for v1.1.
- QA is enforced through app contracts, deterministic audit scripts, visible Result-output checks and acceptance scenarios.
- Browser evidence is stored beneath `output/playwright/`.
- Source changes must be bundled with esbuild rather than editing `app.bundle.js` directly. An existing fleet-local esbuild binary can be used when npm is offline.

## Build tooling — 26 July 2026

The app now pins esbuild `0.25.5` locally and records it in `package-lock.json`. Run `npm run build` after source changes, then `npm run build:check`. The parity command does not write the bundle.
