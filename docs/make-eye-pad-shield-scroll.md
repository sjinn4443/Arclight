# Make an eye pad and eye shield scroll lesson

## Current delivery — 30 October 2026

Hand hygiene is removed from the animation, narration and captions in both
lessons. Eight stages start with equipment; the twelve remaining instructions
retain all nine voices. The source narration clock is 119s and Full Animation
is 128s, with section cards at 0–3s, 14–17s and 59–62s. Both 240p and 720p videos
are regenerated from the updated Lottie scenes. Asset folders remain 2–9;
the retired hygiene scene and its copied images are deleted.

The cone uses the geometry from the first shadow-length correction. The
original tape artwork is projected through masked strips with a wider upper
edge and narrower lower edge; the original bitmap pose resumes at frame 435.
Mask bounds overlap to avoid visible strip seams, and shadows stay behind all
texture strips. Scrolly controls retain their 1.5s completion pause.

`retime-eye-pad-shield-narration.cjs` removes the retired six-second audio slot
once, rebuilds video narration with the new section-card silences and rewrites
VTT files and checksums. Existing voices are retained. Earlier delivery records
below describe superseded timing and motion. Source cache is v119.

Validation: 23 focused unit checks pass, including both clocks, all nine audio
checksums, caption counts and the trapezoid geometry. Chrome passes both
completion-delay cases, all nine video voices, scrolly language switching and
the Full Animation player's route, seeking and 240p/720p switching. The production
build passes the original shell and media size limits. Latest renders cover
the paper/tape sequence in Chrome and WebKit.

Implemented 7 October and motion revised 19 October 2026. Launch the scroll row immediately below the matching
video in **Eye Pad / Shield**, or open
`#/eyePadShield/makeEyePadShieldScrollPage`. The original two procedure videos
remain available.

## Full animation video — 19 October 2026

The **Full animation** row immediately follows the scroll row and opens
`#/eyePadShield/makeEyePadShieldFullAnimationVideoPage`. It uses the same page
shell and shared player as Front of Eye: quality selection, narration menu,
caption panel, playback controls, full screen and sharing. Both pages offer
English, Latin American Spanish, Korean, Nepali, French, Luganda, Hausa, Yoruba
and Igbo using the same voices as Front of Eye. There are 13 spoken cues.
Video progress belongs to Eye Pad / Shield in My Learning. Selective procedure
downloads include the chosen resolution and language for both narration clocks.

`scripts/build-eye-pad-shield-video.cjs` renders the shipped nine Lottie JSONs
using the canvas renderer at 30fps. It inserts three silent title cards before
the sections, preserving the original one-second narration lead-in. It produces
`public/videos/FullAnim/MakeEyePadShieldFullAnim_240p.mp4` (220 × 240) and
`MakeEyePadShieldFullAnim_720p.mp4` (658 × 720), with one-second keyframes and
fast-start MP4 metadata. Audio remains a separate track, as on Front of Eye.
Lossless PNG frames are converted explicitly to limited-range BT.709 H.264.
The browser-decoded background is RGB (167, 162, 145), versus (168, 162, 146)
in the scrolly. This replaces the brighter, full-range JPEG-derived export.

| Section            | Scrolly start | Video title card | Video scene start        |
| ------------------ | ------------- | ---------------- | ------------------------ |
| Preparation        | 0s            | 0–3s             | 3s (speech starts at 4s) |
| Make an eye pad    | 17s           | 20–23s           | 23s                      |
| Make an eye shield | 59s           | 65–68s           | 68s                      |

The scrolly retains its 125s clock. Video has a 134s clock, with a separate
script, captions and audio under `full-animation/video/`. English titles are
baked into the video; other languages receive translated title captions.
The scrolly's section headings follow its selected narration language.

