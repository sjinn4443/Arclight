# Ears curriculum and source mapping

Imported from `2. Ears-20261104T094801Z-1-001.zip`, supplied by the user.
The archive contains 26 files: 18 PDFs, three PowerPoint decks, one Word
document and four MP4 files. Two MP4s are byte-identical. The app therefore
provides three unique recordings, 15 topic pages and 51 learning entries.

## Curriculum order

| Category                    | Cards, in reading order                                                                                                      |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Exam: Extent Ear & Otoscopy | Ear Health & Anatomy; History & Examination; Otoscopy; Tympanic Membrane; Common Ear Conditions; Video Otoscopy & Simulation |
| Hearing Assessment          | Hearing Loss & Prevention; Hearing in Children; Hearing in Adults; Hearing Support & Aids                                    |
| Primary Ear Care Procedures | Ear Irrigation; Dry Mopping; Ear Drops                                                                                       |
| Workshops                   | PEC workshop; WHO Training Resources; Arclight Teaching Resources                                                            |

Foundational anatomy and assessment precede technique, landmark identification
and findings. Hearing content progresses from prevention to age-specific tests
and rehabilitation. Procedures retain their complete WHO practicals. The
existing PEC workshop retains its route, lesson identifiers and progress.

## Original PDFs

All 18 original PDFs remain byte-identical downloads. Their 228 pages also have
local WebP previews for the in-app page reader. Page ranges below refer to PDF
file page numbers, which can differ from printed page numbers.

| Source                                                   | Placement                                                                            |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Ear Health and Deafness 2024                             | Ear Health & Anatomy                                                                 |
| Otoscope Handout 2026                                    | Otoscopy, two-page technique reference                                               |
| Otoscopy ENT Poster                                      | Common Ear Conditions                                                                |
| External Ears Teaching Poster 2024                       | Common Ear Conditions                                                                |
| WHO Primary Ear and Hearing Care Trainer’s Handbook      | WHO Training Resources                                                               |
| WHO Training Manual                                      | Complete manual in WHO Training Resources; selected complete sections in topic pages |
| WHO-ENT Manual Resources                                 | WHO Training Resources, including original teaching and assessment resources         |
| WHO-ENT Manual Annex                                     | WHO Training Resources                                                               |
| Hearing loss and role of health care providers factsheet | WHO Training Resources                                                               |
| Hearing loss in adults flyer                             | Hearing in Adults                                                                    |
| Hearing loss in children flyer                           | Hearing in Children                                                                  |
| Unsafe noise flyer                                       | Hearing Loss & Prevention                                                            |
| Tips for healthy ears flyer                              | Hearing Loss & Prevention                                                            |
| Tips for hearing aid users flyer                         | Hearing Support & Aids                                                               |
| Care of discharging ears                                 | Dry Mopping                                                                          |
| WHO Assembly on ENT Care                                 | WHO Training Resources                                                               |
| Madagascar Arclight 2026, front and back                 | Arclight Teaching Resources                                                          |

Selected WHO manual sections include anatomy (16–24), history (29–32),
examination (33–38), outer-ear problems (40–59), middle-ear problems (60–81),
hearing loss and prevention (84–95), child milestones (97–99), distraction
testing (100–103), child voice testing (104–105), whispered voice testing
(106–108), adult assessment (108–115), and rehabilitation (116–123).
Washout retains pages 52–54, dry mopping 55–56, and ear drops 57–58. Instructions,
limitations, precautions and referral information on those original pages are
retained rather than replaced with abbreviated new treatment guidance.

## Slides, Word content and video

- `Ears Only.pptx` supplies the hearing pathway, anatomy, assessment sequence,
  examination illustrations, hearing-development charts and example findings.
  Its original deck remains available in Arclight Teaching Resources. Eye-only
  development material is not repurposed as hearing instruction.
- The two Tympanic Membrane decks supply six detailed and two simplified
  diagram panels, retaining source photographs, labels and connector positions.
  Neither deck contains embedded video. They are labelled diagram/scrolly
  learning, and their original presentations remain available for download.
- `Website ENT.docx` supplies the Arclight introduction, phone video-otoscopy
  illustrations and simulation-ear training panels. Its original file is also
  available with the teaching resources; web marketing copy is not substituted
  for clinical instruction.
- `Otoscopy Video - Arclight 2026 App.mp4` is the Primary instructional video.
  `Otoscopy_Arclight_Short + Clinical Signs.mp4` and the complete Traditional &
  Arclight OSCE recording follow in Intermediate. The second OSCE filename is a
  verified duplicate, not another lesson. Recordings retain their original audio
  and duration, with 220p low versions and 720p or original-sized 540p high
  versions. No upscaled high-resolution master is claimed.

## Runtime and maintenance

- `earsContentData.js` owns topic order and lesson assignments. Run
  `node scripts/generate-ears-route-index.mjs` after changing membership; the
  generated route index keeps learning copy out of shared router bundles.
- `scripts/import-ears-content.py --source <extracted 2. Ears folder> --output
public --ffmpeg <binary>` regenerates source previews, diagrams, quality
  variants and `data/ears-assets.json`. Use the bundled Python with Pillow and
  pypdfium2. Originals and their SHA-256 hashes are recorded in the manifest.
- Topic and lesson routes share `earsContent.html` and the Eyes level/row
  components. Back returns to the owning topic, then Ears. PDF page choice and
  catalog scroll position restore; image zoom stays within the app.
- Topic rows use the Eyes dimensions (72px on phone/desktop and 68px on tablet),
  62 × 52px icons, grey Start links and inline video durations. Two shared grey
  dots create a 62px gap between levels; format subtitles do not add row height.
- Internal guides share the Eyes Medical Students `diabetic-screening-*`
  components, including responsive typography, card padding, badge and shadow.
  Images keep their natural aspect ratio. Video geometry and the header low/high
  radio toggle follow Eyes PEC; PDFs use a white full-page reading surface.
  Two wide Previous/Next buttons follow the topic's lesson order and return to
  the parent at each end. Source attribution appears below navigation.
- Shared lesson progress supplies row ticks and the Ears My Learning group.
  Videos complete on playback end; a PDF tracks distinct loaded source pages.
  Dashboard search includes Ears topics.
- Ears documents are content-pack assets, not app-shell precache. The Ears
  download group includes the new materials and the existing PEC ear-workshop
  dependencies; low/high selection handles both 540p and 720p source tiers.
- UI controls use the existing dictionary system. Topic headings and reader
  controls include Korean; source documents, source-labelled diagrams and
  original audio retain English, with no invented translations or narration.

## Validation

Browser coverage checks desktop and mobile Chrome entry, ordering, source video
quality/time preservation, PDF source range and page restore, diagram zoom,
retry, RTL scrolling, offline selection, and My Learning return. Unit coverage
checks route ownership, source hashes, all rendered page paths, complete
procedure ranges, duplicate recordings and content-pack classification.
`tests-e2e/ears-topic-layout.spec.js` compares every topic with Eyes row/icon
dimensions, progress height, Start styling and level separators at phone,
tablet and desktop sizes.
