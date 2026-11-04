# Cataract quiz: reflex and retinal-view review

Reviewed 4 November 2026. Scope: all eight quiz histories, answer explanations,
retinal source images, laterality and visibility through lens opacity.

Lens opacity can weaken the red reflex and impede fundus examination. Dense
opacity may prevent examination altogether; focal opacity can leave a clearer
view through another part of the pupil. These principles are supported by
[King's College London cataract assessment teaching](https://ehealth.kcl.ac.uk/tel/ophthalmology/content/unit-07/01-cataract/05-assessment.html)
and the [AAO cataract assessment chapter](https://store.aao.org/media/resources/0230062U/p69-74_BO10e_cropped_lores.pdf).

The rendered haze is a qualitative teaching illustration, not a measured
relationship between reflex brightness and retinal visibility. Reflex appearance
also depends on examination conditions; it cannot by itself establish lens
subtype, exclude posterior disease or determine referral timing.

| Case ID              | Consistency review and resulting change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `child-white-reflex` | Unilateral white pupil and poor fixation remain an urgent paediatric ophthalmic presentation. The affected retinal view is obscured and the fellow eye remains clear. The explanation does not equate leukocoria with cataract or assume a healthy hidden retina; retinoblastoma must be excluded. See [Moorfields' abnormal-reflex referral pathway](https://www.moorfields.nhs.uk/for-health-professionals/childrens-eye-conditions-management/absent-uncertain-red-reflex) and [AAO retinoblastoma differential](https://www.aao.org/education/disease-review/review-of-retinoblastoma).             |
| `nuclear`            | Gradual painless blur and a dull reflex are suggestive, not confirmation of nuclear cataract. Both retinal views now have diffuse reduced clarity. Removed the implication that 6/36 is a universal referral threshold: function and patient preference also matter. See [NICE cataract referral guidance, 1.2](https://www.nice.org.uk/guidance/ng77/chapter/recommendations).                                                                                                                                                                                                                         |
| `cortical`           | Spoke-like reflex defects and glare remain consistent with cortical opacity. The more affected eye has mild haze; the fellow eye can retain a clearer fundus view through less obstructed media. The explanation distinguishes a normal-looking visible retina from exclusion of all retinal disease. See the cataract assessment teaching above.                                                                                                                                                                                                                                                       |
| `subcapsular`        | Central reflex defect, glare and reading difficulty support a posterior subcapsular pattern. Added central haze only to the affected eye, retained the clear fellow eye and clarified that lens examination must confirm the subtype. See the cataract assessment teaching above.                                                                                                                                                                                                                                                                                                                       |
| `mature`             | White lens opacity with severe gradual visual loss can obscure both fundus views. No retinal structures are displayed. Removed the unsubstantiated N36 near-acuity entry when the history records only hand-movement vision. The explanation retains a provisional diagnosis and mentions possible ultrasound assessment of the hidden posterior segment. See the AAO cataract assessment chapter above.                                                                                                                                                                                                |
| `detached`           | Acute painless shadow/curtain and visual loss remain a same-day retinal referral. The right-eye fundus reference is edited to show a raised retina with folds. This replaces the diagram and is clearly recorded as a synthetic educational image rather than a patient photograph. Its optic disc remains to the right of the macula. A preserved reflex cannot rule out detachment. See [NEI retinal-detachment guidance](https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/retinal-detachment) and [AFP examination limitations](https://www.aafp.org/afp/2004/0401/p1691). |
| `cupping`            | Both retinal views now have lens-related diffuse haze, with the cup still discernible. Cupping is suspicious rather than diagnostic of glaucoma; the explanation now includes IOP, fields and optic-nerve evaluation. See [NICE glaucoma assessment guidance](https://www.nice.org.uk/guidance/ng81/chapter/Recommendations).                                                                                                                                                                                                                                                                           |
| `retinal-disease`    | The existing Diabetic app asset `case-03` is labelled NVD + NVE, not nonspecific scarring. Updated the history, answer and next step to proliferative diabetic retinopathy requiring urgent retinal specialist assessment, with mild superimposed lens haze. See [NICE PDR treatment guidance, 1.5](https://www.nice.org.uk/guidance/ng242/chapter/Recommendations) and [NSW Health referral criteria](https://www.health.nsw.gov.au/outpatients/referrals/Pages/diabetic-retinopathy.aspx).                                                                                                            |

Implementation: `retinalViews` defines each eye's teaching clarity separately
from the underlying retinal finding. `CATARACT_QUIZ_BACK_SOURCE_EYES` records
source orientation. Obscured views hide the retinal image rather than presenting
a blurred normal retina as evidence of normality. The original simulator engine
is unchanged; the PDR quiz uses a specific urgent `nextStep` to avoid losing the
urgency contained in its reference image.

Image provenance: `public/images/quiz/cataract/retinal-detachment-reference-v2.webp`
was made with built-in Imagegen using the earlier edited fundus image as the
edit target and the user's retinal tear/detachment photograph as a visual
reference. The pale folded retina and visible tear follow that reference while
the right-eye orientation is preserved. The source path and full final prompt are recorded
in `public/images/quiz/cataract/sources.json`. The generated PNG is retained in
Codex's generated-images directory. The app asset is a 512px WebP conversion.
The edit is an illustrative representation of retinal elevation and folds rather
than a validated clinical image. The source-based review does not establish the
diagnostic accuracy of generated pixels.

Quiz explanations and next steps use short British English sentences without
Oxford commas. The detailed source review is kept here rather than repeated in
the answer dialog.
