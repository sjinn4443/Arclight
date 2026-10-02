# Arclight fleet review — 30 September 2026

## Outcome

Reviewed all 15 apps. The main information cards and their visible dates are consistent with the latest recorded updates. The folder is **not yet fully clean**: there are reproducible keyboard-focus issues, a Refract quiz-layout issue, three failing test jobs and stale documentation sections.

This was a review, not a repair pass. No app source, generated production bundle, clinical logic, flowchart or original case data was changed. The only additions are audit harnesses, evidence and this report, plus the review entry in the fleet matrix.

## Coverage and evidence

- All 15 main information cards were opened at temporary `360 x 740` in isolated Chrome over HTTP and from their direct files. Initial card geometry, footer visibility, date, focus entry, Escape closure and focus return were checked. Every HTTP information-card screenshot was visually inspected.
- Every available information disclosure was opened individually. Expanded cards kept their footer visible and stayed within the viewport. Simultaneous combinations of multiple open disclosures were not exhaustively tested.
- All 15 drawers were opened and checked for geometry, horizontal overflow, focus entry, Escape closure and focus return.
- A further 67 popup jobs covered quiz tiers, image/case panels, teaching guides and selected reference/report panels: **49 passed, six required review and 12 were unavailable in the untouched state**. Ten unavailable jobs were locked quiz tiers and two were hidden referral controls. These are coverage gaps, not defects.
- A separate submission/retry pass covered the Primary quiz in all 14 apps with quizzes. All 14 blocked blank submissions, showed marked feedback and offered a usable fresh retry with cleared answers. **Ten passed every check; four had the focus/layout findings below.** The sampled first-option attempts do not constitute exhaustive passed/failed/progression checks for every tier.
- **21 of 24 scoped test jobs passed.** These are command jobs, not a percentage of individual tests or a clinical accuracy score. Bundle checks passed where invoked, including Cataract and Squint independently of their other failing tests.
- Scanned **139 app documentation files**: all 15 READMEs, all Markdown files in each app's memory bank and Refract's app-level `AGENTS.md`. No broken local Markdown file links were found. Root `AGENTS.md` was reviewed separately; it applies to the other apps through inheritance.

Evidence directory: `Allan/output/playwright/fleet-review-20260930/`.

| App           | Information date | HTTP information/drawer   | Primary quiz             | Test jobs                                     |
| ------------- | ---------------- | ------------------------- | ------------------------ | --------------------------------------------- |
| Allan         | 29/9/2026        | Pass                      | Pass                     | Pass                                          |
| Amsler        | 29/9/2026        | Pass                      | Pass                     | Pass                                          |
| Cataract      | 29/9/2026        | Pass                      | Pass                     | Release contract fails; logic and bundle pass |
| Diabetic      | 29/9/2026        | Pass                      | Pass                     | Pass                                          |
| Discs         | 29/9/2026        | Drawer focus return fails | Pass                     | Pass                                          |
| Fields        | 29/9/2026        | Pass                      | Pass                     | Lint fails; contracts pass                    |
| Fundal Reflex | 29/9/2026        | Pass                      | Focus findings           | Pass                                          |
| Glaucoma      | 29/9/2026        | Pass                      | Unanswered focus finding | Pass                                          |
| Mires         | 29/9/2026        | Pass                      | Pass                     | Pass                                          |
| Morph         | 29/9/2026        | Pass                      | Not applicable           | Pass                                          |
| Refract       | 30/9/2026        | Pass                      | Panel exceeds viewport   | Pass                                          |
| Sauron        | 29/9/2026        | Pass                      | Pass                     | Pass                                          |
| Squint        | 29/9/2026        | Pass                      | Pass                     | Stale date assertion fails; parity passes     |
| Swollen Discs | 29/9/2026        | Pass                      | Opening focus finding    | Pass                                          |
| Trauma        | 29/9/2026        | Pass                      | Pass                     | Pass                                          |

All closed information cards fitted without internal scrolling. Captured HTTP console/page-error lists were empty for the reviewed states, including the quiz submission/retry pass.

## Reproducible interface findings

### 1. Discs: Escape restores focus to the wrong trigger

After opening and closing Information, then opening the drawer, Escape closes the drawer but focus returns to the information button rather than the menu button. Both document-level Escape handlers run even when their own surface is already closed, allowing the inactive information handler to overwrite focus restoration.

Source: `Discs/src/ui-shell.js`, drawer handler at lines 56–58 and information handler at lines 92–94. Evidence: `fleet-http-review.json` and `fleet-file-review.json`, Discs `drawer focus returns`.

### 2. Fundal Reflex: quiz/Learn Escape loses usable focus

All three tested quiz tiers and Learn close with Escape but leave focus on the document body. Their saved openers are inside the now-hidden/inert menu. The modal's internal Escape path does not use the close-button wrapper's explicit burger focus fallback.

Sources: `Fundal Reflex/src/modal.js`, `src/menu-mcq.js` and `src/learn-modal.js`. Evidence: four Fundal Reflex failures in `additional-popups.json`; Primary reproduction in `mcq-state-review.json`.

### 3. Fundal Reflex and Glaucoma: blank submission focuses the message

Both correctly block incomplete submission, but focus the result message rather than the first unanswered question. This differs from the fleet MCQ standard. Retrying after a completed attempt works.

Sources: `Fundal Reflex/src/menu-mcq.js:112` and `Glaucoma/src/mcq-controller.js:245`. Evidence: `mcq-state-review.json`, `unanswered focus to first question`.

### 4. Swollen Discs: opening the quiz leaves focus outside

Primary quiz opens visibly but focus remains on `burger-icon` outside the modal. The popup itself fits and its blank-submit and retry paths work. Opening focus still needs correction and a regression test against the shipped module lifecycle.

