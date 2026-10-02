export function canRegisterServiceWorker(
  location = window.location,
  navigatorObject = navigator,
) {
  return (
    "serviceWorker" in navigatorObject &&
    ["http:", "https:"].includes(location.protocol)
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
          console.warn("Glaucoma offline support could not start.", error);
        });
    },
    { once: true },
  );
}
