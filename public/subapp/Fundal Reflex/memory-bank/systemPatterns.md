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

Single-page client-side app with HTML, CSS and vanilla JavaScript.

Core structure:

- `index.html`: stage, controls, modal shells, results box and critical first-paint fallback CSS
- `style.css`: ordered import manifest for the split stylesheet files
- `styles/base.css`: tokens, resets, app bar and first-paint basics
- `styles/menus.css`: side menu and visual case picker list/cards
- `styles/controls-results.css`: top controls, context strip and results panel
- `styles/advanced-controls.css`: docked Advanced panel, switches, selects and sliders
- `styles/eyes.css`: stage, eye model, reflex surfaces and eye overlays
- `styles/retinoscopy-observation-test.css`: light controls, observation guide, teaching overlay, test banner and retinoscopy controls
- `styles/modals.css`: About, MCQ, Cases and photo modal styling
- `styles/responsive.css`: mobile, small-screen, coarse-pointer and reduced-motion rules
- `script.js`: entrypoint only
- `src/app.js`: top-level wiring, controller composition, advanced dock and results wiring
- `src/state.js`: shared mutable app state
- `src/dom.js`: cached DOM references
- `src/condition-context-controls.js`: Advanced context switch rendering and state updates
- `src/observation-guide.js`: observation-guide collapse, replay and target-highlight behaviour

Teaching and selection flow:

- `src/case-catalog.js`: grouped 32-case list, level ordering, Baby subset and display labels
- `src/menu-visual-cases.js`: progressive visual case modal, level fold-up sections, snapshot-backed case cards and reference-photo viewer
- `assets/case-thumbnails/`: generated WebP snapshots from the live stage used by the modal
- selected WebP real photos in `assets/` are mapped to 7 cases and exposed through camera icons
- hidden `refraction-state` select retained internally for shared case wiring
- visible stage control row now uses previous/current/next navigation; reference photos are only in the `Cases` modal
- visible stage control row also carries a compact level marker for the selected case, exposing Primary / Intermediate / Advanced context without opening the modal
- `Cases` progressive disclosure pattern:
  - `Primary cases` render open by default in a green bar
  - `Primary cases` include cases `1-8`, with poor-view technique cases at `3` and `4`
  - `Intermediate cases` render collapsed in an orange bar, include cases `9-22` and move from common introductory patterns toward harder patterns
  - `Advanced cases` render collapsed in a red bar, include cases `23-32` and move from more likely introductory specialist patterns toward harder patterns
  - `Similar cases` is collapsed by default
  - display numbering follows case labels; each case belongs to one level so numbering stays contiguous
  - Baby mode filters the same level structure to a 16-case subset

Interpretation and assessment:

- `src/clinical-interpreter.js`: case + modifiers -> result strings
- `src/mcq-bank.js`: MCQ content
- `src/menu-mcq.js`: side-menu MCQ flow
- `src/test-mode.js`: timed hidden-case flow
- `src/test-condition-context.js`: default onset/symptom seeds for the two visible switches
- context switches for onset and glare live in Advanced; `Gaze`, `Dilated` and `Baby` stay in the main control strip because they change visible eye movement, pupil aperture or model
- results panel uses native `<details>` so `Referral` stays visible while secondary detail folds underneath
- `src/modal.js`: shared modal controller used for focus trapping, body scroll locking and Escape handling across About, MCQ, Cases and reference-photo dialogs
- `src/mcq.js`: samples questions, shuffles answer options while preserving answer keys, grades results and renders with DOM/text-node construction rather than HTML string interpolation
- MCQ bank quality pattern:
  - maintain enough questions above each sampled count
  - keep Primary plain-language and visually grounded
  - let Intermediate and Advanced progress into more specific pattern recognition
  - avoid app-navigation distractors
  - verify shuffled options still preserve the correct answer

Rendering:

