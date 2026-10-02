# Cataract v1.1 Evidence Receipt

Safety refinement, 26 July 2026: the compact one-page layout is preserved while assessment state, urgency and white-reflex handling are safer and more explicit.

**Target app:** Cataract  
**Version:** 1.1  
**Date:** 26 July 2026  
**User review:** The restored compact History arrangement remains the approved visual baseline.

## Implemented

- Preserved the existing one-page `360 x 740` layout and orange Arclight identity.
- Applied Allan's reusable visual-system ideas without copying its purple accent or dermatology content: consistent radius hierarchy, calmer nested borders, readable compact type and plain operational labels.
- Added compact `— / No / Yes` controls for pain/redness, pupil, front-eye and RAPD/light-response state.
- Required the closest estimated age band and removed the visible `Unknown` choice.
- Relabelled distance VA as affected-eye or worse-eye VA according to the selected eye count.
- Routed every sudden visual-loss state to same-day assessment, including painless loss.
- Separated observed white reflex from probable mature cataract and added urgent paediatric white-reflex wording.
- Preserved possible coexisting cataract wording when posterior disease is selected.
- Replaced the younger-adult `Check secondary causes` note with the operational prompt `Ask about trauma, steroids, diabetes and eye inflammation.`
- Renamed the deliberate untestable-VA choice from `No test` to `Unable`; the required blank state and engine routing are unchanged.
- Kept result actions short and retained the existing layout, colour and image choices.
- Added a deliberate two-step assessment reset in the existing drawer.
- Added focus entry, Escape dismissal and focus return for the quick guide, MCQ dialog and enlarged image.
- Changed long-press image enlargement from momentary to persistent with a visible close button.
- Added a local manifest, app-scoped service worker and offline registration.
- Added static app contracts for runtime locality, IDs, ARIA targets, reset, manifest and cache assets.
- Added clinical-review and constrained-device records.
- Updated README and memory-bank continuity documentation.
- Corrected over-specific white-reflex MCQ wording, replaced low-value app-mechanics questions and added IDs, explanations and source status across all 36 questions.
- Added actionable retry/new-attempt behaviour, 44px MCQ rows, visible result placement and reliable focus return to the app-bar menu button.

## Preserved Rather Than Changed

- progressive section unlocking
- fundal and back-of-eye choices
- MCQ progression, pool sizes, attempt sizes, pass marks and timers
- compact one-page layout

## Automated Checks

- `npm test`
  - app contracts: `13/13` passed
  - acceptance audit: `30/30` passed
  - combination audit: no findings
  - result-output audit: `516,096` complete UI combinations, `2,828` unique panels and no P0-P3 findings
  - full-state audit: `7,558,272` states and no P0-P3 findings
  - LMIC content audit: passed
- Updated source files passed `node --check` before bundling.

## Mobile Browser Checks

- Viewport: `360 x 740`
- Browser: Playwright Chromium CLI
- Initial incomplete state: passed
- Initial visual hierarchy: no overlap or horizontal overflow; neutral controls and labels visible
- Eyes, Pain/Redness and Age group: original single-line arrangement retained; rendered bounds checked from `360 x 740` through `566 x 1280` with no intersections or page-level horizontal overflow
- Missing-safety-check result: `Complete missing checks` with named fields and no invented normal state
- Adult dense-reflex pattern: `Probable Mature` only when the complete typical pattern is present
- Sudden painless loss: red same-day assessment
- Child dense reflex: `White reflex` with urgent paediatric eye review
- Detached retina with an abnormal reflex: same-day retinal assessment while preserving `Possible` cataract phenotype
- Completed-state visual hierarchy: passed after a fresh capture; output remained readable within the viewport
- Drawer layout and action hierarchy: passed
- Two-step assessment reset: passed
- Persistent enlarged image and Escape close: passed
- Quick-guide focus entry: passed
- MCQ dialog role, focus entry and Escape close: passed
- MCQ unanswered guard, failed-attempt explanations and real `Try again` fresh attempt: passed
- MCQ document width: `360px`; horizontal overflow: none
- MCQ console errors and warnings: `0`
- MCQ screenshot: `output/playwright/mcq-primary-review-360x740.png`
- Offline controlled reload: passed
- Console errors: `0`
- Direct-file automation: the current browser harness blocks `file://` navigation. Basic direct-file support remains packaged through the classic IIFE bundle but was not re-run in this safety pass.
- Scrollbar-inclusive History fit (`26 July 2026`): the earlier hidden-scrollbar capture was insufficient and was superseded. At `345px` usable content width, representing a `360px` retained toolbar with the visible desktop scrollbar, document `scrollWidth=345`, the Pain control ended at `217.39px`, the Age label began at `228px` and the Age control ended at `314.11px` inside the `317px` row edge. Evidence: `output/playwright/cataract-history-effective345x740.png`.

Earlier visual captures remain beneath `output/playwright/baseline/`, `output/playwright/upgraded/` and `output/playwright/polish/`. The 26 July safety pass is recorded in the generated audit reports and this receipt.

## Clinical Review

- The focused safety changes were regression-audited but have not received independent clinical approval.
- Source traceability: adult and childhood cataract sources recorded for MCQ terminology; full operational source pack pending
- Independent sign-off: pending
- Deployment status: not approved for unsupervised clinical deployment

## Physical-device Acceptance

- Status: pending
- Evidence: none supplied

## Remaining Risks and Gates

- Authoritative sources and named clinical-owner approval are not recorded.
- Physical low-memory, installed-app, screen-reader and large-system-font checks remain pending.
- A fresh manual direct-file smoke check remains desirable because the automated harness blocks the `file://` protocol.
- The SVG manifest icon works as a local install asset but platform-specific PNG install icons may improve compatibility later.
