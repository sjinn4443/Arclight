# Make an eye pad and eye shield scroll lesson

Implemented and revised 7 October 2026. Launch the scroll row immediately below the matching
video in **Eye Pad / Shield**, or open
`#/eyePadShield/makeEyePadShieldScrollPage`. The original two procedure videos
remain available.

## Content and motion

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
| 04 Fold and tape gauze | 03                 | 30–46s             | Stationary half ends at the fixed crease; widening flap folds over it; extended right hand fades as one composition; tape lands later              |
| 05 Trim the eye pad    | 04                 | 46–59s             | Progressively trim only the short visited arc to the tape, then dissolve remaining edges, including tape; finished-pad cue                         |
| 06 Choose cardboard    | 05                 | 59–70s             | Short leftward cut from bottom right, turn 90 degrees, then cut a shorter distance upwards                                                         |
| 07 Draw a circle       | 06–07              | 70–84s             | Pencil moves left-to-right in front, then right-to-left behind cup; cup rotates 45 degrees offscreen; circle, line wipe, then 8cm                  |
| 08 Cut circle and slit | 08–09              | 84–104s            | Progressively trim the short arc, dissolve remaining outline, settle into reference-09 pose; one upper-blade snip; slit visible at start of return |
| 09 Complete the shield | 10–12              | 104–125s           | Continuous roll/tape/camera sequence; finished-shield cue starts during camera rotation                                                            |

The final stage is one 630-frame Lottie animation at 30fps. Its paper facets and
overlapping flap share projected geometry. The roll takes frames 45–180, tape
attachment takes 190–255 and the camera move takes 315–435. The tape moves with
the camera. The final frame holds the same object; there is no crossfade to a
separate scene-12 image. The supplied scene-12 illustration is the visual reference
for the final projection.

The scissors pieces share one animated screw position. Their measured anchors
are `[135, 367]` for the upper artwork and `[127, 205]` for the current lower PNG.
The lower source can be PNG or WebP; the generated runtime texture is WebP.
Its opening is narrower than the supplied open pose: the lower piece is offset
4 degrees towards closed and swings just 4 more degrees, keeping the fingers
joined to the palm. The final snip also moves the upper blade only 4 degrees.
The lower piece sits behind the gauze/card while the upper blade remains in front.
The latter part of stage 08 moves the upper blade once and keeps the lower blade
stationary. The whole slit appears at local frame 480, when the upper blade starts
returning; it does not grow after the return. Stage 08 retains separate cut/slit
caption cues at 84–97s and 97–104s, so the 125s audio and all 13 VTT cues stay unchanged.

Stages 04/05/08 use the new `holdinghand_top.png` and `holdinghand_bottom.png`
crops, at one source scale, with their measured crop registration: bottom width
700px and top offset `[170, 18]` in the resized source coordinates before scaling.
Top is above the held material and bottom is below it. There is no synthetic
thumb mask or duplicate whole-hand image. The stationary gauze and final folded
image are masked at x=584; the folding flap keeps the same hinge and widens to
120% while folding onto the stationary half. The builder composites the original
right-hand/thumb and wrist extension into `foldinghand.webp`, then fades that
single image. Preserve this baking step: Lottie's canvas renderer applies a
precomposition's opacity to each child individually, which exposes the rear crop
through the thumb on WebKit. Both folding and pencil wrists extend beyond the
viewport. The source hand images remain unchanged; the generated composition
uses their native dimensions and relative crop offset `[77, 49]`.

Pad/circle masks change only on the visited right-to-top quarter arc. Opposite
edges remain unchanged until the final-outline dissolve at frames 246–276.
The pad's tape uses the same progressive and final masks. The pencil's wrist extension shares its position,
uniform scale and rotation. Ellipse arc length keeps the growing visible segment
at the graphite; the remaining circle is revealed while the cup still covers it.
The cup leaves after the pencil finishes, without fading. The measurement line
uses a left-to-right mask wipe before the 8cm label appears.

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
