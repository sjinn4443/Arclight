# Fundal Spanish and Korean release review

Approval is pending. Automated checks do not establish clinical equivalence or
pronunciation quality.

For each language, a clinician fluent in English and that language should compare
the English source with the complete translated script, captions and audio:

- [Script and timed speech](../public/narration/fundal-reflex/full-animation/script.json)
- [Spanish captions](../public/narration/fundal-reflex/full-animation/es-419.vtt)
  and [Spanish audio](../public/narration/fundal-reflex/full-animation/es-419.m4a)
- [Korean captions](../public/narration/fundal-reflex/full-animation/ko.vtt)
  and [Korean audio](../public/narration/fundal-reflex/full-animation/ko.m4a)

Check the PPE instruction, the examiner-eye and sideways-device warnings, and
the referral instruction for squint persisting beyond three months, as well as
the remainder of the clinical meaning, pronunciation and caption/audio timing.
The timed translations and VTT already contained these instructions; the broad
cue outline was stale and has been synchronized. The delivery audio was rebuilt.

After completing the review, run `npm run check:clinical`. Record the reviewer's
name, qualifications, review date, supporting review record and printed content
revision in [fundal-es-ko.json](fundal-es-ko.json), changing only the reviewed
language's status to `approved`. Each language needs its own review record.

`npm run check:clinical-approval` fails until both languages have approval for
the exact script, VTT and audio revision. Subsequent content changes invalidate
that approval. CI uses `--report-approval` to report pending reviews as a warning
and skip production artifact, content pack and source map uploads. Automated
checks can pass while review is pending; this does not establish release approval.
Invalid approval records and stale approved revisions still fail CI. Any separate
deployment workflow must run `npm run check:clinical-approval` before publishing.
