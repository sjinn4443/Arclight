import { saveProfile, bumpRefresh } from "./telemetry.js";

async function fetchUsers() {
  const res = await fetch("/api/dev/users", { credentials: "same-origin" });
  if (res.status === 401) {
    throw new Error("401 unauthorised — enter the dev password");
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

function renderUsers(users) {
  // sort by first_seen ascending to make No. = join order; change to your taste
  const sorted = [...users].sort(
    (a, b) => new Date(a.first_seen) - new Date(b.first_seen),
  );
  const tbody = document.querySelector("#users tbody");
  const status = document.getElementById("status");

  tbody.innerHTML = sorted
    .map(
      (u, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${u.name || "—"}</td>
      <td>${u.aims || "—"}</td>
      <td>${u.interest || "—"}</td>
      <td>${u.experience || "—"}</td>
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
    const data = await fetchUsers();
    renderUsers(data);
  } catch (err) {
    console.error(err);
    status.textContent = err.message;
  }
}

document.getElementById("refreshBtn").addEventListener("click", load);

document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const fields = Object.fromEntries(fd.entries()); // includes 'language' now
  await saveProfile(fields);
  await load();
  e.currentTarget.reset();
});

// optional: increment refresh count each time the app loads
document.querySelector('input[name="language"]').value = (
  navigator.language || "en"
).slice(0, 2);
bumpRefresh(); // Call bumpRefresh on app startup

load();
