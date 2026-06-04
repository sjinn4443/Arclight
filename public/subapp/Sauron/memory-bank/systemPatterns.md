# System Patterns

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: black `#111111` on an orange-red appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

## Architecture Overview

Single-page client-side app with HTML, CSS and vanilla JavaScript:

- `index.html`: structure, controls, modal shells and timed-test overlay
- `style.css`: theme, layout, advanced controls, case picker and responsive styling
- `script.js`: entrypoint only
- `src/app.js`: bootstrap and controller wiring
- `src/state.js`: central mutable application state
- `src/dom.js`: cached DOM references
- `src/constants.js`: refraction groups, MCQ metadata and test countdown sequence
- `src/case-catalog.js`: visual case tiers, summaries, thumbnail paths and baby-case filtering
- `src/menu-visual-cases.js`: Fundal-style case picker modal
- `src/retinoscopy.js`: streak placement, redraw scheduling and state mutations
- `src/retinoscopy-visuals.js`: barrel export for visual helper modules
- `src/retinoscopy-case-metadata.js`: case flags, active-refraction helpers, axis helpers and shared visual constants
- `src/retinoscopy-active-reflex.js`: moving reflex render strategies
- `src/central-media-masks.js`: media-opacity mask strategies
- `src/retinoscopy-pathology-overlays.js`: fixed pathology overlays
- `src/structural-eye-effects.js`: structural pupil and iris effects
- `src/eyes.js`: pupil, lid, gaze, dilation, baby and eye-motion behaviour
- `src/streak-controls.js`: direct streak drag behaviour and startup hint timing
- `src/menu-mcq.js`: burger menu and MCQ launch flow
- `src/mcq.js`: MCQ rendering and scoring helpers
- `src/test-mode.js`: timed assessment flow, masking and state restore
- `src/modal.js`: shared modal accessibility and focus management
- `src/info-modal.js`: instructions modal wiring
- `src/color.js` and `src/motion.js`: specialised helpers

## Key Technical Decisions

- Keep the app fully client-side.
- Use direct DOM events and a shared mutable state object.
- Keep retinoscopy redraws on `requestAnimationFrame`.
- Keep case metadata centralised.
- Keep visual case metadata in `src/case-catalog.js`.
- Keep explicit case ordering in `src/case-catalog.js` rather than inheriting order from grouped refraction options.
- Keep fixed structural defects and fixed pathology artwork separate from the moving reflex where needed.
- Keep timed testing non-modal so users can continue inspecting the reflex.
- Hide answer-leaking controls during timed testing instead of freezing sweep and rotate.
- Use a shared modal controller rather than duplicating focus and escape logic.
- Keep the user-facing case selector inside the dark eye stage so condition choice stays visually tied to the simulation.
- Keep stage controls layered above the beam and reflex artwork.
- Use WebP for runtime visual assets.

## Design Patterns

- Event-driven updates from buttons, switches, sliders and selects
- Event-driven direct drag interaction for the retinoscopy streak
- Controller factories that receive `{ state, dom }`
- Shared metadata driving UI and logic
- Fundal-style visual case picker generated from case metadata
- Small utility modules for motion preference, colour parsing and modal management
- Timed assessment state stored alongside simulator state for easy restore

## Component Relationships