Rebuild after changing the scrolly scenes. Run `node scripts/build-eye-pad-shield-video.cjs`
with Playwright Chromium installed, or set `CHROME_CHANNEL=chrome` to use a local
Chrome installation. Set `FFMPEG_PATH` if the existing local imageio-ffmpeg
installation is unavailable. Maintained translations are in
`scripts/eye-pad-shield-translations.json`. Run
`node scripts/localize-eye-pad-shield-narration.cjs` to update both scripts,
generate the changed languages with the shared narration generator, then run
the localiser with `--connect`. Follow the generation commands in the
[delivery notes](../public/narration/make-eye-pad-shield/full-animation/README.md).
Playback checks live in
`tests-e2e/eye-pad-shield-video.spec.js`.

Chrome desktop/mobile cover all nine voice choices, translated captions and
headings, title-card boundaries, colour values, quality selection, direct links
and progress. The first delivery's packaging size gate failed at 20,007,617 bytes
against the unchanged 20,000,000-byte shell limit; that is a separate build issue.
Focused Jest checks total 182 passing tests. The accessibility audit covers 174
HTML files. Translated tracks are levelled to within 0.5 LU of the English
reference and verified below -1 dBTP after AAC encoding.

## Content and motion

### Original tape restored — 30 October 2026

The user's follow-up retains the original `11tape.webp` graphic. The overhead
attachment accounts for the graphic's measured principal angle and paper
centroid, with radial foreshortening derived from the cone's 310px radius and
280px height. Its visible centre lands at 56% of the seam radius. This correction
blends into the original camera-end transform: rotation 0, scale [125, 90] and
the original position at frame 435. The paper camera path is unchanged. The
straight replacement strip described below is superseded. The 1.5s completion
behaviour and shortened overlap shadow remain. Source cache is v117.

### Completion, shadow and tape follow-up — 30 October 2026

Each scrolly stage now finishes 1.5–1.62 seconds after its last visible movement
and spoken words. `EYE_PAD_SHIELD_MOTION_END_FRAMES` records the final movement;
`EYE_PAD_SHIELD_SPEECH_ENDS` records actual spoken ends for all nine delivered
languages from the narration QA report. Refresh that table when regenerating
voices. `endByLanguage` skips trailing silence while preserving every utterance
and the original source audio/caption clock. The shared engine's optional
`narrationCompletionPauseSeconds` adds a 1.5s final hold for this lesson only.
Other lessons retain their existing completion behaviour. English and Korean
finish the final scene at about source time 120s instead of 125s.

The overlap contact shadow now shares the raised lip's projection, so it ends
at the folding edge throughout the movement. The tape is a straight paper strip
with small torn ends. Its long axis crosses the projected seam at a right angle,
and camera motion uses uniform scaling so its proportions remain fixed. The
separate encoded Full animation video retains its previous export.

Follow-up verification: 21 focused Jest checks and the production build pass.
The new completion-control browser checks pass for all nine stages in English
and Korean on Chrome desktop and WebKit iPhone. They freeze the media clock,
verify controls stay hidden before the content ends, then measure the 1.5s hold
and check both replay and forward controls. Updated Canvas renders in both
browsers cover the fold, attachment and camera sequence.

### Overhead cone revision — 30 October 2026

The final scrolly scene now follows the supplied folding video: lift the right
cut lip before sweeping it over the stationary edge, then lower it onto the
overlap before applying tape. Projected foreshortening makes that lift visible
from above. Directional surface lighting develops with the cone so the paper
reads as a curved surface rather than a rotating flat disc. Intermediate mesh
keys are spaced fifteen frames apart during the fold. The camera stays overhead
through taping; its existing frame 315–435 movement and final geometry remain.
The 125s timeline, narration and tape attachment are unchanged. This revision
applies to the scrolly JSON; the separate encoded Full animation video retains
its previous export.

Verification: the 10 focused Jest checks and production build pass. Both Chrome
layouts pass playback/replay; Chrome desktop also passes deep links/downloads.
Chrome mobile's My Learning check fails to find its saved row. WebKit renders
all revised cone frames and passes deep links/downloads, but the broader playback
case times out during subsequent intermediate-stage captures. The final Chrome
frame is pixel-identical to the original. Preview: `tmp/eye-shield-fold-preview.gif`.

