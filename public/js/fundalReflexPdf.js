// ================================================
// FILE: public/js/fundalReflexPdf.js
// ================================================

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

  // 기본 스타일
  viewerEl.style.touchAction = "none";
  stageEl.style.transformOrigin = "0 0";

  apply();
}

export function initializeFundalReflexPdf() {
  showOnlyPage("fundalReflexPdfPage");
  const page = document.getElementById("fundalReflexPdfPage");
  if (!page) return;

  const viewer = page.querySelector("#fundalPdfViewer");
  if (!viewer) return;

  // Build DOM inside viewer
  // Build DOM inside viewer (INLINE SVG for crisp zoom)
  viewer.innerHTML = `
    <div id="fundalPdfStage" style="
      position:absolute;
      left:0; top:0;
      transform-origin: 0 0;
    "></div>
  `;

  // Fetch SVG text and inline it so scaling stays vector-crisp
  fetch("images/pdf/Workshop/Childhood/FundalPDF.svg")
    .then((r) => r.text())
    .then((svgText) => {
      stage.innerHTML = svgText;

      const svgEl = stage.querySelector("svg");
      if (svgEl) {
        // Make it fill the viewport width initially
        svgEl.style.display = "block";
        svgEl.style.width = "100vw";
        svgEl.style.height = "auto";
        svgEl.style.maxWidth = "none";

        // Prevent selection/drag quirks
        svgEl.style.userSelect = "none";
        svgEl.style.pointerEvents = "none";
      }

      applyTransform(); // ensure initial transform is applied after insertion
    })
    .catch((err) => console.error("[fundalPdf] failed to load SVG:", err));

  // Layout viewer fullscreen under a fixed 62px topbar
  viewer.style.position = "fixed";
  viewer.style.left = "0";
  viewer.style.right = "0";
  viewer.style.top = "62px";
  viewer.style.bottom = "0";
  viewer.style.overflow = "hidden";
  viewer.style.background = "#fff";
  viewer.style.touchAction = "none"; // required for custom pan/pinch

  const stage = page.querySelector("#fundalPdfStage");
  if (!stage) return;

  // Transform state
  let scale = 1;
  let tx = 0;
  let ty = 0;

  function applyTransform() {
    stage.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  // Clamp scale so it doesn't get silly
  function clampScale(next) {
    return Math.max(0.6, Math.min(6, next));
  }

  // ------- Mouse / trackpad wheel zoom -------
  viewer.addEventListener(
    "wheel",
    (e) => {
      // If you want zoom only on ctrl/cmd wheel, uncomment this:
      // if (!e.ctrlKey && !e.metaKey) return;

      e.preventDefault();

      const rect = viewer.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      const prev = scale;
      const delta = e.deltaY;
      const next = clampScale(prev * (delta > 0 ? 0.9 : 1.1));
      if (next === prev) return;

      // Zoom around cursor
      const k = next / prev;
      tx = cx - k * (cx - tx);
      ty = cy - k * (cy - ty);
      scale = next;
      applyTransform();
    },
    { passive: false },
  );

  // ------- Drag pan (mouse or single finger) -------
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragTx0 = 0;
  let dragTy0 = 0;

  // ------- Pinch zoom (two pointers) -------
  const pointers = new Map(); // pointerId -> {x,y}
  let pinchStartDist = 0;
  let pinchStartScale = 1;
  let pinchCenter0 = null; // {x,y}
  let pinchTx0 = 0;
  let pinchTy0 = 0;

  function dist(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  }

  function center(a, b) {
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  }

  viewer.addEventListener("pointerdown", (e) => {
    viewer.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 1) {
      // start drag
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragTx0 = tx;
      dragTy0 = ty;
    }

    if (pointers.size === 2) {
      // start pinch
      isDragging = false;

      const pts = Array.from(pointers.values());
      pinchStartDist = dist(pts[0], pts[1]);
      pinchStartScale = scale;

      const rect = viewer.getBoundingClientRect();
      pinchCenter0 = center(
        { x: pts[0].x - rect.left, y: pts[0].y - rect.top },
        { x: pts[1].x - rect.left, y: pts[1].y - rect.top },
      );

      pinchTx0 = tx;
      pinchTy0 = ty;
    }
  });

  viewer.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 1 && isDragging) {
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      tx = dragTx0 + dx;
      ty = dragTy0 + dy;
      applyTransform();
      return;
    }

    if (pointers.size === 2) {
      const pts = Array.from(pointers.values());
      const d = dist(pts[0], pts[1]);
      if (!pinchStartDist) return;

      const rect = viewer.getBoundingClientRect();
      const c = center(
        { x: pts[0].x - rect.left, y: pts[0].y - rect.top },
        { x: pts[1].x - rect.left, y: pts[1].y - rect.top },
      );

      const nextScale = clampScale(pinchStartScale * (d / pinchStartDist));
      const prevScale = scale;

      // keep zoom anchored around initial pinch centre
      const k = nextScale / prevScale;

      tx = pinchCenter0.x - k * (pinchCenter0.x - pinchTx0);
      ty = pinchCenter0.y - k * (pinchCenter0.y - pinchTy0);

      scale = nextScale;
      applyTransform();
    }
  });

  function endPointer(e) {
    pointers.delete(e.pointerId);
    if (pointers.size === 0) {
      isDragging = false;
      pinchStartDist = 0;
      pinchCenter0 = null;
    }
    if (pointers.size === 1) {
      // if one pointer remains, allow dragging again
      const only = Array.from(pointers.values())[0];
      isDragging = true;
      dragStartX = only.x;
      dragStartY = only.y;
      dragTx0 = tx;
      dragTy0 = ty;
      pinchStartDist = 0;
      pinchCenter0 = null;
    }
  }

  viewer.addEventListener("pointerup", endPointer);
  viewer.addEventListener("pointercancel", endPointer);

  // Start at default transform
  applyTransform();

  // Download button: using native <a download>, but keep it robust
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

  // 중복 initialise 방지
  if (viewer.dataset.inited === "1") return;
  viewer.dataset.inited = "1";

  // fundalReflexPdf.html의 구조처럼 topbar 아래를 풀스크린 뷰어로 사용 :contentReference[oaicite:1]{index=1}
  viewer.style.position = "fixed";
  viewer.style.left = "0";
  viewer.style.right = "0";
  viewer.style.top = "62px";
  viewer.style.bottom = "0";
  viewer.style.overflow = "hidden";
  viewer.style.background = "#fff";

  viewer.innerHTML = `
    <div class="atoms-stage" style="position:absolute; left:0; top:0;">
      <img
        src="${imgSrc}"
        alt="ATOMS handout"
        draggable="false"
        style="
          display:block;
          width:100vw;
          height:auto;
          max-width:none;
          user-select:none;
          -webkit-user-drag:none;
          pointer-events:none;
        "
      />
    </div>
  `;

  const stage = viewer.querySelector(".atoms-stage");
  if (!stage) return;

  setupPanZoomForStage(viewer, stage);
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
