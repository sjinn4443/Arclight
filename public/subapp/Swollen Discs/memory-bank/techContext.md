# Technical Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: red `#f03b2f` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

## Technologies Used

- HTML5, CSS3, JavaScript (ES modules)
- Canvas API for retinal rendering
- Local Inter and Quicksand WOFF2 font assets
- CSS/Unicode glyphs for compact icon-like UI
- Browser `localStorage` for local cup achievement persistence

## Development Setup

- Static app served locally with `serve`
- No bundler or transpiler required
- Entry point: `index.html` with `<script type="module" src="script.js">`

## Technical Constraints

- Runs entirely in-browser (no backend)
- Must remain lightweight and mobile-first
- Targets modern browsers (Chrome, Edge, Firefox, Safari)
- Progression/achievement data is local to the browser profile/device
- Timed scoring mode intentionally excludes extreme visual combinations (`4deg` FOV and dense cataract) to preserve fair evaluability.
- Timed input validation must remain non-blocking to avoid pausing countdown flow.
- Phone rendering must stay responsive with cataract enabled; heavy cataract effects should use cached layers where possible.
- Desktop phone-preview simulation should alter viewer scale only, not degrade readability of surrounding UI text.

## Dependencies

- Runtime UI dependencies: no UI font/icon CDNs; the app uses local Quicksand for the app title, local Inter for UI text and CSS/Unicode glyphs for compact icons
- Dev dependencies: `serve`, `eslint`, `prettier`

## Tool Usage Patterns

- `npm start` for local hosting
- `npm run lint` for static checks
- `npm run format:check` for formatting checks
- `npm run smoke` for syntax/file/DOM hook integrity checks
- `npm run test:mcq` for MCQ logic unit checks
- `npm run test:viewer` for viewer math unit checks
- `npm run test:integration` for controller and modal flow checks
- `npm run test:questions` for question-bank schema/distribution QA
- `npm test` as the combined local verification command
- Integration tests now also cover:
  - Runtime image-set selection logic (`full` vs `mobile`)
  - Guaranteed timed-set vertical flip behavior
- Iterative viewer tuning typically uses:
  - `npm run format:check`
  - `npm run smoke`
  - `npm run test:integration`
