# Squint condition review — 29 September 2026

Initial review followed by user-authorised corrections. Independent clinical sign-off remains pending. The findings and initial verification below describe the pre-fix audit; see the implementation receipt at the end for subsequent work.

## Scope and evidence

All 68 authored presets were inventoried and their configuration, interpretation and tier reviewed against the source. The existing browser audit passed 68/68 over HTTP and direct-file loading at temporary 360 x 740, with no captured runtime errors. Contracts and refactor parity passed.

Evidence is in `output/playwright/squint-condition-audit-review-20260929.json` and `squint-condition-audit-file-review-20260929.json`. Additional diagnostic scripts are `tests/review-all-20260929.mjs` and `tests/review-focused-20260929.mjs`. These are audit helpers, not runtime changes.

The focused audit measured all 21 pupil/third-nerve presets under RE light, LE light and near stimulation. It also measured signed nystagmus displacement, normal eccentric-gaze cover behaviour, illumination of a covered eye and manual interpretation. Evidence: `output/playwright/focused-review-20260929.json` and its 360 x 740 screenshot. The expanded all-condition sweep records nine gaze positions, near, both covers, uncover and reset. Its exploratory viewport was not pinned, so it is not evidence of 360 x 740 visual acceptance. Temporary browser metrics disappear on debugger detach.

## Confirmed findings

1. **Overconfident manual diagnosis (high priority).** `analysis.js` returns definite third-nerve palsy from down/out, ptosis and a large pupil and definite fourth-nerve palsy from a large up/out displacement. Neither a larger drag nor that small sign set establishes a definitive diagnosis. Retain useful differential suggestions and safety cues but remove certainty based on displacement size. Focused browser evaluation reproduced both statements.
2. **Reversed nystagmus fast phases (high priority).** The jerk waveform moves slowly from negative to positive then quickly back to negative. Direction multipliers assume the reverse convention. Latent nystagmus with RE covered labels movement towards LE but the faster displacement is screen-left. Right-gaze nystagmus labels right-beating but moves faster leftwards. INO fellow-eye nystagmus in left gaze moves faster rightwards. Existing tests verify label reversal and movement amplitude, not the actual fast-phase direction. See `src/eye-effects-controller.js:103-125`.
3. **Cover handover cancels target gaze.** `computeFixationOffset` cancels `gazeOffset`. Measured normal rightward gaze of +19.6 px acquired a roughly -19.8 px fixation correction, returning the eye towards centre rather than retaining the eccentric target. The observation can still say no refixation movement.
4. **Light passes through the cover in the model.** `getSideStimulus` ignores cover state. Both pupils remained constricted after covering the illuminated eye. Suppress afferent drive from the occluded eye, not the consensual response to light entering the other eye.
5. **Alternate-cover description is overwritten.** The later fixation callback says Cover-uncover even after a direct cover switch. Preserve the test phase across timers.
6. **Dilated display mode clears findings.** The toggle resets pupil physiology and RAPD, while switching it off restores default sizes rather than the previous configuration. Separate display state from the clinical teaching state and restore prior values.
7. **Near convergence is unconditional.** All presets receive the same 4 px inward shift. Respect the third-nerve and relevant restrictive model, but preserve convergence in the intended INO example. INO does not generally require loss of convergence.
8. **Vertical phoria needs a consistent relative-eye model.** Decompensating hyperphoria makes whichever eye is covered drift upwards; hypophoria makes either eye drift downwards. Named right/left hyperphoria moves only the named eye. This does not consistently express one relative vertical deviation across alternate fixation. Distinguish it from DVD, where dissociated upward drift is intentional. A qualified reviewer should agree the affected/fixing-eye convention before implementation.

## Condition-family review

