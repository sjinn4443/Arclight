/**
 * @fileoverview This file contains atomscard related functions and logic, handling image display based on selected tabs (Eyes/Ears) and Table of Contents (TOC) interactions.
 */
//
import { ATOMS_CARD_OUTLINES } from "./atomsCardOutlines.js";

let currentTOCType = "eyes";
let currentAtomsZoom = 1;
let currentAtomsTopic = "";
let tocCloseTimer;
let layoutObserver;
let observedRoot;

function isDesktopWorkspace() {
  return (
    innerWidth >= 1024 &&
    Boolean(
      document.getElementById("atomsCardPage")?.closest("#unifiedDashboard"),
    )
  );
}

function positionAtomsNavigation() {
  const root = document.getElementById("atomsCardPage");
  const image = root?.querySelector("#atomsImageContainer img");
  if (!image || !image.complete || !image.naturalWidth || !isDesktopWorkspace())
    return;
  const page = root.getBoundingClientRect();
  const art = image.getBoundingClientRect();
  const viewport = root
    .querySelector("#atomsImageContainer")
    .getBoundingClientRect();
  const left = Math.max(art.left, viewport.left);
  const right = Math.min(art.right, viewport.right);
  const width =
    root.querySelector("#atomsNextCardBtn").getBoundingClientRect().width || 56;
  root.style.setProperty(
    "--atoms-prev-x",
    `${Math.max(viewport.left - page.left, left - page.left - width - 12)}px`,
  );
  root.style.setProperty(
    "--atoms-next-x",
    `${Math.min(viewport.right - page.left - width, right - page.left + 12)}px`,
  );
  root.style.setProperty(
    "--atoms-nav-y",
    `${art.top - page.top + art.height / 2}px`,
  );
}

function observeAtomsImage(image) {
  const root = document.getElementById("atomsCardPage");
  layoutObserver?.disconnect();
  observedRoot = root;
  if (typeof ResizeObserver !== "undefined") {
    layoutObserver ||= new ResizeObserver(positionAtomsNavigation);
    layoutObserver.observe(image);
    layoutObserver.observe(root.querySelector("#atomsImageContainer"));
  }
  const reveal = () =>
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (
          !root.isConnected ||
          root.querySelector("#atomsImageContainer img") !== image ||
          !image.naturalWidth
        )
          return;
        positionAtomsNavigation();
        root.classList.add("atoms-layout-ready");
      }),
    );
  if (image.decode)
    void image
      .decode()
      .then(reveal)
      .catch(() => {});
  image.addEventListener("load", reveal, { once: true });
}

window.addEventListener("page:loaded", () => {
  if (observedRoot && !observedRoot.isConnected) {
    layoutObserver?.disconnect();
    observedRoot = null;
  }
});

// Items derived from the legacy handler mapping.
const ATOMS_TOC_ITEMS = {
  eyes: [
    "Red Eye",
    "Vision Changes",
    "Trauma",
    "Eyelids",
    "How to Check for Eyeglasses",
    "Cornea",
    "Lens",
    "Fundal Reflex",
    "Fundus",
    "Fundus 2",
    "Child",
    "Glaucoma",
    "Neurology",
    "Squint",
    "Tropical",
    "Anatomy",
  ],
  ears: [
    "ENT",
    "External Ear: Pinna",
    "Canal",
    "Ear Drum",
    "Childhood Hearing Development",
    "Hearing Loss",
    "Hearing Aids",
    "Anatomy",
  ],
};

const ATOMS_FILENAME_MAP = {
  Arclight: "Arclight.webp",
  "Front of Eye Case Test": "CaseStudy.webp",
  Child: "Child.webp",
  Cornea: "Cornea.webp",
  Eyelids: "Eyelids.webp",
  "Front of Eye": "FrontOfEye.webp",
  "Fundal Reflex": "FundalReflex.webp",
  Fundus: "Fundus.webp",
  "Fundus 2": "Fundus2.webp",
  Glaucoma: "Glaucoma.webp",
  "How to Check for Eyeglasses": "Refract.webp",
  "How to Use": "HowToUse.webp",
  Lens: "Lens.webp",
  Neurology: "Neurology.webp",
  Pupil: "Pupil.webp",
  "Red Eye": "RedEye.webp",
  Summary: "Summary.webp",
  Squint: "Squint.webp",
  Trauma: "Trauma.webp",
  Tropical: "Tropical.webp",
  "Vision Changes": "VisionChanges.webp",
  "Vision Loss": "Summary.webp",
  ENT: "EarENT.webp",
  Canal: "EarCanal.webp",
  "Ear Drum": "Drum.webp",
  "External Ear: Pinna": "Ear.webp",
  "Childhood Hearing Development": "EarChildDevelopment.webp",
  "Hearing Loss": "HearingLoss.webp",
  "Hearing Aids": "HearingAids.webp",
};

