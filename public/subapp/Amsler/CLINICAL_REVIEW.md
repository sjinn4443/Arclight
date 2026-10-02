# Amsler Clinical Review Status

Date: 24 July 2026

## Status

Independent clinical sign-off is pending. The v1.1 work and 24 July Compute repair are engineering, safety and descriptive-measurement changes. They must not be treated as clinical approval or validation of the percentage outputs.

## Current descriptive calculation scope

- Compute remains the explicit action and records the selected eye as assessed.
- An untouched fellow eye remains `Not assessed`. A deliberately computed empty eye reports `No marks recorded`, which is not a clinical all-clear.
- The fixed-resolution normalised engine describes recorded marks consistently across canvas sizes. It does not diagnose disease or grade clinical severity.
- Whole-grid percentage means marked coverage of the complete grid. Central and outer percentages use their respective zone areas as denominators.
- A closed Missing or Red mark outline counts its actual polygon interior. An open mark counts its stroke. Overlapping marks are counted once.
- The former aspect-ratio and density inference of `wavy` versus `dark` has been removed from runtime output. Line, Missing and Red mark are explicit descriptive tools.
- MCQ wording was aligned to these descriptive semantics without adding a referral threshold or diagnostic claim.

## Review requested

- Confirm Line, Missing and Red mark remain appropriate labels for the intended examination workflow.
- Confirm the defined `30%` to `70%` central rectangle and the separate whole-grid, central-zone and outer-zone percentages are useful and appropriately constrained.
- Confirm a closed Missing or Red mark outline should represent its recorded polygon interior.
- Confirm report wording does not imply diagnosis or independent clinical validation.

Engineering contracts protect the established behaviour but do not replace clinical review.

## MCQ review — 26 July 2026

Independent clinical sign-off remains pending.

- Bank audited: 48 questions — Primary 12, Intermediate 18 and Advanced 18.
- Attempt sizes remain 6, 8 and 8 with unchanged pass marks.
- Materially revised question IDs: `amsler-primary-04`, `amsler-primary-11`, `amsler-primary-12`, `amsler-intermediate-01`, `amsler-intermediate-02`, `amsler-intermediate-05`, `amsler-intermediate-10`, `amsler-intermediate-14`, `amsler-intermediate-15`, `amsler-intermediate-16`, `amsler-intermediate-17`, `amsler-advanced-01`, `amsler-advanced-05`, `amsler-advanced-06`, `amsler-advanced-09`, `amsler-advanced-11`, `amsler-advanced-12`, `amsler-advanced-13`, `amsler-advanced-14` and `amsler-advanced-16`.
- The revisions remove app-control and calculation mechanics, narrow unsafe absolutes and prevent higher tiers from replaying the same basic teaching point. They cover test conditions, chart variants, field geometry, monocular documentation, fixation limitations, symptom interpretation and the need for clinical assessment.
- Sources recorded per question: NICE NG82 and NCBI Bookshelf `Amsler Grid`.

A named clinical reviewer must still confirm the bank’s wording, level assignment and local referral interpretation.
