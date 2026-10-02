(function registerFieldsServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (
    window.location.protocol !== "http:" &&
    window.location.protocol !== "https:"
  )
    return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js?v=20260722-3")
      .catch(() => {
        // The assessment remains usable if installation is unavailable.
      });
  });
})();
