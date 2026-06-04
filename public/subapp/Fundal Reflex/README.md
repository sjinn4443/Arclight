# Fundal Reflex

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

Interactive browser-based fundal reflex simulator for teaching visual pattern recognition, bilateral comparison and simple referral judgement.

This project is intentionally mobile-first. The usual working review size is `360 x 740`, with additional checks around `402-415px` wide mobile screens.

## What It Teaches

- Compare both eyes at the same time.
- Start beginners with three simple checks:
  - Match
  - Bright
  - Straight
- Build up to the fuller reflex scan:
  - Light
  - Colour
  - Shape
  - Crescent
  - Cornea
  - Compare
- Choose the closest visual case rather than relying on a text label.
- Link the pattern to a compact likely interpretation and referral speed.
- Practise with MCQs and a timed hidden-answer `Test me` flow.

## Current Feature Set

- Broad diffuse light patch, centred by default and moved left/right/up/down with the mini light handle.
- Both eyes always visible.
- Beam bias brightens the active eye, softens the fellow eye and subtly changes corneal highlight size.
- The corneal reflex is mostly stable for diagnostic alignment, with only a tiny same-direction response to actual light movement (`2%`, capped below 1px vertically and horizontally).
- Main top controls:
  - `Colour` slider with italic Blue/Red anchors.
  - `Gaze` toggle for more realistic patient gaze shifts.
  - `Dilated` toggle for a useful larger-pupil viewing mode.
  - `Baby` toggle for smaller/baby eye geometry.
- Main stage case toolbar:
  - previous case
  - current `Cases` trigger
  - next case
- Current case trigger includes a compact Primary / Intermediate / Advanced tier marker so users can orient without opening `Cases`.
- No main-stage photo button; reference photos stay inside the `Cases` modal to reduce toolbar clutter.
- `Cases` modal with 32 WebP snapshot cards generated from the live renderer.
- `Learn` modal from the burger menu and `Quick guide` popup:
  - keeps the one-page handout intact as the shared almost word-free visual sheet
  - breaks the sheet into short English explanations for each image group, including dim light, calm patient, arm's-length comparison and move-side-to-side technique
  - links relevant panels back to practice cases in the simulator
  - provides a PDF download and image share action where supported
  - follows the rounding hierarchy: soft modal shell, medium tab/resource actions, tighter explanation cards and tighter image frames.
- Progressive disclosure in `Cases`:
  - `Primary cases` open by default in a green fold-up bar
  - `Intermediate cases` folded in an orange bar
  - `Advanced cases` folded in a red bar
  - Intermediate and Advanced are ordered from more common or introductory patterns toward harder patterns
  - `Similar cases` collapsed by default
- Baby mode uses a tighter 16-case subset in the same fold-up structure, falls back to `1. Normal (orange-red) R & L` when the selected case is excluded and now visibly narrows the inner canthus/IPD spacing.
- 7 selected cases include WebP reference photos from camera icons inside the `Cases` modal.
- Observation guide above the eyes:
  - starts visible
  - auto-collapses
  - reopens from a compact circular chevron
  - Primary cases show a centred beginner guide: `Match`, `Bright`, `Straight`
  - Primary guide colours are deliberately simple: `Match` pale white, `Bright` red and `Straight` blue
  - Intermediate and Advanced cases show the full guide: `Reflex` (`Light`, `Colour`), `Geometry` (`Shape`, `Crescent`), `Surface` (`Cornea`) and `Check` (`Compare`)
  - replay teaches the active guide slowly with temporary green stage highlights
  - replay connector lines are calculated from intended target rectangles rather than animated highlight boxes, so the line does not swing during target fade-in
  - `Crescent` highlights the actual upper pupil edge for top crescents and mirrors to the lower pupil edge for myopic bottom crescents
  - `Compare` is styled oblique/italic.
