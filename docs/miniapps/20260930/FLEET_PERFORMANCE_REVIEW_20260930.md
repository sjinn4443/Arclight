# Fleet performance review — 30 September 2026

## Outcome and scope

All 15 mini apps received a source/loading review, a before/after mobile Lighthouse audit and scoped regression checks. Eight apps now ship minified JavaScript rebuilt from readable source: nine bundles fell from 1,077,625 to 578,005 bytes, saving 499,620 bytes (46.36%). Measured gzip size falls from 229,920 to 176,923 bytes (23.05%); this is a compression estimate, not a claim that the local server serves gzip.

This is a completed first optimisation pass, not an exhaustive refactor or proof that every old code path is removable. Clinical rules, calculations, authored quiz content, simulator geometry, original imagery and approved layouts were deliberately preserved. No production clinical source functions were rewritten in this pass. Existing historical files were not deleted.

## Before and after

Pinned Lighthouse 12.8.2 ran all 15 apps using Chromium-based Microsoft Edge with the configured mobile 360 x 740 viewport. Each figure is one run before and one run after, not a repeated median or physical-device acceptance result. Small changes in unchanged apps are measurement variation, not optimisation gains.

| App           | Lighthouse performance /100 | Shipped bundle bytes                                 |
| ------------- | --------------------------: | ---------------------------------------------------- |
| Allan         |                     70 → 71 | Unchanged                                            |
| Amsler        |                     86 → 86 | Unchanged                                            |
| Cataract      |                     95 → 95 | 98,386 → 51,781 bytes                                |
| Diabetic      |                     85 → 92 | 167,895 → 89,861 bytes                               |
| Discs         |                     87 → 93 | 189,016 → 104,056 bytes                              |
| Fields        |                     85 → 86 | Unchanged                                            |
| Fundal Reflex |                     84 → 84 | Unchanged                                            |
| Glaucoma      |                     92 → 96 | 73,470 → 40,799 bytes                                |
| Mires         |                     97 → 97 | 81,995 → 44,284 bytes                                |
| Morph         |                     95 → 95 | Unchanged                                            |
| Refract       |                     85 → 88 | app 72,303 → 34,132 bytes; MCQ 21,153 → 15,096 bytes |
| Sauron        |                     85 → 94 | 211,173 → 121,120 bytes                              |
| Squint        |                     85 → 85 | Unchanged                                            |
| Swollen Discs |                     88 → 95 | 162,234 → 76,876 bytes                               |
| Trauma        |                     96 → 96 | Unchanged                                            |

Mean performance: 87.7 → 90.2. All 15 score 100 for the measured Accessibility and SEO categories. Best Practices is 100 except Cataract, Fields, Glaucoma and Refract at 96, unchanged. A score of 100 does not mean every accessibility issue has gone: the reports still contain visible-label/accessibility-name warnings in Amsler, Fields, Glaucoma, Mires and Morph.

## Changes made

- Added production minification to the existing build commands in Cataract, Diabetic, Discs, Glaucoma, Mires, Refract, Sauron and Swollen Discs. Readable source remains available.
- Updated canonical bundle-parity checks and temporary review builders to use matching build flags.
- Updated the format-dependent Glaucoma bundle assertion for minified output; its readable-source assertion remains in place.
- Bumped changed script query versions and app-scoped caches with the perf1 suffix. Cataract's release constant and matching style query were kept aligned. CSS contents were not changed.
- Fixed build-bundles.cmd to call each app's canonical npm build. The old command used the wrong Cataract entry, bypassed the custom Amsler/Fundal Reflex builds and omitted Refract's separate MCQ build. All ten canonical build jobs now complete successfully.
- Allowed the expanded-UI review tool to write to a supplied evidence directory instead of overwriting an earlier receipt.
- Classified .tools and output as non-app development/evidence folders in the fleet contract checker.
- Added performance-review-receipt.mjs to reproduce bundle-size, hash, Lighthouse and screenshot-comparison measurements without editing production files.

No sibling caches are deliberately intercepted or removed. The existing app-scoped cache lifecycle is retained.

## Code-review findings

Initial-load coverage is not a safe dead-code detector. Report capture, question banks, retry paths, teaching modals and completed-case code often do not run while Lighthouse watches an untouched page.

- Allan: Runtime source retained. Image delivery is the main remaining load-time opportunity; hidden teaching imagery must keep its existing behaviour.
- Amsler: Runtime source retained. The canonical custom builder is now respected by the fleet build. The report-capture library is required for export, not dead code; deferring it needs a dedicated export/offline check.
- Fields: Runtime source retained. Ordered classic-script dependencies and report/quiz code must not be removed on the basis of initial-load coverage.
- Fundal Reflex: Already-minified canonical bundle retained. The fleet build now uses this app's own builder rather than bypassing it.
- Morph: Runtime source retained. A suitably sized derived logo is a future asset-delivery opportunity; original artwork was not altered.
- Squint: Runtime source retained. Ordered globals, controller references and presets are used functionality, not candidates for blind removal.
- Trauma: Runtime source retained. Separate scoring, shell, progression and PWA scripts remain intentional.

