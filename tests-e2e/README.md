# `tests-e2e/`

Playwright-based end-to-end checks live here.

## Fundal final-frame validation

This suite validates that every `childhood eye screening > fundal reflex`
animation stage finishes on a non-empty final frame instead of collapsing to a
blank or sparse hold frame.

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
