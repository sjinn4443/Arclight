const FLOW_ACK_KEY = "experimentalMiniAppNotice:ack";
const ROUTES_WITH_EXPERIMENTAL_SUBPAGES = new Set([
  "videos",
  "glaucomaScrollImages",
]);

const EXPERIMENTAL_HUB_PAGE_IDS = new Set(["interactiveLearningPage"]);

const EXPERIMENTAL_MINI_APP_PAGE_IDS = new Set([
  "fundalReflexInteractivePage",
  "morphPage",
  "traumaInteractivePage",
  "glaucomaACDInteractive",
  "amslerInteractivePage",
  "miresPage",
  "glaucomaInteractivePage",
  "fieldsInteractivePage",
  "refractInteractivePage",
  "sauronInteractivePage",
  "swollenDiscsInteractivePage",
  "glaucomaRAPDFullSwingInteractive",
  "squintPalsyPage",
  "cataractPage",
]);

const EXPERIMENTAL_PAGE_IDS = new Set([
  ...EXPERIMENTAL_HUB_PAGE_IDS,
  ...EXPERIMENTAL_MINI_APP_PAGE_IDS,
]);

const OVERLAY_ID = "experimentalMiniAppNoticeOverlay";
const BODY_OPEN_ATTR = "data-experimental-miniapp-notice-open";

let initialized = false;
let currentTargetId = null;
let overlayEl = null;
let titleEl = null;
let bodyEl = null;
let okBtnEl = null;

function isExperimentalPageId(id) {
  return EXPERIMENTAL_PAGE_IDS.has(String(id || "").trim());
}

function isHubPageId(id) {
  return EXPERIMENTAL_HUB_PAGE_IDS.has(String(id || "").trim());
}

function readAck() {
  try {
    return sessionStorage.getItem(FLOW_ACK_KEY) === "1";
  } catch {
    return false;
  }
}

function writeAck(value) {
  try {
    if (value) {
      sessionStorage.setItem(FLOW_ACK_KEY, "1");
    } else {
      sessionStorage.removeItem(FLOW_ACK_KEY);
    }
  } catch {
    void 0;
  }
}

function resolveLanguage() {
  const fromI18n = String(window.I18N?.getLanguage?.() || "").trim();
  if (fromI18n) return fromI18n.toLowerCase();

  const fromStorage = String(localStorage.getItem("prefLang") || "").trim();
  if (fromStorage) return fromStorage.toLowerCase();

  const fromHtml = String(
    document.documentElement.getAttribute("lang") || "",
  ).trim();
  return fromHtml.toLowerCase() || "en";
}

function getCopy(targetId) {
  const lang = resolveLanguage();
  const korean = lang === "ko" || lang === "korean";
  const hubPage = isHubPageId(targetId);

  if (korean) {
    return hubPage
      ? {
          title: "인터랙티브 학습 안내",
          body: "이 인터랙티브 미니앱들은 실험용이며 학습 목적으로만 사용된다는 점을 이해합니다.\n실제 진단이나 진단 확인 목적으로 사용하면 안 됩니다.",
          button: "이해했습니다. 계속",
        }
      : {
          title: "인터랙티브 학습 안내",
          body: "이 인터랙티브 미니앱은 실험용이며 학습 목적으로만 사용된다는 점을 이해합니다.\n실제 진단이나 진단 확인 목적으로 사용하면 안 됩니다.",
          button: "이해했습니다. 계속",
        };
  }

  return hubPage
    ? {
        title: "Interactive learning notice",
        body: "I understand these interactive mini apps are experimental and for learning only.\n\nThey must not be used to make or confirm a diagnosis.",
        button: "Understood",
      }
    : {
        title: "Interactive learning notice",
        body: "I understand this interactive mini app is experimental and for learning only.\n\nIt must not be used to make or confirm a diagnosis.",
        button: "Understood",
      };
}

function setOpenState(isOpen) {
  if (!document.body) return;
  if (isOpen) {
    document.body.setAttribute(BODY_OPEN_ATTR, "true");
  } else {
    document.body.removeAttribute(BODY_OPEN_ATTR);
  }
}

