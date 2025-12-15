# `tests/`

This folder contains the Jest test suite for the Arclight application.

## Run tests

```bash
npm test
```

CI-style run (more verbose / CI-friendly flags):

```bash
npm run test:ci
```

## Test environment

- Jest config: `jest.config.cjs`
- Environment: `jsdom`
- Global setup: `tests/setupEnv.cjs` and `tests/jest.setup.cjs`

### ESM/CJS note

The repo root is ESM (`"type": "module"`), but many tests are CommonJS (`*.cjs`). Some browser modules under `public/js/*.js` are ESM and cannot be `require()`-ed directly from CJS tests.

To keep tests stable, `jest.config.cjs` maps certain ESM modules to CJS mocks:

- `../public/js/navigation.js` → `tests/__mocks__/navigation.cjs`
- `../public/js/videoplayer.js` → `tests/__mocks__/video.cjs`

If you add more CJS tests that import ESM browser code, prefer:

- adding a small CJS mock under `tests/__mocks__/`, and/or
- using dynamic `await import()` where appropriate.

## What’s in this folder

Key test files currently in this directory:

- `ui.test.cjs` – broad UI flows under JSDOM
- `a11y-aria.test.mjs` – ARIA/accessibility regression checks across HTML
- `i18n.test.cjs` – translation/i18n checks
- `navigation-flow.test.cjs` – navigation and routing flow checks
- `responsive-breakpoints.test.cjs` – responsive layout/breakpoint checks
- `typography-consistency.test.cjs` – typography consistency checks
- `cls-splash.test.cjs` – splash screen CLS checks
- `renderperf.test.cjs` – rendering performance regression checks
- `mediaperf.test.cjs`, `mediaperf-node.test.cjs` – media performance/resilience checks
- `lowend.test.cjs`, `lowendmemoryleak.test.cjs` – low-end device/memory regression checks
- `rapid-tap-nav.test.cjs` – rapid interaction/navigation robustness
- `large-state.test.cjs` – large local state scenarios
- `tracking.test.cjs` – server `/track` telemetry logging behavior
- `reports-auth.test.cjs` – reports page auth behavior
- `sample.test.cjs` – sanity check / template

Helpers:

- `jest.setup.cjs` – Jest hooks/matchers configuration
- `setupEnv.cjs` – environment variables and global setup for tests
- `__mocks__/` – module mocks used by `moduleNameMapper`

## Troubleshooting

- If tests fail due to module loading errors like “Must use import to load ES Module…”, check `jest.config.cjs` and add/adjust `moduleNameMapper` entries.
- If a test depends on telemetry encryption behavior, ensure your environment variables are consistent with the expected mode (see `reports/README.md`).
