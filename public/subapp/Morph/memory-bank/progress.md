# Progress

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Runtime source retained. A suitably sized derived logo is a future asset-delivery opportunity; original artwork was not altered. Mobile Lighthouse performance: 95 → 95/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Control-card rounding aligned while preserving its dark theme and visual teaching layout; no MCQ bank exists.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

- [x] 26/7/2026 final Cup evidence: 11/11 tests and the isolated `360 x 740` five-condition unlock, offline, reset and direct-file suite passed. No MCQ was invented.

- [x] 26/7/2026: extracted pure viewer geometry, cataract preset and jitter helpers.
- [x] Removed the second corneal animation loop and established one idempotent frame owner.
- [x] Added lifecycle cleanup and 10 direct contracts.
- [x] Passed `npm run check`.
- [ ] Independent clinical sign-off and physical-device acceptance remain pending.

- [x] Fleet edge follow-up: controls and black stage now use `10px` margins and `340px` width.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: black `#111111` on a white appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

## Completed

- Studied Fundal Reflex README and memory-bank notes.
- Studied Swollen Discs README, memory-bank notes and viewer logic.
- Reworked Morph UI toward the shared clinical control language.
- Kept Morph's white app bar, black title text, black stage and cartoon character.
- Removed the Zoom control.
- Changed Focus label to Rx.
- Changed Rx button labels to `+++`, `++`, `0`, `--` and `---`.
- Made Field use the full row width.
- Split Field into Direct and BIO groups.
- Tightened the Direct/BIO labels so the control deck gives more space back to the stage.
- Updated the quick guide to say DO and BIO, and removed the unnecessary drag instruction.
- Made Adult/Child a switch.
- Changed Condition to a dropdown on the main screen.
- Removed duplicate stage toolbar text.
- Removed Viewing Mode from the side menu.
- Updated the quick guide and date to 18/5/2026.
- Added local font assets.
- Matched Swollen Discs cataract presets and occlusion spots.
- Matched Swollen Discs corneal reflex model.
- Matched the viewing-window rim to the Swollen Discs layered ring style.
- Kept mouse dragging under the pointer and offset touch or pen dragging so the contact point stays below the circle.
- Constrained the controls and stage to a phone-like width on laptop so the image scale stays consistent with mobile review.
- Copied the Swollen Discs-style jerky background movement, then softened it slightly for Morph with lower jitter, a longer shift interval and a smaller shift distance.
- Reverted pathology image source cropping after it changed artwork size.

## Current Known Issues

- Pathology artwork framing is not perfect in some wide-field views. This is currently treated as an artwork/source-image issue, not a code scaling issue.
- The app is still a single-file JavaScript implementation inside `index.html`; future refactors should be careful and incremental.

## Verification Done

- Inline script syntax check passes.
- In-app browser visual checks were performed at phone width.
- Console checks during control interaction showed no warnings or errors.

# v1.1 progress (23 July 2026)

Completed: app audit, gap lists, accessibility focus containment, deliberate reset, local runtime confirmation, manifest, scoped service worker, contract suite, 360 x 740 isolated-browser verification, offline reload, README refresh and governance records. Preserved: teaching workflow, viewer mathematics, inline engine, assets, IDs, control vocabulary and visual identity. Pending: independent clinical content review and named physical-device checks.

## Information popup consistency — 23 July 2026

- Added an effective `44 x 44px` close target.
- Replaced the ambiguous updated-date label with the release-style `version · date` presentation.
- Preserved viewer mathematics, images and controls.

## Information-card typography and fit — 23 July 2026

- Applied the shared popup type hierarchy.
- Verified a `520.3px` card at `360 x 740` with no internal scrolling.
- Standardised the simple visible `v1` label and `23/7/2026` date in the shared bottom-right footer position.

## Main-page typography review — 23 July 2026

- Raised Direct and BIO method labels to `10px`.
- Preserved all simulator geometry and behaviour.
- Six contract tests and the `360 x 740` browser check passed.

- Verified the standard sidebar hierarchy, focus entry and Escape focus return at `360 x 740`.
- Recorded the deliberate MCQ exclusion: Morph's Cup remains tied to trying every condition and no quiz workflow was invented.

## Maintenance refactor - 26 July 2026

- Added pure viewer logic and ten focused contracts.
- Consolidated the viewer and corneal work into one idempotent animation loop.
- Passed 10/10 contracts, syntax and untouched/dense/transient/reset/offline/direct-file browser checks at `360 x 740`.

## 26 July 2026 MCQ exclusion pass

- Confirmed that adding an MCQ would invent a workflow outside Morph's simulator purpose.
- Preserved the five-condition Cup completion rule.
- Added automated contracts for conditions mode, five unique targets and no MCQ controls.
- Passed 11/11 source and viewer tests before isolated browser follow-up.
- Independent clinical review of condition imagery and physical-device acceptance remain pending.