- `Quick guide` popup:
  - concise quick-help popup, not a manual
  - starts with a natural definition of fundal reflex as the pupil glow from the fundus seen with Arclight at arm's length
  - says `fundal` reflex rather than `red` reflex because a normal reflex may look orange-yellow or blue-white, especially with darker pigmentation
  - keeps the practical sequence brief: dim light, calm patient, compare brightness, colour and shape, move side to side then closer
  - then shows `Basics`: `Match`, `Bright`, `Straight`
  - follows with a visually quieter `More detail`: `Light + colour`, `Shape + crescent`, `Cornea + compare`
  - short usage notes only
  - version/date shown inline after the final-diagnosis warning
  - includes a `Learn from the handout` path into the visual handout modal.
  - stays within the `360 x 740` mobile review height after the wider `Quick guide` change.
- Header info control is a plain red `i` without the earlier red circle so it reads less heavily against the app bar.
- Side menu shares the main app theme: off-white panel, blue-grey borders and small coloured dot accents for Primary, Intermediate and Advanced only, rather than large saturated blocks.
- CSS now has a stricter token layer for spacing, radii, motion, focus rings, surfaces and tap targets while preserving the current app-bar height, colours, Quicksand title and Inter UI font.
- Header icons and modal close controls use larger tap regions with the same compact visual treatment.
- Startup first paint is hardened for phones:
  - light page fallback is applied immediately in the document head
  - the eye stage uses a dark pre-ready fallback until the app sets `app-ready`
  - the stage no longer fades in through a pale grey state.
- Compact referral-first result panel:
  - `Referral`
  - collapsible `Why`
  - `Site`
  - `Likely`
- Docked right-side `Adv` rail with red `+ / -` indicator.
- Advanced panel:
  - squint drag
  - iris colour
  - context toggles: `Gradual`, `Glare`
  - pupil sliders
  - lid sliders
  - cataract density
  - nystagmus direction, wave and rate
  - very soft section tinting/label colour only; no strong colour rails
- Eye realism:
  - irregular blink timing
  - occasional double blink
  - subtle independent micro-saccade variance
  - non-metronomic background jitter
  - eased pupil light response
  - tiny corneal highlight micro-drift
  - optional larger `Gaze` shifts with occasional down-gaze and mild lid drop
  - `Gaze` also adds small whole-face movement, with occasional larger random tilts so the patient feels less perfectly cooperative
  - softened hand-held light jitter while the probe is held off-centre
  - reduced inter-eye gaze stagger and endpoint bounce so eye movement feels alive without reading as lag
  - extra slow/long eyelid closures are limited to `Baby` + `Gaze`; Baby mode alone keeps the normal blink model
  - accepted `Gaze`-linked brightness model: live horizontal off-gaze brightens the reflex and pupil fill in either eye
  - reflex brightness ramps gently as the beam crosses the pupil
  - blink and Gaze lid timers restore to stable lid baselines so lids do not drift shut over time
- Case-driven nystagmus for bilateral aniridia, with nystagmus affecting reflex visibility without producing light-flash artefacts.
- Representational realism details include poor-tear-film shimmer, floaters drifting relative to eye movement, media opacity sitting in front of the reflex and crescents clipped by the pupil edge.
- Case `2` is labelled `Normal (blue) R & L`; it is treated as a normal blue-white variant with no referral needed.
- The Learn `Normal can vary` card matches the `Quick guide` wording: in those with darker pigmentation, a normal reflex may look orange-yellow or blue-white; bright, equal and round is reassuring.
- Case `8` is a unilateral dark/reduced reflex case, not a normal pigmentation variant.
- Cases `3` and `4` are poor-view technique cases: looking away and upper lid blocking. They use `? Action: Repeat view / ask for help`, not pathology framing.
- Case `7` is retinoblastoma in the current Primary sequence.
- Tiered MCQs:
  - Primary
  - Intermediate
  - Advanced
  - question content is aligned to the same Primary, Intermediate and Advanced case sections used in `Cases`
  - bank sizes are now Primary `16`, Intermediate `26` and Advanced `26`
  - questions and answer options shuffle while preserving answer keys
  - Primary language has been audited to stay plain and beginner-appropriate, avoiding advanced disease-name distractors and app-navigation distractors
  - Intermediate and Advanced progress toward more specific pattern recognition and specialist/adult-skewed cases
  - Advanced pass mark is `6/8`
