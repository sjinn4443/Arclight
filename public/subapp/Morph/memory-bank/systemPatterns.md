# System Patterns

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

Morph is currently a static HTML, CSS and JavaScript app. There is no build step.

## UI Pattern

- Fixed white app bar.
- Cartoon icon to the left of the centred Morph title.
- Dark control cards on a black page.
- Full-width Field row split into Direct and BIO groups.
- Rx label instead of Focus.
- Rx buttons use symbolic labels: `+++`, `++`, `0`, `--` and `---`.
- Condition dropdown and Adult/Child switch share the lower control row.
- Light side menu slides from the left and uses coloured dots for conditions.
- Quick guide is a light pop-up panel with compact cue cards.

## Viewer Pattern

- Canvas draws a black background and a circular fundus viewing window.
- Field controls change aperture radius.
- 5, 8 and 15 degree fields represent direct ophthalmoscopy.
- 25, 35 and 45 degree fields represent indirect BIO.
- Rx controls change image scale.
- Cataract slider has four levels from none to dense.
- Cataract presets and occlusion spots are copied from Swollen Discs.
- Corneal reflex uses the Swollen Discs ellipse shape, opacity model and lower-aperture placement.
- Viewing-window edge uses the Swollen Discs three-pass translucent ring, not a hard glow stroke.
- Mouse dragging follows the pointer. Touch and pen input offset the viewing circle above the contact point so the hand does not cover the view.
- Background patient movement uses bounded random velocity jitter and periodic shift-return movement based on the Swollen Discs realism pattern, tuned down slightly for Morph.
- Child mode adds less steady movement and a livelier view.

## Important Constraints

- Do not reintroduce Zoom.
- Do not reintroduce duplicate stage toolbar text.
- Do not crop or zoom pathology images in code to fix artwork framing.
- Keep the app usable in a 360 x 740 viewport.
- Keep local fonts so the app works predictably when opened directly from `index.html`.
