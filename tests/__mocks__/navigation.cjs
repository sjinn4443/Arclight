// Jest CJS mock for public/js/navigation.js to avoid ESM import issues in CI
// Provides a faithful, lightweight implementation used by tests that import navigation.js

let currentRoute = null;
let currentPageName = null;
const historyStack = [];

async function loadPage(routeName, options = {}) {
  if (!options.replace && routeName === currentRoute) return;
  currentRoute = routeName;
  currentPageName = routeName;

  const container = document.getElementById("page-content");
  if (!container) return;

  // Resolve URL similar to app ROUTES (tests pass raw filenames like html/page1.html via fetch mock)
  // Tests call fetch with "html/<route>.html" by convention
  const url = `html/${routeName}.html`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const html = await res.text();
    container.innerHTML = html;

    // Ensure a .page wrapper exists and mark active
    let pageEl = container.querySelector(".page");
    if (!pageEl) {
      const wrapper = document.createElement("div");
      wrapper.className = "page";
      while (container.firstChild) wrapper.appendChild(container.firstChild);
      container.appendChild(wrapper);
      pageEl = wrapper;
    }
    pageEl.classList.add("active");

    // History management
    if (!options.replace) {
      historyStack.push(routeName);
    } else {
      if (historyStack.length) historyStack.pop();
      historyStack.push(routeName);
    }

    // Dispatch lifecycle events expected by some tests
    window.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName } }),
    );
    window.dispatchEvent(
      new CustomEvent("page:rendered", { detail: { routeName } }),
    );
  } catch (e) {
    // Graceful error path used by some tests
    container.innerHTML = `<div class="container"><p>Failed to load page: ${routeName}</p></div>`;
    window.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName, error: true } }),
    );
    window.dispatchEvent(
      new CustomEvent("page:rendered", { detail: { routeName, error: true } }),
    );
  }
}

function goBack() {
  historyStack.pop();
  const prev = historyStack.pop() || "dashboard";
  return loadPage(prev, { replace: true });
}

function wireGlobalNavigation() {}
function initializePageNavigation() {}

module.exports = {
  loadPage,
  goBack,
  wireGlobalNavigation,
  initializePageNavigation,
  historyStack,
  get currentPageName() {
    return currentPageName;
  },
};
