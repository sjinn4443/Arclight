# Graphics and illustration style

Standing user instruction recorded on 19 November 2026. Read this before creating
or revising app graphics, illustrations or animated artwork, including graphics
outside the scrolly lessons.

## Required order: search, reuse, then create

1. Search for a suitable existing graphic before drawing or generating anything.
   Start with `public/scrolly/`, `public/pdfbasedanims/` and `public/images/`,
   then inspect the relevant lesson, source PDF/AI and reusable SVG or code artwork
   such as `public/js/eyesCardArtwork.js`. Check complete scenes and their
   referenced image layers; filenames such as `img_0.png` are not enough to
   judge suitability. Look for reusable components as well as complete images.
2. If suitable artwork exists, use it first. Reuse the asset or its original
   components, adapting the viewing angle, pose, crop, scale or composition as
   needed. An angle change should retain the same subject, proportions, palette
   and drawing style. Keep anatomical laterality and the source clinical meaning
   correct when changing orientation. Prefer this to drawing a replacement.
3. Only when no suitable existing graphic or component is available, create the
   missing artwork. Match the app's existing scrolly and PDF illustrations as
   closely as possible, using the nearest relevant existing scene as a reference.
   If only part is missing, retain the usable existing components.

## Actual reuse, not a newly generated lookalike

User clarification, 19 November 2026: reuse means retaining the actual source
pixels, vector paths or component layers. Supplying existing artwork to an image
generator as a style reference and generating a similar new person or tool does
not fulfil this requirement.

- Start with pages explicitly named by the user. Trace the route configuration,
  Lottie image references and source PDF/AI; a character embedded in a larger
  scene still counts as existing artwork.
- Prefer extraction, cropping, masking, direct compositing and limited
  scale/angle/pose changes that preserve the original drawing. If separate
  scenes contain the requested person and object, combine those originals.
- Preserve the existing character's face, hair, eyes, clothing, proportions and
  line work, and the tool's original geometry. Adapt only what the requested
  composition needs. Do not choose an unrelated person and change their skin
  colour when an appropriate existing character is already available.
- When a raster crop hides part of a subject, check the source PDF/AI vector
  layers before treating the hidden part as missing. Create only genuinely
  missing components and keep all usable source artwork.
- For chat-only previews, keep output and working files outside the app checkout
  and do not modify source graphics or runtime code. Documentation updates are
  separate when the user requests them.

### Concrete reuse example: a white man holding scissors

The user identified these existing sources:

- Man: `#/videos/frontOfEyeExaminationScrollPage`, using
  `public/js/frontOfEyeExaminationScroll.js`. The fair-skinned, green-eyed,
  light-brown-haired man appears in
  `public/scrolly/coreexam/frontofeye/01ObservationandMagnifiedExamination/2/images/img_1.png`
  (the `3back/observationandmagnifiedexamination1.ai` layer). Its source handout is
  `public/images/pdf/Workshop/CoreExamination/FrontofEye.pdf`.
- Scissors: `#/eyePadShield/makeEyePadShieldScrollPage`, with original layers
  `public/scrolly/eyeprocedures/make-eye-pad-shield/images/scissorupperhand.webp`
  and `scissorlowerhand.webp` in the same folder. Their stage-5/stage-8 Lottie
  transforms record the shared screw pivot, layer order and hand masks.

Extract and combine this man and these scissors. Generating a different man or
another pair of scissors while merely matching the style is not the required
first choice.

## Anatomy and practical adaptation

The scissors exercise established a further rule: reuse the existing identity
and tool, then complete the composition intelligently. A literal cut-and-paste
that leaves broken anatomy is unfinished work.

- Add or adapt only the missing limb sections, using the source style and skin
  palette. A shoulder, upper arm, elbow, forearm, wrist and hand must form a
  plausible continuous chain whenever they are visible.
- Check head/body, hand/face and upper-arm/forearm proportions, especially when
  combining different scenes or viewpoints. Keep local scales proportional;
  compare interacting people at the same apparent distance.
- Do not expose the pointed or rectangular end of a cropped wrist. Continue it
  naturally offscreen or connect it to the next body segment. Keep a sensible
  wrist width and bend; avoid a narrow rod attached to a broad palm.
- Preserve original faces, tools and reusable details while adapting the missing
  parts. Matching source pixels alone does not establish a finished illustration.
- Animate held objects and their grip from shared contact coordinates. Show
  approach, contact, pressing/cutting and withdrawal in a readable order, with
  physically sensible overlap. Review intermediate frames and final holds.
- In clinical scenes, keep the source procedure order and relevant anatomy
  visible. For Apply Eye Pad / Shield, close the treated eye before pad contact
  and leave the other eye uncovered in the completed scene.

## Scene composition and clinical layers

User corrections from the Apply Eye Pad / Shield revision, 19 November 2026:

- Tabletop objects share one viewing angle and surface. Adapt flat materials to
  that plane and use restrained contact shadows, including beneath scissors.
- Compare adult head sizes at the same apparent distance. A speech bubble has a
  rounded border and a tail towards the speaker, with the actual demonstrated
  scene inside rather than a row of isolated equipment icons.
- A cleaning grip must show a complete index finger/thumb pinch, plausible
  palm size, wrist taper and a continuous forearm. Inspect the original source's
  thumb layer; extending an incomplete hand with a straight polygon is inadequate.
