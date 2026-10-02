# Cataract Clinical Review Record

## Authorised follow-up — 30 September 2026

Incomplete core inputs now retain independently recorded safety findings while the result remains `Not assessed`. Missing safety checks qualify a cataract phenotype as `Possible`. Existing urgent precedence and referral timings are preserved. Fresh checks: 21 contract/regression tests, 30 acceptance cases, exact rebuilt-bundle parity and the full 3,110,400-case combination audit pass. HTTP and direct-file mobile checks pass with no captured runtime errors or horizontal overflow.

User authorisation to implement is not independent clinical approval. Clinical sign-off and physical-device acceptance remain pending. See `../CLINICAL_LOGIC_FIXES_20260930.md` for fresh evidence and its limits. Earlier entries below retain their historical scope.

## September 2026 correction record

The user authorised five targeted logic corrections following source review and scenario testing. See `LOGIC_REVIEW_20260929.md`. These supersede historical progressive-completion and Dense-overwrite behaviour. Independent clinical sign-off is still pending; automated rule consistency is not clinical approval.

## Current Status

- App version: `1.1`
- Engineering consistency review: completed 26 July 2026
- Clinical source review for the MCQ wording pass: completed 26 July 2026
- Full operational source pack: pending
- Independent clinical sign-off: **Pending**
- Deployment status: **Not approved for unsupervised clinical deployment**

The 26 July safety pass made user-approved engineering changes to assessment completeness and cautious routing: blank safety checks remain unassessed, an age band is required, sudden visual loss is same-day, paediatric white reflex is urgent and posterior disease no longer erases a possible coexisting cataract phenotype. The interface no longer offers an unknown age band. The later MCQ pass corrected over-specific white-reflex wording and added explanations and source status without changing the operational decision engine. Automated audits confirm internal consistency only. They do not provide independent clinical approval.

## Source Traceability

The MCQ terminology review used:

- NHS cataracts in adults: https://www.nhs.uk/conditions/cataracts/
- NHS childhood cataracts: https://www.nhs.uk/conditions/childhood-cataracts/

These sources support the broad gradual adult-cataract pattern, competing acute symptoms and the importance of prompt assessment where childhood cataract affects vision. App-specific white-reflex routing, retinal overrides and referral timing remain pending independent review.

No complete authoritative source pack or named clinical-owner approval is stored with the app. Full source traceability remains an open governance gate.

Before clinical deployment, record direct links to the current authoritative guidance used for:

- cataract-pattern recognition and terminology
- paediatric cataract urgency
- sudden visual loss, including painless loss
- white-reflex pathways
- retinal detachment urgency
- glaucoma and diabetic-retinopathy competing pathology
- visual-acuity thresholds and referral timing
- local referral names and service expectations

## Sign-off Checklist

- [ ] Terminology matches the intended users' training level.
- [ ] Required inputs are sufficient for the intended use.
- [ ] Referral labels and timeframes match the local pathway.
- [ ] Sudden visual loss and detached-retina actions are appropriate.
- [ ] White-reflex and paediatric actions are appropriate.
- [ ] The probable-mature pattern is sufficiently constrained.
- [ ] Affected-eye and worse-eye VA wording is appropriate for the intended workflow.
- [ ] Competing-pathology wording is safe and sufficiently cautious.
- [ ] Visual-acuity options and mismatch prompts are appropriate.
- [ ] The generated result contains the locally required information.
- [ ] Privacy and information-governance requirements have been reviewed.
- [ ] A named clinical owner accepts future source-review responsibility.

## Approval

- Reviewer name:
- Role and organisation:
- Clinical owner:
- Review date:
- Approved version:
- Decision and limitations:
- Recorded approval reference:

Any later clinical wording, threshold, scoring or routing change requires a new review entry and version increment.
