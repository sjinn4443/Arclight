# Progress

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Production bundle minified from its canonical source. The approved C/D 0.9–1 END-STAGE black-grid presentation is retained. Shipped JavaScript: 73,470 → 40,799 bytes. Mobile Lighthouse performance: 92 → 96/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Clinical follow-up — 30 September 2026

C/D 0.9–1 still displays `END-STAGE`; the black final grid column, point weights and referral timings are unchanged. Reduced vision or abnormal pupils now retain a separate assessment cue alongside END-STAGE or EMERGENCY rather than replacing either. Fresh tests include 60 end-stage combinations and six concern/urgency cases. Build, lint, tests, exact rebuilt-bundle parity and HTTP/direct-file mobile checks pass with no captured runtime errors or horizontal overflow.

Current receipt: `../../CLINICAL_LOGIC_FIXES_20260930.md`. Independent clinical sign-off and physical-device acceptance remain pending. Treat older dated entries as historical.

## Current fleet UI refinement receipt — 30 September 2026

Upright interface labels; shortened ambiguous labels expanded; marked quiz result appears before the actions.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

- [x] 29/9/2026 approved seven-item logic follow-up: partial advice, abnormal-finding reassurance guard, near-total cup protection, persistent end-stage, override explanation, supporting-points label and acute safety boundary. See `LOGIC_REVIEW_20260929.md` for tests and acceptance limits.

- [x] 26/7/2026 final MCQ evidence: replaced interface-mechanics questions with NICE NG81 clinical reasoning while preserving 10/12/16 banks, 4/5/7 attempts and operational risk logic. Lint, tests, parity and isolated `360 x 740` review pass.

- [x] 26/7/2026 maintenance refactor: one input snapshot and one calculation per questionnaire change.
- [x] Added controller coverage, rebuilt from source and passed lint, tests and exact parity.
- [x] Restored the shared `v1 · 23/7/2026` information footer and advanced the app-scoped worker cache to `20260726-refactor2`.
- [ ] Independent clinical sign-off and physical-device acceptance remain pending.

- [x] 25 July safety pass: corrected IOP boundary, added laterality, referral floor and end-stage clarification.
- [x] Added visual laterality: authored orientation for `RE`, horizontal mirror for `LE` and neutral reset with no logic change.
- [x] Clarified laterality as optional so the sparse-information workflow does not fail on a missing eye label.
- [x] Added the compact `R` Report action, pure report formatter, accessible copy modal and reset invalidation.
- [x] Added pressed-state semantics, live result, table semantics and valid thin-rim guide structure.
- [x] Raised Primary pass to 3/4, extended Advanced to 140 seconds and added answer review.
- [x] Rebuilt and passed lint, unit/contracts, 86,400 generated risk combinations and exact 360 x 740 HTTP plus direct-file browser review.
- [ ] Independent clinical sign-off, installed-offline acceptance, direct-file regression and physical-device review.

- [x] Fleet edge follow-up: principal panels use `10px` margins and `340px` width without risk-logic changes.

## v1.1 Engineering Pass (23/7/2026)

- Localised runtime fonts and removed CDN/preconnect requests.
- Added two-step assessment reset, native keyboard controls and transient-surface focus restoration.
- Added scoped manifest/service worker, repaired reproducible linting and added contracts.
- Applied restrained radius, spacing, typography, border, shadow and action-hierarchy polish without changing geometry.
- Rebuilt the bundle and passed lint, tests and exact 360 x 740 HTTP/direct-file browser review.
- Clinical sign-off and physical-device acceptance remain pending.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: bright green `#00ff3b` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

## Completed

- Full JS modularization delivered:
  - risk controller + pure risk engine,
  - popup controller,
  - MCQ controller + pure MCQ engine/data.
- Inline popup JS removed from HTML.
- Popup close (`x`) support standardized in JS.
- Stylesheet split into maintainable modules with `styles.css` as import entrypoint.
- Added unit-style tests for core engines.
- Added `package.json` scripts for testing and linting:
  - `npm test`
  - `npm run lint`
- Added pressure-path hardening in risk engine:
  - validated pressure inputs,
  - explicit conflict handling (IOP overrides palpation),
  - dedicated emergency warning for `Rock` palpation, including without C/D.
- Made scoring explainer popup dynamic and versioned from `risk-config` constants.

## Verified

- `npm run lint` passed.
- `npm test` passed.

## Remaining Gaps

- No browser automation test yet.
- No CI workflow yet.

## Information popup consistency — 23 July 2026

- Marked the anchored guide explicitly non-modal.
- Matched the shared 10px mobile edge gap and added an effective `44 x 44px` close target.
- Kept the version visible below the collapsed scoring explanation and standardised its separator.
- Preserved all risk calculations and scoring content.

## Information-card typography and fit — 23 July 2026

- Applied the shared popup type hierarchy.
- Verified the `329.2px` initial card and `425.9px` expanded scoring card at `360 x 740`; neither required internal scrolling.
- Standardised the simple visible `v1` label and date in the shared bottom-right footer position in both states. The current date is `25/7/2026`.

## Main-page typography review — 23 July 2026

- Raised compact palpation-button text to `10.5px`.
- Preserved all risk-engine inputs, thresholds and output behaviour.
- The full app test command and `360 x 740` browser check passed.

- Verified the standard sidebar hierarchy, focus entry and Escape focus return at `360 x 740`.
- Expanded MCQ retry pools, added safe option shuffling, standardised level controls and hardened Cup unlocking. Risk-engine logic and thresholds were not changed.

## Maintenance refactor - 26 July 2026

- Centralised the controller input snapshot and removed duplicate calculation work.
- Rebuilt the generated bundle and advanced the app-scoped cache together.
- Passed lint, controller, contract, parity and HTTP/direct-file checks at `360 x 740`.

## 26 July 2026 MCQ pass

- Audited all 38 questions and preserved attempt sizes.
- Added stable IDs, rationales, source metadata and review statuses.
- Replaced three interface-mechanics questions with clinical reasoning.
- Added correct and wrong marking, rationale text, result focus and a fresh New set.
- Kept manual unanswered submission blocked and timed unanswered items fail-safe.
- Rebuilt the generated bundle. Independent clinical sign-off and physical-device acceptance remain pending.

## Lighthouse accessibility remediation - 27 July 2026

- [x] Raised all four IOP inputs from `18 x 18px` to `24 x 24px`.
- [x] Preserved the compact one-page geometry and labelled selection areas.
- [x] Passed the app tests and isolated `360 x 740` review with no console error.
- [x] Improved Lighthouse accessibility from `96` to `100`.
- [ ] Independent clinical sign-off and physical-device acceptance remain pending.
