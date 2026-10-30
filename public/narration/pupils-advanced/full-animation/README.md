# Advanced Pupils scroll lesson

The **Pupils** scrolly row sits immediately below **Pupils Advanced PDF** in
`#/videos/pupilsPage` and opens `#/videos/pupilsAdvancedScrollPage`. Its title is
Pupils, while its assets and progress use distinct Advanced identifiers.

The two-page `public/pdfbasedanims/Pupils Advanced_110826.pdf` is the visual and
teaching-order source. Its PDF-compatible Illustrator master, `Pupils Advanced.ai`,
is retained beside it. SHA-256 checksums for both masters are recorded in
`public/scrolly/coreexam/pupils-advanced/provenance.json`. Neither source master is
included in distribution or offline downloads.

Fifteen 30fps rects cover seven sections. Fourteen are 1169 x 1280; only the
Direct/Consensual pathway explanation is shortened to 1169 x 1093 to match its
artwork. Nine scenes are authored
from Advanced source components. Observation and all five Direct Light Response
scenes (including cataract) reference the six original PEC JSON paths verbatim.
Both languages reuse the shipped PEC audio from seconds 1–102 at seconds 107–208
of the Advanced track; the narration manifest records the original track hashes.

Use proportional cover for the two near-technique panels, with the fixation
target and device inset so neither is cropped. Use contain for the full reflex
diagram so both afferent arrows and the efferent arrow remain visible. Never stretch
artwork. The two near-result faces use higher-resolution source textures, so their
sharpness matches the animated irises.
Device illumination reaches the retina before afferent arrows travel. Efferent
arrival precedes pupil constriction and direct/consensual labels follow their cues.
The device and circular pool switch on at once, while the vertical shaft alone
grows upward to the retina. Retinal/optic-nerve anatomy stays fixed and the pool
and shaft remain behind the device. The shaft mask uses the texture's original
source coordinates so the full retinal cone remains visible after reframing.
Afferent signals retain one original rounded Bezier head per colour, overlapping
each shaft along a distance-matched trajectory. Brain perimeter paths reach a shared
junction before two branches draw together. Retina, optic nerve, chiasm, tract and
nuclei highlight in signal order. Reflex diagrams use
the earlier full-art vertical wipes, keeping independent pupil and label timing.
Flow signals run behind opaque boxes/text; original radial arrows trim inward for
the constrictor and outward for the dilator, with progressive muscle aperture changes.
The third-nerve blink moves only the upper lid; lashes bend and flatten as it closes,
while the iris and lower lid stay fixed. Flowchart connectors restore source magenta
for the parasympathetic diagram and the original radial-arrow purple for the sympathetic diagram. The
dilator preserves all sixteen original fibres and eight complete arrowheads. Muscle discs
use their measured PDF centres and radii, with the original raster disc removed
before the animated one is drawn. Swinging devices and their pools share
motion; lens windows change from black to white with the pool. Examination pupils
wait 0.4 seconds after full illumination before constricting. Only soft face patches brighten; the unlit eye is 40% brighter than
the dark face. The second swinging scene reveals arrows behind the moving device.
Near technique preserves
the red bird and its eye, with object highlight preceding directional arrows.
Consensual outlines appear at light-on; green fill and ticks arrive later. The top
panel completes at frame 210, followed by the lower panel at 240: a one-second
handoff. A foreground white divider spans the entire rect. Swinging-test panels
omit the original baked white dividers and put the Arclight above the arrows. The
moving light ellipse has a full transparent edge and padded scene bounds; swings
take 42 rather than 60 frames. RAPD follows the pupil app: healthy-side light
constricts both pupils, which remain constricted during transit. Once the light
reaches the affected eye, its 250ms latency/220ms pulse precede bilateral dilation.
Near-target hand/Arclight rotates about its elbow, swinging from left to right
behind the speech-bubble body and above its tail, whose tip sits just left of the
held device; both arrows and the highlight
begin when it settles. The two panels fill their rects proportionally, use the
original distance-arrow texture, and share a foreground full-width divider.
Near results use smaller 800px-wide rounded face cards with unchanged 110px status
symbols. Cards move 50px toward one another, and convergence takes 57.5 frames,
twice the previous speed. Each face is extracted without its old baked corner clipping and receives
one rounded-card mask. Animated source iris positions remain inside closed sclera
masks, foreground eyelids above the irises, and result symbols after motion. PDF fill paths must explicitly close for
Lottie's mask renderer, even when SVG/PDF implicitly fills an open path.

The afferent anatomy detail was checked against [Stanford's pupil chapter](https://neuro-ophthalmology.stanford.edu/2019/10/neuro-ophthalmology-illustrated-chapter-12-the-pupil-2/).
The near-result narration describes **convergence**: the eyes turn inward together
for a near target. It asks for further examination when this coordinated movement
is absent, without assigning a diagnosis from the illustration. See the
[National Eye Institute](https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/convergence-insufficiency).

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

The authoring pipeline saves word boundaries for `reflex-output` and `swing-rapd`
alongside cached speech. The builder records the measured English `constrict` and
`dilate` times in `script.json`'s `visualCues` and aligns the pupil movements.
RAPD is explained before the affected-eye swing and paradoxical dilation.
The Advanced cataract clip skips the original PEC recording's silent tail, with
language-specific endings 1.5 seconds after speech (English 17.76s, Korean 19.32s
after stage start). The shared PEC recording, animation and subsequent stage
start times remain intact.

The first afferent scene and Consensual Response also skip their silent tails.
Controls appear 1.5 seconds after the later of visual and spoken completion.
An intermediate narration/frame anchor preserves the original animation speed.
Only the illuminated left pupil in the reflex explanation sits beneath its light beam.
The Consensual and Near technique dividers use the same full-width 6px stroke.

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