The revised first stage reuses the exact hand-washing animation from
`videos/directOphthalmoscopyScrollPage`. The introductory sentence is removed.
Folding/taping share stage 04; circular/radial cutting share stage 08.
The equipment-preparation cue is removed. Hands preserve their original artwork
proportions, with sizes matched using the brown hand rather than held tools.
The supplied instructions are the English captions and narration. The existing
`#/eyePadShield/eyeCareVideo-make_eye_pad` lesson supplies the motion reference:
`public/videos/Workshop/PEC/7.MakepadNshield_720p.mp4`.

| Animation              | Reference          | Narration interval | Motion                                                                                                                                             |
| ---------------------- | ------------------ | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01 Hand hygiene        | DO first animation | 1–7s               | Original geometry and six images, retimed to six seconds                                                                                           |
| 02 Preparation         | 01                 | 7–17s              | Equipment illustration without highlight circles; no preparation cue                                                                               |
| 03 Spread cotton wool  | 02                 | 17–30s             | Cotton pulls in several directions; registered hand/thumb pairs translate without deformation                                                      |
| 04 Fold and tape gauze | 03                 | 30–46s             | Complete gauze artwork; flap registered along the sloping right edge; extended right hand fades as one composition; tape lands later               |
| 05 Trim the eye pad    | 04                 | 46–59s             | Progressively trim only the short visited arc to the tape, then dissolve remaining edges, including tape; finished-pad cue                         |
| 06 Choose cardboard    | 05                 | 59–70s             | Static box illustration without scissors                                                                                                           |
| 07 Draw a circle       | 06–07              | 70–84s             | Pencil moves left-to-right in front, then right-to-left behind cup; cup rotates 45 degrees offscreen; circle, line wipe, then 8cm                  |
| 08 Cut circle and slit | 08–09              | 84–104s            | Progressively trim the short arc, dissolve remaining outline, settle into reference-09 pose; one upper-blade snip; slit visible at start of return |
| 09 Complete the shield | 10–12              | 104–125s           | Continuous roll/tape/camera sequence; finished-shield cue starts during camera rotation                                                            |

The final stage is one 630-frame Lottie animation at 30fps. Its paper facets and
overlapping flap share projected geometry. Folding and taping retain a fixed
top view, with the rolled outline becoming a 1.19:1 oval. The roll takes frames 45–180, tape
attachment takes 190–255 and the camera move takes 315–435. The tape moves with
the camera. The final frame holds the same object; there is no crossfade to a
separate scene-12 image. The supplied scene-12 illustration is the visual reference
for the final projection.

The scissors pieces share one animated screw position. Their measured anchors
are `[135, 367]` for the upper artwork and `[127, 205]` for the current lower PNG.
The lower source can be PNG or WebP; the generated runtime texture is WebP.
Circular cutting swings the lower piece from -8 to +8 degrees relative to the
upper piece, opening the blades further while preserving the common screw.
The lower artwork uses a 1.28 scale correction for trimming and a slightly
smaller 1.22 correction for circle cutting, around the shared screw.
Both cutting scenes register the lower crop at `[115, 217]`, bringing its grip
slightly right/up toward the upper palm. A positive outline with reverse-wound
holes hides its exposed joint spur and the two visible portions of the extended
reddish-brown finger. Zero-area bridges make the holes work in both SVG and
Canvas; Canvas does not implement Lottie's subtract-mask mode.
The previously added brown finger extension is removed. Blade and handle
artwork retain their original proportions.
The final slit pose and its four-degree upper-blade snip remain unchanged.
The lower piece sits behind the gauze/card while the upper blade remains in front.
The latter part of stage 08 moves the upper blade once and keeps the lower blade
stationary. The whole slit appears at local frame 480, when the upper blade starts
returning; it does not grow after the return. Stage 08 retains separate cut/slit
caption cues at 84–97s and 97–104s, so the 125s audio and all 13 VTT cues stay unchanged.

