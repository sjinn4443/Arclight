# Refract weighted prescribing revision

30 September 2026. Implemented development model, not a clinically approved prescribing protocol.

## Purpose

Estimate a reasonable prescription from the current glasses, measured refraction and patient context. This is a deterministic authored policy with visible rules and bounded weightings. It does not retrieve a matching spreadsheet row. It cannot substitute for subjective refraction, binocular acceptance or assessment of near tasks and working distance.

## Input meaning

- Returning means previously seen at this practice. New means new to the practice, not first-ever spectacles. Neither proves happiness with the current glasses or measurement accuracy. Blank is unknown.
- Calm means easy-going. Precise increases resistance to change, without automatically freezing every component.
- Health retains the existing poor-health/frailty meaning. It is not a diagnosis or an inference made from age.
- Per-eye quality is optional, from 0 to 10. Zero is a recorded low score. Blank falls back to the existing accuracy switch. The two eyes retain separate confidence values.
- The unresolved B field is not used. The original workbook and source CSV are not rewritten.

## Decision order

Validate and normalise the entries, check the pair-wide large-discrepancy guard and apply the chosen Simple/Advanced representation. For each eye, check missing measurements, missing current prescription, explicit good current VA and low confidence before applying component weights. Apply bounded sphere overrides and the retained cylinder/axis guards, combine the two eyes, select the reading add and show the applied rules with review flags.

The current add takes precedence over measured add, then the existing age estimate. An explicit zero is retained. The frailty increment affects only the age estimate. Current-add precedence and the existing age bands remain reviewable assumptions, not newly established clinical rules.

## Weightings

`src/weighted-prescribing.js` is the production source. The exported `PARAMETERS` and rule catalogue are imported by the diagram generator.

| Influence           | Current development setting                                                              |
| ------------------- | ---------------------------------------------------------------------------------------- |
| Recorded quality Q  | q = clamp((Q − 5) / 3, 0, 1)                                                             |
| Calm                | +0.04 adaptation modifier                                                                |
| New to practice     | −0.05 adaptation modifier                                                                |
| Returning patient   | +0.025 adaptation modifier                                                               |
| Poor health/frailty | −0.05 adaptation modifier                                                                |
| Age 65 or over      | −0.05 adaptation modifier                                                                |
| Precise wearer      | 0.20 resistance in the larger-sphere pull and the retained stronger component resistance |

These are transparent provisional coefficients. They are not guideline-endorsed effect sizes. Quality at or below 5 holds an existing prescription. Quality at or above 8 reaches the high-confidence plateau. The no-current-prescription pathway remains a provisional seed with an explicit warning, not an invented plano anchor.

For a sphere gap of at least 1.25 D, the allowed step increases progressively above the ordinary step, up to 1.5 D. The high-sphere limit and earlier discrepancy guard still take precedence. This replaces a rejected abrupt threshold jump. Quarter-dioptre quantisation remains intentional.

## Agreement with the 60 author examples

The principal distance is the maximum absolute meridional power difference, taking the worse eye for each patient. It combines sphere, cylinder and axis and respects equivalent transposed prescriptions. It is an engineering closeness measure, not a universal tolerance for dispensing.

| Measure                                |    Before |     After |
| -------------------------------------- | --------: | --------: |
| Mean worse-eye difference              | 0.18531 D | 0.16104 D |
| Largest difference                     | 1.63951 D | 1.00000 D |
| Both eyes within 0.25 D                |     45/60 |     45/60 |
| Both eyes within 0.50 D                |     54/60 |     55/60 |
| Exact equivalent distance prescription |     32/60 |     32/60 |
| Literal complete match                 |     29/60 |     29/60 |

Mean disagreement is 13.1% lower. Cases 6, 18 and 42 improve. Case 57 changes its right-eye axis from 175° to 170° on a −0.50 D cylinder, adding 0.04358 D optical disagreement. The other 56 worse-eye distances are unchanged. The unchanged complete-match total must not conceal the loss of that individual exact match.

Of 38 numeric recorded adds, 33 match exactly and all 38 are within 0.25 D. The other 22 blank adds are unscored in that numeric comparison. Both distance and add are within 0.25 D for 27/38 and within 0.50 D for 34/38 recorded-add cases.

The five remaining distance outliers above 0.50 D are cases 11 (0.587 D), 14 (0.511 D), 18 (0.890 D), 22 (1.000 D) and 37 (0.750 D). These are priorities for prescriber review, not reasons to invent case-specific branches.

## Limits and independent checks

