# Active Context

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

## Fleet repair receipt — 30 September 2026

Deferred modal focus until drawer closure completes and added an integration regression for that order. Rebuilt the UI bundle. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

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
  - `Primary` covers recognition and safe interpretation.
  - `Intermediate` covers defining features and common pitfalls.
  - `Advanced` covers exact grade distinctions and scale limitations.
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

# Active context: v1.1 complete locally (23 July 2026)

The stale smoke failure was diagnosed as an obsolete expectation that `script.js` should load as a module. The product intentionally uses `app.bundle.js` as one classic bundle. The smoke contract now protects that architecture and rejects double-loading. Logic, integration, QA, lint and isolated Chrome checks pass. Independent clinical review and named physical-device checks remain pending.

Follow-up fleet comparison against Discs, Diabetic and Fundal Reflex aligned the compact viewer with the full-width controls and interpretation card. Empty timed-test status space is hidden outside timed practice so the complete initial `360 x 740` teaching state still fits. Viewer maths, condition state, output wording and teaching logic remain unchanged.

## MCQ clinical-quality status — 26 July 2026

All 30 stable MCQ IDs now have one tier, one best answer, an explanatory rationale and explicit source-review status. The bank follows the Modified Frisén definitions: Grades 1 and 2 are papilloedema, Grade 3 is defined by vessel obscuration as a vessel leaves the disc and haemorrhage does not determine grade. MCQs are untimed because image-recognition timing remains a separate mode. Pass marks are 3/4, 4/5 and 6/7. The separate timed-image logic, simulator and cup requirement remain unchanged. Independent clinical sign-off remains pending.

## Maintenance refactor — 26 July 2026

The classic bundle has a pinned local build and exact parity contract. `modal-manager.js` and the bundled controller are the sole information-dialog lifecycle owners. The unanswered-MCQ guard now writes through `testResultDiv`. Viewer teardown and direct-file behaviour remain protected. Clinical and physical-device gates remain open.
