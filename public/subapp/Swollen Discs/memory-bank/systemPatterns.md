# System Patterns

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

## Architecture Overview

The application is a client-side web app using HTML, CSS and JavaScript modules. Rendering and interaction are wired in `script.js`, while MCQ domain logic is isolated in `mcq-engine.mjs`.

## Key Technical Decisions

- Use HTML5 canvas for realistic retina simulation and dynamic visual effects.
- Keep the app backend-free for portability and offline-friendly use.
- Separate pure MCQ logic from DOM orchestration to improve maintainability and tests.
- Use config-driven tier definitions (`app-constants.js`) for MCQ/timed progression.
- Persist achievement state locally (`localStorage`) instead of adding backend state.
- Apply timed-mode safety clamps in controller logic so scored rounds stay difficult but avoid impossible visual combinations.
- Use cached mobile cataract overlay layers (per cataract level + canvas size) to decouple visual realism from per-frame computation cost.
- Keep the Fundal Reflex visual language as the default UI baseline: black app bar with bright green title and icons, Quicksand title, Inter UI text, light clinical controls, restrained shadows, compact mobile rows and progressive disclosure.
- Match range-control parts as a set: FOV and Cataract sliders should share track treatment and the same dark circular thumb.
- Keep the RE/LE switch on the compact Fundal-style grey track with red checked state.

## Design Patterns

- Event-driven UI updates from DOM listeners.
- State-driven rendering for viewer controls and test modes.
- Performance-aware rendering:
  - Coalesced draw scheduling (`requestDraw`) instead of immediate multi-source direct draws.
  - Mobile cataract redraw throttling.
  - Visibility-based pause/resume for animation loops.
- Pure-function MCQ engine for deterministic scoring and report formatting.
- Accessibility-first modal behaviour (focus trap + focus restore).
- Tier progression pattern:
  - UI lock/completion state derived from controller progress objects.
  - Advanced completion gates downstream rewards (cup achievement).
- UI shell pattern:
  - `index.html` owns semantic structure and stable controller IDs.
  - `styles.css` owns the tokenised visual layer.
  - avoid inline styles in markup where a component class can do the job.
  - preserve the radius hierarchy: modal shell > action/card > inner option/media.
  - do not convert a slider into segmented buttons unless the interaction itself should change; visual matching should usually happen in CSS first.

## Component Relationships

- `index.html` loads `styles.css`, `questions.js` and `script.js`.
- `script.js` imports constants, controllers, viewer, MCQ engine helpers, and `image-assets.js` for runtime asset set selection.
- `questions.js` provides source MCQ content.
- `mcq-engine.mjs` builds tier payloads, evaluates submissions, generates pass codes, and formats exports.
- `mcq-controller.js` and `timed-test.js` each expose `getLevelProgress()` for menu rendering.
- `smoke-test.mjs`, `mcq-unit-test.mjs`, `app-integration-test.mjs` and `questions-qa.mjs` validate integrity and behaviour.

## Critical Implementation Paths

- Canvas pipeline: image load -> `draw()` -> jitter/gaze shift -> pointer drag updates.
- Mobile cataract pipeline: build cached cataract layer (tint + occlusion patches) on level/size change -> reuse layer in draw path.
- Asset-selection pipeline: detect query override / pointer type / viewport size -> choose image set -> apply condition button sources and timed image sources.
- MCQ pipeline: select tier -> build tier-filtered randomised test -> render -> optional timer -> submit -> evaluate -> highlight -> export.
- Timed test pipeline: select tier -> apply tier profile + safety clamps (`8deg/15deg`, cataract `<= Slight`) + randomised augmentations (including guaranteed >=1 vertical flip per set) -> show image -> hide image -> collect guess -> round feedback -> final score.
- Timed submit pipeline: enable submit only when an option is selected -> inline validation message for empty submit (no blocking modal alerts).
- Accessibility pipeline: open modal/menu -> manage focus -> close and restore trigger focus.
- Achievement pipeline: recompute MCQ/timed advanced completion -> unlock cup -> persist unique code -> enable certificate download.
- Desktop realism-preview pipeline: toggle phone-preview mode -> apply CSS class -> persist local preference -> force viewer redraw.
- Local UI verification pipeline: serve the folder -> check `360 x 740` and current review viewport -> inspect first screen, side menu, quick guide, MCQ modal and timed mode -> check console messages.
