# Active Context

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

## Fleet repair receipt — 30 September 2026

Blank quiz submission now focuses the first unanswered question. Rebuilt the UI bundle. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## Current logic follow-up — 29 September 2026

Use `LOGIC_REVIEW_20260929.md` as the latest evidence. Preserve C/D on the chart, the LMIC approximate workflow and END-STAGE terminology. Partial concerning findings bypass the complete-grid gate for advice only. Large-disc shifting excludes C/D 0.9–1. End-stage and action coexist. Supporting points are not the chart score. Acute symptoms have a visible safety boundary, not a new questionnaire. Source tests, 86,400 combinations, targeted regressions and parity pass; HTTP review and real toolbar switch-back passed at 360 × 740. Clinical approval, offline, direct-file and physical-device acceptance remain open.

## Final MCQ evidence — 26 July 2026

The 10/12/16 banks now test clinical case-finding, GAT, perimetry, repeat measurement, CCT, gonioscopy, optic-nerve imaging and structural/functional interpretation rather than interface operation. Attempt sizes remain 4/5/7. One explicit sparse-information LMIC model item remains and is marked pending independent sign-off. Lint, source tests, exact bundle parity and the isolated `360 x 740` flow pass.

## Maintenance refactor (26/7/2026)

- Questionnaire changes are handled from one captured input state and one risk calculation.
- Exact source-to-bundle parity and controller contracts protect the change.
- The information footer is aligned with the fleet label `v1 · 23/7/2026`; worker cache `20260726-refactor2` publishes it.
- Risk bands, wording, layout and the sparse-information LMIC purpose are unchanged. Clinical and physical-device gates remain open.

## Safety follow-up (25/7/2026)

- `RE` or `LE` is optional context. Valid pressure plus C/D still calculates without it and rock-hard palpation remains an immediate warning without laterality or C/D.
- The current disc artwork is neutral/`RE`; selecting `LE` mirrors all four C/D illustrations horizontally. Reset restores neutral orientation. This is presentation-only.
- Pressure bands are `≤20`, `21-24`, `25-29` and `≥30`.
- Thin/notched rim or suspicious fields enforce at least the existing `SOON` result when the grid is white or green.
- End-stage output says to escalate the affected eye and assess the fellow eye.
- A compact red `R` Report action sits below the result as the final page action. It is disabled until a result exists, records missing eye information honestly and clears with reset.
- Exact HTTP and direct-file reviews passed with untouched, completed and fully dense states at height 740 in a `360 x 740` viewport. The report modal fits without scrolling and restores trigger focus.
- Build, lint, tests and 86,400 generated risk combinations pass.
- Independent clinical sign-off, installed-offline acceptance, direct-file regression and physical-device testing remain pending.

## v1.1 Update (23/7/2026)

- Preserve the tested risk engine, green identity and one-page workflow.
- Confirmed `New assessment` clears operational state while retaining MCQ achievement.
- Runtime fonts are local and the HTTP(S) route has a Glaucoma-scoped PWA shell.
- Exact 360 x 740 HTTP and direct-file reviews passed for untouched, dense, completed, guide and reset states.
- Independent clinical sign-off and physical-device testing remain pending.

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

## Current Focus

Maintain the exact one-page Glaucoma UI while keeping the scoring logic transparent, explicit and safe under edge cases.

Current UI guardrail: the app should keep the Fundal Reflex visual language and fit the first-page workflow inside a `360 x 740` mobile viewport. The completed-result state must show the top controls, question card, risk grid, reasoning line and final message without requiring a scroll.

## Completed in this refactor

- Broke monolithic `scripts.js` logic into focused modules under `src/`.
- Centralized all popup open/close logic in `src/popup-controller.js`.
- Moved risk scoring to pure `src/risk-engine.js`.
- Moved MCQ scoring/progress helpers to pure `src/mcq-engine.js`.
- Removed inline popup scripts and inline `onclick` handlers from `index.html`.
- Replaced duplicated/overridden CSS layers with a modular stylesheet split:
  - `styles/base.css`,
  - `styles/layout.css`,
  - `styles/components.css`,
  - `styles/responsive.css`.
- Added lightweight tests in `tests/` and `npm test` runner.
- Added `npm run lint` syntax checks via `tools/lint.mjs`.
- Hardened risk logic:
  - `Rock` palpation now has a dedicated emergency warning path.
  - Invalid pressure input returns an incomplete message (no false reassurance).
  - IOP-vs-palpation conflict is explicitly surfaced in reasoning.
- Made app-bar scoring popup logic text config-driven from `src/risk-config.js` with visible version label `v1 - 18/5/2026`.

## Immediate Next Checks

- Manual visual QA on 360x740 viewport.
- Quick interaction QA:
  - popup open/close + X buttons,
  - risk cell highlight + message updates,
  - MCQ unlock progression + timer,
  - emergency warning behavior when `Rock` is selected without C/D.

## MCQ consistency status — 23 July 2026

Primary, Intermediate and Advanced use larger authored retry pools with shuffled questions and answer-remapped options. Level controls use a 12px radius. Cup unlocking requires an explicit Advanced pass. Primary requires `3/4`, Advanced allows 140 seconds and submitted sets show correct answers. Expanded teaching content awaits independent clinical review.

## Maintenance refactor - 26 July 2026

The risk controller now takes one input snapshot and performs one calculation per user change. Risk rules, thresholds and the optional eye-context workflow are unchanged. Full lint, controller, contract, parity and mobile browser checks pass.

## MCQ quality pass — 26 July 2026

The active bank has 38 questions: 10 Primary, 12 Intermediate and 16 Advanced, with attempt sizes 4, 5 and 7. Stable IDs, rationales, source keys and review status are mandatory. NICE NG81 supports general case-finding content. App-specific weights, category boundaries and timescales remain pending independent clinical sign-off. Explanatory marking, timed unanswered fail-safe, New set, result focus and 44px rows are implemented.

## 27 July 2026 - Lighthouse accessibility remediation

- Compact IOP radio inputs now measure `24 x 24px` while retaining their full text labels.
- The `360 x 740` one-page layout remains `360px` wide with no console errors.
- Lighthouse accessibility improved from `96` to `100`.
- The full app test suite passes. Risk weights, thresholds and result wording were not changed.
