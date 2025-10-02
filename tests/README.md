# Testing Overview

This folder contains various tests for the project, including UI tests, API tests, and sample unit tests, all set up using Jest.

## Jest Setup

- **Frameworks:** Jest is the primary testing framework, complemented by Supertest for API testing and JSDOM for simulating the DOM in UI tests.
- **Installation:** Dependencies (`jest`, `supertest`, `jsdom`, `jest-environment-jsdom`) are managed via `package.json` and installed using `npm install`.
- **Execution:** Tests can be run using the `npm test` command, which executes all test files (e.g., `*.test.js`) in this directory.

## Test List

### UI Tests

1. **Test 1:** Home page loads successfully and displays the main elements.
2. **Test 2:** Navigation links work and route to the correct sections/pages.
3. **Test 3:** Main interactive button triggers the expected action.
4. **Test 4:** Responsive layout adapts correctly on mobile and desktop.
5. **Test 5:** Error messages display when invalid input is submitted.
6. **Test 6:** Splash screen appears on page load.

### API Tests

- **`api.test.js`**: Contains tests for the backend API endpoints, ensuring they respond as expected. Currently, it verifies the static file serving of `server.js`.

### Sample Unit Tests

- **`sample.test.js`**: A basic test file to confirm the Jest setup is working correctly.

---

Each test is implemented in a separate file in this directory.
