/**
 * @fileoverview This file contains atomscard related functions and logic, handling image display based on selected tabs (Eyes/Ears) and Table of Contents (TOC) interactions.
 */
//
let currentTOCType = "eyes";

function setActiveTab(type) {
  const eyesBtn = document.getElementById("eyesTab");
  const earsBtn = document.getElementById("earsTab");
  if (eyesBtn && earsBtn) {
    eyesBtn.classList.toggle("active", type === "eyes");
    earsBtn.classList.toggle("active", type === "ears");
  }
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
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.style.maxWidth = "100%";
  img.style.maxHeight = "100%";
  img.style.objectFit = "contain";
  img.style.borderRadius = "12px";
  img.style.marginBottom = "10px";
  container.appendChild(img);
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
    "Anatomy",
    "Arclight",
    "Front of Eye Case Test",
    "Child",
    "Front of Eye",
    "Fundal Reflex",
    "Fundus",
    "Glaucoma",
    "How to Check for Eyeglasses",
    "How to Use",
    "Lens",
    "Pupil",
    "Red Eye",
    "Summary",
    "Vision Loss",
  ];

  const earsItems = [
    "Anatomy",
    "Childhood Hearing Development",
    "Ear Drum",
    "External Ear: Pinna",
  ];

  const items = type === "ears" ? earsItems : eyesItems;

  items.sort().forEach((item) => {
    const li = document.createElement("li");
    li.dataset.topic = item;
    li.textContent = item;
    tocList.appendChild(li);
  });

  try {
    window.I18N?.applyTranslations?.(tocList);
  } catch {
    void 0;
  }

  const imgBox = document.getElementById("atomsImageContainer");
  if (imgBox) imgBox.innerHTML = "";
}

function handleTOCItemClick(e) {
  const itemEl = e?.target?.closest?.("li");
  if (!itemEl) return;

  const topic = itemEl.dataset.topic || itemEl.textContent.trim();
  const container = document.getElementById("atomsImageContainer");
  if (!container) return;
  container.innerHTML = "";

  // Special handling for Anatomy (different for eyes vs ears)
  if (topic === "Anatomy") {
    if (currentTOCType === "ears") {
      displayImage("images/atoms/EarAnatomy.webp", "Ear Anatomy", container);
    } else {
      displayImage("images/atoms/Anatomy1.webp", "Eye Anatomy 1", container);
      displayImage("images/atoms/Anatomy2.webp", "Eye Anatomy 2", container);
    }
  } else {
    const filenameMap = {
      Arclight: "Arclight.webp",
      "Front of Eye Case Test": "CaseStudy.webp",
      Child: "Child.webp",
      "Front of Eye": "FrontOfEye.webp",
      "Fundal Reflex": "FundalReflex.webp",
      Fundus: "Fundus.webp",
      Glaucoma: "Glaucoma.webp",
      "How to Check for Eyeglasses": "Refract.webp",
      "How to Use": "HowToUse.webp",
      Lens: "Lens.webp",
      Pupil: "Pupil.webp",
      "Red Eye": "RedEye.webp",
      Summary: "Summary.webp",
      "Vision Loss": "Summary.webp",
      "Ear Drum": "Drum.webp",
      "External Ear: Pinna": "Ear.webp",
      "Childhood Hearing Development": "EarChild.webp",
    };

    const filename = filenameMap[topic] || `${topic.replace(/\s/g, "")}.png`;

    // Use the atoms subfolder now
    const img = displayImage(`images/atoms/${filename}`, topic, container);

    // Rotate certain images like the legacy app
    const key = topic.replace(/\s/g, "");
    if (["CaseStudy", "FundalReflex"].includes(key)) {
      img.style.transform = "rotate(90deg)";
    }
  }

  // Keep TOC open (legacy behavior)
  // closeTOC(); ← intentionally NOT called
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

  // Start with eyes tab and TOC visible, clear image area
  openTOC();
  showTOC("eyes");
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
  showTOC(type);
}
