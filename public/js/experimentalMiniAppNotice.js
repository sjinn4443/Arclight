const FLOW_ACK_KEY = "experimentalMiniAppNotice:ack";
const ROUTES_WITH_EXPERIMENTAL_SUBPAGES = new Set([
  "videos",
  "glaucomaScrollImages",
]);

const EXPERIMENTAL_HUB_PAGE_IDS = new Set([]);

const EXPERIMENTAL_MINI_APP_PAGE_IDS = new Set([
  "fundalReflexSimulatorPage",
  "morphSimulatorPage",
  "traumaInteractivePage",
  "glaucomaACDInteractive",
  "amslerInteractivePage",
  "miresPage",
  "glaucomaSimulatorPage",
  "fieldsInteractivePage",
  "refractInteractivePage",
  "sauronInteractivePage",
  "swollenDiscsInteractivePage",
  "glaucomaRAPDFullSwingInteractive",
  "squintPalsySimulatorPage",
  "cataractSimulatorPage",
]);

const EXPERIMENTAL_PAGE_IDS = new Set([
  ...EXPERIMENTAL_HUB_PAGE_IDS,
  ...EXPERIMENTAL_MINI_APP_PAGE_IDS,
]);

const OVERLAY_ID = "experimentalMiniAppNoticeOverlay";
const BODY_OPEN_ATTR = "data-experimental-miniapp-notice-open";
const RAPD_PAGE_ID = "glaucomaRAPDFullSwingInteractive";
const RAPD_ORIENTATION_OVERLAY_ID = "rapdOrientationNoticeOverlay";
const RAPD_MOBILE_LAYOUT_ATTR = "data-rapd-mobile-layout";
const RAPD_ORIENTATION_OPEN_ATTR = "data-rapd-orientation-notice-open";

let initialized = false;
let currentTargetId = null;
let overlayEl = null;
let titleEl = null;
let bodyEl = null;
let demoEl = null;
let okBtnEl = null;
let rapdMobileSession = false;
let orientationOverlayEl = null;

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

function noticeText(key, fallback) {
  return window.I18N?.t?.(`i18nExtra.${key}`, fallback) || fallback;
}