- `src/retinoscopy.js`: live beam and reflex orchestration
- `src/retinoscopy-visuals.js`: case flags and visual builders
- `src/retinoscopy-active-reflex-*.js`: reflex-family builders
- `src/retinoscopy-overlays.js` and `src/retinoscopy-pathology-overlays.js`: masks and overlay rendering
- `src/eyes.js` plus `eyes-*` helpers: geometry, Baby mode, Dilated mode, drag posture and ambient motion
- `src/eyes-ambient.js`: baseline blink/micro-motion plus optional `Gaze` shifts; `Gaze` uses small off-centre resting gaze, timed gaze-away offsets, occasional larger down-gaze/lid-droop events, and baseline-driven lid timers that clear pending blink/droop state when needed
- accepted motion tuning keeps hand jitter slow, inter-eye stagger small, endpoint bounce restrained and whole-face tilt visible but not dominant
- `src/observation-guide.js` owns observation-guide collapse logic, slow teaching replay and green stage-target highlights
- `src/observation-guide.js` switches observation-guide mode from the current case level: Primary uses `Match`, `Bright`, `Straight`; Intermediate and Advanced use the full grouped guide
- observation-guide connector lines use computed target rectangles passed from the cue geometry, not animated highlight element measurements
- Crescent cue geometry is computed from the pupil rectangle as a top-edge or bottom-edge cap so it follows the visible crescent region rather than the full pupil centre
- `src/app.js` adds `app-ready` to `body` after initial render/control reveal so CSS can distinguish the dark pre-ready stage fallback from the loaded stage
- corneal circular light-patch size is part of the overlay response:
  - when beam bias favours one eye, that eye's corneal circle scales up slightly
  - the fellow eye's corneal circle scales down slightly
  - actual light movement adds only a tiny same-direction position shift via CSS custom properties
  - squint/alignment diagnosis should mostly come from the eye moving around a stable reflected light point
  - squint brightness boost is weighted by live iris offset, including `Gaze`, so a temporarily straight eye loses the extra boost
  - horizontal off-gaze brightness also applies to the normal fellow eye through reflex brightness, pupil fill and slight opacity lift
- front-of-reflex overlays such as cataract/media opacity should remain visually layered above the reflex, while crescents are clipped by the pupil edge
- tear-film shimmer and floater drift are dynamic case cues; they should move subtly relative to eye movement rather than behaving like static labels

## Key Technical Decisions

- Keep the app fully client-side.
- Use a shared mutable state object and controller modules.
- Keep `script.js` tiny and keep `src/app.js` as orchestration rather than a feature dumping ground.
- Move feature rendering and event handling into named controller modules once it becomes self-contained.
- Keep DOM lookups in `src/dom.js`; pass `state`, `dom` and callbacks into controllers.
- Avoid `innerHTML`, `outerHTML` and `insertAdjacentHTML` for app data. Use `createElement`, `textContent`, text nodes and `replaceChildren`.
- Keep the visual case picker separate from the hidden internal select.
- Keep case thumbnails derived from the live renderer instead of maintaining separate miniature drawing logic.
- Keep all app-used image assets in WebP.
- Keep reference photos separate from snapshots so the simulation stays the primary teaching surface.
- Keep MCQs deterministic in grading but randomized in question and answer-option order.
- Keep Primary MCQs beginner-facing: avoid technical terms that are not needed for the basic eight-case recognition set.
- Keep the result interpreter deterministic, not generative.
- Keep modifier logic simple and explicit.
- Keep the beam-bias cue subtle: brighten the active eye and slightly enlarge its corneal circle while letting the fellow eye soften and shrink a little.
- Keep light-driven corneal reflex movement at `2%`, capped to sub-pixel/small-pixel movement (`0.8px` X, `0.6px` Y).
- Keep `Gaze` brightness variation based on horizontal off-axis position and visible enough to show voluntary in/out gaze brightening in either eye.
- Keep beam-crossing brightness changes gradual rather than binary.
- Keep eyelid animation state baseline-driven: upper lids return to resting lid height or active Gaze droop, lower lids return to `0px`.
- Keep CSS split once it grows beyond a comfortable single file. Preserve cascade order through the `style.css` import manifest.
- Keep cache-busting query strings in place during local static serving, even though they are manual today.
- Keep iOS hardening lightweight with safe-area padding, dynamic viewport sizing and contained modal scrolling.
- Keep visual polish conservative: preserve the black/red header, white clinical controls, dark stage and warm light/reflex cues.
- Preserve the current app-bar height, approved colours, Quicksand title and Inter UI font during maintenance passes.
- Add new UI values through tokens where possible:
  - surfaces
  - spacing
  - tap targets
  - radii
  - motion
  - focus rings
  - shadows
