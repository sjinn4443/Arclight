import { bumpRefresh } from "./telemetry.js";

async function fetchUsers() {
  const res = await fetch("/api/dev/users", { credentials: "same-origin" });
  if (res.status === 401)
    throw new Error("401 unauthorised — enter the dev password");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function renderUsers(users) {
  const sorted = [...users].sort(
    (a, b) => new Date(a.first_seen) - new Date(b.first_seen),
  );
  const tbody = document.querySelector("#users tbody");
  const status = document.getElementById("status");
  tbody.innerHTML = sorted
    .map(
      (u, i) => `
    <tr>
      <td>${i + 1}</td>
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
    renderUsers(await fetchUsers());
  } catch (err) {
    console.error(err);
    status.textContent = err.message;
  }
}

document.getElementById("refreshBtn").addEventListener("click", load);

// Optional: keep counting dashboard visits
bumpRefresh().catch(() => {});

load();

// Listen for location updates and refresh the dashboard
document.addEventListener("location:updated", load);
