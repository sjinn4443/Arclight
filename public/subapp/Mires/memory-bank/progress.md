# Progress Log

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

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

- [x] 26/7/2026 final MCQ evidence: 11/11 tests, exact bundle parity and the complete isolated `360 x 740` browser suite passed after the p4/p5 EGS correction and focus-return fix.

- [x] 26/7/2026: replaced the permanent interval with a visibility-aware fixed-step RAF scheduler.
- [x] Extracted pure Newton scoring, band and training-lock logic.
- [x] Added scheduler and logic contracts then rebuilt with exact bundle parity.
- [x] Passed 9/9 tests.
- [x] Restored the established `340 × 656px` stage after the live browser suite caught a 200px percentage-height collapse.
- [ ] Independent clinical sign-off and physical-device acceptance remain pending.

- [x] Fleet edge follow-up: visible shell, unchanged game area, dock and top triggers align to `10px` margins and `340px` width.
- [x] UI hierarchy follow-up: equal `159 x 44px` mode launchers, aligned `16px` drawers, a centred `328px` Controls card and upright estimate labels pass at `360 x 740` while the original `340 x 656` game area remains unchanged.

## 2026-07-23

Completed v1.1 local fonts, scoped PWA, two-step training-session reset, focus containment/restoration, semantic dialog markup, pinned build/tests and restrained radius, shadow, typography and action hierarchy polish. Automated and browser evidence is recorded in `MIRES_V1.1_EVIDENCE_RECEIPT.md`.

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

## 2026-03-03

Completed:

- Added left `Newton IOP` and right `Variable IOPs` training drawers.
- Implemented drawer exclusivity and mobile-safe layout behavior.
- Added tiered variable-case ranges and Newton estimate bands.
- Implemented balanced bucket sampling for broader low/mid/high case variety.
- Updated Newton scoring to grade estimate selection only (`+/-2` correct, `+/-3` close).
- Removed weight-based correctness gating and "better weight" feedback.
- Added/condensed Goldmann quick guide modal with version marker (`v1 - 18/5/2026`).
- Reworked MCQ bank toward clinical Goldmann principles.

Validation:

- JS syntax checks passing for `app.js`, `simulator.js`, `mcq.js`, `questions.js`.
- Local static serving verified at `http://localhost:5500`.

Next possible steps:

- Add small smoke checks for key simulator/scoring paths.

## 2026-05-09

Completed:

- Transferred the Fundal Reflex UI discipline without copying its palette.
- Kept Quicksand for the app bar and moved the main UI to an Inter-style font stack.
- Rethemed the MCQ side menu as a light clinical panel with small tier dots.
- Refined the side menu to match Fundal more closely: starts below the app bar, includes a `Menu` kicker and has a close button.
- Removed the invented MCQ unlock/progress pattern so all levels remain directly accessible.
- Restyled Quick Guide as a compact top-right popup while preserving its text content.
- Polished the Newton IOP drawer with a lighter panel surface, calmer button states and more compact controls.
- Polished modal and MCQ question surfaces with quieter cards, borders and focus treatment.
- Updated the Goldmann quick guide and Variable IOP status copy to use `Centre / Touch / Steady`.
- Made Newton feedback judgement-first, then actual IOP.
- Fixed logic so Variable IOP does not reveal before user adjustment and Newton submitted answers lock until `New Case`.
- Replaced remaining avoidable HTML string rendering in MCQ results with DOM/text construction.
- Audited MCQ bank integrity and corrected remaining British English spellings in answer text.
- Reworked the MCQ modal layout to follow Fundal Reflex: compact title/intro, contained question scrolling, visible submit area, live submit action and lighter option rows.
- Added cache-busting query strings for the stylesheet and modules; current UI pass is `20260509-ui13`.

Validation:

- JS syntax checks passing for `app.js`, `simulator.js`, `mcq.js` and `questions.js`.
- Unsafe HTML-injection search returned no matches.
- Codex in-app browser checked at `360 x 740` for the main screen, side menu, Quick Guide, MCQ modal and Newton IOP drawer.

## Information popup consistency — 23 July 2026

- Added `aria-controls`, `aria-expanded` and dialog intent to the information trigger.
- Synchronised expanded state during open and close.
- Added an effective `44 x 44px` close target and standardised version presentation.

## Information-card typography and fit — 23 July 2026

- Applied the shared popup title, body and version scale.
- Verified a `352.9px` card at `360 x 740` with no internal scrolling.
- Standardised the simple visible `v1` label and `23/7/2026` date in the shared bottom-right footer position.

## Main-page typography review — 23 July 2026

- Raised Newton status and action text to `10.5px` and guess labels to `10px`.
- Preserved Goldmann and Newton logic and geometry.
- Five contract tests and the `360 x 740` browser check passed.

- Verified the final sidebar hierarchy, focus entry and Escape focus return at `360 x 740`.
- Expanded the three MCQ pools for retry variation, standardised labels and hardened Cup unlocking without changing Goldmann or Newton logic.

## Maintenance refactor - 26 July 2026

- Extracted pure simulator logic and added focused contracts.
- Replaced the permanent timer with one visibility-aware scheduler.
- Restored the preserved `340 x 656` stage after the browser suite caught a `200px` regression.
- Passed 9/9 contracts, parity and the full HTTP/direct-file browser suite.

## App-bar information glyph — 26 July 2026

- [x] Standardised the visible `i` at `21px`.
- [x] Retained the `44 x 44px` touch target and Mires app-bar geometry.
- [x] Kept Goldmann, Newton and MCQ behaviour unchanged.

## Compact mobile presentation — 26 July 2026

- [x] Replaced the mismatched full-width mode launchers with equal `159 x 44px` neutral controls, a `10px` gap and `12px` radii.
- [x] Reduced the Controls dock to a centred `328px` card with tighter spacing and a `16px` radius.
- [x] Reviewed the closed state, Newton panel and Variable IOP panel in the real retained Codex tab at `360 x 740`.
- [x] Passed 9/9 contracts, exact bundle parity and the full browser suite without changing IOP or simulator logic.

## Newton touch-target refinement — 26 July 2026

- [x] Raised every Newton interactive target to `44px`.
- [x] Expanded estimate pills to their full grid-cell width and regularised gaps to `6px`.
- [x] Verified untouched and completed panel states without internal scrolling at `360 x 740`.
- [x] Re-ran 9/9 contracts, exact bundle parity and the full browser suite.
- [x] Strengthened only the Newton-point row with `2px` colour-matched borders and subtle depth, preserving the quieter `1px` estimate grid.

## 26 July 2026 MCQ pass

- [x] Audited all 30 questions and preserved stable IDs and attempt sizes.
- [x] Added rationales, source metadata and review statuses.
- [x] Corrected `p4` and `p5` fluorescein error directions against EGS guidance.
- [x] Added regression assertions for both directions.
- [x] Added explanatory review, unanswered and timeout fail-safe, New set, result focus and 44px rows.
- [x] Rebuilt the bundle and passed 11/11 source and logic tests plus exact parity.
- [ ] Independent clinical sign-off and physical-device acceptance.

## Lighthouse legibility remediation - 27 July 2026

- [x] Raised meaningful compact training labels to `12px`.
- [x] Preserved panel geometry, `44px` targets and the scroll-free Newton state.
- [x] Passed 11/11 tests and the full `360 x 740` browser suite.
- [x] Improved Lighthouse legibility to `99.24%` and Best practices to `100`.
- [ ] Independent clinical sign-off and physical-device acceptance remain pending.
