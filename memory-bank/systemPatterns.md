# System Patterns

## System Architecture

The Arclight application is structured as a client-side web application, primarily using HTML, CSS, and JavaScript. It leverages a service worker for Progressive Web App (PWA) capabilities, enabling offline access and improved performance. The content is organized into distinct modules, each residing in its own directory (e.g., `AnteriorSegmentQuiz/`, `Cataract/`, `Mires/`, `Morph/`, `Squint/`).

## Key Technical Decisions

- **PWA First:** Prioritizing offline access and fast loading times through service worker implementation.
- **Modular Design:** Each educational module is self-contained, allowing for easier development, maintenance, and potential future expansion.
- **Static Content Delivery:** The application primarily serves static HTML, CSS, JavaScript, images, and videos, simplifying deployment and reducing server-side dependencies.
- **Vanilla JavaScript:** Minimal reliance on complex frameworks to keep the codebase lightweight and easily maintainable.

## Design Patterns in Use

- **Module Pattern:** Each educational section (e.g., Cataract, Squint) can be considered a module, encapsulating its own HTML, CSS, and JavaScript logic.
- **Event-Driven Architecture:** Interactions within quizzes and other dynamic elements are handled through event listeners.
- **Service Worker Caching Strategy:** Utilizing a cache-first strategy for static assets to ensure offline availability.

## Component Relationships

- **`index.html`:** The main entry point of the application, serving as the landing page and navigation hub.
- **Module Directories:** Each directory (e.g., `AnteriorSegmentQuiz/`, `Cataract/`) contains its own `index.html`, `script.js`, and `style.css` (or similar) files, representing a distinct educational component.
- **`images/` and `videos/`:** Centralized directories for multimedia assets, shared across various modules.
- **`service-worker.js`:** Manages caching and offline capabilities for the entire application.
- **`manifest.json`:** Provides metadata for PWA installation.

## Critical Implementation Paths

- **Navigation Flow:** Ensuring smooth transitions between the main `index.html` and individual module pages.
- **Offline Functionality:** Correct registration and updating of the service worker to guarantee content availability offline.
- **Quiz Logic:** Accurate implementation of question display, answer checking, and feedback mechanisms within quiz modules.
- **Media Loading:** Efficient loading and display of images and videos to prevent performance bottlenecks.