Sources: `Swollen Discs/mcq-controller.js:297` and `Swollen Discs/modal-manager.js:51`. Evidence: `additional-popups.json` and `mcq-state-review.json`, `focus enters popup`.

### 5. Refract: quiz card is not viewport-bounded

The sampled Primary card measured approximately **340 x 1,179 px** inside a `360 x 740` viewport. The overlay scrolls, so this is not proof that submission is unreachable, but the card does not follow the compact bounded-panel pattern. Marked feedback makes the panel longer still. Close is initially visible and retry works.

Source: `Refract/styles/overlays.css:394`, particularly `.mcq-modal-content` at line 412. Evidence: `refract-mcq-primary.png`, `refract-mcq-graded.png` and both popup JSON reports.

## Test and packaging findings

### Cataract: release identifiers disagree with the contract

The service-worker release is `20260929-logic1-info-20260929`, while the HTML stylesheet query is `20260929-logic1`. The test requires one identifier and fails: 12 of 13 contract tests pass. Independent logic regressions and generated-bundle parity pass. This is a release-contract inconsistency, not evidence of a broken calculator or a tested offline migration failure.

Sources: `Cataract/service-worker.js:2`, `Cataract/index.html:14` and `Cataract/tests/app-contract.test.mjs:97`.

### Squint: test still expects July's visible date

`Squint/tests/run-tests.cjs:50` expects `23/7/2026`; the correctly updated card displays `29/9/2026`. The test command stops at this assertion. The separately run production/source parity check passes.

### Fields: lint is not clean

The lint command reports **316 errors and 54 warnings**, mostly undeclared globals/environment or cross-script declarations. Its 27 contract tests pass and the reviewed browser states have no captured runtime errors. Lint counts must not be presented as 316 demonstrated runtime defects.

Evidence: `tests/fields-lint.log` and `tests/results.json`.

### Older fleet harness: fixed date assumption is now stale

`fleet-info-popup-review.mjs:115` still assumes every footer is `29/9/2026`. Refract's newer `30/9/2026` is correct. The new audit uses app-specific expected dates; the old harness has not been repaired.

### Direct-file limitations remain

All 15 direct-file information cards pass their date and geometry checks. Nine apps emit local-font CORS errors in Chrome: Diabetic, Discs, Fundal Reflex, Glaucoma, Mires, Refract, Sauron, Squint and Trauma. Refract's direct-file ES-module MCQ controller is also blocked by CORS. These are distinct from the clean HTTP checks.

The combined direct-file job passes for six apps and fails for nine on captured errors and/or the Discs focus issue. No service-worker capability is claimed for `file://`.

## Documentation findings

The dated refresh notes exist across all 15 READMEs and their active-context, progress and information-popup records. Older dated work logs should be retained as history. However, several sections still labelled as current contradict the latest implementation:

- **Cataract:** `README.md:35` says “Last updated: 26/7/2026”. Its “Current Clinical Flow” at line 100 still says Fundal is locked until history/VA and Dense/white locks Back to Poor view. The September correction at the top and current tests describe earlier access and editable, preserved back-of-eye findings. The older current-flow section needs consolidation, not replaying into code.
- **Trauma:** `README.md:50` and `memory-bank/activeContext.md:30` still describe a red app bar with black title. The actual reviewed app uses a black bar with red title. The dated May snapshot can remain, but unqualified current UI instructions should match the current shell.
- **Discs:** `memory-bank/techContext.md:10` still calls `20260722-v11` the current bundle token and gives a July service-worker cache. Its README and project brief also retain May “current” tokens. The shipped service worker uses `v1.1-20260929-engine1-info-20260929` and the bundle query is `20260929-engine1`.

There are only two active project instruction files: root `AGENTS.md` and `Refract/AGENTS.md`. This is valid inheritance, not 13 missing per-app instruction files. No instruction-file edits were made.

The 139-file scan establishes file/link coverage and date/status discovery. It is not a claim that every historic sentence, external reference, clinical rule or clinical question has received new independent expert approval.

## Recommended next repair pass

1. Fix focus lifecycle in Discs, Fundal Reflex and Swollen Discs, plus first-unanswered focus in Fundal Reflex and Glaucoma. Add direct regression checks for each reproduced path.
2. Bound Refract's quiz card with a scrolling question/review region and retain visible close/result/retry controls. Preserve question content, scoring and progression.
3. Resolve Cataract's release contract, Squint's stale date test and the old fleet date assumption. Address Fields lint declarations/configuration separately from clinical logic.
4. Consolidate genuinely current README/memory-bank sections, retaining dated historical records. Do not rewrite old evidence as though it were newly verified.
5. Re-run the affected mobile routes, complete the locked-tier/referral coverage and explicitly assess any chosen direct-file packaging fixes.

## Limits and reproduction

These were isolated automated viewports, not persistent Codex browser-toolbar sizing or physical-device acceptance. The user's retained draw.io flowchart tab was not changed. Service workers were blocked during these UI checks, so fresh offline-cache installation/migration is unverified. Clinical sign-off remains pending where already recorded; no new clinical approval or outcome-accuracy claim is made.

Harnesses in the workspace root:

```powershell
# With a local HTTP server on 127.0.0.1:8090
node fleet-review-20260930.mjs
node fleet-review-20260930.mjs --file
node fleet-popup-review-20260930.mjs
$env:AUDIT_MCQ_STATES='1'
node fleet-popup-review-20260930.mjs
Remove-Item Env:AUDIT_MCQ_STATES
node fleet-test-review-20260930.mjs
node fleet-doc-review-20260930.mjs
```

Chrome child-process launch required sandbox approval in this environment. Early harness locator assumptions were corrected and final results re-run; those harness failures are not counted as app defects.
