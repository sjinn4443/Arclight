# Download size optimization — 6 November 2026

Downloads retain the existing image, PDF, scrolly and narration quality. The low
option now also covers previously single-source MP4 lessons. High uses the
existing source; no high-quality source was upscaled or overwritten.

## Changes

- Exclude PEC `New folder` authoring masters from development offline manifests,
  matching the production build exclusion. Keep the local originals.
- Assign Ears posters and ATOMS teaching cards to their content packs rather
  than including them with every section. ATOMS cards remain available in Core
  interactive learning and Ears, and in full/non-video downloads.
- Add 33 missing 240p MP4 exports: H.264/yuv420p, CRF 28, AAC 48 kbps where audio
  exists, fast-start metadata. Preserve the source frame rate, timing and aspect
  ratio. Existing low exports are reused.
- Use the shared generated `video-localization/video-quality.js` map for download
  selection, Videos player modes, offline mode availability and worker fallback.
  Counterparts outside a selected directory follow the lesson dependency.
- Reuse PhoneAttach as Mobile Phone Attachment's low version. Reuse the existing
  Childhood Arclight introduction low file for its byte-identical Core high copy.
  Existing URLs and downloaded pack storage remain available; no cache is purged.

## Measured sizes

Decimal MB; English narration, same local source checkout before/after:

| Selection      | Low before |  Low after | High after |
| -------------- | ---------: | ---------: | ---------: |
| Full           | 2,419.2 MB | 1,067.0 MB | 1,707.7 MB |
| Front of Eye   |   107.3 MB |    86.5 MB |   115.5 MB |
| Tools and Kits |   163.8 MB |   122.6 MB |   162.5 MB |
| Ears           |   239.0 MB |   226.5 MB |   279.5 MB |

Full's local reduction includes about 1,043.7 MB of authoring masters that were
already absent from production. Do not describe that part as a new production
saving. Media splitting and other cleanup account for about 308.5 MB more.

Final production output: Full low 1,039.5 MB / high 1,680.3 MB; Front of Eye low
83.9 MB / high 112.9 MB; Tools low 113.2 MB / high 153.1 MB. Source and production
sizes differ because build output is bundled, minified and excludes source-only
files. The UI continues to display its existing rounded totals.

## Regeneration and verification

Run `scripts/build-download-video-variants.py --ffmpeg <binary>` with Python to
generate missing low exports and rebuild the quality map. Existing exports are
not overwritten. Format the generated JS with the project's Prettier. Run
`node --experimental-vm-modules scripts/report-download-sizes.cjs [build-dir]`
to measure the real selection logic against source or a production manifest.

All 33 new exports decoded successfully. Codec, dimensions, source duration,
fast-start metadata and size reduction were inspected; representative low frames
were visually reviewed. Focused download, media, cache and subtitle unit tests
pass (206 tests across nine suites). Build budgets passed; the final worker was
then rebuilt to include retained legacy high aliases and manifest sizes refreshed:
shell 14,494,560 bytes (20 MB limit), media 1,996,952,370 bytes (2 GB limit),
gzip shell 4,483,573 bytes (12 MB limit).

Real-worker browser checks passed using installed Chrome: high-only legacy
alias playback; new 240p download failure/resume, offline playback and ranges;
and the complete Tools low pack (1,104 files), two full browser-process restarts,
all five Tools videos, seeking, retained images and cached PDF export. The full
pack restart check passed in 43.8 seconds on its final run. Browser tests now
reject accidental reuse of a development server and bound navigation waits.
Initial attempts included a reused development server and a stalled restart;
those attempts are not counted as successful verification.

Local measurement and media-validation records are in
`.codex-artifacts/download-optimization/`. Existing unrelated lint errors in
`videos.js` and the ESM-in-CJS test configuration remain; changed-code lint and
formatting are checked separately. Physical iOS storage retention and native
playback still require device verification after deployment. This work does not
deploy the app or reclaim old downloaded files automatically.

