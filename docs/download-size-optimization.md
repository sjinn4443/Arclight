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
