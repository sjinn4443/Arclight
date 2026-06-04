# Progress

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

## Completed

- Studied Fundal Reflex README and memory-bank notes.
- Studied Swollen Discs README, memory-bank notes and viewer logic.
- Reworked Morph UI toward the shared clinical control language.
- Kept Morph's white app bar, black title text, black stage and cartoon character.
- Removed the Zoom control.
- Changed Focus label to Rx.
- Changed Rx button labels to `+++`, `++`, `0`, `--` and `---`.
- Made Field use the full row width.
- Split Field into Direct and BIO groups.
- Tightened the Direct/BIO labels so the control deck gives more space back to the stage.
- Updated the quick guide to say DO and BIO, and removed the unnecessary drag instruction.
- Made Adult/Child a switch.
- Changed Condition to a dropdown on the main screen.
- Removed duplicate stage toolbar text.
- Removed Viewing Mode from the side menu.
- Updated the quick guide and date to 18/5/2026.
- Added local font assets.
- Matched Swollen Discs cataract presets and occlusion spots.
- Matched Swollen Discs corneal reflex model.
- Matched the viewing-window rim to the Swollen Discs layered ring style.
- Kept mouse dragging under the pointer and offset touch or pen dragging so the contact point stays below the circle.
- Constrained the controls and stage to a phone-like width on laptop so the image scale stays consistent with mobile review.
- Copied the Swollen Discs-style jerky background movement, then softened it slightly for Morph with lower jitter, a longer shift interval and a smaller shift distance.
- Reverted pathology image source cropping after it changed artwork size.

## Current Known Issues

- Pathology artwork framing is not perfect in some wide-field views. This is currently treated as an artwork/source-image issue, not a code scaling issue.
- The app is still a single-file JavaScript implementation inside `index.html`; future refactors should be careful and incremental.

## Verification Done

- Inline script syntax check passes.
- In-app browser visual checks were performed at phone width.
- Console checks during control interaction showed no warnings or errors.
