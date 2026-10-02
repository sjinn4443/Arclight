export function registerServiceWorker() {
  if (
    !("serviceWorker" in navigator) ||
    !/^https?:$/.test(window.location.protocol)
  )
    return;
  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {
        // Offline support is progressive enhancement; the simulator remains usable.
      });
    },
    { once: true },
  );
}