function getCopy(targetId) {
  const lang = resolveLanguage();
  const korean = lang === "ko" || lang === "korean";
  const hubPage = isHubPageId(targetId);
  let rapdTest = false;
  if (targetId === RAPD_PAGE_ID) {
    try {
      rapdTest = sessionStorage.getItem("rapdExperience:launchMode") === "test";
    } catch {
      rapdTest = false;
    }
  }

  if (rapdTest) {
    return {
      title: noticeText("interactive_notice_rapd_title", "Pupil App Test"),
      body: noticeText(
        "interactive_notice_rapd_body",
        "Perform the 'swinging light' test to look for an RAPD.\n\nChoose No RAPD or the patient's Left/Right side, select the severity, then press Submit answer.",
      ),
      button: noticeText("interactive_notice_start_test", "Start test"),
      demo: true,
    };
  }

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

  return {
    title: noticeText(
      "interactive_notice_title",
      "Interactive learning notice",
    ),
    body: hubPage
      ? noticeText(
          "interactive_notice_plural_body",
          "I understand these interactive mini apps are experimental and for learning only.\n\nThey must not be used to make or confirm a diagnosis.",
        )
      : noticeText(
          "interactive_notice_single_body",
          "I understand this interactive mini app is experimental and for learning only.\n\nIt must not be used to make or confirm a diagnosis.",
        ),
    button: noticeText("interactive_notice_understood", "Understood"),
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

function mediaMatches(query) {
  try {
    return window.matchMedia?.(query)?.matches === true;
  } catch {
    return false;
  }
}

function isPhoneSizedDevice() {
  const viewportWidth = Number(window.innerWidth) || 0;
  const screenWidth = Number(window.screen?.width) || viewportWidth;
  const screenHeight =
    Number(window.screen?.height) || Number(window.innerHeight);
  const shortestScreenSide = Math.min(screenWidth, screenHeight);

  return (
    viewportWidth <= 600 ||
    (mediaMatches("(pointer: coarse)") && shortestScreenSide <= 600)
  );
}

function isPortraitViewport() {
  if (mediaMatches("(orientation: portrait)")) return true;
  return (Number(window.innerHeight) || 0) > (Number(window.innerWidth) || 0);
}

function setRapdMobileLayout(isActive) {
  rapdMobileSession = isActive;
  if (!document.body) return;
  if (isActive) {
    document.body.setAttribute(RAPD_MOBILE_LAYOUT_ATTR, "true");
  } else {
    document.body.removeAttribute(RAPD_MOBILE_LAYOUT_ATTR);
  }
}

function ensureOrientationOverlay() {
  if (orientationOverlayEl && document.body?.contains(orientationOverlayEl)) {
    return orientationOverlayEl;
  }

  orientationOverlayEl = document.getElementById(RAPD_ORIENTATION_OVERLAY_ID);
  if (orientationOverlayEl || !document.body) return orientationOverlayEl;

  orientationOverlayEl = document.createElement("div");
  orientationOverlayEl.id = RAPD_ORIENTATION_OVERLAY_ID;
  orientationOverlayEl.hidden = true;
  orientationOverlayEl.setAttribute("role", "dialog");
  orientationOverlayEl.setAttribute("aria-modal", "true");
  orientationOverlayEl.setAttribute("aria-label", "");

  const content = document.createElement("div");
  content.className = "rapd-orientation-notice";

  const animation = document.createElement("div");
  animation.className = "rapd-orientation-notice__animation";
  animation.setAttribute("aria-hidden", "true");

  const phone = document.createElement("span");
  phone.className = "rapd-orientation-notice__phone";

  const arrow = document.createElement("span");
  arrow.className = "rapd-orientation-notice__arrow";

  const text = document.createElement("p");
  text.className = "rapd-orientation-notice__text";
  text.textContent = "";

  animation.append(phone, arrow);
  content.append(animation, text);
  orientationOverlayEl.appendChild(content);
  document.body.appendChild(orientationOverlayEl);
  return orientationOverlayEl;
}

function openOrientationNotice() {
  const orientationOverlay = ensureOrientationOverlay();
  if (!orientationOverlay) return;
  const message = noticeText(
    "interactive_notice_rotate_landscape",
    "Rotate your device to landscape",
  );
  orientationOverlay.setAttribute("aria-label", message);
  const text = orientationOverlay.querySelector(
    ".rapd-orientation-notice__text",
  );
  if (text) text.textContent = message;
  closeNotice();
  orientationOverlay.hidden = false;
  document.body?.setAttribute(RAPD_ORIENTATION_OPEN_ATTR, "true");
}

function closeOrientationNotice() {
  if (orientationOverlayEl) orientationOverlayEl.hidden = true;
  document.body?.removeAttribute(RAPD_ORIENTATION_OPEN_ATTR);
}

function ensureOverlay() {
  if (overlayEl && document.body?.contains(overlayEl)) return overlayEl;

  overlayEl = document.getElementById(OVERLAY_ID);
  if (overlayEl) {
    titleEl = overlayEl.querySelector("[data-experimental-miniapp-title]");
    bodyEl = overlayEl.querySelector("[data-experimental-miniapp-body]");
    demoEl = overlayEl.querySelector("[data-rapd-test-notice-demo]");
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

  demoEl = document.createElement("div");
  demoEl.className = "rapd-test-notice-demo";
  demoEl.setAttribute("data-rapd-test-notice-demo", "");
  demoEl.setAttribute("aria-hidden", "true");
  demoEl.innerHTML = `
    <div class="rapd-test-notice-demo__stage">
      <strong>Question 1 of 10</strong>
      <div class="rapd-test-notice-demo__side">
        <span data-rapd-demo="no-rapd">No RAPD</span><span data-rapd-demo="left">Left</span><span data-rapd-demo="right">Right</span>
      </div>
      <div class="rapd-test-notice-demo__severity">
        <small data-rapd-demo="mild">Mild</small><span>1</span><span>2</span><span>3</span><small data-rapd-demo="severe">Severe</small>
      </div>
      <div class="rapd-test-notice-demo__scene" aria-hidden="true">
        <img class="rapd-test-notice-demo__eyes" src="/images/learning/GlaucomaRAPD/eyes.webp" alt="" />
        <img class="rapd-test-notice-demo__torch" src="/images/learning/GlaucomaRAPD/arclight.webp" alt="" />
      </div>
      <button type="button" tabindex="-1" data-rapd-demo="submit">Submit answer</button>
      <i class="rapd-test-notice-demo__pointer"></i>
    </div>`;

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
  modal.appendChild(demoEl);
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
  if (demoEl) demoEl.hidden = copy.demo !== true;
  okBtnEl.textContent = copy.button;
  if (demoEl && copy.demo === true) {
    const labels = {
      "no-rapd": noticeText("interactive_notice_no_rapd", "No RAPD"),
      left: noticeText("interactive_notice_left", "Left"),
      right: noticeText("interactive_notice_right", "Right"),
      mild: noticeText("interactive_notice_mild", "Mild"),
      severe: noticeText("interactive_notice_severe", "Severe"),
      submit: noticeText("interactive_notice_submit_answer", "Submit answer"),
    };
    Object.entries(labels).forEach(([name, value]) => {
      const element = demoEl.querySelector(`[data-rapd-demo="${name}"]`);
      if (element) element.textContent = value;
    });
    const question = demoEl.querySelector("strong");
    if (question) {
      question.textContent = noticeText(
        "interactive_notice_question_progress",
        "Question 1 of 10",
      );
    }
  }
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
  closeOrientationNotice();
  setRapdMobileLayout(false);
  writeAck(false);
  closeNotice();
}

function showInteractiveNoticeIfNeeded(targetId) {
  if (targetId === RAPD_PAGE_ID) {
    try {
      if (sessionStorage.getItem("rapdExperience:launchMode") === "test") {
        openNotice(targetId);
        return;
      }
    } catch {
      void 0;
    }
  }
  if (readAck()) {
    closeNotice();
    return;
  }
  openNotice(targetId);
}

function syncRapdOrientationFlow() {
  if (currentTargetId !== RAPD_PAGE_ID || !rapdMobileSession) return;

  if (isPortraitViewport()) {
    openOrientationNotice();
    return;
  }

  closeOrientationNotice();
  showInteractiveNoticeIfNeeded(RAPD_PAGE_ID);
}

function processPageShown(targetId) {
  if (!targetId) return;

  if (!isExperimentalPageId(targetId)) {
    clearAckAndClose();
    return;
  }

  if (targetId !== RAPD_PAGE_ID) {
    closeOrientationNotice();
    setRapdMobileLayout(false);
  } else if (currentTargetId !== RAPD_PAGE_ID) {
    setRapdMobileLayout(isPhoneSizedDevice());
  }

  currentTargetId = targetId;
  if (targetId === RAPD_PAGE_ID && rapdMobileSession) {
    syncRapdOrientationFlow();
    return;
  }

  showInteractiveNoticeIfNeeded(targetId);
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

function handleViewportChanged() {
  syncRapdOrientationFlow();
}

export function initializeExperimentalMiniAppNotice() {
  if (initialized) return;
  initialized = true;

  document.addEventListener("page:shown", handlePageShown);
  window.addEventListener("page:loaded", handleRouteLoaded);
  document.addEventListener("language:updated", handleLanguageUpdated);
  window.addEventListener("resize", handleViewportChanged, { passive: true });
  window.addEventListener("orientationchange", handleViewportChanged, {
    passive: true,
  });
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
  window.removeEventListener("resize", handleViewportChanged);
  window.removeEventListener("orientationchange", handleViewportChanged);
  initialized = false;
  currentTargetId = null;
  rapdMobileSession = false;
  writeAck(false);
  setOpenState(false);
  closeOrientationNotice();
  setRapdMobileLayout(false);
  overlayEl?.remove?.();
  orientationOverlayEl?.remove?.();
  overlayEl = null;
  orientationOverlayEl = null;
  titleEl = null;
  bodyEl = null;
  demoEl = null;
  okBtnEl = null;
}
