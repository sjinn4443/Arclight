# Progress

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Production bundle minified from its canonical source. Release, HTML and service-worker versions remain aligned. Shipped JavaScript: 98,386 → 51,781 bytes. Mobile Lighthouse performance: 95 → 95/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Clinical follow-up — 30 September 2026

Incomplete core inputs now retain independently recorded safety findings while the result remains `Not assessed`. Missing safety checks qualify a cataract phenotype as `Possible`. Existing urgent precedence and referral timings are preserved. Fresh checks: 21 contract/regression tests, 30 acceptance cases, exact rebuilt-bundle parity and the full 3,110,400-case combination audit pass. HTTP and direct-file mobile checks pass with no captured runtime errors or horizontal overflow.

Current receipt: `../../CLINICAL_LOGIC_FIXES_20260930.md`. Independent clinical sign-off and physical-device acceptance remain pending. Treat older dated entries as historical.

## Current fleet UI refinement receipt — 30 September 2026

Quiz/result styling aligned; release and service-worker asset versions synchronised.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

- 29 September 2026: five authorised logic corrections implemented; 18 contract/regression tests and 30 acceptance checks pass. Expanded output audit covers 614,400 combinations with no configured findings. Source-to-bundle parity passes. HTTP partial and completed states checked at 360 x 740. Persistent toolbar hand-off remains unverified because the saved script cannot locate Cataract's real tab.

- [x] Fleet edge follow-up: principal panels use `10px` margins and `340px` width while the History row remains collision-free.
- [x] Safety refinement: explicit assessment states, required age, eye-specific VA wording and cautious urgency and white-reflex handling.

<!-- APP-DOC-STATUS:START -->

## Historical Memory Status (26/7/2026)

- Release: `v1.1`; fleet presentation pass plus focused Cataract safety refinement complete.
- Static packaging: direct-file basic use plus HTTP/HTTPS installable offline support.
- Mobile target: `360 x 740`, with one document scroll and no internal card scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: orange `#ff8a00` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
- Assessment reset, offline support, app contracts and governance records are complete.
- Allan-informed visual polish is complete: `14px` outer panels, `10px` inner groups, `8px` controls, calmer inner borders, readable compact labels and no operational italics.
- Independent clinical sign-off and physical-device acceptance remain pending.
<!-- APP-DOC-STATUS:END -->

Last updated: 30/9/2026

## v1.1 Completed

- Kept the existing mobile layout while making narrow, approved safety changes in the pure decision engine.
- Rationalised radii, border weight, compact typography and operational label styling without moving controls.
- Added neutral dashes and compact `No` and `Yes` choices for every safety check.
- Preserved the original single-line Eyes, Pain/Redness and Age layout with narrow-width spacing that prevents collisions.
- Added two-step assessment reset without clearing MCQ progress.
- Added persistent, closeable image enlargement.
- Improved quick-guide and MCQ focus behaviour.
- Added manifest, scoped service worker and offline reload support.
- Added eight app-contract checks.
- Added clinical review and constrained-device documentation.
- Completed live `360 x 740` checks for incomplete state, a completed result, drawer, reset, enlarged image, MCQ modal and offline reload.
- Rechecked missing-safety, probable-mature, sudden-painless, paediatric-white-reflex and detached-retina states at `360 x 740`.

## Completed — July snapshot (assessment access superseded September 2026)

- Preserved one-page modular app structure.
- Kept MCQ system and info popup integrated with main page.
- Simplified display text in small selects:
  - distance VA label now changes between `Eye VA`, `Affected VA` and `Worse-eye VA`
  - age options display as short ranges
  - BCVA compact options (`Unable`, `Fix+`, `Fix-`)
- Removed compact green-dot select indicator; selected values are now visible.
- Added clearable top radios (click selected option again to unset).
- Implemented robust progressive locking:
  - Fundal unlock requires onset + eyes + age + eye VA
  - Back unlock requires Fundal selection
  - Dense/white Fundal auto-forces Back `poor view`
  - Result unlock depends on complete decision output
- Added lock hints and semantic disabled behavior (`aria-disabled` + real disabled controls).
- Added distance/near consistency checks:
  - good distance + poor near (non-presbyopic) -> recheck
  - poor distance + good near -> recheck