function getCurrentAtomsItems() {
  return ATOMS_TOC_ITEMS[currentTOCType] || ATOMS_TOC_ITEMS.eyes;
}

function clampAtomsZoom(value) {
  return Math.max(0.6, Math.min(2.6, value));
}

function applyAtomsZoom() {
  const container = document.getElementById("atomsImageContainer");
  if (!container) return;
  container.querySelectorAll(".atoms-card-image-frame").forEach((frame) => {
    const isRotated = frame.classList.contains(
      "atoms-card-image-frame--rotated",
    );
    const rotatedHeightCap = Math.max(320, window.innerHeight - 126);
    const maxWidth = isRotated
      ? Math.min(
          Math.round(rotatedHeightCap * currentAtomsZoom),
          Math.round(currentAtomsZoom * 1200),
        )
      : Math.round(currentAtomsZoom * 1200);
    frame.style.width = `${(currentAtomsZoom * 100).toFixed(0)}%`;
    frame.style.maxWidth = `${maxWidth}px`;
  });
  requestAnimationFrame(positionAtomsNavigation);
}

function resetAtomsZoom() {
  currentAtomsZoom = 1;
  applyAtomsZoom();
}

function zoomAtomsBy(delta) {
  currentAtomsZoom = clampAtomsZoom(currentAtomsZoom + delta);
  applyAtomsZoom();
}

function setActiveTab(type) {
  const eyesBtn = document.getElementById("eyesTab");
  const earsBtn = document.getElementById("earsTab");
  if (eyesBtn && earsBtn) {
    eyesBtn.classList.toggle("active", type === "eyes");
    earsBtn.classList.toggle("active", type === "ears");
  }
}

function updateAtomsTitle(topic = currentAtomsTopic) {
  const title = document.querySelector(".atoms-title-bar");
  if (!title) return;

  if (topic) {
    title.removeAttribute("data-i18n");
    title.setAttribute("data-i18n-skip", "true");
  } else {
    title.setAttribute("data-i18n", "atomsCardTitle");
    title.removeAttribute("data-i18n-skip");
  }
  title.textContent = "";

  const base = document.createElement("span");
  base.className = "atoms-title-bar__base";
  base.textContent = translateAtomsLabel("Atoms Card");
  title.appendChild(base);

  if (!topic) return;

  const selected = document.createElement("span");
  selected.className = "atoms-title-bar__selected";
  selected.textContent = ` - ${translateAtomsLabel(topic)}`;
  title.appendChild(selected);
}

function translateAtomsLabel(label) {
  return window.I18N?.translateLiteral?.(label, label) || label;
}

function updateTOCSelection() {
  const tocList = document.getElementById("tocList");
  if (!tocList) return;

  tocList.querySelectorAll("li").forEach((li) => {
    li.classList.toggle("is-selected", li.dataset.topic === currentAtomsTopic);
    if (li.dataset.topic === currentAtomsTopic)
      li.setAttribute("aria-current", "page");
    else li.removeAttribute("aria-current");
  });
}

function getAdjacentAtomsTopic(direction) {
  const items = getCurrentAtomsItems();
  const currentIndex = items.indexOf(currentAtomsTopic);
  if (currentIndex === -1) return "";
  return items[currentIndex + direction] || "";
}

function updateAtomsNavigation() {
  const root = document.getElementById("atomsCardPage");
  const prevBtn = document.getElementById("atomsPrevCardBtn");
  const nextBtn = document.getElementById("atomsNextCardBtn");
  if (!root || !prevBtn || !nextBtn) return;

  const hasTopic = Boolean(currentAtomsTopic);
  root.classList.toggle("atoms-card-page--has-topic", hasTopic);

  const prevTopic = getAdjacentAtomsTopic(-1);
  const nextTopic = getAdjacentAtomsTopic(1);
  const prevLabel = prevTopic
    ? `Previous: ${translateAtomsLabel(prevTopic)}`
    : "Previous Atoms card";
  const nextLabel = nextTopic
    ? `Next: ${translateAtomsLabel(nextTopic)}`
    : "Next Atoms card";

  prevBtn.disabled = !prevTopic;
  prevBtn.setAttribute("aria-label", prevLabel);
  prevBtn.title = prevLabel;

  nextBtn.disabled = !nextTopic;
  nextBtn.setAttribute("aria-label", nextLabel);
  nextBtn.title = nextLabel;
}

function setCurrentAtomsTopic(topic = "") {
  currentAtomsTopic = topic;
  updateAtomsTitle(topic);
  updateTOCSelection();
  updateAtomsNavigation();
}

