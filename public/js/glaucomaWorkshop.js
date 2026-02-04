import { loadPage } from "./navigation.js";
import { ROUTES } from "./config.js";

// videos.html 내 섹션 id로 정규화 (childhood workshop 방식 참고) :contentReference[oaicite:4]{index=4}
function normaliseVideosSubpageId(raw) {
  if (!raw) return null;
  let t = String(raw).trim();
  if (!t) return null;

  if (t.startsWith("#")) t = t.slice(1);

  const ALIASES = {
    visualAcuity: "visualAcuityPage",
    vaNearVision: "vaNearVisionPage",
    pupils: "pupilsPage",
    pupilExamPEC: "pupilExamPECPage",
    rapdTestVideo: "rapdTestVideoPage",
    frontOfEye: "frontOfEyePage",
    fundalReflex: "fundalReflexPage",
    opticNerveDisease: "opticNerveDiseasePage",
  };

  if (ALIASES[t]) return ALIASES[t];
  if (t.endsWith("Page")) return t;

  // 기본: "xxx" -> "xxxPage"
  return `${t}Page`;
}

function setupWorkshopSeeAllToggles(page) {
  const cards = page.querySelectorAll(".pupil-card.module-card");

  cards.forEach((card) => {
    const titleEl = card.querySelector("h3");
    if (!titleEl) return;

    // 이 카드 안의 모든 lesson-row를 한 그룹으로 처리
    const groupRows = Array.from(card.querySelectorAll(".lesson-row"));

    // "2개 초과면 접기" => 3개 이상일 때만 토글
    if (groupRows.length <= 2) return;

    // 이미 붙어있으면 중복 방지
    if (titleEl.querySelector(".see-all-toggle")) return;

    // 기본 상태: 2개만 보여주고 나머지는 숨김
    groupRows.slice(2).forEach((row) => {
      row.setAttribute("data-collapsible-hidden", "true");
    });

    const toggle = document.createElement("span");
    toggle.className = "see-all-toggle";
    toggle.setAttribute("role", "button");
    toggle.setAttribute("tabindex", "0");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "See all >";

    const open = () => {
      groupRows.forEach((row) =>
        row.removeAttribute("data-collapsible-hidden"),
      );
      toggle.textContent = "Close ^";
      toggle.setAttribute("aria-expanded", "true");
    };

    const close = () => {
      groupRows.slice(2).forEach((row) => {
        row.setAttribute("data-collapsible-hidden", "true");
      });
      toggle.textContent = "See all >";
      toggle.setAttribute("aria-expanded", "false");
    };

    const toggleNow = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) close();
      else open();
    };

    toggle.addEventListener("click", toggleNow);
    toggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") toggleNow(e);
    });

    // h3를 한 줄짜리 flex 헤더로 만들고, toggle을 오른쪽 끝으로 보냄
    titleEl.style.display = "flex";
    titleEl.style.alignItems = "center";
    titleEl.style.width = "100%";

    // toggle이 CSS의 margin-left:12vw 영향을 받지 않도록 inline으로 덮어쓰기
    toggle.style.marginLeft = "auto";
    toggle.style.marginRight = "15px";
    toggle.style.whiteSpace = "nowrap";

    // h3 오른쪽에 붙이기 (History   See all >)
    // h3가 이미 flex로 바뀌어 있어야 오른쪽 정렬됨 (HTML에서 h3를 flex로 교체)
    titleEl.appendChild(toggle);
  });
}

export function initializeGlaucomaWorkshop() {
  const page = document.getElementById("glaucomaWorkshopPage");
  if (!page) return;

  setupWorkshopSeeAllToggles(page);

  const rows = page.querySelectorAll(".lesson-row[data-target]");
  rows.forEach((row) => {
    if (row.dataset.wired === "1") return;
    row.dataset.wired = "1";

    const activate = async (event) => {
      event.preventDefault();

      const targetRaw = row.getAttribute("data-target");
      if (!targetRaw) return;

      // 1) 라우트 키가 직접 존재하면 그대로 로드
      if (ROUTES[targetRaw]) {
        await loadPage(targetRaw);
        return;
      }

      // 2) videos 서브페이지로 이동(Childhood 방식과 동일한 UX)
      const videoSectionId = normaliseVideosSubpageId(targetRaw);
      if (videoSectionId) {
        await loadPage("videos");
        try {
          sessionStorage.setItem("videos:goto", videoSectionId);
        } catch {}
        try {
          window.location.hash = `#${videoSectionId}`;
        } catch {}
        return;
      }

      // 3) 아직 매핑이 없으면 조용히 무시(스타일/UX 깨지지 않게)
      console.warn("[glaucomaWorkshop] Unhandled target:", targetRaw);
    };

    row.addEventListener("click", activate);
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") activate(e);
    });
  });
}
