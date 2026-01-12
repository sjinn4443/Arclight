// public/js/casestudy.js
export function initializeCaseStudy() {
  const root = document.getElementById("casestudyPage");
  if (!root) return;

  const onCaseStudyClick = (level) => {
    // 다음 단계에서 여기서 "채팅 UI" 열면 됨
    console.warn(`[casestudy] Case study clicked (${level}) (placeholder)`);
  };

  root.querySelectorAll(".lesson-row--quiz").forEach((row) => {
    const level = row.getAttribute("data-level") || "unknown";

    row.addEventListener("click", () => onCaseStudyClick(level));
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onCaseStudyClick(level);
      }
    });
  });

  // 카드 전체를 눌러도 동작하게 (선택사항)
  ["caseStudyPrimaryCard", "caseStudyIntermediateCard"].forEach((id) => {
    const card = root.querySelector(`#${id}`);
    if (!card) return;
    card.addEventListener("click", () =>
      onCaseStudyClick(id.includes("Primary") ? "primary" : "intermediate"),
    );
  });
}
