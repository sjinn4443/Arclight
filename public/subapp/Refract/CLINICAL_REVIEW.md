# Clinical review status

## Authorised rule development — 29 September 2026

Explicit rule revision implemented with 29/60 exact complete cases, versus 24/60 baseline. Development-set agreement only; not independent validation. Numeric age, adaptation, discrepancy and frailty thresholds require author/clinical review. Source-data queries and the unchanged-data record are in `RULE_ENGINE_2026-09-29.md`. The previous untuned status below is historical. Independent clinical sign-off remains unestablished.

Engineering review date: 23 July 2026

Status: **independent clinical sign-off not established**.

The live heuristic and prescription configuration were deliberately not tuned. The fixed spreadsheet-input audit remains 24/60 full cases, 39/60 right eyes, 33/60 left eyes and 52/60 adds. Benchmark-only replay remains 60/60. These are regression boundaries, not evidence of clinical approval.

## MCQ review record — 26 July 2026

Engineering review covered all 38 authored MCQs. Stable IDs, one keyed answer, rationales, source metadata and review status are now required by contract. Questions about interface controls were replaced with questions about refraction notation, subjective refinement and verification. Sources recorded in the bank are the College of Optometrists routine examination guidance, the app's tested optics contract and the app-scope record. The optics and scope items still require independent clinical review. No prescription threshold, calculation or simulator behaviour changed and no clinical approval is inferred.

Content spot-check replacements retained their existing IDs: `refract-primary-03` moved from app-scope repetition to plano notation with `refract-optics-contract-v1`, `refract-primary-09` moved from untouched-interface state to visual-acuity verification with `college-routine-eye-examination` and `refract-advanced-16` moved from repeated scope caution to binocular acceptance and tolerance with the same College source. These are teaching-bank changes, not clinical sign-off.
