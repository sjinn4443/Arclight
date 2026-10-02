# Diabetic Clinical Review

## Authorised engineering corrections — 29 September 2026

Corrected missing-VA reassurance, omitted view limitations, unrecorded findings/dilation and teaching-to-patient state leakage. BIO now uses an inverted retinal image with corresponding edge labels. Added a severity limitation for venous beading and an acute visual-loss scope statement. Nine MCQs were refined, including missing-data, acute-presentation and combined-risk scenarios. Existing priorities and referral timescales remain unchanged.

This is not independent clinical sign-off. The simplified NPDR model still cannot formally grade extent or apply a full severity scheme. The app is not an acute visual-loss triage tool. Review these limitations, every teaching image and the local referral pathway before clinical approval.

**Status:** Pending independent clinical sign-off  
**Engineering review:** 26 July 2026

The v1.1 assessment pass did not change clinical thresholds, priority ordering, action labels, referral timescales or referral wording. Automated regression tests protect the established incomplete, routine screening, ungradable, routine referral, soon and urgent pathways.

The 26 July MCQ pass corrected one malformed multi-answer item and tightened wording about the earliest visible sign, cotton-wool spots, venous beading and app scope. It added stable IDs, concise explanations and explicit source-status metadata without changing the app's operational triage engine.

Lesion terminology was checked against the current NHS Diabetic Eye Screening Programme grading definitions:

- https://www.gov.uk/government/publications/diabetic-eye-screening-retinal-image-grading-criteria/nhs-diabetic-eye-screening-programme-grading-definitions-for-referable-disease-start-date-october-01

The app's LMIC referral timings remain app-specific and pending review. They were not inferred from NHS pathway timings.

An authorised clinical reviewer should separately assess the triage rules, referral wording, VA interactions, systemic prompts, image labels and MCQ content before clinical approval is recorded.
