# Cataract examination scroll lesson

`#/videos/cataractPage` has a Primary **Cataract** scrollytelling row immediately
above **Simulator**. It opens `#/videos/cataractScrollPage`.

The source is the one-page `Cataract_Edit5.pdf` in
`D:/Arclight/ScrollVisualsforApp/Disease/Cataract/`. The supplied Illustrator
master is preserved there. Source checksums and measured extraction bounds are
recorded in `public/scrolly/conditions/cataract/provenance.json`. Authoring masters
are not copied into the distribution or offline download.

## Reading order and artwork

The user's three reference columns determine the order within each source row:
examination method, cataract-compatible findings, and findings requiring
assessment for another cause or referral. The green column is not a blanket
"normal / no cataract" classification. Its fifth row specifically shows lens
opacities and interrupted fundal reflexes. Both narration languages explicitly
explain that exception. A quiet front of eye or normal pupil reaction does not
exclude cataract; an obscured fundus does not establish a healthy retina.

| Divider        | Stages | Source components and motion                                                                                       |
| -------------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| History Taking | 1–3    | Clinician/patient with separately revealed original speech bubbles                                                 |
| Visual Acuity  | 4–6    | Original distance/near charts, occlusion and pinhole panels; results appear with their cues                        |
| Front of Eye   | 7–9    | Original clinician and device with independently illuminated light pool; quiet versus abnormal eye panels          |
| Pupils         | 10–12  | Original light-response panels, source aperture circles contracting, and before/after reveal for referral examples |
| Fundal Reflex  | 13–15  | Original examination, four cataract examples in reading order, then abnormal reflex referral examples              |
| Fundoscopy     | 16–18  | Original closer examination, obscured views and source fundus abnormalities                                        |

All compositions are 1169 × 1280 at 30 fps. Source components retain equal X/Y
scales. Scrolling selects an eligible scene; it does not scrub frames. Do not
substitute generated illustrations for the original PDF components. The source
arrows, device settings and referral symbols remain part of the artwork.

## Runtime and delivery

`public/js/cataractScroll.js` owns 18 stages, six dividers and 36 bilingual cues.
The track clock is 331 seconds, including a one-second silent lead-in. English
uses Sonia and Korean uses SunHi through the existing bounded-speed narration
pipeline. Source utterances and QA stay in the authoring work directory.

The page reuses Eye Pad/Shield's header, caption sizing,
`childhood-fundal-segment-text__line` accumulation, 1.5-second completion pause,
replay/advance controls, lazy loading, exact final-frame recovery and shared
WebKit Canvas/SVG selection. No shared playback or settle algorithm is changed.
As on Eye Pad/Shield, the title-toggle config is present but the stageAutoplay
branch does not wire that legacy segmentScroll interaction.

Both Videos initialization paths register the lesson. Launcher gestures prime
audio, language/mute settings persist, unsupported voices fall back to English,
and Back returns to Cataract. Progress uses `lessonProgress:cataractScrollPage`;
My Learning and the existing `condition-cataract` download selection include it.
Runtime assets are under `/scrolly/conditions/cataract/` and
`/narration/cataract/full-animation/`. No new top-level app route is needed.

## Regeneration

The 7 November revision adds a guide shortcut below each Title Case divider.
History Taking opens `medicalStudentsWorkshop/medicalHistoryTakingPage`; the
remaining sections open Videos' Visual Acuity, Front of Eye, Pupils PEC, combined
Fundal Reflex and Direct Ophthalmoscopy scrolly pages respectively. The optional
section-link rendering does not alter other routes' playback or settling.

History Taking scenes 1 and 2 now share the original examiner, patient/chair and
four source speech bubbles on one continuous background. Scene 3 retains only
the patient; widened speech-bubble crops include the complete front/back-eye
symbols, and the source column border is removed. Its revised speech distinguishes
a possible front or back of eye problem from a front of eye problem. The opening
question is "Ask if the vision has changed…" in both narration and captions.

Set `CATARACT_ART_PREFIX=history-` to regenerate just those original-art layers
when the existing extraction manifest is available. Set
`CATARACT_CUE_IDS=history-onset,history-sudden,history-pain` for the narration
revision: the generator preserves the delivered audio outside those slots,
retains a revision-specific source recording, and regenerates both language
tracks and all caption cues. All six replacement utterances fit at 1.0× speed.

