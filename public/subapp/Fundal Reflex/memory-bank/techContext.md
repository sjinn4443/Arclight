# Technical Context

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

## Technologies Used

- HTML5
- CSS3
- vanilla JavaScript
- generated local WebP snapshot assets for the `Cases` modal
- manually added local WebP reference photos for selected cases
- local handout assets: PDF source copy, full-sheet WebP and cropped WebP explain panels

## Development Setup

- no backend required
- open `index.html` directly for the simple packaged launch path
- use a local static server when cache-free repeat testing is useful
- runtime entrypoint: `app.bundle.js`
- source entrypoint: `script.js`

## Current Runtime Constraints

- must stay usable on small mobile screens, especially `360 x 740`
- app-bar height, approved colours, Quicksand title and Inter UI font should remain stable during design-system quality passes
- new CSS values should prefer the token layer for spacing, tap targets, radii, motion, focus rings, shadows and key surfaces
- beam drag must stay smooth
- both eyes must remain aligned with beam midpoint and pupil stop limits
- visual case modal must remain scrollable and legible on mobile
- visual case modal should default to a calm progressive-disclosure layout:
  - Primary cases open by default
  - Intermediate cases collapsed
  - Advanced cases collapsed
  - collapsed `Similar cases`
  - no always-visible level filter chips
- main case trigger includes a compact tier marker; keep its padding and width broad enough that the marker does not crowd the case label
- accepted radius hierarchy:
  - modal shells: `--radius-panel`
  - case level bars, similar tools, side-menu MCQ buttons, MCQ submit and question cards: `--radius-md`
  - visual case cards: `--radius-sm`
  - visual case previews: `5px`
  - MCQ option rows: `6px`
- startup on phone-sized views should avoid transient black or pale stage flashes:
  - `index.html` carries critical inline CSS for the page and dark pre-ready stage fallback
  - `style.css` repeats the dark `body:not(.app-ready) .eyes-wrapper` fallback for normal stylesheet state
  - `src/app.js` adds `app-ready` after the initial render and control reveal
  - `.eyes-wrapper` should not fade in through white/light grey
- case thumbnails must remain readable at mobile width and should keep the eye pair centred in the card
- beam bias now also affects corneal circle scale:
  - active eye can enlarge by about 1px
  - fellow eye becomes fractionally smaller
- actual light movement now also nudges corneal reflex position very slightly:
  - factor `0.02`
  - cap `0.8px` X
  - cap `0.6px` Y
  - movement is in the same direction as the light handle
- `Gaze` brightness uses live iris offset in `src/retinoscopy.js`; squint boost fades if the gaze transform brings the deviated eye straight and horizontal off-axis gaze adds visible brightness, pupil-fill and slight opacity lift in either eye.
- reflex brightness should ramp gently as the beam crosses the pupil, not jump.
- off-centre hand jitter should stay slow enough to feel hand-held rather than vibrating.
- inter-eye gaze stagger and endpoint bounce should stay subtle; they are realism cues, not visible lag.
- `src/eyes-ambient.js` treats eyelid animation as baseline-driven state: upper lids restore to resting height or active Gaze droop, lower lids restore to `0px` and overlapping blink timers are cleared before a new blink.
- case filtering for Baby mode uses `BABY_REFRACTION_VALUE_SET` in `src/case-catalog.js`
- Baby geometry uses `--baby-eye-scale: 0.84` and `--baby-eye-gap: 0px`; because transform scaling does not affect flex layout width, the zero gap is what makes the visible inner canthus distance reduce properly
- mixed-size reference photos must preserve aspect ratio and use contained display rather than forced crop
- app-used images should remain WebP-only unless a new compatibility requirement appears
- handout PDF is allowed as a downloadable/shareable resource; in-app handout and panel images should use WebP
- Learn handout view should fit the full one-page sheet on mobile first, with cropped panels used for close reading
- iOS modal sizing should keep `vh` fallbacks plus `dvh` overrides where supported
- modals should include safe-area-aware bottom padding for iPhone/iPad browser chrome
- test mode must mask both the case and the results
- test mode must disable all visible case-shaping controls while a round is active
- collapsed observation-guide state must keep only a narrow visible and interactive hit area
- observation-guide replay uses `#observation-teaching-overlay` inside `.eyes-wrapper`; it should stay `aria-hidden`, `pointer-events: none` and temporary
- observation-guide mode is case-level driven: Primary uses `Match`, `Bright`, `Straight`; Intermediate and Advanced use the full grouped guide
- full guide order is `Light`, `Colour`, `Shape`, `Crescent`, `Cornea`, `Compare`
- observation-guide connector geometry should use the cue's intended rectangle rather than `getBoundingClientRect()` from an animating highlight element
- Crescent replay geometry is derived from the pupil rectangle in `src/observation-guide.js`; top crescents start at the pupil's upper edge and bottom/myopic crescents end at the lower edge
- slow/long blink timing is gated to `Baby` + `Gaze`; Baby mode alone should not become harder to view
- aniridia nystagmus is allowed to reduce reflex visibility, but light movement over the eye must not create flashing artefacts
- representational realism currently includes tear-film shimmer, floater drift relative to eye movement, front-layer media opacity and pupil-edge crescent clipping
- reduced-motion preferences should still be respected where possible
- modal flows should use `createModalController` unless there is a specific reason not to
- avoid multiple simultaneous active `aria-modal="true"` roots when nesting visual states such as case photos
- keep About/help copy short enough to fit as a popup rather than a full manual
- keep the `Quick guide` date and case-level wording current; the current popup reads `v1 - 18/5/2026`, starts with a natural fundal reflex definition, explains `fundal` rather than `red`, mentions darker pigmentation and orange-yellow or blue-white normal reflexes, adds the Alan25 dim-light/calm-patient/arm's-length sequence, then gives `Basics`, compact `More detail`, short usage notes and a Learn handout path
- keep the Learn `Normal can vary` card aligned to the `Quick guide` wording; do not reintroduce the old split wording that says orange-yellow in darkly pigmented eyes or blue-white in lighter eyes
- Alan25 fundal-reflex copy standard: dim light, calm patient, arm's-length comparison, equal brightness/colour/shape, move side to side then closer; blue or blue-white may be normal but still needs double-checking for clarity and vision
- the `Quick guide` popup is allowed to be wider on mobile, but should not exceed the `360 x 740` review-height budget; keep the version/date inline to avoid first-view scrolling
- the side menu should remain visually tied to the main app: light/off-white panel, blue-grey borders and small coloured level dots rather than strong block colours
- `src/learn-modal.js` uses the shared modal controller and DOM construction; keep handout panel text in `src/learn-content.js`
- keep the app-bar info icon as a plain red lowercase `i` without the previous circular outline
- for compact control rows, prefer label-column + flexible-control-column CSS to avoid stacked labels and dead right-side gaps
- modal close focus should remain soft and rounded, not a large square outline
- compact icons may stay visually small, but their hit areas should be enlarged where layout permits
- `style.css` is now an import manifest. Keep split CSS files ordered by responsibility and keep responsive/reduced-motion rules last.
- `src/app.js` should remain orchestration-focused. Move self-contained UI behaviour into controller modules.
- Avoid `innerHTML`, `outerHTML` and `insertAdjacentHTML` in app rendering unless the markup is fixed, trusted and there is no cleaner DOM alternative.

