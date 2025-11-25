# `tests` Directory

This directory contains the comprehensive test suite for the Arclight application, ensuring reliability, accessibility, and user experience across various components.

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
  - **`tests/api.test.js`**: Contains API tests for the `server.cjs` backend.
    - Uses `supertest` to make HTTP requests to the Express application.
    - Tests include:
      - Verifying that the root endpoint (`GET /`) returns `index.html` with a 200 status code and correct content type.
  - **`tests/sample.test.js`**: Contains basic unit tests.
    - A simple test to ensure Jest is configured and running correctly (`expect(true).toBe(true)`).
  - **`tests/tracking.test.js`**: Contains tests for the data tracking and logging functionality.
    - Mocks the `ipEnricher.cjs` module to control geolocation data for predictable testing.
    - Uses a temporary directory for log files to ensure tests are isolated and clean up after themselves.
    - Tests include:
      - Verifying that the `/track` endpoint returns `204 No Content`.
      - Ensuring IP and mocked geolocation data are correctly logged to `logs/ip_logs.jsonl`.
      - Handling requests without `X-Forwarded-For` headers, logging local IPs and null geolocation data.

- **Test Coverage:**
  - Backend API: Data handling, authentication, record management.
  - Frontend Chatbot: Chat logic, sidebar updates, localStorage persistence.
  - UI/UX Integration: User flows, accessibility, interface interactions.
  - Quiz and Case Modules: Functionality for quizzes, case navigation, scoring.
  - Clinical Image Display: Rendering and accessibility of clinical images.
  - Security Features: Testing of rate limiting, CSP, CORS, and CSRF protection.
- **Execution:**
  - `npm install` (from project root) to install dependencies.
  - `npm test` to run all tests.
  - A Git `pre-push` hook is configured to automatically run all tests before pushing changes.
- **Notes:**
  - Backend tests use a temporary directory for data.
  - Accessibility requirements are enforced by automated tests in `ui.test.js`.
  - For full browser/E2E automation, Playwright or Cypress are considerations for future expansion.
