# Progress

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Runtime source retained. Separate scoring, shell, progression and PWA scripts remain intentional. Mobile Lighthouse performance: 96 → 96/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Independent input/results columns on wider screens; mobile sequence and assessment logic retained.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

- [x] 25 July 2026: separated the untouched Result heading and guidance, repaired the browser review and advanced the scoped cache to `20260725-unassessed1`.

- [x] Fleet edge follow-up: calculator and result shells use `10px` margins and `340px` width.

## 23 July 2026

- [x] Pure scoring module and boundary tests
- [x] Restored locked stylelint tooling
- [x] Local fonts and scoped offline shell
- [x] Confirmed case reset and accessibility state
- [x] Exact `360 x 740` browser-review harness
- [ ] Independent clinical sign-off
- [ ] Physical-device and installed offline checks

<!-- APP-DOC-STATUS:START -->

## Historical Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: black `#000000` on a red appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

## Completed — earlier UI snapshot (current shell uses black with red controls)

- Built and maintained static OTS-style calculator flow.
- Added dynamic score/category/outcome rendering.
- Added collapsible "Calculation" section for transparency.
- Refined mobile layout and spacing for 360x740 use.
- Separated Presenting VA and Risk Factors into distinct UI sections.
- Added tiered MCQ modal flow:
  - Primary
  - Intermediate
  - Advanced
  - level-specific content complexity and pass marks
- Added result utilities:
  - copy summary
  - export summary text file
- Added repository documentation (`README.md`).
- Added structured memory-bank documentation files.
- Copied the Fundal Reflex UI lessons into the Trauma app while preserving the Trauma identity:
  - red app bar with black Quicksand title
  - compact mobile-first clinical layout
  - off-white panels with blue-grey borders
  - light side menu with small level dots for MCQs
  - compact info popup with basics first
  - softer panel hierarchy with tighter nested MCQ options
- Replaced visible dynamic HTML string rendering with DOM/text rendering for MCQs, result summary, outcome table and calculation details.
- MCQ answer options now shuffle while preserving the correct answer.
- Reworked MCQ sections to better match the Fundal app:
  - side-menu MCQ rows include small level metadata
  - modal uses contained scrolling and Fundal-style question cards
  - option rows are tighter nested targets with hover states
  - result feedback is boxed and level pass marks are absolute counts
  - banks expanded to Primary 10, Intermediate 13 and Advanced 14

## Historical Next Candidates — superseded by July and September updates

- Optional: add explicit reset button for form state.
- Optional: lock MCQ level progression (unlock next tier after pass).
- Optional: persist MCQ best scores/progress in localStorage.
- Optional: add lightweight smoke tests (manual checklist or scripted checks).
- Optional: move inline index modal/sidebar script into `script.js` for single-controller architecture.

## Information popup consistency — 23 July 2026

- Grouped the existing guide wording under Purpose, Use and Reference without changing its clinical statements.
- Added an effective `44 x 44px` close target and standardised version presentation.
- Preserved Ocular Trauma Score calculations and outcome tables.

## Information-card typography and fit — 23 July 2026

- Applied the shared popup type hierarchy.
- Verified a `394.1px` card at `360 x 740` with no internal scrolling.
- Standardised the simple visible `v1` label and `23/7/2026` date in the shared bottom-right footer position.
- Made operational guidance, scope notes and calculation rows upright for faster scanning.

## Main-page typography review — 23 July 2026

- Equalised Presenting VA and Risk Factors headings at `15px`.
- Preserved all OTS-style calculations and output behaviour.
- The full app tests and `360 x 740` browser check passed.

- Standardised the sidebar hierarchy and corrected Escape focus return to the menu trigger.
- Standardised MCQ level labels and hardened Cup unlocking without changing questions, pass marks or OTS-style calculations.

## Maintenance refactor — 26 July 2026

- Extracted the inline shell lifecycle into a cached local classic script.
- Removed selectors proven unused by the current markup and scripts.
- Added shell ownership and offline-cache contracts.
- Passed syntax, scoring, contract and full lint checks.

## Presenting-VA prompt — 26 July 2026

- [x] Removed repeated `Presenting VA` wording from the dropdown.
- [x] Shortened untouched-result guidance.
- [x] Added wording contracts while preserving the MCQ bank and scoring engine.

## MCQ quality — 26 July 2026

- [x] Audited all 37 authored questions and added stable IDs, rationales, sources and review states.
- [x] Replaced the information-screen mechanics prompt with the presenting-VA prerequisite.
- [x] Added unanswered focus, full response review, source display and retry.
- [x] Passed syntax check, tests and the complete lint suite.
- [x] Passed the isolated HTTP MCQ path at temporary `360 x 740` with screenshots, 44px rows, no horizontal overflow and no browser errors.
- [ ] Independent clinical sign-off, physical-device review and installed offline review.
