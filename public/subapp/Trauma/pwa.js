(function registerTraumaServiceWorker() {
  if (
    !("serviceWorker" in navigator) ||
    !["http:", "https:"].includes(location.protocol)
  )
    return;
  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker
        .register("./sw.js", { scope: "./" })
        .catch((error) =>
          console.warn("Trauma offline support could not start.", error),
        );
    },
    { once: true },
  );
})();
