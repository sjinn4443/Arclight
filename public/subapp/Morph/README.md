# Morph

<!-- APP-DOC-STATUS:START -->

## Current Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: black `#111111` on a white appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Morph is a compact fundus-view simulator for teaching how the optic nerve and macula view changes with field size, refractive error, cataract and patient movement.

It is designed as a mobile-first teaching app, with the working reference viewport set at 360 x 740. It is a teaching aid, not a diagnostic tool.

## Current UI Direction

- Keep the white app bar with black text.
- Keep the small cartoon character beside the centred Morph title.
- Keep the black clinical stage.
- Use the Fundal Reflex and Swollen Discs visual language for controls: compact rows, clear hierarchy, strong touch targets and restrained clinical colour.
- Keep the first-page control hierarchy as Cataract, Field, Rx then Condition and Adult/Child.
- Split Field visually into Direct fields for 5, 8 and 15 degrees and BIO fields for 25, 35 and 45 degrees.
- Use symbolic Rx buttons: `+++`, `++`, `0`, `--` and `---`.
- Keep the Adult/Child control as a switch.
- Keep Condition as a dropdown on the main screen.
- Keep the side menu for Conditions only.
- Do not restore the duplicate stage toolbar text above the canvas.
- Do not restore the Zoom control.

## Engine Notes

- Cataract presets and occlusion spots match the Swollen Discs app constants.
- The corneal reflex uses the Swollen Discs lower-ellipse shape, opacity model and movement behaviour.
- The circular viewing-window edge uses the Swollen Discs layered ring rather than a single hard white stroke.
- Mouse dragging follows the pointer; touch and pen movement anchors the viewing circle above the contact point so the hand does not cover the view.
- Background movement uses Swollen Discs-style patient motion, tuned down slightly for Morph, with small continuous jitter and a periodic shift-and-return gaze movement. Child mode makes this slightly livelier.
- Pathology artwork is drawn at its original full-image scale. Do not crop, reframe or zoom these assets in code unless the artwork itself is replaced.

## Files

- `index.html` contains the app structure and canvas engine.
- `styles.css` contains the visual system and responsive layout.
- `assets/fonts/` contains local Inter and Quicksand font files copied from the Swollen Discs/Fundal Reflex UI pattern.
- `assets/images/ret180.webp`, `assets/images/S.webp`, `assets/images/C.webp`, `assets/images/crvo.webp` and `assets/images/zyx.webp` are the fundus images.
- `assets/images/morph.webp` is the small cartoon character in the app bar.

## Quick Checks

Open `index.html` directly in the Codex in-app browser. Check the app at 360 x 740 after UI changes.

Useful syntax check:

```bash
node -e "const fs=require('fs'); const html=fs.readFileSync('index.html','utf8'); const m=html.match(/<script>([\s\S]*)<\/script>/); if(!m) throw new Error('No script found'); new Function(m[1]); console.log('script syntax ok');"
```

The quick guide date currently reads `Updated 18/5/2026`.
