# Tech Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: black `#111111` on a white appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Morph runs directly from `index.html` with local assets. A local server is optional for cache-free visual checks.

## Stack

- HTML, CSS and vanilla JavaScript.
- Canvas 2D rendering.
- Local image assets.
- Local WOFF2 fonts in `assets/fonts/`.

## Verification

Use the in-app browser for visual checks, especially at 360 x 740. After script edits, run the inline script syntax check from the README.

Also check the browser console after interaction with:

- Field buttons.
- Rx buttons.
- Cataract slider.
- Condition dropdown.
- Adult/Child switch.
- Side menu.
- Quick guide.

## Reference Repos

- `C:\Users\William\Desktop\Arclight App\Fundal Reflex`
- `C:\Users\William\Desktop\Arclight App\Swollen Discs`

Use those references for UI style and viewer behaviour. Prefer Swollen Discs for the Morph corneal reflex and cataract model.