- Show the round tape roll unwinding a continuous length before the scissors
  close. Only after the snip should the separate cut strip move away.
- Dressings need explicit depth: face, contact shadow, gauze pad, tape, shield,
  shield tape, then the original foreground nose where they overlap. Size and
  angle the dressing to the eye socket and keep the other eye visible. Check the
  entire approach, not just the resting frame.
- Omit hands from pad/shield placement when material movement and sequential
  tape fades communicate the procedure. Reuse alone does not justify clutter.
- The Apply lesson merges pad placement and securing into a continuous scene.
  Keep the two source speech cues and their timestamps. Replay/Next appear
  0.7 seconds after both narration and animation have finished.

Latest Apply refinements: review `#/eyePadShield/eyeCareVideo-apply_eye_pad`
for each step. The gauze pad is broad and round; tapes bend around gauze, face
and cone surfaces with contact shadows and pronounced pinked cuts at both ends.
The cone's entire rim covers the pad. Equipment fills more of the stage, with
larger scissors. A seated person needs arms, lower torso/lap and a chair, rather
than a cropped bust. Procedure close-ups fill the bubble proportionally, use a
darker background and share the exact rounded clipping boundary. For this
lesson's skin cleaning, use the original cotton alone; remove the hand.

## Where to look

| Source                                       | Useful references                                                                                                                                        |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/scrolly/coreexam/`                   | Visual acuity, front of eye, fundal reflex, direct/indirect ophthalmoscopy and pupil examinations; people, hands, devices, eyes and examination geometry |
| `public/scrolly/eyeprocedures/`              | Eye pad/shield preparation and application; hand grips, scissors, gauze, tape and paper                                                                  |
| `public/scrolly/conditions/cataract/`        | History-taking actors, speech bubbles, source teaching symbols and comparison panels                                                                     |
| `public/scrolly/workshop/childhood/`         | People, eyes/brain teaching components and workshop illustrations                                                                                        |
| `public/pdfbasedanims/`                      | Pupils PEC and Pupils Advanced PDF handouts and Illustrator masters                                                                                      |
| `public/images/` and relevant JS/SVG artwork | Existing catalogue graphics, teaching images and reusable app illustrations                                                                              |

Lottie `data.json` files may reference images in a sibling or shared folder.
Follow those paths and inspect the rendered scene before choosing components.
The existing pupil provenance files record source artwork and PEC/Advanced reuse.

## Visual language to preserve

- People and outlines: clear, flat, vector-like silhouettes with economical
  internal lines, warm skin tones, dark hair/eyebrows and restrained facial
  detail. Turquoise or teal medical clothing recurs in the examination scenes.
  Preserve the source face, hand and instrument proportions.
- Palette: quiet warm grey, taupe and beige surfaces, with darker or black panels
  where the source uses them. Bright green, orange and red give teaching signals;
  cyan, blue and purple distinguish anatomical pathways. Preserve each source's
  meaning rather than recolouring these elements for decoration. Read the actual
  findings: a source panel's background colour alone does not establish normality.
- Depth and texture: flat colour areas form the base. Add restrained shading,
  soft light gradients or contact shadows where they explain illumination,
  instrument shape or overlapping materials. Existing clinical photos, fundus
  images and gauze textures can sit alongside the simplified illustrations.
- Composition: connect the overall examination posture to close views of the
  eye, hand or instrument. Use paired or stacked panels for correct/incorrect
  technique, normal/abnormal findings and before/after responses. Preserve clear
  silhouettes, readable inserts and the established page's visual hierarchy.
- Teaching symbols: reuse the source arrows, circles and tick/exclamation/X
  artwork. Keep each circle and glyph together on transparency, and maintain
  consistent visible status-circle sizes independently of illustration scaling.
- Motion: show the action, light path, physiological response and result in a
  readable sequence. Keep hands, devices and light pools registered together;
  use directional arrow reveals and staged comparisons where the source does.
  Preserve sensible pivots, overlap and resting frames, with teaching holds and
  narration aligned to the visible event.

## Applying the reference

For Lottie examination lessons, follow the existing
[PDF/AI preparation and stage rules](../docs/lottie-examination-scroll-pages.md#preparing-artwork-from-pdf--ai).
Keep source components proportional and use the established stage dimensions;
most examination scenes use `1169 / 1280`, with documented exceptions. Use
proportional cover and clipping when filling a stage, or contain when source
margins are required. Keep posters and configured aspect ratios aligned. Other
app graphics retain the dimensions and layout of their own destination.

Compare adapted or newly created artwork against the chosen source at the
intended display size. For motion, inspect initial, intermediate and final
frames, including hand/device registration, light placement, arrow direction
and visible teaching symbols. Record the reused source or closest style
reference in the artwork's existing authoring/provenance notes when maintained.

This reference comes from the source PDF handouts and intermediate/final renders
of representative pupil, front-of-eye, visual-acuity, fundal-reflex,
ophthalmoscopy, eye-pad/shield and cataract scenes reviewed on 19 November 2026.

Apply composition clarification (19 November): single-patient scenes use a
registered rightward camera crop; pad/shield and nose contacts move together.
A reel rotates within its fixed projected axle, without rotating its camera
plane. Complete equipment-scissor halves share a screw, enter once for three
cuts and put the lower blade behind the tape. Seated hands rest separately on
the thighs. Prepared tape varies its curvature across the pad. The cone reuses
the equipment cone's original shading, with outer and nasal securing tape.
