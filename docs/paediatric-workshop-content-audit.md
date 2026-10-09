# Paediatric Surgical Eye & Ear workshop

Source: `Paediatric Surgical Eye & Ear Workshop (Kids OR).pptx`, supplied on
9 October 2026. The deck has 17 slides, seven embedded PNGs, no embedded videos
and no external lesson links. SHA-256:
`E7CDF24C5993878878EA0BA4176CF4828659F2F2012B67BDBD3A67B5B79C10A3`.
The deck supplies curriculum and images; user requests determine app behaviour.

## Structure and source mapping

Eyes → Workshops starts with **Paediatric Surgical Eye & Ear**, opening
`#/paediatricSurgicalEyeEarWorkshop`. The card uses white/grey heart-and-hands
artwork derived from the user's supplied reference. The title is displayed on two
lines: Paediatric Surgical / Eye & Ear. The five workshop folders
use the existing expanded-folder layout with Intermediate orange accents.
There are 31 lesson rows: six local scrolly lessons, one local MCQ quiz,
23 shared pages and one unavailable animation row. Train and Test sections with
one lesson render as direct rows; Front of Eye and Otoscopy retain nested folders.

Media order is examination scrolly → Full Animation → downloadable PDF →
examination video. Main row titles name the examination skill, with Animation
and PDF appended to the corresponding lesson titles, and (videos) appended to
live examination videos in How to perform. Ear hearing/examination
guides remain ahead of the available otoscopy
media. No otoscopy Full Animation asset exists, so its row stays grey, disabled,
with black “Otoscopy Animation” and white “Coming Soon” inline (no badge),
on a darker grey background and at the same height as active rows.
Workshop structure is an unboxed bullet list.

| Slides | Source content                                            | App treatment                                                                                                             |
| ------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1–2, 6 | Arclight title and workshop structure                     | Local overview, shared Arclight guide and video                                                                           |
| 3      | Front of Eye objectives                                   | Three text-only source objective panels, preserving the previous text layout                                              |
| 4      | Examination media formats                                 | Shared scrolly, Full Animation, PDF and examination video                                                                 |
| 5      | Train/test images: existing content                       | Medical Students anterior cases and Intermediate Case Study, as requested                                                 |
| 7      | Fundal red reflex objectives                              | Three objective panels with normal reflex, cataract and retinoblastoma images                                             |
| 8      | Fundal media formats                                      | Shared scrolly, Full Animation, PDF and examination video                                                                 |
| 9      | Existing fundal train/test                                | Standalone Fundal Reflex Test only, as requested                                                                          |
| 10     | Direct Ophthalmoscopy objectives                          | Headache/neurological, healthy optic disc and swollen/pale nerve objectives with visual-pathway and existing Discs images |
| 11     | Direct Ophthalmoscopy formats                             | Shared scrolly, Full Animation, PDF and examination video                                                                 |
| 12     | Existing optic-nerve train/test                           | Existing diabetic case quiz only, as requested                                                                            |
| 13     | Otoscopy objectives                                       | Symptoms, safe examination and eardrum objectives with existing Ear Care and source ear images                            |
| 14     | Otoscopy media formats                                    | Shared Ear Care video/PDF and disabled animation row                                                                      |
| 15–16  | Normal, hole, CSOM, CSOM & hole, OME and comparison strip | Local image gallery and five-question MCQ quiz                                                                            |
| 17     | Otoscopy train/test                                       | Image gallery, MCQ quiz and shared Ear Care otoscopy practice                                                             |

Source grammar/spelling is lightly normalised. Slide 13 ends after “hole in the”;
the app completes this as “eardrum”. The new objective illustrations use labelled
assets already present in the app. Added quiz questions identify the supplied
appearances using the source options; no treatment recommendations or new diagnostic rules are added.

## Comparison and direct reuse

