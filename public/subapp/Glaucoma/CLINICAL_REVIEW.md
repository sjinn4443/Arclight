# Glaucoma Clinical Review

## Authorised follow-up — 30 September 2026

C/D 0.9–1 still displays `END-STAGE`; the black final grid column, point weights and referral timings are unchanged. Reduced vision or abnormal pupils now retain a separate assessment cue alongside END-STAGE or EMERGENCY rather than replacing either. Fresh tests include 60 end-stage combinations and six concern/urgency cases. Build, lint, tests, exact rebuilt-bundle parity and HTTP/direct-file mobile checks pass with no captured runtime errors or horizontal overflow.

User authorisation to implement is not independent clinical approval. Clinical sign-off and physical-device acceptance remain pending. See `../CLINICAL_LOGIC_FIXES_20260930.md` for fresh evidence and its limits. Earlier entries below retain their historical scope.

## Approved engineering follow-up — 29 September 2026

The user authorised the logic corrections in `LOGIC_REVIEW_20260929.md`. Preserve the approximate LMIC workflow rather than impose a NICE pathway. Concerning partial findings now use existing advice; near-total cupping cannot be downgraded by large-disc selection and END-STAGE persists alongside urgency. Reduced VA/pupil findings receive a separate assessment cue. Acute symptoms must not use routine grid intervals. These changes, the original point weights and local timescales still require independent clinical sign-off. Engineering tests do not establish clinical validity.

**Version:** v1.1  
**Engineering review date:** 25 July 2026  
**Independent clinical sign-off:** Pending  
**Deployment status:** Not approved by this engineering review  
**Clinical owner:** Pending  
**Named reviewer:** Pending

## Engineering Scope

The approved engineering follow-up corrected an overlapping IOP category, added a minimum referral floor for suspicious rim or field findings and clarified end-stage action. A later workflow clarification keeps eye laterality optional so the calculator can still make its intended approximate judgement from limited information. The report reproduces entered findings and the existing output without changing clinical scoring. These safety-oriented engineering changes have not received independent clinical sign-off.

The floor is consistent with the principle that optic nerve head damage or a glaucomatous field defect warrants referral. NICE also uses `24 mmHg` as the threshold for referral based on Goldmann-type applanation tonometry. The app's full scoring model, palpation substitutions and referral timescales remain app-specific and require a named clinical reviewer.

Reference points:

- NICE NG81 recommendations: https://www.nice.org.uk/guidance/ng81/chapter/Recommendations
- NHS Highland acute angle-closure guidance: https://www.rightdecisions.scot.nhs.uk/tam-treatments-and-medicines-nhs-highland/adult-therapeutic-guidelines/eyes/ophthalmology-emergencies-guidelines/acute-angle-closure-glaucoma-guidelines/
- European Glaucoma Society terminology and guidance: https://pmc.ncbi.nlm.nih.gov/articles/PMC5583682/

## Review Checklist

- [ ] `≤20`, `21-24`, `25-29` and `≥30` boundaries reviewed.
- [ ] Suspicious rim and field minimum referral floor reviewed.
- [ ] Terminology and C/D, disc-size and risk-factor weights reviewed.
- [ ] Routine, soon, urgent, end-stage and emergency wording and timescales reviewed.
- [ ] Palpation substitution and measured-IOP precedence reviewed.
- [ ] Optional laterality and report wording reviewed.
- [ ] Images and teaching explanations reviewed.
- [ ] Referral timescales reviewed against intended local pathway.
- [ ] Independent reviewer and clinical owner recorded.

Any later clinical wording, threshold or routing change requires a new review entry and version increment.

## MCQ source review — 26 July 2026

The 38-question bank now records stable IDs, rationales, source keys and source-review status. General case-finding content was checked against NICE NG81:

https://www.nice.org.uk/guidance/ng81/chapter/Recommendations

Questions about app-specific weighting, grid zones, category boundaries and referral wording are explicitly marked pending independent clinical sign-off. Interface and calculator-mechanics questions were replaced with NICE NG81 content covering case-finding, Goldmann-type applanation tonometry, standard automated perimetry, repeat measurements, central corneal thickness, gonioscopy, baseline optic-nerve imaging and structural/functional interpretation. One explicit sparse-information LMIC dark-grey/end-stage item remains as an app-specific learning objective pending independent sign-off. No risk score, threshold, referral floor or action wording changed.
