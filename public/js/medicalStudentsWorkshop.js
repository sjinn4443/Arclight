import { loadPage } from "./navigation.js";
import { openMenu } from "./menu.js";

const PAGE_ID = "medicalStudentsWorkshopPage";
const RAPD_RETURN_KEY = "medicalStudentsWorkshop:rapdReturn";
const RESTORE_FOLDER_KEY = "medicalStudentsWorkshop:restoreFolder";

function activateOnKeyboard(element, callback) {
  element.addEventListener("click", callback);
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") callback(event);
  });
}

function addCloseToggle(title, close) {
  const toggle = document.createElement("span");
  toggle.className = "see-all-toggle";
  toggle.setAttribute("role", "button");
  toggle.setAttribute("tabindex", "0");
  toggle.textContent = "Close ^";
  activateOnKeyboard(toggle, (event) => {
    event.preventDefault();
    event.stopPropagation();
    close();
  });
  title.appendChild(toggle);
}

async function openVideosSubpage(targetId) {
  window.__videosPendingTarget = targetId;
  window.__videosSuppressFlash = true;
  try {
    sessionStorage.setItem("gotoSubPage", targetId);
  } catch {}
  await loadPage("videos", { subPageId: targetId });
  const { goToVideosSection } = await import("./videos.js");
  goToVideosSection?.(targetId, { skipDefault: true });
}

async function openRapdExperience(targetId, mode, folderKey) {
  try {
    sessionStorage.setItem("rapdExperience:launchMode", mode || "practice");
    sessionStorage.setItem(RAPD_RETURN_KEY, "1");
    if (folderKey) sessionStorage.setItem(RESTORE_FOLDER_KEY, folderKey);
  } catch {}
  await loadPage("glaucomaScrollImages");
  const target = document.getElementById(targetId);
  if (!target) return;
  target.dataset.medicalStudentsReturn = "true";
  const { initializeGlaucomaScrollInteractiveTarget } =
    await import("./glaucomaWorkshop.js");
  initializeGlaucomaScrollInteractiveTarget?.(targetId);
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
  document.querySelectorAll(".page").forEach((candidate) => {
    candidate.classList.remove("active");
    candidate.style.display = "none";
  });
  target.classList.add("active");
  target.style.display = "block";
  document.dispatchEvent(
    new CustomEvent("page:shown", { detail: { id: targetId } }),
  );
}

export function initializeMedicalStudentsWorkshop() {
  const page = document.getElementById(PAGE_ID);
  if (!page || page.dataset.inited === "1") return;
  page.dataset.inited = "1";

  page.querySelector(".menuBtn")?.addEventListener("click", openMenu);
  const folders = Array.from(page.querySelectorAll(".medical-folder-row"));
  const sections = Array.from(page.querySelectorAll(".medical-section-card"));

  const closeSections = () => {
    sections.forEach((section) => {
      section.hidden = true;
      section.querySelector(":scope > h3 .see-all-toggle")?.remove();
      section
        .querySelectorAll(".medical-nested-section-card")
        .forEach((nested) => {
          nested.hidden = true;
          nested.querySelector("h3 .see-all-toggle")?.remove();
        });
      section.querySelectorAll(".medical-nested-folder-row").forEach((row) => {
        row.hidden = false;
      });
    });
    folders.forEach((folder) => (folder.hidden = false));
    page.classList.remove("medical-folder-open");
  };

  const showSection = (folder) => {
    const section = page.querySelector(
      `.medical-section-card[data-section="${folder?.dataset.folder}"]`,
    );
    if (!section) return;
    closeSections();
    folder.hidden = true;
    folder.insertAdjacentElement("afterend", section);
    section.hidden = false;
    page.classList.add("medical-folder-open");
    addCloseToggle(section.querySelector(":scope > h3"), closeSections);
  };

  folders.forEach((folder) => {
    activateOnKeyboard(folder, (event) => {
      event.preventDefault();
      showSection(folder);
    });
  });

  page.querySelectorAll(".medical-nested-folder-row").forEach((folder) => {
    activateOnKeyboard(folder, (event) => {
      event.preventDefault();
      event.stopPropagation();
      const section = folder.closest(".medical-section-card");
      const nested = section?.querySelector(
        `.medical-nested-section-card[data-nested-section="${folder.dataset.nestedFolder}"]`,
      );
      if (!section || !nested) return;
      section.querySelectorAll(".medical-nested-folder-row").forEach((row) => {
        row.hidden = row === folder;
      });
      section
        .querySelectorAll(".medical-nested-section-card")
        .forEach((card) => {
          card.hidden = card !== nested;
          card.querySelector("h3 .see-all-toggle")?.remove();
        });
      folder.insertAdjacentElement("afterend", nested);
      nested.hidden = false;
      addCloseToggle(nested.querySelector("h3"), () => {
        nested.hidden = true;
        nested.querySelector("h3 .see-all-toggle")?.remove();
        folder.hidden = false;
      });
    });
  });

  page.querySelectorAll(".lesson-row[data-target]").forEach((row) => {
    activateOnKeyboard(row, async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const targetId = row.dataset.target;
      const route = row.dataset.route;
      if (targetId === "glaucomaRAPDFullSwingInteractive") {
        await openRapdExperience(
          targetId,
          row.dataset.rapdLaunchMode,
          row.closest(".medical-section-card")?.dataset.section,
        );
      } else if (route === "videos") {
        await openVideosSubpage(targetId);
      } else if (route) {
        await loadPage(route);
      }
    });
  });

  try {
    const restoreFolder = sessionStorage.getItem(RESTORE_FOLDER_KEY);
    sessionStorage.removeItem(RESTORE_FOLDER_KEY);
    if (restoreFolder) {
      showSection(
        folders.find((folder) => folder.dataset.folder === restoreFolder),
      );
    }
  } catch {}
}
