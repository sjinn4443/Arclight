import { loadPage } from "./navigation.js";
import { ROUTES } from "./config.js";
import { showExperimentalMiniAppNoticeForPage } from "./experimentalMiniAppNotice.js";
import {
  initializeGlaucomaWorkshopProgressInfra,
  updateGlaucomaWorkshopProgressBars,
} from "./glaucomaWorkshopProgress.js";
import {
  assignGlaucomaWorkshopFlowIndices,
  initializeGlaucomaWorkshopNextFlowInfra,
  rememberGlaucomaWorkshopFlowFromRow,
} from "./glaucomaWorkshopNextFlow.js";
import {
  buildRapdTestQuestions,
  caseFromPatientSelection,
  getRapdDilationTarget,
  getRapdDirectResponseRatio,
  getRapdHippusScale,
  pickRandomRapdCase,
  internalSideToPatientSide,
  rapdCasesMatch,
  scoreRapdAnswers,
} from "./rapdCases.js";

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

function refreshWorkshopTranslations(root = document) {
  window.I18N?.applyTranslations?.(root);
}

function workshopText(path, fallback, variables = {}) {
  return window.I18N?.t?.(path, fallback, variables) ?? fallback;
}

function formatRapdAnswerForUi(rapdCase) {
  if (!rapdCase?.side) {
    return workshopText("i18nExtra.interactive_notice_no_rapd", "No RAPD");
  }

  const patientSide = internalSideToPatientSide(rapdCase.side);
  const side =
    patientSide === "left"
      ? workshopText("i18nExtra.interactive_notice_left", "Left")
      : workshopText("i18nExtra.interactive_notice_right", "Right");
  const severity = {
    1: workshopText("i18nExtra.interactive_notice_mild", "Mild"),
    2: workshopText("i18nLiteral.Moderate", "Moderate"),
    3: workshopText("i18nExtra.interactive_notice_severe", "Severe"),
  }[rapdCase.severity];

  return severity ? `${side} ${severity} RAPD` : `${side} RAPD`;
}

function moveAtomsRowsToFolderEnd(root) {
  root
    ?.querySelectorAll?.(".glaucoma-section-card, .module-card")
    ?.forEach((section) => {
      const atomRows = Array.from(section.children).filter((child) => {
        if (!child.matches?.(".lesson-row[data-target]")) return false;
        return String(child.getAttribute("data-target") || "")
          .toLowerCase()
          .includes("atoms");
      });

      atomRows.forEach((row) => section.appendChild(row));
    });
}

const GLAUCOMA_SECTION_NUMBERS = Object.freeze({
  introduction: "1.",
  history: "2.",
  vision: "3.",
  fieldsPupils: "4.",
  frontOfEye: "5.",
  backOfEye: "6.",
  summary: "7.",
  visualFields: "4.",
});

const GLAUCOMA_FOLDER_ITEM_COUNTS_ENABLED = false;

function stripLeadingStepNumber(text) {
  return String(text || "").replace(/^\s*\d+\.\s*/, "");
}

function withGlaucomaSectionNumber(key, text) {
  const prefix = GLAUCOMA_SECTION_NUMBERS[key];
  const cleaned = stripLeadingStepNumber(text);
  if (!prefix || !cleaned) return cleaned;
  return `${prefix} ${cleaned}`;
}

function getTopLevelSectionRows(sectionCard) {
  if (!sectionCard) return [];
  return Array.from(sectionCard.children).filter((child) =>
    child.classList?.contains("lesson-row"),
  );
}

function getThumbBackgroundImage(row) {
  const thumb = row?.querySelector(".thumb");
  if (!thumb) return "";

  const inlineStyle = String(thumb.getAttribute("style") || "");
  const styleBg = String(thumb.style?.backgroundImage || "");

  let computedBg = "";
  try {
    computedBg = String(window.getComputedStyle(thumb).backgroundImage || "");
  } catch {
    computedBg = "";
  }

  return `${inlineStyle} ${styleBg} ${computedBg}`.toLowerCase();
}

function inferLessonLevelFromRow(row) {
  const explicitLevel = String(row?.getAttribute("data-level") || "")
    .trim()
    .toLowerCase();
  if (explicitLevel === "primary" || explicitLevel === "intermediate") {
    return explicitLevel;
  }

  const bg = getThumbBackgroundImage(row);
  if (bg.includes("intermediate_")) return "intermediate";
  if (bg.includes("primary_")) return "primary";

  if (row?.classList?.contains("glaucoma-subfolder-row")) return "intermediate";
  return "primary";
}

function countSectionRowsByLevel(sectionCard) {
  return getTopLevelSectionRows(sectionCard).reduce(
    (acc, row) => {
      const level = inferLessonLevelFromRow(row);
      if (level === "intermediate") {
        acc.intermediate += 1;
      } else {
        acc.primary += 1;
      }
      return acc;
    },
    { primary: 0, intermediate: 0 },
  );
}

function renderFolderCountBadge(level, count) {
  const badge = document.createElement("span");
  badge.className = `glaucoma-folder-item-count glaucoma-folder-item-count--${level}`;
  badge.setAttribute("aria-hidden", "true");
  badge.textContent = String(count);
  return badge;
}

function clearGlaucomaFolderItemBadges(page) {
  page
    .querySelectorAll(
      ".glaucoma-folder-item-counts, .glaucoma-folder-item-count",
    )
    .forEach((badge) => {
      badge.remove();
    });
  page
    .querySelectorAll(
      ".glaucoma-folder-row[data-item-count], .glaucoma-folder-row[data-primary-count], .glaucoma-folder-row[data-intermediate-count]",
    )
    .forEach((row) => {
      row.removeAttribute("data-primary-count");
      row.removeAttribute("data-intermediate-count");
      row.removeAttribute("data-item-count");
    });
}

function updateGlaucomaFolderItemBadges(page) {
  if (!GLAUCOMA_FOLDER_ITEM_COUNTS_ENABLED) {
    clearGlaucomaFolderItemBadges(page);
    return;
  }

  const folderRows = page.querySelectorAll(
    "#glaucomaWorkshopFolders .glaucoma-folder-row[data-folder]",
  );

  folderRows.forEach((row) => {
    const sectionKey = row.getAttribute("data-folder");
    if (!sectionKey) return;

    const sectionCard = page.querySelector(
      `.glaucoma-section-card[data-section="${sectionKey}"]`,
    );
    const counts = countSectionRowsByLevel(sectionCard);
    const totalCount = counts.primary + counts.intermediate;

    const thumb = row.querySelector(".thumb");
    if (!thumb) return;

    let wrap = thumb.querySelector(".glaucoma-folder-item-counts");
    if (!wrap) {
      wrap = document.createElement("span");
      wrap.className = "glaucoma-folder-item-counts";
      wrap.setAttribute("aria-hidden", "true");
      thumb.appendChild(wrap);
    }

    const hasBothLevels = counts.primary > 0 && counts.intermediate > 0;
    wrap.classList.toggle("glaucoma-folder-item-counts--dual", hasBothLevels);
    while (wrap.firstChild) {
      wrap.removeChild(wrap.firstChild);
    }

    if (hasBothLevels) {
      wrap.appendChild(renderFolderCountBadge("primary", counts.primary));
      wrap.appendChild(
        renderFolderCountBadge("intermediate", counts.intermediate),
      );
    } else if (totalCount > 0) {
      const singleLevel = counts.intermediate > 0 ? "intermediate" : "primary";
      wrap.appendChild(renderFolderCountBadge(singleLevel, totalCount));
    }

    row.setAttribute("data-primary-count", String(counts.primary));
    row.setAttribute("data-intermediate-count", String(counts.intermediate));
    row.setAttribute("data-item-count", String(totalCount));
  });
}

