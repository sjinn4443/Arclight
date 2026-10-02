# Sauron v1.1 Gap List

_Completed: 23 July 2026. Case curriculum follow-up: 25 July 2026._

## Logic-integrity follow-up

| Area                  | Confirmed gap                                                                          | 25 July response                                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Hidden-axis integrity | Loading an axis-dependent timed case aligned the visible streak with the hidden answer | Preserve and restore the learner's pre-round streak angle after the hidden case is initialised                           |
| Baby test scope       | Baby mode filtered the picker but timed testing still sampled the full test pool       | Intersect Baby-compatible cases with the timed-test pool while retaining the anisometropia exclusion                     |
| Dialog semantics      | The case and warning dialogs remained simultaneously exposed to assistive technology   | Make the underlying case dialog inert and hidden while the warning dialog is active, then restore it on every close path |
| ACG explanation       | The deliberate exaggerated oval could be mistaken for a diagnostic pupil shape         | Preserve the oval and identify it explicitly as a stylised teaching cue                                                  |
| Cache freshness       | The rebuilt logic bundle needed a new app-scoped token                                 | Advance the cache and bundle token to `20260725-logic1`                                                                  |

Simulator maths, case rendering, MCQ scoring, the exaggerated ACG geometry and non-Baby timed-test selection remain unchanged.

## Case curriculum and safety follow-up

| Area               | Baseline gap                                                                              | 25 July response                                                                                                                                        |
| ------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Teaching hierarchy | Four cases sat in less useful teaching tiers                                              | Moved low astigmatism to Intermediate, posterior subcapsular cataract to Advanced, dense cataract to Intermediate and vitreous floaters to Intermediate |
| Case ordering      | Global numbering did not cleanly follow the three displayed tiers after reassignment      | Regrouped the existing cases as Primary `5`, Intermediate `10` and Advanced `13`                                                                        |
| Safety teaching    | Urgent examples had no concise, case-linked caution cue                                   | Added a separate warning control and note for ACG, leucocoria, vitreous haemorrhage and partial retinal detachment                                      |
| Accessibility      | A warning marker could have competed with selection or been embedded inside a case button | Used sibling controls, a labelled dialog, close-button focus and Escape focus return                                                                    |
| Cache freshness    | Versioned assets could remain stale after a visual update                                 | Updated the scoped cache to `20260725-cases2` and made versioned requests network-first with offline fallback                                           |

That earlier case-curriculum follow-up did not change reflex rendering, simulator calculations, MCQ answers or the timed-test case pool. The later logic-integrity follow-up changes only Baby-mode eligibility and answer concealment as recorded above.

## Preserved baseline

- Existing retinoscopy simulator maths, case content, MCQs, non-Baby timed-test eligibility, state ownership, workflow, DOM IDs, WebP assets and orange-red Sauron identity. The approved follow-ups change four teaching-tier assignments, Baby-mode timed-test eligibility, answer-axis concealment and stacked-dialog semantics.
- Direct-file operation remains supported. Service-worker registration is deliberately skipped on `file:` URLs.

## Applicable Allan-derived improvements

| Area           | Baseline gap                                                             | v1.1 response                                                                                                                   |
| -------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| State safety   | No deliberate way to restore the whole teaching simulator                | Added a two-press reset with an eight-second confirmation window                                                                |
| Accessibility  | Active-eye selection was conveyed visually only                          | Added synchronised `aria-pressed` state while retaining `RE` and `LE` behaviour                                                 |
| Offline        | Local runtime assets existed but there was no manifest or service worker | Added scoped manifest, versioned app cache and same-origin navigation fallback                                                  |
| Verification   | Checks were documented but not executable as a suite                     | Added syntax, catalogue, asset, DOM, PWA and exact-device browser contracts                                                     |
| UI consistency | Strong baseline needed explicit fleet evidence                           | Retained the existing radius hierarchy, local typography, restrained italics, compact spacing and 44 px principal touch targets |
| Governance     | No app-specific clinical or device status                                | Added clinical review, constrained-device checklist and evidence receipt                                                        |

## Deliberately not imported

No Allan clinical rules, image requirements, decision labels, thresholds, purple styling, IDs, MCQs or dermatology content were copied. Sauron remains a teaching simulator and does not produce an operational clinical decision.
