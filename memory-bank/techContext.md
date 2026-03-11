<!-- THE CHANGES - techContext.md | 2026-03-11, Codex -->

# Tech Context

## Technologies Used

- Core UI: HTML5, CSS3, JavaScript (ESM in browser)
- Server: Node.js + Express (`server.cjs`)
- PWA: Service Worker API, Web Manifest
- Embedded interactive content: local iframe mini-apps under `public/subapp/*` plus selected external Netlify iframes inside `public/html/videos.html`
- Build & Bundling: `esbuild`, `clean-css-cli`, `html-minifier-terser`
- Testing: Jest (mix of `*.cjs` + `*.mjs`), JSDOM, Supertest
- Quality: ESLint, Prettier, Husky + lint-staged
- E2E/Perf (optional): Playwright, Lighthouse CI
- Storage:
  - dev/test: NDJSON file under `reports/data/telemetry.ndjson`
  - prod: Postgres (via `pg`) when `DATABASE_URL` is present

## Development Setup

- Install deps: `npm install`
- Dev server (watch): `npm run dev`
- Start server: `npm start`
- Build: `npm run build`
- Serve built output: `npm run serve:dist`

### Interactive Learning integration notes

- Local interactive modules are typically served from `public/subapp/*`.
- External interactive modules are embedded through hidden subpages in `public/html/videos.html` and lazy-loaded by `public/js/videos.js`.
- Cross-origin iframe internals cannot be styled or scripted directly from Arclight.

## Key Environment Variables

- `NODE_ENV`: `development` | `test` | `production`
- `PORT`, `HOST`
- `SERVE_DIST`: serve `dist/` even when `NODE_ENV` is not production

### Reports

- `DASHBOARD_PASSWORD`: Basic Auth password for `/reports.html` and `/html/reports.html`

### Telemetry encryption (NDJSON mode)

- `ENCRYPTION_SECRET`: when set, NDJSON rows are encrypted at rest (AES-256-GCM via `reports/security/encrypt.cjs`).

### Production DB

- `DATABASE_URL`: enables Postgres storage
- `DB_SSL`: set to `disable` to disable SSL; otherwise SSL uses `rejectUnauthorized: false`

## Testing Setup

- Jest config: `jest.config.cjs`
- Run tests: `npm test`
- CI-style tests: `npm run test:ci`

### ESM/CJS constraint

The repo root is ESM (`"type": "module"`), but server and many tests are CommonJS (`*.cjs`). To avoid ESM loader issues when CJS tests import browser ESM modules, Jest uses `moduleNameMapper` to map selected ESM modules to CJS mocks under `tests/__mocks__/`.

## CI/CD

- GitHub Actions workflow: `.github/workflows/ci-cd.yml`
- Runs format check, build, accessibility checks, Jest, and uploads `dist/` as an artifact.
