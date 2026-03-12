# `tests-e2e/`

Playwright-based end-to-end checks live here.

## Fundal validation

The fundal suite covers:

- final-frame hold validation across all fundal routes
- autoplay scroll-lock behavior for staged playback
- iOS renderer override selection for masked files
- Chromium vs iOS WebKit visual parity on the fixed masked Preparation scene

The goal is to catch both end-of-animation blank holds and iOS-specific visual
regressions such as partial rendering or inverted mask output.

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

Local `git push` also runs the fundal suite automatically through
`.husky/pre-push` when a push includes fundal-related files. Set
`SKIP_FUNDAL_PRE_PUSH=1` to bypass it deliberately.
