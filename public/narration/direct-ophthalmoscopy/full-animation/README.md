# Direct Ophthalmoscopy full-animation narration

This folder contains the app-ready narration and caption assets for
`directOphthalmoscopyFullAnimationVideoPage`.

The English script is timed to `New_DOFullAnim.mp4`. Its clinical sequence comes
from the existing Direct Ophthalmoscopy scrolly pages and the supplied Direct
Ophthalmoscopy reference document. The animation is the timing authority, so
content that is not shown in the video is not forced into the narration.

## Timed English outline

|          Video time | Section                       | Narration focus                                                                                                             |
| ------------------: | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 00:03.200-00:57.000 | Observation and Fundal Reflex | Hand hygiene, external observation, Arclight setup, examiner alignment and bilateral reflex comparison                      |
| 00:57.000-01:53.200 | Positioning and Flight Path   | Distant fixation, same-side hand and eye, 10-15 degree temporal approach, close stable view and avoiding sweeping movements |
| 01:58.000-02:25.000 | Features to Assess            | Disc margin, neuroretinal rim colour, cup-to-disc ratio and abnormal examples                                               |
| 02:25.000-03:03.050 | How to Examine                | Dilation, optic-disc review, four vessel branches, macula and fovea, and the other eye                                      |

The four on-screen section titles remain silent. `script.json` contains twenty
spoken cues for all nine languages and four `videoTitleCues` for the eight
non-English languages. English has 20 captions and the other tracks have 24.
Title translations use the actual video clock, even when narration runs ahead.
The existing English timeline, including the player’s frame holds, is retained.

## Nine-language update (2026-09-14)

English, Latin American Spanish (`es-419`), Korean, Nepali, French, Luganda,
Hausa, Yoruba and Igbo are available. The app language selects the initial
narration and captions. A manual narration-menu selection changes both; Auto
returns both to the app language. Offline downloads include the selected
language’s M4A and VTT files.

Adaptations are maintained in `scripts/localize-direct-ophthalmoscopy-narration.cjs`.
Sentences are shortened to fit each scene without removing the demonstrated
steps. The generator enforces a 1.08× maximum timing adjustment, 2 MB audio
limit, and 0.25-second total-duration tolerance. English media is preserved.

The voices match the Fundal Reflex tracks:

| Language | Voice/model                                                             |
| -------- | ----------------------------------------------------------------------- |
| Spanish  | `es-MX-DaliaNeural`                                                     |
| Korean   | `ko-KR-SunHiNeural`                                                     |
| Nepali   | `ne-NP-HemkalaNeural`                                                   |
| French   | `fr-FR-DeniseNeural`                                                    |
| Luganda  | [facebook/mms-tts-lug](https://huggingface.co/facebook/mms-tts-lug)     |
| Hausa    | [facebook/mms-tts-hau](https://huggingface.co/facebook/mms-tts-hau)     |
| Yoruba   | [facebook/mms-tts-yor](https://huggingface.co/facebook/mms-tts-yor)     |
| Igbo     | [Shinzmann/soro-tts-ibo](https://huggingface.co/Shinzmann/soro-tts-ibo) |

The four local models carry **CC-BY-NC-4.0 (noncommercial)** licenses. Downloaded
model revisions and runtime dependencies are documented in the
[Fundal Reflex README](../../fundal-reflex/full-animation/README.md).
Igbo uses the same outer-silence trimming with 150 ms padding. These synthetic
tracks and adapted translations have not received native clinical review;
Igbo pronunciation particularly needs review. Structural and timing tests do
not establish clinical intelligibility.

To regenerate the eight additions, first run
`node scripts/localize-direct-ophthalmoscopy-narration.cjs`, then use the
generator command below with `--languages es-419 ko ne fr lg ha yo ig` and
`--skip-review-video`. Use `--tts-only` for a first timing pass and `--skip-tts`
to mix cached cues. Finally run
`node scripts/localize-direct-ophthalmoscopy-narration.cjs --connect` to wire
the completed media into the video catalog.

## Rebuilding the English media

From the repository root, install the temporary speech and FFmpeg tooling, then
run the shared generator with the Direct Ophthalmoscopy paths:

```powershell
python -m pip install --target tmp\fundal-narration-tools edge-tts imageio-ffmpeg
python scripts\generate-fundal-narration.py `
  --script public\narration\direct-ophthalmoscopy\full-animation\script.json `
  --work-dir tmp\direct-ophthalmoscopy-narration `
  --artifacts-dir .codex-artifacts\direct-ophthalmoscopy-narration `
  --public-dir public\narration\direct-ophthalmoscopy\full-animation `
  --asset-stem direct-ophthalmoscopy-full-animation `
  --languages en
```

The generator writes the delivery M4A/VTT files here and keeps the WAV master,
review MP4, and QA report under `.codex-artifacts/direct-ophthalmoscopy-narration/`.
The AI-voice draft should receive clinical and native-speaker approval before
publication.
