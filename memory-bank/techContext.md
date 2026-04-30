<!-- THE CHANGES - techContext.md | 2026-04-30, Codex -->

# Tech Context

## Technologies Used

- Core UI: HTML5, CSS3, JavaScript (ESM in browser)
- Server: Node.js + Express (`server.cjs`)
- PWA: Service Worker API, Web Manifest
- Embedded interactive content: local iframe mini-apps under `public/subapp/*` plus selected external Netlify iframes inside `public/html/videos.html`
- Workshop flows: static HTML lesson shells plus JS navigation/progress helpers, including `public/js/diabeticWorkshopNextFlow.js` and `public/js/diabeticWorkshopProgress.js`
- Build & Bundling: `esbuild`, `clean-css-cli`, `html-minifier-terser`
- Testing: Jest (mix of `*.cjs` + `*.mjs`), JSDOM, Supertest
- Quality: ESLint, Prettier, Husky + lint-staged
- E2E/Perf (optional): Playwright, Lighthouse CI
- Storage:
  - current default: no-op storage via `storage/disabled-storage.cjs` when no DB URL is configured
  - Postgres: `storage/pg-storage.cjs` when any configured Postgres URL is present and `DISABLE_DB_STORAGE` is not enabled
  - legacy/local module: `storage/ndjson-storage.cjs` remains available in the repo but is not selected by the current storage index

## Development Setup

- Install deps: `npm install`
- Dev server (watch): `npm run dev`
- Start server: `npm start`
- Build: `npm run build`
- Serve built output: `npm run serve:dist`
- Fundal regression suite: `npm run test:fundal`

### Interactive Learning integration notes

- Local interactive modules are typically served from `public/subapp/*`.
- External interactive modules are embedded through hidden subpages in `public/html/videos.html` and lazy-loaded by `public/js/videos.js`.
- Cross-origin iframe internals cannot be styled or scripted directly from Arclight.
- Diabetic workshop previous/next flow can cross from the workshop route into Videos-route pages; the flow state is stored in `sessionStorage` and restored when returning to the workshop folders.

## Key Environment Variables

- `NODE_ENV`: `development` | `test` | `production`
- `PORT`, `HOST`
- `SERVE_DIST`: serve `dist/` even when `NODE_ENV` is not production
- `DISABLE_DB_STORAGE`: force no-op runtime storage; Playwright starts the web server with this enabled

### Reports

- `DASHBOARD_PASSWORD`: Basic Auth password for `/reports.html` and `/html/reports.html`
- `REPORTS_ALLOW_LOCAL_DELETE`: enables report deletion only for local development
- `REPORTS_ALLOW_DELETE`: enables report deletion in deployed environments

### Telemetry encryption (NDJSON mode)

- `ENCRYPTION_SECRET`: when set, NDJSON rows are encrypted at rest (AES-256-GCM via `reports/security/encrypt.cjs`).

### Production DB

- `DATABASE_URL`: enables Postgres storage
- `REPORTS_READ_DATABASE_URL`: optional read-only database URL for reports reads
- `REPORTS_ADMIN_DATABASE_URL`: optional admin database URL for reports deletes/audit logs
- `DB_SSL`: set to `disable` to disable SSL
- `DB_CA_CERT`: optional CA certificate
- `DB_SSL_ALLOW_SELF_SIGNED`: allow self-signed DB TLS certificates when set to `true`

## Testing Setup

- Jest config: `jest.config.cjs`
- Run tests: `npm test`
- CI-style tests: `npm run test:ci`

### ESM/CJS constraint

The repo root is ESM (`"type": "module"`), but server and many tests are CommonJS (`*.cjs`). To avoid ESM loader issues when CJS tests import browser ESM modules, Jest uses `moduleNameMapper` to map selected ESM modules to CJS mocks under `tests/__mocks__/`.

## CI/CD

- GitHub Actions workflow: `.github/workflows/ci-cd.yml`
- Runs format check, build, accessibility checks, Jest, and uploads `dist/` as an artifact.
