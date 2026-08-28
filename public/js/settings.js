import { getLanguage, translateLiteral } from "./i18n.js";
import { loadPage } from "./navigation.js";
import { PROFILE_STORAGE_KEYS, dispatchProfileUpdated } from "./profileData.js";

const SETTINGS_STORAGE_KEYS = Object.freeze({
  dataConsent: "settings:dataConsent",
  notifications: "settings:notifications",
});

const PROGRESS_PREFIXES = Object.freeze([
  "lessonProgress:",
  "videoProgress:",
  "childhoodWorkshop:progress:",
  "diabeticWorkshop:progress:",
  "glaucomaWorkshop:progress:",
]);

const LANGUAGE_LABELS = Object.freeze({
  am: "Amharic",
  ar: "Arabic",
  bn: "Bangla",
  en: "English",
  fr: "French",
  ha: "Hausa",
  hi: "Hindi",
  id: "Indonesian",
  ig: "Igbo",
  ne: "Nepali",
  ny: "Chichewa",
  pt: "Portuguese",
  rw: "Kinyarwanda",
  sw: "Swahili",
  ur: "Urdu",
  yo: "Yoruba",
  zh: "Chinese",
});

function readBooleanSetting(key, fallback) {
  const value = localStorage.getItem(key);
  if (value === null) return fallback;
  return value === "true";
}

function writeBooleanSetting(key, value) {
  localStorage.setItem(key, value ? "true" : "false");
}

function setStatus(message) {
  const status = document.getElementById("settingsStatus");
  if (!status) return;
  status.textContent = translateLiteral(message, message);
}

function renderToggle(button, enabled) {
  if (!button) return;
  button.classList.toggle("is-on", enabled);
  button.setAttribute("aria-pressed", String(enabled));
}

function wireToggle(buttonId, storageKey, fallback) {
  const button = document.getElementById(buttonId);
  if (!button || button.dataset.settingsWired === "1") return;

  button.dataset.settingsWired = "1";
  renderToggle(button, readBooleanSetting(storageKey, fallback));
  button.addEventListener("click", () => {
    const next = !readBooleanSetting(storageKey, fallback);
    writeBooleanSetting(storageKey, next);
    renderToggle(button, next);
    setStatus("Settings saved.");
  });
}

function renderLanguageLabel() {
  const el = document.getElementById("settingsLanguageLabel");
  if (!el) return;
  const lang = getLanguage();
  el.textContent = LANGUAGE_LABELS[lang] || lang.toUpperCase();
}

function parsePositiveInt(value) {
  const raw = String(value ?? "").trim();
  if (!/^\d+$/.test(raw)) return null;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

function normalizeVersionPayload(payload) {
  const versionDateIso =
    typeof payload?.versionDate === "string"
      ? payload.versionDate.slice(0, 10)
      : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(versionDateIso)) return null;

  return {
    versionDateIso,
    versionSequence:
      parsePositiveInt(
        payload?.versionSequence ?? payload?.pushNumber ?? payload?.buildNumber,
      ) || 1,
  };
}

function formatVersionInfo(info) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(info?.versionDateIso || "");
  if (!match) return "ver --.--.----";
  return `ver ${match[3]}.${match[2]}.${match[1]}.${info.versionSequence}`;
}

async function fetchVersionInfo() {
  const endpoints = ["/api/app/version", "/version.json"];
  let best = null;
  const requestStamp = Date.now();

  for (const baseUrl of endpoints) {
    const separator = baseUrl.includes("?") ? "&" : "?";
    try {
      const response = await fetch(
        `${baseUrl}${separator}vts=${requestStamp}`,
        {
          cache: "no-store",
          credentials: "same-origin",
        },
      );
      if (!response.ok) continue;

      const normalized = normalizeVersionPayload(await response.json());
      if (!normalized) continue;
      if (!best || normalized.versionDateIso > best.versionDateIso) {
        best = normalized;
        continue;
      }
      if (
        normalized.versionDateIso === best.versionDateIso &&
        normalized.versionSequence > best.versionSequence
      ) {
        best = normalized;
      }
    } catch {
      /* Version metadata is optional in local development. */
    }
  }

  return best;
}

async function renderVersion() {
  const el = document.getElementById("settingsAppVersion");
  if (!el) return;
  el.textContent = formatVersionInfo(await fetchVersionInfo());
}

