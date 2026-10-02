# Tech Context

## Current runtime — 30 September 2026

Build with the pinned local `npm run build` command. `npm test` passes 24 tests and `npm run build:check` confirms source/bundle parity. The HTML bundle token is `20260929-engine1-ui20260930`. Service-worker shell and runtime caches use version `v1.1-20260929-engine1-info-20260929-ui20260930`, under the `arclight-discs` prefix. Current HTTP and direct-file evidence is in [the fleet repair receipt](../../FLEET_FIXES_2026-09-30.md). The image asset token remains `20260531-casesets`; dated sections below retain their original evidence.

## Historical v1.1 toolchain snapshot (22/7/2026)

- Pinned development build dependency: `esbuild` `0.25.5`.
- `npm run build` rebuilds `app.bundle.js` from `script.js`.
- `npm test` runs 13 Node built-in logic and static contracts without browser output.
- The app uses only local runtime assets.
- Installable offline support requires HTTP(S). Direct-file use does not register the service worker.
- July bundle token: `20260722-v11`.
- July service-worker cache: `arclight-discs-*-v1.1-20260722`.

<!-- APP-DOC-STATUS:START -->

## Historical memory snapshot (31/5/2026)

- Static HTML/CSS/JavaScript app.
- May verified browser URL: `http://localhost:8081/Discs/`.
- App bundle cache token: `20260531-reviewfix`.
- Image asset cache token: `20260531-casesets`.
- Image folder contract and dimensions were verified on `31/5/26`.
<!-- APP-DOC-STATUS:END -->

Last updated: 30/9/2026

## Runtime

The app is static and can be served by a simple local HTTP server.

From `C:\Users\William\Desktop\Arclight App`:

```powershell
python -m http.server 8081
```

Open:

```text
http://localhost:8081/Discs/
```

## Build

From `C:\Users\William\Desktop\Arclight App\Discs`:

```powershell
npx --yes esbuild script.js --bundle --format=iife --target=es2018 --outfile=app.bundle.js --log-level=warning
```

## Image Pipeline

Current script:

```text
tools/convert-numbered-disc-assets.py
```

Inputs:

```text
tools/disc-image-sources/1d.png
tools/disc-image-sources/1d_dark.png
...
tools/disc-image-sources/9d.png
tools/disc-image-sources/9d_dark.png
```

Physiological disc inputs:

```text
assets/images/discs/Pys_disc/*.png
```

Outputs:

```text
assets/images/discs/case-01.webp
assets/images/discs/case-01_dark.webp
assets/images/discs/case-01_thumb.webp
...
assets/images/discs/case-09_thumb.webp
assets/images/discs/phys-01.webp
...
assets/images/discs/phys-tilt_thumb.webp
```

Dimensions:

- full-size light and dark: `2915 x 2834`.
- thumbnails: `480 x 360`.

Notes:

- General disc full-size images use `CASE_IMAGE_SCALE = 1.75`.
- Physiological/glaucoma full-size images use `CASE_IMAGE_SCALE = 0.52` with a low-strength blended edge extension and a small feather.
- Selected sources are flipped to right-eye convention in `FLIP_TO_RIGHT_EYE_STEMS`.
- Thumbnails are generated from clean source crops.
- The old green-background pipeline is not the current live pipeline.
- Diagnostic contact sheets are scratch outputs under `tools/generated-checks` if conversion scripts are rerun.

## Current Asset Paths

`src/viewer-config.js` is the source of truth for case metadata and paths.

Each case has:

- `src`
- `thumbSrc`
- `darkSrc`

All use:

```text
?v=20260531-casesets
```

The May snapshot loaded the app bundle with (superseded by the current token above):

```text
?v=20260531-reviewfix
```

## Browser Checks

Recent checks:

- 60 live case WebPs in `assets/images/discs`.
- no extra live files.
- no missing live files.
- dimensions match contract.
- all 60 live case image files are present with expected dimensions.
- Image cases modal uses new cropped thumbnails.
- labels match the active case set: `1/9`, `1/5` or `1/6`.
- no browser console errors.

## Coding Constraints

- Keep edits scoped to Discs unless asked otherwise.
- Use `apply_patch` for manual edits.
- Rebuild the bundle after source changes.
- Do not delete user source images.
- Do not edit the OneDrive copy unless explicitly asked.
- Use British English in general text.
- Avoid Oxford commas in prose.

## Build and parity — 26 July 2026

Use pinned esbuild `0.25.5`. Run `npm run build` after authored JavaScript changes and `npm run build:check` before hand-off. The parity check is non-writing. The current viewer source remains local even though its baseline is shared with Diabetic.

The final MCQ pass uses runtime and cache token `20260726-mcq2`. Sources are recorded against NICE NG81, European Glaucoma Society fifth edition, the 2021 optic-disc drusen imaging review and the 2018 IIH consensus guideline. Rebuild `app.bundle.js` after question or controller edits. Current result: 20/20 tests and exact bundle parity pass. Isolated browser evidence is under `output/playwright/mcq-quality/`.
