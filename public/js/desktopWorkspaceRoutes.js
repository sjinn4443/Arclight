// Keep the real route fragments/initializers inside the desktop dashboard shell.
import {
  mountWorkspaceHeader,
  restoreWorkspaceHeader,
} from "./desktopWorkspaceHeader.js";
const WORKSPACE_ROUTES = new Map([
  ["mylearning", ["myLearningTitle", "My Learning"]],
  ["atomscard", ["atomsCardTitle", "Atoms Card"]],
  ["eyes", ["eyesCatalogTitle", "Eyes"]],
  ["ears", ["ears.earsCatalogTitle", "Ears"]],
  ["myprofile", ["myprofile.my_profile", "My Profile"]],
  ["editProfile", ["myprofile.edit_profile", "Edit Profile"]],
  ["settings", ["myprofile.settings", "Settings"]],
]);
const desktop = globalThis.matchMedia?.("(min-width: 1024px)");
let shellRequest;

async function ensureShell(container, route) {
  let root = container.querySelector("#unifiedDashboard");
  if (root?.querySelector(".dashboard-desktop")) return root;
  shellRequest ||= fetch("html/dashboard.html", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw Error("Dashboard shell unavailable");
      return response.text();
    })
    .catch((error) => {
      shellRequest = null;
      throw error;
    });
  const markup = await shellRequest;
  if (document.body.dataset.currentRoute !== route) return null;
  container.innerHTML = markup;
  const { initializeDashboard } = await import("./dashboard.js");
  if (document.body.dataset.currentRoute !== route) return null;
  initializeDashboard();
  root = container.querySelector("#unifiedDashboard");
  return root;
}

function setWorkspaceRoute(root, route) {
  root.classList.remove("page");
  root.classList.add("dw-shell", "active");
  root.dataset.workspaceRoute = route;
  root.querySelector(".dw-main").classList.add("dw-route-main");
  root.querySelectorAll(".dw-nav[data-dashboard-route]").forEach((button) => {
    const selected =
      button.dataset.dashboardRoute ===
      (route === "editProfile" ? "myprofile" : route);
    button.classList.toggle("active", selected);
    if (selected) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  const title = root.querySelector(".dw-breadcrumb strong");
  const [key, label] = WORKSPACE_ROUTES.get(route);
  title.dataset.i18n = key;
  title.textContent = label;
  window.I18N?.applyTranslations?.(title);
}

export async function mountDesktopWorkspaceRoute(container, route, html) {
  if (!WORKSPACE_ROUTES.has(route) || !desktop?.matches) {
    container.innerHTML = html;
    return;
  }
  try {
    const root = await ensureShell(container, route);
    if (!root) return;
    restoreWorkspaceHeader(root);
    setWorkspaceRoute(root, route);
    root.querySelector(".dw-main").innerHTML = html;
    mountWorkspaceHeader(root);
  } catch (error) {
    console.warn("[workspace] using standalone route:", error);
    container.innerHTML = html;
  }
}

// Move existing nodes on resize so tabs, zoom and their listeners survive.
// Coalesce transient viewport changes before tearing down the desktop shell.
let resizeTimer;
desktop?.addEventListener?.("change", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(syncWorkspaceLayout, 120);
});

async function syncWorkspaceLayout() {
  const container = document.getElementById("page-content");
  const route = document.body.dataset.currentRoute;
  if (!container || !WORKSPACE_ROUTES.has(route)) return;
  const current = container.querySelector("#unifiedDashboard.dw-shell");
  if (!desktop.matches && current) {
    restoreWorkspaceHeader(current);
    const children = [...current.querySelector(".dw-main").childNodes];
    current.dispatchEvent(new Event("dw:dispose"));
    container.replaceChildren(...children);
  } else if (desktop.matches && !current) {
    const children = [...container.childNodes];
    try {
      const root = await ensureShell(container, route);
      if (!root) return;
      setWorkspaceRoute(root, route);
      root.querySelector(".dw-main").replaceChildren(...children);
      mountWorkspaceHeader(root);
    } catch (error) {
      console.warn("[workspace] resize:", error);
    }
  }
}