Revision verification: 27 focused unit checks pass; all 18 scene playback,
caption and completion-restore checks pass in phone Chrome and WebKit iPhone.
The six language/fallback/shortcut browser checks pass with the repository's
15-second initialization expectation (the temporary harness's original 5-second
default expired before lazy initialization on this host). The six shortcut
destinations were exercised, including the cross-route History Taking page.
Accessibility passes for 181 HTML files. New JavaScript lints cleanly; the shared
engine retains its existing 64 baseline lint findings. Initial/final original-art
renders confirm both actors, chair and four bubbles in scenes 1–2 and complete
eye symbols without the source red column border in scene 3.

1. Run `scripts/extract-cataract-art.py [path/to/Cataract_Edit5.pdf]` with the
   existing PyMuPDF authoring environment.
2. Run `node scripts/build-cataract-scroll.cjs`.
3. Run `scripts/generate-cataract-narration.py` with the existing Edge TTS and
   FFmpeg environment. Cached utterances are reused when text/voice is unchanged.

`CATARACT_WORK_DIR` can relocate intermediates to another drive. Only runtime
assets and scripts belong in the app. Inspect rendered initial, intermediate
and final frames in SVG and Canvas after editing masks or original pupil layers.
Animated Lottie mask layers must set `hasMask: true`; otherwise the player skips
tangent conversion and a rectangular reveal becomes a curved wedge.

Clinical copy was cross-checked against the [NHS cataract guidance](https://www.nhs.uk/conditions/cataracts/),
[NHS vision-loss guidance](https://www.nhs.uk/conditions/vision-loss/),
[Gloucestershire Hospitals cataract information](https://www.gloshospitals.nhs.uk/your-visit/patient-information-leaflets/what-is-a-cataract/),
and [Royal Children's Hospital abnormal-reflex referral guidance](https://www.rch.org.au/primary-care-liaison/prereferral_guidelines/Abnormal_red_reflex_and_or_white_pupil/).
Referral wording describes the overall findings rather than assigning a diagnosis
to every tiny source symbol. No numerical acuity referral threshold is invented.

## Verification

- `tests/cataract-scroll.test.js`: launcher, source dependencies, masks, cue slots,
  cataract-reflex exception and delivered narration checksums/durations.
- `tests/cataract-scroll-offline.test.js`: English/Korean/French selection,
  complete scene dependencies and English voice fallback.
- `tests-e2e/cataract-scroll.spec.js`: all 18 scenes, exact held frames,
  accumulated text, replay, completion restore, Back cleanup, Korean/English
  audio, saved mute, My Learning and unsupported-language fallback.
- Desktop Chrome, phone and tablet viewports plus WebKit iPhone/iPad are the
  verification matrix. Windows WebKit uses the existing narration clock shim;
  physical iPhone/iPad sound and rendering acceptance remain outside desktop QA.

### Delivery checks — 5 November 2026

The 26 focused Cataract, Eye Pad/Shield and Fundal narration unit checks pass.
Desktop Chrome, phone/tablet Chrome and WebKit iPhone/iPad checks pass for all
18 scenes, language controls, completion restore and return navigation (15
browser cases). Two additional checks against the built distribution pass in
desktop Chrome and WebKit iPhone. All 72 required scene/image/audio/caption
URLs are present in the distribution manifest. The HTML accessibility audit
passes and the production build stays within the existing budgets.

The broader Pupils Advanced suite has one existing failure: its unchanged
shared PEC positioning scene lacks the two expected white dividers. Both that
asset and its assertion are identical to HEAD; this lesson does not modify them.
Existing lint errors in the shared Fundal engine and Videos module are also
unchanged (64 and 31 respectively). New Cataract JavaScript and tests lint cleanly.

The D: drive ran out of space during authoring. Intermediate files and the
verification distribution are on C:. The old generated directory
`tmp-codex-build-pupils-pec-v9-media` was preserved under this task's
`relocated-build-artifacts` folder on C:, with its original inventory verified
as 5,700 files / 1,704,127,633 bytes. No source master or runtime asset was
removed to make space.
