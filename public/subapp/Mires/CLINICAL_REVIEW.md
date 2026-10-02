# Mires clinical review

## Endpoint teaching correction — 29 September 2026

Supersedes the July p4/p5 bias-direction correction below. The popup and MCQs previously contradicted each other and conflated fluorescein appearance with tear-film volume. They now teach recognition of excessively wide bands and repeating after correcting drying, without asserting a universal bias direction. Source: Haag-Streit AT 900 instructions, section 6.7, sources of error (manufacturer document already listed in questions.js). The indexed manufacturer instructions were rechecked on 29 September 2026. No scoring tolerances or diagnostic thresholds changed. Independent clinical sign-off remains pending.

Version: 1.1. Source-review date: 23 July 2026. Independent clinical sign-off: pending. Deployment approval: pending.

Engineering preserved existing Goldmann teaching copy, Newton scoring and training ranges. A qualified reviewer must confirm terminology, 3.06 mm teaching, fluorescein guidance, scoring tolerances and safety wording. Reviewer: pending. Clinical owner: pending. Later clinical wording or scoring changes require a new entry and version increment.

## MCQ source review and fluorescein correction — 26 July 2026

All 30 MCQs now record stable IDs, rationales, source keys and review status.

Exact reviewed source:

- European Glaucoma Society Terminology and Guidelines for Glaucoma, 4th Edition — Part 1, Goldmann applanation tonometry and Table 1.1: https://pmc.ncbi.nlm.nih.gov/articles/PMC5583682/

Before and after:

- `p4` previously described too much fluorescein as thick mires with possible **over-reading**. It now states possible **under-reading**.
- `p5` previously described too little fluorescein as thin mires with possible **under-reading**. It now states possible **over-reading**.

The correction aligns the bank with the EGS table, where excessive tear film biases Goldmann IOP low and insufficient tear film biases it high. Regression assertions protect both directions. Independent clinical sign-off remains pending and no Newton or simulator logic changed.
