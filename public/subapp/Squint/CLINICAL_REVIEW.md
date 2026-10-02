# Clinical review status

## Authorised follow-up — 30 September 2026

No additional production logic change was made after the four-app review. Current simulator contracts and the amended source parity baseline pass. The earlier 30 September review recorded 68/68 preset audits over HTTP and direct-file routes. Preset recognition, pixel offsets and animation behaviour are teaching mechanisms, not independently validated patient diagnosis.

User authorisation to implement is not independent clinical approval. Clinical sign-off and physical-device acceptance remain pending. See `../CLINICAL_LOGIC_FIXES_20260930.md` for fresh evidence and its limits. Earlier entries below retain their historical scope.

## Dependency, guidance and preset-filter follow-up — 24 July 2026

This pass changed control availability, explanatory wording and catalogue navigation only. Nystagmus Direction, Waveform and Rate retain their established values and preset behaviour. The neutral observation no longer implies a completed assessment and preset filtering does not alter the catalogue. No condition rule, threshold, urgency action, preset content, gaze vector, cover calculation, pupil model or eye geometry changed. Both 68-preset audits pass. Independent clinical sign-off remains not established.

## Result and Advanced-panel presentation follow-up — 24 July 2026

This pass changed presentation and examination-state separation only. Friendly neutral wording, separate Pattern and Observations rows, released-cover clearing on a later gaze action, orientation guidance and the Advanced control hierarchy were reviewed through HTTP and direct-file workflows. No condition rule, threshold, preset, gaze vector, cover calculation, pupil model or urgency wording changed. Both 68-preset audits still pass. Independent clinical sign-off remains not established.

## Interaction, safety wording and teaching-bank review — 24 July 2026

The approved engineering review made these further teaching changes:

- cover-uncover, alternate cover, under-cover drift and uncover recovery are now identified separately in the result notes
- fixation transfer and latent drift wait until the visible cover paddle has settled
- `Near` adds small visual convergence while retaining the established pupil-response models
- generic pupil edits clear preset-specific reactivity, RAPD and pupil models
- new pupil-involving and apparently pupil-sparing 3rd nerve patterns retain urgent neurovascular wording, because pupil sparing does not safely exclude compression
- the Horner preset uses mild rather than moderate ptosis
- traumatic miosis asks the learner to consider traumatic iritis or iris-ciliary injury
- preset and MCQ levels were rebalanced, with no preset removed

Automated review confirms internal consistency, interaction sequencing and the absence of runtime errors. It does not constitute independent clinical sign-off.

## Condition-logic engineering review — 24 July 2026

The engineering audit changed clinical teaching logic and wording in a constrained set of places:

- plain esotropia no longer establishes 6th nerve palsy without an abduction deficit
- plain miosis no longer establishes Horner syndrome without supporting context
- small anisocoria wording now requires reaction, light/dark and stability checks
- A-pattern exotropia is greater in downgaze and V-pattern exotropia is greater in upgaze
- 3rd nerve, 4th nerve, INO, Duane, DVD, myasthenic and nystagmus presets now demonstrate their relevant dynamic signs more faithfully
- Adie and Argyll Robertson presets can demonstrate a near response while pharmacological mydriasis remains fixed
- acute angle-closure pain guidance now directs immediate ophthalmic assessment

Reference checks used [AAO Pattern Strabismus](https://eyewiki.aao.org/Pattern_Strabismus), [AAO Abducens nerve palsy](https://eyewiki.aao.org/Abducens_nerve_palsy), [AAO Acquired Oculomotor Nerve Palsy](https://eyewiki.aao.org/Acquired_Oculomotor_Nerve_Palsy), [EyeWiki Nystagmus](https://eyewiki.org/Nystagmus), [EyeWiki Myasthenia Gravis](https://eyewiki.org/Myasthenia_Gravis), [AAO Argyll Robertson Pupils](https://eyewiki.aao.org/Argyll_Robertson_Pupils), [EyeWiki Adie Pupil](https://eyewiki.org/Adie_Pupil), [AAO Horner Syndrome](https://eyewiki.aao.org/Horner_Syndrome), [AAO Duane Retraction Syndrome](https://eyewiki.aao.org/Duane_Retraction_Syndrome) and [EyeWiki Hypertropia](https://eyewiki.org/Hypertropia).

Automated checks confirm internal consistency across all 68 presets. This is not an independent clinical review and does not establish clinical sign-off.

## Engineering correction — 24 July 2026

Normal conjugate gaze from the trackpad is no longer treated as a primary-position deviation. At that gaze-only correction stage, direct iris drag, presets, cover behaviour, condition hints, modifiers and urgency wording were unchanged. The later condition-logic review above deliberately supersedes that statement where it identifies specific teaching-logic and wording changes. Automated engineering evidence confirms preserved Brown, Duane, A-pattern and cranial-nerve teaching behaviour. This correction does not constitute independent clinical sign-off.

Baseline engineering review date: 23 July 2026

Status: **independent clinical sign-off not established**.

The original 23 July engineering upgrade did not change simulator maths, analysis rules, teaching presets, output wording or MCQs. The later 24 July condition-logic review above deliberately made the recorded corrections. Refactor parity still passes. Engineering parity does not constitute clinical approval. The initial normal output is deliberate teaching state and must not be interpreted as a recorded patient examination.

The 23 July review correction added keyboard-equivalent input, cover-state announcements, focus repair and update handling only. It did not change clinical thresholds, condition labels, preset values or teaching answers.

The eye-engine follow-up corrected RE/LE labels and readout order, added fade-button state exposure and clarified the resting torch visually. It did not change alignment, motility, pupil, cover, gaze or analysis logic.

## MCQ review record — 26 July 2026

Engineering review covered all 47 authored MCQs. Contracts now require stable IDs, one keyed answer, rationales, source metadata and review status. The ambiguous first cover-uncover prompt was revised under its existing `squint-primary-01` ID and `aao-cover-tests` source so fixation and observed movement are explicit. Sources recorded are AAO EyeWiki Cover Tests, Anisocoria, Acquired Oculomotor Nerve Palsy and Basic Approach to Diplopia plus the app-scope record. No condition preset, analysis threshold, attempt score or simulator behaviour changed. Independent clinical sign-off remains pending.

The final spot-check retained `squint-intermediate-11` and `squint-advanced-22` while replacing repeated emergency and dissociation content with fixation-target discipline and prism neutralisation under `aao-cover-tests`. It also corrected `squint-primary-10` from the motility source to `aao-neuro-pupil-reference` because the question assesses direct and consensual light responses. These records support review but do not establish clinical approval.
