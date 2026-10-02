# Cataract

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Production bundle minified from its canonical source. Release, HTML and service-worker versions remain aligned. Shipped JavaScript: 98,386 → 51,781 bytes. Mobile Lighthouse performance: 95 → 95/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Clinical follow-up — 30 September 2026

Incomplete core inputs now retain independently recorded safety findings while the result remains `Not assessed`. Missing safety checks qualify a cataract phenotype as `Possible`. Existing urgent precedence and referral timings are preserved. Fresh checks: 21 contract/regression tests, 30 acceptance cases, exact rebuilt-bundle parity and the full 3,110,400-case combination audit pass. HTTP and direct-file mobile checks pass with no captured runtime errors or horizontal overflow.

See [the repair receipt](../CLINICAL_LOGIC_FIXES_20260930.md). Independent clinical sign-off and physical-device acceptance remain pending. Earlier preservation statements refer to their dated work, not this authorised follow-up.

## Current fleet UI refinement receipt — 30 September 2026

Quiz/result styling aligned; release and service-worker asset versions synchronised.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Fleet repair receipt — 30 September 2026

Corrected the stylesheet/cache release contract. The existing September clinical engine was not changed. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## Logic corrections — 29 September 2026

Urgent advice now survives incomplete history or VA without claiming a completed assessment. Fundal observations can be entered before history is complete. Dense reflex defaults an empty back-of-eye entry to Poor view but preserves existing findings and leaves the choices editable. Pupil and afferent warnings precede secondary notes. Good fixation alone does not establish reduced acuity or amblyopia risk. A non-white cataract pattern with 6/6 no longer automatically produces a mismatch warning.

Release `20260929-logic1` rebuilds the bundle from source and refreshes the app-scoped offline cache. See `LOGIC_REVIEW_20260929.md` for evidence and limitations. Development dependencies under `node_modules` are not required for integration or runtime.

Safety and wording refinement, 26 July 2026: the compact History layout is retained while blank safety checks are now explicit, sudden visual loss is same-day and white-reflex wording is more cautious.

<!-- APP-DOC-STATUS:START -->

## Historical UI snapshot (26/7/2026)

- Release: `v1.1`; focused safety refinement completed 26 July 2026.
- Static packaging: open `index.html` directly for basic use, or use HTTP/HTTPS for installable offline support.
- Mobile target: `360 x 740`, using one document scroll with no internal card scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: orange `#ff8a00` on a black appbar.
- Visual hierarchy: `14px` outer panels, `10px` inner groups and `8px` controls, with plain operational labels and restrained inner borders.
- Favicon: current black-square app favicon with the app letter or letters centred.
- Assessment reset: drawer action uses `New assessment` then `Clear assessment?` and does not clear learning achievements.
- Offline: app-scoped manifest and service worker cache the complete runtime shell and local images.
- Clinical status: independent sign-off pending; not approved for unsupervised clinical deployment.
- Physical-device status: pending.
- MCQ quality: three 12-question banks retain five-question attempts and 4/5 pass marks; every question now has an ID, explanation and source status. Independent clinical sign-off remains pending.
<!-- APP-DOC-STATUS:END -->

Last updated: 30/9/2026

Browser-based, one-page cataract triage support app for fast mobile use.

## App Structure

- `index.html`: one-page UI.
- `style.css`: app styling.
- `script.js`: module entrypoint.
- `src/app.js`: app bootstrap.
- `src/cataract-engine.js`: pure decision logic.
- `src/cataract-controller.js`: DOM wiring and rendering.
- `src/mcq-controller.js`, `src/mcq-engine.js`, `src/mcq-data.js`: 3-level MCQ system.
- `src/info-popup-controller.js`: info popup behavior.
- `src/image-preview-controller.js`: long-press image enlargement.
- `src/storage-utils.js`, `src/dom-utils.js`: shared helpers.
- `qa-cataract-acceptance.mjs`: scenario acceptance + invariance checks.
- `qa-cataract-combination-audit.mjs`: exhaustive reachable-combo audit.
- `qa-cataract-result-output-audit.mjs`: visible Result text audit across UI-feasible combinations.
- `qa-cataract-full-audit.mjs`: exhaustive full cartesian audit.
- `qa-cataract-lmic-content.mjs`: LMIC language/content guardrails.
- Audit report `.txt` files are generated on demand and are not kept in the handover folder.
- `manifest.webmanifest`, `service-worker.js`, `pwa-register.js`: installable offline app shell.
- `tests/app-contract.test.mjs`: runtime, accessibility, reset and offline contracts.
- `CLINICAL_REVIEW.md`: source-traceability and independent sign-off record.
- `DEVICE-TEST-CHECKLIST.md`: physical-device acceptance checklist.
- `CATARACT_V1.1_EVIDENCE_RECEIPT.md`: implementation and verification receipt.

