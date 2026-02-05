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

function setupVisualFieldsSubfolder(page) {
  const row = page.querySelector(
    '.glaucoma-subfolder-row[data-subfolder="visualFields"]',
  );
  if (!row) return;

  const card = page.querySelector(
    '.glaucoma-subsection-card[data-subsection="visualFields"]',
  );
  if (!card) return;

  // 중복 바인딩 방지
  if (row.dataset.wired === "1") return;
  row.dataset.wired = "1";

  const closeExisting = () => {
    // 카드 숨김
    card.style.display = "none";

    // h3에 붙인 Close 제거
    const titleEl = card.querySelector("h3");
    if (titleEl) {
      const existingToggle = titleEl.querySelector(".see-all-toggle");
      if (existingToggle) existingToggle.remove();
    }

    // ✅ 하위 카드를 원래 자리(anchor)로 되돌리기
    const anchor = page.querySelector("#visualFieldsSubsectionAnchor");
    if (anchor) {
      anchor.insertAdjacentElement("afterend", card);
    }

    // 폴더 row 복귀
    row.style.display = "";
  };

  const openNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 혹시 이미 열려있으면 먼저 정리
    closeExisting();

    // 폴더 row 숨김
    row.style.display = "none";

    // 카드 위치: anchor 바로 다음 (닫힐 때도 이 위치로 복귀)
    const anchor = page.querySelector("#visualFieldsSubsectionAnchor");
    if (anchor) {
      anchor.insertAdjacentElement("afterend", card);
    } else {
      row.insertAdjacentElement("afterend", card);
    }
    card.style.display = "";

    const titleEl = card.querySelector("h3");
    if (!titleEl) return;

    titleEl.style.display = "flex";
    titleEl.style.alignItems = "center";
    titleEl.style.width = "100%";

    const toggle = document.createElement("span");
    toggle.className = "see-all-toggle";
    toggle.setAttribute("role", "button");
    toggle.setAttribute("tabindex", "0");
    toggle.setAttribute("aria-expanded", "true");
    toggle.textContent = "Close ^";

    toggle.style.marginLeft = "auto";
    toggle.style.marginRight = "15px";
    toggle.style.whiteSpace = "nowrap";

    const closeNow = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      closeExisting();
    };

    toggle.addEventListener("click", closeNow);
    toggle.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") closeNow(ev);
    });

    titleEl.appendChild(toggle);
  };

  row.addEventListener("click", openNow);
  row.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") openNow(e);
  });
}

function setupAtomsPanZoom(viewerEl, stageEl) {
  let scale = 1;
  let tx = 0;
  let ty = 0;

  function apply() {
    stageEl.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  function clampScale(next) {
    return Math.max(0.6, Math.min(6, next));
  }

  // wheel zoom (desktop)
  viewerEl.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();

      const rect = viewerEl.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      const prev = scale;
      const next = clampScale(prev * (e.deltaY > 0 ? 0.9 : 1.1));
      if (next === prev) return;

      const k = next / prev;
      tx = cx - k * (cx - tx);
      ty = cy - k * (cy - ty);
      scale = next;
      apply();
    },
    { passive: false },
  );

  // pointer pan + pinch (mobile)
  const pointers = new Map();
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  let panStart = null;
  let pinchStart = null;

  viewerEl.addEventListener("pointerdown", (e) => {
    viewerEl.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 1) {
      panStart = { x: e.clientX, y: e.clientY, tx, ty };
      pinchStart = null;
    } else if (pointers.size === 2) {
      const [p1, p2] = [...pointers.values()];
      pinchStart = { d: dist(p1, p2), scale };
      panStart = null;
    }
  });

  viewerEl.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 1 && panStart) {
      const p = [...pointers.values()][0];
      tx = panStart.tx + (p.x - panStart.x);
      ty = panStart.ty + (p.y - panStart.y);
      apply();
    }

    if (pointers.size === 2 && pinchStart) {
      const [p1, p2] = [...pointers.values()];
      const d = dist(p1, p2);

      const rect = viewerEl.getBoundingClientRect();
      const mid = {
        x: (p1.x + p2.x) / 2 - rect.left,
        y: (p1.y + p2.y) / 2 - rect.top,
      };

      const prev = scale;
      const next = clampScale(pinchStart.scale * (d / pinchStart.d));
      if (next === prev) return;

      const k = next / prev;
      tx = mid.x - k * (mid.x - tx);
      ty = mid.y - k * (mid.y - ty);
      scale = next;
      apply();
    }
  });

  function clearPointer(e) {
    pointers.delete(e.pointerId);
    if (pointers.size === 0) {
      panStart = null;
      pinchStart = null;
    }
  }

  viewerEl.addEventListener("pointerup", clearPointer);
  viewerEl.addEventListener("pointercancel", clearPointer);

  viewerEl.style.touchAction = "none";
  stageEl.style.transformOrigin = "0 0";

  apply();
}

