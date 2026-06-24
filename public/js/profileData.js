export const PROFILE_UPDATED_EVENT = "arclight:profile-updated";

export const PROFILE_STORAGE_KEYS = Object.freeze({
  avatar: "profileAvatarDataUrl",
  interests: "userField",
  name: "username",
  practiceByRole: "practiceByRole",
  roles: "userJob",
  studentYears: "studentYears",
});

const PROGRESS_PREFIXES = Object.freeze([
  "lessonProgress:",
  "videoProgress:",
  "childhoodWorkshop:progress:",
  "diabeticWorkshop:progress:",
  "glaucomaWorkshop:progress:",
]);

export function splitStoredList(value) {
  return Array.from(
    new Set(
      String(value || "")
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

export function humanizeStoredValue(value) {
  return String(value || "")
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .replace(/([0-9])([A-Za-z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getProfileName() {
  return (localStorage.getItem(PROFILE_STORAGE_KEYS.name) || "").trim();
}

export function setProfileName(name) {
  const clean = String(name || "").trim();
  if (clean) localStorage.setItem(PROFILE_STORAGE_KEYS.name, clean);
  else localStorage.removeItem(PROFILE_STORAGE_KEYS.name);
  dispatchProfileUpdated();
}

export function getProfileInterests() {
  return splitStoredList(localStorage.getItem(PROFILE_STORAGE_KEYS.interests));
}

export function setProfileInterests(interests) {
  const clean = splitStoredList(
    Array.isArray(interests) ? interests.join("|") : interests,
  );
  if (clean.length) {
    localStorage.setItem(PROFILE_STORAGE_KEYS.interests, clean.join("|"));
  } else {
    localStorage.removeItem(PROFILE_STORAGE_KEYS.interests);
  }
  dispatchProfileUpdated();
}

export function getPrimaryInterest(defaultInterest = "eyes") {
  const [first] = getProfileInterests();
  return first || defaultInterest;
}

export function getProfileRoles() {
  return splitStoredList(localStorage.getItem(PROFILE_STORAGE_KEYS.roles));
}

export function setProfileRoles(roles) {
  const clean = splitStoredList(Array.isArray(roles) ? roles.join("|") : roles);
  if (clean.length)
    localStorage.setItem(PROFILE_STORAGE_KEYS.roles, clean.join("|"));
  else localStorage.removeItem(PROFILE_STORAGE_KEYS.roles);
  dispatchProfileUpdated();
}

export function readPracticeByRole() {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(PROFILE_STORAGE_KEYS.practiceByRole) || "{}",
    );
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writePracticeByRole(value) {
  const clean = value && typeof value === "object" ? value : {};
  if (Object.keys(clean).length) {
    localStorage.setItem(
      PROFILE_STORAGE_KEYS.practiceByRole,
      JSON.stringify(clean),
    );
  } else {
    localStorage.removeItem(PROFILE_STORAGE_KEYS.practiceByRole);
  }
  dispatchProfileUpdated();
}

export function getProfileAvatarDataUrl() {
  return localStorage.getItem(PROFILE_STORAGE_KEYS.avatar) || "";
}

export function setProfileAvatarDataUrl(dataUrl) {
  if (dataUrl) localStorage.setItem(PROFILE_STORAGE_KEYS.avatar, dataUrl);
  else localStorage.removeItem(PROFILE_STORAGE_KEYS.avatar);
  dispatchProfileUpdated();
}

export function renderProfileAvatar(el) {
  if (!el) return;
  const avatar = getProfileAvatarDataUrl();
  el.style.backgroundImage = avatar ? `url("${avatar}")` : "";
  el.classList.toggle("has-profile-avatar", Boolean(avatar));
}

export function dispatchProfileUpdated(detail = {}) {
  document.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail }));
}

export async function createProfileAvatarDataUrl(file, size = 320) {
  if (!file || !String(file.type || "").startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;

  canvas.width = size;
  canvas.height = size;

  const sourceSize = Math.min(
    img.naturalWidth || img.width,
    img.naturalHeight || img.height,
  );
  const sx = Math.max(0, ((img.naturalWidth || img.width) - sourceSize) / 2);
  const sy = Math.max(0, ((img.naturalHeight || img.height) - sourceSize) / 2);
  ctx.drawImage(img, sx, sy, sourceSize, sourceSize, 0, 0, size, size);

  return canvas.toDataURL("image/jpeg", 0.86);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", () =>
      reject(new Error("Could not read image.")),
    );
    img.src = src;
  });
}

function clampPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function clampTimestamp(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n);
}

function readProgressRecord(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "null");
    return {
      percent: clampPercent(parsed?.percent),
      updatedAt: clampTimestamp(parsed?.updatedAt),
    };
  } catch {
    return { percent: 0, updatedAt: 0 };
  }
}

export function getCompletedModuleRecords() {
  const byTarget = new Map();

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index) || "";
    const prefix = PROGRESS_PREFIXES.find((candidate) =>
      key.startsWith(candidate),
    );
    if (!prefix) continue;

    const target = key.slice(prefix.length);
    if (!target) continue;

    const record = readProgressRecord(key);
    const previous = byTarget.get(target) || { percent: 0, updatedAt: 0 };
    if (
      record.percent > previous.percent ||
      (record.percent === previous.percent &&
        record.updatedAt > previous.updatedAt)
    ) {
      byTarget.set(target, { target, ...record });
    }
  }

  return Array.from(byTarget.values())
    .filter((record) => record.percent >= 99.5)
    .sort(
      (a, b) => b.updatedAt - a.updatedAt || a.target.localeCompare(b.target),
    );
}

export function getAchievementBadges() {
  const completed = getCompletedModuleRecords();
  const count = completed.length;

  return Array.from({ length: Math.floor(count / 10) }, (_, index) => {
    const milestone = (index + 1) * 10;
    return {
      id: `completed-${milestone}`,
      earned: true,
      milestone,
      title: `${milestone}`,
      label: `${milestone} modules complete`,
      ringText: "MODULES COMPLETE",
      stamp: "COMPLETE",
      theme: "red",
    };
  });
}
