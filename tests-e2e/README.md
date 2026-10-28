# `tests-e2e/`

Playwright-based end-to-end checks live here.

## Offline downloads

Build the app, then run `npm run test:offline`. This suite enables real service
workers, uses the Download dialog to select Tools and Kits at low resolution,
checks the stored files, closes the browser process, cuts the server connection,
and restarts the same stored browser profile to play/seek all five Tools and Kits
videos. A second offline process restart checks the app, downloaded images with
query strings, and the retained worker registration. A separate test checks
failed downloads, resuming, and cached 240p MP4 byte ranges requested as 720p.

Projects cover desktop Chromium, Android phone/tablet emulation, and iPhone/iPad
WebKit emulation. The restart test uses a disconnectable local gateway, including
when the browser still reports online. Windows WebKit also fails to install or
read persistent CacheStorage in this runtime, so both tests retain explicit
Windows WebKit skips; run those projects on macOS. Profiles use short temporary
paths to avoid Windows CacheStorage path-length failures. Set
`PLAYWRIGHT_PROFILE_ROOT` to an existing writable directory to choose another
profile location. Run the installed-device checks in
`docs/offline-download-audit.md` on actual iOS/iPadOS devices.
The existing `download-options.spec.js` mocks the worker and checks UI behavior.

## Fundal validation

The fundal suite covers:

- final-frame hold validation across all fundal routes
- autoplay scroll-lock behavior for staged playback
- iOS renderer override selection for masked files
- iOS exact snapshot fallback at fragile pause/final hold frames
- Chromium vs iOS WebKit visual parity on the fixed masked Preparation scene

The goal is to catch both end-of-animation blank holds and iOS-specific visual
regressions such as partial rendering, inverted mask output, white-frame flashes,
or stale previous-frame fallbacks. When a fix uses configured static snapshots,
tests should assert the held frame number, snapshot image URL, overlay visibility,
and non-white screenshot content on WebKit iPhone.

Run locally:

```bash
npm run test:fundal
```

Headed local run:

```bash
npm run test:fundal:headed
```

CI uses:

```bash
npm run test:fundal:ci
```

Generated Playwright outputs such as `playwright-report/`, `test-results/`, and
temporary browser screenshots stay local and are ignored by git. CI publishes
the generated report artifacts separately.

Local `git push` also runs the fundal suite automatically through
`.husky/pre-push` when a push includes fundal-related files. Set
`SKIP_FUNDAL_PRE_PUSH=1` to bypass it deliberately.
