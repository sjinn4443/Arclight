# Examination narration and subtitles

Last checked: 17 September 2026.

### Combined scroll timing update — 17 September 2026

`frontOfEyeExaminationScrollPage`, `directOphthalmoscopyScrollPage` and
`binocularIndirectOphthalmoscopyScrollPage` use `examinationScrollTiming.js`.
Its per-stage checkpoints map absolute narration seconds to local Lottie frames;
repeated frames create teaching holds. The narration element's actual time drives
both frame selection and script cue text. Buffering freezes both. Replay, the down
arrow and forward-scroll unlock wait for the clip end, including final-frame holds.
Muted playback uses a monotonic clock of the same duration; unmuting seeks audio
to that position. Replay resets all three. Language changes preserve elapsed time.

All three guides now take text directly from their Full Animation `script.json`
cues. The DO Positioning stage four endpoint changes from 525 to 645 to include
the branch-return graphic described by `positioning-05`; original standalone
workshop settings are unchanged. The shared renderer overrides and exact static
pause/completion images still apply, including BIO canvas stages.

The DO Positioning third scene reveals the green angle at "ten" (90.88 s),
keeps it visible through "degrees" (91.76 s), and shows the check at 92.2 s.
The fourth scene loses the disc at 109.09 s and changes to the green return
arrow between "follow" (110.23 s) and "back" (111.59 s). These word positions
were measured locally against the existing English track. BIO Preparation
scene three plays frames 0–183 over 26–32 s (approximately its original 30 fps),
preserving every later checkpoint. Headings use `videoTitleCues` translations
from each guide's script and follow the narration selector, including Auto.

The lesson-row click primes an audio element before async page loading, and the
controller adopts that same element. New preferences default to narration on;
a saved mute is respected. Clicking the sound icon always toggles mute on these
guides, even if autoplay was blocked. A direct link without prior user activation
can still require a page interaction under browser autoplay policy.

Tests: `examination-scroll-sync.spec.js` checks all 37 stages, cue boundaries,
stalled audio, final-frame completion and mute/resume. Chromium uses real AAC.
This Windows WebKit host rejects both AAC and PCM, so its media clock is mocked;
Lottie rendering, controls and navigation run in real WebKit. These checks do not
replace physical iPhone audible-autoplay verification.

This is the production and maintenance record for the five examination pages.
It records what the repository contains, how the media was made and how to
repeat the work. Source code and `script.json` files take priority over older
prose when they differ. After the September documentation update, BIO and
Front of Eye gained eight translated audio and caption tracks on 15 September.
Direct Ophthalmoscopy already had these languages. English media and all
existing playback holds were retained.

## Coverage

| Page ID                                                 | Narration and subtitle coverage                                    | Source                                                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `frontOfEyeFullAnimationVideoPage`                      | Nine languages for audio and WebVTT                                | [Front of Eye assets](../public/narration/front-of-eye/full-animation/)                   |
| `directOphthalmoscopyFullAnimationVideoPage`            | Nine languages for audio and WebVTT                                | [Direct Ophthalmoscopy assets](../public/narration/direct-ophthalmoscopy/full-animation/) |
| `binocularIndirectOphthalmoscopyFullAnimationVideoPage` | Nine languages for audio and WebVTT                                | [BIO assets](../public/narration/binocular-indirect-ophthalmoscopy/full-animation/)       |
| `fundalReflexExaminationScrollPage`                     | Nine narration languages; short stage text uses the app dictionary | Reuses the Fundal Reflex M4A files                                                        |
| `fundalReflexFullAnimationVideoPage`                    | Nine languages for audio and WebVTT                                | [Fundal Reflex assets](../public/narration/fundal-reflex/full-animation/)                 |

The nine tags are `en`, `es-419`, `ko`, `ne`, `fr`, `lg`, `ha`, `yo` and `ig`.
These mean English, Latin American Spanish, Korean, Nepali, French, Luganda,
Hausa, Yoruba and Igbo. Wider app translation coverage does not imply a
narration track exists for every language on every page.

## Source and file ownership

| File or folder                                                                            | Responsibility                                                                                |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [public/html/videos.html](../public/html/videos.html)                                     | Hidden video pages, launcher rows and the combined scroll page shell                          |
| [public/js/videos.js](../public/js/videos.js)                                             | `VIDEO_PAGE_SOURCES`, runtime holds, dedicated controls, captions and separate audio playback |
| [childhood-eye-screening.json](../public/video-localization/childhood-eye-screening.json) | All four full-animation video entries, language URLs, default languages and local MP4 sources |
| `public/narration/<lesson>/full-animation/script.json`                                    | Scene timing, cue text, voices and pronunciation guidance                                     |
| `public/narration/<lesson>/full-animation/<language>.m4a`                                 | Small delivery audio track                                                                    |
| `public/narration/<lesson>/full-animation/<language>.vtt`                                 | Timed UTF-8 WebVTT captions                                                                   |
| `public/narration/<lesson>/full-animation/manifest.json`                                  | Script duration, track paths, byte sizes and audio SHA-256 hashes                             |
| [generate-fundal-narration.py](../scripts/generate-fundal-narration.py)                   | Shared speech generation, mixing, encoding and QA                                             |
| [build-front-of-eye-timed-video.cjs](../scripts/build-front-of-eye-timed-video.cjs)       | Builds the Front of Eye MP4 with encoded frame holds                                          |
| [childhoodFundalPreparation.js](../public/js/childhoodFundalPreparation.js)               | Combined scroll route, stage intervals, narration controls and short translated guidance      |
| [languageinstall.js](../public/js/languageinstall.js)                                     | Offline language selection and fallback                                                       |
| [pages.css](../public/style/pages.css)                                                    | Caption/player layout and Fundal scroll controls                                              |

