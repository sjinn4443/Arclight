# `.github/`

This folder contains GitHub-specific configuration for Arclight.

## Workflows

### `workflows/ci-cd.yml`

The CI pipeline runs on pushes and pull requests to `main`.

What it does:

1. **Checkout + Git LFS**
   - Checks out the repository with LFS enabled and pulls LFS assets.
2. **Install deps**
   - Uses Node **20.x** and runs `npm ci`.
3. **Quality gates**
   - Formatting: `npm run format:check`
   - Build: `npm run build`
   - Security audit: `npm audit --audit-level=high` _(non-blocking)_
4. **Tests**
   - Accessibility: `npm run test:a11y`
   - Jest: `npm run test:ci`
5. **Artifacts**
   - Uploads `dist/` as a build artifact.

## Local parity

To reproduce the CI steps locally:

```bash
npm ci
npm run format:check
npm run build
npm run test:a11y
npm run test:ci
```

If your Jest tests rely on telemetry encryption, you may need to set:

- `ENCRYPTION_SECRET` (dev/local)

See the root [`README.md`](../README.md) and [`reports/README.md`](../reports/README.md).
