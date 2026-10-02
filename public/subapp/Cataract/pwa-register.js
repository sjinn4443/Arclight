(function registerCataractServiceWorker() {
  if (
    !("serviceWorker" in navigator) ||
    !/^https?:$/.test(window.location.protocol)
  ) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js?v=20260929-logic1", {
        scope: "./",
        updateViaCache: "none",
      })
      .catch(() => {
        // Direct use remains available if service-worker registration is blocked.
      });
  });
})();
