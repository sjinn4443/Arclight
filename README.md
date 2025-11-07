# Arclight App

This project is the Arclight App, a comprehensive educational and diagnostic tool designed to support eye health professionals and learners. It includes interactive quizzes, case studies, instructional videos, and detailed anatomical images to facilitate learning and assessment in ophthalmology and related fields. This app is designed to help with eye exams.

## Features

- Interactive quizzes on various eye health topics
- Case studies with images and detailed explanations
- Instructional videos for practical demonstrations
- Anatomical diagrams and images for reference
- Responsive design for use on multiple devices
- **Enhanced Security:** Implemented rate limiting, Content Security Policy (CSP), CORS allowlist, CSRF protection, and production-ready session management using Redis.
- **Automated CI/CD:** GitHub Actions pipeline for continuous integration and deployment.

## Data Tracking and Logging

- The application includes a `/track` endpoint designed to log user interaction data, including IP addresses and user agent information.
- To accurately capture the client's IP address, the server is configured to trust proxy headers (`app.set("trust proxy", 1)`).
- Geolocation enrichment is performed asynchronously for non-test environments, utilizing services such as `ipinfo.io`, `bigdatacloud.net`, or `geoip-lite`.
- Collected logs, including IP, geolocation, coordinates, and user agent, are stored in `logs/ip_logs.jsonl`.
- An `/admin/logs` endpoint is available for authorized access to view these logs.

## Build Process

- The project includes a build script (`scripts/build.cjs`) that performs the following actions:
  - Cleans the `dist` directory.
  - Copies the `public` directory contents to `dist`.
  - Removes original JS files from `dist` to avoid duplication.
  - Bundles and minifies JavaScript files using `esbuild` into `dist/js`.
  - Minifies the service worker script (`sw.js`) using `esbuild`.
  - Minifies CSS files found in `dist` using `clean-css`.
  - Minifies HTML files found in `dist` using `html-minifier-terser`.
- This process ensures optimized assets are prepared for deployment.

## Asset Optimization

- The `convertImage.js` script is available for converting PNG images to WebP format, which can lead to smaller file sizes and faster loading times. This script can be run manually on specific directories.

## Utility Scripts

- `scripts/check-translations.cjs`: A placeholder script for enforcing translation coverage and consistency.
- `scripts/test-a11y.mjs`: A placeholder script for performing accessibility checks on the built `dist` output.

## Development Tools

- **VSCode Extension (`vscode-alanui-launcher`)**: A custom VSCode extension is provided to easily launch the Arclight App on `http://localhost:3000` via a status bar button. Refer to `vscode-alanui-launcher/README.md` for installation and usage instructions.

## Key Technical Decisions

- **PWA First:** Prioritizing offline access and fast loading times through service worker implementation.
- **Modular Design:** Each educational module is self-contained, allowing for easier development, maintenance, and potential future expansion.
- **Static Content Delivery:** The application primarily serves static HTML, CSS, JavaScript, images, and videos, simplifying deployment and reducing server-side dependencies.
- **Vanilla JavaScript:** Minimal reliance on complex frameworks to keep the codebase lightweight and easily maintainable.

## Technologies Used

- **HTML5, CSS3, JavaScript (ES6+)**
- **Service Worker API, Web Manifest**
- **Jest** for testing
- **GitHub Actions** for CI/CD
- **Security Libraries** (e.g., `express-rate-limit`, `helmet`, `cors`, `csurf`, `express-session`, `cookie-parser`, `redis`, `connect-redis`)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/sjinn4443/Arclight.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Open the project in your preferred code editor.
4. For development, you can run a local server using `npm start` and then access the app at `http://localhost:3000`.
5. Alternatively, you can open `public/index.html` directly in a web browser to start using the app, though some features (like API tracking) may not function without a server.

## Project Structure

- `public/index.html` - Main entry point of the app.
- `public/style/` - Directory containing `base.css`, `components.css`, `pages.css`, and `responsive.css` for global styles.
- `public/js/` - Directory containing JavaScript files for different modules and features.
- `public/images/` - Image assets used throughout the app.
- `public/videos/` - Video assets used throughout the app.
- `public/favicons/` - Favicon assets.
- `public/html/` - Additional HTML pages for various sections of the app.
- `public/subapp/` - Contains sub-applications or modules like `Cataract`, `Mires`, `Morph`, `Squint`.
- `public/translation/` - Translation files for multi-language support.
- `security/` - Directory containing server-side security configurations (rate limiting, CSP, CORS, CSRF).
- `securitytest/` - Scripts for testing security configurations.
- `scripts/` - Utility scripts for build processes, translation checks, and accessibility tests.
- `tests/` - Contains Jest test files for UI, API, and unit tests.
- `.github/workflows/ci-cd.yml` - GitHub Actions CI/CD workflow.
- `memory-bank/` - Documentation and project context files.
- `vscode-alanui-launcher/` - Custom VSCode extension for launching the app.
- Other root-level files like `server.cjs` (local development server), `package.json`, `jest.config.js`, etc.

