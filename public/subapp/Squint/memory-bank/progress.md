# Progress

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Runtime source retained. Ordered globals, controller references and presets are used functionality, not candidates for blind removal. Mobile Lighthouse performance: 85 → 85/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Clinical follow-up — 30 September 2026

No additional production logic change was made after the four-app review. Current simulator contracts and the amended source parity baseline pass. The earlier 30 September review recorded 68/68 preset audits over HTTP and direct-file routes. Preset recognition, pixel offsets and animation behaviour are teaching mechanisms, not independently validated patient diagnosis.

Current receipt: `../../CLINICAL_LOGIC_FIXES_20260930.md`. Independent clinical sign-off and physical-device acceptance remain pending. Treat older dated entries as historical.

## Current fleet UI refinement receipt — 30 September 2026

Bounded scrollable quiz panel; regular answer text; independent wider-screen input/output columns.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

29 September acceptance: all eight new interaction regression groups pass over HTTP and direct-file routes, as do the existing 68-preset audits, mobile UI workflows, contracts and amended parity checks. Expanded final sweep records 68 presets x nine gaze positions plus near, both covers, uncover and reset; saved evidence validates without residual reset observations or non-finite values. Cache/asset revision is `20260929-logic2`. Real retained Squint toolbar verified 360 x 740 after a Mires switch-away/back. See `CONDITION_REVIEW_20260929.md`. Clinical sign-off and physical-device testing remain pending.

- [x] Disabled and dimmed Direction, Waveform and Rate until Nystagmus is active, while retaining preset-driven values.
- [x] Clarified direct iris drag versus Gaze tracker in the information guide without introducing internal popup scrolling.
- [x] Changed the neutral observation to `No urgency modifiers selected.`.
- [x] Expanded `Pain / headache` and `Pupils, iris and lids`.
- [x] Added an accessible 44px preset search with match count, in-place filtering, folder restoration and Escape clearing.
- [x] Verified one-result `duane` filtering and complete restoration of all 68 presets over HTTP and direct-file routes.
- [x] Passed contracts, refactor parity, both mobile workflows and both 68-preset audits with `20260724-squint9`.
- [ ] Repeat iris drag, cover, torch, Advanced sliders and preset search on a physical touch device.

- [x] Replaced the untouched `nil | nil` fallback with `No alignment pattern detected.` and separated Pattern from Observations.
- [x] Cleared stale released-cover text when a later non-primary gaze action begins with no eye covered.
- [x] Added concise RE/LE screen-orientation and extraocular-muscle abbreviation guidance.
- [x] Strengthened Advanced Context, Movement and Pupils / lids hierarchy, expanded ambiguous labels and added visible RE/LE upper-lid labels.
- [x] Stacked Movement select labels at `360 x 740`, eliminating the visible Direction and Waveform clipping without changing any control values.
- [x] Passed contracts, refactor parity, HTTP and direct-file mobile reviews and both 68-preset audits with `20260724-squint8`.
- [x] Refreshed the retained Squint tab and verified its real device toolbar remained `360 x 740` after switching to Allan and back.

- [x] Renamed `Gaze track pad` to `Gaze tracker` and exposed the existing live direction status.
- [x] Added a 22px yellow and black target puck, neutral guide ring and yellow graded muscle activation without changing tracker geometry or gaze logic.
- [x] Verified Primary and active Up-right tracker states over HTTP and direct-file routes at `360 x 740`.
- [x] Replaced the top ambient `Light` text with a downward-facing ceiling-light bulb symbol while retaining the `Ambient light` accessible name.
- [x] Added a 700ms full-track tap and keyboard torch sweep, midpoint side transfer, position-proportional illumination and an animated neutral return without changing direct-drag control.
- [x] Re-ran HTTP and direct-file mobile workflows and both 68-preset audits at `360 x 740`.

