/**
 * @fileoverview This file contains atomscard related functions and logic, handling image display based on selected tabs (Eyes/Ears) and Table of Contents (TOC) interactions.
 */
//
let currentTOCType = "eyes";
let currentAtomsZoom = 1;
let currentAtomsTopic = "";

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
  const title = document.querySelector("#atomsCardPage .atoms-title-bar");
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
  });
}

function setCurrentAtomsTopic(topic = "") {
  currentAtomsTopic = topic;
  updateAtomsTitle(topic);
  updateTOCSelection();
}

function openTOC() {
  const dropdown = document.getElementById("tocDropdown");
  if (!dropdown) return;
  dropdown.classList.remove("hidden", "slide-up");
  dropdown.classList.add("active");

  const closeBtn = document.getElementById("closeTOCBtn");
  const toggleBtn = document.getElementById("tocToggleBtn");
  if (closeBtn) closeBtn.style.display = "block";
  if (toggleBtn) toggleBtn.style.display = "none";
}

function closeTOC() {
  const dropdown = document.getElementById("tocDropdown");
  if (!dropdown) return;
  dropdown.classList.add("slide-up");
  dropdown.classList.remove("active");

  setTimeout(() => {
    dropdown.classList.add("hidden");
    dropdown.classList.remove("slide-up");
  }, 300);

  const closeBtn = document.getElementById("closeTOCBtn");
  const toggleBtn = document.getElementById("tocToggleBtn");
  if (closeBtn) closeBtn.style.display = "none";
  if (toggleBtn) toggleBtn.style.display = "block";
}

function displayImage(src, alt, container) {
  const frame = document.createElement("div");
  frame.className = "atoms-card-image-frame";

  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.style.width = "100%";
  img.style.maxWidth = "100%";
  img.style.maxHeight = "100%";
  img.style.objectFit = "contain";
  img.style.borderRadius = "12px";
  img.style.marginBottom = "10px";
  frame.appendChild(img);
  container.appendChild(frame);
  applyAtomsZoom();
  return img;
}

function showTOC(type = "eyes") {
  currentTOCType = type;
  setActiveTab(type);

  const tocList = document.getElementById("tocList");
  if (!tocList) return;
  tocList.innerHTML = "";

  // Items derived from the legacy handler mapping
  const eyesItems = [
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
  ];

  const earsItems = [
    "ENT",
    "External Ear: Pinna",
    "Canal",
    "Ear Drum",
    "Childhood Hearing Development",
    "Hearing Loss",
    "Hearing Aids",
    "Anatomy",
  ];

  const items = type === "ears" ? earsItems : eyesItems;

  items.forEach((item) => {
    const li = document.createElement("li");
    li.dataset.topic = item;
    li.textContent = translateAtomsLabel(item);
    tocList.appendChild(li);
  });

  try {
    window.I18N?.applyTranslations?.(tocList);
  } catch {
    void 0;
  }

  const imgBox = document.getElementById("atomsImageContainer");
  if (imgBox) imgBox.innerHTML = "";
  updateTOCSelection();
  resetAtomsZoom();
}

function handleTOCItemClick(e) {
  const itemEl = e?.target?.closest?.("li");
  if (!itemEl) return;

  const topic = itemEl.dataset.topic || itemEl.textContent.trim();
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
        translateAtomsLabel("Eye Anatomy 1"),
        container,
      );
      displayImage(
        "images/atoms/Anatomy2.webp",
        translateAtomsLabel("Eye Anatomy 2"),
        container,
      );
    }
  } else {
    const filenameMap = {
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

    const filename = filenameMap[topic] || `${topic.replace(/\s/g, "")}.png`;

    // Use the atoms subfolder now
    const img = displayImage(
      `images/atoms/${filename}`,
      translateAtomsLabel(topic),
      container,
    );

    // Rotate certain images like the legacy app
    const key = topic.replace(/\s/g, "");
    if (["CaseStudy", "FundalReflex"].includes(key)) {
      img.parentElement?.classList.add("atoms-card-image-frame--rotated");
      img.style.transform = "rotate(90deg)";
      img.style.marginBottom = "0";
      applyAtomsZoom();
    }
  }

  closeTOC();
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

function initializeTOC() {
  const tocToggleBtn = document.getElementById("tocToggleBtn");
  if (tocToggleBtn) {
    tocToggleBtn.addEventListener("click", openTOC);
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
  }
}

/**
 * Public initializer called from main.js when atomsCardPage is loaded.
 */
export function initializeAtomsCard() {
  const root = document.getElementById("atomsCardPage");
  if (!root || root.dataset.init === "1") return;
  root.dataset.init = "1";

  initializeTOC();
  initializeAtomsZoomControls();
  window.addEventListener("resize", applyAtomsZoom, { passive: true });

  // Start with eyes tab and TOC visible, clear image area
  openTOC();
  showTOC("eyes");
  setCurrentAtomsTopic("");
  const box = document.getElementById("atomsImageContainer");
  if (box) box.innerHTML = "";
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
  setCurrentAtomsTopic("");
  showTOC(type);
}
