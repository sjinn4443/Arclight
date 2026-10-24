# Pupils PEC

The lesson uses the illustrations in `public/pdfbasedanims/Pupils PEC_110826.pdf`.
Its section order is Observation, then Direct Light Response. The PDF contains
diagrams and short labels rather than a spoken script; the English and Korean
captions are authored descriptions of those illustrations. The two diagnostic
labels are retained from the source. No new diagnostic thresholds are introduced.

`public/js/pupilsPecScroll.js` owns the six scenes, thirteen cues, languages and
timing. Each stage uses the shared autoplay engine, a packaged AAC track, and
translated caption text from `script.json`. Other app languages fall back to
English. No speech synthesis or PDF rendering is needed at runtime.

The **Pupils PEC Full Animation** row below the scrolly opens
`#/videos/pupilsPecFullAnimationVideoPage`. It uses the shared Full Animation
player with quality selection, English/Korean narration, captions, full screen,
sharing and saved video progress. The MP4 contains the same six Lottie scenes
at 30fps, preserving the one-second opening hold. Two silent 3-second section
cards introduce **Observation** at video 0–3s and **Direct Light Response** at
22–25s. English headings are baked into the MP4 as centred white text on
`#0f0f0f`, matching Eye Pad / Shield; Korean title captions appear below it.
The scrolly retains its 102-second clock. The video runs for 108 seconds with
separate M4A/VTT/script/manifest files under `video/`. The builder inserts silence
into the existing English/Korean audio and offsets the cues, without new TTS.
It always reads the original scroll audio, avoiding cumulative AAC re-encoding.

After changing the scenes, regenerate both delivery videos:

```sh
node scripts/build-pupils-pec-video.cjs
```

Use `CHROME_CHANNEL=chrome` for installed Chrome or `FFMPEG_PATH` for a different
FFmpeg executable. Outputs are `public/videos/FullAnim/PupilsPecFullAnim_240p.mp4`
(220 × 240) and `PupilsPecFullAnim_720p.mp4` (658 × 720). Lossless Canvas PNG
frames are encoded as limited-range BT.709 H.264 with one-second keyframes and
fast-start metadata. Audio stays separate so language switching uses the same
video. The Core Pupils selective download includes the selected quality and
narration language, with English fallback. Playback coverage lives in
`tests-e2e/pupils-pec-video.spec.js`.

Rebuild artwork and the cue sheet from the repository root:

```sh
python scripts/extract-pupils-pec-art.py
node scripts/build-pupils-pec-scroll.cjs
```

Extraction requires PyMuPDF 2.0 (the local authoring install can live in
`tmp/pupils-pec/pdf-tools`) and the repository's Sharp dependency. The source SVG
paint groups are separated with their original clipping and opacity. The
extractor validates known paint groups before assigning components. It preserves
the source's normal and abnormal examples, and removes baked coloured marks
from the initial positioning scene so they can appear in teaching order.

