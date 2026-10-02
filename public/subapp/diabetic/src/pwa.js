export function canRegisterServiceWorker(
  location = window.location,
  navigatorObject = navigator,
) {
  return (
    "serviceWorker" in navigatorObject &&
    (location.protocol === "http:" || location.protocol === "https:")
  );
}

export function registerServiceWorker() {
  if (!canRegisterServiceWorker()) return;
  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker
        .register("./sw.js", { scope: "./" })
        .catch((error) => {
          console.warn("Diabetic offline support could not start.", error);
        });
    },
    { once: true },
  );
}