- iOS/tablet hardening:
  - safe-area padding
  - `dvh` sizing where supported
  - contained modal scrolling

## Reusable UI Style: "Fundal Reflex Look"

Use this section as the reference if a future app should copy this visual language.

### Design System Discipline

- Preserve the current app-bar height, black appbar with red title and icons, Quicksand title and Inter UI font.
- Prefer named CSS tokens over new one-off values for colour, spacing, radius, motion, shadows, focus and tap targets.
- Keep the palette restrained: mostly neutral surfaces, one dark stage and red only for identity or priority cues.
- Use the existing radius hierarchy:
  - tight radii for compact controls
  - softer radii for stage, results and panels
  - `999px` only for true pills, circular buttons and toggles.
- Keep important touch targets near `44px` where the layout allows; compact visual glyphs can sit inside larger hit areas.
- Every interactive control should have a clear default, hover/pressed where relevant, focus-visible and disabled/locked state.
- Do not let accessibility fixes change the intended visual hierarchy; the app should look the same but behave more reliably.

### Overall Feel

- Clinical teaching tool, not a marketing page.
- Quiet, compact, touch-friendly and information-dense.
- Black/red identity from the app bar, balanced by soft white control cards and a dark stage.
- Main interaction should be visible immediately; advanced power is available but folded away.
- Prefer small, precise controls over large decorative panels.

### Palette

- Header: near-black with red accent.
- Controls: white/off-white surfaces with blue-grey borders.
- Main action red: used sparingly for brand, active warning/action cues and plus/camera icons.
- Stage: dark olive/black clinical viewing area, not pure decorative black.
- Text: dark navy/grey, not pure black except where contrast requires it.
- Result urgency colours:
  - green for none/routine
  - amber/orange for soon
  - red for urgent

### Layout Lessons

- The app should fit and feel balanced at `360 x 740`.
- Keep the top control deck as one compact unit:
  - main control card on the left
  - `Adv` rail on the right
  - visible buttons below the main slider
- Use progressive disclosure:
  - `Adv` hides specialist controls.
  - `Cases` shows Primary first, then Intermediate and Advanced as coloured fold-up bars.
  - the side menu uses light card-style actions with small coloured level dots.
  - Similar cases are folded by default.
  - Results show referral first, details second.
- Avoid large empty right-side gaps in rows. Use a fixed label column plus flexible content column.
- Do not put UI cards inside other cards unless the inner card is an actual repeated item or modal/card entry.
- For small rows, use one-line label/control layouts:
  - `context` + controls
  - `pupil` + sliders
  - `lid` + sliders
  - `cataract` + slider
- Avoid full-width sliders when a shorter row is more readable, but if a section spans the row, ensure the controls fill the remaining space evenly.

### Rounding and Shadows

- Functional controls: moderately tight corners.
- Stage and result panel: softer corners.
- Small chips/buttons: rounded but not oversized pills unless they are toggles or circular icon buttons.
- Shadows should be soft and shallow on controls.
- Avoid heavy floating-card effects; the app should feel precise rather than glossy.
- Current modal hierarchy:
  - modal shells use the softest panel radius
  - large accordion/action bars use a medium radius
  - case/question cards sit one step tighter
  - image previews and MCQ option rows are tighter again
  - circular photo/index controls remain true pills or circles.

### Typography

- Mobile text should stay readable but compact.
- Main title is large/red and centred in the black app bar.
- Section labels in Advanced are small, slightly lighter, and not shouty.
- Helper words can be italic:
  - Blue/Red slider anchors
  - `drag eyes`
  - `Compare`