| Presets covered                                                                                                 | Assessment                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Exotropia and esotropia, small/medium/large; hypertropia and hypotropia, small/medium; mixed squint             | Configured directions and magnitude ordering are consistent. Generic eso does not automatically diagnose sixth palsy. Shared cover and manual-diagnostic defects remain.                                                                       |
| Third-nerve, pupil-sparing third and compressive third                                                          | Down/out, ptosis and appropriate pupil distinctions configured; adduction/elevation/depression restricted. Urgency wording retained. Near and cover interactions need correction.                                                              |
| Sixth-nerve and small/medium partial sixth                                                                      | Esodeviation and graded abduction limitation are coherent.                                                                                                                                                                                     |
| Fourth-nerve                                                                                                    | Higher eye, extorsion and greater depression-in-adduction deficit are represented. Head tilt only rotates the scene and supplies a history cue; it does not simulate a full Bielschowsky response.                                             |
| Small exophoria/esophoria; four decompensating phorias; right/left hyperphoria                                  | Horizontal latent drift and delayed recovery are implemented. Vertical relative-eye behaviour needs correction. Count-based decompensation and five-second recovery are teaching timings, not clinical thresholds.                             |
| Severe/moderate/slight ptosis                                                                                   | Size ordering is consistent; ptosis alone remains a pattern, not a specific diagnosis.                                                                                                                                                         |
| Unilateral/bilateral large or small pupils; benign anisocoria                                                   | Broad size and reactivity examples are coherent. Benign anisocoria copy asks for normal reactions and stability rather than asserting a diagnosis from size alone.                                                                             |
| Horner                                                                                                          | Mild ptosis, miosis, reduced dark dilation and lag are explicitly modelled. Not a pharmacological diagnostic test.                                                                                                                             |
| Adie; Argyll Robertson; pharmacological mydriasis/miosis                                                        | Poor light versus stronger near responses and fixed pharmacological mydriasis measured. Drug examples are particular illustrative phenotypes, not every drug mechanism.                                                                        |
| RE/LE RAPD, marked/subtle                                                                                       | Correct side mapping and common bilateral pupil drive; marked defects reduce constriction more than subtle defects. Cover/light defect remains.                                                                                                |
| Traumatic mydriasis, miotic pupil and peaked pupil; acute angle closure                                         | Configured morphology/reactivity and context-specific warnings align with intended teaching cases. Keep the deliberate exaggerated oval.                                                                                                       |
| Myasthenic; thyroid restrictive; INO                                                                            | Myasthenic variability with spared pupils and limited thyroid elevation model are explicit. INO has adduction limitation and fellow-eye nystagmus, but its fast-phase sign is wrong. Preserve INO convergence.                                 |
| Four RE/LE intorsion/extorsion cases                                                                            | Eye mapping and rotation directions are consistent. Scene rotation is not evidence of a particular nerve palsy.                                                                                                                                |
| Horizontal slow/fast jerk, horizontal pendular, vertical jerk, mixed pendular, latent and gaze-evoked nystagmus | Basic wave/axis distinctions exist. Condition-specific jerk direction is reversed. Pure upgaze in the horizontal gaze-evoked case is also rendered horizontally: a model limitation rather than a complete vertical gaze-evoked demonstration. |
| A/V esotropia and A/V exotropia                                                                                 | All four up/down direction relationships agree with intended patterns. Pixel changes are not prism-dioptre measurements.                                                                                                                       |
| Brown; Duane I; DVD                                                                                             | Elevation-in-adduction restriction, Duane abduction limitation/fissure narrowing and DVD under-cover upward drift/extorsion are present. These remain limited examples, not comprehensive variants.                                            |

## Tiers

Primary contains 10, Intermediate 14 and Advanced 44 presets. The current scheme mixes introductory obvious signs with increasingly subtle findings and complex mechanisms. Small deviations in Advanced and large deviations in Primary are defensible on recognition difficulty. Urgency is not the same as teaching difficulty, so the urgent third-nerve example need not be moved from Primary. No mandatory tier moves identified. This review did not re-audit every MCQ.

## Final verification receipt