The full-animation catalogue happens to be named `childhood-eye-screening.json`.
It also owns Direct Ophthalmoscopy, BIO and Front of Eye. The separate
`app-video-subtitles.json` and `videoSubtitles.js` handle other app videos.
All four full-animation entries currently have an empty HLS master path and
use local MP4s. Their `iosHls.subtitleLanguages` field is metadata, not evidence
that these four lessons have generated HLS media.

## How the scripts and translations were developed

1. Establish the visible scene sequence. Fundal Reflex is timed to the new
   animation's scene boundaries, including title cards and reordered Possible
   Findings graphics. Direct Ophthalmoscopy uses its existing scrolly copy
   and the supplied reference document. BIO uses the scrolly lessons already
   present in the Diabetic Retinopathy workshop. The animation determines
   where speech belongs.
2. Write clear English cues with a calm teaching tone. Keep the demonstrated
   steps in order and fit the words into each scene. Store stable cue IDs,
   start times, end times and text in `script.json`.
3. Adapt each supported translation to the same meaning and scene window.
   The Fundal Reflex asset notes record machine translation followed by a
   clinical wording and timing pass for the added languages. This describes
   content preparation, not completed native clinical review. Direct
   Ophthalmoscopy stores its eight translated adaptations in a dedicated script.
4. Generate speech cue by cue, measure its duration and revise long sentences.
   Keep normal pauses and natural phrasing. Use pronunciation overrides where
   the speech engine needs help with terms such as Arclight.
5. Mix and encode the final track. Generate captions from the matching script,
   then connect the files to the player and offline download catalogue.
6. Check the output against the animation and run focused regression checks.
   Preserve review files so later wording or timing changes can be compared.

The checked-in translation helpers are:

- [localize-full-animation-narration.cjs](../scripts/localize-full-animation-narration.cjs):
  applies the maintained [BIO and Front of Eye translations](../scripts/full-animation-translations.json)
  to the existing 18- and 22-cue timelines. Voices are copied from Fundal Reflex.
  Its `--connect` step checks delivery files before changing the catalogue.
- [localize-direct-ophthalmoscopy-narration.cjs](../scripts/localize-direct-ophthalmoscopy-narration.cjs):
  adds eight translated strings to each of the 20 existing cues and copies
  voice settings from Fundal Reflex. `--connect` also checks that audio and
  VTT files exist before updating the video catalogue.
- [refine-parity-narration.cjs](../scripts/refine-parity-narration.cjs):
  maintains concise Fundal Reflex speech for Nepali, French and Luganda.
- [refine-ha-yo-ig-narration.cjs](../scripts/refine-ha-yo-ig-narration.cjs):
  maintains Fundal Reflex Hausa, Yoruba and Igbo text, title translations
  and language-specific speech groups.
- [connect-parity-locales.cjs](../scripts/connect-parity-locales.cjs):
  connects existing translated assets in both video catalogues. It also
  writes translation dictionaries, so inspect its wider diff after use.

These helpers contain maintained text arrays. They do not translate text on
demand. Update the relevant array when revising a language that it owns,
otherwise running the helper can replace a later manual edit to `script.json`.

### Cue formats and pronunciation

For most lessons, `cues` holds each cue's `id`, `start`, `end` and language
strings. A cue's optional `ttsText` map changes speech without changing the
caption spelling. In language-specific timed arrays, `ttsText` is a string.

Fundal Reflex has three levels:

- `cues`: 24 broad scene groups used as the original script outline.
- `timedCues[language]`: the actual displayed caption timings. There are
  29 English cues and 36 for each other language. The extra seven captions
  translate silent section titles.
- `timedAudioCues[language]`: speech entry points and groups. English,
  Spanish and Korean each have 36 speech cues. Nepali and French have 28,
  Luganda has 27, Hausa and Yoruba have 28 and Igbo has 26. Some sentences
  are grouped for smoother speech while the caption boundaries remain separate.

The generator uses `timedCues` for captions and `timedAudioCues` for speech
when those arrays exist. Each falls back to `cues` independently. A
`pronunciationGuide` is a human reference; the generator sends `ttsText` or
the ordinary cue text to the voice. Editing the guide alone does not change
the generated pronunciation.

