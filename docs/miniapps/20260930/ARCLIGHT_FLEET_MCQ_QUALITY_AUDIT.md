# Arclight Fleet MCQ Quality Audit

**Completed:** 26 July 2026  
**Scope:** all 15 applications beneath `C:\Users\William\Desktop\Arclight App`  
**Reference:** `Allan/ALLAN_V1.2_SPRINT_UPGRADE_PLAYBOOK.md` and the parent `AGENTS.md`

## Outcome

The fleet MCQ pass is an engineering, educational-content and presentation audit. It does not confer independent clinical approval.

The pass:

- retained Primary, Intermediate and Advanced as the shared visible tiers
- preserved every app's clinical, scoring, calculator and simulator logic
- gave authored questions stable app-scoped IDs
- required one valid best answer, distinct options, a concise rationale and source or review status
- removed unnecessary interface-operation questions and repeated restatements
- retained progressive overlap only where the later question tests a distinct technique, limitation, interpretation or safety principle
- prevented unanswered submission from revealing or grading a partial attempt
- moved focus to the first unanswered question
- made retry or new-attempt controls create a real fresh attempt
- protected 44px answer-row targets and result/action separation at a temporary automated `360 x 740` viewport
- recorded independent clinical sign-off and physical-device testing as pending

## App receipt

| App           |                                      Authored bank | Main quality result                                                                                                                                                                                                                            | Verification status                                                                                        |
| ------------- | -------------------------------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Allan         |                                       15 / 18 / 20 | Current NICE melanoma, drug-reaction and teledermatology sources rechecked. Stable IDs, explanations, source labels and fresh retry added without changing the dermatology content.                                                            | 26 Node checks and 6 Playwright checks passed.                                                             |
| Amsler        |                                       12 / 18 / 18 | Repetition replaced with distinct chart-geometry, optical-correction, filling-in, micropsia, dilation and reproducibility concepts.                                                                                                            | 18 checks, bundle parity and the temporary `360 x 740` MCQ path passed.                                    |
| Cataract      |                                       12 / 12 / 12 | White-reflex wording, state handling, stable IDs, explanations and source metadata audited against the existing cataract workflow.                                                                                                             | Contracts, acceptance and exhaustive combination audits passed. The temporary `360 x 740` MCQ path passed. |
| Diabetic      |                                       16 / 26 / 26 | Malformed content corrected. Stable IDs, explanations and source metadata added while preserving the referral engine.                                                                                                                          | 20 checks, bundle parity and the temporary `360 x 740` MCQ path passed.                                    |
| Discs         |                                       16 / 24 / 24 | Repeated disc-size, inadequate-view, drusen and context items diversified into anatomy, technique, multimodal interpretation and longitudinal comparison.                                                                                      | 20 checks, bundle parity and the temporary `360 x 740` MCQ path passed.                                    |
| Fields        | Text 5 / 5 / 5; Field 5 / 5 / 4; Pathway 5 / 5 / 4 | Duplicate pathway IDs and repeated primary stems were removed. Global authored-bank ID and stem-plus-answer uniqueness are now checked.                                                                                                        | Lint, contracts, MCQ QA, 1,062,882 pathway combinations and the temporary `360 x 740` MCQ path passed.     |
| Fundal Reflex |                                       16 / 26 / 26 | Adjacent restatements and simulator-operation wording were replaced with examination-quality, differentiation, limitation and safety questions.                                                                                                | Contracts, bundle parity and the temporary `360 x 740` MCQ path passed.                                    |
| Glaucoma      |                                       10 / 12 / 16 | Interface-mechanics questions were replaced with NICE NG81 case-finding, measurement, structural, functional and uncertainty concepts. The sparse-information LMIC end-stage teaching item remains app-specific and pending clinical sign-off. | Lint, contracts, controller checks, bundle parity and the temporary `360 x 740` MCQ path passed.           |
| Mires         |                                       10 / 10 / 10 | The fluorescein-direction defect was corrected: excess tear film can under-read and insufficient tear film can over-read. The remaining questions distinguish technique, endpoint and limitation.                                              | Contracts, bundle parity and the temporary `360 x 740` MCQ path passed.                                    |
| Morph         |                                   No MCQ by design | No quiz was invented. The app keeps its condition-completion Cup and simulator teaching purpose.                                                                                                                                               | Exclusion contracts and browser checks passed.                                                             |
| Refract       |                                       10 / 12 / 16 | Interface-state and repeated scope items were replaced with notation, visual-acuity verification and binocular-acceptance concepts.                                                                                                            | Tests, bundle parity and the temporary `360 x 740` MCQ path passed.                                        |
| Sauron        |                                         8 / 8 / 10 | Retinoscopy cues, optics and simulator-specific learning objectives were source-labelled and retained in their appropriate tiers.                                                                                                              | Build, tests, lint, bundle parity and the temporary `360 x 740` MCQ path passed.                           |
| Squint        |                                       10 / 14 / 23 | Repeated emergency, dissociation and pupil concepts were replaced with fixation discipline and prism-neutralisation interpretation. Pupil-source routing was corrected.                                                                        | Tests, source/bundle parity, all 68 preset audits and the temporary `360 x 740` MCQ path passed.           |
| Swollen Discs |                          30-question balanced bank | Frisén and Modified Frisén staging were corrected. Grade 1 and 2 are definite papilloedema stages and haemorrhage is not a grade threshold.                                                                                                    | Smoke, MCQ, viewer, integration, bundle, lint and temporary `360 x 740` browser checks passed.             |
| Trauma        |                                       10 / 13 / 14 | An interface-mechanics item was replaced. OTS-style calculation, category-boundary and interpretation questions were preserved.                                                                                                                | Syntax, scoring, MCQ, lint and the temporary `360 x 740` path passed.                                      |

Counts show Primary / Intermediate / Advanced authored pools unless otherwise stated.

## Shared browser contract

Each MCQ implementation was exercised over HTTP in an isolated browser at a temporary automated `360 x 740` viewport. The checks covered:

- untouched and unanswered state
- first-missing focus without partial answer revelation
- completed scoring with marked answers, rationale and source status
- retry or new-attempt reset
- effective answer-row height
- modal Escape handling and focus return where a modal is used
- result/action separation
- horizontal overflow
- console and page errors

This evidence is desktop-browser emulation. It does not prove that retained Codex browser tabs use the same real device-toolbar size and it does not replace physical-device acceptance.

## Clinical and release gates

1. Independent clinical review remains pending for every clinically relevant bank.
2. Local pathway wording and app-specific teaching models remain subject to local approval.
3. Physical touch-device, constrained WebView, large-text and screen-reader checks remain pending unless an app receipt records a narrower result.
4. Installed cold-start and offline behaviour still needs representative device confirmation.