- Expanded interaction sweep completed for all 68 presets: nine gaze positions, near, both cover sides, uncover and internal reset. This expanded sweep used a desktop viewport, not the retained device toolbar.
- The existing 68-preset HTTP and direct-file audits passed at temporary 360 x 740. Focused measurements covered 21 pupil/third-nerve cases with actual torch positions and near at temporary 360 x 740.
- Internal reset cleared preset, cover and RAPD state but could leave the previous cover observation in the rendered result until another output update. The user-facing New session action reloads the page, so this is not evidence that New session retains the previous case.
- Retained Squint tab verified through real browser chrome at 360 x 740, switched to Mires and back, then both dimensions and the intended Squint URL re-read successfully.
- No production code was changed in this audit.

## Clinical references

- https://eyewiki.aao.org/Cover_Tests
- https://eyewiki.aao.org/Nystagmus
- https://eyewiki.aao.org/INO
- https://eyewiki.aao.org/Cranial_Nerve_4_Palsy
- https://eyewiki.aao.org/Brown_Syndrome
- https://eyewiki.aao.org/Duane_Retraction_Syndrome
- https://eyewiki.aao.org/Pattern_Strabismus
- https://eyewiki.aao.org/Horner_Syndrome
- https://eyewiki.aao.org/Adie_Pupil
- https://eyewiki.aao.org/Reflexes_and_the_Eye

Engineering/source review and browser measurements do not constitute independent clinical sign-off or physical-device acceptance.

## Implementation receipt — 29 September 2026

All eight findings received narrow source fixes. The generic vertical decompensation examples now use patient RE as the affected eye, consistent with the original preset diagnostic hint. Fellow-eye drift reverses when fixation changes, preserving relative vertical misalignment. DVD is unchanged. Near gains reuse the authored third-nerve (0.16) and Duane (0.72) adduction gains rather than inventing new clinical thresholds. INO convergence is preserved.

Dilated enlarges the visual baseline without editing underlying pupil sliders, models, reactivity, RAPD or hints. Switching it off restores the authored baseline. Normal eccentric gaze survives cover handover. Direct light through a covered eye has zero afferent drive while the uncovered eye can still drive both pupils. Reset refreshes outputs and invalidates queued fixation callbacks so an old cover note cannot reappear.

New regression: `tests/interaction-regression.mjs`. Existing parity has three explicitly reviewed wording changes only: definite third becomes probable and displacement-only fourth becomes possible. Layout, 68-preset tier ownership, urgency cues and the deliberately exaggerated acute-angle-closure oval are preserved.

Verification on corrected source:

- Contracts, JavaScript syntax checks and the narrowly amended parity baseline pass.
- Existing 68-preset condition audits pass on HTTP and direct-file routes at temporary 360 x 740: `squint-condition-audit-fixes-20260929.json` and `squint-condition-audit-file-fixes-20260929.json`.
- All eight interaction regression groups pass on both routes, including a delayed reset check. Evidence: `interaction-regression-http.json` and `interaction-regression-file.json`, with no captured runtime/console errors.
- The normal eccentric-gaze test retains +19.6 px target gaze with less than 1 px correction. Covering the illuminated eye releases constriction; lighting the fellow eye restores bilateral constriction. Signed nystagmus samples verify fast-phase direction rather than trusting labels.
- Mobile UI workflows pass on HTTP and direct-file routes. A concurrently running direct-file UI test initially missed animation completion; the isolated sequential repeat passed without changing the animation or loosening assertions. Evidence: `squint-mobile-report-fixes-20260929.json` and `squint-mobile-report-file-fixes-20260929.json`.
- The retained Codex Squint tab was refreshed with `20260929-logic2` assets. Real toolbar values were 360 x 740 before, after and on return from Mires, with the intended URL re-read. The retained screenshot was visually inspected.
- README and app memory-bank notes updated. No physical-device acceptance or independent clinical approval is claimed.
- Final expanded sweep completed for all 68 presets at temporary 360 x 740. All nine gaze positions, near, RE cover, LE cover, uncover and reset were recorded. Saved evidence validation confirmed 68 entries, nine gaze states each, finite pupil sizes, valid transforms, non-empty outputs and cleared reset state/observations throughout. Evidence: `all-condition-fixed-20260929.json`.