function setupWorkshopFolders(page) {
  const folders = page.querySelectorAll(
    "#glaucomaWorkshopFolders .glaucoma-folder-row",
  );
  const sectionCards = page.querySelectorAll(".glaucoma-section-card");

  const foldersContainer = page.querySelector("#glaucomaWorkshopFolders");
  if (!foldersContainer) return;
  updateGlaucomaFolderItemBadges(page);

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

      const restoreI18nKey = titleEl.dataset.i18nRestore;
      if (restoreI18nKey) {
        titleEl.setAttribute("data-i18n", restoreI18nKey);
        delete titleEl.dataset.i18nRestore;
        titleEl.removeAttribute("data-i18n-skip");
      }
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
    page.classList.add("glaucoma-folder-open");

    // 섹션 카드를 "그 자리"에 나오게 하기: 폴더 row 바로 다음에 배치
    openFolderRow.insertAdjacentElement("afterend", card);
    card.style.display = "";

    // h3 오른쪽에 Close를 붙이기
    const titleEl = card.querySelector("h3");
    if (!titleEl) return;

    const titleI18nKey = titleEl.getAttribute("data-i18n");
    refreshWorkshopTranslations(titleEl);
    titleEl.textContent = withGlaucomaSectionNumber(key, titleEl.textContent);
    if (titleI18nKey) {
      titleEl.dataset.i18nRestore = titleI18nKey;
      titleEl.removeAttribute("data-i18n");
      titleEl.setAttribute("data-i18n-skip", "true");
    }

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
      const restoreI18nKey = titleEl.dataset.i18nRestore;
      if (restoreI18nKey) {
        titleEl.setAttribute("data-i18n", restoreI18nKey);
        delete titleEl.dataset.i18nRestore;
        titleEl.removeAttribute("data-i18n-skip");
      }

      openFolderRow.style.display = "";
      ssRemove(SS_OPEN_KEY);
      ssRemove(SS_RESTORE_FLAG);
      page.classList.remove("glaucoma-folder-open");
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
  page.classList.remove("glaucoma-folder-open");

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
    page.classList.remove("glaucoma-folder-open");
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

    refreshWorkshopTranslations(titleEl);
    titleEl.textContent = withGlaucomaSectionNumber(
      "visualFields",
      titleEl.textContent,
    );

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

function setupGlaucomaAtomsButtonZoom(viewerEl, stageEl) {
  let zoom = 1;

  const controls = document.createElement("div");
  controls.className = "workshop-atoms-zoom-controls";
  controls.innerHTML = `
    <span aria-hidden="true"></span>
    <button type="button" data-atoms-zoom-out aria-label="Zoom out">-</button>
    <button type="button" data-atoms-zoom-in aria-label="Zoom in">+</button>
  `;
  viewerEl.prepend(controls);
  positionGlaucomaAtomsControlsBelowMenu(viewerEl, controls);

  const apply = () => {
    stageEl.style.width = `${Math.round(zoom * 100)}%`;
    stageEl.style.maxWidth = `${Math.round(zoom * 980)}px`;
  };

  const setZoom = (next) => {
    zoom = Math.max(0.72, Math.min(2.6, next));
    apply();
  };

  controls
    .querySelector("[data-atoms-zoom-out]")
    ?.addEventListener("click", () => setZoom(zoom - 0.18));
  controls
    .querySelector("[data-atoms-zoom-in]")
    ?.addEventListener("click", () => setZoom(zoom + 0.18));

  stageEl.style.transform = "none";
  stageEl.style.transformOrigin = "50% 0";
  viewerEl.style.touchAction = "auto";
  apply();
}

function positionGlaucomaAtomsControlsBelowMenu(viewerEl, controls) {
  const page = viewerEl.closest(".page");
  const menu = page?.querySelector(".eyes-topbar .icon.menuBtn");
  if (!menu || !controls) return;

  const place = () => {
    const menuRect = menu.getBoundingClientRect();
    const controlRect = controls.getBoundingClientRect();
    const width = controlRect.width || 128;
    const left = Math.max(
      8,
      Math.min(
        (window.innerWidth || document.documentElement.clientWidth || width) -
          width -
          8,
        menuRect.left + menuRect.width / 2 - width / 2,
      ),
    );

    controls.style.left = `${Math.round(left)}px`;
    controls.style.right = "auto";
    controls.style.top = `${Math.round(menuRect.bottom + 10)}px`;
  };

  window.requestAnimationFrame(place);
  window.addEventListener("resize", place, { passive: true });
  document.addEventListener("page:shown", (event) => {
    if (event?.detail?.id === page?.id) {
      window.requestAnimationFrame(place);
    }
  });
}

function lockGlaucomaAtomsViewerHeight(viewerEl, img) {
  if (!viewerEl || !img) return;

  const lock = () => {
    if (viewerEl.dataset.heightLocked === "1") return;
    const height = Math.ceil(viewerEl.scrollHeight);
    if (!height) return;
    viewerEl.style.height = `${height}px`;
    viewerEl.style.overflowY = "auto";
    viewerEl.dataset.heightLocked = "1";
  };

  const scheduleLock = () =>
    window.requestAnimationFrame(() => window.requestAnimationFrame(lock));

  if (img.complete) {
    scheduleLock();
  } else {
    img.addEventListener("load", scheduleLock, { once: true });
  }
}

function initGlaucomaSummaryAtomsPage(pageId, viewerId, imgSrc) {
  const page = document.getElementById(pageId);
  const viewer = document.getElementById(viewerId);

  if (!page || !viewer) return;
  if (viewer.dataset.inited === "1") return;

  viewer.style.position = "relative";
  viewer.style.top = "auto";
  viewer.style.left = "auto";
  viewer.style.right = "auto";
  viewer.style.bottom = "auto";
  viewer.style.width = "100%";
  viewer.style.minHeight = "0";
  viewer.style.overflowX = "auto";
  viewer.style.overflowY = "visible";
  viewer.style.padding = "62px 0 12px";
  viewer.style.background = "#fff";

  viewer.innerHTML = `
    <div class="atoms-handout-container" style="
      width: 100%;
      overflow: visible;
      position: relative;
      touch-action: auto;
    ">
      <div class="atoms-handout-stage" style="
        width: 100%;
        max-width: 980px;
        margin: 0 auto 48px;
        transform-origin: 50% 0;
      ">
        <img src="${imgSrc}" alt="ATOMS handout" data-i18n="i18nLiteral.ATOMS handout:alt" style="
          display: block;
          width: 100%;
          max-width: none;
          height: auto;
          margin: 0 auto;
        " />
      </div>
    </div>
  `;

  const stage = viewer.querySelector(".atoms-handout-stage");
  const img = viewer.querySelector(".atoms-handout-stage img");
  if (!stage) return;

  window.I18N?.applyTranslations?.(viewer);
  setupGlaucomaAtomsButtonZoom(viewer, stage);
  lockGlaucomaAtomsViewerHeight(viewer, img);

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

  initializeGlaucomaWorkshopProgressInfra();
  initializeGlaucomaWorkshopNextFlowInfra();
  setupWorkshopFolders(page);
  setupVisualFieldsSubfolder(page);
  moveAtomsRowsToFolderEnd(page);
  initGlaucomaSummaryAtomsPages();
  assignGlaucomaWorkshopFlowIndices(page);
  updateGlaucomaWorkshopProgressBars();

  const rows = page.querySelectorAll(".lesson-row[data-target]");
  rows.forEach((row) => {
    if (row.dataset.wired === "1") return;
    row.dataset.wired = "1";

    const activate = async (event) => {
      event.preventDefault();

      const targetRaw = row.getAttribute("data-target");
      if (!targetRaw) return;
      rememberGlaucomaWorkshopFlowFromRow(row);

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
        glaucomaSecondaryCauseQuizPage: "glaucomaQuizCaseStudy",
        glaucomaHistoryCaseStudy: "glaucomaHistoryCaseStudy",
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
          document.dispatchEvent(
            new CustomEvent("page:shown", { detail: { id: targetRaw } }),
          );
        }
        showExperimentalMiniAppNoticeForPage(targetRaw);

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
  const shadowImg = page.querySelector("#acdShadowImg");
  const normalFlashImg = page.querySelector("#acdNormalFlashImg");
  const normalArrowImg = page.querySelector("#acdNormalArrowImg");
  const shallowFlashImg = page.querySelector("#acdShallowFlashImg");
  const shallowArrowImg = page.querySelector("#acdShallowArrowImg");

  const labelLeftImg = page.querySelector("#acdNormalImg");
  const labelRightImg = page.querySelector("#acdShallowImg");
  const labelLeftText = page.querySelector("#acdLabelLeft .acd-label-text");
  const labelRightText = page.querySelector("#acdLabelRight .acd-label-text");

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
    imagesUnlocked: false,

    // -1(왼쪽) ~ +1(오른쪽)
    nx: 0.85,
    ny: 0.0,

    dragging: false,
    pointerId: null,
  };

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function syncShadowLinkedImages(strength) {
    const linkedImages = [
      shadowImg,
      normalFlashImg,
      normalArrowImg,
      shallowFlashImg,
      shallowArrowImg,
    ].filter(Boolean);
    const visible = strength > 0;

    linkedImages.forEach((img) => {
      img.style.opacity = visible ? `${strength}` : "0";
      img.style.display = visible ? "block" : "none";
    });
  }

  function render() {
    const rect = stage.getBoundingClientRect();

    // pickup 전: off flashlight + bubble만 보이고, on flashlight는 숨김
    if (!state.pickedUp) {
      flashlightLeft.style.display = "none";
      flashlightRight.style.display = "none";

      rightCrescent.style.opacity = "0";
      syncShadowLinkedImages(0);

      if (labelLeftImg) labelLeftImg.style.opacity = "0";
      if (labelRightImg) labelRightImg.style.opacity = "0";
      if (labelLeftText) labelLeftText.style.opacity = "0";
      if (labelRightText) labelRightText.style.opacity = "0";

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

    // ✅ Show label text ONLY when fully visible
    if (strength >= 1) {
      if (labelLeftText) labelLeftText.style.opacity = "1";
      if (labelRightText) labelRightText.style.opacity = "1";
    } else {
      if (labelLeftText) labelLeftText.style.opacity = "0";
      if (labelRightText) labelRightText.style.opacity = "0";
    }

    // label images: hidden initially, shown from the first full reveal
    if (!state.imagesUnlocked && strength >= 1) {
      state.imagesUnlocked = true;
    }
    if (state.imagesUnlocked) {
      if (labelLeftImg) labelLeftImg.style.opacity = "1";
      if (labelRightImg) labelRightImg.style.opacity = "1";
    } else {
      if (labelLeftImg) labelLeftImg.style.opacity = "0";
      if (labelRightImg) labelRightImg.style.opacity = "0";
    }

    // shadow.webp and top helper images share visibility timing
    syncShadowLinkedImages(strength);

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
  const eyesImg = page.querySelector("#rapdEyesImg");

  const flashlightOff = page.querySelector("#rapdFlashlightOff");
  const flashlight = page.querySelector("#rapdFlashlight");
  const beam = page.querySelector("#rapdBeam");
  const bubble = page.querySelector("#rapdBubble");

  const pupilLeft = page.querySelector("#rapdPupilLeft");
  const pupilRight = page.querySelector("#rapdPupilRight");

  const pageTitle = page.querySelector("#rapdPageTitle");
  const severityButtons = Array.from(
    page.querySelectorAll("[data-rapd-severity]"),
  );
  const sideButtons = Array.from(
    page.querySelectorAll("[data-rapd-patient-side]"),
  );
  const applyRandomButton = page.querySelector("#rapdApplyRandom");
  const revealPanel = page.querySelector("#rapdRevealPanel");
  const revealButton = page.querySelector("#rapdReveal");
  const randomNextButton = page.querySelector("#rapdRandomNext");
  const randomPanel = page.querySelector(".rapd-randomPanel");
  const testControls = page.querySelector("#rapdTestControls");
  const testProgress = page.querySelector("#rapdTestProgress");
  const submitAnswerButton = page.querySelector("#rapdSubmitAnswer");
  const previousQuestionButton = page.querySelector("#rapdTestPrevious");
  const nextQuestionButton = page.querySelector("#rapdTestNext");
  const answerDialog = page.querySelector("#rapdAnswerDialog");
  const answerFeedback = page.querySelector("#rapdAnswerFeedback");
  const answerCloseButton = page.querySelector("#rapdAnswerClose");
  const scoreDialog = page.querySelector("#rapdScoreDialog");
  const scoreResult = page.querySelector("#rapdScoreResult");
  const scoreCloseButton = page.querySelector("#rapdScoreClose");

  let launchMode = "practice";
  try {
    launchMode =
      sessionStorage.getItem("rapdExperience:launchMode") === "test"
        ? "test"
        : "practice";
  } catch {
    launchMode = "practice";
  }
  const isTestMode = launchMode === "test";
  page.dataset.rapdExperienceMode = launchMode;
  if (pageTitle) {
    pageTitle.textContent = isTestMode
      ? workshopText("medicalStudentsWorkshop.content.test", "Test")
      : workshopText("medicalStudentsWorkshop.content.practice", "Practice");
  }
  if (randomPanel) randomPanel.hidden = isTestMode;
  if (testControls) testControls.hidden = !isTestMode;

  if (
    !stage ||
    !eyesImg ||
    !flashlightOff ||
    !flashlight ||
    !beam ||
    !pupilLeft ||
    !pupilRight
  )
    return;

  flashlight.style.transition = "opacity 120ms linear";

  const LATENCY_MS = 250;
  const CONSTRICT_MIN = 0.82;
  const DILATE_MAX = 1.2;
  const CONSTRICT_FAST_MS = 85;
  const CONSTRICT_SLOW_MS = 620;
  const ESCAPE_HOLD_MS = 140;
  const ESCAPE_RAMP_MS = 1800;
  const ESCAPE_TARGET_SCALE = 0.92;
  const ESCAPE_STABLE_AFTER_FULL_MS = 3000;
  const LIGHT_MOTION_THRESHOLD = 0.045;
  const DILATE_RAMP_MS = 520;
  const RAPD_PULSE_MS = 220;
  const RAPD_PULSE_WITH_LATENCY_MS = LATENCY_MS + RAPD_PULSE_MS;
  const SLOW_CENTER_DWELL_MS = 160;
  const HIPPUS_AMP_LIGHT = 0.008;
  const HIPPUS_AMP_DARK = 0.016;
  const EYE_LEFT_X_IN_ART = 670.23 / 1807;
  const EYE_RIGHT_X_IN_ART = 1161.34 / 1807;
  const EYE_Y_IN_ART = 1116.46 / 2283;
  const BASE_ART_WIDTH = 320 * 1.67;
  const BASE_PUPIL_SIZE = 15;
  const FLASHLIGHT_VISUAL_OFFSET_Y = 36;

  const state = {
    pickedUp: false,
    dragging: false,
    pointerId: null,
    nx: 0,
    ny: 0,
    flashlightOpacity: 1,
    lastSide: "centre", // "left" | "right" | "centre"
    rapdPulseStart: null,
    manualSide: "right",
    manualSeverity: 3,
    manualEnabled: false,
    randomCase: null,
    test: isTestMode
      ? {
          questions: buildRapdTestQuestions(),
          answers: Array(10).fill(null),
          selections: Array(10).fill(null),
          index: 0,
          scoreShown: false,
          reviewMode: false,
        }
      : null,
    centerEnteredAt: null,
    lastLightMoveAt: null,
    lastLitNx: null,
    lastLitNy: null,
    renderTicker: null,
    geometryObserver: null,
    eyes: {
      left: null,
      right: null,
    },
  };

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function easeOutCubic(t) {
    const x = clamp(t, 0, 1);
    return 1 - (1 - x) * (1 - x) * (1 - x);
  }

  function easeInOutSine(t) {
    const x = clamp(t, 0, 1);
    return -(Math.cos(Math.PI * x) - 1) / 2;
  }

  function createEyeState(seed) {
    const now = performance.now();
    return {
      desiredConstricted: false,
      desiredChangedAt: now,
      effectiveConstricted: false,
      constrictStartedAt: null,
      dilateStartedAt: null,
      dilateStartScale: DILATE_MAX,
      constrictMinTarget: CONSTRICT_MIN,
      constrictMinActive: CONSTRICT_MIN,
      dilateTarget: DILATE_MAX,
      escapeStartedAt: null,
      hippusSeedA: seed,
      hippusSeedB: seed + 1.73,
      hippusSeedC: seed + 3.41,
    };
  }

  state.eyes.left = createEyeState(0.61);
  state.eyes.right = createEyeState(2.14);

  function setPupilScale(el, s) {
    el.style.transform = `translate(-50%, -50%) scale(${s})`;
  }

  function setPupilTransitionMs(el, ms) {
    el.style.transition = `transform ${ms}ms cubic-bezier(0.22, 0.61, 0.36, 1)`;
  }

  function updatePupilGeometry(rect) {
    const artRect = eyesImg.getBoundingClientRect();
    const artLeft = artRect.left - rect.left;
    const artTop = artRect.top - rect.top;
    const leftEyeX = artLeft + artRect.width * EYE_LEFT_X_IN_ART;
    const rightEyeX = artLeft + artRect.width * EYE_RIGHT_X_IN_ART;
    const eyeY = artTop + artRect.height * EYE_Y_IN_ART;
    const pupilSizeScale = clamp(artRect.width / BASE_ART_WIDTH, 1, 1.8);
    const pupilSize = BASE_PUPIL_SIZE * pupilSizeScale;
    const pupilRing = 3 * pupilSizeScale;

    pupilLeft.style.left = `${leftEyeX}px`;
    pupilLeft.style.top = `${eyeY}px`;
    pupilRight.style.left = `${rightEyeX}px`;
    pupilRight.style.top = `${eyeY}px`;

    [pupilLeft, pupilRight].forEach((pupil) => {
      pupil.style.width = `${pupilSize}px`;
      pupil.style.height = `${pupilSize}px`;
      pupil.style.boxShadow = `0 0 0 ${pupilRing}px rgba(0, 0, 0, 0.25)`;
    });

    return {
      leftEyeX,
      rightEyeX,
      eyeY,
      activationRadius: clamp(artRect.width * 0.14, 58, 132),
    };
  }

  function getLightDistances(x, y, eyeGeometry) {
    // Match the visible beam origin near the torch head, rather than using
    // the centre of the tall flashlight asset.
    const lightHeadX = x;
    const lightHeadY = y - 50;
    const dLeft = Math.hypot(
      lightHeadX - eyeGeometry.leftEyeX,
      lightHeadY - eyeGeometry.eyeY,
    );
    const dRight = Math.hypot(
      lightHeadX - eyeGeometry.rightEyeX,
      lightHeadY - eyeGeometry.eyeY,
    );

    return { dLeft, dRight, lightHeadX, lightHeadY };
  }

  function updateFlashlightOpacity(rect, distances) {
    const { dLeft, dRight } = distances;
    const d = Math.min(dLeft, dRight);

    const strongFadeDist = rect.width * 0.09;
    const softFadeDist = rect.width * 0.16;
    const recoverDist = rect.width * 0.28;
    const strongOpacity = 0.42;
    const softOpacity = 0.62;

    let targetOpacity = 1;
    if (d <= strongFadeDist) {
      targetOpacity = strongOpacity;
    } else if (d <= softFadeDist) {
      const t = (d - strongFadeDist) / (softFadeDist - strongFadeDist);
      targetOpacity = lerp(strongOpacity, softOpacity, easeInOutSine(t));
    } else if (d <= recoverDist) {
      const t = (d - softFadeDist) / (recoverDist - softFadeDist);
      targetOpacity = lerp(softOpacity, 1, easeInOutSine(t));
    }

    if (!Number.isFinite(state.flashlightOpacity)) state.flashlightOpacity = 1;
    state.flashlightOpacity = lerp(
      state.flashlightOpacity,
      targetOpacity,
      0.18,
    );
    flashlight.style.opacity = String(
      clamp(state.flashlightOpacity, strongOpacity, 1),
    );
  }

  function resetEyeState(eye, now) {
    eye.desiredConstricted = false;
    eye.desiredChangedAt = now;
    eye.effectiveConstricted = false;
    eye.constrictStartedAt = null;
    eye.dilateStartedAt = null;
    eye.dilateStartScale = DILATE_MAX;
    eye.constrictMinTarget = CONSTRICT_MIN;
    eye.constrictMinActive = CONSTRICT_MIN;
    eye.dilateTarget = DILATE_MAX;
    eye.escapeStartedAt = null;
  }

  function getConstrictedScale(eye, now) {
    if (!eye.effectiveConstricted) return DILATE_MAX;

    const constrictStart = eye.constrictStartedAt ?? now;
    const elapsed = Math.max(0, now - constrictStart);
    const minTarget = eye.constrictMinActive;
    const constrictSpan = DILATE_MAX - minTarget;
    const fastTarget = DILATE_MAX - (constrictSpan * 2) / 3;

    if (elapsed < CONSTRICT_FAST_MS) {
      const p = elapsed / CONSTRICT_FAST_MS;
      return lerp(DILATE_MAX, fastTarget, easeOutCubic(p));
    }

    if (elapsed < CONSTRICT_FAST_MS + CONSTRICT_SLOW_MS) {
      const p = (elapsed - CONSTRICT_FAST_MS) / CONSTRICT_SLOW_MS;
      return lerp(fastTarget, minTarget, easeInOutSine(p));
    }

    const escapeTarget = Math.max(minTarget, ESCAPE_TARGET_SCALE);
    if (eye.escapeStartedAt === null) return minTarget;

    const escapeElapsed = Math.max(0, now - eye.escapeStartedAt);
    if (escapeElapsed < ESCAPE_HOLD_MS) return minTarget;
    if (escapeElapsed < ESCAPE_HOLD_MS + ESCAPE_RAMP_MS) {
      const p = (escapeElapsed - ESCAPE_HOLD_MS) / ESCAPE_RAMP_MS;
      return lerp(minTarget, escapeTarget, easeInOutSine(p));
    }

    return escapeTarget;
  }

  function getDilatedScale(eye, now) {
    if (eye.effectiveConstricted) return eye.dilateTarget;
    if (eye.dilateStartedAt === null) return eye.dilateTarget;

    const elapsed = Math.max(0, now - eye.dilateStartedAt);
    if (elapsed >= DILATE_RAMP_MS) return eye.dilateTarget;

    const p = easeInOutSine(elapsed / DILATE_RAMP_MS);
    return lerp(eye.dilateStartScale, eye.dilateTarget, p);
  }

  function updateEyeDesiredWithLatency(
    eye,
    shouldConstrict,
    now,
    constrictMin,
    dilateTarget = DILATE_MAX,
  ) {
    const previousDilateTarget = eye.dilateTarget;
    const currentDilatedScale = eye.effectiveConstricted
      ? null
      : getDilatedScale(eye, now);
    eye.dilateTarget = dilateTarget;
    if (
      currentDilatedScale !== null &&
      Math.abs(previousDilateTarget - dilateTarget) > 0.001
    ) {
      eye.dilateStartScale = currentDilatedScale;
      eye.dilateStartedAt = now;
    }

    eye.constrictMinTarget = constrictMin;
    eye.constrictMinActive = lerp(
      eye.constrictMinActive,
      eye.constrictMinTarget,
      0.22,
    );

    if (eye.desiredConstricted !== shouldConstrict) {
      eye.desiredConstricted = shouldConstrict;
      eye.desiredChangedAt = now;
    }

    if (
      eye.effectiveConstricted !== eye.desiredConstricted &&
      now - eye.desiredChangedAt >= LATENCY_MS
    ) {
      if (eye.desiredConstricted) {
        eye.effectiveConstricted = true;
        eye.constrictStartedAt = now;
        eye.dilateStartedAt = null;
        eye.dilateStartScale = DILATE_MAX;
        eye.escapeStartedAt = null;
      } else {
        const dilateFrom = getConstrictedScale(eye, now);
        eye.effectiveConstricted = false;
        eye.constrictStartedAt = null;
        eye.dilateStartedAt = now;
        eye.dilateStartScale = dilateFrom;
        eye.escapeStartedAt = null;
      }
    }
  }

  function updateEyeEscapeState(eye, now, stimulusOn, lastMoveAt) {
    if (!stimulusOn || !eye.effectiveConstricted) {
      eye.escapeStartedAt = null;
      return;
    }

    const fullConstrictAt =
      (eye.constrictStartedAt ?? now) + CONSTRICT_FAST_MS + CONSTRICT_SLOW_MS;
    const stableFrom = Number.isFinite(lastMoveAt) ? lastMoveAt : now;
    const canEscapeAt =
      Math.max(fullConstrictAt, stableFrom) + ESCAPE_STABLE_AFTER_FULL_MS;

    if (now >= canEscapeAt) {
      if (eye.escapeStartedAt === null) eye.escapeStartedAt = now;
    } else {
      eye.escapeStartedAt = null;
    }
  }

  function getHippusOffset(eye, now, amplitudeScale = 1) {
    const t = now / 1000;
    const mixed =
      0.62 * Math.sin(2 * Math.PI * 0.87 * t + eye.hippusSeedA) +
      0.38 * Math.sin(2 * Math.PI * 1.33 * t + eye.hippusSeedB);
    const wander =
      0.7 + 0.3 * Math.sin(2 * Math.PI * 0.12 * t + eye.hippusSeedC);
    const amp = eye.effectiveConstricted ? HIPPUS_AMP_LIGHT : HIPPUS_AMP_DARK;
    return amp * amplitudeScale * mixed * wander;
  }

  function applyEyeScale(el, eye, now, hippusScale = 1) {
    const base = eye.effectiveConstricted
      ? getConstrictedScale(eye, now)
      : getDilatedScale(eye, now);
    const hippus = getHippusOffset(eye, now, hippusScale);
    const scaled = clamp(
      base + hippus,
      CONSTRICT_MIN,
      DILATE_MAX + HIPPUS_AMP_DARK,
    );
    setPupilScale(el, scaled);
  }

  function render() {
    const now = performance.now();
    const rect = stage.getBoundingClientRect();
    const eyeGeometry = updatePupilGeometry(rect);

    // before pickup: show only "off" + bubble
    if (!state.pickedUp) {
      flashlight.style.display = "none";
      beam.style.display = "none";
      flashlightOff.style.display = "";
      if (bubble) bubble.style.display = "";
      if (hint) hint.style.opacity = "1";
      state.rapdPulseStart = null;
      state.centerEnteredAt = null;
      state.lastLightMoveAt = null;
      state.lastLitNx = null;
      state.lastLitNy = null;
      resetEyeState(state.eyes.left, now);
      resetEyeState(state.eyes.right, now);
      setPupilTransitionMs(pupilLeft, 120);
      setPupilTransitionMs(pupilRight, 120);
      state.flashlightOpacity = 1;
      flashlight.style.opacity = "1";
      setPupilScale(pupilLeft, DILATE_MAX);
      setPupilScale(pupilRight, DILATE_MAX);
      return;
    }

    // after pickup
    flashlightOff.style.display = "none";
    if (bubble) bubble.style.display = "none";
    flashlight.style.display = "block";
    beam.style.display = "block";
    if (hint) hint.style.opacity = state.dragging ? "0" : "1";

    // map nx to stage x
    const cx = rect.width / 2;
    const travel = rect.width * 0.38;
    const x = cx + travel * state.nx;
    const xClamped = clamp(x, 24, rect.width - 24);

    // y moves too: dragging down reduces light reaching the eyes
    const baseY = rect.height * 0.54;
    const y = clamp(
      baseY + rect.height * 0.22 * state.ny,
      24,
      rect.height - 24,
    );

    flashlight.style.left = `${xClamped}px`;
    flashlight.style.top = `${y + FLASHLIGHT_VISUAL_OFFSET_Y}px`;

    // Use the same image-derived eye centres for both eyes. A generous radial
    // activation zone lets the pupil respond before the light is perfectly
    // centred, while keeping the left/right response symmetrical.
    const lightDistances = getLightDistances(xClamped, y, eyeGeometry);
    const nearestDistance = Math.min(
      lightDistances.dLeft,
      lightDistances.dRight,
    );
    const eyesMidpoint = (eyeGeometry.leftEyeX + eyeGeometry.rightEyeX) / 2;
    const eyeSeparation = eyeGeometry.rightEyeX - eyeGeometry.leftEyeX;
    const centreNeutralHalfWidth = Math.max(18, eyeSeparation * 0.08);
    const inCentreNeutralZone =
      Math.abs(lightDistances.lightHeadX - eyesMidpoint) <=
      centreNeutralHalfWidth;
    const lightOn =
      nearestDistance <= eyeGeometry.activationRadius && !inCentreNeutralZone;
    const side = lightOn
      ? lightDistances.dLeft <= lightDistances.dRight
        ? "left"
        : "right"
      : "centre";

    if (side === "centre") {
      if (state.lastSide !== "centre" || state.centerEnteredAt === null) {
        state.centerEnteredAt = now;
      }
    } else {
      state.centerEnteredAt = null;
    }

    const centerDwellMs =
      side === "centre" && state.centerEnteredAt !== null
        ? now - state.centerEnteredAt
        : 0;
    const slowCenterDilating =
      lightOn && side === "centre" && centerDwellMs >= SLOW_CENTER_DWELL_MS;
    const effectiveStimulus = lightOn && !slowCenterDilating;

    if (!effectiveStimulus) {
      state.lastLightMoveAt = now;
      state.lastLitNx = null;
      state.lastLitNy = null;
    } else if (state.lastLitNx === null || state.lastLitNy === null) {
      state.lastLightMoveAt = now;
      state.lastLitNx = state.nx;
      state.lastLitNy = state.ny;
    } else {
      const delta = Math.hypot(
        state.nx - state.lastLitNx,
        state.ny - state.lastLitNy,
      );
      if (delta > LIGHT_MOTION_THRESHOLD) {
        state.lastLightMoveAt = now;
        state.lastLitNx = state.nx;
        state.lastLitNy = state.ny;
      } else {
        state.lastLitNx = lerp(state.lastLitNx, state.nx, 0.08);
        state.lastLitNy = lerp(state.lastLitNy, state.ny, 0.08);
      }
    }

    const beamX = xClamped;
    const beamY = y - 50;
    beam.style.left = `${beamX}px`;
    beam.style.top = `${beamY}px`;
    updateFlashlightOpacity(rect, lightDistances);

    const beamDiameter = rect.width * 0.315;
    beam.style.width = `${beamDiameter}px`;
    beam.style.height = `${beamDiameter}px`;
    beam.style.transform = "translate(-50%, -50%)";
    beam.style.opacity = side === "centre" ? "0.85" : "0.9";

    const activeCase = isTestMode
      ? state.test.questions[state.test.index]
      : state.randomCase || {
          side: state.manualEnabled ? state.manualSide : null,
          severity: state.manualSeverity,
        };
    const hippusScale = activeCase.side
      ? getRapdHippusScale(activeCase.severity)
      : 1;

    setPupilTransitionMs(pupilLeft, 90);
    setPupilTransitionMs(pupilRight, 90);

    let leftShouldConstrict = effectiveStimulus;
    let rightShouldConstrict = effectiveStimulus;
    let leftConstrictMin = CONSTRICT_MIN;
    let rightConstrictMin = CONSTRICT_MIN;

    let leftDilateTarget = DILATE_MAX;
    let rightDilateTarget = DILATE_MAX;

    if (activeCase.side && effectiveStimulus && side === activeCase.side) {
      if (state.lastSide !== activeCase.side || state.rapdPulseStart === null) {
        state.rapdPulseStart = now;
      }

      const rapdElapsed = now - state.rapdPulseStart;
      const pulseActive = rapdElapsed < RAPD_PULSE_WITH_LATENCY_MS;
      leftShouldConstrict = pulseActive;
      rightShouldConstrict = pulseActive;
      const directResponseRatio = getRapdDirectResponseRatio(
        activeCase.severity,
      );
      const rapdConstrictMin =
        DILATE_MAX - (DILATE_MAX - CONSTRICT_MIN) * directResponseRatio;
      leftConstrictMin = rapdConstrictMin;
      rightConstrictMin = rapdConstrictMin;
      if (!pulseActive) {
        const rapdDilationTarget = getRapdDilationTarget(activeCase.severity);
        leftDilateTarget = rapdDilationTarget;
        rightDilateTarget = rapdDilationTarget;
      }
    } else {
      state.rapdPulseStart = null;
    }

    updateEyeDesiredWithLatency(
      state.eyes.left,
      leftShouldConstrict,
      now,
      leftConstrictMin,
      leftDilateTarget,
    );
    updateEyeDesiredWithLatency(
      state.eyes.right,
      rightShouldConstrict,
      now,
      rightConstrictMin,
      rightDilateTarget,
    );

    updateEyeEscapeState(
      state.eyes.left,
      now,
      effectiveStimulus,
      state.lastLightMoveAt,
    );
    updateEyeEscapeState(
      state.eyes.right,
      now,
      effectiveStimulus,
      state.lastLightMoveAt,
    );

    applyEyeScale(pupilLeft, state.eyes.left, now, hippusScale);
    applyEyeScale(pupilRight, state.eyes.right, now, hippusScale);

    state.lastSide = side;
  }

  function pointerToNormalised(e) {
    const r = stage.getBoundingClientRect();

    const baseX = r.left + r.width / 2;
    const baseY = r.top + r.height * 0.54;
    const nx = clamp((e.clientX - baseX) / (r.width * 0.38), -1, 1);
    const ny = clamp(
      (e.clientY - FLASHLIGHT_VISUAL_OFFSET_Y - baseY) / (r.height * 0.22),
      -1,
      1,
    );

    return { nx, ny };
  }

  function pickUpFlashlight(e) {
    if (state.pickedUp) return;
    const pointer = pointerToNormalised(e);
    state.nx = pointer.nx;
    state.ny = pointer.ny;
    state.pickedUp = true;
    render();
  }

  function onDown(e) {
    if (!state.pickedUp) {
      if (e.target === flashlightOff) {
        pickUpFlashlight(e);
        state.dragging = true;
        state.pointerId = e.pointerId;
        e.target.setPointerCapture(e.pointerId);
        render();
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

  function updateSeveritySelection(selectedSeverity, showSelection = true) {
    severityButtons.forEach((button) => {
      const isSelected =
        showSelection &&
        Number(button.dataset.rapdSeverity) === selectedSeverity;
      button.setAttribute("aria-pressed", String(isSelected));
    });
  }

  function updateSideSelection(selectedSide, showSelection = true) {
    const patientSide = selectedSide
      ? internalSideToPatientSide(selectedSide)
      : "none";
    sideButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(showSelection && button.dataset.rapdPatientSide === patientSide),
      );
    });
  }

  function updateDiagnosisSelection(rapdCase, showSelection = true) {
    updateSideSelection(rapdCase?.side || null, showSelection);
    updateSeveritySelection(
      rapdCase?.severity,
      showSelection && Boolean(rapdCase?.side),
    );
  }

  const reviewClasses = [
    "is-review-user",
    "is-review-correct",
    "is-review-correct-missed",
  ];

  function getCaseControlButtons(rapdCase) {
    const patientSide = rapdCase?.side
      ? internalSideToPatientSide(rapdCase.side)
      : "none";
    const controls = sideButtons.filter(
      (button) => button.dataset.rapdPatientSide === patientSide,
    );
    if (rapdCase?.side) {
      controls.push(
        ...severityButtons.filter(
          (button) => Number(button.dataset.rapdSeverity) === rapdCase.severity,
        ),
      );
    }
    return controls;
  }

  function clearReviewStyles() {
    [...sideButtons, ...severityButtons].forEach((button) => {
      button.classList.remove(...reviewClasses, "is-reveal-flash");
    });
  }

  function markCaseControls(rapdCase, className) {
    getCaseControlButtons(rapdCase).forEach((button) => {
      button.classList.add(className);
    });
  }

  function showReviewAnswer(answer, correctAnswer) {
    clearReviewStyles();
    updateDiagnosisSelection(null, false);
    if (rapdCasesMatch(answer, correctAnswer)) {
      markCaseControls(correctAnswer, "is-review-correct");
      return;
    }
    markCaseControls(answer, "is-review-user");
    markCaseControls(correctAnswer, "is-review-correct-missed");
  }

  function clearRandomCase() {
    state.randomCase = null;
    state.rapdPulseStart = null;
    if (revealPanel) revealPanel.hidden = true;
    if (randomNextButton) randomNextButton.hidden = true;
  }

  function resetQuestionInteraction() {
    const now = performance.now();
    state.pickedUp = false;
    state.dragging = false;
    state.pointerId = null;
    state.nx = 0;
    state.ny = 0;
    state.rapdPulseStart = null;
    state.lastSide = "centre";
    resetEyeState(state.eyes.left, now);
    resetEyeState(state.eyes.right, now);
  }

  function getTestScore() {
    return scoreRapdAnswers(state.test.questions, state.test.answers);
  }

  function updateTestUi() {
    if (!state.test) return;
    const answered = state.test.answers[state.test.index];
    const selection = state.test.selections[state.test.index];
    const correctAnswer = state.test.questions[state.test.index];
    if (testProgress) {
      testProgress.textContent = workshopText(
        "i18nLiteral.Question {{current}} of {{total}}",
        `Question ${state.test.index + 1} of ${state.test.questions.length}`,
        {
          current: state.test.index + 1,
          total: state.test.questions.length,
        },
      );
      if (answered) {
        const isCorrect = rapdCasesMatch(answered, correctAnswer);
        const status = document.createElement("span");
        status.className = `rapd-testProgress__status ${
          isCorrect ? "is-correct" : "is-incorrect"
        }`;
        status.setAttribute(
          "aria-label",
          isCorrect
            ? workshopText("i18nLiteral.Correct answer", "Correct answer")
            : workshopText("i18nLiteral.Incorrect answer", "Incorrect answer"),
        );
        status.textContent = isCorrect ? "✓" : "×";
        testProgress.appendChild(status);
      }
    }
    if (previousQuestionButton) {
      previousQuestionButton.disabled = state.test.index === 0;
    }
    if (nextQuestionButton) {
      nextQuestionButton.disabled =
        state.test.index === state.test.questions.length - 1;
    }
    if (submitAnswerButton) {
      submitAnswerButton.hidden = state.test.reviewMode;
      submitAnswerButton.textContent = answered
        ? workshopText("i18nLiteral.View result", "View result")
        : workshopText("i18nLiteral.Submit answer", "Submit answer");
      const selectionComplete =
        selection &&
        (!selection.side || [1, 2, 3].includes(selection.severity));
      submitAnswerButton.disabled = !answered && !selectionComplete;
    }
    if (state.test.reviewMode && answered) {
      showReviewAnswer(answered, correctAnswer);
    } else {
      clearReviewStyles();
      updateDiagnosisSelection(
        answered || selection,
        Boolean(answered || selection),
      );
    }
  }

  function closeAnswerDialog() {
    if (answerDialog) answerDialog.hidden = true;
  }

  function showFinalScoreIfComplete() {
    if (!state.test || state.test.answers.some((answer) => answer === null)) {
      return;
    }
    if (scoreResult) {
      scoreResult.textContent = workshopText(
        "i18nLiteral.You scored {{score}} out of {{total}}.",
        `You scored ${getTestScore()} out of ${state.test.questions.length}.`,
        {
          score: getTestScore(),
          total: state.test.questions.length,
        },
      );
    }
    if (scoreDialog) scoreDialog.hidden = false;
    state.test.scoreShown = true;
  }

  function renderAnswerDialog() {
    if (!state.test || !answerFeedback || !answerDialog) return;
    const currentAnswer = state.test.answers[state.test.index];
    const correctAnswer = state.test.questions[state.test.index];
    if (currentAnswer) {
      const isCorrect = rapdCasesMatch(currentAnswer, correctAnswer);
      answerFeedback.textContent = isCorrect
        ? workshopText(
            "i18nLiteral.Correct. The answer is {{answer}}.",
            `Correct. The answer is ${formatRapdAnswerForUi(correctAnswer)}.`,
            { answer: formatRapdAnswerForUi(correctAnswer) },
          )
        : workshopText(
            "i18nLiteral.Incorrect. The correct answer is {{answer}}.",
            `Incorrect. The correct answer is ${formatRapdAnswerForUi(correctAnswer)}.`,
            { answer: formatRapdAnswerForUi(correctAnswer) },
          );
      answerFeedback.className = `rapd-answerFeedback ${
        isCorrect ? "is-correct" : "is-incorrect"
      }`;
      answerFeedback.hidden = false;
    } else {
      return;
    }
    if (answerCloseButton) {
      answerCloseButton.disabled = false;
      answerCloseButton.textContent = workshopText("i18nLiteral.Next", "Next");
    }
    answerDialog.hidden = false;
  }

  function goToTestQuestion(nextIndex) {
    if (!state.test) return;
    state.test.index = clamp(nextIndex, 0, state.test.questions.length - 1);
    closeAnswerDialog();
    resetQuestionInteraction();
    updateTestUi();
    render();
  }

  sideButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const patientSide = button.dataset.rapdPatientSide;
      if (isTestMode) {
        if (state.test.answers[state.test.index]) return;
        const existing = state.test.selections[state.test.index];
        state.test.selections[state.test.index] =
          patientSide === "none"
            ? { side: null, severity: null }
            : caseFromPatientSelection(patientSide, existing?.severity || null);
        updateTestUi();
        return;
      }
      clearRandomCase();
      if (patientSide === "none") {
        state.manualEnabled = false;
        updateDiagnosisSelection({ side: null, severity: null });
      } else {
        state.manualSide = caseFromPatientSelection(
          patientSide,
          state.manualSeverity,
        ).side;
        state.manualEnabled = true;
        updateDiagnosisSelection({
          side: state.manualSide,
          severity: state.manualSeverity,
        });
      }
      render();
    });
  });

  severityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const severity = Number(button.dataset.rapdSeverity);
      if (![1, 2, 3].includes(severity)) return;
      if (isTestMode) {
        if (state.test.answers[state.test.index]) return;
        const existing = state.test.selections[state.test.index];
        if (!existing?.side) return;
        state.test.selections[state.test.index] = {
          side: existing.side,
          severity,
        };
        updateTestUi();
        return;
      }
      clearRandomCase();
      state.manualSeverity = severity;
      if (!state.manualSide) state.manualSide = "right";
      state.manualEnabled = true;
      updateDiagnosisSelection({ side: state.manualSide, severity });
      render();
    });
  });

  function applyRandomCase() {
    state.randomCase = pickRandomRapdCase();
    state.rapdPulseStart = null;
    updateSeveritySelection(state.manualSeverity, false);
    updateSideSelection(null, false);
    if (revealPanel) revealPanel.hidden = false;
    if (randomNextButton) randomNextButton.hidden = true;
    render();
  }

  applyRandomButton?.addEventListener("click", applyRandomCase);

  revealButton?.addEventListener("click", () => {
    if (!state.randomCase) return;
    updateDiagnosisSelection(state.randomCase);
    const answerControls = getCaseControlButtons(state.randomCase);
    answerControls.forEach((button) =>
      button.classList.remove("is-reveal-flash"),
    );
    window.requestAnimationFrame(() => {
      answerControls.forEach((button) =>
        button.classList.add("is-reveal-flash"),
      );
    });
    window.setTimeout(() => {
      answerControls.forEach((button) =>
        button.classList.remove("is-reveal-flash"),
      );
    }, 1450);
    if (randomNextButton) randomNextButton.hidden = false;
  });

  randomNextButton?.addEventListener("click", applyRandomCase);

  if (isTestMode) {
    submitAnswerButton?.addEventListener("click", () => {
      const existing = state.test.answers[state.test.index];
      if (!existing) {
        const selection = state.test.selections[state.test.index];
        if (!selection) return;
        state.test.answers[state.test.index] = { ...selection };
        updateTestUi();
      }
      renderAnswerDialog();
    });
    answerCloseButton?.addEventListener("click", () => {
      if (!state.test?.answers[state.test.index]) return;
      if (state.test.index < state.test.questions.length - 1) {
        goToTestQuestion(state.test.index + 1);
        return;
      }

      const firstUnanswered = state.test.answers.findIndex(
        (answer) => answer === null,
      );
      if (firstUnanswered >= 0) {
        goToTestQuestion(firstUnanswered);
        return;
      }

      closeAnswerDialog();
      showFinalScoreIfComplete();
    });
    scoreCloseButton?.addEventListener("click", () => {
      if (scoreDialog) scoreDialog.hidden = true;
      state.test.reviewMode = true;
      goToTestQuestion(0);
    });
    previousQuestionButton?.addEventListener("click", () => {
      goToTestQuestion(state.test.index - 1);
    });
    nextQuestionButton?.addEventListener("click", () => {
      goToTestQuestion(state.test.index + 1);
    });
    updateTestUi();
  } else {
    updateDiagnosisSelection({ side: null, severity: null }, true);
  }

  const refreshGeometry = () => {
    if (getComputedStyle(page).display === "none") return;
    window.requestAnimationFrame(render);
  };

  window.addEventListener("resize", refreshGeometry);
  if (eyesImg.complete) {
    refreshGeometry();
  } else {
    eyesImg.addEventListener("load", refreshGeometry, { once: true });
  }
  if (typeof ResizeObserver === "function") {
    state.geometryObserver = new ResizeObserver(refreshGeometry);
    state.geometryObserver.observe(stage);
    state.geometryObserver.observe(eyesImg);
  }

  state.renderTicker = window.setInterval(() => {
    if (!document.body.contains(page)) {
      if (state.renderTicker !== null) {
        clearInterval(state.renderTicker);
        state.renderTicker = null;
      }
      state.geometryObserver?.disconnect();
      window.removeEventListener("resize", refreshGeometry);
      return;
    }
    if (getComputedStyle(page).display === "none") return;
    render();
  }, 33);

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

export function initializeGlaucomaScrollInteractiveTarget(targetId) {
  if (targetId === "glaucomaACDInteractive") {
    initGlaucomaACDInteractive();
    return;
  }

  if (targetId === "glaucomaRAPDFullSwingInteractive") {
    initGlaucomaRAPDFullSwingInteractive();
  }
}
