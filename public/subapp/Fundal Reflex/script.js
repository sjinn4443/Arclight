import { initApp } from "./src/app.js?v=20260502-1";
import { initSessionReset } from "./src/session-reset.js?v=20260723-1";
import { registerServiceWorker } from "./src/pwa.js?v=20260723-1";

function startApp() {
  initApp();
  initSessionReset();
  registerServiceWorker();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp, { once: true });
} else {
  startApp();
}