function ensureOverlay() {
  if (overlayEl && document.body?.contains(overlayEl)) return overlayEl;

  overlayEl = document.getElementById(OVERLAY_ID);
  if (overlayEl) {
    titleEl = overlayEl.querySelector("[data-experimental-miniapp-title]");
    bodyEl = overlayEl.querySelector("[data-experimental-miniapp-body]");
    okBtnEl = overlayEl.querySelector("[data-experimental-miniapp-ok]");
    return overlayEl;
  }

  if (!document.body) return null;

  overlayEl = document.createElement("div");
  overlayEl.id = OVERLAY_ID;
  overlayEl.hidden = true;
  overlayEl.setAttribute("role", "dialog");
  overlayEl.setAttribute("aria-modal", "true");
  overlayEl.setAttribute("aria-labelledby", "experimentalMiniAppNoticeTitle");
  overlayEl.setAttribute("aria-describedby", "experimentalMiniAppNoticeBody");

  const modal = document.createElement("div");
  modal.className = "guest-modal experimental-miniapp-modal";

  titleEl = document.createElement("h2");
  titleEl.id = "experimentalMiniAppNoticeTitle";
  titleEl.className = "guest-modal__title experimental-miniapp-modal__title";
  titleEl.setAttribute("data-experimental-miniapp-title", "");

  bodyEl = document.createElement("p");
  bodyEl.id = "experimentalMiniAppNoticeBody";
  bodyEl.className = "guest-modal__text experimental-miniapp-modal__text";
  bodyEl.setAttribute("data-experimental-miniapp-body", "");

  okBtnEl = document.createElement("button");
  okBtnEl.type = "button";
  okBtnEl.className =
    "guest-modal__cta btn-primary experimental-miniapp-modal__cta";
  okBtnEl.setAttribute("data-experimental-miniapp-ok", "");
  okBtnEl.addEventListener("click", () => {
    writeAck(true);
    closeNotice();
  });

  modal.appendChild(titleEl);
  modal.appendChild(bodyEl);
  modal.appendChild(okBtnEl);
  overlayEl.appendChild(modal);
  document.body.appendChild(overlayEl);

  return overlayEl;
}

function renderCopy(targetId) {
  const overlay = ensureOverlay();
  if (!overlay || !titleEl || !bodyEl || !okBtnEl) return;

  const copy = getCopy(targetId);
  titleEl.textContent = copy.title;
  bodyEl.textContent = copy.body;
  okBtnEl.textContent = copy.button;
}

function openNotice(targetId) {
  const overlay = ensureOverlay();
  if (!overlay) return;

  currentTargetId = targetId;
  renderCopy(targetId);
  overlay.hidden = false;
  setOpenState(true);
  okBtnEl?.focus?.();
}

function closeNotice() {
  const overlay = overlayEl;
  if (!overlay) return;
  overlay.hidden = true;
  setOpenState(false);
}

function clearAckAndClose() {
  currentTargetId = null;
  writeAck(false);
  closeNotice();
}

function processPageShown(targetId) {
  if (!targetId) return;

  if (!isExperimentalPageId(targetId)) {
    clearAckAndClose();
    return;
  }

  currentTargetId = targetId;
  if (readAck()) {
    closeNotice();
    return;
  }

  openNotice(targetId);
}

function processRouteLoaded(routeName) {
  if (!routeName) return;
  if (ROUTES_WITH_EXPERIMENTAL_SUBPAGES.has(routeName)) return;
  clearAckAndClose();
}

function handlePageShown(event) {
  processPageShown(String(event?.detail?.id || "").trim());
}

function handleRouteLoaded(event) {
  processRouteLoaded(String(event?.detail?.routeName || "").trim());
}

function handleLanguageUpdated() {
  if (!currentTargetId || overlayEl?.hidden !== false) return;
  renderCopy(currentTargetId);
}

export function initializeExperimentalMiniAppNotice() {
  if (initialized) return;
  initialized = true;

  document.addEventListener("page:shown", handlePageShown);
  window.addEventListener("page:loaded", handleRouteLoaded);
  document.addEventListener("language:updated", handleLanguageUpdated);
}

export function showExperimentalMiniAppNoticeForPage(targetId) {
  processPageShown(String(targetId || "").trim());
}

export function clearExperimentalMiniAppNoticeForRoute(routeName) {
  processRouteLoaded(String(routeName || "").trim());
}

export function resetExperimentalMiniAppNoticeForTests() {
  document.removeEventListener("page:shown", handlePageShown);
  window.removeEventListener("page:loaded", handleRouteLoaded);
  document.removeEventListener("language:updated", handleLanguageUpdated);
  initialized = false;
  currentTargetId = null;
  writeAck(false);
  setOpenState(false);
  overlayEl?.remove?.();
  overlayEl = null;
  titleEl = null;
  bodyEl = null;
  okBtnEl = null;
}