## v1.1 Upgrade Gap Review

Resolved in this release:

- preserved the existing working `360 x 740` layout rather than redesigning it
- rationalised panel and control radii without moving the assessment workflow
- increased the smallest mobile labels and removed unnecessary operational italics
- added visible neutral markers to blank age and acuity selectors
- made the complete onset and eye radio labels clickable
- preserved the original single-line Eyes, Pain/Redness and Age arrangement with narrow-width spacing that prevents collisions
- reduced nested-border contrast while preserving the three History groups
- added deliberate clearing for case-specific assessment state
- made enlarged images persistent and explicitly closeable
- strengthened focus handling for the quick guide and MCQ modal
- added a local manifest, app-scoped service worker and offline reload support
- added runtime and asset contracts
- recorded clinical and physical-device gates explicitly
- replaced positive-only safety toggles with compact `— / No / Yes` controls
- made age required and removed the `Unknown` choice so the closest age band must be selected
- changed distance VA wording to affected-eye or worse-eye VA according to the eye count
- made every sudden visual-loss pathway same-day, including painless loss
- separated observed white reflex from probable mature cataract
- retained a possible cataract phenotype when posterior disease may coexist

Still intentionally unchanged:

- the September assessment access rules described below
- MCQ level progression, pool sizes, attempt sizes, pass marks and timers
- current orange accent and one-page structure
- fundal and back-of-eye image choices

Remaining external gates:

- authoritative source pack and named clinical-owner review
- independent clinical sign-off
- physical low-memory, installed-app, screen-reader and large-font acceptance

## Current Clinical Flow

- One-page, mobile-first flow.
- History captures:
  - onset (`gradual` / `sudden`)
  - eyes (`1` / `2`)
  - pain/redness (`—` / `No` / `Yes`)
  - required estimated age group
  - affected-eye VA for one eye or worse-eye VA for two eyes
  - optional Near VA
- BCVA options include:
  - `HM`
  - `Unable`
  - `Fix+`
  - `Fix-`
- Exam checks use compact `— / No / Yes` controls:
  - pupils abnormal
  - front-eye scar/distortion
  - RAPD / poor light response
- Assessment access:
  - Fundal observations can be entered before history or VA is complete
  - Back unlocks after a Fundal selection
  - `Dense`/white defaults an empty Back entry to `Poor view`, preserves an existing finding and leaves the choices editable
  - Result displays when the engine has actionable output; urgent advice can appear before assessment completion without labelling it complete
- Result block is concise:
  - `Cataract Type`
  - `Next Step`
  - `Check` (up to 3 notes)
- Top radio options are clearable (click selected again to deselect).

## Decision Logic Summary

- Phenotype-first mapping:
  - `normal` -> Nil
  - `dark` -> Nuclear
  - `patches` -> Cortical
  - `spots` -> Subcapsular
  - `white` -> White reflex
- A complete gradual, severe-VA, non-paediatric pattern with recorded normal safety checks can be labelled `Probable Mature`.
- Display confidence is layered onto phenotype (definite/probable/possible) without losing underlying phenotype.
- Posterior override precedence:
  - `detached` -> red same-day retinal assessment
  - `cupping` / `diabetic` -> orange posterior-first baseline (can escalate)
  - a compatible cataract phenotype remains visible as `Possible` rather than being erased
- Urgency and safety:
  - any sudden visual loss -> red same-day assessment
  - gradual painful unilateral baseline is not auto-red without extra red triggers
  - paediatric white reflex -> urgent paediatric eye review
  - adult white reflex remains cautious unless the full probable-mature pattern is present
- Neuro and competing-pathology behavior:
  - RAPD / poor light direction can route to non-cataract-first pathway
  - abnormal reflex + non-cataract-first pathway uses competing-pathology cataract confidence wording
- Assessment completeness:
  - required inputs: onset, eyes, age, eye VA, fundal and back
  - blank pain, pupil, front-eye or afferent checks remain unassessed
  - non-urgent outputs request completion of missing safety checks
  - recheck highlighting is used for contradictory patterns and selected consistency checks
- Distance/Near mismatch checks:
  - good distance + poor near (non-presbyopic age bands) -> re-check
  - poor distance + good near -> re-check
- Note policy:
  - black: 0
  - green: <=2
  - orange: <=3
  - red: <=3 (near-VA notes suppressed)

## Automated Audits

Commands:

- `npm run audit`
- `node qa-cataract-acceptance.mjs`
- `node qa-cataract-combination-audit.mjs`
- `node qa-cataract-result-output-audit.mjs`
- `node qa-cataract-full-audit.mjs`
- `node qa-cataract-lmic-content.mjs`