- Added near field into recheck highlight mapping.
- Reduced repetitive output notes with action-vs-note dedup filter.
- Simplified wording in Check/notes for plain-language outputs.
- Added visible Result-output audit over all complete UI-feasible combinations.

## Historical Verification — July 2026

Recorded `npm test` (2026-07-26):

- app contracts: `13/13` pass
- `qa-cataract-acceptance.mjs`: `30/30` pass
- `qa-cataract-combination-audit.mjs`: no findings
- `qa-cataract-result-output-audit.mjs`: no findings
  - complete UI combinations `516,096`
  - unique visible Result panels `2,828`
- `qa-cataract-full-audit.mjs`: no findings (`P0=0, P1=0, P2=0, P3=0`)
  - total states `7,558,272`
  - complete states `1,843,200`
  - complete+reachable `1,548,288`
- `qa-cataract-lmic-content.mjs`: PASS

## Remaining Optional Refactor

- Split `src/cataract-controller.js` into:
  - `progressive-lock-state`
  - `result-renderer`
  - `interaction-handlers`
- This is optional; current code is stable and audited.

## Information popup consistency — 23 July 2026

- Marked the anchored Quick Guide explicitly non-modal.
- Retained the native `44 x 44px` close target and standardised version presentation.
- Preserved all triage logic, labels and layout.

## Information-card typography and fit — 23 July 2026

- Applied the shared popup type hierarchy.
- Verified a `525.2px` card at `360 x 740` with no internal scrolling.
- Standardised the simple visible `v1` label and `23/7/2026` date in the shared bottom-right footer position.

- Standardised the sidebar hierarchy and added verified focus entry and Escape focus return.
- Shuffled MCQ question options with answer remapping, standardised level labels and radius and restricted Cup unlocking to an explicit Advanced pass. Full rule audits remained clean.

## Narrow History fit — 26 July 2026

- Corrected the compact media-rule cascade that squeezed the History controls at `360 x 740`.
- Kept the established rows and clinical state logic unchanged.
- Preserved onset timing in accessible names while hiding only the parenthetical hints at the target width.
- Superseded the initial hidden-scrollbar check after the retained browser exposed reduced usable width.
- Verified the row again at `345px` usable content width: Pain control right edge `217.39px`, Age label left edge `228px`, clearance `10.61px`, Age control inside the row and no document overflow.
- App contracts remain `13/13` passing and the acceptance audit remains `30/30` passing.

## Age-band simplification — 26 July 2026

- Removed `Unk` from the visible Age menu at the user's direction.
- Age remains required and the closest estimated band must be selected.
- Retained defensive engine handling for legacy `unknown` data without presenting it as a current workflow choice.
- Re-ran all audits with `unknown` removed from reachable UI combinations; no configured findings were detected.

## Younger-adult cause prompt — 26 July 2026

- Replaced `Check secondary causes` with `Ask about trauma, steroids, diabetes and eye inflammation.`
- Preserved the existing trigger, action colour and referral logic.
- Added a contract that rejects the old vague wording.

## VA unable label — 26 July 2026

- Replaced the ambiguous visible `No test` option with `Unable`.
- Kept the internal `unable_test` state and cautious routing unchanged.

## Refactor completion — 26 July 2026

- Added pinned reproducible build and exact non-writing parity commands.
- Rebuilt `app.bundle.js` from `src/app.js`.
- Removed one verified unused copy export.
- Coupled the offline cache identity to the runtime bundle release token with a contract.
- Contracts and all clinical audits passed. Clinical sign-off and physical-device testing remain external gates.
- `—` continues to mean not entered and blocks calculation because distance VA is required.

## MCQ quality completion — 26 July 2026

- Corrected over-specific white-reflex wording and replaced low-value app-mechanics questions.
- Added IDs, explanations, source status, actionable retry and visible result placement.
- Preserved all three levels, 12-question pools, five-question attempts, 4/5 pass marks, timers and Cup progression.
- Verified unanswered, failed, explanation, retry, Escape focus return, `360 x 740` overflow and console states.
