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

  // ----------------------------
  // Persist open folder across "internal" workshop navigation only
  // ----------------------------
  const SS_OPEN_KEY = "glaucomaWorkshop:openFolderKey";
  const SS_RESTORE_FLAG = "glaucomaWorkshop:restoreOpenFolder";

  const ssGet = (k) => {
    try {
      return sessionStorage.getItem(k);
    } catch {
      return null;
    }
  };

  const ssSet = (k, v) => {
    try {
      sessionStorage.setItem(k, v);
    } catch {}
  };

  const ssRemove = (k) => {
    try {
      sessionStorage.removeItem(k);
    } catch {}
  };

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

    openFolderRow.style.display = "none";
    ssSet(SS_OPEN_KEY, key);

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
      ssRemove(SS_OPEN_KEY);
      ssRemove(SS_RESTORE_FLAG);
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

  // ✅ If we are returning from an internal workshop page, restore the open folder.
  // ✅ If we are entering the workshop from outside (dashboard/eyes/etc.), keep everything closed.
  const shouldRestore = ssGet(SS_RESTORE_FLAG) === "1";
  const savedKey = ssGet(SS_OPEN_KEY);

  if (shouldRestore && savedKey) {
    // one-shot restore
    ssRemove(SS_RESTORE_FLAG);
    showSectionByKey(savedKey);
  } else {
    // entering from outside -> forget old state
    ssRemove(SS_OPEN_KEY);
    ssRemove(SS_RESTORE_FLAG);
  }

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

      try {
        sessionStorage.setItem("glaucomaWorkshop:restoreOpenFolder", "1");
      } catch {}

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
        glaucomaRAPDFullSwingInteractive: "glaucomaScrollImages",

        frontOfEyePage: "glaucomaScrollImages",
        glaucomaFrontFindings: "glaucomaScrollImages",
        glaucomaACDScroll: "glaucomaScrollImages",
        glaucomaHighIOP: "glaucomaScrollImages",
        glaucomaACDInteractive: "glaucomaScrollImages",

        fundalReflexPage: "glaucomaScrollImages",
        glaucomaOpticNerve: "glaucomaScrollImages",
        glaucomaCupping: "glaucomaScrollImages",

        glaucomaSummaryScrolly: "glaucomaScrollImages",
        glaucomaFundusSummaryAtomsPage: "glaucomaWorkshop",
        glaucomaGlaucomaSummaryAtomsPage: "glaucomaWorkshop",
        glaucomaQuizCaseStudy: "glaucomaQuizCaseStudy",
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

        if (targetRaw === "glaucomaACDInteractive") {
          initGlaucomaACDInteractive();
        } else if (targetRaw === "glaucomaRAPDFullSwingInteractive") {
          initGlaucomaRAPDFullSwingInteractive();
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
        // ✅ videos.js initializeVideos()가 읽는 키로 전달 (gotoSubPage / __videosPendingTarget)
        try {
          sessionStorage.setItem("gotoSubPage", videoSectionId);
        } catch {}

        try {
          window.__videosPendingTarget = videoSectionId;
        } catch {}

        await loadPage("videos");
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

function initGlaucomaACDInteractive() {
  const page = document.getElementById("glaucomaACDInteractive");
  if (!page) return;

  // 중복 초기화 방지
  if (page.dataset.inited === "1") {
    // 페이지 재진입 시도 대비: 상태만 업데이트
    updateGlaucomaACDInteractive();
    return;
  }
  page.dataset.inited = "1";

  const stage = page.querySelector("#acdStage");
  const hint = page.querySelector("#acdHint");

  const flashlightOff = page.querySelector("#acdFlashlightOff");
  const bubble = page.querySelector("#acdBubble");

  const flashlightLeft = page.querySelector("#acdFlashlightLeft");
  const flashlightRight = page.querySelector("#acdFlashlightRight");
  const rightCrescent = page.querySelector("#acdCrescentRight");

  const labelLeft = page.querySelector("#acdLabelLeft");
  const labelRight = page.querySelector("#acdLabelRight");

  if (
    !stage ||
    !flashlightOff ||
    !bubble ||
    !flashlightLeft ||
    !flashlightRight ||
    !rightCrescent
  )
    return;

  const state = {
    pickedUp: false,

    // -1(왼쪽) ~ +1(오른쪽)
    nx: 0.85,
    ny: 0.0,

    dragging: false,
    pointerId: null,
  };

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function render() {
    const rect = stage.getBoundingClientRect();

    // pickup 전: off flashlight + bubble만 보이고, on flashlight는 숨김
    if (!state.pickedUp) {
      flashlightLeft.style.display = "none";
      flashlightRight.style.display = "none";

      rightCrescent.style.opacity = "0";

      if (hint) hint.style.opacity = "1";

      flashlightOff.style.display = "";
      bubble.style.display = "";
      return;
    }

    // pickup 후: off 숨김, on 2개 표시
    flashlightOff.style.display = "none";
    bubble.style.display = "none";

    flashlightLeft.style.display = "block";
    flashlightRight.style.display = "block";

    // flashlights move symmetrically around centre line
    const baseInset = rect.width * 0.06;
    const travel = rect.width * 0.2;

    let leftX = baseInset - travel * state.nx;
    let rightX = rect.width - baseInset + travel * state.nx;

    const y = rect.height * 0.52;

    // clamp inside stage bounds (use actual rendered width)
    const fw = flashlightLeft.getBoundingClientRect().width || 0;
    const half = fw / 2;

    // left flashlight must stay fully inside
    leftX = clamp(leftX, half, rect.width - half);

    // right flashlight is symmetric position around centre line
    // keep it inside too
    rightX = clamp(rightX, half, rect.width - half);

    // ✅ Crescent strength is driven by the RIGHT flashlight's pixel position.
    //    Far from the eye (more to the right) => 0
    //    As it moves left towards the eye => 0 -> 1
    const START_SHOW_RIGHT = 273; // start to appear
    const FULL_SHOW_RIGHT = 236.8; // fully visible

    const denom = START_SHOW_RIGHT - FULL_SHOW_RIGHT; // 6.667
    const strength =
      denom > 0 ? clamp((START_SHOW_RIGHT - rightX) / denom, 0, 1) : 0;

    flashlightLeft.style.left = `${leftX}px`;
    flashlightRight.style.left = `${rightX}px`;

    // crescent shadow on RIGHT eye only
    rightCrescent.style.opacity = `${strength}`;

    // ✅ Show labels ONLY when fully visible
    if (strength >= 1) {
      if (labelLeft) labelLeft.style.opacity = "1";
      if (labelRight) labelRight.style.opacity = "1";
    } else {
      if (labelLeft) labelLeft.style.opacity = "0";
      if (labelRight) labelRight.style.opacity = "0";
    }

    // hint fades as strength increases
    if (hint) hint.style.opacity = `${1 - strength}`;
  }

  function pointerToNormalised(e) {
    const stage = page.querySelector("#acdStage");
    const r = stage.getBoundingClientRect();

    // 화면에서 stage의 중앙 기준으로 -1~+1
    const cx = r.left + r.width / 2;
    const nx = clamp((e.clientX - cx) / (r.width * 0.45), -1, 1);

    // 수평빔 컨셉이라 y는 “효과 약화”만 아주 살짝 반영 가능하지만, 지금은 0 고정에 가깝게 둠
    return { nx, ny: 0 };
  }

  function pickUpFlashlight() {
    if (state.pickedUp) return;

    // pick up 시점에는 중앙(효과 거의 0)에서 시작해서
    // 사용자가 옆으로 옮길 때부터 crescent가 생기게 한다
    state.nx = 0;
    state.ny = 0;

    state.pickedUp = true;
    render();
  }

  function onDown(e) {
    // pickup: clicking or dragging the OFF flashlight activates the experience
    if (!state.pickedUp) {
      if (e.target === flashlightOff) {
        pickUpFlashlight();
        state.dragging = true;
        state.pointerId = e.pointerId;
        e.target.setPointerCapture(e.pointerId);
      }
      return;
    }

    // after pickup: drag the ON flashlights
    if (e.target !== flashlightLeft && e.target !== flashlightRight) return;

    state.dragging = true;
    state.pointerId = e.pointerId;
    e.target.setPointerCapture(e.pointerId);

    const p = pointerToNormalised(e);
    state.nx = p.nx;
    state.ny = p.ny;
    render();
  }

  function onMove(e) {
    if (!state.dragging) return;
    if (state.pointerId !== e.pointerId) return;

    const p = pointerToNormalised(e);
    state.nx = p.nx;
    state.ny = p.ny;
    render();
  }

  function onUp(e) {
    if (state.pointerId !== e.pointerId) return;
    state.dragging = false;
    state.pointerId = null;
    render();
  }

  [flashlightOff, flashlightLeft, flashlightRight].forEach((el) => {
    el.style.touchAction = "none";
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
  });

  // 리사이즈 시 재렌더
  window.addEventListener("resize", render);

  // 초기 상태
  render();
}

// 재진입 시(이미 init 된 경우) 위치만 업데이트
function updateGlaucomaACDInteractive() {
  const page = document.getElementById("glaucomaACDInteractive");
  if (!page) return;
  const rightCrescent = page.querySelector("#acdCrescentRight");
  if (rightCrescent && rightCrescent.style.opacity === "")
    rightCrescent.style.opacity = "0";
}

function initGlaucomaRAPDFullSwingInteractive() {
  const page = document.getElementById("glaucomaRAPDFullSwingInteractive");
  if (!page) return;

  // prevent double init
  if (page.dataset.inited === "1") {
    updateGlaucomaRAPDFullSwingInteractive();
    return;
  }
  page.dataset.inited = "1";

  const stage = page.querySelector("#rapdStage");
  const hint = page.querySelector("#rapdHint");

  const flashlightOff = page.querySelector("#rapdFlashlightOff");
  const flashlight = page.querySelector("#rapdFlashlight");
  const beam = page.querySelector("#rapdBeam");
  const bubble = page.querySelector("#rapdBubble");

  const pupilLeft = page.querySelector("#rapdPupilLeft");
  const pupilRight = page.querySelector("#rapdPupilRight");

  const toggle = page.querySelector("#rapdModeToggle");
  const toggleLabel = page.querySelector("#rapdModeLabel");

  // 기본 진입은 Normal(=RAPD OFF)로 강제
  if (toggle) toggle.checked = false;
  if (toggleLabel) toggleLabel.textContent = "RAPD mode OFF";

  if (
    !stage ||
    !flashlightOff ||
    !flashlight ||
    !beam ||
    !pupilLeft ||
    !pupilRight
  )
    return;

  const state = {
    pickedUp: false,
    dragging: false,
    pointerId: null,

    // -1(left) ~ +1(right)
    nx: 0,

    // -1(up) ~ +1(down)
    ny: 0,

    // for RAPD “paradoxical dilation” when swinging to the RAPD eye (right)
    lastSide: "centre", // "left" | "right" | "centre"
  };

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function getSide(nx) {
    if (nx < -0.25) return "left";
    if (nx > 0.25) return "right";
    return "centre";
  }

  function setPupilScale(el, s) {
    el.style.transform = `translate(-50%, -50%) scale(${s})`;
  }

  function render() {
    const rect = stage.getBoundingClientRect();

    // before pickup: show only “off” + bubble
    if (!state.pickedUp) {
      flashlight.style.display = "none";
      beam.style.display = "none";
      flashlightOff.style.display = "";
      if (bubble) bubble.style.display = "";
      if (hint) hint.style.opacity = "1";

      // baseline pupils (dark: dilated)
      setPupilScale(pupilLeft, 0.9);
      setPupilScale(pupilRight, 0.9);
      return;
    }

    // after pickup
    flashlightOff.style.display = "none";
    if (bubble) bubble.style.display = "none";
    flashlight.style.display = "block";
    beam.style.display = "block";
    if (hint) hint.style.opacity = "0";

    // map nx to stage x
    const cx = rect.width / 2;
    const travel = rect.width * 0.38;
    const x = cx + travel * state.nx;

    // keep within stage
    const xClamped = clamp(x, 24, rect.width - 24);

    // y now moves too: dragging down reduces light reaching the eyes
    const baseY = rect.height * 0.54;
    const y = clamp(
      baseY + rect.height * 0.22 * state.ny,
      24,
      rect.height - 24,
    );

    flashlight.style.left = `${xClamped}px`;
    flashlight.style.top = `${y}px`;

    // BEAM behaviour:
    const side = getSide(state.nx);

    // light is ON only when the flashlight is within the eye-height band
    const lightOn = y >= rect.height * 0.4 && y < rect.height * 0.66;

    const beamX = xClamped - 6; // slight offset towards torch head
    const beamY = y - 50;

    beam.style.left = `${beamX}px`;
    beam.style.top = `${beamY}px`;

    if (side === "centre") {
      beam.style.width = `${rect.width * 0.42}px`;
      beam.style.height = `${rect.height * 0.22}px`;
      beam.style.transform = `translate(0, -50%) rotate(0deg)`;
      beam.style.opacity = "0.9";
    } else if (side === "left") {
      beam.style.width = `${rect.width * 0.6}px`;
      beam.style.height = `${rect.height * 0.18}px`;
      // beam goes to the right
      beam.style.transform = `translate(0, -50%) rotate(0deg)`;
      beam.style.opacity = "0.95";
    } else {
      beam.style.width = `${rect.width * 0.6}px`;
      beam.style.height = `${rect.height * 0.18}px`;
      // beam goes to the left
      beam.style.transform = `translate(0, -50%) rotate(180deg)`;
      beam.style.opacity = "0.95";
    }

    // PUPIL LOGIC
    const rapdOn = !!(toggle && toggle.checked);

    if (toggleLabel) {
      toggleLabel.textContent = rapdOn ? "RAPD mode ON" : "RAPD mode OFF";
    }

    // sizes
    const CONSTRICT = 0.62;
    const DILATE = 0.9;

    // LIGHT OFF (flashlight dragged down) -> both dilate (normal + RAPD)
    if (!lightOn) {
      setPupilScale(pupilLeft, DILATE);
      setPupilScale(pupilRight, DILATE);
    } else {
      // LIGHT ON (eyes receive light)
      if (!rapdOn) {
        // NORMAL -> both constrict
        setPupilScale(pupilLeft, CONSTRICT);
        setPupilScale(pupilRight, CONSTRICT);
      } else {
        // RAPD MODE -> left constrict, right dilate
        setPupilScale(pupilLeft, CONSTRICT);
        setPupilScale(pupilRight, DILATE);
      }
    }

    state.lastSide = side;
  }

  function pointerToNormalised(e) {
    const r = stage.getBoundingClientRect();

    const cx = r.left + r.width / 2;
    const nx = clamp((e.clientX - cx) / (r.width * 0.45), -1, 1);

    // 기준점을 eyes 이미지 중심(대략 52%) 근처로 두고, 아래로 내릴수록 ny가 +가 되게
    const cy = r.top + r.height * 0.54;
    const ny = clamp((e.clientY - cy) / (r.height * 0.35), -1, 1);

    return { nx, ny };
  }

  function pickUpFlashlight() {
    if (state.pickedUp) return;
    state.nx = 0;
    state.ny = 0;
    state.pickedUp = true;
    render();
  }

  function onDown(e) {
    if (!state.pickedUp) {
      if (e.target === flashlightOff) {
        pickUpFlashlight();
        state.dragging = true;
        state.pointerId = e.pointerId;
        e.target.setPointerCapture(e.pointerId);
      }
      return;
    }

    if (e.target !== flashlight) return;

    state.dragging = true;
    state.pointerId = e.pointerId;
    e.target.setPointerCapture(e.pointerId);

    const p = pointerToNormalised(e);
    state.nx = p.nx;
    state.ny = p.ny;
    render();
  }

  function onMove(e) {
    if (!state.dragging) return;
    if (state.pointerId !== e.pointerId) return;
    const p = pointerToNormalised(e);
    state.nx = p.nx;
    state.ny = p.ny;
    render();
  }

  function onUp(e) {
    if (state.pointerId !== e.pointerId) return;
    state.dragging = false;
    state.pointerId = null;
    render();
  }

  [flashlightOff, flashlight].forEach((el) => {
    el.style.touchAction = "none";
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
  });

  if (toggle) {
    toggle.addEventListener("change", render);
  }

  window.addEventListener("resize", render);

  render();
}

function updateGlaucomaRAPDFullSwingInteractive() {
  const page = document.getElementById("glaucomaRAPDFullSwingInteractive");
  if (!page) return;
  // simplest: just re-render by calling init guard pattern
  // (we keep it minimal and safe)
  const stage = page.querySelector("#rapdStage");
  if (!stage) return;
  // trigger a resize-like refresh
  try {
    window.dispatchEvent(new Event("resize"));
  } catch {}
}
