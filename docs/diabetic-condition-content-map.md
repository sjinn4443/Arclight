# Diabetic Retinopathy: Conditions and Workshops

Conditions is a disease reference with Primary, Intermediate and Advanced learning
levels (as used by Cataract and Glaucoma). Workshops is an ordered course with
Introduction, diabetes/retinopathy, NCD clinic integration, protocol, DO/BIO and
Assessment folders. Its course navigation returns learners to workshop folders.

The Conditions card opens `videos/diabeticRetinopathyPage`, independently of the
Workshop card. It provides 22 existing lessons:

| Condition level                             | Content                                                                                                   | Existing owner                                                 |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Primary: understand diabetes and sight loss | What is Diabetes, Types of Diabetes, What is Diabetic Retinopathy, Vision Loss in Diabetes                | `diabeticRetinopathyWorkshop.html` scroll lessons              |
| Primary                                     | Causes of Loss of Vision                                                                                  | `videos.html` diabetic video                                   |
| Intermediate: screening and referral        | Screening DR and Other Eye Diseases; all six protocol lessons, including consultation and final decisions | `diabeticRetinopathyWorkshop.html`                             |
| Advanced: examination and assessment        | Three DO scroll lessons and three BIO scroll lessons                                                      | Existing `diabetic*.html` examination routes                   |
| Advanced                                    | DO and BIO PDF references                                                                                 | Existing DO/BIO PDF routes                                     |
| Advanced                                    | Tap the correct structure; Case Quiz                                                                      | `videos.html`, initialized by `diabeticRetinopathyWorkshop.js` |

Course introduction, equipment package and NCD service implementation remain in
the workshop. The condition reference prioritizes understanding, examination and
referral instead of duplicating the course. Clinical text, images, animations,
videos, answer keys and progress records are reused without changes.

Lesson rows have unique accessible title IDs and English/Korean labels. Shared
progress remains under the original target IDs. A session-scoped origin records
the selected route and target, preserves Conditions Back after reload, and
suppresses workshop Previous/Next only for that condition launch. A different
route or lesson clears the origin. Normal workshop navigation remains intact.

The condition download includes the reused diabetic assets plus DO/BIO images,
scroll animations and narration. No new media files are required.