## Key JavaScript Files

The following JavaScript files are integral to the application's functionality:

- `atomscard.js`: Manages the "Atoms Card" section, including dynamic Table of Contents and image display.
- `catalog-index.js`: Manages the catalog of learning modules.
- `config.js`: Handles application configuration settings.
- `dashboard.js`: Controls the main user dashboard functionality.
- `dev_dashboard.js`: Specific scripts for the development dashboard.
- `ears.js`: Contains logic and content for the "Ears" module.
- `eyes.js`: Contains logic and content for the "Eyes" module.
- `home-data.js`: Manages data related to the home screen.
- `i18n.js`: Handles internationalization and localization.
- `index.js`: Main entry point for client-side application logic.
- `interest.js`: Manages the professional interest pages.
- `intro.js`: Manages the introductory screens/flows.
- `language-picker.js`: Provides functionality for language selection.
- `languageinstall.js`: Handles the language installation page.
- `learningModules.js`: Contains logic for various learning modules.
- `likes.js`: Manages the "My Learning" (Liked) page functionality.
- `location-service.js`: Manages location-based services or data.
- `main.js`: The primary script for core application logic and service worker registration.
- `menu.js`: Controls the application's navigation menu.
- `misc.js`: Contains miscellaneous utility functions.
- `mylearning.js`: Manages the "My Learning" page.
- `navigation.js`: Manages overall application navigation.
- `offline.js`: Handles offline content management and service worker interactions.
- `onboarding.js`: Manages the onboarding process.
- `pwa.js`: Handles Progressive Web App specific functionalities.
- `quiz-launcher.js`: Launches and manages quizzes.
- `quizzes.js`: Contains core quiz logic and functionality.
- `telemetry.js`: Manages telemetry and analytics data collection.
- `toc.js`: Manages dynamic Table of Contents.
- `video.js`: Handles video player functionality.
- `videos.js`: Manages video content and playback.

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

### 2025-10-04

- Created a `security` folder and implemented the following security measures:
  - **Rate Limiting**: Using `express-rate-limit` to control request frequency.
  - **Content Security Policy (CSP)**: Configured with `helmet` to prevent XSS, allowing `'self'`, `https://fonts.googleapis.com` for styles, and `https://fonts.gstatic.com` for fonts.
  - **CORS Allowlist**: Implemented with `cors` to restrict cross-origin requests to `http://localhost:3000`.
  - **CSRF Protection**: Set up using `csurf`, `express-session`, and `cookie-parser` to guard against CSRF attacks.
- Resolved ES module / CommonJS conflict by renaming `server.js` to `server.cjs` and updating all related `require` paths and `package.json` scripts.

### 2025-09-29

- Set up GitHub Actions CI/CD pipeline at `.github/workflows/ci-cd.yml` for continuous integration and deployment to Railway.
- Updated memory bank files (`activeContext.md`, `progress.md`) to reflect the new CI/CD setup.

### 2025-09-02

- Performed a memory bank update, reading all memory bank files and the README.md.
- Added JSDoc comments to all JavaScript files in `Arclight_App/public/js/`.

### 2025-08-26

- Placeholder for changes made on 2025-08-26.

### 2025-08-27

- Placeholder for changes made on 2025-08-27.

### 2025-08-02

- Set up Jest for unit, UI, and API testing.
- Configured a Git `pre-push` hook to run tests automatically before pushing changes to GitHub.
- Updated `tests/README.md` with detailed testing information.

### 2025-10-21

- Updated `README.md` files across the project to reflect the latest changes and provide more detailed information for each directory.
- Consolidated duplicate "Key Technical Decisions" and "Getting Started" sections in the root `README.md`.
- Enhanced the "Project Structure" in the root `README.md` for better clarity and completeness.

### 2025-10-04

- Created a `security` folder and implemented the following security measures:
  - **Rate Limiting**: Using `express-rate-limit` to control request frequency.
  - **Content Security Policy (CSP)**: Configured with `helmet` to prevent XSS, allowing `'self'`, `https://fonts.googleapis.com` for styles, and `https://fonts.gstatic.com` for fonts.
  - **CORS Allowlist**: Implemented with `cors` to restrict cross-origin requests to `http://localhost:3000`.
  - **CSRF Protection**: Set up using `csurf`, `express-session`, and `cookie-parser` to guard against CSRF attacks.