- Keep the loaded `.eyes-wrapper` background dark; first-paint fixes should live behind `body:not(.app-ready)` or inline critical CSS so they do not lighten the final stage.
- Keep the info icon as a plain red lowercase `i` without a circle.
- Keep the documented `Fundal Reflex look` reusable for future small teaching apps:
  - black app bar with bright green title and icons
  - white clinical controls
  - light side menu with small coloured level dots
  - dark stage
  - progressive disclosure
  - compact mobile-first rows
  - subtle shadows/radii
- Use radius hierarchy:
  - softest corners for modal shells, the main stage and result panels
  - medium corners for section/action bars such as case levels, side-menu MCQ buttons, submit buttons and question cards
  - tighter corners for compact cards
  - tightest corners for nested previews and MCQ option rows
  - pills/circles only for grouped case controls, toggles and icon buttons
- Use label-column + flexible-control-column rows in dense controls to prevent awkward right-side gaps.
- Prefer collapsed details/tools over always-visible filter bars when modal complexity grows.
- For Advanced panel colour, use pale surface tints and label colour only; avoid strong edge rails or decorative stripes.
- For observation-guide teaching, use one temporary green stage highlight at a time; avoid persistent labels or multiple simultaneous arrows.
- For Primary observation teaching, keep the active words to `Match`, `Bright`, `Straight` and avoid small technical group labels.
- For Intermediate and Advanced observation teaching, keep the full guide grouped as `Reflex`, `Geometry`, `Surface` and `Check`, with cue order `Light`, `Colour`, `Shape`, `Crescent`, `Cornea`, `Compare`.
- For Crescent teaching, keep the highlight attached to the real upper pupil edge, or lower edge for myopia, and avoid shrinking it into a small central marker.
- For Baby mode geometry, remember that CSS transform scaling does not reduce flex layout width; the Baby eye gap is intentionally `0px` so the rendered inner canthus gap is actually smaller.
- For `Baby` + `Gaze`, slower/longer eyelid closures are allowed to mimic a less cooperative infant. Do not apply that extra blink behaviour to Baby mode alone.

## Reusable Local App Template

Apply these rules when copying this project structure to other local teaching apps:

- split HTML, CSS and JavaScript clearly
- keep one shared state object
- keep controller modules small and named by responsibility
- render data as text, not HTML strings
- validate typed, pasted, uploaded, parsed or stored input before use
- avoid local storage unless there is a clear, versioned shape
- use native accessible controls before custom clickable containers
- split CSS by responsibility and keep responsive rules last
- preserve visual identity through tokens rather than scattered one-off values
- run syntax checks, unsafe HTML-injection search and a local-server browser smoke check before sharing

## Current Hotspots

- `src/retinoscopy.js`
- `src/retinoscopy-case-metadata.js`
- `src/menu-visual-cases.js`
- `src/observation-guide.js`
- `src/central-media-masks.js` and `src/retinoscopy-active-reflex-media.js` for lens/capsule opacity artwork such as PCO versus PSC-style plaques
- `styles/retinoscopy-observation-test.css` for observation-guide and test-mode layout
- `styles/menus.css` and `styles/modals.css` for the `Cases` modal and photo CSS
- manual cache-busting query strings in `index.html` and module imports

No urgent broad refactor is needed.