Direct Ophthalmoscopy has 20 spoken cues per language, BIO has 18 and Front of
Eye has 22. English captions contain only these cues. The eight other languages
also have four, three and four silent title captions respectively, making their
caption counts 24, 21 and 26.

`videoTitleCues` stores these caption-only cards separately from speech. Its
maintained source is `scripts/full-animation-title-captions.json`, applied by
both localisation helpers. The intervals were checked against the actual MP4
title frames, including the encoded Front of Eye timeline. WebVTT IDs beginning
`video-title-` tell the shared caption panel to use video time and prioritise the
title over speech captions while the card is visible. Ordinary speech captions
continue to follow narration time during a hold or lead. English and Fundal
Reflex keep their existing behaviour.

To rebuild only captions, apply the relevant localiser and use:

```powershell
$titleLesson = 'front-of-eye' # or direct-ophthalmoscopy / binocular-indirect-ophthalmoscopy
python scripts/generate-fundal-narration.py --script "public/narration/$titleLesson/full-animation/script.json" --public-dir "public/narration/$titleLesson/full-animation" --captions-only --languages es-419 ko ne fr lg ha yo ig
```

This mode requires no speech service or FFmpeg and leaves M4A files, English VTT,
manifests and audio QA untouched. The `videoTitleCues` array is excluded from
speech even during a future full audio rebuild.

## Voices and generation settings

| Language               | Voice or model           | Generation route                      |
| ---------------------- | ------------------------ | ------------------------------------- |
| English                | `en-GB-SoniaNeural`      | `edge-tts`                            |
| Latin American Spanish | `es-MX-DaliaNeural`      | `edge-tts`                            |
| Korean                 | `ko-KR-SunHiNeural`      | `edge-tts`                            |
| Nepali                 | `ne-NP-HemkalaNeural`    | `edge-tts`                            |
| French                 | `fr-FR-DeniseNeural`     | `edge-tts`                            |
| Luganda                | `facebook/mms-tts-lug`   | Local MMS/VITS                        |
| Hausa                  | `facebook/mms-tts-hau`   | Local MMS/VITS                        |
| Yoruba                 | `facebook/mms-tts-yor`   | Local MMS/VITS                        |
| Igbo                   | `Shinzmann/soro-tts-ibo` | Local Igbo-trained MMS/VITS fine-tune |

Edge speech uses rate `-8%`, pitch `+0Hz` and volume `+0%`, with up to three
cue requests at once. Cue files have fingerprints based on text and voice
settings, so unchanged cues can be reused. Edge generation needs network access.

The local models use PyTorch with `transformers` and seed 42. Model weights
are cached in `tmp/luganda-tts-model/`; the shared folder name covers all four
local languages. The `provider` value is `Meta MMS (local)`, including the Igbo
fine-tune. These models also use cue fingerprints.

Igbo has `trimEdgeSilenceDb: -50`. The generator examines 20 ms RMS windows,
removes only leading and trailing silence and retains 150 ms padding. Internal
pauses remain. The cached local cue files have WAV content despite their
`.mp3` suffix; FFmpeg reads the file header when mixing them.

The [Fundal Reflex asset notes](../public/narration/fundal-reflex/full-animation/README.md)
record the downloaded model revisions and CC-BY-NC-4.0 noncommercial licences.
They identify the Igbo model as an Igbo-trained fine-tune. Retain that provenance
when rebuilding. The translated synthetic tracks still need native clinical
review, especially for Igbo pronunciation. Passing timing checks does not
establish clinical intelligibility or translation accuracy.

### Audio assembly and QA limits

FFmpeg measures every cue, resamples to 48 kHz mono and delays it to its start
time on a silent track. It applies `atempo` only where needed, mixes without
automatic normalisation and applies a limiter at 0.95. Output is a 16-bit
48 kHz mono WAV master and a 48 kbps AAC M4A with `faststart`.

- Maximum timing adjustment: 1.08 times the generated cue speed. The full
  mix fails if a cue needs more; shorten the text and generate it again.
- Maximum delivery size: 2,000,000 bytes per language.
- Maximum total-duration difference: 0.25 seconds against
  `script.durationSeconds`, which can include additional time for holds.
- `qa-report.json` records measured source duration, target duration, each
  cue's rendered end, speed and end margin, plus track sizes and hashes.
- The public manifest records the M4A hash and size. It does not contain a
  VTT hash. Caption consistency is checked against the script separately.

## Page timing contracts

All source paths below are under `public/videos/FullAnim/`. Low mode uses the
`_220p.mp4` file and high mode uses the matching `_720p.mp4` file. The four
stems are `FundalReflexFullAnim`, `DOFullAnim`, `BIOFullAnim` and
`FrontofEyeFullAnim_timed`. Narration scripts reference the 720p delivery file.
The old `New_*.mp4` files are no longer shipped. Visual Acuity's two delivery
files are also stored here, but there is no Full Animation page for them yet.

