// ================================================
// FILE: public/js/fundalReflexPdf.js
// ================================================

const LESSON_PROGRESS_PREFIX = "lessonProgress:";
const LESSON_PROGRESS_EVENT = "arclight:lesson-progress-changed";
const DIABETIC_WORKSHOP_PROGRESS_PREFIX = "diabeticWorkshop:progress:";
const DIABETIC_WORKSHOP_PROGRESS_EVENT = "diabeticWorkshop:progress-changed";

function writeCompleteProgress(prefix, target) {
  if (!prefix || !target) return;

  try {
    localStorage.setItem(
      `${prefix}${target}`,
      JSON.stringify({ percent: 100, updatedAt: Date.now() }),
    );
  } catch {
    void 0;
  }
}

function dispatchProgressEvent(name, target) {
  if (!name || !target) return;

  document.dispatchEvent(
    new CustomEvent(name, {
      detail: { target, percent: 100 },
    }),
  );
}

function markPdfProgressComplete(target, workshopPrefix = "") {
  writeCompleteProgress(LESSON_PROGRESS_PREFIX, target);
  dispatchProgressEvent(LESSON_PROGRESS_EVENT, target);

  if (workshopPrefix) {
    writeCompleteProgress(workshopPrefix, target);
    dispatchProgressEvent(DIABETIC_WORKSHOP_PROGRESS_EVENT, target);
  }
}

function showOnlyPage(pageId) {
  const root = document.getElementById("page-content") || document;
  const pages = root.querySelectorAll(".page");
  pages.forEach((p) => {
    p.style.display = "none";
    p.classList.remove("active");
  });

  const target = document.getElementById(pageId);
  if (target) {
    target.style.display = "";
    target.classList.add("active");
  }
}

function setupPanZoomForStage(viewerEl, stageEl, opts = {}) {
  const minScale = opts.minScale ?? 0.6;
  const maxScale = opts.maxScale ?? 6;

  let scale = 1;
  let tx = 0;
  let ty = 0;

  function apply() {
    stageEl.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  function clampScale(next) {
    return Math.max(minScale, Math.min(maxScale, next));
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
      pinchStart = { d: dist(p1, p2) };
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
      const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      const cx = mid.x - rect.left;
      const cy = mid.y - rect.top;

      const prev = scale;
      const next = clampScale(prev * (d / pinchStart.d));
      if (next === prev) return;

      const k = next / prev;
      tx = cx - k * (cx - tx);
      ty = cy - k * (cy - ty);
      scale = next;
      apply();
    }
  });

  function clearPointer(e) {
    pointers.delete(e.pointerId);
    if (pointers.size === 0) {
      panStart = null;
      pinchStart = null;
      return;
    }
    if (pointers.size === 1) {
      const p = [...pointers.values()][0];
      panStart = { x: p.x, y: p.y, tx, ty };
      pinchStart = null;
    }
  }

  viewerEl.addEventListener("pointerup", clearPointer);
  viewerEl.addEventListener("pointercancel", clearPointer);

  // ê¸°ë³¸ ìŠ¤íƒ€ì¼
  viewerEl.style.touchAction = "none";
  stageEl.style.transformOrigin = opts.transformOrigin || "0 0";

  apply();
}

