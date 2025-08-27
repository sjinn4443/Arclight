// "Atoms Card" Table of Contents functionality

// js/toc.js (ES module)
import { showPage } from './navigation.js';

// Public API
export function initializeTOC() {
  const tocToggleBtn = document.getElementById('tocToggleBtn');
  if (tocToggleBtn) tocToggleBtn.addEventListener('click', openTOC);

  const closeTOCBtn = document.getElementById('closeTOCBtn');
  if (closeTOCBtn) closeTOCBtn.addEventListener('click', closeTOC);

  const eyesBtn = document.getElementById('eyesTab');
  if (eyesBtn) eyesBtn.addEventListener('click', () => showTOC('eyes'));

  const earsBtn = document.getElementById('earsTab');
  if (earsBtn) earsBtn.addEventListener('click', () => showTOC('ears'));

  const tocList = document.getElementById('tocList');
  if (tocList) tocList.addEventListener('click', handleTOCItemClick);

  // Optional: if user lands here from menu, default to eyes TOC populated
  if (document.getElementById('atomsCardPage')) {
    showTOC('eyes');
  }
}

export function goToAtomsCard(type = 'eyes') {
  showPage('atomsCardPage');
  openTOC();
  const atomsImageContainer = document.getElementById('atomsImageContainer');
  if (atomsImageContainer) atomsImageContainer.innerHTML = '';
  showTOC(type);
}

/* --------------------------- internal helpers --------------------------- */

let currentTOCType = 'eyes';

function openTOC() {
  const dropdown = document.getElementById('tocDropdown');
  if (!dropdown) return;
  dropdown.classList.remove('hidden', 'slide-up');
  dropdown.classList.add('active');

  const closeBtn = document.getElementById('closeTOCBtn');
  const toggleBtn = document.getElementById('tocToggleBtn');
  if (closeBtn) closeBtn.style.display = 'block';
  if (toggleBtn) toggleBtn.style.display = 'none';
}

function closeTOC() {
  const dropdown = document.getElementById('tocDropdown');
  if (!dropdown) return;
  dropdown.classList.add('slide-up');
  dropdown.classList.remove('active');

  setTimeout(() => {
    dropdown.classList.add('hidden');
    dropdown.classList.remove('slide-up');
  }, 300);

  const closeBtn = document.getElementById('closeTOCBtn');
  const toggleBtn = document.getElementById('tocToggleBtn');
  if (closeBtn) closeBtn.style.display = 'none';
  if (toggleBtn) toggleBtn.style.display = 'block';
}

function setActiveTab(type) {
  const eyesBtn = document.getElementById('eyesTab');
  const earsBtn = document.getElementById('earsTab');
  if (eyesBtn && earsBtn) {
    eyesBtn.classList.toggle('active', type === 'eyes');
    earsBtn.classList.toggle('active', type === 'ears');
  }
}

function showTOC(type = 'eyes') {
  currentTOCType = type;
  setActiveTab(type);

  const tocList = document.getElementById('tocList');
  if (!tocList) return;
  tocList.innerHTML = '';

  const content = {
    eyes: ['Anatomy','Arclight','Front of Eye Case Test','Child','Front of Eye','Fundal Reflex','Fundus','Glaucoma','How to Check for Eyeglasses','How to Use','Lens','Pupil','Red Eye','Summary','Vision Loss'],
    ears: ['Anatomy','Childhood Hearing Development','Ear Drum','External Ear: Pinna'],
  };
  const items = type === 'eyes' ? content.eyes : content.ears;
  items.sort().forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    tocList.appendChild(li);
  });

  const imgBox = document.getElementById('atomsImageContainer');
  if (imgBox) imgBox.innerHTML = '';
}

function handleTOCItemClick(e) {
  if (e.target.tagName !== 'LI') return;

  const topic = e.target.textContent.trim();
  const container = document.getElementById('atomsImageContainer');
  if (!container) return;
  container.innerHTML = '';

  if (topic === 'Anatomy') {
    if (currentTOCType === 'ears') {
      displayImage('images/EarAnatomy.png', 'Ear Anatomy', container);
    } else {
      displayImage('images/Anatomy1.png', 'Eye Anatomy 1', container);
      displayImage('images/Anatomy2.png', 'Eye Anatomy 2', container);
    }
    return;
  }

  const filenameMap = {
    "Arclight": "Arclight.png",
    "Front of Eye Case Test": "CaseStudy.png",
    "Child": "Child.png",
    "Front of Eye": "FrontOfEye.png",
    "Fundal Reflex": "FundalReflex.png",
    "Fundus": "Fundus.png",
    "Glaucoma": "Glaucoma.png",
    "How to Check for Eyeglasses": "Refract.png",
    "How to Use": "HowToUse.png",
    "Lens": "Lens.png",
    "Pupil": "Pupil.png",
    "Red Eye": "RedEye.png",
    "Summary": "Summary.png",
    "Vision Loss": "Summary.png",
    "Ear Drum": "Drum.png",
    "External Ear: Pinna": "Ear.png",
    "Childhood Hearing Development": "EarChild.png",
  };
  const filename = filenameMap[topic] || `${topic.replace(/\s/g, '')}.png`;
  const img = displayImage(`images/${filename}`, topic, container);

  // Rotate certain tall images (matches your legacy behavior)
  if (['CaseStudy','FundalReflex'].includes(topic.replace(/\s/g, ''))) {
    img.style.transform = 'rotate(90deg)';
  }
}

/**
 * Lightweight image helper (mirrors your legacy displayImage).
 */
function displayImage(src, alt, container) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.style.maxWidth = '100%';
  img.style.maxHeight = '100%';
  img.style.objectFit = 'contain';
  img.style.borderRadius = '12px';
  img.style.marginBottom = '10px';
  container.appendChild(img);
  return img;
}

// Expose for menu shortcuts, if you have any inline calls in HTML elsewhere.
window.goToAtomsCard = goToAtomsCard;