- `src/app.js` wires all controllers and shared DOM state.
- `src/menu-mcq.js` owns burger interaction and MCQ launch.
- `src/menu-mcq.js` keeps the MCQ result row hidden until warning, score or feedback text exists.
- `src/menu-visual-cases.js` owns the case modal, case cards, similar-case helper and case-pill selection callbacks.
- `src/test-mode.js` launches timed rounds from the side menu, restores previous simulator state when closed programmatically and returns the side menu to a hidden inert state.
- `src/retinoscopy.js` consumes helpers from `src/retinoscopy-visuals.js`.
- `src/retinoscopy-visuals.js` re-exports case metadata, active reflex and pathology overlay helpers.
- `src/central-media-masks.js` and `src/structural-eye-effects.js` keep specialised rendering decisions out of general controller code.
- `src/eyes.js` notifies retinoscopy when geometry changes.
- `src/eyes.js` treats gaze, blink and ambient eye motion as examiner-owned beam motion, so gaze updates request redraws without retinoscopy recentering.
- `src/eyes.js` keeps eyelid animation baseline-driven: upper lids restore to `dataset.restingHeightPx` or active gaze droop, never to a transient inline blink height; lower lids restore to `0px`.
- `src/streak-controls.js` mutates sweep and rotation through the same retinoscopy state path as the older controls.
- `src/modal.js` is shared by the info, MCQ and case modals.
- `style.css` carries the Fundal-style case picker, advanced control cells, WebKit-safe pupil clipping fallback and responsive stage layout.
- `style.css` keeps collapsed Advanced internals out of layout and scales the mobile switch tracks so toolbar text fits at `360px`.
- `index.html` uses a Fundal-style `controls-deck-main` wrapper so the colour control and modifier switches are separate rows.
- the top control deck should copy the Fundal Reflex source CSS for control radius, border, shadow, switch sizing, checked-switch red and mobile gaps, not just the DOM structure.
- the `details.advanced-panel` is styled as the Fundal-style vertical dock when closed and a full-width Advanced panel when open.

## Critical Implementation Paths

- Retinoscopy interaction:
  - streak drag or control event -> setter -> `scheduleRetinoscopy` -> RAF update
- Case change:
  - case pill, arrows or modal card -> shared case metadata validation -> axis or pattern reset -> redraw
- Case order:
  - `src/case-catalog.js` explicit order -> global case indexes -> case pill arrows and modal card order
- Modifier switches:
  - switch change -> `eyesController` mode setter -> geometry update -> redraw
- Gaze mode:
  - `Gaze` switch -> Fundal-style gaze scheduler -> iris offsets, face tilt, lid droop and blink timing -> redraw without beam recentering
- Startup:
  - neutral iris transforms -> ambient animations start -> immediate retinoscopy render, avoiding the old random-offset first-paint race
- Baby mode:
  - switch change -> stage class update -> case-list filtering -> fallback baby case if needed
- Timed test:
  - side-menu button -> random condition sample -> control lock and mask -> interval countdown -> answer reveal
- MCQ flow:
  - side-menu level -> question sample -> hidden result row -> submit -> warning, score and feedback

## Current Rendering Model

- moving illuminated reflex lives in `.ret-reflex`
- `.pupil` enforces an explicit ellipse clip plus WebKit mask fallback so transformed reflex content stays inside the pupil on iOS/Safari
- fixed central media defects use `.central-subcortical-mask`
- cortical spoke patterns use `.cortical-cataract-mask`
- fixed pathology overlays use `.pathology-overlay`
- structural aperture variants use dedicated effects such as coloboma and iris transillumination patches
- corneal reflex dots live on `.eye::after` and `.eye::before`
- the non-examined fellow eye should not visually shrink the `.eye::after` dot; keep Fundal live sizing at `5px` with a `1.5px` border, then let beam geometry apply the scale
- corneal reflex micro-offset comes from iris movement in `src/eyes.js`
- corneal reflex light offset and scale come from beam geometry in `src/retinoscopy.js`
- during gaze, `src/retinoscopy.js` derives beam geometry from the rendered `.ret-streak` centre rather than from the moving pupil centre
- `src/retinoscopy.js` exposes `renderNow()` for immediate first render after startup state is stable
- active reflex behaviour is built in `src/retinoscopy-active-reflex.js`
- fixed pathology is built in `src/retinoscopy-pathology-overlays.js`

## Asset Pattern

- Case thumbnails are generated WebP files under `assets/case-thumbnails`.
- Thumbnail dimensions are `409 x 147`.
- Thumbnail captures must hide streak cue handles and avoid blink states.
- The current thumbnail cache key is `20260507-fellow-corneal`.
- Runtime cue images are WebP.
- Do not add PNG, JPG, JPEG, GIF or SVG runtime images unless the asset policy is explicitly changed.

## Refactor Outlook

No broad rewrite is needed. Continue the targeted split only when it reduces case-rendering risk:

- keep active reflex strategies in `src/retinoscopy-active-reflex.js`
- keep fixed pathology in `src/retinoscopy-pathology-overlays.js`
- keep media masks in `src/central-media-masks.js`
- keep structural pupil effects in `src/structural-eye-effects.js`
- keep case picker metadata in `src/case-catalog.js`