### Front of Eye

The original editing source was `New_FrontofEyeFullAnim.mp4`; restore it
separately before running the timed-video build script. The player uses
`FrontofEyeFullAnim_timed_220p.mp4` or `FrontofEyeFullAnim_timed_720p.mp4`.
Ten holds are encoded into the video so
seek, replay and reload use the same absolute clock for visuals and speech.
The script target is 171.46 seconds; the 30 fps video rounds by less than a frame.

| Original time in seconds | Hold length | Held interval in the timed video |
| ------------------------ | ----------- | -------------------------------- |
| 6                        | 4 s         | 00:06-00:10                      |
| 16                       | 5.5 s       | 00:20-00:25.500                  |
| 40.5                     | 5 s         | 00:50-00:55                      |
| 72.5                     | 7 s         | 01:27-01:34                      |
| 77                       | 4 s         | 01:38.500-01:42.500              |
| 83.5                     | 4 s         | 01:49-01:53                      |
| 87.5                     | 3.1 s       | 01:57-02:00.100                  |
| 103.4                    | 7.5 s       | 02:16-02:23.500                  |
| 113.9                    | 1.1 s       | 02:34-02:35.100                  |
| 121                      | 3 s         | 02:42.200-02:45.200              |

The builder retains the source resolution, uses H.264 at 30 fps with
one-second keyframes and removes the source soundtrack. It checks the result
against the script duration with a 0.05-second tolerance. Change its `holds`
array, the script timings and the expected test intervals together.

Older root notes described three runtime holds on the original MP4. That
description is superseded. Do not add those runtime holds to the timed file.
The [asset README](../public/narration/front-of-eye/full-animation/README.md)
records the individual teaching cues around each hold.

### Direct Ophthalmoscopy

`New_DOFullAnim.mp4` uses a 183.083333-second script. Translations retain the
English cue timeline. `VIDEO_PAGE_SOURCES` configures these runtime holds:

| Video time | Hold | Additional settings                                                            |
| ---------- | ---- | ------------------------------------------------------------------------------ |
| 46 s       | 3 s  | `preserveMediaPosition`, `narrationResumeAt: 49.1`, `narrationCatchUpAt: 55.2` |
| 52.2 s     | 5 s  | `preserveMediaPosition`, `respectNarrationCatchup`                             |
| 141 s      | 4 s  | `preserveNarrationProgress`, `resumeAt: 142`, `narrationCatchUpAt: 144.95`     |

All three set `continueNarration: true`. The first may wait for narration
to reach 49.1 seconds before motion resumes. Audio can move ahead during a
hold, then wait at its catch-up point until the video reaches that point.
The final hold resumes the video at 142 seconds. Preserve these settings as
a group rather than adding the hold lengths to every later cue.

### Binocular Indirect Ophthalmoscopy

`New_BIOFullAnim.mp4` has a source duration of about 119.68 seconds. The
script's audio timeline is 130.68 seconds, including two runtime holds:

- At 43.7 seconds: hold for four seconds.
- At 103.6 seconds: hold for seven seconds.

Both use `continueNarration: true`, `preserveMediaPosition: true` and
`narrationCatchUpAt: 130.68`. Narration and captions continue while the frame
holds. The later narration timings include the accumulated audio lead.

### Fundal Reflex full animation

`New_FundalReflexFullAnim.mp4` and its script share a 274.273333-second timeline.
There are no `playbackHolds` for this page. The seven silent sections are
Preparation, Examination, Newborn Eyes Open, Newborn Eyes Closed, Possible
Findings, Unclear Findings and After Examination. English does not duplicate
the video titles in its captions; the other eight languages translate them.

## Shared video player behaviour

The four page IDs belong to the dedicated player set in `videos.js`.
Each uses a hidden `<audio preload="auto">` element for narration and a
caption panel built from parsed WebVTT. The controls provide play/pause,
seeking, mute and full screen. Keeping the video container in full screen
also keeps the caption panel visible.

Normally the video clock controls the audio and captions. During a runtime
hold or an active narration lead, the caption renderer uses the audio clock
when narration is enabled. The shared hold state records hold, lead and
catch-up phases. Audio follows pause, buffering, end, volume and rate changes.
Play and seek paths force alignment. Normal playback on iOS skips repeated
small corrective seeks, which previously caused audible drop-outs.

The narration menu stores `videoNarration:<pageId>` and
`videoNarrationLanguage:<pageId>` in local storage:

- Auto follows the app language, resolving a supported language or English.
- A manual supported language changes both audio and captions.
- Off stops narration; captions resolve from the app language.

Changing the global app language resets a previous manual video voice choice
to Auto. An explicit Off selection stays off.

The subtitle catalogue uses `es`, while the audio variant and filenames use
`es-419`. Keep that mapping intact. Language choices are separate per page.
Selecting a track does not translate interface text or fetch a complete
offline package for that language.

