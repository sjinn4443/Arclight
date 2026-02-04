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

function setupWorkshopFolders(page) {
  const folders = page.querySelectorAll(
    "#glaucomaWorkshopFolders .glaucoma-folder-row",
  );
  const sectionCards = page.querySelectorAll(".glaucoma-section-card");

  const foldersContainer = page.querySelector("#glaucomaWorkshopFolders");
  if (!foldersContainer) return;

  const hideAllSectionCards = () => {
    sectionCards.forEach((card) => {
      card.style.display = "none";

      const titleEl = card.querySelector("h3");
      if (!titleEl) return;

      const existingToggle = titleEl.querySelector(".see-all-toggle");
      if (existingToggle) existingToggle.remove();
    });
  };

  const showSectionByKey = (key) => {
    const card = page.querySelector(
      `.glaucoma-section-card[data-section="${key}"]`,
    );
    if (!card) return;

    const openFolderRow = page.querySelector(
      `#glaucomaWorkshopFolders .glaucoma-folder-row[data-folder="${key}"]`,
    );
    if (!openFolderRow) return;

    // 다른 섹션이 열려있으면 먼저 닫기 (폴더들은 그대로 유지)
    hideAllSectionCards();
    folders.forEach((r) => (r.style.display = ""));

    // 클릭한 폴더 버튼 1개만 없어짐
    openFolderRow.style.display = "none";

    // 섹션 카드를 "그 자리"에 나오게 하기: 폴더 row 바로 다음에 배치
    openFolderRow.insertAdjacentElement("afterend", card);
    card.style.display = "";

    // h3 오른쪽에 Close를 붙이기
    const titleEl = card.querySelector("h3");
    if (!titleEl) return;

    // h3를 한 줄짜리 flex 헤더로 만들고, Close를 오른쪽으로 보냄
    titleEl.style.display = "flex";
    titleEl.style.alignItems = "center";
    titleEl.style.width = "100%";

    const toggle = document.createElement("span");
    toggle.className = "see-all-toggle";
    toggle.setAttribute("role", "button");
    toggle.setAttribute("tabindex", "0");
    toggle.setAttribute("aria-expanded", "true");
    toggle.textContent = "Close ^";

    // 오른쪽 위치 고정(지금까지 너가 맞춘 값 유지)
    toggle.style.marginLeft = "auto";
    toggle.style.marginRight = "15px";
    toggle.style.whiteSpace = "nowrap";

    const closeNow = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // 섹션 카드 숨기기
      card.style.display = "none";

      // h3에 붙인 Close 제거
      const existingToggle = titleEl.querySelector(".see-all-toggle");
      if (existingToggle) existingToggle.remove();

      // 폴더 버튼 복귀
      openFolderRow.style.display = "";
    };

    toggle.addEventListener("click", closeNow);
    toggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") closeNow(e);
    });

    titleEl.appendChild(toggle);
  };

  hideAllSectionCards();
  folders.forEach((r) => (r.style.display = ""));
  foldersContainer.style.display = "";

  folders.forEach((row) => {
    if (row.dataset.wired === "1") return;
    row.dataset.wired = "1";

    const key = row.getAttribute("data-folder");
    if (!key) return;

    const openNow = (e) => {
      e.preventDefault();
      e.stopPropagation();
      showSectionByKey(key);
    };

    row.addEventListener("click", openNow);
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openNow(e);
    });
  });
}

export function initializeGlaucomaWorkshop() {
  const page = document.getElementById("glaucomaWorkshopPage");
  if (!page) return;

  setupWorkshopFolders(page);

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