PEC, Medical Students, Childhood Eye Screening, Diabetic Retinopathy, Glaucoma
and Primary Ear Care already provide core examination resources. This workshop
links directly to their existing pages and retains their media, downloads,
localisation and lesson engines. PDFs are downloadable reference viewers;
Full Animation MP4 pages remain distinct from examination scrolly guides.

| Resource                                | Existing route / target                                                                                                                                     |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arclight guide                          | `medicalStudentsWorkshop / medicalArclightScrollPage`                                                                                                       |
| Arclight video                          | `videos / howToUseArclightVideoPage`                                                                                                                        |
| Front of Eye scrolly                    | `videos / frontOfEyeExaminationScrollPage`                                                                                                                  |
| Front of Eye Full Animation             | `videos / frontOfEyeFullAnimationVideoPage`                                                                                                                 |
| Front of Eye PDF                        | `frontOfEyePdf / frontOfEyePdfPage`                                                                                                                         |
| Front of Eye examination video          | `videos / feFullAnteriorSegmentPage`                                                                                                                        |
| Anterior image cases                    | `medicalStudentsWorkshop / medicalAnteriorSegmentPage`                                                                                                      |
| Intermediate cases                      | `casestudy / casestudyPage`, selects Intermediate, then synchronises `caseStudyChatPage`                                                                    |
| Fundal scrolly                          | `videos / fundalReflexExaminationScrollPage`                                                                                                                |
| Fundal Full Animation                   | `videos / fundalReflexFullAnimationVideoPage`                                                                                                               |
| Fundal PDF                              | `fundalReflexPdf / fundalReflexPdfPage`                                                                                                                     |
| Fundal examination video                | `videos / fundalExamPage`                                                                                                                                   |
| Fundal Test                             | `fundalReflexQuiz / fundalReflexQuizPage`                                                                                                                   |
| Direct Ophthalmoscopy scrolly           | `videos / directOphthalmoscopyScrollPage`                                                                                                                   |
| Direct Ophthalmoscopy Full Animation    | `videos / directOphthalmoscopyFullAnimationVideoPage`                                                                                                       |
| Direct Ophthalmoscopy PDF               | `directOphthalmoscopyPdf / directOphthalmoscopyPdfPage`                                                                                                     |
| Direct Ophthalmoscopy examination video | `videos / directOphthalmoscopyVideoPage`                                                                                                                    |
| Direct Ophthalmoscopy Test              | `videos / diabeticCaseQuizPage`                                                                                                                             |
| Ear lessons                             | `primaryEarCareWorkshop / primaryEarCareLessonPage`, selecting existing `hearing`, `examination`, `otoscopyGuide`, `otoscopyVideo`, `otoscopyPractice` keys |

## Images and regeneration

Source ear assets live in `public/images/learning/PaediatricSurgicalEyeEar/`.
`normal.webp` uses slide 15's larger normal image (`image2.png`). Abnormal images
are cropped from slide 16's `image4.png`–`image7.png` to remove headings/borders;
accessible HTML supplies labels. Slide 16's `image3.png` repeats the normal
example. Slide 15's full comparison strip (`image1.png`) is preserved as
`source-comparison.webp`, including original labels and captions.

Slide 16 calls one image CSOM, while slide 15 calls its corresponding appearance
Red. The gallery preserves both source records. MCQ correct answers follow
slide 16's labels; review displays the source label rather than adding clinical
explanations. The white/grey carousel artwork is
`public/images/icon/eyes/workshop/car_paediatric.webp`.

Objective imagery reuses `images/quiz/fundal-reflex/`,
`images/learning/MedicalStudents/Introduction/`, `images/learning/PrimaryEarCare/`
and Discs `case-01.webp` (normal), `case-02.webp` (swelling), `case-03.webp` (pale).
The existing Discs viewer config supplies those labels.
Front objectives no longer display photographs. The remaining objectives use
the Medical Students Diagnosis of Eye Disease layout (text beside imagery on
desktop, stacked on mobile) and Visual Acuity Practice's orange caption strips.
Paired images share a constrained grid and captions align with their images.
Objective cards fit their content without viewport-height minimums; image frames
follow natural aspect ratios instead of fixed heights. Gallery labels are body
text under the numbered step with the image to the right; the full source
comparison remains available beneath the individual images.

