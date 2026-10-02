# System Patterns

## v1.1 engineering patterns (22/7/2026)

- `resetOperationalState()` replaces both eye records and contextual checks from a fresh state without changing viewer, mode, coupled dilation or achievement state.
- The drawer requires two presses within five seconds before clearing an assessment.
- Shared modal helpers trap Tab focus and restore the opener. Drawer and Quick guide closures also restore focus.
- Finding tabs use roving tabindex and Left, Right, Home and End keyboard navigation.
- `manifest.webmanifest` and `service-worker.js` use the unique `arclight-discs` cache prefix. The worker precaches only the shell and runtime-caches large local case images as used.
- `tests/` protects clinical outputs, untouched state, reset boundaries, referral content, MCQ contracts, local assets, ARIA references and offline scope.
- For the shared image-led mobile family, use Swollen Discs' outer geometry at `360 x 740`: principal black stage `x=10`, `width=340`, `16px` radius and the shared strong shadow, followed by an aligned `18px` interpretation or examination panel. Preserve each app's internal controls and workflow.

<!-- APP-DOC-STATUS:START -->

## Historical Memory Status (31/5/2026)

- Discs uses the shared static Arclight app pattern.
- The copied Diabetic shell remains useful, but clinical copy and assets are now Disc-specific.
- Live images are under `assets/images/discs` with a 60-file case asset contract.
- Triage separates cup/size context, fast glaucoma review and urgent disc swelling.
- Overlay surfaces lock background scroll so the 360 x 740 layout shows one active vertical scrollbar.
- Arclight action wording should not add an undilated limitation when the disc view is clear; keep that limitation for undilated Holo/BIO.
- Severe reduced VA without selected disc signs should stay orange `Soon`, not green routine review.
- Locked achievement UI should stay hidden; only show the cup once the Advanced quiz is passed or completed.
<!-- APP-DOC-STATUS:END -->

Last updated: 30/9/2026

## App Structure

```text
Discs/
  index.html
  styles.css
  script.js
  app.bundle.js
  discs/
  src/
  assets/
    images/
      discs/
        Pys_disc/
  tools/
    convert-numbered-disc-assets.py
    convert-phys-disc-assets.py
    disc-image-sources/
  memory-bank/
```

## Bundle Pattern

- Source entry is `script.js`.
- Runtime bundle is `app.bundle.js`.
- `index.html` loads `app.bundle.js?v=20260531-reviewfix`.
- Rebuild after source changes with esbuild.
- Bump the query token after asset path or browser-cache-sensitive image changes.

## Image Pattern

Live image contract:

- `case-01.webp` to `case-09.webp`: light full-size cases.
- `case-01_dark.webp` to `case-09_dark.webp`: dark full-size cases.
- `case-01_thumb.webp` to `case-09_thumb.webp`: practice modal thumbnails.
- `phys-01.webp` to `phys-tilt.webp`: physiological/glaucoma light full-size cases.
- `phys-01_dark.webp` to `phys-tilt_dark.webp`: physiological/glaucoma dark full-size cases.
- `phys-01_thumb.webp` to `phys-tilt_thumb.webp`: physiological/glaucoma practice thumbnails.

Size contract:

- full-size images: `2915 x 2834`.
- thumbnails: `480 x 360`.

Processing pattern:

- Read raw numbered PNGs from `tools/disc-image-sources`.
- Flip selected cases to the app's right-eye convention.
- Build full-size cases with extended retina background.
- Build thumbnails from clean source fundus crops.
- Keep unused or older images out of `assets/images/discs`.
- Keep generated contact sheets out of the app root; conversion scripts write them under `tools/generated-checks` when rerun.
- Keep the root `discs/` folder as retained user source material unless the user explicitly asks to remove it.

## Viewer Pattern

- Keep Arclight (DO) and Holo (BIO) as top mode tabs.
- Keep case navigation inside the viewer.
- Keep R/L orientation independent of the image case.
- Skin control switches light and dark case assets.
- Gaze, Dilation and Cataract controls alter the simulation, not the diagnosis.

## Practice Modal Pattern

- Practice opens from the side drawer.
- Cards use cropped thumbnails and short case descriptions.
- Labels must follow the active case-set count: General discs `1/9`, Normal cups `1/5` or Glaucoma `1/6`.
- Normal cups and Glaucoma should remain visually grouped as cup-assessment sets.
- The modal should stay compact on a `360 x 740` viewport.

## Findings Pattern

Use two finding strands:

- General discs.
- Glaucoma discs.

General disc signs include swelling, pallor, drusen, anomalous discs, myelination and suspicious vessels.

Glaucoma disc signs include cup/disc ratio, disc size, thin rim, rim notch, splinter haemorrhage and vessel changes.

Urgent red flags should override reassuring wording.
Severe cupping, rim notch or disc haemorrhage should stay framed as fast glaucoma review rather than normal variation.
Cup/disc ratio and disc size context should not trigger referral wording by themselves.

## Safety Copy Pattern

Preferred wording:

```text
No signs means no referable disc signs were seen in the view obtained.
```

Avoid wording that implies no disease is present.
Avoid wording that implies the app confirms glaucoma, replaces IOP/fields/OCT or clears true disc swelling.

## UI Pattern

- Appbar: black, `54px` high, white title and white icon text.
- Title: `Discs`.
- Main viewport target: `360 x 740`.
- Keep long teaching text in popups, drawer guides and practice cards.
- Avoid landing page behaviour.
- Use compact clinical controls on the first screen.

## Verification Pattern

After app or image work:

1. Rebuild `app.bundle.js`.
2. Check `assets/images/discs` has 60 live case files.
3. Check dimensions for all 60 live case files.
4. Reload `http://localhost:8081/Discs/`.
5. Check Image cases modal labels and thumbnails.
6. Check MCQ modals render Primary `5`, Intermediate `6` and Advanced `8` questions.
7. Check browser console for errors.

## Refactor protection — 26 July 2026

- Finding-detail buttons update disclosure DOM locally. Clinical finding changes retain the full render and triage path.
- `tests/viewer.test.mjs` protects scale, offsets, mirroring, bounds, bounce clamping and dense-cataract opacity.

## MCQ quality contract — 26 July 2026

- Keep stable IDs, source IDs, concise rationales and pending-review metadata for every authored question.
- Higher tiers must add a distinct interpretation or assessment decision rather than replay a Primary stem.
- Grade only complete attempts and reveal correct or selected-wrong states only after completion.
- Show Submit before grading and one New attempt action afterwards. Retry resamples and focuses its first input.
- Close the drawer before opening the modal. Keep result and action blocks non-shrinking so their text cannot overlap.
- `npm run build:check` compares an in-memory esbuild result with `app.bundle.js`.
- Keep viewer code app-local until a fleet-owned build-time package can preserve independent offline releases.

## MCQ content contract

- Question IDs use `discs-{tier}-{two-digit authored index}`.
- Every question has four unique options, one answer, a rationale, source IDs and pending review status.
- Content describes clinical observations and limitations rather than app controls.
- An incomplete attempt cannot reveal answers or pass. Completed review must show correct and selected wrong rows before a fresh attempt is offered.
