<!-- THE CHANGES - techContext.md | 2025-10-02, Cline -->

# Tech Context

## Technologies Used

- **Core:** HTML5, CSS3, JavaScript (ES6+)
- **PWA:** Service Worker API, Web Manifest
- **Build & Bundling:** `esbuild`, `clean-css`, `html-minifier-terser`
- **Image Processing:** `sharp`
- **Testing:** `Jest`, `Supertest`, `JSDOM`, `babel-jest`, `eslint`, `prettier`, `husky`
- **Security:** `express-rate-limit`, `helmet`, `cors`, `csurf`, `express-session`, `cookie-parser`
- **Utilities:** `node-fetch`, `geoip-lite`, `fs-extra`, `mkdirp`

## Development Setup

The project utilizes a modern development workflow:

- **Local Server:** `server.cjs` handles local development and API serving.
- **Build Process:** `scripts/build.cjs` automates the bundling and minification of JS, CSS, and HTML assets using `esbuild`, `clean-css`, and `html-minifier-terser`.
- **Image Conversion:** `convertImage.js` can be used to convert PNG images to WebP format.
- **Translation Checks:** `scripts/check-translations.cjs` is a placeholder for translation consistency checks.
- **Accessibility Testing:** `scripts/test-a11y.mjs` is a placeholder for accessibility checks.
- **Dependencies:** Managed via `package.json`, including development dependencies for testing, linting, and building.

## Technical Constraints

- **Browser Compatibility:** Designed to work across modern web browsers.
- **Offline First:** Emphasis on making core content available offline.
- **Performance:** Optimized for fast loading and smooth interactions, especially given the media-heavy nature.
- **No Backend Database:** All content and state management are handled client-side or through local storage/IndexedDB if implemented in specific modules. `server.cjs` is used for local development and API serving.

## Dependencies

- **`package.json`:** Lists project dependencies and development scripts. Key dependencies include:
  - **Runtime:** `express`, `cookie-parser`, `cors`, `dotenv`, `express-rate-limit`, `express-session`, `helmet`, `geoip-lite`, `http-server`, `morgan`, `node-fetch`, `sharp`.
  - **Testing:** `jest`, `supertest`, `jsdom`, `jest-environment-jsdom`, `babel-jest`.
  - **Build/Dev Tools:** `esbuild`, `clean-css-cli`, `html-minifier-terser`, `terser`, `fs-extra`, `mkdirp`, `prettier`, `eslint`, `husky`, `lint-staged`, `cross-env`, `typescript`.

## Testing Setup

The project includes a comprehensive test suite to ensure reliability, accessibility, and user experience.

- **Frameworks:**
  - **Jest:** Primary testing framework for unit, UI, and API tests.
  - **Supertest:** Used for backend API testing.
  - **JSDOM:** Simulates the DOM and localStorage for frontend and UI tests.
- **Test Files:**
  - `tests/ui.test.js`: Contains UI/UX integration and user flow tests.
  - `tests/api.test.js`: Contains API tests.
  - `tests/sample.test.js`: Contains sample unit tests.
- **Test Coverage:**
  - Backend API: Data handling, authentication, record management.
  - Frontend Chatbot: Chat logic, sidebar updates, localStorage persistence.
  - UI/UX Integration: User flows, accessibility, interface interactions.
  - Quiz and Case Modules: Functionality for quizzes, case navigation, scoring.
  - Clinical Image Display: Rendering and accessibility of clinical images.
  - **Security Features:** Testing of rate limiting, CSP, CORS, and CSRF protection.
- **Execution:**
  - `npm install` (from project root) to install dependencies.
  - `npm test` to run all tests.
  - A Git `pre-push` hook is configured to automatically run all tests before pushing changes.
- **Notes:**
  - Backend tests use a temporary directory for data.
  - Accessibility requirements are enforced by automated tests in `ui.test.js`.
  - For full browser/E2E automation, Playwright or Cypress are considerations for future expansion.
- **Internal Dependencies:** Modules link to shared assets in `images/` and `videos/`. JavaScript files within modules might interact with the main `script.js` or `service-worker.js`.

## Tool Usage Patterns

- **Text Editors/IDEs:** Standard web development environments (e.g., VS Code).
- **Browser Developer Tools:** For debugging and performance analysis.
- **CLI:** For running local servers, managing packages (npm/yarn), executing tests, and running build/utility scripts.
- **Git:** For version control.
- **GitHub Actions:** For automated CI/CD.
- **Linters/Formatters:** ESLint and Prettier are used for code quality and consistency.
- **Build Tools:** `esbuild` is used for bundling and minifying assets.
- **Image Processing:** `sharp` is available for image optimization.
