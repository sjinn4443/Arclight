(function () {
  if (location.hostname === "localhost" && "serviceWorker" in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      })
      .catch(() => {});
  }

  if (location.hostname === "localhost") return;

  var sentryDsn = String(window.__ARCLIGHT_SENTRY_DSN__ || "").trim();
  var sentryBundleUrl = String(
    window.__ARCLIGHT_SENTRY_BUNDLE_URL__ || "",
  ).trim();

  // Monitoring is opt-in so browsers with blocked third-party scripts
  // do not emit noisy failed-network entries by default.
  if (!sentryDsn || !sentryBundleUrl) return;

  var scriptEl = document.createElement("script");
  scriptEl.src = sentryBundleUrl;
  scriptEl.crossOrigin = "anonymous";
  scriptEl.onload = function () {
    try {
      if (!window.Sentry || typeof window.Sentry.init !== "function") return;
      window.Sentry.init({
        dsn: sentryDsn,
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      });
    } catch (_) {}
  };

  document.head.appendChild(scriptEl);
})();