## Tooling and Verification

- syntax checks:
  - `node --check script.js`
  - `Get-ChildItem src\\*.js | ForEach-Object { node --check $_.FullName }`
- MCQ checks should cover bank counts, valid answer indexes, four options per question, shuffle answer preservation and one rendered submit/pass path
- unsafe HTML-injection search:
  - `Select-String -Path '.\\*.js','.\\src\\*.js','.\\index.html' -Pattern 'innerHTML|outerHTML|insertAdjacentHTML' -CaseSensitive:$false`
- after CSS/UI changes, test through a local server such as `http://127.0.0.1:8765/index.html`
- refresh the currently open browser page because query-string cache busts are manual
- visual verification matters more than syntax for case rendering
- cache-busting query strings are still used to avoid stale browser assets during repeated local edits
- static local serving can preserve stale cached modules unless the query strings are bumped or the page URL is cache-busted
- when case visuals change materially, `assets/case-thumbnails` may need regenerating so the modal stays aligned with the live stage
- regenerated thumbnails should be exported as WebP
- the current case picker uses native `<details>` level sections rather than hidden category filter groups

## Current Live Modifier Model

The app now has only three live interpretation modifiers:

- `Baby`
- `Gradual / Sudden`
- `Glare / Glare on`

Older richer modifier plumbing has been removed from the active path.

`Gaze` is a visible realism modifier, not an interpretation modifier. `Dilated` is a visible pupil-aperture modifier, not an interpretation modifier.

## Current Case Level Model

The visible case order is defined by `CASE_LEVELS` in `src/case-catalog.js`, not by the older anatomical group order.

- Primary: 8 cases, the basic recognition set plus two poor-view technique cases
- Intermediate: 14 cases, common or moderately nuanced patterns, including cases `9` and `10` for hypermetropia and myopia, ordered from common introductory patterns toward harder patterns
- Advanced: 10 cases, more specialist or adult-skewed patterns, ordered from more likely introductory specialist patterns toward harder patterns

When updating labels, keep the leading display number aligned with the case label. Avoid placing a case in more than one level. Case `2. Normal (blue) R & L` is a normal blue-white variant and should remain in the no-referral path. Cases `3` and `4` are technique cases and should stay in the `? Action: Repeat view / ask for help` path. Case `8. R normal, L dark` is not normal pigmentation variation; keep it in the reduced/dark reflex referral pathway. When updating Baby mode, keep the subset narrow, include the child/baby poor-view cases and ensure excluded active cases fall back cleanly.
