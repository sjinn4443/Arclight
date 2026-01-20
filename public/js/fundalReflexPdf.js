// ================================================
// FILE: public/js/fundalReflexPdf.js
// ================================================

export function initializeFundalReflexPdf() {
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
