import { initApp } from "./src/app.js?v=20260725-logic1";

function startApp() {
  initApp();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp, { once: true });
} else {
  startApp();
}
