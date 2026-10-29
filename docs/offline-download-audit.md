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

## Follow-up — 28 October 2026

The reported device is an iPhone 13 mini running the Home Screen installed app.
The worker still attempted the network before reading cached navigations, route
fragments, scripts, images and HLS files. A stalled connection could therefore
prevent startup despite a successful download. Shell revision changes could also
hide retained pack entries, and localhost startup unregistered every worker,
breaking later offline launches in local installs and production previews.

The worker now serves the installed shell and downloaded files from CacheStorage
first, including cache entries requested with query strings. Download/resume
continues to validate revisions and refresh changed files, while playback retains
access to an earlier completed download. Missing mini-app documents no longer
receive the parent application as a fallback. Runtime cache writes are attached
to the fetch event lifetime, and bootstrap preserves worker registrations.
Canonical cache keys now use exact lookup instead of repeatedly scanning an
entire growing pack with `ignoreSearch`. Each newly downloaded file must also be
read back from CacheStorage before it contributes to a successful completion;
an acknowledged but unreadable write is reported as a failed download.
The source fallback worker version is v108.

The real-worker test now uses a disconnectable HTTP gateway and a short persistent
browser profile. It closes the browser process, disables the gateway, reopens the
saved profile, plays/seeks all five Tools and Kits videos and restarts offline
again to check the app, a downloaded image with a query string and registration
retention. This exercises a disconnected server even if navigator.onLine remains
true and avoids Windows WebKit's offline-emulation flag. Temporary profiles use
short paths because long Windows test-output paths caused CacheStorage.open to
fail internally before the worker could install.

Windows WebKit was attempted both with the gateway and persistent profiles in
short temporary locations. This runtime either lost its installation registration
or returned empty cache inventories/unreadable responses after acknowledging
writes. The Windows skips are therefore retained with explicit reasons; these
attempts are not evidence that physical iPhone behavior has been verified.

Final verification: 118 focused Jest tests passed; lint, formatting and diff
checks passed. The real-worker suite passed all six desktop Chromium, Android
phone and Android tablet tests, including full browser-process restarts, all five
Tools and Kits videos, seeking, retained images, failure/resume and 240p ranges.
Four Windows WebKit tests are explicitly skipped for the limitations above.
The final browser report is saved locally at
`quality-reports/offline-audit/20261028-results.json`.

These checks still do not establish physical iOS Home Screen app behavior or OS
storage retention. Repeat the installed-device checks above on the iPhone after
deploying the updated shell and media outputs; keep existing site data.

## iPhone follow-up — 29 October 2026

Physical iPhone 13 mini testing confirmed that most downloaded lessons worked,
but Mobile Phone Attachment did not. Its two shipped MP4s used HEVC `hev1` with
the `moov` box at the end. The existing PhoneAttach URL is now H.264/AAC, 240p,
with fast-start metadata; the Tools 720p counterpart is also H.264 with fast-start
metadata. URLs and subtitle timing are preserved. These files were already in
Tools and Kits selection: this fixes media compatibility rather than asserting
that download inclusion alone proves iPhone playback. Existing cached copies need
to be refreshed by downloading the pack again after deployment.

An offline-entry dialog explains that only downloaded content and some features
are available. Connectivity is checked in the background, including foreground
returns where navigator.onLine can be misleading. Video toggles show an offline
explanation, disable Online and unavailable High modes, and restore controls on
reconnection. Saved unavailable High/Online preferences fall back to downloaded
local media. Local playback no longer waits for subtitle catalogue retrieval,
and inline metadata loading, visible loading/error messages and an immediately
visible route shell replace blank-looking player waits.

Verification: 120 focused tests passed; the build and distribution budgets passed.
Chromium verified PhoneAttach playback at 240p plus the notice, mode restrictions
and reconnection. WebKit iPhone emulation verified the notice and mode controls;
Windows WebKit MP4 playback does not complete in this runtime and is explicitly
excluded from that UI check. A real-worker Android phone test passed the complete
Tools and Kits low pack, offline browser-process restarts, playback/seeking, the
entry notice and High-mode restriction. Physical iPhone playback remains a
post-deployment check, not an automated claim.
