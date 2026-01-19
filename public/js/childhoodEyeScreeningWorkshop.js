function initializeChildhoodEyeScreeningWorkshop() {
  const rows = document.querySelectorAll(
    "#childhoodEyeScreeningWorkshopPage .lesson-row.video",
  );

  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const target = row.dataset.target;
      if (!target) return;

      window.__videosPendingTarget = target;
      window.__videosSuppressFlash = true;
      sessionStorage.gotoSubPage = target;

      loadPage("videos");

      setTimeout(() => {
        goToVideosSection(target, { skipDefault: true });
      }, 0);
    });
  });

  document.querySelectorAll(".coming-soon").forEach((row) => {
    row.addEventListener("click", () => {
      alert("Coming soon.");
    });
  });
}
