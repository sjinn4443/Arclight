# Sauron

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Production bundle minified from its canonical source. Shipped JavaScript: 211,173 → 121,120 bytes. Mobile Lighthouse performance: 85 → 94/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Refraction trigger enlarged; established teaching arrangement retained.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Fleet repair receipt — 30 September 2026

Removed direct-file font preload CORS errors while retaining and verifying both local font families. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## Logic corrections — 29 September 2026

High-minus summary now agrees with slow against movement. Cylinder cases explicitly describe a stylised opposite-meridian example; the intermediate angle is a transition, not a claim of clinical neutrality. Purpose copy describes case exploration rather than nonexistent trial-lens adjustment. Test rounds reset adjustable modifiers to baseline, retain Baby case filtering and restore the prior modifiers, pupils and dilation history on exit. Shared active-eye illumination now drives a consensual pupil response; dilated, aniridic and affected ACG apertures remain non-reactive in this teaching model. The deliberately exaggerated ACG oval is unchanged.

Bundle rebuilt from source with locked esbuild 0.25.5. Contracts, new pupil/copy regression checks, bundle parity and 28-file syntax checks pass. Assets/cache use 20260929-logic2. Full rendered interaction review, direct-file acceptance, physical-device checks and independent clinical sign-off remain pending.

Eye-engine follow-up, 23 July 2026: radial pupil response is now protected by a pure contract and paired advanced controls announce RE and LE explicitly. The production bundle, tests and 28-file syntax check pass. Simulator maths, response timing, case content and eye geometry are unchanged.

Fleet edge follow-up, 23 July 2026: the control deck and stage now use exact `10px` outer margins and `340px` width at `360 x 740`. Simulator maths and internal geometry are unchanged.

Case curriculum and safety follow-up, 25 July 2026: the visual catalogue now uses `5` Primary, `10` Intermediate and `13` Advanced cases. Four abnormal-eye cases carry a shared red safety-note triangle. Reflex rendering, MCQs and timed-test selection are unchanged.

Logic-integrity follow-up, 25 July 2026: timed tests retain the learner's pre-round streak angle so an axis-dependent case cannot initialise on its hidden answer. Baby mode now limits timed rounds to Baby-compatible test cases. The safety dialog temporarily suspends the underlying case dialog. The exaggerated ACG oval remains unchanged and is explicitly described as a stylised teaching cue.

<!-- APP-DOC-STATUS:START -->

## Current Status (25/7/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: black `#111111` on an orange-red appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Interactive retinoscopy training simulator focused on direct streak handling, monocular eye targeting, case recognition and quick self-testing.

_Documentation last updated: 25/7/2026_

## v1.1 Fleet Upgrade

Sauron now includes a deliberate two-step simulator reset, explicit active-eye accessibility state, a local manifest and scoped offline worker, executable contract checks and a reproducible `360 x 740` browser review. The simulator maths, case content, MCQs, timed testing, assets, IDs and orange-red identity remain unchanged. The 25 July follow-up changes four teaching-tier assignments, their display order and separate safety-note presentation. See `SAURON_V1.1_EVIDENCE_RECEIPT.md` for exact evidence. Independent clinical sign-off and physical-device testing remain pending.

## Current Direction

Sauron keeps the orange-red app bar, black title text and compact clinical simulator feel. The main UI now follows the Fundal Reflex app more closely where that app is strongest:

- local `Inter` body font with `Quicksand` for the app title
- clear hierarchy between the app bar, control deck, advanced panel, eye selector, case pill and eye stage
- compact switch controls for `Gaze`, `Dilated` and `Baby`
- Fundal-style visual case picker with large stacked cards, tier headers and WebP thumbnails
- modal, MCQ and test layouts that stay readable on mobile

## Features

- Dual-eye retinoscopy simulator with examiner-view targeting:
  - `RE` maps to the screen-left eye
  - `LE` maps to the screen-right eye
- Direct streak interaction:
  - drag the lower handle to sweep
  - drag the upper handle to rotate
  - immediate reflex redraw
- Fundal Reflex-style corneal reflex:
  - `5px` primary corneal dot
  - `6px` secondary reflection layer
  - fellow-eye dot keeps the same `5px` live Fundal size rather than being reduced
  - dot position responds to eye movement and light position
- Fundal Reflex-style gaze behaviour:
  - gaze shifts use timeout-based looks rather than a fixed interval
  - subtle face translation and head tilt are applied to the eye container
  - temporary upper-lid droop and random blinks run during live gaze
  - lid timing is baseline-driven so blink and gaze droop restore to stable lid positions
  - the retinoscopy beam remains examiner-owned and does not recenter when gaze moves the eyes
  - beam and corneal-reflex calculations use the rendered streak centre during gaze
