# Eye pad and shield narration

Both the scrolly and Full animation support English, Latin American Spanish,
Korean, Nepali, French, Luganda, Hausa, Yoruba and Igbo. The 13 instructions
retain the supplied procedure's meaning. The scrolly uses `script.json` and
125s tracks here; the video uses `video/script.json` and 134s tracks in `video/`.
Three silent 3s cards introduce Preparation, Make an eye pad and Make an eye
shield. Translated title captions supplement the English titles in the MP4.

The voice settings are copied from
[`front-of-eye/full-animation/script.json`](../../front-of-eye/full-animation/script.json).
English, Spanish, Korean, Nepali and French use the same Microsoft voices.
Luganda, Hausa, Yoruba and Igbo use the cached local MMS models and revisions
recorded in the [Fundal Reflex asset notes](../../fundal-reflex/full-animation/README.md).
Those four models carry CC-BY-NC-4.0 licences. Igbo uses the Igbo-trained
`Shinzmann/soro-tts-ibo` checkpoint with edge silence trimming.
Translated wording and synthetic pronunciation still need native clinical review.

## Rebuild

1. Update `scripts/eye-pad-shield-translations.json`, then run
   `node scripts/localize-eye-pad-shield-narration.cjs`.
2. Run `node scripts/build-eye-pad-shield-video.cjs` after scene or title changes.
   Set `CHROME_CHANNEL=chrome` to use installed Chrome if needed.
3. Generate only changed languages using the shared generator. Microsoft speech
   requires network access and edge-tts 7.3.1 or later. Local models stay in
   `tmp/luganda-tts-model`; tools stay in `tmp`.

```powershell
python scripts/generate-fundal-narration.py --script public/narration/make-eye-pad-shield/full-animation/script.json --work-dir tmp/make-eye-pad-shield-narration --artifacts-dir .codex-artifacts/make-eye-pad-shield-narration --public-dir public/narration/make-eye-pad-shield/full-animation --asset-stem make-eye-pad-shield-full-animation --languages es-419 ko ne fr lg ha yo ig --skip-review-video

python scripts/generate-fundal-narration.py --script public/narration/make-eye-pad-shield/full-animation/video/script.json --work-dir tmp/make-eye-pad-shield-narration --artifacts-dir .codex-artifacts/make-eye-pad-shield-video-narration --public-dir public/narration/make-eye-pad-shield/full-animation/video --asset-stem make-eye-pad-shield-video --languages en es-419 ko ne fr lg ha yo ig --skip-tts --skip-review-video

node scripts/normalize-eye-pad-shield-narration.cjs
node scripts/localize-eye-pad-shield-narration.cjs --connect
```

Keep the original English scrolly audio unchanged. Cue caches are reused for
the video, with new delays around title cards. Captions and speech use the
same media clock, including after seeking. Manifests record bytes and SHA-256
for both sets of delivery files. WAV masters and timing/loudness QA stay in
`.codex-artifacts/`, outside the public package.
