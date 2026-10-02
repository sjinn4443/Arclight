# Glaucoma

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Production bundle minified from its canonical source. The approved C/D 0.9–1 END-STAGE black-grid presentation is retained. Shipped JavaScript: 73,470 → 40,799 bytes. Mobile Lighthouse performance: 92 → 96/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Clinical follow-up — 30 September 2026

C/D 0.9–1 still displays `END-STAGE`; the black final grid column, point weights and referral timings are unchanged. Reduced vision or abnormal pupils now retain a separate assessment cue alongside END-STAGE or EMERGENCY rather than replacing either. Fresh tests include 60 end-stage combinations and six concern/urgency cases. Build, lint, tests, exact rebuilt-bundle parity and HTTP/direct-file mobile checks pass with no captured runtime errors or horizontal overflow.

See [the repair receipt](../CLINICAL_LOGIC_FIXES_20260930.md). Independent clinical sign-off and physical-device acceptance remain pending. Earlier preservation statements refer to their dated work, not this authorised follow-up.

## Current fleet UI refinement receipt — 30 September 2026

Upright interface labels; shortened ambiguous labels expanded; marked quiz result appears before the actions.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Fleet repair receipt — 30 September 2026

Blank quiz submission now focuses the first unanswered question. Rebuilt the UI bundle. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## Logic corrections — 29 September 2026

Approved sparse-information safety fixes are recorded in [LOGIC_REVIEW_20260929.md](LOGIC_REVIEW_20260929.md). C/D remains on the chart. Concerning partial findings now give advice, abnormal vision/pupils cannot receive routine reassurance and near-total cupping retains END-STAGE regardless of pressure or disc size. The result and report distinguish supporting points from the C/D chart and explain overrides. An acute-symptom safety boundary is initially visible. Existing tests, 86,400 combinations, new targeted regressions and bundle parity pass. HTTP states reviewed at 360 × 740 with no captured warnings/errors. Clinical sign-off and physical-device/direct-file acceptance remain pending. Later entries below are historical and are superseded where noted by this review.

Maintenance refactor, 26 July 2026: questionnaire changes now take one input snapshot and perform one risk calculation before rendering. Controller contracts protect that single-pass behaviour and the production bundle matches source exactly. The visible information footer remains the shared fleet `v1 · 23/7/2026`; cache `20260726-refactor2` publishes that presentation correction. Clinical thresholds, the approximate LMIC workflow, the `END-STAGE` label and the established one-page layout are unchanged. Full lint, tests and bundle parity pass. Independent clinical sign-off and physical-device acceptance remain pending.

Safety and usability follow-up, 25 July 2026: the app can record the assessed eye when useful, prevents suspicious rim or field findings from producing a routine result and uses non-overlapping IOP bands. A compact report can now be opened and copied after calculation. The one-page layout and green identity are preserved.

<!-- APP-DOC-STATUS:START -->

## Current Status (25/7/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: bright green `#00ff3b` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
- v1.1 adds a confirmed operational reset, local runtime fonts, app-scoped offline support, accessibility contracts and a restrained hierarchy polish.
- IOP bands are `≤20`, `21-24`, `25-29` and `≥30`.
- Thin/notched rim or suspicious fields enforce at least the existing `SOON` result when the grid alone would be white or green.
- End-stage output tells the user to escalate the affected eye and assess the fellow eye.
- `RE` and `LE` are optional context. Selecting `LE` mirrors the disc artwork but leaving the eye unrecorded does not block the intended sparse-information calculation.
- The red `R` Report action is disabled until a result exists. Its accessible modal summarises only entered findings, states missing eye information and supports copying.
- Automated checks and exact `360 x 740` HTTP and direct-file browser reviews pass. Independent clinical sign-off, installed-offline acceptance and physical-device review remain pending.
<!-- APP-DOC-STATUS:END -->

_Last updated: 25/7/2026_

Browser-based glaucoma risk calculator with a one-page UI and staged MCQ learning.

## Current Structure

