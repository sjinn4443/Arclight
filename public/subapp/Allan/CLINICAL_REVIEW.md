# Allan clinical review record

## Current status

29 September 2026 follow-up: user-approved audit wording corrections implemented. NICE NG12 1.7.1 rechecked for the suspicious pigmented lesion weighted-checklist question: refer at 3 or more. This is not applied to Allan's different teaching total. Operational lesion results now carry a concise clinical-concern override, SCC wording denotes a concerning lesion and the emergency choice includes unwell non-blanching rash. Low-priority incomplete rash results request a red-flag check without suppressing recorded urgent findings. Independent clinical approval is still pending.

- App version: `1.2`
- Source traceability updated: `10 July 2026`
- Independent clinical sign-off: **Pending**
- Deployment status: **Not approved for unsupervised clinical deployment**

The implementation has been checked for internal consistency against the sources below. This engineering review is not a substitute for approval by a suitably qualified GP, dermatologist or local clinical-safety lead.

## Source set

- [NICE NG12: suspected cancer referral recommendations for skin cancers](https://www.nice.org.uk/guidance/ng12/chapter/Recommendations-organised-by-site-of-cancer#skin-cancers) — guideline last updated 15 April 2026
- [RACGP: Dermatoscopy in routine practice — Chaos and Clues](https://www.racgp.org.au/afp/2012/july/dermatoscopy-in-routine-practice/)
- [NICE CG183: drug allergy recommendations](https://www.nice.org.uk/guidance/cg183/chapter/recommendations)
- [NHS: anaphylaxis](https://www.nhs.uk/conditions/anaphylaxis/)
- [DermNet: Wood lamp skin examination](https://dermnetnz.org/topics/wood-lamp-skin-examination)

## Sign-off checklist

- [ ] Referral labels match the intended local pathway names and timeframes.
- [ ] Melanoma, BCC and SCC prompts are clinically safe for the intended users.
- [ ] Chaos and Clues wording is suitable for the users' dermoscopy training level.
- [ ] Rash same-day and emergency triggers are complete and appropriately worded.
- [ ] Wood lamp fluorescence wording is sufficiently cautious and does not imply a stand-alone diagnosis.
- [ ] Image quality requirements match the receiving referral service.
- [ ] Privacy wording matches local consent, retention and information-governance policy.
- [ ] The generated report contains the locally required fields.
- [ ] A named clinical owner accepts responsibility for future source review.

## Approval

- Reviewer name:
- Role and organisation:
- Review date:
- Approved version:
- Decision and limitations:
- Signature or recorded approval reference:

Any clinical wording or routing change after approval requires a new review entry and an app-version increment.

## MCQ source audit — 26 July 2026

- Reviewed all 53 Primary, Intermediate and Advanced prompts, answers, distractors, explanations and source labels.
- Rechecked the melanoma weighted 7-point threshold, dermoscopy referral, SCC and BCC wording against current NICE NG12.
- Rechecked severe drug-reaction features and timing against NICE CG183.
- Rechecked lesion-image expectations against current NHS England teledermatology guidance.
- No clinical wording, answer key, tier or pass-mark change was indicated by this engineering source audit.
- Stable IDs and a `Source-labelled; independent clinical sign-off pending` status were added for auditability only.

Independent approval by the named clinical owner remains pending.
