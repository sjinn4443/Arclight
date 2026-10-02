# Newton (Mires)

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Production bundle minified from its canonical source. Shipped JavaScript: 81,995 → 44,284 bytes. Mobile Lighthouse performance: 97 → 97/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Marked quiz result appears before the actions; shared quiz styling added without altering simulator layout.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Fleet repair receipt — 30 September 2026

Removed direct-file font preload CORS errors while retaining and verifying both local font families. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## Logic corrections — 29 September 2026

Corrected SVG centring, zoom-safe movement bounds, immediate thickness geometry updates and touch-device drift. Training panels now support Escape, focus entry/return and inert closed content. Incomplete MCQs focus the first unanswered item. Completed cases use a completion label rather than claiming continuing alignment. Newton scoring is unchanged; accepted out-of-band estimates say `Within tolerance`. Pinch-to-single-finger movement now rebases its touch origin.

Replaced conflicting fluorescein bias rules with manufacturer-supported endpoint recognition and correction questions. Clinical sign-off remains pending. All 11 unit/contracts tests, exact generated-bundle parity, the established browser suite and `node tests/logic-browser.mjs` pass. HTTP checks have no console errors; direct-file interactions pass with Chromium's existing local-font CORS fallback. Physical-device acceptance remains pending. Cache/assets: `20260929-logic1`.

## Maintenance refactor — 26 July 2026

The permanent 100 ms timer has been replaced with a fixed-step `requestAnimationFrame` scheduler which pauses while the page is hidden and can be stopped cleanly. Newton bands, tolerance scoring and training-lock rules now live in a pure tested module. A live browser contract exposed that the stage's percentage height had collapsed to 200px, so its existing `340 × 656px` mobile geometry is now anchored to `100dvh`. Controls and the established one-screen layout are otherwise unchanged. Nine tests, exact bundle parity and the full browser suite pass. Independent clinical sign-off and physical-device acceptance remain pending.

UI hierarchy follow-up, 26 July 2026: the two mobile mode launchers are a centred pair of equal `159 x 44px` controls with a `10px` gap, matching neutral surfaces and a `12px` radius. Open Newton and Variable panels remain aligned to `x=10`, `width=340`, `radius=16px`. The Controls dock is now a quieter centred `328px` card with a `16px` radius and tighter internal spacing. The original game area remains exactly `x=10`, `y=74`, `340 x 656`. Goldmann and Newton geometry, scoring and controls are unchanged.

## v1.1 status (23/7/2026)

The Goldmann and Newton training logic, green accent, simulator geometry and MCQ content are preserved. Runtime fonts are local. A two-step `New training session` action clears the current simulator and exercise state while retaining local achievement. Dialogs and the drawer restore focus and trap keyboard focus. The balanced mode launchers, aligned mobile drawers and stronger Controls surface now match the fleet hierarchy without changing the simulator arrangement. An app-scoped manifest and service worker support HTTP(S) installation and offline reload while direct-file use remains functional without service-worker support. Chromium may block the local WOFF2 files on `file://`, in which case the documented system-font fallback is used.

Install the pinned build tool, run contracts and rebuild with `npm install`, `npm test` and `npm run build`. Independent clinical sign-off and physical-device acceptance remain pending.

<!-- APP-DOC-STATUS:START -->

## Current Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: bright green `#00ff00` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Newton is a browser-based training simulator for Goldmann split-prism mire alignment and IOP estimation practice.

## Core Features

- Mire movement with keyboard and touch input.
- Adjustable motion noise:
  - Jitter
  - Sudden shift
  - Drift
  - Mire thickness
- Blue-light / no-fluorescein visual toggle.
- Two training drawers:
  - `Variable IOPs` (right)
  - `Newton IOP` (left)
- MCQ learning path with three tiers:
  - Primary
  - Intermediate
  - Advanced
- All three MCQ tiers are directly available from the menu.

## Training Modes

### Variable IOPs

- Tier ranges:
  - Primary: `10-30 mmHg`
  - Intermediate: `8-40 mmHg`
  - Advanced: `8-60 mmHg`
- User aligns mires to centre and inner-edge touch.
- IOP is revealed after stable alignment lock.
- New cases are sampled with balanced low/mid/high spread for variety.

### Newton IOP

- Hidden IOP range: `10-50 mmHg` with broad case spread.
- User chooses a point weight (`20`, `25`, `30`) and an estimate band.
- Scoring is based on estimate selection:
  - Correct: within `+/-2 mmHg`
  - Close: within `+/-3 mmHg`
- Weight choice affects visual setup but is not used for correctness scoring.

## Controls

- `Arrow keys`: move mires.
- `R` / `F`: increase / decrease separation (Variable mode only).
- `Z` / `X`: zoom in / out.
- `Alt + Arrow Up/Down`: adjust jitter.
- `Alt + Arrow Right/Left`: adjust sudden movement.
- Touch:
  - One-finger drag to move.
  - Two-finger pinch to zoom.

## Run Locally

```powershell
py -m http.server 5500
```

Open `http://localhost:5500`.

Opening `index.html` directly remains functional for the simulator. Use the local HTTP route when exact Inter/Quicksand typography, installation or offline caching must be verified.

## File Layout