function initGlaucomaSummaryAtomsPage(pageId, viewerId, imgSrc) {
  const page = document.getElementById(pageId);
  const viewer = document.getElementById(viewerId);

  if (!page || !viewer) return;
  if (viewer.dataset.inited === "1") return;

  viewer.style.position = "fixed";
  viewer.style.top = "50px";
  viewer.style.left = "0";
  viewer.style.right = "0";
  viewer.style.bottom = "0";
  viewer.style.overflow = "hidden";

  viewer.innerHTML = `
    <div class="atoms-handout-container" style="
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      touch-action: none;
    ">
      <div class="atoms-handout-stage" style="
        width: 100%;
        height: 100%;
        transform-origin: 0 0;
      ">
        <img src="${imgSrc}" alt="ATOMS handout image" style="
          display: block;
          max-width: 100%;
          height: auto;
          margin: 0 auto;
        " />
      </div>
    </div>
  `;

  const stage = viewer.querySelector(".atoms-handout-stage");
  if (!stage) return;

  setupAtomsPanZoom(viewer, stage);

  viewer.dataset.inited = "1";
}

function initGlaucomaSummaryAtomsPages() {
  initGlaucomaSummaryAtomsPage(
    "glaucomaFundusSummaryAtomsPage",
    "glaucomaFundusSummaryAtomsViewer",
    "/images/pdf/Workshop/Glaucoma/07Summary/Atoms/01.png",
  );

  initGlaucomaSummaryAtomsPage(
    "glaucomaGlaucomaSummaryAtomsPage",
    "glaucomaGlaucomaSummaryAtomsViewer",
    "/images/pdf/Workshop/Glaucoma/07Summary/Atoms/02.png",
  );
}

export function initializeGlaucomaWorkshop() {
  const page = document.getElementById("glaucomaWorkshopPage");
  if (!page) return;

  setupWorkshopFolders(page);
  setupVisualFieldsSubfolder(page);
  initGlaucomaSummaryAtomsPages();

  const rows = page.querySelectorAll(".lesson-row[data-target]");
  rows.forEach((row) => {
    if (row.dataset.wired === "1") return;
    row.dataset.wired = "1";

    const activate = async (event) => {
      event.preventDefault();

      const targetRaw = row.getAttribute("data-target");
      if (!targetRaw) return;

      // ✅ Glaucoma intro image scroll pages
      const DIRECT_ROUTES = {
        glaucomaWhatIs: "glaucomaScrollImages",
        glaucomaTypes: "glaucomaScrollImages",
        glaucomaDiagnosis: "glaucomaScrollImages",
        glaucomaIntro: "glaucomaScrollImages",
        glaucomaPOAGACAG: "glaucomaScrollImages",
        glaucomaVisionIntro: "glaucomaScrollImages",
        glaucomaTestingVisualAcuity: "glaucomaScrollImages",

        glaucomaFieldsIntro: "glaucomaScrollImages",
        glaucomaFieldsExam: "glaucomaScrollImages",
        glaucomaQuadrantsFingers: "glaucomaScrollImages",
        glaucomaQuadrantsRed: "glaucomaScrollImages",
        glaucomaAssessRecord: "glaucomaScrollImages",

        glaucomaPupilReactions: "glaucomaScrollImages",
        glaucomaSwingRAPD: "glaucomaScrollImages",

        frontOfEyePage: "glaucomaScrollImages",
        glaucomaFrontFindings: "glaucomaScrollImages",
        glaucomaACDScroll: "glaucomaScrollImages",
        glaucomaHighIOP: "glaucomaScrollImages",

        fundalReflexPage: "glaucomaScrollImages",
        glaucomaOpticNerve: "glaucomaScrollImages",
        glaucomaCupping: "glaucomaScrollImages",

        glaucomaSummaryScrolly: "glaucomaScrollImages",
        glaucomaFundusSummaryAtomsPage: "glaucomaWorkshop",
        glaucomaGlaucomaSummaryAtomsPage: "glaucomaWorkshop",
      };
      if (DIRECT_ROUTES[targetRaw]) {
        const route = DIRECT_ROUTES[targetRaw];
        await loadPage(route);

        // ✅ route 로드 후 항상 showPage 시도 (el 체크로 막지 않음)
        if (typeof window.showPage === "function") {
          window.showPage(targetRaw);
        } else {
          document
            .querySelectorAll(".page")
            .forEach((p) => (p.style.display = "none"));
          const el = document.getElementById(targetRaw);
          if (el) el.style.display = "block";
        }

        // ✅ 디버그: target id가 실제로 로드된 DOM에 있는지 확인
        const elAfter = document.getElementById(targetRaw);
        if (!elAfter) {
          console.warn(
            "[glaucomaWorkshop] Scroll target not found in loaded route:",
            { route, targetRaw },
          );
        }

        try {
          window.scrollTo(0, 0);
        } catch {}
        return;
      }

      // 1) 라우트 키가 직접 존재하면 그대로 로드
      if (ROUTES[targetRaw]) {
        await loadPage(targetRaw);
        return;
      }

      // 2) videos 서브페이지로 이동
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

      console.warn("[glaucomaWorkshop] Unhandled target:", targetRaw);
    };

    row.addEventListener("click", activate);
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") activate(e);
    });
  });
}