- `index.html`: single-page UI markup.
- `styles.css`: stylesheet entrypoint that imports modular CSS files.
- `styles/base.css`: tokens + reset + global element defaults.
- `styles/layout.css`: page/grid/layout rules.
- `styles/components.css`: reusable components (popup, modal, menu, icons, etc).
- `styles/responsive.css`: media-query overrides.
- `scripts.js`: app entrypoint.
- `src/risk-engine.js`: pure risk computation + reasoning formatter.
- `src/risk-calculator-controller.js`: questionnaire, ratio/disc selection, grid highlighting.
- `src/report.js`: pure concise report formatter.
- `src/report-controller.js`: report availability, accessible modal and copy behaviour.
- `src/popup-controller.js`: info popup + anchored popup open/close/positioning + config-driven scoring text render.
- `src/mcq-data.js`: MCQ level/question data.
- `src/mcq-engine.js`: pure MCQ evaluation/progress utilities.
- `src/mcq-controller.js`: menu/modal/timer/progression UI logic.
- `tests/*.mjs`: lightweight unit tests for pure engines, report formatting and app contracts.
- `tools/lint.mjs`: syntax lint runner used by `npm run lint`.

## Refactor Completed Today

- Split the old monolithic `scripts.js` into focused modules.
- Removed inline popup scripts/inline click handlers from `index.html`.
- Consolidated popup behavior into a single controller.
- Kept one-page layout while replacing layered CSS overrides with a maintainable modular stylesheet.
- Made the app-bar scoring logic popup list versioned and generated from `src/risk-config.js` constants.
- Added pure-function tests for:
  - risk scoring/mapping outcomes,
  - MCQ scoring/progression helpers.
- Added `package.json` with `type: module` and a test script.
- Added `npm run lint` (syntax checks across all app/test JS files).

## Logic Updates (Feb 25, 2026)

- Pressure input supports both measured IOP and digital palpation (`Normal`, `Firm`, `Rock`).
- If both palpation and measured IOP are selected, measured IOP is used and conflict is recorded in reasoning.
- `Rock` palpation triggers a dedicated emergency acute-glaucoma warning, including when C/D is not selected.
- Invalid pressure values no longer fall through to a normal message; they return an explicit incomplete-input message.
- App-bar info popup now shows a concise numbered scoring summary sourced from `src/risk-config.js` and a visible version label (`v1 - 18/5/2026`).

## UI Guardrails

- Keep the first-page experience usable at `360 x 740`.
- In the completed state, keep the top controls, question card, risk grid, reasoning line and final message visible without a scroll.
- Match the Fundal Reflex visual language where possible: black app bar with bright green title and icons, light clinical drawer, small level dots, soft popups and deliberate radius hierarchy.

## Run Locally

Option 1:

- Open `index.html` in a browser.

Option 2:

- Serve the folder with a static server (recommended):
  - `python -m http.server 8080`
  - open `http://localhost:8080`

## Tests

- `npm test`
- `npm run lint`
- `npm run browser:review`

The test suite covers the risk and MCQ engines, report formatting, HTML/runtime contracts and 86,400 generated risk combinations. The browser review requires an isolated Chrome debugging port and checks untouched, dense, completed, report, emergency, reset and MCQ states at `360 x 740`.

## v1.1 Build And Release

```powershell
npm run build
npm run lint
npm test
```

`app.bundle.js` is generated from `scripts.js` and `src/`; do not edit it independently. `manifest.webmanifest` and `sw.js` provide a Glaucoma-scoped installable shell over HTTP(S). Direct-file use remains supported but service workers do not run on `file://`.

The drawer `New assessment` action requires a second press. It clears patient/examination inputs and outputs while retaining MCQ progress and cup achievement.

## Report

The Report action becomes available only after the calculator has produced an output. It records the available pressure input, C/D ratio, disc size, positive findings, VA, risk factors and current output. Eye laterality is included when selected and is otherwise recorded as `Not recorded`. Reset removes the current report state. The report is triage support rather than a diagnosis and contains no patient identifier fields.

## Safety and interaction follow-up — 25 July 2026

- Added an explicit `RE` or `LE` assessment choice. Ordinary grid results remain incomplete until an eye is selected. The rock-hard palpation emergency remains available without laterality so the warning is never delayed.
- Disc illustrations retain their authored orientation for `RE` and mirror horizontally for `LE`. Before eye selection and after reset they return to the neutral authored orientation. This is a visual teaching cue only and does not affect C/D selection or risk logic.
- Corrected the overlapping `20-24` category to `21-24`.
- Added a referral floor for thin/notched rim or suspicious field findings.
- Replaced the end-stage instruction with `Escalate affected eye and assess fellow eye`.
- Added pressed-state semantics, a live result region, a risk-grid caption and row headers.
- Kept empty result elements out of the untouched layout and retained all content inside the exact `360 x 740` dense state.
- Raised the Primary MCQ pass mark to `3/4`, extended Advanced to `140` seconds and shows the correct answer after submission.

