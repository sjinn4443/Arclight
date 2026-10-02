# Glaucoma logic follow-up — 29 September 2026

User-approved corrections to the approximate, limited-information LMIC workflow. C/D remains central to the existing chart. This is engineering verification, not independent clinical approval.

## Changes

- Suspicious rim/fields and pressure in the existing 25–29 or ≥30 bands can produce the existing SOON advice without a complete grid. This is the least urgent existing grid action for those pressure rows, not a newly invented referral interval. The grid remains unplaced until both axes are available.
- Reduced VA or suspicious pupils receive an assessment cue rather than routine reassurance. The white-grid wording is now LOW GRID CONCERN, not a diagnosis of a normal eye.
- Large-disc adjustment no longer shifts C/D 0.9–1 out of its final column.
- END-STAGE remains visible for C/D 0.9–1 across pressure bands and accompanies urgent or emergency advice when applicable.
- A concise note distinguishes grid position from overriding findings. Incomplete-grid advice is explicitly labelled.
- The numerical total is labelled Supporting points (C/D shown on chart) in the result and report. Internal scoring remains unchanged; it is not presented as a comprehensive diagnostic score.
- An initially visible acute-symptom boundary says painful red eye with sudden visual loss requires emergency assessment rather than routine grid timescales. This is also in the report. No extra symptom-entry workflow was added.
- Source bundle rebuilt and release/cache updated to 20260929-logic1. Asset lookup now uses the current app cache with exact query matching.

## Evidence

- Syntax checks and all existing tests pass, including the 86,400-case engine sweep.
- New regressions cover partial concerning inputs, poor-vision/pupil cases, override/report wording and 60 end-stage combinations.
- Exact source-to-bundle parity passes (esbuild required an unsandboxed child process).
- HTTP browser checks at 360 × 740: untouched, suspicious fields alone, completed referral override, HM with suspicious pupils, large-disc near-total cupping, higher-pressure end-stage, report, reset and rock-hard palpation without C/D.
- No horizontal overflow in inspected untouched/completed report states. Report visually fits within the viewport. Browser warnings/errors: none captured.
- Normal reload served the updated release after worker activation. Retained toolbar verification passed via Glaucoma → Allan → Glaucoma at 360 × 740 with the original URL unchanged.

## Remaining acceptance

Independent clinical sign-off, direct-file runtime regression, installed-offline acceptance and physical-device checks remain pending. No claim that the app diagnoses glaucoma or that the scoring model is clinically validated.

Clinical reference for the acute safety boundary: Community Eye Health, Emergency management: angle-closure glaucoma, https://pmc.ncbi.nlm.nih.gov/articles/PMC6253313/ (2018). Retains the review's established emergency principle; no treatment protocol added.
