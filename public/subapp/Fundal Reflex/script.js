import { initApp } from "./src/app.js?v=20260502-1";

function startApp() {
  initApp();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp, { once: true });
} else {
  startApp();
}
