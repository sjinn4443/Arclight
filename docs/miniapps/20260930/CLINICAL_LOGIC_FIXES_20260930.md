# Clinical logic repairs — 30 September 2026

## Scope and protected decisions

Authorised follow-up to the four-app clinical logic review. Cataract and Glaucoma production sources were corrected and their bundles rebuilt. Fields evidence was corrected. Squint logic was preserved.

The user explicitly requires **END-STAGE for C/D 0.9–1**, with the black final Glaucoma grid column unchanged. This label is retained alongside referral or emergency advice. The new reduced-vision/abnormal-pupil cue does not replace or downgrade it. Point weights, disc-size mapping and referral timings are unchanged. This records the approved app rule, not independent clinical staging validation.

## Repairs

- Cataract: missing core history or VA no longer hides independently recorded concerning findings. The result remains `Not assessed` without a cataract diagnosis. Detached retina, sudden onset and paediatric white-reflex urgency retain precedence. Adult white-reflex advice is also retained when required inputs are missing.
- Cataract: missing safety checks qualify an otherwise supported phenotype as `Possible`. Completed results retain their existing classification.
- Cataract: the combination audit now includes white reflex with positive posterior findings. Only white reflex plus normal back-of-eye remains a normalised duplicate. The expanded audit exposed an expectation defect: a lower-priority white-reflex/VA note may legitimately be trimmed by the existing three-note cap. The audit now checks the retained consistency flag and VA/reflex recheck fields as well as the note or trimming flag. Note priority was not changed.
- Glaucoma: reduced vision or suspicious pupils retain a separate assessment cue alongside END-STAGE and EMERGENCY. A visible separator keeps the messages distinct.
- Fields: withdrew the claim of current exhaustive 17,006,112-comparison coverage. That is historical evidence; the 28 September rerun did not complete.
- Squint: no new blocking production defect was reproduced in the preceding review. No additional logic change was made.

## Fresh engineering checks

| App      | Evidence                                                                                                                                                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cataract | Build, 21 contract/regression tests, 30 acceptance cases and exact rebuilt-bundle parity pass. Full combination audit: 3,110,400 total cases, 2,985,984 UI-feasible cases and 124,416 normalised duplicates; no reported edge-case findings. |
| Glaucoma | Build, lint, tests and exact rebuilt-bundle parity pass. Regression coverage includes 60 end-stage combinations and six reduced-vision/pupil cases across end-stage, rock-hard urgency and their combination.                                |
| Fields   | 28 current contract/regression tests pass. Production logic unchanged in this follow-up.                                                                                                                                                     |
| Squint   | Current contracts and amended source parity baseline pass. Production logic unchanged in this follow-up.                                                                                                                                     |

Fresh browser checks cover Cataract and Glaucoma over HTTP and direct-file routes at temporary `360 x 740`. Untouched, completed, incomplete, provisional and urgent states were checked as applicable. No captured runtime errors, unhandled rejections or horizontal overflow. Cataract dense incomplete notes use normal page scrolling rather than hiding recorded concerns.

Evidence: [browser results](output/clinical-fixes-20260930/browser-results.json), [browser check script](output/clinical-fixes-20260930/browser-audit.mjs), [END-STAGE mobile result](output/clinical-fixes-20260930/glaucoma-http-end-stage-output-360x740.png) and [dense incomplete Cataract result](output/clinical-fixes-20260930/cataract-http-dense-incomplete-360x740.png).

The preceding read-only review separately recorded 59,049 completed Fields patterns and 68/68 Squint presets through HTTP and direct-file routes. Those are earlier review checks, not newly rerun independent diagnostic benchmarks. See [the original review](output/clinical-review-20260930/clinical-logic-review.html).

## Release and documentation

Cataract assets and its app-scoped service-worker release use `20260930-clinical2`. Glaucoma bundle URLs and its app-scoped cache use `20260930-clinical2`. Internal package versions are unchanged. Both bundles were rebuilt from source.

All four READMEs, clinical review records and relevant project memory-bank files have dated follow-up entries. Cataract and Glaucoma system-pattern notes protect the new safety behaviour and the user's end-stage decision. The fleet upgrade matrix records the repair scope.

## Boundaries

These are engineering consistency checks, not measured diagnostic accuracy or independent clinical approval. Clinical sign-off and physical-device acceptance remain pending. Glaucoma's compact controls still have the previously recorded touch-target limitation.

The browser harness bypasses service workers to verify fresh source behaviour. Offline installation and cache migration were not established by this repair. Service workers do not run on `file://` pages.

Real retained-tab toolbar checks passed earlier for Cataract and Glaucoma at `360 x 740`, including switching to another tab and back. Final hand-off re-verification is recorded separately below; temporary browser emulation alone is not a persistent mobile-size claim.

Final hand-off status: **unverified**. The browser inventory still lists Swollen Discs, Cataract and Glaucoma at their intended local URLs, but the deterministic real-toolbar script could not find their visible `TabItem` controls on the final retry. Opening Glaucoma returned queued. No final persistent-size or completed browser hand-off claim is made. This does not invalidate the separate HTTP/direct-file test results.