- All 60 cases were available during development. These are in-sample results, not held-out evidence or prospective clinical validation.
- Removing repeat weighting gives a slightly better mean difference of 0.16031 D. Repeat therefore expresses the author's prescribing preference but has no demonstrated incremental benefit here.
- Independent power-matrix scoring reproduces the reported agreement. Source tests include 3,780 graded-context combinations, 960 accuracy-switch combinations, all-case determinism, eye symmetry and transposition checks. Invalid-axis, missing-data and entered-zero safeguards are protected.
- A final API robustness check found that the inherited `S − sign(S) × bias` target could cross plano for non-quarter inputs such as `+0.10 D`. It now uses `S − sign(S) × min(abs(S), bias)` before quarter-dioptre rounding, so the bias stops at zero. All 60 recorded outputs are exactly unchanged. `tests/target-safety.mjs` passes 740 checks covering `±0.10 D`, `±0.125 D`, zero, ordinary quarter-step targets, dense fractional samples and production/candidate parity. Ordinary spinner entry already uses quarter steps; this fix protects the calculation boundary rather than relying on that UI convention.
- The reviewer tested 61,776 quality settings and 56,160 adjacent transitions. Sphere distance did not worsen as quality increased in that grid. There were 222 cylinder and 431 full-lens worsening transitions towards the raw measured Rx because the inherited component policy uses a reduced cylinder target. No global optical monotonicity claim is made.
- HTTP and direct-file core UI checks are separate from clinical approval. Direct-file MCQs and font preload requests retain browser CORS limitations. Service workers do not run on direct-file pages.
- Independent clinical review, a genuinely new case set and physical-device acceptance remain outstanding. Medication, disease diagnosis and unmeasured visual needs are outside this engine.

## Sources and their boundary

The [College of Optometrists' prescribing guidance](https://www.college-optometrists.org/clinical-guidance/guidance/knowledge%2C-skills-and-performance/prescribing-spectacles) supports considering the benefit and justification of a prescription change. [Thibos et al's power-vector paper](https://pubmed.ncbi.nlm.nih.gov/9255814/) provides the optical representation behind a transposition-aware comparison. Neither source validates these coefficients or the entire clinical model.

## Reproduction and future updates

From the Refract folder:

```powershell
npm ci
npm run build
npm test
node tests/weighted-rules.mjs --write
node tests/target-safety.mjs
node outputs/weighted-20260930/independent-review.mjs
node tests/context-browser.mjs
node tools/build-weighted-flowchart.mjs --self-test
node tools/build-weighted-flowchart.mjs
```

The flowchart is editable. Change the source policy and generator together, regenerate the chart, check its geometry and inspect the actual draw.io rendering at readable zoom. Only then promote the chart with `--promote`. Reopening the regenerated launcher loads the new snapshot. An already-open draw.io tab does not synchronise itself and manual diagram edits do not change the app engine.

The reviewed weighted chart is now promoted to `Refract-integrated-flowchart.drawio`. Its SHA-256 is `9cc958d3c4e638d5eb16fb251a2837ef372849173146173d9e44b7ec1f7a1fe3`, identical to the generated weighted file. The preceding chart is preserved as `outputs/weighted-20260930/baseline/Refract-integrated-flowchart-before-weighting.drawio`. Promotion itself does not create a backup, so make a new explicit backup before future replacements.

The final chart has 69 nodes, 92 edges and all 18 catalogue IDs. Geometry self-tests and 22 targeted semantic examples pass. The actual draw.io snapshot was inspected at 70% through the opening validation, component decisions, axis branches, sphere adjustments, RE/LE join, add selection and final prescription. Continuous outside routes, separated arrow landings and Yes/No labels were checked. No lettered continuation circles remain. This is rendered diagram review, not clinical sign-off.

Evidence: `outputs/weighted-20260930/independent-report.json`, `research-report.json`, `independent-review.json`, `flowchart-verification.json` and `output/playwright/context-20260930/report.json`.

## Final UI and hand-off status

The shipped `weighted3` assets pass the full source/bundle suite and isolated HTTP/file core browser checks. A rendered review found clipped trailing digits in the existing 50px output boxes. Output-only padding and 12.5px bold numerals now preserve every digit without moving or widening fields. All 4,000 signed quarter-step display fixtures through 99.75 pass; the actual calculated-result screenshot was refreshed and checked. Run `npm run browser:output-fit` separately using Morph's local Playwright-core and installed Windows Edge. Its temporary display fixtures are not clinical cases or engine tests.

The final Codex app tab was refreshed to `?weighted=20260930-3`, with final asset tokens and no captured warning/error logs. The draw.io tab holds the exact promoted snapshot. The final real-toolbar tab-switch check passed after the user returned to this chat: the exact weighted3 URL and 360 x 740 were read before setting, after setting and after switching to the diagram and back. The earlier hidden-chat limitation is resolved; no temporary page measurements were substituted for this check. See `outputs/weighted-20260930/handoff-review.json`.
