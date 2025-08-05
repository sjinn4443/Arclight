# Arclight_App Test Suite

Welcome to the test suite for **Arclight_App**—an interactive educational platform designed to support clinical learning in ophthalmology and related fields. This suite ensures the reliability, accessibility, and user experience of Arclight_App, which features clinical quizzes, interactive case studies, chatbot-driven guidance, and a multilingual, user-friendly interface for learners and practitioners.

## About Arclight_App

Arclight_App provides a comprehensive set of tools for clinical education, including interactive quizzes, case-based learning modules, clinical image galleries, and a responsive chatbot to guide users through key concepts in eye health. The app is designed for accessibility, robust user experience, and support for multiple languages.

## Test Suite Overview

This folder contains automated tests covering:

- **Backend API**: Data handling, authentication, and record management.
- **Frontend Chatbot**: Chat logic, sidebar updates, and localStorage persistence.
- **UI/UX Integration**: User flows, accessibility, and interface interactions.
- **Quiz and Case Modules**: Functionality for quizzes, case navigation, and scoring.
- **Clinical Image Display**: Rendering and accessibility of clinical images.

## Structure


- `ui.test.js` — UI/UX integration and user flow tests (Jest + jsdom)
  - **Tests:**
    1. Home page loads and displays main elements
    2. Navigation links work and route to the correct sections/pages
    3. Main interactive button triggers the expected action
    4. Responsive layout adapts correctly on mobile and desktop
    5. Error messages display when invalid input is submitted
    6. Splash screen appears on page load with language selection

## Setup

1. **Install dependencies (from project root):**
   ```bash
   npm install --save-dev jest supertest jsdom
   ```

2. **(Optional) Add a test script to your package.json:**
   ```json
   "scripts": {
     "test": "jest"
   }
   ```

## Running Tests

- To run all tests in detail (recommended):
  ```bash
  npx jest --verbose
  ```
- To run a specific test file:
  ```bash
  npx jest --verbose tests/api.test.js
  npx jest --verbose tests/chatbot.test.js
  npx jest --verbose tests/ui.test.js
  ```

## Notes

- Backend tests use a temporary directory for all data, so your real files are never touched.
- Frontend and UI tests use jsdom to simulate the DOM and localStorage.
- All major user flows, UI elements, and backend logic are covered.
- **Accessibility requirements are enforced by automated tests in `ui.test.js`.**
- For full browser/E2E automation, consider Playwright or Cypress.

## Expanding the Suite

- Add more tests for edge cases, error handling, and new features as you develop.
- Keep tests in sync with your codebase for best results.

---

This test suite is essential for maintaining the high standards of quality, accessibility, and reliability that define Arclight_App.
