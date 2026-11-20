import { loadPage } from "./navigation.js";
import { fetchDictionary, get, getLanguage } from "./i18n.js";
import {
  PROFILE_UPDATED_EVENT,
  getProfileName,
  renderProfileAvatar,
} from "./profileData.js";

// Keep a single search control and its existing listeners across both layouts.
export function initializeDashboardWorkspace(root, openDownload) {
  const template = root.querySelector("#dashboardWorkspaceTemplate");
  if (!template) return;
  root.prepend(template.content.cloneNode(true));
  const workspace = root.querySelector(".dashboard-desktop");
  const search = root.querySelector(".search-wrap--compact");
  const mobileSearchHost = search?.parentElement;
  const desktop = window.matchMedia("(min-width: 1024px)");
  const controller = new AbortController();
  const { signal } = controller;
  let profileToken = 0;

  function syncLayout() {
    if (!search) return;
    const host = desktop.matches
      ? workspace.querySelector(".dw-search-slot")
      : mobileSearchHost;
    if (search.parentElement !== host) host.prepend(search);
    if (!desktop.matches)
      root.querySelector("#dashboardSearchPanel").hidden = true;
  }

  async function refreshProfile() {
    const token = ++profileToken;
    const name = getProfileName();
    const language = getLanguage();
    const dict = await fetchDictionary(language);
    if (token !== profileToken || !root.isConnected) return;
    renderProfileAvatar(workspace.querySelector("[data-dashboard-avatar]"));
    const greeting =
      get(
        dict,
        name
          ? "dashboard.greeting_welcome_back_name"
          : "dashboard.greeting_welcome_back_generic",
      ) || (name ? "Welcome back {{name}}!" : "Welcome back!");
    const greetingElement = workspace.querySelector(
      "[data-dashboard-greeting]",
    );
    if (greetingElement)
      greetingElement.textContent = greeting.replace(
        /\{\{\s*name\s*\}\}/g,
        () => name,
      );
    const languageOption = document.querySelector(
      `#languagePickerSelect option[value="${language}"]`,
    );
    workspace.querySelector("[data-dashboard-language-name]").textContent =
      languageOption?.dataset.native ||
      languageOption?.textContent.trim() ||
      language;
  }

  workspace.querySelectorAll("[data-dashboard-route]").forEach((button) => {
    button.addEventListener("click", () => {
      const route = button.dataset.dashboardRoute;
      if (route !== document.body.dataset.currentRoute) void loadPage(route);
    });
  });
  workspace
    .querySelector("[data-dashboard-notes]")
    .addEventListener("click", () => {
      sessionStorage.setItem("myLearningActiveTab", "notes");
      localStorage.setItem("myLearningActiveTab", "notes");
      void loadPage("mylearning");
    });
  workspace
    .querySelector("[data-dashboard-download]")
    .addEventListener("click", () => void openDownload());
  document.addEventListener(
    "keydown",
    (event) => {
      if (
        !desktop.matches ||
        !root.classList.contains("active") ||
        event.key !== "/" ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.target.closest?.("input,textarea,select,[contenteditable]")
      )
        return;
      event.preventDefault();
      if (search?.classList.contains("search-collapsed"))
        search.querySelector("#dashboardSearchToggle").click();
      search?.querySelector("input").focus();
    },
    { signal },
  );
  desktop.addEventListener("change", syncLayout, { signal });
  document.addEventListener(
    PROFILE_UPDATED_EVENT,
    () => void refreshProfile(),
    { signal },
  );
  window.addEventListener("i18n:languageChanged", () => void refreshProfile(), {
    signal,
  });
  window.addEventListener(
    "page:loaded",
    () => {
      if (!root.isConnected) controller.abort();
    },
    { signal },
  );
  root.addEventListener("dw:dispose", () => controller.abort(), { once: true });
  syncLayout();
  void refreshProfile();
}