Latest run (`2026-07-26`):

- App contract tests: `13/13` passing
- Acceptance audit: `30/30` passing
- Reachable-state audit: no findings
- Result-output audit:
  - complete UI combinations `516,096`
  - unique visible Result panels `2,828`
  - findings `P0=0, P1=0, P2=0, P3=0`
- Full-state audit:
  - total `7,558,272`
  - complete `1,843,200`
  - complete + reachable `1,548,288`
  - findings `P0=0, P1=0, P2=0, P3=0`
- LMIC content audit: PASS

## Run Locally

- `python -m http.server 8080`
- open `http://127.0.0.1:8080`

The service worker registers only over HTTP or HTTPS. Directly opening `index.html` remains available for basic static use but does not provide installable offline behaviour.

## Verification

- Full automated verification: `npm test`
- Contracts only: `npm run test:contracts`
- Clinical logic and output audits: `npm run audit`
- Browser evidence: `output/playwright/`
- Target viewport: `360 x 740`

## Information popup consistency — 23 July 2026

The anchored Quick Guide is explicitly identified as non-modal, retains its native `44 x 44px` close control and uses the shared `version · date` presentation.

## Information-card typography and fit — 23 July 2026

The guide now uses the fleet scale of `14px` title, `12.5px` body, `11px` section labels and `10.5px` version text. It measured `525.2px` at `360 x 740` and required no internal scrolling. Its simple visible `v1` label and current `23/7/2026` date now occupy the shared bottom-right footer position.

## Sidebar consistency — 23 July 2026

The orange identity and existing menu actions are unchanged. The drawer uses the fleet `14px` title, `11px` section-label and `12.5px` supporting-copy roles where present. Opening now moves focus inside and Escape closes the drawer and returns focus to its trigger at `360 x 740`.

## MCQ consistency — 23 July 2026

Question and answer order now vary safely while preserving the authored correct answer. Level controls use the shared labels and 12px radius. Cup unlocking now requires an explicit Advanced pass.

## MCQ clinical-quality pass — 26 July 2026

- Replaced white-reflex wording that overclaimed mature cataract with cautious interpretation and posterior-disease limitations.
- Replaced two app-mechanics questions and one presentation question with clinically useful assessment, recording and urgent-wording questions.
- Added stable question IDs, concise explanations and declared source status across all three banks.
- Preserved 12 questions per level, five-question attempts, 4/5 pass marks, progressive unlocks and timers.
- Added real `Try again` and `New attempt` actions. Timed attempts with unanswered questions cannot pass.
- Aligned the modal to 44px answer rows, visible result placement and the compact fleet hierarchy.
- Verified unanswered, failed, explanation, retry and Escape paths at `360 x 740`, with no horizontal overflow or console messages. Escape returns focus to `Open menu`.

## 360 × 740 History fit — 26 July 2026

The approved single-line History layout is retained. At the target width, the parenthetical onset hints are visually suppressed while their full accessible names remain available. The Eyes, Pain/red and Age tracks use compact labels and flexible minimums that remain collision-free when a visible desktop scrollbar reduces the usable content width from `360px` to `345px`. The complete age band remains visible and the two-eye acuity label is shortened to `Worse VA`.

## Younger-adult cause prompt — 26 July 2026

The vague `Check secondary causes` note is replaced with `Ask about trauma, steroids, diabetes and eye inflammation.` The existing younger-adult trigger and referral logic are unchanged.

## Reproducible bundle and cache contract — 26 July 2026

The source bundle is now built with pinned esbuild `0.25.5`:

```powershell
npm run build
npm run build:check
```

`build:check` generates the bundle in memory and fails if `app.bundle.js` differs. The service-worker cache identity shares the runtime bundle release identifier and a contract verifies that it matches the query in `index.html`. One unused copy accessor was removed. Clinical rules, wording, layout and visible version are unchanged. Independent clinical sign-off and physical-device acceptance remain pending.

## Information purpose pass — 27 July 2026

The existing `i` panel now explains that the user records history, VA, safety findings, fundal reflex and back-of-eye appearance from the examination. It states that the app suggests a cataract pattern and next step but does not make a final diagnosis. The generated bundle was rebuilt and its cache token aligned. Clinical logic and the main layout were not changed. The open panel passed the shared non-scrolling `360 x 740` review.

## Fleet UI alignment — 28 September 2026

The information card now uses a `16px` radius and a measured `44 x 44px` close target. Comparable main section headings use the fleet `15px/700/1.2` role. Clean Chromium checks at `360 x 740` found no overflow, no information-card scrolling, correct Escape focus return and no console errors. Cataract logic is unchanged. Physical-device acceptance and independent clinical sign-off remain pending.