Observation is one four-panel scene. The five Direct Light Response scenes are
button/brightness, fixation, side approach/insert, clear pupils, and cataract.
The transparent-window instrument comes from the original PDF. The thumb,
supporting grip, rounded button and quiet/dim-room icons reuse the Direct
Ophthalmoscopy source artwork. The thumb retains the original DO grip-relative
position, joint pivot and pressing rotation. The PDF beam sides extend past the rect, and
the PDF lens gradient brightens with the beam. Button presses increase the light
in three steps, then the background dims. Both response scenes use the same three-row layout,
light travel, pupil sizes and delayed fundus/status column. Cataract changes
the pupil colour, with the response unchanged for the corresponding example.
Each stage uses the standard `1169 / 1280` rectangle. Original arrows are
extracted as transparent artwork layers, rather than redrawn. Observation labels
and status symbols fade in together near the end. The positioning symbols keep
their circle and glyph together, without rectangular background patches. Faces
remain dark outside the pool while the response scenes move/change the original
instrument and illumination, before the pupil response and delayed fundus reveal.
The illustration layers retain their original proportions. Every tick, X and
exclamation symbol uses the same 110-unit outer-circle diameter on the 1169-unit
canvas, independent of the surrounding illustration scale. Response panels use
clipped compositions so moving light and instruments cannot spill into the gaps.
A circular final light pool masks a bright face layer. The right illustration retains its own fixed outline, with its initial internal
arrangement matching the left, then pans with the light entering the eye;
the pupil stays centred on the iris throughout that camera transition.
The patient face covers the side-held device and examiner arm until the device
turns to the front. A rounded extruded body, recessed window walls and tubular
sight loop turn from the opposite thin side angle. The case depth is reduced
from34 to26 model units; its final roll remains23 degrees with the right edge visible. A perspective rasterizer
keeps the window/solar-panel face visible throughout; the red-button reverse is
never shown. The supplied front/side/back illustration is retained
in `scripts/assets/pupils-pec/front-side-back.png`; its optical face textures
the model. `scripts/lib/pupils-device-render.cjs` bakes 61 views into four local
image atlases, played at80 percent size inside a clipped Lottie viewport. The
lower case is hidden within the gripping hand; its window and full solar panel
remain visible. The near-eye light pool has a teardrop contour: its narrow end begins at the
optical window's right rim and opens toward the eye, with a rounded outer lobe.
The beam tracks that rim as the device turns, keeping its neck visible. There is no runtime WebGL
dependency or independent horizontal image scaling. The source hand shares the
existing projected wrist-axis turn. The original nasal/far-face
foreground stays above the beam. The blue sleeve is traced from the supplied
reference at its original 119:271 proportions, connects across the upper arm and
renders above it. A copy clipped along a smooth cuff boundary inside the elbow contour brings only
the forearm/hand back in front of the cuff, sharing identical animation transforms.
A continuous rounded lower arc removes both the tiny cuff notches and the
pointed tip at the forearm crossing. The existing hand/arm movement is preserved.
Comparison scenes retain the larger examination device scale. The window and
solar-panel details are complete; the window moves to the circular pool
centre height, further left of the pupil. The lower body clips at the fixed right cell
outline. The circular final pool preserves the original teardrop's projected area
and centre. Left-hand pools retain their source contour, with a continuous soft
white halo replacing the PDF's small raster image and quantised mask. Its .50
peak opacity reduces the left-hand white rim further; the right-hand pools stay unchanged.
The two positioning scenes use proportional cover crops within their rectangles,
never independent width/height stretching. A separate fixation cue starts the
light highlight with the words “or the light itself”.
See the shared [PDF/AI authoring rules](../../../../docs/lottie-examination-scroll-pages.md#preparing-artwork-from-pdf--ai).
Observation retains its original top-aligned entry. Later scenes centre the
scene and its full reserved caption together below the topbar. On shorter viewports, the scene scales proportionally to keep the complete
group visible; the first/last group receives any required scroll space.
Initial posters and all image references are local. Original PDF/AI authoring files are
preserved locally and excluded from distribution and offline downloads.

Generate the recorded tracks using the existing narration tool dependencies in
`tmp/fundal-narration-tools` (Edge TTS and imageio-ffmpeg):

```sh
python scripts/generate-pupils-pec-narration.py
```

Generation sends the cue text to Microsoft's speech synthesis service. Cue
masters and timing QA stay in ignored `tmp/pupils-pec/narration`; only the AAC,
VTT, cue sheet and checksum manifest are packaged. Each voice uses its natural
delivery with a maximum 1.08 playback adjustment enforced by the shared pipeline.

The fixation caption now displays the complete examiner/light sentence at the
`clear-view` cue. The spoken `avoid-light` cue and its visual light highlight keep
their later timing. `caption`/`captionUntil` metadata groups text independently of
speech; `scripts/lib/pupils-caption-authoring.cjs` updates PEC, Advanced and the
Full Animation VTT without re-encoding narration or video.