The generator's optional review MP4 copies the source video and adds the
audio track. It does not reproduce JavaScript holds for DO or BIO. Use the
running app to review those holds. Front of Eye's review uses the timed source.

## Fundal Reflex scroll narration

### Front of Eye scroll lesson

`frontOfEyeExaminationScrollPage` also uses the shared stage-autoplay engine.
Its configuration is in `public/js/frontOfEyeExaminationScroll.js`. It contains
eleven ordered Lottie paths and eleven audio intervals from the existing timed
Front of Eye M4A tracks. It loads `front-of-eye/full-animation/script.json` once
for translated stage guidance, selected by each interval's `cueIds`. Guidance
follows the resolved narration language, including Auto, with English fallback.
The four section headings use the supplied English folder titles.

Stage intervals are 3.7–9.7, 10–24.5, 27–46.8, 50–85.7, 87–94, 102–113,
115.5–120.1, 124–129.6, 130.6–134, 136–143.5 and 151–171.4 seconds.
These are audio times; caption triggers and exact final holds use local Lottie
frames. Speech can continue over a held final frame. Retiming the audio requires
reviewing these intervals. The full-animation audio files are reused unchanged.

Run `tests-e2e/front-of-eye-scroll.spec.js` on both Playwright projects to check
all eleven stage holds, frame screenshots, language switching, replay and cleanup.

### Fundal Reflex combined lesson

`fundalReflexExaminationScrollPage` is the combined Videos-route Lottie lesson.
`initializeFundalStageNarration()` enables audio only for that combined route.
It uses the full-animation audio files directly; there are no separate stage
audio exports and no VTT-driven transcript on the scroll page.

The track map and clip array are attached to its route configuration as
`narrationTracks` and `narrationClipsByFile`. Each clip array index matches a
Lottie file in the combined route. These are the current 22 playback intervals:

| Stage | Start-end in seconds | Spoken material             |
| ----- | -------------------- | --------------------------- |
| 1     | 4.2-9.2              | Preparation 01              |
| 2     | 9.2-19.2             | Preparation 02              |
| 3     | 19.2-35.2            | Preparation 03a-03b         |
| 4     | 36.2-52.2            | Preparation 04a-04c         |
| 5     | 55.8-59.8            | Examination 01              |
| 6     | 60.4-71.4            | Examination 02              |
| 7     | 71.4-87.4            | Examination 03              |
| 8     | 87.4-99.4            | Examination 04              |
| 9     | 99.4-114.35          | Examination 05a-05b         |
| 10    | 118.4-129.4          | Eyes Open 01                |
| 11    | 129.4-144.4          | Eyes Open 02                |
| 12    | 180-192              | Possible Findings 01        |
| 13    | 150-158.2            | Eyes Closed 01-02           |
| 14    | 158.2-170.4          | Eyes Closed 03              |
| 15    | 211.35-220.35        | Unclear Findings 01         |
| 16    | 220.35-230.35        | Unclear Findings 02         |
| 17    | 230.35-237.35        | Unclear Findings 03         |
| 18    | 237.35-260.35        | Unclear Findings 04-05b     |
| 19    | 175.2-180            | Possible Findings 02        |
| 20    | 180-207              | Possible Findings 01 and 03 |
| 21    | 264.3-268.3          | After Examination 01        |
| 22    | 268.3-274.27         | After Examination 02        |

This is stage order, not increasing MP4 time. Some intervals are reused.
The `cueIds` document which material belongs to each stage; playback uses
the numeric start and end values. Retiming Fundal Reflex audio therefore
requires a separate review of all scroll intervals.

At stage start or replay, the shared hidden audio seeks to the clip start.
It stops at the clip end using media events and a backup timer. Speech may
continue over a settled final frame when the animation is shorter. Starting
another stage replaces the previous interval. Route cleanup pauses audio,
clears the stop timer and removes its element and listeners.

The Eyes topbar contains a language selector and a separate on/off button.
It uses the same storage key prefixes as the video player with the scroll
page's own ID. Manual language changes preserve the position within the
active clip. A global app-language change returns this selector to Auto.
If autoplay is blocked, a user tap can start the active clip.

Short stage guidance still comes from `segmentStartTexts` and the shared
dictionary lookup through `translateFundalText()`. It follows the app language,
independently of the manual narration choice. Preserve title text toggling,
accumulated guidance, stage replay and the FR06 frame-settling rules in
[agent.md](../agent.md).

## Rebuild commands

Run commands from the repository root. Use a Python executable available on
the machine; replace `python` with its full path if needed. JavaScript helpers
use the project's Node.js runtime. Regeneration changes media files and is
not required for a documentation-only edit.

### Tool setup

```powershell
python -m pip install --target tmp/fundal-narration-tools edge-tts imageio-ffmpeg
python -m pip install --target tmp/luganda-tts-tools "torch>=2.6" "transformers<5" scipy
```

