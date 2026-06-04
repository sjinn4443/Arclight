# System Patterns

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

- Single-page static app (`index.html` + CSS import entrypoint + module entrypoint).
- Controllers handle DOM events/rendering:
  - `risk-calculator-controller`,
  - `popup-controller`,
  - `mcq-controller`.
- Pure engines own deterministic logic:
  - `risk-engine`,
  - `mcq-engine`.
- Data modules hold static configuration (`mcq-data`, `risk-config`).
- UI state remains local to each controller; no global framework/store.

Notable current patterns:

- `styles.css` imports modular CSS layers:
  - `styles/base.css`,
  - `styles/layout.css`,
  - `styles/components.css`,
  - `styles/responsive.css`.
- `risk-config` is the single source for:
  - scoring constants,
  - UI scoring explainer lines (`INFO_LOGIC_ITEMS`),
  - version label (`INFO_LOGIC_VERSION`).
- `popup-controller` renders the scoring explainer list/version dynamically from config.
