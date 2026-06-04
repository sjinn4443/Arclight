# Progress

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

## What Works

- Fundal Reflex-inspired UI shell:
  - black app bar with bright green title and icons
  - light clinical side menu with tier dots
  - compact control cards
  - matched dark circular thumbs on FOV and Cataract sliders
  - compact grey/red switch styling for RE/LE
  - quick-guide popup
  - contained MCQ modal scrolling
  - styled timed-answer panel
- `index.html` now matches the current JavaScript controller IDs for FOV, cataract, phone preview, tier menus, cup achievement and modals.
- Canvas-based retina viewer with drag, jitter, and periodic gaze-shift simulation.
- Adaptive image assets:
  - Phones/coarse-pointer devices default to optimised `2048w` images.
  - Larger screens keep full-resolution assets.
  - Runtime override available via `?images=mobile` / `?images=full`.
- Condition switching (`Normal`, `Suspicious`, `Swollen`) and FOV/eye toggles.
- Cataract simulation (`None`, `Slight`, `Med`, `Dense`) with blur/tint/occlusion effects.
- Mobile cataract path now uses a cached top-layer overlay (tint + patches) to avoid per-frame patch recomputation.
- Mobile render path includes additional load controls:
  - Draw coalescing + cataract-mode redraw throttling.
  - Background-tab animation pause/resume via `visibilitychange`.
  - Mobile canvas smoothing quality set to `medium`.
- Desktop-only `Phone-size preview` toggle (persisted in `localStorage`) for laptop realism checks.
  - Final behaviour constrains viewer area only (not full UI text/controls).
- Laptop layout is kept as a centred single-column app rather than a split controls/viewer layout.
- MCQ modal flow with 3 tiered sets (`Primary`, `Intermediate`, `Advanced`), randomised question sampling inside tier pools and randomised option order.
- MCQ scoring with tier-specific pass thresholds and timers (`Intermediate`, `Advanced` timed).
- MCQ bank wording pass completed:
  - `Primary` language simplified.
  - Repetition reduced across stems.
  - `Advanced` includes stronger scenario/interpretation emphasis.
- Timed test flow with 3 tiered sets and 4 rounds each.
- Timed rounds alternate `RE/LE` for additional challenge.
- Timed scored rounds are now safety-clamped to avoid impossible combos:
  - FOV limited to `8deg`/`15deg` (no `4deg` in timed scoring).
  - Cataract limited to `None`/`Slight` in timed scoring.
  - `Advanced` timed augmentation/motion remains harder but slightly less punishing.
- Timed rounds include randomised vertical flips, with at least one flip guaranteed per timed set.
- Timed answer submission is non-blocking (no popup pause exploit):
  - Submit is disabled until an option is selected.
  - Missing-selection feedback is inline.
- Instruction modal wording was shortened and made more UK-style, with clear unsafe-view escalation wording.
- Side-menu lock/completion progression for MCQ and timed sets.
- Cup achievement panel:
  - Greyed while locked.
  - Unlocks after both advanced tiers are completed.
  - Unique code generation and certificate download enabled on unlock.
- Modal/menu accessibility hardening (focus trap/restore, inert hidden menu).
- JavaScript syntax checks pass across `*.js` and `*.mjs`.
- Browser smoke checks pass for the first screen, side menu, quick guide, MCQ modal and timed mode.
- Latest visual checks included `397 x 1237` for the first-screen controls after matching the Fundal Reflex slider thumbs.

## What's Left to Build

- Browser interaction tests for full user journeys (including tier unlock and cup achievement flow).
- Optional explicit trainer reset for local progression/cup state.
- Optional richer certificate format (HTML/PDF style).

## Current Status

Core functionality remains stable and documented. Current phase is final UX calibration and keeping the Swollen Discs shell aligned with the reusable Fundal Reflex app style.

## Known Issues

- No backend persistence for scores or learner history.
- No full end-to-end browser automation coverage yet.
- Cup achievement persistence is local-browser only (`localStorage`) by design.
- Existing trusted result/explanation paths still use limited `innerHTML`.

## Evolution of Decisions

- Kept the app client-side and framework-free for portability.
- Shifted MCQ logic from mixed UI code into `mcq-engine.mjs` for better testability.
- Added strict tier question pools to enforce real difficulty progression.
- Added timed safety clamps so scored rounds remain challenging without being unrealistically hard.
- Prioritised deterministic local checks and browser smoke testing.
- Adopted the Fundal Reflex style rules as the preferred UI baseline for future polish.
- Reverted Cataract back to a slider after user review; the final accepted change was matching its circular thumb to the FOV/Fundal Reflex thumb, not turning the choices into buttons.
