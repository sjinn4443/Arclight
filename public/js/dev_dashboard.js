import { bumpRefresh } from "./telemetry.js";
import {
  fetchDictionary,
  get,
  applyTranslations,
  setLanguage,
} from "./i18n.js";

// 모든 언어 라벨 -> i18n 키 역인덱스
const REVERSE = new Map();

// 번역 파일 평탄화: { "a.b.c": "Label", ... }
function flat(obj, p = "", out = {}) {
  for (const [k, v] of Object.entries(obj || {})) {
    const path = p ? `${p}.${k}` : k;
    if (v && typeof v === "object") flat(v, path, out);
    else out[path] = v;
  }
  return out;
}

// 지원 언어 목록(필요한 것만 넣어도 됩니다)
const LANGS = [
  "en",
  "am",
  "ar",
  "bn",
  "ny",
  "zh",
  "fr",
  "ha",
  "hi",
  "ig",
  "id",
  "rw",
  "ko",
  "ln",
  "fa",
  "pt",
  "sn",
  "es",
  "sw",
  "ur",
  "yo",
  "zu",
];

// 한 번만: 모든 언어 사전을 읽어 역인덱스 구축
async function buildReverseIndex() {
  const dicts = await Promise.all(LANGS.map((l) => fetchDictionary(l)));
  dicts.forEach((dict) => {
    const f = flat(dict);
    for (const [key, label] of Object.entries(f)) {
      if (label) {
        const s = String(label).trim();
        if (s && !REVERSE.has(s)) REVERSE.set(s, key);
      }
    }
  });
}

// 어떤 값이 와도 영어로 바꿔주는 함수
function englishFromAny(value, englishDict) {
  if (!value) return "—";
  // 1) 키로 바로 시도
  const fromKey = get(englishDict, value);
  if (fromKey != null) return fromKey;
  // 2) 라벨(예: '복습 연습')이면 역인덱스로 키 찾기 → 영어
  const key = REVERSE.get(String(value).trim());
  if (key) {
    const en = get(englishDict, key);
    if (en != null) return en;
  }
  // 3) 실패 시 원문 유지
  return value;
}

function getLocalAnonId() {
  const KEY = "arclight_anon_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    // same algo as telemetry.js
    id = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16),
    );
    localStorage.setItem(KEY, id);
  }
  return id;
}

function getLocalPrefLang() {
  return localStorage.getItem("prefLang") || "en";
}

async function fetchUsers() {
  const res = await fetch("/api/dev/users", { credentials: "same-origin" });
  if (res.status === 401)
    throw new Error("401 unauthorised — enter the dev password");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

let englishDict = {};

async function loadEnglishDictionary() {
  // Force the language to English for the dev dashboard
  await setLanguage("en");
  englishDict = await fetchDictionary("en");
  // 영어만 로딩하고 끝내지 말고, 역인덱스도 구축
  await buildReverseIndex();
  // 정적 UI 번역
  applyTranslations(document.body);
}

async function renderUsers(users) {
  const sorted = [...users].sort(
    (a, b) => new Date(a.first_seen) - new Date(b.first_seen),
  );

  // Prefer the browser's local language for "me" so you see changes instantly
  const me = sorted.find((u) => u.anon_id && u.anon_id === getLocalAnonId());
  if (me) {
    const localLang = getLocalPrefLang();
    if (localLang && localLang !== (me.language || "en")) {
      me.language = localLang;
    }
  }

  const rows = [];
  for (let i = 0; i < sorted.length; i++) {
    const u = sorted[i];

    const aimsEn = englishFromAny(u.aims, englishDict);
    const interestEn = englishFromAny(u.interest, englishDict);
    const expEn = englishFromAny(u.experience, englishDict);

    rows.push(`
      <tr>
        <td>${i + 1}</td>
        <td>${u.name || "—"}</td>
        <td>${aimsEn}</td>
        <td>${interestEn}</td>
        <td>${expEn}</td>
        <td>${u.contact || "—"}</td>
        <td>${u.country || "—"}</td>
        <td>${u.area || "—"}</td>
        <td>${u.language || "—"}</td>
        <td>${typeof u.refresh_count === "number" ? u.refresh_count : 0}</td>
      </tr>
    `);
  }

  const tbody = document.querySelector("#users tbody");
  const status = document.getElementById("status");
  tbody.innerHTML = rows.join("");
  status.textContent = `Loaded ${sorted.length} row${sorted.length === 1 ? "" : "s"}`;
}

async function load() {
  const status = document.getElementById("status");
  try {
    await renderUsers(await fetchUsers());
  } catch (err) {
    console.error(err);
    status.textContent = err.message;
  }
}

document.getElementById("refreshBtn").addEventListener("click", load);

// Optional: keep counting dashboard visits
bumpRefresh().catch(() => {});

(async () => {
  await loadEnglishDictionary();
  load();
})();

// Listen for location updates and refresh the dashboard
document.addEventListener("location:updated", () => {
  // Add a small delay to allow backend to process location update before refetching
  setTimeout(load, 500); // 500ms delay
});

// Add this to refresh as soon as the telemetry POST completes
document.addEventListener("telemetry:refreshed", () => {
  load();
});

document.addEventListener("language:updated", () => {
  // Give the backend a moment to write before refetching
  setTimeout(load, 500);
});
