function initializeChildhoodEyeScreeningWorkshop() {
  const rows = document.querySelectorAll(
    "#childhoodEyeScreeningWorkshopPage .lesson-row[data-target]",
  );

  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const target = row.getAttribute("data-target");
      if (!target) return;

      // videos 라우트가 로드된 뒤 main.js가 이 값을 보고 해당 subpage를 열어줌
      try {
        sessionStorage.setItem("gotoSubPage", target);
      } catch {}

      loadPage("videos");
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