- `index.html`: app shell, drawers, menu, modals and cache-busted local assets.
- `styles.css`: UI styling, typography tokens and responsive layout.
- `app.js`: startup wiring.
- `simulator.js`: simulator runtime, mode logic, scoring, sampling.
- `mcq.js`: MCQ menu, modal flow, timer and result handling.
- `questions.js`: MCQ tier config and question bank.
- `memory-bank/`: concise project context for handover.

## Information popup consistency — 23 July 2026

The information trigger now exposes `aria-controls`, `aria-expanded` and dialog intent, with runtime state kept synchronised as the modal opens and closes. The compact close control has an effective `44 x 44px` target and the version line uses the shared separator. Simulator logic is unchanged.

## Information-card typography and fit — 23 July 2026

The guide now uses the fleet scale of `14px` title, `12.5px` body and `10.5px` version text. It measured `352.9px` at `360 x 740` and required no internal scrolling. Its simple visible `v1` label and current `23/7/2026` date now occupy the shared bottom-right footer position.

## Main-page typography review — 23 July 2026

Newton status and action text now render at `10.5px` and guess labels at `10px`. Goldmann and Newton mechanics, alignment geometry and scoring are unchanged. The target viewport has no horizontal overflow.

## Sidebar consistency — 23 July 2026

The green identity and existing training actions are unchanged. The drawer uses the fleet `14px` title, `11px` section-label and `12.5px` supporting-copy roles where present, with focus entry, Escape closure and trigger-focus return verified at `360 x 740`.

## MCQ consistency — 23 July 2026

Each level now has a larger authored pool for varied retries, while the existing attempt sizes are retained. Labels match the fleet and Cup unlocking requires an explicit Advanced pass. Goldmann and Newton logic are unchanged.

## App-bar information glyph correction — 26 July 2026

The visible information glyph now uses the fleet-standard `21px` size inside its unchanged `44 x 44px` touch target. The Mires green identity, app-bar geometry, simulator and teaching logic are unchanged. Browser-visible styling and the app-scoped cache use `20260726-point1`.

### Compact training-panel presentation — 26 July 2026

The Newton and Variable IOP launch controls now share one measured mobile treatment rather than unrelated grey styles. Their open panels were checked in the retained Codex browser at `360 x 740`: Newton retains its compact estimate hierarchy and colour-banded choices, while Variable IOPs retains its result, case action and level hierarchy. The Controls dock is narrower and less visually dominant. No IOP classification, tolerance, sampling, lock, simulator or MCQ behaviour changed. Nine contracts, exact bundle parity and the full browser suite pass.

### Newton touch-target refinement — 26 July 2026

Every Newton interaction now provides a `44 x 44px` minimum target at `360 x 740`: the close control, 20/25/30 row, nine estimate choices and New Case/Submit actions. Estimate pills use the full width of their grid cells and the panel is tall enough to avoid internal scrolling in untouched and completed states. The colour bands, three-column arrangement and all Newton calculations remain unchanged.

The 20/25/30 Newton-point row is deliberately distinct from the estimate grid: it uses colour-matched `2px` borders, squarer corners and subtle inset depth, while estimate choices retain quieter `1px` borders. The selected Newton point keeps the strongest inset emphasis.

## MCQ quality pass — 26 July 2026

All 30 questions were audited: 10 per tier. Attempt sizes remain 5 Primary, 6 Intermediate and 7 Advanced. Stable IDs are preserved and every question now has a concise rationale, source key and review status. Interface-mechanics items were replaced with Goldmann technique questions. Review now explains correct and wrong answers, preserves the unanswered guard, adds a real **New set** and uses 44px answer rows.

Two evidence-backed corrections were made. `p4` now teaches that excess fluorescein or tear film produces thick mires with possible under-reading. `p5` now teaches that insufficient fluorescein produces thin mires with possible over-reading. Final 11/11 tests, exact bundle parity and the complete isolated `360 x 740` browser suite pass. Newton scoring, simulator movement, clinical ranges and Cup progression were not changed.

## Information purpose pass — 27 July 2026

The existing `i` panel now tells the user to move the mires to match the view and adjust their separation until the inner edges just touch. It states that the simulator teaches alignment and IOP estimation but does not measure a patient's IOP. No simulator movement, Newton or IOP logic changed. The open panel passed the shared non-scrolling `360 x 740` review.

## Lighthouse legibility remediation - 27 July 2026

Meaningful Newton, Variable IOP and session-control labels now use a measured `12px` floor. The established `340 x 656` stage, `328px` Controls card, three-column Newton grid and `44px` targets are unchanged.

All 11 logic and contract tests pass. The full browser suite passes untouched, completed, dense, transient, reset, offline and direct-file states. The Newton panel remains free of internal scrolling at `360 x 740`. Lighthouse now reports `99.24%` legible text and `96 / 100 / 100 / 100`.

## Fleet UI alignment — 28 September 2026

The information card now uses a `16px` radius and a measured `44 x 44px` close target. The Controls heading uses the fleet `15px/700/1.2` role. Clean Chromium checks at `360 x 740` found no overflow, no information-card scrolling, correct Escape focus return and no console errors. Simulator and Newton logic are unchanged. Physical-device acceptance and independent clinical sign-off remain pending.
