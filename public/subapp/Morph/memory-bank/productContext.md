# Product Context

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

Morph is for quick teaching and demonstration rather than assessment. A learner should be able to change the viewing field, media opacity, optical focus and pathology without reading instructions.

The app uses visual behaviour to show why the same retina can become easier or harder to inspect. Wider fields improve orientation. Narrow fields make small changes harder to follow. Cataract adds blur, tint, contrast loss and patchy opacity.

## User Experience Principles

- The first screen should be the tool, not a landing page.
- Keep controls visible, dense and easy to scan.
- Keep the stage dark so the fundus view is the focus.
- Use text only where it directly labels a clinical control.
- Avoid repeating selected condition or Rx values in a separate toolbar.
- Keep the quick guide brief enough to read in one glance.

## Reference Apps

Fundal Reflex provides the UI language: local fonts, compact clinical controls, light menus and a concise quick guide.

Swollen Discs provides the closest viewer lessons: cataract constants, corneal reflex model, touch and pen pointer anchoring and dark clinical canvas behaviour.

# v1.1 product context (23 July 2026)

The main workflow remains Cataract, Field, Rx, Condition, Adult/Child then the draggable fundus view. The side menu remains a condition chooser and now also hosts a clearly separated two-press **New training session** action. Morph is not a diagnostic or operational decision tool and engineering verification does not imply clinical approval.

## Achievement context — 26 July 2026

The condition chooser is the app's teaching progression. Visiting all five conditions demonstrates exploration of the available simulator states, so the Cup belongs to condition completion rather than an MCQ. This preserves Morph's compact purpose and avoids implying clinical knowledge assessment from unreviewed quiz content.
