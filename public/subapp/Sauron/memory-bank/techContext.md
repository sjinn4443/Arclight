# Technical Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: black `#111111` on an orange-red appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 18/5/2026_

## Technologies Used

- HTML5
- CSS3
- vanilla JavaScript
- source ES modules bundled into the static runtime
- local `Inter` and `Quicksand` WOFF2 font files
- WebP image assets

## Development Setup

- no backend required
- open `index.html` directly for the simple packaged launch path
- runtime entrypoint: `app.bundle.js`
- source entrypoint: `script.js`
- serve locally when cache-free repeat testing is useful:

```powershell
python -m http.server 8766
```

Then open:

```text
http://127.0.0.1:8766/index.html
```

## Technical Constraints

- browser-only runtime with no backend
- must remain usable on small mobile screens
- retinoscopy redraw must stay smooth during sweep and rotate changes
- direct streak dragging must remain responsive on touch devices
- stage-mounted controls must stay readable above the streak beam
- case thumbnails must stay centred and visually comparable
- corneal reflex sizing and movement should remain aligned with Fundal Reflex; the fellow-eye dot keeps the Fundal live `5px` size rather than Sauron's old `3px` shrink
- gaze, blink, lid-droop and face-tilt behaviour should remain aligned with Fundal Reflex
- selecting gaze must not recenter or visually move the retinoscopy beam after the initial layout has settled
- eyelid baseline must not read the current inline height, because blink and droop transitions can otherwise become the new resting state
- timed testing must hide the answer until reveal
- reduced-motion preferences should be respected where possible
- DOM ids and structure should stay stable unless controller bindings are updated with them
- shared case indexes come from the explicit order in `src/case-catalog.js`; `Neutral (0)` must remain first
- iOS/WebKit can render transformed overflow clipping unreliably, so pupil masking needs explicit fallback styling
- runtime visual images should remain WebP

## Runtime and Browser APIs

- ES modules
- `requestAnimationFrame`
- `setInterval`
- `matchMedia`
- pointer, mouse and touch DOM events
- direct DOM query and event APIs
- CSS `clip-path`
- WebKit mask-image fallback styling
- local font preloading

## Dependencies

- no package manager dependency is required for the simulator
- no CDN is required for the current app UI
- fonts are local in `assets/fonts`
- case thumbnails are local in `assets/case-thumbnails`

## Asset Rules

- Use WebP for runtime images and generated visual snapshots.
- Keep case thumbnails at `409 x 147` unless the case-card layout changes deliberately.
- Do not capture thumbnails with rotate or sweep cue handles visible.
- Do not capture thumbnails during blink or transitional eye states.
- Regenerate thumbnails after corneal-reflex sizing or movement changes.
- After asset work, run:

```powershell
Get-ChildItem -Path . -Recurse -File | Where-Object { $_.Extension -in '.gif', '.ico' }
```

The expected output is empty.

## Tool Usage Patterns

- edit HTML, CSS, JS and Markdown directly
- use browser refresh for behavioural checks
- use lightweight syntax checks:

```powershell
node --check script.js
Get-ChildItem src\*.js | ForEach-Object { node --check $_.FullName }
```

- when condition rendering changes, visual browser inspection matters more than syntax alone
- when CSS changes repeatedly during review, versioned query strings in `index.html`, `script.js` and module imports help avoid stale browser cache
- when checking the case modal, verify at mobile width and ensure every rendered image source ends in `.webp`
- when checking gaze, wait for the initial layout to settle then confirm the streak centre remains fixed while pupil and face transforms change
- after eyelid timing changes, sample a visible blink and confirm upper and lower lids return to `0px`; also toggle `Gaze` plus `Baby` and confirm droop clears
- when reviewing the side menu, verify `aria-hidden` and `inert` both return after MCQ or `test me` launch
- when reviewing MCQs, verify the result row is hidden before submit and only appears for warnings or scoring
- when reviewing the mobile toolbar, include `360px` because `Dilated` is the longest modifier label
- when reviewing the top controls, compare against Fundal Reflex by checking both the structure and source CSS values: separate colour card, separate modifier row, rotated vertical `Adv` dock, `--radius-control`, Fundal borders, shadows, switch sizing, mobile gaps and checked-switch red

## Current Local Verification Notes

- Last top-controls check confirmed the Fundal-style structure and copied CSS at `425px` and `360px`: colour card only in `.top-controls`, modifier switches in a separate row, Fundal switch-card styling and a rotated vertical `Adv` dock on mobile. WebP screenshots: `output/playwright/sauron-controls-425.webp` and `output/playwright/sauron-controls-360.webp`.
- Last fellow-eye corneal reflection check confirmed the non-examined dot uses the Fundal live `5px` sizing in `output/playwright/sauron-fellow-corneal-425.webp`.
- Last full review pass through `http://127.0.0.1:8766` found no console messages, page errors, horizontal scroll or visible text clipping at `425px` and `360px`.
- Last Advanced check found collapsed content at `display: none` and open layout with no clipping.
- Last MCQ check found 5 Primary questions, a hidden result row on open and the empty-submit warning after submit.
- Last side-menu/test check found the side menu open with `inert=false` while visible and `inert=true` after MCQ launch and after `test me`.
- Last engine check found gaze beam delta about `-0.11, 0`, pupil dilation from about `29.63px` to `40.74px`, baby eye resizing from about `140 x 75px` to `118 x 66px`, cataract filtering and changing nystagmus transforms.
- Last WebP check found 71 WebP files.
- Last modal image check found 30 rendered images, all WebP and all loaded with non-zero dimensions.
- Last non-WebP image sweep found no PNG, JPG, JPEG, GIF or SVG files.
- Last gaze check found `0,0` settled streak-centre delta after gaze activation, with pupil movement, face tilt and blink/lid-height movement present.
- Last eyelid timing check found a visible blink closing to about `44px` upper and `19px` lower, then returning to `0px`.
- Last `Gaze` plus `Baby` check found droop and face tilt during motion, then open lids after both switches were disabled.
- Last case-order check found the picker starting with `1 Neutral (0)`, then `Minus`, `Plus`, `High minus`, `High plus` and `Low astigmatism`.