Stages 04/05/08 use the new `holdinghand_top.png` and `holdinghand_bottom.png`
crops, at one source scale, with their measured crop registration: bottom width
700px and top offset `[170, 18]` in the resized source coordinates before scaling.
Top is above the held material and bottom is below it. There is no synthetic
thumb mask or duplicate whole-hand image. Stage 04 shows the complete stationary
and folded gauze textures at the original 700px width, without a crease mask.
The gauze, cotton and flap are enlarged together about the fixed left grip;
the pad tape keeps its original 165px width and lands at the gauze's upper edge,
slightly raised again to graze the upper corner. The separate
`03and04and08and09fingershadow.webp` layer is removed from stage 04.
The right grip follows the enlarged hinge without stretching the hand. The flap's top
crop inset and 12.5-degree rotation align its left edge with the gauze's sloping
right edge; both ends meet with a small overlap. It widens as it folds over the
cotton. Its 28 masked texture strips sag and ripple during folding, then settle
flat, retaining a fixed crease and the source weave. The builder composites the original
right-hand/thumb and wrist extension into `foldinghand.webp`, then fades that
single image. Preserve this baking step: Lottie's canvas renderer applies a
precomposition's opacity to each child individually, which exposes the rear crop
through the thumb on WebKit. Both folding and pencil wrists extend beyond the
viewport. The source hand images remain unchanged; the generated composition
uses their native dimensions and relative crop offset `[77, 49]`.

The folding strips fade at frames 110–135, before the first finger contact at
frame 141. A rendered alpha-overlap check confirms there are no visible cloth/
holding-thumb intersections. The stationary gauze/cotton crossfade to the folded
texture at frames 125–150 so the earlier disappearance has a continuous handoff.

Pad/circle masks change only on the visited right-to-top quarter arc. Opposite
edges remain unchanged until the final-outline dissolve at frames 246–276.
The pad's tape uses the same progressive and final masks. The pencil's wrist extension shares its position,
uniform scale and rotation. Ellipse arc length keeps the growing visible segment
at the graphite; the remaining circle is revealed while the cup still covers it.
The pencil wrist continues along the source crop's cut edge beyond the viewport.
The cup sits 36px higher to expose the lower circle outline and leaves after the
pencil finishes, without fading. The measurement line
uses a left-to-right mask wipe before the 8cm label appears.

The cone keeps an overhead camera throughout folding and taping, with only a
10px apex rise. Before that surface settles, its right cut lip lifts towards
the viewer and foreshortens, then sweeps across the left cut edge by 0.85 radians
(about 49 degrees). Its radial edge
stays straight as the stiff sheet rolls, without a wave. A narrow, subtle shading
band marks the lifted edge and settles away once the overlap is complete. The oval
deformation starts after the free edge is already rolling. The lifted lip
settles onto the overlap without a gap. A narrow contact shadow tracks that
moving edge and fades left. Its angular width is
0.11 radians, twice the previous 0.055 (about 33px at the outer rim). The paper
faces use the same less-bright white stock (RGB 0.955), with directional surface
lighting during folding and taping. That lighting blends back to the original
white finish during the later camera move.
Tape crosses the overlapped edge before the camera moves at frames
315–435. Tape is attached at 56% of the radius, moved in from 72%, and follows
that same surface position during the camera move. Its straight paper shape and
left-cast shadow share the same position, rotation and uniform scale. The supplied
scene-11 texture remains untouched but is no longer used for this strip because
its already-curved silhouette distorted the overhead attachment.

## Ownership and integration

- `public/js/eyePadShieldScroll.js`: ordered scenes, instructions, durations,
  audio clips, sections and the `makeEyePadShieldScroll` engine config.
- `scripts/build-eye-pad-shield-scroll.cjs`: authored Lottie geometry and image
  placements. It reads the 32 supplied PNG/WebP layers from
  `public/videos/EyeProcedure/MakeEyePadShield/Assets` and creates reduced-size
  WebP textures, one assembled folding-hand texture and nine JSON files under
  `public/scrolly/eyeprocedures/make-eye-pad-shield/`.
