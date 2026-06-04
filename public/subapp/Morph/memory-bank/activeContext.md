# Active Context

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

Last updated: 18/5/2026

## Current State

Morph has been updated to follow the Fundal Reflex and Swollen Discs UI language while preserving Morph-specific choices:

- White app bar with black title text.
- Cartoon character retained next to the centred title.
- Black page and stage retained.
- Dark compact control cards.
- Cataract, Field, Rx, Condition and Adult/Child hierarchy retained.
- Field now separates Direct fields from BIO fields.
- Rx buttons now use `+++`, `++`, `0`, `--` and `---`.
- Direct/BIO labels are intentionally quiet and compact so the Field row does not dominate the first screen.
- Quick guide copy should describe DO and BIO, and should not tell users to keep the pointer below the circle because the engine handles that automatically.
- Zoom removed.
- Stage toolbar repetition removed.
- Side menu simplified to Conditions only.
- Quick guide updated and dated 18/5/2026.

## Recent Correction

A source-crop experiment for pathology artwork was reverted because it zoomed the artwork. The app now draws pathology images at full source size again. Do not re-add code cropping or scaling to compensate for artwork framing.

## Engine Alignment

- Cataract constants match Swollen Discs.
- Corneal reflex shape, opacity and motion follow Swollen Discs.
- The viewing-window ring now uses the Swollen Discs layered translucent edge rather than a hard single white stroke.
- Pointer movement is below the circle as in Swollen Discs.
- Background patient motion follows the Swollen Discs feel but is tuned down slightly for Morph: small irregular jitter plus a periodic shift-and-return movement. Child mode is slightly livelier.

## Next Useful Checks

- Review the app at 360 x 740 after any visual change.
- Confirm no console errors after condition switching and dragging.
- Keep artwork changes separate from engine or layout changes.
