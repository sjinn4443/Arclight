export function initializeAtomsCard() {}


// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: initializeTOC, goToAtomsCard, openTOC, closeTOC, showTOC, handleTOCItemClick, displayImage

function initializeTOC() {
  const tocToggleBtn = document.getElementById('tocToggleBtn');
  if (tocToggleBtn) {
    tocToggleBtn.addEventListener('click', openTOC);
  }

  const closeTOCBtn = document.getElementById('closeTOCBtn');
  if (closeTOCBtn) {
    closeTOCBtn.addEventListener('click', closeTOC);
  }

  const eyesBtn = document.getElementById('eyesTab');
  if (eyesBtn) {
    eyesBtn.addEventListener('click', () => showTOC('eyes'));
  }

  const earsBtn = document.getElementById('earsTab');
  if (earsBtn) {
    earsBtn.addEventListener('click', () => showTOC('ears'));
  }

  const tocList = document.getElementById('tocList');
  if (tocList) {
    tocList.addEventListener('click', handleTOCItemClick);
  }
}

function goToAtomsCard(type = 'eyes') {
  showPage('atomsCardPage');
  openTOC();

  const atomsImageContainer = document.getElementById('atomsImageContainer');
  if (atomsImageContainer) atomsImageContainer.innerHTML = '';

  showTOC(type);
}

function openTOC() {
  const dropdown = document.getElementById('tocDropdown');
  if (!dropdown) return;
  dropdown.classList.remove('hidden', 'slide-up');
  dropdown.classList.add('active');

  document.getElementById('closeTOCBtn').style.display = 'block';
  document.getElementById('tocToggleBtn').style.display = 'none';
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

  document.getElementById('closeTOCBtn').style.display = 'none';
  document.getElementById('tocToggleBtn').style.display = 'block';
}

function showTOC(type = 'eyes') {
  currentTOCType = type;
  setActiveTab(type);

  const tocList = document.getElementById('tocList');
  tocList.innerHTML = '';

  const content = {
    eyes: ['Anatomy', 'Arclight', 'Front of Eye Case Test', 'Child', 'Front of Eye', 'Fundal Reflex', 'Fundus', 'Glaucoma', 'How to Check for Eyeglasses', 'How to Use', 'Lens', 'Pupil', 'Red Eye', 'Summary', 'Vision Loss'],
    ears: ['Anatomy', 'Childhood Hearing Development', 'Ear Drum', 'External Ear: Pinna']
  };

  const items = (type === 'eyes' ? content.eyes : content.ears);
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
  container.innerHTML = ''; // Clear previous content

  // Special handling for Anatomy which has different images for eyes and ears
  if (topic === 'Anatomy') {
    if (currentTOCType === 'ears') {
      displayImage('images/EarAnatomy.png', 'Ear Anatomy', container);
    } else {
      displayImage('images/Anatomy1.png', 'Eye Anatomy 1', container);
      displayImage('images/Anatomy2.png', 'Eye Anatomy 2', container);
    }
  } else {
    // Default case for all other topics
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

    if (['CaseStudy', 'FundalReflex'].includes(topic.replace(/\s/g, ''))) {
      img.style.transform = 'rotate(90deg)';
    }
  }

  // ✅ KEEP THE TOC OPEN: Don't auto-close the dropdown
  // closeTOC(); ← removed
}

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