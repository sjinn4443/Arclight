# Arclight fleet repair receipt — 30 September 2026

## Outcome

Confirmed UI, packaging, test and documentation defects from [the baseline review](FLEET_REVIEW_2026-09-30.md) have been repaired. The baseline report and its evidence are preserved. This work does not change clinical decisions, calculation thresholds, simulator behaviour, authored MCQ answers, pass marks or progression. Refract prescribing logic, original cases and the approved flowchart are untouched.

## Repairs

- **Discs:** inactive information-panel Escape handling no longer overrides drawer focus restoration.
- **Fundal Reflex:** teaching panels and MCQs return focus to the visible menu trigger. Backdrop closure uses the same restoration path. Incomplete quiz submission focuses the first unanswered question.
- **Glaucoma:** incomplete quiz submission focuses the first unanswered question.
- **Swollen Discs:** quiz focus entry is deferred until drawer closure has finished. Its integration test now exercises that ordering with the animation-frame lifecycle.
- **Refract:** the quiz fits the mobile viewport before and after marking. Questions scroll within the panel while the header, result and actions remain visible. Focus entry survives drawer closure. The MCQ controller is built separately as a classic local bundle so direct-file use no longer depends on an ES module.
- **Fields:** repaired the undefined option index in the pathway question builder. Added regression checks for labelled distinct options and the authored answer across all three pathway tiers. Restored the locked local development toolchain; the pinned lint command passes without suppressions.
- **Direct-file fonts:** removed failing preload tags from Diabetic, Discs, Fundal Reflex, Glaucoma, Mires, Refract, Sauron, Squint and Trauma. Local CSS font loading remains intact and both font families were verified as loaded in all nine apps.
- **Release contracts:** corrected Cataract's stylesheet/cache version contract and stale Squint and Glaucoma footer assertions. Rebuilt affected bundles from source and updated app-scoped asset/cache identities where required.
- **Documentation:** updated the twelve changed apps' READMEs and active-context records. Corrected Cataract's superseded assessment-access description, Trauma's app-bar and rendering description and Discs' stale runtime tokens. Clearly labelled historical snapshots rather than presenting old checks as new evidence. Existing AGENTS.md inheritance remains unchanged.

The changed apps show `v1 · 30/9/2026`. Allan, Amsler and Morph were reviewed but not modified and retain `v1 · 29/9/2026`. Internal package and engine versions are retained.

## Current verification

All browser checks below used isolated Chrome with temporary `360 x 740` emulation. This is not persistent Codex device-toolbar sizing or physical-device acceptance.

| Check                                           | Result                                                                                | Evidence                                                                                          |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Information panels and drawers over HTTP        | 15/15 pass                                                                            | [HTTP receipt](Allan/output/playwright/fleet-fixes-20260930/fleet-http-review.json)               |
| Information panels and drawers via direct file  | 15/15 pass                                                                            | [File receipt](Allan/output/playwright/fleet-fixes-20260930/fleet-file-review.json)               |
| Additional popup routes                         | 55 pass, 12 unavailable, no tested failures                                           | [Popup receipt](Allan/output/playwright/fleet-fixes-20260930/additional-popups.json)              |
| Primary quiz state checks                       | 14/14 pass                                                                            | [Quiz receipt](Allan/output/playwright/fleet-fixes-20260930/mcq-state-review.json)                |
| Scoped automated test commands                  | 24/24 pass                                                                            | [Command receipt](Allan/output/playwright/fleet-fixes-20260930/tests/results.json)                |
| Direct-file local fonts                         | Nine apps load Inter and Quicksand with no captured errors                            | [Focused receipt](Allan/output/playwright/fleet-fixes-20260930/focused-repair-checks.json)        |
| Refract quiz, initial and graded, HTTP and file | Panel `340 x 720`, top `10`, bottom `730`; visible actions and no horizontal overflow | [Graded screenshot](Allan/output/playwright/fleet-fixes-20260930/refract-http-graded-focused.png) |
| App Markdown documentation                      | 139 files checked; no broken local Markdown links                                     | [Documentation receipt](Allan/output/playwright/fleet-fixes-20260930/documentation.json)          |

Reviewed information-panel states include initial purpose copy, available disclosures, footer dates, fit, drawer geometry, focus entry, Escape closure and focus return. Captured runtime/console errors were clean in tested states. Primary quiz checks cover blocked incomplete submission, first-unanswered focus, marking, feedback, fresh retry and closure. They do not exhaust every answer combination or every progression outcome.

## Remaining verification boundaries

- Ten locked quiz-tier routes and two referral controls unavailable in the untouched state still require completed-state review. They are exclusions, not passes.
- These browser runs blocked service workers. They do not prove fresh installation, cache migration or offline reload. Service workers do not run on `file://`.
- Independent clinical sign-off, physical-device acceptance and an updated dependency-security audit remain separate work.
- No new clinical-accuracy or prescribing benchmark is claimed by UI tests.
- The user's retained draw.io tab was not changed. No Arclight app was handed back in the Codex browser and no persistent mobile-toolbar claim is made.

## Reproduction

From the parent folder, serve the workspace locally on port 8090, then run the existing review harnesses:

```text
node fleet-review-20260930.mjs
node fleet-review-20260930.mjs --file
node fleet-popup-review-20260930.mjs
AUDIT_MCQ_STATES=1 node fleet-popup-review-20260930.mjs
node fleet-test-review-20260930.mjs
node fleet-repair-focused-20260930.mjs
node fleet-doc-review-20260930.mjs
```

For PowerShell, set `$env:AUDIT_MCQ_STATES = '1'` before the quiz-state invocation and remove that variable afterwards. All harnesses write new repair evidence under `Allan/output/playwright/fleet-fixes-20260930/`, leaving the baseline intact.
