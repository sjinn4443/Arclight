# Binocular Indirect Ophthalmoscopy full-animation narration

This folder contains the app-ready narration and caption assets for
`binocularIndirectOphthalmoscopyFullAnimationVideoPage`.

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