- `public/html/eyeCareProcedure.html` and `public/js/eyeCareProcedure.js`: clone
  the hidden shell only for `eyePadShield`, insert the row, prime audio in the
  launcher gesture and initialise the shared engine on launch and deep links.
  Calls for the same DOM page are coalesced; replacement fragments initialise
  serially. Do not put `data-route` on this row: the global router would also
  handle the click and show the procedure root.
- `public/js/childhoodFundalPreparation.js` and
  `public/js/examinationScrollTiming.js`: existing stage autoplay, English script
  captions, audio/frame timing, mute, replay, scroll locking, restore and cleanup.
  The timing registry includes `route: "eyePadShield"` and `languages: ["en"]`.
- `public/style/pages.css` extends the combined-guide selector groups for this
  page. `public/style/eye-care-procedure.css` supplies the scroll icon, progress
  bar, title wrapping and caption width. The shared engine fits accumulated
  captions in the viewport while scroll is locked.
- `lessonProgress:makeEyePadShieldScrollPage` is monotonic, capped at 95 during
  scrolling and awarded 100 by the engine's completion event. My Learning has
  an explicit title and procedure destination because these rows are generated
  at runtime. The existing structural Back rule returns to Eye Pad / Shield.
- The existing `procedure-eye-pad` download category matches the JSON, textures,
  script and narration paths. English audio is retained when the selected app
  language has no track. Source service-worker fallback is v89.

Only English narration and instructional captions are shipped. Auto resolves to
English for other app languages. The existing translated procedure title and
shared controls still follow the app language.

## Regeneration

Rebuild artwork and script:

```powershell
node scripts/build-eye-pad-shield-scroll.cjs
```

For geometry/timing changes without re-encoding unchanged textures:

```powershell
node scripts/build-eye-pad-shield-scroll.cjs --scenes-only
```

After changing spoken text or cue intervals, regenerate the English delivery with
the existing narration generator. It needs Python with `edge_tts`, FFmpeg and
network access to the speech provider. Preserve the exact displayed `PPE` text;
the separate `ttsText` spells the letters for pronunciation.

```powershell
python scripts/generate-fundal-narration.py --script public/narration/make-eye-pad-shield/full-animation/script.json --work-dir tmp/make-eye-pad-shield-narration --artifacts-dir .codex-artifacts/make-eye-pad-shield-narration --public-dir public/narration/make-eye-pad-shield/full-animation --asset-stem make-eye-pad-shield --languages en --skip-review-video
```

The source video is a motion reference, not the new timeline. Keep
`--skip-review-video`: the nine-stage narration timeline is 125s and the reference
video is 73.73s. Runtime assets are `en.m4a`, `en.vtt`, `script.json` and
`manifest.json`; cue MP3 files and the WAV master stay in ignored working folders.

## Verification

```powershell
npx jest tests/eye-pad-shield-scroll.test.js tests/mylearning-inprogress.test.js tests/front-of-eye-scroll.test.js --runInBand
npx playwright test tests-e2e/eye-pad-shield-scroll.spec.js tests-e2e/eye-care-procedures.spec.js
npx playwright test tests-e2e/examination-scroll-sync.spec.js tests-e2e/examination-scroll-headings.spec.js --grep makeEyePadShield
npx playwright test tests-e2e/front-of-eye-scroll.spec.js
npx playwright test tests-e2e/eye-pad-shield-scroll.spec.js --project=webkit-iphone --workers=1
npm run test:a11y
npm run build
```

Jest checks every referenced image, all twelve reference scenes, cue order,
track checksum, caption count and continuous final geometry. Browser checks cover
row order, live rendering, all final frames, replay, completion restore, Back,
deep links, mute, English fallback, My Learning and download selection. The shared
clock test verifies caption boundaries and advancement gating for every stage.
Generated browser screenshots include all nine stages and intermediate cone
frames for desktop and iPhone-size layout review.

The revised browser suite checks every stage's final frame, both preparation
caption blocks on mobile, English fallback, My Learning and the actual menu's
download worker request. The worker and download manifest are mocked. Jest also
checks DO image copies, short cutting arcs and finished outlines, common scissors
pivots, undeformed hand pairs, the single upper-blade snip and graphite/line
alignment. Current verification and build budgets are recorded in
`memory-bank/progress.md`.