The eight minified apps retain their readable source and canonical bundle checks. Esbuild can simplify shipped code safely within those builds, but no claim is made that all logically redundant clinical branches have been identified. No speculative source deletion or new runtime dependency was introduced.

## Verification

| Check                                          | Result                                                                                          | Evidence under output/performance-20260930               |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Existing regression jobs                       | 24/24 pass before and after                                                                     | baseline-tests/results.json and after-tests/results.json |
| HTTP information and drawer checks             | 15/15 pass                                                                                      | after-browser/fleet-http-review.json                     |
| Direct-file information and drawer checks      | 15/15 pass                                                                                      | after-file/fleet-file-review.json                        |
| Primary quiz workflows                         | All 14 quiz apps pass                                                                           | after-quizzes/mcq-state-review.json                      |
| Responsive main pages                          | 45 views across 360 x 740, 768 x 1024 and 1366 x 900; no captured errors or horizontal overflow | after-responsive/comparison.json                         |
| Selected expanded/completed states             | 18/18 pass across six apps and three widths                                                     | after-completed/expanded-ui.json                         |
| Cataract and Glaucoma clinical-state UI checks | HTTP and direct-file checks pass, including approved Glaucoma END-STAGE state                   | after-clinical/browser-results.json                      |
| Runtime script inventory                       | Every referenced local script exists                                                            | measurements.json                                        |
| Screenshot comparison                          | 28/34 paired information/drawer PNGs byte-identical                                             | measurements.json plus baseline/after screenshots        |
| Canonical fleet builds                         | Ten build jobs complete                                                                         | build-bundles.cmd                                        |
| Shared fleet contract                          | All 15 apps and four present excluded directories pass                                          | node fleet-contract-check.mjs                            |

The six non-identical screenshots are recorded, not silently counted as pixel matches. Spot visual inspection of Sauron's information view shows matching card geometry with a different animated background frame. Automated geometry and console checks are separate evidence from image hashes.

Quiz review includes incomplete submission, first-unanswered focus, marking, rationales, fresh retry, Escape and focus return. It does not exhaust every tier or every failed/passed combination. Completed-state coverage is selective, not every possible patient combination. Engineering tests are not independent clinical sign-off.

Lighthouse evidence:

- Baseline: audit-reports/lighthouse/2026-09-30T20-33-13-099Z-mobile/
- After: audit-reports/lighthouse/2026-09-30T20-41-26-459Z-mobile/
- Combined measurements: output/performance-20260930/measurements.json

## Remaining priorities

1. Allan: optimise derived image sizes and defer genuinely hidden teaching imagery while preserving full-quality originals. Initial transfer is about 1.24 MB and measured LCP remains about eight seconds in this throttled lab run.
2. Amsler: investigate loading html2canvas only when export is requested. Prove first export, repeat export, error handling, direct-file use and offline use before accepting this change.
3. Refract: investigate the initial layout shift (CLS 0.183 in both runs) while retaining the approved compact mobile layout.
4. Fields and Squint: map global-script dependencies before further bundling or source deduplication. Do not change global scope casually.
5. Other apps: check targeted CSS/image delivery and remaining accessible-name warnings. Use repeated lab runs for future speed claims and test on real phones.

These are next-stage recommendations, not implemented changes. Broad refactoring should be split into app-specific patches with behaviour tests and before/after visual evidence.

## Limits and browser hand-off

The automated browser reviews used temporary viewport settings. They do not prove that retained Codex tabs stay at 360 x 740. An initial real-toolbar attempt could not find Glaucoma. The final deterministic hand-off script succeeded: Glaucoma's toolbar read 843 x 1192 before setting, 360 x 740 immediately after setting and 360 x 740 after switching to Cataract and back. The verified URL was http://127.0.0.1:8090/Glaucoma/index.html?clinicalFix=20260930. This establishes the selected retained Glaucoma tab only, not sibling tabs or physical-device acceptance.

Direct-file tests exercise app behaviour without service workers. Offline cache migration, installation/update behaviour on physical devices and real-device speed remain unverified. No new independent clinical approval is claimed.

## Reproduction and recovery

Run node performance-review-receipt.mjs for the combined measurements. Run each app's documented tests and canonical npm build or the corrected fleet builder. The Lighthouse audit command and prerequisites remain in LIGHTHOUSE-AUDIT.md.

Pre-change bundles, build/parity configuration, HTML and service-worker files were copied to output/performance-20260930/baseline-source/. This is a scoped performance backup, not a complete fleet backup. Restore only an app's matched performance-file set after reviewing newer changes, then rebuild with its corresponding original build flags and check HTML/script/cache version alignment. Do not overwrite later user changes or restore a bundle in isolation.