The second line is for the four local models. Their first use downloads model
weights. The shared generator accepts `--ffmpeg <path>` or finds a system
FFmpeg before checking its tools folder. The Front of Eye builder uses
`FFMPEG_PATH` or the imageio-ffmpeg executable in `tmp/fundal-narration-tools/`.

### Standard generation for any lesson

Use this PowerShell example for English Front of Eye:

```powershell
node scripts/build-front-of-eye-timed-video.cjs
$narrationLesson = 'front-of-eye'
$narrationLanguages = @('en')
$narrationArgs = @(
  '--script', "public/narration/$narrationLesson/full-animation/script.json",
  '--work-dir', "tmp/$narrationLesson-narration",
  '--artifacts-dir', ".codex-artifacts/$narrationLesson-narration",
  '--public-dir', "public/narration/$narrationLesson/full-animation",
  '--asset-stem', "$narrationLesson-full-animation"
)
python scripts/generate-fundal-narration.py @narrationArgs --languages @narrationLanguages --tts-only
python scripts/generate-fundal-narration.py @narrationArgs --languages @narrationLanguages --skip-tts
```

For another lesson, set `$narrationLesson` before constructing `$narrationArgs`:

| Lesson value                        | Available language arguments     |
| ----------------------------------- | -------------------------------- |
| `front-of-eye`                      | `en es-419 ko ne fr lg ha yo ig` |
| `binocular-indirect-ophthalmoscopy` | `en es-419 ko ne fr lg ha yo ig` |
| `direct-ophthalmoscopy`             | `en es-419 ko ne fr lg ha yo ig` |
| `fundal-reflex`                     | `en es-419 ko ne fr lg ha yo ig` |

Run the timed-video builder only for Front of Eye after restoring the original
editing source. Encode its output into both delivery resolutions before
regenerating narration; the script now references the 720p file. Change
`$narrationLanguages` to the tracks that actually need rebuilding. With no
`--languages` argument the generator processes all languages in the script.

`--tts-only` creates cue files and prints `OVERRUN` lines. It does not publish
delivery tracks or update the manifest, and an overrun report alone does not
give a failing exit code. Resolve those lines before mixing. After changing
text or voices, rerun cue generation without `--skip-tts`; that flag trusts
existing cue files and does not refresh them. The normal path also reuses
unchanged cues by fingerprint. Add `--skip-review-video` to omit review MP4s.

### Translation-specific preparation and connection

For BIO and Front of Eye:

1. Update `scripts/full-animation-translations.json`, then run
   `node scripts/localize-full-animation-narration.cjs`.
2. Use the standard generation command above with each lesson and only the
   changed languages. Inspect `--tts-only` output and shorten overruns before
   using `--skip-tts` to mix those same current cues. Keep both English tracks.
3. Run `node scripts/localize-full-animation-narration.cjs --connect` after
   all delivery audio and captions exist.

For Direct Ophthalmoscopy:

1. Update its maintained translated arrays and run
   `node scripts/localize-direct-ophthalmoscopy-narration.cjs`.
2. Use the standard generation command with lesson
   `direct-ophthalmoscopy` and languages `es-419 ko ne fr lg ha yo ig`.
   Inspect the cue pass, revise overruns and mix the current cues.
3. Run `node scripts/localize-direct-ophthalmoscopy-narration.cjs --connect`.
   Review the catalogue and confirm the English delivery files are unchanged
   when the task concerns only the eight additions.

For the later Fundal Reflex additions:

```powershell
node scripts/refine-parity-narration.cjs
python scripts/generate-fundal-narration.py --languages ne fr lg --tts-only
python scripts/generate-fundal-narration.py --languages ne fr lg --skip-tts --skip-review-video
node scripts/connect-parity-locales.cjs ne fr lg
```

For Hausa, Yoruba and Igbo, use `refine-ha-yo-ig-narration.cjs` in the first
line and `ha yo ig` as the language arguments in the other lines. These
commands use the generator's default Fundal Reflex paths. Inspect timing
reports between the cue pass and the mix. The explicit `--connect` step and
the separate scroll track map still matter; the generator does not wire UI.

## Offline delivery

The server's static asset manifest discovers public media. `languageinstall.js`
filters full or selected downloads using `choice.language` or the app language.
It maps Spanish to `es-419`, checks available audio per narration folder and
selects the matching audio and VTT pair. A lesson with no audio in that
language falls back to English. All four full animations now have the same
nine-language coverage. App-only downloads omit media.

Downloading one language does not include every other track. A manual voice
selection is a playback preference, so another language may need a fresh
download before offline use. Fundal scroll uses the same cached audio as its
full animation. Preserve catalogue matching, file discovery and complete-MP4
range handling when changing asset paths.

The checked-in service worker uses `arclight-static-v65` for title captions.
Read `public/sw.js` for the live value. Change the cache version when shipping
new required media or cached runtime behaviour. A documentation update alone
does not need a cache change.

## Verification

Run the relevant existing tests after changing media or its wiring:

