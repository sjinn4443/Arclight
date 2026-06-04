# Swollen Discs

<!-- APP-DOC-STATUS:START -->

## Current Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: red `#f03b2f` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Interactive ophthalmology teaching app for recognising normal, suspicious and definitely swollen optic discs.

The app is intentionally mobile-first. The usual review size is `360 x 740`, with tablet and laptop views kept as a centred single-column app rather than a split desktop layout.

## What It Teaches

- Compare normal, suspicious and definitely swollen discs.
- Practise narrow, standard and dilated fields of view.
- Switch between right eye and left eye orientation.
- Scan around the disc and retina on a canvas rather than relying on one static crop.
- Add cataract as a viewing challenge.
- Practise with tiered MCQ sets and timed hidden-answer sets.

## Current Feature Set

- Three disc states:
  - `Normal`: crisp disc margins, visible cup, healthy colour and vessels
  - `Suspicious`: halo or nasal elevation without major vessel obscuration
  - `Swollen`: elevation with vessel obscuration, haemorrhages or both
- Adaptive image loading:
  - phones and coarse-pointer devices use `2048w` WebP assets
  - larger screens use full-resolution WebP assets
  - URL override via `?images=mobile` or `?images=full`
- Canvas viewer with drag scanning, gaze shift and cataract overlay.
- FOV slider for `4°`, `8°` and `15°` viewing.
- Cataract remains a slider with labelled stops, using the same dark circular thumb style as the FOV slider.
- Tiered MCQ flow:
  - Primary
  - Intermediate
  - Advanced
- Tiered timed test flow with disabled submit until an answer is selected.
- Local cup achievement after both Advanced sets are completed.
- Desktop-only phone-size preview for checking mobile realism.
- Laptop layout stays in the same single-column shape as mobile review.

## Applied UI Style

This app now follows the reusable Fundal Reflex visual language:

- black app bar with red title and compact red icon controls
- Quicksand title font and Inter UI font loaded from local WOFF2 assets
- quiet white/off-white control cards with blue-grey borders
- dark clinical viewing stage
- compact mobile-first rows
- Fundal-style range controls with dark circular slider thumbs
- compact grey/red switch styling for binary controls
- light side menu with small coloured level dots
- progressive disclosure for MCQ and timed levels
- soft modal shells, medium action rows, tighter question cards and tighter option rows
- short in-app copy rather than a manual

Keep future UI changes conservative. Prefer existing tokens, compact controls and clear state changes over decorative panels.

## Usage

1. Serve the folder locally, for example `npm start`.
2. Open the local server URL in a browser.
3. Use the disc state buttons to switch between `Normal`, `Suspicious` and `Swollen`.
4. Use the FOV slider, eye toggle and cataract slider to change the viewing challenge.
5. Drag on the canvas to scan around the retina.
6. Open the quick guide from the red `i`.
7. Open the menu for MCQ, timed sets and certificate progress.

## Project Structure

- `index.html`: page shell, controls, modal shells and app mounting points
- `styles.css`: visual system, layout, menus, modals and responsive rules
- `script.js`: app bootstrap and controller wiring
- `viewer.js`: canvas viewer, image loading, gaze shift and cataract rendering
- `viewer-math.js`: pure viewer geometry helpers
- `app-constants.js`: tier, image, cataract and explanation configuration
- `image-assets.js`: adaptive image-set selection
- `mcq-engine.mjs`: pure MCQ selection, scoring and result formatting
- `mcq-controller.js`: MCQ modal flow and tier progression
- `timed-test.js`: timed test flow and scored rounds
- `modal-manager.js`: side menu, modal state and focus handling

## Local Checks

```powershell
npm test
npm run lint
npm run format:check
```

For UI work:

- open `index.html` directly; serve the folder locally only for cache-free testing
- check the first screen at `360 x 740`
- check the menu, quick guide, MCQ modal and timed mode
- watch for console errors, horizontal overflow and clipped labels

## Known Constraints

- Scores and achievements are stored locally in the browser.
- The certificate is a local practice certificate, not external verification.
- Existing trusted rendering paths still use limited `innerHTML` for result and explanation markup.