Lottie image
prefixes must remain relative (`../images/`); a root prefix is concatenated with
the animation folder by Lottie and produces broken images. The browser suite
checks lesson asset responses and the mobile preparation-caption bounds.

Windows WebKit uses the existing mocked narration clock because this runner
cannot decode the AAC track. Its actual Lottie rendering and navigation are
tested; Chromium checks the real English audio. Physical iPhone audio output
has not been checked by these desktop tests.

Use a single worker for Windows WebKit verification. In the second motion revision,
the parallel run passed 16 of 18 cases; the new lesson's last-stage replay and
Front of Eye's completion restore timed out. Both passed unchanged in a
single-worker production rerun. No shared playback logic was changed.

The third revision's serial regression run passed all 18 case bodies, but its
web-server teardown stalled and was stopped. Intermediate WebKit screenshots
then revealed the precomp fade issue described above. After baking the hand,
the final production lesson suite passed all 8 checks on desktop/WebKit with
exit code 0. The runner's teardown completed after stopping only its own test
server (identified in its WebServer output). Do not stop the user's development
server. Final WebKit fold/fade screenshots match the single-image composition.

19 October motion revision: the focused Jest suites passed all 9 tests; the
production lesson suite passed all 4 desktop/mobile Chrome checks. Intermediate
frames were also inspected in both SVG and Canvas renderers. The build passed,
and all six changed stage JSONs match their distribution copies. The broader
desktop regression run passed 14 of 15 case bodies: the Visual Acuity speech-clock
case failed while its hub remained visible. Its files were outside this revision.
The runner stalled during teardown and was interrupted after all case bodies
finished. Windows WebKit was unavailable in this environment; these checks do not
establish physical iPhone rendering or audio output.

The subsequent size/top-view revision passed all 7 focused Jest tests. Of the
8 desktop/mobile Chrome lesson, heading and speech-clock checks, 7 passed on the
first run; the desktop My Learning check briefly found no saved row, then passed
unchanged when rerun alone. SVG and Canvas frame reviews cover the enlarged
gauze, matched cutting blades, oval fold, attached tape and later camera move.

The final soft-gauze/original-cone revision passed all 7 focused Jest tests and
all 8 desktop/mobile Chrome lesson, heading and speech-clock checks. SVG and
Canvas reviews confirmed the flexible gauze strips, original pad-tape size,
moderate lower-scissor correction, restored cone gradient and left-cast tape
shadow. The changed runtime JSONs match their distribution copies.

The contact/overlap revision passed all 8 focused Jest checks, including an
alpha-sampling check that gauze sits directly behind the pad tape's upper edge.
All 8 desktop/mobile Chrome lesson, heading and speech-clock checks passed.
SVG/Canvas reviews include the widest scissor opening, the landed tape, and
intermediate paper-overlap frames. The cone centre is fixed throughout folding
and taping, and its contact shadow starts with zero area and follows the right
paper edge as it crosses onto the left surface.

The explicit-roll revision passed all 8 focused Jest checks. The desktop/mobile
lesson, headings and clock checks passed; the two saved-row navigation checks
initially found no My Learning item and passed unchanged when rerun separately.
SVG/Canvas reviews include the supplied thumb shadow, masked scissor joint,
matching pad/circle cutting hands, and bowed paper edge at frames 75/105/135.
Scenes 04/05/08/09 and their media revisions/offline sizes were refreshed and
verified against the built distribution, within the existing size budgets.

The stiff-roll/finger-removal revision passed all 8 focused Jest checks and all
8 desktop/mobile Chrome lesson, heading and speech-clock checks. SVG and Canvas
frame reviews confirmed the removed scissor finger, smaller circle-cutting lower
blade, raised gauze tape without the separate thumb-shadow layer, straight rolling
paper edge, subtle apex relief and matching paper whites. Scenes 04/05/08/09,
their distribution copies, offline sizes and media revisions match; distribution
size budgets pass.
