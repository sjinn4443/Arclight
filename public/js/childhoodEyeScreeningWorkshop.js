import { loadPage } from "./navigation.js";

export function initializeChildhoodEyeScreeningWorkshop() {
  const rows = document.querySelectorAll(
    "#childhoodEyeScreeningWorkshopPage .lesson-row[data-target]",
  );

  // ✅ rows가 없으면 조용히 종료 (페이지 아직 안 붙었을 때)
  if (!rows || rows.length === 0) {
    console.warn("[workshop] no lesson rows found to wire");
    return;
  }

  rows.forEach((row) => {
    // ✅ 중복 바인딩 방지
    if (row.dataset.wired === "1") return;
    row.dataset.wired = "1";

    // (디버그) 이 row가 잡혔는지 확인
    console.warn(
      "[workshop] wiring row target=",
      row.getAttribute("data-target"),
    );

    row.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const target = row.getAttribute("data-target");
      console.warn("[workshop] clicked target =", target);
      if (!target) return;

      window.__videosPendingTarget = target;
      window.__videosSuppressFlash = true;

      sessionStorage.setItem("gotoSubPage", target);
      console.warn(
        "[workshop] gotoSubPage set =",
        sessionStorage.getItem("gotoSubPage"),
      );

      await loadPage("videos");
    });
  });

  // coming-soon wiring도 initialise 안으로 넣는 게 안전함
  document
    .querySelectorAll("#childhoodEyeScreeningWorkshopPage .coming-soon")
    .forEach((row) => {
      if (row.dataset.wiredComingSoon === "1") return;
      row.dataset.wiredComingSoon = "1";
      row.addEventListener("click", () => alert("Coming soon."));
    });
}
