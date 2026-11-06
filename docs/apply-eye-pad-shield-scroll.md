# Apply an Eye Pad and Eye Shield

The `lesson-row--scrollytelling` launcher immediately follows the `apply_eye_pad`
video in Eye Pad / Shield. Route:
`#/eyePadShield/applyEyePadShieldScrollPage`.

As of 6 November 2026, the procedure catalogue groups the three Make lessons
(video, scrolly, Full animation) in **Make**, followed by the two Apply lessons
(video, scrolly) in **Apply**. Both use the shared procedure folder builder:
in-place expansion, heading-level Close control and launcher focus restoration.
Their open state survives lesson return and refresh in session storage. Deep
links open the corresponding folder for Back navigation. English video and
scrolly titles use “Make an Eye Pad and Eye Shield” and
“Apply an Eye Pad and Eye Shield”. Folder regressions cover the five deep-link
destinations plus keyboard expansion, counts, titles, close and refresh on
desktop Chrome and iPhone WebKit.

## Source and scenes

The source is `/videos/Workshop/PEC/8.Applypadandshield_720p.mp4` (77.4s).
The new lesson uses an expanded 103s teaching clock: equipment, explanation,
skin preparation, tape preparation, pad preparation, closing the eye and placing
the pad, securing the pad, and securing the shield. Text is an authored summary
of the demonstration, rather than a transcript. No new treatment indications
are introduced.

`applyEyePadShieldScroll.js` owns stages, cues, sections, tracks and timing.
`build-apply-eye-pad-shield-scroll.cjs` builds eight native Lottie scenes at
1169 × 1280, 30fps. Gauze, cotton, holding/cleaning hands and the equipment
shield reuse the existing Make Eye Pad / Shield artwork with relative URLs;
face, pad, tape and applied shield are vector layers in the same warm palette.
The treated eye closes before the pad arrives. The other eye stays visible;
tape runs from the forehead towards the cheek, clear of that eye.

## Reused behavior and compatibility

The shell is cloned from `eyePadShieldScrollTemplate`, preserving the existing
topbar, narration controls, `.childhood-fundal-prep-list`, and engine-generated
`.childhood-fundal-segment-text__line` captions. The page joins every existing
Make Eye Pad / Shield CSS group, including desktop stage/caption width,
combined sections, divider spacing and mobile overrides.

Like Make Eye Pad / Shield and Advanced Pupils, this uses the shared
`stageAutoplay` engine, replay/advance controls, caption fitting, text toggling,
lazy stage loading, strict frame lock, blank-frame remount and persistent settle
snapshot overlay. Narration primes synchronously in the launcher interaction to
retain iOS audio authorization. Initialization is serialized and coalesced per
live page so hash navigation cannot initialize a detached WebKit fragment.
The shared engine retains Safari/iOS Canvas selection, viewport handling,
visibility behavior and route cleanup. Completion controls use its existing
1.5-second pause. Progress uses `lessonProgress:applyEyePadShieldScrollPage`;
My Learning and structural Back point to Eye Pad / Shield.

## Narration and regeneration

English and Korean audio, VTT, script and checksummed manifest live under
`public/narration/apply-eye-pad-shield/full-animation/`. Delivered voices are
Microsoft Zira Desktop and Microsoft Heami Desktop. The existing online voice
service timed out; local Windows voices produced the shipped AAC tracks.

1. `node scripts/build-apply-eye-pad-shield-scroll.cjs`
2. Run `scripts/generate-apply-eye-pad-shield-narration.ps1 -Python <python.exe>`
   on Windows with the named speech voices installed. This uses the existing
   bounded-speed narration mixer and bundled ffmpeg in
   `tmp/fundal-narration-tools/`.

Changing audio requires regenerating captions and manifest together. Both
delivered tracks are 103s with no cue overruns. Offline discovery includes the
new paths automatically; `apply-eye-pad-shield` matches the existing Eye Pad /
Shield selective-download group. Shared artwork stays in its existing group.

## Validation

`tests/apply-eye-pad-shield-scroll.test.js` checks relative texture resolution,
scene geometry, timing endpoints, delivered audio checksums and all eight
English/Korean caption cues. The original Make Eye Pad / Shield asset suite is
also run. `tests-e2e/apply-eye-pad-shield-scroll.spec.js` checks row position,
all eight final frames, caption text, replay, completion, Back/audio cleanup,
direct links, Korean selection, mute and viewport overflow. Browser coverage
includes Chrome desktop/mobile and Playwright WebKit. Windows WebKit uses the
repository's existing mocked narration clock because this host lacks its AAC
decoder; Chrome plays the delivered AAC. Physical iOS hardware is not tested.

Validation on 5 November 2026: 11 unit checks passed across the new and original
Eye Pad / Shield suites; six development browser checks passed on Chrome
desktop/phone and WebKit phone, followed by four production-build checks on
Chrome desktop and WebKit iPad. Focused ESLint passed. The production build
passed all distribution budgets, and its offline manifest includes all fourteen
new narration/scene files.