async function clonePrivacyTermsContent() {
  const existing = document.getElementById("privacyTermsModalTemplate");
  if (existing) return existing.content.cloneNode(true);

  try {
    const response = await fetch("html/onboarding.html", {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!response.ok) return null;

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const template = doc.getElementById("privacyTermsModalTemplate");
    return template?.content?.cloneNode(true) || null;
  } catch {
    return null;
  }
}

async function openPrivacyTermsModal() {
  if (document.getElementById("infoModalOverlay")) return;

  const modal = document.createElement("div");
  modal.id = "infoModalOverlay";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  const content = await clonePrivacyTermsContent();
  if (content) {
    modal.appendChild(content);
  } else {
    modal.innerHTML = `
      <div class="guest-modal">
        <button class="guest-modal__close" aria-label="Close">&times;</button>
        <div class="guest-modal__text privacyterms__text">
          <p>Only information needed to run and improve the service is collected.</p>
          <p>Personal data is never sold. You can ask to see, update or delete information held about you.</p>
        </div>
      </div>
    `;
  }

  document.body.appendChild(modal);
  window.I18N?.applyTranslations?.(modal);

  const close = () => {
    modal.classList.add("fade-out");
    setTimeout(() => modal.remove(), 250);
  };

  modal.querySelector(".guest-modal__close")?.addEventListener("click", close);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });
}

async function openDownloadedContents() {
  try {
    const { openDownloadedContentsModal } = await import("./menu.js");
    await openDownloadedContentsModal();
  } catch (error) {
    console.warn("[settings] downloaded contents modal failed", error);
    setStatus("Could not open downloaded contents.");
  }
}

function clearKeysByPrefix(prefixes) {
  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index) || "";
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      localStorage.removeItem(key);
    }
  }
}

function clearProfileAndProgress() {
  Object.values(PROFILE_STORAGE_KEYS).forEach((key) =>
    localStorage.removeItem(key),
  );
  Object.values(SETTINGS_STORAGE_KEYS).forEach((key) =>
    localStorage.removeItem(key),
  );
  clearKeysByPrefix(PROGRESS_PREFIXES);
  localStorage.removeItem("guestClicks");
  localStorage.removeItem("guestMode");
  localStorage.removeItem("cameFromSkipPath");
  dispatchProfileUpdated({ source: "settings:delete-account" });
}

function settingsCopy(english, lao) {
  const translated = translateLiteral(english, english);
  if (translated !== english) return translated;
  return getLanguage() === "lo" ? lao : english;
}

function confirmSettingsAction(message, laoMessage) {
  return new Promise((resolve) => {
    document.getElementById("settingsConfirmOverlay")?.remove();
    const overlay = document.createElement("div");
    overlay.id = "settingsConfirmOverlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML = `
      <div class="guest-modal settings-confirm-modal">
        <p class="guest-modal__text settings-confirm-modal__message"></p>
        <div class="settings-confirm-modal__actions">
          <button type="button" class="guest-modal__cta settings-confirm-modal__cancel" data-confirm="cancel"></button>
          <button type="button" class="guest-modal__cta" data-confirm="ok"></button>
        </div>
      </div>`;
    overlay.querySelector(".settings-confirm-modal__message").textContent =
      settingsCopy(message, laoMessage);
    overlay.querySelector('[data-confirm="cancel"]').textContent = settingsCopy(
      "Cancel",
      "ຍົກເລີກ",
    );
    overlay.querySelector('[data-confirm="ok"]').textContent = settingsCopy(
      "OK",
      "ຕົກລົງ",
    );
    const finish = (answer) => {
      overlay.remove();
      resolve(answer);
    };
    overlay.addEventListener("click", (event) => {
      const action = event.target.closest("[data-confirm]")?.dataset.confirm;
      if (action) finish(action === "ok");
      else if (event.target === overlay) finish(false);
    });
    document.body.appendChild(overlay);
    overlay.querySelector('[data-confirm="cancel"]')?.focus();
  });
}

function wireAccountActions() {
  document
    .getElementById("settingsPrivacyBtn")
    ?.addEventListener("click", () => {
      void openPrivacyTermsModal();
    });

  document
    .getElementById("settingsDownloadedContentsBtn")
    ?.addEventListener("click", () => {
      void openDownloadedContents();
    });

  document
    .getElementById("settingsLogoutBtn")
    ?.addEventListener("click", async () => {
      const ok = await confirmSettingsAction(
        "Log out and return to the start screen?",
        "ອອກຈາກລະບົບ ແລະ ກັບໄປໜ້າເລີ່ມຕົ້ນບໍ?",
      );
      if (!ok) return;
      localStorage.setItem("guestMode", "true");
      localStorage.removeItem("guestClicks");
      void loadPage("splashscreen");
    });

  document
    .getElementById("settingsDeleteAccountBtn")
    ?.addEventListener("click", async () => {
      const ok = await confirmSettingsAction(
        "Delete this local account profile and learning progress?",
        "ລຶບໂປຣໄຟລ໌ບັນຊີໃນອຸປະກອນນີ້ ແລະ ຄວາມຄືບໜ້າການຮຽນບໍ?",
      );
      if (!ok) return;
      clearProfileAndProgress();
      void loadPage("onboarding");
    });
}

export function initializeSettings() {
  renderLanguageLabel();
  wireToggle(
    "settingsNotificationsToggle",
    SETTINGS_STORAGE_KEYS.notifications,
    true,
  );
  wireAccountActions();
  void renderVersion();

  document.addEventListener("language:updated", renderLanguageLabel, {
    once: true,
  });
}
