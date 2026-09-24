# Visual Acuity localization

Both pages use the existing 222.933333-second delivery timeline and the same
24 teaching cues. The eight additional translations and five section-title
translations are maintained in `scripts/visual-acuity-translations.json` and
`scripts/localize-visual-acuity-narration.cjs`. Native clinical review is pending.

Generate the cue sheet:

```sh
node scripts/localize-visual-acuity-narration.cjs
```

Generate delivery audio and captions using the same providers as Fundal Reflex:

```sh
python scripts/generate-fundal-narration.py --script public/narration/visual-acuity/full-animation/script.json --work-dir tmp/visual-acuity-narration --artifacts-dir .codex-artifacts/visual-acuity-narration --public-dir public/narration/visual-acuity/full-animation --asset-stem visual-acuity-full-animation --languages es-419 ko ne fr lg ha yo ig --skip-review-video
node scripts/localize-visual-acuity-narration.cjs --connect
```

The generator rejects narration requiring more than 1.08x playback speed,
checks delivery duration within 250 ms, and limits each M4A to 2 MB. WAV masters
and timing QA stay outside the public package. Existing English media is retained.

`--connect` requires all nine delivery audio and subtitle tracks before updating
the video catalog and the shared scroll narration module.

Luganda, Hausa and Yoruba use the existing Meta MMS models; Igbo uses the
existing Shinzmann/soro-tts-ibo model. Their model metadata and CC-BY-NC-4.0
attribution match the Fundal Reflex cue sheet. Spanish, Korean, Nepali and French
use the existing Edge TTS voices and require network access during generation.

All nine languages are packaged and selectable on both pages: English, Latin
American Spanish, Korean, Nepali, French, Luganda, Hausa, Yoruba and Igbo.