function openTOC() {
  const dropdown = document.getElementById("tocDropdown");
  if (!dropdown) return;
  clearTimeout(tocCloseTimer);
  dropdown.classList.remove("hidden", "slide-up");
  dropdown.classList.add("active");
  dropdown.setAttribute("aria-hidden", "false");
  dropdown.inert = false;

  const closeBtn = document.getElementById("closeTOCBtn");
  const toggleBtn = document.getElementById("tocToggleBtn");
  if (closeBtn) closeBtn.style.display = "block";
  if (toggleBtn) {
    toggleBtn.style.display = "none";
    toggleBtn.setAttribute("aria-expanded", "true");
  }
  dropdown
    .querySelector(
      isDesktopWorkspace()
        ? "#eyesTab.active, #earsTab.active"
        : "#tocInlineCloseBtn",
    )
    ?.focus({ preventScroll: true });
}

function closeTOC() {
  // Desktop keeps its contents rail open; mobile retains its overlay controls.
  if (isDesktopWorkspace()) return;
  const dropdown = document.getElementById("tocDropdown");
  if (!dropdown) return;
  clearTimeout(tocCloseTimer);
  dropdown.classList.add("slide-up");
  dropdown.classList.remove("active");
  dropdown.setAttribute("aria-hidden", "true");
  dropdown.inert = true;

  tocCloseTimer = setTimeout(() => {
    dropdown.classList.add("hidden");
    dropdown.classList.remove("slide-up");
  }, 300);

  const closeBtn = document.getElementById("closeTOCBtn");
  const toggleBtn = document.getElementById("tocToggleBtn");
  if (closeBtn) closeBtn.style.display = "none";
  if (toggleBtn) {
    toggleBtn.style.display = "block";
    toggleBtn.setAttribute("aria-expanded", "false");
    if (dropdown.contains(document.activeElement))
      toggleBtn.focus({ preventScroll: true });
  }
}

function displayImage(src, alt, container) {
  const frame = document.createElement("div");
  frame.className = "atoms-card-image-frame";

  const img = document.createElement("img");
  img.src = src;
  const outline = ATOMS_CARD_OUTLINES[src.split("/").pop()];
  if (outline) img.style.setProperty("--atoms-art-outline", outline);
  img.alt = alt;
  img.style.width = "100%";
  img.style.maxWidth = "100%";
  img.style.maxHeight = "100%";
  img.style.objectFit = "contain";
  img.style.borderRadius = "12px";
  img.style.marginBottom = "10px";
  frame.appendChild(img);
  container.appendChild(frame);
  observeAtomsImage(img);
  applyAtomsZoom();
  return img;
}

function showTOC(type = "eyes") {
  currentTOCType = type;
  setActiveTab(type);

  const tocList = document.getElementById("tocList");
  if (!tocList) return;
  tocList.innerHTML = "";

  const items = getCurrentAtomsItems();

  items.forEach((item) => {
    const li = document.createElement("li");
    li.dataset.topic = item;
    li.textContent = translateAtomsLabel(item);
    li.tabIndex = 0;
    li.setAttribute("role", "button");
    tocList.appendChild(li);
  });

  try {
    window.I18N?.applyTranslations?.(tocList);
  } catch {
    void 0;
  }

  const imgBox = document.getElementById("atomsImageContainer");
  if (imgBox) imgBox.innerHTML = "";
  setCurrentAtomsTopic("");
  resetAtomsZoom();
  if (isDesktopWorkspace()) showAtomsTopic(items[0]);
}

function showAtomsTopic(topic) {
  document
    .getElementById("atomsCardPage")
    ?.classList.remove("atoms-layout-ready");
  setCurrentAtomsTopic(topic);
  const container = document.getElementById("atomsImageContainer");
  if (!container) return;
  container.innerHTML = "";

  // Special handling for Anatomy (different for eyes vs ears)
  if (topic === "Anatomy") {
    if (currentTOCType === "ears") {
      displayImage(
        "images/atoms/EarAnatomy.webp",
        translateAtomsLabel("Ear Anatomy"),
        container,
      );
    } else {
      displayImage(
        "images/atoms/Anatomy1.webp",
        translateAtomsLabel("Eye Anatomy"),
        container,
      );
    }
  } else {
    const filename =
      ATOMS_FILENAME_MAP[topic] || `${topic.replace(/\s/g, "")}.png`;

    // Use the atoms subfolder now
    const img = displayImage(
      `images/atoms/${filename}`,
      translateAtomsLabel(topic),
      container,
    );

    // Rotate certain images like the legacy app
    const key = topic.replace(/\s/g, "");
    if (key === "CaseStudy") {
      img.parentElement?.classList.add("atoms-card-image-frame--rotated");
      img.style.transform = "rotate(90deg)";
      img.style.marginBottom = "0";
      applyAtomsZoom();
    }
  }
}