- [x] Centred `Near` beneath the torch track and restored a visible full circular cover paddle.
- [x] Added 4px visual Near convergence, slowed visible torch crossing to 0.28s and slowed physiological side transfer to 460–880ms.
- [x] Aligned fixation and phoria timing with the 1080ms paddle settle, with separate cover-uncover, alternate-cover, under-cover and uncover observations.
- [x] Cleared pupil models, reactivity, RAPD and preset hints after generic manual pupil or Dilated edits.
- [x] Strengthened 3rd nerve safety wording, pupil-sparing nuance, Horner ptosis and traumatic pupil guidance.
- [x] Rebalanced 68 presets to 10/14/44 and expanded MCQ banks to 10/14/23, sampled 5/6/8.
- [x] Added `360 x 740` browser checks for exact Near centring, below-slider placement, cover circularity, stage containment and light-control clearance.
- [x] Re-audited all 68 preset conditions over HTTP and direct-file routes at exactly `360 x 740`.
- [x] Removed automatic 6th nerve and Horner overdiagnosis from plain esotropia and miosis.
- [x] Corrected A/V exotropia direction and added regression checks for all four A/V classifications.
- [x] Added dynamic 3rd nerve restriction, myasthenic variability, latent and gaze-evoked nystagmus behaviour, INO fellow-eye nystagmus, Duane retraction and DVD extorsion/dissociation.
- [x] Added a momentary `Near` stimulus with Adie and Argyll Robertson responses plus a fixed pharmacological-mydriasis control.
- [x] Updated related MCQ wording and answers.
- [x] Separated normal gaze-trackpad motion from primary-position diagnostic alignment.
- [x] Preserved direct iris-drag findings and all existing preset-specific motility profiles.
- [x] Verified normal gaze in eight directions, outward and down-and-out manual alignment, Brown restriction, Duane restriction and A-pattern sampling.
- [x] Refactor parity, platform contracts and isolated `360 x 740` browser review pass with no runtime errors.
- [x] Corrected RE/LE labels for pupil, upper-lid and iris-fade controls.
- [x] Reordered the gaze muscle columns to examiner-facing RE-left and LE-right without changing the controller mapping.
- [x] Added fade-button `aria-pressed` synchronisation for manual use, presets and reset.
- [x] Made the resting torch pill neutral grey while preserving yellow for active illumination.
- [x] Contract and refactor-parity checks pass.
- [x] Fresh HTTP review passed at `360 x 740` with no browser warnings or errors.
- [ ] Independent clinical sign-off and physical-device review remain pending.

