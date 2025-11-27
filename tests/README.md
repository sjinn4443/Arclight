# `tests` Directory

This directory contains the comprehensive test suite for the Arclight application, ensuring reliability, accessibility, and user experience across various components.

The tests cover a wide range of aspects, including UI/UX integration, API functionality, internationalization, link integrity, performance under large states, navigation flow, responsiveness across devices, and typography consistency.

## Testing Setup

- **Frameworks:**
  - **Jest:** Primary testing framework for unit, UI, and API tests.
  - **Supertest:** Used for backend API testing.
  - **JSDOM:** Simulates the DOM and localStorage for frontend and UI tests.
- **Test Files:**
  - **`tests/ui.test.js`**: Focuses on UI/UX integration and user flow tests.
    - Mocks global `fetch` and the `navigation.js` module to control page loading and history.
    - Tests include:
      - Main elements display on the home page.
      - Navigation links correctly route to sections/pages.
      - Main interactive button triggers expected actions.
      - Responsive layout adapts to mobile and desktop.
      - Error messages display for invalid input.
      - Splash screen appears with language selection.
      - `loadPage` functionality: correctly loads content, applies active classes, handles fetch errors, and manages route not found scenarios.
      - `goBack` functionality: navigates to previous pages, defaults to dashboard if history is empty.
      - Global back button visibility based on routes.
  - **`tests/api.test.cjs`**: Contains API tests for the `server.cjs` backend.
    - Uses `supertest` to make HTTP requests to the Express application.
    - Tests include:
      - Verifying that the root endpoint (`GET /`) returns `index.html` with a 200 status code and correct content type.
  - **`tests/sample.test.js`**: Contains basic unit tests.
    - A simple test to ensure Jest is configured and running correctly (`expect(true).toBe(true)`).
  - **`tests/tracking.test.cjs`**: Contains tests for the data tracking and logging functionality.
    - Mocks the `ipEnricher.cjs` module to control geolocation data for predictable testing.
    - Uses a temporary directory for log files to ensure tests are isolated and clean up after themselves.
    - Tests include:
      - Verifying that the `/track` endpoint returns `204 No Content`.
      - Ensuring IP and mocked geolocation data are correctly logged to `logs/ip_logs.jsonl`.
      - Handling requests without `X-Forwarded-For` headers, logging local IPs and null geolocation data.
  - **`tests/i18n.test.js`**: Tests internationalization (i18n) features.
    - Ensures correct language loading and content display based on selected language.
  - **`tests/link-integrity.test.js`**: Verifies the integrity of internal and external links.
    - Checks for broken links and correct routing.
  - **`tests/large-state.test.js`**: Tests the application's performance and stability with large state objects.
    - Ensures efficient handling of extensive data without performance degradation.
  - **`tests/navigation-flow.test.js`**: Comprehensive tests for user navigation paths.
    - Validates complex navigation scenarios and state transitions across different pages.
  - **`tests/rapid-tap-nav.test.js`**: Tests responsiveness and reliability of navigation during rapid user interactions.
    - Simulates quick taps and gestures to ensure the UI remains stable and responsive.
  - **`tests/responsive-breakpoints.test.cjs`**: Verifies UI responsiveness across various screen sizes and device breakpoints.
    - Ensures consistent user experience on mobile, tablet, and desktop views.
  - **`tests/typography-consistency.test.cjs`**: Checks for consistent application of typography styles.
    - Ensures design system adherence for fonts, sizes, and weights across the UI.
  - **`tests/a11y-aria.test.cjs`**: Accessibility (ARIA) regression tests.
    - Crawls public HTML files and ensures interactive elements have accessible names.
    - Verifies non-native clickable elements define proper roles and `tabindex`.
    - Confirms modals/dialogs adhere to ARIA best practices.

- **Functional & Regression Testing**
  - **Link Integrity:** Crawl all `.html` links in the `public` folder to ensure there are no 404s, broken paths, or dead ends.
  - **Navigation Flow:** Check that the browser back/forward buttons preserve state without errors. Verify that every link in menus and dashboards routes to the correct page.

- **Edge Cases (state/data)**
  - **Large-state scenarios:** With 200+ liked items or many offline assets selected, confirm there is no slowdown and filters remain accurate.
  - **Duplicates/conflicts:** When like/unlike is tapped repeatedly, confirm the final state is correct and no duplicate entries remain in storage.
  - **i18n / language-pack regression:** If a translation key is missing, confirm fallback works properly.

- **Interactive Component Tests** (When contents are ready):
  - **Quiz Logic:** Verify scoring, right/wrong feedback, and completion state management are correct.
  - **Video Player:** Confirm play/pause/seek/custom controls and time-based events work correctly.
  - **Image Zoom:** Ensure zoom in/out works across screen sizes without breaking layout.
  - **TOC Navigation:** Ensure clicking items in the Table of Contents navigates accurately to the right section.

- **PWA & Offline Capability Testing**
  - **Service Worker Lifecycle:** After installation, confirm required assets (HTML/CSS/JS/key images and videos) are cached properly.
  - **Offline Functionality** (Later on): Check that only selected content downloads via the offline-assets modal and opens offline. On slow/flaky networks, confirm cache-first behaviour and graceful timeouts.
  - **Offline to Online Transition UX:** When opening a non-downloaded asset offline, confirm messaging is clear. After changing like/save state offline, confirm it persists when coming back online.

- **Performance Testing**
  - **Page Load Speed (Lighthouse):** Measure FCP/LCP/TTI for key pages and track regressions after changes.
  - **Rendering Performance:** Confirm there is no FOUC (white flashing) from delayed CSS. Check that images are optimised (eg WebP) and appropriately sized.
  - **Low-end device perceived performance:** Under CPU throttling (4–6x), ensure core flows do not stutter. Check for memory leaks or gradual slowdown after repeated page transitions.
  - **Media performance/resilience:** Ensure unnecessary media preloading does not hurt LCP. Confirm the UI does not freeze on 404s, unsupported codecs, or partial downloads.

- **UI/UX & Visual Regression Testing**
  - **Visual Consistency:** Typography (font, size, weight) across headers/body/buttons is consistent throughout the app.
  - **Responsiveness:** Layout adapts cleanly at different device sizes and breakpoints without overlap or clipping.
  - **Touch/gesture-based (mobile):** Double taps or rapid taps should not cause duplicate actions or duplicate page pushes.
- **Accessibility (a11y) Testing**
  - **ARIA Roles & Attributes:** Ensure interactive elements (quizzes, buttons, modals) include appropriate roles and `aria-label` / `aria-hidden` attributes.

- **Execution:**
  - `npm install` (from project root) to install dependencies.
  - `npm test` to run all tests.
  - A Git `pre-push` hook is configured to automatically run all tests before pushing changes.
- **Notes:**
  - Backend tests use a temporary directory for data.
  - Accessibility requirements are enforced by automated tests in `ui.test.js`.
  - For full browser/E2E automation, Playwright or Cypress are considerations for future expansion.
