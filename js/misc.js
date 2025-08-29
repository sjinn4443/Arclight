export function initializeMisc() {
  // search bar toggle (example)
  const search = document.getElementById('searchCourses');
  const fixed = document.getElementById('fixedSearchContainer');
  if (search && fixed) {
    search.addEventListener('focus', () => fixed.style.display = 'block');
  }
}


// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: initializeMisc

function initializeMiscImpl() {
  // Atom image zoom
  const atomsImgContainer = document.getElementById('atomsImageContainer');
  if (atomsImgContainer) {
    atomsImgContainer.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        e.target.classList.toggle('zoomed');
      }
    });
  }

  // Ear health image zoom
  const earHealthImage = document.getElementById('earHealthImage');
  if (earHealthImage) {
    document.addEventListener('wheel', function(e) {
      if (!earHealthImage.closest('.page.active')) return;
      e.preventDefault();
      zoomLevel = e.deltaY < 0 ? zoomLevel + 0.1 : Math.max(0.5, zoomLevel - 0.1);
      earHealthImage.style.transform = `scale(${zoomLevel})`;
    }, { passive: false });
  }
}