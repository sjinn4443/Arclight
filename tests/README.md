# Testing Overview

This folder contains various tests for the project, including UI tests, API tests, and sample unit tests, all set up using Jest.

## Jest Setup

- **Frameworks:** Jest is the primary testing framework, complemented by Supertest for API testing and JSDOM for simulating the DOM in UI tests.
- **Installation:** Dependencies (`jest`, `supertest`, `jsdom`, `jest-environment-jsdom`) are managed via `package.json` and installed using `npm install`.
- **Execution:** Tests can be run using the `npm test` command, which executes all test files (e.g., `*.test.js`) in this directory.

## Test List

### UI Tests

1.  **Test 1:** Home page loads successfully and displays the main elements.
2.  **Test 2:** Navigation links work and route to the correct sections/pages.
3.  **Test 3:** Main interactive button triggers the expected action.
4.  **Test 4:** Responsive layout adapts correctly on mobile and desktop.
5.  **Test 5:** Error messages display when invalid input is submitted.
6.  **Test 6:** Splash screen appears on page load.

### API Tests

- **`api.test.js`**: Contains tests for the backend API endpoints, ensuring they respond as expected. This includes verification of static file serving and security feature implementations.

### Security Tests

- Tests are in place to cover the implemented security measures: Rate Limiting, Content Security Policy (CSP), CORS allowlist, and CSRF protection. For detailed information on these measures and their configurations, please refer to `security/README.md`.

### Sample Unit Tests

- **`sample.test.js`**: A basic test file to confirm the Jest setup is working correctly.

---

Each test is implemented in a separate file in this directory. The `npm test` command runs all tests, and a Git `pre-push` hook ensures tests are executed before pushing changes.
