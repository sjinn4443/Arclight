# Active Context

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

## Current Focus

Apply the reusable Fundal Reflex visual language to Swollen Discs while keeping the existing client-side viewer, MCQ tiers and timed-test behaviour stable.

## Recent Changes

- Applied the Fundal Reflex look to the app shell:
  - black app bar with red title and compact red icon controls
  - light clinical side menu with small coloured level dots
  - compact mobile-first control cards
  - softer modal shell, medium action areas, tighter question cards and tighter option rows
- Rebuilt `index.html` to match the current controller contract:
  - range-based FOV control with `4°`, `8°` and `15°`
  - cataract slider and labelled stops
  - phone-size preview toggle mounting point
  - tiered MCQ and timed menu buttons
  - cup achievement card and certificate button
  - accessible quick-guide and MCQ modal close buttons
- Finalised first-screen control styling after direct Fundal Reflex comparison:
  - FOV and Cataract both use the same dark circular range thumb.
  - Cataract stays as a slider with labelled stops, not segmented buttons.
  - RE/LE switch uses the compact grey track and red checked state from Fundal Reflex.
- Restored the Fundal Reflex font pattern:
  - local Quicksand for the main title
  - local Inter for the rest of the UI
  - no Google Fonts or icon CDN dependency
- Replaced the old long instruction popup with a compact quick guide that uses short clinical cues.
- Added an inline favicon so local browser smoke checks no longer report a missing favicon.
- Updated `README.md` with the current feature set, Fundal-style UI rules and local verification checklist.
- Standardised progression labels to `Primary`, `Intermediate`, `Advanced` across MCQ and timed flows.
- Kept strict tier-specific MCQ pools and startup validation for pool integrity.
- Rechecked MCQ tier ramp:
  - `Primary` wording simplified for basic-entry readability.
  - Advanced items shifted further toward interpretation and discrimination.
  - Repetitive question-stem phrasing reduced across the bank.
- Revalidated timed tiers for fair progression:
  - Timed rounds are clamped to `8deg` or `15deg` FOV only.
  - Timed rounds cap cataract at `Slight` (no `Med`/`Dense` in scored mode).
  - `Advanced` timed augmentation/motion softened slightly to reduce unfair misses.
- Added timed-round vertical flip augmentation to reduce pure image memorisation.
- Guaranteed at least one vertical flip per timed set.
- Kept alternating `RE/LE` per timed round.
- Added adaptive image asset loading:
  - Mobile/coarse-pointer devices use optimised `2048w` assets.
  - Larger screens keep full-resolution assets.
  - URL override supported via `?images=mobile` and `?images=full`.
- Extracted image-set selection helpers into `image-assets.js` to reduce `script.js` bootstrap complexity.
- Added integration coverage for:
  - Image-set selection behaviour.
  - Guaranteed timed-set vertical flip behaviour.
- Replaced blocking timed-submit popup with non-blocking inline validation and disabled submit-until-selected behaviour.
- Restored smaller `Temporal/Nasal` label sizing based on displayed canvas dimensions.
- Added README notes documenting these calibration and performance updates.
- Added desktop-only `Phone-size preview` toggle for laptop realism checks.
  - Preference persists locally.
  - Final behaviour scales only the viewer area, not the full UI text/control layout.
- Laptop layout now remains a centred single-column app, matching the mobile-first review shape.
- Overhauled mobile cataract rendering path:
  - Precomputed cataract top-layer cache (tint + occlusion patches) keyed by cataract level and canvas size.
  - Reused cached overlay during draw instead of per-frame patch recomputation.
- Added mobile draw-load protections:
  - Coalesced draw scheduling.
  - Cataract-mode redraw throttling.
  - Visibility-based animation pause/resume (`visibilitychange`).
  - Lower smoothing quality setting on mobile (`medium`).
- Re-tuned cached cataract patch visuals to restore larger, diffuse appearance.
- Refined `Temporal/Nasal` edge label padding.
- Shortened instruction-modal wording to concise UK-style safety guidance.

## Next Steps

- Validate final cataract visual/performance balance on 2-3 representative low/mid/high-end phones.
- Add optional explicit progress reset control for trainers.
- Consider HTML/PDF styled certificate output instead of plain text export.
- Add browser-level interaction tests for full progression and achievement flows.

## Active Decisions

- Keep the app fully client-side for simplicity and offline use.
- Keep canvas-based fundus simulation as the primary interaction model.
- Keep MCQ domain logic isolated from DOM code for easier testing and tier tuning.
- Keep future UI work aligned to the Fundal Reflex style: compact clinical controls, black/red identity, restrained surfaces and progressive disclosure.
- Keep range controls visually consistent: shared track styling and dark circular thumbs unless there is a deliberate teaching reason to differ.

## Patterns and Preferences

- Event-driven UI in `script.js`.
- Pure logic functions in standalone modules for deterministic tests.
- Mobile-first layout with responsive adjustments for tablet/laptop.
- Progression and achievement UI should be visible but state-driven.
- Prefer clear native controls and documented IDs over ad hoc inline markup in `index.html`.

## Insights and Learnings

- Tiered pools provide a clearer difficulty ramp than random full-bank sampling.
- Visible-but-locked achievement UI communicates goals better than hidden rewards.
- Persisting achievement state locally avoids backend complexity while preserving learner milestones.
- Blocking dialogs in timed flows can accidentally create timing exploits and should be avoided.
