# Active Context

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Production bundle minified from its canonical source. Shipped JavaScript: 81,995 → 44,284 bytes. Mobile Lighthouse performance: 97 → 97/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Marked quiz result appears before the actions; shared quiz styling added without altering simulator layout.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Fleet repair receipt — 30 September 2026

Removed direct-file font preload CORS errors while retaining and verifying both local font families. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## Logic corrections — 29 September 2026

Supersedes the July fluorescein direction assertions below: p4/p5 now teach wide-band recognition and drying correction from the manufacturer instructions, without unqualified bias direction. Geometry, zoom bounds, thickness refresh, touch drift, pinch handover and panel/MCQ focus defects are corrected. Scoring thresholds remain unchanged. Completed-case text is historical rather than a live alignment claim. 11 tests, bundle parity, browser smoke and new HTTP/file touch regression checks pass. File font CORS fallback persists; clinical and physical-device sign-off remain pending. See README and tests/logic-browser.mjs.

## Final MCQ evidence — 26 July 2026

The 30-question Goldmann bank, 5/6/7 attempt sizes, p4/p5 fluorescein regression directions and explanatory review flow pass source, parity and isolated `360 x 740` browser checks. Goldmann and Newton operational logic are unchanged. Independent clinical sign-off and physical-device acceptance remain open.

## Maintenance refactor (26/7/2026)

Mires keeps the same 100 ms simulation step but schedules it through one stoppable `requestAnimationFrame` owner. The scheduler pauses when hidden. Newton classification, tolerance and training-lock transitions are pure and directly tested. The mobile stage height uses `100dvh` so the established `340 × 656px` geometry cannot collapse to 200px. Nine tests, exact parity and the browser suite pass. Clinical and physical-device gates remain open.

UI hierarchy follow-up, 26 July 2026: equal `159 x 44px` mode launchers use a `10px` gap and matching neutral treatment, both mobile drawers align to `x=10`, `width=340`, `radius=16px` and the Controls dock is centred at `x=16`, `width=328`, `radius=16px`. The game area remains exactly `x=10`, `y=74`, `340 x 656`; simulator geometry and logic are unchanged.

## v1.1 implementation (23/7/2026)

Engineering, accessibility, session reset, local runtime, offline and restrained UI hierarchy work is implemented. The final mobile hierarchy separates the mode launchers, drawer cards and Controls surface without changing the established one-screen workflow. Goldmann/Newton thresholds, scoring, sampling, controls, internal IDs and green identity are unchanged. Clinical and physical-device review remain pending.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: bright green `#00ff00` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Current implemented state:

- Two training drawers are active:
  - Left: `Newton IOP`
  - Right: `Variable IOPs`
- Drawers are mutually exclusive and their toggles auto-hide when the opposite drawer is open.
- Variable mode uses centre + inner-edge lock to reveal IOP.
- Newton mode hides separation control and scores estimate bands with:
  - Correct: `+/-2 mmHg`
  - Close: `+/-3 mmHg`
- Newton weight choice (`20/25/30`) is visual aid only, not grading logic.
- Case generation is balanced across buckets to force broad low/mid/high practice.
- MCQ bank has been rewritten to be clinically Goldmann-focused.

Recent UX content changes:

- Info modal condensed to a short Goldmann quick guide.
- Result text simplified (`Correct` highlighted) and no weight-based fail reason.
- May 2026 Fundal-style discipline pass:
  - app bar keeps Quicksand, black and green Newton identity
  - main UI now uses an Inter-style font stack
  - side menu is a light clinical panel with small tier dots
  - side menu now follows the Fundal placement more closely, starts below the app bar and has an explicit close control
  - MCQ levels are directly available; the invented unlock/progress sidebar pattern has been removed
  - Quick Guide popup is a compact top-right panel rather than a centred modal; text content should remain stable unless copy is explicitly requested
  - Quick Guide now uses the beginner endpoint language `Centre / Touch / Steady`
  - Newton IOP drawer has a lighter Fundal-style panel treatment and calmer controls; result is judgement-first (`Correct`, `Close`, `Recheck`) with actual IOP second
  - stylesheet and module imports are cache-busted for local static serving
  - MCQ rendering no longer uses avoidable HTML string injection

Open considerations:

- Confirm final wording of Newton status/result labels.

## MCQ consistency status — 23 July 2026

Each level has a larger authored retry pool while the established attempt sizes remain unchanged. Visible labels are Primary, Intermediate and Advanced. Cup unlocking requires explicit Advanced pass evidence. Goldmann and Newton logic are unchanged. Expanded teaching content awaits independent clinical review.

## Maintenance refactor - 26 July 2026

Simulator maths now lives in a pure module. The former permanent timer is a visibility-aware fixed-step animation scheduler. Browser review caught and corrected a stage-height regression, restoring the established `340 x 656` mobile game area.

## App-bar information glyph — 26 July 2026

- Corrected the legacy `1.05rem` information glyph to the shared `21px` app-bar size.
- Preserved the existing `44 x 44px` button, app-bar position, green accent and all simulator logic.
- Versioned the stylesheet and Mires-only cache as `20260726-point1`.

## Compact mobile presentation — 26 July 2026

- Newton and Variable IOP launchers are equal `159 x 44px` controls with a `10px` gap, matching neutral surfaces and `12px` radii.
- The Controls dock is centred at `328px` with a `16px` radius and tighter vertical spacing.
- Both open training panels and the closed state were inspected in the retained Codex browser at `360 x 740`.
- Goldmann, Newton, Variable IOP and MCQ logic remain unchanged.

## Newton touch targets — 26 July 2026

- Close, Newton-point, estimate and action controls now have `44 x 44px` minimum targets.
- Estimate pills fill their three-column grid cells and use consistent `6px` gaps.
- The panel fits untouched and completed content without an internal scrollbar at `360 x 740`.
- Newton classifications, tolerances, sampling and training locks are unchanged.
- Newton-point buttons use colour-matched `2px` borders and subtle inset depth; estimate choices retain `1px` borders.

## MCQ quality pass — 26 July 2026

The bank remains 30 stable questions, 10 per tier, with attempt sizes 5, 6 and 7. Every question now has a rationale, source key and review status. Interface-mechanics items were replaced with Goldmann technique. EGS review corrected `p4` to excess-fluorescein under-reading and `p5` to insufficient-fluorescein over-reading. Feedback, New set, result focus and 44px rows are implemented. Newton and simulator logic are unchanged.

## 27 July 2026 - Lighthouse legibility remediation

- Meaningful Newton, Variable IOP and session-control labels use a `12px` floor.
- The preserved `340 x 656` stage, `328px` dock, three-column Newton grid and `44px` targets are unchanged.
- The Newton panel remains scroll-free at `360 x 740`.
- All 11 tests and the full HTTP, offline and direct-file browser suite pass.
- Lighthouse reports `99.24%` legible text and `96 / 100 / 100 / 100`.
- Goldmann, Newton, case and Cup logic were not changed.
