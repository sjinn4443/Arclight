# Offline download audit — 24 October 2026

## Reproduced problem

The original local production build reported Tools and Kits / Low resolution only as
complete (425 files, approximately 99 MB), but its cache did not contain the
How to Use Arclight MP4. Tools and Kits matched `/videos/Tools/` and
`/videos/Arclight/`, while its lessons also use the USAID and FullAnim directories.
DO/BIO animation narration, artwork and handouts also needed to follow those
shared lesson dependencies.

The original download dialog browser test used a mocked service worker. It did
not establish that downloaded bytes were usable after an offline restart.

## Changes

- Include all five Tools and Kits video lessons, DO/BIO guide assets, handouts,
  narration/captions and player catalogues in the selected download. Preserve
  quality and narration-language filtering, including single-quality fallback.
- Resolve saved Online playback to local MP4 when offline. Check actual server
  reachability with an uncached HEAD request because a newly opened browser page
  can report `navigator.onLine === true` with networking disabled. Bound the check
  to three seconds and discard outdated mode requests.
- Support 240p as well as 220p when a player requests the cached video's 720p
  counterpart, including media byte-range responses.
- Reject HTML/JSON fallback pages, empty media and partial responses as completed
  downloads. Retry an invalid entry left by an older worker.
- Advance the source worker fallback version to v104. Production builds generate
  their own cache version.
- Exclude unused legacy `html/demo/` pages and images from deployment and offline
  manifests, keeping the shell below its existing size budget.

## Automated verification

- Focused regression tests: 175 passed across download selection, service-worker
  caching/security, video modes/subtitles, narration and workshop dependencies.
- Offline-manifest HTTP/ETag integration check: 1 passed.
- Download dialog browser UI checks: 2 passed (Chromium desktop and WebKit iPhone
  emulation; these UI checks use a mocked worker).
- Final release build: passed; shell 19,018,327 bytes (20 MB limit), media
  1,715,746,159 bytes (2 GB limit), gzip shell 9,789,635 bytes (12 MB limit).
- Real-worker browser suite on the final build: 6 passed (two each for desktop
  Chromium, Android phone and Android tablet emulation); 4 Windows WebKit tests
  explicitly skipped. Results are saved locally under
  `quality-reports/offline-audit/final-results.json`.
- Accessibility audit: passed for 177 HTML files.

`npm run test:offline` exercises real CacheStorage, service-worker messages,
offline application startup, video decoding/time advancement, seeking and ranges.
Its projects distinguish desktop Chromium, Android phone/tablet emulation, and
iPhone/iPad WebKit. Windows WebKit is explicitly skipped with a reason.

Windows WebKit in this environment completed the download and CacheStorage checks,
but reported an internal error on offline navigation/reload. Even a cached
`fetch('/index.html')` failed with networking disabled. The automated suite marks
these projects as skipped on Windows; run them on macOS WebKit and physical
iOS/iPadOS devices before claiming support. Browser/device emulation also does
not establish physical-device storage retention, OS eviction behavior, background
downloads or operating-system process restarts. The automated restart closes the
online page and opens a fresh page in the same browser storage context offline.

## Installed-device checks still required

1. Open the updated release online in the installed app and allow the new worker
   to activate. Keep existing site data; deleting it removes downloaded content.
2. In Download, choose Tools and Kits and Low resolution only. Wait for completion.
3. Close the app, enable airplane mode and reopen it from its installed icon.
4. Play and seek How to Use Arclight, Mobile Phone Attachment, DO Full Animation,
   BIO examination video and BIO Full Animation. Check narration and captions.
5. Repeat with a saved Online preference, then with a saved High preference while
   only the low-resolution pack is stored. Check portrait/landscape and Back.
6. Repeat on physical Android phone/tablet, iPhone/iPad, and an installed desktop
   app. Record browser/OS versions and storage availability with the result.

These changes are local source changes; this audit does not deploy a release or
update the app already installed on a phone.
