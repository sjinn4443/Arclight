(function () {
  const isLocalDevelopment =
    location.hostname === "localhost" || location.hostname === "127.0.0.1";

  // Local installs and production previews need their worker on every restart.
  // Unregistering here strands the next offline launch despite a full cache.
  if (isLocalDevelopment) return;

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
    } catch {
      // Optional monitoring must not interrupt app startup.
    }
  };

  document.head.appendChild(scriptEl);
})();