The reproducible device-emulation review is `npm run browser:review` with Chrome running on the port given by `GLAUCOMA_CDP_PORT`. Browser evidence from 25 July 2026 covers untouched, completed, fully dense, guide, reset, safety-state and MCQ review states at an exact CSS viewport of `360 x 740`.

## Information popup consistency — 23 July 2026

The anchored Quick Guide is explicitly non-modal, uses the shared 10px mobile edge gap and has an effective `44 x 44px` close target. Its version line now remains visible below the collapsed scoring explanation and uses the shared separator. Risk calculations and scoring content are unchanged.

## Information-card typography and fit — 23 July 2026

The guide now uses the fleet scale of `14px` title, `12.5px` body, `11px` section labels and `10.5px` version text. The initial card measured `329.2px` and its expanded scoring explanation `425.9px` at `360 x 740`; neither required internal scrolling. Its simple visible `v1` label and current `25/7/2026` date remain in the shared bottom-right footer position in both states.

## Main-page typography review — 23 July 2026

The compact palpation buttons now render at `10.5px`, aligned with the fleet tertiary-control scale. The page remains within the `360px` target width.

## Sidebar consistency — 23 July 2026

The green identity and existing menu actions are unchanged. The drawer uses the fleet `14px` title, `11px` section-label and `12.5px` supporting-copy roles where present, with focus entry, Escape closure and trigger-focus return verified at `360 x 740`.

## MCQ consistency — 23 July 2026

The authored pools support varied retries. Question options are shuffled with correct-answer remapping, level controls use the shared labels and 12px radius and Cup unlocking requires an explicit Advanced pass. The Primary pass mark is `3/4`, the Advanced timer is 140 seconds and submitted sets show the correct answers.

## MCQ quality pass — 26 July 2026

All 38 questions were audited: 10 Primary, 12 Intermediate and 16 Advanced. Attempt sizes remain 4, 5 and 7. Every question now has a stable ID, concise rationale, source key and explicit review status. Review distinguishes the selected wrong answer from the correct answer, explains why, returns focus to the result and provides a real **New set** attempt. Unanswered manual submissions remain blocked safely and timed Advanced expiry records unanswered items as incorrect.

NICE NG81 supports the case-finding roles of Goldmann-type IOP, optic nerve assessment, perimetry, repeat measurement, CCT, gonioscopy and baseline optic-nerve imaging. Interface-operation prompts and repeated combined-risk items were replaced with distinct clinical technique, limitation and structural/functional interpretation questions. One explicit sparse-information LMIC model item remains pending independent sign-off. Final lint, tests, exact bundle parity and isolated `360 x 740` MCQ review pass. The risk engine, thresholds and operational result wording were not changed.

## Information purpose pass — 27 July 2026

The existing `i` panel now explains the intended sparse-information workflow: the user selects the closest disc appearance, IOP or palpation and the observed risk signs. It states that the result is an approximate risk and referral prompt rather than a glaucoma diagnosis. No risk weights, thresholds or result wording changed. The open panel passed the shared non-scrolling `360 x 740` review.

## Lighthouse accessibility remediation - 27 July 2026

The four compact IOP radio inputs now measure `24 x 24px` at `360 x 740`, with their existing labels retained as the larger selectable area. The one-page grid, disc images and risk-calculation workflow are unchanged.

The full app test suite passes. Isolated browser measurement found exact `360 x 740` dimensions, a `360px` document width and no console errors. Lighthouse accessibility improved from `96` to `100`; the other scores remain `94 / 100 / 100`.

## Fleet UI alignment — 28 September 2026

The information card now uses the shared `16px` radius and a measured `44 x 44px` close target. Clean Chromium checks at `360 x 740` found no horizontal overflow, no information-card scrolling, correct Escape focus return and no console errors. Risk-calculation and disc-selection logic are unchanged. Physical-device acceptance and independent clinical sign-off remain pending.
