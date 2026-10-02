# Active Context

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

## Fleet repair receipt — 30 September 2026

Corrected the stylesheet/cache release contract. The existing September clinical engine was not changed. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

29 September 2026: five approved logic corrections supersede earlier progressive-lock and Dense auto-overwrite behaviour. Preserve observed findings when history becomes incomplete. Urgent partial assessments show advice without a cataract diagnosis. Dense only defaults a blank back entry; do not lock or erase posterior findings. Protect pupil/RAPD notes from the compact cap. Fix+ is not a measured acuity deficit. Non-white cataract with 6/6 is not automatically inconsistent. Evidence: `../LOGIC_REVIEW_20260929.md`.

Safety refinement, 26 July 2026: compact `— / No / Yes` safety controls, required age, eye-specific VA wording and cautious urgency and white-reflex routing are implemented without changing the approved layout.

<!-- APP-DOC-STATUS:START -->

## Historical Memory Status (26/7/2026)

- Release: `v1.1`; focused assessment-state and safety pass completed 26 July 2026.
- Static packaging: open `index.html` directly for basic use, or use HTTP/HTTPS for installable offline support.
- Mobile target: `360 x 740`, with one document scroll and no internal card scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: orange `#ff8a00` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
- Two-step `New assessment` reset clears case state and preserves MCQ achievements.
- Allan-informed presentation conventions are applied while retaining Cataract orange: `14px` outer panels, `10px` inner groups and `8px` controls.
- Independent clinical sign-off and physical-device acceptance remain pending.
<!-- APP-DOC-STATUS:END -->

Last updated: 30/9/2026

## v1.1 Fleet Upgrade

- Preserved the existing one-page layout and every clinical decision rule.
- Completed a second visual-system pass covering radii, border hierarchy, compact font sizes, explicit neutral markers and plain operational labels.
- Verified that the original single-line Eyes, Pain/Redness and Age arrangement does not overlap from `360 x 740` through `566 x 1280`.
- Added the assessment reset to the existing drawer rather than changing the main workflow.
- Made long-press image previews persistent with a visible close action and Escape support.
- Added focus entry and return for transient interfaces.
- Added an app-scoped manifest and service worker with an `arclight-cataract-` cache prefix.
- Added `tests/app-contract.test.mjs` and included it in `npm test`.
- Added clinical-review, device-test and evidence-receipt documents.
- Fresh `360 x 740` browser verification passed with zero console errors, including offline reload.

## Current Focus

Keep the Cataract app one-page, mobile-fast, and clinically robust with deterministic audited logic.

## Confirmed Current State

- Active repo: `C:\Users\William\Desktop\Arclight App\Cataract`
- One-page UI preserved.
- Entry and modules preserved:
  - `script.js` -> `src/app.js`
  - clinical logic in `src/cataract-engine.js`
  - UI wiring in `src/cataract-controller.js`
- Required context for a completed assessment:
  - onset selected
  - eyes selected (1/2)
  - an age band selected; the interface no longer offers `Unk`
  - affected-eye or worse-eye VA selected
- Assessment access (September rules):
  - Fundal is available before history and VA are complete
  - Back unlocks after Fundal selection
  - Dense defaults a blank Back entry to `poor view`; existing findings remain editable and are preserved
  - Urgent partial assessments can show advice without a cataract diagnosis
  - Completed assessments use the full decision output
- Locking now uses:
  - visual dim state
  - `aria-disabled`
  - real `disabled` controls in locked sections
- Top radios are clearable (click selected again).

## Recent Clinical/Logic Changes

- Blank pain, pupil, front-eye and RAPD/light-response controls remain unassessed.
- Any sudden visual loss now routes to same-day assessment.
- White reflex is an observed sign unless a complete adult pattern supports `Probable Mature`.
- Paediatric white reflex routes to urgent paediatric review.
- Detached retina stays same-day while a possible coexisting cataract phenotype remains visible.
- Added distance/near anomaly checks:
  - good distance + poor near (non-presbyopic) -> recheck warning
  - poor distance + good near -> recheck warning
- Added `near` to recheck highlight targeting.
- Kept existing contradiction checks for:
  - dense reflex + relatively good distance VA
  - abnormal reflex + 6/6
  - fix/follow with non-child age
- Check-note dedup remains active to reduce repetition.
- Result-output audit now enumerates complete UI-feasible combinations and checks visible `Cataract Type`, `Next Step` and `Check` text.

## Historical Validation Snapshot — July 2026

Recorded `npm test` (2026-07-26):

- App contracts: `13/13` passing
- Acceptance: `30/30` passing
- Combination audit: no findings
- Result-output audit:
  - complete UI combinations `516,096`
  - unique visible Result panels `2,828`
  - findings `P0=0, P1=0, P2=0, P3=0`
- Full-state audit:
  - total states `7,558,272`
  - complete states `1,843,200`
  - complete+reachable `1,548,288`
  - findings `P0=0, P1=0, P2=0, P3=0`
- LMIC content audit: PASS

## MCQ consistency status — 23 July 2026

Question options now shuffle with correct-answer remapping. Visible levels use Primary, Intermediate and Advanced with a 12px level-button radius. Cup unlocking requires an explicit Advanced pass. Cataract clinical rules, referral wording and thresholds remain unchanged.

## MCQ quality status — 26 July 2026

- White-reflex questions now distinguish an abnormal finding from proof of mature cataract and state that posterior disease cannot be excluded.
- Three low-value app or presentation questions were replaced with assessment, safe-recording and urgent-wording questions.
- All 36 questions have stable IDs, concise explanations and declared source status.
- Pool sizes, attempt sizes, 4/5 pass marks, timers and progressive unlocking are retained.
- Retry and new-attempt actions are real, unanswered timed attempts cannot pass and Escape returns focus to the visible menu button.
- `13/13` contracts, bundle parity and the complete clinical audit set pass. An isolated `360 x 740` browser check has no overflow or console messages.

## Current narrow-width status — 26 July 2026

The History panel now fits the real `360 x 740` target, including the `345px` usable width left by a visible desktop scrollbar, without reducing the fleet type scale or moving controls to new rows. Use compact `Eyes`, `Pain/red` and `Age` labels and `Worse VA` as the two-eye acuity label. Keep the longer onset timing in accessible names and show the parenthetical visual hints only above `380px`.

## Current refactor status — 26 July 2026

Pinned build and non-writing bundle parity checks are active. Cache identity and the runtime bundle query share a tested release value. The verified unused `getConsistencyWarningText` export was removed. The rebuilt bundle passed contracts and the complete clinical audit set. No clinical decision, label, layout or accent colour changed.
