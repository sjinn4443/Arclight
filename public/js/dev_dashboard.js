import { bumpRefresh } from "./telemetry.js";
import { fetchDictionary, get } from "./i18n.js";

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
  englishDict = await fetchDictionary("en");
}

function renderUsers(users) {
  const sorted = [...users].sort(
    (a, b) => new Date(a.first_seen) - new Date(b.first_seen),
  );

  // Overlay: if this browser's anon_id is present in the list,
  // prefer the language from localStorage so dashboard reflects changes instantly.
  const me = sorted.find((u) => u.anon_id && u.anon_id === getLocalAnonId());
  if (me) {
    const localLang = getLocalPrefLang();
    if (localLang && localLang !== (me.language || "en")) {
      me.language = localLang;
    }
  }

  const tbody = document.querySelector("#users tbody");
  const status = document.getElementById("status");
  tbody.innerHTML = sorted
    .map(
      (u, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${u.name || "—"}</td>
      <td data-i18n="${u.aims || ""}">${get(englishDict, u.aims || "") || u.aims || "—"}</td>
      <td data-i18n="${u.interest || ""}">${get(englishDict, u.interest || "") || u.interest || "—"}</td>
      <td data-i18n="${u.experience || ""}">${get(englishDict, u.experience || "") || u.experience || "—"}</td>
      <td>${u.contact || "—"}</td>
      <td>${u.country || "—"}</td>
      <td>${u.area || "—"}</td>
      <td>${u.language || "—"}</td>
      <td>${typeof u.refresh_count === "number" ? u.refresh_count : 0}</td>
    </tr>
  `,
    )
    .join("");
  status.textContent = `Loaded ${sorted.length} row${sorted.length === 1 ? "" : "s"}`;
}

async function load() {
  const status = document.getElementById("status");
  try {
    renderUsers(await fetchUsers());
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
