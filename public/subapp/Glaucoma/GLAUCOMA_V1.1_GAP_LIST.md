# Glaucoma v1.1 Gap List

**Updated:** 25 July 2026

## Addressed

- Removed the exact-boundary overlap between `≤20` and `20-24`; the second band is now `21-24`.
- Prevented thin/notched rim or suspicious field findings from producing a routine or annual-review result.
- Replaced the isolated end-stage instruction with affected-eye escalation and fellow-eye assessment.
- Added optional eye laterality for orientation and report context while preserving calculation from sparse information.
- Added a compact report action that stays unavailable before calculation, records missing eye context honestly and clears with assessment reset.
- Added synchronised `aria-pressed` states, live result announcement, table caption and row-header semantics.
- Moved the thin-rim guide control outside its label to prevent nested-control ambiguity.
- Hid empty output surfaces and refined compact spacing so the fully dense state fits `360 x 740`.
- Raised the Primary pass mark above 50%, extended the Advanced timer and added correct-answer review.
- Added 86,400-combination risk-engine coverage and browser checks for the new safety states.

## Preserved

- Bright-green identity, images, risk-grid arrangement and one-page workflow.
- Existing `SOON`, `URGENT` and emergency pathways except for the approved minimum safety floor and end-stage clarification.
- Two-step reset, local runtime, PWA scope and separate MCQ achievement state.

## Remaining Gates

- Independent clinical review of the corrected boundary, referral floor, end-stage wording and existing referral timescales.
- Physical-device and constrained-WebView testing.
- Installed offline reload and update-cycle acceptance.
- Service workers remain unavailable on `file://`; direct-file regression now passes.