function handleTOCItemClick(e) {
  const itemEl = e?.target?.closest?.("li");
  if (!itemEl) return;

  const topic = itemEl.dataset.topic || itemEl.textContent.trim();
  showAtomsTopic(topic);
  if (!isDesktopWorkspace()) closeTOC();
}

function navigateAtomsCard(direction) {
  const topic = getAdjacentAtomsTopic(direction);
  if (!topic) return;
  showAtomsTopic(topic);
  if (!isDesktopWorkspace()) closeTOC();
}

function initializeAtomsZoomControls() {
  const container = document.getElementById("atomsImageContainer");
  if (container) container.dataset.buttonZoom = "1";

  const zoomOut = document.getElementById("atomsZoomOutBtn");
  const zoomIn = document.getElementById("atomsZoomInBtn");

  if (zoomOut && zoomOut.dataset.wired !== "1") {
    zoomOut.dataset.wired = "1";
    zoomOut.addEventListener("click", () => zoomAtomsBy(-0.18));
  }

  if (zoomIn && zoomIn.dataset.wired !== "1") {
    zoomIn.dataset.wired = "1";
    zoomIn.addEventListener("click", () => zoomAtomsBy(0.18));
  }
}

function initializeAtomsNavigationControls() {
  const prevBtn = document.getElementById("atomsPrevCardBtn");
  const nextBtn = document.getElementById("atomsNextCardBtn");

  if (prevBtn && prevBtn.dataset.wired !== "1") {
    prevBtn.dataset.wired = "1";
    prevBtn.addEventListener("click", () => navigateAtomsCard(-1));
  }

  if (nextBtn && nextBtn.dataset.wired !== "1") {
    nextBtn.dataset.wired = "1";
    nextBtn.addEventListener("click", () => navigateAtomsCard(1));
  }

  updateAtomsNavigation();
}

function syncAtomsViewport() {
  const root = document.getElementById("atomsCardPage");
  if (!root) return;
  if (isDesktopWorkspace() && !root.querySelector("#tocDropdown.active"))
    openTOC();
  applyAtomsZoom();
}

function initializeTOC() {
  const tocToggleBtn = document.getElementById("tocToggleBtn");
  if (tocToggleBtn) {
    tocToggleBtn.addEventListener("click", () => {
      if (
        isDesktopWorkspace() &&
        document.getElementById("tocDropdown")?.classList.contains("active")
      )
        closeTOC();
      else openTOC();
    });
  }

  const closeTOCBtn = document.getElementById("closeTOCBtn");
  if (closeTOCBtn) {
    closeTOCBtn.addEventListener("click", closeTOC);
  }

  const tocInlineCloseBtn = document.getElementById("tocInlineCloseBtn");
  if (tocInlineCloseBtn) {
    tocInlineCloseBtn.addEventListener("click", closeTOC);
  }

  const eyesBtn = document.getElementById("eyesTab");
  if (eyesBtn) {
    eyesBtn.addEventListener("click", () => showTOC("eyes"));
  }

  const earsBtn = document.getElementById("earsTab");
  if (earsBtn) {
    earsBtn.addEventListener("click", () => showTOC("ears"));
  }

  const tocList = document.getElementById("tocList");
  if (tocList) {
    tocList.addEventListener("click", handleTOCItemClick);
    tocList.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleTOCItemClick(event);
      }
    });
  }
}

/**
 * Public initializer called from main.js when atomsCardPage is loaded.
 */
export function initializeAtomsCard() {
  const root = document.getElementById("atomsCardPage");
  if (!root || root.dataset.init === "1") return;
  root.dataset.init = "1";
  root.addEventListener("dw:mounted", () => {
    if (isDesktopWorkspace()) openTOC();
  });
  root.addEventListener("keydown", (event) => {
    if (
      !isDesktopWorkspace() &&
      event.key === "Escape" &&
      root.querySelector("#tocDropdown.active")
    ) {
      event.preventDefault();
      closeTOC();
    }
  });

  initializeTOC();
  initializeAtomsZoomControls();
  initializeAtomsNavigationControls();
  window.addEventListener("resize", syncAtomsViewport, { passive: true });

  // Desktop shows the first real card beside its persistent topic panel.
  // Mobile retains the original empty image area until a topic is chosen.
  openTOC();
  showTOC("eyes");
}

// Support direct navigation
export function goToAtomsCard(type = "eyes") {
  const evt = new CustomEvent("page:navigate", {
    detail: { pageId: "atomsCardPage" },
  });
  window.dispatchEvent(evt);
  openTOC();
  const box = document.getElementById("atomsImageContainer");
  if (box) box.innerHTML = "";
  showTOC(type);
}
