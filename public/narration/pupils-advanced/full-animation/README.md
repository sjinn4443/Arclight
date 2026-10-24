# Advanced Pupils scroll lesson

The **Pupils** scrolly row sits immediately below **Pupils Advanced PDF** in
`#/videos/pupilsPage` and opens `#/videos/pupilsAdvancedScrollPage`. Its title is
Pupils, while its assets and progress use distinct Advanced identifiers.

The two-page `public/pdfbasedanims/Pupils Advanced_110826.pdf` is the visual and
teaching-order source. Its PDF-compatible Illustrator master, `Pupils Advanced.ai`,
is retained beside it. SHA-256 checksums for both masters are recorded in
`public/scrolly/coreexam/pupils-advanced/provenance.json`. Neither source master is
included in distribution or offline downloads.

Fifteen 1169 x 1280, 30fps rects cover seven sections. Nine scenes are authored
from Advanced source components. Observation and all five Direct Light Response
scenes (including cataract) reference the six original PEC JSON paths verbatim.
Both languages reuse the shipped PEC audio from seconds 1–102 at seconds 107–208
of the Advanced track; the narration manifest records the original track hashes.

Use proportional cover when the artwork must fill the rect. Preserve the requested
source margins for Near Response with proportional contain layouts; never stretch
artwork. The two near-result faces use higher-resolution source textures, so their
sharpness matches the animated irises.
Device illumination reaches the retina before afferent arrows travel. Efferent
arrival precedes pupil constriction and direct/consensual labels follow their cues.
The device and circular pool switch on at once, while the vertical shaft alone
grows upward to the retina. Afferent signals have one original head per colour,
anchored to each shaft with a distance-matched trajectory. Reflex diagrams use
the earlier full-art vertical wipes, keeping independent pupil and label timing.
Flow signals run behind opaque boxes/text; original radial arrows trim inward for
the constrictor and outward for the dilator. Swinging devices and their pools share
motion while only soft face patches brighten; the unlit eye is 40% brighter than
the dark face. Complete source arrows reveal tail-to-tip. Near technique preserves
the red bird and its eye, with object highlight preceding directional arrows.
Consensual outlines appear at light-on; green fill and ticks arrive later. The
moving light ellipse has a full transparent edge and padded scene bounds; swings
take 42 rather than 60 frames. RAPD follows the pupil app: healthy-side light
constricts both pupils, which remain constricted during transit. Once the light
reaches the affected eye, its 250ms latency/220ms pulse precede bilateral dilation.
Near-target hand/Arclight rises first; both arrows and the highlight begin together
when it settles. Near results use two faces, animated source iris positions inside closed sclera
masks, and result symbols after motion. PDF fill paths must explicitly close for
Lottie's mask renderer, even when SVG/PDF implicitly fills an open path.

The afferent anatomy detail was checked against [Stanford's pupil chapter](https://neuro-ophthalmology.stanford.edu/2019/10/neuro-ophthalmology-illustrated-chapter-12-the-pupil-2/).

`public/js/pupilsAdvancedScroll.js` owns the sections, 35 bilingual cues, stage
durations, local paths and narration/frame clock. Seven section titles follow
the narration language. The shared `childhoodFundalPreparation.js` stage-autoplay
engine supplies replay, forward-scroll gating, lazy loading, viewport fitting,
mute/language preferences, completed restore and route cleanup. The Videos route
owns initialization and `lessonProgress:pupilsAdvancedScrollPage`; Back returns to
Pupils and My Learning reopens the same Advanced lesson.

The 315-second English and Korean tracks use en-GB-SoniaNeural and
ko-KR-SunHiNeural. The handout is not a verbatim spoken script: cues describe its
diagrams without introducing treatment advice or new diagnostic thresholds.
Other application languages use English narration/captions. No PDF rendering,
speech synthesis, WebGL or external artwork is needed during lesson playback.

Regenerate from the repository root, using the same authoring environment as PEC:

```sh
python scripts/extract-pupils-advanced-art.py
node scripts/build-pupils-advanced-scroll.cjs
python scripts/generate-pupils-advanced-narration.py
```

Extraction needs PyMuPDF 2.0; an authoring install may live at
`tmp/pupils-pec/pdf-tools`. Sharp rasterizes authoring SVG layers to local WebP
assets and writes the initial PNG posters. The speech generator reuses the shared
Fundal pipeline with Edge TTS and FFmpeg from `tmp/fundal-narration-tools`. It sends
cue text to Microsoft only while authoring. Cached utterances, WAV masters and
timing QA remain in ignored `tmp/pupils-advanced/narration/`. Speech must fit each
cue slot at no more than 1.08x speed; shorten a cue rather than truncating it.
The shipped files are M4A, VTT, script and checksum manifest. There is no separate
Advanced Full Animation video in this feature.

Checks: `tests/pupils-advanced-scroll.test.js`,
`tests/pupils-advanced-offline.test.js` and
`tests-e2e/pupils-advanced-scroll.spec.js`. Inspect the browser-rendered contact
sheet as well as assertions, especially fixed pupil properties and final frames.
Chrome desktop/mobile emulation verifies the shipped AAC tracks; physical iPhone
audio and clinical sign-off require separate review.

Revision verification (24 October 2026): 26 focused Jest checks passed, including
RAPD arrival/pupil timing, simultaneous near cues, source audio reuse and caption
groups across all three lessons. Sixteen distinct desktop/mobile browser checks
passed across playback, speech clocks, restore, localization and PEC Full Animation.
The old split-caption restore assertions were updated and their affected cases
rerun successfully. Nine owned scenes were inspected in SVG and Canvas; 177 HTML
files passed the accessibility audit. Bundling and minification completed, then
packaging resumed after a Windows file lock. Shell/media budgets passed. All 205
referenced runtime files match source bytes and manifest hashes, including 110
Advanced runtime assets.

Caption display groups are separate from spoken cue times. `clear-view` shows
“Make sure they do not look at the examiner or the light itself.” immediately,
while `avoid-light` remains a later spoken cue with no additional caption line.
The same metadata and grouped VTT are used by PEC scrolly, Advanced and PEC Full
Animation. `scripts/lib/pupils-caption-authoring.cjs` rebuilds these captions
without changing speech or MP4s. Pupils captions use balanced line wrapping.
