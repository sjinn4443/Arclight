# Binocular Indirect Ophthalmoscopy full-animation narration

This folder contains the app-ready narration and caption assets for
`binocularIndirectOphthalmoscopyFullAnimationVideoPage`.

## Language coverage

English, Latin American Spanish, Korean, Nepali, French, Luganda, Hausa,
Yoruba and Igbo each have a separate M4A track with 18 spoken cues. English has
18 captions; the other languages have 21, including three silent title cards.
The eight additions use the same voices as Fundal Reflex. English delivery
files, cue boundaries and both runtime holds are unchanged.

Maintained translations live in `scripts/full-animation-translations.json`.
Run `node scripts/localize-full-animation-narration.cjs`, generate the changed
languages with the shared generator, then run the helper with `--connect`.
See the [production record](../../../../memory-bank/narration-and-subtitles.md)
for commands and the voice table. WAV masters and timing QA are in
`.codex-artifacts/binocular-indirect-ophthalmoscopy-narration/`.

Luganda, Hausa, Yoruba and Igbo reuse the cached model revisions recorded in
the [Fundal Reflex asset notes](../../fundal-reflex/full-animation/README.md).
Those models use CC-BY-NC-4.0 licences. Synthetic pronunciation and translated
clinical wording still need native review; automated timing checks do not
establish clinical intelligibility.

The Luganda pupil term follows the [English–Luganda dictionary](https://lugandaproz.wordpress.com/english-luganda-dictionary/).

The English script is timed to `New_BIOFullAnim.mp4`. Its clinical sequence and
wording are adapted from the Binocular Indirect Ophthalmoscopy scrolly lessons
already used by the Diabetic Retinopathy workshop. The animation remains the
visual timing authority, with two requested playback holds that let narration
and captions continue while the current frame stays visible.

## Timed English outline

|   Source video time | Narration clock     | Section                     | Narration focus                                                                                                   |
| ------------------: | ------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 00:02.500-00:47.000 | 00:02.500-00:51.000 | Preparation                 | Hand hygiene, five-click brightest setting, automatic switch-off, headset fit and optical alignment               |
| 00:47.000-01:29.200 | 00:51.000-01:33.200 | Fundoscopy Sitting          | Pupil dilation, lens and hand position, optical alignment, directed fixation and peripheral quadrants             |
| 01:33.800-01:59.680 | 01:37.800-02:10.600 | Fundoscopy with Indentation | Patient explanation, gaze direction, indenter placement, gentle pressure and examination of the retinal periphery |

The video holds for four seconds at `00:43.700` and seven seconds at
`01:43.600`. During both holds, narration and captions continue. The three
on-screen section titles remain silent. `script.json` is the source of truth
for future language adaptations.

## Rebuilding the English media

From the repository root, install the temporary speech and FFmpeg tooling, then
run the shared generator with the Binocular Indirect Ophthalmoscopy paths:

```powershell
python -m pip install --target tmp\fundal-narration-tools edge-tts imageio-ffmpeg
python scripts\generate-fundal-narration.py `
  --script public\narration\binocular-indirect-ophthalmoscopy\full-animation\script.json `
  --work-dir tmp\binocular-indirect-ophthalmoscopy-narration `
  --artifacts-dir .codex-artifacts\binocular-indirect-ophthalmoscopy-narration `
  --public-dir public\narration\binocular-indirect-ophthalmoscopy\full-animation `
  --asset-stem binocular-indirect-ophthalmoscopy-full-animation `
  --languages en
```

The generator writes the delivery M4A/VTT files here and keeps the WAV master,
review MP4 and QA report under
`.codex-artifacts/binocular-indirect-ophthalmoscopy-narration/`. The AI-voice
draft should receive clinical and native-speaker approval before publication.