- Modal close buttons should be visually light; avoid a heavy square focus look.
- Do not over-explain in-app. Keep copy short and functional.

## Reusable Local App Quality Template

Use this as the practical template for this app and future small local web apps.

### File Shape

- Keep HTML, CSS and JavaScript split clearly.
- Keep `index.html` as structure, modal shells, first-paint fallback CSS and app mounting points.
- Keep `script.js` as a tiny entrypoint only.
- Keep `src/app.js` as orchestration, not a dumping ground. Once a feature has its own state, rendering and event handling, move it into a controller module.
- Keep one obvious state object in `src/state.js`; controllers should receive `state`, `dom` and callbacks rather than making hidden globals.
- Keep DOM lookup in `src/dom.js` so controller modules do not repeatedly search the page.

### Safe DOM Rendering

- Do not inject user or data text with `innerHTML`.
- Prefer `textContent`, `replaceChildren`, `createElement` and text nodes.
- HTML strings are only acceptable for fixed, trusted markup when there is a strong reason. The preferred pattern is still DOM construction.
- Treat question text, case labels, teaching details and imported data as text, not markup.

### CSS Shape

- Keep `style.css` as an ordered import manifest once the stylesheet grows.
- Split CSS by responsibility, preserving cascade order:
  - `styles/base.css`
  - `styles/menus.css`
  - `styles/controls-results.css`
  - `styles/advanced-controls.css`
  - `styles/eyes.css`
  - `styles/retinoscopy-observation-test.css`
  - `styles/modals.css`
  - `styles/responsive.css`
- Put token definitions and global defaults first.
- Keep responsive and reduced-motion rules last.
- Prefer tokens and existing component classes over one-off overrides.

### Error And Input Discipline

- Validate anything typed, pasted, uploaded, parsed or restored from storage.
- Keep local storage absent unless it has a clear job. If storage is added, version the stored shape.
- Use native buttons, labels, inputs, selects and details before inventing custom controls.
- Every modal should use the shared modal controller unless there is a clear reason not to.
- When a button or control can fail, surface that failure clearly rather than failing silently.

### Verification Checklist

- Run:

```powershell
node --check script.js
Get-ChildItem src\*.js | ForEach-Object { node --check $_.FullName }
```

- Search for unsafe HTML injection:

```powershell
Select-String -Path '.\*.js','.\src\*.js','.\index.html' -Pattern 'innerHTML|outerHTML|insertAdjacentHTML' -CaseSensitive:$false
```

- Open `index.html` directly for normal use; a local server is optional for cache-free testing.
- Check at `360 x 740`.
- Check fresh start, guide toggle, `Adv`, side menu, About, Cases, MCQ and `Test me`.
- Watch for console errors, horizontal overflow, clipped labels, stale cached modules and stale thumbnails.

### Modal Patterns

- About modal:
  - small popup, not a manual
  - `Basics` first: `Match`, `Bright`, `Straight`
  - `More detail` second: `Light + colour`, `Shape + crescent`, `Cornea + compare`
  - short usage notes only
  - version/date at the bottom
  - mention Primary, Intermediate and Advanced cases without turning the popup into a manual
- Cases modal:
  - use live-rendered WebP thumbnails
  - Primary cases first
  - Intermediate and Advanced folded
  - use green, orange and red level bars sparingly
  - similar cases folded
  - photos optional via camera icons
  - preserve the accepted radius hierarchy: soft modal shell, medium section bars, tighter cards and tighter still preview frames
- MCQ modal:
  - contained scroll for questions
  - submit/result area remains easy to reach
  - question cards use DOM/text rendering, not HTML string injection
  - question cards should read as cards, while option rows remain smaller nested targets with a subtle hover state

### Interaction Principles

