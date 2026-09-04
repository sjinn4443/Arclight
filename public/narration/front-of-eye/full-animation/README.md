# Front of Eye full-animation narration

This folder contains the app-ready narration and caption assets for
`frontOfEyeFullAnimationVideoPage`.

The English script is timed to `New_FrontofEyeFullAnim.mp4` and follows the
clinical sequence shown in the existing `FE_Full_720p.mp4` lesson. The video
holds at 00:06.000 and 01:17.000 for four seconds each, then at 02:01.000 for
three seconds, while the narration and captions continue. Consequently, cue
times after each hold use the narration clock and are offset from the
underlying video clock.

## Timed English outline

|      Narration time | Section                               | Narration focus                                                                         |
| ------------------: | ------------------------------------- | --------------------------------------------------------------------------------------- |
| 00:03.700-01:15.200 | Observation and magnified examination | Periorbital observation, gaze directions, lid handling, and grouped anterior structures |
| 01:21.000-01:38.600 | Anterior chamber depth                | Chamber definition, temporal illumination, and recognition of a nasal shadow            |
| 01:46.000-01:58.500 | Corneal inspection                    | Blue-light inspection and recording highlighted epithelial loss                         |
| 02:03.500-02:18.200 | Upper eyelid eversion                 | Cotton-bud fulcrum, eversion, naked-eye inspection, and magnified inspection            |

`script.json` is the source of truth for future language adaptations.

## Clinical references

- Community Eye Health Journal, [How to examine the front of the eye](https://cehjournal.org/articles/10.56920/cehj.84)
- American Academy of Ophthalmology EyeWiki, [Slit Lamp Examination](https://eyewiki.aao.org/Slit_Lamp_Examination)
- World Health Organization, [Eye care competency framework](https://www.who.int/publications/i/item/9789240048416)

## Rebuilding the English media

From the repository root, install the temporary speech and FFmpeg tooling, then
run the shared generator with the Front of Eye paths:

```powershell
python -m pip install --target tmp\fundal-narration-tools edge-tts imageio-ffmpeg
python scripts\generate-fundal-narration.py `
  --script public\narration\front-of-eye\full-animation\script.json `
  --work-dir tmp\front-of-eye-narration `
  --artifacts-dir .codex-artifacts\front-of-eye-narration `
  --public-dir public\narration\front-of-eye\full-animation `
  --asset-stem front-of-eye-full-animation `
  --languages en
```

The generator writes the delivery M4A/VTT files here and keeps the WAV master,
review MP4 and QA report under `.codex-artifacts/front-of-eye-narration/`. The
AI-voice draft should receive clinical and native-speaker approval before
publication.