```powershell
npm test -- --runInBand --runTestsByPath tests/fundal-narration-assets.test.cjs tests/direct-ophthalmoscopy-narration-assets.test.cjs tests/binocular-indirect-ophthalmoscopy-narration-assets.test.cjs tests/front-of-eye-narration-assets.test.cjs tests/full-animation-language-parity.test.cjs tests/videos-subtitles.test.cjs tests/fundal-scroll-narration.test.cjs tests/languageinstall-offline-narration.test.cjs
```

The asset tests check script/caption structure, delivery limits and catalogue
links. Player tests cover language choice, narration, captions and hold
behaviour. Scroll tests cover clip mapping, controls and lifecycle. Offline
tests check selected-language delivery and English fallback.

For new translations, also run `npm run check-translations` and the relevant
locale checks, including `tests/locale-spanish-parity.test.cjs` where applicable.
Inspect both source and generated text for damaged UTF-8 or unintended English.

For Front of Eye timing changes:

```powershell
npm run build
npm run test:e2e -- tests-e2e/front-of-eye-timeline.spec.js
```

The Playwright configuration serves the built output and covers desktop
Chromium and iPhone WebKit. Its WebKit case skips when the host cannot decode
the 220p delivery MP4; record that skip and use a capable device for the
remaining check. For shared Fundal scroll changes, use `npm run test:fundal`
and the manual FR06 checks in `agent.md`.

Manual media review should cover:

- Speech meaning and pronunciation against each demonstrated scene.
- Caption entry and exit, silent title cards and all frame holds.
- Seeking before and after holds, replay, reload and buffering recovery.
- Auto, manual languages, narration Off and caption behaviour.
- Full-screen captions and uninterrupted audio on iOS.
- Scroll replay, stage order, clip endings and leaving the route.
- A completed offline download with the intended language and fallback tracks.

Report automated results separately from listening, device and native clinical
review. Avoid treating one kind of check as evidence that the others happened.

### Checks completed for the documentation update

The later BIO and Front of Eye localisation passed nine focused Jest suites
with 180 tests. A separate check verified all 320 new speech fingerprints
against current text and voice settings, all 16 delivery durations and the
1.08 speed and 2 MB limits. The original English files and scene timing were
compared with Git and remained unchanged. QA reports and WAV masters remain
in each lesson's `.codex-artifacts/` directory; the combined summary is
`.codex-artifacts/full-animation-language-parity-qa.json`. This does not
constitute native clinical listening or physical-device review.

After the final Luganda terminology correction, the three affected delivery,
player and offline suites passed again (121 tests). The final production build
passed. Its 36 BIO/Front of Eye audio and caption files match current sources,
and the offline manifest includes all 32 additions with matching sizes.
Translation QA, Prettier and diff whitespace checks also passed.

On 15 September 2026, all seven focused Jest suites above passed: 102 tests
in total. A separate read-only check verified 20 delivered audio tracks
against their manifest sizes and SHA-256 hashes, matched VTT cue counts to
the scripts and resolved 55 local documentation links. Prettier and
`git diff --check` also passed for the edited documents.

The Jest run reported duplicate-package warnings from the existing
`tmp-front-eye-dist/` folder but completed successfully. No audio generation,
translation change, browser/device run or new clinical listening review was
part of this documentation update.

## Recorded development milestones

- 1-2 September 2026: initial Fundal Reflex narration and English/Spanish/Korean
  work, followed by stage reuse in the combined scroll page. The history
  includes `narration01`, `narration03` and `narration04`.
- 3 September 2026: Direct Ophthalmoscopy English narration in `DOnarration01`.
- 4 September 2026: BIO and Front of Eye English narration work in
  `BIOnarration01`, with subsequent timing refinements.
- September 2026: Front of Eye moved from runtime holds to the encoded
  ten-hold MP4. The current builder and script are the timing authority.
- 11 September 2026: Nepali, French and Luganda addition recorded in
  `naplangfrenc01`. The Fundal asset notes also date the Hausa/Yoruba/Igbo
  production work to 11 September; `hauyorigbo01` was committed on 14 September.
- 14 September 2026: the Direct Ophthalmoscopy asset notes record nine-language
  coverage. The checked-in catalogue and media contain all nine tracks.
- 15 September 2026: consolidated this record and updated README, agent notes
  and memory summaries to match the current implementation.
- 15 September 2026, subsequent localisation: added eight languages to BIO
  and Front of Eye, using the established voices and fixed cue boundaries.
  Edge TTS received the translated lesson text with the user's explicit
  permission. Local models used the existing cached revisions. Native
  clinical listening review remains outstanding.