`public/js/paediatricWorkshopData.js` owns the curriculum, copy and mappings.
`scripts/import-paediatric-workshop.mjs` generates static HTML and optionally
converts extracted `ppt/media/image*.png` files:

```powershell
node scripts/import-paediatric-workshop.mjs tmp-kidsor-media
npx prettier --write public/html/paediatricSurgicalEyeEarWorkshop.html
```

Omit the directory to regenerate only HTML. The original PPT and temporary
extraction files are not deployed.

## Runtime contracts

- `paediatricSurgicalEyeEarWorkshop.js` owns folder restore, keyboard activation,
  source hydration, return context and one orange Previous/Next pair. Native
  Ear/Medical caller navigation yields while the paediatric context is active.
  Shared Videos-to-Videos transitions use the existing `showVideosPageById` API,
  ensuring media initialisation and prior-page cleanup. Existing Lottie engines remain
  unchanged. A child-list observer reconciles the same navigation pair after
  shared quizzes/videos replace their content asynchronously.
- Six local lessons use the shared article/image reveal shell and reduced-motion
  support. `paediatricEarQuiz.js` renders five MCQs through the existing quiz
  layout, persists partial answers, validates completion, scores, displays results,
  allows review and restart, and closes its result dialog when leaving. The quiz
  mixes image order and option order, balances correct-answer letters in mixed
  order, persists the exact arrangement with saved answers and reshuffles on
  restart. Validation rejects duplicate or unknown saved ordering IDs. Stable
  source IDs determine scoring, so display order never changes the answer key.
  Original v1 saved answers remain compatible.
  The quiz
  awards completion after all five answers are submitted; earned progress remains
  monotonic after restart.
- Shared Back returns to the restored workshop folder. Intermediate cases select
  the existing Intermediate card and synchronise the chat subpage. Their row
  title is Case Study. Paediatric entry uses the same unlimited mode as PEC:
  ordered cases, revealed images, no intro or time-limit/penalty timers, and the
  same history-question behaviour. Standalone Case Study keeps its normal mode.
  Ear reuse
  selects the existing lesson key without replacing the caller's progress context.
  Return captures the selected folder path before loading the workshop; stale
  route notifications are ignored when they do not match the current route.
- Shared lessons inherit orange key colours through `paediatric-flow-target`.
  The caller class is removed on exit; Primary Ear Care retains its own green
  palette on normal entry. The MCQ asks “Which option best describes this image?”
  and its title, instruction heading and progress layout follow Fundal Reflex Quiz.
- `primaryWorkshopProgress.js` writes orange workshop progress and folder ticks.
  Local lessons also use unified progress keys for My Learning; shared lessons
  retain their owning groups. Saved cards use the new heart artwork.
- New wording has English fallbacks and runtime i18n metadata. Common controls
  reuse existing translations; shared pages retain existing language support.
  New source wording is not a completed multilingual rollout.
- Selective downloads include the new card/ear assets and objective imagery,
  existing case-study images, diabetic quiz cases, shared PDFs/videos, examination
  Lottie stages and selected narration. Removed simulator rows no longer pull
  their mini-app trees into this workshop selection. SW fallback is v93.

## Validation

`tests-e2e/paediatric-workshop.spec.js` covers card artwork, orange styling, row
order and titles, singleton sections, objective images, shared media and case
returns, one Ear navigation pair, disabled row height, quiz scoring/persistence/
review/restart, responsive overflow, My Learning and reduced motion.
`tests/paediatric-ear-quiz.test.js` covers scoring and saved-state integrity;
`tests/paediatric-workshop-offline.test.cjs` covers selective assets. Final build
and test results are recorded in `memory-bank/progress.md`.
Browser checks do not establish physical-device audio quality or clinical review.
