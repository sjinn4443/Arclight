# Fields Clinical Review Status

## Authorised follow-up — 30 September 2026

Corrected the claim of current exhaustive output-mode coverage: 17,006,112 comparisons belong to historical evidence and the 28 September rerun did not complete. Production logic is unchanged in this follow-up. The current 28 contract/regression tests pass. The earlier 30 September review also checked all 59,049 completed field patterns for output integrity, not independent clinical correctness.

User authorisation to implement is not independent clinical approval. Clinical sign-off and physical-device acceptance remain pending. See `../CLINICAL_LOGIC_FIXES_20260930.md` for fresh evidence and its limits. Earlier entries below retain their historical scope.

Last updated: 30 September 2026

## Approved September correction scope

The user authorised the eight operational logic corrections documented in `LOGIC_REVIEW_20260928.md`. These supersede the historical v1.1 preservation boundary below. Authorisation to implement is not independent clinical sign-off. The five-point model remains a screening approximation.

## Status

Independent clinical sign-off: **pending**

This document records engineering scope and evidence. It does not approve clinical content.

## v1.1 Engineering Boundary

- The Classic 18 rule families and their priority order were not changed.
- Point codes passed to the clinical engine remain `R`, `?` and `W`.
- RAPD, context-modifier, urgency, lesion-site and pathway rules were not changed.
- Simple and advanced clinical wording was not rewritten.
- Teaching-card classifications and the operational rule engine were not changed. The MCQ content changes are recorded in the dedicated review section below.
- The new `Not assessed` state is a presentation guard which prevents untouched controls from being presented as a completed normal examination.
- Existing neuro, flash/curtain and sudden-onset urgency rules now remain visible during an incomplete assessment. The heading still says `Not assessed` and no pathway target is shown.
- Unexpected interpretation failure now fails closed as `Unable to interpret` rather than being presented as normal.

## Historical Engineering Evidence — not a current exhaustive rerun

- Full field-state audit: 59,049 states, no `P0` to `P3` findings
- Fixed regression suite: 15/15 pass
- Pathway audit: 1,062,882 combinations, no alignment issues
- The historical output-mode audit reported 17,006,112 comparisons. The 28 September 2026 rerun did not complete, so that historical result does not establish current exhaustive coverage. See `LOGIC_REVIEW_20260928.md`.
- MCQ audit: pass
- Context-modifier audit: 14 representative cases pass
- State-safety, pathway, output-safety and app contracts: 17/17 pass

## Clinical Reviewer Questions

1. Confirm that the existing Classic 18 scope remains appropriate for the five-point confrontation model.
2. Confirm the existing simple and advanced wording, urgency notes and source hints.
3. Confirm that `Not assessed`, `Mark all seen` and `Mark rest seen` are operationally clear.
4. Confirm that a completed normal screen can remain visually separate from a red-flag context warning.
5. Confirm that showing an existing urgent context warning beneath an incomplete `Not assessed` heading is operationally appropriate.

## Release Interpretation

The v1.1 engineering pass may be described as technically verified against the existing automated rule corpus. It must not be described as independently clinically approved until a named reviewer and review date are added here.

## MCQ review — 26 July 2026

Independent clinical sign-off remains pending.

- Audited set sizes: 15 text localisation questions, 14 field-pattern recognition questions and 14 pathway localisation questions.
- Each set retains Primary, Intermediate and Advanced tiers and its existing question count.
- Revised text IDs: `tp3` and `tp4`.
- Revised field-pattern IDs: `f1`, `f2` and `f3`.
- Primary pathway identity correction: previous `p1`, `p2`, `p3`, `p4` and `p6` are now globally unique `pp1` to `pp5`.
- Revised Higher pathway IDs: `ph1` to `ph5`. Revised Advanced pathway IDs: `pa3` and `pa4`.
- The revised items distinguish retinal concern from optic-nerve localisation using symptom, colour-vision, retinal-examination and RAPD context and remove repeated Primary-to-Intermediate patterns. No field-pattern rule, pathway drawing or operational assessment input was changed.
- `qa-mcq-audit.mjs` now fails on any global authored-question ID collision or exact stem-plus-answer repetition.
- Sources recorded per question: the 2023 review of optic chiasm and retrochiasmal visual loss and the 2021 primary visual-pathway imaging review.

A named clinical reviewer must still confirm every localisation, the simplified five-point diagrams and the teaching level assigned to each question.
