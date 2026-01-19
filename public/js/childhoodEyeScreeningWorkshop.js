// public/js/childhoodEyeScreeningWorkshop.js
import { loadPage } from "./navigation.js";

export function initializeChildhoodEyeScreeningWorkshop() {
  const rows = document.querySelectorAll(
    "#childhoodEyeScreeningWorkshopPage .lesson-row[data-target]",
  );

  rows.forEach((row) => {
    row.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") {
        e.stopImmediatePropagation();
      }

      const target = row.getAttribute("data-target");
      if (!target) return;

      try {
        window.__videosPendingTarget = target;
        window.__videosSuppressFlash = true;

        sessionStorage.setItem("gotoSubPage", target);
      } catch {}

      // 4) videos route로 이동
      await loadPage("videos");
    });
  });

  document
    .querySelectorAll("#childhoodEyeScreeningWorkshopPage .coming-soon")
    .forEach((row) => {
      row.addEventListener("click", () => {
        alert("Coming soon.");
      });
    });
}
