# Progress

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Production bundle minified from its canonical source. Shipped JavaScript: 162,234 → 76,876 bytes. Mobile Lighthouse performance: 88 → 95/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Interpretation-card rounding refined; existing compact hierarchy and accent retained.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

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
- MCQ scoring with tier-specific pass thresholds. MCQs are untimed because the separate recognition mode owns timing pressure.
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

# v1.1 progress (23 July 2026)

Completed: baseline contract diagnosis, generated-bundle tooling correction, accessibility focus enhancement, deliberate reset, dependency-free local server, local runtime audit, manifest and scoped service worker, offline and direct-file checks, restrained UI polish, 360 x 740 visual review, governance records and dependency remediation. Preserved: adaptive teaching logic, full condition catalogue, exports, images, workflow, IDs and black/red identity. Pending: independent clinical sign-off and physical-device testing.

Follow-up UI consistency pass: compared directly with Discs, Diabetic and Fundal Reflex, widened the compact black stage to the shared content edges, matched the quieter Fundal Reflex page and shadow treatment and removed empty timed-result spacing outside timed practice. The full automated and browser-smoke suites pass.

## Information popup consistency — 23 July 2026

- Added an effective `44 x 44px` Quick Guide close target.
- Standardised version presentation.
- Preserved simulator behaviour, cases and grading content.

## Information-card typography and fit — 23 July 2026

- Applied the shared popup type hierarchy.
- Verified a `442px` card at `360 x 740` with no internal scrolling.
- Standardised the simple visible `v1` label and `23/7/2026` date in the shared bottom-right footer position.

## Main-page typography review — 23 July 2026

- Raised the four disc-observation helper prompts to `10px`.
- Preserved viewer geometry, comparison logic and teaching state.
- The full five-part test suite and `360 x 740` browser check passed.

- Standardised the sidebar hierarchy and corrected focus entry and Escape focus return in the source module and rebuilt bundle.
- Standardised level labels across MCQ and timed-test controls without changing questions, timing or scoring.

## Maintenance refactor — 26 July 2026

- Added pinned esbuild, a local build command and exact bundle parity.
- Removed duplicate inline information-dialog handlers and confirmed orphan CSS.
- Corrected the unanswered-MCQ result reference found by lint.
- Rebuilt the bundle and passed smoke, MCQ, viewer, question, integration and parity tests.

## MCQ clinical-quality pass — 26 July 2026

- Rewrote all 30 questions around the Modified Frisén definitions, stable tier ownership and one-best-answer structure.
- Added a rationale and source-review status to every item.
- Corrected Grade 1/2 framing, the Grade 3 vessel criterion and the previous haemorrhage threshold error.
- Added visible answer explanations, a real fresh retry and result focus without changing viewer or timed-recognition logic.
- Passed complete automated, bundle, lint, format and `360 x 740` browser verification.
