# Arclight App

This project is the Arclight App, a comprehensive educational and diagnostic tool designed to support eye health professionals and learners. It includes interactive quizzes, case studies, instructional videos, and detailed anatomical images to facilitate learning and assessment in ophthalmology and related fields. This app is designed to help with eye exams.

## Features

- Interactive quizzes on various eye health topics
- Case studies with images and detailed explanations
- Instructional videos for practical demonstrations
- Anatomical diagrams and images for reference
- Responsive design for use on multiple devices

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/sjinn4443/Arclight.git
   ```
2. Open the project in your preferred code editor.
3. Open `index.html` in a web browser to start using the app.
4. For development, you can run a local server (e.g., using `http-server` or `npm start`) to serve the files, and then access the app at `http://localhost:3000`.

## Project Structure

- `index.html` - Main entry point of the app
- `style/` - Directory containing `base.css`, `components.css`, `pages.css`, and `responsive.css` for global styles
- `public/js/` - Directory containing JavaScript files for different modules and features
- `images/` - Image assets used throughout the app
- `.github/workflows/ci-cd.yml` - GitHub Actions CI/CD workflow
- `memory-bank/` - Documentation and project context files
- Various folders for specific modules like `AnteriorSegmentQuiz`, `Cataract`, `Morph`, `Squint`, etc.

## Memory Bank

The `memory-bank/` directory contains essential project documentation that guides development and maintains project knowledge. It includes:

- `projectbrief.md` - Core project requirements and goals
- `productContext.md` - User experience and problem context
- `activeContext.md` - Current work focus and recent changes
- `systemPatterns.md` - Architecture and design patterns
- `techContext.md` - Technologies and development setup
- `progress.md` - Status and known issues

Maintaining the Memory Bank is critical for project continuity and knowledge sharing.

## Testing

The project uses Jest for comprehensive testing, including UI, API, and unit tests.

- **Running Tests:** Execute all tests using `npm test`.
- **Pre-push Hook:** A Git `pre-push` hook is configured to automatically run all tests before pushing changes to GitHub. This ensures that only code passing all tests is pushed to the repository.

## Contributing

Please follow the existing code patterns and update the Memory Bank when making significant changes. Write tests for new features and ensure the app works across different environments.

## License

[Specify your license here]

## Changelog

### 02/10/25

- Set up Jest for unit, UI, and API testing.
- Configured a Git `pre-push` hook to run tests automatically before pushing to GitHub.
- Updated `tests/README.md` with detailed testing information.

### 26/08/25

- Placeholder for changes made on 26/08/25.

### 27/08/25

- Placeholder for changes made on 27/08/25.

### 02/09/25

- Performed a memory bank update, reading all memory bank files and the README.md.
- Added JSDoc comments to all JavaScript files in `Arclight_App/public/js/`.

### 29/09/25

- Set up GitHub Actions CI/CD pipeline at `.github/workflows/ci-cd.yml` for continuous integration and deployment to Railway.
- Updated memory bank files (`activeContext.md`, `progress.md`) to reflect the new CI/CD setup.

### 31/08/25

- Updated memory bank and README.md dates. General application refinement and content integration across various modules, including updates to video playback, navigation, onboarding, and PWA features.

### 04/10/25

- Created a `security` folder and implemented the following security measures:
  - **Rate Limiting**: Using `express-rate-limit` to control request frequency.
  - **Content Security Policy (CSP)**: Configured with `helmet` to prevent XSS, allowing `'self'`, `https://fonts.googleapis.com` for styles, and `https://fonts.gstatic.com` for fonts.
  - **CORS Allowlist**: Implemented with `cors` to restrict cross-origin requests to `http://localhost:3000`.
  - **CSRF Protection**: Set up using `csurf`, `express-session`, and `cookie-parser` to guard against CSRF attacks.
- Resolved ES module / CommonJS conflict by renaming `server.js` to `server.cjs` and updating all related `require` paths and `package.json` scripts.