- Both eyes remain visible.
- The light handle snaps back to centre.
- Movement and realism should be subtle by default.
- Use `Gaze` to make the patient less cooperative; keep baseline stable.
- Use `Dilated` when a larger pupil aperture is useful on the first screen.
- Baby mode changes the eye model/size, visibly narrows the canthus/IPD spacing and restricts the case picker to the tighter Baby-relevant subset.
- Avoid controls that appear to do nothing on the main screen.
- Advanced controls are allowed to be specialist, but should not overwhelm the first view.

## Usage

1. Serve the folder locally, then open the local server URL in a browser.
2. Use previous/next or open `Cases` to pick the closest reflex pattern.
3. In `Cases`, start with `Primary cases`; open `Intermediate cases`, `Advanced cases` or `Similar cases` only when needed.
4. Use camera icons in `Cases` for available reference photos.
5. Drag the mini light handle left/right/up/down to inspect both eyes.
6. Use `Colour`, `Gaze`, `Dilated` and `Baby` for first-screen adjustments.
7. Open `Adv` for context, pupil, lid, cataract, iris, squint and nystagmus controls.
8. Use `Learn` for the visual handout, downloads and practice links.
9. Use the burger menu for light-panel navigation to `Learn`, MCQs or `Test me`.

## Assets

- All app-used image assets are WebP.
- `assets/fonts/`: local Inter and Quicksand WOFF2 font files so the app does not depend on Google Fonts at runtime.
- `assets/`: 7 selected real reference photos for camera icons.
- `assets/case-thumbnails/`: 32 generated case snapshots for the `Cases` modal.
- `assets/handouts/`: copied high-resolution fundal reflex handout PDF, a full-sheet WebP and cropped WebP panels used in `Learn`.
- Old JPG/PNG app assets were removed after WebP replacements were verified.
- If live case artwork changes materially, regenerate the matching case thumbnails.

## Project Structure

- `index.html`: page structure, modals, stage UI, docked advanced toggle and results box
- `style.css`: ordered import manifest for split CSS files
- `styles/base.css`: tokens, resets, app bar and first-paint basics
- `styles/menus.css`: side menu and visual case picker list/cards
- `styles/controls-results.css`: top controls, context strip and results panel
- `styles/advanced-controls.css`: docked Advanced panel, switches, selects and sliders
- `styles/eyes.css`: stage, eye model, reflex surfaces and eye overlays
- `styles/retinoscopy-observation-test.css`: light controls, observation guide, teaching overlay, test banner and retinoscopy controls
- `styles/modals.css`: About, MCQ, Cases and photo modal styling
- `styles/learn.css`: handout Learn modal, About definition block and handout resource buttons
- `styles/responsive.css`: mobile, small-screen, coarse-pointer and reduced-motion rules
- `assets/fonts/`: local app font files
- `script.js`: module entrypoint
- `src/app.js`: bootstrap, controller composition, advanced dock and results wiring
- `src/condition-context-controls.js`: Advanced context switch rendering and state updates
- `src/observation-guide.js`: observation-guide collapse, replay and target-highlight behaviour
- `src/case-catalog.js`: grouped 32-case catalogue, level ordering, Baby subset and display labels
- `src/clinical-interpreter.js`: case-to-result logic for `Likely`, `Site` and `Referral`
- `src/menu-visual-cases.js`: progressive visual case picker, Primary/Intermediate/Advanced fold-up sections, collapsed similar-case suggestions, snapshot-backed cards and reference-photo modal
- `src/learn-content.js`: handout asset paths, cropped panel metadata, short explanations and linked practice cases
- `src/learn-modal.js`: Learn modal tabs, case-link handoff, download links, share icons and share fallbacks
- `src/mcq-bank.js`: case-based MCQ content
- `src/mcq.js`: question sampling, answer-option shuffling, grading and feedback marking
- `src/menu-mcq.js`: burger menu and MCQ modal flow
- `src/test-mode.js`: timed hidden-case testing and state restore
- `src/retinoscopy.js`: redraw scheduling, light movement and live stage updates
- `src/retinoscopy-beam-geometry.js`: light patch geometry helpers
- `src/retinoscopy-visuals.js`: case flags and visual builder exports
- `src/retinoscopy-active-reflex-*.js`: shared, refractive, media, special and custom reflex rendering helpers
- `src/central-media-masks.js`: central media/capsule opacity masks such as PCO
- `src/eyes.js`: eye controller composition
- `src/eyes-layout.js`: eye geometry, iris transform and corneal reflex micro-offsets
- `src/eyes-ambient.js`: blinking, micro-saccades, gaze shifts and background jitter
- `src/eyes-controls.js`: manual eye drag controls
- `src/streak-controls.js`: light-handle drag behaviour and snap-back logic
- `src/dom.js`: cached DOM references
- `src/state.js`: mutable app state