Related documents: [README overview](../README.md#narration-and-captions-for-examination-lessons),
[agent rules](../agent.md#narration-and-caption-maintenance),
[active context](./activeContext.md) and [progress](./progress.md).

### Safety equivalence validation — 18 September 2026

Spanish/Korean `timedCues` and `timedAudioCues` already included PPE, avoiding the
examiner's eye/sideways orientation and referral for squint persisting after
three months. The legacy broad `cues` translations still omitted these and
were synchronized. Both delivery M4A tracks were regenerated with the existing
voice generator; VTT wording/timing was retained, and manifest/QA hashes updated.
Run `npm run check:clinical` for semantic invariants. The exact content revisions
in `clinical-review/fundal-es-ko.json` remain pending native bilingual clinical
listening and approval. CI requires that approval before releasing artifacts.

## Visual Acuity Full Animation

`visualAcuityFullAnimationVideoPage` uses `VisualAcuityFullAnim_220p.mp4` and `VisualAcuityFullAnim_720p.mp4` under `public/videos/FullAnim/`. It has English narration and captions only. Its 24 cues adapt the existing `vaWhoPage` teaching content, correcting transcription errors and matching the new sequence: preparation, distance acuity, pinhole/glasses, low vision and near acuity. The original animation is 198.57 seconds. User-revised English copy and starts are stored in `script.json`; `sourceStart` and `sourceEnd` retain the original scene clock. Nine encoded holds extend the delivery clock to 222.93 seconds. Video, narration and captions use this same clock with no runtime holds, so seeking and later cues do not depend on playback history.

Source and delivery files are in `public/narration/visual-acuity/full-animation/`. English uses `en-GB-SoniaNeural` through the existing generator. Cue masters are in `tmp/visual-acuity-narration`; review video, WAV and timing QA are in `.codex-artifacts/visual-acuity-narration`. All revised cues play at normal speed, with at least 0.35 seconds of room after speech. Original 220p/720p videos are retained in `.codex-artifacts/visual-acuity-narration/source/`; the public filenames remain unchanged. Offline downloads include English as the per-lesson fallback.

Rebuild in this order (the preserved original videos must be present):

```powershell
python scripts/generate-fundal-narration.py --script public/narration/visual-acuity/full-animation/script.json --public-dir public/narration/visual-acuity/full-animation --work-dir tmp/visual-acuity-narration --artifacts-dir .codex-artifacts/visual-acuity-narration --asset-stem visual-acuity-full-animation --languages en --tts-only
node scripts/build-visual-acuity-timed-video.cjs
python scripts/generate-fundal-narration.py --script public/narration/visual-acuity/full-animation/script.json --public-dir public/narration/visual-acuity/full-animation --work-dir tmp/visual-acuity-narration --artifacts-dir .codex-artifacts/visual-acuity-narration --asset-stem visual-acuity-full-animation --languages en --skip-tts
```

Validation: `tests-e2e/visual-acuity-full-animation.spec.js` checks launch order, both video qualities, all 24 cue starts, frozen frames, seeking and English audio/caption synchronisation. `tests/languageinstall-offline-narration.test.cjs` covers the English offline fallback and quality selection.

The practice hold now uses source frame 126 (8.4 seconds), matching the supplied reference image with complete green/right and red/left arrows and pointing hands before the check/cross overlays. It holds from delivery 13.0 to 18.6 seconds. Speech still ends at 17.24 seconds and the caption ends at 18.6, before motion resumes. The 5.6-second hold duration and every subsequent cue time remain unchanged. The previous 0:16 lighting scene is source 11.4 seconds and now starts its narration at 21.6 seconds. The original lighting hold is retained. The pinhole result explains improvement with glasses; the hand-movement and light-perception cues omit their conditional introductions. Other wording and existing holds are unchanged.

| Cue   | Original hold time | Added seconds |
| ----- | ------------------ | ------------- |
| va-01 | 4.400              | 4.600         |
| va-02 | 8.400              | 5.600         |
| va-03 | 14.933             | 4.667         |
| va-08 | 58.400             | 2.733         |
| va-11 | 87.933             | 1.733         |
| va-12 | 93.933             | 0.067         |
| va-13 | 99.400             | 0.133         |
| va-14 | 110.400            | 3.867         |
| va-21 | 173.933            | 1.000         |

### Visual Acuity scroll lesson — 23 September 2026

`visualAcuityExaminationScrollPage` uses the existing English `visual-acuity/full-animation/en.m4a` and `script.json`. Fifteen Lottie stages map to cue groups 01, 02, 03, 04, 05, 06, 07–10, 11, 12, 13, 14–17, 18, 19–20, 21–22 and 23–24. `visualAcuityExaminationScroll.js` records clip bounds and local-frame checkpoints, retaining encoded speech holds and the visual tail after the practice cue. The shared examination clock gates text and completion; other app languages use English audio rather than requesting absent tracks.

Visual Acuity review adjustments: caption blocks are constrained to the animation width on this scroll page only. The Low Vision hold uses local frame 151, before the woman/chart crossfade begins at 152. Near Vision stage 3 no longer holds at frame 170. Cue va-24 now reads "If the vision improves, it means they need glasses" in the shared script, scroll fallback copy, English VTT and regenerated English narration; audio duration and all cue times remain unchanged.
