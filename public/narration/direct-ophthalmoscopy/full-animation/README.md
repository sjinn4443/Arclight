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

The four on-screen section titles remain silent. `script.json` is the source of
truth for future Spanish and Korean adaptations.

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