- Top control deck:
  - `Colour` slider with blue and red anchors
  - `Gaze`, `Dilated` and `Baby` switch buttons
  - compact `Adv` panel
  - Fundal Reflex-style split layout with the colour card, modifier row and vertical `Adv` dock separated
  - Fundal Reflex control CSS copied for the card radius, border, shadow, switch sizing, checked-switch red and mobile dock proportions
- Advanced panel:
  - `squint` switch for manual eye dragging
  - paired pupil sliders
  - paired lid sliders
  - cataract slider
  - nystagmus slider
  - collapsed panel hides its internal controls from layout
  - mobile switch sizing keeps `Gaze`, `Dilated` and `Baby` readable at `360px`
- Stage-mounted case pill:
  - previous and next case buttons
  - current case label
  - tier marker colour
  - answer masking during timed testing
- Fundal-style case picker:
  - Primary cases: 5
  - Intermediate cases: 10
  - Advanced cases: 13
  - case order starts with `1. Neutral (0)`
  - large full-width snapshot cards
  - centred `409 x 147` WebP thumbnails
  - no visible streak-handle cue artefacts in thumbnails
  - regenerated after corneal-reflex changes
- Shared case safety cues:
  - red triangular `!` markers identify a separate safety note for ACG, leucocoria, vitreous haemorrhage and partial retinal detachment
  - activating a card marker opens a compact accessible note without selecting the case
  - selected safety cases replace the tier dot with one small triangle while their accessible name retains the tier
- Structural pupil and iris cases including:
  - `ACG`
  - `Aniridia`
  - `Small pupils`
  - `Nasal coloboma`
  - `Iris transillumination`
- Media and fundus cases including:
  - cortical cataract variants
  - posterior subcapsular cataract
  - posterior pole cataract
  - posterior capsular thickening after `IOL`
  - dense cataract
  - floaters
  - vitreous haemorrhage
  - leucocoria
  - partial retinal detachment
- Border-aware reflex fade once the sweep crosses beyond the pupil edge
- Tiered MCQs:
  - Primary
  - Intermediate
  - Advanced
  - result area stays hidden until feedback is needed
- `test me` mode:
  - picks a random condition from the case pool
  - limits the pool to Baby-compatible test cases while Baby mode is active
  - retains the learner's pre-round streak angle rather than aligning it with a hidden case axis
  - hides the case answer during the countdown
  - uses a staged timer sequence of `20`, `15`, `10`, `8` then `6` seconds
  - reveals axis detail for astigmatic and axis-dependent cases
  - closes the side menu back to an inert hidden state before the timed round starts

## Usage

Open `index.html` directly for normal use. A local HTTP server is still useful for cache-free browser testing, but the app is packaged to run from the file itself.

For Netlify, drag this existing `Sauron` folder into the upload area. Keep `index.html`, the bundled scripts, styles and `assets` together at this level. The included `netlify.toml` explicitly publishes this folder (`.`) and uses `npm run build` when Netlify runs a build. The app does not need a separate `dist` folder or ZIP.

Optional local-server test command:

```powershell
npx http-server . -p 8766 -c-1 -o /index.html
```

Or:

```powershell
python -m http.server 8766
```

Then open if the browser did not launch automatically:

```text
http://127.0.0.1:8766/index.html
```

Typical flow:

1. Use `RE` or `LE` above the eye stage to choose the active retinoscopy eye.
2. Drag the streak handles to sweep and rotate.
3. Use `Colour` to move between blue and red reflex appearance.
4. Use `Gaze`, `Dilated` or `Baby` to change the eye model.
5. Open `Adv` for squint, pupil, lid, cataract and nystagmus controls.
6. Use the case pill arrows or open the case picker to compare conditions.
7. Open the burger menu for MCQs or `test me`.

## Project Structure

- `index.html`: page structure, controls and modal shells
- `style.css`: theme, layout, case picker, advanced panel and responsive styling
- `script.js`: module entrypoint
- `src/app.js`: bootstrap and controller wiring
- `src/state.js`: central mutable application state
- `src/dom.js`: cached DOM references
- `src/constants.js`: refraction groups, MCQ bank and test timing
- `src/case-catalog.js`: tiered visual case metadata, baby-case filtering and thumbnail paths
- `src/menu-visual-cases.js`: Fundal-style case picker modal
- `src/retinoscopy.js`: streak placement, redraw scheduling and DOM visual application
- `src/retinoscopy-visuals.js`: barrel export for retinoscopy visual helpers
- `src/retinoscopy-case-metadata.js`: case flags, movement helpers, axis helpers and shared constants
- `src/retinoscopy-active-reflex.js`: moving reflex render strategies
- `src/central-media-masks.js`: central media-opacity mask strategies
- `src/retinoscopy-pathology-overlays.js`: fixed pathology overlays
- `src/structural-eye-effects.js`: structural pupil and iris effects
- `src/eyes.js`: pupil, lid, gaze, baby, dilation and eye-motion behaviour
- `src/streak-controls.js`: direct streak drag controls and hint timing
- `src/menu-mcq.js`: burger menu and MCQ flow
- `src/mcq.js`: MCQ rendering helpers
- `src/test-mode.js`: timed condition-recognition mode
- `src/modal.js`: shared modal accessibility and focus management
- `src/info-modal.js`: instructions modal wiring
- `src/color.js`: colour parsing helpers
- `src/motion.js`: reduced-motion helper

