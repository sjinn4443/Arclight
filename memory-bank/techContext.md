<!-- THE CHANGES - techContext.md | 2025-06-25, SJ -->
# Tech Context

## Technologies Used

- **HTML5:** For structuring the web content.
- **CSS3:** For styling and layout, including responsive design.
- **JavaScript (ES6+):** For interactive elements, dynamic content, and application logic.
- **Service Worker API:** For implementing Progressive Web App (PWA) features, including offline caching.
- **Web Manifest:** For PWA metadata and installation prompts.

## Development Setup

The project is a standard web application that can be served by any static file server.
- **Local Development:** Can be run by opening `index.html` directly in a browser or by using a simple local HTTP server (e.g., `http-server`, Python's `SimpleHTTPServer`, or Node.js `serve`).
- **No Build Step:** The project does not currently use a complex build pipeline (e.g., Webpack, Parcel). Files are served directly as written.
- **Dependencies:** Minimal external dependencies. `package.json` exists, but primarily for development tools or potential future Node.js based server components (`server.js`).

## Technical Constraints

- **Browser Compatibility:** Designed to work across modern web browsers.
- **Offline First:** Emphasis on making core content available offline.
- **Performance:** Optimized for fast loading and smooth interactions, especially given the media-heavy nature.
- **No Backend Database:** All content and state management are handled client-side or through local storage/IndexedDB if implemented in specific modules. `server.js` might be for local development or a simple API, but not a full-fledged backend.

## Dependencies

- **`package.json`:** Lists development dependencies and scripts. Key dependencies include:
    - `http-server` or similar for local serving.
    - **Testing Frameworks:** `jest`, `supertest`, `jsdom` for automated tests.

## Testing Setup

The project includes a comprehensive test suite to ensure reliability, accessibility, and user experience.

- **Frameworks:**
    - **Jest:** Primary testing framework.
    - **Supertest:** Used for backend API testing.
    - **JSDOM:** Simulates the DOM and localStorage for frontend and UI tests.
- **Test Files:**
    - `tests/ui.test.js`: Contains UI/UX integration and user flow tests.
- **Test Coverage:**
    - Backend API: Data handling, authentication, record management.
    - Frontend Chatbot: Chat logic, sidebar updates, localStorage persistence.
    - UI/UX Integration: User flows, accessibility, interface interactions.
    - Quiz and Case Modules: Functionality for quizzes, case navigation, scoring.
    - Clinical Image Display: Rendering and accessibility of clinical images.
- **Execution:**
    - `npm install --save-dev jest supertest jsdom` (from project root)
    - `npx jest --verbose` to run all tests.
    - `npx jest --verbose tests/ui.test.js` to run specific UI tests.
- **Notes:**
    - Backend tests use a temporary directory for data.
    - Accessibility requirements are enforced by automated tests in `ui.test.js`.
    - For full browser/E2E automation, Playwright or Cypress are considerations for future expansion.
- **Internal Dependencies:** Modules link to shared assets in `images/` and `videos/`. JavaScript files within modules might interact with the main `script.js` or `service-worker.js`.

## Tool Usage Patterns

- **Text Editors/IDEs:** Standard web development environments (e.g., VS Code).
- **Browser Developer Tools:** For debugging and performance analysis.
- **CLI:** For running local servers, managing packages (npm/yarn), and executing tests.
- **Git:** For version control.