function setupAtomsButtonZoom(viewerEl, stageEl) {
  let zoom = 1;

  const controls = document.createElement("div");
  controls.className = "workshop-atoms-zoom-controls";
  controls.innerHTML = `
    <span aria-hidden="true"></span>
    <button type="button" data-atoms-zoom-out aria-label="Zoom out">-</button>
    <button type="button" data-atoms-zoom-in aria-label="Zoom in">+</button>
  `;
  viewerEl.prepend(controls);

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

function initImagePdfPage(pageId, viewerId, imgSrc) {
  showOnlyPage(pageId);
  const page = document.getElementById(pageId);
  if (!page) return;

  const viewer = page.querySelector(`#${viewerId}`);
  if (!viewer) return;

  if (viewer.dataset.inited !== "1") {
    viewer.dataset.inited = "1";
    viewer.textContent = "";

    const isDesktop = window.matchMedia?.("(min-width: 1024px)")?.matches;
    const stage = document.createElement("div");
    stage.className = "workshop-pdf-stage";
    stage.style.position = isDesktop ? "relative" : "absolute";
    stage.style.left = isDesktop ? "auto" : "0";
    stage.style.top = isDesktop ? "auto" : "0";
    stage.style.width = isDesktop ? "min(74vw, 980px)" : "100%";
    stage.style.margin = isDesktop ? "0 auto 32px" : "0";

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = page.getAttribute("data-pdf-title") || "PDF";
    img.draggable = false;
    img.style.display = "block";
    img.style.width = "100%";
    img.style.height = "auto";
    img.style.maxWidth = "none";
    img.style.userSelect = "none";
    img.style.webkitUserDrag = "none";
    img.style.pointerEvents = "none";

    stage.appendChild(img);
    viewer.appendChild(stage);
    setupPanZoomForStage(viewer, stage, {
      transformOrigin: isDesktop ? "50% 0" : "0 0",
    });
  }

  viewer.style.position = "relative";
  viewer.style.left = "auto";
  viewer.style.right = "auto";
  viewer.style.top = "auto";
  viewer.style.bottom = "auto";
  viewer.style.width = "100%";
  if (window.matchMedia?.("(min-width: 1024px)")?.matches) {
    viewer.style.height = "auto";
    viewer.style.minHeight = "calc(100vh - 62px)";
    viewer.style.overflow = "visible";
    viewer.style.padding = "20px 0 48px";
  } else {
    viewer.style.height = "calc(100vh - 62px)";
    viewer.style.overflow = "hidden";
    viewer.style.padding = "0";
  }
  viewer.style.background = "#fff";
}

export function initializeFundalReflexPdf() {
  showOnlyPage("fundalReflexPdfPage");
  const page = document.getElementById("fundalReflexPdfPage");
  if (!page) return;

  const viewer = page.querySelector("#fundalPdfViewer");
  if (!viewer) return;

  viewer.textContent = "";
  const isDesktop = window.matchMedia?.("(min-width: 1024px)")?.matches;
  const stage = document.createElement("div");
  stage.id = "fundalPdfStage";
  stage.style.position = isDesktop ? "relative" : "absolute";
  stage.style.left = isDesktop ? "auto" : "0";
  stage.style.top = isDesktop ? "auto" : "0";
  stage.style.width = isDesktop ? "min(58vw, 760px)" : "100%";
  stage.style.margin = isDesktop ? "0 auto 28px" : "0";

  const img = document.createElement("img");
  img.src = "images/pdf/Workshop/Childhood/FundalPDF.svg";
  img.alt = "Fundal reflex PDF";
  img.draggable = false;
  img.style.display = "block";
  img.style.width = "100%";
  img.style.height = "auto";
  img.style.maxWidth = "none";
  img.style.userSelect = "none";
  img.style.webkitUserDrag = "none";
  img.style.pointerEvents = "none";

  stage.appendChild(img);
  viewer.appendChild(stage);

  viewer.style.position = "relative";
  viewer.style.left = "auto";
  viewer.style.right = "auto";
  viewer.style.top = "auto";
  viewer.style.bottom = "auto";
  viewer.style.width = "100%";
  if (isDesktop) {
    viewer.style.height = "auto";
    viewer.style.minHeight = "calc(100vh - 62px)";
    viewer.style.overflow = "visible";
    viewer.style.padding = "20px 0 32px";
  } else {
    viewer.style.height = "calc(100vh - 62px)";
    viewer.style.overflow = "hidden";
    viewer.style.padding = "0";
  }
  viewer.style.background = "#fff";
  viewer.style.touchAction = "none";

  setupPanZoomForStage(viewer, stage, {
    minScale: isDesktop ? 1 : 0.6,
    transformOrigin: isDesktop ? "50% 0" : "0 0",
  });

  const dl = page.querySelector("#fundalPdfDownloadBtn");
  if (dl) {
    dl.addEventListener("click", () => {
      // native download behaviour will handle it
    });
  }
}

function initAtomsHandoutPage(pageId, viewerId, imgSrc) {
  const page = document.getElementById(pageId);
  if (!page) return;

  const viewer = page.querySelector(`#${viewerId}`);
  if (!viewer) return;

  // ì¤‘ë³µ initialise ë°©ì§€
  if (viewer.dataset.inited === "1") return;
  viewer.dataset.inited = "1";

  viewer.style.position = "relative";
  viewer.style.left = "auto";
  viewer.style.right = "auto";
  viewer.style.top = "auto";
  viewer.style.bottom = "auto";
  viewer.style.width = "100%";
  viewer.style.minHeight = "calc(100vh - 62px)";
  viewer.style.overflowX = "auto";
  viewer.style.overflowY = "visible";
  viewer.style.padding = "62px 0 48px";
  viewer.style.background = "#fff";

  viewer.textContent = "";

  const isDesktop = window.matchMedia?.("(min-width: 1024px)")?.matches;
  const stage = document.createElement("div");
  stage.className = "atoms-stage";
  stage.style.position = "relative";
  stage.style.left = "auto";
  stage.style.top = "auto";
  stage.style.width = "100%";
  stage.style.maxWidth = isDesktop ? "980px" : "100vw";
  stage.style.margin = "0 auto 16px";

  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = "ATOMS handout";
  img.draggable = false;
  img.style.display = "block";
  img.style.width = "100%";
  img.style.height = "auto";
  img.style.maxWidth = "none";
  img.style.userSelect = "none";
  img.style.webkitUserDrag = "none";
  img.style.pointerEvents = "none";

  stage.appendChild(img);
  viewer.appendChild(stage);
  if (!stage) return;

  setupAtomsButtonZoom(viewer, stage);
}

export function initializeAtomsHandout1() {
  showOnlyPage("atomsHandout1Page");
  initAtomsHandoutPage(
    "atomsHandout1Page",
    "atomsHandout1Viewer",
    "images/pdf/Workshop/Childhood/AtomsHandout1.png",
  );
}

export function initializeAtomsHandout2() {
  showOnlyPage("atomsHandout2Page");
  initAtomsHandoutPage(
    "atomsHandout2Page",
    "atomsHandout2Viewer",
    "images/pdf/Workshop/Childhood/AtomsHandout2.png",
  );
}

export function initializeDirectOphthalmoscopyPdf() {
  markPdfProgressComplete(
    "directOphthalmoscopyPdfPage",
    DIABETIC_WORKSHOP_PROGRESS_PREFIX,
  );
  initImagePdfPage(
    "directOphthalmoscopyPdfPage",
    "directOphthalmoscopyPdfViewer",
    "images/pdf/Workshop/DO/DO.png",
  );
}

export function initializeBinocularIndirectOphthalmoscopyPdf() {
  markPdfProgressComplete(
    "binocularIndirectOphthalmoscopyPdfPage",
    DIABETIC_WORKSHOP_PROGRESS_PREFIX,
  );
  initImagePdfPage(
    "binocularIndirectOphthalmoscopyPdfPage",
    "binocularIndirectOphthalmoscopyPdfViewer",
    "images/pdf/Workshop/BIO/BIO.png",
  );
}