## Assets

- Runtime UI images must be WebP.
- Case thumbnails live in `assets/case-thumbnails/*.webp`.
- Streak cue images live at:
  - `assets/images/ret-rotate-cue.webp`
  - `assets/images/ret-sweep-cue.webp`
- Local fonts live in `assets/fonts`.
- The current asset sweep leaves no legacy raster cue or verification images under the Sauron folder; the current SVG favicon is retained.

## Local Checks

```powershell
npm run build
npm run lint
npm test
```

Browser checks should include:

- main simulator at `425px` and `360px` mobile widths
- advanced panel open and closed
- `Gaze`, `Dilated` and `Baby` switches
- gaze mode with a fixed beam centre while pupil, lid and face motion continue
- baseline lid timing after blink, `Gaze` and `Baby` toggles
- case picker modal with Primary, Intermediate and Advanced sections
- MCQ modal with the empty result row hidden before submit
- side menu open and hidden/inert states
- `test me` masking and reveal

## Current Refactor Note

The broad retinoscopy split has already started. The next work should stay targeted:

- keep case metadata centralised so the case picker, MCQs and test mode stay aligned
- keep thumbnail generation rules strict and centred
- keep fixed pathology overlays separate from moving reflex logic
- avoid broad rewrites unless a new condition makes the current module ownership unclear

## Information popup consistency — 23 July 2026

The modal Quick Guide now has an effective `44 x 44px` close target and uses the shared `version · date` presentation. Retinoscopy optics, cases and stage controls are unchanged.

## Information-card typography and fit — 23 July 2026

The guide now uses the fleet role map of Quicksand `14px/700` title, Inter `12.5px/400` body, Inter `11px/800` section labels and Inter `10.5px/700` version text. It measured `355.2px` at `360 x 740` and required no internal scrolling. Advanced instructions, controls and colour anchors are upright while clinical movement descriptions retain meaningful italics. Its simple visible `v1` label and current `23/7/2026` date now occupy the shared bottom-right footer position.

## Sidebar consistency — 23 July 2026

The orange-red identity and existing menu actions are unchanged. The drawer now uses the fleet `14px` title, `11px` section-label and `12.5px` supporting-copy roles where present. Opening moves focus inside and Escape closes the drawer and returns focus to its trigger at `360 x 740`.

## MCQ consistency — 23 July 2026

Level labels match the fleet and Cup unlocking requires explicit Advanced pass evidence. Existing random question and option selection and retinoscopy content are unchanged. The Advanced teaching pass mark is now 6/8 rather than 4/8 so the hardest tier requires the same clear majority as the other advanced fleet tiers. This does not alter simulator or clinical decision logic.

## Maintenance refactor — 26 July 2026

The service-worker contract now requires the complete canonical case-thumbnail set rather than a sample. Confirmed unused and superseded selectors were removed and exact bundle parity prevents drift between authored modules and `app.bundle.js`. The bundle was rebuilt. Retinoscopy optics, the established oval eye geometry, simulator cases and clinical teaching content are unchanged. Independent clinical sign-off and physical-device acceptance remain open.

## MCQ quality and review workflow — 26 July 2026

All 26 authored questions now have stable `sauron-{tier}-{NN}` IDs, a concise answer rationale, a named source and an explicit review status. The small-pupil item now makes optimisation and authorisation explicit rather than presenting dilation as an unconditional first step. Three pathology-image items explicitly refer to this simulator. Attempt sizes, pass marks, simulator optics and Cup unlocking are unchanged. Unanswered attempts focus the first missing answer. Completed attempts show a result, correct-answer explanations and source status, then offer `Try again` or `New attempt`.

## Information purpose pass — 27 July 2026

The existing `i` panel now tells the user to sweep and rotate the streak across the pupil, then adjust lenses until the reflex is neutral or use a practice case. It states that the simulator does not measure a patient's refraction. No optics, case, pupil-shape or teaching logic changed. The open panel passed the shared non-scrolling `360 x 740` review.

## Fleet UI alignment — 28 September 2026

The information card now uses the shared `16px` radius and a measured `44 x 44px` close target. Clean Chromium checks at `360 x 740` found no horizontal overflow, no information-card scrolling, correct Escape focus return and no console errors. Optics, case and pupil-shape logic are unchanged. Physical-device acceptance remains pending.
