# Clinical Review Status

_Reviewed for engineering consistency: 25 July 2026_

Sauron is an educational retinoscopy simulator. It is not a final refraction tool and does not provide referral or treatment decisions.

## v1.1 engineering review

- Simulator maths, case content, MCQ content and timed-test selection were preserved.
- The eye-engine follow-up exposed the existing radial pupil target for testing and clarified RE/LE control names without changing response timing or dense-cataract rendering.
- The 25 July teaching follow-up moved low astigmatism to Intermediate, posterior subcapsular cataract to Advanced, dense cataract to Intermediate and vitreous floaters to Intermediate.
- Concise warning notes are now attached only to ACG, leucocoria, vitreous haemorrhage and partial retinal detachment. They are teaching prompts, not referral decisions.
- The exaggerated vertical ACG oval remains a deliberate teaching visual at the user's direction. The warning now states that it is stylised and not a diagnostic pupil shape.
- Timed-test corrections affect answer concealment and Baby-mode scope only. They do not change retinoscopy calculations, generated case axes or revealed answers.
- The safety-dialog correction changes accessibility state only.
- Automated contracts confirm that the configured refraction cases and visual catalogue remain aligned and that every thumbnail resolves locally.
- Teaching material remains separate from operational clinical decisions.

## Approval status

Independent clinical sign-off is **pending**. Engineering verification must not be interpreted as clinical approval. A suitably qualified reviewer should separately assess the four tier placements, warning wording, reflex movement, pathology representations, terminology and MCQ answers before externally governed clinical teaching use.

## MCQ review record — 26 July 2026

Engineering review covered all 26 authored MCQs. Contracts now require stable IDs, one keyed answer, rationales, source metadata and review status. The small-pupil wording was narrowed to safe examination preparation and any dilation remains conditional on appropriateness and authorisation. Simulator-specific pathology observations are labelled as such. Sources recorded are AAO EyeWiki Retinoscopy, the tested optics contract and the app-scope record. Pathology visual items and the app-scope wording remain pending independent clinical sign-off. No optics formula, case parameter, pass mark or simulator behaviour changed.
