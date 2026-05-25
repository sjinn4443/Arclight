# `tests-e2e/`

Playwright-based end-to-end checks live here.

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
