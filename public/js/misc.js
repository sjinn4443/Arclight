/**
 * @fileoverview This file contains misc related functions and initializers for various UI elements, such as search bar toggling and image zoom functionality.
 */

/**
 * Initializes miscellaneous UI elements and their functionalities.
 * Currently handles the search bar toggle behavior.
 */
export function initializeMisc() {
  // search bar toggle (example)
  const search = document.getElementById("searchCourses");
  const fixed = document.getElementById("fixedSearchContainer");
  if (search && fixed) {
    search.addEventListener("focus", () => (fixed.style.display = "block"));
  }
}

// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: initializeMisc

/**
 * Implementation for miscellaneous initializations, including image zoom for Atoms Card and Ear Health images.
 * This function is part of the auto-migrated legacy script.
 */
function initializeMiscImpl() {
  // Atom image zoom
  const atomsImgContainer = document.getElementById("atomsImageContainer");
  if (atomsImgContainer) {
    atomsImgContainer.addEventListener("click", (e) => {
      if (e.target.tagName === "IMG") {
        e.target.classList.toggle("zoomed");
      }
    });
  }

  // Ear health image zoom
  const earHealthImage = document.getElementById("earHealthImage");
  if (earHealthImage) {
    let zoomLevel = 1.0; // Initialize zoom level
    document.addEventListener(
      "wheel",
      function (e) {
        if (!earHealthImage.closest(".page.active")) return;
        e.preventDefault();
        zoomLevel =
          e.deltaY < 0 ? zoomLevel + 0.1 : Math.max(0.5, zoomLevel - 0.1);
        earHealthImage.style.transform = `scale(${zoomLevel})`;
      },
      { passive: false },
    );
  }
}