## Follow-up — 7 November 2026

The second audit found MP4s embedded under `images/pdf/Workshop/Childhood/`,
duplicated clips under different lesson URLs, preview exports, and lesson-specific
quiz/case/animation assets still classified as common app files.

- Extend the video builder to embedded MP4s. Seven new 240p H.264/AAC exports
  reuse the source duration and frame rate. Other clips reuse existing low files;
  the small iOS compatibility file remains available.
- Identify identical high sources by SHA-256 and register their original paths
  as aliases of one quality pair. All quality selections, including Both, share
  the canonical files. Section matching follows aliases so a Childhood lesson
  can download its reused PEC counterpart. Keep original files and URLs for
  existing links and online playback; deduplicate the download, not the user's
  original source tree or previously stored caches.
- Exclude unused scrolly preview folders, mock JS and four unreferenced legacy
  Fundal JSON exports from both build copying and offline manifests. Retain the
  `DO/03HowtoExamine/1/demo/` subtree embedded by the diabetic workshop, active
  Lottie images, final-frame fallbacks, and Ears source-document downloads.
- Include Anterior Segment Quiz assets with Front of Eye/interactive packs,
  case-study images with their owners, and active Fundal JSON with Fundal Reflex.
  Full and non-video packs still contain their non-video learning materials.
  Partial-download messaging no longer promises that every app quiz is stored.

Same source-tree basis, decimal MB, English narration:

| Selection      | Low before | Low after | High before | High after |
| -------------- | ---------: | --------: | ----------: | ---------: |
| Full           |    1,067.2 |     896.3 |     1,707.9 |    1,591.2 |
| Front of Eye   |       86.5 |      64.6 |       115.5 |       93.7 |
| Tools and Kits |      122.6 |      78.3 |       162.5 |      118.2 |
| Ears           |      226.5 |     205.7 |       279.5 |      258.7 |

Full Low saves about 170.9 MB (16%); its Low/High difference grows from
640.8 MB to 694.9 MB. These are selection totals, not reclaimed cache space.

Final deployment build (`tmp-download-followup-dist`) reports Full Low
895.2 MB / High 1,590.2 MB; Front of Eye 64.4 / 93.4 MB; Tools 77.7 / 117.6 MB.
Build budgets passed: shell 14,370,373 bytes, media 1,955,302,592 bytes,
gzip shell 4,492,814 bytes. Build/source totals differ due to bundling and
minification.

Verification: 217 distinct focused unit tests passed across the download,
worker, subtitle, offline, workshop and Ears suites. The dependency test checks
external images referenced by real DO/BIO/Front of Eye Lottie JSONs and the
retained demo. Registry aliases are checked byte-for-byte against their canonical
high source. Original slide URLs prefer the high file when both versions are
stored, and still fall back to a low-only download. All seven new exports passed full decode, codec, duration and
fast-start checks, with a representative decoded frame inspected visually.

Real-worker desktop Chrome checks passed for Childhood Low and High downloads,
absence of duplicate MP4 cache entries, original slide-URL playback, seeking and
range responses, including high playback with both qualities stored. The Front
of Eye pack retained its quiz offline, including answers, next-case navigation
and the next case image. Tools Low also passed complete download, browser-process
restarts, all five video lessons, seeking and cached PDF export. Failure/resume
and high-only alias playback checks passed. Physical iOS testing and deployment
remain separate. Evidence is under `.codex-artifacts/download-optimization/`
with the `followup-` prefix.

The final Chrome run passed the first five checks. Its failure/resume check had
one unsuccessful attempt (31.2 seconds); a standalone rerun of the identical
final build passed all its assertions in 7.5 seconds. That successful rerun and
its step results are saved in `followup-live-resume.json`. Do not describe this
as a clean six-test first-attempt run. Browser results were collected across
these runs; the earlier failure is retained in this record.
