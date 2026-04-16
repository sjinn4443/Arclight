function updateWorkshopFolderItemBadges(page) {
  const folderRows = page.querySelectorAll(
    "#diabeticWorkshopFolders .diabetic-folder-row[data-folder]",
  );

  folderRows.forEach((row) => {
    const sectionKey = row.getAttribute("data-folder");
    if (!sectionKey) return;

    const section = page.querySelector(
      `.diabetic-section-card[data-section="${sectionKey}"]`,
    );
    if (!section) return;

    const itemCount = section.querySelectorAll(
      ".lesson-row[data-lesson]",
    ).length;
    const thumb = row.querySelector(".thumb");
    if (!thumb) return;

    let badge = thumb.querySelector(".diabetic-folder-item-count");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "diabetic-folder-item-count";
      thumb.appendChild(badge);
    }

    badge.textContent = String(itemCount);
    row.setAttribute("data-item-count", String(itemCount));
  });
}

function setupWorkshopFolders(page) {
  const folders = page.querySelectorAll(
    "#diabeticWorkshopFolders .diabetic-folder-row",
  );
  const sectionCards = page.querySelectorAll(".diabetic-section-card");
  const foldersContainer = page.querySelector("#diabeticWorkshopFolders");
  if (!foldersContainer) return;

  updateWorkshopFolderItemBadges(page);

  const hideAllSectionCards = () => {
    sectionCards.forEach((card) => {
      card.style.display = "none";
      const titleEl = card.querySelector("h3");
      titleEl?.querySelector(".see-all-toggle")?.remove();
    });
  };

  const showSectionByKey = (key) => {
    const card = page.querySelector(
      `.diabetic-section-card[data-section="${key}"]`,
    );
    const openFolderRow = page.querySelector(
      `#diabeticWorkshopFolders .diabetic-folder-row[data-folder="${key}"]`,
    );
    if (!card || !openFolderRow) return;

    hideAllSectionCards();
    folders.forEach((row) => {
      row.style.display = "";
    });

    openFolderRow.style.display = "none";
    page.classList.add("diabetic-folder-open");
    openFolderRow.insertAdjacentElement("afterend", card);
    card.style.display = "";

    const titleEl = card.querySelector("h3");
    if (!titleEl) return;

    titleEl.style.display = "flex";
    titleEl.style.alignItems = "center";
    titleEl.style.width = "100%";

    const toggle = document.createElement("span");
    toggle.className = "see-all-toggle";
    toggle.setAttribute("role", "button");
    toggle.setAttribute("tabindex", "0");
    toggle.setAttribute("aria-expanded", "true");
    toggle.textContent = "Close ^";
    toggle.style.marginLeft = "auto";
    toggle.style.marginRight = "30px";
    toggle.style.whiteSpace = "nowrap";

    const closeNow = (event) => {
      event.preventDefault();
      event.stopPropagation();
      card.style.display = "none";
      toggle.remove();
      openFolderRow.style.display = "";
      page.classList.remove("diabetic-folder-open");
    };

    toggle.addEventListener("click", closeNow);
    toggle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") closeNow(event);
    });

    titleEl.appendChild(toggle);
  };

  hideAllSectionCards();
  folders.forEach((row) => {
    row.style.display = "";
  });
  foldersContainer.style.display = "";
  page.classList.remove("diabetic-folder-open");

  folders.forEach((row) => {
    if (row.dataset.wired === "1") return;
    row.dataset.wired = "1";

    const key = row.getAttribute("data-folder");
    if (!key) return;

    const openNow = (event) => {
      event.preventDefault();
      event.stopPropagation();
      showSectionByKey(key);
    };

    row.addEventListener("click", openNow);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") openNow(event);
    });
  });
}

export function initializeDiabeticRetinopathyWorkshop() {
  const page = document.getElementById("diabeticRetinopathyWorkshopPage");
  if (!page) return;
  setupWorkshopFolders(page);
}