- [x] Review correction: MCQ focus, preset-label clearance, touch areas, cover ARIA state and momentary keyboard controls fixed.
- [x] Online navigation changed to network-first with the cached shell retained as the offline fallback.
- [x] Platform contracts expanded from 5 to 19.
- [x] Fleet edge follow-up: principal simulator shells use `10px` margins and `340px` width.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (24/7/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: yellow `#ffb000` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Last updated: 24/7/2026

## Completed

1. Reworked app to shared Arclight visual style.
2. Added structured sidebar flows for presets and MCQ levels.
3. Expanded preset library to 30 conditions.
4. Added preset hint tokens for nuanced disambiguation.
5. Added improved analysis recognition for hinted patterns:
   - pupil-sparing 3rd,
   - partial 6th small/medium,
   - myasthenic,
   - thyroid restrictive,
   - INO-like.
6. Added preset-name flash overlay above eye simulator.
7. Added context modifiers:
   - Sudden,
   - Pain/HA,
   - Trauma,
   - Diplopia,
   - Head tilt,
   - Tired.
8. Added staged refactor parity harness and baseline output files.
9. Refactor split completed:
   - `src/sim-core.js`,
   - `src/preset-runner.js`,
   - `src/analysis-core.js`,
   - `src/mcq-data.js`,
   - `src/state.js`,
   - `src/output-writer.js`,
   - `src/eye-controller.js`,
   - `src/gaze-controller.js`,
   - `src/controls-controller.js`,
   - `src/ui-shell.js`,
   - `script.js` reduced to bootstrap-only.
10. Further split eye runtime into:

- `src/light-controller.js` for torch/RAPD/ambient,
- `src/cover-controller.js` for cover/fixation handover,
- `src/eye-effects-controller.js` for blink/micro/cyclo/nystagmus loops.

11. Added compact ambient light control in the eye card.
12. Swinging-light model updated to:

- brisk side transfer around 0.3-0.8s,
- around 3s stabilisation behaviour,
- mild pupillary escape after longer holds over 4s.

13. Reworked main page hierarchy for 360x740:

- `Gaze`,
- `Dilated`,
- `Baby`,
- `Adv`.

14. Moved advanced details behind `Adv`, including iris colour, pupil size, fade, upper lid, nystagmus and cyclo.
15. Copied Fundal Reflex-style live gaze movement into Squint.
16. Separated live motion from examination gaze:

- `liveGazeOffset` drives visual movement,
- `gazeOffset` drives the momentary trackpad position.

17. Updated output writing so ambient/live motion and normal conjugate trackpad gaze do not cause false RE/LE findings.
18. Shrunk eye-scene cover controls to compact `RE`/`LE` overlays, following the lighter Fundal in-stage control pattern.
19. Fixed logic audit issues:

- RAPD light response now matches RE/LE output labelling,
- Adie's preset injects a diagnostic hint,
- unilateral pinhole pupils are no longer ignored,
- MCQ wording now matches current pupil and cyclo logic,
- gaze track pad snaps back to primary on release.

20. Restored momentary torch behaviour: dragged light pill snaps back to centre and turns off on release.

## Current Quality Snapshot

1. Syntax checks pass across all JS modules.
2. Refactor parity check passes against the refreshed 68-preset baseline.
3. In-app browser check passed for `Gaze` on/off:
   - eyes animate when enabled,
   - gaze pad remains visible,
   - output stays neutral without diagnostic offset,
   - live motion resets when disabled.
4. Refactor parity baseline remains available through `node qa-refactor-check.cjs check`.

## Next Useful Refactors

1. Split remaining `analysis.js` rule/render blocks into smaller modules.
2. Extend the browser review to full MCQ scoring and manual-edit hint clearing when those workflows next change.

# Fleet upgrade — 23 July 2026

Refactor parity and all platform contracts pass. Google Fonts were removed, session reset and offline support were added. The browser-review contract covers MCQ focus return, preset-notice clearance, cover announcements and keyboard controls as well as the established `360 x 740` states.

## Information popup consistency — 23 July 2026

- Added an effective `44 x 44px` information close target.
- Standardised version presentation and updated its contract assertion.
- Preserved eye rendering, presets, cover behaviour and pupil logic.

## Information-card typography and fit — 23 July 2026

- Applied the shared popup type hierarchy.
- Verified a `416.9px` card at `360 x 740` with no internal scrolling.
- Standardised the simple visible `v1` label and `23/7/2026` date in the shared bottom-right footer position.
- Explicitly aligned the visible title to Quicksand `25px/700` and made phoria preset labels upright.

- Verified the final sidebar hierarchy and keyboard focus lifecycle at `360 x 740`.
- Reduced repetitive MCQ retries by sampling the existing Primary and Intermediate pools. Standardised labels and hardened Cup unlocking without changing question content.

## Maintenance refactor — 26 July 2026

- Removed the 500 ms analysis polling loop.
- Reduced layout refresh to one animation-frame update.
- Removed confirmed orphan simulator CSS.
- Passed contracts, refactor parity and the 68-condition audit.

## MCQ quality — 26 July 2026

- [x] Audited all 47 authored questions and added stable IDs, rationales, sources and review states.
- [x] Clarified `squint-primary-01` while retaining its stable ID and source.
- [x] Added an atomic unanswered guard, first-gap focus, explanations, source display and retry.
- [x] Passed contracts, refactor parity and the 68-condition audit.
- [x] Removed repeated content at Intermediate 11 and Advanced 22, corrected Primary 10 source routing and added retry scroll reset.
- [x] Passed the isolated HTTP MCQ path at temporary `360 x 740` with screenshots, 44px rows, no horizontal overflow and no browser errors.
- [ ] Independent clinical sign-off, physical-device review and installed offline review.

# 29 September 2026 — condition audit fixes

Implemented the eight reviewed source corrections, plus output refresh and queued-callback invalidation for reset. Existing 68-preset audits and mobile UI checks remain part of acceptance. Added a focused browser regression for actual nystagmus fast-phase sign, both cover sides, covered-eye torch drive, consensual response, near restriction, vertical phoria, reversible Dilated state and delayed reset. The audit report records final evidence separately. Clinical sign-off and physical-device testing remain pending.