## Local Checks

```powershell
node --check script.js
Get-ChildItem src\*.js | ForEach-Object { node --check $_.FullName }
Select-String -Path '.\*.js','.\src\*.js','.\index.html' -Pattern 'innerHTML|outerHTML|insertAdjacentHTML' -CaseSensitive:$false
Get-ChildItem assets -Recurse -File | Group-Object Extension
```

For UI work:

- Serve the folder locally for reliable ES module testing, for example `http://127.0.0.1:8765/index.html`.
- A direct `index.html` open is the intended simple launch path; a local server remains useful for repeat browser testing.
- Refresh the open browser page after cache-busting query strings change.
- Check at `360 x 740`.
- Check the main page, `Adv`, side menu, About, Cases and MCQ.
- For MCQ changes, verify bank counts, answer indexes, option shuffling and a submit/pass path.
- Watch for horizontal overflow, clipped labels, stale thumbnails and heavy focus outlines.

## Current Refactor Notes

The April 30 app-quality pass removed unsafe HTML-string rendering, reduced `src/app.js` from `1138` lines to `464` lines and split the large stylesheet into responsibility-based files while preserving the existing cascade order.

No urgent broad refactor is needed, but the codebase should keep following this pattern.

Main hotspots:

- `src/retinoscopy.js`
- `src/retinoscopy-case-metadata.js`
- `src/menu-visual-cases.js`
- `src/observation-guide.js`
- `styles/retinoscopy-observation-test.css`

Potential future cleanup:

- automate cache-busting query strings
- add a lightweight browser smoke test for modals and the mobile first screen
- create a repeatable thumbnail regeneration script

## Current Case Ordering

Primary cases are deliberately basic:

1. Normal (orange-red) R & L
2. Normal (blue) R & L
3. Poor view: looking away
4. Poor view: upper lid blocking
5. R normal, L large esotropia
6. R large exotropia, L scar
7. R retinoblastoma, L normal
8. R normal, L dark

Intermediate cases are common or moderately nuanced, ordered from more common or introductory patterns toward harder patterns:

9. High hypermetropia R & L
10. Myopia R & L
11. R hypermetropia, L myopia
12. Poor tear film R & L
13. Small pupils R & L
14. R normal, L smaller pupil
15. Dull corneal reflex R & L
16. Dense cataract R & L
17. R normal, L corneal opacity
18. R hypermetropia, L posterior pole
19. R coloboma, L normal
20. Aniridia R & L
21. R transillumination, L normal
22. R normal, L subluxated lens

Advanced cases are the more specialist or adult-skewed patterns, ordered from more common or introductory patterns toward harder patterns:

23. R floaters, L normal
24. R large cortical, L slight cortical
25. Subcapsular cataract R & L
26. R IOL, L capsular thickening
27. R aphakia, L normal
28. Keratoconus R & L
29. R iridocyclitis, L normal
30. R angle closure, L normal
31. R vitreous haemorrhage, L normal
32. R retinal detachment, L normal