- Resolved ES module / CommonJS conflict by renaming `server.js` to `server.cjs` and updating all related `require` paths and `package.json` scripts.

### 2025-09-29

- Set up GitHub Actions CI/CD pipeline at `.github/workflows/ci-cd.yml` for continuous integration and deployment to Railway.
- Updated memory bank files (`activeContext.md`, `progress.md`) to reflect the new CI/CD setup.

### 2025-09-02

- Performed a memory bank update, reading all memory bank files and the README.md.
- Added JSDoc comments to all JavaScript files in `Arclight_App/public/js/`.

### 2025-08-26

- Placeholder for changes made on 2025-08-26.

### 2025-08-27

- Placeholder for changes made on 2025-08-27.

### 2025-08-02

- Set up Jest for unit, UI, and API testing.
- Configured a Git `pre-push` hook to run tests automatically before pushing changes to GitHub.
- Updated `tests/README.md` with detailed testing information.

### 2025-08-31

- Updated memory bank and README.md dates. General application refinement and content integration across various modules, including updates to video playback, navigation, onboarding, and PWA features.

## What's Left to Build

- **Security Testing:** Thoroughly test all implemented security measures and ensure they are correctly configured for production environments (e.g., strong `SESSION_SECRET`).
- **Full Content Population:** Ensure all educational modules are fully populated with comprehensive content (text, images, videos, quizzes).
- **Interactive Elements:** Refine all interactive elements within quizzes and case studies for a more engaging user experience.
- **Robust Error Handling:** Implement client-side error handling for a smoother user experience across all new features.
- **Accessibility Features:** Enhance accessibility (ARIA attributes, keyboard navigation, etc.) across the application, especially for new interactive components.
- **Testing:** Continue to develop and expand automated tests for new features, edge cases, error handling, and PWA functionalities. Keep tests in sync with the codebase.
- **Performance Optimization:** Further optimize media loading and overall application performance, particularly with the increased content and dynamic elements.

## Known Issues

- The application might not immediately show the latest version due to browser caching of the service worker, even with the new update prompt. Users may still need to manually clear site data or perform a hard refresh if the prompt doesn't appear or is dismissed.
- Some placeholder content still exists and needs to be replaced with actual educational material.
- The "Coming Soon" pages need to be fully developed.

## Evolution of Project Decisions

- The decision to use a PWA-first approach was made early and has been consistently reinforced, leading to the implementation of advanced offline features.
- The modular design has proven highly effective for integrating diverse and expanding educational content.
- The preference for vanilla JavaScript has been maintained, but the complexity of the application has led to more structured JavaScript patterns and global state management.
- The project has embraced a more interactive and user-centric design, incorporating features like the "My Learning" page and dynamic TOCs to enhance the learning experience.

## What's Left to Build

- **Security Testing:** Thoroughly test all implemented security measures and ensure they are correctly configured for production environments (e.g., strong `SESSION_SECRET`).
- **Full Content Population:** Ensure all educational modules are fully populated with comprehensive content (text, images, videos, quizzes).
- **Interactive Elements:** Refine all interactive elements within quizzes and case studies for a more engaging user experience.
- **Robust Error Handling:** Implement client-side error handling for a smoother user experience across all new features.
- **Accessibility Features:** Enhance accessibility (ARIA attributes, keyboard navigation, etc.) across the application, especially for new interactive components.
- **Testing:** Continue to develop and expand automated tests for new features, edge cases, error handling, and PWA functionalities. Keep tests in sync with the codebase.
- **Performance Optimization:** Further optimize media loading and overall application performance, particularly with the increased content and dynamic elements.

## Known Issues

- The application might not immediately show the latest version due to browser caching of the service worker, even with the new update prompt. Users may still need to manually clear site data or perform a hard refresh if the prompt doesn't appear or is dismissed.
- Some placeholder content still exists and needs to be replaced with actual educational material.
- The "Coming Soon" pages need to be fully developed.

## Evolution of Project Decisions

- The decision to use a PWA-first approach was made early and has been consistently reinforced, leading to the implementation of advanced offline features.
- The modular design has proven highly effective for integrating diverse and expanding educational content.
- The preference for vanilla JavaScript has been maintained, but the complexity of the application has led to more structured JavaScript patterns and global state management.
- The project has embraced a more interactive and user-centric design, incorporating features like the "My Learning" page and dynamic TOCs to enhance the learning experience.
